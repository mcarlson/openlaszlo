<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>
<%@ page import="javax.servlet.http.HttpServlet" %>

<%@ page import="java.io.*" %>
<%@ page import="java.net.*" %>
<%@ page import="java.util.Properties" %>
<%@ page import="java.util.Date" %>
<%@ page import="javax.servlet.ServletConfig" %>
<%@ page import="javax.servlet.ServletException" %>
<%@ page import="javax.servlet.ServletOutputStream" %>
<%@ page import="org.openlaszlo.utils.FileUtils" %>
<%@ page import="org.openlaszlo.utils.StringUtils" %>
<%@ page import="org.openlaszlo.server.ConfigDir" %>
<%@ page import="org.openlaszlo.server.LPS" %>

<%

/******************************************************************************
 * Handler for LzUnit tests 
 *
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

/** Accepts a filename and message, and writes message data to the file
    <pre>
    All commands require:
    logfile=my-lzunit.log  
    </pre>

     $ curl -L "http://localhost:8080/lps-ginger/test/lzunit/Logger.jsp?logfile=lzunit.log&msg=foo+bar"
*/

response.setContentType("text/xml");

String logfile = request.getQueryString();
logfile = URLDecoder.decode(logfile.substring(logfile.indexOf("logfile=")+8));

//String logfile = "lzunit.log";

out.println("<lps>"+logfile);

if (logfile == null) {
    out.println("<error>no logfile parameter supplied to lzunit request</error>");
    out.println("</lps>");
    return;
}

out.println("<status>start logging to "+logfile+"</status>");
writeRawLogMessage(logfile, request.getInputStream());
out.println("</lps>");

%>

<%!
    /** Dump log file to output stream */
    static void printLog(Writer out, String logfile) throws IOException {
        FileUtils.send(getLogReader(logfile), out);
    }

%>

<%!

    static void writeRawLogMessage(String logfile, InputStream is) throws IOException {
        OutputStream log = getLogStream(logfile);
        // read data from POST
        FileUtils.send(is, log);        
        log.close();
    }
%>

<%!

    static String getLogFilePath(String logfile) {
        return LPS.getWorkDirectory() + File.separator + "logs" + File.separator + logfile;
    }
%>

<%!

    static OutputStream getLogStream(String logfile) throws IOException {
        String path = getLogFilePath(logfile);
        return new FileOutputStream(path, true);
    }
%>

<%!
    static Reader getLogReader(String logfile) throws IOException {
        return new FileReader(getLogFilePath(logfile));
    }
%>

