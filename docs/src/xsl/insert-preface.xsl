<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xi="http://www.w3.org/2003/XInclude"
                version="1.0">
  
  <xsl:output method="xml" indent="yes"/>

  <xsl:param name="preface.dir"/>
  
  <xsl:template match="/|@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="xi:include[@href='preface.dbk']">
    <xsl:copy-of select="document(concat('../', $preface.dir, '/', @href))"/>
  </xsl:template>

</xsl:stylesheet>
