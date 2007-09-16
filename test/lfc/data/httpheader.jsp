<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.lang.Integer" %>

<value><%
// Return the specified HTTP Request header as the <value> to the client can examine it

    response.setContentType("text/xml");
Map table = javax.servlet.http.HttpUtils.parseQueryString(request.getQueryString());
String[] strings = (String[]) table.get("parameter");
if (strings.length == 1) {
  String parameter = strings[0];
  out.print("<![CDATA[" + request.getHeader(parameter) + "]]>");
}
%></value>

