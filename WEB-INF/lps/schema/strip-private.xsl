<?xml version="1.0" encoding="utf-8"?>

<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->

<!--  Copy an rng file, stripping items marked private. -->

<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns="http://relaxng.org/ns/structure/1.0"
  xmlns:rng="http://relaxng.org/ns/structure/1.0"
  xmlns:a="http://relaxng.org/ns/compatibility/annotations/1.0"
  xmlns:lza="http://www.laszlosystems.com/annotations/1.0"
  version="1.0">

  <xsl:output method="xml"/>

  <xsl:template match="*">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()|text()|comment()"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="*[@lza:visibility='private']"/>

  <xsl:template match="rng:optional">
    <xsl:if test="not(rng:attribute/@lza:visibility)">
      <xsl:copy>
        <xsl:apply-templates select="@*|node()|text()|comment()"/>
      </xsl:copy>
    </xsl:if>
  </xsl:template>

  <xsl:template match="@*">
    <xsl:copy/>
  </xsl:template>

  <xsl:template match="comment()">
    <xsl:copy/>
  </xsl:template>

</xsl:stylesheet>
