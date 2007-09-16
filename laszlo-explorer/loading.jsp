<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" %>
<%
    String qMark = "?";
    String qParams = "";
    String src = request.getParameter("src");

    if (src == null) {
        out.println("<html><body>Missing query parameter: 'src'</body></html>");
        return;
    }

    String appName = request.getContextPath();

    if (! src.startsWith(appName)) {
        src = appName + src;
    }
    Enumeration e = request.getParameterNames();
    while (e.hasMoreElements()) {
        String name = (String)e.nextElement();
        if (name.indexOf("src") == 0) continue; 
        String value = request.getParameter(name);
        
        if (qParams != "") qParams += "&amp;";
        qParams += name + "=" + value;
    }
    
    // FIXME [2004-09-16 mdavis]: kluge around lzx-reference API design.
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
</head>

<body class="loading-view"
      onload="location.href='<%= src %><%= qMark %><%= qParams %>';">
<!-- Make sure the app is compiled before switching to it.  The
     following request won't return until the app has been compiled,
     and the body.onload script won't execute until the request
     returns, so this has the effect of playing the loading movie
     until the app is ready to load. -->
<!-- TODO: needs to return valid javascript to prevent errors! -->
<!--script language="JavaScript" type="text/javascript"
        src="<%= src %><%= qMark %><%= qParams %>&amp;lzt=compile">
</script-->

</div>
</body>
</html>
