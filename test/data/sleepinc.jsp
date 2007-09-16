<%@ page contentType="application/xml; charset=UTF-8" %>
<%@ page import="java.util.*,
      org.jdom.output.*"%>

<%
    Integer counter = null;
    Integer lock = (Integer) session.getAttribute("lock");

    synchronized(lock) {
        try {
            counter = (Integer) session.getAttribute("counter");
            if (counter == null) {
                counter = new Integer(0);
            }
            session.setAttribute("counter", new Integer(counter.intValue()+1));
        } catch (NumberFormatException e) {
            out.println(e.getMessage());
        }
    }
    int sec = 1;
    String s = request.getParameter("s");
    if (s != null) {
        sec = Integer.parseInt(s);
    }
    int msec = sec * 1000;
    try {
        Thread.sleep(msec);
    } catch (Exception e) {
        out.println("<result>Caught exception</result>");
        out.flush();
    }
out.println("<result>"+((counter == null) ? "counter is null" : counter.toString())+"</result>");
    out.flush();

/* * X_LZ_COPYRIGHT_BEGIN ************************************************** *
 * Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
 * Use is subject to license terms.                                          *
 * X_LZ_COPYRIGHT_END ****************************************************** */


%>
