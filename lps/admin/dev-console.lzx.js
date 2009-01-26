var $dhtml=true;var $as3=false;var $js1=true;var $swf7=false;var $swf8=false;var $svg=false;var $as2=false;var $swf9=false;var $profile=false;var $runtime="dhtml";var $swf10=false;var $debug=false;var $j2me=false;var _Copyright="Portions of this file are copyright (c) 2001-2008 by Laszlo Systems, Inc.  All rights reserved.";var $modules={};$modules.runtime=this;$modules.lz=$modules.runtime;$modules.user=$modules.lz;var global=$modules.user;var __ES3Globals={Array:Array,Boolean:Boolean,Date:Date,Function:Function,Math:Math,Number:Number,Object:Object,RegExp:RegExp,String:String,Error:Error,EvalError:EvalError,RangeError:RangeError,ReferenceError:ReferenceError,SyntaxError:SyntaxError,TypeError:TypeError,URIError:URIError};var globalValue=function($1){
if($1=="lz"){
return lz
};if($1.charAt(0)=="<"&&$1.charAt($1.length-1)==">"){
return lz[$1.substring(1,$1.length-1)]
};return this[$1]||global[$1]||__ES3Globals[$1]
};var Instance=function(){
this.constructor=arguments.callee;this.$lzsc$initialize.apply(this,arguments)
};Instance.prototype.constructor=Instance;Instance.prototype.__initialized=false;Instance.classname="Instance";Instance.prototype.classname="Object";(function(){
var $1=function($1,$2){
if($2!==void 0||!($1 in this)){
this[$1]=$2
};if($2 instanceof Function){
var $3=this.constructor;if($2.hasOwnProperty("superclasses")){
var $4=$2.superclasses,$5=false;for(var $6=$4.length-1;$6>=0;$6--){
if($4[$6]===$3){
$5=true;break
}};if(!$5){
$2.superclasses.push($3)
}}else{
if($2.hasOwnProperty("superclass")&&$2.superclass!==$3){
var $7=$2.superclass;delete $2.superclass;$2.superclasses=[$7,$3]
}else{
$2.superclass=$3
}}}};$1.call(Instance.prototype,"addProperty",$1)
})();Instance.prototype.addProperty("nextMethod",function($1,$2){
var $3;if($1.hasOwnProperty("superclass")){
$3=$1.superclass.prototype[$2]
}else{
var $4=$1.superclasses;for(var $5=$4.length-1;$5>=0;$5--){
if(this instanceof $4[$5]){
$3=$4[$5].prototype[$2];break
}}};return $3
});Instance.prototype.addProperty("$lzsc$initialize",function(){

});Instance.initialize=function($1){
$1.__initialized=false
};var Class={prototype:new Instance(),addProperty:function($1,$2){
var $3=this.prototype;$3.addProperty.apply($3,arguments)
},addStaticProperty:function($1,$2){
this[$1]=$2
},_dbg_name:"Class",allClasses:{Instance:Instance},make:function($1,$2,$3,$4){
var superclass=null;if($2 instanceof Array){
for(var $9=$2.length-1;$9>=0;$9--){
var $10=$2[$9];if($10 instanceof Function){
$2.splice($9,1);superclass=$10
}}}else{
if($2 instanceof Function){
superclass=$2;$2=null
}else{

}};if(!superclass){
superclass=Instance
};var nc=function(){
this.constructor=arguments.callee;if(this.$lzsc$initialize!==Instance.prototype.$lzsc$initialize){
this.$lzsc$initialize.apply(this,arguments)
}};nc.constructor=this;nc.classname=$1;var $11=function(){
this.constructor=superclass
};$11.prototype=superclass.prototype;var $12=new $11();if($2 instanceof Array){
for(var $6=$2.length-1;$6>=0;$6--){
var $13=$2[$6];$12=$13.makeInterstitial($12,$6>0?$2[$6-1]:nc)
}};nc.prototype=$12;this.addStaticProperty.call(nc,"addStaticProperty",this.addStaticProperty);nc.addStaticProperty("addProperty",this.addProperty);if($4){
for(var $6=$4.length-1;$6>=1;$6-=2){
var $7=$4[$6];var $8=$4[$6-1];nc.addStaticProperty($8,$7)
}};if($3){
for(var $6=$3.length-1;$6>=1;$6-=2){
var $7=$3[$6];var $8=$3[$6-1];nc.addProperty($8,$7)
}};(function($1,$2){
if($2!==Instance){
arguments.callee($1,$2.prototype.constructor)
};if($2.hasOwnProperty("initialize")){
$2.initialize.call(nc,$1)
}})($12,nc);global[$1]=this.allClasses[$1]=nc;return nc
}};var Mixin={prototype:new Instance(),allMixins:{},_dbg_typename:Class._dbg_name,_dbg_name:"Mixin",addProperty:function($1,$2){
this.prototype[$1]=$2;this.instanceProperties.push($1,$2);var $3=this.implementations;for(var $4 in $3){
var $5=$3[$4];$5.addProperty.apply($5,arguments)
}},addStaticProperty:function($1,$2){
this[$1]=$2
},makeInterstitial:function($1,$2){
var $3=this.implementations;var $4=this.classname+"+"+$1.constructor.classname;var $5=$2.classname+"|"+$4;if($3[$5]){
return $3[$5]
};var $6=this.instanceProperties;for(var $7=$6.length-1;$7>=1;$7-=2){
var $8=$6[$7];var $9=$6[$7-1];$1.addProperty.call($1,$9,$8)
};var $10=function(){
this.constructor=arguments.callee
};$10.prototype=$1;if(this.hasOwnProperty("initialize")){
$10.initialize=this.initialize
};$10.classname=$4;var $11=new $10();$3[$5]=$11;return $11
},$lzsc$isa:function($1){
var $2=this.implementations;for(var $3 in $2){
if($1 instanceof $2[$3].constructor){
return true
}};return false
},make:function($1,$2,$3,$4){
var $5={constructor:this,classname:$1,_dbg_typename:this._dbg_name,_dbg_name:$1,prototype:$2?$2.make():new Object(),instanceProperties:$2?$2.instanceProperties.slice(0):new Array(),implementations:{}};this.addStaticProperty.call($5,"addStaticProperty",this.addStaticProperty);$5.addStaticProperty("addProperty",this.addProperty);$5.addStaticProperty("makeInterstitial",this.makeInterstitial);$5.addStaticProperty("$lzsc$isa",this.$lzsc$isa);if($4){
for(var $6=$4.length-1;$6>=1;$6-=2){
var $7=$4[$6];var $8=$4[$6-1];$5.addStaticProperty($8,$7)
}};if($3){
for(var $6=$3.length-1;$6>=1;$6-=2){
var $7=$3[$6];var $8=$3[$6-1];$5.addProperty($8,$7)
}};if($5.hasOwnProperty("initialize")){
$5.initialize($5.prototype)
};global[$1]=this.allMixins[$1]=$5;return $5
}};Class.make("LzBootstrapMessage",null,["message","","length",0,"$lzsc$initialize",function($1){
switch(arguments.length){
case 0:
$1=null;

};if($1!=null){
this.appendInternal(""+$1,$1)
}},"appendInternal",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};this.message+=$1;this.length=this.message.length
},"append",function(){
var $1=Array.prototype.slice.call(arguments,0);var $2=$1.length;for(var $3=0;$3<$2;$3++){
this.appendInternal(String($1[$3]))
}},"charAt",function($1){
return this.message.charAt($1)
},"charCodeAt",function($1){
return this.message.charCodeAt($1)
},"indexOf",function($1){
return this.message.indexOf($1)
},"lastIndexOf",function($1){
return this.message.lastIndexOf($1)
},"toLowerCase",function(){
return new LzMessage(this.message.toLowerCase())
},"toUpperCase",function(){
return new LzMessage(this.message.toUpperCase())
},"toString",function(){
return this.message||""
},"valueOf",function(){
return this.message||""
},"concat",function(){
var $1=Array.prototype.slice.call(arguments,0);return new LzMessage(this.message.concat.apply(this.message,$1))
},"slice",function(){
var $1=Array.prototype.slice.call(arguments,0);return this.message.slice.apply(this.message,$1)
},"split",function(){
var $1=Array.prototype.slice.call(arguments,0);return this.message.split.apply(this.message,$1)
},"substr",function(){
var $1=Array.prototype.slice.call(arguments,0);return this.message.substr.apply(this.message,$1)
},"substring",function(){
var $1=Array.prototype.slice.call(arguments,0);return this.message.substring.apply(this.message,$1)
},"toHTML",function(){
return this["toString"]().toHTML()
}],["xmlEscapeChars",{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"},"xmlEscape",function($1){
if($1&&(typeof $1=="string"||(String["$lzsc$isa"]?String.$lzsc$isa($1):$1 instanceof String))){
var $2=LzBootstrapMessage.xmlEscapeChars;var $3=$1.length;var $4="";for(var $5=0;$5<$3;$5++){
var $6=$1.charCodeAt($5);if($6<32){
$4+="&#x"+$6.toString(16)+";"
}else{
var $7=$1.charAt($5);$4+=$2[$7]||$7
}};return $4
}else{
return $1
}}]);(function($1){
with($1){
with($1.prototype){

}}})(LzBootstrapMessage);var LzMessage=LzBootstrapMessage;String.prototype.toHTML=function(){
return LzMessage.xmlEscape(this)
};Mixin.make("LzFormatter",null,["pad",function($1,$2,$3,$4,$5,$6,$7){
switch(arguments.length){
case 0:
$1="";
case 1:
$2=0;
case 2:
$3=null;
case 3:
$4=" ";
case 4:
$5="-";
case 5:
$6=10;
case 6:
$7=false;

};var $8=typeof $1=="number";if($8){
if($3!=null){
var $9=Math.pow(10,-$3);$1=Math.round($1/$9)*$9
};$1=Number($1).toString($6);if($5!="-"){
if($1.indexOf("-")!=0){
if($1!=0){
$1=$5+$1
}else{
$1=" "+$1
}}}}else{
$1=""+$1
};var $10=$1.length;if($3!=null){
if($8){
var $11=$1.lastIndexOf(".");if($11==-1){
var $12=0;if($7||$3>0){
$1+="."
}}else{
var $12=$10-($11+1)
};if($12>$3){
$1=$1.substring(0,$10-($12-$3))
}else{
for(var $13=$12;$13<$3;$13++){
$1+="0"
}}}else{
$1=$1.substring(0,$3)
}};$10=$1.length;var $14=false;if($2<0){
$2=-$2;$14=true
};if($10>=$2){
return $1
};if($14){
for(var $13=$10;$13<$2;$13++){
$1=$1+" "
}}else{
$5=null;if($4!=" "){
if(" +-".indexOf($1.substring(0,1))>=0){
$5=$1.substring(0,1);$1=$1.substring(1)
}};for(var $13=$10;$13<$2;$13++){
$1=$4+$1
};if($5!=null){
$1=$5+$1
}};return $1
},"formatToString",function(control){
var $8;$8=function($1){
if($1>=al){
return null
};return args[$1]
};switch(arguments.length){
case 0:
control="";

};var args=Array.prototype.slice.call(arguments,1);var al=args.length;if(!(typeof control=="string"||(String["$lzsc$isa"]?String.$lzsc$isa(control):control instanceof String))||al>0!=control.indexOf("%")>=0){
args=[control].concat(args);al++;var $1=new LzMessage();for(var $2=0;$2<al;$2++){
var $3=args[$2];var $4=$2==al-1?"\n":" ";$1.append($3);$1.appendInternal($4)
};return $1
};var $5=""+control;var $6=0;var $7=0;var $9=0,$10=$5.length;var $11=0,$12=0;var $1=new LzMessage();while($11<$10){
$12=$5.indexOf("%");if($12==-1){
$1.append($5.substring($11,$10));break
};$1.append($5.substring($11,$12));$9=$12;$11=$12+1;$12=$12+2;var $13="-";var $14=" ";var $15=false;var $16="";var $17=null;var $18=null;var $19=null;while($11<$10&&$18==null){
var $20=$5.substring($11,$12);$11=$12++;switch($20){
case "-":
$16=$20;break;
case "+":
case " ":
$13=$20;break;
case "#":
$15=true;break;
case "0":
if($16===""&&$17===null){
$14=$20;break
};
case "1":
case "2":
case "3":
case "4":
case "5":
case "6":
case "7":
case "8":
case "9":
if($17!==null){
$17+=$20
}else{
$16+=$20
};break;
case "$":
$6=$16-1;$16="";break;
case "*":
if($17!==null){
$17=$8($6);$6++
}else{
$16=$8($6);$6++
};break;
case ".":
$17="";break;
case "h":
case "l":
break;
case "=":
$19=$8($6);$6++;break;
default:
$18=$20;break;

}};var $21=$8($6);if($19==null){
$19=$21
};var $22=null;var $23=false;if($17!==null){
$22=1*$17
}else{
switch($18){
case "F":
case "E":
case "G":
case "f":
case "e":
case "g":
$22=6;$23=$15;break;
case "O":
case "o":
if($15&&$21!=0){
$1.append("0")
};break;
case "X":
case "x":
if($15&&$21!=0){
$1.append("0"+$18)
};break;

}};var $24=10;switch($18){
case "o":
case "O":
$24=8;break;
case "x":
case "X":
$24=16;break;

};switch($18){
case "U":
case "O":
case "X":
case "u":
case "o":
case "x":
if($21<0){
$21=-$21;var $25=Math.abs(parseInt($16));if(isNaN($25)){
$25=Number($21).toString($24).length
};var $26=Math.pow($24,$25);$21=$26-$21
};break;

};switch($18){
case "D":
case "U":
case "I":
case "O":
case "X":
case "F":
case "E":
case "G":
$21=Number($21);$1.appendInternal(this.pad($21,$16,$22,$14,$13,$24,$23).toUpperCase(),$19);$6++;break;
case "c":
$21=String.fromCharCode($21);
case "w":

case "s":
var $28;if(Function["$lzsc$isa"]?Function.$lzsc$isa($21):$21 instanceof Function){
if(!$28){
$28="function () {\u2026}"
}}else{
if(typeof $21=="number"){
$28=Number($21).toString($24)
}else{
$28=""+$21
}};$1.appendInternal(this.pad($28,$16,$22,$14,$13,$24,$23),$19);$6++;break;
case "d":
case "u":
case "i":
case "o":
case "x":
case "f":
case "e":
case "g":
$21=Number($21);$1.appendInternal(this.pad($21,$16,$22,$14,$13,$24,$23),$19);$6++;break;
case "%":
$1.append("%");break;
default:
$1.append($5.substring($9,$11));break;

};$5=$5.substring($11,$10);$9=0,$10=$5.length;$11=0,$12=0;if($6>$7){
$7=$6
}};if($7<al){
$1.appendInternal(" ");for(;$7<al;$7++){
var $3=$8($7);var $4=$7==al-1?"\n":" ";$1.append($3);$1.appendInternal($4)
}};return $1
}],null);Debug={};Debug.write=function($1){

};Debug.trace=function($1){

};Debug.monitor=function($1){

};Debug.warn=function($1){

};Debug.error=function($1){

};Debug.info=function($1){

};Debug.debug=function($1){

};trace=function(){
console.info.apply(console,arguments)
};Class.make("LzDeclaredEventClass",null,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"ready",false,"sendEvent",function($1){
switch(arguments.length){
case 0:
$1=null;

}},"clearDelegates",function(){

},"removeDelegate",function($1){
switch(arguments.length){
case 0:
$1=null;

}},"getDelegateCount",function(){
return 0
},"toString",function(){
return "LzDeclaredEvent"
}],null);(function($1){
with($1){
with($1.prototype){

}}})(LzDeclaredEventClass);var LzDeclaredEvent=new LzDeclaredEventClass();Class.make("LzValueExpr",null,null,null);Class.make("LzInitExpr",LzValueExpr,null,null);Class.make("LzOnceExpr",LzInitExpr,["methodName",void 0,"$lzsc$initialize",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};this.methodName=$1
}],null);Class.make("LzConstraintExpr",LzOnceExpr,["$lzsc$initialize",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2)
}],null);Class.make("LzAlwaysExpr",LzConstraintExpr,["dependenciesName",void 0,"$lzsc$initialize",function($1,$2,$3){
switch(arguments.length){
case 2:
$3=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$3);this.dependenciesName=$2
}],null);Class.make("LzStyleExpr",LzValueExpr,["$lzsc$initialize",function(){

}],null);Class.make("LzStyleAttr",LzStyleExpr,["sourceAttributeName",void 0,"$lzsc$initialize",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.sourceAttributeName=$1
}],null);Class.make("LzStyleIdent",LzStyleExpr,["sourceValueID",void 0,"$lzsc$initialize",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.sourceValueID=$1
}],null);function LzInheritedHash($1){
if($1){
for(var $2 in $1){
this[$2]=$1[$2]
}}};var lz;(function(){
if(Object["$lzsc$isa"]?Object.$lzsc$isa(lz):lz instanceof Object){

}else{
if(!lz){
lz=new LzInheritedHash()
}else{

}}})();lz.DeclaredEventClass=LzDeclaredEventClass;lz.Formatter=LzFormatter;lz.colors={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};Class.make("LzCache",null,["size",void 0,"slots",void 0,"destroyable",void 0,"capacity",void 0,"curslot",void 0,"data",null,"$lzsc$initialize",function($1,$2,$3){
switch(arguments.length){
case 0:
$1=16;
case 1:
$2=2;
case 2:
$3=true;

};this.size=$1;this.slots=$2;this.destroyable=$3;this.clear()
},"clear",function(){
this.curslot=0;this.capacity=0;var $1=this.slots;if(!this.data){
this.data=new Array($1)
};var $2=this.data;for(var $3=0;$3<$1;++$3){
if(this.destroyable){
var $4=$2[$3];for(var $5 in $4){
$4[$5].destroy()
}};$2[$3]={}}},"ensureSlot",function(){
if(++this.capacity>this.size){
var $1=(this.curslot+1)%this.slots;var $2=this.data;if(this.destroyable){
var $3=$2[$1];for(var $4 in $3){
$3[$4].destroy()
}};$2[$1]={};this.curslot=$1;this.capacity=1
}},"put",function($1,$2){
var $3=this.get($1);if($3===void 0){
this.ensureSlot()
};this.data[this.curslot][$1]=$2;return $3
},"get",function($1){
var $2=this.slots;var $3=this.curslot;var $4=this.data;for(var $5=0;$5<$2;++$5){
var $6=($3+$5)%$2;var $7=$4[$6][$1];if($7!==void 0){
if($6!=$3){
delete $4[$6][$1];this.ensureSlot();$4[this.curslot][$1]=$7
};return $7
}};return void 0
}],null);Class.make("LzEventable",null,["$lzsc$initialize",function(){

},"__LZdeleted",false,"_events",null,"ondestroy",LzDeclaredEvent,"destroy",function(){
if(this.ondestroy.ready){
this.ondestroy.sendEvent(this)
};this.__LZdeleted=true;this.__LZdelegatesQueue=null;this.__LZdeferDelegates=false;if(this._events!=null){
for(var $1=this._events.length-1;$1>=0;$1--){
this._events[$1].clearDelegates()
}};this._events=null
},"__LZdeferDelegates",false,"__LZdelegatesQueue",null,"childOf",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};return false
},"setAttribute",function($1,$2,$3){
switch(arguments.length){
case 2:
$3=null;

};if(this.__LZdeleted){
return
};var $4="$lzc$set_"+$1;if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$4]):this[$4] instanceof Function){
this[$4]($2)
}else{
this[$1]=$2;var $5=this["on"+$1];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($5):$5 instanceof LzEvent){
if($5.ready){
$5.sendEvent($2)
}}}}],null);lz.Eventable=LzEventable;Class.make("LzStyleAttrBinder",LzEventable,["target",void 0,"dest",void 0,"source",void 0,"$lzsc$initialize",function($1,$2,$3){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.target=$1;this.dest=$2;this.source=$3
},"bind",function($1){
switch(arguments.length){
case 0:
$1=null;

};var $2=this.target;var $lzsc$2034361925=this.dest;var $lzsc$1558067844=$2[this.source];if(!$2.__LZdeleted){
var $lzsc$996995866="$lzc$set_"+$lzsc$2034361925;if(Function["$lzsc$isa"]?Function.$lzsc$isa($2[$lzsc$996995866]):$2[$lzsc$996995866] instanceof Function){
$2[$lzsc$996995866]($lzsc$1558067844)
}else{
$2[$lzsc$2034361925]=$lzsc$1558067844;var $lzsc$1131193788=$2["on"+$lzsc$2034361925];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$1131193788):$lzsc$1131193788 instanceof LzEvent){
if($lzsc$1131193788.ready){
$lzsc$1131193788.sendEvent($lzsc$1558067844)
}}}}}],null);Class.make("PresentationType",null,null,["accept",function($1){
return $1
},"present",function($1){
return String($1)
}]);Class.make("DefaultPresentationType",PresentationType,null,["accept",PresentationType.accept,"present",function($1){
return $1
}]);Class.make("StringPresentationType",PresentationType,null,["accept",function($1){
return String($1)
},"present",PresentationType.present]);Class.make("BooleanPresentationType",PresentationType,null,["accept",function($1){
switch($1.toLowerCase()){
case "":
case "0":
case "false":
return false;
default:
return true;

}},"present",PresentationType.present]);Class.make("NumberPresentationType",PresentationType,null,["accept",function($1){
return Number($1)
},"present",PresentationType.present]);Class.make("ColorPresentationType",PresentationType,null,["accept",function($1){
return LzColorUtils.hextoint($1)
},"present",function($1){
var $2=lz.colors;for(var $3 in $2){
if($2[$3]===$1){
return $3
}};return LzColorUtils.inttohex($1)
}]);Class.make("ExpressionPresentationType",PresentationType,null,["accept",function($1){
switch($1){
case "undefined":
return void 0;
case "null":
return null;
case "false":
return false;
case "true":
return true;
case "NaN":
return 0/0;
case "":
return "";

};if(!isNaN($1)){
return Number($1)
};return String($1)
},"present",PresentationType.present]);Class.make("SizePresentationType",PresentationType,null,["accept",function($1){
if($1=="null"){
return null
};return Number($1)
},"present",PresentationType.present]);Class.make("LzNode",LzEventable,["__LZisnew",false,"__LZdeferredcarr",null,"classChildren",null,"animators",null,"_instanceAttrs",null,"_instanceChildren",null,"__LzValueExprs",null,"__LZhasConstraint",function($1){
return $1 in this.__LzValueExprs
},"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.__LZUID="__U"+ ++LzNode.__UIDs;this.__LZdeferDelegates=true;if($2){
if($2["$lzc$bind_id"]){
this.$lzc$bind_id=$2.$lzc$bind_id;delete $2.$lzc$bind_id
};if($2["$lzc$bind_name"]){
this.$lzc$bind_name=$2.$lzc$bind_name;delete $2.$lzc$bind_name
}};var $5=this.$lzc$bind_id;if($5){
$5.call(null,this)
};var $6=this.$lzc$bind_name;if($6){
$6.call(null,this)
};this._instanceAttrs=$2;this._instanceChildren=$3;var $8=new LzInheritedHash(this["constructor"].attributes);if(!(function($1,$2){
return $2["$lzsc$isa"]?$2.$lzsc$isa($1):$1 instanceof $2
})(this,LzState)){
for(var $9 in $8){
var $10=$8[$9];if(!(LzInitExpr["$lzsc$isa"]?LzInitExpr.$lzsc$isa($10):$10 instanceof LzInitExpr)){
var $11="$lzc$set_"+$9;if(!this[$11]){
this.addProperty($9,$10);delete $8[$9]
}else{
if(this[$9]===void 0){
this.addProperty($9,null)
}}}}};if($2){
LzNode.mergeAttributes($2,$8)
};this.__LZisnew=!$4;var $12=this["constructor"]["children"];if(Array["$lzsc$isa"]?Array.$lzsc$isa($12):$12 instanceof Array){
$3=LzNode.mergeChildren($3,$12)
};if($8["datapath"]!=null){
delete $8["$datapath"]
};var $13=this.__LzValueExprs={};for(var $9 in $8){
var $10=$8[$9];if(LzValueExpr["$lzsc$isa"]?LzValueExpr.$lzsc$isa($10):$10 instanceof LzValueExpr){
$13[$9]=$10;delete $8[$9]
}};this.construct($1,$8);if(this.__LZdeleted){
return
};for(var $9 in $13){
$8[$9]=$13[$9]
};this.__LzValueExprs=null;this.__LZapplyArgs($8,true);if(this.__LZdeleted){
return
};this.constructWithArgs($8);this.__LZdeferDelegates=false;var $14=this.__LZdelegatesQueue;if($14){
LzDelegate.__LZdrainDelegatesQueue($14);this.__LZdelegatesQueue=null
};if(this.onconstruct.ready){
this.onconstruct.sendEvent(this)
};if($3&&$3.length){
this.createChildren($3)
}else{
this.__LZinstantiationDone()
}},"constructWithArgs",function($1){

},"oninit",LzDeclaredEvent,"onconstruct",LzDeclaredEvent,"ondata",LzDeclaredEvent,"clonenumber",null,"onclonenumber",LzDeclaredEvent,"__LZlateinit",null,"__LZpreventSubInit",null,"__LZresolveDict",null,"__LZsourceLocation",null,"__LZUID",null,"__LZPropertyCache",null,"__LZRuleCache",null,"__LZdelegates",null,"isinited",false,"inited",false,"oninited",LzDeclaredEvent,"subnodes",null,"datapath",null,"$lzc$set_datapath",function($1){
if(null!=this.datapath&&$1!=LzNode._ignoreAttribute){
this.datapath.setXPath($1)
}else{
new LzDatapath(this,{xpath:$1})
}},"initstage",null,"$isstate",false,"doneClassRoot",false,"parent",void 0,"cloneManager",null,"name",null,"$lzc$bind_name",null,"id",null,"$lzc$set_id",-1,"$lzc$bind_id",null,"defaultplacement",null,"placement",null,"$lzc$set_placement",-1,"$cfn",0,"immediateparent",null,"dependencies",null,"classroot",void 0,"nodeLevel",0,"__LZstyleBindAttribute",function($1,$2,$3){
var $4=this["__LZPropertyCache"]||LzCSSStyle.getPropertyCache(this);var $6=$4[$2];if(typeof $6=="string"&&$6.length>2&&$6.indexOf("0x")==0&&!isNaN($6)){
$6=Number($6)
};if(LzStyleExpr["$lzsc$isa"]?LzStyleExpr.$lzsc$isa($6):$6 instanceof LzStyleExpr){
if(LzStyleAttr["$lzsc$isa"]?LzStyleAttr.$lzsc$isa($6):$6 instanceof LzStyleAttr){
var $7=$6;var $8=$7.sourceAttributeName;var $9=new LzStyleAttrBinder(this,$1,$8);if(!this.__LZdelegates){
this.__LZdelegates=[]
};this.__LZdelegates.push(new LzDelegate($9,"bind",this,"on"+$8));$9.bind()
}else{
if(LzStyleIdent["$lzsc$isa"]?LzStyleIdent.$lzsc$isa($6):$6 instanceof LzStyleIdent){
var $10=$6;this.acceptAttribute($1,$3,$10.sourceValueID)
}else{

}}}else{
if(!this.__LZdeleted){
var $lzsc$648223733="$lzc$set_"+$1;if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$lzsc$648223733]):this[$lzsc$648223733] instanceof Function){
this[$lzsc$648223733]($6)
}else{
this[$1]=$6;var $lzsc$1569458591=this["on"+$1];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$1569458591):$lzsc$1569458591 instanceof LzEvent){
if($lzsc$1569458591.ready){
$lzsc$1569458591.sendEvent($6)
}}}}}},"construct",function($1,$2){
this.__LZdelayedSetters=LzNode.__LZdelayedSetters;this.earlySetters=LzNode.earlySetters;var $3=$1;this.parent=$3;if($3){
var $4=$3;if($2["ignoreplacement"]||this.ignoreplacement){
this.placement=null
}else{
var $5=$2["placement"]||$3.defaultplacement;while($5!=null){
if($4.determinePlacement==LzNode.prototype.determinePlacement){
var $6=$4.searchSubnodes("name",$5);if($6==null){
$6=$4
}}else{
var $6=$4.determinePlacement(this,$5,$2)
};$5=$6!=$4?$6.defaultplacement:null;$4=$6
};this.placement=$5
};var $7=$4.subnodes;if($7==null){
$7=new Array();$4.subnodes=$7
};$7[$7.length]=this;var $8=$4.nodeLevel;this.nodeLevel=$8?$8+1:1;this.immediateparent=$4
}else{
this.nodeLevel=1
}},"init",function(){
return
},"__LZinstantiationDone",function(){
if(!this.__LZdeleted&&(!this.immediateparent||this.immediateparent.isinited||this.initstage=="early"||this.__LZisnew&&lz.Instantiator.syncNew)){
this.__LZcallInit()
}},"__LZsetPreventInit",function(){
this.__LZpreventSubInit=[]
},"__LZclearPreventInit",function(){
var $1=this.__LZpreventSubInit;this.__LZpreventSubInit=null;var $2=$1.length;for(var $3=0;$3<$2;$3++){
$1[$3].__LZcallInit()
}},"__LZcallInit",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(this.parent&&this.parent.__LZpreventSubInit){
this.parent.__LZpreventSubInit.push(this);return
};this.isinited=true;this.__LZresolveReferences();var $2=this.subnodes;if($2){
var $3=0;var $4=$2.length;while($3<$4){
var $5=$2[$3++];var $6=$2[$3];if($5.isinited||$5.__LZlateinit){
continue
};$5.__LZcallInit();if($6!=$2[$3]){
while($3>0){
if($6==$2[--$3]){
break
}}}}};this.init();if(this.oninit.ready){
this.oninit.sendEvent(this)
};if(this.datapath&&this.datapath.__LZApplyDataOnInit){
this.datapath.__LZApplyDataOnInit()
};this.inited=true;if(this.oninited.ready){
this.oninited.sendEvent(true)
}},"completeInstantiation",function(){
if(!this.isinited){
var $1=this.initstage;this.initstage="early";if($1=="defer"){
lz.Instantiator.createImmediate(this,this.__LZdeferredcarr)
}else{
lz.Instantiator.completeTrickle(this)
}}},"ignoreplacement",false,"__LZapplyArgs",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};var $3={};var $4=null;var $5=null;var $6=null;var $7=null;for(var $8 in $1){
var $9=$1[$8];var $10="$lzc$set_"+$8;if($3[$8]||$1[$8]===LzNode._ignoreAttribute){
continue
};$3[$8]=true;if(LzInitExpr["$lzsc$isa"]?LzInitExpr.$lzsc$isa($9):$9 instanceof LzInitExpr){
if($9 instanceof LzConstraintExpr){
if($7==null){
$7=[]
};$7.push($9)
}else{
if($9 instanceof LzOnceExpr){
if($6==null){
$6=[]
};$6.push($9)
}else{

}};if(this[$8]===void 0){
this[$8]=null
}}else{
if(!this[$10]){
this.addProperty($8,$9);if(!$2){
var $11="on"+$8;if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa(this[$11]):this[$11] instanceof LzEvent){
if(this[$11].ready){
this[$11].sendEvent($1[$8])
}}}}else{
if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$10]):this[$10] instanceof Function){
if($8 in this.earlySetters){
if($5==null){
$5=[]
};$5[this.earlySetters[$8]]=$8
}else{
if($4==null){
$4=[]
};$4.push($8)
}}}}};if($5){
for(var $12=1,$13=$5.length;$12<$13;$12++){
if($12 in $5){
if(this.__LZdeleted){
return
};var $8=$5[$12];var $10="$lzc$set_"+$8;this[$10]($1[$8])
}}};if($4){
for(var $12=$4.length-1;$12>=0;$12--){
if(this.__LZdeleted){
return
};var $8=$4[$12];var $10="$lzc$set_"+$8;this[$10]($1[$8])
}};this.__LZstoreAttr($6,"$inits");this.__LZstoreAttr($7,"$constraints")
},"createChildren",function($1){
if(this.__LZdeleted){
return
};if("defer"==this.initstage){
this.__LZlateinit=true;this.__LZdeferredcarr=$1
}else{
if("late"==this.initstage){
this.__LZlateinit=true;lz.Instantiator.trickleInstantiate(this,$1)
}else{
if(this.__LZisnew&&lz.Instantiator.syncNew||"immediate"==this.initstage){
lz.Instantiator.createImmediate(this,$1)
}else{
lz.Instantiator.requestInstantiation(this,$1)
}}}},"getAttribute",function($1){
return this[$1]
},"getExpectedAttribute",function($1){
var $2="e_"+$1;if(!this[$2]){
this[$2]={}};if(this[$2].v==null){
return this[$1]
};return this[$2].v
},"setExpectedAttribute",function($1,$2){
var $3="e_"+$1;if(!this[$3]){
this[$3]={}};this[$3].v=$2
},"addToExpectedAttribute",function($1,$2){
var $3="e_"+$1;if(!this[$3]){
this[$3]={}};if(this[$3].v==null){
this[$3].v=this[$1]
};this[$3].v+=$2
},"__LZincrementCounter",function($1){
var $2="e_"+$1;var $3=this[$2];if(!$3){
$3=this[$2]={}};if(!$3.c){
$3.c=0
};$3.c+=1
},"makeChild",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if(this.__LZdeleted){
return
};var $4=$1["class"];if(!$4){
if($1["tag"]){
$4=lz[$1.tag]
};if(!$4&&$1["name"]){
$4=lz[$1.name]
}};var $7;if($4){
$7=new $4(this,$1.attrs,("children" in $1)?$1.children:null,$2)
};return $7
},"$lzc$set_$setters",-1,"$lzc$set_$classrootdepth",function($1){
if(!$1){
return
};var $2=this.parent;while(--$1>0){
$2=$2.parent
};this.classroot=$2
},"dataBindAttribute",function($1,$2,$3){
if(!this.datapath){
this.$lzc$set_datapath(".")
};if(!this.__LZdelegates){
this.__LZdelegates=[]
};this.__LZdelegates.push(new LzDataAttrBind(this.datapath,$1,$2,$3))
},"__LZdelayedSetters",void 0,"earlySetters",void 0,"$lzc$set_$delegates",function($1){
var $2=[];var $3=$1.length;for(var $4=0;$4<$3;$4+=3){
if($1[$4+2]){
$2.push($1[$4],$1[$4+1],$1[$4+2])
}else{
var $5=$1[$4+1];if(!this.__LZdelegates){
this.__LZdelegates=[]
};this.__LZdelegates.push(new LzDelegate(this,$5,this,$1[$4]))
}};if($2.length){
this.__LZstoreAttr($2,"$delegates")
}},"__LZstoreAttr",function($1,$2){
if(this.__LZresolveDict==null){
this.__LZresolveDict={}};this.__LZresolveDict[$2]=$1
},"__LZresolveReferences",function(){
var $1=this.__LZresolveDict;if($1!=null){
this.__LZresolveDict=null;var $2=$1["$inits"];if($2!=null){
for(var $3=0,$4=$2.length;$3<$4;$3++){
this[$2[$3].methodName](null)
}};var $5=$1["$constraints"];if($5!=null){
for(var $3=0,$4=$5.length;$3<$4;$3++){
this.applyConstraintExpr($5[$3])
}};for(var $6 in $1){
if($6=="$inits"||$6=="$constraints"||$6=="$delegates"){
continue
};if($6 in this.__LZdelayedSetters){
this[this.__LZdelayedSetters[$6]]($1[$6])
}else{

}};if($1["$delegates"]){
this.__LZsetDelegates($1.$delegates)
}}},"__LZsetDelegates",function($1){
if($1.length&&!this.__LZdelegates){
this.__LZdelegates=[]
};var $2=$1.length;for(var $3=0;$3<$2;$3+=3){
var $4=$1[$3+2];var $5=$4!=null?this[$4]():null;if($5==null){
$5=this
};var $6=$1[$3+1];this.__LZdelegates.push(new LzDelegate(this,$6,$5,$1[$3]))
}},"applyConstraint",function($1,$2,$3){
var $4="$cf"+this.$cfn++;this.addProperty($4,$2);return this.applyConstraintMethod($4,$3)
},"applyConstraintMethod",function($1,$2){
if($2&&$2.length>0){
if(!this.__LZdelegates){
this.__LZdelegates=[]
};var $3;for(var $4=0,$5=$2.length;$4<$5;$4+=2){
$3=$2[$4];if($3){
var $6=new LzDelegate(this,$1,$3,"on"+$2[$4+1]);this.__LZdelegates.push($6)
}}};this[$1](null)
},"applyConstraintExpr",function($1){
var $2=$1.methodName;var $3=null;if($1 instanceof LzAlwaysExpr){
var $4=$1;var $5=$4.dependenciesName;$3=this[$5]()
};this.applyConstraintMethod($2,$3)
},"releaseConstraint",function($1){
if(this._instanceAttrs!=null){
var $2=this._instanceAttrs[$1];if($2 instanceof LzConstraintExpr){
var $3=$2.methodName;return this.releaseConstraintMethod($3)
}};return false
},"releaseConstraintMethod",function($1){
var $2=false;var $3=this.__LZdelegates;if($3){
for(var $4=0;$4<$3.length;){
var $5=$3[$4];if((LzDelegate["$lzsc$isa"]?LzDelegate.$lzsc$isa($5):$5 instanceof LzDelegate)&&$5.c===this&&$5.m===this[$1]){
$5.unregisterAll();$3.splice($4,1);$2=true
}else{
$4++
}}};return $2
},"$lzc$set_name",function($1){
if(!($1===null||typeof $1=="string")){
return
};var $2=this.name;var $3=this.parent;var $4=this.immediateparent;if($2&&$2!=$1){
if(this.$lzc$bind_name){
if(globalValue($2)===this){
this.$lzc$bind_name.call(null,this,false)
}};if($3){
if($2&&$3[$2]===this){
$3[$2]=null
}};if($4){
if($2&&$4[$2]===this){
$4[$2]=null
}}};if($1&&$1.length){
if($3){
$3[$1]=this
};if($4){
$4[$1]=this
}};this.name=$1
},"defaultSet",function($1,$2){
if($1!=null){
this[$2]=$1
}},"setDatapath",function($1){
this.$lzc$set_datapath($1)
},"data",null,"$lzc$set_data",function($1){
this.data=$1;if(LzDataNodeMixin["$lzsc$isa"]?LzDataNodeMixin.$lzsc$isa($1):$1 instanceof LzDataNodeMixin){
var $2=this.datapath||new LzDatapath(this);$2.setPointer($1)
};if(this.ondata.ready){
this.ondata.sendEvent($1)
}},"setData",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};this.$lzc$set_data($1)
},"applyData",function($1){

},"updateData",function(){
return void 0
},"setSelected",function($1){

},"options",{},"$lzc$set_options",function($1){
if(this.options===this["constructor"].prototype.options){
this.options=new LzInheritedHash(this.options)
};for(var $2 in $1){
this.options[$2]=$1[$2]
}},"getOption",function($1){
return this.options[$1]
},"setOption",function($1,$2){
if(this.options===this["constructor"].prototype.options){
this.options=new LzInheritedHash(this.options)
};this.options[$1]=$2
},"determinePlacement",function($1,$2,$3){
if($2==null){
var $4=null
}else{
var $4=this.searchSubnodes("name",$2)
};return $4==null?this:$4
},"searchImmediateSubnodes",function($1,$2){
var $3=this.subnodes;if($3==null){
return null
};for(var $4=$3.length-1;$4>=0;$4--){
var $5=$3[$4];if($5[$1]==$2){
return $5
}};return null
},"searchSubnodes",function($1,$2){
var $3=this.subnodes?this.subnodes.concat():[];while($3.length>0){
var $4=$3;$3=new Array();for(var $5=$4.length-1;$5>=0;$5--){
var $6=$4[$5];if($6[$1]==$2){
return $6
};var $7=$6.subnodes;if($7){
for(var $8=$7.length-1;$8>=0;$8--){
$3.push($7[$8])
}}}};return null
},"searchParents",function($1){
var $2=this;do{
$2=$2.immediateparent;if($2[$1]!=null){
return $2
}}while($2!=canvas)
},"getUID",function(){
return this.__LZUID
},"childOf",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if($1==null){
return false
};var $3=this;while($3.nodeLevel>=$1.nodeLevel){
if($3==$1){
return true
};$3=$3.immediateparent
};return false
},"destroy",function(){
if(this.__LZdeleted==true){
return
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this);if(this.subnodes!=null){
for(var $1=this.subnodes.length-1;$1>=0;$1--){
this.subnodes[$1].destroy()
}};if(this.$lzc$bind_id){
this.$lzc$bind_id.call(null,this,false)
};if(this.$lzc$bind_name){
this.$lzc$bind_name.call(null,this,false)
};var $2=this.parent;var $3=this.name;if($2!=null&&$3!=null){
if($2[$3]===this){
$2[$3]=null
};if(this.immediateparent[$3]===this){
this.immediateparent[$3]==null
}};if(this.__LZdelegates!=null){
for(var $1=this.__LZdelegates.length-1;$1>=0;$1--){
this.__LZdelegates[$1].unregisterAll()
}};this.__LZdelegates=null;if(this.immediateparent&&this.immediateparent.subnodes){
for(var $1=this.immediateparent.subnodes.length-1;$1>=0;$1--){
if(this.immediateparent.subnodes[$1]==this){
this.immediateparent.subnodes.splice($1,1);break
}}};this.data=null
},"animate",function($1,$2,$3,$4,$5){
switch(arguments.length){
case 3:
$4=null;
case 4:
$5=null;

};if($3==0){
var $6=$4?this[$1]+$2:$2;if(!this.__LZdeleted){
var $lzsc$256027157="$lzc$set_"+$1;if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$lzsc$256027157]):this[$lzsc$256027157] instanceof Function){
this[$lzsc$256027157]($6)
}else{
this[$1]=$6;var $lzsc$742386317=this["on"+$1];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$742386317):$lzsc$742386317 instanceof LzEvent){
if($lzsc$742386317.ready){
$lzsc$742386317.sendEvent($6)
}}}};return null
};var $7={attribute:$1,to:$2,duration:$3,start:true,relative:$4,target:this};for(var $8 in $5){
$7[$8]=$5[$8]
};var $9=new LzAnimator(null,$7);return $9
},"toString",function(){
return this.getDebugIdentification()
},"getDebugIdentification",function(){
var $1=this["constructor"].tagname;if(this["name"]!=null){
$1+=" name: "+this.name
};if(this["id"]!=null){
$1+=" id: "+this.id
};return $1
},"$lzc$set_$datapath",function($1){
if($1==LzNode._ignoreAttribute){
return
}else{
if(!($1 instanceof Object)){

}};this.makeChild($1,true)
},"acceptTypeValue",function($1,$2){
var $3=$1?LzNode.presentationtypes[$1]:null;if($2!=null){
if($3!=null){
$2=$3.accept($2)
}else{
$2=DefaultPresentationType.accept($2)
}};return $2
},"acceptAttribute",function($1,$2,$3){
$3=this.acceptTypeValue($2,$3);if(this[$1]!==$3){
if(!this.__LZdeleted){
var $lzsc$676932956="$lzc$set_"+$1;if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$lzsc$676932956]):this[$lzsc$676932956] instanceof Function){
this[$lzsc$676932956]($3)
}else{
this[$1]=$3;var $lzsc$1887108560=this["on"+$1];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$1887108560):$lzsc$1887108560 instanceof LzEvent){
if($lzsc$1887108560.ready){
$lzsc$1887108560.sendEvent($3)
}}}}}},"presentTypeValue",function($1,$2){
var $3=LzNode.presentationtypes[$1];if($3!=null&&$3["present"]){
$2=$3.present($2)
}else{
$2=PresentationType.present($2)
};return $2
},"presentAttribute",function($1,$2){
return this.presentTypeValue($2,this[$1])
},"$lzc$presentAttribute_dependencies",function($1,$2,$3,$4){
return [$2,$3]
}],["tagname","node","attributes",new LzInheritedHash(),"mergeAttributes",function($1,$2){
for(var $3 in $1){
var $4=$1[$3];if($4===LzNode._ignoreAttribute){
delete $2[$3]
}else{
if(LzInitExpr["$lzsc$isa"]?LzInitExpr.$lzsc$isa($4):$4 instanceof LzInitExpr){
$2[$3]=$4
}else{
if(Object["$lzsc$isa"]?Object.$lzsc$isa($4):$4 instanceof Object){
var $5=$2[$3];if(Object["$lzsc$isa"]?Object.$lzsc$isa($5):$5 instanceof Object){
if((Array["$lzsc$isa"]?Array.$lzsc$isa($4):$4 instanceof Array)&&(Array["$lzsc$isa"]?Array.$lzsc$isa($5):$5 instanceof Array)){
$2[$3]=$4.concat($5);continue
}else{
if(($4.constructor===Object||(LzInheritedHash["$lzsc$isa"]?LzInheritedHash.$lzsc$isa($4):$4 instanceof LzInheritedHash))&&($5.constructor===Object||(LzInheritedHash["$lzsc$isa"]?LzInheritedHash.$lzsc$isa($5):$5 instanceof LzInheritedHash))){
var $6=new LzInheritedHash($5);for(var $7 in $4){
$6[$7]=$4[$7]
};$2[$3]=$6;continue
}}}};$2[$3]=$4
}}}},"mergeChildren",function($1,$2){
if(Array["$lzsc$isa"]?Array.$lzsc$isa($2):$2 instanceof Array){
$1=$2.concat((Array["$lzsc$isa"]?Array.$lzsc$isa($1):$1 instanceof Array)?$1:[])
};return $1
},"_ignoreAttribute",{toString:function(){
return "_ignoreAttribute"
}},"__LZdelayedSetters",new LzInheritedHash({$refs:"$lzc$set_$refs"}),"earlySetters",new LzInheritedHash({name:1,$events:2,$delegates:3,$classrootdepth:4,$datapath:5}),"__UIDs",0,"presentationtypes",{string:StringPresentationType,number:NumberPresentationType,numberExpression:NumberPresentationType,color:ColorPresentationType,"boolean":BooleanPresentationType,inheritableBoolean:BooleanPresentationType,expression:ExpressionPresentationType,size:SizePresentationType}]);(function($1){
with($1){
with($1.prototype){

}}})(LzNode);lz[LzNode.tagname]=LzNode;Class.make("$lzc$class_userClassPlacement",null,["$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=null;

};$1.defaultplacement=$2
}],null);(function($1){
with($1){
with($1.prototype){

}}})($lzc$class_userClassPlacement);Class.make("LzDelegate",null,["__delegateID",0,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);if(LzEventable["$lzsc$isa"]?LzEventable.$lzsc$isa($1):$1 instanceof LzEventable){

}else{
if(!(Object["$lzsc$isa"]?Object.$lzsc$isa($1):$1 instanceof Object)){
return
}else{

}};this.c=$1;var m=$1[$2];if(Function["$lzsc$isa"]?Function.$lzsc$isa(m):m instanceof Function){
this.m=m;if(m.length!=1){

}}else{

};if($3!=null){
this.register($3,$4)
};this.__delegateID=LzDelegate.__nextID++
},"c",void 0,"m",void 0,"lastevent",0,"enabled",true,"event_called",false,"execute",function($1){
var $2=this.c;if(this.enabled&&$2){
if($2["__LZdeleted"]){
return
};var $3=this.m;return $3&&$3.call($2,$1)
}},"register",function($1,$2){
if(LzEventable["$lzsc$isa"]?LzEventable.$lzsc$isa($1):$1 instanceof LzEventable){

}else{
if(!(Object["$lzsc$isa"]?Object.$lzsc$isa($1):$1 instanceof Object)){
return
}else{

}};if(this.c["__LZdeleted"]){
return
};var $3=$1[$2];if(!(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($3):$3 instanceof LzEvent)){
$3=new LzEvent($1,$2,this)
}else{
$3.addDelegate(this)
};this[this.lastevent++]=$3
},"unregisterAll",function(){
for(var $1=0;$1<this.lastevent;$1++){
this[$1].removeDelegate(this);this[$1]=null
};this.lastevent=0
},"unregisterFrom",function($1){
var $2=[];for(var $3=0;$3<this.lastevent;$3++){
var $4=this[$3];if($4===$1){
$4.removeDelegate(this)
}else{
$2.push($4)
};this[$3]=null
};this.lastevent=0;var $5=$2.length;for(var $3=0;$3<$5;$3++){
this[this.lastevent++]=$2[$3]
}},"disable",function(){
this.enabled=false
},"enable",function(){
this.enabled=true
},"toString",function(){
return "Delegate for "+this.c+" calls "+this.m+" "+this.__delegateID
}],["__nextID",1,"__LZdrainDelegatesQueue",function($1){
var $2=$1.length;var $3=0;if($3<$2){
var $4=new Array();var $5=new Array();while($3<$2){
var $6=$1[$3];var $7=$1[$3+1];var $8=$1[$3+2];$6.locked=true;$6.ready=false;$5.push($6);if(!$7.event_called){
$7.event_called=true;$4.push($7);if($7.c&&!$7.c.__LZdeleted&&$7.m){
$7.m.call($7.c,$8)
}};$3+=3
};while($7=$4.pop()){
$7.event_called=false
};while($6=$5.pop()){
$6.locked=false;$6.ready=$6.delegateList.length!=0
}};$1.length=0
}]);lz.Delegate=LzDelegate;Class.make("LzEvent",LzDeclaredEventClass,["delegateList",null,"$lzsc$initialize",function($1,$2,$3){
switch(arguments.length){
case 2:
$3=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);var $4=$1["_events"];if($4==null){
$1._events=[this]
}else{
$4.push(this)
};$1[$2]=this;if($3){
this.delegateList=[$3];this.ready=true
}else{
this.delegateList=[]
}},"locked",false,"addDelegate",function($1){
this.ready=true;this.delegateList.push($1)
},"sendEvent",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(this.locked||!this.ready){
return
};this.locked=true;this.ready=false;var $3=this.delegateList;var $4=$3.length;var $5=new Array();var $6;for(var $7=$4;$7>=0;$7--){
$6=$3[$7];if($6&&$6.enabled&&!$6.event_called){
$6.event_called=true;$5.push($6);var $8=$6.c;if($8&&!$8.__LZdeleted){
if($8.__LZdeferDelegates){
var $9=$8.__LZdelegatesQueue;if(!$9){
$9=$8.__LZdelegatesQueue=new Array()
};$9.push(this,$6,$1)
}else{
if($6.m){
$6.m.call($8,$1)
}}}}};while($6=$5.pop()){
$6.event_called=false
};this.locked=false;this.ready=$3.length!=0
},"removeDelegate",function($1){
switch(arguments.length){
case 0:
$1=null;

};var $2=this.delegateList;var $3=$2.length;for(var $4=0;$4<$3;$4++){
if($2[$4]===$1){
$2.splice($4,1);break
}};this.ready=$2.length!=0
},"clearDelegates",function(){
var $1=this.delegateList;while($1.length){
$1[0].unregisterFrom(this)
};this.ready=false
},"getDelegateCount",function(){
return this.delegateList.length
},"toString",function(){
return "LzEvent"
}],null);lz.Event=LzEvent;var LzIdleKernel={__callbacks:[],addCallback:function($1,$2){
LzIdleKernel.__callbacks.push([$1,$2])
},removeCallback:function($1,$2){
for(var $3=LzIdleKernel.__callbacks.length-1;$3>=0;$3--){
if(LzIdleKernel.__callbacks[$3][0]==$1&&LzIdleKernel.__callbacks[$3][1]==$2){
return LzIdleKernel.__callbacks.splice($3,1)
}}},__update:function(){
for(var $1=LzIdleKernel.__callbacks.length-1;$1>=0;$1--){
var $2=LzIdleKernel.__callbacks[$1][0];$2[LzIdleKernel.__callbacks[$1][1]](LzTimeKernel.getTimer())
}}};setInterval(LzIdleKernel.__update,33);Class.make("LzLibraryCleanup",LzNode,["lib",null,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"$lzc$set_libname",function($1){
this.lib=LzLibrary.findLibrary($1);this.lib.loadfinished()
}],["attributes",new LzInheritedHash(LzNode.attributes)]);var LzResourceLibrary={};var getTimer=function(){
return LzTimeKernel.getTimer()
};global=window;lz.BrowserUtils={__scopeid:0,__scopes:[],getcallbackstr:function($1,$2){
var $3=lz.BrowserUtils.__scopeid++;if($1.__callbacks==null){
$1.__callbacks={sc:$3}}else{
$1.__callbacks[$3]=$3
};lz.BrowserUtils.__scopes[$3]=$1;return "if (lz.BrowserUtils.__scopes["+$3+"]) lz.BrowserUtils.__scopes["+$3+"]."+$2+".apply(lz.BrowserUtils.__scopes["+$3+"], [])"
},getcallbackfunc:function($1,name,args){
var sc=lz.BrowserUtils.__scopeid++;if($1.__callbacks==null){
$1.__callbacks={sc:sc}}else{
$1.__callbacks[sc]=sc
};lz.BrowserUtils.__scopes[sc]=$1;return( function(){
var $1=lz.BrowserUtils.__scopes[sc];if($1){
return $1[name].apply($1,args)
}})
},removecallback:function($1){
if($1.__callbacks!=null){
for(var $2 in $1.__callbacks){
var $3=$1.__callbacks[$2];delete lz.BrowserUtils.__scopes[$3]
};delete $1.__callbacks
}}};var LzPool=function($1,$2,$3,$4){
this.cache={};if(typeof $1=="function"){
this.getter=$1
};if(typeof $2=="function"){
this.cacheHit=$2
};if(typeof $3=="function"){
this.destroyer=$3
};if($4){
this.owner=$4
}};LzPool.prototype.cache=null;LzPool.prototype.get=function($1,$2){
var $3=Array.prototype.slice.call(arguments,2);var $4=this.cache[$1];if($2||$4==null){
$3.unshift($1);$4=this.getter.apply(this,$3);if(!$2){
this.cache[$1]=$4
}}else{
if(this.cacheHit){
$3.unshift($1,$4);this.cacheHit.apply(this,$3)
}};if(this.owner){
$4.owner=this.owner
};return $4
};LzPool.prototype.flush=function($1){
if(this.destroyer){
this.destroyer($1,this.cache[$1])
};delete this.cache[$1]
};LzPool.prototype.destroy=function(){
for(var $1 in this.cache){
this.flush($1)
};this.owner=null;this.cache=null
};LzPool.prototype.getter=null;LzPool.prototype.destroyer=null;LzPool.prototype.cacheHit=null;var LzKeyboardKernel={__downKeysHash:{alt:false,control:false,shift:false},__keyboardEvent:function($1){
if(!$1){
$1=window.event
};var $2={};var $3=false;var $4=$1["keyCode"];var $5=$1.type;var $6=LzKeyboardKernel.__downKeysHash;if($4>=0&&$4!=16&&$4!=17&&$4!=18){
var $7=String.fromCharCode($4).toLowerCase();if($5=="keyup"){
if($6[$7]!=false){
$2[$7]=false;$3=true
};$6[$7]=false
}else{
if($5=="keydown"){
if($6[$7]!=true){
$2[$7]=true;$3=true
};$6[$7]=true
}}};if($6["alt"]!=$1["altKey"]){
$2["alt"]=$1["altKey"];$3=true;if(LzSprite.prototype.quirks["alt_key_sends_control"]){
$2["control"]=$2["alt"]
}};if($6["control"]!=$1["ctrlKey"]){
$2["control"]=$1["ctrlKey"];$3=true
};if($6["shift"]!=$1["shiftKey"]){
$2["shift"]=$1["shiftKey"];$3=true
};$6["alt"]=$1["altKey"];$6["control"]=$1["ctrlKey"];$6["shift"]=$1["shiftKey"];if($3&&LzKeyboardKernel.__scope&&LzKeyboardKernel.__scope[LzKeyboardKernel.__callback]){
LzKeyboardKernel.__scope[LzKeyboardKernel.__callback]($2,$4,"on"+$5)
};if($4>=0){
if($4==9){
$1.cancelBubble=true;$1.returnValue=false;return false
}else{
if(LzKeyboardKernel.__cancelKeys&&($4==13||$4==0||$4==37||$4==38||$4==39||$4==40)){
$1.cancelBubble=true;$1.returnValue=false;return false
}}}},__callback:null,__scope:null,__cancelKeys:true,setCallback:function($1,$2){
this.__scope=$1;this.__callback=$2
},setKeyboardControl:function($1){
var $2=null;var $3=lz&&lz.embed&&lz.embed.options&&lz.embed.options.cancelkeyboardcontrol!=true||true;if($3&&$1){
$2=LzKeyboardKernel.__keyboardEvent
};if(LzInputTextSprite.prototype.__focusedSprite){
LzInputTextSprite.prototype.__focusedSprite.__hideIfNotFocused()
};if(LzSprite.prototype.quirks.keyboardlistentotop){
var $4=window.top.document
}else{
var $4=document
};$4.onkeydown=$2;$4.onkeyup=$2;$4.onkeypress=$2
},gotLastFocus:function(){
if(!canvas.sprite.__LZdiv.mouseisover){
LzKeyboardKernel.setKeyboardControl(false)
}}};var LzMouseKernel={__lastMouseDown:null,__x:0,__y:0,owner:null,__showncontextmenu:null,__defaultcontextmenu:null,__mouseEvent:function($1){
if(!$1){
$1=window.event;var $2=$1.srcElement
}else{
var $2=$1.target
};var $3="on"+$1.type;if(window["LzKeyboardKernel"]&&LzKeyboardKernel["__keyboardEvent"]){
LzKeyboardKernel.__keyboardEvent($1)
};if(window["LzInputTextSprite"]&&LzInputTextSprite.prototype.__lastshown!=null){
if(LzSprite.prototype.quirks.fix_ie_clickable){
LzInputTextSprite.prototype.__lastshown.__hideIfNotFocused($3,$2)
}else{
if($3!="onmousemove"){
LzInputTextSprite.prototype.__lastshown.__hideIfNotFocused()
}}};if($3=="onmousemove"){
if($1.pageX||$1.pageY){
LzMouseKernel.__x=$1.pageX;LzMouseKernel.__y=$1.pageY
}else{
if($1.clientX||$1.clientY){
LzMouseKernel.__x=$1.clientX;LzMouseKernel.__y=$1.clientY
}}};if($1.button==2&&$3!="oncontextmenu"){
return
};if($3=="oncontextmenu"){
if($2&&$2.owner&&$2.owner.__contextmenu){
$2.owner.__contextmenu.kernel.__show();return $2.owner.__contextmenu.kernel.showbuiltins
}else{
if(LzMouseKernel.__defaultcontextmenu){
LzMouseKernel.__defaultcontextmenu.kernel.__show();return LzMouseKernel.__defaultcontextmenu.kernel.showbuiltins
}}}else{
LzMouseKernel.__sendEvent($3)
}},__sendEvent:function($1,$2){
if(LzMouseKernel.__callback){
LzMouseKernel.__scope[LzMouseKernel.__callback]($1,$2)
}},__callback:null,__scope:null,__mouseupEvent:function($1){
if(LzMouseKernel.__lastMouseDown!=null){
LzMouseKernel.__lastMouseDown.__globalmouseup($1)
}else{
LzMouseKernel.__mouseEvent($1)
}},setCallback:function($1,$2){
this.__scope=$1;this.__callback=$2
},__mousecontrol:false,setMouseControl:function($1){
if($1==LzMouseKernel.__mousecontrol){
return
};LzMouseKernel.__mousecontrol=$1;if($1){
lz.embed.attachEventHandler(document,"mousemove",LzMouseKernel,"__mouseEvent");lz.embed.attachEventHandler(document,"mousedown",LzMouseKernel,"__mouseEvent");lz.embed.attachEventHandler(document,"mouseup",LzMouseKernel,"__mouseupEvent");if(window.top!=window){
lz.embed.attachEventHandler(window.top.document,"mouseup",LzMouseKernel,"__mouseupEvent")
}}else{
lz.embed.removeEventHandler(document,"mousemove",LzMouseKernel,"__mouseEvent");lz.embed.removeEventHandler(document,"mousedown",LzMouseKernel,"__mouseEvent");lz.embed.removeEventHandler(document,"mouseup",LzMouseKernel,"__mouseupEvent");if(window.top!=window){
lz.embed.removeEventHandler(window.top.document,"mouseup",LzMouseKernel,"__mouseupEvent")
}};document.oncontextmenu=$1?LzMouseKernel.__mouseEvent:null
},__showhand:"pointer",showHandCursor:function($1){
var $2=$1==true?"pointer":"default";this.__showhand=$2;LzMouseKernel.setCursorGlobal($2)
},setCursorGlobal:function($1){
if(LzSprite.prototype.quirks.no_cursor_colresize){
return
};var $1=LzSprite.prototype.__defaultStyles.hyphenate($1);LzSprite.prototype.__setCSSClassProperty(".lzclickdiv","cursor",$1);LzSprite.prototype.__setCSSClassProperty(".lzdiv","cursor",$1);LzSprite.prototype.__setCSSClassProperty(".lzcanvasdiv","cursor",$1);LzSprite.prototype.__setCSSClassProperty(".lzcanvasclickdiv","cursor",$1)
},restoreCursor:function(){
if(LzSprite.prototype.quirks.no_cursor_colresize){
return
};if(LzMouseKernel.__amLocked){
return
};LzSprite.prototype.__setCSSClassProperty(".lzclickdiv","cursor",LzMouseKernel.__showhand);LzSprite.prototype.__setCSSClassProperty(".lzdiv","cursor","default");LzSprite.prototype.__setCSSClassProperty(".lzcanvasdiv","cursor","default");LzSprite.prototype.__setCSSClassProperty(".lzcanvasclickdiv","cursor","default")
},lock:function(){
LzMouseKernel.__amLocked=true
},unlock:function(){
LzMouseKernel.__amLocked=false;LzMouseKernel.restoreCursor()
},disableMouseTemporarily:function(){
this.setGlobalClickable(false);this.__resetonmouseover=true
},__resetonmouseover:false,__resetMouse:function(){
if(this.__resetonmouseover){
this.__resetonmouseover=false;this.setGlobalClickable(true)
}},setGlobalClickable:function($1){
if(!$1){
if(LzInputTextSprite.prototype.__lastshown){
LzInputTextSprite.prototype.__lastshown.__hide()
}};var $2=document.getElementById("lzcanvasclickdiv");$2.style.display=$1?"block":"none"
}};Class.make("LzBrowserKernel",null,null,["loadURL",function($1,$2,$3){
switch(arguments.length){
case 1:
$2=null;
case 2:
$3=null;

};if($2!=null){
if($3!=null){
window.open($1,$2,$3)
}else{
window.open($1,$2)
}}else{
window.location=$1
}},"loadJS",function($1,$2){
LzBrowserKernel.loadURL("javascript:"+$1+";void(0);",$2)
},"callJS",function($1,$2){
var $3=null;var $4=eval($1);var $5=$1.split(".");if($5.length>1){
$5.pop();$3=eval($5.join("."))
};var $6=Array.prototype.slice.call(arguments,2);if($4){
var $7=$4.apply($3,$6)
};if($2&&typeof $2=="function"){
$2($7)
};return $7
},"setHistory",function($1){
lz.embed.history.set($1)
},"callMethod",function($1){
return eval($1)
},"getVersion",function(){
return navigator.userAgent
},"getOS",function(){
return navigator.platform
},"getLoadURL",function(){
var $1=LzSprite.__rootSprite._url;if(!$1){
$1=new String(window.location)
};var $2=$1.indexOf(":");var $3=$1.indexOf("/");if($2>-1){
if($1.indexOf("://")==$2){
return $1
}else{
if($1.charAt($2+1)=="/"){
$1=$1.substring(0,$2+1)+"/"+$1.substring($2+1);return $1
}else{
var $4=new LzURL(new String(window.location));$1=$1.substring(0,$2+1)+"/"+$4.path+$1.substring($2+1);return $1
}}}else{
if($3==0){
return $1
}else{
var $5=new String(window.location);var $6=$5.lastIndexOf("/");$5=$5.substring(0,$6+1);return $5+$1
}}},"getInitArg",function($1){
return global[$1]
},"getAppID",function(){
return LzSprite.__rootSprite._id
}]);var LzSprite=function($1,$2){
if($1==null){
return
};this.owner=$1;this.uid=LzSprite.prototype.uid++;if($2){
this.isroot=true;LzSprite.__rootSprite=this;var div=document.createElement("div");div.className="lzcanvasdiv";if(this.quirks.ie6_improve_memory_performance){
try{
document.execCommand("BackgroundImageCache",false,true)
}
catch(err){

}};var $3=lz.embed.__propcache;var $4=$3.appenddiv;if($3.bgcolor){
div.style.backgroundColor=$3.bgcolor;this.bgcolor=$3.bgcolor
};var $5=$3.width;if($5){
$4.style.width=$5;div.style.width=$5;var $6=$5.indexOf("%")!=-1;var $7=$6?$5:parseInt($5);this._w=this.width=$7
};var $8=$3.height;if($8){
$4.style.height=$8;div.style.height=$8;var $9=$8.indexOf("%")!=-1;var $10=$9?$8:parseInt($8);this._h=this.height=$10
};if($3.id){
this._id=$3.id
};if($3.url){
this._url=$3.url
};if($3.cancelkeyboardcontrol){
lz.embed.options.cancelkeyboardcontrol=$3.cancelkeyboardcontrol
};if($3.serverroot){
lz.embed.options.serverroot=$3.serverroot
};lz.embed.options.approot=typeof $3.approot=="string"?$3.approot:"";if(!this.quirks.canvas_div_cannot_be_clipped&&$5&&!$6&&$8&&!$9){
div.style.clip="rect(0px "+this._w+" "+this._h+" 0px)";div.style.overflow="hidden"
};$4.appendChild(div);this.__LZdiv=div;if(this.quirks.fix_clickable){
var $11=document.createElement("div");$11.className="lzcanvasclickdiv";$11.id="lzcanvasclickdiv";$4.appendChild($11);this.__LZclickdiv=$11
};if(this.quirks.activate_on_mouseover){
div.mouseisover=false;div.onmouseover=function($1){
if(LzSprite.prototype.quirks.focus_on_mouseover){
div.focus()
};if(LzInputTextSprite.prototype.__focusedSprite==null){
LzKeyboardKernel.setKeyboardControl(true)
};LzMouseKernel.setMouseControl(true);this.mouseisover=true
};div.onmouseout=function($1){
if(!$1){
$1=window.event;var $2=$1.fromElement
}else{
var $2=$1.relatedTarget
};if($2&&$2.owner&&$2.className.indexOf("lz")==0){
if(LzSprite.prototype.quirks.fix_ie_clickable){
LzInputTextSprite.prototype.__setglobalclickable(true)
};if(LzSprite.prototype.quirks.focus_on_mouseover){
if(LzInputTextSprite.prototype.__lastshown==null){
div.focus()
}};LzKeyboardKernel.setKeyboardControl(true);LzMouseKernel.setMouseControl(true);LzMouseKernel.__resetMouse();this.mouseisover=true
}else{
if(LzSprite.prototype.quirks.focus_on_mouseover){
if(LzInputTextSprite.prototype.__lastshown==null){
div.blur()
}};LzKeyboardKernel.setKeyboardControl(false);LzMouseKernel.setMouseControl(false);this.mouseisover=false
}}}}else{
this.__LZdiv=document.createElement("div");this.__LZdiv.className="lzdiv";if(this.quirks.fix_clickable){
this.__LZclickdiv=document.createElement("div");this.__LZclickdiv.className="lzdiv"
}};this.__LZdiv.owner=this;if(this.quirks.fix_clickable){
this.__LZclickdiv.owner=this
};if(this.quirks.ie_leak_prevention){
this.__sprites[this.uid]=this
}};LzSprite.prototype.__defaultStyles={lzdiv:{position:"absolute",backgroundRepeat:"no-repeat"},lzclickdiv:{position:"absolute"},lzinputclickdiv:{position:"absolute"},lzcanvasdiv:{position:"absolute"},lzcanvasclickdiv:{zIndex:100000,position:"absolute"},lztext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",whiteSpace:"normal",position:"absolute",textAlign:"left",textIndent:"0px",letterSpacing:"0px",textDecoration:"none"},lzswftext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",whiteSpace:"normal",position:"absolute",paddingTop:"2px",paddingLeft:"2px",lineHeight:"120%",textAlign:"left",textIndent:"0px",letterSpacing:"0px",textDecoration:"none"},lzinputtext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",width:"100%",height:"100%",borderWidth:0,backgroundColor:"transparent",textAlign:"left",textIndent:"0px",letterSpacing:"0px",textDecoration:"none"},lzswfinputtext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",width:"100%",height:"100%",borderWidth:0,backgroundColor:"transparent",paddingTop:"1px",paddingLeft:"1px",lineHeight:"120%",textAlign:"left",textIndent:"0px",letterSpacing:"0px",textDecoration:"none"},lzswfinputtextmultiline:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",width:"100%",height:"100%",borderWidth:0,backgroundColor:"transparent",paddingTop:"2px",paddingLeft:"1px",lineHeight:"120%",textAlign:"left",textIndent:"0px",letterSpacing:"0px",textDecoration:"none"},writeCSS:function(){
var $1="";for(var $2 in this){
if($2=="writeCSS"||$2=="hyphenate"||$2=="__re"){
continue
};$1+=$2.indexOf("#")==-1?".":"";$1+=$2+"{";for(var $3 in this[$2]){
var $4=this[$2][$3];$1+=this.hyphenate($3)+":"+$4+";"
};$1+="}"
};document.write('<style type="text/css">'+$1+"</style>")
},__re:new RegExp("[A-Z]"),hyphenate:function($1){
var $2=$1.search(this.__re);if($2!=-1){
var $3=$1.substring($2,$2+1);$1=$1.substring(0,$2)+"-"+$3.toLowerCase()+$1.substring($2+1,$1.length)
};return $1
}};LzSprite.prototype.__defaultStyles["#lzcontextmenu a"]={color:"#000",display:"block",textDecoration:"none",cursor:"default"};LzSprite.prototype.__defaultStyles["#lzcontextmenu a:hover"]={color:"#FFF",backgroundColor:"#333"};LzSprite.prototype.__defaultStyles["#lzcontextmenu"]={position:"absolute",zIndex:10000000,backgroundColor:"#CCC",border:"1px outset #999",padding:"4px",fontFamily:"Verdana,Vera,sans-serif",fontSize:"13px",margin:"2px",color:"#999",minWidth:"100px"};LzSprite.prototype.uid=0;LzSprite.prototype.quirks={fix_clickable:true,fix_ie_background_height:false,fix_ie_clickable:false,ie_alpha_image_loader:false,ie_leak_prevention:false,invisible_parent_image_sizing_fix:false,emulate_flash_font_metrics:true,inner_html_strips_newlines:true,inner_html_no_entity_apos:false,css_hide_canvas_during_init:true,firefox_autocomplete_bug:false,hand_pointer_for_clickable:true,alt_key_sends_control:false,safari_textarea_subtract_scrollbar_height:false,safari_avoid_clip_position_input_text:false,no_cursor_colresize:false,safari_visibility_instead_of_display:false,preload_images_only_once:false,absolute_position_accounts_for_offset:false,canvas_div_cannot_be_clipped:false,inputtext_parents_cannot_contain_clip:false,set_height_for_multiline_inputtext:false,ie_opacity:false,text_measurement_use_insertadjacenthtml:false,text_selection_use_range:false,document_size_use_offsetheight:false,text_ie_carriagereturn:false,ie_paste_event:false,safari_paste_event:false,text_event_charcode:true,keypress_function_keys:true,ie_timer_closure:false,keyboardlistentotop:false,document_size_compute_correct_height:false,ie_mouse_events:false,fix_inputtext_with_parent_resource:false,activate_on_mouseover:true,ie6_improve_memory_performance:false,multiline_text_includes_overflow:false,text_height_includes_margins:false,inputtext_size_includes_margin:false,listen_for_mouseover_out:true,focus_on_mouseover:true,textstyle_on_textdiv:false,textdeco_on_textdiv:false,use_css_sprites:true,preload_images:true};LzSprite.prototype.capabilities={rotation:false,scalecanvastopercentage:true,readcanvassizefromsprite:true,opacity:true,colortransform:false,audio:false,accessibility:false,htmlinputtext:false,advancedfonts:false,bitmapcaching:false,persistence:false,clickmasking:false,minimize_opacity_changes:false,history:true,runtimemenus:false,setclipboard:false,proxypolicy:false};LzSprite.prototype.__updateQuirks=function(){
if(window["lz"]&&lz.embed&&lz.embed.browser){
var $1=this.quirks;var $2=lz.embed.browser;if($1["inner_html_strips_newlines"]==true){
LzSprite.prototype.inner_html_strips_newlines_re=RegExp("$","mg")
};LzSprite.prototype.br_to_newline_re=RegExp("<br/>","mg");if($2.isIE){
if($2.version<7){
$1["ie_alpha_image_loader"]=true;$1["document_size_compute_correct_height"]=true;$1["ie6_improve_memory_performance"]=true
}else{
$1["invisible_parent_image_sizing_fix"]=true;if($2.osversion>=6){
$1["ie_alpha_image_loader"]=true
}};$1["ie_opacity"]=true;$1["ie_timer_closure"]=true;$1["ie_leak_prevention"]=true;$1["fix_ie_clickable"]=true;$1["fix_ie_background_height"]=true;$1["inner_html_no_entity_apos"]=true;$1["inputtext_parents_cannot_contain_clip"]=true;this.capabilities["minimize_opacity_changes"]=true;$1["set_height_for_multiline_inputtext"]=true;$1["text_measurement_use_insertadjacenthtml"]=true;$1["text_selection_use_range"]=true;$1["text_ie_carriagereturn"]=true;$1["ie_paste_event"]=true;$1["keypress_function_keys"]=false;$1["text_event_charcode"]=false;$1["ie_mouse_events"]=true;$1["fix_inputtext_with_parent_resource"]=true;$1["inputtext_size_includes_margin"]=true;$1["multiline_text_includes_overflow"]=true;$1["focus_on_mouseover"]=false;$1["textstyle_on_textdiv"]=true
}else{
if($2.isSafari){
$1["alt_key_sends_control"]=true;$1["safari_avoid_clip_position_input_text"]=true;$1["safari_visibility_instead_of_display"]=true;$1["absolute_position_accounts_for_offset"]=true;if($2.version<525.18){
$1["canvas_div_cannot_be_clipped"]=true;$1["invisible_parent_image_sizing_fix"]=true;$1["safari_textarea_subtract_scrollbar_height"]=true
};$1["document_size_use_offsetheight"]=true;if($2.version>523.1){
this.capabilities["rotation"]=true
};$1["safari_paste_event"]=true;$1["keypress_function_keys"]=false;$1["keyboardlistentotop"]=true;if($2.isIphone){
$1["canvas_div_cannot_be_clipped"]=true
}}else{
if($2.isOpera){
$1["invisible_parent_image_sizing_fix"]=true;$1["no_cursor_colresize"]=true;$1["absolute_position_accounts_for_offset"]=true;$1["canvas_div_cannot_be_clipped"]=true;$1["document_size_use_offsetheight"]=true;$1["text_event_charcode"]=false;$1["textdeco_on_textdiv"]=true
}else{
if($2.isFirefox){
if($2.version<2){
$1["firefox_autocomplete_bug"]=true
}else{
if($2.version<3){
LzSprite.prototype.__defaultStyles.lzswftext.lineHeight="119%";LzSprite.prototype.__defaultStyles.lzswfinputtext.lineHeight="119%";LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.lineHeight="119%"
}else{
if($2.version<4){
$1["text_height_includes_margins"]=true
}}}}}}};if($1["safari_avoid_clip_position_input_text"]){
LzSprite.prototype.__defaultStyles.lzswfinputtext.paddingTop="-1px";LzSprite.prototype.__defaultStyles.lzswfinputtext.paddingLeft="-1px";LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.paddingTop="2px";LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.paddingLeft="0px"
};if(this.quirks["text_height_includes_margins"]){
LzSprite.prototype.__defaultStyles.lzswfinputtext.paddingTop="0px";LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.paddingTop="0px"
};if($1["inputtext_size_includes_margin"]){
LzSprite.prototype.__defaultStyles.lzswfinputtext.paddingTop="0px";LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.paddingTop="0px"
};if($1["multiline_text_includes_overflow"]){
LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.overflow="auto"
};if($1["css_hide_canvas_during_init"]){
if($1["safari_visibility_instead_of_display"]){
LzSprite.prototype.__defaultStyles.lzcanvasdiv.visibility="hidden"
}else{
LzSprite.prototype.__defaultStyles.lzcanvasdiv.display="none"
};LzSprite.prototype.__defaultStyles.lzcanvasclickdiv.display="none"
};if($1["hand_pointer_for_clickable"]){
LzSprite.prototype.__defaultStyles.lzclickdiv.cursor="pointer"
}}};LzSprite.prototype.__updateQuirks();LzSprite.prototype.__defaultStyles.writeCSS();LzSprite.prototype.__LZdiv=null;LzSprite.prototype.__LZimg=null;LzSprite.prototype.__LZclick=null;LzSprite.prototype.x=null;LzSprite.prototype.y=null;LzSprite.prototype.opacity=null;LzSprite.prototype.width=null;LzSprite.prototype.height=null;LzSprite.prototype.playing=false;LzSprite.prototype.clickable=false;LzSprite.prototype.frame=1;LzSprite.prototype.frames=null;LzSprite.prototype.blankimage="lps/includes/blank.gif";LzSprite.prototype.resource=null;LzSprite.prototype.source=null;LzSprite.prototype.visible=null;LzSprite.prototype.text=null;LzSprite.prototype.clip=null;LzSprite.prototype.stretches=null;LzSprite.prototype.resourceWidth=null;LzSprite.prototype.resourceHeight=null;LzSprite.prototype.cursor=null;LzSprite.prototype.init=function($1){
this.setVisible($1);if(this.isroot){
if(this.quirks["safari_visibility_instead_of_display"]){
this.__LZdiv.style.visibility="visible"
};if(this._id){
lz.embed[this._id]._ready(this.owner)
}}};LzSprite.prototype.__topZ=1;LzSprite.prototype.__parent=null;LzSprite.prototype.__children=null;LzSprite.prototype.addChildSprite=function($1){
if($1.__parent!=null){
return
};$1.__parent=this;if(this.__children){
this.__children.push($1)
}else{
this.__children=[$1]
};this.__LZdiv.appendChild($1.__LZdiv);if(this.quirks.fix_clickable){
this.__LZclickdiv.appendChild($1.__LZclickdiv)
};$1.__setZ(++this.__topZ)
};LzSprite.prototype.setResource=function($1){
if(this.resource==$1){
return
};this.resource=$1;if($1.indexOf("http:")==0||$1.indexOf("https:")==0){
this.skiponload=false;this.setSource($1);return
};var $2=this.getResourceUrls($1);this.owner.resourceevent("totalframes",$2.length);this.frames=$2;if(this.quirks.preload_images&&!this.__usecssprite){
this.__preloadFrames()
};this.skiponload=true;this.setSource($2[0],true)
};LzSprite.prototype.getResourceUrls=function($1){
var $2=[];var $3=LzResourceLibrary[$1];if(!$3){
return $2
};this.resourceWidth=$3.width;this.resourceHeight=$3.height;var $4;if($3.ptype&&$3.ptype=="sr"){
$4=lz.embed.options.serverroot
}else{
$4=lz.embed.options.approot
};if(this.quirks.use_css_sprites&&$3.sprite){
this.__csssprite=$4+$3.sprite;this.__usecssprite=this.stretches==null
}else{
this.__csssprite=this.__usecssprite=null;if(this.__bgimage){
this.__setBGImage(null)
}};for(var $5=0;$5<$3.frames.length;$5++){
$2[$5]=$4+$3.frames[$5]
};return $2
};LzSprite.prototype.CSSDimension=function($1,$2){
return Math.round($1)+($2?$2:"px")
};LzSprite.prototype.loading=false;LzSprite.prototype.setSource=function($1,$2){
if($1==null||$1=="null"){
this.unload();return
};if($2!=true){
this.skiponload=false;this.resource=$1;this.__updateLoadStatus(0)
};if($2=="memorycache"){
$2=true
};if(this.loading){
if(this.__ImgPool&&this.source){
this.__ImgPool.flush(this.source)
};this.__destroyImage(null,this.__LZimg);this.__LZimg=null
};this.source=$1;if(this.__usecssprite){
if(!this.__LZimg){
var $3=document.createElement("img");$3.className="lzdiv";$3.owner=this;$3.src=lz.embed.options.serverroot+LzSprite.prototype.blankimage;this.__bindImage($3)
};this.__updateStretches();var $4=this.__csssprite?this.__csssprite:$1;this.__setBGImage($4);this.owner.resourceload({width:this.resourceWidth,height:this.resourceHeight,resource:this.resource,skiponload:this.skiponload});return
};if(!this.quirks.preload_images){
this.owner.resourceload({width:this.resourceWidth,height:this.resourceHeight,resource:this.resource,skiponload:this.skiponload})
};this.loading=true;if(!this.__ImgPool){
this.__ImgPool=new LzPool(LzSprite.prototype.__getImage,LzSprite.prototype.__gotImage,LzSprite.prototype.__destroyImage,this)
};var $3=this.__ImgPool.get($1,$2!=true);this.__bindImage($3);if(this.loading){
if(this.skiponload&&this.quirks.ie_alpha_image_loader){
this.__updateIEAlpha($3)
}}else{
if(this.quirks.ie_alpha_image_loader){
this.__updateIEAlpha($3)
}else{
if(this.stretches){
this.__updateStretches()
}}};if(this.clickable){
this.setClickable(true)
}};LzSprite.prototype.__bindImage=function($1){
if(this.__LZimg&&this.__LZimg.owner){
this.__LZdiv.replaceChild($1,this.__LZimg);this.__LZimg=$1
}else{
this.__LZimg=$1;this.__LZdiv.appendChild(this.__LZimg)
}};LzSprite.prototype.__setBGImage=function($1){
var $2=$1?"url('"+$1+"')":null;this.__bgimage=this.__LZimg.style.backgroundImage=$2
};if(LzSprite.prototype.quirks.ie_alpha_image_loader){
LzSprite.prototype.__updateIEAlpha=function($1){
var $2=this.resourceWidth;var $3=this.resourceHeight;if(this.stretches=="both"){
$2="100%";$3="100%"
}else{
if(this.stretches=="width"){
$2="100%"
}else{
if(this.stretches=="height"){
$3="100%"
}}};if($2==null){
$2=this.width==null?"100%":this.CSSDimension(this.width)
};if($3==null){
$3=this.height==null?"100%":this.CSSDimension(this.height)
};$1.style.width=$2;$1.style.height=$3
}};LzSprite.prototype.setFontName=function($1,$2){
this.fontname=$1
};LzSprite.prototype.setClickable=function($1){
$1=$1==true;if(this.clickable==$1){
return
};if(this.__LZimg!=null){
if(this.__LZdiv._clickable){
this.__setClickable(false,this.__LZdiv)
};if(!this.__LZclick){
if(this.quirks.fix_ie_clickable){
this.__LZclick=document.createElement("img");this.__LZclick.src=lz.embed.options.serverroot+LzSprite.prototype.blankimage
}else{
this.__LZclick=document.createElement("div")
};this.__LZclick.owner=this;this.__LZclick.className="lzclickdiv";this.__LZclick.style.width=this.__LZdiv.style.width;this.__LZclick.style.height=this.__LZdiv.style.height;if(this.quirks.fix_clickable){
this.__LZclickdiv.appendChild(this.__LZclick)
}else{
this.__LZdiv.appendChild(this.__LZclick)
}};this.__setClickable($1,this.__LZclick);if(this.quirks.fix_clickable){
if(this.quirks.fix_ie_clickable){
this.__LZclickdiv.style.display=$1&&this.visible?"":"none";this.__LZclick.style.display=$1&&this.visible?"":"none"
}else{
this.__LZclick.style.display=$1?"block":"none"
}}}else{
if(this.quirks.fix_clickable){
if(!this.__LZclick){
if(this.quirks.fix_ie_clickable){
this.__LZclick=document.createElement("img");this.__LZclick.src=lz.embed.options.serverroot+LzSprite.prototype.blankimage
}else{
this.__LZclick=document.createElement("div")
};this.__LZclick.owner=this;this.__LZclick.className="lzclickdiv";this.__LZclick.style.width=this.__LZdiv.style.width;this.__LZclick.style.height=this.__LZdiv.style.height;this.__LZclickdiv.appendChild(this.__LZclick)
};this.__setClickable($1,this.__LZclick);if(this.quirks.fix_ie_clickable){
this.__LZclick.style.display=$1&&this.visible?"":"none"
}else{
this.__LZclick.style.display=$1?"block":"none"
}}else{
this.__setClickable($1,this.__LZdiv)
}};this.clickable=$1
};LzSprite.prototype.__setClickable=function($1,$2){
if($2._clickable==$1){
return
};$2._clickable=$1;var $3=$1?LzSprite.prototype.__clickDispatcher:null;$2.onclick=$3;$2.onmousedown=$3;$2.onmouseup=$3;if(this.quirks.ie_mouse_events){
$2.ondrag=$3;$2.ondblclick=$3;$2.onmouseenter=$3;$2.onmouseleave=$3
}else{
if(this.quirks.listen_for_mouseover_out){
$2.onmouseover=$3;$2.onmouseout=$3
}}};LzSprite.prototype.__clickDispatcher=function($1){
if(!$1){
$1=window.event
};this.owner.__mouseEvent($1);return false
};LzSprite.prototype.__mouseEvent=function($1,$2){
if($2){
var $3=$1;$1={}}else{
var $3="on"+$1.type;if(LzKeyboardKernel&&LzKeyboardKernel["__keyboardEvent"]){
LzKeyboardKernel.__keyboardEvent($1)
}};if(this.quirks.ie_mouse_events){
if($3=="onmouseenter"){
$3="onmouseover"
}else{
if($3=="onmouseleave"){
$3="onmouseout"
}else{
if($3=="ondblclick"){
this.__mouseEvent("onmousedown",true);this.__mouseEvent("onmouseup",true);this.__mouseEvent("onclick",true);return
}else{
if($3=="ondrag"){
return
}}}}};if(window["LzInputTextSprite"]&&$3=="onmouseover"&&LzInputTextSprite.prototype.__lastshown!=null){
LzInputTextSprite.prototype.__hideIfNotFocused()
};if($3=="onmousedown"){
$1.cancelBubble=true;this.__mouseisdown=true;if(window["LzMouseKernel"]){
LzMouseKernel.__lastMouseDown=this
}}else{
if($3=="onmouseup"){
$1.cancelBubble=false;if(window["LzMouseKernel"]&&LzMouseKernel.__lastMouseDown==this){
if(this.quirks.ie_mouse_events){
if(this.__isMouseOver()){
this.__mouseisdown=false
}}else{
this.__mouseisdown=false
}}else{
return
}}else{
if($3=="onmouseupoutside"){
this.__mouseisdown=false
}}};if(this.owner.mouseevent&&LzMouseKernel&&LzMouseKernel["__sendEvent"]){
if(LzMouseKernel.__lastMouseDown){
if($3=="onmouseover"||$3=="onmouseout"){
if(this.quirks.ie_mouse_events){
if(this.__isMouseOver()){
LzMouseKernel.__sendEvent($3,this.owner)
}}else{
if(LzMouseKernel.__lastMouseDown==this){
LzMouseKernel.__sendEvent($3,this.owner)
}};var $4=$3=="onmouseover"?"onmousedragin":"onmousedragout";LzMouseKernel.__sendEvent($4,this.owner);return
}};LzMouseKernel.__sendEvent($3,this.owner)
}};LzSprite.prototype.__isMouseOver=function($1){
var $2=this.getMouse();return $2.x>=0&&$2.y>=0&&$2.x<=this.width&&$2.y<=this.height
};LzSprite.prototype.__globalmouseup=function($1){
if(this.__mouseisdown){
if(!this.quirks.ie_mouse_events){
this.__mouseEvent($1)
};this.__mouseEvent("onmouseupoutside",true)
};LzMouseKernel.__lastMouseDown=null
};LzSprite.prototype.setX=function($1){
if($1==null||$1==this.x||isNaN($1)){
return
};this.__poscachedirty=true;this.x=$1;$1=this.CSSDimension($1);if(this._x!=$1){
this._x=$1;this.__LZdiv.style.left=$1;if(this.quirks.fix_clickable){
this.__LZclickdiv.style.left=$1
}}};LzSprite.prototype.setWidth=function($1){
if($1==null||$1<0||isNaN($1)||this.width==$1){
return
};this.width=$1;$1=this.CSSDimension($1);if(this._w!=$1){
this._w=$1;this.__LZdiv.style.width=$1;if(this.clip){
this.__updateClip()
};if(this.stretches){
this.__updateStretches()
};if(this.__LZclick){
this.__LZclick.style.width=$1
};return $1
}};LzSprite.prototype.setY=function($1){
if($1==null||$1==this.y||isNaN($1)){
return
};this.__poscachedirty=true;this.y=$1;$1=this.CSSDimension($1);if(this._y!=$1){
this._y=$1;this.__LZdiv.style.top=$1;if(this.quirks.fix_clickable){
this.__LZclickdiv.style.top=$1
}}};LzSprite.prototype.setHeight=function($1){
if($1==null||$1<0||isNaN($1)||this.height==$1){
return
};this.height=$1;$1=this.CSSDimension($1);if(this._h!=$1){
this._h=$1;this.__LZdiv.style.height=$1;if(this.clip){
this.__updateClip()
};if(this.stretches){
this.__updateStretches()
};if(this.__LZclick){
this.__LZclick.style.height=$1
};return $1
}};LzSprite.prototype.setMaxLength=function($1){

};LzSprite.prototype.setPattern=function($1){

};LzSprite.prototype.setVisible=function($1){
if(this.visible==$1){
return
};this.visible=$1;this.__LZdiv.style.display=$1&&this.opacity!=0?"block":"none";if(this.quirks.fix_clickable){
if(this.quirks.fix_ie_clickable&&this.__LZclick){
this.__LZclick.style.display=$1&&this.clickable?"":"none"
};this.__LZclickdiv.style.display=$1?"block":"none"
}};LzSprite.prototype.setColor=function($1){
if(this.color==$1){
return
};this.color=$1;this.__LZdiv.style.color=LzColorUtils.inttohex($1)
};LzSprite.prototype.setBGColor=function($1){
if(this.bgcolor==$1){
return
};this.bgcolor=$1;this.__LZdiv.style.backgroundColor=$1==null?"transparent":LzColorUtils.inttohex($1);if(this.quirks.fix_ie_background_height){
if(this.height!=null&&this.height<2){
this.setSource(lz.embed.options.serverroot+LzSprite.prototype.blankimage,true)
}else{
if(!this._fontSize){
this.__LZdiv.style.fontSize="0px"
}}}};LzSprite.prototype.setOpacity=function($1){
if(this.opacity==$1||$1<0){
return
};this.opacity=$1;var $2=100;if(this.capabilities.minimize_opacity_changes){
$2=10
};$1=parseInt($1*$2)/$2;if($1!=this._opacity){
this._opacity=$1;this.__LZdiv.style.display=this.visible&&$1!=0?"block":"none";if(this.quirks.ie_opacity){
if($1==1){
this.__LZdiv.style.filter=""
}else{
this.__LZdiv.style.filter="alpha(opacity="+parseInt($1*100)+")"
}}else{
if($1==1){
this.__LZdiv.style.opacity=""
}else{
this.__LZdiv.style.opacity=$1
}}}};LzSprite.prototype.play=function($1){
if(!this.frames||this.frames.length<2){
return
};$1=parseInt($1);if(!isNaN($1)){
this.__setFrame($1)
};if(this.playing==true){
return
};this.playing=true;this.owner.resourceevent("play",null,true);LzIdleKernel.addCallback(this,"__incrementFrame")
};LzSprite.prototype.stop=function($1){
if(!this.frames||this.frames.length<2){
return
};if(this.playing==true){
this.playing=false;this.owner.resourceevent("stop",null,true);LzIdleKernel.removeCallback(this,"__incrementFrame")
};$1=parseInt($1);if(!isNaN($1)){
this.__setFrame($1)
}};LzSprite.prototype.__incrementFrame=function(){
var $1=this.frame+1>this.frames.length?1:this.frame+1;this.__setFrame($1)
};if(LzSprite.prototype.quirks.preload_images_only_once){
LzSprite.prototype.__preloadurls={}};LzSprite.prototype.__preloadFrames=function(){
if(!this.__ImgPool){
this.__ImgPool=new LzPool(LzSprite.prototype.__getImage,LzSprite.prototype.__gotImage,LzSprite.prototype.__destroyImage,this)
};var $1=this.frames.length;for(var $2=0;$2<$1;$2++){
var $3=this.frames[$2];if(this.quirks.preload_images_only_once){
if($2>0&&LzSprite.prototype.__preloadurls[$3]){
continue
};LzSprite.prototype.__preloadurls[$3]=true
};var $4=this.__ImgPool.get($3,false,true);if(this.quirks.ie_alpha_image_loader){
this.__updateIEAlpha($4)
}}};LzSprite.prototype.__findParents=function($1){
var $2=[];var $3=this;if($3[$1]!=null){
$2.push($3)
};do{
$3=$3.__parent;if(!$3){
return $2
};if($3[$1]!=null){
$2.push($3)
}}while($3!=LzSprite.__rootSprite);return $2
};LzSprite.prototype.__imgonload=function($1,$2){
if(this.loading!=true){
return
};if(this.__imgtimoutid!=null){
clearTimeout(this.__imgtimoutid);this.__imgtimoutid=null
};this.loading=false;if(!$2){
if(this.quirks.ie_alpha_image_loader){
$1._parent.style.display=""
}else{
$1.style.display=""
}};this.resourceWidth=$2&&$1["__LZreswidth"]?$1.__LZreswidth:$1.width;this.resourceHeight=$2&&$1["__LZresheight"]?$1.__LZresheight:$1.height;if(!$2){
if(this.quirks.invisible_parent_image_sizing_fix&&this.resourceWidth==0){
var $3=this.__findParents("visible");if($3.length>0){
var $4=[];var $5=$3.length;for(var $6=0;$6<$5;$6++){
var $7=$3[$6];$4[$6]=$7.__LZdiv.style.display;$7.__LZdiv.style.display="block"
};this.resourceWidth=$1.width;this.resourceHeight=$1.height;for(var $6=0;$6<$5;$6++){
var $7=$3[$6];$7.__LZdiv.style.display=$4[$6]
}}};if(this.quirks.ie_alpha_image_loader){
$1._parent.__lastcondition="__imgonload"
}else{
$1.__lastcondition="__imgonload";$1.__LZreswidth=this.resourceWidth;$1.__LZresheight=this.resourceHeight
};if(this.quirks.ie_alpha_image_loader){
this.__updateIEAlpha(this.__LZimg)
}else{
if(this.stretches){
this.__updateStretches()
}}};this.owner.resourceload({width:this.resourceWidth,height:this.resourceHeight,resource:this.resource,skiponload:this.skiponload});if(this.skiponload!=true){
this.__updateLoadStatus(1)
};if(this.quirks.ie_alpha_image_loader){
this.__clearImageEvents(this.__LZimg)
}else{
this.__clearImageEvents($1)
}};LzSprite.prototype.__imgonerror=function($1,$2){
if(this.loading!=true){
return
};if(this.__imgtimoutid!=null){
clearTimeout(this.__imgtimoutid);this.__imgtimoutid=null
};this.loading=false;this.resourceWidth=1;this.resourceHeight=1;if(!$2){
if(this.quirks.ie_alpha_image_loader){
$1._parent.__lastcondition="__imgonerror"
}else{
$1.__lastcondition="__imgonerror"
};if(this.quirks.ie_alpha_image_loader){
this.__updateIEAlpha(this.__LZimg)
}else{
if(this.stretches){
this.__updateStretches()
}}};this.owner.resourceloaderror();if(this.skiponload!=true){
this.__updateLoadStatus(1)
};if(this.quirks.ie_alpha_image_loader){
this.__clearImageEvents(this.__LZimg)
}else{
this.__clearImageEvents($1)
}};LzSprite.prototype.__imgontimeout=function($1,$2){
if(this.loading!=true){
return
};this.__imgtimoutid=null;this.loading=false;this.resourceWidth=1;this.resourceHeight=1;if(!$2){
if(this.quirks.ie_alpha_image_loader){
$1._parent.__lastcondition="__imgontimeout"
}else{
$1.__lastcondition="__imgontimeout"
};if(this.quirks.ie_alpha_image_loader){
this.__updateIEAlpha(this.__LZimg)
}else{
if(this.stretches){
this.__updateStretches()
}}};this.owner.resourceloadtimeout();if(this.skiponload!=true){
this.__updateLoadStatus(1)
};if(this.quirks.ie_alpha_image_loader){
this.__clearImageEvents(this.__LZimg)
}else{
this.__clearImageEvents($1)
}};LzSprite.prototype.__updateLoadStatus=function($1){
this.owner.resourceevent("loadratio",$1);this.owner.resourceevent("framesloadratio",$1)
};LzSprite.prototype.__destroyImage=function($1,$2){
if($2){
if($2.owner){
var $3=$2.owner;if($3.__imgtimoutid!=null){
clearTimeout($3.__imgtimoutid);$3.__imgtimoutid=null
};lz.BrowserUtils.removecallback($3)
};LzSprite.prototype.__clearImageEvents($2);LzSprite.prototype.__discardElement($2)
};if(LzSprite.prototype.quirks.preload_images_only_once){
LzSprite.prototype.__preloadurls[$1]=null
}};LzSprite.prototype.__clearImageEvents=function($1){
if(!$1||$1.__cleared){
return
};if(LzSprite.prototype.quirks.ie_alpha_image_loader){
var $2=$1.sizer;if($2){
if($2.tId){
clearTimeout($2.tId)
};$2.onerror=null;$2.onload=null;$2.onloadforeal=null;$2._parent=null;var $3={width:$2.width,height:$2.height,src:$2.src};LzSprite.prototype.__discardElement($2);$1.sizer=$3
}}else{
$1.onerror=null;$1.onload=null
};$1.__cleared=true
};LzSprite.prototype.__gotImage=function($1,$2,$3){
if(this.owner.skiponload||$3==true){
this.owner[$2.__lastcondition]({width:this.owner.resourceWidth,height:this.owner.resourceHeight},true)
}else{
if(LzSprite.prototype.quirks.ie_alpha_image_loader){
this.owner[$2.__lastcondition]($2.sizer,true)
}else{
this.owner[$2.__lastcondition]($2,true)
}}};LzSprite.prototype.__getImage=function($1,$2){
if(LzSprite.prototype.quirks.ie_alpha_image_loader){
var im=document.createElement("div");im.style.overflow="hidden";if(this.owner&&$2!=true){
im.owner=this.owner;if(!im.sizer){
im.sizer=document.createElement("img");im.sizer._parent=im
};im.sizer.onload=function(){
im.sizer.tId=setTimeout(this.onloadforeal,1)
};im.sizer.onloadforeal=lz.BrowserUtils.getcallbackfunc(this.owner,"__imgonload",[im.sizer]);im.sizer.onerror=lz.BrowserUtils.getcallbackfunc(this.owner,"__imgonerror",[im.sizer]);var $3=lz.BrowserUtils.getcallbackfunc(this.owner,"__imgontimeout",[im.sizer]);this.owner.__imgtimoutid=setTimeout($3,canvas.medialoadtimeout);im.sizer.src=$1
};if(!$2){
im.style.display="none"
};if(this.owner.stretches){
im.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+$1+"',sizingMethod='scale')"
}else{
im.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+$1+"')"
}}else{
var im=document.createElement("img");im.className="lzdiv";if(!$2){
im.style.display="none"
};if(this.owner&&$2!=true){
im.owner=this.owner;im.onload=lz.BrowserUtils.getcallbackfunc(this.owner,"__imgonload",[im]);im.onerror=lz.BrowserUtils.getcallbackfunc(this.owner,"__imgonerror",[im]);var $3=lz.BrowserUtils.getcallbackfunc(this.owner,"__imgontimeout",[im]);this.owner.__imgtimoutid=setTimeout($3,canvas.medialoadtimeout)
};im.src=$1
};if(im){
im.__lastcondition="__imgonload"
};return im
};LzSprite.prototype.setClip=function($1){
if(this.clip==$1){
return
};this.clip=$1;this.__updateClip()
};LzSprite.prototype.__updateClip=function(){
if(this.isroot&&this.quirks.canvas_div_cannot_be_clipped){
return
};if(this.clip&&this.width!=null&&this.width>=0&&this.height!=null&&this.height>=0){
var $1="rect(0px "+this._w+" "+this._h+" 0px)";this.__LZdiv.style.clip=$1;if(this.quirks.fix_clickable){
this.__LZclickdiv.style.clip=$1
}}else{
if(this.__LZdiv.style.clip){
this.__LZdiv.style.clip="rect(auto auto auto auto)";if(this.quirks.fix_clickable){
this.__LZclickdiv.style.clip="rect(auto auto auto auto)"
}}}};LzSprite.prototype.stretchResource=function($1){
$1=$1!="none"?$1:null;if(this.stretches==$1){
return
};this.stretches=$1;this.__usecssprite=$1==null&&this.__csssprite;if(!this.__usecssprite&&this.__bgimage){
this.__setBGImage(null);this.__setFrame(this.frame,true)
};this.__updateStretches()
};LzSprite.prototype.__updateStretches=function(){
if(this.loading){
return
};if(this.quirks.ie_alpha_image_loader){
return
};if(this.__LZimg){
var $1=this.__LZimg.style.display;this.__LZimg.style.display="none";if(this.stretches=="both"){
this.__LZimg.width=this.width;this.__LZimg.height=this.height
}else{
if(this.stretches=="height"){
this.__LZimg.width=this.resourceWidth;this.__LZimg.height=this.height
}else{
if(this.stretches=="width"){
this.__LZimg.width=this.width;this.__LZimg.height=this.resourceHeight
}else{
this.__LZimg.width=this.resourceWidth;this.__LZimg.height=this.resourceHeight
}}};this.__LZimg.style.display=$1
}};LzSprite.prototype.predestroy=function(){

};LzSprite.prototype.destroy=function(){
if(this.__LZdeleted==true){
return
};this.__LZdeleted=true;if(this.__parent&&!this.__parent.__LZdeleted){
var $1=this.__parent.__children;for(var $2=$1.length-1;$2>=0;$2--){
if($1[$2]===this){
$1.splice($2,1);break
}}};if(this.__ImgPool){
this.__ImgPool.destroy()
};if(this.__LZimg){
this.__discardElement(this.__LZimg)
};if(this.__LZclick){
this.__setClickable(false,this.__LZclick);this.__discardElement(this.__LZclick)
};if(this.__LzInputDiv){
this.__setTextEvents(false);this.__discardElement(this.__LzInputDiv)
};if(this.__LZdiv){
if(this.isroot){
if(this.quirks.activate_on_mouseover){
this.__LZdiv.onmouseover=null;this.__LZdiv.onmouseout=null
}};this.__LZdiv.onselectstart=null;this.__setClickable(false,this.__LZdiv);this.__discardElement(this.__LZdiv)
};if(this.__LZinputclickdiv){
if(this.quirks.ie_mouse_events){
this.__LZinputclickdiv.onmouseenter=null
}else{
this.__LZinputclickdiv.onmouseover=null
};this.__discardElement(this.__LZinputclickdiv)
};if(this.__LZclickdiv){
this.__discardElement(this.__LZclickdiv)
};if(this.__LZtextdiv){
this.__discardElement(this.__LZtextdiv)
};if(this.__LZcanvas){
this.__discardElement(this.__LZcanvas)
};this.__ImgPool=null;if(this.quirks.ie_leak_prevention){
delete this.__sprites[this.uid]
};if(this.isroot){
lz.BrowserUtils.scopes=null
}};LzSprite.prototype.getMouse=function(){
var $1=this.__getPos();if(this.isroot){
return {x:LzMouseKernel.__x-$1.x,y:LzMouseKernel.__y-$1.y}}else{
var $2=LzSprite.__rootSprite.getMouse();return {x:$2.x-$1.x,y:$2.y-$1.y}}};LzSprite.prototype.__poscache=null;LzSprite.prototype.__poscachedirty=true;LzSprite.prototype.__getPos=function(){
var $1=false;var $2=this;while($2!=this.__rootSprite){
if($2.__poscachedirty){
$1=$2;break
};$2=$2.__parent
};if($1==false&&this.__poscache){
return this.__poscache
};var $3=lz.embed.getAbsolutePosition(this.__LZdiv);var $2=this;while($2&&$2!=this.__rootSprite){
if($2.__parent){
$2.__poscachedirty=false
};$2=$2.__parent
};this.__poscache=$3;return $3
};LzSprite.prototype.getWidth=function(){
var $1=this.__LZdiv.clientWidth;return $1==0?this.width:$1
};LzSprite.prototype.getHeight=function(){
var $1=this.__LZdiv.clientHeight;return $1==0?this.height:$1
};LzSprite.prototype.setCursor=function($1){
if(this.quirks.no_cursor_colresize){
return
};if($1==this.cursor){
return
};if(this.clickable!=true){
this.setClickable(true)
};this.cursor=$1;var $1=LzSprite.prototype.__defaultStyles.hyphenate($1);this.__LZclick.style.cursor=$1
};LzSprite.prototype.setShowHandCursor=function($1){
if($1==true){
this.setCursor("pointer")
}else{
this.setCursor("default")
}};LzSprite.prototype.getMCRef=function(){
return this.__LZdiv
};LzSprite.prototype.getContext=function(){
return this.getMCRef()
};LzSprite.prototype.bringToFront=function(){
if(!this.__parent){
return
};if(this.__parent.__children.length<2){
return
};this.__setZ(++this.__parent.__topZ)
};LzSprite.prototype.__setZ=function($1){
this.__LZdiv.style.zIndex=$1;if(this.quirks.fix_clickable){
this.__LZclickdiv.style.zIndex=$1
};this.__z=$1
};LzSprite.prototype.__zCompare=function($1,$2){
if($1.__z<$2.__z){
return -1
};if($1.__z>$2.__z){
return 1
};return 0
};LzSprite.prototype.sendToBack=function(){
if(!this.__parent){
return
};var $1=this.__parent.__children;if($1.length<2){
return
};$1.sort(LzSprite.prototype.__zCompare);this.sendBehind($1[0])
};LzSprite.prototype.sendBehind=function($1){
if(!$1){
return
};if(!this.__parent){
return
};var $2=this.__parent.__children;if($2.length<2){
return
};$2.sort(LzSprite.prototype.__zCompare);var $3=false;for(var $4=0;$4<$2.length;$4++){
var $5=$2[$4];if($5==$1){
$3=$1.__z
};if($3!=false){
$5.__setZ(++$5.__z)
}};this.__setZ($3)
};LzSprite.prototype.sendInFrontOf=function($1){
if(!$1){
return
};if(!this.__parent){
return
};var $2=this.__parent.__children;if($2.length<2){
return
};$2.sort(LzSprite.prototype.__zCompare);var $3=false;for(var $4=0;$4<$2.length;$4++){
var $5=$2[$4];if($3!=false){
$5.__setZ(++$5.__z)
};if($5==$1){
$3=$1.__z+1
}};this.__setZ($3)
};LzSprite.prototype.__setFrame=function($1,$2){
if($1<1){
$1=1
}else{
if($1>this.frames.length){
$1=this.frames.length
}};var $3=false;if($2){
$3=$1==this.frame
}else{
if($1==this.frame){
return
}};this.frame=$1;if(this.__usecssprite){
var $4=(this.frame-1)*-this.resourceWidth;var $5=0;this.__LZimg.style.backgroundPosition=$4+"px "+$5+"px"
}else{
var $6=this.frames[this.frame-1];this.setSource($6,true)
};if($3){
return
};this.owner.resourceevent("frame",this.frame);if(this.frames.length==this.frame){
this.owner.resourceevent("lastframe",null,true)
}};LzSprite.prototype.__discardElement=function($1){
if(LzSprite.prototype.quirks.ie_leak_prevention){
if(!$1||!$1.nodeType){
return
};if($1.nodeType>=1&&$1.nodeType<13){
if($1.owner){
$1.owner=null
};var $2=document.getElementById("__LZIELeakGarbageBin");if(!$2){
$2=document.createElement("DIV");$2.id="__LZIELeakGarbageBin";$2.style.display="none";document.body.appendChild($2)
};$2.appendChild($1);$2.innerHTML=""
}}else{
if($1.parentNode){
$1.parentNode.removeChild($1)
}}};LzSprite.prototype.getZ=function(){
return this.__z
};LzSprite.prototype.updateResourceSize=function(){
this.owner.resourceload({width:this.resourceWidth,height:this.resourceHeight,resource:this.resource,skiponload:true})
};LzSprite.prototype.unload=function(){
this.resource=null;this.source=null;this.resourceWidth=null;this.resourceHeight=null;if(this.__ImgPool){
this.__ImgPool.destroy();this.__ImgPool=null
};if(this.__LZimg){
this.__destroyImage(null,this.__LZimg);this.__LZimg=null
};this.__updateLoadStatus(0)
};LzSprite.prototype.__setCSSClassProperty=function($1,$2,$3){
var $4=document.all?"rules":"cssRules";var $5=document.styleSheets;var $6=$5.length-1;for(var $7=$6;$7>=0;$7--){
var $8=$5[$7][$4];var $9=$8.length-1;for(var $10=$9;$10>=0;$10--){
if($8[$10].selectorText==$1){
$8[$10].style[$2]=$3
}}}};LzSprite.prototype.setDefaultContextMenu=function($1){
LzMouseKernel.__defaultcontextmenu=$1
};LzSprite.prototype.setContextMenu=function($1){
this.__contextmenu=$1
};LzSprite.prototype.getContextMenu=function(){
return this.__contextmenu
};LzSprite.prototype.setRotation=function($1){
this.__LZdiv.style["-webkit-transform"]="rotate("+$1+"deg)"
};if(LzSprite.prototype.quirks.ie_leak_prevention){
LzSprite.prototype.__sprites={};function __cleanUpForIE(){
var $1=LzTextSprite.prototype._sizedomcache;var $2=LzSprite.prototype.__discardElement;for(var $3 in $1){
$2($1[$3])
};LzTextSprite.prototype._sizedomcache={};var $1=LzSprite.prototype.__sprites;for(var $3 in $1){
$1[$3].destroy();$1[$3]=null
};LzSprite.prototype.__sprites={}};lz.embed.attachEventHandler(window,"beforeunload",window,"__cleanUpForIE")
};Class.make("LzLibrary",LzNode,["loaded",false,"loading",false,"sprite",null,"href",void 0,"stage","late","onload",LzDeclaredEvent,"construct",function($1,$2){
this.stage=$2.stage;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.sprite=new LzSprite(this,false,$2);LzLibrary.libraries[$2.name]=this
},"init",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).apply(this,arguments);if(this.stage=="late"){
this.load()
}},"destroy",function(){
if(this.sprite){
this.sprite.destroy();this.sprite=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},"toString",function(){
return "Library "+this.href+" named "+this.name
},"load",function(){
if(this.loading||this.loaded){
return
};this.loading=true;lz.embed.__dhtmlLoadLibrary(this.href)
},"loadfinished",function(){
this.loading=false;if(this.onload.ready){
this.onload.sendEvent(true)
}}],["tagname","import","attributes",new LzInheritedHash(LzNode.attributes),"libraries",{},"findLibrary",function($1){
return LzLibrary.libraries[$1]
},"stripQueryString",function($1){
if($1.indexOf("?")>0){
$1=$1.substring(0,$1.indexOf("?"))
};return $1
},"__LZsnippetLoaded",function($1){
$1=LzLibrary.stripQueryString($1);var $2=null;var $3=LzLibrary.libraries;for(var $4 in $3){
var $5=LzLibrary.stripQueryString($3[$4].href);if($5==$1){
$2=$3[$4];break
}};if($2==null){
Debug.error("could not find library with href",$1)
}else{
$2.loaded=true;canvas.initiatorAddNode({attrs:{libname:$2.name},"class":LzLibraryCleanup},1);canvas.initDone()
}}]);lz[LzLibrary.tagname]=LzLibrary;var LzTextSprite=function($1){
if($1==null){
return
};this.owner=$1;this.uid=LzSprite.prototype.uid++;this.__LZdiv=document.createElement("div");this.__LZdiv.className="lzdiv";this.__LZtextdiv=document.createElement("div");this.__LZtextdiv.className="lzdiv";this.__LZdiv.appendChild(this.__LZtextdiv);if(this.quirks.emulate_flash_font_metrics){
this.__LZdiv.className="lzswftext"
}else{
this.__LZdiv.className="lztext"
};this.__LZdiv.owner=this;if(this.quirks.fix_clickable){
this.__LZclickdiv=document.createElement("div");this.__LZclickdiv.className="lzdiv";this.__LZclickdiv.owner=this
};if(this.quirks.ie_leak_prevention){
this.__sprites[this.uid]=this
}};LzTextSprite.prototype=new LzSprite(null);LzTextSprite.prototype.__initTextProperties=function($1){
this.setFontName($1.font);this.setFontStyle($1.fontstyle);this.setFontSize($1.fontsize)
};LzTextSprite.prototype._fontStyle="normal";LzTextSprite.prototype._fontWeight="normal";LzTextSprite.prototype._fontSize="11px";LzTextSprite.prototype._fontFamily="Verdana,Vera,sans-serif";LzTextSprite.prototype._whiteSpace="normal";LzTextSprite.prototype._textAlign="left";LzTextSprite.prototype._textIndent="0px";LzTextSprite.prototype.__LZtextIndent=0;LzTextSprite.prototype._letterSpacing="0px";LzTextSprite.prototype._textDecoration="none";LzTextSprite.prototype.__wpadding=4;LzTextSprite.prototype.__hpadding=4;LzTextSprite.prototype.__sizecacheupperbound=1000;LzTextSprite.prototype.selectable=true;LzTextSprite.prototype.text="";LzTextSprite.prototype.resize=true;LzTextSprite.prototype.restrict=null;LzTextSprite.prototype.setFontSize=function($1){
if($1==null||$1<0){
return
};$1=this.CSSDimension($1);if(this._fontSize!=$1){
this._fontSize=$1;this.__LZdiv.style.fontSize=$1;this._styledirty=true
}};LzTextSprite.prototype.setFontStyle=function($1){
var $2;if($1=="plain"){
$2="normal";$1="normal"
}else{
if($1=="bold"){
$2="bold";$1="normal"
}else{
if($1=="italic"){
$2="normal";$1="italic"
}else{
if($1=="bold italic"||$1=="bolditalic"){
$2="bold";$1="italic"
}}}};if($2!=this._fontWeight){
this._fontWeight=$2;this.__LZdiv.style.fontWeight=$2;this._styledirty=true
};if($1!=this._fontStyle){
this._fontStyle=$1;this.__LZdiv.style.fontStyle=$1;this._styledirty=true
}};LzTextSprite.prototype.setFontName=function($1){
if($1!=this._fontFamily){
this._fontFamily=$1;this.__LZdiv.style.fontFamily=$1;this._styledirty=true
}};LzTextSprite.prototype.setTextColor=LzSprite.prototype.setColor;LzTextSprite.prototype.setText=function($1,$2){
if($2!=true&&this.text==$1){
return
};this.text=$1;if(this.multiline&&$1&&$1.indexOf("\n")>=0){
if(this.quirks["inner_html_strips_newlines"]){
$1=$1.replace(this.inner_html_strips_newlines_re,"<br/>")
}};if($1&&this.quirks["inner_html_no_entity_apos"]){
$1=$1.replace(RegExp("&apos;","mg"),"&#39;")
};this.__LZtextdiv.innerHTML=$1;this.fieldHeight=null
};LzTextSprite.prototype.setMultiline=function($1){
$1=$1==true;if(this.multiline==$1){
return
};this.multiline=$1;if($1){
if(this._whiteSpace!="normal"){
this._whiteSpace="normal";this.__LZdiv.style.whiteSpace="normal";this._styledirty=true
};this.__LZdiv.style.overflow="visible"
}else{
if(this._whiteSpace!="nowrap"){
this._whiteSpace="nowrap";this.__LZdiv.style.whiteSpace="nowrap";this._styledirty=true
};this.__LZdiv.style.overflow="hidden"
};if(this.quirks["text_height_includes_margins"]){
this.__hpadding=$1?3:4
};this.setText(this.text,true)
};LzTextSprite.prototype.setPattern=function($1){
if($1==null||$1==""){
this.restrict=null
}else{
if(RegExp("^\\[.*\\]\\*$").test($1)){
this.restrict=RegExp($1.substring(0,$1.length-1)+"|[\\r\\n]","g")
}else{

}}};LzTextSprite.prototype.getTextWidth=function(){
if(this.text==""){
return 0
};return this.getTextSize(this.text,this.resize).width
};LzTextSprite.prototype.getTextHeight=function(){
var $1=this.getTextSize(null,true).height;if($1>0&&this.quirks.emulate_flash_font_metrics){
if(!this.multiline){
$1-=this.__hpadding
}};return $1
};LzTextSprite.prototype.getTextfieldHeight=function(){
if(this._styledirty!=true&&this.fieldHeight!=null){
return this.fieldHeight
};if(this.text==""){
this.fieldHeight=this.getTextSize(null).height;return this.fieldHeight
};if(this.multiline){
var $1=false;if(this.height){
$1=this.__LZdiv.style.height;this.__LZdiv.style.height="auto"
};var $2=this.__LZdiv.clientHeight;if($2==0||$2==null){
$2=this.getTextSize(this.text).height;if($2>0&&this.quirks.emulate_flash_font_metrics){
$2+=this.__hpadding
}}else{
if($2==2){
$2=this.getTextSize(this.text).height
};if($2>0&&this.quirks.emulate_flash_font_metrics){
$2+=this.__hpadding
};this.fieldHeight=$2
};if(this.height){
this.__LZdiv.style.height=$1
}}else{
var $2=this.getTextSize(null).height;if($2!=0){
this.fieldHeight=$2
}};return $2
};LzTextSprite.prototype._sizecache={counter:0};if(LzSprite.prototype.quirks.ie_leak_prevention){
LzTextSprite.prototype._sizedomcache={}};LzTextSprite.prototype._styledirty=true;LzTextSprite.prototype.getTextSize=function($1,$2){
if($1==null||$1==""){
$1='Yq_gy"9;'
};if(this._styledirty!=true){
var $3=this._stylecache
}else{
var $3="position: absolute";$3+=";visibility: hidden";$3+=";font-size: "+this._fontSize;$3+=";font-style: "+this._fontStyle;$3+=";font-weight: "+this._fontWeight;$3+=";font-family: "+this._fontFamily;$3+=";line-height: "+LzSprite.prototype.__defaultStyles.lzswftext.lineHeight;$3+=";letter-spacing: "+this._letterSpacing;$3+=";text-indent: "+this._textIndent;$3+=";text-align: "+this._textAlign;if(this.multiline&&$2!=true){
var $4=this.width;if($4){
if(this.__LZtextIndent<0){
$4+=this.__LZtextIndent
};$3+=";width: "+$4+"px"
}};$3+=";white-space: "+this._whiteSpace;this._stylecache=$3;this._styledirty=false
};var $5=document.getElementById("lzTextSizeCache");if(LzTextSprite.prototype._sizecache.counter>0&&LzTextSprite.prototype._sizecache.counter%LzTextSprite.prototype.__sizecacheupperbound==0){
LzTextSprite.prototype._sizecache={counter:0};if(LzSprite.prototype.quirks.ie_leak_prevention){
var $6=LzTextSprite.prototype._sizedomcache;var $7=LzSprite.prototype.__discardElement;for(var $8 in $6){
$7($6[$8])
};LzTextSprite.prototype._sizedomcache={}};if($5){
$5.innerHTML=""
}};if(LzTextSprite.prototype._sizecache[$3]==null){
LzTextSprite.prototype._sizecache[$3]={}};if(!$5){
$5=document.createElement("div");lz.embed.__setAttr($5,"id","lzTextSizeCache");lz.embed.__setAttr($5,"style","top: 4000px;");document.body.appendChild($5)
};var $9=LzTextSprite.prototype._sizecache[$3];if(!$9[$1]){
var $10={};if(this.quirks["text_measurement_use_insertadjacenthtml"]){
if(this.multiline&&$1&&this.quirks["inner_html_strips_newlines"]){
$1=$1.replace(this.inner_html_strips_newlines_re,"<br/>")
};var $11="span";var $12=$9["lzdiv~~~"+$11];if($12==null){
var $13="<"+$11+' id="testSpan'+LzTextSprite.prototype._sizecache.counter+'"';$13+=' style="'+$3+'">';$13+=$1;$13+="</"+$11+">";$5.insertAdjacentHTML("beforeEnd",$13);$12=document.all["testSpan"+LzTextSprite.prototype._sizecache.counter];$9["lzdiv~~~"+$11]=$12
}}else{
if(this.__LzInputDiv==null){
if(this.multiline&&$1&&this.quirks["inner_html_strips_newlines"]){
$1=$1.replace(this.inner_html_strips_newlines_re,"<br/>")
}};var $11=this.multiline?"div":"span";var $12=$9["lzdiv~~~"+$11];if($12==null){
$12=document.createElement($11);lz.embed.__setAttr($12,"style",$3);$5.appendChild($12);$9["lzdiv~~~"+$11]=$12
}};if(this.quirks.ie_leak_prevention){
LzTextSprite.prototype._sizedomcache["lzdiv~~~"+$11+$3]=$12
};$12.innerHTML=$1;$12.style.display="block";$10.width=$12.offsetWidth;$10.height=$12.offsetHeight;$12.style.display="none";if(this.quirks.emulate_flash_font_metrics){
$10.height=Math.floor($10.height*1.0000002)+(this.multiline?0:this.__hpadding);$10.width=$10.width+(this.multiline?0:this.__wpadding);if(this._whiteSpace=="normal"){
if(this.multiline){
$10.width+=this.__wpadding
}}};$9[$1]=$10;LzTextSprite.prototype._sizecache.counter++
};return $9[$1]
};LzTextSprite.prototype.setSelectable=function($1){
this.selectable=$1;if($1){
this.__LZdiv.onselectstart=null;this.__LZdiv.style["MozUserSelect"]="normal";this.__LZdiv.style["KHTMLUserSelect"]="normal";this.__LZdiv.style["UserSelect"]="normal"
}else{
this.__LZdiv.onselectstart=LzTextSprite.prototype.__cancelhandler;this.__LZdiv.style["MozUserSelect"]="none";this.__LZdiv.style["KHTMLUserSelect"]="none";this.__LZdiv.style["UserSelect"]="none"
}};LzTextSprite.prototype.__cancelhandler=function(){
return false
};LzTextSprite.prototype.setResize=function($1){
this.resize=$1==true
};LzTextSprite.prototype.setSelection=function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if($2==null){
$2=$1
}};LzTextSprite.prototype.getSelectionPosition=function(){

};LzTextSprite.prototype.getSelectionSize=function(){

};LzTextSprite.prototype.getScroll=function(){

};LzTextSprite.prototype.getMaxScroll=function(){

};LzTextSprite.prototype.setScroll=function(){

};LzTextSprite.prototype.__setWidth=LzSprite.prototype.setWidth;LzTextSprite.prototype.setWidth=function($1,$2){
if($1==null||$1<0||isNaN($1)||this.width==$1&&!$2){
return
};var $3=$1>=-this.__wpadding?$1-this.__wpadding:0;var $4=this.__LZtextIndent<0?-1*this.__LZtextIndent:0;this.__LZtextdiv.style.width=this.CSSDimension($3>=$4?$3-$4:0);var $5=this.CSSDimension($3);var $6=this.CSSDimension(this.height>=this.__hpadding?this.height-this.__hpadding:0);this.__LZtextdiv.style.clip="rect(0px "+$5+" "+$6+" 0px)";this.__setWidth($1);this._styledirty=true
};LzTextSprite.prototype.__setHeight=LzSprite.prototype.setHeight;LzTextSprite.prototype.setHeight=function($1){
if($1==null||$1<0||isNaN($1)||this.height==$1){
return
};var $2=this.CSSDimension(this.width>=this.__wpadding?this.width-this.__wpadding:0);var $3=this.CSSDimension($1>=this.__hpadding?$1-this.__hpadding:0);this.__LZtextdiv.style.height=$3;this.__LZtextdiv.style.clip="rect(0px "+$2+" "+$3+" 0px)";this.__setHeight($1);if(this.multiline){
this._styledirty=true
}};LzTextSprite.prototype.enableClickableLinks=function($1){

};LzTextSprite.prototype.makeTextLink=function($1,$2){
LzTextSprite.addLinkID(this.owner);var $3=this.owner.getUID();return "<span onclick=\"javascript:$modules.lz.__callTextLink('"+$3+"', '"+$2+"')\">"+$1+"</span>"
};$modules.lz.__callTextLink=function($1,$2){
var $3=LzTextSprite.linkIDMap[$1];if($3!=null){
$3.ontextlink.sendEvent($2)
}};LzTextSprite.linkIDMap=[];LzTextSprite.addLinkID=function($1){
LzTextSprite.linkIDMap[$1.getUID()]=$1
};LzTextSprite.deleteLinkID=function($1){
delete LzTextSprite.linkIDMap[$1]
};LzTextSprite.prototype._viewdestroy=LzSprite.prototype.destroy;LzTextSprite.prototype.destroy=function(){
LzTextSprite.deleteLinkID(this.owner.getUID());this._viewdestroy()
};LzTextSprite.prototype.setTextAlign=function($1){
if(this._textAlign!=$1){
this._textAlign=$1;if(this.quirks.textstyle_on_textdiv){
this.__LZtextdiv.style.textAlign=$1
}else{
this.__LZdiv.style.textAlign=$1
};this._styledirty=true
}};LzTextSprite.prototype.setTextIndent=function($1){
var $2=this.CSSDimension($1);if(this._textIndent!=$2){
var $3=$1<0||this.__LZtextIndent<0;this._textIndent=$2;this.__LZtextIndent=$1;if(this.quirks.textstyle_on_textdiv){
this.__LZtextdiv.style.textIndent=$2
}else{
this.__LZdiv.style.textIndent=$2
};this._styledirty=true;if($3){
this.__LZtextdiv.style.paddingLeft=$1>=0?"":$2.substr(1);this.setWidth(this.width,true)
}}};LzTextSprite.prototype.setLetterSpacing=function($1){
$1=this.CSSDimension($1);if(this._letterSpacing!=$1){
this._letterSpacing=$1;this.__LZdiv.style.letterSpacing=$1;this._styledirty=true
}};LzTextSprite.prototype.setTextDecoration=function($1){
if(this._textDecoration!=$1){
this._textDecoration=$1;if(this.quirks.textdeco_on_textdiv){
this.__LZtextdiv.style.textDecoration=$1
}else{
this.__LZdiv.style.textDecoration=$1
}}};var LzInputTextSprite=function($1){
if($1==null){
return
};this.owner=$1;this.uid=LzSprite.prototype.uid++;this.__LZdiv=document.createElement("div");this.__LZdiv.className="lzdiv";this.__LZdiv.owner=this;if(this.quirks.fix_clickable){
this.__LZclickdiv=document.createElement("div");this.__LZclickdiv.className="lzdiv";this.__LZclickdiv.owner=this
};if(this.quirks.ie_leak_prevention){
this.__sprites[this.uid]=this
};this.__createInputText()
};LzInputTextSprite.prototype=new LzTextSprite(null);LzInputTextSprite.prototype.____hpadding=2;LzInputTextSprite.prototype.____wpadding=4;LzInputTextSprite.prototype.____crregexp=new RegExp("\\r\\n","g");LzInputTextSprite.prototype.__createInputText=function($1){
if(this.__LzInputDiv){
return
};if(this.owner&&this.owner.password){
this.__LzInputDiv=document.createElement("input");lz.embed.__setAttr(this.__LzInputDiv,"type","password")
}else{
if(this.owner&&this.owner.multiline){
this.__LzInputDiv=document.createElement("textarea")
}else{
this.__LzInputDiv=document.createElement("input");lz.embed.__setAttr(this.__LzInputDiv,"type","text")
}};if(this.quirks.firefox_autocomplete_bug){
lz.embed.__setAttr(this.__LzInputDiv,"autocomplete","off")
};this.__LzInputDiv.owner=this;if(this.quirks.emulate_flash_font_metrics){
if(this.owner&&this.owner.multiline){
this.__LzInputDiv.className="lzswfinputtextmultiline"
}else{
this.____hpadding=1;this.__LzInputDiv.className="lzswfinputtext"
}}else{
this.__LzInputDiv.className="lzinputtext"
};if(this.owner){
lz.embed.__setAttr(this.__LzInputDiv,"name",this.owner.name)
};if($1==null){
$1=""
};lz.embed.__setAttr(this.__LzInputDiv,"value",$1);if(this.quirks.fix_clickable){
if(this.quirks.fix_ie_clickable){
this.__LZinputclickdiv=document.createElement("img");this.__LZinputclickdiv.src=lz.embed.options.serverroot+LzSprite.prototype.blankimage
}else{
this.__LZinputclickdiv=document.createElement("div")
};this.__LZinputclickdiv.className="lzclickdiv";this.__LZinputclickdiv.owner=this;if(this.quirks.ie_mouse_events){
this.__LZinputclickdiv.onmouseenter=this.__handlemouse
}else{
this.__LZinputclickdiv.onmouseover=this.__handlemouse
};this.__LZclickdiv.appendChild(this.__LZinputclickdiv)
};this.__LZdiv.appendChild(this.__LzInputDiv);if(this.quirks["inputtext_size_includes_margin"]){
this.____hpadding=0
};this.__setTextEvents(true)
};LzInputTextSprite.prototype.__handlemouse=function($1){
if(this.owner.selectable!=true){
return
};LzInputTextSprite.prototype.__setglobalclickable(false);if(this.owner.__fix_inputtext_with_parent_resource){
if(!this.__shown){
this.owner.setClickable(true);this.owner.select()
}}else{
this.owner.__show()
}};LzInputTextSprite.prototype.init=function($1){
this.setVisible($1);if(this.quirks["fix_inputtext_with_parent_resource"]){
var $2=this.__findParents("clickable");var $3=$2.length;if($3){
for(var $4=0;$4<$3;$4++){
var $1=$2[$4];if($1.resource!=null){
this.setClickable(true);this.__fix_inputtext_with_parent_resource=true
}}}}};LzInputTextSprite.prototype.__show=function(){
if(this.__shown==true||this.disabled==true){
return
};this.__hideIfNotFocused();LzInputTextSprite.prototype.__lastshown=this;this.__shown=true;this.__LzInputDiv=this.__LZdiv.removeChild(this.__LzInputDiv);if(this.quirks["inputtext_parents_cannot_contain_clip"]){
var $1=this.__findParents("clip");var $2=$1.length;if($2>1){
if(this._shownclipvals==null){
this._shownclipvals=[];this._shownclippedsprites=$1;for(var $3=0;$3<$2;$3++){
var $4=$1[$3];this._shownclipvals[$3]=$4.__LZclickdiv.style.clip;$4.__LZclickdiv.style.clip="rect(auto auto auto auto)"
}}}};if(this.quirks.fix_ie_clickable){
this.__LZclickdiv.appendChild(this.__LzInputDiv);this.__setglobalclickable(false)
}else{
this.__LZinputclickdiv.appendChild(this.__LzInputDiv)
};document.onselectstart=null
};LzInputTextSprite.prototype.__hideIfNotFocused=function($1,$2){
if(LzInputTextSprite.prototype.__lastshown==null){
return
};if(LzSprite.prototype.quirks.fix_ie_clickable){
if($1=="onmousemove"){
if(LzInputTextSprite.prototype.__globalclickable==false&&LzInputTextSprite.prototype.__focusedSprite&&$2){
if($2.owner!=LzInputTextSprite.prototype.__focusedSprite){
LzInputTextSprite.prototype.__setglobalclickable(true)
}else{
LzInputTextSprite.prototype.__setglobalclickable(false)
}};return
}else{
if($1!=null&&LzInputTextSprite.prototype.__globalclickable==true){
LzInputTextSprite.prototype.__setglobalclickable(false)
}}};if(LzInputTextSprite.prototype.__focusedSprite!=LzInputTextSprite.prototype.__lastshown){
LzInputTextSprite.prototype.__lastshown.__hide()
}};LzInputTextSprite.prototype.__setglobalclickable=function($1){
if(!LzSprite.prototype.quirks.fix_ie_clickable){
return
};if($1!=LzInputTextSprite.prototype.__globalclickable){
LzInputTextSprite.prototype.__globalclickable=$1;LzInputTextSprite.prototype.__setCSSClassProperty(".lzclickdiv","display",$1?"":"none")
}};LzInputTextSprite.prototype.__hide=function($1){
if(this.__shown!=true||this.disabled==true){
return
};LzInputTextSprite.prototype.__lastshown=null;this.__shown=false;if(this.quirks["inputtext_parents_cannot_contain_clip"]){
if(this._shownclipvals!=null){
for(var $2=0;$2<this._shownclipvals.length;$2++){
var $3=this._shownclippedsprites[$2];$3.__LZclickdiv.style.clip=this._shownclipvals[$2]
};this._shownclipvals=null;this._shownclippedsprites=null
}};if(this.quirks.fix_ie_clickable){
this.__setglobalclickable(true);this.__LzInputDiv=this.__LZclickdiv.removeChild(this.__LzInputDiv)
}else{
this.__LzInputDiv=this.__LZinputclickdiv.removeChild(this.__LzInputDiv)
};this.__LZdiv.appendChild(this.__LzInputDiv);if(this.__fix_inputtext_with_parent_resource){
this.setClickable(false)
};document.onselectstart=LzTextSprite.prototype.__cancelhandler
};LzInputTextSprite.prototype.gotBlur=function(){
if(LzInputTextSprite.prototype.__focusedSprite!=this){
return
};this.deselect()
};LzInputTextSprite.prototype.gotFocus=function(){
if(LzInputTextSprite.prototype.__focusedSprite==this){
return
};this.select()
};LzInputTextSprite.prototype.setText=function($1){
if($1.indexOf("<br/>")!=-1){
$1=$1.replace(this.br_to_newline_re,"\r")
};this.text=$1;this.__createInputText($1);this.__LzInputDiv.value=$1;this.fieldHeight=null
};LzInputTextSprite.prototype.__setTextEvents=function($1){
var $2=this.__LzInputDiv;var $3=$1?this.__textEvent:null;$2.onblur=$3;$2.onmousedown=$3;if(this.quirks.ie_mouse_events){
$2.onmouseleave=$3
}else{
$2.onmouseout=$3
};$2.onfocus=$3;$2.onclick=$3;$2.onkeyup=$3;$2.onkeydown=$3;$2.onkeypress=$3;$2.onchange=$3;if(this.quirks.ie_paste_event||this.quirks.safari_paste_event){
$2.onpaste=$1?(function($1){
this.owner.__pasteHandlerEx($1)
}):null
}};LzInputTextSprite.prototype.__pasteHandlerEx=function($1){
var $2=!(!this.restrict);var $3=this.multiline&&this.owner.maxlength>0;if($2||$3){
$1=$1?$1:window.event;if(this.quirks.safari_paste_event){
var $4=$1.clipboardData.getData("text/plain")
}else{
var $4=window.clipboardData.getData("TEXT");$4=$4.replace(this.____crregexp,"\n")
};var $5=false;var $6=this.getSelectionSize();if($6<0){
$6=0
};if($2){
var $7=$4.match(this.restrict);if($7==null){
var $8=""
}else{
var $8=$7.join("")
};$5=$8!=$4;$4=$8
};if($3){
var $9=this.owner.maxlength+$6;if(this.quirks.text_ie_carriagereturn){
var $10=this.__LzInputDiv.value.replace(this.____crregexp,"\n").length
}else{
var $10=this.__LzInputDiv.value.length
};var $11=$9-$10;if($11>0){
if($4.length>$11){
$4=$4.substring(0,$11);$5=true
}}else{
$4="";$5=true
}};if($5){
$1.returnValue=false;if($1.preventDefault){
$1.preventDefault()
};if($4.length>0){
if(this.quirks.safari_paste_event){
var $12=this.__LzInputDiv.value;var $13=this.getSelectionPosition();this.__LzInputDiv.value=$12.substring(0,$13)+$4+$12.substring($13+$6);$13+=$4.length;this.__LzInputDiv.setSelectionRange($13,$13)
}else{
var $14=document.selection.createRange();$14.text=$4
}}}}};LzInputTextSprite.prototype.__pasteHandler=function(){
var selpos=this.getSelectionPosition();var selsize=this.getSelectionSize();var val=this.__LzInputDiv.value;var that=this;setTimeout(function(){
var $1=!(!that.restrict);var $2=that.multiline&&that.owner.maxlength>0;var $3=that.__LzInputDiv.value;var $4=$3.length;var $5=that.owner.maxlength;if($1||$2&&$4>$5){
var $6=val.length;var $7=$3.substr(selpos,$4-$6+selsize);if($1){
var $8=$7.match(that.restrict);$7=$8!=null?$8.join(""):""
};if($2){
var $9=$5+selsize-$6;$7=$7.substring(0,$9)
};that.__LzInputDiv.value=val.substring(0,selpos)+$7+val.substring(selpos+selsize);selpos+=$7.length;that.__LzInputDiv.setSelectionRange(selpos,selpos)
}},1)
};LzInputTextSprite.prototype.__textEvent=function($1){
if(!$1){
$1=window.event
};var $2=this.owner;var $3=this.owner.owner;if($2.__LZdeleted==true){
return
};if($2.__skipevent){
$2.__skipevent=false;return
};var $4="on"+$1.type;if($2.quirks.ie_mouse_events&&$4=="onmouseleave"){
$4="onmouseout"
};if($2.__shown!=true){
if($4=="onfocus"){
$2.__skipevent=true;$2.__show();$2.__LzInputDiv.blur();LzInputTextSprite.__lastfocus=$2;LzKeyboardKernel.setKeyboardControl(true)
};return
}else{
if($2.__shown==false){
return
}};if($4=="onfocus"||$4=="onmousedown"){
if($4=="onfocus"){
LzInputTextSprite.prototype.__setglobalclickable(false)
};LzInputTextSprite.prototype.__focusedSprite=$2;$2.__show();if($4=="onfocus"&&$2._cancelfocus){
$2._cancelfocus=false;return
};if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=false
}}else{
if($4=="onblur"){
if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=true
};if(LzInputTextSprite.prototype.__focusedSprite===$2){
LzInputTextSprite.prototype.__focusedSprite=null
};if($2.__fix_inputtext_with_parent_resource&&$2.__isMouseOver()){
$2.select();return
};$2.__hide();if($2._cancelblur){
$2._cancelblur=false;return
}}else{
if($4=="onmouseout"){
$2.__setglobalclickable(true)
}}};if($4=="onkeypress"){
if($2.restrict||$2.multiline&&$3.maxlength>0){
var $5=$1.keyCode;var $6=$2.quirks.text_event_charcode?$1.charCode:$1.keyCode;var $7=!($1.ctrlKey||$1.altKey)&&($6>=32||$5==13);if($7){
var $8=false;if($5!=13&&$2.restrict){
$8=0>String.fromCharCode($6).search($2.restrict)
};if(!$8){
var $9=$2.getSelectionSize();if($9<=0){
if($2.quirks.text_ie_carriagereturn){
var $10=$2.__LzInputDiv.value.replace($2.____crregexp,"\n")
}else{
var $10=$2.__LzInputDiv.value
};var $11=$10.length,$12=$3.maxlength;if($11>=$12){
$8=true
}}};if($8){
$1.returnValue=false;if($1.preventDefault){
$1.preventDefault()
}}}else{
if($2.quirks.keypress_function_keys){
var $13=false;if($1.ctrlKey&&!$1.altKey&&!$1.shiftKey){
var $14=String.fromCharCode($6);$13=$14=="v"||$14=="V"
}else{
if($1.shiftKey&&!$1.altKey&&!$1.ctrlKey){
$13=$5==45
}};if($13){
if($2.restrict){
$2.__pasteHandler()
}else{
var $11=$2.__LzInputDiv.value.length,$12=$3.maxlength;if($11<$12||$2.getSelectionSize()>0){
$2.__pasteHandler()
}else{
$1.returnValue=false;if($1.preventDefault){
$1.preventDefault()
}}}}}}};return
};if($3){
if($4=="onkeydown"||$4=="onkeyup"){
var $15=$2.__LzInputDiv.value;if($15!=$2.text){
$2.text=$15;$3.inputtextevent("onchange",$15)
}}else{
if($4=="onmousedown"){
$3.inputtextevent($4);$4="onfocus"
};$3.inputtextevent($4)
}}};LzInputTextSprite.prototype.setEnabled=function($1){
this.disabled=!$1;this.__LzInputDiv.disabled=this.disabled
};LzInputTextSprite.prototype.setMaxLength=function($1){
if($1==null){
return
};this.__LzInputDiv.maxLength=$1
};LzInputTextSprite.prototype.select=function(){
this._cancelblur=true;this.__show();try{
this.__LzInputDiv.focus()
}
catch(err){

};LzInputTextSprite.__lastfocus=this;setTimeout("LzInputTextSprite.__lastfocus.__LzInputDiv.select()",50);if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=false
}};LzInputTextSprite.prototype.setSelection=function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if($2==null){
$2=$1
};this._cancelblur=true;this.__show();LzInputTextSprite.__lastfocus=this;if(this.quirks["text_selection_use_range"]){
var $3=this.__LzInputDiv.createTextRange();var $4=this.__LzInputDiv.value;if($1>$2){
var $5=$1;$1=$2;$2=$5
};if(this.multiline){
var $6=0;var $7=0;while($6<$1){
$6=$4.indexOf("\r\n",$6+2);if($6==-1){
break
};$7++
};var $8=0;while($6<$2){
$6=$4.indexOf("\r\n",$6+2);if($6==-1){
break
};$8++
};var $9=0;while($6<$4.length){
$6=$4.indexOf("\r\n",$6+2);if($6==-1){
break
};$9++
};var $10=$3.text.length;var $5=$1;var $11=$2-$4.length+$7+$8+$9+1
}else{
var $5=$1;var $11=$2-$3.text.length
};$3.moveStart("character",$5);$3.moveEnd("character",$11);$3.select()
}else{
this.__LzInputDiv.setSelectionRange($1,$2)
};this.__LzInputDiv.focus();if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=false
}};LzInputTextSprite.prototype.getSelectionPosition=function(){
if(!this.__shown||this.disabled==true){
return -1
};if(this.quirks["text_selection_use_range"]){
if(this.multiline){
var $1=this._getTextareaSelection()
}else{
var $1=this._getTextSelection()
};if($1){
return $1.start
}else{
return -1
}}else{
return this.__LzInputDiv.selectionStart
}};LzInputTextSprite.prototype.getSelectionSize=function(){
if(!this.__shown||this.disabled==true){
return -1
};if(this.quirks["text_selection_use_range"]){
if(this.multiline){
var $1=this._getTextareaSelection()
}else{
var $1=this._getTextSelection()
};if($1){
return $1.end-$1.start
}else{
return -1
}}else{
return this.__LzInputDiv.selectionEnd-this.__LzInputDiv.selectionStart
}};if(LzSprite.prototype.quirks["text_selection_use_range"]){
LzInputTextSprite.prototype._getTextSelection=function(){
this.__LzInputDiv.focus();var $1=document.selection.createRange();var $2=$1.getBookmark();var $3=contents=this.__LzInputDiv.value;do{
var $4="~~~"+Math.random()+"~~~"
}while(contents.indexOf($4)!=-1);var $5=$1.parentElement();if($5==null||!($5.type=="text"||$5.type=="textarea")){
return
};$1.text=$4+$1.text+$4;contents=this.__LzInputDiv.value;var $6={};$6.start=contents.indexOf($4);contents=contents.replace($4,"");$6.end=contents.indexOf($4);this.__LzInputDiv.value=$3;$1.moveToBookmark($2);$1.select();return $6
};LzInputTextSprite.prototype._getTextareaSelection=function(){
var $1=this.__LzInputDiv;var $2=document.selection.createRange().duplicate();if($2.parentElement()==$1){
var $3=document.body.createTextRange();$3.moveToElementText($1);$3.setEndPoint("EndToStart",$2);var $4=document.body.createTextRange();$4.moveToElementText($1);$4.setEndPoint("StartToEnd",$2);var $5=false,$6=false,$7=false;var $8,$9,$10,$11,$12,$13;$8=$9=$3.text;$10=$11=$2.text;$12=$13=$4.text;do{
if(!$5){
if($3.compareEndPoints("StartToEnd",$3)==0){
$5=true
}else{
$3.moveEnd("character",-1);if($3.text==$8){
$9+="\r\n"
}else{
$5=true
}}};if(!$6){
if($2.compareEndPoints("StartToEnd",$2)==0){
$6=true
}else{
$2.moveEnd("character",-1);if($2.text==$10){
$11+="\r\n"
}else{
$6=true
}}};if(!$7){
if($4.compareEndPoints("StartToEnd",$4)==0){
$7=true
}else{
$4.moveEnd("character",-1);if($4.text==$12){
$13+="\r\n"
}else{
$7=true
}}}}while(!$5||!$6||!$7);var $14=$9+$11+$13;var $15=false;if($1.value==$14){
$15=true
};var $16=$9.length;var $17=$16+$11.length;var $18=$11;var $19=this.__LzInputDiv.value;var $20=0;var $21=0;while($20<$16){
$20=$19.indexOf("\r\n",$20+2);if($20==-1){
break
};$21++
};var $22=0;while($20<$17){
$20=$19.indexOf("\r\n",$20+2);if($20==-1){
break
};$22++
};var $23=0;while($20<$19.length){
$20=$19.indexOf("\r\n",$20+2);if($20==-1){
break
};$23++
};$16-=$21;$17-=$22+$21;return {start:$16,end:$17}}}};LzInputTextSprite.prototype.deselect=function(){
this._cancelfocus=true;this.__hide();if(this.__LzInputDiv&&this.__LzInputDiv.blur){
this.__LzInputDiv.blur()
};if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=true
}};LzInputTextSprite.prototype.__fontStyle="normal";LzInputTextSprite.prototype.__fontWeight="normal";LzInputTextSprite.prototype.__fontSize="11px";LzInputTextSprite.prototype.__fontFamily="Verdana,Vera,sans-serif";LzInputTextSprite.prototype.__setFontSize=LzTextSprite.prototype.setFontSize;LzInputTextSprite.prototype.setFontSize=function($1){
this.__setFontSize($1);if(this.__fontSize!=this._fontSize){
this.__fontSize=this._fontSize;this.__LzInputDiv.style.fontSize=this._fontSize
}};LzInputTextSprite.prototype.__setFontStyle=LzTextSprite.prototype.setFontStyle;LzInputTextSprite.prototype.setFontStyle=function($1){
this.__setFontStyle($1);if(this.__fontStyle!=this._fontStyle){
this.__fontStyle=this._fontStyle;this.__LzInputDiv.style.fontStyle=this._fontStyle
};if(this.__fontWeight!=this._fontWeight){
this.__fontWeight=this._fontWeight;this.__LzInputDiv.style.fontWeight=this._fontWeight
}};LzInputTextSprite.prototype.__setFontName=LzTextSprite.prototype.setFontName;LzInputTextSprite.prototype.setFontName=function($1){
this.__setFontName($1);if(this.__fontFamily!=this._fontFamily){
this.__fontFamily=this._fontFamily;this.__LzInputDiv.style.fontFamily=this._fontFamily
}};LzInputTextSprite.prototype.setWidth=function($1){
if($1==null||$1<0||isNaN($1)||this.width==$1){
return
};var $2=this.__setWidth($1);if(this.quirks.fix_clickable&&$2!=null){
this.__LZclickdiv.style.width=$2;this.__LZinputclickdiv.style.width=$2
}};LzInputTextSprite.prototype.setHeight=function($1){
if($1==null||$1<0||isNaN($1)||this.height==$1){
return
};var $2=this.__setHeight($1);if(this.quirks.fix_clickable&&$2!=null){
this.__LZclickdiv.style.height=$2;this.__LZinputclickdiv.style.height=$2;if(this.multiline&&this.quirks.set_height_for_multiline_inputtext){
$1=this.CSSDimension($1-this.____hpadding*2);if($1!=this._multilineheight){
this._multilineheight=$1;this.__LzInputDiv.style.height=$1
}}}};LzInputTextSprite.prototype.setColor=function($1){
if(this.color==$1){
return
};this.color=$1;this.__LzInputDiv.style.color=LzColorUtils.inttohex($1)
};LzInputTextSprite.prototype.getText=function(){
if(this.multiline&&this.quirks.text_ie_carriagereturn){
return this.__LzInputDiv.value.replace(this.____crregexp,"\n")
}else{
return this.__LzInputDiv.value
}};LzInputTextSprite.prototype.getTextfieldHeight=function(){
if(this._styledirty!=true&&this.fieldHeight!=null){
return this.fieldHeight
};if(this.text==""){
this.fieldHeight=this.getTextSize(null).height;return this.fieldHeight
};if(this.multiline){
var $1=false;if(this.height){
$1=this.__LzInputDiv.style.height;this.__LzInputDiv.style.height="auto"
};var $2=this.__LzInputDiv.scrollHeight;if($2==0||$2==null){
$2=this.getTextSize(this.text).height;if($2>0&&this.quirks.emulate_flash_font_metrics){
$2+=this.__hpadding
}}else{
if(this.quirks["safari_textarea_subtract_scrollbar_height"]){
$2+=24
};if($2==2){
$2=this.getTextSize(this.text).height
};if($2>0&&this.quirks.emulate_flash_font_metrics){
$2+=this.__hpadding
};this.fieldHeight=$2
};if(this.height){
this.__LzInputDiv.style.height=$1
}}else{
var $2=this.getTextSize(null).height;if($2!=0){
this.fieldHeight=$2
}};return $2
};LzInputTextSprite.findSelection=function(){
if(LzInputTextSprite.__focusedSprite&&LzInputTextSprite.__focusedSprite.owner){
return LzInputTextSprite.__focusedSprite.owner
}};document.onselectstart=LzTextSprite.prototype.__cancelhandler;document.ondrag=LzTextSprite.prototype.__cancelhandler;var LzXMLParser={parseXML:function($1,$2,$3){
var $4=new DOMParser();var $5=$4.parseFromString($1,"text/xml");var $6=lz.embed.browser;if($6.isIE){
this.__checkIE($5)
}else{
if($6.isFirefox||$6.isOpera){
this.__checkFirefox($5)
}else{
if($6.isSafari){
this.__checkSafari($5)
}}};return $5.firstChild
},__checkIE:function($1){
var $2=$1.parseError;if($2.errorCode!=0){
throw new Error($2.reason)
}},__checkFirefox:function($1){
var $2=$1.firstChild;if($2&&$2.nodeName=="parsererror"){
var $3=$2.firstChild.nodeValue;throw new Error($3.match(".*")[0])
}},__checkSafari:function($1){
var $2=$1.firstChild;if($2 instanceof HTMLElement){
var $3=$2.firstChild.firstChild.childNodes[1].textContent;throw new Error($3.match("[^:]*: (.*)")[1])
}else{
$2=$2.firstChild;if($2&&$2.nodeName=="parsererror"){
var $3=$2.childNodes[1].textContent;throw new Error($3.match("[^:]*: (.*)")[1])
}}}};if(typeof DOMParser=="undefined"){
var DOMParser=function(){

};DOMParser.prototype.parseFromString=function($1,$2){
if(typeof window.ActiveXObject!="undefined"){
var $3=new ActiveXObject("MSXML.DomDocument");$3.loadXML($1);return $3
}else{
if(typeof XMLHttpRequest!="undefined"){
$2=$2||"application/xml";var $4=new XMLHttpRequest();$4.open("GET","data:"+$2+";charset=utf-8,"+encodeURIComponent($1),false);if($4.overrideMimeType){
$4.overrideMimeType($2)
};$4.send(null);return $4.responseXML
}}}};var LzXMLTranslator={whitespacePat:new RegExp("^\\s*$"),stringTrimPat:new RegExp("^\\s+|\\s+$","g"),copyXML:function($1,$2,$3){
var $4=this.copyBrowserXML($1,true,$2,$3);new LzDataElement(null,{},[$4]);return $4
},copyBrowserXML:function($1,$2,$3,$4){
if(!$1){
return $1
}else{
if($1.nodeType==3||$1.nodeType==4){
var $5=$1.nodeValue;if($2&&this.whitespacePat.test($5)){
return null
};if($3){
$5=$5.replace(this.stringTrimPat,"")
};return new LzDataText($5)
}else{
if($1.nodeType==1||$1.nodeType==9){
var $6={};var $7=$1.attributes;if($7){
for(var $8=0;$8<$7.length;$8++){
var $9=$7.item($8);if($9){
var $10=!$4&&($9.localName||$9.baseName)||$9.name;$6[$10]=$9.value
}}};var $11=!$4&&($1.localName||$1.baseName)||$1.nodeName;var $12=new LzDataElement($11,$6);if($1.hasChildNodes()){
var $13=[];var $14=$1.childNodes;for(var $15=0;$15<$14.length;$15++){
var $16=this.copyBrowserXML($14[$15],$2,$3,$4);if($16!=null){
$13.push($16)
}};$12.$lzc$set_childNodes($13)
};return $12
}else{
return null
}}}}};var LzHTTPLoader=function($1,$2){
this.owner=$1;this.options={parsexml:true,serverproxyargs:null};this.requestheaders={};this.requestmethod=LzHTTPLoader.GET_METHOD;this.__loaderid=LzHTTPLoader.loaderIDCounter++
};LzHTTPLoader.GET_METHOD="GET";LzHTTPLoader.POST_METHOD="POST";LzHTTPLoader.PUT_METHOD="PUT";LzHTTPLoader.DELETE_METHOD="DELETE";LzHTTPLoader.activeRequests={};LzHTTPLoader.loaderIDCounter=0;LzHTTPLoader.prototype.loadSuccess=function($1,$2){

};LzHTTPLoader.prototype.loadError=function($1,$2){

};LzHTTPLoader.prototype.loadTimeout=function($1,$2){

};LzHTTPLoader.prototype.loadContent=function($1,$2){
if(this.options["parsexml"]){
this.translateXML()
}else{
this.loadSuccess(this,$2)
}};LzHTTPLoader.prototype.translateXML=function(){
var $1=null;if(this.responseXML!=null){
var $2;var $3=this.responseXML.childNodes;for(var $4=0;$4<$3.length;$4++){
var $5=$3.item($4);if($5.nodeType==1){
$2=$5;break
}};$1=LzXMLTranslator.copyXML($2,this.options.trimwhitespace,this.options.nsprefix)
};this.loadSuccess(this,$1)
};LzHTTPLoader.prototype.getResponse=function(){
return this.responseText
};LzHTTPLoader.prototype.getResponseStatus=function(){
return this.responseStatus
};LzHTTPLoader.prototype.getResponseHeaders=function(){
return this.responseHeaders
};LzHTTPLoader.prototype.getResponseHeader=function($1){
return this.responseHeaders[$1]
};LzHTTPLoader.prototype.setRequestHeaders=function($1){
this.requestheaders=$1
};LzHTTPLoader.prototype.setRequestHeader=function($1,$2){
this.requestheaders[$1]=$2
};LzHTTPLoader.prototype.setOption=function($1,$2){
this.options[$1]=$2
};LzHTTPLoader.prototype.getOption=function($1){
return this.options[$1]
};LzHTTPLoader.prototype.setProxied=function($1){
this.setOption("proxied",$1)
};LzHTTPLoader.prototype.setQueryParams=function($1){
this.queryparams=$1
};LzHTTPLoader.prototype.setQueryString=function($1){
this.querystring=$1
};LzHTTPLoader.prototype.setQueueing=function($1){
this.setOption("queuing",$1)
};LzHTTPLoader.prototype.abort=function(){
if(this.req){
this.__abort=true;this.req.abort();this.req=null;this.removeTimeout(this)
}};LzHTTPLoader.prototype.open=function($1,$2,$3,$4){
if(this.req){
this.abort()
};this.req=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");this.responseStatus=0;this.responseHeaders=null;this.responseText=null;this.responseXML=null;this.__abort=false;this.__timeout=false;this.requesturl=$2;this.requestmethod=$1
};LzHTTPLoader.prototype.send=function($1){
this.loadXMLDoc(this.requestmethod,this.requesturl,this.requestheaders,$1,true)
};LzHTTPLoader.prototype.makeProxiedURL=function($1,$2,$3,$4,$5,$6){
var $7={serverproxyargs:this.options.serverproxyargs,sendheaders:this.options.sendheaders,trimwhitespace:this.options.trimwhitespace,nsprefix:this.options.nsprefix,timeout:this.timeout,cache:this.options.cacheable,ccache:this.options.ccache,proxyurl:$1,url:$2,secure:this.secure,postbody:$6,headers:$5,httpmethod:$3,service:$4};return lz.Browser.makeProxiedURL($7)
};LzHTTPLoader.prototype.timeout=Infinity;LzHTTPLoader.prototype.setTimeout=function($1){
this.timeout=$1
};LzHTTPLoader.prototype.setupTimeout=function($1,$2){
var $3=new Date().getTime()+$2;var $4=$1.__loaderid;LzHTTPLoader.activeRequests[$4]=[$1,$3];var $5=setTimeout("LzHTTPLoader.__LZcheckXMLHTTPTimeouts("+$4+")",$2);LzHTTPLoader.activeRequests[$4][2]=$5
};LzHTTPLoader.prototype.removeTimeout=function($1){
var $2=$1.__loaderid;if($2!=null){
var $3=LzHTTPLoader.activeRequests[$2];if($3&&$3[0]===$1){
clearTimeout($3[2]);delete LzHTTPLoader.activeRequests[$2]
}}};LzHTTPLoader.__LZcheckXMLHTTPTimeouts=function($1){
var $2=LzHTTPLoader.activeRequests[$1];if($2){
var $3=new Date().getTime();var $4=$2[0];var $5=$2[1];if($3>=$5){
delete LzHTTPLoader.activeRequests[$1];$4.__timeout=true;if($4.req){
$4.req.abort()
};$4.req=null;$4.loadTimeout($4,null)
}else{
var $6=setTimeout("LzHTTPLoader.__LZcheckXMLHTTPTimeouts("+$1+")",$3-$5);$2[2]=$6
}}};LzHTTPLoader.prototype.getElapsedTime=function(){
return new Date().getTime()-this.gstart
};LzHTTPLoader.prototype.__setRequestHeaders=function($1,$2){
if($2!=null){
for(var $3 in $2){
var $4=$2[$3];$1.setRequestHeader($3,$4)
}}};LzHTTPLoader.prototype.__getAllResponseHeaders=function($1){
var $2=new RegExp("^([-\\w]+):\\s*(\\S(?:.*\\S)?)\\s*$","mg");var $3=$1.getAllResponseHeaders();var $4={};var $5;while(($5=$2.exec($3))!=null){
$4[$5[1]]=$5[2]
};return $4
};LzHTTPLoader.prototype.loadXMLDoc=function($1,$2,$3,$4,$5){
if(this.req){
var self=this;this.req.onreadystatechange=function(){
var $1=self.req;if($1==null){
return
};if($1.readyState==4){
if(self.__timeout){

}else{
if(self.__abort){

}else{
self.removeTimeout(self);self.req=null;var $2=-1;try{
$2=$1.status
}
catch(e){

};self.responseStatus=$2;if($2==200||$2==304){
self.responseXML=$1.responseXML;self.responseText=$1.responseText;self.responseHeaders=self.__getAllResponseHeaders($1);self.loadContent(self,self.responseText)
}else{
self.loadError(self,null)
}}}}};this.req.open($1,$2,true);if($1=="POST"&&$3["content-type"]==null){
$3["content-type"]="application/x-www-form-urlencoded"
};this.__setRequestHeaders(this.req,$3);this.gstart=new Date().getTime();this.req.send($4);if(isFinite(this.timeout)){
this.setupTimeout(this,this.timeout)
}}};var LzScreenKernel={width:null,height:null,__resizeEvent:function(){
var $1=LzSprite.prototype.quirks;if($1.document_size_use_offsetheight){
var $2=window.document.body;LzScreenKernel.width=$2.offsetWidth;LzScreenKernel.height=$2.offsetHeight
}else{
if(window.innerHeight){
var $2=window;LzScreenKernel.width=$2.innerWidth;LzScreenKernel.height=$2.innerHeight
}else{
if(document.documentElement&&document.documentElement.clientWidth){
var $2=document.documentElement;if($1.document_size_compute_correct_height&&window.top!=window){
var $3=window.top.document.documentElement;if(Math.abs($3.clientWidth-$2.clientWidth)<24||Math.abs($3.clientHeight-$2.clientHeight)<24){
$2=$3
}};LzScreenKernel.width=$2.clientWidth;LzScreenKernel.height=$2.clientHeight
}else{
if(window.document.body){
var $2=window.document.body;LzScreenKernel.width=$2.clientWidth;LzScreenKernel.height=$2.clientHeight
}}}};if(LzScreenKernel.__callback){
LzScreenKernel.__scope[LzScreenKernel.__callback]({width:LzScreenKernel.width,height:LzScreenKernel.height})
}},__init:function(){
lz.embed.attachEventHandler(window.top,"resize",LzScreenKernel,"__resizeEvent")
},__callback:null,__scope:null,setCallback:function($1,$2){
this.__scope=$1;this.__callback=$2;this.__init();this.__resizeEvent()
}};Class.make("LzContextMenuKernel",null,["$lzsc$initialize",function($1){
this.owner=$1;this.__LZmousedowndel=new LzDelegate(this,"__hide")
},"owner",null,"showbuiltins",false,"_delegate",null,"__LZmousedowndel",null,"setDelegate",function($1){
this._delegate=$1
},"addItem",function($1){
if(LzMouseKernel.__showncontextmenu===this){
this.__hide();this.__show(false)
}},"hideBuiltInItems",function(){
this.showbuiltins=false
},"showBuiltInItems",function(){
this.showbuiltins=true
},"clearItems",function(){
if(LzMouseKernel.__showncontextmenu===this){
this.__hide();this.__show(false)
}},"__show",function($1){
switch(arguments.length){
case 0:
$1=true;

};var $2=document.getElementById("lzcontextmenu");if(!$2){
$2=document.createElement("div");lz.embed.__setAttr($2,"id","lzcontextmenu");lz.embed.__setAttr($2,"style","display: none");document.body.appendChild($2)
};var $3=this.owner;if($1&&$3.onmenuopen.ready){
$3.onmenuopen.sendEvent($3)
};var $4="";var $5=0;var $6=$3.getItems();var $7={};for(var $8=0;$8<$6.length;$8++){
var $9=$6[$8].kernel;var $10=$9.cmenuitem;if($10.visible!=true){
continue
};if($10.separatorBefore){
$4+="<hr/>"
};var $11=$10.caption;if($11 in $7){
continue
};$7[$11]=true;$5+=1;if($10.enabled){
$4+='<a href="" onmousedown="javascript:LzMouseKernel.__showncontextmenu.__select('+$8+');return false;">'+$11+"</a>"
}else{
$4+=$11
}};LzMouseKernel.__showncontextmenu=this;$2.innerHTML=$4;if($1){
$2.style.left=LzMouseKernel.__x+"px";$2.style.top=LzMouseKernel.__y+"px"
};if($5){
$2.style.display="block"
};this.__LZmousedowndel.register(lz.GlobalMouse,"onmousedown");var $12=this._delegate;if($1&&$12!=null){
$12.execute($3)
}},"__hide",function($1){
var $2=document.getElementById("lzcontextmenu");if(!$2){
return
};$2.style.display="none";this.__LZmousedowndel.unregisterAll();LzMouseKernel.__showncontextmenu=null
},"__select",function($1){
this.__hide();var $2=this.owner.getItems();if($2[$1]){
$2[$1].kernel.__select()
}}],null);Class.make("LzContextMenuItemKernel",null,["$lzsc$initialize",function($1,$2,$3){
this.owner=$1;this.cmenuitem={visible:true,enabled:true,separatorBefore:false,caption:$2};this.setDelegate($3)
},"owner",null,"cmenuitem",null,"_delegate",null,"setDelegate",function($1){
this._delegate=$1
},"setCaption",function($1){
this.cmenuitem.caption=$1
},"getCaption",function(){
return this.cmenuitem.caption
},"setEnabled",function($1){
this.cmenuitem.enabled=$1
},"setSeparatorBefore",function($1){
this.cmenuitem.separatorBefore=$1
},"setVisible",function($1){
this.cmenuitem.visible=$1
},"__select",function(){
var $1=this.owner;var $2=this._delegate;if($2!=null){
if($2 instanceof LzDelegate){
$2.execute($1)
}else{
if(typeof $2=="function"){
$2()
}else{

}}};if($1.onselect.ready){
$1.onselect.sendEvent($1)
}}],null);if(LzSprite.prototype.quirks.ie_timer_closure){
(function($1){
window.setTimeout=$1(window.setTimeout);window.setInterval=$1(window.setInterval)
})(function(f){
return( function(c,$1){
var a=Array.prototype.slice.call(arguments,2);if(typeof c!="function"){
c=new Function(c)
};return( f(function(){
c.apply(this,a)
},$1))
})
})
};var LzTimeKernel={setTimeout:function(){
return window.setTimeout.apply(window,arguments)
},setInterval:function(){
return window.setInterval.apply(window,arguments)
},clearTimeout:function($1){
return window.clearTimeout($1)
},clearInterval:function($1){
return window.clearInterval($1)
},startTime:new Date().valueOf(),getTimer:function(){
return new Date().valueOf()-LzTimeKernel.startTime
}};Class.make("LzView",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"__LZlayout",void 0,"__LZstoredbounds",void 0,"__movecounter",0,"__mousecache",null,"playing",false,"_visible",void 0,"$lzc$set_visible",function($1){
if(this._visible==$1){
return
};this._visible=$1;if($1){
var $2="visible"
}else{
if($1==null){
var $2="collapse"
}else{
var $2="hidden"
}};this.visibility=$2;if(this.onvisibility.ready){
this.onvisibility.sendEvent(this.visibility)
};this.__LZupdateShown()
},"onaddsubview",LzDeclaredEvent,"onblur",LzDeclaredEvent,"onclick",LzDeclaredEvent,"onclickable",LzDeclaredEvent,"onfocus",LzDeclaredEvent,"onframe",LzDeclaredEvent,"onheight",LzDeclaredEvent,"onimload",LzDeclaredEvent,"onkeyup",LzDeclaredEvent,"onkeydown",LzDeclaredEvent,"onlastframe",LzDeclaredEvent,"onload",LzDeclaredEvent,"onframesloadratio",LzDeclaredEvent,"onloadratio",LzDeclaredEvent,"onerror",LzDeclaredEvent,"ontimeout",LzDeclaredEvent,"onmousedown",LzDeclaredEvent,"onmouseout",LzDeclaredEvent,"onmouseover",LzDeclaredEvent,"onmousetrackover",LzDeclaredEvent,"onmousetrackup",LzDeclaredEvent,"onmousetrackout",LzDeclaredEvent,"onmouseup",LzDeclaredEvent,"onmousedragin",LzDeclaredEvent,"onmousedragout",LzDeclaredEvent,"onmouseupoutside",LzDeclaredEvent,"onopacity",LzDeclaredEvent,"onplay",LzDeclaredEvent,"onremovesubview",LzDeclaredEvent,"onresource",LzDeclaredEvent,"onresourceheight",LzDeclaredEvent,"onresourcewidth",LzDeclaredEvent,"onrotation",LzDeclaredEvent,"onstop",LzDeclaredEvent,"ontotalframes",LzDeclaredEvent,"onunstretchedheight",LzDeclaredEvent,"onunstretchedwidth",LzDeclaredEvent,"onvisible",LzDeclaredEvent,"onvisibility",LzDeclaredEvent,"onwidth",LzDeclaredEvent,"onx",LzDeclaredEvent,"onxoffset",LzDeclaredEvent,"ony",LzDeclaredEvent,"onyoffset",LzDeclaredEvent,"ondblclick",LzDeclaredEvent,"DOUBLE_CLICK_TIME",500,"capabilities",LzSprite.prototype.capabilities,"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1?$1:canvas,$2);this.__LZdelayedSetters=LzView.__LZdelayedSetters;this.earlySetters=LzView.earlySetters;var $3=this.immediateparent;var $4=this.immediateparent;this.mask=$3.mask;this.__makeSprite($2);if($2["width"]!=null||this.__LZhasConstraint("width")){
this.hassetwidth=true;this.__LZcheckwidth=false
};if($2["height"]!=null||this.__LZhasConstraint("height")){
this.hassetheight=true;this.__LZcheckheight=false
};if($2["clip"]){
this.clip=$2.clip;this.makeMasked()
};if($2["stretches"]!=null){
this.$lzc$set_stretches($2.stretches);$2.stretches=LzNode._ignoreAttribute
};if($2["resource"]!=null){
this.$lzc$set_resource($2.resource);$2.resource=LzNode._ignoreAttribute
}},"__spriteAttribute",function($1,$2){
if(this[$1]){
if(!this.__LZdeleted){
var $lzsc$1195580387="$lzc$set_"+$1;if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$lzsc$1195580387]):this[$lzsc$1195580387] instanceof Function){
this[$lzsc$1195580387]($2)
}else{
this[$1]=$2;var $lzsc$1425122184=this["on"+$1];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$1425122184):$lzsc$1425122184 instanceof LzEvent){
if($lzsc$1425122184.ready){
$lzsc$1425122184.sendEvent($2)
}}}}}},"__makeSprite",function($1){
this.sprite=new LzSprite(this,false)
},"init",function(){
if(this.sprite){
this.sprite.init(this.visible)
}},"addSubview",function($1){
if($1.addedToParent){
return
};if(this.sprite){
this.sprite.addChildSprite($1.sprite)
};if(this.subviews.length==0){
this.subviews=[]
};this.subviews.push($1);$1.addedToParent=true;if(this.__LZcheckwidth){
this.__LZcheckwidthFunction($1)
};if(this.__LZcheckheight){
this.__LZcheckheightFunction($1)
};if(this.onaddsubview.ready){
this.onaddsubview.sendEvent($1)
}},"__LZinstantiationDone",function(){
var $1=this.immediateparent;if($1){
$1.addSubview(this)
};(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZinstantiationDone"]:this.nextMethod(arguments.callee,"__LZinstantiationDone")).apply(this,arguments)
},"mask",void 0,"focusable",false,"focustrap",void 0,"clip",false,"$lzc$set_clip",-1,"align","left","$lzc$set_align",function($1){
var $2;$2=function($1){
switch($1){
case "center":
return "__LZalignCenter";
case "right":
return "__LZalignRight";
case "left":
return null;
default:


}};if(this.align==$1){
return
};var $3=$2(this.align);var $4=$2($1);if($3!=null){
this.releaseConstraintMethod($3)
};if($4!=null){
this.applyConstraintMethod($4,[this.immediateparent,"width",this,"width"])
}else{
this.$lzc$set_x(0)
};this.align=$1
},"valign","top","$lzc$set_valign",function(valign){
var $1;$1=function($1){
switch($1){
case "middle":
return "__LZvalignMiddle";
case "bottom":
return "__LZvalignBottom";
case "top":
return null;
default:


}};if(this.valign==valign){
return
};var $2=$1(this.valign);var $3=$1(valign);if($2!=null){
this.releaseConstraintMethod($2)
};if($3!=null){
this.applyConstraintMethod($3,[this.immediateparent,"height",this,"height"])
}else{
this.$lzc$set_y(0)
};this.valign=valign
},"source",void 0,"$lzc$set_source",function($1){
this.setSource($1)
},"clickregion",void 0,"$lzc$set_clickregion",function($1){
if(this.capabilities.clickregion){
this.sprite.setClickRegion($1)
}else{

};this.clickregion=$1
},"cursor",void 0,"fgcolor",0,"onfgcolor",LzDeclaredEvent,"$lzc$set_fgcolor",function($1){
if($1!=null&&isNaN($1)){
$1=this.acceptTypeValue("color",$1)
};this.sprite.setColor($1);this.fgcolor=$1;if(this.onfgcolor.ready){
this.onfgcolor.sendEvent($1)
}},"font",void 0,"fontname",void 0,"$lzc$set_font",function($1){
this.font=$1;this.fontname=$1;if(!this.sprite){
return
};this.sprite.setFontName($1,null)
},"fontstyle",void 0,"fontsize",void 0,"stretches","none","$lzc$set_stretches",function($1){
if(!($1=="none"||$1=="both"||$1=="width"||$1=="height")){
var $2=$1==null?"both":($1=="x"?"width":($1=="y"?"height":"none"));if($debug&&$2!="none"){
Debug.info("%w.%s(%w) is deprecated.  Use %w.%s(%w) instead.",this,arguments.callee,$1,this,arguments.callee,$2)
};$1=$2
}else{
if(this.stretches==$1){
return
}};this.stretches=$1;this.sprite.stretchResource($1);if($1=="width"||$1=="both"){
this._setrescwidth=true;this.__LZcheckwidth=true;this.reevaluateSize("width")
};if($1=="height"||$1=="both"){
this._setrescheight=true;this.__LZcheckheight=true;this.reevaluateSize("height")
}},"layout",void 0,"$lzc$set_layout",function($1){
this.layout=$1;if(!this.isinited){
this.__LZstoreAttr($1,"layout");return
};var $2=$1["class"];if($2==null){
$2="simplelayout"
};if(this.__LZlayout){
this.__LZlayout.destroy()
};if($2!="none"){
var $3={};for(var $4 in $1){
if($4!="class"){
$3[$4]=$1[$4]
}};if($2=="null"){
this.__LZlayout=null;return
};this.__LZlayout=new (lz[$2])(this,$3)
}},"aaactive",void 0,"$lzc$set_aaactive",function($1){
if(this.capabilities.accessibility){
this.aaactive=$1;this.sprite.setAAActive($1)
}else{

}},"aaname",void 0,"$lzc$set_aaname",function($1){
if(this.capabilities.accessibility){
this.aaname=$1;this.sprite.setAAName($1)
}else{

}},"aadescription",void 0,"$lzc$set_aadescription",function($1){
if(this.capabilities.accessibility){
this.aadescription=$1;this.sprite.setAADescription($1)
}else{

}},"aatabindex",void 0,"$lzc$set_aatabindex",function($1){
if(this.capabilities.accessibility){
this.aatabindex=$1;this.sprite.setAATabIndex($1)
}else{

}},"aasilent",void 0,"$lzc$set_aasilent",function($1){
if(this.capabilities.accessibility){
this.aasilent=$1;this.sprite.setAASilent($1)
}else{

}},"sprite",null,"visible",true,"visibility","collapse","$lzc$set_visibility",function($1){
if(this.visibility==$1){
return
};this.visibility=$1;if(this.onvisibility.ready){
this.onvisibility.sendEvent($1)
};this.__LZupdateShown()
},"__LZvizO",true,"__LZvizLoad",true,"__LZvizDat",true,"opacity",1,"$lzc$set_opacity",function($1){
if(this.capabilities.opacity){
this.sprite.setOpacity($1)
}else{

};this.opacity=$1;if(this.onopacity.ready){
this.onopacity.sendEvent($1)
};var $2=this.__LZvizO;var $3=$1!=0;if($2!=$3){
this.__LZvizO=$3;this.__LZupdateShown()
}},"$lzc$set_alpha",function($1){
this.$lzc$set_opacity($1)
},"bgcolor",null,"onbgcolor",LzDeclaredEvent,"$lzc$set_bgcolor",function($1){
if($1!=null&&isNaN($1)){
$1=this.acceptTypeValue("color",$1)
};this.sprite.setBGColor($1);this.bgcolor=$1;if(this.onbgcolor.ready){
this.onbgcolor.sendEvent($1)
}},"x",0,"__set_x_memo",void 0,"$lzc$set_x",function($1){
this.x=$1;if(this.__set_x_memo===$1){
if(this.onx.ready){
this.onx.sendEvent(this.x)
};return
};this.__set_x_memo=$1;if(this.__LZhasoffset){
if(this.capabilities.rotation){
$1-=this.xoffset*this.__LZrcos-this.yoffset*this.__LZrsin
}else{
$1-=this.xoffset
}};if(this.pixellock){
$1=Math.floor($1)
};this.sprite.setX($1);var $2=this.immediateparent;if($2.__LZcheckwidth){
$2.__LZcheckwidthFunction(this)
};if(this.onx.ready){
this.onx.sendEvent(this.x)
}},"y",0,"__set_y_memo",void 0,"$lzc$set_y",function($1){
this.y=$1;if(this.__set_y_memo===$1){
if(this.onx.ready){
this.onx.sendEvent(this.x)
};return
};this.__set_y_memo=$1;if(this.__LZhasoffset){
if(this.capabilities.rotation){
$1-=this.xoffset*this.__LZrsin+this.yoffset*this.__LZrcos
}else{
$1-=this.yoffset
}};if(this.pixellock){
$1=Math.floor($1)
};this.sprite.setY($1);var $2=this.immediateparent;if($2.__LZcheckheight){
$2.__LZcheckheightFunction(this)
};if(this.ony.ready){
this.ony.sendEvent(this.y)
}},"rotation",0,"$lzc$set_rotation",function($1){
if(this.capabilities.rotation){
this.sprite.setRotation($1)
}else{

};this.rotation=$1;var $2=Math.PI/180*this.rotation;this.__LZrsin=Math.sin($2);this.__LZrcos=Math.cos($2);if(this.onrotation.ready){
this.onrotation.sendEvent($1)
};if(this.__LZhasoffset){
this.__set_x_memo=void 0;this.$lzc$set_x(this.x);this.__set_y_memo=void 0;this.$lzc$set_y(this.y)
};var $3=this.immediateparent;if($3.__LZcheckwidth){
$3.__LZcheckwidthFunction(this)
};if($3.__LZcheckheight){
$3.__LZcheckheightFunction(this)
}},"width",0,"__set_width_memo",void 0,"$lzc$set_width",function($1){
if($1!=null){
this.hassetwidth=true;this.width=$1
}else{
this.hassetwidth=false
};if(this.__set_width_memo===$1){
if(this.onwidth.ready){
this.onwidth.sendEvent(this.width)
};return
};this.__set_width_memo=$1;if($1==null){
this.__LZcheckwidth=true;if(this._setrescwidth){
this.unstretchedwidth=null;this._xscale=1
};this.reevaluateSize("width");return
};if(this.pixellock){
$1=Math.floor($1)
};if(this._setrescwidth){
var $2=this.unstretchedwidth==0?100:$1/this.unstretchedwidth;this._xscale=$2
}else{
this.__LZcheckwidth=false
};this.sprite.setWidth($1);var $3=this.immediateparent;if($3&&$3.__LZcheckwidth){
$3.__LZcheckwidthFunction(this)
};if(this.onwidth.ready){
this.onwidth.sendEvent(this.width)
}},"height",0,"__set_height_memo",void 0,"$lzc$set_height",function($1){
if($1!=null){
this.hassetheight=true;this.height=$1
}else{
this.hassetheight=false
};if(this.__set_height_memo===$1){
if(this.onheight.ready){
this.onheight.sendEvent(this.height)
};return
};this.__set_height_memo=$1;if($1==null){
this.__LZcheckheight=true;if(this._setrescheight){
this.unstretchedheight=null;this._yscale=1
};this.reevaluateSize("height");return
};if(this.pixellock){
$1=Math.floor($1)
};if(this._setrescheight){
this._yscale=this.unstretchedheight==0?100:$1/this.unstretchedheight
}else{
this.__LZcheckheight=false
};this.sprite.setHeight($1);var $2=this.immediateparent;if($2&&$2.__LZcheckheight){
$2.__LZcheckheightFunction(this)
};if(this.onheight.ready){
this.onheight.sendEvent(this.height)
}},"unstretchedwidth",0,"unstretchedheight",0,"subviews",[],"__LZclickregion","LzMouseEvents","xoffset",0,"$lzc$set_xoffset",function($1){
this.__LZhasoffset=$1!=0;this.xoffset=$1;this.__set_x_memo=void 0;this.$lzc$set_x(this.x);this.__set_y_memo=void 0;this.$lzc$set_y(this.y);if(this.onxoffset.ready){
this.onxoffset.sendEvent($1)
}},"yoffset",0,"$lzc$set_yoffset",function($1){
this.__LZhasoffset=$1!=0;this.yoffset=$1;this.__set_x_memo=void 0;this.$lzc$set_x(this.x);this.__set_y_memo=void 0;this.$lzc$set_y(this.y);if(this.onyoffset.ready){
this.onyoffset.sendEvent($1)
}},"__LZrsin",0,"__LZrcos",1,"__LZcaloffset",false,"_xscale",1,"_yscale",1,"totalframes",1,"frame",1,"$lzc$set_frame",function($1){
this.frame=$1;this.stop($1);if(this.onframe.ready){
this.onframe.sendEvent($1)
}},"framesloadratio",0,"loadratio",0,"hassetheight",false,"hassetwidth",false,"__LZisView",true,"addedToParent",null,"checkPlayStatusDel",null,"masked",false,"pixellock",null,"setButtonSize",null,"clickable",false,"$lzc$set_clickable",function($1){
this.sprite.setClickable($1);this.clickable=$1;if(this.onclickable.ready){
this.onclickable.sendEvent($1)
}},"showhandcursor",null,"$lzc$set_showhandcursor",function($1){
this.showhandcursor=$1;this.sprite.setShowHandCursor($1)
},"updatePlayDel",null,"resource",null,"$lzc$set_resource",function($1){
if($1==null||$1==this._resource){
return
};this.resource=this._resource=$1;this.sprite.setResource($1)
},"resourcewidth",0,"resourceheight",0,"__LZbgColorO",null,"__LZbgRef",null,"__LZbuttonRef",null,"__LZcheckwidth",true,"__LZcheckheight",true,"__LZhasoffset",null,"__LZisBackgrounded",null,"__LZmaskClip",null,"__LZmovieClipRef",null,"__LZoutlieheight",null,"__LZoutliewidth",null,"__LZsubUniqueNum",null,"setLayout",function($1){
this.$lzc$set_layout($1)
},"setFontName",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};this.$lzc$set_font($1)
},"_setrescwidth",false,"_setrescheight",false,"searchSubviews",function($1,$2){
var $3=this.subviews.concat();while($3.length>0){
var $4=$3;$3=new Array();for(var $5=$4.length-1;$5>=0;$5--){
var $6=$4[$5];if($6[$1]==$2){
return $6
};var $7=$6.subviews;for(var $8=$7.length-1;$8>=0;$8--){
$3.push($7[$8])
}}};return null
},"layouts",null,"releaseLayouts",function(){
if(this.layouts){
for(var $1=this.layouts.length-1;$1>=0;$1--){
this.layouts[$1].releaseLayout()
}}},"_resource",null,"setResource",function($1){
this.$lzc$set_resource($1)
},"resourceload",function($1){
if("resource" in $1){
this.resource=$1.resource;if(this.onresource.ready){
this.onresource.sendEvent($1.resource)
}};if(this.resourcewidth!=$1.width){
if("width" in $1){
this.resourcewidth=$1.width;if(this.onresourcewidth.ready){
this.onresourcewidth.sendEvent($1.width)
}};if(!this.hassetwidth&&this.resourcewidth!=this.width||this._setrescwidth&&this.unstretchedwidth!=this.resourcewidth){
this.updateWidth(this.resourcewidth)
}};if(this.resourceheight!=$1.height){
if("height" in $1){
this.resourceheight=$1.height;if(this.onresourceheight.ready){
this.onresourceheight.sendEvent($1.height)
}};if(!this.hassetheight&&this.resourceheight!=this.height||this._setrescheight&&this.unstretchedheight!=this.resourceheight){
this.updateHeight(this.resourceheight)
}};if($1.skiponload!=true){
if(this.onload.ready){
this.onload.sendEvent(this)
}}},"resourceloaderror",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.resourcewidth=0;this.resourceheight=0;if(this.onresourcewidth.ready){
this.onresourcewidth.sendEvent(0)
};if(this.onresourceheight.ready){
this.onresourceheight.sendEvent(0)
};this.reevaluateSize();if(this.onerror.ready){
this.onerror.sendEvent($1)
}},"resourceloadtimeout",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.resourcewidth=0;this.resourceheight=0;if(this.onresourcewidth.ready){
this.onresourcewidth.sendEvent(0)
};if(this.onresourceheight.ready){
this.onresourceheight.sendEvent(0)
};this.reevaluateSize();if(this.ontimeout.ready){
this.ontimeout.sendEvent($1)
}},"resourceevent",function($1,$2,$3,$4){
switch(arguments.length){
case 2:
$3=false;
case 3:
$4=false;

};var $5=$4==true||$3==true||this[$1]!=$2;if($3!=true){
this[$1]=$2
};if($5){
var $6=this["on"+$1];if($6.ready){
$6.sendEvent($2)
}}},"destroy",function(){
if(this.__LZdeleted){
return
};if(this.sprite){
this.sprite.predestroy()
};var $1=this.immediateparent;if(this.addedToParent){
var $2=$1.subviews;if($2!=null){
for(var $3=$2.length-1;$3>=0;$3--){
if($2[$3]==this){
$2.splice($3,1);break
}}}};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this);if(this.sprite){
this.sprite.destroy()
};this.$lzc$set_visible(false);var $1=this.immediateparent;if(this.addedToParent){
if($1["__LZoutliewidth"]==this){
$1.__LZoutliewidth=null
};if($1["__LZoutlieheight"]==this){
$1.__LZoutlieheight=null
};if($1.onremovesubview.ready){
$1.onremovesubview.sendEvent(this)
}}},"setVisible",function($1){
this.$lzc$set_visible($1)
},"setVisibility",function($1){
this.$lzc$set_visibility($1)
},"__LZupdateShown",function(){
if(this.visibility=="collapse"){
var $1=this.__LZvizO&&this.__LZvizDat&&this.__LZvizLoad
}else{
var $1=this.visibility=="visible"
};if($1!=this.visible){
this.visible=$1;if(this.sprite){
this.sprite.setVisible($1)
};var $2=this.immediateparent;if($2&&$2.__LZcheckwidth){
$2.__LZcheckwidthFunction(this)
};if($2&&$2.__LZcheckheight){
$2.__LZcheckheightFunction(this)
};if(this.onvisible.ready){
this.onvisible.sendEvent($1)
}}},"setWidth",function($1){
this.$lzc$set_width($1)
},"setHeight",function($1){
this.$lzc$set_height($1)
},"setOpacity",function($1){
this.$lzc$set_opacity($1)
},"setX",function($1){
this.$lzc$set_x($1)
},"setY",function($1){
this.$lzc$set_y($1)
},"setRotation",function($1){
this.$lzc$set_rotation($1)
},"setAlign",function($1){
this.$lzc$set_align($1)
},"__LZalignCenter",function($1){
switch(arguments.length){
case 0:
$1=null;

};var $2=this.immediateparent;this.$lzc$set_x($2.width/2-this.width/2)
},"__LZalignRight",function($1){
switch(arguments.length){
case 0:
$1=null;

};var $2=this.immediateparent;this.$lzc$set_x($2.width-this.width)
},"setXOffset",function($1){
this.$lzc$set_xoffset($1)
},"setYOffset",function($1){
this.$lzc$set_yoffset($1)
},"getBounds",function(){
var $1=[-this.xoffset,-this.yoffset,this.width-this.xoffset,-this.yoffset,-this.xoffset,this.height-this.yoffset,this.width-this.xoffset,this.height-this.yoffset,this.rotation,this.x,this.y];if(this.__LZstoredbounds){
var $2=$1.length-1;while($1[$2]==LzView.__LZlastmtrix[$2]){
if($2--==0){
return this.__LZstoredbounds
}}};var $3={};for(var $2=0;$2<8;$2+=2){
var $4=$1[$2];var $5=$1[$2+1];var $6=$4*this.__LZrcos-$5*this.__LZrsin;var $7=$4*this.__LZrsin+$5*this.__LZrcos;if($3.xoffset==null||$3.xoffset>$6){
$3.xoffset=$6
};if($3.yoffset==null||$3.yoffset>$7){
$3.yoffset=$7
};if($3.width==null||$3.width<$6){
$3.width=$6
};if($3.height==null||$3.height<$7){
$3.height=$7
}};$3.width-=$3.xoffset;$3.height-=$3.yoffset;$3.x=this.x+$3.xoffset;$3.y=this.y+$3.yoffset;this.__LZstoredbounds=$3;LzView.__LZlastmtrix=$1;return $3
},"$lzc$getBounds_dependencies",function($1,$2){
return [$2,"rotation",$2,"x",$2,"y",$2,"width",$2,"height"]
},"setValign",function($1){
this.$lzc$set_valign($1)
},"__LZvalignMiddle",function($1){
switch(arguments.length){
case 0:
$1=null;

};var $2=this.immediateparent;this.$lzc$set_y($2.height/2-this.height/2)
},"__LZvalignBottom",function($1){
switch(arguments.length){
case 0:
$1=null;

};var $2=this.immediateparent;this.$lzc$set_y($2.height-this.height)
},"setColor",function($1){
this.$lzc$set_fgcolor($1)
},"getColor",function(){
return this.sprite.getColor()
},"setColorTransform",function($1){
if(this.capabilities.colortransform){
this.sprite.setColorTransform($1)
}else{

}},"getColorTransform",function(){
if(this.capabilities.colortransform){
return this.sprite.getColorTransform()
}else{

}},"__LZcheckSize",function($1,$2,$3){
if($1.addedToParent){
if($1.__LZhasoffset||$1.rotation!=0){
var $4=$1.getBounds()
}else{
var $4=$1
};var $5=$4[$3]+$4[$2];var $6=this["_setresc"+$2]?this["unstretched"+$2]:this[$2];if($5>$6&&$1.visible){
this["__LZoutlie"+$2]=$1;if($2=="width"){
this.updateWidth($5)
}else{
this.updateHeight($5)
}}else{
if(this["__LZoutlie"+$2]==$1&&($5<$6||!$1.visible)){
this.reevaluateSize($2)
}}}},"__LZcheckwidthFunction",function($1){
this.__LZcheckSize($1,"width","x")
},"__LZcheckheightFunction",function($1){
this.__LZcheckSize($1,"height","y")
},"measureSize",function($1){
var $2=this["resource"+$1];for(var $3=this.subviews.length-1;$3>=0;$3--){
var $4=this.subviews[$3];if($4.visible){
if($4.__LZhasoffset||$4.rotation!=0){
var $5=$4.getBounds()
}else{
var $5=$4
};var $6=$5[$1=="width"?"x":"y"]+$5[$1];if($6>$2){
$2=$6
}}};return $2
},"measureWidth",function(){
return this.measureSize("width")
},"measureHeight",function(){
return this.measureSize("height")
},"updateSize",function($1,$2){
if($1=="width"){
this.updateWidth($2)
}else{
this.updateHeight($2)
}},"updateWidth",function($1){
if(this._setrescwidth){
this.unstretchedwidth=$1;if(this.hassetwidth){
var $2=this.width/$1;this._xscale=$2
};if(this.onunstretchedwidth.ready){
this.onunstretchedwidth.sendEvent($1)
}};if(!this.hassetwidth){
this.width=$1;this.sprite.setWidth($1);if(this.onwidth.ready){
this.onwidth.sendEvent($1)
};var $3=this.immediateparent;if($3.__LZcheckwidth){
$3.__LZcheckwidthFunction(this)
}}},"updateHeight",function($1){
if(this._setrescheight){
this.unstretchedheight=$1;if(this.hassetheight){
var $2=this.height/$1;this._yscale=$2
};if(this.onunstretchedheight){
if(this.onunstretchedheight.ready){
this.onunstretchedheight.sendEvent($1)
}}};if(!this.hassetheight){
this.height=$1;this.sprite.setHeight($1);if(this.onheight.ready){
this.onheight.sendEvent($1)
};var $3=this.immediateparent;if($3.__LZcheckheight){
$3.__LZcheckheightFunction(this)
}}},"reevaluateSize",function($1){
switch(arguments.length){
case 0:
$1=null;

};if($1==null){
var $2="height";this.reevaluateSize("width")
}else{
var $2=$1
};if(this["hasset"+$2]&&!this["_setresc"+$2]){
return
};var $3=this["_setresc"+$2]?this["unstretched"+$2]:this[$2];var $4=this["resource"+$2]||0;this["__LZoutlie"+$2]=this;for(var $5=this.subviews.length-1;$5>=0;$5--){
var $6=this.subviews[$5];if($6.__LZhasoffset||$6.rotation!=0){
var $7=$6.getBounds();var $8=$7[$2=="width"?"x":"y"]+$7[$2]
}else{
var $8=$6[$2=="width"?"x":"y"]+$6[$2]
};if($6.visible&&$8>$4){
$4=$8;this["__LZoutlie"+$2]=$6
}};if($3!=$4){
if($2=="width"){
this.updateWidth($4)
}else{
this.updateHeight($4)
}}},"updateResourceSize",function(){
this.sprite.updateResourceSize();this.reevaluateSize()
},"setAttributeRelative",function($1,$2){
var $3=this.getLinkage($2);var $4=$2[$1];if($1=="x"||$1=="y"){
$3.update($1);var $lzsc$890515683=($4-$3.offset[$1])/$3.scale[$1];if(!this.__LZdeleted){
var $lzsc$780794658="$lzc$set_"+$1;if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$lzsc$780794658]):this[$lzsc$780794658] instanceof Function){
this[$lzsc$780794658]($lzsc$890515683)
}else{
this[$1]=$lzsc$890515683;var $lzsc$707269429=this["on"+$1];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$707269429):$lzsc$707269429 instanceof LzEvent){
if($lzsc$707269429.ready){
$lzsc$707269429.sendEvent($lzsc$890515683)
}}}}}else{
if($1=="width"||$1=="height"){
var $5=$1=="width"?"x":"y";$3.update($5);var $lzsc$2089477647=$4/$3.scale[$5];if(!this.__LZdeleted){
var $lzsc$794449134="$lzc$set_"+$1;if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$lzsc$794449134]):this[$lzsc$794449134] instanceof Function){
this[$lzsc$794449134]($lzsc$2089477647)
}else{
this[$1]=$lzsc$2089477647;var $lzsc$1394945061=this["on"+$1];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$1394945061):$lzsc$1394945061 instanceof LzEvent){
if($lzsc$1394945061.ready){
$lzsc$1394945061.sendEvent($lzsc$2089477647)
}}}}}else{

}}},"$lzc$setAttributeRelative_dependencies",function($1,$2,$3,$4){
var $5=$1.getLinkage($4);var $6=2;var $7=[];if($3=="width"){
var $8="x"
}else{
if($3=="height"){
var $8="y"
}else{
var $8=$3
}};var $9=$8=="x"?"width":"height";while($6){
if($6==2){
var $10=$5.uplinkArray
}else{
var $10=$5.downlinkArray
};$6--;for(var $11=$10.length-1;$11>=0;$11--){
$7.push($10[$11],$8);if($7["_setresc"+$9]){
$7.push([$10[$11],$9])
}}};return $7
},"getAttributeRelative",function($1,$2){
var $3=this.getLinkage($2);if($1=="x"||$1=="y"){
$3.update($1);return $3.offset[$1]+$3.scale[$1]*this[$1]
}else{
if($1=="width"||$1=="height"){
var $4=$1=="width"?"x":"y";$3.update($4);return $3.scale[$4]*this[$1]
}else{

}}},"$lzc$getAttributeRelative_dependencies",function($1,$2,$3,$4){
var $5=$2.getLinkage($4);var $6=2;var $7=[$2,$3];if($3=="width"){
var $8="x"
}else{
if($3=="height"){
var $8="y"
}else{
var $8=$3
}};var $9=$8=="x"?"width":"height";while($6){
if($6==2){
var $10=$5.uplinkArray
}else{
var $10=$5.downlinkArray
};$6--;for(var $11=$10.length-1;$11>=0;$11--){
var $12=$10[$11];$7.push($12,$8);if($12["_setresc"+$9]){
$7.push($12,$9)
}}};return $7
},"__LZviewLinks",null,"getLinkage",function($1){
if(this.__LZviewLinks==null){
this.__LZviewLinks=new Object()
};var $2=$1.getUID();if(this.__LZviewLinks[$2]==null){
this.__LZviewLinks[$2]=new LzViewLinkage(this,$1)
};return this.__LZviewLinks[$2]
},"mouseevent",function($1){
if(this[$1]&&this[$1].ready){
this[$1].sendEvent(this)
}},"getMouse",function($1){
if(this.__movecounter!=lz.GlobalMouse.__movecounter||this.__mousecache==null){
this.__movecounter=lz.GlobalMouse.__movecounter;this.__mousecache=this.sprite.getMouse($1)
};if($1==null){
return this.__mousecache
};return this.__mousecache[$1]
},"$lzc$getMouse_dependencies",function(){
var $1=Array.prototype.slice.call(arguments,0);return [lz.Idle,"idle"]
},"containsPt",function($1,$2){
return this.height>=$2&&$2>=0&&(this.width>=$1&&$1>=0)
},"bringToFront",function(){
if(!this.sprite){
return
};this.sprite.bringToFront()
},"getDepthList",function(){
var $1=[];var $2=this.subviews;for(var $3=0;$3<$2.length;$3++){
$1[$3]=$2[$3]
};$1.sort(this.__zCompare);return $1
},"__zCompare",function($1,$2){
var $3=$1.sprite.getZ();var $4=$2.sprite.getZ();if($3<$4){
return -1
};if($3>$4){
return 1
};return 0
},"sendBehind",function($1){
return $1?this.sprite.sendBehind($1.sprite):false
},"sendInFrontOf",function($1){
return $1?this.sprite.sendInFrontOf($1.sprite):false
},"sendToBack",function(){
this.sprite.sendToBack()
},"setResourceNumber",function($1){
this.$lzc$set_frame($1)
},"stretchResource",function($1){
this.$lzc$set_stretches($1)
},"setBGColor",function($1){
this.$lzc$set_bgcolor($1)
},"setSource",function($1,$2,$3,$4){
switch(arguments.length){
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=null;

};this.sprite.setSource($1,$2,$3,$4)
},"unload",function(){
this._resource=null;this.sprite.unload()
},"makeMasked",function(){
this.sprite.setClip(true);this.masked=true;this.mask=this
},"removeMask",function(){
this.sprite.setClip(false);this.masked=false;this.mask=null
},"setClickable",function($1){
this.$lzc$set_clickable($1)
},"$lzc$set_cursor",function($1){
this.sprite.setCursor($1)
},"setCursor",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.$lzc$set_cursor($1)
},"$lzc$set_play",function($1){
if($1){
this.play()
}else{
this.stop()
}},"setPlay",function($1){
this.$lzc$set_play($1)
},"getMCRef",function(){
return this.sprite.getMCRef()
},"play",function($1,$2){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=false;

};this.sprite.play($1,$2)
},"stop",function($1,$2){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=false;

};this.sprite.stop($1,$2)
},"setVolume",function($1){
if(this.capabilities.audio){
this.sprite.setVolume($1)
}else{

}},"getVolume",function(){
if(this.capabilities.audio){
return this.sprite.getVolume()
}else{

};return NaN
},"setPan",function($1){
if(this.capabilities.audio){
this.sprite.setPan($1)
}else{

}},"getPan",function(){
if(this.capabilities.audio){
return this.sprite.getPan()
}else{

};return NaN
},"getZ",function(){
return this.sprite.getZ()
},"seek",function($1){
var $2=this.getMCRef();if($2.isaudio==true){
$2.seek($1,this.playing)
}else{
var $3=$1*canvas.framerate;if(this.playing){
this.play($3,true)
}else{
this.stop($3,true)
}}},"getCurrentTime",function(){
var $1=this.getMCRef();if($1.isaudio==true){
return $1.getCurrentTime()
}else{
return this.frame/canvas.framerate
}},"$lzc$getCurrentTime_dependencies",function($1,$2){
return [$2,"frame"]
},"getTotalTime",function(){
var $1=this.getMCRef();if($1.isaudio==true){
return $1.getTotalTime()
}else{
return this.totalframes/canvas.framerate
}},"$lzc$getTotalTime_dependencies",function($1,$2){
return [$2,"load"]
},"getID3",function(){
var $1=this.getMCRef();if($1.isaudio==true){
return $1.getID3()
};return null
},"setShowHandCursor",function($1){
this.$lzc$set_showhandcursor($1)
},"setAccessible",function($1){
if(this.capabilities.accessibility){
this.sprite.setAccessible($1)
}else{

}},"setAAActive",function($1){
this.$lzc$set_aaactive($1)
},"setAAName",function($1){
this.$lzc$set_aaname($1)
},"setAADescription",function($1){
this.$lzc$set_aadescription($1)
},"setAATabIndex",function($1){
this.$lzc$set_aatabindex($1)
},"setAASilent",function($1){
this.$lzc$set_aasilent($1)
},"shouldYieldFocus",function(){
return true
},"blurring",false,"getProxyURL",function($1){
switch(arguments.length){
case 0:
$1=null;

};var $2=this.proxyurl;if($2==null){
return null
}else{
if(typeof $2=="string"){
return $2
}else{
if(typeof $2=="function"){
return $2($1)
}else{

}}}},"__LZcheckProxyPolicy",function($1){
if(this.__proxypolicy!=null){
return this.__proxypolicy($1)
};var $2=LzView.__LZproxypolicies;for(var $3=$2.length-1;$3>=0;$3--){
var $4=$2[$3]($1);if($4!=null){
return $4
}};return canvas.proxied
},"setProxyPolicy",function($1){
this.__proxypolicy=$1
},"__proxypolicy",null,"setProxyURL",function($1){
this.$lzc$set_proxyurl($1)
},"proxyurl",function($1){
return canvas.getProxyURL($1)
},"$lzc$set_proxyurl",function($1){
this.proxyurl=$1
},"contextmenu",null,"$lzc$set_contextmenu",function($1){
this.contextmenu=$1;this.sprite.setContextMenu($1)
},"setContextMenu",function($1){
this.$lzc$set_contextmenu($1)
},"getContextMenu",function(){
return this.contextmenu
},"getNextSelection",function(){

},"getPrevSelection",function(){

},"cachebitmap",false,"$lzc$set_cachebitmap",function($1){
if($1!=this.cachebitmap){
this.cachebitmap=$1;if(this.capabilities.bitmapcaching){
this.sprite.setBitmapCache($1)
}else{

}}}],["tagname","view","attributes",new LzInheritedHash(LzNode.attributes),"__LZdelayedSetters",new LzInheritedHash(LzNode.__LZdelayedSetters),"earlySetters",new LzInheritedHash(LzNode.earlySetters),"__LZlastmtrix",[0,0,0,0,0,0,0,0,0,0,0],"__LZproxypolicies",[],"addProxyPolicy",function($1){
LzView.__LZproxypolicies.push($1)
},"removeProxyPolicy",function($1){
var $2=LzView.__LZproxypolicies;for(var $3=0;$3<$2.length;$3++){
if($2[$3]==$1){
LzView.__LZproxypolicies=$2.splice($3,1);return true
}};return false
},"__warnCapability",function($1,$2){
switch(arguments.length){
case 1:
$2="";

}}]);(function($1){
with($1){
with($1.prototype){
LzView.__LZdelayedSetters.layout="$lzc$set_layout";LzView.earlySetters.clickregion=7;LzView.earlySetters.stretches=8
}}})(LzView);lz[LzView.tagname]=LzView;Class.make("LzText",[LzFormatter,LzView],["maxlines",1,"selectable",false,"$lzc$set_selectable",function($1){
this.selectable=$1;var $2=this.sprite;$2.setSelectable($1)
},"antiAliasType","advanced","$lzc$set_antiAliasType",function($1){
if(this.capabilities.advancedfonts){
if($1=="normal"||$1=="advanced"){
this.antiAliasType=$1;var $2=this.sprite;$2.setAntiAliasType($1)
}else{

}}else{

}},"gridFit","pixel","$lzc$set_gridFit",function($1){
if(this.capabilities.advancedfonts){
if($1=="none"||$1=="pixel"||$1=="subpixel"){
this.gridFit=$1;var $2=this.sprite;$2.setGridFit($1)
}else{

}}else{

}},"sharpness",0,"$lzc$set_sharpness",function($1){
if(this.capabilities.advancedfonts){
if($1>=-400&&$1<=400){
this.sharpness=$1;var $2=this.sprite;$2.setSharpness($1)
}else{

}}else{

}},"thickness",0,"$lzc$set_thickness",function($1){
if(this.capabilities.advancedfonts){
if($1>=-200&&$1<=200){
this.thickness=$1;var $2=this.sprite;$2.setThickness($1)
}else{

}}else{

}},"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"sizeToHeight",void 0,"yscroll",void 0,"$lzc$set_yscroll",function($1){
var $2=this.sprite;$2.setYScroll($1);this.yscroll=$1;this.onyscroll.sendEvent($1)
},"xscroll",void 0,"$lzc$set_xscroll",function($1){
var $2=this.sprite;$2.setXScroll($1);this.xscroll=$1;this.onxscroll.sendEvent($1)
},"scrollheight",void 0,"ontext",LzDeclaredEvent,"ontextlink",LzDeclaredEvent,"onmaxlength",LzDeclaredEvent,"onpattern",LzDeclaredEvent,"onscroll",LzDeclaredEvent,"onmaxscroll",LzDeclaredEvent,"onhscroll",LzDeclaredEvent,"onmaxhscroll",LzDeclaredEvent,"scroll",0,"maxscroll",0,"hscroll",0,"maxhscroll",0,"getDefaultWidth",function(){
return 0
},"multiline",void 0,"resize",true,"$lzc$set_resize",function($1){
var $2=this.sprite;$2.setResize($1);this.resize=$1
},"text","","$lzc$set_text",function($1){
$1=String($1);if(this._textrecompute!=true&&$1==this.getText()){
if(this.ontext.ready){
this.ontext.sendEvent($1)
};return
};var $2=this.sprite;if(this.visible){
$2.setVisible(this.visible)
};if(this.maxlength!=null&&$1.length>this.maxlength){
$1=$1.substring(0,this.maxlength)
};$2.setText($1);this.text=$1;if(this.width==0||this.resize&&this.multiline==false){
var $3=this.getTextWidth();if($3!=this.width){
this.$lzc$set_width($3)
}};if(this.sizeToHeight){
var $4=$2.getTextfieldHeight();if($4>0){
this.$lzc$set_height($4)
}};if(this.ontext.ready){
this.ontext.sendEvent($1)
};this._textrecompute=false
},"_textrecompute",false,"colorstring","#000000","init",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).apply(this,arguments);if(this.sizeToHeight){
var $1=this.sprite;var $2=$1.getTextfieldHeight();if($2>0){
this.$lzc$set_height($2)
}}},"construct",function($1,$2){
this.multiline=("multiline" in $2)?$2.multiline:null;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.sizeToHeight=false;for(var $3 in LzText.fontArgToAttr){
var $4=LzText.fontArgToAttr[$3];if(!($3 in $2)){
$2[$3]=this.searchParents($4)[$4]
};this[$4]=$2[$3]
};var $5=this.sprite;$5.__initTextProperties($2);for(var $3 in LzText.fontArgToAttr){
delete $2[$3]
};this.yscroll=0;this.xscroll=0;this.resize=("resize" in $2)?!(!$2.resize):this.resize;this.$lzc$set_resize(this.resize);if($2["maxlength"]!=null){
this.$lzc$set_maxlength($2.maxlength)
};this.text=$2["text"]!=null?String($2.text):"";if(this.maxlength!=null&&this.text.length>this.maxlength){
this.text=this.text.substring(0,this.maxlength)
};this.$lzc$set_multiline(this.multiline);$5.setText(this.text);if(!this.hassetwidth){
if(this.multiline){
$2.width=this.parent.width
}else{
if(this.text!=null&&this.text!=""&&this.text.length>0){
$2.width=this.getTextWidth()
}else{
$2.width=this.getDefaultWidth()
}}}else{
this.$lzc$set_resize(false)
};if(!this.hassetheight){
this.sizeToHeight=true
}else{
if($2["height"]!=null){
this.$lzc$set_height($2.height)
}};this.scrollheight=this.height;if($2["pattern"]!=null){
this.$lzc$set_pattern($2.pattern)
};if(this.capabilities.advancedfonts){
if(!("antiAliasType" in $2)){
this.$lzc$set_antiAliasType("advanced")
};if(!("gridFit" in $2)){
this.$lzc$set_gridFit("subpixel")
}}},"__makeSprite",function($1){
this.sprite=new LzTextSprite(this,$1)
},"getMCRef",function(){
var $1=this.sprite;return $1.getMCRef()
},"maxlength",void 0,"$lzc$set_maxlength",function($1){
if($1==null||$1==""){
return
};var $2=this.sprite;$2.setMaxLength($1);this.maxlength=$1;if(this.onmaxlength.ready){
this.onmaxlength.sendEvent($1)
};var $3=this.getText();if($3&&$3.length>this.maxlength){
this._textrecompute=true;this.$lzc$set_text($3)
}},"pattern",void 0,"$lzc$set_pattern",function($1){
if($1==null||$1==""){
return
};var $2=this.sprite;$2.setPattern($1);this.pattern=$1;if(this.onpattern.ready){
this.onpattern.sendEvent($1)
}},"setResize",function($1){
this.$lzc$set_resize($1)
},"$lzc$set_width",function($1){
var $2=this.sprite;$2.setWidth($1);(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzc$set_width"]:this.nextMethod(arguments.callee,"$lzc$set_width")).apply(this,arguments);if(this.sizeToHeight){
var $3=$2.getTextfieldHeight();if($3>0){
this.$lzc$set_height($3)
}}},"addText",function($1){
this.$lzc$set_text(this.getText()+$1)
},"clearText",function(){
this.$lzc$set_text("")
},"setMaxLength",function($1){
this.$lzc$set_maxlength($1)
},"setPattern",function($1){
this.$lzc$set_pattern($1)
},"getTextWidth",function(){
var $1=this.sprite;return $1.getTextWidth()
},"$lzc$getTextWidth_dependencies",function($1,$2){
return [$2,"text"]
},"getTextHeight",function(){
var $1=this.sprite;return $1.getTextHeight()
},"$lzc$getTextHeight_dependencies",function($1,$2){
return [$2,"text"]
},"applyData",function($1){
if(null==$1){
this.clearText()
}else{
this.$lzc$set_text($1)
}},"toString",function(){
return "LzText: "+this.getText()
},"setScroll",function($1){
var $2=this.sprite;$2.setScroll($1)
},"getScroll",function(){
var $1=this.sprite;return $1.getScroll()
},"getMaxScroll",function(){
var $1=this.sprite;return $1.getMaxScroll()
},"$lzc$getMaxScroll_dependencies",function($1,$2){
return [$2,"maxscroll"]
},"getBottomScroll",function(){
var $1=this.sprite;return $1.getBottomScroll()
},"setXScroll",function($1){
this.$lzc$set_xscroll($1)
},"setYScroll",function($1){
this.$lzc$set_yscroll($1)
},"annotateAAimg",function($1){
if(typeof $1=="undefined"){
return
};if($1.length==0){
return
};var $2="";var $3=0;var $4=0;var $5;var $6="<img ";while(true){
$5=$1.indexOf($6,$3);if($5<0){
$2+=$1.substring($3);break
};$2+=$1.substring($3,$5+$6.length);$3=$5+$6.length;var $7={};$4=$3+this.parseImgAttributes($7,$1.substring($3));$2+=$1.substring($3,$4+1);if($7["alt"]!=null){
var $8=$7["alt"];$2+="[image "+$8+"]"
};$3=$4+1
};return $2
},"parseImgAttributes",function($1,$2){
var $3;var $4=0;var $5="attrname";var $6="attrval";var $7="whitespace";var $8="whitespace2";var $9=$7;var $10=$2.length;var $11;var $12;var $13;for($3=0;$3<$10;$3++){
$4=$3;var $14=$2.charAt($3);if($14==">"){
break
};if($9==$7){
if($14!=" "){
$9=$5;$11=$14
}}else{
if($9==$5){
if($14==" "||$14=="="){
$9=$8
}else{
$11+=$14
}}else{
if($9==$8){
if($14==" "||$14=="="){
continue
}else{
$9=$6;$13=$14;$12=""
}}else{
if($9==$6){
if($14!=$13){
$12+=$14
}else{
$9=$7;$1[$11]=$12
}}}}}};return $4
},"setText",function($1){
this.$lzc$set_text($1)
},"format",function($1){
var $2=Array.prototype.slice.call(arguments,1);this.$lzc$set_text(this.formatToString.apply(this,[$1].concat($2)))
},"addFormat",function($1){
var $2=Array.prototype.slice.call(arguments,1);this.$lzc$set_text(this.getText()+this.formatToString.apply(this,[$1].concat($2)))
},"updateMaxLines",function(){
var $1=Math.floor(this.height/(this.font.height-1));if($1!=this.maxlines){
this.maxlines=$1
}},"getText",function(){
return this.text
},"$lzc$getText_dependencies",function($1,$2){
return [$2,"text"]
},"escapeText",function($1){
var $2=$1==null?this.text:$1;var $3;for(var $4 in LzText.escapeChars){
while($2.indexOf($4)>-1){
$3=$2.indexOf($4);$2=$2.substring(0,$3)+LzText.escapeChars[$4]+$2.substring($3+1)
}};return $2
},"setSelectable",function($1){
this.$lzc$set_selectable($1)
},"$lzc$set_font",function($1){
var $2=this.sprite;$2.setFontName($1);this.fontname=$1;this._textrecompute=true;this.$lzc$set_text(this.getText())
},"$lzc$set_fontsize",function($1){
var $2=this.sprite;$2.setFontSize($1);this.fontsize=$1;this._textrecompute=true;this.$lzc$set_text(this.getText())
},"setFontSize",function($1){
this.$lzc$set_fontsize($1)
},"$lzc$set_fontstyle",function($1){
var $2=this.sprite;$2.setFontStyle($1);this.fontstyle=$1
},"setFontStyle",function($1){
this.$lzc$set_fontstyle($1)
},"$lzc$set_multiline",function($1){
var $2=this.sprite;$2.setMultiline($1);this.multiline=$1==true
},"setMultiline",function($1){
this.$lzc$set_multiline($1)
},"setBorder",function($1){
var $2=this.sprite;$2.setBorder($1)
},"setWordWrap",function($1){
var $2=this.sprite;$2.setWordWrap($1)
},"setEmbedFonts",function($1){
var $2=this.sprite;$2.setEmbedFonts($1)
},"setAntiAliasType",function($1){
this.$lzc$set_antiAliasType($1)
},"getAntiAliasType",function(){
if(this.capabilities.advancedfonts){
return this.antiAliasType
}else{

}},"setGridFit",function($1){
this.$lzc$set_gridFit($1)
},"getGridFit",function(){
if(this.capabilities.advancedfonts){
return this.gridFit
}else{

}},"setSharpness",function($1){
this.$lzc$set_sharpness($1)
},"getSharpness",function(){
if(this.capabilities.advancedfonts){
return this.sharpness
}else{

}},"setThickness",function($1){
this.$lzc$set_thickness($1)
},"getThickness",function(){
if(this.capabilities.advancedfonts){
return this.thickness
}else{

}},"setHScroll",function($1){
var $2=this.sprite;$2.setHScroll($1)
},"setSelection",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if($2==null){
$2=$1
};var $3=this.sprite;$3.setSelection($1,$2)
},"getSelectionPosition",function(){
var $1=this.sprite;return $1.getSelectionPosition()
},"getSelectionSize",function(){
var $1=this.sprite;return $1.getSelectionSize()
},"makeTextLink",function($1,$2){
return this.sprite.makeTextLink($1,$2)
},"textalign","left","textindent",0,"letterspacing",0,"textdecoration","none","$lzc$set_textalign",function($1){
$1=$1?$1.toLowerCase():"left";if(!($1=="left"||$1=="right"||$1=="center"||$1=="justify")){
$1="left"
};this.textalign=$1;this.sprite.setTextAlign($1);this._textrecompute=true;this.$lzc$set_text(this.getText())
},"$lzc$set_textindent",function($1){
this.textindent=$1;this.sprite.setTextIndent($1);this._textrecompute=true;this.$lzc$set_text(this.getText())
},"$lzc$set_letterspacing",function($1){
this.letterspacing=$1;this.sprite.setLetterSpacing($1);this._textrecompute=true;this.$lzc$set_text(this.getText())
},"$lzc$set_textdecoration",function($1){
$1=$1?$1.toLowerCase():"none";if(!($1=="none"||$1=="underline")){
$1="none"
};this.textdecoration=$1;this.sprite.setTextDecoration($1)
}],["tagname","text","attributes",new LzInheritedHash(LzView.attributes),"fontArgToAttr",{font:"fontname",fontsize:"fontsize",fontstyle:"fontstyle"},"escapeChars",{">":"&gt;","<":"&lt;"}]);(function($1){
with($1){
with($1.prototype){
LzText.attributes.pixellock=true;LzText.attributes.clip=true;LzText.attributes.selectable=false
}}})(LzText);lz[LzText.tagname]=LzText;Class.make("LzInputText",LzText,["$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"password",void 0,"onenabled",LzDeclaredEvent,"getDefaultWidth",function(){
return 100
},"_onfocusDel",null,"_onblurDel",null,"_modemanagerDel",null,"construct",function($1,$2){
this.password=("password" in $2)?!(!$2.password):false;this.focusable=true;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this._onfocusDel=new LzDelegate(this,"_gotFocusEvent",this,"onfocus");this._onblurDel=new LzDelegate(this,"_gotBlurEvent",this,"onblur");this._modemanagerDel=new LzDelegate(this,"_modechanged",lz.ModeManager,"onmode")
},"destroy",function(){
if(this._onfocusDel){
this._onfocusDel.unregisterAll();this._onfocusDel=null
};if(this._onblurDel){
this._onblurDel.unregisterAll();this._onblurDel=null
};if(this._modemanagerDel){
this._modemanagerDel.unregisterAll();this._modemanagerDel=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this)
},"__makeSprite",function($1){
this.sprite=new LzInputTextSprite(this,$1)
},"_focused",false,"_gotFocusEvent",function($1){
switch(arguments.length){
case 0:
$1=null;

};this._focused=true;var $2=this.sprite;$2.gotFocus()
},"_gotBlurEvent",function($1){
switch(arguments.length){
case 0:
$1=null;

};this._focused=false;var $2=this.sprite;$2.gotBlur()
},"inputtextevent",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if($1=="onfocus"&&this._focused){
return
};if($1=="onblur"&&!this._focused){
return
};if($1=="onfocus"){
this._focused=true;if(lz.Focus.getFocus()!==this){
var $3=lz.Keys.isKeyDown("tab");lz.Focus.setFocus(this,$3)
}}else{
if($1=="onchange"){
var $4=this.sprite;this.text=$4.getText();if(this.multiline&&this.sizeToHeight&&this.height!=$4.getTextfieldHeight()){
this.$lzc$set_height($4.getTextfieldHeight())
};if(this.ontext.ready){
this.ontext.sendEvent($2)
}}else{
if($1=="onblur"){
this._focused=false;if(lz.Focus.getFocus()===this){
lz.Focus.clearFocus()
}}else{
if(LzInputText.__LZinputmouse[$1]){
lz.ModeManager.handleMouseEvent(this,$1);return
}}}}},"updateData",function(){
var $1=this.sprite;return $1.getText()
},"enabled",true,"$lzc$set_enabled",function($1){
this.focusable=true;this.enabled=$1;var $2=this.sprite;$2.setEnabled($1);if(this.onenabled.ready){
this.onenabled.sendEvent($1)
}},"setEnabled",function($1){
this.$lzc$set_enabled($1)
},"setHTML",function($1){
if(this.capabilities["htmlinputtext"]){
var $2=this.sprite;$2.setHTML($1)
}else{

}},"getText",function(){
return this.sprite.getText()
},"_allowselectable",true,"_selectable",void 0,"_modechanged",function($1){
this._setallowselectable(!$1||lz.ModeManager.__LZallowInput($1,this))
},"_setallowselectable",function($1){
this._allowselectable=$1;this.$lzc$set_selectable(this._selectable)
},"$lzc$set_selectable",function($1){
this._selectable=$1;(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzc$set_selectable"]:this.nextMethod(arguments.callee,"$lzc$set_selectable")).call(this,this._allowselectable?$1:false)
}],["tagname","inputtext","attributes",new LzInheritedHash(LzText.attributes),"__LZinputmouse",{onclick:true,onmousedown:true,onmouseout:true}]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({selectable:true,enabled:true},LzInputText.attributes)
}}})(LzInputText);lz[LzInputText.tagname]=LzInputText;Class.make("LzViewLinkage",null,["scale",1,"offset",0,"uplinkArray",null,"downlinkArray",null,"$lzsc$initialize",function($1,$2){
this.scale=new Object();this.offset=new Object();if($1==$2){
return
};this.uplinkArray=[];var $3=$1;do{
$3=$3.immediateparent;this.uplinkArray.push($3)
}while($3!=$2&&$3!=canvas);this.downlinkArray=[];if($3==$2){
return
};var $3=$2;do{
$3=$3.immediateparent;this.downlinkArray.push($3)
}while($3!=canvas);while(this.uplinkArray.length>1&&this.downlinkArray[this.downlinkArray.length-1]==this.uplinkArray[this.uplinkArray.length-1]&&this.downlinkArray[this.downlinkArray.length-2]==this.uplinkArray[this.uplinkArray.length-2]){
this.downlinkArray.pop();this.uplinkArray.pop()
}},"update",function($1){
var $2=1;var $3=0;var $4="_"+$1+"scale";if(this.uplinkArray){
var $5=this.uplinkArray.length;for(var $6=0;$6<$5;$6++){
var $7=this.uplinkArray[$6];$2*=$7[$4];$3+=$7[$1]/$2
}};if(this.downlinkArray){
for(var $6=this.downlinkArray.length-1;$6>=0;$6--){
var $7=this.downlinkArray[$6];$3-=$7[$1]/$2;$2/=$7[$4]
}};this.scale[$1]=$2;this.offset[$1]=$3
}],null);Class.make("LzCanvas",LzView,["updatePercentCreatedEnabled",true,"resourcetable",void 0,"_lzinitialsubviews",[],"totalnodes",void 0,"framerate",void 0,"creatednodes",void 0,"__LZproxied",void 0,"embedfonts",void 0,"lpsbuild",void 0,"lpsbuilddate",void 0,"appbuilddate",void 0,"runtime",void 0,"__LZmouseupDel",void 0,"__LZmousedownDel",void 0,"__LZmousemoveDel",void 0,"__LZDefaultCanvasMenu",void 0,"httpdataprovider",null,"defaultdataprovider",null,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4);this.datasets={};this.__LZcheckwidth=null;this.__LZcheckheight=null;this.hassetwidth=true;this.hassetheight=true
},"construct",function($1,$2){
this.__makeSprite(null);var $3=LzSprite.prototype.capabilities;this.immediateparent=this;this.datapath=new LzDatapath(this);this.mask=null;if($2.accessible){
if($3.accessibility==true){
this.sprite.setAccessible($2.accessible);if($2.accessible){
this.sprite.setAAActive(true);this.sprite.setAASilent(false)
}}else{

}};if(typeof $2.history=="undefined"||$2.history==null){
var $4=lz.Browser.getInitArg("history");if($4!=null){
this.history=$4=="true"
}}else{
if($2.history){
this.history=true
}};if(this.history&&$3.history!=true){
this.history=false
};this.viewLevel=0;this.resourcetable={};this.totalnodes=0;this.creatednodes=0;this.percentcreated=0;this.framerate=30;if(typeof $2.proxied=="undefined"||$2.proxied==null){
var $5=$2.__LZproxied=="true";var $6=lz.Browser.getInitArg("lzproxied");if($6!=null){
$5=$6=="true"
};this.proxied=$5
}else{
this.proxied=$2.proxied==true
};if(typeof $2.proxyurl=="undefined"){
this.proxyurl=lz.Browser.getBaseURL().toString()
};delete $2.proxied;var $7=$2.width;var $8=$2.height;var $9=$2.bgcolor;delete $2.width;delete $2.height;delete $2.bgcolor;if($3.readcanvassizefromsprite==true){
if(this.sprite.width){
$7=this.sprite.width
};if(this.sprite.height){
$8=this.sprite.height
};if(this.sprite.bgcolor){
$9=this.sprite.bgcolor
}}else{
if(lz.Browser.getInitArg("width")!=null){
$7=lz.Browser.getInitArg("width")
};if(lz.Browser.getInitArg("height")!=null){
$8=lz.Browser.getInitArg("height")
};if(lz.Browser.getInitArg("bgcolor")!=null){
$9=lz.Browser.getInitArg("bgcolor")
}};this.__canvaswidthratio=null;this.width=Number($7);if(isNaN(this.width)){
if($7.charAt($7.length-1)=="%"){
var $10=Number($7.substr(0,$7.length-1));this.__canvaswidthratio=$10/100;if($3.scalecanvastopercentage!=true){
this.__canvaswidthratio=1
}}else{
this.width=400
}};this.__canvasheightratio=null;this.height=Number($8);if(isNaN(this.height)){
if($8.charAt($8.length-1)=="%"){
var $10=Number($8.substr(0,$8.length-1));this.__canvasheightratio=$10/100;if($3.scalecanvastopercentage!=true){
this.__canvasheightratio=1
}}else{
this.height=400
}};if(this.__canvasheightratio!=null||this.__canvaswidthratio!=null){
LzScreenKernel.setCallback(this,"__windowResize")
};this.bgcolor=LzColorUtils.hextoint($9);if(!this.__LZdeleted){
if(Function["$lzsc$isa"]?Function.$lzsc$isa(this["$lzc$set_bgcolor"]):this["$lzc$set_bgcolor"] instanceof Function){
this["$lzc$set_bgcolor"]($9)
}else{
this["bgcolor"]=$9;var $lzsc$257691685=this["onbgcolor"];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$257691685):$lzsc$257691685 instanceof LzEvent){
if($lzsc$257691685.ready){
$lzsc$257691685.sendEvent($9)
}}}};this.lpsversion=$2.lpsversion+"."+this.__LZlfcversion;delete $2.lpsversion;this.__LZdelayedSetters=LzView.__LZdelayedSetters;this.earlySetters=LzView.earlySetters;if(!this.version){
this.version=this.lpsversion
};this.isinited=false;this._lzinitialsubviews=[];this.datasets={};global.canvas=this;this.parent=this;this.makeMasked();this.__LZmouseupDel=new LzDelegate(this,"__LZmouseup",lz.GlobalMouse,"onmouseup");this.__LZmousedownDel=new LzDelegate(this,"__LZmousedown",lz.GlobalMouse,"onmousedown");this.__LZmousemoveDel=new LzDelegate(this,"__LZmousemove",lz.GlobalMouse,"onmousemove");this.defaultdataprovider=this.httpdataprovider=new LzHTTPDataProvider();this.id=lz.Browser.getAppID()
},"__LZmouseup",function($1){
if(this.onmouseup.ready){
this.onmouseup.sendEvent()
}},"__LZmousemove",function($1){
if(this.onmousemove.ready){
this.onmousemove.sendEvent()
}},"__LZmousedown",function($1){
if(this.onmousedown.ready){
this.onmousedown.sendEvent()
}},"__makeSprite",function($1){
this.sprite=new LzSprite(this,true)
},"onmouseleave",LzDeclaredEvent,"onpercentcreated",LzDeclaredEvent,"onmousemove",LzDeclaredEvent,"onafterinit",LzDeclaredEvent,"lpsversion",void 0,"lpsrelease",void 0,"version",null,"__LZlfcversion","0","proxied",true,"dataloadtimeout",30000,"medialoadtimeout",30000,"mediaerrortimeout",4500,"percentcreated",void 0,"datasets",null,"compareVersion",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if($2==null){
$2=this.lpsversion
};if($1==$2){
return 0
};var $3=$1.split(".");var $4=$2.split(".");var $5=0;while($5<$3.length||$5<$4.length){
var $6=Number($3[$5])||0;var $7=Number($4[$5++])||0;if($6<$7){
return -1
}else{
if($6>$7){
return 1
}}};return 0
},"$lzc$set_resource",function($1){
Object.error("You can't set a resource for the canvas.")
},"toString",function(){
return "This is the canvas"
},"initDone",function(){
var $1=new Array();var $2=this._lzinitialsubviews;for(var $3=0;$3<$2.length;$3++){
var $4=$2[$3];if($4["attrs"]&&$4.attrs["initimmediate"]){
$1.push($4)
}};for(var $3=0;$3<$2.length;$3++){
var $4=$2[$3];if(!($4["attrs"]&&$4.attrs["initimmediate"])){
$1.push($4)
}};this._lzinitialsubviews=[];lz.Instantiator.requestInstantiation(this,$1)
},"init",function(){
this.sprite.init(true);if(this.history==true){
lz.History.__start(this.id)
};if(this.contextmenu==null){
this.buildDefaultMenu()
}},"deferInit",true,"__LZinstantiationDone",function(){
if(this.deferInit){
this.deferInit=false;return
};this.percentcreated=1;this.updatePercentCreatedEnabled=false;if(this.onpercentcreated.ready){
this.onpercentcreated.sendEvent(this.percentcreated)
};lz.Instantiator.resume();this.__LZcallInit()
},"updatePercentCreated",function(){
this.percentcreated=Math.max(this.percentcreated,this.creatednodes/this.totalnodes);this.percentcreated=Math.min(0.99,this.percentcreated);if(this.onpercentcreated.ready){
this.onpercentcreated.sendEvent(this.percentcreated)
}},"initiatorAddNode",function($1,$2){
this.totalnodes+=$2;this._lzinitialsubviews.push($1)
},"__LZcallInit",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(this.isinited){
return
};this.isinited=true;this.__LZresolveReferences();var $2=this.subnodes;if($2){
var $3=0;var $4=$2.length;while($3<$4){
var $5=$2[$3++];var $6=$2[$3];if($5.isinited||$5.__LZlateinit){
continue
};$5.__LZcallInit();if($6!=$2[$3]){
while($3>0){
if($6==$2[--$3]){
break
}}}}};this.init();if(this.oninit.ready){
this.oninit.sendEvent(this)
};if(this.onafterinit.ready){
this.onafterinit.sendEvent(this)
};if(this.datapath&&this.datapath.__LZApplyDataOnInit){
this.datapath.__LZApplyDataOnInit()
};this.inited=true;if(this.oninited.ready){
this.oninited.sendEvent(true)
}},"$lzc$set_width",function($1){

},"isProxied",function(){
return this.proxied
},"$lzc$set_x",function($1){

},"$lzc$set_height",function($1){

},"$lzc$set_y",function($1){

},"setDefaultContextMenu",function($1){
this.$lzc$set_contextmenu($1);this.sprite.setDefaultContextMenu($1)
},"buildDefaultMenu",function(){
this.__LZDefaultCanvasMenu=new LzContextMenu();this.__LZDefaultCanvasMenu.hideBuiltInItems();var $1=new LzContextMenuItem("About OpenLaszlo...",new LzDelegate(this,"__LZdefaultMenuItemHandler"));this.__LZDefaultCanvasMenu.addItem($1);if(this.proxied){
var $2=new LzContextMenuItem("View Source",new LzDelegate(this,"__LZviewSourceMenuItemHandler"));this.__LZDefaultCanvasMenu.addItem($2)
};this.setDefaultContextMenu(this.__LZDefaultCanvasMenu)
},"__LZdefaultMenuItemHandler",function($1){
lz.Browser.loadURL("http://www.openlaszlo.org","lz_about")
},"__LZviewSourceMenuItemHandler",function($1){
var $2=lz.Browser.getBaseURL()+"?lzt=source";lz.Browser.loadURL($2,"lz_source")
},"__windowResize",function($1){
if(this.__canvaswidthratio!=null){
this.width=Math.floor($1.width*this.__canvaswidthratio);if(this.onwidth.ready){
this.onwidth.sendEvent(this.width)
};this.sprite.setWidth(this.width)
};if(this.__canvasheightratio!=null){
this.height=Math.floor($1.height*this.__canvasheightratio);if(this.onheight.ready){
this.onheight.sendEvent(this.height)
};this.sprite.setHeight(this.height)
}},"LzInstantiateView",function($1,$2){
switch(arguments.length){
case 1:
$2=1;

};canvas.initiatorAddNode($1,$2)
},"lzAddLocalData",function($1,$2,$3){
return new LzDataset(canvas,{name:$1,initialdata:$2,trimwhitespace:$3})
}],["tagname","canvas","attributes",new LzInheritedHash(LzView.attributes),"versionInfoString",function(){
return "URL: "+lz.Browser.getLoadURL()+"\n"+"LPS\n"+"  Version: "+canvas.lpsversion+"\n"+"  Release: "+canvas.lpsrelease+"\n"+"  Build: "+canvas.lpsbuild+"\n"+"  Date: "+canvas.lpsbuilddate+"\n"+"Application\n"+"  Date: "+canvas.appbuilddate+"\n"+"Target: "+canvas.runtime+"\n"+"Runtime: "+lz.Browser.getVersion()+"\n"+"OS: "+lz.Browser.getOS()+"\n"
}]);lz[LzCanvas.tagname]=LzCanvas;var canvas;Class.make("LzScript",LzNode,["src",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4);$2.script()
}],["tagname","script","attributes",new LzInheritedHash(LzNode.attributes)]);lz[LzScript.tagname]=LzScript;Class.make("LzAnimatorGroup",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"updateDel",void 0,"crepeat",void 0,"startTime",void 0,"__LZpauseTime",void 0,"actAnim",void 0,"notstarted",void 0,"needsrestart",void 0,"attribute",void 0,"start",true,"from",void 0,"to",void 0,"duration",void 0,"indirect",false,"relative",false,"motion","easeboth","repeat",1,"$lzc$set_repeat",function($1){
if($1<=0){
$1=Infinity
};this.repeat=$1
},"paused",false,"$lzc$set_paused",function($1){
this.pause($1)
},"started",void 0,"target",void 0,"process","sequential","isactive",false,"ontarget",LzDeclaredEvent,"onduration",LzDeclaredEvent,"onstarted",LzDeclaredEvent,"onstart",LzDeclaredEvent,"onpaused",LzDeclaredEvent,"onstop",LzDeclaredEvent,"onrepeat",LzDeclaredEvent,"animatorProps",{attribute:true,from:true,duration:true,to:true,relative:true,target:true},"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2);var $3=this.immediateparent;if(LzAnimatorGroup["$lzsc$isa"]?LzAnimatorGroup.$lzsc$isa($3):$3 instanceof LzAnimatorGroup){
for(var $4 in this.animatorProps){
if($2[$4]==null){
$2[$4]=$3[$4]
}};if($3.animators==null){
$3.animators=[this]
}else{
$3.animators.push(this)
};$2.start=LzNode._ignoreAttribute
}else{
this.target=$3
};if(!this.updateDel){
this.updateDel=new LzDelegate(this,"update")
}},"init",function(){
if(!this.target){
this.target=this.immediateparent
};if(this.started){
this.doStart()
};(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this)
},"$lzc$set_target",function($1){
this.target=$1;var $2=this.subnodes;if($2){
for(var $3=0;$3<$2.length;$3++){
if(LzAnimatorGroup["$lzsc$isa"]?LzAnimatorGroup.$lzsc$isa($2[$3]):$2[$3] instanceof LzAnimatorGroup){
$2[$3].$lzc$set_target($1)
}}};if(this.ontarget.ready){
this.ontarget.sendEvent($1)
}},"setTarget",function($1){
this.$lzc$set_target($1)
},"$lzc$set_start",function($1){
this.started=$1;if(this.onstarted.ready){
this.onstarted.sendEvent($1)
};if(!this.isinited){
return
};if($1){
this.doStart()
}else{
this.stop()
}},"doStart",function(){
if(this.isactive){
return false
};if(this.onstart.ready){
this.onstart.sendEvent(new Date().getTime())
};this.isactive=true;this.prepareStart();this.updateDel.register(lz.Idle,"onidle");return true
},"prepareStart",function(){
this.crepeat=this.repeat;for(var $1=this.animators.length-1;$1>=0;$1--){
this.animators[$1].notstarted=true
};this.actAnim=this.animators.concat()
},"resetAnimator",function(){
this.actAnim=this.animators.concat();for(var $1=this.animators.length-1;$1>=0;$1--){
this.animators[$1].needsrestart=true
}},"update",function($1){
if(this.paused){
return false
};var $2=this.actAnim.length-1;if($2>0&&this.process=="sequential"){
$2=0
};for(var $3=$2;$3>=0;$3--){
var $4=this.actAnim[$3];if($4.notstarted){
$4.isactive=true;$4.prepareStart();$4.notstarted=false
}else{
if($4.needsrestart){
$4.resetAnimator();$4.needsrestart=false
}};if($4.update($1)){
this.actAnim.splice($3,1)
}};if(!this.actAnim.length){
return this.checkRepeat()
};return false
},"pause",function($1){
switch(arguments.length){
case 0:
$1=null;

};if($1==null){
$1=!this.paused
};if(this.paused&&!$1){
this.__LZaddToStartTime(new Date().getTime()-this.__LZpauseTime)
}else{
if(!this.paused&&$1){
this.__LZpauseTime=new Date().getTime()
}};this.paused=$1;if(this.onpaused.ready){
this.onpaused.sendEvent($1)
}},"__LZaddToStartTime",function($1){
this.startTime+=$1;if(this.actAnim){
for(var $2=0;$2<this.actAnim.length;$2++){
this.actAnim[$2].__LZaddToStartTime($1)
}}},"stop",function(){
if(this.actAnim){
var $1=this.actAnim.length-1;if($1>0&&this.process=="sequential"){
$1=0
};for(var $2=$1;$2>=0;$2--){
this.actAnim[$2].stop()
}};this.__LZhalt()
},"setDuration",function($1){
this.$lzc$set_duration($1)
},"$lzc$set_duration",function($1){
if(isNaN($1)){
$1=0
}else{
$1=Number($1)
};this.duration=$1;var $2=this.subnodes;if($2){
for(var $3=0;$3<$2.length;++$3){
if(LzAnimatorGroup["$lzsc$isa"]?LzAnimatorGroup.$lzsc$isa($2[$3]):$2[$3] instanceof LzAnimatorGroup){
$2[$3].$lzc$set_duration($1)
}}};this.onduration.sendEvent($1)
},"__LZfinalizeAnim",function(){
this.__LZhalt()
},"__LZhalt",function(){
this.isactive=false;this.updateDel.unregisterAll();if(this.onstop.ready){
this.onstop.sendEvent(new Date().getTime())
}},"checkRepeat",function(){
if(this.crepeat==1){
this.__LZfinalizeAnim();return true
}else{
this.crepeat--;if(this.onrepeat.ready){
this.onrepeat.sendEvent(new Date().getTime())
};this.resetAnimator();return false
}},"destroy",function(){
this.stop();this.updateDel.unregisterAll();this.animators=null;this.actAnim=null;var $1=this.immediateparent;var $2=$1.animators;if($2&&$2.length){
for(var $3=0;$3<$2.length;$3++){
if($2[$3]==this){
$2.splice($3,1);break
}};if(LzAnimatorGroup["$lzsc$isa"]?LzAnimatorGroup.$lzsc$isa($1):$1 instanceof LzAnimatorGroup){
var $4=$1.actAnim;if($4&&$4.length){
for(var $3=0;$3<$4.length;$3++){
if($4[$3]==this){
$4.splice($3,1);break
}}}}};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this)
},"toString",function(){
if(this.animators){
return "Group of "+this.animators.length
};return "Empty group"
}],["tagname","animatorgroup","attributes",new LzInheritedHash(LzNode.attributes)]);(function($1){
with($1){
with($1.prototype){
LzAnimatorGroup.attributes.start=true;LzAnimatorGroup.attributes.ignoreplacement=true
}}})(LzAnimatorGroup);lz[LzAnimatorGroup.tagname]=LzAnimatorGroup;Class.make("LzAnimator",LzAnimatorGroup,["$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"calcMethod",void 0,"lastIterationTime",void 0,"currentValue",void 0,"doBegin",void 0,"beginPoleDelta",0.25,"endPoleDelta",0.25,"primary_K",void 0,"origto",void 0,"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2);this.calcMethod=this.calcNextValue;this.primary_K=1
},"$lzc$set_motion",function($1){
this.motion=$1;if($1=="linear"){
this.calcMethod=this.calcNextValueLinear
}else{
this.calcMethod=this.calcNextValue;if($1=="easeout"){
this.beginPoleDelta=100
}else{
if($1=="easein"){
this.endPoleDelta=15
}}}},"setMotion",function($1){
this.$lzc$set_motion($1)
},"$lzc$set_to",function($1){
this.origto=Number($1)
},"setTo",function($1){
this.$lzc$set_to($1)
},"calcControlValues",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.currentValue=$1||0;var $2=this.indirect?-1:1;if(this.currentValue<this.to){
this.beginPole=this.currentValue-$2*this.beginPoleDelta;this.endPole=this.to+$2*this.endPoleDelta
}else{
this.beginPole=this.currentValue+$2*this.beginPoleDelta;this.endPole=this.to-$2*this.endPoleDelta
};this.primary_K=1;var $3=1*(this.beginPole-this.to)*(this.currentValue-this.endPole);var $4=1*(this.beginPole-this.currentValue)*(this.to-this.endPole);if($4!=0){
this.primary_K=Math.abs($3/$4)
}},"doStart",function(){
if(this.isactive){
return
};this.isactive=true;this.prepareStart();this.updateDel.register(lz.Idle,"onidle")
},"prepareStart",function(){
this.crepeat=this.repeat;var $1=this.target;var $2=this.attribute;if(this.from!=null){
var $lzsc$1920893301=Number(this.from);if(!$1.__LZdeleted){
var $lzsc$902446671="$lzc$set_"+$2;if(Function["$lzsc$isa"]?Function.$lzsc$isa($1[$lzsc$902446671]):$1[$lzsc$902446671] instanceof Function){
$1[$lzsc$902446671]($lzsc$1920893301)
}else{
$1[$2]=$lzsc$1920893301;var $lzsc$985699068=$1["on"+$2];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$985699068):$lzsc$985699068 instanceof LzEvent){
if($lzsc$985699068.ready){
$lzsc$985699068.sendEvent($lzsc$1920893301)
}}}}};if(this.relative){
this.to=this.origto
}else{
this.to=this.origto-$1.getExpectedAttribute($2)
};$1.addToExpectedAttribute($2,this.to);$1.__LZincrementCounter($2);this.currentValue=0;this.calcControlValues();this.doBegin=true
},"resetAnimator",function(){
var $1=this.target;var $2=this.attribute;var $3=this.from;if($3!=null){
if(!$1.__LZdeleted){
var $lzsc$1184692018="$lzc$set_"+$2;if(Function["$lzsc$isa"]?Function.$lzsc$isa($1[$lzsc$1184692018]):$1[$lzsc$1184692018] instanceof Function){
$1[$lzsc$1184692018]($3)
}else{
$1[$2]=$3;var $lzsc$193124672=$1["on"+$2];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$193124672):$lzsc$193124672 instanceof LzEvent){
if($lzsc$193124672.ready){
$lzsc$193124672.sendEvent($3)
}}}};var $4=$3-$1.getExpectedAttribute($2);$1.addToExpectedAttribute($2,$4)
};if(!this.relative){
this.to=this.origto-$1.getExpectedAttribute($2);this.calcControlValues()
};$1.addToExpectedAttribute($2,this.to);$1.__LZincrementCounter($2);this.currentValue=0;this.doBegin=true
},"beginAnimator",function($1){
this.startTime=$1;this.lastIterationTime=$1;if(this.onstart.ready){
this.onstart.sendEvent($1)
};this.doBegin=false
},"stop",function(){
if(!this.isactive){
return
};var $1=this.target;var $2="e_"+this.attribute;if(!$1[$2].c){
$1[$2].c=0
};$1[$2].c-=1;if($1[$2].c<=0){
$1[$2].c=0;$1[$2].v=null
}else{
$1[$2].v-=this.to-this.currentValue
};this.__LZhalt()
},"__LZfinalizeAnim",function(){
var $1=this.target;var $2="e_"+this.attribute;if(!$1[$2].c){
$1[$2].c=0
};$1[$2].c-=1;if($1[$2].c<=0){
$1[$2].c=0;var $lzsc$1454513165=this.attribute;var $lzsc$217242290=$1[$2].v;if(!$1.__LZdeleted){
var $lzsc$1329939590="$lzc$set_"+$lzsc$1454513165;if(Function["$lzsc$isa"]?Function.$lzsc$isa($1[$lzsc$1329939590]):$1[$lzsc$1329939590] instanceof Function){
$1[$lzsc$1329939590]($lzsc$217242290)
}else{
$1[$lzsc$1454513165]=$lzsc$217242290;var $lzsc$419999247=$1["on"+$lzsc$1454513165];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$419999247):$lzsc$419999247 instanceof LzEvent){
if($lzsc$419999247.ready){
$lzsc$419999247.sendEvent($lzsc$217242290)
}}}};$1[$2].v=null
};this.__LZhalt()
},"calcNextValue",function($1){
var $2=this.currentValue;var $3=this.endPole;var $4=this.beginPole;var $5=Math.exp($1*1/this.duration*Math.log(this.primary_K));if($5!=1){
var $6=$4*$3*(1-$5);var $7=$3-$5*$4;if($7!=0){
$2=$6/$7
}};return $2
},"calcNextValueLinear",function($1){
var $2=$1/this.duration;return $2*this.to
},"update",function($1){
if(this.doBegin){
this.beginAnimator($1)
}else{
if(!this.paused){
var $2=$1-this.startTime;if($2<this.duration){
this.setValue(this.calcMethod($2));this.lastIterationTime=$1
}else{
this.setValue(this.to);return this.checkRepeat()
}}};return false
},"setValue",function($1){
var $2=this.target;var $3=$1-this.currentValue;var $lzsc$174107849=this.attribute;var $lzsc$1006514485=$2[this.attribute]+$3;if(!$2.__LZdeleted){
var $lzsc$1183076576="$lzc$set_"+$lzsc$174107849;if(Function["$lzsc$isa"]?Function.$lzsc$isa($2[$lzsc$1183076576]):$2[$lzsc$1183076576] instanceof Function){
$2[$lzsc$1183076576]($lzsc$1006514485)
}else{
$2[$lzsc$174107849]=$lzsc$1006514485;var $lzsc$2061533930=$2["on"+$lzsc$174107849];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$2061533930):$lzsc$2061533930 instanceof LzEvent){
if($lzsc$2061533930.ready){
$lzsc$2061533930.sendEvent($lzsc$1006514485)
}}}};this.currentValue=$1
},"toString",function(){
return "Animator for "+this.target+" attribute:"+this.attribute+" to:"+this.to
}],["tagname","animator","attributes",new LzInheritedHash(LzAnimatorGroup.attributes)]);lz[LzAnimator.tagname]=LzAnimator;Class.make("LzLayout",LzNode,["vip",null,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"initDelegate",void 0,"locked",2,"$lzc$set_locked",function($1){
if(this.locked==$1){
return
};if($1){
this.lock()
}else{
this.unlock()
}},"subviews",null,"updateDelegate",void 0,"delegates",void 0,"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.subviews=new Array();this.vip=this.immediateparent;if(this.vip.layouts==null){
this.vip.layouts=[this]
}else{
this.vip.layouts.push(this)
};this.updateDelegate=new LzDelegate(this,"update");this.delegates=[this.updateDelegate];if(this.immediateparent.isinited){
this.__parentInit()
}else{
this.initDelegate=new LzDelegate(this,"__parentInit",this.immediateparent,"oninit");this.delegates.push(this.initDelegate)
}},"constructWithArgs",function($1){
this.delegates.push(new LzDelegate(this,"gotNewSubview",this.immediateparent,"onaddsubview"));this.delegates.push(new LzDelegate(this,"removeSubview",this.immediateparent,"onremovesubview"));var $2=this.vip.subviews.length;for(var $3=0;$3<$2;$3++){
this.gotNewSubview(this.vip.subviews[$3])
}},"destroy",function(){
this.releaseLayout();(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this)
},"reset",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(this.locked){
return
};this.update($1)
},"addSubview",function($1){
if($1.getOption("layoutAfter")){
this.__LZinsertAfter($1,$1.getOption("layoutAfter"))
}else{
this.subviews.push($1)
}},"gotNewSubview",function($1){
if(!$1.getOption("ignorelayout")){
this.addSubview($1)
}},"removeSubview",function($1){
for(var $2=this.subviews.length-1;$2>=0;$2--){
if(this.subviews[$2]==$1){
this.subviews.splice($2,1);break
}};this.reset()
},"ignore",function($1){
for(var $2=this.subviews.length-1;$2>=0;$2--){
if(this.subviews[$2]==$1){
this.subviews.splice($2,1);break
}};this.reset()
},"lock",function(){
this.locked=true
},"unlock",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.locked=false;this.reset()
},"__parentInit",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(this.locked==2){
if(this.isinited){
this.unlock()
}else{
new LzDelegate(this,"unlock",this,"oninit")
}}},"releaseLayout",function(){
if(this.delegates){
for(var $1=this.delegates.length-1;$1>=0;$1--){
this.delegates[$1].unregisterAll()
}};if(this.immediateparent&&this.vip.layouts){
for(var $1=this.vip.layouts.length-1;$1>=0;$1--){
if(this.vip.layouts[$1]==this){
this.vip.layouts.splice($1,1)
}}}},"setLayoutOrder",function($1,$2){
for(var $3=this.subviews.length-1;$3>=0;$3--){
if(this.subviews[$3]===$2){
this.subviews.splice($3,1);break
}};if($3==-1){
return
};if($1=="first"){
this.subviews.unshift($2)
}else{
if($1=="last"){
this.subviews.push($2)
}else{
for(var $4=this.subviews.length-1;$4>=0;$4--){
if(this.subviews[$4]===$1){
this.subviews.splice($4+1,0,$2);break
}};if($4==-1){
this.subviews.splice($3,0,$2)
}}};this.reset();return
},"swapSubviewOrder",function($1,$2){
var $3=-1;var $4=-1;for(var $5=this.subviews.length-1;$5>=0&&($3<0||$4<0);$5--){
if(this.subviews[$5]===$1){
$3=$5
};if(this.subviews[$5]===$2){
$4=$5
}};if($3>=0&&$4>=0){
this.subviews[$4]=$1;this.subviews[$3]=$2
}else{

};this.reset();return
},"__LZinsertAfter",function($1,$2){
for(var $3=this.subviews.length-1;$3>=0;$3--){
if(this.subviews[$3]==$2){
this.subviews.splice($3,0,$1)
}}},"update",function($1){
switch(arguments.length){
case 0:
$1=null;

}},"toString",function(){
return "LzLayout for view "+this.immediateparent
}],["tagname","layout","attributes",new LzInheritedHash(LzNode.attributes)]);lz[LzLayout.tagname]=LzLayout;Class.make("LzFont",null,["style",void 0,"name",void 0,"height",void 0,"ascent",void 0,"descent",void 0,"advancetable",void 0,"lsbtable",void 0,"rsbtable",void 0,"fontobject",void 0,"$lzsc$initialize",function($1,$2,$3){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.name=$1.name;this.style=$3;this.fontobject=$1;$1[$3]=this;for(var $4 in $2){
if($4=="leading"){
continue
};this[$4]=$2[$4]
};this.height=this.ascent+this.descent;this.advancetable[13]=this.advancetable[32];this.advancetable[160]=0
},"leading",2,"toString",function(){
return "Font style "+this.style+" of name "+this.name
}],null);lz.Font=LzFont;Class.make("LzSelectionManager",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"sel","setSelected","selectedHash",void 0,"selected",void 0,"toggle",void 0,"lastRangeStart",void 0,"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2);this.toggle=$2.toggle==true;if($2.sel!=null){
this.sel=$2.sel
};this.selected=[];this.selectedHash={};this.lastRangeStart=null
},"select",function($1){
if(this.isSelected($1)&&(this.toggle||this.isMultiSelect($1))){
this.unselect($1)
}else{
if(this.selected.length>0&&this.isRangeSelect($1)){
var $2=this.lastRangeStart||this.selected[0];this.selectRange($2,$1)
}else{
if(!this.isMultiSelect($1)){
this.clearSelection()
};this.makeSelected($1)
}}},"isSelected",function($1){
return this.selectedHash[$1.__LZUID]==true
},"makeSelected",function($1){
if(!this.selectedHash[$1.__LZUID]){
this.selectedHash[$1.__LZUID]=true;this.selected.push($1);$1[this.sel](true)
}},"unselect",function($1){
var $2=this.selectedHash;var $3=this.selected;if($2[$1.__LZUID]){
for(var $4=$3.length-1;$4>=0;$4--){
if($3[$4]===$1){
delete $2[$1.__LZUID];$3.splice($4,1);$1[this.sel](false);return
}}}},"clearSelection",function(){
var $1=this.selected;this.selected=[];this.selectedHash={};this.lastRangeStart=null;var $2;while($2=$1.pop()){
$2[this.sel](false)
}},"getSelection",function(){
return this.selected.concat()
},"selectRange",function($1,$2){
var $3=$1.immediateparent;var $4=$3.subviews;var $5=-1;var $6=-1;for(var $7=0;$7<$4.length&&($5==-1||$6==-1);$7++){
if($4[$7]===$1){
$5=$7
};if($4[$7]===$2){
$6=$7
}};var $8=$5>$6?-1:1;this.clearSelection();this.lastRangeStart=$1;if($5!=-1&&$6!=-1){
for(var $7=$5;$7!=$6+$8;$7+=$8){
this.makeSelected($4[$7])
}}},"isMultiSelect",function($1){
return lz.Keys.isKeyDown("control")
},"isRangeSelect",function($1){
return lz.Keys.isKeyDown("shift")
},"toString",function(){
return "LzSelectionManager"
}],["tagname","selectionmanager","attributes",new LzInheritedHash(LzNode.attributes)]);lz[LzSelectionManager.tagname]=LzSelectionManager;Class.make("LzDataSelectionManager",LzSelectionManager,["$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"manager",void 0,"singleClone",void 0,"makeSelected",function($1){
if(this.manager==null){
this.manager=$1.cloneManager
};var $2=$1.datapath.p;if(!$2.sel){
$2.sel=true;this.selected.push($2);if(this.manager==null){
this.singleClone=$1
};$1.datapath.setSelected(true)
}},"unselect",function($1){
if(this.manager==null){
this.manager=$1.cloneManager
};var $2=this.selected;var $3=$1.datapath.p;for(var $4=$2.length-1;$4>=0;$4--){
if($2[$4]===$3){
$3.sel=false;$2.splice($4,1);if($1==this.singleClone){
this.singleClone=null
};$1.datapath.setSelected(false);return
}}},"selectRange",function($1,$2){
if(this.manager==null){
this.manager=$2.cloneManager;if(this.manager==null){
return
}};var $3=this.manager.nodes;var $4=-1;var $5=-1;var $6=$2.datapath.p;for(var $7=0;$7<$3.length&&($4==-1||$5==-1);$7++){
if($3[$7]===$1){
$4=$7
};if($3[$7]===$6){
$5=$7
}};var $8=$4>$5?-1:1;this.clearSelection();this.lastRangeStart=$1;if($4!=-1&&$5!=-1){
for(var $7=$4;$7!=$5+$8;$7+=$8){
var $9=$3[$7];$9.sel=true;this.selected.push($9);this.__LZsetSelected($9,true)
}}},"getSelection",function(){
var $1=this.selected;var $2=[];for(var $3=0;$3<$1.length;$3++){
$2.push(new LzDatapointer(null,{pointer:$1[$3]}))
};return $2
},"clearSelection",function(){
var $1=this.selected;this.selected=[];this.lastRangeStart=null;var $2;while($2=$1.pop()){
$2.sel=false;this.__LZsetSelected($2,false)
}},"isSelected",function($1){
if(this.manager==null){
this.manager=$1.cloneManager
};return $1.datapath.p.sel
},"__LZsetSelected",function($1,$2){
if(this.manager!=null){
var $3=this.manager.getCloneForNode($1,true);if($3){
$3.datapath.setSelected($2)
}else{

}}else{
if(!$2){
var $4=this.singleClone;if($4!=null&&$4.datapath.p===$1){
this.singleClone=null;$4.datapath.setSelected($2)
}}}}],["tagname","dataselectionmanager","attributes",new LzInheritedHash(LzSelectionManager.attributes)]);lz[LzDataSelectionManager.tagname]=LzDataSelectionManager;Class.make("LzCommand",LzNode,["active",true,"keys",null,"$lzc$set_key",function($1){
this.keys=$1;lz.Keys.callOnKeyCombo(this,$1)
},"onselect",LzDeclaredEvent,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"setKeys",function($1){
this.$lzc$set_key($1)
},"execute",function($1){
if(this.active){
if(this.onselect.ready){
this.onselect.sendEvent($1)
}}},"keysToString",function(){
var $1="";var $2=this.keys;if($2){
var $3=LzCommand.DisplayKeys;var $4="";var $5=$2.length-1;for(var $6=0;$6<$5;$6++){
$4=$2[$6];if($4 in $3){
$4=$3[$4]
};$1=$1+$4+"+"
};$4=$2[$6];if($4 in $3){
$4=$3[$4]
};$1=$1+$4
};return $1
}],["tagname","command","attributes",new LzInheritedHash(LzNode.attributes),"DisplayKeys",{control:"Ctrl",shift:"Shift",alt:"Alt"}]);lz[LzCommand.tagname]=LzCommand;Class.make("LzState",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"__LZpool",[],"__LZstatedelegates",void 0,"onapply",LzDeclaredEvent,"onremove",LzDeclaredEvent,"onapplied",LzDeclaredEvent,"applied",false,"$lzc$set_applied",function($1){
if($1){
if(this.isinited){
this.apply()
}else{
this.applyOnInit=true
}}else{
if(this.isinited){
this.remove()
}}},"isapplied",false,"$lzc$set_apply",function($1){
this.setApply($1)
},"asyncnew",false,"subh",null,"pooling",false,"$lzc$set_asyncnew",function($1){
this.__LZsetProperty($1,"asyncnew")
},"$lzc$set_pooling",function($1){
this.__LZsetProperty($1,"pooling")
},"$lzc$set___LZsourceLocation",function($1){
this.__LZsetProperty($1,"__LZsourceLocation")
},"heldArgs",void 0,"handlerMethodNames",void 0,"releasedconstraints",void 0,"appliedChildren",void 0,"applyOnInit",false,"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.heldArgs={};this.handlerMethodNames={};this.appliedChildren=[]
},"init",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this);if(this.applyOnInit){
this.apply()
}},"createChildren",function($1){
this.subh=$1;this.__LZinstantiationDone()
},"setApply",function($1){
if(typeof $1=="function"){
this.addProperty("apply",$1);return
};this.$lzc$set_applied($1)
},"apply",function(){
if(this.applied){
return
};var $1=this.parent;this.applied=this.isapplied=true;var $2=$1._instanceAttrs;if($2){
for(var $3 in this.heldArgs){
if(LzConstraintExpr["$lzsc$isa"]?LzConstraintExpr.$lzsc$isa($2[$3]):$2[$3] instanceof LzConstraintExpr){
if(this.releasedconstraints==null){
this.releasedconstraints=[]
};var $4=$2[$3].methodName;if($1.releaseConstraintMethod($4)){
this.releasedconstraints.push($4)
}}}};var $5=$1.__LZdelegates;$1.__LZdelegates=null;$1.__LZapplyArgs(this.heldArgs);if(this.subh){
var $6=this.subh.length
};$1.__LZsetPreventInit();for(var $7=0;$7<$6;$7++){
if(this.__LZpool&&this.__LZpool[$7]){
this.appliedChildren.push(this.__LZretach(this.__LZpool[$7]))
}else{
this.appliedChildren.push($1.makeChild(this.subh[$7],this.asyncnew))
}};$1.__LZclearPreventInit();$1.__LZresolveReferences();this.__LZstatedelegates=$1.__LZdelegates;$1.__LZdelegates=$5;if(this.onapply.ready){
this.onapply.sendEvent(this)
};if(this.onapplied.ready){
this.onapplied.sendEvent(true)
}},"remove",function(){
if(!this.applied){
return
};this.applied=this.isapplied=false;if(this.onremove.ready){
this.onremove.sendEvent(this)
};if(this.onapplied.ready){
this.onapplied.sendEvent(false)
};if(this.__LZstatedelegates){
for(var $1=0;$1<this.__LZstatedelegates.length;$1++){
this.__LZstatedelegates[$1].unregisterAll()
}};if(this.pooling&&this.appliedChildren.length){
this.__LZpool=[]
};for(var $1=0;$1<this.appliedChildren.length;$1++){
var $2=this.appliedChildren[$1];if(this.pooling){
if(LzView["$lzsc$isa"]?LzView.$lzsc$isa($2):$2 instanceof LzView){
this.__LZpool.push(this.__LZdetach($2))
}else{
$2.destroy();this.__LZpool.push(null)
}}else{
$2.destroy()
}};this.appliedChildren=[];if(this.releasedconstraints!=null){
this.releasedconstraints=null
}},"destroy",function(){
this.pooling=false;this.remove();(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this)
},"__LZapplyArgs",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};var $3={};var $4=this.heldArgs;var $5=this.handlerMethodNames;for(var $6 in $1){
var $7=$1[$6];var $8="$lzc$set_"+$6;if((Function["$lzsc$isa"]?Function.$lzsc$isa(this[$8]):this[$8] instanceof Function)||($6 in $5)){
$3[$6]=$7
}else{
$4[$6]=$7
}};for(var $6 in $3){
var $7=$3[$6];if(LzOnceExpr["$lzsc$isa"]?LzOnceExpr.$lzsc$isa($7):$7 instanceof LzOnceExpr){
var $9=$7.methodName;if($9 in $4){
$3[$9]=$4[$9];delete $4[$9]
}else{

};if(LzAlwaysExpr["$lzsc$isa"]?LzAlwaysExpr.$lzsc$isa($7):$7 instanceof LzAlwaysExpr){
var $10=$7.dependenciesName;if($10 in $4){
$3[$10]=$4[$10];delete $4[$10]
}else{

}}}};var $11=null;for(var $6 in $4){
var $7=$4[$6];if(LzOnceExpr["$lzsc$isa"]?LzOnceExpr.$lzsc$isa($7):$7 instanceof LzOnceExpr){
if($11==null){
$11=[]
};$11.push($6,$7)
}};if($11!=null){
for(var $12=0,$13=$11.length;$12<$13;$12+=2){
var $6=$11[$12];var $14=$11[$12+1];var $9=$14.methodName;var $15=$9+this.__LZUID;var $16=null;if(Function["$lzsc$isa"]?Function.$lzsc$isa($4[$9]):$4[$9] instanceof Function){
$4[$15]=$4[$9];delete $4[$9]
}else{
if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$9]):this[$9] instanceof Function){
$4[$15]=this[$9]
}};if(LzAlwaysExpr["$lzsc$isa"]?LzAlwaysExpr.$lzsc$isa($14):$14 instanceof LzAlwaysExpr){
var $10=$14.dependenciesName;var $17=$10+this.__LZUID;if(Function["$lzsc$isa"]?Function.$lzsc$isa($4[$10]):$4[$10] instanceof Function){
$4[$17]=$4[$10];delete $4[$10]
}else{
if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$10]):this[$10] instanceof Function){
$4[$17]=this[$10]
}};$4[$6]=new ($14.constructor)($15,$17,$16)
}else{
$4[$6]=new ($14.constructor)($15,$16)
}}};(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZapplyArgs"]:this.nextMethod(arguments.callee,"__LZapplyArgs")).call(this,$3)
},"$lzc$set_$delegates",function($1){
var $2=[];var $3=[];for(var $4=0;$4<$1.length;$4+=3){
if(LzState.events[$1[$4]]&&!$1[$4+2]){
var $5=$3;var $6=$1[$4+1];if(this.heldArgs[$6]){
this.addProperty($6,this.heldArgs[$6]);delete this.heldArgs[$6]
};this.handlerMethodNames[$6]=true
}else{
var $5=$2
};$5.push($1[$4],$1[$4+1],$1[$4+2])
};if($3.length){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzc$set_$delegates"]:this.nextMethod(arguments.callee,"$lzc$set_$delegates")).call(this,$3)
};if($2.length){
this.heldArgs.$delegates=$2
}},"__LZsetProperty",function($1,$2){
this[$2]=$1
},"__LZdetach",function($1){
$1.$lzc$set_visible(false);return $1
},"__LZretach",function($1){
$1.$lzc$set_visible(true);return $1
}],["tagname","state","attributes",new LzInheritedHash(LzNode.attributes),"props",{apply:true},"events",{onremove:true,onapply:true,onapplied:true}]);(function($1){
with($1){
with($1.prototype){
prototype.$isstate=true
}}})(LzState);lz[LzState.tagname]=LzState;Mixin.make("LzDataNodeMixin",null,["onownerDocument",LzDeclaredEvent,"onDocumentChange",LzDeclaredEvent,"onparentNode",LzDeclaredEvent,"onchildNode",LzDeclaredEvent,"onchildNodes",LzDeclaredEvent,"onattributes",LzDeclaredEvent,"onnodeName",LzDeclaredEvent,"nodeType",void 0,"parentNode",null,"ownerDocument",void 0,"__LZo",-1,"sel",false,"childNodes",null,"__LZcoDirty",true,"__LZsize",void 0,"getParent",function(){
return this.parentNode
},"getOffset",function(){
if(!this.parentNode){
return 0
};if(this.parentNode.__LZcoDirty){
this.parentNode.__LZupdateCO()
};return this.__LZo
},"getPreviousSibling",function(){
if(!this.parentNode){
return null
};if(this.parentNode.__LZcoDirty){
this.parentNode.__LZupdateCO()
};return this.parentNode.childNodes[this.__LZo-1]
},"$lzc$getPreviousSibling_dependencies",function($1,$2){
return [this.parentNode,"childNodes",this,"parentNode"]
},"getNextSibling",function(){
if(!this.parentNode){
return null
};if(this.parentNode.__LZcoDirty){
this.parentNode.__LZupdateCO()
};return this.parentNode.childNodes[this.__LZo+1]
},"$lzc$getNextSibling_dependencies",function($1,$2){
return [this.parentNode,"childNodes",this,"parentNode"]
},"childOfNode",function($1,$2){
switch(arguments.length){
case 1:
$2=false;

};var $3=$2?this:this.parentNode;while($3){
if($3==$1){
return true
};$3=$3.parentNode
};return false
},"childOf",function($1,$2){
switch(arguments.length){
case 1:
$2=false;

};return this.childOfNode($1,$2)
},"$lzc$set_ownerDocument",function($1){
this.ownerDocument=$1;if(this.childNodes){
for(var $2=0;$2<this.childNodes.length;$2++){
this.childNodes[$2].$lzc$set_ownerDocument($1)
}};if(this.onownerDocument.ready){
this.onownerDocument.sendEvent($1)
}},"setOwnerDocument",function($1){
this.$lzc$set_ownerDocument($1)
},"cloneNode",function($1){
switch(arguments.length){
case 0:
$1=false;

};return undefined
},"serialize",function($1){
switch(arguments.length){
case 0:
$1=Infinity;

};return undefined
},"__LZlockFromUpdate",function($1){
this.ownerDocument.__LZdoLock($1)
},"__LZunlockFromUpdate",function($1){
this.ownerDocument.__LZdoUnlock($1)
},"__LZgetSize",function($1){
return this.__LZsize&&this.__LZsize[$1]
},"__LZsetSize",function($1,$2){
if(!this.__LZsize){
this.__LZsize={}};this.__LZsize[$1]=$2
}],null);lz.DataNodeMixin=LzDataNodeMixin;Class.make("LzDataNode",LzEventable,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"toString",function(){
return "LzDataNode"
}],["ELEMENT_NODE",1,"TEXT_NODE",3,"DOCUMENT_NODE",9,"stringToLzData",function($1,$2,$3){
switch(arguments.length){
case 1:
$2=false;
case 2:
$3=false;

};return LzDataElement.stringToLzData($1,$2,$3)
}]);lz.DataNode=LzDataNode;Mixin.make("LzDataElementMixin",null,["__LZchangeQ",null,"__LZlocker",null,"nodeName",null,"attributes",null,"insertBefore",function($1,$2){
if($1==null){
return null
}else{
if($2==null){
return this.appendChild($1)
}else{
var $3=this.__LZgetCO($2);if($3>=0){
var $4=$1===$2;if($1.parentNode!=null){
if($1.parentNode===this){
if(!$4){
this.__LZremoveChild($1)
}}else{
$1.parentNode.removeChild($1)
}};if(!$4){
this.__LZcoDirty=true;this.childNodes.splice($3,0,$1)
};$1.$lzc$set_ownerDocument(this.ownerDocument);$1.parentNode=this;if($1.onparentNode.ready){
$1.onparentNode.sendEvent(this)
};if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("insertBefore",this,0);return $1
};return null
}}},"replaceChild",function($1,$2){
if($1==null){
return null
}else{
var $3=this.__LZgetCO($2);if($3>=0){
var $4=$1===$2;if($1.parentNode!=null){
if($1.parentNode===this){
if(!$4){
this.__LZremoveChild($1)
}}else{
$1.parentNode.removeChild($1)
}};if(!$4){
$1.__LZo=$3;this.childNodes[$3]=$1
};$1.$lzc$set_ownerDocument(this.ownerDocument);$1.parentNode=this;if($1.onparentNode.ready){
$1.onparentNode.sendEvent(this)
};if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("childNodes",this,0,$1);return $1
};return null
}},"removeChild",function($1){
var $2=this.__LZgetCO($1);if($2>=0){
this.__LZcoDirty=true;this.childNodes.splice($2,1);if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("removeChild",this,0,$1);return $1
};return null
},"appendChild",function($1){
if($1==null){
return null
}else{
if($1.parentNode!=null){
if($1.parentNode===this){
this.__LZcoDirty=true;this.__LZremoveChild($1)
}else{
$1.parentNode.removeChild($1)
}};if(this.childNodes){
this.childNodes.push($1)
}else{
this.childNodes=[$1]
};$1.__LZo=this.childNodes.length-1;$1.$lzc$set_ownerDocument(this.ownerDocument);$1.parentNode=this;if($1.onparentNode.ready){
$1.onparentNode.sendEvent(this)
};if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("appendChild",this,0,$1);return $1
}},"hasChildNodes",function(){
return this.childNodes.length>0
},"cloneNode",function($1){
switch(arguments.length){
case 0:
$1=false;

};var $2=new LzDataElement(this.nodeName);$2.$lzc$set_attributes(this.attributes);if($1){
for(var $3=0;$3<this.childNodes.length;$3++){
$2.appendChild(this.childNodes[$3].cloneNode(true))
}};return $2
},"getAttr",function($1){
if(this.attributes){
return this.attributes[$1]
};return null
},"$lzc$getAttr_dependencies",function($1,$2){
return [$2,"attributes"]
},"setAttr",function($1,$2){
$2=String($2);if(!this.attributes){
this.attributes={}};this.attributes[$1]=$2;if(this.onattributes.ready){
this.onattributes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("attributes",this,1,{name:$1,value:$2,type:"set"});return $2
},"removeAttr",function($1){
var $2=this.attributes[$1];delete this.attributes[$1];if(this.onattributes.ready){
this.onattributes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("attributes",this,1,{name:$1,value:$2,type:"remove"});return $2
},"hasAttr",function($1){
return this.attributes[$1]!=null
},"$lzc$hasAttr_dependencies",function($1,$2){
return [$2,"attributes"]
},"getFirstChild",function(){
return this.childNodes[0]
},"$lzc$getFirstChild_dependencies",function($1,$2){
return [this,"childNodes"]
},"getLastChild",function(){
return this.childNodes[this.childNodes.length-1]
},"$lzc$getLastChild_dependencies",function($1,$2){
return [this,"childNodes"]
},"__LZgetCO",function($1){
var $2=this.childNodes;if(!this.__LZcoDirty){
var $3=$1.__LZo;if($2[$3]===$1){
return $3
}}else{
for(var $3=$2.length-1;$3>=0;--$3){
if($2[$3]===$1){
return $3
}}};return -1
},"__LZremoveChild",function($1){
var $2=this.__LZgetCO($1);if($2>=0){
this.childNodes.splice($2,1)
}},"__LZupdateCO",function(){
var $1=this.childNodes;for(var $2=0;$2<$1.length;$2++){
$1[$2].__LZo=$2
};this.__LZcoDirty=false
},"$lzc$set_attributes",function($1){
var $2={};for(var $3 in $1){
$2[$3]=$1[$3]
};this.attributes=$2;if(this.onattributes.ready){
this.onattributes.sendEvent($2)
};if(this.ownerDocument){
this.ownerDocument.handleDocumentChange("attributes",this,1)
}},"setAttrs",function($1){
this.$lzc$set_attributes($1)
},"$lzc$set_childNodes",function($1){
this.childNodes=$1;if($1.length>0){
var $2=true;var $3=$1[0].parentNode;if($3!=null&&$3!==this&&$3.childNodes===$1){
$2=false;$3.$lzc$set_childNodes([])
};for(var $4=0;$4<$1.length;$4++){
var $5=$1[$4];if($5){
if($2&&$5.parentNode!=null){
if($5.parentNode!==this){
$5.parentNode.removeChild($5)
}};$5.$lzc$set_ownerDocument(this.ownerDocument);$5.parentNode=this;if($5.onparentNode.ready){
$5.onparentNode.sendEvent(this)
};$5.__LZo=$4
}}};this.__LZcoDirty=false;if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("childNodes",this,0)
},"setChildNodes",function($1){
this.$lzc$set_childNodes($1)
},"$lzc$set_nodeName",function($1){
this.nodeName=$1;if(this.onnodeName.ready){
this.onnodeName.sendEvent($1)
};if(this.parentNode){
if(this.parentNode.onchildNodes.ready){
this.parentNode.onchildNodes.sendEvent(this)
};if(this.parentNode.onchildNode.ready){
this.parentNode.onchildNode.sendEvent(this)
}};this.ownerDocument.handleDocumentChange("childNodeName",this.parentNode,0);this.ownerDocument.handleDocumentChange("nodeName",this,1)
},"setNodeName",function($1){
this.$lzc$set_nodeName($1)
},"__LZgetText",function(){
var $1="";for(var $2=0;$2<this.childNodes.length;$2++){
var $3=this.childNodes[$2];if($3.nodeType==LzDataElement.TEXT_NODE){
$1+=$3.data
}};return $1
},"getElementsByTagName",function($1){
var $2=[];for(var $3=0;$3<this.childNodes.length;$3++){
if(this.childNodes[$3].nodeName==$1){
$2.push(this.childNodes[$3])
}};return $2
},"__LZlt","<","__LZgt",">","serialize",function($1){
switch(arguments.length){
case 0:
$1=Infinity;

};return this.serializeInternal($1)
},"serializeInternal",function($1){
switch(arguments.length){
case 0:
$1=Infinity;

};var $2=this.__LZlt+this.nodeName;for(var $3 in this.attributes){
$2+=" "+$3+'="'+LzDataElement.__LZXMLescape(this.attributes[$3])+'"';if($2.length>$1){
break
}};if($2.length<=$1&&this.childNodes&&this.childNodes.length){
$2+=this.__LZgt;for(var $4=0;$4<this.childNodes.length;$4++){
$2+=this.childNodes[$4].serialize($1);if($2.length>$1){
break
}};$2+=this.__LZlt+"/"+this.nodeName+this.__LZgt
}else{
$2+="/"+this.__LZgt
};return $2
},"handleDocumentChange",function($1,$2,$3,$4){
switch(arguments.length){
case 3:
$4=null;

};var $5={who:$2,what:$1,type:$3};if($4){
$5.cobj=$4
};if(this.__LZchangeQ){
this.__LZchangeQ.push($5)
}else{
if(this.onDocumentChange.ready){
this.onDocumentChange.sendEvent($5)
}}},"toString",function(){
return this.serialize()
},"__LZdoLock",function($1){
if(!this.__LZchangeQ){
this.__LZchangeQ=[];this.__LZlocker=$1
}},"__LZdoUnlock",function($1){
if(this.__LZlocker!=$1){
return
};var $2=this.__LZchangeQ;this.__LZchangeQ=null;this.__LZlocker=null;if($2!=null){
for(var $3=0;$3<$2.length;$3++){
var $4=true;var $5=$2[$3];for(var $6=0;$6<$3;$6++){
var $7=$2[$6];if($5.who==$7.who&&$5.what==$7.what&&$5.type==$7.type){
$4=false;break
}};if($4){
this.handleDocumentChange($5.what,$5.who,$5.type)
}}}}],null);lz.DataElementMixin=LzDataElementMixin;Class.make("LzDataElement",[LzDataElementMixin,LzDataNodeMixin,LzDataNode],["$lzsc$initialize",function($1,$2,$3){
switch(arguments.length){
case 1:
$2=null;
case 2:
$3=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.nodeName=$1;this.nodeType=LzDataElement.ELEMENT_NODE;this.attributes=$2;this.ownerDocument=this;this.$lzc$set_childNodes($3||[])
}],["makeNodeList",function($1,$2){
var $3=[];for(var $4=0;$4<$1;$4++){
$3[$4]=new LzDataElement($2,{},null)
};return $3
},"valueToElement",function($1){
return new LzDataElement("element",{},LzDataElement.__LZv2E($1))
},"__LZv2E",function($1){
var $2=typeof $1;var $3=[];if($2=="object"){
if((LzDataElement["$lzsc$isa"]?LzDataElement.$lzsc$isa($1):$1 instanceof LzDataElement)||(LzDataText["$lzsc$isa"]?LzDataText.$lzsc$isa($1):$1 instanceof LzDataText)){
$3[0]=$1
}else{
if(Date["$lzsc$isa"]?Date.$lzsc$isa($1):$1 instanceof Date){
$2="date"
}else{
if(Array["$lzsc$isa"]?Array.$lzsc$isa($1):$1 instanceof Array){
$2="array";var $4=$1.__LZtag!=null?$1.__LZtag:"item";for(var $5=0;$5<$1.length;$5++){
var $6=LzDataElement.__LZv2E($1[$5]);$3[$5]=new LzDataElement($4,null,$6)
}}else{
$2="struct";var $5=0;for(var $7 in $1){
if($7.indexOf("__LZ")==0){
continue
};$3[$5++]=new LzDataElement($7,null,LzDataElement.__LZv2E($1[$7]))
}}}}}else{
if($1!=null){
$3[0]=new LzDataText($1)
}};if($3.length==0){
$3=null
};return $3
},"ELEMENT_NODE",1,"TEXT_NODE",3,"DOCUMENT_NODE",9,"__LZescapechars",{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"},"__LZXMLescape",function($1){
if(typeof $1!="string"){
return $1
};var $2=LzDataElement.__LZescapechars;var $3=$1.length;var $4="";for(var $5=0;$5<$3;$5++){
var $6=$1.charCodeAt($5);if($6<32){
$4+="&#x"+$6.toString(16)+";"
}else{
var $7=$1.charAt($5);$4+=$2[$7]||$7
}};return $4
},"stringToLzData",function($1,$2,$3){
switch(arguments.length){
case 1:
$2=false;
case 2:
$3=false;

};if($1!=null&&$1!=""){
try{
var $4=LzXMLParser.parseXML($1,$2,$3);var $5=LzXMLTranslator.copyXML($4,$2,$3);return $5
}
catch(e){
return null
}};return null
},"whitespaceChars",{" ":true,"\r":true,"\n":true,"\t":true},"trim",function($1){
var $2=LzDataElement.whitespaceChars;var $3=$1.length;var $4=0;var $5=$3-1;var $6;while($4<$3){
$6=$1.charAt($4);if($2[$6]!=true){
break
};$4++
};while($5>$4){
$6=$1.charAt($5);if($2[$6]!=true){
break
};$5--
};return $1.slice($4,$5+1)
}]);lz.DataElement=LzDataElement;Class.make("LzDataText",[LzDataNodeMixin,LzDataNode],["$lzsc$initialize",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.nodeType=LzDataElement.TEXT_NODE;this.data=$1
},"ondata",LzDeclaredEvent,"nodeName","#text","data","","$lzc$set_data",function($1){
this.data=$1;if(this.ondata.ready){
this.ondata.sendEvent($1)
};if(this.ownerDocument){
this.ownerDocument.handleDocumentChange("data",this,1)
}},"length",0,"setData",function($1){
this.$lzc$set_data($1)
},"cloneNode",function($1){
switch(arguments.length){
case 0:
$1=false;

};var $2=new LzDataText(this.data);return $2
},"serialize",function($1){
switch(arguments.length){
case 0:
$1=Infinity;

};return LzDataElement.__LZXMLescape(this.data)
},"toString",function(){
return this.data
}],null);lz.DataText=LzDataText;Class.make("LzDataRequest",LzEventable,["requestor",null,"src",null,"timeout",Infinity,"status",null,"rawdata",null,"error",null,"onstatus",LzDeclaredEvent,"$lzsc$initialize",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.requestor=$1
}],["SUCCESS","success","TIMEOUT","timeout","ERROR","error","READY","ready","LOADING","loading"]);lz.DataRequest=LzDataRequest;Class.make("LzDataProvider",LzEventable,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"doRequest",function($1){

},"abortLoadForRequest",function($1){

}],null);lz.DataProvider=LzDataProvider;Class.make("LzHTTPDataRequest",LzDataRequest,["method","GET","postbody",void 0,"proxied",void 0,"proxyurl",void 0,"multirequest",false,"queuerequests",false,"queryparams",null,"requestheaders",null,"getresponseheaders",false,"responseheaders",void 0,"cacheable",false,"clientcacheable",false,"trimwhitespace",false,"nsprefix",false,"serverproxyargs",null,"xmldata",null,"loadtime",0,"loadstarttime",void 0,"secure",false,"secureport",void 0,"parsexml",true,"loader",null,"$lzsc$initialize",function($1){
switch(arguments.length){
case 0:
$1=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1)
}],null);lz.HTTPDataRequest=LzHTTPDataRequest;Class.make("LzHTTPDataProvider",LzDataProvider,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"makeLoader",function($1){
var $2=$1.proxied;var $3=new LzHTTPLoader(this,$2);$1.loader=$3;$3.loadSuccess=this.loadSuccess;$3.loadError=this.loadError;$3.loadTimeout=this.loadTimeout;$3.setProxied($2);var $4=$1.secure;if($4==null){
if($1.src.substring(0,5)=="https"){
$4=true
}};$3.secure=$4;if($4){
$3.baserequest=lz.Browser.getBaseURL($4,$1.secureport);$3.secureport=$1.secureport
};return $3
},"abortLoadForRequest",function($1){
$1.loader.abort()
},"doRequest",function($1){
var $2=$1;if(!$2.src){
return
};var $3=$2.proxied;var $4=$2.loader;if($4==null||$2.multirequest==true||$2.queuerequests==true){
$4=this.makeLoader($2)
};$4.dataRequest=$2;$4.setQueueing($2.queuerequests);$4.setTimeout($2.timeout);$4.setOption("serverproxyargs",$2.serverproxyargs);$4.setOption("cacheable",$2.cacheable==true);$4.setOption("timeout",$2.timeout);$4.setOption("trimwhitespace",$2.trimwhitespace==true);$4.setOption("nsprefix",$2.nsprefix==true);$4.setOption("sendheaders",$2.getresponseheaders==true);$4.setOption("parsexml",$2.parsexml);if($2.clientcacheable!=null){
$4.setOption("ccache",$2.clientcacheable)
};var $5={};var $6=$2.requestheaders;if($6!=null){
var $7=$6.getNames();for(var $8=0;$8<$7.length;$8++){
var $9=$7[$8];var $10=$6.getValue($9);if($3){
$5[$9]=$10
}else{
$4.setRequestHeader($9,$10)
}}};var $11=$2.queryparams;var $12=true;var $13=$2.postbody;if($13==null&&$11!=null){
$13=$11.serialize("=","&",true)
}else{
$12=false
};$4.setOption("hasquerydata",$12);var $14=new LzURL($2.src);if($2.method=="GET"){
if($14.query==null){
$14.query=$13
}else{
if($13!=null){
$14.query+="&"+$13
}};$13=null
};var $15="__lzbc__="+new Date().getTime();if(!$3&&$2.method=="POST"&&($13==null||$13=="")){
$13=$15
};var $16;if($3){
$16=$4.makeProxiedURL($2.proxyurl,$14.toString(),$2.method,"xmldata",$5,$13);var $17=$16.indexOf("?");var $18=$16.substring($17+1,$16.length);var $19=$16.substring(0,$17);$16=$19+"?"+$15;$13=$18
}else{
if(!$2.clientcacheable){
if($2.method=="GET"){
if($14.query==null){
$14.query=$15
}else{
$14.query+="&"+$15
}}};$16=$14.toString()
};$2.loadstarttime=new Date().getTime();$2.status=LzDataRequest.LOADING;$4.open($3?"POST":$2.method,$16,null,null);$4.send($13)
},"loadSuccess",function($1,$2){
var $3=$1.dataRequest;$3.status=LzDataRequest.SUCCESS;$1.owner.loadResponse($3,$2)
},"loadError",function($1,$2){
var $3=$1.dataRequest;$3.status=LzDataRequest.ERROR;$1.owner.loadResponse($3,$2)
},"loadTimeout",function($1,$2){
var $3=$1.dataRequest;$3.loadtime=new Date().getTime()-$3.loadstarttime;$3.status=LzDataRequest.TIMEOUT;$3.onstatus.sendEvent($3)
},"setRequestError",function($1,$2){
$1.error=$2;$1.status=LzDataRequest.ERROR
},"loadResponse",function($1,$2){
$1.loadtime=new Date().getTime()-$1.loadstarttime;$1.rawdata=$1.loader.getResponse();if($2==null){
this.setRequestError($1,"client could not parse XML from server");$1.onstatus.sendEvent($1);return
};var $3=$1.proxied;if(!$1.parsexml){
$1.onstatus.sendEvent($1);return
}else{
if($3&&$2.childNodes[0].nodeName=="error"){
this.setRequestError($1,$2.childNodes[0].attributes["msg"]);$1.onstatus.sendEvent($1);return
}};var $4=new (lz.Param)();var $5=null;if($3){
var $6=$2.childNodes.length>1&&$2.childNodes[1].childNodes?$2.childNodes[1].childNodes:null;if($6!=null){
for(var $7=0;$7<$6.length;$7++){
var $8=$6[$7];if($8.attributes){
$4.addValue($8.attributes.name,$8.attributes.value)
}}};if($2.childNodes[0].childNodes){
$5=$2.childNodes[0].childNodes[0]
}}else{
var $6=$1.loader.getResponseHeaders();if($6){
$4.addObject($6)
};$5=$2
};$1.xmldata=$5;$1.responseheaders=$4;$1.onstatus.sendEvent($1)
}],null);lz.HTTPDataProvider=LzHTTPDataProvider;Class.make("LzDataset",[LzDataElementMixin,LzDataNodeMixin,LzNode],["rawdata",null,"dataprovider",void 0,"multirequest",false,"dataRequest",null,"dataRequestClass",LzHTTPDataRequest,"dsloadDel",null,"errorstring",void 0,"reqOnInitDel",void 0,"secureport",void 0,"proxyurl",null,"onerror",LzDeclaredEvent,"ontimeout",LzDeclaredEvent,"timeout",60000,"$lzc$set_timeout",function($1){
this.timeout=$1
},"postbody",null,"$lzc$set_postbody",function($1){
this.postbody=$1
},"acceptencodings",false,"type",null,"params",null,"nsprefix",false,"getresponseheaders",false,"querytype","GET","$lzc$set_querytype",function($1){
this.querytype=$1.toUpperCase()
},"trimwhitespace",false,"cacheable",false,"clientcacheable",true,"querystring",null,"src",null,"$lzc$set_src",function($1){
this.src=$1;if(this.autorequest){
this.doRequest()
}},"autorequest",false,"$lzc$set_autorequest",function($1){
this.autorequest=$1
},"request",false,"$lzc$set_request",function($1){
this.request=$1;if($1&&!this.isinited){
this.reqOnInitDel=new LzDelegate(this,"doRequest",this,"oninit")
}},"headers",null,"proxied",null,"$lzc$set_proxied",function($1){
var $2={"true":true,"false":false,"null":null,inherit:null}[$1];if($2!==void 0){
this.proxied=$2
}else{

}},"isProxied",function(){
return this.proxied!=null?this.proxied:canvas.proxied
},"responseheaders",null,"queuerequests",false,"oncanvas",void 0,"$lzc$set_initialdata",function($1){
if($1!=null){
var $2=LzDataElement.stringToLzData($1,this.trimwhitespace,this.nsprefix);if($2!=null){
this.$lzc$set_data($2.childNodes)
}}},"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"construct",function($1,$2){
this.nodeType=LzDataElement.DOCUMENT_NODE;this.ownerDocument=this;this.queuerequests=false;this.oncanvas=$1==canvas||$1==null;if(!("proxyurl" in $2)){
this.proxyurl=canvas.getProxyURL()
};if(("timeout" in $2)&&$2.timeout){
this.timeout=$2.timeout
}else{
this.timeout=canvas.dataloadtimeout
};if(("dataprovider" in $2)&&$2.dataprovider){
this.dataprovider=$2.dataprovider
}else{
this.dataprovider=canvas.defaultdataprovider
};(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
},"$lzc$set_name",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzc$set_name"]:this.nextMethod(arguments.callee,"$lzc$set_name")).apply(this,arguments);if($1!=null){
this.nodeName=$1;if(this.oncanvas){
canvas[$1]=this
}else{
$1=this.parent.getUID()+"."+$1
};canvas.datasets[$1]=this
}},"destroy",function(){
this.$lzc$set_childNodes([]);this.dataRequest=null;if(this.dsloadDel){
this.dsloadDel.unregisterAll()
};var $1=this.name;if(this.oncanvas){
if(canvas[$1]===this){
delete canvas[$1]
}}else{
$1=this.parent.getUID()+"."+$1
};if(canvas.datasets[$1]===this){
delete canvas.datasets[$1]
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this)
},"getErrorString",function(){
return this.errorstring
},"getLoadTime",function(){
var $1=this.dataRequest;return $1?$1.loadtime:0
},"getSrc",function(){
return this.src
},"getQueryString",function(){
if(typeof this.querystring=="undefined"){
return ""
}else{
return this.querystring
}},"getParams",function(){
if(this.params==null){
this.params=new (lz.Param)()
};return this.params
},"$lzc$set_data",function($1){
if($1==null){
return
}else{
if($1 instanceof Array){
this.$lzc$set_childNodes($1)
}else{
this.$lzc$set_childNodes([$1])
}};this.data=$1;if(this.ondata.ready){
this.ondata.sendEvent(this)
}},"gotError",function($1){
this.errorstring=$1;if(this.onerror.ready){
this.onerror.sendEvent(this)
}},"gotTimeout",function(){
if(this.ontimeout.ready){
this.ontimeout.sendEvent(this)
}},"getContext",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this
},"getDataset",function(){
return this
},"getPointer",function(){
var $1=new LzDatapointer(null);$1.p=this.getContext();return $1
},"setQueryString",function($1){
this.params=null;if(typeof $1=="object"){
if($1 instanceof lz.Param){
this.querystring=$1.toString()
}else{
var $2=new (lz.Param)();for(var $3 in $1){
$2.setValue($3,$1[$3],true)
};this.querystring=$2.toString();$2.destroy()
}}else{
this.querystring=$1
};if(this.autorequest){
this.doRequest()
}},"setQueryParam",function($1,$2){
this.querystring=null;if(!this.params){
this.params=new (lz.Param)()
};this.params.setValue($1,$2);if(this.autorequest){
this.doRequest()
}},"setQueryParams",function($1){
this.querystring=null;if(!this.params){
this.params=new (lz.Param)()
};if($1){
this.params.addObject($1)
}else{
if($1==null){
this.params.remove()
}};if($1&&this.autorequest){
this.doRequest()
}},"setSrc",function($1){
this.$lzc$set_src($1)
},"setProxyRequests",function($1){
this.$lzc$set_proxied($1)
},"setRequest",function($1){
this.$lzc$set_request($1)
},"setAutorequest",function($1){
this.$lzc$set_autorequest($1)
},"setPostBody",function($1){
this.$lzc$set_postbody($1)
},"setQueryType",function($1){
this.$lzc$set_querytype($1)
},"setInitialData",function($1){
this.$lzc$set_initialdata($1)
},"abort",function(){
var $1=this.dataRequest;if($1){
this.dataprovider.abortLoadForRequest($1)
}},"doRequest",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(!this.src){
return
};if(this.multirequest||this.dataRequest==null||this.queuerequests){
this.dataRequest=new (this.dataRequestClass)(this)
};var $2=this.dataRequest;$2.src=this.src;$2.timeout=this.timeout;$2.status=LzDataRequest.READY;$2.method=this.querytype;$2.postbody=null;if(this.querystring){
$2.queryparams=new (lz.Param)();$2.queryparams.addObject(lz.Param.parseQueryString(this.querystring))
}else{
$2.queryparams=this.params
};if(this.querytype.toUpperCase()=="POST"){
var $3=this.postbody;if($2.queryparams){
$3=$2.queryparams.getValue("lzpostbody");if($3!=null){
$2.queryparams.remove("lzpostbody")
}};if($3!=null){
$2.postbody=$3
}};$2.proxied=this.isProxied();$2.proxyurl=this.proxyurl;$2.queuerequests=this.queuerequests;$2.requestheaders=this.headers;$2.getresponseheaders=this.getresponseheaders;$2.secureport=this.secureport;$2.cacheable=this.cacheable;$2.clientcacheable=this.clientcacheable;$2.trimwhitespace=this.trimwhitespace;$2.nsprefix=this.nsprefix;if(this.dsloadDel==null){
this.dsloadDel=new LzDelegate(this,"handleDataResponse",$2,"onstatus")
}else{
this.dsloadDel.register($2,"onstatus")
};this.dataprovider.doRequest($2)
},"handleDataResponse",function($1){
if(this.dsloadDel!=null){
this.dsloadDel.unregisterFrom($1.onstatus)
};this.rawdata=$1.rawdata;this.errorstring=null;if($1.status==LzDataRequest.SUCCESS){
if(this.responseheaders!=null){
this.responseheaders.destroy()
};this.responseheaders=$1.responseheaders;this.$lzc$set_data($1.xmldata)
}else{
if($1.status==LzDataRequest.ERROR){
this.gotError($1.error)
}else{
if($1.status==LzDataRequest.TIMEOUT){
this.gotTimeout()
}}}},"setHeader",function($1,$2){
if(!this.headers){
this.headers=new (lz.Param)()
};this.headers.setValue($1,$2)
},"getRequestHeaderParams",function(){
return this.headers
},"clearRequestHeaderParams",function(){
if(this.headers){
this.headers.remove()
}},"getResponseHeader",function($1){
var $2=this.responseheaders;if($2){
var $3=$2.getValues($1);if($3&&$3.length==1){
return $3[0]
}else{
return $3
}};return void 0
},"getAllResponseHeaders",function(){
return this.responseheaders
},"toString",function(){
return "LzDataset "+":"+this.name
}],["tagname","dataset","attributes",new LzInheritedHash(LzNode.attributes),"slashPat","/","queryStringToTable",function($1){
var $2={};var $3=$1.split("&");for(var $4=0;$4<$3.length;++$4){
var $5=$3[$4];var $6="";var $7=$5.indexOf("=");if($7>0){
$6=unescape($5.substring($7+1));$5=$5.substring(0,$7)
};if($5 in $2){
var $8=$2[$5];if($8 instanceof Array){
$8.push($6)
}else{
$2[$5]=[$8,$6]
}}else{
$2[$5]=$6
}};return $2
}]);(function($1){
with($1){
with($1.prototype){
LzDataset.attributes.name="localdata"
}}})(LzDataset);lz[LzDataset.tagname]=LzDataset;Class.make("__LzHttpDatasetPoolClass",null,["_uid",0,"_p",[],"get",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};var $5;if(this._p.length>0){
$5=this._p.pop()
}else{
$5=new LzDataset(null,{name:"LzHttpDatasetPool"+this._uid,type:"http",acceptencodings:$4});this._uid++
};if($1!=null){
$1.register($5,"ondata")
};if($2!=null){
$2.register($5,"onerror")
};if($3!=null){
$3.register($5,"ontimeout")
};return $5
},"recycle",function($1){
$1.setQueryParams(null);$1.$lzc$set_postbody(null);$1.clearRequestHeaderParams();$1.ondata.clearDelegates();$1.ontimeout.clearDelegates();$1.onerror.clearDelegates();$1.$lzc$set_data([]);this._p.push($1)
}],null);var LzHttpDatasetPool=new __LzHttpDatasetPoolClass();Class.make("LzDatapointer",LzNode,["$lzc$set_xpath",function($1){
this.setXPath($1)
},"$lzc$set_context",function($1){
this.setDataContext($1)
},"$lzc$set_pointer",function($1){
this.setPointer($1)
},"$lzc$set_p",function($1){
this.setPointer($1)
},"p",null,"context",null,"__LZtracking",null,"__LZtrackDel",null,"xpath",null,"parsedPath",null,"__LZlastdotdot",null,"__LZspecialDotDot",false,"__LZdotdotCheckDel",null,"errorDel",null,"timeoutDel",null,"rerunxpath",false,"onp",LzDeclaredEvent,"onDocumentChange",LzDeclaredEvent,"onerror",LzDeclaredEvent,"ontimeout",LzDeclaredEvent,"onrerunxpath",LzDeclaredEvent,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"gotError",function($1){
if(this.onerror.ready){
this.onerror.sendEvent($1)
}},"gotTimeout",function($1){
if(this.ontimeout.ready){
this.ontimeout.sendEvent($1)
}},"xpathQuery",function($1){
var $2=this.parsePath($1);var $3=$2.getContext(this);var $4=this.__LZgetNodes($2,$3?$3:this.p);if($4==null){
return null
};if($2.aggOperator!=null){
if($2.aggOperator=="last"){
if(Array["$lzsc$isa"]?Array.$lzsc$isa($4):$4 instanceof Array){
return $4.length
}else{
if(!$3&&$4===this.p){
if($2.selectors&&$2.selectors.length>0){
var $5=$2.selectors;var $6=0;while($5[$6]=="."&&$6<$5.length){
++$6
};return $6!=$5.length?1:this.__LZgetLast()
}else{
return this.__LZgetLast()
}}else{
return 1
}}}else{
if($2.aggOperator=="position"){
if(Array["$lzsc$isa"]?Array.$lzsc$isa($4):$4 instanceof Array){
var $7=[];for(var $6=0;$6<$4.length;$6++){
$7.push($6+1)
};return $7
}else{
if(!$3&&$4===this.p){
if($2.selectors&&$2.selectors.length>0){
var $5=$2.selectors;var $6=0;while($5[$6]=="."&&$6<$5.length){
++$6
};return $6!=$5.length?1:this.__LZgetPosition()
}else{
return this.__LZgetPosition()
}}else{
return 1
}}}}}else{
if($2.operator!=null){
if(Array["$lzsc$isa"]?Array.$lzsc$isa($4):$4 instanceof Array){
var $8=[];for(var $6=0;$6<$4.length;$6++){
$8.push(this.__LZprocessOperator($4[$6],$2))
};return $8
}else{
return this.__LZprocessOperator($4,$2)
}}else{
return $4
}}},"$lzc$xpathQuery_dependencies",function($1,$2,$3){
if(this["parsePath"]){
var $4=this.parsePath($3);return [$4.hasDotDot?$2.context.getContext().ownerDocument:$2,"DocumentChange"]
}else{
return [$2,"DocumentChange"]
}},"setPointer",function($1){
this.setXPath(null);if($1!=null){
this.setDataContext($1.ownerDocument)
}else{
this.__LZsetTracking(null)
};var $2=this.data!=$1;var $3=this.p!=$1;this.p=$1;this.data=$1;this.__LZsendUpdate($2,$3);return $1!=null
},"getDataset",function(){
if(this.p==null){
if(this.context===this){
return null
}else{
return this.context.getDataset()
}}else{
return this.p.ownerDocument
}},"setXPath",function($1){
if(!$1){
this.xpath=null;this.parsedPath=null;if(this.p){
this.__LZsetTracking(this.p.ownerDocument)
};return false
};this.xpath=$1;this.parsedPath=this.parsePath($1);var $2=this.parsedPath.getContext(this);if(this.rerunxpath&&this.parsedPath.hasDotDot&&!$2){
this.__LZspecialDotDot=true
}else{
if(this.__LZdotdotCheckDel){
this.__LZdotdotCheckDel.unregisterAll()
}};this.setDataContext($2);return this.runXPath()
},"runXPath",function(){
if(!this.parsedPath){
return false
};var $1=null;if(this.context&&((LzDatapointer["$lzsc$isa"]?LzDatapointer.$lzsc$isa(this.context):this.context instanceof LzDatapointer)||(LzDataset["$lzsc$isa"]?LzDataset.$lzsc$isa(this.context):this.context instanceof LzDataset)||(AnonDatasetGenerator["$lzsc$isa"]?AnonDatasetGenerator.$lzsc$isa(this.context):this.context instanceof AnonDatasetGenerator))){
$1=this.context.getContext()
};if($1){
var $2=this.__LZgetNodes(this.parsedPath,$1,0)
}else{
var $2=null
};if($2==null){
this.__LZHandleNoNodes();return false
}else{
if(Array["$lzsc$isa"]?Array.$lzsc$isa($2):$2 instanceof Array){
this.__LZHandleMultiNodes($2);return false
}else{
this.__LZHandleSingleNode($2);return true
}}},"__LZsetupDotDot",function($1){
if(this.__LZlastdotdot!=$1.ownerDocument){
if(this.__LZdotdotCheckDel==null){
this.__LZdotdotCheckDel=new LzDelegate(this,"__LZcheckDotDot")
}else{
this.__LZdotdotCheckDel.unregisterAll()
};this.__LZlastdotdot=$1.ownerDocument;this.__LZdotdotCheckDel.register(this.__LZlastdotdot,"onDocumentChange")
}},"__LZHandleSingleNode",function($1){
if(this.__LZspecialDotDot){
this.__LZsetupDotDot($1)
};this.__LZupdateLocked=true;this.__LZpchanged=$1!=this.p;this.p=$1;this.__LZsetData();this.__LZupdateLocked=false;this.__LZsendUpdate()
},"__LZHandleNoNodes",function(){
var $1=this.p!=null;var $2=this.data!=null;this.p=null;this.data=null;this.__LZsendUpdate($2,$1)
},"__LZHandleMultiNodes",function($1){
this.__LZHandleNoNodes();return null
},"__LZsetData",function(){
if(this.parsedPath&&this.parsedPath.aggOperator!=null){
if(this.parsedPath.aggOperator=="last"){
this.data=this.__LZgetLast();this.__LZsendUpdate(true)
}else{
if(this.parsedPath.aggOperator=="position"){
this.data=this.__LZgetPosition();this.__LZsendUpdate(true)
}}}else{
if(this.parsedPath&&this.parsedPath.operator!=null){
this.__LZsimpleOperatorUpdate()
}else{
if(this.data!=this.p){
this.data=this.p;this.__LZsendUpdate(true)
}}}},"__LZgetLast",function(){
var $1=this.context;if($1==null||$1===this||!(LzDatapointer["$lzsc$isa"]?LzDatapointer.$lzsc$isa($1):$1 instanceof LzDatapointer)){
return 1
}else{
return $1.__LZgetLast()||1
}},"__LZgetPosition",function(){
var $1=this.context;if($1==null||$1===this||!(LzDatapointer["$lzsc$isa"]?LzDatapointer.$lzsc$isa($1):$1 instanceof LzDatapointer)){
return 1
}else{
return $1.__LZgetPosition()||1
}},"__LZupdateLocked",false,"__LZpchanged",false,"__LZdchanged",false,"__LZsendUpdate",function($1,$2){
switch(arguments.length){
case 0:
$1=false;
case 1:
$2=false;

};this.__LZdchanged=$1||this.__LZdchanged;this.__LZpchanged=$2||this.__LZpchanged;if(this.__LZupdateLocked){
return false
};if(this.__LZdchanged){
if(this.ondata.ready){
this.ondata.sendEvent(this.data)
};this.__LZdchanged=false
};if(this.__LZpchanged){
if(this.onp.ready){
this.onp.sendEvent(this.p)
};this.__LZpchanged=false;if(this.onDocumentChange.ready){
this.onDocumentChange.sendEvent({who:this.p,type:2,what:"context"})
}};return true
},"isValid",function(){
return this.p!=null
},"__LZsimpleOperatorUpdate",function(){
var $1=this.p!=null?this.__LZprocessOperator(this.p,this.parsedPath):void 0;var $2=false;if(this.data!=$1||this.parsedPath.operator=="attributes"){
this.data=$1;$2=true
};this.__LZsendUpdate($2)
},"parsePath",function($1){
if(LzDatapath["$lzsc$isa"]?LzDatapath.$lzsc$isa($1):$1 instanceof LzDatapath){
var $2=$1.xpath
}else{
var $2=$1
};var $3=LzDatapointer.ppcache;var $4=$3[$2];if($4==null){
$4=new LzParsedPath($2,this);$3[$2]=$4
};return $4
},"getLocalDataContext",function($1){
var $2=this.parent;if($1){
var $3=$1;for(var $4=0;$4<$3.length&&$2!=null;$4++){
$2=$2[$3[$4]]
};if($2!=null&&!(LzDataset["$lzsc$isa"]?LzDataset.$lzsc$isa($2):$2 instanceof LzDataset)&&(LzDataset["$lzsc$isa"]?LzDataset.$lzsc$isa($2["localdata"]):$2["localdata"] instanceof LzDataset)){
$2=$2["localdata"];return $2
}};if($2!=null&&(LzDataset["$lzsc$isa"]?LzDataset.$lzsc$isa($2):$2 instanceof LzDataset)){
return $2
}else{
return null
}},"__LZgetNodes",function($1,$2,$3){
switch(arguments.length){
case 2:
$3=0;

};if($2==null){
return null
};if($1.selectors!=null){
var $4=$1.selectors.length;for(var $5=$3;$5<$4;$5++){
var $6=$1.selectors[$5];var $7=LzDatapointer.pathSymbols[$6]||0;var $8=$1.selectors[$5+1];if($8&&!(String["$lzsc$isa"]?String.$lzsc$isa($8):$8 instanceof String)&&$8["pred"]=="range"){
var $9=$1.selectors[++$5]
}else{
var $9=null
};var $10=null;if((Object["$lzsc$isa"]?Object.$lzsc$isa($6):$6 instanceof Object)&&("pred" in $6)&&null!=$6.pred){
if($6.pred=="hasattr"){
$2=$2.hasAttr($6.attr)?$2:null
}else{
if($6.pred=="attrval"){
if($2.attributes!=null){
$2=$2.attributes[$6.attr]==$6.val?$2:null
}else{
$2=null
}}}}else{
if($7==0){
$10=this.nodeByName($6,$9,$2)
}else{
if($7==1){
$2=$2.ownerDocument
}else{
if($7==2){
$2=$2.parentNode
}else{
if($7==3){
$10=[];if($2.childNodes){
var $11=$2.childNodes;var $12=$11.length;var $13=$9!=null?$9[0]:0;var $14=$9!=null?$9[1]:$12;var $15=0;for(var $16=0;$16<$12;$16++){
var $17=$11[$16];if($17.nodeType==LzDataElement.ELEMENT_NODE){
$15++;if($15>=$13){
$10.push($17)
};if($15==$14){
break
}}}}}}}}};if($10!=null){
if($10.length>1){
if($5==$4-1){
return $10
};var $18=[];for(var $16=0;$16<$10.length;$16++){
var $19=this.__LZgetNodes($1,$10[$16],$5+1);if($19!=null){
if(Array["$lzsc$isa"]?Array.$lzsc$isa($19):$19 instanceof Array){
for(var $20=0;$20<$19.length;$20++){
$18.push($19[$20])
}}else{
$18.push($19)
}}};if($18.length==0){
return null
}else{
if($18.length==1){
return $18[0]
}else{
return $18
}}}else{
$2=$10[0]
}};if($2==null){
return null
}}};return $2
},"getContext",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this.p
},"nodeByName",function($1,$2,$3){
if(!$3){
$3=this.p;if(!this.p){
return null
}};var $4=[];if($3.childNodes!=null){
var $5=$3.childNodes;var $6=$5.length;var $7=$2!=null?$2[0]:0;var $8=$2!=null?$2[1]:$6;var $9=0;for(var $10=0;$10<$6;$10++){
var $11=$5[$10];if($11.nodeName==$1){
$9++;if($9>=$7){
$4.push($11)
};if($9==$8){
break
}}}};return $4
},"$lzc$set_rerunxpath",function($1){
this.rerunxpath=$1;if(this.onrerunxpath.ready){
this.onrerunxpath.sendEvent($1)
}},"dupePointer",function(){
var $1=new LzDatapointer();$1.setFromPointer(this);return $1
},"__LZdoSelect",function($1,$2){
var $3=this.p;for(;$3!=null&&$2>0;$2--){
if($3.nodeType==LzDataNode.TEXT_NODE){
if($1=="getFirstChild"){
break
}};$3=$3[$1]()
};if($3!=null&&$2==0){
this.setPointer($3);return true
};return false
},"selectNext",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this.__LZdoSelect("getNextSibling",$1?$1:1)
},"selectPrev",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this.__LZdoSelect("getPreviousSibling",$1?$1:1)
},"selectChild",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this.__LZdoSelect("getFirstChild",$1?$1:1)
},"selectParent",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this.__LZdoSelect("getParent",$1?$1:1)
},"selectNextParent",function(){
var $1=this.p;if(this.selectParent()&&this.selectNext()){
return true
}else{
this.setPointer($1);return false
}},"getNodeOffset",function(){
return this.getXPathIndex()
},"getXPathIndex",function(){
if(!this.p){
return 0
};return this.p.getOffset()+1
},"getNodeType",function(){
if(!this.p){
return
};return this.p.nodeType
},"getNodeName",function(){
if(!this.p){
return null
};return this.p.nodeName
},"setNodeName",function($1){
if(!this.p){
return
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
this.p.$lzc$set_nodeName($1)
}},"getNodeAttributes",function(){
if(!this.p){
return null
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
return this.p.attributes
};return null
},"getNodeAttribute",function($1){
if(!this.p){
return null
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
return this.p.attributes[$1]
};return null
},"setNodeAttribute",function($1,$2){
if(!this.p){
return
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
this.p.setAttr($1,$2)
}},"deleteNodeAttribute",function($1){
if(!this.p){
return
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
this.p.removeAttr($1)
}},"getNodeText",function(){
if(!this.p){
return null
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
return this.p.__LZgetText()
};return null
},"setNodeText",function($1){
if(!this.p){
return
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
var $2=false;var $3=this.p.childNodes;for(var $4=0;$4<$3.length;$4++){
var $5=$3[$4];if($5.nodeType==LzDataElement.TEXT_NODE){
$5.$lzc$set_data($1);$2=true;break
}};if(!$2){
this.p.appendChild(new LzDataText($1))
}}},"getNodeCount",function(){
if(!this.p||this.p.nodeType==LzDataElement.TEXT_NODE){
return 0
};return this.p.childNodes.length||0
},"addNode",function($1,$2,$3){
switch(arguments.length){
case 1:
$2=null;
case 2:
$3=null;

};if(!this.p){
return null
};var $4=new LzDataElement($1,$3);if($2!=null){
$4.appendChild(new LzDataText($2))
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
this.p.appendChild($4)
};return $4
},"deleteNode",function(){
if(!this.p){
return
};var $1=this.p;if(!this.rerunxpath){
if(!(this.selectNext()||this.selectPrev())){
this.__LZHandleNoNodes()
}};$1.parentNode.removeChild($1);return $1
},"sendDataChange",function($1){
this.getDataset().sendDataChange($1)
},"comparePointer",function($1){
return this.p==$1.p
},"addNodeFromPointer",function($1){
if(!$1.p){
return null
};if(!this.p){
return null
};var $2=$1.p.cloneNode(true);if(this.p.nodeType!=LzDataElement.TEXT_NODE){
this.p.appendChild($2)
};return new LzDatapointer(null,{pointer:$2})
},"setFromPointer",function($1){
this.setPointer($1.p)
},"__LZprocessOperator",function($1,$2){
if($1==null){
return
};var $3=$2.operator;switch($3){
case "serialize":
return $1.serialize();
case "__LZgetText":
return $1.nodeType!=LzDataElement.TEXT_NODE?$1.__LZgetText():void 0;
case "nodeName":
return $1.nodeName;
default:
if($2.hasAttrOper){
if($1.nodeType!=LzDataElement.TEXT_NODE&&$1["attributes"]){
if($3=="attributes"){
return $1.attributes
}else{
return $1.attributes[$3.substr(11)]
}}else{
return
}}else{

};

}},"makeRootNode",function(){
return new LzDataElement("root")
},"finishRootNode",function($1){
return $1.childNodes[0]
},"makeElementNode",function($1,$2,$3){
var $4=new LzDataElement($2,$1);$3.appendChild($4);return $4
},"makeTextNode",function($1,$2){
var $3=new LzDataText($1);$2.appendChild($3);return $3
},"serialize",function(){
if(this.p==null){
return null
};return this.p.serialize()
},"setDataContext",function($1,$2){
switch(arguments.length){
case 1:
$2=false;

};if($1==null){
this.context=this;if(this.p){
this.__LZsetTracking(this.p.ownerDocument)
}}else{
if(this.context!=$1){
this.context=$1;if(this.errorDel!=null){
this.errorDel.unregisterAll();this.timeoutDel.unregisterAll()
};this.__LZsetTracking($1);var $3=this.xpath!=null;if($3){
if(this.errorDel==null){
this.errorDel=new LzDelegate(this,"gotError");this.timeoutDel=new LzDelegate(this,"gotTimeout")
};this.errorDel.register($1,"onerror");this.timeoutDel.register($1,"ontimeout")
}}}},"__LZcheckChange",function($1){
if(!this.rerunxpath){
if(!this.p||$1.who==this.context){
this.runXPath()
}else{
if(this.__LZneedsOpUpdate($1)){
this.__LZsimpleOperatorUpdate()
}};return false
}else{
if($1.type==2||($1.type==0||$1.type==1&&this.parsedPath&&this.parsedPath.hasOpSelector)&&(this.parsedPath&&this.parsedPath.hasDotDot||this.p==null||this.p.childOfNode($1.who))){
this.runXPath();return true
}else{
if(this.__LZneedsOpUpdate($1)){
this.__LZsimpleOperatorUpdate()
}};return false
}},"__LZneedsOpUpdate",function($1){
switch(arguments.length){
case 0:
$1=null;

};var $2=this.parsedPath;if($2!=null&&$2.operator!=null){
var $3=$1.who;var $4=$1.type;if($2.operator!="__LZgetText"){
return $4==1&&$3==this.p
}else{
return $4==0&&$3==this.p||$3.parentNode==this.p&&$3.nodeType==LzDataElement.TEXT_NODE
}}else{
return false
}},"__LZcheckDotDot",function($1){
var $2=$1.who;var $3=$1.type;if(($3==0||$3==1&&this.parsedPath.hasOpSelector)&&this.context.getContext().childOfNode($2)){
this.runXPath()
}},"destroy",function(){
this.__LZsetTracking(null);if(this.errorDel){
this.errorDel.unregisterAll()
};if(this.timeoutDel){
this.timeoutDel.unregisterAll()
};if(this.__LZdotdotCheckDel){
this.__LZdotdotCheckDel.unregisterAll()
};this.p=null;this.data=null;this.__LZlastdotdot=null;this.context=null;this.__LZtracking=null;(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},"__LZsetTracking",function($1,$2,$3){
switch(arguments.length){
case 1:
$2=false;
case 2:
$3=false;

};var $4=this.__LZtracking;var $5=this.__LZtrackDel;if($1){
if($4!=null&&$4.length==1&&$4[0]===$1){
return
};if($5){
$5.unregisterAll()
};var $6=$2||this.xpath;if($6){
if(!$5){
this.__LZtrackDel=$5=new LzDelegate(this,"__LZcheckChange")
};this.__LZtracking=$4=[$1];$5.register($1,"onDocumentChange")
}}else{
this.__LZtracking=[];if($5){
this.__LZtrackDel.unregisterAll()
}}}],["tagname","datapointer","attributes",{ignoreplacement:true},"ppcache",{},"pathSymbols",{"/":1,"..":2,"*":3,".":4}]);lz[LzDatapointer.tagname]=LzDatapointer;Class.make("LzParam",LzEventable,["d",null,"delimiter","&","$lzc$set_delimiter",function($1){
this.setDelimiter($1)
},"separator","=","$lzc$set_separator",function($1){
this.setSeparator($1)
},"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.d={}},"parseQueryString",function($1){
return lz.Param.parseQueryString($1)
},"addObject",function($1){
for(var $2 in $1){
this.setValue($2,$1[$2])
}},"clone",function($1){
switch(arguments.length){
case 0:
$1=null;

};var $2=new (lz.Param)();for(var $3 in this.d){
$2.d[$3]=this.d[$3].concat()
};return $2
},"remove",function($1){
switch(arguments.length){
case 0:
$1=null;

};if($1==null){
this.d={}}else{
var $2=this.d[$1];if($2!=null){
$2.shift();if(!$2.length){
delete this.d[$1]
}}}},"setValue",function($1,$2,$3){
switch(arguments.length){
case 2:
$3=false;

};if($3){
$2=encodeURIComponent($2)
};this.d[$1]=[$2]
},"addValue",function($1,$2,$3){
switch(arguments.length){
case 2:
$3=false;

};if($3){
$2=encodeURIComponent($2)
};var $4=this.d[$1];if($4==null){
this.d[$1]=[$2]
}else{
$4.push($2)
}},"getValue",function($1){
var $2=this.d[$1];if($2!=null){
return $2[0]
};return null
},"getValues",function($1){
var $2=this.d[$1];if($2!=null){
return $2.concat()
};return null
},"getValueNoCase",function($1){
var $2=this.getValues($1);return $2!=null&&$2.length==1?$2[0]:$2
},"getNames",function(){
var $1=[];for(var $2 in this.d){
$1.push($2)
};return $1
},"setDelimiter",function($1){
var $2=this.delimiter;this.delimiter=$1;return $2
},"setSeparator",function($1){
var $2=this.separator;this.separator=$1;return $2
},"toString",function(){
return this.serialize()
},"serialize",function($1,$2,$3){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=false;

};var $1=$1==null?this.separator:$1;var $4=$2==null?this.delimiter:$2;var $5="";var $6=false;for(var $7 in this.d){
var $8=this.d[$7];if($8!=null){
for(var $9=0;$9<$8.length;++$9){
if($6){
$5+=$4
};$5+=$7+$1+($3?encodeURIComponent($8[$9]):$8[$9]);$6=true
}}};return $5
}],["parseQueryString",function($1){
var $2=$1.split("&");var $3={};for(var $4=0;$4<$2.length;++$4){
var $5=$2[$4];var $6="";var $7=$5.indexOf("=");if($7>0){
$6=unescape($5.substring($7+1));$5=$5.substring(0,$7)
};$3[$5]=$6
};return $3
}]);lz.Param=LzParam;Class.make("LzParsedPath",null,["path",null,"selectors",null,"context",null,"dsetname",null,"dsrcname",null,"islocaldata",null,"operator",null,"aggOperator",null,"hasAttrOper",false,"hasOpSelector",false,"hasDotDot",false,"getContext",function($1){
if(this.context!=null){
return this.context
}else{
if(this.islocaldata!=null){
return $1.getLocalDataContext(this.islocaldata)
}else{
if(this.dsrcname!=null){
return canvas[this.dsrcname][this.dsetname]
}else{
if(this.dsetname!=null){
return canvas.datasets[this.dsetname]
}}}};return null
},"$lzsc$initialize",function($1,$2){
this.path=$1;this.selectors=[];var $3=$1.indexOf(":/");if($3>-1){
var $4=$1.substring(0,$3).split(":");if($4.length>1){
var $5=LzParsedPath.trim($4[0]);var $6=LzParsedPath.trim($4[1]);if($5=="local"){
this.islocaldata=$6.split(".")
}else{
this.dsrcname=$5;this.dsetname=$6
}}else{
var $7=LzParsedPath.trim($4[0]);if($7=="new"){
this.context=new AnonDatasetGenerator(this)
}else{
this.dsetname=$7
}};var $8=$1.substring($3+2)
}else{
var $8=$1
};var $9=[];var $10="";var $11=false;var $12=false;for(var $13=0;$13<$8.length;$13++){
var $14=$8.charAt($13);if($14=="\\"&&$12==false){
$12=true;continue
}else{
if($12==true){
$12=false;$10+=$14;continue
}else{
if($11==false&&$14=="/"){
$9.push($10);$10="";continue
}else{
if($14=="'"){
$11=$11?false:true
}}}};$10+=$14
};$9.push($10);if($9!=null){
for(var $13=0;$13<$9.length;$13++){
var $15=LzParsedPath.trim($9[$13]);if($13==$9.length-1){
if($15.charAt(0)=="@"){
this.hasAttrOper=true;if($15.charAt(1)=="*"){
this.operator="attributes"
}else{
this.operator="attributes."+$15.substring(1,$15.length)
};continue
}else{
if($15.charAt($15.length-1)==")"){
if($15.indexOf("last")>-1){
this.aggOperator="last"
}else{
if($15.indexOf("position")>-1){
this.aggOperator="position"
}else{
if($15.indexOf("name")>-1){
this.operator="nodeName"
}else{
if($15.indexOf("text")>-1){
this.operator="__LZgetText"
}else{
if($15.indexOf("serialize")>-1){
this.operator="serialize"
}else{

}}}}};continue
}else{
if($15==""){
continue
}}}};var $16=$15.split("[");var $17=LzParsedPath.trim($16[0]);this.selectors.push($17==""?"/":$17);if($17==""||$17==".."){
this.hasDotDot=true
};if($16!=null){
for(var $18=1;$18<$16.length;$18++){
var $19=LzParsedPath.trim($16[$18]);$19=$19.substring(0,$19.length-1);if(LzParsedPath.trim($19).charAt(0)=="@"){
var $20=$19.split("=");var $21;var $22=$20[0].substring(1);if($20.length>1){
var $23=LzParsedPath.trim($20[1]);$23=$23.substring(1,$23.length-1);$21={pred:"attrval",attr:LzParsedPath.trim($22),val:LzParsedPath.trim($23)}}else{
$21={pred:"hasattr",attr:LzParsedPath.trim($22)}};this.selectors.push($21);this.hasOpSelector=true
}else{
var $21=$19.split("-");$21[0]=LzParsedPath.trim($21[0]);if($21[0]==""){
$21[0]=1
};if($21[1]!=null){
$21[1]=LzParsedPath.trim($21[1])
};if($21[1]==""){
$21[1]=Infinity
}else{
if($21.length==1){
$21[1]=$21[0]
}};$21.pred="range";this.selectors.push($21)
}}}}}},"toString",function(){
return "Parsed path for path: "+this.path
},"debugWrite",function(){

}],["trim",function($1){
var $2=0;var $3=false;while($1.charAt($2)==" "){
$2++;$3=true
};var $4=$1.length-$2;while($1.charAt($2+$4-1)==" "){
$4--;$3=true
};return $3?$1.substr($2,$4):$1
}]);Class.make("AnonDatasetGenerator",LzEventable,["pp",null,"__LZdepChildren",null,"onDocumentChange",LzDeclaredEvent,"onerror",LzDeclaredEvent,"ontimeout",LzDeclaredEvent,"noncontext",true,"$lzsc$initialize",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.pp=$1
},"getContext",function(){
var $1=new LzDataset(null,{name:null});var $2=this.pp.selectors;if($2!=null){
var $3=$1.getPointer();for(var $4=0;$4<$2.length;$4++){
if($2[$4]=="/"){
continue
};$3.addNode($2[$4]);$3.selectChild()
}};return $1
},"getDataset",function(){
return null
}],null);Class.make("LzDatapath",LzDatapointer,["datacontrolsvisibility",true,"$lzc$set_datacontrolsvisibility",function($1){
this.datacontrolsvisibility=$1
},"__LZtakeDPSlot",true,"storednodes",null,"__LZneedsUpdateAfterInit",false,"__LZdepChildren",null,"sel",false,"__LZisclone",false,"pooling",false,"replication",void 0,"sortpath",void 0,"$lzc$set_sortpath",function($1){
this.setOrder($1)
},"setOrder",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if(this.__LZisclone){
this.immediateparent.cloneManager.setOrder($1,$2)
}else{
this.sortpath=$1;if($2!=null){
this.sortorder=$2
}}},"sortorder","ascending","$lzc$set_sortorder",function($1){
this.setComparator($1)
},"setComparator",function($1){
if(this.__LZisclone){
this.immediateparent.cloneManager.setComparator($1)
}else{
this.sortorder=$1
}},"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"construct",function($1,$2){
this.rerunxpath=true;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);if($2.datacontrolsvisibility!=null){
this.datacontrolsvisibility=$2.datacontrolsvisibility
};if(this.__LZtakeDPSlot){
this.immediateparent.datapath=this;var $3=this.immediateparent.searchParents("datapath").datapath;if($3!=null){
var $4=$3.__LZdepChildren;if($4!=null){
$3.__LZdepChildren=[];for(var $5=$4.length-1;$5>=0;$5--){
var $6=$4[$5];if($6!==this&&!(LzDataAttrBind["$lzsc$isa"]?LzDataAttrBind.$lzsc$isa($6):$6 instanceof LzDataAttrBind)&&$6.immediateparent!=this.immediateparent&&$6.immediateparent.childOf(this.immediateparent)){
$6.setDataContext(this,true)
}else{
$3.__LZdepChildren.push($6)
}}}}else{

}}},"__LZHandleMultiNodes",function($1){
var $2;if(this.replication=="lazy"){
$2=LzLazyReplicationManager
}else{
if(this.replication=="resize"){
$2=LzResizeReplicationManager
}else{
$2=LzReplicationManager
}};this.storednodes=$1;var $3=new $2(this,this._instanceAttrs);this.storednodes=null;return $3
},"setNodes",function($1){
var $2=this.__LZHandleMultiNodes($1);if(!$2){
$2=this
};$2.__LZsetTracking(null);if($1){
for(var $3=0;$3<$1.length;$3++){
var $4=$1[$3];var $5=$4.ownerDocument;$2.__LZsetTracking($5,true,$4!=$5)
}}},"__LZsendUpdate",function($1,$2){
switch(arguments.length){
case 0:
$1=false;
case 1:
$2=false;

};var $3=this.__LZpchanged;if(!(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsendUpdate"]:this.nextMethod(arguments.callee,"__LZsendUpdate")).call(this,$1,$2)){
return false
};if(this.immediateparent.isinited){
this.__LZApplyData($3)
}else{
this.__LZneedsUpdateAfterInit=true
};return true
},"__LZApplyDataOnInit",function(){
if(this.__LZneedsUpdateAfterInit){
this.__LZApplyData();this.__LZneedsUpdateAfterInit=false
}},"__LZApplyData",function($1){
switch(arguments.length){
case 0:
$1=false;

};var $2=this.immediateparent;if(this.datacontrolsvisibility){
if(LzView["$lzsc$isa"]?LzView.$lzsc$isa($2):$2 instanceof LzView){
var $3=$2;$3.__LZvizDat=this.p!=null;$3.__LZupdateShown()
}};var $4=$1||$2.data!=this.data||this.parsedPath&&this.parsedPath.operator=="attributes";this.data=this.data==null?null:this.data;$2.data=this.data;if($4){
if($2.ondata.ready){
$2.ondata.sendEvent(this.data)
};var $5=this.parsedPath;if($5&&($5.operator!=null||$5.aggOperator!=null)){
$2.applyData(this.data)
}}},"setDataContext",function($1,$2){
switch(arguments.length){
case 1:
$2=false;

};if($1==null&&this.immediateparent!=null){
$1=this.immediateparent.searchParents("datapath").datapath;$2=true
}else{

};if($1==this.context){
return
};if($2){
if($1.__LZdepChildren==null){
$1.__LZdepChildren=[this]
}else{
$1.__LZdepChildren.push(this)
}}else{
if(this.context&&(LzDatapath["$lzsc$isa"]?LzDatapath.$lzsc$isa(this.context):this.context instanceof LzDatapath)){
var $3=this.context.__LZdepChildren;if($3){
for(var $4=0;$4<$3.length;$4++){
if($3[$4]===this){
$3.splice($4,1);break
}}}}};(arguments.callee.superclass?arguments.callee.superclass.prototype["setDataContext"]:this.nextMethod(arguments.callee,"setDataContext")).call(this,$1)
},"destroy",function(){
this.__LZupdateLocked=true;var $1=this.context;if($1&&!$1.__LZdeleted&&(LzDatapath["$lzsc$isa"]?LzDatapath.$lzsc$isa($1):$1 instanceof LzDatapath)){
var $2=$1.__LZdepChildren;if($2!=null){
for(var $3=0;$3<$2.length;$3++){
if($2[$3]===this){
$2.splice($3,1);break
}}}};var $4=this.immediateparent;if(!$4.__LZdeleted){
var $5=this.__LZdepChildren;if($5!=null&&$5.length>0){
var $6=$4.searchParents("datapath").datapath;for(var $3=0;$3<$5.length;$3++){
$5[$3].setDataContext($6,true)
};this.__LZdepChildren=null
}};if($4.datapath===this){
$4.datapath=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},"updateData",function(){
this.__LZupdateData()
},"__LZupdateData",function($1){
switch(arguments.length){
case 0:
$1=false;

};if(!$1&&this.p){
this.p.__LZlockFromUpdate(this)
};var $2=this.parsedPath?this.parsedPath.operator:null;if($2!=null){
var $3=this.immediateparent.updateData();if($3!==void 0){
if($2=="nodeName"){
this.setNodeName($3)
}else{
if($2=="__LZgetText"){
this.setNodeText($3)
}else{
if($2=="attributes"){
this.p.$lzc$set_attributes($3)
}else{
this.setNodeAttribute($2.substring(11),$3)
}}}}};var $4=this.__LZdepChildren;if($4!=null){
for(var $5=0;$5<$4.length;$5++){
$4[$5].__LZupdateData(true)
}};if(!$1&&this.p){
this.p.__LZunlockFromUpdate(this)
}},"toString",function(){
return "Datapath for "+this.immediateparent
},"__LZcheckChange",function($1){
if(!(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZcheckChange"]:this.nextMethod(arguments.callee,"__LZcheckChange")).call(this,$1)){
if($1.who.childOfNode(this.p,true)&&this.onDocumentChange.ready){
this.onDocumentChange.sendEvent($1)
}};return false
},"__LZsetTracking",function($1,$2,$3){
switch(arguments.length){
case 1:
$2=false;
case 2:
$3=false;

};if(!$1||!$2){
return(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsetTracking"]:this.nextMethod(arguments.callee,"__LZsetTracking")).call(this,$1,true)
};var $4=this.__LZtracking;var $5=this.__LZtrackDel;if($3){
var $6=$4.length;for(var $7=0;$7<$6;$7++){
if($4[$7]===$1){
return
}}};if(!$5){
this.__LZtrackDel=$5=new LzDelegate(this,"__LZcheckChange")
};$4.push($1);$5.register($1,"onDocumentChange")
},"$lzc$set___LZmanager",function($1){
this.__LZisclone=true;this.immediateparent.cloneManager=$1;this.parsedPath=$1.parsedPath;this.xpath=$1.xpath;this.setDataContext($1)
},"setClonePointer",function($1){
var $2=this.p!=$1;this.p=$1;if($2){
if($1&&this.sel!=$1.sel){
this.sel=$1.sel||false;this.immediateparent.setSelected(this.sel)
};this.__LZpchanged=true;this.__LZsetData()
}},"setSelected",function($1){
this.p.sel=$1;this.sel=$1;this.immediateparent.setSelected($1)
},"__LZgetLast",function(){
var $1=this.context;if(this.__LZisclone){
return $1.nodes.length
}else{
if(this.p==$1.getContext()&&(LzDatapointer["$lzsc$isa"]?LzDatapointer.$lzsc$isa($1):$1 instanceof LzDatapointer)){
return $1.__LZgetLast()
}else{
return 1
}}},"__LZgetPosition",function(){
if(this.__LZisclone){
return this.immediateparent.clonenumber+1
}else{
var $1=this.context;if(this.p==$1.getContext()&&(LzDatapointer["$lzsc$isa"]?LzDatapointer.$lzsc$isa($1):$1 instanceof LzDatapointer)){
return $1.__LZgetPosition()
}else{
return 1
}}}],["tagname","datapath","attributes",new LzInheritedHash(LzDatapointer.attributes)]);lz[LzDatapath.tagname]=LzDatapath;Class.make("LzReplicationManager",LzDatapath,["asyncnew",true,"initialnodes",void 0,"clonePool",void 0,"cloneClass",void 0,"cloneParent",void 0,"cloneAttrs",void 0,"cloneChildren",void 0,"hasdata",void 0,"orderpath",void 0,"comparator",void 0,"__LZxpathconstr",null,"__LZxpathdepend",null,"visible",true,"__LZpreventXPathUpdate",false,"nodes",void 0,"clones",void 0,"__LZdataoffset",0,"onnodes",LzDeclaredEvent,"onclones",LzDeclaredEvent,"onvisible",LzDeclaredEvent,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"getDefaultPooling",function(){
return false
},"construct",function($1,$2){
this.pooling=this.getDefaultPooling();this.__LZtakeDPSlot=false;this.datacontrolsvisibility=false;var $3=$1.immediateparent;this.classroot=$3.classroot;if($3===canvas){
this.nodes=[];this.clones=[];this.clonePool=[];return
};this.datapath=this;var $4=$3.name;if($4!=null){
$2.name=$4;$3.immediateparent[$4]=null;$3.parent[$4]=null
};var $5=$3.$lzc$bind_id;if($5!=null){
$5.call(null,$3,false);$3.$lzc$bind_id=null;this.$lzc$bind_id=$5;$5.call(null,this)
};var $6=$3.$lzc$bind_name;if($6!=null){
$6.call(null,$3,false);$3.$lzc$bind_name=null;this.$lzc$bind_name=$6;$6.call(null,this)
};$2.xpath=LzNode._ignoreAttribute;if($1.sortpath!=null){
$2.sortpath=$1.sortpath
};if($1.sortorder!=null||$1.sortorder){
$2.sortorder=$1.sortorder
};this.initialnodes=$1.storednodes;if($1.__LZspecialDotDot){
this.__LZspecialDotDot=true;if($1.__LZdotdotCheckDel){
$1.__LZdotdotCheckDel.unregisterAll()
};$1.__LZspecialDotDot=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$3.parent,$2);if($3.parent!=$3.immediateparent){
$3.immediateparent[$2.name]=this
};this.xpath=$1.xpath;this.parsedPath=$1.parsedPath;this.cloneClass=$3.constructor;this.cloneParent=$3.parent;var $7=new LzInheritedHash($3._instanceAttrs);$7.datapath=LzNode._ignoreAttribute;$7.$datapath={"class":lz.datapath};$7.$datapath.attrs={datacontrolsvisibility:$1.datacontrolsvisibility,__LZmanager:this};delete $7.id;delete $7.name;delete $7.$lzc$bind_id;delete $7.$lzc$bind_name;this.cloneAttrs=$7;if($1.datacontrolsvisibility){
this.visible=true
}else{
if(!$3.isinited){
var $8=this.__LZgetInstanceAttr($3,"visible");if(typeof $8=="boolean"||(Boolean["$lzsc$isa"]?Boolean.$lzsc$isa($8):$8 instanceof Boolean)){
this.visible=$8
}else{
this.visible=$3.visible
}}else{
this.visible=$3.visible
}};if($2.pooling!=null){
this.pooling=$2.pooling
};var $9=this.__LZgetInstanceAttr($3,"datapath");if(LzAlwaysExpr["$lzsc$isa"]?LzAlwaysExpr.$lzsc$isa($9):$9 instanceof LzAlwaysExpr){
var $10=$9;this.__LZxpathconstr=$3[$10.methodName];this.__LZxpathdepend=$3[$10.dependenciesName];this.__LZpreventXPathUpdate=true;this.applyConstraintExpr(new LzAlwaysExpr("__LZxpathconstr","__LZxpathdepend"));this.__LZpreventXPathUpdate=false;if(this.pooling){
$3.releaseConstraintMethod($10.methodName)
}}else{
var $11=this.__LZgetInstanceAttr($1,"xpath");if(LzAlwaysExpr["$lzsc$isa"]?LzAlwaysExpr.$lzsc$isa($11):$11 instanceof LzAlwaysExpr){
var $12=new LzRefNode(this);var $13=$11;$12.__LZxpathconstr=$1[$13.methodName];$12.__LZxpathdepend=$1[$13.dependenciesName];this.__LZpreventXPathUpdate=true;$12.applyConstraintExpr(new LzAlwaysExpr("__LZxpathconstr","__LZxpathdepend"));this.__LZpreventXPathUpdate=false;if(this.pooling){
$1.releaseConstraintMethod($13.methodName)
}}};this.__LZsetCloneAttrs();if($3._instanceChildren){
this.cloneChildren=$3._instanceChildren.concat()
}else{
this.cloneChildren=[]
};var $14=$1.context;this.clones=[];this.clonePool=[];if(this.pooling){
$1.$lzc$set___LZmanager(this);this.clones.push($3);$3.immediateparent.addSubview($3)
}else{
this.destroyClone($3)
};this.setDataContext($14,$14 instanceof LzDatapointer)
},"__LZgetInstanceAttr",function($1,$2){
var $3=$1._instanceAttrs;if($3&&($2 in $3)){
return $3[$2]
}else{
var $4=$1["constructor"].attributes;if($4&&($2 in $4)){
return $4[$2]
}};return void 0
},"__LZsetCloneAttrs",function(){

},"constructWithArgs",function($1){
this.__LZHandleMultiNodes(this.initialnodes);this.initialnodes=null;if(this.visible==false){
this.$lzc$set_visible(false)
}},"setDataContext",function($1,$2){
switch(arguments.length){
case 1:
$2=false;

};if($1==null&&this.immediateparent!=null&&this.immediateparent["datapath"]!=null){
$1=this.immediateparent.datapath;$2=true
};(arguments.callee.superclass?arguments.callee.superclass.prototype["setDataContext"]:this.nextMethod(arguments.callee,"setDataContext")).call(this,$1,$2)
},"getCloneNumber",function($1){
return this.clones[$1]
},"__LZHandleNoNodes",function(){
this.nodes=[];var $1=this.clones;while($1.length){
if(this.pooling){
this.poolClone()
}else{
var $2=$1.pop();this.destroyClone($2)
}}},"__LZHandleSingleNode",function($1){
this.__LZHandleMultiNodes([$1])
},"__LZHandleMultiNodes",function($1){
var $2=this.parent&&this.parent.layouts?this.parent.layouts:[];for(var $3=0;$3<$2.length;++$3){
$2[$3].lock()
};this.hasdata=true;var $4=this.nodes;this.nodes=$1;if(this.onnodes.ready){
this.onnodes.sendEvent(this.nodes)
};if(this.__LZspecialDotDot){
this.__LZsetupDotDot($1[0])
};if(this.orderpath!=null&&this.nodes){
this.nodes=this.mergesort(this.nodes,0,this.nodes.length-1)
};this.__LZadjustVisibleClones($4,true);var $5=this.clones.length;for(var $3=0;$3<$5;$3++){
var $6=this.clones[$3];var $7=$3+this.__LZdataoffset;$6.clonenumber=$7;if(this.nodes){
$6.datapath.setClonePointer(this.nodes[$7])
};if($6.onclonenumber.ready){
$6.onclonenumber.sendEvent($7)
}};if(this.onclones.ready){
this.onclones.sendEvent(this.clones)
};for(var $3=0;$3<$2.length;++$3){
$2[$3].unlock()
};return null
},"__LZadjustVisibleClones",function($1,$2){
var $3=this.__LZdiffArrays($1,this.nodes);if(!this.pooling){
while(this.clones.length>$3){
var $4=this.clones.pop();this.destroyClone($4)
}};lz.Instantiator.enableDataReplicationQueuing();while(this.nodes&&this.nodes.length>this.clones.length){
var $5=this.getNewClone();if(!$5){
break
};this.clones.push($5)
};lz.Instantiator.clearDataReplicationQueue();while(this.nodes&&this.nodes.length<this.clones.length){
this.poolClone()
}},"mergesort",function($1,$2,$3){
if($2<$3){
var $4=$2+Math.floor(($3-$2)/2);var $5=this.mergesort($1,$2,$4);var $6=this.mergesort($1,$4+1,$3)
}else{
if($1.length==0){
return []
}else{
return [$1[$2]]
}};var $7=[];var $8=0;var $9=0;var $10=$5.length;var $11=$6.length;while($8<$10&&$9<$11){
if(this.orderf($6[$9],$5[$8])==1){
$7.push($6[$9++])
}else{
$7.push($5[$8++])
}};while($8<$10){
$7.push($5[$8++])
};while($9<$11){
$7.push($6[$9++])
};return $7
},"orderf",function($1,$2){
var $3=this.orderpath;this.p=$1;var $4=this.xpathQuery($3);this.p=$2;var $5=this.xpathQuery($3);this.p=null;if($4==null||$4==""){
$4="\n"
};if($5==null||$5==""){
$5="\n"
};return this.comparator($4,$5)
},"ascDict",function($1,$2){
if($1.toLowerCase()<$2.toLowerCase()){
return 1
}else{
return 0
}},"descDict",function($1,$2){
if($1.toLowerCase()>$2.toLowerCase()){
return 1
}else{
return 0
}},"setOrder",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};this.orderpath=null;if($2!=null){
this.setComparator($2)
};this.orderpath=$1;if(this.nodes&&this.nodes.length){
this.__LZHandleMultiNodes(this.nodes)
}},"setComparator",function($1){
if($1=="descending"){
$1=this.descDict
}else{
if($1=="ascending"){
$1=this.ascDict
}else{
if(Function["$lzsc$isa"]?Function.$lzsc$isa($1):$1 instanceof Function){

}else{

}}};this.comparator=$1;if(this.orderpath!=null&&this.nodes&&this.nodes.length){
this.__LZHandleMultiNodes(this.nodes)
}},"getNewClone",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(!this.cloneParent){
return null
};if(this.clonePool.length){
var $2=this.reattachClone(this.clonePool.pop())
}else{
var $2=new (this.cloneClass)(this.cloneParent,this.cloneAttrs,this.cloneChildren,$1==null?this.asyncnew:!$1)
};if(this.visible==false){
$2.$lzc$set_visible(false)
};return $2
},"poolClone",function(){
var $1=this.clones.pop();this.detachClone($1);this.clonePool.push($1)
},"destroyClone",function($1){
$1.destroy()
},"$lzc$set_datapath",function($1){
this.setXPath($1)
},"setXPath",function($1){
if(this.__LZpreventXPathUpdate){
return false
};return(arguments.callee.superclass?arguments.callee.superclass.prototype["setXPath"]:this.nextMethod(arguments.callee,"setXPath")).apply(this,arguments)
},"handleDeletedNode",function($1){
var $2=this.clones[$1];if(this.pooling){
this.detachClone($2);this.clonePool.push($2)
}else{
this.destroyClone($2)
};this.nodes.splice($1,1);this.clones.splice($1,1)
},"getCloneForNode",function($1,$2){
switch(arguments.length){
case 1:
$2=false;

};var $3=this.clones;var $4=$3.length;for(var $5=0;$5<$4;$5++){
if($3[$5].datapath.p==$1){
return $3[$5]
}};return null
},"toString",function(){
return "ReplicationManager in "+this.immediateparent
},"setVisible",function($1){
this.$lzc$set_visible($1)
},"$lzc$set_visible",function($1){
this.visible=$1;var $2=this.clones;var $3=$2.length;for(var $4=0;$4<$3;$4++){
$2[$4].$lzc$set_visible($1)
};if(this.onvisible.ready){
this.onvisible.sendEvent($1)
}},"__LZcheckChange",function($1){
this.p=this.nodes[0];var $2=(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZcheckChange"]:this.nextMethod(arguments.callee,"__LZcheckChange")).call(this,$1);this.p=null;if(!$2){
var $3=$1.who;var $4=this.clones;var $5=$4.length;for(var $6=0;$6<$5;$6++){
var $7=$4[$6];var $8=$7.datapath;if($8.__LZneedsOpUpdate($1)){
$8.__LZsetData()
};if($3.childOfNode($8.p,true)){
if($8.onDocumentChange.ready){
$8.onDocumentChange.sendEvent($1)
}}}};return false
},"__LZneedsOpUpdate",function($1){
switch(arguments.length){
case 0:
$1=null;

};return false
},"getContext",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this.nodes[0]
},"detachClone",function($1){
if($1.isdetatchedclone){
return
};$1.$lzc$set_visible(false);$1.addedToParent=false;var $2=$1.immediateparent.subviews;for(var $3=$2.length-1;$3>=0;$3--){
if($2[$3]==$1){
$2.splice($3,1);break
}};$1.datapath.__LZtrackDel.unregisterAll();var $4=$1.immediateparent.onremovesubview;if($4.ready){
$4.sendEvent($1)
};$1.isdetatchedclone=true;$1.datapath.p=null
},"reattachClone",function($1){
if(!$1.isdetatchedclone){
return $1
};$1.immediateparent.addSubview($1);$1.$lzc$set_visible(this.visible);$1.isdetatchedclone=false;return $1
},"__LZdiffArrays",function($1,$2){
var $3=0;var $4=$1?$1.length:0;var $5=$2?$2.length:0;while($3<$4&&$3<$5){
if($1[$3]!=$2[$3]){
return $3
};$3++
};return $3
},"updateData",function(){
this.__LZupdateData()
},"__LZupdateData",function($1){
switch(arguments.length){
case 0:
$1=false;

};var $2=this.clones;var $3=$2.length;for(var $4=0;$4<$3;$4++){
$2[$4].datapath.updateData()
}}],null);lz.ReplicationManager=LzReplicationManager;Class.make("LzRefNode",LzNode,["__LZxpathconstr",null,"__LZxpathdepend",null,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"$lzc$set_xpath",function($1){
this.parent.$lzc$set_xpath($1)
}],null);Class.make("LzDataAttrBind",LzDatapointer,["$lzsc$initialize",function($1,$2,$3,$4){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1);this.type=$4;this.setAttr=$2;this.pathparent=$1;this.node=$1.immediateparent;this.setXPath($3);this.rerunxpath=true;if($1.__LZdepChildren==null){
$1.__LZdepChildren=[this]
}else{
$1.__LZdepChildren.push(this)
}},"$pathbinding",true,"setAttr",void 0,"pathparent",void 0,"node",void 0,"type",void 0,"__LZsendUpdate",function($1,$2){
switch(arguments.length){
case 0:
$1=false;
case 1:
$2=false;

};var $3=(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsendUpdate"]:this.nextMethod(arguments.callee,"__LZsendUpdate")).call(this,$1,$2);if($3){
var $4=this.data;var $5=this.node;var $6=this.setAttr;if(this.__LZpchanged||$5[$6]!=$4||this.parsedPath.operator=="attributes"){
$5.acceptAttribute($6,this.type,$4==null?null:$4);if($5["__LZvizDat"]!=null){
$5.__LZvizDat=$5[$6]!=null;$5.__LZupdateShown()
}}};return $3
},"unregisterAll",function(){
var $1=this.pathparent.__LZdepChildren;if($1!=null){
for(var $2=0;$2<$1.length;$2++){
if($1[$2]===this){
$1.splice($2,1);break
}}};this.destroy()
},"setDataContext",function($1,$2){
switch(arguments.length){
case 1:
$2=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["setDataContext"]:this.nextMethod(arguments.callee,"setDataContext")).call(this,$1||this.pathparent,$2)
},"updateData",function(){
this.__LZupdateData()
},"__LZupdateData",function($1){
switch(arguments.length){
case 0:
$1=false;

};var $2=this.parsedPath.operator;if($2!=null){
var $3=this.node.presentAttribute(this.setAttr,this.type);if(this.data!=$3){
if($2=="nodeName"){
this.setNodeName($3)
}else{
if($2=="__LZgetText"){
this.setNodeText($3)
}else{
if($2=="attributes"){
this.p.$lzc$set_attributes($3)
}else{
this.setNodeAttribute($2.substring(11),$3)
}}}}}},"toString",function(){
return "binder "+this.xpath
}],null);Class.make("LzLazyReplicationManager",LzReplicationManager,["axis","y","sizeAxis",void 0,"cloneimmediateparent",void 0,"updateDel",void 0,"__LZoldnodelen",void 0,"spacing",0,"viewsize",0,"totalsize",0,"mask",null,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"getDefaultPooling",function(){
return true
},"construct",function($1,$2){
if($2.pooling!=null){
$2.pooling=true
};if($2.axis!=null){
this.axis=$2.axis
};this.sizeAxis=this.axis=="x"?"width":"height";(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.mask=$1.immediateparent.immediateparent.mask;var $3;if(this.cloneAttrs.options!=null){
$3=new LzInheritedHash(this.cloneAttrs.options);$3["ignorelayout"]=true
}else{
$3={ignorelayout:true}};var $4=this.clones[0];if($4){
$4.setOption("ignorelayout",true);var $5=$4.immediateparent.layouts;if($5!=null){
for(var $6=0;$6<$5.length;$6++){
$5[$6].removeSubview($4)
}}};this.cloneAttrs.options=$3;var $7=this.getNewClone(true);this.cloneimmediateparent=$7.immediateparent;if(this.initialnodes){
$7.datapath.setClonePointer(this.initialnodes[1])
};this.viewsize=$7[this.sizeAxis];$7.datapath.setClonePointer(null);this.clones.push($7);if($2.spacing==null){
$2.spacing=0
};this.totalsize=this.viewsize+$2.spacing;var $lzsc$1408302176=this.axis;var $lzsc$1215332541=this.totalsize;if(!$7.__LZdeleted){
var $lzsc$795310116="$lzc$set_"+$lzsc$1408302176;if(Function["$lzsc$isa"]?Function.$lzsc$isa($7[$lzsc$795310116]):$7[$lzsc$795310116] instanceof Function){
$7[$lzsc$795310116]($lzsc$1215332541)
}else{
$7[$lzsc$1408302176]=$lzsc$1215332541;var $lzsc$1875416072=$7["on"+$lzsc$1408302176];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$1875416072):$lzsc$1875416072 instanceof LzEvent){
if($lzsc$1875416072.ready){
$lzsc$1875416072.sendEvent($lzsc$1215332541)
}}}};this.__LZdataoffset=0;this.updateDel=new LzDelegate(this,"__LZhandleUpdate");this.updateDel.register(this.cloneimmediateparent,"on"+this.axis);this.updateDel.register(this.mask,"on"+this.sizeAxis)
},"__LZhandleUpdate",function($1){
this.__LZadjustVisibleClones(null,null)
},"__LZsetCloneAttrs",function(){
var $1;if(this.cloneAttrs.options!=null){
$1=new LzInheritedHash(this.cloneAttrs.options);$1["ignorelayout"]=true
}else{
$1={ignorelayout:true}};this.cloneAttrs.options=$1
},"__LZHandleNoNodes",function(){
this.__LZHandleMultiNodes([])
},"__LZadjustVisibleClones",function($1,$2){
var $3=this.cloneimmediateparent;var $4=this.nodes;var $5=this.axis;var $6=this.sizeAxis;var $7=this.totalsize;if($4){
var $8=$4.length;if(this.__LZoldnodelen!=$8){
var $lzsc$977054136=$8*$7-this.spacing;if(!$3.__LZdeleted){
var $lzsc$1369569301="$lzc$set_"+$6;if(Function["$lzsc$isa"]?Function.$lzsc$isa($3[$lzsc$1369569301]):$3[$lzsc$1369569301] instanceof Function){
$3[$lzsc$1369569301]($lzsc$977054136)
}else{
$3[$6]=$lzsc$977054136;var $lzsc$587551007=$3["on"+$6];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$587551007):$lzsc$587551007 instanceof LzEvent){
if($lzsc$587551007.ready){
$lzsc$587551007.sendEvent($lzsc$977054136)
}}}};this.__LZoldnodelen=$8
}};if(!(this.mask&&this.mask["hasset"+$6])){
return
};var $9=0;if($7!=0){
$9=Math.floor(-$3[$5]/$7);if(0>$9){
$9=0
}};var $10=0;var $11=this.clones.length;var $12=$9-this.__LZdataoffset;var $13=$9*$7+$3[$5];var $14=0;if(typeof $13=="number"){
$14=1+Math.floor((this.mask[$6]-$13)/$7)
};if($4!=null){
var $8=$4.length;if($14+$9>$8){
$14=$8-$9
}};if($12==0&&$14==$11){
return
};lz.Instantiator.enableDataReplicationQueuing();var $15=this.clones;this.clones=[];for(var $16=0;$16<$14;$16++){
var $17=null;if($16+$12<0){
if($14+$12<$11&&$11>0){
$17=$15[--$11]
}else{
$17=this.getNewClone()
}}else{
if($16+$12>=$11){
if($10<$12&&$10<$11){
$17=$15[$10++]
}else{
$17=this.getNewClone()
}}};if($17){
this.clones[$16]=$17;var $lzsc$1750337864=($16+$9)*$7;if(!$17.__LZdeleted){
var $lzsc$179711587="$lzc$set_"+$5;if(Function["$lzsc$isa"]?Function.$lzsc$isa($17[$lzsc$179711587]):$17[$lzsc$179711587] instanceof Function){
$17[$lzsc$179711587]($lzsc$1750337864)
}else{
$17[$5]=$lzsc$1750337864;var $lzsc$1557674831=$17["on"+$5];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$1557674831):$lzsc$1557674831 instanceof LzEvent){
if($lzsc$1557674831.ready){
$lzsc$1557674831.sendEvent($lzsc$1750337864)
}}}};$17.clonenumber=$9+$16;if($4){
$17.datapath.setClonePointer($4[$9+$16])
};if($17.onclonenumber.ready){
$17.onclonenumber.sendEvent($16)
}}else{
this.clones[$16]=$15[$16+$12]
}};var $18=this.clonePool;while($10<$12&&$10<$11){
var $19=$15[$10++];this.detachClone($19);$18.push($19)
};while($11>$14+$12&&$11>0){
var $19=$15[--$11];this.detachClone($19);$18.push($19)
};this.__LZdataoffset=$9;lz.Instantiator.clearDataReplicationQueue()
},"toString",function(){
return "Lazy clone manager in "+this.cloneimmediateparent
},"getCloneForNode",function($1,$2){
switch(arguments.length){
case 1:
$2=false;

};var $3=(arguments.callee.superclass?arguments.callee.superclass.prototype["getCloneForNode"]:this.nextMethod(arguments.callee,"getCloneForNode")).call(this,$1)||null;if(!$3&&!$2){
$3=this.getNewClone();$3.datapath.setClonePointer($1);this.detachClone($3);this.clonePool.push($3)
};return $3
},"getCloneNumber",function($1){
return this.getCloneForNode(this.nodes[$1])
}],null);lz.LazyReplicationManager=LzLazyReplicationManager;Class.make("LzResizeReplicationManager",LzLazyReplicationManager,["datasizevar",void 0,"__LZresizeupdating",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 2:
$3=null;
case 3:
$4=null;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"getDefaultPooling",function(){
return false
},"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.datasizevar="$"+this.getUID()+"track"
},"__LZHandleCloneResize",function($1){
var $2=this.datapath.p;if($2){
var $3=this.cloneManager;var $4=$3.datasizevar;var $5=$2.__LZgetSize($4)||$3.viewsize;if($1!=$5){
$2.__LZsetSize($4,$1);$3.__LZadjustVisibleClones(null,false)
}}},"__LZsetCloneAttrs",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsetCloneAttrs"]:this.nextMethod(arguments.callee,"__LZsetCloneAttrs")).call(this);var $1=this.cloneAttrs;$1.__LZHandleCloneResize=this.__LZHandleCloneResize;if(!$1["$delegates"]){
$1.$delegates=[]
};$1.$delegates.push("on"+(this.axis=="y"?"height":"width"),"__LZHandleCloneResize",null)
},"getPositionByNode",function($1){
var $2=-this.spacing;var $3;if(this.nodes!=null){
for(var $4=0;$4<this.nodes.length;$4++){
$3=this.nodes[$4];if($1==this.nodes[$4]){
return $2+this.spacing
};$2+=this.spacing+($3.__LZgetSize(this.datasizevar)||this.viewsize)
}};return undefined
},"__LZreleaseClone",function($1){
this.detachClone($1);this.clonePool.push($1)
},"__LZadjustVisibleClones",function($1,$2){
if(!this.mask["hasset"+this.sizeAxis]){
return
};if(this.__LZresizeupdating){
return
};this.__LZresizeupdating=true;var $3=this.nodes!=null?this.nodes.length:0;var $4=Math.floor(-this.cloneimmediateparent[this.axis]);if(0>$4){
$4=0
};var $5=this.mask[this.sizeAxis];var $6=-1;var $7=this.__LZdataoffset;if($2){
while(this.clones.length){
this.poolClone()
};var $8=null;var $9=0
}else{
var $8=this.clones;var $9=$8.length
};this.clones=[];var $10=-this.spacing;var $11=false;var $12=-1;var $13;var $14=true;for(var $15=0;$15<$3;$15++){
var $16=this.nodes[$15];var $17=$16.__LZgetSize(this.datasizevar);var $18=$17==null?this.viewsize:$17;$10+=this.spacing;if(!$11&&$6==-1&&$10-$4+$18>=0){
$14=$15!=0;$11=true;$13=$10;$6=$15;var $19=$15-$7;$19=$19>$9?$9:$19;if($19>0){
for(var $20=0;$20<$19;$20++){
var $21=$8[$20];this.__LZreleaseClone($21)
}}}else{
if($11&&$10-$4>$5){
$11=false;$12=$15-$6;var $22=$15-$7;$22=$22<0?0:$22;if($22<$9){
for(var $20=$22;$20<$9;$20++){
var $21=$8[$20];this.__LZreleaseClone($21)
}}}};if($11){
if($15>=$7&&$15<$7+$9){
var $23=$8[$15-$7]
}else{
var $23=null
};this.clones[$15-$6]=$23
};$10+=$18
};var $24=$13;if($14){
$24+=this.spacing
};for(var $15=0;$15<this.clones.length;$15++){
var $16=this.nodes[$15+$6];var $23=this.clones[$15];if(!$23){
$23=this.getNewClone();$23.clonenumber=$15+$6;$23.datapath.setClonePointer($16);if($23.onclonenumber.ready){
$23.onclonenumber.sendEvent($15+$6)
};this.clones[$15]=$23
};this.clones[$15]=$23;var $lzsc$1084624261=this.axis;if(!$23.__LZdeleted){
var $lzsc$26053177="$lzc$set_"+$lzsc$1084624261;if(Function["$lzsc$isa"]?Function.$lzsc$isa($23[$lzsc$26053177]):$23[$lzsc$26053177] instanceof Function){
$23[$lzsc$26053177]($24)
}else{
$23[$lzsc$1084624261]=$24;var $lzsc$132422605=$23["on"+$lzsc$1084624261];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$132422605):$lzsc$132422605 instanceof LzEvent){
if($lzsc$132422605.ready){
$lzsc$132422605.sendEvent($24)
}}}};var $17=$16.__LZgetSize(this.datasizevar);var $18=$17==null?this.viewsize:$17;if($23[this.sizeAxis]!=$18){
var $lzsc$1514356056=this.sizeAxis;if(!$23.__LZdeleted){
var $lzsc$832743739="$lzc$set_"+$lzsc$1514356056;if(Function["$lzsc$isa"]?Function.$lzsc$isa($23[$lzsc$832743739]):$23[$lzsc$832743739] instanceof Function){
$23[$lzsc$832743739]($18)
}else{
$23[$lzsc$1514356056]=$18;var $lzsc$2085024001=$23["on"+$lzsc$1514356056];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$2085024001):$lzsc$2085024001 instanceof LzEvent){
if($lzsc$2085024001.ready){
$lzsc$2085024001.sendEvent($18)
}}}}};$24+=$18+this.spacing
};this.__LZdataoffset=$6;var $lzsc$428290573=this.cloneimmediateparent;var $lzsc$599214779=this.sizeAxis;if(!$lzsc$428290573.__LZdeleted){
var $lzsc$803568498="$lzc$set_"+$lzsc$599214779;if(Function["$lzsc$isa"]?Function.$lzsc$isa($lzsc$428290573[$lzsc$803568498]):$lzsc$428290573[$lzsc$803568498] instanceof Function){
$lzsc$428290573[$lzsc$803568498]($10)
}else{
$lzsc$428290573[$lzsc$599214779]=$10;var $lzsc$525599427=$lzsc$428290573["on"+$lzsc$599214779];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$525599427):$lzsc$525599427 instanceof LzEvent){
if($lzsc$525599427.ready){
$lzsc$525599427.sendEvent($10)
}}}};this.__LZresizeupdating=false
}],null);lz.ResizeReplicationManager=LzResizeReplicationManager;Class.make("LzColorUtils",null,null,["stringToColor",function($1){
if(typeof $1!="string"){
return $1
};if(lz.colors[$1]!=null){
return lz.colors[$1]
};if(global[$1]!=null){
return global[$1]
};if($1.indexOf("rgb")!=-1){
return LzColorUtils.fromrgb($1)
};var $2=Number($1);if(isNaN($2)){
return $1
}else{
return $2
}},"fromrgb",function($1){
if(typeof $1!="string"){
return $1
};if($1.indexOf("rgb")==-1){
return LzColorUtils.stringToColor($1)
};var $2=$1.substring($1.indexOf("(")+1,$1.indexOf(")")).split(",");var $3=($2[0]<<16)+($2[1]<<8)+$2[2]*1;if($2.length>3){
$3+=$2[3]*0.01
};if(typeof $3=="number"){
return $3
};return 0
},"dectohex",function($1,$2){
switch(arguments.length){
case 1:
$2=0;

};if(typeof $1!="number"){
return $1
};$1=$1&16777215;var $3=$1.toString(16);var $4=$2-$3.length;while($4>0){
$3="0"+$3;$4--
};return $3
},"torgb",function($1){
if(typeof $1=="string"&&$1.indexOf("rgb")!=-1){
return $1
};var $2=LzColorUtils.inttohex($1);if(typeof $2!="string"){
return $2
};if(typeof $1=="number"||lz.colors[$1]!=null){
$1=$2
};if($1.length<6){
$1="#"+$1.charAt(1)+$1.charAt(1)+$1.charAt(2)+$1.charAt(2)+$1.charAt(3)+$1.charAt(3)+($1.length>4?$1.charAt(4)+$1.charAt(4):"")
};return($1.length>7?"rgba(":"rgb(")+parseInt($1.substring(1,3),16)+","+parseInt($1.substring(3,5),16)+","+parseInt($1.substring(5,7),16)+($1.length>7?","+parseInt($1.substring(7),16):"")+")"
},"tohsv",function($1){
var $2=($1>>16&255)/255,$3=($1>>8&255)/255,$4=($1&255)/255;var $5=Math.min($2,Math.min($3,$4)),$6=Math.max($2,Math.max($3,$4));var $7=$6;var $8=$6-$5;if($8==0){
return {h:0,s:0,v:$7}};var $9=$8/$6;if($2==$6){
var $10=($3-$4)/$8
}else{
if($3==$6){
var $10=2+($4-$2)/$8
}else{
var $10=4+($2-$3)/$8
}};$10*=60;if($10<0){
$10+=360
};return {h:$10,s:$9,v:$7}},"fromhsv",function($1,$2,$3){
var $4=$1/60;var $5=Math.floor($4);var $6=$5%6;var $7=$4-$5;var $8=$3*(1-$2);var $9=$3*(1-$7*$2);var $4=$3*(1-(1-$7)*$2);var $10,$11,$12;switch($6){
case 0:
$10=$3;$11=$4;$12=$8;break;
case 1:
$10=$9;$11=$3;$12=$8;break;
case 2:
$10=$8;$11=$3;$12=$4;break;
case 3:
$10=$8;$11=$9;$12=$3;break;
case 4:
$10=$4;$11=$8;$12=$3;break;
case 5:
$10=$3;$11=$8;$12=$9;break;

};return $10*255<<16|$11*255<<8|$12*255
},"convertColor",function($1){
if($1=="null"||$1==null){
return null
};return LzColorUtils.hextoint($1)
},"hextoint",function($1){
var $2=LzColorUtils.stringToColor($1);if(typeof $2!="string"){
return $2
};var $3=$1;$3=$3.slice(1);var $4=0;if($3.length>6){
$4=parseInt($3.slice(6),16)/25500;$3=$3.slice(0,6)
};var $2=parseInt($3,16);switch($3.length){
case 3:
return(($2&3840)<<8|($2&240)<<4|$2&15)*17+$4;
case 6:
return $2+$4;
default:
break;

};return 0
},"inttohex",function($1,$2){
switch(arguments.length){
case 1:
$2=6;

};var $3=LzColorUtils.stringToColor($1);if(typeof $3!="number"){
return $3
};return "#"+LzColorUtils.dectohex($3,$2)
}]);Class.make("LzUtilsClass",null,["__SimpleExprPattern",void 0,"__ElementPattern",void 0,"$lzsc$initialize",function(){
this.__SimpleExprPattern=new RegExp("^\\s*([$_A-Za-z][$\\w]*)((\\s*\\.\\s*[$_A-Za-z][$\\w]*)|(\\s*\\[\\s*\\d+\\s*\\]))*\\s*$");this.__ElementPattern=new RegExp("([$_A-Za-z][$\\w]*)|(\\d+)","g")
},"color",{hextoint:function($1){
return LzColorUtils.hextoint($1)
},inttohex:function($1){
return LzColorUtils.inttohex($1)
},torgb:function($1){
return LzColorUtils.torgb($1)
}},"hextoint",function($1){
return LzColorUtils.hextoint($1)
},"inttohex",function($1,$2){
switch(arguments.length){
case 1:
$2=6;

};return LzColorUtils.inttohex($1,$2)
},"dectohex",function($1,$2){
switch(arguments.length){
case 1:
$2=0;

};return LzColorUtils.dectohex($1,$2)
},"stringToColor",function($1){
return LzColorUtils.stringToColor($1)
},"torgb",function($1){
return LzColorUtils.torgb($1)
},"fromrgb",function($1){
return LzColorUtils.fromrgb($1)
},"colornames",lz.colors,"__unpackList",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if($2==null){
$2=canvas
};var $3=$1.split(",");for(var $4=0;$4<$3.length;$4++){
var $5=$3[$4];if($5==""){
continue
};while($5.charAt(0)==" "){
$5=$5.substring(1,$5.length)
};var $6=parseFloat($5);if(!isNaN($6)){
$3[$4]=$6
}else{
if($5.indexOf("'")!=-1){
var $7=$5.indexOf("'")+1;var $8=$5.lastIndexOf("'");$3[$4]=$5.substring($7,$8)
}else{
if($5=="true"||$5=="false"){
$3[$4]=$5=="true"
}else{
if($2[$5]){
$3[$4]=$2[$5]
}}}}};return $3
},"safeEval",function($1){
if($1.indexOf("new ")==0){
return this.safeNew($1)
};var $2=$1.indexOf("(");if($2!=-1){
var $3=$1.indexOf(")");var $4=$1.substring($2+1,$3);$1=$1.substring(0,$2)
};var $5=null,$6;if($1.match(this.__SimpleExprPattern)){
var $7=$1.match(this.__ElementPattern);$6=globalValue($7[0]);for(var $8=1,$9=$7.length;$8<$9;$8++){
$5=$6;$6=$6[$7[$8]]
}};if($4!=null){
var $4=lz.Utils.__unpackList($4,$5)
};if(!$4||$4.length==0){
return $6
};if($6){
var $10=$6.apply($5,$4);return $10
}},"safeNew",function($1){
var $2=$1;var $3=$1.indexOf("new ");if($3==-1){
return $1
};$1=$1.substring($3+4);var $4=$1.indexOf("(");if($4!=-1){
var $5=$1.indexOf(")");var $6=$1.substring($4+1,$5);$1=$1.substring(0,$4)
};var $7=globalValue($1);if(!$7){
return
};var $6=lz.Utils.__unpackList($6);var $8=$6.length;if($8==0){
return new $7()
}else{
if($8==1){
return new $7($6[0])
}else{
if($8==2){
return new $7($6[0],$6[1])
}else{
if($8==3){
return new $7($6[0],$6[1],$6[2])
}else{
if($8==4){
return new $7($6[0],$6[1],$6[2],$6[3])
}else{
if($8==5){
return new $7($6[0],$6[1],$6[2],$6[3],$6[4])
}else{
if($8==6){
return new $7($6[0],$6[1],$6[2],$6[3],$6[4],$6[5])
}else{
if($8==7){
return new $7($6[0],$6[1],$6[2],$6[3],$6[4],$6[5],$6[6])
}else{
if($8==8){
return new $7($6[0],$6[1],$6[2],$6[3],$6[4],$6[5],$6[6],$6[7])
}else{
if($8==9){
return new $7($6[0],$6[1],$6[2],$6[3],$6[4],$6[5],$6[6],$6[7],$6[8])
}else{
if($8==10){
return new $7($6[0],$6[1],$6[2],$6[3],$6[4],$6[5],$6[6],$6[7],$6[8],$6[9])
}else{
if($8==11){
return new $7($6[0],$6[1],$6[2],$6[3],$6[4],$6[5],$6[6],$6[7],$6[8],$6[9],$6[10])
}else{

}}}}}}}}}}}}}],null);lz.Utils=new LzUtilsClass();var LzUtils=lz.Utils;Class.make("LzInstantiatorService",LzEventable,["checkQDel",null,"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.checkQDel=new LzDelegate(this,"checkQ")
},"halted",false,"isimmediate",false,"isdatareplicating",false,"istrickling",false,"isUpdating",false,"safe",true,"timeout",500,"makeQ",[],"trickleQ",[],"tricklingQ",[],"datareplQ",void 0,"syncNew",true,"trickletime",10,"setSafeInstantiation",function($1){
this.safe=$1;if(this.instanceQ.length){
this.timeout=Infinity
}},"requestInstantiation",function($1,$2){
if(this.isimmediate){
this.createImmediate($1,$2.concat())
}else{
var $3=this.newReverseArray($2);if(this.isdatareplicating){
this.datareplQ.push($1,$3)
}else{
if(this.istrickling){
this.tricklingQ.push($1,$3)
}else{
this.makeQ.push($1,$3);this.checkUpdate()
}}}},"enableDataReplicationQueuing",function(){
this.isdatareplicating=true;this.datareplQ=[]
},"clearDataReplicationQueue",function(){
this.isdatareplicating=false;var $1=this.datareplQ;for(var $2=$1.length-1;$2>0;$2-=2){
this.makeQ.push($1[$2-1],$1[$2])
};this.datareplQ=null;this.checkUpdate()
},"newReverseArray",function($1){
var $2=$1.length;var $3=Array($2);for(var $4=0,$5=$2-1;$4<$2;){
$3[$4++]=$1[$5--]
};return $3
},"checkUpdate",function(){
if(!(this.isUpdating||this.halted)){
this.checkQDel.register(lz.Idle,"onidle");this.isUpdating=true
}},"checkQ",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(!this.makeQ.length){
if(!this.tricklingQ.length){
if(!this.trickleQ.length){
this.checkQDel.unregisterAll();this.isUpdating=false;return
}else{
var $2=this.trickleQ.shift();var $3=this.trickleQ.shift();this.tricklingQ.push($2,this.newReverseArray($3))
}};this.istrickling=true;this.makeSomeViews(this.tricklingQ,this.trickletime);this.istrickling=false
}else{
canvas.creatednodes+=this.makeSomeViews(this.makeQ,this.timeout);if(canvas.updatePercentCreatedEnabled){
canvas.updatePercentCreated()
}}},"makeSomeViews",function($1,$2){
var $3=new Date().getTime();var $4=0;while(new Date().getTime()-$3<$2&&$1.length){
var $5=$1.length;var $6=$1[$5-1];var $7=$1[$5-2];var $8=false;if($7["__LZdeleted"]||$6[0]&&$6[0]["__LZdeleted"]){
$1.length-=2;continue
};try{
while(new Date().getTime()-$3<$2){
if($5!=$1.length){
break
};if(!$6.length){
$8=true;break
};var $12=$6.pop();if($12){
$7.makeChild($12,true);$4++
}}}
finally{

};if($8){
$1.length=$5-2;$7.__LZinstantiationDone()
}};return $4
},"trickleInstantiate",function($1,$2){
this.trickleQ.push($1,$2);this.checkUpdate()
},"createImmediate",function($1,$2){
var $3=this.newReverseArray($2);var $4=this.isimmediate;this.isimmediate=true;this.makeSomeViews([$1,$3],Infinity);this.isimmediate=$4
},"completeTrickle",function($1){
if(this.tricklingQ[0]==$1){
var $2=this.isimmediate;this.isimmediate=true;this.makeSomeViews(this.tricklingQ,Infinity);this.isimmediate=$2;this.tricklingQ=[]
}else{
var $3=this.trickleQ;var $4=$3.length;for(var $5=0;$5<$4;$5+=2){
if($3[$5]==$1){
var $6=$3[$5+1];$3.splice($5,2);this.createImmediate($1,$6);return
}}}},"traceQ",function(){
var $1=this.makeQ.length;trace("****start trace");for(var $2=0;$2<$1;$2+=2){
var $3="";for(var $4=0;$4<this.makeQ[$2+1].length;$4++){
$3+=this.makeQ[$2+1][$4].name+" |"
};trace(this.makeQ[$2]+" : |"+$3+" >>> "+this.makeQ[$2].getUID())
};trace("****trace done")
},"halt",function(){
this.isUpdating=false;this.halted=true;this.checkQDel.unregisterAll()
},"resume",function(){
this.halted=false;this.checkUpdate()
},"drainQ",function($1){
var $2=this.timeout;var $3=this.trickletime;var $4=this.halted;this.timeout=$1;this.trickletime=$1;this.halted=false;this.isUpdating=true;this.checkQ();this.halted=$4;this.timeout=$2;this.trickletime=$3;return !this.isUpdating
}],["LzInstantiator",void 0]);(function($1){
with($1){
with($1.prototype){
LzInstantiatorService.LzInstantiator=new LzInstantiatorService()
}}})(LzInstantiatorService);lz.Instantiator=LzInstantiatorService.LzInstantiator;Class.make("LzGlobalMouseService",LzEventable,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"onmousemove",LzDeclaredEvent,"onmouseup",LzDeclaredEvent,"onmouseupoutside",LzDeclaredEvent,"onmouseover",LzDeclaredEvent,"onmouseout",LzDeclaredEvent,"onmousedown",LzDeclaredEvent,"onmousedragin",LzDeclaredEvent,"onmousedragout",LzDeclaredEvent,"onmouseleave",LzDeclaredEvent,"onclick",LzDeclaredEvent,"ondblclick",LzDeclaredEvent,"__movecounter",0,"__mouseEvent",function($1,$2){
if($1=="onmouseleave"){
canvas.onmouseleave.sendEvent()
}else{
if($1=="onmousemove"){
this.__movecounter++
}};var $3=this[$1];if($3){
if($3.ready){
$3.sendEvent($2)
}}else{

}}],["LzGlobalMouse",void 0]);(function($1){
with($1){
with($1.prototype){
LzGlobalMouseService.LzGlobalMouse=new LzGlobalMouseService()
}}})(LzGlobalMouseService);lz.GlobalMouseService=LzGlobalMouseService;lz.GlobalMouse=LzGlobalMouseService.LzGlobalMouse;Class.make("LzBrowserService",null,["capabilities",LzSprite.prototype.capabilities,"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"loadURL",function($1,$2,$3){
switch(arguments.length){
case 1:
$2=null;
case 2:
$3=null;

};LzBrowserKernel.loadURL($1,$2,$3)
},"loadJS",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};LzBrowserKernel.loadJS.apply(null,arguments)
},"callJS",function($1,$2,$3){
switch(arguments.length){
case 1:
$2=null;
case 2:
$3=null;

};LzBrowserKernel.callJS.apply(null,arguments)
},"getVersion",function(){
return LzBrowserKernel.getVersion()
},"getOS",function(){
return LzBrowserKernel.getOS()
},"getLoadURL",function(){
return LzBrowserKernel.getLoadURL()
},"getInitArg",function($1){
return LzBrowserKernel.getInitArg($1)
},"getAppID",function(){
return LzBrowserKernel.getAppID()
},"showMenu",function($1){
if(this.capabilities.runtimemenus){
LzBrowserKernel.showMenu($1)
}else{

}},"setClipboard",function($1){
if(this.capabilities.setclipboard){
LzBrowserKernel.setClipboard($1)
}else{

}},"isAAActive",function(){
if(this.capabilities.accessibility){
return LzBrowserKernel.isAAActive()
}else{
return false
}},"updateAccessibility",function(){
if(this.capabilities.accessibility){
LzBrowserKernel.updateAccessibility()
}else{

}},"loadProxyPolicy",function($1){
if(this.capabilities.proxypolicy){
LzBrowserKernel.loadProxyPolicy($1)
}else{

}},"postToLps",true,"parsedloadurl",null,"defaultPortNums",{http:80,https:443},"getBaseURL",function($1,$2){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;

};var $3=this.getLoadURLAsLzURL();if($1){
$3.protocol="https"
};if($2){
$3.port=$2
}else{
if($1&&$2==null){
$3.port=this.defaultPortNums[$3.protocol]
}};$3.query=null;return $3
},"getLoadURLAsLzURL",function(){
if(!this.parsedloadurl){
this.parsedloadurl=new LzURL(this.getLoadURL())
};return this.parsedloadurl.dupe()
},"toAbsoluteURL",function($1,$2){
if($1.indexOf("://")>-1||$1.indexOf("/@WEBAPP@/")==0||$1.indexOf("file:")==0){
return $1
};var $3=this.getLoadURLAsLzURL();$3.query=null;if($1.indexOf(":")>-1){
var $4=$1.indexOf(":");var $5=$3.protocol=="https";$3.protocol=$1.substring(0,$4);if($2||$5){
if($3.protocol=="http"){
$3.protocol="https"
}};var $6=$1.substring($4+1,$1.length);if($6.charAt(0)=="/"){
$3.path=$1.substring($4+1);$3.file=null
}else{
$3.file=$1.substring($4+1)
}}else{
if($1.charAt(0)=="/"){
$3.path=$1;$3.file=null
}else{
$3.file=$1
}};return $3.toString()
},"xmlEscape",function($1){
return LzDataElement.__LZXMLescape($1)
},"urlEscape",function($1){
return encodeURIComponent($1)
},"urlUnescape",function($1){
return decodeURIComponent($1)
},"usePost",function(){
return this.postToLps&&this.supportsPost()
},"supportsPost",function(){
return true
},"makeProxiedURL",function($1){
var $2=$1.headers;var $3=$1.postbody;var $4=$1.proxyurl;var $5=$1.serverproxyargs;var $6;if($5){
$6={url:this.toAbsoluteURL($1.url,$1.secure),lzt:$1.service,reqtype:$1.httpmethod.toUpperCase()};for(var $7 in $5){
$6[$7]=$5[$7]
}}else{
$6={url:this.toAbsoluteURL($1.url,$1.secure),lzt:$1.service,reqtype:$1.httpmethod.toUpperCase(),sendheaders:$1.sendheaders,trimwhitespace:$1.trimwhitespace,nsprefix:$1.trimwhitespace,timeout:$1.timeout,cache:$1.cacheable,ccache:$1.ccache}};if($3!=null){
$6.lzpostbody=$3
};if($2!=null){
var $8="";for(var $9 in $2){
$8+=$9+": "+$2[$9]+"\n"
};if($8!=""){
$6["headers"]=$8
}};if(!$1.ccache){
$6.__lzbc__=new Date().getTime()
};var $10="?";for(var $11 in $6){
var $12=$6[$11];if(typeof $12=="string"){
$12=encodeURIComponent($12);$12=$12.replace(LzDataset.slashPat,"%2F")
};$4+=$10+$11+"="+$12;$10="&"
};return $4
}],["LzBrowser",void 0]);(function($1){
with($1){
with($1.prototype){
LzBrowserService.LzBrowser=new LzBrowserService()
}}})(LzBrowserService);lz.BrowserService=LzBrowserService;lz.Browser=LzBrowserService.LzBrowser;Class.make("LzContextMenu",LzNode,["onmenuopen",LzDeclaredEvent,"kernel",null,"items",null,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 0:
$1=null;
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,(LzNode["$lzsc$isa"]?LzNode.$lzsc$isa($1):$1 instanceof LzNode)?$1:null,(LzNode["$lzsc$isa"]?LzNode.$lzsc$isa($1):$1 instanceof LzNode)?$2:{delegate:$1},$3,$4)
},"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2);this.kernel=new LzContextMenuKernel(this);this.items=[];var $3=$2&&$2["delegate"]||null;delete $2["delegate"];this.$lzc$set_delegate($3)
},"init",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this);var $1=this.immediateparent;if($1&&(LzView["$lzsc$isa"]?LzView.$lzsc$isa($1):$1 instanceof LzView)){
$1.$lzc$set_contextmenu(this)
}},"$lzc$set_delegate",function($1){
this.kernel.setDelegate($1)
},"setDelegate",function($1){
this.$lzc$set_delegate($1)
},"addItem",function($1){
this.items.push($1);this.kernel.addItem($1)
},"hideBuiltInItems",function(){
this.kernel.hideBuiltInItems()
},"showBuiltInItems",function(){
this.kernel.showBuiltInItems()
},"clearItems",function(){
this.items=[];this.kernel.clearItems()
},"getItems",function(){
return this.items
},"makeMenuItem",function($1,$2){
var $3=new LzContextMenuItem($1,$2);return $3
}],["tagname","contextmenu","attributes",new LzInheritedHash(LzNode.attributes)]);(function($1){
with($1){
with($1.prototype){
LzContextMenu.attributes.ignoreplacement=true
}}})(LzContextMenu);lz[LzContextMenu.tagname]=LzContextMenu;Class.make("LzContextMenuItem",LzNode,["onselect",LzDeclaredEvent,"kernel",null,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 1:
$2=null;
case 2:
$3=null;
case 3:
$4=false;

};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,(LzNode["$lzsc$isa"]?LzNode.$lzsc$isa($1):$1 instanceof LzNode)?$1:null,(LzNode["$lzsc$isa"]?LzNode.$lzsc$isa($1):$1 instanceof LzNode)?$2:{title:$1,delegate:$2},$3,$4)
},"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2);var $3=$2&&$2["title"]||"";delete $2["title"];var $4=$2&&$2["delegate"]||null;delete $2["delegate"];this.kernel=new LzContextMenuItemKernel(this,$3,$4);var $5=this.immediateparent;if($5&&(LzContextMenu["$lzsc$isa"]?LzContextMenu.$lzsc$isa($5):$5 instanceof LzContextMenu)){
$5.addItem(this)
}},"$lzc$set_delegate",function($1){
this.kernel.setDelegate($1)
},"$lzc$set_caption",function($1){
this.kernel.setCaption($1)
},"$lzc$set_enabled",function($1){
this.kernel.setEnabled($1)
},"$lzc$set_separatorbefore",function($1){
this.kernel.setSeparatorBefore($1)
},"$lzc$set_visible",function($1){
this.kernel.setVisible($1)
},"setDelegate",function($1){
this.$lzc$set_delegate($1)
},"setCaption",function($1){
this.$lzc$set_caption($1)
},"getCaption",function(){
return this.kernel.getCaption()
},"setEnabled",function($1){
this.$lzc$set_enabled($1)
},"setSeparatorBefore",function($1){
this.$lzc$set_separatorbefore($1)
},"setVisible",function($1){
this.$lzc$set_visible($1)
}],["tagname","contextmenuitem","attributes",new LzInheritedHash(LzNode.attributes)]);(function($1){
with($1){
with($1.prototype){

}}})(LzContextMenuItem);lz[LzContextMenuItem.tagname]=LzContextMenuItem;Class.make("LzModeManagerService",LzEventable,["onmode",LzDeclaredEvent,"__LZlastclick",null,"__LZlastClickTime",0,"willCall",false,"eventsLocked",false,"modeArray",new Array(),"remotedebug",null,"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);LzMouseKernel.setCallback(this,"rawMouseEvent")
},"makeModal",function($1){
if($1&&(this.modeArray.length==0||!this.hasMode($1))){
this.modeArray.push($1);if(this.onmode.ready){
this.onmode.sendEvent($1)
};var $2=lz.Focus.getFocus();if($2&&!$2.childOf($1)){
lz.Focus.clearFocus()
}}},"release",function($1){
var $2=this.modeArray;for(var $3=$2.length-1;$3>=0;$3--){
if($2[$3]==$1){
$2.splice($3,$2.length-$3);var $4=$2[$3-1];if(this.onmode.ready){
this.onmode.sendEvent($4||null)
};var $5=lz.Focus.getFocus();if($4&&$5&&!$5.childOf($4)){
lz.Focus.clearFocus()
};return
}}},"releaseAll",function(){
this.modeArray=new Array();if(this.onmode.ready){
this.onmode.sendEvent(null)
}},"handleMouseEvent",function($1,$2){
if($2=="onmouseup"){
lz.Track.__LZmouseup(null)
};if($1==null){
$1=this.__findInputtextSelection()
};lz.GlobalMouse.__mouseEvent($2,$1);if($1==null||this.eventsLocked){
return
};var $3=true;for(var $4=this.modeArray.length-1;$3&&$4>=0;--$4){
var $5=this.modeArray[$4];if($1.childOf($5)){
break
}else{
$3=$5.passModeEvent?$5.passModeEvent($2,$1):false
}};if($3){
if($2=="onclick"){
if(this.__LZlastclick==$1&&$1.ondblclick.ready&&LzTimeKernel.getTimer()-this.__LZlastClickTime<$1.DOUBLE_CLICK_TIME){
$2="ondblclick";lz.GlobalMouse.__mouseEvent($2,$1);this.__LZlastclick=null
}else{
this.__LZlastclick=$1;this.__LZlastClickTime=LzTimeKernel.getTimer()
}};$1.mouseevent($2);if($2=="onmousedown"){
lz.Focus.__LZcheckFocusChange($1)
}}},"__LZallowInput",function($1,$2){
return $2.childOf($1)
},"__LZallowFocus",function($1){
var $2=this.modeArray.length;return $2==0||$1.childOf(this.modeArray[$2-1])
},"globalLockMouseEvents",function(){
this.eventsLocked=true
},"globalUnlockMouseEvents",function(){
this.eventsLocked=false
},"hasMode",function($1){
var $2=this.modeArray;for(var $3=$2.length-1;$3>=0;$3--){
if($1==$2[$3]){
return true
}};return false
},"getModalView",function(){
return this.modeArray[this.modeArray.length-1]||null
},"__findInputtextSelection",function(){
return LzInputTextSprite.findSelection()
},"rawMouseEvent",function($1,$2){
if($1=="onmousemove"){
lz.GlobalMouse.__mouseEvent("onmousemove",null)
}else{
this.handleMouseEvent($2,$1)
}}],["LzModeManager",void 0]);(function($1){
with($1){
with($1.prototype){
LzModeManagerService.LzModeManager=new LzModeManagerService()
}}})(LzModeManagerService);lz.ModeManagerService=LzModeManagerService;lz.ModeManager=LzModeManagerService.LzModeManager;Class.make("LzCursorService",LzEventable,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"showHandCursor",function($1){
LzMouseKernel.showHandCursor($1)
},"setCursorGlobal",function($1){
LzMouseKernel.setCursorGlobal($1)
},"lock",function(){
LzMouseKernel.lock()
},"unlock",function(){
LzMouseKernel.unlock()
},"restoreCursor",function(){
LzMouseKernel.restoreCursor()
}],["LzCursor",void 0]);(function($1){
with($1){
with($1.prototype){
LzCursorService.LzCursor=new LzCursorService()
}}})(LzCursorService);lz.CursorService=LzCursorService;lz.Cursor=LzCursorService.LzCursor;Class.make("LzURL",null,["protocol",null,"host",null,"port",null,"path",null,"file",null,"query",null,"fragment",null,"_parsed",null,"$lzsc$initialize",function($1){
switch(arguments.length){
case 0:
$1=null;

};if($1!=null){
this.parseURL($1)
}},"parseURL",function($1){
if(this._parsed==$1){
return
};this._parsed=$1;var $2=0;var $3=$1.indexOf(":");var $4=$1.indexOf("?",$2);var $5=$1.indexOf("#",$2);var $6=$1.length;if($5!=-1){
$6=$5
};if($4!=-1){
$6=$4
};if($3!=-1){
this.protocol=$1.substring($2,$3);if($1.substring($3+1,$3+3)=="//"){
$2=$3+3;$3=$1.indexOf("/",$2);if($3==-1){
$3=$6
};var $7=$1.substring($2,$3);var $8=$7.indexOf(":");if($8==-1){
this.host=$7;this.port=null
}else{
this.host=$7.substring(0,$8);this.port=$7.substring($8+1)
}}else{
$3++
};$2=$3
};$3=$6;this._splitPath($1.substring($2,$3));if($5!=-1){
this.fragment=$1.substring($5+1,$1.length)
}else{
$5=$1.length
};if($4!=-1){
this.query=$1.substring($4+1,$5)
}},"_splitPath",function($1){
if($1==""){
return
};var $2=$1.lastIndexOf("/");if($2!=-1){
this.path=$1.substring(0,$2+1);this.file=$1.substring($2+1,$1.length);if(this.file==""){
this.file=null
};return
};this.path=null;this.file=$1
},"dupe",function(){
var $1=new LzURL();$1.protocol=this.protocol;$1.host=this.host;$1.port=this.port;$1.path=this.path;$1.file=this.file;$1.query=this.query;$1.fragment=this.fragment;return $1
},"toString",function(){
var $1="";if(this.protocol!=null){
$1+=this.protocol+":";if(this.host!=null){
$1+="//"+this.host;if(null!=this.port&&lz.Browser.defaultPortNums[this.protocol]!=this.port){
$1+=":"+this.port
}}};if(this.path!=null){
$1+=this.path
};if(null!=this.file){
$1+=this.file
};if(null!=this.query){
$1+="?"+this.query
};if(null!=this.fragment){
$1+="#"+this.fragment
};return $1
}],["merge",function($1,$2){
var $3=new LzURL();var $4={protocol:true,host:true,port:true,path:true,file:true,query:true,fragment:true};for(var $5 in $4){
$3[$5]=$1[$5]!=null?$1[$5]:$2[$5]
};return $3
}]);lz.URL=LzURL;Class.make("LzKeysService",LzEventable,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);LzKeyboardKernel.setCallback(this,"__keyEvent");if(lz.embed["mousewheel"]){
lz.embed.mousewheel.setCallback(this,"__mousewheelEvent")
}},"downKeysHash",{},"downKeysArray",[],"keycombos",{},"onkeydown",LzDeclaredEvent,"onkeyup",LzDeclaredEvent,"onmousewheeldelta",LzDeclaredEvent,"codemap",{shift:16,control:17,alt:18},"__keyEvent",function($1,$2,$3){
var $4=this.codemap;for(var $5 in $1){
var $6=$1[$5];if($4[$5]!=null){
$2=$4[$5]
};if($6){
this.gotKeyDown($2)
}else{
this.gotKeyUp($2)
}}},"gotKeyDown",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};var $3=this.downKeysHash;var $4=this.downKeysArray;var $5=!$3[$1];if($5){
$3[$1]=true;$4.push($1);$4.sort()
};if($5||$2!="extra"){
if($3[229]!=true){
if(this.onkeydown.ready){
this.onkeydown.sendEvent($1)
}}};if($5){
var $6=this.keycombos;for(var $7=0;$7<$4.length&&$6!=null;$7++){
$6=$6[$4[$7]]
};if($6!=null&&("delegates" in $6)){
var $8=$6.delegates;for(var $7=0;$7<$8.length;$7++){
$8[$7].execute($4)
}}}},"gotKeyUp",function($1){
var $2=this.downKeysHash;if($2[229]!=true&&!$2[$1]){
this.gotKeyDown($1)
};delete $2[$1];var $3=this.downKeysArray=[];for(var $4 in $2){
$3.push($4)
};if(this.onkeyup.ready){
this.onkeyup.sendEvent($1)
}},"isKeyDown",function($1){
if(typeof $1=="string"){
return this.downKeysHash[this.keyCodes[$1.toLowerCase()]]==true
}else{
var $2=true;var $3=this.downKeysHash;var $4=this.keyCodes;for(var $5=0;$5<$1.length;$5++){
$2=$2&&$3[$4[$1[$5].toLowerCase()]]==true
};return $2
}},"callOnKeyCombo",function($1,$2){
var $3=this.keyCodes;var $4=[];for(var $5=0;$5<$2.length;$5++){
$4.push($3[$2[$5].toLowerCase()])
};$4.sort();var $6=this.keycombos;for(var $5=0;$5<$4.length;$5++){
var $7=$6[$4[$5]];if($7==null){
$6[$4[$5]]=$7={delegates:[]}};$6=$7
};$6.delegates.push($1)
},"removeKeyComboCall",function($1,$2){
var $3=this.keyCodes;var $4=[];for(var $5=0;$5<$2.length;$5++){
$4.push($3[$2[$5].toLowerCase()])
};$4.sort();var $6=this.keycombos;for(var $5=0;$5<$4.length;$5++){
$6=$6[$4[$5]];if($6==null){
return false
}};for(var $5=$6.delegates.length-1;$5>=0;$5--){
if($6.delegates[$5]==$1){
$6.delegates.splice($5,1)
}}},"enableEnter",function($1){

},"mousewheeldelta",0,"__mousewheelEvent",function($1){
this.mousewheeldelta=$1;if(this.onmousewheeldelta.ready){
this.onmousewheeldelta.sendEvent($1)
}},"gotLastFocus",function($1){
LzKeyboardKernel.gotLastFocus()
},"keyCodes",{"0":48,")":48,";":186,":":186,"1":49,"!":49,"=":187,"+":187,"2":50,"@":50,"<":188,",":188,"3":51,"#":51,"-":189,"_":189,"4":52,"$":52,">":190,".":190,"5":53,"%":53,"/":191,"?":191,"6":54,"^":54,"`":192,"~":192,"7":55,"&":55,"[":219,"{":219,"8":56,"*":56,"\\":220,"|":220,"9":57,"(":57,"]":221,"}":221,'"':222,"'":222,a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,numbpad0:96,numbpad1:97,numbpad2:98,numbpad3:99,numbpad4:100,numbpad5:101,numbpad6:102,numbpad7:103,numbpad8:104,numbpad9:105,multiply:106,"add":107,subtract:109,decimal:110,divide:111,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123,backspace:8,tab:9,clear:12,enter:13,shift:16,control:17,alt:18,"pause":19,"break":19,capslock:20,esc:27,spacebar:32,pageup:33,pagedown:34,end:35,home:36,leftarrow:37,uparrow:38,rightarrow:39,downarrow:40,insert:45,"delete":46,help:47,numlock:144,screenlock:145,"IME":229}],["LzKeys",void 0]);(function($1){
with($1){
with($1.prototype){
LzKeysService.LzKeys=new LzKeysService()
}}})(LzKeysService);lz.KeysService=LzKeysService;lz.Keys=LzKeysService.LzKeys;Class.make("LzAudioService",null,["capabilities",LzSprite.prototype.capabilities,"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"playSound",function($1){
if(this.capabilities.audio){
LzAudioKernel.playSound($1)
}else{

}},"stopSound",function(){
if(this.capabilities.audio){
LzAudioKernel.stopSound()
}else{

}},"startSound",function(){
if(this.capabilities.audio){
LzAudioKernel.startSound()
}else{

}},"getVolume",function(){
if(this.capabilities.audio){
return LzAudioKernel.getVolume()
}else{

};return NaN
},"setVolume",function($1){
if(this.capabilities.audio){
LzAudioKernel.setVolume($1)
}else{

}},"getPan",function(){
if(this.capabilities.audio){
return LzAudioKernel.getPan()
}else{

};return NaN
},"setPan",function($1){
if(this.capabilities.audio){
LzAudioKernel.setPan($1)
}else{

}}],["LzAudio",void 0]);(function($1){
with($1){
with($1.prototype){
LzAudioService.LzAudio=new LzAudioService()
}}})(LzAudioService);lz.AudioService=LzAudioService;lz.Audio=LzAudioService.LzAudio;Class.make("LzHistoryService",LzEventable,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"isReady",false,"ready",false,"onready",LzDeclaredEvent,"persist",false,"_persistso",null,"offset",0,"__lzdirty",false,"__lzhistq",[],"__lzcurrstate",{},"capabilities",LzSprite.prototype.capabilities,"onoffset",LzDeclaredEvent,"receiveHistory",function($1){
if(this.persist&&!this._persistso){
this.__initPersist()
};var $2=this.__lzhistq.length;var $3=$1*1;if(!$3){
$3=0
}else{
if($3>$2-1){
$3=$2
}};var $4=this.__lzhistq[$3];for(var $5 in $4){
var $6=$4[$5];var $lzsc$325218254=global[$6.c];var $lzsc$1634028055=$6.n;var $lzsc$110920022=$6.v;if(!$lzsc$325218254.__LZdeleted){
var $lzsc$860646695="$lzc$set_"+$lzsc$1634028055;if(Function["$lzsc$isa"]?Function.$lzsc$isa($lzsc$325218254[$lzsc$860646695]):$lzsc$325218254[$lzsc$860646695] instanceof Function){
$lzsc$325218254[$lzsc$860646695]($lzsc$110920022)
}else{
$lzsc$325218254[$lzsc$1634028055]=$lzsc$110920022;var $lzsc$952050652=$lzsc$325218254["on"+$lzsc$1634028055];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$952050652):$lzsc$952050652 instanceof LzEvent){
if($lzsc$952050652.ready){
$lzsc$952050652.sendEvent($lzsc$110920022)
}}}}};if(!this.__LZdeleted){
if(Function["$lzsc$isa"]?Function.$lzsc$isa(this["$lzc$set_offset"]):this["$lzc$set_offset"] instanceof Function){
this["$lzc$set_offset"]($3)
}else{
this["offset"]=$3;var $lzsc$2041611702=this["onoffset"];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$2041611702):$lzsc$2041611702 instanceof LzEvent){
if($lzsc$2041611702.ready){
$lzsc$2041611702.sendEvent($3)
}}}};return $3
},"receiveEvent",function($1,$2){
if(!canvas.__LZdeleted){
var $lzsc$976031354="$lzc$set_"+$1;if(Function["$lzsc$isa"]?Function.$lzsc$isa(canvas[$lzsc$976031354]):canvas[$lzsc$976031354] instanceof Function){
canvas[$lzsc$976031354]($2)
}else{
canvas[$1]=$2;var $lzsc$1488120446=canvas["on"+$1];if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($lzsc$1488120446):$lzsc$1488120446 instanceof LzEvent){
if($lzsc$1488120446.ready){
$lzsc$1488120446.sendEvent($2)
}}}}},"getCanvasAttribute",function($1){
return canvas[$1]
},"setCanvasAttribute",function($1,$2){
this.receiveEvent($1,$2)
},"callMethod",function($1){
return LzBrowserKernel.callMethod($1)
},"save",function($1,$2,$3){
if(typeof $1!="string"){
if($1["id"]){
$1=$1["id"]
};if(!$1){
return
}};if($3==null){
$3=global[$1][$2]
};this.__lzcurrstate[$1]={c:$1,n:$2,v:$3};this.__lzdirty=true
},"commit",function(){
if(!this.__lzdirty){
return
};this.__lzhistq[this.offset]=this.__lzcurrstate;this.__lzhistq.length=this.offset+1;if(this.persist){
if(!this._persistso){
this.__initPersist()
};this._persistso.data[this.offset]=this.__lzcurrstate
};this.__lzcurrstate={};this.__lzdirty=false
},"move",function($1){
switch(arguments.length){
case 0:
$1=1;

};this.commit();var $2=this.offset+$1;if(0>=$2){
$2=0
};if(this.__lzhistq.length>=$2){
LzBrowserKernel.setHistory($2)
}},"next",function(){
this.move(1)
},"prev",function(){
this.move(-1)
},"__initPersist",function(){
if(this.persist){
if(!this._persistso){
this._persistso=LzBrowserKernel.getPersistedObject("historystate")
};if(this._persistso&&this._persistso.data){
var $1=this._persistso.data;this.__lzhistq=[];for(var $2 in $1){
this.__lzhistq[$2]=$1[$2]
}}}else{
if(this._persistso){
this._persistso=null
}}},"clear",function(){
if(this.persist){
if(!this._persistso){
this._persistso=LzBrowserKernel.getPersistedObject("historystate")
};this._persistso.clear()
};this.__lzhistq=[];this.offset=0;if(this.onoffset.ready){
this.onoffset.sendEvent(0)
}},"setPersist",function($1){
if(this.capabilities.persistence){
this.persist=$1
}else{

}},"__start",function($1){
lz.Browser.callJS("lz.embed.history.listen('"+$1+"')");this.isReady=true;this.ready=true;if(this.onready.ready){
this.onready.sendEvent(true)
}}],["LzHistory",void 0]);(function($1){
with($1){
with($1.prototype){
LzHistoryService.LzHistory=new LzHistoryService()
}}})(LzHistoryService);lz.HistoryService=LzHistoryService;lz.History=LzHistoryService.LzHistory;Class.make("LzTrackService",LzEventable,["__LZreg",new Object(),"__LZactivegroups",null,"__LZtrackDel",null,"__LZmouseupDel",null,"__LZdestroydel",null,"__LZlastmouseup",null,"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.__LZtrackDel=new LzDelegate(this,"__LZtrack");this.__LZmouseupDel=new LzDelegate(this,"__LZmouseup",lz.GlobalMouse,"onmouseup");this.__LZdestroydel=new LzDelegate(this,"__LZdestroyitem");this.__LZactivegroups=[]
},"register",function($1,$2){
if($1==null||$2==null){
return
};var $3=this.__LZreg[$2];if(!$3){
this.__LZreg[$2]=$3=[];$3.__LZlasthit=null;$3.__LZactive=false
};$3.push($1);this.__LZdestroydel.register($1,"ondestroy")
},"unregister",function($1,$2){
if($1==null||$2==null){
return
};var $3=this.__LZreg[$2];if($3){
for(var $4=0;$4<$3.length;$4++){
if($3[$4]==$1){
$3.splice($4,1)
}};if($3.length==0){
if($3.__LZactive){
this.deactivate($2)
};delete this.__LZreg[$2]
}};this.__LZdestroydel.unregisterFrom($1.ondestroy)
},"__LZdestroyitem",function($1){
for(var $2 in this.__LZreg){
this.unregister($1,$2)
}},"activate",function($1){
var $2=this.__LZreg[$1];if($2&&!$2.__LZactive){
$2.__LZactive=true;var $3=this.__LZactivegroups;if($3.length==0){
this.__LZtrackDel.register(lz.Idle,"onidle")
};$3.push($2)
}},"deactivate",function($1){
var $2=this.__LZreg[$1];if($2&&$2.__LZactive){
var $3=this.__LZactivegroups;for(var $4=0;$4<$3.length;++$4){
if($3[$4]==$2){
$3.splice($4,1);break
}};if($3.length==0){
this.__LZtrackDel.unregisterAll()
};$2.__LZactive=false;$2.__LZlasthit=null
}},"__LZtopview",function($1,$2){
var $3=$1;var $4=$2;while($3.nodeLevel<$4.nodeLevel){
$4=$4.immediateparent;if($4==$1){
return $2
}};while($4.nodeLevel<$3.nodeLevel){
$3=$3.immediateparent;if($3==$2){
return $1
}};while($3.immediateparent!=$4.immediateparent){
$3=$3.immediateparent;$4=$4.immediateparent
};return $3.getZ()>$4.getZ()?$1:$2
},"__LZfindTopmost",function($1){
var $2=$1[0];for(var $3=1;$3<$1.length;$3++){
$2=this.__LZtopview($2,$1[$3])
};return $2
},"__LZtrackgroup",function($1,$2){
for(var $3=0;$3<$1.length;$3++){
var $4=$1[$3];if($4.visible){
var $5=$4.getMouse(null);var $6=$5.x;var $7=$5.y;if($6>0&&$6<$4.width&&$7>0&&$7<$4.height){
$2.push($4)
}}}},"__LZtrack",function($1){
var $2=[];var $3=this.__LZactivegroups;for(var $4=0;$4<$3.length;++$4){
var $5=$3[$4];var $6=[];this.__LZtrackgroup($5,$6);var $7=$5.__LZlasthit;if($6.length){
var $8=this.__LZfindTopmost($6);if($8==$7){
continue
};$2.push($8)
}else{
var $8=null
};if($7){
var $9=$7.onmousetrackout;if($9.ready){
$9.sendEvent($7)
}};$5.__LZlasthit=$8
};for(var $4=0,$10=$2.length;$4<$10;++$4){
var $11=$2[$4];if($11.onmousetrackover.ready){
$11.onmousetrackover.sendEvent($11)
}}},"__LZmouseup",function($1){
var $2=this.__LZactivegroups;for(var $3=0;$3<$2.length;++$3){
var $4=$2[$3].__LZlasthit;if($4){
var $5=$4.onmousetrackup;if($5.ready){
if(this.__LZlastmouseup==$4){
this.__LZlastmouseup=null
}else{
$5.sendEvent($4);this.__LZlastmouseup=$4
}}}}}],["LzTrack",void 0]);(function($1){
with($1){
with($1.prototype){
LzTrackService.LzTrack=new LzTrackService()
}}})(LzTrackService);lz.TrackService=LzTrackService;lz.Track=LzTrackService.LzTrack;Class.make("LzIdleService",LzEventable,["coi",void 0,"regNext",false,"removeCOI",null,"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.coi=new Array();this.removeCOI=new LzDelegate(this,"removeCallIdleDelegates");LzIdleKernel.addCallback(this,"__idleupdate")
},"callOnIdle",function($1){
this.coi.push($1);if(!this.regNext){
this.regNext=true;this.removeCOI.register(this,"onidle")
}},"removeCallIdleDelegates",function($1){
var $2=this.coi;this.coi=new Array();for(var $3=0;$3<$2.length;$3++){
$2[$3].execute($1)
};if(this.coi.length==0){
this.removeCOI.unregisterFrom(this.onidle);this.regNext=false
}},"onidle",LzDeclaredEvent,"__idleupdate",function($1){
if(this.onidle.ready){
this.onidle.sendEvent($1)
}}],["LzIdle",void 0]);(function($1){
with($1){
with($1.prototype){
LzIdleService.LzIdle=new LzIdleService()
}}})(LzIdleService);lz.IdleService=LzIdleService;lz.Idle=LzIdleService.LzIdle;Class.make("LzCSSStyleRule",null,["selector",void 0,"properties",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
switch(arguments.length){
case 2:
$3=null;
case 3:
$4=null;

};this.selector=$1;this.properties=$2
},"specificity",0,"parsed",null,"_lexorder",void 0,"getSpecificity",function(){
if(!this.specificity){
var $1=0;var $2=this.parsed;if($2.type==LzCSSStyle._sel_compound){
for(var $3=0,$4=$2.length;$3<$4;$3++){
$1+=LzCSSStyle.getSelectorSpecificity($2[$3])
}}else{
$1=LzCSSStyle.getSelectorSpecificity($2)
};this.specificity=$1
};return this.specificity
},"_dbg_name",function(){
var $1;$1=function($1){
var $2=$1["tagname"];var $3=$1["id"];var $4=$1["attrname"];if(!($2||$3||$4)){
return "*"
};return($2?$2:"")+($3?"#"+$3:"")+($4?"["+$4+"="+$1.attrvalue+"]":"")
};var $2=this.parsed;if($2["length"]){
var $3="";for(var $4=0;$4<$2.length;$4++){
$3+=$1($2[$4])+" "
};$3=$3.substring(0,$3.length-1)
}else{
var $3=$1($2)
};return $3
},"equal",function($1){
var $2;$2=function($1,$2){
return $1["tagname"]==$2["tagname"]&&$1["id"]==$2["id"]&&$1["attrname"]==$2["attrname"]&&$1["attrvalue"]==$2["attrvalue"]
};var $3=this.parsed;var $4=$1.parsed;if($3["length"]!=$4["length"]){
return false
};if($3["length"]){
for(var $5=$3.length-1;$5>=0;$5--){
if(!$2($3[$5],$4[$5])){
return false
}}};if(!$2($3,$4)){
return false
};var $6=this.properties;var $7=$1.properties;for(var $8 in $6){
if($6[$8]!==$7[$8]){
return false
}};for(var $9 in $7){
if($6[$9]!==$7[$9]){
return false
}};return true
}],null);(function($1){
with($1){
with($1.prototype){

}}})(LzCSSStyleRule);lz.CSSStyleRule=LzCSSStyleRule;Class.make("LzCSSStyleClass",null,["$lzsc$initialize",function(){

},"getComputedStyle",function($1){
var $2=new LzCSSStyleDeclaration();$2.setNode($1);return $2
},"getPropertyValueFor",function($1,$2){
var $3=$1["__LZPropertyCache"];if(!$3){
$3=this.getPropertyCache($1)
};if($2 in $3){
return $3[$2]
};return $3[$2]=void 0
},"getPropertyCache",function($1){
if(!$1||$1===canvas){
return {}};var $2=$1["__LZPropertyCache"];if($2){
return $2
};var $3=$1.immediateparent;if(!$3||$3===canvas){
var $4={}}else{
var $4=$3["__LZPropertyCache"]||this.getPropertyCache($3)
};var $5=$1["__LZRuleCache"];if(!$5){
$5=this.getRulesCache($1)
};if($5.length==0){
return $1.__LZPropertyCache=$4
};var $2={};for(var $6 in $4){
$2[$6]=$4[$6]
};for(var $7=$5.length-1;$7>=0;$7--){
var $8=$5[$7].properties;for(var $9 in $8){
$2[$9]=$8[$9]
}};return $1.__LZPropertyCache=$2
},"getRulesCache",function($1){
var $2=$1["__LZRuleCache"];if($2){
return $2
};$2=new Array();var $3=new Array();if(this._rulenum!=this._lastSort){
this._sortRules()
};var $4=$1["id"];if($4){
var $5=this._idRules;if($4 in $5){
$3=$3.concat($5[$4])
}};var $6=this._attrRules;for(var $7 in $6){
if($1[$7]){
var $8=$6[$7][$1[$7]];if(Array["$lzsc$isa"]?Array.$lzsc$isa($8):$8 instanceof Array){
$3=$3.concat($8)
}}};var $9=this._tagRules;for(var $10 in $9){
var $11=lz[$10];if($11&&($11["$lzsc$isa"]?$11.$lzsc$isa($1):$1 instanceof $11)){
$3=$3.concat($9[$10])
}};var $12=this._rules;for(var $13=$12.length-1;$13>=0;$13--){
$3.push($12[$13])
};var $14=false;var $15=Infinity;for(var $13=0,$16=$3.length;$13<$16;$13++){
var $17=$3[$13];if(!$14){
var $8=$17.specificity;if(!$8||$8>=$15){
$14=true
}else{
$15=$8
}};var $18=$17.parsed;var $19=$18.type;var $20=$19==this._sel_compound;if($20){
$18=$18[$18.length-1];$19=$18.type
};var $21=$18.tagname;var $22=$21?lz[$21]:null;var $23=$18["id"];var $24=$18["attrname"];if((!$21||$22&&($22["$lzsc$isa"]?$22.$lzsc$isa($1):$1 instanceof $22))&&(!$23||$1["id"]==$23)&&(!$24||$1[$24]==$18.attrvalue)){
if(!$20){
$2.push($17)
}else{
if(this._compoundSelectorApplies($17.parsed,$1)){
$2.push($17)
}}}};if($14){
$2.sort(this.__compareSpecificity)
};$1.__LZRuleCache=$2;return $2
},"getSelectorSpecificity",function($1){
switch($1.type){
case this._sel_tag:
case this._sel_star:
return 1;
case this._sel_id:
return 100;
case this._sel_attribute:
return 10;
case this._sel_tagAndAttr:
return 11;

}},"__compareSpecificity",function($1,$2){
var $3=$1.specificity;var $4=$2.specificity;if($3!=$4){
return $3<$4?1:-1
};var $5=$1.parsed;var $6=$2.parsed;var $7=$1._lexorder<$2._lexorder?1:-1;if(!$5["length"]&&!$6["length"]){
var $8=$5["tagname"];var $9=$6["tagname"];if(!$8||!$9||$8==$9){
return $7
};var $10=lz[$8];var $11=lz[$9];if($10&&$11){
if($11.prototype.isPrototypeOf($10.prototype)){
return -1
};if($10.prototype.isPrototypeOf($11.prototype)){
return 1
}};return $7
};for(var $12=0;$12<$5.length;$12++){
var $13=$5[$12];var $14=$6[$12];if(!$13||!$14){
break
};var $8=$13["tagname"];var $9=$14["tagname"];if($8&&$9&&$8!=$9){
var $10=lz[$8];var $11=lz[$9];if($10&&$11){
if($11.prototype.isPrototypeOf($10.prototype)){
return -1
};if($10.prototype.isPrototypeOf($11.prototype)){
return 1
}}}};return $7
},"_printRuleArray",function($1){
for(var $2=0;$2<$1.length;$2++){
Debug.write($2,$1[$2])
}},"_compoundSelectorApplies",function($1,$2){
for(var $3=$2,$4=$1.length-1;$4>=0&&$3!==canvas;$4--,$3=$3.parent){
var $5=$1[$4];var $6=$5.tagname;var $7=$6?lz[$6]:null;var $8=$5["id"];var $9=$5["attrname"];while($3!==canvas){
if((!$6||$7&&($7["$lzsc$isa"]?$7.$lzsc$isa($3):$3 instanceof $7))&&(!$8||$3.id==$8)&&(!$9||$3[$9]==$5.attrvalue)){
if($4==0){
return true
}else{
break
}}else{
if($3===$2){
return false
}};$3=$3.parent
}};return false
},"_sel_unknown",0,"_sel_star",1,"_sel_id",2,"_sel_tag",3,"_sel_compound",4,"_sel_attribute",5,"_sel_tagAndAttr",6,"_rules",new Array(),"_attrRules",{},"_idRules",{},"_tagRules",{},"_rulenum",0,"_lastSort",-1,"_sortRules",function(){
var $1;$1=function($1){
for(var $2=$1.length-2;$2>=0;$2--){
if($1[$2].equal($1[$2+1])){
$1.splice($2+1,1)
}};return $1
};if(this._rulenum!=this._lastSort){
this._rules.sort(this.__compareSpecificity);$1(this._rules);for(var $2 in this._attrRules){
var $3=this._attrRules[$2];for(var $4 in $3){
$3[$4].sort(this.__compareSpecificity);$1($3[$4])
}};for(var $2 in this._idRules){
this._idRules[$2].sort(this.__compareSpecificity);$1(this._idRules[$2])
};for(var $2 in this._tagRules){
this._tagRules[$2].sort(this.__compareSpecificity);$1(this._tagRules[$2])
};this._lastSort=this._rulenum
}},"_addRule",function($1){
$1._lexorder=this._rulenum++;var $2=$1.selector;$1.parsed=null;var $3;if(Array["$lzsc$isa"]?Array.$lzsc$isa($2):$2 instanceof Array){
$1.parsed=[];$1.parsed.type=this._sel_compound;for(var $4=0;$4<$2.length;$4++){
$1.parsed.push(this._parseSelector($2[$4]))
};$3=$1.parsed[$1.parsed.length-1]
}else{
$1.parsed=this._parseSelector($2);$3=$1.parsed
};$1.getSpecificity();if($3.type==this._sel_attribute||$3.type==this._sel_tagAndAttr){
var $5=$3.attrname;var $6=this._attrRules[$5];if(!$6){
$6=this._attrRules[$5]={}};var $7=$3.attrvalue;var $8=$6[$7];if(!$8){
$8=$6[$7]=[]
};$8.push($1)
}else{
if($3.type==this._sel_id){
var $9=$3.id;if(!this._idRules[$9]){
this._idRules[$9]=[]
};this._idRules[$9].push($1)
}else{
if($3.type==this._sel_tag){
var $10=$3.tagname;if(!this._tagRules[$10]){
this._tagRules[$10]=[]
};this._tagRules[$10].push($1)
}else{
this._rules.push($1)
}}}},"_parseSelector",function($1){
switch(typeof $1){
case "object":
if($1.simpleselector){
$1.type=this._sel_tagAndAttr;$1.tagname=$1.simpleselector
}else{
$1.type=this._sel_attribute
};return $1;break;
case "string":
return this._parseStringSelector($1);break;

}},"_parseStringSelector",function($1){
var $2={};if($1=="*"){
$2.type=this._sel_star
}else{
var $3=$1.indexOf("#");if($3>=0){
$2.id=$1.substring($3+1);$2.type=this._sel_id
}else{
$2.type=this._sel_tag;$2.tagname=$1
}};return $2
}],null);(function($1){
with($1){
with($1.prototype){

}}})(LzCSSStyleClass);var LzCSSStyle=new LzCSSStyleClass();lz.CSSStyle=LzCSSStyleClass;Class.make("LzCSSStyleDeclaration",null,["$lzsc$initialize",function(){

},"_node",null,"getPropertyValue",function($1){
return LzCSSStyle.getPropertyValueFor(this._node,$1)
},"setNode",function($1){
this._node=$1
}],null);(function($1){
with($1){
with($1.prototype){

}}})(LzCSSStyleDeclaration);lz.CSSStyleDeclaration=LzCSSStyleDeclaration;Class.make("LzStyleSheet",null,["$lzsc$initialize",function($1,$2,$3,$4){
this.type=$4;this.disabled=false;this.ownerNode=null;this.parentStyleSheet=null;this.href=$2;this.title=$1;this.media=$3
},"type",null,"disabled",null,"ownerNode",null,"parentStyleSheet",null,"href",null,"title",null,"media",null],null);Class.make("LzCSSStyleSheet",LzStyleSheet,["$lzsc$initialize",function($1,$2,$3,$4,$5,$6){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4);this.ownerRule=$5;this.cssRules=$6
},"ownerRule",null,"cssRules",null,"insertRule",function($1,$2){
if(!this.cssRules){
this.cssRules=[]
};if($2<0){
return null
};if($2<this.cssRules.length){
this.cssRules.splice($2,0,$1);return $2
};if($2==this.cssRules.length){
return this.cssRules.push($1)-1
};return null
}],null);lz.CSSStyleSheet=LzCSSStyleSheet;Class.make("LzFocusService",LzEventable,["onfocus",LzDeclaredEvent,"onescapefocus",LzDeclaredEvent,"lastfocus",null,"csel",null,"cseldest",null,"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.upDel=new LzDelegate(this,"gotKeyUp",lz.Keys,"onkeyup");this.downDel=new LzDelegate(this,"gotKeyDown",lz.Keys,"onkeydown");this.lastfocusDel=new LzDelegate(lz.Keys,"gotLastFocus",this,"onescapefocus")
},"upDel",void 0,"downDel",void 0,"lastfocusDel",void 0,"focuswithkey",false,"__LZskipblur",false,"__LZsfnextfocus",-1,"__LZsfrunning",false,"gotKeyUp",function($1){
if(this.csel&&this.csel.onkeyup.ready){
this.csel.onkeyup.sendEvent($1)
}},"gotKeyDown",function($1){
if(this.csel&&this.csel.onkeydown.ready){
this.csel.onkeydown.sendEvent($1)
};if($1==lz.Keys.keyCodes.tab){
if(lz.Keys.isKeyDown("shift")){
this.prev()
}else{
this.next()
}}},"__LZcheckFocusChange",function($1){
if($1.focusable){
this.setFocus($1,false)
}},"setFocus",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if(this.__LZsfrunning){
this.__LZsfnextfocus=$1;return
};if(this.cseldest==$1){
return
};var $3=this.csel;if($3&&!$3.shouldYieldFocus()){
return
};if($1&&!$1.focusable){
$1=this.getNext($1);if(this.cseldest==$1){
return
}};if($3){
$3.blurring=true
};this.__LZsfnextfocus=-1;this.__LZsfrunning=true;this.cseldest=$1;if($2!=null){
this.focuswithkey=!(!$2)
};if(!this.__LZskipblur){
this.__LZskipblur=true;if($3&&$3.onblur.ready){
$3.onblur.sendEvent($1);var $4=this.__LZsfnextfocus;if($4!=-1){
if($4&&!$4.focusable){
$4=this.getNext($4)
};if($4!=$1){
this.__LZsfrunning=false;this.setFocus($4);return
}}}};this.lastfocus=$3;this.csel=$1;this.__LZskipblur=false;if($3){
$3.blurring=false
};if($1&&$1.onfocus.ready){
$1.onfocus.sendEvent($1);var $4=this.__LZsfnextfocus;if($4!=-1){
if($4&&!$4.focusable){
$4=this.getNext($4)
};if($4!=$1){
this.__LZsfrunning=false;this.setFocus($4);return
}}};if(this.onfocus.ready){
this.onfocus.sendEvent($1);var $4=this.__LZsfnextfocus;if($4!=-1){
if($4&&!$4.focusable){
$4=this.getNext($4)
};if($4!=$1){
this.__LZsfrunning=false;this.setFocus($4);return
}}};this.__LZsfrunning=false
},"clearFocus",function(){
this.setFocus(null)
},"getFocus",function(){
return this.csel
},"next",function(){
this.genMoveSelection(1)
},"prev",function(){
this.genMoveSelection(-1)
},"getNext",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this.moveSelSubview($1||this.csel,1,false)
},"getPrev",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this.moveSelSubview($1||this.csel,-1,false)
},"genMoveSelection",function($1){
var $2=this.csel;var $3=$2;while($2&&$3!=canvas){
if(!$3.visible){
$2=null
};$3=$3.immediateparent
};if($2==null){
$2=lz.ModeManager.getModalView()
};var $4="get"+($1==1?"Next":"Prev")+"Selection";var $5=$2?$2[$4]():null;if($5==null){
$5=this.moveSelSubview($2,$1,true)
};if(lz.ModeManager.__LZallowFocus($5)){
this.setFocus($5,true)
}},"accumulateSubviews",function($1,$2,$3,$4){
if($2==$3||$2.focusable&&$2.visible){
$1.push($2)
};if($4||!$2.focustrap&&$2.visible){
for(var $5=0;$5<$2.subviews.length;$5++){
this.accumulateSubviews($1,$2.subviews[$5],$3,false)
}}},"moveSelSubview",function($1,$2,$3){
var $4=$1||canvas;while(!$4.focustrap&&$4.immediateparent&&$4!=$4.immediateparent){
$4=$4.immediateparent
};var $5=[];this.accumulateSubviews($5,$4,$1,true);var $6=-1;var $7=$5.length;var $8=false;for(var $9=0;$9<$7;++$9){
if($5[$9]===$1){
$8=$2==-1&&$9==0||$2==1&&$9==$7-1;$6=$9;break
}};if($3&&$8){
this.onescapefocus.sendEvent()
};if($6==-1&&$2==-1){
$6=0
};$6=($6+$2+$7)%$7;return $5[$6]
}],["LzFocus",void 0]);(function($1){
with($1){
with($1.prototype){
LzFocusService.LzFocus=new LzFocusService()
}}})(LzFocusService);lz.FocusService=LzFocusService;lz.Focus=LzFocusService.LzFocus;Class.make("LzTimerService",null,["timerList",new Object(),"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"execDelegate",function($1){
var $2=$1.delegate;lz.Timer.removeTimerWithID($2,$1.id);if($2.enabled&&$2.c){
$2.execute(new Date().getTime())
}},"removeTimerWithID",function($1,$2){
var $3=$1.__delegateID;var $4=this.timerList[$3];if($4!=null){
if($4 instanceof Array){
for(var $5=0;$5<$4.length;$5++){
if($4[$5]==$2){
$4.splice($5,1);if($4.length==0){
delete this.timerList[$3]
};break
}}}else{
if($4==$2){
delete this.timerList[$3]
}}}},"addTimer",function($1,$2){
if(!$2||$2<1){
$2=1
};var $3={delegate:$1};var $4=LzTimeKernel.setTimeout(this.execDelegate,$2,$3);$3.id=$4;var $5=$1.__delegateID;var $6=this.timerList[$5];if($6==null){
this.timerList[$5]=$4
}else{
if(!($6 instanceof Array)){
this.timerList[$5]=[$6,$4]
}else{
$6.push($4)
}};return $4
},"removeTimer",function($1){
var $2=$1.__delegateID;var $3=this.timerList[$2];var $4=null;if($3!=null){
if($3 instanceof Array){
$4=$3.shift();LzTimeKernel.clearTimeout($4);if($3.length==0){
delete this.timerList[$2]
}}else{
$4=$3;LzTimeKernel.clearTimeout($4);delete this.timerList[$2]
}};return $4
},"resetTimer",function($1,$2){
this.removeTimer($1);return this.addTimer($1,$2)
}],["LzTimer",void 0]);(function($1){
with($1){
with($1.prototype){
LzTimerService.LzTimer=new LzTimerService()
}}})(LzTimerService);lz.TimerService=LzTimerService;lz.Timer=LzTimerService.LzTimer;var $backtrace=false;var $dhtml=true;var $as3=false;var $js1=true;var $swf7=false;var $swf8=false;var $svg=false;var $as2=false;var $swf9=false;var $profile=false;var $runtime="dhtml";var $swf10=false;var $debug=false;var $j2me=false;var appdata=null;var main=null;var rg_runtime=null;var rb8=null;var rbdhtml=null;var rb9=null;var rb10=null;var cb_debug=null;var cb_backtrace=null;var cb_remotedebug=null;Class.make("$lzc$class_$m1",LzCanvas,["deploySOLO",function(){
with(this){
var $1=escape(app_fullpath.substring(app_lps_root.length));if(app_runtime=="dhtml"){
var $2=app_lps_root+"/lps/admin/solo-dhtml-deploy.jsp?appurl="+$1
}else{
var $2=app_lps_root+"/lps/admin/solo-deploy.jsp?appurl="+$1+"&runtime="+app_runtime
};this.loadURL($2,"_blank")
}},"debugApp",function(){
with(this){
cb_debug.setValue(true);canvas.reloadApp()
}},"viewSource",function(){
with(this){
app_lzt="source";canvas.reloadApp()
}},"viewWrapper",function(){
with(this){
app_lzt="deployment";canvas.reloadApp()
}},"viewDocs",function(){
with(this){
var $1=app_lps_root+"/docs/index.html";this.loadURL($1)
}},"viewDev",function(){
var $1="http://www.laszlosystems.com/developers";this.loadURL($1)
},"viewForums",function(){
var $1="http://www.laszlosystems.com/developers/community/forums/";this.loadURL($1)
},"loadURL",function($1,$2){
with(this){
switch(arguments.length){
case 1:
$2="_top";

};lz.Browser.loadURL($1,$2)
}},"gotoApp",function(){
with(this){
var $1=app_fullpath.substring(0,app_fullpath.length-4)+".lzx";app_fullpath=$1;this.reloadApp()
}},"reloadApp",function($1){
with(this){
var $2=rg_runtime.value;var $3=cb_debug.value;var $4=cb_backtrace.value;var $5=cb_remotedebug.value;var $6=new LzParam(this);var $7=LzParam.parseQueryString(app_query);$7["debug"]=$3;$7["lzbacktrace"]=$4;$7["lzr"]=$2;if($5){
$7["lzconsoledebug"]=true;$7["debug"]=true
}else{
delete $7.lzconsoledebug;delete $7.remotedebug
};if(app_lzt!=null){
$7["lzt"]=app_lzt
};if($7.debug+""=="false"){
delete $7["debug"]
}else{
$7.debug="true"
};if($7.lzbacktrace+""=="false"){
delete $7["lzbacktrace"]
}else{
$7.lzbacktrace="true"
};var $8={};for(var $9 in $7){
if($9==""){
continue
};if($9.indexOf("#38;")!=-1){
var $10=$9.indexOf("#38;");$9=$9.substring($10+4,$9.length)
};if($8[$9]){
continue
};$6.setValue($9,$7[$9]);$8[$9]=true
};var $11=app_fullpath+"?"+$6.serialize();this.loadURL($11)
}},"displayObjectByID",function($1){
with(this){
receivingLC.send("lc_appdebug"+app_uid,"displayObj",$1)
}},"showLogMessage",function($1){
with(this){
console.writeRaw(escapeXML($1)+"<br>")
}},"showWarning",function($1,$2,$3){
with(this){
console.writeRaw($3)
}},"sendConsoleAlive",function(){
with(this){
receivingLC.send("lc_appdebug"+app_uid,"consoleAlive",true)
}},"remoteEval",function($1){
with(this){
receivingLC.send("lc_appdebug"+app_uid,"evalExpr",$1)
}}],["tagname","canvas","attributes",new LzInheritedHash(LzCanvas.attributes)]);canvas=new $lzc$class_$m1(null,{__LZproxied:"true",appbuilddate:"2009-01-26T02:18:47Z",bgcolor:8750489,embedfonts:true,fontname:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",height:370,lpsbuild:"12646 /Users/hqm/openlaszlo/trunk-clean",lpsbuilddate:"2009-01-25T20:58:17Z",lpsrelease:"Latest",lpsversion:"4.2.x",proxied:false,runtime:"dhtml",width:"100%"});lz.colors.offwhite=15921906;lz.colors.gray10=1710618;lz.colors.gray20=3355443;lz.colors.gray30=5066061;lz.colors.gray40=6710886;lz.colors.gray50=8355711;lz.colors.gray60=10066329;lz.colors.gray70=11776947;lz.colors.gray80=13421772;lz.colors.gray90=15066597;lz.colors.iceblue1=3298963;lz.colors.iceblue2=5472718;lz.colors.iceblue3=12240085;lz.colors.iceblue4=14017779;lz.colors.iceblue5=15659509;lz.colors.palegreen1=4290113;lz.colors.palegreen2=11785139;lz.colors.palegreen3=12637341;lz.colors.palegreen4=13888170;lz.colors.palegreen5=15725032;lz.colors.gold1=9331721;lz.colors.gold2=13349195;lz.colors.gold3=15126388;lz.colors.gold4=16311446;lz.colors.sand1=13944481;lz.colors.sand2=14276546;lz.colors.sand3=15920859;lz.colors.sand4=15986401;lz.colors.ltpurple1=6575768;lz.colors.ltpurple2=12038353;lz.colors.ltpurple3=13353453;lz.colors.ltpurple4=15329264;lz.colors.grayblue=12501704;lz.colors.graygreen=12635328;lz.colors.graypurple=10460593;lz.colors.ltblue=14540287;lz.colors.ltgreen=14548957;Class.make("$lzc$class_basefocusview",LzView,["active",void 0,"$lzc$set_active",function($1){
with(this){
setActive($1)
}},"target",void 0,"$lzc$set_target",function($1){
with(this){
setTarget($1)
}},"duration",void 0,"_animatorcounter",void 0,"ontarget",void 0,"_nexttarget",void 0,"onactive",void 0,"_xydelegate",void 0,"_widthdel",void 0,"_heightdel",void 0,"_delayfadeoutDL",void 0,"_dofadeout",void 0,"_onstopdel",void 0,"reset",function(){
with(this){
this.setAttribute("x",0);this.setAttribute("y",0);this.setAttribute("width",canvas.width);this.setAttribute("height",canvas.height);setTarget(null)
}},"setActive",function($1){
this.active=$1;if(this.onactive){
this.onactive.sendEvent($1)
}},"doFocus",function($1){
with(this){
this._dofadeout=false;this.bringToFront();if(this.target){
this.setTarget(null)
};this.setAttribute("visibility",this.active?"visible":"hidden");this._nexttarget=$1;if(visible){
this._animatorcounter+=1;var $2=null;var $3;var $4;var $5;var $6;if($1["getFocusRect"]){
$2=$1.getFocusRect()
};if($2){
$3=$2[0];$4=$2[1];$5=$2[2];$6=$2[3]
}else{
$3=$1.getAttributeRelative("x",canvas);$4=$1.getAttributeRelative("y",canvas);$5=$1.getAttributeRelative("width",canvas);$6=$1.getAttributeRelative("height",canvas)
};var $7=this.animate("x",$3,duration);this.animate("y",$4,duration);this.animate("width",$5,duration);this.animate("height",$6,duration);if(this.capabilities["minimize_opacity_changes"]){
this.setAttribute("visibility","visible")
}else{
this.animate("opacity",1,500)
};if(!this._onstopdel){
this._onstopdel=new LzDelegate(this,"stopanim")
};this._onstopdel.register($7,"onstop")
};if(this._animatorcounter<1){
this.setTarget(this._nexttarget);var $2=null;var $3;var $4;var $5;var $6;if($1["getFocusRect"]){
$2=$1.getFocusRect()
};if($2){
$3=$2[0];$4=$2[1];$5=$2[2];$6=$2[3]
}else{
$3=$1.getAttributeRelative("x",canvas);$4=$1.getAttributeRelative("y",canvas);$5=$1.getAttributeRelative("width",canvas);$6=$1.getAttributeRelative("height",canvas)
};this.setAttribute("x",$3);this.setAttribute("y",$4);this.setAttribute("width",$5);this.setAttribute("height",$6)
}}},"stopanim",function($1){
with(this){
this._animatorcounter-=1;if(this._animatorcounter<1){
this._dofadeout=true;if(!this._delayfadeoutDL){
this._delayfadeoutDL=new LzDelegate(this,"fadeout")
};lz.Timer.addTimer(this._delayfadeoutDL,1000);this.setTarget(_nexttarget);this._onstopdel.unregisterAll()
}}},"fadeout",function($1){
with(this){
if(_dofadeout){
if(this.capabilities["minimize_opacity_changes"]){
this.setAttribute("visibility","hidden")
}else{
this.animate("opacity",0,500)
}};this._delayfadeoutDL.unregisterAll()
}},"setTarget",function($1){
with(this){
this.target=$1;if(!this._xydelegate){
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
};if(this.target==null){
return
};var $2=$1;var $3=0;while($2!=canvas){
this._xydelegate.register($2,"onx");this._xydelegate.register($2,"ony");$2=$2.immediateparent;$3++
};this._widthdel.register($1,"onwidth");this._heightdel.register($1,"onheight");followXY(null);followWidth(null);followHeight(null)
}},"followXY",function($1){
with(this){
var $2=null;if(target["getFocusRect"]){
$2=target.getFocusRect()
};if($2){
this.setAttribute("x",$2[0]);this.setAttribute("y",$2[1])
}else{
this.setAttribute("x",this.target.getAttributeRelative("x",canvas));this.setAttribute("y",this.target.getAttributeRelative("y",canvas))
}}},"followWidth",function($1){
with(this){
var $2=null;if(target["getFocusRect"]){
$2=target.getFocusRect()
};if($2){
this.setAttribute("width",$2[2])
}else{
this.setAttribute("width",this.target.width)
}}},"followHeight",function($1){
with(this){
var $2=null;if(target["getFocusRect"]){
$2=target.getFocusRect()
};if($2){
this.setAttribute("height",$2[3])
}else{
this.setAttribute("height",this.target.height)
}}},"$m4",function(){
with(this){
var $1=lz.Focus;return $1
}},"$m5",function($1){
with(this){
this.setActive(lz.Focus.focuswithkey);if($1){
this.doFocus($1)
}else{
this.reset();if(this.active){
this.setActive(false)
}}}}],["tagname","basefocusview","attributes",new LzInheritedHash(LzView.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["onstop","stopanim",null,"onfocus","$m5","$m4"],_animatorcounter:0,_delayfadeoutDL:null,_dofadeout:false,_heightdel:null,_nexttarget:null,_onstopdel:null,_widthdel:null,_xydelegate:null,active:false,duration:400,initstage:"late",onactive:LzDeclaredEvent,ontarget:LzDeclaredEvent,options:{ignorelayout:true},target:null,visible:false},$lzc$class_basefocusview.attributes)
}}})($lzc$class_basefocusview);LzResourceLibrary.lzfocusbracket_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft.png","lps/components/lz/resources/focus/focus_top_rt.png","lps/components/lz/resources/focus/focus_bot_lft.png","lps/components/lz/resources/focus/focus_bot_rt.png"],width:7,height:7,sprite:"lps/components/lz/resources/focus/focus_top_lft.sprite.png"};LzResourceLibrary.lzfocusbracket_shdw={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft_shdw.png","lps/components/lz/resources/focus/focus_top_rt_shdw.png","lps/components/lz/resources/focus/focus_bot_lft_shdw.png","lps/components/lz/resources/focus/focus_bot_rt_shdw.png"],width:9,height:9,sprite:"lps/components/lz/resources/focus/focus_top_lft_shdw.sprite.png"};Class.make("$lzc$class_$m22",LzView,["$m6",function($1){
with(this){
this.setAttribute("x",-classroot.offset)
}},"$m7",function(){
with(this){
return [classroot,"offset"]
}},"$m8",function($1){
with(this){
this.setAttribute("y",-classroot.offset)
}},"$m9",function(){
with(this){
return [classroot,"offset"]
}},"$classrootdepth",void 0],["tagname","view","children",LzNode.mergeChildren([{attrs:{$classrootdepth:2,opacity:0.25,resource:"lzfocusbracket_shdw",x:1,y:1},"class":LzView},{attrs:{$classrootdepth:2,resource:"lzfocusbracket_rsrc"},"class":LzView}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m23",LzView,["$m10",function($1){
with(this){
this.setAttribute("x",parent.width-width+classroot.offset)
}},"$m11",function(){
with(this){
return [parent,"width",this,"width",classroot,"offset"]
}},"$m12",function($1){
with(this){
this.setAttribute("y",-classroot.offset)
}},"$m13",function(){
with(this){
return [classroot,"offset"]
}},"$classrootdepth",void 0],["tagname","view","children",LzNode.mergeChildren([{attrs:{$classrootdepth:2,frame:2,opacity:0.25,resource:"lzfocusbracket_shdw",x:1,y:1},"class":LzView},{attrs:{$classrootdepth:2,frame:2,resource:"lzfocusbracket_rsrc"},"class":LzView}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m24",LzView,["$m14",function($1){
with(this){
this.setAttribute("x",-classroot.offset)
}},"$m15",function(){
with(this){
return [classroot,"offset"]
}},"$m16",function($1){
with(this){
this.setAttribute("y",parent.height-height+classroot.offset)
}},"$m17",function(){
with(this){
return [parent,"height",this,"height",classroot,"offset"]
}},"$classrootdepth",void 0],["tagname","view","children",LzNode.mergeChildren([{attrs:{$classrootdepth:2,frame:3,opacity:0.25,resource:"lzfocusbracket_shdw",x:1,y:1},"class":LzView},{attrs:{$classrootdepth:2,frame:3,resource:"lzfocusbracket_rsrc"},"class":LzView}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m25",LzView,["$m18",function($1){
with(this){
this.setAttribute("x",parent.width-width+classroot.offset)
}},"$m19",function(){
with(this){
return [parent,"width",this,"width",classroot,"offset"]
}},"$m20",function($1){
with(this){
this.setAttribute("y",parent.height-height+classroot.offset)
}},"$m21",function(){
with(this){
return [parent,"height",this,"height",classroot,"offset"]
}},"$classrootdepth",void 0],["tagname","view","children",LzNode.mergeChildren([{attrs:{$classrootdepth:2,frame:4,opacity:0.25,resource:"lzfocusbracket_shdw",x:1,y:1},"class":LzView},{attrs:{$classrootdepth:2,frame:4,resource:"lzfocusbracket_rsrc"},"class":LzView}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_focusoverlay",$lzc$class_basefocusview,["offset",void 0,"topleft",void 0,"topright",void 0,"bottomleft",void 0,"bottomright",void 0,"doFocus",function($1){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["doFocus"]:this.nextMethod(arguments.callee,"doFocus")).call(this,$1);if(visible){
this.bounce()
}}},"bounce",function(){
with(this){
this.animate("offset",12,duration/2);this.animate("offset",5,duration)
}}],["tagname","focusoverlay","children",LzNode.mergeChildren([{attrs:{$classrootdepth:1,name:"topleft",x:new LzAlwaysExpr("$m6","$m7"),y:new LzAlwaysExpr("$m8","$m9")},"class":$lzc$class_$m22},{attrs:{$classrootdepth:1,name:"topright",x:new LzAlwaysExpr("$m10","$m11"),y:new LzAlwaysExpr("$m12","$m13")},"class":$lzc$class_$m23},{attrs:{$classrootdepth:1,name:"bottomleft",x:new LzAlwaysExpr("$m14","$m15"),y:new LzAlwaysExpr("$m16","$m17")},"class":$lzc$class_$m24},{attrs:{$classrootdepth:1,name:"bottomright",x:new LzAlwaysExpr("$m18","$m19"),y:new LzAlwaysExpr("$m20","$m21")},"class":$lzc$class_$m25}],$lzc$class_basefocusview["children"]),"attributes",new LzInheritedHash($lzc$class_basefocusview.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({offset:5},$lzc$class_focusoverlay.attributes)
}}})($lzc$class_focusoverlay);Class.make("$lzc$class__componentmanager",LzNode,["focusclass",void 0,"keyhandlers",void 0,"lastsdown",void 0,"lastedown",void 0,"defaults",void 0,"currentdefault",void 0,"defaultstyle",void 0,"ondefaultstyle",void 0,"init",function(){
with(this){
var $1=this.focusclass;if(typeof canvas.focusclass!="undefined"){
$1=canvas.focusclass
};if($1!=null){
canvas.__focus=new (lz[$1])(canvas);canvas.__focus.reset()
};(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this)
}},"_lastkeydown",void 0,"upkeydel",void 0,"$m27",function(){
with(this){
var $1=lz.Keys;return $1
}},"dispatchKeyDown",function($1){
with(this){
var $2=false;if($1==32){
this.lastsdown=null;var $3=lz.Focus.getFocus();if($3 instanceof lz.basecomponent){
$3.doSpaceDown();this.lastsdown=$3
};$2=true
}else{
if($1==13&&this.currentdefault){
this.lastedown=this.currentdefault;this.currentdefault.doEnterDown();$2=true
}};if($2){
if(!this.upkeydel){
this.upkeydel=new LzDelegate(this,"dispatchKeyTimer")
};this._lastkeydown=$1;lz.Timer.addTimer(this.upkeydel,50)
}}},"dispatchKeyTimer",function($1){
if(this._lastkeydown==32&&this.lastsdown!=null){
this.lastsdown.doSpaceUp();this.lastsdown=null
}else{
if(this._lastkeydown==13&&this.currentdefault&&this.currentdefault==this.lastedown){
this.currentdefault.doEnterUp()
}}},"findClosestDefault",function($1){
with(this){
if(!this.defaults){
return null
};var $2=null;var $3=null;var $4=this.defaults;$1=$1||canvas;var $5=lz.ModeManager.getModalView();for(var $6=0;$6<$4.length;$6++){
var $7=$4[$6];if($5&&!$7.childOf($5)){
continue
};var $8=this.findCommonParent($7,$1);if($8&&(!$2||$8.nodeLevel>$2.nodeLevel)){
$2=$8;$3=$7
}};return $3
}},"findCommonParent",function($1,$2){
while($1.nodeLevel>$2.nodeLevel){
$1=$1.immediateparent;if(!$1.visible){
return null
}};while($2.nodeLevel>$1.nodeLevel){
$2=$2.immediateparent;if(!$2.visible){
return null
}};while($1!=$2){
$1=$1.immediateparent;$2=$2.immediateparent;if(!$1.visible||!$2.visible){
return null
}};return $1
},"makeDefault",function($1){
with(this){
if(!this.defaults){
this.defaults=[]
};this.defaults.push($1);this.checkDefault(lz.Focus.getFocus())
}},"unmakeDefault",function($1){
with(this){
if(!this.defaults){
return
};for(var $2=0;$2<this.defaults.length;$2++){
if(this.defaults[$2]==$1){
this.defaults.splice($2,1);this.checkDefault(lz.Focus.getFocus());return
}}}},"$m29",function(){
with(this){
var $1=lz.Focus;return $1
}},"checkDefault",function($1){
with(this){
if(!($1 instanceof lz.basecomponent)||!$1.doesenter){
if($1 instanceof lz.inputtext&&$1.multiline){
$1=null
}else{
$1=this.findClosestDefault($1)
}};if($1==this.currentdefault){
return
};if(this.currentdefault){
this.currentdefault.setAttribute("hasdefault",false)
};this.currentdefault=$1;if($1){
$1.setAttribute("hasdefault",true)
}}},"$m31",function(){
with(this){
var $1=lz.ModeManager;return $1
}},"$m32",function($1){
with(this){
switch(arguments.length){
case 0:
$1=null;

};if(lz.Focus.getFocus()==null){
this.checkDefault(null)
}}},"setDefaultStyle",function($1){
this.defaultstyle=$1;if(this.ondefaultstyle){
this.ondefaultstyle.sendEvent($1)
}},"getDefaultStyle",function(){
with(this){
if(this.defaultstyle==null){
this.defaultstyle=new (lz.style)(canvas,{isdefault:true})
};return this.defaultstyle
}}],["tagname","_componentmanager","attributes",new LzInheritedHash(LzNode.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["onkeydown","dispatchKeyDown","$m27","onfocus","checkDefault","$m29","onmode","$m32","$m31"],_lastkeydown:0,currentdefault:null,defaults:null,defaultstyle:null,focusclass:"focusoverlay",keyhandlers:null,lastedown:null,lastsdown:null,ondefaultstyle:LzDeclaredEvent,upkeydel:null},$lzc$class__componentmanager.attributes)
}}})($lzc$class__componentmanager);Class.make("$lzc$class_style",LzNode,["isstyle",void 0,"$m33",function($1){
with(this){
this.setAttribute("canvascolor",LzColorUtils.convertColor("null"))
}},"canvascolor",void 0,"$lzc$set_canvascolor",function($1){
with(this){
setCanvasColor($1)
}},"$m34",function($1){
with(this){
this.setAttribute("textcolor",LzColorUtils.convertColor("gray10"))
}},"textcolor",void 0,"$lzc$set_textcolor",function($1){
with(this){
setStyleAttr($1,"textcolor")
}},"$m35",function($1){
with(this){
this.setAttribute("textfieldcolor",LzColorUtils.convertColor("white"))
}},"textfieldcolor",void 0,"$lzc$set_textfieldcolor",function($1){
with(this){
setStyleAttr($1,"textfieldcolor")
}},"$m36",function($1){
with(this){
this.setAttribute("texthilitecolor",LzColorUtils.convertColor("iceblue1"))
}},"texthilitecolor",void 0,"$lzc$set_texthilitecolor",function($1){
with(this){
setStyleAttr($1,"texthilitecolor")
}},"$m37",function($1){
with(this){
this.setAttribute("textselectedcolor",LzColorUtils.convertColor("black"))
}},"textselectedcolor",void 0,"$lzc$set_textselectedcolor",function($1){
with(this){
setStyleAttr($1,"textselectedcolor")
}},"$m38",function($1){
with(this){
this.setAttribute("textdisabledcolor",LzColorUtils.convertColor("gray60"))
}},"textdisabledcolor",void 0,"$lzc$set_textdisabledcolor",function($1){
with(this){
setStyleAttr($1,"textdisabledcolor")
}},"$m39",function($1){
with(this){
this.setAttribute("basecolor",LzColorUtils.convertColor("offwhite"))
}},"basecolor",void 0,"$lzc$set_basecolor",function($1){
with(this){
setStyleAttr($1,"basecolor")
}},"$m40",function($1){
with(this){
this.setAttribute("bgcolor",LzColorUtils.convertColor("white"))
}},"bgcolor",void 0,"$lzc$set_bgcolor",function($1){
with(this){
setStyleAttr($1,"bgcolor")
}},"$m41",function($1){
with(this){
this.setAttribute("hilitecolor",LzColorUtils.convertColor("iceblue4"))
}},"hilitecolor",void 0,"$lzc$set_hilitecolor",function($1){
with(this){
setStyleAttr($1,"hilitecolor")
}},"$m42",function($1){
with(this){
this.setAttribute("selectedcolor",LzColorUtils.convertColor("iceblue3"))
}},"selectedcolor",void 0,"$lzc$set_selectedcolor",function($1){
with(this){
setStyleAttr($1,"selectedcolor")
}},"$m43",function($1){
with(this){
this.setAttribute("disabledcolor",LzColorUtils.convertColor("gray30"))
}},"disabledcolor",void 0,"$lzc$set_disabledcolor",function($1){
with(this){
setStyleAttr($1,"disabledcolor")
}},"$m44",function($1){
with(this){
this.setAttribute("bordercolor",LzColorUtils.convertColor("gray40"))
}},"bordercolor",void 0,"$lzc$set_bordercolor",function($1){
with(this){
setStyleAttr($1,"bordercolor")
}},"$m45",function($1){
this.setAttribute("bordersize",1)
},"bordersize",void 0,"$lzc$set_bordersize",function($1){
with(this){
setStyleAttr($1,"bordersize")
}},"$m46",function($1){
with(this){
this.setAttribute("menuitembgcolor",textfieldcolor)
}},"menuitembgcolor",void 0,"isdefault",void 0,"$lzc$set_isdefault",function($1){
with(this){
_setdefault($1)
}},"onisdefault",void 0,"_setdefault",function($1){
with(this){
this.isdefault=$1;if(isdefault){
lz._componentmanager.service.setDefaultStyle(this);if(this["canvascolor"]!=null){
canvas.setAttribute("bgcolor",this.canvascolor)
}};if(this.onisdefault){
this.onisdefault.sendEvent(this)
}}},"onstylechanged",void 0,"setStyleAttr",function($1,$2){
this[$2]=$1;if(this["on"+$2]){
this["on"+$2].sendEvent($2)
};if(this.onstylechanged){
this.onstylechanged.sendEvent(this)
}},"setCanvasColor",function($1){
with(this){
if(this.isdefault&&$1!=null){
canvas.setAttribute("bgcolor",$1)
};this.canvascolor=$1;if(this.onstylechanged){
this.onstylechanged.sendEvent(this)
}}},"extend",function($1){
with(this){
var $2=new (lz.style)();$2.canvascolor=this.canvascolor;$2.textcolor=this.textcolor;$2.textfieldcolor=this.textfieldcolor;$2.texthilitecolor=this.texthilitecolor;$2.textselectedcolor=this.textselectedcolor;$2.textdisabledcolor=this.textdisabledcolor;$2.basecolor=this.basecolor;$2.bgcolor=this.bgcolor;$2.hilitecolor=this.hilitecolor;$2.selectedcolor=this.selectedcolor;$2.disabledcolor=this.disabledcolor;$2.bordercolor=this.bordercolor;$2.bordersize=this.bordersize;$2.menuitembgcolor=this.menuitembgcolor;$2.isdefault=this.isdefault;for(var $3 in $1){
$2[$3]=$1[$3]
};new LzDelegate($2,"_forwardstylechanged",this,"onstylechanged");return $2
}},"_forwardstylechanged",function($1){
if(this.onstylechanged){
this.onstylechanged.sendEvent(this)
}}],["tagname","style","attributes",new LzInheritedHash(LzNode.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({basecolor:new LzOnceExpr("$m39"),bgcolor:new LzOnceExpr("$m40"),bordercolor:new LzOnceExpr("$m44"),bordersize:new LzOnceExpr("$m45"),canvascolor:new LzOnceExpr("$m33"),disabledcolor:new LzOnceExpr("$m43"),hilitecolor:new LzOnceExpr("$m41"),isdefault:false,isstyle:true,menuitembgcolor:new LzOnceExpr("$m46"),onisdefault:LzDeclaredEvent,onstylechanged:LzDeclaredEvent,selectedcolor:new LzOnceExpr("$m42"),textcolor:new LzOnceExpr("$m34"),textdisabledcolor:new LzOnceExpr("$m38"),textfieldcolor:new LzOnceExpr("$m35"),texthilitecolor:new LzOnceExpr("$m36"),textselectedcolor:new LzOnceExpr("$m37")},$lzc$class_style.attributes)
}}})($lzc$class_style);canvas.LzInstantiateView({"class":lz.script,attrs:{script:function(){
lz._componentmanager.service=new (lz._componentmanager)(canvas,null,null,true)
}}},1);Class.make("$lzc$class_statictext",LzText,null,["tagname","statictext","attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_basecomponent",LzView,["enabled",void 0,"$lzc$set_focusable",function($1){
with(this){
_setFocusable($1)
}},"_focusable",void 0,"onfocusable",void 0,"text",void 0,"doesenter",void 0,"$lzc$set_doesenter",function($1){
this._setDoesEnter($1)
},"$m47",function($1){
this.setAttribute("_enabled",this.enabled&&(this._parentcomponent?this._parentcomponent._enabled:true))
},"$m48",function(){
return [this,"enabled",this,"_parentcomponent",this._parentcomponent,"_enabled"]
},"_enabled",void 0,"$lzc$set__enabled",function($1){
this._setEnabled($1)
},"_parentcomponent",void 0,"_initcomplete",void 0,"isdefault",void 0,"$lzc$set_isdefault",function($1){
this._setIsDefault($1)
},"onisdefault",void 0,"hasdefault",void 0,"_setEnabled",function($1){
with(this){
this._enabled=$1;var $2=this._enabled&&this._focusable;if($2!=this.focusable){
this.focusable=$2;if(this.onfocusable.ready){
this.onfocusable.sendEvent()
}};if(_initcomplete){
_showEnabled()
};if(this.on_enabled.ready){
this.on_enabled.sendEvent()
}}},"_setFocusable",function($1){
this._focusable=$1;if(this.enabled){
this.focusable=this._focusable;if(this.onfocusable.ready){
this.onfocusable.sendEvent()
}}else{
this.focusable=false
}},"construct",function($1,$2){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2);var $3=this.immediateparent;while($3!=canvas){
if($3 instanceof lz.basecomponent){
this._parentcomponent=$3;break
};$3=$3.immediateparent
}}},"init",function(){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this);this._initcomplete=true;this._mousedownDel=new LzDelegate(this,"_doMousedown",this,"onmousedown");if(this.styleable){
_usestyle()
};if(!this["_enabled"]){
_showEnabled()
}}},"_doMousedown",function($1){

},"doSpaceDown",function(){
return false
},"doSpaceUp",function(){
return false
},"doEnterDown",function(){
return false
},"doEnterUp",function(){
return false
},"_setIsDefault",function($1){
with(this){
this.isdefault=this["isdefault"]==true;if(this.isdefault==$1){
return
};if($1){
lz._componentmanager.service.makeDefault(this)
}else{
lz._componentmanager.service.unmakeDefault(this)
};this.isdefault=$1;if(this.onisdefault.ready){
this.onisdefault.sendEvent($1)
}}},"_setDoesEnter",function($1){
with(this){
this.doesenter=$1;if(lz.Focus.getFocus()==this){
lz._componentmanager.service.checkDefault(this)
}}},"updateDefault",function(){
with(this){
lz._componentmanager.service.checkDefault(lz.Focus.getFocus())
}},"$m49",function($1){
this.setAttribute("style",null)
},"style",void 0,"$lzc$set_style",function($1){
with(this){
styleable?setStyle($1):(this.style=null)
}},"styleable",void 0,"_style",void 0,"onstyle",void 0,"_styledel",void 0,"_otherstyledel",void 0,"setStyle",function($1){
with(this){
if(!styleable){
return
};if($1!=null&&!$1["isstyle"]){
var $2=this._style;if(!$2){
if(this._parentcomponent){
$2=this._parentcomponent.style
}else{
$2=lz._componentmanager.service.getDefaultStyle()
}};$1=$2.extend($1)
};this._style=$1;if($1==null){
if(!this._otherstyledel){
this._otherstyledel=new LzDelegate(this,"_setstyle")
}else{
this._otherstyledel.unregisterAll()
};if(this._parentcomponent&&this._parentcomponent.styleable){
this._otherstyledel.register(this._parentcomponent,"onstyle");$1=this._parentcomponent.style
}else{
this._otherstyledel.register(lz._componentmanager.service,"ondefaultstyle");$1=lz._componentmanager.service.getDefaultStyle()
}}else{
if(this._otherstyledel){
this._otherstyledel.unregisterAll();this._otherstyledel=null
}};_setstyle($1)
}},"_usestyle",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(this._initcomplete&&this["style"]&&this.style.isinited){
this._applystyle(this.style)
}},"_setstyle",function($1){
with(this){
if(!this._styledel){
this._styledel=new LzDelegate(this,"_usestyle")
}else{
_styledel.unregisterAll()
};if($1){
_styledel.register($1,"onstylechanged")
};this.style=$1;_usestyle();if(this.onstyle.ready){
this.onstyle.sendEvent(this.style)
}}},"_applystyle",function($1){

},"setTint",function($1,$2,$3){
with(this){
switch(arguments.length){
case 2:
$3=0;

};if($1.capabilities.colortransform){
if($2!=""&&$2!=null){
var $4=$2;var $5=$4>>16&255;var $6=$4>>8&255;var $7=$4&255;$5+=51;$6+=51;$7+=51;$5=$5/255*100;$6=$6/255*100;$7=$7/255*100;$1.setColorTransform({ra:$5,ga:$6,ba:$7,rb:$3,gb:$3,bb:$3})
}}}},"on_enabled",void 0,"_showEnabled",function(){

},"acceptValue",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};this.setAttribute("text",$1)
},"presentValue",function($1){
switch(arguments.length){
case 0:
$1=null;

};return this.text
},"$lzc$presentValue_dependencies",function($1,$2,$3){
switch(arguments.length){
case 2:
$3=null;

};return [this,"text"]
},"applyData",function($1){
this.acceptValue($1)
},"updateData",function(){
return this.presentValue()
},"destroy",function(){
with(this){
if(this["isdefault"]&&this.isdefault){
lz._componentmanager.service.unmakeDefault(this)
};if(this._otherstyledel){
this._otherstyledel.unregisterAll();this._otherstyledel=null
};if(this._styledel){
this._styledel.unregisterAll();this._styledel=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this)
}},"toString",function(){
var $1="";var $2="";var $3="";if(this["id"]!=null){
$1="  id="+this.id
};if(this["name"]!=null){
$2=' named "'+this.name+'"'
};if(this["text"]&&this.text!=""){
$3="  text="+this.text
};return this.constructor.tagname+$2+$1+$3
}],["tagname","basecomponent","attributes",new LzInheritedHash(LzView.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({_enabled:new LzAlwaysExpr("$m47","$m48"),_focusable:true,_initcomplete:false,_otherstyledel:null,_parentcomponent:null,_style:null,_styledel:null,doesenter:false,enabled:true,focusable:true,hasdefault:false,on_enabled:LzDeclaredEvent,onfocusable:LzDeclaredEvent,onisdefault:LzDeclaredEvent,onstyle:LzDeclaredEvent,style:new LzOnceExpr("$m49"),styleable:true,text:""},$lzc$class_basecomponent.attributes)
}}})($lzc$class_basecomponent);Class.make("$lzc$class_basebutton",$lzc$class_basecomponent,["normalResourceNumber",void 0,"overResourceNumber",void 0,"downResourceNumber",void 0,"disabledResourceNumber",void 0,"$m50",function($1){
this.setAttribute("maxframes",this.totalframes)
},"maxframes",void 0,"resourceviewcount",void 0,"$lzc$set_resourceviewcount",function($1){
this.setResourceViewCount($1)
},"respondtomouseout",void 0,"$m51",function($1){
this.setAttribute("reference",this)
},"reference",void 0,"$lzc$set_reference",function($1){
with(this){
setreference($1)
}},"onresourceviewcount",void 0,"_msdown",void 0,"_msin",void 0,"setResourceViewCount",function($1){
this.resourceviewcount=$1;if(this._initcomplete){
if($1>0){
if(this.subviews){
this.maxframes=this.subviews[0].totalframes;if(this.onresourceviewcount){
this.onresourceviewcount.sendEvent()
}}}}},"_callShow",function(){
if(this._msdown&&this._msin&&this.maxframes>=this.downResourceNumber){
this.showDown()
}else{
if(this._msin&&this.maxframes>=this.overResourceNumber){
this.showOver()
}else{
this.showUp()
}}},"$m53",function(){
with(this){
var $1=lz.ModeManager;return $1
}},"$m54",function($1){
if($1&&(this._msdown||this._msin)&&!this.childOf($1)){
this._msdown=false;this._msin=false;this._callShow()
}},"$lzc$set_frame",function($1){
with(this){
if(this.resourceviewcount>0){
for(var $2=0;$2<resourceviewcount;$2++){
this.subviews[$2].setAttribute("frame",$1)
}}else{
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzc$set_frame"]:this.nextMethod(arguments.callee,"$lzc$set_frame")).call(this,$1)
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
}},"$m56",function($1){
if(this.isinited){
this.maxframes=this.totalframes;this._callShow()
}},"init",function(){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this);this.setResourceViewCount(this.resourceviewcount);this._callShow()
}},"$m58",function($1){
this.setAttribute("_msin",true);this._callShow()
},"$m60",function($1){
this.setAttribute("_msin",false);this._callShow()
},"$m62",function($1){
this.setAttribute("_msdown",true);this._callShow()
},"$m64",function($1){
this.setAttribute("_msdown",false);this._callShow()
},"_showEnabled",function(){
with(this){
reference.setAttribute("clickable",this._enabled);showUp()
}},"showDown",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.setAttribute("frame",this.downResourceNumber)
},"showUp",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(!this._enabled&&this.disabledResourceNumber){
this.setAttribute("frame",this.disabledResourceNumber)
}else{
this.setAttribute("frame",this.normalResourceNumber)
}},"showOver",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.setAttribute("frame",this.overResourceNumber)
},"setreference",function($1){
this.reference=$1;if($1!=this){
this.setAttribute("clickable",false)
}},"_applystyle",function($1){
with(this){
setTint(this,$1.basecolor)
}}],["tagname","basebutton","attributes",new LzInheritedHash($lzc$class_basecomponent.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["onmode","$m54","$m53","ontotalframes","$m56",null,"onmouseover","$m58",null,"onmouseout","$m60",null,"onmousedown","$m62",null,"onmouseup","$m64",null],_msdown:false,_msin:false,clickable:true,disabledResourceNumber:4,downResourceNumber:3,focusable:false,maxframes:new LzOnceExpr("$m50"),normalResourceNumber:1,onclick:LzDeclaredEvent,onresourceviewcount:LzDeclaredEvent,overResourceNumber:2,reference:new LzOnceExpr("$m51"),resourceviewcount:0,respondtomouseout:true,styleable:false},$lzc$class_basebutton.attributes)
}}})($lzc$class_basebutton);Class.make("$lzc$class_swatchview",LzView,["ctransform",void 0,"color",void 0,"construct",function($1,$2){
with(this){
this.capabilities=new LzInheritedHash(this.capabilities);this.capabilities.colortransform=true;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2);if($2["width"]==null){
$2["width"]=this.immediateparent.width
};if($2["height"]==null){
$2["height"]=this.immediateparent.height
};if($2["fgcolor"]==null&&$2["bgcolor"]==null){
$2["fgcolor"]=16777215
}}},"$lzc$set_fgcolor",function($1){
this.setAttribute("bgcolor",$1)
},"$lzc$set_bgcolor",function($1){
with(this){
this.color=$1;if(this.ctransform!=null){
var $2=$1>>16&255;var $3=$1>>8&255;var $4=$1&255;$2=$2*ctransform["ra"]/100+ctransform["rb"];$2=Math.min($2,255);$3=$3*ctransform["ga"]/100+ctransform["gb"];$3=Math.min($3,255);$4=$4*ctransform["ba"]/100+ctransform["bb"];$4=Math.min($4,255);$1=$4+($3<<8)+($2<<16)
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzc$set_bgcolor"]:this.nextMethod(arguments.callee,"$lzc$set_bgcolor")).call(this,$1)
}},"setColorTransform",function($1){
this.ctransform=$1;this.setAttribute("bgcolor",this.color)
}],["tagname","swatchview","attributes",new LzInheritedHash(LzView.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({color:16777215,ctransform:null},$lzc$class_swatchview.attributes)
}}})($lzc$class_swatchview);LzResourceLibrary.lzbutton_face_rsc={ptype:"sr",frames:["lps/components/lz/resources/button/simpleface_up.png","lps/components/lz/resources/button/simpleface_mo.png","lps/components/lz/resources/button/simpleface_dn.png","lps/components/lz/resources/button/autoPng/simpleface_dsbl.png"],width:2,height:18,sprite:"lps/components/lz/resources/button/simpleface_up.sprite.png"};LzResourceLibrary.lzbutton_bezel_inner_rsc={ptype:"sr",frames:["lps/components/lz/resources/autoPng/bezel_inner_up.png","lps/components/lz/resources/autoPng/bezel_inner_up.png","lps/components/lz/resources/autoPng/bezel_inner_dn.png","lps/components/lz/resources/autoPng/outline_dsbl.png"],width:500,height:500,sprite:"lps/components/lz/resources/autoPng/bezel_inner_up.sprite.png"};LzResourceLibrary.lzbutton_bezel_outer_rsc={ptype:"sr",frames:["lps/components/lz/resources/autoPng/bezel_outer_up.png","lps/components/lz/resources/autoPng/bezel_outer_up.png","lps/components/lz/resources/autoPng/bezel_outer_dn.png","lps/components/lz/resources/autoPng/transparent.png","lps/components/lz/resources/autoPng/default_outline.png"],width:500,height:500,sprite:"lps/components/lz/resources/autoPng/bezel_outer_up.sprite.png"};Class.make("$lzc$class_$m111",LzView,["$m77",function($1){
with(this){
this.setAttribute("width",parent.width-1)
}},"$m78",function(){
with(this){
return [parent,"width"]
}},"$m79",function($1){
with(this){
this.setAttribute("height",parent.height-1)
}},"$m80",function(){
with(this){
return [parent,"height"]
}},"$classrootdepth",void 0],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m112",LzView,["$m81",function($1){
with(this){
this.setAttribute("width",parent.width-3)
}},"$m82",function(){
with(this){
return [parent,"width"]
}},"$m83",function($1){
with(this){
this.setAttribute("height",parent.height-3)
}},"$m84",function(){
with(this){
return [parent,"height"]
}},"$classrootdepth",void 0],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m113",LzView,["$m85",function($1){
with(this){
this.setAttribute("width",parent.width-4)
}},"$m86",function(){
with(this){
return [parent,"width"]
}},"$m87",function($1){
with(this){
this.setAttribute("height",parent.height-4)
}},"$m88",function(){
with(this){
return [parent,"height"]
}},"$classrootdepth",void 0],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m114",LzView,["$m89",function($1){
with(this){
this.setAttribute("x",parent.parent.width-2)
}},"$m90",function(){
with(this){
return [parent.parent,"width"]
}},"$m91",function($1){
with(this){
this.setAttribute("height",parent.parent.height-2)
}},"$m92",function(){
with(this){
return [parent.parent,"height"]
}},"$classrootdepth",void 0],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m115",LzView,["$m93",function($1){
with(this){
this.setAttribute("y",parent.parent.height-2)
}},"$m94",function(){
with(this){
return [parent.parent,"height"]
}},"$m95",function($1){
with(this){
this.setAttribute("width",parent.parent.width-3)
}},"$m96",function(){
with(this){
return [parent.parent,"width"]
}},"$classrootdepth",void 0],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m116",LzView,["$m97",function($1){
with(this){
this.setAttribute("x",parent.parent.width-1)
}},"$m98",function(){
with(this){
return [parent.parent,"width"]
}},"$m99",function($1){
with(this){
this.setAttribute("height",parent.parent.height)
}},"$m100",function(){
with(this){
return [parent.parent,"height"]
}},"$classrootdepth",void 0],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m117",LzView,["$m101",function($1){
with(this){
this.setAttribute("y",parent.parent.height-1)
}},"$m102",function(){
with(this){
return [parent.parent,"height"]
}},"$m103",function($1){
with(this){
this.setAttribute("width",parent.parent.width-1)
}},"$m104",function(){
with(this){
return [parent.parent,"width"]
}},"$classrootdepth",void 0],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m118",LzText,["$m105",function($1){
with(this){
this.setAttribute("x",parent.text_x+parent.titleshift)
}},"$m106",function(){
with(this){
return [parent,"text_x",parent,"titleshift"]
}},"$m107",function($1){
with(this){
this.setAttribute("y",parent.text_y+parent.titleshift)
}},"$m108",function(){
with(this){
return [parent,"text_y",parent,"titleshift"]
}},"$m109",function($1){
with(this){
this.setAttribute("text",parent.text)
}},"$m110",function(){
with(this){
return [parent,"text"]
}},"$classrootdepth",void 0],["tagname","text","attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_button",$lzc$class_basebutton,["text_padding_x",void 0,"text_padding_y",void 0,"$m65",function($1){
this.setAttribute("text_x",this.width/2-this._title.width/2)
},"$m66",function(){
return [this,"width",this._title,"width"]
},"text_x",void 0,"$m67",function($1){
this.setAttribute("text_y",this.height/2-this._title.height/2)
},"$m68",function(){
return [this,"height",this._title,"height"]
},"text_y",void 0,"$m69",function($1){
this.setAttribute("width",this._title.width+2*this.text_padding_x)
},"$m70",function(){
return [this._title,"width",this,"text_padding_x"]
},"$m71",function($1){
this.setAttribute("height",this._title.height+2*this.text_padding_y)
},"$m72",function(){
return [this._title,"height",this,"text_padding_y"]
},"buttonstate",void 0,"$m73",function($1){
this.setAttribute("titleshift",this.buttonstate==1?0:1)
},"$m74",function(){
return [this,"buttonstate"]
},"titleshift",void 0,"leftalign",void 0,"_showEnabled",function(){
with(this){
showUp();setAttribute("clickable",_enabled)
}},"showDown",function($1){
with(this){
switch(arguments.length){
case 0:
$1=null;

};if(this.hasdefault){
this._outerbezel.setAttribute("frame",5)
}else{
this._outerbezel.setAttribute("frame",this.downResourceNumber)
};this._face.setAttribute("frame",this.downResourceNumber);this._innerbezel.setAttribute("frame",this.downResourceNumber);setAttribute("buttonstate",2)
}},"showUp",function($1){
with(this){
switch(arguments.length){
case 0:
$1=null;

};if(_enabled){
if(this.hasdefault){
this._outerbezel.setAttribute("frame",5)
}else{
this._outerbezel.setAttribute("frame",this.normalResourceNumber)
};this._face.setAttribute("frame",this.normalResourceNumber);this._innerbezel.setAttribute("frame",this.normalResourceNumber);if(this.style){
this._title.setAttribute("fgcolor",this.style.textcolor)
}}else{
if(this.style){
this._title.setAttribute("fgcolor",this.style.textdisabledcolor)
};this._face.setAttribute("frame",this.disabledResourceNumber);this._outerbezel.setAttribute("frame",this.disabledResourceNumber);this._innerbezel.setAttribute("frame",this.disabledResourceNumber)
};setAttribute("buttonstate",1)
}},"showOver",function($1){
with(this){
switch(arguments.length){
case 0:
$1=null;

};if(this.hasdefault){
this._outerbezel.setAttribute("frame",5)
}else{
this._outerbezel.setAttribute("frame",this.overResourceNumber)
};this._face.setAttribute("frame",this.overResourceNumber);this._innerbezel.setAttribute("frame",this.overResourceNumber);setAttribute("buttonstate",1)
}},"$m76",function($1){
with(this){
if(this._initcomplete){
if(this.buttonstate==1){
showUp()
}}}},"_applystyle",function($1){
with(this){
if(this.style!=null){
this.textcolor=$1.textcolor;this.textdisabledcolor=$1.textdisabledcolor;if(enabled){
_title.setAttribute("fgcolor",$1.textcolor)
}else{
_title.setAttribute("fgcolor",$1.textdisabledcolor)
};setTint(_outerbezel,$1.basecolor);setTint(_innerbezel,$1.basecolor);setTint(_face,$1.basecolor)
}}},"_outerbezel",void 0,"_innerbezel",void 0,"_face",void 0,"_innerbezelbottom",void 0,"_outerbezelbottom",void 0,"_title",void 0],["tagname","button","children",LzNode.mergeChildren([{attrs:{$classrootdepth:1,bgcolor:LzColorUtils.convertColor("0x919191"),height:new LzAlwaysExpr("$m79","$m80"),name:"_outerbezel",width:new LzAlwaysExpr("$m77","$m78"),x:0,y:0},"class":$lzc$class_$m111},{attrs:{$classrootdepth:1,bgcolor:LzColorUtils.convertColor("0xffffff"),height:new LzAlwaysExpr("$m83","$m84"),name:"_innerbezel",width:new LzAlwaysExpr("$m81","$m82"),x:1,y:1},"class":$lzc$class_$m112},{attrs:{$classrootdepth:1,height:new LzAlwaysExpr("$m87","$m88"),name:"_face",resource:"lzbutton_face_rsc",stretches:"both",width:new LzAlwaysExpr("$m85","$m86"),x:2,y:2},"class":$lzc$class_$m113},{attrs:{$classrootdepth:1,name:"_innerbezelbottom"},children:[{attrs:{$classrootdepth:2,bgcolor:LzColorUtils.convertColor("0x585858"),height:new LzAlwaysExpr("$m91","$m92"),width:1,x:new LzAlwaysExpr("$m89","$m90"),y:1},"class":$lzc$class_$m114},{attrs:{$classrootdepth:2,bgcolor:LzColorUtils.convertColor("0x585858"),height:1,width:new LzAlwaysExpr("$m95","$m96"),x:1,y:new LzAlwaysExpr("$m93","$m94")},"class":$lzc$class_$m115}],"class":LzView},{attrs:{$classrootdepth:1,name:"_outerbezelbottom"},children:[{attrs:{$classrootdepth:2,bgcolor:LzColorUtils.convertColor("0xffffff"),height:new LzAlwaysExpr("$m99","$m100"),opacity:0.7,width:1,x:new LzAlwaysExpr("$m97","$m98"),y:0},"class":$lzc$class_$m116},{attrs:{$classrootdepth:2,bgcolor:LzColorUtils.convertColor("0xffffff"),height:1,opacity:0.7,width:new LzAlwaysExpr("$m103","$m104"),x:0,y:new LzAlwaysExpr("$m101","$m102")},"class":$lzc$class_$m117}],"class":LzView},{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$m109","$m110"),x:new LzAlwaysExpr("$m105","$m106"),y:new LzAlwaysExpr("$m107","$m108")},"class":$lzc$class_$m118}],$lzc$class_basebutton["children"]),"attributes",new LzInheritedHash($lzc$class_basebutton.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["onhasdefault","$m76",null],buttonstate:1,clickable:true,doesenter:true,focusable:true,height:new LzAlwaysExpr("$m71","$m72"),leftalign:false,maxframes:4,pixellock:true,styleable:true,text_padding_x:11,text_padding_y:4,text_x:new LzAlwaysExpr("$m65","$m66"),text_y:new LzAlwaysExpr("$m67","$m68"),titleshift:new LzAlwaysExpr("$m73","$m74"),width:new LzAlwaysExpr("$m69","$m70")},$lzc$class_button.attributes)
}}})($lzc$class_button);Class.make("$lzc$class_basevaluecomponent",$lzc$class_basecomponent,["value",void 0,"type",void 0,"getValue",function(){
return this.value==null?this.text:this.value
},"$lzc$getValue_dependencies",function($1,$2){
return [this,"value",this,"text"]
},"acceptValue",function($1,$2){
with(this){
switch(arguments.length){
case 1:
$2=null;

};if($2==null){
$2=this.type
};(arguments.callee.superclass?arguments.callee.superclass.prototype["acceptValue"]:this.nextMethod(arguments.callee,"acceptValue")).call(this,$1,$2);this.acceptAttribute("value",$2,$1)
}},"presentValue",function($1){
switch(arguments.length){
case 0:
$1=null;

};if($1==null){
$1=this.type
};return this.presentTypeValue($1,this.getValue())
},"$lzc$presentValue_dependencies",function($1,$2,$3){
switch(arguments.length){
case 2:
$3=null;

};return [this,"type"].concat(this.$lzc$getValue_dependencies($1,$2))
}],["tagname","basevaluecomponent","attributes",new LzInheritedHash($lzc$class_basecomponent.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({type:"",value:null},$lzc$class_basevaluecomponent.attributes)
}}})($lzc$class_basevaluecomponent);Class.make("$lzc$class_baseformitem",$lzc$class_basevaluecomponent,["_parentform",void 0,"submitname",void 0,"$m119",function($1){
with(this){
this.setAttribute("submit",enabled)
}},"$m120",function(){
return [this,"enabled"]
},"submit",void 0,"changed",void 0,"$lzc$set_changed",function($1){
this.setChanged($1)
},"$lzc$set_value",function($1){
this.setValue($1,false)
},"onchanged",void 0,"onvalue",void 0,"rollbackvalue",void 0,"ignoreform",void 0,"init",function(){
with(this){
if(this.submitname==""){
this.submitname=this.name
};if(this.submitname==""){
return
};(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this)
}},"destroy",function(){
with(this){
if(this._parentform){
this._parentform.removeFormItem(this)
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
}},"$m122",function($1){
var $2=this.findForm();if($2!=null){
$2.addFormItem(this);this._parentform=$2
}},"setChanged",function($1,$2){
with(this){
switch(arguments.length){
case 1:
$2=null;

};if(!this._initcomplete){
this.changed=false;return
};var $3=this.changed;this.changed=$1;if(this.changed!=$3){
if(this.onchanged){
this.onchanged.sendEvent(this.changed)
}};if(!$2&&this.changed&&!ignoreform){
if(this["_parentform"]&&this._parentform["changed"]!=undefined&&!this._parentform.changed){
this._parentform.setChanged($1,false)
}};if(!$2&&!this.changed&&!ignoreform){
if(this["_parentform"]&&this._parentform["changed"]!=undefined&&this._parentform.changed){
this._parentform.setChanged($1,true)
}}}},"rollback",function(){
if(this.rollbackvalue!=this["value"]){
this.setAttribute("value",this.rollbackvalue)
};this.setAttribute("changed",false)
},"commit",function(){
this.rollbackvalue=this.value;this.setAttribute("changed",false)
},"setValue",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};var $3=this.value!=$1;this.value=$1;if($2||!this._initcomplete){
this.rollbackvalue=$1
};this.setChanged($3&&!$2&&this.rollbackvalue!=$1);if(this["onvalue"]){
this.onvalue.sendEvent($1)
}},"acceptValue",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if($2==null){
$2=this.type
};this.setValue(this.acceptTypeValue($2,$1),true)
},"findForm",function(){
with(this){
if(_parentform!=null){
return _parentform
}else{
var $1=this.immediateparent;var $2=null;while($1!=canvas){
if($1["formdata"]){
$2=$1;break
};$1=$1.immediateparent
};return $2
}}},"toXML",function($1){
with(this){
var $2=this.value;if($1){
if(typeof $2=="boolean"){
$2=$2-0
}};return lz.Browser.xmlEscape(this.submitname)+'="'+lz.Browser.xmlEscape($2)+'"'
}}],["tagname","baseformitem","attributes",new LzInheritedHash($lzc$class_basevaluecomponent.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["oninit","$m122",null],_parentform:null,changed:false,ignoreform:false,onchanged:LzDeclaredEvent,onvalue:LzDeclaredEvent,rollbackvalue:null,submit:new LzAlwaysExpr("$m119","$m120"),submitname:"",value:null},$lzc$class_baseformitem.attributes)
}}})($lzc$class_baseformitem);Class.make("$lzc$class_multistatebutton",$lzc$class_basebutton,["statenum",void 0,"$lzc$set_statenum",function($1){
this.setStateNum($1)
},"statelength",void 0,"$lzc$set_statelength",function($1){
this.setStateLength($1)
},"maxstate",void 0,"lastres",void 0,"$m123",function($1){
this.setAttribute("frame",this.lastres+this.statenum*this.statelength)
},"$m124",function(){
return [this,"lastres",this,"statenum",this,"statelength"]
},"onstatenum",void 0,"onstatelength",void 0,"showDown",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.setAttribute("lastres",this.downResourceNumber)
},"showUp",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(!this._enabled&&this.disabledResourceNumber){
this.setAttribute("lastres",this.disabledResourceNumber)
}else{
this.setAttribute("lastres",this.normalResourceNumber)
}},"showOver",function($1){
switch(arguments.length){
case 0:
$1=null;

};this.setAttribute("lastres",this.overResourceNumber)
},"setStateNum",function($1){
if($1>this.maxstate){
return
};this.statenum=$1;if(this.onstatenum){
this.onstatenum.sendEvent($1)
}},"setStateLength",function($1){
this.statelength=$1;if(this.statelength==2){
this.overResourceNumber=this.normalResourceNumber;if(this.downResourceNumber==3){
this.downResourceNumber=2
}}else{
if(this.statelength==1){
this.overResourceNumber=1;this.downResourceNumber=1
}};if(this.onstatelength){
this.onstatelength.sendEvent($1)
}},"_showEnabled",function(){
with(this){
reference.setAttribute("clickable",this._enabled);this.showUp()
}}],["tagname","multistatebutton","attributes",new LzInheritedHash($lzc$class_basebutton.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({clickable:true,frame:new LzAlwaysExpr("$m123","$m124"),lastres:1,maxstate:0,onstatelength:LzDeclaredEvent,onstatenum:LzDeclaredEvent,statelength:3,statenum:0},$lzc$class_multistatebutton.attributes)
}}})($lzc$class_multistatebutton);LzResourceLibrary.lzcheckbox_rsrc={ptype:"sr",frames:["lps/components/lz/resources/checkbox/autoPng/checkbox_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_off_mo.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on.png","lps/components/lz/resources/checkbox/autoPng/checkbox_disable_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on_mo.png","lps/components/lz/resources/checkbox/autoPng/checkbox_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_disable_on.png"],width:15,height:14,sprite:"lps/components/lz/resources/checkbox/autoPng/checkbox_off.sprite.png"};Class.make("$lzc$class_$m136",LzText,["$m125",function($1){
with(this){
this.setAttribute("y",classroot.text_y)
}},"$m126",function(){
with(this){
return [classroot,"text_y"]
}},"$m127",function($1){
with(this){
this.setAttribute("text",parent.text)
}},"$m128",function(){
with(this){
return [parent,"text"]
}},"$classrootdepth",void 0],["tagname","text","attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_$m137",$lzc$class_multistatebutton,["$m131",function($1){
with(this){
this.setAttribute("statenum",parent.value?1:0)
}},"$m132",function(){
with(this){
return [parent,"value"]
}},"$m133",function($1){
with(this){
this.setAttribute("reference",parent)
}},"$classrootdepth",void 0],["tagname","multistatebutton","attributes",new LzInheritedHash($lzc$class_multistatebutton.attributes)]);Class.make("$lzc$class_checkbox",$lzc$class_baseformitem,["_title",void 0,"$m129",function($1){
this.setAttribute("text_y",this.cb.height/2-this._title.height/2+1)
},"$m130",function(){
return [this.cb,"height",this._title,"height"]
},"text_y",void 0,"$lzc$set_value",function($1){
with(this){
setValue($1)
}},"cb",void 0,"doSpaceUp",function(){
if(this._enabled){
this.setAttribute("value",!this.value)
}},"$m135",function($1){
if(this._enabled){
this.setAttribute("value",!this.value)
}},"_applystyle",function($1){
with(this){
if(this.style!=null){
if(_enabled){
_title.setAttribute("fgcolor",$1.textcolor)
}else{
_title.setAttribute("fgcolor",$1.textdisabledcolor)
};setTint(this.cb,$1.basecolor)
}}},"_showEnabled",function(){
with(this){
_applystyle(this.style)
}},"setValue",function($1,$2){
with(this){
switch(arguments.length){
case 1:
$2=null;

};if($1=="false"){
$1=false
}else{
if($1=="true"){
$1=true
}else{
$1=!(!$1)
}};(arguments.callee.superclass?arguments.callee.superclass.prototype["setValue"]:this.nextMethod(arguments.callee,"setValue")).call(this,$1,$2)
}}],["tagname","checkbox","children",LzNode.mergeChildren([{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$m127","$m128"),x:16,y:new LzAlwaysExpr("$m125","$m126")},"class":$lzc$class_$m136},{attrs:{$classrootdepth:1,maxstate:1,name:"cb",reference:new LzOnceExpr("$m133"),resource:"lzcheckbox_rsrc",statelength:4,statenum:new LzAlwaysExpr("$m131","$m132"),text:""},"class":$lzc$class_$m137}],$lzc$class_baseformitem["children"]),"attributes",new LzInheritedHash($lzc$class_baseformitem.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["onclick","$m135",null],clickable:true,pixellock:true,text_y:new LzAlwaysExpr("$m129","$m130"),value:false},$lzc$class_checkbox.attributes)
}}})($lzc$class_checkbox);Class.make("$lzc$class_listselector",LzSelectionManager,["multiselect",void 0,"_forcemulti",void 0,"isRangeSelect",function($1){
with(this){
return this.multiselect&&(arguments.callee.superclass?arguments.callee.superclass.prototype["isRangeSelect"]:this.nextMethod(arguments.callee,"isRangeSelect")).call(this,$1)
}},"isMultiSelect",function($1){
with(this){
return this._forcemulti||this.multiselect&&(arguments.callee.superclass?arguments.callee.superclass.prototype["isMultiSelect"]:this.nextMethod(arguments.callee,"isMultiSelect")).call(this,$1)
}},"select",function($1){
with(this){
if(this.multiselect&&(Array["$lzsc$isa"]?Array.$lzsc$isa($1):$1 instanceof Array)){
this._forcemulti=true;for(var $2=0;$2<$1.length;$2++){
(arguments.callee.superclass?arguments.callee.superclass.prototype["select"]:this.nextMethod(arguments.callee,"select")).call(this,$1[$2])
};this._forcemulti=false
}else{
(arguments.callee.superclass?arguments.callee.superclass.prototype["select"]:this.nextMethod(arguments.callee,"select")).call(this,$1)
}}},"getValue",function(){
with(this){
var $1=this.getSelection();if($1.length==0){
return null
};if($1.length==1&&!multiselect){
return $1[0].getValue()
};var $2=[];for(var $3=0;$3<$1.length;$3++){
$2[$3]=$1[$3].getValue()
};return $2
}},"getText",function(){
with(this){
var $1=this.getSelection();if($1.length==0){
return null
};if($1.length==1&&!multiselect){
return $1[0].text
};var $2=[];for(var $3=0;$3<$1.length;$3++){
$2[$3]=$1[$3].text
};return $2
}},"getNumItems",function(){
if(!this.immediateparent.subviews){
return 0
};return this.immediateparent.subviews.length
},"getNextSubview",function($1,$2){
with(this){
switch(arguments.length){
case 1:
$2=1;

};if(typeof $2=="undefined"){
$2=1
};var $3=this.immediateparent.subviews;if(!$1){
if($2>0){
return $3[0]
}else{
return $3[$3.length-1]
}};var $4;var $5=$3.length;for(var $6=0;$6<$5;$6++){
var $7=$3[$6];if($7==$1){
var $8=$6+$2;if($8<0){
$4=$3[0]
}else{
if($8>=$5){
$4=$3[$5-1]
}else{
$4=$3[$8]
}};break
}};ensureItemInView($4);return $4
}},"ensureItemInView",function($1){
with(this){
if(!$1){
return
};var $2=immediateparent.parent;var $3=false;if($1.y+$1.height>$2.height-immediateparent.y){
var $4=$2.height-immediateparent.y-($1.y+$1.height);var $5=Math.max($2.height-immediateparent.height,immediateparent.y+$4);immediateparent.setAttribute("y",$5);$3=true
}else{
if(immediateparent.y*-1>$1.y){
var $4=immediateparent.y*-1-$1.y;var $5=Math.min(0,immediateparent.y+$4);immediateparent.setAttribute("y",$5);$3=true
}};if($3){
this._updatefromscrolling=true
}}},"_updatefromscrolling",void 0,"allowhilite",function($1){
if(this._updatefromscrolling){
if($1!=null){
this._updatefromscrolling=false
};return false
};return true
},"getItemByIndex",function($1){
return this.parent._contentview.subviews[$1]
}],["tagname","listselector","attributes",new LzInheritedHash(LzSelectionManager.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({_forcemulti:false,_updatefromscrolling:false,multiselect:false},$lzc$class_listselector.attributes)
}}})($lzc$class_listselector);Class.make("$lzc$class_datalistselector",LzDataSelectionManager,["multiselect",void 0,"_forcemulti",void 0,"isRangeSelect",function($1){
with(this){
return this.multiselect&&(arguments.callee.superclass?arguments.callee.superclass.prototype["isRangeSelect"]:this.nextMethod(arguments.callee,"isRangeSelect")).call(this,$1)
}},"isMultiSelect",function($1){
with(this){
return this._forcemulti||this.multiselect&&(arguments.callee.superclass?arguments.callee.superclass.prototype["isMultiSelect"]:this.nextMethod(arguments.callee,"isMultiSelect")).call(this,$1)
}},"select",function($1){
with(this){
if(this.multiselect&&(Array["$lzsc$isa"]?Array.$lzsc$isa($1):$1 instanceof Array)){
this._forcemulti=true;for(var $2=0;$2<$1.length;$2++){
(arguments.callee.superclass?arguments.callee.superclass.prototype["select"]:this.nextMethod(arguments.callee,"select")).call(this,$1[$2])
};this._forcemulti=false
}else{
(arguments.callee.superclass?arguments.callee.superclass.prototype["select"]:this.nextMethod(arguments.callee,"select")).call(this,$1)
}}},"getValue",function(){
with(this){
var $1=this.getSelection();if($1.length==0){
return null
};var $2=this.immediateparent.subviews[0]._valuedatapath;if(!$2){
$2=this.immediateparent.subviews[0]._textdatapath
};if(!$2){
$2="text()"
};if($1.length==1&&!multiselect){
return $1[0].xpathQuery($2)
}else{
var $3=[];for(var $4=0;$4<$1.length;$4++){
$3[$4]=$1[$4].xpathQuery($2)
};return $3
}}},"getText",function(){
with(this){
var $1=this.getSelection();if($1.length==0){
return null
};var $2=this.immediateparent.subviews[0]._textdatapath;if(!$2){
$2="text()"
};if($1.length==1&&!multiselect){
return $1[0].xpathQuery($2)
}else{
var $3=[];for(var $4=0;$4<$1.length;$4++){
$3[$4]=$1[$4].xpathQuery($2)
};return $3
}}},"getNumItems",function(){
with(this){
if(!this.cloneManager){
var $1=immediateparent.subviews;if($1==null||$1.length==0){
return 0
}else{
this.cloneManager=$1[0].cloneManager
}};if(this.cloneManager!=null){
if(!this.cloneManager["nodes"]){
return 0
}else{
return this.cloneManager.nodes.length
}}else{
if($1[0].data){
return 1
}else{
return 0
}}}},"getNextSubview",function($1,$2){
with(this){
switch(arguments.length){
case 1:
$2=1;

};var $3=immediateparent.subviews[0].cloneManager["clones"];if($1==null){
var $4=$2==-1&&parent.shownitems!=-1?parent.shownitems-1:0;return $3[$4]
};var $5=findIndex($1);if($5==-1){
return null
};var $6=immediateparent.subviews[0].cloneManager.nodes;if(!$2){
$2=1
};$5+=$2;if($5==-1){
$5=0
};if($5==$6.length){
$5=$6.length-1
};_ensureItemInViewByIndex($5);var $7=$6[$5];var $8=immediateparent.subviews;for(var $9=0;$9<$8.length;$9++){
if($8[$9].datapath.p==$7){
return $8[$9]
}}}},"findIndex",function($1){
with(this){
if(!immediateparent.subviews[0].cloneManager){
if($1 instanceof lz.view){
return immediateparent.subviews[0]==$1?0:-1
}else{
return immediateparent.subviews[0].datapath.p==$1.p?0:-1
}};var $2;if($1 instanceof lz.view){
$2=$1.datapath.p
}else{
$2=$1.p
};var $3=immediateparent.subviews[0].cloneManager.nodes;var $4=-1;for(var $5=0;$5<$3.length;$5++){
if($3[$5]==$2){
$4=$5;break
}};return $4
}},"ensureItemInView",function($1){
with(this){
if(!$1){
return
};var $2=findIndex($1);if($2!=-1){
_ensureItemInViewByIndex($2)
}}},"_ensureItemInViewByIndex",function($1){
with(this){
var $2=this.immediateparent;var $3=$2.subviews;if(!$3||$3.length==0){
return
};var $4=$3[0].height;var $5=$1*$4;var $6=0;if($1>0){
var $7=$3[0].cloneManager;if(parent["spacing"]){
$6=parent.spacing
}else{
if($7&&$7["spacing"]){
$6=$7.spacing
}};$5+=$6*($1-1)
};var $8=false;var $9=$2.parent.height;var $10=$2.y;if($5+$4>$9-$10){
var $11=$9-$10-($5+$4+$6);var $12=Math.max($9-$2.height,$10+$11);$2.setAttribute("y",$12);$8=true
}else{
if($10*-1>$5){
var $11=$10*-1-$5-$6;var $12=Math.min(0,$10+$11);$2.setAttribute("y",$12);$8=true
}};if($8){
this._updatefromscrolling=true
}}},"getItemByIndex",function($1){
with(this){
var $2=immediateparent.subviews;if(!$2||$2.length==0){
return null
};this._ensureItemInViewByIndex($1);var $3=$2[0].cloneManager;if($3==null){
return $1==0?$2[0]:undefined
};var $4=$3.clones[0].datapath.xpathQuery("position()")-1;return $3.clones[$1-$4]
}},"getItemByData",function($1){
with(this){
return $1?getItemByIndex(this.getItemIndexByData($1)):null
}},"getItemIndexByData",function($1){
with(this){
if($1){
var $2=immediateparent.subviews;if($2[0].cloneManager){
var $3=$2[0].cloneManager["nodes"];if($3!=null){
for(var $4=0;$4<$3.length;$4++){
if($3[$4]==$1){
return $4
}}}}else{
if($2[0].datapath.p==$1){
return 0
}}};return null
}},"_updatefromscrolling",void 0,"allowhilite",function($1){
if(this._updatefromscrolling){
if($1!=null){
this._updatefromscrolling=false
};return false
};return true
}],["tagname","datalistselector","attributes",new LzInheritedHash(LzDataSelectionManager.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({_forcemulti:false,_updatefromscrolling:false,multiselect:false},$lzc$class_datalistselector.attributes)
}}})($lzc$class_datalistselector);Class.make("$lzc$class_baselist",$lzc$class_baseformitem,["itemclassname",void 0,"defaultselection",void 0,"multiselect",void 0,"toggleselected",void 0,"dataoption",void 0,"_hiliteview",void 0,"_contentview",void 0,"_initialselection",void 0,"_selector",void 0,"onselect",void 0,"doEnterDown",function(){
with(this){
if((lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view)&&this._hiliteview.enabled){
this._hiliteview.setAttribute("selected",true)
}}},"doEnterUp",function(){
return
},"init",function(){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this);if(this._contentview==null){
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
}else{
if(this.defaultselection!=null){
selectItemAt(defaultselection)
}}}},"_doFocus",function($1){
with(this){
if(this["_selector"]!=null){
var $2=this._selector.getSelection();if($2&&$2.length>0){
if(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa($2[0]):$2[0] instanceof lz.view){
this._hiliteview=$2[0]
}}}}},"_doblur",function($1){
with(this){
if(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view){
this._hiliteview.setHilite(false)
};this._hiliteview=null
}},"setHilite",function($1){
with(this){
if(this._selector.allowhilite($1)){
if(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view){
this._hiliteview.setHilite(false)
};this._hiliteview=$1;if(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa($1):$1 instanceof lz.view){
$1.setHilite(true)
}}}},"_dokeydown",function($1){
with(this){
if($1==32&&(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view)&&this._hiliteview.enabled){
this._hiliteview.setAttribute("selected",true);return
};if($1>=37&&$1<=40){
this.setAttribute("doesenter",true);var $2=this._hiliteview;if($2==null){
$2=getSelection();if(this.multiselect){
$2=$2[0]
}};var $3;if($1==39||$1==40){
$3=_selector.getNextSubview($2)
};if($1==37||$1==38){
$3=_selector.getNextSubview($2,-1)
};if(this._hiliteview!=0&&(lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view)){
this._hiliteview.setHilite(false)
};$3.setHilite(true);this._hiliteview=$3
}}},"getValue",function(){
with(this){
return _selector.getValue()
}},"getText",function(){
with(this){
if(_initcomplete){
return _selector.getText()
};return null
}},"getSelection",function(){
with(this){
if(this._initcomplete){
var $1=this._selector.getSelection();if(multiselect){
return $1
}else{
if($1.length==0){
return null
}else{
return $1[0]
}}}else{
return this._initialselection
}}},"selectNext",function(){
with(this){
moveSelection(1)
}},"selectPrev",function(){
with(this){
moveSelection(-1)
}},"moveSelection",function($1){
with(this){
if(!$1){
$1=1
};var $2=this._selector.getSelection();var $3;if($2.length==0){
$3=this._contentview.subviews[0]
}else{
var $4=$2[0];$3=this._selector.getNextSubview($4,$1)
};var $5=lz.Focus.getFocus();select($3);if($4&&$5&&$5.childOf($4)){
lz.Focus.setFocus($3)
}}},"getNumItems",function(){
if(this["_selector"]==null){
return 0
};return this._selector.getNumItems()
},"getItemAt",function($1){
with(this){
if(_contentview.subviews[$1]){
return getItem(_contentview.subviews[$1].getValue())
};return null
}},"getItem",function($1){
with(this){
if(_contentview!=null&&_contentview.subviews!=null){
for(var $2=0;$2<_contentview.subviews.length;$2++){
var $3=_contentview.subviews[$2];if($3.getValue()==$1){
return $3
}}};return null
}},"addItem",function($1,$2){
with(this){
switch(arguments.length){
case 1:
$2=null;

};if(this["itemclassname"]&&lz[this.itemclassname]){
new (lz[this.itemclassname])(this,{text:$1,value:$2})
}else{

}}},"removeItem",function($1){
with(this){
var $2=getItem($1);_removeitem($2)
}},"removeItemAt",function($1){
with(this){
var $2=_contentview.subviews[$1];_removeitem($2)
}},"removeAllItems",function(){
with(this){
while(_contentview.subviews.length!=0){
for(var $1=0;$1<_contentview.subviews.length;$1++){
_removeitem(_contentview.subviews[$1])
}}}},"_removeitem",function($1){
if($1){
if($1.selected){
this._selector.unselect($1)
};$1.destroy()
}},"selectItem",function($1){
with(this){
var $2=getItem($1);if($2){
select($2)
}}},"selectItemAt",function($1){
with(this){
if(this._selector!=null){
var $2=this._selector.getItemByIndex($1);select($2)
}}},"clearSelection",function(){
if(this._initcomplete){
this._selector.clearSelection()
}else{
this._initialselection=null;this.defaultselection=null
}},"select",function($1){
with(this){
if($1==null){

}else{
if(this._initcomplete){
this._selector.select($1);if(!this.multiselect){
this.setAttribute("value",$1.getValue())
}}else{
if(multiselect){
if(this._initialselection==null){
this._initialselection=[]
};this._initialselection.push($1)
}else{
this._initialselection=$1
}}};if((lz.view["$lzsc$isa"]?lz.view.$lzsc$isa(this._hiliteview):this._hiliteview instanceof lz.view)&&this._hiliteview["enabled"]){
this._hiliteview.setHilite(false);this._hiliteview=null
};this.setAttribute("doesenter",false);if(this.onselect){
this.onselect.sendEvent($1)
}}}],["tagname","baselist","attributes",new LzInheritedHash($lzc$class_baseformitem.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["onfocus","_doFocus",null,"onblur","_doblur",null,"onkeydown","_dokeydown",null],_contentview:null,_hiliteview:null,_initialselection:null,_selector:null,dataoption:"none",defaultselection:null,itemclassname:"",multiselect:false,onselect:LzDeclaredEvent,toggleselected:false},$lzc$class_baselist.attributes)
}}})($lzc$class_baselist);Class.make("$lzc$class_baselistitem",$lzc$class_basevaluecomponent,["selected",void 0,"$lzc$set_selected",function($1){
this._setSelected($1)
},"onselected",void 0,"onselect",void 0,"_selectonevent",void 0,"$lzc$set__selectonevent",function($1){
this.setSelectOnEvent($1)
},"$lzc$set_datapath",function($1){
with(this){
if(null!=this.datapath){
this.datapath.setXPath($1)
}else{
var $2={xpath:$1};if(this._parentcomponent.dataoption=="lazy"||this._parentcomponent.dataoption=="resize"){
$2.replication=_parentcomponent.dataoption;if(parent["spacing"]){
$2.spacing=parent.spacing
}}else{
if(this._parentcomponent.dataoption=="pooling"){
$2.pooling=true
}};new (lz.datapath)(this,$2)
}}},"_valuedatapath",void 0,"_textdatapath",void 0,"dataBindAttribute",function($1,$2,$3){
with(this){
if(this._parentcomponent.dataoption=="lazy"||this._parentcomponent.dataoption=="resize"){
if($1=="text"){
this._textdatapath=$2
}else{
if($1=="value"){
this._valuedatapath=$2
}}};(arguments.callee.superclass?arguments.callee.superclass.prototype["dataBindAttribute"]:this.nextMethod(arguments.callee,"dataBindAttribute")).call(this,$1,$2,$3)
}},"setSelectOnEvent",function($1){
with(this){
this._selectDL=new LzDelegate(this,"doClick",this,$1)
}},"doClick",function($1){
if(this._parentcomponent){
this._parentcomponent.select(this)
}},"_doMousedown",function($1){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["_doMousedown"]:this.nextMethod(arguments.callee,"_doMousedown")).call(this,$1);if(!this.focusable&&this._parentcomponent&&this._parentcomponent.focusable){
lz.Focus.setFocus(this._parentcomponent,false)
}}},"setSelected",function($1){
this.selected=$1;if(this.onselect){
this.onselect.sendEvent(this)
};if(this.onselected){
this.onselected.sendEvent(this)
}},"_setSelected",function($1){
with(this){
if($1){
parent.select(this)
};this.selected=$1
}},"setHilite",function($1){

}],["tagname","baselistitem","attributes",new LzInheritedHash($lzc$class_basevaluecomponent.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({_selectonevent:"onclick",_textdatapath:null,_valuedatapath:null,clickable:true,focusable:false,onselect:LzDeclaredEvent,onselected:LzDeclaredEvent,selected:false},$lzc$class_baselistitem.attributes)
}}})($lzc$class_baselistitem);Class.make("$lzc$class_simplelayout",LzLayout,["axis",void 0,"$lzc$set_axis",function($1){
this.setAxis($1)
},"inset",void 0,"$lzc$set_inset",function($1){
this.inset=$1;if(this.subviews&&this.subviews.length){
this.update()
};if(this["oninset"]){
this.oninset.sendEvent(this.inset)
}},"spacing",void 0,"$lzc$set_spacing",function($1){
this.spacing=$1;if(this.subviews&&this.subviews.length){
this.update()
};if(this["onspacing"]){
this.onspacing.sendEvent(this.spacing)
}},"setAxis",function($1){
if(this["axis"]==null||this.axis!=$1){
this.axis=$1;this.sizeAxis=$1=="x"?"width":"height";if(this.subviews.length){
this.update()
};if(this["onaxis"]){
this.onaxis.sendEvent(this.axis)
}}},"addSubview",function($1){
with(this){
this.updateDelegate.register($1,"on"+this.sizeAxis);this.updateDelegate.register($1,"onvisible");if(!this.locked){
var $2=null;var $3=this.subviews;for(var $4=$3.length-1;$4>=0;--$4){
if($3[$4].visible){
$2=$3[$4];break
}};if($2){
var $5=$2[this.axis]+$2[this.sizeAxis]+this.spacing
}else{
var $5=this.inset
};$1.setAttribute(this.axis,$5)
};(arguments.callee.superclass?arguments.callee.superclass.prototype["addSubview"]:this.nextMethod(arguments.callee,"addSubview")).call(this,$1)
}},"update",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(this.locked){
return
};var $2=this.subviews.length;var $3=this.inset;for(var $4=0;$4<$2;$4++){
var $5=this.subviews[$4];if(!$5.visible){
continue
};if($5[this.axis]!=$3){
$5.setAttribute(this.axis,$3)
};$3+=this.spacing+$5[this.sizeAxis]
}}],["tagname","simplelayout","attributes",new LzInheritedHash(LzLayout.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({axis:"y",inset:0,spacing:0},$lzc$class_simplelayout.attributes)
}}})($lzc$class_simplelayout);LzResourceLibrary.lzradio_rsrc={ptype:"sr",frames:["lps/components/lz/resources/radio/autoPng/radiobtn_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_mo.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_dn.png"],width:14,height:14,sprite:"lps/components/lz/resources/radio/autoPng/radiobtn_up.sprite.png"};Class.make("$lzc$class_radiogroup",$lzc$class_baselist,["$lzc$set_value",function($1){
with(this){
_setvalue($1)
}},"acceptValue",function($1,$2){
switch(arguments.length){
case 1:
$2=null;

};if($2==null){
$2=this.type
};var $3=this.acceptTypeValue($2,$1);this._setvalue($3);var $4=null;if($3!=null){
$4=this.getItem($3)
};if($4){
this.select($4)
}else{
this.clearSelection()
}},"_setvalue",function($1){
if($1==this.value){
return
};if(this._initcomplete){
var $2=null;if($1!=null){
$2=this.getItem($1)
};this.value=$1
}else{
this.value=$1
};if(this.onvalue){
this.onvalue.sendEvent($1)
}}],["tagname","radiogroup","attributes",new LzInheritedHash($lzc$class_baselist.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({defaultselection:0,itemclassname:"radiobutton",layout:{axis:"y","class":"simplelayout",spacing:5},onvalue:LzDeclaredEvent,value:null},$lzc$class_radiogroup.attributes)
}}})($lzc$class_radiogroup);Class.make("$lzc$class_$m150",$lzc$class_multistatebutton,["$m143",function($1){
with(this){
this.setAttribute("statenum",parent.selected?1:0)
}},"$m144",function(){
with(this){
return [parent,"selected"]
}},"$m145",function($1){
with(this){
this.setAttribute("reference",parent)
}},"$classrootdepth",void 0],["tagname","multistatebutton","attributes",new LzInheritedHash($lzc$class_multistatebutton.attributes)]);Class.make("$lzc$class_$m151",LzText,["$m146",function($1){
with(this){
this.setAttribute("y",classroot.text_y)
}},"$m147",function(){
with(this){
return [classroot,"text_y"]
}},"$m148",function($1){
with(this){
this.setAttribute("text",parent.text)
}},"$m149",function(){
with(this){
return [parent,"text"]
}},"$classrootdepth",void 0],["tagname","text","attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_radiobutton",$lzc$class_baselistitem,["$m141",function($1){
this.setAttribute("text_y",this.rb.height/2-this._title.height/2)
},"$m142",function(){
return [this.rb,"height",this._title,"height"]
},"text_y",void 0,"initcomplete",void 0,"rb",void 0,"_applystyle",function($1){
with(this){
if(this.style!=null){
if(_enabled){
_title.setAttribute("fgcolor",this.style.textcolor)
}else{
_title.setAttribute("fgcolor",this.style.textdisabledcolor)
};setTint(this.rb,$1.basecolor)
}}},"_showEnabled",function(){
with(this){
if(this.style!=null){
if(_enabled){
_title.setAttribute("fgcolor",style.textcolor)
}else{
_title.setAttribute("fgcolor",style.textdisabledcolor)
}}}},"setHilite",function($1){
with(this){
_title.setAttribute("fgcolor",$1?style.texthilitecolor:style.textcolor)
}},"_title",void 0],["tagname","radiobutton","children",LzNode.mergeChildren([{attrs:{$classrootdepth:1,maxstate:1,name:"rb",reference:new LzOnceExpr("$m145"),resource:"lzradio_rsrc",statelength:4,statenum:new LzAlwaysExpr("$m143","$m144"),text:""},"class":$lzc$class_$m150},{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$m148","$m149"),x:17,y:new LzAlwaysExpr("$m146","$m147")},"class":$lzc$class_$m151}],$lzc$class_baselistitem["children"]),"attributes",new LzInheritedHash($lzc$class_baselistitem.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({clickable:true,focusable:false,initcomplete:0,text_y:new LzAlwaysExpr("$m141","$m142")},$lzc$class_radiobutton.attributes)
}}})($lzc$class_radiobutton);canvas.LzInstantiateView({"class":lz.script,attrs:{script:function(){
escapeXML=void 0;escapeXML=function($1){
return new XML().createTextNode($1).toString()
}}}},1);appdata=canvas.lzAddLocalData("appdata","<data />",false);appdata==true;canvas.LzInstantiateView({"class":lz.script,attrs:{script:function(){
app_runtime=void 0;app_debug=void 0;app_backtrace=void 0;app_console_debug=void 0;app_floating_window=void 0;app_fullpath=void 0;app_query=void 0;app_opt_url=void 0;app_unopt_url=void 0;app_url=void 0;app_opt_exists=void 0;app_lps_root=void 0;app_lzt=void 0;app_uid=void 0;appdata.setInitialData(global.appinfo);app_runtime=appdata.getPointer().xpathQuery("/info/@runtime");if(app_runtime==null){
app_runtime=appdata.getPointer().xpathQuery("/request/param[@name = 'lzr']/@value")
};app_debug=appdata.getPointer().xpathQuery("/request/param[@name = 'debug']/@value");app_backtrace=appdata.getPointer().xpathQuery("/request/param[@name = 'lzbacktrace']/@value");if(app_debug=="y"){
app_debug="true"
};app_console_debug=appdata.getPointer().xpathQuery("/request/@console-remote-debug")=="true";app_floating_window=appdata.getPointer().xpathQuery("/request/@console-floating-window")=="true";app_fullpath=appdata.getPointer().xpathQuery("/request/@fullpath");app_query=appdata.getPointer().xpathQuery("/request/@query_args");app_opt_url=appdata.getPointer().xpathQuery("/request/@opt-url");app_unopt_url=appdata.getPointer().xpathQuery("/request/@unopt-url");app_url=appdata.getPointer().xpathQuery("/request/@url");app_opt_exists=appdata.getPointer().xpathQuery("/request/@opt-exists");app_lps_root=appdata.getPointer().xpathQuery("/request/@lps");app_lzt=null;app_uid=typeof global.lzappuid!="undefined"?global.lzappuid:"";app_uid="XXX"
}}},1);LzResourceLibrary.footer_logo={ptype:"sr",frames:["lps/assets/logo_laszlo_footer.gif"],width:70,height:70};Class.make("$lzc$class_$m204",LzView,["$m154",function($1){
with(this){
this.setAttribute("height",app_console_debug?370:71)
}},"$m155",function(){
return [this,"app_console_debug"]
}],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m206",LzView,["$m158",function($1){
with(this){
this.setAttribute("width",parent.width-2)
}},"$m159",function(){
with(this){
return [parent,"width"]
}}],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m205",LzView,["$m156",function($1){
with(this){
this.setAttribute("width",parent.compilecontrols.width+5)
}},"$m157",function(){
with(this){
return [parent.compilecontrols,"width"]
}}],["tagname","view","children",LzNode.mergeChildren([{attrs:{bgcolor:LzColorUtils.convertColor("0x7a7a8c"),height:30,width:new LzAlwaysExpr("$m158","$m159"),x:1,y:1},"class":$lzc$class_$m206}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m207",$lzc$class_radiobutton,["$m160",function($1){
with(this){
this.setAttribute("selected",app_runtime=="swf8")
}},"$m161",function(){
return [this,"app_runtime"]
}],["tagname","radiobutton","children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);Class.make("$lzc$class_$m208",$lzc$class_radiobutton,["$m162",function($1){
with(this){
this.setAttribute("selected",app_runtime=="dhtml")
}},"$m163",function(){
return [this,"app_runtime"]
}],["tagname","radiobutton","children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);Class.make("$lzc$class_$m209",$lzc$class_radiobutton,["$m164",function($1){
with(this){
this.setAttribute("selected",app_runtime=="swf9")
}},"$m165",function(){
return [this,"app_runtime"]
}],["tagname","radiobutton","children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);Class.make("$lzc$class_$m210",$lzc$class_radiobutton,["$m166",function($1){
with(this){
this.setAttribute("selected",app_runtime=="swf10")
}},"$m167",function(){
return [this,"app_runtime"]
}],["tagname","radiobutton","children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);Class.make("$lzc$class_$m212",$lzc$class_checkbox,["$m169",function($1){
with(this){
this.setAttribute("value",app_debug=="true")
}},"$m170",function(){
return [this,"app_debug"]
}],["tagname","checkbox","children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);Class.make("$lzc$class_$m213",$lzc$class_checkbox,["$m171",function($1){
with(this){
this.setAttribute("value",app_backtrace=="true")
}},"$m172",function(){
return [this,"app_backtrace"]
}],["tagname","checkbox","children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);Class.make("$lzc$class_$m214",$lzc$class_button,["$m174",function($1){
with(this){
canvas.gotoApp()
}}],["tagname","button","children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);Class.make("$lzc$class_$m211",LzView,["$m168",function($1){
with(this){
this.setAttribute("x",rg_runtime.x+rg_runtime.width+14)
}},"$m176",function(){
with(this){
var $1=cb_backtrace;return $1
}},"$m177",function($1){
with(this){
if(cb_backtrace.value){
cb_debug.setAttribute("value",true)
}}},"$m179",function(){
with(this){
var $1=cb_debug;return $1
}},"$m180",function($1){
with(this){
if(cb_debug.value==false){
cb_backtrace.setAttribute("value",false)
}}}],["tagname","view","children",LzNode.mergeChildren([{attrs:{bgcolor:LzColorUtils.convertColor("0x0"),height:14,width:1,y:9},"class":LzView},{attrs:{$lzc$bind_id:function($1,$2){
switch(arguments.length){
case 1:
$2=true;

};if($2){
$1.id="cb_debug";cb_debug=$1
}else{
if(cb_debug===$1){
cb_debug=null;$1.id=null
}}},id:"cb_debug",text:"Debug",value:new LzAlwaysExpr("$m169","$m170"),x:16,y:8},"class":$lzc$class_$m212},{attrs:{$lzc$bind_id:function($1,$2){
switch(arguments.length){
case 1:
$2=true;

};if($2){
$1.id="cb_backtrace";cb_backtrace=$1
}else{
if(cb_backtrace===$1){
cb_backtrace=null;$1.id=null
}}},id:"cb_backtrace",text:"Backtrace",value:new LzAlwaysExpr("$m171","$m172"),x:82,y:8},"class":$lzc$class_$m213},{attrs:{$delegates:["onclick","$m174",null],clickable:true,text:"Compile",x:168,y:3},"class":$lzc$class_$m214}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m216",$lzc$class_button,["$m184",function($1){
with(this){
canvas.viewSource()
}}],["tagname","button","children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);Class.make("$lzc$class_$m215",LzView,["$m181",function($1){
with(this){
this.setAttribute("x",parent.compilecontrols.width+parent.compilecontrols.x+32)
}},"$m182",function(){
with(this){
return [parent.compilecontrols,"width",parent.compilecontrols,"x"]
}}],["tagname","view","children",LzNode.mergeChildren([{attrs:{$delegates:["onclick","$m184",null],clickable:true,text:"View Source",y:3},"class":$lzc$class_$m216}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m217",LzView,["$m185",function($1){
with(this){
this.setAttribute("width",canvas.width-70)
}},"$m186",function(){
with(this){
return [canvas,"width"]
}}],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m219",$lzc$class_button,["$m190",function($1){
with(this){
canvas.viewWrapper()
}}],["tagname","button","children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);Class.make("$lzc$class_$m220",$lzc$class_button,["$m192",function($1){
with(this){
canvas.deploySOLO()
}}],["tagname","button","children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);Class.make("$lzc$class_$m221",LzText,["$m194",function($1){
with(this){
canvas.viewDocs()
}}],["tagname","text","attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_$m222",LzText,["$m196",function($1){
with(this){
canvas.viewDev()
}}],["tagname","text","attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_$m223",LzText,["$m198",function($1){
with(this){
canvas.viewForums()
}}],["tagname","text","attributes",new LzInheritedHash(LzText.attributes)]);Class.make("$lzc$class_$m218",LzView,["$m187",function($1){
with(this){
this.setAttribute("width",parent.firstrow.width)
}},"$m188",function(){
with(this){
return [parent.firstrow,"width"]
}}],["tagname","view","children",LzNode.mergeChildren([{attrs:{fontsize:11,text:"<b>Deploy:</b>",x:8,y:4},"class":LzText},{attrs:{$delegates:["onclick","$m190",null],clickable:true,text:"Server",x:65},"class":$lzc$class_$m219},{attrs:{$delegates:["onclick","$m192",null],clickable:true,text:"SOLO",x:134},"class":$lzc$class_$m220},{attrs:{align:"right",fgcolor:LzColorUtils.convertColor("0x15159b"),options:{ignorelayout:true},y:3},children:[{attrs:{$delegates:["onclick","$m194",null],clickable:true,text:"<u>Documentation</u>"},"class":$lzc$class_$m221},{attrs:{$delegates:["onclick","$m196",null],clickable:true,text:"<u>Developer Network</u>",x:92},"class":$lzc$class_$m222},{attrs:{$delegates:["onclick","$m198",null],clickable:true,text:"<u>Developer Forums</u>",x:208},"class":$lzc$class_$m223}],"class":LzView}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_$m224",$lzc$class_checkbox,["$m199",function($1){
with(this){
this.setAttribute("visible",app_runtime!="dhtml")
}},"$m200",function(){
return [this,"app_runtime"]
},"$m201",function($1){
with(this){
this.setAttribute("value",app_console_debug)
}},"$m202",function(){
return [this,"app_console_debug"]
}],["tagname","checkbox","children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);Class.make("$lzc$class_$m203",LzView,["$m152",function($1){
with(this){
this.setAttribute("width",parent.width)
}},"$m153",function(){
with(this){
return [parent,"width"]
}},"logo",void 0,"controls",void 0],["tagname","view","children",LzNode.mergeChildren([{attrs:{bgcolor:LzColorUtils.convertColor("0x4c4c4c"),height:new LzAlwaysExpr("$m154","$m155"),name:"logo",resource:"footer_logo"},"class":$lzc$class_$m204},{attrs:{firstrow:void 0,name:"controls",x:70},children:[{attrs:{compilecontrols:void 0,name:"firstrow",y:4},children:[{attrs:{fontsize:11,text:"<b>Compile Options:</b>",x:8,y:7},"class":LzText},{attrs:{bgcolor:LzColorUtils.convertColor("0x0"),height:32,width:new LzAlwaysExpr("$m156","$m157"),x:125},"class":$lzc$class_$m205},{attrs:{name:"compilecontrols",x:125},children:[{attrs:{$lzc$bind_id:function($1,$2){
switch(arguments.length){
case 1:
$2=true;

};if($2){
$1.id="rg_runtime";rg_runtime=$1
}else{
if(rg_runtime===$1){
rg_runtime=null;$1.id=null
}}},id:"rg_runtime",layout:{axis:"x","class":"simplelayout",spacing:12},x:10,y:9},children:[{attrs:{$lzc$bind_id:function($1,$2){
switch(arguments.length){
case 1:
$2=true;

};if($2){
$1.id="rb8";rb8=$1
}else{
if(rb8===$1){
rb8=null;$1.id=null
}}},id:"rb8",selected:new LzAlwaysExpr("$m160","$m161"),text:"swf8",value:"swf8"},"class":$lzc$class_$m207},{attrs:{$lzc$bind_id:function($1,$2){
switch(arguments.length){
case 1:
$2=true;

};if($2){
$1.id="rbdhtml";rbdhtml=$1
}else{
if(rbdhtml===$1){
rbdhtml=null;$1.id=null
}}},id:"rbdhtml",selected:new LzAlwaysExpr("$m162","$m163"),text:"DHTML",value:"dhtml"},"class":$lzc$class_$m208},{attrs:{$lzc$bind_id:function($1,$2){
switch(arguments.length){
case 1:
$2=true;

};if($2){
$1.id="rb9";rb9=$1
}else{
if(rb9===$1){
rb9=null;$1.id=null
}}},id:"rb9",selected:new LzAlwaysExpr("$m164","$m165"),text:"swf9",value:"swf9"},"class":$lzc$class_$m209},{attrs:{$lzc$bind_id:function($1,$2){
switch(arguments.length){
case 1:
$2=true;

};if($2){
$1.id="rb10";rb10=$1
}else{
if(rb10===$1){
rb10=null;$1.id=null
}}},enabled:true,id:"rb10",selected:new LzAlwaysExpr("$m166","$m167"),text:"swf10",value:"swf10"},"class":$lzc$class_$m210}],"class":$lzc$class_radiogroup},{attrs:{$delegates:["onvalue","$m177","$m176","onvalue","$m180","$m179"],x:new LzOnceExpr("$m168")},"class":$lzc$class_$m211}],"class":LzView},{attrs:{x:new LzAlwaysExpr("$m181","$m182")},"class":$lzc$class_$m215}],"class":LzView},{attrs:{bgcolor:LzColorUtils.convertColor("0x0"),height:1,width:new LzAlwaysExpr("$m185","$m186"),y:39},"class":$lzc$class_$m217},{attrs:{width:new LzAlwaysExpr("$m187","$m188"),y:43},"class":$lzc$class_$m218},{attrs:{$lzc$bind_id:function($1,$2){
switch(arguments.length){
case 1:
$2=true;

};if($2){
$1.id="cb_remotedebug";cb_remotedebug=$1
}else{
if(cb_remotedebug===$1){
cb_remotedebug=null;$1.id=null
}}},id:"cb_remotedebug",text:"Console Remote Debug",value:new LzAlwaysExpr("$m201","$m202"),visible:new LzAlwaysExpr("$m199","$m200"),x:800,y:10},"class":$lzc$class_$m224}],"class":LzView}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);canvas.LzInstantiateView({attrs:{$lzc$bind_name:function($1,$2){
switch(arguments.length){
case 1:
$2=true;

};if($2){
main=$1
}else{
if(main===$1){
main=null
}}},controls:void 0,logo:void 0,name:"main",width:new LzAlwaysExpr("$m152","$m153")},"class":$lzc$class_$m203},84);canvas.LzInstantiateView({"class":lz.script,attrs:{script:function(){
receivingLC=void 0;sendingLC=void 0;canvas.width=document.body.clientWidth
}}},1);lz["basefocusview"]=$lzc$class_basefocusview;lz["focusoverlay"]=$lzc$class_focusoverlay;lz["_componentmanager"]=$lzc$class__componentmanager;lz["style"]=$lzc$class_style;lz["statictext"]=$lzc$class_statictext;lz["basecomponent"]=$lzc$class_basecomponent;lz["basebutton"]=$lzc$class_basebutton;lz["swatchview"]=$lzc$class_swatchview;lz["button"]=$lzc$class_button;lz["basevaluecomponent"]=$lzc$class_basevaluecomponent;lz["baseformitem"]=$lzc$class_baseformitem;lz["multistatebutton"]=$lzc$class_multistatebutton;lz["checkbox"]=$lzc$class_checkbox;lz["listselector"]=$lzc$class_listselector;lz["datalistselector"]=$lzc$class_datalistselector;lz["baselist"]=$lzc$class_baselist;lz["baselistitem"]=$lzc$class_baselistitem;lz["simplelayout"]=$lzc$class_simplelayout;lz["radiogroup"]=$lzc$class_radiogroup;lz["radiobutton"]=$lzc$class_radiobutton;canvas.initDone();