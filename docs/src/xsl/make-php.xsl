<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:xalan="http://xml.apache.org/xalan"
                xmlns:my-ext="ext1"
                extension-element-prefixes="my-ext"
                exclude-result-prefixes="xhtml"
                version="1.0">
  
  <xsl:output method="html"
              indent="yes"
              omit-xml-declaration="yes"/>
  
  <xsl:param name="isTutorial" select="false"/>
  <xsl:param name="isReference" select="false"/>
  <!-- Relative address of LPS servlet -->
  <xsl:param name="lpsdir.src"/>
  <!-- Build branch -->
  <xsl:param name="build.branch"/>
  <!-- Relative address of web support directory (in LPS servlet) -->
  <xsl:param name="web.support.dir"/>
  <!-- Relative address of Apache Root -->
  <xsl:param name="webroot"/>
  <!-- This Page -->
  <xsl:param name="thispage"/>


  <xsl:param name="title" select="concat(/html/head/title/text(),/xhtml:html/xhtml:head/xhtml:title/text())"/>
  
 <!--The component and its script are in the xalan namespace and define the 
    implementation of the extension.-->
  <xalan:component prefix="my-ext" elements="timelapse" functions="doit">
    <xalan:script lang="javascript"><![CDATA[
      var webroot;
      var buildbranch;
      var lpsdirsrc;
      var websupportdir;
      
      function setparam(name, value)
      {
        var assignmentexpr = name + '="' + value + '"';
        eval(assignmentexpr);
        // The element return value is placed in the result tree.
        // If you do not want a return value, return null.
        return null;
      }
      
      function doit(ref) {
        if (ref.indexOf('#') == 0)
          return ref;
        
        function replacePrefix(src, dst) {
          if (ref.indexOf(src) == 0)
            ref = dst + ref.slice(src.length);
        }
        
        var support = '/' + buildbranch + '/' + websupportdir + '/';
        
        // Replace .html by .php
        var index = ref.indexOf('.html');
        if (ref.indexOf('http:') != 0 && index >= 0)
          ref = ref.slice(0, index) + '.php' + ref.slice(index + '.html'.length);

        // Replace the path to lps by websupportdir for .lzx, .xml, and assets files
        if (ref.indexOf('.lzx') != -1 ||
            ref.indexOf('.lzo') != -1 ||
            ref.indexOf('.xml') != -1 ||
            ref.indexOf('/assets/') != -1) {
          replacePrefix(lpsdirsrc, support);

          // Fix targets of editor.jsp
          substr = 'editor.jsp?src=';
          index = ref.indexOf(substr);
          if (index >= 0) {
            index += substr.length;
            ref = ref.slice(0, index) + websupportdir + '/' + ref.slice(index);
          }
        }
        
        // Fixup components links
        replacePrefix('./components', support + 'docs/components');
        replacePrefix('../components', support + 'docs/components');

        replacePrefix('/lps/../laszlo-in-ten-minutes/', '/lps/$laszlo-in-ten-minutes/');
        // normalize into /docs
        replacePrefix('docs/', '/docs/');
        replacePrefix('/lps/../tutorials/', '/docs/tutorials/');
        replacePrefix('tutorials/', '/docs/tutorials/');
        replacePrefix('/lps/../docs/', '/docs/');
        // rewrite out of /docs
        replacePrefix('/docs/', '/developers/learn/documentation/');
        replacePrefix('/developers/learn/installation/', '/developers/download/installation-2.0/');
        
        return ref;
      }
    ]]></xalan:script>
  </xalan:component>
  
  <xsl:template match="/">
    <xsl:value-of select="my-ext:setparam('lpsdirsrc', $lpsdir.src)"/>
    <xsl:value-of select="my-ext:setparam('buildbranch', $build.branch)"/>
    <xsl:value-of select="my-ext:setparam('websupportdir', $web.support.dir)"/>
    <xsl:value-of select="my-ext:setparam('webroot', $webroot)"/>
    
