/**
  * LzLibrary.as
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
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

/** @access private
  * @modifiers override 
  */
static var tagname = 'import';

/**
  * @access private
  */
function construct (parent, args) {
    this.stage = args.stage;
    super.construct.apply(this, arguments);
    this.sprite = new LzSprite(this, false, args);
    LzLibrary.libraries[args.name] = this;
}

/**
  * @access private
  */
function init( ) {
    super.init.apply(this, arguments);
    if (this.stage == "late") {
        this.load();
    }
}


static var libraries = [];

/**
  * @access private
  */
static function findLibrary (libname){
    return LzLibrary.libraries[libname];
}

var loaded = false;
var loading = false;
DeclareEvent(prototype, 'onload');

function toString (){
    return "Library " + this.href + " named " + this.name;
}

/**
  * @access private
  */
function load (){
    Lz.__dhtmlLoadLibrary(this.href);
}

/**
  * Callback for runtime loaded libraries
  * @access private
  */
static function __LZsnippetLoaded (url){
    // find the lib with this url
    var libname = null;
    var libs = LzLibrary.libraries;
    for (var l in libs ) {
        if (libs[l].href == url) {
            libname = libs[l].name;
            break;
        }
    }
    if (libname == null) {
        Debug.error("could not find library with href", url);
    }
    LzInstantiateView({attrs: {libname: libname}, name: "__libraryloadercomplete"}, 1);
    // Run the queue to instantiate all pending LzInstantiateView calls.
    canvas.initDone();
}

}; // End of LzLibrary

