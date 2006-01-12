<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!--
Translate a Laszlo doc page to a docbook page:
- convert html to docbook
- extract live examples
-->

<!DOCTYPE xsl:stylsheet [
<!ENTITY cr "<xsl:text>&#10;</xsl:text>">
]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:dyn="http://exslt.org/dynamic"
                xmlns:exslt="http://exslt.org/common"
                xmlns:xalan="http://xml.apache.org/xalan"
                xmlns:xalanredirect="org.apache.xalan.xslt.extensions.Redirect"
                xmlns:my-ext="ext1"
                xmlns:d="docbook"
                xmlns:h="http://www.w3.org/1999/xhtml"
                extension-element-prefixes="my-ext xalanredirect"
                exclude-result-prefixes="d dyn exslt h my-ext xalan"
                version="1.0">
  
  <xsl:import href="html2dbk.xsl"/>
  <xsl:import href="xref.xsl"/>
  
  <xsl:output method="xml"
              omit-xml-declaration="yes"/>

  <!-- Unique id for this document -->
  <xsl:param name="docid"><xsl:value-of select="/h:html/@id"/></xsl:param>
  <!-- Relative address of embedded LZX files -->
  <xsl:param name="lzxdir" select="'programs/'"/>
  <!-- Request type for embedded applications -->
  <xsl:param name="requestType" select="'js'"/>
  <xsl:param name="show.fixmes" select="0"/>
  
  <!--
    programming elements
  -->
  
  <!-- xref.xsl calls this -->
  <xsl:template name="wrap-link">
    <xsl:param name="href"/>
    <xsl:param name="content"/>
    <ulink url="../reference/{$href}" type="reference">
      <xsl:copy-of select="$content"/>
    </ulink>
  </xsl:template>
  
  <xsl:template match="h:api">
    <interface>
      <xsl:apply-templates/>
    </interface>
  </xsl:template>

  <xsl:template match="h:attribute">
    <indexterm>
      <primary><xsl:value-of select="node()"/> attribute</primary>
    </indexterm>
    <xsl:call-template name="link-member">
      <xsl:with-param name="prefix" select="'attr-'"/>
      <xsl:with-param name="content">
        <sgmltag class="attribute">
          <xsl:apply-templates/>
        </sgmltag>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:template>

  <xsl:template mode="inner-text" match="h:classname">
    <classname>
      <xsl:apply-templates/>
    </classname>
  </xsl:template>
  
  <xsl:template match="h:classname">
    <xsl:param name="name" select="string()"/>
    <xsl:param name="link" select="@link='true'
               or (not(@link!='true')
               and not(preceding::h:classname[string()=$name]))"/>
    <xsl:variable name="href">
      <xsl:if test="$link">
          <xsl:call-template name="find-target">
            <xsl:with-param name="prefix">class-</xsl:with-param>
          </xsl:call-template>
      </xsl:if>
    </xsl:variable>
    <indexterm>
      <primary><xsl:value-of select="node()"/> class</primary>
    </indexterm>
    <xsl:choose>
      <xsl:when test="$href!=''">
        <ulink url="{$href}" type="reference">
          <xsl:apply-templates mode="inner-text" select="."/>
        </ulink>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates mode="inner-text" select="."/>
        <!-- TODO: warn.  Disabled because there's no way
        distinguish autolinks that are known not to work
        such as Array -->
        <!--xsl:if test="$link">
          <remark role="fixme">[unknown class]</remark>&cr;
          <xsl:comment>unknown class: <xsl:value-of select="string()"/></xsl:comment>&cr;
        </xsl:if-->
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="h:event">
    <indexterm>
      <primary><xsl:value-of select="node()"/> event</primary>
    </indexterm>
    <xsl:call-template name="link-member">
      <xsl:with-param name="prefix" select="'event-'"/>
      <xsl:with-param name="content">
        <literal>
          <xsl:apply-templates/>
        </literal>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:template>
  
  <xsl:template match="h:field">
    <structfield>
      <xsl:apply-templates/>
    </structfield>
  </xsl:template>
  
  <xsl:template match="h:method">
    <indexterm>
      <primary><literal><xsl:value-of select="node()"/>()</literal> method</primary>
    </indexterm>
    <xsl:call-template name="link-member">
      <xsl:with-param name="prefix" select="'method-'"/>
      <xsl:with-param name="content">
        <methodname>
          <xsl:apply-templates/>
          <xsl:text>()</xsl:text>
        </methodname>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:template>
  
  <xsl:template match="h:var|h:varname">
    <varname>
      <xsl:apply-templates/>
    </varname>
  </xsl:template>
  
  <xsl:template mode="inner-text" match="h:tagname">
    <sgmltag class="element">
      <xsl:text>&lt;</xsl:text>
      <xsl:apply-templates/>
      <xsl:text>&gt;</xsl:text>
    </sgmltag>
  </xsl:template>
  
  <xsl:template match="h:tagname">
    <xsl:param name="name" select="string()"/>
    <xsl:param name="link" select="@link='true'
               or (not(@link!='true')
               and not(preceding::h:tagname[string()=$name]))"/>
    <xsl:variable name="href">
      <xsl:if test="$link">
          <xsl:call-template name="find-target">
            <xsl:with-param name="prefix">tag-</xsl:with-param>
          </xsl:call-template>
      </xsl:if>
    </xsl:variable>
    <indexterm>
      <primary><xsl:value-of select="node()"/> tag</primary>
    </indexterm>
    <xsl:choose>
      <xsl:when test="$href!=''">
        <ulink url="{$href}" type="reference">
          <xsl:apply-templates mode="inner-text" select="."/>
        </ulink>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates mode="inner-text" select="."/>
        <xsl:if test="$link">
          <remark role="fixme">[unknown tag]</remark>&cr;
          <xsl:comment>unknown tag: <xsl:value-of select="string()"/></xsl:comment>&cr;
        </xsl:if>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!--
    links
  -->
  
  <xsl:template name="create-reference-link">
    <xsl:param name="href"/>
    <xsl:param name="reference.dir" select="$reference.dir"/>
    <xsl:choose>
      <xsl:when test="$href=''">
        <xsl:value-of select="$reference.dir"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="concat($reference.dir, 'index.html?', $href)"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- link with ${} -->
  <xsl:template match="h:a[@href and substring-after(@href, '${') != '']">
    <xsl:param name="href">
      <xsl:call-template name="expand-href"/>
    </xsl:param>
    <xsl:variable name="target">
      <xsl:call-template name="href-target"/>
    </xsl:variable>
    
    <ulink url="{$href}">
      <xsl:if test="$target">
        <xsl:attribute name="type">
          <xsl:value-of select="$target"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:apply-templates/>
    </ulink>
  </xsl:template>
  
  <!-- special link -->
  <xsl:template match="h:a[@onclick]">
    <ulink url="{@onclick}" type="onclick">
      <xsl:value-of select="node()"/>
    </ulink>
  </xsl:template>
  
  <xsl:template match="h:xref">
    <xref linkend="{@linkend}"/>
  </xsl:template>
  
  <!--
    block-level formatting
  -->
  <xsl:template mode="para" match="h:todo">
    <remark role="todo">
      <xsl:apply-templates mode="para" select="node()"/>
    </remark>
  </xsl:template>
  
  <xsl:template mode="para" match="h:fixme">
    <remark role="fixme">
      <xsl:apply-templates mode="para" select="node()"/>
    </remark>
  </xsl:template>
  
  <xsl:template mode="para" match="*|text()">
    <xsl:apply-templates select="."/>
  </xsl:template>
  
  
  <!--
    fixme and todo
  -->
  
  <xsl:template match="h:fixme/h:p|h:todo/h:p">
    <xsl:apply-templates mode="para" select="node()"/>
  </xsl:template>
  
  <xsl:template match="
                h:p/h:todo
                |h:li/h:todo
                |h:warning/h:todo">
    <remark role="todo">
      <xsl:apply-templates mode="para" select="node()"/>
    </remark>
  </xsl:template>

  <xsl:template match="
                h:p/h:fixme
                |h:li/h:fixme
                |h:warning/h:fixme
                ">
    <remark role="fixme">
      <xsl:apply-templates mode="para" select="node()"/>
    </remark>
  </xsl:template>
  
  <xsl:template match="h:fixme">
    <para role="fixme">
      <remark role="fixme">
        <emphasis role="para-label">FIXME: </emphasis>
        <xsl:apply-templates mode="para" select="node()"/>
      </remark>
    </para>
  </xsl:template>
  
  <xsl:template match="h:todo">
    <para role="todo">
      <remark role="todo">
        <emphasis role="para-label">TODO: </emphasis>
        <xsl:apply-templates mode="para" select="node()"/>
      </remark>
    </para>
  </xsl:template>
  
  <xsl:template match="h:note|h:warning|h:caution">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates mode="wrap" select="."/>
    </xsl:element>
  </xsl:template>
  
  <!-- can't show examples inside of fixmes -->
  <xsl:template match="h:fixme/h:example"/>
  
  <!--
    live examples
  -->
  
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
  
  <xsl:template match="h:example">
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
        <xsl:when test="$docid and $docid != ''"><xsl:value-of select="$docid"/>-$<xsl:value-of select="1+count(preceding::h:example)"/>.lzx</xsl:when>
        <xsl:otherwise>
          <xsl:message terminate="yes">The root element of this document requires an id attribute.</xsl:message>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:param>
    
    <xsl:param name="executable" select="(not(@executable) or @executable='true') and (not(@extract) or @extract='true')"/>
    
    <xsl:param name="exampleclass">
      <xsl:if test="@title">example</xsl:if>
      <xsl:if test="not(@title)">informalexample</xsl:if>
    </xsl:param>
    
    <xsl:param name="text">
      <xsl:if test="@class='fragment'">
        <xsl:text>&lt;canvas&gt;</xsl:text>
      </xsl:if>
      <!-- omit text inside of callouts -->
      <xsl:for-each select="text()|*[local-name()!='co']">
        <xsl:value-of select="string(.)"/>
      </xsl:for-each>
      <xsl:if test="@class='fragment'">
        <xsl:text>&lt;/canvas&gt;</xsl:text>
      </xsl:if>
    </xsl:param>
    
    <xsl:param name="query-parameters">
      <xsl:if test="@query-parameters">&amp;<xsl:value-of select="@query-parameters"></xsl:value-of></xsl:if>
    </xsl:param>
    
    <xsl:param name="js-embed-params">{url: '<xsl:value-of select="concat($lzxdir, $fname, '?lzt=swf', $query-parameters)"/>', width: <xsl:value-of select="my-ext:getCanvasAttribute(string($text), 'width', 500)"/>, height: <xsl:value-of select="my-ext:getCanvasAttribute(string($text), 'height', 400)"/>}</xsl:param>
    
    <xsl:element name="{$exampleclass}">
      <xsl:attribute name="role">live-example</xsl:attribute>
      <xsl:if test="@id">
        <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
      </xsl:if>
      <xsl:if test="@title">
        <title><xsl:value-of select="@title"/></title>
      </xsl:if>
      <xsl:if test="$executable">
        <xsl:processing-instruction name="lzx-embed">
          <xsl:choose>
            <xsl:when test="$requestType='js'">
              lzEmbed(<xsl:value-of select="$js-embed-params"/>);
            </xsl:when>
            <xsl:otherwise>
              if (lzShowInlineExamples()) {
                lzEmbed(<xsl:value-of select="$js-embed-params"/>);
              } else {
                document.write('&lt;button onclick="lzSetShowInlineExamples(true)"&gt;Show Examples&lt;/button&gt;');
              }
            </xsl:otherwise>
          </xsl:choose>
        </xsl:processing-instruction>
      </xsl:if>
      
      <programlisting>
        <xsl:apply-templates mode="programlisting" select="node()"/>
      </programlisting>
      <xsl:if test="$executable and not(@query-parameters)">
        <xsl:processing-instruction name="lzx-edit">
          <xsl:value-of select="concat($lzxdir, $fname)"/>
          <!--xsl:if test="@title">&amp;title=<xsl:value-of select="@title"/></xsl:if-->
        </xsl:processing-instruction>
      </xsl:if>
    </xsl:element>
    
    <xsl:if test="h:co">
      <calloutlist>
        <xsl:for-each select="h:co">
          <callout arearefs="{generate-id(.)}">
            <xsl:apply-templates mode="wrap"/>
          </callout>
        </xsl:for-each>
      </calloutlist>
    </xsl:if>
    
    <xsl:if test="$fname!=''">
      <xalanredirect:write file="{$fname}.in">
        <xsl:value-of select="$text"/>
      </xalanredirect:write>
    </xsl:if>
  </xsl:template>
  
  <xsl:template mode="programlisting" match="h:co">
    <co id="{generate-id(.)}"/>
  </xsl:template>
  
  <xsl:template mode="programlisting" match="node()">
    <xsl:apply-templates select="."/>
  </xsl:template>
  
</xsl:stylesheet>
