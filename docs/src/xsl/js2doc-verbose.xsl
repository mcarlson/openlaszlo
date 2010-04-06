<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2006-2007, 2010 Laszlo Systems, Inc.  All Rights Reserved.        *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

<!ENTITY lowercase      "'abcdefghijklmnopqrstuvwxyz'">
<!ENTITY uppercase      "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'">

]>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="xml"
                indent="yes" />

    <xsl:key name="lowerid" match="property|initarg" use="translate(@id,&uppercase;,&lowercase;)"/>

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
    
    <xsl:template match="property|initarg">
      <xsl:copy>
        <xsl:apply-templates select="@*"/>
        <xsl:apply-templates select="." mode="id"/>
        <xsl:apply-templates select="." mode="access"/>
        <xsl:if test="parent::js2doc">
          <xsl:apply-templates select="." mode="topic"/>
        </xsl:if>
        <xsl:apply-templates select="node()"/>
      </xsl:copy>
    </xsl:template>

    <xsl:template match="unit">
      <xsl:copy>
        <xsl:apply-templates select="@*"/>
        <xsl:variable name="ambig" select="key('lowerid', @id)"/>
        <xsl:choose>
          <xsl:when test="count($ambig) > 1">
            <xsl:variable name="id" select="concat(@id,'.',generate-id(.))"/>
            <xsl:attribute name="id"><xsl:value-of select="$id"/></xsl:attribute>
            <xsl:message><xsl:value-of select="concat('found ambiguous unit id ', @id, ', substituting ', $id)"/></xsl:message>
          </xsl:when>
          <xsl:otherwise>
            <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates select="." mode="access"/>
        <xsl:apply-templates select="." mode="topic"/>
        <xsl:apply-templates select="node()"/>
      </xsl:copy>
    </xsl:template>

    <!-- ID -->
    
    <xsl:template match="*[@id]" mode="id">
      <xsl:variable name="ambig" select="key('lowerid', @id)"/>
      <xsl:if test="count($ambig) > 1">
        <xsl:variable name="id" select="concat(@id,'.',generate-id(.))"/>
        <xsl:attribute name="id"><xsl:value-of select="$id"/></xsl:attribute>
        <xsl:message><xsl:value-of select="concat('found ambiguous property id ', @id, ', substituting ', $id)"/></xsl:message>
      </xsl:if>
    </xsl:template>

    <xsl:template match="*[not(@id)]" mode="id">
      <xsl:variable name="id">
        <xsl:choose>
          <xsl:when test="ancestor::node()/@id">
            <xsl:value-of select="concat(ancestor::node()/@id, '.', generate-id(.))"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="generate-id(.)"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>
      <xsl:attribute name="id"><xsl:value-of select="$id"/></xsl:attribute>
    </xsl:template>
    
    <!-- ACCESS -->

    <xsl:template match="*" mode="access">
      <xsl:attribute name="access"><xsl:value-of select="'public'"/></xsl:attribute>
    </xsl:template>

    <xsl:template match="*[@access]" mode="access">
      <xsl:attribute name="access"><xsl:value-of select="@access"/></xsl:attribute>
    </xsl:template>

    <xsl:template match="*[not(@access) and @unitid]" mode="access">
      <xsl:variable name="unitid" select="@unitid"/>
      <xsl:variable name="parent" select="//unit[@id=$unitid]"/>
      <xsl:apply-templates select="$parent" mode="access"/>
    </xsl:template>
    
    <!-- TOPIC/SUBTOPIC -->

    <xsl:template match="*" mode="topic">
    </xsl:template>

    <xsl:template match="*[@topic]" mode="topic">
      <xsl:attribute name="topic"><xsl:value-of select="@topic"/></xsl:attribute>
      <xsl:attribute name="subtopic"><xsl:value-of select="@subtopic"/></xsl:attribute>
    </xsl:template>
    
    <xsl:template match="*[not(@topic) and @unitid]" mode="topic">
      <xsl:variable name="unitid" select="@unitid"/>
      <xsl:variable name="parent" select="//unit[@id=$unitid]"/>
      <xsl:apply-templates select="$parent" mode="topic"/>
    </xsl:template>
    
    
    
</xsl:stylesheet>