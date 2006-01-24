/******************************************************************************
 * LaszloView.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//============================================================================
//
// @keywords public
//
// @field LzView mask: Reference to closest masked view in the hierarchy above
// this one
//
// @field frame: See also the <attribute>resource</attribute>
// attribute.  Setting this attribute will change the frame that is
// being displayed by the resource associated with this view. The
// first frame of the resource is frame 0.  Setting a view's
// 'donttrackplay' option to true will allow the view's resource to
// play without updating the value of the view's frame property. This
// can save CPU usage in cases where the application doesn't need to
// know what frame the resource is showing while it is playing.
//
// @field selected: Setting this attribute calls the abstract method
// <method>setSelected</method>.  See
// <classname>LzSelectionManager</classname>.
//
// @field source: The URL from which to load the resource for this
// view.  If this attribute is set, the media for the view is loaded
// at runtime.
//
// @event onx: event for changes to view's <attribute>x</attribute> property
// @event ony: event for changes to view's <attribute>y</attribute> property
// @event onwidth: event for changes to view's <attribute>width</attribute> property
// @event onheight: event for changes to view's <attribute>height</attribute> property
// @event onaddsubview: Event called when this view adds a subview
// @event onremovesubview: Event called when this view removes a subview
// @event onfocus: Event called when this view gets the focus. Only sent on a
// focusable view. The parameter for the event is the new focus.
// @event onblur: Event called when this view loses the focus. Only sent on a
// focusable view. The parameter for the event is the new focus, or null when
// the focus is cleared.
//============================================================================

//var tabindexcounter = 1000;
var LzView = Class( "LzView" , LzNode );

LzView.prototype._nodeconstruct = LzNode.prototype.construct;
//------------------------------------------------------------------------------
//Base level constructor for views. See <method
//classname="LzNode">construct</method> for more on this.
//
// @keywords protected
//------------------------------------------------------------------------------
LzView.prototype.construct = function ( parent , args ) {
    //this.callInherited( "construct" , arguments.callee , parent ,args );
    this._nodeconstruct( parent ? parent : _root.canvas, args );

    var ip = this.immediateparent;
    
    this.mask = ip.mask;

    this.__LZdepth = ip.__LZsvdepth++;
    this.__LZsvdepth = 0;

    if ( args.width  || args.$refs.width ){
        this.hassetwidth = true;
        this.__LZcheckwidth = null;
    }
    if (  args.height  || args.$refs.height ){
        this.hassetheight = true;
        this.__LZcheckheight = null;
    }

    //@param Boolean args.masked: A boolean indicating that the view is masked
    //if true, the view applies the makeMasked transformer to itself
    var r =null;
    if ( args.resource != null ){
        r = args.resource;
        args.resource = this._ignoreAttribute;
    }
    if (args.clip){
        this.makeMasked( );
    }
    if ( r  != null ){
        this.setResource( r );
    }

    //@param String args.resource: A string denoting the library resource to use for
    //this view. The default is usually 'theEmptyResource'

    //@field String stretches: A string specifying whether or not the view
    //should stretch its contents.  Values are <code>width</code>, <code>height</code> or <code>both</code>.
    //When stretching, the coordinate system of the contents is modified
    //so that the whole view will fit in the given dimensions.
    // If <code>stretches</code> is applied, <code>clip</code> would not be necessary.
}

//------------------------------------------------------------------------------
// Called right before the view is shown. See <method
// classname="LzNode">init</method> for more.
//
// @keywords protected
//------------------------------------------------------------------------------
LzView.prototype.init = function( ) {
    this.__LZmovieClipRef._visible = this.visible;
    this.__LZbgRef._visible = this.visible;

    //this.reevaluateSize();
}


//------------------------------------------------------------------------------
// Called when a subview is added to the view.
// @keywords protected
// @param LzView s: The new subview
//------------------------------------------------------------------------------
LzView.prototype.addSubview = function ( s ){
    //@field [LzView] subviews: An array of the subviews that are children of this
    //view. This is initialized to an empty array for views that have no subviews.

    if ( s.addedToParent ) return;

    // Don't use the prototype's default subviews array, it is a
    // sentinel which lives on the prototype and is shared by all
    // instances, make a new one if you want to push a view.
    if (this.subviews.length == 0) {
        // Make our own subviews array instance.
        this.subviews = [];
    }
    this.subviews.push( s );

    s.addedToParent = true;

    this.__LZcheckwidth( s );
    this.__LZcheckheight( s );

    this.onaddsubview.sendEvent( s );
}

//------------------------------------------------------------------------------
// Called when the view itself and all its children have finished
// instantiating.
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.__LZinstantiationDone = function (){
    this.immediateparent.addSubview( this );
    //this.callInherited( '__LZinstantiationDone' , arguments.callee );
    this._nodeinstantiationDone();
}
LzView.prototype._nodeinstantiationDone = LzNode.prototype.__LZinstantiationDone;

//@field Boolean focusable: If true, this view will participate in keyboard
// focus and will receive focus events and keyboard events
// when it has the focus. (see LzFocus for more details)


LzView.prototype.width = null;
LzView.prototype.height = null;
LzView.prototype.x = 0;
LzView.prototype.y = 0;


//@field Boolean clip: If true, the resource and children of this view
//are masked to its width and height.
LzView.prototype.setters.clip =  -1;
LzView.prototype.setters.x ="setX"
LzView.prototype.setters.y =  "setY";
//@field Number width: The width of the view
//@field Number height: The height of the view
LzView.prototype.setters.width = "setWidth";
LzView.prototype.setters.height = "setHeight";
LzView.prototype.setters.rotation= "setRotation";
LzView.prototype.setters.opacity = "setOpacity";
//---
//@keywords private
//---
LzView.prototype.setters.alpha = "setOpacity";
//@field Boolean visible: A value of true means that this view is shown. A
//value of false means that this view is hidden. Setting this attribute to null
//means that the runtime will hide this view when: its opacity is 0, it has a
//datapath that does not match a node, or it is loading its media. In this
//case, the the value of the visible member of the view will reflect the view's
//current visible state. This is the default behavior for this attribute. Note
//that an otherwise clickable view that is not visible will have no click
//region will not be clickable. Also be aware that in Javascript, the
//&amp;&amp; operator does not coerce values to booleans. For instance, given
//an expression like this: <code>visible="a &amp;&amp; b"</code>, if
//<code>a</code> is null, the value returned by the constraint expression will
//be null -- not false. 
LzView.prototype.setters.visible = "setVisible"
LzView.prototype.setters.align = "setAlign"
LzView.prototype.setters.valign = "setValign"
LzView.prototype.setters.source = "setSource";
LzView.prototype.setters.bgcolor =  "setBGColor";
LzView.prototype.setters.resource =  "setResource";
//@field Boolean clickable: must be set to true for the view to get mouse
//events (auto-set to true if a mouse event script is specified in the tag)
LzView.prototype.setters.clickable =  "setClickable";
LzView.prototype.setters.clickregion =  "__LZsetClickRegion";
LzView.prototype.setters.cursor =  "setCursor";
LzView.prototype.setters.fgcolor =  "setColor";
LzView.prototype.setters.font = "setFontName" ;
LzView.prototype.setters.stretches =   "stretchResource";
LzView.prototype.setters.play =   "setPlay";
//@field Boolean showhandcursor: Show or hide the handcursor for this view, if clickable
LzView.prototype.setters.showhandcursor =   "setShowHandCursor";

//deprecated for Krank release
LzView.prototype.setters.xscale =   "setXScale";
LzView.prototype.setters.yscale =   "setYScale";
//end deprecated setters

LzView.prototype.setters.frame =   "setResourceNumber";

//@field Object layout: A CSS property when declared in the tag:
// value sequence of layout parameters,
//which are used to create a layout that is attached to this view. If there is a
//class property, it names the class of the layout; otherwise simplelayout
//is used. Examples: <code>axis: x</code>, <code>class: constantlayout; axis: y</code>;
//<code>axis: x; spacing: 5</code>.  For Javascript usage, see the <method>setLayout</method> method.
LzView.prototype.setters.layout =   "setLayout";

//@field Boolean aaactive:  Activate/inactivate children for accessibility
LzView.prototype.setters.aaactive =   "setAAActive";
//@field String aaname:  Set accessibility name
LzView.prototype.setters.aaname =   "setAAName";
//@field String aadescription:  Set accessibility description
LzView.prototype.setters.aadescription =   "setAADescription";
//@field Number aatabindex:  Set accessibility tab order
LzView.prototype.setters.aatabindex =   "setAATabIndex";
//@field Boolean aasilent:  Set accessibility silencing/unsilencing
LzView.prototype.setters.aasilent =   "setAASilent";

// Avoid polluting _root
(function () {
    var s = {layout: "setLayout"};
    s.__proto__ = LzNode.prototype.__LZdelayedSetters;
    LzView.prototype.__LZdelayedSetters = s;

    var s = {clickregion: true };
    s.__proto__ = LzNode.prototype.earlySetters;
    LzView.prototype.earlySetters = s;
})();

//@field Number xoffset: A value to be added to the
//<attribute>x</attribute> position of this view before drawing
//it. This affects the apparent rotation point of the view, as well as
//its apparent <attribute>x</attribute> position. It does not affect the view's width or its
//internal coordinate system.
LzView.prototype.setters.xoffset =  "__LZsetXOffset";
//@field Number yoffset: A value to be added to the <attribute>y</attribute> position of this view
//before drawing it. This affects the apparent rotation point of the view, as
//well as its apparent <attribute>y</attribute> position. It does not affect the view's width or its
//internal coordinate system.
LzView.prototype.setters.yoffset = "__LZsetYOffset";

LzView.prototype.getters.width =   "getWidth";
LzView.prototype.getters.height =   "getHeight";


LzView.prototype.visible =   true;
LzView.prototype.__LZvisibleSet =   null;
LzView.prototype.__LZvizO = true;
LzView.prototype.__LZvizDat = true;
LzView.prototype.__LZvizLoad= true;

LzView.prototype.opacity =   1;
LzView.prototype.bgcolor =   null;
LzView.prototype.x =   0;
LzView.prototype.y =   0;
LzView.prototype.rotation =   0;
LzView.prototype.width =   0;
LzView.prototype.height =   0;
//@field Number unstretchedwidth: If stretches is not set to none, the width
//that this view would be if it weren't stretched. This attribute can be used
//to scale a view by a percentage of its original size, or to determine the
//aspect ratio for a view.
LzView.prototype.unstretchedwidth =   0;
//@field Number unstretchedheight: If stretches is not set to none, the height
//that this view would be if it weren't stretched. This attribute can be used
//to scale a view by a percentage of its original size, or to determine the
//aspect ratio for a view.
LzView.prototype.unstretchedheight =   0;
LzView.prototype.subviews =   [];
LzView.prototype.__LZclickregion =  "LzMouseEvents";

LzView.prototype.xoffset =   0;
LzView.prototype.yoffset =   0;
LzView.prototype.__LZrsin = 0;
LzView.prototype.__LZrcos = 1;
LzView.prototype.__LZcaloffset = false;

//deprecated for Krank release
LzView.prototype.xscale =   1;
LzView.prototype.yscale =   1;
//end deprecated slots

//@field Number totalframes: The total number of frames for this view's
//resource.
LzView.prototype.totalframes =   0;
LzView.prototype.frame =   0;

//deprecated
LzView.prototype.loadperc =   0;
//@field Number framesloadratio: For views whose resource is loaded at runtime,
//the ratio of the loaded frames to the total frames. This is a number between
//zero and 1.
LzView.prototype.framesloadratio =   0;
//@field Number loadratio: For views whose resource is loaded at runtime,
//ratio of the loaded bytes to the total bytes. This is a number between 
//zero and 1.
LzView.prototype.loadratio =   0;

//@field Boolean hassetwidth: If true, then setWidth() has been called on this
//view, and the view will not be sized to its contents. 
LzView.prototype.hassetheight = false;
//@field Boolean hassetheight: If true, then setHeight() has been called on this
//view, and the view will not be sized to its contents. 
LzView.prototype.hassetwidth = false;

//need quick check for viewness
LzView.prototype.__LZisView = true;


//------------------------------------------------------------------------------
// this creates a specific child layout for this view. When called a second time
// the first layout will be replaced by the second.
// @param Object layoutobj: A dictionary of attributes that describe the
// layout, where the class key specifies the class of the layout and the
// rest are passed as attributes for the layout.  By default the class will
// be <api>simplelayout</api> if not given.
// For example: <code>{'class': 'wrappinglayout', axis: 'x', spacing: 20}</code>
// To remove the previously set layout, use <code>{'class': 'none'}</code>
// (Note that you must use <code>'class'</code> as the key, because
// <code>class</code> is a keyword reserved for future use.)
//------------------------------------------------------------------------------
LzView.prototype.setLayout = function ( layoutobj ){

    if (!this.isinited) {
        this.__LZstoreAttr( layoutobj , "layout" );
        return;
    }

    var classname = layoutobj['class'];
    if ( classname == null ) {
        classname = 'simplelayout';
    }
    if ( this.__LZlayout ){
        this.__LZlayout.destroy();
    }
    if (classname != 'none') {
        var o = {};
        for (var i in layoutobj) {
           if (i != 'class')  {
               o[i] = layoutobj[i];
           }
        }

        this.__LZlayout = new _root[ classname ] (this, o);
   }
 }

//------------------------------------------------------------------------------
// Sets the font name for this view. The font information (font, fontsize, and
// fontstyle) will cascade down the runtime view hierarchy.
// @keywords private
// @param String val: The value for the new font name
//------------------------------------------------------------------------------
LzView.prototype.setFontName = function ( val ,prop ){
    this.fontname = val ;
}

//@field Boolean _setrescwidth: If true, the view does not set its
//resource to the width given in a call to
//<method>setAttribute</method>. By default, views do not scale their
//resource
LzView.prototype._setrescwidth = false;
//@field Boolean _setrescheight: If true, the view does not set its
//resource to the height given in a call to
//<method>setAttribute</method>. By default, views do not scale their
//resource
LzView.prototype._setrescheight = false;

//-----------------------------------------------------------------------------
// Search all subviews for a named property. For now, returns when it finds the
// first one. This is a width first search.
//
// @param String prop: named property
// @param val: value for that property
// @return LzView: the first subview whose property <param>prop</param> is set to val 'val' or null
// if none is found
//-----------------------------------------------------------------------------
LzView.prototype.searchSubviews = function ( prop , val) {
    var nextS = this.subviews.concat();

    while ( nextS.length > 0  ){
        var s = nextS;
        nextS = new Array;
        for (var i = s.length-1; i >=0; i-- ){
            var si = s[ i ];
            if (si[ prop ] == val ){
                return si;
            }
            var sis = si.subviews;
            for (var j = sis.length - 1; j>=0; j-- ){
                nextS.push( sis[j] );
            }
        }
    }
    return null;
}

//-----------------------------------------------------------------------------
// Search up parent views for a named property. For now, returns when it finds
// the first one.
//
// @param String prop: named property
// @return LzView: the first view which has a non-null value for <param>prop</param>
// or <i>null</i> if none is found
//-----------------------------------------------------------------------------
LzView.prototype.searchParents = function ( prop ){
    var sview = this;
    do{
        sview = sview.immediateparent;
        if (sview[ prop ] != null ){
            return sview;
        }
    }while ( sview != _root.canvas );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.searchimmediateparents = function ( prop ){
    if ( $debug ){
        Debug.warn( "LzView.searchimmediateparents is deprecated. Use LzView.searchParents instead.");
    }

    return this.searchParents( prop );
}


// FIRST_SUBVIEW_DEPTH: This is so that default objects (such as
// buttons, and in swf6 masks) can be attached above the view's
// subviews.  11 is an arbitrary number chosen by Adam
LzView.prototype.BUTTON_DEPTH = 2;
LzView.prototype.MASK_DEPTH = 3;
LzView.prototype.FIRST_SUBVIEW_DEPTH = 11;
// There can be up to two clips for each subview: background,
// foreground.  We have to leave room for them in the depth stack
LzView.prototype.CLIPS_PER_SUBVIEW = 2;
LzView.prototype.BACKGROUND_DEPTH_OFFSET = -1;
LzView.prototype.FOREGROUND_DEPTH_OFFSET = 0;
LzView.prototype.DOUBLE_CLICK_TIME = 500;
// A movieclip to catch right-click menu events on the canvas.
LzView.prototype.CANVAS_CONTEXT_MENU_DEPTH = 1; 

LzView.prototype.viewProperties ={ x:0, y:0, rotation:0, opacity:1 };

// There are initially no layouts.  If a view contains a layout, the
// layout constructor will create an array on the instance.
LzView.prototype.layouts = null;


//-----------------------------------------------------------------------------
// Releases all the layouts applied to this view.
// @deprecated
//-----------------------------------------------------------------------------
LzView.prototype.releaseLayouts = function( ) {
    if (this.layouts) {
        for ( var i = this.layouts.length - 1; i >= 0; i-- ){
            this.layouts[ i ].releaseLayout();
        }
    }
}

//-----------------------------------------------------------------------------
// This method associates a view with a named library element. If the
// view's <attribute>isVisible</attribute> property is true, the
// resource will be displayed when it is attached
//
// @param String resourceName: a string naming the id of the resource to attach
//-----------------------------------------------------------------------------
LzView.prototype.setResource = function ( resourceName ) {
    /*if (LzLoader.__LZmonitorState) {
        Debug.monitor(this, 'isloaded');
        Debug.monitor(this, 'play');
        Debug.monitor(this, 'playing');
        Debug.monitor(this, '__LZtracking');
        //Debug.monitor(this, '__lzcheckframe');
    }*/
    if ( resourceName.charAt(4) == ":" || resourceName.charAt(5) == ":" ){
        this.setSource( resourceName );
        return;
    }
    //@field resource: The name of this view's resource, or the URL the
    //resource was loaded from.

    this.__LZhaser = resourceName == "empty";

    if (this.__LZmovieClipRef != null ){
        this.tryReplaceResource( resourceName );
        return;
    }

    //this is easier than figuring out what the depth and name should be
    //from this context, but it's not necessary.
    var mc = this.immediateparent.attachResourceToChildView( resourceName,
                                                             this );
    this.setMovieClip( mc , resourceName );

    this.resource = resourceName;
    this.onresource.sendEvent( resourceName );
    return this.__LZmovieClipRef;
}



