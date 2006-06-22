<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2005 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common"
                exclude-result-prefixes="exslt"
                version="1.0">
  
  <xsl:import href="docbook/chunk.xsl"/>
  <xsl:import href="parameters.xsl"/>
  
  <!-- Address of the servlet relative to the generated file -->
  <xsl:param name="lpsdir" select="'../../'"/>
  <!-- Address of the generated files relative to servlet -->
  <xsl:param name="localdir"/>
  <!-- class of html body element -->
  <xsl:param name="html.body.class"/>
  <!-- Show fixmes if true -->
  <xsl:param name="show.fixmes" select="0"/>
  
  <xsl:template name="user.head.content">
    <script type="text/javascript" language="JavaScript" src="{$lpsdir}lps/includes/embed.js"/>
    <script type="text/javascript" language="JavaScript" src="{$lpsdir}docs/includes/docs.js"/>
  </xsl:template>
  
  <xsl:template name="body.attributes">
    <xsl:attribute name="class">
      <xsl:value-of select="$html.body.class"/>
    </xsl:attribute>
  </xsl:template>
  
  <!-- Don't show list preface sections in the book toc -->
  <xsl:template match="preface" mode="toc">
    <xsl:param name="toc-context" select="."/>
    <dt>
      <xsl:call-template name="toc.line">
        <xsl:with-param name="toc-context" select="$toc-context"/>
      </xsl:call-template>
    </dt>
  </xsl:template>
  
  <xsl:template match="para[@role='todo' or @role='fixme']">
    <xsl:if test="$show.fixmes != 0">
      <xsl:apply-imports/>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="remark[@role='todo' or @role='fixme']">
    <xsl:if test="$show.fixmes != 0">
      <xsl:apply-imports/>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="literal[@role='unsupported']">
    <tt class="literal strikeout">
      <xsl:apply-templates/>
    </tt>
  </xsl:template>
  
  <xsl:template match="ulink[@type]">
    <xsl:variable name="ulink">
      <xsl:apply-imports/>
    </xsl:variable>
    <a>
      <xsl:choose>
        <xsl:when test="@type='reference'">
          <xsl:attribute name="target">laszlo-reference</xsl:attribute>
        </xsl:when>
        <xsl:when test="@type">
          <xsl:attribute name="target">
            <xsl:value-of select="@type"/>
          </xsl:attribute>
        </xsl:when>
      </xsl:choose>
      <xsl:for-each select="exslt:node-set($ulink)/a/@*[name()!='target']|
                    exslt:node-set($ulink)/a/node()">
        <xsl:copy-of select="."/>
      </xsl:for-each>
    </a>
  </xsl:template>
  
  <xsl:template match="ulink[@type='onclick']" priority="1">
    <a name="{generate-id(.)}"/>
    <a href="#{generate-id(.)}" onclick="{@url}">
      <xsl:apply-templates/>
    </a>
  </xsl:template>
  
  <xsl:template match="processing-instruction('lzx-embed')">
    <div class="embedded-canvas">
      <script language="JavaScript" type="text/javascript">
        <xsl:value-of select="."/>
      </script>
    </div>
  </xsl:template>
  
  <xsl:template match="processing-instruction('lzx-edit')">
    <xsl:param name="href">
      <xsl:text>../../laszlo-explorer/editor.jsp?src=</xsl:text>
      <xsl:value-of select="$localdir"/>
      <xsl:value-of select="."/>
    </xsl:param>
    <xsl:text>&#x0a;</xsl:text>
    <div class="edit-button">
      <a href="{$href}" target="lzview"><img border="0" alt="" height="18" width="42" src="../../docs/includes/d_t_editbutton.gif"/></a>
    </div>
    <xsl:text>&#x0a;</xsl:text>
  </xsl:template>

  <xsl:template name="user.footer.content">
    <hr/>
<!-- * H_LZ_COPYRIGHT_BEGIN *********************************************** -->
<p class="copyright">Copyright &#xA9; 2002-2005 <a target="_top"
href="http://www.laszlosystems.com/">Laszlo Systems, Inc.</a>
All Rights Reserved. Unauthorized use, duplication or
distribution is strictly prohibited. This is the proprietary
information of Laszlo Systems, Inc. Use is subject to license terms.</p>
<!-- * H_LZ_COPYRIGHT_END ************************************************* -->
  </xsl:template>
</xsl:stylesheet>
