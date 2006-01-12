<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xi="http://www.w3.org/2003/XInclude"
                version="1.0">
  
  <xsl:output method="text"/>
  
  <xsl:template match="/">
    <xsl:apply-templates select="//xi:include"/>
  </xsl:template>
  
  <xsl:template match="xi:include">
    <xsl:value-of select="concat(substring-before(@href, '.dbk'), '.html')"/>
    <xsl:text>&#10;</xsl:text>
  </xsl:template>
  
</xsl:stylesheet>
