<?xml version="1.0" encoding="utf-8"?>
<!--
  html-response.xslt
--> 
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2005 Laszlo Systems, Inc.  All Rights Reserved.              *
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
      <xsl:value-of select="/canvas/@title"/>
    </title>
    <style type="text/css">
      html, body { margin: 0; padding: 0; height: 100%; }
      body { background-color: <xsl:value-of select="/canvas/@bgcolor"/>; }
    </style>
    <script language="JavaScript1.1" src="{/canvas/request/@lps}/lps/includes/vbembed.js" type="text/javascript"/>
    <script src="{/canvas/request/@lps}/lps/includes/embed.js" type="text/javascript"/>
  </head>
  <body>
    <xsl:choose>
      <xsl:when test="/canvas/request/@pocketpc = 'true'">
        <OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                width="{/canvas/@width}"
                height="{/canvas/@height}"
                id="{/canvas/@id}">
          <PARAM NAME="movie" VALUE="{/canvas/request/@url}?lzt=swf{/canvas/request/@query_args}"/>
        </OBJECT>
      </xsl:when>
      <xsl:otherwise>
        <script type="text/javascript">
          lzLPSRoot = '<xsl:value-of select="/canvas/request/@lps"/>';
          lzCanvasRuntimeVersion = <xsl:value-of select="substring(/canvas/@runtime,4)"/> * 1;
          if (lzCanvasRuntimeVersion == 6) {
            lzCanvasRuntimeVersion = 6.65;
          }
          if (isIE &amp;&amp; isWin || detectFlash() >= lzCanvasRuntimeVersion) {
            lzEmbed({url: '<xsl:value-of select="/canvas/request/@url"/>?lzt=swf<xsl:value-of select="/canvas/request/@query_args"/>&amp;__lzhistconn='+top.connuid+'&amp;__lzhisturl=' + escape('<xsl:value-of select="/canvas/request/@lps"/>/lps/includes/h.html?h='), bgcolor: '<xsl:value-of select="/canvas/@bgcolor"/>', width: '<xsl:value-of select="/canvas/@width"/>', height: '<xsl:value-of select="/canvas/@height"/>', id: '<xsl:value-of select="/canvas/@id"/>'}, lzCanvasRuntimeVersion);
            lzHistEmbed(lzLPSRoot);
          } else {
            document.write('This application requires Flash player ' + lzCanvasRuntimeVersion + '. <a href="http://www.macromedia.com/go/getflashplayer" target="fpupgrade">Click here</a> to upgrade.');
          }            
        </script>
        <noscript>
            Please enable JavaScript in order to use this application.
        </noscript>
      </xsl:otherwise>
    </xsl:choose>
  </body>
</html>
</xsl:template>
</xsl:stylesheet>
