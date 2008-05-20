<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
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
<!DOCTYPE xsl:stylesheet [

<!ENTITY nbsp  "&#160;">
<!ENTITY raquo "&#187;">

<!ENTITY tagname        '(doc/tag[@name="lzxname"]/text)'>
<!ENTITY shortdesc      '(doc/tag[@name="shortdesc"]/text)'>
<!ENTITY lzxtype        '(doc/tag[@name="lzxtype"]/text)'>
<!ENTITY lzxdefault     '(doc/tag[@name="lzxdefault"]/text)'>

<!ENTITY commonname     '(self::node()/@name | self::node()/doc/tag[@name="lzxname"]/text)[1]'>

<!ENTITY ispublic       '(@access="public")'>
<!ENTITY isvisible      '(contains($visibility.filter, @access))'>

<!ENTITY objectvalue    '(object|class|function)'>
<!ENTITY classvalue     '(class|function)'>
<!ENTITY privateslot    '(@name="prototype" or @name="__ivars__" or @name="dependencies" or @name="setters" or @name="tagname")'>

<!ENTITY readonly       '(@modifiers="readonly" or @modifiers="read-only" or @keywords="read-only" or @keywords="readonly")'>
<!ENTITY final          '(@modifiers="final" or @keywords="final")'>
<!ENTITY virtual        '(@modifiers="virtual" or @keywords="virtual")'>
<!ENTITY unwritable     '(@modifiers="readonly" or @modifiers="read-only" or @keywords="read-only" or @keywords="readonly" or @modifiers="final" or @keywords="final")'>

<!ENTITY isevent          '((doc/tag[@name="lzxtype"]/text) = "event" or @type="LzEvent")'>

]>

