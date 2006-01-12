<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@page import="java.io.*"%>
<%
    String cont = request.getParameter("content");
    String fname = request.getParameter("fname");

    if (cont != null && fname != null){
        String fs = File.separator;
        String path = application.getRealPath("/");
        if (! path.endsWith(fs)) 
            path += fs;
        path += "test" + fs + "bugs" + fs + "bug-3349";

        File file = new File(path + fs + fname);
        Writer writer = new BufferedWriter(new FileWriter(file));
        writer.write(cont);
        writer.flush();
        writer.close();
    }

    response.setContentType("text/xml");
    out.println("<response />");
%>
