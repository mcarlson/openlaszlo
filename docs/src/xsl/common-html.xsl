<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

<!ENTITY nbsp  "&#160;">

]>
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
  <xsl:param name="show.fixmes" select="1"/>

  <xsl:param name="textdata.default.encoding"/>
    
  <xsl:param name="show.examples.debuginfo" select="false()" />
  
  <xsl:template name="base.book.name">
    <xsl:choose>
      <xsl:when test="contains(ancestor::part/@id, 'developers.tutorials')">developers/tutorials</xsl:when>
      <xsl:when test="contains(ancestor::part/@id, '.ref')">reference</xsl:when>
      <xsl:when test="contains(ancestor::part/@id, 'deployers')">deployers</xsl:when>
      <xsl:when test="contains(ancestor::part/@id, 'contributors')">contributors</xsl:when>
      <xsl:when test="contains(ancestor::part/@id, 'contribref')">contribref</xsl:when>
      <xsl:when test="contains(ancestor::part/@id, 'users')">users</xsl:when>
      <xsl:when test="contains(ancestor::part/@id, 'developers')">developers</xsl:when> 
      <xsl:when test="contains(ancestor::preface/@id, 'developers')">developers</xsl:when> 
      <xsl:otherwise>unknownbook<!-- This is an error -->
        <xsl:message>ERROR: could not identify book from part/@id, for <xsl:value-of select="ancestor::part/@id"/></xsl:message>
      </xsl:otherwise> 
    </xsl:choose>    
  </xsl:template>


  <xsl:variable name="root.relative">
    <xsl:call-template name="dbhtml-dir"/>
  </xsl:variable>
  
  <xsl:variable name="depth.from.lpshome">
    <xsl:value-of select="number(2)"/>  
  </xsl:variable>
  
  <xsl:template name="relative.path.to.lpshome">      
      <xsl:choose>
          <xsl:when test="contains(ancestor::part/@id, 'developers.tutorials')">../../../</xsl:when>
          <xsl:otherwise>../../</xsl:otherwise>
      </xsl:choose>
  </xsl:template>
  
  <xsl:variable name="relative.path.to.lpshome">
    <xsl:call-template name="copy-string">
      <xsl:with-param name="string" select="'../'"/>
      <xsl:with-param name="count" select="$depth.from.lpshome"/>
    </xsl:call-template>
  </xsl:variable>
  
  <xsl:template name="local.lps.path">
    <xsl:variable name="depth">
      <xsl:choose>
        <xsl:when test="contains(ancestor-or-self::part/@id, 'developers.tutorials')">
          <xsl:value-of select="number(3)"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="number(2)"/>
        </xsl:otherwise>
      </xsl:choose>    
    </xsl:variable>
    <xsl:value-of select="$root.relative" />
    <xsl:call-template name="copy-string">
      <xsl:with-param name="string" select="'../'"/>
      <xsl:with-param name="count" select="$depth"/>
    </xsl:call-template>
  </xsl:template>
  
  <xsl:template name="user.head.content">
    <xsl:variable name="rootpath">
      <xsl:call-template name="local.lps.path"/>
      <xsl:text>docs/</xsl:text>
    </xsl:variable>
    <link rel="stylesheet" href="{$rootpath}includes/docbook.css" type="text/css"/>
    <link rel="stylesheet" href="{$rootpath}includes/lzx-pretty-print.css" type="text/css"/>
    <script type="text/javascript" language="JavaScript" src="{$rootpath}{$root.relative.lps.includes}embed-compressed.js"/>
    <script type="text/javascript" language="JavaScript" src="{$rootpath}includes/docs.js"/>
<?ignore
    <script type="text/javascript" language="JavaScript"><xsl:text>lz.embed.lfc('</xsl:text><xsl:value-of select="$rootpath"/><xsl:value-of select="$root.relative.lps.includes"/><xsl:text>lfc/LFCdhtml.js', '</xsl:text><xsl:value-of select="$rootpath"/><xsl:text>../');</xsl:text></script>
