<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<% 
String fname = request.getParameter("foo");

PrintWriter op = new PrintWriter(new FileWriter("/tmp/myscript.txt"));

Enumeration params = request.getParameterNames();
while(params.hasMoreElements()) {
    String n = (String)params.nextElement();
    String[] v = request.getParameterValues(n);
    op.println(n+": "+v[0]);
}


op.close();
response.sendRedirect(fname);

%>
