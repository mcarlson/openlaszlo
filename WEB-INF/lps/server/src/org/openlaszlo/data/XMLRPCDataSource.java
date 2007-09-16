/* ****************************************************************************
 * XMLRPCDataSource.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data;

import java.io.*;
import java.util.*;
import java.net.MalformedURLException;
import javax.servlet.http.*;
import org.apache.xmlrpc.*;
import org.openlaszlo.server.LPS;
// LoadCount belongs in utils
import org.openlaszlo.servlets.LoadCount;
import org.openlaszlo.xml.internal.*;
import org.openlaszlo.media.MimeType;
import org.apache.log4j.*;

/**
 *
 */
public class XMLRPCDataSource extends DataSource
{
    private static Logger mLogger  = Logger.getLogger(XMLRPCDataSource.class);

    XmlRpcServer xmlrpc = new XmlRpcServer();

    static long mLastCleared = -1; 
    static LoadCount mXMLRPCLoad = new LoadCount(10);

    public XMLRPCDataSource() {
        clearLoadInfo();
    }

    /**
     * @return unique name of this data source
     */
    public String name() 
    {
        return "xmlrpc";
    }

    /**
     * Sends system information to client.
     * 
     * @throws DataSourceException if there was a problem retrieving or sending
     * the data.
     */
    public Data getData(String app, HttpServletRequest req, 
                        HttpServletResponse res, long lastModifiedTime)
        throws DataSourceException {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="getData"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                XMLRPCDataSource.class.getName(),"051018-62")
);

        String runtime = req.getParameter("lzr");

        try {
            if (! req.getMethod().equals("POST"))
                return compileFault(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Remote request must be POST"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                XMLRPCDataSource.class.getName(),"051018-74")
, runtime);

            String url = getHTTPURL(getURL(req));
            if (url == null) {
                return compileFault(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="invalid url specified: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                XMLRPCDataSource.class.getName(),"051018-85", new Object[] {url})
, runtime);
            }

            String postbody = req.getParameter("lzpostbody");
            if (postbody != null) {
                url += "?lzpostbody=" + postbody;
            }

            long t0, t1;
            t0 = System.currentTimeMillis();
            mXMLRPCLoad.increment();
            try {
                Data data = HTTPDataSource.getHTTPData(req, res, url, -1);
                mLogger.error("xmlrpc data "+ data.getAsString());
                return new XMLRPCData(data.getAsString().getBytes(), runtime);
            } finally {
                t1 = System.currentTimeMillis();
                mXMLRPCLoad.decrement((int)(t1-t0));
            }

        } catch (Exception e) {
            return compileFault(e, runtime);
        }
    }

    String getHTTPURL(String url) {
        if (url != null && url.startsWith("xmlrpc://")) 
            return "http" + url.substring(6);
        return null;
    }


    /**
     * Compile fault exception message.
     */
    Data compileFault(Exception e, String runtime) {
        mLogger.error("compileFault", e);
        return compileFault(e.getMessage(), runtime);
    }

    /**
     * Compile fault response.
     */
    Data compileFault(String mesg, String runtime) {
        mLogger.error("compileFault mesg: " + mesg);
        try {

            if ("dhtml".equals(runtime)) {
                byte[] d = XMLRPCJSONCompiler.compileFault(XMLUtils.escapeXml(mesg), 
                                                       runtime);
                return new XMLRPCData().setResult(d);
            } else {
                int swfversion = LPS.getSWFVersionNum(runtime);
                byte[] d = XMLRPCCompiler.compileFault(XMLUtils.escapeXml(mesg), 
                                                       swfversion);
                return new XMLRPCData().setResult(d);
            }

        } catch (Exception e) {
            mLogger.error("Exception", e);
            // this is an error since we can't build a fault response
            throw new Error(e.getMessage());
        }
    }

    public static void clearLoadInfo() {
        mXMLRPCLoad.reset();
        mLastCleared = System.currentTimeMillis();
    }

    public static void toXML(StringBuffer sb) {
        Date lc = new Date(mLastCleared);
        sb.append("<xmlrpcinfo ")
            .append(" last-cleared=\"").append(lc).append("\"")
            .append(">");
        sb.append(mXMLRPCLoad.toXML("xmlrpc_load"));
        sb.append("</xmlrpcinfo>");
    }

    /**
     * A data object to hold an xmlrpc response.
     */
    public class XMLRPCData extends Data 
    {
        byte[] mResult;

        public XMLRPCData() { }

        public XMLRPCData(byte[] result, String runtime) 
            throws IOException {
            InputStreamReader reader = new InputStreamReader(new ByteArrayInputStream(result));
            mLogger.debug("XMLRPCData runtime="+runtime);
            if ("dhtml".equals(runtime)) {
                mResult = XMLRPCJSONCompiler.compile(reader, runtime);
            } else {
                int swfversion = LPS.getSWFVersionNum(runtime);
                mResult = XMLRPCCompiler.compile(reader, result.length, swfversion);
            }
        }

        public String getMimeType() {
            return MimeType.SWF;
        }


        public XMLRPCData setResult(byte[] result) {
            mResult = result;
            return this;
        }

        /**
         * @return the encoded XML
         */
        public InputStream getInputStream() 
            throws IOException {
            return new ByteArrayInputStream(mResult);
        }

        public long size() {
            return mResult.length;
        }
    }
}
