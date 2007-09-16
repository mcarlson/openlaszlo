<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%
    String apptitle = request.getParameter("title");
    String lzr = request.getParameter("lzr");
    String title = "OpenLaszlo Editor";
    
    if (apptitle != null) {
      title += ": " + apptitle;
    } else {
      apptitle = title;
    }
    
    if (lzr == null) {
      lzr = "";
    } else {
      lzr = "&amp;lzr=" + lzr;
    }
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN"
        "http://www.w3.org/TR/html4/frameset.dtd">

<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title><%= title %></title>
  </head>

  <frameset cols="550,*" frameborder="1" border="4" framespacing="2">
    <frame name="src" src="source.jsp?src=<%= request.getParameter("src") %>&amp;title=<%= apptitle %><%= lzr %>">
    <frame name="swf" src="welcome_swf.html">
  </frameset>
</html>
