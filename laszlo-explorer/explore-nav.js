LzResourceLibrary.lzfocusbracket_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft.png","lps/components/lz/resources/focus/focus_top_rt.png","lps/components/lz/resources/focus/focus_bot_lft.png","lps/components/lz/resources/focus/focus_bot_rt.png"],width:7,height:7,sprite:"lps/components/lz/resources/focus/focus_top_lft.sprite.png",spriteoffset:0};LzResourceLibrary.lzfocusbracket_shdw={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft_shdw.png","lps/components/lz/resources/focus/focus_top_rt_shdw.png","lps/components/lz/resources/focus/focus_bot_lft_shdw.png","lps/components/lz/resources/focus/focus_bot_rt_shdw.png"],width:9,height:9,sprite:"lps/components/lz/resources/focus/focus_top_lft_shdw.sprite.png",spriteoffset:7};LzResourceLibrary.lzradio_rsrc={ptype:"sr",frames:["lps/components/lz/resources/radio/autoPng/radiobtn_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_mo.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_dn.png"],width:14,height:14,sprite:"lps/components/lz/resources/radio/autoPng/radiobtn_up.sprite.png",spriteoffset:16};LzResourceLibrary.sitelink={ptype:"ar",frames:["assets/sitelink.png","assets/sitelink_slct.png"],width:127,height:12,sprite:"assets/sitelink.sprite.png",spriteoffset:30};LzResourceLibrary.icon={ptype:"ar",frames:["images/arrow_close.png","images/arrow_open.png","assets/autoPng/icon_inline.png","assets/autoPng/icon_popup.png"],width:11,height:11,sprite:"images/arrow_close.sprite.png",spriteoffset:42};LzResourceLibrary.sect_arrow={ptype:"ar",frames:["assets/autoPng/icon_section_arrow_close.png","assets/autoPng/icon_section_arrow_open.png"],width:9,height:9,sprite:"assets/autoPng/icon_section_arrow_close.sprite.png",spriteoffset:53};LzResourceLibrary.topic_arrow={ptype:"ar",frames:["assets/autoPng/icon_topic_arrow_close.png","assets/autoPng/icon_topic_arrow_open.png"],width:8,height:8,sprite:"assets/autoPng/icon_topic_arrow_close.sprite.png",spriteoffset:62};LzResourceLibrary.section_btn={ptype:"ar",frames:["images/nav1_btn_up.png","images/nav1_btn_mo.png","images/nav1_btn_dn.png","images/nav1_btn_slct.png"],width:205,height:31,sprite:"images/nav1_btn_up.sprite.png",spriteoffset:70};LzResourceLibrary.topic_btn={ptype:"ar",frames:["images/nav2_btn_up.png","images/nav2_btn_mo.png","images/nav2_btn_dn.png","images/nav2_btn_slct.png"],width:205,height:31,sprite:"images/nav2_btn_up.sprite.png",spriteoffset:101};LzResourceLibrary.item_btn={ptype:"ar",frames:["images/nav3_btn_up.png","images/nav3_btn_mo.png","images/nav3_btn_dn.png","images/nav3_btn_slct.png"],width:205,height:31,sprite:"images/nav3_btn_up.sprite.png",spriteoffset:132};LzResourceLibrary.subitem_btn={ptype:"ar",frames:["images/nav4_btn_up.png","images/nav4_btn_mo.png","images/nav4_btn_dn.png","images/nav4_btn_slct.png"],width:205,height:26,sprite:"images/nav4_btn_up.sprite.png",spriteoffset:163};LzResourceLibrary.navbg={ptype:"ar",frames:["images/nav_bg.png"],width:200,height:600,spriteoffset:189};LzResourceLibrary.logobtn={ptype:"ar",frames:["images/openlaszlo_explorer_logo.png","images/openlaszlo_explorer_logo_mo.png"],width:160,height:33,sprite:"images/openlaszlo_explorer_logo.sprite.png",spriteoffset:789};LzResourceLibrary.__allcss={path:"explore-nav.sprite.png"};var navdata=null;var treecontainer=null;var browser=null;Class.make("$lzc$class_m2",["bookmark",void 0,"onbookmark",void 0,"lastbookmark",void 0,"$lzc$set_bookmark",function($0){
with(this){
if($0==null||this.lastbookmark==$0)return;this.lastbookmark=$0;this.bookmark=$0.split("|");lz.Browser.setWindowTitle("Laszlo Explorer: "+this.bookmark.join(":"));if(this.onbookmark.ready)this.onbookmark.sendEvent(this.bookmark)
}},"loadcounter",void 0,"$m1",function($0){
with(this){
var $1=lz.Browser.getInitArg("navset");if($1==null){
$1="nav_dhtml.xml"
};canvas.navdata.setAttribute("src",$1);canvas.navdata.doRequest()
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
}],LzCanvas,["attributes",new LzInheritedHash(LzCanvas.attributes)]);canvas=new $lzc$class_m2(null,{$delegates:["oninit","$m1",null],__LZproxied:"true",appbuilddate:"2010-04-14T04:44:25Z",bgcolor:15395562,bookmark:void 0,embedfonts:true,font:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",height:"100%",history:true,lastbookmark:"",loadcounter:0,lpsbuild:"16102 /Users/maxcarlson/openlaszlo/trunk-clean",lpsbuilddate:"2010-04-11T19:27:08Z",lpsrelease:"Latest",lpsversion:"5.0.x",onbookmark:LzDeclaredEvent,runtime:"dhtml",title:"Laszlo Explorer",width:"100%"});lz.colors.offwhite=15921906;lz.colors.gray10=1710618;lz.colors.gray20=3355443;lz.colors.gray30=5066061;lz.colors.gray40=6710886;lz.colors.gray50=8355711;lz.colors.gray60=10066329;lz.colors.gray70=11776947;lz.colors.gray80=13421772;lz.colors.gray90=15066597;lz.colors.iceblue1=3298963;lz.colors.iceblue2=5472718;lz.colors.iceblue3=12240085;lz.colors.iceblue4=14017779;lz.colors.iceblue5=15659509;lz.colors.palegreen1=4290113;lz.colors.palegreen2=11785139;lz.colors.palegreen3=12637341;lz.colors.palegreen4=13888170;lz.colors.palegreen5=15725032;lz.colors.gold1=9331721;lz.colors.gold2=13349195;lz.colors.gold3=15126388;lz.colors.gold4=16311446;lz.colors.sand1=13944481;lz.colors.sand2=14276546;lz.colors.sand3=15920859;lz.colors.sand4=15986401;lz.colors.ltpurple1=6575768;lz.colors.ltpurple2=12038353;lz.colors.ltpurple3=13353453;lz.colors.ltpurple4=15329264;lz.colors.grayblue=12501704;lz.colors.graygreen=12635328;lz.colors.graypurple=10460593;lz.colors.ltblue=14540287;lz.colors.ltgreen=14548957;Class.make("$lzc$class_basefocusview",["active",void 0,"$lzc$set_active",function($0){
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
if(this["isdefault"]&&this.isdefault){
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
}}})($lzc$class_basebutton);Class.make("$lzc$class_treeselector",["multiselect",void 0,"isRangeSelect",function($0){
with(this){
var $1=false;if(multiselect)$1=(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["isRangeSelect"]||this.nextMethod(arguments.callee,"isRangeSelect")).call(this,$0);return $1
}},"isMultiSelect",function($0){
with(this){
var $1=false;if(multiselect)$1=(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["isMultiSelect"]||this.nextMethod(arguments.callee,"isMultiSelect")).call(this,$0);return $1
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
}],LzSelectionManager,["tagname","treeselector","attributes",new LzInheritedHash(LzSelectionManager.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({multiselect:false},$lzc$class_treeselector.attributes)
}}})($lzc$class_treeselector);Class.make("$lzc$class_simplelayout",["axis",void 0,"$lzc$set_axis",function($0){
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
}}})($lzc$class_simplelayout);Class.make("$lzc$class_m64",["$m55",function($0){
with(this){
classroot.keyboardNavigate($0)
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
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m65",["$m56",function($0){
with(this){
var $1=parent.xindent;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m57",function(){
with(this){
return [parent,"xindent"]
}},"$m58",function($0){
with(this){
var $1=parent.yindent;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m59",function(){
with(this){
return [parent,"yindent"]
}},"init",function(){
with(this){
this.setAttribute("visible",classroot.open&&this.subviews!=null);(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this)
}},"$m60",function($0){
with(this){
if(this.subviews.length==1&&classroot.open){
setAttribute("visible",true)
}}},"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
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
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_basetree",["open",void 0,"$lzc$set_open",function($0){
with(this){
_setOpen($0)
}},"closesiblings",void 0,"closechildren",void 0,"autoscroll",void 0,"selected",void 0,"$lzc$set_selected",function($0){
with(this){
_setSelected($0)
}},"xindent",void 0,"yindent",void 0,"recurse",void 0,"showroot",void 0,"multiselect",void 0,"toggleselected",void 0,"focusselect",void 0,"focused",void 0,"focusoverlay",void 0,"isleaf",void 0,"$lzc$set_isleaf",function($0){
with(this){
_setIsLeaf($0)
}},"_currentChild",void 0,"_lastfocused",void 0,"_selector",void 0,"onopen",void 0,"onselected",void 0,"onselect",void 0,"onfocused",void 0,"_children",void 0,"init",function(){
with(this){
if(this.datapath){
createChildTrees()
};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this);if(canvas["accessible"]){
this._accessibleState.setAttribute("applied",true)
};if(this._children==null){
this._children=this.searchSubnodes("name",this.defaultplacement)
};if(this.isRoot()){
var $0=this.item;if(!this.showroot){
this.item.destroy();this.item=null;this.setAttribute("open",true);this.children.setAttribute("x",0);this.children.setAttribute("y",0);var $1=this.children.subviews;if($1&&(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa($1[0]):$1[0] instanceof lz.basetree)){
$0=$1[0].item
}};this._selector=new (lz.treeselector)(this,{multiselect:this.multiselect,toggle:this.toggleselected});if(canvas["accessible"]){
this.getChildIds();var $2=this.getMCRef();$2._accImpl={};$2._accImpl.stub=false;$2._accImpl.master=this;$2._accImpl.get_accRole=function($0){
return $0==0?35:36
};$2._accImpl.get_accName=function($0){
var $1=this.master.getRoot();var $2=$1.nodebychildid[$0];if(!$2)return "";var $3=$2.text+$1.getLocationDescription($2);return $3
};$2._accImpl.get_accState=function($0){
var $1=0;if(!this.master.enabled){
$1|=1
}else{
$1|=1048576;if(this.master.focused){
$1|=4
}};if($0==0)return $1;$1|=2097152;var $2=this.master.getRoot();var $3=$2.nodebychildid[$0];if(!$3)return;if(!$3.isleaf){
if($3.open){
$1|=512
}else{
$1|=1024
}};if($3.focused){
$1|=2|4
};return $1
};$2._accImpl.get_accDefaultAction=function($0){
if($0<=0)return;var $1=this.master.getRoot();var $2=$1.nodebychildid[$0];if(!$2)return "";if(!$2.isleaf){
return $2.open?"Collapse":"Expand"
};return ""
};$2._accImpl.accDoDefaultAction=function($0){
if($0<=0)return;var $1=this.master.getRoot();var $2=$1.nodebychildid[$0];if(!$2)return;if(!$2.isleaf){
var $3=!$2.open;for(var $4=$0;$4>0;$4--){
var $5=$1.nodebychildid[$4];if(!$5.open)$5.setAttribute("open",true)
};$2.setAttribute("open",$3)
}};$2._accImpl.getChildIdArray=function(){
var $0=this.master.getLength();var $1=new Array($0);for(var $2=0;$2<$0;$2++){
$1[$2]=$2+1
};return $1
};$2._accImpl.get_accValue=function($0){
if($0<0)return;var $1=this.master.getRoot();if($0>0){
var $2=$1.nodebychildid[$0];if($2)return $2.getDepth($2)+""
}else{
var $3=$1._selected;var $4=$3.text+$1.getLocationDescription($3);return $4
};return ""
}};this.changeFocus($0.parent)
};if(this.selected)this._setSelected(true)
}},"destroy",function(){
if(this["children"]){
this.openChildren(false);this.children.destroy()
};(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["destroy"]||this.nextMethod(arguments.callee,"destroy")).call(this)
},"createChildTrees",function(){
var $0=this.datapath.getNodeCount();if($0==0||$0==1&&this.datapath.getNodeText()!=""){
return
};if(this.children.subviews!=null&&this.children.subviews.length!=0){
this.recurse=false
};if(!this.recurse)return;var $1={};for(var $2 in this._instanceAttrs){
if($2=="id")continue;if($2=="showroot")continue;$1[$2]=this._instanceAttrs[$2]
};if(this.datapath["xpath"]!=null){
$1.datapath=this.datapath.xpath
}else if(this.cloneManager.xpath!=null){
$1.datapath=this.cloneManager.xpath
}else{
return
};var $3=this.getChildClass();if($3!=null){
new $3(this,$1,null,true)
}},"_setOpen",function($0){
with(this){
if(_initcomplete&&this.isleaf){
this.open=false;return
};if(this.closesiblings&&!this.isRoot()){
var $1=parent.children.subviews;if($1["length"]!=null){
for(var $2=0;$2<$1.length;$2++){
if($1[$2]["open"]&&$1[$2]!=this){
$1[$2].setAttribute("open",false)
}}}};if(typeof $0=="string"){
$0=$0=="true"
}else if($0==null){
$0=false
};this.open=$0;if(!_initcomplete)return;if(!this.isRoot()){
if(this.closesiblings){
var $1=parent._children.subviews;for(var $2=0;$2<$1.length;$2++){
if($1[$2].open&&$1[$2]!=this){
$1[$2].open=false;$1[$2].openChildren(false);if($1[$2].onopen){
$1[$2].onopen.sendEvent(false)
}}}}};var $3=this._children.subviews;if(this.closechildren&&$3){
for(var $2=0;$2<$3.length;$2++){
if($3[$2].open){
$3[$2].setAttribute("open",false)
}}};openChildren($0);if(this.onopen)this.onopen.sendEvent($0)
}},"_setSelected",function($0){
with(this){
if(_initcomplete){
var $1=this.getRoot();if($0){
$1._selector.select(this)
}else{
$1._selector.unselect(this)
}}else{
if(typeof $0=="string"){
$0=$0=="true"
};this.setSelected($0)
}}},"_setIsLeaf",function($0){
if(typeof $0=="string"){
$0=$0=="true"
}else if($0==null){
$0=false
};this.isleaf=$0
},"getChildClass",function(){
if(this.isleaf)return null;return this.constructor
},"isRoot",function(){
with(this){
return !(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa(parent):parent instanceof lz.basetree)
}},"getRoot",function(){
with(this){
var $0=this;var $1=$0.parent;while(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa($1):$1 instanceof lz.basetree){
$0=$0.parent;$1=$0.parent
};return $0
}},"keySelect",function(){
this.setAttribute("selected",true)
},"getSelection",function(){
var $0=this.getRoot();var $1=$0._selector.getSelection();if($0._selector.multiselect){
return $1
}else if($1.length==0){
return null
}else{
return $1[0]
}},"setSelected",function($0){
this.selected=$0;var $1=this.getRoot();$1._selected=this;if($1.onselect)$1.onselect.sendEvent(this);if(this!=$1&&this.onselect)this.onselect.sendEvent(this);if(this.onselected)this.onselected.sendEvent($0)
},"changeFocus",function($0){
with(this){
if($0==null)$0=this;var $1=$0.getRoot();if($1._lastfocused){
$1._lastfocused.setTreeFocus(false,$1)
};if($0!=$1){
var $2=$0.parent.getChildIndex($0);if($2!=-1){
$0.parent.setAttribute("_currentChild",$2)
}};$1.setAttribute("_lastfocused",$0);$0.setTreeFocus(true,$1);var $3=$1.focusoverlay;if($1.focusselect){
$3=false
};lz.Focus.setFocus($0.item,$3);if($1.focusselect)$0.setAttribute("selected",true);if($1.autoscroll)$0.doAutoScroll($1)
}},"doAutoScroll",function($0){
if($0.height>$0.parent.height){
var $1=this.getAttributeRelative("y",$0);if($1<0){
$0.setAttribute("y",$0.y-$1);return
};var $2=$0.parent.height-$1-this.item.height;if($2<0){
$0.setAttribute("y",$0.y+$2)
}}},"setTreeFocus",function($0,$1){
if(this["item"]){
this.item.setAttribute("focusable",$0)
};this.setAttribute("focused",$0);if($1==null)$1=this.getRoot();if($1.onfocus)$1.onfocus.sendEvent(this);if(this!=$1&&this.onfocus)this.onfocus.sendEvent(this);if(this.onfocused)this.onfocused.sendEvent($0)
},"getChildIndex",function($0){
with(this){
var $1=this.children.subviews;if($1!=null){
for(var $2=0;$2<$1;$2++){
if(children.subviews[$2]==$0){
return $2
}}};return -1
}},"_focusParent",function(){
with(this){
if(this.isRoot()||parent.item==null)return;this.setAttribute("_currentChild",0);this.changeFocus(parent)
}},"_focusFirstChild",function(){
with(this){
var $0=0;if(children.subviews&&(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa(children.subviews[$0]):children.subviews[$0] instanceof lz.basetree)){
this.setAttribute("_currentChild",$0);this.changeFocus(children.subviews[$0])
}}},"_focusLastChild",function(){
with(this){
var $0=children.subviews.length-1;if(children.subviews&&(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa(children.subviews[$0]):children.subviews[$0] instanceof lz.basetree)){
var $1=children.subviews[$0];if($1.open&&$1.children.subviews){
var $2=$1.children.subviews.length-1;if(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa($1.children.subviews[$2]):$1.children.subviews[$2] instanceof lz.basetree){
$1._focusLastChild();return
}};this.setAttribute("_currentChild",$0);this.changeFocus(children.subviews[$0])
}}},"_focusPreviousSibling",function(){
with(this){
if(this.isRoot())return;if(parent._currentChild==0){
this._focusParent();return
};var $0=parent._currentChild-1;parent.setAttribute("_currentChild",$0);var $1=parent.children.subviews[$0];if($1.open&&$1.children.subviews&&(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa($1.children.subviews[0]):$1.children.subviews[0] instanceof lz.basetree)){
$1._focusLastChild()
}else{
this.changeFocus($1)
}}},"_focusNextSibling",function(){
with(this){
if(this.isRoot())return;var $0=parent._currentChild+1;if($0<parent.children.subviews.length){
parent.setAttribute("_currentChild",$0);this.changeFocus(parent.children.subviews[$0])
}else if(!this.isRoot()){
parent._focusNextSibling()
}}},"keyboardNavigate",function($0){
with(this){
if($0==32){
this.keySelect()
}else if($0==37){
if(this.open){
this.setAttribute("open",false)
}else{
this._focusParent()
}}else if($0==38){
this._focusPreviousSibling()
}else if($0==39){
if(!this.open){
this.setAttribute("open",true)
}else{
this._focusFirstChild()
}}else if($0==40){
if(this.open&&this.children.subviews&&(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa(this.children.subviews[0]):this.children.subviews[0] instanceof lz.basetree)){
this._focusFirstChild()
}else{
this._focusNextSibling()
}}}},"item",void 0,"openChildren",function($0){
with(this){
var $1=$0&&children.subviews!=null;children.setAttribute("visible",$1)
}},"getChildIds",function(){
with(this){
var $0=[0,this];var $1={};$1[this.getUID()]=1;var $2=[].concat(this.children.subviews);while($2.length){
var $3=$2.shift();if($3.visible&&(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa($3):$3 instanceof lz.basetree)){
$1[$3.getUID()]=$0.length;$0.push($3);if($3.children.subviews.length){
$2=$2.concat($3.children.subviews)
}}};this.nodebychildid=$0;this.childidfromnodeid=$1
}},"getLength",function(){
var $0=this.getRoot();var $1=$0.nodebychildid.length;return $1
},"getDepth",function($0){
with(this){
var $1=2;var $2=$0.parent;var $3=$0.getRoot();if($0===$3)return 1;while($2&&$2!=$3&&$2!=canvas){
if(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa($2):$2 instanceof lz.basetree)$1++;$2=$2.parent
};return $1
}},"getLocationDescription",function($0){
with(this){
var $1=$0.immediateparent.subviews;var $2=1;var $3=0;if($1){
var $4=$1.length;for(var $5=0;$5<$4;$5++){
var $6=$1[$5];if(lz.basetree["$lzsc$isa"]?lz.basetree.$lzsc$isa($6):$6 instanceof lz.basetree){
$3++;if($6===$0){
$2=$3
}}}};return ", "+$2+" of "+$3
}},"children",void 0,"_accessibleState",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
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
}],$lzc$class_basecomponent,["tagname","basetree","children",[{attrs:{$classrootdepth:1,$delegates:["onkeydown","$m55",null],name:"item"},"class":$lzc$class_m64},{attrs:{$classrootdepth:1,$delegates:["onaddsubview","$m60",null],name:"children",x:new LzAlwaysExpr("$m56","$m57"),y:new LzAlwaysExpr("$m58","$m59")},"class":$lzc$class_m65},{attrs:{$classrootdepth:1,$delegates:["onfocused","$m61",null,"onopen","$m62",null,"ontext","$m63",null],$m61:function($0){
with(this){
var $1=this.getRoot();if(!$1||!$1.childidfromnodeid)return;var $2=$1.childidfromnodeid[this.getUID()];if($0&&$2>=0){
$1.sendAAEvent($2,EVENT_OBJECT_FOCUS);$1.sendAAEvent($2,EVENT_OBJECT_SELECTION)
}}},$m62:function($0){
with(this){
var $1=this.getRoot();var $2=$1.childidfromnodeid[this.getUID()];$1.sendAAEvent($2,EVENT_OBJECT_STATECHANGE)
}},$m63:function($0){
with(this){
var $1=this.getRoot();var $2=$1.childidfromnodeid[this.getUID()];$1.sendAAEvent($2,EVENT_OBJECT_NAMECHANGE);lz.Browser.updateAccessibility()
}},EVENT_OBJECT_FOCUS:32773,EVENT_OBJECT_NAMECHANGE:32780,EVENT_OBJECT_SELECTION:32774,EVENT_OBJECT_STATECHANGE:32778,name:"_accessibleState"},"class":LzState},{attrs:"children","class":$lzc$class_userClassPlacement}],"attributes",new LzInheritedHash($lzc$class_basecomponent.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({_children:null,_currentChild:0,_lastfocused:null,_selector:null,autoscroll:false,closechildren:false,closesiblings:false,focusable:false,focused:false,focusoverlay:false,focusselect:false,isleaf:false,layout:{axis:"y","class":"simplelayout",spacing:0},multiselect:false,onfocus:LzDeclaredEvent,onfocused:LzDeclaredEvent,onopen:LzDeclaredEvent,onselect:LzDeclaredEvent,onselected:LzDeclaredEvent,open:false,recurse:true,selected:false,showroot:true,toggleselected:false,xindent:10,yindent:20},$lzc$class_basetree.attributes)
}}})($lzc$class_basetree);Class.make("$lzc$class_html",["scrollbars",void 0,"loading",void 0,"ready",void 0,"history",void 0,"minimumheight",void 0,"minimumwidth",void 0,"mouseevents",void 0,"$lzc$set_mouseevents",function($0){
with(this){
this.mouseevents=$0;if(this["iframeid"]){
lz.embed.iframemanager.setSendMouseEvents(this.iframeid,$0)
}else{
this.__mouseevents=$0
};if(this["onmouseevents"]&&this.onmouseevents.ready)this.onmouseevents.sendEvent($0)
}},"shownativecontextmenu",void 0,"$lzc$set_shownativecontextmenu",function($0){
with(this){
this.shownativecontextmenu=$0;if(this["iframeid"]){
lz.embed.iframemanager.setShowNativeContextMenu(this.iframeid,$0,true)
}else{
this.__shownativecontextmenu=$0
};if(this["onshownativecontextmenu"]&&this.onshownativecontextmenu.ready)this.onshownativecontextmenu.sendEvent($0)
}},"$m66",function($0){
var $1=this.parent;if($1!==this["target"]||!this.inited){
this.setAttribute("target",$1)
}},"$m67",function(){
return [this,"parent"]
},"target",void 0,"framename",void 0,"onready",void 0,"$lzc$set_target",function($0){
with(this){
if($0==null)return;this.target=$0;if(this["_posdel"]){
this._posdel.unregisterAll()
}else{
this._posdel=new LzDelegate(this,"__updatepos")
};if($0!=this){
this._posdel.register(this,"onwidth");this._posdel.register(this,"onheight")
};this._posdel.register(this.target,"onwidth");this._posdel.register(this.target,"onheight");this.__updatepos(null);if(this["ontarget"])this.ontarget.sendEvent($0)
}},"$lzc$set_visible",function($0){
with(this){
this.visible=$0;if(this["iframeid"])lz.embed.iframemanager.setVisible(this.iframeid,$0);if(this["onvisible"])this.onvisible.sendEvent($0)
}},"src",void 0,"onsrc",void 0,"$lzc$set_src",function($0){
with(this){
this.src=$0;this.setAttribute("loading",true);if(this["iframeid"]){
lz.embed.iframemanager.setSrc(this.iframeid,$0,this.history)
}else{
this.__srcset=$0
};this.onsrc.sendEvent($0)
}},"init",function(){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["init"]||this.nextMethod(arguments.callee,"init")).call(this);var $0=lz.embed.iframemanager.create(this,this.framename,this.scrollbars,this.sprite.__LZdiv,0,canvas);if($0)this.setiframeid($0)
}},"__updatepos",function($0){
with(this){
if(!this["iframeid"])return;var $1=null;var $2=null;var $3=this.sprite.getZ();var $4=Math.max(this.width,this.minimumwidth);var $5=Math.max(this.height,this.minimumheight);lz.embed.iframemanager.setPosition(this.iframeid,$1,$2,$4,$5,this.visible,$3)
}},"setiframeid",function($0){
with(this){
this.iframeid=$0;if(this["isfront"])this.bringToFront();if(this["__srcset"])lz.embed.iframemanager.setSrc($0,this.__srcset,this.history);this.__updatepos(null);this.setAttribute("clickable",true);this.setAttribute("ready",true);if(this["__mouseevents"])lz.embed.iframemanager.setSendMouseEvents($0,this.__mouseevents);if(this["__shownativecontextmenu"])lz.embed.iframemanager.setShowNativeContextMenu($0,this.__shownativecontextmenu)
}},"__gotload",function(){
if(this["src"]==null)return;this.setAttribute("loading",false);this.__updatepos(null);this.onload.sendEvent()
},"bringToFront",function(){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["bringToFront"]||this.nextMethod(arguments.callee,"bringToFront")).call(this);if(this["isfront"]==true||!this["iframeid"])return;this.isfront=true;lz.embed.iframemanager.setZ(this.iframeid,this.sprite.getZ())
}},"sendToBack",function(){
with(this){
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["sendToBack"]||this.nextMethod(arguments.callee,"sendToBack")).call(this);if(this["isfront"]==false||!this["iframeid"])return;this.isfront=false;if(this["iframeid"])lz.embed.iframemanager.sendToBack(this.iframeid);lz.embed.iframemanager.setZ(this.iframeid,this.sprite.getZ())
}},"scrollBy",function($0,$1){
with(this){
if(this["iframeid"])lz.embed.iframemanager.scrollBy(this.iframeid,$0,$1)
}},"callJavascript",function($0,$1){
with(this){
switch(arguments.length){
case 1:
$1=null;

};var $2=Array.prototype.slice.call(arguments,2);lz.embed.iframemanager.callJavascript(this.iframeid,$0,$1,$2)
}},"restoreSelection",function(){
with(this){
lz.embed.iframemanager.restoreSelection(this.iframeid)
}},"storeSelection",function(){
with(this){
lz.embed.iframemanager.storeSelection(this.iframeid)
}},"destroy",function(){
with(this){
if(this["iframeid"])lz.embed.iframemanager.__destroy(this.iframeid);(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["destroy"]||this.nextMethod(arguments.callee,"destroy")).call(this)
}},"$m68",function($0){
with(this){
if(!this["iframeid"])return;LzMouseKernel.disableMouseTemporarily()
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
}],LzView,["tagname","html","attributes",new LzInheritedHash(LzView.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({$delegates:["onmouseover","$m68",null],clickable:true,framename:"",history:true,loading:false,minimumheight:0,minimumwidth:0,mouseevents:true,onload:LzDeclaredEvent,onready:LzDeclaredEvent,onsrc:LzDeclaredEvent,ready:false,scrollbars:true,shownativecontextmenu:true,target:new LzAlwaysExpr("$m66","$m67"),visible:true},$lzc$class_html.attributes)
}}})($lzc$class_html);Class.make("$lzc$class_basevaluecomponent",["value",void 0,"type",void 0,"getValue",function(){
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
}}})($lzc$class_basevaluecomponent);Class.make("$lzc$class_baseformitem",["_parentform",void 0,"submitname",void 0,"$m69",function($0){
with(this){
var $1=enabled;if($1!==this["submit"]||!this.inited){
this.setAttribute("submit",$1)
}}},"$m70",function(){
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
LzNode.mergeAttributes({_parentform:null,changed:false,ignoreform:false,onchanged:LzDeclaredEvent,onvalue:LzDeclaredEvent,rollbackvalue:null,submit:new LzAlwaysExpr("$m69","$m70"),submitname:"",value:null},$lzc$class_baseformitem.attributes)
}}})($lzc$class_baseformitem);Class.make("$lzc$class_listselector",["multiselect",void 0,"_forcemulti",void 0,"isRangeSelect",function($0){
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
}}})($lzc$class_baselistitem);Class.make("$lzc$class_multistatebutton",["statenum",void 0,"$lzc$set_statenum",function($0){
this.setStateNum($0)
},"statelength",void 0,"$lzc$set_statelength",function($0){
this.setStateLength($0)
},"maxstate",void 0,"lastres",void 0,"$m71",function($0){
var $1=this.lastres+this.statenum*this.statelength;if($1!==this["frame"]||!this.inited){
this.setAttribute("frame",$1)
}},"$m72",function(){
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
LzNode.mergeAttributes({clickable:true,frame:new LzAlwaysExpr("$m71","$m72"),lastres:1,maxstate:0,onstatelength:LzDeclaredEvent,onstatenum:LzDeclaredEvent,statelength:3,statenum:0},$lzc$class_multistatebutton.attributes)
}}})($lzc$class_multistatebutton);Class.make("$lzc$class_radiogroup",["$lzc$set_value",function($0){
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
}}})($lzc$class_radiogroup);Class.make("$lzc$class_m84",["$m77",function($0){
with(this){
var $1=parent.selected?1:0;if($1!==this["statenum"]||!this.inited){
this.setAttribute("statenum",$1)
}}},"$m78",function(){
with(this){
return [parent,"selected"]
}},"$m79",function($0){
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
}],$lzc$class_multistatebutton,["attributes",new LzInheritedHash($lzc$class_multistatebutton.attributes)]);Class.make("$lzc$class_m85",["$m80",function($0){
with(this){
var $1=classroot.text_y;if($1!==this["y"]||!this.inited){
this.setAttribute("y",$1)
}}},"$m81",function(){
with(this){
return [classroot,"text_y"]
}},"$m82",function($0){
with(this){
var $1=parent.text;if($1!==this["text"]||!this.inited){
this.setAttribute("text",$1)
}}},"$m83",function(){
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
}}}},"accessible",void 0,"$m75",function($0){
var $1=this.rb.height/2-this._title.height/2;if($1!==this["text_y"]||!this.inited){
this.setAttribute("text_y",$1)
}},"$m76",function(){
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
}],$lzc$class_baselistitem,["tagname","radiobutton","children",[{attrs:{$classrootdepth:1,$delegates:["onselected","$m73",null,"ontext","$m74",null],$m73:function($0){
with(this){
if(!this.isinited){
return
};if(this.selected){
this.sendAAEvent(0,EVENT_OBJECT_FOCUS)
};this.sendAAEvent(0,EVENT_OBJECT_STATECHANGE,true)
}},$m74:function($0){
with(this){
this.sendAAEvent(0,EVENT_OBJECT_NAMECHANGE)
}},EVENT_OBJECT_FOCUS:32773,EVENT_OBJECT_NAMECHANGE:32780,EVENT_OBJECT_SELECTION:32774,EVENT_OBJECT_STATECHANGE:32778,name:"accessible",updateFocus:function($0){
with(this){
if($0){
this.sendAAEvent(0,EVENT_OBJECT_SELECTION);this.sendAAEvent(0,EVENT_OBJECT_FOCUS)
};this.sendAAEvent(0,EVENT_OBJECT_STATECHANGE,true)
}}},"class":LzState},{attrs:{$classrootdepth:1,maxstate:1,name:"rb",reference:new LzOnceExpr("$m79"),resource:"lzradio_rsrc",statelength:4,statenum:new LzAlwaysExpr("$m77","$m78"),text:""},"class":$lzc$class_m84},{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$m82","$m83"),x:17,y:new LzAlwaysExpr("$m80","$m81")},"class":$lzc$class_m85}],"attributes",new LzInheritedHash($lzc$class_baselistitem.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({clickable:true,focusable:false,initcomplete:0,text_y:new LzAlwaysExpr("$m75","$m76")},$lzc$class_radiobutton.attributes)
}}})($lzc$class_radiobutton);navdata=canvas.lzAddLocalData("navdata","<data />",false,false);navdata==true;Class.make("$lzc$class_m89",["$m86",function($0){
with(this){
this.setAttribute("target",parent.item)
}},"$m87",function($0){
with(this){
this.setAttribute("to",160+7*(parent.item.level+1))
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
}],LzAnimator,["attributes",new LzInheritedHash(LzAnimator.attributes)]);Class.make("$lzc$class_m90",["$m88",function($0){
with(this){
parent.item.onopendone.sendEvent()
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
}],LzAnimatorGroup,["children",[{attrs:{$classrootdepth:2,attribute:"inset",relative:false,start:false,to:-6},"class":LzAnimator},{attrs:{$classrootdepth:2,attribute:"spacing",relative:false,start:false,to:-6},"class":LzAnimator}],"attributes",new LzInheritedHash(LzAnimatorGroup.attributes)]);Class.make("$lzc$class_openanimator",["item",void 0,"open",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
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
}],LzAnimatorGroup,["tagname","openanimator","children",[{attrs:{$classrootdepth:1,attribute:"width",duration:"100",relative:false,target:new LzOnceExpr("$m86"),to:new LzOnceExpr("$m87")},"class":$lzc$class_m89},{attrs:{$classrootdepth:1,$delegates:["onstop","$m88",null],duration:"250",name:"open",process:"simultaneous",start:false},"class":$lzc$class_m90}],"attributes",new LzInheritedHash(LzAnimatorGroup.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({item:null,process:"sequential",start:false},$lzc$class_openanimator.attributes)
}}})($lzc$class_openanimator);Class.make("$lzc$class_m99",["$m92",function($0){
with(this){
var $1=-parent.parent.parent.hgt;if($1!==this["to"]||!this.inited){
this.setAttribute("to",$1)
}}},"$m93",function(){
with(this){
return [parent.parent.parent,"hgt"]
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
}],LzAnimator,["attributes",new LzInheritedHash(LzAnimator.attributes)]);Class.make("$lzc$class_m100",["$m94",function($0){
with(this){
var $1=-parent.parent.parent.hgt;if($1!==this["to"]||!this.inited){
this.setAttribute("to",$1)
}}},"$m95",function(){
with(this){
return [parent.parent.parent,"hgt"]
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
}],LzAnimator,["attributes",new LzInheritedHash(LzAnimator.attributes)]);Class.make("$lzc$class_m98",["$m91",function($0){
with(this){
parent.item.children.setAttribute("visible",false)
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
}],LzAnimatorGroup,["children",[{attrs:{$classrootdepth:2,attribute:"spacing",from:-6,relative:false,start:false,to:new LzAlwaysExpr("$m92","$m93")},"class":$lzc$class_m99},{attrs:{$classrootdepth:2,attribute:"inset",from:-6,start:false,to:new LzAlwaysExpr("$m94","$m95")},"class":$lzc$class_m100}],"attributes",new LzInheritedHash(LzAnimatorGroup.attributes)]);Class.make("$lzc$class_m101",["$m96",function($0){
with(this){
this.setAttribute("target",parent.item)
}},"$m97",function($0){
with(this){
this.setAttribute("to",160+7*parent.item.level)
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
}],LzAnimator,["attributes",new LzInheritedHash(LzAnimator.attributes)]);Class.make("$lzc$class_closeanimator",["item",void 0,"items",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
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
}],LzAnimatorGroup,["tagname","closeanimator","children",[{attrs:{$classrootdepth:1,$delegates:["onstop","$m91",null],duration:"200",name:"items",process:"simultaneous",start:false},"class":$lzc$class_m98},{attrs:{$classrootdepth:1,attribute:"width",duration:"100",relative:false,target:new LzOnceExpr("$m96"),to:new LzOnceExpr("$m97")},"class":$lzc$class_m101}],"attributes",new LzInheritedHash(LzAnimatorGroup.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({item:null,process:"sequential",start:false},$lzc$class_closeanimator.attributes)
}}})($lzc$class_closeanimator);Class.make("$lzc$class_m113",["hgt",void 0,"animateOpen",void 0,"animateClose",void 0,"doOpen",function(){
with(this){
if(this.animateOpen==null){
this.animateOpen=new (lz.openanimator)(this,{item:classroot})
};this.animateOpen.doStart()
}},"doClose",function(){
with(this){
if(this.animateClose==null){
this.animateClose=new (lz.closeanimator)(this,{item:classroot})
};this.animateClose.doStart()
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
}],$lzc$class_simplelayout,["attributes",new LzInheritedHash($lzc$class_simplelayout.attributes)]);Class.make("$lzc$class_m112",["$m106",function($0){
with(this){
var $1=classroot.width;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m107",function(){
with(this){
return [classroot,"width"]
}},"childlayout",void 0,"$classrootdepth",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
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
}],LzView,["children",[{attrs:{$classrootdepth:2,animateClose:null,animateOpen:null,hgt:0,name:"childlayout",spacing:-20},"class":$lzc$class_m113}],"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m135",["$m123",function($0){
with(this){
var $1=classroot.width;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m124",function(){
with(this){
return [classroot,"width"]
}},"$m125",function($0){
with(this){
var $1=classroot.width-200;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m126",function(){
with(this){
return [classroot,"width"]
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
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_m136",["$m127",function($0){
with(this){
var $1=classroot.width-this.width-6;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m128",function(){
with(this){
return [classroot,"width",this,"width"]
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
}],LzView,["attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_defaulttext",["$lzsc$initialize",function($0,$1,$2,$3){
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
}],LzText,["tagname","defaulttext","attributes",new LzInheritedHash(LzText.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({fgcolor:LzColorUtils.convertColor("0xffffff"),font:"helvetica,sans-serif"},$lzc$class_defaulttext.attributes)
}}})($lzc$class_defaulttext);Class.make("$lzc$class_m137",["$m129",function($0){
with(this){
var $1=6+classroot.level*7;if($1!==this["x"]||!this.inited){
this.setAttribute("x",$1)
}}},"$m130",function(){
with(this){
return [classroot,"level"]
}},"$m131",function($0){
with(this){
var $1=parent.width-x;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m132",function(){
with(this){
return [parent,"width",this,"x"]
}},"$m133",function($0){
with(this){
var $1=classroot.text;if($1!==this["text"]||!this.inited){
this.setAttribute("text",$1)
}}},"$m134",function(){
with(this){
return [classroot,"text"]
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
}],$lzc$class_defaulttext,["attributes",new LzInheritedHash($lzc$class_defaulttext.attributes)]);Class.make("$lzc$class_itembutton",["$m115",function($0){
with(this){
background.setAttribute("frame",2)
}},"$m116",function($0){
with(this){
showUp()
}},"$m117",function($0){
with(this){
background.setAttribute("frame",3)
}},"$m118",function($0){
with(this){
showUp()
}},"level",void 0,"text",void 0,"isleaf",void 0,"onopendone",void 0,"largetext",function(){
with(this){
icon.setAttribute("y",9);label.setAttribute("fgcolor",16777215);label.setAttribute("fontsize",13)
}},"smalltext",function(){
with(this){
icon.setAttribute("y",5);label.setAttribute("fgcolor",13950188);label.setAttribute("fontsize",11)
}},"$m119",function($0){
with(this){
var $1=this.datapath;this.setAttribute("isleaf",!$1.p.hasChildNodes());var $2=$1.xpathQuery("name()");this.background.setAttribute("resource",$2+"_btn");if($2=="subitem"){
this.smalltext()
}else{
this.largetext()
};var $3=$1.xpathQuery("@action");if($3=="popup"||$3=="source"||$3=="popupexternal"){
icon.setAttribute("frame",4)
}}},"$m120",function(){
with(this){
var $0=classroot;return $0
}},"doaction",function($0){
with(this){
switch(arguments.length){
case 0:
$0=null;

};var $1=this.datapath;var $2=$1.xpathQuery("@autoselect");if($2=="true"){
var $3=classroot.itemlist.subviews[0];if(lz.menubutton["$lzsc$isa"]?lz.menubutton.$lzsc$isa($3):$3 instanceof lz.menubutton){
$3.header.open()
}}else{
var $4=$1.xpathQuery("@action");var $5=$1.xpathQuery("@runtime")||$runtime;var $6=$1.xpathQuery("@src");var $7=$1.xpathQuery("@text");var $8=$1.xpathQuery("@title");if($4=="popup"){
var $9=$1.xpathQuery("@popup");var $a=$1.xpathQuery("@target");var $b=$1.xpathQuery("@width")||860;var $c=$1.xpathQuery("@height")||600;if($a==null)$a=escape($9+$5);var $d=label.formatToString("loading.jsp?src=%s&lzr=%s&lzt=html",$9,$5);var $e=label.formatToString("scrollbars=yes,width=%s,height=%s",$b,$c);if($runtime=="dhtml"){
lz.Browser.loadURL($d,$a,$e)
}else{
var $f=label.formatToString("window.open('%s', '%s', '%s')",$d,$a,$e);lz.Browser.loadJS($f)
};if($6!=null){
var $d=label.formatToString("content.jsp?src=%s&tag=%s&title=%s&lzr=%s",$6,$7,$8,$5);browser.loadURL($d)
}}else if($4=="popupexternal"){
var $e=label.formatToString("scrollbars=yes,resizable=yes,toolbar=yes,location=yes,menubar=yes,width=%s,height=%s",$b,$c);var $f=label.formatToString("window.open('%s', '%s', '%s')",$6,$a,$e);lz.Browser.loadJS($f)
}else{
if($8==null){
$8=classroot.title
};var $d=label.formatToString("content.jsp?src=%s&tag=%s&title=%s&action=%s&lzr=%s",$6,$7,$8,$4,$5);if($4!="source"){
browser.loadURL($d)
}else{
lz.Browser.loadURL($d,$4)
}}}}},"$m121",function($0){
with(this){
var $1=this.parent;var $2=[];while($1.title){
$2.unshift($1.title);$1=$1.parent
};var $3=$2.join("|");if($3!=canvas.lastbookmark){
lz.embed.setCanvasAttribute("bookmark",$3,true)
}}},"open",function($0){
with(this){
switch(arguments.length){
case 0:
$0=null;

};classroot.changeFocus(null);if(!this.isleaf){
classroot.setAttribute("open",true)
};this.doaction()
}},"$m122",function(){
with(this){
var $0=classroot;return $0
}},"showUp",function($0){
with(this){
switch(arguments.length){
case 0:
$0=null;

};background.setAttribute("frame",classroot.open?4:1);if(this.datapath.getNodeCount()){
icon.setAttribute("frame",classroot.open?2:1)
}}},"background",void 0,"icon",void 0,"label",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
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
}],LzView,["tagname","itembutton","children",[{attrs:{$classrootdepth:1,name:"background",width:new LzAlwaysExpr("$m123","$m124"),x:new LzAlwaysExpr("$m125","$m126")},"class":$lzc$class_m135},{attrs:{$classrootdepth:1,height:11,name:"icon",resource:"icon",stretches:"both",width:11,x:new LzAlwaysExpr("$m127","$m128"),y:9},"class":$lzc$class_m136},{attrs:{$classrootdepth:1,fontsize:13,fontstyle:"bold",name:"label",text:new LzAlwaysExpr("$m133","$m134"),valign:"middle",width:new LzAlwaysExpr("$m131","$m132"),x:new LzAlwaysExpr("$m129","$m130")},"class":$lzc$class_m137}],"attributes",new LzInheritedHash(LzView.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({$delegates:["onmouseover","$m115",null,"onmouseout","$m116",null,"onmousedown","$m117",null,"onmouseup","$m118",null,"ondata","$m119",null,"onopen","doaction","$m120","onclick","$m121",null,"onopen","showUp","$m122"],clickable:true,datapath:".",isleaf:false,onopendone:LzDeclaredEvent,placement:"item"},$lzc$class_itembutton.attributes)
}}})($lzc$class_itembutton);Class.make("$lzc$class_m114",["$m108",function($0){
with(this){
this.setAttribute("level",classroot.level)
}},"$m109",function($0){
with(this){
this.setAttribute("text",classroot.title)
}},"$m110",function($0){
with(this){
var $1=classroot.width;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m111",function(){
with(this){
return [classroot,"width"]
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
}],$lzc$class_itembutton,["children",LzNode.mergeChildren([],$lzc$class_itembutton["children"]),"attributes",new LzInheritedHash($lzc$class_itembutton.attributes)]);Class.make("$lzc$class_menubutton",["$m102",function($0){
var $1=this.item.height;if($1!==this["yindent"]||!this.inited){
this.setAttribute("yindent",$1)
}},"$m103",function(){
return [this.item,"height"]
},"level",void 0,"onopendone",void 0,"$m105",function($0){
this.children.sendToBack()
},"deferOpen",void 0,"_setOpen",function($0){
with(this){
if(_initcomplete&&this.isleaf){
this.open=false;return
};if($0&&this.itemlist.subviews.length==0){
this.deferOpen=true;new (lz.navbutton)(this,{level:this.level+1})
}else{
(arguments.callee["$superclass"]&&arguments.callee.$superclass.prototype["_setOpen"]||this.nextMethod(arguments.callee,"_setOpen")).call(this,$0)
}}},"dataBound",function(){
this.dataloaded=true;if(this.deferOpen){
this.deferOpen=false;this.setAttribute("open",true)
};if(this["nextOpenList"]){
this.searchChildren()
}},"searchChildren",function(){
with(this){
var $0=this.nextOpenList;var $1=this.searchSubnodes("title",$0[0]);if($1!=null){
$1.openSequence($0)
};canvas.loadcounter--
}},"openChildren",function($0){
if(this.itemlist.subviews.length>0){
var $1=this.item.height;var $2=this.itemlist.childlayout;$2.setAttribute("hgt",$1);if($0){
$2.setAttribute("spacing",-$1);$2.setAttribute("inset",-$1);this.children.setAttribute("visible",true);$2.doOpen()
}else{
$2.doClose()
}}},"openSequence",function($0){
if($0[0]==this.title){
if(!this.open){
this.header.open()
}else{
this.header.doaction()
};if($0.length>1){
this.nextOpenList=$0.splice(1);if(this.dataloaded){
this.searchChildren()
}}}},"itemlist",void 0,"header",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
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
},"$datapath",void 0],$lzc$class_basetree,["tagname","menubutton","children",LzNode.mergeChildren([{attrs:{$classrootdepth:1,childlayout:void 0,name:"itemlist",placement:"children",width:new LzAlwaysExpr("$m106","$m107")},"class":$lzc$class_m112},{attrs:{$classrootdepth:1,level:new LzOnceExpr("$m108"),name:"header",text:new LzOnceExpr("$m109"),width:new LzAlwaysExpr("$m110","$m111")},"class":$lzc$class_m114},{attrs:"itemlist","class":$lzc$class_userClassPlacement}],$lzc$class_basetree["children"]),"attributes",new LzInheritedHash($lzc$class_basetree.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({$datapath:{attrs:{$delegates:["onclones","$m104",null],$m104:function($0){
with(this){
var $1=this.clones[this.clones.length-1];if(!this.doneDel){
this.doneDel=new LzDelegate(this,"replicationDone")
}else{
this.doneDel.unregisterAll()
};this.doneDel.register($1,"oninit")
}},doneDel:null,replicationDone:function($0){
this.parent.dataBound()
},xpath:"*"},"class":LzDatapath},$delegates:["oninit","$m105",null],closechildren:true,closesiblings:true,datapath:LzNode._ignoreAttribute,deferOpen:false,layout:{"class":"null"},onopendone:LzDeclaredEvent,xindent:0,yindent:new LzAlwaysExpr("$m102","$m103")},$lzc$class_menubutton.attributes)
}}})($lzc$class_menubutton);Class.make("$lzc$class_navbutton",["$m138",function($0){
with(this){
var $1=immediateparent.width;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m139",function(){
with(this){
return [immediateparent,"width"]
}},"$m140",function($0){
this.dataBindAttribute("title","@name","expression")
},"title",void 0,"$lzsc$initialize",function($0,$1,$2,$3){
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
}],$lzc$class_menubutton,["tagname","navbutton","children",LzNode.mergeChildren([],$lzc$class_menubutton["children"]),"attributes",new LzInheritedHash($lzc$class_menubutton.attributes)]);(function($0){
with($0)with($0.prototype){
{
LzNode.mergeAttributes({title:new LzOnceExpr("$m140"),width:new LzAlwaysExpr("$m138","$m139")},$lzc$class_navbutton.attributes)
}}})($lzc$class_navbutton);Class.make("$lzc$class_m148",["$m142",function($0){
with(this){
lz.Browser.loadURL("http://www.openlaszlo.org","_blank")
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
}],$lzc$class_basebutton,["attributes",new LzInheritedHash($lzc$class_basebutton.attributes)]);Class.make("$lzc$class_m149",["$m143",function($0){
with(this){
var $1="Version: "+canvas.version+" ("+canvas.runtime+")";if($1!==this["text"]||!this.inited){
this.setAttribute("text",$1)
}}},"$m144",function(){
with(this){
return [canvas,"version",canvas,"runtime"]
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
}],$lzc$class_defaulttext,["attributes",new LzInheritedHash($lzc$class_defaulttext.attributes)]);Class.make("$lzc$class_m150",["$m145",function($0){
with(this){
var $1="Build: "+canvas.lpsbuild;if($1!==this["text"]||!this.inited){
this.setAttribute("text",$1)
}}},"$m146",function(){
with(this){
return [canvas,"lpsbuild"]
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
}],$lzc$class_defaulttext,["attributes",new LzInheritedHash($lzc$class_defaulttext.attributes)]);Class.make("$lzc$class_m147",["$m141",function($0){
with(this){
this.setAttribute("height",canvas.height)
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
}],LzView,["children",[{attrs:{resource:"navbg",x:-15},"class":LzView},{attrs:{$delegates:["onclick","$m142",null],clickable:true,resource:"logobtn",x:2,y:6},"class":$lzc$class_m148},{attrs:{layout:{axis:"y"},x:10,y:570},children:[{attrs:{fontsize:10,resize:true,text:new LzAlwaysExpr("$m143","$m144")},"class":$lzc$class_m149},{children:[{attrs:{fontsize:10,text:new LzAlwaysExpr("$m145","$m146"),width:190},"class":$lzc$class_m150},{attrs:{axis:"x"},"class":$lzc$class_simplelayout}],"class":LzView}],"class":LzView}],"attributes",new LzInheritedHash(LzView.attributes)]);canvas.LzInstantiateView({attrs:{height:new LzOnceExpr("$m141"),width:200},"class":$lzc$class_m147},8);Class.make("$lzc$class_m154",["$m151",function($0){
with(this){
this.selectItem(canvas.runtime)
}},"$m152",function($0){
with(this){
var $1=lz.Browser.getURL();if(!$1)return;var $2=new LzURL($1);var $3="lzr="+canvas.runtime;if($2.query&&$2.query.indexOf($3)>-1){
$2.query=$2.query.replace($3,"lzr="+$0)
}else if($2.file&&$2.file.indexOf(".html")>-1){
$2.file=$2.file.replace(".html",".html?lzr="+$0)
}else{
$2.file="index.html?lzr="+$0
};if($2.fragment){
$2.fragment=unescape($2.fragment)
};var $4=$2.toString();Debug.warn($4,$1,$2);if($4!=$1){
lz.Browser.loadURL($4)
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
}],$lzc$class_radiogroup,["children",[{attrs:{text:"dhtml"},"class":$lzc$class_radiobutton},{attrs:{text:"swf8"},"class":$lzc$class_radiobutton},{attrs:{text:"swf10"},"class":$lzc$class_radiobutton}],"attributes",new LzInheritedHash($lzc$class_radiogroup.attributes)]);Class.make("$lzc$class_m155",["dataBound",function($0){
with(this){
switch(arguments.length){
case 0:
$0=null;

};var $1=canvas.bookmark;if(!$1)return;if($1.length>0){
var $2=this.searchSubnodes("title",$1[0]);if($2!=null){
if(canvas.loadcounter==0){
canvas.loadcounter=$1.length-1;$2.openSequence($1)
}}}}},"$m153",function(){
with(this){
var $0=canvas;return $0
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
}],$lzc$class_basetree,["children",LzNode.mergeChildren([{attrs:{level:0,width:160},"class":$lzc$class_navbutton}],$lzc$class_basetree["children"]),"attributes",new LzInheritedHash($lzc$class_basetree.attributes)]);canvas.LzInstantiateView({attrs:{$lzc$bind_name:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
treecontainer=$0
}else if(treecontainer===$0){
treecontainer=null
}},menu:void 0,name:"treecontainer",width:200,y:42},children:[{"class":$lzc$class_simplelayout},{attrs:{$delegates:["oninit","$m151",null,"onvalue","$m152",null],layout:{axis:"x"}},"class":$lzc$class_m154},{attrs:{$delegates:["onbookmark","dataBound","$m153"],datapath:"navdata:/menu",layout:{spacing:-6},name:"menu",showroot:false,x:2,y:2},"class":$lzc$class_m155}],"class":LzView},26);Class.make("$lzc$class_m161",["$m156",function($0){
with(this){
var $1=canvas.width-this.x;if($1!==this["width"]||!this.inited){
this.setAttribute("width",$1)
}}},"$m157",function(){
with(this){
return [canvas,"width",this,"x"]
}},"$m158",function($0){
with(this){
var $1=immediateparent.height;if($1!==this["height"]||!this.inited){
this.setAttribute("height",$1)
}}},"$m159",function(){
with(this){
return [immediateparent,"height"]
}},"$m160",function($0){
switch(arguments.length){
case 0:
$0=null;

};this.bringToFront()
},"loadURL",function($0){
this.url=$0;$0=$0.toString();if($0!==this.src){
this.setAttribute("src",$0)
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
}],$lzc$class_html,["attributes",new LzInheritedHash($lzc$class_html.attributes)]);canvas.LzInstantiateView({attrs:{$delegates:["oninit","$m160",null],$lzc$bind_id:function($0,$1){
switch(arguments.length){
case 1:
$1=true;

};if($1){
$0.id="browser";browser=$0
}else if(browser===$0){
browser=null;$0.id=null
}},height:new LzAlwaysExpr("$m158","$m159"),history:false,id:"browser",src:"coverpages/welcome/",width:new LzAlwaysExpr("$m156","$m157"),x:200},"class":$lzc$class_m161},1);lz["basefocusview"]=$lzc$class_basefocusview;lz["focusoverlay"]=$lzc$class_focusoverlay;lz["_componentmanager"]=$lzc$class__componentmanager;lz["style"]=$lzc$class_style;lz["statictext"]=$lzc$class_statictext;lz["basecomponent"]=$lzc$class_basecomponent;lz["basebutton"]=$lzc$class_basebutton;lz["treeselector"]=$lzc$class_treeselector;lz["simplelayout"]=$lzc$class_simplelayout;lz["basetree"]=$lzc$class_basetree;lz["html"]=$lzc$class_html;lz["basevaluecomponent"]=$lzc$class_basevaluecomponent;lz["baseformitem"]=$lzc$class_baseformitem;lz["listselector"]=$lzc$class_listselector;lz["datalistselector"]=$lzc$class_datalistselector;lz["baselist"]=$lzc$class_baselist;lz["baselistitem"]=$lzc$class_baselistitem;lz["multistatebutton"]=$lzc$class_multistatebutton;lz["radiogroup"]=$lzc$class_radiogroup;lz["radiobutton"]=$lzc$class_radiobutton;lz["openanimator"]=$lzc$class_openanimator;lz["closeanimator"]=$lzc$class_closeanimator;lz["defaulttext"]=$lzc$class_defaulttext;lz["itembutton"]=$lzc$class_itembutton;lz["menubutton"]=$lzc$class_menubutton;lz["navbutton"]=$lzc$class_navbutton;canvas.initDone();