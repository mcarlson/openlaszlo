<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.lang.Integer" %>

<%
    Thread.sleep( 1000 );
    response.setContentType("text/xml");
>>>> ORIGINAL twoheaders.jsp#1
    response.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
    response.setHeader("xFoo", "bar");
    response.setHeader("xFoo", "narg");
==== THEIRS twoheaders.jsp#2
    response.addHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
    response.addHeader("xFoo", "bar");
    response.addHeader("xFoo", "narg");
==== YOURS twoheaders.jsp
    response.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
    response.addHeader("xFoo", "bar");
    response.addHeader("xFoo", "narg");
<<<<
%>
<pinga>
</pinga>
