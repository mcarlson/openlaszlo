<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

<!ENTITY nbsp  "&#160;">
<!ENTITY raquo "&#187;">

<!ENTITY tagname        '(doc/tag[@name="lzxname"]/text)'>
<!ENTITY shortdesc      '(doc/tag[@name="shortdesc"]/text)'>

<!ENTITY commonname     '(self::node()/@name | self::node()/doc/tag[@name="lzxname"]/text)[1]'>

<!ENTITY ispublic       '(@access="public")'>
<!ENTITY isvisible      '(contains($visibility.filter, @access))'>

<!ENTITY objectvalue    '(object|class|function)'>
<!ENTITY classvalue     '(class|function)'>
<!ENTITY privateslot    '(@name="prototype" or @name="__ivars__" or @name="dependencies" or @name="setters" or @name="tagname")'>

]>

<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:import href="js2doc-comment2dbk.xsl"/>
    
    <xsl:import href="js2doc2dbk/utilities.xsl"/>
    <xsl:import href="js2doc2dbk/synopsis.xsl"/>
    
    <xsl:param name="visibility.filter" select="'public'"/>
    <xsl:param name="show.devnotes" select="contains($visibility.filter,'private')"/>
    <xsl:param name="show.fixmes" select="contains($visibility.filter,'private')"/>
        
    <xsl:key name="id" match="*" use="@id"/>
    <xsl:key name="unitid" match="*" use="@unitid"/>
    <xsl:key name="topic" match="property" use="@topic"/>
    <xsl:key name="subtopic" match="property" use="@subtopic"/>
    <xsl:key name="name-js" match="property" use="@name"/>
    <xsl:key name="name-lzx" match="property" use="&tagname;"/>
    <xsl:key name="superclass" match="property[child::class]" use="class/@extends"/>

    <xsl:template match="js2doc" mode="decls-by-topic">
      <xsl:param name="topic"/>
      <xsl:variable name="properties" select="property"/>
      <xsl:for-each select="$properties[@topic=$topic and generate-id(.)=generate-id(key('subtopic',@subtopic)[1])]">
        <xsl:sort select="@subtopic"/>
        <xsl:variable name="subtopic" select="@subtopic"/>
        <xsl:variable name="topicdesc" select="concat($topic,'.',$subtopic)"/>
        <xsl:variable name="topicid" select="concat('topic.',translate($topicdesc,' ','_'))"/>
        <xsl:variable name="decls" select="$properties[@topic=$topic and @subtopic=$subtopic and &isvisible;]"/>
        <xsl:if test="count($decls) > 0">
          <reference id="{$topicid}" xreflabel="{$topicdesc}">
            <title><xsl:value-of select="$subtopic"/></title>
            <xsl:message><xsl:value-of select="concat('found ', count($decls), ' visible items in ', $topicdesc)"/></xsl:message>
            <xsl:for-each select="$decls">
              <xsl:sort select="translate(@id,'_$','  ')"/>
              <xsl:apply-templates select="." mode="refentry"/>
            </xsl:for-each>
          </reference>
        </xsl:if>
      </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="js2doc" mode="decls-no-topic">
      <xsl:variable name="decls" select="property[not(@topic)]"/>
      <xsl:if test="count($decls) > 0">
        <reference id="topic.none.none">
          <title>No Topic</title>
          <xsl:if test="count(decls) > 0">
            <xsl:for-each select="$decls">
              <xsl:sort select="@id"/>
              <xsl:apply-templates select="." mode="refentry"/>
            </xsl:for-each>
          </xsl:if>
        </reference>
      </xsl:if>
    </xsl:template>
        
    <xsl:template name="files-all">
      <reference><title>Files</title>
        <xsl:variable name="units" select="//unit"/>
        <xsl:for-each select="$units">
          <xsl:sort select="@id"/>
          <xsl:if test="&isvisible;">
            <xsl:apply-templates select="." mode="refentry"/>
          </xsl:if>
        </xsl:for-each>
      </reference>
    </xsl:template>

    <!-- REFENTRY -->
    
    <xsl:template match="property" mode="refentry">

      <xsl:variable name="jsname" select="@name"/>
      <xsl:variable name="lzxname" select="&tagname;"/>
      <xsl:variable name="desc">
        <xsl:apply-templates select="." mode="desc"/>
      </xsl:variable>
      
      <refentry id="{@id}" xreflabel="{$desc}">
        <xsl:if test="$lzxname"><anchor id="{concat('tag.',$lzxname)}"/></xsl:if>
        <refmeta>
          <refentrytitle><xsl:value-of select="$desc"/></refentrytitle>
        </refmeta>
        <refnamediv>
          <refdescriptor>
            <xsl:call-template name="declaration-index"/>
            <xsl:value-of select="$desc"/>
          </refdescriptor>
          <xsl:if test="$jsname"><refname role="javascript"><xsl:value-of select="$jsname"/></refname></xsl:if>
          <xsl:if test="$lzxname"><refname role="lzx"><xsl:value-of select="$lzxname"/></refname></xsl:if>
          <xsl:if test="&shortdesc;">
            <refpurpose>
              <xsl:apply-templates select="&shortdesc;" mode="doc2dbk"/>
            </refpurpose>
          </xsl:if>
        </refnamediv>
        <refsynopsisdiv>
          <xsl:call-template name="insert-refinfo"/>
        </refsynopsisdiv>
        <xsl:call-template name="declaration-description"/>
        <xsl:if test="child::class">
          <refsect1><title>Superclass Chain</title>
            <xsl:call-template name="describe-superclass-chain">
              <xsl:with-param name="class" select="child::class"/>
            </xsl:call-template>
          </refsect1>
          <refsect1><title>Known Subclasses</title>
            <xsl:call-template name="describe-known-subclasses"/>
          </refsect1>
        </xsl:if>
        <xsl:apply-templates select="." mode="refentry-details"/>
        <xsl:apply-templates select="." mode="detailed-synopsis"/>
      </refentry>
    </xsl:template>
    
    <xsl:template match="unit" mode="refentry">

      <xsl:variable name="desc" select="@path"/>
      <xsl:variable name="file-path" select="@path"/>

      <refentry id="{@id}" xreflabel="{$desc}">
        <refnamediv>
          <refname>
            <filename><xsl:value-of select="$file-path"/></filename>
          </refname>
          <xsl:if test="&shortdesc;">
            <refpurpose>
              <xsl:apply-templates select="&shortdesc;" mode="doc2dbk"/>
            </refpurpose>
          </xsl:if>
          <xsl:call-template name="insert-refinfo"/>
        </refnamediv>
        <xsl:call-template name="declaration-description"/>
        <xsl:variable name="decls" select="key('unitid', @id)[parent::js2doc]"/>
        <xsl:if test="$decls">
          <refsect1><title>Declarations</title>
          <orderedlist>
            <xsl:for-each select="$decls">
              <!-- leave in lexical order -->
              <xsl:if test="&isvisible;">
                <listitem>
                  <xsl:apply-templates select="." mode="desc">
                    <xsl:with-param name="link" select="1"/>
                  </xsl:apply-templates>
                </listitem>
              </xsl:if>
            </xsl:for-each>
          </orderedlist>
          </refsect1>
        </xsl:if>
      </refentry>
    </xsl:template>

    <xsl:template match="*" mode="refentry">
    </xsl:template>

    <!-- DESCRIPTION -->
    
    <xsl:template name="declaration-description">
      <xsl:if test="doc/tag[@name='usage']/text">
        <refsect1><title>Usage</title>
          <xsl:apply-templates select="doc/tag[@name='usage']/text" mode="doc2dbk"/>
        </refsect1>
      </xsl:if>
      <xsl:if test="doc/text">
        <refsect1><title>Description</title>
          <xsl:apply-templates select="doc/text" mode="doc2dbk"/>
        </refsect1>
      </xsl:if>
      <xsl:if test="$show.devnotes and doc/tag[@name='devnote']">
        <refsect1><title>Development Note</title>
          <xsl:apply-templates select="doc/tag[@name='devnote']/text" mode="doc2dbk"/>
        </refsect1>
      </xsl:if>
    </xsl:template>

    <!-- REFENTRY-DETAILS -->
    
    <xsl:template match="property" mode="refentry-details">
      <refsect1>
        <title>Details</title>

        <xsl:variable name="jsname" select="@name"/>
        <xsl:variable name="lzxname" select="&tagname;"/>
        <xsl:variable name="ivars" select="&objectvalue;/property[@name='__ivars__']/object/property[&isvisible;]"/>
        <xsl:variable name="svars" select="&objectvalue;/property[@name='setters']/object/property[&isvisible;]"/>
        <xsl:variable name="pvars" select="&objectvalue;/property[@name='prototype']/object/property[&isvisible;]"/>
        <xsl:variable name="ovars" select="&objectvalue;/property[not(&privateslot;) and &isvisible;]"/>
        
        <!-- Static Properties -->
        <xsl:call-template name="describe-members">
          <xsl:with-param name="members" select="$ovars[not(child::function) and not(@type='LzEvent')]"/>
          <xsl:with-param name="static" select="true()"/>
          <xsl:with-param name="title" select="'Static Properties'"/>
        </xsl:call-template>

        <!-- Static Methods -->        
        <xsl:call-template name="describe-members">
          <xsl:with-param name="members" select="$ovars[child::function]"/>
          <xsl:with-param name="static" select="true()"/>
          <xsl:with-param name="title" select="'Static Methods'"/>
        </xsl:call-template>

        <!-- Static Events -->        
        <xsl:call-template name="describe-members">
          <xsl:with-param name="members" select="$ovars[@type='LzEvent']"/>
          <xsl:with-param name="static" select="true()"/>
          <xsl:with-param name="title" select="'Static Events'"/>
        </xsl:call-template>

        <!-- Initialization Arguments -->        
        <xsl:call-template name="describe-members">
          <xsl:with-param name="members" select="&classvalue;/initarg"/>
          <xsl:with-param name="title">
            <xsl:choose>
              <xsl:when test="$lzxname"><xsl:value-of select="'Initial Attributes'"/></xsl:when>
              <xsl:otherwise><xsl:value-of select="'Constructor Arguments'"/></xsl:otherwise>
            </xsl:choose>
          </xsl:with-param>
          <xsl:with-param name="subtitle">
            <xsl:choose>
              <xsl:when test="$lzxname"><xsl:value-of select="'Initial Attributes are given as attributes in LZX but are not generally available as properties in JavaScript.'"/></xsl:when>
            </xsl:choose>
          </xsl:with-param>
        </xsl:call-template>

        <!-- Properties -->        
        <xsl:call-template name="describe-members">
          <xsl:with-param name="members" select="$ivars"/>
          <xsl:with-param name="title" select="'Properties'"/>
        </xsl:call-template>

        <!-- Setters -->        
        <xsl:call-template name="describe-members">
          <xsl:with-param name="members" select="$svars"/>
          <xsl:with-param name="title" select="'Setters'"/>
          <xsl:with-param name="subtitle">
            <xsl:text>Setters for virtual properties, to be used with setAttribute. A setter may or may not have a corresponding getter method; consult the Methods list in this section.</xsl:text>
          </xsl:with-param>
          <xsl:with-param name="describe-js" select="false()"/>
          <xsl:with-param name="describe-lzx" select="false()"/>
        </xsl:call-template>

        <!-- (Prototype) Methods -->        
        <xsl:call-template name="describe-members">
          <xsl:with-param name="members" select="$pvars[child::function]"/>
          <xsl:with-param name="title" select="'Methods'"/>
        </xsl:call-template>

        <!-- (Prototype) Events -->        
        <xsl:call-template name="describe-members">
          <xsl:with-param name="members" select="$pvars[@type='LzEvent']"/>
          <xsl:with-param name="title" select="'Events'"/>
        </xsl:call-template>

        <!-- Prototype Properties -->
        <xsl:call-template name="describe-members">
          <xsl:with-param name="members" select="$pvars[not(child::function) and not(@type='LzEvent')]"/>
          <xsl:with-param name="title" select="'Prototype Properties'"/>
        </xsl:call-template>
        
      </refsect1>
    </xsl:template>
        
    <xsl:template match="property" mode="detailed-synopsis">
        <xsl:variable name="jsname" select="@name"/>
        <xsl:variable name="lzxname" select="&tagname;"/>
        <xsl:if test="$lzxname">
          <refsect1><title>LZX Synopsis</title>
            <xsl:apply-templates select="." mode="synopsis">
              <xsl:with-param name="add-link" select="false()"/>
              <xsl:with-param name="add-sublink" select="true()"/>
              <xsl:with-param name="verbose" select="true()"/>
              <xsl:with-param name="language" select="'lzx'" />
            </xsl:apply-templates>
          </refsect1>
        </xsl:if>
        <xsl:if test="$jsname">
          <refsect1><title>JavaScript Synopsis</title>
            <xsl:apply-templates select="." mode="synopsis">
              <xsl:with-param name="add-link" select="false()"/>
              <xsl:with-param name="add-sublink" select="true()"/>
              <xsl:with-param name="verbose" select="true()"/>
              <xsl:with-param name="language" select="'javascript'" />
            </xsl:apply-templates>
          </refsect1>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="*" mode="refentry-details">
    </xsl:template>

    <xsl:template name="describe-members">
      <xsl:param name="members"/>
      <xsl:param name="static"/>
      <xsl:param name="title"/>
      <xsl:param name="subtitle"/>
      <xsl:param name="describe-js" select="boolean(@name)"/>
      <xsl:param name="describe-lzx" select="boolean(&tagname;)"/>
      <xsl:variable name="visible-members" select="$members[contains($visibility.filter,@access)]"/>
      <xsl:if test="count($visible-members) > 0">
        <variablelist>
          <title><xsl:value-of select="$title"/> (<xsl:value-of select="count($visible-members)"/>)</title>
          <xsl:if test="$subtitle"><para><xsl:value-of select="$subtitle"/></para></xsl:if>
          <xsl:for-each select="$visible-members">
            <xsl:sort select="translate(@name,'_$','  ')"/>
            <xsl:apply-templates select="." mode="describe-member">
              <xsl:with-param name="static" select="$static"/>
              <xsl:with-param name="describe-js" select="$describe-js"/>
              <xsl:with-param name="describe-lzx" select="$describe-lzx"/>
            </xsl:apply-templates>
          </xsl:for-each>
        </variablelist>
      </xsl:if>
    </xsl:template>

    <xsl:template match="initarg|property" mode="describe-member">
      <!-- TO DO: special format for setters (properties with ../object/../property[@name='setters'] structure) -->
      <xsl:param name="static"/>
      <xsl:param name="describe-js" select="true()"/>
      <xsl:param name="describe-lzx" select="true()"/>

      <xsl:variable name="jsname" select="@name"/>
      <xsl:variable name="lzxname" select="&tagname;"/>
      <xsl:variable name="name" select="&commonname;"/>
      <xsl:variable name="sortasname" select="translate($name,'_$','  ')"/>
      <xsl:variable name="id" select="@id"/>
      <xsl:variable name="desc">
        <xsl:apply-templates select="." mode="desc"/>
      </xsl:variable>
      <xsl:variable name="xref">
        <xsl:apply-templates select="." mode="xref"/>
      </xsl:variable>
      
      <varlistentry>
        <term id="{@id}" xreflabel="{$xref}">
          <!-- how to get the indexterm to use a different name than xreflabel? -->
          <indexterm zone="{@id}">
            <primary>
              <xsl:if test="$name != $sortasname">
                <xsl:attribute name="sortas"><xsl:value-of select="$sortasname"/></xsl:attribute>
              </xsl:if>
              <xsl:value-of select="$name"/>
            </primary>
          </indexterm>
          <xsl:value-of select="$desc"/>
        </term>
        <listitem>
          <xsl:if test="$describe-lzx">
            <refsect3>
              <xsl:apply-templates select="." mode="synopsis">
                <xsl:with-param name="add-link" select="false()"/>
                <xsl:with-param name="static" select="$static"/>
                <xsl:with-param name="language" select="'lzx'" />
              </xsl:apply-templates>
            </refsect3>
          </xsl:if>
          <xsl:if test="$describe-js and name()='property'">
            <refsect3>
              <xsl:apply-templates select="." mode="synopsis">
                <xsl:with-param name="add-link" select="false()"/>
                <xsl:with-param name="static" select="$static"/>
                <xsl:with-param name="language" select="'javascript'" />
              </xsl:apply-templates>
            </refsect3>
          </xsl:if>
          <xsl:if test="doc/text">
            <refsect3><xsl:apply-templates select="doc/text" mode="doc2dbk"/></refsect3>
          </xsl:if>
        </listitem>
      </varlistentry>
    </xsl:template>

    <xsl:template match="*" mode="describe-member">
    </xsl:template>

    <!-- DESCRIPTION -->

    <xsl:template name="itemdesc">
      <!-- TODO add @includebuilds and @excludebuilds -->
      <xsl:param name="desc"/>
      <xsl:param name="link" select="0"/>
      <xsl:if test="$desc = ''"><xsl:message><xsl:text>empty $desc passed to template itemdesc</xsl:text></xsl:message></xsl:if>
      <xsl:choose>
        <xsl:when test="$link > 0">
          <link linkend="{@id}"><xsl:value-of select="$desc"/></link>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$desc"/>
        </xsl:otherwise>
      </xsl:choose>
      <xsl:if test="@runtimes">
        <xsl:value-of select="concat(' (', @runtimes, ')')"/>
      </xsl:if>
    </xsl:template>
    
    <xsl:template match="property[child::class]" mode="desc">
      <xsl:param name="link" select="0"/>
      <xsl:call-template name="itemdesc">
        <xsl:with-param name="link" select="$link"/>
        <xsl:with-param name="desc">
          <xsl:call-template name="classlabel"/>
        </xsl:with-param>
      </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="property[child::function]" mode="desc">
      <xsl:param name="link" select="0"/>
      <xsl:call-template name="itemdesc">
        <xsl:with-param name="link" select="$link"/>
        <xsl:with-param name="desc">
          <xsl:value-of select="concat(@name, '()')"/>
        </xsl:with-param>
      </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="property|initarg" mode="desc">
      <xsl:param name="link" select="0"/>
      <xsl:call-template name="itemdesc">
        <xsl:with-param name="link" select="$link"/>
        <xsl:with-param name="desc">
          <xsl:value-of select="&commonname;"/>
        </xsl:with-param>
      </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="unit" mode="desc">
      <xsl:param name="link" select="0"/>
      <xsl:choose>
        <xsl:when test="$link > 0">
          <filename><link linkend="{@id}"><xsl:value-of select="@path"/></link></filename>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="@path"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>
    
    <!-- CROSS REFERENCE DESCRIPTION -->
    
    <xsl:template match="property|initarg" mode="commonname">
      <xsl:variable name="jsname" select="@name"/>
      <xsl:variable name="lzxname" select="&tagname;"/>
      <xsl:choose>
        <xsl:when test="$jsname and not(starts-with($jsname,'lz.'))">
          <xsl:value-of select="$jsname"/>
        </xsl:when>
        <xsl:when test="$lzxname and $lzxname != ''">
          <xsl:value-of select="$lzxname"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:message><xsl:text>property has no name</xsl:text></xsl:message>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>
    
    <xsl:template match="property[@name='prototype' or @name='__ivars__' or @name='setters']" mode="parentpath">
        <xsl:apply-templates select="(ancestor::property)[1]" mode="parentpath"/>
    </xsl:template>
    
    <xsl:template match="property" mode="parentpath">
      <xsl:variable name="parent" select="(ancestor::property)[1]"/>
      <xsl:if test="$parent">
        <xsl:apply-templates select="$parent" mode="parentpath"/>
        <xsl:apply-templates select="$parent" mode="commonname"/>
        <xsl:text>.</xsl:text>
      </xsl:if>
    </xsl:template>
    
    <xsl:template match="property|initarg" mode="xref">
      <xsl:apply-templates select="." mode="parentpath"/>
      <xsl:apply-templates select="." mode="desc"/>
    </xsl:template>
    
    <!-- REFENTRY HELPERS -->
    
    <xsl:template name="describe-parameters">
      <segmentedlist>
        <title>Parameters</title>
        <xsl:processing-instruction name="dbhtml">list-presentation="table"</xsl:processing-instruction>
        <segtitle>Name</segtitle>
        <segtitle>Type</segtitle>
        <segtitle>Desc</segtitle>
        <xsl:for-each select="parameter">
          <seglistitem>
              <seg>
                <xsl:value-of select="@name"/>
              </seg>
              <seg>
                <xsl:if test="@type"><type role="javascript"><xsl:value-of select="@type"/></type></xsl:if>
              </seg>
              <seg>
              <xsl:if test="doc/text">
                <xsl:apply-templates select="doc/text" mode="doc2dbk"/>
              </xsl:if>
              </seg>
          </seglistitem>
        </xsl:for-each>
        <xsl:if test="returns">
          <seglistitem>
            <seg><emphasis>Returns</emphasis></seg>
            <seg><type role="javascript"><xsl:value-of select="@type"/></type></seg>
            <seg>
            <xsl:if test="returns/doc/text">
              <xsl:apply-templates select="returns/doc/text" mode="doc2dbk"/>
            </xsl:if>
            </seg>
          </seglistitem>
        </xsl:if>
      </segmentedlist>
    </xsl:template>
    
    <xsl:template name="describe-superclass-chain">
      <xsl:param name="class"/>
      <xsl:call-template name="describe-superclass-chain-inner">
        <xsl:with-param name="class" select="$class"/>
      </xsl:call-template>
      <xsl:call-template name="classlabel"/>
    </xsl:template>
    
    <xsl:template name="describe-superclass-chain-inner">
      <xsl:param name="class"/>
      <xsl:variable name="extends" select="$class/@extends"/>
      <xsl:variable name="superclass" select="(key('id',$extends) | key('name-lzx',$extends))[1]"/>
      <xsl:if test="$superclass">
        <xsl:choose>
          <xsl:when test="contains($visibility.filter, $superclass/@access)">
            <xsl:call-template name="describe-superclass-chain-inner">
              <xsl:with-param name="class" select="$superclass/class"/>
            </xsl:call-template>
            <xref linkend="{$superclass/@id}"/>
            <xsl:text>&nbsp;&raquo; </xsl:text>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="($superclass/@name | $superclass/doc/tag[@name='lzxname']/text)[1]"/>
            <xsl:text>&nbsp;(private)&nbsp;&raquo; </xsl:text>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
    </xsl:template>

    <xsl:template name="known-subclasses">
      <xsl:value-of select="key('superclass', @id)[&isvisible;]"/>
    </xsl:template>
    
    <xsl:template name="describe-known-subclasses">
      <!-- TODO [jgrandy 12/19/2006] two problems here:
             - could still show title even if no public subclasses are found
             - if last subclass is private, list will end with ", "
        -->
      <xsl:variable name="subclasses" select="key('superclass', @id)[&isvisible;]"/>
      <xsl:if test="$subclasses">
        <para>
        <xsl:text>Known Direct Subclasses: </xsl:text>
        <xsl:for-each select="$subclasses">
          <xsl:sort select="@id"/>
          <xref linkend="{@id}"/>
          <xsl:if test="position() != last()">
            <xsl:text>, </xsl:text>
          </xsl:if>
        </xsl:for-each>
        </para>
      </xsl:if>
    </xsl:template>
    
    <!-- ACCESS -->

    <xsl:template match="*[not(@access)]" mode="access">
      <xsl:message><xsl:text>node found without @access attribute</xsl:text></xsl:message>
      <xsl:value-of select="'unknown'"/>
    </xsl:template>

    <xsl:template match="*[@access]" mode="access">
       <xsl:value-of select="@access"/>
    </xsl:template>
     
    <!-- INDEX -->
    
    <xsl:template name="declaration-index-inner">
      <xsl:param name="name"/>
      <xsl:param name="altname"/>
      <xsl:variable name="sortas" select="translate($name,'_$','  ')"/>
      <indexterm zone="{@id}">
        <primary>
          <xsl:if test="$name != $sortas">
            <xsl:attribute name="sortas"><xsl:value-of select="$sortas"/></xsl:attribute>
          </xsl:if>
          <xsl:value-of select="$name"/>
        </primary>
        <secondary>Described</secondary>
        <xsl:if test="$altname">
          <seealso><xsl:value-of select="$altname"/></seealso>
        </xsl:if>
      </indexterm>
      <xsl:if test="$altname">
        <xsl:variable name="sortasalt" select="translate($altname,'_$','  ')"/>
        <indexterm zone="{@id}">
          <xsl:if test="$altname != $sortasalt">
            <xsl:attribute name="sortas"><xsl:value-of select="$sortasalt"/></xsl:attribute>
          </xsl:if>
          <primary><xsl:value-of select="$altname"/></primary>
          <see><xsl:value-of select="$name"/></see>
        </indexterm>
