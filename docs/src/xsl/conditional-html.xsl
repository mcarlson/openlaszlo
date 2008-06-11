<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- 
  To understand the documentation toolchain, please consult the developer's guide, 
  in Part XI, Documentation Tools and Guidelines, and especially in 
  the chapter, The Documentation Toolchain. 
  
  In a source build of OpenLaszlo, those chapters can be found at
  http://localhost:8080/trunk/docs/developers/developers.doctools.html
  
  Currently, those chapters can be found live at the following URL
  http://labs.openlaszlo.org/trunk-nightly/docs/developers/developers.doctools.html
  
  [bshine 12.29.2007]
-->
<!DOCTYPE xsl:stylesheet [

<!ENTITY lowercase      "'abcdefghijklmnopqrstuvwxyz'">
<!ENTITY uppercase      "'ABCDEFGHIJKLMNOPQRSTUVWXYZ'">

]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common"
                exclude-result-prefixes="exslt"
                version="1.0">

  <xsl:import href="common-html.xsl"/>
  
  <xsl:template name="condition-name">
    <xsl:param name="conditions"/>
    <xsl:if test="contains($conditions, ' ')">
      <xsl:message><xsl:value-of select="concat('multi-term conditions not supported: ', $conditions)"/></xsl:message>
    </xsl:if>
    <xsl:choose>
      <xsl:when test="$conditions='proxied'">
        <xsl:text>Proxied</xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="translate(@condition,&lowercase;,&uppercase;)"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template name="condition-glyphs">
    <xsl:param name="conditions" select="''"/>
    <div class="condition-glyph">
      <xsl:choose>
        <xsl:when test="$conditions='swf' or $conditions='AS2' or $conditions='as2'">
          <img alt="[SWF]" src="../includes/swf.gif"/>
        </xsl:when>
        <xsl:when test="$conditions='dhtml' or $conditions='DHTML'">
          <img alt="[DHTML]" src="../includes/dhtml.gif"/>
        </xsl:when>
        <xsl:when test="$conditions='solo' or $conditions='SOLO'">
          <img alt="[SOLO]" src="../includes/solo.gif"/>
        </xsl:when>
        <xsl:when test="$conditions='proxied'">
          <img alt="[Proxied]" src="../includes/proxied.gif"/>
        </xsl:when>
      </xsl:choose>
    </div>
  </xsl:template>
  
  <xsl:template name="condition-glyph-bar">
    <xsl:param name="conditions" select="''"/>
    <div class="condition-glyph">
      <img alt="[Warning]" src="../includes/warning.gif"/>
    </div>
    <xsl:call-template name="condition-glyphs">
      <xsl:with-param name="conditions" select="@condition"/>
    </xsl:call-template>
  </xsl:template>
  
  <xsl:template name="condition-warning">
    <xsl:param name="conditions" select="''"/>
    <xsl:param name="section-name" select="'chapter'"/>
    <xsl:text>The features described in this </xsl:text><xsl:value-of select="$section-name"/><xsl:text> only work in applications compiled to </xsl:text><xsl:value-of select="$conditions"/><xsl:text>. They do not work in applications compiled to other runtimes.</xsl:text>
  </xsl:template>
  
  <xsl:template match="section/title[@condition]">
    <xsl:apply-imports/>
    <xsl:variable name="condition.name">
      <xsl:call-template name="condition-name">
        <xsl:with-param name="conditions" select="@condition"/>
      </xsl:call-template>
    </xsl:variable>
    <div class="warning">
      <xsl:call-template name="condition-glyph-bar">
        <xsl:with-param name="conditions" select="@condition"/>
      </xsl:call-template>
      <div class="condition-description">
        <p><em><xsl:value-of select="$condition.name"/> only: </em>
          <xsl:call-template name="condition-warning">
            <xsl:with-param name="conditions" select="$condition.name"/>
            <xsl:with-param name="section-name" select="name(parent::node())"/>
          </xsl:call-template>
        </p>
      </div>
    </div>
  </xsl:template>
  
  <xsl:template match="para[@condition]">

    <div class="warning">
      <xsl:call-template name="condition-glyph-bar">
        <xsl:with-param name="conditions" select="@condition"/>
      </xsl:call-template>
      <div class="condition-description">
        <xsl:apply-imports/>
      </div>
    </div>
<?ignore
    <div class="condition-sidebar">
      <xsl:call-template name="condition-glyph-bar">
        <xsl:with-param name="conditions" select="@condition"/>
      </xsl:call-template>
    </div>
    <xsl:apply-imports/>
 ?>   
  </xsl:template>
  
</xsl:stylesheet>
