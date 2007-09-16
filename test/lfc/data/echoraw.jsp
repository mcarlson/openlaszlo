<%@ page import="java.util.*" %><%@ page import="java.io.*" %><%@ page contentType="text/xml; charset=UTF-8" %><?xml version='1.0' encoding='UTF-8' standalone='yes' ?>
<response>
<echo><%
// echo raw posted data input stream back as XML response
request.setCharacterEncoding("UTF-8");
InputStream input = request.getInputStream();
byte[] buffer = new byte[100000];
int b;
while (( b = input.read(buffer)) >= 0) {
    out.write(new String(buffer, 0, b));
}
/*
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
*/
%></echo>
</response>
    
