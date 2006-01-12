<?xml version="1.0" encoding="utf-8"?>
<!--
  krank-abort.xslt
 
  This software is the proprietary information of Laszlo Systems, Inc.
  Use is subject to license terms.
--> 

<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
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
    <link rel="stylesheet" href="{//@lps}/lps/includes/console.css" type="text/css"/>
    <title>Optimization aborted</title>
  </head>
  <body>
    <div id="krank-header">
      <img src="{//@lps}/lps/assets/logo_krank_header.gif" alt="Krank: "/>
      <span class="status">Optimization aborted.</span>
    </div>
    <xsl:if test="//@msg">
      <code class="error">Error: <xsl:value-of select="//@msg"/></code>
    </xsl:if>
  </body>
</html>
  </xsl:template>
</xsl:stylesheet>
