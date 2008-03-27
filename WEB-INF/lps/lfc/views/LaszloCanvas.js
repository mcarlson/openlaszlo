/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzcanvas
  * @access public
  */
 

/**
  * <p>The canvas is the container for all views within an application.</p>
  *
  * <p>The <classname>LzCanvas</classname> class represents the viewable
  * area of the application.  There is one instance of
  * <classname>LzCanvas</classname>, named <varname>canvas</varname>.  The
  * canvas contains all views within an application.</p>
  * 
  * <p>The <tagname>canvas</tagname> tag is the document root of an LZX
  * application file.  It contains class, resource, and font definitions,
  * library includes, and view and other instances.</p>
  * 
  * <p>See the <a
  * href="${dguide}program-structure.html#program-structure.canvas-tag">Guide</a>
  * for a complete discussion of the <tagname>canvas</tagname> tag.</p>
  *  
  * In addition to any events documented in the section below, these events are also available:
  *
  * <event>oninit</event> This event is sent right before a node becomes active
  * -- e.g. before a view displays, or before a layout affects its
  * subviews.
  *
  * <p>In addition to any fields documented in the section at the end, these fields are also available:
  * <ul>
  * <li><attribute>anm_multipler</attribute> A <type>Number</type> specifying the animation speed.</li>
  * <li><attribute>embedfonts</attribute> A <type>Boolean</type> true | false. Whether to embed fonts in the compiled application.</li>
  * <li><attribute>lpsbuild</attribute> A <type>String</type> specifying the LPS build revision and the build directory: e.g. "4075 /Users/maxcarlson/openlaszlo/legals"</li>
  * <li><attribute>lpsbuilddate</attribute> A <type>String</type> specifying the date and time of the LPS build. "2007-03-05T15:33:42-0800"</li>
  * <li><attribute>lpsrelease</attribute> A <type>String</type> specifying the LPS release type, e.g. "Latest" </li>
  * <li><attribute>lpsversion</attribute> A <type>String</type> specifying the LPS version, e.g. "4.0.x"</li>
  * <li><attribute>proxied</attribute> A <type>Boolean</type> true | false</li>
  * <li><attribute>runtime</attribute> A <type>String</type> describing the target runtime. "dhtml" | "swf7" | "swf8" are currently supported. Others are in development.</li>
  * <li><attribute>version</attribute>A String. The same as lpsversion. </li>
  * </ul></p>
  * @see LzView
  * @lzxname canvas
  * @shortdesc The top-most view in a Laszlo application.
  * @topic LFC
  * @subtopic Views
  * @access public
  * @initarg Boolean accessible: Specifies if this application is intended to be accessible
  * @initarg Boolean debug: If true, the application is compiled with debugging enabled.
  * See the <a href="${dguide}debugging.html">Debugging</a> chapter of
  * the Guide for more information about debugging.
  */
dynamic class LzCanvas extends LzView {

  static var tagname = 'canvas';

    #passthrough (toplevel:true) {  
    import flash.utils.*;
    }#

/**
  * @access private
  * @modifiers override
  */
/** @access private */
  static var attributes = new LzInheritedHash(LzView.attributes);

var resourcetable:*;
var _lzinitialsubviews:Array = [];
var totalnodes:*;
var framerate:*;
var creatednodes:*;

    /* These are passed in by the compiler as attributes */
    var __LZproxied;
    var embedfonts;
    var lpsbuild;
    var lpsbuilddate;
    var runtime;

var __LZmouseupDel:LzDelegate;
var __LZmousedownDel:LzDelegate;
var __LZmousemoveDel:LzDelegate;    


function LzCanvas ( args ) {
    super(null, args);

    // Note canvas start
    if ($profile) {
        Profiler.event('start: #canvas');
    }
    // TODO [hqm 2008-01] nobody seems to reference this
    //    this.hasdatapath = true;

    this.datapath = {};
    this.immediateparent = this;

    this.mask = null;
    this.resourcetable = {};

    // percentcreated support
    this.totalnodes = 0;
    this.creatednodes = 0;
    this.percentcreated = 0;

    this.framerate = 30;

    this.lpsversion = args.lpsversion + "." + this.__LZlfcversion;
    delete args.lpsversion;

    this.datasets = {};
    global.canvas = this;
    this.parent = this;
    this.makeMasked();

    this.__LZmouseupDel = new LzDelegate( this , "__LZmouseup", LzGlobalMouse, 'onmouseup');// called on global mouseup
    this.__LZmousedownDel = new LzDelegate( this , "__LZmousedown", LzGlobalMouse, 'onmousedown');// called on global mousedown
    this.__LZmousemoveDel = new LzDelegate( this , "__LZmousemove", LzGlobalMouse, 'onmousemove');// called on global mousemove

    //LzPlatform.initCanvas(this);

    this.id = LzBrowser.getInitArg('id')
}


