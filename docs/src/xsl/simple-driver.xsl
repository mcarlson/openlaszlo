<?xml version="1.0" encoding="UTF-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.                   *
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
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:preserve-space elements="body"/>
    <xsl:output method="xml"/>
    <!-- simple driver for testing paperpie doctools work -->

    <xsl:param name="visibility.filter" select="'public'"/>    

    <xsl:key name="id" match="*" use="@id"/>
    <xsl:key name="unitid" match="*" use="@unitid"/>
    <xsl:key name="topic" match="property" use="@topic"/>
    <xsl:key name="subtopic" match="property" use="@subtopic"/>
    <xsl:key name="name-js" match="property" use="@name"/>
    <xsl:key name="name-lzx" match="property" use="&tagname;"/>
    <xsl:key name="superclass" match="property[child::class]" use="class/@extends"/>    

    <xsl:template match="/">
        <body>
            <!-- find all properties which have exactly one class child -->
            <xsl:apply-templates select="descendant::property[count(class)=1]"
            > </xsl:apply-templates>
        </body>
    </xsl:template>

    <xsl:template match="property">
        <refentry>
            <xsl:value-of select="@name"/>
            <xsl:apply-templates select="descendant::class"/>
        </refentry>
    </xsl:template>


    <xsl:template match="class">
        <xsl:if test="attribute::extends != ''">
<!--            
            <xsl:call-template name="describe-inherited-initargs">
                <xsl:with-param name="class" select="."/>
            </xsl:call-template>
-->          
<!--            
            <xsl:call-template name="describe-superclass-methods">
                <xsl:with-param name="class" select="."/>
            </xsl:call-template>
-->            
            <xsl:call-template name="describe-superclass-chain-inner">
                <xsl:with-param name="class" select="."/>
            </xsl:call-template>
        </xsl:if>    
    </xsl:template>
    
    <xsl:template name="describe-inherited-initargs">
        <xsl:param name="class" />
        <xsl:variable name="extends" select="$class/@extends"/>
        <xsl:variable name="superclass" select="(key('id',$extends) | key('name-lzx',$extends))[1]"/>
        <xsl:if test="$superclass">
            <xsl:variable name="initargs" select="$superclass/class/initarg[@access='public']"></xsl:variable>            
            <refsect2>
                <title>
                    <xsl:text>Initialization Arguments Inherited From </xsl:text>
                    <xref linkend="{$superclass/@id}">
                        <xsl:value-of select="$superclass/doc/tag[@name='lzxname']/text"/>
                    </xref>
                </title>                
                <para>
                    <xsl:for-each select="$initargs">
                        <link linkend="{@id}"><xsl:value-of select="@name"/></link>
                        <xsl:text>, </xsl:text>
                    </xsl:for-each>
                </para>
                
            </refsect2>
        </xsl:if>
        
    </xsl:template>

    <xsl:template name="describe-superclass-chain-inner">
        <xsl:param name="class"/>        
        
        <xsl:variable name="jsname" select="@name"/>
        <xsl:variable name="lzxname" select="&tagname;"/>
        
        <xsl:variable name="extends" select="$class/@extends"/>
        <xsl:variable name="superclass" select="(key('id',$extends) | key('name-lzx',$extends))[1]"/>
        <xsl:if test="$superclass">
            <div>
                <xsl:variable name="inheritedattrs" select="$superclass/class/property[@name='__ivars__']/object/property[@access='public']"></xsl:variable>
                <xsl:variable name="initargs" select="$superclass/class/initarg[@access='public']"></xsl:variable>                            
                <xsl:text>Attributes inherited from&nbsp;</xsl:text>
                <xref linkend="{$superclass/@id}">
                    <xsl:value-of select="$superclass/doc/tag[@name='lzxname']/text"/>
                </xref>
                <xsl:text>: &nbsp;</xsl:text>
                <xsl:for-each select="$inheritedattrs"><xsl:value-of select="@name"/> <xref linkend="{$superclass/@id}"/> &nbsp;</xsl:for-each>
                <xsl:for-each select="$initargs"><xsl:value-of select="@name"/> <link linkend="{@id}"/> &nbsp;</xsl:for-each>                
            </div>
            <xsl:choose>
                <xsl:when test="contains($visibility.filter, $superclass/@access)">
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
            
    <xsl:template name="describe-superclass-methods">
<!--        
        <xsl:param name="class"/>        
        
        <xsl:variable name="jsname" select="@name"/>
        <xsl:variable name="lzxname" select="&tagname;"/>
        
        <xsl:variable name="extends" select="$class/@extends"/>
        <xsl:variable name="superclass" select="(key('id',$extends) | key('name-lzx',$extends))[1]"/>
        <xsl:if test="$superclass">
            <div>
                <xsl:variable name="inheritedmethods" select="$superclass/class/property/object/property[@access='public']/function"></xsl:variable>
                <xsl:text>Methods inherited from&nbsp;</xsl:text>
                <xref linkend="{$superclass/@id}">
                    <xsl:value-of select="$superclass/doc/tag[@name='lzxname']/text"/>
                </xref>
                <xsl:text>: &nbsp;</xsl:text>
                <xsl:for-each select="$inheritedmethods"><xsl:value-of select="../@name"/> <xref linkend="{../@id}"/> &nbsp;</xsl:for-each>                               
            </div>
            <xsl:choose>
                <xsl:when test="contains($visibility.filter, $superclass/@access)">
                    <xsl:call-template name="describe-superclass-methods">
                        <xsl:with-param name="class" select="$superclass/class"/>
                    </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="($superclass/@name | $superclass/doc/tag[@name='lzxname']/text)[1]"/>
                    <xsl:text>&nbsp;(private)&nbsp;&raquo; </xsl:text>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:if>        
-->        
    </xsl:template>
    
</xsl:stylesheet>
