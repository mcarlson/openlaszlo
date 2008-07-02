/* -*- mode: JavaScript; c-basic-offset: 4; -*- */
/**
  * LzSprite.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

{
#pragma "warnUndefinedReferences=false"

var LzSprite = function(newowner, isroot, args) {
    if (newowner == null) return this;
    this.owner = newowner;
    //Debug.write('---> New sprite', newowner, newowner.immediateparent, newowner.immediateparent.sprite);


    if (isroot) {
        this.isroot = true;
        var is = _root.spriteroot;
        if (! is) {
            var is = _root.attachMovie('empty', 'spriteroot', 1000);
        }
        this.__LZmovieClipRef = is;
        //is._x=5;
        //is._y=5;
        //this.setOpacity(.3);
        //this.mask = null;
        
        this.__LZsvdepth = 1;
    } else {
        this.__LZdepth = newowner.immediateparent.sprite.__LZsvdepth++;
        this.__LZsvdepth = 0;
    }
}

/** @access private */
LzSprite.prototype._dbg_name = function () {
  var xs = this._xscale;
  var ys = this._yscale;
  // Describe the sprite's actual dimensions, and the 2d transform
  // representing the x/y offset and scaling
  // TODO: [2008-01-30 ptw] Factor rotation into transform
  return Debug.formatToString("%s [%0.2d x %0.2d]*[%0.2d 0 %0.2d, 0 %0.2d %0.2d, 0 0 1]",
                              String(this),
                              this.width/xs, this.height/ys,
                              xs, this.x,
                              ys, this.y)
};

LzSprite.prototype.capabilities = {
    rotation: true
    // Avoid scaling canvas to percentage values - SWF already scales the viewport size, so take window size literally to avoid scaling twice
    ,scalecanvastopercentage: false
    // the canvas already knows its size
    ,readcanvassizefromsprite: false
    ,opacity: true
    ,colortransform: true
    ,audio: true
    ,accessibility: true
    ,htmlinputtext: true
    ,advancedfonts: true
    ,bitmapcaching: true
    ,persistence: true
    ,clickmasking: true
}

/**
  * @param Boolean accessible
  */
LzSprite.prototype.setAccessible = function(accessible) {
    _root._focusrect = accessible == true ? true : 0;
}

/**
  * Activate/inactivate children for accessibility
  * @param Boolean s: If true, activate the current view and all of its children
  */
LzSprite.prototype.setAAActive = function( s, mc ){
    if (mc == null || mc == 'aaactive') mc = this.getMCRef();
    //Debug.write('setAAActive ', s + ' ' + mc);
    if (mc._accProps == null) mc._accProps = {};
    //if forceSimple is true, it is the same as the Make Child Object Accessible option being unchecked. If forceSimple is false, it is the same as the Make Child Object Accessible option being checked.
    mc._accProps.forceSimple = s == false;

    if (mc = this.__LZbuttonRef.but){
        if (mc._accProps == null) mc._accProps = {};
        mc._accProps.forceSimple = s;
    }
    //LzSprite.updateAccessibility();
    this.aaactive = s;
}


/**
  * Set accessibility name
  * @param string s: Sets the accessibility name for this view
  */
LzSprite.prototype.setAAName = function( s, mc ){
    if (mc == null || mc == 'aaname') mc = this.getMCRef();
    //Debug.write('setAAName ', s + ' ' + mc);
    if (mc._accProps == null) mc._accProps = {};
    mc._accProps.name = s;
    if (mc = this.__LZbuttonRef.but){
        if (mc._accProps == null) mc._accProps = {};
        mc._accProps.name = s;
    }
    //LzSprite.updateAccessibility();
    this.aaname = s;
}

/**
  * Set accessibility description
  * @param string s: Sets the accessibility name for this view
  */
LzSprite.prototype.setAADescription = function( s, mc ){
    if (mc == null || mc == 'aadescription') mc = this.getMCRef();
    //Debug.write('setAADescription ', s + ' ' + mc);
    if (mc._accProps == null) mc._accProps = {};
    mc._accProps.description = s;
    if (mc = this.__LZbuttonRef.but){
        if (mc._accProps == null) mc._accProps = {};
        mc._accProps.description = s;
    }
    //LzSprite.updateAccessibility();
    this.aadescription = s;
}

/**
  * Set accessibility tab order
  * @param number s: The tab order index for this view.  Must be a unique number.
  */
LzSprite.prototype.setAATabIndex = function( s, mc ){
    if (mc == null || mc == 'aatabindex') mc = this.getMCRef();
    //Debug.write('setAATabIndex ', mc);
    mc.tabIndex = s;
    this.aatabindex = s;
}

/**
  * Set accessibility silencing/unsilencing
  * @param string s: If true, this view is made silent to the screen reader.  
  * If false, it is active to the screen reader.
  */
LzSprite.prototype.setAASilent = function( s, mc ){
    if (mc == null || mc == 'aasilent') mc = this.getMCRef();
    //Debug.write('setAASilent ', s + ' ' + mc);
    if (mc._accProps == null) mc._accProps = {};
    mc._accProps.silent = s;
    if (mc = this.__LZbuttonRef.but){
        if (mc._accProps == null) mc._accProps = {};
        mc._accProps.silent = s;
    }
    //LzSprite.updateAccessibility();
    this.aasilent = s;
}

// FIRST_SUBVIEW_DEPTH: This is so that default objects (such as
// buttons, and in swf6 masks) can be attached above the view's
// subviews.  11 is an arbitrary number chosen by Adam
LzSprite.prototype.FIRST_SUBVIEW_DEPTH = 11;
LzSprite.prototype.BUTTON_DEPTH = 2;
LzSprite.prototype.MASK_DEPTH = 3;
// There can be up to two clips for each subview: background,
// foreground.  We have to leave room for them in the depth stack
LzSprite.prototype.CLIPS_PER_SUBVIEW = 2;
LzSprite.prototype.BACKGROUND_DEPTH_OFFSET = -1;
LzSprite.prototype.FOREGROUND_DEPTH_OFFSET = 0;


//@field Boolean focusable: If true, this view will participate in keyboard
// focus and will receive focus events and keyboard events
// when it has the focus. (see lz.Focus for more details)
LzSprite.prototype.focusable = false;

LzSprite.prototype.visible =   true;