//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.tryReplaceResource = function ( rescname ){
    if ( this.subviews.length ){
        if ( $debug ){
            _root.Debug.write( this, "cannot set resource to", rescname, 
                                     "because it already has subviews." );
        }
        return false;
    }
    this._newrescname = rescname;
    this._newatp = this.__LZmovieClipRef._parent;
    this._newrname = this.__LZmovieClipRef._name;

    if ( this.__LZmcIsCallContext() ){
        if ( this.replRescDel == null ){
            this.replRescDel = new _root.LzDelegate( this, "doReplaceResource" );
        }
        _root.LzIdle.callOnIdle( this.replRescDel );
    } else {
        this.doReplaceResource();
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.doReplaceResource = function (){
    var reclick = this.__LZbuttonRef._visible;
    this.__LZbuttonRef = null;
    var newd = this.FIRST_SUBVIEW_DEPTH +
      (this.__LZdepth * this.CLIPS_PER_SUBVIEW) +
      this.FOREGROUND_DEPTH_OFFSET;
    this._newatp.attachMovie(  this._newrescname, this._newrname , newd );
    var mc = this._newatp[ this._newrname ];
    this.setMovieClip( mc , this._newrescname );

    if ( reclick ){
        this.setClickable( true );
    }

    this.resource = this._newrescname;
    this.onresource.sendEvent( this.resource );

    return true;
}

//-----------------------------------------------------------------------------
// This method is called when a view that has no resource needs one, either
// because a layout is being attached, or because a subview with a resource is
// being added.
//
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.makeContainerResource = function ( ) {
    //_root.Debug.write( "make container" );
    return this.setResource( "empty" );
}

//-----------------------------------------------------------------------------
// This method is called when a view that has no resource needs one, either
// because a layout is being attached, or because a subview with a resource is
// being added.
//
// @keywords private
//
// @param String mc: a reference to the flash movie clip that the view controls
//-----------------------------------------------------------------------------
LzView.prototype.setMovieClip = function ( mc , mcID) {
    this.__LZmovieClipRef = mc;
    //mc.tabIndex = _root.tabindexcounter++;
    if (this.masked) {
      this.applyMask();
    }

    var tfchg = this.totalframes != mc._totalframes;
    if ( tfchg ){
        this.totalframes = mc._totalframes;
        this.ontotalframes.sendEvent( this.totalframes );
    }

    if ( this.totalframes > 1 ){
        this.checkPlayStatus();
    }

    //@field Number resourcewidth: The width of the resource that
    //this view attached
    //@field Number resourceheight: The height of the resource that this
    //view attached
    var rt = _root.canvas.resourcetable[ mcID ];
    if ( rt ){
        this.resourcewidth = rt.width;
        this.resourceheight = rt.height;
    } else {
        this.resourcewidth = mc._width;
        this.resourceheight = mc._height;
    }

    //unrolled this loop because it is called frequently
    for( var prop in this.viewProperties){
        if (this[prop] != this.viewProperties[ prop ] ){
            this.setAttribute( prop , this[ prop ] );
        }
    }

    if ( !this.isinited ){
        this.__LZmovieClipRef._visible = false;
    } else if ( this.__LZvisibleSet != null ){
        this.__LZmovieClipRef._visible = this.visible;
    }


    //if no setwidth, then the view is sized to the resource
    if ( (!this.hassetwidth && this.resourcewidth > this.width ) ||
        (this._setrescwidth && this.unstretchedwidth <
                                                this.resourcewidth)){
        this.updateSize( "width" , this.resourcewidth  );
    }

    if ( (!this.hassetheight && this.resourceheight > this.height ) ||
            (this._setrescheight && this.unstretchedheight <
                                                this.resourceheight)){
        this.updateSize( "height" , this.resourceheight  );
    }

    //@event onload: Sent when the view attaches its resource.
    if ( ! this.__LZhaser ){
        this.onload.sendEvent( this.__LZmovieClipRef );
    }
}

//-----------------------------------------------------------------------------
// This method is usually called by a child view's <method>setResource</method>
// function. It is useful because the attaching tends to happen in the context
// of the parent view.
//
// @keywords private flashspecific
//
// @param resourceName: a string naming the resource to attach.  This is a resource defined with the <tagname>resource</tagname> tag.
// @param childView: a reference to the childView that the new resource will b
// attached to
//
// @return: a reference to the newly attached resource
//-----------------------------------------------------------------------------
LzView.prototype.attachResourceToChildView = function ( resourceName,
                                                        childView ){
    if (this.__LZmovieClipRef == null){
        this.makeContainerResource( );
    }
    if ( this.__LZsubUniqueNum == null ){
        this.__LZsubUniqueNum = 0;
    } else {
        this.__LZsubUniqueNum++;
    }
    var depth = this.FIRST_SUBVIEW_DEPTH + 
      (childView.__LZdepth * this.CLIPS_PER_SUBVIEW) + 
      this.FOREGROUND_DEPTH_OFFSET;

    var newmc = childView.attachMovieResourceToParent(this, depth, resourceName, this.__LZsubUniqueNum);

    //@event onaddsubresource: Sent when a child view adds a resource
    this.onaddsubresource.sendEvent( childView );

    return newmc;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.attachMovieResourceToParent = function (p, depth, resourceName, uid) {
    var instName = ("$m" + uid );
    var clip = p.__LZmovieClipRef;
    //clip.tabIndex = _root.tabindexcounter++;
    clip.attachMovie( resourceName, instName, depth);
    return clip[ instName ];
}



//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.attachBackgroundToChild = function ( forview ){
    if (this.__LZmovieClipRef == null){
        this.makeContainerResource( );
    }

    if ( this.__LZsubUniqueNum == null ){
        this.__LZsubUniqueNum = 0;
    } else {
        this.__LZsubUniqueNum++;
    }

    var atdepth = this.FIRST_SUBVIEW_DEPTH +
      (forview.__LZdepth * this.CLIPS_PER_SUBVIEW) +
      this.BACKGROUND_DEPTH_OFFSET;
    this.__LZmovieClipRef.attachMovie( "swatch", "$b" + this.__LZsubUniqueNum, atdepth );
    var mc = this.__LZmovieClipRef[ ("$b" + this.__LZsubUniqueNum )];
    forview.__LZbgRef = mc;

    forview.__LZbgRef._xscale = forview.width;
    forview.__LZbgRef._yscale = forview.height;

    if ( forview.__LZhasoffset ){
        forview.setX( forview.x );
        forview.setY( forview.y );
    } else {
        forview.__LZbgRef._x = forview.x;
        forview.__LZbgRef._y = forview.y;
    }

    forview.__LZbgRef._alpha = forview.opacity * 100 ;
    forview.__LZbgRef._rotation = forview.rotation;

    forview.__LZbgRef._visible = forview.visible && forview.isinited;
}

//-----------------------------------------------------------------------------
// This method should remove a view, its media, and any of its subviews.
// @keywords private
//
//------------------------------------------------------------------------------
LzView.prototype.destroy = function( recursiveCall ){
    if ( this.__LZdeleted ) return;
    this.bringToFront();

    if ( this.addedToParent ){
        var svs =  this.immediateparent.subviews;
        if (svs != null) {
            for( var i = svs.length - 1; i >= 0; i-- ){
                if ( svs[ i ] == this ){
                    svs.splice( i , 1 );
                    break;
                }
            }
        }
    }

    if (this.updatePlayDel) {
        this.updatePlayDel.unregisterAll();
        delete this.updatePlayDel;
    }
    if (this.doQueuedDel) {
        this.doQueuedDel.unregisterAll();
        delete this.doQueuedDel;
    }

    super.destroy( recursiveCall );

    if ( recursiveCall == true ) { return; }


    //figure out if the calling context is a movieclip that could get
    //removed here

    var careful = this.__LZmcIsCallContext();
    
    if ( ! careful ){
        this.__LZFinishDestroyOnIdle();
    }

    this.setVisible ( false );

    if ( this.addedToParent ){
        if ( this.immediateparent.__LZoutliewidth == this ) {
            this.immediateparent.__LZoutliewidth=null;
        }

        if ( this.immediateparent.__LZoutlieheight == this ) {
            this.immediateparent.__LZoutlieheight=null;
        }

        this.immediateparent.onremovesubview.sendEvent( this );
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.deleteView = function( recursiveCall ){
    if ( $debug ){
        _root.Debug.write( 'LzView.deleteView is deprecated.' +
                           ' Use LzView.destroy instead' );
    }
    this.destroy();
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.__LZmcIsCallContext = function (){
    var callcontext = _parent[ _name ];

    while ( callcontext && callcontext!= _root ){
        if ( callcontext._parent == this.__LZmovieClipRef ){
            return true;
        }
        callcontext = callcontext._parent;
    }

    return false;
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.__LZFinishDestroyOnIdle = function (){
    if ( this.__LZmovieClipRef != null ){
        //_root.Debug.write( "remove movieclip" );
        removeMovieClip( this.__LZmovieClipRef );
        delete this.__LZmovieClipRef;
    }

  if ( this.__LZbgRef != null ){
    removeMovieClip( this.__LZbgRef );
    delete this.__LZbgRef;
  }
}

//---------------------------------------------------------------------------
// This method sets the <attribute>visible</attribute> attribute of the view
// and also disables or re-enables any click region associated with the view.
// Note that a value of null is different from a value of false for this
// attribute.  See the description of the visible attribute for details.
//
// @param Boolean amVisible: boolean for visibility of view
//-----------------------------------------------------------------------------
LzView.prototype.setVisible = function( amVisible ) {
    this.__LZvisibleSet = amVisible;
    this.__LZupdateShown();
}

//-----------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.__LZupdateShown = function( ) {
    if ( this.__LZvisibleSet == null ){
        var shown = this.__LZvizO && this.__LZvizDat && this.__LZvizLoad;
    } else {
        var shown = this.__LZvisibleSet;
    }

    if ( shown != this.visible ){
        this.visible = shown;

        var ip = this.immediateparent;
        ip.__LZcheckwidth( this );
        ip.__LZcheckheight( this );

        this.__LZmovieClipRef._visible = shown && this.isinited;
        this.__LZbgRef._visible = shown && this.isinited;
        this.onvisible.sendEvent( shown );
    }
}

//------------------------------------------------------------------------------
// Sets the width of the view. If the view is set to stretch its resource, the
// resource will be resized to the new value. If the value 'null' is given for
// the new width, then the width is unset, and the width of the view will be
// the size of its contents.
// @param Number v: The new value for the width
//------------------------------------------------------------------------------
LzView.prototype.setWidth = function ( v ){
    if ( v == null ){
        this.hassetwidth = false;
        // expose proto method
        delete this.__LZcheckwidth;
        if ( this._setrescwidth ){
            // will be updated by reevaluateSize
            this.unstretchedwidth = null;
            // defaults
            this.xscale = 1;
            this.__LZmovieClipRef._xscale =  100;
            this.onxscale.sendEvent( 1 );
        }
        this.reevaluateSize( 'width' );
        return;
    }
    this.width = v;
    if ( this.pixellock ) v = Math.floor( v );
    if ( this._setrescwidth ){
        this.xscale = this.unstretchedwidth == 0 ? 100 : v/this.unstretchedwidth;
        this.__LZmovieClipRef._xscale = this.xscale * 100;
        //@event onxscale: Sent when a view which is resizing in the x
        //axis changes its width
        this.onxscale.sendEvent( this.xscale );
    } else {
        this.__LZcheckwidth = null;
        // If the view does not stretch, we have to resize the mask
        if ( this.masked ){
            this.__LZmaskClip._xscale = v;
        }
    }
    
    this.hassetwidth = true;
    
    this.__LZbgRef._xscale = v;
    this.setButtonSize( "width" , v );
    
    this.immediateparent.__LZcheckwidth( this );
    this.onwidth.sendEvent( v );
    
}

//------------------------------------------------------------------------------
// Sets the height of the view the given value. If the view is set to stretch
// its resource, the resource will be resized to the new value. If the value
// 'null' is given for the new height, then the height is unset, and the height
// of the view will be the size measured of its contents.
// @param Number v: The new value for the height
//------------------------------------------------------------------------------
LzView.prototype.setHeight = function ( v ){
    if ( v == null ){
        this.hassetheight = false;
        // expose proto method
        delete this.__LZcheckheight;
        if ( this._setrescheight ){
            // will be updated by reevaluateSize
            this.unstretchedheight = null;
            // defaults
            this.yscale = 1;
            this.__LZmovieClipRef._yscale =  100;
            this.onyscale.sendEvent( 1 );
        }
        this.reevaluateSize( 'height' );
        return;
    }
    this.height = v;
    if ( this.pixellock ) v = Math.floor( v );
    if ( this._setrescheight ){
        this.yscale = this.unstretchedheight == 0 ? 100 : v/this.unstretchedheight;
        this.__LZmovieClipRef._yscale = this.yscale * 100;
        //@event onyscale: Sent when a view which is resizing in the y
        //axis changes its height
        this.onyscale.sendEvent( this.yscale );
    } else {
        this.__LZcheckheight = null;
        // If the view does not stretch, we have to resize the mask
        if ( this.masked ){
            this.__LZmaskClip._yscale = v;
        }
    }
    this.hassetheight = true;
    
    this.setButtonSize( "height" , v );
    this.__LZbgRef._yscale = v;
    
    this.immediateparent.__LZcheckheight( this );
    this.onheight.sendEvent( v );
    
}


//------------------------------------------------------------------------------
// Sets the opacity for the view.  The opacity is a number between 0.0
// (transparent) and 1.0 (opaque).
// @param Number v: The new value for the opacity
//------------------------------------------------------------------------------
LzView.prototype.setOpacity = function ( v ){
    //@field Number opacity: The opacity value for the view,
    //a number between 0 and 1
    this.opacity = v;
    this.__LZmovieClipRef._alpha = 100*v;
    
    this.__LZbgRef._alpha = 100*v;

    //@event onopacity: Sent when a view changes its opacity
    this.onopacity.sendEvent( v );
    var coviz = this.__LZvizO;
    var newoviz = v != 0;
    if ( coviz != newoviz ){
        this.__LZvizO = newoviz;
        this.__LZupdateShown();
    }

}



//------------------------------------------------------------------------------
// Sets the <attribute>x</attribute> position of the view to the given value.
// @param Number v: The new value for <attribute>x</attribute>.
//------------------------------------------------------------------------------
LzView.prototype.setX = function ( v ){
    //@field Number x: The x position of the view
    this.x = v;
    if ( this.__LZhasoffset ){
        v -= ( this.xoffset * this.__LZrcos  -
               this.yoffset * this.__LZrsin );
    }
    
    if ( this.pixellock ) v = Math.floor( v );
    // Unlike swf5, no special case needed for masked 
    this.__LZmovieClipRef._x = v;
    this.__LZbgRef._x = v;
    
    this.immediateparent.__LZcheckwidth( this );
    this.onx.sendEvent( this.x );
}


//------------------------------------------------------------------------------
// Sets the <attribute>y</attribute> position for the view to the given value.
// @param Number v: The new value for <attribute>y</attribute>.
//------------------------------------------------------------------------------
LzView.prototype.setY = function ( v ){
    //@field Number y: The y position for the view
    this.y = v;
    if ( this.__LZhasoffset ){
        v -= ( this.xoffset * this.__LZrsin  +
               this.yoffset * this.__LZrcos );
    }
    
    if ( this.pixellock ) v = Math.floor( v );
    // Unlike swf5, no special case needed for masked 
    this.__LZmovieClipRef._y = v;
    this.__LZbgRef._y = v;
    this.immediateparent.__LZcheckheight( this );
    this.ony.sendEvent( this.y );
}


//------------------------------------------------------------------------------
// Sets the <attribute>rotation</attribute> for the view to the given value.
// @param Number v: The new value for <attribute>rotation</attribute>.
//------------------------------------------------------------------------------
LzView.prototype.setRotation = function ( v ){
    //@field Number rotation: The rotation value for the view (in degrees)
    //Value may be less than zero or greater than 360.
    this.rotation = v;
    this.__LZmovieClipRef._rotation = v % 360;
    this.__LZbgRef._rotation = v % 360;
    this.rotation = v;
    var rrad = Math.PI /180 * this.rotation;
    this.__LZrsin = Math.sin( rrad )
    this.__LZrcos = Math.cos( rrad )
    this.onrotation.sendEvent( v );

    if ( this.__LZhasoffset ){
        this.setX( this.x );
        this.setY( this.y );
    }

    this.immediateparent.__LZcheckwidth( this );
    this.immediateparent.__LZcheckheight( this );
}

//------------------------------------------------------------------------------
// Sets the <attribute>alignment</attribute> for the view to the given
// value. The alignment is based on the size of this view as compared
// to the size of the view's immediate parenbgRef.
// @param String align : The <attribute>alignment</attribute> for the view. This is one of "left",
// "center", and "right"
//------------------------------------------------------------------------------
LzView.prototype.setAlign = function ( align ){
    if ( align == "left" ) {
        this.releaseConstraint('x');
        this.setAttribute('x', 0);
    } else if ( align == "center" ){
        var f = function (){
            this.setAttribute( "x" , this.immediateparent.width /2
                                - this.width /2);
        }
        this.setPosConstraint( this.immediateparent , f , "width" );
    } else if ( align == "right" ){
        var f = function (){
            this.setAttribute( "x" , this.immediateparent.width
                                 - this.width );
        }
        this.setPosConstraint( this.immediateparent , f , "width" );
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.__LZsetXOffset = function ( xoff ){
    this.xoffset = xoff;
    this.__LZhasoffset = true;
    this.setX( this.x );
    this.setY( this.y );
    this.onxoffset.sendEvent( xoff );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.__LZsetYOffset = function ( yoff ){
    this.yoffset = yoff;
    this.__LZhasoffset = true;
    this.setX( this.x );
    this.setY( this.y );
    this.onyoffset.sendEvent( yoff );
}

//------------------------------------------------------------------------------
// Returns an Object with x, y, width, and height properties that are the
// coordinates of the view's bounding box in its immediateparent's coordinate
// system. The Laszlo view object uses a relatively simple notion for its
// coordinate system. Note that this function doesn't necessarily return the
// true bounding box of the view, but a box surrounding the view, since this
// method respects a set width and/or height and ignores subviews that appear
// left or above of the view's 0,0 point.
// The xoffset and yoffset properties of the bounds object are the distance
// between the view's x or y property and the top or left of the bounding
// box.
// @return Object: An object with x, y, width, height, xoffset and yoffset
// properties that describes the bounding box of the view.
//------------------------------------------------------------------------------
LzView.prototype.getBounds = function (  ){
    var mtrix = [ -this.xoffset, -this.yoffset,
                   this.width-this.xoffset , -this.yoffset ,
                  -this.xoffset, this.height - this.yoffset ,
                   this.width - this.xoffset, this.height - this.yoffset ,
                   this.rotation , this.x , this.y] ;
                   //last three entries are just to track staleness

    var i = mtrix.length - 1;
    while ( mtrix[ i ] == this.__LZlastmtrix[ i ] ){
        if ( i-- == 0 ) {
            return this.__LZstoredbounds;
        }
    };


    var o = {};

    for ( var i = 0; i < 8; i +=2 ){
        var x = mtrix[ i ];
        var y = mtrix[ i+1 ];
        var cx = x * this.__LZrcos  - y * this.__LZrsin;
        var cy = x * this.__LZrsin  + y * this.__LZrcos;
        //_root.Debug.write( i +":" + cx , cy );

        if ( o.xoffset == null || o.xoffset > cx ){
            o.xoffset = cx;
        }
        if ( o.yoffset == null || o.yoffset > cy ){
            o.yoffset = cy;
        }
        if ( o.width == null || o.width < cx ){
            o.width = cx;
        }
        if ( o.height == null || o.height < cy ){
            o.height = cy;
        }
    }
    o.width -= o.xoffset;
    o.height -= o.yoffset;

    o.x = this.x + o.xoffset;
    o.y = this.y + o.yoffset;

    this.__LZstoredbounds = o;
    this.__LZlastmtrix = mtrix;

    return o;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.getBounds.dependencies = function ( who , self ){
    return [ self, 'rotation' , self, 'x' , self , 'y' , self , 'width' ,
             self , 'height' ];
}

//------------------------------------------------------------------------------
// Sets the vertical alignment for the view to the given value. The alignment
// is based on the height of this view as compared to the height of the view's
// <attribute>immediateparent</attribute>.
// @param String valign : The vertical alignment for the view. This is one of "top",
// "middle", and "bottom"
//------------------------------------------------------------------------------
LzView.prototype.setValign = function ( valign ){
    if ( valign == "top" ) {
        this.releaseConstraint('y');
        this.setAttribute('y', 0);
    } else if ( valign == "middle" ){
        var f = function (){
            this.setAttribute( "y" , this.immediateparent.height /2
                                - this.height /2);
        }
        this.setPosConstraint( this.immediateparent , f ,"height" );
    } else if ( valign == "bottom" ){
        var f = function (){
            this.setAttribute( "y" , this.immediateparent.height
                                - this.height);
        }
        this.setPosConstraint( this.immediateparent , f , "height" );
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.setPosConstraint = function ( v , f , widthorheight ){
    var d = [ v , widthorheight  , this , widthorheight ];
    this.applyConstraint( widthorheight == "width" ? "x" : "y" , f , d );
}

//------------------------------------------------------------------------------
// Sets the color of the view (the view's resource and any subviews) to the
// the color given. This will completely override any color information in the
// view or subview resources. Use the view method
// <method>setColorTransform</method> to tint a view.
// @param Integer c: A color in rgb format; for example, 0xff0000 is red.
//------------------------------------------------------------------------------
LzView.prototype.setColor = function ( c ){
    this.fgcolor = c;
    this.getColorObj().setRGB( c );
}


//------------------------------------------------------------------------------
// Gets the color of the view (the view's resource and any subviews) view as
// as set with setColor().
// Returns A color in rgb format; for example, 0xff0000 is red.
//------------------------------------------------------------------------------
LzView.prototype.getColor = function (){
    return this.getColorObj().getRGB();
}


//-----------------------------------------------------------------------------
// color transforms everything contained in the view (except the
// background) by the transformation dictionary given in <param>o</param>.  The dictionary has
// the following possible keys:
//
// o.ra: percentage alpha for red component (-100 to 100);
// o.rb: offset for red component (-255 to 255);
// o.ga: percentage alpha for green component (-100 to 100);
// o.gb: offset for green component (-255 to 255);
// o.ba: percentage alpha for blue component (-100 to 100);
// o.bb: offset for blue component (-255 to 255);
// o.aa: percentage overall alpha (-100 to 100);
// o.ab: overall offset (-255 to 255);
//-----------------------------------------------------------------------------
LzView.prototype.setColorTransform = function ( o ){
    this.getColorObj().setTransform( o );
}


//-----------------------------------------------------------------------------
// Returns an object that represents the color transformation currently applied
// to the view. The color transform object has the following possible keys
//
// o.ra: percentage alpha for red component (-100 to 100);
// o.rb: offset for red component (-255 to 255);
// o.ga: percentage alpha for green component (-100 to 100);
// o.gb: offset for green component (-255 to 255);
// o.ba: percentage alpha for blue component (-100 to 100);
// o.bb: offset for blue component (-255 to 255);
// o.aa: percentage overall alpha (-100 to 100);
// o.ab: overall offset (-255 to 255);
//-----------------------------------------------------------------------------
LzView.prototype.getColorTransform = function (){
    return this.getColorObj().getTransform( );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.getColorObj = function (){
    if ( this.__LZcolorobj == null ){
        if ( this.__LZmovieClipRef == null ){
            this.makeContainerResource();
        }
        this.__LZcolorobj = new Color( this.__LZmovieClipRef );
    }

    return this.__LZcolorobj;
}


//------------------------------------------------------------------------------
// Returns the width of the view.
// @keywords protected 
// @deprecated
//------------------------------------------------------------------------------
LzView.prototype.getWidth = function (){
    return this.width;
}

//------------------------------------------------------------------------------
// Returns the height of the view.
//
// @keywords protected 
// @deprecated
//------------------------------------------------------------------------------
LzView.prototype.getHeight = function (){
    return this.height;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.__LZcheckSize = function (){
    var f = function ( sview ){
        if ( sview.addedToParent ) {
            var arguments_callee = arguments.callee;
            var axis = arguments_callee.axis;

            if ( sview.__LZhasoffset || sview.rotation != 0 ){
                var bobj = sview.getBounds();
            } else {
                var bobj = sview;
            }
            var ss = bobj[ arguments_callee.xory ] + bobj[ axis ];

            //calculating unstretchedsize (for stretches) or just size?
            var ts = this[ "_setresc" + axis ] ?
                     this[ "unstretched" + axis ] : this[axis];

            if ( ss > ts && sview.visible ){
                this[ "__LZoutlie" + axis ] = sview;
                this.updateSize( axis , ss);
            } else if ( this[ "__LZoutlie" + axis ] == sview
                        && ( ss < ts || ! sview.visible ) ){
                //uhoh -- we need to recheck everything
                this.reevaluateSize( axis );
            }
        }
    }

    return f;
}

//The checkWidth and checkHeight functions handle changes in this view's
//subviews. The children call these functions on their immediateparents when
//they change x, y, width, height, or visibility. A view which doesn't care
//about changes in the size of its contents (because it has a set size and it's
//not stretching) puts null in this slot, so that it doesn't process calls from
//its subviews.
// 
// N.B.: these internal methods do not obey the traditional camel-casing
// because their names are often constructed on the fly.  Cf.,
// updateSize
LzView.prototype.__LZcheckwidth = LzView.__LZcheckSize();
// Manual closure
LzView.prototype.__LZcheckwidth.axis ="width";
LzView.prototype.__LZcheckwidth.xory ="x";
// Name closure for debug or profile
if ($debug) {
    LzView.prototype.__LZcheckwidth.name = 'LzView.prototype.__LZcheckwidth';
}
if ($profile) {
    LzView.prototype.__LZcheckwidth.name = 'LzView.prototype.__LZcheckwidth';
}

LzView.prototype.__LZcheckheight = LzView.__LZcheckSize();
// Manual closure
LzView.prototype.__LZcheckheight.axis ="height";
LzView.prototype.__LZcheckheight.xory ="y";
// Name closure for debug or profile
if ($debug) {
    LzView.prototype.__LZcheckheight.name = 'LzView.prototype.__LZcheckheight';
}
if ($profile) {
    LzView.prototype.__LZcheckheight.name = 'LzView.prototype.__LZcheckheight';
}

//-----------------------------------------------------------------------------
// to do: add dependencies so this can be used as a constraint
// @keywords private
//-----------------------------------------------------------------------------
LzView.measureSize = function()
{
    return function() {
        var axis = arguments.callee.axis;

        var w = this[ "resource" + axis ];

        for ( var i= this.subviews.length-1; i >= 0; i-- ){
            var sv = this.subviews[ i ];
            var svs = sv[ axis == "width" ? "x" : "y" ] + sv[ axis ];
            if ( sv.visible && svs > w ){
                w = svs;
            }
        }
        return w;
    }
}

//-----------------------------------------------------------------------------
// reports the width of the contents of the view
// (not supported in a constraint expression)
//-----------------------------------------------------------------------------
LzView.prototype.measureWidth = function () {}
LzView.prototype.measureWidth = LzView.measureSize();
// Manual closure
LzView.prototype.measureWidth.axis ="width";
// Name closure for debug or profile
if ($debug) {
    LzView.prototype.measureWidth.name = 'LzView.prototype.measureWidth';
}
if ($profile) {
    LzView.prototype.measureWidth.name = 'LzView.prototype.measureWidth';
}

//-----------------------------------------------------------------------------
// reports the height of the contents of the view
// (not supported in a constraint expression)
//-----------------------------------------------------------------------------
LzView.prototype.measureHeight = function () {}
LzView.prototype.measureHeight = LzView.measureSize();
// Manual closure
LzView.prototype.measureHeight.axis ="height";
// Name closure for debug or profile
if ($debug) {
    LzView.prototype.measureHeight.name = 'LzView.prototype.measureHeight';
}
if ($profile) {
    LzView.prototype.measureHeight.name = 'LzView.prototype.measureHeight';
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.updateSize = function ( axis , newsize ){
    if ( this[ "_setresc" + axis ] ){
        this[ "unstretched" + axis ] = newsize;

        if ( this[ 'hasset' + axis ] ){
            var scalevar = (axis == "width" ? "xscale" : "yscale");
            this[ scalevar ] = this[ axis ] / this[ "unstretched" + axis ]

            this.__LZmovieClipRef[ "_" + scalevar ] = 100 * this[ scalevar ];
        }

        this['onunstretched' + axis ].sendEvent( this[ "unstretched" + axis ] );
    }

    var sc = "_" + (axis == "width" ? "x" : "y" ) + "scale";
    if ( this.masked ){
        // If the view does not stretch, we have to resize the mask
        if ( !this[ '_setresc' + axis ] ){
            this.__LZmaskClip[ sc ] = newsize;
        }

    }
    if ( !this[ 'hasset' + axis ] ){
        this[ axis ] = newsize;
        this[ "on" + axis ].sendEvent( newsize );

        this.immediateparent[ "__LZcheck" + axis ]( this );

        this.__LZbgRef[ sc ] = newsize;
    }

    this.setButtonSize( axis, newsize );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.reevaluateSize = function ( ia ){
    //if called with no args, check both
    if ( ia == null ){
        var axis = "height";
        this.reevaluateSize( "width" );
    } else {
        var axis = ia;
    }

    if ( this[ "hasset" + axis ] && ! this[ '_setresc' + axis ] ) return;

    //use 'unstretchedwidth' for stretches
    var o = this[ "_setresc" + axis ] ? this[ "unstretched" + axis ] :
                                        this[ axis ];

    var w =  this[ "resource" + axis ] || 0;
    //var w =  this[ "resource" + axis ] ;
    this[ "__LZoutlie" + axis ] = this;

    for ( var i= this.subviews.length-1; i >= 0; i-- ){
        var sv = this.subviews[ i ];

        if ( sv.__LZhasoffset || sv.rotation != 0 ){
            var b = sv.getBounds();
            var svs = b[ axis == "width" ? "x" : "y" ] + b[ axis ];
        } else {
            var svs = sv[ axis == "width" ? "x" : "y" ] + sv[ axis ];
        }
        if ( sv.visible && svs > w ){
            w = svs;
            this[ "__LZoutlie" + axis ] = sv;
        }
    }

    if ( o != w ){
        this.updateSize( axis ,  w );
    }
}

//-----------------------------------------------------------------------------
// Since a view does not re-measure the size of its resource once that resource
// has loaded, this method is provided to force the view to update its size, 
// taking into account the current size of its resource. 
//-----------------------------------------------------------------------------
LzView.prototype.updateResourceSize = function ( ){
    this.__LZmovieClipRef._xscale = 100;
    this.__LZmovieClipRef._yscale = 100;
    this.resourcewidth = this.__LZmovieClipRef._width;
    this.resourceheight = this.__LZmovieClipRef._height;
    this.__LZmovieClipRef._xscale = this.xscale * 100;
    this.__LZmovieClipRef._yscale = this.yscale * 100;
    this.reevaluateSize();
}


//------------------------------------------------------------------------------
// This method is used to set a view's property to match that of
// another view -- potentially one in another coordinate system.
//
// @param String prop: a string specifying the property to set.
//              known properties are: x, y, width, and height
// @param LzView refView: the reference view for the transformation
//------------------------------------------------------------------------------
LzView.prototype.setAttributeRelative = function(prop, refView) {
    var tLink = this.getLinkage( refView );
    var val = refView[ prop ];
    if (prop == "x" || prop =="y" ){
        //these properties need to account for both offset and scale
        tLink.update ( prop );
        this.setAttribute (prop ,  (  val - tLink.offset[prop] )
                                / tLink.scale[prop] );
    }else if ( prop == "width" || prop == "height" ){
        //these properties account only for scale
        var axis = prop == "width" ? "x" : "y"
        tLink.update ( axis )
        this.setAttribute ( prop, val / tLink.scale[ axis ] );

    }else{
        //not yet implemented: rotation, alpha...
    }
}

LzView.prototype.setAttributeRelative.dependencies = function( who,self, prop ,
                                                                refView ){
    //this routine is unused.
    //getAttributeRelative is the routine that is used in dependencies
    //"who" below should refer to "self"
    var tLink = who.getLinkage( refView );
    var pass = 2;
    var d = [] ;

    if ( prop == "width" ){
        var ax = "x";
    } else if ( prop == "height" ){
        var ax = "y";
    } else {
        var ax = prop;
    }

    var sax = ax == "x" ? "width" : "height";

    while ( pass ){
        if ( pass == 2 ){
            var carr = tLink.uplinkArray;
        } else {
            var carr = tLink.downlinkArray;
        }
        pass--;
        for ( var i = carr.length-1; i >= 0; i-- ){
            d.push ( carr[ i ] , ax);
            if ( d[ "_setresc" + sax ] ){
                //view stretches; affects relative props
                d.push( [ carr[ i ] , sax ] );
            }
        }
    }
    return d;
}


//------------------------------------------------------------------------------
// This method answers the question: what should this view set its
// width/height/x/y to in order to appear to have the same value for that
// attribute as the reference view?
//
// @param String prop: a string specifying the property to return.
//              known properties are: x, y, width, and height
// @param LzView refView: the reference view for the transformation
//------------------------------------------------------------------------------
LzView.prototype.getAttributeRelative = function(prop, refView ) {
    var tLink = this.getLinkage( refView );
    if ( ! this.__LZmovieClipRef ){
        this.makeContainerResource();
    }
    if ( ! refView.__LZmovieClipRef ){
        refView.makeContainerResource();
    }

    if (prop == "x" || prop =="y" ){
        tLink.update ( prop );
        return tLink.offset[prop] + tLink.scale[prop] * this.getProp( prop );
    }else if ( prop == "width" || prop == "height" ){
        var axis = prop == "width" ? "x" : "y"
        tLink.update ( axis )
        return tLink.scale[axis] * this.getProp( prop );

    }else{
        //not yet implemented: rotation, alpha...
    }
}

LzView.prototype.getAttributeRelative.dependencies = function( who,self, prop ,
                                                                refView ){
    var tLink = self.getLinkage( refView );
    var pass = 2;
    var d = [ self , prop ] ;

    if ( prop == "width" ){
        var ax = "x";
    } else if ( prop == "height" ){
        var ax = "y";
    } else {
        var ax = prop;
    }

    var sax = ax == "x" ? "width" : "height";

    while ( pass ){
        if ( pass == 2 ){
            var carr = tLink.uplinkArray;
        } else {
            var carr = tLink.downlinkArray;
        }
        pass--;
        for ( var i = carr.length-1; i >= 0; i-- ){
            var ci = carr[ i ];
            d.push ( ci , ax);
            if ( ci[ "_setresc" + sax ] ){
                //view stretches; affects relative props
                d.push( ci , sax );
            }
        }
    }

    return d;
}

LzView.prototype.__LZviewLinks = null;

//-----------------------------------------------------------------------------
// This method creates a linkage that can provide transformations
// between views.  Once created, linkages are stored for reuse as a
// hash, with a pointer to the reference view serving as the key.
// @deprecated See note regarding <method>getAttributeRelative</method>.
//
// @keywords private
//
// @param refView: the view to which to create a linkage.
//-----------------------------------------------------------------------------
LzView.prototype.getLinkage = function( refView ) {
    if ( this.__LZviewLinks == null ){
        this.__LZviewLinks = new Object;
    }

    var uid = refView.getUID();
    if (this.__LZviewLinks[ uid ] == null ){
        //cache links for quick access
        this.__LZviewLinks[ uid ] = new _root.LzViewLinkage(this, refView );
    }

    return this.__LZviewLinks[ uid ];
}

//-----------------------------------------------------------------------------
// Sets the <attribute>xscale</attribute> of the view to the given value
// @deprecated Use the view property <code>unstretchedwidth</code> instead.
// @param Number val: the new _xscale for the view
//-----------------------------------------------------------------------------
LzView.prototype.setXScale = function( val ) {
    if ( $debug ){
        _root.Debug.warn( "LzView.setXScale has been deprecated. "+
                          "Use the view property unstretchedwidth instead." );
    }
    if ( ! this._setrescwidth ) {
        this.stretchResource( "width" );
    }
    this.setWidth ( this.unstretchedwidth * val );
}

//-----------------------------------------------------------------------------
// Sets the <attribute>yscale</attribute> of the view to the given value
// @deprecated Use the view property <code>unstretchedheight</code> instead.
// @param Number val: the new yscale for the view
//-----------------------------------------------------------------------------
LzView.prototype.setYScale = function( val ) {
    if ( $debug ){
        _root.Debug.warn( "LzView.setYScale has been deprecated. "+
                          " Use the view property unstretchedheight instead." );
    }
    if ( ! this._setrescheight ) {
        this.stretchResource( "height" );
    }
    this.setHeight ( this.unstretchedheight * val );
}

//-----------------------------------------------------------------------------
// This method returns the position of the mouse relative to this view.
//
// @param xory: a string ("x" | "y") specifying which axis to return
// @return Number: The position of the mouse relative to this view.
//-----------------------------------------------------------------------------
LzView.prototype.getMouse = function( xory ) {
    if ( ! this.__LZmovieClipRef ) { this.makeContainerResource() };
    return this.__LZmovieClipRef["_" + xory + "mouse" ];
}

LzView.prototype.getMouse.dependencies = function( ) {
    return [ _root.LzIdle, "idle" ];
}

//-----------------------------------------------------------------------------
// returns true if the point is contained within the view.
//
// @param Number x: an x value relative to the this view's coordinates
// @param Number y: an y value relative to the this view's coordinates
// @return Boolean: boolean indicating whether or not the point lies within the view
//------------------------------------------------------------------------------
LzView.prototype.containsPt = function( x,y ) {
   return (((this.getAttribute("height")>= y) && (y >= 0)) &&
                ((this.getAttribute("width")>= x) && (x >= 0)));
}

//-----------------------------------------------------------------------------
// This method makes this view the frontmost subview of this view's parent.
//
//-----------------------------------------------------------------------------
LzView.prototype.bringToFront = function ( ){
    //this is really a function of the parent view
    this.immediateparent.changeOrder ( this , 1);
}

//------------------------------------------------------------------------------
// Returns an array of subviews in depth order
// @return [LzView]: An array of this view's subviews in depth order
//------------------------------------------------------------------------------
LzView.prototype.getDepthList = function (){
    var a = [];
    for ( var i = this.subviews.length-1; i >= 0; i-- ){
        var sv = this.subviews[ i ];
        a[ sv.__LZdepth ] = sv;
    }
    return a;
}

//------------------------------------------------------------------------------
// Puts this view behind one of its siblings.
// @param LzView v: The view this view should go in front of. If the passed 
// view is null or not a sibling, the method has no effect.
// @return Boolean: Method returns true if the operation is successful.
//------------------------------------------------------------------------------
LzView.prototype.sendBehind = function ( v ){
    return this.immediateparent.changeOrder( this, -1, v , false );
}

//------------------------------------------------------------------------------
// Puts this view in front of one of its siblings.
// @param LzView v: The view this view should go in front of. If the passed 
// view is null or not a sibling, the method has no effect.
// @return Boolean: Method returns true if the operation is successful.
//------------------------------------------------------------------------------
LzView.prototype.sendInFrontOf = function ( v ){
    return this.immediateparent.changeOrder( this, 1, v , true );
}

//-----------------------------------------------------------------------------
// moves the given child view to the front.
//
// @keywords flashspecific private
//
// @param cView: a reference to the child view to be moved to the front
//-----------------------------------------------------------------------------
LzView.prototype.changeOrder = function (cView , dir , fv , inf ){
    var dl = this.getDepthList();
    var dll = dl.length;
    var sw;
    if ( fv ){
        //need to figure out which direction we're going in
        var foundcView = false;
        var foundfv = false;
        var dir = 0;
        for ( var i = 0; i < dll; i++ ){
            var v = dl[ i ];
            if ( !v ) {
                continue;
            } else if ( v == cView ){
                if ( foundfv ) {
                    dir = -1;
                    if ( inf ){
                        sw = fv;
                    } else {
                        sw = heldf;
                    }
                    break;
                }
                foundcView = true;
            } else if (v == fv ){
                if ( foundcView ) {
                    dir = 1;
                    if ( inf ){
                        sw = this.__LZfindNextNonNull( dl , i , 1 );
                    } else {
                        sw = fv;
                    }
                    break;
                }
                foundfv = true;
                if (!inf ){
                    var heldf = this.__LZfindNextNonNull( dl , i , -1 );
                }
            }
        }
    }

    if ( dir == 0) return false;

    var next = dir;
    var nv;
    if ( cView.__LZmovieClipRef == null ){
        cView.makeContainerResource();
    }

    var cVMv = this.getAttachPoint( cView );

    var reback = cView.__LZisBackgrounded;
    var menu = null;
    if (reback) {
        menu = cView.__LZbgRef.menu;
    }
    cView.removeBG();
    while (cView.__LZdepth + next < dl.length  && cView.__LZdepth+next >= 0 ){
        var d = cView.__LZdepth;
        nv = dl[ d+next ];
        if ( nv == null ){
            //there's no view there. We have to skip it.
            next += dir;
            continue;
        } else if ( nv == sw ){
            break;
        }

        var movnv = this.getAttachPoint( nv );

        if ( !movnv ){
            nv.makeContainerResource();
            movnv = this.getAttachPoint( nv );
        }
        movnv.swapDepths( cVMv );

        nv.__LZdepth = d;
        cView.__LZdepth = d+next;
        next = dir;

        if ( nv.__LZisBackgrounded ){
            var menu2 = nv.__LZbgRef.menu;
            nv.removeBG();
            nv.applyBG();
            nv.__LZbgRef.menu = menu2;
        }
    }

    if ( reback ){
        cView.applyBG();
        cView.__LZbgRef.menu = menu;
    }
    return true;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.__LZfindNextNonNull = function ( arr, pos , dir ){
    for ( var i = pos + dir; i >= 0 && i < arr.length; i += dir ){
        if ( arr[ i ] != null ){
            return arr[ i ];
        }
    }
    return null;
}

//------------------------------------------------------------------------------
// Gets the movieclip of childview which is the direct child of this view's movieclip
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.getAttachPoint = function ( cView ){
    if ( ! this.__LZmovieClipRef || ! cView.__LZmovieClipRef ) return;
    var mcr = cView.__LZmovieClipRef;
    while ( mcr._parent != this.__LZmovieClipRef ){
        var mcr = mcr._parent;
        if ( mcr == _root ){
            return null;
        }
    }
    return mcr;
}

//-----------------------------------------------------------------------------
// This method makes this view the hindmost subview of this view's parent.
//-----------------------------------------------------------------------------
LzView.prototype.sendToBack = function ( ){
    //this is really a function of the parent view
    this.immediateparent.changeOrder ( this , -1);
}

//-----------------------------------------------------------------------------
// For resources which have more than one frame, this function sets
// the view
// to display the numbered resource. For Flash assets, resource numbers
// correspond to
// movieclip frames.
//
// @param Integer n: the number of the resource to show
//-----------------------------------------------------------------------------
LzView.prototype.setResourceNumber = function( n ) {
    //_root.Debug.write('setResourceNumber', n, this, this.playing)

    // prevent play status tracking from running if the frame was set oninit, like in windowframe class
    this.__lzcheckframe = n;

    this.stop( n );
    /*
    if ( this.__LZmovieClipRef && !this.__fixedSizeResource ){
        var oscale = this.__LZmovieClipRef._xscale;
        this.__LZmovieClipRef._xscale = 100;
        if ( this.resourcewidth != this.__LZmovieClipRef._width ){
            this.resourcewidth = this.__LZmovieClipRef._width;
            this.reevaluateSize( 'width' );
        } else {
            this.__LZmovieClipRef._xscale = oscale;
        }

        var oscale = this.__LZmovieClipRef._yscale;
        this.__LZmovieClipRef._yscale = 100;
        if ( this.resourceheight != this.__LZmovieClipRef._height ){
            this.resourceheight = this.__LZmovieClipRef._height;
            this.reevaluateSize( 'height' );
        } else {
            this.__LZmovieClipRef._yscale = oscale;
        }
    }
    */
}

//-----------------------------------------------------------------------------
// Sets the view so that it stretches its resource in the given axis so that
// the resource is the same size as the view. The has the effect of distorting
// the coordinate system for all children of this view, so use this method
// with care.
//
// @param String xory: If this is defined, set the resource to stretch only in the given axis ("width" or
// "height").  Otherwise set the resource to stretch in both axes.
//-----------------------------------------------------------------------------
LzView.prototype.stretchResource = function ( xory ){
    //TODO: Remove null, x, y options from here when components are moved
    if ( xory == null || xory == "x" || xory=="width" || xory=="both" ){
        this._setrescwidth = true;
        //deleting the slot in 'this' exposes the function in the prototype
        //so that it can be called.
        delete this.__LZcheckwidth;
        this.reevaluateSize( "width" );
    }

    if ( xory == null || xory == "y"|| xory=="height" || xory=="both" ){
        this._setrescheight = true;
        delete this.__LZcheckheight;
        this.reevaluateSize( "height" );
    }
}

//-----------------------------------------------------------------------------
// Gives the view a bgcolor that is the same size as the view.
//
// @param Integer bgc: The 0-FFFFFF number to be used for the new background color.
//------------------------------------------------------------------------------
LzView.prototype.setBGColor = function ( bgc ) {
    //@field Number bgcolor: The color of background of this view. Null if there is
    //no bgcolor. A number from 0 - 0xFFFFFF.
    if (bgc != null) {
        if ( $debug ){
            var bgcn = Number( bgc );
            if ( bgcn != bgcn ) {
                if ( $debug ){
                    _root.Debug.write( "Invalid value for bgcolor: " + 
                                       bgca,this );
                }
            }
        }
        this.bgcolor = Number(bgc);
        this.applyBG();
    } else {
        this.bgcolor = null;
        this.removeBG();
    }
    this.onbgcolor.sendEvent( bgc );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.removeBG = function () {
    if (this.__LZisBackgrounded ) {
        this.__LZbgRef.removeMovieClip();
        this.__LZbgRef = null;
        delete this.__LZbgColorO;
        this.__LZisBackgrounded = false;
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.applyBG = function () {
    if (! this.__LZisBackgrounded ) {
        this.immediateparent.attachBackgroundToChild( this );
        this.__LZisBackgrounded = true;
    }
    var bgc = this.bgcolor;
    if ( bgc != null ) {
        if ( this.__LZbgColorO == null ) {
            this.__LZbgColorO = new Color( this.__LZbgRef );
        }
        this.__LZbgColorO.setRGB( bgc );
    }
}

//-----------------------------------------------------------------------------
// This function allows the view to load its media from an URL at runtime.
// Resources loaded with <method>setSource</method> will replace compiled
// resources when the request is made.
//
// @param String source: The URL from which to load the resource for this view.
// @param String cache: If set, controls caching behavior. Choices are
// <code>none</code> , <code>clientonly</code> , <code>serveronly</code> , <code>both</code> (the default).
// @param String headers: Headers to send with the request, if any.
//-----------------------------------------------------------------------------
LzView.prototype.setSource = function ( source , cache, headers){
    //@event onerror: Sent when there is an error loading the view's resource.
    //The argument sent with the event is the error string sent by the server.
    //@event ontimeout: Sent when the request to load media for the view times
    //out
    _root.LzMakeLoad.apply( this , source , cache , headers );
    //after this call, setSource has been over-ridden
}

//-----------------------------------------------------------------------------
// Unloads media loaded with setSource or the source= attribute.
//
//-----------------------------------------------------------------------------
LzView.prototype.unload = function ( ){
    //this function really lives on the LzMakeLoad transformer
}


//-----------------------------------------------------------------------------
// This function applies the MakeMasked view transformer.
//
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.makeMasked = function ( ){
    this.masked = true;
    this.mask = this;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.removeMask = function () {
    // Debug.write(this, '.removeMask');
    this.__LZmovieClipRef.setMask(null);
    var mask = this.__LZmaskClip;
    mask.removeMovieClip();
    delete this.__LZmaskClip;
    this.masked = false;
    this.mask = null;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.applyMask = function (s) {
    if ( this.__LZmovieClipRef == null ){
        Debug.write("Cannot apply mask before resource has been attached in",
                    this);
        return;
    }
    var mc = this.__LZmovieClipRef;
    if (s) {
        var mask = mc.createEmptyMovieClip("$mcM", this.MASK_DEPTH);
    } else {
        var mask = mc.attachMovie("swatch", "$mcM", this.MASK_DEPTH);
    }
    //mask.tabIndex = _root.tabindexcounter++;
    // The mask is attached as a child of the view clip, so we just
    // align it with the clip and it will follow along if the clip is
    // scaled, translated or rotated.
    mask._x = 0;
    mask._y = 0;
    if (! s) {
        mask._width = this.width;
        mask._height = this.height;
    }
    this.__LZmaskClip = mask;
    this.masked = true;
    this.mask = this;
    mc.setMask(mask);
}

//-----------------------------------------------------------------------------
// @keywords private
//
//-----------------------------------------------------------------------------
LzView.prototype.__LZsetClickRegion = function ( cr ){
    this.__LZclickregion = cr;
}

//-----------------------------------------------------------------------------
// Makes a view clickable or not clickable.
//
// @param amclickable: Boolean indicating the view's clickability
//-----------------------------------------------------------------------------
LzView.prototype.setClickable = function ( amclickable ){
    //@event onmousedown: Sent when the mouse button goes down over a view
    //onmousedown is only sent by views which are clickable
    //@event onmouseup:Sent when the mouse button comes up after going down over
    //a clickable view This event is only sent by views which are clickable
    //@event onmouseupoutside: Sent when the mouse button comes up outside a
    //view This event is only sent by views which are clickable
    //after it went down over the view. This event is only sent by views which
    //are clickable
    //@event onclick:Sent when the mouse button comes up over a view after going
    //down over the same view. This event is only sent by views which are
    //clickable
    //@event onmouseover: Sent when the mouse button is up and the mouse rolls
    //over the view  This event is only sent by views which are clickable
    //@event onmouseout: Sent when the mouse button is up and the mouse rolls
    //off the view. This event is only sent by views which are clickable
    //@event onmousedragin: Sent when the mouse button went down over the view
    //and the button is still down when mouse rolls back inside the view.
    //This event is only sent by views which are clickable
    //@event onmousedragout: Sent when the mouse button went down over the view
    //and the button is still down when mouse rolls outside the view.
    //This event is only sent by views which are clickable
    //@event ondblclick: Sent when the mouse is doubleclicked over the view,
    //but only if anyone is listening for the event. A view which is clicked
    //twice in rapid succession, but has no delegates registered for its
    //ondblclick event, will simply send two click events.
    //The view's doubleclick time can be adjusted by setting its
    //DOUBLE_CLICK_TIME attribute


    if ( this.__LZmovieClipRef == null ){
        this.makeContainerResource( );
    }

    if ( amclickable != false && !this.__LZbuttonRef){
        this.__LZmovieClipRef.attachMovie(this.__LZclickregion, "$mcB",
                                       this.BUTTON_DEPTH  );

        var mc = this.__LZmovieClipRef.$mcB;
        mc._height = 0;
        mc._width = 0;

        // TODO: turn on only in accessible mode...
        // attach view ref to Button for callback
        mc.but.__lzview = this;
        mc.but.onSetFocus = Button.prototype.__gotFocus;
        mc.but.onKillFocus = Button.prototype.__lostFocus;

        //mc.tabIndex = _root.tabindexcounter++;
        if (this.showhandcursor == false) this.setShowHandCursor(this.showhandcursor);
        this.__LZbuttonRef = mc;
        this.setButtonSize = this._setButtonSize;
        this.setButtonSize( "width" , this.width );
        this.setButtonSize( "height" , this.height );
        this.__LZbuttonRef.myView = this;

        this.buttonIsAttached = true;

    } else {
        this.__LZbuttonRef._visible = amclickable;
    }

    this.clickable = amclickable;
    this.onclickable.sendEvent( amclickable );
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype._setButtonSize = function ( axis , bsize ){
    var sc ="_" + ( axis =="width" ? "x" : "y" ) + "scale" ;
    if ( this[ "_setresc" + axis ] && this[ 'hasset' + axis ]){
        this.__LZbuttonRef[ sc ] = this.__LZmovieClipRef[ "_" + axis ] /
                            ( this.__LZmovieClipRef[ sc ] / 100 ) ;
    } else {
        this.__LZbuttonRef[ sc ] = ( 100 / this.__LZmovieClipRef[ sc ] )*bsize;
    }
}

//-----------------------------------------------------------------------------
// Sets the cursor to the given resource when the mouse is over this view
//
// @param String cursor: The name of the resource to use as a cursor when it is over
// this view.
//-----------------------------------------------------------------------------
LzView.prototype.setCursor = function ( cursor ){
    if (cursor == null) return;

    this._cures = cursor;
    if (! this._moDel) {
        this._moDel = new _root.LzDelegate( this , '_cursorGotMouseover',
                                            this , 'onmouseover');
        this._muDel = new _root.LzDelegate( _root.LzCursor , 'unlock',
                                            this , 'onmouseout');
    }

    if (!this.__LZbuttonRef) {
        this.setClickable( true );
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype._cursorGotMouseover = function () {
    _root.LzCursor.setCursorGlobal(this._cures);
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.pushSetterMask = function ( maskprops ){
    if ( ! this.setterstack.length ){
        this.setterstack = [ this.setters];
    } else {
        this.setterstack.push( this.setters );
    }
    maskprops.__proto__ = this.setters;
    this.setters = maskprops;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.popSetterMask = function (){
    if ( ! this.setterstack.length ) return false;
    this.setters = this.setterstack.pop();
    return true;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.trackPlay = function() {
    if ( this.playing ) return;
    //_root.Debug.write('trackPlay', this);
    this.playing = true;
    if ( this.getOption("donttrackplay") || this.__LZtracking ) return;

    if (null == this.updatePlayDel) {
        this.updatePlayDel = new _root.LzDelegate( this, "updatePlayStatus");
    }
    this.__LZtracking = true;
    this.updatePlayDel.unregisterAll();
    this.updatePlayDel.register( _root.LzIdle, "onidle" );
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzView.prototype.stopTrackPlay = function() {
    this.playing = false;
    this.updatePlayStatus();
    this.__LZtracking = false;
    this.updatePlayDel.unregisterAll();
}


//-----------------------------------------------------------------------------
// Updates the play percentage
//
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.updatePlayStatus = function (){
    var c = this.getMCRef()._currentframe;
    //_root.Debug.write('updatePlayStatus', c);

    if ( this.frame != c && c != null ){
        this.frame = c;
        //@event onframe: Sent onidle while view is playing its resource
        this.onframe.sendEvent(this.frame);
    }

    var tf = this.getMCRef()._totalframes;
    if (  this.totalframes != tf ){
        if (tf != undefined) {
            this.totalframes = tf;
            this.ontotalframes.sendEvent( this.totalframes );
        }
    }

    if ( this.playing && this.frame == this.totalframes &&
         this.totalframes > 1 ){
        //@event onlastframe: Sent when the view sets its frame (resource
        //number) to the last frame. This can be used to find out when a
        //streaming media clip is done playing.
        this.onlastframe.sendEvent(this);
        this.checkPlayStatus();
    }
}


//-----------------------------------------------------------------------------
// @keywords private
// Called to begin the process of checking if the frame number changed.  Calls
// checkPlayStatus2 once after a frame.
//-----------------------------------------------------------------------------
LzView.prototype.checkPlayStatus = function (){
    this.playing = false;
    this.updatePlayStatus();
    if ( this.checkPlayStatusDel == null ){
        this.checkPlayStatusDel = new _root.LzDelegate( this ,
                                                    "checkPlayStatus2" );
    }
    this.__lzcheckframe = this.frame;
    this.__lzchecktotalframes = this.totalframes;
    this.__lzskipplaycheck = 0;
    this.__lzskipplaychecklimit = 4;
    // skip more frames for mp3 audio resources to allow tracking to work correctly
    if (this.getMCRef().isaudio == true) this.__lzskipplaychecklimit = 10;
    
    //_root.Debug.warn('checkPlayStatus %w %w %w %w', this.__lzcheckframe, this.frame, this.totalframes, this.__lzskipplaychecklimit);
    _root.LzIdle.callOnIdle( this.checkPlayStatusDel );
}

//-----------------------------------------------------------------------------
// @keywords private
// Called after one frame by checkPlayStatus2 to see the frame number has 
// changed.  May call itself
//-----------------------------------------------------------------------------
LzView.prototype.checkPlayStatus2 = function (){
    //_root.Debug.write('checkPlayStatus2 ', this);
    this.updatePlayStatus();
    this.__lzskipplaycheck++;
    if (this.__lzskipplaycheck < this.__lzskipplaychecklimit) {
        _root.LzIdle.callOnIdle( this.checkPlayStatusDel );
        return;
    }


    if ( this.frame != this.__lzcheckframe || this.totalframes != this.__lzchecktotalframes){
        //_root.Debug.write('checkPlayStatus2 tracking', this.frame, this.__lzcheckframe);
        this.trackPlay();
    } else {
        //_root.Debug.write('checkPlayStatus2 done', this.updatePlayDel, this);
        this.updatePlayDel.unregisterAll();
        this.__LZtracking = false;
    }
}

//-----------------------------------------------------------------------------
// Start or stop playing the attached resource.
//
// @param Boolean b: If true, starts playing, otherwise stops
//-----------------------------------------------------------------------------
LzView.prototype.setPlay = function (b){
    if ( b ) {
        this.play();
    } else {
        this.stop();
    }
}

//-----------------------------------------------------------------------------
// Get a reference to the control mc
//
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.getMCRef = function () {
    return this.__LZmovieClipRef;
}

//-----------------------------------------------------------------------------
// Start playing the attached resource. Note that a compiled resource that
// begins playing when it is attached (i.e. does not contain a 'stop'
// instruction in the first frame) will not send events and generally behave
// correctly unless it is told to play. Resources which are loaded via
// setSource don't have this issue.
//
// @param Integer f: If defined, begin playing at the given frame. Otherwise,
// begin playing at the current frame.
// @param Boolean rel: If true, f is relative to the current frame.  Otherwise f is relative to the beginning of the resource.
//-----------------------------------------------------------------------------
LzView.prototype.play = function (f, rel){
    var m = this.getMCRef();
    if ( m == null ) {
        this.queuePlayAction( "play" , f , rel );
        return;
    }

    if ( f != null) {
        f += rel ? this.frame : 0;
        m.gotoAndPlay( f > 0 ? f : 1 );
    } else {
        m.play();
    }

    this.trackPlay();
    //@event onplay: Sent when a view begins playing its resource
    this.onplay.sendEvent(this);
}

//-----------------------------------------------------------------------------
// Stop playing the attached resource
//
// @param Integer f: If defined, stop playing at the given frame. Otherwise,
// stop at the current frame.
// @param Boolean rel: If true, f is relative to the current frame.  Otherwise it is relative to the start position of the resource.
//-----------------------------------------------------------------------------
LzView.prototype.stop = function (f, rel){
    var m = this.getMCRef();
    if ( m == null ) {
        // always stop on the first frame
        this.queuePlayAction( "stop" , 0);
        return;
    }

    if ( f != null) {
        f += rel ? this.frame : 0;
        m.gotoAndStop( f > 0 ? f : 1 );
    } else {
        m.stop();
    }

    //@event onstop: Sent when a view's resource that is capable of playing is
    //stopped. This is only called if stop is called directly; when a resource
    //hits its last frame, the LzView event onlastframe is called.
    if ( this.playing ) this.onstop.sendEvent(this);
    this.stopTrackPlay();
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.queuePlayAction = function ( a , arg1 , arg2 ){
    //_root.Debug.write('queuePlayAction', a, arg1, arg2);
    if ( this.queuedplayaction == null ){
        this.queuedplayaction = [];
        if ( this.doQueuedDel == null ){
            this.doQueuedDel = new _root.LzDelegate( this ,
                                                     "doQueuedPlayAction" );
        }
        this.doQueuedDel.register( this, "onload" );
    }
    this.queuedplayaction.push([ a , arg1 , arg2 ]);
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.doQueuedPlayAction = function (){
    for (var i=0; i < this.queuedplayaction.length; i++) {
        var qa = this.queuedplayaction[i];
        //_root.Debug.write('doQueuedPlayAction', qa);
        this[ qa[0] ] ( qa[1] , qa[2] );
    }
    this.queuedplayaction = null;
}

//-----------------------------------------------------------------------------
// Set the volume of the attached resource
//
// @param Integer v: A number from 0 to 100 representing a volume level
//-----------------------------------------------------------------------------
LzView.prototype.setVolume = function (v) {
    var m = this.getMCRef();
    //if null is passed to LzAudio.setVolume, it sets the global volume, which
    //is not what you want here.
    if ( !m ) return;
    if (m.isaudio == true) {
        m.setVolume(v);
    } else {
        _root.LzAudio.setVolume(v, m);
    }
}

//-----------------------------------------------------------------------------
// Get the volume of the attached resource
//
// @return Integer: A number from 0 to 100 representing a volume level
//-----------------------------------------------------------------------------
LzView.prototype.getVolume = function () {
    var m = this.getMCRef();
    if (m.isaudio == true) {
        return m.getVolume();
    } else {
        return _root.LzAudio.getVolume(m);
    }
}

//-----------------------------------------------------------------------------
// Set the pan of the attached resource
//
// @param Integer p: A number from -100 to 100 representing a pan level
//-----------------------------------------------------------------------------
LzView.prototype.setPan = function (p) {
    var m = this.getMCRef();
    if (m.isaudio == true) {
        m.setPan(p);
    } else {
        _root.LzAudio.setPan(p, m);
    }
}

//-----------------------------------------------------------------------------
// Get the pan of the attached resource
//
// @return Integer: A number from -100 to 100 representing a pan level
//-----------------------------------------------------------------------------
LzView.prototype.getPan = function () {
    var m = this.getMCRef();
    if (m.isaudio == true) {
        return m.getPan();
    } else {
        return _root.LzAudio.getPan(m);
    }
}

//-----------------------------------------------------------------------------
// Skips forward or backward n seconds (depending on the sign of the argument).
// If playing, continue to play. If stopped, stay
// stopped
//
// @param Integer secs: Number of seconds to skip forward or backward (if negative)
//-----------------------------------------------------------------------------
LzView.prototype.seek= function ( secs ){
    var m = this.getMCRef();
    if (m.isaudio == true) {
        m.seek(secs, this.playing)
    } else {
        var f = secs*_root.canvas.framerate;
        if ( this.playing ) {
            this.play( f , true);
        } else {
            this.stop( f , true);
        }
    }
}

//-----------------------------------------------------------------------------
// Return the elapsed play time within the view's resource.
// @return Number: The number of seconds of media between the current frame and the
// first frame
//-----------------------------------------------------------------------------
LzView.prototype.getCurrentTime= function ( ){
    var m = this.getMCRef();
    if (m.isaudio == true) {
        return m.getCurrentTime();
    } else {
        return this.frame / _root.canvas.framerate;
    }
}

LzView.prototype.getCurrentTime.dependencies = function ( who, self ){
    return [ self , "frame" ];
}

//-----------------------------------------------------------------------------
// Returns the total amount of time the resource would take to play.
// @return Number: Seconds of media controlled by this view.
//-----------------------------------------------------------------------------
LzView.prototype.getTotalTime= function ( ){
    var m = this.getMCRef();
    if (m.isaudio == true) {
        return m.getTotalTime();
    } else {
        return this.totalframes / _root.canvas.framerate;
    }
}

//-----------------------------------------------------------------------------
// Returns an object containing the media's id3 tag, assuming it's mp3 loaded 
// with proxy == false;
// @return Object: Object containind id3 tag data, if available.
//-----------------------------------------------------------------------------
LzView.prototype.getID3 = function ( ){
    var m = this.getMCRef();
    if (m.isaudio == true) {
        return m.getID3();
    }
}


LzView.prototype.getTotalTime.dependencies = function ( who, self ){
    return [ self , "load" ];
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.prototype.getPlayPerc= function ( ){
    if ( $debug ){
        if ( !this.__LZdidPPwarn ){
            _root.Debug.write( 'LzView.getPlayPerc is deprecated. ' +
                            'Use frame/totalframes attributes instead.' );
        }
        this.__LZdidPPwarn = true;
    }
    return this.frame/this.totalframes;
}

LzView.prototype.getPlayPerc.dependencies = function ( who , self ){
    return [ self, "frame" ];
}

//-----------------------------------------------------------------------------
// Shows or hides the hand cursor for this view.
//
// @param Boolean s: true shows the hand cursor for this view, false hides 
// it
//-----------------------------------------------------------------------------
LzView.prototype.setShowHandCursor = function ( s ){
    if (this.__LZbuttonRef.but){
        this.__LZbuttonRef.but.useHandCursor = s;
    }
    this.showhandcursor = s;
}

//-----------------------------------------------------------------------------
// Activate/inactivate children for accessibility
//
// @param Boolean s: If true, activate the current view and all of its children
//-----------------------------------------------------------------------------
LzView.prototype.setAAActive = function ( s, mc ){
    if (mc == null || mc == 'aaactive') mc = this.getMCRef();
    //_root.Debug.write('setAAActive ', s + ' ' + mc);
    if (mc._accProps == null) mc._accProps = {};
    //if forceSimple is true, it is the same as the Make Child Object Accessible option being unchecked. If forceSimple is false, it is the same as the Make Child Object Accessible option being checked.
    mc._accProps.forceSimple = s == false;

    if (mc = this.__LZbuttonRef.but){
        if (mc._accProps == null) mc._accProps = {};
        mc._accProps.forceSimple = s;
    }
    //LzBrowser.updateAccessibility();
    this.aaactive = s;
}


//-----------------------------------------------------------------------------
// Set accessibility name
//
// @param string s: Sets the accessibility name for this view
//-----------------------------------------------------------------------------
LzView.prototype.setAAName = function ( s, mc ){
    if (mc == null || mc == 'aaname') mc = this.getMCRef();
    //_root.Debug.write('setAAName ', s + ' ' + mc);
    if (mc._accProps == null) mc._accProps = {};
    mc._accProps.name = s;
    if (mc = this.__LZbuttonRef.but){
        if (mc._accProps == null) mc._accProps = {};
        mc._accProps.name = s;
    }
    //LzBrowser.updateAccessibility();
    this.aaname = s;
}

//-----------------------------------------------------------------------------
// Set accessibility description
//
// @param string s: Sets the accessibility name for this view
//-----------------------------------------------------------------------------
LzView.prototype.setAADescription = function ( s, mc ){
    if (mc == null || mc == 'aadescription') mc = this.getMCRef();
    //_root.Debug.write('setAADescription ', s + ' ' + mc);
    if (mc._accProps == null) mc._accProps = {};
    mc._accProps.description = s;
    if (mc = this.__LZbuttonRef.but){
        if (mc._accProps == null) mc._accProps = {};
        mc._accProps.description = s;
    }
    //LzBrowser.updateAccessibility();
    this.aadescription = s;
}

//-----------------------------------------------------------------------------
// Set accessibility tab order
//
// @param number s: The tab order index for this view.  Must be a unique number.
//-----------------------------------------------------------------------------
LzView.prototype.setAATabIndex = function ( s, mc ){
    if (mc == null || mc == 'aatabindex') mc = this.getMCRef();
    //_root.Debug.write('setAATabIndex ', mc);
    mc.tabIndex = s;
    this.aatabindex = s;
}

//-----------------------------------------------------------------------------
// Set accessibility silencing/unsilencing
//
// @param string s: If true, this view is made silent to the screen reader.  
// If false, it is active to the screen reader.
//-----------------------------------------------------------------------------
LzView.prototype.setAASilent = function ( s, mc ){
    if (mc == null || mc == 'aasilent') mc = this.getMCRef();
    //_root.Debug.write('setAASilent ', s + ' ' + mc);
    if (mc._accProps == null) mc._accProps = {};
    mc._accProps.silent = s;
    if (mc = this.__LZbuttonRef.but){
        if (mc._accProps == null) mc._accProps = {};
        mc._accProps.silent = s;
    }
    //LzBrowser.updateAccessibility();
    this.aasilent = s;
}

//-----------------------------------------------------------------------------
// Determine whether a view should give up focus. Override this method to
// specify your own policy.
//-----------------------------------------------------------------------------
LzView.prototype.shouldYieldFocus = function ( ){
    return true;
}

//-----------------------------------------------------------------------------
// Register for update when the button gets the focus.
// Set the behavior of the enter key depending on whether the field is
// multiline or not.
//
// @keywords private 
//-----------------------------------------------------------------------------
Button.prototype.__gotFocus = function ( oldfocus ){
    if (_root._focusrect != true) return;
    //_root.Debug.write('__gotFocus', oldfocus);
    if (!(LzFocus.getFocus() == this.__lzview)) {
        var tabdown = LzKeys.isKeyDown('tab');
        _root.LzFocus.setFocus(this.__lzview, false);
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
Button.prototype.__lostFocus = function ( ){
    if (_root._focusrect != true) return;
    //_root.Debug.write('__lostFocus');
    if (this.__lzview.hasFocus) LzFocus.clearFocus();
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.__LZproxypolicies = [];

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzView.__LZcheckProxyPolicy= function ( url ){
    var pol = _root.LzView.__LZproxypolicies;

    for ( var i = pol.length-1; i >=0; i-- ){
        var resp = pol[ i ] ( url );
        if ( resp != null ) return resp;
    }

    return _root.canvas.proxied;
}

//-----------------------------------------------------------------------------
// Adds a function which can decide how the media at a given URL should be
// loaded
//
// @param Function f: A function that takes a URL as a string and returns one
// of "server", "none", or null meaning respectively that the request should be
// proxied by the LPS server; made directly to the URL; or should be passed to
// the next policy function in the list. The default policy function returns
// the value of canvas.proxied
//-----------------------------------------------------------------------------
LzView.addProxyPolicy = function ( f ){
    _root.LzView.__LZproxypolicies.push ( f );
}

//-----------------------------------------------------------------------------
// Removes a proxy policy function that has been added using
// LzView.addProxyPolicy
//
// @param Function f: The function to remove from the policy list
// @return Boolean: Returns true if the function was found and removed, false
// if not
//-----------------------------------------------------------------------------
LzView.removeProxyPolicy = function ( f ){
    var pol = _root.LzView.__LZproxypolicies;
    for ( var i = 0; i < pol.length; i++ ) {
        if ( pol[ i ] == f ){
            _root.LzView.__LZproxypolicies = pol.splice( i, 1 );
            return true;
        }
    }

    return false;
}


//-----------------------------------------------------------------------------
// LzView.setContextMenu
//
// Install menu items for the right-mouse-button 
// @param ContextMenu cmenu: ContextMenu to install on this view
//-----------------------------------------------------------------------------
LzView.prototype.setContextMenu = function ( cmenu ){
    this.contextMenu = cmenu;
    // For back compatibility, we accept either LzContextMenu or (Flash primitive) ContextMenu
    if (! (cmenu instanceof ContextMenu)) {
        cmenu = cmenu.__LZcontextMenu();
    } else {
        Debug.write("Passing a Flash ContextMenu to LzView.setContextMenu is deprecated, use LzContextMenu instead");
    }

    var mc = this.getMCRef();
    var mb = this.__LZbgRef;
    // If there's no movieclip attached, use the background clip.
    if (mc != null) {
        mc.menu = cmenu;
    }
    if (mb != null) {
        mb.menu = cmenu;
    }

    if (mb == null && mc == null) {
        Debug.warn("LzView.setContextMenu: cannot set menu on view %w, it has no foreground or background movieclip");
    }
}


//-----------------------------------------------------------------------------
// LzView.getContextMenu
//
// Returns the current context menu object
// @keywords public
//-----------------------------------------------------------------------------
LzView.prototype.getContextMenu = function ( ){
    return this.contextMenu;
}
//-----------------------------------------------------------------------------
// ContextMenu.addItem; this should be removed when the use of ContextMenu has been
// deprecated in favor of LzContextMenu
//
// Adds a menu items into a menu
// @param ContextMenuItem item: ContextMenuItem to install on this menu
// @keywords private
//-----------------------------------------------------------------------------
ContextMenu.prototype.addItem = function (item) {
    this.customItems.push(item);
}

//-----------------------------------------------------------------------------
// ContextMenu.clearItems; this should be removed when the use of ContextMenu has been
// deprecated in favor of LzContextMenu
//
// Remove all custom items from a menu
// @keywords private
//-----------------------------------------------------------------------------
ContextMenu.prototype.clearItems = function () {
    this.customItems = [];
}

