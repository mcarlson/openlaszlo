<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2006-2008, 2010 Laszlo Systems, Inc.  All Rights Reserved.        *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:redirect="http://xml.apache.org/xalan/redirect"
                xmlns:xalanredirect="org.apache.xalan.xslt.extensions.Redirect"
                xmlns:exslt="http://exslt.org/common"
                extension-element-prefixes="xalanredirect redirect"
                exclude-result-prefixes="exslt"
                >
  
  <xsl:import href="xref.xsl"/>

  <!-- Unique id for this document -->
  <xsl:param name="docid"><xsl:value-of select="/js2doc/@id"/></xsl:param>
  <!-- Relative address of embedded LZX files -->
  <xsl:param name="lzxdir" select="'programs/'"/>

    <!-- TODO refactor html2dbk.xsl to use this, if possible (it is specific about namespaces) -->
    
    <xsl:template match="*[@lang='text/html' or not(@lang)]" mode="doc2dbk">
      <xsl:apply-templates select="node()" mode="html2dbk"/>
    </xsl:template>

    <!-- Let everything through by default, including tags we don't understand.
         This is so that we accept docbook tags (w/o namespace qualifiers) in
         descriptions. -->
    <xsl:template match="@*|node()" mode="html2dbk">
     <xsl:copy>
       <xsl:apply-templates select="@*|node()" mode="html2dbk"/>
     </xsl:copy>
    </xsl:template>
    
    <!-- ignore markup -->
    <xsl:template match="br" mode="html2dbk"/>
  
    <xsl:template match="span|div" mode="html2dbk">
      <xsl:apply-templates select="node()|text()"/>
    </xsl:template>

    <xsl:template name="id">
      <xsl:if test="@id">
        <xsl:attribute name="id">
          <xsl:value-of select="@id"/>
        </xsl:attribute>
      </xsl:if>
    </xsl:template>
        
    <!-- Turn <p> blocks into <para> blocks, preserving @id if it exists -->
    <xsl:template match="p" mode="html2dbk">
      <para>
        <xsl:call-template name="id"/>
        <xsl:apply-templates mode="html2dbk"/>
      </para>
    </xsl:template>

  <xsl:template match="h1|h2|h3|h4|h5|h6" mode="html2dbk">
    <title>
      <xsl:apply-templates select="node()" mode="html2dbk"/>
    </title>
  </xsl:template>
  
  <xsl:template match="code|tt" mode="html2dbk">
    <literal>
      <xsl:if test="@class">
        <xsl:attribute name="role"><xsl:value-of select="@class"/></xsl:attribute>
      </xsl:if>
      <xsl:apply-templates/>
    </literal>
  </xsl:template>

  <xsl:template match="code/i|tt/i|pre/i" mode="html2dbk">
    <replaceable>
      <xsl:apply-templates mode="html2dbk"/>
    </replaceable>
  </xsl:template>
  
  <xsl:template match="dfn" mode="html2dbk">
    <glossitem>
      <xsl:apply-templates mode="html2dbk"/>
    </glossitem>
  </xsl:template>

  <xsl:template match="b|i|em|strong" mode="html2dbk">
    <emphasis role="{local-name()}">
      <xsl:apply-templates mode="html2dbk"/>
    </emphasis>
  </xsl:template>
  
  <xsl:template match="img" mode="html2dbk">
    <xsl:param name="informal">
      <xsl:if test="not(@title)">informal</xsl:if>
    </xsl:param>
    <xsl:element name="{$informal}figure">
      <xsl:call-template name="id"/>
      <xsl:if test="@title">
        <title><xsl:value-of select="@title"/></title>
      </xsl:if>
      
      <mediaobject>
        <imageobject>
          <imagedata fileref="{@src}"/>
        </imageobject>
      </mediaobject>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="glossterm|indexterm" mode="html2dbk">
    <xsl:element name="{local-name()}">
      <xsl:for-each select="@*">
        <xsl:attribute name="{name()}"><xsl:value-of select="."/></xsl:attribute>
      </xsl:for-each>
      <xsl:apply-templates mode="html2dbk"/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="dfn" mode="html2dbk">
    <indexterm significance="preferred">
      <primary><xsl:apply-templates mode="html2dbk"/></primary>
    </indexterm>
    <glossterm><xsl:apply-templates mode="html2dbk"/></glossterm>
  </xsl:template>

  <xsl:template match="method" mode="html2dbk">
    <methodname>
      <xsl:apply-templates mode="html2dbk"/>
    </methodname>
  </xsl:template>
  
  <xsl:template match="var|attribute|event|field|handler" mode="html2dbk">
    <varname>
      <xsl:apply-templates mode="html2dbk"/>
    </varname>
  </xsl:template>
  
  <xsl:template match="class|tag|api" mode="html2dbk">
    <classname>
      <xsl:apply-templates mode="html2dbk"/>
    </classname>
  </xsl:template>

  <!-- TODO [dda 4/29/08] should 'tag' above be treated like this? -->
  <xsl:template match="tagname" mode="html2dbk">
    <varname>&lt;<xsl:apply-templates mode="html2dbk"/>&gt;</varname>
  </xsl:template>
  
  <xsl:template match="param" mode="html2dbk">
    <parameter>
      <xsl:apply-templates mode="html2dbk"/>
    </parameter>
  </xsl:template>
  
  <!--
    links
  -->
  
  <!-- anchor -->
  <xsl:template match="a[@name]" mode="html2dbk">
    <anchor id="{$docid}.{@name}"/>
    <xsl:apply-templates mode="html2dbk"/>
  </xsl:template>
  
  <!-- internal link, e.g. href="#lz.basetab" or href="#name" -->
  <xsl:template match="a[starts-with(@href, '#') and not(@onclick)]" mode="html2dbk">
    <xsl:choose>
      <xsl:when test="contains(@href, '.')">
        <link linkend="{substring-after(@href, '#')}">
          <xsl:apply-templates mode="html2dbk"/>
        </link>
      </xsl:when>
      <xsl:otherwise>
        <link linkend="{$docid}.{substring-after(@href, '#')}">
          <xsl:apply-templates mode="html2dbk"/>
        </link>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- external link -->
  <xsl:template match="a" mode="html2dbk">
    <ulink url="{@href}">
      <xsl:apply-templates mode="html2dbk"/>
    </ulink>
  </xsl:template>

  <!-- inter-book link -->
  <xsl:template match="a[@href and substring-after(@href, '${') != '']" mode="html2dbk">
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
  
  
  <xsl:template match="blockquote" mode="html2dbk">
    <blockquote>
      <xsl:apply-templates mode="wrap" select="."/>
    </blockquote>
  </xsl:template>

  <xsl:template match="dl" mode="html2dbk">
    <variablelist>
      <xsl:apply-templates select="dt" mode="html2dbk"/>
    </variablelist>
  </xsl:template>
  
  <xsl:template match="dt" mode="html2dbk">
    <xsl:variable name="item-number" select="count(preceding-sibling::dt)+1"/>
    <varlistentry>
      <term>
        <xsl:apply-templates mode="html2dbk"/>
      </term>
      <listitem>
        <!-- Select the dd that follows this dt without an intervening dd -->
        <xsl:apply-templates mode="wrap"
                             select="following-sibling::dd[
                             count(preceding-sibling::dt)=$item-number
                             ]"/>
        <!-- If there is no such dd, then insert an empty para -->
        <xsl:if test="count(following-sibling::dd[
                count(preceding-sibling::dt)=$item-number
                ])=0">
          <para/>
        </xsl:if>
      </listitem>
    </varlistentry>
  </xsl:template>

  <xsl:template match="ol" mode="html2dbk">
    <orderedlist spacing="compact">
      <xsl:for-each select="li">
        <listitem>
          <xsl:apply-templates mode="wrap" select="."/>
        </listitem>
      </xsl:for-each>
    </orderedlist>
  </xsl:template>
  
  <xsl:template match="ul" mode="html2dbk">
    <itemizedlist spacing="compact">
      <xsl:for-each select="li">
        <listitem>
          <xsl:apply-templates mode="wrap" select="."/>
        </listitem>
      </xsl:for-each>
    </itemizedlist>
  </xsl:template>
  
  <xsl:template match="ul[processing-instruction('html2dbk')]" mode="html2dbk">
    <simplelist>
      <xsl:for-each select="li">
        <member type="vert">
          <xsl:apply-templates mode="wrap" select="."/>
        </member>
      </xsl:for-each>
    </simplelist>
  </xsl:template>
  
  <xsl:template match="pre" mode="html2dbk">
    <programlisting language="lzx">
      <xsl:apply-templates/>
    </programlisting>
  </xsl:template>
  
  <!--
    block-level formatting
  -->
  <xsl:template mode="para" match="todo">
    <remark role="todo">
      <xsl:apply-templates mode="para" select="node()"/>
    </remark>
  </xsl:template>
  
  <xsl:template mode="para" match="fixme">
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
  
  <xsl:template match="fixme/p|todo/p">
    <xsl:apply-templates mode="para" select="node()"/>
  </xsl:template>
  
  <xsl:template match="
                p/todo
                |li/todo
                |warning/todo">
    <remark role="todo">
      <xsl:apply-templates mode="para" select="node()"/>
    </remark>
  </xsl:template>

  <xsl:template match="
                p/fixme
                |li/fixme
                |warning/fixme
                ">
    <remark role="fixme">
      <xsl:apply-templates mode="para" select="node()"/>
    </remark>
  </xsl:template>
  
  <xsl:template match="fixme">
    <para role="fixme">
      <remark role="fixme">
        <emphasis role="para-label">FIXME: </emphasis>
        <xsl:apply-templates mode="para" select="node()"/>
      </remark>
    </para>
  </xsl:template>
  
  <xsl:template match="todo">
    <para role="todo">
      <remark role="todo">
        <emphasis role="para-label">TODO: </emphasis>
        <xsl:apply-templates mode="para" select="node()"/>
      </remark>
    </para>
  </xsl:template>
  
  <xsl:template match="note|warning|caution">
    <xsl:element name="{local-name()}">
      <xsl:apply-templates mode="wrap" select="."/>
    </xsl:element>
  </xsl:template>
  
  <!-- can't show examples inside of fixmes -->
  <xsl:template match="fixme/example"/>
  
  <xsl:template match="seealso">
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

  <xsl:template match="seealso/attributes" mode="html2dbk">
    The
    <xsl:call-template name="do-tags">
      <xsl:with-param name="tags" select="normalize-space(string())"/>
      <xsl:with-param name="class" select="'attribute'"/>
    </xsl:call-template>
    attributes.
  </xsl:template>
  
  <xsl:template match="seealso/classes" mode="html2dbk">
      <xsl:call-template name="do-tags">
        <xsl:with-param name="tags" select="normalize-space(string())"/>
        <xsl:with-param name="class" select="'classname'"/>
      </xsl:call-template>
  </xsl:template>
  
  <xsl:template match="seealso/tags" mode="html2dbk">
    <xsl:call-template name="do-tags">
      <xsl:with-param name="tags" select="normalize-space(string())"/>
      <xsl:with-param name="class" select="'tagname'"/>
      </xsl:call-template>
  </xsl:template>
  
  <xsl:template match="seealso/dguide" mode="html2dbk">
    <xsl:variable name="href" select="concat('${dguide}', @id, '.html')"/>
    <xsl:variable name="chapter-ref">
        <a href="{$href}"><xsl:value-of select="@title"/></a>
    </xsl:variable>
    The
    <xsl:apply-templates select="exslt:node-set($chapter-ref)"/>
    chapter of the Guide
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template match="seealso/component-design" mode="html2dbk">
    <xsl:variable name="href" select="concat('${component-design}', @id, '.html')"/>
    <xsl:variable name="chapter-ref">
        <a href="{$href}"><xsl:value-of select="@title"/></a>
    </xsl:variable>
     <p>For details on how this component is constructed see the 
     <xsl:apply-templates select="exslt:node-set($chapter-ref)"/>section of 
       <a href="${component-design}/index.html">The Component Design Guide</a>.
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
  
  <xsl:template match="example" mode="html2dbk">

    <xsl:variable name="fname">
      <xsl:choose>
        <xsl:when test="@extract='false'"/>
        <xsl:when test="@filename">
          <xsl:value-of select="translate(@filename,' ','_')"/>
        </xsl:when>
        <!-- @executable check has to be after @filename check so that we
             can use an example with @filename and @executable=false as a way
             of writing out a secondary .lzx file (see multistatebutton.lzx) -->
        <xsl:when test="@executable='false'"/>
        <xsl:when test="@id">
          <xsl:value-of select="concat(translate(@id,' ','_'), '.lzx')"/>
        </xsl:when>
        <xsl:when test="$docid and $docid != ''"><xsl:value-of select="translate($docid,' ','_')"/>-$<xsl:value-of select="1+count(preceding::example)"/>.lzx</xsl:when>
        <xsl:otherwise>
          <xsl:message terminate="yes">The root element of this document requires an id attribute.</xsl:message>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    
    <xsl:variable name="exampleclass">
      <xsl:if test="@title">example</xsl:if>
      <xsl:if test="not(@title)">informalexample</xsl:if>
    </xsl:variable>

    <xsl:variable name="textnode">
    </xsl:variable>
    
    <xsl:variable name="text">
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
    </xsl:variable>

    <xsl:element name="{$exampleclass}">
      <xsl:attribute name="role">live-example</xsl:attribute>
      <xsl:if test="@id">
        <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
      </xsl:if>
      
      <xsl:if test="@title">
        <title><xsl:value-of select="@title"/></title>
      </xsl:if>
      
      <xsl:variable name="executable" select="(not(@executable) or @executable='true') and (not(@extract) or @extract='true')"/>
    
      <xsl:if test="$executable">
        <programlisting language="lzx">
          <textobject><textdata fileref="{$lzxdir}{$fname}"/></textobject>
          <parameter role="query"><xsl:value-of select="@query-parameters"/></parameter>
        </programlisting>
      </xsl:if>

