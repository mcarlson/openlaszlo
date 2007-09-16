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
    <xsl:param name="build.general.index"/>

    <xsl:output method="xml"
                doctype-public="-//OASIS//DTD DocBook XML V4.5//EN"
                doctype-system="http://www.oasis-open.org/docbook/xml/4.5/docbookx.dtd"
                indent="yes" />

    <xsl:template match="/">
      <part id="xref">

        <title>Indices</title>

        <xsl:call-template name="files-all"/>

      </part>
    </xsl:template>
    
    <xsl:template match="*">
    </xsl:template>
    
</xsl:stylesheet>