LzSprite.prototype.opacity =   1;
LzSprite.prototype.bgcolor =   null;
LzSprite.prototype.x =   0;
LzSprite.prototype.y =   0;
LzSprite.prototype.rotation =   0;
// @devnote The various built-in resources (the empty clip, the bg
// clip, the button clip) are 100px square, so the clip scale (which
// is a percentage) can be set directly to the dimension.  This is an
// optimization of <scale in %> = ( <desired dim in px> / <resource
// dim in px> ) * 100.  (Effectively, the built-in resources are
// always 'stretched', but see LzSprite#_xscale).  When an explicit
// resource is assigned, unless stretching is specified, the clip
// takes it's dimensions from the resource and there is no scaling.
LzSprite.prototype.width =   0;
LzSprite.prototype.height =   0;
LzSprite.prototype.__LZclickregion =  "LzMouseEvents";

// @devnote Sprite scale is stored as a fraction, but the runtime clip
// scale is a percentage.  Note: this scale is only maintained when
// stretching is specified.  The scaling of the empty resource to
// achieve the dimensions of the view is _not_ considered scaling,
// unless stretches is specified.
LzSprite.prototype._xscale =   1;
LzSprite.prototype._yscale =   1;
LzSprite.prototype.resourceheight = 0;
LzSprite.prototype.resourcewidth = 0;

//@field Number totalframes: The total number of frames for this view's
//resource.
LzSprite.prototype.totalframes =   0;
LzSprite.prototype.frame =   0;

// Used by loaders to track load state
LzSprite.prototype.loadperc =   0;
//@field Number framesloadratio: For views whose resource is loaded at runtime,
//the ratio of the loaded frames to the total frames. This is a number between
//zero and 1.
LzSprite.prototype.framesloadratio =   0;
//@field Number loadratio: For views whose resource is loaded at runtime,
//ratio of the loaded bytes to the total bytes. This is a number between 
//zero and 1.
LzSprite.prototype.loadratio =   0;

//@field Boolean hassetwidth: If true, then setWidth() has been called on this
//view, and the view will not be sized to its contents. 
LzSprite.prototype.hassetheight = false;
//@field Boolean hassetheight: If true, then setHeight() has been called on this
//view, and the view will not be sized to its contents. 
LzSprite.prototype.hassetwidth = false;

//need quick check for viewness
LzSprite.prototype.__LZisView = true;

// maximum number of frames to wait to load an mp3 audio
LzSprite.prototype.__lzskipplaychecklimitmax = 20;


//@field Boolean _setrescwidth: If true, the view does not set its
//resource to the width given in a call to
//<method>setAttribute</method>. By default, views do not scale their
//resource
LzSprite.prototype._setrescwidth = false;
//@field Boolean _setrescheight: If true, the view does not set its
//resource to the height given in a call to
//<method>setAttribute</method>. By default, views do not scale their
//resource
LzSprite.prototype._setrescheight = false;

/**
  * Called right before the view is shown. See <method
  * classname="LzNode">init</method> for more.
  * 
  * @access protected
  */
LzSprite.prototype.init = function( ) {
    this.__LZmovieClipRef._visible = this.visible;
    this.__LZbgRef._visible = this.visible;
    if (this.isroot) {
        // Expose your methods
        DojoExternalInterface.addCallback("getCanvasAttribute", lz.History, lz.History.getCanvasAttribute);
        DojoExternalInterface.addCallback("setCanvasAttribute", lz.History, lz.History.setCanvasAttribute);
        DojoExternalInterface.addCallback("callMethod", lz.History, lz.History.callMethod);
        DojoExternalInterface.addCallback("receiveHistory", lz.History, lz.History.receiveHistory);

        // Tell JavaScript that you are ready to have method calls
        DojoExternalInterface.loaded();

        // Tell lz.History we're ready to send events
        lz.History.__start(); 
    }
}


/**
  * This method associates a view with a named library element. If the
  * view's <attribute>isVisible</attribute> property is true, the
  * resource will be displayed when it is attached
  * 
  * @param String resourceName: a string naming the id of the resource to attach
  */
LzSprite.prototype.setResource = function ( resourceName ) {
    /*
    if (LzLoader.__LZmonitorState) {
        Debug.monitor(this, 'isloaded');
        Debug.monitor(this, 'play');
        Debug.monitor(this, 'playing');
        Debug.monitor(this, '__LZtracking');
        //Debug.monitor(this, '__lzcheckframe');
    }*/

    if ( resourceName.indexOf('http:') == 0 || resourceName.indexOf('https:') == 0 ){
        this.setSource( resourceName );
        return;
    }

    this.__LZhaser = resourceName == "empty";
    this.resource = resourceName;

    if (this.__LZmovieClipRef != null ){
        this.doReplaceResource(resourceName);
    } else {
        //this is easier than figuring out what the depth and name should be
        //from this context, but it's not necessary.
        var mc = this.owner.immediateparent.sprite.attachResourceToChildView( resourceName, this );
        this.setMovieClip( mc , resourceName );
        // Copy previous right-click context menu if there is one,
        // from background-color movieclip.
        var oldmenu = this.__LZbgRef.menu;
        mv.menu = oldmenu;
    }

    this.updateResourceSize(true);
}



/**
  * @access private
  * May be overridden by loader
  */
LzSprite.prototype.doReplaceResource = function(resourceName) {
    if ( this.owner.subviews.length ){
        if ( $debug ){
            Debug.error( "%w cannot set resource to %w because it already has subviews", this, resourceName );
        }
        return false;
    }

    var reclick = this.__LZbuttonRef._visible;
    this.__LZbuttonRef = null;

    var oldmenu = this.__LZmovieClipRef.menu;
    if (oldmenu == null) {
        oldmenu = this.__LZbgRef.menu;
    }
    var oldname = this.__LZmovieClipRef._name;
    var mc = this.owner.immediateparent.sprite.attachResourceToChildView( resourceName, this, oldname);

    this.setMovieClip( mc , resourceName );
    mc.menu = oldmenu;

    if ( reclick ){
        this.setClickable( true );
    }
}


/**
  * This method is called when a view that has no resource needs one, either
  * because a layout is being attached, or because a subview with a resource is
  * being added.
  * 
  * @access private
  */
LzSprite.prototype.makeContainerResource = function ( ) {
    //Debug.write('LzSprite.makeContainerResource');
    this.setResource( "empty" );
}

/**
  * This method is called when a view that has no resource needs one, either
  * because a layout is being attached, or because a subview with a resource is
  * being added.
  * 
  * @access private
  * 
  * @param String mc: a reference to the flash movie clip that the view controls
  */
