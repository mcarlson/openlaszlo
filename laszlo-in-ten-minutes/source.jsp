<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.ArrayList,
                 java.util.regex.*,
                 java.io.*"%>

<%!
    Pattern amp =  Pattern.compile("&");
    Pattern lt = Pattern.compile("<");
    public String quote(String source) {
        // Escape HTML
        return lt.matcher(amp.matcher(source).replaceAll("&amp;")).replaceAll("&lt;");
    }
%>

<%
    String src = request.getParameter("src");
    String title = request.getParameter("title");
    String fname = src;
    try {
        String formAction=request.getParameter("formAction");
        String sourceCode=request.getParameter("sourceCode");
        int lastSeparator = Math.max(src.lastIndexOf("/"), 0);
        String sessionId = session.getId();
        String saveAsLabel = "Save as";

        // Temp files need to go in the same directory as sources so that
        // includes come out right.
        String tempUrl = src.substring(0, lastSeparator)+"/.tmp_"+sessionId+"_"+src.substring(lastSeparator+1);

        String tempFilePath=application.getRealPath(tempUrl);
        //new File(tempFilePath).getParentFile().mkdirs();
        
        boolean temp=false;
        if ("Update".equals(formAction)) {
            File tempFile = new File(tempFilePath);
            //tempFile.deleteOnExit();
            fname = tempUrl;
            BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile));
            writer.write(sourceCode);
            writer.flush();
            writer.close();
            temp=true;
        } else if (formAction != null && formAction.startsWith(saveAsLabel)) {
            response.addHeader("Content-Type","application/octet-strem");
            response.addHeader("Content-Disposition","attachment; filename=\"" +
                request.getParameter("saveasfile") + "\"");
            out.write(sourceCode);
            return;
        } else {
            if ("Reset".equals(formAction)) {
                File file = new File(tempFilePath);
                if (file.exists()) file.delete();
            } else {
                if (new File(tempFilePath).exists()) {
                    temp = true;
                    fname = tempUrl;
                }
            }
            File file = new File(temp?tempFilePath:application.getRealPath(src));
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line;
            StringBuffer sb = new StringBuffer();
            while ((line = reader.readLine()) != null) {
                sb.append(line);
                sb.append("\n");
            }
            reader.close();
            sourceCode = sb.toString();
        }
        String basefile = src.substring(src.lastIndexOf("/")+1);
%>
<html>
<head>
  <link rel="stylesheet" href="../lps/includes/explore.css" type="text/css">
</head>

<body class="source-view"
      onload="parent.swf.location.href='loading.jsp?src=<%= temp?request.getContextPath()+"/"+tempUrl:request.getContextPath()+"/"+src %>?showTaskBar=false';">

<h2><%= title %></h2>

<form method="post">
    <input name="src" type="hidden" value="<%= src %>">
    <textarea name="sourceCode" id="sourceCode" cols="58" rows="21" wrap="off"><%= quote(sourceCode) %></textarea><br>
   
    <input type="submit" name="formAction" value="Update">
    <input type="submit" name="formAction" value="Reset">   
<%if (request.getRemoteAddr().equals("127.0.0.1")) {%>
    <input type="submit" name="formAction" value="<%=saveAsLabel%>&hellip;">
    <input type="text" name="saveasfile" value="<%=basefile%>">
<%}%>
</form>

</body>
</html>
<%
    } catch (Exception e) {
        out.println(e.getMessage());
    }
%>
