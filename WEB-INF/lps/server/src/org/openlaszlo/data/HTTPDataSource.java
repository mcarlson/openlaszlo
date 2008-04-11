/* *****************************************************************************
 * HTTPDataSource.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data;

import java.util.Enumeration;
import java.util.Hashtable;
import java.util.StringTokenizer;
import java.net.URL;
import java.net.URLDecoder;
import java.net.MalformedURLException;
import java.net.UnknownHostException;
import java.io.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;
import org.apache.commons.httpclient.util.*;
import org.apache.log4j.*;

import org.openlaszlo.xml.internal.XMLUtils;
import org.openlaszlo.utils.LZHttpUtils;
import org.openlaszlo.utils.LZGetMethod;
import org.openlaszlo.utils.LZPostMethod;
import org.openlaszlo.utils.LZPutMethod;
import org.openlaszlo.utils.LZDeleteMethod;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.server.LPS;
import org.apache.oro.text.regex.*;


/**
 * HTTP Transport
 */
public class HTTPDataSource extends DataSource {
    
    private static Logger mLogger  = Logger.getLogger(HTTPDataSource.class);

    /** Connection Manager */
    private static MultiThreadedHttpConnectionManager 
        mConnectionMgr = null;

    /** max number of http retries */
    private static int mMaxRetries = 1;

    /** Whether or not to use the http11 . */
    private static boolean mUseHttp11 = true;

    /** Connection timeout millis (0 means default) */
    private static int mConnectionTimeout = 0;

    /** Timeout millis (0 means infinity) */
    private static int mTimeout = 0;

    /** Connection pool timeout in millis (0 means infinity) */
    private static int mConnectionPoolTimeout = 0;

    /** Max total connections. */
    private static int mMaxTotalConnections = 1000;

    /** Max connections per host. */
    private static int mMaxConnectionsPerHost = mMaxTotalConnections;

    /** Number of backend redirects we allow (potential security hole) */
    private static int mFollowRedirects = 0;

    {
        String useMultiThreadedConnectionMgr = LPS.getProperty("http.useConnectionPool", "true");

        if (Boolean.valueOf(useMultiThreadedConnectionMgr).booleanValue()) {
            mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="using connection pool"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-81")
);
            mConnectionMgr = new MultiThreadedHttpConnectionManager();
        } else {
            mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="not using connection pool"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-91")
);
        }
    
        // Parse multi connection properties anyway. May be used by AXIS. See
        // ResponderCache for details.
        {
            String maxConns = LPS.getProperty("http.maxConns", "1000");
            mMaxTotalConnections = Integer.parseInt(maxConns);
            if (mConnectionMgr != null) {
                mConnectionMgr.setMaxTotalConnections(mMaxTotalConnections);
            }
    
            maxConns = LPS.getProperty("http.maxConnsPerHost", maxConns);
            mMaxConnectionsPerHost = Integer.parseInt(maxConns);
            if (mConnectionMgr != null) {
                mConnectionMgr.setMaxConnectionsPerHost(mMaxConnectionsPerHost);
            }
        }

        String maxRetries = LPS.getProperty("http.maxBackendRetries", "1");
        mMaxRetries = Integer.parseInt(maxRetries);

        String followRedirects = LPS.getProperty("http.followRedirects", "0");
        mFollowRedirects = Integer.parseInt(followRedirects);

        String timeout = LPS.getProperty("http.backendTimeout", "30000");
        mTimeout = Integer.parseInt(timeout);

        timeout = LPS.getProperty("http.backendConnectionTimeout", timeout);
        mConnectionTimeout = Integer.parseInt(timeout);

        timeout = LPS.getProperty("http.connectionPoolTimeout", "0");
        mConnectionPoolTimeout = Integer.parseInt(timeout);

        String useHttp11 = LPS.getProperty("http.useHttp11", "true");
        mUseHttp11 = Boolean.valueOf(useHttp11).booleanValue();
        if (mUseHttp11) {
            mLogger.info("using HTTP 1.1");
        } else {
            mLogger.info("not using HTTP 1.1");
        }
    }


    /**
     * @return name of this datasource
     */
    public String name() {
        return "http";
    }

    /**
     * Do an HTTP Get/Post based on this request
     * 
     * @return the data from this request
     * @param app absolute pathnane to app file
     * @param req request in progress (possibly null)
     * @param since this is the timestamp on the
     * currently cached item; this time can be used as the datasource
     * sees fit (or ignored) in constructing the results.  If 
     * the value is -1, assume there is no currently cached item.
     */
    public Data getData(String app, HttpServletRequest req, HttpServletResponse res, long since) 
        throws DataSourceException, IOException {
        return getHTTPData(req, res, getURL(req), since);
    }

    public static Data getHTTPData(HttpServletRequest req, HttpServletResponse res, 
                                   String surl, long since) 
        throws DataSourceException, IOException {

        int tries = 1;

        // timeout msecs of time we're allowed in this routine
        // we must return or throw an exception.  0 means infinite.
        int timeout = mTimeout;
        if (req != null) {
            String timeoutParm = req.getParameter("timeout");
            if (timeoutParm != null) {
                timeout = Integer.parseInt(timeoutParm);
            }
        }

        long t1 = System.currentTimeMillis();
        long elapsed = 0;
        if (surl == null) {
            surl = getURL(req);
        }

        while(true) {
            String m = null;

            long tout;
            if (timeout > 0) {
                tout =  timeout - elapsed;
                if (tout <= 0) {
                    throw new InterruptedIOException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + " timed out"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-194", new Object[] {surl})
);
                }
            } else {
                tout = 0;
            }

            try {
                HttpData data = getDataOnce(req, res, since, surl, 0, (int)tout);
                if (data.code >= 400) {
                    data.release();
                    throw new DataSourceException(errorMessage(data.code));
                }
                return data;
            } catch (HttpRecoverableException e) {
                // This type of exception should be retried.
                if (tries++ > mMaxRetries) {
                    throw new InterruptedIOException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="too many retries, exception: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-217", new Object[] {e.getMessage()})
);
                }
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="retrying a recoverable exception: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-226", new Object[] {e.getMessage()})
);
            } catch (HttpException e) {
                String msg = 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="HttpException: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-235", new Object[] {e.getMessage()})
