<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- The doc build applies this file to index.html to generate an
     expanded table of contents.  This file reads each
    document(index.html)//li/a[@href~='*.html'] to determine the
    ordered list of dguide chapters, and extracts their <hn> elements
    to build a list of lists. -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/1999/xhtml"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                version="1.0">
  
  <xsl:output method="html"
              indent="yes"
              omit-xml-declaration="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>D3 Extended Contents</title>
        <script language="javascript1.2" src="../includes/docs.js">
          <!-- The following line keeps the explicit end tag in
          the output, which is necessary for MSIE -->
          <xsl:text> </xsl:text>
        </script>
      </head>
      <body onload='collapseAll();'>
        <h1>D<sup>3</sup> Extended Contents</h1>
        <a href="#" onclick="uncollapseAll()">Show all</a>
        /
        <a href="#" onclick="collapseAll()">Hide all</a>

        <ol id="root">
          <!-- read the list of links to dguide chapters -->
          <xsl:for-each select="//xhtml:li/xhtml:a[substring-after(concat(@href, '.'), '.html') = '.']">
            <xsl:apply-templates select="."/>
          </xsl:for-each>
        </ol>
      </body>
    </html>
  </xsl:template>

  <!-- This is applied to each dguide chapter -->
  <xsl:template match="*">
    <li>
      <xsl:call-template name="header">
        <xsl:with-param name="cn" select="document(@href)//xhtml:h1"/>
        <xsl:with-param name="hn" select="1"/>
        <xsl:with-param name="href" select="@href"/>
        <xsl:with-param name="toc-name" select="text()"/>
      </xsl:call-template>
    </li>
  </xsl:template>
  
  <xsl:template name="header">
    <!-- Current Node -->
    <xsl:param name="cn"/>
    <!-- Header Number -->
    <xsl:param name="hn" select="2"/>
    <xsl:param name="href"/>
    <xsl:param name="toc-name"/>

    <xsl:param name="h1name" select="concat('h', $hn)"/>
    <xsl:param name="h2name" select="concat('h', $hn+1)"/>
    <xsl:param name="following-h1" select="$cn/following::xhtml:*[local-name()=$h1name]"/>
    <xsl:param name="children" select="$cn/following::xhtml:*[local-name()=$h2name and generate-id(./following::xhtml:*[local-name()=$h1name]) = generate-id($following-h1)]"/>
    
    <xsl:choose>
      <xsl:when test="$href">
        <a href="{$href}"><xsl:value-of select="$toc-name"/></a>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates mode="copy" select="$cn/*|$cn/node()"/>
      </xsl:otherwise>
    </xsl:choose>
    
    <!-- Uncomment this to print mismatches between what the index
    calls the chapter, and its h1.  Will report whitespace mismatches
    too. -->
    <!--xsl:if test="$n=1 and $h//text()!=$toc-name">
      <xsl:text> (index.html calls this "</xsl:text>
      <xsl:value-of select="$toc-name"/>
      <xsl:text>")</xsl:text>
    </xsl:if-->
    
    <xsl:if test="count($children) != 0">
      <xsl:text> </xsl:text>
      <a href="#" onclick="toggleBullet(this)">(children)</a>
      
      <ol>
        <xsl:for-each select="$children">
          <li>
            <xsl:call-template name="header">
              <xsl:with-param name="cn" select="."/>
              <xsl:with-param name="hn" select="$hn+1"/>
            </xsl:call-template>
          </li>
        </xsl:for-each>
      </ol>
    </xsl:if>
  </xsl:template>

  <xsl:template mode="copy" match="/|@*|text()|comment()">
    <xsl:copy>
      <xsl:apply-templates select="*|@*|node()"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
