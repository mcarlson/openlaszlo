/******************************************************************************
 * ResponderCANVAS.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

/* Return the canvas xml descriptor, as XML document */

package org.openlaszlo.servlets.responders;

import java.io.*;
import java.util.*;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.Properties;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.openlaszlo.compiler.Canvas;
import org.openlaszlo.compiler.CompilationError;
import org.openlaszlo.utils.*;
import org.apache.log4j.Logger;

public final class ResponderCANVAS extends ResponderCompile
{
    
    /**
     * @param fileName Full pathname to file from request.
     */
    protected void respondImpl(String fileName, HttpServletRequest req, 
                               HttpServletResponse res)
        throws IOException
    {
        ServletOutputStream out = res.getOutputStream();
        try {
            res.setContentType ("text/xml");
            Canvas canvas = getCanvas(fileName, req);
            String xml = canvas.getXML(ResponderAPP_CONSOLE.getRequestXML(req, fileName));
            out.write(xml.getBytes());
        } finally {
            FileUtils.close(out);
        }
    }

    public int getMimeType()
    {
        return MIME_TYPE_XML;
    }

}