LzSprite.prototype.setMovieClip = function ( mc , mcID) {
    this.__LZmovieClipRef = mc;
    //mc.tabIndex = tabindexcounter++;
    if (this.masked) {
      this.applyMask();
    }

    var tfchg = this.totalframes != mc._totalframes;
    if ( tfchg ){
        this.totalframes = mc._totalframes;
        this.owner.resourceevent('totalframes', this.totalframes);
    }

    if ( this.totalframes > 1 ){
        this.checkPlayStatus();
    }

    //unrolled this loop because it is called frequently
    if (this.x != 0) this.setX(this.x);
    if (this.y != 0) this.setY(this.y);
    if (this.opacity != 1) this.setOpacity(this.opacity);
    if (this.rotation != 0) this.setRotation(this.rotation);

    if ( !this.owner.isinited ){
        this.__LZmovieClipRef._visible = false;
    } else if ( this.owner.visibility != "collapse" ){
        this.__LZmovieClipRef._visible = this.visible;
    }
    this.updateResourceSize();
}

/**
  * This method is usually called by a child view's <method>setResource</method>
  * function. It is useful because the attaching tends to happen in the context
  * of the parent view.
  * 
  * @access private
  * @keywords flashspecific
  * 
  * @param resourceName: a string naming the resource to attach.  This is a resource defined with the <tagname>resource</tagname> tag.
  * @param childsprite: a reference to the child sprite that the new resource will b
  * attached to
  * 
  * @return: a reference to the newly attached resource
  */
LzSprite.prototype.attachResourceToChildView = function ( resourceName,
                                                        childsprite, instName ){
    if (this.__LZmovieClipRef == null){
        this.makeContainerResource( );
    }

    // make up a name unless one was specified...
    if (instName == null) {
        if ( this.__LZsubUniqueNum == null ){
            this.__LZsubUniqueNum = 0;
        } else {
            this.__LZsubUniqueNum++;
        }
        var instName = ("$m" + this.__LZsubUniqueNum );
    }

    //mc.tabIndex = tabindexcounter++;

    //Debug.write('Sprite.depth', this.FIRST_SUBVIEW_DEPTH, childsprite.owner.sprite.__LZdepth, this.CLIPS_PER_SUBVIEW, this.FOREGROUND_DEPTH_OFFSET)
    var depth = this.FIRST_SUBVIEW_DEPTH + 
      (childsprite.__LZdepth * this.CLIPS_PER_SUBVIEW) + 
      this.FOREGROUND_DEPTH_OFFSET;
    
    var newmc = this.__LZmovieClipRef.attachMovie( resourceName, instName, depth);



    //@event onaddsubresource: Sent when a child view adds a resource
    // not found in view
    // if (this.owner.onaddsubresource && this.owner.onaddsubresource.ready) this.owner.onaddsubresource.sendEvent( childsprite.owner );

    return newmc;
}


/**
  * @access private
  */
LzSprite.prototype.attachBackgroundToChild = function ( childsprite ){

    if (this.__LZmovieClipRef == null){
        this.makeContainerResource( );
    }

    if ( this.__LZsubUniqueNum == null ){
        this.__LZsubUniqueNum = 0;
    } else {
        this.__LZsubUniqueNum++;
    }

    var depth = this.FIRST_SUBVIEW_DEPTH +
      (childsprite.__LZdepth * this.CLIPS_PER_SUBVIEW) +
      this.BACKGROUND_DEPTH_OFFSET;

    var mc = this.__LZmovieClipRef.attachMovie( "swatch", "$b" + this.__LZsubUniqueNum, depth );
    childsprite.__LZbgRef = mc;

    // @devnote See note at LzSprite#width for why this is correct
    childsprite.__LZbgRef._xscale = childsprite.width;
    childsprite.__LZbgRef._yscale = childsprite.height;

    childsprite.__LZbgRef._x = childsprite.x;
    childsprite.__LZbgRef._y = childsprite.y;

    childsprite.__LZbgRef._alpha = childsprite.opacity * 100 ;
    childsprite.__LZbgRef._rotation = childsprite.rotation % 360;

    childsprite.__LZbgRef._visible = childsprite.visible && childsprite.owner.isinited;
}


/**
  * Gives the view a bgcolor that is the same size as the view.
  * @param Integer bgc: The 0-FFFFFF number to be used for the new background color.
  */
LzSprite.prototype.setBGColor = function ( bgc ) {
    //@field Number bgcolor: The color of background of this view. Null if there is
    //no bgcolor. A number from 0 - 0xFFFFFF.
    if (bgc != null) {
        if ( $debug ){
            var bgcn = Number( bgc );
            if ( bgcn != bgcn ) {
                if ( $debug ){
                    Debug.write( "Invalid value for bgcolor: " + 
                                       bgca,this );
                }
            }
        }
        this.bgcolor = Number(bgc);
        this.applyBG();
        if (this._bgcolorhidden) {
            this.__LZbgRef._alpha = this.opacity * 100;
            // overriding context menu color so opacity setting works
            this._bgcolorshown = true;
        }
    } else {
        if (this._bgcolorhidden) {
            this.__LZbgRef._alpha = 0;
            //opacity setting should not work
            this._bgcolorshown = false;
        } else {
            this.bgcolor = null;
            this.removeBG();
        }
    }
}

/**
  * @access private
  */
LzSprite.prototype.removeBG = function () {
    if (this.__LZisBackgrounded ) {
        this.__LZbgRef.removeMovieClip();
        this.__LZbgRef = null;
        delete this.__LZbgColorO;
        this.__LZisBackgrounded = false;
    }
}

/**
  * @access private
  */
LzSprite.prototype.applyBG = function () {
    if (! this.__LZisBackgrounded ) {
        this.owner.immediateparent.sprite.attachBackgroundToChild( this );
        this.__LZisBackgrounded = true;
    }
    var bgc = this.bgcolor;
    if ( bgc != null ) {
        if ( !('__LZbgColorO' in this) ) {
            this.__LZbgColorO = new Color( this.__LZbgRef );
        }
        this.__LZbgColorO.setRGB( bgc );
    }
    // Reapply context menu if needed
    if (this.__contextmenu) {
        this.setContextMenu(this.__contextmenu);
    }
}


/**
  * Sets the <attribute>x</attribute> position of the view to the given value.
  * @param Number v: The new value for <attribute>x</attribute>.
  */
LzSprite.prototype.setX = function ( v ){
    //Debug.warn('Sprite.setX');
    //@field Number x: The x position of the view
    this.x = v;
    this.__LZmovieClipRef._x = v;
    this.__LZbgRef._x = v;
    //Debug.write('Sprite.setX', this, v, this.__LZmovieClipRef, this.__LZmovieClipRef._x);
}

/**
  * Sets the <attribute>y</attribute> position for the view to the given value.
  * @param Number v: The new value for <attribute>y</attribute>.
  */
LzSprite.prototype.setY = function ( v ){
    //@field Number y: The y position for the view
    this.y = v;
    this.__LZmovieClipRef._y = v;
    this.__LZbgRef._y = v;
}


