/**
  * Definition of the context menu, from contextmenu.lzx
  *
  * @copyright Copyright 2009, 2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access private
  *
  * @devnote See instructions in contextmenu.lzx on how to create this file
  */








#file contextmenu.lzx
#line 8
dynamic class $lzc$class_lzcontextmenuseparator extends LzView {
static var tagname = "lzcontextmenuseparator";static var attributes = new LzInheritedHash(LzView.attributes);function $fpn66o1 ($a) {
#file

#pragma "userFunctionName=handle oninit"
;
#file contextmenu.lzx
#line 10
this.parent.registerRedraw(this)
}
#file
function $fpn66o2 ($a) {
#file

#pragma "userFunctionName=handle ondestroy"
;
#file contextmenu.lzx
#line 13
this.parent.unregisterRedraw(this)
}
#file
function redraw (context_$a) {
context_$a.moveTo(0, this.y + 9);
context_$a.lineTo(this.parent.width - 3, this.y + 9);
context_$a.strokeStyle = "#E5E5E5";
context_$a.stroke()
}
#file
function $lzc$class_lzcontextmenuseparator (parent_$a:LzNode? = null, attrs_$b:Object? = null, children_$c:Array? = null, async_$d:Boolean = false) {
super(parent_$a, attrs_$b, children_$c, async_$d)
}
LzNode.mergeAttributes({$delegates: ["oninit", "$fpn66o1", null, "ondestroy", "$fpn66o2", null], height: 10}, $lzc$class_lzcontextmenuseparator.attributes);
}
;
#file contextmenu.lzx
#line 23
dynamic class $lzc$class_lzcontextmenutext extends LzText {
static var tagname = "lzcontextmenutext";static var attributes = new LzInheritedHash(LzText.attributes);function $fpn66o3 ($a) {
#file

#pragma "userFunctionName=handle onmouseover"
;
#file contextmenu.lzx
#line 25
this.parent.__overnow = this.data;
this.parent.registerRedraw(this)
}
#file
function $fpn66o4 ($a) {
#file

#pragma "userFunctionName=handle onmouseout"
;
#file contextmenu.lzx
#line 29
this.parent.__overnow = null;
this.parent.unregisterRedraw(this)
}
#file
function $fpn66o5 ($a) {
#file

#pragma "userFunctionName=handle onmousedown"
;
#file contextmenu.lzx
#line 33
this.parent.select(this.data);
this.parent.unregisterRedraw(this)
}
#file
function redraw (context_$a) {

context_$a.rect(this.x, this.y + 3, this.parent.width - 3, this.height);
context_$a.fillStyle = "#CCCCCC";
context_$a.fill()
}
#file
function $lzc$class_lzcontextmenutext (parent_$a:LzNode? = null, attrs_$b:Object? = null, children_$c:Array? = null, async_$d:Boolean = false) {
super(parent_$a, attrs_$b, children_$c, async_$d)
}
LzNode.mergeAttributes({$delegates: ["onmouseover", "$fpn66o3", null, "onmouseout", "$fpn66o4", null, "onmousedown", "$fpn66o5", null], clickable: true, fgcolor: LzColorUtils.convertColor("0x0"), fontsize: 11, fontstyle: "plain"}, $lzc$class_lzcontextmenutext.attributes);
}
;
#file contextmenu.lzx
#line 44
dynamic class $lzc$class_lzcontextmenudisabled extends LzText {
static var tagname = "lzcontextmenudisabled";static var attributes = new LzInheritedHash(LzText.attributes);function $lzc$class_lzcontextmenudisabled (parent_$a:LzNode? = null, attrs_$b:Object? = null, children_$c:Array? = null, async_$d:Boolean = false) {


super(parent_$a, attrs_$b, children_$c, async_$d)
}

LzNode.mergeAttributes({fgcolor: LzColorUtils.convertColor("0xcccccc"), fontsize: 11, fontstyle: "plain"}, $lzc$class_lzcontextmenudisabled.attributes);
}
;
#line 134
dynamic class $lzc$class_fpn66o12 extends LzView {
static var displayName = "<anonymous extends='view'>";static var attributes = new LzInheritedHash(LzView.attributes);function $fpn66o7 ($a) {
#file

#pragma "userFunctionName=width='${...}'"
;
#file contextmenu.lzx
#line 134
var $b = this.parent.container.width + 9;
#file
if ($b !== this["width"] || !this.inited) {
this.setAttribute("width", $b)
}}
#file contextmenu.lzx
#line 134
function $fpn66o8 () {
#file

#pragma "userFunctionName=width dependencies"
;

#pragma "warnUndefinedReferences=false"
;

#pragma "throwsError=true"
;
#file contextmenu.lzx
#line 134
return $lzc$validateReferenceDependencies([this.parent.container, "width"], ["this.parent.container"])
}
#line 134
function $fpn66o9 ($a) {
#file

#pragma "userFunctionName=height='${...}'"
;
#file contextmenu.lzx
#line 134
var $b = this.parent.container.height + 9;
#file
if ($b !== this["height"] || !this.inited) {
this.setAttribute("height", $b)
}}
#file contextmenu.lzx
#line 134
function $fpn66o10 () {
#file

#pragma "userFunctionName=height dependencies"
;

#pragma "warnUndefinedReferences=false"
;

#pragma "throwsError=true"
;
#file contextmenu.lzx
#line 134
return $lzc$validateReferenceDependencies([this.parent.container, "height"], ["this.parent.container"])
}
#line 135
function $fpn66o11 ($a) {
#file

#pragma "userFunctionName=handle oninit"
;
#file contextmenu.lzx
#line 136
this.createContext()
}









function __doredraw (ignore_$a = null) {

if (this.visible && this.width && this.height && this.context) this.redraw(this.context)
}


function redraw (context_$a = this.context) {
context_$a.beginPath();
context_$a.clearRect(0, 0, this.width, this.height);

LzKernelUtils.rect(context_$a, 2.5, 3.5, this.width - 3, this.height - 3, this.classroot.inset);
context_$a.fillStyle = "#000000";
context_$a.globalAlpha = 0.2;
context_$a.fill();

context_$a.beginPath();
LzKernelUtils.rect(context_$a, 0, 0, this.width - 3, this.height - 3, this.classroot.inset);
context_$a.globalAlpha = 0.9;
context_$a.fillStyle = "#FFFFFF";
context_$a.fill();

context_$a.globalAlpha = 1;
context_$a.strokeStyle = "#CCCCCC";
context_$a.stroke();

for (var uid_$b in this.parent.__drawnitems) {
context_$a.beginPath();
this.parent.__drawnitems[uid_$b].redraw(context_$a)
}}
#file
var $classrootdepth;function $lzc$class_fpn66o12 (parent_$a:LzNode? = null, attrs_$b:Object? = null, children_$c:Array? = null, async_$d:Boolean = false) {
super(parent_$a, attrs_$b, children_$c, async_$d)
}

}
;
#file contextmenu.lzx
#line 46
dynamic class $lzc$class_lzcontextmenu extends LzView {
static var tagname = "lzcontextmenu";static var children = [{attrs: {$classrootdepth: 1, $delegates: ["oninit", "$fpn66o11", null, "onwidth", "__doredraw", null, "onheight", "__doredraw", null, "oncontext", "__doredraw", null, "onvisible", "__doredraw", null], height: new LzAlwaysExpr("$fpn66o9", "$fpn66o10", "height='${...}'"), name: "background", width: new LzAlwaysExpr("$fpn66o7", "$fpn66o8", "width='${...}'")}, "class": $lzc$class_fpn66o12}, {attrs: {$classrootdepth: 1, name: "container", x: 3, y: 3}, "class": LzView}, {attrs: "container", "class": $lzc$class_userClassPlacement}];static var attributes = new LzInheritedHash(LzView.attributes);var inset;var __drawnitems;var __overnow;function $fpn66o6 ($a) {
#file

#pragma "userFunctionName=handle oninit"
;
#file contextmenu.lzx
#line 52
this.__globalmousedel = new (lz.Delegate)(this, "__handlemouse")
}
#file
function select (offset_$a) {
var cmenu_$b = LzMouseKernel.__showncontextmenu;
if (cmenu_$b) cmenu_$b.__select(offset_$a);

this.hide()
}
#file
function show () {

if (this.visible && this.__overnow != null) {

this.select(this.__overnow);
this.__overnow = null;
return
};
this.__overnow = null;
var pos_$a = canvas.getMouse();
if (pos_$a.x > canvas.width - this.width) pos_$a.x = canvas.width - this.width;
if (pos_$a.y > canvas.height - this.height) pos_$a.y = canvas.height - this.height;
this.bringToFront();
this.setAttribute("x", pos_$a.x);
this.setAttribute("y", pos_$a.y);
this.setAttribute("visible", true);
this.__globalmousedel.register(lz.GlobalMouse, "onmousedown")
}


function hide () {
this.__globalmousedel.unregisterAll();
var cmenu_$a = LzMouseKernel.__showncontextmenu;
if (cmenu_$a) cmenu_$a.__hide();
this.setAttribute("visible", false)
}
#file
function setItems (newitems_$a) {

this.__drawnitems = {};
var subviews_$b = this.container.subviews;

for (var i_$c = subviews_$b.length;i_$c >= 0;i_$c--) {
var subview_$d = subviews_$b[i_$c];
if (!subview_$d || subview_$d is LzLayout) continue;
subview_$d.destroy()
};

var l_$e = newitems_$a.length;
var ypos_$f = 0;
for (var i_$c = 0;i_$c < l_$e;i_$c++) {
var item_$g = newitems_$a[i_$c];
var classref_$h = lz["lzcontextmenu" + item_$g.type];
if (classref_$h) {
var newview_$i = new classref_$h(this, {data: item_$g.offset, text: item_$g.label});
newview_$i.setAttribute("y", ypos_$f);
ypos_$f += newview_$i.height
}};

this.items = newitems_$a;
this.background.redraw()
}

function registerRedraw (who_$a) {
this.__drawnitems[who_$a.getUID()] = who_$a;
this.background.redraw()
}
#file
function unregisterRedraw (who_$a) {
delete this.__drawnitems[who_$a.getUID()];
this.background.redraw()
}
#file
function __handlemouse (view_$a) {
if (!view_$a) {
this.hide();
return
};
do {
if (view_$a is lz.lzcontextmenu) {
return
};
view_$a = view_$a.immediateparent
} while (view_$a !== canvas);
this.hide()
}
#file
var background;var container;function $lzc$class_lzcontextmenu (parent_$a:LzNode? = null, attrs_$b:Object? = null, children_$c:Array? = null, async_$d:Boolean = false) {
super(parent_$a, attrs_$b, children_$c, async_$d)
}
LzNode.mergeAttributes({$delegates: ["oninit", "$fpn66o6", null], __drawnitems: {}, __overnow: null, inset: 5, options: {ignorelayout: true}, visible: false}, $lzc$class_lzcontextmenu.attributes);
}
;
lz["lzcontextmenuseparator"] = $lzc$class_lzcontextmenuseparator;
lz["lzcontextmenutext"] = $lzc$class_lzcontextmenutext;
lz["lzcontextmenudisabled"] = $lzc$class_lzcontextmenudisabled;
lz["lzcontextmenu"] = $lzc$class_lzcontextmenu;



