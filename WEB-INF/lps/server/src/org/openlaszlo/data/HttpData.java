/* *****************************************************************************
 * HTTPData.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
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
 * A class for holding on to results of an Http fetch.
 *
 * @author <a href="mailto:bloch@laszlosystems.com">Eric Bloch</a>
 */

public class HttpData extends Data {

    /** response code */
    public final int code;
    
    /** Http request */
    public final HttpMethodBase  request;
    
    HttpMethodBase getRequest() {
        return this.request;
    }


    private PatternMatcher pMatcher = new Perl5Matcher();
    private static final Pattern charsetPattern;
    private static final Pattern declEncodingPattern;
    static {
        try {
            Perl5Compiler compiler = new Perl5Compiler();
            charsetPattern = compiler.compile(";charset=([^ ]*)");
            declEncodingPattern =
                compiler.compile("[ \t\r\n]*<[?]xml .*encoding=[\"']([^ \"']*)[\"'] .*[?]>");
        } catch (MalformedPatternException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    /** 
     * @param r filled request
     * @param c response code
     */
    public HttpData(HttpMethodBase r, int c) {
        code = c;
        request = r;
    }
    
    /**
     * @return true if the data was "not modified"
     */
    public boolean notModified() {
        return code == HttpServletResponse.SC_NOT_MODIFIED;
    }
    
    /**
     * @return the lastModified time of the data
     */
    public long lastModified() {
    
        Header lastModifiedHdr = request.getResponseHeader(
            LZHttpUtils.LAST_MODIFIED);
                        
        if (lastModifiedHdr != null) {
            String lm = lastModifiedHdr.getValue();
            long l = LZHttpUtils.getDate(lm);
            // Truncate to nearest second
            return ((l)/1000L) * 1000L;
        } else {
            return -1;
        }
    }
    
    /**
     * append response headers
     */
    /**
     * release any resources associated with this data
     */
    public void release() {
        request.releaseConnection();
    }

    /**
     * @return mime type 
     */
    public String getMimeType() {
        Header hdr = request.getResponseHeader(LZHttpUtils.CONTENT_TYPE);
        String contentType = "";
        if (hdr != null) {
            contentType = hdr.getValue();
        }
        return contentType;
    }

    /**
     * @return string
     */
    public String getAsString() throws IOException {
        byte rawbytes[] = request.getResponseBody();
        if (rawbytes == null || rawbytes.length == 0) {
            throw new InterruptedIOException("null http response body");
        }
        String encoding = "UTF-8";
        String content = getMimeType();
        // search for ;charset=XXXX in Content-Type header
        if (pMatcher.matches(content, charsetPattern)) {
            encoding = pMatcher.getMatch().group(1);
        }
        // search for 'encoding' attribute in xml declaration, e.g.,
        // <?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>
            
        String decl = getXMLDeclaration(rawbytes);
        if (pMatcher.matches(decl, declEncodingPattern)) {
            encoding = pMatcher.getMatch().group(1);
        }
            
        return new String(rawbytes, encoding);
    }

    /** Returns the first non-whitespace line.
     *
     */
    String getXMLDeclaration(byte buf[]) {
        String str = new String(buf);
        BufferedReader br = new BufferedReader(new StringReader(str));
        String line;
        while (true) {
            try { line = br.readLine(); } catch (IOException e) { return ""; }
            if (line == null) {
                return "";
            }
            if (line.length() == 0) continue;
            if (line.startsWith("<?xml ")) {
                return line;
            } else {
                return "";
            }
        }
    }

    /**
     * @return input stream
     */
    public InputStream getInputStream() throws IOException {
        InputStream str = request.getResponseBodyAsStream();
        if (str == null) {
            throw new IOException(
                /* (non-Javadoc)
                 * @i18n.test
                 * @org-mes="http response body is null"
                 */
                org.openlaszlo.i18n.LaszloMessages.getMessage(
                    HTTPDataSource.class.getName(),"051018-774")
                                  );
        }
        return str;
    }

    /**
     * @return size, if known
     */
    public long size() {
        Header hdr = request.getResponseHeader(LZHttpUtils.CONTENT_LENGTH);
        if (hdr != null) {
            String contentLength = hdr.getValue();
            if (contentLength != null) {
                int cl = Integer.parseInt(contentLength);
                return cl;
            }
        }
        return -1;
    }
}
