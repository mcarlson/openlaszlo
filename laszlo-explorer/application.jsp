<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" %>
<%
    String qMark ="?";
    String src=request.getParameter("src");
    if (src == null) {
        out.println("<html><body>Missing query paramater: 'src'</body></html>"); 
        return;
    }

    String appName = request.getContextPath();
    if (! src.startsWith(appName)) {
        src =  appName + src;
    }
    String qParams ="";
    Enumeration e = request.getParameterNames();
    while (e.hasMoreElements()) {
      String name = (String)e.nextElement();
      String value = request.getParameter(name);

      qParams += "&amp;" + name + "=" + value;
    }
    
    // FIXME: kluge around lzx-reference API design.
    if (src.endsWith("/reference/index.html")){
      qParams="";
      qMark="";
  }
%>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title>OpenLaszlo Explorer</title>
  <link rel="stylesheet" href="../lps/includes/explore.css" type="text/css">
  <script src="../lps/includes/embed.js" language="JavaScript" type="text/javascript"></script>
</head>

<body class="application-view">
<div class="application">
<script language="JavaScript" type="text/javascript"
        src="<%= src %><%= qMark %><%= qParams %>&amp;lzt=js">
</script>
</div>
</body>
</html>
