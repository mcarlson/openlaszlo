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

<!ENTITY ispublic       '(@access="public")'>



]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="xml"/>
    <!-- simple driver for testing paperpie doctools work -->
    
    <xsl:template match="/">
        <xsl:apply-templates select="/js2doc/property" />
    </xsl:template>
    
    
    
    <!-- /js2doc/property[@name]/class/property[@name="setters"] --> 
    <xsl:template match="property" >
        <xsl:variable name="classname" select="@name" />
        <xsl:variable name="setters" select="class/property[@name='setters']/object/property[not(contains(@access, 'private'))]" />
        <xsl:variable name="instancevariables" select="class/property[@name='__ivars__']/object/property[not(contains(@access, 'private'))]" />
        <xsl:variable name="initargs" select="class/initarg[not(contains(@access, 'private'))]" />
        
        
        property with name <xsl:value-of select="$classname"/>
        
            
        <!-- things that are both instancevariables and setters are read/write attributes -->
        <xsl:variable name="setters-names" select="$setters/@name" />
        <xsl:variable name="ivars-names" select="$instancevariables/@name" />
        
        <xsl:variable name="attributes" select="$setters | $instancevariables"></xsl:variable>
        

        attributes: (setters: <xsl:value-of select="count($setters)"/>) (instancevariables: <xsl:value-of select="count($instancevariables)"/>)
        <xsl:for-each select="$attributes">
            <xsl:sort select="@name" />
            <xsl:variable name="sname" select="@name" />
            <xsl:variable name="issetter" select="count( ancestor::property[@name='setters'] ) > 0" />           
            <xsl:variable name="hassetter" select="count( $setters[@name=$sname] ) > 0" />
            <xsl:variable name="isinstancevar" select="count( $instancevariables[@name=$sname]) > 0" />
            <xsl:variable name="isinitarg" select="count( $initargs[@name=$sname] ) > 0" />         
            
            <xsl:if test="$hassetter">
                <xsl:if test="$issetter">
                    <xsl:call-template name="unique-attribute">
                        <xsl:with-param name="issetter" select="true()"></xsl:with-param>
                        <xsl:with-param name="isinstancevar" select="$isinstancevar"></xsl:with-param>
                        <xsl:with-param name="isinitarg" select="$isinitarg"></xsl:with-param>                        
                    </xsl:call-template>
                </xsl:if>                
            </xsl:if>
            <xsl:if test="not($hassetter)">
                <xsl:call-template name="unique-attribute"></xsl:call-template>
            </xsl:if>
        </xsl:for-each>
        
        
        instancevariables: 
        <xsl:for-each select="$instancevariables">
            <xsl:sort select="@name" />            
            <xsl:value-of select="@name"/>,             
        </xsl:for-each>            

        initargs: 
        <xsl:for-each select="$initargs">
            <xsl:sort select="@name" />            
            <xsl:value-of select="@name"/>,             
        </xsl:for-each>         
    </xsl:template>


    <xsl:template name="unique-attribute">
        <xsl:param name="issetter" select="false()"></xsl:param>
        <xsl:param name="isinstancevar" select="true()"></xsl:param>
        <xsl:param name="isinitarg" select="false()"></xsl:param>        
        <xsl:value-of select="@name"/>            
        
        <xsl:if test="$isinstancevar and $issetter"> (read/write)</xsl:if>
        <xsl:if test="$isinstancevar and not($issetter)"> (readonly)</xsl:if>
        <xsl:if test="not($isinstancevar) and $issetter"> (virtual) </xsl:if>
        <xsl:if test="not($isinstancevar) and not($issetter)"> (strange)</xsl:if>
        <xsl:if test="@modifiers='final'"> (final)</xsl:if>
        <!-- 
        <xsl:if test="$isinstancevar"> (instancevariable) </xsl:if>        
        <xsl:if test="not($isinstancevar)"> (virtual) </xsl:if>
        -->
        <xsl:if test="$isinitarg"> (initarg)</xsl:if>,                                
    </xsl:template>
    

</xsl:stylesheet>
