LzResourceLibrary.lzfocusbracket_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft.png","lps/components/lz/resources/focus/focus_top_rt.png","lps/components/lz/resources/focus/focus_bot_lft.png","lps/components/lz/resources/focus/focus_bot_rt.png"],width:7,height:7,sprite:"lps/components/lz/resources/focus/focus_top_lft.sprite.png",spriteoffset:0};LzResourceLibrary.lzfocusbracket_shdw={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft_shdw.png","lps/components/lz/resources/focus/focus_top_rt_shdw.png","lps/components/lz/resources/focus/focus_bot_lft_shdw.png","lps/components/lz/resources/focus/focus_bot_rt_shdw.png"],width:9,height:9,sprite:"lps/components/lz/resources/focus/focus_top_lft_shdw.sprite.png",spriteoffset:7};LzResourceLibrary.lzbutton_face_rsc={ptype:"sr",frames:["lps/components/lz/resources/button/simpleface_up.png","lps/components/lz/resources/button/simpleface_mo.png","lps/components/lz/resources/button/simpleface_dn.png","lps/components/lz/resources/button/autoPng/simpleface_dsbl.png"],width:2,height:18,sprite:"lps/components/lz/resources/button/simpleface_up.sprite.png",spriteoffset:16};LzResourceLibrary.lzbutton_bezel_inner_rsc={ptype:"sr",frames:["lps/components/lz/resources/autoPng/bezel_inner_up.png","lps/components/lz/resources/autoPng/bezel_inner_up.png","lps/components/lz/resources/autoPng/bezel_inner_dn.png","lps/components/lz/resources/autoPng/outline_dsbl.png"],width:500,height:500,sprite:"lps/components/lz/resources/autoPng/bezel_inner_up.sprite.png",spriteoffset:34};LzResourceLibrary.lzbutton_bezel_outer_rsc={ptype:"sr",frames:["lps/components/lz/resources/autoPng/bezel_outer_up.png","lps/components/lz/resources/autoPng/bezel_outer_up.png","lps/components/lz/resources/autoPng/bezel_outer_dn.png","lps/components/lz/resources/autoPng/transparent.png","lps/components/lz/resources/autoPng/default_outline.png"],width:500,height:500,sprite:"lps/components/lz/resources/autoPng/bezel_outer_up.sprite.png",spriteoffset:534};LzResourceLibrary.lzcheckbox_rsrc={ptype:"sr",frames:["lps/components/lz/resources/checkbox/autoPng/checkbox_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_off_mo.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on.png","lps/components/lz/resources/checkbox/autoPng/checkbox_disable_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on_mo.png","lps/components/lz/resources/checkbox/autoPng/checkbox_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_disable_on.png"],width:15,height:14,sprite:"lps/components/lz/resources/checkbox/autoPng/checkbox_off.sprite.png",spriteoffset:1034};LzResourceLibrary.lzradio_rsrc={ptype:"sr",frames:["lps/components/lz/resources/radio/autoPng/radiobtn_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_mo.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_dn.png"],width:14,height:14,sprite:"lps/components/lz/resources/radio/autoPng/radiobtn_up.sprite.png",spriteoffset:1048};LzResourceLibrary.footer_logo={ptype:"sr",frames:["lps/assets/logo_laszlo_footer.gif"],width:69.92950439453125,height:69.92950439453125,spriteoffset:1062};LzResourceLibrary.__allcss={path:"dev-console.sprite.png"};var appdata=null;var main=null;var rg_runtime=null;var rb8=null;var rb9=null;var rb10=null;var rbdhtml=null;var cb_debug=null;var cb_backtrace=null;var cb_usemastersprite=null;var cb_remotedebug=null;Class.make("$lzc$class_m2",["copyright",void 0,"app_runtime",void 0,"runtime_dhtml_enabled",void 0,"runtime_swf8_enabled",void 0,"runtime_swf9_enabled",void 0,"runtime_swf10_enabled",void 0,"app_debug",void 0,"app_backtrace",void 0,"app_console_debug",void 0,"app_floating_window",void 0,"app_fullpath",void 0,"app_query",void 0,"app_opt_url",void 0,"app_unopt_url",void 0,"app_url",void 0,"app_opt_exists",void 0,"app_lps_root",void 0,"app_lzt",void 0,"app_uid",void 0,"app_usemastersprite",void 0,"$m1",function($0){
with(this){
appdata.setAttribute("initialdata",lz.Browser.getInitArg("appinfo"));setAttribute("app_runtime",appdata.getPointer().xpathQuery("/info/@runtime"));this.setupRuntimes();if(app_runtime==null){
setAttribute("app_runtime",appdata.getPointer().xpathQuery("/request/param[@name = 'lzr']/@value"))
};setAttribute("app_debug",appdata.getPointer().xpathQuery("/request/param[@name = 'debug']/@value"));setAttribute("app_backtrace",appdata.getPointer().xpathQuery("/request/param[@name = 'lzbacktrace']/@value"));if(app_debug=="y")app_debug="true";setAttribute("app_console_debug",appdata.getPointer().xpathQuery("/request/@console-remote-debug")=="true");setAttribute("app_floating_window",appdata.getPointer().xpathQuery("/request/@console-floating-window")=="true");setAttribute("app_fullpath",appdata.getPointer().xpathQuery("/request/@fullpath"));setAttribute("app_query",appdata.getPointer().xpathQuery("/request/@query_args"));setAttribute("app_opt_url",appdata.getPointer().xpathQuery("/request/@opt-url"));setAttribute("app_unopt_url",appdata.getPointer().xpathQuery("/request/@unopt-url"));setAttribute("app_url",appdata.getPointer().xpathQuery("/request/@url"));setAttribute("app_opt_exists",appdata.getPointer().xpathQuery("/request/@opt-exists"));setAttribute("app_lps_root",appdata.getPointer().xpathQuery("/request/@lps"));setAttribute("app_lzt",null);setAttribute("app_uid",app_fullpath);setAttribute("lzr","dhtml");var $1=LzParam.parseQueryString(app_query);setAttribute("app_usemastersprite",$1.lzusemastersprite);canvas.width=document.body.clientWidth
}},"setupRuntimes",function(){
with(this){
var $0=lz.Browser.getInitArg("runtimes").split(",");for(var $1 in $0){
if($0[$1]=="dhtml")canvas.setAttribute("runtime_dhtml_enabled",true);if($0[$1]=="swf8")canvas.setAttribute("runtime_swf8_enabled",true);if($0[$1]=="swf9")canvas.setAttribute("runtime_swf9_enabled",true);if($0[$1]=="swf10")canvas.setAttribute("runtime_swf10_enabled",true)
}}},"deploySOLO",function(){
with(this){
var $0=escape(app_fullpath.substring(app_lps_root.length));if(app_runtime=="dhtml"){
var $1=app_lps_root+"/lps/admin/solo-dhtml-deploy.jsp?appurl="+$0
}else{
var $1=app_lps_root+"/lps/admin/solo-deploy.jsp?appurl="+$0+"&runtime="+app_runtime
};this.loadURL($1,"_blank")
}},"debugApp",function(){
with(this){
cb_debug.setValue(true);canvas.reloadApp()
}},"viewSource",function(){
with(this){
setAttribute("app_lzt","source");canvas.reloadApp()
}},"viewWrapper",function(){
with(this){
setAttribute("app_lzt","deployment");canvas.reloadApp()
}},"viewDocs",function(){
with(this){
var $0=app_lps_root+"/index.html";this.loadURL($0)
}},"viewDev",function(){
var $0="http://www.openlaszlo.org/community";this.loadURL($0)
},"viewForums",function(){
var $0="http://forum.openlaszlo.org/";this.loadURL($0)
},"loadURL",function($0,$1){
with(this){
switch(arguments.length){
case 1:
$1="_top";

};lz.Browser.loadURL($0,$1)
}},"gotoApp",function(){
with(this){
var $0=app_fullpath.substring(0,app_fullpath.length-4)+".lzx";setAttribute("app_fullpath",$0);this.reloadApp()
}},"reloadApp",function(){
with(this){
var $0=rg_runtime.value;var $1=cb_debug.value;var $2=cb_backtrace.value;var $3=cb_remotedebug.value;var $4=new LzParam();var $5=LzParam.parseQueryString(app_query);$5["debug"]=$1;$5["lzbacktrace"]=$2;$5["lzr"]=$0;$5["lzusemastersprite"]=cb_usemastersprite.value;if($0!="dhtml"){
delete $5["lzusemastersprite"]
};if($3){
$5["lzconsoledebug"]=true;$5["debug"]=true
}else{
delete $5.lzconsoledebug;delete $5.remotedebug
};if(app_lzt!=null){
$5["lzt"]=app_lzt
};if($5.debug+""=="false"){
delete $5["debug"]
}else{
$5.debug="true"
};if($5.lzbacktrace+""=="false"){
delete $5["lzbacktrace"]
}else{
$5.lzbacktrace="true"
};var $6={};for(var $7 in $5){
if($7=="")continue;if($7.indexOf("#38;")!=-1){
var $8=$7.indexOf("#38;");$7=$7.substring($8+4,$7.length)
};if($6[$7])continue;$4.setValue($7,$5[$7]);$6[$7]=true
};var $9=app_fullpath+"?"+$4.serialize();this.loadURL($9)
}},"displayObjectByID",function($0){
with(this){
receivingLC.send(appListenerName,"displayObj",$0)
}},"showLogMessage",function($0){
with(this){
console.writeRaw(lz.Browser.xmlEscape($0)+"<br>")
}},"showWarning",function($0,$1,$2){
with(this){
console.writeRaw($2)
}},"sendConsoleAlive",function(){
with(this){
if(receivingLC==null){
var $0=new remoteConnectionListener();canvas.setAttribute("consoleListenerName","lc_consoledebug"+app_uid);canvas.setAttribute("appListenerName","lc_appdebug"+app_uid);canvas.setAttribute("receivingLC",$0.setupConnection());receivingLC.send(appListenerName,"consoleAlive",true)
}else{
console.writeRaw('<font color="#FF0000">Connection is already open to app.</font><br/>')
}}},"remoteEval",function($0){
with(this){
receivingLC.send(appListenerName,"evalExpr",$0)
}},"receivingLC",void 0,"consolelistenerName",void 0,"appListenerName",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzCanvas,["attributes",new LzInheritedHash(LzCanvas.attributes)]);canvas=new $lzc$class_m2(null,{$delegates:["oninit","$m1",null],__LZproxied:"true",appListenerName:void 0,app_backtrace:void 0,app_console_debug:void 0,app_debug:void 0,app_floating_window:void 0,app_fullpath:void 0,app_lps_root:void 0,app_lzt:void 0,app_opt_exists:void 0,app_opt_url:void 0,app_query:void 0,app_runtime:void 0,app_uid:void 0,app_unopt_url:void 0,app_url:void 0,app_usemastersprite:void 0,appbuilddate:"2010-05-07T19:52:41Z",bgcolor:8750489,consolelistenerName:void 0,copyright:"Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.  Use is subject to license terms.",embedfonts:true,font:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",height:370,lpsbuild:"16314 /Users/maxcarlson/openlaszlo/trunk-clean",lpsbuilddate:"2010-05-07T09:57:41Z",lpsrelease:"Latest",lpsversion:"5.0.x",proxied:false,receivingLC:void 0,runtime:"dhtml",runtime_dhtml_enabled:false,runtime_swf10_enabled:false,runtime_swf8_enabled:false,runtime_swf9_enabled:false,width:"100%"});lz.colors.offwhite=15921906;lz.colors.gray10=1710618;lz.colors.gray20=3355443;lz.colors.gray30=5066061;lz.colors.gray40=6710886;lz.colors.gray50=8355711;lz.colors.gray60=10066329;lz.colors.gray70=11776947;lz.colors.gray80=13421772;lz.colors.gray90=15066597;lz.colors.iceblue1=3298963;lz.colors.iceblue2=5472718;lz.colors.iceblue3=12240085;lz.colors.iceblue4=14017779;lz.colors.iceblue5=15659509;lz.colors.palegreen1=4290113;lz.colors.palegreen2=11785139;lz.colors.palegreen3=12637341;lz.colors.palegreen4=13888170;lz.colors.palegreen5=15725032;lz.colors.gold1=9331721;lz.colors.gold2=13349195;lz.colors.gold3=15126388;lz.colors.gold4=16311446;lz.colors.sand1=13944481;lz.colors.sand2=14276546;lz.colors.sand3=15920859;lz.colors.sand4=15986401;lz.colors.ltpurple1=6575768;lz.colors.ltpurple2=12038353;lz.colors.ltpurple3=13353453;lz.colors.ltpurple4=15329264;lz.colors.grayblue=12501704;lz.colors.graygreen=12635328;lz.colors.graypurple=10460593;lz.colors.ltblue=14540287;lz.colors.ltgreen=14548957;Class.make("$lzc$class_basefocusview",["active",void 0,"$lzc$set_active",function($0){
with(this){
setActive($0)
}},"target",void 0,"$lzc$set_target",function($0){
with(this){
setTarget($0)
}},"duration",void 0,"_animatorcounter",void 0,"ontarget",void 0,"_nexttarget",void 0,"onactive",void 0,"_xydelegate",void 0,"_widthdel",void 0,"_heightdel",void 0,"_delayfadeoutDL",void 0,"_dofadeout",void 0,"_onstopdel",void 0,"reset",function(){
with(this){
this.setAttribute("x",0);this.setAttribute("y",0);this.setAttribute("width",canvas.width);this.setAttribute("height",canvas.height);setTarget(null)
}},"setActive",function($0){
this.active=$0;if(this.onactive)this.onactive.sendEvent($0)
},"doFocus",function($0){
with(this){
this._dofadeout=false;this.bringToFront();if(this.target)this.setTarget(null);this.setAttribute("visibility",this.active?"visible":"hidden");this._nexttarget=$0;if(visible){
this._animatorcounter+=1;var $1=null;var $2;var $3;var $4;var $5;if($0["getFocusRect"])$1=$0.getFocusRect();if($1){
$2=$1[0];$3=$1[1];$4=$1[2];$5=$1[3]
}else{
$2=$0.getAttributeRelative("x",canvas);$3=$0.getAttributeRelative("y",canvas);$4=$0.getAttributeRelative("width",canvas);$5=$0.getAttributeRelative("height",canvas)
};var $6=this.animate("x",$2,duration);this.animate("y",$3,duration);this.animate("width",$4,duration);this.animate("height",$5,duration);if(this.capabilities["minimize_opacity_changes"]){
this.setAttribute("visibility","visible")
}else{
this.animate("opacity",1,500)
};if(!this._onstopdel)this._onstopdel=new LzDelegate(this,"stopanim");this._onstopdel.register($6,"onstop")
};if(this._animatorcounter<1){
this.setTarget(this._nexttarget);var $1=null;var $2;var $3;var $4;var $5;if($0["getFocusRect"])$1=$0.getFocusRect();if($1){
$2=$1[0];$3=$1[1];$4=$1[2];$5=$1[3]
}else{
$2=$0.getAttributeRelative("x",canvas);$3=$0.getAttributeRelative("y",canvas);$4=$0.getAttributeRelative("width",canvas);$5=$0.getAttributeRelative("height",canvas)
};this.setAttribute("x",$2);this.setAttribute("y",$3);this.setAttribute("width",$4);this.setAttribute("height",$5)
}}},"stopanim",function($0){
with(this){
this._animatorcounter-=1;if(this._animatorcounter<1){
this._dofadeout=true;if(!this._delayfadeoutDL)this._delayfadeoutDL=new LzDelegate(this,"fadeout");lz.Timer.addTimer(this._delayfadeoutDL,1000);this.setTarget(_nexttarget);this._onstopdel.unregisterAll()
}}},"fadeout",function($0){
with(this){
if(_dofadeout){
if(this.capabilities["minimize_opacity_changes"]){
this.setAttribute("visibility","hidden")
}else{
this.animate("opacity",0,500)
}};this._delayfadeoutDL.unregisterAll()
}},"setTarget",function($0){
with(this){
this.target=$0;if(!this._xydelegate){
this._xydelegate=new LzDelegate(this,"followXY")
}else{
this._xydelegate.unregisterAll()
};if(!this._widthdel){
this._widthdel=new LzDelegate(this,"followWidth")
}else{
this._widthdel.unregisterAll()
};if(!this._heightdel){
this._heightdel=new LzDelegate(this,"followHeight")
}else{
this._heightdel.unregisterAll()
};if(this.target==null)return;var $1=$0;var $2=0;while($1!=canvas){
this._xydelegate.register($1,"onx");this._xydelegate.register($1,"ony");$1=$1.immediateparent;$2++
};this._widthdel.register($0,"onwidth");this._heightdel.register($0,"onheight");followXY(null);followWidth(null);followHeight(null)
}},"followXY",function($0){
with(this){
var $1=null;if(target["getFocusRect"])$1=target.getFocusRect();if($1){
this.setAttribute("x",$1[0]);this.setAttribute("y",$1[1])
}else{
this.setAttribute("x",this.target.getAttributeRelative("x",canvas));this.setAttribute("y",this.target.getAttributeRelative("y",canvas))
}}},"followWidth",function($0){
with(this){
var $1=null;if(target["getFocusRect"])$1=target.getFocusRect();if($1){
this.setAttribute("width",$1[2])
}else{
this.setAttribute("width",this.target.width)
}}},"followHeight",function($0){
with(this){
var $1=null;if(target["getFocusRect"])$1=target.getFocusRect();if($1){
this.setAttribute("height",$1[3])
}else{
this.setAttribute("height",this.target.height)
}}},"$m3",function(){
with(this){
var $0=lz.Focus;return $0
}},"$m4",function($0){
with(this){
this.setActive(lz.Focus.focuswithkey);if($0){
this.doFocus($0)
}else{
this.reset();if(this.active){
this.setActive(false)
}}}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["tagname","basefocusview","attributes",new LzInheritedHash(LzView.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({$delegates:["onstop","stopanim",null,"onfocus","$m4","$m3"],_animatorcounter:0,_delayfadeoutDL:null,_dofadeout:false,_heightdel:null,_nexttarget:null,_onstopdel:null,_widthdel:null,_xydelegate:null,active:false,duration:400,initstage:"late",onactive:LzDeclaredEvent,ontarget:LzDeclaredEvent,options:{ignorelayout:true},target:null,visible:false},$lzc$class_basefocusview.attributes)
}}})($lzc$class_basefocusview);Class.make("$lzc$class_m21",["$m5",function($0){
with(this){
var $1=-classroot.offset;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m6",function(){
with(this){
return [classroot,"offset"]
}},"$m7",function($0){
with(this){
var $1=-classroot.offset;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m8",function(){
with(this){
return [classroot,"offset"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["children",[{attrs:{$classrootdepth:2,opacity:0.25,resource:"lzfocusbracket_shdw",x:1,y:1},"class":LzView},{attrs:{$classrootdepth:2,resource:"lzfocusbracket_rsrc"},"class":LzView}],"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m22",["$m9",function($0){
with(this){
var $1=parent.width-width+classroot.offset;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m10",function(){
with(this){
return [parent,"width",this,"width",classroot,"offset"]
}},"$m11",function($0){
with(this){
var $1=-classroot.offset;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m12",function(){
with(this){
return [classroot,"offset"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["children",[{attrs:{$classrootdepth:2,frame:2,opacity:0.25,resource:"lzfocusbracket_shdw",x:1,y:1},"class":LzView},{attrs:{$classrootdepth:2,frame:2,resource:"lzfocusbracket_rsrc"},"class":LzView}],"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m23",["$m13",function($0){
with(this){
var $1=-classroot.offset;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m14",function(){
with(this){
return [classroot,"offset"]
}},"$m15",function($0){
with(this){
var $1=parent.height-height+classroot.offset;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m16",function(){
with(this){
return [parent,"height",this,"height",classroot,"offset"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["children",[{attrs:{$classrootdepth:2,frame:3,opacity:0.25,resource:"lzfocusbracket_shdw",x:1,y:1},"class":LzView},{attrs:{$classrootdepth:2,frame:3,resource:"lzfocusbracket_rsrc"},"class":LzView}],"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m24",["$m17",function($0){
with(this){
var $1=parent.width-width+classroot.offset;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m18",function(){
with(this){
return [parent,"width",this,"width",classroot,"offset"]
}},"$m19",function($0){
with(this){
var $1=parent.height-height+classroot.offset;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m20",function(){
with(this){
return [parent,"height",this,"height",classroot,"offset"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["children",[{attrs:{$classrootdepth:2,frame:4,opacity:0.25,resource:"lzfocusbracket_shdw",x:1,y:1},"class":LzView},{attrs:{$classrootdepth:2,frame:4,resource:"lzfocusbracket_rsrc"},"class":LzView}],"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_focusoverlay",["offset",void 0,"topleft",void 0,"topright",void 0,"bottomleft",void 0,"bottomright",void 0,"doFocus",function($0){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["doFocus"]||this.nextMethod(arguments.callee,"doFocus")).call(this,$0);if(visible)this.bounce()
}},"bounce",function(){
with(this){
this.animate("offset",12,duration/2);this.animate("offset",5,duration)
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_basefocusview,["tagname","focusoverlay","children",[{attrs:{$classrootdepth:1,name:"topleft",x:new LzAlwaysExpr("$m5","$m6"),y:new LzAlwaysExpr("$m7","$m8")},"class":$lzc$class_m21},{attrs:{$classrootdepth:1,name:"topright",x:new LzAlwaysExpr("$m9","$m10"),y:new LzAlwaysExpr("$m11","$m12")},"class":$lzc$class_m22},{attrs:{$classrootdepth:1,name:"bottomleft",x:new LzAlwaysExpr("$m13","$m14"),y:new LzAlwaysExpr("$m15","$m16")},"class":$lzc$class_m23},{attrs:{$classrootdepth:1,name:"bottomright",x:new LzAlwaysExpr("$m17","$m18"),y:new LzAlwaysExpr("$m19","$m20")},"class":$lzc$class_m24}],"attributes",new LzInheritedHash($lzc$class_basefocusview.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({offset:5},$lzc$class_focusoverlay.attributes)
}}})($lzc$class_focusoverlay);Class.make("$lzc$class__componentmanager",["focusclass",void 0,"keyhandlers",void 0,"lastsdown",void 0,"lastedown",void 0,"defaults",void 0,"currentdefault",void 0,"defaultstyle",void 0,"ondefaultstyle",void 0,"init",function(){
with(this){
var $0=this.focusclass;if(typeof canvas.focusclass!="undefined"){
$0=canvas.focusclass
};if($0!=null){
canvas.__focus=new (lz[$0])(canvas);canvas.__focus.reset()
};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this)
}},"_lastkeydown",void 0,"upkeydel",void 0,"$m25",function(){
with(this){
var $0=lz.Keys;return $0
}},"dispatchKeyDown",function($0){
with(this){
var $1=false;if($0==32){
this.lastsdown=null;var $2=lz.Focus.getFocus();if($2 instanceof lz.basecomponent){
$2.doSpaceDown();this.lastsdown=$2
};$1=true
}else if($0==13&&this.currentdefault){
this.lastedown=this.currentdefault;this.currentdefault.doEnterDown();$1=true
};if($1){
if(!this.upkeydel)this.upkeydel=new LzDelegate(this,"dispatchKeyTimer");this._lastkeydown=$0;lz.Timer.addTimer(this.upkeydel,50)
}}},"dispatchKeyTimer",function($0){
if(this._lastkeydown==32&&this.lastsdown!=null){
this.lastsdown.doSpaceUp();this.lastsdown=null
}else if(this._lastkeydown==13&&this.currentdefault&&this.currentdefault==this.lastedown){
this.currentdefault.doEnterUp()
}},"findClosestDefault",function($0){
with(this){
if(!this.defaults){
return null
};var $1=null;var $2=null;var $3=this.defaults;$0=$0||canvas;var $4=lz.ModeManager.getModalView();for(var $5=0;$5<$3.length;$5++){
var $6=$3[$5];if($4&&!$6.childOf($4)){
continue
};var $7=this.findCommonParent($6,$0);if($7&&(!$1||$7.nodeLevel>$1.nodeLevel)){
$1=$7;$2=$6
}};return $2
}},"findCommonParent",function($0,$1){
while($0.nodeLevel>$1.nodeLevel){
$0=$0.immediateparent;if(!$0.visible)return null
};while($1.nodeLevel>$0.nodeLevel){
$1=$1.immediateparent;if(!$1.visible)return null
};while($0!=$1){
$0=$0.immediateparent;$1=$1.immediateparent;if(!$0.visible||!$1.visible)return null
};return $0
},"makeDefault",function($0){
with(this){
if(!this.defaults)this.defaults=[];this.defaults.push($0);this.checkDefault(lz.Focus.getFocus())
}},"unmakeDefault",function($0){
with(this){
if(!this.defaults)return;for(var $1=0;$1<this.defaults.length;$1++){
if(this.defaults[$1]==$0){
this.defaults.splice($1,1);this.checkDefault(lz.Focus.getFocus());return
}}}},"$m26",function(){
with(this){
var $0=lz.Focus;return $0
}},"checkDefault",function($0){
with(this){
if(!($0 instanceof lz.basecomponent)||!$0.doesenter){
if($0 instanceof lz.inputtext&&$0.multiline){
$0=null
}else{
$0=this.findClosestDefault($0)
}};if($0==this.currentdefault)return;if(this.currentdefault){
this.currentdefault.setAttribute("hasdefault",false)
};this.currentdefault=$0;if($0){
$0.setAttribute("hasdefault",true)
}}},"$m27",function(){
with(this){
var $0=lz.ModeManager;return $0
}},"$m28",function($0){
with(this){
switch(arguments.length){
case 0:
$0=null;

};if(lz.Focus.getFocus()==null){
this.checkDefault(null)
}}},"setDefaultStyle",function($0){
this.defaultstyle=$0;if(this.ondefaultstyle)this.ondefaultstyle.sendEvent($0)
},"getDefaultStyle",function(){
with(this){
if(this.defaultstyle==null){
this.defaultstyle=new (lz.style)(canvas,{isdefault:true})
};return this.defaultstyle
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzNode,["tagname","_componentmanager","attributes",new LzInheritedHash(LzNode.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({$delegates:["onkeydown","dispatchKeyDown","$m25","onfocus","checkDefault","$m26","onmode","$m28","$m27"],_lastkeydown:0,currentdefault:null,defaults:null,defaultstyle:null,focusclass:"focusoverlay",keyhandlers:null,lastedown:null,lastsdown:null,ondefaultstyle:LzDeclaredEvent,upkeydel:null},$lzc$class__componentmanager.attributes)
}}})($lzc$class__componentmanager);Class.make("$lzc$class_style",["isstyle",void 0,"$m29",function($0){
with(this){
this.setAttribute("canvascolor",LzColorUtils.convertColor("null"))
}},"canvascolor",void 0,"$lzc$set_canvascolor",function($0){
with(this){
setCanvasColor($0)
}},"$m30",function($0){
with(this){
this.setAttribute("textcolor",LzColorUtils.convertColor("gray10"))
}},"textcolor",void 0,"$lzc$set_textcolor",function($0){
with(this){
setStyleAttr($0,"textcolor")
}},"$m31",function($0){
with(this){
this.setAttribute("textfieldcolor",LzColorUtils.convertColor("white"))
}},"textfieldcolor",void 0,"$lzc$set_textfieldcolor",function($0){
with(this){
setStyleAttr($0,"textfieldcolor")
}},"$m32",function($0){
with(this){
this.setAttribute("texthilitecolor",LzColorUtils.convertColor("iceblue1"))
}},"texthilitecolor",void 0,"$lzc$set_texthilitecolor",function($0){
with(this){
setStyleAttr($0,"texthilitecolor")
}},"$m33",function($0){
with(this){
this.setAttribute("textselectedcolor",LzColorUtils.convertColor("black"))
}},"textselectedcolor",void 0,"$lzc$set_textselectedcolor",function($0){
with(this){
setStyleAttr($0,"textselectedcolor")
}},"$m34",function($0){
with(this){
this.setAttribute("textdisabledcolor",LzColorUtils.convertColor("gray60"))
}},"textdisabledcolor",void 0,"$lzc$set_textdisabledcolor",function($0){
with(this){
setStyleAttr($0,"textdisabledcolor")
}},"$m35",function($0){
with(this){
this.setAttribute("basecolor",LzColorUtils.convertColor("offwhite"))
}},"basecolor",void 0,"$lzc$set_basecolor",function($0){
with(this){
setStyleAttr($0,"basecolor")
}},"$m36",function($0){
with(this){
this.setAttribute("bgcolor",LzColorUtils.convertColor("white"))
}},"bgcolor",void 0,"$lzc$set_bgcolor",function($0){
with(this){
setStyleAttr($0,"bgcolor")
}},"$m37",function($0){
with(this){
this.setAttribute("hilitecolor",LzColorUtils.convertColor("iceblue4"))
}},"hilitecolor",void 0,"$lzc$set_hilitecolor",function($0){
with(this){
setStyleAttr($0,"hilitecolor")
}},"$m38",function($0){
with(this){
this.setAttribute("selectedcolor",LzColorUtils.convertColor("iceblue3"))
}},"selectedcolor",void 0,"$lzc$set_selectedcolor",function($0){
with(this){
setStyleAttr($0,"selectedcolor")
}},"$m39",function($0){
with(this){
this.setAttribute("disabledcolor",LzColorUtils.convertColor("gray30"))
}},"disabledcolor",void 0,"$lzc$set_disabledcolor",function($0){
with(this){
setStyleAttr($0,"disabledcolor")
}},"$m40",function($0){
with(this){
this.setAttribute("bordercolor",LzColorUtils.convertColor("gray40"))
}},"bordercolor",void 0,"$lzc$set_bordercolor",function($0){
with(this){
setStyleAttr($0,"bordercolor")
}},"$m41",function($0){
this.setAttribute("bordersize",1)
},"bordersize",void 0,"$lzc$set_bordersize",function($0){
with(this){
setStyleAttr($0,"bordersize")
}},"$m42",function($0){
with(this){
this.setAttribute("menuitembgcolor",LzColorUtils.convertColor("textfieldcolor"))
}},"menuitembgcolor",void 0,"isdefault",void 0,"$lzc$set_isdefault",function($0){
with(this){
_setdefault($0)
}},"onisdefault",void 0,"_setdefault",function($0){
with(this){
this.isdefault=$0;if(isdefault){
lz._componentmanager.service.setDefaultStyle(this);if(this["canvascolor"]!=null){
canvas.setAttribute("bgcolor",this.canvascolor)
}};if(this.onisdefault)this.onisdefault.sendEvent(this)
}},"onstylechanged",void 0,"setStyleAttr",function($0,$1){
this[$1]=$0;if(this["on"+$1])this["on"+$1].sendEvent($1);if(this.onstylechanged)this.onstylechanged.sendEvent(this)
},"setCanvasColor",function($0){
with(this){
if(this.isdefault&&$0!=null){
canvas.setAttribute("bgcolor",$0)
};this.canvascolor=$0;if(this.onstylechanged)this.onstylechanged.sendEvent(this)
}},"extend",function($0){
with(this){
var $1=new (lz.style)();$1.canvascolor=this.canvascolor;$1.textcolor=this.textcolor;$1.textfieldcolor=this.textfieldcolor;$1.texthilitecolor=this.texthilitecolor;$1.textselectedcolor=this.textselectedcolor;$1.textdisabledcolor=this.textdisabledcolor;$1.basecolor=this.basecolor;$1.bgcolor=this.bgcolor;$1.hilitecolor=this.hilitecolor;$1.selectedcolor=this.selectedcolor;$1.disabledcolor=this.disabledcolor;$1.bordercolor=this.bordercolor;$1.bordersize=this.bordersize;$1.menuitembgcolor=this.menuitembgcolor;$1.isdefault=this.isdefault;for(var $2 in $0){
$1[$2]=$0[$2]
};new LzDelegate($1,"_forwardstylechanged",this,"onstylechanged");return $1
}},"_forwardstylechanged",function($0){
if(this.onstylechanged)this.onstylechanged.sendEvent(this)
},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzNode,["tagname","style","attributes",new LzInheritedHash(LzNode.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({basecolor:new LzOnceExpr("$m35"),bgcolor:new LzOnceExpr("$m36"),bordercolor:new LzOnceExpr("$m40"),bordersize:new LzOnceExpr("$m41"),canvascolor:new LzOnceExpr("$m29"),disabledcolor:new LzOnceExpr("$m39"),hilitecolor:new LzOnceExpr("$m37"),isdefault:false,isstyle:true,menuitembgcolor:new LzOnceExpr("$m42"),onisdefault:LzDeclaredEvent,onstylechanged:LzDeclaredEvent,selectedcolor:new LzOnceExpr("$m38"),textcolor:new LzOnceExpr("$m30"),textdisabledcolor:new LzOnceExpr("$m34"),textfieldcolor:new LzOnceExpr("$m31"),texthilitecolor:new LzOnceExpr("$m32"),textselectedcolor:new LzOnceExpr("$m33")},$lzc$class_style.attributes)
}}})($lzc$class_style);canvas.LzInstantiateView({"class":lz.script,attrs:{script:function(){
lz._componentmanager.service=new (lz._componentmanager)(canvas,null,null,true)
}}},1);Class.make("$lzc$class_statictext",["$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzText,["tagname","statictext","attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_basecomponent",["enabled",void 0,"$lzc$set_focusable",function($0){
with(this){
_setFocusable($0)
}},"_focusable",void 0,"onfocusable",void 0,"text",void 0,"doesenter",void 0,"$lzc$set_doesenter",function($0){
this._setDoesEnter($0)
},"$m43",function($0){
var $1=this.enabled&&(this._parentcomponent?this._parentcomponent._enabled:true);if($1!==this["_enabled"]||!this.inited){
this.setAttribute("_enabled",$1)
}},"$m44",function(){
return [this,"enabled",this,"_parentcomponent",this._parentcomponent,"_enabled"]
},"_enabled",void 0,"$lzc$set__enabled",function($0){
this._setEnabled($0)
},"_parentcomponent",void 0,"_initcomplete",void 0,"isdefault",void 0,"$lzc$set_isdefault",function($0){
this._setIsDefault($0)
},"onisdefault",void 0,"hasdefault",void 0,"_setEnabled",function($0){
with(this){
this._enabled=$0;var $1=this._enabled&&this._focusable;if($1!=this.focusable){
this.focusable=$1;if(this.onfocusable.ready)this.onfocusable.sendEvent()
};if(_initcomplete)_showEnabled();if(this.on_enabled.ready)this.on_enabled.sendEvent()
}},"_setFocusable",function($0){
this._focusable=$0;if(this.enabled){
this.focusable=this._focusable;if(this.onfocusable.ready)this.onfocusable.sendEvent()
}else{
this.focusable=false
}},"construct",function($0,$1){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["construct"]||this.nextMethod(arguments.callee,"construct")).call(this,$0,$1);var $2=this.immediateparent;while($2!=canvas){
if(lz.basecomponent["$lzsc$isa"]?lz.basecomponent.$lzsc$isa($2):$2 instanceof lz.basecomponent){
this._parentcomponent=$2;break
};$2=$2.immediateparent
}}},"init",function(){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this);this._initcomplete=true;this._mousedownDel=new LzDelegate(this,"_doMousedown",this,"onmousedown");if(this.styleable){
_usestyle()
};if(!this["_enabled"])_showEnabled()
}},"_doMousedown",function($0){},"doSpaceDown",function(){
return false
},"doSpaceUp",function(){
return false
},"doEnterDown",function(){
return false
},"doEnterUp",function(){
return false
},"_setIsDefault",function($0){
with(this){
this.isdefault=this["isdefault"]==true;if(this.isdefault==$0)return;if($0){
lz._componentmanager.service.makeDefault(this)
}else{
lz._componentmanager.service.unmakeDefault(this)
};this.isdefault=$0;if(this.onisdefault.ready){
this.onisdefault.sendEvent($0)
}}},"_setDoesEnter",function($0){
with(this){
this.doesenter=$0;if(lz.Focus.getFocus()==this){
lz._componentmanager.service.checkDefault(this)
}}},"updateDefault",function(){
with(this){
lz._componentmanager.service.checkDefault(lz.Focus.getFocus())
}},"$m45",function($0){
this.setAttribute("style",null)
},"style",void 0,"$lzc$set_style",function($0){
with(this){
styleable?setStyle($0):(this.style=null)
}},"styleable",void 0,"_style",void 0,"onstyle",void 0,"_styledel",void 0,"_otherstyledel",void 0,"setStyle",function($0){
with(this){
if(!styleable)return;if($0!=null&&!$0["isstyle"]){
var $1=this._style;if(!$1){
if(this._parentcomponent){
$1=this._parentcomponent.style
}else $1=lz._componentmanager.service.getDefaultStyle()
};$0=$1.extend($0)
};this._style=$0;if($0==null){
if(!this._otherstyledel){
this._otherstyledel=new LzDelegate(this,"_setstyle")
}else{
this._otherstyledel.unregisterAll()
};if(this._parentcomponent&&this._parentcomponent.styleable){
this._otherstyledel.register(this._parentcomponent,"onstyle");$0=this._parentcomponent.style
}else{
this._otherstyledel.register(lz._componentmanager.service,"ondefaultstyle");$0=lz._componentmanager.service.getDefaultStyle()
}}else if(this._otherstyledel){
this._otherstyledel.unregisterAll();this._otherstyledel=null
};_setstyle($0)
}},"_usestyle",function($0){
switch(arguments.length){
case 0:
$0=null;

};if(this._initcomplete&&this["style"]&&this.style.isinited){
this._applystyle(this.style)
}},"_setstyle",function($0){
with(this){
if(!this._styledel){
this._styledel=new LzDelegate(this,"_usestyle")
}else{
_styledel.unregisterAll()
};if($0){
_styledel.register($0,"onstylechanged")
};this.style=$0;_usestyle();if(this.onstyle.ready)this.onstyle.sendEvent(this.style)
}},"_applystyle",function($0){},"setTint",function($0,$1,$2){
switch(arguments.length){
case 2:
$2=0;

};if($0.capabilities.colortransform){
if($1!=""&&$1!=null){
var $3=$1;var $4=$3>>16&255;var $5=$3>>8&255;var $6=$3&255;$4+=51;$5+=51;$6+=51;$4=$4/255*100;$5=$5/255*100;$6=$6/255*100;$0.setColorTransform({ra:$4,ga:$5,ba:$6,rb:$2,gb:$2,bb:$2})
}}},"on_enabled",void 0,"_showEnabled",function(){},"acceptValue",function($0,$1){
switch(arguments.length){
case 1:
$1=null;

};this.setAttribute("text",$0)
},"presentValue",function($0){
switch(arguments.length){
case 0:
$0=null;

};return this.text
},"$lzc$presentValue_dependencies",function($0,$1,$2){
switch(arguments.length){
case 2:
$2=null;

};return [this,"text"]
},"applyData",function($0){
this.acceptValue($0)
},"updateData",function(){
return this.presentValue()
},"destroy",function(){
with(this){
this.styleable=false;this._initcomplete=false;if(this["isdefault"]&&this.isdefault){
lz._componentmanager.service.unmakeDefault(this)
};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["destroy"]||this.nextMethod(arguments.callee,"destroy")).call(this)
}},"toString",function(){
var $0="";var $1="";var $2="";if(this["id"]!=null)$0="  id="+this.id;if(this["name"]!=null)$1=' named "'+this.name+'"';if(this["text"]&&this.text!="")$2="  text="+this.text;return this.constructor.tagname+$1+$0+$2
},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["tagname","basecomponent","attributes",new LzInheritedHash(LzView.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({_enabled:new LzAlwaysExpr("$m43","$m44"),_focusable:true,_initcomplete:false,_otherstyledel:null,_parentcomponent:null,_style:null,_styledel:null,doesenter:false,enabled:true,focusable:true,hasdefault:false,on_enabled:LzDeclaredEvent,onfocusable:LzDeclaredEvent,onisdefault:LzDeclaredEvent,onstyle:LzDeclaredEvent,style:new LzOnceExpr("$m45"),styleable:true,text:""},$lzc$class_basecomponent.attributes)
}}})($lzc$class_basecomponent);Class.make("$lzc$class_basebutton",["normalResourceNumber",void 0,"overResourceNumber",void 0,"downResourceNumber",void 0,"disabledResourceNumber",void 0,"$m46",function($0){
this.setAttribute("maxframes",this.totalframes)
},"maxframes",void 0,"resourceviewcount",void 0,"$lzc$set_resourceviewcount",function($0){
this.setResourceViewCount($0)
},"respondtomouseout",void 0,"$m47",function($0){
this.setAttribute("reference",this)
},"reference",void 0,"$lzc$set_reference",function($0){
with(this){
setreference($0)
}},"onresourceviewcount",void 0,"_msdown",void 0,"_msin",void 0,"setResourceViewCount",function($0){
this.resourceviewcount=$0;if(this._initcomplete){
if($0>0){
if(this.subviews){
this.maxframes=this.subviews[0].totalframes;if(this.onresourceviewcount){
this.onresourceviewcount.sendEvent()
}}}}},"_callShow",function(){
if(this._msdown&&this._msin&&this.maxframes>=this.downResourceNumber){
this.showDown()
}else if(this._msin&&this.maxframes>=this.overResourceNumber){
this.showOver()
}else this.showUp()
},"$m48",function(){
with(this){
var $0=lz.ModeManager;return $0
}},"$m49",function($0){
if($0&&(this._msdown||this._msin)&&!this.childOf($0)){
this._msdown=false;this._msin=false;this._callShow()
}},"$lzc$set_frame",function($0){
with(this){
if(this.resourceviewcount>0){
for(var $1=0;$1<resourceviewcount;$1++){
this.subviews[$1].setAttribute("frame",$0)
}}else{
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzc$set_frame"]||this.nextMethod(arguments.callee,"$lzc$set_frame")).call(this,$0)
}}},"doSpaceDown",function(){
if(this._enabled){
this.showDown()
}},"doSpaceUp",function(){
if(this._enabled){
this.onclick.sendEvent();this.showUp()
}},"doEnterDown",function(){
if(this._enabled){
this.showDown()
}},"doEnterUp",function(){
if(this._enabled){
if(this.onclick){
this.onclick.sendEvent()
};this.showUp()
}},"$m50",function($0){
if(this.isinited){
this.maxframes=this.totalframes;this._callShow()
}},"init",function(){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this);this.setResourceViewCount(this.resourceviewcount);this._callShow()
},"$m51",function($0){
this.setAttribute("_msin",true);this._callShow()
},"$m52",function($0){
this.setAttribute("_msin",false);this._callShow()
},"$m53",function($0){
this.setAttribute("_msdown",true);this._callShow()
},"$m54",function($0){
this.setAttribute("_msdown",false);this._callShow()
},"_showEnabled",function(){
with(this){
reference.setAttribute("clickable",this._enabled);showUp()
}},"showDown",function($0){
switch(arguments.length){
case 0:
$0=null;

};this.setAttribute("frame",this.downResourceNumber)
},"showUp",function($0){
switch(arguments.length){
case 0:
$0=null;

};if(!this._enabled&&this.disabledResourceNumber){
this.setAttribute("frame",this.disabledResourceNumber)
}else{
this.setAttribute("frame",this.normalResourceNumber)
}},"showOver",function($0){
switch(arguments.length){
case 0:
$0=null;

};this.setAttribute("frame",this.overResourceNumber)
},"setreference",function($0){
this.reference=$0;if($0!=this)this.setAttribute("clickable",false)
},"_applystyle",function($0){
with(this){
setTint(this,$0.basecolor)
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_basecomponent,["tagname","basebutton","attributes",new LzInheritedHash($lzc$class_basecomponent.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({$delegates:["onmode","$m49","$m48","ontotalframes","$m50",null,"onmouseover","$m51",null,"onmouseout","$m52",null,"onmousedown","$m53",null,"onmouseup","$m54",null],_msdown:false,_msin:false,clickable:true,disabledResourceNumber:4,downResourceNumber:3,focusable:false,maxframes:new LzOnceExpr("$m46"),normalResourceNumber:1,onclick:LzDeclaredEvent,onresourceviewcount:LzDeclaredEvent,overResourceNumber:2,reference:new LzOnceExpr("$m47"),resourceviewcount:0,respondtomouseout:true,styleable:false},$lzc$class_basebutton.attributes)
}}})($lzc$class_basebutton);Class.make("$lzc$class_swatchview",["ctransform",void 0,"color",void 0,"construct",function($0,$1){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["construct"]||this.nextMethod(arguments.callee,"construct")).call(this,$0,$1);this.capabilities=new LzInheritedHash(this.capabilities);this.capabilities.colortransform=true;if($1["width"]==null){
$1["width"]=this.immediateparent.width
};if($1["height"]==null){
$1["height"]=this.immediateparent.height
};if($1["fgcolor"]==null&&$1["bgcolor"]==null){
$1["fgcolor"]=16777215
}}},"$lzc$set_fgcolor",function($0){
this.setAttribute("bgcolor",$0)
},"$lzc$set_bgcolor",function($0){
with(this){
this.color=$0;if(this.ctransform!=null){
var $1=$0>>16&255;var $2=$0>>8&255;var $3=$0&255;$1=$1*ctransform["ra"]/100+ctransform["rb"];$1=Math.min($1,255);$2=$2*ctransform["ga"]/100+ctransform["gb"];$2=Math.min($2,255);$3=$3*ctransform["ba"]/100+ctransform["bb"];$3=Math.min($3,255);$0=Math.floor($3+($2<<8)+($1<<16))
};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzc$set_bgcolor"]||this.nextMethod(arguments.callee,"$lzc$set_bgcolor")).call(this,$0)
}},"setColorTransform",function($0){
this.ctransform=$0;this.setAttribute("bgcolor",this.color)
},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["tagname","swatchview","attributes",new LzInheritedHash(LzView.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({color:16777215,ctransform:null},$lzc$class_swatchview.attributes)
}}})($lzc$class_swatchview);Class.make("$lzc$class_m100",["$m66",function($0){
with(this){
var $1=parent.width-1;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m67",function(){
with(this){
return [parent,"width"]
}},"$m68",function($0){
with(this){
var $1=parent.height-1;if($1!==this["height"]||!this.inited){
this.setAttribute("height",$1)
}}},"$m69",function(){
with(this){
return [parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m101",["$m70",function($0){
with(this){
var $1=parent.width-3;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m71",function(){
with(this){
return [parent,"width"]
}},"$m72",function($0){
with(this){
var $1=parent.height-3;if($1!==this["height"]||!this.inited){
this.setAttribute("height",$1)
}}},"$m73",function(){
with(this){
return [parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m102",["$m74",function($0){
with(this){
var $1=parent.width-4;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m75",function(){
with(this){
return [parent,"width"]
}},"$m76",function($0){
with(this){
var $1=parent.height-4;if($1!==this["height"]||!this.inited){
this.setAttribute("height",$1)
}}},"$m77",function(){
with(this){
return [parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m103",["$m78",function($0){
with(this){
var $1=parent.parent.width-2;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m79",function(){
with(this){
return [parent.parent,"width"]
}},"$m80",function($0){
with(this){
var $1=parent.parent.height-2;if($1!==this["height"]||!this.inited){
this.setAttribute("height",$1)
}}},"$m81",function(){
with(this){
return [parent.parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m104",["$m82",function($0){
with(this){
var $1=parent.parent.height-2;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m83",function(){
with(this){
return [parent.parent,"height"]
}},"$m84",function($0){
with(this){
var $1=parent.parent.width-3;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m85",function(){
with(this){
return [parent.parent,"width"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m105",["$m86",function($0){
with(this){
var $1=parent.parent.width-1;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m87",function(){
with(this){
return [parent.parent,"width"]
}},"$m88",function($0){
with(this){
var $1=parent.parent.height;if($1!==this["height"]||!this.inited){
this.setAttribute("height",$1)
}}},"$m89",function(){
with(this){
return [parent.parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m106",["$m90",function($0){
with(this){
var $1=parent.parent.height-1;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m91",function(){
with(this){
return [parent.parent,"height"]
}},"$m92",function($0){
with(this){
var $1=parent.parent.width-1;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m93",function(){
with(this){
return [parent.parent,"width"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m107",["$m94",function($0){
with(this){
var $1=parent.text_x+parent.titleshift;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m95",function(){
with(this){
return [parent,"text_x",parent,"titleshift"]
}},"$m96",function($0){
with(this){
var $1=parent.text_y+parent.titleshift;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m97",function(){
with(this){
return [parent,"text_y",parent,"titleshift"]
}},"$m98",function($0){
with(this){
var $1=parent.text;if($1!==this["text"]||!this.inited){
this.setAttribute("text",$1)
}}},"$m99",function(){
with(this){
return [parent,"text"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzText,["attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_button",["text_padding_x",void 0,"text_padding_y",void 0,"$m55",function($0){
var $1=this.width/2-this._title.width/2;if($1!==this["text_x"]||!this.inited){
this.setAttribute("text_x",$1)
}},"$m56",function(){
return [this,"width",this._title,"width"]
},"text_x",void 0,"$m57",function($0){
var $1=this.height/2-this._title.height/2;if($1!==this["text_y"]||!this.inited){
this.setAttribute("text_y",$1)
}},"$m58",function(){
return [this,"height",this._title,"height"]
},"text_y",void 0,"$m59",function($0){
var $1=this._title.width+2*this.text_padding_x;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}},"$m60",function(){
return [this._title,"width",this,"text_padding_x"]
},"$m61",function($0){
var $1=this._title.height+2*this.text_padding_y;if($1!==this["height"]||!this.inited){
this.setAttribute("height",$1)
}},"$m62",function(){
return [this._title,"height",this,"text_padding_y"]
},"buttonstate",void 0,"$m63",function($0){
var $1=this.buttonstate==1?0:1;if($1!==this["titleshift"]||!this.inited){
this.setAttribute("titleshift",$1)
}},"$m64",function(){
return [this,"buttonstate"]
},"titleshift",void 0,"leftalign",void 0,"_showEnabled",function(){
with(this){
showUp();setAttribute("clickable",_enabled)
}},"showDown",function($0){
with(this){
switch(arguments.length){
case 0:
$0=null;

};if(this.hasdefault){
this._outerbezel.setAttribute("frame",5)
}else{
this._outerbezel.setAttribute("frame",this.downResourceNumber)
};this._face.setAttribute("frame",this.downResourceNumber);this._innerbezel.setAttribute("frame",this.downResourceNumber);setAttribute("buttonstate",2)
}},"showUp",function($0){
with(this){
switch(arguments.length){
case 0:
$0=null;

};if(_enabled){
if(this.hasdefault){
this._outerbezel.setAttribute("frame",5)
}else{
this._outerbezel.setAttribute("frame",this.normalResourceNumber)
};this._face.setAttribute("frame",this.normalResourceNumber);this._innerbezel.setAttribute("frame",this.normalResourceNumber);if(this.style)this._title.setAttribute("fgcolor",this.style.textcolor)
}else{
if(this.style)this._title.setAttribute("fgcolor",this.style.textdisabledcolor);this._face.setAttribute("frame",this.disabledResourceNumber);this._outerbezel.setAttribute("frame",this.disabledResourceNumber);this._innerbezel.setAttribute("frame",this.disabledResourceNumber)
};setAttribute("buttonstate",1)
}},"showOver",function($0){
with(this){
switch(arguments.length){
case 0:
$0=null;

};if(this.hasdefault){
this._outerbezel.setAttribute("frame",5)
}else{
this._outerbezel.setAttribute("frame",this.overResourceNumber)
};this._face.setAttribute("frame",this.overResourceNumber);this._innerbezel.setAttribute("frame",this.overResourceNumber);setAttribute("buttonstate",1)
}},"$m65",function($0){
with(this){
if(this._initcomplete){
if(this.buttonstate==1)showUp()
}}},"_applystyle",function($0){
with(this){
if(this.style!=null){
this.textcolor=$0.textcolor;this.textdisabledcolor=$0.textdisabledcolor;if(enabled){
_title.setAttribute("fgcolor",$0.textcolor)
}else{
_title.setAttribute("fgcolor",$0.textdisabledcolor)
};setTint(_outerbezel,$0.basecolor);setTint(_innerbezel,$0.basecolor);setTint(_face,$0.basecolor)
}}},"_outerbezel",void 0,"_innerbezel",void 0,"_face",void 0,"_innerbezelbottom",void 0,"_outerbezelbottom",void 0,"_title",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_basebutton,["tagname","button","children",[{attrs:{$classrootdepth:1,bgcolor:LzColorUtils.convertColor("0x919191"),height:new LzAlwaysExpr("$m68","$m69"),name:"_outerbezel",width:new LzAlwaysExpr("$m66","$m67"),x:0,y:0},"class":$lzc$class_m100},{attrs:{$classrootdepth:1,bgcolor:LzColorUtils.convertColor("0xffffff"),height:new LzAlwaysExpr("$m72","$m73"),name:"_innerbezel",width:new LzAlwaysExpr("$m70","$m71"),x:1,y:1},"class":$lzc$class_m101},{attrs:{$classrootdepth:1,height:new LzAlwaysExpr("$m76","$m77"),name:"_face",resource:"lzbutton_face_rsc",stretches:"both",width:new LzAlwaysExpr("$m74","$m75"),x:2,y:2},"class":$lzc$class_m102},{attrs:{$classrootdepth:1,name:"_innerbezelbottom"},children:[{attrs:{$classrootdepth:2,bgcolor:LzColorUtils.convertColor("0x585858"),height:new LzAlwaysExpr("$m80","$m81"),width:1,x:new LzAlwaysExpr("$m78","$m79"),y:1},"class":$lzc$class_m103},{attrs:{$classrootdepth:2,bgcolor:LzColorUtils.convertColor("0x585858"),height:1,width:new LzAlwaysExpr("$m84","$m85"),x:1,y:new LzAlwaysExpr("$m82","$m83")},"class":$lzc$class_m104}],"class":LzView},{attrs:{$classrootdepth:1,name:"_outerbezelbottom"},children:[{attrs:{$classrootdepth:2,bgcolor:LzColorUtils.convertColor("0xffffff"),height:new LzAlwaysExpr("$m88","$m89"),opacity:0.7,width:1,x:new LzAlwaysExpr("$m86","$m87"),y:0},"class":$lzc$class_m105},{attrs:{$classrootdepth:2,bgcolor:LzColorUtils.convertColor("0xffffff"),height:1,opacity:0.7,width:new LzAlwaysExpr("$m92","$m93"),x:0,y:new LzAlwaysExpr("$m90","$m91")},"class":$lzc$class_m106}],"class":LzView},{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$m98","$m99"),x:new LzAlwaysExpr("$m94","$m95"),y:new LzAlwaysExpr("$m96","$m97")},"class":$lzc$class_m107}],"attributes",new LzInheritedHash($lzc$class_basebutton.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({$delegates:["onhasdefault","$m65",null],buttonstate:1,clickable:true,doesenter:true,focusable:true,height:new LzAlwaysExpr("$m61","$m62"),leftalign:false,maxframes:4,pixellock:true,styleable:true,text_padding_x:11,text_padding_y:4,text_x:new LzAlwaysExpr("$m55","$m56"),text_y:new LzAlwaysExpr("$m57","$m58"),titleshift:new LzAlwaysExpr("$m63","$m64"),width:new LzAlwaysExpr("$m59","$m60")},$lzc$class_button.attributes)
}}})($lzc$class_button);Class.make("$lzc$class_basevaluecomponent",["value",void 0,"type",void 0,"getValue",function(){
return this.value==null?this.text:this.value
},"$lzc$getValue_dependencies",function($0,$1){
return [this,"value",this,"text"]
},"acceptValue",function($0,$1){
switch(arguments.length){
case 1:
$1=null;

};if($1==null)$1=this.type;(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["acceptValue"]||this.nextMethod(arguments.callee,"acceptValue")).call(this,$0,$1);this.acceptAttribute("value",$1,$0)
},"presentValue",function($0){
switch(arguments.length){
case 0:
$0=null;

};if($0==null)$0=this.type;return this.presentTypeValue($0,this.getValue())
},"$lzc$presentValue_dependencies",function($0,$1,$2){
switch(arguments.length){
case 2:
$2=null;

};return [this,"type"].concat(this.$lzc$getValue_dependencies($0,$1))
},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_basecomponent,["tagname","basevaluecomponent","attributes",new LzInheritedHash($lzc$class_basecomponent.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({type:"",value:null},$lzc$class_basevaluecomponent.attributes)
}}})($lzc$class_basevaluecomponent);Class.make("$lzc$class_baseformitem",["_parentform",void 0,"submitname",void 0,"$m108",function($0){
with(this){
var $1=enabled;if($1!==this["submit"]||!this.inited){
this.setAttribute("submit",$1)
}}},"$m109",function(){
return [this,"enabled"]
},"submit",void 0,"changed",void 0,"$lzc$set_changed",function($0){
this.setChanged($0)
},"$lzc$set_value",function($0){
this.setValue($0,false)
},"onchanged",void 0,"onvalue",void 0,"rollbackvalue",void 0,"ignoreform",void 0,"init",function(){
if(this.submitname=="")this.submitname=this.name;if(this.submitname==""){};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this);var $0=this.findForm();if($0!=null){
$0.addFormItem(this);this._parentform=$0
}},"destroy",function(){
if(this._parentform)this._parentform.removeFormItem(this);(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["destroy"]||this.nextMethod(arguments.callee,"destroy")).call(this)
},"setChanged",function($0,$1){
with(this){
switch(arguments.length){
case 1:
$1=null;

};if(!this._initcomplete){
this.changed=false;return
};var $2=this.changed;this.changed=$0;if(this.changed!=$2){
if(this.onchanged)this.onchanged.sendEvent(this.changed)
};if(!$1&&this.changed&&!ignoreform){
if(this["_parentform"]&&this._parentform["changed"]!=undefined&&!this._parentform.changed){
this._parentform.setChanged($0,false)
}};if(!$1&&!this.changed&&!ignoreform){
if(this["_parentform"]&&this._parentform["changed"]!=undefined&&this._parentform.changed){
this._parentform.setChanged($0,true)
}}}},"rollback",function(){
if(this.rollbackvalue!=this["value"]){
this.setAttribute("value",this.rollbackvalue)
};this.setAttribute("changed",false)
},"commit",function(){
this.rollbackvalue=this.value;this.setAttribute("changed",false)
},"setValue",function($0,$1){
switch(arguments.length){
case 1:
$1=null;

};var $2=this.value!=$0;this.value=$0;if($1||!this._initcomplete){
this.rollbackvalue=$0
};this.setChanged($2&&!$1&&this.rollbackvalue!=$0);if(this["onvalue"])this.onvalue.sendEvent($0)
},"acceptValue",function($0,$1){
switch(arguments.length){
case 1:
$1=null;

};if($1==null)$1=this.type;this.setValue(this.acceptTypeValue($1,$0),true)
},"findForm",function(){
with(this){
if(_parentform!=null){
return _parentform
}else{
var $0=this.immediateparent;var $1=null;while($0!=canvas){
if($0["formdata"]){
$1=$0;break
};$0=$0.immediateparent
};return $1
}}},"toXML",function($0){
with(this){
var $1=this.value;if($0){
if(typeof $1=="boolean")$1=$1-0
};return lz.Browser.xmlEscape(this.submitname)+'="'+lz.Browser.xmlEscape($1)+'"'
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_basevaluecomponent,["tagname","baseformitem","attributes",new LzInheritedHash($lzc$class_basevaluecomponent.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({_parentform:null,changed:false,ignoreform:false,onchanged:LzDeclaredEvent,onvalue:LzDeclaredEvent,rollbackvalue:null,submit:new LzAlwaysExpr("$m108","$m109"),submitname:"",value:null},$lzc$class_baseformitem.attributes)
}}})($lzc$class_baseformitem);Class.make("$lzc$class_multistatebutton",["statenum",void 0,"$lzc$set_statenum",function($0){
this.setStateNum($0)
},"statelength",void 0,"$lzc$set_statelength",function($0){
this.setStateLength($0)
},"maxstate",void 0,"lastres",void 0,"$m110",function($0){
var $1=this.lastres+this.statenum*this.statelength;if($1!==this["frame"]||!this.inited){
this.setAttribute("frame",$1)
}},"$m111",function(){
return [this,"lastres",this,"statenum",this,"statelength"]
},"onstatenum",void 0,"onstatelength",void 0,"showDown",function($0){
switch(arguments.length){
case 0:
$0=null;

};this.setAttribute("lastres",this.downResourceNumber)
},"showUp",function($0){
switch(arguments.length){
case 0:
$0=null;

};if(!this._enabled&&this.disabledResourceNumber){
this.setAttribute("lastres",this.disabledResourceNumber)
}else{
this.setAttribute("lastres",this.normalResourceNumber)
}},"showOver",function($0){
switch(arguments.length){
case 0:
$0=null;

};this.setAttribute("lastres",this.overResourceNumber)
},"setStateNum",function($0){
if($0>this.maxstate){
return
};this.statenum=$0;if(this.onstatenum)this.onstatenum.sendEvent($0)
},"setStateLength",function($0){
this.statelength=$0;if(this.statelength==2){
this.overResourceNumber=this.normalResourceNumber;if(this.downResourceNumber==3){
this.downResourceNumber=2
}}else if(this.statelength==1){
this.overResourceNumber=1;this.downResourceNumber=1
};if(this.onstatelength)this.onstatelength.sendEvent($0)
},"_showEnabled",function(){
with(this){
reference.setAttribute("clickable",this._enabled);this.showUp()
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_basebutton,["tagname","multistatebutton","attributes",new LzInheritedHash($lzc$class_basebutton.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({clickable:true,frame:new LzAlwaysExpr("$m110","$m111"),lastres:1,maxstate:0,onstatelength:LzDeclaredEvent,onstatenum:LzDeclaredEvent,statelength:3,statenum:0},$lzc$class_multistatebutton.attributes)
}}})($lzc$class_multistatebutton);Class.make("$lzc$class_m122",["$m112",function($0){
with(this){
var $1=classroot.text_y;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m113",function(){
with(this){
return [classroot,"text_y"]
}},"$m114",function($0){
with(this){
var $1=parent.text;if($1!==this["text"]||!this.inited){
this.setAttribute("text",$1)
}}},"$m115",function(){
with(this){
return [parent,"text"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzText,["attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_m123",["$m118",function($0){
with(this){
var $1=parent.value?1:0;if($1!==this["statenum"]||!this.inited){
this.setAttribute("statenum",$1)
}}},"$m119",function(){
with(this){
return [parent,"value"]
}},"$m120",function($0){
with(this){
this.setAttribute("reference",parent)
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_multistatebutton,["attributes",new LzInheritedHash($lzc$class_multistatebutton.attributes)]);Class.make("$lzc$class_checkbox",["_title",void 0,"$m116",function($0){
var $1=this.cb.height/2-this._title.height/2+1;if($1!==this["text_y"]||!this.inited){
this.setAttribute("text_y",$1)
}},"$m117",function(){
return [this.cb,"height",this._title,"height"]
},"text_y",void 0,"$lzc$set_value",function($0){
with(this){
setValue($0)
}},"cb",void 0,"doSpaceUp",function(){
if(this._enabled){
this.setAttribute("value",!this.value)
}},"$m121",function($0){
if(this._enabled)this.setAttribute("value",!this.value)
},"_applystyle",function($0){
with(this){
if(this.style!=null){
if(_enabled){
_title.setAttribute("fgcolor",$0.textcolor)
}else{
_title.setAttribute("fgcolor",$0.textdisabledcolor)
};setTint(this.cb,$0.basecolor)
}}},"_showEnabled",function(){
with(this){
_applystyle(this.style)
}},"setValue",function($0,$1){
switch(arguments.length){
case 1:
$1=null;

};if($0=="false"){
$0=false
}else if($0=="true"){
$0=true
}else $0=!(!$0);(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["setValue"]||this.nextMethod(arguments.callee,"setValue")).call(this,$0,$1)
},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_baseformitem,["tagname","checkbox","children",[{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$m114","$m115"),x:16,y:new LzAlwaysExpr("$m112","$m113")},"class":$lzc$class_m122},{attrs:{$classrootdepth:1,maxstate:1,name:"cb",reference:new LzOnceExpr("$m120"),resource:"lzcheckbox_rsrc",statelength:4,statenum:new LzAlwaysExpr("$m118","$m119"),text:""},"class":$lzc$class_m123}],"attributes",new LzInheritedHash($lzc$class_baseformitem.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({$delegates:["onclick","$m121",null],clickable:true,pixellock:true,text_y:new LzAlwaysExpr("$m116","$m117"),value:false},$lzc$class_checkbox.attributes)
}}})($lzc$class_checkbox);Class.make("$lzc$class_listselector",["multiselect",void 0,"_forcemulti",void 0,"isRangeSelect",function($0){
return this.multiselect&&(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["isRangeSelect"]||this.nextMethod(arguments.callee,"isRangeSelect")).call(this,$0)
},"isMultiSelect",function($0){
return this._forcemulti||this.multiselect&&(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["isMultiSelect"]||this.nextMethod(arguments.callee,"isMultiSelect")).call(this,$0)
},"select",function($0){
with(this){
if(this.multiselect&&(Array["$lzsc$isa"]?Array.$lzsc$isa($0):$0 instanceof Array)){
this._forcemulti=true;for(var $1=0;$1<$0.length;$1++){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["select"]||this.nextMethod(arguments.callee,"select")).call(this,$0[$1])
};this._forcemulti=false
}else{
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["select"]||this.nextMethod(arguments.callee,"select")).call(this,$0)
}}},"getValue",function(){
with(this){
var $0=this.getSelection();if($0.length==0)return null;if($0.length==1&&!multiselect){
return $0[0].getValue()
};var $1=[];for(var $2=0;$2<$0.length;$2++){
$1[$2]=$0[$2].getValue()
};return $1
}},"getText",function(){
with(this){
var $0=this.getSelection();if($0.length==0)return null;if($0.length==1&&!multiselect){
return $0[0].text
};var $1=[];for(var $2=0;$2<$0.length;$2++){
$1[$2]=$0[$2].text
};return $1
}},"getNumItems",function(){
if(!this.immediateparent.subviews)return 0;return this.immediateparent.subviews.length
},"getNextSubview",function($0,$1){
with(this){
switch(arguments.length){
case 1:
$1=1;

};if(typeof $1=="undefined")$1=1;var $2=this.immediateparent.subviews;if(!$0){
if($1>0){
return $2[0]
}else{
return $2[$2.length-1]
}};var $3;var $4=$2.length;for(var $5=0;$5<$4;$5++){
var $6=$2[$5];if($6==$0){
var $7=$5+$1;if($7<0){
$3=$2[0]
}else if($7>=$4){
$3=$2[$4-1]
}else{
$3=$2[$7]
};break
}};ensureItemInView($3);return $3
}},"ensureItemInView",function($0){
with(this){
if(!$0){
return
};var $1=immediateparent.parent;var $2=false;if($0.y+$0.height>$1.height-immediateparent.y){
var $3=$1.height-immediateparent.y-($0.y+$0.height);var $4=Math.max($1.height-immediateparent.height,immediateparent.y+$3);immediateparent.setAttribute("y",$4);$2=true
}else if(immediateparent.y*-1>$0.y){
var $3=immediateparent.y*-1-$0.y;var $4=Math.min(0,immediateparent.y+$3);immediateparent.setAttribute("y",$4);$2=true
};if($2){
this._updatefromscrolling=true
}}},"_updatefromscrolling",void 0,"allowhilite",function($0){
if(this._updatefromscrolling){
if($0!=null)this._updatefromscrolling=false;return false
};return true
},"getItemByIndex",function($0){
return this.parent._contentview.subviews[$0]
},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzSelectionManager,["tagname","listselector","attributes",new LzInheritedHash(LzSelectionManager.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({_forcemulti:false,_updatefromscrolling:false,multiselect:false},$lzc$class_listselector.attributes)
}}})($lzc$class_listselector);Class.make("$lzc$class_datalistselector",["multiselect",void 0,"_forcemulti",void 0,"isRangeSelect",function($0){
return this.multiselect&&(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["isRangeSelect"]||this.nextMethod(arguments.callee,"isRangeSelect")).call(this,$0)
},"isMultiSelect",function($0){
return this._forcemulti||this.multiselect&&(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["isMultiSelect"]||this.nextMethod(arguments.callee,"isMultiSelect")).call(this,$0)
},"select",function($0){
with(this){
if(this.multiselect&&(Array["$lzsc$isa"]?Array.$lzsc$isa($0):$0 instanceof Array)){
this._forcemulti=true;for(var $1=0;$1<$0.length;$1++){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["select"]||this.nextMethod(arguments.callee,"select")).call(this,$0[$1])
};this._forcemulti=false
}else{
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["select"]||this.nextMethod(arguments.callee,"select")).call(this,$0)
}}},"getValue",function(){
with(this){
var $0=this.getSelection();if($0.length==0)return null;var $1=this.immediateparent.subviews[0]._valuedatapath;if(!$1)$1=this.immediateparent.subviews[0]._textdatapath;if(!$1)$1="text()";if($0.length==1&&!multiselect){
return $0[0].xpathQuery($1)
}else{
var $2=[];for(var $3=0;$3<$0.length;$3++){
$2[$3]=$0[$3].xpathQuery($1)
};return $2
}}},"getText",function(){
with(this){
var $0=this.getSelection();if($0.length==0)return null;var $1=this.immediateparent.subviews[0]._textdatapath;if(!$1)$1="text()";if($0.length==1&&!multiselect){
return $0[0].xpathQuery($1)
}else{
var $2=[];for(var $3=0;$3<$0.length;$3++){
$2[$3]=$0[$3].xpathQuery($1)
};return $2
}}},"getNumItems",function(){
with(this){
if(!this.cloneManager){
var $0=immediateparent.subviews;if($0==null||$0.length==0){
return 0
}else{
this.cloneManager=$0[0].cloneManager
}};if(this.cloneManager!=null){
if(!this.cloneManager["nodes"]){
return 0
}else{
return this.cloneManager.nodes.length
}}else if($0[0].data){
return 1
}else{
return 0
}}},"getNextSubview",function($0,$1){
with(this){
switch(arguments.length){
case 1:
$1=1;

};var $2=immediateparent.subviews[0].cloneManager["clones"];if($0==null){
var $3=$1==-1&&parent.shownitems!=-1?parent.shownitems-1:0;return $2[$3]
};var $4=findIndex($0);if($4==-1)return null;var $5=immediateparent.subviews[0].cloneManager.nodes;if(!$1)$1=1;$4+=$1;if($4==-1)$4=0;if($4==$5.length)$4=$5.length-1;_ensureItemInViewByIndex($4);var $6=$5[$4];var $7=immediateparent.subviews;for(var $8=0;$8<$7.length;$8++){
if($7[$8].datapath.p==$6){
return $7[$8]
}}}},"findIndex",function($0){
with(this){
if(!immediateparent.subviews[0].cloneManager){
if($0 instanceof lz.view){
return immediateparent.subviews[0]==$0?0:-1
}else{
return immediateparent.subviews[0].datapath.p==$0.p?0:-1
}};var $1;if($0 instanceof lz.view){
$1=$0.datapath.p
}else{
$1=$0.p
};var $2=immediateparent.subviews[0].cloneManager.nodes;var $3=-1;if($2!=null){
for(var $4=0;$4<$2.length;$4++){
if($2[$4]==$1){
$3=$4;break
}}};return $3
}},"ensureItemInView",function($0){
with(this){
if(!$0)return;var $1=findIndex($0);if($1!=-1)_ensureItemInViewByIndex($1)
}},"_ensureItemInViewByIndex",function($0){
with(this){
var $1=this.immediateparent;var $2=$1.subviews;if(!$2||$2.length==0){
return
};var $3=$2[0].height;var $4=$0*$3;var $5=0;if($0>0){
var $6=$2[0].cloneManager;if(parent["spacing"]){
$5=parent.spacing
}else if($6&&$6["spacing"]){
$5=$6.spacing
};$4+=$5*($0-1)
};var $7=false;var $8=$1.parent.height;var $9=$1.y;if($4+$3>$8-$9){
var $a=$8-$9-($4+$3+$5);var $b=Math.max($8-$1.height,$9+$a);$1.setAttribute("y",$b);$7=true
}else if($9*-1>$4){
var $a=$9*-1-$4-$5;var $b=Math.min(0,$9+$a);$1.setAttribute("y",$b);$7=true
};if($7){
this._updatefromscrolling=true
}}},"getItemByIndex",function($0){
with(this){
var $1=immediateparent.subviews;if(!$1||$1.length==0)return null;this._ensureItemInViewByIndex($0);var $2=$1[0].cloneManager;if($2==null){
return $0==0?$1[0]:undefined
};var $3=$2.clones[0].datapath.xpathQuery("position()")-1;return $2.clones[$0-$3]
}},"getItemByData",function($0){
with(this){
return $0?getItemByIndex(this.getItemIndexByData($0)):null
}},"getItemIndexByData",function($0){
with(this){
if($0){
var $1=immediateparent.subviews;if($1[0].cloneManager){
var $2=$1[0].cloneManager["nodes"];if($2!=null){
for(var $3=0;$3<$2.length;$3++){
if($2[$3]==$0){
return $3
}}}}else if($1[0].datapath.p==$0){
return 0
}};return null
}},"_updatefromscrolling",void 0,"allowhilite",function($0){
if(this._updatefromscrolling){
if($0!=null)this._updatefromscrolling=false;return false
};return true
},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzDataSelectionManager,["tagname","datalistselector","attributes",new LzInheritedHash(LzDataSelectionManager.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({_forcemulti:false,_updatefromscrolling:false,multiselect:false},$lzc$class_datalistselector.attributes)
}}})($lzc$class_datalistselector);Class.make("$lzc$class_baselist",["itemclassname",void 0,"__itemclass",void 0,"defaultselection",void 0,"multiselect",void 0,"toggleselected",void 0,"dataoption",void 0,"_hiliteview",void 0,"_contentview",void 0,"_initialselection",void 0,"_selector",void 0,"__focusfromchild",void 0,"onselect",void 0,"onitemclassname",void 0,"doEnterDown",function(){
with(this){
if((lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view)&&this._hiliteview.enabled){
this._hiliteview.setAttribute("selected",true)
}}},"doEnterUp",function(){
return
},"init",function(){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this);if(this._contentview==null){
if(this.defaultplacement!=null){
this._contentview=this.searchSubnodes("name",this.defaultplacement)
}else{
this._contentview=this
}};if(this.dataoption=="lazy"||this.dataoption=="resize"){
this._selector=new (lz.datalistselector)(this,{multiselect:this.multiselect,toggle:toggleselected})
}else{
this._selector=new (lz.listselector)(this,{multiselect:this.multiselect,toggle:toggleselected})
};if(this._initialselection!=null){
this.select(this._initialselection)
}else if(this.defaultselection!=null){
selectItemAt(defaultselection)
}}},"_doFocus",function($0){
with(this){
if(this["_selector"]!=null){
var $1=this._selector.getSelection();if($1&&$1.length>0){
if(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa($1[0]):$1[0] instanceof lz.view){
this._hiliteview=$1[0];this._hiliteview.setHilite(true)
}}}}},"_doblur",function($0){
with(this){
if(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view){
this._hiliteview.setHilite(false)
};this._hiliteview=null
}},"setHilite",function($0){
with(this){
if(this._selector.allowhilite($0)){
if(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view)this._hiliteview.setHilite(false);this._hiliteview=$0;if(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa($0):$0 instanceof lz.view){
$0.setHilite(true)
}}}},"_dokeydown",function($0){
with(this){
var $1=this._hiliteview;if($1==null){
$1=getSelection();if(this.multiselect)$1=$1[$1.length-1]
};if(this.focusable&&$0==32){
if((lz.view["$lzsc$isa"]?lz.view.$lzsc$isa($1):$1 instanceof lz.view)&&$1.enabled){
$1.setAttribute("selected",true);$1.setHilite(true);this._hiliteview=$1
};return
};if(this.focusable&&$0>=37&&$0<=40){
this.setAttribute("doesenter",true);var $2;if($0==39||$0==40){
$2=_selector.getNextSubview($1)
};if($0==37||$0==38){
$2=_selector.getNextSubview($1,-1)
};if(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa($1):$1 instanceof lz.view){
$1.setHilite(false)
};if($2.enabled&&_selector.isRangeSelect($2)){
$2.setAttribute("selected",true)
};$2.setHilite(true);this._hiliteview=$2
}}},"getValue",function(){
with(this){
return _selector.getValue()
}},"getText",function(){
with(this){
if(_initcomplete)return _selector.getText();return null
}},"getSelection",function(){
with(this){
if(this._initcomplete){
var $0=this._selector.getSelection();if(multiselect){
return $0
}else{
if($0.length==0){
return null
}else{
return $0[0]
}}}else{
return this._initialselection
}}},"selectNext",function(){
with(this){
moveSelection(1)
}},"selectPrev",function(){
with(this){
moveSelection(-1)
}},"moveSelection",function($0){
with(this){
if(!$0)$0=1;var $1=this._selector.getSelection();var $2;if($1.length==0){
$2=this._contentview.subviews[0]
}else{
var $3=$1[0];$2=this._selector.getNextSubview($3,$0)
};var $4=lz.Focus.getFocus();select($2);if($3&&$4&&$4.childOf($3)){
lz.Focus.setFocus($2)
}}},"getNumItems",function(){
if(this["_selector"]==null)return 0;return this._selector.getNumItems()
},"getItemAt",function($0){
with(this){
if(_contentview.subviews[$0]){
return getItem(_contentview.subviews[$0].getValue())
};return null
}},"getItem",function($0){
with(this){
if(_contentview!=null&&_contentview.subviews!=null){
for(var $1=0;$1<_contentview.subviews.length;$1++){
var $2=_contentview.subviews[$1];if($2.getValue()==$0){
return $2
}}};return null
}},"addItem",function($0,$1){
switch(arguments.length){
case 1:
$1=null;

};new (this.__itemclass)(this,{text:$0,value:$1})
},"$lzc$set_itemclassname",function($0){
with(this){
this.itemclassname=$0;this.__itemclass=lz[$0];if(onitemclassname.ready){
this.onitemclassname.sendEvent($0)
}}},"removeItem",function($0){
with(this){
var $1=getItem($0);_removeitem($1)
}},"removeItemAt",function($0){
with(this){
var $1=_contentview.subviews[$0];_removeitem($1)
}},"removeAllItems",function(){
with(this){
while(_contentview.subviews.length!=0){
for(var $0=0;$0<_contentview.subviews.length;$0++){
_removeitem(_contentview.subviews[$0])
}}}},"_removeitem",function($0){
if($0){
if($0.selected)this._selector.unselect($0);$0.destroy()
}},"selectItem",function($0){
with(this){
var $1=getItem($0);if($1){
select($1)
}}},"selectItemAt",function($0){
with(this){
if(this._selector!=null){
var $1=this._selector.getItemByIndex($0);select($1)
}}},"clearSelection",function(){
if(this._initcomplete){
this._selector.clearSelection()
}else{
this._initialselection=null;this.defaultselection=null
}},"select",function($0){
with(this){
if($0==null){

}else if(this._initcomplete){
this._selector.select($0);if(!this.multiselect){
this.setAttribute("value",$0.getValue())
}}else{
if(multiselect){
if(this._initialselection==null)this._initialselection=[];this._initialselection.push($0)
}else{
this._initialselection=$0
}};if((lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view)&&this._hiliteview["enabled"]){
this._hiliteview.setHilite(false);this._hiliteview=null
};this.setAttribute("doesenter",false);if(this.onselect)this.onselect.sendEvent($0)
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_baseformitem,["tagname","baselist","attributes",new LzInheritedHash($lzc$class_baseformitem.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({$delegates:["onfocus","_doFocus",null,"onblur","_doblur",null,"onkeydown","_dokeydown",null],__focusfromchild:false,__itemclass:null,_contentview:null,_hiliteview:null,_initialselection:null,_selector:null,dataoption:"none",defaultselection:null,itemclassname:"",multiselect:false,onitemclassname:LzDeclaredEvent,onselect:LzDeclaredEvent,toggleselected:false},$lzc$class_baselist.attributes)
}}})($lzc$class_baselist);Class.make("$lzc$class_baselistitem",["selected",void 0,"$lzc$set_selected",function($0){
this._setSelected($0)
},"onselected",void 0,"onselect",void 0,"_selectonevent",void 0,"$lzc$set__selectonevent",function($0){
this.setSelectOnEvent($0)
},"$lzc$set_datapath",function($0){
with(this){
if(null!=this.datapath){
this.datapath.setXPath($0)
}else{
var $1={xpath:$0};if(this._parentcomponent.dataoption=="lazy"||this._parentcomponent.dataoption=="resize"){
$1.replication=_parentcomponent.dataoption;if(parent["spacing"])$1.spacing=parent.spacing
}else if(this._parentcomponent.dataoption=="pooling"){
$1.pooling=true
};new (lz.datapath)(this,$1)
}}},"_valuedatapath",void 0,"_textdatapath",void 0,"dataBindAttribute",function($0,$1,$2){
if(this._parentcomponent.dataoption=="lazy"||this._parentcomponent.dataoption=="resize"){
if($0=="text"){
this._textdatapath=$1
}else if($0=="value")this._valuedatapath=$1
};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["dataBindAttribute"]||this.nextMethod(arguments.callee,"dataBindAttribute")).call(this,$0,$1,$2)
},"setSelectOnEvent",function($0){
with(this){
this._selectDL=new LzDelegate(this,"doClick",this,$0)
}},"doClick",function($0){
if(this._parentcomponent){
this._parentcomponent.select(this)
}},"_doMousedown",function($0){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["_doMousedown"]||this.nextMethod(arguments.callee,"_doMousedown")).call(this,$0);var $1=this._parentcomponent;if(!this.focusable&&$1&&$1.focusable){
$1.__focusfromchild=true;lz.Focus.setFocus($1,false);$1.__focusfromchild=false
}}},"setSelected",function($0){
this.selected=$0;if(this.onselect.ready)this.onselect.sendEvent(this);if(this.onselected.ready)this.onselected.sendEvent(this)
},"_setSelected",function($0){
with(this){
this.selected=$0;if($0){
parent.select(this)
}}},"setHilite",function($0){},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_basevaluecomponent,["tagname","baselistitem","attributes",new LzInheritedHash($lzc$class_basevaluecomponent.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({_selectonevent:"onclick",_textdatapath:null,_valuedatapath:null,clickable:true,focusable:false,onselect:LzDeclaredEvent,onselected:LzDeclaredEvent,selected:false},$lzc$class_baselistitem.attributes)
}}})($lzc$class_baselistitem);Class.make("$lzc$class_simplelayout",["axis",void 0,"$lzc$set_axis",function($0){
this.setAxis($0)
},"inset",void 0,"$lzc$set_inset",function($0){
this.inset=$0;if(this.subviews&&this.subviews.length)this.update();if(this["oninset"])this.oninset.sendEvent(this.inset)
},"spacing",void 0,"$lzc$set_spacing",function($0){
this.spacing=$0;if(this.subviews&&this.subviews.length)this.update();if(this["onspacing"])this.onspacing.sendEvent(this.spacing)
},"setAxis",function($0){
if(this["axis"]==null||this.axis!=$0){
this.axis=$0;this.sizeAxis=$0=="x"?"width":"height";if(this.subviews.length)this.update();if(this["onaxis"])this.onaxis.sendEvent(this.axis)
}},"addSubview",function($0){
this.updateDelegate.register($0,"on"+this.sizeAxis);this.updateDelegate.register($0,"onvisible");if(!this.locked){
var $1=null;var $2=this.subviews;for(var $3=$2.length-1;$3>=0;--$3){
if($2[$3].visible){
$1=$2[$3];break
}};if($1){
var $4=$1[this.axis]+$1[this.sizeAxis]+this.spacing
}else{
var $4=this.inset
};$0.setAttribute(this.axis,$4)
};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["addSubview"]||this.nextMethod(arguments.callee,"addSubview")).call(this,$0)
},"update",function($0){
switch(arguments.length){
case 0:
$0=null;

};if(this.locked)return;var $1=this.subviews.length;var $2=this.inset;for(var $3=0;$3<$1;$3++){
var $4=this.subviews[$3];if(!$4.visible)continue;if($4[this.axis]!=$2){
$4.setAttribute(this.axis,$2)
};if($4.usegetbounds){
$4=$4.getBounds()
};$2+=this.spacing+$4[this.sizeAxis]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzLayout,["tagname","simplelayout","attributes",new LzInheritedHash(LzLayout.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({axis:"y",inset:0,spacing:0},$lzc$class_simplelayout.attributes)
}}})($lzc$class_simplelayout);Class.make("$lzc$class_radiogroup",["$lzc$set_value",function($0){
with(this){
_setvalue($0)
}},"init",function(){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this);if(canvas["accessible"]){
var $0=this.getNumItems();for(var $1=1;$1<=$0;$1++){
var $2=this.getItemAt($1-1);if(!$2["aaactive"]){
var $3=$1+" of "+$0;$2.setAttribute("aadescription",$3);$2.setAttribute("aaactive","true")
}}}}},"acceptValue",function($0,$1){
switch(arguments.length){
case 1:
$1=null;

};if($1==null)$1=this.type;var $2=this.acceptTypeValue($1,$0);this._setvalue($2);var $3=null;if($2!=null){
$3=this.getItem($2)
};if($3){
this.select($3)
}else this.clearSelection()
},"_setvalue",function($0){
if($0==this.value)return;if(this._initcomplete){
var $1=null;if($0!=null){
$1=this.getItem($0)
};this.value=$0
}else{
this.value=$0
};if(this.onvalue)this.onvalue.sendEvent($0)
},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_baselist,["tagname","radiogroup","attributes",new LzInheritedHash($lzc$class_baselist.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({defaultselection:0,itemclassname:"radiobutton",layout:{axis:"y","class":"simplelayout",spacing:5},onvalue:LzDeclaredEvent,value:null},$lzc$class_radiogroup.attributes)
}}})($lzc$class_radiogroup);Class.make("$lzc$class_m135",["$m128",function($0){
with(this){
var $1=parent.selected?1:0;if($1!==this["statenum"]||!this.inited){
this.setAttribute("statenum",$1)
}}},"$m129",function(){
with(this){
return [parent,"selected"]
}},"$m130",function($0){
with(this){
this.setAttribute("reference",parent)
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_multistatebutton,["attributes",new LzInheritedHash($lzc$class_multistatebutton.attributes)]);Class.make("$lzc$class_m136",["$m131",function($0){
with(this){
var $1=classroot.text_y;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m132",function(){
with(this){
return [classroot,"text_y"]
}},"$m133",function($0){
with(this){
var $1=parent.text;if($1!==this["text"]||!this.inited){
this.setAttribute("text",$1)
}}},"$m134",function(){
with(this){
return [parent,"text"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzText,["attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_radiobutton",["init",function(){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this);if(canvas["accessible"]){
this.accessible.setAttribute("applied",true);var $0=this.getDisplayObject();$0._accImpl={};$0._accImpl.stub=false;$0._accImpl.master=this;$0._accImpl.get_accRole=function(){
return 45
};$0._accImpl.get_accName=function(){
return this.master.text
};$0._accImpl.get_accState=function(){
var $0=0;if(this.master.parent.focusable)$0|=1048576;if(this.master.parent==lz.Focus.getFocus())$0|=4;if(this.master.selected)$0|=16;return $0
};$0._accImpl.get_accDefaultAction=function($0){
return "Check"
};$0._accImpl.accDoDefaultAction=function($0){
this.master.parent.select(this.master)
}}}},"accessible",void 0,"$m126",function($0){
var $1=this.rb.height/2-this._title.height/2;if($1!==this["text_y"]||!this.inited){
this.setAttribute("text_y",$1)
}},"$m127",function(){
return [this.rb,"height",this._title,"height"]
},"text_y",void 0,"initcomplete",void 0,"rb",void 0,"_applystyle",function($0){
with(this){
if(this.style!=null){
if(_enabled){
_title.setAttribute("fgcolor",this.style.textcolor)
}else{
_title.setAttribute("fgcolor",this.style.textdisabledcolor)
};setTint(this.rb,$0.basecolor)
}}},"_showEnabled",function(){
with(this){
if(this.style!=null){
if(_enabled){
_title.setAttribute("fgcolor",style.textcolor)
}else{
_title.setAttribute("fgcolor",style.textdisabledcolor)
}}}},"setHilite",function($0){
with(this){
_title.setAttribute("fgcolor",$0?style.texthilitecolor:style.textcolor);if($0)this.setAttribute("selected",true);if(canvas["accessible"])this.updateFocus($0)
}},"_title",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_baselistitem,["tagname","radiobutton","children",[{attrs:{$classrootdepth:1,$delegates:["onselected","$m124",null,"ontext","$m125",null],$m124:function($0){
with(this){
if(!this.isinited){
return
};if(this.selected){
this.sendAAEvent(0,EVENT_OBJECT_FOCUS)
};this.sendAAEvent(0,EVENT_OBJECT_STATECHANGE,true)
}},$m125:function($0){
with(this){
this.sendAAEvent(0,EVENT_OBJECT_NAMECHANGE)
}},EVENT_OBJECT_FOCUS:32773,EVENT_OBJECT_NAMECHANGE:32780,EVENT_OBJECT_SELECTION:32774,EVENT_OBJECT_STATECHANGE:32778,name:"accessible",updateFocus:function($0){
with(this){
if($0){
this.sendAAEvent(0,EVENT_OBJECT_SELECTION);this.sendAAEvent(0,EVENT_OBJECT_FOCUS)
};this.sendAAEvent(0,EVENT_OBJECT_STATECHANGE,true)
}}},"class":LzState},{attrs:{$classrootdepth:1,maxstate:1,name:"rb",reference:new LzOnceExpr("$m130"),resource:"lzradio_rsrc",statelength:4,statenum:new LzAlwaysExpr("$m128","$m129"),text:""},"class":$lzc$class_m135},{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$m133","$m134"),x:17,y:new LzAlwaysExpr("$m131","$m132")},"class":$lzc$class_m136}],"attributes",new LzInheritedHash($lzc$class_baselistitem.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({clickable:true,focusable:false,initcomplete:0,text_y:new LzAlwaysExpr("$m126","$m127")},$lzc$class_radiobutton.attributes)
}}})($lzc$class_radiobutton);appdata=canvas.lzAddLocalData("appdata","<data />",false,false);appdata==true;Class.make("$lzc$class_m194",["$m139",function($0){
with(this){
var $1=canvas.app_console_debug?370:71;if($1!==this["height"]||!this.inited){
this.setAttribute("height",$1)
}}},"$m140",function(){
with(this){
return [canvas,"app_console_debug"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m196",["$m143",function($0){
with(this){
var $1=parent.width-2;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m144",function(){
with(this){
return [parent,"width"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m195",["$m141",function($0){
with(this){
var $1=parent.compilecontrols.width+5;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m142",function(){
with(this){
return [parent.compilecontrols,"width"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["children",[{attrs:{bgcolor:LzColorUtils.convertColor("0x7a7a8c"),height:30,width:new LzAlwaysExpr("$m143","$m144"),x:1,y:1},"class":$lzc$class_m196}],"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m197",["$m145",function($0){
with(this){
var $1=canvas.runtime_swf8_enabled;if($1!==this["enabled"]||!this.inited){
this.setAttribute("enabled",$1)
}}},"$m146",function(){
with(this){
return [canvas,"runtime_swf8_enabled"]
}},"$m147",function($0){
with(this){
var $1=canvas.app_runtime=="swf8";if($1!==this["selected"]||!this.inited){
this.setAttribute("selected",$1)
}}},"$m148",function(){
with(this){
return [canvas,"app_runtime"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_radiobutton,["children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);Class.make("$lzc$class_m198",["$m149",function($0){
with(this){
var $1=canvas.runtime_swf9_enabled;if($1!==this["enabled"]||!this.inited){
this.setAttribute("enabled",$1)
}}},"$m150",function(){
with(this){
return [canvas,"runtime_swf9_enabled"]
}},"$m151",function($0){
with(this){
var $1=canvas.app_runtime=="swf9";if($1!==this["selected"]||!this.inited){
this.setAttribute("selected",$1)
}}},"$m152",function(){
with(this){
return [canvas,"app_runtime"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_radiobutton,["children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);Class.make("$lzc$class_m199",["$m153",function($0){
with(this){
var $1=canvas.runtime_swf10_enabled;if($1!==this["enabled"]||!this.inited){
this.setAttribute("enabled",$1)
}}},"$m154",function(){
with(this){
return [canvas,"runtime_swf10_enabled"]
}},"$m155",function($0){
with(this){
var $1=canvas.app_runtime=="swf10";if($1!==this["selected"]||!this.inited){
this.setAttribute("selected",$1)
}}},"$m156",function(){
with(this){
return [canvas,"app_runtime"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_radiobutton,["children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);Class.make("$lzc$class_m200",["$m157",function($0){
with(this){
var $1=canvas.runtime_dhtml_enabled;if($1!==this["enabled"]||!this.inited){
this.setAttribute("enabled",$1)
}}},"$m158",function(){
with(this){
return [canvas,"runtime_dhtml_enabled"]
}},"$m159",function($0){
with(this){
var $1=canvas.app_runtime=="dhtml";if($1!==this["selected"]||!this.inited){
this.setAttribute("selected",$1)
}}},"$m160",function(){
with(this){
return [canvas,"app_runtime"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_radiobutton,["children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);Class.make("$lzc$class_m202",["$m162",function($0){
with(this){
var $1=canvas.app_debug=="true";if($1!==this["value"]||!this.inited){
this.setAttribute("value",$1)
}}},"$m163",function(){
with(this){
return [canvas,"app_debug"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_checkbox,["children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);Class.make("$lzc$class_m203",["$m164",function($0){
with(this){
var $1=canvas.app_backtrace=="true";if($1!==this["value"]||!this.inited){
this.setAttribute("value",$1)
}}},"$m165",function(){
with(this){
return [canvas,"app_backtrace"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_checkbox,["children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);Class.make("$lzc$class_m204",["$m166",function($0){
with(this){
var $1=canvas.app_usemastersprite=="true";if($1!==this["value"]||!this.inited){
this.setAttribute("value",$1)
}}},"$m167",function(){
with(this){
return [canvas,"app_usemastersprite"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_checkbox,["children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);Class.make("$lzc$class_m205",["$m168",function($0){
with(this){
canvas.gotoApp()
}},"$m169",function($0){
with(this){
var $1=canvas.lzr=="dhtml"?300:168;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m170",function(){
with(this){
return [canvas,"lzr"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_button,["children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);Class.make("$lzc$class_m201",["$m161",function($0){
with(this){
this.setAttribute("x",rg_runtime.x+rg_runtime.width+14)
}},"$m171",function(){
with(this){
var $0=cb_backtrace;return $0
}},"$m172",function($0){
with(this){
if(cb_backtrace.value){
cb_debug.setAttribute("value",true)
}}},"$m173",function(){
with(this){
var $0=cb_debug;return $0
}},"$m174",function($0){
with(this){
if(cb_debug.value==false){
cb_backtrace.setAttribute("value",false)
}}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["children",[{attrs:{bgcolor:LzColorUtils.convertColor("0x0"),height:14,width:1,y:9},"class":LzView},{attrs:{$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="cb_debug";cb_debug=$0
}else if(cb_debug===$0){
cb_debug=null;$0.id=null
}},id:"cb_debug",text:"Debug",value:new LzAlwaysExpr("$m162","$m163"),x:16,y:8},"class":$lzc$class_m202},{attrs:{$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="cb_backtrace";cb_backtrace=$0
}else if(cb_backtrace===$0){
cb_backtrace=null;$0.id=null
}},id:"cb_backtrace",text:"Backtrace",value:new LzAlwaysExpr("$m164","$m165"),x:82,y:8},"class":$lzc$class_m203},{attrs:{$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="cb_usemastersprite";cb_usemastersprite=$0
}else if(cb_usemastersprite===$0){
cb_usemastersprite=null;$0.id=null
}},id:"cb_usemastersprite",text:"Use master sprite",value:new LzAlwaysExpr("$m166","$m167"),x:168,y:8},"class":$lzc$class_m204},{attrs:{$delegates:["onclick","$m168",null],clickable:true,text:"Compile",x:new LzAlwaysExpr("$m169","$m170"),y:3},"class":$lzc$class_m205}],"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m207",["$m177",function($0){
with(this){
canvas.viewSource()
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_button,["children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);Class.make("$lzc$class_m206",["$m175",function($0){
with(this){
var $1=parent.compilecontrols.width+parent.compilecontrols.x+32;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m176",function(){
with(this){
return [parent.compilecontrols,"width",parent.compilecontrols,"x"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["children",[{attrs:{$delegates:["onclick","$m177",null],clickable:true,text:"View Source",y:3},"class":$lzc$class_m207}],"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m208",["$m178",function($0){
with(this){
var $1=canvas.width-70;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m179",function(){
with(this){
return [canvas,"width"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m210",["$m182",function($0){
with(this){
canvas.viewWrapper()
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_button,["children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);Class.make("$lzc$class_m211",["$m183",function($0){
with(this){
canvas.deploySOLO()
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_button,["children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);Class.make("$lzc$class_m212",["$m184",function($0){
with(this){
canvas.viewDocs()
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzText,["attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_m213",["$m185",function($0){
with(this){
canvas.viewDev()
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzText,["attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_m214",["$m186",function($0){
with(this){
canvas.viewForums()
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzText,["attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_m209",["$m180",function($0){
with(this){
var $1=parent.firstrow.width;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m181",function(){
with(this){
return [parent.firstrow,"width"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["children",[{attrs:{fontsize:11,text:"<b>Deploy:</b>",x:8,y:4},"class":LzText},{attrs:{$delegates:["onclick","$m182",null],clickable:true,text:"Server",x:65},"class":$lzc$class_m210},{attrs:{$delegates:["onclick","$m183",null],clickable:true,text:"SOLO",x:134},"class":$lzc$class_m211},{attrs:{align:"right",fgcolor:LzColorUtils.convertColor("0x15159b"),layout:{axis:"x",spacing:3},options:{ignorelayout:true},y:3},children:[{attrs:{$delegates:["onclick","$m184",null],clickable:true,text:"<u>Documentation</u>"},"class":$lzc$class_m212},{attrs:{$delegates:["onclick","$m185",null],clickable:true,text:"<u>Developer Community</u>"},"class":$lzc$class_m213},{attrs:{$delegates:["onclick","$m186",null],clickable:true,text:"<u>Developer Forums</u>"},"class":$lzc$class_m214}],"class":LzView}],"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m215",["$m187",function($0){
with(this){
var $1=parent.firstrow.width+20;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m188",function(){
with(this){
return [parent.firstrow,"width"]
}},"$m189",function($0){
with(this){
var $1=canvas.app_runtime!="dhtml";if($1!==this["visible"]||!this.inited){
this.setAttribute("visible",$1)
}}},"$m190",function(){
with(this){
return [canvas,"app_runtime"]
}},"$m191",function($0){
with(this){
var $1=canvas.app_console_debug;if($1!==this["value"]||!this.inited){
this.setAttribute("value",$1)
}}},"$m192",function(){
with(this){
return [canvas,"app_console_debug"]
}},"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],$lzc$class_checkbox,["children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);Class.make("$lzc$class_m193",["$m137",function($0){
with(this){
var $1=parent.width;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m138",function(){
with(this){
return [parent,"width"]
}},"logo",void 0,"controls",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
switch(arguments.length){
case 0:
$0=null;
case 1:
$1=null;
case 2:
$2=null;
case 3:
$3=false;

};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["$lzsc$initialize"]||this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$0,$1,$2,$3)
}],LzView,["children",[{attrs:{bgcolor:LzColorUtils.convertColor("0x4c4c4c"),height:new LzAlwaysExpr("$m139","$m140"),name:"logo",resource:"footer_logo"},"class":$lzc$class_m194},{attrs:{firstrow:void 0,name:"controls",x:70},children:[{attrs:{compilecontrols:void 0,name:"firstrow",y:4},children:[{attrs:{fontsize:11,text:"<b>Compile Options:</b>",x:8,y:7},"class":LzText},{attrs:{bgcolor:LzColorUtils.convertColor("0x0"),height:32,width:new LzAlwaysExpr("$m141","$m142"),x:125},"class":$lzc$class_m195},{attrs:{name:"compilecontrols",x:125},children:[{attrs:{$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="rg_runtime";rg_runtime=$0
}else if(rg_runtime===$0){
rg_runtime=null;$0.id=null
}},id:"rg_runtime",layout:{axis:"x","class":"simplelayout",spacing:12},x:10,y:9},children:[{attrs:{$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="rb8";rb8=$0
}else if(rb8===$0){
rb8=null;$0.id=null
}},enabled:new LzAlwaysExpr("$m145","$m146"),id:"rb8",selected:new LzAlwaysExpr("$m147","$m148"),text:"swf8",value:"swf8"},"class":$lzc$class_m197},{attrs:{$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="rb9";rb9=$0
}else if(rb9===$0){
rb9=null;$0.id=null
}},enabled:new LzAlwaysExpr("$m149","$m150"),id:"rb9",selected:new LzAlwaysExpr("$m151","$m152"),text:"swf9",value:"swf9"},"class":$lzc$class_m198},{attrs:{$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="rb10";rb10=$0
}else if(rb10===$0){
rb10=null;$0.id=null
}},enabled:new LzAlwaysExpr("$m153","$m154"),id:"rb10",selected:new LzAlwaysExpr("$m155","$m156"),text:"swf10",value:"swf10"},"class":$lzc$class_m199},{attrs:{$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="rbdhtml";rbdhtml=$0
}else if(rbdhtml===$0){
rbdhtml=null;$0.id=null
}},enabled:new LzAlwaysExpr("$m157","$m158"),id:"rbdhtml",selected:new LzAlwaysExpr("$m159","$m160"),text:"DHTML",value:"dhtml"},"class":$lzc$class_m200}],"class":$lzc$class_radiogroup},{attrs:{$delegates:["onvalue","$m172","$m171","onvalue","$m174","$m173"],x:new LzOnceExpr("$m161")},"class":$lzc$class_m201}],"class":LzView},{attrs:{x:new LzAlwaysExpr("$m175","$m176")},"class":$lzc$class_m206}],"class":LzView},{attrs:{bgcolor:LzColorUtils.convertColor("0x0"),height:1,width:new LzAlwaysExpr("$m178","$m179"),y:39},"class":$lzc$class_m208},{attrs:{width:new LzAlwaysExpr("$m180","$m181"),y:43},"class":$lzc$class_m209},{attrs:{$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="cb_remotedebug";cb_remotedebug=$0
}else if(cb_remotedebug===$0){
cb_remotedebug=null;$0.id=null
}},id:"cb_remotedebug",text:"Console Remote Debug",value:new LzAlwaysExpr("$m191","$m192"),visible:new LzAlwaysExpr("$m189","$m190"),x:new LzAlwaysExpr("$m187","$m188"),y:10},"class":$lzc$class_m215}],"class":LzView}],"attributes",new LzInheritedHash(LzView.attributes)]);canvas.LzInstantiateView({attrs:{$lzc$bind_name:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
main=$0
}else if(main===$0){
main=null
}},controls:void 0,logo:void 0,name:"main",width:new LzAlwaysExpr("$m137","$m138")},"class":$lzc$class_m193},91);lz["basefocusview"]=$lzc$class_basefocusview;lz["focusoverlay"]=$lzc$class_focusoverlay;lz["_componentmanager"]=$lzc$class__componentmanager;lz["style"]=$lzc$class_style;lz["statictext"]=$lzc$class_statictext;lz["basecomponent"]=$lzc$class_basecomponent;lz["basebutton"]=$lzc$class_basebutton;lz["swatchview"]=$lzc$class_swatchview;lz["button"]=$lzc$class_button;lz["basevaluecomponent"]=$lzc$class_basevaluecomponent;lz["baseformitem"]=$lzc$class_baseformitem;lz["multistatebutton"]=$lzc$class_multistatebutton;lz["checkbox"]=$lzc$class_checkbox;lz["listselector"]=$lzc$class_listselector;lz["datalistselector"]=$lzc$class_datalistselector;lz["baselist"]=$lzc$class_baselist;lz["baselistitem"]=$lzc$class_baselistitem;lz["simplelayout"]=$lzc$class_simplelayout;lz["radiogroup"]=$lzc$class_radiogroup;lz["radiobutton"]=$lzc$class_radiobutton;canvas.initDone();