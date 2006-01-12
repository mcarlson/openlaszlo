/******************************************************************************
 * LaszloCanvas.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
//
//====================================================================== =======
LzCanvas = Class ( "LzCanvas" , LzView , function ( args ) {
    // Note canvas start
    if ($profile) {
        _root.$lzprofiler.event('start: #canvas');
    }
    // @field String build: build number of the LPS that generated this application (for .lzo files,
    //                      this is the build of the server that generated the optimized file, not the 
    //                      one that served it).
    // @field String lpsversion: version number of the LPS that generated this application (for .lzo files,
    //                      this is the version number of the server that generated the optimized file, not the one 
    //                      that served it).
    // @field String lpsrelease: release of the LPS that generated this application (for .lzo files,
    //                      this is the release of the server that generated the optimized file, not the one that 
    //                      served it).
    // @field String expires: expiration date of this LPS application (based on expiry of server that generated
    //                      the application, not the one that served it).
    // @field datasets: Dictionary of all named datasets.
    this.hasdatapath = true;
    this.datapath = {};
    this.immediateparent = this;
    this.__LZmovieClipRef = _root;
    this.mask = null;
    this.viewLevel = 0;
    this.resourcetable = {};

    // percentcreated support
    this.totalnodes = 0;
    this.creatednodes = 0;
    this.percentcreated = 0;

    this.framerate = 30;

    // @field boolean proxied: if true, runtime requests are proxied;
    //                                   if false, runtime requests are direct.
    //
    // initialize canvas.proxied (boolean), from args.proxied (string)
    // arg and query 'lzproxied' arg:
    // 1. If  <canvas proxied="true|false"> </canvas> then set from canvas arg.
    // 2. Otherwise, inherit from 'lzproxied' query arg (which defaults to true currently)
    // 
    if ((typeof(args.proxied) == "undefined") || args.proxied == null) {
        // Default to the 'baked in' value set by the compiler
        var lzproxied_query_arg = (args.__LZproxied == "true");
        // Override with the lzproxied query arg supplied at runtime, if present.
        if (typeof(_root.lzproxied) != "undefined") {
            lzproxied_query_arg = (_root.lzproxied == "true"); // convert string to boolean
        }
        this.proxied = lzproxied_query_arg;
    } else {
        this.proxied = (args.proxied == true);
    }
    delete args.proxied;

    this.width = Number(args.width);
    if (isNaN(this.width)) {
        if (args.width.charAt(args.width.length-1) == '%') {
            var percent = Number(args.width.substr(0, args.width.length-1));
            this.width = Stage.width * percent/100;
        }
        if ( $debug ){
            if (isNaN(this.width)) {
                _root.Debug.warn('ignored bad value %#w for canvas width', args.width);
                this.width = 500;
            }
        }
    }
    delete args.width;

    this.height = Number(args.height);
    if (isNaN(this.height)) {
        if (args.height.charAt(args.height.length-1) == '%') {
            var percent = Number(args.height.substr(0, args.height.length-1));
            this.height = Stage.height * percent/100;
        }
        if ( $debug ){
            if (isNaN(this.height)) {
                _root.Debug.warn('ignored bad value %#w for canvas height', args.height);
                this.height = 400;
            }
        }
    }
    delete args.height;

    this.bgcolor = args.bgcolor;
    delete args.bgcolor;

    this.lpsversion = args.lpsversion + "." + this.__LZlfcversion;
    delete args.lpsversion;

    this.__LZapplyArgs( args );

    if ( !this.version ){
        this.version = this.lpsversion;
    } if ( this.compareVersion( this.version ) == -1 ){
        if ( $debug ){
            _root.Debug.warn( "Enabling old ondata behavior because app uses "+
                              "version %w.", this.version );
        }
        this.__LZoldOnData = true;
    }

    this.isinited = false;
    this._lzinitialsubviews = [];
    _root.global = _root;
    // depth 0 is reserved for the preloader, if any
    this.__LZsvdepth = 1;

    this.__LZrightmenuclip = null;

    // turn on focusrect if canvas.accessible is true
    _root._focusrect = args.accessible == true ? true : 0;
});

//@field Number version: The version for this lzx app. If set below the current
//version, may enable backwards compatible behaviors.
LzCanvas.prototype.__LZlfcversion = "0";

LzCanvas.prototype.nodeLevel = 0;

LzCanvas.prototype.proxied = true;

//@field Number dataloadtimeout: timeout in milliseconds for data load requests
LzCanvas.prototype.dataloadtimeout = 30000;

//@field Number medialoadtimeout: timeout in milliseconds for media load requests
LzCanvas.prototype.medialoadtimeout = 30000;

// necessary for consistent behavior - in netscape browsers HTML is ignored
Stage.align = global.canvassalign != null ? global.canvassalign : "LT";
Stage.scaleMode = global.canvasscale != null ? global.canvasscale : "noScale";
//_root.Debug.write('Canvas scale', global.scale, Stage, Stage.scaleMode);


//-----------------------------------------------------------------------------
// Compares two version strings.
// @param ver: A version string
// @param over: Another version string. If omitted, defaults to the version of
// of the app.
// @return: -1, 0 , 1 to indicate whether the ver parameter preceeds, matches,
// or succeeds the second parameter (respectively)
//-----------------------------------------------------------------------------
LzCanvas.prototype.compareVersion = function ( ver , over ){ 

    if ( over ==null ){
        over = this.lpsversion;
    }

    if ( ver == over ) return 0; 

    var ver1 = ver.split( '.' );
    var ver2 = over.split( '.' );

    var i = 0; 
    while( i < ver1.length || i < ver2.length ){
        var my = Number( ver1[ i ] )|| 0; 
        var oth = Number( ver2[ i++ ] )|| 0; 
        if ( my < oth ) {
            return -1;
        }else if ( my > oth ) {
            return 1;
        }
    }

    return 0;
}

//-----------------------------------------------------------------------------
// The canvas setResource function is redefined to throw an error when
// called.
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.setResource = function ( ) {
    Object.error("You can't set a resource for the canvas.");
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.toString = function (){
    return "This is the canvas";
}

//------------------------------------------------------------------------------
// Canvas can't change size
// @keywords private
//------------------------------------------------------------------------------
LzCanvas.prototype.__LZcheckwidth = null;
LzCanvas.prototype.__LZcheckheight = null;
LzCanvas.prototype.hassetwidth  = true;
LzCanvas.prototype.hassetheight = true;

//-----------------------------------------------------------------------------
// @keywords private
// only called from the snippet loader
//-----------------------------------------------------------------------------
LzCanvas.prototype.initDone = function (){
    //reorder initial subviews so preloaded stuff is first
    var sva = new Array;

    for ( var i = 0; i < this._lzinitialsubviews.length; i++ ){
        if ( this._lzinitialsubviews[ i ].attrs.initimmediate ){
            sva.push( this._lzinitialsubviews[ i ] );
        }
    }

    for ( var i = 0; i < this._lzinitialsubviews.length; i++ ){
        if ( !this._lzinitialsubviews[ i ].attrs.initimmediate ){
            sva.push( this._lzinitialsubviews[ i ] );
        }
    }

    // Done with that
    this._lzinitialsubviews = [];

    //this.isinited = false;
    _root.LzInstantiator.requestInstantiation(  this, sva );
}

//-----------------------------------------------------------------------------
// @keywords private
// Note that canvas functions that need to happen when the app is
// loaded should go here, so they will be invoked in kranked apps too.
// (By the root resolver in LaszloLibrary).
//-----------------------------------------------------------------------------
LzCanvas.prototype.init = function (){
    // set up right click menu on canvas
    this.setDefaultContextMenu(this.__LZDefaultCanvasMenu);

    // listen to stage resize events
    this.__LZinstallStageListener();
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.__LZinstantiationDone = function (){
    //@field percentcreated: A number from 0-1 that represents the
    //percentage of the app that has been instantiated.
    this.percentcreated = 1;
    this.updatePercentCreated = null;
    //@field onpercentcreated: Sent whenever the number of created nodes
    //changes
    this.onpercentcreated.sendEvent( this.percentcreated );

    if ( this.initdelay > 0 ){
        _root.LzInstantiator.halt();
        this.initokdel = new _root.LzDelegate ( this , "okToInit" );
        _root.LzTimer.addTimer( this.initokdel , this.initdelay );
    } else {
        this.okToInit();
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.okToInit = function (){
    _root.LzInstantiator.resume();
    this.__LZcallInit();
    // When kranking, start the serializer as soon as you are initialized.
    if (_root.$krank) {
      _root.LzSerializer.start();
    }
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.updatePercentCreated = function (){
    this.percentcreated = Math.max( this.percentcreated ,
                                    this.creatednodes / this.totalnodes );
    this.percentcreated = Math.min( .99 , this.percentcreated );
    this.onpercentcreated.sendEvent( this.percentcreated );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.initiatorAddNode = function ( e , n ){
    this.totalnodes += n;
    this._lzinitialsubviews.push( e );
}

//------------------------------------------------------------------------------
// @keywords private
// N.B.: replaces LzNode.__LZcallInit, so must be kept in sync with that
//------------------------------------------------------------------------------
LzCanvas.prototype.__LZcallInit = function ( an ){
    if (this.isinited) return;

    //do this now, so that others know that they're too late
    this.isinited = true;

    this.__LZresolveReferences();
    var sl = this.subnodes.length;
    for ( var i = 0; i<sl; i++ ){
        var s = this.subnodes[ i ];
        if ( s.isinited || s.__LZlateinit ) continue;
        s.__LZcallInit( );
    }

    // If not kanking, init the canvas now.  If kranking, canvas.init
    // (and the oninit event) are invoked by the root resolver in
    // LaszloLibrary.
    if ( ! _root.$krank ){
        this.init();
        //@event oninit: This event is sent right before a node becomes active
        //-- e.g. before a view displays, or before a layout affects its
        //subviews.
        this.oninit.sendEvent( this );
        this.datapath.__LZApplyDataOnInit();
    }
    
    // Note canvas end
    if ($profile) {
        _root.$lzprofiler.event('done: #canvas');
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.setWidth = function ( ){
    if ( $debug ){
        _root.Debug.error( "setWidth cannot be called on the canvas." );
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.isProxied = function ( ){
    return this.proxied;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.setX = function ( ){
    if ( $debug ){
        _root.Debug.error( "setX cannot be called on the canvas." );
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.setHeight = function ( ){
    if ( $debug ){
        _root.Debug.error( "setHeight cannot be called on the canvas." );
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.setY = function ( ){
    if ( $debug ){
        _root.Debug.error( "setY cannot be called on the canvas." );
    }
}


//-----------------------------------------------------------------------------
// @keywords public
// @param  cmenu: a ContextMenu
// sets the right click menu on the canvas and as the default menu for all views 
//-----------------------------------------------------------------------------
LzCanvas.prototype.setDefaultContextMenu = function (cmenu){
    this.setContextMenu(cmenu);
    
    // For back compatibility, we accept either LzContextMenu or (Flash primitive) ContextMenu
    if (! (cmenu instanceof ContextMenu)) {
        cmenu = cmenu.__LZcontextMenu();
    } else {
        Debug.write("Passing a Flash ContextMenu to LzCanvas.setDefaultContextMenu is deprecated, use LzContextMenu instead");
    }

    MovieClip.prototype.menu = cmenu;

}

//-----------------------------------------------------------------------------
// @keywords public
// @param  cmenu: a ContextMenu
// sets the right click menu for the canvas
// 
//-----------------------------------------------------------------------------
LzCanvas.prototype.setContextMenu = function (cmenu){
    this.contextMenu = cmenu;
    // For back compatibility, we accept either LzContextMenu or (Flash primitive) ContextMenu
    if (! (cmenu instanceof ContextMenu)) {
        cmenu = cmenu.__LZcontextMenu();
    } else {
        Debug.write("Passing a Flash ContextMenu to LzCanvas.setContextMenu is deprecated, use LzContextMenu instead");
    }

    var mmc = null;

    if (this.__LZrightmenuclip == null) {

        // This overrides LzView setContextMenu, because we cannot afford
        // to set "menu" on the Canvas' movieclip, because that would be _root.menu
        // and it will bash any class named "menu"
        var mc = this.getMCRef();
        var depth = LzView.prototype.CANVAS_CONTEXT_MENU_DEPTH;

        var mmc = mc.attachMovie("swatch",  "$rightclkmenu", depth );

        if (_root.$krank) {
            mmc.$SID_LINK = "swatch";
            mmc.$SID_DEPTH = depth;
        }

        mmc._alpha = 0;

        mmc._width = 1;
        mmc._height = 1;
        this.__LZrightmenuclip = mmc;
    } else {
        mmc = this.__LZrightmenuclip;
    }

    mmc.menu = cmenu;

    //    Debug.write(Debug.backtrace(), "LzCanvas.setContextMenu", 'cmenu=',cmenu, 'this.contextMenu=', this.contextMenu,'mmc=', mmc, 'this.__LZrightmenuclip=', this.__LZrightmenuclip);


}



//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
// Build default right click menu for apps 

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.__LZdefaultMenuItemHandler = function (obj, item) {
    // load a url 
    LzBrowser.loadURL("http://www.openlaszlo.org", "About OpenLaszlo");
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.__LZviewSourceMenuItemHandler = function (obj, item) {
    // view source for this app
    // /examples/components/edittext_example.lzx
    var url = LzBrowser.getBaseURL();
    if (_root.canvas.proxied) {
        url = url.toString() + "?lzt=source";
    } else {
        // SOLO app named foo.lzx looks for a source zipfile named foo.lzx.zip
        url = url.toString() + ".zip";
    }
    LzBrowser.loadURL(url, "View Source");
}

// Build the default righ-click menu object
//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.buildDefaultMenu = function () {
    var cproto = LzCanvas.prototype;
    cproto.__LZDefaultCanvasMenu = new LzContextMenu();
    cproto.__LZdefaultMenuItem = new LzContextMenuItem("About OpenLaszlo...",
                                                       new LzDelegate(cproto, '__LZdefaultMenuItemHandler'));
    
    cproto.__LZviewSourceMenuItem = new LzContextMenuItem("View Source",
                                                          new LzDelegate(cproto, '__LZviewSourceMenuItemHandler'));


    cproto.__LZDefaultCanvasMenu.hideBuiltInItems();
    cproto.__LZDefaultCanvasMenu.addItem(cproto.__LZdefaultMenuItem);
    cproto.__LZDefaultCanvasMenu.addItem(cproto.__LZviewSourceMenuItem);

    // Install the default menu onto MovieClip, so it shows up everywhere by default
    MovieClip.prototype.menu = __LZDefaultCanvasMenu.__LZcontextMenu();
}

LzCanvas.prototype.buildDefaultMenu();

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzCanvas.prototype.__LZinstallStageListener = function () {
    var cnvs = this;
    var lstnr = {
        onResize: function () {
            var width = Stage.width;
            cnvs.width = width;
            cnvs.onwidth.sendEvent(width);
            var height = Stage.height;
            cnvs.height = height;
            cnvs.onheight.sendEvent(height);
            cnvs.__LZrightmenuclip._xscale = width;
            cnvs.__LZrightmenuclip._yscale = height;
        }
    };
    Stage.addListener(lstnr);
    lstnr.onResize();
}