<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:import href="js2doc-comment2dbk.xsl"/>

    <xsl:import href="js2doc2dbk/utilities.xsl"/>
    <xsl:import href="js2doc2dbk/synopsis.xsl"/>

    <xsl:param name="visibility.filter" select="'public'"/>
    <xsl:param name="show.devnotes" select="contains($visibility.filter,'private')"/>
    <xsl:param name="show.fixmes" select="contains($visibility.filter,'private')"/>

    <!-- These params control the presentation of attributes, methods, and events
      using a javascript-oriented syntax and approach. -->
    <xsl:param name="show.members.attributes" select="true()" />
    <xsl:param name="show.properties.static" select="true()" />
    <xsl:param name="show.methods.static" select="true()" />
    <xsl:param name="show.events.static" select="true()" />
    <xsl:param name="show.inherited.attributes" select="true()" />
    <xsl:param name="show.setters" select="false()" />
    <xsl:param name="show.prototype.methods" select="true()" />
    <xsl:param name="show.prototype.events" select="true()" />
    <xsl:param name="show.prototype.properties" select="false()" />
    <xsl:param name="show.init.args" select="false()" />
    <xsl:param name="show.lzx.synopsis" select="false()" />
    <xsl:param name="show.js.synopsis" select="false()" />
    <xsl:param name="show.known.subclasses" select="true()" />

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

    <!-- This is the main template for generating the guts of the reference information
      for each class. [bshine 11.21.2007] -->
    <xsl:template match="property" mode="refentry">

      <xsl:variable name="jsname" select="@name"/>
      <xsl:variable name="lzxname" select="&tagname;"/>
      <xsl:variable name="desc">
        <xsl:apply-templates select="." mode="desc"/>
      </xsl:variable>

      <xsl:variable name="id-for-output">
        <xsl:choose>
          <xsl:when test="starts-with('lz', $jsname) and (string-length($jsname) = 2)">
            <xsl:text>lz.pseudopackage</xsl:text>
          </xsl:when>
          <xsl:when test="starts-with('Lz', $jsname) and (string-length($jsname) = 2)">
            <xsl:text>library.Lz</xsl:text>
          </xsl:when>
          <xsl:otherwise><xsl:value-of select="@id"/></xsl:otherwise>
        </xsl:choose>

      </xsl:variable>


      <refentry id="{$id-for-output}" xreflabel="{$desc}">
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
        <refsect1>
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
        <xsl:variable name="jsname" select="@name"/>
        <xsl:variable name="lzxname" select="&tagname;"/>
        <xsl:variable name="ivars" select="&objectvalue;/property[@name='__ivars__']/object/property[&isvisible;]"/>
        <xsl:variable name="svars" select="&objectvalue;/property[@name='setters']/object/property[&isvisible;]"/>
        <xsl:variable name="pvars" select="&objectvalue;/property[@name='prototype']/object/property[&isvisible;]"/>
        <xsl:variable name="ovars" select="&objectvalue;/property[not(&privateslot;) and &isvisible;]"/>
        <xsl:variable name="events" select="&objectvalue;/property[@name='__ivars__' or @name='prototype']/object/property[doc/tag[@name='lzxtype']/text = 'event' and &isvisible;]" />
        <xsl:variable name="initargs" select="class/initarg[not(contains(@access, 'private'))]" />




        <!-- Initialization Arguments -->
        <xsl:if test="$show.init.args">
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
        </xsl:if>

        <!-- Properties -->
        <xsl:if test="$show.members.attributes">
          <xsl:call-template name="describe-members">
            <xsl:with-param name="members" select="$ivars[not &isevent;] | $svars[not &isevent;]"/>
            <xsl:with-param name="title" select="'Attributes'"/>
            <xsl:with-param name="initargs" select="$initargs" />
            <xsl:with-param name="ivars" select="$ivars" />
            <xsl:with-param name="setters" select="$svars" />
          </xsl:call-template>
        </xsl:if>

        <!-- Static Properties -->
        <xsl:if test="$show.properties.static">
          <xsl:call-template name="describe-members">
            <xsl:with-param name="members" select="$ovars[not(child::function) and not(&isevent;)]"/>
            <xsl:with-param name="static" select="true()"/>
            <xsl:with-param name="title" select="'Class Attributes'"/>
            <xsl:with-param name="initargs" select="$initargs" />
            <xsl:with-param name="ivars" select="$ivars" />
            <xsl:with-param name="setters" select="$svars" />
          </xsl:call-template>
        </xsl:if>

        <!-- Inherited Attributes -->
        <xsl:if test="$show.inherited.attributes">
          <xsl:call-template name="describe-inherited-attributes">
            <xsl:with-param name="class" select="class"></xsl:with-param>
          </xsl:call-template>
        </xsl:if>

        <!-- Setters -->
        <xsl:if test="$show.setters">
          <xsl:call-template name="describe-members">
            <xsl:with-param name="members" select="$svars"/>
            <xsl:with-param name="title" select="'Setters'"/>
            <xsl:with-param name="subtitle">
              <xsl:text>Setters for virtual properties, to be used with setAttribute. A setter may or may not have a corresponding getter method; consult the Methods list in this section.</xsl:text>
            </xsl:with-param>
            <xsl:with-param name="describe-js" select="false()"/>
            <xsl:with-param name="describe-lzx" select="false()"/>
          </xsl:call-template>
        </xsl:if>

        <!-- (Prototype) Methods -->
        <xsl:if test="$show.prototype.methods">
          <xsl:call-template name="describe-members">
            <xsl:with-param name="members" select="$pvars[child::function]"/>
            <xsl:with-param name="title" select="'Methods'"/>
          </xsl:call-template>
        </xsl:if>

        <!-- Static Methods -->
        <xsl:if test="$show.methods.static">
          <xsl:call-template name="describe-members">
            <xsl:with-param name="members" select="$ovars[child::function]"/>
            <xsl:with-param name="static" select="true()"/>
            <xsl:with-param name="title" select="'Class Methods'"/>
          </xsl:call-template>
        </xsl:if>

        <!-- Inherited Methods -->
        <xsl:call-template name="describe-inherited-methods">
          <xsl:with-param name="class" select="class"></xsl:with-param>
        </xsl:call-template>

        <!-- (Prototype) Events -->
        <xsl:if test="$show.prototype.events">
          <xsl:call-template name="describe-events">
            <xsl:with-param name="members" select="$events"/>
            <xsl:with-param name="title" select="'Events'"/>
          </xsl:call-template>
        </xsl:if>

        <!-- Inherited Events -->
        <xsl:call-template name="describe-inherited-events">
          <xsl:with-param name="class" select="class"></xsl:with-param>
        </xsl:call-template>

        <!-- Static Events -->
        <xsl:if test="$show.events.static">
          <xsl:call-template name="describe-members">
            <xsl:with-param name="members" select="$ovars[@type='LzEvent']"/>
            <xsl:with-param name="static" select="true()"/>
            <xsl:with-param name="title" select="'Class Events'"/>
          </xsl:call-template>
        </xsl:if>

        <!-- Prototype Properties -->
        <xsl:if test="$show.prototype.properties">
          <xsl:call-template name="describe-members">
            <xsl:with-param name="members" select="$pvars[not(child::function) and not(@type='LzEvent')]"/>
            <xsl:with-param name="title" select="'Prototype Properties'"/>
          </xsl:call-template>
        </xsl:if>

      </refsect1>

      <!-- TODO [dda 2008-02-28] commented out 'known direct subclasses'.
           It can produce broken links and sometimes is shown when there
           none.  This section was not shown in 3.4 docs.

      <xsl:if test="$show.known.subclasses">
        <refsect1>
          <xsl:call-template name="describe-known-subclasses" />
        </refsect1>
      </xsl:if>
      -->

    </xsl:template>

    <xsl:template match="property" mode="detailed-synopsis">
        <xsl:variable name="jsname" select="@name"/>
        <xsl:variable name="lzxname" select="&tagname;"/>
        <xsl:if test="$lzxname and $show.lzx.synopsis">
          <refsect1><title>LZX Synopsis</title>
            <xsl:apply-templates select="." mode="synopsis">
              <xsl:with-param name="add-link" select="false()"/>
              <xsl:with-param name="add-sublink" select="true()"/>
              <xsl:with-param name="verbose" select="true()"/>
              <xsl:with-param name="language" select="'lzx'" />
            </xsl:apply-templates>
          </refsect1>
        </xsl:if>
        <xsl:if test="$jsname and $show.js.synopsis">
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
    <xsl:param name="setters" />
    <xsl:param name="ivars" />
    <xsl:param name="initargs"/>
    <xsl:choose>
      <xsl:when test="contains($title,  'Attributes')">
        <xsl:call-template name="describe-members-grid">
          <xsl:with-param name="members" select="$members"/>
          <xsl:with-param name="static" select="$static"/>
          <xsl:with-param name="title" select="$title"/>
          <xsl:with-param name="subtitle" select="$subtitle"/>
          <xsl:with-param name="describe-js" select="$describe-js" />
          <xsl:with-param name="describe-lzx" select="$describe-lzx" />
          <xsl:with-param name="setters" select="$setters"/>
          <xsl:with-param name="ivars" select="$ivars"/>
          <xsl:with-param name="initargs" select="$initargs"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="describe-members-list">
          <xsl:with-param name="members" select="$members"/>
          <xsl:with-param name="static" select="$static"/>
          <xsl:with-param name="title" select="$title"/>
          <xsl:with-param name="subtitle" select="$subtitle"/>
          <xsl:with-param name="describe-js" select="$describe-js" />
          <xsl:with-param name="describe-lzx" select="$describe-lzx" />
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="describe-members-list">
    <xsl:param name="members"/>
    <xsl:param name="static"/>
    <xsl:param name="title"/>
    <xsl:param name="subtitle"/>
    <xsl:param name="describe-js" select="boolean(@name)"/>
    <xsl:param name="describe-lzx" select="boolean(&tagname;)"/>
    <xsl:variable name="visible-members" select="$members[contains($visibility.filter,@access)]"/>
    <xsl:if test="count($visible-members) > 0">
      <variablelist>
        <title><xsl:value-of select="$title"/></title>
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

  <xsl:template name="describe-members-grid">
    <xsl:param name="members"/>
    <xsl:param name="static"/>
    <xsl:param name="title"/>
    <xsl:param name="subtitle"/>
    <xsl:param name="describe-js" select="boolean(@name)"/>
    <xsl:param name="describe-lzx" select="boolean(&tagname;)"/>
    <xsl:param name="setters" />
    <xsl:param name="ivars" />
    <xsl:param name="initargs" />

    <xsl:variable name="visible-members" select="$members[contains($visibility.filter,@access)]"/>
    <xsl:if test="count($visible-members) > 0">
      <variablelist>
        <title><link linkend="info-attributes"><xsl:value-of select="$title"/></link></title>
        <informaltable frame="none" pgwide="1">
          <tgroup cols="5" colsep="0" rowsep="0">
            <colspec colname="Name" colwidth="1*" />
            <colspec colname="TypeTag" colwidth="1*" />
            <colspec colname="TypeJS" colwidth="1*" />
            <colspec colname="Default" colwidth="1*" />
            <colspec colname="Category" colwidth="1*" />
            <thead>
              <row>
                <entry align="left">Name</entry>
                <entry align="left">Type (tag)</entry>
                <entry align="left">Type (js)</entry>
                <entry align="left">Default</entry>
                <entry align="left">Category</entry>
              </row>
            </thead>
            <tbody>
              <xsl:for-each select="$visible-members">
                <xsl:sort select="translate(@name,'_$','  ')"/>
                <xsl:call-template name="member-data-row">
                  <xsl:with-param name="setters" select="$setters"></xsl:with-param>
                  <xsl:with-param name="ivars" select="$ivars"></xsl:with-param>
                  <xsl:with-param name="initargs" select="$initargs"></xsl:with-param>
                </xsl:call-template>
              </xsl:for-each>
            </tbody>
          </tgroup>
        </informaltable>
      </variablelist>
    </xsl:if>
  </xsl:template>

  <xsl:template name="describe-events">
    <xsl:param name="members"/>
    <xsl:param name="title"/>
    <xsl:param name="static" select="false()"/>
    <xsl:param name="describe-js" select="true()"/>
    <xsl:param name="describe-lzx" select="true()"/>
    <xsl:variable name="visible-members" select="$members[contains($visibility.filter,@access)]"/>
    <xsl:variable name="desc">
      <xsl:apply-templates select="." mode="desc"/>
    </xsl:variable>
    <xsl:variable name="xref">
      <xsl:apply-templates select="." mode="xref"/>
    </xsl:variable>

    <xsl:if test="count($visible-members) > 0">
      <variablelist>
        <title>Events</title>
        <informaltable frame="none">
          <tgroup cols="2" colsep="0" rowsep="0">
            <colspec colname="Name" colwidth="1*" />
            <colspec colname="Description"  colwidth="4*"/>
            <thead>
              <row>
                <entry align="left">Name</entry>
                <entry align="left">Description</entry>
              </row>
            </thead>
            <tbody>
              <xsl:for-each select="$visible-members">
                <xsl:sort select="translate(@name,'_$','  ')"/>
                <row>
                  <entry>
                    <indexterm zone="{@id}" id="{@id}">
                      <primary>
                        <xsl:value-of select="@name"/>
                      </primary>
                    </indexterm>
                    <literal>
                      <xsl:value-of select="@name"/>
                    </literal>
                  </entry>
                  <!-- Important this appears on one line see: http://www.docbook.org/tdg/en/html/entry.html -->
                  <entry><xsl:apply-templates select="doc/text" mode="doc2dbk"/></entry>
                </row>
              </xsl:for-each>
            </tbody>
          </tgroup>
        </informaltable>
      </variablelist>
    </xsl:if>
  </xsl:template>

    <xsl:template match="initarg|property" mode="describe-member">
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
          <!-- TODO [dda 2008-05-14] handle postprocess tags in
               docbook.  We need to inject certain HTML formatting
               that is hard to work out in docbook/XSL in a timely
               manner.  The technique is to put a
               <para role="postprocess-XXXX"> tag in place, let
               docbook warn us about it (but leave a doctored version
               in place), and then a ruby script, postprocess.rb, does
               a final clean up pass by locating and replacing the
               doctored postprocess tags.

               The postprocess-methodname tag puts a grey background
               against the method name and stretches it the entire width.
            -->
          <para role="postprocess-methodname">
            <xsl:value-of select="$desc"/>
          </para>
        </term>
        <listitem>
            <refsect3>
              <!-- this prints the name and function parameters with types, ie, callMyMethod( doit: Boolean ) -->
              <xsl:apply-templates select="." mode="synopsis">
                <xsl:with-param name="add-link" select="false()"/>
                <xsl:with-param name="static" select="$static"/>
                <xsl:with-param name="language" select="'javascript'" />
              </xsl:apply-templates>
            </refsect3>
          <xsl:if test="doc/text">
            <refsect3>
              <xsl:apply-templates select="doc/text" mode="doc2dbk"/>
            </refsect3>
          </xsl:if>
          <xsl:if test="function/parameter">
            <refsect3>
              <informaltable frame="none" pgwide="1">
                <tgroup cols="3" colsep="0" rowsep="0">
                  <colspec colname="Name" colwidth="1*" />
                  <colspec colname="Type" colwidth="1*" />
                  <colspec colname="Description" colwidth="3*" />
                  <thead>
                    <row>
                      <entry align="left">Parameter Name</entry>
                      <entry align="left">Type</entry>
                      <entry align="left">Description</entry>
                    </row>
                  </thead>
                  <tbody>
                    <xsl:for-each select="function/parameter">
                      <row>
                        <entry>
                          <emphasis role="bold">
                            <xsl:value-of select="@name"/>
                          </emphasis>
                        </entry>
                        <entry><xsl:value-of select="@type"/></entry>
                        <!-- Important this appears on one line see: http://www.docbook.org/tdg/en/html/entry.html -->
                        <entry><xsl:apply-templates select="doc/text" mode="doc2dbk"/></entry>
                      </row>
                    </xsl:for-each>
                  </tbody>
                </tgroup>
              </informaltable>
              </refsect3>
          </xsl:if>
          <xsl:if test="function/returns">
            <refsect3>
              <informaltable frame="none" pgwide="1">
                <tgroup cols="3" colsep="0" rowsep="0">
                  <colspec colname="Returns" colwidth="1*" />
                  <colspec colname="Type" colwidth="1*" />
                  <colspec colname="Description" colwidth="3*"  />
                  <thead>
                    <row>
                      <entry align="left">Returns</entry>
                      <entry align="left">Type</entry>
                      <entry align="left">Description</entry>
                    </row>
                  </thead>
                  <tbody>
                    <row>
                      <!-- There is no 'name' for a return type -->
                      <entry>&nbsp;</entry>
                      <entry><xsl:value-of select="function/returns/@type"/></entry>
                      <!-- Important this appears on one line see: http://www.docbook.org/tdg/en/html/entry.html -->
                      <entry><xsl:apply-templates select="function/returns/doc/text" mode="doc2dbk"/></entry>
                    </row>
                  </tbody>
                </tgroup>
              </informaltable>
            </refsect3>
          </xsl:if>
          <refsect3>
            <!-- The postprocess-method-end tag puts an hrule after the method.
                 See also 'handle postprocess tags' comment.  -->
            <para role="postprocess-method-end"/>
          </refsect3>
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

    <!-- This template is unused. [bshine 2007.11.16] -->
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
    </xsl:template>

    <xsl:template name="describe-superclass-chain-inner">
      <xsl:param name="class"/>
      <xsl:variable name="extends" select="$class/@extends"/>
      <xsl:variable name="superclass" select="(key('id',$extends) | key('name-lzx',$extends))[1]"/>
      <xsl:if test="$superclass">
        <xsl:choose>
          <xsl:when test="contains($visibility.filter, $superclass/@access)">
            <xref linkend="{$superclass/@id}"/>
            <xsl:text>&nbsp;&raquo; </xsl:text>
            <xsl:call-template name="describe-superclass-chain-inner">
              <xsl:with-param name="class" select="$superclass/class"/>
            </xsl:call-template>
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

    <xsl:template name="describe-mixin-chain">
      <xsl:param name="mixins"/>
      <xsl:if test="$mixins != ''">
      <xsl:choose>
        <xsl:when test="contains($mixins, ',')">
          <xsl:call-template name="describe-mixin-chain">
            <xsl:with-param name="mixins" select="substring-before($mixins,',')"/>
          </xsl:call-template>
          <xsl:text>,&nbsp;</xsl:text>
          <xsl:call-template name="describe-mixin-chain">
            <xsl:with-param name="mixins" select="substring-after($mixins,',')"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="show-super-link">
            <xsl:with-param name="superclass" select="(key('id',$mixins) | key('name-lzx',$mixins))[1]"/>
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
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

      <xsl:if test="@name">
        <refsect1>
          <xsl:text>JavaScript: </xsl:text><xsl:value-of select="@name"/>
        </refsect1>
      </xsl:if>

      <xsl:if test="@runtimes">
        <refsect1>
          <xsl:text>Runtimes: </xsl:text> <xsl:value-of select="@runtimes"/>
        </refsect1>
      </xsl:if>

      <xsl:if test="child::class[@extends]">
        <refsect1>
          <xsl:text>extends </xsl:text>
          <xsl:call-template name="describe-superclass-chain">
            <xsl:with-param name="class" select="child::class"/>
          </xsl:call-template>
        </refsect1>
      </xsl:if>
      <xsl:if test="child::class/@inherits">
        <xsl:variable name="inheritslist" select="child::class/@inherits"/>
        <refsect1>
          <xsl:text>with </xsl:text>
          <xsl:call-template name="describe-mixin-chain">
            <xsl:with-param name="mixins" select="$inheritslist"/>
          </xsl:call-template>
        </refsect1>
      </xsl:if>


      <?ignore
        <!-- need to turn path into webapp url, not sure how to do that -->
        <xsl:variable name="path" select="@path"/>
        <xsl:if test="$path and $path != ''">
        <xsl:variable name="pathurl" select="$pathurl"/>
        <varlistentry><term>Source: <ulink url="{$pathurl}"/></term></varlistentry>
        </xsl:if>
      ?>
  </xsl:template>

    <xsl:template name="classlabel">
      <xsl:choose>
        <xsl:when test="&tagname;">
          <xsl:text>&lt;</xsl:text>
          <xsl:value-of select="&tagname;"/>
          <xsl:text>&gt;</xsl:text>
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

  <xsl:template name="show-super-link">
    <xsl:param name="superclass"/>
    <xsl:choose>
      <xsl:when test="contains($visibility.filter, $superclass/@access)">
        <!-- if visible, show it with a link -->
        <link linkend="{$superclass/@id}">
          <xsl:choose>
            <xsl:when test="$superclass/doc/tag[@name='lzxname']/text">
              <xsl:text>&lt;</xsl:text>
              <xsl:value-of select="$superclass/doc/tag[@name='lzxname']/text"/>
              <xsl:text>&gt;</xsl:text>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="$superclass/@name"/>
            </xsl:otherwise>
          </xsl:choose>
        </link>
      </xsl:when>
      <xsl:otherwise>
        <!-- not visible, show the name but without a link -->
        <xsl:choose>
          <xsl:when test="$superclass/doc/tag[@name='lzxname']/text">
            <xsl:text>&lt;</xsl:text>
            <xsl:value-of select="$superclass/doc/tag[@name='lzxname']/text"/>
            <xsl:text>&gt;</xsl:text>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="$superclass/@name"/>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:text>&nbsp;(private)&nbsp;</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
