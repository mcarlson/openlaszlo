<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.io.File,
                 java.io.BufferedReader,
                 java.io.FileReader"%>
<html>
<head>	<link rel="stylesheet" href="../lps/includes/explore.css" type="text/css">
</head>
  <body>
<%
    StringBuffer sb = new StringBuffer();

    try {

        String htm = application.getRealPath(request.getParameter("src")+".test");
        if (new File(htm).exists()) {
            BufferedReader reader = new BufferedReader(new FileReader(htm));
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line+"\n");
            }
            reader.close();
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
%>
<h3>Test Instructions</h3>
<i>if any of these steps don't behave as described, please <a href="http://sf.laszlosystems.com/bugzilla/">file a bug</a> and fail the test.</i>
<%= sb.toString() %>

    <hr>
    <address><a href="mailto:mdavis@lyta.laszlosystems.com">mdavis</a></address>
<!-- Created: Mon Aug 16 13:42:48 PDT 2004 -->
<!-- hhmts start -->
Last modified: Mon Aug 16 18:22:53 PDT 2004
<!-- hhmts end -->
  </body>
</html>