/**
  * Sends onmouseup event
  * @access private
  */
function __LZmouseup(...rest) {
    if (this.onmouseup.ready) this.onmouseup.sendEvent()
}

/**
  * Sends onmousemove event
  * @access private
  */
function __LZmousemove(...rest) {
    if (this.onmousemove.ready) this.onmousemove.sendEvent()
}

/**
  * Sends onmousedown event
  * @access private
  */
function __LZmousedown(...rest) {
    if (this.onmousedown.ready) this.onmousedown.sendEvent()
}

/**
  * Overridden to pass true for "isroot" to LzSprite constructor
  * @access private
  */
override function __makeSprite(args) {
    this.sprite = new LzSprite(this, true, args);
    if ($debug) {
        Debug.write("making canvas sprite", this.sprite);
    }
}

var initdelay = 0;

/** Sent whenever the number of created nodes changes 
  * @lzxtype event
  */
var onpercentcreated = LzDeclaredEvent;



/** version number of the LPS that generated this application (for .lzo files,
  * this is the version number of the server that generated the optimized file, not the one 
  * that served it).
  * @type Number
  * @keywords final
  */
var lpsversion;

/** release of the LPS that generated this application (for .lzo files,
  * this is the release of the server that generated the optimized file, not the one that 
  * served it).
  * @type String
  * @keywords final
  */
var lpsrelease;

/**
  * The lpsversion of this lzx application.
  * @type Number
  * @lzxtype string
  * @lzxdefault "1.1"
  * @modifiers deprecated final
  */
var version;

/** @access private */
var __LZlfcversion = "0";

/** If true, requests for data and media are proxied through LPS server.
  * if false, requests are made directly to target URLs. 
  * if inherit, inherit from lzproxied query arg.
  *
  * @lzxtype booleanLiteral | "inherit"
  * @lzxdefault "inherit"
  */
var proxied = true;

/** If present, specifies the default timeout in milliseconds of data load requests
  * @type Number
  * @lzxtype numberExpression
  */
var dataloadtimeout = 30000;

/** If present, specifies the default timeout in milliseconds of media load requests
  * @type Number
  * @lzxtype numberExpression
  */
var medialoadtimeout = 30000;

/** A number from 0-1 that represents the
  * percentage of the app that has been instantiated.
  */
var percentcreated;

/** Dictionary of all named datasets.
  * @type Object
  */
var datasets;



/**
  * Compares two version strings.
  * @param ver: A version string
  * @param over: Another version string. If omitted, defaults to the version of
  * of the app.
  * @return: -1, 0 , 1 to indicate whether the ver parameter preceeds, matches,
  * or succeeds the second parameter (respectively)
  */
