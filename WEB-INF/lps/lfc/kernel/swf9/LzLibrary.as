/**
  * LzLibrary.as
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
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
    import flash.display.Loader;
    import flash.display.LoaderInfo;
    import flash.events.Event;
    import flash.net.URLRequest;
    import flash.net.URLRequestMethod;
    }#

/** @access private
  * @modifiers override 
  */
static var tagname :String = 'import';
/** @access private */
static var attributes :Object = new LzInheritedHash(LzNode.attributes);

/** @access private */
var loaded :Boolean = false;
/** @access private */
var loading :Boolean = false;

/**
 * A reference to a target file whose content is treated as a 
 * loadable module.
 * 
 * @keywords final
 * @type string
 * @access public 
 */
var href:String;

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
var stage :String = "late";//"late|defer"

/**
  * @access private
  */
function $lzc$set_stage(val:String) :void {
    this.stage = val;
}



/**
 * Sent when this library has finished loading. 
 * 
 * @lzxtype event
 * @access public
 */
var onload :LzDeclaredEventClass = LzDeclaredEvent;

/** @access private
 * @modifiers override 
 */
function LzLibrary (parent:LzNode? = null, attrs:Object? = null, children:Array? = null, instcall:Boolean = false) {
    super(parent, attrs, children, instcall);
}

/**
  * @access private
  */
function $lzc$set_href(val:String) :void {
    this.href = val;
}

/**
  * @access private
  */
override function construct (parent, args) {
    this.stage = args.stage;
    super.construct(parent, args);
    LzLibrary.libraries[args.name] = this;
}

/**
  * @access private
  */
override function init( ) {
    super.init();
    if (this.stage == "late") {
        this.load();
    }
}

/**
  * @access private
  */
override function destroy () {
    super.destroy();
}

/** @access private */
static var libraries :Object = {};

/**
  * @access private
  */
static function findLibrary (libname:String) :LzLibrary {
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
function load () :void {
    if (this.loading || this.loaded) {
        return;
    }
    this.loading = true;
    var loadurl:LzURL = lz.Browser.getBaseURL();
    loadurl.file = this.href;
    var request:URLRequest = new URLRequest(loadurl.toString());
    request.method = URLRequestMethod.GET;
    this.loader = new Loader();
    var info:LoaderInfo = loader.contentLoaderInfo;
    info.addEventListener(Event.COMPLETE, handleLoadComplete);
    this.loader.load(request);
}

public function handleLoadComplete(event:Event):void {
    var library:Object = event.target.content;
    library.exportClassDefs(null);
    this.libapp = library;
}

var libapp:Object;

/** 
 * Called by LzLibraryCleanup when this library has finished loading.
 * 
 * @access private 
 */
function loadfinished () :void {
  this.loading = false;
  if (this.onload.ready) this.onload.sendEvent(true);
}

/** @access private
 */
static function stripQueryString(str:String):String {
    if (str.indexOf('?') > 0) {
        str = str.substring(0,str.indexOf('?'));
    }
    return str;
}

/**
  * Callback for runtime loaded libraries
  * @access private
  */
static function __LZsnippetLoaded (url:String) :void {
    // find the lib with this url
    // Strip out query string
    url = LzLibrary.stripQueryString(url);
    var lib:LzLibrary = null;
    var libs:Object = LzLibrary.libraries;
    for (var l:String in libs) {
        var libhref = LzLibrary.stripQueryString(libs[l].href);
        if (libhref == url) {
            lib = libs[l];
            break;
        }
    }

    if (lib == null) {
        Debug.error("could not find library with href", url);
    } else {
        lib.loaded = true;
        // the parent must be the canvas
        lib.parent.__LzLibraryLoaded(lib.name);
    }
}

}; // End of LzLibrary
lz[LzLibrary.tagname] = LzLibrary;  //publish
