/******************************************************************************
 * LZServlet.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.servlets;

import java.io.*;
import java.net.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.ServletConfig.*;
import java.nio.charset.Charset;

import org.openlaszlo.servlets.responders.*;
import org.openlaszlo.server.*;
import org.openlaszlo.utils.ChainedException;
import org.openlaszlo.utils.LZUtils;
import org.openlaszlo.utils.LZHttpUtils;
import org.openlaszlo.utils.MathUtils;

import org.apache.log4j.*;

/**
 * LZServlet is the main entry point for the Laszlo Presentation Server
 *
 * The LZServlet will respond to GET (and POST) requests
 * per the spec at 
 * <a href="../../../../lps-servlet-spec.html">
 * $LPS_HOME/server/doc/lps-servlet-spec.html</a>
 *
 * Each request type (lzt query string variable) has
 * a Responder object that is used to construct a responder.
 *
 */
public class LZServlet extends HttpServlet 
{
    private static Logger mLogger = null;
    private File mLogFile = null;

    private final static String DEFAULT_REQUEST_TYPE = "defaultRequestType";
    private static String mDefaultRequestType = "html";

    private final static String CHARACTER_ENCODING = "characterEncoding";
    private static String mCharacterEncoding = "UTF-8";

    /** Responder object map */
    public static HashMap mResponderMap = new HashMap();

    /** Request counter */
    private int mRequestCounter = 1;

    /** LPS properties */
    private Properties mProperties = new Properties();

    /**
     * @return true if init succeeded
     * @param config ServletConfig object
     */
    public boolean initLPS(HttpServletRequest req, 
            HttpServletResponse res) {

        ServletConfig config = getServletConfig();
        ServletContext ctxt = config.getServletContext();
        String webappName = getServletContextName(ctxt);

        // Sanity check the servlet context version
        if ((ctxt.getMajorVersion() < 2)  ||
            (ctxt.getMajorVersion() == 2 && ctxt.getMinorVersion() < 3)) {
respondWithInitError(req, res,
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Must be at least " + "Version 2.3 Servlet Container!"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-80")
            );
            return false;
        }

        // Check for LPS_HOME
        String lhome = getInitParameter("LPS_HOME");
        if (lhome == null) {
            // Default to webapp
            lhome = LZHttpUtils.getRealPath(ctxt, "/");

            // FIXME: [2003-04-28 bloch] remove this code when
            // we fix bug 540.   Safety check for now
            if (lhome == null) {
respondWithInitError(req, res,
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="LPS requires a servlet container" + " that can implements ServletContent.getRealPath()"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-100")
                );
                return false;
            }
        }

        log("LPS_HOME is " + lhome);
        LPS.setHome(lhome);

        // Configure logging
        String lpsConfigDir = ConfigDir.get(lhome);
log(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="LPS config directory is: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-117", new Object[] {lpsConfigDir})
        );

        try {
            ResponderLOGCONFIG.configure(this);
        } catch (Exception e) {
            respondWithInitException(req, res, e);
            return false;
        }

        mLogger = Logger.getLogger(LZServlet.class);

        // TODO: 2004-09-08 bloch merge with code in LPS.getInfo()
        // Log some basic information
        {
            logInitInfo("------------------------------------");
logInitInfo(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Laszlo Presentation Server, " + p[0] + ", initialized"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-139", new Object[] {LPS.getVersion()})
            );
logInitInfo(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Running in context:" + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-147", new Object[] {ctxt.getServerInfo()})
            );
            logInitInfo("Build: " + LPS.getBuild());
            logInitInfo("Built on: " + LPS.getBuildDate());
            logInitInfo("Running against JRE " +
            LPS.getSystemPropertyOrUnknowable("java.version"));
            logInitInfo("Running with Java CLASSPATH: " +
            LPS.getSystemPropertyOrUnknowable("java.class.path"));
            logInitInfo("Running on " + LPS.getSystemPropertyOrUnknowable("os.name") + " " +
            LPS.getSystemPropertyOrUnknowable("os.version"));
            logInitInfo("Running as user " + LPS.getSystemPropertyOrUnknowable("user.name"));
            final double MEG = 1024*1024;
            final double mx = Runtime.getRuntime().maxMemory() / (MEG);
            final double total = Runtime.getRuntime().totalMemory() / (MEG);
            final double avail = Runtime.getRuntime().freeMemory() / (MEG);
logInitInfo(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Max memory: " + p[0] + " MB"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-168", new Object[] {MathUtils.formatDouble(mx, 2)})
            );
logInitInfo(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Total memory: " + p[0] + " MB"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-176", new Object[] {MathUtils.formatDouble(total, 2)})
            );
logInitInfo(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Available memory: " + p[0] + " MB"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-184", new Object[] {MathUtils.formatDouble(avail, 2)})
            );

mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="LPS_HOME is: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-193", new Object[] {lhome})
            );
        }

        // JRE version detection
        String jvmVersion = "unknown";
        try {
            jvmVersion = LPS.getSystemPropertyOrUnknowable("java.specification.version");
            int dot1Index = jvmVersion.indexOf('.');
            if (dot1Index < 0) {
                dot1Index = jvmVersion.length();
            }
            int dot2Index = jvmVersion.indexOf('.', dot1Index+1);
            if (dot2Index < 0) {
                dot2Index = jvmVersion.length();
            }

            int jvmMajor = Integer.parseInt(jvmVersion.substring(0, dot1Index));
            int jvmMinor = Integer.parseInt(jvmVersion.substring(dot1Index+1, dot2Index));
            if ((jvmMajor == 1 && jvmMinor < 4) || jvmMajor < 1) {
String message =
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="LPS running against JRE version < 1.4; this is *not* supported!"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-219");
                
                log(message);
                mLogger.warn(message);
            }
        } catch (Exception e) {
mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Can't parse JRE specification version: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-231", new Object[] {jvmVersion})
            );
        }

        // Initialize
        LPS.initialize();
 
        // Debugging
        if (mLogger.isDebugEnabled()) {
            Enumeration attrs = ctxt.getAttributeNames();
            while(attrs.hasMoreElements()) {
                String a = (String)attrs.nextElement();
                mLogger.debug("Attribute: " + a + " : " + ctxt.getAttribute(a));
            }
        }

        //------------------------------------------------------------
        // LPS property values
        //------------------------------------------------------------
        mProperties = LPS.getProperties();

        LPS.setSWFVersionDefault(LPS.getProperty("compiler.runtime.default", "swf6"));

        // Create responders that create caches (media, data, and compiler)
        String[] lzt = { "swf", "media", "data" };
        int i = 0;
        try {
            for (;i < lzt.length; i++) {
                if (getResponder(lzt[i]) == null) {
respondWithInitError(req, res,
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Initialization error: no request type: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-266", new Object[] {lzt[i]})
                    );
                    return false;
                }
            }
        } catch (Throwable e) {
            mLogger.error("Exception", e);
            respondWithInitException(req, res, e);
            return false;
        }

        mDefaultRequestType = mProperties.getProperty(DEFAULT_REQUEST_TYPE, mDefaultRequestType);
mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Default request type is " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-284", new Object[] {mDefaultRequestType})
        );

        mCharacterEncoding = mProperties.getProperty(CHARACTER_ENCODING, mCharacterEncoding);
        try {
            // check for valid character encoding.
            Charset.forName(mCharacterEncoding);
        } catch (Throwable e) {
            mLogger.error("Exception", e);
            respondWithInitException(req, res, e);
            return false;
        }
mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Character encoding is " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-302", new Object[] {mCharacterEncoding})
        );

        return true;
    }


    /**
     * Log initialization details (to both servlet log and lps.log)
     *
     * @param s String to log
     */
    private void logInitInfo(String s) {
        mLogger.info(s);
        log(s);
    }

    /**
     * @param req @see HttpServletRequest
     * @param res @see HttpServletResponse
     */
    public void doGet(HttpServletRequest req, HttpServletResponse res) 
        throws IOException, ServletException
    {
        // If no encoding is specified, force it. Note that encoding has to be
        // set before request parameters are accessed.
        if (req.getCharacterEncoding() == null) {
            req.setCharacterEncoding(mCharacterEncoding);
        }

        // This forces clients to talk to us. We may still return NOT_MODIFIED.
        // TODO: [bloch 2002-12-17] turn this into an lps.property
        if (! isMacIE(req) ) { // Set only if it's not Mac IE 5.2 (see bug 811)
            res.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
        }

        int requestID;

        // Set up logger NDC
        synchronized (this) {
            requestID = mRequestCounter; 
            if (requestID == 1) {
                if (initLPS(req, res) == false) {
                    return;
                }
            }
            mRequestCounter++; 
        }

        NDC.push(req.getRemoteAddr() + " " + (requestID));

        try {
            _doGet(req, res);
        } finally {

mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Request " + p[0] + " finished"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-363", new Object[] {new Integer(requestID)})
            );
            NDC.pop();
            NDC.remove();
        }

    }

    /**
     * @return lzt String
     */
    String getLZT(HttpServletRequest req) {
        String lzt = req.getParameter("lzt");
        if (lzt == null || lzt.equals(""))
            lzt = mDefaultRequestType;

        return lzt;
    }


    /**
     * @param req @see HttpServletRequest
     * @param res @see HttpServletResponse
     */
    private void _doGet(HttpServletRequest req, HttpServletResponse res) 
        throws IOException, ServletException
    {
        ServletContext ctxt = getServletContext();
        String fileName = LZHttpUtils.getRealPath(ctxt, req);


        if (mLogger.isDebugEnabled()) {
            mLogger.debug("Request: servlet path " + req.getServletPath());
            mLogger.debug("Request: request uri  " + req.getRequestURI());
            mLogger.debug("Request: query string " + req.getQueryString());
            mLogger.debug("Request: path info    " + req.getPathInfo());
            mLogger.debug("Request: path xlated  " + req.getPathTranslated());
            mLogger.debug("Request: server name " + req.getServerName());
            mLogger.debug("Request: server port " + req.getServerPort());
            mLogger.debug("Request: is secure  " + req.isSecure());
            mLogger.debug("Request: charset " + req.getCharacterEncoding());

            Enumeration headers = req.getHeaderNames();
            if (headers != null) {
                while(headers.hasMoreElements()) {
                    String h = (String)headers.nextElement();
                    mLogger.debug("    Header: " + h + " : " + req.getHeader(h));
                }
            } 
        }

mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Request for " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-420", new Object[] {fileName})
        );

        String lzt = getLZT(req);
        Responder lzres = getResponder(lzt);

        if (lzres == null) {
mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="No request type: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-433", new Object[] {lzt})
            );
            res.sendError(HttpServletResponse.SC_NOT_FOUND, "No request type: " + lzt);
            return;
        }

        mLogger.debug("responding via: " + lzres.getClass().getName());
        lzres.respond(req, res);
    }

    /**
     * Get a Responder object for the given lzt string
     */
    private synchronized Responder getResponder(String lzt) 
        throws ServletException
    {
        Responder lzres = (Responder) mResponderMap.get(lzt);
        String className = "org.openlaszlo.servlets.responders.Responder";

        if (lzres == null) {
            Class c = null;
            try {
                className += lzt.toUpperCase();
                c = Class.forName(className);
                lzres = (Responder)c.newInstance();
                lzres.init(lzt, getServletConfig(), mProperties);
                mResponderMap.put(lzt, lzres);
            } catch (InstantiationException e) {
                mLogger.error("InstantiationException" , e);
                throw new ServletException("InstantiationException: " + e.getMessage());
            } catch (IllegalAccessException e) {
                mLogger.error("IllegalAccessException" , e);
                throw new ServletException("IllegalAccessException: " + e.getMessage());
            } catch (ClassNotFoundException e) {
                try {
                    lzres = TemplateResponder.getResponder(lzt);
                } catch (Throwable t) {
mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Exception getting template responder"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-476")
                            , t);
                }
                // The case where this returns null is handled by the caller.
                if (lzres == null) {
mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="no matching template responder " + "or class named " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-487", new Object[] {className})
                    );
                }
            } catch (Throwable e) {
                // TODO: [pkang 2003-05-01] if a user-defined handler exists,
                // use it.
                mLogger.error("Throwable: ", e);
                log("throwable: " + e.getMessage());
                throw new ServletException(e);
            }
        }
        return lzres;
    }

    /** 
     * Check if it's Mac IE.
     */
    private boolean isMacIE(HttpServletRequest req)
    {
        // TODO: [pkang 2003-01-30] this was only tested on IE 5.2. We need to
        // test if this works for IE 5 and 5.1.
        String ua = req.getHeader("User-Agent");
        return (ua != null && 
                ua.indexOf("MSIE") != -1 &&
                ua.indexOf("Mac_PowerPC") != -1);
    }

    /**
     * @param req @see HttpServletRequest
     * @param res @see HttpServletResponse
     */
    public void doPost (HttpServletRequest req, HttpServletResponse res) 
        throws IOException, ServletException {

        doGet(req, res);

    }

    /**
     * Send an error message response based on the request type
     *
     * @param req
     * @param res
     * @param message
     */
    private void respondWithInitError(HttpServletRequest req, 
            HttpServletResponse res,
            String message) {

        log(message);
        try {
            String lzt = null;
            Responder lzres = null;
            try {
                lzt = getLZT(req);
                lzres = getResponder(lzt);
            } catch (Exception e) {
mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Exception trying to respond with initialization error"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-550")
                , e);
            }
            if (lzres != null) {
                lzres.respondWithMessage(res, message);
            } else {
                if ("swf".equalsIgnoreCase(lzt)) {
                    Responder.respondWithMessageSWF(res, "LPS initialization error: " + message);
                } else {
                    Responder.respondWithErrorHTML(res, "LPS initialization error: " + message);
                }
            }
        } catch (Throwable e){
            // Nothing we can do now :-(
        }
    }

    /**
     * Send an error message response based on the request type
     *
     * @param req
     * @param res
     * @param e
     */
    private void respondWithInitException(HttpServletRequest req, 
            HttpServletResponse res,
            Throwable e) {

        StringWriter s = new StringWriter();
        PrintWriter p = new PrintWriter(s);
        e.printStackTrace(p);
        respondWithInitError(req, res, s.toString());
    }

    /**
     * Convenience routine to return webapp name
     */
    public static String getServletContextName(ServletContext ctxt) {

         String webappPath = LZHttpUtils.getRealPath(ctxt, "/");
         int index = webappPath.lastIndexOf(File.separator);
         int length = webappPath.length();
         if (index == length - 1) {
             index = webappPath.lastIndexOf(File.separator, index - 1);
             return webappPath.substring(index + 1, length - 1);
         }
 
         return webappPath.substring(index + 1);
    }

    /**
     * Servlet is going away
     */
    public void destroy() {
        ServletContext ctxt = getServletContext();
        String webappName = getServletContextName(ctxt);
mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="LPS destroyed in context: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZServlet.class.getName(),"051018-612", new Object[] {webappName})
        );
    }
}