function compareVersion ( ver , over ){ 

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

/**
  * The canvas setResource function is redefined to throw an error when
  * called.
  * @access private
  */
override function setResource (v ) {
    if ($swf9) {
        //
    } else {
        Object.error("You can't set a resource for the canvas.");
    }
}


/**
  * @access private
  */
override function toString (){
    return "This is the canvas";
}

/*
  * Canvas can't change size
  */
// Override values defined in LzView
/** @access private */ prototype.__LZcheckwidth = null;
/** @access private */ prototype.__LZcheckheight = null;
/** @access private */ prototype.hassetwidth  = true;
/** @access private */ prototype.hassetheight = true;


/**
  * @access private
  * only called from the snippet loader
  */
function initDone (){
    //reorder initial subviews so preloaded stuff is first
    var sva = new Array;

    for ( var i = 0; i < this._lzinitialsubviews.length; i++ ){
        if ( 'initimmediate' in this._lzinitialsubviews[ i ].attrs && 
             this._lzinitialsubviews[ i ].attrs.initimmediate ){
            sva.push( this._lzinitialsubviews[ i ] );
        }
    }

    for ( var i = 0; i < this._lzinitialsubviews.length; i++ ){
        if ( !('initimmediate' in this._lzinitialsubviews[ i ].attrs && 
             this._lzinitialsubviews[ i ].attrs.initimmediate) ){
            sva.push( this._lzinitialsubviews[ i ] );
        }
    }

    // Done with that
    this._lzinitialsubviews = [];

    //this.isinited = false;
    //Debug.write('LzCanvas.initDone');
    LzInstantiator.requestInstantiation(  this, sva );
}


/**
  * @access private
  * @devnote Note that canvas functions that need to happen when the app is
  * loaded should go here, so they will be invoked in kranked apps too.
  * (By the root resolver in LaszloLibrary).
  */
override function init (){
    trace("LzCanvas.init called");
    // cheapo debugger printing
    sprite.addChild(lzconsole.consoletext);
    sprite.addChild(lzconsole.consoleinputtext);
    //lzconsole.write("elapsed time "+getTimer()+" msec");
}

/**
  * @access private
  */
override function __LZinstantiationDone (){
    this.percentcreated = 1;

    if ($swf9) {
        // 
    } else {
        this.updatePercentCreated = null;
    }

    if (this.onpercentcreated.ready) this.onpercentcreated.sendEvent( this.percentcreated );

    if ( this.initdelay > 0 ){
        LzInstantiator.halt();
        this.initokdel = new LzDelegate ( this , "okToInit" );
        LzTimer.addTimer( this.initokdel , this.initdelay );
    } else {
        this.okToInit();
    }
}

/**
  * @access private
  */
function okToInit (){
    LzInstantiator.resume();
    this.__LZcallInit();
}

/**
  * @access private
  */
function updatePercentCreated (){
    this.percentcreated = Math.max( this.percentcreated ,
                                    this.creatednodes / this.totalnodes );
    this.percentcreated = Math.min( .99 , this.percentcreated );
    if (this.onpercentcreated.ready) this.onpercentcreated.sendEvent( this.percentcreated );
}

/**
  * @access private
  */
function initiatorAddNode ( e , n ){
    this.totalnodes += n;
    this._lzinitialsubviews.push( e );
}

/**
  * @access private
  * @devnote N.B.: replaces LzNode.__LZcallInit, so must be kept in sync with that
  */
override function __LZcallInit ( an = null ){
    // Canvas-only:  Don't bother with preventSubInit
    if (this.isinited) return;

    //do this now, so that others know that they're too late
    this.isinited = true;

    this.__LZresolveReferences();
    if (this.__LZstyleConstraints) this.__LZapplyStyleConstraints();
    var sl = this.subnodes;
    if (sl) {
        var i = 0;
        var l = sl.length;
        while(i < l){
            var s = sl[ i++ ];
            //remember next one too
            var t = sl[ i ]
                if ( s.isinited || s.__LZlateinit ) continue;
            s.__LZcallInit( );
            //if the next one is not where it was, back up till we find it or to
            //the beginning of the array
            if ( t != sl[ i ] ){
                // When does this ever happen?
                //             Debug.warn('subnodes array changed after %w -> sl[%d]: %w', t, i, sl[i]);
                while ( i > 0 ){
                    if ( t == sl[ --i ] ) break;
                }
            }
        }
    }

    // Register in the source locator table, if debugging
    if ($debug) {
        if (this.__LZsourceLocation) {
            LzNode.sourceLocatorTable[this.__LZsourceLocation] = this;
        }
    }

    this.init();
    // Canvas-only: Why? TODO: [2008-02-01 ptw] Ask max
    this.sprite.init(true);
    if (this.oninit.ready) this.oninit.sendEvent( this );
    if (this.datapath && this.datapath.__LZApplyDataOnInit) {
        this.datapath.__LZApplyDataOnInit();
    }
    
}



/**
  * @access private
  */
function isProxied ( ){
    return this.proxied;
}

/**
  * @access private
  */
override function setX ( v, force = null){
    if ( $debug ){
        Debug.error( "setX cannot be called on the canvas." );
    }
}


/**
  * @access private
  */
override function setY ( v, force = null){
    if ( $debug ){
        Debug.error( "setY cannot be called on the canvas." );
    }
}

/**
  * LzView.setDefaultContextMenu
  * Install default menu items for the right-mouse-button 
  * @param LzContextMenu cmenu: LzContextMenu to install on this view
  */
function setDefaultContextMenu ( cmenu ){
    this.setContextMenu(cmenu);
    this.sprite.setDefaultContextMenu( cmenu );
}

/**
  * Compute version info as a string
  * @access public
  */
static function versionInfoString () {
  return (
    'URL: ' + LzBrowser.getLoadURL() + '\n' +
    'Version: ' + canvas.lpsversion + '\n' +
    'Release: ' + canvas.lpsrelease + '\n' +
    'Build: ' + canvas.lpsbuild + '\n' +
    'Date: ' + canvas.lpsbuilddate + '\n' +
    'Target: ' + canvas.runtime + '\n' +
    'Runtime: ' + LzBrowser.getVersion() + '\n');
}

/**
  * Callback for LzScreenKernel window resize events
  * @access private
  */
function __windowResize(size) {
    if (this.__canvaswidthratio != null) {
        this.width = Math.floor(size.width * this.__canvaswidthratio);
        if (this.onwidth.ready) this.onwidth.sendEvent(this.width);
        this.sprite.setWidth(this.width);
    }

    if (this.__canvasheightratio != null) {
        this.height = Math.floor(size.height * this.__canvasheightratio);
        if (this.onheight.ready) this.onheight.sendEvent(this.height);
        this.sprite.setHeight(this.height);
    }
}

} // End of LzCanvas
ConstructorMap[LzCanvas.tagname] = LzCanvas;