?>
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
  
  <!-- make sure parameters are quoted strings -->
  <xsl:template name="quote-canvas-parameter">
    <xsl:param name="text"/>
    <xsl:variable name="single-quote">'</xsl:variable>
    <xsl:choose>
      <xsl:when test="contains($text, $single-quote)">
        <xsl:value-of select="$text"/>
      </xsl:when>
      <xsl:when test="contains($text, ',')">
        <xsl:call-template name="quote-canvas-parameter">
          <xsl:with-param name="text" select="substring-before($text,',')"/>
        </xsl:call-template>,
        <xsl:call-template name="quote-canvas-parameter">
          <xsl:with-param name="text" select="substring-after($text,',')"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:when test="contains($text, ': ')">
        <xsl:value-of select="substring-before($text,': ')"/>
        : '<xsl:value-of select="substring-after($text,': ')"/>'
      </xsl:when>
      <xsl:when test="contains($text, ':')">
        <xsl:value-of select="substring-before($text,':')"/>
        :'<xsl:value-of select="substring-after($text,':')"/>'
      </xsl:when>
      <xsl:otherwise>
        <xsl:message><xsl:value-of select="concat('Unknown parameter syntax in quote-canvas-paramter: ', $text)"/></xsl:message>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
    <xsl:template match="programlisting[@language='lzx' and textobject/textdata/@fileref]">
    
    <!-- extract necessary information from context -->
    <xsl:variable name="fname" select="textobject/textdata/@fileref"/>
    <xsl:variable name="query-parameters" select="parameter[@role='query']"/>

    <!--If no canvas parameters are specified, set height to 400px.
      This fixes     LPP-5207 change height of example code window from 200 to 400 pixels
      [bshine 12.16.2007]
    -->         
    <xsl:variable name="canvas-parameters">
      <!-- The problem here! is that! if we do select="parameter[@role='canvas']" and there is
        more than one parameter with role='canvas' then the value of the $canvas-parameters 
        variable is *only* the text contents of the *first* result of the xpath query. 
        We want to have a comma-separated list of the canvas parameters! The
        bug LPP-5207 results from almost always discarding the canvas height, which is 
        almost always the second canvas parameter listed. To demonstrate that this is
        indeed the problem, in dbkpreprocessexamples.xsl switch the order of emitting
        the canvas parameters. Notice that we now have nice canvas heights, but bad
        canvas widths. 
        The solution! Iterate over the result node set! -->
      <xsl:for-each select="parameter[@role='canvas']">
        <!-- leading comma for each param -->
        , <xsl:call-template name="quote-canvas-parameter">
          <xsl:with-param name="text" select="."/>
          </xsl:call-template>
      </xsl:for-each>
     </xsl:variable>
      
     
    <!-- format live example -->
    <xsl:variable name="live" select="ancestor::example[@role='live-example'] or ancestor::informalexample[@role='live-example']"/>
    <xsl:if test="$live">
      <div class="embedded-canvas">
        <xsl:variable name="query-param">
          <xsl:if test="$query-parameters">&amp;<xsl:value-of select="$query-parameters[1]/text()"></xsl:value-of></xsl:if>
        </xsl:variable>
        <xsl:variable name="canvas-id" select="generate-id(.)"/>
        <xsl:variable name="swf-embed-params">{url: '<xsl:value-of select="concat($fname, '?lzt=swf', $query-param)"/>', id: '<xsl:value-of select="concat($canvas-id,'SWF')"/>', history: false, cancelmousewheel: true <xsl:value-of select="$canvas-parameters"/>}</xsl:variable>
        <xsl:variable name="dhtml-embed-params">{url: '<xsl:value-of select="concat($fname, '?lzt=html&amp;lzr=dhtml', $query-param)"/>', id: '<xsl:value-of select="concat($canvas-id,'DHTML')"/>', cancelkeyboardcontrol: true <xsl:value-of select="$canvas-parameters"/>}</xsl:variable>
        <!-- To test examples in DHTML, uncomment the second script block below
             and the call to lz.embed.lfc() above.
             If you don't want to see the SWF version as well, comment out the 
             first script block. -->
        <script language="JavaScript" type="text/javascript">
          lz.embed.swf(<xsl:value-of select="$swf-embed-params"/>);
        </script>