/**
  * This method sets the <attribute>visible</attribute> attribute of the view
  * and also disables or re-enables any click region associated with the view.
  * Note that a value of null is different from a value of false for this
  * attribute.  See the description of the visible attribute for details.
  * 
  * @param Boolean amVisible: boolean for visibility of view
  */
LzSprite.prototype.setVisible = function( amVisible ) {
    this.visible = amVisible;
    this.__LZmovieClipRef._visible = amVisible;
    this.__LZbgRef._visible = amVisible;
}


/**
  * Sets the width of the view. If the view is set to stretch its resource, the
  * resource will be resized to the new value. If the value 'null' is given for
  * the new width, then the width is unset, and the width of the view will be
  * the size of its contents.
  * @param Number v: The new value for the width
  */
LzSprite.prototype.setWidth = function ( v ){
    if (this.__LZmovieClipRef == null){
        this.makeContainerResource( );
    }
    if ( v == null ){
        this.hassetwidth = false;
        if ( this._setrescwidth ){
            // defaults
            this._xscale = 1;
            // clip scale is in percent
            this.__LZmovieClipRef._xscale =  100;
        }
        return;
    }
    this.width = v;

    if ( this._setrescwidth ){
        // <scale as fraction> = ( <desired dim in px> / <resource dim
        // in px> ) Note the empty resource is a 100x100px clip
        var xscale = ((this.resourcewidth == 0) ? (v/100) : (v/this.resourcewidth));
        this._xscale = xscale;
        // clip scale is in percent
        this.__LZmovieClipRef._xscale = xscale * 100;
        if (this.__LZrightmenuclip) this.__LZrightmenuclip._xscale = xscale * 100;
    } else {
        // If the view does not stretch, we have to resize the mask
        // NOTE: [2008-01-24 ptw] This seems wrong.  If the view is
        // masked, the mask is attached as a child of the resource so
        // it will scale properly, and only its dimensions are set.
        // BUT, I probably don't understand Flash movies. It seems
        // that setting scale or dimension are interchangable?
        if ( this.masked ){
            this.__LZmaskClip._xscale = v;
        }
        if (this.__LZrightmenuclip) this.__LZrightmenuclip._xscale = v;
    }
    
    this.hassetwidth = true;
    
    if (this.setButtonSize)
        this.setButtonSize( "width" , v );

    if (typeof(this.__LZbgRef._xscale) != 'undefined') 
        this.__LZbgRef._xscale = v;
}

/**
  * Sets the height of the view the given value. If the view is set to stretch
  * its resource, the resource will be resized to the new value. If the value
  * 'null' is given for the new height, then the height is unset, and the height
  * of the view will be the size measured of its contents.
  * @param Number v: The new value for the height
  */
LzSprite.prototype.setHeight = function ( v ){
    if (this.__LZmovieClipRef == null){
        this.makeContainerResource( );
    }
    if ( v == null ){
        this.hassetheight = false;
        if ( this._setrescheight ){
            // defaults
            this._yscale = 1;
            // clip scale is in percent
            this.__LZmovieClipRef._yscale =  100;
        }
        return;
    }
    this.height = v;

    if ( this._setrescheight ){
        // <scale as fraction> = ( <desired dim in px> / <resource dim
        // in px> ) Note the empty resource is a 100x100px clip
        var yscale = ((this.resourceheight == 0) ? (v/100) : (v/this.resourceheight));
        this._yscale = yscale;
        // clip scale is in percent
        this.__LZmovieClipRef._yscale = yscale * 100;
        if (this.__LZrightmenuclip) this.__LZrightmenuclip._yscale = yscale * 100;
    } else {
        // If the view does not stretch, we have to resize the mask
        // NOTE: [2008-01-24 ptw] This seems wrong.  If the view is
        // masked, the mask is attached as a child of the resource so
        // it will scale properly, and only its dimensions are set.
        // BUT, I probably don't understand Flash movies. It seems
        // that setting scale or dimension are interchangable?
        if ( this.masked ){
            this.__LZmaskClip._yscale = v;
        }
        if (this.__LZrightmenuclip) this.__LZrightmenuclip._yscale = v;
    }
    this.hassetheight = true;
    
    if (this.setButtonSize)
        this.setButtonSize( "height" , v );

    if (typeof(this.__LZbgRef._yscale) != 'undefined')
        this.__LZbgRef._yscale = v;
}

LzSprite.prototype.setOpacity = function ( v ){
    //@field Number opacity: The opacity value for the view,
    //a number between 0 and 1
    this.opacity = v;
    if (this.__LZmovieClipRef)
        this.__LZmovieClipRef._alpha = 100*v;

    // set the bgcolor alpha if not set by the context menu and overridden by the context menu
    if (this.__LZbgRef && (this._bgcolorhidden != true && this._bgcolorshown != true))
         this.__LZbgRef._alpha = 100*v;
}

/**
  * Since a view does not re-measure the size of its resource once that resource
  * has loaded, this method is provided to force the view to update its size, 
  * taking into account the current size of its resource. 
  *
  * @devnote [2008-01-25 ptw] I am not convinced that this works in
  * all cases because I am not sure that the Sprite scale always
  * tracks the clip scale (c.f., the implementtation of stretches), in
  * particular, this does not work when called from
  * LzMakeLoadSprite.updateAfterLoad because the Sprite scale will
  * reflect the scale of the empty clip being sized to the view
  * (before the load started) and what we really want is the size of
  * the loaded resource.
  */
LzSprite.prototype.updateResourceSize = function (skipsend){
    var mc = this.getMCRef();
    this.setWidth(this.hassetwidth?this.width:null);
    this.setHeight(this.hassetheight?this.height:null);
    var rt = canvas.resourcetable[ this.resource ];
    if ( rt ){
        this.resourcewidth = rt.width;
        this.resourceheight = rt.height;
    } else {
        // Get the true size by unscaling. Note: clip scale is in percent
        this.resourcewidth = mc._width/(mc._xscale/100);
        this.resourceheight = mc._height/(mc._yscale/100);
    }

    if (! skipsend && ! this.__LZhaser) this.owner.resourceload({width: this.resourcewidth, height: this.resourceheight, resource: this.resource, skiponload: true});
}

/**
  * Sets the view so that it stretches its resource in the given axis so that
  * the resource is the same size as the view. The has the effect of distorting
  * the coordinate system for all children of this view, so use this method
  * with care.
  * 
  * @param String stretch: Set the resource to stretch only in the given axis ("width" or
  * "height") or in both axes ("both"). 
  */
LzSprite.prototype.stretchResource = function ( stretch ){
    if (stretch == "width" || stretch == "both") {
        this._setrescwidth = true;
    }

    if (stretch == "height" || stretch == "both") {
        this._setrescheight = true;
    }
}

/**
  * This function sets or removes the clip/mask
  */
