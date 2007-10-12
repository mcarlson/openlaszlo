<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2006-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
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

    <xsl:template match="refnamediv">
        <div class="{name(.)}">
            <xsl:call-template name="dir">
                <xsl:with-param name="inherit" select="1"/>
            </xsl:call-template>
            <xsl:call-template name="anchor"/>
            <!-- Just show the name of the tag, not "Name: " -->
            <h2><xsl:apply-templates/></h2>
        </div>
    </xsl:template>


    <xsl:template match="refpurpose">
        <xsl:if test="node()">
            <div class="refpurpose">
                <xsl:apply-templates/>
            </div>
        </xsl:if>
    </xsl:template>

    <xsl:template match="refsynopsisdiv">
        <div class="{name(.)}">
            <xsl:call-template name="dir">
                <xsl:with-param name="inherit" select="1"/>
            </xsl:call-template>
            <xsl:call-template name="anchor"/>
            <xsl:apply-templates/>
        </div>
    </xsl:template>


</xsl:stylesheet>