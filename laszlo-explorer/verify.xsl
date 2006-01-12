<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                version="1.0">
  
  <xsl:output method="text"/>
  
  <xsl:template match="/|*">
    <xsl:apply-templates select="*"/>
  </xsl:template>
  
  <xsl:template match="*[name()='include' or name()='import']">
    <xsl:call-template name="verify-path">
      <xsl:with-param name="path" select="@href"/>
    </xsl:call-template>
  </xsl:template>
  
  <xsl:template match="*[@src]">
    <xsl:call-template name="verify-path">
      <xsl:with-param name="path" select="@src"/>
    </xsl:call-template>
    <xsl:apply-templates select="*"/>
  </xsl:template>

  <xsl:template match="*[@resource]">
    <xsl:call-template name="verify-path">
      <xsl:with-param name="path" select="@resource"/>
    </xsl:call-template>
    <xsl:apply-templates select="*"/>
  </xsl:template>

  <xsl:template name="verify-path">
    <xsl:param name="path"/>
    <xsl:if test="contains($path, '..')">
      <xsl:text>A pathname in the online code browser can't contain '..'</xsl:text>
    </xsl:if>
    <xsl:if test="substring($path, 2, 1)=':'">
      <xsl:text>A pathname in the online code browser can't begin with a drive letter.</xsl:text>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
