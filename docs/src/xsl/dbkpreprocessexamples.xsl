<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2007, 2009-2010 Laszlo Systems, Inc.  All Rights Reserved.        *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

<!ENTITY nbsp  "&#160;">

]>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common"
                xmlns:dyn="http://exslt.org/dynamic"
                xmlns:saxon="http://icl.com/saxon"
                xmlns:xi="http://www.w3.org/2003/XInclude"
                xmlns:dbk="http://docbook.org/ns/docbook"
                exclude-result-prefixes="exslt dyn xi saxon dbk"
                version="1.0">

  <xsl:import href="http://docbook.sourceforge.net/release/xsl/current/lib/lib.xsl"/>
  <xsl:import href="lzx-pretty-print.xsl"/>

  <!-- Path to base directory on local disk of output files -->
  <xsl:param name="base.dir" select="''" />

  <xsl:param name="warn.no.programlisting.canvas.dimension" select="false()"/>
  
  <!-- Let everything through by default, including tags we don't understand. -->
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <!-- copy text nodes exactly -->
  <xsl:template match="text">
    <xsl:copy-of select="."/>
  </xsl:template>
    
  <xsl:template match="processing-instruction('example')">
  </xsl:template>
  
  <xsl:template mode="xpath-to-id" match="/">
    <xsl:param name="xpath"/>
    <xsl:choose>
      <xsl:when test="function-available('dyn:evaluate')">
        <xsl:value-of select="generate-id(dyn:evaluate($xpath))"/>
      </xsl:when>
      <xsl:when test="function-available('saxon:evaluate')">
        <xsl:value-of select="generate-id(saxon:evaluate($xpath))"/>
      </xsl:when>
      <xsl:otherwise>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="programlisting[@language='lzx' and textobject/textdata/@fileref]">
    <!-- extract necessary information from context -->
    <xsl:variable name="fname" select="textobject/textdata/@fileref"/>
    <xsl:variable name="query-parameters" select="parameter[@role='query']"/>
    <xsl:variable name="callout-xpaths" select="ancestor::programlistingco/areaspec/area/@otherunits"/>
    
    <!-- pull in the (parsed XML) program source -->
    <xsl:variable name="relative.dir">
      <xsl:call-template name="dbhtml-dir"/>
    </xsl:variable>
    <xsl:variable name="programpath" select="concat($base.dir,$relative.dir,$fname)"/>
    <xsl:variable name="programsource" select="document(concat('file:///', $programpath))"/>

    <!-- format program listing itself -->
    <xsl:variable name="callout.ids">
       <xsl:for-each select="$callout-xpaths">
         <xsl:text> </xsl:text>
         <xsl:apply-templates mode="xpath-to-id" select="$programsource">
           <xsl:with-param name="xpath" select="."/>
         </xsl:apply-templates>
         <xsl:text> </xsl:text>
       </xsl:for-each>
     </xsl:variable>
    <xsl:variable name="prettysource">
      <xsl:call-template name="lzx-pretty-print">
        <xsl:with-param name="source" select="exslt:node-set($programsource)"/>
        <xsl:with-param name="callout.ids" select="exslt:node-set($callout.ids)"/>
      </xsl:call-template>
    </xsl:variable>

    <!-- pull out the canvas dimensions for use when we generate the embedding code -->
    <xsl:variable name="canvas-width"><xsl:apply-templates mode="canvas-width" select="$programsource"/></xsl:variable>
    <xsl:variable name="canvas-height"><xsl:apply-templates mode="canvas-height" select="$programsource"/></xsl:variable>

    <!-- leave programlisting intact -->
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:apply-templates select="parameter|textobject"/>
      <parameter role="canvas"><xsl:value-of select="concat('width: ', $canvas-width)"/></parameter>
      <parameter role="canvas"><xsl:value-of select="concat('height: ', $canvas-height)"/></parameter>
      <phrase>
        <xsl:copy-of select="$prettysource"/>
      </phrase>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="structfield[@role] | property[@role] | methodname[@role] | sgmltag[@role]">
    <xsl:variable name="itemname">
      <xsl:choose>
        <xsl:when test="contains(text(), '()')">
          <xsl:value-of select="substring-before(text(), '()')"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="text()"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <indexterm><primary><xsl:value-of select="$itemname"/></primary></indexterm>
    <link linkend="{@role}">
      <xsl:element name="{local-name()}"><xsl:value-of select="text()"/></xsl:element>
    </link>
  </xsl:template>

  <xsl:template mode="canvas-width" match="/">
    <xsl:choose>
      <xsl:when test="canvas/@width">
        <xsl:value-of select="canvas/@width"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:if test="$warn.no.programlisting.canvas.dimension">
          <xsl:message>programlisting: defaulting width to 100%</xsl:message>
        </xsl:if>
        <xsl:text>100%</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template mode="canvas-height" match="/">
    <xsl:choose>
      <xsl:when test="canvas/@height">
        <xsl:value-of select="canvas/@height"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:if test="$warn.no.programlisting.canvas.dimension">
          <xsl:message>programlisting: defaulting height to 400</xsl:message>
        </xsl:if>
        <xsl:text>400</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

<xsl:template name="dbhtml-attribute">
  <xsl:param name="pis" select="processing-instruction('dbhtml')"/>
  <xsl:param name="attribute">filename</xsl:param>

  <xsl:call-template name="pi-attribute">
    <xsl:with-param name="pis" select="$pis"/>
    <xsl:with-param name="attribute" select="$attribute"/>
  </xsl:call-template>
</xsl:template>

<xsl:template name="dbhtml-dir">
  <xsl:param name="context" select="."/>

  <!-- directories are now inherited from previous levels -->

  <xsl:variable name="ppath">
    <xsl:if test="$context/parent::*">
      <xsl:call-template name="dbhtml-dir">
        <xsl:with-param name="context" select="$context/parent::*"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:variable>

  <xsl:variable name="path">
    <xsl:call-template name="dbhtml-attribute">
      <xsl:with-param name="pis" select="$context/processing-instruction('dbhtml')"/>
      <xsl:with-param name="attribute">dir</xsl:with-param>
    </xsl:call-template>
  </xsl:variable>

  <xsl:choose>
    <xsl:when test="$path = ''">
      <xsl:if test="$ppath != ''">
        <xsl:value-of select="$ppath"/>
      </xsl:if>
    </xsl:when>
    <xsl:otherwise>
      <xsl:if test="$ppath != ''">
        <xsl:value-of select="$ppath"/>
        <xsl:if test="substring($ppath, string-length($ppath), 1) != '/'">
          <xsl:text>/</xsl:text>
        </xsl:if>
      </xsl:if>
      <xsl:value-of select="$path"/>
      <xsl:text>/</xsl:text>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>
    
</xsl:stylesheet>
