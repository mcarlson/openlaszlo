<?xml version="1.0" encoding="UTF-8"?><response><content><htmlscrape><title type="text">E!Online Entertainment News</title><items><item><img><![CDATA[http://www.eonline.com/News/Photos/a/aniston.pitt.041603.jpg]]></img><title><![CDATA[Brad, Jen's Divorce: Done Deal]]></title><link><![CDATA[http://www.eonline.com/News/Items/0,1,17202,00.html]]></link><summary><![CDATA[Judge signs off on paperwork, will become official in October; neither actor can remarry until then]]></summary></item><item><title><![CDATA[Newton-John Boyfriend Mystery]]></title><link><![CDATA[http://www.eonline.com/News/Items/0,1,17203,00.html]]></link><summary><![CDATA[Man missing for seven weeks; singer-actress calls on anyone with information to come forward]]></summary></item><item><title><![CDATA[Scarlett Driven to Distraction]]></title><link><![CDATA[http://www.eonline.com/News/Items/0,1,17206,00.html]]></link><summary><![CDATA[<i>Lost in Translation</i> star in minor car accident at Disneyland while averting paparazzi]]></summary></item><item><title><![CDATA[Lawsuit Finds &quot;Lost&quot;]]></title><link><![CDATA[http://www.eonline.com/News/Items/0,1,17207,00.html]]></link></item><item><title><![CDATA[Bo Bice Has Emergency Surgery]]></title><link><![CDATA[http://www.eonline.com/News/Items/0,1,17205,00.html]]></link></item><item><title><![CDATA[R.I.P., &quot;Six Feet Under&quot;]]></title><link><![CDATA[http://www.eonline.com/News/Items/0,1,17200,00.html]]></link></item><item><title><![CDATA[Donald Trump Goes to China]]></title><link><![CDATA[http://www.eonline.com/News/Items/0,1,17204,00.html]]></link></item><item><title><![CDATA[Thompson Goes Out with a Bang]]></title><link><![CDATA[http://www.eonline.com/News/Items/0,1,17201,00.html]]></link></item></items></htmlscrape></content></response>
<%@ page import="java.util.*,
      org.jdom.output.*"%>
<%
    int sec = 8;
    String s = request.getParameter("s");
    if (s != null) {
        sec = Integer.parseInt(s);
    }
	int msec = sec * 1000;
	try {
		Thread.sleep(msec);
	} catch (Exception e) {
		out.println("<br><i>Caught exception</i></br>");
		out.flush();
	}
%>
