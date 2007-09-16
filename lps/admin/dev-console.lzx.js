var $dhtml=true
var $as3=false
var $js1=true
var $swf9=false
var $swf7=false
var $profile=false
var $swf8=false
var $runtime="dhtml"
var $svg=false
var $as2=false
var $debug=false
var $j2me=false
var _Copyright="Portions of this file are copyright (c) 2001-2007 by Laszlo Systems, Inc.  All rights reserved."
Function.prototype.make=function(){
var $1
$1=function(){

}
if(arguments.length>0){
$1.prototype=this.prototype
var $2=new $1()
this.apply($2,arguments)
return $2
}else{
return new this()
}
}
Object.make=Object
Array.make=Array
Function.make=Function
String.make=function($1){
switch(arguments.length){
case 0:
$1=""

}
return new String($1)
}
Boolean.make=function($1){
return new Boolean($1)
}
Number.make=function($1){
switch(arguments.length){
case 0:
$1=+0

}
return new Number($1)
}
Date.make=function($1,$2,$3,$4,$5,$6,$7){
switch(arguments.length){
case 2:
$3=1
case 3:
$4=0
case 4:
$5=0
case 5:
$6=0
case 6:
$7=0

}
return new Date($1,$2,$3,$4,$5,$6,$7)
}
window._root=window
var $modules={}
$modules.runtime=this
$modules.lz=$modules.runtime
$modules.user=$modules.lz
var global=$modules.user
var Instance=function(){
this.constructor=arguments.callee
this.initialize.apply(this,arguments)
}
Instance.prototype.constructor=Instance
Instance.prototype.__initialized=false
Instance.classname="Instance"
Instance.prototype.classname="Object";(function(){
var $1=function($1,$2){
this[$1]=$2
if($2 instanceof Function){
var $3=this.constructor
if($2.hasOwnProperty("superclasses")){
var $4=$2.superclasses
var $5=false
for(var $6=$4.length-1;$6>=0;$6--){
if($4[$6]===$3){
$5=true
break
}
}
if(!$5){
$2.superclasses.push($3)
}
}else{
if($2.hasOwnProperty("superclass")&&$2.superclass!==$3){
var $7=$2.superclass
delete $2.superclass
$2.superclasses=[$7,$3]
}else{
$2.superclass=$3
}
}
}
}
$1.call(Instance.prototype,"addProperty",$1)
})()
Instance.prototype.addProperty("nextMethod",function($1,$2){
var $3
if($1.hasOwnProperty("superclass")){
$3=$1.superclass.prototype[$2]
}else{
var $4=$1.superclasses
for(var $5=$4.length-1;$5>=0;$5--){
if(this instanceof $4[$5]){
$3=$4[$5].prototype[$2]
break
}
}
}
return $3
})
Instance.prototype.addProperty("initialize",function(){

})
Instance.initialize=function($1){
$1.__initialized=false
}
Instance.make=function(){
var $1
$1=function(){
this.constructor=constructor
}
if(arguments.length>0){
var constructor=this
$1.prototype=constructor.prototype
var $2=new $1()
constructor.apply($2,arguments)
return $2
}
return new this()
}
var Class={prototype:new Instance(),addProperty:function($1,$2){
var $3=this.prototype
$3.addProperty.apply($3,arguments)
},addStaticProperty:function($1,$2){
this[$1]=$2
},_dbg_name:"Class",allClasses:{Instance:Instance},make:function($1,$2,$3,$4){
var nc=function(){
this.constructor=arguments.callee
if(this.initialize!==Instance.prototype.initialize){
this.initialize.apply(this,arguments)
}
}
nc.constructor=this
nc.classname=$1
this.addStaticProperty.call(nc,"addStaticProperty",this.addStaticProperty)
nc.addStaticProperty("addProperty",this.addProperty)
var superclass=null
if($2 instanceof Array){
for(var $5=$2.length-1;$5>=0;$5--){
var $6=$2[$5]
if($6 instanceof Function){
$2.splice($5,1)
superclass=$6
}
}
}else{
if($2 instanceof Function){
superclass=$2
$2=null
}else{

}
}
if(!superclass){
superclass=Instance
}
nc.addStaticProperty("make",superclass.make)
var $7=function(){
this.constructor=superclass
}
$7.prototype=superclass.prototype
var $8=new $7()
if($2 instanceof Array){
while($2.length){
var $9=$2.pop()
$8=$9.makeInterstitial($8,$2.length>0)
}
}
for(var $10 in $4){
nc.addStaticProperty($10,$4[$10])
}
nc.prototype=$8
for(var $11 in $3){
nc.addProperty($11,$3[$11])
};(function($1,$2){
if($2!==Instance){
arguments.callee($1,$2.prototype.constructor)
}
if($2.hasOwnProperty("initialize")){
$2.initialize.call(nc,$1)
}
})($8,nc)
this.allClasses[$1]=nc
return nc
}}
var Trait={prototype:new Instance(),allTraits:{},_dbg_typename:Class._dbg_name,_dbg_name:"Trait",addProperty:function($1,$2){
this.prototype[$1]=$2
var $3=this.implementations
for(var $4 in $3){
var $5=$3[$4]
$5.addProperty.apply($5,arguments)
}
},addStaticProperty:function($1,$2){
this[$1]=$2
},makeInterstitial:function($1,$2){
var $3=this.implementations
var $4=this.classname+"+"+$1.constructor.classname
if(false){
if($3.hasOwnProperty($4)){
return $3[$4]
}
}
var $5=this.prototype
for(var $6 in $5){
$1.addProperty.call($1,$6,$5[$6])
}
var $7=function(){
this.constructor=arguments.callee
}
$7.prototype=$1
if(this.hasOwnProperty("initialize")){
$7.initialize=this.initialize
}
$7.classname=$4
var $8=new $7()
$3[$4]=$8
return $8
},make:function($1,$2,$3,$4){
var $5={constructor:this,classname:$1,_dbg_typename:this._dbg_name,_dbg_name:$1,prototype:$2?$2.make():new Object(),implementations:{}}
this.addStaticProperty.call($5,"addStaticProperty",this.addStaticProperty)
$5.addStaticProperty("addProperty",this.addProperty)
$5.addStaticProperty("makeInterstitial",this.makeInterstitial)
for(var $6 in $4){
$5.addStaticProperty($6,$4[$6])
}
for(var $6 in $3){
$5.addProperty($6,$3[$6])
}
if($5.hasOwnProperty("initialize")){
$5.initialize($5.prototype)
}
this.allTraits[$1]=$5
return $5
}}
var LzMessage=Class.make("LzMessage",null,{message:"",appendInternal:function($1,$2){
this.message+=$1
},append:function($1){
var $2=arguments.length
for(var $3=0;$3<$2;$3++){
this.appendInternal(String(arguments[$3]))
}
},toString:function(){
return this.message
},toHTML:function(){
return this.toString()
}},{initialize:function($1){
this.message=$1
}})
var LzFormatter=Trait.make("LzFormatter",null,{pad:function($1,$2,$3,$4,$5,$6,$7){
switch(arguments.length){
case 0:
$1=""
case 1:
$2=null
case 2:
$3=null
case 3:
$4=" "
case 4:
$5="-"
case 5:
$6=10
case 6:
$7=false

}
var $8=typeof $1=="number"
if($8){
if($3!=null){
var $9=Math.pow(10,-$3)
$1=Math.round($1/$9)*$9
}
$1=Number($1).toString($6)
if($5!="-"){
if($1.indexOf("-")!=0){
if($1!=0){
$1=$5+$1
}else{
$1=" "+$1
}
}
}
}else{
$1=""+$1
}
var $10=$1.length
if($3!=null){
if($8){
var $11=$1.lastIndexOf(".")
if($11==-1){
var $12=0
if($7||$3>0){
$1+="."
}
}else{
var $12=$10-($11+1)
}
for(var $13=$12;$13<$3;$13++){
$1+="0"
}
}else{
$1=$1.substring(0,$3)
}
}
$10=$1.length
if(!$2){
$2=0
}
var $14=false
if($2<0){
$2=-$2
$14=true
}
if($10>=$2){
return $1
}
if($14){
for(var $13=$10;$13<$2;$13++){
$1=$1+" "
}
}else{
$5=null
if($4!=" "){
if(" +-".indexOf($1.substring(0,1))>=0){
$5=$1.substring(0,1)
$1=$1.substring(1)
}
}
for(var $13=$10;$13<$2;$13++){
$1=$4+$1
}
if($5!=null){
$1=$5+$1
}
}
return $1
},formatToString:function(control,$1){
var $8
$8=function($1){
if($1>=al){
return null
}
return arglist[$1]
}
var al=arguments.length
if(!(typeof control=="string"||control instanceof String)||al>1!=control.indexOf("%")>=0){
var $2=new LzMessage()
for(var $3=0;$3<al;$3++){
var $4=arguments[$3]
var $5=$3==al-1?"\n":" "
$2.append($4)
$2.appendInternal($5)
}
return $2
}
if(al<1){
control=""
}
var $6=""+control
var $7=1
var arglist=arguments
var $9=0
var $10=$6.length
var $11=0
var $12=0
var $2=new LzMessage()
while($11<$10){
$12=$6.indexOf("%")
if($12==-1){
$2.append($6.substring($11,$10))
break
}
$2.append($6.substring($11,$12))
$9=$12
$11=$12+1
$12=$12+2
var $13="-"
var $14=" "
var $15=false
var $16=""
var $17=null
var $18=null
while($11<$10&&$18==null){
var $19=$6.substring($11,$12)
$11=$12++
switch($19){
case "-":
$16=$19
break
case "+":
case " ":
$13=$19
break
case "#":
$15=true
break
case "0":
if($16===""&&$17===null){
$14=$19
break
}
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
$17+=$19
}else{
$16+=$19
}
break
case "$":
$7=$16
$16=""
break
case "*":
if($17!==null){
$17=$8($7)
$7++
}else{
$16=$8($7)
$7++
}
break
case ".":
$17=""
break
case "h":
case "l":
break
default:
$18=$19
break

}
}
var $20=$8($7)
var $21=null
var $22=false
if($17!==null){
$21=1*$17
}else{
switch($18){
case "F":
case "E":
case "G":
case "f":
case "e":
case "g":
$21=6
$22=$15
break
case "O":
case "o":
if($15&&$20!=0){
$2.append("0")
}
break
case "X":
case "x":
if($15&&$20!=0){
$2.append("0"+$18)
}
break

}
}
var $23=10
switch($18){
case "o":
case "O":
$23=8
break
case "x":
case "X":
$23=16
break

}
switch($18){
case "U":
case "O":
case "X":
case "u":
case "o":
case "x":
if($20<0){
$20=-$20
var $24=Math.abs(parseInt($16))
if(isNaN($24)){
$24=Number($20).toString($23).length
}
var $25=Math.pow($23,$24)
$20=$25-$20
}

}
switch($18){
case "D":
case "U":
case "I":
case "O":
case "X":
case "F":
case "E":
case "G":
$20=Number($20)
$2.append(this.pad($20,$16,$21,$14,$13,$23,$22).toUpperCase())
$7++
break
case "c":
$20=String.fromCharCode($20)
case "w":

case "s":
var $27
if($20 instanceof Function){
if(!$27){
$27="function () {...}"
}
}else{
if(typeof $20=="number"){
$27=Number($20).toString($23)
}else{
$27=""+$20
}
}
$2.appendInternal(this.pad($27,$16,$21,$14,$13,$23,$22),$20)
$7++
break
case "d":
case "u":
case "i":
case "o":
case "x":
case "f":
case "e":
case "g":
$20=Number($20)
$2.append(this.pad($20,$16,$21,$14,$13,$23,$22))
$7++
break
case "%":
$2.append("%")
break
default:
$2.append($6.substring($9,$11))
break

}
$6=$6.substring($11,$10)
$9=0,$10=$6.length
$11=0,$12=0
}
if($7<al){
$2.appendInternal(" ")
for(;$7<al;$7++){
var $4=$8($7)
var $5=$7==al-1?"\n":" "
$2.append($4)
$2.appendInternal($5)
}
}
return $2
}},null)
Debug={}
Debug.write=function($1){

}
Debug.trace=function($1){

}
Debug.monitor=function($1){

}
Debug.warn=function($1){

}
Debug.error=function($1){

}
Debug.info=function($1){

}
Debug.debug=function($1){

}
var black=0
var green=32768
var silver=12632256
var lime=65280
var gray=8421504
var olive=8421376
var white=16777215
var yellow=16776960
var maroon=8388608
var navy=128
var red=16711680
var blue=255
var purple=8388736
var teal=32896
var fuchsia=16711935
var aqua=65535
var LzDeclaredEvent={}
LzDeclaredEvent.sendEvent=function(){

}
LzDeclaredEvent.clearDelegates=function(){

}
LzDeclaredEvent.removeDelegate=function(){

}
LzDeclaredEvent.getDelegateCount=function(){
return 0
}
LzDeclaredEvent.toString=function(){
return "LzDeclaredEvent"
}
LzDeclaredEvent.ready=false
function DeclareEvent($1,$2){
$1[$2]=LzDeclaredEvent
}
function DeclareEvents($1,$2){
for(var $3 in $2){
$1[$2[$3]]=LzDeclaredEvent
}
}
function LzInheritedHash($1){
var $2
$2=function(){

}
if($1){
$2.prototype=$1
return new $2()
}
}
var ConstructorMap={}
var lz=ConstructorMap
var LzNode=Class.make("LzNode",null,{initialize:function($1,$2,$3,$4){
this.__LZUID="__U"+ ++LzNode.__UIDs
this.__LZdeferDelegates=true
var $5=LzDelegate.__LZdelegatesQueue.length;(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
var $7
if($2&&$2["$hasdefaultattrs"]){
$7=$2
}else{
$7=new LzInheritedHash(this.defaultattrs)
if($2){
var $8=this.defaultattrs
var $9="$refs" in $8&&$8.$refs
var $10=null
for(var $11 in $2){
var $12=$2[$11]
if($9&&$9[$11]){
if(!$10){
$10={}
}
$10[$11]=true
}
if($12 instanceof Object){
var $13=$8[$11]
if($13 instanceof Object){
if($12 instanceof Array){
$7[$11]=$12.concat($13)
continue
}else{
if(typeof $12=="object"){
var $14=new LzInheritedHash($13)
for(var $15 in $12){
$14[$15]=$12[$15]
}
$7[$11]=$14
continue
}
}
}
}
$7[$11]=$12
}
if($10){
if(!$7.hasOwnProperty("$refs")){
$7.$refs=new LzInheritedHash($9)
}
var $16=LzNode._ignoreAttribute
for(var $11 in $10){
$7.$refs[$11]=$16
}
}
}
}
this._instanceAttrs=$7
this._instanceChildren=$3
var $17=new LzInheritedHash($7)
this.__LZisnew=!$4
var $18="classChildren" in this.constructor.prototype?this.constructor.prototype.classChildren:null
if($18&&$18.length){
if(!("doneClassRoot" in $18&&$18.doneClassRoot)&&!this.$isstate){
$18.doneClassRoot=true
this.__LZassignClassRoot($18,1)
}
if($3&&$3.length){
$3=$18.concat($3)
}else{
$3=$18
}
}else{
if($3&&$3.length){
$3=$3.concat()
}
}
this.construct($1,$17)
this.__LZapplyArgs($17,true)
if(this.__LZdeleted){
return
}
var $19=this.$styles()
if($19){
this.__LZstyleConstraints=this.__LZapplyStyleMap($19,$2)
}
if(this.constructWithArgs){
this.constructWithArgs($17)
}
delete this.__LZdeferDelegates
if($5!=LzDelegate.__LZdelegatesQueue.length){
LzDelegate.__LZdrainDelegatesQueue($5)
}
if(this.onconstruct.ready){
this.onconstruct.sendEvent(this)
}
if($3&&$3.length){
this.createChildren($3)
}else{
this.__LZinstantiationDone()
}
},__LZlateinit:null,__LZpreventSubInit:null,__LZresolveDict:null,__LZsourceLocation:null,__LZUID:null,__LZdelegates:null,defaultattrs:{$hasdefaultattrs:true},isinited:false,subnodes:null,datapath:null,initstage:null,$isstate:false,doneClassRoot:false,parent:null,children:null,cloneManager:null,name:null,id:null,defaultplacement:null,placement:null,$cfn:0,__LZdeleted:false,immediateparent:null,dependencies:null,classroot:null,nodeLevel:null,$styles:function(){
return null
},__LZapplyStyleMap:function($1,$2){
var $3={}
for(var $4 in $1){
if($2[$4]!=null){
continue
}
var $5=LzCSSStyle.getPropertyValueFor(this,$1[$4])
if(typeof $5=="string"&&!isNaN($5)){
$5=Number($5)
}
if(!($4 in $2)){
if($5 instanceof Function){
if(this[$4]==null){
$3[$4]=$5
}
}else{
if($5!=null){
if(!this.__LZdeleted){
var $lzsc$1190165364=this.setters
if($lzsc$1190165364&&$4 in $lzsc$1190165364){
this[$lzsc$1190165364[$4]]($5)
}else{
this[$4]=$5
var $lzsc$263972551="on"+$4
if($lzsc$263972551 in this){
if(this[$lzsc$263972551].ready){
this[$lzsc$263972551].sendEvent($5)
}
}
}
}
}
}
}
}
return $3
},__LZapplyStyleConstraints:function(){
var $1=this.__LZstyleConstraints
for(var $2 in $1){
var $3=$1[$2]
var $4=$3.call(this)
if(!this.__LZdeleted){
var $lzsc$469215421=this.setters
if($lzsc$469215421&&$2 in $lzsc$469215421){
this[$lzsc$469215421[$2]]($4)
}else{
this[$2]=$4
var $lzsc$1902115310="on"+$2
if($lzsc$1902115310 in this){
if(this[$lzsc$1902115310].ready){
this[$lzsc$1902115310].sendEvent($4)
}
}
}
}
}
},construct:function($1,$2){
var $3=$1
this.parent=$3
if($3){
var $4=$3
var $5=$2
if(!("ignoreplacement" in $5)){
var $6="placement" in $5?$5.placement:null
if($6==null){
$6=$3.defaultplacement
}else{
this.placement=$6
}
while($6!=null){
if($4.determinePlacement==LzNode.prototype.determinePlacement){
var $7=$4.searchSubnodes("name",$6)
if($7==null){
$7=$4
}
}else{
var $7=$4.determinePlacement(this,$6,$2)
}
$6=$7!=$4?$7.defaultplacement:null
$4=$7
}
}
var $8=$4.subnodes
if($8==null){
$8=new Array()
$4.subnodes=$8
}
$8[$8.length]=this
var $9=$4.nodeLevel
this.nodeLevel=$9?$9+1:1
this.immediateparent=$4
}else{
this.nodeLevel=1
}
},init:function(){
return
},__LZinstantiationDone:function(){
if(!this.immediateparent||this.immediateparent.isinited||this.initstage=="early"||this.__LZisnew&&LzInstantiator.syncNew){
this.__LZcallInit()
}
},__LZsetPreventInit:function(){
this.__LZpreventSubInit=[]
},__LZclearPreventInit:function(){
var $1=this.__LZpreventSubInit
delete this.__LZpreventSubInit
var $2=$1.length
for(var $3=0;$3<$2;$3++){
$1[$3].__LZcallInit()
}
},__LZcallInit:function(){
if(this.parent&&this.parent.__LZpreventSubInit){
this.parent.__LZpreventSubInit.push(this)
return
}
this.isinited=true
this.__LZresolveReferences()
if(this.__LZstyleConstraints){
this.__LZapplyStyleConstraints()
}
var $1=this.subnodes
if($1){
var $2=0
var $3=$1.length
while($2<$3){
var $4=$1[$2++]
var $5=$1[$2]
if($4.isinited||$4.__LZlateinit){
continue
}
$4.__LZcallInit()
if($5!=$1[$2]){
while($2>0){
if($5==$1[--$2]){
break
}
}
}
}
}
this.init()
if(this.oninit.ready){
this.oninit.sendEvent(this)
}
if(this.datapath&&this.datapath.__LZApplyDataOnInit){
this.datapath.__LZApplyDataOnInit()
}
},completeInstantiation:function(){
if(!this.isinited){
var $1=this.initstage
this.initstage="early"
if($1=="defer"){
LzInstantiator.createImmediate(this,this.__LZdeferredcarr)
}else{
LzInstantiator.completeTrickle(this)
}
}
},__LZapplyArgs:function($1,$2){
var $3={}
var $4=[]
var $5=null
if("$setters" in $1&&$1.$setters){
this.__LZsetSetters($1.$setters)
}
var $6=this.setters
for(var $7 in $1){
if($3[$7]||$1[$7]===LzNode._ignoreAttribute){
continue
}
$3[$7]=true
if($6&&$6[$7]==null){
this.addProperty($7,$1[$7])
if(!$2){
var $8="on"+$7
if($8 in this){
if(this[$8].ready){
this[$8].sendEvent($1[$7])
}
}
}
}else{
if($6&&$6[$7]!=-1){
if(this.earlySetters&&this.earlySetters[$7]){
if($5==null){
$5=[]
}
$5[this.earlySetters[$7]]=$7
}else{
$4.push($7)
}
}
}
}
if($5){
for(var $9=1;$9<$5.length;$9++){
var $7=$5[$9]
if(this[$6[$7]]){
this[$6[$7]]($1[$7],$7)
}
}
}
while($4.length){
var $7=$4.pop()
this[$6[$7]]($1[$7],$7)
}
},createChildren:function($1){
if(this.__LZdeleted){
return
}
if("defer"==this.initstage){
this.__LZlateinit=true
this.__LZdeferredcarr=$1
}else{
if("late"==this.initstage){
this.__LZlateinit=true
LzInstantiator.trickleInstantiate(this,$1)
}else{
if(this.__LZisnew&&LzInstantiator.syncNew||"immediate"==this.initstage){
LzInstantiator.createImmediate(this,$1)
}else{
LzInstantiator.requestInstantiation(this,$1)
}
}
}
},getAttribute:function($1){
if(null==this.getters[$1]){
return this[$1]
}else{
return this[this.getters[$1]]()
}
},setAttribute:function($1,$2,$3){
if(this.__LZdeleted||$3&&this[$1]==$2){
return
}
var $4=this.setters
if($4&&$1 in $4){
this[$4[$1]]($2)
}else{
if($4==null){

}
this[$1]=$2
var $5="on"+$1
if($5 in this){
if(this[$5].ready){
this[$5].sendEvent($2)
}
}
}
},setProp:function($1,$2){
if(!this.__LZdeleted){
var $lzsc$1572297463=this.setters
if($lzsc$1572297463&&$1 in $lzsc$1572297463){
this[$lzsc$1572297463[$1]]($2)
}else{
this[$1]=$2
var $lzsc$289782460="on"+$1
if($lzsc$289782460 in this){
if(this[$lzsc$289782460].ready){
this[$lzsc$289782460].sendEvent($2)
}
}
}
}
},getExpectedAttribute:function($1){
var $2="e_"+$1
if(!this[$2]){
this[$2]={}
}
if(this[$2].v==null){
return this[$1]
}
return this[$2].v
},setExpectedAttribute:function($1,$2){
var $3="e_"+$1
if(!this[$3]){
this[$3]={}
}
this[$3].v=$2
},addToExpectedAttribute:function($1,$2){
var $3="e_"+$1
if(!this[$3]){
this[$3]={}
}
if(this[$3].v==null){
this[$3].v=this[$1]
}
this[$3].v+=$2
},__LZincrementCounter:function($1){
var $2="e_"+$1
var $3=this[$2]
if(!$3){
$3=this[$2]={}
}
if(!$3.c){
$3.c=0
}
$3.c+=1
},makeChild:function($1,$2){
if(this.__LZdeleted){
return
}
var $4=ConstructorMap[$1.name]
var $5
if($4){
$5=new $4(this,$1.attrs,"children" in $1?$1.children:null,$2)
}
return $5
},setters:{name:"setName",id:"setID",$events:"__LZsetEvents",$refs:"__LZstoreRefs",$delegates:"__LZstoreDelegates",options:"__LZsetOptions",placement:-1,datapath:"setDatapath",$setters:-1,$classrootdepth:"__LZsetClassRoot",$datapath:"__LZmakeDatapath"},__LZsetClassRoot:function($1){
if(!$1){
return
}
var $2=this.parent
while(--$1>0){
$2=$2.parent
}
this.classroot=$2
},__LZsetSetters:function($1){
for(var $2 in $1){
var $3="_anonSet"+$2
this.__LZaddSetter($2,$3)
this[$3]=$1[$2]
}
},__LZaddSetter:function($1,$2){
if(!this.hasOwnProperty("setters")){
this.setters=new LzInheritedHash(this.setters)
}
if("put" in this.setters){
this.setters.put($1,$2)
}else{
this.setters[$1]=$2
}
},dataBindAttribute:function($1,$2){
if(!this.datapath){
this.setDatapath(".")
}
if(!this.__LZdelegates){
this.__LZdelegates=[]
}
this.__LZdelegates.push(new LzDataAttrBind(this.datapath,$1,$2))
},__LZdelayedSetters:{$refs:"__LZresolveRefs"},earlySetters:{name:1,id:2,$events:3,$delegates:4,$classrootdepth:5,$datapath:6},getters:{},__LZstoreDelegates:function($1){
var $2=[]
var $3=$1.length
for(var $4=0;$4<$3;$4+=3){
if($1[$4+2]){
$2.push($1[$4],$1[$4+1],$1[$4+2])
}else{
var $5=$1[$4+1]
if(!this.__LZdelegates){
this.__LZdelegates=[]
}
this.__LZdelegates.push(new LzDelegate(this,$5,this,$1[$4]))
}
}
if($2.length){
this.__LZstoreAttr($2,"$delegates")
}
},__LZstoreRefs:function($1,$2){
for(var $3 in $1){
if(!($3 in this)){
this[$3]=null
}
}
this.__LZstoreAttr($1,$2)
},__LZstoreAttr:function($1,$2){
if(this.__LZresolveDict==null){
this.__LZresolveDict={}
}
this.__LZresolveDict[$2]=$1
},__LZresolveReferences:function(){
var $1=this.__LZresolveDict
this.__LZresolveDict=null
for(var $2 in $1){
if($2=="$delegates"){
continue
}
this[this.__LZdelayedSetters[$2]]($1[$2])
}
if($1&&$1.$delegates){
this.__LZsetDelegates($1.$delegates)
}
},__LZevalPathExpr:function($1){
with(global){
with(this){
return eval($1)
}
}
},__LZresolveRefs:function($1){
for(var $2 in $1){
var $3=$1[$2]
var $4
if("string"==typeof $3){
$3=LzParsedPath.trim($3)
var $5=$3.charAt(0)
if($5=="'"||$5=='"'){
$4=$3.substring(1,$3.length-1)
}else{
$4=this.__LZevalPathExpr($3)
}
this.dataBindAttribute($2,$4)
}else{
if(!("dependencies" in $3&&$3.dependencies)){
if($3 instanceof Function){
$3.call(this)
}
}
}
}
for(var $2 in $1){
var $3=$1[$2]
if($3 instanceof Function&&"dependencies" in $3){
this.applyConstraint($2,$3,$3.dependencies.call(this))
}
}
},__LZsetDelegates:function($1){
if($1.length&&!this.__LZdelegates){
this.__LZdelegates=[]
}
var $2=$1.length
for(var $3=0;$3<$2;$3+=3){
var $4=$1[$3+2]
var $5=$4!=null?$4.call(this):null
if($5==null){
$5=this
}
var $6=$1[$3+1]
this.__LZdelegates.push(new LzDelegate(this,$6,$5,$1[$3]))
}
},applyConstraint:function($1,$2,$3){
var $4=$3.length
if($4){
if(!this.__LZdelegates){
this.__LZdelegates=[]
}
var $5="$cf"+this.$cfn++
this[$5]=$2
var $6
for(var $7=0;$7<$4;$7+=2){
var $8=new LzDelegate(this,$5)
this.__LZdelegates.push($8)
$6=$3[$7]
if($6){
$8.register($6,"on"+$3[$7+1])
}
}
}
$2.call(this)
},releaseConstraint:function($1){
var $2="_SetCons"+$1
if($2 in this){
this[$2].delegate.unregisterAll()
}
},setName:function($1){
if(typeof $1=="string"&&$1.length){
if(this.parent){
this.parent[$1]=this
}
if(this.immediateparent){
this.immediateparent[$1]=this
}
this.name=$1
if(this.parent===canvas){
if(!this.hasOwnProperty("id")){
this.id=$1
}
global[$1]=this
}
}else{

}
},defaultSet:function($1,$2){
if($1!=null){
this[$2]=$1
}
},setID:function($1){
if(typeof $1=="string"&&$1.length){
this.id=$1
global[$1]=this
}else{

}
},setDatapath:function($1){
if(null!=this.datapath&&$1!=LzNode._ignoreAttribute){
this.datapath.setXPath($1)
}else{
new LzDatapath(this,{xpath:$1})
}
},setData:function($1){
this.data=$1
var $2=this.datapath!=null?this.datapath:new LzDatapath(this)
$2.setPointer($1)
if(this.ondata.ready){
this.ondata.sendEvent($1)
}
},__LZsetEvents:function($1){
var $2=$1.length
for(var $3=0;$3<$2;$3++){
var $4=$1[$3]
this[$4]=LzDeclaredEvent
}
},__LZsetDefaultHandler:function($1,$2){
var $3="_handle"+$1
this[$3]=$2
var $4=new LzDelegate(this,$3,this,$1)
if(!this.__LZhandlers){
this.__LZhandlers=[$4]
}else{
this.__LZhandlers.push($4)
}
},options:{},__LZsetOptions:function($1){
if(!this.hasOwnProperty("options")){
this.options=new LzInheritedHash(this.options)
}
for(var $2 in $1){
this.options[$2]=$1[$2]
}
},getOption:function($1){
return this.options[$1]
},setOption:function($1,$2){
if(!this.hasOwnProperty("options")){
this.options=new LzInheritedHash(this.options)
}
this.options[$1]=$2
},determinePlacement:function($1,$2,$3){
if($2==null){
var $4=null
}else{
var $4=this.searchSubnodes("name",$2)
}
return $4==null?this:$4
},searchImmediateSubnodes:function($1,$2){
var $3=this.subnodes
if($3==null){
return null
}
for(var $4=$3.length-1;$4>=0;$4--){
var $5=$3[$4]
if($5[$1]==$2){
return $5
}
}
return null
},searchSubnodes:function($1,$2){
var $3=this.subnodes?this.subnodes.concat():[]
while($3.length>0){
var $4=$3
$3=new Array()
for(var $5=$4.length-1;$5>=0;$5--){
var $6=$4[$5]
if($6[$1]==$2){
return $6
}
var $7=$6.subnodes
if($7){
for(var $8=$7.length-1;$8>=0;$8--){
$3.push($7[$8])
}
}
}
}
return null
},searchParents:function($1){
var $2=this
do{
$2=$2.immediateparent
if($2[$1]!=null){
return $2
}
}while($2!=canvas)
},getUID:function(){
return this.__LZUID
},childOf:function($1){
if($1==null){
return false
}
var $2=this
while($2.nodeLevel>=$1.nodeLevel){
if($2==$1){
return true
}
$2=$2.immediateparent
}
return false
},destroy:function($1){
if(this.__LZdeleted==true){
return
}
this.__LZdeleted=true
if(this.ondestroy.ready){
this.ondestroy.sendEvent(this)
}
this.__LZinstantiationDone=null
this.setters=null
if(this.subnodes!=null){
for(var $2=this.subnodes.length-1;$2>=0;$2--){
this.subnodes[$2].destroy(true)
}
}
if(this.name!=null){
if(this.parent[this.name]==this){
delete this.parent[this.name]
}
if(this.immediateparent[this.name]==this){
delete this.immediateparent[this.name]
}
if(this.parent===canvas&&global[this.name]===this){
try{
delete global[this.name]
}
catch(e){
global[this.name]=void 0
}
}
}
if(this.id!=null){
if(global[this.id]===this){
try{
delete global[this.id]
}
catch(e){
global[this.id]=void 0
}
}
}
if(this.__LZdelegates!=null){
for(var $2=this.__LZdelegates.length-1;$2>=0;$2--){
this.__LZdelegates[$2].unregisterAll()
}
}
delete this.__LZdelegates
if("_events" in this&&this._events!=null){
for(var $2=this._events.length-1;$2>=0;$2--){
this._events[$2].clearDelegates()
}
}
delete this._events
if(this.immediateparent&&this.immediateparent.subnodes){
for(var $2=this.immediateparent.subnodes.length-1;$2>=0;$2--){
if(this.immediateparent.subnodes[$2]==this){
this.immediateparent.subnodes.splice($2,1)
break
}
}
}
delete this.data
},deleteNode:function($1){
this.destroy($1)
},animate:function($1,$2,$3,$4,$5){
if($3==0){
var $6=$4?this[$1]+$2:$2
if(!this.__LZdeleted){
var $lzsc$1732853902=this.setters
if($lzsc$1732853902&&$1 in $lzsc$1732853902){
this[$lzsc$1732853902[$1]]($6)
}else{
this[$1]=$6
var $lzsc$1400830395="on"+$1
if($lzsc$1400830395 in this){
if(this[$lzsc$1400830395].ready){
this[$lzsc$1400830395].sendEvent($6)
}
}
}
}
return null
}
var $7={attribute:$1,to:$2,duration:$3,start:true,relative:$4,target:this}
for(var $8 in $5){
$7[$8]=$5[$8]
}
var $9=new LzAnimator(null,$7)
return $9
},toString:function(){
return this.constructor.classname+" "+this.getDebugIdentification()
},_dbg_name:function(){
if(typeof this.id=="string"&&global[this.id]===this){
return "#"+this.id
}else{
if(typeof this.name=="string"&&this.parent[this.name]===this){
return "."+this.name
}else{
if(this.toString!==LzNode.prototype.toString){
return String(this)
}else{
return ""
}
}
}
},getDebugIdentification:function(){
var $1=""
if(this.name!=null){
$1+=" name: "+this.name+" "
}
if(this.id!=null){
$1+=" id: "+this.id+" "
}
return $1
},__LZassignClassRoot:function($1,$2){
if($1!=null){
var $3=$1.length
for(var $4=0;$4<$3;$4++){
$1[$4].attrs.$classrootdepth=$2
var $5="children" in $1[$4]?$1[$4].children:null
if($5&&"length" in $5){
var $6=ConstructorMap[$1[$4].name]
this.__LZassignClassRoot($5,"$isstate" in $6.prototype&&$6.prototype.$isstate?$2:$2+1)
}
}
}
},__LZmakeDatapath:function($1){
if(!($1 instanceof Object)){

}
this.makeChild($1,true)
}},{tagname:"node",initialize:function($1){
if(this.hasOwnProperty("tagname")){
var $2=this.tagname
if($2){
if(ConstructorMap[$2]!==this){
ConstructorMap[$2]=this
}
}
}
for(var $3 in {setters:true,getters:true,defaultattrs:true,options:true,__LZdelayedSetters:true,earlySetters:true}){
if(!$1.hasOwnProperty($3)){
$1[$3]=new LzInheritedHash($1[$3])
}
}
},_ignoreAttribute:{toString:function(){
return "_ignoreAttribute"
}},__UIDs:0});(function(){
with(LzNode){
with(LzNode.prototype){
DeclareEvent(prototype,"oninit")
DeclareEvent(prototype,"onconstruct")
DeclareEvent(prototype,"ondata")
DeclareEvent(prototype,"onclonenumber")
DeclareEvent(prototype,"ondestroy")
prototype.getProp=getAttribute
prototype._setProp=setProp
}
}
})()
var LzUserClass=Class.make("LzUserClass",LzNode,{initialize:function($1,$2){
var $3=$2.initobj
var $4=$3.name
var $5=$3.attrs
var $6=$2.parent
var $7
if($6==null){
$7=LzView
}else{
$7=ConstructorMap[$6]
}
var $8=null
if("with" in $5){
$8=$5["with"].split(" ").join("").split(",")
for(var $9=$8.length-1;$9>=0;$9--){
var $10=$8[$9]
$8[$9]=global[$10]
if($8[$9]==null||$8[$9].makeInterstitial==null){
$8.splice($9,1)
}
}
$8.push($7)
}
var $11=this.userclass=Class.make($4,$8?$8:$7,null,{tagname:$4})
if(!($4 in global)){
global[$4]=$11
}else{

}
var $12=$11.prototype
delete $5.name
var $13
if("classChildren" in $7.prototype&&$7.prototype.classChildren.length){
$13=$7.prototype.classChildren.concat()
}else{
$13=[]
}
if("children" in $3&&$3.children.length){
$13=$13.concat($3.children)
}
if("defaultplacement" in $5&&$5.defaultplacement!=null){
$13.push({name:"__LZUserClassPlacementObject",attrs:$5.defaultplacement})
delete $5.defaultplacement
}
if($13.length){
$12.addProperty("classChildren",$13)
}
var $14=false
if("$events" in $5){
var $15=$5.$events
var $4=$12.classname
var $16=$15.length
for(var $17=0;$17<$16;$17++){
var $18=$15[$17]
$12.addProperty($18,LzDeclaredEvent)
}
delete $5.$events
}
var $19="$setters" in $5?$5.$setters:null
if($19){
delete $5.$setters
for(var $20 in $19){
var $21="_anonSet"+$20
$12.addProperty($21,$19[$20])
$12.setters[$20]=$21
}
}
var $22=$12.defaultattrs
if($5){
var $23="$refs" in $22&&$22.$refs
var $24=null
var $25=$12.setters
var $26="$isstate" in $12&&$12.$isstate
for(var $17 in $5){
var $27=$5[$17]
if($23&&$23[$17]){
if(!$24){
$24={}
}
$24[$17]=true
}
if($25[$17]==null&&!$26){
if($27 instanceof Object&&!($27 instanceof Function)){

}
$12.addProperty($17,$27)
continue
}
if($27 instanceof Object){
var $28=$22[$17]
if($28 instanceof Object){
if($27 instanceof Array){
$22[$17]=$27.concat($28)
continue
}else{
if(typeof $27=="object"){
var $29=new LzInheritedHash($28)
for(var $30 in $27){
$29[$30]=$27[$30]
}
$22[$17]=$29
continue
}
}
}
}
$22[$17]=$27
}
if($24){
if(!$22.hasOwnProperty("$refs")){
$22.$refs=new LzInheritedHash($23)
}
var $31=LzNode._ignoreAttribute
for(var $17 in $24){
$22.$refs[$17]=$31
}
}
}
}},{tagname:"class"})
ConstructorMap.__LZUserClassPlacementObject=function($1,$2){
$1.defaultplacement=$2
}
var LzDelegate=Class.make("LzDelegate",null,{initialize:function($1,$2,$3,$4){
(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
this.c=$1
this.f=$2
if($3!=null){
this.register($3,$4)
}
this.__delegateID=LzDelegate.__nextID++
},c:null,f:null,lastevent:0,enabled:true,event_called:false,execute:function($1){
var $2=this.c
if($2){
if($2["__LZdeleted"]){
return
}
return $2[this.f]($1)
}
},register:function($1,$2){
if(!$1){
return
}
var $3=$1[$2]
if($3==LzDeclaredEvent||!$3){
$3=new LzEvent($1,$2,this)
}else{
$3.addDelegate(this)
}
this[this.lastevent++]=$3
},unregisterAll:function(){
for(var $1=0;$1<this.lastevent;$1++){
this[$1].removeDelegate(this)
this[$1]=null
}
this.lastevent=0
},unregisterFrom:function($1){
var $2=[]
for(var $3=0;$3<this.lastevent;$3++){
var $4=this[$3]
if($4==$1){
$4.removeDelegate(this)
}else{
$2.push($4)
}
this[$3]=null
}
this.lastevent=0
var $5=$2.length
for(var $3=0;$3<$5;$3++){
this[this.lastevent++]=$2[$3]
}
},disable:function(){
this.enabled=false
},enable:function(){
this.enabled=true
},toString:function(){
return "Delegate for "+this.c+" calls "+this.f+" "+this.__delegateID
}},{__nextID:1,__LZdelegatesQueue:[],__LZdrainDelegatesQueue:function($1){
var $2=this.__LZdelegatesQueue
var $3=$2.length
var $4=$1
while($4<$3){
var $5=$2[$4]
var $6=$2[$4+1]
if($5.c[$5.f]){
$5.c[$5.f]($6)
}
$4+=2
}
$2.length=$1
}})
var LzEvent=Class.make("LzEvent",null,{initialize:function($1,$2,$3){
(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
var $4=$1._events
if($4==null){
$1._events=[this]
}else{
$4.push(this)
}
$1[$2]=this
if($3){
this.delegateList=[$3]
this.ready=true
}else{
this.delegateList=[]
}
},locked:false,ready:false,addDelegate:function($1){
this.ready=true
this.delegateList.push($1)
},sendEvent:function($1){
if(this.locked){
return
}
var $2=this.delegateList.length
if($2==0){
return
}
this.locked=true
var $4=new Array()
var $5
var $6=LzDelegate.__LZdelegatesQueue
for(var $7=$2;$7>=0;$7--){
$5=this.delegateList[$7]
if($5&&!$5.event_called){
$5.event_called=true
$4.push($5)
if($5.enabled&&$5.c){
if($5.c.__LZdeferDelegates){
$6.push($5,$1)
}else{
if($5.c[$5.f]){
$5.c[$5.f]($1)
}
}
}
}
}
while($5=$4.pop()){
$5.event_called=false
}
this.locked=false
},removeDelegate:function($1){
var $2=this.delegateList.length
for(var $3=0;$3<$2;$3++){
if(this.delegateList[$3]==$1){
this.delegateList.splice($3,1)
break
}
}
if(this.delegateList.length==0){
this.ready=false
}
},clearDelegates:function(){
while(this.delegateList.length){
this.delegateList[0].unregisterFrom(this)
}
this.ready=false
},getDelegateCount:function(){
return this.delegateList.length
},toString:function(){
return "LzEvent"
}},null)
var LzIdleKernel={__callbacks:[],addCallback:function($1,$2){
LzIdleKernel.__callbacks.push([$1,$2])
},removeCallback:function($1,$2){
for(var $3=LzIdleKernel.__callbacks.length-1;$3>=0;$3--){
if(LzIdleKernel.__callbacks[$3][0]==$1&&LzIdleKernel.__callbacks[$3][1]==$2){
return LzIdleKernel.__callbacks.splice($3,1)
}
}
},__update:function(){
for(var $1=LzIdleKernel.__callbacks.length-1;$1>=0;$1--){
var $2=LzIdleKernel.__callbacks[$1][0]
$2[LzIdleKernel.__callbacks[$1][1]](getTimer())
}
}}
setInterval(LzIdleKernel.__update,33)
var LzUtils={callback:{__scopeid:0,__scopes:[],getcallbackstr:function($1,$2){
var $3=LzUtils.callback.__scopeid++
if($1.__callbacks==null){
$1.__callbacks={sc:$3}
}else{
$1.__callbacks[$3]=$3
}
LzUtils.callback.__scopes[$3]=$1
return "if (LzUtils.callback.__scopes["+$3+"]) LzUtils.callback.__scopes["+$3+"]."+$2+".apply(LzUtils.callback.__scopes["+$3+"], [])"
},getcallbackfunc:function($1,name,args){
var sc=LzUtils.callback.__scopeid++
if($1.__callbacks==null){
$1.__callbacks={sc:sc}
}else{
$1.__callbacks[sc]=sc
}
LzUtils.callback.__scopes[sc]=$1
return function(){
var $1=LzUtils.callback.__scopes[sc]
if($1){
return $1[name].apply($1,args)
}
}
},remove:function($1){
if($1.__callbacks!=null){
for(var $2 in $1.__callbacks){
var $3=$1.__callbacks[$2]
delete LzUtils.callback.__scopes[$3]
}
delete $1.__callbacks
}
}},dectohex:function($1,$2){
if(typeof $1=="number"){
var $3=$1.toString(16)
var $4=($2?$2:0)-$3.length
while($4>0){
$3="0"+$3
$4--
}
return $3
}else{
return $1
}
},color:{hextoint:function($1){
if(typeof $1!="string"){
return $1
}
if($1.charAt(0)=="#"){
var $2=parseInt($1.slice(1),16)
switch(!isNaN($2)&&$1.length-1){
case 3:
return(($2&3840)<<8|($2&240)<<4|$2&15)*17
case 6:
return $2
default:


}
}
if(typeof eval($1)=="number"){
return eval($1)
}
return 0
},inttohex:function($1){
if(typeof $1=="string"){
$1=$1*1
}
if(typeof $1=="number"){
var $2=LzUtils.dectohex($1,6)
$1="#"+$2
}
return $1
},torgb:function($1){
if(typeof $1=="number"){
$1=this.inttohex($1)
}
if(typeof $1!="string"){
return $1
}
if($1.length<6){
$1="#"+$1.charAt(1)+$1.charAt(1)+$1.charAt(2)+$1.charAt(2)+$1.charAt(3)+$1.charAt(3)+($1.length>4?$1.charAt(4)+$1.charAt(4):"")
}
return "rgb("+parseInt($1.substring(1,3),16)+","+parseInt($1.substring(3,5),16)+","+parseInt($1.substring(5,7),16)+($1.length>7?","+parseInt($1.substring(7,9),16):"")+")"
}}}
var LzLibraryCleanup=Class.make("LzLibraryCleanup",LzNode,{initialize:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
var $3=LzLibrary.findLibrary($2.libname)
$3.loading=false
if($3.onload.ready){
$3.onload.sendEvent(true)
}
}},{tagname:"__libraryloadercomplete"})
var LzResourceLibrary={}
var getTimer=function(){
return new Date().valueOf()-getTimer.startTime
}
getTimer.startTime=new Date().valueOf()
global=window
var LzPool=function($1,$2,$3,$4){
this.cache={}
if(typeof $1=="function"){
this.getter=$1
}
if(typeof $2=="function"){
this.cacheHit=$2
}
if(typeof $3=="function"){
this.destroyer=$3
}
if($4){
this.owner=$4
}
}
LzPool.prototype.cache=null
LzPool.prototype.get=function($1){
if(this.cache[$1]==null){
this.cache[$1]=this.getter($1,Array.prototype.slice.apply(arguments,[1]))
}else{
if(this.cacheHit){
this.cacheHit($1,this.cache[$1],Array.prototype.slice.apply(arguments,[1]))
}
}
if(this.owner){
this.cache[$1].owner=this.owner
}
return this.cache[$1]
}
LzPool.prototype.flush=function($1){
if(this.destroyer){
this.destroyer($1,this.cache[$1])
}
this.cache[$1]=null
}
LzPool.prototype.destroy=function(){
for(var $1 in this.cache){
this.flush($1)
}
this.owner=null
this.cache=null
}
LzPool.prototype.getter=null
LzPool.prototype.destroyer=null
LzPool.prototype.cacheHit=null
var LzKeyboardKernel={__downKeysHash:{},__keyboardEvent:function($1){
if(!$1){
$1=window.event
}
var $2={}
var $3=false
var $4=$1["keyCode"]
var $5=LzKeyboardKernel.__downKeysHash
if($4>=0){
var $6=String.fromCharCode($4).toLowerCase()
var $7=$1.type
if($7=="keyup"){
if($5[$6]!=false){
$2[$6]=false
$3=true
}
$5[$6]=false
}else{
if($7=="keydown"){
if($5[$6]!=true){
$2[$6]=true
$3=true
}
$5[$6]=true
}
}
}
if($5["alt"]!=$1["altKey"]){
$2["alt"]=$1["altKey"]
$3=true
if(LzSprite.prototype.quirks["alt_key_sends_control"]){
$2["control"]=$2["alt"]
}
}
if($5["control"]!=$1["ctrlKey"]){
$2["control"]=$1["ctrlKey"]
$3=true
}
if($5["shift"]!=$1["shiftKey"]){
$2["shift"]=$1["shiftKey"]
$3=true
}
$5["alt"]=$1["altKey"]
$5["control"]=$1["ctrlKey"]
$5["shift"]=$1["shiftKey"]
if($3&&LzKeyboardKernel.__callback){
LzKeyboardKernel.__scope[LzKeyboardKernel.__callback]($2,$4,"on"+$7)
}
if($4>=0){
if($4==9){
$1.cancelBubble=true
$1.returnValue=false
return false
}else{
if(LzKeyboardKernel.__cancelKeys&&($4==13||$4==0||$4==37||$4==38||$4==39||$4==40)){
$1.cancelBubble=true
$1.returnValue=false
return false
}
}
}
},__mousewheelEvent:function($1){
if(!$1){
$1=window.event
}
var $2=0
if($1.wheelDelta){
$2=$1.wheelDelta/120
if(LzSprite.prototype.quirks["reverse_mouse_wheel"]){
$2=-$2
}
}else{
if($1.detail){
$2=-$1.detail/3
}
}
if($1.preventDefault){
$1.preventDefault()
}
$1.returnValue=false
if($2&&LzKeyboardKernel.__mousewheelcallback){
LzKeyboardKernel.__scope[LzKeyboardKernel.__mousewheelcallback]($2)
}
},__callback:null,__mousewheelcallback:null,__scope:null,__cancelKeys:true,setCallback:function($1,$2,$3){
this.__scope=$1
this.__callback=$2
this.__mousewheelcallback=$3
if(lzOptions.dhtmlKeyboardControl!=false){
document.onkeydown=LzKeyboardKernel.__keyboardEvent
document.onkeyup=LzKeyboardKernel.__keyboardEvent
document.onkeypress=LzKeyboardKernel.__keyboardEvent
if(window.addEventListener){
window.addEventListener("DOMMouseScroll",LzKeyboardKernel.__mousewheelEvent,false)
}
document.onmousewheel=LzKeyboardKernel.__mousewheelEvent
}
}}
var LzMouseKernel={__lastMouseDown:null,__x:0,__y:0,owner:null,__showncontextmenu:null,__defaultcontextmenu:null,__mouseEvent:function($1){
if(!$1){
$1=window.event
}
var $2="on"+$1.type
if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__keyboardEvent($1)
}
if(window["LzInputTextSprite"]&&$2!="onmousemove"&&LzInputTextSprite.prototype.__lastshown!=null){
LzInputTextSprite.prototype.__hideIfNotFocused()
}
if($2=="onmouseup"&&LzMouseKernel.__lastMouseDown!=null){
LzMouseKernel.__lastMouseDown.__globalmouseup($1)
}else{
if($2=="onmousemove"){
if($1.pageX||$1.pageY){
LzMouseKernel.__x=$1.pageX
LzMouseKernel.__y=$1.pageY
}else{
if($1.clientX||$1.clientY){
LzMouseKernel.__x=$1.clientX
LzMouseKernel.__y=$1.clientY
}
}
}
}
if(LzMouseKernel.__callback){
if($1.button==2&&$2!="oncontextmenu"){
return
}
if($2=="oncontextmenu"){
var $3=$1.srcElement?$1.srcElement:$1.target
if($3&&$3.owner&&$3.owner.__contextmenu){
$3.owner.__contextmenu.__show()
return $3.owner.__contextmenu.showbuiltins
}else{
if(LzMouseKernel.__defaultcontextmenu){
LzMouseKernel.__defaultcontextmenu.__show()
return LzMouseKernel.__defaultcontextmenu.showbuiltins
}
}
}else{
return LzMouseKernel.__scope[LzMouseKernel.__callback]($2)
}
}
},__callback:null,__scope:null,setCallback:function($1,$2){
this.__scope=$1
this.__callback=$2
document.onmousemove=LzMouseKernel.__mouseEvent
document.onmousedown=LzMouseKernel.__mouseEvent
document.onmouseup=LzMouseKernel.__mouseEvent
document.oncontextmenu=LzMouseKernel.__mouseEvent
},__showhand:"pointer",showHandCursor:function($1){
var $2=$1==true?"pointer":"default"
this.__showhand=$2
LzMouseKernel.setCursorGlobal($2)
},setCursorGlobal:function($1){
if(LzSprite.prototype.quirks.no_cursor_colresize){
return
}
var $1=LzSprite.prototype.__defaultStyles.hyphenate($1)
LzSprite.prototype.__setCSSClassProperty(".lzclickdiv","cursor",$1)
},restoreCursor:function(){
if(LzSprite.prototype.quirks.no_cursor_colresize){
return
}
if(LzMouseKernel.__amLocked){
return
}
LzSprite.prototype.__setCSSClassProperty(".lzclickdiv","cursor",LzMouseKernel.__showhand)
},lock:function(){
LzMouseKernel.__amLocked=true
},unlock:function(){
LzMouseKernel.__amLocked=false
LzMouseKernel.restoreCursor()
}}
var LzSprite=function($1,$2){
if($1==null){
return
}
if($2){
this.isroot=true
LzSprite.__rootSprite=this
var $3=document.createElement("div")
$3.className="lzcanvasdiv"
var $4=Lz.__propcache
var $5=$4.appenddiv
if($4.bgcolor){
$3.style.backgroundColor=$4.bgcolor
}
if($4.width){
$3.style.width=$4.width
}
if($4.height){
$3.style.height=$4.height
}
if(this.quirks.canvas_div_cannot_be_clipped==false&&$4.width&&$4.width.indexOf("%")==-1&&$4.height&&$4.height.indexOf("%")==-1){
$3.style.clip="rect(0px "+$4.width+" "+$4.height+" 0px)"
$3.style.overflow="hidden"
}
$5.appendChild($3)
this.__LZdiv=$3
if(this.quirks.fix_clickable){
var $6=document.createElement("div")
$6.className="lzcanvasclickdiv"
$5.appendChild($6)
this.__LZclickdiv=$6
}
}else{
this.__LZdiv=document.createElement("div")
this.__LZdiv.className="lzdiv"
if(this.quirks.fix_clickable){
this.__LZclickdiv=document.createElement("div")
this.__LZclickdiv.className="lzdiv"
}
}
this.__LZdiv.owner=this
if(this.quirks.fix_clickable){
this.__LZclickdiv.owner=this
}
this.owner=$1
this.uid=LzSprite.prototype.uid++
if(this.quirks.ie_leak_prevention){
this.__sprites[this.uid]=this
}
}
LzSprite.prototype.__defaultStyles={lzdiv:{position:"absolute"},lzclickdiv:{position:"absolute"},lzinputclickdiv:{position:"absolute"},lzcanvasdiv:{position:"absolute"},lzcanvasclickdiv:{zIndex:100000,position:"absolute"},lztext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",whiteSpace:"normal",position:"absolute"},lzswftext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",whiteSpace:"normal",position:"absolute",paddingTop:"2px",paddingLeft:"2px"},lzinputtext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",width:"100%",height:"100%",borderWidth:0,backgroundColor:"transparent"},lzswfinputtext:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",width:"100%",height:"100%",borderWidth:0,backgroundColor:"transparent",marginTop:"1px",marginLeft:"2px"},lzswfinputtextmultiline:{fontFamily:"Verdana,Vera,sans-serif",fontStyle:"normal",fontWeight:"normal",fontSize:"11px",width:"100%",height:"100%",borderWidth:0,backgroundColor:"transparent",marginTop:"2px",marginLeft:"2px"},writeCSS:function(){
var $1=""
for(var $2 in this){
if($2=="writeCSS"||$2=="hyphenate"||$2=="__re"){
continue
}
$1+=$2.indexOf("#")==-1?".":""
$1+=$2+"{"
for(var $3 in this[$2]){
var $4=this[$2][$3]
$1+=this.hyphenate($3)+":"+$4+";"
}
$1+="}"
}
document.write('<style type="text/css">'+$1+"</style>")
},__re:new RegExp("[A-Z]"),hyphenate:function($1){
var $2=$1.search(this.__re)
if($2!=-1){
var $3=$1.substring($2,$2+1)
$1=$1.substring(0,$2)+"-"+$3.toLowerCase()+$1.substring($2+1,$1.length)
}
return $1
}}
LzSprite.prototype.__defaultStyles["#lzcontextmenu a"]={color:"#000",display:"block",textDecoration:"none"}
LzSprite.prototype.__defaultStyles["#lzcontextmenu a:hover"]={color:"#FFF",backgroundColor:"#333"}
LzSprite.prototype.__defaultStyles["#lzcontextmenu"]={position:"absolute",zIndex:10000000,backgroundColor:"#CCC",border:"1px outset #999",padding:"4px",fontFamily:"Verdana,Vera,sans-serif",fontSize:"13px",margin:"2px",color:"#999"}
LzSprite.prototype.uid=0
LzSprite.prototype.quirks={fix_clickable:true,fix_ie_background_height:false,fix_ie_clickable:false,ie_alpha_image_loader:false,ie_leak_prevention:false,invisible_parent_image_sizing_fix:false,emulate_flash_font_metrics:true,inner_html_strips_newlines:true,inner_html_no_entity_apos:false,css_hide_canvas_during_init:true,firefox_autocomplete_bug:false,hand_pointer_for_clickable:true,alt_key_sends_control:false,safari_textarea_subtract_scrollbar_height:false,safari_avoid_clip_position_input_text:false,reverse_mouse_wheel:false,no_cursor_colresize:false,safari_visibility_instead_of_display:false,preload_images_only_once:false,absolute_position_accounts_for_offset:false,canvas_div_cannot_be_clipped:false,inputtext_parents_cannot_contain_clip:false,minimize_opacity_changes:false,set_height_for_multiline_inputtext:false,ie_offset_position_by_2:false}
LzSprite.prototype.capabilities={rotation:false,scalecanvastopercentage:true,opacity:true,colortransform:false,audio:false,accessibility:false,htmlinputtext:false,advancedfonts:false}
LzSprite.prototype.__updateQuirks=function(){
if(window["Lz"]&&Lz.__BrowserDetect){
Lz.__BrowserDetect.init()
if(this.quirks["inner_html_strips_newlines"]==true){
LzSprite.prototype.inner_html_strips_newlines_re=RegExp("$","mg")
}
if(Lz.__BrowserDetect.isIE){
this.quirks["ie_alpha_image_loader"]=true
this.quirks["ie_leak_prevention"]=true
this.quirks["fix_ie_clickable"]=true
this.quirks["fix_ie_background_height"]=true
this.quirks["inner_html_no_entity_apos"]=true
this.quirks["inputtext_parents_cannot_contain_clip"]=true
this.quirks["minimize_opacity_changes"]=true
this.quirks["set_height_for_multiline_inputtext"]=true
if(Lz.__BrowserDetect.version>6){
this.quirks["ie_offset_position_by_2"]=true
}
}else{
if(Lz.__BrowserDetect.isSafari){
this.quirks["invisible_parent_image_sizing_fix"]=true
this.quirks["alt_key_sends_control"]=true
this.quirks["safari_textarea_subtract_scrollbar_height"]=true
this.quirks["safari_avoid_clip_position_input_text"]=true
this.quirks["safari_visibility_instead_of_display"]=true
this.quirks["absolute_position_accounts_for_offset"]=true
this.quirks["canvas_div_cannot_be_clipped"]=true
}else{
if(Lz.__BrowserDetect.isOpera){
this.quirks["invisible_parent_image_sizing_fix"]=true
this.quirks["reverse_mouse_wheel"]=true
this.quirks["no_cursor_colresize"]=true
this.quirks["absolute_position_accounts_for_offset"]=true
this.quirks["canvas_div_cannot_be_clipped"]=true
}else{
if(Lz.__BrowserDetect.isFirefox&&Lz.__BrowserDetect.version<2){
this.quirks["firefox_autocomplete_bug"]=true
}
}
}
}
}
if(this.quirks["safari_avoid_clip_position_input_text"]){
LzSprite.prototype.__defaultStyles.lzswfinputtext.marginTop="-2px"
LzSprite.prototype.__defaultStyles.lzswfinputtext.marginLeft="-2px"
LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.marginTop="-2px"
LzSprite.prototype.__defaultStyles.lzswfinputtextmultiline.marginLeft="-2px"
}
if(this.quirks["css_hide_canvas_during_init"]){
if(this.quirks["safari_visibility_instead_of_display"]){
LzSprite.prototype.__defaultStyles.lzcanvasdiv.visibility="hidden"
}else{
LzSprite.prototype.__defaultStyles.lzcanvasdiv.display="none"
}
LzSprite.prototype.__defaultStyles.lzcanvasclickdiv.display="none"
}
if(this.quirks["hand_pointer_for_clickable"]){
LzSprite.prototype.__defaultStyles.lzclickdiv.cursor="pointer"
}
}
LzSprite.prototype.__updateQuirks()
LzSprite.prototype.__defaultStyles.writeCSS()
LzSprite.prototype.__LZdiv=null
LzSprite.prototype.__LZimg=null
LzSprite.prototype.__LZclick=null
LzSprite.prototype.x=null
LzSprite.prototype.y=null
LzSprite.prototype.opacity=null
LzSprite.prototype.width=null
LzSprite.prototype.height=null
LzSprite.prototype.playing=false
LzSprite.prototype.clickable=false
LzSprite.prototype.frame=1
LzSprite.prototype.frames=null
LzSprite.prototype.blankimage=lzOptions.ServerRoot+"/lps/includes/blank.gif"
LzSprite.prototype.resource=null
LzSprite.prototype.source=null
LzSprite.prototype.visible=null
LzSprite.prototype.text=null
LzSprite.prototype.clip=null
LzSprite.prototype.stretches=null
LzSprite.prototype.resourceWidth=null
LzSprite.prototype.resourceHeight=null
LzSprite.prototype.cursor=null
LzSprite.prototype.init=function($1){
this.setVisible($1)
if(this.isroot){
if(this.quirks["safari_visibility_instead_of_display"]){
this.__LZdiv.style.visibility="visible"
}
var $2=document.getElementById("lzsplash")
if($2){
LzSprite.prototype.__discardElement($2)
}
}
}
LzSprite.prototype.__topZ=1
LzSprite.prototype.__parent=null
LzSprite.prototype.__children=null
LzSprite.prototype.addChildSprite=function($1){
$1.__parent=this
if(this.__children){
this.__children.push($1)
}else{
this.__children=[$1]
}
this.__LZdiv.appendChild($1.__LZdiv)
if(this.quirks.fix_clickable){
this.__LZclickdiv.appendChild($1.__LZclickdiv)
}
$1.__setZ(++this.__topZ)
}
LzSprite.prototype.setResource=function($1){
if(this.resource==$1){
return
}
if($1.indexOf("http:")==0||$1.indexOf("https:")==0){
this.skiponload=false
this.setSource($1)
this.resource=$1
return
}
this.resource=$1
var $2=LzResourceLibrary[$1]
if(!$2){
return
}
var $3=$2.frames
this.resourceWidth=$2.width
this.resourceHeight=$2.height
this.skiponload=true
this.owner.setTotalFrames($3.length)
var $4=$3[0]
if($4){
this.baseurl=""
if($2.ptype){
if($2.ptype=="sr"){
this.baseurl=lzOptions.ServerRoot+"/"
}
}
this.frames=$3
this.__preloadFrames()
this.setSource($4,true)
}else{
this.setSource($1,true)
}
}
LzSprite.prototype.CSSDimension=function($1,$2){
return Math.floor($1)+($2?$2:"px")
}
LzSprite.prototype.loading=false
LzSprite.prototype.setSource=function($1,$2){
if($2!=true){
this.skiponload=false
}
this.loading=true
this.source=$1
if(!this.__ImgPool){
this.__ImgPool=new LzPool(LzSprite.prototype.__getImage,LzSprite.prototype.__gotImage,LzSprite.prototype.__destroyImage,this)
}
var $3=this.__ImgPool.get($1)
if(this.__LZimg){
this.__LZdiv.replaceChild($3,this.__LZimg)
this.__LZimg=$3
}else{
this.__LZimg=$3
this.__LZdiv.appendChild(this.__LZimg)
}
if(this.stretches){
this.__updateStretches()
}
if(this.clickable){
this.setClickable(true)
}
if(this.quirks.ie_alpha_image_loader){
this.__updateIEAlpha($3)
}
}
if(LzSprite.prototype.quirks.ie_alpha_image_loader){
LzSprite.prototype.__updateIEAlpha=function($1){
if($1._hasax==true){
return
}
var $2=this.resourceWidth
var $3=this.resourceHeight
if(this.stretches=="both"){
$2="100%"
$3="100%"
}else{
if(this.stretches=="width"){
$2="100%"
}else{
if(this.stretches=="height"){
$3="100%"
}
}
}
if($2==null){
$2=this.width==null?"100%":this.width
}
if($3==null){
$3=this.height==null?"100%":this.height
}
if($2==null||$3==null){
return
}
$1.style.width=$2
$1.style.height=$3
}
}
LzSprite.prototype.setFontName=function($1,$2){
this.fontname=$1
}
LzSprite.prototype.setClickable=function($1){
$1=$1==true
if(this.clickable==$1){
return
}
if(this.__LZimg!=null){
if(this.__LZdiv._clickable){
this.__setClickable(false,this.__LZdiv)
}
if(!this.__LZclick){
if(this.quirks.fix_ie_clickable){
this.__LZclick=document.createElement("img")
this.__LZclick.src=LzSprite.prototype.blankimage
}else{
this.__LZclick=document.createElement("div")
}
this.__LZclick.owner=this
this.__LZclick.className="lzclickdiv"
this.__LZclick.style.width=this.__LZdiv.style.width
this.__LZclick.style.height=this.__LZdiv.style.height
if(this.quirks.fix_clickable){
this.__LZclickdiv.appendChild(this.__LZclick)
}else{
this.__LZdiv.appendChild(this.__LZclick)
}
}
this.__setClickable($1,this.__LZclick)
if(this.quirks.fix_clickable){
if(this.quirks.fix_ie_clickable){
this.__LZclickdiv.style.display=$1?"":"none"
this.__LZclick.style.display=$1?"":"none"
}else{
this.__LZclick.style.display=$1?"block":"none"
}
}
}else{
if(this.quirks.fix_clickable){
if(!this.__LZclick){
if(this.quirks.fix_ie_clickable){
this.__LZclick=document.createElement("img")
this.__LZclick.src=LzSprite.prototype.blankimage
}else{
this.__LZclick=document.createElement("div")
}
this.__LZclick.owner=this
this.__LZclick.className="lzclickdiv"
this.__LZclick.style.width=this.__LZdiv.style.width
this.__LZclick.style.height=this.__LZdiv.style.height
this.__LZclickdiv.appendChild(this.__LZclick)
}
this.__setClickable($1,this.__LZclick)
if(this.quirks.fix_ie_clickable){
this.__LZclick.style.display=$1?"":"none"
}else{
this.__LZclick.style.display=$1?"block":"none"
}
}else{
this.__setClickable($1,this.__LZdiv)
}
}
this.clickable=$1
}
LzSprite.prototype.__setClickable=function($1,$2){
if($2._clickable==$1){
return
}
$2._clickable=$1
if($1){
$2.onclick=function($1){
this.owner.__mouseEvent($1)
return false
}
$2.onmouseover=function($1){
this.owner.__mouseEvent($1)
return false
}
$2.onmouseout=function($1){
this.owner.__mouseEvent($1)
return false
}
$2.onmousedown=function($1){
this.owner.__mouseEvent($1)
return false
}
$2.onmouseup=function($1){
this.owner.__mouseEvent($1)
return false
}
if(this.quirks.fix_ie_clickable){
$2.ondrag=function($1){
return false
}
}
}else{
$2.onclick=null
$2.onmouseover=null
$2.onmouseout=null
$2.onmousedown=null
$2.onmouseup=null
if(this.quirks.fix_ie_clickable){
$2.ondrag=null
}
}
}
LzSprite.prototype.__mouseEvent=function($1){
if(!$1){
$1=window.event
}
if(window["LzKeyboardKernel"]&&window["LzKeyboardKernel"].__keyboardEvent){
LzKeyboardKernel.__keyboardEvent($1)
}
var $2=false
var $3="on"+$1.type
if(window["LzInputTextSprite"]&&$3=="onmouseover"&&LzInputTextSprite.prototype.__lastshown!=null){
LzInputTextSprite.prototype.__hideIfNotFocused()
}
if($3=="onmousedown"){
$1.cancelBubble=true
this.__mousedown=true
if(window["LzMouseKernel"]){
LzMouseKernel.__lastMouseDown=this
}
}else{
if($3=="onmouseup"){
$1.cancelBubble=false
if(window["LzMouseKernel"]&&LzMouseKernel.__lastMouseDown==this){
this.__mousedown=false
LzMouseKernel.__lastMouseDown=null
}else{
$2=true
}
}
}
if($2==false&&this.owner.mouseevent){
LzModeManager.handleMouseButton(this.owner,$3)
}
}
LzSprite.prototype.__globalmouseup=function($1){
if(this.__mousedown){
this.__mouseEvent($1)
}
}
LzSprite.prototype.setX=function($1){
if($1==null||$1==this.x||isNaN($1)){
return
}
this.__poscachedirty=true
this.x=$1
$1=this.CSSDimension($1)
if(this._x!=$1){
this._x=$1
this.__LZdiv.style.left=$1
if(this.quirks.fix_clickable){
this.__LZclickdiv.style.left=$1
}
}
}
LzSprite.prototype.setWidth=function($1){
if($1==null||$1<0||isNaN($1)||this.width==$1){
return
}
this.width=$1
$1=this.CSSDimension($1)
if(this._w!=$1){
this._w=$1
this.__LZdiv.style.width=$1
if(this.clip){
this.__updateClip()
}
if(this.stretches){
this.__updateStretches()
}
if(this.__LZclick){
this.__LZclick.style.width=$1
}
}
}
LzSprite.prototype.setY=function($1){
if($1==null||$1==this.y||isNaN($1)){
return
}
this.__poscachedirty=true
this.y=$1
$1=this.CSSDimension($1)
if(this._y!=$1){
this._y=$1
this.__LZdiv.style.top=$1
if(this.quirks.fix_clickable){
this.__LZclickdiv.style.top=$1
}
}
}
LzSprite.prototype.setHeight=function($1){
if($1==null||$1<0||isNaN($1)||this.height==$1){
return
}
this.height=$1
$1=this.CSSDimension($1)
if(this._h!=$1){
this._h=$1
this.__LZdiv.style.height=$1
if(this.clip){
this.__updateClip()
}
if(this.stretches){
this.__updateStretches()
}
if(this.__LZclick){
this.__LZclick.style.height=$1
}
}
}
LzSprite.prototype.setMaxLength=function($1){

}
LzSprite.prototype.setPattern=function($1){

}
LzSprite.prototype.__LZsetClickRegion=function($1){

}
LzSprite.prototype.setVisible=function($1){
if(this.visible==$1){
return
}
this.visible=$1
this.__LZdiv.style.display=$1?"block":"none"
if(this.quirks.fix_clickable){
if(this.__LZclick&&this.quirks.fix_ie_clickable){
this.__LZclick.style.display=$1?"":"none"
}else{
this.__LZclickdiv.style.display=$1?"block":"none"
}
}
}
LzSprite.prototype.setColor=function($1){
if(this.color==$1){
return
}
this.color=$1
this.__LZdiv.style.color=LzUtils.color.inttohex($1)
}
LzSprite.prototype.setBGColor=function($1){
if(this.bgcolor==$1){
return
}
this.bgcolor=$1
this.__LZdiv.style.backgroundColor=$1==null?"transparent":LzUtils.color.inttohex($1)
if(this.quirks.fix_ie_background_height){
if(this.height!=null&&this.height<2){
this.setSource(LzSprite.prototype.blankimage,true)
}else{
if(!this._fontSize){
this.__LZdiv.style.fontSize="0px"
}
}
}
}
LzSprite.prototype.setOpacity=function($1){
if(this.opacity==$1||$1<0){
return
}
this.opacity=$1
if($1<0.0010){
$1=0
}
if(this.quirks.ie_alpha_image_loader){
this.__LZdiv.style.filter="alpha(opacity="+$1*100+")"
}else{
this.__LZdiv.style.opacity=$1
}
}
LzSprite.prototype.play=function($1){
if(isNaN($1*1)==false){
this.__setFrame($1)
}
if(this.playing==true){
return
}
if(this.frames&&this.frames.length>1){
this.playing=true
LzIdleKernel.addCallback(this,"__incrementFrame")
}
}
LzSprite.prototype.stop=function($1){
if(this.playing==true){
this.playing=false
LzIdleKernel.removeCallback(this,"__incrementFrame")
}
if(isNaN($1*1)==false){
this.__setFrame($1)
}
}
LzSprite.prototype.__incrementFrame=function(){
this.frame++
if(this.frames&&this.frame>this.frames.length){
this.frame=1
}
this.__updateFrame()
}
LzSprite.prototype.__updateFrame=function($1){
if(this.playing||$1){
var $2=this.frames[this.frame-1]
this.setSource($2,true)
}
if(this.owner.frame!=this.frame-1){
this.owner.spriteAttribute("frame",this.frame)
}
}
if(LzSprite.prototype.quirks.preload_images_only_once){
LzSprite.prototype.__preloadurls={}
}
LzSprite.prototype.__preloadFrames=function(){
if(!this.__ImgPool){
this.__ImgPool=new LzPool(LzSprite.prototype.__getImage,LzSprite.prototype.__gotImage,LzSprite.prototype.__destroyImage,this)
}
var $1=this.frames.length
for(var $2=0;$2<$1;$2++){
var $3=this.frames[$2]
if(this.quirks.preload_images_only_once){
if($2>0&&LzSprite.prototype.__preloadurls[$3]){
continue
}
LzSprite.prototype.__preloadurls[$3]=true
}
var $4=this.__ImgPool.get($3,true)
if(this.quirks.ie_alpha_image_loader){
this.__updateIEAlpha($4)
}
}
}
LzSprite.prototype.__findParents=function($1){
var $2=[]
var $3=this
if($3[$1]!=null){
$2.push($3)
}
do{
$3=$3.__parent
if($3[$1]!=null){
$2.push($3)
}
}while($3!=LzSprite.__rootSprite)
return $2
}
LzSprite.prototype.__imgonload=function($1){
if(this.loading!=true){
return
}
if(this.__imgtimoutid!=null){
clearTimeout(this.__imgtimoutid)
}
this.__imgtimoutid=null
this.loading=false
this.resourceWidth=$1.width
this.resourceHeight=$1.height
if(LzSprite.prototype.quirks.invisible_parent_image_sizing_fix&&this.resourceWidth==0){
var $2=this.__findParents("visible")
if($2.length>0){
var $3=[]
var $4=$2.length
for(var $5=0;$5<$4;$5++){
var $6=$2[$5]
$3[$5]=$6.__LZdiv.style.display
$6.__LZdiv.style.display="block"
}
this.resourceWidth=$1.width
this.resourceHeight=$1.height
for(var $5=0;$5<$4;$5++){
var $6=$2[$5]
$6.__LZdiv.style.display=$3[$5]
}
}
}
if(this.stretches){
this.__updateStretches()
}
$1.__lastcondition="__imgonload"
this.owner.resourceload({width:this.resourceWidth,height:this.resourceHeight,resource:this.resource,skiponload:this.skiponload})
}
LzSprite.prototype.__imgonerror=function($1){
if(this.loading!=true){
return
}
if(this.__LZimg){
this.__LZimg.__lastcondition="__imgonerror"
}
if(this.__imgtimoutid!=null){
clearTimeout(this.__imgtimoutid)
}
this.__imgtimoutid=null
this.loading=false
this.resourceWidth=1
this.resourceHeight=1
if(this.stretches){
this.__updateStretches()
}
this.owner.resourceloaderror({resource:this.resource})
}
LzSprite.prototype.__imgontimeout=function($1){
if(this.loading!=true){
return
}
if(this.__LZimg){
this.__LZimg.__lastcondition="__imgontimeout"
}
this.__imgtimoutid=null
this.loading=false
this.resourceWidth=1
this.resourceHeight=1
if(this.stretches){
this.__updateStretches()
}
this.owner.resourceloadtimeout({resource:this.resource})
}
LzSprite.prototype.__destroyImage=function($1,$2){
if($2&&$2.owner){
LzUtils.callback.remove($2.owner)
}
if(LzSprite.prototype.quirks.ie_alpha_image_loader&&$2.sizer){
if($2.sizer.tId){
clearTimeout($2.sizer.tId)
}
LzSprite.prototype.__discardElement($2.sizer)
$2.sizer.onload=null
$2.sizer.onloadforeal=null
$2.sizer=null
}
if($2){
LzSprite.prototype.__discardElement($2)
}
$2=null
if(LzSprite.prototype.quirks.preload_images_only_once){
LzSprite.prototype.__preloadurls[$1]=null
}
}
LzSprite.prototype.__gotImage=function($1,$2){
this.owner[$2.__lastcondition]({width:this.owner.resourceWidth,height:this.owner.resourceHeight})
}
LzSprite.prototype.__getImage=function($1,$2){
if(this.owner.baseurl){
$1=this.owner.baseurl+$1
}
if(LzSprite.prototype.quirks.ie_alpha_image_loader){
var im=document.createElement("div")
im.style.overflow="hidden"
if(this.owner&&$2+""!="true"){
im.owner=this.owner
if(!im.sizer){
im.sizer=document.createElement("img")
}
im.sizer.onload=function(){
im.sizer.tId=setTimeout(this.onloadforeal,1)
}
im.sizer.onerror=function(){
im.owner.__imgonerror(im.sizer)
}
im.sizer.onloadforeal=function(){
im.owner.__imgonload(im.sizer)
}
var $3=LzUtils.callback.getcallbackstr(this.owner,"__imgontimeout")
this.owner.__imgtimoutid=setTimeout($3,canvas.medialoadtimeout)
im.sizer.src=$1
}
if(this.owner.stretches){
im.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+$1+"',sizingMethod='scale')"
}else{
im.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+$1+"')"
}
}else{
var im=document.createElement("img")
im.className="lzdiv"
if(this.owner&&$2+""!="true"){
im.owner=this.owner
im.onload=LzUtils.callback.getcallbackfunc(this.owner,"__imgonload",[im])
im.onerror=LzUtils.callback.getcallbackfunc(this.owner,"__imgonerror",[im])
var $3=LzUtils.callback.getcallbackstr(this.owner,"__imgontimeout")
this.owner.__imgtimoutid=setTimeout($3,canvas.medialoadtimeout)
}
im.src=$1
}
if(im){
im.__lastcondition="__imgonload"
}
return im
}
LzSprite.prototype.setClip=function($1){
if(this.clip==$1){
return
}
this.clip=$1
this.__updateClip()
}
LzSprite.prototype.__updateClip=function(){
if(this.clip&&this.width!=null&&this.width>=0&&this.height!=null&&this.height>=0){
var $1="rect(0px "+this._w+" "+this._h+" 0px)"
this.__LZdiv.style.clip=$1
if(this.quirks.fix_clickable){
this.__LZclickdiv.style.clip=$1
}
}else{
if(this.__LZdiv.style.clip){
this.__LZdiv.style.clip="rect(auto auto auto auto)"
if(this.quirks.fix_clickable){
this.__LZclickdiv.style.clip="rect(auto auto auto auto)"
}
}
}
}
LzSprite.prototype.stretchResource=function($1){
if(this.stretches==$1){
return
}
this.stretches=$1
this.__updateStretches()
}
LzSprite.prototype.__updateStretches=function(){
if(this.loading){
return
}
if(this.__LZimg){
if(this.stretches=="both"){
this.__LZimg.width=this.width
this.__LZimg.height=this.height
}else{
if(this.stretches=="height"){
this.__LZimg.width=this.resourceWidth
this.__LZimg.height=this.height
}else{
if(this.stretches=="width"){
this.__LZimg.width=this.width
this.__LZimg.height=this.resourceHeight
}else{
this.__LZimg.width=this.resourceWidth
this.__LZimg.height=this.resourceHeight
}
}
}
}
}
LzSprite.prototype.predestroy=function(){

}
LzSprite.prototype.destroy=function($1){
if(this.destroyed==true){
return
}
if($1){
if(this.__children){
for(var $2=0;$2<this.__children.length;$2++){
this.__children[$2].destroy($1)
}
}
}
if(this.__ImgPool){
this.__ImgPool.destroy()
}
if(this.__LZimg){
this.__discardElement(this.__LZimg)
}
if(this.__LZclick){
this.__setClickable(false,this.__LZclick)
this.__discardElement(this.__LZclick)
}
if(this.__LzInputDiv){
this.__setTextEvents(false)
this.__discardElement(this.__LzInputDiv)
}
if(this.__LZdiv){
this.__LZdiv.onselectstart=null
this.__setClickable(false,this.__LZdiv)
this.__discardElement(this.__LZdiv)
}
if(this.__LZinputclickdiv){
this.__LZinputclickdiv.onmousedown=null
this.__discardElement(this.__LZinputclickdiv)
}
if(this.__LZclickdiv){
this.__discardElement(this.__LZclickdiv)
}
if(this.__LZtextdiv){
this.__discardElement(this.__LZtextdiv)
}
if(this.__LZcanvas){
this.__discardElement(this.__LZcanvas)
}
this.__ImgPool=null
this.destroyed=true
}
LzSprite.prototype.getMouse=function(){
var $1=this.__getPos()
if(this.isroot){
return {x:LzMouseKernel.__x-$1.x,y:LzMouseKernel.__y-$1.y}
}else{
var $2=LzSprite.__rootSprite.getMouse()
return {x:$2.x-$1.x,y:$2.y-$1.y}
}
}
LzSprite.prototype.__poscache=null
LzSprite.prototype.__poscachedirty=true
LzSprite.prototype.__getPos=function(){
var $1=false
var $2=this
while($2!=this.__rootSprite){
if($2.__poscachedirty){
$1=$2
break
}
$2=$2.__parent
}
if($1==false&&this.__poscache){
return this.__poscache
}
var $3=this.__LZdiv
var $4=null
var $5={}
var $6
if(Lz.__BrowserDetect.isIE){
$6=$3.getBoundingClientRect()
var $7=document.documentElement.scrollTop||document.body.scrollTop
var $8=document.documentElement.scrollLeft||document.body.scrollLeft
if(this.quirks["ie_offset_position_by_2"]){
$8-=2
$7-=2
}
return {x:$6.left+$8,y:$6.top+$7}
}else{
if(document.getBoxObjectFor){
$6=document.getBoxObjectFor($3)
$5={x:$6.x,y:$6.y}
}else{
$5={x:$3.offsetLeft,y:$3.offsetTop}
$4=$3.offsetParent
if($4!=$3){
while($4){
$5.x+=$4.offsetLeft
$5.y+=$4.offsetTop
$4=$4.offsetParent
}
}
if(this.quirks.absolute_position_accounts_for_offset&&this.hasOwnProperty("getStyle")&&this.getStyle($3,"position")=="absolute"){
$5.y-=document.body.offsetTop
}
}
}
if($3.parentNode){
$4=$3.parentNode
}else{
$4=null
}
while($4&&$4.tagName!="BODY"&&$4.tagName!="HTML"){
$5.x-=$4.scrollLeft
$5.y-=$4.scrollTop
if($4.parentNode){
$4=$4.parentNode
}else{
$4=null
}
}
var $2=this
while($2&&$2!=this.__rootSprite){
if($2.__parent){
$2.__poscachedirty=false
}
$2=$2.__parent
}
this.__poscache=$5
return $5
}
LzSprite.prototype.getWidth=function(){
var $1=this.__LZdiv.clientWidth
return $1==0?this.width:$1
}
LzSprite.prototype.getHeight=function(){
var $1=this.__LZdiv.clientHeight
return $1==0?this.height:$1
}
LzSprite.prototype.setCursor=function($1){
if(this.quirks.no_cursor_colresize){
return
}
if($1==this.cursor){
return
}
if(this.clickable!=true){
this.setClickable(true)
}
this.cursor=$1
var $1=LzSprite.prototype.__defaultStyles.hyphenate($1)
this.__LZclick.style.cursor=$1
}
LzSprite.prototype.setShowHandCursor=function($1){
if($1==true){
this.setCursor("pointer")
}else{
this.setCursor("default")
}
}
LzSprite.prototype.getMCRef=function(){
return this.__LZdiv
}
LzSprite.prototype.bringToFront=function(){
if(!this.__parent){
return
}
if(this.__parent.__children.length<2){
return
}
this.__setZ(++this.__parent.__topZ)
}
LzSprite.prototype.__setZ=function($1){
this.__LZdiv.style.zIndex=$1
if(this.quirks.fix_clickable){
this.__LZclickdiv.style.zIndex=$1
}
this.__z=$1
}
LzSprite.prototype.__zCompare=function($1,$2){
if($1.__z<$2.__z){
return -1
}
if($1.__z>$2.__z){
return 1
}
return 0
}
LzSprite.prototype.sendToBack=function(){
if(!this.__parent){
return
}
var $1=this.__parent.__children
if($1.length<2){
return
}
$1.sort(LzSprite.prototype.__zCompare)
this.sendBehind($1[0])
}
LzSprite.prototype.sendBehind=function($1){
if(!$1){
return
}
if(!this.__parent){
return
}
var $2=this.__parent.__children
if($2.length<2){
return
}
$2.sort(LzSprite.prototype.__zCompare)
var $3=false
for(var $4=0;$4<$2.length;$4++){
var $5=$2[$4]
if($5==$1){
$3=$1.__z
}
if($3!=false){
$5.__setZ(++$5.__z)
}
}
this.__setZ($3)
}
LzSprite.prototype.sendInFrontOf=function($1){
if(!$1){
return
}
if(!this.__parent){
return
}
var $2=this.__parent.__children
if($2.length<2){
return
}
$2.sort(LzSprite.prototype.__zCompare)
var $3=false
for(var $4=0;$4<$2.length;$4++){
var $5=$2[$4]
if($3!=false){
$5.__setZ(++$5.__z)
}
if($5==$1){
$3=$1.__z+1
}
}
this.__setZ($3)
}
LzSprite.prototype.__setFrame=function($1){
if(!this.frames||this.frame==$1){
return
}
if($1<1){
$1=1
}else{
if($1>this.frames.length){
$1=this.frames.length
}
}
this.frame=$1
this.__updateFrame(true)
}
LzSprite.prototype.__discardElement=function($1){
if(LzSprite.prototype.quirks.ie_leak_prevention){
if($1.owner){
$1.owner=null
}
var $2=document.getElementById("__LZIELeakGarbageBin")
if(!$2){
$2=document.createElement("DIV")
$2.id="__LZIELeakGarbageBin"
$2.style.display="none"
document.body.appendChild($2)
}
$2.appendChild($1)
$2.innerHTML=""
}else{
if($1.parentNode){
$1.parentNode.removeChild($1)
}
}
}
LzSprite.prototype.getZ=function(){
return this.__z
}
LzSprite.prototype.updateResourceSize=function(){
this.owner.resourceload({width:this.resourceWidth,height:this.resourceHeight,resource:this.resource,skiponload:true})
}
LzSprite.prototype.unload=function(){
if(this.__ImgPool){
this.__ImgPool.destroy()
this.__ImgPool=null
}
if(this.__LZimg){
this.__discardElement(this.__LZimg)
}
this.__LZimg=null
}
LzSprite.prototype.__setCSSClassProperty=function($1,$2,$3){
var $4=document.all?"rules":"cssRules"
var $5=document.styleSheets
var $6=$5.length-1
for(var $7=$6;$7>=0;$7--){
var $8=$5[$7][$4]
var $9=$8.length-1
for(var $10=$9;$10>=0;$10--){
if($8[$10].selectorText==$1){
$8[$10].style[$2]=$3
}
}
}
}
LzSprite.prototype.setDefaultContextMenu=function($1){
LzMouseKernel.__defaultcontextmenu=$1
}
LzSprite.prototype.setContextMenu=function($1){
this.__contextmenu=$1
}
LzSprite.prototype.getContextMenu=function(){
return this.__contextmenu
}
if(LzSprite.prototype.quirks.ie_leak_prevention){
LzSprite.prototype.__sprites={}
function __cleanUpForIE(){
var $1=LzTextSprite.prototype._sizedomcache
var $2=LzSprite.prototype.__discardElement
for(var $3 in $1){
$2($1[$3])
}
LzTextSprite.prototype._sizedomcache=null
var $1=LzSprite.prototype.__sprites
for(var $3 in $1){
$1[$3].destroy()
$1[$3]=null
}
LzSprite.prototype.__sprites=null
document.onmousemove=null
document.onmousedown=null
document.onmouseup=null
document.oncontextmenu=null
document.onkeydown=null
document.onkeyup=null
document.onkeypress=null
document.onmousewheel=null
window.onresize=null
window.onunload=null
}
window.onbeforeunload=__cleanUpForIE
}
var LzLibrary=Class.make("LzLibrary",LzNode,{construct:function($1,$2){
this.stage=$2.stage;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this.sprite=new LzSprite(this,false,$2)
LzLibrary.libraries[$2.name]=this
},init:function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).apply(this,arguments)
if(this.stage=="late"){
this.load()
}
},loaded:false,loading:false,toString:function(){
return "Library "+this.href+" named "+this.name
},load:function(){
Lz.__dhtmlLoadLibrary(this.href)
}},{tagname:"import",libraries:[],findLibrary:function($1){
return LzLibrary.libraries[$1]
},__LZsnippetLoaded:function($1){
var $2=null
var $3=LzLibrary.libraries
for(var $4 in $3){
if($3[$4].href==$1){
$2=$3[$4].name
break
}
}
if($2==null){
Debug.error("could not find library with href",$1)
}
LzInstantiateView({attrs:{libname:$2},name:"__libraryloadercomplete"},1)
canvas.initDone()
}});(function(){
with(LzLibrary){
with(LzLibrary.prototype){
DeclareEvent(prototype,"onload")
}
}
})()
var LzTextSprite=function($1){
if($1==null){
return
}
this.__LZdiv=document.createElement("div")
this.__LZdiv.className="lzdiv"
this.__LZtextdiv=document.createElement("div")
this.__LZtextdiv.className="lzdiv"
this.__LZdiv.appendChild(this.__LZtextdiv)
if(this.quirks.emulate_flash_font_metrics){
this.__LZdiv.className="lzswftext"
}else{
this.__LZdiv.className="lztext"
}
this.__LZdiv.owner=this
if(this.quirks.fix_clickable){
this.__LZclickdiv=document.createElement("div")
this.__LZclickdiv.className="lzdiv"
this.__LZclickdiv.owner=this
}
this.owner=$1
this.uid=LzSprite.prototype.uid++
if(this.quirks.ie_leak_prevention){
this.__sprites[this.uid]=this
}
}
LzTextSprite.prototype=new LzSprite(null)
LzTextSprite.prototype.__initTextProperties=function($1){
this.setFontName($1.font)
this.setFontStyle($1.fontstyle)
this.setFontSize($1.fontsize)
this.text=$1.text
}
LzTextSprite.prototype._fontStyle="normal"
LzTextSprite.prototype._fontWeight="normal"
LzTextSprite.prototype._fontSize="11px"
LzTextSprite.prototype._fontFamily="Verdana,Vera,sans-serif"
LzTextSprite.prototype._whiteSpace="normal"
LzTextSprite.prototype.__wpadding=4
LzTextSprite.prototype.__hpadding=4
LzTextSprite.prototype.__sizecacheupperbound=1000
LzTextSprite.prototype.setFontSize=function($1){
if($1==null||$1<0){
return
}
$1=this.CSSDimension($1)
if(this._fontSize!=$1){
this._fontSize=$1
this.__LZdiv.style.fontSize=$1
this._styledirty=true
}
}
LzTextSprite.prototype.setFontStyle=function($1){
var $2
if($1=="plain"){
$2="normal"
$1="normal"
}else{
if($1=="bold"){
$2="bold"
$1="normal"
}else{
if($1=="italic"){
$2="normal"
$1="italic"
}else{
if($1=="bold italic"||$1=="bolditalic"){
$2="bold"
$1="italic"
}
}
}
}
if($2!=this._fontWeight){
this._fontWeight=$2
this.__LZdiv.style.fontWeight=$2
this._styledirty=true
}
if($1!=this._fontStyle){
this._fontStyle=$1
this.__LZdiv.style.fontStyle=$1
this._styledirty=true
}
}
LzTextSprite.prototype.setFontName=function($1){
if($1!=this._fontFamily){
this._fontFamily=$1
this.__LZdiv.style.fontFamily=$1
this._styledirty=true
}
}
LzTextSprite.prototype.setTextColor=LzSprite.prototype.setColor
LzTextSprite.prototype.setText=function($1,$2){
if($1=="null"){
$1=""
}
if($2!=true&&this.text==$1){
return
}
this.text=$1
if(this.multiline&&$1&&$1.indexOf("\n")>=0){
if(this.quirks["inner_html_strips_newlines"]){
$1=$1.replace(this.inner_html_strips_newlines_re,"<br />")
}
}else{
if(this._whiteSpace!="normal"){
this._whiteSpace="normal"
this.__LZdiv.style.whiteSpace="normal"
this._styledirty=true
}
}
if($1&&this.quirks["inner_html_no_entity_apos"]){
$1=$1.replace(RegExp("&apos;","mg"),"&#39;")
}
this.__LZtextdiv.innerHTML=$1
this.fieldHeight=null
}
LzTextSprite.prototype.setMultiline=function($1){
$1=$1==true
if(this.multiline==$1){
return
}
this.multiline=$1
if($1){
if(this._whiteSpace!="normal"){
this._whiteSpace="normal"
this.__LZdiv.style.whiteSpace="normal"
this._styledirty=true
}
this.__LZdiv.style.overflow="visible"
}else{
if(this._whiteSpace!="nowrap"){
this._whiteSpace="nowrap"
this.__LZdiv.style.whiteSpace="nowrap"
this._styledirty=true
}
this.__LZdiv.style.overflow="hidden"
}
this.setText(this.text,true)
}
LzTextSprite.prototype.setPattern=function($1){

}
LzTextSprite.prototype.getTextWidth=function(){
if(this.text==null||this.text==""){
return 0
}
return this.getTextSize(this.text,this.resize).width
}
LzTextSprite.prototype.getTextHeight=function(){
if(this.__LZdiv){
return this.getHeight()
}else{
return 0
}
}
LzTextSprite.prototype.getTextfieldHeight=function(){
if(this._styledirty!=true&&this.fieldHeight!=null){
return this.fieldHeight
}
if(this.text==null||this.text==""){
this.fieldHeight=this.getTextSize("Yq_gy").height
return this.fieldHeight
}
if(this.multiline){
var $1=false
if(this.height){
$1=this.__LZdiv.style.height
this.__LZdiv.style.height="auto"
}
var $2=this.__LZdiv.clientHeight
if($2==0||$2==null){
$2=this.getTextSize(this.text).height
if($2>0&&this.quirks.emulate_flash_font_metrics){
$2+=this.__hpadding
}
}else{
if($2==2){
$2=this.getTextSize(this.text).height
}
if($2>0&&this.quirks.emulate_flash_font_metrics){
$2+=this.__hpadding
}
this.fieldHeight=$2
}
if(this.height){
this.__LZdiv.style.height=$1
}
}else{
var $2=this.getTextSize("Yq_gy").height
if($2!=0){
this.fieldHeight=$2
}
}
return $2
}
LzTextSprite.prototype._sizecache={counter:0}
if(LzSprite.prototype.quirks.ie_leak_prevention){
LzTextSprite.prototype._sizedomcache={}
}
LzTextSprite.prototype._styledirty=true
LzTextSprite.prototype.getTextSize=function($1,$2){
if(this._styledirty!=true){
var $3=this._stylecache
}else{
var $3="position: absolute"
$3+=";visibility: hidden"
$3+=";top: 4000px"
$3+=";font-size: "+this._fontSize
$3+=";font-style: "+this._fontStyle
$3+=";font-weight: "+this._fontWeight
$3+=";font-family: "+this._fontFamily
if(this.multiline&&$2!=true){
if(this.width){
$3+=";width: "+this.width+"px"
}
}
if(document.all&&document.body.insertAdjacentHTML){
if(this.__LzInputDiv!=null){
$3+=";white-space: pre"
}else{
$3+=";white-space: "+this._whiteSpace
}
}else{
if(document.getElementById&&document.createElement){
if(this.__LzInputDiv!=null){
$3+=";white-space: pre"
}else{
$3+=";white-space: "+this._whiteSpace
}
}
}
this._stylecache=$3
this._styledirty=false
}
if(this._sizecache.counter>this.__sizecacheupperbound){
this._sizecache={counter:0}
}
if(this._sizecache[$3]==null){
this._sizecache[$3]={}
}
var $4=this._sizecache[$3]
if(!$4[$1]){
var $5={}
if(document.all&&document.body.insertAdjacentHTML){
if(this.multiline&&$1&&this.quirks["inner_html_strips_newlines"]){
$1=$1.replace(this.inner_html_strips_newlines_re,"<br />")
}
var $6="span"
var $7=$4[$6]
if($7==null){
var $8="<"+$6+' id="testSpan'+this._sizecache.counter+'"'
$8+=' style="'+$3+'">'
$8+=$1
$8+="</"+$6+">"
document.body.insertAdjacentHTML("beforeEnd",$8)
$7=document.all["testSpan"+this._sizecache.counter]
$4[$6]=$7
}
}else{
if(document.getElementById&&document.createElement){
if(this.__LzInputDiv==null){
if(this.multiline&&$1&&this.quirks["inner_html_strips_newlines"]){
$1=$1.replace(this.inner_html_strips_newlines_re,"<br />")
}
}
var $6=this.multiline?"div":"span"
var $7=$4[$6]
if($7==null){
$7=document.createElement($6)
Lz.__setAttr($7,"style",$3)
document.body.appendChild($7)
$4[$6]=$7
}
}
}
if(this.quirks.ie_leak_prevention){
LzTextSprite.prototype._sizedomcache[$6+$3]=$7
}
$7.innerHTML=$1
$7.style.display="block"
$5.width=$7.offsetWidth
$5.height=$7.offsetHeight
$7.style.display="none"
if(this.quirks.emulate_flash_font_metrics){
$5.height=Math.floor($5.height*1.0000002)+(this.multiline?0:this.__hpadding)
$5.width=$5.width+(this.multiline?0:this.__wpadding)
if(this._whiteSpace=="normal"){
if(this.multiline){
$5.width+=this.__wpadding
}
}
}
$4[$1]=$5
this._sizecache.counter++
}
return $4[$1]
}
LzTextSprite.prototype.setSelectable=function($1){
if($1){
this.__LZdiv.onselectstart=null
this.__LZdiv.style["MozUserSelect"]="normal"
this.__LZdiv.style["KHTMLUserSelect"]="normal"
this.__LZdiv.style["UserSelect"]="normal"
}else{
this.__LZdiv.onselectstart=LzTextSprite.prototype.__cancelhandler
this.__LZdiv.style["MozUserSelect"]="none"
this.__LZdiv.style["KHTMLUserSelect"]="none"
this.__LZdiv.style["UserSelect"]="none"
}
}
LzTextSprite.prototype.__cancelhandler=function(){
return false
}
LzTextSprite.prototype.setResize=function($1){
this.resize=$1==true
}
LzTextSprite.prototype.setSelection=function($1,$2){

}
LzTextSprite.prototype.getSelectionPosition=function(){

}
LzTextSprite.prototype.getSelectionSize=function(){

}
LzTextSprite.prototype.getScroll=function(){

}
LzTextSprite.prototype.getMaxScroll=function(){

}
LzTextSprite.prototype.setScroll=function(){

}
LzTextSprite.prototype.__setWidth=LzSprite.prototype.setWidth
LzTextSprite.prototype.setWidth=function($1){
if($1==null||$1<0||isNaN($1)||this.width==$1){
return
}
var $2=this.CSSDimension($1>=this.__wpadding?$1-this.__wpadding:0)
this.__LZtextdiv.style.width=$2
this.__LZtextdiv.style.clip="rect(0px "+$2+" "+this.CSSDimension(this.height>=this.__hpadding?this.height-this.__hpadding:0)+" 0px)"
this.__setWidth($1)
this._styledirty=true
}
LzTextSprite.prototype.__setHeight=LzSprite.prototype.setHeight
LzTextSprite.prototype.setHeight=function($1){
if($1==null||$1<0||isNaN($1)||this.height==$1){
return
}
var $2=this.CSSDimension($1>=this.__hpadding?$1-this.__hpadding:0)
this.__LZtextdiv.style.height=$2
this.__LZtextdiv.style.clip="rect(0px "+this.CSSDimension(this.width>=this.__wpadding?this.width-this.__wpadding:0)+" "+$2+" 0px)"
this.__setHeight($1)
if(this.multiline){
this._styledirty=true
}
}
document.onselectstart=function(){
return false
}
document.ondrag=function(){
return false
}
var LzInputTextSprite=function($1){
if($1==null){
return
}
this.__LZdiv=document.createElement("div")
this.__LZdiv.className="lzdiv"
this.__LZdiv.owner=this
if(this.quirks.fix_clickable){
this.__LZclickdiv=document.createElement("div")
this.__LZclickdiv.className="lzdiv"
this.__LZclickdiv.owner=this
}
this.owner=$1
this.uid=LzSprite.prototype.uid++
if(this.quirks.ie_leak_prevention){
this.__sprites[this.uid]=this
}
this.__createInputText()
}
LzInputTextSprite.prototype=new LzTextSprite(null)
LzInputTextSprite.prototype.____hpadding=2
LzInputTextSprite.prototype.____wpadding=2
LzInputTextSprite.prototype.__createInputText=function($1){
if(this.__LzInputDiv){
return
}
if(this.owner&&this.owner.password){
this.__LzInputDiv=document.createElement("input")
Lz.__setAttr(this.__LzInputDiv,"type","password")
}else{
if(this.owner&&this.owner.multiline){
this.__LzInputDiv=document.createElement("textarea")
}else{
this.__LzInputDiv=document.createElement("input")
Lz.__setAttr(this.__LzInputDiv,"type","text")
}
}
if(this.quirks.firefox_autocomplete_bug){
Lz.__setAttr(this.__LzInputDiv,"autocomplete","off")
}
this.__LzInputDiv.owner=this
if(this.quirks.emulate_flash_font_metrics){
if(this.owner&&this.owner.multiline){
this.__LzInputDiv.className="lzswfinputtextmultiline"
}else{
this.____hpadding=1
this.__LzInputDiv.className="lzswfinputtext"
}
}else{
this.__LzInputDiv.className="lzinputtext"
}
if(this.owner){
Lz.__setAttr(this.__LzInputDiv,"name",this.owner.name)
}
if($1==null){
$1=""
}
Lz.__setAttr(this.__LzInputDiv,"value",$1)
if(this.quirks.fix_clickable){
if(this.quirks.fix_ie_clickable){
this.__LZinputclickdiv=document.createElement("img")
this.__LZinputclickdiv.src=LzSprite.prototype.blankimage
}else{
this.__LZinputclickdiv=document.createElement("div")
}
this.__LZinputclickdiv.className="lzclickdiv"
this.__LZinputclickdiv.owner=this
this.__LZinputclickdiv.onmouseover=function(){
this.owner.__show()
}
this.__LZclickdiv.appendChild(this.__LZinputclickdiv)
}
this.__LZdiv.appendChild(this.__LzInputDiv)
this.__setTextEvents(true)
}
LzInputTextSprite.prototype.__show=function(){
if(this.__shown==true||this.disabled==true){
return
}
this.__hideIfNotFocused()
LzInputTextSprite.prototype.__lastshown=this
this.__shown=true
this.__LzInputDiv=this.__LZdiv.removeChild(this.__LzInputDiv)
if(this.quirks["inputtext_parents_cannot_contain_clip"]){
var $1=this.__findParents("clip")
var $2=$1.length
if($2>1){
if(this._shownclipvals==null){
this._shownclipvals=[]
this._shownclippedsprites=$1
for(var $3=0;$3<$2;$3++){
var $4=$1[$3]
this._shownclipvals[$3]=$4.__LZclickdiv.style.clip
$4.__LZclickdiv.style.clip="rect(auto auto auto auto)"
}
}
}
}
if(this.quirks.fix_ie_clickable){
this.__LZclickdiv.appendChild(this.__LzInputDiv)
this.__setCSSClassProperty(".lzclickdiv","display","none")
}else{
this.__LZinputclickdiv.appendChild(this.__LzInputDiv)
}
}
LzInputTextSprite.prototype.__hideIfNotFocused=function(){
if(LzInputTextSprite.prototype.__lastshown==null){
return
}
if(LzInputTextSprite.prototype.__focusedSprite!=LzInputTextSprite.prototype.__lastshown){
LzInputTextSprite.prototype.__lastshown.__hide()
}
}
LzInputTextSprite.prototype.__hide=function(){
if(this.__shown!=true||this.disabled==true){
return
}
LzInputTextSprite.prototype.__lastshown=null
this.__shown=false
if(this.quirks["inputtext_parents_cannot_contain_clip"]){
if(this._shownclipvals!=null){
for(var $1=0;$1<this._shownclipvals.length;$1++){
var $2=this._shownclippedsprites[$1]
$2.__LZclickdiv.style.clip=this._shownclipvals[$1]
}
this._shownclipvals=null
this._shownclippedsprites=null
}
}
if(this.quirks.fix_ie_clickable){
this.__setCSSClassProperty(".lzclickdiv","display","")
this.__LzInputDiv=this.__LZclickdiv.removeChild(this.__LzInputDiv)
}else{
this.__LzInputDiv=this.__LZinputclickdiv.removeChild(this.__LzInputDiv)
}
this.__LZdiv.appendChild(this.__LzInputDiv)
}
LzInputTextSprite.prototype.gotBlur=function(){
if(LzInputTextSprite.prototype.__focusedSprite!=this){
return
}
this.deselect()
}
LzInputTextSprite.prototype.gotFocus=function(){
if(LzInputTextSprite.prototype.__focusedSprite==this){
return
}
this.select()
}
LzInputTextSprite.prototype.setText=function($1){
if($1==null){
return
}
this.text=$1
this.__createInputText($1)
this.__LzInputDiv.value=$1
}
LzInputTextSprite.prototype.__setTextEvents=function($1){
if($1){
this.__LzInputDiv.onblur=function($1){
this.owner.__textEvent($1,"onblur")
}
this.__LzInputDiv.onmousedown=function($1){
this.owner.__textEvent($1,"onmousedown")
}
this.__LzInputDiv.onfocus=function($1){
this.owner.__textEvent($1,"onfocus")
}
this.__LzInputDiv.onclick=function($1){
this.owner.__textEvent($1,"onclick")
}
this.__LzInputDiv.onkeyup=function($1){
this.owner.__textEvent($1,"onkeyup")
}
this.__LzInputDiv.onkeydown=function($1){
this.owner.__textEvent($1,"onkeydown")
}
this.__LzInputDiv.onselect=function($1){
this.owner.__textEvent($1,"onselect")
}
this.__LzInputDiv.onchange=function($1){
this.owner.__textEvent($1,"onchange")
}
}else{
this.__LzInputDiv.onblur=null
this.__LzInputDiv.onmousedown=null
this.__LzInputDiv.onfocus=null
this.__LzInputDiv.onclick=null
this.__LzInputDiv.onkeyup=null
this.__LzInputDiv.onkeydown=null
this.__LzInputDiv.onselect=null
this.__LzInputDiv.onchange=null
}
}
LzInputTextSprite.prototype.__textEvent=function($1,$2){
if(this.destroyed==true){
return
}
var $3=$1?$1.keyCode:event.keyCode
if($2=="onfocus"||$2=="onmousedown"){
LzInputTextSprite.prototype.__focusedSprite=this
this.__show()
if($2=="onfocus"&&this._cancelfocus){
this._cancelfocus=false
return
}
if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=false
}
}else{
if($2=="onblur"){
if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=true
}
if(LzInputTextSprite.prototype.__focusedSprite==this){
LzInputTextSprite.prototype.__focusedSprite=null
}
this.__hide()
if(this._cancelblur){
this._cancelblur=false
return
}
}
}
if(this.owner){
this.owner.inputtextevent($2,$3)
if($2=="onkeydown"||$2=="onkeyup"){
var $4=this.__LzInputDiv.value
if($4!=this.text){
this.text=$4
this.owner.inputtextevent("onchange",$4)
}
}
}
}
LzInputTextSprite.prototype.setEnabled=function($1){
this.disabled=!$1
this.__LzInputDiv.disabled=this.disabled
}
LzInputTextSprite.prototype.setMaxLength=function($1){
if($1==null){
return
}
this.__LzInputDiv.maxLength=$1
}
LzInputTextSprite.prototype.select=function($1,$2){
this._cancelblur=true
this.__show()
this.__LzInputDiv.focus()
LzInputTextSprite.__lastfocus=this
setTimeout("LzInputTextSprite.__lastfocus.__LzInputDiv.select()",50)
if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=false
}
}
LzInputTextSprite.prototype.setSelection=LzInputTextSprite.prototype.select
LzInputTextSprite.prototype.deselect=function(){
this._cancelfocus=true
this.__hide()
if(this.__LzInputDiv&&this.__LzInputDiv.blur){
this.__LzInputDiv.blur()
}
if(window["LzKeyboardKernel"]){
LzKeyboardKernel.__cancelKeys=true
}
}
LzInputTextSprite.prototype.__fontStyle="normal"
LzInputTextSprite.prototype.__fontWeight="normal"
LzInputTextSprite.prototype.__fontSize="11px"
LzInputTextSprite.prototype.__fontFamily="Verdana,Vera,sans-serif"
LzInputTextSprite.prototype.__setFontSize=LzTextSprite.prototype.setFontSize
LzInputTextSprite.prototype.setFontSize=function($1){
this.__setFontSize($1)
if(this.__fontSize!=this._fontSize){
this.__fontSize=this._fontSize
this.__LzInputDiv.style.fontSize=this._fontSize
}
}
LzInputTextSprite.prototype.__setFontStyle=LzTextSprite.prototype.setFontStyle
LzInputTextSprite.prototype.setFontStyle=function($1){
this.__setFontStyle($1)
if(this.__fontStyle!=this._fontStyle){
this.__fontStyle=this._fontStyle
this.__LzInputDiv.style.fontStyle=this._fontStyle
}
if(this.__fontWeight!=this._fontWeight){
this.__fontWeight=this._fontWeight
this.__LzInputDiv.style.fontWeight=this._fontWeight
}
}
LzInputTextSprite.prototype.__setFontName=LzTextSprite.prototype.setFontName
LzInputTextSprite.prototype.setFontName=function($1){
this.__setFontName($1)
if(this.__fontFamily!=this._fontFamily){
this.__fontFamily=this._fontFamily
this.__LzInputDiv.style.fontFamily=this._fontFamily
}
}
LzInputTextSprite.prototype.setWidth=function($1){
if($1==null||$1<0||isNaN($1)||this.width==$1){
return
}
this.__setWidth($1-this.____wpadding)
if(this.quirks.fix_clickable){
var $1=this.CSSDimension(this.width)
this.__LZclickdiv.style.width=$1
this.__LZinputclickdiv.style.width=$1
}
}
LzInputTextSprite.prototype.setHeight=function($1){
if($1==null||$1<0||isNaN($1)||this.height==$1){
return
}
this.__setHeight($1)
if(this.quirks.fix_clickable){
var $1=this.CSSDimension(this.height)
this.__LZclickdiv.style.height=$1
this.__LZinputclickdiv.style.height=$1
if(this.multiline&&this.quirks.set_height_for_multiline_inputtext){
this.__LzInputDiv.style.height=this.CSSDimension(this.height-this.____hpadding*2)
}
}
}
LzInputTextSprite.prototype.setColor=function($1){
if(this.color==$1){
return
}
this.color=$1
this.__LzInputDiv.style.color=LzUtils.color.inttohex($1)
}
LzInputTextSprite.prototype.getText=function(){
return this.__LzInputDiv.value
}
LzInputTextSprite.prototype.getTextfieldHeight=function(){
if(this.fieldHeight!=null){
return this.fieldHeight
}
if(this.text==null||this.text==""){
var $1=true
this.text="YgjyZT;:"
}
if(this.multiline){
var $2=false
if(this.height){
$2=this.__LzInputDiv.style.height
this.__LzInputDiv.style.height="auto"
}
var $3=this.__LzInputDiv.scrollHeight
if($3==0||$3==null){
$3=this.getTextSize(this.text).height
}else{
if(this.quirks["safari_textarea_subtract_scrollbar_height"]){
$3+=24
}
this.fieldHeight=$3
}
if(this.height){
this.__LzInputDiv.style.height=$2
}
}else{
var $3=this.getTextSize(this.text).height
if($3!=0){
this.fieldHeight=$3
}
}
if(this.quirks.emulate_flash_font_metrics){
$3+=4
}
if($1){
this.text=""
}
return $3
}
var LzXMLParser=new Object()
LzXMLParser.parseXML=function($1,$2,$3){
var $4=new DOMParser()
var $5=$4.parseFromString($1,"text/xml")
return $5.childNodes[0]
}
if(typeof DOMParser=="undefined"){
var DOMParser=function(){

}
DOMParser.prototype.parseFromString=function($1,$2){
if(typeof window.ActiveXObject!="undefined"){
var $3=new ActiveXObject("MSXML.DomDocument")
$3.loadXML($1)
return $3
}else{
if(typeof XMLHttpRequest!="undefined"){
var $4=new XMLHttpRequest()
$4.open("GET","data:"+($2||"application/xml")+";charset=utf-8,"+encodeURIComponent($1),false)
if($4.overrideMimeType){
$4.overrideMimeType($2)
}
$4.send(null)
return $4.responseXML
}
}
}
}
var LzXMLTranslator=new Object()
LzXMLTranslator.copyXML=function($1,$2,$3){
var $4=LzXMLTranslator.copyBrowserXML($1,true,$2,$3)
return $4
}
LzXMLTranslator.whitespacePat=new RegExp("^[\t\n\r ]*$")
LzXMLTranslator.stringTrimPat=new RegExp("(^[\t\n\r ]*|[\t\n\r ]*$)","g")
LzXMLTranslator.slashPat=new RegExp("/","g")
LzXMLTranslator.copyBrowserXML=function($1,$2,$3,$4){
if(!$1){
return $1
}
var $5=$1.nodeValue
var $6=null
if($1.nodeType==3||$1.nodeType==4){
if($2&&LzXMLTranslator.whitespacePat.test($5)){
return null
}
if($3){
var $7=$5
$5=$5.replace(LzXMLTranslator.stringTrimPat,"")
}
$6=new LzDataText($5)
return $6
}else{
if($1.nodeType==1||$1.nodeType==9){
var $8=$1.attributes
var $9={}
if($8){
for(var $10=0;$10<$8.length;$10++){
var $11=$8.item($10)
if($11){
var $12=$11.name
var $13=$11.value
var $14=$12
if(!$4){
var $15=$12.indexOf(":")
if($15>=0){
$14=$12.substring($15+1)
}
}
$9[$14]=$13
}
}
}
var $16=$1.nodeName
if($16&&!$4){
var $17=$16.indexOf(":")
if($17>=0){
$16=$16.substring($17+1)
}
}
$6=new LzDataElement($16,$9)
var $18=$1.childNodes
var $19=[]
for(var $20=0;$20<$18.length;$20++){
var $21=$18[$20]
var $22=LzXMLTranslator.copyBrowserXML($21,$2,$3,$4)
if($22!=null){
$19.push($22)
}
}
$6.setChildNodes($19)
return $6
}else{
return null
}
}
}
var LzHTTPLoader=function($1,$2){
this.owner=$1
this.options={parsexml:true}
this.requestheaders={}
this.requestmethod=LzHTTPLoader.GET_METHOD
}
LzHTTPLoader.prototype.loadSuccess=function($1,$2){

}
LzHTTPLoader.prototype.loadError=function($1,$2){

}
LzHTTPLoader.prototype.loadTimeout=function($1,$2){

}
LzHTTPLoader.prototype.getResponse=function(){
return this.responseText
}
LzHTTPLoader.prototype.getResponseStatus=function(){

}
LzHTTPLoader.prototype.getResponseHeaders=function(){
return this.req.getAllResponseHeaders()
}
LzHTTPLoader.prototype.setRequestHeaders=function($1){
this.requestheaders=$1
}
LzHTTPLoader.prototype.setRequestHeader=function($1,$2){
this.requestheaders[$1]=$2
}
LzHTTPLoader.prototype.abort=function(){
if(this.req){
this.req.cancel()
}
}
LzHTTPLoader.prototype.setOption=function($1,$2){
this.options[$1]=$2
}
LzHTTPLoader.prototype.setProxied=function($1){
this.setOption("proxied",$1)
}
LzHTTPLoader.prototype.setQueryParams=function($1){
this.queryparams=$1
}
LzHTTPLoader.prototype.setQueryString=function($1){
this.querystring=$1
}
LzHTTPLoader.prototype.setQueueing=function($1){
this.setOption("queuing",$1)
}
LzHTTPLoader.prototype.getResponseHeader=function($1){
return this.req.getResponseHeader($1)
}
LzHTTPLoader.GET_METHOD="GET"
LzHTTPLoader.POST_METHOD="POST"
LzHTTPLoader.PUT_METHOD="PUT"
LzHTTPLoader.DELETE_METHOD="DELETE"
LzHTTPLoader.prototype.open=function($1,$2,$3,$4){
this.req=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP")
this.requesturl=$2
this.requestmethod=$1
}
LzHTTPLoader.prototype.makeProxiedURL=function($1,$2,$3,$4){
var $5=LzBrowser.getBaseURL()
var $6={lzt:$3!=null?$3:"xmldata",reqtype:$2,sendheaders:this.options.sendheaders,trimwhitespace:this.options.trimwhitespace,nsprefix:this.options.nsprefix,url:LzBrowser.toAbsoluteURL($1,this.secure),timeout:this.timeout,cache:this.options.cacheable,ccache:this.options.ccache}
var $7
var $8=""
if($4!=null){
for($7 in $4){
$8+=$7+": "+$4[$7]+"\n"
}
}
if($8!=""){
$6["headers"]=$8
}
if(!this.options.ccache){
$6.__lzbc__=new Date().getTime()
}
$5+="?"
var $9=""
for(var $10 in $6){
var $11=$6[$10]
if(typeof $11=="string"){
$11=encodeURIComponent($11)
$11=$11.replace(LzDataset.slashPat,"%2F")
}
$5+=$9+$10+"="+$11
$9="&"
}
return $5
}
LzHTTPLoader.prototype.send=function($1){
this.loadXMLDoc(this.requestmethod,this.requesturl,this.requestheaders,$1,true,true)
}
LzHTTPLoader.activeRequests=[]
LzHTTPLoader.prototype.timeout=Infinity
LzHTTPLoader.prototype.setTimeout=function($1){
this.timeout=$1
}
LzHTTPLoader.prototype.setupTimeout=function($1,$2){
var $3=new Date().getTime()+$2
LzHTTPLoader.activeRequests.push($1,$3)
setTimeout("LzHTTPLoader.__LZcheckXMLHTTPTimeouts()",$2)
}
LzHTTPLoader.prototype.removeTimeout=function($1){
var $2=LzHTTPLoader.activeRequests
LzHTTPLoader.activeRequests=[]
for(var $3=0;$3<$2.length;$3+=2){
var $4=$2[$3]
var $5=$2[$3+1]
if($4!=$1){
LzHTTPLoader.activeRequests.push($4,$5)
}
}
}
LzHTTPLoader.__LZcheckXMLHTTPTimeouts=function(){
var $1=LzHTTPLoader.activeRequests
LzHTTPLoader.activeRequests=[]
for(var $2=0;$2<$1.length;$2+=2){
var $3=$1[$2]
var $4=$1[$2+1]
var $5=new Date().getTime()
if($5>$4){
if($3.req){
$3.req.abort()
}
this.req=null
$3.loadTimeout($3,null)
}else{
LzHTTPLoader.activeRequests.push($3,$4)
}
}
}
LzHTTPLoader.prototype.getElapsedTime=function(){
return new Date().getTime()-this.gstart
}
LzHTTPLoader.prototype.__setRequestHeaders=function($1,$2){
if($2!=null){
for(var $3 in $2){
var $4=$2[$3]
$1.setRequestHeader($3,$4)
}
}
}
LzHTTPLoader.prototype.loadXMLDoc=function($1,$2,$3,$4,$5,parsexml){
if(this.req){
var __pthis__=this
this.req.onreadystatechange=function(){
if(__pthis__.req==null){
return
}
if(__pthis__.req.readyState==4){
if(__pthis__.req.status==200||__pthis__.req.status==304){
var $1=null
var $2=__pthis__.req.responseXML
__pthis__.responseXML=$2
var $3=null
if($2!=null&&parsexml){
var $4=__pthis__.req.responseXML.childNodes
for(var $5=0;$5<$4.length;$5++){
var $6=$4.item($5)
if($6.nodeType==1){
$1=$6
break
}
}
$3=LzXMLTranslator.copyXML($1,__pthis__.options.trimwhitespace,__pthis__.options.nsprefix)
}
__pthis__.responseText=__pthis__.req.responseText
__pthis__.removeTimeout(__pthis__)
__pthis__.req=null
__pthis__.loadSuccess(__pthis__,$3)
}else{
__pthis__.req=null
__pthis__.loadError(__pthis__,null)
}
}
}
this.req.open($1,$2,true)
if($1=="POST"&&$3["content-type"]==null){
$3["content-type"]="application/x-www-form-urlencoded"
}
this.__setRequestHeaders(this.req,$3)
this.req.send($4)
}
this.setupTimeout(this,this.timeout)
}
var LzScreenKernel={width:null,height:null,__resizeEvent:function(){
if(window.top.innerHeight){
var $1=window.top.document.body
LzScreenKernel.width=$1.scrollWidth
LzScreenKernel.height=$1.scrollHeight
}else{
if(window.top.document.documentElement&&window.top.document.documentElement.clientHeight){
var $1=window.top.document.documentElement
LzScreenKernel.width=$1.scrollWidth
LzScreenKernel.height=$1.scrollHeight
}else{
if(window.top.document.body){
var $1=window.top.document.body
LzScreenKernel.width=window.top.document.body.scrollWidth
LzScreenKernel.height=window.top.document.body.clientHeight
}
}
}
if(LzScreenKernel.__callback){
LzScreenKernel.__scope[LzScreenKernel.__callback]({width:LzScreenKernel.width,height:LzScreenKernel.height})
}
},__init:function(){
window.onresize=LzScreenKernel.__resizeEvent
},__callback:null,__scope:null,setCallback:function($1,$2){
this.__scope=$1
this.__callback=$2
this.__init()
this.__resizeEvent()
}}
var LzContextMenu=Class.make("LzContextMenu",LzNode,{initialize:function($1){
this.__LZmousedowndel=new LzDelegate(this,"__hide")
this.items=[]
this.setDelegate($1)
},showbuiltins:false,setDelegate:function($1){
this._delegate=$1
},addItem:function($1){
this.items.push($1)
},__show:function(){
var $1=document.getElementById("lzcontextmenu")
if(!$1){
$1=document.createElement("div")
Lz.__setAttr($1,"id","lzcontextmenu")
Lz.__setAttr($1,"style","display: none")
document.body.appendChild($1)
}
if(this.onmenuopen.ready){
this.onmenuopen.sendEvent(this)
}
var $2=""
for(var $3=0;$3<this.items.length;$3++){
var $4=this.items[$3].cmenuitem
if($4.visible!=true){
continue
}
if($4.separatorBefore){
$2+="<br/>"
}
if($4.enabled){
$2+='<a onmousedown="javascript:LzMouseKernel.__showncontextmenu.__select('+$3+');return false;"'
$2+=">"+$4.caption+"</a>"
}else{
$2+=$4.caption
}
}
LzMouseKernel.__showncontextmenu=this
$1.innerHTML=$2
$1.style.left=LzMouseKernel.__x+"px"
$1.style.top=LzMouseKernel.__y+"px"
$1.style.display="block"
this.__LZmousedowndel.register(LzGlobalMouse,"onmousedown")
if(this._delegate!=null){
this._delegate.execute(this)
}
},__hide:function(){
var $1=document.getElementById("lzcontextmenu")
if(!$1){
return
}
$1.style.display="none"
this.__LZmousedowndel.unregisterAll()
},__select:function($1){
this.__hide()
if(this.items[$1]){
this.items[$1].__select()
}
},hideBuiltInItems:function(){
this.showbuiltins=false
},clearItems:function(){
this.items=[]
},getItems:function(){
return this.items
},makeMenuItem:function($1,$2){
var $3=new LzContextMenuItem($1,$2)
return $3
}},null);(function(){
with(LzContextMenu){
with(LzContextMenu.prototype){
DeclareEvent(prototype,"onmenuopen")
}
}
})()
var LzContextMenuItem=Class.make("LzContextMenuItem",LzNode,{initialize:function($1,$2){
this.cmenuitem={visible:true,enabled:true,separatorBefore:false,caption:$1}
this.setDelegate($2)
},setDelegate:function($1){
this._delegate=$1
},__select:function(){
if(this.onselect.ready){
this.onselect.sendEvent(this)
}
if(this._delegate!=null){
if(this._delegate instanceof LzDelegate){
this._delegate.execute(this)
}else{
if(typeof this._delegate=="function"){
this._delegate(this)
}else{

}
}
}
},setCaption:function($1){
this.cmenuitem.caption=$1
},setEnabled:function($1){
this.cmenuitem.enabled=$1
},setSeparatorBefore:function($1){
this.cmenuitem.separatorBefore=$1
},setVisible:function($1){
this.cmenuitem.visible=$1
}},null);(function(){
with(LzContextMenuItem){
with(LzContextMenuItem.prototype){
DeclareEvent(prototype,"onselect")
}
}
})()
var LzView=Class.make("LzView",LzNode,{DOUBLE_CLICK_TIME:500,capabilities:LzSprite.prototype.capabilities,construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1?$1:canvas,$2)
var $3=this.immediateparent
this.mask=$3.mask
this.__makeSprite($2)
if("width" in $2||"$refs" in $2&&"width" in $2.$refs&&$2.$refs.width){
this.hassetwidth=true
this.__LZcheckwidth=false
}
if("height" in $2||"$refs" in $2&&"height" in $2.$refs&&$2.$refs.height){
this.hassetheight=true
this.__LZcheckheight=false
}
var $4=null
if("resource" in $2&&$2["resource"]!=null){
$4=$2.resource
$2.resource=LzNode._ignoreAttribute
}
if("clip" in $2&&$2["clip"]){
if(this.sprite){
this.makeMasked()
}
}
if($2["stretches"]){
if(this.sprite){
this.stretchResource($2.stretches)
}
}
if($4!=null){
if(this.sprite){
this.setResource($4)
}
}
},spriteAttribute:function($1,$2){
if(this[$1]){
if(!this.__LZdeleted){
var $lzsc$716596955=this.setters
if($lzsc$716596955&&$1 in $lzsc$716596955){
this[$lzsc$716596955[$1]]($2)
}else{
this[$1]=$2
var $lzsc$1080520445="on"+$1
if($lzsc$1080520445 in this){
if(this[$lzsc$1080520445].ready){
this[$lzsc$1080520445].sendEvent($2)
}
}
}
}
}
},__makeSprite:function($1){
this.sprite=new LzSprite(this,false,$1)
},init:function(){
this.sprite.init(this.visible)
},addSubview:function($1){
this.sprite.addChildSprite($1.sprite)
if($1.addedToParent){
return
}
if(this.subviews.length==0){
this.subviews=[]
}
this.subviews.push($1)
$1.addedToParent=true
if(this.__LZcheckwidth){
this.__LZcheckwidthFunction($1)
}
if(this.__LZcheckheight){
this.__LZcheckheightFunction($1)
}
if(this.onaddsubview.ready){
this.onaddsubview.sendEvent($1)
}
},__LZinstantiationDone:function(){
this.immediateparent.addSubview(this);(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZinstantiationDone"]:this.nextMethod(arguments.callee,"__LZinstantiationDone")).apply(this,arguments)
},mask:null,focusable:false,focustrap:null,fontstyle:null,fontsize:null,sprite:null,visible:true,visibility:"collapse",__LZvizO:true,__LZvizDat:true,__LZvizLoad:true,opacity:1,bgcolor:null,x:0,y:0,rotation:0,width:0,height:0,unstretchedwidth:0,unstretchedheight:0,subviews:[],__LZclickregion:"LzMouseEvents",xoffset:0,yoffset:0,__LZrsin:0,__LZrcos:1,__LZcaloffset:false,_xscale:1,_yscale:1,totalframes:0,frame:0,loadperc:0,framesloadratio:0,loadratio:0,hassetheight:false,hassetwidth:false,__LZisView:true,addedToParent:null,checkPlayStatusDel:null,masked:false,pixellock:null,setButtonSize:null,clickable:false,showhandcursor:null,updatePlayDel:null,resource:null,resourcewidth:null,resourceheight:null,__LZbgColorO:null,__LZbgRef:null,__LZbuttonRef:null,__LZcheckwidth:true,__LZcheckheight:true,__LZhasoffset:null,__LZisBackgrounded:null,__LZmaskClip:null,__LZmovieClipRef:null,__LZoutlieheight:null,__LZoutliewidth:null,__LZsubUniqueNum:null,setLayout:function($1){
if(!this.isinited){
this.__LZstoreAttr($1,"layout")
return
}
var $2=$1["class"]
if($2==null){
$2="simplelayout"
}
if(this.__LZlayout){
this.__LZlayout.destroy()
}
if($2!="none"){
var $3={}
for(var $4 in $1){
if($4!="class"){
$3[$4]=$1[$4]
}
}
if($2=="null"){
this.__LZlayout=null
return
}
this.__LZlayout=new (ConstructorMap[$2])(this,$3)
}
},setFontName:function($1,$2){
this.fontname=$1
if(!this.sprite){
return
}
this.sprite.setFontName($1,$2)
},_setrescwidth:false,_setrescheight:false,searchSubviews:function($1,$2){
var $3=this.subviews.concat()
while($3.length>0){
var $4=$3
$3=new Array()
for(var $5=$4.length-1;$5>=0;$5--){
var $6=$4[$5]
if($6[$1]==$2){
return $6
}
var $7=$6.subviews
for(var $8=$7.length-1;$8>=0;$8--){
$3.push($7[$8])
}
}
}
return null
},searchimmediateparents:function($1){
return this.searchParents($1)
},layouts:null,releaseLayouts:function(){
if(this.layouts){
for(var $1=this.layouts.length-1;$1>=0;$1--){
this.layouts[$1].releaseLayout()
}
}
},setResource:function($1){
if($1==null||$1==this._resource){
return
}
if($1!="empty"){
this.sprite.setResource($1)
}
this.__LZhaser=$1=="empty"
this.resource=$1
if(this.onresource.ready){
this.onresource.sendEvent($1)
}
this._resource=this.resource
return this.sprite.__LZmovieClipRef
},resourceload:function($1){
if("resource" in $1){
this.resource=$1.resource
if(this.onresource.ready){
this.onresource.sendEvent($1.resource)
}
}
if(this.resourcewidth!=$1.width){
if("width" in $1){
this.resourcewidth=$1.width
if(this.onresourcewidth.ready){
this.onresourcewidth.sendEvent($1.width)
}
}
if(!this.hassetwidth&&this.resourcewidth!=this.width||this._setrescwidth&&this.unstretchedwidth!=this.resourcewidth){
this.updateWidth(this.resourcewidth)
}
}
if(this.resourceheight!=$1.height){
if("height" in $1){
this.resourceheight=$1.height
if(this.onresourceheight.ready){
this.onresourceheight.sendEvent($1.height)
}
}
if(!this.hassetheight&&this.resourceheight!=this.height||this._setrescheight&&this.unstretchedheight!=this.resourceheight){
this.updateHeight(this.resourceheight)
}
}
if($1.skiponload!=true){
if(this.onload.ready){
this.onload.sendEvent(this)
}
}
},resourceloaderror:function(){
this.resourcewidth=0
this.resourceheight=0
if(this.onresourcewidth.ready){
this.onresourcewidth.sendEvent(0)
}
if(this.onresourceheight.ready){
this.onresourceheight.sendEvent(0)
}
this.reevaluateSize()
if(this.onerror.ready){
this.onerror.sendEvent()
}
},resourceloadtimeout:function(){
this.resourcewidth=0
this.resourceheight=0
if(this.onresourcewidth.ready){
this.onresourcewidth.sendEvent(0)
}
if(this.onresourceheight.ready){
this.onresourceheight.sendEvent(0)
}
this.reevaluateSize()
if(this.ontimeout.ready){
this.ontimeout.sendEvent()
}
},setTotalFrames:function($1){
if($1!=null&&this.totalframes!=$1){
this.totalframes=$1
if(this.ontotalframes.ready){
this.ontotalframes.sendEvent(this.totalframes)
}
}
},destroy:function($1){
if(this.__LZdeleted){
return
}
if(this.sprite){
this.sprite.predestroy()
}
if(this.addedToParent){
var $2=this.immediateparent.subviews
if($2!=null){
for(var $3=$2.length-1;$3>=0;$3--){
if($2[$3]==this){
$2.splice($3,1)
break
}
}
}
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
if($1==true){
return
}
if(this.sprite){
this.sprite.destroy($1)
}
this.setVisibility("hidden")
if(this.addedToParent){
if("__LZoutliewidth" in this.immediateparent&&this.immediateparent.__LZoutliewidth==this){
this.immediateparent.__LZoutliewidth=null
}
if("__LZoutlieheight" in this.immediateparent&&this.immediateparent.__LZoutlieheight==this){
this.immediateparent.__LZoutlieheight=null
}
if("onremovesubview" in this.immediateparent){
if(this.immediateparent.onremovesubview.ready){
this.immediateparent.onremovesubview.sendEvent(this)
}
}
}
},deleteView:function($1){
this.destroy()
},setVisible:function($1){
if(this._visible==$1){
return
}
this._visible=$1
if($1){
var $2="visible"
}else{
if($1==null){
var $2="collapse"
}else{
var $2="hidden"
}
}
this.visibility=$2
if(this.onvisibility.ready){
this.onvisibility.sendEvent(this.visibility)
}
this.__LZupdateShown()
},setVisibility:function($1){
if(this.visibility==$1){
return
}
this.visibility=$1
if(this.onvisibility.ready){
this.onvisibility.sendEvent($1)
}
this.__LZupdateShown()
},__LZupdateShown:function(){
if(this.visibility=="collapse"){
var $1=this.__LZvizO&&this.__LZvizDat&&this.__LZvizLoad
}else{
var $1=this.visibility=="visible"
}
if($1!=this.visible){
this.visible=$1
if(this.sprite){
this.sprite.setVisible($1)
}
var $2=this.immediateparent
if($2&&$2.__LZcheckwidth){
$2.__LZcheckwidthFunction(this)
}
if($2&&$2.__LZcheckheight){
$2.__LZcheckheightFunction(this)
}
if(this.onvisible.ready){
this.onvisible.sendEvent($1)
}
}
},setWidth:function($1){
if(this._width!=$1){
this._width=$1
this.sprite.setWidth($1)
if($1==null){
this.hassetwidth=false
this.__LZcheckwidth=true
if(this._setrescwidth){
this.unstretchedwidth=null
this._xscale=1
}
this.reevaluateSize("width")
return
}
this.width=$1
if(this.pixellock){
$1=Math.floor($1)
}
if(this._setrescwidth){
var $2=this.unstretchedwidth==0?100:$1/this.unstretchedwidth
this._xscale=$2
}else{
this.__LZcheckwidth=false
}
this.hassetwidth=true
if(this.immediateparent.__LZcheckwidth){
this.immediateparent.__LZcheckwidthFunction(this)
}
if(this.onwidth.ready){
this.onwidth.sendEvent($1)
}
}
},setHeight:function($1){
if(this._height!=$1){
this._height=$1
this.sprite.setHeight($1)
if($1==null){
this.hassetheight=false
this.__LZcheckheight=true
if(this._setrescheight){
this.unstretchedheight=null
this._yscale=1
}
this.reevaluateSize("height")
return
}
this.height=$1
if(this.pixellock){
$1=Math.floor($1)
}
if(this._setrescheight){
var $2=this.unstretchedheight==0?100:$1/this.unstretchedheight
this._yscale=$2
}else{
this.__LZcheckheight=false
}
this.hassetheight=true
if(this.immediateparent.__LZcheckheight){
this.immediateparent.__LZcheckheightFunction(this)
}
if(this.onheight.ready){
this.onheight.sendEvent($1)
}
}
},setOpacity:function($1){
if(this.capabilities.opacity){
this.sprite.setOpacity($1)
}else{

}
this.opacity=$1
if(this.onopacity.ready){
this.onopacity.sendEvent($1)
}
var $2=this.__LZvizO
var $3=$1!=0
if($2!=$3){
this.__LZvizO=$3
this.__LZupdateShown()
}
},setX:function($1){
if(this._x!=$1){
this._x=$1
this.x=$1
if(this.__LZhasoffset){
if(this.capabilities.rotation){
$1-=this.xoffset*this.__LZrcos-this.yoffset*this.__LZrsin
}else{
$1-=this.xoffset
}
}
if(this.pixellock){
$1=Math.floor($1)
}
this.sprite.setX($1)
if(this.immediateparent.__LZcheckwidth){
this.immediateparent.__LZcheckwidthFunction(this)
}
if(this.onx.ready){
this.onx.sendEvent(this.x)
}
}
},setY:function($1){
if(this._y!=$1){
this._y=$1
this.y=$1
if(this.__LZhasoffset){
if(this.capabilities.rotation){
$1-=this.xoffset*this.__LZrsin+this.yoffset*this.__LZrcos
}else{
$1-=this.yoffset
}
}
if(this.pixellock){
$1=Math.floor($1)
}
this.sprite.setY($1)
if(this.immediateparent.__LZcheckheight){
this.immediateparent.__LZcheckheightFunction(this)
}
if(this.ony.ready){
this.ony.sendEvent(this.y)
}
}
},setRotation:function($1){
if(this.capabilities.rotation){
this.sprite.setRotation($1)
}else{

}
this.rotation=$1
var $2=Math.PI/180*this.rotation
this.__LZrsin=Math.sin($2)
this.__LZrcos=Math.cos($2)
if(this.onrotation.ready){
this.onrotation.sendEvent($1)
}
if(this.__LZhasoffset){
this.setX(this.x)
this.setY(this.y)
}
if(this.immediateparent.__LZcheckwidth){
this.immediateparent.__LZcheckwidthFunction(this)
}
if(this.immediateparent.__LZcheckheight){
this.immediateparent.__LZcheckheightFunction(this)
}
},setAlign:function($1){
if($1=="left"){
this.releaseConstraint("x")
if(!this.__LZdeleted){
var $lzsc$1703518339=this.setters
if($lzsc$1703518339&&"x" in $lzsc$1703518339){
this[$lzsc$1703518339["x"]](0)
}else{
this["x"]=0
if("onx" in this){
if(this["onx"].ready){
this["onx"].sendEvent(0)
}
}
}
}
}else{
if($1=="center"){
var $2=function(){
var $lzsc$1689684331=this.immediateparent.width/2-this.width/2
if(!this.__LZdeleted){
var $lzsc$105138784=this.setters
if($lzsc$105138784&&"x" in $lzsc$105138784){
this[$lzsc$105138784["x"]]($lzsc$1689684331)
}else{
this["x"]=$lzsc$1689684331
if("onx" in this){
if(this["onx"].ready){
this["onx"].sendEvent($lzsc$1689684331)
}
}
}
}
}
this.setPosConstraint(this.immediateparent,$2,"width")
}else{
if($1=="right"){
var $2=function(){
var $lzsc$185694933=this.immediateparent.width-this.width
if(!this.__LZdeleted){
var $lzsc$888270527=this.setters
if($lzsc$888270527&&"x" in $lzsc$888270527){
this[$lzsc$888270527["x"]]($lzsc$185694933)
}else{
this["x"]=$lzsc$185694933
if("onx" in this){
if(this["onx"].ready){
this["onx"].sendEvent($lzsc$185694933)
}
}
}
}
}
this.setPosConstraint(this.immediateparent,$2,"width")
}
}
}
},setXOffset:function($1){
this.__LZhasoffset=$1!=0
this.xoffset=$1
this.setX(this.x)
this.setY(this.y)
if(this.onxoffset.ready){
this.onxoffset.sendEvent($1)
}
},setYOffset:function($1){
this.__LZhasoffset=$1!=0
this.yoffset=$1
this.setX(this.x)
this.setY(this.y)
if(this.onyoffset.ready){
this.onyoffset.sendEvent($1)
}
},getBounds:function(){
var $1=[-this.xoffset,-this.yoffset,this.width-this.xoffset,-this.yoffset,-this.xoffset,this.height-this.yoffset,this.width-this.xoffset,this.height-this.yoffset,this.rotation,this.x,this.y]
var $2=$1.length-1
while($1[$2]==this.__LZlastmtrix[$2]){
if($2--==0){
return this.__LZstoredbounds
}
}
var $3={}
for(var $2=0;$2<8;$2+=2){
var $4=$1[$2]
var $5=$1[$2+1]
var $6=$4*this.__LZrcos-$5*this.__LZrsin
var $7=$4*this.__LZrsin+$5*this.__LZrcos
if($3.xoffset==null||$3.xoffset>$6){
$3.xoffset=$6
}
if($3.yoffset==null||$3.yoffset>$7){
$3.yoffset=$7
}
if($3.width==null||$3.width<$6){
$3.width=$6
}
if($3.height==null||$3.height<$7){
$3.height=$7
}
}
$3.width-=$3.xoffset
$3.height-=$3.yoffset
$3.x=this.x+$3.xoffset
$3.y=this.y+$3.yoffset
this.__LZstoredbounds=$3
this.__LZlastmtrix=$1
return $3
},setValign:function($1){
if($1=="top"){
this.releaseConstraint("y")
if(!this.__LZdeleted){
var $lzsc$1289201669=this.setters
if($lzsc$1289201669&&"y" in $lzsc$1289201669){
this[$lzsc$1289201669["y"]](0)
}else{
this["y"]=0
if("ony" in this){
if(this["ony"].ready){
this["ony"].sendEvent(0)
}
}
}
}
}else{
if($1=="middle"){
var $2=function(){
var $lzsc$4651145=this.immediateparent.height/2-this.height/2
if(!this.__LZdeleted){
var $lzsc$1691777991=this.setters
if($lzsc$1691777991&&"y" in $lzsc$1691777991){
this[$lzsc$1691777991["y"]]($lzsc$4651145)
}else{
this["y"]=$lzsc$4651145
if("ony" in this){
if(this["ony"].ready){
this["ony"].sendEvent($lzsc$4651145)
}
}
}
}
}
this.setPosConstraint(this.immediateparent,$2,"height")
}else{
if($1=="bottom"){
var $2=function(){
var $lzsc$175394630=this.immediateparent.height-this.height
if(!this.__LZdeleted){
var $lzsc$567574167=this.setters
if($lzsc$567574167&&"y" in $lzsc$567574167){
this[$lzsc$567574167["y"]]($lzsc$175394630)
}else{
this["y"]=$lzsc$175394630
if("ony" in this){
if(this["ony"].ready){
this["ony"].sendEvent($lzsc$175394630)
}
}
}
}
}
this.setPosConstraint(this.immediateparent,$2,"height")
}
}
}
},setPosConstraint:function($1,$2,$3){
var $4=[$1,$3,this,$3]
this.applyConstraint($3=="width"?"x":"y",$2,$4)
},setColor:function($1){
this.sprite.setColor($1)
this.fgcolor=$1
},getColor:function(){
return this.sprite.getColor()
},setColorTransform:function($1){
if(this.capabilities.colortransform){
this.sprite.setColorTransform($1)
}else{

}
},getColorTransform:function(){
if(this.capabilities.colortransform){
return this.sprite.getColorTransform()
}else{

}
},getWidth:function(){
return this.width
},getHeight:function(){
return this.height
},__LZcheckSize:function($1,$2,$3){
if($1.addedToParent){
if($1.__LZhasoffset||$1.rotation!=0){
var $4=$1.getBounds()
}else{
var $4=$1
}
var $5=$4[$3]+$4[$2]
var $6=this["_setresc"+$2]?this["unstretched"+$2]:this[$2]
if($5>$6&&$1.visible){
this["__LZoutlie"+$2]=$1
if($2=="width"){
this.updateWidth($5)
}else{
this.updateHeight($5)
}
}else{
if(this["__LZoutlie"+$2]==$1&&($5<$6||!$1.visible)){
this.reevaluateSize($2)
}
}
}
},__LZcheckwidthFunction:function($1){
this.__LZcheckSize($1,"width","x")
},__LZcheckheightFunction:function($1){
this.__LZcheckSize($1,"height","y")
},measureSize:function($1){
var $2=this["resource"+$1]
for(var $3=this.subviews.length-1;$3>=0;$3--){
var $4=this.subviews[$3]
var $5=$4[$1=="width"?"x":"y"]+$4[$1]
if($4.visible&&$5>$2){
$2=$5
}
}
return $2
},measureWidth:function(){
return this.measureSize("width")
},measureHeight:function(){
return this.measureSize("height")
},updateSize:function($1,$2){
if($1=="width"){
this.updateWidth($2)
}else{
this.updateHeight($2)
}
},updateWidth:function($1){
if(this._setrescwidth){
this.unstretchedwidth=$1
if(this.hassetwidth){
var $2=this.width/$1
this._xscale=$2
}
if(this.onunstretchedwidth.ready){
this.onunstretchedwidth.sendEvent($1)
}
}
if(!this.hassetwidth){
this.width=$1
this.sprite.setWidth($1)
if(this.onwidth.ready){
this.onwidth.sendEvent($1)
}
if(this.immediateparent.__LZcheckwidth){
this.immediateparent.__LZcheckwidthFunction(this)
}
}
},updateHeight:function($1){
if(this._setrescheight){
this.unstretchedheight=$1
if(this.hassetheight){
var $2=this.height/$1
this._yscale=$2
}
if(this.onunstretchedheight){
if(this.onunstretchedheight.ready){
this.onunstretchedheight.sendEvent($1)
}
}
}
if(!this.hassetheight){
this.height=$1
this.sprite.setHeight($1)
if(this.onheight.ready){
this.onheight.sendEvent($1)
}
if(this.immediateparent.__LZcheckheight){
this.immediateparent.__LZcheckheightFunction(this)
}
}
},reevaluateSize:function($1){
if($1==null){
var $2="height"
this.reevaluateSize("width")
}else{
var $2=$1
}
if(this["hasset"+$2]&&!this["_setresc"+$2]){
return
}
var $3=this["_setresc"+$2]?this["unstretched"+$2]:this[$2]
var $4=this["resource"+$2]||0
this["__LZoutlie"+$2]=this
for(var $5=this.subviews.length-1;$5>=0;$5--){
var $6=this.subviews[$5]
if($6.__LZhasoffset||$6.rotation!=0){
var $7=$6.getBounds()
var $8=$7[$2=="width"?"x":"y"]+$7[$2]
}else{
var $8=$6[$2=="width"?"x":"y"]+$6[$2]
}
if($6.visible&&$8>$4){
$4=$8
this["__LZoutlie"+$2]=$6
}
}
if($3!=$4){
if($2=="width"){
this.updateWidth($4)
}else{
this.updateHeight($4)
}
}
},updateResourceSize:function(){
this.sprite.updateResourceSize()
this.reevaluateSize()
},setAttributeRelative:function($1,$2){
var $3=this.getLinkage($2)
var $4=$2[$1]
if($1=="x"||$1=="y"){
$3.update($1)
var $lzsc$259439822=($4-$3.offset[$1])/$3.scale[$1]
if(!this.__LZdeleted){
var $lzsc$2040884966=this.setters
if($lzsc$2040884966&&$1 in $lzsc$2040884966){
this[$lzsc$2040884966[$1]]($lzsc$259439822)
}else{
this[$1]=$lzsc$259439822
var $lzsc$1128460375="on"+$1
if($lzsc$1128460375 in this){
if(this[$lzsc$1128460375].ready){
this[$lzsc$1128460375].sendEvent($lzsc$259439822)
}
}
}
}
}else{
if($1=="width"||$1=="height"){
var $5=$1=="width"?"x":"y"
$3.update($5)
var $lzsc$153420007=$4/$3.scale[$5]
if(!this.__LZdeleted){
var $lzsc$130966124=this.setters
if($lzsc$130966124&&$1 in $lzsc$130966124){
this[$lzsc$130966124[$1]]($lzsc$153420007)
}else{
this[$1]=$lzsc$153420007
var $lzsc$607604885="on"+$1
if($lzsc$607604885 in this){
if(this[$lzsc$607604885].ready){
this[$lzsc$607604885].sendEvent($lzsc$153420007)
}
}
}
}
}else{

}
}
},getAttributeRelative:function($1,$2){
var $3=this.getLinkage($2)
if($1=="x"||$1=="y"){
$3.update($1)
return $3.offset[$1]+$3.scale[$1]*this.getProp($1)
}else{
if($1=="width"||$1=="height"){
var $4=$1=="width"?"x":"y"
$3.update($4)
return $3.scale[$4]*this.getProp($1)
}else{

}
}
},__LZviewLinks:null,getLinkage:function($1){
if(this.__LZviewLinks==null){
this.__LZviewLinks=new Object()
}
var $2=$1.getUID()
if(this.__LZviewLinks[$2]==null){
this.__LZviewLinks[$2]=new LzViewLinkage(this,$1)
}
return this.__LZviewLinks[$2]
},mouseevent:function($1){
if(this[$1]&&this[$1].ready){
this[$1].sendEvent(this)
}
},getMouse:function($1){
if(this.__movecounter!=LzGlobalMouse.__movecounter){
this.__movecounter=LzGlobalMouse.__movecounter
this.__mousecache=this.sprite.getMouse($1)
}
if($1==null){
return this.__mousecache
}
return this.__mousecache[$1]
},containsPt:function($1,$2){
return this.getAttribute("height")>=$2&&$2>=0&&(this.getAttribute("width")>=$1&&$1>=0)
},bringToFront:function(){
if(!this.sprite){
return
}
this.sprite.bringToFront()
},getDepthList:function(){
var $1=[]
var $2=this.subviews
for(var $3=0;$3<$2.length;$3++){
$1[$3]=$2[$3]
}
$1.sort(this.__zCompare)
return $1
},__zCompare:function($1,$2){
var $3=$1.sprite.getZ()
var $4=$2.sprite.getZ()
if($3<$4){
return -1
}
if($3>$4){
return 1
}
return 0
},sendBehind:function($1){
return $1?this.sprite.sendBehind($1.sprite):false
},sendInFrontOf:function($1){
return $1?this.sprite.sendInFrontOf($1.sprite):false
},sendToBack:function(){
this.sprite.sendToBack()
},setResourceNumber:function($1){
this.__lzcheckframe=$1
this.frame=$1
this.stop($1)
if(this.onframe.ready){
this.onframe.sendEvent($1)
}
},stretchResource:function($1){
this.sprite.stretchResource($1)
if($1==null||$1=="x"||$1=="width"||$1=="both"){
this._setrescwidth=true
this.__LZcheckwidth=true
this.reevaluateSize("width")
}
if($1==null||$1=="y"||$1=="height"||$1=="both"){
this._setrescheight=true
this.__LZcheckheight=true
this.reevaluateSize("height")
}
},setBGColor:function($1){
this.sprite.setBGColor($1)
if($1!=null){
this.bgcolor=Number($1)
}
if(this.onbgcolor.ready){
this.onbgcolor.sendEvent($1)
}
},setSource:function($1,$2,$3){
this.sprite.setSource($1,$2,$3)
},unload:function(){
this.sprite.unload()
},makeMasked:function(){
if(this.sprite){
this.sprite.setClip(true)
}
this.masked=true
this.mask=this
},removeMask:function(){
if(this.sprite){
this.sprite.setClip(false)
}
this.masked=false
this.mask=null
},__LZsetClickRegion:function($1){
this.sprite.__LZsetClickRegion($1)
},setClickable:function($1){
this.sprite.setClickable($1)
this.clickable=$1
if(this.onclickable.ready){
this.onclickable.sendEvent($1)
}
},setCursor:function($1){
this.sprite.setCursor($1)
},setPlay:function($1){
if($1){
this.play()
}else{
this.stop()
}
},getMCRef:function(){
return this.sprite.getMCRef()
},play:function($1,$2){
this.sprite.play($1,$2)
},stop:function($1,$2){
this.sprite.stop($1,$2)
},setVolume:function($1){
if(this.capabilities.audio){
this.sprite.setVolume($1)
}else{

}
},getVolume:function(){
if(this.capabilities.audio){
return this.sprite.getVolume()
}else{

}
},setPan:function($1){
if(this.capabilities.audio){
this.sprite.setPan($1)
}else{

}
},getPan:function(){
if(this.capabilities.audio){
return this.sprite.getPan()
}else{

}
},getZ:function(){
return this.sprite.getZ()
},seek:function($1){
var $2=this.getMCRef()
if($2.isaudio==true){
$2.seek($1,this.playing)
}else{
var $3=$1*canvas.framerate
if(this.playing){
this.play($3,true)
}else{
this.stop($3,true)
}
}
},getCurrentTime:function(){
var $1=this.getMCRef()
if($1.isaudio==true){
return $1.getCurrentTime()
}else{
return this.frame/canvas.framerate
}
},getTotalTime:function(){
var $1=this.getMCRef()
if($1.isaudio==true){
return $1.getTotalTime()
}else{
return this.totalframes/canvas.framerate
}
},getID3:function(){
var $1=this.getMCRef()
if($1.isaudio==true){
return $1.getID3()
}
},getPlayPerc:function(){
return this.frame/this.totalframes
},setShowHandCursor:function($1){
this.sprite.setShowHandCursor($1)
},setAccessible:function($1){
if(this.capabilities.accessibility){
this.sprite.setAccessible($1)
}else{

}
},setAAActive:function($1,$2){
if(this.capabilities.accessibility){
this.sprite.setAAActive($1,$2)
}else{

}
},setAAName:function($1,$2){
if(this.capabilities.accessibility){
this.sprite.setAAName($1,$2)
}else{

}
},setAADescription:function($1,$2){
if(this.capabilities.accessibility){
this.sprite.setAADescription($1,$2)
}else{

}
},setAATabIndex:function($1,$2){
if(this.capabilities.accessibility){
this.sprite.setAATabIndex($1,$2)
}else{

}
},setAASilent:function($1,$2){
if(this.capabilities.accessibility){
this.sprite.setAASilent($1,$2)
}else{

}
},shouldYieldFocus:function(){
return true
},blurring:false,setContextMenu:function($1){
this.sprite.setContextMenu($1)
},getContextMenu:function(){
return this.sprite.getContextMenu()
},__warnCapability:function($1){
Debug.warn("The %s runtime does not support %s",lzr,$1)
}},{tagname:"view",__LZproxypolicies:[],__LZcheckProxyPolicy:function($1){
var $2=LzView.__LZproxypolicies
for(var $3=$2.length-1;$3>=0;$3--){
var $4=$2[$3]($1)
if($4!=null){
return $4
}
}
return canvas.proxied
},addProxyPolicy:function($1){
LzView.__LZproxypolicies.push($1)
},removeProxyPolicy:function($1){
var $2=LzView.__LZproxypolicies
for(var $3=0;$3<$2.length;$3++){
if($2[$3]==$1){
LzView.__LZproxypolicies=$2.splice($3,1)
return true
}
}
return false
}});(function(){
with(LzView){
with(LzView.prototype){
DeclareEvent(prototype,"onaddsubresource")
DeclareEvent(prototype,"onaddsubview")
DeclareEvent(prototype,"onbgcolor")
DeclareEvent(prototype,"onblur")
DeclareEvent(prototype,"onclick")
DeclareEvent(prototype,"onclickable")
DeclareEvent(prototype,"onfocus")
DeclareEvent(prototype,"onframe")
DeclareEvent(prototype,"onheight")
DeclareEvent(prototype,"onimload")
DeclareEvent(prototype,"onkeyup")
DeclareEvent(prototype,"onkeydown")
DeclareEvent(prototype,"onlastframe")
DeclareEvent(prototype,"onload")
DeclareEvent(prototype,"onloadperc")
DeclareEvent(prototype,"onerror")
DeclareEvent(prototype,"ontimeout")
DeclareEvent(prototype,"onmousedown")
DeclareEvent(prototype,"onmouseout")
DeclareEvent(prototype,"onmouseover")
DeclareEvent(prototype,"onmousetrackover")
DeclareEvent(prototype,"onmousetrackup")
DeclareEvent(prototype,"onmouseup")
DeclareEvent(prototype,"onopacity")
DeclareEvent(prototype,"onplay")
DeclareEvent(prototype,"onremovesubview")
DeclareEvent(prototype,"onresource")
DeclareEvent(prototype,"onresourceheight")
DeclareEvent(prototype,"onresourcewidth")
DeclareEvent(prototype,"onrotation")
DeclareEvent(prototype,"onstop")
DeclareEvent(prototype,"ontotalframes")
DeclareEvent(prototype,"onunstretchedheight")
DeclareEvent(prototype,"onunstretchedwidth")
DeclareEvent(prototype,"onvisible")
DeclareEvent(prototype,"onvisibility")
DeclareEvent(prototype,"onwidth")
DeclareEvent(prototype,"onx")
DeclareEvent(prototype,"onxoffset")
DeclareEvent(prototype,"ony")
DeclareEvent(prototype,"onyoffset")
DeclareEvent(prototype,"ondblclick")
setters.clip=-1
setters.x="setX"
setters.y="setY"
setters.rotation="setRotation"
setters.opacity="setOpacity"
setters.alpha="setOpacity"
setters.visible="setVisible"
setters.visibility="setVisibility"
setters.align="setAlign"
setters.valign="setValign"
setters.source="setSource"
setters.bgcolor="setBGColor"
setters.resource="setResource"
setters.clickable="setClickable"
setters.clickregion="__LZsetClickRegion"
setters.cursor="setCursor"
setters.fgcolor="setColor"
setters.font="setFontName"
setters.stretches="stretchResource"
setters.play="setPlay"
setters.showhandcursor="setShowHandCursor"
setters.layout="setLayout"
setters.aaactive="setAAActive"
setters.aaname="setAAName"
setters.aadescription="setAADescription"
setters.aatabindex="setAATabIndex"
setters.aasilent="setAASilent"
__LZdelayedSetters.layout="setLayout"
earlySetters.clickregion=7
earlySetters.stretches=8
setters.xoffset="setXOffset"
setters.yoffset="setYOffset"
setters.width="setWidth"
setters.height="setHeight"
setters.frame="setResourceNumber"
LzView.prototype.__LZlastmtrix=[0,0,0,0,0,0,0,0,0,0,0]
prototype.getBounds.dependencies=function($1,$2){
return [$2,"rotation",$2,"x",$2,"y",$2,"width",$2,"height"]
}
prototype.setAttributeRelative.dependencies=function($1,$2,$3,$4){
var $5=$1.getLinkage($4)
var $6=2
var $7=[]
if($3=="width"){
var $8="x"
}else{
if($3=="height"){
var $8="y"
}else{
var $8=$3
}
}
var $9=$8=="x"?"width":"height"
while($6){
if($6==2){
var $10=$5.uplinkArray
}else{
var $10=$5.downlinkArray
}
$6--
for(var $11=$10.length-1;$11>=0;$11--){
$7.push($10[$11],$8)
if($7["_setresc"+$9]){
$7.push([$10[$11],$9])
}
}
}
return $7
}
prototype.getAttributeRelative.dependencies=function($1,$2,$3,$4){
var $5=$2.getLinkage($4)
var $6=2
var $7=[$2,$3]
if($3=="width"){
var $8="x"
}else{
if($3=="height"){
var $8="y"
}else{
var $8=$3
}
}
var $9=$8=="x"?"width":"height"
while($6){
if($6==2){
var $10=$5.uplinkArray
}else{
var $10=$5.downlinkArray
}
$6--
for(var $11=$10.length-1;$11>=0;$11--){
var $12=$10[$11]
$7.push($12,$8)
if($12["_setresc"+$9]){
$7.push($12,$9)
}
}
}
return $7
}
prototype.getMouse.dependencies=function(){
return [LzIdle,"idle"]
}
prototype.getCurrentTime.dependencies=function($1,$2){
return [$2,"frame"]
}
prototype.getTotalTime.dependencies=function($1,$2){
return [$2,"load"]
}
prototype.getPlayPerc.dependencies=function($1,$2){
return [$2,"frame"]
}
}
}
})()
var LzViewLinkage=Class.make("LzViewLinkage",null,{initialize:function($1,$2){
this.scale=new Object()
this.offset=new Object()
if($1==$2){
return
}
this.uplinkArray=[]
var $3=$1
do{
$3=$3.immediateparent
this.uplinkArray.push($3)
}while($3!=$2&&$3!=canvas)
this.downlinkArray=[]
if($3==$2){
return
}
var $3=$2
do{
$3=$3.immediateparent
this.downlinkArray.push($3)
}while($3!=canvas)
while(this.uplinkArray.length>1&&this.downlinkArray[this.downlinkArray.length-1]==this.uplinkArray[this.uplinkArray.length-1]&&this.downlinkArray[this.downlinkArray.length-2]==this.uplinkArray[this.uplinkArray.length-2]){
this.downlinkArray.pop()
this.uplinkArray.pop()
}
},update:function($1){
var $2=1
var $3=0
var $4="_"+$1+"scale"
if(this.uplinkArray){
var $5=this.uplinkArray.length
for(var $6=0;$6<$5;$6++){
var $7=this.uplinkArray[$6]
$2*=$7[$4]
$3+=$7[$1]/$2
}
}
if(this.downlinkArray){
for(var $6=this.downlinkArray.length-1;$6>=0;$6--){
var $7=this.downlinkArray[$6]
$3-=$7[$1]/$2
$2/=$7[$4]
}
}
this.scale[$1]=$2
this.offset[$1]=$3
}},null)
var LzText=Class.make("LzText",[LzFormatter,LzView],{scroll:0,maxscroll:0,hscroll:0,maxhscroll:0,getDefaultWidth:function(){
return 0
},multiline:null,resize:true,text:null,colorstring:"#000000",init:function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).apply(this,arguments)
if(this.sizeToHeight){
var $1=this.sprite.getTextfieldHeight()
if($1>0){
this.setHeight($1)
}
}
},construct:function($1,$2){
this.password="password" in $2&&$2.password?true:false
this.multiline="multiline" in $2?$2.multiline:null;(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this.sizeToHeight=false
this.fontname="font" in $2?$2.font:this.searchParents("fontname").fontname
this.fontsize="fontsize" in $2?$2.fontsize:this.searchParents("fontsize").fontsize
this.fontstyle="fontstyle" in $2?$2.fontstyle:this.searchParents("fontstyle").fontstyle
$2.font=this.fontname
$2.fontsize=this.fontsize
$2.fontstyle=this.fontstyle
this.sprite.__initTextProperties($2)
$2.font=LzNode._ignoreAttribute
$2.fontsize=LzNode._ignoreAttribute
$2.fontstyle=LzNode._ignoreAttribute
this.yscroll=0
this.xscroll=0
this.resize="resize" in $2?$2.resize==true:this.resize
this.setResize(this.resize)
this.text=!("text" in $2)||$2.text==null?"":$2.text
this.setMultiline(this.multiline)
this.sprite.setText(this.text)
if($2.width==null){
if(this.multiline){
$2.width=this.parent.width
}else{
if(this.text!=null&&this.text!=""&&this.text.length>0){
$2.width=this.getTextWidth()
}else{
$2.width=this.getDefaultWidth()
}
}
}else{
this.setResize(false)
}
if(!this.hassetheight){
this.sizeToHeight=true
}else{
this.setHeight($2.height)
}
this.scrollheight=this.height
if("maxlength" in $2&&$2.maxlength!=null){
this.setMaxLength($2.maxlength)
}
if("pattern" in $2&&$2.pattern!=null){
this.setPattern($2.pattern)
}
if(this.capabilities.advancedfonts){
if("antiAliasType" in $2&&$2.antiAliasType!=null){
this.setAntiAliasType($2.antiAliasType)
}else{
this.setAntiAliasType("normal")
}
if("gridFit" in $2&&$2.gridFit!=null){
this.setGridFit($2.gridFit)
}else{
this.setGridFit("subpixel")
}
if("sharpness" in $2&&$2.sharpness!=null){
this.setSharpness($2.sharpness)
}else{
this.setSharpness(0)
}
if("thickness" in $2&&$2.thickness!=null){
this.setThickness($2.thickness)
}else{
this.setThickness(0)
}
if(!LzText.prototype.setters.antiAliasType){
LzText.prototype.setters.antiAliasType="setAntiAliasType"
LzText.prototype.defaultattrs.antiAliasType="normal"
LzText.prototype.setters.gridFit="setGridFit"
LzText.prototype.defaultattrs.gridfit="subpixel"
LzText.prototype.setters.sharpness="setSharpness"
LzText.prototype.defaultattrs.sharpness=0
LzText.prototype.setters.thickness="setThickness"
LzText.prototype.defaultattrs.thickness=0
}
}
},__makeSprite:function($1){
this.sprite=new LzTextSprite(this,$1)
},getMCRef:function(){
return this.sprite.getMCRef()
},setResize:function($1){
this.sprite.setResize($1)
this.resize=$1
},setWidth:function($1){
this.sprite.setWidth($1);(arguments.callee.superclass?arguments.callee.superclass.prototype["setWidth"]:this.nextMethod(arguments.callee,"setWidth")).apply(this,arguments)
if(this.sizeToHeight){
var $2=this.sprite.getTextfieldHeight()
if($2>0){
this.setHeight($2)
}
}
},addText:function($1){
this.setText(this.getText()+$1)
},clearText:function(){
this.setText("")
},setMaxLength:function($1){
if($1==null||$1==""){
return
}
this.sprite.setMaxLength($1)
this.maxlength=$1
if(this.onmaxlength.ready){
this.onmaxlength.sendEvent($1)
}
},setPattern:function($1){
if($1==null||$1==""){
return
}
this.sprite.setPattern($1)
this.pattern=$1
if(this.onpattern.ready){
this.onpattern.sendEvent($1)
}
},getTextWidth:function(){
return this.sprite.getTextWidth()
},getTextHeight:function(){
return this.sprite.getTextHeight()
},applyData:function($1){
if(null==$1){
this.clearText()
}else{
this.setText($1)
}
},toString:function(){
return "LzText: "+this.getText()
},setScroll:function($1){
this.sprite.setScroll($1)
},getScroll:function(){
return this.sprite.getScroll()
},getMaxScroll:function(){
return this.sprite.getMaxScroll()
},getBottomScroll:function(){
return this.sprite.getBottomScroll()
},setXScroll:function($1){
this.sprite.setXScroll($1)
},setYScroll:function($1){
this.sprite.setYScroll($1)
},annotateAAimg:function($1){
if(typeof $1=="undefined"){
return
}
if($1.length==0){
return
}
var $2=""
var $3=0
var $4=0
var $5
var $6="<img "
while(true){
$5=$1.indexOf($6,$3)
if($5<0){
$2+=$1.substring($3)
break
}
$2+=$1.substring($3,$5+$6.length)
$3=$5+$6.length
var $7={}
$4=$3+this.parseImgAttributes($7,$1.substring($3))
$2+=$1.substring($3,$4+1)
if($7["alt"]!=null){
var $8=$7["alt"]
$2+="[image "+$8+"]"
}
$3=$4+1
}
return $2
},parseImgAttributes:function($1,$2){
var $3
var $4=0
var $5="attrname"
var $6="attrval"
var $7="whitespace"
var $8="whitespace2"
var $9=$7
var $10=$2.length
var $11
var $12
var $13
for($3=0;$3<$10;$3++){
$4=$3
var $14=$2.charAt($3)
if($14==">"){
break
}
if($9==$7){
if($14!=" "){
$9=$5
$11=$14
}
}else{
if($9==$5){
if($14==" "||$14=="="){
$9=$8
}else{
$11+=$14
}
}else{
if($9==$8){
if($14==" "||$14=="="){
continue
}else{
$9=$6
$13=$14
$12=""
}
}else{
if($9==$6){
if($14!=$13){
$12+=$14
}else{
$9=$7
$1[$11]=$12
}
}
}
}
}
}
return $4
},setText:function($1,$2){
$1+=""
if($2!=true&&$1==this.text){
return
}
if(this.visible){
this.sprite.setVisible(this.visible)
}
this.sprite.setText($1)
this.text=$1
if(this.width==0||this.resize&&this.multiline==false){
var $3=this.getTextWidth()
if($3!=this.width){
this.setWidth($3)
}
}
if(this.sizeToHeight){
var $4=this.sprite.getTextfieldHeight()
if($4>0){
this.setHeight($4)
}
}
if(this.ontext.ready){
this.ontext.sendEvent($1)
}
},format:function($1,$2){
this.setText(this.formatToString.apply(this,arguments))
},updateMaxLines:function(){
var $1=Math.floor(this.height/(this.font.height-1))
if($1!=this.maxlines){
this.maxlines=$1
}
},getText:function(){
return this.text
},escapeText:function($1){
var $2=$1==null?this.text:$1
var $3
for(var $4 in LzText.escapeChars){
while($2.indexOf($4)>-1){
$3=$2.indexOf($4)
$2=$2.substring(0,$3)+LzText.escapeChars[$4]+$2.substring($3+1)
}
}
return $2
},setSelectable:function($1){
this.sprite.setSelectable($1)
},setFontName:function($1){
this.sprite.setFontName($1)
this.fontname=$1
this.setText(this.getText(),true)
},setFontSize:function($1){
this.sprite.setFontSize($1)
this.fontsize=$1
this.setText(this.getText(),true)
},setFontStyle:function($1){
this.sprite.setFontStyle($1)
this.fontstyle=$1
},setMultiline:function($1){
this.sprite.setMultiline($1)
this.multiline=$1==true
},setBorder:function($1){
this.sprite.setBorder($1)
},setWordWrap:function($1){
this.sprite.setWordWrap($1)
},setEmbedFonts:function($1){
this.sprite.setEmbedFonts($1)
},setAntiAliasType:function($1){
if(this.capabilities.advancedfonts){
if($1=="normal"||$1=="advanced"){
this.antiAliasType=$1
this.sprite.setAntiAliasType($1)
}else{

}
}else{

}
},getAntiAliasType:function(){
if(this.capabilities.advancedfonts){
return this.antiAliasType
}else{

}
},setGridFit:function($1){
if(this.capabilities.advancedfonts){
if($1=="none"||$1=="pixel"||$1=="subpixel"){
this.gridFit=$1
this.sprite.setGridFit($1)
}else{

}
}else{

}
},getGridFit:function(){
if(this.capabilities.advancedfonts){
return this.gridFit
}else{

}
},setSharpness:function($1){
if(this.capabilities.advancedfonts){
if($1>=-400&&$1<=400){
this.sharpness=$1
this.sprite.setSharpness($1)
}else{

}
}else{

}
},getSharpness:function(){
if(this.capabilities.advancedfonts){
return this.sharpness
}else{

}
},setThickness:function($1){
if(this.capabilities.advancedfonts){
if($1>=-200&&$1<=200){
this.thickness=$1
this.sprite.setThickness($1)
}else{

}
}else{

}
},getThickness:function(){
if(this.capabilities.advancedfonts){
return this.thickness
}else{

}
},setScroll:function($1){
this.sprite.setScroll($1)
},setHScroll:function($1){
this.sprite.setHScroll($1)
},setSelection:function($1,$2){
this.sprite.setSelection($1,$2)
},getSelectionPosition:function(){
return this.sprite.getSelectionPosition()
},getSelectionSize:function(){
return this.sprite.getSelectionSize()
}},{tagname:"text",escapeChars:{">":"&gt;","<":"&lt;"}});(function(){
with(LzText){
with(LzText.prototype){
DeclareEvent(prototype,"ontext")
DeclareEvent(prototype,"onmaxlength")
DeclareEvent(prototype,"onpattern")
DeclareEvent(prototype,"onscroll")
DeclareEvent(prototype,"onmaxscroll")
DeclareEvent(prototype,"onhscroll")
DeclareEvent(prototype,"onmaxhscroll")
defaultattrs.pixellock=true
setters.text="setText"
setters.resize="setResize"
setters.multiline=-1
setters.yscroll="setYScroll"
setters.xscroll="setXScroll"
setters.selectable="setSelectable"
defaultattrs.selectable=false
setters.maxlength="setMaxLength"
setters.pattern="setPattern"
defaultattrs.clip=true
setters.font="setFontName"
setters.fontsize="setFontSize"
setters.fontstyle="setFontStyle"
prototype.getTextWidth.dependencies=function($1,$2){
return [$2,"text"]
}
prototype.getTextHeight.dependencies=function($1,$2){
return [$2,"text"]
}
prototype.getMaxScroll.dependencies=function($1,$2){
return [$2,"maxscroll"]
}
prototype.getText.dependencies=function($1,$2){
return [$2,"text"]
}
}
}
})()
var LzInputText=Class.make("LzInputText",LzText,{getDefaultWidth:function(){
return 100
},construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this._onfocusDel=new LzDelegate(this,"_gotFocusEvent",this,"onfocus")
this._onblurDel=new LzDelegate(this,"_gotBlurEvent",this,"onblur")
},__makeSprite:function($1){
this.sprite=new LzInputTextSprite(this,$1)
},_gotFocusEvent:function(){
this._focused=true
this.sprite.gotFocus()
},_gotBlurEvent:function(){
this._focused=false
this.sprite.gotBlur()
},inputtextevent:function($1,$2){
if($1=="onfocus"&&this._focused){
return
}
if($1=="onblur"&&!this._focused){
return
}
if($1=="onfocus"||$1=="onmousedown"){
this._focused=true
if(LzFocus.getFocus()!=this){
var $3=LzKeys.isKeyDown("tab")
LzFocus.setFocus(this,$3)
return
}
}else{
if($1=="onchange"){
if(this.multiline&&this.sizeToHeight&&this.height!=this.sprite.getTextHeight()){
this.setHeight(this.sprite.getTextfieldHeight())
}
if(this.ontext.ready){
this.ontext.sendEvent($2)
}
return
}else{
if($1=="onblur"){
this._focused=false
}
}
}
if(this[$1].ready){
this[$1].sendEvent($2)
}
},focusable:true,updateData:function(){
return this.sprite.text
},setEnabled:function($1){
if(!this.__LZdeleted){
var $lzsc$587769273=this.setters
if($lzsc$587769273&&"focusable" in $lzsc$587769273){
this[$lzsc$587769273["focusable"]]($1)
}else{
this["focusable"]=$1
if("onfocusable" in this){
if(this["onfocusable"].ready){
this["onfocusable"].sendEvent($1)
}
}
}
}
this.enabled=$1
this.sprite.setEnabled($1)
if(this.onenabled.ready){
this.onenabled.sendEvent($1)
}
},setHTML:function($1){
if(this.capabilities["htmlinputtext"]){
this.sprite.setHTML($1)
}else{

}
},setText:function($1){
$1+=""
this.sprite.setText($1)
this.text=$1
if(this.height<9||this.sizeToHeight){
this.height=this.sprite.getTextfieldHeight()
if(this.onheight.ready){
this.onheight.sendEvent()
}
if(this.height>0){
this.setHeight(this.height)
}
}
if(this.ontext.ready){
this.ontext.sendEvent($1)
}
},getText:function(){
return this.sprite.getText()
}},{tagname:"inputtext"});(function(){
with(LzInputText){
with(LzInputText.prototype){
DeclareEvent(prototype,"onenabled")
DeclareEvent(prototype,"onselect")
DeclareEvent(prototype,"ontext")
defaultattrs.selectable=true
defaultattrs.enabled=true
setters.enabled="setEnabled"
prototype.getText.dependencies=function($1,$2){
return [$2,"text"]
}
}
}
})()
var LzCanvas=Class.make("LzCanvas",LzView,{initialize:function($1){
this.hasdatapath=true
this.datapath={}
this.immediateparent=this
this.__LZmovieClipRef=_root
this.__LZsvdepth=1
this.__LZrightmenuclip=null
if("accessible" in $1){
this.sprite.setAccessible($1.accessible)
}
this.mask=null
this.viewLevel=0
this.resourcetable={}
this.totalnodes=0
this.creatednodes=0
this.percentcreated=0
this.framerate=30
if(typeof $1.proxied=="undefined"||$1.proxied==null){
var $2=$1.__LZproxied=="true"
if(LzBrowser.getInitArg("lzproxied")!=null){
$2=LzBrowser.getInitArg("lzproxied")=="true"
}
this.proxied=$2
}else{
this.proxied=$1.proxied==true
}
delete $1.proxied
this.sprite=new LzSprite(this,true)
this.__canvaswidthratio=null
this.width=Number($1.width)
if(isNaN(this.width)){
if($1.width.charAt($1.width.length-1)=="%"){
var $3=Number($1.width.substr(0,$1.width.length-1))
this.__canvaswidthratio=$3/100
if(this.capabilities.scalecanvastopercentage!=true){
this.__canvaswidthratio=1
}
}else{
this.width=400
}
}
delete $1.width
this.__canvasheightratio=null
this.height=Number($1.height)
if(isNaN(this.height)){
if($1.height.charAt($1.height.length-1)=="%"){
var $3=Number($1.height.substr(0,$1.height.length-1))
this.__canvasheightratio=$3/100
if(this.capabilities.scalecanvastopercentage!=true){
this.__canvasheightratio=1
}
}else{
this.height=400
}
}
delete $1.height
if(this.__canvasheightratio!=null||this.__canvaswidthratio!=null){
LzScreenKernel.setCallback(this,"__windowResize")
}
this.bgcolor=$1.bgcolor
delete $1.bgcolor
this.lpsversion=$1.lpsversion+"."+this.__LZlfcversion
delete $1.lpsversion
this.__LZapplyArgs($1)
if(!("version" in this&&this.version)){
this.version=this.lpsversion
}
if(this.compareVersion(this.version)==-1){
this.__LZoldOnData=true
}
this.isinited=false
this._lzinitialsubviews=[]
this.datasets={}
global.canvas=this
this.parent=this
this.makeMasked()
this.__LZmouseupDel=new LzDelegate(this,"__LZmouseup",LzGlobalMouse,"onmouseup")
this.__LZmousedownDel=new LzDelegate(this,"__LZmousedown",LzGlobalMouse,"onmousedown")
this.__LZmousemoveDel=new LzDelegate(this,"__LZmousemove",LzGlobalMouse,"onmousemove")
LzPlatform.initCanvas(this)
},__LZmouseup:function(){
if(this.onmouseup.ready){
this.onmouseup.sendEvent()
}
},__LZmousemove:function(){
if(this.onmousemove.ready){
this.onmousemove.sendEvent()
}
},__LZmousedown:function(){
if(this.onmousedown.ready){
this.onmousedown.sendEvent()
}
},__makeSprite:function($1){
this.sprite=new LzSprite(this,true,$1)
},initdelay:0,lpsversion:null,lpsrelease:null,version:null,__LZlfcversion:"0",nodeLevel:0,proxied:true,dataloadtimeout:30000,medialoadtimeout:30000,percentcreated:null,datasets:null,proxied:null,compareVersion:function($1,$2){
if($2==null){
$2=this.lpsversion
}
if($1==$2){
return 0
}
var $3=$1.split(".")
var $4=$2.split(".")
var $5=0
while($5<$3.length||$5<$4.length){
var $6=Number($3[$5])||0
var $7=Number($4[$5++])||0
if($6<$7){
return -1
}else{
if($6>$7){
return 1
}
}
}
return 0
},setResource:function(){
Object.error("You can't set a resource for the canvas.")
},toString:function(){
return "This is the canvas"
},initDone:function(){
var $1=new Array()
for(var $2=0;$2<this._lzinitialsubviews.length;$2++){
if("initimmediate" in this._lzinitialsubviews[$2].attrs&&this._lzinitialsubviews[$2].attrs.initimmediate){
$1.push(this._lzinitialsubviews[$2])
}
}
for(var $2=0;$2<this._lzinitialsubviews.length;$2++){
if(!("initimmediate" in this._lzinitialsubviews[$2].attrs&&this._lzinitialsubviews[$2].attrs.initimmediate)){
$1.push(this._lzinitialsubviews[$2])
}
}
this._lzinitialsubviews=[]
LzInstantiator.requestInstantiation(this,$1)
},init:function(){

},__LZinstantiationDone:function(){
this.percentcreated=1
this.updatePercentCreated=null
if(this.onpercentcreated.ready){
this.onpercentcreated.sendEvent(this.percentcreated)
}
if(this.initdelay>0){
LzInstantiator.halt()
this.initokdel=new LzDelegate(this,"okToInit")
LzTimer.addTimer(this.initokdel,this.initdelay)
}else{
this.okToInit()
}
},okToInit:function(){
LzInstantiator.resume()
this.__LZcallInit()
},updatePercentCreated:function(){
this.percentcreated=Math.max(this.percentcreated,this.creatednodes/this.totalnodes)
this.percentcreated=Math.min(0.99,this.percentcreated)
if(this.onpercentcreated.ready){
this.onpercentcreated.sendEvent(this.percentcreated)
}
},initiatorAddNode:function($1,$2){
this.totalnodes+=$2
this._lzinitialsubviews.push($1)
},__LZcallInit:function($1){
if(this.isinited){
return
}
this.isinited=true
this.__LZresolveReferences()
var $2=this.subnodes
if($2){
var $3=0
var $4=$2.length
while($3<$4){
var $5=$2[$3++]
var $6=$2[$3]
if($5.isinited||$5.__LZlateinit){
continue
}
$5.__LZcallInit()
if($6!=$2[$3]){
while($3>0){
if($6==$2[--$3]){
break
}
}
}
}
}
this.init()
this.sprite.init(true)
if(this.oninit.ready){
this.oninit.sendEvent(this)
}
if(this.datapath&&this.datapath.__LZApplyDataOnInit){
this.datapath.__LZApplyDataOnInit()
}
},setWidth:function(){

},isProxied:function(){
return this.proxied
},setX:function(){

},setHeight:function(){

},setY:function(){

},setDefaultContextMenu:function($1){
this.setContextMenu($1)
this.sprite.setDefaultContextMenu($1)
},__windowResize:function($1){
if(this.__canvaswidthratio!=null){
this.width=Math.floor($1.width*this.__canvaswidthratio)
if(this.onwidth.ready){
this.onwidth.sendEvent(this.width)
}
this.sprite.setWidth(this.width)
}
if(this.__canvasheightratio!=null){
this.height=Math.floor($1.height*this.__canvasheightratio)
if(this.onheight.ready){
this.onheight.sendEvent(this.height)
}
this.sprite.setHeight(this.height)
}
}},{tagname:"canvas",versionInfoString:function(){
return "URL: "+LzBrowser.getLoadURL()+"\n"+"Version: "+canvas.lpsversion+"\n"+"Release: "+canvas.lpsrelease+"\n"+"Build: "+canvas.lpsbuild+"\n"+"Date: "+canvas.lpsbuilddate+"\n"+"Target: "+canvas.runtime+"\n"+"Runtime:"+LzBrowser.getVersion()+"\n"
}});(function(){
with(LzCanvas){
with(LzCanvas.prototype){
DeclareEvent(prototype,"onpercentcreated")
DeclareEvent(prototype,"onmousedown")
DeclareEvent(prototype,"onmouseup")
DeclareEvent(prototype,"onmousemove")
prototype.__LZcheckwidth=null
prototype.__LZcheckheight=null
prototype.hassetwidth=true
prototype.hassetheight=true
}
}
})()
var LzPlatform=new Object()
LzPlatform.initCanvas=function($1){
LzPlatform.buildDefaultMenu($1)
}
LzPlatform.__LZdefaultMenuItemHandler=function($1,$2){
LzBrowser.loadURL("http://www.openlaszlo.org","lz_about")
}
LzPlatform.__LZviewSourceMenuItemHandler=function($1,$2){
var $3=LzBrowser.getBaseURL()
if(canvas.proxied){
$3=$3.toString()+"?lzt=source"
}else{
$3=$3.toString()+".zip"
}
LzBrowser.loadURL($3,"lz_source")
}
LzPlatform.buildDefaultMenu=function($1){
$1.__LZDefaultCanvasMenu=new LzContextMenu()
$1.__LZdefaultMenuItem=new LzContextMenuItem("About OpenLaszlo...",new LzDelegate(LzPlatform,"__LZdefaultMenuItemHandler"))
$1.__LZviewSourceMenuItem=new LzContextMenuItem("View Source",new LzDelegate(LzPlatform,"__LZviewSourceMenuItemHandler"))
$1.__LZDefaultCanvasMenu.hideBuiltInItems()
$1.__LZDefaultCanvasMenu.addItem($1.__LZdefaultMenuItem)
if($1.proxied){
$1.__LZDefaultCanvasMenu.addItem($1.__LZviewSourceMenuItem)
}
if($1.__LZDefaultCanvasMenu){
$1.setDefaultContextMenu($1.__LZDefaultCanvasMenu)
}
}
var LzScript=Class.make("LzScript",LzNode,{initialize:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
$2.script()
}},{tagname:"script"})
var LzAnimatorGroup=Class.make("LzAnimatorGroup",LzNode,{attribute:null,start:true,from:null,to:null,duration:null,indirect:false,relative:false,motion:"easeboth",repeat:null,paused:false,started:null,target:null,process:"sequential",target:null,paused:null,animatorProps:{attribute:true,from:true,duration:true,to:true,relative:true,target:true},construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
if(this.immediateparent instanceof LzAnimatorGroup){
for(var $3 in this.animatorProps){
if($2[$3]==null){
$2[$3]=this.immediateparent[$3]
}
}
if(this.immediateparent.animators==null){
this.immediateparent.animators=[this]
}else{
this.immediateparent.animators.push(this)
}
$2.start=LzNode._ignoreAttribute
}else{
this.target=this.immediateparent
}
if(!this.updateDel){
this.updateDel=new LzDelegate(this,"update")
}
},init:function(){
if(!this.target){
this.target=this.immediateparent
}
if(this.started){
this.doStart()
};(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).apply(this,arguments)
},setTarget:function($1){
this.target=$1
var $2=this.subnodes
if($2){
for(var $3=0;$3<$2.length;$3++){
if($2[$3] instanceof LzAnimatorGroup){
$2[$3].setTarget($1)
}
}
}
if(this.ontarget.ready){
this.ontarget.sendEvent($1)
}
},setStart:function($1){
this.started=$1
if(this.onstarted.ready){
this.onstarted.sendEvent($1)
}
if(!this.isinited){
return
}
if($1){
this.doStart()
}else{
this.stop()
}
},doStart:function(){
if(this.isactive){
return false
}
if(this.onstart.ready){
this.onstart.sendEvent(new Date().getTime())
}
this.isactive=true
this.crepeat=this.repeat
this.prepareStart()
this.updateDel.register(LzIdle,"onidle")
return true
},start:function(){
this.doStart()
},prepareStart:function(){
for(var $1=this.animators.length-1;$1>=0;$1--){
this.animators[$1].notstarted=true
}
this.actAnim=this.animators.concat()
},resetAnimator:function(){
this.actAnim=this.animators.concat()
for(var $1=this.animators.length-1;$1>=0;$1--){
this.animators[$1].needsrestart=true
}
},update:function($1){
var $2=this.actAnim.length-1
if($2>0&&this.process=="sequential"){
$2=0
}
if(this.paused){
return
}
for(var $3=$2;$3>=0;$3--){
var $4=this.actAnim[$3]
if($4.notstarted){
$4.isactive=true
$4.prepareStart()
$4.notstarted=false
}else{
if($4.needsrestart){
$4.resetAnimator()
$4.needsrestart=false
}
}
if($4.update($1)){
this.actAnim.splice($3,1)
}
}
if(!this.actAnim.length){
return this.checkRepeat()
}
return false
},pause:function($1){
if($1==null){
$1=!this.paused
}
if(this.paused&&!$1){
this.__LZaddToStartTime(new Date().getTime()-this.__LZpauseTime)
}else{
if(!this.paused&&$1){
this.__LZpauseTime=new Date().getTime()
}
}
this.paused=$1
if(this.onpaused.ready){
this.onpaused.sendEvent($1)
}
},__LZaddToStartTime:function($1){
this.startTime+=$1
for(var $2=0;$2<this.actAnim.length;$2++){
this.actAnim[$2].__LZaddToStartTime($1)
}
},stop:function(){
if(this.actAnim){
var $1=this.actAnim.length-1
if($1>0&&this.process=="sequential"){
$1=0
}
for(var $2=$1;$2>=0;$2--){
this.actAnim[$2].stop()
}
}
this.__LZhalt()
},__LZfinalizeAnim:function(){
this.__LZhalt()
},__LZhalt:function(){
this.isactive=false
this.updateDel.unregisterAll()
if(this.onfinish.ready){
this.onfinish.sendEvent(this)
}
if(this.onstop.ready){
this.onstop.sendEvent(new Date().getTime())
}
},checkRepeat:function(){
if(this.crepeat==null||this.crepeat==1){
this.__LZfinalizeAnim()
return true
}
if(this.crepeat>0){
this.crepeat--
if(this.onrepeat.ready){
this.onrepeat.sendEvent(new Date().getTime())
}
}
this.resetAnimator()
},destroy:function(){
this.stop()
this.updateDel.unregisterAll()
this.animators=null
this.actAnim=null
if(this.parent.animators&&this.parent.animators.length){
for(var $1=0;$1<this.parent.animators.length;$1++){
if(this.parent.animators[$1]==this){
this.parent.animators.splice($1,1)
break
}
}
for(var $1=0;$1<this.parent.actAnim.length;$1++){
if(this.parent.actAnim[$1]==this){
this.parent.actAnim.splice($1,1)
break
}
}
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},toString:function(){
return "GroupAnimator length = "+this.animators.length
}},{tagname:"animatorgroup"});(function(){
with(LzAnimatorGroup){
with(LzAnimatorGroup.prototype){
setters.start="setStart"
defaultattrs.start=true
setters.target="setTarget"
setters.paused="pause"
DeclareEvent(prototype,"ontarget")
DeclareEvent(prototype,"onduration")
DeclareEvent(prototype,"onstarted")
DeclareEvent(prototype,"onstart")
DeclareEvent(prototype,"onpaused")
DeclareEvent(prototype,"onfinish")
DeclareEvent(prototype,"onstop")
DeclareEvent(prototype,"onrepeat")
defaultattrs.ignoreplacement=true
}
}
})()
var LzAnimator=Class.make("LzAnimator",LzAnimatorGroup,{beginPoleDelta:0.25,endPoleDelta:0.25,attribute:null,construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this.primary_K=1
},setMotion:function($1){
if($1=="linear"){
this.calcNextValue=this.calcNextValueLinear
}else{
delete this.calcNextValue
if($1=="easeout"){
this.beginPoleDelta=100
}else{
if($1=="easein"){
this.endPoleDelta=15
}
}
}
},setTo:function($1){
this.origto=Number($1)
},calcControlValues:function($1){
this.currentValue=$1||0
var $2=this.indirect?-1:1
if(this.currentValue<this.to){
this.beginPole=this.currentValue-$2*this.beginPoleDelta
this.endPole=this.to+$2*this.endPoleDelta
}else{
this.beginPole=this.currentValue+$2*this.beginPoleDelta
this.endPole=this.to-$2*this.endPoleDelta
}
this.primary_K=1
var $3=1*(this.beginPole-this.to)*(this.currentValue-this.endPole)
var $4=1*(this.beginPole-this.currentValue)*(this.to-this.endPole)
if($4!=0){
this.primary_K=Math.abs($3/$4)
}
},doStart:function(){
if(this.isactive){
return
}
this.isactive=true
this.prepareStart()
this.updateDel.register(LzIdle,"onidle")
},prepareStart:function(){
this.crepeat=this.repeat
if(this.from!=null){
var $lzsc$1148294117=this.target
var $lzsc$1454881064=this.attribute
var $lzsc$261822958=Number(this.from)
if(!$lzsc$1148294117.__LZdeleted){
var $lzsc$662786229=$lzsc$1148294117.setters
if($lzsc$662786229&&$lzsc$1454881064 in $lzsc$662786229){
$lzsc$1148294117[$lzsc$662786229[$lzsc$1454881064]]($lzsc$261822958)
}else{
$lzsc$1148294117[$lzsc$1454881064]=$lzsc$261822958
var $lzsc$599999365="on"+$lzsc$1454881064
if($lzsc$599999365 in $lzsc$1148294117){
if($lzsc$1148294117[$lzsc$599999365].ready){
$lzsc$1148294117[$lzsc$599999365].sendEvent($lzsc$261822958)
}
}
}
}
}
if(this.relative){
this.to=this.origto
}else{
this.to=this.origto-this.target.getExpectedAttribute(this.attribute)
}
this.target.addToExpectedAttribute(this.attribute,this.to)
this.target.__LZincrementCounter(this.attribute)
this.currentValue=0
this.calcControlValues()
this.doBegin=true
},resetAnimator:function(){
if(this.from!=null){
var $lzsc$1077223612=this.target
var $lzsc$2146838337=this.attribute
var $lzsc$57260329=this.from
if(!$lzsc$1077223612.__LZdeleted){
var $lzsc$1397644495=$lzsc$1077223612.setters
if($lzsc$1397644495&&$lzsc$2146838337 in $lzsc$1397644495){
$lzsc$1077223612[$lzsc$1397644495[$lzsc$2146838337]]($lzsc$57260329)
}else{
$lzsc$1077223612[$lzsc$2146838337]=$lzsc$57260329
var $lzsc$2039105122="on"+$lzsc$2146838337
if($lzsc$2039105122 in $lzsc$1077223612){
if($lzsc$1077223612[$lzsc$2039105122].ready){
$lzsc$1077223612[$lzsc$2039105122].sendEvent($lzsc$57260329)
}
}
}
}
var $1=this.from-this.target.getExpectedAttribute(this.attribute)
this.target.addToExpectedAttribute(this.attribute,$1)
}
if(!this.relative){
this.to=this.origto-this.target.getExpectedAttribute(this.attribute)
this.calcControlValues()
}
this.target.addToExpectedAttribute(this.attribute,this.to)
this.target.__LZincrementCounter(this.attribute)
this.currentValue=0
this.doBegin=true
},beginAnimator:function($1){
this.startTime=$1
this.lastIterationTime=$1
if(this.onstart.ready){
this.onstart.sendEvent($1)
}
this.doBegin=false
},stop:function(){
if(!this.isactive){
return
}
var $1="e_"+this.attribute
if(!this.target[$1].c){
this.target[$1].c=0
}
this.target[$1].c--
if(this.target[$1].c<=0){
this.target[$1].c=0
this.target[$1].v=null
}else{
this.target[$1].v-=this.to-this.currentValue
}
this.__LZhalt()
},__LZfinalizeAnim:function(){
var $1="e_"+this.attribute
if(!this.target[$1].c){
this.target[$1].c=0
}
this.target[$1].c-=1
if(this.target[$1].c<=0){
this.target[$1].c=0
var $lzsc$1153693535=this.target
var $lzsc$869977507=this.attribute
var $lzsc$1245252838=this.target[$1].v
if(!$lzsc$1153693535.__LZdeleted){
var $lzsc$469238521=$lzsc$1153693535.setters
if($lzsc$469238521&&$lzsc$869977507 in $lzsc$469238521){
$lzsc$1153693535[$lzsc$469238521[$lzsc$869977507]]($lzsc$1245252838)
}else{
$lzsc$1153693535[$lzsc$869977507]=$lzsc$1245252838
var $lzsc$431615111="on"+$lzsc$869977507
if($lzsc$431615111 in $lzsc$1153693535){
if($lzsc$1153693535[$lzsc$431615111].ready){
$lzsc$1153693535[$lzsc$431615111].sendEvent($lzsc$1245252838)
}
}
}
}
this.target[$1].v=null
}
this.__LZhalt()
},calcNextValue:function($1){
var $2=this.currentValue
var $3=this.endPole
var $4=this.beginPole
var $5=Math.exp($1*1/this.duration*Math.log(this.primary_K))
if($5!=1){
var $6=$4*$3*(1-$5)
var $7=$3-$5*$4
if($7!=0){
$2=$6/$7
}
}
return $2
},calcNextValueLinear:function($1){
var $2=$1/this.duration
return $2*this.to
},update:function($1){
var $2=false
if(this.doBegin){
this.beginAnimator($1)
}else{
if(!this.paused){
var $3=$1-this.startTime
if($3<this.duration){
this.setValue(this.calcNextValue($3))
this.lastIterationTime=$1
}else{
this.setValue(this.to)
return this.checkRepeat()
}
}
}
},setValue:function($1){
var $2=$1-this.currentValue
if(this.target.setAttribute){
var $lzsc$1695335672=this.target
var $lzsc$493979173=this.attribute
var $lzsc$813556745=this.target[this.attribute]+$2
if(!$lzsc$1695335672.__LZdeleted){
var $lzsc$2009618289=$lzsc$1695335672.setters
if($lzsc$2009618289&&$lzsc$493979173 in $lzsc$2009618289){
$lzsc$1695335672[$lzsc$2009618289[$lzsc$493979173]]($lzsc$813556745)
}else{
$lzsc$1695335672[$lzsc$493979173]=$lzsc$813556745
var $lzsc$2107882225="on"+$lzsc$493979173
if($lzsc$2107882225 in $lzsc$1695335672){
if($lzsc$1695335672[$lzsc$2107882225].ready){
$lzsc$1695335672[$lzsc$2107882225].sendEvent($lzsc$813556745)
}
}
}
}
}
this.currentValue=$1
},toString:function(){
return "Animator for "+this.target+" attribute:"+this.attribute+" to:"+this.to
}},{tagname:"animator"});(function(){
with(LzAnimator){
with(LzAnimator.prototype){
setters.motion="setMotion"
setters.to="setTo"
}
}
})()
var LzLayout=Class.make("LzLayout",LzNode,{locked:2,subviews:null,updateDelegate:null,delegates:null,construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this.subviews=new Array()
if(this.immediateparent.layouts==null){
this.immediateparent.layouts=[this]
}else{
this.immediateparent.layouts.push(this)
}
this.updateDelegate=new LzDelegate(this,"update")
this.delegates=[this.updateDelegate]
if(this.immediateparent.isinited){
this.__parentInit()
}else{
this.initDelegate=new LzDelegate(this,"__parentInit",this.immediateparent,"oninit")
this.delegates.push(this.initDelegate)
}
},constructWithArgs:function($1){
this.delegates.push(new LzDelegate(this,"gotNewSubview",this.immediateparent,"onaddsubview"))
this.delegates.push(new LzDelegate(this,"removeSubview",this.immediateparent,"onremovesubview"))
var $2=this.immediateparent.subviews.length
for(var $3=0;$3<$2;$3++){
this.gotNewSubview(this.immediateparent.subviews[$3])
}
},destroy:function(){
this.releaseLayout();(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},reset:function($1){
if(this.locked){
return
}
this.update($1)
},addSubview:function($1){
if($1.getOption("layoutAfter")){
this.__LZinsertAfter($1,$1.getOption("layoutAfter"))
}else{
this.subviews.push($1)
}
},gotNewSubview:function($1){
if(!$1.getOption("ignorelayout")){
this.addSubview($1)
}
},removeSubview:function($1){
for(var $2=this.subviews.length-1;$2>=0;$2--){
if(this.subviews[$2]==$1){
this.subviews.splice($2,1)
break
}
}
this.reset()
},ignore:function($1){
for(var $2=this.subviews.length-1;$2>=0;$2--){
if(this.subviews[$2]==$1){
this.subviews.splice($2,1)
break
}
}
this.reset()
},lock:function(){
this.locked=true
},unlock:function(){
this.locked=false
this.reset()
},__LZsetLocked:function($1){
if(this.locked==$1){
return
}
if($1){
this.lock()
}else{
this.unlock()
}
},__parentInit:function(){
if(this.locked==2){
if(this.isinited){
this.unlock()
}else{
new LzDelegate(this,"unlock",this,"oninit")
}
}
},releaseLayout:function(){
if(this.delegates){
for(var $1=this.delegates.length-1;$1>=0;$1--){
this.delegates[$1].unregisterAll()
}
}
if(this.immediateparent&&this.immediateparent.layouts){
for(var $1=this.immediateparent.layouts.length-1;$1>=0;$1--){
if(this.immediateparent.layouts[$1]==this){
this.immediateparent.layouts.splice($1,1)
}
}
}
},setLayoutOrder:function($1,$2){
for(var $3=this.subviews.length-1;$3>=0;$3--){
if(this.subviews[$3]==$2){
this.subviews.splice($3,1)
break
}
}
if($1=="first"){
this.subviews.unshift($2)
}else{
if($1=="last"){
this.subviews.push($2)
}else{
for(var $3=this.subviews.length-1;$3>=0;$3--){
if(this.subviews[$3]==$1){
this.subviews.splice($3+1,0,$2)
break
}
}
}
}
this.reset()
return
},swapSubviewOrder:function($1,$2){
var $3=-1
var $4=-1
for(var $5=this.subviews.length-1;$5>=0&&($3<0||$4<0);$5--){
if(this.subviews[$5]==$1){
$3=$5
}else{
if(this.subviews[$5]==$2){
$4=$5
}
}
}
this.subviews[$4]=$1
this.subviews[$3]=$2
this.reset()
return
},__LZinsertAfter:function($1,$2){
for(var $3=this.subviews.length-1;$3>=0;$3--){
if(this.subviews[$3]==$2){
this.subviews.splice($3,0,$1)
}
}
},toString:function(){
return "LzLayout for view "+this.immediateparent
}},{tagname:"layout"});(function(){
with(LzLayout){
with(LzLayout.prototype){
setters.locked="__LZsetLocked"
}
}
})()
var LzFont=Class.make("LzFont",null,{style:null,name:null,height:null,ascent:null,descent:null,advancetable:null,lsbtable:null,rsbtable:null,initialize:function($1,$2,$3){
(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
this.name=$1.name
this.style=$3
this.fontobject=$1
$1[$3]=this
for(var $4 in $2){
if($4=="leading"){
continue
}
this[$4]=$2[$4]
}
this.height=this.ascent+this.descent
this.advancetable[13]=this.advancetable[32]
this.advancetable[160]=0
},leading:2,toString:function(){
return "Font style "+this.style+" of name "+this.name
}},null)
var LzSelectionManager=Class.make("LzSelectionManager",LzNode,{sel:null,selectedHash:null,selected:null,construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this.toggle=$2.toggle==true
this.sel=$2.selFuncName==null?"setSelected":$2.selFuncName
this.selected=new Array()
this.selectedHash=new Object()
this.lastRange=null
},select:function($1){
if(this.isSelected($1)&&(this.toggle||this.isMultiSelect($1))){
this.unselect($1)
return
}
if(this.selected.length>0&&this.isRangeSelect($1)){
var $2=this.lastRange!=null?this.lastRange:this.selected[0]
if($2!=$1){
this.selectRange($2,$1)
}
return
}
if(!this.isMultiSelect($1)){
this.clearSelection()
}
this.makeSelected($1)
},isSelected:function($1){
return this.selectedHash[$1.getUID()]
},makeSelected:function($1){
if(this.selectedHash[$1.getUID()]){
return
}
this.selectedHash[$1.getUID()]=true
this.selected.push($1)
$1[this.sel](true)
},unselect:function($1){
for(var $2=this.selected.length-1;$2>=0;$2--){
if(this.selected[$2]==$1){
this.selectedHash[$1.getUID()]=false
$1[this.sel](false)
this.selected.splice($2,1)
break
}
}
},clearSelection:function(){
var $1
while($1=this.selected.pop()){
$1[this.sel](false)
}
this.selected=new Array()
this.selectedHash=new Object()
this.lastRange=null
},getSelection:function(){
return this.selected
},selectRange:function($1,$2){
var $3=$1.immediateparent
var $4=$3.subviews
var $5=null
var $6=null
for(var $7=0;$7<$4.length;$7++){
if($4[$7]==$1){
$5=$7
}
if($4[$7]==$2){
$6=$7
}
if(null!=$5&&null!=$6){
break
}
}
var $8=$5>$6?-1:1
this.clearSelection()
this.lastRange=$1
for(var $7=$5;$7!=$6+$8;$7+=$8){
this.makeSelected($3.subviews[$7])
}
},isMultiSelect:function(){
return LzKeys.isKeyDown("control")
},isRangeSelect:function(){
return LzKeys.isKeyDown("shift")
},toString:function(){
return "LzSelectionManager"
}},{tagname:"selectionmanager"})
var LzDataSelectionManager=Class.make("LzDataSelectionManager",LzSelectionManager,{makeSelected:function($1){
var $2=$1.datapath.p
if(this.manager==null){
this.manager=$1.cloneManager
}
if($2.sel){
return
}
$2.sel=true
this.selected.push($2)
$1.datapath[this.sel](true)
if(this.manager==null){
this.singleClone=$1
}
},unselect:function($1){
if(this.manager==null){
this.manager=$1.cloneManager
}
var $2=$1.datapath.p
$2.sel=false
for(var $3=this.selected.length-1;$3>=0;$3--){
if(this.selected[$3]==$2){
this.selected.splice($3,1)
break
}
}
$1.datapath[this.sel](false)
if($1==this.singleClone){
this.singleClone=null
}
},selectRange:function($1,$2){
if(this.manager==null){
this.manager=$2.cloneManager
if(this.manager==null){
return
}
}
var $3=this.manager.nodes
var $4=-1
var $5=-1
var $6=0
var $7=$2.datapath.p
while(($4==-1||$5==-1)&&$6<$3.length){
if($3[$6]==$1){
$4=$6
}
if($3[$6]==$7){
$5=$6
}
$6++
}
var $8=$4>$5?-1:1
this.clearSelection()
this.lastRange=$1
if($4==-1||$5==-1){
return
}
for(var $6=$4;$6!=$5+$8;$6+=$8){
var $9=$3[$6]
$9.sel=true
this.selected.push($9)
this.__LZsetSelected($9,true)
}
},getSelection:function(){
var $1=[]
for(var $2=0;$2<this.selected.length;$2++){
$1.push(new LzDatapointer(null,{pointer:this.selected[$2]}))
}
return $1
},clearSelection:function(){
while(this.selected.length){
var $1=this.selected.pop()
$1.sel=false
this.__LZsetSelected($1,false)
}
this.lastRange=null
},isSelected:function($1){
if(this.manager==null){
this.manager=$1.cloneManager
}
return $1.datapath.p.sel
},__LZsetSelected:function($1,$2){
if(this.manager!=null){
var $3=this.manager.getCloneForNode($1,true)
if($3){
$3.datapath[this.sel]($2)
}else{
$1.sel=$2
}
}else{
if(!$2){
if(this.singleClone!=null&&this.singleClone.datapath.p==$1){
this.singleClone.datapath[this.sel](false)
this.singleClone=null
return
}
}
$1.sel=$2
}
}},{tagname:"dataselectionmanager"})
var LzCommand=Class.make("LzCommand",LzNode,{active:true,keys:null,setKeys:function($1){
this.keys=$1
LzKeys.callOnKeyCombo(this,$1)
},execute:function($1){
if(this.active){
if(this.onselect.ready){
this.onselect.sendEvent($1)
}
}
},keysToString:function(){
var $1={control:"Ctrl",shift:"Shift",alt:"Alt"}
var $2=""
var $3=""
var $4=this.keys.length
for(var $5=0;$5<$4-1;$5++){
$3=this.keys[$5]
if($3=="Control"){
$3="Ctrl"
}
$2=$2+$3+"+"
}
$3=this.keys[$5]
if($3=="Control"){
$3="Ctrl"
}
$2=$2+$3
return $2
}},{tagname:"command"});(function(){
with(LzCommand){
with(LzCommand.prototype){
setters.key="setKeys"
DeclareEvent(prototype,"onselect")
}
}
})()
var LzState=Class.make("LzState",LzNode,{asyncnew:false,subh:null,pooling:false,construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this.heldArgs={}
this.appliedChildren=[]
this.isapplied=false
},createChildren:function($1){
this.subh=$1
this.__LZinstantiationDone()
},setApply:function($1){
if(typeof $1=="function"){
this.addProperty("apply",$1)
return
}
if($1){
if(this.isinited){
this.apply()
}else{
new LzDelegate(this,"apply",this,"oninit")
}
}else{
if(this.isinited){
this.remove()
}
}
},apply:function(){
if(this.isapplied){
return
}
this.isapplied=true
var $1=this.parent.__LZdelegates
this.parent.__LZdelegates=null
this.parent.__LZapplyArgs(this.heldArgs)
if(this.subh){
var $2=this.subh.length
}
this.parent.__LZsetPreventInit()
for(var $3=0;$3<$2;$3++){
if(this.__LZpool&&this.__LZpool[$3]){
this.appliedChildren.push(this.__LZretach(this.__LZpool[$3]))
}else{
this.appliedChildren.push(this.parent.makeChild(this.subh[$3],this.asyncnew))
}
}
this.parent.__LZclearPreventInit()
this.parent.__LZresolveReferences()
this.__LZstatedelegates=this.parent.__LZdelegates
this.parent.__LZdelegates=$1
if(this.onapply.ready){
this.onapply.sendEvent(this)
}
},remove:function(){
if(!this.isapplied){
return
}
if(this.onremove.ready){
this.onremove.sendEvent(this)
}
this.isapplied=false
if(this.__LZstatedelegates){
for(var $1=0;$1<this.__LZstatedelegates.length;$1++){
this.__LZstatedelegates[$1].unregisterAll()
}
}
if(this.pooling&&this.appliedChildren.length){
this.__LZpool=[]
}
for(var $1=0;$1<this.appliedChildren.length;$1++){
var $2=this.appliedChildren[$1]
if(this.pooling){
if($2 instanceof LzView){
this.__LZpool.push(this.__LZdetach($2))
}else{
$2.destroy()
this.__LZpool.push(null)
}
}else{
$2.destroy()
}
}
this.appliedChildren=[]
},destroy:function(){
this.pooling=false
this.remove();(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},__LZapplyArgs:function($1){
var $2=this.addProperty
this.addProperty=function($1,$2){
this.heldArgs[$1]=$2
};(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZapplyArgs"]:this.nextMethod(arguments.callee,"__LZapplyArgs")).call(this,$1)
this.addProperty=$2
},__LZstoreRefs:function($1,$2){
var $3={}
var $4={}
for(var $5 in $1){
if(LzState.staterefs[$5]){
$4[$5]=$1[$5]
var $6=true
}else{
$3[$5]=$1[$5]
var $7=true
}
}
if($6){
(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZstoreRefs"]:this.nextMethod(arguments.callee,"__LZstoreRefs")).call(this,$4,$2)
}
if($7){
this.heldArgs[$2]=$3
}
},__LZstoreDelegates:function($1){
var $2=[]
var $3=[]
for(var $4=0;$4<$1.length;$4+=3){
if(LzState.stateevents[$1[$4]]&&!$1[$4+2]){
var $5=$3
var $6=$1[$4+1]
if(this.heldArgs[$6]){
this[$6]=this.heldArgs[$6]
delete this.heldArgs[$6]
}
this.__LZaddSetter($6,"__LZsetProperty")
}else{
var $5=$2
}
$5.push($1[$4],$1[$4+1],$1[$4+2])
}
if($3.length){
(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZstoreDelegates"]:this.nextMethod(arguments.callee,"__LZstoreDelegates")).call(this,$3)
}
if($2.length){
this.heldArgs.$delegates=$2
}
},__LZsetProperty:function($1,$2){
this[$2]=$1
},__LZdetach:function($1){
$1.setVisible(false)
return $1
},__LZretach:function($1){
$1.setVisible(true)
return $1
}},{tagname:"state",staterefs:{apply:true},stateevents:{onremove:true,onapply:true}});(function(){
with(LzState){
with(LzState.prototype){
DeclareEvent(prototype,"onapply")
DeclareEvent(prototype,"onremove")
setters.apply="setApply"
setters.$setters=null
prototype.$isstate=true
setters.asyncnew="__LZsetProperty"
setters.pooling="__LZsetProperty"
setters.__LZsourceLocation="__LZsetProperty"
}
}
})()
var LzDataNode=Trait.make("LzDataNode",null,{nodeType:null,getPreviousSibling:function(){
if(!this.parentNode){
return null
}
if(this.parentNode.__LZcoDirty){
this.parentNode.__LZupdateCO()
}
return this.parentNode.childNodes[this.__LZo-1]
},getParent:function(){
return this.parentNode
},getOffset:function(){
if(!this.parentNode){
return 0
}
if(this.parentNode.__LZcoDirty){
this.parentNode.__LZupdateCO()
}
return this.__LZo
},getNextSibling:function(){
if(!this.parentNode){
return null
}
if(this.parentNode.__LZcoDirty){
this.parentNode.__LZupdateCO()
}
return this.parentNode.childNodes[this.__LZo+1]
},childOf:function($1,$2){
var $3=$2?this:this.parentNode
while($3){
if($3==$1){
return true
}
$3=$3.parentNode
}
return false
},setOwnerDocument:function($1){
this.ownerDocument=$1
if(this.childNodes){
for(var $2=0;$2<this.childNodes.length;$2++){
this.childNodes[$2].setOwnerDocument($1)
}
}
if(this.onownerDocument&&this.onownerDocument.ready){
this.onownerDocument.sendEvent($1)
}
},__LZXMLescape:function($1){
if(typeof $1!="string"){
return $1
}
var $2=$1.length
var $3=""
for(var $4=0;$4<$2;$4++){
var $5=$1.charCodeAt($4)
if($5<32){
$3+="&#x"+LzUtils.dectohex($5,0)+";"
}else{
var $6=$1.charAt($4)
if(LzDataNode.__LZescapechars[$6]!=null){
$3+=LzDataNode.__LZescapechars[$6]
}else{
$3+=$6
}
}
}
return $3
},__LZlockFromUpdate:function($1){
this.ownerDocument.__LZdoLock($1)
},__LZunlockFromUpdate:function($1){
this.ownerDocument.__LZdoUnlock($1)
}},{ELEMENT_NODE:1,TEXT_NODE:3,DOCUMENT_NODE:9,__LZescapechars:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"},stringToLzData:function($1,$2,$3){
if($1!=null&&$1!=""){
var $4=LzXMLParser.parseXML($1,$2,$3)
var $5=LzXMLTranslator.copyXML($4,$2,$3)
return $5
}else{
return null
}
},whitespaceChars:{" ":true,"\r":true,"\n":true,"\t":true},trim:function($1){
var $2=LzDataNode.whitespaceChars
var $3=$1.length
var $4=0
var $5=$1.length-1
var $6
while($4<$3){
$6=$1.charAt($4)
if($2[$6]!=true){
break
}
$4++
}
while($5>$4){
$6=$1.charAt($5)
if($2[$6]!=true){
break
}
$5--
}
return $1.slice($4,$5+1)
}});(function(){
with(LzDataNode){
with(LzDataNode.prototype){
DeclareEvent(prototype,"onownerDocument")
prototype.getPreviousSibling.dependencies=function($1,$2){
return [this.parentNode,"childNodes",this,"parentNode"]
}
prototype.getNextSibling.dependencies=function($1,$2){
return [this.parentNode,"childNodes",this,"parentNode"]
}
}
}
})()
var LzDataElementTrait=Trait.make("LzDataElementTrait",null,{__LZo:-1,__LZcoDirty:true,__LZchangeQ:null,__LZlocker:null,insertBefore:function($1,$2){
this.__LZcoDirty=true
for(var $3=0;$3<this.childNodes.length;$3++){
if(this.childNodes[$3]==$2){
this.childNodes.splice($3,0,$1)
$1.setOwnerDocument(this.ownerDocument)
$1.parentNode=this
if($1.onparentNode.ready){
$1.onparentNode.sendEvent(this)
}
if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
}
this.ownerDocument.handleDocumentChange("insertBefore",this,0)
return $1
}
}
return null
},replaceChild:function($1,$2){
this.__LZcoDirty=true
for(var $3=0;$3<this.childNodes.length;$3++){
if(this.childNodes[$3]==$2){
this.childNodes[$3]=$1
$1.setOwnerDocument(this.ownerDocument)
$1.parentNode=this
if($1.onparentNode.ready){
$1.onparentNode.sendEvent(this)
}
if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
}
this.ownerDocument.handleDocumentChange("childNodes",this,0,$1)
return $1
}
}
return null
},removeChild:function($1){
var $2=null
this.__LZcoDirty=true
for(var $3=0;$3<this.childNodes.length;$3++){
if(this.childNodes[$3]==$1){
this.childNodes.splice($3,1)
if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
}
$2=$1
this.ownerDocument.handleDocumentChange("removeChild",this,0,$1)
}
}
return $2
},appendChild:function($1){
if(this.childNodes){
this.childNodes.push($1)
}else{
this.childNodes=[$1]
}
$1.setOwnerDocument(this.ownerDocument)
$1.parentNode=this
if($1.onparentNode.ready){
$1.onparentNode.sendEvent(this)
}
$1.__LZo=this.childNodes.length-1
if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
}
this.ownerDocument.handleDocumentChange("appendChild",this,0,$1)
return $1
},hasChildNodes:function(){
return this.childNodes.length>0
},cloneNode:function($1){
var $2=new LzDataElement(this.nodeName)
$2.setAttrs(this.attributes)
if($1){
for(var $3=0;$3<this.childNodes.length;$3++){
$2.appendChild(this.childNodes[$3].cloneNode(true))
}
}
return $2
},getAttr:function($1){
if(this.attributes){
return this.attributes[$1]
}
},setAttr:function($1,$2){
if(!this.attributes){
this.attributes={}
}
this.attributes[$1]=$2
if(this.onattributes.ready){
this.onattributes.sendEvent($1)
}
this.ownerDocument.handleDocumentChange("attributes",this,1,{name:$1,value:$2,type:"set"})
return $2
},removeAttr:function($1){
var $2=this.attributes[$1]
delete this.attributes[$1]
if(this.onattributes.ready){
this.onattributes.sendEvent($1)
}
this.ownerDocument.handleDocumentChange("attributes",this,1,{name:$1,value:$2,type:"remove"})
return $2
},hasAttr:function($1){
return this.attributes[$1]!=null
},getFirstChild:function(){
return this.childNodes[0]
},getLastChild:function(){
return this.childNodes[this.childNodes.length-1]
},__LZupdateCO:function(){
for(var $1=0;$1<this.childNodes.length;$1++){
this.childNodes[$1].__LZo=$1
}
this.__LZcoDirty=false
},setAttrs:function($1){
var $2={}
for(var $3 in $1){
$2[$3]=$1[$3]
}
this.attributes=$2
if(this.onattributes.ready){
this.onattributes.sendEvent($2)
}
if(this.ownerDocument){
this.ownerDocument.handleDocumentChange("attributes",this,1)
}
},setChildNodes:function($1){
this.childNodes=$1
for(var $2=0;$2<$1.length;$2++){
var $3=$1[$2]
$3.setOwnerDocument(this.ownerDocument)
$3.parentNode=this
if($3.onparentNode){
if($3.onparentNode.ready){
$3.onparentNode.sendEvent(this)
}
}
$3.__LZo=$2
}
this.__LZcoDirty=false
if(this.onchildNodes){
if(this.onchildNodes.ready){
this.onchildNodes.sendEvent($1)
}
}
this.ownerDocument.handleDocumentChange("childNodes",this,0)
},setNodeName:function($1){
this.nodeName=$1
if(this.onnodeName.ready){
this.onnodeName.sendEvent($1)
}
if(this.parentNode){
if(this.parentNode.onchildNodes.ready){
this.parentNode.onchildNodes.sendEvent(this)
}
if(this.parentNode.onchildNode.ready){
this.parentNode.onchildNode.sendEvent(this)
}
}
this.ownerDocument.handleDocumentChange("childNodeName",this.parentNode,0)
this.ownerDocument.handleDocumentChange("nodeName",this,1)
},__LZgetText:function(){
var $1=""
for(var $2=0;$2<this.childNodes.length;$2++){
var $3=this.childNodes[$2]
if($3.nodeType==LzDataNode.TEXT_NODE){
$1+=$3.data
}
}
return $1
},getElementsByTagName:function($1){
var $2=[]
for(var $3=0;$3<this.childNodes.length;$3++){
if(this.childNodes[$3].nodeName==$1){
$2.push(this.childNodes[$3])
}
}
return $2
},__LZlt:"<",__LZgt:">",serialize:function(){
return this.serializeInternal(Infinity)
},serializeInternal:function($1){
if(arguments.length<1){
$1=Infinity
}
var $2=this.__LZlt+this.nodeName
for(var $3 in this.attributes){
$2+=" "+$3+'="'+this.__LZXMLescape(this.attributes[$3])+'"'
if($2.length>$1){
break
}
}
if($2.length<=$1&&this.childNodes&&this.childNodes.length){
$2+=this.__LZgt
for(var $4=0;$4<this.childNodes.length;$4++){
$2+=this.childNodes[$4].serialize($1)
if($2.length>$1){
break
}
}
$2+=this.__LZlt+"/"+this.nodeName+this.__LZgt
}else{
$2+="/"+this.__LZgt
}
if($2.length>$1){
$2=Debug.abbreviate($2,$1)
}
return $2
},_dbg_name:function(){
return this.serializeInternal(Debug.printLength)
},handleDocumentChange:function($1,$2,$3,$4){
var $5={who:$2,what:$1,type:$3}
if($4){
$5.cobj=$4
}
if(this.__LZchangeQ){
this.__LZchangeQ.push($5)
}else{
if(this.onDocumentChange.ready){
this.onDocumentChange.sendEvent($5)
}
}
},toString:function(){
var $1=this.serialize()
return $1
},__LZdoLock:function($1){
if(!this.__LZchangeQ){
this.__LZchangeQ=[]
this.__LZlocker=$1
}
},__LZdoUnlock:function($1){
if(this.__LZlocker!=$1){
return
}
var $2=this.__LZchangeQ
this.__LZchangeQ=null
if($2!=null){
for(var $3=0;$3<$2.length;$3++){
var $4=true
var $5=$2[$3]
for(var $6=0;$6<$3;$6++){
var $7=$2[$6]
if($5.who==$7.who&&$5.what==$7.what&&$5.type==$7.type){
$4=false
break
}
}
if($4){
this.handleDocumentChange($5.what,$5.who,$5.type)
}
}
}
}},{initialize:function($1){
if($1.hasOwnProperty("setters")){
$1.setters.attributes="setAttrs"
$1.setters.childNodes="setChildNodes"
$1.setters.nodeName="setNodeName"
$1.setters.ownerDocument="setOwnerDocument"
}
},valueToElement:function($1){
var $2=new LzDataElement("element",{},LzDataElementTrait.__LZv2E($1))
return $2
},__LZv2E:function($1){
var $2=typeof $1
$2.toLowerCase()
var $3=[]
if($2=="object"){
if($1 instanceof LzDataElement||$1 instanceof LzDataText){
$3[0]=$1
}else{
if($1 instanceof Date){
$2="date"
}else{
if($1 instanceof Array){
$2="array"
var $4=$1.__LZtag!=null?$1.__LZtag:"item"
for(var $5=0;$5<$1.length;$5++){
var $6=this.__LZv2E($1[$5])
$3[$5]=new LzDataElement($4,null,$6)
}
}else{
$2="struct"
var $5=0
for(var $7 in $1){
if($7.indexOf("__LZ")==0){
continue
}
$3[$5++]=new LzDataElement($7,null,this.__LZv2E($1[$7]))
}
}
}
}
}else{
if($1!=null){
$3[0]=new LzDataText($1)
}
}
if($3.length==0){
$3=null
}
return $3
}});(function(){
with(LzDataElementTrait){
with(LzDataElementTrait.prototype){
DeclareEvent(prototype,"onDocumentChange")
DeclareEvent(prototype,"onparentNode")
DeclareEvent(prototype,"onchildNode")
DeclareEvent(prototype,"onchildNodes")
DeclareEvent(prototype,"onattributes")
DeclareEvent(prototype,"onnodeName")
prototype.getAttr.dependencies=function($1,$2){
return [$2,"attributes"]
}
prototype.getFirstChild.dependencies=function($1,$2){
return [this,"childNodes"]
}
prototype.getLastChild.dependencies=function($1,$2){
return [this,"childNodes"]
}
prototype.hasAttr.dependencies=function($1,$2){
return [$2,"attributes"]
}
}
}
})()
var LzMiniNode=Class.make("LzMiniNode",null,{setAttribute:LzNode.prototype.setAttribute},{initialize:function($1){
if(!$1.hasOwnProperty("setters")){
$1["setters"]=new LzInheritedHash($1["setters"])
}
}})
var LzDataElement=Class.make("LzDataElement",[LzDataElementTrait,LzDataNode,LzMiniNode],{initialize:function($1,$2,$3){
(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
this.nodeName=$1
this.attributes=$2
this.ownerDocument=this
if($3==null){
this.setChildNodes([])
}else{
this.setChildNodes($3)
}
},nodeName:null,nodeType:LzDataNode.ELEMENT_NODE,childNodes:null,attributes:null},{makeNodeList:function($1,$2){
var $3=[]
for(var $4=0;$4<$1;$4++){
$3[$4]=new LzDataElement($2,{},null)
}
return $3
},valueToElement:LzDataElementTrait.valueToElement})
var LzDataText=Class.make("LzDataText",[LzDataNode,LzMiniNode],{initialize:function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
this.data=$1
},nodeType:LzDataNode.TEXT_NODE,data:"",length:0,setData:function($1){
this.data=$1
if(this.ondata&&this.ondata.ready){
this.ondata.sendEvent($1)
}
if(this.ownerDocument){
this.ownerDocument.handleDocumentChange("data",this,1)
}
},cloneNode:function(){
var $1=new LzDataText(this.data)
return $1
},serialize:function(){
return this.__LZXMLescape(this.data)
},toString:function(){
return this.data
}},null);(function(){
with(LzDataText){
with(LzDataText.prototype){
DeclareEvent(LzDataText.prototype,"onDocumentChange")
DeclareEvent(LzDataText.prototype,"onparentNode")
DeclareEvent(LzDataText.prototype,"onchildNode")
DeclareEvent(LzDataText.prototype,"onchildNodes")
DeclareEvent(LzDataText.prototype,"onattributes")
DeclareEvent(LzDataText.prototype,"onnodeName")
setters.data="setData"
}
}
})()
var LzDataRequest=Class.make("LzDataRequest",LzNode,{requestor:null,src:null,timeout:Infinity,status:null,rawdata:null,error:null,initialize:function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
this.requestor=$1
}},{tagname:"datarequest",SUCCESS:"success",TIMEOUT:"timeout",ERROR:"error",READY:"ready"});(function(){
with(LzDataRequest){
with(LzDataRequest.prototype){
DeclareEvent(prototype,"onstatus")
}
}
})()
var LzDataProvider=Class.make("LzDataProvider",LzNode,{doRequest:function($1){

}},{tagname:"dataprovider"})
var LzHTTPDataProvider=Class.make("LzHTTPDataProvider",LzDataProvider,{makeLoader:function($1){
var $2=$1.proxied
var $3=new LzHTTPLoader(this,$2)
$1.loader=$3
$3.loadSuccess=this.loadSuccess
$3.loadError=this.loadError
$3.loadTimeout=this.loadTimeout
$3.setProxied($2)
var $4="secure" in $1?$1.secure:null
if($4==null){
if($1.src.substring(0,5)=="https"){
$4=true
}
}
if($4){
$3.baserequest=LzBrowser.getBaseURL($4,$1.secureport)
}
$3.secure=$4
if($4){
$3.secureport=$1.secureport
}
return $3
},abortLoadForRequest:function($1){
$1.loader.abort()
},doRequest:function($1){
var $2=$1.proxied
var $3=$1.loader
if($3==null||$1.multirequest==true||$1.queuerequests==true){
$3=this.makeLoader($1)
}
$3.dataRequest=$1
$3.setQueueing($1.queuerequests)
$3.setTimeout($1.timeout)
$3.setOption("cacheable",$1.cacheable==true)
$3.setOption("timeout",$1.timeout)
$3.setOption("trimwhitespace",$1.trimwhitespace==true)
$3.setOption("nsprefix",$1.nsprefix==true)
$3.setOption("sendheaders",$1.getresponseheaders==true)
if($1.clientcacheable!=null){
$3.setOption("ccache",$1.clientcacheable)
}
var $4={}
var $5=$1.requestheaders
if($5!=null){
var $6=$5.getNames()
for(var $7=0;$7<$6.length;$7++){
var $8=$6[$7]
var $9=$5.getValue($8)
if($2){
$4[$8]=$9
}else{
$3.setRequestHeader($8,$9)
}
}
}
var $10=$1.queryparams
var $11=$1.querystring
var $12=""
var $13="?"
var $14=$1.postbody
if($10!=null){
var $15=$10.getNames()
for(var $7 in $15){
var $16=$15[$7]
if(!$2&&$16=="lzpostbody"){
$14=$10.getValue($16)
}else{
$13+=$12+$16+"="+encodeURIComponent($10.getValue($16))
$12="&"
}
}
}
if($11!=null&&$11.length>0){
$13+=$12+$11
}
var $17=$1.src
if($13=="?"){

}else{
if($17.indexOf("?")>=0){
$17=$17+"&"+$13.substring(1)
}else{
$17=$17+$13
}
}
if($2){
$17=$3.makeProxiedURL($17,$1.method,"xmldata",$4)
}else{
if(!$1.clientcacheable){
var $18="__lzbc__="+new Date().getTime()
if($17.indexOf("?")>=0){
$17=$17+"&"+$18
}else{
$17=$17+"?"+$18
}
}
}
$1.status="loading"
$3.open($2?"POST":$1.method,$17,null,null)
$3.send($14)
},loadSuccess:function($1,$2){
var $3=$1.dataRequest
$3.status=LzDataRequest.SUCCESS
$1.owner.loadResponse($3,$2)
},loadError:function($1,$2){
var $3=$1.dataRequest
$3.status="error"
$1.owner.loadResponse($3,$2)
},loadTimeout:function($1,$2){
var $3=$1.dataRequest
$3.status=LzDataRequest.TIMEOUT
$1.owner.loadResponse($3,$2)
},setRequestError:function($1,$2){
$1.error=$2
$1.status=LzDataRequest.ERROR
},loadResponse:function($1,$2){
var $3=new LzParam()
var $4=null
if($2==null){
this.setRequestError($1,"client could not parse XML from server")
$1.onstatus.sendEvent($1)
return
}
var $5=$1.proxied
if($2.childNodes[0].nodeName=="error"){
this.setRequestError($1,$2.childNodes[0].attributes["msg"])
$1.onstatus.sendEvent($1)
return
}
if($5){
var $6="childNodes" in $2.childNodes[1]?$2.childNodes[1].childNodes:null
if($6!=null){
for(var $7=0;$7<$6.length;$7++){
var $8=$6[$7]
if($8.attributes){
$3.addValue($8.attributes.name,$8.attributes.value)
}
}
}
if($2.childNodes[0].childNodes){
$4=$2.childNodes[0].childNodes[0]
}
}else{
$4=$2
}
$1.xmldata=$4
$1.responseheaders=$3
$1.rawdata=$1.loader.getResponse()
$1.onstatus.sendEvent($1)
}},null)
var LzHTTPDataRequest=Class.make("LzHTTPDataRequest",LzDataRequest,{method:"GET",postbody:null,proxied:null,multirequest:false,queuerequests:false,queryparams:null,querystring:"",requestheaders:null,getresponsheaders:false,responseheaders:null,cacheable:false,clientcacheable:null,trimwhitespace:false,nsprefix:false,xmldata:null,loadtime:0,secure:false,secureport:null,loader:null},null)
var httpdataprovider=new LzHTTPDataProvider()
var defaultdataprovider=httpdataprovider
var LzDataset=Class.make("LzDataset",[LzDataElementTrait,LzDataNode,LzNode],{dataprovider:defaultdataprovider,multirequest:false,dataRequest:null,dataRequestClass:LzHTTPDataRequest,dsloadDel:null,timeout:60000,postbody:null,acceptencodings:false,params:null,nsprefix:false,getresponseheaders:false,querytype:"GET",trimwhitespace:false,nodeType:LzDataNode.DOCUMENT_NODE,cacheable:false,querystring:null,request:false,autorequest:false,headers:null,proxied:null,responseheaders:null,construct:function($1,$2){
this.queuerequests=false
this.oncanvas=$1==canvas||$1==null
if(this._instanceAttrs["name"]==null){
this._instanceAttrs["name"]="localdata"
}
if("port" in $2&&$2.port&&!("secureport" in $2&&$2.secureport)){
$2.secureport=$2.port
}
if("querytype" in $2&&$2.querytype){
this.setQueryType($2.querytype)
}
if("src" in $2&&$2.src){
this.src=$2.src
}else{
this.src=null
}
this.ownerDocument=this
if("timeout" in $2&&$2.timeout){
this.timeout=$2.timeout
}else{
this.timeout=canvas.dataloadtimeout
};(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
},setName:function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["setName"]:this.nextMethod(arguments.callee,"setName")).apply(this,arguments)
this.nodeName=$1
if(!("datasets" in canvas)||null==canvas.datasets){
canvas.datasets={}
}
if(this.oncanvas){
global[$1]=this
canvas[$1]=this
}else{
$1=this.parent.getUID()+"."+$1
}
if(null!=canvas.datasets[$1]){

}
canvas.datasets[$1]=this
},destroy:function($1){
if(this.dsloadDel){
this.dsloadDel.unregisterAll()
}
var $2=this.name
if(this.oncanvas){
if(canvas[$2]===this){
delete canvas[$2]
}
if(global[$2]===this){
delete global[$2]
}
}else{
$2=this.parent.getUID()+"."+$2
}
if(canvas.datasets[$2]===this){
delete canvas.datasets[$2]
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},getSrc:function(){
return this.src
},getQueryString:function(){
if(typeof this.querystring=="undefined"){
return ""
}else{
return this.querystring
}
},getParams:function(){
if(this.params==null){
new LzParam(this,{name:"params"})
}
return this.params
},getStatusCode:function(){
return 200
},setData:function($1,$2){
if($1==null){
return
}
if($1 instanceof Array){
this.setChildNodes($1)
}else{
this.setChildNodes([$1])
}
this.data=$1
if("responseheaders" in this&&this.responseheaders!=null){
this.responseheaders.destroy()
}
this.responseheaders=$2
if(this.ondata.ready){
this.ondata.sendEvent(this)
}
},gotError:function($1){
this.errorstring=$1
if(this.onerror.ready){
this.onerror.sendEvent(this)
}
},gotTimeout:function(){
if(this.ontimeout.ready){
this.ontimeout.sendEvent(this)
}
},getContext:function(){
return this
},getDataset:function(){
return this
},getPointer:function(){
var $1=new LzDatapointer(null)
$1.p=this.getContext()
return $1
},setQueryString:function($1){
this.params=null
if(typeof $1=="object"){
if($1 instanceof LzParam){
this.querystring=$1.toString()
}else{
var $2=new LzParam(this)
for(var $3 in $1){
$2.setValue($3,$1[$3],true)
}
this.querystring=$2.toString()
$2.destroy()
}
}else{
this.querystring=$1
}
if(this.autorequest){
this.doRequest()
}
},setSrc:function($1){
var $2=new LzURL($1)
this.querystring=$2.query
$2.query=null
this.src=$2.toString()
if(this.autorequest){
this.doRequest()
}
},setProxyRequests:function($1){
if(typeof $1!="string"){

}else{
this.proxied=$1
}
},setRequest:function($1){
this.request=$1
if(!$1){
return
}
if(!this.isinited){
this.reqOnInitDel=new LzDelegate(this,"doRequest",this,"oninit")
}
},getLoadTime:function(){

},setQueryParam:function($1,$2){
this.querystring=null
if(!this.params){
new LzParam(this,{name:"params"})
}
this.params.setValue($1,$2)
if(this.autorequest){
this.doRequest()
}
},setQueryParams:function($1){
this.querystring=null
if(!this.params){
this.params=new LzParam(this,{name:"params"})
}
if($1){
this.params.addObject($1)
}else{
if($1==null){
this.params.remove()
}
}
if($1&&this.autorequest){
this.doRequest()
}
},isProxied:function(){
var $1=canvas.proxied
if(this.proxied!=null&&this.proxied!="inherit"){
$1=this.proxied=="true"
}
if(this.proxied!=null&&this.proxied!="inherit"){
$1=this.proxied=="true"
}
return $1
},doRequest:function(){
if(this.multirequest||this.dataRequest==null){
this.dataRequest=new (this.dataRequestClass)(this)
}
var $1=this.dataRequest
$1.src=this.src
$1.timeout=this.timeout
$1.status=$1.READY
$1.method=this.querytype
var $2=null
if(this.params){
$2=this.params.getValue("lzpostbody")
}
if($2!=null){
$1.postbody=$2
}
$1.proxied=this.isProxied()
$1.queuerequests=this.queuerequests
$1.queryparams=this.params
$1.querystring=this.querystring
$1.requestheaders=this.headers
$1.getresponseheaders=this.getresponseheaders
$1.secureport=this.secureport
$1.cacheable=this.cacheable
$1.clientcacheable=this.clientcacheable
$1.trimwhitespace=this.trimwhitespace
$1.nsprefix=this.nsprefix
if(this.dsloadDel==null){
this.dsloadDel=new LzDelegate(this,"handleDataResponse",$1,"onstatus")
}else{
this.dsloadDel.register($1,"onstatus")
}
this.dataprovider.doRequest($1)
},handleDataResponse:function($1){
if(this.dsloadDel!=null){
this.dsloadDel.unregisterFrom($1.onstatus)
}
if($1.status==LzDataRequest.SUCCESS){
this.setData($1.xmldata,$1.responseheaders)
}else{
if($1.status==LzDataRequest.ERROR){
this.gotError($1.error)
}else{
if($1.status==LzDataRequest.TIMEOUT){
this.gotTimeout()
}
}
}
},setAutorequest:function($1){
this.autorequest=$1
},getErrorString:function(){
return this.errorstring
},getRequestHeaderParams:function(){
return this.headers
},clearRequestHeaderParams:function(){
if(this.headers){
this.headers.remove()
}
},getResponseHeader:function($1){
return this.dataRequest.responseheaders[$1]
},setQueryType:function($1){
this.querytype=$1.toUpperCase()
},setPostBody:function($1){
this.postbody=$1
},abort:function(){
this.dataprovider.abortLoadForRequest(this.dataRequest)
},getAllResponseHeaders:function(){
return this.responseheaders
},setHeader:function($1,$2){
if(!this.headers){
this.headers=new LzParam(this)
}
this.headers.setValue($1,$2)
},setInitialData:function($1){
if($1!=null){
var $2=LzDataNode.stringToLzData($1,this.trimwhitespace,this.nsprefix)
this.setData($2.childNodes)
}
},toString:function(){
return "LzDataset "+":"+this.name
}},{tagname:"dataset"});(function(){
with(LzDataset){
with(LzDataset.prototype){
DeclareEvent(prototype,"ondata")
DeclareEvent(prototype,"onerror")
DeclareEvent(prototype,"ontimeout")
setters.data="setData"
setters.src="setSrc"
setters.autorequest="setAutorequest"
setters.request="setRequest"
setters.initialdata="setInitialData"
}
}
})()
var __LzHttpDatasetPoolClass=Class.make("__LzHttpDatasetPoolClass",null,{_uid:0,_p:[],get:function($1,$2,$3,$4){
var $5
if(this._p.length>0){
$5=this._p[this._p.length-1]
this._p.length=this._p.length-1
}else{
$5=new LzDataset(null,{name:"LzHttpDatasetPool"+this._uid,type:"http",acceptencodings:$4?$4:false})
this._uid++
}
if($1!=null){
$1.register($5,"ondata")
}
if($2!=null){
$2.register($5,"onerror")
}
if($3!=null){
$3.register($5,"ontimeout")
}
return $5
},recycle:function($1){
$1.setQueryParams(null)
if($1["ondata"]){
$1.ondata.clearDelegates()
}
if($1["ontimeout"]){
$1.ontimeout.clearDelegates()
}
if($1["onerror"]){
$1.onerror.clearDelegates()
}
this._p[this._p.length]=$1
}},null)
var LzHttpDatasetPool=new __LzHttpDatasetPoolClass()
var LzDatapointer=Class.make("LzDatapointer",LzNode,{p:null,data:null,context:null,__LZtracking:null,__LZtrackDel:null,rerunxpath:false,childOrSelf:function($1){
var $2=this.p
do{
if($2==$1){
return true
}
$2=$2.$p
}while($2&&$2.$n<=this.p.$n)
},gotError:function($1){
if(this.onerror.ready){
this.onerror.sendEvent($1)
}
},gotTimeout:function($1){
if(this.ontimeout.ready){
this.ontimeout.sendEvent($1)
}
},getXPath:function($1){
var $2=this.xpathQuery($1)
var $3
if($2[0].nodeType){
$3=[]
for(var $4=0;$4<$2.length;$4++){
$3[$4]=new LzDatapointer(null,{p:$2[$4]})
}
}else{
if($2.nodeType){
$3=new LzDatapointer(null,{p:$2})
}else{
$3=$2
}
}
return $3
},xpathQuery:function($1){
var $2=this.parsePath($1)
var $3=this.__LZgetNodes($2,$2.context?$2.context:this.p)
if(!$3){
return null
}
if($2.aggOperator!=null){
if($2.aggOperator=="last"){
return $3.length||this.__LZgetLast()
}
if($2.aggOperator=="position"){
if($3.length){
var $4=[]
for(var $5=0;$5<$3.length;$5++){
$4.push($5+1)
}
return $4
}else{
return this.__LZgetPosition()
}
}
}else{
if($2.operator!=null){
if($3.length){
var $6=[]
for(var $5=0;$5<$3.length;$5++){
$6.push(this.__LZprocessOperator($3[$5],$2))
}
return $6
}else{
return this.__LZprocessOperator($3,$2)
}
}else{
return $3
}
}
},setPointer:function($1){
if(!canvas.__LZoldOnData){
this.setXPath(null)
if($1!=null){
this.setDataContext($1.ownerDocument)
}else{
this.__LZsetTracking(null)
}
}
var $2=this.data!=$1
var $3=this.p!=$1
this.p=$1
this.data=$1
this.__LZsendUpdate($2,$3)
return $1!=null
},getDataset:function(){
if(this.p==null){
if(this.context==this){
return null
}
return this.context.getDataset()
}
return this.p.ownerDocument
},setXPath:function($1){
var $2=$1
if(!$2){
this.xpath=null
this.parsedPath=null
if(this.p){
this.__LZsetTracking(this.p.ownerDocument)
}
return
}
this.xpath=$1
this.parsedPath=this.parsePath($1)
if(this.rerunxpath&&this.parsedPath.hasDotDot&&!this.parsedPath.context){
this.__LZspecialDotDot=true
}else{
if(this.__LZdotdotCheckDel){
this.__LZdotdotCheckDel.unregisterAll()
}
}
if(canvas.__LZoldOnData){
if(this.parsedPath.context&&!this.parsedPath.selectors.length&&!this.rerunxpath){
this.__LZspecialOndata=true
}else{
if(this.__LZspecialOndata){
delete this.__LZspecialOndata
}
}
}
this.setDataContext(this.parsedPath.context)
return this.runXPath()
},runXPath:function(){
if(!this.parsedPath){
return
}
var $1=null
if(this.context&&"getContext" in this.context){
$1=this.context.getContext()
}
if($1){
var $2=this.__LZgetNodes(this.parsedPath,$1,0)
}else{
var $2=null
}
if(!$2){
this.__LZHandleNoNodes()
return false
}else{
if($2.length){
this.__LZHandleMultiNodes($2)
return false
}else{
this.__LZHandleSingleNode($2)
return true
}
}
},__LZsetupDotDot:function($1){
if(this.__LZlastdotdot!=$1.ownerDocument){
if(!this.__LZdotdotCheckDel){
this.__LZdotdotCheckDel=new LzDelegate(this,"__LZcheckDotDot")
}else{
this.__LZdotdotCheckDel.unregisterAll()
}
this.__LZlastdotdot=$1.ownerDocument
this.__LZdotdotCheckDel.register(this.__LZlastdotdot,"onDocumentChange")
}
},__LZHandleSingleNode:function($1){
if(this.__LZspecialDotDot){
this.__LZsetupDotDot($1)
}
this.__LZupdateLocked=true
this.__LZpchanged=$1!=this.p
this.p=$1
this.__LZsetData()
this.__LZupdateLocked=false
if(this.__LZspecialOndata){
if($1.childNodes.length){
if(this.ondata&&!this.__LZoldOndataWarn){
this.__LZoldOndataWarn=true
}
this.p=this.context
if(this.ondata.ready){
this.ondata.sendEvent(this.p)
}
}
return
}
this.__LZsendUpdate()
},__LZHandleNoNodes:function(){
var $1=this.p!=null
var $2=this.data!=null
this.p=null
this.data=null
this.__LZsendUpdate($2,$1)
},__LZHandleMultiNodes:function($1){
this.__LZHandleNoNodes()
},__LZsetData:function(){
if(this.parsedPath&&this.parsedPath.aggOperator!=null){
if(this.parsedPath.aggOperator=="last"){
this.data=this.__LZgetLast()
this.__LZsendUpdate(true)
}
if(this.parsedPath.aggOperator=="position"){
this.data=this.__LZgetPosition()
this.__LZsendUpdate(true)
}
}else{
if(this.parsedPath&&this.parsedPath.operator!=null){
this.__LZsimpleOperatorUpdate()
}else{
if(this.data!=this.p){
this.data=this.p
this.__LZsendUpdate(true)
}
}
}
},__LZgetLast:function(){
if(this.context==this){
return 1
}
return this.context.__LZgetLast()||1
},__LZgetPosition:function(){
if(this.context==this){
return 1
}
return this.context.__LZgetPosition()||1
},__LZupdateLocked:false,__LZpchanged:false,__LZdchanged:false,__LZsendUpdate:function($1,$2){
this.__LZdchanged=$1||this.__LZdchanged
this.__LZpchanged=$2||this.__LZpchanged
if(this.__LZupdateLocked){
return false
}
if(this.__LZdchanged){
if(this.ondata.ready){
this.ondata.sendEvent(this.data)
}
this.__LZdchanged=false
}
if(this.__LZpchanged){
if(this.onp.ready){
this.onp.sendEvent(this.p)
}
this.__LZpchanged=false
if(this.onDocumentChange.ready){
this.onDocumentChange.sendEvent({who:this.p,type:2,what:"context"})
}
}
return true
},isValid:function(){
return this.p!=null
},__LZsimpleOperatorUpdate:function(){
var $1=this.__LZprocessOperator(this.p,this.parsedPath)
var $2=false
if(this.data!=$1||this.parsedPath.operator=="attributes"){
this.data=$1
$2=true
}
this.__LZsendUpdate($2)
},ppcache:{},parsePath:function($1){
if($1 instanceof LzDatapath){
$1=$1.xpath
}
var $2=this.ppcache[$1]
if($2){
var $3=$2["islocaldata"]
if($3){
$2.context=this.getLocalDataContext($3)
}
}else{
var $2=new LzParsedPath($1,this)
this.ppcache[$1]=$2
}
return $2
},getLocalDataContext:function($1){
var $2=this.parent
if($1){
var $3=$1
for(var $4=0;$4<$3.length;$4++){
if($2){
$2=$2[$3[$4]]
}
}
if($2&&$2 instanceof LzDataset==false&&$2["localdata"] instanceof LzDataset==true){
$2=$2["localdata"]
}
}
if($2!=null&&$2 instanceof LzDataset){
return $2
}else{

}
},pathSymbols:{"/":1,"..":2,"*":3,".":4},__LZgetNodes:function($1,$2,$3){
var $4
if($2==null){
return false
}
if($1.selectors!=null){
var $5=$1.selectors.length
var $6=0
for(var $7=$3?$3:0;$7<$5;$7++){
var $8=$1.selectors[$7]
var $9=this.pathSymbols[$8]
var $10=$1.selectors[$7+1]
if($10&&$10.pred=="range"){
var $11=$1.selectors[++$7]
}else{
var $11=null
}
$4=null
if(null!=$8.pred){
if($8.pred=="hasattr"){
$2=$2.hasAttr($8.attr)?$2:false
}else{
if($8.pred=="attrval"){
if($2.attributes!=null){
$2=$2.attributes[$8.attr]==$8.val?$2:false
}else{
$2=false
}
}
}
}else{
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
$4=[]
var $12=0
if($2.childNodes){
for(var $13=0;$13<$2.childNodes.length;$13++){
if($2.childNodes[$13].nodeType==LzDataNode.ELEMENT_NODE){
$12++
if(!$11||$12>=$11[0]){
$4.push($2.childNodes[$13])
}
if($11&&$12==$11[1]){
break
}
}
}
}
}
}
}
}
}
if($4!=null){
if($4.length>1){
var $14=[]
if($7==$5-1){
return $4
}
for(var $13=0;$13<$4.length;$13++){
var $15=this.__LZgetNodes($1,$4[$13],$7+1)
if($15!=null&&$15.length>0){
for(var $16=0;$16<$15.length;$16++){
if($15[$16]){
$14.push($15[$16])
}
}
}else{
if($15){
$14.push($15)
}
}
}
if(!$14.length){
return null
}else{
if($14.length==1){
return $14[0]
}else{
return $14
}
}
}else{
$2=$4[0]
}
}
if(!$2){
return false
}
}
}
return $2
},getContext:function(){
return this.p
},nodeByName:function($1,$2,$3){
var $4=[]
var $5=0
if(!$3){
var $3=this.p
if(!this.p){
return null
}
}
if($3.childNodes){
for(var $6=0;$6<$3.childNodes.length;$6++){
if($3.childNodes[$6].nodeName==$1){
$5++
if(!$2||$5>=$2[0]){
$4.push($3.childNodes[$6])
}
if($2&&$5==$2[1]){
break
}
}
}
}
return $4
},__LZsetRerunXPath:function($1){
this.rerunxpath=$1
if(this.onrerunxpath.ready){
this.onrerunxpath.sendEvent($1)
}
},dupePointer:function(){
var $1=new LzDatapointer()
$1.setFromPointer(this)
return $1
},__LZdoSelect:function($1,$2){
$2=$2?$2:1
var $3=this.p
for(;$3!=null&&$2>0;$2--){
$3=$3[$1]()
}
if($3!=null){
this.setPointer($3)
return true
}
return false
},selectNext:function($1){
return this.__LZdoSelect("getNextSibling",$1)
},selectPrev:function($1){
return this.__LZdoSelect("getPreviousSibling",$1)
},selectChild:function($1){
return this.__LZdoSelect("getFirstChild",$1)
},selectParent:function($1){
return this.__LZdoSelect("getParent",$1)
},selectNextParent:function(){
var $1=this.p
if(this.selectParent()&&this.selectNext()){
return true
}else{
this.setPointer($1)
return false
}
},getNodeOffset:function(){
this.p.parentNode.__LZupdateCO()
return this.p.__LZo+1
},getNodeName:function(){
if(!this.p){
return
}
return this.p.nodeName
},setNodeName:function($1){
if(!this.p){
return
}
this.p.setNodeName($1)
},getNodeAttributes:function(){
if(!this.p){
return
}
return this.p.attributes
},getNodeAttribute:function($1){
if(!this.p){
return
}
return this.p.attributes[$1]
},setNodeAttribute:function($1,$2){
if(!this.p){
return
}
this.p.setAttr($1,$2)
},deleteNodeAttribute:function($1){
if(!this.p){
return
}
this.p.removeAttr($1)
},getNodeText:function(){
if(!this.p){
return
}
return this.p.__LZgetText()
},getOtherNodeText:function($1){
var $2=""
if($1.c!=null){
var $3=$1.c.length
for(var $4=0;$4<$3;$4++){
var $5=$1.c[$4]
if($5.t!=undefined){
$2+=$5.t
}
}
}
return $2
},setNodeText:function($1){
if(!this.p){
return
}
var $2=false
for(var $3=0;$3<this.p.childNodes.length;$3++){
if(this.p.childNodes[$3].nodeType==LzDataNode.TEXT_NODE){
this.p.childNodes[$3].setData($1)
$2=true
break
}
}
if(!$2){
this.p.appendChild(new LzDataText($1))
}
},getNodeCount:function(){
if(!this.p){
return 0
}
return this.p.childNodes.length||0
},addNode:function($1,$2,$3){
if(!this.p){
return
}
var $4=new LzDataElement($1,$3)
if($2!=null){
$4.appendChild(new LzDataText($2))
}
this.p.appendChild($4)
return $4
},deleteNode:function(){
if(!this.p){
return
}
var $1=this.p
if(!this.rerunxpath){
if(!this.selectNext()){
this.__LZHandleNoNodes()
}
}
$1.parentNode.removeChild($1)
return $1
},sendDataChange:function($1){
this.getDataset().sendDataChange($1)
},_openNode:"<",_closeNode:">",_closeChar:"/",comparePointer:function($1){
return this.p==$1.p
},addNodeFromPointer:function($1){
if(!$1.p){
return
}
if(!this.p){
return
}
var $2=$1.p.cloneNode(true)
this.p.appendChild($2)
return new LzDatapointer(null,{pointer:$2})
},setFromPointer:function($1){
this.setPointer($1.p)
},__LZprocessOperator:function($1,$2,$3){
if($1==null){
return
}
if($2.operatorArgs!=null){
return $1[$2.operator]($2.operatorArgs)
}
var $4
if($2.operator.indexOf("attributes.")==0){
$4=["attributes",$2.operator.substr(11)]
}else{
$4=$2.operator.split(".")
}
var $5=$1
for(var $6=0;$6<$4.length;$6++){
var $7=$4[$6]
if($5==null||!($7 in $5)){
return
}else{
$5=$5[$7]
}
}
return $5
},makeRootNode:function(){
return new LzDataElement("root")
},finishRootNode:function($1){
return $1.childNodes[0]
},makeElementNode:function($1,$2,$3){
var $4=new LzDataElement($2,$1)
$3.appendChild($4)
return $4
},makeTextNode:function($1,$2){
var $3=new LzDataText($1)
$2.appendChild($3)
return $3
},serialize:function(){
if(this.p==null){
return
}
return this.p.serialize()
},setDataContext:function($1){
if($1==null){
this.context=this
if(this.p){
this.__LZsetTracking(this.p.ownerDocument)
}
}else{
if(this.context!=$1){
this.context=$1
if(this.errorDel!=null){
this.errorDel.unregisterAll()
this.timeoutDel.unregisterAll()
}
this.__LZsetTracking($1)
if(canvas.__LZoldOnData&&!this.__LZspecialOndata){
if(this.__LZoldDataDel){
this.__LZoldDataDel.unregisterAll()
}else{
this.__LZoldDataDel=new LzDelegate(this,"__LZHandleDocChange")
}
this.__LZoldDataDel.register(this.context,"onDocumentChange")
}
var $2=this.xpath
if($2){
if(this.errorDel==null){
this.errorDel=new LzDelegate(this,"gotError")
this.timeoutDel=new LzDelegate(this,"gotTimeout")
}
this.errorDel.register($1,"onerror")
this.timeoutDel.register($1,"ontimeout")
}
}
}
},__LZcheckChange:function($1){
if(!this.rerunxpath){
if(!this.p||$1.who==this.context){
this.runXPath()
}else{
if(this.__LZneedsOpUpdate($1)){
this.__LZsimpleOperatorUpdate()
}
}
}else{
if($1.type==2||($1.type==0||$1.type==1&&this.parsedPath&&this.parsedPath.hasOpSelector)&&(this.parsedPath&&this.parsedPath.hasDotDot||this.p==null||this.p.childOf($1.who))){
this.runXPath()
return true
}else{
if(this.__LZneedsOpUpdate($1)){
this.__LZsimpleOperatorUpdate()
}
}
return false
}
},__LZneedsOpUpdate:function($1){
return this.parsedPath&&this.parsedPath.operator!=null&&(this.parsedPath.operator=="__LZgetText"?$1.type==0&&$1.who==this.p||$1.who.parentNode==this.p&&$1.who.nodeType==LzDataNode.TEXT_NODE:$1.type==1&&$1.who==this.p)
},__LZHandleDocChange:function($1){
var $2=$1.who
if(!this.p){
return false
}
var $3=false
var $4=$2
var $5=0
var $6=this.p
do{
if($4==$6){
$3=true
break
}
$4=$4.parentNode
}while($4&&$4!=$2.ownerDocument)
if($3&&this.ondata.ready){
this.ondata.sendEvent(this.data)
}
return $3
},__LZcheckDotDot:function($1){
var $2=$1.who
if(($1.type==0||$1.type==1&&this.parsedPath.hasOpSelector)&&this.context.getContext().childOf($2)){
this.runXPath()
}
},destroy:function($1){
this.__LZsetTracking(null)
if(this.errorDel){
this.errorDel.unregisterAll()
}
if(this.timeoutDel){
this.timeoutDel.unregisterAll()
}
if(this.__LZoldDataDel){
this.__LZoldDataDel.unregisterAll()
}
if(this.__LZdotdotCheckDel){
this.__LZdotdotCheckDel.unregisterAll()
}
delete this.p
delete this.data
delete this.__LZlastdotdot
delete this.context
delete this.__LZtracking;(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},__LZsetTracking:function($1,$2){
var $3=this.__LZtracking
var $4=this.__LZtrackDel
if($1){
if($3 instanceof Array&&$3.length==1&&$3[0]===$1){
return
}
if($4){
$4.unregisterAll()
}
var $5=$2||this.xpath
if($5){
if(!$4){
this.__LZtrackDel=$4=new LzDelegate(this,"__LZcheckChange")
}
this.__LZtracking=$3=[$1]
$4.register($1,"onDocumentChange")
}
}else{
this.__LZtracking=[]
if($4){
this.__LZtrackDel.unregisterAll()
}
}
}},{tagname:"datapointer"});(function(){
with(LzDatapointer){
with(LzDatapointer.prototype){
setters.xpath="setXPath"
setters.context="setDataContext"
setters.pointer="setPointer"
setters.p="setPointer"
prototype.defaultattrs={}
prototype.defaultattrs.ignoreplacement=true
setters.rerunxpath="__LZsetRerunXPath"
DeclareEvent(prototype,"onp")
DeclareEvent(prototype,"onDocumentChange")
DeclareEvent(prototype,"ondata")
DeclareEvent(prototype,"onerror")
DeclareEvent(prototype,"ontimeout")
DeclareEvent(prototype,"onrerunxpath")
xpathQuery.dependencies=function($1,$2,$3){
if(this.parsePath){
var $4=this.parsePath($3)
return [$4.hasDotDot?$2.context.getContext().ownerDocument:$2,"DocumentChange"]
}else{
return [$2,"DocumentChange"]
}
}
getXPath.dependencies=xpathQuery.dependencies
}
}
})()
var LzParam=Class.make("LzParam",LzNode,{construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this.d={}
},parseQueryString:function($1){
var $2=$1.split("&")
var $3={}
for(var $4 in $2){
var $5=$2[$4]
var $6=""
var $7=$5.indexOf("=")
if($7>0){
$6=unescape($5.substring($7+1))
$5=$5.substring(0,$7)
}
$3[$5]=$6
}
return $3
},createChildren:function($1){

},dlm:"&",sep:"=",addObject:function($1){
for(var $2 in $1){
this.setValue($2,$1[$2])
}
},clone:function($1){
var $1=new LzParam()
for(var $2 in this.d){
$1.d[$2]=this.d[$2].concat()
}
return $1
},remove:function($1){
if(null==$1){
this.d={}
}else{
if(null!=this.d[$1]){
var $2=this.findKey($1)
if($2!=null){
this.d[$1].splice($2,2)
}
}
}
},setValue:function($1,$2,$3){
if($3){
$2=encodeURIComponent($2)
}
var $4=this.d[$1]
if($4==null){
this.d[$1]=[$1,$2]
}else{
var $5=this.findKey($1)
if(null!=$5){
$4[$5+1]=$2
}else{
$4.push($1,$2)
}
}
},addValue:function($1,$2,$3){
if($3){
$2=encodeURIComponent($2)
}
var $4=this.d[$1]
if($4==null){
this.d[$1]=[$1,$2]
}else{
$4.push($1,$2)
}
},getValue:function($1){
var $2=this.findKey($1)
if(null!=$2){
return this.d[$1][$2+1]
}
},getValueNoCase:function($1){
var $2=this.d[$1]
if($2.length){
if($2.length==2){
return $2[1]
}else{
var $3=[]
for(var $4=1;$4<$2.length;$4+=2){
$3.push($2[$4])
}
return $3
}
}
},getNames:function(){
var $1=[]
for(var $2 in this.d){
var $3=this.d[$2]
for(var $4=0;$4<$3.length;$4+=2){
if(null!=$3[$4]){
$1.push($3[$4])
}
}
}
return $1
},findKey:function($1){
var $2=this.d[$1]
if($2!=null){
for(var $3=0;$3<$2.length;$3+=2){
if($1==$2[$3]){
return $3
}
}
}
},setDelimiter:function($1){
var $2=this.dlm
this.dlm=$1
return $2
},setSeparator:function($1){
var $2=this.sep
this.sep=$1
return $2
},toString:function(){
return this.serialize()
},serialize:function($1,$2,$3){
var $1=$1==null?this.sep:$1
var $4=$2==null?this.dlm:$2
var $5=""
var $6=false
for(var $7 in this.d){
var $8=this.d[$7]
if($8!=null){
for(var $9=0;$9<$8.length;$9+=2){
if($6){
$5+=$4
}
$5+=$8[$9]+$1
$5+=$3?encodeURIComponent($8[$9+1]):$8[$9+1]
$6=true
}
}
}
return $5
}},{tagname:"params"});(function(){
with(LzParam){
with(LzParam.prototype){
setters.$hasdefaultattrs=-1
}
}
})()
LzParam.prototype.toString=LzParam.prototype.serialize
var LzParsedPath=Class.make("LzParsedPath",null,{initialize:function($1,$2){
this.path=$1
this.selectors=[]
var $3=false
var $4=$1.indexOf(":/")
if($4>-1){
var $5=$1.substring(0,$4).split(":")
if($5.length>1){
var $6=LzParsedPath.trim($5[0])
var $7=LzParsedPath.trim($5[1])
if($6=="local"){
$3=true
this.islocaldata=$7.split(".")
this.context=$2.getLocalDataContext(this.islocaldata)
}else{
this.context=canvas[$6][$7]
}
}else{
var $8=LzParsedPath.trim($5[0])
if($8=="new"){
this.context=new AnonDatasetGenerator(this)
}else{
this.context=canvas.datasets[$8]
}
}
if(this.context==null&&$3!=true){

}
var $9=$1.substring($4+2)
}else{
var $9=$1
}
var $10=[]
var $11=""
var $12=false
var $13=false
for(var $14=0;$14<$9.length;$14++){
var $15=$9.charAt($14)
if($15=="\\"&&$13==false){
$13=true
continue
}else{
if($13==true){
$13=false
$11+=$15
continue
}else{
if($12==false&&$15=="/"){
$10.push($11)
$11=""
continue
}else{
if($15=="'"){
$12=$12?false:true
}
}
}
}
$11+=$15
}
$10.push($11)
if($10!=null){
for(var $14=0;$14<$10.length;$14++){
var $16=LzParsedPath.trim($10[$14])
if($14==$10.length-1){
if($16.charAt(0)=="@"){
this.hasAttrOper=true
if($16.charAt(1)=="*"){
this.operator="attributes"
}else{
this.operator="attributes."+$16.substring(1,$16.length)
}
continue
}else{
if($16.charAt($16.length-1)==")"){
if($16.indexOf("last")>-1){
this.aggOperator="last"
}else{
if($16.indexOf("position")>-1){
this.aggOperator="position"
}else{
if($16.indexOf("name")>-1){
this.operator="nodeName"
}else{
if($16.indexOf("text")>-1){
this.operator="__LZgetText"
this.operatorArgs=0
}else{
if($16.indexOf("serialize")>-1){
this.operator="serialize"
this.operatorArgs=0
}else{
this.gotError("Unknown operator: "+$16)
}
}
}
}
}
continue
}else{
if($16==""){
continue
}
}
}
}
var $17=$16.split("[")
var $18=LzParsedPath.trim($17[0])
this.selectors.push($18==""?"/":$18)
if($18==""||$18==".."){
this.hasDotDot=true
}
if($17!=null){
for(var $19=1;$19<$17.length;$19++){
var $20=LzParsedPath.trim($17[$19])
$20=$20.substring(0,$20.length-1)
if(LzParsedPath.trim($20).charAt(0)=="@"){
var $21=$20.split("=")
var $22
var $23=$21[0].substring(1)
if($21.length>1){
var $24=LzParsedPath.trim($21[1])
$24=$24.substring(1,$24.length-1)
$22={pred:"attrval",attr:LzParsedPath.trim($23),val:LzParsedPath.trim($24)}
}else{
$22={pred:"hasattr",attr:LzParsedPath.trim($23)}
}
this.selectors.push($22)
this.hasOpSelector=true
}else{
var $22=$20.split("-")
$22[0]=LzParsedPath.trim($22[0])
if($22[0]==""){
$22[0]=1
}
if($22[1]!=null){
$22[1]=LzParsedPath.trim($22[1])
}
if($22[1]==""){
$22[1]=Infinity
}else{
if($22.length==1){
$22[1]=$22[0]
}
}
$22.pred="range"
this.selectors.push($22)
}
}
}
}
}
},operatorArgs:null,toString:function(){
return "Parsed path for path: "+this.path
},debugWrite:function(){

}},{trim:function($1){
var $2=0
var $3=false
while($1.charAt($2)==" "){
$2++
$3=true
}
var $4=$1.length-$2
while($1.charAt($2+$4-1)==" "){
$4--
$3=true
}
return $3?$1.substr($2,$4):$1
}})
var AnonDatasetGenerator=Class.make("AnonDatasetGenerator",null,{initialize:function($1){
this.pp=$1
},getContext:function(){
var $1=new LzDataset()
var $2=$1.getPointer()
if(this.pp.selectors!=null){
for(var $3=0;$3<this.pp.selectors.length;$3++){
if(this.pp.selectors[$3]=="/"){
continue
}
$2.addNode(this.pp.selectors[$3])
$2.selectChild()
}
}
return $1
},noncontext:true},null)
var LzDatapath=Class.make("LzDatapath",LzDatapointer,{datacontrolsvisibility:true,__LZtakeDPSlot:true,pooling:null,replication:null,sortpath:null,sortorder:null,construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
if(!("data" in this.immediateparent)){
this.immediateparent.data=null
}
if($2.datacontrolsvisibility!=null){
this.datacontrolsvisibility=$2.datacontrolsvisibility
}
if(this.__LZtakeDPSlot){
this.immediateparent.datapath=this
var $3=null
var $4=null
if("searchParents" in this.immediateparent){
$3=this.immediateparent.searchParents("datapath").datapath
$4=$3.__LZdepChildren
}
if($4!=null){
$3.__LZdepChildren=[]
for(var $5=$4.length-1;$5>=0;$5--){
var $6=$4[$5]
if($6!=this&&!$6.$pathbinding&&$6.immediateparent!=this.immediateparent&&$6.immediateparent.childOf(this.immediateparent)){
$6.setDataContext(this,true)
}else{
$3.__LZdepChildren.push($6)
}
}
}
}
},__LZHandleMultiNodes:function($1){
var $2
switch(this.replication){
case "lazy":
$2=LzLazyReplicationManager
break
case "resize":
$2=LzResizeReplicationManager
break
default:
$2=LzReplicationManager
break

}
this.storednodes=$1
var $3=new $2(this,this._instanceAttrs)
delete this.storednodes
return $3
},setNodes:function($1){
var $2=this.__LZHandleMultiNodes($1)
if(!$2){
$2=this
}
$2.__LZsetTracking(null)
if($1){
for(var $3=0;$3<$1.length;$3++){
var $4=$1[$3]
var $5=$4.ownerDocument
$2.__LZsetTracking($5,true,$4!=$5)
}
}
},__LZsendUpdate:function($1,$2){
var $3=this.__LZpchanged
if(!(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsendUpdate"]:this.nextMethod(arguments.callee,"__LZsendUpdate")).apply(this,arguments)){
return false
}
if(this.immediateparent.isinited){
this.__LZApplyData($3)
}else{
this.__LZneedsUpdateAfterInit=true
}
return true
},__LZApplyDataOnInit:function(){
if(this.__LZneedsUpdateAfterInit){
this.__LZApplyData()
delete this.__LZneedsUpdateAfterInit
}
},__LZApplyData:function($1){
var $2=this.immediateparent
if(this.datacontrolsvisibility){
this.immediateparent.__LZvizDat=this.p!=null
if("__LZupdateShown" in this.immediateparent){
this.immediateparent.__LZupdateShown()
}
}
var $3=$1||$2.data!=this.data||this.parsedPath&&this.parsedPath.operator=="attributes"
this.data=this.data==null?null:this.data
$2.data=this.data
if($3&&$2.ondata.ready){
$2.ondata.sendEvent(this.data)
}
if(this.parsedPath&&(this.parsedPath.operator!=null||this.parsedPath.aggOperator!=null)&&$3){
if($2.applyData){
$2.applyData(this.data)
}
}
},setDataContext:function($1,$2){
if($1==null&&this.immediateparent!=null&&"searchParents" in this.immediateparent){
$1=this.immediateparent.searchParents("datapath").datapath
$2=true
}
if($1==this.context){
return
}
if($2){
if($1.__LZdepChildren==null){
$1.__LZdepChildren=[this]
}else{
$1.__LZdepChildren.push(this)
}
}else{
var $3=null
if(this.context){
$3=this.context.__LZdepChildren
}
if($3){
for(var $4=0;$4<$3.length;$4++){
if($3[$4]==this){
$3.splice($4,1)
break
}
}
}
};(arguments.callee.superclass?arguments.callee.superclass.prototype["setDataContext"]:this.nextMethod(arguments.callee,"setDataContext")).call(this,$1)
},destroy:function($1){
this.setName=null
this.__LZupdateLocked=true
if(this.context&&!this.context.__LZdeleted&&this.context.__LZdepChildren){
var $2=this.context.__LZdepChildren
if($2!=null){
for(var $3=0;$3<$2.length;$3++){
if($2[$3]==this){
$2.splice($3,1)
break
}
}
}
}
if(!this.immediateparent.__LZdeleted){
if(this.__LZdepChildren!=null&&this.__LZdepChildren.length){
var $4=this.immediateparent.searchParents("datapath").datapath
for(var $3=0;$3<this.__LZdepChildren.length;$3++){
this.__LZdepChildren[$3].setDataContext($4,true)
}
}
}
if(this.immediateparent.datapath==this){
delete this.immediateparent.datapath
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).apply(this,arguments)
},updateData:function(){
if(!arguments[0]&&this.p){
this.p.__LZlockFromUpdate(this)
}
var $1=this.parsedPath?this.parsedPath.operator:null
if(this.immediateparent.updateData&&$1!=null){
var $2=this.immediateparent.updateData()
if($1=="nodeName"){
this.setNodeName($2)
}else{
if($1=="__LZgetText"){
this.setNodeText($2)
}else{
if($1=="attributes"){
this.p.setAttrs($2)
}else{
this.setNodeAttribute($1.substring(11),$2)
}
}
}
}
if(this.__LZdepChildren!=null){
for(var $3=0;$3<this.__LZdepChildren.length;$3++){
this.__LZdepChildren[$3].updateData(true)
}
}
if(!arguments[0]&&this.p){
this.p.__LZunlockFromUpdate(this)
}
},retrieveData:function(){
return this.updateData()
},__LZHandleDocChange:function($1){
if((arguments.callee.superclass?arguments.callee.superclass.prototype["__LZHandleDocChange"]:this.nextMethod(arguments.callee,"__LZHandleDocChange")).apply(this,arguments)){
if(this.immediateparent.ondata.ready){
this.immediateparent.ondata.sendEvent(this.data)
}
if(this.onDocumentChange.ready){
this.onDocumentChange.sendEvent($1)
}
}
},toString:function(){
return "Datapath for "+this.immediateparent
},_dpevents:["ondata","onerror","ontimeout"],__LZcheckChange:function($1){
if(!(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZcheckChange"]:this.nextMethod(arguments.callee,"__LZcheckChange")).apply(this,arguments)){
if($1.who.childOf(this.p,true)&&this.onDocumentChange.ready){
this.onDocumentChange.sendEvent($1)
}
}
},__LZsetTracking:function($1,$2,$3){
var $4
var $5
if(!$1||!$2){
return(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsetTracking"]:this.nextMethod(arguments.callee,"__LZsetTracking")).call(this,$1,true)
}
$4=this.__LZtracking
$5=this.__LZtrackDel
if($3){
var $6=$4.length
for(var $7=0;$7<$6;$7++){
if($4[$7]===$1){
return
}
}
}
if(!$5){
this.__LZtrackDel=$5=new LzDelegate(this,"__LZcheckChange")
}
$4.push($1)
$5.register($1,"onDocumentChange")
},__LZisclone:false,__LZsetCloneManager:function($1){
this.__LZisclone=true
this.immediateparent.cloneManager=$1
this.parsedPath=$1.parsedPath
this.xpath=$1.xpath
this.setDataContext($1)
},setClonePointer:function($1){
var $2=this.p!=$1
this.p=$1
if($2){
if($1&&this.sel!=$1.sel){
this.sel=$1.sel||false
this.immediateparent.setSelected(this.sel)
}
this.__LZpchanged=true
this.__LZsetData()
}
},setOrder:function($1,$2){
if(this.__LZisclone){
this.immediateparent.cloneManager.setOrder($1,$2)
}else{
this.sortpath=$1
if($2||$2!=null){
this.sortorder=$2
}
}
},setComparator:function($1){
if(this.__LZisclone){
this.immediateparent.cloneManager.setComparator($1)
}else{
this.sortorder=$1
}
},setSelected:function($1){
this.p.sel=$1
this.sel=$1
this.immediateparent.setSelected($1)
},__LZgetLast:function(){
if(this.__LZisclone){
return this.context.nodes.length
}else{
if(this.p==this.context.getContext()&&this.context.__LZgetLast){
return this.context.__LZgetLast()
}
}
return 1
},__LZgetPosition:function(){
if(this.__LZisclone){
return this.immediateparent.clonenumber+1
}else{
if(this.p==this.context.getContext()&&this.context.__LZgetPosition){
return this.context.__LZgetPosition()
}
}
return 1
}},{tagname:"datapath"});(function(){
with(LzDatapath){
with(LzDatapath.prototype){
prototype.rerunxpath=true
setters.__LZmanager="__LZsetCloneManager"
}
}
})()
var LzReplicationManager=Class.make("LzReplicationManager",LzDatapath,{pooling:false,asyncnew:true,datacontrolsvisibility:false,__LZtakeDPSlot:false,visible:true,__LZpreventXPathUpdate:false,nodes:null,clones:null,__LZdataoffset:0,construct:function($1,$2){
var $3=$1.immediateparent
this.datapath=this
var $4=$3._instanceAttrs.name
$2.name=$4
delete $3.immediateparent[$4]
delete $3.parent[$4]
var $5=$3._instanceAttrs.id
$2.id=$5
if(global[$5] instanceof LzNode){
global[$5]=null
}
$2.xpath=LzNode._ignoreAttribute
if($1.sortpath!=null){
$2.sortpath=$1.sortpath
}
if($1.sortorder!=null||$1.sortorder){
$2.sortorder=$1.sortorder
}
this.initialnodes=$1.storednodes
if($1.__LZspecialDotDot){
this.__LZspecialDotDot=true
if($1.__LZdotdotCheckDel){
$1.__LZdotdotCheckDel.unregisterAll()
}
delete $1.__LZspecialDotDot
};(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$3.parent,$2)
if($3.parent!=$3.immediateparent){
$3.immediateparent[$2.name]=this
}
this.xpath=$1.xpath
this.parsedPath=$1.parsedPath
this.cloneClass=$3.constructor
this.cloneParent=$3.parent
this.cloneAttrs=new LzInheritedHash($3._instanceAttrs)
this.cloneAttrs.datapath=LzNode._ignoreAttribute
this.cloneAttrs.$datapath={name:"datapath"}
this.cloneAttrs.$datapath.attrs={datacontrolsvisibility:$1.datacontrolsvisibility,__LZmanager:this}
this.cloneAttrs.id=LzNode._ignoreAttribute
this.cloneAttrs.name=LzNode._ignoreAttribute
var $6=false
if($3._instanceAttrs.$refs&&$3._instanceAttrs.$refs.datapath){
this.cloneAttrs.$refs=new LzInheritedHash(this.cloneAttrs.$refs)
this.cloneAttrs.$refs.datapath=LzNode._ignoreAttribute
var $7=$3._instanceAttrs.$refs.datapath
this._t=$7.dependencies
$6=true
this.__LZpreventXPathUpdate=true
this.applyConstraint("xpath",$7,this._t())
this.__LZpreventXPathUpdate=false
}else{
if($1._instanceAttrs.$refs&&$1._instanceAttrs.$refs.xpath){
var $7=$1._instanceAttrs.$refs.xpath
this._t=$7.dependencies
$6=true
this.__LZpreventXPathUpdate=true
this.applyConstraint("xpath",$7,this._t())
this.__LZpreventXPathUpdate=false
}
}
if(this.__LZsetCloneAttrs){
this.__LZsetCloneAttrs()
}
if($3._instanceChildren){
this.cloneChildren=$3._instanceChildren.concat()
}else{
this.cloneChildren=[]
}
this.visible=$1.datacontrolsvisibility||(!$3.isinited&&"visible" in $3._instanceAttrs?$3._instanceAttrs.visible:$3.visible)
if($2.pooling!=null){
this.pooling=$2.pooling
}
var $8=$1.context
this.clones=[]
this.clonePool=[]
if(this.pooling){
$1.__LZsetCloneManager(this)
if($6){
$1.setXPath=LzReplicationManager.__LZemptyFuntion
}
this.clones.push($3)
$3.immediateparent.addSubview($3)
}else{
this.destroyClone($3)
}
this.setDataContext($8,$8 instanceof LzDatapointer)
},constructWithArgs:function($1){
this.__LZHandleMultiNodes(this.initialnodes)
delete this.initialnodes
if(this.visible==false){
this.setVisible(false)
}
},getNodeOffset:function($1){
if(this.nodes!=null){
var $2=this.nodes.length
for(var $3=0;$3<$2;$3++){
if($1==this.nodes[$3]){
return $3
}
}
}
},getCloneNumber:function($1){
return this.clones[$1]
},__LZHandleNoNodes:function($1){
this.nodes=[]
while(this.clones.length){
if(this.pooling){
this.poolClone()
}else{
var $2=this.clones.pop()
this.destroyClone($2)
}
}
},__LZHandleSingleNode:function($1){
this.__LZHandleMultiNodes([$1])
},mergesort:function($1,$2,$3){
if($2<$3){
var $4=$2+Math.floor(($3-$2)/2)
var $5=this.mergesort($1,$2,$4)
var $6=this.mergesort($1,$4+1,$3)
}else{
if($1.length==0){
return []
}else{
return [$1[$2]]
}
}
var $7=[]
var $8=0
var $9=0
var $10=$5.length
var $11=$6.length
while($8<$10&&$9<$11){
if(this.orderf($6[$9],$5[$8])==1){
$7.push($6[$9++])
}else{
$7.push($5[$8++])
}
}
while($8<$10){
$7.push($5[$8++])
}
while($9<$11){
$7.push($6[$9++])
}
return $7
},__LZHandleMultiNodes:function($1){
var $2=this.parent&&this.parent.layouts?this.parent.layouts:[]
for(var $3 in $2){
$2[$3].lock()
}
this.hasdata=true
var $4=this.nodes
this.nodes=$1
if(this.onnodes.ready){
this.onnodes.sendEvent(this.nodes)
}
if(this.__LZspecialDotDot){
this.__LZsetupDotDot($1[0])
}
if(this.orderpath!=null){
this.nodes=this.mergesort(this.nodes,0,this.nodes.length-1)
}
this.__LZadjustVisibleClones($4,true)
var $5=this.clones.length
for(var $3=0;$3<$5;$3++){
var $6=this.clones[$3]
var $7=$3+this.__LZdataoffset
$6.clonenumber=$7
if(this.nodes){
$6.datapath.setClonePointer(this.nodes[$7])
}
if($6.onclonenumber.ready){
$6.onclonenumber.sendEvent($7)
}
}
if(this.onclones.ready){
this.onclones.sendEvent(this.clones)
}
for(var $3 in $2){
$2[$3].unlock()
}
},__LZadjustVisibleClones:function($1,$2){
var $3=this.__LZdiffArrays($1,this.nodes)
if(!this.pooling){
while(this.clones.length>$3){
var $4=this.clones.pop()
this.destroyClone($4)
}
}
LzInstantiator.enableDataReplicationQueuing()
while(this.nodes.length>this.clones.length){
this.clones.push(this.getNewClone())
}
LzInstantiator.clearDataReplicationQueue()
while(this.nodes.length<this.clones.length){
this.poolClone()
}
},orderf:function($1,$2){
var $3=arguments.callee.op
this.p=$1
var $4=this.xpathQuery($3)
this.p=$2
var $5=this.xpathQuery($3)
delete this.p
if($4==null||$4==""){
$4="\n"
}
if($5==null||$5==""){
$5="\n"
}
return arguments.callee.comp($4,$5)
},ascDict:function($1,$2){
if($1.toLowerCase()<$2.toLowerCase()){
return 1
}
},descDict:function($1,$2){
if($1.toLowerCase()>$2.toLowerCase()){
return 1
}
},setOrder:function($1,$2){
this.orderpath=null
$2=$2=="sortpath"?null:$2
if($2||$2!=null||typeof this.orderf.comp!="function"){
this.setComparator($2)
}
this.orderpath=$1
this.orderf.op=this.orderpath
if(this.nodes.length){
this.__LZHandleMultiNodes(this.nodes)
}
},setComparator:function($1){
if(typeof $1!="function"){
if($1=="descending"){
$1=this.descDict
}else{
$1=this.ascDict
}
}
this.orderf.comp=$1
if(this.orderpath!=null&&this.nodes.length){
this.__LZHandleMultiNodes(this.nodes)
}
},getNewClone:function($1){
if(this.clonePool.length){
var $2=this.reattachClone(this.clonePool.pop())
}else{
var $2=new (this.cloneClass)(this.cloneParent,this.cloneAttrs,this.cloneChildren,$1==null?this.asyncnew:!$1)
}
if(this.visible==false){
$2.setVisible(false)
}
return $2
},poolClone:function(){
var $1=this.clones.pop()
this.detachClone($1)
this.clonePool.push($1)
},checkDependentContexts:null,handleModify:null,destroyClone:function($1){
$1.sprite.destroy(true)
$1.destroy()
},setDatapath:function($1){
this.setXPath($1)
},setXPath:function($1){
if(this.__LZpreventXPathUpdate){
return
};(arguments.callee.superclass?arguments.callee.superclass.prototype["setXPath"]:this.nextMethod(arguments.callee,"setXPath")).apply(this,arguments)
},handleDeletedNode:function($1){
var $2=this.clones[$1]
if(this.pooling){
this.detachClone($2)
this.clonePool.push($2)
}else{
this.destroyClone($2)
}
this.nodes.splice($1,1)
this.clones.splice($1,1)
},getCloneForNode:function($1){
var $2=this.clones.length
for(var $3=0;$3<$2;$3++){
if(this.clones[$3].datapath.p==$1){
return this.clones[$3]
}
}
},toString:function(){
return "ReplicationManager in "+this.immediateparent
},setVisible:function($1){
this.visible=$1
var $2=this.clones.length
for(var $3=0;$3<$2;$3++){
this.clones[$3].setVisible($1)
}
if(this.onvisible.ready){
this.onvisible.sendEvent($1)
}
},__LZHandleDocChange:function($1){
this.p=this.context.getContext();(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZHandleDocChange"]:this.nextMethod(arguments.callee,"__LZHandleDocChange")).apply(this,arguments)
delete this.p
},__LZcheckChange:function($1){
this.p=this.nodes[0]
var $2=(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZcheckChange"]:this.nextMethod(arguments.callee,"__LZcheckChange")).apply(this,arguments)
delete this.p
if(!$2){
var $3=$1.who
var $4=this.clones.length
for(var $5=0;$5<$4;$5++){
var $6=this.clones[$5]
if($6.datapath.__LZneedsOpUpdate($1)){
$6.datapath.__LZsetData()
}
if($3.childOf($6.datapath.p,true)){
if($6.datapath.onDocumentChange.ready){
$6.datapath.onDocumentChange.sendEvent($1)
}
}
}
}
},__LZneedsOpUpdate:function(){
return false
},getContext:function($1){
return this.nodes[0]
},detachClone:function($1){
if($1.isdetatchedclone){
return
}
$1.setVisible(false)
$1.addedToParent=false
var $2=$1.immediateparent.subviews
for(var $3=$2.length-1;$3>=0;$3--){
if($2[$3]==$1){
$2.splice($3,1)
break
}
}
$1.datapath.__LZtrackDel.unregisterAll()
if($1.immediateparent.onremovesubview.ready){
$1.immediateparent.onremovesubview.sendEvent($1)
}
$1.isdetatchedclone=true
$1.p=null
},reattachClone:function($1){
if(!$1.isdetatchedclone){
return $1
}
$1.immediateparent.addSubview($1)
$1.setVisible(this.visible)
$1.isdetatchedclone=false
return $1
},__LZdiffArrays:function($1,$2){
var $3=0
var $4=$1?$1.length:0
var $5=$2?$2.length:0
while($3<$4&&$3<$5){
if($1[$3]!=$2[$3]){
return $3
}
$3++
}
return $3
},updateData:function($1,$2){
var $3=this.clones.length
for(var $4=0;$4<$3;$4++){
this.clones[$4].datapath.updateData()
}
}},{__LZemptyFuntion:function(){
return
}});(function(){
with(LzReplicationManager){
with(LzReplicationManager.prototype){
setters.sortpath="setOrder"
setters.sortorder="setComparator"
setters.datapath="setXPath"
DeclareEvent(prototype,"onnodes")
DeclareEvent(prototype,"onclones")
DeclareEvent(prototype,"onvisible")
}
}
})()
var LzDatasource=Class.make("LzDatasource",LzNode,{proxied:null,loadSuccess:function($1,$2){
$1.dataset.gotRawData($2)
},loadError:function($1,$2){
$1.dataset.gotError($2)
},loadTimeout:function($1,$2){
$1.dataset.gotTimeout($2)
},getLoaderForDataset:function($1,$2){
var $3=$1.getOption("dsloader")
if(!$3){
$3=new LzHTTPLoader(this,$2,$1)
$1.setOption("dsloader",$3)
$3.setQueueing($1.queuerequests)
$3.loadSuccess=this.loadSuccess
$3.loadError=this.loadError
$3.loadTimeout=this.loadTimeout
}
if(typeof $1.timeout!="undefined"&&$1.timeout!=null){
$3.setTimeout($1.timeout)
}
$3.setProxied($2)
var $4="secure" in $1?$1.secure:null
if($4==null){
if(this.src.substring(0,5)=="https"){
$4=true
}
}
if($4){
$3.baserequest=LzBrowser.getBaseURL($4,$1.secureport)
}
$3.secure=$4
if($4){
$3.secureport=$1.secureport
}
return $3
},abortLoadForDataset:function($1){
$1.getOption("dsloader").abort()
},getLoadTimeForDataset:function($1){
return $1.getOption("dsloader").getLastLoadtime()
},toString:function(){
return "LzDatasource '"+this.name+"'"
}},null)
var LzHTTPDatasource=Class.make("LzHTTPDatasource",LzDatasource,{reqtype:"GET",isProxied:function($1){
var $2=canvas.proxied
if(this.proxied!=null&&this.proxied!="inherit"){
$2=this.proxied=="true"
}
if($1.proxied!=null&&$1.proxied!="inherit"){
$2=$1.proxied=="true"
}
return $2
},doRequest:function($1){
var $2=this.isProxied($1)
var $3=this.getLoaderForDataset($1,$2)
$3.setOption("cacheable",$1.cacheable==true)
if($1.clientcacheable!=null){
$3.setOption("ccache",$1.clientcacheable)
}
$3.setOption("timeout",$1.timeout)
$3.setOption("trimwhitespace",$1.trimwhitespace==true)
$3.setOption("nsprefix",$1.nsprefix==true)
$3.setOption("sendheaders",$1.getresponseheaders==true)
var $4={}
var $5=$1.getRequestHeaderParams()
if($5!=null){
var $6=$5.getNames()
for(var $7=0;$7<$6.length;$7++){
var $8=$6[$7]
var $9=$5.getValue($8)
if($2){
$4[$8]=$9
}else{
$3.setRequestHeader($8,$9)
}
}
}
$1.clearRequestHeaderParams()
var $10=$1.getParams()
var $11=$1.getQueryString()
var $12=""
var $13="?"
var $14=null
var $15=$10.getNames()
for(var $7 in $15){
var $16=$15[$7]
if(!$2&&$16=="lzpostbody"){
$14=$10.getValue($16)
}else{
$13+=$12+$16+"="+encodeURIComponent($10.getValue($16))
$12="&"
}
}
if($11!=null&&$11.length>0){
if($13.length>0){
$13+=$12+$11
}else{
$13=$11
}
}
var $17=this.src
if($13=="?"){

}else{
if($17.indexOf("?")>=0){
$17=$17+"&"+$13
}else{
$17=$17+$13
}
}
if($2){
$17=$3.makeProxiedURL($17,this.reqtype,"xmldata",$4)
}else{
if(!$1.clientcacheable){
var $18="__lzbc__="+new Date().getTime()
if($17.indexOf("?")>=0){
$17=$17+"&"+$18
}else{
$17=$17+"?"+$18
}
}
}
$3.open($2?"POST":this.reqtype,$17,null,null)
$3.send($14)
},setQueryType:function($1){
this.reqtype=$1
},processRawData:function($1,$2){
var $3=new LzParam($1)
var $4=null
if($2==null){
$1.gotError("client could not parse XML from server")
return
}
$1.rawtext=$2.rawtext
var $5=this.isProxied($1)
if($2.childNodes[0].nodeName=="error"){
$1.gotError($2.childNodes[0].attributes["msg"])
return
}
if($5){
var $6="childNodes" in $2.childNodes[1]?$2.childNodes[1].childNodes:null
if($6!=null){
for(var $7=0;$7<$6.length;$7++){
var $8=$6[$7]
if($8.attributes){
$3.addValue($8.attributes.name,$8.attributes.value)
}
}
}
if($2.childNodes[0].childNodes){
$4=$2.childNodes[0].childNodes[0]
}
}else{
$4=$2
}
$1.setData($4,$3)
}},{tagname:"datasource"})
ConstructorMap.httpdatasource=LzHTTPDatasource
var LzDataAttrBind=Class.make("LzDataAttrBind",LzDatapointer,{initialize:function($1,$2,$3){
this.setAttr=$2
this.pathparent=$1
this.node=$1.immediateparent
this.setXPath($3)
if($1.__LZdepChildren==null){
$1.__LZdepChildren=[this]
}else{
$1.__LZdepChildren.push(this)
}
},$pathbinding:true,__LZsendUpdate:function($1,$2){
var $3=this.__LZpchanged
if(!(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsendUpdate"]:this.nextMethod(arguments.callee,"__LZsendUpdate")).apply(this,arguments)){
return
}
if($3||this.node[this.setAttr]!=this.data||this.parsedPath.operator=="attributes"){
var $lzsc$1067643688=this.node
var $lzsc$100750628=this.setAttr
var $lzsc$1819922585=this.data==null?null:this.data
if(!$lzsc$1067643688.__LZdeleted){
var $lzsc$998361254=$lzsc$1067643688.setters
if($lzsc$998361254&&$lzsc$100750628 in $lzsc$998361254){
$lzsc$1067643688[$lzsc$998361254[$lzsc$100750628]]($lzsc$1819922585)
}else{
$lzsc$1067643688[$lzsc$100750628]=$lzsc$1819922585
var $lzsc$1932693211="on"+$lzsc$100750628
if($lzsc$1932693211 in $lzsc$1067643688){
if($lzsc$1067643688[$lzsc$1932693211].ready){
$lzsc$1067643688[$lzsc$1932693211].sendEvent($lzsc$1819922585)
}
}
}
}
}
},unregisterAll:function(){
var $1=this.pathparent.__LZdepChildren
if($1!=null){
for(var $2=0;$2<$1.length;$2++){
if($1[$2]==this){
$1.splice($2,1)
break
}
}
}
this.destroy()
},setDataContext:function($1){
(arguments.callee.superclass?arguments.callee.superclass.prototype["setDataContext"]:this.nextMethod(arguments.callee,"setDataContext")).call(this,$1||this.pathparent)
},updateData:function(){
var $1=this.node[this.setAttr]
if(this.data==$1){
return
}
var $2=this.parsedPath.operator
if($2!=null){
if($2=="nodeName"){
this.setNodeName($1)
}else{
if($2=="__LZgetText"){
this.setNodeText($1)
}else{
if($2=="attributes"){
this.p.setAttrs($1)
}else{
this.setNodeAttribute($2.substring(11),$1)
}
}
}
}
},toString:function(){
return "binder "+this.xpath
}},null);(function(){
with(LzDataAttrBind){
with(LzDataAttrBind.prototype){
prototype.rerunxpath=true
}
}
})()
var LzLazyReplicationManager=Class.make("LzLazyReplicationManager",LzReplicationManager,{axis:"y",spacing:0,mask:null,construct:function($1,$2){
if($2.pooling!=null){
$2.pooling=true
}
if($2.axis!=null){
this.axis=$2.axis
}
this.sizeAxis=this.axis=="x"?"width":"height";(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this.mask=$1.immediateparent.immediateparent.mask
var $3={ignorelayout:true}
if(this.cloneAttrs.options!=null){
$3=new LzInheritedHash(this.cloneAttrs.options)
}
var $4=this.clones[0]
$4.setOption("ignorelayout",true)
var $5=$4.immediateparent.layouts
if($5!=null){
for(var $6=0;$6<$5.length;$6++){
$5[$6].removeSubview($4)
}
}
this.cloneAttrs.options=$3
var $7=this.getNewClone(true)
this.cloneimmediateparent=$7.immediateparent
if(this.initialnodes){
$7.datapath.setClonePointer(this.initialnodes[1])
}
this.viewsize=$7[this.sizeAxis]
$7.datapath.setClonePointer(null)
this.clones.push($7)
if($2.spacing==null){
$2.spacing=0
}
this.totalsize=this.viewsize+$2.spacing
var $lzsc$322730748=this.axis
var $lzsc$903130331=this.totalsize
if(!$7.__LZdeleted){
var $lzsc$379804808=$7.setters
if($lzsc$379804808&&$lzsc$322730748 in $lzsc$379804808){
$7[$lzsc$379804808[$lzsc$322730748]]($lzsc$903130331)
}else{
$7[$lzsc$322730748]=$lzsc$903130331
var $lzsc$170920561="on"+$lzsc$322730748
if($lzsc$170920561 in $7){
if($7[$lzsc$170920561].ready){
$7[$lzsc$170920561].sendEvent($lzsc$903130331)
}
}
}
}
this.__LZdataoffset=0
this.updateDel=new LzDelegate(this,"__LZadjustVisibleClones")
this.updateDel.register(this.cloneimmediateparent,"on"+this.axis)
this.updateDel.register(this.mask,"on"+this.sizeAxis)
},viewsize:0,totalsize:0,__LZsetCloneAttrs:function(){
var $1={ignorelayout:true}
if(this.cloneAttrs.options!=null){
$1=new LzInheritedHash(this.cloneAttrs.options)
}
this.cloneAttrs.options=$1
},__LZHandleNoNodes:function(){
this.__LZHandleMultiNodes([])
},__LZadjustVisibleClones:function($1,$2){
var $3=null
if(this.nodes){
$3=this.nodes.length
}
if($3!=null){
if(this.__LZoldnodelen!=this.nodes.length){
var $lzsc$2075491228=this.cloneimmediateparent
var $lzsc$609963284=this.sizeAxis
var $lzsc$86082898=this.nodes.length*this.totalsize-this.spacing
if(!$lzsc$2075491228.__LZdeleted){
var $lzsc$945491145=$lzsc$2075491228.setters
if($lzsc$945491145&&$lzsc$609963284 in $lzsc$945491145){
$lzsc$2075491228[$lzsc$945491145[$lzsc$609963284]]($lzsc$86082898)
}else{
$lzsc$2075491228[$lzsc$609963284]=$lzsc$86082898
var $lzsc$1551607618="on"+$lzsc$609963284
if($lzsc$1551607618 in $lzsc$2075491228){
if($lzsc$2075491228[$lzsc$1551607618].ready){
$lzsc$2075491228[$lzsc$1551607618].sendEvent($lzsc$86082898)
}
}
}
}
this.__LZoldnodelen=this.nodes.length
}
}
if(!(this.mask&&this.mask["hasset"+this.sizeAxis])){
return
}
var $4=0
if(this.totalsize!=0){
$4=Math.floor(-this.cloneimmediateparent[this.axis]/this.totalsize)
}
if(0>$4){
$4=0
}
var $5=0
var $6=this.clones.length
var $7=$4-this.__LZdataoffset
var $8=$4*this.totalsize+this.cloneimmediateparent[this.axis]
var $9=0
if(typeof $8=="number"){
$9=1+Math.floor((this.mask[this.sizeAxis]-$8)/this.totalsize)
}
if(this.nodes!=null){
if($9+$4>this.nodes.length){
$9=this.nodes.length-$4
}
}
if($7==0&&$9==$6){
return
}
LzInstantiator.enableDataReplicationQueuing()
var $10=this.clones
this.clones=[]
for(var $11=0;$11<$9;$11++){
var $12=false
if($11+$7<0){
if($9+$7<$6&&$6>0){
$12=$10[--$6]
}else{
$12=this.getNewClone()
}
}else{
if($11+$7>=$6){
if($5<$7&&$5<$6){
$12=$10[$5++]
}else{
$12=this.getNewClone()
}
}
}
if($12){
this.clones[$11]=$12
var $lzsc$297598493=this.axis
var $lzsc$1687376900=($11+$4)*this.totalsize
if(!$12.__LZdeleted){
var $lzsc$1022426788=$12.setters
if($lzsc$1022426788&&$lzsc$297598493 in $lzsc$1022426788){
$12[$lzsc$1022426788[$lzsc$297598493]]($lzsc$1687376900)
}else{
$12[$lzsc$297598493]=$lzsc$1687376900
var $lzsc$130671817="on"+$lzsc$297598493
if($lzsc$130671817 in $12){
if($12[$lzsc$130671817].ready){
$12[$lzsc$130671817].sendEvent($lzsc$1687376900)
}
}
}
}
$12.clonenumber=$4+$11
if(this.nodes){
$12.datapath.setClonePointer(this.nodes[$4+$11])
}
if($12.onclonenumber.ready){
$12.onclonenumber.sendEvent($11)
}
}else{
this.clones[$11]=$10[$11+$7]
}
}
while($5<$7&&$5<$6){
var $13=$10[$5++]
this.detachClone($13)
this.clonePool.push($13)
}
while($6>$9+$7&&$6>0){
var $13=$10[--$6]
this.detachClone($13)
this.clonePool.push($13)
}
this.__LZdataoffset=$4
LzInstantiator.clearDataReplicationQueue()
},toString:function(){
return "Lazy clone manager in "+this.cloneimmediateparent
},getCloneForNode:function($1,$2){
var $3=(arguments.callee.superclass?arguments.callee.superclass.prototype["getCloneForNode"]:this.nextMethod(arguments.callee,"getCloneForNode")).call(this,$1)||null
if(!$3&&!$2){
$3=this.getNewClone()
$3.datapath.setClonePointer($1)
this.detachClone($3)
this.clonePool.push($3)
}
return $3
},getCloneNumber:function($1){
return this.getCloneForNode(this.nodes[$1])
}},null);(function(){
with(LzLazyReplicationManager){
with(LzLazyReplicationManager.prototype){
prototype.pooling=true
}
}
})()
var LzResizeReplicationManager=Class.make("LzResizeReplicationManager",LzLazyReplicationManager,{construct:function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).apply(this,arguments)
this.datasizevar="$"+this.getUID()+"track"
},__LZsetCloneAttrs:function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["__LZsetCloneAttrs"]:this.nextMethod(arguments.callee,"__LZsetCloneAttrs")).apply(this,arguments)
this.cloneAttrs.setHeight=LzResizeReplicationManager.__LZResizeSetSize
},getPositionByNode:function($1){
var $2=-this.spacing
var $3
if(this.nodes!=null){
for(var $4=0;$4<this.nodes.length;$4++){
$3=this.nodes[$4]
if($1==this.nodes[$4]){
return $2+this.spacing
}
$2+=this.spacing+($3[this.datasizevar]||this.viewsize)
}
}
},__LZreleaseClone:function($1){
this.detachClone($1)
this.clonePool.push($1)
},__LZadjustVisibleClones:function($1,$2){
if(!this.mask["hasset"+this.sizeAxis]){
return
}
if(this.__LZresizeupdating){
return
}
this.__LZresizeupdating=true
var $3=this.nodes!=null?this.nodes.length:0
var $4=-this.cloneimmediateparent[this.axis]
var $4=0>$4?0:Math.floor($4)
var $5=this.mask[this.sizeAxis]
var $6=-1
var $7=this.__LZdataoffset
if($2){
while(this.clones.length){
this.poolClone()
}
var $8=null
var $9=0
}else{
var $8=this.clones
var $9=$8.length
}
this.clones=[]
var $10=-this.spacing
var $11=false
var $12=-1
var $13=true
for(var $14=0;$14<$3;$14++){
var $15=this.nodes[$14]
var $16=$15[this.datasizevar]
var $17=$16==null?this.viewsize:$16
$10+=this.spacing
if(!$11&&$6==-1&&$10-$4+$17>=0){
var $13=$14!=0
$11=true
var $18=$10
$6=$14
var $19=$14-$7
$19=$19>$9?$9:$19
if($19>0){
for(var $20=0;$20<$19;$20++){
var $21=$8[$20]
this.__LZreleaseClone($21)
}
}
}else{
if($11&&$10-$4>$5){
$11=false
$12=$14-$6
var $22=$14-$7
$22=$22<0?0:$22
if($22<$9){
for(var $20=$22;$20<$9;$20++){
var $21=$8[$20]
this.__LZreleaseClone($21)
}
}
}
}
if($11){
if($14>=$7&&$14<$7+$9){
var $23=$8[$14-$7]
}else{
var $23=null
}
this.clones[$14-$6]=$23
}
$10+=$17
}
var $24=$18
if($13){
$24+=this.spacing
}
for(var $14=0;$14<this.clones.length;$14++){
var $15=this.nodes[$14+$6]
var $23=this.clones[$14]
if(!$23){
$23=this.getNewClone()
$23.clonenumber=$14+$6
$23.datapath.setClonePointer($15)
if($23.onclonenumber.ready){
$23.onclonenumber.sendEvent($14+$6)
}
this.clones[$14]=$23
}
this.clones[$14]=$23
var $lzsc$199565265=this.axis
if(!$23.__LZdeleted){
var $lzsc$1566756327=$23.setters
if($lzsc$1566756327&&$lzsc$199565265 in $lzsc$1566756327){
$23[$lzsc$1566756327[$lzsc$199565265]]($24)
}else{
$23[$lzsc$199565265]=$24
var $lzsc$827405854="on"+$lzsc$199565265
if($lzsc$827405854 in $23){
if($23[$lzsc$827405854].ready){
$23[$lzsc$827405854].sendEvent($24)
}
}
}
}
var $16=$15[this.datasizevar]
var $17=$16==null?this.viewsize:$16
if($23[this.sizeAxis]!=$17){
var $lzsc$1751397930=this.sizeAxis
if(!($23.__LZdeleted||true&&$23[$lzsc$1751397930]==$17)){
var $lzsc$308004129=$23.setters
if($lzsc$308004129&&$lzsc$1751397930 in $lzsc$308004129){
$23[$lzsc$308004129[$lzsc$1751397930]]($17)
}else{
$23[$lzsc$1751397930]=$17
var $lzsc$1846090120="on"+$lzsc$1751397930
if($lzsc$1846090120 in $23){
if($23[$lzsc$1846090120].ready){
$23[$lzsc$1846090120].sendEvent($17)
}
}
}
}
}
$24+=$17+this.spacing
}
this.__LZdataoffset=$6
var $lzsc$1237939842=this.cloneimmediateparent
var $lzsc$1724241033=this.sizeAxis
if(!$lzsc$1237939842.__LZdeleted){
var $lzsc$621047276=$lzsc$1237939842.setters
if($lzsc$621047276&&$lzsc$1724241033 in $lzsc$621047276){
$lzsc$1237939842[$lzsc$621047276[$lzsc$1724241033]]($10)
}else{
$lzsc$1237939842[$lzsc$1724241033]=$10
var $lzsc$1510559529="on"+$lzsc$1724241033
if($lzsc$1510559529 in $lzsc$1237939842){
if($lzsc$1237939842[$lzsc$1510559529].ready){
$lzsc$1237939842[$lzsc$1510559529].sendEvent($10)
}
}
}
}
this.__LZresizeupdating=false
},__LZHandleCloneResize:function($1,$2){
var $3=$1.datapath.p[this.datasizevar]||this.viewsize
if($2!=$3){
$1.datapath.p[this.datasizevar]=$2
this.__LZadjustVisibleClones()
}
}},null);(function(){
with(LzResizeReplicationManager){
with(LzResizeReplicationManager.prototype){
prototype.pooling=false
LzResizeReplicationManager.__LZResizeSetSize=function($1,$2){
(arguments.callee.superclass?arguments.callee.superclass.prototype["setHeight"]:this.nextMethod(arguments.callee,"setHeight")).call(this,$1)
if($2!=true){
this.cloneManager.__LZHandleCloneResize(this,$1)
}
}
}
}
})()
var LzInstantiatorClass=Class.make("LzInstantiatorClass",null,{checkQDel:null,initialize:function(){
this.checkQDel=new LzDelegate(this,"checkQ")
},halted:false,isimmediate:false,isdatareplicating:false,istrickling:false,isUpdating:false,safe:true,timeout:500,makeQ:[],trickleQ:[],tricklingQ:[],syncNew:true,trickletime:10,setSafeInstantiation:function($1){
this.safe=$1
if(this.instanceQ.length){
this.timeout=Infinity
}
},requestInstantiation:function($1,$2){
if(this.isimmediate){
this.createImmediate($1,$2.concat())
}else{
var $3=this.newReverseArray($2)
if(this.isdatareplicating){
this.datareplq.push($1,$3)
}else{
if(this.istrickling){
this.tricklingQ.push($1,$3)
}else{
this.makeQ.push($1,$3)
this.checkUpdate()
}
}
}
},enableDataReplicationQueuing:function(){
this.isdatareplicating=true
this.datareplq=[]
},clearDataReplicationQueue:function(){
this.isdatareplicating=false
var $1=this.datareplq
for(var $2=$1.length-1;$2>0;$2-=2){
this.makeQ.push($1[$2-1],$1[$2])
}
this.checkUpdate()
},newReverseArray:function($1){
var $2=$1.length
var $3=Array($2)
var $4=0
var $5=$2-1
while($4<$2){
$3[$4]=$1[$5]
$4++
$5--
}
return $3
},checkUpdate:function(){
if(!this.isUpdating&&!this.halted){
this.checkQDel.register(LzIdle,"onidle")
this.isUpdating=true
}
},checkQ:function(){
if(!this.makeQ.length){
if(!this.tricklingQ.length){
if(!this.trickleQ.length){
this.checkQDel.unregisterAll()
this.isUpdating=false
return
}else{
var $1=this.trickleQ.shift()
var $2=this.trickleQ.shift()
this.tricklingQ.push($1,this.newReverseArray($2))
}
}
this.istrickling=true
this.makeSomeViews(this.tricklingQ,this.trickletime)
this.istrickling=false
}else{
canvas.creatednodes+=this.makeSomeViews(this.makeQ,this.timeout)
if(canvas.updatePercentCreated){
canvas.updatePercentCreated()
}
}
},makeSomeViews:function($1,$2){
var $3=new Date().getTime()
var $4=0
while(new Date().getTime()-$3<$2&&$1.length){
var $5=$1.length
var $6=$1[$5-1]
var $7=$1[$5-2]
var $8=false
if($7["__LZdeleted"]){
$1.length-=2
continue
}
while(new Date().getTime()-$3<$2){
if($5!=$1.length){
break
}
if(!$6.length){
$8=true
break
}
var $11=$6.pop()
if($11){
$7.makeChild($11,true)
$4++
}
}
if($8){
$1.length=$5-2
$7.__LZinstantiationDone()
}
}
return $4
},trickleInstantiate:function($1,$2){
this.trickleQ.push($1,$2)
this.checkUpdate()
},createImmediate:function($1,$2){
var $3=this.newReverseArray($2)
var $4=this.isimmediate
this.isimmediate=true
this.makeSomeViews([$1,$3],Infinity)
this.isimmediate=$4
},completeTrickle:function($1){
if(this.tricklingQ[0]==$1){
var $2=this.isimmediate
this.isimmediate=true
this.makeSomeViews(this.tricklingQ,Infinity)
this.isimmediate=$2
this.tricklingQ=[]
}else{
var $3=this.trickleQ.length
for(var $4=0;$4<$3;$4+=2){
if(this.trickleQ[$4]==$1){
var $5=this.trickleQ[$4+1]
this.trickleQ.splice($4,2)
this.createImmediate($1,$5)
return
}
}
}
},traceQ:function(){
var $1=this.makeQ.length
trace("****start trace")
for(var $2=0;$2<$1;$2+=2){
var $3=""
for(var $4=0;$4<this.makeQ[$2+1].length;$4++){
$3+=this.makeQ[$2+1][$4].name+" |"
}
trace(this.makeQ[$2]+" : |"+$3+" >>> "+this.makeQ[$2].getUID())
}
trace("****trace done")
},halt:function(){
this.isUpdating=false
this.halted=true
this.checkQDel.unregisterAll()
},resume:function(){
this.halted=false
this.checkUpdate()
},drainQ:function($1){
var $2=this.timeout
var $3=this.trickletime
var $4=this.halted
this.timeout=$1
this.trickletime=$1
this.halted=false
this.isUpdating=true
this.checkQ()
this.halted=$4
this.timeout=$2
this.trickletime=$3
return !this.isUpdating
}},null)
var LzInstantiator=new LzInstantiatorClass()
var LzGlobalMouse=new Object()
DeclareEvent(LzGlobalMouse,"onmousemove")
DeclareEvent(LzGlobalMouse,"onmouseup")
DeclareEvent(LzGlobalMouse,"onmousedown")
LzGlobalMouse.__movecounter=0
LzGlobalMouse.__mouseEvent=function($1,$2){
if($1=="onmousemove"){
LzGlobalMouse.__movecounter++
}
if(LzGlobalMouse[$1]&&LzGlobalMouse[$1].ready){
LzGlobalMouse[$1].sendEvent($2)
}
}
var LzModeManager=new Object()
DeclareEvent(LzModeManager,"onmode")
LzModeManager.onmode=null
LzModeManager.__LZlastclick=null
LzModeManager.willCall=false
LzModeManager.eventsLocked=false
LzModeManager.modeArray=new Array()
LzModeManager.toString=function(){
return "mode manager"
}
LzModeManager.makeModal=function($1){
this.modeArray.push($1)
if(this.onmode.ready){
this.onmode.sendEvent($1)
}
var $2=LzFocus.getFocus()
if($2&&!$2.childOf($1)){
LzFocus.clearFocus()
}
}
LzModeManager.release=function($1){
for(var $2=this.modeArray.length-1;$2>=0;$2--){
if(this.modeArray[$2]==$1){
this.modeArray.splice($2,this.modeArray.length-$2)
var $3=this.modeArray[$2-1]
if(this.onmode.ready){
this.onmode.sendEvent($3||null)
}
var $4=LzFocus.getFocus()
if($3&&$4&&!$4.childOf($3)){
LzFocus.clearFocus()
}
return
}
}
}
LzModeManager.releaseAll=function(){
this.modeArray=new Array()
if(this.onmode.ready){
this.onmode.sendEvent(null)
}
}
LzModeManager.handleMouseEvent=function($1,$2){
if($2=="onmouseup"){
LzTrack.__LZmouseup()
}
var $3=true
var $4=false
if($1==null){
$1=this.__findInputtextSelection()
}
LzGlobalMouse.__mouseEvent($2,$1)
if(this.eventsLocked==true){
return
}
var $5=this.modeArray.length-1
while($3&&$5>=0){
var $6=this.modeArray[$5--]
if($1&&$1.childOf($6)){
break
}else{
if($6){
$3=$6.passModeEvent($2,$1)
}
}
}
if($3){
if($2=="onclick"){
if(this.__LZlastclick==$1&&("ondblclick" in $1&&$1.ondblclick)&&!$1.ondblclick.hasNoDelegates&&getTimer()-this.__LZlastClickTime<$1.DOUBLE_CLICK_TIME){
$2="ondblclick"
this.__LZlastclick=null
}else{
this.__LZlastclick=$1
this.__LZlastClickTime=getTimer()
}
}
if($1){
$1.mouseevent($2)
}
if($2=="onmousedown"){
LzFocus.__LZcheckFocusChange($1)
}
}
this["haveGlobal"+$2]=false
}
LzModeManager.__LZallowFocus=function($1){
var $2=this.modeArray.length
return $2==0||$1.childOf(this.modeArray[$2-1])
}
LzModeManager.globalLockMouseEvents=function(){
this.eventsLocked=true
}
LzModeManager.globalUnlockMouseEvents=function(){
this.eventsLocked=false
}
LzModeManager.hasMode=function($1){
for(var $2=this.modeArray.length-1;$2>=0;$2--){
if($1==this.modeArray[$2]){
return true
}
}
return false
}
LzModeManager.getModalView=function(){
return this.modeArray[this.modeArray.length-1]||null
}
LzMouseKernel.setCallback(LzModeManager,"rawMouseEvent")
var LzCursor=new Object()
LzCursor.showHandCursor=LzMouseKernel.showHandCursor
LzCursor.setCursorGlobal=LzMouseKernel.setCursorGlobal
LzCursor.lock=LzMouseKernel.lock
LzCursor.unlock=LzMouseKernel.unlock
LzCursor.restoreCursor=LzMouseKernel.restoreCursor
function LzURL($1){
this.protocol=null
this.host=null
this.port=null
this.path=null
this.file=null
this.query=null
this.fragment=null
if($1!=null){
this.parseURL($1)
}
}
LzURL.prototype.parseURL=function($1){
if(this._parsed==$1){
return
}
this._parsed=$1
var $2=0
var $3=$1.indexOf(":")
var $4=$1.indexOf("?",$2)
var $5=$1.indexOf("#",$2)
var $6=$1.length
if($5!=-1){
$6=$5
}
if($4!=-1){
$6=$4
}
if($3!=-1){
this.protocol=$1.substring($2,$3)
if($1.substring($3+1,$3+3)=="//"){
$2=$3+3
$3=$1.indexOf("/",$2)
if($3==-1){
$3=$6
}
var $7=$1.substring($2,$3)
var $8=$7.indexOf(":")
if($8==-1){
this.host=$7
this.port=null
}else{
this.host=$7.substring(0,$8)
this.port=$7.substring($8+1)
}
}else{
$3++
}
$2=$3
}
$3=$6
this._splitPath($1.substring($2,$3))
if($5!=-1){
this.fragment=$1.substring($5+1,$1.length)
}else{
$5=$1.length
}
if($4!=-1){
this.query=$1.substring($4+1,$5)
}
}
LzURL.prototype._splitPath=function($1){
if($1==""){
return
}
var $2=$1.lastIndexOf("/")
if($2!=-1){
this.path=$1.substring(0,$2+1)
this.file=$1.substring($2+1,$1.length)
if(this.file==""){
this.file=null
}
return
}
this.path=null
this.file=$1
}
LzURL.prototype.dupe=function(){
var $1=new LzURL()
$1.protocol=this.protocol
$1.host=this.host
$1.port=this.port
$1.path=this.path
$1.file=this.file
$1.query=this.query
$1.fragment=this.fragment
return $1
}
LzURL.prototype.toString=function(){
var $1=""
if(this.protocol!=null){
$1+=this.protocol+":"
if(this.host!=null){
$1+="//"+this.host
if(null!=this.port&&LzBrowser.defaultPortNums[this.protocol]!=this.port){
$1+=":"+this.port
}
}
}
if(this.path!=null){
$1+=this.path
}
if(null!=this.file){
$1+=this.file
}
if(null!=this.query){
$1+="?"+this.query
}
if(null!=this.fragment){
$1+="#"+this.fragment
}
return $1
}
LzURL.merge=function($1,$2){
var $3=$1.dupe()
if($1.protocol==null){
$3.protocol=$2.protocol
}
if($1.host==null){
$3.host=$2.host
}
if($1.port==null){
$3.port=$2.port
}
if($1.path==null){
$3.path=$2.path
}
if($1.file==null){
$3.file=$2.file
}
if($1.query==null){
$3.query=$2.query
}
if($1.fragment==null){
$3.fragment=$2.fragment
}
return $3
}
LzModeManager.rawMouseEvent=function($1){
this.handleMouseEvent(null,$1)
}
LzModeManager.handleMouseButton=function($1,$2){
this.handleMouseEvent($1,$2)
}
LzModeManager.__findInputtextSelection=function(){
if(LzInputTextSprite.prototype.__focusedSprite&&LzInputTextSprite.prototype.__focusedSprite.owner){
return LzInputTextSprite.prototype.__focusedSprite.owner
}
}
var LzBrowser=new Object()
LzBrowser.postToLps=true
LzBrowser.loadURL=function($1,$2,$3){
if($2!=null){
window.open($1,$2,$3)
}else{
window.location=$1
}
}
LzBrowser.loadJS=function($1,$2){
this.loadURL("javascript:"+$1+";void(0);",$2)
}
LzBrowser.callJS=function($1){
return eval($1)
}
LzBrowser.getVersion=function(){
return navigator.userAgent
}
LzBrowser.getLoadURL=function(){
var $1=Lz.__propcache.url
if(!$1){
$1=new String(window.location)
}
var $2=$1.indexOf(":")
var $3=$1.indexOf("/")
if($2>-1){
if($1.indexOf("://")==$2){
return $1
}else{
if($1.charAt($2+1)=="/"){
$1=$1.substring(0,$2+1)+"/"+$1.substring($2+1)
return $1
}else{
var $4=new LzURL(new String(window.location))
$1=$1.substring(0,$2+1)+"/"+$4.path+$1.substring($2+1)
return $1
}
}
}else{
if($3==0){
return $1
}else{
var $5=new String(window.location)
var $6=$5.lastIndexOf("/")
$5=$5.substring(0,$6+1)
return $5+$1
}
}
}
LzBrowser.getInitArg=function($1){
return global[$1]
}
LzBrowser.defaultPortNums={http:80,https:443}
LzBrowser.getBaseURL=function($1,$2){
var $3=this.getLoadURLAsLzURL()
if($1){
$3.protocol="https"
}
if($2){
$3.port=$2
}
if($1&&$2==null){
$3.port=LzBrowser.defaultPortNums[$3.protocol]
}
delete $3.query
return $3
}
LzBrowser.getLoadURLAsLzURL=function(){
if(!this.parsedloadurl){
this.parsedloadurl=new LzURL(this.getLoadURL())
}
return this.parsedloadurl.dupe()
}
LzBrowser.toAbsoluteURL=function($1,$2){
if($1.indexOf("://")>-1||$1.indexOf("/@WEBAPP@/")==0||$1.indexOf("file:")==0){
return $1
}
var $3=""
var $4=this.getLoadURLAsLzURL()
if($1.indexOf(":")>-1){
var $5=$1.indexOf(":")
var $6=$4.protocol=="https"
$4.protocol=$1.substring(0,$5)
if($2||$6){
if($4.protocol=="http"){
$4.protocol="https"
}
}
var $7=$1.substring($5+1,$1.length)
if($7.charAt(0)=="/"){
$4.path=$1.substring($5+1)
delete $4.file
}else{
$4.file=$1.substring($5+1)
}
$4.query=null
}else{
if($1.charAt(0)=="/"){
$4.path=$1
$4.file=null
}else{
$4.file=$1
}
$4.query=null
}
return $4.toString()
}
LzBrowser.showMenu=function($1){
fscommand("showmenu",$1)
}
LzBrowser.xmlEscape=function($1){
return LzDataNode.prototype.__LZXMLescape($1)
}
LzBrowser.urlEscape=function($1){
return escape($1)
}
LzBrowser.urlUnescape=function($1){
return unescape($1)
}
LzBrowser.usePost=function(){
return this.postToLps&&this.supportsPost()
}
LzBrowser.supportsPost=function(){
return true
}
LzBrowser.setClipboard=function($1){
System.setClipboard($1)
}
LzBrowser.isAAActive=function(){
var $1=Accessibility.isActive()
return $1
}
LzBrowser.updateAccessibility=function(){
Accessibility.updateProperties()
}
var LzKeys={}
LzKeys.downKeysHash={}
DeclareEvent(LzKeys,"onkeydown")
DeclareEvent(LzKeys,"onkeyup")
DeclareEvent(LzKeys,"onmousewheeldelta")
LzKeys.mousewheeldelta=0
LzKeys.__keyboardEvent=function($1,$2){
for(var $3 in $1){
var $4=$1[$3]
LzKeys.downKeysHash[$3]=$4
if($2){
if($4){
if(LzKeys.onkeydown.ready){
LzKeys.onkeydown.sendEvent($2)
}
}else{
if(LzKeys.onkeyup.ready){
LzKeys.onkeyup.sendEvent($2)
}
}
}
}
}
LzKeys.__mousewheelEvent=function($1){
LzKeys.mousewheeldelta=$1
if(LzKeys.onmousewheeldelta.ready){
LzKeys.onmousewheeldelta.sendEvent($1)
}
}
LzKeys.isKeyDown=function($1){
$1=$1.toLowerCase()
return LzKeys.downKeysHash[$1]==true
}
LzKeys.callOnKeyCombo=function($1,$2){

}
LzKeyboardKernel.setCallback(LzKeys,"__keyboardEvent","__mousewheelEvent")
LzKeys.keyCodes={a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,numbpad0:96,numbpad1:97,numbpad2:98,numbpad3:99,numbpad4:100,numbpad5:101,numbpad6:102,numbpad7:103,numbpad8:104,numbpad9:105,multiply:106,enter:13,subtract:109,decimal:110,divide:111,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123,backspace:8,tab:9,clear:12,enter:13,shift:16,control:17,alt:18,capslock:20,esc:27,spacebar:32,pageup:33,pagedown:34,end:35,home:36,leftarrow:37,uparrow:38,rightarrow:39,downarrow:40,insert:45,help:47,numlock:144}
LzKeys.keyCodes["add"]=107
LzKeys.keyCodes["delete"]=46
LzKeys.keyCodes["0"]=48
LzKeys.keyCodes["1"]=49
LzKeys.keyCodes["2"]=50
LzKeys.keyCodes["3"]=51
LzKeys.keyCodes["4"]=52
LzKeys.keyCodes["5"]=53
LzKeys.keyCodes["6"]=54
LzKeys.keyCodes["7"]=55
LzKeys.keyCodes["8"]=56
LzKeys.keyCodes["9"]=57
LzKeys.keyCodes[")"]=48
LzKeys.keyCodes["!"]=49
LzKeys.keyCodes["@"]=50
LzKeys.keyCodes["#"]=51
LzKeys.keyCodes["$"]=52
LzKeys.keyCodes["%"]=53
LzKeys.keyCodes["^"]=54
LzKeys.keyCodes["&"]=55
LzKeys.keyCodes["*"]=56
LzKeys.keyCodes["("]=57
LzKeys.keyCodes[";"]=186
LzKeys.keyCodes[":"]=186
LzKeys.keyCodes["="]=187
LzKeys.keyCodes["+"]=187
LzKeys.keyCodes["<"]=188
LzKeys.keyCodes[","]=188
LzKeys.keyCodes["-"]=189
LzKeys.keyCodes["_"]=189
LzKeys.keyCodes[">"]=190
LzKeys.keyCodes["."]=190
LzKeys.keyCodes["/"]=191
LzKeys.keyCodes["?"]=191
LzKeys.keyCodes["`"]=192
LzKeys.keyCodes["~"]=192
LzKeys.keyCodes["["]=219
LzKeys.keyCodes["{"]=219
LzKeys.keyCodes["\\"]=220
LzKeys.keyCodes["|"]=220
LzKeys.keyCodes["]"]=221
LzKeys.keyCodes["}"]=221
LzKeys.keyCodes['"']=222
LzKeys.keyCodes["'"]=222
LzKeys.keyCodes["IME"]=229
var LzHistory=new Object()
LzHistory.isReady=true
LzHistory.setHistory=function($1){
Lz.history.set($1)
this.__lzloading=true
}
LzHistory.getPersist=function($1){

}
LzHistory.offset=0
LzHistory.__lzdirty=false
LzHistory.__lzhistq=[]
LzHistory.__lzcurrstate={}
LzHistory.__lzloading=false
LzHistory.__lzloadcache={}
LzHistory.__loadcacheused=false
DeclareEvent(LzHistory,"onoffset")
LzHistory.receiveHistory=function($1){
$1*=1
if(!$1){
$1=0
}
if($1>this.__lzhistq.length-1){
$1=this.__lzhistq.length
}
this.offset=$1
if(this.onoffset.ready){
this.onoffset.sendEvent($1)
}
var $2=this.__lzhistq[$1]
for(var $3 in $2){
var $1=$2[$3]
var $lzsc$332963310=global[$1.c]
var $lzsc$2043861255=$1.n
var $lzsc$209002626=$1.v
if(!$lzsc$332963310.__LZdeleted){
var $lzsc$1348594797=$lzsc$332963310.setters
if($lzsc$1348594797&&$lzsc$2043861255 in $lzsc$1348594797){
$lzsc$332963310[$lzsc$1348594797[$lzsc$2043861255]]($lzsc$209002626)
}else{
$lzsc$332963310[$lzsc$2043861255]=$lzsc$209002626
var $lzsc$1154308536="on"+$lzsc$2043861255
if($lzsc$1154308536 in $lzsc$332963310){
if($lzsc$332963310[$lzsc$1154308536].ready){
$lzsc$332963310[$lzsc$1154308536].sendEvent($lzsc$209002626)
}
}
}
}
}
if(this.__loadcacheused){
var $4=this.__lzhistq[this.offset]
if($4==null){
$4={}
}
var $3
for($3 in this.__lzloadcache){
$4[$3]=this.__lzloadcache[$3]
}
this.__lzhistq[this.offset]=$4
this.__lzloadcache={}
this.__loadcacheused=false
}
this.__lzloading=false
}
LzHistory.receiveEvent=function($1,$2){
canvas[$1]=$2
if(canvas["on"+$1].ready){
canvas["on"+$1].sendEvent($2)
}
}
LzHistory.getCanvasAttribute=function($1){
return canvas[$1]
}
LzHistory.setCanvasAttribute=LzHistory.receiveEvent
LzHistory.callMethod=function($1){
return eval($1)
}
LzHistory.save=function($1,$2,$3){
if($3==null){
$3=global[$1][$2]
}
if(this.__lzloading){
this.__lzloadcache[$1]={c:$1,n:$2,v:$3}
this.__loadcacheused=true
}else{
this.__lzcurrstate[$1]={c:$1,n:$2,v:$3}
this.__lzdirty=true
}
}
LzHistory.commit=function(){
if(!this.__lzdirty){
return
}
this.__lzhistq[this.offset]=this.__lzcurrstate
this.__lzhistq.length=this.offset+1
this.__lzcurrstate={}
this.__lzdirty=false
}
LzHistory.move=function($1){
this.commit()
if(!$1){
$1=1
}
var $2=this.offset+$1
if(0>=$2){
$2=0
}
if(this.__lzhistq.length>=$2){
this.setHistory($2)
}
}
LzHistory.next=function(){
this.move(1)
}
LzHistory.prev=function(){
this.move(-1)
}
LzHistory.clear=function(){
this.__lzhistq=[]
this.offset=0
if(this.onoffset.ready){
this.onoffset.sendEvent(0)
}
}
LzHistory.setPersist=function(){

}
Lz.__dhtmlhistoryready=true
function LzCSSStyleRule(){

}
LzCSSStyleRule.prototype.properties=null
LzCSSStyleRule.prototype.selector=null
LzCSSStyleRule.prototype.specificity=0
LzCSSStyleRule.prototype.getSpecificity=function(){
if(!this.specificity){
if(this.parsed.type==LzCSSStyle._sel_compound){
for(var $1=0;$1<this.parsed.length;$1++){
this.specificity+=LzCSSStyle.getSelectorSpecificity(this.parsed[$1])
}
}else{
this.specificity=LzCSSStyle.getSelectorSpecificity(this.parsed)
}
}
return this.specificity
}
LzCSSStyleRule._getSimpleSelectorSpecificity=function($1,$2){
var $3=$1[$2]
if($2=="simpleselector"){
return 1
}
if($3.indexOf("#")>=0){
return 100
}
if($3.indexOf("[")>=0){
return 10
}
return 1
}
var LzCSSStyle={}
LzCSSStyle.getComputedStyle=function($1){
var $2=new LzCSSStyleDeclaration()
$2.setNode($1)
return $2
}
LzCSSStyle.__LZRuleCache={}
LzCSSStyle.__LZPropertyCache={}
LzCSSStyle.getPropertyValueFor=function($1,$2){
if(!$1||!$2){
return
}
var $3=$1
while($3!=canvas){
var $4=$3.__LZUID
var $5=this.__LZPropertyCache[$4+$2]
if($5!=null){
return $5
}
var $6=this.__LZRuleCache[$4]
if(!$6){
$6=new Array()
var $7
for(var $8=this._rules.length-1;$8>=0;$8--){
$7=this._rules[$8]
var $9=$7.parsed
if($9.type==this._sel_compound){
var $10=$3
var $11=$9.length-1
var $12=true
var $13=false
while($10!=canvas){
var $14=$9[$11]
t=$14.type
if(t==this._sel_star||t==this._sel_id&&$14.id==$10.id||t==this._sel_tag&&($14.classname in lz&&$10 instanceof lz[$14.classname]||$14.classname in global&&$10 instanceof global[$14.classname])||t==this._sel_attribute&&$10[$14.attrname]==$14.attrvalue||t==this._sel_tagAndAttr&&$10[$14.attrname]==$14.attrvalue&&($14.classname in lz&&$10 instanceof lz[$14.classname]||$14.classname in global&&$10 instanceof global[$14.classname])||t==this._sel_compound&&this._compoundSelectorApplies($14,$10,true)){
if($11--==0){
$13=true
break
}
}else{
if($12){
$13=false
break
}
}
$10=$10.parent
$12=false
}
if($13){
$6.push($7)
}
}else{
if($9.type==this._sel_star||$9.type==this._sel_id&&$9.id==$3.id||$9.type==this._sel_tag&&($9.classname in lz&&$3 instanceof lz[$9.classname]||$9.classname in global&&$3 instanceof global[$9.classname])||$9.type==this._sel_attribute&&$3[$9.attrname]==$9.attrvalue||$9.type==this._sel_tagAndAttr&&$3[$9.attrname]==$9.attrvalue&&($9.classname in lz&&$3 instanceof lz[$9.classname]||$9.classname in global&&$3 instanceof global[$9.classname])){
$6.push($7)
}
}
}
var $15=$3.name!=null?this._nameRules[$3.name]:null
if($15){
for(var $8=$15.length-1;$8>=0;$8--){
$7=$15[$8]
var $9=$7.parsed
if($9.type==this._sel_compound){
var $10=$3
var $11=$9.length-1
var $12=true
var $13=false
while($10!=canvas){
var $14=$9[$11]
t=$14.type
if(t==this._sel_star||t==this._sel_id&&$14.id==$10.id||t==this._sel_tag&&($14.classname in lz&&$10 instanceof lz[$14.classname]||$14.classname in global&&$10 instanceof global[$14.classname])||t==this._sel_attribute&&$10[$14.attrname]==$14.attrvalue||t==this._sel_tagAndAttr&&$10[$14.attrname]==$14.attrvalue&&($14.classname in lz&&$10 instanceof lz[$14.classname]||$14.classname in global&&$10 instanceof global[$14.classname])||t==this._sel_compound&&this._compoundSelectorApplies($14,$10,true)){
if($11--==0){
$13=true
break
}
}else{
if($12){
$13=false
break
}
}
$10=$10.parent
$12=false
}
if($13){
$6.push($7)
}
}else{
if($9.type==this._sel_star||$9.type==this._sel_id&&$9.id==$3.id||$9.type==this._sel_tag&&($9.classname in lz&&$3 instanceof lz[$9.classname]||$9.classname in global&&$3 instanceof global[$9.classname])||$9.type==this._sel_attribute&&$3[$9.attrname]==$9.attrvalue||$9.type==this._sel_tagAndAttr&&$3[$9.attrname]==$9.attrvalue&&($9.classname in lz&&$3 instanceof lz[$9.classname]||$9.classname in global&&$3 instanceof global[$9.classname])){
$6.push($7)
}
}
}
}
$6.sort(this.__compareSpecificity)
this.__LZRuleCache[$4]=$6
}
var $16=$6.length
var $8=0
while($8<$16){
var $17=$6[$8++].properties
if($2 in $17){
$5=$17[$2]
this.__LZPropertyCache[$4+$2]=$5
break
}
}
if($5!=null){
return $5
}
$3=$3.immediateparent
}
}
LzCSSStyle.getSelectorSpecificity=function($1){
switch($1.type){
case this._sel_tag:
case this._sel_star:
return 1
case this._sel_id:
return 100
case this._sel_attribute:
return 10
case this._sel_tagAndAttr:
return 11

}
}
LzCSSStyle.__compareSpecificity=function($1,$2){
if(!$1.specificity){
if(!$1.specificity){
if($1.parsed.type==LzCSSStyle._sel_compound){
for(var $3=0;$3<$1.parsed.length;$3++){
switch($1.parsed[$3].type){
case LzCSSStyle._sel_tag:
case LzCSSStyle._sel_star:
$1.specificity+=1
break
case LzCSSStyle._sel_id:
$1.specificity+=100
break
case LzCSSStyle._sel_attribute:
$1.specificity+=10
break
case LzCSSStyle._sel_tagAndAttr:
$1.specificity+=11
break

}
}
}else{
switch($1.parsed.type){
case LzCSSStyle._sel_tag:
case LzCSSStyle._sel_star:
$1.specificity=1
break
case LzCSSStyle._sel_id:
$1.specificity=100
break
case LzCSSStyle._sel_attribute:
$1.specificity=10
break
case LzCSSStyle._sel_tagAndAttr:
$1.specificity=11
break

}
}
}
}
if(!$2.specificity){
if(!$2.specificity){
if($2.parsed.type==LzCSSStyle._sel_compound){
for(var $3=0;$3<$2.parsed.length;$3++){
switch($2.parsed[$3].type){
case LzCSSStyle._sel_tag:
case LzCSSStyle._sel_star:
$2.specificity+=1
break
case LzCSSStyle._sel_id:
$2.specificity+=100
break
case LzCSSStyle._sel_attribute:
$2.specificity+=10
break
case LzCSSStyle._sel_tagAndAttr:
$2.specificity+=11
break

}
}
}else{
switch($2.parsed.type){
case LzCSSStyle._sel_tag:
case LzCSSStyle._sel_star:
$2.specificity=1
break
case LzCSSStyle._sel_id:
$2.specificity=100
break
case LzCSSStyle._sel_attribute:
$2.specificity=10
break
case LzCSSStyle._sel_tagAndAttr:
$2.specificity=11
break

}
}
}
}
var $4=$1.specificity
var $5=$2.specificity
if($4==$5){
if($1.parsed.type==LzCSSStyle._sel_compound&&$2.parsed.type==LzCSSStyle._sel_compound){
for(var $3=0;$3<$1.parsed.length;$3++){
if(!$1.parsed[$3]||!$2.parsed[$3]){
break
}
if(!$1.parsed[$3].classname||!$2.parsed[$3].classname||$1.parsed[$3].classname==$2.parsed[$3].classname){
continue
}
var $6=lz[$1.parsed[$3].classname]
var $7=lz[$2.parsed[$3].classname]
return $6&&$7&&"prototype" in $6&&$6.prototype instanceof $7?-1:1
}
}
if($1.parsed.classname&&$2.parsed.classname&&$1.parsed.classname!=$2.parsed.classname){
var $6=lz[$1.parsed.classname]
var $7=lz[$2.parsed.classname]
return $6&&$7&&"prototype" in $6&&$6.prototype instanceof $7?-1:1
}else{
return $1._lexorder<$2._lexorder?1:-1
}
}
return $4<$5?1:-1
}
LzCSSStyle._printRuleArray=function($1){
for(var $2=0;$2<$1.length;$2++){
Debug.write($2,$1[$2])
}
}
LzCSSStyle._compoundSelectorApplies=function($1,$2){
var $3=$2
var $4=$1.length-1
var $5=true
var $6=false
while($3!=canvas){
var $7=$1[$4]
var $8=$7.type
if($8==this._sel_star||$8==this._sel_id&&$7.id==$3.id||$8==this._sel_tag&&($7.classname in lz&&$3 instanceof lz[$7.classname]||$7.classname in global&&$3 instanceof global[$7.classname])||$8==this._sel_attribute&&$3[$7.attrname]==$7.attrvalue||$8==this._sel_tagAndAttr&&$3[$7.attrname]==$7.attrvalue&&($7.classname in lz&&$3 instanceof lz[$7.classname]||$7.classname in global&&$3 instanceof global[$7.classname])||$8==this._sel_compound&&this._compoundSelectorApplies($7,$3,true)){
if($4--==0){
$6=true
break
}
}else{
if($5){
$6=false
break
}
}
$3=$3.parent
$5=false
}
return $6
}
LzCSSStyle._sel_unknown=0
LzCSSStyle._sel_star=1
LzCSSStyle._sel_id=2
LzCSSStyle._sel_tag=3
LzCSSStyle._sel_compound=4
LzCSSStyle._sel_attribute=5
LzCSSStyle._sel_tagAndAttr=6
LzCSSStyle._rules=new Array()
LzCSSStyle._nameRules={}
LzCSSStyle._rulenum=0
LzCSSStyle._addRule=function($1){
$1._lexorder=this._rulenum++
var $2=$1.selector
$1.parsed=null
var $3
if($2 instanceof Array){
$1.parsed=[]
$1.parsed.type=this._sel_compound
for(var $4=0;$4<$2.length;$4++){
$1.parsed.push(this._parseSelector($2[$4]))
}
$3=$1.parsed[$1.parsed.length-1]
}else{
$1.parsed=this._parseSelector($2)
$3=$1.parsed
}
if(($3.type==this._sel_attribute||$3.type==this._sel_tagAndAttr)&&$3.attrname=="name"){
var $5=$3.attrvalue
if(!this._nameRules[$5]){
this._nameRules[$5]=[]
}
this._nameRules[$5].push($1)
}else{
this._rules.push($1)
}
}
LzCSSStyle._parseSelector=function($1){
switch(typeof $1){
case "object":
if($1.simpleselector){
$1.type=this._sel_tagAndAttr
$1.classname=this._normalizeClassname($1.simpleselector)
}else{
$1.type=this._sel_attribute
}
return $1
break
case "string":
return this._parseStringSelector($1)
break

}
}
LzCSSStyle._parseStringSelector=function($1){
var $2={}
if($1=="*"){
$2.type=this._sel_star
}else{
var $3=$1.indexOf("#")
if($3>=0){
$2.id=$1.substring($3+1)
$2.type=this._sel_id
}else{
$2.type=this._sel_tag
$2.classname=this._normalizeClassname($1)
}
}
return $2
}
LzCSSStyle._normalizeClassname=function($1){
switch($1){
case "view":
return "LzView"
case "animator":
return "LzAnimator"
case "animatorgroup":
return "LzAnimatorGroup"
case "canvas":
return "LzCanvas"
case "drawview":
return "LzDrawView"
case "inputtext":
return "LzInputText"
case "layout":
return "LzLayout"
case "node":
return "LzNode"
case "state":
return "LzState"
case "text":
return "LzText"
default:
return $1

}
}
function LzCSSStyleDeclaration(){

}
LzCSSStyleDeclaration.prototype._node=null
LzCSSStyleDeclaration.prototype.getPropertyValue=function($1){
return LzCSSStyle.getPropertyValueFor(this._node,$1)
}
LzCSSStyleDeclaration.prototype.setNode=function($1){
this._node=$1
}
function LzStyleSheet($1,$2,$3,$4){
this.type=$4
this.disabled=false
this.ownerNode=null
this.parentStyleSheet=null
this.href=$2
this.title=$1
this.media=$3
}
function LzCSSStyleSheet($1,$2,$3,$4,$5,$6){
this.type=$4
this.disabled=false
this.ownerNode=null
this.parentStyleSheet=null
this.href=$2
this.title=$1
this.media=$3
this.ownerRule=$5
this.cssRules=$6
}
LzCSSStyleSheet.prototype.insertRule=function($1,$2){
if(!this.cssRules){
this.cssRules=[]
}
if($2<0){
return null
}
if($2<this.cssRules.length){
this.cssRules.splice($2,0,$1)
return $2
}
if($2==this.cssRules.length){
return this.cssRules.push($1)-1
}
return null
}
var LzTrackClass=Class.make("LzTrackClass",null,{__LZreg:new Object(),__LZactivegroups:null,__LZtrackDel:null,__LZoptimizeforaxis:"x",__LZmouseupDel:null,initialize:function(){
(arguments.callee.superclass?arguments.callee.superclass.prototype["initialize"]:this.nextMethod(arguments.callee,"initialize")).apply(this,arguments)
this.__LZtrackDel=new LzDelegate(this,"__LZtrack")
this.__LZmouseupDel=new LzDelegate(this,"__LZmouseup",LzGlobalMouse,"onmouseup")
},register:function($1,$2){
if($1==null||$2==null){
return
}
if(typeof this.__LZreg[$2]=="undefined"){
this.__LZreg[$2]=[]
this.__LZreg[$2].__LZlasthit=0
}
this.__LZreg[$2].push($1)
if(!this.__LZdestroydel){
this.__LZdestroydel=new LzDelegate(this,"__LZdestroyitem")
}
this.__LZdestroydel.register($1,"ondestroy")
},unregister:function($1,$2){
if($1==null||$2==null){
return
}
var $3=this.__LZreg[$2]
if($3){
for(var $4=0;$4<$3.length;$4++){
if($3[$4]==$1){
$3.splice($4,1)
}
}
if($3.length==0){
delete this.__LZreg[$2]
}
}
this.__LZdestroydel.unregisterFrom($1.ondestroy)
},__LZdestroyitem:function($1){
for(var $2 in this.__LZreg){
this.unregister($1,$2)
}
},activate:function($1){
if(this.__LZactivegroups==null){
this.__LZactivegroups=[]
this.__LZtrackDel.register(LzIdle,"onidle")
}
var $2=false
for(var $3 in this.__LZactivegroups){
if(this.__LZactivegroups[$3]==this.__LZreg[$1]){
$2=true
}
}
if(!$2){
this.__LZactivegroups.push(this.__LZreg[$1])
}
},deactivate:function($1){
for(var $2 in this.__LZactivegroups){
if(this.__LZactivegroups[$2]==this.__LZreg[$1]){
this.__LZactivegroups.splice($2,1)
}
}
if(this.__LZactivegroups==[]){
this.__LZtrackDel.unregisterAll()
}
if(typeof this.__LZreg[$1]!="undefined"){
this.__LZreg[$1].__LZlasthit=0
}
},__LZtopview:function($1,$2){
var $3=$2
var $4=$1
while($4.nodeLevel<$3.nodeLevel){
$3=$3.immediateparent
if($3==$1){
return $2
}
}
while($3.nodeLevel<$4.nodeLevel){
$4=$4.immediateparent
if($4==$2){
return $1
}
}
while($4.immediateparent!=$3.immediateparent){
$4=$4.immediateparent
$3=$3.immediateparent
}
if($4.getZ()>$3.getZ()){
return $1
}else{
return $2
}
},__LZfindTopmost:function($1){
var $2=$1[0]
for(var $3=1;$3<$1.length;$3++){
$2=this.__LZtopview($2,$1[$3])
}
return $2
},__LZtrackgroup:function($1,$2){
for(var $3=0;$3<$1.length;$3++){
var $4=$1[$3]
if($4.visible){
var $5=$4.getMouse("x")
if($5>0&&$5<$4.width){
var $6=$4.getMouse("y")
if($6>0&&$6<$4.height){
$2.push($4)
}
}
}
}
},__LZtrack:function(){
var $1=false
var $2=[]
for(var $3 in this.__LZactivegroups){
var $4=[]
var $5=this.__LZactivegroups[$3]
if($5){
this.__LZtrackgroup($5,$4)
}
if(!$4.length&&$5&&$5.__LZlasthit){
if($5.__LZlasthit.onmousetrackout&&$5.__LZlasthit.onmousetrackout.ready){
$5.__LZlasthit.onmousetrackout.sendEvent($5.__LZlasthit)
}
$5.__LZlasthit=0
}else{
var $6=this.__LZfindTopmost($4)
if($6&&$6!=$5.__LZlasthit){
if($5.__LZlasthit.onmousetrackout&&$5.__LZlasthit.onmousetrackout.ready){
$5.__LZlasthit.onmousetrackout.sendEvent($5.__LZlasthit)
}
$1=true
$2.push($6)
$5.__LZlasthit=$6
}
}
}
if($1){
for(var $3=0;$3<$2.length;$3++){
var $7=$2[$3]
if($7.onmousetrackover.ready){
$7.onmousetrackover.sendEvent($7)
}
}
}
},__LZmouseup:function(){
for(var $1 in this.__LZactivegroups){
var $2=this.__LZactivegroups[$1]
if($2&&$2.__LZlasthit.onmousetrackup&&$2.__LZlasthit.onmousetrackup.ready){
if(this["__LZlastmouseup"]==$2.__LZlasthit){
this.__LZlastmouseup=null
}else{
$2.__LZlasthit.onmousetrackup.sendEvent(this.__LZlasthit)
this.__LZlastmouseup=$2.__LZlasthit
}
}
}
}},null)
var LzTrack=new LzTrackClass()
var LzFocus=new Object()
DeclareEvent(LzFocus,"onfocus")
LzFocus.lastfocus=null
LzFocus.csel=null
LzFocus.upDel=new LzDelegate(LzFocus,"gotKeyUp",LzKeys,"onkeyup")
LzFocus.downDel=new LzDelegate(LzFocus,"gotKeyDown",LzKeys,"onkeydown")
LzFocus.focuswithkey=null
LzFocus.__LZskipblur=false
LzFocus.__LZsfnextfocus=-1
LzFocus.__LZsfrunning=false
LzFocus.gotKeyUp=function($1){
if(this.csel&&this.csel.onkeyup.ready){
this.csel.onkeyup.sendEvent($1)
}
}
LzFocus.gotKeyDown=function($1){
if(this.csel&&this.csel.onkeydown.ready){
this.csel.onkeydown.sendEvent($1)
}
if($1==LzKeys.keyCodes.tab){
if(LzKeys.isKeyDown("shift")){
this.prev()
}else{
this.next()
}
}
}
LzFocus.setNextKey=function($1){

}
LzFocus.setPrevKey=function($1){

}
LzFocus.__LZcheckFocusChange=function($1){
if($1&&$1.focusable){
this.setFocus($1,false)
}
}
LzFocus.setFocus=function($1){
if(this.__LZsfrunning){
this.__LZsfnextfocus=$1
return
}
if(this.cseldest==$1){
return
}
if(this.csel&&this.csel.shouldYieldFocus&&!this.csel.shouldYieldFocus()){
return
}
var $2=this.csel
if($2){
$2.blurring=true
}
this.__LZsfnextfocus=-1
this.__LZsfrunning=true
if($1&&!$1.focusable){
$1=this.getNext($1)
}
this.cseldest=$1
if(arguments[1]!=null){
this.focuswithkey=arguments[1]
}
if(!this.__LZskipblur){
this.__LZskipblur=true
if(this.csel&&this.csel.onblur.ready){
this.csel.onblur.sendEvent($1)
}
if(this.__LZsfnextfocus!=-1){
this.__LZsfrunning=false
this.setFocus(this.__LZsfnextfocus)
return
}
}
this.lastfocus=this.csel
this.csel=$1
this.__LZskipblur=false
if($1&&$1.onfocus.ready){
$1.onfocus.sendEvent($1)
}
if(this.__LZsfnextfocus!=-1){
this.__LZsfrunning=false
this.setFocus(this.__LZsfnextfocus)
return
}
if(this.onfocus.ready){
this.onfocus.sendEvent($1)
}
this.__LZsfrunning=false
if(this.__LZsfnextfocus!=-1){
this.setFocus(this.__LZsfnextfocus)
return
}
if($2){
$2.blurring=false
}
}
LzFocus.clearFocus=function(){
this.setFocus(null)
}
LzFocus.getFocus=function(){
return this.csel
}
LzFocus.next=function(){
this.genMoveSelection(1)
}
LzFocus.getNext=function($1){
if(!$1){
$1=this.csel
}
return this.moveSelSubview($1,1)
}
LzFocus.getPrev=function($1){
if(!$1){
$1=this.csel
}
return this.moveSelSubview($1,-1)
}
LzFocus.prev=function(){
this.genMoveSelection(-1)
}
LzFocus.genMoveSelection=function($1){
var $2=this.csel
var $3=$2
while($2&&$3!=canvas){
if(!$3.visible){
$2=null
}
$3=$3.immediateparent
}
if($2==null){
$2=LzModeManager.getModalView()
}
var $4=null
if($2&&$2["get"+($1==1?"Next":"Prev")+"Selection"]){
$4=$2["get"+($1==1?"Next":"Prev")+"Selection"]()
}
if($4==null){
$4=this.moveSelSubview($2,$1)
}
if(!LzModeManager.__LZallowFocus($4)){
return
}
this.setFocus($4,true)
}
LzFocus.accumulateSubviews=function($1,$2,$3,$4){
if($2==$3||$2.focusable&&$2.visible){
$1.push($2)
}
if($4||!$2.focustrap&&$2.visible){
for(var $5=0;$5<$2.subviews.length;$5++){
this.accumulateSubviews($1,$2.subviews[$5],$3)
}
}
}
LzFocus.moveSelSubview=function($1,$2){
var $3=$1||canvas
while(!$3.focustrap&&$3.immediateparent&&$3!=$3.immediateparent){
$3=$3.immediateparent
}
var $4=[]
this.accumulateSubviews($4,$3,$1,true)
var $5=-1
for(var $6 in $4){
if($4[$6]==$1){
$5=Number($6)
break
}
}
if($5==-1&&$2==-1){
$5=0
}
$5=($5+$2+$4.length)%$4.length
return $4[$5]
}
var LzIdleClass=Class.make("LzIdleClass",null,{coi:[],removeCOI:null,initialize:function(){
this.removeCOI=new LzDelegate(this,"removeCallIdleDelegates")
},callOnIdle:function($1){
this.coi.push($1)
if(!("regNext" in this&&this.regNext)){
this.regNext=true
this.removeCOI.register(this,"onidle")
}
},removeCallIdleDelegates:function($1){
var $2=this.coi
this.coi=new Array()
for(var $3=0;$3<$2.length;$3++){
$2[$3].execute($1)
}
if(this.coi.length==0){
this.removeCOI.unregisterFrom(this.onidle)
this.regNext=false
}
},toString:function(){
return "LzIdle"
}},null);(function(){
with(LzIdleClass){
with(LzIdleClass.prototype){
DeclareEvent(prototype,"onidle")
}
}
})()
var LzIdle=new LzIdleClass()
function __idleupdate(){
var $1=LzIdle.onidle
if($1.ready){
$1.sendEvent(getTimer())
}
}
LzIdleKernel.addCallback(this,"__idleupdate")
var LzTimerClass=Class.make("LzTimerClass",null,{timerList:new Object(),addTimer:function($1,$2){
var p={"delegate":$1}
var $3=function(){
LzTimer.removeTimerWithID(p.delegate,p.id)
p.delegate.execute(new Date().getTime())
}
var $4=setInterval($3,$2)
p.id=$4
var $5=this.timerList[$1]
if($5==null){
this.timerList[$1]=$4
}else{
if(!($5 instanceof Array)){
this.timerList[$1]=[$5,$4]
}else{
$5.push($4)
}
}
return $4
},removeTimer:function($1){
var $2=this.timerList[$1]
var $3=null
if($2!=null){
if($2 instanceof Array){
$3=$2.shift()
clearInterval($3)
if($2.length==0){
delete this.timerList[$1]
}
}else{
$3=$2
clearInterval($3)
delete this.timerList[$1]
}
}
return $3
},removeTimerWithID:function($1,$2){
var $3=this.timerList[$1]
if($3!=null){
if($3 instanceof Array){
var $4=0
for($4=0;$4<$3.length;$4++){
var $5=$3[$4]
if($5==$2){
clearInterval($2)
$3.splice($4,1)
break
}
}
if($3.length==0){
delete this.timerList[$1]
}
}else{
if($3==$2){
clearInterval($2)
delete this.timerList[$1]
}
}
}
},resetTimer:function($1,$2){
this.removeTimer($1)
return this.addTimer($1,$2)
}},null)
var LzTimer=new LzTimerClass()
function LzInstantiateView($1,$2){
if($1.name=="trait"){
new LzTrait($1)
return
}
if(typeof $2=="undefined"){
$2=1
}
canvas.initiatorAddNode($1,$2)
}
function lzAddLocalData($1,$2,$3){
return new LzDataset(canvas,{name:$1,initialdata:$2,trimwhitespace:$3})
}
//END LFC
var $backtrace=false
var $dhtml=true
var $as3=false
var $js1=true
var $swf7=false
var $swf8=false
var $svg=false
var $as2=false
var $swf9=false
var $profile=false
var $runtime="dhtml"
var $debug=false
var $j2me=false
canvas=new LzCanvas({__LZproxied:"true",bgcolor:9737389,debugApp:function(){
with(this){
cb_debug.setValue(true)
canvas.reloadApp()
}
},deploySOLO:function(){
with(this){
var $1=escape(app_fullpath.substring(app_lps_root.length))
if(app_runtime=="dhtml"){
var $2=app_lps_root+"/lps/admin/solo-dhtml-deploy.jsp?appurl="+$1
}else{
var $2=app_lps_root+"/lps/admin/solo-deploy.jsp?appurl="+$1
}
this.loadURL($2)
}
},displayObjectByID:function($1){
with(this){
receivingLC.send("lc_appdebug"+app_uid,"evalExpr","_root.$modules.lz.Debug.displayObj("+$1+")")
}
},embedfonts:true,fontname:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",gotoApp:function(){
with(this){
var $1=app_fullpath.substring(0,app_fullpath.length-4)+".lzx"
app_fullpath=$1
this.reloadApp()
}
},height:70,loadURL:function($1){
with(this){
LzBrowser.loadURL($1,"_top")
}
},lpsbuild:"6429 /Users/maxcarlson/openlaszlo/wafflecone",lpsbuilddate:"2007-09-11T11:31:35-0700",lpsrelease:"Latest",lpsversion:"4.0.x",proxied:false,reloadApp:function($1){
with(this){
var $2=rg_runtime.value
var $3=cb_debug.value
var $4=cb_backtrace.value
var $5=cb_remotedebug.value
var $6=new LzParam(this)
var $7=LzParam.prototype.parseQueryString(app_query)
$7["debug"]=$3
$7["lzbacktrace"]=$4
$7["lzr"]=$2
if($5){
$7["lzconsoledebug"]=true
$7["debug"]=true
}else{
delete $7.lzconsoledebug
delete $7.remotedebug
}
if(app_lzt!=null){
$7["lzt"]=app_lzt
}
if($7.lzr=="dhtml"){
if($7.debug+""=="false"){
delete $7["debug"]
}else{
$7.debug="true"
}
}
var $8={}
for(var $9 in $7){
if($9==""){
continue
}
if($9.indexOf("#38;")!=-1){
var $10=$9.indexOf("#38;")
$9=$9.substring($10+4,$9.length)
}
if($8[$9]){
continue
}
$6.setValue($9,$7[$9])
$8[$9]=true
}
var $11=app_fullpath+"?"+$6.serialize()
this.loadURL($11)
}
},remoteEval:function($1){
with(this){
receivingLC.send("lc_appdebug"+app_uid,"evalExpr",$1)
}
},runtime:"dhtml",sendConsoleAlive:function(){
with(this){
receivingLC.send("lc_appdebug"+app_uid,"consoleAlive",true)
}
},showLogMessage:function($1){
with(this){
console.writeRaw(escapeXML($1)+"<br>")
}
},showWarning:function($1,$2,$3){
with(this){
console.writeRaw($3)
}
},viewDev:function(){
var $1="http://www.laszlosystems.com/developers"
this.loadURL($1)
},viewDocs:function(){
with(this){
var $1=app_lps_root+"/docs/index.html"
this.loadURL($1)
}
},viewForums:function(){
var $1="http://www.laszlosystems.com/developers/community/forums/"
this.loadURL($1)
},viewSource:function(){
with(this){
app_lzt="source"
canvas.reloadApp()
}
},viewWrapper:function(){
with(this){
app_lzt="deployment"
canvas.reloadApp()
}
},width:"100%"})
LzInstantiateView({name:"script",attrs:{script:function(){
_root.offwhite=void 0
_root.gray10=void 0
_root.gray20=void 0
_root.gray30=void 0
_root.gray40=void 0
_root.gray50=void 0
_root.gray60=void 0
_root.gray70=void 0
_root.gray80=void 0
_root.gray90=void 0
_root.iceblue1=void 0
_root.iceblue2=void 0
_root.iceblue3=void 0
_root.iceblue4=void 0
_root.iceblue5=void 0
_root.palegreen1=void 0
_root.palegreen2=void 0
_root.palegreen3=void 0
_root.palegreen4=void 0
_root.palegreen5=void 0
_root.gold1=void 0
_root.gold2=void 0
_root.gold3=void 0
_root.gold4=void 0
_root.sand1=void 0
_root.sand2=void 0
_root.sand3=void 0
_root.sand4=void 0
_root.ltpurple1=void 0
_root.ltpurple2=void 0
_root.ltpurple3=void 0
_root.ltpurple4=void 0
_root.grayblue=void 0
_root.graygreen=void 0
_root.graypurple=void 0
_root.ltblue=void 0
_root.ltgreen=void 0
offwhite=15921906
gray10=1710618
gray20=3355443
gray30=5066061
gray40=6710886
gray50=8355711
gray60=10066329
gray70=11776947
gray80=13421772
gray90=15066597
iceblue1=3298963
iceblue2=5472718
iceblue3=12240085
iceblue4=14017779
iceblue5=15659509
palegreen1=4290113
palegreen2=11785139
palegreen3=12637341
palegreen4=13888170
palegreen5=15725032
gold1=9331721
gold2=13349195
gold3=15126388
gold4=16311446
sand1=13944481
sand2=14276546
sand3=15920859
sand4=15986401
ltpurple1=6575768
ltpurple2=12038353
ltpurple3=13353453
ltpurple4=15329264
grayblue=12501704
graygreen=12635328
graypurple=10460593
ltblue=14540287
ltgreen=14548957
}}},1)
LzResourceLibrary.lzfocusbracket_topleft_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft.png"],width:7,height:7}
LzResourceLibrary.lzfocusbracket_topleft_shdw_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_lft_shdw.png"],width:9,height:9}
LzResourceLibrary.lzfocusbracket_topright_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_rt.png"],width:7,height:7}
LzResourceLibrary.lzfocusbracket_topright_shdw_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_top_rt_shdw.png"],width:9,height:9}
LzResourceLibrary.lzfocusbracket_bottomleft_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_bot_lft.png"],width:7,height:7}
LzResourceLibrary.lzfocusbracket_bottomleft_shdw_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_bot_lft_shdw.png"],width:9,height:9}
LzResourceLibrary.lzfocusbracket_bottomright_rsrc={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_bot_rt.png"],width:7,height:7}
LzResourceLibrary.lzfocusbracket_bottomright_shdw={ptype:"sr",frames:["lps/components/lz/resources/focus/focus_bot_rt_shdw.png"],width:9,height:9}
LzInstantiateView({name:"class",attrs:{parent:"view",initobj:{attrs:{$delegates:["onstop","stopanim",null,"onfocus","$m2_$base$2Fbasefocusview$2Elzx_260_62_reference",function($1){
with(this){
return LzFocus
}
}],$events:["ontarget","onactive"],$m1_$base$2Fbasefocusview$2Elzx_152_51_reference:function(){

},$m2_$base$2Fbasefocusview$2Elzx_260_62_reference:function($1){
with(this){
this.setActive(LzFocus.focuswithkey)
if($1){
this.doFocus($1)
}else{
this.reset()
if(this.active){
this.setActive(false)
}
}
}
},$setters:{active:function($1){
with(this){
setActive($1)
}
},target:function($1){
with(this){
setTarget($1)
}
}},_animatorcounter:0,_delayfadeoutDL:null,_dofadeout:false,_heightdel:null,_nexttarget:null,_onstopdel:null,_widthdel:null,_xydelegate:null,active:false,doFocus:function($1){
with(this){
this._dofadeout=false
this.bringToFront()
if(this.target){
this.setTarget(null)
}
this.setVisible(this.active)
this._nexttarget=$1
if(visible){
this._animatorcounter+=1
var $2=null
var $3
var $4
var $5
var $6
if($1["getFocusRect"]){
$2=$1.getFocusRect()
}
if($2){
$3=$2[0]
$4=$2[1]
$5=$2[2]
$6=$2[3]
}else{
$3=$1.getAttributeRelative("x",canvas)
$4=$1.getAttributeRelative("y",canvas)
$5=$1.getAttributeRelative("width",canvas)
$6=$1.getAttributeRelative("height",canvas)
}
var $7=this.animate("x",$3,duration)
this.animate("y",$4,duration)
this.animate("width",$5,duration)
this.animate("height",$6,duration)
if(this.sprite&&this.sprite["quirks"]&&this.sprite.quirks["minimize_opacity_changes"]){
this.setVisible(true)
}else{
this.animate("opacity",1,500)
}
if(!this._onstopdel){
this._onstopdel=new LzDelegate(this,"stopanim")
}
this._onstopdel.register($7,"onstop")
}
if(this._animatorcounter<1){
this.setTarget(this._nexttarget)
var $2=null
var $3
var $4
var $5
var $6
if($1["getFocusRect"]){
$2=$1.getFocusRect()
}
if($2){
$3=$2[0]
$4=$2[1]
$5=$2[2]
$6=$2[3]
}else{
$3=$1.getAttributeRelative("x",canvas)
$4=$1.getAttributeRelative("y",canvas)
$5=$1.getAttributeRelative("width",canvas)
$6=$1.getAttributeRelative("height",canvas)
}
this.setX($3)
this.setY($4)
this.setWidth($5)
this.setHeight($6)
}
}
},duration:400,fadeout:function(){
with(this){
if(_dofadeout){
if(this.sprite&&this.sprite["quirks"]&&this.sprite.quirks["minimize_opacity_changes"]){
this.setVisible(false)
}else{
this.animate("opacity",0,500)
}
}
this._delayfadeoutDL.unregisterAll()
}
},followHeight:function(){
with(this){
var $1=null
if(target["getFocusRect"]){
$1=target.getFocusRect()
}
if($1){
this.setHeight($1[3])
}else{
this.setHeight(this.target.height)
}
}
},followWidth:function(){
with(this){
var $1=null
if(target["getFocusRect"]){
$1=target.getFocusRect()
}
if($1){
this.setWidth($1[2])
}else{
this.setWidth(this.target.width)
}
}
},followXY:function(){
with(this){
var $1=null
if(target["getFocusRect"]){
$1=target.getFocusRect()
}
if($1){
this.setX($1[0])
this.setY($1[1])
}else{
this.setX(this.target.getAttributeRelative("x",canvas))
this.setY(this.target.getAttributeRelative("y",canvas))
}
}
},initstage:"late",options:{ignorelayout:true},reset:function(){
with(this){
this.setX(0)
this.setY(0)
this.setWidth(canvas.width)
this.setHeight(canvas.height)
setTarget(null)
}
},setActive:function($1){
this.active=$1
if(this.onactive){
this.onactive.sendEvent($1)
}
},setTarget:function($1){
with(this){
this.target=$1
if(!this._xydelegate){
this._xydelegate=new LzDelegate(this,"followXY")
}else{
this._xydelegate.unregisterAll()
}
if(!this._widthdel){
this._widthdel=new LzDelegate(this,"followWidth")
}else{
this._widthdel.unregisterAll()
}
if(!this._heightdel){
this._heightdel=new LzDelegate(this,"followHeight")
}else{
this._heightdel.unregisterAll()
}
if(this.target==null){
return
}
var $2=$1
var $3=0
while($2!=canvas){
this._xydelegate.register($2,"onx")
this._xydelegate.register($2,"ony")
$2=$2.immediateparent
$3++
}
this._widthdel.register($1,"onwidth")
this._heightdel.register($1,"onheight")
followXY()
followWidth()
followHeight()
}
},stopanim:function(){
with(this){
this._animatorcounter-=1
if(this._animatorcounter<1){
this._dofadeout=true
if(!this._delayfadeoutDL){
this._delayfadeoutDL=new LzDelegate(this,"fadeout")
}
LzTimer.addTimer(this._delayfadeoutDL,1000)
this.setTarget(_nexttarget)
this._onstopdel.unregisterAll()
}
}
},target:null,visible:false},name:"basefocusview"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"basefocusview",initobj:{attrs:{bounce:function(){
with(this){
this.animate("offset",12,duration/2)
this.animate("offset",5,duration)
}
},doFocus:function($1){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["doFocus"]:this.nextMethod(arguments.callee,"doFocus")).call(this,$1)
if(visible){
this.bounce()
}
}
},"extends":"basefocusview",offset:5},children:[{attrs:{$refs:{x:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("x",-classroot.offset)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [classroot,"offset"]
}
}
return $lzsc$f
})(),y:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("y",-classroot.offset)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [classroot,"offset"]
}
}
return $lzsc$f
})()},name:"topleft"},children:[{attrs:{opacity:0.25,resource:"lzfocusbracket_topleft_shdw_rsrc",x:1,y:1},name:"view"},{attrs:{resource:"lzfocusbracket_topleft_rsrc"},name:"view"}],name:"view"},{attrs:{$refs:{x:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("x",parent.width-width+classroot.offset)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"width",this,"width",classroot,"offset"]
}
}
return $lzsc$f
})(),y:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("y",-classroot.offset)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [classroot,"offset"]
}
}
return $lzsc$f
})()},name:"topright"},children:[{attrs:{opacity:0.25,resource:"lzfocusbracket_topright_shdw_rsrc",x:1,y:1},name:"view"},{attrs:{resource:"lzfocusbracket_topright_rsrc"},name:"view"}],name:"view"},{attrs:{$refs:{x:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("x",-classroot.offset)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [classroot,"offset"]
}
}
return $lzsc$f
})(),y:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("y",parent.height-height+classroot.offset)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"height",this,"height",classroot,"offset"]
}
}
return $lzsc$f
})()},name:"bottomleft"},children:[{attrs:{opacity:0.25,resource:"lzfocusbracket_bottomleft_shdw_rsrc",x:1,y:1},name:"view"},{attrs:{resource:"lzfocusbracket_bottomleft_rsrc"},name:"view"}],name:"view"},{attrs:{$refs:{x:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("x",parent.width-width+classroot.offset)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"width",this,"width",classroot,"offset"]
}
}
return $lzsc$f
})(),y:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("y",parent.height-height+classroot.offset)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"height",this,"height",classroot,"offset"]
}
}
return $lzsc$f
})()},name:"bottomright"},children:[{attrs:{opacity:0.25,resource:"lzfocusbracket_bottomright_shdw",x:1,y:1},name:"view"},{attrs:{resource:"lzfocusbracket_bottomright_rsrc"},name:"view"}],name:"view"}],name:"focusoverlay"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"node",initobj:{attrs:{$delegates:["onkeydown","dispatchKeyDown",function($1){
with(this){
return LzKeys
}
},"onfocus","checkDefault",function(){
with(this){
return LzFocus
}
},"onmode","$m4_$base$2Fcomponentmanager$2Elzx_195_69_reference",function($1){
with(this){
return LzModeManager
}
}],$events:["ondefaultstyle"],$m3_$base$2Fcomponentmanager$2Elzx_166_76_reference:function(){

},$m4_$base$2Fcomponentmanager$2Elzx_195_69_reference:function($1){
with(this){
if(LzFocus.getFocus()==null){
this.checkDefault(null)
}
}
},_lastkeydown:0,checkDefault:function($1){
with(this){
if(!($1 instanceof basecomponent)||!$1.doesenter){
if($1 instanceof LzInputText&&$1.multiline){
$1=null
}else{
$1=this.findClosestDefault($1)
}
}
if($1==this.currentdefault){
return
}
if(this.currentdefault){
this.currentdefault.setAttribute("hasdefault",false)
}
this.currentdefault=$1
if($1){
$1.setAttribute("hasdefault",true)
}
}
},currentdefault:null,defaults:null,defaultstyle:null,dispatchKeyDown:function($1){
with(this){
var $2=false
if($1==32){
this.lastsdown=null
var $3=LzFocus.getFocus()
if($3 instanceof basecomponent){
$3.doSpaceDown()
this.lastsdown=$3
}
$2=true
}else{
if($1==13&&this.currentdefault){
this.lastedown=this.currentdefault
this.currentdefault.doEnterDown()
$2=true
}
}
if($2){
if(!this.upkeydel){
this.upkeydel=new LzDelegate(this,"dispatchKeyTimer")
}
this._lastkeydown=$1
LzTimer.addTimer(this.upkeydel,50)
}
}
},dispatchKeyTimer:function(){
if(this._lastkeydown==32&&this.lastsdown!=null){
this.lastsdown.doSpaceUp()
this.lastsdown=null
}else{
if(this._lastkeydown==13&&this.currentdefault&&this.currentdefault==this.lastedown){
this.currentdefault.doEnterUp()
}
}
},"extends":"node",findClosestDefault:function($1){
with(this){
if(!this.defaults){
return null
}
var $2=null
var $3=null
var $4=this.defaults
$1=$1||canvas
var $5=LzModeManager.getModalView()
for(var $6=0;$6<$4.length;$6++){
var $7=$4[$6]
if($5&&!$7.childOf($5)){
continue
}
var $8=this.findCommonParent($7,$1)
if($8&&(!$2||$8.nodeLevel>$2.nodeLevel)){
$2=$8
$3=$7
}
}
return $3
}
},findCommonParent:function($1,$2){
while($1.nodeLevel>$2.nodeLevel){
$1=$1.immediateparent
if(!$1.visible){
return null
}
}
while($2.nodeLevel>$1.nodeLevel){
$2=$2.immediateparent
if(!$2.visible){
return null
}
}
while($1!=$2){
$1=$1.immediateparent
$2=$2.immediateparent
if(!$1.visible||!$2.visible){
return null
}
}
return $1
},focusclass:"focusoverlay",getDefaultStyle:function(){
with(this){
if(this.defaultstyle==null){
this.defaultstyle=new (global.style)(canvas,{isdefault:true})
}
return this.defaultstyle
}
},init:function(){
with(this){
var $1=this.focusclass
if(typeof canvas.focusclass!="undefined"){
$1=canvas.focusclass
}
if($1!=null){
canvas.__focus=new (global[$1])(canvas)
canvas.__focus.reset()
};(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this)
}
},keyhandlers:null,lastedown:null,lastsdown:null,makeDefault:function($1){
with(this){
if(!this.defaults){
this.defaults=[]
}
this.defaults.push($1)
this.checkDefault(LzFocus.getFocus())
}
},setDefaultStyle:function($1){
this.defaultstyle=$1
if(this.ondefaultstyle){
this.ondefaultstyle.sendEvent($1)
}
},unmakeDefault:function($1){
with(this){
if(!this.defaults){
return
}
for(var $2=0;$2<this.defaults.length;$2++){
if(this.defaults[$2]==$1){
this.defaults.splice($2,1)
this.checkDefault(LzFocus.getFocus())
return
}
}
}
},upkeydel:null},name:"_componentmanager"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"node",initobj:{attrs:{$events:["onisdefault","onstylechanged"],$refs:{basecolor:function(){
with(this){
this.setAttribute("basecolor",offwhite)
}
},bgcolor:function(){
with(this){
this.setAttribute("bgcolor",white)
}
},bordercolor:function(){
with(this){
this.setAttribute("bordercolor",gray40)
}
},bordersize:function(){
this.setAttribute("bordersize",1)
},canvascolor:function(){
this.setAttribute("canvascolor",null)
},disabledcolor:function(){
with(this){
this.setAttribute("disabledcolor",gray30)
}
},hilitecolor:function(){
with(this){
this.setAttribute("hilitecolor",iceblue4)
}
},menuitembgcolor:function(){
with(this){
this.setAttribute("menuitembgcolor",textfieldcolor)
}
},selectedcolor:function(){
with(this){
this.setAttribute("selectedcolor",iceblue3)
}
},textcolor:function(){
with(this){
this.setAttribute("textcolor",gray10)
}
},textdisabledcolor:function(){
with(this){
this.setAttribute("textdisabledcolor",gray60)
}
},textfieldcolor:function(){
with(this){
this.setAttribute("textfieldcolor",white)
}
},texthilitecolor:function(){
with(this){
this.setAttribute("texthilitecolor",iceblue1)
}
},textselectedcolor:function(){
with(this){
this.setAttribute("textselectedcolor",black)
}
}},$setters:{basecolor:function($1){
with(this){
setStyleAttr($1,"basecolor")
}
},bgcolor:function($1){
with(this){
setStyleAttr($1,"bgcolor")
}
},bordercolor:function($1){
with(this){
setStyleAttr($1,"bordercolor")
}
},bordersize:function($1){
with(this){
setStyleAttr($1,"bordersize")
}
},canvascolor:function($1){
with(this){
setCanvasColor($1)
}
},disabledcolor:function($1){
with(this){
setStyleAttr($1,"disabledcolor")
}
},hilitecolor:function($1){
with(this){
setStyleAttr($1,"hilitecolor")
}
},isdefault:function($1){
with(this){
_setdefault($1)
}
},selectedcolor:function($1){
with(this){
setStyleAttr($1,"selectedcolor")
}
},textcolor:function($1){
with(this){
setStyleAttr($1,"textcolor")
}
},textdisabledcolor:function($1){
with(this){
setStyleAttr($1,"textdisabledcolor")
}
},textfieldcolor:function($1){
with(this){
setStyleAttr($1,"textfieldcolor")
}
},texthilitecolor:function($1){
with(this){
setStyleAttr($1,"texthilitecolor")
}
},textselectedcolor:function($1){
with(this){
setStyleAttr($1,"textselectedcolor")
}
}},_forwardstylechanged:function(){
if(this.onstylechanged){
this.onstylechanged.sendEvent(this)
}
},_setdefault:function($1){
with(this){
this.isdefault=$1
if(isdefault){
global._componentmanager.service.setDefaultStyle(this)
if(typeof this.canvascolor!="undefined"){
canvas.setBGColor(this.canvascolor)
}
}
if(this.onisdefault){
this.onisdefault.sendEvent(this)
}
}
},extend:function($1){
with(this){
var $2={}
for(var $3 in $1){
$2[$3]=$1[$3]
}
$2.__proto__=this
new LzDelegate($2,"_forwardstylechanged",this,"onstylechanged")
return $2
}
},"extends":"node",isdefault:false,isstyle:true,setCanvasColor:function($1){
with(this){
if(this.isdefault&&$1!=null){
canvas.setBGColor($1)
}
this.canvascolor=$1
if(this.onstylechanged){
this.onstylechanged.sendEvent(this)
}
}
},setStyleAttr:function($1,$2){
this[$2]=$1
if(this["on"+$2]){
this["on"+$2].sendEvent($2)
}
if(this.onstylechanged){
this.onstylechanged.sendEvent(this)
}
}},name:"style"}}},1)
LzInstantiateView({name:"script",attrs:{script:function(){
_componentmanager.service=new _componentmanager(canvas,null,null,true)
}}},1)
LzInstantiateView({name:"class",attrs:{parent:"text",initobj:{attrs:{"extends":"text"},name:"statictext"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"view",initobj:{attrs:{$events:["onfocusable","onisdefault","onstyle","on_enabled"],$refs:{_enabled:(function(){
var $lzsc$f=function(){
this.setAttribute("_enabled",this.enabled&&(this._parentcomponent?this._parentcomponent._enabled:true))
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"enabled",this,"_parentcomponent",this._parentcomponent,"_enabled"]
}
}
return $lzsc$f
})(),style:function(){
this.setAttribute("style",null)
}},$setters:{_enabled:function($1){
this._setEnabled($1)
},doesenter:function($1){
this._setDoesEnter($1)
},focusable:function($1){
with(this){
_setFocusable($1)
}
},isdefault:function($1){
this._setIsDefault($1)
},style:function($1){
with(this){
styleable?setStyle($1):(this.style=null)
}
}},_applystyle:function($1){

},_doMousedown:function(){

},_focusable:true,_initcomplete:false,_otherstyledel:null,_parentcomponent:null,_setDoesEnter:function($1){
with(this){
this.doesenter=$1
if(LzFocus.getFocus()==this){
_componentmanager.service.checkDefault(this)
}
}
},_setEnabled:function($1){
with(this){
this._enabled=$1
var $2=this._enabled&&this._focusable
if($2!=this.focusable){
this.focusable=$2
if(this.onfocusable){
this.onfocusable.sendEvent()
}
}
if(_initcomplete){
_showEnabled()
}
if(this.on_enabled){
this.on_enabled.sendEvent()
}
}
},_setFocusable:function($1){
this._focusable=$1
if(this.enabled){
this.focusable=this._focusable
if(this.onfocusable){
this.onfocusable.sendEvent()
}
}else{
this.focusable=false
}
},_setIsDefault:function($1){
with(this){
this.isdefault=this["isdefault"]==true
if(this.isdefault==$1){
return
}
if($1){
_componentmanager.service.makeDefault(this)
}else{
_componentmanager.service.unmakeDefault(this)
}
this.isdefault=$1
if(this.onisdefault){
this.onisdefault.sendEvent($1)
}
}
},_setstyle:function($1){
with(this){
if(!this._styledel){
this._styledel=new LzDelegate(this,"_usestyle")
}else{
_styledel.unregisterAll()
}
if($1){
_styledel.register($1,"onstylechanged")
}
this.style=$1
_usestyle()
if(this.onstyle){
this.onstyle.sendEvent(this.style)
}
}
},_showEnabled:function(){

},_style:null,_styledel:null,_usestyle:function(){
if(this._initcomplete&&this["style"]&&this.style.isinited){
this._applystyle(this.style)
}
},applyData:function($1){
this.setAttribute("text",$1)
},construct:function($1,$2){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2)
var $3=this.immediateparent
while($3!=canvas){
if($3 instanceof basecomponent){
this._parentcomponent=$3
break
}
$3=$3.immediateparent
}
}
},destroy:function(){
with(this){
if(this._otherstyledel){
this._otherstyledel.unregisterAll()
delete this._otherstyledel
}
if(this._styledel){
this._styledel.unregisterAll()
delete this._styledel
};(arguments.callee.superclass?arguments.callee.superclass.prototype["destroy"]:this.nextMethod(arguments.callee,"destroy")).call(this)
}
},doEnterDown:function(){
return false
},doEnterUp:function(){
return false
},doSpaceDown:function(){
return false
},doSpaceUp:function(){
return false
},doesenter:false,enabled:true,focusable:true,hasdefault:false,init:function(){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this)
this._initcomplete=true
this._mousedownDel=new LzDelegate(this,"_doMousedown",this,"onmousedown")
if(this.styleable){
_usestyle()
}
if(!this["_enabled"]){
_showEnabled()
}
}
},setStyle:function($1){
with(this){
if(!styleable){
return
}
if($1!=null&&!$1["isstyle"]){
var $2=this._style
if(!$2){
if(this._parentcomponent){
$2=this._parentcomponent.style
}else{
$2=_componentmanager.service.getDefaultStyle()
}
}
$1=$2.extend($1)
}
this._style=$1
if($1==null){
if(!this._otherstyledel){
this._otherstyledel=new LzDelegate(this,"_setstyle")
}else{
this._otherstyledel.unregisterAll()
}
if(this._parentcomponent&&this._parentcomponent.styleable){
this._otherstyledel.register(this._parentcomponent,"onstyle")
$1=this._parentcomponent.style
}else{
this._otherstyledel.register(_componentmanager.service,"ondefaultstyle")
$1=_componentmanager.service.getDefaultStyle()
}
}else{
if(this._otherstyledel){
this._otherstyledel.unregisterAll()
delete this._otherstyledel
}
}
_setstyle($1)
}
},setTint:function($1,$2,$3){
with(this){
if($1.capabilities.colortransform){
if($2!=""&&$2!=null){
if($3==null){
$3=0
}
var $4=$2
var $5=$4>>16&255
var $6=$4>>8&255
var $7=$4&255
$5+=51
$6+=51
$7+=51
$5=$5/255*100
$6=$6/255*100
$7=$7/255*100
$1.setColorTransform({ra:$5,ga:$6,ba:$7,rb:$3,gb:$3,bb:$3})
}
}
}
},styleable:true,text:"",toString:function(){
var $1=""
var $2=""
var $3=""
if(this["id"]!=null){
$1="  id="+this.id
}
if(this["name"]!=null){
$2=' named "'+this.name+'"'
}
if(this["text"]&&this.text!=""){
$3="  text="+this.text
}
return this.constructor.classname+$2+$1+$3
},updateData:function(){
return this.text
},updateDefault:function(){
with(this){
_componentmanager.service.checkDefault(LzFocus.getFocus())
}
}},name:"basecomponent"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"basecomponent",initobj:{attrs:{$delegates:["onmode","$m5_$base$2Fbasebutton$2Elzx_90_67_reference",function($1){
with(this){
return LzModeManager
}
},"ontotalframes","$m6_$base$2Fbasebutton$2Elzx_151_39_reference",null,"onmouseover","$m7_$base$2Fbasebutton$2Elzx_166_37_reference",null,"onmouseout","$m8_$base$2Fbasebutton$2Elzx_171_36_reference",null,"onmousedown","$m9_$base$2Fbasebutton$2Elzx_176_37_reference",null,"onmouseup","$m10_$base$2Fbasebutton$2Elzx_181_35_reference",null],$events:["onresourceviewcount","onclick"],$m10_$base$2Fbasebutton$2Elzx_181_35_reference:function(){
this.setAttribute("_msdown",false)
this._callShow()
},$m5_$base$2Fbasebutton$2Elzx_90_67_reference:function($1){
if($1&&(this._msdown||this._msin)&&!this.childOf($1)){
this._msdown=false
this._msin=false
this._callShow()
}
},$m6_$base$2Fbasebutton$2Elzx_151_39_reference:function(){
if(this.isinited){
this.maxframes=this.totalframes
this._callShow()
}
},$m7_$base$2Fbasebutton$2Elzx_166_37_reference:function(){
this.setAttribute("_msin",true)
this._callShow()
},$m8_$base$2Fbasebutton$2Elzx_171_36_reference:function(){
this.setAttribute("_msin",false)
this._callShow()
},$m9_$base$2Fbasebutton$2Elzx_176_37_reference:function(){
this.setAttribute("_msdown",true)
this._callShow()
},$refs:{maxframes:function(){
this.setAttribute("maxframes",this.totalframes)
},reference:function(){
this.setAttribute("reference",this)
}},$setters:{reference:function($1){
with(this){
setreference($1)
}
},resourceviewcount:function($1){
this.setResourceViewCount($1)
}},_applystyle:function($1){
with(this){
setTint(this,$1.basecolor)
}
},_callShow:function(){
if(this._msdown&&this._msin&&this.maxframes>=this.downResourceNumber){
this.showDown()
}else{
if(this._msin&&this.maxframes>=this.overResourceNumber){
this.showOver()
}else{
this.showUp()
}
}
},_msdown:false,_msin:false,_showEnabled:function(){
with(this){
reference.setAttribute("clickable",_enabled)
showUp()
}
},clickable:true,disabledResourceNumber:4,doEnterDown:function(){
if(this._enabled){
this.showDown()
}
},doEnterUp:function(){
if(this._enabled){
if(this.onclick){
this.onclick.sendEvent()
}
this.showUp()
}
},doSpaceDown:function(){
if(this._enabled){
this.showDown()
}
},doSpaceUp:function(){
if(this._enabled){
this.onclick.sendEvent()
this.showUp()
}
},downResourceNumber:3,"extends":"basecomponent",focusable:false,init:function(){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this)
this.setResourceViewCount(this.resourceviewcount)
this._callShow()
}
},normalResourceNumber:1,overResourceNumber:2,resourceviewcount:0,respondtomouseout:true,setResourceNumber:function($1){
with(this){
if(this.resourceviewcount>0){
for(var $2=0;$2<resourceviewcount;$2++){
this.subviews[$2].setResourceNumber($1)
}
}else{
(arguments.callee.superclass?arguments.callee.superclass.prototype["setResourceNumber"]:this.nextMethod(arguments.callee,"setResourceNumber")).call(this,$1)
}
}
},setResourceViewCount:function($1){
this.resourceviewcount=$1
if(this._initcomplete){
if($1>0){
if(this.subviews){
this.maxframes=this.subviews[0].totalframes
if(this.onresourceviewcount){
this.onresourceviewcount.sendEvent()
}
}
}
}
},setreference:function($1){
this.reference=$1
if($1!=this){
this.setClickable(false)
}
},showDown:function($1){
this.setResourceNumber(this.downResourceNumber)
},showOver:function($1){
this.setResourceNumber(this.overResourceNumber)
},showUp:function($1){
with(this){
if(!_enabled&&this.disabledResourceNumber){
this.setResourceNumber(this.disabledResourceNumber)
}else{
this.setResourceNumber(this.normalResourceNumber)
}
}
},styleable:false},name:"basebutton"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"view",initobj:{attrs:{$setters:{fgcolor:function($1){
this.setColor($1)
}},color:16777215,construct:function($1,$2){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["construct"]:this.nextMethod(arguments.callee,"construct")).call(this,$1,$2)
if($2["width"]==null){
$2["width"]=this.immediateparent.getAttribute("width")
}
if($2["height"]==null){
$2["height"]=this.immediateparent.getAttribute("height")
}
if($2["fgcolor"]==null&&$2["bgcolor"]==null){
$2["fgcolor"]=16777215
}
}
},ctransform:null,"extends":"view",setBGColor:function($1){
with(this){
this.color=$1
if(this.ctransform!=null){
var $2=$1>>16&255
var $3=$1>>8&255
var $4=$1&255
$2=$2*ctransform["ra"]/100+ctransform["rb"]
$2=Math.min($2,255)
$3=$3*ctransform["ga"]/100+ctransform["gb"]
$3=Math.min($3,255)
$4=$4*ctransform["ba"]/100+ctransform["bb"]
$4=Math.min($4,255)
$1=$4+($3<<8)+($2<<16)
};(arguments.callee.superclass?arguments.callee.superclass.prototype["setBGColor"]:this.nextMethod(arguments.callee,"setBGColor")).call(this,$1)
}
},setColor:function($1){
this.setBGColor($1)
},setColorTransform:function($1){
delete this.ctransform
this.ctransform=$1
this.setBGColor(this.color)
}},name:"swatchview"}}},1)
LzResourceLibrary.lzbutton_face_rsc={ptype:"sr",frames:["lps/components/lz/resources/button/simpleface_up.png","lps/components/lz/resources/button/simpleface_mo.png","lps/components/lz/resources/button/simpleface_dn.png","lps/components/lz/resources/button/autoPng/simpleface_dsbl.png"],width:2,height:18}
LzResourceLibrary.lzbutton_bezel_inner_rsc={ptype:"sr",frames:["lps/components/lz/resources/autoPng/bezel_inner_up.png","lps/components/lz/resources/autoPng/bezel_inner_up.png","lps/components/lz/resources/autoPng/bezel_inner_dn.png","lps/components/lz/resources/autoPng/outline_dsbl.png"],width:500,height:500}
LzResourceLibrary.lzbutton_bezel_outer_rsc={ptype:"sr",frames:["lps/components/lz/resources/autoPng/bezel_outer_up.png","lps/components/lz/resources/autoPng/bezel_outer_up.png","lps/components/lz/resources/autoPng/bezel_outer_dn.png","lps/components/lz/resources/autoPng/transparent.png","lps/components/lz/resources/autoPng/default_outline.png"],width:500,height:500}
LzInstantiateView({name:"class",attrs:{parent:"basebutton",initobj:{attrs:{$delegates:["onhasdefault","$m11_$lz$2Fbutton$2Elzx_127_34_reference",null],$m11_$lz$2Fbutton$2Elzx_127_34_reference:function(){
with(this){
if(this._initcomplete){
if(this.buttonstate==1){
showUp()
}
}
}
},$refs:{height:(function(){
var $lzsc$f=function(){
this.setAttribute("height",this._title.height+2*this.text_padding_y)
}
$lzsc$f.dependencies=function(){
with(this){
return [this._title,"height",this,"text_padding_y"]
}
}
return $lzsc$f
})(),text_x:(function(){
var $lzsc$f=function(){
this.setAttribute("text_x",this.width/2-this._title.width/2)
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"width",this._title,"width"]
}
}
return $lzsc$f
})(),text_y:(function(){
var $lzsc$f=function(){
this.setAttribute("text_y",this.height/2-this._title.height/2)
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"height",this._title,"height"]
}
}
return $lzsc$f
})(),titleshift:(function(){
var $lzsc$f=function(){
this.setAttribute("titleshift",this.buttonstate==1?0:1)
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"buttonstate"]
}
}
return $lzsc$f
})(),width:(function(){
var $lzsc$f=function(){
this.setAttribute("width",this._title.width+2*this.text_padding_x)
}
$lzsc$f.dependencies=function(){
with(this){
return [this._title,"width",this,"text_padding_x"]
}
}
return $lzsc$f
})()},_applystyle:function($1){
with(this){
if(this.style!=null){
this.textcolor=$1.textcolor
this.textdisabledcolor=$1.textdisabledcolor
if(enabled){
_title.setAttribute("fgcolor",$1.textcolor)
}else{
_title.setAttribute("fgcolor",$1.textdisabledcolor)
}
setTint(_outerbezel,$1.basecolor)
setTint(_innerbezel,$1.basecolor)
setTint(_face,$1.basecolor)
}
}
},_showEnabled:function(){
with(this){
showUp()
setAttribute("clickable",_enabled)
}
},buttonstate:1,clickable:true,doesenter:true,"extends":"basebutton",focusable:true,leftalign:false,maxframes:4,pixellock:true,showDown:function($1){
with(this){
if(this.hasdefault){
this._outerbezel.setResourceNumber(5)
}else{
this._outerbezel.setResourceNumber(this.downResourceNumber)
}
this._face.setResourceNumber(this.downResourceNumber)
this._innerbezel.setResourceNumber(this.downResourceNumber)
setAttribute("buttonstate",2)
}
},showOver:function($1){
with(this){
if(this.hasdefault){
this._outerbezel.setResourceNumber(5)
}else{
this._outerbezel.setResourceNumber(this.overResourceNumber)
}
this._face.setResourceNumber(this.overResourceNumber)
this._innerbezel.setResourceNumber(this.overResourceNumber)
setAttribute("buttonstate",1)
}
},showUp:function($1){
with(this){
if(_enabled){
if(this.hasdefault){
this._outerbezel.setResourceNumber(5)
}else{
this._outerbezel.setResourceNumber(this.normalResourceNumber)
}
this._face.setResourceNumber(this.normalResourceNumber)
this._innerbezel.setResourceNumber(this.normalResourceNumber)
if(this.style){
this._title.setAttribute("fgcolor",this.style.textcolor)
}
}else{
if(this.style){
this._title.setAttribute("fgcolor",this.style.textdisabledcolor)
}
this._face.setResourceNumber(this.disabledResourceNumber)
this._outerbezel.setResourceNumber(this.disabledResourceNumber)
this._innerbezel.setResourceNumber(this.disabledResourceNumber)
}
setAttribute("buttonstate",1)
}
},styleable:true,text_padding_x:11,text_padding_y:4},children:[{attrs:{$refs:{height:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("height",parent.height-1)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"height"]
}
}
return $lzsc$f
})(),width:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("width",parent.width-1)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"width"]
}
}
return $lzsc$f
})()},bgcolor:9539985,name:"_outerbezel",x:0,y:0},name:"view"},{attrs:{$refs:{height:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("height",parent.height-3)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"height"]
}
}
return $lzsc$f
})(),width:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("width",parent.width-3)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"width"]
}
}
return $lzsc$f
})()},bgcolor:16777215,name:"_innerbezel",x:1,y:1},name:"view"},{attrs:{$refs:{height:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("height",parent.height-4)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"height"]
}
}
return $lzsc$f
})(),width:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("width",parent.width-4)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"width"]
}
}
return $lzsc$f
})()},name:"_face",resource:"lzbutton_face_rsc",stretches:"both",x:2,y:2},name:"view"},{attrs:{name:"_innerbezelbottom"},children:[{attrs:{$refs:{height:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("height",parent.parent.height-2)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent.parent,"height"]
}
}
return $lzsc$f
})(),x:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("x",parent.parent.width-2)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent.parent,"width"]
}
}
return $lzsc$f
})()},bgcolor:5789784,width:1,y:1},name:"view"},{attrs:{$refs:{width:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("width",parent.parent.width-3)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent.parent,"width"]
}
}
return $lzsc$f
})(),y:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("y",parent.parent.height-2)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent.parent,"height"]
}
}
return $lzsc$f
})()},bgcolor:5789784,height:1,x:1},name:"view"}],name:"view"},{attrs:{name:"_outerbezelbottom"},children:[{attrs:{$refs:{height:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("height",parent.parent.height)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent.parent,"height"]
}
}
return $lzsc$f
})(),x:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("x",parent.parent.width-1)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent.parent,"width"]
}
}
return $lzsc$f
})()},bgcolor:16777215,opacity:0.7,width:1,y:0},name:"view"},{attrs:{$refs:{width:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("width",parent.parent.width-1)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent.parent,"width"]
}
}
return $lzsc$f
})(),y:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("y",parent.parent.height-1)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent.parent,"height"]
}
}
return $lzsc$f
})()},bgcolor:16777215,height:1,opacity:0.7,x:0},name:"view"}],name:"view"},{attrs:{$refs:{text:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("text",parent.text)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"text"]
}
}
return $lzsc$f
})(),x:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("x",parent.text_x+parent.titleshift)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"text_x",parent,"titleshift"]
}
}
return $lzsc$f
})(),y:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("y",parent.text_y+parent.titleshift)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"text_y",parent,"titleshift"]
}
}
return $lzsc$f
})()},name:"_title",resize:true},name:"text"}],name:"button"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"basecomponent",initobj:{attrs:{"extends":"basecomponent",getValue:function(){
return this.value==null?this.text:this.value
},value:null},name:"basevaluecomponent"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"basevaluecomponent",initobj:{attrs:{$delegates:["oninit","$m12_$base$2Fbaseformitem$2Elzx_57_32_reference",null],$events:["onchanged","onvalue"],$m12_$base$2Fbaseformitem$2Elzx_57_32_reference:function(){
var $1=this.findForm()
if($1!=null){
$1.addFormItem(this)
this._parentform=$1
}
},$refs:{submit:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("submit",enabled)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"enabled"]
}
}
return $lzsc$f
})()},$setters:{changed:function($1){
this.setChanged($1)
},value:function($1){
this.setValue($1,false)
}},_parentform:null,applyData:function($1){
this.setValue($1,true)
},changed:false,commit:function(){
this.rollbackvalue=this.value
this.setAttribute("changed",false)
},"extends":"basevaluecomponent",findForm:function(){
with(this){
if(_parentform!=null){
return _parentform
}else{
var $1=this.immediateparent
var $2=null
while($1!=canvas){
if($1["formdata"]){
$2=$1
break
}
$1=$1.immediateparent
}
return $2
}
}
},ignoreform:false,init:function(){
with(this){
if(this.submitname==""){
this.submitname=this.name
}
if(this.submitname==""){
return
};(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this)
}
},rollback:function(){
if(this.rollbackvalue!=this["value"]){
this.setAttribute("value",this.rollbackvalue)
}
this.setAttribute("changed",false)
},rollbackvalue:null,setChanged:function($1,$2){
with(this){
if(!this._initcomplete){
this.changed=false
return
}
var $3=this.changed
this.changed=$1
if(this.changed!=$3){
if(this.onchanged){
this.onchanged.sendEvent(this.changed)
}
}
if(!$2&&this.changed&&!ignoreform){
if(this["_parentform"]&&this._parentform["changed"]!=undefined&&!this._parentform.changed){
this._parentform.setChanged($1)
}
}
if(!$2&&!this.changed&&!ignoreform){
if(this["_parentform"]&&this._parentform["changed"]!=undefined&&this._parentform.changed){
this._parentform.setChanged($1,true)
}
}
}
},setValue:function($1,$2){
var $3=this.value!=$1
this.value=$1
if($2||!this._initcomplete){
this.rollbackvalue=$1
}
this.setChanged($3&&!$2&&this.rollbackvalue!=$1)
if(this["onvalue"]){
this.onvalue.sendEvent($1)
}
},submitname:"",toXML:function($1){
with(this){
var $2=this.value
if($1){
if(typeof $2=="boolean"){
$2=$2-0
}
}
return LzBrowser.xmlEscape(this.submitname)+'="'+LzBrowser.xmlEscape($2)+'"'
}
},updateData:function(){
return this.value
},value:null},name:"baseformitem"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"basebutton",initobj:{attrs:{$events:["onstatenum","onstatelength"],$refs:{frame:(function(){
var $lzsc$f=function(){
this.setAttribute("frame",this.lastres+this.statenum*this.statelength)
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"lastres",this,"statenum",this,"statelength"]
}
}
return $lzsc$f
})()},$setters:{statelength:function($1){
this.setStateLength($1)
},statenum:function($1){
this.setStateNum($1)
}},_showEnabled:function(){
with(this){
reference.setAttribute("clickable",_enabled)
this.showUp()
}
},clickable:true,"extends":"basebutton",lastres:1,maxstate:0,setStateLength:function($1){
this.statelength=$1
if(this.statelength==2){
this.overResourceNumber=this.normalResourceNumber
if(this.downResourceNumber==3){
this.downResourceNumber=2
}
}else{
if(this.statelength==1){
this.overResourceNumber=1
this.downResourceNumber=1
}
}
if(this.onstatelength){
this.onstatelength.sendEvent($1)
}
},setStateNum:function($1){
if($1>this.maxstate){
return
}
this.statenum=$1
if(this.onstatenum){
this.onstatenum.sendEvent($1)
}
},showDown:function($1){
this.setAttribute("lastres",this.downResourceNumber)
},showOver:function($1){
this.setAttribute("lastres",this.overResourceNumber)
},showUp:function($1){
with(this){
if(!_enabled&&this.disabledResourceNumber){
this.setAttribute("lastres",this.disabledResourceNumber)
}else{
this.setAttribute("lastres",this.normalResourceNumber)
}
}
},statelength:3,statenum:0},name:"multistatebutton"}}},1)
LzResourceLibrary.lzcheckbox_rsrc={ptype:"sr",frames:["lps/components/lz/resources/checkbox/autoPng/checkbox_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_off_mo.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on.png","lps/components/lz/resources/checkbox/autoPng/checkbox_disable_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on.png","lps/components/lz/resources/checkbox/autoPng/checkbox_on_mo.png","lps/components/lz/resources/checkbox/autoPng/checkbox_off.png","lps/components/lz/resources/checkbox/autoPng/checkbox_disable_on.png"],width:15,height:14}
LzInstantiateView({name:"class",attrs:{parent:"baseformitem",initobj:{attrs:{$delegates:["onclick","$m13_$lz$2Fcheckbox$2Elzx_47_33_reference",null],$m13_$lz$2Fcheckbox$2Elzx_47_33_reference:function(){
if(this._enabled){
this.setAttribute("value",!this.value)
}
},$refs:{text_y:(function(){
var $lzsc$f=function(){
this.setAttribute("text_y",this.cb.height/2-this._title.height/2+1)
}
$lzsc$f.dependencies=function(){
with(this){
return [this.cb,"height",this._title,"height"]
}
}
return $lzsc$f
})()},$setters:{value:function($1){
with(this){
setValue($1)
}
}},_applystyle:function($1){
with(this){
if(this.style!=null){
if(_enabled){
_title.setAttribute("fgcolor",$1.textcolor)
}else{
_title.setAttribute("fgcolor",$1.textdisabledcolor)
}
setTint(this.cb,$1.basecolor)
}
}
},_showEnabled:function(){
with(this){
_applystyle(this.style)
}
},clickable:true,doSpaceUp:function(){
if(this._enabled){
this.setAttribute("value",!this.value)
}
},"extends":"baseformitem",pixellock:true,setValue:function($1,$2){
with(this){
if($1=="false"){
$1=false
}else{
if($1=="true"){
$1=true
}else{
$1=!(!$1)
}
};(arguments.callee.superclass?arguments.callee.superclass.prototype["setValue"]:this.nextMethod(arguments.callee,"setValue")).call(this,$1,$2)
}
},value:false},children:[{attrs:{$refs:{text:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("text",parent.text)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"text"]
}
}
return $lzsc$f
})(),y:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("y",classroot.text_y)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [classroot,"text_y"]
}
}
return $lzsc$f
})()},name:"_title",resize:true,x:16},name:"text"},{attrs:{$refs:{reference:function(){
with(this){
this.setAttribute("reference",parent)
}
},statenum:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("statenum",parent.value?1:0)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"value"]
}
}
return $lzsc$f
})()},maxstate:1,name:"cb",resource:"lzcheckbox_rsrc",statelength:4,text:""},name:"multistatebutton"}],name:"checkbox"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"selectionmanager",initobj:{attrs:{_forcemulti:false,_updatefromscrolling:false,allowhilite:function($1){
if(this._updatefromscrolling){
if($1!=null){
this._updatefromscrolling=false
}
return false
}
return true
},ensureItemInView:function($1){
with(this){
if(!$1){
return
}
var $2=immediateparent.parent
var $3=false
if($1.y+$1.height>$2.height-immediateparent.y){
var $4=$2.height-immediateparent.y-($1.y+$1.height)
var $5=Math.max($2.height-immediateparent.height,immediateparent.y+$4)
immediateparent.setAttribute("y",$5)
$3=true
}else{
if(immediateparent.y*-1>$1.y){
var $4=immediateparent.y*-1-$1.y
var $5=Math.min(0,immediateparent.y+$4)
immediateparent.setAttribute("y",$5)
$3=true
}
}
if($3){
this._updatefromscrolling=true
}
}
},"extends":"selectionmanager",getItemByIndex:function($1){
return this.parent._contentview.subviews[$1]
},getNextSubview:function($1,$2){
with(this){
if(typeof $2=="undefined"){
$2=1
}
var $3=this.immediateparent.subviews
if(!$1){
if($2>0){
return $3[0]
}else{
return $3[$3.length-1]
}
}
var $4
var $5=$3.length
for(var $6=0;$6<$5;$6++){
var $7=$3[$6]
if($7==$1){
var $8=$6+$2
if($8<0){
$4=$3[0]
}else{
if($8>=$5){
$4=$3[$5-1]
}else{
$4=$3[$8]
}
}
break
}
}
ensureItemInView($4)
return $4
}
},getNumItems:function(){
if(!this.immediateparent.subviews){
return 0
}
return this.immediateparent.subviews.length
},getText:function(){
with(this){
var $1=this.getSelection()
if($1.length==0){
return null
}
if($1.length==1&&!multiselect){
return $1[0].text
}
var $2=[]
for(var $3=0;$3<$1.length;$3++){
$2[$3]=$1[$3].text
}
return $2
}
},getValue:function(){
with(this){
var $1=this.getSelection()
if($1.length==0){
return null
}
if($1.length==1&&!multiselect){
return $1[0].getValue()
}
var $2=[]
for(var $3=0;$3<$1.length;$3++){
$2[$3]=$1[$3].getValue()
}
return $2
}
},isMultiSelect:function($1){
with(this){
var $2=false
if(_forcemulti){
$2=true
}else{
if(multiselect){
$2=(arguments.callee.superclass?arguments.callee.superclass.prototype["isMultiSelect"]:this.nextMethod(arguments.callee,"isMultiSelect")).call(this,$1)
}
}
return $2
}
},isRangeSelect:function($1){
with(this){
var $2=false
if(multiselect){
$2=(arguments.callee.superclass?arguments.callee.superclass.prototype["isRangeSelect"]:this.nextMethod(arguments.callee,"isRangeSelect")).call(this,$1)
}
return $2
}
},multiselect:false,select:function($1){
with(this){
if($1["length"]&&multiselect){
this._forcemulti=true
for(var $2=0;$2<$1.length;$2++){
(arguments.callee.superclass?arguments.callee.superclass.prototype["select"]:this.nextMethod(arguments.callee,"select")).call(this,$1[$2])
}
this._forcemulti=false
}else{
(arguments.callee.superclass?arguments.callee.superclass.prototype["select"]:this.nextMethod(arguments.callee,"select")).call(this,$1)
}
}
}},name:"listselector"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"dataselectionmanager",initobj:{attrs:{_ensureItemInViewByIndex:function($1){
with(this){
if(!immediateparent.subviews||immediateparent.subviews.length==0){
return
}
var $2=immediateparent.parent
var $3=immediateparent.subviews[0].height
var $4=$1*$3
var $5=0
if($1>0){
var $6=immediateparent.subviews[0].cloneManager
if(parent["spacing"]){
$5=parent.spacing
}else{
if($6["spacing"]){
$5=$6.spacing
}
}
$4+=$5*($1-1)
}
var $7=false
if($4+$3>$2.height-immediateparent.y){
var $8=$2.height-immediateparent.y-($4+$3+$5)
var $9=Math.max($2.height-immediateparent.height,immediateparent.y+$8)
immediateparent.setAttribute("y",$9)
$7=true
}else{
if(immediateparent.y*-1>$4){
var $8=immediateparent.y*-1-$4-$5
var $9=Math.min(0,immediateparent.y+$8)
immediateparent.setAttribute("y",$9)
$7=true
}
}
if($7){
this._updatefromscrolling=true
}
}
},_forcemulti:false,_updatefromscrolling:false,allowhilite:function($1){
if(this._updatefromscrolling){
if($1!=null){
this._updatefromscrolling=false
}
return false
}
return true
},cloneManager:null,ensureItemInView:function($1){
with(this){
if(!$1){
return
}
var $2=findIndex($1)
if($2!=-1){
_ensureItemInViewByIndex($2)
}
}
},"extends":"dataselectionmanager",findIndex:function($1){
with(this){
var $2
if($1 instanceof LzView){
$2=$1.datapath.p
}else{
$2=$1.p
}
if(!immediateparent.subviews[0].cloneManager){
return immediateparent.subviews[0]==$1?0:-1
}
var $3=immediateparent.subviews[0].cloneManager.nodes
var $4=-1
for(var $5=0;$5<$3.length;$5++){
if($3[$5]==$2){
$4=$5
break
}
}
return $4
}
},getItemByData:function($1){
with(this){
return $1?getItemByIndex(this.getItemIndexByData($1)):null
}
},getItemByIndex:function($1){
with(this){
if(!immediateparent.subviews||immediateparent.subviews.length==0){
return null
}
this._ensureItemInViewByIndex($1)
var $2=immediateparent.subviews
var $3=$2[0].cloneManager
if($3==null){
return $1==0?$2[0]:undefined
}
var $4=$3.clones[0].datapath.xpathQuery("position()")-1
return $3.clones[$1-$4]
}
},getItemIndexByData:function($1){
with(this){
if($1){
var $2=immediateparent.subviews
if($2[0].cloneManager){
var $3=$2[0].cloneManager["nodes"]
if($3!=null){
for(var $4=0;$4<$3.length;$4++){
if($3[$4]==$1){
return $4
}
}
}
}else{
if($2[0].datapath.p==$1){
return 0
}
}
}
return null
}
},getNextSubview:function($1,$2){
with(this){
var $3=immediateparent.subviews[0].cloneManager.clones
if($1==null){
var $4=$2==-1&&parent.shownitems!=-1?parent.shownitems-1:0
return $3[$4]
}
var $5=findIndex($1)
if($5==-1){
return null
}
var $6=immediateparent.subviews[0].cloneManager.nodes
if(!$2){
$2=1
}
$5=$5+=$2
if($5==-1){
$5=0
}
if($5==$6.length){
$5=$6.length-1
}
_ensureItemInViewByIndex($5)
var $7=$6[$5]
var $8=immediateparent.subviews
for(var $9=0;$9<$8.length;$9++){
if($8[$9].datapath.p==$7){
return $8[$9]
}
}
}
},getNumItems:function(){
with(this){
if(!this.cloneManager){
var $1=immediateparent.subviews
if($1==null||$1.length==0){
return 0
}else{
this.cloneManager=$1[0].cloneManager
}
}
if(!this.cloneManager["nodes"]){
return 0
}
return this.cloneManager.nodes.length
}
},getText:function(){
with(this){
var $1=this.getSelection()
if($1.length==0){
return null
}
var $2=this.immediateparent.subviews[0]._textdatapath
if(!$2){
$2="text()"
}
if($1.length==1&&!multiselect){
return $1[0].xpathQuery($2)
}else{
var $3=[]
for(var $4=0;$4<$1.length;$4++){
$3[$4]=$1[$4].xpathQuery($2)
}
return $3
}
}
},getValue:function(){
with(this){
var $1=this.getSelection()
if($1.length==0){
return null
}
var $2=this.immediateparent.subviews[0]._valuedatapath
if(!$2){
$2=this.immediateparent.subviews[0]._textdatapath
}
if(!$2){
$2="text()"
}
if($1.length==1&&!multiselect){
return $1[0].xpathQuery($2)
}else{
var $3=[]
for(var $4=0;$4<$1.length;$4++){
$3[$4]=$1[$4].xpathQuery($2)
}
return $3
}
}
},isMultiSelect:function($1){
with(this){
var $2=false
if(_forcemulti){
$2=true
}else{
if(multiselect){
$2=(arguments.callee.superclass?arguments.callee.superclass.prototype["isMultiSelect"]:this.nextMethod(arguments.callee,"isMultiSelect")).call(this,$1)
}
}
return $2
}
},isRangeSelect:function($1){
with(this){
var $2=false
if(multiselect){
$2=(arguments.callee.superclass?arguments.callee.superclass.prototype["isRangeSelect"]:this.nextMethod(arguments.callee,"isRangeSelect")).call(this,$1)
}
return $2
}
},multiselect:false,select:function($1){
with(this){
if($1["length"]&&multiselect){
this._forcemulti=true
for(var $2=0;$2<$1.length;$2++){
(arguments.callee.superclass?arguments.callee.superclass.prototype["select"]:this.nextMethod(arguments.callee,"select")).call(this,$1[$2])
}
this._forcemulti=false
}else{
(arguments.callee.superclass?arguments.callee.superclass.prototype["select"]:this.nextMethod(arguments.callee,"select")).call(this,$1)
}
}
}},name:"datalistselector"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"baseformitem",initobj:{attrs:{$delegates:["onfocus","_doFocus",null,"onblur","_doblur",null,"onkeydown","_dokeydown",null],$events:["onselect"],_contentview:null,_doFocus:function(){
if(this["_selector"]){
var $1=this._selector.getSelection()
if($1&&$1.length>0){
this._hiliteview=$1[0]
}
}
},_doblur:function(){
if(this._hiliteview&&this._hiliteview.setHilite){
this._hiliteview["setHilite"](false)
}
this._hiliteview=null
},_dokeydown:function($1){
with(this){
if($1==32&&this._hiliteview&&this._hiliteview.enabled){
this._hiliteview.setAttribute("selected",true)
return
}
if($1>=37&&$1<=40){
this.setAttribute("doesenter",true)
var $2=this._hiliteview
if($2==null){
$2=getSelection()
if(this.multiselect){
$2=$2[0]
}
}
var $3
if($1==39||$1==40){
$3=_selector.getNextSubview($2)
}
if($1==37||$1==38){
$3=_selector.getNextSubview($2,-1)
}
if(this._hiliteview&&this._hiliteview.setHilite&&this._hiliteview!=0){
this._hiliteview["setHilite"](false)
}
$3["setHilite"](true)
this._hiliteview=$3
}
}
},_hiliteview:null,_initialselection:null,_removeitem:function($1){
if($1){
if($1.selected){
this._selector.unselect($1)
}
$1.destroy()
}
},addItem:function($1,$2){
with(this){
if(this.itemclassname==""){

}else{
new (global[this.itemclassname])(this,{text:$1,value:$2})
}
}
},applyData:function($1){
this.setAttribute("value",$1)
},clearSelection:function(){
if(this._initcomplete){
this._selector.clearSelection()
}else{
this._initialselection=null
this.defaultselection=null
}
},dataoption:"none",defaultselection:null,doEnterDown:function(){
if(this._hiliteview&&this._hiliteview.enabled){
this._hiliteview.setAttribute("selected",true)
}
},doEnterUp:function(){
return
},"extends":"baseformitem",getItem:function($1){
with(this){
if(_contentview!=null&&_contentview.subviews!=null){
for(var $2=0;$2<_contentview.subviews.length;$2++){
var $3=_contentview.subviews[$2]
if($3.getValue()==$1){
return $3
}
}
}
return null
}
},getItemAt:function($1){
with(this){
if(_contentview.subviews[$1]){
return getItem(_contentview.subviews[$1].getValue())
}
return null
}
},getNumItems:function(){
if(!this["_selector"]){
return 0
}
return this._selector.getNumItems()
},getSelection:function(){
with(this){
if(this._initcomplete){
var $1=this._selector.getSelection()
if(multiselect){
return $1
}else{
if($1.length==0){
return null
}else{
return $1[0]
}
}
}else{
return this._initialselection
}
}
},getText:function(){
with(this){
if(_initcomplete){
return _selector.getText()
}
return null
}
},getValue:function(){
with(this){
return _selector.getValue()
}
},init:function(){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["init"]:this.nextMethod(arguments.callee,"init")).call(this)
if(this._contentview==null){
if(this.defaultplacement!=null){
this._contentview=this.searchSubnodes("name",this.defaultplacement)
}else{
this._contentview=this
}
}
if(this.dataoption=="lazy"||this.dataoption=="resize"){
this._selector=new datalistselector(this,{multiselect:this.multiselect,toggle:toggleselected})
}else{
this._selector=new listselector(this,{multiselect:this.multiselect,toggle:toggleselected})
}
if(this._initialselection!=null){
this.select(this._initialselection)
}else{
if(this.defaultselection!=null){
selectItemAt(defaultselection)
}
}
}
},itemclassname:"",moveSelection:function($1){
with(this){
if(!$1){
$1=1
}
var $2=this._selector.getSelection()
var $3
if($2.length==0){
$3=this._contentview.subviews[0]
}else{
var $4=$2[0]
$3=this._selector.getNextSubview($4,$1)
}
var $5=LzFocus.getFocus()
select($3)
if($4&&$5&&$5.childOf($4)){
LzFocus.setFocus($3)
}
}
},multiselect:false,removeItem:function($1){
with(this){
var $2=getItem($1)
_removeitem($2)
}
},removeItemAt:function($1){
with(this){
var $2=_contentview.subviews[$1]
_removeitem($2)
}
},select:function($1){
with(this){
if($1==null){

}else{
if(this._initcomplete){
this._selector.select($1)
if(!this.multiselect){
this.setAttribute("value",$1.getValue())
}
}else{
if(multiselect){
if(this._initialselection==null){
this._initialselection=[]
}
this._initialselection.push($1)
}else{
this._initialselection=$1
}
}
}
if(this._hiliteview&&this._hiliteview.setHilite&&this._hiliteview["enabled"]){
this._hiliteview["setHilite"](false)
this._hiliteview=null
}
this.setAttribute("doesenter",false)
if(this.onselect){
this.onselect.sendEvent($1)
}
}
},selectItem:function($1){
with(this){
var $2=getItem($1)
if($2){
select($2)
}
}
},selectItemAt:function($1){
with(this){
if(typeof this._selector!="undefined"){
var $2=this._selector.getItemByIndex($1)
select($2)
}
}
},selectNext:function(){
with(this){
moveSelection(1)
}
},selectPrev:function(){
with(this){
moveSelection(-1)
}
},setHilite:function($1){
if(this._selector.allowhilite($1)){
if(this._hiliteview&&this._hiliteview.setHilite){
this._hiliteview["setHilite"](false)
}
this._hiliteview=$1
if(this._hiliteview){
$1["setHilite"](true)
}
}
},toggleselected:false,updateData:function(){
return this.getValue()
}},name:"baselist"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"basevaluecomponent",initobj:{attrs:{$events:["onselected","onselect"],$setters:{_selectonevent:function($1){
this.setSelectOnEvent($1)
},selected:function($1){
this._setSelected($1)
}},_doMousedown:function(){
with(this){
(arguments.callee.superclass?arguments.callee.superclass.prototype["_doMousedown"]:this.nextMethod(arguments.callee,"_doMousedown")).call(this)
if(!this.focusable&&this._parentcomponent&&this._parentcomponent.focusable){
LzFocus.setFocus(this._parentcomponent,false)
}
}
},_selectonevent:"onclick",_setSelected:function($1){
with(this){
if($1){
parent.select(this)
}
this.selected=$1
}
},_textdatapath:null,_valuedatapath:null,clickable:true,dataBindAttribute:function($1,$2){
with(this){
if(this._parentcomponent.dataoption=="lazy"||this._parentcomponent.dataoption=="resize"){
if($1=="text"){
this._textdatapath=$2
}else{
if($1=="value"){
this._valuedatapath=$2
}
}
};(arguments.callee.superclass?arguments.callee.superclass.prototype["dataBindAttribute"]:this.nextMethod(arguments.callee,"dataBindAttribute")).call(this,$1,$2)
}
},doClick:function(){
if(this._parentcomponent){
this._parentcomponent.select(this)
}
},"extends":"basevaluecomponent",focusable:false,selected:false,setDatapath:function($1){
with(this){
if(null!=this.datapath){
this.datapath.setXPath($1)
}else{
var $2={xpath:$1}
if(this._parentcomponent.dataoption=="lazy"||this._parentcomponent.dataoption=="resize"){
$2.replication=_parentcomponent.dataoption
if(parent["spacing"]){
$2.spacing=parent.spacing
}
}else{
if(this._parentcomponent.dataoption=="pooling"){
$2.pooling=true
}
}
new LzDatapath(this,$2)
}
}
},setSelectOnEvent:function($1){
with(this){
this._selectDL=new LzDelegate(this,"doClick",this,$1)
}
},setSelected:function($1){
this.selected=$1
if(this.onselect){
this.onselect.sendEvent(this)
}
if(this.onselected){
this.onselected.sendEvent(this)
}
}},name:"baselistitem"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"layout",initobj:{attrs:{$setters:{axis:function($1){
this.setAxis($1)
},inset:function($1){
this.inset=$1
if(this.subviews&&this.subviews.length){
this.update()
}
if(this["oninset"]){
this.oninset.sendEvent(this.inset)
}
},spacing:function($1){
this.spacing=$1
if(this.subviews&&this.subviews.length){
this.update()
}
if(this["onspacing"]){
this.onspacing.sendEvent(this.spacing)
}
}},addSubview:function($1){
with(this){
this.updateDelegate.register($1,"on"+this.sizeAxis)
this.updateDelegate.register($1,"onvisible")
if(!this.locked&&this.subviews.length){
var $2=this.subviews[this.subviews.length-1]
var $3=$2[this.axis]+$2[this.sizeAxis]+this.spacing
$1.setAttribute(this.axis,$3)
};(arguments.callee.superclass?arguments.callee.superclass.prototype["addSubview"]:this.nextMethod(arguments.callee,"addSubview")).call(this,$1)
}
},axis:"y","extends":"layout",inset:0,setAxis:function($1){
if(this["axis"]==null||this.axis!=$1){
this.axis=$1
this.sizeAxis=$1=="x"?"width":"height"
if(this.subviews.length){
this.update()
}
if(this["onaxis"]){
this.onaxis.sendEvent(this.axis)
}
}
},spacing:0,update:function(){
if(this.locked){
return
}
var $1=this.subviews.length
var $2=this.inset
for(var $3=0;$3<$1;$3++){
var $4=this.subviews[$3]
if(!$4.visible){
continue
}
if($4[this.axis]!=$2){
$4.setAttribute(this.axis,$2)
}
$2+=this.spacing+$4[this.sizeAxis]
}
}},name:"simplelayout"}}},1)
LzResourceLibrary.lzradio_rsrc={ptype:"sr",frames:["lps/components/lz/resources/radio/autoPng/radiobtn_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_mo.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_up.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dn.png","lps/components/lz/resources/radio/autoPng/radiobtn_dsbl_dn.png"],width:14,height:14}
LzInstantiateView({name:"class",attrs:{parent:"baselist",initobj:{attrs:{$events:["onvalue"],$setters:{value:function($1){
with(this){
_setvalue($1)
}
}},_setvalue:function($1){
if($1==this.value){
return
}
if(this._initcomplete){
var $2=null
if($1!=null){
$2=this.getItem($1)
}
this.value=$1
}else{
this.value=$1
}
if(this.onvalue){
this.onvalue.sendEvent($1)
}
},applyData:function($1){
this._setvalue($1)
var $2=null
if($1!=null){
$2=this.getItem($1)
}
if($2){
this.select($2)
}else{
this.clearSelection()
}
},defaultselection:0,"extends":"baselist",itemclassname:"radiobutton",layout:{axis:"y","class":"simplelayout",spacing:5},value:null},name:"radiogroup"}}},1)
LzInstantiateView({name:"class",attrs:{parent:"baselistitem",initobj:{attrs:{$refs:{text_y:(function(){
var $lzsc$f=function(){
this.setAttribute("text_y",this.rb.height/2-this._title.height/2)
}
$lzsc$f.dependencies=function(){
with(this){
return [this.rb,"height",this._title,"height"]
}
}
return $lzsc$f
})()},_applystyle:function($1){
with(this){
if(this.style!=null){
if(_enabled){
_title.setAttribute("fgcolor",this.style.textcolor)
}else{
_title.setAttribute("fgcolor",this.style.textdisabledcolor)
}
setTint(this.rb,$1.basecolor)
}
}
},_showEnabled:function(){
with(this){
if(this.style!=null){
if(_enabled){
_title.setAttribute("fgcolor",style.textcolor)
}else{
_title.setAttribute("fgcolor",style.textdisabledcolor)
}
}
}
},clickable:true,"extends":"baselistitem",focusable:false,initcomplete:0,setHilite:function($1){
with(this){
_title.setAttribute("fgcolor",$1?style.texthilitecolor:style.textcolor)
}
}},children:[{attrs:{$refs:{reference:function(){
with(this){
this.setAttribute("reference",parent)
}
},statenum:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("statenum",parent.selected?1:0)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"selected"]
}
}
return $lzsc$f
})()},maxstate:1,name:"rb",resource:"lzradio_rsrc",statelength:4,text:""},name:"multistatebutton"},{attrs:{$refs:{text:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("text",parent.text)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"text"]
}
}
return $lzsc$f
})(),y:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("y",classroot.text_y)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [classroot,"text_y"]
}
}
return $lzsc$f
})()},name:"_title",resize:true,x:17},name:"text"}],name:"radiobutton"}}},1)
LzInstantiateView({name:"script",attrs:{script:function(){
_root.escapeXML=void 0
escapeXML=function($1){
return new XML().createTextNode($1).toString()
}
}}},1)
lzAddLocalData("appdata","<data />",false)
LzInstantiateView({name:"script",attrs:{script:function(){
_root.app_runtime=void 0
_root.app_debug=void 0
_root.app_backtrace=void 0
_root.app_console_debug=void 0
_root.app_floating_window=void 0
_root.app_fullpath=void 0
_root.app_query=void 0
_root.app_opt_url=void 0
_root.app_unopt_url=void 0
_root.app_url=void 0
_root.app_opt_exists=void 0
_root.app_lps_root=void 0
_root.app_lzt=void 0
_root.app_uid=void 0
appdata.setInitialData(global.appinfo)
app_runtime=appdata.getPointer().xpathQuery("/info/@runtime")
if(app_runtime==null){
app_runtime=appdata.getPointer().xpathQuery("/request/param[@name = 'lzr']/@value")
}
app_debug=appdata.getPointer().xpathQuery("/request/param[@name = 'debug']/@value")
app_backtrace=appdata.getPointer().xpathQuery("/request/param[@name = 'lzbacktrace']/@value")
if(app_debug=="y"){
app_debug="true"
}
app_console_debug=appdata.getPointer().xpathQuery("/request/@console-remote-debug")=="true"
app_floating_window=appdata.getPointer().xpathQuery("/request/@console-floating-window")=="true"
app_fullpath=appdata.getPointer().xpathQuery("/request/@fullpath")
app_query=appdata.getPointer().xpathQuery("/request/@query_args")
app_opt_url=appdata.getPointer().xpathQuery("/request/@opt-url")
app_unopt_url=appdata.getPointer().xpathQuery("/request/@unopt-url")
app_url=appdata.getPointer().xpathQuery("/request/@url")
app_opt_exists=appdata.getPointer().xpathQuery("/request/@opt-exists")
app_lps_root=appdata.getPointer().xpathQuery("/request/@lps")
app_lzt=null
app_uid=typeof global.lzappuid!="undefined"?global.lzappuid:""
app_uid="XXX"
}}},1)
LzResourceLibrary.footer_logo={ptype:"sr",frames:["lps/assets/logo_laszlo_footer.gif"],width:70,height:70}
LzInstantiateView({attrs:{$refs:{width:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("width",parent.width)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent,"width"]
}
}
return $lzsc$f
})()},name:"main"},children:[{attrs:{$refs:{height:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("height",app_console_debug?370:71)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"app_console_debug"]
}
}
return $lzsc$f
})()},bgcolor:5000268,name:"logo",resource:"footer_logo"},name:"view"},{attrs:{name:"controls",x:70},children:[{attrs:{name:"firstrow",y:4},children:[{attrs:{font:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",text:"<b>Compile Options:</b>",x:8,y:7},name:"text"},{attrs:{bgcolor:0,height:32,width:410,x:125},children:[{attrs:{bgcolor:9737389,height:30,width:408,x:1,y:1},name:"view"}],name:"view"},{attrs:{$delegates:["onvalue","$m15_$dev$2Dconsole$2Elzx_164_66_reference",function(){
with(this){
return cb_backtrace
}
},"onvalue","$m16_$dev$2Dconsole$2Elzx_169_62_reference",function(){
with(this){
return cb_debug
}
}],$m15_$dev$2Dconsole$2Elzx_164_66_reference:function(){
with(this){
if(cb_backtrace.value){
cb_debug.setAttribute("value",true)
}
}
},$m16_$dev$2Dconsole$2Elzx_169_62_reference:function(){
with(this){
if(cb_debug.value==false){
cb_backtrace.setAttribute("value",false)
}
}
},name:"compilecontrols",x:125},children:[{attrs:{id:"rg_runtime",layout:{axis:"x","class":"simplelayout",spacing:4},x:6,y:8.75},children:[{attrs:{$refs:{selected:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("selected",app_runtime=="swf7")
}
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"app_runtime"]
}
}
return $lzsc$f
})()},id:"rb7",text:"swf7",value:"swf7"},id:"rb7",name:"radiobutton"},{attrs:{$refs:{selected:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("selected",app_runtime=="swf8")
}
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"app_runtime"]
}
}
return $lzsc$f
})()},id:"rb8",text:"swf8",value:"swf8"},id:"rb8",name:"radiobutton"},{attrs:{$refs:{selected:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("selected",app_runtime=="dhtml")
}
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"app_runtime"]
}
}
return $lzsc$f
})()},id:"rbdhtml",text:"DHTML",value:"dhtml"},id:"rbdhtml",name:"radiobutton"}],id:"rg_runtime",name:"radiogroup"},{attrs:{bgcolor:0,height:14,width:1,x:173,y:9.5},name:"view"},{attrs:{$refs:{value:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("value",app_debug=="true")
}
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"app_debug"]
}
}
return $lzsc$f
})()},id:"cb_debug",text:"Debug",x:181,y:8.25},id:"cb_debug",name:"checkbox"},{attrs:{$refs:{value:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("value",app_backtrace=="true")
}
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"app_backtrace"]
}
}
return $lzsc$f
})()},id:"cb_backtrace",text:"Backtrace",x:250,y:8.25},id:"cb_backtrace",name:"checkbox"},{attrs:{$delegates:["onclick","$m14",null],$m14:function(){
with(this){
canvas.gotoApp()
}
},clickable:true,text:"Compile",x:334,y:4},name:"button"}],name:"view"},{attrs:{width:22,x:450},name:"view"},{attrs:{$delegates:["onclick","$m17",null],$m17:function(){
with(this){
canvas.viewSource()
}
},clickable:true,text:"View Source",x:580,y:3},name:"button"}],name:"view"},{attrs:{$refs:{width:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("width",canvas.width-70)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [canvas,"width"]
}
}
return $lzsc$f
})()},bgcolor:0,height:1,y:39},name:"view"},{attrs:{$refs:{width:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("width",parent.firstrow.width)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [parent.firstrow,"width"]
}
}
return $lzsc$f
})()},y:43},children:[{attrs:{font:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",text:"<b>Deploy:</b>",x:8,y:4},name:"text"},{attrs:{$delegates:["onclick","$m18",null],$m18:function(){
with(this){
canvas.viewWrapper()
}
},clickable:true,text:"Server",x:65},name:"button"},{attrs:{$delegates:["onclick","$m19",null],$m19:function(){
with(this){
canvas.deploySOLO()
}
},clickable:true,text:"SOLO",x:134},name:"button"},{attrs:{align:"right",fgcolor:1381787,options:{ignorelayout:true},y:3},children:[{attrs:{$delegates:["onclick","$m20",null],$m20:function(){
with(this){
canvas.viewDocs()
}
},clickable:true,font:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",text:"<u>Documentation</u>"},name:"text"},{attrs:{$delegates:["onclick","$m21",null],$m21:function(){
with(this){
canvas.viewDev()
}
},clickable:true,font:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",text:"<u>Developer Network</u>",x:92},name:"text"},{attrs:{$delegates:["onclick","$m22",null],$m22:function(){
with(this){
canvas.viewForums()
}
},clickable:true,font:"Verdana,Vera,sans-serif",fontsize:11,fontstyle:"plain",text:"<u>Developer Forums</u>",x:208},name:"text"}],name:"view"}],name:"view"},{attrs:{$refs:{value:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("value",app_console_debug)
}
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"app_console_debug"]
}
}
return $lzsc$f
})(),visible:(function(){
var $lzsc$f=function(){
with(this){
this.setAttribute("visible",app_runtime!="dhtml")
}
}
$lzsc$f.dependencies=function(){
with(this){
return [this,"app_runtime"]
}
}
return $lzsc$f
})()},id:"cb_remotedebug",text:"Console Remote Debug",x:740,y:10},id:"cb_remotedebug",name:"checkbox"}],name:"view"}],name:"view"},28)
LzInstantiateView({name:"script",attrs:{script:function(){
_root.receivingLC=void 0
_root.sendingLC=void 0
canvas.width=document.body.clientWidth
}}},1)
canvas.initDone()
