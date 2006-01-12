<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.lang.Integer" %>

<%
    Thread.sleep(  Integer.parseInt( request.getParameter( "sleep" )) );
    response.setContentType("text/xml");
    response.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
%>
<echo sleeptime="<%
        out.print( (String) request.getParameter( "sleep" ) );
%>"></echo>
