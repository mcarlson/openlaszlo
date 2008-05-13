<?xml version='1.0'?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2006-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&#160;">
]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                version='1.0'>

<xsl:template match="classsynopsis" mode="lzx">
  <div class="{name(.)}">
    <xsl:variable name="class" select="ooclass[not(@role)]"/>
    <xsl:variable name="superclass" select="ooclass[@role='extends']"/>
    <!-- TODO: add modifiers as preceding js2doc comment -->
    <xsl:text>&lt;class name="</xsl:text>
    <xsl:apply-templates select="$class/classname" mode="lzx"/>
    <xsl:text>"</xsl:text>
    <xsl:if test="$superclass">
      <xsl:text> extends="</xsl:text>
      <xsl:apply-templates select="$superclass/classname" mode="lzx"/>
      <xsl:text>"</xsl:text>
    </xsl:if>
    <xsl:if test="oointerface">
      <xsl:text> implements="</xsl:text>
      <xsl:for-each select="oointerface">
        <xsl:apply-templates select="./interfacename" mode="lzx"/>
        <xsl:if test="position()!=last()">
          <xsl:text>,&nbsp;</xsl:text>
        </xsl:if>
      </xsl:for-each>
      <xsl:text>"</xsl:text>
    </xsl:if>
    <xsl:text>&gt;</xsl:text>
    <br/>
    <xsl:apply-templates select="constructorsynopsis
                                 |destructorsynopsis
                                 |fieldsynopsis
                                 |methodsynopsis
                                 |classsynopsisinfo" mode="lzx"/>
    <xsl:text>&lt;/class&gt;</xsl:text>
  </div>
</xsl:template>

<xsl:template match="classsynopsisinfo" mode="lzx">
  <xsl:apply-templates mode="lzx"/>
</xsl:template>

<xsl:template match="ooclass|oointerface" mode="lzx">
  <span class="{name(.)}"><xsl:apply-templates mode="lzx"/></span>
</xsl:template>

<xsl:template match="modifier" mode="lzx">
  <span class="{name(.)}"><xsl:apply-templates mode="lzx"/></span>
</xsl:template>

<xsl:template match="classname|interfacename" mode="lzx">
  <span class="{name(.)}"><xsl:apply-templates mode="lzx"/></span>
</xsl:template>

<xsl:template match="fieldsynopsis[modifier/text() = 'prototype' and @role='event']" mode="lzx">
  <div class="{name(.)}">
    <xsl:if test="parent::classsynopsis">
      <xsl:text>&nbsp;&nbsp;</xsl:text>
    </xsl:if>
    <!-- TODO: add modifiers as preceding js2doc comment -->
    <xsl:text>&lt;event name="</xsl:text>
    <xsl:apply-templates select="varname" mode="lzx"/>
    <xsl:text>" /&gt;</xsl:text>
  </div>
</xsl:template>

<xsl:template match="fieldsynopsis[(modifier/text() = 'static' or modifier/text() = 'prototype') and not(@role='event')]" mode="lzx">
  <!-- ignore static and prototype fields -->
</xsl:template>

<xsl:template match="fieldsynopsis" mode="lzx">
  <div class="{name(.)}">
    <xsl:if test="parent::classsynopsis">
      <xsl:text>&nbsp;&nbsp;</xsl:text>
    </xsl:if>
    <!-- TODO: add modifiers as preceding js2doc comment -->
    <xsl:text>&lt;attribute name="</xsl:text>
    <xsl:apply-templates select="varname" mode="lzx"/>
    <xsl:text>"</xsl:text>
    <xsl:if test="type">
      <xsl:text> type="</xsl:text>
      <xsl:apply-templates select="type" mode="lzx"/>
      <xsl:text>"</xsl:text>
    </xsl:if>
    <xsl:if test="initializer">
      <xsl:text> value="</xsl:text>
      <xsl:apply-templates select="initializer" mode="lzx"/>
      <xsl:text>"</xsl:text>
    </xsl:if>
    <xsl:text> /&gt;</xsl:text>
  </div>
</xsl:template>

<xsl:template match="type|varname|initializer|methodname|methodclass|methodstaticclass|parameter" mode="lzx">
  <span class="{name(.)}"><xsl:apply-templates mode="lzx"/></span>
</xsl:template>

<xsl:template match="void" mode="lzx">
  <span class="{name(.)}"><xsl:text>void</xsl:text></span>
</xsl:template>

<xsl:template match="methodparam" mode="lzx">
  <span class="{name(.)}"><xsl:apply-templates select="parameter" mode="lzx"/></span>
</xsl:template>

<xsl:template match="constructorsynopsis" mode="lzx">
  <xsl:message><xsl:text>constructorsynopsis NYI</xsl:text></xsl:message>
</xsl:template>

<xsl:template match="destructorsynopsis" mode="lzx">
  <xsl:message><xsl:text>destructorsynopsis NYI</xsl:text></xsl:message>
</xsl:template>

<xsl:template match="methodsynopsis" mode="lzx">

  <div class="{name(.)}">
    <xsl:if test="parent::classsynopsis">
      <xsl:text>&nbsp;&nbsp;</xsl:text>
    </xsl:if>
    <!-- TODO: add modifiers as preceding js2doc comment -->
    <xsl:text>&lt;method name="</xsl:text>
    <xsl:apply-templates select="methodclass" mode="lzx"/>
    <xsl:apply-templates select="methodstaticclass" mode="lzx"/>
    <xsl:apply-templates select="methodname" mode="lzx"/>
    <xsl:text>"</xsl:text>
    <xsl:if test="methodparam">
      <xsl:text> args="</xsl:text>
      <xsl:for-each select="methodparam">
        <xsl:apply-templates select="." mode="lzx"/>
        <xsl:if test="position() != last()">
          <xsl:text>, </xsl:text>
        </xsl:if>
      </xsl:for-each>
      <xsl:text>"</xsl:text>
    </xsl:if>
    <!-- TODO: add modifiers as preceding js2doc comment -->
    <xsl:text> /&gt;</xsl:text>
  </div>
</xsl:template>

<!-- * DocBook 5 allows linking elements (link, olink, and xref) -->
<!-- * within the OO *synopsis elements (classsynopsis, fieldsynopsis, -->
<!-- * methodsynopsis, constructorsynopsis, destructorsynopsis) and -->
<!-- * their children. So we need to have mode="java|cpp|idl|perl" -->
<!-- * per-mode matches for those linking elements in order for them -->
<!-- * to be processed as expected. -->
<xsl:template match="link|olink|xref" mode="lzx">
  <xsl:apply-templates select="."/>
</xsl:template>


</xsl:stylesheet>
