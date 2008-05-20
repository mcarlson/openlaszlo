<?xml version="1.0" encoding="utf-8"?>
<%@page pageEncoding="UTF-8" contentType="text/xml" %>
<%@page import="org.openlaszlo.lzproject.rest.*" %>
<%@page import="org.openlaszlo.lzproject.model.*" %>
<%@page import="java.util.*" %>
<%@ taglib uri="http://jakarta.apache.org/taglibs/i18n-1.0" prefix="i18n" %>
<%
Locale myLocale = (Locale) session.getAttribute("myLocale");
%>
<i18n:bundle baseName="org.openlaszlo.lzproject.LzTrackMessages"id="bundle" locale="<%= myLocale %>"/>
<response>
	<users>
<%
RestServiceResult result = (RestServiceResult) request.getAttribute("result");
Users users = (Users) request.getAttribute("users");
Vector list = users.getList();

if (list != null) {
	for (int i = 0; i<list.size(); i++) {
	  User user = (User) list.get(i);
%>
		<user>
		    <id><%= user.getId()%></id>
			<login><%= user.getLogin()%></login>
			<realName><%= user.getRealName()%></realName>
			<email><%= user.getEmail()%></email>
			<lastLogin><i18n:formatDateTime value="<%=user.getLastLogin()%>" dateStyle="full" timeStyle="short" locale="<%=myLocale%>"/></lastLogin>
		</user>
<%
	}
}
%>
	</users>
</response>
<!--
* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.         *
* Use is subject to license terms.                                       *
* X_LZ_COPYRIGHT_END *****************************************************
-->