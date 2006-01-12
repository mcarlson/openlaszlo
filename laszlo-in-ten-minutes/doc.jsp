<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.io.File,
                 java.io.BufferedReader,
                 java.io.FileReader"%><html>
<head>
	<link rel="stylesheet" href="../lps/includes/explore.css" type="text/css">
    <script>
        function openWindow(url) {
            window.open(url, '', 'location=yes,toolbar=yes,menubar=yes,directories=yes,status=yes,resizable=yes,scrollbars=yes,height=550,width=750', false);
        }
    </script>
</head>


<body class="doc-view">
<%
    StringBuffer sb = new StringBuffer();
    try {
        String htm = application.getRealPath(request.getParameter("src")+".htm");
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
<%= sb.toString() %>
</body>
</html>

