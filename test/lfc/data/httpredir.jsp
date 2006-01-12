<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.lang.Integer" %>

<%
    String c = request.getParameter("count");
    int count = 0;
    if (c != null) {
        count = Integer.parseInt(request.getParameter("count"));
    }

    if (count < 3) {
        response.sendRedirect("httpredir.jsp?count="+(count+1));
    } else {
        response.setContentType("text/xml");
        response.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
        out.println("<echo>hello</echo>");
    }
%>
