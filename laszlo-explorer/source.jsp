<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.ArrayList,
                 java.util.regex.*,
                 java.io.*"%>
<%!
    class TmpFileManager implements HttpSessionBindingListener {

        private File tempFile;

        public void setTempFile(File tmpfile) {
            tempFile = tmpfile;
        }

        public void valueBound(HttpSessionBindingEvent event) {
        }

        public void valueUnbound(HttpSessionBindingEvent event) {
            // remove the temporary file when the session expires
            tempFile.delete();
        }
    }
    Pattern amp = Pattern.compile("&");
    Pattern lt = Pattern.compile("<");

    public String quote(String source) {
        // Escape HTML
        return lt.matcher(amp.matcher(source).replaceAll("&amp;")).replaceAll("&lt;");
    }
%>

<%!    // Does this pathname point to a valid target directory? Should be
    // a subdir of the webapp. 
    boolean isValidSubdir(String path) {
        try {
            String canonical = (new File(path)).getCanonicalPath();
            String webapp = (new File((getServletContext().getRealPath(".")))).getCanonicalPath();
            return canonical.startsWith(webapp);
        } catch (IOException e) {
            return false;
        }
    }

    %>

<%
            request.setCharacterEncoding("UTF-8");
            String src = request.getParameter("src");
            if (src == null) {
                out.println("no src query arg was supplied");
                return;
            }
            String title = request.getParameter("title");
            if (title == null) {
                title = "";
            }
            String fname = src;
            // Check if url is in proper subdir of this JSP 
            if (!isValidSubdir(application.getRealPath(src))) {
                out.println("invalid path");
                return;
            }

            String sTmpFile = "TempFilePath";
            try {
                String formAction = request.getParameter("formAction");
                String sourceCode = request.getParameter("sourceCode");
                int lastSeparator = Math.max(src.lastIndexOf("/"), 0);
                String sessionId = session.getId();
                String saveAsLabel = "Save as";
                String errorMessage = null;

                // Temp files need to go in the same directory as sources so that
                // includes come out right.
                String tempUrl = src.substring(0, lastSeparator) + "/.tmp_" + sessionId + "_" + src.substring(lastSeparator + 1);

                String tempFilePath = application.getRealPath(tempUrl);
                //new File(tempFilePath).getParentFile().mkdirs();

                boolean temp = false;
                if ("Update".equals(formAction)) {
                    ByteArrayOutputStream os = new ByteArrayOutputStream();
                    String xslfile = getServletContext().getRealPath("laszlo-explorer/verify.xsl");
                    org.openlaszlo.utils.TransformUtils.applyTransform(xslfile, sourceCode, os);
                    if (os.size() > 0) {
                        errorMessage = os.toString();
                    } else {
                        File tempFile = new File(tempFilePath);
                        FileOutputStream fos = new FileOutputStream(tempFilePath);
                        OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
                        BufferedWriter writer = new BufferedWriter(osw);
                        writer.write(sourceCode);
                        writer.flush();
                        writer.close();
                        fname = tempUrl;
                        temp = true;
                        // save the file name with the session object
                        // the file will be deleted when the session expires
                        Object tmg = session.getAttribute(sTmpFile);
                        TmpFileManager tmpFileMgr;
                        if (tmg == null || !(tmg instanceof TmpFileManager)) {
                            tmpFileMgr = new TmpFileManager();
                            tmpFileMgr.setTempFile(tempFile);
                            session.setAttribute(sTmpFile, tmpFileMgr);
                        } else {
                            tmpFileMgr = (TmpFileManager) tmg;
                        }
                    }
                } else if (formAction != null && formAction.startsWith(saveAsLabel)) {
                    // only allow requests from localhost
                    if (request.getRemoteAddr().equals("127.0.0.1")) {
                        response.setContentType("application/octet-stream; charset=UTF-8");
                        response.addHeader("Content-Disposition", "attachment; filename=\"" +
                                request.getParameter("saveasfile") + "\"");
                        out.write(sourceCode);
                    }
                    return;
                } else {
                    if ("Reset".equals(formAction)) {
                        File file = new File(tempFilePath);
                        if (file.exists()) {
                            file.delete();
                        }
                    } else {
                        if (new File(tempFilePath).exists()) {
                            temp = true;
                            fname = tempUrl;
                        }
                    }
                    FileInputStream fis = new FileInputStream(temp ? tempFilePath : application.getRealPath(src));
                    InputStreamReader isr = new InputStreamReader(fis, "UTF-8");
                    BufferedReader reader = new BufferedReader(isr);

                    String line;
                    StringBuffer sb = new StringBuffer();
                    while ((line = reader.readLine()) != null) {
                        sb.append(line);
                        sb.append("\n");
                    }
                    reader.close();
                    sourceCode = sb.toString();
                }
                String basefile = src.substring(src.lastIndexOf("/") + 1);

                String lzr = request.getParameter("lzr");
                if (lzr != null) {
                    lzr = "&amp;lzr=" + lzr;
                } else {
                    lzr = "";
                }
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>OpenLaszlo Explorer</title>
        <link rel="stylesheet" href="../lps/includes/explore.css" type="text/css">
    </head>
    
    <body class="source-view"
          onload="parent.swf.location.href='loading.jsp?src=<%= temp ? request.getContextPath() + "/" + tempUrl : request.getContextPath() + "/" + src%>&amp;showTaskBar=false<%= lzr%>';">
        
        <h2><%= title%></h2>
        
        <form method="post">
            <%if (errorMessage != null) {%><p>Error: <%=errorMessage%>  The program was not compiled.<p><%}%>
            <input name="src" type="hidden" value="<%= src%>">
            <textarea name="sourceCode" id="sourceCode" cols="58" rows="21" wrap="off"><%= quote(sourceCode)%></textarea><br>
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
                out.println("JSP error caught: " + e);
            }
%>
