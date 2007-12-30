<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

<!ENTITY nbsp  "&#160;">

]>

<!-- This stylesheet is unused. [bshine 12.26.2007] -->

<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:h="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="h"
                >

    <xsl:output method="html"
                indent="yes" />

    <xsl:variable name="basedir" select="'/docs/'"/>
    
    <xsl:template match="/">
      <menu>
        <xsl:apply-templates/>
      </menu>
    </xsl:template>

    <xsl:template match="@*|node()">
      <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="h:div[@class='set' or @class='book']">
      <xsl:message>div/@set</xsl:message>
      <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="h:div[@class='toc']">
      <xsl:message>div/@toc</xsl:message>
      <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="h:dl">
      <!-- only handle the dt's; each dt will handle any following dd's -->
      <xsl:apply-templates select="h:dt"/>
    </xsl:template>
    
    <xsl:template match="h:dt[h:span/@class='book']">
      <xsl:variable name="title" select="h:span/h:a/text()"/>
      <xsl:variable name="src" select="h:span/h:a/@href"/>
      <section>
        <xsl:attribute name="title"><xsl:value-of select="$title"/></xsl:attribute>
        <xsl:attribute name="name"><xsl:value-of select="$title"/></xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="concat($basedir,$src)"/></xsl:attribute>
        
        <xsl:variable name="item-number" select="count(preceding-sibling::h:dt)+1"/>
        <xsl:apply-templates select="following-sibling::h:dd[
                                     count(preceding-sibling::h:dt)=$item-number
                                     ]"/>
      </section>
    </xsl:template>

    <xsl:template match="h:dt[h:span/@class='part']">
      <xsl:variable name="title" select="h:span/h:a/text()"/>
      <xsl:variable name="src" select="h:span/h:a/@href"/>
      <topic>
        <xsl:attribute name="title"><xsl:value-of select="$title"/></xsl:attribute>
        <xsl:attribute name="name"><xsl:value-of select="$title"/></xsl:attribute>
        <xsl:attribute name="src"><xsl:value-of select="concat($basedir, $src)"/></xsl:attribute>
        
        <?xsl :apply-templates select="h:dd" mode="sub"/ ?>
        
      </topic>
    </xsl:template>

</xsl:stylesheet>
