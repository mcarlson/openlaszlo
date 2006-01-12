<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
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
        String value = request.getParameter(name);
        
        qParams += "&" + name + "=" + value;
    }
    
    // FIXME [2004-09-16 mdavis]: kluge around lzx-reference API design.
    if (src.endsWith("/reference/index.html")){
        qParams="";
        qMark="";
    }
%>
<html>
<head>
  <link rel="stylesheet" href="../lps/includes/explore.css" type="text/css">
  <script src="../lps/includes/embed.js" language="JavaScript" type="text/javascript"></script>
</head>

<body class="loading-view"
      onload="location.href='<%= src %><%= qMark %><%= qParams %>';">

<center>
<script language="JavaScript" type="text/javascript">
lzEmbed({url: 'assets/explore_loading.swf', width: '100', height: '100'});
</script>
</center>

<!-- Make sure the app is compiled before switching to it.  The
     following request won't return until the app has been compiled,
     and the body.onload script won't execute until the request
     returns, so this has the effect of playing the loading movie
     until the app is ready to load. -->
<script language="JavaScript" type="text/javascript"
        src="<%= src %><%= qMark %><%= qParams %>&lzt=compile">
</script>

</div>
</body>
</html>
