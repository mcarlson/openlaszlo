<%@ page import="java.util.*" %><%@ page import="java.io.*" %><%@ page contentType="text/xml; charset=UTF-8" %><?xml version='1.0' encoding='UTF-8' standalone='yes' ?>
<response><%
/* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              */
Integer seq = (Integer) session.getAttribute("seq");
if (seq ==null) {
    seq = new Integer(0);
}

out.print(seq);

session.setAttribute("seq", new Integer(seq.intValue() + 1));
%></response>
