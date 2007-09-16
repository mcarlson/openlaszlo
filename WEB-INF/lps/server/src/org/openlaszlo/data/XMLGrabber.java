/* 
 * Returns the XML text verbatim, doesn't encode it as swf
 */


/* *****************************************************************************
 * XMLConverter.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data;

import java.io.*;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.*;

import org.openlaszlo.utils.ContentEncoding;

import org.openlaszlo.media.MimeType;
import org.openlaszlo.server.LPS;

import org.jdom.Attribute;
import org.jdom.Comment;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.XMLOutputter;


/**
 * XML Converter
 *
 */
public class XMLGrabber extends Converter {
    
    private static Logger mLogger  = Logger.getLogger(XMLGrabber.class);

    /**
     * Convert incoming XML to ... XML 
     *
     * A dataset will look like this:
     * <resultset>
     * <body>
     *   <weather sourceurl="http://www.srh.noaa.gov/zipcity.php?inputstring=02460">
     *    <radar src="http://www.laszlosystems.com:80/weather/small/kbox.jpg"/>
     *    <satellite src="http://www.laszlosystems.com:80/weather/thumbs/ECI8.JPG"/>
     *   </weather>
     * </body>
     * <headers>
     * <header name="Date" value="Thu, 29 Dec 2005 03:49:46 GMT"/>
     * <header name="Server" value="Apache/2.0.44 (Unix) mod_ssl/2.0.44 OpenSSL/0.9.6b DAV/2 mod_jk/1.2.1 PHP/4.3.0"/>
     * </headers>
     * </resultset>
     */
    public InputStream convertToSWF(Data data, HttpServletRequest req,
                                    HttpServletResponse res)
       throws ConversionException, IOException {

        String body = data.getAsString();

        // Get headers
        String sendheaders = req.getParameter("sendheaders");
        StringBuffer headerbuf = new StringBuffer();
        headerbuf.append("<headers>\n");
        if (sendheaders == null || sendheaders.equals("true") ) {
            data.appendResponseHeadersAsXML(headerbuf);
        }
        headerbuf.append("</headers>");
        String headers = headerbuf.toString();

        if (mLogger.isDebugEnabled()) {
            mLogger.info("Output:" + body.length());
            mLogger.info("Output:\n" + body);
            mLogger.info("Output Headers:" + headers.length());
            mLogger.info("Output Headers:\n" + headers);
        }

        // Default to true, for back compatibility (sigh)
        boolean trimWhitespace = true;
        String trimval = req.getParameter("trimwhitespace");
        if ("false".equals(trimval)) {
                trimWhitespace = false;
        }

        boolean compress = "true".equals(req.getParameter("compress"));

        // nsprefix now defaults to true
        boolean nsprefix = true;
        if ("false".equals(req.getParameter("nsprefix"))) {
            nsprefix = false;
        }

        // Need to parse body into a DOM, and add the headers, then re-emit as XML
        // of the form
        // <resultset>
        //   <body> ... </body>
        //   <headers> ... </headers>
        // </resultset>

        StringBuffer xdata = new StringBuffer();
        xdata.append("<resultset>\n");
        xdata.append("<body>\n");
        String xbody = body.replaceFirst("<[?]xml.*?[?]>","");
        xdata.append(xbody);
        xdata.append("</body>\n");
        xdata.append(headers);
        xdata.append("</resultset>\n");

        // generate inputstream from DOM
        ByteArrayInputStream dis = new ByteArrayInputStream((xdata.toString()).getBytes("UTF-8"));
        return dis;
    }

    /**
     * @return the encoding that should be used when responding
     * to this request or null for no encoding.  For now, the only
     * acceptable values besides null are "gzip" and "deflate".
     */
    public String chooseEncoding(HttpServletRequest req) {

        String e = req.getParameter("enc");
        if (e == null || e.equals("false")) {
            return null;
        }

        String enc = ContentEncoding.chooseEncoding(req);
        mLogger.debug("Encoding: " + enc);
        return enc;
    }

}
