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
<!ENTITY commonname     '(self::node()/@name | self::node()/doc/tag[@name="lzxname"]/text)[1]'>

<!ENTITY objectvalue    '(object|class|function)'>
<!ENTITY classvalue     '(class|function)'>
<!ENTITY privateslot    '(@name="prototype" or @name="__ivars__" or @name="dependencies" or @name="setters" or @name="tagname")'>

<!ENTITY isvisible      '(contains($visibility.filter, @access))'>


]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:import  href="common-html.xsl"/>
    
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
        <xsl:for-each select="descendant::refsect1[1]">
            $relative.path.to.lpshome: <xsl:value-of select="$relative.path.to.lpshome"/>
            local.lps.path:<xsl:call-template name="local.lps.path" />
            base.book.name:<xsl:call-template name="base.book.name" />
            dbhtml-dir <xsl:call-template name="dbhtml-dir"></xsl:call-template>
        </xsl:for-each>            
    </xsl:template>
        
</xsl:stylesheet>
