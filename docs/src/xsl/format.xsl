<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- This is used to format the reference -->

<!DOCTYPE xsl:stylsheet [
<!ENTITY cr "<xsl:text>&#10;</xsl:text>">
]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common"
                xmlns:xalanredirect="org.apache.xalan.xslt.extensions.Redirect"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:lzxdoc="http://laszlosystems.com/lzx/docs"
                xmlns:xalan="http://xml.apache.org/xalan"
                xmlns:my-ext="ext1"
                xmlns:d="docbook"
                exclude-result-prefixes="xhtml lzxdoc dguide d"
                extension-element-prefixes="my-ext xalanredirect"
                version="1.0">

  <xsl:import href="xref.xsl"/>

  <xsl:output method="html"
              indent="yes"
              omit-xml-declaration="yes"/>

  <!-- FIXME: the following attributes to xsl:output are appropriate
       for the generated html files, but they also cause an incorrect
       DOCTYPE to be placed in the xalan:redirect files -->
  <!--doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
       doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/-->
  
  <!-- Unique id for this document -->
  <xsl:param name="docid"><xsl:value-of select="/html/@id"/><xsl:value-of select="/xhtml:html/@id"/></xsl:param>
  <!-- Relative address of embedded LZX files -->
  <xsl:param name="lzxdir" select="'build/'"/>
  <!-- Address of the generated files relative to servlet -->
  <xsl:param name="localdir" select="'tutorials/'"/>
  <xsl:param name="doc-includes" select="concat($lpsdir, 'docs/includes')"/>
  <xsl:param name="bodyClass"/>
  <xsl:param name="requestType" select="'js'"/>

  <xsl:param name="make-toc"/>
  <xsl:param name="make-examples-index" select="$make-toc"/>
  <!-- Show todos if true -->
  <xsl:param name="show.comments" select="0"/>
  <!-- Show fixmes if true -->
  <xsl:param name="show.fixmes" select="0"/>

  <!-- this breaks the new ant 1.6.5 build stuff; it seems to want to use 
    com.ibm.bsf BSF Manager, which it can't find. -bshine 6.22.06 
  
  <xalan:component prefix="my-ext" functions="lower getCanvasAttribute">
    <xalan:script lang="javascript"><![CDATA[
      function lower(s) {
        return s.toLowerCase();
      }
      function getCanvasAttribute(s, aname, defaultValue) {
        var i = s.indexOf('>');
        if (i > 0) s = s.substring(0, i);
        var m = s.match(new RegExp(aname + '=[\'"]([^\'"]*)[\'"]', 'gm'));
        if (m) {
          return m[0];
        }
        return defaultValue;
      }
    ]]></xalan:script>
  </xalan:component>
    --> 
  
  <!-- Strip the namespace from XHTML elements -->
  <xsl:template match="xhtml:*">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates select="@*|node()"/>
    </xsl:element>
  </xsl:template>
  
  <!-- Copy everything else unchanged -->
  <xsl:template match="/|@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
  
  <!-- remove docbook elements -->
  <xsl:template match="d:*"/>
  
  <!--
    Special processing for the root element and the body of the
    document
  -->

  <!-- remove the <html id> -->
  <xsl:template match="/xhtml:html">
    <html>
      <xsl:apply-templates select="@*[name() != 'id']"/>
      <xsl:apply-templates/>
    </html>
  </xsl:template>

  <!-- Add a link to the embed library, and to the stylesheet if
       there's not one already -->
  <xsl:template match="/xhtml:html/xhtml:head">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates select="@*"/>
      <script type="text/javascript" language="JavaScript" src="{$lpsdir}lps/includes/embed-compressed.js"/>&cr;
      <script type="text/javascript" language="JavaScript" src="{$lpsdir}docs/includes/docs.js"/>&cr;
      <xsl:if test="not(link[@rel='STYLESHEET']) and not(xhtml:link[@rel='STYLESHEET'])">
        <link rel="STYLESHEET" type="text/css" href="{$lpsdir}docs/includes/styles.css"/>
      </xsl:if>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  
  <!-- add the body class and copyright to the body -->
  <xsl:template match="xhtml:body">
    <body>
      <xsl:if test="$bodyClass">
        <xsl:attribute name="class">
          <xsl:value-of select="$bodyClass"/>
        </xsl:attribute>
      </xsl:if>
      
      <xsl:apply-templates select="@*|node()"/>
      
      <br clear="none"/>
