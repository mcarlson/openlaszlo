<!--=======================================================================-->
<!--                                                                       -->
<!-- hello.jsp                                                             -->
<!--                                                                       -->
<!--    A simple JSP that produces an LZX application containing the       -->
<!--  the current date and time.                                           -->
<!--=======================================================================-->
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->

<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>

<canvas>
  <window resizable="true" width="300" height="200" title="LZX JSP Pre-Processing Example" >
    <simplelayout axis="y" />
    <text>
      Current date and time: <%= (new java.util.Date()).toLocaleString() %>
      </text>
    <text>Session id is: <%= request.getSession().getId() %></text>
    <text>Parameters: </text>
    <view x="30" width="300" >
        <simplelayout axis="y" />
    <%
        Enumeration e = request.getParameterNames();
        PrintWriter o = response.getWriter ();
        while (e.hasMoreElements()) {
            String name = (String)e.nextElement();
            String value = request.getParameter(name);
     %>
            <text> <%= name %>   <%= value %> </text> 
     <%       
        }
     %>
     </view>
    <scrollbar axis="x"/>
  </window>
</canvas>
