<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xi="http://www.w3.org/2003/XInclude"
                version="1.0">
  
  <xsl:import href="../../../../tools/docbook-xsl-1.65.1/html/docbook.xsl"/>
  <xsl:import href="common-html.xsl"/>
  
  <!-- override default dguide parameters -->
  <xsl:param name="use.extensions" select="'0'"/>
  <xsl:param name="chapter.autolabel" select="'0'"/>
  <xsl:param name="callout.graphics" select="'0'"/>
  <xsl:param name="callout.unicode" select="'1'"/>
  
  <!-- special formatting for the index -->
  <xsl:template match="/book">
    <html>
      <head>
        <title><xsl:value-of select="title"/></title>
      </head>
      <body>
        <h1><xsl:value-of select="title"/></h1>
        <p>This is the fast build of the dguide.  Chapters aren't
        numbered and cross-chapter navigation references will be
        marked as "???".  Consult the standard build to see the dguide
        as it will appear to users.</p>
        <ol type="I">
          <xsl:for-each select="part">
            <li><xsl:value-of select="title"/></li>
            <ol start="{count(preceding::xi:include|preceding::chapter)}">
              <xsl:for-each select="xi:include|chapter">
                <li>
                  <xsl:apply-templates mode="toc-title" select="."/>
                </li>
              </xsl:for-each>
            </ol>
          </xsl:for-each>
        <xsl:for-each select="xi:include">
          <li type="circle">
            <xsl:apply-templates mode="toc-title" select="."/>
          </li>
        </xsl:for-each>
        </ol>
      </body>
    </html>
  </xsl:template>

  <xsl:template mode="toc-title" match="xi:include">
    <a href="{substring-before(@href, '.dbk')}.html">
      <xsl:value-of select="document(@href)/*/title"/>
    </a>
  </xsl:template>
  
  <xsl:template mode="toc-title" match="chapter">
    <xsl:value-of select="title"/>
  </xsl:template>
</xsl:stylesheet>
