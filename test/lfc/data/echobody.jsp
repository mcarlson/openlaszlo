<%@ page import="java.util.*" %><%@ page import="java.io.*" %><%@ page import="java.lang.Integer" %><%@ page import="org.openlaszlo.xml.internal.XMLUtils" %><%
/* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
*/


    response.setContentType("text/xml");
    response.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
    Enumeration attrs = request.getParameterNames();
    out.println("<echo>\n");
    while(attrs.hasMoreElements()) {
        String a = (String)attrs.nextElement();
        String vals[] =  request.getParameterValues(a);
        if (vals.length == 1) {
            String p = XMLUtils.escapeXml(request.getParameter(a));
            if (p.length() > 100) {
                out.println("next var truncted from " + p.length() + " to 100 chars");
                p = p.substring(100);
            }
            out.println( "<"+a + ">" + p + "</"+a+">\n");
        } else {
            for(int i = 0; i < vals.length; i++) {
            out.println( "<"+a + ">" + XMLUtils.escapeXml(vals[i]) + "</"+a+">\n");
            }
        }
    }

    out.println( "<method type=\"" + request.getMethod() +"\"/>");

    out.println( "</echo>" );

%>
