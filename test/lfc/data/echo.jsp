<%@ page import="java.util.*" %><%@ page import="java.io.*" %><%@ page import="java.lang.Integer" %><%@ page import="org.openlaszlo.xml.internal.XMLUtils" %><%
/* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
*/


    response.setContentType("text/xml");
    response.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
    StringBuffer buf = new StringBuffer();
    BufferedReader reader = request.getReader();
    String s = reader.readLine();
    StringBuffer bout = new StringBuffer();

    while (s != null) {
        buf.append(s);
        buf.append('\n');
        s = reader.readLine();
    }

    Enumeration attrs = request.getParameterNames();

    bout.append("<echo>\n");

    while(attrs.hasMoreElements()) {
        String a = (String)attrs.nextElement();
        String vals[] =  request.getParameterValues(a);
        if (vals.length == 1) {
            String p = XMLUtils.escapeXml(request.getParameter(a));
            if (p.length() > 100) {
                bout.append("next var truncted from " + p.length() + " to 100 chars");
                p = p.substring(100);
            }
            bout.append( "<"+a + ">" + p + "</"+a+">\n");
        } else {
            for(int i = 0; i < vals.length; i++) {
            bout.append( "<"+a + ">" + XMLUtils.escapeXml(vals[i]) + "</"+a+">\n");
            }
        }
    }

    attrs = request.getParameterNames();
    bout.append( "<data>\n<![CDATA[\n" );

    bout.append("\ngetRequestURL: \n"+request.getRequestURL());
    bout.append("\ngetQueryString: "+request.getQueryString());
    bout.append("\nBody:\n");
    bout.append(buf.toString());
    while(attrs.hasMoreElements()) {
        String a = (String)attrs.nextElement();
        String vals[] =  request.getParameterValues(a);
        if (vals.length == 1) {
            String p = request.getParameter(a);
            if (p.length() > 100) {
                bout.append("next var truncted from " + p.length() + " to 100 chars");
                p = p.substring(100);
            }
            bout.append( a + "=" + p + "\n"   );
        } else {
            for(int i = 0; i < vals.length; i++) {
                bout.append( a + "=" + vals[i] + "\n"   );
            }
        }
    }


    bout.append( "]]>\n</data>\n" );
    bout.append("<headers>\n");
    bout.append("<![CDATA[\n" );
    Enumeration headers = request.getHeaderNames();
    if (headers != null) {
        while(headers.hasMoreElements()) {
            String h = (String)headers.nextElement();
            bout.append("\n    Header: " + h + " : " + request.getHeader(h) );
        }
    } 

    bout.append("]]>\n" );
    bout.append("</headers>\n");
    bout.append( "\n<method type=\"" + request.getMethod() +"\"/>\n");



    bout.append( "</echo>" );

    out.write(bout.toString());

%>
