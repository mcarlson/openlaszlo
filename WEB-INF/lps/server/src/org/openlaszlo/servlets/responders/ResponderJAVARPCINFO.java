/******************************************************************************
 * ResponderJAVARPCINFO.java
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
import org.openlaszlo.data.JavaDataSource;
import org.openlaszlo.utils.FileUtils;
import org.apache.log4j.Logger;

public final class ResponderJAVARPCINFO extends ResponderAdmin
{
    private static Logger mLogger = Logger.getLogger(ResponderJAVARPCINFO.class);

    boolean ok(String opt) {
        return opt != null && opt.equals("1");
    }

    protected void respondAdmin(HttpServletRequest req, HttpServletResponse res)
        throws IOException {
        res.setContentType ("text/xml");
        ServletOutputStream out = res.getOutputStream();
        try {
            if (ok(req.getParameter("clear"))) {
                JavaDataSource.clearLoadInfo();
            }

            int options = 0;
            boolean doAll = ok(req.getParameter("opt_all"));
            if (doAll || ok(req.getParameter("opt_invoke"))) 
                options |= JavaDataSource.LOAD_INVOKE;
            if (doAll || ok(req.getParameter("opt_sgp")))
                options |= JavaDataSource.LOAD_STATIC_GET_PROTO;
            if (doAll || ok(req.getParameter("opt_icp")))
                options |= JavaDataSource.LOAD_INSTANCE_CREATE_PROTO;
            if (doAll || ok(req.getParameter("opt_igp")))
                options |= JavaDataSource.LOAD_INSTANCE_GET_PROTO;
            if (doAll || ok(req.getParameter("opt_idp")))
                options |= JavaDataSource.LOAD_INSTANCE_DESTROY_PROTO;
            if (doAll || ok(req.getParameter("opt_igit")))
                options |= JavaDataSource.LOAD_INSTANCE_GET_INVOKE_TARGET;
            if (doAll || ok(req.getParameter("opt_roe")))
                options |= JavaDataSource.LOAD_RETURN_OBJECT_ENCODE;
            out.println(JavaDataSource.toXML(options));
        } finally {
            FileUtils.close(out);
        }
    }

    public int getMimeType()
    {
        return MIME_TYPE_XML;
    }
}
