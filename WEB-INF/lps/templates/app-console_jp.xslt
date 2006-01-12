<?xml version="1.0" encoding="utf-8"?>
<!--
  app-console.xslt
--> 

<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                version="1.0">

  <xsl:output method="html"
              indent="yes"/>
  
  <xsl:param name="lps"><xsl:value-of select="/*/request/@lps"/></xsl:param>
  <xsl:param name="appinfo"><xsl:value-of select="/*/console_appinfo/text()"/></xsl:param>
  <xsl:param name="assets"><xsl:value-of select="/*/request/@lps"/>/lps/assets</xsl:param>
  <xsl:param name="console-floating-window"><xsl:value-of select="/*/request/@console-floating-window"/></xsl:param>


  <!-- console will be 70 high, unless the remote console debugger is on, in which case
       it will be 370 -->
  <xsl:param name="consoleheight"><xsl:choose><xsl:when test="/*/request/@console-remote-debug = 'true'">370</xsl:when><xsl:otherwise>70</xsl:otherwise> </xsl:choose></xsl:param>

 <xsl:param name="consolefooter"><xsl:choose><xsl:when test="/*/request/@console-remote-debug = 'true'">footer-large</xsl:when><xsl:otherwise>footer</xsl:otherwise></xsl:choose></xsl:param>


<!--  <xsl:param name="appuid"><xsl:value-of select="/*/request/@appuid"/></xsl:param> -->
<!-- we'll use the app name for now, to make it easier to point a remote debugger at it -->
  <xsl:param name="appuid"><xsl:value-of select="/*/request/@url"/></xsl:param> 

  <xsl:param name="isKranked"/>
  <xsl:param name="isKranking" select="//param[@name='krank' and @value='true']"/>
  <xsl:param name="opturl" select="/*/request/@opt-url"/>
  <xsl:param name="unopturl" select="/*/request/@unopt-url"/>

  <xsl:template match="/">
    <html>
      <head>
        <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/favicon.ico"/>
        <link rel="stylesheet" href="{$lps}/lps/includes/console.css" type="text/css"/>
        <title>
          <xsl:choose>
          <xsl:when test="canvas">
            <xsl:value-of select="canvas/@title"/>
          </xsl:when>
          <xsl:otherwise>
            Compilation Errors
          </xsl:otherwise>
          </xsl:choose>
        </title>
        <style type="text/css">
          img {border: 0}
        </style>
        <script language="JavaScript1.1" src="{/canvas/request/@lps}/lps/includes/vbembed.js" type="text/javascript"/>
        <script src="{/canvas/request/@lps}/lps/includes/embed.js" type="text/javascript"/>
      </head>
      <body style="margin: 0">
        <xsl:if test="$isKranking">
          <xsl:attribute name="bgcolor">#EAEAEA</xsl:attribute>
          <div id="krank-header">
            <img src="{$assets}/logo_krank_header.gif"/>
            <span class="status">The optimizer is collecting data.</span>
          </div>
          <center>
            <script type="text/javascript" >
                 lzEmbed({url: '<xsl:value-of select="$assets"/>/startup_small.swf', width: '400', height: '400', id: '<xsl:value-of select="/canvas/@id"/>'});
            </script>
          </center>
          <script type="text/javascript">defaultStatus = 'Optimizing...'</script>
        </xsl:if>
        <xsl:if test="//param[@name='showKrankDuration'] and not($isKranking)">
          <div id="krank-header">
            <img src="{$assets}/logo_krank_header.gif"/>
            <span class="status">Optimization took <xsl:value-of select="//param[@name='showKrankDuration']/@value"/> seconds.</span>
          </div>
        </xsl:if>
        <xsl:if test="/canvas/warnings and not($isKranking)">
          <div style="border-top: 1px solid; border-bottom: 1px solid; background-color: #fcc; padding: 1pt; padding-left: 2pt">
            <a href="#warnings">確認:</a>
            <xsl:text> </xsl:text>
            <xsl:value-of select="count(/canvas/warnings/error)"/>
            <xsl:text> コンパイルワーニング</xsl:text>
            <xsl:if test="count(/canvas/warnings/error) > 1"></xsl:if>。
          </div>
        </xsl:if>
        <xsl:apply-templates select="canvas|errors"/>
      </body>
    </html>
  </xsl:template>
  
  <xsl:template match="canvas">
    <xsl:param name="url" select="request/@url"/>
    <xsl:param name="query_args" select="request/@query_args"/>
    <xsl:choose>
      <!-- In the case of an lzt=html request, ResponderHTML uses string
           concatenation to create the <OBJECT>, <object>, and <embed>
           elements. See the comment in ResponderHTML for an explanation. -->
      <xsl:when test="@pocketpc">
        <OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
          width="{@width}" height="{@height}" id="lzx">
          <PARAM NAME="movie" VALUE="{$url}?lzt=swf"/>
        </OBJECT>
      </xsl:when>
      <xsl:otherwise>
        <div>
          <xsl:if test="not($isKranking)">
            <xsl:attribute name="style">
              <xsl:text>background-color: </xsl:text>
              <xsl:value-of select="/canvas/@bgcolor"/>
            </xsl:attribute>
          </xsl:if>
        <script type="text/javascript">
          lzLPSRoot = '<xsl:value-of select="/canvas/request/@lps"/>';
          lzCanvasRuntimeVersion = <xsl:value-of select="substring(/canvas/@runtime,4)"/> * 1;
          if (lzCanvasRuntimeVersion == 6) {
            lzCanvasRuntimeVersion = 6.65;
          }
          if (isIE &amp;&amp; isWin || detectFlash() >= lzCanvasRuntimeVersion) {
            lzEmbed({url: '<xsl:value-of select="/canvas/request/@url"/>?lzt=swf<xsl:value-of select="/canvas/request/@query_args"/>&amp;__lzhistconn='+top.connuid+'&amp;__lzhisturl=' + escape('<xsl:value-of select="/canvas/request/@lps"/>/lps/includes/h.html?h='), bgcolor: '<xsl:value-of select="/canvas/@bgcolor"/>', width: '<xsl:value-of select="/canvas/@width"/>', height: '<xsl:value-of select="/canvas/@height"/>', id: '<xsl:value-of select="/canvas/@id"/>'}, lzCanvasRuntimeVersion);
            lzHistEmbed(lzLPSRoot);
          } else {
            document.write('Flash player ' + lzCanvasRuntimeVersion + 'が必要です。 <a href="http://www.macromedia.com/go/getflashplayer" target="fpupgrade">ここ</a>からアップグレードしてください。');
          }            
        </script>
        <noscript>
            このアプリケーションの実行にはJavaScriptを有効にする必要があります。
        </noscript>
        </div>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:call-template name="footer"/>
  </xsl:template>
  
  <xsl:template name="footer">
    <xsl:param name="url" select="request/@url"/>
    <xsl:param name="query_args" select="request/@query_args"/>
    <xsl:if test="not($isKranking)">
      <xsl:if test="not(//param[@name='showTaskBar'])">
        <xsl:call-template name="tasks"/>
        <xsl:apply-templates select="info"/>
      </xsl:if>
      <xsl:apply-templates select="warnings"/>
    </xsl:if>
  </xsl:template>
  


  <xsl:template name="tasks">
    <xsl:param name="url" select="request/@url"/>
    <xsl:param name="query_args" select="request/@query_args"/>

    <div id="{$consolefooter}">
    <!-- an embedded SOLO console app to replace the HTML console -->

    <script type="text/javascript">
      lzEmbed({url: '<xsl:value-of select="$lps"/>/lps/admin/dev-console.lzx.swf?lzappuid=<xsl:value-of select="$appuid"/>&amp;lzt=swf&amp;appinfo=<xsl:value-of select="$appinfo"/>', bgcolor: '#9494ad', width: '100%', height: '<xsl:value-of select="$consoleheight"/>'});
    </script>


    <!-- pop up console debugger window -->
