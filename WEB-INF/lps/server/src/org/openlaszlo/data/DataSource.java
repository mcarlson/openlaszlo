/****************************************************************************
 * DataSource.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data;

import java.io.*;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.StringTokenizer;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.httpclient.URI;
import org.apache.commons.httpclient.URIException;
import org.apache.log4j.Logger;
import org.openlaszlo.utils.LZHttpUtils;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.media.MimeType;

/**
 * Base class for server side LZX data/media sources.
 */
abstract public class DataSource
{
    private static Logger mLogger  = Logger.getLogger(DataSource.class);

    /**
     * Get unique name of this data source.
     *
     * @return unique name of this data source.
     */
    public abstract String name();

    /**
     * Get the data for this request.
     *
     * @return the data for this request.
     * @param app absolute pathnane to app file.
     * @param req request in progress.
     * @param res response object.
     * @param lastModifiedTime this is the timestamp on the currently cached
     * item; this time can be used as the datasource sees fit (or ignored) in
     * constructing the results.  If the value is -1, assume there is no
     * currently cached item.
     *
     * @throws DataSourceException if there was a problem with the data source.
     * @throws IOException if there was a problem retrieving the data.
     * @throws InterrupedIOException if there was a timeout retrieving the data.
     */
    public abstract Data getData(String app, HttpServletRequest req, 
                                 HttpServletResponse res, long lastModifiedTime)
        throws InterruptedIOException, IOException, DataSourceException;