LzSprite.prototype.setClip = function (c){
    if (c) {
        this.makeMasked();
    } else {
        this.removeMask();
    }    
}    

/**
  * This function applies the MakeMasked view transformer.
  * @access private
  */
LzSprite.prototype.makeMasked = function ( ){
    this.masked = true;
    this.mask = this;
}

/**
  * @access private
  */
LzSprite.prototype.removeMask = function () {
    //Debug.write(this, '.removeMask');
    this.__LZmovieClipRef.setMask(null);
    var mask = this.__LZmaskClip;
    mask.removeMovieClip();
    delete this.__LZmaskClip;
    this.masked = false;
    this.mask = null;
}

/**
  * @access private
  */
LzSprite.prototype.applyMask = function (s) {
    if ( this.__LZmovieClipRef == null ){
        Debug.warn("Cannot apply mask before resource has been attached in",
                    this);
        return;
    }
    if (s && this.cachebitmap) {
        if ($debug) Debug.warn('Clipping automatically disables bitmap caching');
        this.setBitmapCache(false);
    }

    var mc = this.__LZmovieClipRef;
    if (s) {
        var mask = mc.createEmptyMovieClip("$mcM", this.MASK_DEPTH);
    } else {
        var mask = mc.attachMovie( "swatch", "$mcM", this.MASK_DEPTH);
    }
    //mask.tabIndex = tabindexcounter++;
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

/**
  * @access private
  * */
LzSprite.prototype.setClickRegion = function ( cr ){
    if (cr == null) cr = "LzMouseEvents";
    this.__LZclickregion = cr;
}


/**
  * Makes a view clickable or not clickable.
  * @param amclickable: Boolean indicating the view's clickability
  */
LzSprite.prototype.setClickable = function ( amclickable ){
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
        var mc = this.__LZmovieClipRef.attachMovie( this.__LZclickregion, "$mcB", this.BUTTON_DEPTH );
        mc._height = 0;
        mc._width = 0;

        // TODO: turn on only in accessible mode...
        // attach view ref to Button for callback
        mc.but.__lzview = this.owner;
        mc.but.onSetFocus = Button.prototype.__gotFocus;
        mc.but.onKillFocus = Button.prototype.__lostFocus;

        this.__LZbuttonRef = mc;
        //mc.tabIndex = tabindexcounter++;
        if (this.showhandcursor == false) this.setShowHandCursor(this.showhandcursor);
        this.setButtonSize = this._setButtonSize;
        this.setButtonSize( "width" , this.width );
        this.setButtonSize( "height" , this.height );
        this.__LZbuttonRef.myView = this.owner;
    } else {
        this.__LZbuttonRef._visible = amclickable;
    }

    this.clickable = amclickable;
}


/**
  * @access private
  *
  * @devnote The button is a is a child of the view resource (either
  * explicit or the empty resource), so will be scaled by any scale
  * that the resource has.  To size the button resource (which is
  * 100px square) to the view, you would normally just set its scale
  * to the view dimension (see note at LzSprite#width), but you have
  * to also invert its parent's scale (which is a percent) hence the
  * (100 / &lt;parent scale&gt;) factor.
  */
LzSprite.prototype._setButtonSize = function ( axis , bsize ){
    var sc ="_" + ( axis =="width" ? "x" : "y" ) + "scale" ;
    this.__LZbuttonRef[ sc ] = ( 100 / this.__LZmovieClipRef[ sc ] ) * bsize;
}

/**
  * This function allows the view to load its media from an URL at runtime.
  * Resources loaded with <method>setSource</method> will replace compiled
  * resources when the request is made.
  * 
  * @param String source: The URL from which to load the resource for this view.
  * @param String cache: If set, controls caching behavior. Choices are
  * <code>none</code> , <code>clientonly</code> , <code>serveronly</code> , <code>both</code> (the default).
  * @param String headers: Headers to send with the request, if any.
  */
LzSprite.prototype.setSource = function ( source, cache, headers, filetype){
    //@event onerror: Sent when there is an error loading the view's resource.
    //The argument sent with the event is the error string sent by the server.
    //@event ontimeout: Sent when the request to load media for the view times
    //out
    LzMakeLoadSprite.transform( this, source, cache, headers, filetype);
    //after this call, setSource  and doReplaceResource have been over-ridden
}


/**
  * Adds a child sprite to this sprite's display hierarchy
  * @access protected
  * @param LzSprite s: The new sprite
  */
LzSprite.prototype.addChildSprite = function ( s ){
    if ( s.addedToParent ) return;
    if ( ! this.__LZmovieClipRef ) { this.makeContainerResource() };

    s.addedToParent = true;
}

/**
  * Sets the <attribute>rotation</attribute> for the view to the given value.
  * @param Number v: The new value for <attribute>rotation</attribute>.
  */
LzSprite.prototype.setRotation = function ( v ){
    //@field Number rotation: The rotation value for the view (in degrees)
    //Value may be less than zero or greater than 360.
    this.rotation = v;
    this.__LZmovieClipRef._rotation = v % 360;
    this.__LZbgRef._rotation = v % 360;
    return true;
}

LzSprite.prototype.setFontName = function ( val ,prop ){
    this.fontname = val;
}

LzSprite.prototype.predestroy = function(){
    this.bringToFront();
}

/**
  * This method should remove a view, its media, and any of its subviews.
  * @access private
  * 
  */
LzSprite.prototype.destroy = function(){
    if (this.__LZdeleted == true) return;
    // To keep delegates from resurrecting us.  See LzDelegate#execute
    this.__LZdeleted = true;

    if (this.updatePlayDel) {
        this.updatePlayDel.unregisterAll();
        delete this.updatePlayDel;
    }
    
    if (this.doQueuedDel) {
        this.doQueuedDel.unregisterAll();
        delete this.doQueuedDel;
    }
    
    if (this._moDel) {
        this._moDel.unregisterAll();
        delete this._moDel;
        this._muDel.unregisterAll();
        delete this._muDel;
    }

    this.__LZFinishDestroyOnIdle();
}

/**
  * @access private
  */
LzSprite.prototype.__LZFinishDestroyOnIdle = function (){
    if ( this.__LZmovieClipRef != null ){
        //Debug.write( "remove movieclip" );
        removeMovieClip( this.__LZmovieClipRef );
        delete this.__LZmovieClipRef;
    }

  if ( this.__LZbgRef != null ){
    removeMovieClip( this.__LZbgRef );
    delete this.__LZbgRef;
  }
}

/**
  * This method returns the position of the mouse relative to this sprite.
  * 
  * @return Object: The x and y position of the mouse relative to this sprite.
  */
