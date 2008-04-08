<?xml version="1.0" encoding="utf-8"?>
<!--
@!@!@!@!@ ATTENTION EDITORS OF THIS FILE @!@!@!@!@

If you edit this file, please validate your work using http://validator.w3.org/
-->
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

<!ENTITY constraint    "(starts-with(normalize-space(.),'$') and
                         contains(normalize-space(.),'{'))">

]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:dbk="http://docbook.org/ns/docbook"
                exclude-result-prefixes="dbk"
                version="1.0">

<!-- convert to use docbook markup, as in http://infohost.nmt.edu/tcc/help/pubs/docbook/inline-section.html
     or http://ecolore.leeds.ac.uk/xml/about/db_usage.xml?lang=en
     (see wrt to sgmltag) -->
     
  <xsl:param name="lzxpp-base"/>
  <xsl:param name="lzxpp-url"/>

  <!-- a template function to drive it all -->
  <xsl:template name="lzx-pretty-print">
    <xsl:param name="source"/>
    <xsl:param name="callout.ids"/>
    <xsl:apply-templates mode="lzxpp-co" select="$source">
      <xsl:with-param name="callout.ids" select="$callout.ids"/>
    </xsl:apply-templates>
  </xsl:template>
  
   <!-- lzxpp-co lets us insert <span class="em"></span> blocks whereever we are told
        a callout should appear. This should work for elements, attributes, comments, and text (but not substrings). -->
   <xsl:template mode="lzxpp-co" match="/">
     <xsl:param name="callout.ids"/>
     <xsl:apply-templates mode="lzxpp-co">
       <xsl:with-param name="callout.ids" select="$callout.ids"/>
     </xsl:apply-templates>
   </xsl:template>
   
   <xsl:template mode="lzxpp-co" match="@*|node()">
     <xsl:param name="callout.ids"/>
     <xsl:variable name="ctx.id" select="generate-id(.)"/>
     <xsl:choose>
       <xsl:when test="contains($callout.ids, concat(' ', $ctx.id, ' '))">
         <emphasis>
           <xsl:apply-templates mode="lzxpp" select=".">
             <xsl:with-param name="callout.ids" select="$callout.ids"/>
           </xsl:apply-templates>
         </emphasis>
       </xsl:when>
       <xsl:otherwise>
         <xsl:apply-templates mode="lzxpp" select=".">
           <xsl:with-param name="callout.ids" select="$callout.ids"/>
         </xsl:apply-templates>
       </xsl:otherwise>
     </xsl:choose>
   </xsl:template>

  <!-- lzxpp does the actual work of pretty-printing the source -->
  <xsl:template mode="lzxpp" match="*">
    <xsl:param name="callout.ids"/>
      <markup>&lt;</markup>
      <sgmltag class="element">
        <xsl:attribute name="id"><xsl:value-of select="generate-id()"/></xsl:attribute>
        <xsl:value-of select="name()"/>
      </sgmltag>
      <xsl:for-each select="@*">
        <xsl:text> </xsl:text>
        <xsl:apply-templates mode="lzxpp-co" select=".">
          <xsl:with-param name="callout.ids" select="$callout.ids"/>
        </xsl:apply-templates>
      </xsl:for-each>
      <xsl:choose>
        <xsl:when test="node()">
          <markup>&gt;</markup>
          <xsl:apply-templates mode="lzxpp-co">
            <xsl:with-param name="callout.ids" select="$callout.ids"/>
          </xsl:apply-templates>
          <markup>&lt;/</markup>
          <sgmltag class="element"><xsl:value-of select="name()"/></sgmltag>
          <markup>&gt;</markup>
        </xsl:when>
        <xsl:otherwise><markup>/&gt;</markup></xsl:otherwise>
      </xsl:choose>
  </xsl:template>

  <xsl:template mode="lzxpp" match="comment()">
    <xsl:if test="not(ancestor::*)">
      <xsl:text>&#10;</xsl:text>
    </xsl:if>
    <sgmltag class="sgmlcomment">
      <xsl:if test="contains(., 'Copyright')">
        <xsl:attribute name="role">Copyright</xsl:attribute>
      </xsl:if>
      <xsl:value-of select="."/>
    </sgmltag>
    <xsl:if test="not(ancestor::*) and following-sibling::*[1]=following-sibling::node()[1]">
      <xsl:text>&#10;</xsl:text>
    </xsl:if>
  </xsl:template>

  <xsl:template mode="lzxpp" match="text()[normalize-space(.)='']">
    <xsl:value-of select="."/>
  </xsl:template>
  
  <xsl:template mode="lzxpp" match="text()">
    <xsl:param name="quote" select="contains(., '&lt;') or contains(., '&gt;') or contains(., '&amp;')"/>
    <code>
      <xsl:if test="$quote">
        <markup>&lt;![CDATA[</markup>
      </xsl:if>
      <xsl:value-of select="."/> <!-- this is losing the semi-colons. xsl:copy and xsl:copy-of do the same thing. And disable-output-escaping="yes" doesn't help either. -->
      <xsl:if test="$quote">
        <markup><xsl:text>]</xsl:text><xsl:text>]></xsl:text></markup>
      </xsl:if>
    </code>
  </xsl:template>

  <xsl:template mode="lzxpp" match="@*">
    <sgmltag class="attribute"><xsl:value-of select="name()"/></sgmltag>
    <xsl:text>="</xsl:text>
    <xsl:apply-templates mode="lzxpp-attribute-value" select="."/>
    <xsl:text>"</xsl:text>
  </xsl:template>
  
  <xsl:template mode="lzxpp" match="processing-instruction('lzx-co')">
    <co>
      <xsl:attribute name="id"><xsl:value-of select="normalize-space(.)"/></xsl:attribute>
    </co>
  </xsl:template>

  <!--
    Special display for attribute values
  -->

  <xsl:template mode="lzxpp-attribute-value" match="@*">
    <!-- Attribute value normalization will strip newlines, but may leave extra 
         spaces in place. This is part of the XML 1.0 spec 
         (http://www.w3.org/TR/REC-xml/#AVNormalize) and cannot be turned off,
         so the best thing to do is to strip out the extra spaces. -->
    <sgmltag class="attvalue">
      <xsl:value-of select="normalize-space(.)"/>
    </sgmltag>
  </xsl:template>

<?ignore
  <xsl:template mode="lzxpp-attribute-value" match="@*[&constraint;]" >
    <span class="constraint-markup">
      <xsl:value-of select="substring-before(., '{')"/>
      <xsl:text>{</xsl:text>
    </span>
    <xsl:variable name="after" select="substring-after(., '{')"/>
    <span class="constraint-expression">
      <xsl:value-of select="substring($after, 1, string-length($after)-1)"/>
    </span>
    <span class="constraint-markup">}</span>
  </xsl:template>

  <xsl:template mode="lzxpp-attribute-value" match="@id|@name">
    <span class="name"><xsl:value-of select="."/></span>
  </xsl:template>

  <xsl:template mode="lzxpp-attribute-value" match="include/@href">
    <a href="{$lzxpp-url}{.}"><xsl:value-of select="."/></a>
  </xsl:template>

  <xsl:template mode="lzxpp-attribute-value" match="resource/@src
                |resource/frame/@src">
    <a href="{$lzxpp-base}{.}"><xsl:value-of select="."/></a>
  </xsl:template>

  <xsl:template mode="lzxpp-attribute-value" match="attribute/@value[not(&constraint;)]">
    <code><xsl:value-of select="."/></code>
  </xsl:template>
?>

</xsl:stylesheet>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
