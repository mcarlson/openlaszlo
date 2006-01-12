<%@ page contentType="text/xml" %>
<%

	/* X_LZ_COPYRIGHT_BEGIN ***************************************************
	* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
	* Use is subject to license terms.                                            *
	* X_LZ_COPYRIGHT_END ******************************************************/


    final String hawaii = "hawaii";
    final String paris = "paris";
    final String jamaica = "jamaica";

    Integer h, p, j;

    // Initialize vote counts
    if ((h = (Integer)application.getAttribute(hawaii)) == null) {
        application.setAttribute(hawaii, h = new Integer(30));
    } 
    if ((p = (Integer)application.getAttribute(paris)) == null) {
        application.setAttribute(paris, p = new Integer(28));
    }
    if ((j = (Integer)application.getAttribute(jamaica)) == null) {
        application.setAttribute(jamaica, j = new Integer(32));
    }

    String vote = request.getParameter("vote"); 
    String status = "ok";

    // Parse the incoming vote
    try {
        if (vote == null) {
            status = "Vacation option was null";
        } else if (paris.equalsIgnoreCase(vote)) {
            application.setAttribute(paris, new Integer(p.intValue()+1));
        } else if (hawaii.equalsIgnoreCase(vote)) {
            application.setAttribute(hawaii, new Integer(h.intValue()+1));
        } else if (jamaica.equalsIgnoreCase(vote)) {
            application.setAttribute(jamaica, new Integer(j.intValue()+1));
        } else {
            status = "Bad vacation choice: " + vote;
        }

    } catch (Exception e) {
        status = e.getClass().getName() + " " + e.getMessage();
    }

    int hv = ((Integer)application.getAttribute(hawaii)).intValue();
    int pv = ((Integer)application.getAttribute(paris)).intValue();
    int jv = ((Integer)application.getAttribute(jamaica)).intValue();
%>
<response status="<%= status %>">
    <vote><%= vote %></vote>
    <summary total="<%=hv+pv+jv%>">
        <option name="Hawaii"><%= hv %></option>
        <option name="Paris"><%= pv %></option>
        <option name="Jamaica"><%= jv %></option>
    </summary>
</response>
