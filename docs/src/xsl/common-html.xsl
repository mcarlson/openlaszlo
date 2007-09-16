<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

<!ENTITY nbsp  "&#160;">

]>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common"
                xmlns:dyn="http://exslt.org/dynamic"
                xmlns:saxon="http://icl.com/saxon"
                xmlns:xi="http://www.w3.org/2003/XInclude"
                xmlns:dbk="http://docbook.org/ns/docbook"
                exclude-result-prefixes="exslt xi dbk dyn saxon"
                version="1.0">
  
  <xsl:import href="http://docbook.sourceforge.net/release/xsl/current/html/chunk.xsl"/>
  <xsl:import href="parameters.xsl"/>
  <xsl:import href="synop-javascript.xsl"/>
  <xsl:import href="synop-lzx.xsl"/>
  <xsl:import href="lzx-pretty-print.xsl"/>

  <!-- Path to base directory on local disk of output files -->
  <xsl:param name="base.dir" />

  <!-- Address of the servlet relative to the generated file -->
  <xsl:param name="root.relative.lps.includes" select="'../lps/includes/'"/>
  <!-- Address of the generated files relative to servlet -->
  <xsl:param name="localdir"/>

  <!-- DEPRECATED: Relative address of embedded LZX files -->
  <xsl:param name="lzxdir" select="'programs/'"/>

  <!-- class of html body element -->
  <xsl:param name="html.body.class"/>
  <!-- Show fixmes if true -->
  <xsl:param name="show.fixmes" select="0"/>

  <xsl:param name="textdata.default.encoding"/>
  
  <xsl:param name="warn.no.programlisting.canvas.width" select="false()"/>
  
  <xsl:template name="local.lps.path">
    
    <xsl:variable name="root.relative">
      <xsl:call-template name="dbhtml-dir"/>
    </xsl:variable>

    <xsl:variable name="depth">
      <xsl:call-template name="count.uri.path.depth">
        <xsl:with-param name="filename" select="$root.relative"/>
      </xsl:call-template>
    </xsl:variable>

    <xsl:variable name="href">
      <xsl:call-template name="copy-string">
        <xsl:with-param name="string" select="'../'"/>
        <xsl:with-param name="count" select="$depth"/>
      </xsl:call-template>
    </xsl:variable>

    <xsl:value-of select="$href" 
    />
  </xsl:template>
  
  <xsl:template name="user.head.content">
    <xsl:variable name="rootpath">
      <xsl:call-template name="local.lps.path"/>
    </xsl:variable>
    <link rel="stylesheet" href="{$rootpath}includes/docbook.css" type="text/css"/>
    <link rel="stylesheet" href="{$rootpath}includes/lzx-pretty-print.css" type="text/css"/>
    <script type="text/javascript" language="JavaScript" src="{$rootpath}{$root.relative.lps.includes}embed-compressed.js"/>
    <script type="text/javascript" language="JavaScript" src="{$rootpath}includes/docs.js"/>
    <script type="text/javascript" language="JavaScript"><xsl:text>lzOptions = { ServerRoot: '</xsl:text><xsl:value-of select="$rootpath"/><xsl:text>', dhtmlKeyboardControl: false };</xsl:text></script>
    <script type="text/javascript" language="JavaScript"><xsl:text>Lz.dhtmlEmbedLFC('</xsl:text><xsl:value-of select="$rootpath"/><xsl:text>/lps/includes/lfc/LFCdhtml.js');</xsl:text></script>
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
  
  <xsl:template match="term" mode="index-title-content">
    <xsl:value-of select="@xreflabel"/>
  </xsl:template>

  <xsl:template match="processing-instruction('lzx-embed')">
    <div class="embedded-canvas">
      <script language="JavaScript" type="text/javascript">
        <xsl:value-of select="."/>
      </script>
    </div>
  </xsl:template>

  <xsl:template match="programlistingco[areaspec/area[@units='other']]">
    <!-- short-circuit default programlistingco handling, since docbook-xsl won't
         know how to handle our areaspec. -->
    <xsl:apply-templates select="programlisting"/>
  </xsl:template>
  
  <xsl:template match="programlisting[@language='lzx' and textobject/textdata/@fileref]">
    <!-- extract necessary information from context -->
    <xsl:variable name="fname" select="textobject/textdata/@fileref"/>
    <xsl:variable name="query-parameters" select="parameter[@role='query']"/>
    <xsl:variable name="canvas-parameters" select="parameter[@role='canvas']"/>

    <!-- format live example -->
    <xsl:variable name="live" select="ancestor::example[@role='live-example'] or ancestor::informalexample[@role='live-example']"/>
    <xsl:if test="$live">
      <div class="embedded-canvas">
        <xsl:variable name="query-param">
          <xsl:if test="$query-parameters">&amp;<xsl:value-of select="$query-parameters[1]/text()"></xsl:value-of></xsl:if>
        </xsl:variable>
        <xsl:variable name="canvas-id" select="generate-id(.)"/>
        <xsl:variable name="swf-embed-params">{url: '<xsl:value-of select="concat($fname, '?lzt=swf', $query-param)"/>', id: '<xsl:value-of select="concat($canvas-id,'SWF')"/>', <xsl:value-of select="$canvas-parameters"/>}</xsl:variable>
        <xsl:variable name="dhtml-embed-params">{url: '<xsl:value-of select="concat($fname, '?lzt=html&amp;lzr=dhtml', $query-param)"/>', id: '<xsl:value-of select="concat($canvas-id,'DHTML')"/>', <xsl:value-of select="$canvas-parameters"/>}</xsl:variable>
        <!-- To test examples in DHTML, uncomment the second script block below.
             If you don't want to see the SWF version as well, comment out the 
             first script block. -->
        <script language="JavaScript" type="text/javascript">
          Lz.swfEmbed(<xsl:value-of select="$swf-embed-params"/>);
        </script>