LzSprite.prototype.getMouse = function() {
    if ( ! this.__LZmovieClipRef ) { this.makeContainerResource() };
    return {x: Math.round(this.__LZmovieClipRef._xmouse), y: Math.round(this.__LZmovieClipRef._ymouse)}
}

/**
  * Get a reference to the control mc - may be overridden by loader
  */
LzSprite.prototype.getMCRef = function () {
    if (this.__LZmovieClipRef == null){
        this.makeContainerResource( );
    }
    return this.__LZmovieClipRef;
}

/**
  * Sets the color of the view (the view's resource and any subviews) to the
  * the color given. This will completely override any color information in the
  * view or subview resources. Use the view method
  * <method>setColorTransform</method> to tint a view.
  * @param Integer c: A color in rgb format; for example, 0xff0000 is red.
  */
LzSprite.prototype.setColor = function ( c ){
    this.fgcolor = c;
    this.getColorObj().setRGB( c );
}

/**
  * Gets the color of the view (the view's resource and any subviews) view as
  * as set with setColor().
  * Returns A color in rgb format; for example, 0xff0000 is red.
  */
LzSprite.prototype.getColor = function (){
    return this.getColorObj().getRGB();
}


/**
  * color transforms everything contained in the view (except the
  * background) by the transformation dictionary given in <param>o</param>.  The dictionary has
  * the following possible keys:
  * 
  * o.ra: percentage alpha for red component (-100 to 100);
  * o.rb: offset for red component (-255 to 255);
  * o.ga: percentage alpha for green component (-100 to 100);
  * o.gb: offset for green component (-255 to 255);
  * o.ba: percentage alpha for blue component (-100 to 100);
  * o.bb: offset for blue component (-255 to 255);
  * o.aa: percentage overall alpha (-100 to 100);
  * o.ab: overall offset (-255 to 255);
  */
LzSprite.prototype.setColorTransform = function ( o ){
    this.getColorObj().setTransform( o );
}


/**
  * Returns an object that represents the color transformation currently applied
  * to the view. The color transform object has the following possible keys
  * 
  * o.ra: percentage alpha for red component (-100 to 100);
  * o.rb: offset for red component (-255 to 255);
  * o.ga: percentage alpha for green component (-100 to 100);
  * o.gb: offset for green component (-255 to 255);
  * o.ba: percentage alpha for blue component (-100 to 100);
  * o.bb: offset for blue component (-255 to 255);
  * o.aa: percentage overall alpha (-100 to 100);
  * o.ab: overall offset (-255 to 255);
  */
LzSprite.prototype.getColorTransform = function (){
    return this.getColorObj().getTransform( );
}

/**
  * @access private
  */
LzSprite.prototype.getColorObj = function (){
    if ( this.__LZcolorobj == null ){
        if ( this.__LZmovieClipRef == null ){
            this.makeContainerResource();
        }
        #pragma "passThrough=true" 
        this.__LZcolorobj = new Color( this.__LZmovieClipRef );
    }

    return this.__LZcolorobj;
}


/**
  * Returns the width of the view.
  * @keywords protected 
  * @deprecated
  */
LzSprite.prototype.getWidth = function (){
    return this.width;
}

/**
  * Returns the height of the view.
  * @keywords protected 
  * @deprecated
  */
LzSprite.prototype.getHeight = function (){
    return this.height;
}


/**
  * This method makes this view the frontmost subview of this view's parent.
  * */
LzSprite.prototype.bringToFront = function ( ){
    //Debug.write('bringToFront', this);
    //this is really a function of the parent view
    this.owner.immediateparent.sprite.changeOrder ( this , 1);
}

/**
  * This method makes this view the hindmost subview of this view's parent.
  */
LzSprite.prototype.sendToBack = function ( ){
    //Debug.write('sendToBack', this);
    //this is really a function of the parent view
    this.owner.immediateparent.sprite.changeOrder ( this , -1);
}

/**
  * Puts this view behind one of its siblings.
  * @param LzSprite v: The view this view should go in front of. If the passed 
  * view is null or not a sibling, the method has no effect.
  * @return Boolean: Method returns true if the operation is successful.
  */
LzSprite.prototype.sendBehind = function ( v ){
    return this.owner.immediateparent.sprite.changeOrder( this, -1, v , false );
}

/**
  * Puts this view in front of one of its siblings.
  * @param LzSprite v: The view this view should go in front of. If the passed 
  * view is null or not a sibling, the method has no effect.
  * @return Boolean: Method returns true if the operation is successful.
  */
LzSprite.prototype.sendInFrontOf = function ( v ){
    return this.owner.immediateparent.sprite.changeOrder( this, 1, v , true );
}

/**
  * moves the given child view to the front.
  * @keywords flashspecific private
  * 
  * @param cSprite: a reference to the child sprite to be moved to the front
  */
