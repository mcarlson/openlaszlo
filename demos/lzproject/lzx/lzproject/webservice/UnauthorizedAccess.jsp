<?xml version="1.0" encoding="utf-8"?>
<%@page pageEncoding="UTF-8" contentType="text/xml" %>
<%
String command = (String) request.getAttribute("command");
%>
<securityWarning>
	<message>Unauthorized access to REST web service</message>
	<url><%= request.getRequestURL() %></url>
	<restCommand><%= command %></restCommand>
</securityWarning>
<!--
* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.         *
* Use is subject to license terms.                                       *
* X_LZ_COPYRIGHT_END *****************************************************
-->