<?ignore
        <script language="JavaScript" type="text/javascript">
          lz.embed.dhtml(<xsl:value-of select="$dhtml-embed-params"/>);
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
        <xsl:call-template name="relative.path.to.lpshome" />
        <xsl:text>laszlo-explorer/editor.jsp?src=docs/</xsl:text>         
        <xsl:call-template name="base.book.name"/>
        <xsl:text>/</xsl:text>
        <xsl:value-of select="$fname"/>
      </xsl:variable>
      <xsl:variable name="editbuttonimg">
        <xsl:call-template name="relative.path.to.lpshome"/>
        <xsl:text>docs/includes/d_t_editbutton.gif</xsl:text>
      </xsl:variable>
      <xsl:text>&#x0a;</xsl:text>
      <div class="edit-button">
        <a href="{$edit-href}" target="_blank">
          <img src="{$editbuttonimg}" border="0" alt="edit" />           
        </a>
      </div>
      <xsl:text>&#x0a;</xsl:text>
      <xsl:if test="$show.examples.debuginfo">
        <pre>
          localdir: <xsl:value-of select="$localdir"/>
          basedir: <xsl:value-of select="$base.dir"/>
          fname: <xsl:value-of select="$fname"/>
          base.book.name: <xsl:call-template name="base.book.name"  />
          root.relative: <xsl:value-of select="$root.relative"/>
          relative.path.to.lpshome: <xsl:call-template name="relative.path.to.lpshome"/>
        </pre> 
      </xsl:if>
    </xsl:if>
  </xsl:template>

  <xsl:template match="sgmltag[@role='Copyright']">
    <div class="lzx-copyright">
      <xsl:apply-imports/>
    </div>
  </xsl:template>
  
  <xsl:template match="important[@role='deprecated']">
    <div class="deprecated">
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
  
  <!-- Although this template is associated with role="lzx-embednew",
    it does not in fact seem to be the currently favored way of 
    setting up live examples. It seems, rather, that it was *once* new,
    and is no longer new, but rather, it is now old. Preferred to
    this structure is the template defined at line 201 of this file,
    with the first line 
    <xsl:template match="programlisting[@language='lzx' and textobject/textdata/@fileref]">
    
    An example of this favored usage can be found in, for instance, 
    docs/src/developers/tutorials/comp-intro.dbk : 
        <example role="live-example">
        <title>Components miscellany</title>
        <programlisting language="lzx">
        <textobject><textdata fileref="programs/comp-intro-$1.lzx"/></textobject> 
        </programlisting>
        </example>
        
    [bshine 12.16.2007]
    -->
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
          <xsl:with-param name="default" select="'100%'"/>
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
      <xsl:variable name="swf-embed-params">{url: '<xsl:value-of select="concat($lzxdir, $fname, '?lzt=swf', $query-param)"/>', id: '<xsl:value-of select="concat($canvas-id,'SWF')"/>', width: '<xsl:copy-of select="$canvas-width"/>', height: '<xsl:copy-of select="$canvas-height"/>', history: false}</xsl:variable>
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
      <xsl:call-template name="base.book.name" />
      <xsl:text>/</xsl:text>
      <xsl:value-of select="."/>
    </xsl:param>
    <xsl:text>&#x0a;</xsl:text>
    <div class="edit-button">
      <a href="{$href}" target="lzview"><img border="0" alt="" height="18" width="42" src="../../docs/includes/d_t_editbutton.gif"/></a>
    </div>
    <xsl:text>&#x0a;</xsl:text>
  </xsl:template>

  <xsl:template name="user.footer.content">

