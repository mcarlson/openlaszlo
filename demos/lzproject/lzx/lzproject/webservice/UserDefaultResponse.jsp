<?xml version="1.0" encoding="utf-8"?>
<%@page pageEncoding="UTF-8" contentType="text/xml" %>
<%@page import="org.openlaszlo.lzproject.rest.*" %>
<response>
<%
RestServiceResult result = (RestServiceResult) request.getAttribute("result");
if (! result.isError()) {
%>
<success>
<message><%= result.getMessage() %></message>
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