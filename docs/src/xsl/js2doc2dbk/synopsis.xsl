<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2007-2008, 2010 Laszlo Systems, Inc.  All Rights Reserved.        *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

<!ENTITY nbsp  "&#160;">
<!ENTITY raquo "&#187;">

<!ENTITY tagname        '(doc/tag[@name="lzxname"]/text)'>
<!ENTITY shortdesc      '(doc/tag[@name="shortdesc"]/text)'>
<!ENTITY lzxtype        '(doc/tag[@name="lzxtype"]/text)'>
<!ENTITY lzxdefault     '(doc/tag[@name="lzxdefault"]/text)'>

<!ENTITY objectvalue    '(object|class|function)'>
<!ENTITY classvalue     '(class|function)'>
<!ENTITY privateslot    '(@name="prototype" or @name="__ivars__" or @name="dependencies" or @name="setters" or @name="tagname")'>

<!ENTITY isvisible      '(contains($visibility.filter, @access))'>


]>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:import href="utilities.xsl"/>

    <xsl:param name="visibility.filter" select="'public'"/>
    <xsl:param name="warn.classname.not.found" select="0" />  

    <!-- SYNOPSIS -->

    <xsl:template match="property[child::class]" mode="synopsis">
      <xsl:param name="language" select="'javascript'"/>
      <xsl:param name="add-link"/>
      <xsl:param name="add-sublink"/>
      <xsl:param name="verbose" select="true()"/>
      <xsl:variable name="classid" select="@id"/>
        <classsynopsis language="{$language}"> 
          <!-- TODO add @class back in to denote interface/mixin -->
          <ooclass>
            <xsl:if test="@access"><modifier><xsl:value-of select="@access"/></modifier></xsl:if>
            <xsl:if test="@modifiers">
              <xsl:call-template name="insert-modifiers">
                <xsl:with-param name="modifiers" select="@modifiers"/>
              </xsl:call-template>
            </xsl:if>
            <xsl:apply-templates select="." mode="classref">
              <xsl:with-param name="add-link" select="$add-link"/>
            </xsl:apply-templates>
          </ooclass>
          
          <xsl:variable name="extends" select="class/@extends"/>
          <xsl:variable name="superclass" select="(key('id',$extends) | key('name-lzx',$extends))[1]"/>
          <xsl:if test="$superclass">
            <ooclass role="extends">
              <xsl:apply-templates select="$superclass" mode="classref">
                <xsl:with-param name="add-link" select="$add-sublink"/>
              </xsl:apply-templates>
            </ooclass>
          </xsl:if>
          <!-- TODO add another ooclass for each interface & mixin -->

          <xsl:choose>
            <xsl:when test="$verbose">
              <xsl:variable name="ivars" select="class/property[@name='__ivars__']/object/property[&isvisible;]"/>
              <xsl:variable name="pvars" select="class/property[@name='prototype']/object/property[&isvisible;]"/>
              <xsl:variable name="ovars" select="class/property[not(&privateslot;) and &isvisible;]"/>
              <xsl:if test="count($ovars) > 0">
                <xsl:for-each select="$ovars">
                  <xsl:sort select="translate(@name,'_$','  ')"/>
                  <xsl:apply-templates select="." mode="synopsis">
                    <xsl:with-param name="add-link" select="$add-sublink"/>
                    <xsl:with-param name="static" select="true()"/>
                    <xsl:with-param name="language" select="$language"/>
                  </xsl:apply-templates>
                </xsl:for-each>
              </xsl:if>
              <xsl:if test="count($ivars) > 0">
                <xsl:for-each select="$ivars">
                  <xsl:sort select="translate(@name,'_$','  ')"/>
                  <xsl:apply-templates select="." mode="synopsis">
                    <xsl:with-param name="language" select="$language"/>
                    <xsl:with-param name="add-link" select="$add-sublink"/>
                  </xsl:apply-templates>
                </xsl:for-each>
              </xsl:if>
              <xsl:if test="count($pvars) > 0">
                <xsl:for-each select="$pvars">
                  <xsl:sort select="translate(@name,'_$','  ')"/>
                  <xsl:apply-templates select="." mode="synopsis">
                    <xsl:with-param name="add-link" select="$add-sublink"/>
                    <xsl:with-param name="language" select="$language"/>
                    <xsl:with-param name="prototype" select="true()"/>
                  </xsl:apply-templates>
                </xsl:for-each>
              </xsl:if>
            </xsl:when>
            <xsl:otherwise><xsl:text>...</xsl:text></xsl:otherwise>
          </xsl:choose>
        </classsynopsis>
    </xsl:template>

    <xsl:template match="initarg|property" mode="synopsis">
      <xsl:param name="add-link"/>
      <xsl:param name="language"/>
      <xsl:param name="static" select="false()"/>
      <xsl:param name="prototype" select="false()"/>

      <fieldsynopsis language="{$language}">
        <xsl:if test="$static"><modifier>static</modifier></xsl:if>
        <xsl:if test="$prototype"><modifier>prototype</modifier></xsl:if>
        <xsl:if test="@access"><modifier><xsl:value-of select="@access"/></modifier></xsl:if>
        <xsl:if test="@modifiers">
          <xsl:call-template name="insert-modifiers">
            <xsl:with-param name="modifiers" select="@modifiers"/>
          </xsl:call-template>
        </xsl:if>
        <xsl:choose>
          <xsl:when test="$add-link = true()">
            <varname><link linkend="{@id}"><xsl:value-of select="@name"/></link></varname>
          </xsl:when>
          <xsl:otherwise>
            <varname><xsl:value-of select="@name"/></varname>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:choose>
          <xsl:when test="$language='javascript'">
            <xsl:call-template name="jstype">
              <xsl:with-param name="tag" select="'type'"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:when test="$language='lzx'">
            <xsl:call-template name="lzxtype">
              <xsl:with-param name="tag" select="'type'"/>
            </xsl:call-template>
          </xsl:when>
        </xsl:choose>
        <xsl:choose>
          <xsl:when test="$language='javascript' and @value">
            <initializer><xsl:value-of select="@value"/></initializer>
          </xsl:when>
          <xsl:when test="$language='lzx' and doc/tag[@name='lzxdefault']">
            <initializer><xsl:value-of select="doc/tag[@name='lzxdefault']/text"/></initializer>
          </xsl:when>
          <xsl:otherwise>
            <xsl:apply-templates select="." mode="value">
              <xsl:with-param name="tag" select="'initializer'"/>
              <xsl:with-param name="language" select="$language"/>
            </xsl:apply-templates>
          </xsl:otherwise>
        </xsl:choose>
      </fieldsynopsis>
    </xsl:template>

    <xsl:template match="property[child::function]" mode="synopsis">
      <xsl:param name="add-link"/>
      <xsl:param name="language"/>
      <xsl:param name="id" select="@id"/>
      <xsl:param name="static" select="false()" />
      <xsl:param name="prototype" select="false()"/>
      <methodsynopsis language="{$language}">
        <xsl:choose>          
          <xsl:when test="$add-link = true()">
            <methodname><link linkend="{$id}"><xsl:value-of select="@name"/></link></methodname>
          </xsl:when>
          <xsl:otherwise>
            <xsl:choose>
              <xsl:when test="$static">
                <!-- For static methods, show the class name --> 
                <methodstaticclass><xsl:call-template name="lztype-rename">
                    <xsl:with-param name="type" select="../../@name"/>
                  </xsl:call-template>.</methodstaticclass>
              </xsl:when>
              <xsl:when test="ancestor::property/doc/tag[@name='lzxname']/text">
                <!-- For instance methods, show name of tag if there is one --> 
                <methodclass><xsl:value-of select="ancestor::property/doc/tag[@name='lzxname']/text"/>.</methodclass>
              </xsl:when>
              <xsl:when test="ancestor::property/@name">
                <!-- Or for instance methods, show the name of the class --> 
                <methodclass><xsl:call-template name="lztype-rename">
                    <xsl:with-param name="type" select="ancestor::property/@name"/>
                  </xsl:call-template>.</methodclass>
              </xsl:when>
               <xsl:otherwise>        
                 <xsl:if test="$warn.classname.not.found">
                   <xsl:message>No class name found for function synopsis: <xsl:value-of select="@id"/></xsl:message>
                 </xsl:if>                   
               </xsl:otherwise>
            </xsl:choose>                
            <methodname><xsl:value-of select="@name"/></methodname>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:for-each select="function/parameter">
          <methodparam>
            <!-- The 'type' may end with ... for optional args.  For the
                 synopsis, we want to prefix the name to match JS syntax -->
            <xsl:choose>
              <xsl:when test="contains(@type, '...')">
                <parameter><xsl:value-of select="concat('...', @name)"/></parameter>
                <xsl:variable name="printable-type" select="substring-before(@type, '...')"/>
                <xsl:if test="$printable-type">
                  <type role="javascript">
                    <xsl:call-template name="lztype-rename">
                      <xsl:with-param name="type" select="$printable-type"/>
                    </xsl:call-template>
                  </type>
                </xsl:if>
              </xsl:when>
              <xsl:otherwise>
                <parameter><xsl:value-of select="@name"/></parameter>
                <xsl:if test="@type">
                  <type role="javascript">
                    <xsl:call-template name="lztype-rename">
                      <xsl:with-param name="type" select="@type"/>
                    </xsl:call-template>
                  </type>
                </xsl:if>
              </xsl:otherwise>
            </xsl:choose>
          </methodparam>
        </xsl:for-each>        
      </methodsynopsis>
    </xsl:template>
  
    <!-- Hide this template, without turning it off, by putting it into the mode
      "jgrandy-synopsis". We don't want to delete the code because it's probably
      very tasty, but we also don't want to execute it right now. 
      [bshine 10.12.2007] --> 
    <xsl:template match="property[child::function]" mode="jgrandy-synopsis">
      <xsl:param name="add-link"/>
      <xsl:param name="language"/>
      <xsl:param name="id" select="@id"/>
      <xsl:param name="static" select="false()" />
      <xsl:param name="prototype" select="false()"/>
      <methodsynopsis language="{$language}">
        <xsl:text></xsl:text>      
        <xsl:if test="$static"><modifier>static</modifier></xsl:if>
        <xsl:if test="$prototype"><modifier>prototype</modifier></xsl:if>
        <xsl:if test="@access"><modifier><xsl:value-of select="@access"/></modifier></xsl:if>
        <xsl:if test="@modifiers">
          <xsl:call-template name="insert-modifiers">
            <xsl:with-param name="modifiers" select="@modifiers"/>
          </xsl:call-template>
        </xsl:if>
        <xsl:if test="function/returns"><type role="javascript"><xsl:value-of select="function/returns/@type"/></type></xsl:if>
        <xsl:choose>
          <xsl:when test="$add-link = true()">
            <methodname><link linkend="{$id}"><xsl:value-of select="@name"/></link></methodname>
          </xsl:when>
          <xsl:otherwise>
            <methodname><xsl:value-of select="@name"/></methodname>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:for-each select="function/parameter">
          <methodparam>
            <parameter><xsl:value-of select="@name"/></parameter>
            <xsl:if test="@type"><type role="javascript"><xsl:value-of select="@type"/></type></xsl:if>
          </methodparam>
        </xsl:for-each>
      </methodsynopsis>
    </xsl:template>

    <xsl:template match="function" mode="synopsis">
      <!-- TODO [jgrandy 1/28/2007] use constructorsynopsis for constructors -->
      <xsl:param name="add-link"/>
      <xsl:param name="language"/>
      <!--
        NOTE: LPP-8843 - [20100325 anba]
        Using the union operator to create a default value throws this error while compiling the template:
            Cannot convert data-type 'string' to 'node-set'
        Therefore replaced the union operator with a combination of concat and substring. The third parameter
        of substring is a bit obscure, but the conditional operator is only available in XPath2, so here we go:
        If there is no 'name' attribute on the current context node, not(@name) will return 'true', otherwise
        'false'. The div operator coerces 'true' to 1 and 'false' to 0. (1 div 0) is Infinity, (0 div 0) is NaN.
        So, if no 'name' attribute is set, the substring from 1 to Infinity will be returned (= the complete string),
        otherwise from 1 to NaN (= the empty string). This means the param is either @name or 'construct'.
      -->
      <!-- <xsl:param name="name" select="(@name | 'construct')[1]"/> -->
      <xsl:param name="name" select="concat(@name, substring('construct', 1, not(@name) div 0))"/>
      <xsl:param name="id" select="@id"/>
      <xsl:param name="static" select="true()"/>
      <methodsynopsis language="{$language}">
        <xsl:text></xsl:text>            
        <xsl:if test="returns"><type role="javascript"><xsl:value-of select="returns/@type"/></type></xsl:if>
        <xsl:choose>
          <xsl:when test="$add-link = true()">
            <methodname><link linkend="{$id}"><xsl:value-of select="$name"/></link></methodname>
          </xsl:when>
          <xsl:otherwise>
            <methodname><xsl:value-of select="$name"/></methodname>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:for-each select="parameter">
          <methodparam>
            <parameter><xsl:value-of select="@name"/></parameter>
            <xsl:if test="@type"><type role="javascript"><xsl:value-of select="@type"/></type></xsl:if>
          </methodparam>
        </xsl:for-each>
      </methodsynopsis>
    </xsl:template>
    
    <xsl:template match="property[@type='LzEvent']" mode="synopsis">
      <xsl:param name="language"/>
      <xsl:param name="add-link" select="false()"/>
      <xsl:param name="static" select="false()"/>
      <xsl:param name="prototype" select="false()"/>
      <fieldsynopsis role="event" language="{$language}">
        <xsl:if test="$static"><modifier>static</modifier></xsl:if>
        <xsl:if test="$prototype"><modifier>prototype</modifier></xsl:if>
        <xsl:if test="@access"><modifier><xsl:value-of select="@access"/></modifier></xsl:if>
        <xsl:if test="@modifiers">
          <xsl:call-template name="insert-modifiers">
            <xsl:with-param name="modifiers" select="@modifiers"/>
          </xsl:call-template>
        </xsl:if>
        <xsl:choose>
          <xsl:when test="$add-link = true()">
            <varname><link linkend="{@id}"><xsl:value-of select="@name"/></link></varname>
          </xsl:when>
          <xsl:otherwise>
            <varname><xsl:value-of select="@name"/></varname>
          </xsl:otherwise>
        </xsl:choose>
      </fieldsynopsis>
    </xsl:template>
    
    <xsl:template match="*" mode="synopsis">
    </xsl:template>
    
</xsl:stylesheet>