<!--
    <script>
     CWin = window.open('<xsl:value-of select="$lps"/>/lps/admin/dev-console-popup.html?lzappuid=<xsl:value-of select="$appuid"/>&amp;lzt=swf&amp;appinfo=<xsl:value-of select="$appinfo"/>', "_blank", "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1,copyhistory=0,width=1250,height=400");
     </script>
-->
    </div>
  </xsl:template>


  <xsl:template match="info">
    <xsl:param name="url" select="../request/@url"/>
    <xsl:param name="query_args" select="../request/@query_args"/>
    <xsl:param name="size" select="@size"/>
    <xsl:param name="gzsize" select="@gz-size"/>
    <xsl:param name="runtime" select="@runtime"/>
    <!-- megabytes * 10 -->
    <xsl:param name="mb10" select="round($size * 10 div 1024 div 1024)"/>
    <xsl:param name="gzmb10" select="round($gzsize * 10 div 1024 div 1024)"/>


    <xsl:choose>
      <xsl:when test="@runtime = 'swf5'">
       <div class="info">
         <b>ランタイムターゲット: </b> <xsl:value-of select="$runtime"/><br/>
         <b>非圧縮アプリケーションサイズ: </b>
         <!-- print "ddK" or "d.dMB" -->
         <xsl:choose>
           <xsl:when test="$mb10 >= 9">
             <xsl:value-of select="floor($mb10 div 10)"/>
             <xsl:text>.</xsl:text>
             <xsl:value-of select="$mb10 mod 10"/>MB
           </xsl:when>
           <xsl:otherwise>
             <xsl:value-of select="round($size div 1024)"/>K
           </xsl:otherwise>
         </xsl:choose>
         <!-- "(ddd,ddd bytes)" -->
         (<xsl:call-template name="decimal">
           <xsl:with-param name="value" select="$size"/>
         </xsl:call-template> bytes)
         <br/><b>圧縮済: </b>
         <xsl:choose>
           <xsl:when test="$gzmb10 >= 9">
             <xsl:value-of select="floor($gzmb10 div 10)"/>
             <xsl:text>.</xsl:text>
             <xsl:value-of select="$gzmb10 mod 10"/>MB
           </xsl:when>
           <xsl:otherwise>
             <xsl:value-of select="round($gzsize div 1024)"/>K
           </xsl:otherwise>
         </xsl:choose>
         <!-- "(ddd,ddd bytes)" -->
         (<xsl:call-template name="decimal">
           <xsl:with-param name="value" select="$gzsize"/>
         </xsl:call-template> bytes)
         <br/><b>エンコーディング: </b> 
         <xsl:value-of select="@encoding"/>
         <xsl:if test="@encoding = ''">非圧縮</xsl:if>;
         <a target="_blank" 
                 href="{$url}?lzt=info{$query_args}">サイズ情報</a>
       </div>
       </xsl:when>

       <!-- Flash 6 and greater runtimes don't have auxiliary gzip files -->
       <xsl:otherwise>
         <div class="info">
           <b>ランタイムターゲット: </b> <xsl:value-of select="$runtime"/><br/>
           <b>アプリケーションサイズ: </b>
           <!-- print "ddK" or "d.dMB" -->
           <xsl:choose>
             <xsl:when test="$mb10 >= 9">
               <xsl:value-of select="floor($mb10 div 10)"/>
               <xsl:text>.</xsl:text>
               <xsl:value-of select="$mb10 mod 10"/>MB
             </xsl:when>
             <xsl:otherwise>
               <xsl:value-of select="round($size div 1024)"/>K
             </xsl:otherwise>
           </xsl:choose>
           <!-- "(ddd,ddd bytes)" -->
           (<xsl:call-template name="decimal">
             <xsl:with-param name="value" select="$size"/>
           </xsl:call-template> bytes)
           <a target="_blank" 
                   href="{$url}?lzt=info{$query_args}">サイズ情報</a>
         </div>
    </xsl:otherwise>
   </xsl:choose>

  </xsl:template>
  
  <!-- prints a decimal with interpolated commas -->
  <xsl:template name="decimal">
    <xsl:param name="value"/>
    <xsl:param name="remainder" select="$value mod 1000"/>
    <xsl:if test="$value &gt; 1000">
      <xsl:call-template name="decimal">
        <xsl:with-param name="value" select="floor($value div 1000)"/>
      </xsl:call-template>
      <xsl:text>,</xsl:text>
      <xsl:if test="$remainder &lt; 100">0</xsl:if>
      <xsl:if test="$remainder &lt; 10">0</xsl:if>
    </xsl:if>
    <xsl:value-of select="$remainder"/>
  </xsl:template>

  <xsl:template match="canvas/warnings">
    <div id="warnings">
      <h2>コンパイルワーニング</h2>
      <pre class="warning">
        <xsl:for-each select="error">
          <xsl:if test="position() > 1">
            <br/>
          </xsl:if>
          <xsl:apply-templates select="."/>
        </xsl:for-each>
      </pre>
    </div>
  </xsl:template>
  
  <xsl:template match="error">
    <xsl:choose>
      <xsl:when test="starts-with(text(), '.tmp_')">
        <xsl:value-of select="substring-after(substring-after(text(), '_'), '_')"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="text()"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="/errors">
    <div style="border-top: 1px solid; border-bottom: 1px solid; background-color: #fcc; padding: 1pt; padding-left: 2pt">
      以下のエラーによりアプリケーションはコンパイルできませんでした。
    </div>
    <h1>コンパイルエラー</h1>
    <code class="error">
      <xsl:apply-templates select="error"/>
    </code>
    <xsl:if test="error/error">
      <div id="warnings">
        <h2>コンパイルワーニング</h2>
        <pre class="warning">
          <xsl:for-each select="error/error">
            <xsl:if test="position() > 1">
              <br/>
            </xsl:if>
            <xsl:apply-templates select="."/>
          </xsl:for-each>
        </pre>
      </div>
    </xsl:if>
      
    <xsl:call-template name="footer"/>
  </xsl:template>

</xsl:stylesheet>
