<%@ page pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>

<%
String userAgent = request.getHeader("User-Agent");
String qParams ="";
String appName ="";
String bookmark = request.getParameter("bookmark");
if (bookmark == null ){ qParams = "bookmark=Welcome";}

Enumeration e = request.getParameterNames();
  while (e.hasMoreElements()) {
    String name = (String)e.nextElement();
    String value = request.getParameter(name);

    qParams += "&amp;" + name + "=" + value;
  }

if (userAgent.indexOf("MSIE") > 0 ){ // looks like MSIE
   qParams += "&amp;browser=IE";
}

%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN"
        "http://www.w3.org/TR/html4/frameset.dtd">
<HTML>
<HEAD>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title>OpenLaszlo Explorer</title>
<link href="../lps/includes/explore.css" rel="stylesheet" type="text/css">

</HEAD>
<frameset cols="200,*" border="0">
<frame name="nav" scrolling="no" src="explore-nav.lzx?<%= qParams %>&amp;lzt=html&amp;fb=1">
<frame name="content" scrolling="no" src="coverpages/welcome/">
</frameset>
</HTML>
<!--=======================================================================-->
<!-- Laszlo Explorer index.jsp                                             -->
<!--                                                                       -->
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!--=======================================================================-->

