<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!DOCTYPE xsl:stylesheet [

]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:param name="merge.file"/>
    
    <xsl:output method="xml"
                indent="yes" />

    <xsl:template match="/js2doc">
      <js2doc>
        <xsl:copy-of select="@*"/>        
        <xsl:copy-of select="node()"/>
        <xsl:if test="$merge.file">
          <xsl:copy-of select="document($merge.file)/js2doc/*"/>
        </xsl:if>
      </js2doc>
    </xsl:template>

    <xsl:template match="*">
    </xsl:template>

</xsl:stylesheet>
