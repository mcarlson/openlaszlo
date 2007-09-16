/******************************************************************************
 * ResponderXMLDATA.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.servlets.responders;

import java.io.*;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpUtils;
import org.apache.commons.httpclient.URI;
import org.apache.commons.httpclient.URIException;
import org.openlaszlo.cache.RequestCache;
import org.openlaszlo.cache.XMLDataCache;
import org.openlaszlo.compiler.Canvas;
import org.openlaszlo.compiler.CompilationError;
import org.openlaszlo.data.*;
import org.openlaszlo.media.MimeType;
import org.openlaszlo.server.LPS;
import org.openlaszlo.servlets.LoadCount;
import org.openlaszlo.utils.ChainedException;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.utils.LZHttpUtils;
import org.openlaszlo.utils.SWFUtils;
import org.openlaszlo.xml.internal.DataCompiler;
import org.openlaszlo.xml.internal.XMLUtils;

import org.apache.log4j.Logger;


/**
 * Cache HTTP XML data requests as XML source
 */
public final class ResponderXMLDATA extends ResponderCache
{
    private static XMLDataCache mCache = null;
    private static boolean mIsInitialized = false;
    private static Logger mLogger = Logger.getLogger(ResponderXMLDATA.class);

    synchronized public void init(String reqName, ServletConfig config, Properties prop)
        throws ServletException, IOException
    {
        // Cache should only be initialized once.
        if (! mIsInitialized) {
            // Initialize data cache
            String cacheDir = config.getInitParameter("lps.dxcache.directory");
            if (cacheDir == null) {
                cacheDir = prop.getProperty("dxcache.directory");
            }
            if (cacheDir == null) {
                cacheDir = LPS.getWorkDirectory() + File.separator + "dxcache";
            }

            File cache = checkDirectory(cacheDir);
            mLogger.info("Data Cache is at " + cacheDir);

            //------------------------------------------------------------
            // Support for new style data response
            //------------------------------------------------------------
            try {
                mCache = new XMLDataCache(cache, prop);
            } catch (IOException e) {
                throw new ServletException(e.getMessage());
            }

            mIsInitialized = true;
        }
        super.init(reqName, config, mCache, prop);
    }

    static public RequestCache getCache() {
        return mCache;
    }

