<?xml version="1.0" encoding="utf-8"?>
<!-- quick-index.xslt --> 
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                version="1.0">
    <xsl:output method="html" indent="yes" />

    <xsl:template match="/menu">
        <html>
        <head>
            <title>Laszlo Presentation Server Quick Index</title>
            <link rel="STYLESHEET" type="text/css" href="lps/includes/styles.css"/>
            <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/images/laszlo.ico"/>
            <script src="lps/includes/script.js" type="text/javascript"></script>
        </head>
        <body>
        <div align="right"><img border="0" src="lps/includes/logo_web_sm.gif"/></div>
        <h1>Laszlo Presentation Server Quick Index</h1>
        
        <p>If this is the first time you've run Laszlo Presentation Server
            or you are looking for an introduction, please try 
            the <a href="laszlo-explorer">Laszlo Explorer</a>.
        </p>
        <ul>
            <xsl:apply-templates select="*[not(@name='Laszlo in 10 Minutes')]"/> 
        </ul>
        <hr/>
<!-- * H_LZ_COPYRIGHT_BEGIN *********************************************** -->
<p class="copyright">Copyright © 2002-2004 <a target="_top"
href="http://www.laszlosystems.com/">Laszlo Systems, Inc.</a>
All Rights Reserved. Unauthorized use, duplication or
distribution is strictly prohibited. This is the proprietary
information of Laszlo Systems, Inc. Use is subject to license terms.</p>
<!-- * H_LZ_COPYRIGHT_END ************************************************* -->
        <p>LPS @VERSIONID@ build @BUILDID@ </p>
        </body>
        </html>
    </xsl:template>

    <xsl:template match="*">
        <li>
            <xsl:element name="a">
                <xsl:attribute name="href">
                    <xsl:choose>
                       <xsl:when test="@action = 'source'">
                           <xsl:text>./lps/utils/viewer/viewer.jsp?file=</xsl:text>
                           <xsl:value-of select="@src"/>
                       </xsl:when>
                       <xsl:when test="@action = 'popup'">
                           <xsl:choose>
                               <xsl:when test="starts-with(@popup, '/')">
                                   <xsl:text>.</xsl:text>
                               </xsl:when>
                               <xsl:otherwise>
                               </xsl:otherwise>
                           </xsl:choose>
                           <xsl:value-of select="@popup"/>
                       </xsl:when>
                       <xsl:otherwise>
                            <xsl:text>.</xsl:text>
                            <xsl:value-of select="@src"/>
                       </xsl:otherwise>
                    </xsl:choose>
                </xsl:attribute>
                <xsl:if test="@action = 'popup' or @action = 'edit'">
                    <xsl:attribute name="target">
                        <xsl:choose>
                           <xsl:when test="@target != ''">
                               <xsl:value-of select="@target"/>
                           </xsl:when>
                           <xsl:otherwise>_blank</xsl:otherwise>
                        </xsl:choose>
                    </xsl:attribute>
                </xsl:if>
                <xsl:value-of select="@name"/>
            </xsl:element>
            <xsl:if test="count(@action) = 0 or @action != 'edit'">
                <xsl:text> </xsl:text>
                <xsl:value-of select="@text"/>
            </xsl:if>
            <!--
            This would be to pick up more details from nav.xml when present
            for containing items
            <xsl:if test="@dir != ''">
                <xsl:text> </xsl:text>
                <xsl:element name="a">
                    <xsl:attribute name="href">
                        <xsl:text>.</xsl:text>
                        <xsl:value-of select="@dir"/>
                    </xsl:attribute>
                    <xsl:text>(files)</xsl:text>
                </xsl:element>
            </xsl:if>
            -->

            <xsl:if test="count(*) > 0">
                <ul>
                <xsl:apply-templates/>
                </ul>
             </xsl:if>
        </li>
    </xsl:template>
</xsl:stylesheet>
