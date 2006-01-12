<?xml version="1.0"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->



<%@ page import="java.util.*" %>
<%@ page contentType="text/xml; charset=UTF-8" %>

<response>
    <% 

      ////////////////

      Enumeration params = request.getParameterNames();
         while(params.hasMoreElements()) {
         String n = (String)params.nextElement();
         String[] v = request.getParameterValues(n);
         for(int i = 0; i < v.length; i++) {
             String str = v[i];
             // parse query args (URLENCODING) to Unicode as UTF8
             byte p[] = str.getBytes("8859_1");
             String ustr = new String(p, 0, p.length, "UTF-8");

             out.print("<formcomponent name='" + n + "'><![CDATA[");
             out.print(ustr);
             out.println("]]></formcomponent>");
            }
        } %>
</response>
