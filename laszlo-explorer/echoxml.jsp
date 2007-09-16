<%@ page contentType="text/xml" %>
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>

<%
/* X_LZ_COPYRIGHT_BEGIN ***************************************************
 * Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.         *
 * Use is subject to license terms.                                       *
 * X_LZ_COPYRIGHT_END *****************************************************/
%>

<%
//    form.lzx originally called echo.jsp to demonstrate an external app
//    can be called. However, echo.jsp returns html. I wrote this script to
//    return the parameters as xml. echo.jsp doesn't work for dhtml
%>

<response>
  <echo>

<%
  String qParams = request.getContextPath();
  Enumeration e = request.getParameterNames();
  while (e.hasMoreElements()) {
    String name = (String)e.nextElement();
    String value = request.getParameter(name);
%>
    <parameter name="<%= name %>"><%= value %></parameter>
<%
  }
%>

  </echo>
</response>

