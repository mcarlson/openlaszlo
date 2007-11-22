<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

<!ENTITY nbsp  "&#160;">
<!ENTITY raquo "&#187;">

<!ENTITY tagname        '(doc/tag[@name="lzxname"]/text)'>
<!ENTITY lzxtype        '(doc/tag[@name="lzxtype"]/text)'>
<!ENTITY shortdesc      '(doc/tag[@name="shortdesc"]/text)'>

<!ENTITY commonname     '(self::node()/@name | self::node()/doc/tag[@name="lzxname"]/text)[1]'>

<!ENTITY ispublic       '(@access="public")'>
<!ENTITY isvisible      '(contains($visibility.filter, @access))'>

<!ENTITY lowercase      "'abcdefghijklmnopqrstuvwxyz'">
<!ENTITY uppercase      "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'">

]>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:key name="name-js" match="property" use="@name"/>
    <xsl:key name="name-lzx" match="property" use="&tagname;"/>

    <xsl:template name="insert-modifiers">
      <xsl:param name="modifiers"/>
      <xsl:if test="$modifiers">
        <xsl:variable name="mod" select="substring-before($modifiers,' ')"/>
        <xsl:choose>
          <xsl:when test="$mod"><modifier><xsl:value-of select="$mod"/></modifier></xsl:when>
          <xsl:otherwise><modifier><xsl:value-of select="$modifiers"/></modifier></xsl:otherwise>
        </xsl:choose>
        <xsl:call-template name="insert-modifiers">
          <xsl:with-param name="modifiers" select="substring-after($modifiers,' ')"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:template>

    <!-- TYPE CONVERSION -->

    <xsl:template name="lzxtype">
      <xsl:param name="tag"/>
      <xsl:choose>
        <xsl:when test="&lzxtype;">
          <xsl:element name="{$tag}"><xsl:value-of select="&lzxtype;"/></xsl:element>
        </xsl:when>
        <xsl:when test="@type">
          <xsl:element name="{$tag}">
            <xsl:call-template name="jstype2lzxtype">
              <xsl:with-param name="jstype" select="@type"/>
            </xsl:call-template>
          </xsl:element>
        </xsl:when>
        <xsl:otherwise>
          <xsl:text>?lzxtype?</xsl:text>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>
    
    <xsl:template name="jstype">
      <xsl:param name="tag"/>
      <xsl:choose>
        <xsl:when test="@type">
          <xsl:element name="{$tag}"><xsl:value-of select="@type"/></xsl:element>
        </xsl:when>
        <xsl:when test="&lzxtype;">
          <xsl:element name="{$tag}">
            <xsl:call-template name="lzxtype2jstype">
              <xsl:with-param name="lzxtype" select="&lzxtype;"/>
            </xsl:call-template>
          </xsl:element>
        </xsl:when>
        <xsl:otherwise>
          <!-- We couldn't find a type for this. -->
          <xsl:message>No type found for <xsl:value-of select="@name"/></xsl:message>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>
    
    <xsl:template name="lzxtype2jstype">
      <xsl:param name="lzxtype"/>
      <xsl:choose>
        <xsl:when test="starts-with($lzxtype, '$')">
          <xsl:text>Object</xsl:text>
        </xsl:when>
        <xsl:when test="$lzxtype = 'expression'">
          <xsl:text>Object</xsl:text>
        </xsl:when>
        <xsl:when test="$lzxtype = 'boolean'">
          <!-- Either 'boolean' or 'Boolean' might be correct. Putting this rule in to document that we're making a choice -->
          <xsl:text>boolean</xsl:text>
        </xsl:when>
        <xsl:when test="contains($lzxtype, '|')">
          <xsl:text>String</xsl:text>
        </xsl:when>
        <xsl:when test="$lzxtype = 'text' or $lzxtype = 'token' or $lzxtype = 'xsd:ID'">
          <xsl:text>String</xsl:text>
        </xsl:when>
        <xsl:when test="key('name-lzx',$lzxtype)/@name">
          <xsl:value-of select="key('name-lzx',$lzxtype)/@name"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:variable name="initialchar" select="translate(substring($lzxtype, 1, 1),&lowercase;,&uppercase;)"/>
          <xsl:value-of select="concat($initialchar,substring($lzxtype,2))"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>
    
    <xsl:template name="jstype2lzxtype">
      <xsl:param name="jstype"/>
      <xsl:choose>
        <xsl:when test="key('name-js',$jstype)/doc/tag[@name='lzxname']/text">
          <xsl:value-of select="key('name-js',$jstype)/doc/tag[@name='lzxname']/text"/>
        </xsl:when>
        <xsl:when test="contains($jstype, '|')">
          <xsl:value-of select="'expression'"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:variable name="initialchar" select="translate(substring($jstype, 1, 1),&uppercase;,&lowercase;)"/>
          <xsl:value-of select="concat($initialchar,substring($jstype,2))"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>

    <!-- VALUE -->
    
    <xsl:template match="property[child::function]" mode="value">
      <xsl:param name="tag"/>
      <xsl:param name="language"/>
      <xsl:element name="{$tag}">
        <methodsynopsis language="{$language}">
          <xsl:if test="function/returns"><type role="javascript"><xsl:value-of select="function/returns/@type"/></type></xsl:if>
          <xsl:for-each select="function/parameter">
            <methodparam>
              <parameter><xsl:value-of select="@name"/></parameter>
              <xsl:if test="@type"><type role="javascript"><xsl:value-of select="@type"/></type></xsl:if>
            </methodparam>
          </xsl:for-each>
        </methodsynopsis>
      </xsl:element>
    </xsl:template>
    
    <xsl:template match="property[child::object]" mode="value">
      <xsl:param name="tag"/>
      <xsl:param name="language"/>
      <xsl:element name="{$tag}">
        <xsl:text>{ ... }</xsl:text>
      </xsl:element>
    </xsl:template>
    
    <!-- CLASSREF -->

    <xsl:template match="property[child::class]" mode="classref">
      <xsl:param name="add-link"/>
      <xsl:choose>
        <xsl:when test="$add-link = true()">
          <classname><link linkend="{@id}"><xsl:value-of select="&commonname;"/></link></classname>
        </xsl:when>
        <xsl:otherwise>
          <classname><xsl:value-of select="&commonname;"/></classname>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>

    <xsl:template match="class" mode="fieldlist">
    </xsl:template>

    <!-- TYPE -->
    
    <!-- TO DO: handle doc/tag[@name='lzxtag'] -->

    <xsl:template match="property[@type]" mode="type">
        <xsl:value-of select="@type"/>
    </xsl:template>
    
    <xsl:template match="*" mode="type">
    </xsl:template>
    
    <xsl:template match="property[not(@type) and child::object]" mode="type">
        <xsl:value-of select="'Object'"/>
    </xsl:template>
    
    <xsl:template match="property[not(@type) and child::function]" mode="type">
        <xsl:value-of select="'Function'"/>
    </xsl:template>
    
    <xsl:template match="property[not(@type) and child::class]" mode="type">
        <xsl:value-of select="'Class'"/>
    </xsl:template>
    
    <xsl:template match="property[not(@type) and child::event]" mode="type">
        <xsl:value-of select="'Event'"/>
    </xsl:template>
    
    
</xsl:stylesheet>