<?ignore
        <indexterm type="tags">
          <primary><xsl:value-of select="$lzxname"/></primary>
        </indexterm>
?>
      </xsl:if>
      <xsl:variable name="parentid" select="@unitid"/>
      <xsl:if test="$parentid">
        <xsl:variable name="visibility"><xsl:value-of select="key('id',$parentid)/@access"/></xsl:variable>
        <xsl:if test="contains($visibility.filter, $visibility)">
          <indexterm zone="{$parentid}">
            <primary>
              <xsl:if test="$name != $sortas">
                <xsl:attribute name="sortas"><xsl:value-of select="$sortas"/></xsl:attribute>
              </xsl:if>
              <xsl:value-of select="$name"/>
            </primary>
            <secondary>Declared in</secondary>
          </indexterm>
        </xsl:if>
      </xsl:if>
<?ignore
      <xsl:if test="contains(@keywords, 'deprecated')">
        <indexterm type="deprecated">
          <xsl:if test="$name != $sortas">
            <xsl:attribute name="sortas"><xsl:value-of select="$sortas"/></xsl:attribute>
          </xsl:if>
          <primary>
            <xsl:value-of select="$name"/>
          </primary>
        </indexterm>
      </xsl:if>
?>
    </xsl:template>
    
    <xsl:template name="declaration-index">
      <xsl:variable name="jsname" select="@name"/>
      <xsl:variable name="lzxname" select="&tagname;"/>
      <xsl:choose>
        <xsl:when test="$jsname and not(starts-with($jsname,'lz.'))">
          <!-- JavaScript name is primary -->
          <xsl:call-template name="declaration-index-inner">
            <xsl:with-param name="name" select="$jsname"/>
            <xsl:with-param name="altname" select="$lzxname"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:when test="$lzxname and $lzxname != ''">
          <!-- LZX name is primary -->
          <xsl:call-template name="declaration-index-inner">
            <xsl:with-param name="name" select="$lzxname"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:message><xsl:text>couldn't generate index for item with no name</xsl:text></xsl:message>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>

    <!-- MISC -->

    <xsl:template name="insert-refinfo">
      <variablelist>
      
        <xsl:if test="&tagname;">
          <varlistentry><term>LZX: <xsl:value-of select="&tagname;"/></term></varlistentry>
        </xsl:if>
        
        <xsl:if test="@name">
          <varlistentry><term>JavaScript: <xsl:value-of select="@name"/></term></varlistentry>
        </xsl:if>

        <xsl:variable name="decltype"><xsl:apply-templates select="." mode="type"/></xsl:variable>
        <xsl:if test="$decltype and $decltype != ''">
          <varlistentry><term>Type: <xsl:value-of select="$decltype"/></term></varlistentry>
        </xsl:if>

        <varlistentry><term>Access: <xsl:apply-templates select="." mode="access"/></term></varlistentry>

        <xsl:if test="contains(@keywords, 'deprecated') or contains(@keywords, 'preliminary') or contains(@keywords, 'beta')">
          <varlistentry><term>
          <xsl:text>Status:</xsl:text>
          <xsl:if test="contains(@keywords, 'deprecated')">&nbsp;Deprecated</xsl:if>
          <xsl:if test="contains(@keywords, 'preliminary') or contains(@keywords, 'beta')">&nbsp;Preliminary</xsl:if>
          </term></varlistentry>
        </xsl:if>

        <xsl:if test="@runtimes">
          <varlistentry><term>Runtimes: <xsl:value-of select="@runtimes"/></term></varlistentry>
        </xsl:if>

        <xsl:if test="@includebuilds">
          <varlistentry><term>Build Flags: <xsl:value-of select="@includebuilds"/></term></varlistentry>
        </xsl:if>

        <xsl:variable name="topic" select="@topic"/>
        <xsl:variable name="subtopic" select="@subtopic"/>
        <xsl:if test="$topic">
          <varlistentry><term>Topic: <xref linkend="{translate(concat('topic.',$topic,'.',$subtopic),' ','_')}"/></term></varlistentry>
        </xsl:if>

        <xsl:variable name="parentid" select="@unitid"/>
        <xsl:if test="$parentid">
          <xsl:variable name="visibility"><xsl:value-of select="key('id',$parentid)/@access"/></xsl:variable>
          <xsl:if test="contains($visibility.filter, $visibility)">
            <varlistentry><term>Declared in: <xref linkend="{$parentid}"/></term></varlistentry>
          </xsl:if>
        </xsl:if>

<?ignore
        <!-- need to turn path into webapp url, not sure how to do that -->
        <xsl:variable name="path" select="@path"/>
        <xsl:if test="$path and $path != ''">
          <xsl:variable name="pathurl" select="$pathurl"/>
          <varlistentry><term>Source: <ulink url="{$pathurl}"/></term></varlistentry>
        </xsl:if>
?>        
      </variablelist>

    </xsl:template>
    
    <xsl:template name="classlabel">
      <xsl:choose>
        <xsl:when test="&tagname;">
          <xsl:value-of select="&tagname;"/>
          <xsl:if test="@name and not(starts-with(@name,'lz.'))">
            <xsl:text>&nbsp;(</xsl:text><xsl:value-of select="@name"/><xsl:text>)</xsl:text>
          </xsl:if>
        </xsl:when>
        <xsl:when test="@name">
          <xsl:value-of select="@name"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:message><xsl:text>class without name or id: </xsl:text><xsl:value-of select="@id"/></xsl:message>
          <xsl:value-of select="@id"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>
    
</xsl:stylesheet>