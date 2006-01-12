<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%
    response.setContentType("text/xml");
    response.setHeader("Expires", "Fri, 05 Oct 2001 00:00:00 GMT");
%>
<now>
<%
    out.print( System.currentTimeMillis() );
%>
</now>
