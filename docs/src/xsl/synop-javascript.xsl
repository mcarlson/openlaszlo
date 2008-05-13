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

<xsl:template match="classsynopsis" mode="javascript">
  <div class="{name(.)}">
    <xsl:variable name="class" select="ooclass[not(@role)]"/>
    <xsl:variable name="superclass" select="ooclass[@role='extends']"/>
    <xsl:for-each select="$class/modifier">
      <xsl:apply-templates mode="javascript"/>
      <xsl:text>&nbsp;</xsl:text>
    </xsl:for-each>
    <xsl:apply-templates select="$class/classname" mode="javascript"/>
    <xsl:if test="$superclass">
      <xsl:text> extends&nbsp;</xsl:text>
      <xsl:apply-templates select="$superclass/classname" mode="javascript"/>
    </xsl:if>
    <xsl:if test="oointerface">
      <xsl:text> implements&nbsp;</xsl:text>
      <xsl:for-each select="oointerface">
        <xsl:apply-templates select="./interfacename" mode="javascript"/>
        <xsl:if test="position()!=last()">
          <xsl:text>,&nbsp;</xsl:text>
        </xsl:if>
      </xsl:for-each>
    </xsl:if>
    <xsl:text>&nbsp;{</xsl:text>
    <br/>
    <xsl:apply-templates select="constructorsynopsis
                                 |destructorsynopsis
                                 |fieldsynopsis
                                 |methodsynopsis
                                 |classsynopsisinfo" mode="javascript"/>
    <xsl:text>}</xsl:text>
  </div>
</xsl:template>

<xsl:template match="classsynopsisinfo" mode="javascript">
  <xsl:apply-templates mode="javascript"/>
</xsl:template>

<xsl:template match="ooclass|oointerface" mode="javascript">
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="modifier" mode="javascript">
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="classname" mode="javascript">
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="interfacename" mode="javascript">
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="exceptionname" mode="javascript">
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="fieldsynopsis[@role='event']" mode="javascript">
  <div class="{name(.)}">
    <xsl:if test="parent::classsynopsis">
      <xsl:text>&nbsp;&nbsp;</xsl:text>
    </xsl:if>
    <xsl:for-each select="modifier">
      <xsl:apply-templates mode="javascript"/>
      <xsl:text>&nbsp;</xsl:text>
    </xsl:for-each>
    <xsl:text>event </xsl:text>
    <xsl:apply-templates select="varname" mode="javascript"/>
    <xsl:text>;</xsl:text>
  </div>
</xsl:template>

<xsl:template match="fieldsynopsis" mode="javascript">
  <div class="{name(.)}">
    <xsl:if test="parent::classsynopsis">
      <xsl:text>&nbsp;&nbsp;</xsl:text>
    </xsl:if>
    <xsl:for-each select="modifier">
      <xsl:apply-templates mode="javascript"/>
      <xsl:text>&nbsp;</xsl:text>
    </xsl:for-each>
    <xsl:text>var </xsl:text>
    <xsl:apply-templates select="varname" mode="javascript"/>
    <xsl:if test="type">
      <xsl:text>&nbsp;:&nbsp;</xsl:text>
      <xsl:apply-templates select="type" mode="javascript"/>
    </xsl:if>
    <xsl:if test="initializer">
      <xsl:apply-templates select="initializer" mode="javascript"/>
    </xsl:if>
    <xsl:text>;</xsl:text>
  </div>
</xsl:template>

<xsl:template match="type" mode="javascript">
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="varname" mode="javascript">
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="initializer" mode="javascript">
  <span class="{name(.)}">
    <xsl:text>&nbsp;=&nbsp;</xsl:text>
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="void" mode="javascript">
  <span class="{name(.)}">
    <xsl:text>void&nbsp;</xsl:text>
  </span>
</xsl:template>

<xsl:template match="methodname" mode="javascript">
  <xsl:variable name="class" select="ooclass[not(@role)]"/>  
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="methodclass" mode="javascript">
  <xsl:variable name="class" select="ooclass[not(@role)]"/>  
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="methodstaticclass" mode="javascript">
  <xsl:variable name="class" select="ooclass[not(@role)]"/>  
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="methodparam" mode="javascript">
  <span class="{name(.)}">
    <xsl:apply-templates select="parameter" mode="javascript"/>
    <xsl:if test="type">
      <xsl:text>&nbsp;:&nbsp;</xsl:text>
      <xsl:apply-templates select="type" mode="javascript"/>
    </xsl:if>
  </span>
</xsl:template>

<xsl:template match="parameter" mode="javascript">
  <span class="{name(.)}">
    <xsl:apply-templates mode="javascript"/>
  </span>
</xsl:template>

<xsl:template match="constructorsynopsis" mode="javascript">
  <div class="{name(.)}">
    <xsl:if test="parent::classsynopsis">
      <xsl:text>&nbsp;&nbsp;</xsl:text>
    </xsl:if>
    <xsl:for-each select="modifier">
      <xsl:apply-templates mode="javascript"/>
      <xsl:text>&nbsp;</xsl:text>
    </xsl:for-each>
  
    <xsl:text>function construct(parent : Object, args : {</xsl:text>
    <xsl:for-each select="methodparam[@role='initializer']">
      <xsl:apply-templates select="." mode="javascript"/>
      <xsl:if test="position() != last()">
        <xsl:text>,&nbsp;</xsl:text>
      </xsl:if>
    </xsl:for-each>
    <xsl:text>});</xsl:text>
  </div>
</xsl:template>

<xsl:template match="destructorsynopsis" mode="javascript">
</xsl:template>

<xsl:template match="methodsynopsis" mode="javascript">

  <div class="{name(.)}">
    <xsl:if test="parent::classsynopsis">
      <xsl:text>&nbsp;&nbsp;</xsl:text>
    </xsl:if>
    <xsl:for-each select="modifier">
      <xsl:apply-templates mode="javascript"/>
      <xsl:text>&nbsp;</xsl:text>
    </xsl:for-each>
  
    <xsl:apply-templates select="methodstaticclass" mode="javascript"/>
    <xsl:apply-templates select="methodclass" mode="javascript"/>
    <xsl:apply-templates select="methodname" mode="javascript"/>

    <xsl:text>(</xsl:text>
    <xsl:for-each select="methodparam">
      <xsl:apply-templates select="." mode="javascript"/>
      <xsl:if test="position() != last()">
        <xsl:text>, </xsl:text>
      </xsl:if>
    </xsl:for-each>
    <xsl:text>)</xsl:text>

    <xsl:if test="type">
      <xsl:text> :&nbsp;</xsl:text>
      <xsl:apply-templates select="type" mode="javascript"/>
    </xsl:if>
    <xsl:text>;</xsl:text>
  </div>
</xsl:template>

<!-- * DocBook 5 allows linking elements (link, olink, and xref) -->
<!-- * within the OO *synopsis elements (classsynopsis, fieldsynopsis, -->
<!-- * methodsynopsis, constructorsynopsis, destructorsynopsis) and -->
<!-- * their children. So we need to have mode="java|cpp|idl|perl" -->
<!-- * per-mode matches for those linking elements in order for them -->
<!-- * to be processed as expected. -->
<xsl:template match="link|olink|xref" mode="javascript">
  <xsl:apply-templates select="."/>
</xsl:template>


</xsl:stylesheet>
