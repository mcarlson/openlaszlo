You need to add the following two nodes in the web.xml of the web application
where you're trying to access LPSTest.jws:

    <servlet>
      <servlet-name>AxisServlet</servlet-name>
      <servlet-class>
          org.apache.axis.transport.http.AxisServlet
      </servlet-class>
    </servlet>

    <servlet-mapping>
      <servlet-name>AxisServlet</servlet-name>
      <url-pattern>*.jws</url-pattern>
    </servlet-mapping>


You also need to make sure you have the Axis libraries in your WEB-INF/lib
(mainly axis.jar, possibly others).
