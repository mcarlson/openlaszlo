<?xml version="1.0" encoding="utf-8"?>
<%@page pageEncoding="UTF-8" contentType="text/xml" %>
<%@page import="java.util.*" %>
<%@page import="org.openlaszlo.lzproject.model.*" %>
<%@ taglib uri="http://jakarta.apache.org/taglibs/i18n-1.0" prefix="i18n" %>
<%
Locale myLocale = (Locale) session.getAttribute("myLocale");
User user = (User) session.getAttribute("user");
%>
<i18n:bundle baseName="org.openlaszlo.lzproject.LzTrackMessages"id="bundle" locale="<%= myLocale %>"/>
<app>
<%
if (user != null) {
%>
   <user>
		<login><%= user.getLogin()%></login>
		<realName><%= user.getRealName()%></realName>
		<lastLogin><i18n:formatDateTime value="<%=user.getLastLogin()%>" dateStyle="full" timeStyle="short" locale="<%=myLocale%>"/></lastLogin>
	</user>
<%
}
%>
	<currentLocale><%= myLocale %></currentLocale>
	<locales>
		<locale>
			<language>English</language>
			<code>en</code>
			<flag>resources/flags/us.jpg</flag>
		</locale>
		<locale>
			<language>German</language>
			<code>de</code>
			<flag>resources/flags/de.jpg</flag>
		</locale>
		<locale>
			<language>Korean</language>
			<code>ko</code>
			<flag>resources/flags/ko.jpg</flag>
		</locale>
		<locale>
			<language>Japanese</language>
			<code>jp</code>
			<flag>resources/flags/jp.jpg</flag>
		</locale>
	</locales>
	<login>
		<loginButton><i18n:message key="login.loginButton" /></loginButton>
		<loginMessage><i18n:message key="login.loginMessage" /></loginMessage>			
		<user><i18n:message key="login.user" /></user>
		<password><i18n:message key="login.password" /></password>
		<success><i18n:message key="login.success" /></success>
		<missingData><i18n:message key="user.login.missingData" /></missingData>
	</login>
	<project>
		<create>
			<newProject><i18n:message key="main.project.newProject" /></newProject>
			<newProjectMessage><i18n:message key="project.create.message" /></newProjectMessage>		
			<cancel><i18n:message key="project.create.cancel" /></cancel>		
			<save><i18n:message key="project.create.save" /></save>		
		</create>
	</project>
	<user>
		<create>
			<missingParameters><i18n:message key="user.create.missingParameters" /></missingParameters>
			<passwordMissmatch><i18n:message key="user.create.passwordMissmatch" /></passwordMissmatch>
		</create>
	</user>
	<main>
		<lastLogin><i18n:message key="main.lastLogin" /></lastLogin>
		<logout><i18n:message key="main.logout" /></logout>
		<project><i18n:message key="main.project" /></project>
		<dashboard><i18n:message key="main.dashboard" /></dashboard>
		<people><i18n:message key="main.people" /></people>
		<tasks><i18n:message key="main.tasks" /></tasks>
		<finishedTasks><i18n:message key="main.finishedTasks" /></finishedTasks>
		<dashboardTab>	
			<description><i18n:message key="main.project.description" /></description>	
			<overdue><i18n:message key="main.dashboard.overdue" /></overdue>	
		</dashboardTab>
		<projectTab>
			<deadline><i18n:message key="main.project.deadline" /></deadline>
			<description><i18n:message key="main.project.description" /></description>
			<title><i18n:message key="main.project.title" /></title>
			<newTask><i18n:message key="main.project.newTask" /></newTask>
			<taskDescription><i18n:message key="main.task.description" /></taskDescription>
			<createButton><i18n:message key="main.project.createButton" /></createButton>
		</projectTab>
		<peopleTab>
			<email><i18n:message key="main.people.email" /></email>	
			<realName><i18n:message key="main.people.realName" /></realName>		
			<newUser><i18n:message key="main.people.newUser" /></newUser>
			<editUser><i18n:message key="main.people.editUser" /></editUser>
			<cancel><i18n:message key="user.create.cancel" /></cancel>
		</peopleTab>
	</main> 
</app>
<!--
* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.         *
* Use is subject to license terms.                                       *
* X_LZ_COPYRIGHT_END *****************************************************
-->