<xsl:text disable-output-escaping="yes"><![CDATA[<?php ob_start(); ?>
<?php $urlPrefix = ']]></xsl:text><xsl:value-of select="$webroot"/>
<xsl:text disable-output-escaping="yes"><![CDATA['; ?>]]></xsl:text>
<xsl:choose>
<xsl:when test="substring-before($thispage, 'index.php') = ''">
<xsl:text disable-output-escaping="yes"><![CDATA[
<?php $thisPage = dirname( __FILE__ )."/"; ?>
<?php $mouseTrailLast = "]]></xsl:text><xsl:value-of select="$title"/><xsl:text disable-output-escaping="yes"><![CDATA["; ?>]]></xsl:text>
</xsl:when>
<xsl:otherwise>
<xsl:text disable-output-escaping="yes"><![CDATA[
<?php $thisPage = ']]></xsl:text><xsl:value-of select="concat('/var/www/html/developers/learn/documentation', substring-after($thispage, '/docs/src'))"/><xsl:text disable-output-escaping="yes"><![CDATA['; ?>]]></xsl:text>
</xsl:otherwise>
</xsl:choose>
<xsl:text disable-output-escaping="yes"><![CDATA[
<?php $headHTMLInclude = '<link rel="STYLESHEET" type="text/css" href="]]></xsl:text><xsl:value-of select="$webroot"/><xsl:text disable-output-escaping="yes"><![CDATA[lps/includes/styles.css">'; ?>
<?php require $urlPrefix . 'includes/tree.php'; ?>
<?php $noLeftMargin = 0; ?>
<?php require $urlPrefix . 'includes/header.php'; ?>
<?php 
    if ($devzoneProtected) {
        // session management
        require $urlPrefix . 'developers/includes/global.php';
        require $urlPrefix . 'developers/includes/dev_session.php';
    }
    $header = ob_get_contents();
    ob_end_clean();
    // write out contents
    echo($header);
 ?>
]]></xsl:text>
<script src="/{$build.branch}/lps/includes/embed.js" language="JavaScript"/>
<link rel="STYLESHEET" type="text/css" href="/{$build.branch}/lps/includes/styles.css"/>
<xsl:comment>lpsdir.src = "<xsl:value-of select="$lpsdir.src"/>"</xsl:comment>
<xsl:comment>build.branch = "<xsl:value-of select="$build.branch"/>"</xsl:comment>
<xsl:comment>web.support.dir = "<xsl:value-of select="$web.support.dir"/>"</xsl:comment>
<xsl:comment>webroot = "<xsl:value-of select="$webroot"/>"</xsl:comment>
<xsl:comment>thispage = "<xsl:value-of select="$thispage"/>"</xsl:comment>

<xsl:if test="$isReference">
  <div xmlns="" style="float: left">
    <script type="text/javascript" language="JavaScript" src="/{$build.branch}/{$web.support.dir}/docs/lzx-reference/nav.lzo?lzt=js"/>
  </div>
</xsl:if>
<div><xsl:comment>class=original-body</xsl:comment>
<xsl:apply-templates mode="copy-children"
                     select="/html/body|/xhtml:html/xhtml:body"/>
<!-- The following applies to lzx-reference/index.html -->
<xsl:apply-templates select="/html/script|/html/frameset"/>
</div>

<xsl:text disable-output-escaping="yes"><![CDATA[
<?php include $urlPrefix . 'includes/footer.php'; ?>]]></xsl:text>

  </xsl:template>

  <xsl:template mode="copy-children" match="*">
    <xsl:apply-templates select="*|node()|text()|comment()"/>
  </xsl:template>

  <xsl:template match="*|@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="*|@*|node()|text()|comment()"/>
    </xsl:copy>
  </xsl:template>
  
  <xsl:template match="*[local-name() = 'a' and @href]">
    <xsl:param name="href">
      <xsl:value-of select="my-ext:doit(string(@href))"/>
    </xsl:param>
    
    <a href="{$href}">
      <xsl:for-each select="@*">
        <xsl:if test="name() != 'href' and name() != 'shape'">
          <xsl:apply-templates select="."/>
        </xsl:if>
      </xsl:for-each>
      <xsl:apply-templates select="*|text()|node()"/>
    </a>
  </xsl:template>

  <!-- transform script and img src's -->
  <xsl:template match="*[local-name() = 'script' and @src]">
    <xsl:param name="src">
      <xsl:value-of select="my-ext:doit(string(@src))"/>
    </xsl:param>
    
    <script src="{$src}">
      <xsl:for-each select="@*">
        <xsl:if test="name() != 'src' and name() != 'shape'">
          <xsl:apply-templates select="."/>
        </xsl:if>
      </xsl:for-each>
      <xsl:apply-templates select="*|text()|node()"/>
    </script>
  </xsl:template>


  <xsl:template match="*[local-name() = 'img' and substring-after(@src, '/lps/includes/') = 'logo_web_sm.gif']">
    <xsl:param name="src">
      <xsl:value-of select="string(@src)"/>
    </xsl:param>
    <!-- ignore logo -->
  </xsl:template>

  <xsl:template match="*[local-name() = 'img' and @src]">
    <xsl:param name="src">
      <xsl:value-of select="my-ext:doit(string(@src))"/>
    </xsl:param>
    
    <xsl:choose>
      <!-- remove these, they look bogus inside the web wrapper -->
      <xsl:when test="substring-after(@src, '/lps/includes/') = 'logo_web_sm.gif'">
        <xsl:comment> img src="{$src}" </xsl:comment>
      </xsl:when>
      <xsl:otherwise>
        <img src="{$src}">
          <xsl:for-each select="@*">
            <xsl:if test="name() != 'src' and name() != 'shape'">
              <xsl:apply-templates select="."/>
            </xsl:if>
          </xsl:for-each>
          <xsl:apply-templates select="*|text()|node()"/>
        </img>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
