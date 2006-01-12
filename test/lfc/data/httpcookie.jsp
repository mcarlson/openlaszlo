<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.lang.Integer" %>

<%
    out.println("<hello>Session ID " + session.getId() + "</hello>");
    if (request.isRequestedSessionIdFromCookie()) {
        out.println("<hello>cookie</hello>");
    }
    if (request.isRequestedSessionIdFromURL()) {
        out.println("<hello>cookie</hello>");
    }
%>