<?ignore
        <script language="JavaScript" type="text/javascript">
          Lz.dhtmlEmbed(<xsl:value-of select="$dhtml-embed-params"/>);
        </script>
?>
      </div>
    </xsl:if>
    
    <!-- the program listing itself can be formatted by dbk-xsl -->
    <pre class="programlisting">
      <xsl:apply-templates select="phrase"/>
    </pre>
    
    <!-- throw in the edit button -->
    <xsl:if test="$live">
      <xsl:variable name="edit-href">
        <xsl:text>../../../laszlo-explorer/editor.jsp?src=</xsl:text>
        <xsl:value-of select="$localdir"/>
        <xsl:text>developers/</xsl:text> <!-- TODO: BUG LPP-4683 
                                          This should not be hardcoded to developers. What about 
                                          programs that are in contributors or deployers? This needs to 
                                          be parameterized per-book [bshine 2007.09.07] -->
        <xsl:value-of select="$fname"/>
      </xsl:variable>
      <xsl:text>&#x0a;</xsl:text>
      <div class="edit-button">
        <a href="{$edit-href}" target="lzview"><img border="0" alt="" height="18" width="42" src="../../docs/includes/d_t_editbutton.gif"/></a>
      </div>
      <xsl:text>&#x0a;</xsl:text>
    </xsl:if>
  </xsl:template>

  <xsl:template match="sgmltag[@role='Copyright']">
    <div class="lzx-copyright">
      <xsl:apply-imports/>
    </div>
  </xsl:template>
  
  <xsl:template name="get-canvas-attribute">
    <xsl:param name="text"/>
    <xsl:param name="attribute"/>
    <xsl:param name="default"/>
    
    <xsl:variable name="snip1" select="substring-after($text,'&lt;canvas')"/>
    <xsl:variable name="snip2">
      <xsl:if test="$snip1 and $snip1 != ''">
        <xsl:value-of select="substring-before($snip1,'&gt;')"/>
      </xsl:if>
    </xsl:variable>
    <xsl:variable name="snip3">
      <xsl:if test="$snip2 and $snip2 != ''">
        <xsl:value-of select="substring-after($snip2, concat($attribute,'=&#34;'))"/>
      </xsl:if>
    </xsl:variable>
    <xsl:variable name="snip4">
      <xsl:if test="$snip3 and $snip3 != ''">
        <xsl:value-of select="substring-before($snip3,'&#34;')"/>
      </xsl:if>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$snip4 and $snip4 != ''">
        <xsl:value-of select="$snip4"/>
      </xsl:when>
      <xsl:otherwise><xsl:value-of select="$default"/></xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="programlisting[@role='lzx-embednew']">
    <xsl:variable name="fname" select="filename/text()"/>
    <xsl:variable name="query-parameters" select="parameter/text()"/>
    <xsl:variable name="text" select="code/text()"/>
    
      <xsl:variable name="query-param">
        <xsl:if test="$query-parameters">&amp;<xsl:value-of select="$query-parameters"></xsl:value-of></xsl:if>
      </xsl:variable>
      <xsl:variable name="canvas-width">
        <xsl:call-template name="get-canvas-attribute">
          <xsl:with-param name="text" select="string($text)"/>
          <xsl:with-param name="attribute" select="'width'"/>
          <xsl:with-param name="default" select="'500'"/>
        </xsl:call-template>
      </xsl:variable>
      <xsl:variable name="canvas-height">
        <xsl:call-template name="get-canvas-attribute">
          <xsl:with-param name="text" select="string($text)"/>
          <xsl:with-param name="attribute" select="'height'"/>
          <xsl:with-param name="default" select="'400'"/>
        </xsl:call-template>
      </xsl:variable>
      <xsl:variable name="canvas-id" select="generate-id(.)"/>
      <xsl:variable name="swf-embed-params">{url: '<xsl:value-of select="concat($lzxdir, $fname, '?lzt=swf', $query-param)"/>', id: '<xsl:value-of select="concat($canvas-id,'SWF')"/>', width: '<xsl:copy-of select="$canvas-width"/>', height: '<xsl:copy-of select="$canvas-height"/>'}</xsl:variable>
      <xsl:variable name="dhtml-embed-params">{url: '<xsl:value-of select="concat($lzxdir, $fname, '?lzt=html&amp;lzr=dhtml', $query-param)"/>', id: '<xsl:value-of select="concat($canvas-id,'DHTML')"/>', width: '<xsl:copy-of select="$canvas-width"/>', height: '<xsl:copy-of select="$canvas-height"/>'}</xsl:variable>

    <div class="embedded-canvas">
      <!-- To test examples in DHTML, uncomment the second script block below.
           If you don't want to see the SWF version as well, comment out the 
           first script block. -->
      <script language="JavaScript" type="text/javascript">
        Lz.swfEmbed(<xsl:value-of select="$swf-embed-params"/>);
      </script>