</xsl:template>

  <!-- iterate-inherited($values,$memberkind)
       For each classname in the comma separated $values list, call one of
       describe-inherited-{methods,attributes,events}-for
       with the contents of the class.  The implementation breaks up the list
       at first comma and calls recursively.
       @param $values : a comma separated list of classnames to show
                         inheritance from, entries may be blank.
                         e.g. 'LzView,LzFormatter' or 'LzMiniNode,'
       @param $memberkind : one of 'methods', 'attributes', 'events'
    -->
  <xsl:template name="iterate-inherited">
    <xsl:param name="values"/>
    <xsl:param name="memberkind"/>
    <xsl:if test="$values != ''">
      <xsl:choose>
        <xsl:when test="contains($values, ',')">
          <xsl:call-template name="iterate-inherited">
            <xsl:with-param name="values" select="substring-before($values,',')"/>
            <xsl:with-param name="memberkind" select="$memberkind"/>
          </xsl:call-template>
          <xsl:call-template name="iterate-inherited">
            <xsl:with-param name="values" select="substring-after($values,',')"/>
            <xsl:with-param name="memberkind" select="$memberkind"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:choose>
            <xsl:when test="$memberkind = 'methods'">
              <xsl:call-template name="describe-inherited-methods-for">
                <xsl:with-param name="superclass" select="(key('id',$values) | key('name-lzx',$values))[1]"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:when test="$memberkind = 'attributes'">
              <xsl:call-template name="describe-inherited-attributes-for">
                <xsl:with-param name="superclass" select="(key('id',$values) | key('name-lzx',$values))[1]"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:when test="$memberkind = 'events'">
              <xsl:call-template name="describe-inherited-events-for">
                <xsl:with-param name="superclass" select="(key('id',$values) | key('name-lzx',$values))[1]"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
            </xsl:otherwise>
          </xsl:choose>

        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <xsl:template name="describe-inherited-attributes">
    <xsl:param name="class"/>

    <xsl:variable name="jsname" select="@name"/>
    <xsl:variable name="lzxname" select="&tagname;"/>

    <xsl:variable name="extends" select="$class/@extends"/>
    <xsl:variable name="inheritslist" select="$class/@inherits"/>
     <xsl:call-template name="iterate-inherited">
       <xsl:with-param name="values" select="concat($inheritslist,',',$extends)"/>
       <xsl:with-param name="memberkind" select="'attributes'"/>
     </xsl:call-template>
  </xsl:template>

  <xsl:template name="describe-inherited-attributes-for">
    <xsl:param name="superclass"/>
    <xsl:if test="$superclass">
      <xsl:variable name="inheritedattrs" select="$superclass/class/property[@name='__ivars__']/object/property[@access='public']"></xsl:variable>
      <xsl:variable name="allinheritedattrs" select="$inheritedattrs[not &isevent;]" />
      <xsl:if test="count($allinheritedattrs) > 0">
       <refsect2>
        <title>
          <xsl:text>Attributes inherited from&nbsp;</xsl:text>
          <xsl:call-template name="show-super-link">
            <xsl:with-param name="superclass" select="$superclass"/>
          </xsl:call-template>
        </title>
        <para>
          <xsl:for-each select="$allinheritedattrs">
            <xsl:sort select="@name"/>
            <!-- even if attributes are public, if the class is not, there will
                 be no class page to link to, so link must not appear -->
            <xsl:choose>
              <xsl:when test="contains($visibility.filter, $superclass/@access)">
                <link linkend="{@id}"><xsl:value-of select="@name"/></link>
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="@name"/>
              </xsl:otherwise>
            </xsl:choose>
            <xsl:if test="position() != last()">
              <xsl:text>, </xsl:text>
            </xsl:if>
          </xsl:for-each>
        </para>
       </refsect2>
      </xsl:if>
      <xsl:choose>
        <xsl:when test="contains($visibility.filter, $superclass/@access)">
          <xsl:call-template name="describe-inherited-attributes">
            <xsl:with-param name="class" select="$superclass/class"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="($superclass/@name | $superclass/doc/tag[@name='lzxname']/text)[1]"/>
          <xsl:text>&nbsp;(private)&nbsp;&raquo; </xsl:text>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>

  </xsl:template>


  <xsl:template name="describe-inherited-methods">
    <xsl:param name="class"/>

    <xsl:variable name="jsname" select="@name"/>
    <xsl:variable name="lzxname" select="&tagname;"/>

    <xsl:variable name="extends" select="$class/@extends"/>
    <xsl:variable name="inheritslist" select="$class/@inherits"/>

     <xsl:call-template name="iterate-inherited">
       <xsl:with-param name="values" select="concat($inheritslist,',',$extends)"/>
       <xsl:with-param name="memberkind" select="'methods'"/>
     </xsl:call-template>
  </xsl:template>


  <xsl:template name="describe-inherited-methods-for">
    <xsl:param name="superclass"/>

    <xsl:if test="$superclass">
      <xsl:variable name="inheritedmethods" select="$superclass/class/property/object/property[@access='public']/function"></xsl:variable>
      <xsl:if test="count($inheritedmethods) > 0">
       <refsect2>
        <title>
          <xsl:text>Methods inherited from&nbsp;</xsl:text>
          <xsl:call-template name="show-super-link">
            <xsl:with-param name="superclass" select="$superclass"/>
          </xsl:call-template>
        </title>
        <para>
          <xsl:for-each select="$inheritedmethods">
            <xsl:sort select="../@name"/>
            <!-- even if methods are public, if the class is not, there will
                 be no class page to link to, so link must not appear -->
            <xsl:choose>
              <xsl:when test="contains($visibility.filter, $superclass/@access)">
                <link linkend="{../@id}"><xsl:value-of select="../@name"/></link>
              </xsl:when>
              <xsl:otherwise>
               <xsl:value-of select="../@name"/>
              </xsl:otherwise>
            </xsl:choose>
            <xsl:if test="position() != last()">
              <xsl:text>, </xsl:text>
            </xsl:if>
          </xsl:for-each>
        </para>
       </refsect2>
      </xsl:if>
      <xsl:choose>
        <xsl:when test="contains($visibility.filter, $superclass/@access)">
          <xsl:call-template name="describe-inherited-methods">
            <xsl:with-param name="class" select="$superclass/class"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="($superclass/@name | $superclass/doc/tag[@name='lzxname']/text)[1]"/>
          <xsl:text>&nbsp;(private)&nbsp;&raquo; </xsl:text>
        </xsl:otherwise>
      </xsl:choose>

    </xsl:if>

  </xsl:template>


  <xsl:template name="describe-inherited-events">
    <xsl:param name="class"/>

    <xsl:variable name="jsname" select="@name"/>
    <xsl:variable name="lzxname" select="&tagname;"/>

    <xsl:variable name="extends" select="$class/@extends"/>
    <xsl:variable name="inheritslist" select="$class/@inherits"/>

     <xsl:call-template name="iterate-inherited">
       <xsl:with-param name="values" select="concat($inheritslist,',',$extends)"/>
       <xsl:with-param name="memberkind" select="'events'"/>
     </xsl:call-template>
  </xsl:template>

  <xsl:template name="describe-inherited-events-for">
    <xsl:param name="superclass"/>

    <xsl:if test="$superclass">
      <xsl:variable name="inheritedevents" select="$superclass/class/property/object/property[doc/tag[@name='lzxtype']/text = 'event'  and &ispublic;]"></xsl:variable>

      <xsl:if test="count($inheritedevents) > 0">
       <refsect2>
        <title>
          <xsl:text>Events inherited from&nbsp;</xsl:text>
          <xsl:call-template name="show-super-link">
            <xsl:with-param name="superclass" select="$superclass"/>
          </xsl:call-template>
        </title>
        <para>
          <xsl:for-each select="$inheritedevents">
            <xsl:sort select="@name" />
            <!-- even if eventss are public, if the class is not, there will
                 be no class page to link to, so link must not appear -->
            <xsl:choose>
              <xsl:when test="contains($visibility.filter, $superclass/@access)">
                <link linkend="{@id}"><xsl:value-of select="@name"/></link>
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="@name"/>
              </xsl:otherwise>
            </xsl:choose>
            <xsl:if test="position() != last()">
              <xsl:text>, </xsl:text>
            </xsl:if>
          </xsl:for-each>
        </para>
       </refsect2>
      </xsl:if>
      <xsl:choose>
        <xsl:when test="contains($visibility.filter, $superclass/@access)">
          <xsl:call-template name="describe-inherited-events">
            <xsl:with-param name="class" select="$superclass/class"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="($superclass/@name | $superclass/doc/tag[@name='lzxname']/text)[1]"/>
          <xsl:text>&nbsp;(private)&nbsp;&raquo; </xsl:text>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <xsl:template name="member-data-row">
    <xsl:param name="describe-js" select="true()"/>
    <xsl:param name="describe-lzx" select="true()"/>
    <xsl:param name="setters"/>
    <xsl:param name="ivars" />
    <xsl:param name="initargs" />

    <xsl:variable name="jsname" select="@name"/>
    <xsl:variable name="lzxname" select="&tagname;"/>
    <xsl:variable name="name" select="&commonname;"/>

    <!-- checks for membership in the set of instance variables -->
    <xsl:variable name="isinstancevar" select="count ($ivars[@name=$jsname] ) > 0"/>

    <!-- checks for memebership in the set of initargs -->
    <xsl:variable name="isinitarg" select="count( $initargs[@name=$jsname] ) > 0" />

    <!-- checks whether a setter exists that sets this attribute. -->
    <xsl:variable name="hassetter" select="count( $setters[@name=$jsname] ) > 0" />

    <!-- Check whether the current node is a setter. This is different from
      asking whether it *has* a setter; this refers to its place in the DOM,
      not just whether it's a member of a set. -->
    <xsl:variable name="issetter" select="count( ancestor::property[@name='setters'] ) > 0" />




    <xsl:choose>
      <xsl:when test="$hassetter and not($issetter) and $isinstancevar">
        <!-- If there is a setter, but this isn't it, then show this one's doc.
          This makes use show the instance variable, not the setter, because
          the instance variable usually has better doc. -->
        <xsl:call-template name="unique-attribute">
          <xsl:with-param name="issetter" select="false()"></xsl:with-param>
          <xsl:with-param name="isinstancevar" select="$isinstancevar"></xsl:with-param>
          <xsl:with-param name="isinitarg" select="$isinitarg"></xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:when test="$hassetter and $issetter and $isinstancevar">
        <!-- This is the setter that goes with an instance variable.
          Don't output it, because we just want to show the instance variable,
          not the setter. -->
      </xsl:when>
      <xsl:when test="$hassetter and not($issetter) and not($isinstancevar)">
        <!-- TROUBLE. If we've got a setter, but this isn't it, then this should
          be an instance variable. Otherwise it's weird. We'll output it
          as a non-setter attribute, and see what happens.
        I suspect this is where LzView.clip and LzView.stretches go. -->
        <xsl:message>Warning on attribute list in member-data-row:
          <xsl:value-of select="$jsname"/> has a setter, but is neither a setter nor an instance variable.
        </xsl:message>
        <xsl:call-template name="unique-attribute">
          <xsl:with-param name="issetter" select="$issetter"></xsl:with-param>
          <xsl:with-param name="isinstancevar" select="$isinstancevar"></xsl:with-param>
          <xsl:with-param name="isinitarg" select="$isinitarg"></xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <!-- This handles all the cases where there is no setter. It's easy, we just
          pass it through to the unique-attribute template. (If an attribute does
          turn up more than once, then it's an error of a kind we haven't thought of yet.
          Maybe initarg.
        -->
        <xsl:call-template name="unique-attribute">
          <xsl:with-param name="issetter" select="$issetter"></xsl:with-param>
          <xsl:with-param name="isinstancevar" select="$isinstancevar"></xsl:with-param>
          <xsl:with-param name="isinitarg" select="$isinitarg"></xsl:with-param>
        </xsl:call-template>
      </xsl:otherwise>
      </xsl:choose>
  </xsl:template>

  <xsl:template name="unique-attribute">
    <xsl:param name="issetter" select="false()"></xsl:param>
    <xsl:param name="isinstancevar" select="true()"></xsl:param>
    <xsl:param name="isinitarg" select="false()"></xsl:param>

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

    <!-- don't generate a term if this is an event -->
    <xsl:if test="not(&isevent;)">
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
    </xsl:if>
    <row>
      <entry role="attrname">
        <literal>
          <xsl:value-of select="@name"/>
        </literal>
      </entry>
      <entry role="attrlzxtype">
        <xsl:value-of select="&lzxtype;" />
      </entry>
      <entry role="attrjstype">
        <xsl:call-template name="jstype">
          <xsl:with-param name="tag" select="'type'"/>
        </xsl:call-template>
      </entry>
      <entry role="attrdefault">
        <xsl:value-of select="&lzxdefault;" />
      </entry>
      <!-- The code here begins to implement the "new" specification for
           describing attribute categories: read-only, read/write, initialize-only,
           and special.
           The breakdown implemented below does not print those keywords,
           because (now that I'm writing the code) those keywords don't seem
           to entirely fit. Or maybe they fit but I can't figure out how to
           map what I know about the attributes to those keywords. I am
           here printing out what I think is useful information from the
           metadata about these attributes that I do have.
           [bshine 2007.11.04]
      -->
      <entry role="attrcat">
        <xsl:choose>
          <xsl:when test="&final; and ($isinstancevar or $isinitarg)">initialize-only</xsl:when>
          <xsl:when test="&readonly;">readonly</xsl:when>
          <xsl:when test="not(&unwritable;) and $isinstancevar">read/write</xsl:when>
          <xsl:when test="not(&unwritable;) and &virtual;">read/write (virtual)</xsl:when>
          <xsl:when test="not(&unwritable;) and not($isinstancevar) and not($issetter)">
            <!-- happens when an old style class is encountered -->
            <xsl:message>
              Unknown attribute category (no setter) for <xsl:value-of select="/ancestor-or-self::property//@id" /> : <xsl:value-of select="@name" />
            </xsl:message>
            unknown
          </xsl:when>
          <xsl:when test="not(&unwritable;) and not($isinstancevar) and $issetter">
            <!-- usually happens when there is a setter with no declared var -->
            <xsl:message>
              Unknown attribute category (has setter with no var) for <xsl:value-of select="ancestor-or-self::property//@id" /> : <xsl:value-of select="@name" />
            </xsl:message>
            has setter
          </xsl:when>
          <xsl:otherwise>
            <xsl:message>
              Unknown attribute category (otherwise) for <xsl:value-of select="ancestor-or-self::property//@id" /> : <xsl:value-of select="@name" />
            </xsl:message>
            <xsl:if test="&final;">final</xsl:if>
            <xsl:if test="&readonly;">readonly</xsl:if>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:if test="&isevent;">
          event
        </xsl:if>
      </entry>
    </row>
    <!-- Always emit this row so we can style it to separate attributes -->
    <row rowsep="1">
      <entry role="attrdesc">&nbsp;</entry>
      <!-- Important this appears on one line see: http://www.docbook.org/tdg/en/html/entry.html -->
      <entry role="attrdesc" namest="TypeTag" nameend="Category"><xsl:if test="doc/text"><xsl:apply-templates select="doc/text" mode="doc2dbk"/></xsl:if></entry>
    </row>
  </xsl:template>

</xsl:stylesheet>
