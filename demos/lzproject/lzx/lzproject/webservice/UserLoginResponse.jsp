<?xml version="1.0" encoding="utf-8"?>
<%@page pageEncoding="UTF-8" contentType="text/xml" %>
<%@page import="java.util.*" %>
<%@page import="org.openlaszlo.lzproject.model.*" %>
<%@page import="org.openlaszlo.lzproject.rest.*" %>
<%@ taglib uri="http://jakarta.apache.org/taglibs/i18n-1.0" prefix="i18n" %>
<%
Locale myLocale = (Locale) session.getAttribute("myLocale");
%>
<i18n:bundle baseName="org.openlaszlo.lzproject.LzTrackMessages"id="bundle" locale="<%=myLocale%>"/><response>
<%
User user = (User) session.getAttribute("user");
RestServiceResult result = (RestServiceResult) request.getAttribute("result");
if (! result.isError()) {
%>
<success>
<locale><%=myLocale%></locale>
<message><%= result.getMessage() %></message>
<id><%= user.getId()%></id>
<login><%= user.getLogin()%></login>
<realName><%= user.getRealName()%></realName>
<lastLogin><i18n:formatDateTime value="<%=user.getLastLogin()%>" dateStyle="full" timeStyle="short" locale="<%=myLocale%>"/></lastLogin>
</success>
<% } else { %>
<failure>
<errorMsg><%= result.getMessage() %></errorMsg>
<%	if (result.getSqlState() != null && result.getSqlState().length() > 0) { %>
<errorNo><%= result.getSqlState() %></errorNo>
<% 	} %>
</failure>
<% } %>
</response>
<!--
* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.         *
* Use is subject to license terms.                                       *
* X_LZ_COPYRIGHT_END *****************************************************
-->