<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.*,
      org.jdom.output.*"%>

<%
    int sec = 8;
    String s = request.getParameter("s");
    if (s != null) {
        sec = Integer.parseInt(s);
    }
	int msec = sec * 1000;
	out.println("<br><b>sleeping for " + sec + " seconds...</b></br>");
	out.flush();
	try {
		Thread.sleep(msec);
	} catch (Exception e) {
		out.println("<br><i>Caught exception</i></br>");
		out.flush();
	}
	out.println("<br><b>done</b></br>");
	out.flush();
%>
