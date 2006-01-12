<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<HTML>       <%@ page import="java.util.*" %>

<%
      String src=request.getParameter("src");
      String qParams="";
      Enumeration e = request.getParameterNames();
      while (e.hasMoreElements()) {
        String name = (String)e.nextElement();
        String value = request.getParameter(name);
        qParams += "&" + name + "=" + value;
      }
%>
<head>
<script xmlns="" src="../lps/includes/embed.js" language="JavaScript" type="text/javascript"></script>
<link href="../lps/includes/explore.css" rel="stylesheet" type="text/css">

</head>

<BODY onload="location.href='<%= src %>?<%= qParams %>';" bgcolor="#eaeaea">
<center>
<script>
lzEmbed({url: 'loading.swf', bgcolor: '#eaeaea', width: '200', height: '500'});
</script>
</center>
<table width="500"><tr><td>&nbsp;</td></tr></table>
</BODY>
</HTML>

