<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.lang.Integer" %>
<%
    response.setContentType("text/xml");
    response.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
%>
<echo>
<![CDATA[
<%
try {
    out.print(".\n");
    try {
        String sleep = request.getParameter("sleep");
        if (sleep != null && ! sleep.equals("")) {
            Thread.sleep(Integer.parseInt(sleep));
        }
    } catch (NumberFormatException e) {
        out.println("sleep parameter not a number\n");
    }

    out.println("    Method: " + request.getMethod());

    Enumeration attrs = request.getParameterNames();
    if (attrs.hasMoreElements()) out.println("    -- parameters --" );
    while (attrs.hasMoreElements()) {
        String a = (String)attrs.nextElement();
        out.println("    " + a + ": " + (String) request.getParameter( a ) );
    }

    Enumeration headers = request.getHeaderNames();
    if (headers != null) {
        out.println("    -- request headers --" );
        while(headers.hasMoreElements()) {
            String h = (String)headers.nextElement();
            out.println("    " + h + ": " + (String) request.getHeader( h ));
        }
    } 
} catch (InterruptedException e) {
    out.println(e.getMessage());
}

%>
]]>
</echo>
