<%@ page import="java.util.*" %><%@ page import="java.io.*" %>
<%@ page contentType="text/xml; charset=UTF-8" %>
<?xml version='1.0' encoding='UTF-8' standalone='yes' ?>
<response><%
/* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
        */

String val = request.getParameter("seq");
out.print(val);

%></response>