<?ignore
      <script language="JavaScript" type="text/javascript">
        Lz.dhtmlEmbed(<xsl:value-of select="$dhtml-embed-params"/>);
      </script>
?>

    </div>
  </xsl:template>
  
  <xsl:template match="processing-instruction('lzx-edit')">
    <xsl:param name="href">
      <xsl:text>../../laszlo-explorer/editor.jsp?src=</xsl:text>
      <xsl:value-of select="$localdir"/>
      <xsl:text>developers/</xsl:text> <!-- TODO: BUG LPP-4683 
                                          This should not be hardcoded to developers. What about 
                                          programs that are in contributors or deployers? This needs to 
                                          be parameterized per-book [bshine 2007.09.07] -->
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
<p class="copyright">Copyright &#xA9; 2002-2007 <a target="_top"
href="http://www.laszlosystems.com/">Laszlo Systems, Inc.</a>
All Rights Reserved. Unauthorized use, duplication or
distribution is strictly prohibited. This is the proprietary
information of Laszlo Systems, Inc. Use is subject to license terms.</p>
<!-- * H_LZ_COPYRIGHT_END ************************************************* -->
  </xsl:template>
  
  <!-- Customization of table in docbook-xsl-1.71.1/html/synop.xsl -->
  <!-- Adds support for JavaScript and LZX. -->
  <!-- import synop-javascript.xsl & synop-lzx.xsl to use  -->
<xsl:variable name="default-classsynopsis-language">javascript</xsl:variable>

<xsl:template match="classsynopsis
                     |fieldsynopsis
                     |methodsynopsis
                     |constructorsynopsis
                     |destructorsynopsis">
  <xsl:param name="language">
    <xsl:choose>
      <xsl:when test="@language and not(@language='')">
        <xsl:value-of select="@language"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:message><xsl:value-of select="concat('defaulting synopsis language for ', name(.), ' to: ', $default-classsynopsis-language)"/></xsl:message>
        <xsl:value-of select="$default-classsynopsis-language"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:param>
  <xsl:choose>
    <xsl:when test="$language='javascript' or $language='JavaScript'">
      <xsl:apply-templates select="." mode="javascript"/>
    </xsl:when>
    <xsl:when test="$language='lzx' or $language='LZX'">
      <xsl:apply-templates select="." mode="lzx"/>
    </xsl:when>
    <xsl:otherwise>
      <xsl:apply-imports />
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

</xsl:stylesheet>
