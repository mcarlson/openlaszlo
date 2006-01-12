<!--=======================================================================-->
<!--                                                                       -->
<!-- host.jsp                                                              -->
<!--                                                                       -->
<!-- A JSP to send the hostname in XML.                                    -->
<!--=======================================================================-->
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page import="java.net.InetAddress" %>
<%
    response.setContentType("text/xml");
%>
<info>
    <host name="<%= InetAddress.getLocalHost().getHostAddress() %>" />
</info>
