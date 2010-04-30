<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" %>
    <%@ page import="java.util.*" %>
      <%@ page import="java.io.*" %>

<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title>echo</title>
  </head>

  <body>
	    <% String qParams = request.getContextPath();
          qParams += "/laszlo-explorer/index.html?";
	    Enumeration e = request.getParameterNames();
	    while (e.hasMoreElements()) {
	      String name = (String)e.nextElement();
	      String value = request.getParameter(name);
	    qParams += "&amp;" + name + "=" + value;
	    }
%>
<a href="<%= qParams %>">Bookmark This Link</a>

  </body>
</html>
