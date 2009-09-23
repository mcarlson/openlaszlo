/**
  * Definition of the context menu, from contextmenu.lzx
  *
  * @copyright Copyright 2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access private
  */
Class.make("$lzc$class_lzcontextmenuseparator",LzView,["$m2",function($1){
this.parent.registerRedraw(this)
},"$m4",function($1){
this.parent.unregisterRedraw(this)
},"redraw",function($1){
$1.moveTo(0,this.y+9);$1.lineTo(this.parent.width-3,this.y+9);$1.strokeStyle="#E5E5E5";$1.stroke()
}],["tagname","lzcontextmenuseparator","attributes",new LzInheritedHash(LzView.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["oninit","$m2",null,"ondestroy","$m4",null],height:10},$lzc$class_lzcontextmenuseparator.attributes)
}}})($lzc$class_lzcontextmenuseparator);Class.make("$lzc$class_lzcontextmenutext",LzText,["$m6",function($1){
this.parent.registerRedraw(this)
},"$m8",function($1){
this.parent.unregisterRedraw(this)
},"$m10",function($1){
this.parent.select(this);this.parent.unregisterRedraw(this)
},"redraw",function($1){
$1.rect(this.x,this.y+3,this.parent.width-3,this.height);$1.fillStyle="#CCCCCC";$1.fill()
}],["tagname","lzcontextmenutext","attributes",new LzInheritedHash(LzText.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["onmouseover","$m6",null,"onmouseout","$m8",null,"onmousedown","$m10",null],clickable:true},$lzc$class_lzcontextmenutext.attributes)
}}})($lzc$class_lzcontextmenutext);Class.make("$lzc$class_lzcontextmenudisabled",LzText,null,["tagname","lzcontextmenudisabled","attributes",new LzInheritedHash(LzText.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({fgcolor:LzColorUtils.convertColor("0xcccccc")},$lzc$class_lzcontextmenudisabled.attributes)
}}})($lzc$class_lzcontextmenudisabled);Class.make("$lzc$class_$2Fcanvas$2F$40lzcontextmenu$2F$40background",LzView,["$m13",function($1){
with(this){
var $2=parent.container.width+9;if($2!==this["width"]||!this.inited){
this.setAttribute("width",$2)
}}},"$m14",function(){
with(this){
return [parent.container,"width"]
}},"$m15",function($1){
with(this){
var $2=parent.container.height+9;if($2!==this["height"]||!this.inited){
this.setAttribute("height",$2)
}}},"$m16",function(){
with(this){
return [parent.container,"height"]
}},"$m18",function($1){
this.createContext()
},"__doredraw",function($1){
switch(arguments.length){
case 0:
$1=null;

};if(this.visible&&this.width&&this.height&&this.context){
this.redraw(this.context)
}},"redraw",function($1){
with(this){
switch(arguments.length){
case 0:
$1=this.context;

};$1.beginPath();$1.clearRect(0,0,this.width,this.height);this.rect(2.5,3.5,this.width-3,this.height-3,classroot.inset);$1.fillStyle="#000000";$1.globalAlpha=0.2;$1.fill();$1.beginPath();this.rect(0,0,this.width-3,this.height-3,classroot.inset);$1.globalAlpha=0.9;$1.fillStyle="#FFFFFF";$1.fill();$1.globalAlpha=1;$1.strokeStyle="#CCCCCC";$1.stroke();for(var $2 in parent.__drawnitems){
$1.beginPath();parent.__drawnitems[$2].redraw($1)
}}},"rect",function($1,$2,$3,$4,$5){
with(this){
switch(arguments.length){
case 4:
$5=0;

};if($5>0){
var $6,$7,$8,$9,$10;if($5>Math.min($3,$4)/2){
$5=Math.min($3,$4)/2
};var $11=Math.PI/4;this.context.moveTo($1+$5,$2);this.context.lineTo($1+$3-$5,$2);$6=-Math.PI/2;$7=$1+$3-$5+Math.cos($6+$11/2)*$5/Math.cos($11/2);$8=$2+$5+Math.sin($6+$11/2)*$5/Math.cos($11/2);$9=$1+$3-$5+Math.cos($6+$11)*$5;$10=$2+$5+Math.sin($6+$11)*$5;this.context.quadraticCurveTo($7,$8,$9,$10);$6+=$11;$7=$1+$3-$5+Math.cos($6+$11/2)*$5/Math.cos($11/2);$8=$2+$5+Math.sin($6+$11/2)*$5/Math.cos($11/2);$9=$1+$3-$5+Math.cos($6+$11)*$5;$10=$2+$5+Math.sin($6+$11)*$5;this.context.quadraticCurveTo($7,$8,$9,$10);this.context.lineTo($1+$3,$2+$4-$5);$6+=$11;$7=$1+$3-$5+Math.cos($6+$11/2)*$5/Math.cos($11/2);$8=$2+$4-$5+Math.sin($6+$11/2)*$5/Math.cos($11/2);$9=$1+$3-$5+Math.cos($6+$11)*$5;$10=$2+$4-$5+Math.sin($6+$11)*$5;this.context.quadraticCurveTo($7,$8,$9,$10);$6+=$11;$7=$1+$3-$5+Math.cos($6+$11/2)*$5/Math.cos($11/2);$8=$2+$4-$5+Math.sin($6+$11/2)*$5/Math.cos($11/2);$9=$1+$3-$5+Math.cos($6+$11)*$5;$10=$2+$4-$5+Math.sin($6+$11)*$5;this.context.quadraticCurveTo($7,$8,$9,$10);this.context.lineTo($1+$5,$2+$4);$6+=$11;$7=$1+$5+Math.cos($6+$11/2)*$5/Math.cos($11/2);$8=$2+$4-$5+Math.sin($6+$11/2)*$5/Math.cos($11/2);$9=$1+$5+Math.cos($6+$11)*$5;$10=$2+$4-$5+Math.sin($6+$11)*$5;this.context.quadraticCurveTo($7,$8,$9,$10);$6+=$11;$7=$1+$5+Math.cos($6+$11/2)*$5/Math.cos($11/2);$8=$2+$4-$5+Math.sin($6+$11/2)*$5/Math.cos($11/2);$9=$1+$5+Math.cos($6+$11)*$5;$10=$2+$4-$5+Math.sin($6+$11)*$5;this.context.quadraticCurveTo($7,$8,$9,$10);this.context.lineTo($1,$2+$5);$6+=$11;$7=$1+$5+Math.cos($6+$11/2)*$5/Math.cos($11/2);$8=$2+$5+Math.sin($6+$11/2)*$5/Math.cos($11/2);$9=$1+$5+Math.cos($6+$11)*$5;$10=$2+$5+Math.sin($6+$11)*$5;this.context.quadraticCurveTo($7,$8,$9,$10);$6+=$11;$7=$1+$5+Math.cos($6+$11/2)*$5/Math.cos($11/2);$8=$2+$5+Math.sin($6+$11/2)*$5/Math.cos($11/2);$9=$1+$5+Math.cos($6+$11)*$5;$10=$2+$5+Math.sin($6+$11)*$5;this.context.quadraticCurveTo($7,$8,$9,$10)
}else{
this.context.moveTo($1,$2);this.context.lineTo($1+$3,$2);this.context.lineTo($1+$3,$2+$4);this.context.lineTo($1,$2+$4);this.context.lineTo($1,$2)
}}},"$classrootdepth",void 0],["tagname","view","attributes",new LzInheritedHash(LzView.attributes)]);Class.make("$lzc$class_lzcontextmenu",LzView,["inset",void 0,"__drawnitems",void 0,"$m12",function($1){
with(this){
this.__globalmousedel=new (lz.Delegate)(this,"__handlemouse")
}},"select",function($1){
with(this){
var $2=$1.data;var $3=LzMouseKernel.__showncontextmenu;if($3){
$3.__select($2)
};this.hide()
}},"show",function(){
with(this){
var $1=canvas.getMouse();if($1.x>canvas.width-this.width){
$1.x=canvas.width-this.width
};if($1.y>canvas.height-this.height){
$1.y=canvas.height-this.height
};this.bringToFront();this.setAttribute("x",$1.x);this.setAttribute("y",$1.y);this.setAttribute("visible",true);this.__globalmousedel.register(lz.GlobalMouse,"onmousedown")
}},"hide",function(){
with(this){
this.__globalmousedel.unregisterAll();var $1=LzMouseKernel.__showncontextmenu;if($1){
$1.__hide()
};this.setAttribute("visible",false)
}},"setItems",function($1){
with(this){
var $2=this.container.subviews;for(var $3=$2.length;$3>=0;$3--){
var $4=$2[$3];if(!$4||(LzLayout["$lzsc$isa"]?LzLayout.$lzsc$isa($4):$4 instanceof LzLayout)){
continue
};$4.destroy()
};var $5=$1.length;var $6=0;for(var $3=0;$3<$5;$3++){
var $7=$1[$3];var $8=lz["lzcontextmenu"+$7.type];if($8){
var $9=new $8(this,{data:$7.offset,text:$7.label});$9.setAttribute("y",$6);$6+=$9.height
}};this.items=$1;this.background.redraw()
}},"registerRedraw",function($1){
this.__drawnitems[$1.getUID()]=$1;this.background.redraw()
},"unregisterRedraw",function($1){
delete this.__drawnitems[$1.getUID()];this.background.redraw()
},"__handlemouse",function($1){
with(this){
if(!$1){
this.hide();return
};do{
if(lz.lzcontextmenu["$lzsc$isa"]?lz.lzcontextmenu.$lzsc$isa($1):$1 instanceof lz.lzcontextmenu){
return
};$1=$1.immediateparent
}while($1!==canvas);this.hide()
}},"background",void 0,"container",void 0],["tagname","lzcontextmenu","children",[{attrs:{$classrootdepth:1,$delegates:["oninit","$m18",null,"onwidth","__doredraw",null,"onheight","__doredraw",null,"oncontext","__doredraw",null,"onvisible","__doredraw",null],height:new LzAlwaysExpr("$m15","$m16"),name:"background",width:new LzAlwaysExpr("$m13","$m14")},"class":$lzc$class_$2Fcanvas$2F$40lzcontextmenu$2F$40background},{attrs:{$classrootdepth:1,name:"container",x:3,y:3},"class":LzView},{attrs:"container","class":$lzc$class_userClassPlacement}],"attributes",new LzInheritedHash(LzView.attributes)]);(function($1){
with($1){
with($1.prototype){
LzNode.mergeAttributes({$delegates:["oninit","$m12",null],__drawnitems:{},inset:5,options:{ignorelayout:true},visible:false},$lzc$class_lzcontextmenu.attributes)
}}})($lzc$class_lzcontextmenu);lz["lzcontextmenuseparator"]=$lzc$class_lzcontextmenuseparator;lz["lzcontextmenutext"]=$lzc$class_lzcontextmenutext;lz["lzcontextmenudisabled"]=$lzc$class_lzcontextmenudisabled;lz["lzcontextmenu"]=$lzc$class_lzcontextmenu;