<!-- TODO [jgrandy 4/29/07] convert this to areaspec
    <xsl:if test="co">
      <calloutlist>
        <xsl:for-each select="co">
          <callout arearefs="{generate-id(.)}">
            <xsl:apply-templates mode="wrap"/>
          </callout>
        </xsl:for-each>
      </calloutlist>
    </xsl:if>
-->

    </xsl:element>

    <xsl:if test="$fname">
      <xsl:choose>
        <xsl:when test="element-available('xalanredirect:write')">
          <xalanredirect:write file="{$lzxdir}{$fname}.in">
            <xsl:value-of select="$text"/>
          </xalanredirect:write>
        </xsl:when>
        <xsl:when test="element-available('redirect:write')">
          <!-- TODO [20100402 anba] figure out why it is necessary to prepend
            'build/reference/' for redirect:write -->
          <redirect:write file="{'build/reference/'}{$lzxdir}{$fname}.in">
            <xsl:value-of select="$text"/>
          </redirect:write>
        </xsl:when>
        <xsl:otherwise>
            <xsl:message><xsl:text>no xalanredirect|redirect</xsl:text></xsl:message>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>

  </xsl:template>
  
  <xsl:template match="programlisting" mode="programlisting">
    <xsl:copy>
      <xsl:attribute name="language"><xsl:text>lzx</xsl:text></xsl:attribute>
      <xsl:apply-templates select="@*|node()" mode="programlisting"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="co" mode="programlisting">
    <co id="{generate-id(.)}"/>
  </xsl:template>
  
  <xsl:template match="@*|node()" mode="programlisting">
    <xsl:apply-templates select="."/>
  </xsl:template>
    
  <xsl:template match="*" mode="wrap">
    <!-- Test whether the first non-blank node is not a p -->
    <xsl:param name="nonblank-nodes">
      <xsl:apply-templates mode="nonblank-nodes"/>
    </xsl:param>
    
    <xsl:param name="tested" select="
               count(exslt:node-set($nonblank-nodes)/*) != 0 and
               local-name(exslt:node-set($nonblank-nodes)/*[1]) != 'p'"/>
    
    <xsl:param name="n1" select="count(*[1]/following::p)"/>
    <xsl:param name="n2" select="count(text()[1]/following::p)"/>
    
    
    <xsl:param name="n">
      <xsl:if test="$tested">
        <!-- tweaked to work without max function -bshine 6.22.06 -->
        <xsl:value-of select="$n1"/>
      </xsl:if>
    </xsl:param>
    
    <xsl:if test="false()">
      <nodeset tested="{$tested}" count="{count(exslt:node-set($nonblank-nodes)/*)}">
        <xsl:for-each select="exslt:node-set($nonblank-nodes)/*">
          <element name="{local-name()}"/>
        </xsl:for-each>
      </nodeset>
    </xsl:if>
    
    <!-- Wrap everything before the first p into a para -->
    <xsl:if test="$tested">
      <para>
        <xsl:apply-templates select="
                             node()[count(following::p)=$n] |
                             text()[count(following::p)=$n]"
                             mode="html2dbk"/>
      </para>
    </xsl:if>
    <xsl:apply-templates select="
                         node()[count(following::p)!=$n] |
                         text()[count(following::p)!=$n]"
                         mode="html2dbk"/>
  </xsl:template>

</xsl:stylesheet>
