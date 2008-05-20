var $dhtml=true;var $as3=false;var $js1=true;var $swf9=false;var $swf7=false;var $profile=false;var $swf8=false;var $runtime="dhtml";var $svg=false;var $as2=false;var $debug=false;var $j2me=false;var _Copyright="Portions of this file are copyright (c) 2001-2008 by Laszlo Systems, Inc.  All rights reserved.";window._root=window;var $modules={};$modules.runtime=this;$modules.lz=$modules.runtime;$modules.user=$modules.lz;var global=$modules.user;var Instance=function(){
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
var nc=function(){
this.constructor=arguments.callee;if(this.$lzsc$initialize!==Instance.prototype.$lzsc$initialize){
this.$lzsc$initialize.apply(this,arguments)
}};nc.constructor=this;nc.classname=$1;this.addStaticProperty.call(nc,"addStaticProperty",this.addStaticProperty);nc.addStaticProperty("addProperty",this.addProperty);var superclass=null;if($2 instanceof Array){
for(var $5=$2.length-1;$5>=0;$5--){
var $6=$2[$5];if($6 instanceof Function){
$2.splice($5,1);superclass=$6
}}}else{
if($2 instanceof Function){
superclass=$2;$2=null
}else{

}};if(!superclass){
superclass=Instance
};var $7=function(){
this.constructor=superclass
};$7.prototype=superclass.prototype;var $8=new $7();if($2 instanceof Array){
for(var $9=$2.length-1;$9>=0;$9--){
var $10=$2[$9];$8=$10.makeInterstitial($8,$9>0?$2[$9-1]:nc)
}};if($4){
for(var $9=$4.length-1;$9>=1;$9-=2){
var $11=$4[$9];var $12=$4[$9-1];nc.addStaticProperty($12,$11)
}};nc.prototype=$8;if($3){
for(var $9=$3.length-1;$9>=1;$9-=2){
var $11=$3[$9];var $12=$3[$9-1];nc.addProperty($12,$11)
}};(function($1,$2){
if($2!==Instance){
arguments.callee($1,$2.prototype.constructor)
};if($2.hasOwnProperty("initialize")){
$2.initialize.call(nc,$1)
}})($8,nc);this.allClasses[$1]=nc;return nc
}};var Trait={prototype:new Instance(),allTraits:{},_dbg_typename:Class._dbg_name,_dbg_name:"Trait",addProperty:function($1,$2){
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
};this.allTraits[$1]=$5;return $5
}};LzMessage=Class.make("LzMessage",null,["message","","length",0,"$lzsc$initialize",function($1){
if(arguments.length<1){
$1=null
};if($1!=null){
this.appendInternal(""+$1,$1)
}},"appendInternal",function($1,$2){
if(arguments.length<2){
$2=null
};this.message+=$1;this.length=this.message.length
},"append",function($1){
var $2=arguments.length;for(var $3=0;$3<$2;$3++){
this.appendInternal(String(arguments[$3]))
}},"toString",function(){
return this.message
},"toHTML",function(){
return this.toString()
}],null);LzFormatter=Trait.make("LzFormatter",null,["pad",function($1,$2,$3,$4,$5,$6,$7){
if(arguments.length<1){
$1=""
};if(arguments.length<2){
$2=0
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=" "
};if(arguments.length<5){
$5="-"
};if(arguments.length<6){
$6=10
};if(arguments.length<7){
$7=false
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
};if(arguments.length<1){
control=""
};var args=new Array();for(var $1=1;$1<arguments.length;$1++){
args.push(arguments[$1])
};var al=args.length;if(!(typeof control=="string"||control instanceof String)||al>0!=control.indexOf("%")>=0){
args.unshift(control);al++;var $2=new LzMessage();for(var $3=0;$3<al;$3++){
var $4=args[$3];var $5=$3==al-1?"\n":" ";$2.append($4);$2.appendInternal($5)
};return $2
};var $6=""+control;var $7=0;var $9=0,$10=$6.length;var $11=0,$12=0;var $2=new LzMessage();while($11<$10){
$12=$6.indexOf("%");if($12==-1){
$2.append($6.substring($11,$10));break
};$2.append($6.substring($11,$12));$9=$12;$11=$12+1;$12=$12+2;var $13="-";var $14=" ";var $15=false;var $16="";var $17=null;var $18=null;var $19=null;while($11<$10&&$18==null){
var $20=$6.substring($11,$12);$11=$12++;switch($20){
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
$7=$16-1;$16="";break;
case "*":
if($17!==null){
$17=$8($7);$7++
}else{
$16=$8($7);$7++
};break;
case ".":
$17="";break;
case "h":
case "l":
break;
case "=":
$19=$8($7);$7++;break;
default:
$18=$20;break;

}};var $21=$8($7);if($19==null){
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
$2.append("0")
};break;
case "X":
case "x":
if($15&&$21!=0){
$2.append("0"+$18)
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
$21=Number($21);$2.appendInternal(this.pad($21,$16,$22,$14,$13,$24,$23).toUpperCase(),$19);$7++;break;
case "c":
$21=String.fromCharCode($21);
case "w":

case "s":
var $28;if($21 instanceof Function){
if(!$28){
$28="function () {...}"
}}else{
if(typeof $21=="number"){
$28=Number($21).toString($24)
}else{
$28=""+$21
}};$2.appendInternal(this.pad($28,$16,$22,$14,$13,$24,$23),$19);$7++;break;
case "d":
case "u":
case "i":
case "o":
case "x":
case "f":
case "e":
case "g":
$21=Number($21);$2.appendInternal(this.pad($21,$16,$22,$14,$13,$24,$23),$19);$7++;break;
case "%":
$2.append("%");break;
default:
$2.append($6.substring($9,$11));break;

};$6=$6.substring($11,$10);$9=0,$10=$6.length;$11=0,$12=0
};if($7<al){
$2.appendInternal(" ");for(;$7<al;$7++){
var $4=$8($7);var $5=$7==al-1?"\n":" ";$2.append($4);$2.appendInternal($5)
}};return $2
}],null);Debug={};Debug.write=function($1){

};Debug.trace=function($1){

};Debug.monitor=function($1){

};Debug.warn=function($1){

};Debug.error=function($1){

};Debug.info=function($1){

};Debug.debug=function($1){

};trace=function(){
console.info.apply(console,arguments)
};var black=0;var green=32768;var silver=12632256;var lime=65280;var gray=8421504;var olive=8421376;var white=16777215;var yellow=16776960;var maroon=8388608;var navy=128;var red=16711680;var blue=255;var purple=8388736;var teal=32896;var fuchsia=16711935;var aqua=65535;LzDeclaredEventClass=Class.make("LzDeclaredEventClass",null,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"ready",false,"sendEvent",function($1){
if(arguments.length<1){
$1=null
}},"clearDelegates",function(){

},"removeDelegate",function($1){
if(arguments.length<1){
$1=null
}},"getDelegateCount",function(){
return 0
},"toString",function(){
return "LzDeclaredEvent"
}],null);(function(){
with(LzDeclaredEventClass){
with(LzDeclaredEventClass.prototype){

}}})();var LzDeclaredEvent=new LzDeclaredEventClass();LzValueExpr=Class.make("LzValueExpr",null,null,null);LzInitExpr=Class.make("LzInitExpr",LzValueExpr,null,null);LzOnceExpr=Class.make("LzOnceExpr",LzInitExpr,["methodName",void 0,"$lzsc$initialize",function($1){
this.methodName=$1
}],null);LzConstraintExpr=Class.make("LzConstraintExpr",LzOnceExpr,["$lzsc$initialize",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1)
}],null);LzAlwaysExpr=Class.make("LzAlwaysExpr",LzConstraintExpr,["dependenciesName",void 0,"$lzsc$initialize",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1);this.dependenciesName=$2
}],null);LzStyleExpr=Class.make("LzStyleExpr",LzValueExpr,["sourceAttributeName",void 0,"$lzsc$initialize",function($1){
this.sourceAttributeName=$1
}],null);LzStyleAttr=Class.make("LzStyleAttr",LzStyleExpr,["$lzsc$initialize",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1)
}],null);LzStyleAttrBinder=Class.make("LzStyleAttrBinder",null,["target",void 0,"dest",void 0,"source",void 0,"$lzsc$initialize",function($1,$2,$3){
this.target=$1;this.dest=$2;this.source=$3
},"bind",function(){
var $1=this.target;$1.setAttribute(this.dest,$1[this.source])
}],null);LzStyleIdent=Class.make("LzStyleIdent",LzStyleExpr,["$lzsc$initialize",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1)
}],null);function LzInheritedHash($1){
if($1){
for(var $2 in $1){
this[$2]=$1[$2]
}}};var ConstructorMap={};var lz=ConstructorMap;LzEventable=Class.make("LzEventable",null,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
}},"__LZdeleted",false,"_events",null,"ondestroy",LzDeclaredEvent,"destroy",function(){
if(this.ondestroy.ready){
this.ondestroy.sendEvent(this)
};this.__LZdeleted=true;if(this._events!=null){
for(var $1=this._events.length-1;$1>=0;$1--){
this._events[$1].clearDelegates()
}};this._events=null
},"__LZdeferDelegates",false,"childOf",function($1,$2){
if(arguments.length<2){
$2=null
};return false
},"setAttribute",function($1,$2,$3){
if(arguments.length<3){
$3=null
};if(this.__LZdeleted||$3&&this[$1]==$2){
return
};var $4="$lzc$set_"+$1;if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$4]):this[$4] instanceof Function){
this[$4]($2)
}else{
this[$1]=$2;var $5="on"+$1;if(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa(this[$5]):this[$5] instanceof LzEvent){
if(this[$5].ready){
this[$5].sendEvent($2)
}}}},"__LZupdateShown",function(){

}],null);LzNode=Class.make("LzNode",LzEventable,["__LZisnew",false,"__LZstyleConstraints",null,"__LZdeferredcarr",null,"data",null,"classChildren",null,"__LZvizDat",true,"animators",null,"_instanceAttrs",null,"_instanceChildren",null,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.__LZUID="__U"+ ++LzNode.__UIDs;this.__LZdeferDelegates=true;var $5=LzDelegate.__LZdelegatesQueue.length;if($2){
if($2["$lzc$bind_id"]){
this.$lzc$bind_id=$2.$lzc$bind_id;delete $2.$lzc$bind_id
};if($2["$lzc$bind_name"]){
this.$lzc$bind_name=$2.$lzc$bind_name;delete $2.$lzc$bind_name
}};var $6=this.$lzc$bind_id;if($6){
$6.call(null,this)
};var $7=this.$lzc$bind_name;if($7){
$7.call(null,this)
};this.__LZUID="__U"+ ++LzNode.__UIDs;this.__LZdeferDelegates=true;var $5=LzDelegate.__LZdelegatesQueue.length;this._instanceAttrs=$2;this._instanceChildren=$3;var $9=new LzInheritedHash(this["constructor"].attributes);if(!(function($1,$2){
return $2["$lzsc$isa"]?$2.$lzsc$isa($1):$1 instanceof $2
})(this,LzState)){
for(var $10 in $9){
var $11=$9[$10];if(!(LzInitExpr["$lzsc$isa"]?LzInitExpr.$lzsc$isa($11):$11 instanceof LzInitExpr)){
var $12="$lzc$set_"+$10;if(!this[$12]){
this.addProperty($10,$11);delete $9[$10]
}else{
if(this[$10]===void 0){
this.addProperty($10,null)
}}}}};if($2){
LzNode.mergeAttributes($2,$9)
};var $13=new LzInheritedHash($9);this.__LZisnew=!$4;var $14=this["constructor"]["children"];if(Array["$lzsc$isa"]?Array.$lzsc$isa($14):$14 instanceof Array){
$3=LzNode.mergeChildren($3,$14)
};if($13["datapath"]!=null){
delete $13["$datapath"]
};this.construct($1,$13);if(this.__LZdeleted){
return
};this.__LZapplyArgs($13,true);if(this.__LZdeleted){
return
};this.constructWithArgs($13);this.__LZdeferDelegates=null;if($5!=LzDelegate.__LZdelegatesQueue.length){
LzDelegate.__LZdrainDelegatesQueue($5)
};if(this.onconstruct.ready){
this.onconstruct.sendEvent(this)
};if($3&&$3.length){
this.createChildren($3)
}else{
this.__LZinstantiationDone()
}},"constructWithArgs",function($1){

},"oninit",LzDeclaredEvent,"onconstruct",LzDeclaredEvent,"ondata",LzDeclaredEvent,"clonenumber",null,"onclonenumber",LzDeclaredEvent,"__LZlateinit",null,"__LZpreventSubInit",null,"__LZresolveDict",null,"__LZsourceLocation",null,"__LZUID",null,"__LZPropertyCache",null,"__LZRuleCache",null,"__LZdelegates",null,"isinited",false,"subnodes",null,"datapath",null,"initstage",null,"$isstate",false,"doneClassRoot",false,"parent",void 0,"cloneManager",null,"name",null,"$lzc$bind_name",null,"id",null,"$lzc$set_id",-1,"$lzc$bind_id",null,"defaultplacement",null,"placement",null,"$lzc$set_placement",-1,"$cfn",0,"immediateparent",null,"dependencies",null,"classroot",void 0,"nodeLevel",0,"__LZstyleBindAttribute",function($1,$2){
var $3=LzCSSStyle.getPropertyValueFor(this,$2);if(typeof $3=="string"&&$3.length>2&&$3.indexOf("0x")==0&&!isNaN($3)){
$3=Number($3)
};if($3 instanceof LzStyleExpr){
var $4=$3.sourceAttributeName;if($3 instanceof LzStyleAttr){
var $5=new LzStyleAttrBinder(this,$1,$4);if(!this.__LZdelegates){
this.__LZdelegates=[]
};this.__LZdelegates.push(new LzDelegate($5,"bind",this,"on"+$4));$5.bind()
}else{
if($3 instanceof LzStyleIdent){
this.setAttribute($1,global[$4])
}else{

}}}else{
this.setAttribute($1,$3)
}},"construct",function($1,$2){
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
if(!this.immediateparent||this.immediateparent.isinited||this.initstage=="early"||this.__LZisnew&&LzInstantiator.syncNew){
this.__LZcallInit()
}},"__LZsetPreventInit",function(){
this.__LZpreventSubInit=[]
},"__LZclearPreventInit",function(){
var $1=this.__LZpreventSubInit;this.__LZpreventSubInit=null;var $2=$1.length;for(var $3=0;$3<$2;$3++){
$1[$3].__LZcallInit()
}},"__LZcallInit",function($1){
if(arguments.length<1){
$1=null
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
}},"completeInstantiation",function(){
if(!this.isinited){
var $1=this.initstage;this.initstage="early";if($1=="defer"){
LzInstantiator.createImmediate(this,this.__LZdeferredcarr)
}else{
LzInstantiator.completeTrickle(this)
}}},"ignoreplacement",false,"__LZapplyArgs",function($1,$2){
if(arguments.length<2){
$2=null
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
var $8=$5[$12];var $10="$lzc$set_"+$8;this[$10]($1[$8])
}}};if($4){
for(var $12=$4.length-1;$12>=0;$12--){
var $8=$4[$12];var $10="$lzc$set_"+$8;this[$10]($1[$8])
}};this.__LZstoreAttr($6,"$inits");this.__LZstoreAttr($7,"$constraints")
},"createChildren",function($1){
if(this.__LZdeleted){
return
};if("defer"==this.initstage){
this.__LZlateinit=true;this.__LZdeferredcarr=$1
}else{
if("late"==this.initstage){
this.__LZlateinit=true;LzInstantiator.trickleInstantiate(this,$1)
}else{
if(this.__LZisnew&&LzInstantiator.syncNew||"immediate"==this.initstage){
LzInstantiator.createImmediate(this,$1)
}else{
LzInstantiator.requestInstantiation(this,$1)
}}}},"getAttribute",function($1){
Debug.info("%w.%s(%#w) is deprecated.  Use %w[%#w] instead.",this,arguments.callee,$1,this,$1);return this[$1]
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
if(this.__LZdeleted){
return
};var $4=ConstructorMap[$1.name];var $5;if($4){
$5=new $4(this,$1.attrs,("children" in $1)?$1.children:null,$2)
};return $5
},"$lzc$set_$setters",-1,"$lzc$set_$classrootdepth",function($1){
if(!$1){
return
};var $2=this.parent;while(--$1>0){
$2=$2.parent
};this.classroot=$2
},"dataBindAttribute",function($1,$2){
if(!this.datapath){
this.setDatapath(".")
};if(!this.__LZdelegates){
this.__LZdelegates=[]
};this.__LZdelegates.push(new LzDataAttrBind(this.datapath,$1,$2))
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
this[$2[$3].methodName]()
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
var $5=$3[$4];if($5.c===this&&$5.m===this[$1]){
$5.unregisterAll();$3.splice($4,1);$2=true
}else{
$4++
}}};return $2
},"$lzc$set_name",function($1){
if(typeof $1=="string"&&$1.length){
if(this.parent){
this.parent[$1]=this
};if(this.immediateparent){
this.immediateparent[$1]=this
};this.name=$1;if(this.parent===canvas){
if(!this.hasOwnProperty("id")){
this.id=$1
};global[$1]=this
}}else{

}},"defaultSet",function($1,$2){
if($1!=null){
this[$2]=$1
}},"setDatapath",function($1){
if(null!=this.datapath&&$1!=LzNode._ignoreAttribute){
this.datapath.setXPath($1)
}else{
new LzDatapath(this,{xpath:$1})
}},"$lzc$set_datapath",function($1){
this.setDatapath($1)
},"setData",function($1,$2){
if(arguments.length<2){
$2=null
};this.data=$1;var $3=this.datapath!=null?this.datapath:new LzDatapath(this);$3.setPointer($1);if(this.ondata.ready){
this.ondata.sendEvent($1)
}},"applyData",function($1){

},"updateData",function(){
return void 0
},"setSelected",function($1){

},"$lzc$set_options",function($1){
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
if(arguments.length<2){
$2=null
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
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this);this.__LZinstantiationDone=null;if(this.subnodes!=null){
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
if(arguments.length<4){
$4=null
};if(arguments.length<5){
$5=null
};if($3==0){
var $6=$4?this[$1]+$2:$2;this.setAttribute($1,$6);return null
};var $7={attribute:$1,to:$2,duration:$3,start:true,relative:$4,target:this};for(var $8 in $5){
$7[$8]=$5[$8]
};var $9=new LzAnimator(null,$7);return $9
},"toString",function(){
return this.getDebugIdentification()
},"getDebugIdentification",function(){
var $1=this["constructor"].tagname+" ";if(this.name!=null){
$1+=" name: "+this.name+" "
};if(this.id!=null){
$1+=" id: "+this.id+" "
};return $1
},"_dbg_name",function(){
if(typeof this.id=="string"&&global[this.id]===this){
return "#"+this.id
}else{
if(typeof this.name=="string"&&this.parent[this.name]===this){
return "."+this.name
}else{
var $1=this.toString();if($1==this.getDebugIdentification()){
return ""
}else{
return $1
}}}},"$lzc$set_$datapath",function($1){
if($1==LzNode._ignoreAttribute){
return
}else{
if(!($1 instanceof Object)){

}};this.makeChild($1,true)
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
},"initialize",function($1){
if(this.hasOwnProperty("tagname")){
var $2=this.tagname;if($2){
if(ConstructorMap[$2]!==this){
ConstructorMap[$2]=this
}}}},"_ignoreAttribute",{toString:function(){
return "_ignoreAttribute"
}},"__LZdelayedSetters",new LzInheritedHash({$refs:"$lzc$set_$refs"}),"earlySetters",new LzInheritedHash({name:1,$events:2,$delegates:3,$classrootdepth:4,$datapath:5}),"__UIDs",0]);(function(){
with(LzNode){
with(LzNode.prototype){
prototype.options={}}}})();ConstructorMap[LzNode.tagname]=LzNode;LzUserClassPlacement=Class.make("LzUserClassPlacement",null,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};$1.defaultplacement=$2
}],null);(function(){
with(LzUserClassPlacement){
with(LzUserClassPlacement.prototype){

}}})();ConstructorMap["__LZUserClassPlacementObject"]=LzUserClassPlacement;LzDelegate=Class.make("LzDelegate",null,["__delegateID",0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);if(LzEventable["$lzsc$isa"]?LzEventable.$lzsc$isa($1):$1 instanceof LzEventable){

}else{

};this.c=$1;var $5=$1[$2];if(Function["$lzsc$isa"]?Function.$lzsc$isa($5):$5 instanceof Function){
this.m=$5
}else{

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
if(!$1){
return
}else{

}};var $3=$1[$2];var m=this.m;if(m&&m.length!=1){

};if(!(LzEvent["$lzsc$isa"]?LzEvent.$lzsc$isa($3):$3 instanceof LzEvent)){
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
var $4=this[$3];if($4==$1){
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
}],["__nextID",1,"__LZdelegatesQueue",[],"__LZdrainDelegatesQueue",function($1){
var $2=LzDelegate.__LZdelegatesQueue;var $3=$2.length;var $4=$1;if($4<$3){
var $5=new Array();var $6=new Array();while($4<$3){
var $7=$2[$4];var $8=$2[$4+1];var $9=$2[$4+2];$7.locked=true;$6.push($7);if(!$8.event_called){
$8.event_called=true;$5.push($8);if($8.c&&!$8.c.__LZdeleted&&$8.m){
$8.m.call($8.c,$9)
}};$4+=3
};while($8=$5.pop()){
$8.event_called=false
};while($7=$6.pop()){
$7.locked=false
}};$2.length=$1
}]);LzEvent=Class.make("LzEvent",LzDeclaredEventClass,["delegateList",null,"$lzsc$initialize",function($1,$2,$3){
if(arguments.length<3){
$3=null
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
if(arguments.length<1){
$1=null
};if(this.locked){
return
};var $2=this.delegateList.length;if($2==0){
return
};this.locked=true;var $4=new Array();var $5;var $6=LzDelegate.__LZdelegatesQueue;for(var $7=$2;$7>=0;$7--){
$5=this.delegateList[$7];if($5&&$5.enabled&&!$5.event_called){
$5.event_called=true;$4.push($5);var $8=$5.c;if($8&&!$8.__LZdeleted){
if($8.__LZdeferDelegates){
$6.push(this,$5,$1)
}else{
if($5.m){
$5.m.call($8,$1)
}}}}};while($5=$4.pop()){
$5.event_called=false
};this.locked=false
},"removeDelegate",function($1){
if(arguments.length<1){
$1=null
};var $2=this.delegateList.length;for(var $3=0;$3<$2;$3++){
if(this.delegateList[$3]===$1){
this.delegateList.splice($3,1);break
}};if(this.delegateList.length==0){
this.ready=false
}},"clearDelegates",function(){
while(this.delegateList.length){
this.delegateList[0].unregisterFrom(this)
};this.ready=false
},"getDelegateCount",function(){
return this.delegateList.length
},"toString",function(){
return "LzEvent"
}],null);var LzIdleKernel={__callbacks:[],addCallback:function($1,$2){
LzIdleKernel.__callbacks.push([$1,$2])
},removeCallback:function($1,$2){
for(var $3=LzIdleKernel.__callbacks.length-1;$3>=0;$3--){
if(LzIdleKernel.__callbacks[$3][0]==$1&&LzIdleKernel.__callbacks[$3][1]==$2){
return LzIdleKernel.__callbacks.splice($3,1)
}}},__update:function(){
for(var $1=LzIdleKernel.__callbacks.length-1;$1>=0;$1--){
var $2=LzIdleKernel.__callbacks[$1][0];$2[LzIdleKernel.__callbacks[$1][1]](LzTimeKernel.getTimer())
}}};setInterval(LzIdleKernel.__update,33);LzLibraryCleanup=Class.make("LzLibraryCleanup",LzNode,["$lzsc$initialize",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2);var $3=LzLibrary.findLibrary($2.libname);$3.loadfinished()
}],["tagname","__libraryloadercomplete","attributes",new LzInheritedHash(LzNode.attributes)]);var LzResourceLibrary={};var getTimer=function(){
return LzTimeKernel.getTimer()
};global=window;var LzPool=function($1,$2,$3,$4){
this.cache={};if(typeof $1=="function"){
this.getter=$1
};if(typeof $2=="function"){
this.cacheHit=$2
};if(typeof $3=="function"){
this.destroyer=$3
};if($4){
this.owner=$4
}};LzPool.prototype.cache=null;LzPool.prototype.get=function($1,$2){
if($2){
return this.getter($1,$3)
}else{
var $3=Array.prototype.slice.apply(arguments,[2]);if(this.cache[$1]==null){
this.cache[$1]=this.getter($1,$3)
}else{
if(this.cacheHit){
this.cacheHit($1,this.cache[$1],$3)
}};if(this.owner){
this.cache[$1].owner=this.owner
};return this.cache[$1]
}};LzPool.prototype.flush=function($1){
if(this.destroyer){
this.destroyer($1,this.cache[$1])
};this.cache[$1]=null
};LzPool.prototype.destroy=function(){
for(var $1 in this.cache){
this.flush($1)
};this.owner=null;this.cache=null
};LzPool.prototype.getter=null;LzPool.prototype.destroyer=null;LzPool.prototype.cacheHit=null;var LzKeyboardKernel={__downKeysHash:{},__keyboardEvent:function($1){
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
this.__scope=$1;this.__callback=$2;this.setKeyboardControl(true)
},setKeyboardControl:function($1){
var $2=null;var $3=Lz&&Lz.options&&Lz.options.cancelkeyboardcontrol!=true||true;if($3&&$1){
$2=LzKeyboardKernel.__keyboardEvent
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
$1=window.event
};var $2="on"+$1.type;var $3=$1.srcElement?$1.srcElement:$1.target;if(window["LzKeyboardKernel"]&&LzKeyboardKernel["__keyboardEvent"]){
LzKeyboardKernel.__keyboardEvent($1)
};if(window["LzInputTextSprite"]){
if(LzSprite.prototype.quirks.fix_ie_clickable){
LzInputTextSprite.prototype.__hideIfNotFocused($2,$3)
}else{
if($2!="onmousemove"&&LzInputTextSprite.prototype.__lastshown!=null){
LzInputTextSprite.prototype.__hideIfNotFocused()
}}};if($2=="onmousemove"){
if($1.pageX||$1.pageY){
LzMouseKernel.__x=$1.pageX;LzMouseKernel.__y=$1.pageY
}else{
if($1.clientX||$1.clientY){
LzMouseKernel.__x=$1.clientX;LzMouseKernel.__y=$1.clientY
}}};if($1.button==2&&$2!="oncontextmenu"){
return
};if($2=="oncontextmenu"){
if($3&&$3.owner&&$3.owner.__contextmenu){
$3.owner.__contextmenu.kernel.__show();return $3.owner.__contextmenu.kernel.showbuiltins
}else{
if(LzMouseKernel.__defaultcontextmenu){
LzMouseKernel.__defaultcontextmenu.kernel.__show();return LzMouseKernel.__defaultcontextmenu.kernel.showbuiltins
}}}else{
LzMouseKernel.__sendEvent($2)
}},__sendEvent:function($1,$2){
if(LzMouseKernel.__callback){
LzMouseKernel.__scope[LzMouseKernel.__callback]($1,$2)
}},__callback:null,__scope:null,__mouseupEvent:function($1){
if(LzMouseKernel.__lastMouseDown!=null){
LzMouseKernel.__lastMouseDown.__globalmouseup($1);LzMouseKernel.__lastMouseDown=null
}else{
LzMouseKernel.__mouseEvent($1)
}},setCallback:function($1,$2){
this.__scope=$1;this.__callback=$2;Lz.attachEventHandler(document,"mousemove",LzMouseKernel,"__mouseEvent");Lz.attachEventHandler(document,"mousedown",LzMouseKernel,"__mouseEvent");Lz.attachEventHandler(document,"mouseup",LzMouseKernel,"__mouseupEvent");document.oncontextmenu=LzMouseKernel.__mouseEvent
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
}};LzBrowserKernel=Class.make("LzBrowserKernel",null,null,["loadURL",function($1,$2,$3){
if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if($2!=null){
window.open($1,$2,$3)
}else{
window.location=$1
}},"loadJS",function($1,$2){
LzBrowserKernel.loadURL("javascript:"+$1+";void(0);",$2)
},"callJS",function($1,$2){
var $3=eval($1);var $4=[].slice.call(arguments,2);if($3){
var $5=$3.apply(null,$4)
};if($2&&typeof $2=="function"){
$2($5)
};return $5
},"setHistory",function($1){
Lz.history.set($1)
},"callMethod",function($1){
return eval($1)
},"getVersion",function(){
return navigator.userAgent
},"getLoadURL",function(){
var $1=Lz.__propcache.url;if(!$1){
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
},"showMenu",function($1){
Debug.warn("showMenu not implemented")
},"setClipboard",function($1){
Debug.warn("setClipboard not implemented")
},"isAAActive",function(){
Debug.warn("isAAActive not implemented");return false
},"updateAccessibility",function(){
Debug.warn("updateAccessibility not implemented")
}]);var LzSprite=function($1,$2){
if($1==null){
return
};if($2){
this.isroot=true;LzSprite.__rootSprite=this;var div=document.createElement("div");div.className="lzcanvasdiv";var $3=Lz.__propcache;var $4=$3.appenddiv;if($3.bgcolor){
div.style.backgroundColor=$3.bgcolor;this.bgcolor=$3.bgcolor
};if($3.width){
$4.style.width=$3.width;div.style.width=$3.width;var $5=$3.width.indexOf("%")!=-1?$3.width:parseInt($3.width);this._w=$5;this.width=$5
};if($3.height){
$4.style.height=$3.height;div.style.height=$3.height;var $6=$3.height.indexOf("%")!=-1?$3.height:parseInt($3.height);this._h=$6;this.height=$6
};if($3.id){
this._id=$3.id
};if($3.cancelkeyboardcontrol){
Lz.options.cancelkeyboardcontrol=$3.cancelkeyboardcontrol
};if($3.resourceroot){
Lz.options.resourceroot=$3.resourceroot
};if(this.quirks.canvas_div_cannot_be_clipped==false&&$3.width&&$3.width.indexOf("%")==-1&&$3.height&&$3.height.indexOf("%")==-1){
div.style.clip="rect(0px "+this._w+" "+this._h+" 0px)";div.style.overflow="hidden"
};$4.appendChild(div);this.__LZdiv=div;if(this.quirks.fix_clickable){
var $7=document.createElement("div");$7.className="lzcanvasclickdiv";$4.appendChild($7);this.__LZclickdiv=$7
};div.mouseisover=false;div.onmouseover=function($1){
this.mouseisover=true;div.focus();LzKeyboardKernel.setKeyboardControl(true)
};div.onmouseout=function($1){
if(!$1){
$1=window.event
};if($1.relatedTarget&&$1.relatedTarget.owner&&$1.relatedTarget.className.indexOf("lz")==0){
this.focus();LzKeyboardKernel.setKeyboardControl(true);this.mouseisover=true
}else{
this.blur();this.mouseisover=false;LzKeyboardKernel.setKeyboardControl(false)
}}}else{
this.__LZdiv=document.createElement("div");this.__LZdiv.className="lzdiv";if(this.quirks.fix_clickable){
this.__LZclickdiv=document.createElement("div");this.__LZclickdiv.className="lzdiv"
}};this.__LZdiv.owner=this;if(this.quirks.fix_clickable){
this.__LZclickdiv.owner=this
};this.owner=$1;this.uid=LzSprite.prototype.uid++;if(this.quirks.ie_leak_prevention){
this.__sprites[this.uid]=this
}};LzSprite.prototype.__defaultStyles={lzdiv:{position:"absolute"},lzclickdiv:{position:"absolute"},lzinputclickdiv:{position:"absolute"},lzcanvasdiv:{position:"absolute"},lzcanvasclickdiv:{zIndex:100000,position:"absolute"},lztext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",whiteSpace:"normal",position:"absolute"},lzswftext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",whiteSpace:"normal",position:"absolute",paddingTop:"2px",paddingLeft:"2px"},lzinputtext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",width:"100%",height:"100%",borderWidth:0,backgroundColor:"transparent"},lzswfinputtext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",width:"100%",height:"100%",borderWidth:0,backgroundColor:"transparent",marginTop:"1px",marginLeft:"2px"},lzswfinputtextmultiline:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",width:"100%",height:"100%",borderWidth:0,backgroundColor:"transparent",marginTop:"2px",marginLeft:"2px"},writeCSS:function(){
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
}};LzSprite.prototype.__defaultStyles["#lzcontextmenu a"]={color:"#000",display:"block",textDecoration:"none"};LzSprite.prototype.__defaultStyles["#lzcontextmenu a:hover"]={color:"#FFF",backgroundColor:"#333"};LzSprite.prototype.__defaultStyles["#lzcontextmenu"]={position:"absolute",zIndex:10000000,backgroundColor:"#CCC",border:"1px outset #999",padding:"4px",fontFamily:"Verdana,Vera,sans-serif",fontSize:"13px",margin:"2px",color:"#999"};LzSprite.prototype.uid=0;LzSprite.prototype.quirks={fix_clickable:true,fix_ie_background_height:false,fix_ie_clickable:false,ie_alpha_image_loader:false,ie_leak_prevention:false,invisible_parent_image_sizing_fix:false,emulate_flash_font_metrics:true,inner_html_strips_newlines:true,inner_html_no_entity_apos:false,css_hide_canvas_during_init:true,firefox_autocomplete_bug:false,hand_pointer_for_clickable:true,alt_key_sends_control:false,safari_textarea_subtract_scrollbar_height:false,safari_avoid_clip_position_input_text:false,no_cursor_colresize:false,safari_visibility_instead_of_display:false,preload_images_only_once:false,absolute_position_accounts_for_offset:false,canvas_div_cannot_be_clipped:false,inputtext_parents_cannot_contain_clip:false,minimize_opacity_changes:false,set_height_for_multiline_inputtext:false,ie_opacity:false,text_measurement_use_insertadjacenthtml:false,text_selection_use_range:false,document_size_use_offsetheight:false,text_ie_carriagereturn:false,ie_paste_event:false,safari_paste_event:false,text_event_charcode:true,keypress_function_keys:true,ie_timer_closure:false,keyboardlistentotop:false};LzSprite.prototype.capabilities={rotation:false,scalecanvastopercentage:true,readcanvassizefromsprite:true,opacity:true,colortransform:false,audio:false,accessibility:false,htmlinputtext:false,advancedfonts:false,bitmapcaching:false,persistence:false};LzSprite.prototype.__updateQuirks=function(){
if(window["Lz"]&&Lz.__BrowserDetect){
Lz.__BrowserDetect.init();var $1=this.quirks;if($1["inner_html_strips_newlines"]==true){
LzSprite.prototype.inner_html_strips_newlines_re=RegExp("$","mg")
};if(Lz.__BrowserDetect.isIE){
if(Lz.__BrowserDetect.version<7){
$1["ie_alpha_image_loader"]=true
}else{
$1["invisible_parent_image_sizing_fix"]=true
};$1["ie_opacity"]=true;$1["ie_timer_closure"]=true;$1["ie_leak_prevention"]=true;$1["fix_ie_clickable"]=true;$1["fix_ie_background_height"]=true;$1["inner_html_no_entity_apos"]=true;$1["inputtext_parents_cannot_contain_clip"]=true;$1["minimize_opacity_changes"]=true;$1["set_height_for_multiline_inputtext"]=true;$1["text_measurement_use_insertadjacenthtml"]=true;$1["text_selection_use_range"]=true;$1["text_ie_carriagereturn"]=true;$1["ie_paste_event"]=true;$1["keypress_function_keys"]=false;$1["text_event_charcode"]=false
}else{
if(Lz.__BrowserDetect.isSafari){
$1["invisible_parent_image_sizing_fix"]=true;$1["alt_key_sends_control"]=true;$1["safari_textarea_subtract_scrollbar_height"]=true;$1["safari_avoid_clip_position_input_text"]=true;$1["safari_visibility_instead_of_display"]=true;$1["absolute_position_accounts_for_offset"]=true;$1["canvas_div_cannot_be_clipped"]=true;$1["document_size_use_offsetheight"]=true;if(Lz.__BrowserDetect.version>523.1){
this.capabilities["rotation"]=true
};$1["safari_paste_event"]=true;$1["keypress_function_keys"]=false;$1["keyboardlistentotop"]=true
}else{
if(Lz.__BrowserDetect.isOpera){
$1["invisible_parent_image_sizing_fix"]=true;$1["no_cursor_colresize"]=true;$1["absolute_position_accounts_for_offset"]=true;$1["canvas_div_cannot_be_clipped"]=true;$1["document_size_use_offsetheight"]=true;$1["text_event_charcode"]=false
}else{
if(Lz.__BrowserDetect.isFirefox&&Lz.__BrowserDetect.version<2){
$1["firefox_autocomplete_bug"]=true
}}}};if($1["safari_avoid_clip_position_input_text"]){
LzSprite.prototype.__defaultStyles.lzswfinputtext.marginTop="-2px";LzSprite.prototype.__defaultStyles.lzswfinputtext.marginLeft="-2px";LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.marginTop="-2px";LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.marginLeft="-2px"
};if($1["css_hide_canvas_during_init"]){
if($1["safari_visibility_instead_of_display"]){
LzSprite.prototype.__defaultStyles.lzcanvasdiv.visibility="hidden"
}else{
LzSprite.prototype.__defaultStyles.lzcanvasdiv.display="none"
};LzSprite.prototype.__defaultStyles.lzcanvasclickdiv.display="none"
};if($1["hand_pointer_for_clickable"]){
LzSprite.prototype.__defaultStyles.lzclickdiv.cursor="pointer"
}}};LzSprite.prototype.__updateQuirks();LzSprite.prototype.__defaultStyles.writeCSS();LzSprite.prototype.__LZdiv=null;LzSprite.prototype.__LZimg=null;LzSprite.prototype.__LZclick=null;LzSprite.prototype.x=null;LzSprite.prototype.y=null;LzSprite.prototype.opacity=null;LzSprite.prototype.width=null;LzSprite.prototype.height=null;LzSprite.prototype.playing=false;LzSprite.prototype.clickable=false;LzSprite.prototype.frame=1;LzSprite.prototype.frames=null;LzSprite.prototype.blankimage="/lps/includes/blank.gif";LzSprite.prototype.resource=null;LzSprite.prototype.visible=null;LzSprite.prototype.text=null;LzSprite.prototype.clip=null;LzSprite.prototype.stretches=null;LzSprite.prototype.resourceWidth=null;LzSprite.prototype.resourceHeight=null;LzSprite.prototype.cursor=null;LzSprite.prototype.init=function($1){
this.setVisible($1);if(this.isroot){
if(this.quirks["safari_visibility_instead_of_display"]){
this.__LZdiv.style.visibility="visible"
};if(this._id){
Lz[this._id]._ready(this.owner)
};LzHistory.__start()
}};LzSprite.prototype.__topZ=1;LzSprite.prototype.__parent=null;LzSprite.prototype.__children=null;LzSprite.prototype.addChildSprite=function($1){
$1.__parent=this;if(this.__children){
this.__children.push($1)
}else{
this.__children=[$1]
};this.__LZdiv.appendChild($1.__LZdiv);if(this.quirks.fix_clickable){
this.__LZclickdiv.appendChild($1.__LZclickdiv)
};$1.__setZ(++this.__topZ)
};LzSprite.prototype.setResource=function($1){
if(this.resource==$1){
return
};if($1.indexOf("http:")==0||$1.indexOf("https:")==0){
this.skiponload=false;this.setSource($1);return
};this.resource=$1;var $2=LzResourceLibrary[$1];if(!$2){
return
};var $3=$2.frames;this.resourceWidth=$2.width;this.resourceHeight=$2.height;this.skiponload=true;this.owner.setTotalFrames($3.length);var $4=$3[0];if($4){
this.baseurl="";if($2.ptype){
if($2.ptype=="sr"){
this.baseurl=Lz.options.resourceroot+"/"
}};this.frames=$3;this.__preloadFrames();this.setSource($4,true)
}else{
this.setSource($1,true)
}};LzSprite.prototype.CSSDimension=function($1,$2){
return Math.floor($1)+($2?$2:"px")
};LzSprite.prototype.loading=false;LzSprite.prototype.setSource=function($1,$2){
if($2!=true){
this.skiponload=false
};if($2=="memorycache"){
$2=true
};this.loading=true;this.resource=$1;if(!this.__ImgPool){
this.__ImgPool=new LzPool(LzSprite.prototype.__getImage,LzSprite.prototype.__gotImage,LzSprite.prototype.__destroyImage,this)
};var $3=this.__ImgPool.get($1,$2!=true);if(this.__LZimg){
this.__LZdiv.replaceChild($3,this.__LZimg);this.__LZimg=$3
}else{
this.__LZimg=$3;this.__LZdiv.appendChild(this.__LZimg)
};if(this.stretches){
this.__updateStretches()
};if(this.clickable){
this.setClickable(true)
};if(this.quirks.ie_alpha_image_loader){
this.__updateIEAlpha($3)
}};if(LzSprite.prototype.quirks.ie_alpha_image_loader){
LzSprite.prototype.__updateIEAlpha=function($1){
if($1._hasax==true){
return
};var $2=this.resourceWidth;var $3=this.resourceHeight;if(this.stretches=="both"){
$2="100%";$3="100%"
}else{
if(this.stretches=="width"){
$2="100%"
}else{
if(this.stretches=="height"){
$3="100%"
}}};if($2==null){
$2=this.width==null?"100%":this.width
};if($3==null){
$3=this.height==null?"100%":this.height
};if($2==null||$3==null){
return
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
this.__LZclick=document.createElement("img");this.__LZclick.src=Lz.options.resourceroot+LzSprite.prototype.blankimage
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
this.__LZclick=document.createElement("img");this.__LZclick.src=Lz.options.resourceroot+LzSprite.prototype.blankimage
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
};$2._clickable=$1;if($1){
var $3=LzSprite.prototype.__clickDispatcher;$2.onclick=$3;$2.onmouseover=$3;$2.onmouseout=$3;$2.onmousedown=$3;$2.onmouseup=$3;if(this.quirks.fix_ie_clickable){
$2.ondrag=$3
}}else{
$2.onclick=null;$2.onmouseover=null;$2.onmouseout=null;$2.onmousedown=null;$2.onmouseup=null;if(this.quirks.fix_ie_clickable){
$2.ondrag=null
}}};LzSprite.prototype.__clickDispatcher=function($1){
if(!$1){
$1=window.event
};this.owner.__mouseEvent($1);return false
};LzSprite.prototype.__mouseEvent=function($1){
if(LzKeyboardKernel&&LzKeyboardKernel["__keyboardEvent"]){
LzKeyboardKernel.__keyboardEvent($1)
};var $2=false;var $3="on"+$1.type;if(window["LzInputTextSprite"]&&$3=="onmouseover"&&LzInputTextSprite.prototype.__lastshown!=null){
LzInputTextSprite.prototype.__hideIfNotFocused()
};if($3=="onmousedown"){
$1.cancelBubble=true;this.__mousedown=true;if(window["LzMouseKernel"]){
LzMouseKernel.__lastMouseDown=this
}}else{
if($3=="onmouseup"){
$1.cancelBubble=false;if(window["LzMouseKernel"]&&LzMouseKernel.__lastMouseDown==this){
this.__mousedown=false
}else{
$2=true
}}};if($2==false&&this.owner.mouseevent&&LzMouseKernel&&LzMouseKernel["__sendEvent"]){
LzMouseKernel.__sendEvent($3,this.owner);if(this.__mousedown){
if($3=="onmouseover"){
LzMouseKernel.__sendEvent("onmousedragin",this.owner)
}else{
if($3=="onmouseout"){
LzMouseKernel.__sendEvent("onmousedragout",this.owner)
}}}}};LzSprite.prototype.__globalmouseup=function($1){
if(this.__mousedown){
this.__mouseEvent($1);this.__mouseEvent({type:"mouseupoutside"})
}};LzSprite.prototype.setX=function($1){
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

};LzSprite.prototype.__LZsetClickRegion=function($1){

};LzSprite.prototype.setVisible=function($1){
if(this.visible==$1){
return
};this.visible=$1;this.__LZdiv.style.display=$1?"block":"none";if(this.quirks.fix_clickable){
if(this.quirks.fix_ie_clickable&&this.__LZclick){
this.__LZclick.style.display=$1&&this.clickable?"":"none"
};this.__LZclickdiv.style.display=$1?"block":"none"
}};LzSprite.prototype.setColor=function($1){
if(this.color==$1){
return
};this.color=$1;this.__LZdiv.style.color=LzUtils.inttohex($1)
};LzSprite.prototype.setBGColor=function($1){
if(this.bgcolor==$1){
return
};this.bgcolor=$1;this.__LZdiv.style.backgroundColor=$1==null?"transparent":LzUtils.inttohex($1);if(this.quirks.fix_ie_background_height){
if(this.height!=null&&this.height<2){
this.setSource(Lz.options.resourceroot+LzSprite.prototype.blankimage,true)
}else{
if(!this._fontSize){
this.__LZdiv.style.fontSize="0px"
}}}};LzSprite.prototype.setOpacity=function($1){
if(this.opacity==$1||$1<0){
return
};this.opacity=$1;$1=parseInt($1*100)/100;if($1!=this._opacity){
this._opacity=$1;if($1==0){
this.__LZdiv.style.display="none";this._opacitywas0=true
}else{
if(this._opacitywas0){
this._opacitywas0=false;this.__LZdiv.style.display="block"
}};if(this.quirks.ie_opacity){
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
if(isNaN($1*1)==false){
this.__setFrame($1)
};if(this.playing==true){
return
};if(this.frames&&this.frames.length>1){
this.playing=true;this.owner.resourceevent("play",null,true);LzIdleKernel.addCallback(this,"__incrementFrame")
}};LzSprite.prototype.stop=function($1){
if(this.playing==true){
this.playing=false;this.owner.resourceevent("stop",null,true);LzIdleKernel.removeCallback(this,"__incrementFrame")
};if(isNaN($1*1)==false){
this.__setFrame($1)
}};LzSprite.prototype.__incrementFrame=function(){
this.frame++;if(this.frames&&this.frame>this.frames.length){
this.frame=1
};this.__updateFrame()
};LzSprite.prototype.__updateFrame=function($1){
if(this.playing||$1){
var $2=this.frames[this.frame-1];this.setSource($2,true)
};this.owner.resourceevent("frame",this.frame);if(this.frames.length==this.frame){
this.owner.resourceevent("lastframe",null,true)
}};if(LzSprite.prototype.quirks.preload_images_only_once){
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
};LzSprite.prototype.__imgonload=function($1){
if(this.loading!=true){
return
};if(this.__imgtimoutid!=null){
clearTimeout(this.__imgtimoutid)
};this.__imgtimoutid=null;this.loading=false;this.resourceWidth=$1.width;this.resourceHeight=$1.height;if(LzSprite.prototype.quirks.invisible_parent_image_sizing_fix&&this.resourceWidth==0){
var $2=this.__findParents("visible");if($2.length>0){
var $3=[];var $4=$2.length;for(var $5=0;$5<$4;$5++){
var $6=$2[$5];$3[$5]=$6.__LZdiv.style.display;$6.__LZdiv.style.display="block"
};this.resourceWidth=$1.width;this.resourceHeight=$1.height;for(var $5=0;$5<$4;$5++){
var $6=$2[$5];$6.__LZdiv.style.display=$3[$5]
}}};if(this.stretches){
this.__updateStretches()
};$1.__lastcondition="__imgonload";this.owner.resourceload({width:this.resourceWidth,height:this.resourceHeight,resource:this.resource,skiponload:this.skiponload})
};LzSprite.prototype.__imgonerror=function($1){
if(this.loading!=true){
return
};if(this.__LZimg){
this.__LZimg.__lastcondition="__imgonerror"
};if(this.__imgtimoutid!=null){
clearTimeout(this.__imgtimoutid)
};this.__imgtimoutid=null;this.loading=false;this.resourceWidth=1;this.resourceHeight=1;if(this.stretches){
this.__updateStretches()
};this.owner.resourceloaderror({resource:this.resource})
};LzSprite.prototype.__imgontimeout=function($1){
if(this.loading!=true){
return
};if(this.__LZimg){
this.__LZimg.__lastcondition="__imgontimeout"
};this.__imgtimoutid=null;this.loading=false;this.resourceWidth=1;this.resourceHeight=1;if(this.stretches){
this.__updateStretches()
};this.owner.resourceloadtimeout({resource:this.resource})
};LzSprite.prototype.__destroyImage=function($1,$2){
if($2&&$2.owner){
if($2.owner.__imgtimoutid!=null){
clearTimeout($2.owner.__imgtimoutid);$2.owner.__imgtimoutid=null
};LzUtils.removecallback($2.owner)
};if(LzSprite.prototype.quirks.ie_alpha_image_loader&&$2.sizer){
if($2.sizer.tId){
clearTimeout($2.sizer.tId)
};LzSprite.prototype.__discardElement($2.sizer);$2.sizer.onerror=null;$2.sizer.onload=null;$2.sizer.onloadforeal=null;$2.sizer=null
}else{
if($2){
$2.onerror=null;$2.onload=null;LzSprite.prototype.__discardElement($2)
}};$2=null;if(LzSprite.prototype.quirks.preload_images_only_once){
LzSprite.prototype.__preloadurls[$1]=null
}};LzSprite.prototype.__gotImage=function($1,$2){
this.owner[$2.__lastcondition]({width:this.owner.resourceWidth,height:this.owner.resourceHeight})
};LzSprite.prototype.__getImage=function($1,$2){
if(this.owner.baseurl){
$1=this.owner.baseurl+$1
};if(LzSprite.prototype.quirks.ie_alpha_image_loader){
var im=document.createElement("div");im.style.overflow="hidden";if(this.owner&&$2+""!="true"){
im.owner=this.owner;if(!im.sizer){
im.sizer=document.createElement("img")
};im.sizer.onload=function(){
im.sizer.tId=setTimeout(this.onloadforeal,1)
};im.sizer.onerror=function(){
im.owner.__imgonerror(im.sizer)
};im.sizer.onloadforeal=function(){
im.owner.__imgonload(im.sizer)
};var $3=LzUtils.getcallbackstr(this.owner,"__imgontimeout");this.owner.__imgtimoutid=setTimeout($3,canvas.medialoadtimeout);im.sizer.src=$1
};if(this.owner.stretches){
im.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+$1+"',sizingMethod='scale')"
}else{
im.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+$1+"')"
}}else{
var im=document.createElement("img");im.className="lzdiv";if(this.owner&&$2+""!="true"){
im.owner=this.owner;im.onload=LzUtils.getcallbackfunc(this.owner,"__imgonload",[im]);im.onerror=LzUtils.getcallbackfunc(this.owner,"__imgonerror",[im]);var $3=LzUtils.getcallbackstr(this.owner,"__imgontimeout");this.owner.__imgtimoutid=setTimeout($3,canvas.medialoadtimeout)
};im.src=$1
};if(im){
im.__lastcondition="__imgonload"
};return im
};LzSprite.prototype.setClip=function($1){
if(this.clip==$1){
return
};this.clip=$1;this.__updateClip()
};LzSprite.prototype.__updateClip=function(){
if(this.isroot&&this.capabilities.canvas_div_cannot_be_clipped==true){
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
};this.stretches=$1;this.__updateStretches()
};LzSprite.prototype.__updateStretches=function(){
if(this.loading){
return
};if(this.__LZimg){
if(this.stretches=="both"){
this.__LZimg.width=this.width;this.__LZimg.height=this.height
}else{
if(this.stretches=="height"){
this.__LZimg.width=this.resourceWidth;this.__LZimg.height=this.height
}else{
if(this.stretches=="width"){
this.__LZimg.width=this.width;this.__LZimg.height=this.resourceHeight
}else{
this.__LZimg.width=this.resourceWidth;this.__LZimg.height=this.resourceHeight
}}}}};LzSprite.prototype.predestroy=function(){

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
this.__LZdiv.onselectstart=null;this.__setClickable(false,this.__LZdiv);this.__discardElement(this.__LZdiv)
};if(this.__LZinputclickdiv){
this.__LZinputclickdiv.onmousedown=null;this.__discardElement(this.__LZinputclickdiv)
};if(this.__LZclickdiv){
this.__discardElement(this.__LZclickdiv)
};if(this.__LZtextdiv){
this.__discardElement(this.__LZtextdiv)
};if(this.__LZcanvas){
this.__discardElement(this.__LZcanvas)
};this.__ImgPool=null;if(this.quirks.ie_leak_prevention){
delete this.__sprites[this.uid]
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
};var $3=this.__LZdiv;var $4=null;var $5={};var $6;if(Lz.__BrowserDetect.isIE){
$6=$3.getBoundingClientRect();var $7=document.documentElement.scrollTop||document.body.scrollTop;var $8=document.documentElement.scrollLeft||document.body.scrollLeft;return {x:$6.left+$8,y:$6.top+$7}}else{
if(document.getBoxObjectFor){
$6=document.getBoxObjectFor($3);$5={x:$6.x,y:$6.y}}else{
$5={x:$3.offsetLeft,y:$3.offsetTop};$4=$3.offsetParent;if($4!=$3){
while($4){
$5.x+=$4.offsetLeft;$5.y+=$4.offsetTop;$4=$4.offsetParent
}};if(this.quirks.absolute_position_accounts_for_offset&&this.hasOwnProperty("getStyle")&&this.getStyle($3,"position")=="absolute"){
$5.y-=document.body.offsetTop
}}};if($3.parentNode){
$4=$3.parentNode
}else{
$4=null
};while($4&&$4.tagName!="BODY"&&$4.tagName!="HTML"){
$5.x-=$4.scrollLeft;$5.y-=$4.scrollTop;if($4.parentNode){
$4=$4.parentNode
}else{
$4=null
}};var $2=this;while($2&&$2!=this.__rootSprite){
if($2.__parent){
$2.__poscachedirty=false
};$2=$2.__parent
};this.__poscache=$5;return $5
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
};LzSprite.prototype.__setFrame=function($1){
if(!this.frames||this.frame==$1){
return
};if($1<1){
$1=1
}else{
if($1>this.frames.length){
$1=this.frames.length
}};this.frame=$1;this.__updateFrame(true)
};LzSprite.prototype.__discardElement=function($1){
if(LzSprite.prototype.quirks.ie_leak_prevention){
if($1.nodeType>=1&&$1.nodeType<13){
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
this.resource=null;if(this.__ImgPool){
this.__ImgPool.destroy();this.__ImgPool=null
};if(this.__LZimg){
this.__discardElement(this.__LZimg)
};this.__LZimg=null
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
};LzSprite.prototype.__sprites={}};Lz.attachEventHandler(window,"beforeunload",window,"__cleanUpForIE")
};LzLibrary=Class.make("LzLibrary",LzNode,["loaded",false,"loading",false,"sprite",null,"href",void 0,"stage","late","onload",LzDeclaredEvent,"construct",function($1,$2){
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
};this.loading=true;Lz.__dhtmlLoadLibrary(this.href)
},"loadfinished",function(){
this.loading=false;if(this.onload.ready){
this.onload.sendEvent(true)
}}],["tagname","import","attributes",new LzInheritedHash(LzNode.attributes),"libraries",{},"findLibrary",function($1){
return LzLibrary.libraries[$1]
},"__LZsnippetLoaded",function($1){
var $2=null;var $3=LzLibrary.libraries;for(var $4 in $3){
if($3[$4].href==$1){
$2=$3[$4];break
}};if($2==null){
Debug.error("could not find library with href",$1)
}else{
$2.loaded=true;LzInstantiateView({attrs:{libname:$2.name},name:"__libraryloadercomplete"},1);canvas.initDone()
}}]);var LzTextSprite=function($1){
if($1==null){
return
};this.__LZdiv=document.createElement("div");this.__LZdiv.className="lzdiv";this.__LZtextdiv=document.createElement("div");this.__LZtextdiv.className="lzdiv";this.__LZdiv.appendChild(this.__LZtextdiv);if(this.quirks.emulate_flash_font_metrics){
this.__LZdiv.className="lzswftext"
}else{
this.__LZdiv.className="lztext"
};this.__LZdiv.owner=this;if(this.quirks.fix_clickable){
this.__LZclickdiv=document.createElement("div");this.__LZclickdiv.className="lzdiv";this.__LZclickdiv.owner=this
};this.owner=$1;this.uid=LzSprite.prototype.uid++;if(this.quirks.ie_leak_prevention){
this.__sprites[this.uid]=this
}};LzTextSprite.prototype=new LzSprite(null);LzTextSprite.prototype.__initTextProperties=function($1){
this.setFontName($1.font);this.setFontStyle($1.fontstyle);this.setFontSize($1.fontsize)
};LzTextSprite.prototype._fontStyle="normal";LzTextSprite.prototype._fontWeight="normal";LzTextSprite.prototype._fontSize="11px";LzTextSprite.prototype._fontFamily="Verdana,Vera,sans-serif";LzTextSprite.prototype._whiteSpace="normal";LzTextSprite.prototype.__wpadding=4;LzTextSprite.prototype.__hpadding=4;LzTextSprite.prototype.__sizecacheupperbound=1000;LzTextSprite.prototype.selectable=true;LzTextSprite.prototype.setFontSize=function($1){
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
if($1=="null"){
$1=""
};if($2!=true&&this.text==$1){
return
};this.text=$1;if(this.multiline&&$1&&$1.indexOf("\n")>=0){
if(this.quirks["inner_html_strips_newlines"]){
$1=$1.replace(this.inner_html_strips_newlines_re,"<br />")
}}else{
if(this._whiteSpace!="normal"){
this._whiteSpace="normal";this.__LZdiv.style.whiteSpace="normal";this._styledirty=true
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
};this.setText(this.text,true)
};LzTextSprite.prototype.setPattern=function($1){

};LzTextSprite.prototype.getTextWidth=function(){
if(this.text==null||this.text==""){
return 0
};return this.getTextSize(this.text,this.resize).width
};LzTextSprite.prototype.getTextHeight=function(){
if(this.__LZdiv){
return this.getHeight()
}else{
return 0
}};LzTextSprite.prototype.getTextfieldHeight=function(){
if(this._styledirty!=true&&this.fieldHeight!=null){
return this.fieldHeight
};if(this.text==null||this.text==""){
this.fieldHeight=this.getTextSize("Yq_gy").height;return this.fieldHeight
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
var $2=this.getTextSize("Yq_gy").height;if($2!=0){
this.fieldHeight=$2
}};return $2
};LzTextSprite.prototype._sizecache={counter:0};if(LzSprite.prototype.quirks.ie_leak_prevention){
LzTextSprite.prototype._sizedomcache={}};LzTextSprite.prototype._styledirty=true;LzTextSprite.prototype.getTextSize=function($1,$2){
if(this._styledirty!=true){
var $3=this._stylecache
}else{
var $3="position: absolute";$3+=";visibility: hidden";$3+=";font-size: "+this._fontSize;$3+=";font-style: "+this._fontStyle;$3+=";font-weight: "+this._fontWeight;$3+=";font-family: "+this._fontFamily;if(this.multiline&&$2!=true){
if(this.width){
$3+=";width: "+this.width+"px"
}};if(this.quirks["text_measurement_use_insertadjacenthtml"]){
if(this.__LzInputDiv!=null){
$3+=";white-space: pre"
}else{
$3+=";white-space: "+this._whiteSpace
}}else{
if(this.__LzInputDiv!=null){
$3+=";white-space: pre"
}else{
$3+=";white-space: "+this._whiteSpace
}};this._stylecache=$3;this._styledirty=false
};var $4=document.getElementById("lzTextSizeCache");if(LzTextSprite.prototype._sizecache.counter>0&&LzTextSprite.prototype._sizecache.counter%LzTextSprite.prototype.__sizecacheupperbound==0){
LzTextSprite.prototype._sizecache={counter:0};if(LzSprite.prototype.quirks.ie_leak_prevention){
var $5=LzTextSprite.prototype._sizedomcache;var $6=LzSprite.prototype.__discardElement;for(var $7 in $5){
$6($5[$7])
};LzTextSprite.prototype._sizedomcache={}};if($4){
$4.innerHTML=""
}};if(LzTextSprite.prototype._sizecache[$3]==null){
LzTextSprite.prototype._sizecache[$3]={}};if(!$4){
$4=document.createElement("div");Lz.__setAttr($4,"id","lzTextSizeCache");Lz.__setAttr($4,"style","top: 4000px;");document.body.appendChild($4)
};var $8=LzTextSprite.prototype._sizecache[$3];if(!$8[$1]){
var $9={};if(this.quirks["text_measurement_use_insertadjacenthtml"]){
if(this.multiline&&$1&&this.quirks["inner_html_strips_newlines"]){
$1=$1.replace(this.inner_html_strips_newlines_re,"<br />")
};var $10="span";var $11=$8["lzdiv~~~"+$10];if($11==null){
var $12="<"+$10+' id="testSpan'+LzTextSprite.prototype._sizecache.counter+'"';$12+=' style="'+$3+'">';$12+=$1;$12+="</"+$10+">";$4.insertAdjacentHTML("beforeEnd",$12);$11=document.all["testSpan"+LzTextSprite.prototype._sizecache.counter];$8["lzdiv~~~"+$10]=$11
}}else{
if(this.__LzInputDiv==null){
if(this.multiline&&$1&&this.quirks["inner_html_strips_newlines"]){
$1=$1.replace(this.inner_html_strips_newlines_re,"<br />")
}};var $10=this.multiline?"div":"span";var $11=$8["lzdiv~~~"+$10];if($11==null){
$11=document.createElement($10);Lz.__setAttr($11,"style",$3);$4.appendChild($11);$8["lzdiv~~~"+$10]=$11
}};if(this.quirks.ie_leak_prevention){
LzTextSprite.prototype._sizedomcache["lzdiv~~~"+$10+$3]=$11
};$11.innerHTML=$1;$11.style.display="block";$9.width=$11.offsetWidth;$9.height=$11.offsetHeight;$11.style.display="none";if(this.quirks.emulate_flash_font_metrics){
$9.height=Math.floor($9.height*1.0000002)+(this.multiline?0:this.__hpadding);$9.width=$9.width+(this.multiline?0:this.__wpadding);if(this._whiteSpace=="normal"){
if(this.multiline){
$9.width+=this.__wpadding
}}};$8[$1]=$9;LzTextSprite.prototype._sizecache.counter++
};return $8[$1]
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

};LzTextSprite.prototype.getSelectionPosition=function(){

};LzTextSprite.prototype.getSelectionSize=function(){

};LzTextSprite.prototype.getScroll=function(){

};LzTextSprite.prototype.getMaxScroll=function(){

};LzTextSprite.prototype.setScroll=function(){

};LzTextSprite.prototype.__setWidth=LzSprite.prototype.setWidth;LzTextSprite.prototype.setWidth=function($1){
if($1==null||$1<0||isNaN($1)||this.width==$1){
return
};var $2=this.CSSDimension($1>=this.__wpadding?$1-this.__wpadding:0);this.__LZtextdiv.style.width=$2;this.__LZtextdiv.style.clip="rect(0px "+$2+" "+this.CSSDimension(this.height>=this.__hpadding?this.height-this.__hpadding:0)+" 0px)";this.__setWidth($1);this._styledirty=true
};LzTextSprite.prototype.__setHeight=LzSprite.prototype.setHeight;LzTextSprite.prototype.setHeight=function($1){
if($1==null||$1<0||isNaN($1)||this.height==$1){
return
};var $2=this.CSSDimension($1>=this.__hpadding?$1-this.__hpadding:0);this.__LZtextdiv.style.height=$2;this.__LZtextdiv.style.clip="rect(0px "+this.CSSDimension(this.width>=this.__wpadding?this.width-this.__wpadding:0)+" "+$2+" 0px)";this.__setHeight($1);if(this.multiline){
this._styledirty=true
}};var LzInputTextSprite=function($1){
if($1==null){
return
};this.__LZdiv=document.createElement("div");this.__LZdiv.className="lzdiv";this.__LZdiv.owner=this;if(this.quirks.fix_clickable){
this.__LZclickdiv=document.createElement("div");this.__LZclickdiv.className="lzdiv";this.__LZclickdiv.owner=this
};this.owner=$1;this.uid=LzSprite.prototype.uid++;if(this.quirks.ie_leak_prevention){
this.__sprites[this.uid]=this
};this.__createInputText()
};LzInputTextSprite.prototype=new LzTextSprite(null);LzInputTextSprite.prototype.____hpadding=2;LzInputTextSprite.prototype.____wpadding=2;LzInputTextSprite.prototype.____crregexp=new RegExp("\\r\\n","g");LzInputTextSprite.prototype.__createInputText=function($1){
if(this.__LzInputDiv){
return
};if(this.owner&&this.owner.password){
this.__LzInputDiv=document.createElement("input");Lz.__setAttr(this.__LzInputDiv,"type","password")
}else{
if(this.owner&&this.owner.multiline){
this.__LzInputDiv=document.createElement("textarea")
}else{
this.__LzInputDiv=document.createElement("input");Lz.__setAttr(this.__LzInputDiv,"type","text")
}};if(this.quirks.firefox_autocomplete_bug){
Lz.__setAttr(this.__LzInputDiv,"autocomplete","off")
};this.__LzInputDiv.owner=this;if(this.quirks.emulate_flash_font_metrics){
if(this.owner&&this.owner.multiline){
this.__LzInputDiv.className="lzswfinputtextmultiline"
}else{
this.____hpadding=1;this.__LzInputDiv.className="lzswfinputtext"
}}else{
this.__LzInputDiv.className="lzinputtext"
};if(this.owner){
Lz.__setAttr(this.__LzInputDiv,"name",this.owner.name)
};if($1==null){
$1=""
};Lz.__setAttr(this.__LzInputDiv,"value",$1);if(this.quirks.fix_clickable){
if(this.quirks.fix_ie_clickable){
this.__LZinputclickdiv=document.createElement("img");this.__LZinputclickdiv.src=Lz.options.resourceroot+LzSprite.prototype.blankimage
}else{
this.__LZinputclickdiv=document.createElement("div")
};this.__LZinputclickdiv.className="lzclickdiv";this.__LZinputclickdiv.owner=this;this.__LZinputclickdiv.onmouseover=function(){
if(this.owner.selectable!=true){
return
};LzInputTextSprite.prototype.__setglobalclickable(false);this.owner.__show()
};this.__LZclickdiv.appendChild(this.__LZinputclickdiv)
};this.__LZdiv.appendChild(this.__LzInputDiv);this.__setTextEvents(true)
};LzInputTextSprite.prototype.__show=function(){
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
};if(LzSprite.prototype.quirks.fix_ie_clickable&&$1=="onmousemove"){
if(LzInputTextSprite.prototype.__globalclickable==false&&LzInputTextSprite.prototype.__focusedSprite&&$2){
if($2.owner!=LzInputTextSprite.prototype.__focusedSprite){
LzInputTextSprite.prototype.__setglobalclickable(true)
}else{
LzInputTextSprite.prototype.__setglobalclickable(false)
}}}else{
if($1!=null&&LzInputTextSprite.prototype.__globalclickable==true){
LzInputTextSprite.prototype.__setglobalclickable(false)
};if(LzInputTextSprite.prototype.__focusedSprite!=LzInputTextSprite.prototype.__lastshown){
LzInputTextSprite.prototype.__lastshown.__hide()
}}};LzInputTextSprite.prototype.__setglobalclickable=function($1){
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
};this.__LZdiv.appendChild(this.__LzInputDiv);document.onselectstart=LzTextSprite.prototype.__cancelhandler
};LzInputTextSprite.prototype.gotBlur=function(){
if(LzInputTextSprite.prototype.__focusedSprite!=this){
return
};this.deselect()
};LzInputTextSprite.prototype.gotFocus=function(){
if(LzInputTextSprite.prototype.__focusedSprite==this){
return
};this.select()
};LzInputTextSprite.prototype.setText=function($1){
if($1==null){
return
};this.text=$1;this.__createInputText($1);this.__LzInputDiv.value=$1
};LzInputTextSprite.prototype.__setTextEvents=function($1){
if($1){
this.__LzInputDiv.onblur=this.__textEvent;this.__LzInputDiv.onmousedown=this.__textEvent;this.__LzInputDiv.onmouseout=this.__textEvent;this.__LzInputDiv.onfocus=this.__textEvent;this.__LzInputDiv.onclick=this.__textEvent;this.__LzInputDiv.onkeyup=this.__textEvent;this.__LzInputDiv.onkeydown=this.__textEvent;this.__LzInputDiv.onkeypress=this.__textEvent;this.__LzInputDiv.onselect=this.__textEvent;this.__LzInputDiv.onchange=this.__textEvent;if(this.quirks.ie_paste_event||this.quirks.safari_paste_event){
this.__LzInputDiv.onpaste=function($1){
this.owner.__pasteHandlerEx($1)
}}}else{
this.__LzInputDiv.onblur=null;this.__LzInputDiv.onmousedown=null;this.__LzInputDiv.onfocus=null;this.__LzInputDiv.onclick=null;this.__LzInputDiv.onkeyup=null;this.__LzInputDiv.onkeydown=null;this.__LzInputDiv.onkeypress=null;this.__LzInputDiv.onselect=null;this.__LzInputDiv.onchange=null;if(this.quirks.ie_paste_event||this.quirks.safari_paste_event){
this.__LzInputDiv.onpaste=null
}}};LzInputTextSprite.prototype.__pasteHandlerEx=function($1){
if(this.multiline&&this.owner.maxlength>0){
$1=$1?$1:window.event;if(this.quirks.safari_paste_event){
var $2=$1.clipboardData.getData("text/plain")
}else{
var $2=window.clipboardData.getData("TEXT");$2=$2.replace(this.____crregexp,"\n")
};if(this.quirks.text_ie_carriagereturn){
var $3=this.__LzInputDiv.value.replace(this.____crregexp,"\n").length
}else{
var $3=this.__LzInputDiv.value.length
};var $4=this.getSelectionSize();if($4<0){
$4=0
};var $5=this.owner.maxlength+$4;var $6=false;var $7=$5-$3;if($7>0){
var $8=$2;var $9=$8.length;if($9>$7){
$8=$8.substring(0,$7);$6=true
}}else{
var $8="";$6=true
};if($6){
$1.returnValue=false;if($1.preventDefault){
$1.preventDefault()
};if($8.length>0){
if(this.quirks.safari_paste_event){
var $10=this.__LzInputDiv.value;var $11=this.getSelectionPosition();this.__LzInputDiv.value=$10.substring(0,$11)+$8+$10.substring($11+$4);this.__LzInputDiv.setSelectionRange($11+$8.length,$11+$8.length)
}else{
var $12=document.selection.createRange();$12.text=$8
}}}}};LzInputTextSprite.prototype.__pasteHandler=function(){
var selpos=this.getSelectionPosition();var selsize=this.getSelectionSize();var val=this.__LzInputDiv.value;var that=this;setTimeout(function(){
var $1=that.__LzInputDiv.value;var $2=$1.length;var $3=that.owner.maxlength;if($2>$3){
var $4=val.length;var $5=$3+selsize-$4;var $6=$1.substr(selpos,$2-$4+selsize);$6=$6.substring(0,$5);that.__LzInputDiv.value=val.substring(0,selpos)+$6+val.substring(selpos+selsize);that.__LzInputDiv.setSelectionRange(selpos+$6.length,selpos+$6.length)
}},1)
};LzInputTextSprite.prototype.__textEvent=function($1){
if(!$1){
$1=window.event
};if(this.owner.__LZdeleted==true){
return
};if(this.owner.__skipevent){
this.owner.__skipevent=false;return
};var $2="on"+$1.type;if(this.owner.__shown!=true){
if($2=="onfocus"){
this.owner.__skipevent=true;this.owner.__show();this.owner.__LzInputDiv.blur();LzInputTextSprite.__lastfocus=this.owner;LzKeyboardKernel.setKeyboardControl(true)
};return
}else{
if(this.owner.__shown==false){
return
}};var $3=$1?$1.keyCode:event.keyCode;if($2=="onfocus"||$2=="onmousedown"){
if($2=="onfocus"){
LzInputTextSprite.prototype.__setglobalclickable(false)
};LzInputTextSprite.prototype.__focusedSprite=this.owner;this.owner.__show();if($2=="onfocus"&&this.owner._cancelfocus){
this.owner._cancelfocus=false;return
};if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=false
}}else{
if($2=="onblur"){
if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=true
};if(LzInputTextSprite.prototype.__focusedSprite==this.owner){
LzInputTextSprite.prototype.__focusedSprite=null
};this.owner.__hide();if(this.owner._cancelblur){
this.owner._cancelblur=false;return
}}else{
if($2=="onmouseout"){
this.owner.__setglobalclickable(true)
}}};if(this.owner.multiline&&this.owner.owner.maxlength>0){
if($2=="onkeypress"){
var $4=$1?$1:event;var $5=this.owner.quirks.text_event_charcode?$4.charCode:$4.keyCode;if(!($4.ctrlKey||$4.altKey)&&($5||$3==13)&&$3!=8){
var $6=this.owner.getSelectionSize();if($6<=0){
if(this.owner.quirks.text_ie_carriagereturn){
var $7=this.owner.__LzInputDiv.value.replace(this.owner.____crregexp,"\n")
}else{
var $7=this.owner.__LzInputDiv.value
};var $8=$7.length,$9=this.owner.owner.maxlength;if($8>=$9){
$4.returnValue=false;if($4.preventDefault){
$4.preventDefault()
}}}}else{
if(this.owner.quirks.keypress_function_keys){
if($4.ctrlKey&&!$4.altKey&&!$4.shiftKey){
var $10=String.fromCharCode($5);if($10=="v"||$10=="V"){
var $8=this.owner.__LzInputDiv.value.length,$9=this.owner.owner.maxlength;if($8<$9||this.owner.getSelectionSize()>0){
this.owner.__pasteHandler()
}else{
$4.returnValue=false;if($4.preventDefault){
$4.preventDefault()
}}}}}}}};if($2=="onkeypress"){
return
};if(this.owner.owner){
if($2=="onkeydown"||$2=="onkeyup"){
var $11=this.owner.__LzInputDiv.value;if($11!=this.owner.text){
this.owner.text=$11;this.owner.owner.inputtextevent("onchange",$11)
}}else{
this.owner.owner.inputtextevent($2,$3)
}}};LzInputTextSprite.prototype.setEnabled=function($1){
this.disabled=!$1;this.__LzInputDiv.disabled=this.disabled
};LzInputTextSprite.prototype.setMaxLength=function($1){
if($1==null){
return
};this.__LzInputDiv.maxLength=$1
};LzInputTextSprite.prototype.select=function(){
this._cancelblur=true;this.__show();this.__LzInputDiv.focus();LzInputTextSprite.__lastfocus=this;setTimeout("LzInputTextSprite.__lastfocus.__LzInputDiv.select()",50);if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=false
}};LzInputTextSprite.prototype.setSelection=function($1,$2){
if($2==null){
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
};var $2=this.__setWidth($1-this.____wpadding);if(this.quirks.fix_clickable&&$2!=null){
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
};this.color=$1;this.__LzInputDiv.style.color=LzUtils.inttohex($1)
};LzInputTextSprite.prototype.getText=function(){
if(this.multiline&&this.quirks.text_ie_carriagereturn){
return this.__LzInputDiv.value.replace(this.____crregexp,"\n")
}else{
return this.__LzInputDiv.value
}};LzInputTextSprite.prototype.getTextfieldHeight=function(){
if(this.fieldHeight!=null){
return this.fieldHeight
};if(this.text==null||this.text==""){
var $1=true;this.text="YgjyZT;:"
};if(this.multiline){
var $2=false;if(this.height){
$2=this.__LzInputDiv.style.height;this.__LzInputDiv.style.height="auto"
};var $3=this.__LzInputDiv.scrollHeight;if($3==0||$3==null){
$3=this.getTextSize(this.text).height
}else{
if(this.quirks["safari_textarea_subtract_scrollbar_height"]){
$3+=24
};this.fieldHeight=$3
};if(this.height){
this.__LzInputDiv.style.height=$2
}}else{
var $3=this.getTextSize(this.text).height;if($3!=0){
this.fieldHeight=$3
}};if(this.quirks.emulate_flash_font_metrics){
$3+=4
};if($1){
this.text=""
};return $3
};LzInputTextSprite.prototype.getTextHeight=function(){
var $1=this.getTextfieldHeight();if(this.quirks.emulate_flash_font_metrics){
$1-=4
};return $1
};LzInputTextSprite.findSelection=function(){
if(LzInputTextSprite.__focusedSprite&&LzInputTextSprite.__focusedSprite.owner){
return LzInputTextSprite.__focusedSprite.owner
}};document.onselectstart=LzTextSprite.prototype.__cancelhandler;document.ondrag=LzTextSprite.prototype.__cancelhandler;var LzXMLParser=new Object();LzXMLParser.parseXML=function($1,$2,$3){
var $4=new DOMParser();var $5=$4.parseFromString($1,"text/xml");return $5.childNodes[0]
};if(typeof DOMParser=="undefined"){
var DOMParser=function(){

};DOMParser.prototype.parseFromString=function($1,$2){
if(typeof window.ActiveXObject!="undefined"){
var $3=new ActiveXObject("MSXML.DomDocument");$3.loadXML($1);return $3
}else{
if(typeof XMLHttpRequest!="undefined"){
var $4=new XMLHttpRequest();$4.open("GET","data:"+($2||"application/xml")+";charset=utf-8,"+encodeURIComponent($1),false);if($4.overrideMimeType){
$4.overrideMimeType($2)
};$4.send(null);return $4.responseXML
}}}};var LzXMLTranslator=new Object();LzXMLTranslator.copyXML=function($1,$2,$3){
var $4=LzXMLTranslator.copyBrowserXML($1,true,$2,$3);return $4
};LzXMLTranslator.whitespacePat=new RegExp("^[\t\n\r ]*$");LzXMLTranslator.stringTrimPat=new RegExp("(^[\t\n\r ]*|[\t\n\r ]*$)","g");LzXMLTranslator.slashPat=new RegExp("/","g");LzXMLTranslator.copyBrowserXML=function($1,$2,$3,$4){
if(!$1){
return $1
};var $5=$1.nodeValue;var $6=null;if($1.nodeType==3||$1.nodeType==4){
if($2&&LzXMLTranslator.whitespacePat.test($5)){
return null
};if($3){
var $7=$5;$5=$5.replace(LzXMLTranslator.stringTrimPat,"")
};$6=new LzDataText($5);return $6
}else{
if($1.nodeType==1||$1.nodeType==9){
var $8=$1.attributes;var $9={};if($8){
for(var $10=0;$10<$8.length;$10++){
var $11=$8.item($10);if($11){
var $12=$11.name;var $13=$11.value;var $14=$12;if(!$4){
var $15=$12.indexOf(":");if($15>=0){
$14=$12.substring($15+1)
}};$9[$14]=$13
}}};var $16=$1.nodeName;if($16&&!$4){
var $17=$16.indexOf(":");if($17>=0){
$16=$16.substring($17+1)
}};$6=new LzDataElement($16,$9);var $18=$1.childNodes;var $19=[];for(var $20=0;$20<$18.length;$20++){
var $21=$18[$20];var $22=LzXMLTranslator.copyBrowserXML($21,$2,$3,$4);if($22!=null){
$19.push($22)
}};$6.setChildNodes($19);return $6
}else{
return null
}}};var LzHTTPLoader=function($1,$2){
this.owner=$1;this.options={parsexml:true};this.requestheaders={};this.requestmethod=LzHTTPLoader.GET_METHOD;this.__loaderid=LzHTTPLoader.loaderIDCounter++
};LzHTTPLoader.prototype.loadSuccess=function($1,$2){

};LzHTTPLoader.prototype.loadError=function($1,$2){

};LzHTTPLoader.prototype.loadTimeout=function($1,$2){

};LzHTTPLoader.prototype.getResponse=function(){
return this.responseText
};LzHTTPLoader.prototype.getResponseStatus=function(){

};LzHTTPLoader.prototype.getResponseHeaders=function(){
return this.req.getAllResponseHeaders()
};LzHTTPLoader.prototype.setRequestHeaders=function($1){
this.requestheaders=$1
};LzHTTPLoader.prototype.setRequestHeader=function($1,$2){
this.requestheaders[$1]=$2
};LzHTTPLoader.prototype.abort=function(){
if(this.req){
this.__abort=true;this.req.abort();this.req=null;this.removeTimeout(this)
}};LzHTTPLoader.prototype.setOption=function($1,$2){
this.options[$1]=$2
};LzHTTPLoader.prototype.setProxied=function($1){
this.setOption("proxied",$1)
};LzHTTPLoader.prototype.setQueryParams=function($1){
this.queryparams=$1
};LzHTTPLoader.prototype.setQueryString=function($1){
this.querystring=$1
};LzHTTPLoader.prototype.setQueueing=function($1){
this.setOption("queuing",$1)
};LzHTTPLoader.prototype.getResponseHeader=function($1){
return this.req.getResponseHeader($1)
};LzHTTPLoader.GET_METHOD="GET";LzHTTPLoader.POST_METHOD="POST";LzHTTPLoader.PUT_METHOD="PUT";LzHTTPLoader.DELETE_METHOD="DELETE";LzHTTPLoader.prototype.open=function($1,$2,$3,$4){
if(this.req){
Debug.warn("pending request for id=%s",this.__loaderid)
};this.req=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");this.__abort=false;this.__timeout=false;this.requesturl=$2;this.requestmethod=$1
};LzHTTPLoader.prototype.makeProxiedURL=function($1,$2,$3,$4,$5){
var $6=LzBrowser.getBaseURL();var $7={lzt:$3!=null?$3:"xmldata",reqtype:$2,sendheaders:this.options.sendheaders,trimwhitespace:this.options.trimwhitespace,nsprefix:this.options.nsprefix,url:LzBrowser.toAbsoluteURL($1,this.secure),timeout:this.timeout,cache:this.options.cacheable,ccache:this.options.ccache};if($5!=null){
$7.lzpostbody=$5
};var $8;var $9="";if($4!=null){
for($8 in $4){
$9+=$8+": "+$4[$8]+"\n"
}};if($9!=""){
$7["headers"]=$9
};if(!this.options.ccache){
$7.__lzbc__=new Date().getTime()
};$6+="?";var $10="";for(var $11 in $7){
var $12=$7[$11];if(typeof $12=="string"){
$12=encodeURIComponent($12);$12=$12.replace(LzDataset.slashPat,"%2F")
};$6+=$10+$11+"="+$12;$10="&"
};return $6
};LzHTTPLoader.prototype.send=function($1){
this.loadXMLDoc(this.requestmethod,this.requesturl,this.requestheaders,$1,true,true)
};LzHTTPLoader.activeRequests={};LzHTTPLoader.loaderIDCounter=0;LzHTTPLoader.prototype.timeout=Infinity;LzHTTPLoader.prototype.setTimeout=function($1){
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
}}};LzHTTPLoader.prototype.loadXMLDoc=function($1,$2,$3,$4,$5,parsexml){
if(this.req){
var __pthis__=this;this.req.onreadystatechange=function(){
if(__pthis__.req==null){
return
};if(__pthis__.req.readyState==4){
if(__pthis__.__timeout){

}else{
if(__pthis__.__abort){

}else{
var $1=-1;try{
$1=__pthis__.req.status
}
catch(e){

};if($1==200||$1==304){
var $2=null;var $3=__pthis__.req.responseXML;__pthis__.responseXML=$3;var $4=null;if($3!=null&&parsexml){
var $5=__pthis__.req.responseXML.childNodes;for(var $6=0;$6<$5.length;$6++){
var $7=$5.item($6);if($7.nodeType==1){
$2=$7;break
}};$4=LzXMLTranslator.copyXML($2,__pthis__.options.trimwhitespace,__pthis__.options.nsprefix)
};__pthis__.responseText=__pthis__.req.responseText;__pthis__.removeTimeout(__pthis__);__pthis__.req=null;__pthis__.loadSuccess(__pthis__,$4)
}else{
__pthis__.removeTimeout(__pthis__);__pthis__.req=null;__pthis__.loadError(__pthis__,null)
}}}}};this.req.open($1,$2,true);if($1=="POST"&&$3["content-type"]==null){
$3["content-type"]="application/x-www-form-urlencoded"
};this.__setRequestHeaders(this.req,$3);this.req.send($4)
};if(isFinite(this.timeout)){
this.setupTimeout(this,this.timeout)
}};var LzScreenKernel={width:null,height:null,__resizeEvent:function(){
var $1=window.top.document.body;if(LzSprite.prototype.quirks.document_size_use_offsetheight){
$1=window.document.body;LzScreenKernel.width=$1.offsetWidth;LzScreenKernel.height=$1.offsetHeight
}else{
if(window.top.innerHeight){
$1=window;LzScreenKernel.width=$1.innerWidth;LzScreenKernel.height=$1.innerHeight
}else{
if(window.top.document.documentElement&&window.top.document.documentElement.clientHeight){
$1=window.top.document.documentElement;LzScreenKernel.width=$1.clientWidth;LzScreenKernel.height=$1.clientHeight
}else{
if($1){
LzScreenKernel.width=$1.clientWidth;LzScreenKernel.height=$1.clientHeight
}}}};if(LzScreenKernel.__callback){
LzScreenKernel.__scope[LzScreenKernel.__callback]({width:LzScreenKernel.width,height:LzScreenKernel.height})
}},__init:function(){
Lz.attachEventHandler(window.top,"resize",LzScreenKernel,"__resizeEvent")
},__callback:null,__scope:null,setCallback:function($1,$2){
this.__scope=$1;this.__callback=$2;this.__init();this.__resizeEvent()
}};LzContextMenuKernel=Class.make("LzContextMenuKernel",null,["$lzsc$initialize",function($1){
this.owner=$1;this.__LZmousedowndel=new LzDelegate(this,"__hide")
},"owner",null,"showbuiltins",false,"_delegate",null,"__LZmousedowndel",null,"setDelegate",function($1){
this._delegate=$1
},"addItem",function($1){

},"hideBuiltInItems",function(){
this.showbuiltins=false
},"clearItems",function(){

},"__show",function(){
var $1=document.getElementById("lzcontextmenu");if(!$1){
$1=document.createElement("div");Lz.__setAttr($1,"id","lzcontextmenu");Lz.__setAttr($1,"style","display: none");document.body.appendChild($1)
};if(this.owner.onmenuopen.ready){
this.owner.onmenuopen.sendEvent(this.owner)
};var $2="";var $3=this.owner.getItems();for(var $4=0;$4<$3.length;$4++){
var $5=$3[$4].kernel;var $6=$5.cmenuitem;if($6.visible!=true){
continue
};if($6.separatorBefore){
$2+="<br/>"
};var $7=false;for(var $8=0;$8<$4;$8++){
if($5._equals($3[$8].kernel)){
$7=true;break
}};if($7){
continue
};if($6.enabled){
$2+='<a onmousedown="javascript:LzMouseKernel.__showncontextmenu.__select('+$4+');return false;"';$2+=">"+$6.caption+"</a>"
}else{
$2+=$6.caption
}};LzMouseKernel.__showncontextmenu=this;$1.innerHTML=$2;$1.style.left=LzMouseKernel.__x+"px";$1.style.top=LzMouseKernel.__y+"px";$1.style.display="block";this.__LZmousedowndel.register(LzGlobalMouse,"onmousedown");if(this._delegate!=null){
this._delegate.execute(this)
}},"__hide",function($1){
var $2=document.getElementById("lzcontextmenu");if(!$2){
return
};$2.style.display="none";this.__LZmousedowndel.unregisterAll()
},"__select",function($1){
this.__hide();var $2=this.owner.getItems();if($2[$1]){
$2[$1].kernel.__select()
}}],null);LzContextMenuItemKernel=Class.make("LzContextMenuItemKernel",null,["$lzsc$initialize",function($1,$2,$3){
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
if(this.owner.onselect.ready){
this.owner.onselect.sendEvent(this.owner)
};if(this._delegate!=null){
if(this._delegate instanceof LzDelegate){
this._delegate.execute(this)
}else{
if(typeof this._delegate=="function"){
this._delegate(this)
}else{

}}}},"_equals",function($1){
return $1!=null&&this.cmenuitem.caption==$1.cmenuitem.caption
}],null);if(LzSprite.prototype.quirks.ie_timer_closure){
(function($1){
window.setTimeout=$1(window.setTimeout);window.setInterval=$1(window.setInterval)
})(function(f){
return function(c,$1){
var a=Array.prototype.slice.call(arguments,2);if(typeof c!="function"){
c=new Function(c)
};return f(function(){
c.apply(this,a)
},$1)
}})
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
}};LzView=Class.make("LzView",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"_height",void 0,"_width",void 0,"_y",void 0,"_x",void 0,"__LZhaser",void 0,"__LZlayout",void 0,"fontname",void 0,"_visible",void 0,"__LZstoredbounds",void 0,"__movecounter",0,"__mousecache",null,"__lzcheckframe",void 0,"playing",false,"onaddsubview",LzDeclaredEvent,"onbgcolor",LzDeclaredEvent,"onblur",LzDeclaredEvent,"onclick",LzDeclaredEvent,"onclickable",LzDeclaredEvent,"onfocus",LzDeclaredEvent,"onframe",LzDeclaredEvent,"onheight",LzDeclaredEvent,"onimload",LzDeclaredEvent,"onkeyup",LzDeclaredEvent,"onkeydown",LzDeclaredEvent,"onlastframe",LzDeclaredEvent,"onload",LzDeclaredEvent,"onloadperc",LzDeclaredEvent,"onerror",LzDeclaredEvent,"ontimeout",LzDeclaredEvent,"onmousedown",LzDeclaredEvent,"onmouseout",LzDeclaredEvent,"onmouseover",LzDeclaredEvent,"onmousetrackover",LzDeclaredEvent,"onmousetrackup",LzDeclaredEvent,"onmouseup",LzDeclaredEvent,"onopacity",LzDeclaredEvent,"onplay",LzDeclaredEvent,"onremovesubview",LzDeclaredEvent,"onresource",LzDeclaredEvent,"onresourceheight",LzDeclaredEvent,"onresourcewidth",LzDeclaredEvent,"onrotation",LzDeclaredEvent,"onstop",LzDeclaredEvent,"ontotalframes",LzDeclaredEvent,"onunstretchedheight",LzDeclaredEvent,"onunstretchedwidth",LzDeclaredEvent,"onvisible",LzDeclaredEvent,"onvisibility",LzDeclaredEvent,"onwidth",LzDeclaredEvent,"onx",LzDeclaredEvent,"onxoffset",LzDeclaredEvent,"ony",LzDeclaredEvent,"onyoffset",LzDeclaredEvent,"ondblclick",LzDeclaredEvent,"DOUBLE_CLICK_TIME",500,"capabilities",LzSprite.prototype.capabilities,"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1?$1:canvas,$2);this.__LZdelayedSetters=LzView.__LZdelayedSetters;this.earlySetters=LzView.earlySetters;var $3=this.immediateparent;var $4=this.immediateparent;if($3){
this.mask=$3.mask
};this.__makeSprite($2);if("width" in $2){
this.hassetwidth=true;this.__LZcheckwidth=false
};if("height" in $2){
this.hassetheight=true;this.__LZcheckheight=false
};if(("clip" in $2)&&$2["clip"]&&!($2.clip instanceof LzInitExpr)){
this.clip=$2.clip;this.makeMasked()
};if(("stretches" in $2)&&$2["stretches"]!=null&&!($2.stretches instanceof LzInitExpr)){
this.$lzc$set_stretches($2.stretches);$2.stretches=LzNode._ignoreAttribute
};if($2["resource"]!=null&&!($2.resource instanceof LzInitExpr)){
this.$lzc$set_resource($2.resource);$2.resource=LzNode._ignoreAttribute
}},"__spriteAttribute",function($1,$2){
if(this[$1]){
this.setAttribute($1,$2)
}},"__makeSprite",function($1){
this.sprite=new LzSprite(this,false,$1)
},"init",function(){
if(this.sprite){
this.sprite.init(this.visible)
}else{
Debug.warn("LzView init method called and this.sprite is null",this)
}},"addSubview",function($1){
if(this.sprite){
this.sprite.addChildSprite($1.sprite)
}else{
Debug.warn("LzView.addSubview called when this.sprite is null",this)
};if($1.addedToParent){
return
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
}else{
Debug.warn("LaszloView.__LZinstantiationDone immediateparent = null",this)
};(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZinstantiationDone"]:this.nextMethod(arguments.callee,"__LZinstantiationDone")).apply(this,arguments)
},"mask",void 0,"focusable",false,"focustrap",void 0,"clip",false,"$lzc$set_clip",-1,"$lzc$set_x",function($1){
this.setX($1)
},"$lzc$set_y",function($1){
this.setY($1)
},"$lzc$set_rotation",function($1){
this.setRotation($1)
},"$lzc$set_opacity",function($1){
this.setOpacity($1)
},"$lzc$set_alpha",function($1){
this.setOpacity($1)
},"$lzc$set_visibility",function($1){
this.setVisibility($1)
},"align","left","$lzc$set_align",function($1){
this.setAlign($1)
},"valign","top","$lzc$set_valign",function($1){
this.setValign($1)
},"source",void 0,"$lzc$set_source",function($1){
this.setSource($1)
},"$lzc$set_bgcolor",function($1){
this.setBGColor($1)
},"$lzc$set_clickable",function($1){
this.setClickable($1)
},"clickregion",void 0,"$lzc$set_clickregion",function($1){
this.__LZsetClickRegion($1)
},"cursor",void 0,"$lzc$set_cursor",function($1){
this.setCursor($1)
},"fgcolor",void 0,"$lzc$set_fgcolor",function($1){
this.setColor($1)
},"font",void 0,"$lzc$set_font",function($1){
this.setFontName($1)
},"fontstyle",void 0,"fontsize",void 0,"stretches","none","$lzc$set_play",function($1){
this.setPlay($1)
},"$lzc$set_showhandcursor",function($1){
this.setShowHandCursor($1)
},"layout",void 0,"$lzc$set_layout",function($1){
this.setLayout($1)
},"aaactive",void 0,"$lzc$set_aaactive",function($1){
this.setAAActive($1)
},"aaname",void 0,"$lzc$set_aaname",function($1){
this.setAAName($1)
},"aadescription",void 0,"$lzc$set_aadescription",function($1){
this.setAADescription($1)
},"aatabindex",void 0,"$lzc$set_aatabindex",function($1){
this.setAATabIndex($1)
},"aasilent",void 0,"$lzc$set_aasilent",function($1){
this.setAASilent($1)
},"$lzc$set_xoffset",function($1){
this.setXOffset($1)
},"$lzc$set_yoffset",function($1){
this.setYOffset($1)
},"sprite",null,"visible",true,"visibility","collapse","__LZvizO",true,"__LZvizLoad",true,"opacity",1,"bgcolor",null,"x",0,"y",0,"rotation",0,"width",0,"$lzc$set_width",function($1){
this.setWidth($1)
},"height",0,"$lzc$set_height",function($1){
this.setHeight($1)
},"unstretchedwidth",0,"unstretchedheight",0,"subviews",[],"__LZclickregion","LzMouseEvents","xoffset",0,"yoffset",0,"__LZrsin",0,"__LZrcos",1,"__LZcaloffset",false,"_xscale",1,"_yscale",1,"totalframes",0,"frame",0,"$lzc$set_frame",function($1){
this.setResourceNumber($1)
},"loadperc",0,"framesloadratio",0,"loadratio",0,"hassetheight",false,"hassetwidth",false,"__LZisView",true,"addedToParent",null,"checkPlayStatusDel",null,"masked",false,"pixellock",null,"setButtonSize",null,"clickable",false,"showhandcursor",null,"updatePlayDel",null,"resource",null,"resourcewidth",null,"resourceheight",null,"__LZbgColorO",null,"__LZbgRef",null,"__LZbuttonRef",null,"__LZcheckwidth",true,"__LZcheckheight",true,"__LZhasoffset",null,"__LZisBackgrounded",null,"__LZmaskClip",null,"__LZmovieClipRef",null,"__LZoutlieheight",null,"__LZoutliewidth",null,"__LZsubUniqueNum",null,"setLayout",function($1){
if(!this.isinited){
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
};this.__LZlayout=new (ConstructorMap[$2])(this,$3)
}},"setFontName",function($1,$2){
if(arguments.length<2){
$2=null
};this.fontname=$1;if(!this.sprite){
return
};this.sprite.setFontName($1,$2)
},"_setrescwidth",false,"_setrescheight",false,"searchSubviews",function($1,$2){
var $3=this.subviews.concat();while($3.length>0){
var $4=$3;$3=new Array();for(var $5=$4.length-1;$5>=0;$5--){
var $6=$4[$5];if($6[$1]==$2){
return $6
};var $7=$6.subviews;for(var $8=$7.length-1;$8>=0;$8--){
$3.push($7[$8])
}}};return null
},"searchimmediateparents",function($1){
return this.searchParents($1)
},"layouts",null,"releaseLayouts",function(){
if(this.layouts){
for(var $1=this.layouts.length-1;$1>=0;$1--){
this.layouts[$1].releaseLayout()
}}},"_resource",null,"setResource",function($1){
this.$lzc$set_resource($1)
},"$lzc$set_resource",function($1){
if($1==null||$1==this._resource){
return
};this.resource=this._resource=$1;if($1!="empty"){
this.sprite.setResource($1)
};this.__LZhaser=$1=="empty";if(this.onresource.ready){
this.onresource.sendEvent($1)
}},"resourceload",function($1){
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
}}},"resourceloaderror",function(){
this.resourcewidth=0;this.resourceheight=0;if(this.onresourcewidth.ready){
this.onresourcewidth.sendEvent(0)
};if(this.onresourceheight.ready){
this.onresourceheight.sendEvent(0)
};this.reevaluateSize();if(this.onerror.ready){
this.onerror.sendEvent()
}},"resourceloadtimeout",function(){
this.resourcewidth=0;this.resourceheight=0;if(this.onresourcewidth.ready){
this.onresourcewidth.sendEvent(0)
};if(this.onresourceheight.ready){
this.onresourceheight.sendEvent(0)
};this.reevaluateSize();if(this.ontimeout.ready){
this.ontimeout.sendEvent()
}},"resourceevent",function($1,$2,$3){
if($3!=true){
this[$1]=$2
};var $4=this["on"+$1];if($4.ready){
$4.sendEvent($2)
}},"setTotalFrames",function($1){
if($1!=null&&this.totalframes!=$1){
this.totalframes=$1;if(this.ontotalframes.ready){
this.ontotalframes.sendEvent(this.totalframes)
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
};if("onremovesubview" in $1){
if($1.onremovesubview.ready){
$1.onremovesubview.sendEvent(this)
}}}},"setVisible",function($1){
this.$lzc$set_visible($1)
},"$lzc$set_visible",function($1){
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
},"setVisibility",function($1){
if(this.visibility==$1){
return
};this.visibility=$1;if(this.onvisibility.ready){
this.onvisibility.sendEvent($1)
};this.__LZupdateShown()
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
if(this._width!=$1){
this._width=$1;this.sprite.setWidth($1);if($1==null){
this.hassetwidth=false;this.__LZcheckwidth=true;if(this._setrescwidth){
this.unstretchedwidth=null;this._xscale=1
};this.reevaluateSize("width");return
};this.width=$1;if(this.pixellock){
$1=Math.floor($1)
};if(this._setrescwidth){
var $2=this.unstretchedwidth==0?100:$1/this.unstretchedwidth;this._xscale=$2
}else{
this.__LZcheckwidth=false
};this.hassetwidth=true;var $3=this.immediateparent;if($3&&$3.__LZcheckwidth){
$3.__LZcheckwidthFunction(this)
};if(this.onwidth.ready){
this.onwidth.sendEvent($1)
}}},"setHeight",function($1){
if(this._height!=$1){
this._height=$1;this.sprite.setHeight($1);if($1==null){
this.hassetheight=false;this.__LZcheckheight=true;if(this._setrescheight){
this.unstretchedheight=null;this._yscale=1
};this.reevaluateSize("height");return
};this.height=$1;if(this.pixellock){
$1=Math.floor($1)
};if(this._setrescheight){
var $2=this.unstretchedheight==0?100:$1/this.unstretchedheight;this._yscale=$2
}else{
this.__LZcheckheight=false
};this.hassetheight=true;var $3=this.immediateparent;if($3&&$3.__LZcheckheight){
$3.__LZcheckheightFunction(this)
};if(this.onheight.ready){
this.onheight.sendEvent($1)
}}},"setOpacity",function($1){
if(this.capabilities.opacity){
this.sprite.setOpacity($1)
}else{

};this.opacity=$1;if(this.onopacity.ready){
this.onopacity.sendEvent($1)
};var $2=this.__LZvizO;var $3=$1!=0;if($2!=$3){
this.__LZvizO=$3;this.__LZupdateShown()
}},"setX",function($1,$2){
if(arguments.length<2){
$2=null
};if($2||this._x!=$1){
this._x=$1;this.x=$1;if(this.__LZhasoffset){
if(this.capabilities.rotation){
$1-=this.xoffset*this.__LZrcos-this.yoffset*this.__LZrsin
}else{
$1-=this.xoffset
}};if(this.pixellock){
$1=Math.floor($1)
};this.sprite.setX($1);var $3=this.immediateparent;if($3.__LZcheckwidth){
$3.__LZcheckwidthFunction(this)
};if(this.onx.ready){
this.onx.sendEvent(this.x)
}}},"setY",function($1,$2){
if(arguments.length<2){
$2=null
};if($2||this._y!=$1){
this._y=$1;this.y=$1;if(this.__LZhasoffset){
if(this.capabilities.rotation){
$1-=this.xoffset*this.__LZrsin+this.yoffset*this.__LZrcos
}else{
$1-=this.yoffset
}};if(this.pixellock){
$1=Math.floor($1)
};this.sprite.setY($1);var $3=this.immediateparent;if($3.__LZcheckheight){
$3.__LZcheckheightFunction(this)
};if(this.ony.ready){
this.ony.sendEvent(this.y)
}}},"setRotation",function($1){
if(this.capabilities.rotation){
this.sprite.setRotation($1)
}else{

};this.rotation=$1;var $2=Math.PI/180*this.rotation;this.__LZrsin=Math.sin($2);this.__LZrcos=Math.cos($2);if(this.onrotation.ready){
this.onrotation.sendEvent($1)
};if(this.__LZhasoffset){
this.setX(this.x,true);this.setY(this.y,true)
};var $3=this.immediateparent;if($3.__LZcheckwidth){
$3.__LZcheckwidthFunction(this)
};if($3.__LZcheckheight){
$3.__LZcheckheightFunction(this)
}},"setAlign",function($1){
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
this.setAttribute("x",0)
};this.align=$1
},"__LZalignCenter",function($1){
if(arguments.length<1){
$1=null
};var $2=this.immediateparent;this.setAttribute("x",$2.width/2-this.width/2)
},"__LZalignRight",function($1){
if(arguments.length<1){
$1=null
};var $2=this.immediateparent;this.setAttribute("x",$2.width-this.width)
},"setXOffset",function($1){
this.__LZhasoffset=$1!=0;this.xoffset=$1;this.setX(this.x,true);this.setY(this.y,true);if(this.onxoffset.ready){
this.onxoffset.sendEvent($1)
}},"setYOffset",function($1){
this.__LZhasoffset=$1!=0;this.yoffset=$1;this.setX(this.x,true);this.setY(this.y,true);if(this.onyoffset.ready){
this.onyoffset.sendEvent($1)
}},"getBounds",function(){
var $1=[-this.xoffset,-this.yoffset,this.width-this.xoffset,-this.yoffset,-this.xoffset,this.height-this.yoffset,this.width-this.xoffset,this.height-this.yoffset,this.rotation,this.x,this.y];var $2=$1.length-1;while($1[$2]==LzView.__LZlastmtrix[$2]){
if($2--==0){
return this.__LZstoredbounds
}};var $3={};for(var $2=0;$2<8;$2+=2){
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
},"setValign",function(valign){
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
this.setAttribute("y",0)
};this.valign=valign
},"__LZvalignMiddle",function($1){
if(arguments.length<1){
$1=null
};var $2=this.immediateparent;this.setAttribute("y",$2.height/2-this.height/2)
},"__LZvalignBottom",function($1){
if(arguments.length<1){
$1=null
};var $2=this.immediateparent;this.setAttribute("y",$2.height-this.height)
},"setColor",function($1){
this.sprite.setColor($1);this.fgcolor=$1
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

}},"getWidth",function(){
return this.width
},"getHeight",function(){
return this.height
},"__LZcheckSize",function($1,$2,$3){
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
var $4=this.subviews[$3];var $5=$4[$1=="width"?"x":"y"]+$4[$1];if($4.visible&&$5>$2){
$2=$5
}};return $2
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
if(arguments.length<1){
$1=null
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
$3.update($1);this.setAttribute($1,($4-$3.offset[$1])/$3.scale[$1])
}else{
if($1=="width"||$1=="height"){
var $5=$1=="width"?"x":"y";$3.update($5);this.setAttribute($1,$4/$3.scale[$5])
}else{

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
if(this.__movecounter!=LzGlobalMouse.__movecounter||this.__mousecache==null){
this.__movecounter=LzGlobalMouse.__movecounter;this.__mousecache=this.sprite.getMouse($1)
};if($1==null){
return this.__mousecache
};return this.__mousecache[$1]
},"$lzc$getMouse_dependencies",function(){
var $1=new Array();for(var $2=0;$2<arguments.length;$2++){
$1.push(arguments[$2])
};return [LzIdle,"idle"]
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
this.__lzcheckframe=$1;this.frame=$1;this.stop($1);if(this.onframe.ready){
this.onframe.sendEvent($1)
}},"stretchResource",function($1){
this.$lzc$set_stretches($1)
},"$lzc$set_stretches",function($1){
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
}},"setBGColor",function($1){
this.sprite.setBGColor($1);if($1!=null){
this.bgcolor=Number($1)
};if(this.onbgcolor.ready){
this.onbgcolor.sendEvent($1)
}},"setSource",function($1,$2,$3){
if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};this.sprite.setSource($1,$2,$3)
},"unload",function(){
this._resource=null;this.sprite.unload()
},"makeMasked",function(){
this.sprite.setClip(true);this.masked=true;this.mask=this
},"removeMask",function(){
this.sprite.setClip(false);this.masked=false;this.mask=null
},"__LZsetClickRegion",function($1){
this.sprite.__LZsetClickRegion($1)
},"setClickable",function($1){
this.sprite.setClickable($1);this.clickable=$1;if(this.onclickable.ready){
this.onclickable.sendEvent($1)
}},"setCursor",function($1){
this.sprite.setCursor($1)
},"setPlay",function($1){
if($1){
this.play()
}else{
this.stop()
}},"getMCRef",function(){
return this.sprite.getMCRef()
},"play",function($1,$2){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};this.sprite.play($1,$2)
},"stop",function($1,$2){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};this.sprite.stop($1,$2)
},"setVolume",function($1){
if(this.capabilities.audio){
this.sprite.setVolume($1)
}else{

}},"getVolume",function(){
if(this.capabilities.audio){
return this.sprite.getVolume()
}else{

}},"setPan",function($1){
if(this.capabilities.audio){
this.sprite.setPan($1)
}else{

}},"getPan",function(){
if(this.capabilities.audio){
return this.sprite.getPan()
}else{

}},"getZ",function(){
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
}},"__LZdidPPwarn",false,"getPlayPerc",function(){
return this.frame/this.totalframes
},"$lzc$getPlayPerc_dependencies",function($1,$2){
return [$2,"frame"]
},"setShowHandCursor",function($1){
this.sprite.setShowHandCursor($1)
},"setAccessible",function($1){
if(this.capabilities.accessibility){
this.sprite.setAccessible($1)
}else{

}},"setAAActive",function($1){
if(this.capabilities.accessibility){
this.sprite.setAAActive($1)
}else{

}},"setAAName",function($1){
if(this.capabilities.accessibility){
this.sprite.setAAName($1)
}else{

}},"setAADescription",function($1){
if(this.capabilities.accessibility){
this.sprite.setAADescription($1)
}else{

}},"setAATabIndex",function($1){
if(this.capabilities.accessibility){
this.sprite.setAATabIndex($1)
}else{

}},"setAASilent",function($1){
if(this.capabilities.accessibility){
this.sprite.setAASilent($1)
}else{

}},"shouldYieldFocus",function(){
return true
},"blurring",false,"setContextMenu",function($1){
this.sprite.setContextMenu($1)
},"getContextMenu",function(){
return this.sprite.getContextMenu()
},"__warnCapability",function($1){
Debug.warn("The %s runtime does not support %s",canvas["runtime"],$1)
},"getNextSelection",function(){

},"getPrevSelection",function(){

},"cachebitmap",false,"$lzc$set_cachebitmap",function($1){
if($1!=this.cachebitmap){
this.cachebitmap=$1;if(this.capabilities.bitmapcaching){
this.sprite.setBitmapCache($1)
}else{

}}}],["tagname","view","attributes",new LzInheritedHash(LzNode.attributes),"__LZdelayedSetters",new LzInheritedHash(LzNode.__LZdelayedSetters),"earlySetters",new LzInheritedHash(LzNode.earlySetters),"__LZlastmtrix",[0,0,0,0,0,0,0,0,0,0,0],"__LZproxypolicies",[],"__LZcheckProxyPolicy",function($1){
var $2=LzView.__LZproxypolicies;for(var $3=$2.length-1;$3>=0;$3--){
var $4=$2[$3]($1);if($4!=null){
return $4
}};return canvas.proxied
},"addProxyPolicy",function($1){
LzView.__LZproxypolicies.push($1)
},"removeProxyPolicy",function($1){
var $2=LzView.__LZproxypolicies;for(var $3=0;$3<$2.length;$3++){
if($2[$3]==$1){
LzView.__LZproxypolicies=$2.splice($3,1);return true
}};return false
}]);(function(){
with(LzView){
with(LzView.prototype){
LzView.__LZdelayedSetters.layout="$lzc$set_layout";LzView.earlySetters.clickregion=7;LzView.earlySetters.stretches=8
}}})();ConstructorMap[LzView.tagname]=LzView;LzText=Class.make("LzText",[LzFormatter,LzView],["maxlines",1,"selectable",false,"antiAliasType","advanced","$lzc$set_antiAliasType",function($1){
this.setAntiAliasType($1)
},"gridFit","subpixel","$lzc$set_gridFit",function($1){
this.setGridFit($1)
},"sharpness",0,"$lzc$set_sharpness",function($1){
this.setSharpness($1)
},"thickness",0,"$lzc$set_thickness",function($1){
this.setThickness($1)
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"sizeToHeight",void 0,"yscroll",void 0,"xscroll",void 0,"scrollheight",void 0,"ontext",LzDeclaredEvent,"onmaxlength",LzDeclaredEvent,"onpattern",LzDeclaredEvent,"onscroll",LzDeclaredEvent,"onmaxscroll",LzDeclaredEvent,"onhscroll",LzDeclaredEvent,"onmaxhscroll",LzDeclaredEvent,"scroll",0,"maxscroll",0,"hscroll",0,"maxhscroll",0,"getDefaultWidth",function(){
return 0
},"multiline",void 0,"resize",true,"text",void 0,"colorstring","#000000","init",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).apply(this,arguments);if(this.sizeToHeight){
var $1=this.sprite;var $2=$1.getTextfieldHeight();if($2>0){
this.setHeight($2)
}}},"construct",function($1,$2){
this.multiline=("multiline" in $2)?$2.multiline:null;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.sizeToHeight=false;this.fontname=("font" in $2)?$2.font:this.searchParents("fontname").fontname;this.fontsize=("fontsize" in $2)?$2.fontsize:this.searchParents("fontsize").fontsize;this.fontstyle=("fontstyle" in $2)?$2.fontstyle:this.searchParents("fontstyle").fontstyle;$2.font=this.fontname;$2.fontsize=this.fontsize;$2.fontstyle=this.fontstyle;var $3=this.sprite;$3.__initTextProperties($2);$2.font=LzNode._ignoreAttribute;$2.fontsize=LzNode._ignoreAttribute;$2.fontstyle=LzNode._ignoreAttribute;this.yscroll=0;this.xscroll=0;this.resize=("resize" in $2)?$2.resize==true:this.resize;this.setResize(this.resize);if(("maxlength" in $2)&&$2.maxlength!=null){
this.setMaxLength($2.maxlength)
};this.text=!("text" in $2)||$2.text==null||$2.text instanceof LzInitExpr?"":$2.text;if(this.maxlength!=null&&this.text.length>this.maxlength){
this.text=this.text.substring(0,this.maxlength)
};this.setMultiline(this.multiline);$3.setText(this.text);if($2.width==null){
if(this.multiline){
$2.width=this.parent.width
}else{
if(this.text!=null&&this.text!=""&&this.text.length>0){
$2.width=this.getTextWidth()
}else{
$2.width=this.getDefaultWidth()
}}}else{
this.setResize(false)
};if(!this.hassetheight){
this.sizeToHeight=true
}else{
this.setHeight($2.height)
};this.scrollheight=this.height;if(("pattern" in $2)&&$2.pattern!=null){
this.setPattern($2.pattern)
};if(this.capabilities.advancedfonts){
if((!"antiAliasType" in $2)&&$2.antiAliasType==null){
this.setAntiAliasType("advanced")
};if((!"gridFit" in $2)&&$2.gridFit==null){
this.setGridFit("subpixel")
}}},"__makeSprite",function($1){
this.sprite=new LzTextSprite(this,$1)
},"getMCRef",function(){
var $1=this.sprite;return $1.getMCRef()
},"$lzc$set_text",function($1){
this.setText($1)
},"$lzc$set_resize",function($1){
this.setResize($1)
},"$lzc$set_multiline",-1,"$lzc$set_yscroll",function($1){
this.setYScroll($1)
},"$lzc$set_xscroll",function($1){
this.setXScroll($1)
},"$lzc$set_selectable",function($1){
this.setSelectable($1)
},"maxlength",void 0,"$lzc$set_maxlength",function($1){
this.setMaxLength($1)
},"pattern",void 0,"$lzc$set_pattern",function($1){
this.setPattern($1)
},"setResize",function($1){
var $2=this.sprite;$2.setResize($1);this.resize=$1
},"setWidth",function($1){
var $2=this.sprite;$2.setWidth($1);(arguments.callee.superclass?arguments.callee.superclass.prototype["setWidth"]:this.nextMethod(arguments.callee,"setWidth")).apply(this,arguments);if(this.sizeToHeight){
var $3=$2.getTextfieldHeight();if($3>0){
this.setHeight($3)
}}},"addText",function($1){
this.setText(this.getText()+$1)
},"clearText",function(){
this.setText("")
},"setMaxLength",function($1){
if($1==null||$1==""){
return
};var $2=this.sprite;$2.setMaxLength($1);this.maxlength=$1;if(this.onmaxlength.ready){
this.onmaxlength.sendEvent($1)
};var $3=this.getText();if($3&&$3.length>this.maxlength){
this.setText($3,true)
}},"setPattern",function($1){
if($1==null||$1==""){
return
};var $2=this.sprite;$2.setPattern($1);this.pattern=$1;if(this.onpattern.ready){
this.onpattern.sendEvent($1)
}},"getTextWidth",function(){
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
this.setText($1)
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
var $2=this.sprite;$2.setXScroll($1);this.xscroll=$1;this.onxscroll.sendEvent($1)
},"setYScroll",function($1){
var $2=this.sprite;$2.setYScroll($1);this.yscroll=$1;this.onyscroll.sendEvent($1)
},"$lzc$set_font",function($1){
this.setFontName($1)
},"$lzc$set_fontsize",function($1){
this.setFontSize($1)
},"$lzc$set_fontstyle",function($1){
this.setFontStyle($1)
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
},"setText",function($1,$2){
if(arguments.length<2){
$2=null
};$1=""+$1;if($2!=true&&$1==this.text){
return
};var $3=this.sprite;if(this.visible){
$3.setVisible(this.visible)
};if(this.maxlength!=null&&$1.length>this.maxlength){
$1=$1.substring(0,this.maxlength)
};$3.setText($1);this.text=$1;if(this.width==0||this.resize&&this.multiline==false){
var $4=this.getTextWidth();if($4!=this.width){
this.setWidth($4)
}};if(this.sizeToHeight){
var $5=$3.getTextfieldHeight();if($5>0){
this.setHeight($5)
}};if(this.ontext.ready){
this.ontext.sendEvent($1)
}},"format",function($1){
var $2=new Array();for(var $3=1;$3<arguments.length;$3++){
$2.push(arguments[$3])
};this.setText(this.formatToString.apply(this,[$1].concat($2)))
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
this.selectable=$1;var $2=this.sprite;$2.setSelectable($1)
},"setFontName",function($1,$2){
if(arguments.length<2){
$2=null
};var $3=this.sprite;$3.setFontName($1);this.fontname=$1;this.setText(this.getText(),true)
},"setFontSize",function($1){
var $2=this.sprite;$2.setFontSize($1);this.fontsize=$1;this.setText(this.getText(),true)
},"setFontStyle",function($1){
var $2=this.sprite;$2.setFontStyle($1);this.fontstyle=$1
},"setMultiline",function($1){
var $2=this.sprite;$2.setMultiline($1);this.multiline=$1==true
},"setBorder",function($1){
var $2=this.sprite;$2.setBorder($1)
},"setWordWrap",function($1){
var $2=this.sprite;$2.setWordWrap($1)
},"setEmbedFonts",function($1){
var $2=this.sprite;$2.setEmbedFonts($1)
},"setAntiAliasType",function($1){
if(this.capabilities.advancedfonts){
if($1=="normal"||$1=="advanced"){
this.antiAliasType=$1;var $2=this.sprite;$2.setAntiAliasType($1)
}else{

}}else{

}},"getAntiAliasType",function(){
if(this.capabilities.advancedfonts){
return this.antiAliasType
}else{

}},"setGridFit",function($1){
if(this.capabilities.advancedfonts){
if($1=="none"||$1=="pixel"||$1=="subpixel"){
this.gridFit=$1;var $2=this.sprite;$2.setGridFit($1)
}else{

}}else{

}},"getGridFit",function(){
if(this.capabilities.advancedfonts){
return this.gridFit
}else{

}},"setSharpness",function($1){
if(this.capabilities.advancedfonts){
if($1>=-400&&$1<=400){
this.sharpness=$1;var $2=this.sprite;$2.setSharpness($1)
}else{

}}else{

}},"getSharpness",function(){
if(this.capabilities.advancedfonts){
return this.sharpness
}else{

}},"setThickness",function($1){
if(this.capabilities.advancedfonts){
if($1>=-200&&$1<=200){
this.thickness=$1;var $2=this.sprite;$2.setThickness($1)
}else{

}}else{

}},"getThickness",function(){
if(this.capabilities.advancedfonts){
return this.thickness
}else{

}},"setHScroll",function($1){
var $2=this.sprite;$2.setHScroll($1)
},"setSelection",function($1,$2){
var $3=this.sprite;$3.setSelection($1,$2)
},"getSelectionPosition",function(){
var $1=this.sprite;return $1.getSelectionPosition()
},"getSelectionSize",function(){
var $1=this.sprite;return $1.getSelectionSize()
}],["tagname","text","attributes",new LzInheritedHash(LzView.attributes),"escapeChars",{">":"&gt;","<":"&lt;"}]);(function(){
with(LzText){
with(LzText.prototype){
LzText.attributes.pixellock=true;LzText.attributes.selectable=false;LzText.attributes.clip=true
}}})();ConstructorMap[LzText.tagname]=LzText;LzInputText=Class.make("LzInputText",LzText,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"password",void 0,"onenabled",LzDeclaredEvent,"onselect",LzDeclaredEvent,"getDefaultWidth",function(){
return 100
},"_onfocusDel",null,"_onblurDel",null,"_modemanagerDel",null,"construct",function($1,$2){
this.password=("password" in $2)&&$2.password?true:false;this.focusable=true;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this._onfocusDel=new LzDelegate(this,"_gotFocusEvent",this,"onfocus");this._onblurDel=new LzDelegate(this,"_gotBlurEvent",this,"onblur");this._modemanagerDel=new LzDelegate(this,"_modechanged",LzModeManager,"onmode")
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
if(arguments.length<1){
$1=null
};this._focused=true;var $2=this.sprite;$2.gotFocus()
},"_gotBlurEvent",function($1){
if(arguments.length<1){
$1=null
};this._focused=false;var $2=this.sprite;$2.gotBlur()
},"inputtextevent",function($1,$2){
if(arguments.length<2){
$2=null
};if($1=="onfocus"&&this._focused){
return
};if($1=="onblur"&&!this._focused){
return
};if($1=="onfocus"||$1=="onmousedown"){
this._focused=true;if(LzFocus.getFocus()!=this){
var $3=LzKeys.isKeyDown("tab");LzFocus.setFocus(this,$3);return
}}else{
if($1=="onchange"){
var $4=this.sprite;if(this.multiline&&this.sizeToHeight&&this.height!=$4.getTextHeight()){
this.setHeight($4.getTextfieldHeight())
};if(this.ontext.ready){
this.ontext.sendEvent($2)
};return
}else{
if($1=="onblur"){
this._focused=false
}}};if(this[$1].ready){
this[$1].sendEvent($2)
}},"updateData",function(){
var $1=this.sprite;return $1.getText()
},"enabled",true,"setEnabled",function($1){
this.setAttribute("focusable",$1);this.enabled=$1;var $2=this.sprite;$2.setEnabled($1);if(this.onenabled.ready){
this.onenabled.sendEvent($1)
}},"$lzc$set_enabled",function($1){
this.setEnabled($1)
},"setHTML",function($1){
if(this.capabilities["htmlinputtext"]){
var $2=this.sprite;$2.setHTML($1)
}else{

}},"setText",function($1,$2){
if(arguments.length<2){
$2=null
};$1+="";if(this.maxlength!=null&&$1.length>this.maxlength){
$1=$1.substring(0,this.maxlength)
};this.sprite.setText($1);this.text=$1;if(this.height<9||this.sizeToHeight){
this.height=this.sprite.getTextfieldHeight();if(this.onheight.ready){
this.onheight.sendEvent()
};if(this.height>0){
this.setHeight(this.height)
}};if(this.ontext.ready){
this.ontext.sendEvent($1)
}},"getText",function(){
return this.sprite.getText()
},"_allowselectable",true,"_selectable",void 0,"_modechanged",function($1){
if(!$1){
this._setallowselectable(true)
}else{
if($1.nodeLevel>this.nodeLevel){
this._setallowselectable(false)
}else{
var $2=this;do{
$2=$2.parent
}while($2!=canvas&&$2!=$1);this._setallowselectable($2!=canvas)
}}},"_setallowselectable",function($1){
this._allowselectable=$1;this.setSelectable(this._selectable)
},"setSelectable",function($1){
this._selectable=$1;(arguments.callee.superclass?arguments.callee.superclass.prototype["setSelectable"]:this.nextMethod(arguments.callee,"setSelectable")).call(this,this._allowselectable?$1:false)
}],["tagname","inputtext","attributes",new LzInheritedHash(LzText.attributes)]);(function(){
with(LzInputText){
with(LzInputText.prototype){
LzNode.mergeAttributes({selectable:true,enabled:true},LzInputText.attributes)
}}})();ConstructorMap[LzInputText.tagname]=LzInputText;LzViewLinkage=Class.make("LzViewLinkage",null,["scale",1,"offset",0,"uplinkArray",null,"downlinkArray",null,"$lzsc$initialize",function($1,$2){
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
}],null);LzCanvas=Class.make("LzCanvas",LzView,["updatePercentCreatedEnabled",true,"resourcetable",void 0,"_lzinitialsubviews",[],"totalnodes",void 0,"framerate",void 0,"creatednodes",void 0,"__LZproxied",void 0,"embedfonts",void 0,"lpsbuild",void 0,"lpsbuilddate",void 0,"runtime",void 0,"__LZmouseupDel",void 0,"__LZmousedownDel",void 0,"__LZmousemoveDel",void 0,"$lzsc$initialize",function($1){
if(arguments.length<1){
$1=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,null,$1)
},"construct",function($1,$2){
var $3;this.__makeSprite($2);$3=LzSprite.prototype.capabilities;this.datapath={};this.immediateparent=this;this.mask=null;if("accessible" in $2){
this.sprite.setAccessible($2.accessible)
};this.viewLevel=0;this.resourcetable={};this.totalnodes=0;this.creatednodes=0;this.percentcreated=0;this.framerate=30;if(typeof $2.proxied=="undefined"||$2.proxied==null){
var $4=$2.__LZproxied=="true";if(LzBrowser.getInitArg("lzproxied")!=null){
$4=LzBrowser.getInitArg("lzproxied")=="true"
};this.proxied=$4
}else{
this.proxied=$2.proxied==true
};delete $2.proxied;if($3.readcanvassizefromsprite==true){
if(this.sprite.width){
$2.width=this.sprite.width
};if(this.sprite.height){
$2.height=this.sprite.height
};if(this.sprite.bgcolor){
$2.bgcolor=this.sprite.bgcolor
}};this.__canvaswidthratio=null;this.width=Number($2.width);if(isNaN(this.width)){
if($2.width.charAt($2.width.length-1)=="%"){
var $5=Number($2.width.substr(0,$2.width.length-1));this.__canvaswidthratio=$5/100;if($3.scalecanvastopercentage!=true){
this.__canvaswidthratio=1
}}else{
this.width=400
}};delete $2.width;this.__canvasheightratio=null;this.height=Number($2.height);if(isNaN(this.height)){
if($2.height.charAt($2.height.length-1)=="%"){
var $5=Number($2.height.substr(0,$2.height.length-1));this.__canvasheightratio=$5/100;if($3.scalecanvastopercentage!=true){
this.__canvasheightratio=1
}}else{
this.height=400
}};delete $2.height;if(this.__canvasheightratio!=null||this.__canvaswidthratio!=null){
LzScreenKernel.setCallback(this,"__windowResize")
};if($3.readcanvassizefromsprite==true){
this.bgcolor=LzUtils.hextoint($2.bgcolor)
}else{
this.bgcolor=$2.bgcolor
};delete $2.bgcolor;this.lpsversion=$2.lpsversion+"."+this.__LZlfcversion;delete $2.lpsversion;this.__LZdelayedSetters=LzView.__LZdelayedSetters;this.earlySetters=LzView.earlySetters;if(!(("version" in this)&&this.version)){
this.version=this.lpsversion
};this.isinited=false;this._lzinitialsubviews=[];this.datasets={};global.canvas=this;this.parent=this;this.makeMasked();this.__LZmouseupDel=new LzDelegate(this,"__LZmouseup",LzGlobalMouse,"onmouseup");this.__LZmousedownDel=new LzDelegate(this,"__LZmousedown",LzGlobalMouse,"onmousedown");this.__LZmousemoveDel=new LzDelegate(this,"__LZmousemove",LzGlobalMouse,"onmousemove");LzPlatform.initCanvas(this);this.id=LzBrowser.getInitArg("id")
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
this.sprite=new LzSprite(this,true,$1)
},"onpercentcreated",LzDeclaredEvent,"onmousemove",LzDeclaredEvent,"onafterinit",LzDeclaredEvent,"lpsversion",void 0,"lpsrelease",void 0,"version",void 0,"__LZlfcversion","0","proxied",true,"dataloadtimeout",30000,"medialoadtimeout",30000,"percentcreated",void 0,"datasets",void 0,"compareVersion",function($1,$2){
if(arguments.length<2){
$2=null
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
},"setResource",function($1){
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
}};this._lzinitialsubviews=[];LzInstantiator.requestInstantiation(this,$1)
},"init",function(){

},"deferInit",true,"__LZinstantiationDone",function(){
if(this.deferInit){
this.deferInit=false;return
};this.percentcreated=1;this.updatePercentCreatedEnabled=false;if(this.onpercentcreated.ready){
this.onpercentcreated.sendEvent(this.percentcreated)
};LzInstantiator.resume();this.__LZcallInit()
},"updatePercentCreated",function(){
this.percentcreated=Math.max(this.percentcreated,this.creatednodes/this.totalnodes);this.percentcreated=Math.min(0.99,this.percentcreated);if(this.onpercentcreated.ready){
this.onpercentcreated.sendEvent(this.percentcreated)
}},"initiatorAddNode",function($1,$2){
this.totalnodes+=$2;this._lzinitialsubviews.push($1)
},"__LZcallInit",function($1){
if(arguments.length<1){
$1=null
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
}}}}};this.init();this.sprite.init(true);if(this.oninit.ready){
this.oninit.sendEvent(this)
};if(this.onafterinit.ready){
this.onafterinit.sendEvent(this)
};if(this.datapath&&this.datapath.__LZApplyDataOnInit){
this.datapath.__LZApplyDataOnInit()
}},"setWidth",function($1){

},"isProxied",function(){
return this.proxied
},"setX",function($1,$2){
if(arguments.length<2){
$2=null
}},"setHeight",function($1){

},"setY",function($1,$2){
if(arguments.length<2){
$2=null
}},"setDefaultContextMenu",function($1){
this.setContextMenu($1);this.sprite.setDefaultContextMenu($1)
},"__windowResize",function($1){
if(this.__canvaswidthratio!=null){
this.width=Math.floor($1.width*this.__canvaswidthratio);if(this.onwidth.ready){
this.onwidth.sendEvent(this.width)
};this.sprite.setWidth(this.width)
};if(this.__canvasheightratio!=null){
this.height=Math.floor($1.height*this.__canvasheightratio);if(this.onheight.ready){
this.onheight.sendEvent(this.height)
};this.sprite.setHeight(this.height)
}}],["tagname","canvas","attributes",new LzInheritedHash(LzView.attributes),"versionInfoString",function(){
return "URL: "+LzBrowser.getLoadURL()+"\n"+"Version: "+canvas.lpsversion+"\n"+"Release: "+canvas.lpsrelease+"\n"+"Build: "+canvas.lpsbuild+"\n"+"Date: "+canvas.lpsbuilddate+"\n"+"Target: "+canvas.runtime+"\n"+"Runtime: "+LzBrowser.getVersion()+"\n"
}]);(function(){
with(LzCanvas){
with(LzCanvas.prototype){
prototype.__LZcheckwidth=null;prototype.__LZcheckheight=null;prototype.hassetwidth=true;prototype.hassetheight=true
}}})();ConstructorMap[LzCanvas.tagname]=LzCanvas;LzPlatformService=Class.make("LzPlatformService",LzEventable,["initCanvas",function($1){
LzPlatform.buildDefaultMenu($1)
},"__LZdefaultMenuItemHandler",function($1,$2){
LzBrowser.loadURL("http://www.openlaszlo.org","lz_about")
},"__LZviewSourceMenuItemHandler",function($1,$2){
var $3=LzBrowser.getBaseURL();if(canvas.proxied){
$3=$3.toString()+"?lzt=source"
}else{
$3=$3.toString()+".zip"
};LzBrowser.loadURL($3,"lz_source")
},"buildDefaultMenu",function($1){
$1.__LZDefaultCanvasMenu=new LzContextMenu();$1.__LZdefaultMenuItem=new LzContextMenuItem("About OpenLaszlo...",new LzDelegate(LzPlatform,"__LZdefaultMenuItemHandler"));$1.__LZviewSourceMenuItem=new LzContextMenuItem("View Source",new LzDelegate(LzPlatform,"__LZviewSourceMenuItemHandler"));$1.__LZDefaultCanvasMenu.hideBuiltInItems();$1.__LZDefaultCanvasMenu.addItem($1.__LZdefaultMenuItem);if($1.proxied){
$1.__LZDefaultCanvasMenu.addItem($1.__LZviewSourceMenuItem)
};if($1.__LZDefaultCanvasMenu){
$1.setDefaultContextMenu($1.__LZDefaultCanvasMenu)
}}],null);var LzPlatform=new LzPlatformService();LzScript=Class.make("LzScript",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4);$2.script()
}],["tagname","script","attributes",new LzInheritedHash(LzNode.attributes)]);ConstructorMap[LzScript.tagname]=LzScript;LzAnimatorGroup=Class.make("LzAnimatorGroup",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"attribute",void 0,"updateDel",void 0,"crepeat",void 0,"startTime",void 0,"__LZpauseTime",void 0,"actAnim",void 0,"start",true,"from",void 0,"to",void 0,"duration",void 0,"indirect",false,"relative",false,"motion","easeboth","repeat",void 0,"paused",false,"$lzc$set_paused",function($1){
this.pause($1)
},"started",void 0,"target",void 0,"process","sequential","isactive",false,"ontarget",LzDeclaredEvent,"onduration",LzDeclaredEvent,"onstarted",LzDeclaredEvent,"onstart",LzDeclaredEvent,"onpaused",LzDeclaredEvent,"onfinish",LzDeclaredEvent,"onstop",LzDeclaredEvent,"onrepeat",LzDeclaredEvent,"animatorProps",{attribute:true,from:true,duration:true,to:true,relative:true,target:true},"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);if(LzAnimatorGroup["$lzsc$isa"]?LzAnimatorGroup.$lzsc$isa(this.immediateparent):this.immediateparent instanceof LzAnimatorGroup){
for(var $3 in this.animatorProps){
if($2[$3]==null){
$2[$3]=this.immediateparent[$3]
}};if(this.immediateparent.animators==null){
this.immediateparent.animators=[this]
}else{
this.immediateparent.animators.push(this)
};$2.start=LzNode._ignoreAttribute
}else{
this.target=this.immediateparent
};if(!this.updateDel){
this.updateDel=new LzDelegate(this,"update")
}},"init",function(){
if(!this.target){
this.target=this.immediateparent
};if(this.started){
this.doStart()
};(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).apply(this,arguments)
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
};this.isactive=true;this.crepeat=this.repeat;this.prepareStart();this.updateDel.register(LzIdle,"onidle");return true
},"prepareStart",function(){
for(var $1=this.animators.length-1;$1>=0;$1--){
this.animators[$1].notstarted=true
};this.actAnim=this.animators.concat()
},"resetAnimator",function(){
this.actAnim=this.animators.concat();for(var $1=this.animators.length-1;$1>=0;$1--){
this.animators[$1].needsrestart=true
}},"update",function($1){
var $2=this.actAnim.length-1;if($2>0&&this.process=="sequential"){
$2=0
};if(this.paused){
return
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
if(arguments.length<1){
$1=null
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
this.startTime+=$1;for(var $2=0;$2<this.actAnim.length;$2++){
this.actAnim[$2].__LZaddToStartTime($1)
}},"stop",function(){
if(this.actAnim){
var $1=this.actAnim.length-1;if($1>0&&this.process=="sequential"){
$1=0
};for(var $2=$1;$2>=0;$2--){
this.actAnim[$2].stop()
}};this.__LZhalt()
},"setDuration",function($1){
this.$lzc$set_duration($1)
},"$lzc$set_duration",function($1){
if(isNaN($1)||$1==null){
$1=0
}else{
if(typeof $1=="string"){
$1=Number($1)
}};this.duration=$1;if(!(function($1,$2){
return $2["$lzsc$isa"]?$2.$lzsc$isa($1):$1 instanceof $2
})(this,LzAnimator)){
var $2=this.subnodes;if($2){
for(var $3=0;$3<$2.length;++$3){
if(LzAnimatorGroup["$lzsc$isa"]?LzAnimatorGroup.$lzsc$isa($2[$3]):$2[$3] instanceof LzAnimatorGroup){
$2[$3].setDuration($1)
}}}};this.onduration.sendEvent($1)
},"__LZfinalizeAnim",function(){
this.__LZhalt()
},"__LZhalt",function(){
this.isactive=false;this.updateDel.unregisterAll();if(this.onfinish.ready){
this.onfinish.sendEvent(this)
};if(this.onstop.ready){
this.onstop.sendEvent(new Date().getTime())
}},"checkRepeat",function(){
if(this.crepeat==null||this.crepeat==1){
this.__LZfinalizeAnim();return true
};if(this.crepeat>0){
this.crepeat--;if(this.onrepeat.ready){
this.onrepeat.sendEvent(new Date().getTime())
}};this.resetAnimator()
},"destroy",function(){
this.stop();this.updateDel.unregisterAll();this.animators=null;this.actAnim=null;if(this.parent.animators&&this.parent.animators.length){
for(var $1=0;$1<this.parent.animators.length;$1++){
if(this.parent.animators[$1]==this){
this.parent.animators.splice($1,1);break
}};for(var $1=0;$1<LzAnimatorGroup(this.parent).actAnim.length;$1++){
if(LzAnimatorGroup(this.parent).actAnim[$1]==this){
LzAnimatorGroup(this.parent).actAnim.splice($1,1);break
}}};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this)
},"toString",function(){
if(this.animators){
return "Group of "+this.animators.length
};return "Empty group"
}],["tagname","animatorgroup","attributes",new LzInheritedHash(LzNode.attributes)]);(function(){
with(LzAnimatorGroup){
with(LzAnimatorGroup.prototype){
LzAnimatorGroup.attributes.start=true;LzAnimatorGroup.attributes.ignoreplacement=true
}}})();ConstructorMap[LzAnimatorGroup.tagname]=LzAnimatorGroup;LzAnimator=Class.make("LzAnimator",LzAnimatorGroup,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4);this.calcMethod=this.calcNextValue
},"calcMethod",void 0,"lastIterationTime",void 0,"currentValue",void 0,"doBegin",void 0,"beginPoleDelta",0.25,"endPoleDelta",0.25,"primary_K",void 0,"origto",void 0,"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.primary_K=1
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
if(arguments.length<1){
$1=null
};this.currentValue=$1||0;var $2=this.indirect?-1:1;if(this.currentValue<this.to){
this.beginPole=this.currentValue-$2*this.beginPoleDelta;this.endPole=this.to+$2*this.endPoleDelta
}else{
this.beginPole=this.currentValue+$2*this.beginPoleDelta;this.endPole=this.to-$2*this.endPoleDelta
};this.primary_K=1;var $3=1*(this.beginPole-this.to)*(this.currentValue-this.endPole);var $4=1*(this.beginPole-this.currentValue)*(this.to-this.endPole);if($4!=0){
this.primary_K=Math.abs($3/$4)
}},"doStart",function(){
if(this.isactive){
return
};this.isactive=true;this.prepareStart();this.updateDel.register(LzIdle,"onidle")
},"prepareStart",function(){
this.crepeat=this.repeat;if(this.from!=null){
this.target.setAttribute(this.attribute,Number(this.from))
};if(this.relative){
this.to=this.origto
}else{
this.to=this.origto-this.target.getExpectedAttribute(this.attribute)
};this.target.addToExpectedAttribute(this.attribute,this.to);this.target.__LZincrementCounter(this.attribute);this.currentValue=0;this.calcControlValues();this.doBegin=true
},"resetAnimator",function(){
if(this.from!=null){
this.target.setAttribute(this.attribute,this.from);var $1=this.from-this.target.getExpectedAttribute(this.attribute);this.target.addToExpectedAttribute(this.attribute,$1)
};if(!this.relative){
this.to=this.origto-this.target.getExpectedAttribute(this.attribute);this.calcControlValues()
};this.target.addToExpectedAttribute(this.attribute,this.to);this.target.__LZincrementCounter(this.attribute);this.currentValue=0;this.doBegin=true
},"beginAnimator",function($1){
this.startTime=$1;this.lastIterationTime=$1;if(this.onstart.ready){
this.onstart.sendEvent($1)
};this.doBegin=false
},"stop",function(){
if(!this.isactive){
return
};var $1="e_"+this.attribute;if(!this.target[$1].c){
this.target[$1].c=0
};this.target[$1].c--;if(this.target[$1].c<=0){
this.target[$1].c=0;this.target[$1].v=null
}else{
this.target[$1].v-=this.to-this.currentValue
};this.__LZhalt()
},"__LZfinalizeAnim",function(){
var $1="e_"+this.attribute;if(!this.target[$1].c){
this.target[$1].c=0
};this.target[$1].c-=1;if(this.target[$1].c<=0){
this.target[$1].c=0;this.target.setAttribute(this.attribute,this.target[$1].v);this.target[$1].v=null
};this.__LZhalt()
},"calcNextValue",function($1){
var $2=this.currentValue;var $3=this.endPole;var $4=this.beginPole;var $5=Math.exp($1*1/this.duration*Math.log(this.primary_K));if($5!=1){
var $6=$4*$3*(1-$5);var $7=$3-$5*$4;if($7!=0){
$2=$6/$7
}};return $2
},"calcNextValueLinear",function($1){
var $2=$1/this.duration;return $2*this.to
},"update",function($1){
var $2=false;if(this.doBegin){
this.beginAnimator($1)
}else{
if(!this.paused){
var $3=$1-this.startTime;if($3<this.duration){
this.setValue(this.calcMethod($3));this.lastIterationTime=$1
}else{
this.setValue(this.to);return this.checkRepeat()
}}}},"setValue",function($1){
var $2=$1-this.currentValue;if(this.target.setAttribute){
this.target.setAttribute(this.attribute,this.target[this.attribute]+$2)
};this.currentValue=$1
},"toString",function(){
return "Animator for "+this.target+" attribute:"+this.attribute+" to:"+this.to
}],["tagname","animator","attributes",new LzInheritedHash(LzAnimatorGroup.attributes)]);ConstructorMap[LzAnimator.tagname]=LzAnimator;LzLayout=Class.make("LzLayout",LzNode,["vip",null,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
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
if(arguments.length<1){
$1=null
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
if(arguments.length<1){
$1=null
};this.locked=false;this.reset()
},"__parentInit",function($1){
if(arguments.length<1){
$1=null
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
if(this.subviews[$3]==$2){
this.subviews.splice($3,1);break
}};if($1=="first"){
this.subviews.unshift($2)
}else{
if($1=="last"){
this.subviews.push($2)
}else{
for(var $3=this.subviews.length-1;$3>=0;$3--){
if(this.subviews[$3]==$1){
this.subviews.splice($3+1,0,$2);break
}}}};this.reset();return
},"swapSubviewOrder",function($1,$2){
var $3=-1;var $4=-1;for(var $5=this.subviews.length-1;$5>=0&&($3<0||$4<0);$5--){
if(this.subviews[$5]==$1){
$3=$5
}else{
if(this.subviews[$5]==$2){
$4=$5
}}};this.subviews[$4]=$1;this.subviews[$3]=$2;this.reset();return
},"__LZinsertAfter",function($1,$2){
for(var $3=this.subviews.length-1;$3>=0;$3--){
if(this.subviews[$3]==$2){
this.subviews.splice($3,0,$1)
}}},"update",function($1){
if(arguments.length<1){
$1=null
}},"toString",function(){
return "LzLayout for view "+this.immediateparent
}],["tagname","layout","attributes",new LzInheritedHash(LzNode.attributes)]);ConstructorMap[LzLayout.tagname]=LzLayout;LzFont=Class.make("LzFont",null,["style",void 0,"name",void 0,"height",void 0,"ascent",void 0,"descent",void 0,"advancetable",void 0,"lsbtable",void 0,"rsbtable",void 0,"fontobject",void 0,"$lzsc$initialize",function($1,$2,$3){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.name=$1.name;this.style=$3;this.fontobject=$1;$1[$3]=this;for(var $4 in $2){
if($4=="leading"){
continue
};this[$4]=$2[$4]
};this.height=this.ascent+this.descent;this.advancetable[13]=this.advancetable[32];this.advancetable[160]=0
},"leading",2,"toString",function(){
return "Font style "+this.style+" of name "+this.name
}],null);LzSelectionManager=Class.make("LzSelectionManager",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"sel","setSelected","selectedHash",void 0,"selected",void 0,"toggle",void 0,"lastRange",void 0,"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.toggle=$2.toggle==true;if($2.sel!=null){
this.sel=$2.sel
};this.selected=new Array();this.selectedHash=new Object();this.lastRange=null
},"select",function($1){
if(this.isSelected($1)&&(this.toggle||this.isMultiSelect())){
this.unselect($1);return
};if(this.selected.length>0&&this.isRangeSelect()){
var $2=this.lastRange!=null?this.lastRange:this.selected[0];if($2!=$1){
this.selectRange($2,$1)
};return
};if(!this.isMultiSelect()){
this.clearSelection()
};this.makeSelected($1)
},"isSelected",function($1){
return this.selectedHash[$1.getUID()]
},"makeSelected",function($1){
if(this.selectedHash[$1.getUID()]){
return
};this.selectedHash[$1.getUID()]=true;this.selected.push($1);$1[this.sel](true)
},"unselect",function($1){
for(var $2=this.selected.length-1;$2>=0;$2--){
if(this.selected[$2]==$1){
this.selectedHash[$1.getUID()]=false;$1[this.sel](false);this.selected.splice($2,1);break
}}},"clearSelection",function(){
var $1;while($1=this.selected.pop()){
$1[this.sel](false)
};this.selected=new Array();this.selectedHash=new Object();this.lastRange=null
},"getSelection",function(){
return this.selected
},"selectRange",function($1,$2){
var $3=$1.immediateparent;var $4=$3.subviews;var $5=null;var $6=null;for(var $7=0;$7<$4.length;$7++){
if($4[$7]==$1){
$5=$7
};if($4[$7]==$2){
$6=$7
};if(null!=$5&&null!=$6){
break
}};var $8=$5>$6?-1:1;this.clearSelection();this.lastRange=$1;for(var $7=$5;$7!=$6+$8;$7+=$8){
this.makeSelected($3.subviews[$7])
}},"isMultiSelect",function(){
return LzKeys.isKeyDown("control")
},"isRangeSelect",function(){
return LzKeys.isKeyDown("shift")
},"toString",function(){
return "LzSelectionManager"
}],["tagname","selectionmanager","attributes",new LzInheritedHash(LzNode.attributes)]);LzDataSelectionManager=Class.make("LzDataSelectionManager",LzSelectionManager,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"manager",void 0,"singleClone",void 0,"makeSelected",function($1){
var $2=$1.datapath.p;if(this.manager==null){
this.manager=$1.cloneManager
};if($2.sel){
return
};$2.sel=true;this.selected.push($2);$1.datapath[this.sel](true);if(this.manager==null){
this.singleClone=$1
}},"unselect",function($1){
if(this.manager==null){
this.manager=$1.cloneManager
};var $2=$1.datapath.p;$2.sel=false;for(var $3=this.selected.length-1;$3>=0;$3--){
if(this.selected[$3]==$2){
this.selected.splice($3,1);break
}};$1.datapath[this.sel](false);if($1==this.singleClone){
this.singleClone=null
}},"selectRange",function($1,$2){
if(this.manager==null){
this.manager=$2.cloneManager;if(this.manager==null){
return
}};var $3=this.manager.nodes;var $4=-1;var $5=-1;var $6=0;var $7=$2.datapath.p;while(($4==-1||$5==-1)&&$6<$3.length){
if($3[$6]==$1){
$4=$6
};if($3[$6]==$7){
$5=$6
};$6++
};var $8=$4>$5?-1:1;this.clearSelection();this.lastRange=$1;if($4==-1||$5==-1){
return
};for(var $6=$4;$6!=$5+$8;$6+=$8){
var $9=$3[$6];$9.sel=true;this.selected.push($9);this.__LZsetSelected($9,true)
}},"getSelection",function(){
var $1=[];for(var $2=0;$2<this.selected.length;$2++){
$1.push(new LzDatapointer(null,{pointer:this.selected[$2]}))
};return $1
},"clearSelection",function(){
while(this.selected.length){
var $1=this.selected.pop();$1.sel=false;this.__LZsetSelected($1,false)
};this.lastRange=null
},"isSelected",function($1){
if(this.manager==null){
this.manager=$1.cloneManager
};return $1.datapath.p.sel
},"__LZsetSelected",function($1,$2){
if(this.manager!=null){
var $3=this.manager.getCloneForNode($1,true);if($3){
$3.datapath[this.sel]($2)
}else{
$1.sel=$2
}}else{
if(!$2){
if(this.singleClone!=null&&this.singleClone.datapath.p==$1){
this.singleClone.datapath[this.sel](false);this.singleClone=null;return
}};$1.sel=$2
}}],["tagname","dataselectionmanager","attributes",new LzInheritedHash(LzSelectionManager.attributes)]);LzCommand=Class.make("LzCommand",LzNode,["active",true,"keys",null,"$lzc$set_key",function($1){
this.setKeys($1)
},"onselect",LzDeclaredEvent,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"setKeys",function($1){
this.keys=$1;LzKeys.callOnKeyCombo(this,$1)
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
}],["tagname","command","attributes",new LzInheritedHash(LzNode.attributes),"DisplayKeys",{control:"Ctrl",shift:"Shift",alt:"Alt"}]);ConstructorMap[LzCommand.tagname]=LzCommand;LzState=Class.make("LzState",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"__LZpool",[],"__LZstatedelegates",void 0,"onapply",LzDeclaredEvent,"onremove",LzDeclaredEvent,"applied",false,"$lzc$set_applied",function($1){
if($1){
if(this.isinited){
this.apply()
}else{
new LzDelegate(this,"apply",this,"oninit")
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
},"heldArgs",void 0,"handlerMethodNames",void 0,"releasedconstraints",void 0,"appliedChildren",void 0,"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.heldArgs={};this.handlerMethodNames={};this.appliedChildren=[]
},"createChildren",function($1){
this.subh=$1;this.__LZinstantiationDone()
},"setApply",function($1){
if(typeof $1=="function"){
this.addProperty("apply",$1);return
};$lzc$set_applied($1)
},"apply",function(){
if(this.applied){
return
};var $1=this.parent;this.applied=this.isapplied=true;var $2=$1._instanceAttrs;for(var $3 in this.heldArgs){
if($2&&(LzConstraintExpr["$lzsc$isa"]?LzConstraintExpr.$lzsc$isa($2[$3]):$2[$3] instanceof LzConstraintExpr)){
if(this.releasedconstraints==null){
this.releasedconstraints=[]
};var $4=$2[$3].methodName;if($1.releaseConstraintMethod($4)){
this.releasedconstraints.push($4)
}}};var $5=$1.__LZdelegates;$1.__LZdelegates=null;$1.__LZapplyArgs(this.heldArgs);if(this.subh){
var $6=this.subh.length
};$1.__LZsetPreventInit();for(var $7=0;$7<$6;$7++){
if(this.__LZpool&&this.__LZpool[$7]){
this.appliedChildren.push(this.__LZretach(this.__LZpool[$7]))
}else{
this.appliedChildren.push($1.makeChild(this.subh[$7],this.asyncnew))
}};$1.__LZclearPreventInit();$1.__LZresolveReferences();this.__LZstatedelegates=$1.__LZdelegates;$1.__LZdelegates=$5;if(this.onapply.ready){
this.onapply.sendEvent(this)
}},"remove",function(){
if(!this.applied){
return
};if(this.onremove.ready){
this.onremove.sendEvent(this)
};this.applied=this.isapplied=false;if(this.__LZstatedelegates){
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
if(arguments.length<2){
$2=null
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
var $6=$11[$12];var $14=$11[$12+1];var $9=$14.methodName;var $15=$9+this.__LZUID;if(Function["$lzsc$isa"]?Function.$lzsc$isa($4[$9]):$4[$9] instanceof Function){
$4[$15]=$4[$9];delete $4[$9]
}else{
if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$9]):this[$9] instanceof Function){
$4[$15]=this[$9]
}};if(LzAlwaysExpr["$lzsc$isa"]?LzAlwaysExpr.$lzsc$isa($14):$14 instanceof LzAlwaysExpr){
var $10=$14.dependenciesName;var $16=$10+this.__LZUID;if(Function["$lzsc$isa"]?Function.$lzsc$isa($4[$10]):$4[$10] instanceof Function){
$4[$16]=$4[$10];delete $4[$10]
}else{
if(Function["$lzsc$isa"]?Function.$lzsc$isa(this[$10]):this[$10] instanceof Function){
$4[$16]=this[$10]
}};$4[$6]=new ($14.constructor)($15,$16)
}else{
$4[$6]=new ($14.constructor)($15)
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
$1.setVisible(false);return $1
},"__LZretach",function($1){
$1.setVisible(true);return $1
}],["tagname","state","attributes",new LzInheritedHash(LzNode.attributes),"props",{apply:true},"events",{onremove:true,onapply:true}]);(function(){
with(LzState){
with(LzState.prototype){
prototype.$isstate=true
}}})();ConstructorMap[LzState.tagname]=LzState;LzDataNodeMixin=Trait.make("LzDataNodeMixin",null,["onownerDocument",LzDeclaredEvent,"nodeType",void 0,"parentNode",null,"ownerDocument",void 0,"__LZo",-1,"sel",false,"childNodes",null,"__LZcoDirty",true,"getPreviousSibling",function(){
if(!this.parentNode){
return null
};if(this.parentNode.__LZcoDirty){
this.parentNode.__LZupdateCO()
};return this.parentNode.childNodes[this.__LZo-1]
},"getParent",function(){
return this.parentNode
},"getOffset",function(){
if(!this.parentNode){
return 0
};if(this.parentNode.__LZcoDirty){
this.parentNode.__LZupdateCO()
};return this.__LZo
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
var $3=$2?this:this.parentNode;while($3){
if($3==$1){
return true
};$3=$3.parentNode
};return false
},"childOf",function($1,$2){
if(arguments.length<2){
$2=false
};return this.childOfNode($1,$2)
},"setOwnerDocument",function($1){
this.ownerDocument=$1;if(this.childNodes){
for(var $2=0;$2<this.childNodes.length;$2++){
this.childNodes[$2].setOwnerDocument($1)
}};if(this.onownerDocument&&this.onownerDocument.ready){
this.onownerDocument.sendEvent($1)
}},"__LZlockFromUpdate",function($1){
this.ownerDocument.__LZdoLock($1)
},"__LZunlockFromUpdate",function($1){
this.ownerDocument.__LZdoUnlock($1)
}],null);LzDataNode=Class.make("LzDataNode",LzEventable,["$lzsc$initialize",function($1,$2){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this)
},"toString",function(){
return "LzDataNode"
}],["ELEMENT_NODE",1,"TEXT_NODE",3,"DOCUMENT_NODE",9,"stringToLzData",function($1,$2,$3){
if(arguments.length<2){
$2=false
};if(arguments.length<3){
$3=false
};return LzDataElement.stringToLzData($1,$2,$3)
}]);LzDataElementMixin=Trait.make("LzDataElementMixin",null,["$lzc$set_attributes",function($1){
this.setAttrs($1)
},"$lzc$set_childNodes",function($1){
this.setChildNodes($1)
},"$lzc$set_nodeName",function($1){
this.setNodeName($1)
},"$lzc$set_ownerDocument",function($1){
this.setOwnerDocument($1)
},"onDocumentChange",LzDeclaredEvent,"onparentNode",LzDeclaredEvent,"onchildNode",LzDeclaredEvent,"onchildNodes",LzDeclaredEvent,"onattributes",LzDeclaredEvent,"onnodeName",LzDeclaredEvent,"__LZchangeQ",null,"__LZlocker",null,"nodeName",null,"attributes",null,"insertBefore",function($1,$2){
this.__LZcoDirty=true;for(var $3=0;$3<this.childNodes.length;$3++){
if(this.childNodes[$3]==$2){
this.childNodes.splice($3,0,$1);$1.setOwnerDocument(this.ownerDocument);$1.parentNode=this;if($1.onparentNode.ready){
$1.onparentNode.sendEvent(this)
};if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("insertBefore",this,0);return $1
}};return null
},"replaceChild",function($1,$2){
this.__LZcoDirty=true;for(var $3=0;$3<this.childNodes.length;$3++){
if(this.childNodes[$3]==$2){
this.childNodes[$3]=$1;$1.setOwnerDocument(this.ownerDocument);$1.parentNode=this;if($1.onparentNode.ready){
$1.onparentNode.sendEvent(this)
};if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("childNodes",this,0,$1);return $1
}};return null
},"removeChild",function($1){
var $2=null;this.__LZcoDirty=true;for(var $3=0;$3<this.childNodes.length;$3++){
if(this.childNodes[$3]==$1){
this.childNodes.splice($3,1);if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
};$2=$1;this.ownerDocument.handleDocumentChange("removeChild",this,0,$1)
}};return $2
},"appendChild",function($1){
if(this.childNodes){
this.childNodes.push($1)
}else{
this.childNodes=[$1]
};$1.setOwnerDocument(this.ownerDocument);$1.parentNode=this;if($1.onparentNode.ready){
$1.onparentNode.sendEvent(this)
};$1.__LZo=this.childNodes.length-1;if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
};this.ownerDocument.handleDocumentChange("appendChild",this,0,$1);return $1
},"hasChildNodes",function(){
return this.childNodes.length>0
},"cloneNode",function($1){
var $2=new LzDataElement(this.nodeName);$2.setAttrs(this.attributes);if($1){
for(var $3=0;$3<this.childNodes.length;$3++){
$2.appendChild(this.childNodes[$3].cloneNode(true))
}};return $2
},"getAttr",function($1){
if(this.attributes){
return this.attributes[$1]
}},"$lzc$getAttr_dependencies",function($1,$2){
return [$2,"attributes"]
},"setAttr",function($1,$2){
if(!this.attributes){
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
},"__LZupdateCO",function(){
for(var $1=0;$1<this.childNodes.length;$1++){
this.childNodes[$1].__LZo=$1
};this.__LZcoDirty=false
},"setAttrs",function($1){
var $2={};for(var $3 in $1){
$2[$3]=$1[$3]
};this.attributes=$2;if(this.onattributes.ready){
this.onattributes.sendEvent($2)
};if(this.ownerDocument){
this.ownerDocument.handleDocumentChange("attributes",this,1)
}},"setChildNodes",function($1){
this.childNodes=$1;for(var $2=0;$2<$1.length;$2++){
var $3=$1[$2];if($3){
$3.setOwnerDocument(this.ownerDocument);$3.parentNode=this;if($3.onparentNode){
if($3.onparentNode.ready){
$3.onparentNode.sendEvent(this)
}};$3.__LZo=$2
}};this.__LZcoDirty=false;if(this.onchildNodes){
if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
}};this.ownerDocument.handleDocumentChange("childNodes",this,0)
},"setNodeName",function($1){
this.nodeName=$1;if(this.onnodeName.ready){
this.onnodeName.sendEvent($1)
};if(this.parentNode){
if(this.parentNode.onchildNodes.ready){
this.parentNode.onchildNodes.sendEvent(this)
};if(this.parentNode.onchildNode.ready){
this.parentNode.onchildNode.sendEvent(this)
}};this.ownerDocument.handleDocumentChange("childNodeName",this.parentNode,0);this.ownerDocument.handleDocumentChange("nodeName",this,1)
},"__LZgetText",function($1){
if(arguments.length<1){
$1=null
};var $2="";for(var $3=0;$3<this.childNodes.length;$3++){
var $4=this.childNodes[$3];if($4.nodeType==LzDataElement.TEXT_NODE){
$2+=$4.data
}};return $2
},"getElementsByTagName",function($1){
var $2=[];for(var $3=0;$3<this.childNodes.length;$3++){
if(this.childNodes[$3].nodeName==$1){
$2.push(this.childNodes[$3])
}};return $2
},"__LZlt","<","__LZgt",">","serialize",function($1){
if(arguments.length<1){
$1=Infinity
};return this.serializeInternal($1)
},"serializeInternal",function($1){
if(arguments.length<1){
$1=Infinity
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
if(arguments.length<4){
$4=null
};var $5={who:$2,what:$1,type:$3};if($4){
$5.cobj=$4
};if(this.__LZchangeQ){
this.__LZchangeQ.push($5)
}else{
if(this.onDocumentChange.ready){
this.onDocumentChange.sendEvent($5)
}}},"toString",function(){
var $1=this.serialize();return $1
},"__LZdoLock",function($1){
if(!this.__LZchangeQ){
this.__LZchangeQ=[];this.__LZlocker=$1
}},"__LZdoUnlock",function($1){
if(this.__LZlocker!=$1){
return
};var $2=this.__LZchangeQ;this.__LZchangeQ=null;if($2!=null){
for(var $3=0;$3<$2.length;$3++){
var $4=true;var $5=$2[$3];for(var $6=0;$6<$3;$6++){
var $7=$2[$6];if($5.who==$7.who&&$5.what==$7.what&&$5.type==$7.type){
$4=false;break
}};if($4){
this.handleDocumentChange($5.what,$5.who,$5.type)
}}}}],null);LzDataElement=Class.make("LzDataElement",[LzDataElementMixin,LzDataNodeMixin,LzDataNode],["$lzsc$initialize",function($1,$2,$3){
if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$2,$3);this.nodeName=$1;this.nodeType=LzDataElement.ELEMENT_NODE;this.attributes=$2;this.ownerDocument=this;if($3==null){
this.setChildNodes([])
}else{
this.setChildNodes($3)
}}],["makeNodeList",function($1,$2){
var $3=[];for(var $4=0;$4<$1;$4++){
$3[$4]=new LzDataElement($2,{},null)
};return $3
},"valueToElement",function($1){
var $2=new LzDataElement("element",{},LzDataElement.__LZv2E($1));return $2
},"__LZv2E",function($1){
var $2=typeof $1;$2.toLowerCase();var $3=[];if($2=="object"){
if($1 instanceof LzDataElement||$1 instanceof LzDataText){
$3[0]=$1
}else{
if($1 instanceof Date){
$2="date"
}else{
if($1 instanceof Array){
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
};var $2=$1.length;var $3="";for(var $4=0;$4<$2;$4++){
var $5=$1.charCodeAt($4);if($5<32){
$3+="&#x"+LzUtils.dectohex($5,0)+";"
}else{
var $6=$1.charAt($4);if(LzDataElement.__LZescapechars[$6]!=null){
$3+=LzDataElement.__LZescapechars[$6]
}else{
$3+=$6
}}};return $3
},"stringToLzData",function($1,$2,$3){
if(arguments.length<2){
$2=false
};if(arguments.length<3){
$3=false
};if($1!=null&&$1!=""){
var $4=LzXMLParser.parseXML($1,$2,$3);var $5=LzXMLTranslator.copyXML($4,$2,$3);return $5
}else{
return null
}},"whitespaceChars",{" ":true,"\r":true,"\n":true,"\t":true},"trim",function($1){
var $2=LzDataElement.whitespaceChars;var $3=$1.length;var $4=0;var $5=$1.length-1;var $6;while($4<$3){
$6=$1.charAt($4);if($2[$6]!=true){
break
};$4++
};while($5>$4){
$6=$1.charAt($5);if($2[$6]!=true){
break
};$5--
};return $1.slice($4,$5+1)
}]);LzDataText=Class.make("LzDataText",[LzDataNodeMixin,LzDataNode],["$lzsc$initialize",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.nodeType=LzDataElement.TEXT_NODE;this.data=$1
},"onDocumentChange",LzDeclaredEvent,"onparentNode",LzDeclaredEvent,"onchildNode",LzDeclaredEvent,"onchildNodes",LzDeclaredEvent,"onattributes",LzDeclaredEvent,"onnodeName",LzDeclaredEvent,"ondata",LzDeclaredEvent,"nodeName","#text","data","","$lzc$set_data",function($1){
this.setData($1)
},"length",0,"setData",function($1){
this.data=$1;if(this.ondata&&this.ondata.ready){
this.ondata.sendEvent($1)
};if(this.ownerDocument){
this.ownerDocument.handleDocumentChange("data",this,1)
}},"cloneNode",function($1){
if(arguments.length<1){
$1=null
};var $2=new LzDataText(this.data);return $2
},"serialize",function($1){
if(arguments.length<1){
$1=null
};return LzDataElement.__LZXMLescape(this.data)
},"toString",function(){
return this.data
}],null);LzDataRequest=Class.make("LzDataRequest",LzNode,["requestor",null,"src",null,"timeout",Infinity,"status",null,"rawdata",null,"error",null,"onstatus",LzDeclaredEvent,"$lzsc$initialize",function($1){
if(arguments.length<1){
$1=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1);this.requestor=$1
}],["tagname","datarequest","attributes",new LzInheritedHash(LzNode.attributes),"SUCCESS","success","TIMEOUT","timeout","ERROR","error","READY","ready"]);ConstructorMap[LzDataRequest.tagname]=LzDataRequest;LzDataProvider=Class.make("LzDataProvider",LzNode,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"doRequest",function($1){

}],["tagname","dataprovider","attributes",new LzInheritedHash(LzNode.attributes)]);ConstructorMap[LzDataProvider.tagname]=LzDataProvider;LzHTTPDataProvider=Class.make("LzHTTPDataProvider",LzDataProvider,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"makeLoader",function($1){
var $2=$1.proxied;var $3=new LzHTTPLoader(this,$2);$1.loader=$3;$3.loadSuccess=this.loadSuccess;$3.loadError=this.loadError;$3.loadTimeout=this.loadTimeout;$3.setProxied($2);var $4=("secure" in $1)?$1.secure:null;if($4==null){
if($1.src.substring(0,5)=="https"){
$4=true
}};if($4){
$3.baserequest=LzBrowser.getBaseURL($4,$1.secureport)
};$3.secure=$4;if($4){
$3.secureport=$1.secureport
};return $3
},"abortLoadForRequest",function($1){
$1.loader.abort()
},"doRequest",function($1){
if(!$1.src){
return
};var $2=$1.proxied;var $3=$1.loader;if($3==null||$1.multirequest==true||$1.queuerequests==true){
$3=this.makeLoader($1)
};$3.dataRequest=$1;$3.setQueueing($1.queuerequests);$3.setTimeout($1.timeout);$3.setOption("cacheable",$1.cacheable==true);$3.setOption("timeout",$1.timeout);$3.setOption("trimwhitespace",$1.trimwhitespace==true);$3.setOption("nsprefix",$1.nsprefix==true);$3.setOption("sendheaders",$1.getresponseheaders==true);if($1.clientcacheable!=null){
$3.setOption("ccache",$1.clientcacheable)
};var $4={};var $5=$1.requestheaders;if($5!=null){
var $6=$5.getNames();for(var $7=0;$7<$6.length;$7++){
var $8=$6[$7];var $9=$5.getValue($8);if($2){
$4[$8]=$9
}else{
$3.setRequestHeader($8,$9)
}}};var $10=$1.queryparams;var $11="";var $12="";var $13="__lzbc__="+new Date().getTime();var $14=$1.postbody;if($14==null&&$10!=null){
var $15=$10.getNames();for(var $7 in $15){
var $16=$15[$7];$12+=$11+$16+"="+encodeURIComponent($10.getValue($16));$11="&"
};$14=$12
};var $17=new LzURL($1.src);if($1.method=="GET"){
if($17.query==null){
$17.query=$14
}else{
if($14!=null){
$17.query+="&"+$14
}};$14=null
};if(!$2&&$1.method=="POST"&&($14==null||$14=="")){
$14=$13
};var $18;if($2){
$18=$3.makeProxiedURL($17.toString(),$1.method,"xmldata",$4,$14);var $19=$18.indexOf("?");var $20=$18.substring($19+1,$18.length);var $21=$18.substring(0,$19);$18=$21+"?"+$13;$14=$20
}else{
if(!$1.clientcacheable){
if($1.method=="GET"){
if($17.query==null){
$17.query=$13
}else{
$17.query+="&"+$13
}}};$18=$17.toString()
};$1.status="loading";$3.open($2?"POST":$1.method,$18,null,null);$3.send($14)
},"loadSuccess",function($1,$2){
var $3=$1.dataRequest;$3.status=LzDataRequest.SUCCESS;$1.owner.loadResponse($3,$2)
},"loadError",function($1,$2){
var $3=$1.dataRequest;$3.status="error";$1.owner.loadResponse($3,$2)
},"loadTimeout",function($1,$2){
var $3=$1.dataRequest;$3.status=LzDataRequest.TIMEOUT;$3.onstatus.sendEvent($3)
},"setRequestError",function($1,$2){
$1.error=$2;$1.status=LzDataRequest.ERROR
},"loadResponse",function($1,$2){
var $3=new LzParam();var $4=null;if($2==null){
this.setRequestError($1,"client could not parse XML from server");$1.onstatus.sendEvent($1);return
};var $5=$1.proxied;if($5&&$2.childNodes[0].nodeName=="error"){
this.setRequestError($1,$2.childNodes[0].attributes["msg"]);$1.onstatus.sendEvent($1);return
};if($5){
var $6=("childNodes" in $2.childNodes[1])?$2.childNodes[1].childNodes:null;if($6!=null){
for(var $7=0;$7<$6.length;$7++){
var $8=$6[$7];if($8.attributes){
$3.addValue($8.attributes.name,$8.attributes.value)
}}};if($2.childNodes[0].childNodes){
$4=$2.childNodes[0].childNodes[0]
}}else{
$4=$2
};$1.xmldata=$4;$1.responseheaders=$3;$1.rawdata=$1.loader.getResponse();$1.onstatus.sendEvent($1)
}],null);LzHTTPDataRequest=Class.make("LzHTTPDataRequest",LzDataRequest,["$lzsc$initialize",function($1){
if(arguments.length<1){
$1=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1)
},"method","GET","postbody",void 0,"proxied",void 0,"multirequest",false,"queuerequests",false,"queryparams",null,"requestheaders",null,"getresponsheaders",false,"responseheaders",null,"getresponseheaders",null,"cacheable",false,"clientcacheable",null,"trimwhitespace",false,"nsprefix",false,"xmldata",null,"loadtime",0,"secure",false,"secureport",void 0,"loader",null],null);var httpdataprovider=new LzHTTPDataProvider();var defaultdataprovider=httpdataprovider;LzDataset=Class.make("LzDataset",[LzDataElementMixin,LzDataNodeMixin,LzNode],["dataprovider",defaultdataprovider,"multirequest",false,"dataRequest",null,"dataRequestClass",LzHTTPDataRequest,"dsloadDel",null,"errorstring",void 0,"reqOnInitDel",void 0,"secureport",void 0,"onerror",LzDeclaredEvent,"ontimeout",LzDeclaredEvent,"timeout",60000,"postbody",null,"acceptencodings",false,"params",null,"nsprefix",false,"getresponseheaders",false,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"querytype","GET","$lzc$set_querytype",function($1){
this.setQueryType($1)
},"trimwhitespace",false,"cacheable",false,"clientcacheable",true,"querystring",null,"$lzc$set_data",function($1){
this.setData($1)
},"src",null,"$lzc$set_src",function($1){
this.setSrc($1)
},"autorequest",false,"$lzc$set_autorequest",function($1){
this.setAutorequest($1)
},"request",false,"$lzc$set_request",function($1){
this.setRequest($1)
},"headers",null,"proxied",null,"responseheaders",null,"queuerequests",false,"oncanvas",void 0,"$lzc$set_initialdata",function($1){
this.setInitialData($1)
},"construct",function($1,$2){
this.nodeType=LzDataElement.DOCUMENT_NODE;this.queuerequests=false;this.oncanvas=$1==canvas||$1==null;if(("port" in $2)&&$2.port&&!(("secureport" in $2)&&$2.secureport)){
$2.secureport=$2.port
};this.ownerDocument=this;if(("timeout" in $2)&&$2.timeout){
this.timeout=$2.timeout
}else{
this.timeout=canvas.dataloadtimeout
};(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
},"$lzc$set_name",function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzc$set_name"]:this.nextMethod(arguments.callee,"$lzc$set_name")).apply(this,arguments);if($1!=null){
this.nodeName=$1;if(!("datasets" in canvas)||null==canvas.datasets){
canvas.datasets={}};if(this.oncanvas){
canvas[$1]=this
}else{
$1=this.parent.getUID()+"."+$1
};if(null!=canvas.datasets[$1]){

};canvas.datasets[$1]=this
}},"destroy",function(){
this.setChildNodes([]);this.dataRequest=null;if(this.dsloadDel){
this.dsloadDel.unregisterAll()
};var $1=this.name;if(this.oncanvas){
if(canvas[$1]===this){
delete canvas[$1]
}}else{
$1=this.parent.getUID()+"."+$1
};if(canvas.datasets[$1]===this){
delete canvas.datasets[$1]
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},"getSrc",function(){
return this.src
},"getQueryString",function(){
if(typeof this.querystring=="undefined"){
return ""
}else{
return this.querystring
}},"getParams",function(){
if(this.params==null){
new LzParam(this,{name:"params"})
};return this.params
},"getStatusCode",function(){
return 200
},"setData",function($1,$2){
if(arguments.length<2){
$2=null
};if($1==null){
return
};if($1 instanceof Array){
this.setChildNodes($1)
}else{
this.setChildNodes([$1])
};this.data=$1;if(("responseheaders" in this)&&this.responseheaders!=null){
this.responseheaders.destroy()
};this.responseheaders=$2;if(this.ondata.ready){
this.ondata.sendEvent(this)
}},"gotError",function($1){
this.errorstring=$1;if(this.onerror.ready){
this.onerror.sendEvent(this)
}},"gotTimeout",function(){
if(this.ontimeout.ready){
this.ontimeout.sendEvent(this)
}},"getContext",function($1){
if(arguments.length<1){
$1=null
};return this
},"getDataset",function(){
return this
},"getPointer",function(){
var $1=new LzDatapointer(null);$1.p=this.getContext();return $1
},"setQueryString",function($1){
this.params=null;if(typeof $1=="object"){
if($1 instanceof LzParam){
this.querystring=$1.toString()
}else{
var $2=new LzParam(this);for(var $3 in $1){
$2.setValue($3,$1[$3],true)
};this.querystring=$2.toString();$2.destroy()
}}else{
this.querystring=$1
};if(this.autorequest){
this.doRequest()
}},"setSrc",function($1){
this.src=$1;if(this.autorequest){
this.doRequest()
}},"setProxyRequests",function($1){
if(typeof $1!="string"){

}else{
this.proxied=$1
}},"setRequest",function($1){
this.request=$1;if(!$1){
return
};if(!this.isinited){
this.reqOnInitDel=new LzDelegate(this,"doRequest",this,"oninit")
}},"getLoadTime",function(){

},"setQueryParam",function($1,$2){
this.querystring=null;if(!this.params){
new LzParam(this,{name:"params"})
};this.params.setValue($1,$2);if(this.autorequest){
this.doRequest()
}},"setQueryParams",function($1){
this.querystring=null;if(!this.params){
this.params=new LzParam(this,{name:"params"})
};if($1){
this.params.addObject($1)
}else{
if($1==null){
this.params.remove()
}};if($1&&this.autorequest){
this.doRequest()
}},"isProxied",function(){
var $1=canvas.proxied;if(this.proxied!=null&&this.proxied!="inherit"){
$1=this.proxied==true
};if(this.proxied!=null&&this.proxied!="inherit"){
$1=this.proxied==true
};return $1
},"doRequest",function($1){
if(arguments.length<1){
$1=null
};if(this.multirequest||this.dataRequest==null||this.queuerequests){
this.dataRequest=new (this.dataRequestClass)(this)
};var $2=this.dataRequest;$2.src=this.src;$2.timeout=this.timeout;$2.status=LzDataRequest.READY;$2.method=this.querytype;$2.postbody=null;if(this.querystring){
$2.queryparams=new LzParam(this);$2.queryparams.addObject(LzParam.parseQueryString(this.querystring))
}else{
$2.queryparams=this.params
};if(this.querytype.toUpperCase()=="POST"){
var $3=null;if($2.queryparams){
$3=$2.queryparams.getValue("lzpostbody")
};if($3!=null){
$2.postbody=$3;$2.queryparams.remove("lzpostbody")
}};$2.proxied=this.isProxied();$2.queuerequests=this.queuerequests;$2.requestheaders=this.headers;$2.getresponseheaders=this.getresponseheaders;$2.secureport=this.secureport;$2.cacheable=this.cacheable;$2.clientcacheable=this.clientcacheable;$2.trimwhitespace=this.trimwhitespace;$2.nsprefix=this.nsprefix;if(this.dsloadDel==null){
this.dsloadDel=new LzDelegate(this,"handleDataResponse",$2,"onstatus")
}else{
this.dsloadDel.register($2,"onstatus")
};this.dataprovider.doRequest($2)
},"handleDataResponse",function($1){
if(this.dsloadDel!=null){
this.dsloadDel.unregisterFrom($1.onstatus)
};if($1.status==LzDataRequest.SUCCESS){
this.setData($1.xmldata,$1.responseheaders)
}else{
if($1.status==LzDataRequest.ERROR){
this.gotError($1.error)
}else{
if($1.status==LzDataRequest.TIMEOUT){
this.gotTimeout()
}}}},"setAutorequest",function($1){
this.autorequest=$1
},"getErrorString",function(){
return this.errorstring
},"getRequestHeaderParams",function(){
return this.headers
},"clearRequestHeaderParams",function(){
if(this.headers){
this.headers.remove()
}},"getResponseHeader",function($1){
return this.dataRequest.responseheaders[$1]
},"setQueryType",function($1){
this.querytype=$1.toUpperCase()
},"setPostBody",function($1){
this.postbody=$1
},"abort",function(){
this.dataprovider.abortLoadForRequest(this.dataRequest)
},"getAllResponseHeaders",function(){
return this.responseheaders
},"setHeader",function($1,$2){
if(!this.headers){
this.headers=new LzParam(this)
};this.headers.setValue($1,$2)
},"setInitialData",function($1){
if($1!=null){
var $2=LzDataElement.stringToLzData($1,this.trimwhitespace,this.nsprefix);if($2!=null){
this.setData($2.childNodes)
}}},"toString",function(){
return "LzDataset "+":"+this.name
}],["tagname","dataset","attributes",new LzInheritedHash(LzNode.attributes),"slashPat","/","queryStringToTable",function($1){
var $2={};var $3=$1.split("&");for(var $4 in $3){
var $5=$3[$4];var $6="";var $7=$5.indexOf("=");if($7>0){
$6=unescape($5.substring($7+1));$5=$5.substring(0,$7)
};if($5 in $2){
var $8=$2[$5];if($8 instanceof Array){
$8.push($6)
}else{
$6=[$8,$6];$2[$5]=$6
}}else{
$2[$5]=$6
}};return $2
}]);(function(){
with(LzDataset){
with(LzDataset.prototype){
LzDataset.attributes.name="localdata"
}}})();ConstructorMap[LzDataset.tagname]=LzDataset;__LzHttpDatasetPoolClass=Class.make("__LzHttpDatasetPoolClass",null,["_uid",0,"_p",[],"get",function($1,$2,$3,$4){
var $5;if(this._p.length>0){
$5=this._p[this._p.length-1];this._p.length=this._p.length-1
}else{
$5=new LzDataset(null,{name:"LzHttpDatasetPool"+this._uid,type:"http",acceptencodings:$4?$4:false});this._uid++
};if($1!=null){
$1.register($5,"ondata")
};if($2!=null){
$2.register($5,"onerror")
};if($3!=null){
$3.register($5,"ontimeout")
};return $5
},"recycle",function($1){
$1.setQueryParams(null);if($1["ondata"]){
$1.ondata.clearDelegates()
};if($1["ontimeout"]){
$1.ontimeout.clearDelegates()
};if($1["onerror"]){
$1.onerror.clearDelegates()
};this._p[this._p.length]=$1
}],null);var LzHttpDatasetPool=new __LzHttpDatasetPoolClass();LzDatapointer=Class.make("LzDatapointer",LzNode,["$lzc$set_ignoreplacement",function($1){
this.ignoreplacement=$1
},"$lzc$set_xpath",function($1){
this.setXPath($1)
},"$lzc$set_context",function($1){
this.setDataContext($1)
},"$lzc$set_pointer",function($1){
this.setPointer($1)
},"$lzc$set_p",function($1){
this.setPointer($1)
},"p",null,"context",null,"__LZtracking",null,"__LZtrackDel",null,"xpath",null,"parsedPath",null,"__LZlastdotdot",null,"__LZspecialDotDot",false,"__LZdotdotCheckDel",void 0,"errorDel",void 0,"timeoutDel",void 0,"rerunxpath",false,"onp",LzDeclaredEvent,"onDocumentChange",LzDeclaredEvent,"onerror",LzDeclaredEvent,"ontimeout",LzDeclaredEvent,"onrerunxpath",LzDeclaredEvent,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"childOrSelf",function($1){
var $2=this.p;do{
if($2==$1){
return true
};$2=$2.$p
}while($2&&$2.$n<=this.p.$n)
},"gotError",function($1){
if(this.onerror.ready){
this.onerror.sendEvent($1)
}},"gotTimeout",function($1){
if(this.ontimeout.ready){
this.ontimeout.sendEvent($1)
}},"xpathQuery",function($1){
var $2=this.parsePath($1);var $3=$2.getContext(this);var $4=this.__LZgetNodes($2,$3?$3:this.p);if(!$4){
return null
};if($2.aggOperator!=null){
if($2.aggOperator=="last"){
return $4.length||this.__LZgetLast()
};if($2.aggOperator=="position"){
if($4.length){
var $5=[];for(var $6=0;$6<$4.length;$6++){
$5.push($6+1)
};return $5
}else{
return this.__LZgetPosition()
}}}else{
if($2.operator!=null){
if($4.length){
var $7=[];for(var $6=0;$6<$4.length;$6++){
$7.push(this.__LZprocessOperator($4[$6],$2))
};return $7
}else{
return this.__LZprocessOperator($4,$2)
}}else{
return $4
}}},"$lzc$xpathQuery_dependencies",function($1,$2,$3){
if(this.parsePath){
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
if(this.context==this){
return null
};return this.context.getDataset()
};return this.p.ownerDocument
},"setXPath",function($1){
var $2=$1;if(!$2){
this.xpath=null;this.parsedPath=null;if(this.p){
this.__LZsetTracking(this.p.ownerDocument)
};return
};this.xpath=$1;this.parsedPath=this.parsePath($1);var $3=this.parsedPath.getContext(this);if(this.rerunxpath&&this.parsedPath.hasDotDot&&!$3){
this.__LZspecialDotDot=true
}else{
if(this.__LZdotdotCheckDel){
this.__LZdotdotCheckDel.unregisterAll()
}};this.setDataContext($3);return this.runXPath()
},"runXPath",function(){
if(!this.parsedPath){
return
};var $1=null;if(this.context&&((LzDatapointer["$lzsc$isa"]?LzDatapointer.$lzsc$isa(this.context):this.context instanceof LzDatapointer)||(LzDataset["$lzsc$isa"]?LzDataset.$lzsc$isa(this.context):this.context instanceof LzDataset)||(AnonDatasetGenerator["$lzsc$isa"]?AnonDatasetGenerator.$lzsc$isa(this.context):this.context instanceof AnonDatasetGenerator))){
$1=this.context.getContext()
};if($1){
var $2=this.__LZgetNodes(this.parsedPath,$1,0)
}else{
var $2=null
};if(!$2){
this.__LZHandleNoNodes();return false
}else{
if(Array["$lzsc$isa"]?Array.$lzsc$isa($2):$2 instanceof Array){
this.__LZHandleMultiNodes($2);return false
}else{
this.__LZHandleSingleNode($2);return true
}}},"__LZsetupDotDot",function($1){
if(this.__LZlastdotdot!=$1.ownerDocument){
if(!this.__LZdotdotCheckDel){
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
this.__LZHandleNoNodes()
},"__LZsetData",function(){
if(this.parsedPath&&this.parsedPath.aggOperator!=null){
if(this.parsedPath.aggOperator=="last"){
this.data=this.__LZgetLast();this.__LZsendUpdate(true)
};if(this.parsedPath.aggOperator=="position"){
this.data=this.__LZgetPosition();this.__LZsendUpdate(true)
}}else{
if(this.parsedPath&&this.parsedPath.operator!=null){
this.__LZsimpleOperatorUpdate()
}else{
if(this.data!=this.p){
this.data=this.p;this.__LZsendUpdate(true)
}}}},"__LZgetLast",function(){
if(this.context==this){
return 1
};return this.context.__LZgetLast()||1
},"__LZgetPosition",function(){
if(this.context==this){
return 1
};return this.context.__LZgetPosition()||1
},"__LZupdateLocked",false,"__LZpchanged",false,"__LZdchanged",false,"__LZsendUpdate",function($1,$2){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
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
var $1=this.__LZprocessOperator(this.p,this.parsedPath);var $2=false;if(this.data!=$1||this.parsedPath.operator=="attributes"){
this.data=$1;$2=true
};this.__LZsendUpdate($2)
},"parsePath",function($1){
if($1 instanceof LzDatapath){
$1=$1.xpath
};var $2=LzDatapointer.ppcache;var $3=$2[$1];if($3==null){
$3=new LzParsedPath($1,this);$2[$1]=$3
};return $3
},"getLocalDataContext",function($1){
var $2=this.parent;if($1){
var $3=$1;for(var $4=0;$4<$3.length;$4++){
if($2){
$2=$2[$3[$4]]
}};if($2&&$2 instanceof LzDataset==false&&$2["localdata"] instanceof LzDataset==true){
$2=$2["localdata"]
}};if($2!=null&&$2 instanceof LzDataset){
return $2
}else{

}},"pathSymbols",{"/":1,"..":2,"*":3,".":4},"__LZgetNodes",function($1,$2,$3){
if(arguments.length<3){
$3=null
};var $4;if($2==null){
return false
};if($1.selectors!=null){
var $5=$1.selectors.length;var $6=0;for(var $7=$3?$3:0;$7<$5;$7++){
var $8=$1.selectors[$7];var $9=this.pathSymbols[$8];var $10=$1.selectors[$7+1];if($10&&!(String["$lzsc$isa"]?String.$lzsc$isa($10):$10 instanceof String)&&$10["pred"]=="range"){
var $11=$1.selectors[++$7]
}else{
var $11=null
};$4=null;if((Object["$lzsc$isa"]?Object.$lzsc$isa($8):$8 instanceof Object)&&("pred" in $8)&&null!=$8.pred){
if($8.pred=="hasattr"){
$2=$2.hasAttr($8.attr)?$2:false
}else{
if($8.pred=="attrval"){
if($2.attributes!=null){
$2=$2.attributes[$8.attr]==$8.val?$2:false
}else{
$2=false
}}}}else{
if(!$9){
$4=this.nodeByName($8,$11,$2)
}else{
if($9==1){
$2=$2.ownerDocument
}else{
if($9==2){
$2=$2.parentNode
}else{
if($9==3){
$4=[];var $12=0;if($2.childNodes){
for(var $13=0;$13<$2.childNodes.length;$13++){
if($2.childNodes[$13].nodeType==LzDataElement.ELEMENT_NODE){
$12++;if(!$11||$12>=$11[0]){
$4.push($2.childNodes[$13])
};if($11&&$12==$11[1]){
break
}}}}}}}}};if($4!=null){
if($4.length>1){
var $14=[];if($7==$5-1){
return $4
};for(var $13=0;$13<$4.length;$13++){
var $15=this.__LZgetNodes($1,$4[$13],$7+1);if($15!=null&&$15.length>0){
for(var $16=0;$16<$15.length;$16++){
if($15[$16]){
$14.push($15[$16])
}}}else{
if($15){
$14.push($15)
}}};if(!$14.length){
return null
}else{
if($14.length==1){
return $14[0]
}else{
return $14
}}}else{
$2=$4[0]
}};if(!$2){
return false
}}};return $2
},"getContext",function($1){
if(arguments.length<1){
$1=null
};return this.p
},"nodeByName",function($1,$2,$3){
var $4=[];var $5=0;if(!$3){
var $3=this.p;if(!this.p){
return null
}};if($3.childNodes){
for(var $6=0;$6<$3.childNodes.length;$6++){
var $7=$3.childNodes[$6];if($7&&$7.nodeName==$1){
$5++;if(!$2||$5>=$2[0]){
$4.push($7)
};if($2&&$5==$2[1]){
break
}}}};return $4
},"$lzc$set_rerunxpath",function($1){
this.rerunxpath=$1;if(this.onrerunxpath.ready){
this.onrerunxpath.sendEvent($1)
}},"dupePointer",function(){
var $1=new LzDatapointer();$1.setFromPointer(this);return $1
},"__LZdoSelect",function($1,$2){
$2=$2?$2:1;var $3=this.p;for(;$3!=null&&$2>0;$2--){
if(typeof $3[$1]=="function"){
$3=$3[$1]()
}};if($3!=null){
this.setPointer($3);return true
};return false
},"selectNext",function($1){
if(arguments.length<1){
$1=null
};return this.__LZdoSelect("getNextSibling",$1)
},"selectPrev",function($1){
return this.__LZdoSelect("getPreviousSibling",$1)
},"selectChild",function($1){
return this.__LZdoSelect("getFirstChild",$1)
},"selectParent",function($1){
if(arguments.length<1){
$1=null
};return this.__LZdoSelect("getParent",$1)
},"selectNextParent",function(){
var $1=this.p;if(this.selectParent()&&this.selectNext()){
return true
}else{
this.setPointer($1);return false
}},"getNodeType",function(){
if(!this.p){
return
};return this.p.nodeType
},"getNodeName",function(){
if(!this.p){
return
};return this.p.nodeName
},"setNodeName",function($1){
if(!this.p){
return
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
this.p.setNodeName($1)
}},"getNodeAttributes",function(){
if(!this.p){
return
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
return this.p.attributes
}},"getNodeAttribute",function($1){
if(!this.p){
return
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
return this.p.attributes[$1]
}},"setNodeAttribute",function($1,$2){
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
return
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
return this.p.__LZgetText()
}},"setNodeText",function($1){
if(!this.p){
return
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
var $2=false;for(var $3=0;$3<this.p.childNodes.length;$3++){
if(this.p.childNodes[$3].nodeType==LzDataElement.TEXT_NODE){
this.p.childNodes[$3].setData($1);$2=true;break
}};if(!$2){
this.p.appendChild(new LzDataText($1))
}}},"getNodeCount",function(){
if(!this.p||this.p.nodeType==LzDataElement.TEXT_NODE){
return 0
};return this.p.childNodes.length||0
},"addNode",function($1,$2,$3){
if(!this.p){
return
};var $4=new LzDataElement($1,$3);if($2!=null){
$4.appendChild(new LzDataText($2))
};if(this.p.nodeType!=LzDataElement.TEXT_NODE){
this.p.appendChild($4)
};return $4
},"deleteNode",function(){
if(!this.p){
return
};var $1=this.p;if(!this.rerunxpath){
if(!this.selectNext()){
this.__LZHandleNoNodes()
}};$1.parentNode.removeChild($1);return $1
},"sendDataChange",function($1){
this.getDataset().sendDataChange($1)
},"comparePointer",function($1){
return this.p==$1.p
},"addNodeFromPointer",function($1){
if(!$1.p){
return
};if(!this.p){
return
};var $2=$1.p.cloneNode(true);if(this.p.nodeType!=LzDataElement.TEXT_NODE){
this.p.appendChild($2)
};return new LzDatapointer(null,{pointer:$2})
},"setFromPointer",function($1){
this.setPointer($1.p)
},"__LZprocessOperator",function($1,$2,$3){
if(arguments.length<3){
$3=null
};if($1==null){
return
};if($2.operatorArgs!=null){
return $1[$2.operator]($2.operatorArgs)
};var $4;if($2.operator.indexOf("attributes.")==0){
$4=["attributes",$2.operator.substr(11)]
}else{
$4=$2.operator.split(".")
};var $5=$1;for(var $6=0;$6<$4.length;$6++){
var $7=$4[$6];if($5==null||!(LzDataElement["$lzsc$isa"]?LzDataElement.$lzsc$isa($5):$5 instanceof LzDataElement)&&!($7 in $5)){
return
}else{
$5=$5[$7]
}};return $5
},"makeRootNode",function(){
return new LzDataElement("root")
},"finishRootNode",function($1){
return $1.childNodes[0]
},"makeElementNode",function($1,$2,$3){
var $4=new LzDataElement($2,$1);$3.appendChild($4);return $4
},"makeTextNode",function($1,$2){
var $3=new LzDataText($1);$2.appendChild($3);return $3
},"serialize",function(){
if(this.p==null){
return
};return this.p.serialize()
},"setDataContext",function($1,$2){
if(arguments.length<2){
$2=null
};if($1==null){
this.context=this;if(this.p){
this.__LZsetTracking(this.p.ownerDocument)
}}else{
if(this.context!=$1){
this.context=$1;if(this.errorDel!=null){
this.errorDel.unregisterAll();this.timeoutDel.unregisterAll()
};this.__LZsetTracking($1);var $3=this.xpath;if($3){
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
}}}else{
if($1.type==2||($1.type==0||$1.type==1&&this.parsedPath&&this.parsedPath.hasOpSelector)&&(this.parsedPath&&this.parsedPath.hasDotDot||this.p==null||this.p.childOfNode($1.who))){
this.runXPath();return true
}else{
if(this.__LZneedsOpUpdate($1)){
this.__LZsimpleOperatorUpdate()
}};return false
}},"__LZneedsOpUpdate",function($1){
if(arguments.length<1){
$1=null
};return this.parsedPath&&this.parsedPath.operator!=null&&(this.parsedPath.operator=="__LZgetText"?$1.type==0&&$1.who==this.p||$1.who.parentNode==this.p&&$1.who.nodeType==LzDataElement.TEXT_NODE:$1.type==1&&$1.who==this.p)
},"__LZcheckDotDot",function($1){
var $2=$1.who;if(($1.type==0||$1.type==1&&this.parsedPath.hasOpSelector)&&this.context.getContext().childOfNode($2)){
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
if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};var $4=this.__LZtracking;var $5=this.__LZtrackDel;if($1){
if($4 instanceof Array&&$4.length==1&&$4[0]===$1){
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
}}}],["tagname","datapointer","attributes",{ignoreplacement:true},"ppcache",{}]);ConstructorMap[LzDatapointer.tagname]=LzDatapointer;LzParam=Class.make("LzParam",LzNode,["d",null,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"construct",function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.d={}},"parseQueryString",function($1){
return LzParam.parseQueryString($1)
},"createChildren",function($1){

},"dlm","&","sep","=","addObject",function($1){
for(var $2 in $1){
this.setValue($2,$1[$2])
}},"clone",function($1){
if(arguments.length<1){
$1=null
};if($1&&$debug){
Debug.info("%w.%s is deprecated. Do not pass as argument to clone()",this,arguments.callee)
};var $2=new LzParam();for(var $3 in this.d){
$2.d[$3]=this.d[$3].concat()
};return $2
},"remove",function($1){
if(arguments.length<1){
$1=null
};if(null==$1){
this.d={}}else{
if(null!=this.d[$1]){
var $2=this.findKey($1);if($2!=null){
this.d[$1].splice($2,2)
}}}},"setValue",function($1,$2,$3){
if(arguments.length<3){
$3=null
};if($3){
$2=encodeURIComponent($2)
};var $4=this.d[$1];if($4==null){
this.d[$1]=[$1,$2]
}else{
var $5=this.findKey($1);if(null!=$5){
$4[$5+1]=$2
}else{
$4.push($1,$2)
}}},"addValue",function($1,$2,$3){
if(arguments.length<3){
$3=false
};if($3){
$2=encodeURIComponent($2)
};var $4=this.d[$1];if($4==null){
this.d[$1]=[$1,$2]
}else{
$4.push($1,$2)
}},"getValue",function($1){
var $2=this.findKey($1);if(null!=$2){
return this.d[$1][$2+1]
}},"getValueNoCase",function($1){
var $2=this.d[$1];if($2.length){
if($2.length==2){
return $2[1]
}else{
var $3=[];for(var $4=1;$4<$2.length;$4+=2){
$3.push($2[$4])
};return $3
}}},"getNames",function(){
var $1=[];for(var $2 in this.d){
var $3=this.d[$2];for(var $4=0;$4<$3.length;$4+=2){
if(null!=$3[$4]){
$1.push($3[$4])
}}};return $1
},"findKey",function($1){
var $2=this.d[$1];if($2!=null){
for(var $3=0;$3<$2.length;$3+=2){
if($1==$2[$3]){
return $3
}}}},"setDelimiter",function($1){
var $2=this.dlm;this.dlm=$1;return $2
},"setSeparator",function($1){
var $2=this.sep;this.sep=$1;return $2
},"toString",function(){
return this.serialize()
},"serialize",function($1,$2,$3){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};var $1=$1==null?this.sep:$1;var $4=$2==null?this.dlm:$2;var $5="";var $6=false;for(var $7 in this.d){
var $8=this.d[$7];if($8!=null){
for(var $9=0;$9<$8.length;$9+=2){
if($6){
$5+=$4
};$5+=$8[$9]+$1;$5+=$3?encodeURIComponent($8[$9+1]):$8[$9+1];$6=true
}}};return $5
}],["tagname","params","attributes",new LzInheritedHash(LzNode.attributes),"parseQueryString",function($1){
var $2=$1.split("&");var $3={};for(var $4 in $2){
var $5=$2[$4];var $6="";var $7=$5.indexOf("=");if($7>0){
$6=unescape($5.substring($7+1));$5=$5.substring(0,$7)
};$3[$5]=$6
};return $3
}]);LzParam.prototype.toString=LzParam.prototype.serialize;LzParsedPath=Class.make("LzParsedPath",null,["path",null,"selectors",null,"context",null,"dsetname",null,"dsrcname",null,"islocaldata",null,"operator",null,"aggOperator",null,"operatorArgs",null,"hasAttrOper",false,"hasOpSelector",false,"hasDotDot",false,"getContext",function($1){
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
this.operator="__LZgetText";this.operatorArgs=0
}else{
if($15.indexOf("serialize")>-1){
this.operator="serialize";this.operatorArgs=0
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
}]);AnonDatasetGenerator=Class.make("AnonDatasetGenerator",null,["pp",null,"noncontext",true,"$lzsc$initialize",function($1){
this.pp=$1
},"getContext",function(){
var $1=new LzDataset(null,{name:null});var $2=this.pp.selectors;if($2!=null){
var $3=$1.getPointer();for(var $4=0;$4<$2.length;$4++){
if($2[$4]=="/"){
continue
};$3.addNode($2[$4]);$3.selectChild()
}};return $1
}],null);LzDatapath=Class.make("LzDatapath",LzDatapointer,["datacontrolsvisibility",true,"__LZtakeDPSlot",true,"storednodes",void 0,"__LZneedsUpdateAfterInit",void 0,"__LZdepChildren",void 0,"sel",false,"pooling",false,"replication",void 0,"sortpath",void 0,"$lzc$set_sortpath",function($1){
this.setOrder($1)
},"setOrder",function($1,$2){
if(arguments.length<2){
$2=null
};if(this.__LZisclone){
this.immediateparent.cloneManager.setOrder($1,$2)
}else{
this.sortpath=$1;if($2!=null){
this.sortorder=$2
}}},"sortorder",void 0,"$lzc$set_sortorder",function($1){
this.setComparator($1)
},"setComparator",function($1){
if(this.__LZisclone){
this.immediateparent.cloneManager.setComparator($1)
}else{
this.sortorder=$1
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"construct",function($1,$2){
this.rerunxpath=true;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);if(!("data" in this.immediateparent)){
this.immediateparent.data=null
};if($2.datacontrolsvisibility!=null){
this.datacontrolsvisibility=$2.datacontrolsvisibility
};if(this.__LZtakeDPSlot){
this.immediateparent.datapath=this;var $3=null;var $4=null;$3=this.immediateparent.searchParents("datapath").datapath;$4=$3.__LZdepChildren;if($4!=null){
$3.__LZdepChildren=[];for(var $5=$4.length-1;$5>=0;$5--){
var $6=$4[$5];if($6!=this&&!(LzDataAttrBind["$lzsc$isa"]?LzDataAttrBind.$lzsc$isa($6):$6 instanceof LzDataAttrBind)&&$6.immediateparent!=this.immediateparent&&$6.immediateparent.childOf(this.immediateparent)){
$6.setDataContext(this,true)
}else{
$3.__LZdepChildren.push($6)
}}}}},"__LZHandleMultiNodes",function($1){
var $2;switch(this.replication){
case "lazy":
$2=LzLazyReplicationManager;break;
case "resize":
$2=LzResizeReplicationManager;break;
default:
$2=LzReplicationManager;break;

};this.storednodes=$1;var $3=new $2(this,this._instanceAttrs);this.storednodes=null;return $3
},"setNodes",function($1){
var $2=this.__LZHandleMultiNodes($1);if(!$2){
$2=this
};$2.__LZsetTracking(null);if($1){
for(var $3=0;$3<$1.length;$3++){
var $4=$1[$3];var $5=$4.ownerDocument;$2.__LZsetTracking($5,true,$4!=$5)
}}},"__LZsendUpdate",function($1,$2){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};var $3=this.__LZpchanged;if(!(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsendUpdate"]:this.nextMethod(arguments.callee,"__LZsendUpdate")).apply(this,arguments)){
return false
};if(this.immediateparent.isinited){
this.__LZApplyData($3)
}else{
this.__LZneedsUpdateAfterInit=true
};return true
},"__LZApplyDataOnInit",function(){
if(this.__LZneedsUpdateAfterInit){
this.__LZApplyData();this.__LZneedsUpdateAfterInit=null
}},"__LZApplyData",function($1){
if(arguments.length<1){
$1=null
};var $2=this.immediateparent;if(this.datacontrolsvisibility){
this.immediateparent.__LZvizDat=this.p!=null;if(LzView["$lzsc$isa"]?LzView.$lzsc$isa(this.immediateparent):this.immediateparent instanceof LzView){
this.immediateparent.__LZupdateShown()
}};var $3=$1||$2.data!=this.data||this.parsedPath&&this.parsedPath.operator=="attributes";this.data=this.data==null?null:this.data;$2.data=this.data;if($3&&$2.ondata.ready){
$2.ondata.sendEvent(this.data)
};if(this.parsedPath&&(this.parsedPath.operator!=null||this.parsedPath.aggOperator!=null)&&$3){
if($2.applyData){
$2.applyData(this.data)
}}},"setDataContext",function($1,$2){
if(arguments.length<2){
$2=null
};if($1==null&&this.immediateparent!=null){
$1=this.immediateparent.searchParents("datapath").datapath;$2=true
};if($1==this.context){
return
};if($2){
if($1.__LZdepChildren==null){
$1.__LZdepChildren=[this]
}else{
$1.__LZdepChildren.push(this)
}}else{
var $3=null;if(this.context){
$3=this.context.__LZdepChildren
};if($3){
for(var $4=0;$4<$3.length;$4++){
if($3[$4]==this){
$3.splice($4,1);break
}}}};(arguments.callee.superclass?arguments.callee.superclass.prototype["setDataContext"]:this.nextMethod(arguments.callee,"setDataContext")).call(this,$1)
},"destroy",function(){
this.__LZupdateLocked=true;if(this.context&&!this.context.__LZdeleted&&(LzDatapath["$lzsc$isa"]?LzDatapath.$lzsc$isa(this.context):this.context instanceof LzDatapath)){
var $1=this.context.__LZdepChildren;if($1!=null){
for(var $2=0;$2<$1.length;$2++){
if($1[$2]==this){
$1.splice($2,1);break
}}}};if(!this.immediateparent.__LZdeleted){
if(this.__LZdepChildren!=null&&this.__LZdepChildren.length){
var $3=this.immediateparent.searchParents("datapath").datapath;for(var $2=0;$2<this.__LZdepChildren.length;$2++){
this.__LZdepChildren[$2].setDataContext($3,true)
}}};if(this.immediateparent.datapath==this){
this.immediateparent.datapath=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},"updateData",function(){
this.__LZupdateData()
},"__LZupdateData",function($1){
if(arguments.length<1){
$1=false
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
this.p.setAttrs($3)
}else{
this.setNodeAttribute($2.substring(11),$3)
}}}}};var $4=this.__LZdepChildren;if($4!=null){
for(var $5=0;$5<$4.length;$5++){
$4[$5].__LZupdateData(true)
}};if(!$1&&this.p){
this.p.__LZunlockFromUpdate(this)
}},"toString",function(){
return "Datapath for "+this.immediateparent
},"_dpevents",["ondata","onerror","ontimeout"],"__LZcheckChange",function($1){
if(!(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZcheckChange"]:this.nextMethod(arguments.callee,"__LZcheckChange")).apply(this,arguments)){
if($1.who.childOfNode(this.p,true)&&this.onDocumentChange.ready){
this.onDocumentChange.sendEvent($1)
}}},"__LZsetTracking",function($1,$2,$3){
if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};var $4;var $5;if(!$1||!$2){
return(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsetTracking"]:this.nextMethod(arguments.callee,"__LZsetTracking")).call(this,$1,true)
};$4=this.__LZtracking;$5=this.__LZtrackDel;if($3){
var $6=$4.length;for(var $7=0;$7<$6;$7++){
if($4[$7]===$1){
return
}}};if(!$5){
this.__LZtrackDel=$5=new LzDelegate(this,"__LZcheckChange")
};$4.push($1);$5.register($1,"onDocumentChange")
},"__LZisclone",false,"$lzc$set_datacontrolsvisibility",function($1){
this.datacontrolsvisibility=$1
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
if(this.__LZisclone){
return this.context.nodes.length
}else{
if(this.p==this.context.getContext()&&this.context.__LZgetLast){
return this.context.__LZgetLast()
}};return 1
},"__LZgetPosition",function(){
if(this.__LZisclone){
return this.immediateparent.clonenumber+1
}else{
if(this.p==this.context.getContext()&&this.context.__LZgetPosition){
return this.context.__LZgetPosition()
}};return 1
}],["tagname","datapath","attributes",new LzInheritedHash(LzDatapointer.attributes)]);ConstructorMap[LzDatapath.tagname]=LzDatapath;LzReplicationManager=Class.make("LzReplicationManager",LzDatapath,["$lzc$set_datapath",function($1){
this.setXPath($1)
},"asyncnew",true,"initialnodes",void 0,"clonePool",void 0,"cloneClass",void 0,"cloneParent",void 0,"cloneAttrs",void 0,"cloneChildren",void 0,"hasdata",void 0,"_t",void 0,"orderpath",void 0,"comp_orderf",void 0,"op_orderf",void 0,"visible",true,"__LZpreventXPathUpdate",false,"nodes",void 0,"clones",void 0,"__LZdataoffset",0,"onnodes",LzDeclaredEvent,"onclones",LzDeclaredEvent,"onvisible",LzDeclaredEvent,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"construct",function($1,$2){
this.__LZtakeDPSlot=false;this.datacontrolsvisibility=false;if(this.pooling==null){
this.pooling=false
};var $3=$1.immediateparent;if($3===canvas){
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
};$1.__LZspecialDotDot=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$3.parent,$2);if($3.parent!=$3.immediateparent){
$3.immediateparent[$2.name]=this
};this.xpath=$1.xpath;this.parsedPath=$1.parsedPath;this.cloneClass=$3.constructor;this.cloneParent=$3.parent;this.cloneAttrs=new LzInheritedHash($3._instanceAttrs);this.cloneAttrs.datapath=LzNode._ignoreAttribute;this.cloneAttrs.$datapath={name:"datapath"};this.cloneAttrs.$datapath.attrs={datacontrolsvisibility:$1.datacontrolsvisibility,__LZmanager:this};this.cloneAttrs.id=null;this.cloneAttrs.name=null;this.cloneAttrs.$lzc$bind_id=null;this.cloneAttrs.$lzc$bind_name=null;var $7=false;var $8=$3._instanceAttrs;var $9=$1._instanceAttrs;if($8&&("datapath" in $8)&&$8.datapath instanceof LzConstraintExpr){
$7=true;this.cloneAttrs=new LzInheritedHash(this.cloneAttrs);this.cloneAttrs.datapath=LzNode._ignoreAttribute;this.__LZpreventXPathUpdate=true;this.applyConstraintExpr($8.datapath);this.__LZpreventXPathUpdate=false
}else{
if($9&&("xpath" in $9)&&$9.xpath instanceof LzConstraintExpr){
$7=true;this.__LZpreventXPathUpdate=true;this.applyConstraintExpr($9.xpath);this.__LZpreventXPathUpdate=false
}};this.__LZsetCloneAttrs();if($3._instanceChildren){
this.cloneChildren=$3._instanceChildren.concat()
}else{
this.cloneChildren=[]
};this.visible=$1.datacontrolsvisibility||(!$3.isinited&&($3._instanceAttrs!=null&&("visible" in $3._instanceAttrs))?$3._instanceAttrs.visible:$3.visible);if($2.pooling!=null){
this.pooling=$2.pooling
};var $10=$1.context;this.clones=[];this.clonePool=[];if(this.pooling){
$1.$lzc$set___LZmanager(this);if($7){
$1.setXPath=LzReplicationManager.__LZemptyFuntion
};this.clones.push($3);$3.immediateparent.addSubview($3)
}else{
this.destroyClone($3)
};this.setDataContext($10,$10 instanceof LzDatapointer)
},"__LZsetCloneAttrs",function(){

},"constructWithArgs",function($1){
this.__LZHandleMultiNodes(this.initialnodes);this.initialnodes=null;if(this.visible==false){
this.setVisible(false)
}},"setDataContext",function($1,$2){
if(arguments.length<2){
$2=null
};var $3=arguments;if($1==null&&this.immediateparent!=null&&("datapath" in this.immediateparent)&&this.immediateparent.datapath!=null){
$3[0]=this.immediateparent.datapath;$3[1]=true
};(arguments.callee.superclass?arguments.callee.superclass.prototype["setDataContext"]:this.nextMethod(arguments.callee,"setDataContext")).apply(this,$3)
},"getNodeOffset",function($1){
if(this.nodes!=null){
var $2=this.nodes.length;for(var $3=0;$3<$2;$3++){
if($1==this.nodes[$3]){
return $3
}}}},"getCloneNumber",function($1){
return this.clones[$1]
},"__LZHandleNoNodes",function(){
this.nodes=[];while(this.clones.length){
if(this.pooling){
this.poolClone()
}else{
var $1=this.clones.pop();this.destroyClone($1)
}}},"__LZHandleSingleNode",function($1){
this.__LZHandleMultiNodes([$1])
},"mergesort",function($1,$2,$3){
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
},"__LZHandleMultiNodes",function($1){
var $2=this.parent&&this.parent.layouts?this.parent.layouts:[];for(var $3 in $2){
$2[$3].lock()
};this.hasdata=true;var $4=this.nodes;this.nodes=$1;if(this.onnodes.ready){
this.onnodes.sendEvent(this.nodes)
};if(this.__LZspecialDotDot){
this.__LZsetupDotDot($1[0])
};if(this.orderpath!=null){
this.nodes=this.mergesort(this.nodes,0,this.nodes.length-1)
};this.__LZadjustVisibleClones($4,true);var $5=this.clones.length;for(var $3=0;$3<$5;$3++){
var $6=this.clones[$3];var $7=$3+this.__LZdataoffset;$6.clonenumber=$7;if(this.nodes){
$6.datapath.setClonePointer(this.nodes[$7])
};if($6.onclonenumber.ready){
$6.onclonenumber.sendEvent($7)
}};if(this.onclones.ready){
this.onclones.sendEvent(this.clones)
};for(var $3 in $2){
$2[$3].unlock()
}},"__LZadjustVisibleClones",function($1,$2){
var $3=this.__LZdiffArrays($1,this.nodes);if(!this.pooling){
while(this.clones.length>$3){
var $4=this.clones.pop();this.destroyClone($4)
}};LzInstantiator.enableDataReplicationQueuing();while(this.nodes&&this.nodes.length>this.clones.length){
var $5=this.getNewClone();if(!$5){
break
};this.clones.push($5)
};LzInstantiator.clearDataReplicationQueue();while(this.nodes&&this.nodes.length<this.clones.length){
this.poolClone()
}},"orderf",function($1,$2){
var $3=this.op_orderf;this.p=$1;var $4=this.xpathQuery($3);this.p=$2;var $5=this.xpathQuery($3);this.p=null;if($4==null||$4==""){
$4="\n"
};if($5==null||$5==""){
$5="\n"
};return this.comp_orderf($4,$5)
},"ascDict",function($1,$2){
if($1.toLowerCase()<$2.toLowerCase()){
return 1
}},"descDict",function($1,$2){
if($1.toLowerCase()>$2.toLowerCase()){
return 1
}},"setOrder",function($1,$2){
if(arguments.length<2){
$2=null
};this.orderpath=null;if($2!=null){
this.setComparator($2)
};this.orderpath=$1;this.op_orderf=this.orderpath;if(this.nodes.length){
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

}}};this.comp_orderf=$1;if(this.orderpath!=null&&this.nodes.length){
this.__LZHandleMultiNodes(this.nodes)
}},"getNewClone",function($1){
if(arguments.length<1){
$1=null
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
},"setDatapath",function($1){
this.setXPath($1)
},"setXPath",function($1){
if(this.__LZpreventXPathUpdate){
return
};(arguments.callee.superclass?arguments.callee.superclass.prototype["setXPath"]:this.nextMethod(arguments.callee,"setXPath")).apply(this,arguments)
},"handleDeletedNode",function($1){
var $2=this.clones[$1];if(this.pooling){
this.detachClone($2);this.clonePool.push($2)
}else{
this.destroyClone($2)
};this.nodes.splice($1,1);this.clones.splice($1,1)
},"getCloneForNode",function($1,$2){
if(arguments.length<2){
$2=null
};var $3=this.clones.length;for(var $4=0;$4<$3;$4++){
if(this.clones[$4].datapath.p==$1){
return this.clones[$4]
}}},"toString",function(){
return "ReplicationManager in "+this.immediateparent
},"setVisible",function($1){
this.visible=$1;var $2=this.clones.length;for(var $3=0;$3<$2;$3++){
this.clones[$3].$lzc$set_visible($1)
};if(this.onvisible.ready){
this.onvisible.sendEvent($1)
}},"__LZcheckChange",function($1){
this.p=this.nodes[0];var $2=(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZcheckChange"]:this.nextMethod(arguments.callee,"__LZcheckChange")).apply(this,arguments);this.p=null;if(!$2){
var $3=$1.who;var $4=this.clones.length;for(var $5=0;$5<$4;$5++){
var $6=this.clones[$5];if($6.datapath.__LZneedsOpUpdate($1)){
$6.datapath.__LZsetData()
};if($3.childOfNode($6.datapath.p,true)){
if($6.datapath.onDocumentChange.ready){
$6.datapath.onDocumentChange.sendEvent($1)
}}}}},"__LZneedsOpUpdate",function($1){
if(arguments.length<1){
$1=null
};return false
},"getContext",function($1){
if(arguments.length<1){
$1=null
};return this.nodes[0]
},"detachClone",function($1){
if($1.isdetatchedclone){
return
};$1.$lzc$set_visible(false);$1.addedToParent=false;var $2=$1.immediateparent.subviews;for(var $3=$2.length-1;$3>=0;$3--){
if($2[$3]==$1){
$2.splice($3,1);break
}};$1.datapath.__LZtrackDel.unregisterAll();if($1.immediateparent.onremovesubview.ready){
$1.immediateparent.onremovesubview.sendEvent($1)
};$1.isdetatchedclone=true;$1.p=null
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
if(arguments.length<1){
$1=false
};var $2=this.clones;var $3=$2.length;for(var $4=0;$4<$3;$4++){
$2[$4].datapath.updateData()
}}],["__LZemptyFuntion",function(){
return
}]);LzDataAttrBind=Class.make("LzDataAttrBind",LzDatapointer,["$lzsc$initialize",function($1,$2,$3){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2);this.setAttr=$2;this.pathparent=$1;this.node=$1.immediateparent;this.setXPath($3);this.rerunxpath=true;if($1.__LZdepChildren==null){
$1.__LZdepChildren=[this]
}else{
$1.__LZdepChildren.push(this)
}},"$pathbinding",true,"setAttr",void 0,"pathparent",void 0,"node",void 0,"__LZsendUpdate",function($1,$2){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};var $3=this.__LZpchanged;if(!(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsendUpdate"]:this.nextMethod(arguments.callee,"__LZsendUpdate")).apply(this,arguments)){
return
};if($3||this.node[this.setAttr]!=this.data||this.parsedPath.operator=="attributes"){
this.node.setAttribute(this.setAttr,this.data==null?null:this.data)
}},"unregisterAll",function(){
var $1=this.pathparent.__LZdepChildren;if($1!=null){
for(var $2=0;$2<$1.length;$2++){
if($1[$2]==this){
$1.splice($2,1);break
}}};this.destroy()
},"setDataContext",function($1,$2){
if(arguments.length<2){
$2=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["setDataContext"]:this.nextMethod(arguments.callee,"setDataContext")).call(this,$1||this.pathparent,$2)
},"updateData",function(){
this.__LZupdateData()
},"__LZupdateData",function($1){
if(arguments.length<1){
$1=false
};var $2=this.parsedPath.operator;if($2!=null){
var $3=this.node[this.setAttr];if(this.data!=$3){
if($2=="nodeName"){
this.setNodeName($3)
}else{
if($2=="__LZgetText"){
this.setNodeText($3)
}else{
if($2=="attributes"){
this.p.setAttrs($3)
}else{
this.setNodeAttribute($2.substring(11),$3)
}}}}}},"toString",function(){
return "binder "+this.xpath
}],null);LzLazyReplicationManager=Class.make("LzLazyReplicationManager",LzReplicationManager,["axis","y","sizeAxis",void 0,"cloneimmediateparent",void 0,"updateDel",void 0,"__LZoldnodelen",void 0,"spacing",0,"mask",null,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"construct",function($1,$2){
this.pooling=true;if($2.pooling!=null){
$2.pooling=true
};if($2.axis!=null){
this.axis=$2.axis
};this.sizeAxis=this.axis=="x"?"width":"height";(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.mask=$1.immediateparent.immediateparent.mask;var $3={ignorelayout:true};if(this.cloneAttrs.options!=null){
$3=new LzInheritedHash(this.cloneAttrs.options)
};var $4=this.clones[0];if($4){
$4.setOption("ignorelayout",true);var $5=$4.immediateparent.layouts;if($5!=null){
for(var $6=0;$6<$5.length;$6++){
$5[$6].removeSubview($4)
}}};this.cloneAttrs.options=$3;var $7=this.getNewClone(true);this.cloneimmediateparent=$7.immediateparent;if(this.initialnodes){
$7.datapath.setClonePointer(this.initialnodes[1])
};this.viewsize=$7[this.sizeAxis];$7.datapath.setClonePointer(null);this.clones.push($7);if($2.spacing==null){
$2.spacing=0
};this.totalsize=this.viewsize+$2.spacing;$7.setAttribute(this.axis,this.totalsize);this.__LZdataoffset=0;this.updateDel=new LzDelegate(this,"__LZhandleUpdate");this.updateDel.register(this.cloneimmediateparent,"on"+this.axis);this.updateDel.register(this.mask,"on"+this.sizeAxis)
},"__LZhandleUpdate",function($1){
this.__LZadjustVisibleClones(null,null)
},"viewsize",0,"totalsize",0,"__LZsetCloneAttrs",function(){
var $1={ignorelayout:true};if(this.cloneAttrs.options!=null){
$1=new LzInheritedHash(this.cloneAttrs.options)
};this.cloneAttrs.options=$1
},"__LZHandleNoNodes",function(){
this.__LZHandleMultiNodes([])
},"__LZadjustVisibleClones",function($1,$2){
var $3=null;if(this.nodes){
$3=this.nodes.length
};if($3!=null){
if(this.__LZoldnodelen!=this.nodes.length){
this.cloneimmediateparent.setAttribute(this.sizeAxis,this.nodes.length*this.totalsize-this.spacing);this.__LZoldnodelen=this.nodes.length
}};if(!(this.mask&&this.mask["hasset"+this.sizeAxis])){
return
};var $4=0;if(this.totalsize!=0){
$4=Math.floor(-this.cloneimmediateparent[this.axis]/this.totalsize)
};if(0>$4){
$4=0
};var $5=0;var $6=this.clones.length;var $7=$4-this.__LZdataoffset;var $8=$4*this.totalsize+this.cloneimmediateparent[this.axis];var $9=0;if(typeof $8=="number"){
$9=1+Math.floor((this.mask[this.sizeAxis]-$8)/this.totalsize)
};if(this.nodes!=null){
if($9+$4>this.nodes.length){
$9=this.nodes.length-$4
}};if($7==0&&$9==$6){
return
};LzInstantiator.enableDataReplicationQueuing();var $10=this.clones;this.clones=[];for(var $11=0;$11<$9;$11++){
var $12=false;if($11+$7<0){
if($9+$7<$6&&$6>0){
$12=$10[--$6]
}else{
$12=this.getNewClone()
}}else{
if($11+$7>=$6){
if($5<$7&&$5<$6){
$12=$10[$5++]
}else{
$12=this.getNewClone()
}}};if($12){
this.clones[$11]=$12;$12.setAttribute(this.axis,($11+$4)*this.totalsize);$12.clonenumber=$4+$11;if(this.nodes){
$12.datapath.setClonePointer(this.nodes[$4+$11])
};if($12.onclonenumber.ready){
$12.onclonenumber.sendEvent($11)
}}else{
this.clones[$11]=$10[$11+$7]
}};while($5<$7&&$5<$6){
var $13=$10[$5++];this.detachClone($13);this.clonePool.push($13)
};while($6>$9+$7&&$6>0){
var $13=$10[--$6];this.detachClone($13);this.clonePool.push($13)
};this.__LZdataoffset=$4;LzInstantiator.clearDataReplicationQueue()
},"toString",function(){
return "Lazy clone manager in "+this.cloneimmediateparent
},"getCloneForNode",function($1,$2){
if(arguments.length<2){
$2=null
};var $3=(arguments.callee.superclass?arguments.callee.superclass.prototype["getCloneForNode"]:this.nextMethod(arguments.callee,"getCloneForNode")).call(this,$1)||null;if(!$3&&!$2){
$3=this.getNewClone();$3.datapath.setClonePointer($1);this.detachClone($3);this.clonePool.push($3)
};return $3
},"getCloneNumber",function($1){
return this.getCloneForNode(this.nodes[$1])
}],null);LzResizeReplicationManager=Class.make("LzResizeReplicationManager",LzLazyReplicationManager,["datasizevar",void 0,"__LZresizeupdating",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=null
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
},"construct",function($1,$2){
this.pooling=false;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments);this.datasizevar="$"+this.getUID()+"track"
},"__LZHandleCloneResize",function($1){
if(!this.datapath.p){
return
};var $2=this.cloneManager;var $3=$2.datasizevar;var $4=this.datapath.p[$3]||$2.viewsize;if($1!=$4){
this.datapath.p[$3]=$1;$2.__LZadjustVisibleClones(null,null)
}},"__LZsetCloneAttrs",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsetCloneAttrs"]:this.nextMethod(arguments.callee,"__LZsetCloneAttrs")).apply(this,arguments);this.cloneAttrs.__LZHandleCloneResize=this.__LZHandleCloneResize;if(!this.cloneAttrs["$delegates"]){
this.cloneAttrs.$delegates=[]
};this.cloneAttrs.$delegates.push("on"+(this.axis=="y"?"height":"width"),"__LZHandleCloneResize",null)
},"getPositionByNode",function($1){
var $2=-this.spacing;var $3;if(this.nodes!=null){
for(var $4=0;$4<this.nodes.length;$4++){
$3=this.nodes[$4];if($1==this.nodes[$4]){
return $2+this.spacing
};$2+=this.spacing+($3[this.datasizevar]||this.viewsize)
}}},"__LZreleaseClone",function($1){
this.detachClone($1);this.clonePool.push($1)
},"__LZadjustVisibleClones",function($1,$2){
if(!this.mask["hasset"+this.sizeAxis]){
return
};if(this.__LZresizeupdating){
return
};this.__LZresizeupdating=true;var $3=this.nodes!=null?this.nodes.length:0;var $4=-this.cloneimmediateparent[this.axis];var $4=0>$4?0:Math.floor($4);var $5=this.mask[this.sizeAxis];var $6=-1;var $7=this.__LZdataoffset;if($2){
while(this.clones.length){
this.poolClone()
};var $8=null;var $9=0
}else{
var $8=this.clones;var $9=$8.length
};this.clones=[];var $10=-this.spacing;var $11=false;var $12=-1;var $13=true;for(var $14=0;$14<$3;$14++){
var $15=this.nodes[$14];var $16=$15[this.datasizevar];var $17=$16==null?this.viewsize:$16;$10+=this.spacing;if(!$11&&$6==-1&&$10-$4+$17>=0){
var $13=$14!=0;$11=true;var $18=$10;$6=$14;var $19=$14-$7;$19=$19>$9?$9:$19;if($19>0){
for(var $20=0;$20<$19;$20++){
var $21=$8[$20];this.__LZreleaseClone($21)
}}}else{
if($11&&$10-$4>$5){
$11=false;$12=$14-$6;var $22=$14-$7;$22=$22<0?0:$22;if($22<$9){
for(var $20=$22;$20<$9;$20++){
var $21=$8[$20];this.__LZreleaseClone($21)
}}}};if($11){
if($14>=$7&&$14<$7+$9){
var $23=$8[$14-$7]
}else{
var $23=null
};this.clones[$14-$6]=$23
};$10+=$17
};var $24=$18;if($13){
$24+=this.spacing
};for(var $14=0;$14<this.clones.length;$14++){
var $15=this.nodes[$14+$6];var $23=this.clones[$14];if(!$23){
$23=this.getNewClone();$23.clonenumber=$14+$6;$23.datapath.setClonePointer($15);if($23.onclonenumber.ready){
$23.onclonenumber.sendEvent($14+$6)
};this.clones[$14]=$23
};this.clones[$14]=$23;$23.setAttribute(this.axis,$24);var $16=$15[this.datasizevar];var $17=$16==null?this.viewsize:$16;if($23[this.sizeAxis]!=$17){
$23.setAttribute(this.sizeAxis,$17,true)
};$24+=$17+this.spacing
};this.__LZdataoffset=$6;this.cloneimmediateparent.setAttribute(this.sizeAxis,$10);this.__LZresizeupdating=false
}],null);ColorUtilsClass=Class.make("ColorUtilsClass",null,["hextoint",function($1){
Debug.info("LzUtils.color.hextoint is deprecated, use Lzutils.hextoint");return LzUtils.hextoint($1)
},"inttohex",function($1){
Debug.info("LzUtils.color.inttohex is deprecated, use Lzutils.inttohex");return LzUtils.inttohex($1)
},"torgb",function($1){
Debug.info("LzUtils.color.torgb is deprecated, use Lzutils.torgb");return LzUtils.torgb($1)
}],null);LzUtilsClass=Class.make("LzUtilsClass",null,["__scopeid",0,"__scopes",[],"getcallbackstr",function($1,$2){
var $3=LzUtils.__scopeid++;if($1.__callbacks==null){
$1.__callbacks={sc:$3}}else{
$1.__callbacks[$3]=$3
};LzUtils.__scopes[$3]=$1;return "if (LzUtils.__scopes["+$3+"]) LzUtils.__scopes["+$3+"]."+$2+".apply(LzUtils.__scopes["+$3+"], [])"
},"getcallbackfunc",function($1,name,args){
var sc=LzUtils.__scopeid++;if($1.__callbacks==null){
$1.__callbacks={sc:sc}}else{
$1.__callbacks[sc]=sc
};LzUtils.__scopes[sc]=$1;var $2=function(){
var $1=LzUtils.__scopes[sc];if($1){
return $1[name].apply($1,args)
}};return $2
},"removecallback",function($1){
if($1.__callbacks!=null){
for(var $2 in $1.__callbacks){
var $3=$1.__callbacks[$2];delete LzUtils.__scopes[$3]
};delete $1.__callbacks
}},"dectohex",function($1,$2){
if(typeof $1=="number"){
var $3=$1.toString(16);var $4=($2?$2:0)-$3.length;while($4>0){
$3="0"+$3;$4--
};return $3
}else{
return $1
}},"color",new ColorUtilsClass(),"hextoint",function($1){
if(typeof $1!="string"){
return $1
};if($1.charAt(0)=="#"){
var $2=parseInt($1.slice(1),16);switch(!isNaN($2)&&$1.length-1){
case 3:
return(($2&3840)<<8|($2&240)<<4|$2&15)*17;
case 6:
return $2;
default:


}};return 0
},"inttohex",function($1){
if(typeof $1=="string"){
$1=$1*1
};if(typeof $1=="number"){
var $2=LzUtils.dectohex($1&16777215,6);$1="#"+$2
};return $1
},"torgb",function($1){
if(typeof $1=="number"){
$1=LzUtils.inttohex($1)
};if(typeof $1!="string"){
return $1
};if($1.length<6){
$1="#"+$1.charAt(1)+$1.charAt(1)+$1.charAt(2)+$1.charAt(2)+$1.charAt(3)+$1.charAt(3)+($1.length>4?$1.charAt(4)+$1.charAt(4):"")
};return "rgb("+parseInt($1.substring(1,3),16)+","+parseInt($1.substring(3,5),16)+","+parseInt($1.substring(5,7),16)+($1.length>7?","+parseInt($1.substring(7,9),16):"")+")"
}],null);var LzUtils=new LzUtilsClass();LzInstantiatorService=Class.make("LzInstantiatorService",LzEventable,["checkQDel",null,"$lzsc$initialize",function(){
this.checkQDel=new LzDelegate(this,"checkQ")
},"halted",false,"isimmediate",false,"isdatareplicating",false,"istrickling",false,"isUpdating",false,"safe",true,"timeout",500,"makeQ",[],"trickleQ",[],"tricklingQ",[],"syncNew",true,"trickletime",10,"datareplq",void 0,"setSafeInstantiation",function($1){
this.safe=$1;if(this.instanceQ.length){
this.timeout=Infinity
}},"requestInstantiation",function($1,$2){
if(this.isimmediate){
this.createImmediate($1,$2.concat())
}else{
var $3=this.newReverseArray($2);if(this.isdatareplicating){
this.datareplq.push($1,$3)
}else{
if(this.istrickling){
this.tricklingQ.push($1,$3)
}else{
this.makeQ.push($1,$3);this.checkUpdate()
}}}},"enableDataReplicationQueuing",function(){
this.isdatareplicating=true;this.datareplq=[]
},"clearDataReplicationQueue",function(){
this.isdatareplicating=false;var $1=this.datareplq;for(var $2=$1.length-1;$2>0;$2-=2){
this.makeQ.push($1[$2-1],$1[$2])
};this.checkUpdate()
},"newReverseArray",function($1){
var $2=$1.length;var $3=Array($2);var $4=0;var $5=$2-1;while($4<$2){
$3[$4]=$1[$5];$4++;$5--
};return $3
},"checkUpdate",function(){
if(!this.isUpdating&&!this.halted){
this.checkQDel.register(LzIdle,"onidle");this.isUpdating=true
}},"checkQ",function($1){
if(arguments.length<1){
$1=null
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
var $5=$1.length;var $6=$1[$5-1];var $7=$1[$5-2];var $8=false;if($7["__LZdeleted"]){
$1.length-=2;continue
};while(new Date().getTime()-$3<$2){
if($5!=$1.length){
break
};if(!$6.length){
$8=true;break
};var $11=$6.pop();if($11){
$7.makeChild($11,true);$4++
}};if($8){
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
var $3=this.trickleQ.length;for(var $4=0;$4<$3;$4+=2){
if(this.trickleQ[$4]==$1){
var $5=this.trickleQ[$4+1];this.trickleQ.splice($4,2);this.createImmediate($1,$5);return
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
}],["LzInstantiator",void 0]);(function(){
with(LzInstantiatorService){
with(LzInstantiatorService.prototype){
LzInstantiatorService.LzInstantiator=new LzInstantiatorService()
}}})();var LzInstantiator=LzInstantiatorService.LzInstantiator;LzGlobalMouseService=Class.make("LzGlobalMouseService",LzEventable,["$lzsc$initialize",function(){

},"onmousemove",LzDeclaredEvent,"onmouseup",LzDeclaredEvent,"onmouseupoutside",LzDeclaredEvent,"onmouseover",LzDeclaredEvent,"onmouseout",LzDeclaredEvent,"onmousedown",LzDeclaredEvent,"onmousedragin",LzDeclaredEvent,"onmousedragout",LzDeclaredEvent,"onclick",LzDeclaredEvent,"__movecounter",0,"__mouseEvent",function($1,$2){
if($1=="onmousemove"){
this.__movecounter++
};var $3=this[$1];if($3){
if($3.ready){
$3.sendEvent($2)
}}else{

}}],["LzGlobalMouse",void 0]);(function(){
with(LzGlobalMouseService){
with(LzGlobalMouseService.prototype){
LzGlobalMouseService.LzGlobalMouse=new LzGlobalMouseService()
}}})();var LzGlobalMouse=LzGlobalMouseService.LzGlobalMouse;LzBrowserService=Class.make("LzBrowserService",null,["$lzsc$initialize",function(){

},"loadURL",function($1,$2,$3){
if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};LzBrowserKernel.loadURL($1,$2,$3)
},"loadJS",function($1,$2){
if(arguments.length<2){
$2=null
};LzBrowserKernel.loadJS.apply(null,arguments)
},"callJS",function($1,$2,$3){
if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};LzBrowserKernel.callJS.apply(null,arguments)
},"getVersion",function(){
return LzBrowserKernel.getVersion()
},"getLoadURL",function(){
return LzBrowserKernel.getLoadURL()
},"getInitArg",function($1){
return LzBrowserKernel.getInitArg($1)
},"showMenu",function($1){
LzBrowserKernel.showMenu($1)
},"setClipboard",function($1){
LzBrowserKernel.setClipboard($1)
},"isAAActive",function(){
return LzBrowserKernel.isAAActive()
},"updateAccessibility",function(){
LzBrowserKernel.updateAccessibility()
},"postToLps",true,"parsedloadurl",false,"defaultPortNums",{http:80,https:443},"getBaseURL",function($1,$2){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};var $3=this.getLoadURLAsLzURL();if($1){
$3.protocol="https"
};if($2){
$3.port=$2
};if($1&&$2==null){
$3.port=this.defaultPortNums[$3.protocol]
};$3.query=null;return $3
},"getLoadURLAsLzURL",function(){
if(!this.parsedloadurl){
this.parsedloadurl=new LzURL(this.getLoadURL())
};return this.parsedloadurl.dupe()
},"toAbsoluteURL",function($1,$2){
if($1.indexOf("://")>-1||$1.indexOf("/@WEBAPP@/")==0||$1.indexOf("file:")==0){
return $1
};var $3="";var $4=this.getLoadURLAsLzURL();if($1.indexOf(":")>-1){
var $5=$1.indexOf(":");var $6=$4.protocol=="https";$4.protocol=$1.substring(0,$5);if($2||$6){
if($4.protocol=="http"){
$4.protocol="https"
}};var $7=$1.substring($5+1,$1.length);if($7.charAt(0)=="/"){
$4.path=$1.substring($5+1);$4.file=null
}else{
$4.file=$1.substring($5+1)
};$4.query=null
}else{
if($1.charAt(0)=="/"){
$4.path=$1;$4.file=null
}else{
$4.file=$1
};$4.query=null
};return $4.toString()
},"xmlEscape",function($1){
return LzDataElement.__LZXMLescape($1)
},"urlEscape",function($1){
return escape($1)
},"urlUnescape",function($1){
return unescape($1.split("+").join(" "))
},"usePost",function(){
return this.postToLps&&this.supportsPost()
},"supportsPost",function(){
return true
}],["LzBrowser",void 0]);(function(){
with(LzBrowserService){
with(LzBrowserService.prototype){
LzBrowserService.LzBrowser=new LzBrowserService()
}}})();var LzBrowser=LzBrowserService.LzBrowser;LzContextMenu=Class.make("LzContextMenu",LzNode,["$lzsc$initialize",function($1){
if(arguments.length<1){
$1=null
};this.kernel=new LzContextMenuKernel(this);this.items=[];this.setDelegate($1)
},"onmenuopen",LzDeclaredEvent,"kernel",null,"items",null,"setDelegate",function($1){
this.kernel.setDelegate($1)
},"addItem",function($1){
this.items.push($1);this.kernel.addItem($1)
},"hideBuiltInItems",function(){
this.kernel.hideBuiltInItems()
},"clearItems",function(){
this.items=[]
},"getItems",function(){
return this.items
},"makeMenuItem",function($1,$2){
var $3=new LzContextMenuItem($1,$2);return $3
}],null);LzContextMenuItem=Class.make("LzContextMenuItem",LzNode,["$lzsc$initialize",function($1,$2){
this.kernel=new LzContextMenuItemKernel(this,$1,$2)
},"onselect",LzDeclaredEvent,"kernel",null,"setDelegate",function($1){
this.kernel.setDelegate($1)
},"setCaption",function($1){
this.kernel.setCaption($1)
},"getCaption",function(){
return this.kernel.getCaption()
},"setEnabled",function($1){
this.kernel.setEnabled($1)
},"setSeparatorBefore",function($1){
this.kernel.setSeparatorBefore($1)
},"setVisible",function($1){
this.kernel.setVisible($1)
}],null);(function(){
with(LzContextMenuItem){
with(LzContextMenuItem.prototype){

}}})();LzModeManagerService=Class.make("LzModeManagerService",LzNode,["onmode",LzDeclaredEvent,"__LZlastclick",null,"__LZlastClickTime",0,"willCall",false,"eventsLocked",false,"modeArray",new Array(),"makeModal",function($1){
if(this.modeArray.length==0||!this.hasMode($1)){
this.modeArray.push($1);if(this.onmode.ready){
this.onmode.sendEvent($1)
};var $2=LzFocus.getFocus();if($2&&!$2.childOf($1)){
LzFocus.clearFocus()
}}},"release",function($1){
for(var $2=this.modeArray.length-1;$2>=0;$2--){
if(this.modeArray[$2]==$1){
this.modeArray.splice($2,this.modeArray.length-$2);var $3=this.modeArray[$2-1];if(this.onmode.ready){
this.onmode.sendEvent($3||null)
};var $4=LzFocus.getFocus();if($3&&$4&&!$4.childOf($3)){
LzFocus.clearFocus()
};return
}}},"releaseAll",function(){
this.modeArray=new Array();if(this.onmode.ready){
this.onmode.sendEvent(null)
}},"handleMouseEvent",function($1,$2){
if($2=="onmouseup"){
LzTrack.__LZmouseup(null)
};var $3=true;var $4=false;if($1==null){
$1=this.__findInputtextSelection()
};LzGlobalMouse.__mouseEvent($2,$1);if(this.eventsLocked==true){
return
};var $5=this.modeArray.length-1;while($3&&$5>=0){
var $6=this.modeArray[$5--];if($1&&$1.childOf($6)){
break
}else{
if($6){
$3=$6.passModeEvent?$6.passModeEvent($2,$1):null
}}};if($3){
if($2=="onclick"){
if(this.__LZlastclick==$1&&$1.ondblclick.ready&&LzTimeKernel.getTimer()-this.__LZlastClickTime<$1.DOUBLE_CLICK_TIME){
$2="ondblclick";this.__LZlastclick=null
}else{
this.__LZlastclick=$1;this.__LZlastClickTime=LzTimeKernel.getTimer()
}};if($1){
$1.mouseevent($2)
};if($2=="onmousedown"){
LzFocus.__LZcheckFocusChange($1)
}}},"__LZallowFocus",function($1){
var $2=this.modeArray.length;return $2==0||$1.childOf(this.modeArray[$2-1])
},"globalLockMouseEvents",function(){
this.eventsLocked=true
},"globalUnlockMouseEvents",function(){
this.eventsLocked=false
},"hasMode",function($1){
for(var $2=this.modeArray.length-1;$2>=0;$2--){
if($1==this.modeArray[$2]){
return true
}};return false
},"getModalView",function(){
return this.modeArray[this.modeArray.length-1]||null
},"__findInputtextSelection",function(){
return LzInputTextSprite.findSelection()
},"rawMouseEvent",function($1,$2){
if($1=="onmousemove"){
LzGlobalMouse.__mouseEvent("onmousemove",null)
}else{
this.handleMouseEvent($2,$1)
}}],null);var LzModeManager=new LzModeManagerService();LzMouseKernel.setCallback(LzModeManager,"rawMouseEvent");LzCursorService=Class.make("LzCursorService",null,["$lzsc$initialize",function(){
if(LzCursorService.LzCursor){
throw new Error("There can be only one LzCursor")
}},"showHandCursor",function($1){
LzMouseKernel.showHandCursor($1)
},"setCursorGlobal",function($1){
LzMouseKernel.setCursorGlobal($1)
},"lock",function(){
LzMouseKernel.lock()
},"unlock",function(){
LzMouseKernel.unlock()
},"restoreCursor",function(){
LzMouseKernel.restoreCursor()
}],["LzCursor",void 0]);var LzCursor=new LzCursorService();LzCursorService.LzCursor=LzCursor;LzURL=Class.make("LzURL",null,["protocol",null,"host",null,"port",null,"path",null,"file",null,"query",null,"fragment",null,"_parsed",null,"$lzsc$initialize",function(){
var $1=new Array();for(var $2=0;$2<arguments.length;$2++){
$1.push(arguments[$2])
};this.protocol=null;this.host=null;this.port=null;this.path=null;this.file=null;this.query=null;this.fragment=null;if($1.length>0){
var $3=$1[0];if($3!=null){
this.parseURL($3)
}}},"parseURL",function($1){
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
$1+="//"+this.host;if(null!=this.port&&LzBrowser.defaultPortNums[this.protocol]!=this.port){
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
var $3=$1.dupe();if($1.protocol==null){
$3.protocol=$2.protocol
};if($1.host==null){
$3.host=$2.host
};if($1.port==null){
$3.port=$2.port
};if($1.path==null){
$3.path=$2.path
};if($1.file==null){
$3.file=$2.file
};if($1.query==null){
$3.query=$2.query
};if($1.fragment==null){
$3.fragment=$2.fragment
};return $3
}]);LzKeysService=Class.make("LzKeysService",LzNode,["$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);LzKeyboardKernel.setCallback(this,"__keyEvent");this.keyCodes["add"]=107;this.keyCodes["delete"]=46;this.keyCodes["0"]=48;this.keyCodes["1"]=49;this.keyCodes["2"]=50;this.keyCodes["3"]=51;this.keyCodes["4"]=52;this.keyCodes["5"]=53;this.keyCodes["6"]=54;this.keyCodes["7"]=55;this.keyCodes["8"]=56;this.keyCodes["9"]=57;this.keyCodes[")"]=48;this.keyCodes["!"]=49;this.keyCodes["@"]=50;this.keyCodes["#"]=51;this.keyCodes["$"]=52;this.keyCodes["%"]=53;this.keyCodes["^"]=54;this.keyCodes["&"]=55;this.keyCodes["*"]=56;this.keyCodes["("]=57;this.keyCodes[";"]=186;this.keyCodes[":"]=186;this.keyCodes["="]=187;this.keyCodes["+"]=187;this.keyCodes["<"]=188;this.keyCodes[","]=188;this.keyCodes["-"]=189;this.keyCodes["_"]=189;this.keyCodes[">"]=190;this.keyCodes["."]=190;this.keyCodes["/"]=191;this.keyCodes["?"]=191;this.keyCodes["`"]=192;this.keyCodes["~"]=192;this.keyCodes["["]=219;this.keyCodes["{"]=219;this.keyCodes["\\"]=220;this.keyCodes["|"]=220;this.keyCodes["]"]=221;this.keyCodes["}"]=221;this.keyCodes['"']=222;this.keyCodes["'"]=222;this.keyCodes["IME"]=229
},"downKeysHash",{},"downKeysArray",[],"keycombos",{},"onkeydown",LzDeclaredEvent,"onkeyup",LzDeclaredEvent,"onmousewheeldelta",LzDeclaredEvent,"codemap",{shift:16,control:17,alt:18},"__keyEvent",function($1,$2,$3){
for(var $4 in $1){
var $5=$1[$4];if(this.codemap[$4]!=null){
$2=this.codemap[$4]
};if($5){
this.gotKeyDown($2)
}else{
this.gotKeyUp($2)
}}},"gotKeyDown",function($1,$2){
if(arguments.length<2){
$2=null
};if(this.downKeysArray.length>0){
var $3=null;for(var $4=this.downKeysArray.length-1;$4>=0;$4--){
var $5=this.downKeysArray[$4];if($5==$1){
continue
}}};var $6=!this.downKeysHash[$1];if($6){
this.downKeysHash[$1]=true;this.downKeysArray.push($1)
};if($6||$2!="extra"){
if(this.downKeysHash[229]!=true){
if(this.onkeydown.ready){
this.onkeydown.sendEvent($1)
}}};if($6){
var $7=this.keycombos;var $8=this.downKeysArray;$8.sort();for(var $4=0;$4<$8.length&&$7!=null;$4++){
$7=$7[$8[$4]]
};if($7!=null&&("delegates" in $7)){
for(var $4=0;$4<$7.delegates.length;$4++){
$7.delegates[$4].execute(this.downKeysArray)
}}}},"gotKeyUp",function($1){
if(!this.downKeysHash[$1]){

};if(this.downKeysHash[229]!=true&&!this.downKeysHash[$1]){
this.gotKeyDown($1)
};delete this.downKeysHash[$1];this.downKeysArray=[];for(var $2 in this.downKeysHash){
this.downKeysArray.push($2)
};if(this.onkeyup.ready){
this.onkeyup.sendEvent($1)
}},"isKeyDown",function($1){
if(typeof $1=="string"){
return this.downKeysHash[this.keyCodes[$1.toLowerCase()]]==true
}else{
var $2=true;for(var $3=0;$3<$1.length;$3++){
$2=$2&&this.downKeysHash[this.keyCodes[$1[$3].toLowerCase()]]==true
};return $2
}},"callOnKeyCombo",function($1,$2){
var $3=[];for(var $4=0;$4<$2.length;$4++){
$3.push(this.keyCodes[$2[$4].toLowerCase()])
};$3.sort();var $5=this.keycombos;for(var $4=0;$4<$3.length;$4++){
if($5[$3[$4]]==null){
$5[$3[$4]]={};$5[$3[$4]].delegates=[]
};$5=$5[$3[$4]]
};$5.delegates.push($1)
},"removeKeyComboCall",function($1,$2){
var $3=[];for(var $4=0;$4<$2.length;$4++){
$3.push(this.keyCodes[$2[$4].toLowerCase()])
};$3.sort();var $5=this.keycombos;for(var $4=0;$4<$3.length;$4++){
if($5[$3[$4]]==null){
return false
};$5=$5[$3[$4]]
};for(var $4=$5.delegates.length-1;$4>=0;$4--){
if($5.delegates[$4]==$1){
$5.delegates.splice($4,1)
}}},"enableEnter",function($1){

},"mousewheeldelta",0,"__mousewheelEvent",function($1){
this.mousewheeldelta=$1;if(this.onmousewheeldelta.ready){
this.onmousewheeldelta.sendEvent($1)
}},"keyCodes",{a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,numbpad0:96,numbpad1:97,numbpad2:98,numbpad3:99,numbpad4:100,numbpad5:101,numbpad6:102,numbpad7:103,numbpad8:104,numbpad9:105,multiply:106,enter:13,subtract:109,decimal:110,divide:111,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123,backspace:8,tab:9,clear:12,enter:13,shift:16,control:17,alt:18,capslock:20,esc:27,spacebar:32,pageup:33,pagedown:34,end:35,home:36,leftarrow:37,uparrow:38,rightarrow:39,downarrow:40,insert:45,help:47,numlock:144},"gotLastFocus",function($1){
LzKeyboardKernel.gotLastFocus()
}],null);var LzKeys=new LzKeysService();if(Lz["mousewheel"]){
Lz.mousewheel.setCallback(LzKeys,"__mousewheelEvent")
};LzAudioService=Class.make("LzAudioService",null,["capabilities",LzSprite.prototype.capabilities,"playSound",function($1){
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

}},"setVolume",function($1){
if(this.capabilities.audio){
LzAudioKernel.setVolume($1)
}else{

}},"getPan",function(){
if(this.capabilities.audio){
return LzAudioKernel.getPan()
}else{

}},"setPan",function($1){
if(this.capabilities.audio){
LzAudioKernel.setPan($1)
}else{

}},"__warnCapability",function($1){
Debug.warn("The %s runtime does not support %s",canvas["runtime"],$1)
}],null);var LzAudio=new LzAudioService();LzHistoryService=Class.make("LzHistoryService",LzNode,["isReady",false,"ready",false,"onready",LzDeclaredEvent,"persist",false,"_persistso",null,"offset",0,"__lzdirty",false,"__lzhistq",[],"__lzcurrstate",{},"onoffset",LzDeclaredEvent,"receiveHistory",function($1){
if(this.persist&&!this._persistso){
this.__initPersist()
};var $2=this.__lzhistq.length;var $3=$1*1;if(!$3){
$3=0
}else{
if($3>$2-1){
$3=$2
}};var $4=this.__lzhistq[$3];for(var $5 in $4){
var $6=$4[$5];global[$6.c].setAttribute($6.n,$6.v)
};this.setAttribute("offset",$3);return $3*1
},"receiveEvent",function($1,$2){
canvas.setAttribute($1,$2)
},"getCanvasAttribute",function($1){
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
this.commit();if(!$1){
$1=1
};var $2=this.offset+$1;if(0>=$2){
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
};var $1=this._persistso.data;if($1){
this.__lzhistq=[];for(var $2 in $1){
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
if(LzView.prototype.capabilities.persistence){
this.persist=$1;this.__initPersist()
}else{

}},"__start",function(){
this.isReady=true;this.setAttribute("ready",true)
}],null);var LzHistory=new LzHistoryService();LzTrackService=Class.make("LzTrackService",LzEventable,["__LZreg",new Object(),"__LZactivegroups",null,"__LZtrackDel",null,"__LZoptimizeforaxis","x","__LZmouseupDel",null,"__LZlastmouseup",null,"__LZlasthit",null,"__LZdestroydel",null,"$lzsc$initialize",function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this);this.__LZtrackDel=new LzDelegate(this,"__LZtrack");this.__LZmouseupDel=new LzDelegate(this,"__LZmouseup",LzGlobalMouse,"onmouseup")
},"register",function($1,$2){
if($1==null||$2==null){
return
};if(typeof this.__LZreg[$2]=="undefined"){
this.__LZreg[$2]=[];this.__LZreg[$2].__LZlasthit=0
};this.__LZreg[$2].push($1);if(!this.__LZdestroydel){
this.__LZdestroydel=new LzDelegate(this,"__LZdestroyitem")
};this.__LZdestroydel.register($1,"ondestroy")
},"unregister",function($1,$2){
if($1==null||$2==null){
return
};var $3=this.__LZreg[$2];if($3){
for(var $4=0;$4<$3.length;$4++){
if($3[$4]==$1){
$3.splice($4,1)
}};if($3.length==0){
delete this.__LZreg[$2]
}};this.__LZdestroydel.unregisterFrom($1.ondestroy)
},"__LZdestroyitem",function($1){
for(var $2 in this.__LZreg){
this.unregister($1,$2)
}},"activate",function($1){
if(this.__LZactivegroups==null){
this.__LZactivegroups=[];this.__LZtrackDel.register(LzIdle,"onidle")
};var $2=false;for(var $3 in this.__LZactivegroups){
if(this.__LZactivegroups[$3]==this.__LZreg[$1]){
$2=true
}};if(!$2){
this.__LZactivegroups.push(this.__LZreg[$1])
}},"deactivate",function($1){
for(var $2 in this.__LZactivegroups){
if(this.__LZactivegroups[$2]==this.__LZreg[$1]){
this.__LZactivegroups.splice($2,1)
}};if(this.__LZactivegroups==[]){
this.__LZtrackDel.unregisterAll()
};if(typeof this.__LZreg[$1]!="undefined"){
this.__LZreg[$1].__LZlasthit=0
}},"__LZtopview",function($1,$2){
var $3=$2;var $4=$1;while($4.nodeLevel<$3.nodeLevel){
$3=$3.immediateparent;if($3==$1){
return $2
}};while($3.nodeLevel<$4.nodeLevel){
$4=$4.immediateparent;if($4==$2){
return $1
}};while($4.immediateparent!=$3.immediateparent){
$4=$4.immediateparent;$3=$3.immediateparent
};if($4.getZ()>$3.getZ()){
return $1
}else{
return $2
}},"__LZfindTopmost",function($1){
var $2=$1[0];for(var $3=1;$3<$1.length;$3++){
$2=this.__LZtopview($2,$1[$3])
};return $2
},"__LZtrackgroup",function($1,$2){
for(var $3=0;$3<$1.length;$3++){
var $4=$1[$3];if($4.visible){
var $5=$4.getMouse("x");if($5>0&&$5<$4.width){
var $6=$4.getMouse("y");if($6>0&&$6<$4.height){
$2.push($4)
}}}}},"__LZtrack",function($1){
var $2=false;var $3=[];for(var $4 in this.__LZactivegroups){
var $5=[];var $6=this.__LZactivegroups[$4];if($6){
this.__LZtrackgroup($6,$5)
};if(!$5.length&&$6&&$6.__LZlasthit){
if($6.__LZlasthit.onmousetrackout&&$6.__LZlasthit.onmousetrackout.ready){
$6.__LZlasthit.onmousetrackout.sendEvent($6.__LZlasthit)
};$6.__LZlasthit=0
}else{
var $7=this.__LZfindTopmost($5);if($7&&$7!=$6.__LZlasthit){
if($6.__LZlasthit.onmousetrackout&&$6.__LZlasthit.onmousetrackout.ready){
$6.__LZlasthit.onmousetrackout.sendEvent($6.__LZlasthit)
};$2=true;$3.push($7);$6.__LZlasthit=$7
}}};if($2){
for(var $4=0;$4<$3.length;$4++){
var $8=$3[$4];if($8.onmousetrackover.ready){
$8.onmousetrackover.sendEvent($8)
}}}},"__LZmouseup",function($1){
for(var $2 in this.__LZactivegroups){
var $3=this.__LZactivegroups[$2];if($3&&$3.__LZlasthit.onmousetrackup&&$3.__LZlasthit.onmousetrackup.ready){
if(this["__LZlastmouseup"]==$3.__LZlasthit){
this.__LZlastmouseup=null
}else{
$3.__LZlasthit.onmousetrackup.sendEvent(this.__LZlasthit);this.__LZlastmouseup=$3.__LZlasthit
}}}}],null);var LzTrack=new LzTrackService();LzIdleService=Class.make("LzIdleService",LzEventable,["coi",void 0,"regNext",false,"removeCOI",null,"$lzsc$initialize",function(){
this.coi=new Array();this.removeCOI=new LzDelegate(this,"removeCallIdleDelegates");LzIdleKernel.addCallback(this,"__idleupdate")
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
}}],["LzIdle",void 0]);(function(){
with(LzIdleService){
with(LzIdleService.prototype){
LzIdleService.LzIdle=new LzIdleService()
}}})();var LzIdle=LzIdleService.LzIdle;LzCSSStyleRule=Class.make("LzCSSStyleRule",null,["$lzsc$initialize",function(){

},"properties",null,"selector",null,"specificity",0,"parsed",null,"getSpecificity",function(){
if(!this.specificity){
if(this.parsed.type==LzCSSStyle._sel_compound){
for(var $1=0;$1<this.parsed.length;$1++){
this.specificity+=LzCSSStyle.getSelectorSpecificity(this.parsed[$1])
}}else{
this.specificity=LzCSSStyle.getSelectorSpecificity(this.parsed)
}};return this.specificity
},"_getSimpleSelectorSpecificity",function($1,$2){
var $3=$1[$2];if($2=="simpleselector"){
return 1
};if($3.indexOf("#")>=0){
return 100
};if($3.indexOf("[")>=0){
return 10
};return 1
}],null);LzCSSStyleClass=Class.make("LzCSSStyleClass",null,["$lzsc$initialize",function(){

},"getComputedStyle",function($1){
var $2=new LzCSSStyleDeclaration();$2.setNode($1);return $2
},"getPropertyValueFor",function($1,$2){
if(!$1||!$2){
return
};var $3=$1;while($3!=canvas){
if(!$3.__LZPropertyCache){
$3.__LZPropertyCache={}}else{
var $4=$3.__LZPropertyCache[$2];if($4!=null){
return $4
}};var $5=$3.__LZRuleCache;if(!$5){
$5=new Array();var $6;for(var $7=this._rules.length-1;$7>=0;$7--){
$6=this._rules[$7];var $8=$6.parsed;if($8.type==this._sel_compound){
var $9=$3;var $10=$8.length-1;var $11=true;var $12=false;while($9!=canvas){
var $13=$8[$10];var $14=$13.type;if($14==this._sel_star||$14==this._sel_id&&$13.id==$9.id||$14==this._sel_tag&&(($13.classname in lz)&&$9 instanceof lz[$13.classname]||($13.classname in global)&&$9 instanceof global[$13.classname])||$14==this._sel_attribute&&$9[$13.attrname]==$13.attrvalue||$14==this._sel_tagAndAttr&&$9[$13.attrname]==$13.attrvalue&&(($13.classname in lz)&&$9 instanceof lz[$13.classname]||($13.classname in global)&&$9 instanceof global[$13.classname])||$14==this._sel_compound&&this._compoundSelectorApplies($13,$9)){
if($10--==0){
$12=true;break
}}else{
if($11){
$12=false;break
}};$9=$9.parent;$11=false
};if($12){
$5.push($6)
}}else{
if($8.type==this._sel_star||$8.type==this._sel_id&&$8.id==$3.id||$8.type==this._sel_tag&&(($8.classname in lz)&&$3 instanceof lz[$8.classname]||($8.classname in global)&&$3 instanceof global[$8.classname])||$8.type==this._sel_attribute&&$3[$8.attrname]==$8.attrvalue||$8.type==this._sel_tagAndAttr&&$3[$8.attrname]==$8.attrvalue&&(($8.classname in lz)&&$3 instanceof lz[$8.classname]||($8.classname in global)&&$3 instanceof global[$8.classname])){
$5.push($6)
}}};var $15=$3.name!=null?this._nameRules[$3.name]:null;if($15){
for(var $7=$15.length-1;$7>=0;$7--){
$6=$15[$7];var $8=$6.parsed;if($8.type==this._sel_compound){
var $9=$3;var $10=$8.length-1;var $11=true;var $12=false;while($9!=canvas){
var $13=$8[$10];$14=$13.type;if($14==this._sel_star||$14==this._sel_id&&$13.id==$9.id||$14==this._sel_tag&&(($13.classname in lz)&&$9 instanceof lz[$13.classname]||($13.classname in global)&&$9 instanceof global[$13.classname])||$14==this._sel_attribute&&$9[$13.attrname]==$13.attrvalue||$14==this._sel_tagAndAttr&&$9[$13.attrname]==$13.attrvalue&&(($13.classname in lz)&&$9 instanceof lz[$13.classname]||($13.classname in global)&&$9 instanceof global[$13.classname])||$14==this._sel_compound&&this._compoundSelectorApplies($13,$9)){
if($10--==0){
$12=true;break
}}else{
if($11){
$12=false;break
}};$9=$9.parent;$11=false
};if($12){
$5.push($6)
}}else{
if($8.type==this._sel_star||$8.type==this._sel_id&&$8.id==$3.id||$8.type==this._sel_tag&&(($8.classname in lz)&&$3 instanceof lz[$8.classname]||($8.classname in global)&&$3 instanceof global[$8.classname])||$8.type==this._sel_attribute&&$3[$8.attrname]==$8.attrvalue||$8.type==this._sel_tagAndAttr&&$3[$8.attrname]==$8.attrvalue&&(($8.classname in lz)&&$3 instanceof lz[$8.classname]||($8.classname in global)&&$3 instanceof global[$8.classname])){
$5.push($6)
}}}};$5.sort(this.__compareSpecificity);$3.__LZRuleCache=$5
};var $16=$5.length;var $7=0;while($7<$16){
var $17=$5[$7++].properties;if($2 in $17){
$4=$17[$2];$3.__LZPropertyCache[$2]=$4;break
}};if($4!=null){
return $4
};$3=$3.immediateparent
}},"getSelectorSpecificity",function($1){
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
if(!$1.specificity){
if(!$1.specificity){
if($1.parsed.type==LzCSSStyle._sel_compound){
for(var $3=0;$3<$1.parsed.length;$3++){
switch($1.parsed[$3].type){
case LzCSSStyle._sel_tag:
case LzCSSStyle._sel_star:
$1.specificity+=1;break;
case LzCSSStyle._sel_id:
$1.specificity+=100;break;
case LzCSSStyle._sel_attribute:
$1.specificity+=10;break;
case LzCSSStyle._sel_tagAndAttr:
$1.specificity+=11;break;

}}}else{
switch($1.parsed.type){
case LzCSSStyle._sel_tag:
case LzCSSStyle._sel_star:
$1.specificity=1;break;
case LzCSSStyle._sel_id:
$1.specificity=100;break;
case LzCSSStyle._sel_attribute:
$1.specificity=10;break;
case LzCSSStyle._sel_tagAndAttr:
$1.specificity=11;break;

}}}};if(!$2.specificity){
if(!$2.specificity){
if($2.parsed.type==LzCSSStyle._sel_compound){
for(var $3=0;$3<$2.parsed.length;$3++){
switch($2.parsed[$3].type){
case LzCSSStyle._sel_tag:
case LzCSSStyle._sel_star:
$2.specificity+=1;break;
case LzCSSStyle._sel_id:
$2.specificity+=100;break;
case LzCSSStyle._sel_attribute:
$2.specificity+=10;break;
case LzCSSStyle._sel_tagAndAttr:
$2.specificity+=11;break;

}}}else{
switch($2.parsed.type){
case LzCSSStyle._sel_tag:
case LzCSSStyle._sel_star:
$2.specificity=1;break;
case LzCSSStyle._sel_id:
$2.specificity=100;break;
case LzCSSStyle._sel_attribute:
$2.specificity=10;break;
case LzCSSStyle._sel_tagAndAttr:
$2.specificity=11;break;

}}}};var $4=$1.specificity;var $5=$2.specificity;if($4==$5){
if($1.parsed.type==LzCSSStyle._sel_compound&&$2.parsed.type==LzCSSStyle._sel_compound){
for(var $3=0;$3<$1.parsed.length;$3++){
if(!$1.parsed[$3]||!$2.parsed[$3]){
break
};if(!$1.parsed[$3].classname||!$2.parsed[$3].classname||$1.parsed[$3].classname==$2.parsed[$3].classname){
continue
};var $6=lz[$1.parsed[$3].classname];var $7=lz[$2.parsed[$3].classname];return $6&&$7&&("prototype" in $6)&&$6.prototype instanceof $7?-1:1
}};if($1.parsed.classname&&$2.parsed.classname&&$1.parsed.classname!=$2.parsed.classname){
var $6=lz[$1.parsed.classname];var $7=lz[$2.parsed.classname];return $6&&$7&&("prototype" in $6)&&$6.prototype instanceof $7?-1:1
}else{
return $1._lexorder<$2._lexorder?1:-1
}};return $4<$5?1:-1
},"_printRuleArray",function($1){
for(var $2=0;$2<$1.length;$2++){
Debug.write($2,$1[$2])
}},"_compoundSelectorApplies",function($1,$2){
var $3=$2;var $4=$1.length-1;var $5=true;var $6=false;while($3!=canvas){
var $7=$1[$4];var $8=$7.type;if($8==this._sel_star||$8==this._sel_id&&$7.id==$3.id||$8==this._sel_tag&&(($7.classname in lz)&&$3 instanceof lz[$7.classname]||($7.classname in global)&&$3 instanceof global[$7.classname])||$8==this._sel_attribute&&$3[$7.attrname]==$7.attrvalue||$8==this._sel_tagAndAttr&&$3[$7.attrname]==$7.attrvalue&&(($7.classname in lz)&&$3 instanceof lz[$7.classname]||($7.classname in global)&&$3 instanceof global[$7.classname])||$8==this._sel_compound&&this._compoundSelectorApplies($7,$3)){
if($4--==0){
$6=true;break
}}else{
if($5){
$6=false;break
}};$3=$3.parent;$5=false
};return $6
},"_sel_unknown",0,"_sel_star",1,"_sel_id",2,"_sel_tag",3,"_sel_compound",4,"_sel_attribute",5,"_sel_tagAndAttr",6,"_rules",new Array(),"_nameRules",{},"_rulenum",0,"_addRule",function($1){
$1._lexorder=this._rulenum++;var $2=$1.selector;$1.parsed=null;var $3;if($2 instanceof Array){
$1.parsed=[];$1.parsed.type=this._sel_compound;for(var $4=0;$4<$2.length;$4++){
$1.parsed.push(this._parseSelector($2[$4]))
};$3=$1.parsed[$1.parsed.length-1]
}else{
$1.parsed=this._parseSelector($2);$3=$1.parsed
};if(($3.type==this._sel_attribute||$3.type==this._sel_tagAndAttr)&&$3.attrname=="name"){
var $5=$3.attrvalue;if(!this._nameRules[$5]){
this._nameRules[$5]=[]
};this._nameRules[$5].push($1)
}else{
this._rules.push($1)
}},"_parseSelector",function($1){
switch(typeof $1){
case "object":
if($1.simpleselector){
$1.type=this._sel_tagAndAttr;$1.classname=this._normalizeClassname($1.simpleselector)
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
$2.type=this._sel_tag;$2.classname=this._normalizeClassname($1)
}};return $2
},"_normalizeClassname",function($1){
switch($1){
case "view":
return "LzView";
case "animator":
return "LzAnimator";
case "animatorgroup":
return "LzAnimatorGroup";
case "canvas":
return "LzCanvas";
case "drawview":
return "LzDrawView";
case "inputtext":
return "LzInputText";
case "layout":
return "LzLayout";
case "node":
return "LzNode";
case "state":
return "LzState";
case "text":
return "LzText";
default:
return $1;

}}],null);var LzCSSStyle=new LzCSSStyleClass();LzCSSStyleDeclaration=Class.make("LzCSSStyleDeclaration",null,["$lzsc$initialize",function(){

},"_node",null,"getPropertyValue",function($1){
return LzCSSStyle.getPropertyValueFor(this._node,$1)
},"setNode",function($1){
this._node=$1
}],null);(function(){
with(LzCSSStyleDeclaration){
with(LzCSSStyleDeclaration.prototype){

}}})();LzStyleSheet=Class.make("LzStyleSheet",null,["$lzsc$initialize",function($1,$2,$3,$4){
this.type=$4;this.disabled=false;this.ownerNode=null;this.parentStyleSheet=null;this.href=$2;this.title=$1;this.media=$3
},"type",null,"disabled",null,"ownerNode",null,"parentStyleSheet",null,"href",null,"title",null,"media",null],null);LzCSSStyleSheet=Class.make("LzCSSStyleSheet",LzStyleSheet,["$lzsc$initialize",function($1,$2,$3,$4,$5,$6){
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
}],null);LzFocusService=Class.make("LzFocusService",LzEventable,["onfocus",LzDeclaredEvent,"onescapefocus",LzDeclaredEvent,"lastfocus",null,"csel",null,"cseldest",null,"$lzsc$initialize",function(){

},"initialize",function(){
this.upDel=new LzDelegate(LzFocus,"gotKeyUp",LzKeys,"onkeyup");this.downDel=new LzDelegate(LzFocus,"gotKeyDown",LzKeys,"onkeydown");this.lastfocusDel=new LzDelegate(LzKeys,"gotLastFocus",LzFocus,"onescapefocus")
},"upDel",void 0,"downDel",void 0,"lastfocusDel",void 0,"focuswithkey",false,"__LZskipblur",false,"__LZsfnextfocus",-1,"__LZsfrunning",false,"gotKeyUp",function($1){
if(this.csel&&this.csel.onkeyup.ready){
this.csel.onkeyup.sendEvent($1)
}},"gotKeyDown",function($1){
if(this.csel&&this.csel.onkeydown.ready){
this.csel.onkeydown.sendEvent($1)
};if($1==LzKeys.keyCodes.tab){
if(LzKeys.isKeyDown("shift")){
this.prev()
}else{
this.next()
}}},"setNextKey",function($1){

},"setPrevKey",function($1){

},"__LZcheckFocusChange",function($1){
if($1&&$1.focusable){
this.setFocus($1,false)
}},"setFocus",function($1,$2){
if(arguments.length<2){
$2=null
};if(this.__LZsfrunning){
this.__LZsfnextfocus=$1;return
};if(this.cseldest==$1){
return
};if(this.csel&&this.csel.shouldYieldFocus&&!this.csel.shouldYieldFocus()){
return
};var $3=this.csel;if($3){
$3.blurring=true
};this.__LZsfnextfocus=-1;this.__LZsfrunning=true;if($1&&!$1.focusable){
$1=this.getNext($1)
};this.cseldest=$1;if($2!=null){
this.focuswithkey=$2
};if(!this.__LZskipblur){
this.__LZskipblur=true;if(this.csel&&this.csel.onblur.ready){
this.csel.onblur.sendEvent($1)
};if(this.__LZsfnextfocus!=-1){
this.__LZsfrunning=false;this.setFocus(this.__LZsfnextfocus);return
}};this.lastfocus=this.csel;this.csel=$1;this.__LZskipblur=false;if($1&&$1.onfocus.ready){
$1.onfocus.sendEvent($1)
};if(this.__LZsfnextfocus!=-1){
this.__LZsfrunning=false;this.setFocus(this.__LZsfnextfocus);return
};if(this.onfocus.ready){
this.onfocus.sendEvent($1)
};this.__LZsfrunning=false;if(this.__LZsfnextfocus!=-1){
this.setFocus(this.__LZsfnextfocus);return
};if($3){
$3.blurring=false
}},"clearFocus",function(){
this.setFocus(null)
},"getFocus",function(){
return this.csel
},"next",function(){
this.genMoveSelection(1)
},"getNext",function($1){
if(!$1){
$1=this.csel
};return this.moveSelSubview($1,1)
},"getPrev",function($1){
if(!$1){
$1=this.csel
};return this.moveSelSubview($1,-1)
},"prev",function(){
this.genMoveSelection(-1)
},"genMoveSelection",function($1){
var $2=this.csel;var $3=$2;while($2&&$3!=canvas){
if(!$3.visible){
$2=null
};$3=$3.immediateparent
};if($2==null){
$2=LzModeManager.getModalView()
};var $4=null;if($2&&$2["get"+($1==1?"Next":"Prev")+"Selection"]){
$4=$2["get"+($1==1?"Next":"Prev")+"Selection"]()
};if($4==null){
$4=this.moveSelSubview($2,$1)
};if(!LzModeManager.__LZallowFocus($4)){
return
};this.setFocus($4,true)
},"accumulateSubviews",function($1,$2,$3,$4){
if(arguments.length<4){
$4=false
};if($2==$3||$2.focusable&&$2.visible){
$1.push($2)
};if($4||!$2.focustrap&&$2.visible){
for(var $5=0;$5<$2.subviews.length;$5++){
this.accumulateSubviews($1,$2.subviews[$5],$3,false)
}}},"moveSelSubview",function($1,$2){
var $3=$1||canvas;while(!$3.focustrap&&$3.immediateparent&&$3!=$3.immediateparent){
$3=$3.immediateparent
};var $4=[];this.accumulateSubviews($4,$3,$1,true);var $5=-1;for(var $6 in $4){
if($4[$6]==$1){
$5=Number($6);break
}};if($5==$4.length-1){
this.onescapefocus.sendEvent()
};if($5==-1&&$2==-1){
$5=0
};$5=($5+$2+$4.length)%$4.length;return $4[$5]
}],null);var LzFocus=new LzFocusService();LzFocus.initialize();LzTimerService=Class.make("LzTimerService",null,["timerList",new Object(),"$lzsc$initialize",function(){

},"addTimer",function($1,$2){
var p={"delegate":$1};var $3=function(){
LzTimer.removeTimerWithID(p.delegate,p.id);var $1=p.delegate;if($1.enabled&&$1.c){
p.delegate.execute(new Date().getTime())
}};var $4=LzTimeKernel.setTimeout($3,$2);p.id=$4;var $5=this.timerList[$1.__delegateID];if($5==null){
this.timerList[$1.__delegateID]=$4
}else{
if(!($5 instanceof Array)){
this.timerList[$1.__delegateID]=[$5,$4]
}else{
$5.push($4)
}};return $4
},"removeTimer",function($1){
var $2=this.timerList[$1.__delegateID];var $3=null;if($2!=null){
if($2 instanceof Array){
$3=$2.shift();LzTimeKernel.clearTimeout($3);if($2.length==0){
delete this.timerList[$1.__delegateID]
}}else{
$3=$2;LzTimeKernel.clearTimeout($3);delete this.timerList[$1.__delegateID]
}};return $3
},"removeTimerWithID",function($1,$2){
var $3=this.timerList[$1.__delegateID];if($3!=null){
if($3 instanceof Array){
var $4=0;for($4=0;$4<$3.length;$4++){
var $5=$3[$4];if($5==$2){
$3.splice($4,1);break
}};if($3.length==0){
delete this.timerList[$1.__delegateID]
}}else{
if($3==$2){
delete this.timerList[$1.__delegateID]
}}}},"resetTimer",function($1,$2){
this.removeTimer($1);return this.addTimer($1,$2)
}],["LzTimer",void 0]);(function(){
with(LzTimerService){
with(LzTimerService.prototype){
LzTimerService.LzTimer=new LzTimerService()
}}})();var LzTimer=LzTimerService.LzTimer;function LzInstantiateView($1,$2){
if(arguments.length<2){
$2=null
};if($1.name=="trait"){
new LzTrait($1);return
};if($2==null){
$2=1
};canvas.initiatorAddNode($1,$2)
};function lzAddLocalData($1,$2,$3){
return new LzDataset(canvas,{name:$1,initialdata:$2,trimwhitespace:$3})
}var $backtrace=false;var $dhtml=true;var $as3=false;var $js1=true;var $swf7=false;var $swf8=false;var $svg=false;var $as2=false;var $swf9=false;var $profile=false;var $runtime="dhtml";var $debug=false;var $j2me=false;canvas=new LzCanvas({__LZproxied:"true",bgcolor:9737389,debugApp:function(){
with(this){
cb_debug.setValue(true);canvas.reloadApp()
}},deploySOLO:function(){
with(this){
var $1=escape(app_fullpath.substring(app_lps_root.length));if(app_runtime=="dhtml"){
var $2=app_lps_root+"/lps/admin/solo-dhtml-deploy.jsp?appurl="+$1
}else{
var $2=app_lps_root+"/lps/admin/solo-deploy.jsp?appurl="+$1
};this.loadURL($2)
}},displayObjectByID:function($1){
with(this){
receivingLC.send("lc_appdebug"+app_uid,"evalExpr","_root.$modules.lz.Debug.displayObj("+$1+")")
}},embedfonts:true,fontname:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",gotoApp:function(){
with(this){
var $1=app_fullpath.substring(0,app_fullpath.length-4)+".lzx";app_fullpath=$1;this.reloadApp()
}},height:370,loadURL:function($1){
with(this){
LzBrowser.loadURL($1,"_top")
}},lpsbuild:"9221 /Users/maxcarlson/openlaszlo/trunk-clean",lpsbuilddate:"2008-05-18T23:08:31-0700",lpsrelease:"Latest",lpsversion:"4.2.x",proxied:false,reloadApp:function($1){
with(this){
var $2=rg_runtime.value;var $3=cb_debug.value;var $4=cb_backtrace.value;var $5=cb_remotedebug.value;var $6=new LzParam(this);var $7=LzParam.parseQueryString(app_query);$7["debug"]=$3;$7["lzbacktrace"]=$4;$7["lzr"]=$2;if($5){
$7["lzconsoledebug"]=true;$7["debug"]=true
}else{
delete $7.lzconsoledebug;delete $7.remotedebug
};if(app_lzt!=null){
$7["lzt"]=app_lzt
};if($7.lzr=="dhtml"){
if($7.debug+""=="false"){
delete $7["debug"]
}else{
$7.debug="true"
}};var $8={};for(var $9 in $7){
if($9==""){
continue
};if($9.indexOf("#38;")!=-1){
var $10=$9.indexOf("#38;");$9=$9.substring($10+4,$9.length)
};if($8[$9]){
continue
};$6.setValue($9,$7[$9]);$8[$9]=true
};var $11=app_fullpath+"?"+$6.serialize();this.loadURL($11)
}},remoteEval:function($1){
with(this){
receivingLC.send("lc_appdebug"+app_uid,"evalExpr",$1)
}},runtime:"dhtml",sendConsoleAlive:function(){
with(this){
receivingLC.send("lc_appdebug"+app_uid,"consoleAlive",true)
}},showLogMessage:function($1){
with(this){
console.writeRaw(escapeXML($1)+"<br>")
}},showWarning:function($1,$2,$3){
with(this){
console.writeRaw($3)
}},viewDev:function(){
var $1="http://www.laszlosystems.com/developers";this.loadURL($1)
},viewDocs:function(){
with(this){
var $1=app_lps_root+"/docs/index.html";this.loadURL($1)
}},viewForums:function(){
var $1="http://www.laszlosystems.com/developers/community/forums/";this.loadURL($1)
},viewSource:function(){
with(this){
app_lzt="source";canvas.reloadApp()
}},viewWrapper:function(){
with(this){
app_lzt="deployment";canvas.reloadApp()
}},width:"100%"});var offwhite=15921906;var gray10=1710618;var gray20=3355443;var gray30=5066061;var gray40=6710886;var gray50=8355711;var gray60=10066329;var gray70=11776947;var gray80=13421772;var gray90=15066597;var iceblue1=3298963;var iceblue2=5472718;var iceblue3=12240085;var iceblue4=14017779;var iceblue5=15659509;var palegreen1=4290113;var palegreen2=11785139;var palegreen3=12637341;var palegreen4=13888170;var palegreen5=15725032;var gold1=9331721;var gold2=13349195;var gold3=15126388;var gold4=16311446;var sand1=13944481;var sand2=14276546;var sand3=15920859;var sand4=15986401;var ltpurple1=6575768;var ltpurple2=12038353;var ltpurple3=13353453;var ltpurple4=15329264;var grayblue=12501704;var graygreen=12635328;var graypurple=10460593;var ltblue=14540287;var ltgreen=14548957;$lzc$class_basefocusview=Class.make("$lzc$class_basefocusview",LzView,["active",void 0,"$lzc$set_active",function($1){
with(this){
setActive($1)
}},"target",void 0,"$lzc$set_target",function($1){
with(this){
setTarget($1)
}},"duration",void 0,"_animatorcounter",void 0,"ontarget",void 0,"_nexttarget",void 0,"onactive",void 0,"_xydelegate",void 0,"_widthdel",void 0,"_heightdel",void 0,"_delayfadeoutDL",void 0,"_dofadeout",void 0,"_onstopdel",void 0,"reset",function(){
with(this){
this.setX(0);this.setY(0);this.setWidth(canvas.width);this.setHeight(canvas.height);setTarget(null)
}},"setActive",function($1){
this.active=$1;if(this.onactive){
this.onactive.sendEvent($1)
}},"doFocus",function($1){
with(this){
this._dofadeout=false;this.bringToFront();if(this.target){
this.setTarget(null)
};this.setVisibility(this.active?"visible":"hidden");this._nexttarget=$1;if(visible){
this._animatorcounter+=1;var $2=null;var $3;var $4;var $5;var $6;if($1["getFocusRect"]){
$2=$1.getFocusRect()
};if($2){
$3=$2[0];$4=$2[1];$5=$2[2];$6=$2[3]
}else{
$3=$1.getAttributeRelative("x",canvas);$4=$1.getAttributeRelative("y",canvas);$5=$1.getAttributeRelative("width",canvas);$6=$1.getAttributeRelative("height",canvas)
};var $7=this.animate("x",$3,duration);this.animate("y",$4,duration);this.animate("width",$5,duration);this.animate("height",$6,duration);if(this.sprite&&this.sprite["quirks"]&&this.sprite.quirks["minimize_opacity_changes"]){
this.setVisibility("visible")
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
};this.setX($3);this.setY($4);this.setWidth($5);this.setHeight($6)
}}},"stopanim",function($1){
with(this){
this._animatorcounter-=1;if(this._animatorcounter<1){
this._dofadeout=true;if(!this._delayfadeoutDL){
this._delayfadeoutDL=new LzDelegate(this,"fadeout")
};LzTimer.addTimer(this._delayfadeoutDL,1000);this.setTarget(_nexttarget);this._onstopdel.unregisterAll()
}}},"fadeout",function(){
with(this){
if(_dofadeout){
if(this.sprite&&this.sprite["quirks"]&&this.sprite.quirks["minimize_opacity_changes"]){
this.setVisibility("hidden")
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
this.setX($2[0]);this.setY($2[1])
}else{
this.setX(this.target.getAttributeRelative("x",canvas));this.setY(this.target.getAttributeRelative("y",canvas))
}}},"followWidth",function($1){
with(this){
var $2=null;if(target["getFocusRect"]){
$2=target.getFocusRect()
};if($2){
this.setWidth($2[2])
}else{
this.setWidth(this.target.width)
}}},"followHeight",function($1){
with(this){
var $2=null;if(target["getFocusRect"]){
$2=target.getFocusRect()
};if($2){
this.setHeight($2[3])
}else{
this.setHeight(this.target.height)
}}},"$lzc$handle_onfocus_reference$$base$2Fbasefocusview$2Elzx_243_62_$m22",function(){
with(this){
return LzFocus
}},"$lzc$handle_onfocus$$base$2Fbasefocusview$2Elzx_243_62_$m22",function($1){
with(this){
this.setActive(LzFocus.focuswithkey);if($1){
this.doFocus($1)
}else{
this.reset();if(this.active){
this.setActive(false)
}}}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","basefocusview","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_basefocusview){
with($lzc$class_basefocusview.prototype){
LzNode.mergeAttributes({$delegates:["onstop","stopanim",null,"onfocus","$lzc$handle_onfocus$$base$2Fbasefocusview$2Elzx_243_62_$m22","$lzc$handle_onfocus_reference$$base$2Fbasefocusview$2Elzx_243_62_$m22"],_animatorcounter:0,_delayfadeoutDL:null,_dofadeout:false,_heightdel:null,_nexttarget:null,_onstopdel:null,_widthdel:null,_xydelegate:null,active:false,duration:400,initstage:"late",onactive:LzDeclaredEvent,ontarget:LzDeclaredEvent,options:{ignorelayout:true},target:null,visible:false},$lzc$class_basefocusview.attributes)
}}})();ConstructorMap["basefocusview"]=$lzc$class_basefocusview;LzResourceLibrary.lzfocusbracket_topleft_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft.png"],width:7,height:7};LzResourceLibrary.lzfocusbracket_topleft_shdw_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft_shdw.png"],width:9,height:9};LzResourceLibrary.lzfocusbracket_topright_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_rt.png"],width:7,height:7};LzResourceLibrary.lzfocusbracket_topright_shdw_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_rt_shdw.png"],width:9,height:9};LzResourceLibrary.lzfocusbracket_bottomleft_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_bot_lft.png"],width:7,height:7};LzResourceLibrary.lzfocusbracket_bottomleft_shdw_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_bot_lft_shdw.png"],width:9,height:9};LzResourceLibrary.lzfocusbracket_bottomright_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_bot_rt.png"],width:7,height:7};LzResourceLibrary.lzfocusbracket_bottomright_shdw={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_bot_rt_shdw.png"],width:9,height:9};$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_30_41=Class.make("$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_30_41",LzView,["$lzc$bind_x$$lz$2Ffocusoverlay$2Elzx_30_41_$m25",function($1){
with(this){
this.setAttribute("x",-classroot.offset)
}},"$lzc$dependencies_x$$lz$2Ffocusoverlay$2Elzx_30_41_$m25",function(){
with(this){
return [classroot,"offset"]
}},"$lzc$bind_y$$lz$2Ffocusoverlay$2Elzx_30_41_$m26",function($1){
with(this){
this.setAttribute("y",-classroot.offset)
}},"$lzc$dependencies_y$$lz$2Ffocusoverlay$2Elzx_30_41_$m26",function(){
with(this){
return [classroot,"offset"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Ffocusoverlay$2Elzx_30_41","children",LzNode.mergeChildren([{attrs:{$classrootdepth:2,opacity:0.25,resource:"lzfocusbracket_topleft_shdw_rsrc",x:1,y:1},name:"view"},{attrs:{$classrootdepth:2,resource:"lzfocusbracket_topleft_rsrc"},name:"view"}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Ffocusoverlay$2Elzx_30_41){
with($lzc$class_view_$lz$2Ffocusoverlay$2Elzx_30_41.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_30_41.attributes)
}}})();ConstructorMap["view_$lz$2Ffocusoverlay$2Elzx_30_41"]=$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_30_41;$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_37_42=Class.make("$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_37_42",LzView,["$lzc$bind_x$$lz$2Ffocusoverlay$2Elzx_37_42_$m33",function($1){
with(this){
this.setAttribute("x",parent.width-width+classroot.offset)
}},"$lzc$dependencies_x$$lz$2Ffocusoverlay$2Elzx_37_42_$m33",function(){
with(this){
return [parent,"width",this,"width",classroot,"offset"]
}},"$lzc$bind_y$$lz$2Ffocusoverlay$2Elzx_37_42_$m34",function($1){
with(this){
this.setAttribute("y",-classroot.offset)
}},"$lzc$dependencies_y$$lz$2Ffocusoverlay$2Elzx_37_42_$m34",function(){
with(this){
return [classroot,"offset"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Ffocusoverlay$2Elzx_37_42","children",LzNode.mergeChildren([{attrs:{$classrootdepth:2,opacity:0.25,resource:"lzfocusbracket_topright_shdw_rsrc",x:1,y:1},name:"view"},{attrs:{$classrootdepth:2,resource:"lzfocusbracket_topright_rsrc"},name:"view"}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Ffocusoverlay$2Elzx_37_42){
with($lzc$class_view_$lz$2Ffocusoverlay$2Elzx_37_42.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_37_42.attributes)
}}})();ConstructorMap["view_$lz$2Ffocusoverlay$2Elzx_37_42"]=$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_37_42;$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_44_67=Class.make("$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_44_67",LzView,["$lzc$bind_x$$lz$2Ffocusoverlay$2Elzx_44_67_$m41",function($1){
with(this){
this.setAttribute("x",-classroot.offset)
}},"$lzc$dependencies_x$$lz$2Ffocusoverlay$2Elzx_44_67_$m41",function(){
with(this){
return [classroot,"offset"]
}},"$lzc$bind_y$$lz$2Ffocusoverlay$2Elzx_44_67_$m42",function($1){
with(this){
this.setAttribute("y",parent.height-height+classroot.offset)
}},"$lzc$dependencies_y$$lz$2Ffocusoverlay$2Elzx_44_67_$m42",function(){
with(this){
return [parent,"height",this,"height",classroot,"offset"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Ffocusoverlay$2Elzx_44_67","children",LzNode.mergeChildren([{attrs:{$classrootdepth:2,opacity:0.25,resource:"lzfocusbracket_bottomleft_shdw_rsrc",x:1,y:1},name:"view"},{attrs:{$classrootdepth:2,resource:"lzfocusbracket_bottomleft_rsrc"},name:"view"}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Ffocusoverlay$2Elzx_44_67){
with($lzc$class_view_$lz$2Ffocusoverlay$2Elzx_44_67.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_44_67.attributes)
}}})();ConstructorMap["view_$lz$2Ffocusoverlay$2Elzx_44_67"]=$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_44_67;$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_51_67=Class.make("$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_51_67",LzView,["$lzc$bind_x$$lz$2Ffocusoverlay$2Elzx_51_67_$m49",function($1){
with(this){
this.setAttribute("x",parent.width-width+classroot.offset)
}},"$lzc$dependencies_x$$lz$2Ffocusoverlay$2Elzx_51_67_$m49",function(){
with(this){
return [parent,"width",this,"width",classroot,"offset"]
}},"$lzc$bind_y$$lz$2Ffocusoverlay$2Elzx_51_67_$m50",function($1){
with(this){
this.setAttribute("y",parent.height-height+classroot.offset)
}},"$lzc$dependencies_y$$lz$2Ffocusoverlay$2Elzx_51_67_$m50",function(){
with(this){
return [parent,"height",this,"height",classroot,"offset"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Ffocusoverlay$2Elzx_51_67","children",LzNode.mergeChildren([{attrs:{$classrootdepth:2,opacity:0.25,resource:"lzfocusbracket_bottomright_shdw",x:1,y:1},name:"view"},{attrs:{$classrootdepth:2,resource:"lzfocusbracket_bottomright_rsrc"},name:"view"}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Ffocusoverlay$2Elzx_51_67){
with($lzc$class_view_$lz$2Ffocusoverlay$2Elzx_51_67.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_51_67.attributes)
}}})();ConstructorMap["view_$lz$2Ffocusoverlay$2Elzx_51_67"]=$lzc$class_view_$lz$2Ffocusoverlay$2Elzx_51_67;$lzc$class_focusoverlay=Class.make("$lzc$class_focusoverlay",$lzc$class_basefocusview,["offset",void 0,"topleft",void 0,"topright",void 0,"bottomleft",void 0,"bottomright",void 0,"doFocus",function($1){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["doFocus"]:this.nextMethod(arguments.callee,"doFocus")).call(this,$1);if(visible){
this.bounce()
}}},"bounce",function(){
with(this){
this.animate("offset",12,duration/2);this.animate("offset",5,duration)
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","focusoverlay","children",LzNode.mergeChildren([{attrs:{$classrootdepth:1,name:"topleft",x:new LzAlwaysExpr("$lzc$bind_x$$lz$2Ffocusoverlay$2Elzx_30_41_$m25","$lzc$dependencies_x$$lz$2Ffocusoverlay$2Elzx_30_41_$m25"),y:new LzAlwaysExpr("$lzc$bind_y$$lz$2Ffocusoverlay$2Elzx_30_41_$m26","$lzc$dependencies_y$$lz$2Ffocusoverlay$2Elzx_30_41_$m26")},name:"view_$lz$2Ffocusoverlay$2Elzx_30_41"},{attrs:{$classrootdepth:1,name:"topright",x:new LzAlwaysExpr("$lzc$bind_x$$lz$2Ffocusoverlay$2Elzx_37_42_$m33","$lzc$dependencies_x$$lz$2Ffocusoverlay$2Elzx_37_42_$m33"),y:new LzAlwaysExpr("$lzc$bind_y$$lz$2Ffocusoverlay$2Elzx_37_42_$m34","$lzc$dependencies_y$$lz$2Ffocusoverlay$2Elzx_37_42_$m34")},name:"view_$lz$2Ffocusoverlay$2Elzx_37_42"},{attrs:{$classrootdepth:1,name:"bottomleft",x:new LzAlwaysExpr("$lzc$bind_x$$lz$2Ffocusoverlay$2Elzx_44_67_$m41","$lzc$dependencies_x$$lz$2Ffocusoverlay$2Elzx_44_67_$m41"),y:new LzAlwaysExpr("$lzc$bind_y$$lz$2Ffocusoverlay$2Elzx_44_67_$m42","$lzc$dependencies_y$$lz$2Ffocusoverlay$2Elzx_44_67_$m42")},name:"view_$lz$2Ffocusoverlay$2Elzx_44_67"},{attrs:{$classrootdepth:1,name:"bottomright",x:new LzAlwaysExpr("$lzc$bind_x$$lz$2Ffocusoverlay$2Elzx_51_67_$m49","$lzc$dependencies_x$$lz$2Ffocusoverlay$2Elzx_51_67_$m49"),y:new LzAlwaysExpr("$lzc$bind_y$$lz$2Ffocusoverlay$2Elzx_51_67_$m50","$lzc$dependencies_y$$lz$2Ffocusoverlay$2Elzx_51_67_$m50")},name:"view_$lz$2Ffocusoverlay$2Elzx_51_67"}],$lzc$class_basefocusview["children"]),"attributes",new LzInheritedHash($lzc$class_basefocusview.attributes)]);(function(){
with($lzc$class_focusoverlay){
with($lzc$class_focusoverlay.prototype){
LzNode.mergeAttributes({offset:5},$lzc$class_focusoverlay.attributes)
}}})();ConstructorMap["focusoverlay"]=$lzc$class_focusoverlay;$lzc$class__componentmanager=Class.make("$lzc$class__componentmanager",LzNode,["focusclass",void 0,"keyhandlers",void 0,"lastsdown",void 0,"lastedown",void 0,"defaults",void 0,"currentdefault",void 0,"defaultstyle",void 0,"ondefaultstyle",void 0,"init",function(){
with(this){
var $1=this.focusclass;if(typeof canvas.focusclass!="undefined"){
$1=canvas.focusclass
};if($1!=null){
canvas.__focus=new (lz[$1])(canvas);canvas.__focus.reset()
};(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this)
}},"_lastkeydown",void 0,"upkeydel",void 0,"$lzc$handle_onkeydown_reference$$base$2Fcomponentmanager$2Elzx_61_81_$m66",function(){
with(this){
return LzKeys
}},"dispatchKeyDown",function($1){
with(this){
var $2=false;if($1==32){
this.lastsdown=null;var $3=LzFocus.getFocus();if($3 instanceof lz.basecomponent){
$3.doSpaceDown();this.lastsdown=$3
};$2=true
}else{
if($1==13&&this.currentdefault){
this.lastedown=this.currentdefault;this.currentdefault.doEnterDown();$2=true
}};if($2){
if(!this.upkeydel){
this.upkeydel=new LzDelegate(this,"dispatchKeyTimer")
};this._lastkeydown=$1;LzTimer.addTimer(this.upkeydel,50)
}}},"dispatchKeyTimer",function(){
if(this._lastkeydown==32&&this.lastsdown!=null){
this.lastsdown.doSpaceUp();this.lastsdown=null
}else{
if(this._lastkeydown==13&&this.currentdefault&&this.currentdefault==this.lastedown){
this.currentdefault.doEnterUp()
}}},"findClosestDefault",function($1){
with(this){
if(!this.defaults){
return null
};var $2=null;var $3=null;var $4=this.defaults;$1=$1||canvas;var $5=LzModeManager.getModalView();for(var $6=0;$6<$4.length;$6++){
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
};this.defaults.push($1);this.checkDefault(LzFocus.getFocus())
}},"unmakeDefault",function($1){
with(this){
if(!this.defaults){
return
};for(var $2=0;$2<this.defaults.length;$2++){
if(this.defaults[$2]==$1){
this.defaults.splice($2,1);this.checkDefault(LzFocus.getFocus());return
}}}},"$lzc$handle_onfocus_reference$$base$2Fcomponentmanager$2Elzx_167_76_$m67",function(){
with(this){
return LzFocus
}},"checkDefault",function($1){
with(this){
if(!($1 instanceof lz.basecomponent)||!$1.doesenter){
if($1 instanceof LzInputText&&$1.multiline){
$1=null
}else{
$1=this.findClosestDefault($1)
}};if($1==this.currentdefault){
return
};if(this.currentdefault){
this.currentdefault.setAttribute("hasdefault",false)
};this.currentdefault=$1;if($1){
$1.setAttribute("hasdefault",true)
}}},"$lzc$handle_onmode_reference$$base$2Fcomponentmanager$2Elzx_196_74_$m68",function(){
with(this){
return LzModeManager
}},"$lzc$handle_onmode$$base$2Fcomponentmanager$2Elzx_196_74_$m68",function($1){
with(this){
if(arguments.length<1){
$1=null
};if(LzFocus.getFocus()==null){
this.checkDefault(null)
}}},"setDefaultStyle",function($1){
this.defaultstyle=$1;if(this.ondefaultstyle){
this.ondefaultstyle.sendEvent($1)
}},"getDefaultStyle",function(){
with(this){
if(this.defaultstyle==null){
this.defaultstyle=new (lz.style)(canvas,{isdefault:true})
};return this.defaultstyle
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","_componentmanager","children",LzNode.mergeChildren([],LzNode["children"]),"attributes",new LzInheritedHash(LzNode.attributes)]);(function(){
with($lzc$class__componentmanager){
with($lzc$class__componentmanager.prototype){
LzNode.mergeAttributes({$delegates:["onkeydown","dispatchKeyDown","$lzc$handle_onkeydown_reference$$base$2Fcomponentmanager$2Elzx_61_81_$m66","onfocus","checkDefault","$lzc$handle_onfocus_reference$$base$2Fcomponentmanager$2Elzx_167_76_$m67","onmode","$lzc$handle_onmode$$base$2Fcomponentmanager$2Elzx_196_74_$m68","$lzc$handle_onmode_reference$$base$2Fcomponentmanager$2Elzx_196_74_$m68"],_lastkeydown:0,currentdefault:null,defaults:null,defaultstyle:null,focusclass:"focusoverlay",keyhandlers:null,lastedown:null,lastsdown:null,ondefaultstyle:LzDeclaredEvent,upkeydel:null},$lzc$class__componentmanager.attributes)
}}})();ConstructorMap["_componentmanager"]=$lzc$class__componentmanager;$lzc$class_style=Class.make("$lzc$class_style",LzNode,["isstyle",void 0,"$lzc$bind_canvascolor$$base$2Fstyle$2Elzx_16_62_$m70",function(){
this.setAttribute("canvascolor",null)
},"canvascolor",void 0,"$lzc$set_canvascolor",function($1){
with(this){
setCanvasColor($1)
}},"$lzc$bind_textcolor$$base$2Fstyle$2Elzx_20_71_$m71",function(){
with(this){
this.setAttribute("textcolor",gray10)
}},"textcolor",void 0,"$lzc$set_textcolor",function($1){
with(this){
setStyleAttr($1,"textcolor")
}},"$lzc$bind_textfieldcolor$$base$2Fstyle$2Elzx_24_81_$m72",function(){
with(this){
this.setAttribute("textfieldcolor",white)
}},"textfieldcolor",void 0,"$lzc$set_textfieldcolor",function($1){
with(this){
setStyleAttr($1,"textfieldcolor")
}},"$lzc$bind_texthilitecolor$$base$2Fstyle$2Elzx_29_82_$m73",function(){
with(this){
this.setAttribute("texthilitecolor",iceblue1)
}},"texthilitecolor",void 0,"$lzc$set_texthilitecolor",function($1){
with(this){
setStyleAttr($1,"texthilitecolor")
}},"$lzc$bind_textselectedcolor$$base$2Fstyle$2Elzx_34_86_$m74",function(){
with(this){
this.setAttribute("textselectedcolor",black)
}},"textselectedcolor",void 0,"$lzc$set_textselectedcolor",function($1){
with(this){
setStyleAttr($1,"textselectedcolor")
}},"$lzc$bind_textdisabledcolor$$base$2Fstyle$2Elzx_38_86_$m75",function(){
with(this){
this.setAttribute("textdisabledcolor",gray60)
}},"textdisabledcolor",void 0,"$lzc$set_textdisabledcolor",function($1){
with(this){
setStyleAttr($1,"textdisabledcolor")
}},"$lzc$bind_basecolor$$base$2Fstyle$2Elzx_43_70_$m76",function(){
with(this){
this.setAttribute("basecolor",offwhite)
}},"basecolor",void 0,"$lzc$set_basecolor",function($1){
with(this){
setStyleAttr($1,"basecolor")
}},"$lzc$bind_bgcolor$$base$2Fstyle$2Elzx_49_66_$m77",function(){
with(this){
this.setAttribute("bgcolor",white)
}},"bgcolor",void 0,"$lzc$set_bgcolor",function($1){
with(this){
setStyleAttr($1,"bgcolor")
}},"$lzc$bind_hilitecolor$$base$2Fstyle$2Elzx_54_75_$m78",function(){
with(this){
this.setAttribute("hilitecolor",iceblue4)
}},"hilitecolor",void 0,"$lzc$set_hilitecolor",function($1){
with(this){
setStyleAttr($1,"hilitecolor")
}},"$lzc$bind_selectedcolor$$base$2Fstyle$2Elzx_58_79_$m79",function(){
with(this){
this.setAttribute("selectedcolor",iceblue3)
}},"selectedcolor",void 0,"$lzc$set_selectedcolor",function($1){
with(this){
setStyleAttr($1,"selectedcolor")
}},"$lzc$bind_disabledcolor$$base$2Fstyle$2Elzx_62_79_$m80",function(){
with(this){
this.setAttribute("disabledcolor",gray30)
}},"disabledcolor",void 0,"$lzc$set_disabledcolor",function($1){
with(this){
setStyleAttr($1,"disabledcolor")
}},"$lzc$bind_bordercolor$$base$2Fstyle$2Elzx_67_74_$m81",function(){
with(this){
this.setAttribute("bordercolor",gray40)
}},"bordercolor",void 0,"$lzc$set_bordercolor",function($1){
with(this){
setStyleAttr($1,"bordercolor")
}},"$lzc$bind_bordersize$$base$2Fstyle$2Elzx_72_59_$m82",function(){
this.setAttribute("bordersize",1)
},"bordersize",void 0,"$lzc$set_bordersize",function($1){
with(this){
setStyleAttr($1,"bordersize")
}},"$lzc$bind_menuitembgcolor$$base$2Fstyle$2Elzx_76_23_$m83",function(){
with(this){
this.setAttribute("menuitembgcolor",textfieldcolor)
}},"menuitembgcolor",void 0,"isdefault",void 0,"$lzc$set_isdefault",function($1){
with(this){
_setdefault($1)
}},"onisdefault",void 0,"_setdefault",function($1){
with(this){
this.isdefault=$1;if(isdefault){
lz._componentmanager.service.setDefaultStyle(this);if(this["canvascolor"]!=null){
canvas.setBGColor(this.canvascolor)
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
canvas.setBGColor($1)
};this.canvascolor=$1;if(this.onstylechanged){
this.onstylechanged.sendEvent(this)
}}},"extend",function($1){
with(this){
var $2={};for(var $3 in $1){
$2[$3]=$1[$3]
};$2.__proto__=this;new LzDelegate($2,"_forwardstylechanged",this,"onstylechanged");return $2
}},"_forwardstylechanged",function(){
if(this.onstylechanged){
this.onstylechanged.sendEvent(this)
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","style","children",LzNode.mergeChildren([],LzNode["children"]),"attributes",new LzInheritedHash(LzNode.attributes)]);(function(){
with($lzc$class_style){
with($lzc$class_style.prototype){
LzNode.mergeAttributes({basecolor:new LzOnceExpr("$lzc$bind_basecolor$$base$2Fstyle$2Elzx_43_70_$m76"),bgcolor:new LzOnceExpr("$lzc$bind_bgcolor$$base$2Fstyle$2Elzx_49_66_$m77"),bordercolor:new LzOnceExpr("$lzc$bind_bordercolor$$base$2Fstyle$2Elzx_67_74_$m81"),bordersize:new LzOnceExpr("$lzc$bind_bordersize$$base$2Fstyle$2Elzx_72_59_$m82"),canvascolor:new LzOnceExpr("$lzc$bind_canvascolor$$base$2Fstyle$2Elzx_16_62_$m70"),disabledcolor:new LzOnceExpr("$lzc$bind_disabledcolor$$base$2Fstyle$2Elzx_62_79_$m80"),hilitecolor:new LzOnceExpr("$lzc$bind_hilitecolor$$base$2Fstyle$2Elzx_54_75_$m78"),isdefault:false,isstyle:true,menuitembgcolor:new LzOnceExpr("$lzc$bind_menuitembgcolor$$base$2Fstyle$2Elzx_76_23_$m83"),onisdefault:LzDeclaredEvent,onstylechanged:LzDeclaredEvent,selectedcolor:new LzOnceExpr("$lzc$bind_selectedcolor$$base$2Fstyle$2Elzx_58_79_$m79"),textcolor:new LzOnceExpr("$lzc$bind_textcolor$$base$2Fstyle$2Elzx_20_71_$m71"),textdisabledcolor:new LzOnceExpr("$lzc$bind_textdisabledcolor$$base$2Fstyle$2Elzx_38_86_$m75"),textfieldcolor:new LzOnceExpr("$lzc$bind_textfieldcolor$$base$2Fstyle$2Elzx_24_81_$m72"),texthilitecolor:new LzOnceExpr("$lzc$bind_texthilitecolor$$base$2Fstyle$2Elzx_29_82_$m73"),textselectedcolor:new LzOnceExpr("$lzc$bind_textselectedcolor$$base$2Fstyle$2Elzx_34_86_$m74")},$lzc$class_style.attributes)
}}})();ConstructorMap["style"]=$lzc$class_style;LzInstantiateView({name:"script",attrs:{script:function(){
lz._componentmanager.service=new (lz._componentmanager)(canvas,null,null,true)
}}},1);$lzc$class_statictext=Class.make("$lzc$class_statictext",LzText,["$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","statictext","children",LzNode.mergeChildren([],LzText["children"]),"attributes",new LzInheritedHash(LzText.attributes)]);(function(){
with($lzc$class_statictext){
with($lzc$class_statictext.prototype){
LzNode.mergeAttributes({},$lzc$class_statictext.attributes)
}}})();ConstructorMap["statictext"]=$lzc$class_statictext;$lzc$class_basecomponent=Class.make("$lzc$class_basecomponent",LzView,["enabled",void 0,"$lzc$set_focusable",function($1){
with(this){
_setFocusable($1)
}},"_focusable",void 0,"onfocusable",void 0,"text",void 0,"doesenter",void 0,"$lzc$set_doesenter",function($1){
this._setDoesEnter($1)
},"$lzc$bind__enabled$$base$2Fbasecomponent$2Elzx_51_57_$m93",function($1){
this.setAttribute("_enabled",this.enabled&&(this._parentcomponent?this._parentcomponent._enabled:true))
},"$lzc$dependencies__enabled$$base$2Fbasecomponent$2Elzx_51_57_$m93",function(){
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

},"doSpaceDown",function($1){
if(arguments.length<1){
$1=null
};return false
},"doSpaceUp",function($1){
if(arguments.length<1){
$1=null
};return false
},"doEnterDown",function($1){
if(arguments.length<1){
$1=null
};return false
},"doEnterUp",function($1){
if(arguments.length<1){
$1=null
};return false
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
this.doesenter=$1;if(LzFocus.getFocus()==this){
lz._componentmanager.service.checkDefault(this)
}}},"updateDefault",function(){
with(this){
lz._componentmanager.service.checkDefault(LzFocus.getFocus())
}},"$lzc$bind_style$$base$2Fbasecomponent$2Elzx_200_80_$m99",function(){
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
this._otherstyledel.unregisterAll();delete this._otherstyledel
}};_setstyle($1)
}},"_usestyle",function($1){
if(arguments.length<1){
$1=null
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
if(arguments.length<3){
$3=0
};if($1.capabilities.colortransform){
if($2!=""&&$2!=null){
var $4=$2;var $5=$4>>16&255;var $6=$4>>8&255;var $7=$4&255;$5+=51;$6+=51;$7+=51;$5=$5/255*100;$6=$6/255*100;$7=$7/255*100;$1.setColorTransform({ra:$5,ga:$6,ba:$7,rb:$3,gb:$3,bb:$3})
}}}},"on_enabled",void 0,"_showEnabled",function(){

},"applyData",function($1){
this.setAttribute("text",$1)
},"updateData",function(){
return this.text
},"destroy",function(){
with(this){
if(this._otherstyledel){
this._otherstyledel.unregisterAll();delete this._otherstyledel
};if(this._styledel){
this._styledel.unregisterAll();delete this._styledel
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
}},"toString",function(){
var $1="";var $2="";var $3="";if(this["id"]!=null){
$1="  id="+this.id
};if(this["name"]!=null){
$2=' named "'+this.name+'"'
};if(this["text"]&&this.text!=""){
$3="  text="+this.text
};return this.constructor.classname+$2+$1+$3
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","basecomponent","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_basecomponent){
with($lzc$class_basecomponent.prototype){
LzNode.mergeAttributes({_enabled:new LzAlwaysExpr("$lzc$bind__enabled$$base$2Fbasecomponent$2Elzx_51_57_$m93","$lzc$dependencies__enabled$$base$2Fbasecomponent$2Elzx_51_57_$m93"),_focusable:true,_initcomplete:false,_otherstyledel:null,_parentcomponent:null,_style:null,_styledel:null,doesenter:false,enabled:true,focusable:true,hasdefault:false,on_enabled:LzDeclaredEvent,onfocusable:LzDeclaredEvent,onisdefault:LzDeclaredEvent,onstyle:LzDeclaredEvent,style:new LzOnceExpr("$lzc$bind_style$$base$2Fbasecomponent$2Elzx_200_80_$m99"),styleable:true,text:""},$lzc$class_basecomponent.attributes)
}}})();ConstructorMap["basecomponent"]=$lzc$class_basecomponent;$lzc$class_basebutton=Class.make("$lzc$class_basebutton",$lzc$class_basecomponent,["normalResourceNumber",void 0,"overResourceNumber",void 0,"downResourceNumber",void 0,"disabledResourceNumber",void 0,"$lzc$bind_maxframes$$base$2Fbasebutton$2Elzx_39_84_$m112",function(){
this.setAttribute("maxframes",this.totalframes)
},"maxframes",void 0,"resourceviewcount",void 0,"$lzc$set_resourceviewcount",function($1){
this.setResourceViewCount($1)
},"respondtomouseout",void 0,"$lzc$bind_reference$$base$2Fbasebutton$2Elzx_52_96_$m115",function(){
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
}}},"$lzc$handle_onmode_reference$$base$2Fbasebutton$2Elzx_90_67_$m120",function(){
with(this){
return LzModeManager
}},"$lzc$handle_onmode$$base$2Fbasebutton$2Elzx_90_67_$m120",function($1){
if($1&&(this._msdown||this._msin)&&!this.childOf($1)){
this._msdown=false;this._msin=false;this._callShow()
}},"setResourceNumber",function($1){
with(this){
if(this.resourceviewcount>0){
for(var $2=0;$2<resourceviewcount;$2++){
this.subviews[$2].setResourceNumber($1)
}}else{
(arguments.callee.superclass?arguments.callee.superclass.prototype["setResourceNumber"]:this.nextMethod(arguments.callee,"setResourceNumber")).call(this,$1)
}}},"doSpaceDown",function($1){
if(arguments.length<1){
$1=null
};if(this._enabled){
this.showDown()
}},"doSpaceUp",function($1){
if(arguments.length<1){
$1=null
};if(this._enabled){
this.onclick.sendEvent();this.showUp()
}},"doEnterDown",function($1){
if(arguments.length<1){
$1=null
};if(this._enabled){
this.showDown()
}},"doEnterUp",function($1){
if(arguments.length<1){
$1=null
};if(this._enabled){
if(this.onclick){
this.onclick.sendEvent()
};this.showUp()
}},"$lzc$handle_ontotalframes$$base$2Fbasebutton$2Elzx_151_39_$m121",function($1){
if(this.isinited){
this.maxframes=this.totalframes;this._callShow()
}},"init",function(){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this);this.setResourceViewCount(this.resourceviewcount);this._callShow()
}},"$lzc$handle_onmouseover$$base$2Fbasebutton$2Elzx_166_37_$m122",function($1){
this.setAttribute("_msin",true);this._callShow()
},"$lzc$handle_onmouseout$$base$2Fbasebutton$2Elzx_171_36_$m123",function($1){
this.setAttribute("_msin",false);this._callShow()
},"$lzc$handle_onmousedown$$base$2Fbasebutton$2Elzx_176_37_$m124",function($1){
this.setAttribute("_msdown",true);this._callShow()
},"$lzc$handle_onmouseup$$base$2Fbasebutton$2Elzx_181_35_$m125",function($1){
this.setAttribute("_msdown",false);this._callShow()
},"_showEnabled",function(){
with(this){
reference.setAttribute("clickable",this._enabled);showUp()
}},"showDown",function($1){
if(arguments.length<1){
$1=null
};this.setResourceNumber(this.downResourceNumber)
},"showUp",function($1){
if(arguments.length<1){
$1=null
};if(!this._enabled&&this.disabledResourceNumber){
this.setResourceNumber(this.disabledResourceNumber)
}else{
this.setResourceNumber(this.normalResourceNumber)
}},"showOver",function($1){
if(arguments.length<1){
$1=null
};this.setResourceNumber(this.overResourceNumber)
},"setreference",function($1){
this.reference=$1;if($1!=this){
this.setClickable(false)
}},"_applystyle",function($1){
with(this){
setTint(this,$1.basecolor)
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","basebutton","children",LzNode.mergeChildren([],$lzc$class_basecomponent["children"]),"attributes",new LzInheritedHash($lzc$class_basecomponent.attributes)]);(function(){
with($lzc$class_basebutton){
with($lzc$class_basebutton.prototype){
LzNode.mergeAttributes({$delegates:["onmode","$lzc$handle_onmode$$base$2Fbasebutton$2Elzx_90_67_$m120","$lzc$handle_onmode_reference$$base$2Fbasebutton$2Elzx_90_67_$m120","ontotalframes","$lzc$handle_ontotalframes$$base$2Fbasebutton$2Elzx_151_39_$m121",null,"onmouseover","$lzc$handle_onmouseover$$base$2Fbasebutton$2Elzx_166_37_$m122",null,"onmouseout","$lzc$handle_onmouseout$$base$2Fbasebutton$2Elzx_171_36_$m123",null,"onmousedown","$lzc$handle_onmousedown$$base$2Fbasebutton$2Elzx_176_37_$m124",null,"onmouseup","$lzc$handle_onmouseup$$base$2Fbasebutton$2Elzx_181_35_$m125",null],_msdown:false,_msin:false,clickable:true,disabledResourceNumber:4,downResourceNumber:3,focusable:false,maxframes:new LzOnceExpr("$lzc$bind_maxframes$$base$2Fbasebutton$2Elzx_39_84_$m112"),normalResourceNumber:1,onclick:LzDeclaredEvent,onresourceviewcount:LzDeclaredEvent,overResourceNumber:2,reference:new LzOnceExpr("$lzc$bind_reference$$base$2Fbasebutton$2Elzx_52_96_$m115"),resourceviewcount:0,respondtomouseout:true,styleable:false},$lzc$class_basebutton.attributes)
}}})();ConstructorMap["basebutton"]=$lzc$class_basebutton;$lzc$class_swatchview=Class.make("$lzc$class_swatchview",LzView,["ctransform",void 0,"color",void 0,"$lzc$set_fgcolor",function($1){
this.setColor($1)
},"construct",function($1,$2){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2);if($2["width"]==null){
$2["width"]=this.immediateparent.width
};if($2["height"]==null){
$2["height"]=this.immediateparent.height
};if($2["fgcolor"]==null&&$2["bgcolor"]==null){
$2["fgcolor"]=16777215
}}},"setColor",function($1){
this.setBGColor($1)
},"setBGColor",function($1){
with(this){
this.color=$1;if(this.ctransform!=null){
var $2=$1>>16&255;var $3=$1>>8&255;var $4=$1&255;$2=$2*ctransform["ra"]/100+ctransform["rb"];$2=Math.min($2,255);$3=$3*ctransform["ga"]/100+ctransform["gb"];$3=Math.min($3,255);$4=$4*ctransform["ba"]/100+ctransform["bb"];$4=Math.min($4,255);$1=$4+($3<<8)+($2<<16)
};(arguments.callee.superclass?arguments.callee.superclass.prototype["setBGColor"]:this.nextMethod(arguments.callee,"setBGColor")).call(this,$1)
}},"setColorTransform",function($1){
delete this.ctransform;this.ctransform=$1;this.setBGColor(this.color)
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","swatchview","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_swatchview){
with($lzc$class_swatchview.prototype){
LzNode.mergeAttributes({color:16777215,ctransform:null},$lzc$class_swatchview.attributes)
}}})();ConstructorMap["swatchview"]=$lzc$class_swatchview;LzResourceLibrary.lzbutton_face_rsc={ptype:"sr",frames:["lps/components/lz/resources/button/simpleface_up.png","lps/components/lz/resources/button/simpleface_mo.png","lps/components/lz/resources/button/simpleface_dn.png","lps/components/lz/resources/button/autoPng/simpleface_dsbl.png"],width:2,height:18};LzResourceLibrary.lzbutton_bezel_inner_rsc={ptype:"sr",frames:["lps/components/lz/resources/autoPng/bezel_inner_up.png","lps/components/lz/resources/autoPng/bezel_inner_up.png","lps/components/lz/resources/autoPng/bezel_inner_dn.png","lps/components/lz/resources/autoPng/outline_dsbl.png"],width:500,height:500};LzResourceLibrary.lzbutton_bezel_outer_rsc={ptype:"sr",frames:["lps/components/lz/resources/autoPng/bezel_outer_up.png","lps/components/lz/resources/autoPng/bezel_outer_up.png","lps/components/lz/resources/autoPng/bezel_outer_dn.png","lps/components/lz/resources/autoPng/transparent.png","lps/components/lz/resources/autoPng/default_outline.png"],width:500,height:500};$lzc$class_view_$lz$2Fbutton$2Elzx_154_116=Class.make("$lzc$class_view_$lz$2Fbutton$2Elzx_154_116",LzView,["$lzc$bind_width$$lz$2Fbutton$2Elzx_154_116_$m149",function($1){
with(this){
this.setAttribute("width",parent.width-1)
}},"$lzc$dependencies_width$$lz$2Fbutton$2Elzx_154_116_$m149",function(){
with(this){
return [parent,"width"]
}},"$lzc$bind_height$$lz$2Fbutton$2Elzx_154_116_$m150",function($1){
with(this){
this.setAttribute("height",parent.height-1)
}},"$lzc$dependencies_height$$lz$2Fbutton$2Elzx_154_116_$m150",function(){
with(this){
return [parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Fbutton$2Elzx_154_116","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Fbutton$2Elzx_154_116){
with($lzc$class_view_$lz$2Fbutton$2Elzx_154_116.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Fbutton$2Elzx_154_116.attributes)
}}})();ConstructorMap["view_$lz$2Fbutton$2Elzx_154_116"]=$lzc$class_view_$lz$2Fbutton$2Elzx_154_116;$lzc$class_view_$lz$2Fbutton$2Elzx_155_116=Class.make("$lzc$class_view_$lz$2Fbutton$2Elzx_155_116",LzView,["$lzc$bind_width$$lz$2Fbutton$2Elzx_155_116_$m155",function($1){
with(this){
this.setAttribute("width",parent.width-3)
}},"$lzc$dependencies_width$$lz$2Fbutton$2Elzx_155_116_$m155",function(){
with(this){
return [parent,"width"]
}},"$lzc$bind_height$$lz$2Fbutton$2Elzx_155_116_$m156",function($1){
with(this){
this.setAttribute("height",parent.height-3)
}},"$lzc$dependencies_height$$lz$2Fbutton$2Elzx_155_116_$m156",function(){
with(this){
return [parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Fbutton$2Elzx_155_116","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Fbutton$2Elzx_155_116){
with($lzc$class_view_$lz$2Fbutton$2Elzx_155_116.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Fbutton$2Elzx_155_116.attributes)
}}})();ConstructorMap["view_$lz$2Fbutton$2Elzx_155_116"]=$lzc$class_view_$lz$2Fbutton$2Elzx_155_116;$lzc$class_view_$lz$2Fbutton$2Elzx_158_76=Class.make("$lzc$class_view_$lz$2Fbutton$2Elzx_158_76",LzView,["$lzc$bind_width$$lz$2Fbutton$2Elzx_158_76_$m162",function($1){
with(this){
this.setAttribute("width",parent.width-4)
}},"$lzc$dependencies_width$$lz$2Fbutton$2Elzx_158_76_$m162",function(){
with(this){
return [parent,"width"]
}},"$lzc$bind_height$$lz$2Fbutton$2Elzx_158_76_$m163",function($1){
with(this){
this.setAttribute("height",parent.height-4)
}},"$lzc$dependencies_height$$lz$2Fbutton$2Elzx_158_76_$m163",function(){
with(this){
return [parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Fbutton$2Elzx_158_76","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Fbutton$2Elzx_158_76){
with($lzc$class_view_$lz$2Fbutton$2Elzx_158_76.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Fbutton$2Elzx_158_76.attributes)
}}})();ConstructorMap["view_$lz$2Fbutton$2Elzx_158_76"]=$lzc$class_view_$lz$2Fbutton$2Elzx_158_76;$lzc$class_view_$lz$2Fbutton$2Elzx_161_115=Class.make("$lzc$class_view_$lz$2Fbutton$2Elzx_161_115",LzView,["$lzc$bind_x$$lz$2Fbutton$2Elzx_161_115_$m166",function($1){
with(this){
this.setAttribute("x",parent.parent.width-2)
}},"$lzc$dependencies_x$$lz$2Fbutton$2Elzx_161_115_$m166",function(){
with(this){
return [parent.parent,"width"]
}},"$lzc$bind_height$$lz$2Fbutton$2Elzx_161_115_$m169",function($1){
with(this){
this.setAttribute("height",parent.parent.height-2)
}},"$lzc$dependencies_height$$lz$2Fbutton$2Elzx_161_115_$m169",function(){
with(this){
return [parent.parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Fbutton$2Elzx_161_115","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Fbutton$2Elzx_161_115){
with($lzc$class_view_$lz$2Fbutton$2Elzx_161_115.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Fbutton$2Elzx_161_115.attributes)
}}})();ConstructorMap["view_$lz$2Fbutton$2Elzx_161_115"]=$lzc$class_view_$lz$2Fbutton$2Elzx_161_115;$lzc$class_view_$lz$2Fbutton$2Elzx_162_116=Class.make("$lzc$class_view_$lz$2Fbutton$2Elzx_162_116",LzView,["$lzc$bind_y$$lz$2Fbutton$2Elzx_162_116_$m172",function($1){
with(this){
this.setAttribute("y",parent.parent.height-2)
}},"$lzc$dependencies_y$$lz$2Fbutton$2Elzx_162_116_$m172",function(){
with(this){
return [parent.parent,"height"]
}},"$lzc$bind_width$$lz$2Fbutton$2Elzx_162_116_$m173",function($1){
with(this){
this.setAttribute("width",parent.parent.width-3)
}},"$lzc$dependencies_width$$lz$2Fbutton$2Elzx_162_116_$m173",function(){
with(this){
return [parent.parent,"width"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Fbutton$2Elzx_162_116","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Fbutton$2Elzx_162_116){
with($lzc$class_view_$lz$2Fbutton$2Elzx_162_116.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Fbutton$2Elzx_162_116.attributes)
}}})();ConstructorMap["view_$lz$2Fbutton$2Elzx_162_116"]=$lzc$class_view_$lz$2Fbutton$2Elzx_162_116;$lzc$class_view_$lz$2Fbutton$2Elzx_166_127=Class.make("$lzc$class_view_$lz$2Fbutton$2Elzx_166_127",LzView,["$lzc$bind_x$$lz$2Fbutton$2Elzx_166_127_$m178",function($1){
with(this){
this.setAttribute("x",parent.parent.width-1)
}},"$lzc$dependencies_x$$lz$2Fbutton$2Elzx_166_127_$m178",function(){
with(this){
return [parent.parent,"width"]
}},"$lzc$bind_height$$lz$2Fbutton$2Elzx_166_127_$m181",function($1){
with(this){
this.setAttribute("height",parent.parent.height)
}},"$lzc$dependencies_height$$lz$2Fbutton$2Elzx_166_127_$m181",function(){
with(this){
return [parent.parent,"height"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Fbutton$2Elzx_166_127","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Fbutton$2Elzx_166_127){
with($lzc$class_view_$lz$2Fbutton$2Elzx_166_127.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Fbutton$2Elzx_166_127.attributes)
}}})();ConstructorMap["view_$lz$2Fbutton$2Elzx_166_127"]=$lzc$class_view_$lz$2Fbutton$2Elzx_166_127;$lzc$class_view_$lz$2Fbutton$2Elzx_167_130=Class.make("$lzc$class_view_$lz$2Fbutton$2Elzx_167_130",LzView,["$lzc$bind_y$$lz$2Fbutton$2Elzx_167_130_$m185",function($1){
with(this){
this.setAttribute("y",parent.parent.height-1)
}},"$lzc$dependencies_y$$lz$2Fbutton$2Elzx_167_130_$m185",function(){
with(this){
return [parent.parent,"height"]
}},"$lzc$bind_width$$lz$2Fbutton$2Elzx_167_130_$m186",function($1){
with(this){
this.setAttribute("width",parent.parent.width-1)
}},"$lzc$dependencies_width$$lz$2Fbutton$2Elzx_167_130_$m186",function(){
with(this){
return [parent.parent,"width"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$lz$2Fbutton$2Elzx_167_130","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$lz$2Fbutton$2Elzx_167_130){
with($lzc$class_view_$lz$2Fbutton$2Elzx_167_130.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$lz$2Fbutton$2Elzx_167_130.attributes)
}}})();ConstructorMap["view_$lz$2Fbutton$2Elzx_167_130"]=$lzc$class_view_$lz$2Fbutton$2Elzx_167_130;$lzc$class_text_$lz$2Fbutton$2Elzx_175_28=Class.make("$lzc$class_text_$lz$2Fbutton$2Elzx_175_28",LzText,["$lzc$bind_x$$lz$2Fbutton$2Elzx_175_28_$m189",function($1){
with(this){
this.setAttribute("x",parent.text_x+parent.titleshift)
}},"$lzc$dependencies_x$$lz$2Fbutton$2Elzx_175_28_$m189",function(){
with(this){
return [parent,"text_x",parent,"titleshift"]
}},"$lzc$bind_y$$lz$2Fbutton$2Elzx_175_28_$m190",function($1){
with(this){
this.setAttribute("y",parent.text_y+parent.titleshift)
}},"$lzc$dependencies_y$$lz$2Fbutton$2Elzx_175_28_$m190",function(){
with(this){
return [parent,"text_y",parent,"titleshift"]
}},"$lzc$bind_text$$lz$2Fbutton$2Elzx_175_28_$m191",function($1){
with(this){
this.setAttribute("text",parent.text)
}},"$lzc$dependencies_text$$lz$2Fbutton$2Elzx_175_28_$m191",function(){
with(this){
return [parent,"text"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","text_$lz$2Fbutton$2Elzx_175_28","children",LzNode.mergeChildren([],LzText["children"]),"attributes",new LzInheritedHash(LzText.attributes)]);(function(){
with($lzc$class_text_$lz$2Fbutton$2Elzx_175_28){
with($lzc$class_text_$lz$2Fbutton$2Elzx_175_28.prototype){
LzNode.mergeAttributes({},$lzc$class_text_$lz$2Fbutton$2Elzx_175_28.attributes)
}}})();ConstructorMap["text_$lz$2Fbutton$2Elzx_175_28"]=$lzc$class_text_$lz$2Fbutton$2Elzx_175_28;$lzc$class_button=Class.make("$lzc$class_button",$lzc$class_basebutton,["text_padding_x",void 0,"text_padding_y",void 0,"$lzc$bind_text_x$$lz$2Fbutton$2Elzx_50_70_$m135",function($1){
this.setAttribute("text_x",this.width/2-this._title.width/2)
},"$lzc$dependencies_text_x$$lz$2Fbutton$2Elzx_50_70_$m135",function(){
return [this,"width",this._title,"width"]
},"text_x",void 0,"$lzc$bind_text_y$$lz$2Fbutton$2Elzx_53_72_$m136",function($1){
this.setAttribute("text_y",this.height/2-this._title.height/2)
},"$lzc$dependencies_text_y$$lz$2Fbutton$2Elzx_53_72_$m136",function(){
return [this,"height",this._title,"height"]
},"text_y",void 0,"$lzc$bind_width$$lz$2Fbutton$2Elzx_56_83_$m137",function($1){
this.setAttribute("width",this._title.width+2*this.text_padding_x)
},"$lzc$dependencies_width$$lz$2Fbutton$2Elzx_56_83_$m137",function(){
return [this._title,"width",this,"text_padding_x"]
},"$lzc$bind_height$$lz$2Fbutton$2Elzx_58_85_$m138",function($1){
this.setAttribute("height",this._title.height+2*this.text_padding_y)
},"$lzc$dependencies_height$$lz$2Fbutton$2Elzx_58_85_$m138",function(){
return [this._title,"height",this,"text_padding_y"]
},"buttonstate",void 0,"$lzc$bind_titleshift$$lz$2Fbutton$2Elzx_66_28_$m140",function($1){
this.setAttribute("titleshift",this.buttonstate==1?0:1)
},"$lzc$dependencies_titleshift$$lz$2Fbutton$2Elzx_66_28_$m140",function(){
return [this,"buttonstate"]
},"titleshift",void 0,"leftalign",void 0,"_showEnabled",function(){
with(this){
showUp();setAttribute("clickable",_enabled)
}},"showDown",function($1){
with(this){
if(arguments.length<1){
$1=null
};if(this.hasdefault){
this._outerbezel.setResourceNumber(5)
}else{
this._outerbezel.setResourceNumber(this.downResourceNumber)
};this._face.setResourceNumber(this.downResourceNumber);this._innerbezel.setResourceNumber(this.downResourceNumber);setAttribute("buttonstate",2)
}},"showUp",function($1){
with(this){
if(arguments.length<1){
$1=null
};if(_enabled){
if(this.hasdefault){
this._outerbezel.setResourceNumber(5)
}else{
this._outerbezel.setResourceNumber(this.normalResourceNumber)
};this._face.setResourceNumber(this.normalResourceNumber);this._innerbezel.setResourceNumber(this.normalResourceNumber);if(this.style){
this._title.setAttribute("fgcolor",this.style.textcolor)
}}else{
if(this.style){
this._title.setAttribute("fgcolor",this.style.textdisabledcolor)
};this._face.setResourceNumber(this.disabledResourceNumber);this._outerbezel.setResourceNumber(this.disabledResourceNumber);this._innerbezel.setResourceNumber(this.disabledResourceNumber)
};setAttribute("buttonstate",1)
}},"showOver",function($1){
with(this){
if(arguments.length<1){
$1=null
};if(this.hasdefault){
this._outerbezel.setResourceNumber(5)
}else{
this._outerbezel.setResourceNumber(this.overResourceNumber)
};this._face.setResourceNumber(this.overResourceNumber);this._innerbezel.setResourceNumber(this.overResourceNumber);setAttribute("buttonstate",1)
}},"$lzc$handle_onhasdefault$$lz$2Fbutton$2Elzx_127_34_$m144",function($1){
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
}}},"_outerbezel",void 0,"_innerbezel",void 0,"_face",void 0,"_innerbezelbottom",void 0,"_outerbezelbottom",void 0,"_title",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","button","children",LzNode.mergeChildren([{attrs:{$classrootdepth:1,bgcolor:9539985,height:new LzAlwaysExpr("$lzc$bind_height$$lz$2Fbutton$2Elzx_154_116_$m150","$lzc$dependencies_height$$lz$2Fbutton$2Elzx_154_116_$m150"),name:"_outerbezel",width:new LzAlwaysExpr("$lzc$bind_width$$lz$2Fbutton$2Elzx_154_116_$m149","$lzc$dependencies_width$$lz$2Fbutton$2Elzx_154_116_$m149"),x:0,y:0},name:"view_$lz$2Fbutton$2Elzx_154_116"},{attrs:{$classrootdepth:1,bgcolor:16777215,height:new LzAlwaysExpr("$lzc$bind_height$$lz$2Fbutton$2Elzx_155_116_$m156","$lzc$dependencies_height$$lz$2Fbutton$2Elzx_155_116_$m156"),name:"_innerbezel",width:new LzAlwaysExpr("$lzc$bind_width$$lz$2Fbutton$2Elzx_155_116_$m155","$lzc$dependencies_width$$lz$2Fbutton$2Elzx_155_116_$m155"),x:1,y:1},name:"view_$lz$2Fbutton$2Elzx_155_116"},{attrs:{$classrootdepth:1,height:new LzAlwaysExpr("$lzc$bind_height$$lz$2Fbutton$2Elzx_158_76_$m163","$lzc$dependencies_height$$lz$2Fbutton$2Elzx_158_76_$m163"),name:"_face",resource:"lzbutton_face_rsc",stretches:"both",width:new LzAlwaysExpr("$lzc$bind_width$$lz$2Fbutton$2Elzx_158_76_$m162","$lzc$dependencies_width$$lz$2Fbutton$2Elzx_158_76_$m162"),x:2,y:2},name:"view_$lz$2Fbutton$2Elzx_158_76"},{attrs:{$classrootdepth:1,name:"_innerbezelbottom"},children:[{attrs:{$classrootdepth:2,bgcolor:5789784,height:new LzAlwaysExpr("$lzc$bind_height$$lz$2Fbutton$2Elzx_161_115_$m169","$lzc$dependencies_height$$lz$2Fbutton$2Elzx_161_115_$m169"),width:1,x:new LzAlwaysExpr("$lzc$bind_x$$lz$2Fbutton$2Elzx_161_115_$m166","$lzc$dependencies_x$$lz$2Fbutton$2Elzx_161_115_$m166"),y:1},name:"view_$lz$2Fbutton$2Elzx_161_115"},{attrs:{$classrootdepth:2,bgcolor:5789784,height:1,width:new LzAlwaysExpr("$lzc$bind_width$$lz$2Fbutton$2Elzx_162_116_$m173","$lzc$dependencies_width$$lz$2Fbutton$2Elzx_162_116_$m173"),x:1,y:new LzAlwaysExpr("$lzc$bind_y$$lz$2Fbutton$2Elzx_162_116_$m172","$lzc$dependencies_y$$lz$2Fbutton$2Elzx_162_116_$m172")},name:"view_$lz$2Fbutton$2Elzx_162_116"}],name:"view"},{attrs:{$classrootdepth:1,name:"_outerbezelbottom"},children:[{attrs:{$classrootdepth:2,bgcolor:16777215,height:new LzAlwaysExpr("$lzc$bind_height$$lz$2Fbutton$2Elzx_166_127_$m181","$lzc$dependencies_height$$lz$2Fbutton$2Elzx_166_127_$m181"),opacity:0.7,width:1,x:new LzAlwaysExpr("$lzc$bind_x$$lz$2Fbutton$2Elzx_166_127_$m178","$lzc$dependencies_x$$lz$2Fbutton$2Elzx_166_127_$m178"),y:0},name:"view_$lz$2Fbutton$2Elzx_166_127"},{attrs:{$classrootdepth:2,bgcolor:16777215,height:1,opacity:0.7,width:new LzAlwaysExpr("$lzc$bind_width$$lz$2Fbutton$2Elzx_167_130_$m186","$lzc$dependencies_width$$lz$2Fbutton$2Elzx_167_130_$m186"),x:0,y:new LzAlwaysExpr("$lzc$bind_y$$lz$2Fbutton$2Elzx_167_130_$m185","$lzc$dependencies_y$$lz$2Fbutton$2Elzx_167_130_$m185")},name:"view_$lz$2Fbutton$2Elzx_167_130"}],name:"view"},{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$lzc$bind_text$$lz$2Fbutton$2Elzx_175_28_$m191","$lzc$dependencies_text$$lz$2Fbutton$2Elzx_175_28_$m191"),x:new LzAlwaysExpr("$lzc$bind_x$$lz$2Fbutton$2Elzx_175_28_$m189","$lzc$dependencies_x$$lz$2Fbutton$2Elzx_175_28_$m189"),y:new LzAlwaysExpr("$lzc$bind_y$$lz$2Fbutton$2Elzx_175_28_$m190","$lzc$dependencies_y$$lz$2Fbutton$2Elzx_175_28_$m190")},name:"text_$lz$2Fbutton$2Elzx_175_28"}],$lzc$class_basebutton["children"]),"attributes",new LzInheritedHash($lzc$class_basebutton.attributes)]);(function(){
with($lzc$class_button){
with($lzc$class_button.prototype){
LzNode.mergeAttributes({$delegates:["onhasdefault","$lzc$handle_onhasdefault$$lz$2Fbutton$2Elzx_127_34_$m144",null],buttonstate:1,clickable:true,doesenter:true,focusable:true,height:new LzAlwaysExpr("$lzc$bind_height$$lz$2Fbutton$2Elzx_58_85_$m138","$lzc$dependencies_height$$lz$2Fbutton$2Elzx_58_85_$m138"),leftalign:false,maxframes:4,pixellock:true,styleable:true,text_padding_x:11,text_padding_y:4,text_x:new LzAlwaysExpr("$lzc$bind_text_x$$lz$2Fbutton$2Elzx_50_70_$m135","$lzc$dependencies_text_x$$lz$2Fbutton$2Elzx_50_70_$m135"),text_y:new LzAlwaysExpr("$lzc$bind_text_y$$lz$2Fbutton$2Elzx_53_72_$m136","$lzc$dependencies_text_y$$lz$2Fbutton$2Elzx_53_72_$m136"),titleshift:new LzAlwaysExpr("$lzc$bind_titleshift$$lz$2Fbutton$2Elzx_66_28_$m140","$lzc$dependencies_titleshift$$lz$2Fbutton$2Elzx_66_28_$m140"),width:new LzAlwaysExpr("$lzc$bind_width$$lz$2Fbutton$2Elzx_56_83_$m137","$lzc$dependencies_width$$lz$2Fbutton$2Elzx_56_83_$m137")},$lzc$class_button.attributes)
}}})();ConstructorMap["button"]=$lzc$class_button;$lzc$class_basevaluecomponent=Class.make("$lzc$class_basevaluecomponent",$lzc$class_basecomponent,["value",void 0,"getValue",function(){
return this.value==null?this.text:this.value
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","basevaluecomponent","children",LzNode.mergeChildren([],$lzc$class_basecomponent["children"]),"attributes",new LzInheritedHash($lzc$class_basecomponent.attributes)]);(function(){
with($lzc$class_basevaluecomponent){
with($lzc$class_basevaluecomponent.prototype){
LzNode.mergeAttributes({value:null},$lzc$class_basevaluecomponent.attributes)
}}})();ConstructorMap["basevaluecomponent"]=$lzc$class_basevaluecomponent;$lzc$class_baseformitem=Class.make("$lzc$class_baseformitem",$lzc$class_basevaluecomponent,["_parentform",void 0,"submitname",void 0,"$lzc$bind_submit$$base$2Fbaseformitem$2Elzx_20_69_$m196",function($1){
with(this){
this.setAttribute("submit",enabled)
}},"$lzc$dependencies_submit$$base$2Fbaseformitem$2Elzx_20_69_$m196",function(){
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
}},"$lzc$handle_oninit$$base$2Fbaseformitem$2Elzx_63_32_$m203",function($1){
var $2=this.findForm();if($2!=null){
$2.addFormItem(this);this._parentform=$2
}},"setChanged",function($1,$2){
with(this){
if(arguments.length<2){
$2=null
};if(!this._initcomplete){
this.changed=false;return
};var $3=this.changed;this.changed=$1;if(this.changed!=$3){
if(this.onchanged){
this.onchanged.sendEvent(this.changed)
}};if(!$2&&this.changed&&!ignoreform){
if(this["_parentform"]&&this._parentform["changed"]!=undefined&&!this._parentform.changed){
this._parentform.setChanged($1)
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
if(arguments.length<2){
$2=null
};var $3=this.value!=$1;this.value=$1;if($2||!this._initcomplete){
this.rollbackvalue=$1
};this.setChanged($3&&!$2&&this.rollbackvalue!=$1);if(this["onvalue"]){
this.onvalue.sendEvent($1)
}},"applyData",function($1){
this.setValue($1,true)
},"updateData",function(){
return this.value
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
}};return LzBrowser.xmlEscape(this.submitname)+'="'+LzBrowser.xmlEscape($2)+'"'
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","baseformitem","children",LzNode.mergeChildren([],$lzc$class_basevaluecomponent["children"]),"attributes",new LzInheritedHash($lzc$class_basevaluecomponent.attributes)]);(function(){
with($lzc$class_baseformitem){
with($lzc$class_baseformitem.prototype){
LzNode.mergeAttributes({$delegates:["oninit","$lzc$handle_oninit$$base$2Fbaseformitem$2Elzx_63_32_$m203",null],_parentform:null,changed:false,ignoreform:false,onchanged:LzDeclaredEvent,onvalue:LzDeclaredEvent,rollbackvalue:null,submit:new LzAlwaysExpr("$lzc$bind_submit$$base$2Fbaseformitem$2Elzx_20_69_$m196","$lzc$dependencies_submit$$base$2Fbaseformitem$2Elzx_20_69_$m196"),submitname:"",value:null},$lzc$class_baseformitem.attributes)
}}})();ConstructorMap["baseformitem"]=$lzc$class_baseformitem;$lzc$class_multistatebutton=Class.make("$lzc$class_multistatebutton",$lzc$class_basebutton,["statenum",void 0,"$lzc$set_statenum",function($1){
this.setStateNum($1)
},"statelength",void 0,"$lzc$set_statelength",function($1){
this.setStateLength($1)
},"maxstate",void 0,"lastres",void 0,"$lzc$bind_frame$$base$2Fmultistatebutton$2Elzx_14_95_$m209",function($1){
this.setAttribute("frame",this.lastres+this.statenum*this.statelength)
},"$lzc$dependencies_frame$$base$2Fmultistatebutton$2Elzx_14_95_$m209",function(){
return [this,"lastres",this,"statenum",this,"statelength"]
},"onstatenum",void 0,"onstatelength",void 0,"showDown",function($1){
if(arguments.length<1){
$1=null
};this.setAttribute("lastres",this.downResourceNumber)
},"showUp",function($1){
if(arguments.length<1){
$1=null
};if(!this._enabled&&this.disabledResourceNumber){
this.setAttribute("lastres",this.disabledResourceNumber)
}else{
this.setAttribute("lastres",this.normalResourceNumber)
}},"showOver",function($1){
if(arguments.length<1){
$1=null
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
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","multistatebutton","children",LzNode.mergeChildren([],$lzc$class_basebutton["children"]),"attributes",new LzInheritedHash($lzc$class_basebutton.attributes)]);(function(){
with($lzc$class_multistatebutton){
with($lzc$class_multistatebutton.prototype){
LzNode.mergeAttributes({clickable:true,frame:new LzAlwaysExpr("$lzc$bind_frame$$base$2Fmultistatebutton$2Elzx_14_95_$m209","$lzc$dependencies_frame$$base$2Fmultistatebutton$2Elzx_14_95_$m209"),lastres:1,maxstate:0,onstatelength:LzDeclaredEvent,onstatenum:LzDeclaredEvent,statelength:3,statenum:0},$lzc$class_multistatebutton.attributes)
}}})();ConstructorMap["multistatebutton"]=$lzc$class_multistatebutton;LzResourceLibrary.lzcheckbox_rsrc={ptype:"sr",frames:["lps/components/lz/resources/checkbox/autoPng/checkbox_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_off_mo.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on.png","lps/components/lz/resources/checkbox/autoPng/checkbox_disable_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on_mo.png","lps/components/lz/resources/checkbox/autoPng/checkbox_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_disable_on.png"],width:15,height:14};$lzc$class_text_$lz$2Fcheckbox$2Elzx_22_97=Class.make("$lzc$class_text_$lz$2Fcheckbox$2Elzx_22_97",LzText,["$lzc$bind_y$$lz$2Fcheckbox$2Elzx_22_97_$m215",function($1){
with(this){
this.setAttribute("y",classroot.text_y)
}},"$lzc$dependencies_y$$lz$2Fcheckbox$2Elzx_22_97_$m215",function(){
with(this){
return [classroot,"text_y"]
}},"$lzc$bind_text$$lz$2Fcheckbox$2Elzx_22_97_$m216",function($1){
with(this){
this.setAttribute("text",parent.text)
}},"$lzc$dependencies_text$$lz$2Fcheckbox$2Elzx_22_97_$m216",function(){
with(this){
return [parent,"text"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","text_$lz$2Fcheckbox$2Elzx_22_97","children",LzNode.mergeChildren([],LzText["children"]),"attributes",new LzInheritedHash(LzText.attributes)]);(function(){
with($lzc$class_text_$lz$2Fcheckbox$2Elzx_22_97){
with($lzc$class_text_$lz$2Fcheckbox$2Elzx_22_97.prototype){
LzNode.mergeAttributes({},$lzc$class_text_$lz$2Fcheckbox$2Elzx_22_97.attributes)
}}})();ConstructorMap["text_$lz$2Fcheckbox$2Elzx_22_97"]=$lzc$class_text_$lz$2Fcheckbox$2Elzx_22_97;$lzc$class_multistatebutton_$lz$2Fcheckbox$2Elzx_35_32=Class.make("$lzc$class_multistatebutton_$lz$2Fcheckbox$2Elzx_35_32",$lzc$class_multistatebutton,["$lzc$bind_statenum$$lz$2Fcheckbox$2Elzx_35_32_$m223",function($1){
with(this){
this.setAttribute("statenum",parent.value?1:0)
}},"$lzc$dependencies_statenum$$lz$2Fcheckbox$2Elzx_35_32_$m223",function(){
with(this){
return [parent,"value"]
}},"$lzc$bind_reference$$lz$2Fcheckbox$2Elzx_35_32_$m226",function(){
with(this){
this.setAttribute("reference",parent)
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","multistatebutton_$lz$2Fcheckbox$2Elzx_35_32","children",LzNode.mergeChildren([],$lzc$class_multistatebutton["children"]),"attributes",new LzInheritedHash($lzc$class_multistatebutton.attributes)]);(function(){
with($lzc$class_multistatebutton_$lz$2Fcheckbox$2Elzx_35_32){
with($lzc$class_multistatebutton_$lz$2Fcheckbox$2Elzx_35_32.prototype){
LzNode.mergeAttributes({},$lzc$class_multistatebutton_$lz$2Fcheckbox$2Elzx_35_32.attributes)
}}})();ConstructorMap["multistatebutton_$lz$2Fcheckbox$2Elzx_35_32"]=$lzc$class_multistatebutton_$lz$2Fcheckbox$2Elzx_35_32;$lzc$class_checkbox=Class.make("$lzc$class_checkbox",$lzc$class_baseformitem,["_title",void 0,"$lzc$bind_text_y$$lz$2Fcheckbox$2Elzx_26_81_$m218",function($1){
this.setAttribute("text_y",this.cb.height/2-this._title.height/2+1)
},"$lzc$dependencies_text_y$$lz$2Fcheckbox$2Elzx_26_81_$m218",function(){
return [this.cb,"height",this._title,"height"]
},"text_y",void 0,"$lzc$set_value",function($1){
with(this){
setValue($1)
}},"cb",void 0,"doSpaceUp",function($1){
if(arguments.length<1){
$1=null
};if(this._enabled){
this.setAttribute("value",!this.value)
}},"$lzc$handle_onclick$$lz$2Fcheckbox$2Elzx_47_33_$m227",function($1){
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
if(arguments.length<2){
$2=null
};if($1=="false"){
$1=false
}else{
if($1=="true"){
$1=true
}else{
$1=!(!$1)
}};(arguments.callee.superclass?arguments.callee.superclass.prototype["setValue"]:this.nextMethod(arguments.callee,"setValue")).call(this,$1,$2)
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","checkbox","children",LzNode.mergeChildren([{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$lzc$bind_text$$lz$2Fcheckbox$2Elzx_22_97_$m216","$lzc$dependencies_text$$lz$2Fcheckbox$2Elzx_22_97_$m216"),x:16,y:new LzAlwaysExpr("$lzc$bind_y$$lz$2Fcheckbox$2Elzx_22_97_$m215","$lzc$dependencies_y$$lz$2Fcheckbox$2Elzx_22_97_$m215")},name:"text_$lz$2Fcheckbox$2Elzx_22_97"},{attrs:{$classrootdepth:1,maxstate:1,name:"cb",reference:new LzOnceExpr("$lzc$bind_reference$$lz$2Fcheckbox$2Elzx_35_32_$m226"),resource:"lzcheckbox_rsrc",statelength:4,statenum:new LzAlwaysExpr("$lzc$bind_statenum$$lz$2Fcheckbox$2Elzx_35_32_$m223","$lzc$dependencies_statenum$$lz$2Fcheckbox$2Elzx_35_32_$m223"),text:""},name:"multistatebutton_$lz$2Fcheckbox$2Elzx_35_32"}],$lzc$class_baseformitem["children"]),"attributes",new LzInheritedHash($lzc$class_baseformitem.attributes)]);(function(){
with($lzc$class_checkbox){
with($lzc$class_checkbox.prototype){
LzNode.mergeAttributes({$delegates:["onclick","$lzc$handle_onclick$$lz$2Fcheckbox$2Elzx_47_33_$m227",null],clickable:true,pixellock:true,text_y:new LzAlwaysExpr("$lzc$bind_text_y$$lz$2Fcheckbox$2Elzx_26_81_$m218","$lzc$dependencies_text_y$$lz$2Fcheckbox$2Elzx_26_81_$m218"),value:false},$lzc$class_checkbox.attributes)
}}})();ConstructorMap["checkbox"]=$lzc$class_checkbox;$lzc$class_listselector=Class.make("$lzc$class_listselector",LzSelectionManager,["multiselect",void 0,"_forcemulti",void 0,"isRangeSelect",function($1){
with(this){
var $2=false;if(multiselect){
$2=(arguments.callee.superclass?arguments.callee.superclass.prototype["isRangeSelect"]:this.nextMethod(arguments.callee,"isRangeSelect")).call(this,$1)
};return $2
}},"isMultiSelect",function($1){
with(this){
var $2=false;if(_forcemulti){
$2=true
}else{
if(multiselect){
$2=(arguments.callee.superclass?arguments.callee.superclass.prototype["isMultiSelect"]:this.nextMethod(arguments.callee,"isMultiSelect")).call(this,$1)
}};return $2
}},"select",function($1){
with(this){
if($1["length"]&&multiselect){
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
if(typeof $2=="undefined"){
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
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","listselector","children",LzNode.mergeChildren([],LzSelectionManager["children"]),"attributes",new LzInheritedHash(LzSelectionManager.attributes)]);(function(){
with($lzc$class_listselector){
with($lzc$class_listselector.prototype){
LzNode.mergeAttributes({_forcemulti:false,_updatefromscrolling:false,multiselect:false},$lzc$class_listselector.attributes)
}}})();ConstructorMap["listselector"]=$lzc$class_listselector;$lzc$class_datalistselector=Class.make("$lzc$class_datalistselector",LzDataSelectionManager,["multiselect",void 0,"_forcemulti",void 0,"cloneManager",void 0,"isRangeSelect",function($1){
with(this){
var $2=false;if(multiselect){
$2=(arguments.callee.superclass?arguments.callee.superclass.prototype["isRangeSelect"]:this.nextMethod(arguments.callee,"isRangeSelect")).call(this,$1)
};return $2
}},"isMultiSelect",function($1){
with(this){
var $2=false;if(_forcemulti){
$2=true
}else{
if(multiselect){
$2=(arguments.callee.superclass?arguments.callee.superclass.prototype["isMultiSelect"]:this.nextMethod(arguments.callee,"isMultiSelect")).call(this,$1)
}};return $2
}},"select",function($1){
with(this){
if($1["length"]&&multiselect){
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
}};if(!this.cloneManager["nodes"]){
return 0
};return this.cloneManager.nodes.length
}},"getNextSubview",function($1,$2){
with(this){
var $3=immediateparent.subviews[0].cloneManager.clones;if($1==null){
var $4=$2==-1&&parent.shownitems!=-1?parent.shownitems-1:0;return $3[$4]
};var $5=findIndex($1);if($5==-1){
return null
};var $6=immediateparent.subviews[0].cloneManager.nodes;if(!$2){
$2=1
};$5=$5+=$2;if($5==-1){
$5=0
};if($5==$6.length){
$5=$6.length-1
};_ensureItemInViewByIndex($5);var $7=$6[$5];var $8=immediateparent.subviews;for(var $9=0;$9<$8.length;$9++){
if($8[$9].datapath.p==$7){
return $8[$9]
}}}},"findIndex",function($1){
with(this){
if(!immediateparent.subviews[0].cloneManager){
if($1 instanceof LzView){
return immediateparent.subviews[0]==$1?0:-1
}else{
return immediateparent.subviews[0].datapath.p==$1.p?0:-1
}};var $2;if($1 instanceof LzView){
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
if(!immediateparent.subviews||immediateparent.subviews.length==0){
return
};var $2=immediateparent.parent;var $3=immediateparent.subviews[0].height;var $4=$1*$3;var $5=0;if($1>0){
var $6=immediateparent.subviews[0].cloneManager;if(parent["spacing"]){
$5=parent.spacing
}else{
if($6["spacing"]){
$5=$6.spacing
}};$4+=$5*($1-1)
};var $7=false;if($4+$3>$2.height-immediateparent.y){
var $8=$2.height-immediateparent.y-($4+$3+$5);var $9=Math.max($2.height-immediateparent.height,immediateparent.y+$8);immediateparent.setAttribute("y",$9);$7=true
}else{
if(immediateparent.y*-1>$4){
var $8=immediateparent.y*-1-$4-$5;var $9=Math.min(0,immediateparent.y+$8);immediateparent.setAttribute("y",$9);$7=true
}};if($7){
this._updatefromscrolling=true
}}},"getItemByIndex",function($1){
with(this){
if(!immediateparent.subviews||immediateparent.subviews.length==0){
return null
};this._ensureItemInViewByIndex($1);var $2=immediateparent.subviews;var $3=$2[0].cloneManager;if($3==null){
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
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","datalistselector","children",LzNode.mergeChildren([],LzDataSelectionManager["children"]),"attributes",new LzInheritedHash(LzDataSelectionManager.attributes)]);(function(){
with($lzc$class_datalistselector){
with($lzc$class_datalistselector.prototype){
LzNode.mergeAttributes({_forcemulti:false,_updatefromscrolling:false,cloneManager:null,multiselect:false},$lzc$class_datalistselector.attributes)
}}})();ConstructorMap["datalistselector"]=$lzc$class_datalistselector;$lzc$class_baselist=Class.make("$lzc$class_baselist",$lzc$class_baseformitem,["itemclassname",void 0,"defaultselection",void 0,"multiselect",void 0,"toggleselected",void 0,"dataoption",void 0,"_hiliteview",void 0,"_contentview",void 0,"_initialselection",void 0,"doEnterDown",function(){
if(this._hiliteview&&this._hiliteview.enabled){
this._hiliteview.setAttribute("selected",true)
}},"doEnterUp",function(){
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
if(this["_selector"]){
var $2=this._selector.getSelection();if($2&&$2.length>0){
this._hiliteview=$2[0]
}}},"_doblur",function($1){
if(this._hiliteview&&this._hiliteview.setHilite){
this._hiliteview["setHilite"](false)
};this._hiliteview=null
},"setHilite",function($1){
if(this._selector.allowhilite($1)){
if(this._hiliteview&&this._hiliteview.setHilite){
this._hiliteview["setHilite"](false)
};this._hiliteview=$1;if(this._hiliteview){
$1["setHilite"](true)
}}},"_dokeydown",function($1){
with(this){
if($1==32&&this._hiliteview&&this._hiliteview.enabled){
this._hiliteview.setAttribute("selected",true);return
};if($1>=37&&$1<=40){
this.setAttribute("doesenter",true);var $2=this._hiliteview;if($2==null){
$2=getSelection();if(this.multiselect){
$2=$2[0]
}};var $3;if($1==39||$1==40){
$3=_selector.getNextSubview($2)
};if($1==37||$1==38){
$3=_selector.getNextSubview($2,-1)
};if(this._hiliteview&&this._hiliteview.setHilite&&this._hiliteview!=0){
this._hiliteview["setHilite"](false)
};$3["setHilite"](true);this._hiliteview=$3
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
};var $5=LzFocus.getFocus();select($3);if($4&&$5&&$5.childOf($4)){
LzFocus.setFocus($3)
}}},"getNumItems",function(){
if(!this["_selector"]){
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
if(this["itemclassname"]&&lz[this.itemclassname]){
new (lz[this.itemclassname])(this,{text:$1,value:$2})
}else{

}}},"removeItem",function($1){
with(this){
var $2=getItem($1);_removeitem($2)
}},"removeItemAt",function($1){
with(this){
var $2=_contentview.subviews[$1];_removeitem($2)
}},"_removeitem",function($1){
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
if(typeof this._selector!="undefined"){
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
}}};if(this._hiliteview&&this._hiliteview.setHilite&&this._hiliteview["enabled"]){
this._hiliteview["setHilite"](false);this._hiliteview=null
};this.setAttribute("doesenter",false);if(this.onselect){
this.onselect.sendEvent($1)
}}},"applyData",function($1){
this.setAttribute("value",$1)
},"updateData",function(){
return this.getValue()
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","baselist","children",LzNode.mergeChildren([],$lzc$class_baseformitem["children"]),"attributes",new LzInheritedHash($lzc$class_baseformitem.attributes)]);(function(){
with($lzc$class_baselist){
with($lzc$class_baselist.prototype){
LzNode.mergeAttributes({$delegates:["onfocus","_doFocus",null,"onblur","_doblur",null,"onkeydown","_dokeydown",null],_contentview:null,_hiliteview:null,_initialselection:null,dataoption:"none",defaultselection:null,itemclassname:"",multiselect:false,onselect:LzDeclaredEvent,toggleselected:false},$lzc$class_baselist.attributes)
}}})();ConstructorMap["baselist"]=$lzc$class_baselist;$lzc$class_baselistitem=Class.make("$lzc$class_baselistitem",$lzc$class_basevaluecomponent,["selected",void 0,"$lzc$set_selected",function($1){
this._setSelected($1)
},"onselected",void 0,"_selectonevent",void 0,"$lzc$set__selectonevent",function($1){
this.setSelectOnEvent($1)
},"setDatapath",function($1){
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
}};new LzDatapath(this,$2)
}}},"_valuedatapath",void 0,"_textdatapath",void 0,"dataBindAttribute",function($1,$2){
with(this){
if(this._parentcomponent.dataoption=="lazy"||this._parentcomponent.dataoption=="resize"){
if($1=="text"){
this._textdatapath=$2
}else{
if($1=="value"){
this._valuedatapath=$2
}}};(arguments.callee.superclass?arguments.callee.superclass.prototype["dataBindAttribute"]:this.nextMethod(arguments.callee,"dataBindAttribute")).call(this,$1,$2)
}},"setSelectOnEvent",function($1){
with(this){
this._selectDL=new LzDelegate(this,"doClick",this,$1)
}},"doClick",function($1){
if(this._parentcomponent){
this._parentcomponent.select(this)
}},"_doMousedown",function($1){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["_doMousedown"]:this.nextMethod(arguments.callee,"_doMousedown")).call(this,$1);if(!this.focusable&&this._parentcomponent&&this._parentcomponent.focusable){
LzFocus.setFocus(this._parentcomponent,false)
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
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","baselistitem","children",LzNode.mergeChildren([],$lzc$class_basevaluecomponent["children"]),"attributes",new LzInheritedHash($lzc$class_basevaluecomponent.attributes)]);(function(){
with($lzc$class_baselistitem){
with($lzc$class_baselistitem.prototype){
LzNode.mergeAttributes({_selectonevent:"onclick",_textdatapath:null,_valuedatapath:null,clickable:true,focusable:false,onselect:LzDeclaredEvent,onselected:LzDeclaredEvent,selected:false},$lzc$class_baselistitem.attributes)
}}})();ConstructorMap["baselistitem"]=$lzc$class_baselistitem;$lzc$class_simplelayout=Class.make("$lzc$class_simplelayout",LzLayout,["axis",void 0,"$lzc$set_axis",function($1){
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
if(arguments.length<1){
$1=null
};if(this.locked){
return
};var $2=this.subviews.length;var $3=this.inset;for(var $4=0;$4<$2;$4++){
var $5=this.subviews[$4];if(!$5.visible){
continue
};if($5[this.axis]!=$3){
$5.setAttribute(this.axis,$3)
};$3+=this.spacing+$5[this.sizeAxis]
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","simplelayout","children",LzNode.mergeChildren([],LzLayout["children"]),"attributes",new LzInheritedHash(LzLayout.attributes)]);(function(){
with($lzc$class_simplelayout){
with($lzc$class_simplelayout.prototype){
LzNode.mergeAttributes({axis:"y",inset:0,spacing:0},$lzc$class_simplelayout.attributes)
}}})();ConstructorMap["simplelayout"]=$lzc$class_simplelayout;LzResourceLibrary.lzradio_rsrc={ptype:"sr",frames:["lps/components/lz/resources/radio/autoPng/radiobtn_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_mo.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_dn.png"],width:14,height:14};$lzc$class_radiogroup=Class.make("$lzc$class_radiogroup",$lzc$class_baselist,["$lzc$set_value",function($1){
with(this){
_setvalue($1)
}},"applyData",function($1){
this._setvalue($1);var $2=null;if($1!=null){
$2=this.getItem($1)
};if($2){
this.select($2)
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
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","radiogroup","children",LzNode.mergeChildren([],$lzc$class_baselist["children"]),"attributes",new LzInheritedHash($lzc$class_baselist.attributes)]);(function(){
with($lzc$class_radiogroup){
with($lzc$class_radiogroup.prototype){
LzNode.mergeAttributes({defaultselection:0,itemclassname:"radiobutton",layout:{axis:"y","class":"simplelayout",spacing:5},onvalue:LzDeclaredEvent,value:null},$lzc$class_radiogroup.attributes)
}}})();ConstructorMap["radiogroup"]=$lzc$class_radiogroup;$lzc$class_multistatebutton_$lz$2Fradio$2Elzx_136_32=Class.make("$lzc$class_multistatebutton_$lz$2Fradio$2Elzx_136_32",$lzc$class_multistatebutton,["$lzc$bind_statenum$$lz$2Fradio$2Elzx_136_32_$m270",function($1){
with(this){
this.setAttribute("statenum",parent.selected?1:0)
}},"$lzc$dependencies_statenum$$lz$2Fradio$2Elzx_136_32_$m270",function(){
with(this){
return [parent,"selected"]
}},"$lzc$bind_reference$$lz$2Fradio$2Elzx_136_32_$m273",function(){
with(this){
this.setAttribute("reference",parent)
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","multistatebutton_$lz$2Fradio$2Elzx_136_32","children",LzNode.mergeChildren([],$lzc$class_multistatebutton["children"]),"attributes",new LzInheritedHash($lzc$class_multistatebutton.attributes)]);(function(){
with($lzc$class_multistatebutton_$lz$2Fradio$2Elzx_136_32){
with($lzc$class_multistatebutton_$lz$2Fradio$2Elzx_136_32.prototype){
LzNode.mergeAttributes({},$lzc$class_multistatebutton_$lz$2Fradio$2Elzx_136_32.attributes)
}}})();ConstructorMap["multistatebutton_$lz$2Fradio$2Elzx_136_32"]=$lzc$class_multistatebutton_$lz$2Fradio$2Elzx_136_32;$lzc$class_text_$lz$2Fradio$2Elzx_174_67=Class.make("$lzc$class_text_$lz$2Fradio$2Elzx_174_67",LzText,["$lzc$bind_y$$lz$2Fradio$2Elzx_174_67_$m277",function($1){
with(this){
this.setAttribute("y",classroot.text_y)
}},"$lzc$dependencies_y$$lz$2Fradio$2Elzx_174_67_$m277",function(){
with(this){
return [classroot,"text_y"]
}},"$lzc$bind_text$$lz$2Fradio$2Elzx_174_67_$m278",function($1){
with(this){
this.setAttribute("text",parent.text)
}},"$lzc$dependencies_text$$lz$2Fradio$2Elzx_174_67_$m278",function(){
with(this){
return [parent,"text"]
}},"$classrootdepth",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","text_$lz$2Fradio$2Elzx_174_67","children",LzNode.mergeChildren([],LzText["children"]),"attributes",new LzInheritedHash(LzText.attributes)]);(function(){
with($lzc$class_text_$lz$2Fradio$2Elzx_174_67){
with($lzc$class_text_$lz$2Fradio$2Elzx_174_67.prototype){
LzNode.mergeAttributes({},$lzc$class_text_$lz$2Fradio$2Elzx_174_67.attributes)
}}})();ConstructorMap["text_$lz$2Fradio$2Elzx_174_67"]=$lzc$class_text_$lz$2Fradio$2Elzx_174_67;$lzc$class_radiobutton=Class.make("$lzc$class_radiobutton",$lzc$class_baselistitem,["$lzc$bind_text_y$$lz$2Fradio$2Elzx_127_79_$m265",function($1){
this.setAttribute("text_y",this.rb.height/2-this._title.height/2)
},"$lzc$dependencies_text_y$$lz$2Fradio$2Elzx_127_79_$m265",function(){
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
}},"_title",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","radiobutton","children",LzNode.mergeChildren([{attrs:{$classrootdepth:1,maxstate:1,name:"rb",reference:new LzOnceExpr("$lzc$bind_reference$$lz$2Fradio$2Elzx_136_32_$m273"),resource:"lzradio_rsrc",statelength:4,statenum:new LzAlwaysExpr("$lzc$bind_statenum$$lz$2Fradio$2Elzx_136_32_$m270","$lzc$dependencies_statenum$$lz$2Fradio$2Elzx_136_32_$m270"),text:""},name:"multistatebutton_$lz$2Fradio$2Elzx_136_32"},{attrs:{$classrootdepth:1,name:"_title",resize:true,text:new LzAlwaysExpr("$lzc$bind_text$$lz$2Fradio$2Elzx_174_67_$m278","$lzc$dependencies_text$$lz$2Fradio$2Elzx_174_67_$m278"),x:17,y:new LzAlwaysExpr("$lzc$bind_y$$lz$2Fradio$2Elzx_174_67_$m277","$lzc$dependencies_y$$lz$2Fradio$2Elzx_174_67_$m277")},name:"text_$lz$2Fradio$2Elzx_174_67"}],$lzc$class_baselistitem["children"]),"attributes",new LzInheritedHash($lzc$class_baselistitem.attributes)]);(function(){
with($lzc$class_radiobutton){
with($lzc$class_radiobutton.prototype){
LzNode.mergeAttributes({clickable:true,focusable:false,initcomplete:0,text_y:new LzAlwaysExpr("$lzc$bind_text_y$$lz$2Fradio$2Elzx_127_79_$m265","$lzc$dependencies_text_y$$lz$2Fradio$2Elzx_127_79_$m265")},$lzc$class_radiobutton.attributes)
}}})();ConstructorMap["radiobutton"]=$lzc$class_radiobutton;LzInstantiateView({name:"script",attrs:{script:function(){
escapeXML=void 0;escapeXML=function($1){
return new XML().createTextNode($1).toString()
}}}},1);var appdata;appdata=lzAddLocalData("appdata","<data />",false);LzInstantiateView({name:"script",attrs:{script:function(){
app_runtime=void 0;app_debug=void 0;app_backtrace=void 0;app_console_debug=void 0;app_floating_window=void 0;app_fullpath=void 0;app_query=void 0;app_opt_url=void 0;app_unopt_url=void 0;app_url=void 0;app_opt_exists=void 0;app_lps_root=void 0;app_lzt=void 0;app_uid=void 0;appdata.setInitialData(global.appinfo);app_runtime=appdata.getPointer().xpathQuery("/info/@runtime");if(app_runtime==null){
app_runtime=appdata.getPointer().xpathQuery("/request/param[@name = 'lzr']/@value")
};app_debug=appdata.getPointer().xpathQuery("/request/param[@name = 'debug']/@value");app_backtrace=appdata.getPointer().xpathQuery("/request/param[@name = 'lzbacktrace']/@value");if(app_debug=="y"){
app_debug="true"
};app_console_debug=appdata.getPointer().xpathQuery("/request/@console-remote-debug")=="true";app_floating_window=appdata.getPointer().xpathQuery("/request/@console-floating-window")=="true";app_fullpath=appdata.getPointer().xpathQuery("/request/@fullpath");app_query=appdata.getPointer().xpathQuery("/request/@query_args");app_opt_url=appdata.getPointer().xpathQuery("/request/@opt-url");app_unopt_url=appdata.getPointer().xpathQuery("/request/@unopt-url");app_url=appdata.getPointer().xpathQuery("/request/@url");app_opt_exists=appdata.getPointer().xpathQuery("/request/@opt-exists");app_lps_root=appdata.getPointer().xpathQuery("/request/@lps");app_lzt=null;app_uid=typeof global.lzappuid!="undefined"?global.lzappuid:"";app_uid="XXX"
}}},1);LzResourceLibrary.footer_logo={ptype:"sr",frames:["lps/assets/logo_laszlo_footer.gif"],width:70,height:70};$lzc$class_view_$dev$2Dconsole$2Elzx_141_109=Class.make("$lzc$class_view_$dev$2Dconsole$2Elzx_141_109",LzView,["$lzc$bind_height$$dev$2Dconsole$2Elzx_141_109_$m284",function($1){
with(this){
this.setAttribute("height",app_console_debug?370:71)
}},"$lzc$dependencies_height$$dev$2Dconsole$2Elzx_141_109_$m284",function(){
return [this,"app_console_debug"]
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$dev$2Dconsole$2Elzx_141_109","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$dev$2Dconsole$2Elzx_141_109){
with($lzc$class_view_$dev$2Dconsole$2Elzx_141_109.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$dev$2Dconsole$2Elzx_141_109.attributes)
}}})();ConstructorMap["view_$dev$2Dconsole$2Elzx_141_109"]=$lzc$class_view_$dev$2Dconsole$2Elzx_141_109;$lzc$class_radiobutton_rb7=Class.make("$lzc$class_radiobutton_rb7",$lzc$class_radiobutton,["$lzc$bind_selected$rb7_$m309",function($1){
with(this){
this.setAttribute("selected",app_runtime=="swf7")
}},"$lzc$dependencies_selected$rb7_$m309",function(){
return [this,"app_runtime"]
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","radiobutton_rb7","children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);(function(){
with($lzc$class_radiobutton_rb7){
with($lzc$class_radiobutton_rb7.prototype){
LzNode.mergeAttributes({},$lzc$class_radiobutton_rb7.attributes)
}}})();ConstructorMap["radiobutton_rb7"]=$lzc$class_radiobutton_rb7;var rb7=null;$lzc$class_radiobutton_rb8=Class.make("$lzc$class_radiobutton_rb8",$lzc$class_radiobutton,["$lzc$bind_selected$rb8_$m312",function($1){
with(this){
this.setAttribute("selected",app_runtime=="swf8")
}},"$lzc$dependencies_selected$rb8_$m312",function(){
return [this,"app_runtime"]
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","radiobutton_rb8","children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);(function(){
with($lzc$class_radiobutton_rb8){
with($lzc$class_radiobutton_rb8.prototype){
LzNode.mergeAttributes({},$lzc$class_radiobutton_rb8.attributes)
}}})();ConstructorMap["radiobutton_rb8"]=$lzc$class_radiobutton_rb8;var rb8=null;$lzc$class_radiobutton_rb9=Class.make("$lzc$class_radiobutton_rb9",$lzc$class_radiobutton,["$lzc$bind_selected$rb9_$m315",function($1){
with(this){
this.setAttribute("selected",app_runtime=="swf9")
}},"$lzc$dependencies_selected$rb9_$m315",function(){
return [this,"app_runtime"]
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","radiobutton_rb9","children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);(function(){
with($lzc$class_radiobutton_rb9){
with($lzc$class_radiobutton_rb9.prototype){
LzNode.mergeAttributes({},$lzc$class_radiobutton_rb9.attributes)
}}})();ConstructorMap["radiobutton_rb9"]=$lzc$class_radiobutton_rb9;var rb9=null;$lzc$class_radiobutton_rbdhtml=Class.make("$lzc$class_radiobutton_rbdhtml",$lzc$class_radiobutton,["$lzc$bind_selected$rbdhtml_$m318",function($1){
with(this){
this.setAttribute("selected",app_runtime=="dhtml")
}},"$lzc$dependencies_selected$rbdhtml_$m318",function(){
return [this,"app_runtime"]
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","radiobutton_rbdhtml","children",LzNode.mergeChildren([],$lzc$class_radiobutton["children"]),"attributes",new LzInheritedHash($lzc$class_radiobutton.attributes)]);(function(){
with($lzc$class_radiobutton_rbdhtml){
with($lzc$class_radiobutton_rbdhtml.prototype){
LzNode.mergeAttributes({},$lzc$class_radiobutton_rbdhtml.attributes)
}}})();ConstructorMap["radiobutton_rbdhtml"]=$lzc$class_radiobutton_rbdhtml;var rbdhtml=null;var rg_runtime=null;$lzc$class_checkbox_cb_debug=Class.make("$lzc$class_checkbox_cb_debug",$lzc$class_checkbox,["$lzc$bind_value$cb_debug_$m325",function($1){
with(this){
this.setAttribute("value",app_debug=="true")
}},"$lzc$dependencies_value$cb_debug_$m325",function(){
return [this,"app_debug"]
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","checkbox_cb_debug","children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);(function(){
with($lzc$class_checkbox_cb_debug){
with($lzc$class_checkbox_cb_debug.prototype){
LzNode.mergeAttributes({},$lzc$class_checkbox_cb_debug.attributes)
}}})();ConstructorMap["checkbox_cb_debug"]=$lzc$class_checkbox_cb_debug;var cb_debug=null;$lzc$class_checkbox_cb_backtrace=Class.make("$lzc$class_checkbox_cb_backtrace",$lzc$class_checkbox,["$lzc$bind_value$cb_backtrace_$m329",function($1){
with(this){
this.setAttribute("value",app_backtrace=="true")
}},"$lzc$dependencies_value$cb_backtrace_$m329",function(){
return [this,"app_backtrace"]
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","checkbox_cb_backtrace","children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);(function(){
with($lzc$class_checkbox_cb_backtrace){
with($lzc$class_checkbox_cb_backtrace.prototype){
LzNode.mergeAttributes({},$lzc$class_checkbox_cb_backtrace.attributes)
}}})();ConstructorMap["checkbox_cb_backtrace"]=$lzc$class_checkbox_cb_backtrace;var cb_backtrace=null;$lzc$class_button_$dev$2Dconsole$2Elzx_165_66=Class.make("$lzc$class_button_$dev$2Dconsole$2Elzx_165_66",$lzc$class_button,["$lzc$handle_onclick$$dev$2Dconsole$2Elzx_165_66_$m332",function($1){
with(this){
canvas.gotoApp()
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","button_$dev$2Dconsole$2Elzx_165_66","children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);(function(){
with($lzc$class_button_$dev$2Dconsole$2Elzx_165_66){
with($lzc$class_button_$dev$2Dconsole$2Elzx_165_66.prototype){
LzNode.mergeAttributes({},$lzc$class_button_$dev$2Dconsole$2Elzx_165_66.attributes)
}}})();ConstructorMap["button_$dev$2Dconsole$2Elzx_165_66"]=$lzc$class_button_$dev$2Dconsole$2Elzx_165_66;$lzc$class_view_$dev$2Dconsole$2Elzx_148_50=Class.make("$lzc$class_view_$dev$2Dconsole$2Elzx_148_50",LzView,["$lzc$handle_onvalue_reference$$dev$2Dconsole$2Elzx_166_66_$m335",function(){
with(this){
return cb_backtrace
}},"$lzc$handle_onvalue$$dev$2Dconsole$2Elzx_166_66_$m335",function($1){
with(this){
if(cb_backtrace.value){
cb_debug.setAttribute("value",true)
}}},"$lzc$handle_onvalue_reference$$dev$2Dconsole$2Elzx_171_62_$m336",function(){
with(this){
return cb_debug
}},"$lzc$handle_onvalue$$dev$2Dconsole$2Elzx_171_62_$m336",function($1){
with(this){
if(cb_debug.value==false){
cb_backtrace.setAttribute("value",false)
}}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$dev$2Dconsole$2Elzx_148_50","children",LzNode.mergeChildren([{attrs:{$lzc$bind_id:function($1,$2){
if(arguments.length<2){
$2=true
};if($2){
$1.id="rg_runtime";rg_runtime=$1
}else{
if(rg_runtime===$1){
rg_runtime=null;$1.id=null
}}},id:"rg_runtime",layout:{axis:"x","class":"simplelayout",spacing:4},x:6,y:8.75},children:[{attrs:{$lzc$bind_id:function($1,$2){
if(arguments.length<2){
$2=true
};if($2){
$1.id="rb7";rb7=$1
}else{
if(rb7===$1){
rb7=null;$1.id=null
}}},id:"rb7",selected:new LzAlwaysExpr("$lzc$bind_selected$rb7_$m309","$lzc$dependencies_selected$rb7_$m309"),text:"swf7",value:"swf7"},name:"radiobutton_rb7"},{attrs:{$lzc$bind_id:function($1,$2){
if(arguments.length<2){
$2=true
};if($2){
$1.id="rb8";rb8=$1
}else{
if(rb8===$1){
rb8=null;$1.id=null
}}},id:"rb8",selected:new LzAlwaysExpr("$lzc$bind_selected$rb8_$m312","$lzc$dependencies_selected$rb8_$m312"),text:"swf8",value:"swf8"},name:"radiobutton_rb8"},{attrs:{$lzc$bind_id:function($1,$2){
if(arguments.length<2){
$2=true
};if($2){
$1.id="rb9";rb9=$1
}else{
if(rb9===$1){
rb9=null;$1.id=null
}}},id:"rb9",selected:new LzAlwaysExpr("$lzc$bind_selected$rb9_$m315","$lzc$dependencies_selected$rb9_$m315"),text:"swf9",value:"swf9"},name:"radiobutton_rb9"},{attrs:{$lzc$bind_id:function($1,$2){
if(arguments.length<2){
$2=true
};if($2){
$1.id="rbdhtml";rbdhtml=$1
}else{
if(rbdhtml===$1){
rbdhtml=null;$1.id=null
}}},id:"rbdhtml",selected:new LzAlwaysExpr("$lzc$bind_selected$rbdhtml_$m318","$lzc$dependencies_selected$rbdhtml_$m318"),text:"DHTML",value:"dhtml"},name:"radiobutton_rbdhtml"}],name:"radiogroup"},{attrs:{bgcolor:0,height:14,width:1,x:225,y:9.5},name:"view"},{attrs:{$lzc$bind_id:function($1,$2){
if(arguments.length<2){
$2=true
};if($2){
$1.id="cb_debug";cb_debug=$1
}else{
if(cb_debug===$1){
cb_debug=null;$1.id=null
}}},id:"cb_debug",text:"Debug",value:new LzAlwaysExpr("$lzc$bind_value$cb_debug_$m325","$lzc$dependencies_value$cb_debug_$m325"),x:236,y:8.25},name:"checkbox_cb_debug"},{attrs:{$lzc$bind_id:function($1,$2){
if(arguments.length<2){
$2=true
};if($2){
$1.id="cb_backtrace";cb_backtrace=$1
}else{
if(cb_backtrace===$1){
cb_backtrace=null;$1.id=null
}}},id:"cb_backtrace",text:"Backtrace",value:new LzAlwaysExpr("$lzc$bind_value$cb_backtrace_$m329","$lzc$dependencies_value$cb_backtrace_$m329"),x:305,y:8.25},name:"checkbox_cb_backtrace"},{attrs:{$delegates:["onclick","$lzc$handle_onclick$$dev$2Dconsole$2Elzx_165_66_$m332",null],clickable:true,text:"Compile",x:390,y:3},name:"button_$dev$2Dconsole$2Elzx_165_66"}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$dev$2Dconsole$2Elzx_148_50){
with($lzc$class_view_$dev$2Dconsole$2Elzx_148_50.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$dev$2Dconsole$2Elzx_148_50.attributes)
}}})();ConstructorMap["view_$dev$2Dconsole$2Elzx_148_50"]=$lzc$class_view_$dev$2Dconsole$2Elzx_148_50;$lzc$class_button_$dev$2Dconsole$2Elzx_178_65=Class.make("$lzc$class_button_$dev$2Dconsole$2Elzx_178_65",$lzc$class_button,["$lzc$handle_onclick$$dev$2Dconsole$2Elzx_178_65_$m339",function($1){
with(this){
canvas.viewSource()
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","button_$dev$2Dconsole$2Elzx_178_65","children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);(function(){
with($lzc$class_button_$dev$2Dconsole$2Elzx_178_65){
with($lzc$class_button_$dev$2Dconsole$2Elzx_178_65.prototype){
LzNode.mergeAttributes({},$lzc$class_button_$dev$2Dconsole$2Elzx_178_65.attributes)
}}})();ConstructorMap["button_$dev$2Dconsole$2Elzx_178_65"]=$lzc$class_button_$dev$2Dconsole$2Elzx_178_65;$lzc$class_view_$dev$2Dconsole$2Elzx_181_79=Class.make("$lzc$class_view_$dev$2Dconsole$2Elzx_181_79",LzView,["$lzc$bind_width$$dev$2Dconsole$2Elzx_181_79_$m343",function($1){
with(this){
this.setAttribute("width",canvas.width-70)
}},"$lzc$dependencies_width$$dev$2Dconsole$2Elzx_181_79_$m343",function(){
with(this){
return [canvas,"width"]
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$dev$2Dconsole$2Elzx_181_79","children",LzNode.mergeChildren([],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$dev$2Dconsole$2Elzx_181_79){
with($lzc$class_view_$dev$2Dconsole$2Elzx_181_79.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$dev$2Dconsole$2Elzx_181_79.attributes)
}}})();ConstructorMap["view_$dev$2Dconsole$2Elzx_181_79"]=$lzc$class_view_$dev$2Dconsole$2Elzx_181_79;$lzc$class_button_$dev$2Dconsole$2Elzx_185_57=Class.make("$lzc$class_button_$dev$2Dconsole$2Elzx_185_57",$lzc$class_button,["$lzc$handle_onclick$$dev$2Dconsole$2Elzx_185_57_$m352",function($1){
with(this){
canvas.viewWrapper()
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","button_$dev$2Dconsole$2Elzx_185_57","children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);(function(){
with($lzc$class_button_$dev$2Dconsole$2Elzx_185_57){
with($lzc$class_button_$dev$2Dconsole$2Elzx_185_57.prototype){
LzNode.mergeAttributes({},$lzc$class_button_$dev$2Dconsole$2Elzx_185_57.attributes)
}}})();ConstructorMap["button_$dev$2Dconsole$2Elzx_185_57"]=$lzc$class_button_$dev$2Dconsole$2Elzx_185_57;$lzc$class_button_$dev$2Dconsole$2Elzx_186_57=Class.make("$lzc$class_button_$dev$2Dconsole$2Elzx_186_57",$lzc$class_button,["$lzc$handle_onclick$$dev$2Dconsole$2Elzx_186_57_$m354",function($1){
with(this){
canvas.deploySOLO()
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","button_$dev$2Dconsole$2Elzx_186_57","children",LzNode.mergeChildren([],$lzc$class_button["children"]),"attributes",new LzInheritedHash($lzc$class_button.attributes)]);(function(){
with($lzc$class_button_$dev$2Dconsole$2Elzx_186_57){
with($lzc$class_button_$dev$2Dconsole$2Elzx_186_57.prototype){
LzNode.mergeAttributes({},$lzc$class_button_$dev$2Dconsole$2Elzx_186_57.attributes)
}}})();ConstructorMap["button_$dev$2Dconsole$2Elzx_186_57"]=$lzc$class_button_$dev$2Dconsole$2Elzx_186_57;$lzc$class_text_$dev$2Dconsole$2Elzx_189_47=Class.make("$lzc$class_text_$dev$2Dconsole$2Elzx_189_47",LzText,["$lzc$handle_onclick$$dev$2Dconsole$2Elzx_189_47_$m359",function($1){
with(this){
canvas.viewDocs()
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","text_$dev$2Dconsole$2Elzx_189_47","children",LzNode.mergeChildren([],LzText["children"]),"attributes",new LzInheritedHash(LzText.attributes)]);(function(){
with($lzc$class_text_$dev$2Dconsole$2Elzx_189_47){
with($lzc$class_text_$dev$2Dconsole$2Elzx_189_47.prototype){
LzNode.mergeAttributes({},$lzc$class_text_$dev$2Dconsole$2Elzx_189_47.attributes)
}}})();ConstructorMap["text_$dev$2Dconsole$2Elzx_189_47"]=$lzc$class_text_$dev$2Dconsole$2Elzx_189_47;$lzc$class_text_$dev$2Dconsole$2Elzx_190_53=Class.make("$lzc$class_text_$dev$2Dconsole$2Elzx_190_53",LzText,["$lzc$handle_onclick$$dev$2Dconsole$2Elzx_190_53_$m361",function($1){
with(this){
canvas.viewDev()
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","text_$dev$2Dconsole$2Elzx_190_53","children",LzNode.mergeChildren([],LzText["children"]),"attributes",new LzInheritedHash(LzText.attributes)]);(function(){
with($lzc$class_text_$dev$2Dconsole$2Elzx_190_53){
with($lzc$class_text_$dev$2Dconsole$2Elzx_190_53.prototype){
LzNode.mergeAttributes({},$lzc$class_text_$dev$2Dconsole$2Elzx_190_53.attributes)
}}})();ConstructorMap["text_$dev$2Dconsole$2Elzx_190_53"]=$lzc$class_text_$dev$2Dconsole$2Elzx_190_53;$lzc$class_text_$dev$2Dconsole$2Elzx_191_57=Class.make("$lzc$class_text_$dev$2Dconsole$2Elzx_191_57",LzText,["$lzc$handle_onclick$$dev$2Dconsole$2Elzx_191_57_$m363",function($1){
with(this){
canvas.viewForums()
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","text_$dev$2Dconsole$2Elzx_191_57","children",LzNode.mergeChildren([],LzText["children"]),"attributes",new LzInheritedHash(LzText.attributes)]);(function(){
with($lzc$class_text_$dev$2Dconsole$2Elzx_191_57){
with($lzc$class_text_$dev$2Dconsole$2Elzx_191_57.prototype){
LzNode.mergeAttributes({},$lzc$class_text_$dev$2Dconsole$2Elzx_191_57.attributes)
}}})();ConstructorMap["text_$dev$2Dconsole$2Elzx_191_57"]=$lzc$class_text_$dev$2Dconsole$2Elzx_191_57;$lzc$class_view_$dev$2Dconsole$2Elzx_183_55=Class.make("$lzc$class_view_$dev$2Dconsole$2Elzx_183_55",LzView,["$lzc$bind_width$$dev$2Dconsole$2Elzx_183_55_$m346",function($1){
with(this){
this.setAttribute("width",parent.firstrow.width)
}},"$lzc$dependencies_width$$dev$2Dconsole$2Elzx_183_55_$m346",function(){
with(this){
return [parent.firstrow,"width"]
}},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$dev$2Dconsole$2Elzx_183_55","children",LzNode.mergeChildren([{attrs:{fontsize:11,text:"<b>Deploy:</b>",x:8,y:4},name:"text"},{attrs:{$delegates:["onclick","$lzc$handle_onclick$$dev$2Dconsole$2Elzx_185_57_$m352",null],clickable:true,text:"Server",x:65},name:"button_$dev$2Dconsole$2Elzx_185_57"},{attrs:{$delegates:["onclick","$lzc$handle_onclick$$dev$2Dconsole$2Elzx_186_57_$m354",null],clickable:true,text:"SOLO",x:134},name:"button_$dev$2Dconsole$2Elzx_186_57"},{attrs:{align:"right",fgcolor:1381787,options:{ignorelayout:true},y:3},children:[{attrs:{$delegates:["onclick","$lzc$handle_onclick$$dev$2Dconsole$2Elzx_189_47_$m359",null],clickable:true,text:"<u>Documentation</u>"},name:"text_$dev$2Dconsole$2Elzx_189_47"},{attrs:{$delegates:["onclick","$lzc$handle_onclick$$dev$2Dconsole$2Elzx_190_53_$m361",null],clickable:true,text:"<u>Developer Network</u>",x:92},name:"text_$dev$2Dconsole$2Elzx_190_53"},{attrs:{$delegates:["onclick","$lzc$handle_onclick$$dev$2Dconsole$2Elzx_191_57_$m363",null],clickable:true,text:"<u>Developer Forums</u>",x:208},name:"text_$dev$2Dconsole$2Elzx_191_57"}],name:"view"}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$dev$2Dconsole$2Elzx_183_55){
with($lzc$class_view_$dev$2Dconsole$2Elzx_183_55.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$dev$2Dconsole$2Elzx_183_55.attributes)
}}})();ConstructorMap["view_$dev$2Dconsole$2Elzx_183_55"]=$lzc$class_view_$dev$2Dconsole$2Elzx_183_55;$lzc$class_checkbox_cb_remotedebug=Class.make("$lzc$class_checkbox_cb_remotedebug",$lzc$class_checkbox,["$lzc$bind_visible$cb_remotedebug_$m367",function($1){
with(this){
this.setAttribute("visible",app_runtime!="dhtml")
}},"$lzc$dependencies_visible$cb_remotedebug_$m367",function(){
return [this,"app_runtime"]
},"$lzc$bind_value$cb_remotedebug_$m368",function($1){
with(this){
this.setAttribute("value",app_console_debug)
}},"$lzc$dependencies_value$cb_remotedebug_$m368",function(){
return [this,"app_console_debug"]
},"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","checkbox_cb_remotedebug","children",LzNode.mergeChildren([],$lzc$class_checkbox["children"]),"attributes",new LzInheritedHash($lzc$class_checkbox.attributes)]);(function(){
with($lzc$class_checkbox_cb_remotedebug){
with($lzc$class_checkbox_cb_remotedebug.prototype){
LzNode.mergeAttributes({},$lzc$class_checkbox_cb_remotedebug.attributes)
}}})();ConstructorMap["checkbox_cb_remotedebug"]=$lzc$class_checkbox_cb_remotedebug;var cb_remotedebug=null;$lzc$class_view_$dev$2Dconsole$2Elzx_140_45=Class.make("$lzc$class_view_$dev$2Dconsole$2Elzx_140_45",LzView,["$lzc$bind_width$$dev$2Dconsole$2Elzx_140_45_$m280",function($1){
with(this){
this.setAttribute("width",parent.width)
}},"$lzc$dependencies_width$$dev$2Dconsole$2Elzx_140_45_$m280",function(){
with(this){
return [parent,"width"]
}},"logo",void 0,"controls",void 0,"$lzsc$initialize",function($1,$2,$3,$4){
if(arguments.length<1){
$1=null
};if(arguments.length<2){
$2=null
};if(arguments.length<3){
$3=null
};if(arguments.length<4){
$4=false
};(arguments.callee.superclass?arguments.callee.superclass.prototype["$lzsc$initialize"]:this.nextMethod(arguments.callee,"$lzsc$initialize")).call(this,$1,$2,$3,$4)
}],["tagname","view_$dev$2Dconsole$2Elzx_140_45","children",LzNode.mergeChildren([{attrs:{bgcolor:5000268,height:new LzAlwaysExpr("$lzc$bind_height$$dev$2Dconsole$2Elzx_141_109_$m284","$lzc$dependencies_height$$dev$2Dconsole$2Elzx_141_109_$m284"),name:"logo",resource:"footer_logo"},name:"view_$dev$2Dconsole$2Elzx_141_109"},{attrs:{firstrow:void 0,name:"controls",x:70},children:[{attrs:{compilecontrols:void 0,name:"firstrow",y:4},children:[{attrs:{fontsize:11,text:"<b>Compile Options:</b>",x:8,y:7},name:"text"},{attrs:{bgcolor:0,height:32,width:466,x:125},children:[{attrs:{bgcolor:9737389,height:30,width:464,x:1,y:1},name:"view"}],name:"view"},{attrs:{$delegates:["onvalue","$lzc$handle_onvalue$$dev$2Dconsole$2Elzx_166_66_$m335","$lzc$handle_onvalue_reference$$dev$2Dconsole$2Elzx_166_66_$m335","onvalue","$lzc$handle_onvalue$$dev$2Dconsole$2Elzx_171_62_$m336","$lzc$handle_onvalue_reference$$dev$2Dconsole$2Elzx_171_62_$m336"],name:"compilecontrols",x:125},name:"view_$dev$2Dconsole$2Elzx_148_50"},{attrs:{width:22,x:450},name:"view"},{attrs:{$delegates:["onclick","$lzc$handle_onclick$$dev$2Dconsole$2Elzx_178_65_$m339",null],clickable:true,text:"View Source",x:635,y:3},name:"button_$dev$2Dconsole$2Elzx_178_65"}],name:"view"},{attrs:{bgcolor:0,height:1,width:new LzAlwaysExpr("$lzc$bind_width$$dev$2Dconsole$2Elzx_181_79_$m343","$lzc$dependencies_width$$dev$2Dconsole$2Elzx_181_79_$m343"),y:39},name:"view_$dev$2Dconsole$2Elzx_181_79"},{attrs:{width:new LzAlwaysExpr("$lzc$bind_width$$dev$2Dconsole$2Elzx_183_55_$m346","$lzc$dependencies_width$$dev$2Dconsole$2Elzx_183_55_$m346"),y:43},name:"view_$dev$2Dconsole$2Elzx_183_55"},{attrs:{$lzc$bind_id:function($1,$2){
if(arguments.length<2){
$2=true
};if($2){
$1.id="cb_remotedebug";cb_remotedebug=$1
}else{
if(cb_remotedebug===$1){
cb_remotedebug=null;$1.id=null
}}},id:"cb_remotedebug",text:"Console Remote Debug",value:new LzAlwaysExpr("$lzc$bind_value$cb_remotedebug_$m368","$lzc$dependencies_value$cb_remotedebug_$m368"),visible:new LzAlwaysExpr("$lzc$bind_visible$cb_remotedebug_$m367","$lzc$dependencies_visible$cb_remotedebug_$m367"),x:740,y:10},name:"checkbox_cb_remotedebug"}],name:"view"}],LzView["children"]),"attributes",new LzInheritedHash(LzView.attributes)]);(function(){
with($lzc$class_view_$dev$2Dconsole$2Elzx_140_45){
with($lzc$class_view_$dev$2Dconsole$2Elzx_140_45.prototype){
LzNode.mergeAttributes({},$lzc$class_view_$dev$2Dconsole$2Elzx_140_45.attributes)
}}})();ConstructorMap["view_$dev$2Dconsole$2Elzx_140_45"]=$lzc$class_view_$dev$2Dconsole$2Elzx_140_45;var main=null;LzInstantiateView({attrs:{$lzc$bind_name:function($1,$2){
if(arguments.length<2){
$2=true
};if($2){
main=$1
}else{
if(main===$1){
main=null
}}},controls:void 0,logo:void 0,name:"main",width:new LzAlwaysExpr("$lzc$bind_width$$dev$2Dconsole$2Elzx_140_45_$m280","$lzc$dependencies_width$$dev$2Dconsole$2Elzx_140_45_$m280")},name:"view_$dev$2Dconsole$2Elzx_140_45"},83);LzInstantiateView({name:"script",attrs:{script:function(){
receivingLC=void 0;sendingLC=void 0;canvas.width=document.body.clientWidth
}}},1);canvas.initDone();
