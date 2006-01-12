<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<html>
  <head>
    <title>LPS Hand tests</title>
    <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/images/laszlo.ico"></head>
    <script language="Javascript">
var tests = [
<%@ include file="all_lzx.txt" %>
];
var index=-1;
function popupPage(url) {
frames['appArea'].location.href=url;
}

function next(){
debug = document.form1.debug.checked == true ? '?debug=true' : '';
index = (index == tests.length ? 0 : index +1 );
popupPage(tests[index]+debug);
document.form1.num.value = index;
document.form1.testcase.value = tests[index];
}
function pass(){
frames['resArea'].location.href="results.jsp?offset="+index+"&result=1#"+index;
next();
}
function fail(){
frames['resArea'].location.href="results.jsp?offset="+index+"&result=2#"+index;
next();
}
function last(){
debug = document.form1.debug.checked == true ? '?debug=true' : '';
index = (index == -1 ? tests.length : index -1 );
popupPage(tests[index]+debug);
document.form1.num.value = index;
document.form1.testcase.value =  tests[index];
}
function rload(){
debug = document.form1.debug.checked == true ? '?debug=true' : '';
popupPage(tests[index]+debug);
document.form1.num.value = index;
document.form1.testcase.value =  tests[index];
}
function ccache(){
popupPage(tests[index]+'?lzt=clearcache');
document.form1.num.value = index;
document.form1.testcase.value =  tests[index];
}
function jump(){
debug = document.form1.debug.checked == true ? '?debug=true' : '';
index = parseInt(document.form1.dest.value);
popupPage(tests[index]+debug);
document.form1.num.value = index;
document.form1.testcase.value =  tests[index];
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
    <body bgcolor="#ffffff" marginwidth="0" marginheight="0" topmargin="0" leftmargin="0" onLoad="document.form1.total.value=tests.length;">
<i>Make sure that you have run "getlzx.sh" and "ant doc"</i>
<table>
<tr><th>test controls</th><th>test results</th></tr><tr>
<td valign="top">
<form name=form1>
<input type="button" value="Next" onClick="next();">
<input type="button" value="Last" onClick="last();"> 
<input type="button" value="Pass" onClick="pass();">
<input type="button" value="Fail" onClick="fail();"> 
<input type="button" value="Clear Cache" onClick="ccache();"> <br>
Debugger: <input type="checkbox" name="debug" onClick="rload();" checked>
Auto Surf (20 seconds): <input type=checkbox name="asurf_cb" 
onClick="start=new Date();start=Date.parse(start)/1000;asurf();">
<iNPUT TYPE="text" NAME="clock" SIZE="2"> 
<br>
Test <INPUT TYPE="text" NAME="num" SIZE="4"> of <iNPUT TYPE="text" NAME="total" SIZE="4">
<input type=button value="Jump to #" onClick="jump();"><iNPUT TYPE="text" NAME="dest" SIZE="4">
 <br>
Filename:<iNPUT TYPE="text" NAME="testcase" SIZE="40">
</form>
</td>
<td><iframe width="500" height="150" name="resArea" id="resArea" src="results.jsp?offset=&result="></iframe></td>
</tr>
</table>
      <hr>
<iframe width="1024" height="768" name="appArea" id="appArea" src="foo"></iframe></td>
<br>
      <address><a href="mailto:mdavis@laszlosystems.com">Mark Davis</a></address>
      <!-- Created: Mon Jul 21 12:45:52 PDT 2003 -->
      <!-- hhmts start -->
Last modified: Thu Jul 22 11:47:19 PDT 2004
<!-- hhmts end -->
    </body>
</html>
