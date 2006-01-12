<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
    <%@ page import="java.util.*" %>
      <%@ page import="java.io.*" %>
      <html>
	  <%
	    String actionParam = request.getParameter("action");
	    if (actionParam == null ){ actionParam = "";}
	    String srcParam = request.getParameter("src");
	    if (srcParam == null ){ srcParam = "/laszlo-explorer/loading.html";}


	    String appName = request.getContextPath();
	    String dParam = "";
	    dParam += request.getParameter("display");
	    String qParams ="";

	    Enumeration e = request.getParameterNames();
	    while (e.hasMoreElements()) {
	      String name = (String)e.nextElement();
	      String value = request.getParameter(name);
      	      if (value == null ){ value = "";}
	      qParams += "&" + name + "=" + value;
	    }
	    if (actionParam.equals("edit")){
	    if (dParam.equals("enhanced")){%>
	    <frameset rows="*" frameborder="0" border="0" framespacing="2">
	      <% } else {%>
	      <frameset rows="*" frameborder="1" border="4" framespacing="2">
		  <%}%>
		    <frame name="src" src="editor.jsp?<%= qParams %>"/>
		  </frameset>

	      <%} else if (actionParam.equals("explore_welcome")){ %>
                  <frameset rows="445,*" frameborder="1" border="4" framespacing="2">
                      <frameset cols="515,*" frameborder="1" border="4" framespacing="2">
                            <frame name="src" src="welcome.html?<%= qParams %>"/>
                            <frame name="swf" src="welcome_swf.html"/>
                      </frameset>
                      <frame name="doc" src="welcome_doc.html?<%= qParams %>">
                  </frameset>
	      <%} else if (actionParam.equals("explore")){   %>
                  <frameset rows="445,*" frameborder="1" border="4" framespacing="2">
                      <frameset cols="515,*" frameborder="1" border="4" framespacing="2">
                            <frame name="src" src="source.jsp?<%= qParams %>"/>
                            <frame name="swf" src="welcome_swf.html"/>
                      </frameset>
                      <frame name="doc" src="doc.jsp?<%= qParams %>">
                  </frameset>
		<%} else if (actionParam.equals("source")){%>
		    <frameset rows="*" frameborder="0" border="0" framespacing="0">
		      <frame src="<%= appName %>/lps/utils/viewer/viewer.jsp?file=<%=srcParam %>"/>
		    </frameset>
		  <%} else { %>
		    <frameset rows="*" frameborder="0" border="0" framespacing="0">
			<frame src="content_load.jsp?src=<%= appName + srcParam %>&lzt=html"/>
		    </frameset>
		    <%}%>



      </html>

