<?xml version="1.0" encoding="utf-8"?>
<!-- quick-index.xslt --> 
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                version="1.0">
    <xsl:output method="html" indent="yes" />
    <!-- [2007-09-24 jgrandy] (LPP-2771) we should use method="xhtml" below, but the XSLT processor used on many people's machines doesn't support this nonstandard extension.
         See http://www.velocityreviews.com/forums/t167968-xhtml-doctype-and-output.html -->

    <xsl:template match="/menu">
        <html>
        <head>
            <title>OpenLaszlo Quick Index</title>
            <link rel="STYLESHEET" type="text/css" href="lps/includes/styles.css" />
            <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/images/laszlo.ico" />
        </head>
        <body>
        <div style="float:right"><img border="0" src="lps/includes/logo_web_sm.gif" alt="OpenLaszlo logo" /></div>
        <h1>OpenLaszlo Quick Index</h1>

        <p>
          If this is the first time you've run OpenLaszlo or you are
          looking for an introduction, please try the OpenLaszlo Explorer in <a
          href="laszlo-explorer/index.html?lzr=swf10">Flash</a> or <a
          href="laszlo-explorer/index.html?lzr=dhtml">DHTML</a>.
        </p>

        <p>
          Documentation for OpenLaszlo can be found here:
        </p>

        <ul>
            <xsl:apply-templates select="*[@name='Documentation']"/>
        </ul>

        <p>
          If you cannot find answers here, please ask your question
          on the <a href="http://www.openlaszlo.org/lists">mailing list</a> or
                 <a href="http://forum.openlaszlo.org/">forums</a>.
          If you find a bug in OpenLaszlo, please file a report
          in the OpenLaszlo <a href="http://jira.openlaszlo.org/">bug
          database</a>.
        </p>

        <p>
          Direct links to the examples used in the OpenLaszlo Explorer are also provided below, for demonstration and testing purposes.
        </p>

        <ul>
            <xsl:apply-templates select="*[not(@name='Laszlo in 10 Minutes' or @name='Documentation')]"/>
        </ul>
        <hr/>
        <p>OpenLaszlo @VERSIONID@ @RELEASE@ @BUILDID@ @BUILDDATE@</p>
<!-- * H_LZ_COPYRIGHT_BEGIN *********************************************** -->
<p class="copyright">Copyright &#xA9; 2002-2009 <a target="_top"
href="http://www.laszlosystems.com/">Laszlo Systems, Inc.</a>
All Rights Reserved. Unauthorized use, duplication or
distribution is strictly prohibited. This is the proprietary
information of Laszlo Systems, Inc. Use is subject to license terms.</p>
<!-- * H_LZ_COPYRIGHT_END ************************************************* -->
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
                           <xsl:if test="@runtime != ''">
                               <xsl:text>?lzr=</xsl:text>
                               <xsl:value-of select="@runtime"/>
                           </xsl:if>
                       </xsl:when>
                       <xsl:when test="@action = 'popupexternal'">
                           <xsl:value-of select="@src"/>
                       </xsl:when>
                       <!-- If there is a sibling 'source' item, use it to run programs -->
                       <xsl:when test="@runtime and parent::*/child::subitem[@action='source']">
                           <xsl:text>.</xsl:text>
                           <xsl:value-of select="parent::*/child::subitem[@action='source']/@src"/>
                           <xsl:if test="@runtime != ''">
                               <xsl:text>?lzr=</xsl:text>
                               <xsl:value-of select="@runtime"/>
                           </xsl:if>
                       </xsl:when>                       
                       <xsl:otherwise>
                            <xsl:text>.</xsl:text>
                            <xsl:value-of select="@src"/>
                            <xsl:if test="@runtime != ''">
                                <xsl:text>?lzr=</xsl:text>
                                <xsl:value-of select="@runtime"/>
                            </xsl:if>
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
