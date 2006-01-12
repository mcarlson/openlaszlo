<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:h="http://www.w3.org/1999/xhtml"
                version="1.0">
  
  <xsl:output method="html" indent="yes"/>
  
  <xsl:template match="/">
    <toc>
      <xsl:apply-templates select="//h:h3"/>
      <category title="Appendices">
        <item title="A. Reserved Words" href="info-reservedwords.html"/>
        <?ignore item title="B. Redmond Components" href="redmond-components.html"/>
        <item title="C. Attributes" href="info-attribinfo.html"/>
        <item title="D. Attributes (continued)" href="info-attributes.html"/>?>
      </category>
    </toc>
  </xsl:template>

  <xsl:template match="h:h3">
    <category title="{string(.)}">
      <xsl:apply-templates select="following-sibling::h:p[1]/h:a"/>
    </category>
  </xsl:template>
  
  <xsl:template match="h:a[starts-with(@href, 'redmond')]"/>
  
  <xsl:template match="h:a">
    <test v="{starts-with(@href, 'redmond')}"/>
    <item title="{string(.)}" href="{@href}"/>
  </xsl:template>

</xsl:stylesheet>
