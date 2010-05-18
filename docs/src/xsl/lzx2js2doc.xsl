<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2007-2008, 2010 Laszlo Systems, Inc.  All Rights Reserved.        *
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

]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:param name="base.dir"/>
    <xsl:param name="root.path"/>
    
    <xsl:output method="xml"
                indent="yes" />

    <xsl:template match="@*|node()">
    </xsl:template>
    
    <xsl:template match="/">
      <js2doc>
        <xsl:apply-templates>
          <xsl:with-param name="path" select="concat($root.path,'library.lzx')"/>
        </xsl:apply-templates>
      </js2doc>
    </xsl:template>

    <xsl:template match="/" mode="nested">
      <xsl:param name="path"/>
      <xsl:param name="unitid"/>
      <xsl:apply-templates>
        <xsl:with-param name="path" select="$path"/>
        <xsl:with-param name="unitid" select="$unitid"/>
      </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="library|canvas">
      <xsl:param name="path"/>
      <xsl:param name="unitid"/>
      <xsl:variable name="id" select="translate($path,'/ ','._')"/>
      <unit path="{$path}">
        <xsl:attribute name="id"><xsl:value-of select="$id"/></xsl:attribute>
        <xsl:if test="$unitid">
          <xsl:attribute name="unitid"><xsl:value-of select="$unitid"/></xsl:attribute>
        </xsl:if>
        <xsl:call-template name="processcomment"/>
      </unit>
      <xsl:apply-templates>
        <xsl:with-param name="path" select="$path"/>
        <xsl:with-param name="unitid" select="$id"/>
      </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="include">
      <xsl:param name="path"/>
      <xsl:param name="unitid"/>
      <xsl:if test="contains($path,'library.lzx')">  
        <!-- TODO [dda 2008-03-24] handle include href="../xxx/name.lzx"
             To do that, need to create a URI for the parent directory,
             and pass that as a second arg to document().
             For now, we require (for doc) that there be at least one
             'straight' include of each doc without ..
          -->
        <xsl:variable name="doc" select="document(@href)"/>
        <xsl:variable name="newpath" select="concat(substring-before($path,'library.lzx'),@href)"/>
        <xsl:apply-templates select="$doc" mode="nested">
          <xsl:with-param name="path" select="$newpath"/>
          <xsl:with-param name="unitid" select="$unitid"/>
        </xsl:apply-templates>
      </xsl:if>
    </xsl:template>

    <xsl:template match="class|interface|mixin">
      <xsl:param name="unitid"/>
      <xsl:variable name="jsname" select="concat('lz.', @name)"/>
      <xsl:variable name="id" select="$jsname"/>
      <property>
        <xsl:attribute name="name"><xsl:value-of select="$jsname"/></xsl:attribute>
        <xsl:attribute name="id"><xsl:value-of select="$id"/></xsl:attribute>
        <xsl:attribute name="unitid"><xsl:value-of select="$unitid"/></xsl:attribute>
        <xsl:call-template name="processcomment"/>
        <class>
          <xsl:if test="local-name(.)='class' or @extends">
            <xsl:attribute name="extends">
              <xsl:choose>
                <xsl:when test="@extends"><xsl:value-of select="@extends"/></xsl:when>
                <xsl:otherwise><xsl:text>LzView</xsl:text></xsl:otherwise>
              </xsl:choose>
            </xsl:attribute>
          </xsl:if>
          <xsl:if test="@with">
            <xsl:attribute name="inherits">
              <xsl:value-of select="@with"/>
            </xsl:attribute>
          </xsl:if>
          <xsl:variable name="methods" select="method"/>
          <xsl:variable name="events" select="event"/>
          <xsl:variable name="switches" select="switch"/>
          <xsl:if test="$methods | $events | $switches">
            <xsl:variable name="proto-id" select="concat($id, '.prototype')"/>
            <property name="prototype" id="{$proto-id}">
              <object>
                <xsl:apply-templates select="$methods">
                  <xsl:with-param name="parent-id" select="$proto-id"/>
                </xsl:apply-templates>
                <xsl:apply-templates select="$events">
                  <xsl:with-param name="parent-id" select="$proto-id"/>
                </xsl:apply-templates>
                <xsl:apply-templates select="$switches" mode="class-proto">
                  <xsl:with-param name="parent-id" select="$proto-id"/>
                </xsl:apply-templates>
              </object>
            </property>
          </xsl:if>
          <xsl:variable name="attrs" select="attribute"/>
          <xsl:if test="$attrs | $switches">
            <xsl:variable name="attrs-id" select="concat($id, '.__ivars__')"/>
            <property name="__ivars__">
              <xsl:attribute name="id"><xsl:value-of select="$attrs-id"/></xsl:attribute>
              <object>
                <xsl:apply-templates select="$attrs">
                  <xsl:with-param name="parent-id" select="$attrs-id"/>
                </xsl:apply-templates>
                <xsl:apply-templates select="$switches" mode="class-ivar">
                  <xsl:with-param name="parent-id" select="$attrs-id"/>
                </xsl:apply-templates>
              </object>
            </property>
          </xsl:if>
        </class>
      </property>
    </xsl:template>
    
    <xsl:template match="attribute">
      <xsl:param name="parent-id"/>
      <xsl:variable name="id" select="concat($parent-id, '.', @name)"/>
      <property name="{@name}" id="{$id}">
        <!-- TODO move this into <doc> or a bindings annex -->
        <xsl:call-template name="processcomment"/>
      </property>
    </xsl:template>
    
    <xsl:template match="event">
      <xsl:param name="parent-id"/>
      <xsl:variable name="id" select="concat($parent-id, '.', @name)"/>
      <property name="{@name}" id="{$id}" type="LzEvent" value="LzNullEvent">
        <xsl:call-template name="processcomment"/>
        <object/>
      </property>
    </xsl:template>
    
    <xsl:template match="method">
      <xsl:param name="parent-id"/>
      <xsl:variable name="id" select="concat($parent-id, '.', @name)"/>
      <property name="{@name}" id="{$id}">
        <xsl:call-template name="processcomment"/>
        <function>
          <xsl:if test="@args">
            <xsl:call-template name="processargs">
              <xsl:with-param name="args" select="normalize-space(@args)"/>
            </xsl:call-template>
          </xsl:if>
        </function>
      </property>
    </xsl:template>

    <xsl:template match="handler|method[@event and not(@name)]">
      <!-- we don't document handlers currently -->
    </xsl:template>
    
    <xsl:template match="script">
      <!-- TO DO: process through js2doc -->
    </xsl:template>
    
    <xsl:template match="switch|when|otherwise" mode="class-proto">
      <xsl:param name="parent-id"/>
      <xsl:apply-templates mode="class-proto">
        <xsl:with-param name="parent-id" select="$parent-id"/>
      </xsl:apply-templates>
    </xsl:template>

    <xsl:template match="method | event" mode="class-proto">
      <xsl:param name="parent-id"/>
      <xsl:apply-templates select=".">
        <xsl:with-param name="parent-id" select="$parent-id"/>
      </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="switch|when|otherwise" mode="class-ivar">
      <xsl:param name="parent-id"/>
      <xsl:apply-templates mode="class-ivar">
        <xsl:with-param name="parent-id" select="$parent-id"/>
      </xsl:apply-templates>
    </xsl:template>

    <xsl:template match="attribute" mode="class-ivar">
      <xsl:param name="parent-id"/>
      <xsl:apply-templates select=".">
        <xsl:with-param name="parent-id" select="$parent-id"/>
      </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="switch|when|otherwise">
      <!-- TO DO: manage the conditionals. For now we just pretend they
           don't exist -->
      <xsl:param name="unitid"/>
      <xsl:apply-templates>
        <xsl:with-param name="unitid" select="$unitid"/>
      </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="doc">
    </xsl:template>
    
    <xsl:template name="processcomment">
      <!-- thanks to http://www.biglist.com/lists/xsl-list/archives/200612/msg00422.html for this monster -->
      <xsl:variable name="preceding-comment" 
                  select="preceding-sibling::node()[not(self::text()[not(normalize-space())])][1][self::comment()]"/>
      <xsl:if test="substring($preceding-comment,1,1)='-'">
        <comment>
          <!-- Put into comment element rather than doc/text. We'll process this
               out into doc/tag/text elements as a post-processing step. -->
          <xsl:value-of select="substring($preceding-comment,2)"/>
        </comment>
      </xsl:if>
      <doc>
        <xsl:if test="self::class|self::interface|self::mixin">
          <xsl:if test="@name">
            <tag name="lzxname"><text><xsl:value-of select="@name"/></text></tag>
          </xsl:if>
        </xsl:if>
        <xsl:if test="@value">
          <xsl:choose>
            <!-- translate e.g. value="$immediately{null}" to value="null" when="immediately" -->
            <xsl:when test="substring(@value, 1, 1) = '$' and contains(@value, '{') and contains(@value, '}')">
              <tag name="lzxdefault"><text><xsl:value-of select="substring-after(substring-before(@value, '}'), '{')"/></text></tag>
              <!-- TODO [dda 2008-06-23] 'when' is not handled - maybe this should modify the 'category' shown in attributes? -->
              <tag name="lzxwhen"><text><xsl:value-of select="substring-before(substring(@value, 2), '{')"/></text></tag>
            </xsl:when>
            <xsl:otherwise>
              <tag name="lzxdefault"><text><xsl:value-of select="@value"/></text></tag>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:if>
        <xsl:choose>
          <xsl:when test="@type">
            <tag name="lzxtype"><text><xsl:value-of select="@type"/></text></tag>
          </xsl:when>
          <xsl:when test="self::event">
            <tag name="lzxtype"><text>event</text></tag>
          </xsl:when>
          <xsl:when test="self::attribute">
            <tag name="lzxtype"><text>expression</text></tag>
          </xsl:when>
        </xsl:choose>
        <xsl:if test="doc">
          <xsl:copy-of select="doc/*"/>
        </xsl:if>
      </doc>
    </xsl:template>
    
    <!--- precondition: args param has normalized space, is comma-separated,
          but each param may contain '=' to represent initializer -->
    <xsl:template name="processargs">
      <xsl:param name="args" select="''"/>
      <xsl:choose>
        <xsl:when test="contains($args, ',')">
          <xsl:variable name="first-arg" select="substring-before($args, ',')"/>
          <xsl:call-template name="process-one-arg">
            <xsl:with-param name="arg" select="$first-arg"/>
          </xsl:call-template>
          <xsl:call-template name="processargs">
            <xsl:with-param name="args" select="substring-after($args,',')"/>
          </xsl:call-template>
        </xsl:when>
        <!-- TO DO: ? handle case where contains($args,' ')? -->
        <xsl:otherwise>
          <xsl:call-template name="process-one-arg">
            <xsl:with-param name="arg" select="$args"/>
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>

    <xsl:template name="process-one-arg">
      <xsl:param name="arg"/>
      <xsl:choose>
        <xsl:when test="contains($arg, '=')">
          <parameter name="{normalize-space(substring-before($arg, '='))}"/>
          <!-- TODO [dda 2008-05-14] handle initializers for method args -->
        </xsl:when>
        <xsl:when test="contains($arg, '...')">
          <parameter name="{normalize-space(substring-after($arg, '...'))}"/>
        </xsl:when>
        <xsl:otherwise>
          <parameter name="{normalize-space($arg)}"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>
    
</xsl:stylesheet>
