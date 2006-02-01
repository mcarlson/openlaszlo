<?xml version="1.0" encoding="utf-8"?>

<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                version="1.0">

  <xsl:output method="html"
              indent="yes"
              doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN"
              doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>
  
  <xsl:template match="/">
<html>
  <head>
    <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/favicon.ico"/>
    <title>
      Deploying This Application
    </title>
    <style type="text/css">
      pre {border: 1px solid; background-color: #eef}
    </style>
  </head>
  <body>
      <h1>Deploying This Application</h1>
      
      <h2>Using the HTML Wrapper</h2>
      <p>The simplest way to deploy an application is to use the
      <code>html</code> request type.  This generates an HTML page
      that uses the JavaScript <code>embed.js</code> library to embed the
      application.  Unlike the development page (with no request
      type), it does not display the developer console and compiler
      warnings.</p>
      
      <p>View the result of the HTML deployment page <a
      href="{/canvas/request/@url}?lzt=html{/canvas/request/@query_args}">here</a>.
      (Note that this page is generated dynamically in the browser,
      adapting to the particular browser's capabilities, so the
      browser source view is not equivalent to the HTML deployment
      page source.)</p>
      
      <h2>Deployment with an Embedded <code>object</code> Tag</h2>
      <p>The application can also be embedded within a page that does
      not use the JavaScript library.  This can be a good choice if you
      expect many clients to have JavaScript disabled in their
      browser.</p>
      
      <p>View the HTML page with the embedded object tag <a
      href="{/canvas/request/@url}?lzt=html-object{/canvas/request/@query_args}">here</a>.
      (Note that while this page is generated dynamically by the
      server, adapting to the particular browser's capabilities, only
      Internet Explorer on Windows gets special treatment; the code
      generated for all other browsers is XHTML 1.0 compliant.  The
      code generated for Internet Explorer on Windows uses proprietary
      extensions to ensure that the correct version of the Flash
      plug-in is installed.  Internet Explorer on Windows can also
      display the XHTML 1.0 version, so if you need to embed your
      application into a larger static page, you should use the XHTML
      1.0 version.)</p>

      <p>To deploy using static XHTML 1.0 compliant code, place the
      following in your HTML document where the OpenLaszlo application
      should appear:</p>

      <pre>&lt;object type="application/x-shockwave-flash"
        data="<xsl:value-of select='canvas/request/@url' />?lzt=swf<xsl:value-of select='canvas/request/@query_args' />"
        width="<xsl:value-of select='canvas/@width' />" height="<xsl:value-of select='canvas/@height' />">
  &lt;param name="movie" value="<xsl:value-of select='canvas/request/@url' />?lzt=swf<xsl:value-of select='canvas/request/@query_args' />" />
  &lt;param name="quality" value="high" />
  &lt;param name="scale" value="noscale" />
  &lt;param name="salign" value="LT" />
  &lt;param name="menu" value="false" />
&lt;/object></pre>
      
      <h2>Deployment with the JavaScript <code>embed.js</code> Library</h2>
      <p>To deploy using the JavaScript <code>embed.js</code> library,
      place the following line within the <code>&lt;head&gt;</code>
      section of the HTML document that embeds the OpenLaszlo
      application:</p>
      
      <pre>&lt;script src="<xsl:value-of select="/canvas/request/@lps"/>/lps/includes/embed.js" type="text/javascript">&lt;/script></pre>
      
      <p>Place the following element within the <code>&lt;body></code>
      section of the document, at the location where the Laszlo
      application should appear:</p>
      
      <pre>&lt;script type="text/javascript"&gt;
          lzEmbed({url: '<xsl:value-of select="/canvas/request/@url"/>?lzt=swf<xsl:value-of select="/canvas/request/@query_args"/>', bgcolor: '<xsl:value-of select="/canvas/@bgcolor"/>', width: '<xsl:value-of select="/canvas/@width"/>', height: '<xsl:value-of select="/canvas/@height"/>', id: '<xsl:value-of select="/canvas/@id"/>', accessible: '<xsl:value-of select="/canvas/@accessible"/>'});
&lt;/script></pre>

      <p>Click <a href="{/canvas/request/@url}?lzt=html{/canvas/request/@query_arg}">here</a> to see an example deployment page.  Note that it includes extra code for client-side version detection and interacting with browser history.</p>
      
      <p>You can also use the <code>js</code> request type to generate
      the call to <code>lzEmbed</code>:</p>
      
      <pre>&lt;script src="<xsl:value-of select="/canvas/request/@url"/>?lzt=js" type="text/javascript"&gt;
&lt;/script></pre>
      
      <p>If the HTML page is moved to a different directory than the
      lzx source file, the value of the 'url' parameter will need to
      be changed.</p>
      
     
<h2>Passing Parameters to SOLO applications</h2>
<p>
If you are deploying a SOLO application and wish to pass parameters down to the application from the base URL, you need to make some
 modifications to the stock html wrapper page that the server provides. 
</p>
<p>
Here is an <code>lzEmbed</code> line that passes all of the query params down to the Laszlo app undamaged:</p>
<pre>
lzEmbed({url: 'main.lzx.swf?'+window.location.search.substring(1), bgcolor: '#ffffff', width: '100%', height: '100%'});
</pre>
<p>

The thing that's different is the alteration to <code>main.lzx.swf? </code>from <code>main.lzx?lzt=swf</code> and the addition of 
<code>'+window.location.search.substring(1)'</code>
</p>

<h3><a href='{canvas/request/@lps}/lps/admin/solo-deploy.jsp?appurl={canvas/request/@relurl}'>SOLO Deployment Wizard</a></h3>
There is also a <a href='{canvas/request/@lps}/lps/admin/solo-deploy.jsp?appurl={canvas/request/@relurl}'>SOLO Deployment Wizard</a> application on the OpenLaszlo server which can assist in packaging an entire application directory for SOLO use.

      <h2>More Information</h2>
      <ul>
        <li><a href="{/canvas/request/@lps}/docs/deploy/deployers-guide.html">System Administrator's Guide to Deploying OpenLaszlo Applications</a></li>
        <li><a href="{/canvas/request/@lps}/docs/guide/request-types.html">Software Developer's Guide</a></li>
        <li><a href="http://www.laszlosystems.com/developers/community/forums/">Developer Forums</a></li>
      </ul>
  </body>
</html>
  </xsl:template>
</xsl:stylesheet>
