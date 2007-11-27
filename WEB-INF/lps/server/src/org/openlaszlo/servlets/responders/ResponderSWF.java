/******************************************************************************
 * ResponderSWF.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.servlets.responders;

import java.io.*;
import java.net.URL;
import java.util.Hashtable;
import java.util.Properties;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.openlaszlo.media.MimeType;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.utils.LZHttpUtils;
import org.openlaszlo.utils.StringUtils;
import org.openlaszlo.compiler.CompilationError;
import org.apache.log4j.Logger;

public final class ResponderSWF extends ResponderCompile
{
    private static Logger mLogger = Logger.getLogger(ResponderSWF.class);

    private Object mKrankEncodingLock = new Object();

    public void init(String reqName, ServletConfig config, Properties prop)
        throws ServletException, IOException
    {
        super.init(reqName, config, prop);
    }


    /**
     * @param fileName Full pathname to file from request.
     */
    protected void respondImpl(String fileName, HttpServletRequest req, 
                               HttpServletResponse res)
    {
        ServletOutputStream output = null;
        InputStream input = null;

        // Compile the file and send it out
        try {
            mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Requesting object for " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ResponderSWF.class.getName(),"051018-60", new Object[] {fileName})
);

            output = res.getOutputStream();
            Properties props = initCMgrProperties(req);
            String encoding = props.getProperty(LZHttpUtils.CONTENT_ENCODING);

            input = mCompMgr.getObjectStream(fileName, props);

            long total = input.available();
            // Set length header before writing content.  WebSphere
            // requires this.
            // Ok to cast to int because SWF file must be a 32bit file
            res.setContentLength((int)total);
            res.setContentType(MimeType.SWF);
            if (encoding != null) {
                res.setHeader(LZHttpUtils.CONTENT_ENCODING, encoding);
            }

            try {
                total = 0;
                total = FileUtils.sendToStream(input, output);
            } catch (FileUtils.StreamWritingException e) {
                // This should be the client hanging up on us.
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="StreamWritingException while sending SWF: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ResponderSWF.class.getName(),"051018-130", new Object[] {e.getMessage()})
);
            } catch (IOException e) {
                mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="IO exception while sending SWF: "
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ResponderSWF.class.getName(),"051018-139")
, e);
            } 
            mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Sent SWF, " + p[0] + " bytes"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ResponderSWF.class.getName(),"051018-148", new Object[] {new Long(total)})
);

        } catch (Exception e) {
            mLogger.error("Exception: ", e);
            StringWriter s = new StringWriter();
            PrintWriter p = new PrintWriter(s);
            e.printStackTrace(p);
            respondWithMessageSWF (res, s.toString());
        } finally {
            FileUtils.close(input);
            FileUtils.close(output);
        }
    }

    public int getMimeType()
    {
        return MIME_TYPE_SWF;
    }

    protected void handleCompilationError(CompilationError e,
                                          HttpServletRequest req,
                                          HttpServletResponse res)
        throws IOException
    {
        respondWithMessageSWF(res, e.getMessage());
    }
}