<!-- * H_LZ_COPYRIGHT_BEGIN *********************************************** -->
<p class="copyright">Copyright &#xA9; 2002-2007 <a target="_top"
href="http://www.laszlosystems.com/">Laszlo Systems, Inc.</a>
All Rights Reserved. Unauthorized use, duplication or
distribution is strictly prohibited. This is the proprietary
information of Laszlo Systems, Inc. Use is subject to license terms.</p>
<!-- * H_LZ_COPYRIGHT_END ************************************************* -->
    </body>
  </xsl:template>
  
  <!--
    Table of Contents
  -->
  <xsl:template match="xhtml:h1[$make-toc]">
    <xsl:copy-of select="."/>
    <xsl:if test="//xhtml:h2">
      <div class="chaptertoc">
        <xsl:call-template name="toc">
          <xsl:with-param name="cn" select="."/>
          <xsl:with-param name="omit-name" select="true()"/>
        </xsl:call-template>
      </div>
      <xsl:if test="$make-examples-index and $make-examples-index!='false'">
        <xsl:call-template name="examples-index"/>
      </xsl:if>
      <br class="endchaptertoc"/>
    </xsl:if>
  </xsl:template>
  
  <xsl:template name="toc">
    <!-- Current Node -->
    <xsl:param name="cn"/>
    <!-- Header Number -->
    <xsl:param name="hn" select="1"/>
    <xsl:param name="omit-name" select="false"/>
    
    <xsl:param name="h1name" select="concat('h', $hn)"/>
    <xsl:param name="h2name" select="concat('h', $hn+1)"/>
    <xsl:param name="following-h1" select="$cn/following::xhtml:*[local-name()=$h1name]"/>
    <xsl:param name="children" select="$cn/following::xhtml:*[local-name()=$h2name and generate-id(./following::xhtml:*[local-name()=$h1name]) = generate-id($following-h1)]"/>
    
    <xsl:if test="not($omit-name)">
      <xsl:choose>
        <xsl:when test="xhtml:a/@name">
          <a href="#{xhtml:a/@name}">
            <xsl:apply-templates mode="index-entry"
                                 select="$cn/*|$cn/node()|$cn/text()"/>
          </a>
        </xsl:when>
        <xsl:otherwise>
          <a href="#{generate-id(.)}">
            <xsl:apply-templates mode="index-entry"
                                 select="$cn/*|$cn/node()|$cn/text()"/>
          </a>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
    
    <xsl:if test="count($children) != 0">
      <ol>
        <xsl:if test="starts-with(string($children[1]), '0.') or
                starts-with(string($children[1]), 'Overview')">
          <xsl:attribute name="start">
            <xsl:text>0</xsl:text>
          </xsl:attribute>
        </xsl:if>
        <xsl:for-each select="$children">
          <li>
            <xsl:call-template name="toc">
              <xsl:with-param name="cn" select="."/>
              <xsl:with-param name="hn" select="$hn+1"/>
            </xsl:call-template>
          </li>
        </xsl:for-each>
      </ol>
    </xsl:if>
  </xsl:template>
  
  <xsl:template mode="index-entry" match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates mode="index-entry"
                           select="@*|node()"/>
    </xsl:copy>
  </xsl:template>      
  
  <xsl:template mode="index-entry" match="xhtml:a">
    <xsl:apply-templates mode="index-entry"
                         select="node()"/>
  </xsl:template>    
  
  <xsl:template mode="hnumber" match="*">
    <xsl:param name="offset">
      <xsl:choose>
        <xsl:when test="starts-with(string(//xhtml:h2[1]//text()), 'Overview')">
          0
        </xsl:when>
        <xsl:otherwise>1</xsl:otherwise>
      </xsl:choose>
    </xsl:param>
    <xsl:value-of select="$offset+count(preceding::xhtml:h2[generate-id(current()/preceding::xhtml:h1[1])=generate-id(preceding::xhtml:h1[1])])"/>
  </xsl:template>
  
  <xsl:template match="xhtml:h2|xhtml:h3|xhtml:h4|xhtml:h5|xhtml:h6">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates select="@*"/>
      <xsl:if test="$make-toc">
        <xsl:if test="not(xhtml:a/@name)">
          <a name="{generate-id(.)}"/>
        </xsl:if>
        <xsl:if test="local-name()='h2'">
          <xsl:apply-templates mode="hnumber" select="."/>
          <xsl:text>. </xsl:text>
        </xsl:if>
        <xsl:if test="local-name()='h3'">
          <xsl:apply-templates mode="hnumber" select="preceding::xhtml:h2[1]"/>
          <xsl:text>.</xsl:text>
          <xsl:value-of select="1+count(preceding::xhtml:h3[generate-id(current()/preceding::xhtml:h2[1])=generate-id(preceding::xhtml:h2[1])])"/>
          <xsl:text> </xsl:text>
        </xsl:if>
      </xsl:if>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!--
    Examples Index
  -->

  <xsl:template name="examples-index">
    <xsl:param name="examples" select="//xhtml:example"/>
    <xsl:if test="$examples">
      <div class="examples-index">
        <h2>
          <xsl:text>Example</xsl:text>
          <xsl:if test="count($examples) > 1">s</xsl:if>
          <xsl:text>:</xsl:text>
        </h2>
        <ol>
          <xsl:for-each select="$examples">
            <li>
              <a href="#{generate-id(.)}">
                <xsl:apply-templates mode="title" select="."/>
              </a>
            </li>
          </xsl:for-each>
        </ol>
      </div>
    </xsl:if>
  </xsl:template>
  
  
  <!-- Process links -->
  
  <xsl:template match="xhtml:a[starts-with(@href, '${')]">
    <xsl:param name="href">
      <xsl:call-template name="expand-href"/>
    </xsl:param>
    <xsl:variable name="target">
      <xsl:call-template name="href-target"/>
    </xsl:variable>
    <a href="{$href}">
      <xsl:if test="$target and not(@target)">
        <xsl:attribute name="target">
          <xsl:value-of select="$target"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:for-each select="@*">
        <xsl:if test="name() != 'href'">
          <xsl:apply-templates select="."/>
        </xsl:if>
      </xsl:for-each>
      <xsl:apply-templates/>
    </a>
  </xsl:template>

  <!--
    clean up HTML to prevent jtidy warnings
  -->

  <!-- Tables require a summary -->
  <xsl:template match="xhtml:table[not(@summary)]">
    <table>
      <xsl:attribute name="summary"/>
      <xsl:apply-templates select="@*|*|text()|node()"/>
    </table>
  </xsl:template>
  
  <!-- Empty paragraphs are not permitted -->
  <xsl:template match="xhtml:p[count(*|text())=0]"/>
  

  <!--
    text element classes
  -->
  
  <xsl:param name="current-classname" select="string(//lzxdoc:classname)"/>
  <xsl:param name="current-tagname" select="string(//lzxdoc:tagname)"/>
  
  <xsl:template mode="inner-text" match="xhtml:classname">
    <code class="{local-name()}"><xsl:value-of select="text()"/></code>
  </xsl:template>
  
  <xsl:template mode="inner-text" match="xhtml:tagname">
    <code class="{local-name()}">&lt;<xsl:value-of select="text()"/>&gt;</code>
  </xsl:template>
  
  <!-- Always link the first classname, unless it's to this page -->
  <xsl:template match="xhtml:classname">
    <xsl:param name="name" select="string()"/>
    <xsl:param name="link" select="@link='true'
               or (not(@link!='true')
               and $name!=$current-classname
               and not(preceding::xhtml:classname[string()=$name]))"/>
    <xsl:variable name="href">
      <xsl:if test="$link">
          <xsl:call-template name="find-target">
            <xsl:with-param name="prefix">class-</xsl:with-param>
          </xsl:call-template>
      </xsl:if>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$href!=''">
        <a href="{$href}">
          <xsl:apply-templates mode="inner-text" select="."/>
        </a>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates mode="inner-text" select="."/>
        <xsl:if test="$link and $show.fixmes!='0'">
          <span class="fixme">[unknown class]</span>&cr;
          <xsl:comment>unknown class: <xsl:value-of select="string()"/></xsl:comment>&cr;
        </xsl:if>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- Always link the first tagname, unless it's to this page -->
  <xsl:template match="xhtml:tagname">
    <xsl:param name="name" select="string()"/>
    <xsl:param name="link" select="@link='true'
               or (not(@link!='true')
               and $name!=$current-tagname
               and not(preceding::xhtml:tagname[string()=$name]))"/>
    <xsl:variable name="href">
      <xsl:if test="$link">
          <xsl:call-template name="find-target">
            <xsl:with-param name="prefix">tag-</xsl:with-param>
          </xsl:call-template>
      </xsl:if>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$href!=''">
        <a href="{$href}">
          <xsl:apply-templates mode="inner-text" select="."/>
        </a>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates mode="inner-text" select="."/>
        <xsl:if test="$link and $show.fixmes!='0'">
          <span class="fixme">[unknown tag]</span>&cr;
          <xsl:comment>unknown tag: <xsl:value-of select="string()"/>&#10;</xsl:comment>&cr;
        </xsl:if>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="xhtml:api|xhtml:varname">
    <code class="{local-name()}"><xsl:value-of select="text()"/></code>
  </xsl:template>
  
  <xsl:template match="xhtml:attribute|xhtml:event|xhtml:field|xhtml:method">
    <code class="{local-name()}">
      <xsl:if test="@api|@classname|@tagname">
        <xsl:value-of select="@api"/>
        <xsl:value-of select="@classname"/>
        <xsl:value-of select="@tagname"/>
        <xsl:text>.</xsl:text>
        <!--TBD: see if it's safe to remove this-->
      </xsl:if>
      <xsl:value-of select="text()"/>
    </code>
  </xsl:template>
  
  <xsl:template match="xhtml:param">
    <code class="param"><xsl:value-of select="text()"/></code>
  </xsl:template>
  
  <!--
    Admonitions
  -->
  
  <xsl:template match="xhtml:note">
    <p class="note">
      <b>Note: </b>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <xsl:template match="xhtml:warning">
    <p class="warning">
      <b>Warning: </b>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <!-- Fixmes -->
  
  <xsl:template match="xhtml:p/xhtml:fixme">
    <xsl:if test="$show.fixmes != 0">
      <span class="fixme">
        <xsl:apply-templates/>
      </span>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="xhtml:fixme">
    <xsl:if test="$show.fixmes != 0">
      <p class="fixme">
        <b>Fixme: </b>
        <xsl:apply-templates/>
      </p>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="xhtml:p/xhtml:todo">
    <xsl:if test="$show.comments != 0">
    <span class="todo">
      <xsl:text>TODO: </xsl:text>
      <xsl:apply-templates/>
    </span>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="xhtml:todo">
    <xsl:if test="$show.comments != 0">
    <p class="todo">
      <b>TODO: </b>
      <xsl:apply-templates/>
    </p>
    </xsl:if>
  </xsl:template>

  <!--
    Inline examples
  -->
  
  <xsl:template mode="title" match="xhtml:example">
    <xsl:choose>
      <xsl:when test="@title">
        <xsl:value-of select="@title"/>
      </xsl:when>
      <xsl:when test="@filename">
        <xsl:text>File </xsl:text>
        <code>"<xsl:value-of select="@filename"/>"</code>
      </xsl:when>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="xhtml:example">
    <xsl:param name="fname">
      <xsl:choose>
        <xsl:when test="@extract='false'"/>
        <xsl:when test="@filename">
          <xsl:value-of select="@filename"/>
        </xsl:when>
        <xsl:when test="@executable='false'"/>
        <xsl:when test="@id">
          <xsl:value-of select="concat(@id, '.lzx')"/>
        </xsl:when>
        <xsl:when test="$docid and $docid != ''"><xsl:value-of select="$docid"/>-$<xsl:value-of select="1+count(preceding::xhtml:example)"/>.lzx</xsl:when>
        <xsl:otherwise>
          <xsl:message terminate="yes">The root element of this document requires an id attribute.</xsl:message>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:param>
    
    <xsl:param name="executable" select="(not(@executable) or @executable='true') and (not(@extract) or @extract='true')"/>
    
    <xsl:param name="src" select="substring-after($lzxdir, $lpsdir)"/>
    
    <xsl:param name="title">
      <xsl:apply-templates mode="title" select="."/>
    </xsl:param>
    
    <xsl:param name="text">
      <xsl:if test="@class='fragment'">
        <xsl:text>&lt;canvas&gt;</xsl:text>
      </xsl:if>
      <xsl:for-each select=".//text()">
        <xsl:value-of select="string(.)"/>
      </xsl:for-each>
      <xsl:if test="@class='fragment'">
        <xsl:text>&lt;/canvas&gt;</xsl:text>
      </xsl:if>
    </xsl:param>
    
    <div class="liveExample">
      <a name="{generate-id(.)}"/>
      <xsl:if test="$title!=''">
        <div class="exampleTableTitle">
          <xsl:text>Example </xsl:text>
          <xsl:value-of select="1+count(preceding::xhtml:example[@title or @filename])"/>
          <xsl:text>. </xsl:text>
          <xsl:value-of select="$title"/>
        </div>
      </xsl:if>
      <xsl:if test="$executable">
        <programlisting role="lzx-embednew">
          <filename><xsl:value-of select="$fname"/></filename>
          <parameter><xsl:value-of select="@query-parameters"/></parameter>
          <code><xsl:value-of select="$text"/></code>
        </programlisting>
      </xsl:if>
      <div style="background-color: #c1c8da">
        <pre class="code">
          <xsl:apply-templates select="*|node()|comment()|text()"/>
        </pre>
      </div>
      <xsl:if test="$executable">
        <div class="exampleTableEdit">
          <a target="lzview" href="{$lpsdir}laszlo-explorer/editor.jsp?src={$src}{$fname}">
            <img src="{$doc-includes}/d_t_editbutton.gif" width="42" height="18" alt="" border="0"/>
          </a>
        </div>
      </xsl:if>
    </div>
    
    <xsl:if test="$fname!=''">
      <xalanredirect:write file="{$fname}.in">
        <xsl:value-of select="$text"/>
      </xalanredirect:write>
    </xsl:if>
  </xsl:template>

  <!--
  Specific to the reference pages
  -->

  <xsl:template match="lzxdoc:reference">
    <div class="head">
      <div class="left">
        <xsl:choose>
          <xsl:when test="lzxdoc:tagname">
            <h1>&lt;<xsl:value-of select="lzxdoc:tagname/text()"/>&gt;</h1>
          </xsl:when>
          <xsl:otherwise>
            <h1><xsl:value-of select="lzxdoc:classname/text()"/></h1>
          </xsl:otherwise>
        </xsl:choose>
        <p class="summary">
          <xsl:apply-templates select="lzxdoc:summary/text()|summary/node()"/>
        </p>
      </div>
      <div class="right">
        <xsl:if test="lzxdoc:classname and lzxdoc:tagname">
          <div class="javascript">
            <b>JavaScript:</b>
            <xsl:text> </xsl:text>
            <xsl:value-of select="lzxdoc:classname/text()"/>
          </div>
          <br class="sep"/>
        </xsl:if>
        <xsl:if test="lzxdoc:extends">
          <div>
            <i>Extends</i>
            <xsl:text> </xsl:text>
            <a href="{lzxdoc:extends/@href}"><xsl:value-of select="lzxdoc:extends/text()"/></a>
          </div>
        </xsl:if>
      </div>
    </div>

    <xsl:apply-templates select="lzxdoc:description/*"/>
    <xsl:if test="$show.fixmes != 0 and
            (lzxdoc:tag/lzxdoc:description/* or
            lzxdoc:api/lzxdoc:description/*)">
      <div class="fixme">
        <xsl:if test="lzxdoc:tag/lzxdoc:description/*">
          <p>The following text is taken from the LZX or schema
          description.  John needs to decide whether to incorporate it
          into the above description, to display this description as
          well within a clearly marked area, or simply to omit to from
          the reference pages.</p>
        </xsl:if>
        <xsl:apply-templates select="lzxdoc:tag/lzxdoc:description/*"/>
        <xsl:if test="lzxdoc:api/lzxdoc:description/*">
          <p>The following text is taken from the JavaScript
          documentation.  John needs to decide whether to incorporate
          it into the above description, to display this description
          as well within a clearly marked area, or simply to omit it
          from the reference pages.</p>
        </xsl:if>
        <xsl:apply-templates select="lzxdoc:api/lzxdoc:description/*"/>
      </div>
    </xsl:if>
  </xsl:template>

  <xsl:template match="lzxdoc:*"/>

  <xsl:template match="xhtml:seealso">
    <b>See Also:</b><br/>
    <ul>
      <xsl:for-each select="*">
        <li>
          <xsl:if test="@label">
            <xsl:value-of select="@label"/>:
          </xsl:if>
          <xsl:apply-templates select="."/>
        </li>
      </xsl:for-each>
    </ul>
  </xsl:template>

  <xsl:template match="xhtml:seealso/xhtml:attributes">
    The
    <xsl:call-template name="do-tags">
      <xsl:with-param name="tags" select="normalize-space(string())"/>
      <xsl:with-param name="class" select="'attribute'"/>
    </xsl:call-template>
    attributes.
  </xsl:template>
  
  <xsl:template match="xhtml:seealso/xhtml:classes">
      <xsl:call-template name="do-tags">
        <xsl:with-param name="tags" select="normalize-space(string())"/>
        <xsl:with-param name="class" select="'classname'"/>
      </xsl:call-template>
  </xsl:template>
  
  <xsl:template match="xhtml:seealso/xhtml:tags">
    <xsl:call-template name="do-tags">
      <xsl:with-param name="tags" select="normalize-space(string())"/>
      <xsl:with-param name="class" select="'tagname'"/>
      </xsl:call-template>
  </xsl:template>
  
  <xsl:template match="xhtml:seealso/xhtml:dguide">
    <xsl:variable name="href" select="concat('${dguide}', @id, '.html')"/>
    <xsl:variable name="chapter-ref">
        <xhtml:a href="{$href}"><xsl:value-of select="@title"/></xhtml:a>
    </xsl:variable>
    The
    <xsl:apply-templates select="exslt:node-set($chapter-ref)"/>
    chapter of the Guide
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template match="xhtml:seealso/xhtml:component-design">
    <xsl:variable name="href" select="concat('${component-design}', @id, '.html')"/>
    <xsl:variable name="chapter-ref">
        <xhtml:a href="{$href}"><xsl:value-of select="@title"/></xhtml:a>
    </xsl:variable>
    
            <p>For details on how this component is constructed see 
            <a href="${component-design}/index.html"> The Component Design Guide</a>.
            </p>
  </xsl:template>
  
  <xsl:template name="do-tags">
    <xsl:param name="tags"/>
    <xsl:param name="class"/>
    <xsl:param name="count" select="1"/>
    <xsl:param name="prefix" select="''"/>
    <xsl:param name="final-prefix" select="''"/>
    <xsl:variable name="tag" select="normalize-space(substring-before(concat($tags, ' '), ' '))"/>
    <xsl:variable name="more" select="normalize-space(substring-after($tags, ' '))"/>
    <xsl:variable name="tagnode">
      <xsl:element name="{$class}"
                   namespace="http://www.w3.org/1999/xhtml">
        <xsl:value-of select="$tag"/>
      </xsl:element>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$count=1"/>
      <xsl:when test="$more">
        <xsl:value-of select="$prefix"/>
      </xsl:when>
      <xsl:otherwise><xsl:value-of select="$final-prefix"/></xsl:otherwise>
    </xsl:choose>
    <xsl:apply-templates select="exslt:node-set($tagnode)"/>
    <xsl:if test="$more">
      <xsl:call-template name="do-tags">
        <xsl:with-param name="tags" select="$more"/>
        <xsl:with-param name="class" select="$class"/>
        <xsl:with-param name="prefix" select="', '"/>
        <xsl:with-param name="final-prefix">
          <xsl:if test="$count&gt;2"><xsl:text>,</xsl:text></xsl:if>
          <xsl:text> and </xsl:text>
        </xsl:with-param>
        <xsl:with-param name="count" select="$count+1"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>
  
</xsl:stylesheet>
