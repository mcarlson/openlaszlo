<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.lang.Integer" %>
<%
    response.setContentType("text/xml");
%>
<%
    int count = 0;
    int maxcount = 1;
    String foo = request.getParameter("max");
    if (foo != null) {
        maxcount = Integer.parseInt(foo);
    }
    foo = request.getParameter("count");
    if (foo != null) {
        count = Integer.parseInt(foo);
    }
    if (count < maxcount) {
        count++;
        response.sendRedirect("redir.jsp?count=" + count + "&max=" + maxcount);
    } else {
%>
    <echo count="<%=count %>" />
<%
    }
%>
