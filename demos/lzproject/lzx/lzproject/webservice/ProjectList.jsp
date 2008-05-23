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
<i18n:bundle baseName="org.openlaszlo.lzproject.LzTrackMessages"id="bundle" localeRef="myLocale"/>
<response>
	<currentLocale><%= myLocale %></currentLocale>
	<projects>
<%
Projects projects = (Projects) request.getAttribute("projects");
Vector list = projects.getList();

 // Workaround until this bug (http://issues.apache.org/bugzilla/show_bug.cgi?id=32904)
 // is fixed by the I18N taglib team
Format longFormat = new SimpleDateFormat().getDateInstance(DateFormat.LONG, myLocale);
Format mediumFormat = new SimpleDateFormat().getDateInstance(DateFormat.MEDIUM, myLocale);

if (list != null) {
	for (int i = 0; i<list.size(); i++) {
	  Project project = (Project) list.get(i);
%>
		<project id="<%= project.getId()%>">
			<name><%= project.getName() %></name>
			<started><%= mediumFormat.format(project.getStarted()) %></started>
			<description><![CDATA[<%= project.getDescription() %>]]></description>
			<running><i18n:message key="main.dashboard.running">
					 	<i18n:messageArg value="<%= longFormat.format(project.getStarted()) %>"/>
					 	<i18n:messageArg value="<%= new Integer(project.getDaysRunning()) %>" />
				 	</i18n:message></running>
		</project>
<%
	}
}
%>
	</projects>
</response>
<!--
* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.         *
* Use is subject to license terms.                                       *
* X_LZ_COPYRIGHT_END *****************************************************
-->
