/**
  * LzLibrary.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic LZX
  * @subtopic Syntax
  */

/**
  * @lzxname import
  * @initarg stage
  */
class LzLibrary extends LzNode {

    #passthrough (toplevel:true) {  
  import flash.display.*;
  import flash.events.*;
  import flash.text.*;
  import flash.ui.*;
  import flash.geom.*;
  import flash.utils.*;
  import mx.controls.Button;
  import flash.net.*;
  import flash.utils.*;
  import flash.system.*;


    }#

/** @access private
  * @modifiers override 
  */
static var tagname = 'import';
/** @access private */
static var attributes = new LzInheritedHash(LzNode.attributes);

/** @access private */
var loaded = false;
/** @access private */
var loading = false;
/** @access private */
var sprite = null;

/**
 * A reference to a target file whose content is treated as a 
 * loadable module.
 * 
 * @keywords final
 * @type string
 * @access public 
 */
var href;

/** 
 * When set to 'defer', the library will not be loaded until its 
 * load-method has been called. Otherwise, the library loads 
 * automatically. 
 * 
 * @keywords final
 * @type string 
 * @lzxdefault "late"
 * @access public 
 */
var stage = "late";//"late|defer"

/**
  * @access private
  */
function $lzc$set_stage(val) {
    this.stage = val;
}



/**
 * Sent when this library has finished loading. 
 * 
 * @lzxtype event
 * @access public
 */
var onload = LzDeclaredEvent;

/** @access private
 * @modifiers override 
 */
function LzLibrary ( parent:LzNode? = null , attrs:Object? = null , children:Array? = null, instcall:Boolean  = false) {
    super(parent,attrs,children,instcall);
}

/**
  * @access private
  */
function $lzc$set_href(val) {
    this.href = val;
}

/**
  * @access private
  */
override function construct (parent, args) {
    this.stage = args.stage;
    super.construct.apply(this, arguments);
    LzLibrary.libraries[args.name] = this;
}

/**
  * @access private
  */
override function init( ) {
    super.init.apply(this, arguments);
    if (this.stage == "late") {
        this.load();
    }
}

/**
  * @access private
  */
override function destroy () {
    if (this.sprite) {
        this.sprite.destroy();
        this.sprite = null;
    }
    super.destroy();
}

/** @access private */
static var libraries = {};

/**
  * @access private
  */
static function findLibrary (libname){
    return LzLibrary.libraries[libname];
}

/**
  * @access private
  */
override function toString (){
    return "Library " + this.href + " named " + this.name;
}

public var loader:Loader = null;

/**
  * Loads this library dynamically at runtime. Must only be called 
  * when stage was set to 'defer'.
  * 
  * @access public
  */
function load () {
    if (this.loading || this.loaded) {
        return;
    }
    this.loading = true;
    var request:URLRequest = new URLRequest(this.href);
    request.method = URLRequestMethod.GET;
    this.loader = new Loader();
    var info:LoaderInfo = loader.contentLoaderInfo;
    info.addEventListener(Event.COMPLETE, handleLoadComplete);
    trace('loader.load ', this.href);
    this.loader.load(request);
}

public function handleLoadComplete(event:Event):void {
    var library:Object = event.target.content;
    library.exportClassDefs(null);
    this.libapp = library;
}

var libapp;

/** 
 * Called by LzLibraryCleanup when this library has finished loading.
 * 
 * @access private 
 */
function loadfinished (){
  this.loading = false;
  if (this.onload.ready) this.onload.sendEvent(true);
}

/**
  * Callback for runtime loaded libraries
  * @access private
  */
static function __LZsnippetLoaded (url){
    // find the lib with this url
    var lib = null;
    var libs = LzLibrary.libraries;
    for (var l in libs ) {
        if (libs[l].href == url) {
            lib = libs[l];
            break;
        }
    }
    
    if (lib == null) {
        Debug.error("could not find library with href", url);
    } else {
        lib.loaded = true;
        canvas.initiatorAddNode({attrs: {libname: lib.name}, "class": LzLibraryCleanup}, 1);
        // Run the queue to instantiate all pending LzInstantiateView calls.
        canvas.initDone();
    }
}

}; // End of LzLibrary
lz[LzLibrary.tagname] = LzLibrary;  //publish
