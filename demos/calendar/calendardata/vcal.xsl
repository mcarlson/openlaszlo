<?xml version="1.0" encoding="UTF-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2010 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml"
        version="1.0" encoding="UTF-8"
        indent="yes" omit-xml-declaration="yes"/>

    <xsl:param name="year" />

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

    <!-- replace 'year' nodes with 'yearXXXX' -->
    <xsl:template match="year">
        <xsl:element name="{concat('year', $year)}">
            <xsl:apply-templates select="@*|node()"/>
        </xsl:element>
    </xsl:template>

    <!-- insert @year attribute for 'start' and 'end' -->
    <xsl:template match="start|end">
        <xsl:copy>
            <xsl:attribute name="year"><xsl:value-of select="$year"/></xsl:attribute>
            <xsl:apply-templates select="@*[local-name(.)!='year']|node()"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>
