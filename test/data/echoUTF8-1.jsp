<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page contentType="text/xml; charset=UTF-8" %>
<%
    InputStream is = request.getInputStream();
    out.println("<response>");
// read into byte array
ByteArrayOutputStream bs = new ByteArrayOutputStream();

int c = 0;
byte[] buffer = new byte[1024];
int b = 0;

while((b = is.read(buffer)) > 0) {
    c += b;
    bs.write(buffer, 0, b);
}
// convert to string
    String query = new String(bs.toByteArray(), "UTF-8");

// Print out the hex encoding for debugging 
StringBuffer debug = new StringBuffer();
byte p[] = bs.toByteArray();

for (int ci = 0; ci < p.length; ci++){
                 debug.append(" 0x"+Integer.toString(( (char) (p[ci]) & 0xff), 16));
             }



    out.print("<formcomponent name='" + "rawdata" + "' hex='"+debug.toString()+"'><![CDATA[");
             out.print(URLDecoder.decode(query, "UTF-8"));
             out.println("]]></formcomponent>");


%>
</response>
