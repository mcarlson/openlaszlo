<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                exclude-result-prefixes="exslt"
                version="1.0">
  
  <xsl:import href="../../../../tools/docbook-xsl-1.65.1/htmlhelp/htmlhelp.xsl"/>

  <xsl:import href="parameters.xsl"/>

  <xsl:param name="htmlhelp.autolabel" select="0"/>
  <xsl:param name="htmlhelp.chm" select="'htmlhelp.chm'"/>
  <xsl:param name="htmlhelp.enumerate.images" select="0"/>
  <xsl:param name="htmlhelp.hhc.show.root" select="0"/>

  <!-- Show fixmes if true -->
  <xsl:param name="show.fixmes" select="0"/>
  
  <xsl:template match="remark[@role='fixme']">
    <xsl:if test="$show.fixmes != 0">
      <xsl:apply-imports/>
    </xsl:if>
  </xsl:template>
  
</xsl:stylesheet>
