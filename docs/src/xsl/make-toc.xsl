<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="xhtml"
                version="1.0">
  
  <xsl:output method="xml" indent="yes"/>
  
  <xsl:template match="/categories">
    <toc>
      <xsl:apply-templates select="category"/>
      <category title="Appendices">
        <item title="A. Reserved Words" href="info-reservedwords.html"/>
        <?ignore item title="B. Redmond Components" href="redmond-components.html"/>
        <item title="D. Attributes" href="info-attribinfo.html"/>
        <item title="E. Attributes (continued)" href="info-attributes.html"/>?>
      </category>
    </toc>
  </xsl:template>
  
  <xsl:template match="category">
    <category title="{@title}">
      <xsl:apply-templates/>
    </category>
  </xsl:template>
  
  <xsl:template match="item[starts-with(@href, 'redmond')]"/>
  
  <xsl:template match="item">
    <xsl:variable name="title">
      <xsl:choose>
        <xsl:when test="@tagname = @classname">
          <xsl:value-of select="@tagname"/>
        </xsl:when>
        <xsl:when test="@tagname and @classname">
          <xsl:value-of select="concat(@tagname, ' (', @classname, ')')"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="concat(@tagname, @classname)"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <item title="{$title}" href="{@href}"/>
  </xsl:template>

</xsl:stylesheet>
