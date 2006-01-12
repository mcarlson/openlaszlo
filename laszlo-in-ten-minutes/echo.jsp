<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
    <%@ page import="java.util.*" %>
      <%@ page import="java.io.*" %>
<html>
  <head>
    <title>echo</title>
  </head>

  <body>
	    <% String qParams = request.getContextPath();
          qParams += "/laszlo-explorer/index.jsp?";
	    Enumeration e = request.getParameterNames();
	    while (e.hasMoreElements()) {
	      String name = (String)e.nextElement();
	      String value = request.getParameter(name);
	    qParams += "&" + name + "=" + value;
	    }
%>
<a href="<%= qParams %>">Bookmark This Link</a>

  </body>
</html>
