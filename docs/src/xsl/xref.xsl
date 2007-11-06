<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylsheet [
<!ENTITY cr "<xsl:text>&#10;</xsl:text>">
]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:h="http://www.w3.org/1999/xhtml"
                version="1.0">

  <!-- Relative path to LPS servlet -->
  <xsl:param name="lpsdir" select="'../../'"/>
  <!-- Relative path to docs directory -->
  <xsl:param name="docsdir" select="'../'"/>
  <!-- Relative path to reference directory -->
  <xsl:param name="reference.dir" select="concat($docsdir, 'reference/')"/>
  
  <xsl:template name="expand-href">
    <xsl:variable name="key" select="substring-after(substring-before(@href, '}'), '${')"/>
    <xsl:variable name="remainder.maybe.slash" select="substring-after(@href, '}')"/>
    <xsl:variable name="remainder">
      <xsl:choose>
        <xsl:when test="starts-with($remainder.maybe.slash, '/')">
          <xsl:value-of select="substring-after($remainder.maybe.slash, '/')"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$remainder.maybe.slash"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="dir">
      <xsl:choose>
        <xsl:when test="$key = ''"/>
        <xsl:when test="$key = 'component-design'">
          <xsl:value-of select="concat($docsdir, 'component-design/')"/>
        </xsl:when>
        <xsl:when test="$key = 'demos'">
          <xsl:value-of select="concat($lpsdir, 'demos/')"/>
        </xsl:when>
        <xsl:when test="$key = 'dguide'">
          <xsl:value-of select="concat($docsdir, 'developers/')"/>
        </xsl:when>
        <xsl:when test="$key = 'deploy'">
          <xsl:value-of select="concat($docsdir, 'deployers/')"/>
        </xsl:when>
        <xsl:when test="$key = 'design'">
          <xsl:value-of select="concat($docsdir, 'designers/')"/>
        </xsl:when>
        <xsl:when test="$key = 'develop'">
          <xsl:value-of select="concat($docsdir, 'developers/')"/>
        </xsl:when>
        <xsl:when test="$key = 'examples'">
          <xsl:value-of select="concat($lpsdir, 'examples/')"/>
        </xsl:when>
        <xsl:when test="$key = 'reference'">
          <xsl:value-of select="$reference.dir"/>
        </xsl:when>
        <xsl:when test="$key = 'tutorials'">
          <xsl:value-of select="concat($docsdir, 'developers/tutorials/')"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:message terminate="yes">
          Unknown directory "<xsl:value-of select="$key"/>" in href="<xsl:value-of select="@href"/>"
          </xsl:message>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    
    <xsl:choose>
      <xsl:when test="$key = 'reference'">
        <xsl:call-template name="create-reference-link">
          <xsl:with-param name="href" select="$remainder"/>
          <xsl:with-param name="reference.dir" select="$dir"/>
        </xsl:call-template>
        <xsl:value-of select="concat($dir, substring($remainder, 2))"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="concat($dir, $remainder)"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template name="create-reference-link">
    <xsl:param name="href"/>
    <xsl:param name="reference.dir" select="$reference.dir"/>
    <xsl:value-of select="concat($reference.dir, $href)"/>
  </xsl:template>
  
  <xsl:template name="href-target">
    <xsl:param name="key" select="substring-after(substring-before(@href, '}'), '${')"/>
    <xsl:choose>
      <xsl:when test="$key = 'components-design'">laszlo-components-design</xsl:when>
      <xsl:when test="$key = 'dguide'">laszlo-dguide</xsl:when>
      <xsl:when test="$key = 'tutorials'">laszlo-dguide</xsl:when>
      <xsl:when test="$key = 'reference'">laszlo-reference</xsl:when>
    </xsl:choose>
  </xsl:template>
  
  <xsl:param name="target.db" select="'../build/reference/target.db'"/>
  <xsl:key name="targetptr-key" match="div|obj" use="@targetptr"/>
  
  <!-- xref.xsl calls this -->
  <xsl:template name="wrap-link">
    <xsl:param name="href"/>
    <xsl:param name="content"/>
    <ulink url="../reference/{$href}" type="reference">
      <xsl:copy-of select="$content"/>
    </ulink>
  </xsl:template>
  
  <xsl:template name="find-target">
    <xsl:param name="prefix" select="''"/>
    <xsl:param name="key">
      <xsl:value-of select="$prefix"/>
      <xsl:value-of select="text()"/>
    </xsl:param>
<!-- [jgrandy 10/31/06] Turn this off until we have the refguide building on Legals again
    <xsl:for-each select="document($target.db)">
      <xsl:choose>
        <xsl:when test="starts-with($key, 'class-') and
                  contains(' Object Function Number Boolean Array Null String Undefined ', concat(' ', substring-after($key, 'class-'), ' '))"/>
        <xsl:when test="count(key('targetptr-key',$key))=0">
          <xsl:message>
            <xsl:value-of select="$docid"/>
            <xsl:text>: missing key for </xsl:text>
            <xsl:value-of select="$key"/>
          </xsl:message>
        </xsl:when>
        <xsl:when test="count(key('targetptr-key',$key))=1">
          <xsl:call-template name="create-reference-link">
            <xsl:with-param name="href" select="key('targetptr-key',$key)/@href"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:variable name="magic">
            <xsl:choose>
              <xsl:when test="$key='class-view' or $key='tag-view'">2</xsl:when>
              <xsl:when test="$key='class-font' or $key='tag-font'">1</xsl:when>
              <xsl:otherwise>
                <xsl:message>
                  <xsl:value-of select="$docid"/>
                  <xsl:text>: duplicate entries for </xsl:text>
                  <xsl:value-of select="$key"/>
                </xsl:message>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:variable>
          <xsl:call-template name="create-reference-link">
            <xsl:with-param name="href" select="key('targetptr-key',$key)[$magic]/@href"/>
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
-->
  </xsl:template>
  
  <xsl:template name="link-member">
    <xsl:param name="prefix"/>
    <xsl:param name="content"/>
    <xsl:param name="key">
      <xsl:choose>
        <xsl:when test="true()"/>
        <xsl:when test="@link='false'"/>
        <xsl:when test="contains(string(), '.')">
          <xsl:variable name="default.kind">
            <xsl:choose>
              <xsl:when test="local-name()='member'">class</xsl:when>
              <xsl:otherwise>tag</xsl:otherwise>
            </xsl:choose>
          </xsl:variable>
          <xsl:value-of select="concat($prefix, $default.kind, '-', string())"/>
        </xsl:when>
        <xsl:when test="@classname">
          <xsl:value-of select="concat($prefix, 'class-', @classname, '.', string())"/>
        </xsl:when>
        <xsl:when test="@tagname">
          <xsl:value-of select="concat($prefix, 'tag-', @tagname, '.', string())"/>
        </xsl:when>
      </xsl:choose>
    </xsl:param>
    <xsl:variable name="href">
      <xsl:if test="$key!=''">
        <xsl:call-template name="find-target">
          <xsl:with-param name="key" select="$key"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$href!=''">
        <xsl:call-template name="wrap-link">
          <xsl:with-param name="href" select="$href"/>
          <xsl:with-param name="content">
            <xsl:value-of select="$content"/>
          </xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:copy-of select="$content"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>
