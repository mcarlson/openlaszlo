/******************************************************************************
 * LzLibrary.as
 * ***************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

LzLibrary = Class( "LzLibrary" , LzView );

LzLibrary.prototype._viewconstruct = LzView.prototype.construct;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzLibrary.prototype.construct= function (parent, args) {
    this.stage = args.stage;
    this._viewconstruct( parent , args );
    LzLibrary.prototype.libraries[args.name] = this;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzLibrary.prototype.init = function( ) {
    super.init();
    if (this.stage == "late") {
        this.load();
    }
}


LzLibrary.prototype.libraries = [];

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzLibrary.prototype.findLibrary = function (libname){
    return LzLibrary.prototype.libraries[libname];
}

LzLibrary.prototype.loaded = false;
LzLibrary.prototype.loading = false;

LzLibrary.prototype.toString = function (){
    return "Library " + this.href + " named " + this.name;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzLibrary.prototype.load = function (){
  if (this.loading || this.loaded) {
    return;
  }
  this.loading = true;
  this.makeContainerResource();
  var loader = this.loader = new _root.LzLibraryLoader(this);

  var proxied = canvas.proxied;
  // check if this library has a "proxied" attribute which overrides canvas switch
  if (typeof(this.proxied) != "undefined" && this.proxied != null) {
      proxied = (this.proxied == true);
  }

  loader.proxied = proxied;

  loader.request( this.href );
}

//---
// To 'unload' a snippet, three things have to be done:
//
// 1. Destroy all the instances that were created by the snippet.
// This is done by calling `iii.destroy();` for each instance
// iii. Note that if you have created references to the instance
// outside of the snippet, you must `delete` those references.
//
// 2. Destroy all classes that were created by the snippet.  This
// is done by calling `ccc.destroy();` for each class ccc.  Note
// that if you have created references to the class outside of
// the snippet, you must `delete` those references.
//
// 3. Unload the snippet.  This is done by calling
// `sss.unload()`, where sss is the name of the snippet (in the
// import tag).
//
// At this point, you can re-load the snippet by calling
// `sss.load()`.  If you know you will never use the snippet
// again, you can call `sss.destroy();` to remove the snippet
// from your application altogether.
//
// @keywords private
//---
LzLibrary.prototype.unload = function () {
  if (! (this.loading || this.loaded)) {
    return;
  }
  var loader = this.loader;
  if (this.loading) {
      loader.abort();
  } else {
      loader.unload();
  }
  this.loader.destroy();
  delete this.loader;
  this.loading = false;
  this.loaded = false;
  // TODO: [2005-08-31 ptw] Horrible modularity here, but
  // loader.unload leaves this with a husk
  delete this.__LZmovieClipRef
}

//---
// @keywords private
//---
LzLibrary.prototype.destroy = function () {
    this.unload();
    super.destroy();
}