    /**
     * Determine the datasource from the incoming request,
     * get the data, convert it to SWF, and write it out
     * to the given response.
     *
     * @param app absolute path name to app requesting data
     * @param req request
     * @param res response
     * @param converter converter to use
     * @throws DataSourceException if the data source encounters an error
     * @throws ConversionException if the conversion to SWF returns an error
     * @throws IOException if there is an IO error
     */
    final public void getAsSWF(
            String app,
            HttpServletRequest req, 
            HttpServletResponse res, 
            Converter converter) 
        throws DataSourceException, ConversionException, IOException {

        Data data = null;
        InputStream input = null;
        OutputStream output = null;
        long size = -1;
        long since = -1;

        // Check to see if client side caching is on
        boolean doClientCache = isClientCacheable(req);
        if (doClientCache) {
            String hdr = req.getHeader(LZHttpUtils.IF_MODIFIED_SINCE);
            if (hdr != null) {
               mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="req last modified time: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-96", new Object[] {hdr})
);
               since = LZHttpUtils.getDate(hdr);
            }
        }

        mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="requesting URL: '" + p[0] + "'"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-108", new Object[] {DataSource.getURL(req)})
);
        try {
            data = getData(app, req, res, since);
    
            if (data.notModified()) {
                mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="NOT_MODIFIED"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-120")
);
                res.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
                return;
            }

            mLogger.debug("got data");

            if (!data.getMimeType().equals(MimeType.SWF)) {

                input = converter.convertToSWF(data, req, res);
                size = input.available();
                mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="converted to " + p[0] + " bytes of SWF"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-138", new Object[] {new Long(size)})
);
                // FIXME: [2003-09-22 bloch] input.available not realiable

                String enc = converter.chooseEncoding(req);
                if (enc != null && !enc.equals("")) {
                    input = converter.encode(req, input, enc);
                    res.setHeader(LZHttpUtils.CONTENT_ENCODING, enc);
                    size = input.available();
                } 

            } else {
                mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="remote content was SWF"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-156")
);
                input = data.getInputStream();
                size = data.size();
            }

            if (size != -1) {
                mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="setting content length: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-169", new Object[] {new Long(size)})
);
                //res.setContentLength((int)size);
            }

            if (doClientCache) {
                long t = data.lastModified();
                if (t != -1) {
                    res.setDateHeader(LZHttpUtils.LAST_MODIFIED, t);
                }
            } else {
                LZHttpUtils.noStore(res);
            }

            try {
                output = res.getOutputStream();
                long n = FileUtils.sendToStream(input, output);
                mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + " bytes sent"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-192", new Object[] {new Long(n)})
);
            } catch (FileUtils.StreamWritingException e) {
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="StreamWritingException while responding: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-201", new Object[] {e.getMessage()})
                                );
            }

        } finally {
            if (data != null) {
                data.release();
            }
            FileUtils.close(output);
            FileUtils.close(input);
        } 
    }

    /**
     * Determine the datasource from the incoming request,
     * get the data, and write it out
     * to the given response.
     *
     * @param app pathname to app on disk
     * @param req http request
     * @param res http response
     * @throws DataSourceException if the data source encounters an error
     * @throws IOException if there is an IO error
     */
    final public void get(
            String app,
            HttpServletRequest req, 
            HttpServletResponse res)
        throws DataSourceException, IOException {

        Data data = null;
        InputStream input = null;
        OutputStream output = null;
        long size = -1;

        mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="requesting URL: '" + p[0] + "'"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-241", new Object[] {DataSource.getURL(req)})
);

        try {

            data = getData(app, req, res, -1);
    
            input = data.getInputStream();
            // FIXME: [2003-04-26 bloch] Reenable content-length header at some point.
            // Client will sometimes bail in this situation:
            // 1) set content length and bit client interrupts/closes socket before
            // all content comes down.
            // 2) next time the urls is hit, the client requests, server responds,
            // but nothing shows in the browser.  This seems to happen only
            // when the content is coming from 
            // size = data.size();
            size = -1;

            if (size != -1) {
                mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="setting content length: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-266", new Object[] {new Long(size)})
);
                res.setContentLength((int)size);
            }

            // Hopefully back end tells the truth
            res.setContentType(data.getMimeType());

            output = res.getOutputStream();
            long n = FileUtils.send(input, output);
            mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + " bytes sent"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-282", new Object[] {new Long(n)})
);

        } finally {
            if (data != null) {
                data.release();
            }
            FileUtils.close(output);
            FileUtils.close(input);
        } 
    }


    /**
     * Return true if the request is marked cacheable on the client
     */
    final static public boolean isClientCacheable(HttpServletRequest req) {
        String str = req.getParameter("ccache");
        return (str != null && str.equals("true"));
    }


    /**
     * Get the actual URL for this request.
     *
     * @param req servlet request object.
     * @param url the url string received from the client. Can contain
     * "@WEBAPP@" string.
     * @return the 'URL' for the request.
     */
    final static public String getURL(HttpServletRequest req, String surl) 
        throws MalformedURLException {
        // "file:" is no longer supported, it is a security hole, make it into
        // an "http" URL which points to the designated file.
        if (surl.startsWith("file:")) {
            String protocol = (req.isSecure()?"https":"http");
            String host = req.getServerName();
            int port = req.getServerPort();
            String cp = req.getContextPath();

            // go past the "file:" prefix
            String fpath = surl.substring(5);
            String uri = req.getRequestURI();
            int floc = uri.lastIndexOf("/");

            // for original url of "file:foo.xml, this constructs
            // http://host:protocol/servlet-path/app-path/foo.xml
            surl = protocol + "://" + host + ":" + port 
                +  uri.substring(0,floc) + "/" + fpath;
        }

        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="'url' is " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-339", new Object[] {surl})
);
        return LZHttpUtils.modifyWEBAPP(req, surl);
    }

    /**
     * Get the URL query paramter for this request.
     *
     * @param req servlet request object to retrieve URL parameter.
     * @return the 'URL' for the request.
     * @throws MalformedURLException if the url parameter is missing from the request.
     */
    static public String getURL(HttpServletRequest req) throws 
        MalformedURLException {

        String surl = req.getParameter("url");
        if (surl == null) {
            throw new MalformedURLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="'url' parameter missing from request"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-362")
);
        }

        return getURL(req, surl);
    }


    /**
     * Utility function to get a hash map of query parameters from 
     * an url string.
     *
     * @param url string containing an URL to parse query parameters.
     * @return hash map of query parameters, or an empty hash map if no query
     * parameters exist.
     */
    final static public HashMap getQueryString(String url) 
    {
        HashMap map = new HashMap();
        try {
            URI uri = new URI(url.toCharArray());
            String query = uri.getQuery();
            if (query != null) {
                StringTokenizer st = new StringTokenizer(query, "&");
                while (st.hasMoreTokens()) {
                    String param = st.nextToken();
                    int i = param.indexOf("=");
                    if (i != -1) {
                        String k = param.substring(0, i);
                        String v = param.substring(i+1, param.length());
                        map.put(k, v);
                    }
                }
            }
        } catch (URIException e) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="URIException: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                DataSource.class.getName(),"051018-403", new Object[] {e.getMessage()})
);
        } 
        return map;
    }
}
