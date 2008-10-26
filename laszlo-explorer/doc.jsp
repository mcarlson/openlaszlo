<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.io.File,
                 java.io.BufferedReader,
                 java.io.IOException,
                 java.io.FileReader,
                 java.io.InputStreamReader,
                 java.io.FileInputStream"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="../lps/includes/explore.css" type="text/css">
    <title>OpenLaszlo Explorer</title>
    <script language="JavaScript" type="text/javascript">
        function openWindow(url) {
            window.open(url, '', 'location=yes,toolbar=yes,menubar=yes,directories=yes,status=yes,resizable=yes,scrollbars=yes,height=550,width=750', false);
        }
    </script>
</head>


<body class="doc-view">
<%!
    // Does this pathname point to a valid target directory? Should be
    // a subdir of the webapp. 
    boolean isValidSubdir(String path) {
      try {
          String canonical = (new File(path)).getCanonicalPath();
          String webapp =  (new File((getServletContext().getRealPath(".")))).getCanonicalPath();
     return canonical.startsWith(webapp);
      } catch (IOException e) {
        return false;
       }
    }

    %>
<%
    StringBuffer sb = new StringBuffer();
    try {

        String src = request.getParameter("src");
        // Check if url is in proper subdir of this JSP 
        if (!isValidSubdir(application.getRealPath(src))) {
            out.println("invalid path");
            return;
        }

        String htm = application.getRealPath(request.getParameter("src")+".htm");
        if (new File(htm).exists()) {
            InputStreamReader isr = new InputStreamReader(new FileInputStream(htm), "UTF-8");
            BufferedReader reader = new BufferedReader(isr);
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
<%= sb.toString() %>
</body>
</html>

