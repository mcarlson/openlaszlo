<?xml version="1.0" encoding="utf-8"?>
<%@page pageEncoding="UTF-8" contentType="text/xml" %>
<%@page import="org.openlaszlo.lzproject.rest.*" %>
<%@page import="org.openlaszlo.lzproject.model.*" %>
<%@page import="java.util.*" %>
<%@page import="java.text.*" %>
<%@ taglib uri="http://jakarta.apache.org/taglibs/i18n-1.0" prefix="i18n" %>
<%
Locale myLocale = (Locale) session.getAttribute("myLocale");
%>
<i18n:bundle baseName="org.openlaszlo.lzproject.LzTrackMessages"id="bundle" localeRef="myLocale" debug="true"/>
<response>
	<currentLocale><%= myLocale %></currentLocale>
	<rest><i18n:message key="main.tasks"/></rest>
	<tasks>
<%
RestServiceResult result = (RestServiceResult) request.getAttribute("result");
Tasks tasks = (Tasks) request.getAttribute("tasks");
Vector list = tasks.getList();

 // Workaround until this bug (http://issues.apache.org/bugzilla/show_bug.cgi?id=32904)
 // is fixed by the I18N taglib team
Format longFormat = new SimpleDateFormat().getDateInstance(DateFormat.LONG, myLocale);
Format mediumFormat = new SimpleDateFormat().getDateInstance(DateFormat.MEDIUM, myLocale);

if (list != null) {
	for (int i = 0; i<list.size(); i++) {
		Task task = (Task) list.get(i);
	  	if (task.getFinished() == 0) {
%>
		<task id="<%= task.getId()%>" deadlineMillis="<%= task.getDeadline().getTime()%>">
			<name><%= task.getTitle() %></name>
			<created><%= mediumFormat.format(task.getCreated()) %></created>
			<description><![CDATA[<%= task.getDescription() %>]]></description>
			<projectName id="<%= task.getProjectId()%>"><%= task.getProjectName()%></projectName>
			<deadline><%= longFormat.format(task.getDeadline()) %></deadline>
			<finished><%= task.getFinished() %></finished>			
		</task>
<%
		}
	}
}
%>
	</tasks>
	<finishedTasks>
<%
if (list != null) {
	for (int i = 0; i<list.size(); i++) {
		Task task = (Task) list.get(i);
	  	if (task.getFinished() == 1) {
%>
		<task id="<%= task.getId()%>" deadlineMillis="<%= task.getDeadline().getTime()%>">
			<name><%= task.getTitle() %></name>
			<created><%= mediumFormat.format(task.getCreated()) %></created>
			<description><![CDATA[<%= task.getDescription() %>]]></description>
			<projectName id="<%= task.getProjectId()%>"><%= task.getProjectName()%></projectName>
			<deadline><%= longFormat.format(task.getDeadline()) %></deadline>			
		</task>
<%
		}
	}
}
%>
	</finishedTasks>
</response>
<!--
* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.         *
* Use is subject to license terms.                                       *
* X_LZ_COPYRIGHT_END *****************************************************
-->