    protected void respondImpl(HttpServletRequest req, HttpServletResponse res) {

        String path = req.getServletPath();
        String url;
        try {
            url  = DataSource.getURL(req);
        } catch (java.net.MalformedURLException e) {
            respondWithError(res, "bad url: " + e.getMessage(), MIME_TYPE_XML);
            if (mCollectStat) {
                mURLStat.error(URLStat.ERRTYPE_MALFORMED_URL, "bad-url");
            }
            return;
        }

        res.setContentType("application/xml");


        if (req.getMethod().intern() == "POST") {
            float fpv = getFlashPlayerVersion(req);
            String ua = req.getHeader(LZHttpUtils.USER_AGENT);
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="POST request, flash player version: " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-328", new Object[] {new Float(fpv)})
);
            if (fpv < 6.47 && 
                LPS.configuration.optionAllows("disable-post-keep-alive", ua)) {
                // Prevent browser keep-alive to get around bug 4048.
                mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Disabling keep-alive for " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-339", new Object[] {ua})
);
                res.setHeader("Connection", "close");
                res.setHeader("Keep-Alive", "close");
            }
        }

        if ( ! LPS.configuration.optionAllows(path, "proxy-security-urls", url) ) {
            String err = "Forbidden url: " +  url;
            respondWithError(res, err, MIME_TYPE_XML);
            mLogger.error(err);
            if (mCollectStat) {
                mURLStat.error(URLStat.ERRTYPE_FORBIDDEN, url);
            }
            return;
        }

        int errType = URLStat.ERRTYPE_NONE;

        try { 

            DataSource source = getDataSource(req, res);
            if (source == null) {
                return;
            }

            res.setContentType("application/xml");

            String app = LZHttpUtils.getRealPath(mContext, req);
            boolean isClientCacheable = DataSource.isClientCacheable(req);
            if (mCache.isCacheable(req)) {
                if (isClientCacheable) {
                    mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="proxying " + p[0] + ", cacheable on server and client"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-377", new Object[] {url})
);
                } else {
                    mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="proxying " + p[0] + ", cacheable on server and not client"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-386", new Object[] {url})
);
                }
                mCache.getAsSWF(app, req, res, source);
            } else {
                if (isClientCacheable) {
                    mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="proxying " + p[0] + ", not cacheable on server and cacheable on the client"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-398", new Object[] {url})
);
                } else {
                    mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="proxying " + p[0] + ", not cacheable on server or client"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-407", new Object[] {url})
);
                }
                source.getAsSWF(app, req, res, getConverter());
            }
        } catch (ConversionException e) {
            respondWithError(res, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="data conversion error for " + p[0] + ": " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-419", new Object[] {url, e.getMessage()})
                             ,
                             MIME_TYPE_XML);
            errType = URLStat.ERRTYPE_CONVERSION;
        } catch (DataSourceException e) {
                respondWithError(res, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="data source error for " + p[0] + ": " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-428", new Object[] {url, e.getMessage()})
                                 , MIME_TYPE_XML
                );
            errType = URLStat.ERRTYPE_DATA_SOURCE;
        } catch (UnknownHostException e) {
            respondWithError(res, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="unknown host for " + p[0] + ": " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-437", new Object[] {url, e.getMessage()})
                             ,MIME_TYPE_XML
                );
            errType = URLStat.ERRTYPE_UNKNOWN_HOST;
        } catch (URIException e) {
            respondWithError(res, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="bad url: " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-446", new Object[] {e.getMessage()})
                             ,MIME_TYPE_XML
);
            errType = URLStat.ERRTYPE_MALFORMED_URL;
        } catch (MalformedURLException e) {
            respondWithError(res, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="bad url: " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-446", new Object[] {e.getMessage()})
                             ,MIME_TYPE_XML);
            errType = URLStat.ERRTYPE_MALFORMED_URL;
        } catch (InterruptedIOException e) {
            respondWithError(res, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="backend timeout for " + p[0] + ": " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-466", new Object[] {url, e.getMessage()})
                             ,MIME_TYPE_XML
                             );
            errType = URLStat.ERRTYPE_TIMEOUT;
        } catch (IOException e) {
            // Handle SocketTimeoutExceptions as timeouts instead of IO issues
            Class stec = null;
            try {
                stec = Class.forName("java.net.SocketTimeoutException");
            } catch (ClassNotFoundException cfne) {
            }
            if (stec != null && stec.isAssignableFrom(e.getClass())) {
                errType = URLStat.ERRTYPE_TIMEOUT;
                respondWithError(res, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="backend timeout for " + p[0] + ": " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ResponderCache.class.getName(),"051018-466", new Object[] {url, e.getMessage()})
                             ,MIME_TYPE_XML
                );
            } else {
                respondWithException(res, e);
                errType = URLStat.ERRTYPE_IO;
            }
        } catch (IllegalArgumentException e) {
            respondWithException(res, e);
            errType = URLStat.ERRTYPE_ILLEGAL_ARGUMENT;
        } catch (Throwable e) { 
            // Makes much easier to debug runtime exceptions
            // but perhaps not strictly correct.
            respondWithException(res, e);
            errType = URLStat.ERRTYPE_OTHER;
        } 

        if (mCollectStat) {
            if (errType == URLStat.ERRTYPE_NONE)
                mURLStat.success(url);
            else 
                mURLStat.error(errType, url);
        }
    }


    public int getMimeType()
    {
        return MIME_TYPE_XMLDATA;
    }

}
