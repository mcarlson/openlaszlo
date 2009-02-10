<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">

  <!-- Specify a doctype. Fixes LPP-5207. [bshine 12.17.2007] -->
  <xsl:param name="chunker.output.method" select="'html'"/>
  <xsl:param name="chunker.output.doctype-public" select="'-//W3C//DTD HTML 4.01 Transitional//EN'"/>
  <xsl:param name="chunker.output.doctype-system" select="'http://www.w3.org/TR/html4/loose.dtd'"/>  
  
  <!--xsl:param name="emphasis.propagates.style" select="0"/-->
  
  <!-- Adminitions -->
  <xsl:param name="admon.graphics.path">images/</xsl:param>
  <xsl:param name="admon.graphics" select="1"/>
  <!-- Callouts -->
  <xsl:param name="callout.unicode" select="1"/>
  <!-- ToC/LoT/Index Generation -->
  <xsl:param name="generate.section.toc.level" select="'0'"/>
  <xsl:param name="toc.section.depth" select="2"/>
  <xsl:param name="toc.max.depth" select="2"/>
  <!-- Extensions -->
  <xsl:param name="graphicsize.extension" select="0"/>
  <xsl:param name="linenumbering.everyNth" select="10"/>
  <xsl:param name="use.extensions" select="1"/>
  <xsl:param name="tablecolumns.extension" select="1"/>
  <!-- Automatic labeling -->
  <xsl:param name="section.autolabel" select="1"/>
  <!-- Indexing -->
  <xsl:param name="l10n.gentext.language" select="'en'"/>
  <xsl:param name="index.term.separator" select="', '"/>
  <xsl:param name="index.number.separator" select="', '"/>
  <xsl:param name="index.range.separator" select="'-'"/>
  <!-- HTML -->
  <xsl:param name="draft.mode" select="'no'"/> <!-- Set to 'yes' if you want a watermark -->
  <xsl:param name="draft.watermark.image" select="'./images/draft.png'"/>
  <xsl:param name="use.id.as.filename" select="1"/>
  <!-- Meta/*.info -->
  <xsl:param name="make.year.ranges" select="1"/>
  <!-- Meta/*.info -->
  <xsl:param name="table.frame.border.thickness" select="'thin'"/>
  <xsl:param name="table.cell.border.thickness" select="'thin'"/>
  <xsl:param name="table.cell.border.style" select="'solid'"/>
  <!-- This is too verbose, we use a style sheet instead -->
  <xsl:param name="table.borders.with.css" select="0"/>
  <!-- Chunking -->
  <xsl:param name="chunk.fast" select="0"/>
  <xsl:param name="chunk.section.depth" select="0"/>
  <xsl:param name="chunker.output.indent" select="'yes'"/>
  <xsl:param name="html.extra.head.links" select="0"/>
  <!-- Miscellaneous -->
  <xsl:param name="show.comments">1</xsl:param>

  <!-- Add link for display/submission of user community comments -->
  <xsl:param name="show.usercomments">1</xsl:param>

   <!-- Reference appearance -->
   <xsl:param name="navig.showtitles">1</xsl:param>
   <xsl:param name="suppress.header.navigation">0</xsl:param>
   <xsl:param name="suppress.navigation">0</xsl:param>    


  <xsl:param name="generate.toc">
    set       toc,title,index
    book      toc,title
    part      toc,title
    chapter   toc,title
    preface   toc,title
    reference toc,title
    appendix  toc,title
    qandadiv  toc
    qandaset  toc
    sect1     toc
    sect2     toc
    sect3     toc
    sect4     toc
    sect5     toc
    section   toc
    appendix/index  toc,title
    article/appendix  nop
    article   toc,title
  </xsl:param>
</xsl:stylesheet>
