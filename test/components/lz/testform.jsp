<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page contentType="text/xml" %>
<%@ page import="java.util.*" %>
<response>
    <% Enumeration params = request.getParameterNames();
        while(params.hasMoreElements()) {
            String n = (String)params.nextElement();
            String[] v = request.getParameterValues(n);
            for(int i = 0; i < v.length; i++) {
                out.print("<formcomponent name='" + n + "'><![CDATA[");
                out.print(v[i]);
                out.println("]]></formcomponent>");
            }
        } %>
</response>
