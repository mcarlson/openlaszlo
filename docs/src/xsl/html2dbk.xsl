<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!--
Convert html to docbook:
- convert html elements to docbook elements
- translate lists, tables, and links
- turn <h1>text<h2>text<h2>text ->
   <section><title>text<section><section></section>
-->

<!DOCTYPE xsl:stylesheet [
<!ENTITY condition "<xsl:if test='@condition'>
                      <xsl:attribute name='condition'><xsl:value-of select='@condition'/></xsl:attribute>
                    </xsl:if>">
]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:dyn="http://exslt.org/dynamic"
                xmlns:exslt="http://exslt.org/common"
                xmlns:math="http://exslt.org/math"
                xmlns:xalan="http://xml.apache.org/xalan"
                xmlns:html2dbk="html2dbk"
                xmlns:d="docbook"
                xmlns:h="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="d dyn exslt h html2dbk math xalan"
                extension-element-prefixes="html2dbk"
                version="1.0">
  
  <xalan:component prefix="html2dbk" functions="max">
  
<!-- this breaks new build system -bshine 6.22.06
Try using math:max instead
see http://www.exslt.org/math/functions/max/
    <xalan:script lang="javascript"><![CDATA[
      function max(a, b) {
        return Math.max(a, b);
      }
    ]]></xalan:script>
