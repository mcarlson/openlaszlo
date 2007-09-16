<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                version="1.0">

  <xsl:import href="conditional-html.xsl"/>

  <xsl:param name="toc.section.depth" select="2"/>
  <xsl:param name="toc.max.depth" select="2"/>

  <!-- change to 1 to turn off refentry metadata consistency checking.
       This is supposed to speed up build considerably, but on my machine
       didn't make an appreciable difference. -->
  <xsl:param name="refentry.meta.get.quietly" select="0"/>
  
  <xsl:param name="man.indent.refsect" select="1"/>

  <xsl:param name="linenumbering.extension.frag" select="0"/>

</xsl:stylesheet>