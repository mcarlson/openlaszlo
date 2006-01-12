<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.lang.Integer" %>

<%
    Thread.sleep( 1000 );
    response.setContentType("text/xml");
    response.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
%>
<echo sleeptime="1000"><%
    Enumeration attrs = request.getParameterNames();
    out.print( "<![CDATA[" );
    while(attrs.hasMoreElements()) {
        String a = (String)attrs.nextElement();
        out.print( a + "=" + (String) request.getParameter( a ) + "\n"   );
    }

    Enumeration headers = request.getHeaderNames();
    if (headers != null) {
        while(headers.hasMoreElements()) {
            String h = (String)headers.nextElement();
            out.print("    Header: " + h + " : " + request.getHeader(h) + "\n");
        }
    } 
    out.print( "]]>" );
%></echo>
