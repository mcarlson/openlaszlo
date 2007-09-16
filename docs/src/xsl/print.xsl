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
  
  <xsl:import href="http://docbook.sourceforge.net/release/xsl/current/fo/docbook.xsl"/>

  <!-- Show fixmes if true -->
  <!--xsl:param name="fixme" select="false()"/-->
  
  <!-- ToC/LoT/Index Generation -->
  <xsl:param name="toc.section.depth" select="'1'"/>
  <!-- Processor Extensions -->
  <xsl:param name="fop.extensions" select="'1'"/>
  <!-- Stylesheet extensions -->
  <xsl:param name="use.extensions" select="'1'"/>
  <!-- Meta/*.info -->
  <xsl:param name="make.year.ranges" select="1"/>
  <!-- Miscellaneous -->
  <xsl:param name="ulink.footnotes" select="'1'"/>
  <xsl:param name="ulink.hyphenate" select="'&#x200B;'"/>
  <xsl:param name="ulink.show" select="'1'"/>
  <!-- Pagination and General Styles -->
  <xsl:param name="draft.mode" select="'yes'"/>
  <xsl:param name="draft.watermark.image" select="'http://docbook.sourceforge.net/release/xsl/current/images/draft.png'"/>
  <!-- Cross References -->
  <xsl:param name="insert.xref.page.number" select="'yes'"/>

  <xsl:param name="callouts.extension" select="'1'"/>
  <xsl:param name="callout.graphics.path" select="'http://docbook.sourceforge.net/release/xsl/current/images/callouts/'"/>
  
  <xsl:param name="linenumbering.extension" select="'1'"/>
  <xsl:param name="tablecolumns.extension" select="'0'"/>
  <xsl:param name="textinsert.extension" select="'1'"/>

  <!-- remove toc from parts -->
  <xsl:param name="generate.toc">
    appendix  toc,title
    article/appendix  nop
    article   toc,title
    book      toc,title,figure,table,example,equation
    chapter   title
    part      title
    preface   title
    qandadiv  toc
    qandaset  toc
    reference toc,title
    sect1     toc
    sect2     toc
    sect3     toc
    sect4     toc
    sect5     toc
    section   toc
    set       toc,title
  </xsl:param>
  
  <xsl:template match="remark[@role='fixme']"/>
  
  <xsl:template match="literal[@role='unsupported']" priority="1">
    <fo:inline font-style="italic">
      <xsl:call-template name="inline.monoseq"/>
    </fo:inline>
  </xsl:template>
  
  <xsl:template match="ulink[@role='internal']">
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template match="literal[count(*)=0]">
    <xsl:call-template name="inline.monoseq">
      <xsl:with-param name="content">
        <xsl:call-template name="hyphenate-url">
          <xsl:with-param name="url" select="."/>
        </xsl:call-template>
      </xsl:with-param>
    </xsl:call-template>
    <!--xsl:call-template name="split-url">
      <xsl:with-param name="url" select="."/>
    </xsl:call-template-->
  </xsl:template>
  
  <xsl:template name="split-url">
    <xsl:param name="url"/>
    <xsl:param name="prefix" select="substring-before($url, '/')"/>
    <xsl:param name="suffix" select="substring-after($url, '/')"/>
    <xsl:call-template name="inline.monoseq">
      <xsl:with-param name="content" select="concat($prefix, '/', $ulink.hyphenate)"/>
    </xsl:call-template>
    <xsl:if test="$suffix">
      <xsl:call-template name="split-url">
        <xsl:with-param name="url" select="$suffix"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>
  
</xsl:stylesheet>
