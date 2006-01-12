<?xml version="1.0" encoding="utf-8"?>
<!--
  kranking.xslt
 
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
              indent="yes"/>
  
  <xsl:param name="lps"><xsl:value-of select="/*/request/@lps"/></xsl:param>
  <xsl:param name="assets"><xsl:value-of select="/*/request/@lps"/>/lps/assets</xsl:param>

  <xsl:template match="/">
    <xsl:param name="appName" select="/*/@appName"/>
    <xsl:param name="seconds" select="/*/@seconds"/>
    <xsl:param name="lzourl" select="/*/@lzourl"/>
    <xsl:param name="isAborted" select="/*/@isAborted"/>
    <xsl:param name="isBusy" select="/*/@isBusy"/>
    <xsl:param name="isFinished" select="/*/@isFinished"/>
    
    <html>
      <head>
        <meta HTTP-EQUIV="Pragma" CONTENT="no-cache"/>
        <meta HTTP-EQUIV="Expires" CONTENT="-1"/>
        <xsl:if test="$isBusy">
          <meta HTTP-EQUIV="Refresh" CONTENT="10"/>
        </xsl:if>
        <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/favicon.ico"/>
        <link rel="stylesheet" href="{//@lps}/lps/includes/console.css" type="text/css"/>
        <script src="{$lps}/lps/includes/embed.js" type="text/javascript"></script>
        <title>
          Optimizing "<xsl:value-of select="$appName"/>"
          <xsl:if test="$isBusy">
            &#x2026; <!-- &hellip; -->
          </xsl:if>
        </title>
      </head>
      <body style="background-color: #EAEAEA">
        <xsl:if test="$isFinished">
          <attribute name="bgcolor" value="#CCCCFF"/>
        </xsl:if>
        <xsl:if test="$isAborted">
          <attribute name="bgcolor" value="#CCCCFF"/>
        </xsl:if>
        <xsl:choose>
          <xsl:when test="$isBusy">
            <div id="krank-header">
              <img src="{$assets}/logo_krank_header.gif"/>
              <span class="status">Optimizer still running on "<xsl:value-of select="$appName"/>".
              Elapsed time <xsl:value-of select="$seconds"/> seconds.</span>
              <script type="text/javascript">defaultStatus = 'Optimizing...'</script>
            </div>
            <center>
              <script type="text/javascript">
                lzEmbed({url: '<xsl:value-of select="$assets"/>/startup_small.swf', width: '400', height: '400'});
              </script>
            </center>
          </xsl:when>
          <xsl:when test="$isFinished">
            <div id="krank-header">
              <img src="{$assets}/logo_krank_header.gif"/>
              <span class="status">Optimization for "<xsl:value-of select="$appName"/>" finished in time <xsl:value-of select="$seconds"/> seconds.</span>
            </div>
            <a href="{$lzourl}">Load Optimized Version</a>
            <br />
            <a href="{$appName}.lzx">Optimize Again</a>
            <pre></pre>

            <script type="text/javascript">
              location = "<xsl:value-of select="$lzourl"/>?showKrankDuration=<xsl:value-of select="$seconds"/>";
            </script>
          </xsl:when>
          <xsl:when test="$isAborted">
            <h2>
              <font color="red">Optimization was aborted for <xsl:value-of select="$appName"/></font>
            </h2>
            Check server log for details
          </xsl:when>
          <xsl:otherwise>
            <h2>
              <font color="red">The optimizer is not running. The last application to be optimized was <xsl:value-of select="$appName"/></font>
            </h2>
          </xsl:otherwise>
        </xsl:choose>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
