

<%@ page import="java.util.*,java.io.*" contentType="text/xml" %>
<info>
<%!
/** 
 * Get cookie to store information.
 * @param name: name of cookie
 * @param cookies: client cookies
 */
Cookie getCookie(String name, Cookie[] cookies) {

    if (cookies != null) {
        for (int i=0; i < cookies.length; i++) { 
            Cookie cookie = cookies[i];
            if (cookie.getName().equals(name)) {
                return cookie;
            }
        }
    }

    return new Cookie(name, "");
}

void showCookie(JspWriter out, Cookie cookie) throws IOException {
    out.println("<success/>");
    out.print("<data>");
    Map map = getCookieValues(cookie);    
    Iterator iter = map.entrySet().iterator();
    while (iter.hasNext()) {
        Map.Entry e = (Map.Entry)iter.next();
        String k = (String)e.getKey();
        out.println("<" + k + ">" + (String)e.getValue() + "</" + k + ">\n");
    }
    out.println("</data>");    
}

Map getCookieValues(Cookie cookie) throws IOException{
    // saved as key1=val1&key2=val2&...
    String str = cookie.getValue();
    StringTokenizer st = new StringTokenizer(cookie.getValue(), "&");
    Map map = new HashMap();
    while (st.hasMoreTokens()) {
        String pair = st.nextToken();
        int index = pair.indexOf('=');
        if (index == -1 || index == 0) continue;
        String k = pair.substring(0, index);
        String v = pair.substring(index+1);
        map.put(k, v);
    }
    return map;
}

/**
 * Copy parameter key/value pairs into cookie. Skips "op" and "name" parameters.
 */
void setValues(JspWriter out, Cookie cookie, Map params) throws IOException{

    Iterator iter = params.entrySet().iterator();
    Map cookieValues = getCookieValues(cookie);
    while (iter.hasNext()) {
        Map.Entry e = (Map.Entry)iter.next();
        String k = (String)e.getKey();

        // skip op and name
        if (k.equals("op") || k.equals("name")) continue;

        String[] values = (String[])e.getValue();
        cookieValues.put(k, values[0]);
    }

    String newvalue = "";
    iter = cookieValues.entrySet().iterator();
    while (iter.hasNext()) {
        Map.Entry e = (Map.Entry)iter.next();
        String k = (String)e.getKey();
        String v = (String)e.getValue();
        newvalue += k + "=" + v + "&";
    }

    cookie.setValue(newvalue);
}

%>

<%
    // operation
    String op = request.getParameter("op");
    if ( op == null || op.equals("") ) {
        out.println("<status>error</status>\n<message>op: null or empty</message>\n");
        out.println("</info>");
        return;
    }

    // name of cookie
    String name = request.getParameter("name");
    if (name == null || name.equals("") ) {
        out.println("<status>error</status>\n<message>name: null or empty</message>\n");
        out.println("</info>");
        return;
    }

    Cookie cookie = getCookie(name, request.getCookies());
    if ( op.equals("get") ) {
        showCookie(out, cookie);
    } else if ( op.equals("set") ) {
        setValues(out, cookie, request.getParameterMap());
        response.addCookie(cookie);
        showCookie(out, cookie);
    } else {
        out.println("<status>error</status>\n<message>no such op: " + op + "</message>\n");
    }
%>
</info>