;
                throw new IOException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="HttpException: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-235", new Object[] {e.getMessage()})
);
            } catch (IOException e) {

                try {
                    Class ssle = Class.forName("javax.net.ssl.SSLException");
                    if (ssle.isAssignableFrom(e.getClass())) {
                        throw new DataSourceException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="SSL exception: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-256", new Object[] {e.getMessage()})
                                );
                    }
                } catch (ClassNotFoundException cfne) {
                }

                throw e;
            }

            long t2 = System.currentTimeMillis();
            elapsed = (t2 - t1);
        }
    }

    /**
     * convenience routine missing from http library
     */
    static boolean isRedirect(int rc) {
        return (rc == HttpStatus.SC_MOVED_PERMANENTLY || 
                rc == HttpStatus.SC_MOVED_TEMPORARILY || 
                rc == HttpStatus.SC_SEE_OTHER || 
                rc == HttpStatus.SC_TEMPORARY_REDIRECT);
    }
    /**
     * @param since last modified time to use
     * @param req
     * @param url if null, ignored
     * @param redirCount number of redirs we've done
     */
    public static HttpData getDataOnce(HttpServletRequest req,
         HttpServletResponse res, long since, String surl,
         int redirCount, int timeout)
         throws IOException, HttpException, DataSourceException, MalformedURLException {

        HttpMethodBase request = null;
        HostConfiguration hcfg = new HostConfiguration();

        /*
          [todo hqm 2006-02-01] Anyone know why this code was here? It is setting
          the mime type to something which just confuses the DHTML parser.
          
          if (res != null) {
            res.setContentType("application/x-www-form-urlencoded;charset=UTF-8");
            }
        */

        try {

            // TODO: [2002-01-09 bloch] cope with cache-control
            // response headers (no-store, no-cache, must-revalidate, 
            // proxy-revalidate).
            
            if (surl == null) {
                surl = getURL(req);
            }
            if (surl == null || surl.equals("")) {
                throw new MalformedURLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="url is empty or null"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-312")
);
            }
    
            String reqType   = "";
            String headers   = "";

            if (req != null) {
                reqType   = req.getParameter("reqtype");
                headers   = req.getParameter("headers");
            }
    
            boolean isPost = false;
            mLogger.debug("reqtype = "+reqType);
    
            if (reqType != null && reqType.equals("POST")) {
                request = new LZPostMethod();
                request.setRequestHeader("Content-Type",
                                         "application/x-www-form-urlencoded;charset=UTF-8");
                isPost = true;
                mLogger.debug("setting POST req method");
            } else if (reqType != null && reqType.equals("PUT")) {
                request = new LZPutMethod();
                // todo [hqm 2007] treat PUT like POST? 
                isPost = true;
                mLogger.debug("setting PUT req method");
            } else if (reqType != null && reqType.equals("DELETE")) {
                request = new LZDeleteMethod();
                mLogger.debug("setting DELETE req method");
            } else {
                mLogger.debug("setting GET (default) req method");
                request = new LZGetMethod();
            }


            request.setHttp11(mUseHttp11);

            // Proxy the request headers
            if (req != null) {
                LZHttpUtils.proxyRequestHeaders(req, request);
            }
    
            // Set headers from query string
            if (headers != null && headers.length() > 0) {
                StringTokenizer st = new StringTokenizer(headers, "\n");
                while (st.hasMoreTokens()) {
                    String h = st.nextToken();
                    int i = h.indexOf(":");
                    if (i > -1) {
                        String n = h.substring(0, i);
                        String v = h.substring(i + 2, h.length());
                        request.setRequestHeader( n , v );
                        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="setting header " + p[0] + "=" + p[1]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-359", new Object[] {n, v})
);
                    }
                }
            }
    
            mLogger.debug("Parsing url");
            URI uri = LZHttpUtils.newURI(surl);
            try {
                hcfg.setHost(uri);
            } catch (Exception e) {
                throw new MalformedURLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="can't form uri from " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-376", new Object[] {surl})
); 
            }
    
            // This gets us the url-encoded (escaped) path and query string
            String path = uri.getEscapedPath();
            String query = uri.getEscapedQuery();
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="encoded path:  " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-389", new Object[] {path})
);
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="encoded query: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-397", new Object[] {query})
);
    
            // This call takes a decoded (unescaped) path
            request.setPath(path);
    
            boolean hasQuery = (query != null && query.length() > 0);
    
            String rawcontent = null; 
            // Newer rawpost protocol puts lzpostbody as a separate
            // top level query arg in the request.
            rawcontent = req.getParameter("lzpostbody");

             if (isPost) {
                    // Older rawpost protocol put the "lzpostbody" arg
                    // embedded in the "url" args's query args
                    if (rawcontent == null && hasQuery) {
                        rawcontent = findQueryArg ("lzpostbody", query);
                    }
                    if (rawcontent != null) {
                        // Get the unescaped query string
                        ((EntityEnclosingMethod)request).setRequestBody(rawcontent);
                    } else if (hasQuery) {
                        StringTokenizer st = new StringTokenizer(query, "&");
                        while (st.hasMoreTokens()) {
                            String it = st.nextToken();
                            int i = it.indexOf("=");
                            if (i > 0) {
                                String n = it.substring(0, i);
                                String v = it.substring(i + 1, it.length());
                                // POST encodes values during request
                                ((PostMethod)request).addParameter(n, URLDecoder.decode(v, "UTF-8"));
                            } else {
                                mLogger.warn(
                                    /* (non-Javadoc)
                                     * @i18n.test
                                     * @org-mes="ignoring bad token (missing '=' char) in query string: " + p[0]
                                     */
                                    org.openlaszlo.i18n.LaszloMessages.getMessage(
                                        HTTPDataSource.class.getName(),"051018-429", new Object[] {it})
                                             );
                            }
                        }
                }
            } else {   
                // This call takes an encoded (escaped) query string
                request.setQueryString(query);
            }
    
            // Put in the If-Modified-Since headers
            if (since != -1) {
                String lms = LZHttpUtils.getDateString(since);
                request.setRequestHeader(LZHttpUtils.IF_MODIFIED_SINCE, lms); 
                mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="proxying lms: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-450", new Object[] {lms})
);
            }
                
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="setting up http client"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-460")
);
            HttpClient htc = null;
            if (mConnectionMgr != null) {
                htc = new HttpClient(mConnectionMgr);
            } else {
                htc = new HttpClient();
            }

            htc.setHostConfiguration(hcfg);
    
            // This is the data timeout
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="timeout set to " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-478", new Object[] {new Integer(timeout)})
);
            htc.setTimeout(timeout);
    
            // Set connection timeout the same
            htc.setConnectionTimeout(mConnectionTimeout);
    
            // Set timeout for getting a connection
            htc.setHttpConnectionFactoryTimeout(mConnectionPoolTimeout);
    
            // TODO: [2003-03-05 bloch] this should be more configurable (per app?)
            if (!isPost) {
                request.setFollowRedirects(mFollowRedirects > 0);
            }
    
            long t1 = System.currentTimeMillis();
            mLogger.debug("starting remote request");
            int rc = htc.executeMethod(hcfg, request);
            String status = HttpStatus.getStatusText(rc);
            if (status == null) {
                status = "" + rc;
            }
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="remote response status: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-504", new Object[] {status})
);
    
            HttpData data = null;
            if ( isRedirect(rc) && mFollowRedirects > redirCount ) {
                String loc = request.getResponseHeader("Location").toString();
                String hostURI = loc.substring(loc.indexOf(": ") + 2, loc.length() ) ;
                mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Following URL from redirect: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-517", new Object[] {hostURI})
);
                long t2 = System.currentTimeMillis();
                if (timeout > 0) {
                    timeout -= (t2 - t1);
                    if (timeout < 0) {
                        throw new InterruptedIOException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + " timed out after redirecting to " + p[1]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-529", new Object[] {surl, loc})
);
                    }
                }

                data = getDataOnce(req, res, since, hostURI, redirCount++, timeout);
            } else {
                data = new HttpData(request, rc);
            }

            if (req != null && res != null) {
                // proxy response headers
                LZHttpUtils.proxyResponseHeaders(request, res, req.isSecure());
            }

            return data;

        } catch (ConnectTimeoutException ce) {
            // Transduce to an InterrupedIOException, since lps takes these to be timeouts.
            if (request != null) {
                request.releaseConnection();
            }
            throw new InterruptedIOException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="connecting to " + p[0] + ":" + p[1] + " timed out beyond " + p[2] + " msecs."
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-557", new Object[] {hcfg.getHost(), new Integer(hcfg.getPort()), new Integer(mConnectionTimeout)})
            );
        } catch (HttpRecoverableException hre) {
            if (request != null) {
                request.releaseConnection();
            }
            throw hre;
        } catch (HttpException e) {
            if (request != null) {
                request.releaseConnection();
            }
            throw e;
        } catch (IOException ie) {
            if (request != null) {
                request.releaseConnection();
            }
            throw ie;
        } catch (RuntimeException e) {
           if (request != null) {
               request.releaseConnection();
           }
           throw e;
        }
    }
    
    /**
     * utility
     */
    private static String errorMessage(int code) {
        return 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="HTTP Status code: " + p[0] + ":" + p[1]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-592", new Object[] {new Integer(code), HttpStatus.getStatusText(code)});
    }



    public static int getConnectionPoolTimeout() {
        return mConnectionPoolTimeout;
    }

    public static int getMaxTotalConnections() {
        return mMaxTotalConnections;
    }

    public static int getMaxConnectionsPerHost() {
        return mMaxConnectionsPerHost;
    }

    // Extract a urlencoded query arg value
    static String findQueryArg (String argname, String query) throws UnsupportedEncodingException {
        StringTokenizer st = new StringTokenizer(query, "&");
        while (st.hasMoreTokens()) {
            String it = st.nextToken();
            int i = it.indexOf("=");
            if (i > 0) {
                String n = it.substring(0, i);
                String v = it.substring(i + 1, it.length());
                if (argname.equals(n)) {
                    return URLDecoder.decode(v, "UTF-8");
                }
            }
        }
        return null;
    }

    public static void main(String args[]) {

        HTTPDataSource ds = new HTTPDataSource();

        try {
            if (args.length != 1 && args.length != 2) {
                throw new Exception(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Need an url"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                HTTPDataSource.class.getName(),"051018-828")
); 
            }
            String surl = args[0];
            FileOutputStream out = null;
            if (args.length == 2) {
                out = new FileOutputStream(args[1]);
            }
            System.out.println("url is " + surl);

            HttpData data = ds.getDataOnce(null, null, -1, surl, 0, 0);

            System.out.println("Response code: " + data.code);

            if (out != null) {
                FileUtils.send(data.getInputStream(), out);
            }

            data.release();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



}
