<%@ page import="java.util.*" %>
<%@ page contentType="text/xml; charset=UTF-8" %>
<response>
<%

    String method = request.getMethod();

    request.setCharacterEncoding("UTF-8");

Enumeration params = request.getParameterNames();
while(params.hasMoreElements()) {
    String n = (String)params.nextElement();
    String[] v = request.getParameterValues(n);
    for(int i = 0; i < v.length; i++) {
        String ustr = v[i];
        
        // 888 640 4172 x 301277 IBM
        
        byte p[];
        if (method.equals("POST")) {
            
            // p = v[i].getBytes("UTF-8");      // WORKS for PROXIED POST
            
            p = v[i].getBytes("ISO-8859-1"); // WORKS for SERVERLESS POST
            
        } else {
            p = v[i].getBytes("ISO-8859-1");  // OK for GET, proxied and direct
        }
        
        
        String nstr = new String(p, 0, p.length, "UTF-8");
        
        // Print out the hex encoding for debugging 
        StringBuffer debug = new StringBuffer();
        for (int ci = 0; ci < p.length; ci++){
            debug.append(" 0x"+Integer.toString(( (char) (p[ci]) & 0xff), 16));
        }
        
        // parse query args (URLENCODING) to Unicode as UTF8
        out.print("<formcomponent method='"+method+"' name='" + n + "' hex='"+debug.toString()+"'><![CDATA[");
        
        out.print(nstr);
        out.println("]]></formcomponent>");
    }
}
%>
</response>
        
