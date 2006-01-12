<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<html>
  <head>
    <% String path= request.getContextPath(); %>
    <title>LPS Hand tests</title>
    <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/images/laszlo.ico"></head>
    <script language="Javascript">
      
function detectBrowser(){
      var ua = navigator.userAgent;
      var browser='';
      var os='';
      // Guess OS:
      switch (true){
      case (ua.indexOf("Windows NT 5.0")!=-1):
        os='win2k'
        break;
      case (ua.indexOf("Windows NT 5.1")!=-1):
        os='winxp';
        break;
      case (ua.indexOf("Linux")!=-1):
        os='linux';
        break;
      case (ua.indexOf("Mac OS X")!=-1):
        os='osx';
        break;
      default:
        os='';
      }
      // Guess Browser:
      switch (true){
      case (ua.indexOf("MSIE 5.0")!=-1):
        browser='ie5';
        break;
      case (ua.indexOf("MSIE 5.2")!=-1):
        browser='ie52';
        break;
      case (ua.indexOf("MSIE 6")!=-1):
        browser='ie6';
        break;
      case (ua.indexOf("Safari")!=-1):
        browser='safari';
        break;
      case (ua.indexOf("Firefox")!=-1):
        browser='ff';
        break;
      case (ua.indexOf("Netscape/7")!=-1):
        browser='nc7';
        break;
      case (ua.indexOf("Mozilla/5.0")!=-1):
        browser='moz';
        break;
      default:
        browser='';
      }
      frames['navApp'].location.href="platform.lzx?lzt=html&lzr=swf6&filepath=<%= path %>&dbrowser="+browser+"&dos="+os;
      
}
var start=new Date();
start=Date.parse(start)/1000;
var counts=20;

function asurf(){
      if (document.form1.asurf_cb.checked == false){return;}
  var now=new Date();
  now=Date.parse(now)/1000;
  var x=parseInt(counts-(now-start),10);
  if(document.form1){document.form1.clock.value = x;}
  if(x>0){
    timerID=setTimeout("asurf()", 100)
  }else{
    debug = document.form1.debug.checked == true ? '?debug=true' : '';
    index = (index == tests.length ? 0 : index +1 );
    popupPage(tests[index]+debug);
    document.form1.num.value = index;
    document.form1.testcase.value = tests[index];
      start=new Date();
      start=Date.parse(start)/1000;
      if (document.form1.asurf_cb.checked == true){asurf();}
  }
}
</script>
  </head>
    <body bgcolor="#ffffff" marginwidth="0" marginheight="0" topmargin="0" leftmargin="0" onLoad="detectBrowser();">
<table>
<tr><th>test controls</th><th>test results</th></tr><tr>

<td valign="top">
<iframe frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="320" height="200" name="navApp" id="navApp" src="foo"></iframe>
</td>
<td><iframe width="500" height="200" name="resArea" id="resArea" src="results.jsp?offset=&result=&file="></iframe></td>
<td><script>
with (document){
write("<b>AppCodeName:</b> "+navigator.appCodeName+"<br>")
write("<b>AppName:</b> "+navigator.appName+"<br>")
write("<b>AppVersion:</b> "+navigator.appVersion+"<br>")
write("<b>UserAgent:</b> "+navigator.userAgent+"<br>")
write("<b>Platform:</b> "+navigator.platform+"<br>")
}

</script></td>
</tr>
</table>
      <hr>
<table><tr>
<td width="800"><iframe width="800" height="768" name="appArea" id="appArea" src="foo"></iframe></td>
<td width="100%"><iframe width="100%" height="768" name="docArea" id="docArea" src="foo"></iframe></td>
</tr></table>
<br>
      <address><a href="mailto:mdavis@laszlosystems.com">Mark Davis</a></address>
      <!-- Created: Mon Jul 21 12:45:52 PDT 2003 -->
      <!-- hhmts start -->
Last modified: Thu Jan 20 14:38:27 PST 2005
<!-- hhmts end -->

    </body>
</html>
