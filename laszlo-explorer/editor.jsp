<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%
    String apptitle = request.getParameter("title");
    String title = "Laszlo Editor";
    if (apptitle != null)
      title += ": " + apptitle;
%>

<html>
  <head>
    <title><%=title%></title>
  </head>

  <frameset cols="550,*" frameborder="1" border="4" framespacing="2">
    <frame name="src" src="source.jsp?src=<%=request.getParameter("src")%><%if (apptitle != null){%>&title=<%=apptitle%><%}%>">
    <frame name="swf" src="welcome_swf.html">
  </frameset>
</html>