<!-- * H_LZ_COPYRIGHT_BEGIN *********************************************** -->
<p class="copyright">Copyright &#xA9; 2002-2008 <a target="_top"
href="http://www.laszlosystems.com/">Laszlo Systems, Inc.</a>
All Rights Reserved. Unauthorized use, duplication or
distribution is strictly prohibited. This is the proprietary
information of Laszlo Systems, Inc. Use is subject to license terms.</p>
<!-- * H_LZ_COPYRIGHT_END ************************************************* -->
  </xsl:template>
 <!-- copy of template from html/chunk-common.xsl (and overrides that one)  --> 
 <!-- adds user comment section to the end of each page                     -->
  <xsl:template name="footer.navigation">
    <xsl:param name="prev" select="/foo"/>
    <xsl:param name="next" select="/foo"/>
    <xsl:param name="nav.context"/>
    
    <xsl:variable name="home" select="/*[1]"/>
    <xsl:variable name="up" select="parent::*"/>
    
    <xsl:variable name="row1" select="count($prev) &gt; 0
      or count($up) &gt; 0
      or count($next) &gt; 0"/>
    
    <xsl:variable name="row2" select="($prev and $navig.showtitles != 0)
      or (generate-id($home) != generate-id(.)
      or $nav.context = 'toc')
      or ($chunk.tocs.and.lots != 0
      and $nav.context != 'toc')
      or ($next and $navig.showtitles != 0)"/>
    
    <xsl:if test="$suppress.navigation = '0' and $suppress.footer.navigation = '0'">
      <div class="navfooter">
        <xsl:if test="$footer.rule != 0">
          <hr/>
        </xsl:if>
        
        <xsl:if test="$row1 or $row2">
          <table width="100%" summary="Navigation footer">
            <xsl:if test="$row1">
              <tr>
                <td width="40%" align="left">
                  <xsl:if test="count($prev)>0">
                    <a accesskey="p">
                      <xsl:attribute name="href">
                        <xsl:call-template name="href.target">
                          <xsl:with-param name="object" select="$prev"/>
                        </xsl:call-template>
                      </xsl:attribute>
                      <xsl:call-template name="navig.content">
                        <xsl:with-param name="direction" select="'prev'"/>
                      </xsl:call-template>
                    </a>
                  </xsl:if>
                  <xsl:text>&#160;</xsl:text>
                </td>
                <td width="20%" align="center">
                  <xsl:choose>
                    <xsl:when test="count($up)>0">
                      <a accesskey="u">
                        <xsl:attribute name="href">
                          <xsl:call-template name="href.target">
                            <xsl:with-param name="object" select="$up"/>
                          </xsl:call-template>
                        </xsl:attribute>
                        <xsl:call-template name="navig.content">
                          <xsl:with-param name="direction" select="'up'"/>
                        </xsl:call-template>
                      </a>
                    </xsl:when>
                    <xsl:otherwise>&#160;</xsl:otherwise>
                  </xsl:choose>
                </td>
                <td width="40%" align="right">
                  <xsl:text>&#160;</xsl:text>
                  <xsl:if test="count($next)>0">
                    <a accesskey="n">
                      <xsl:attribute name="href">
                        <xsl:call-template name="href.target">
                          <xsl:with-param name="object" select="$next"/>
                        </xsl:call-template>
                      </xsl:attribute>
                      <xsl:call-template name="navig.content">
                        <xsl:with-param name="direction" select="'next'"/>
                      </xsl:call-template>
                    </a>
                  </xsl:if>
                </td>
              </tr>
            </xsl:if>
            
            <xsl:if test="$row2">
              <tr>
                <td width="40%" align="left" valign="top">
                  <xsl:if test="$navig.showtitles != 0">
                    <xsl:apply-templates select="$prev" mode="object.title.markup"/>
                  </xsl:if>
                  <xsl:text>&#160;</xsl:text>
                </td>
                <td width="20%" align="center">
                  <xsl:choose>
                    <xsl:when test="$home != . or $nav.context = 'toc'">
                      <a accesskey="h">
                        <xsl:attribute name="href">
                          <xsl:call-template name="href.target">
                            <xsl:with-param name="object" select="$home"/>
                          </xsl:call-template>
                        </xsl:attribute>
                        <xsl:call-template name="navig.content">
                          <xsl:with-param name="direction" select="'home'"/>
                        </xsl:call-template>
                      </a>
                      <xsl:if test="$chunk.tocs.and.lots != 0 and $nav.context != 'toc'">
                        <xsl:text>&#160;|&#160;</xsl:text>
                      </xsl:if>
                    </xsl:when>
                    <xsl:otherwise>&#160;</xsl:otherwise>
                  </xsl:choose>
                  
                  <xsl:if test="$chunk.tocs.and.lots != 0 and $nav.context != 'toc'">
                    <a accesskey="t">
                      <xsl:attribute name="href">
                        <xsl:apply-templates select="/*[1]"
                          mode="recursive-chunk-filename"/>
                        <xsl:text>-toc</xsl:text>
                        <xsl:value-of select="$html.ext"/>
                      </xsl:attribute>
                      <xsl:call-template name="gentext">
                        <xsl:with-param name="key" select="'nav-toc'"/>
                      </xsl:call-template>
                    </a>
                  </xsl:if>
                </td>
                <td width="40%" align="right" valign="top">
                  <xsl:text>&#160;</xsl:text>
                  <xsl:if test="$navig.showtitles != 0">
                    <xsl:apply-templates select="$next" mode="object.title.markup"/>
                  </xsl:if>
                </td>
              </tr>
            </xsl:if>
          </table>
        </xsl:if>
      </div>
    </xsl:if>
    <xsl:if test="$show.usercomments != 0">
      <hr />
      <script type="text/javascript" src="../includes/commentwidget.js"></script>
    </xsl:if>
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
