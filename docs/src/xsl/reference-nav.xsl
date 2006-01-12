<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:h="http://www.w3.org/1999/xhtml"
                xmlns:d="docbuild"
                exclude-result-prefixes="d h"
                version="1.0">
  
  <xsl:output method="html" indent="yes"/>
  
  <xsl:template match="/|@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="d:width">
    <xsl:value-of select="document('../hardpages/nav.lzx')/canvas/@width"/>
  </xsl:template>
  
  <xsl:template match="d:height">
    <xsl:value-of select="document('../hardpages/nav.lzx')/canvas/@height"/>
  </xsl:template>
  
  <!--
    ToC
  -->
  
  <xsl:template match="d:contents">
    <xsl:apply-templates select="document('../../reference/toc.xml')"/>
  </xsl:template>
  
  <xsl:template match="toc">
    <div>
      <ul>
        <li><a href="welcome.html" target="content">Welcome</a></li>
        <xsl:apply-templates/>
      </ul>
    </div>
  </xsl:template>
  
  <xsl:template match="category">
    <li>
      <xsl:value-of select="@title"/>
      <ul>
        <xsl:apply-templates/>
      </ul>
    </li>
  </xsl:template>
  
  <xsl:template match="item">
    <li><a href="{@href}" target="content"><xsl:value-of select="@title"/></a></li>
  </xsl:template>
  
  <!--
    Index
  -->
  
  <xsl:template match="d:index">
    <xsl:apply-templates select="document(concat('../../reference/', @src))"/>
  </xsl:template>
  
  <xsl:template match="index">
    <ul>
      <xsl:apply-templates/>
    </ul>
  </xsl:template>
  
  <xsl:template match="index/item">
    <li><a href="{@href}" target="content"><xsl:value-of select="@title"/></a></li>
  </xsl:template>
</xsl:stylesheet>
