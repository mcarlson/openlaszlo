<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2006-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:import href="js2doc2dbk.xsl"/>
    
    <xsl:param name="docid"/>
    <xsl:param name="book.title"/>
    <xsl:param name="buildid"/>
    <xsl:param name="filter.topic"/>

    <xsl:output method="xml"
                doctype-public="-//OASIS//DTD DocBook XML V4.5//EN"
                doctype-system="http://www.oasis-open.org/docbook/xml/4.5/docbookx.dtd"
                indent="yes" />

    <xsl:template match="/">
      <part id="{concat($filter.topic, '.ref')}">
        <title><xsl:value-of select="$filter.topic"/> Reference</title>
        <xsl:choose>
          <xsl:when test="$filter.topic = 'none'">
            <xsl:apply-templates select="js2doc" mode="decls-no-topic"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:apply-templates select="js2doc" mode="decls-by-topic">
              <xsl:with-param name="topic" select="$filter.topic"/>
            </xsl:apply-templates>
          </xsl:otherwise>
        </xsl:choose>
      </part>
    </xsl:template>
    
    <xsl:template match="*">
    </xsl:template>
    
</xsl:stylesheet>