-->
  </xalan:component>
  
  <xsl:template match="h:html">
    <xsl:variable name="class-pi" select="//processing-instruction('html2db')[starts-with(string(), 'class=&quot;')][1]"/>
    <xsl:variable name="class">
      <xsl:choose>
        <xsl:when test="count($class-pi)!=0">
          <xsl:value-of select="substring-before(substring-after(string($class-pi), 'class=&quot;'), '&quot;')"/>
        </xsl:when>
        <xsl:otherwise>chapter</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:element name="{$class}">
      <xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute>
      <xsl:apply-templates select="h:body"/>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="h:body">
    <!-- Warn if there are any text nodes outside a para, etc.  See
         the note at the naked text template for why this is a
         warning. -->
    <xsl:if test="text()[normalize-space() != '']">
      <xsl:message terminate="no">
        Text must be inside a &lt;p&gt; tag.
      </xsl:message>
    </xsl:if>
    <xsl:variable name="nodes" select="//h:body/node()|//h:body/text()"/>
    <xsl:variable name="nodescount" select="count($nodes)"/>
    <xsl:call-template name="section-content">
      <xsl:with-param name="level" select="1"/>
      <xsl:with-param name="nodes" select="$nodes"/>
    </xsl:call-template>
  </xsl:template>
  
  <!-- Wrap naked text nodes in a <para> so that they'll process more
       correctly.  The h:body also warns about these, because even
       this preprocessing step isn't guaranteed to fix them.  This is
       because "Some <i>italic</i> text" will be preprocessed into
       "<para>Some </para> <emphasis>italic</emphasis><para>
       text</para>" instead of "<para>Some <emphasis>italic</emphasis>
       text</para>".  Getting this right would require more work than
       just maintaining the source documents. -->
  <xsl:template match="h:body/text()[normalize-space() != '']">
    <!-- add an invalid tag to make it easy to find this in
         the generated file -->
    <naked-text>
      <para>
        <xsl:apply-templates/>
      </para>
    </naked-text>
  </xsl:template>
  
  <xsl:template name="section-content">
    <xsl:param name="level"/>
    <xsl:param name="nodes"/>
    <xsl:param name="h1" select="concat('h', $level)"/>
    <xsl:param name="h2" select="concat('h', $level+1)"/>
    <xsl:param name="h2-position" select="count(exslt:node-set($nodes)[1]/following-sibling::*[local-name()=$h2])"/>
    
    <!-- copy up to first h2 -->
    <xsl:apply-templates select="exslt:node-set($nodes)[
                         count(following-sibling::*[local-name()=$h2])=$h2-position
                         ]"/>
    
    <!-- if section is empty, add a para -->
    <xsl:if test="not(exslt:node-set($nodes)/h:para[
            count(following-sibling::*[local-name()=$h2])=$h2-position
            ])">
      <para/>
    </xsl:if>
    
    <!-- subsections -->
    <xsl:for-each select="exslt:node-set($nodes)[local-name()=$h2]">
      <section>
        <xsl:variable name="mynodes" select="exslt:node-set($nodes)[
                      count(following-sibling::*[local-name()=$h2])=
                      count(current()/following-sibling::*[local-name()=$h2])]"/>
        <xsl:for-each select="exslt:node-set($mynodes)[local-name()=$h2]">
          <xsl:choose>
            <xsl:when test="@id">
              <xsl:call-template name="id"/>
            </xsl:when>
            <xsl:when test="h:a/@name">
              <xsl:attribute name="id">
                <xsl:value-of select="concat($docid, '.', h:a/@name)"/>
              </xsl:attribute>
            </xsl:when>
          </xsl:choose>
        </xsl:for-each>
        
        <xsl:variable name="new-nodes" select="exslt:node-set($nodes)[
                          count(following-sibling::*[local-name()=$h2])=
                          count(current()/following-sibling::*[local-name()=$h2])]"/>
        <xsl:variable name="nodescount" select="count($new-nodes)"/>
        <xsl:call-template name="section-content">
          <xsl:with-param name="level" select="$level+1"/>
          <xsl:with-param name="nodes" select="$new-nodes"/>
        </xsl:call-template>
      </section>
    </xsl:for-each>
  </xsl:template>
  
  <xsl:template match="h:h1|h:h2|h:h3|h:h4|h:h5|h:h6">
    <title>
      &condition;
      <xsl:apply-templates mode="skip-anchors" select="node()"/>
    </title>
  </xsl:template>
  
  <xsl:template mode="skip-anchors" match="h:a[@name]">
    <xsl:apply-templates/>
  </xsl:template>
  
  <xsl:template mode="skip-anchors" match="node()">
    <xsl:apply-templates select="."/>
  </xsl:template>
  
  <xsl:template match="h:code/h:i|h:tt/h:i|h:pre/h:i">
    <replaceable>
      <xsl:apply-templates/>
    </replaceable>
  </xsl:template>
  
  <xsl:template match="h:dfn">
    <glossitem>
      <xsl:apply-templates/>
    </glossitem>
  </xsl:template>

  <xsl:template match="h:b|h:i|h:em|h:strong">
    <emphasis role="{local-name()}">
      <xsl:apply-templates/>
    </emphasis>
  </xsl:template>
  
  <xsl:template match="h:code|h:tt">
    <literal>
      &condition;
      <xsl:if test="@class">
        <xsl:attribute name="role"><xsl:value-of select="@class"/></xsl:attribute>
      </xsl:if>
      <xsl:apply-templates/>
    </literal>
  </xsl:template>
  
  <xsl:template match="h:body/h:code|h:pre">
    <programlisting>
      &condition;
      <xsl:apply-templates/>
    </programlisting>
  </xsl:template>
  
  <xsl:template match="h:img">
    <xsl:param name="informal">
      <xsl:if test="not(@title) and not(d:title)">informal</xsl:if>
    </xsl:param>
    <xsl:element name="{$informal}figure">
      <xsl:call-template name="id"/>
      <xsl:choose>
        <xsl:when test="@title">
          <title><xsl:value-of select="@title"/></title>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates select="d:title"/>
        </xsl:otherwise>
      </xsl:choose>
      
      <mediaobject>
        &condition;
        <imageobject>
          <imagedata fileref="{@src}"/>
        </imageobject>
      </mediaobject>
    </xsl:element>
  </xsl:template>
  
  <xsl:template name="id">
    <xsl:if test="@id">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="h:p">
    <para>
      &condition;
      <xsl:call-template name="id"/>
      <xsl:apply-templates/>
    </para>
  </xsl:template>
  
  <!-- pass docbook elements through unchanged -->
  <xsl:template match="d:*|h:glossterm|h:indexterm">
    <xsl:element name="{local-name()}">
      <xsl:for-each select="@*">
        <xsl:attribute name="{name()}"><xsl:value-of select="."/></xsl:attribute>
      </xsl:for-each>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="h:dfn">
    <indexterm significance="preferred">
      <primary><xsl:apply-templates/></primary>
    </indexterm>
    <glossterm><xsl:apply-templates/></glossterm>
  </xsl:template>

  <!--
    links
  -->
  
  <!-- anchor -->
  <xsl:template match="h:a[@name]">
    <anchor id="{$docid}.{@name}"/>
    <xsl:apply-templates/>
  </xsl:template>
  
  <!-- internal link -->
  <xsl:template match="h:a[starts-with(@href, '#') and not(@onclick)]">
    <link linkend="{$docid}.{substring-after(@href, '#')}">
      <xsl:apply-templates/>
    </link>
  </xsl:template>
  
  <!-- external link -->
  <xsl:template match="h:a">
    <ulink url="{@href}">
      <xsl:apply-templates/>
    </ulink>
  </xsl:template>
  
  <!--
  -->

  <xsl:template match="h:blockquote">
    <blockquote>
      &condition;
      <xsl:apply-templates mode="wrap" select="."/>
    </blockquote>
  </xsl:template>
  
  <!--
    lists
  -->
  
  <xsl:template match="h:dl">
    <variablelist>
      <xsl:apply-templates select="d:*"/>
      <xsl:apply-templates select="h:dt"/>
    </variablelist>
  </xsl:template>
  
  <xsl:template match="h:dt">
    <xsl:variable name="item-number" select="count(preceding-sibling::h:dt)+1"/>
    <varlistentry>
      &condition;
      <term>
        <xsl:apply-templates/>
      </term>
      <listitem>
        <!-- Select the dd that follows this dt without an intervening dd -->
        <xsl:apply-templates mode="wrap"
                             select="following-sibling::h:dd[
                             count(preceding-sibling::h:dt)=$item-number
                             ]"/>
        <!-- If there is no such dd, then insert an empty para -->
        <xsl:if test="count(following-sibling::h:dd[
                count(preceding-sibling::h:dt)=$item-number
                ])=0">
          <para/>
        </xsl:if>
      </listitem>
    </varlistentry>
  </xsl:template>
  
  <xsl:template mode="wrap" match="*[count(h:p) = 0]">
    <para>
      <xsl:apply-templates/>
    </para>
  </xsl:template>
  
  <xsl:template mode="nonblank-nodes" match="node()">
    <xsl:element name="{local-name()}"/>
  </xsl:template>
  
  <xsl:template mode="nonblank-nodes" match="text()[normalize-space()='']"/>
  
  <xsl:template mode="nonblank-nodes" match="text()">
    <text/>
  </xsl:template>
  
  <xsl:template mode="wrap" match="*">
    <!-- Test whether the first non-blank node is not a p -->
    <xsl:param name="nonblank-nodes">
      <xsl:apply-templates mode="nonblank-nodes"/>
    </xsl:param>
    
    <xsl:param name="tested" select="
               count(exslt:node-set($nonblank-nodes)/*) != 0 and
               local-name(exslt:node-set($nonblank-nodes)/*[1]) != 'p'"/>
    
    <xsl:param name="n1" select="count(*[1]/following::h:p)"/>
    <xsl:param name="n2" select="count(text()[1]/following::h:p)"/>
    
    
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
                             node()[count(following::h:p)=$n] |
                             text()[count(following::h:p)=$n]"/>
      </para>
    </xsl:if>
    <xsl:apply-templates select="
                         node()[count(following::h:p)!=$n] |
                         text()[count(following::h:p)!=$n]"/>
  </xsl:template>
  
  <xsl:template match="h:ol">
    <orderedlist spacing="compact">
      &condition;
      <xsl:for-each select="h:li">
        <listitem>
          <xsl:apply-templates mode="wrap" select="."/>
        </listitem>
      </xsl:for-each>
    </orderedlist>
  </xsl:template>
  
  <xsl:template match="h:ul">
    <itemizedlist spacing="compact">
      &condition;
      <xsl:for-each select="h:li">
        <listitem>
          <xsl:apply-templates mode="wrap" select="."/>
        </listitem>
      </xsl:for-each>
    </itemizedlist>
  </xsl:template>
  
  <xsl:template match="h:ul[processing-instruction('html2dbk')]">
    <simplelist>
      &condition;
      <xsl:for-each select="h:li">
        <member type="vert">
          <xsl:apply-templates mode="wrap" select="."/>
        </member>
      </xsl:for-each>
    </simplelist>
  </xsl:template>
  
  <!--
    ignored markup
  -->
  <xsl:template match="h:br"/>
  
  <xsl:template match="h:span|h:div">
    <xsl:apply-templates select="node()|text()"/>
  </xsl:template>
  
  <xsl:template mode="count-columns" match="h:tr">
    <n>
      <xsl:value-of select="count(h:td)"/>
    </n>
  </xsl:template>

  <xsl:template name="reduce-max">
    <xsl:param name="args"/>
    <xsl:choose>
      <xsl:when test="count($args/count) &lt; 2">
        <value select="{$args/count[1]}"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:variable name="max">
          <xsl:call-template name="reduce-max">
            <xsl:with-param name="args" select="$args/count[position() &gt; 1]"/>
          </xsl:call-template>
        </xsl:variable>
        <xsl:message><xsl:value-of select="concat('math:max(',
        number($args/count[1]), ', ', number($max), ')')"/></xsl:message>
        <value select="{math:max(number($args/count[1]), number(exslt:node-set($max)/value/@select))}"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <!-- tables -->
  <xsl:template match="h:table">
    <xsl:param name="informal">
      <xsl:if test="not(@summary)">informal</xsl:if>
    </xsl:param>
    <xsl:param name="colcounts">
      <xsl:apply-templates mode="count-columns" select=".//h:tr"/>
    </xsl:param>
    <xsl:param name="cols" select="math:max(exslt:node-set($colcounts)/n)"/>
    <xsl:param name="sorted">
      <xsl:for-each select="exslt:node-set($colcounts)/n">
        <xsl:sort order="descending" data-type="number"/>
        <n><xsl:value-of select="."/></n>
      </xsl:for-each>
    </xsl:param>
    <xsl:element name="{$informal}table">
      <xsl:call-template name="id"/>
      <xsl:if test="processing-instruction('doc2html')[starts-with(., 'rowsep')]">
        <xsl:attribute name="rowsep">1</xsl:attribute>
      </xsl:if>
      <xsl:apply-templates select="processing-instruction()"/>
      <xsl:if test="@summary">
        <title><xsl:value-of select="@summary"/></title>
      </xsl:if>
      <tgroup cols="{$cols}">
        <xsl:if test=".//h:tr/h:th">
          <thead>
            <xsl:for-each select=".//h:tr[count(h:th)!=0]">
              <row>
                <xsl:for-each select="h:td|h:th">
                  <entry>
                    <xsl:apply-templates/>
                  </entry>
                </xsl:for-each>
              </row>
            </xsl:for-each>
          </thead>
        </xsl:if>
        <tbody>
          <xsl:for-each select=".//h:tr[count(h:th)=0]">
            <row>
              <xsl:for-each select="h:td|h:th">
                <entry>
                  <xsl:apply-templates/>
                </entry>
              </xsl:for-each>
            </row>
          </xsl:for-each>
        </tbody>
      </tgroup>
    </xsl:element>
  </xsl:template>
  
  <!-- unknown elements -->
  
  <xsl:template match="h:*">
    <xsl:message terminate="no">
      Unknown element <xsl:value-of select="name()"/>
    </xsl:message>
    <xsl:copy>
      <xsl:apply-templates/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="processing-instruction()">
    <xsl:copy/>
  </xsl:template>
  
  <xsl:template match="processing-instruction('doc2html')"/>
  
</xsl:stylesheet>
