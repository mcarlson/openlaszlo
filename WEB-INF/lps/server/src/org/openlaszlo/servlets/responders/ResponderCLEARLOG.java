/******************************************************************************
 * ResponderCLEARLOG.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.servlets.responders;

import java.io.*;
import java.util.Properties;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.server.LPS;
import org.apache.log4j.Logger;

public final class ResponderCLEARLOG extends ResponderAdmin
{
    private static Logger mLogger = Logger.getLogger(ResponderCLEARLOG.class);

    protected void respondAdmin(HttpServletRequest req, HttpServletResponse res)
        throws IOException
    {
        String[] status = new String[1];
        status[0] = "";

        boolean cleared = ResponderLOGCONFIG.clearLog(status);

        StringBuffer buf = new StringBuffer();
        buf.append("<clearlog ")
            .append("cleared=\"").append(cleared).append("\" ");
        if (status[0].intern() != "") {
            buf.append("status=\"").append(status[0]).append("\" ");
        }
        buf.append(" />");

        respondWithXML(res, buf.toString());

        if (cleared)
            mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Cleared log."
 */
			org.openlaszlo.i18n.LaszloMessages.getMessage(
				ResponderCLEARLOG.class.getName(),"051018-51")
);
        else
            mLogger.info(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Could not clear log."
 */
			org.openlaszlo.i18n.LaszloMessages.getMessage(
				ResponderCLEARLOG.class.getName(),"051018-60")
);

    }

    public int getMimeType()
    {
        return MIME_TYPE_XML;
    }
}