LzSprite.prototype.changeOrder = function (cSprite , dir , fv , inf ){
    var dl = this.getDepthList();
    var dll = dl.length;
    var sw;
    //Debug.write('changeOrder', dl, fv);
    if ( fv ){
        //need to figure out which direction we're going in
        var foundcView = false;
        var foundfv = false;
        var dir = 0;
        for ( var i = 0; i < dll; i++ ){
            var v = dl[ i ];
            if ( !v ) {
                continue;
            } else if ( v == cSprite ){
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
    if ( cSprite.__LZmovieClipRef == null ){
        cSprite.makeContainerResource();
    }

    var cVMv = this.getAttachPoint( cSprite );
    //Debug.write('got attachPoint', cVMv);

    var reback = cSprite.__LZisBackgrounded;
    if (reback) {
        var menu = cSprite.__LZbgRef.menu;
        var al = cSprite.__LZbgRef._alpha;
    }
    cSprite.removeBG();
    while (cSprite.__LZdepth + next < dl.length  && cSprite.__LZdepth+next >= 0 ){
        var d = cSprite.__LZdepth;
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
        cSprite.__LZdepth = d+next;
        next = dir;

        if ( nv.__LZisBackgrounded ){
            var menu2 = nv.__LZbgRef.menu;
            var al2 = nv.__LZbgRef._alpha;
            nv.removeBG();
            nv.applyBG();
            nv.__LZbgRef.menu = menu2;
            nv.__LZbgRef._alpha = al2;
        }
    }

    if ( reback ){
        cSprite.applyBG();
        cSprite.__LZbgRef.menu = menu;
        cSprite.__LZbgRef._alpha = al;
    }
    return true;
}

/**
  * Returns an array of subviews in depth order
  * @return [LzSprite]: An array of this view's subviews in depth order
  */
LzSprite.prototype.getDepthList = function (){
    var a = [];
    for ( var i = this.owner.subviews.length-1; i >= 0; i-- ){
        var sv = this.owner.subviews[ i ].sprite;
        a[ sv.__LZdepth ] = sv;
    }
    return a;
}

/**
  * @access private
  */
LzSprite.prototype.__LZfindNextNonNull = function ( arr, pos , dir ){
    for ( var i = pos + dir; i >= 0 && i < arr.length; i += dir ){
        if ( arr[ i ] != null ){
            return arr[ i ];
        }
    }
    return null;
}

/**
  * Gets the movieclip of childview which is the direct child of this view's movieclip
  * @access private
  */
LzSprite.prototype.getAttachPoint = function ( cSprite ){
    //Debug.write('getAttachPoint', this, cSprite);
    if ( ! this.__LZmovieClipRef || ! cSprite.__LZmovieClipRef ) return;
    var mcr = cSprite.__LZmovieClipRef;
    while ( mcr._parent != this.__LZmovieClipRef ){
        var mcr = mcr._parent;
        // SWF-specific
        if ( mcr == _root.spriteroot ){
            //Debug.write('found root', mcr);
            return null;
        }
        //Debug.write('found parent', mcr);
    }
    return mcr;
}

/**
  * Shows or hides the hand cursor for this view.
  * @param Boolean s: true shows the hand cursor for this view, false hides 
  * it
  */
LzSprite.prototype.setShowHandCursor = function ( s ){
    if (!this.__LZbuttonRef) {
        this.setClickable( true );
    }
    
    if (this.__LZbuttonRef.but){
        this.__LZbuttonRef.but.useHandCursor = s;
    }
    this.showhandcursor = s;
}

/**
  * Sets the cursor to the given resource when the mouse is over this view
  * @param String cursor: The name of the resource to use as a cursor when it is over
  * this view. Or '' for default cursor.
  */
LzSprite.prototype.setCursor = function( cursor ){
    if (cursor == null) return;

    if (cursor != '') {
        this._cures = cursor;
        if (! this._moDel) {
            this._moDel = new LzDelegate( this , '_cursorGotMouseover',
                                                this.owner , 'onmouseover');
            this._muDel = new LzDelegate( LzMouseKernel , 'restoreCursor',
                                                this.owner , 'onmouseout');
        }
        
        if (!this.__LZbuttonRef) {
            this.setClickable( true );
        }
    } else {
        LzMouseKernel.restoreCursor();
        
        delete this._cures;
        if (this._moDel) {
            this._moDel.unregisterAll();
            delete this._moDel;
            this._muDel.unregisterAll();
            delete this._muDel;
        }
    }
}

/** @access private */
LzSprite.prototype._cursorGotMouseover = function(ignore) {
    LzMouseKernel.setCursorGlobal(this._cures);
}

/**
  * @access private
  */
LzSprite.prototype.trackPlay = function() {
    if ( this.playing ) return;
    //Debug.write('trackPlay', this);
    this.playing = true;
    this.owner.playing = true;
    if ( this.owner.getOption("donttrackplay") || this.__LZtracking ) return;

    if (null == this.updatePlayDel) {
        this.updatePlayDel = new LzDelegate( this, "updatePlayStatus");
    }
    this.__LZtracking = true;
     if (this.updatePlayDel)
         this.updatePlayDel.unregisterAll();
    this.updatePlayDel.register( lz.Idle, "onidle" );
}


/**
  * @access private
  */
LzSprite.prototype.stopTrackPlay = function() {
    this.playing = false;
    this.owner.playing = false;
    this.updatePlayStatus();
    this.__LZtracking = false;
    this.updatePlayDel.unregisterAll();
    this.checkPlayStatusDel.unregisterAll();
}


/**
  * Updates the play percentage
  * @access private
  */
LzSprite.prototype.updatePlayStatus = function (ignore){
    var c = this.getMCRef()._currentframe;
    //Debug.write('updatePlayStatus', c);

    if ( this.frame != c && c != null ){
        this.frame = c;
        this.owner.resourceevent('frame', this.frame);
    }

    var tf = this.getMCRef()._totalframes;
    if (  this.totalframes != tf ){
        if (tf != undefined) {
            this.totalframes = tf;
            this.owner.resourceevent('totalframes', this.totalframes);
        }
    }

    if ( this.playing && this.frame == this.totalframes &&
         this.totalframes > 1 ){
        //@event onlastframe: Sent when the view sets its frame (resource
        //number) to the last frame. This can be used to find out when a
        //streaming media clip is done playing.
        this.owner.resourceevent('lastframe', null, true);
        this.checkPlayStatus();
    }
}

/**
  * @access private
  * Called to begin the process of checking if the frame number changed.  Calls
  * checkPlayStatus2 once after a frame.
  */
LzSprite.prototype.checkPlayStatus = function (){
    this.playing = false;
    this.updatePlayStatus();
    if ( this.checkPlayStatusDel == null ){
        this.checkPlayStatusDel = new LzDelegate( this , "checkPlayStatus2" );
    }
    this.__lzcheckframe = this.frame;
    this.__lzchecktotalframes = this.totalframes;
    this.__lzskipplaycheck = 0;
    this.__lzskipplaychecklimit = 4;
    // skip more frames for mp3 audio resources to allow tracking to work correctly
     if (('isaudio' in this.getMCRef()) && (this.getMCRef().isaudio == true)) this.__lzskipplaychecklimit = LzSprite.prototype.__lzskipplaychecklimitmax;
    
    //Debug.warn('checkPlayStatus %w %w %w %w', this.__lzcheckframe, this.frame, this.totalframes, this.__lzskipplaychecklimit);
    this.checkPlayStatusDel.register( lz.Idle, "onidle" );
}

/**
  * @access private
  * Called after one frame by checkPlayStatus2 to see the frame number has 
  * changed.  May call itself
  */
LzSprite.prototype.checkPlayStatus2 = function (ignore){
    //Debug.write('checkPlayStatus2 ', this);
    this.updatePlayStatus();
    this.__lzskipplaycheck++;
    if (this.__lzskipplaycheck < this.__lzskipplaychecklimit) {
        return;
    }
    this.checkPlayStatusDel.unregisterAll();

    if ( this.frame != this.__lzcheckframe || this.totalframes != this.__lzchecktotalframes){
        //Debug.write('checkPlayStatus2 tracking', this.frame, this.__lzcheckframe);
        this.trackPlay();
    } else {
        //Debug.write('checkPlayStatus2 done', this.updatePlayDel, this);
        if (this.updatePlayDel)
            this.updatePlayDel.unregisterAll();
        this.__LZtracking = false;
    }
}


/**
  * Start playing the attached resource. Note that a compiled resource that
  * begins playing when it is attached (i.e. does not contain a 'stop'
  * instruction in the first frame) will not send events and generally behave
  * correctly unless it is told to play. Resources which are loaded via
  * setSource don't have this issue.
  * 
  * @param Integer f: If defined, begin playing at the given frame. Otherwise,
  * begin playing at the current frame.
  * @param Boolean rel: If true, f is relative to the current frame.  Otherwise f is relative to the beginning of the resource.
  */
LzSprite.prototype.play = function (f, rel){
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
    this.owner.resourceevent('play', null, true);
}

/**
  * Stop playing the attached resource
  * @param Integer f: If defined, stop playing at the given frame. Otherwise,
  * stop at the current frame.
  * @param Boolean rel: If true, f is relative to the current frame.  Otherwise it is relative to the start position of the resource.
  */
LzSprite.prototype.stop = function (f, rel){
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
    if ( this.playing ) this.owner.resourceevent('stop', null, true);
    this.stopTrackPlay();
}

/**
  * @access private
  */
LzSprite.prototype.queuePlayAction = function ( a , arg1 , arg2 ){
    //Debug.write('queuePlayAction', a, arg1, arg2);
    if ( this.queuedplayaction == null ){
        this.queuedplayaction = [];
        if ( this.doQueuedDel == null ){
            this.doQueuedDel = new LzDelegate( this , "doQueuedPlayAction" );
        }
        this.doQueuedDel.register( this.owner, "onload" );
    }
    this.queuedplayaction.push([ a , arg1 , arg2 ]);
}

/**
  * @access private
  */
LzSprite.prototype.doQueuedPlayAction = function (ignore){
    for (var i=0; i < this.queuedplayaction.length; i++) {
        var qa = this.queuedplayaction[i];
        //Debug.write('doQueuedPlayAction', qa);
        this[ qa[0] ] ( qa[1] , qa[2] );
    }
    this.queuedplayaction = null;
}


LzSprite.prototype.toString = function () {
    return 'LzSprite for ' + this.owner;
}

/**
  * Set the volume of the attached resource
  * @param Integer v: A number from 0 to 100 representing a volume level
  */
LzSprite.prototype.setVolume = function (v) {
    var m = this.getMCRef();
    //if null is passed to LzAudio.setVolume, it sets the global volume, which
    //is not what you want here.
    if ( !m ) return;
    if (m.isaudio == true) {
        m.setVolume(v);
    } else {
        LzAudioKernel.setVolume(v, m);
    }
}

/**
  * Get the volume of the attached resource
  * @return Integer: A number from 0 to 100 representing a volume level
  */
LzSprite.prototype.getVolume = function() {
    var m = this.getMCRef();
    if (m.isaudio == true) {
        return m.getVolume();
    } else {
        return LzAudioKernel.getVolume(m);
    }
}

/**
  * Set the pan of the attached resource
  * @param Integer p: A number from -100 to 100 representing a pan level
  */
LzSprite.prototype.setPan = function(p) {
    var m = this.getMCRef();
    if (m.isaudio == true) {
        m.setPan(p);
    } else {
        LzAudioKernel.setPan(p, m);
    }
}

/**
  * Get the pan of the attached resource
  * @return Integer: A number from -100 to 100 representing a pan level
  */
LzSprite.prototype.getPan = function() {
    var m = this.getMCRef();
    if (m.isaudio == true) {
        return m.getPan();
    } else {
        return LzAudioKernel.getPan(m);
    }
}

/**
  * Get the current z order of the sprite
  * @return Integer: A number representing z orderin
  */
LzSprite.prototype.getZ = function() {
    return this.__LZdepth;
}

/**
  * LzSprite.setContextMenu
  * Install menu items for the right-mouse-button 
  * @param LzContextMenu cmenu: LzContextMenu to install on this view
  */
LzSprite.prototype.setContextMenu = function ( cmenu ){
    // For back compatibility, we accept either LzContextMenu or (Flash primitive) ContextMenu
    if (! (cmenu instanceof ContextMenu)) {
        this.__contextmenu = cmenu;
        cmenu = cmenu.kernel.__LZcontextMenu();
    } else {
      if ($debug) {
        Debug.info("Passing a Flash ContextMenu to LzView.setContextMenu is deprecated, use LzContextMenu instead");
      }
    }

    // [todo hqm 01-24-07] SWF-specific 
    if (this.owner == canvas || this instanceof LzTextSprite) {
        // check canvas for LPP-4214, instanceof LzTextSprite for LPP-5533
        var mc = this.getMCRef();
        if (this.owner == canvas) {
            // must use _root if canvas
            var mc = _root;
        } 
        if (mc != null) {
            mc.menu = cmenu;
        }
    } else {
        var mb = this.__LZbgRef;
        if (mb == null) {
            this.setBGColor(0xffffff);
            var mb = this.__LZbgRef;
            mb._alpha = 0;
        }
        this._bgcolorhidden = true;
        mb.menu = cmenu;

        // Install menu on foreground resource clip if there is one
        var mc = this.getMCRef();
        if (mc != null) {
            mc.menu = cmenu;
        }
    }

    if ($debug) {
        if (mb == null && mc == null) {
        Debug.warn("LzView.setContextMenu: cannot set menu on view %w, it has no foreground or background movieclip", this.owner);
        }
    }
}

LzSprite.prototype.setDefaultContextMenu = function ( cmenu ){
    MovieClip.prototype.menu = cmenu.kernel.__LZcontextMenu();
}

/**
  * Return the current context menu
  */
LzSprite.prototype.getContextMenu = function() {
    return this.__contextmenu;
}

/**
  * Allows bitmap caching to be enabled/disabled where available.
  * @param Boolean cache: Whether or not to cache bitmaps for this view
  */
LzSprite.prototype.setBitmapCache = function(cache) {
    this.cachebitmap = cache;
    var mc = this.getMCRef();
    mc.cacheAsBitmap = cache;
}

/**
  * Get a reference to the graphics context
  */
LzSprite.prototype.getContext = LzSprite.prototype.getMCRef;

/**
  * Register for update when the button gets the focus.
  * Set the behavior of the enter key depending on whether the field is
  * multiline or not.
  * 
  * @access private
  */
Button.prototype.__gotFocus = function ( oldfocus ){
  // SWF-specific
    if (_root._focusrect != true) return;
    //Debug.write('__gotFocus', oldfocus);
    if (!(lz.Focus.getFocus() == this.__lzview)) {
        var tabdown = lz.Keys.isKeyDown('tab');
        lz.Focus.setFocus(this.__lzview, false);
    }
}

/**
  * @access private
  */
Button.prototype.__lostFocus = function ( ){
  // SWF-specific
    if (_root._focusrect != true) return;
    //Debug.write('__lostFocus');
    if (this.__lzview.hasFocus) lz.Focus.clearFocus();
}
}
