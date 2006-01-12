<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="javax.servlet.http.*" %>
<% if (request.getQueryString() != null) { %>
<!--=======================================================================-->
<!--                                                                       -->
<!-- LZ.jsp                                                                -->
<!--                                                                       -->
<!--   JSP that emits an HTML wrapper for an LZServlet request.            -->
<!--                                                                       -->
<!--   Assumes that the request has set the LZ_URI attribute.              -->
<!--=======================================================================-->
<html><head><title>Laszlo Presentation</title>

<script xmlns="" src="../lps/includes/embed.js" language="JavaScript" type="text/javascript"></script>

</head>
<body marginwidth="0" marginheight="0" topmargin="0" leftmargin="0">

<%@ page import="java.net.URL" %>
<%@ page import="javax.servlet.*" %>
<%@ page import="org.openlaszlo.cm.CompilationManager" %>
<%@ page import="org.openlaszlo.compiler.Canvas" %>

<%
    response.setHeader("Cache-control", "no-cache");
    response.setDateHeader("Expires", 0);

    String url = (String)request.getAttribute("LZF_URL");
    if (url == null) {
        throw new ServletException("No LZF_URL attribute set");
    }
    String fileName = (String)request.getAttribute("LZF_FILENAME");
    if (fileName == null) {
        throw new ServletException("No LZF_FILENAME attribute set");
    }
    CompilationManager compMgr = 
        (CompilationManager)request.getAttribute("LZF_COMPMGR");
    if (compMgr == null) {
        throw new ServletException("No LZF_COMPMGR attribute set");
    }

    Canvas canvas = compMgr.getCanvas(fileName);
    int width  = canvas.getWidth();
    int height = canvas.getHeight();
%>

<script>
lzEmbed({url: '<%= url %>?lzt=swf', width: '<%= width %>', height: '<%= height %>'});
</script>

</body></html>
<% } else {
    response.setHeader("Content-Type","text/xml");
%>
<FORMAT><%= request.getRequestURI() %>?LZF_COMPMGR=compmgr&amp;LZF_URL=url&amp;LZF_FILENAME=filename</FORMAT>
<% } %>
