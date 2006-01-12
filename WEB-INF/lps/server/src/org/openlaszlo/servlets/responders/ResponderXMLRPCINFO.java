/******************************************************************************
 * ResponderXMLRPCINFO.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.servlets.responders;

import java.io.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletOutputStream;
import org.openlaszlo.data.XMLRPCDataSource;
import org.openlaszlo.utils.FileUtils;
import org.apache.log4j.Logger;

public final class ResponderXMLRPCINFO extends ResponderAdmin
{
    private static Logger mLogger = Logger.getLogger(ResponderXMLRPCINFO.class);

    boolean ok(String opt) {
        return opt != null && opt.equals("1");
    }

    /**
     * Get XML-RPC load information.
     */
    protected void respondAdmin(HttpServletRequest req, HttpServletResponse res)
        throws IOException {
        res.setContentType ("text/xml");
        ServletOutputStream out = res.getOutputStream();
        try {
            if (ok(req.getParameter("clear"))) {
                XMLRPCDataSource.clearLoadInfo();
            }
            StringBuffer sb = new StringBuffer();
            XMLRPCDataSource.toXML(sb);
            out.println(sb.toString());
        } finally {
            FileUtils.close(out);
        }
    }

    public int getMimeType()
    {
        return MIME_TYPE_XML;
    }
}
