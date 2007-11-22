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

<!ENTITY isvisible      '(contains("public", @access))'>

<!ENTITY ispublic       '(@access="public")'>
<!ENTITY isevent        '((doc/tag[@name="lzxtype"]/text) = "event" or @type="LzEvent")'>



]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="xml" indent="yes"/>
    
    
    <xsl:template match="/">
        <!-- Just pay attention to LzBrowser. We really want good LzBrowser documentation. -->        
        <xsl:apply-templates select="/js2doc/property[@name='LzBrowser']" />
    </xsl:template>
    
    
    
    <!-- /js2doc/property[@name]/class/property[@name="setters"] --> 
    <xsl:template match="property" >
        <xsl:variable name="classname" select="@name" />
        <xsl:variable name="id" select="@id"/>
        <xsl:variable name="ovars" select="&objectvalue;/property[not(&privateslot;) and &isvisible; and child::function]"/>
        <xsl:variable name="fvars" select="&objectvalue;/property[not(&privateslot;) and &isvisible;]"/>        
        <class>
            <name><xsl:value-of select="$classname"/></name>
            <id><xsl:value-of select="$id"/></id>
            <ovars>
                <xsl:for-each select="$ovars">
                    <name><xsl:value-of select="@name"/></name>
                </xsl:for-each>
            </ovars>
            <fvars>
                <xsl:for-each select="$fvars[child::function]">
                    <name><xsl:value-of select="@name"/></name>
                    <methodname><xsl:value-of select="../../@name"/>.<xsl:value-of select="@name"/></methodname>                    
                </xsl:for-each>
            </fvars>                        
            
         </class> 
    </xsl:template>        
    

</xsl:stylesheet>
