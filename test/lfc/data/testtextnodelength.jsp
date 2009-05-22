<?xml version="1.0" encoding="UTF-8" ?><%@ page contentType="text/xml; charset=UTF-8" %>
<%!

/* X_LZ_COPYRIGHT_BEGIN *************************************************** *
 * Copyright 2009 Laszlo Systems, Inc.  All Rights Reserved.                *
 * Use is subject to license terms.                                         *
 * X_LZ_COPYRIGHT_END ***************************************************** */

private String repeatString (char c, int times) {
    if (times <= 0) return "";
    StringBuilder s = new StringBuilder(times);
    StringBuilder tmp = new StringBuilder(times);
    tmp.append(c);
    for (int i = 0;;) {
        if (((times >> i) & 1) == 1) {
            s.append(tmp);
        }
        if ((1 << ++i) <= times) {
            tmp.append(tmp);
        } else break;
    }
    return s.toString();
}
%>
<%
    String sTimes = request.getParameter("times");
    String sChar = request.getParameter("char");

    int times = 0;
    if (sTimes != null) {
        try {
            times = Integer.parseInt(sTimes);
            if (times < 0) times = 0;
        } catch (NumberFormatException e) {
        }
    }

    char c = 'a';
    if (! (sChar == null || sChar.length() != 1)) {
        c = sChar.charAt(0);
    }

%><b><%= this.repeatString(c, times) %></b>
