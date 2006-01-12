<%@ page import="java.util.*, org.jdom.output.*"%>
<%
    int sec = 3;
    String s = request.getParameter("s");
    if (s != null) {
        sec = Integer.parseInt(s);
    }
    int msec = sec * 1000;

    try {
        Thread.sleep(msec);
    } catch (Exception e) {
    }

 response.sendRedirect("pixos.jpg");

%>
