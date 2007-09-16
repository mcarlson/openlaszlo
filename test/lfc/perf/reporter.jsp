<%@ page isThreadSafe="false" %>
<%@ page import="java.text.MessageFormat" %>
<%@ page import="javax.servlet.http.*" %>
<%@ page import="java.util.logging.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.io.FileWriter" %>


<%

    // Copyright 2006 Laszlo Systems
    // reporter.jsp
    // Records performance metrics results to a log file on the server
    // For a usage example, see test/lfc/perf/viewperf.lzx

    // The response can be ignored; the important thing is that the
    // log file record the information
    response.setContentType("text/xml");

    out.println("<perf>");

    // Open the log file path be relative to the server root
    ServletContext ctx = getServletConfig().getServletContext();
    String pathToLogFile = ctx.getRealPath("/test/lfc/perf/results.txt");
    // Append to the end of the log file
    java.io.FileWriter fw = new FileWriter(pathToLogFile, true);

    // Collect information from the request describing the test results
    String testname = request.getParameter("testname");
    String suitename = request.getParameter("suitename");    
    String duration = request.getParameter("duration");
    String branch = request.getParameter("branch");
    String count = request.getParameter("count");
    String min = request.getParameter("min");
    String max = request.getParameter("max");
    String runtime = request.getParameter("runtime");
    String isdebug = request.getParameter("debug");
    String buildid = request.getParameter("buildid");
    String uncertainty = request.getParameter("uncertainty");
    String builddate = request.getParameter("builddate");
    String userAgent = request.getHeader("User-Agent");
    userAgent = URLEncoder.encode(userAgent, "UTF-8");
    String clientIPaddr = request.getRemoteHost();
    String comment = request.getParameter("comment");         
 
    String msg = new StringBuilder().append("testname=").append(testname).
            append(" suitename=").append(suitename).
            append(" duration=").append(duration).
            append(" count=").append(count).
            append(" min=").append(min).
            append(" max=").append(max).
            append(" uncertainty=").append(uncertainty).
            append(" runtime=").append(runtime).
            append(" buildid=").append(buildid).
            append(" debug=").append(isdebug).
            append(" builddate=").append(builddate).
            append(" branch=").append(branch).            
            append(" browserinfo=").append(userAgent).
            append(" comment=").append(clientIPaddr).                                             
            append(System.getProperty("line.separator")).toString();

    fw.write(msg);

    out.println(
            "<status>ok</status>");
    out.println(
            "<msg>" + msg + "</msg>");

    out.println("</perf>");

    fw.close();

%>
