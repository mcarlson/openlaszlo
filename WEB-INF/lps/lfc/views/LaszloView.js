/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzview
  * @access public
  *
  * @topic LFC
  * @subtopic Views
  */


dynamic public class LzView extends LzNode {

    static var tagname = 'view';

    static var getters = new LzInheritedHash(LzNode.getters);
    static var defaultattrs = new LzInheritedHash(LzNode.defaultattrs);
    static var options = new LzInheritedHash(LzNode.options);
    static var setters = new LzInheritedHash(LzNode.setters);
    static var __LZdelayedSetters:* = new LzInheritedHash(LzNode.__LZdelayedSetters);
    static var earlySetters:* = new LzInheritedHash(LzNode.earlySetters);

    LzView.setters.clip =  -1;
    LzView.setters.x ="setX";
    LzView.setters.y =  "setY";

    function LzView ( parent:* , attrs:* , children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
    }

     var animators:Array;
    var _height:Number;
    var _width:Number;
    var _y:Number;
    var _x:Number;
     var _resource;
     var __LZhaser;

    var onaddsubview:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private */
    var onbgcolor:LzDeclaredEventClass = LzDeclaredEvent;
/** The onblur script is executed when an element loses focus either
  * by the pointing device or by tabbing navigation.
  * @lzxtype event
  */
    var onblur:LzDeclaredEventClass = LzDeclaredEvent;
/** The onclick script is executed when the pointing device button is
  * clicked over an element.
  * @lzxtype event  
  */
    var onclick:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private */
    var onclickable:LzDeclaredEventClass = LzDeclaredEvent;
/** The onfocus script is executed when an element receives focus
  * either by the pointing device or by tabbing navigation.
  * @lzxtype event  
  */
    var onfocus:LzDeclaredEventClass = LzDeclaredEvent;   // From LzFocus
/** @lzxtype event */   
    var onframe:LzDeclaredEventClass = LzDeclaredEvent;

/** Event for changes to view's <attribute>height</attribute> property 
  * @lzxtype event
  */
    var onheight:LzDeclaredEventClass = LzDeclaredEvent;
/** @lzxtype event */   
    var onimload:LzDeclaredEventClass = LzDeclaredEvent;

/** The onkeyup script is executed when this view has the focus and a
  * key is released. This event is sent with the keycode for the key that 
  * went up.
  * @lzxtype event
  */
    var onkeyup:LzDeclaredEventClass = LzDeclaredEvent;   // From LzFocus

/** The onkeydown script is executed when this view has the focus and
  * a key is pressed down.  Multiple key down events are sent for a
  * key that is held down.  If you want the script executed only
  * once, use onkeyup. This event is sent with the keycode for the key that is
  * down.
  * @lzxtype event
  */
    var onkeydown:LzDeclaredEventClass = LzDeclaredEvent; // From LzFocus
/** @lzxtype event */
    var onlastframe:LzDeclaredEventClass = LzDeclaredEvent;
/** @lzxtype event */
    var onload:LzDeclaredEventClass = LzDeclaredEvent;
/** @lzxtype event */
    var onloadperc:LzDeclaredEventClass = LzDeclaredEvent;

/** <event>onerror</event>: Sent when there is an error loading the view's resource.
  * The argument sent with the event is the error string sent by the server.
  * @access private
  * @lzxtype event
  */
    var onerror:LzDeclaredEventClass = LzDeclaredEvent;

/**
  * <event>ontimeout</event>: Sent when the request to load media for the view times
  * out
  * @lzxtype event
  */
    var ontimeout:LzDeclaredEventClass = LzDeclaredEvent;
/** The onmousedown script is executed when the pointing device button is
  * pressed over an element.
  * @lzxtype event
  */
    var onmousedown:LzDeclaredEventClass = LzDeclaredEvent;

    var onmousemove:LzDeclaredEventClass = LzDeclaredEvent;

/** The onmouseout script is executed when the point device is moved
  * so that is is no longer over an element.
  * @lzxtype event
  */
    var onmouseout:LzDeclaredEventClass = LzDeclaredEvent;


/** The onmouseover script is executed when the pointing device is
  * moved onto an element.
  * @lzxtype event  
  */
    var onmouseover:LzDeclaredEventClass = LzDeclaredEvent;

/** @access private 
  * @lzxtype event 
  */
    var onmousetrackover:LzDeclaredEventClass = LzDeclaredEvent;

/** @access private 
  * @lzxtype event 
  */
    var onmousetrackup:LzDeclaredEventClass = LzDeclaredEvent;

/** The onmouseup script is executed when the pointing device button is
  * released over an element.
  * @lzxtype event
  */
    var onmouseup:LzDeclaredEventClass = LzDeclaredEvent;

/** 
  * Sent when a view changes its opacity 
  * @lzxtype event
  */
    var onopacity:LzDeclaredEventClass = LzDeclaredEvent;

/** @access private 
  * @lzxtype event 
  */
    var onplay:LzDeclaredEventClass = LzDeclaredEvent;

/** 
  * Event called when this view removes a subview 
  * @lzxtype event
  */ 
    var onremovesubview:LzDeclaredEventClass = LzDeclaredEvent;

/** @access private 
  * @lzxtype event 
  */
    var onresource:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var onresourceheight:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var onresourcewidth:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var onrotation:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var onstop:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var ontotalframes:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var onunstretchedheight:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var onunstretchedwidth:LzDeclaredEventClass = LzDeclaredEvent;
/** @lzxtype event */
    var onvisible:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var onvisibility:LzDeclaredEventClass = LzDeclaredEvent;

/** event for changes to view's <attribute>width</attribute> property 
 * @lzxtype event 
 */
    var onwidth:LzDeclaredEventClass = LzDeclaredEvent;

/** event for changes to view's <attribute>x</attribute> property 
 * @lzxtype event
 */
    var onx:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var onxoffset:LzDeclaredEventClass = LzDeclaredEvent;

/** event for changes to view's <attribute>y</attribute> property 
  * @lzxtype event
  */
    var ony:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private 
  * @lzxtype event 
  */
    var onyoffset:LzDeclaredEventClass = LzDeclaredEvent;

/**
  * The ondblclick script is executed when the pointing device button
  * is double clicked over an element.
  *
  * @devnote Sent when the mouse is doubleclicked over the view,
  * but only if anyone is listening for the event. A view which is clicked
  * twice in rapid succession, but has no delegates registered for its
  * ondblclick event, will simply send two click events.
  * The view's doubleclick time can be adjusted by setting its
  * DOUBLE_CLICK_TIME attribute
  * @lzxtype event
  */
    var ondblclick:LzDeclaredEventClass = LzDeclaredEvent;
/** @access private */
 var DOUBLE_CLICK_TIME = 500;

/** @access private */
 var capabilities = LzSprite.capabilities;


/**
  * Base level constructor for views. See <method
  * classname="LzNode">construct</method> for more on this.
  * 
  * @access protected
  */
override function construct ( parent , args) {
    this.__makeSprite(args);

    super.construct( (parent ? parent : canvas), args );

    var ip = this.immediateparent;
    if (ip == null) {
        //trace("LzView.construct immediateparent == null", this.id);
    }
    
    if (ip) {
        this.mask = ip.mask;
    }

    //this.__LZdepth = ip.__LZsvdepth++;
    //this.__LZsvdepth = 0;



    if ( 'width' in args || (('$refs' in args) && ('width' in args.$refs) && args.$refs.width) ){
        this.hassetwidth = true;
        this.__LZcheckwidth = false;
    }
    if ( 'height' in args || (('$refs' in args) && ('height' in args.$refs) && args.$refs.height) ){
        this.hassetheight = true;
        this.__LZcheckheight = false;
    }

    var r =null;
    if ('resource' in args && args['resource'] != null ){
        r = args.resource;
        args.resource = LzNode._ignoreAttribute;
    }
    if ('clip' in args && args['clip']){
        if (this.sprite) this.makeMasked();
    }
    if (args['stretches']){
        if (this.sprite) this.stretchResource(args.stretches);
    }
    if ( r  != null ){
        if (this.sprite) this.setResource( r );
    }
    if($debug){
        if( 'valign' in args && args['valign'] && 'y' in args && args['y']){
            Debug.warn("y attribute ignored; superseded by valign constraint.");
        }
        if( 'align' in args && args['align'] && 'x' in args && args['x']){
            Debug.warn("x attribute ignored; superseded by align constraint.");
        }
    }
}

/** Receive attribute/event change from sprite
  */
function spriteAttribute(attrname, value){
    if (this[attrname]) this.setAttribute(attrname, value);
}

/**
  * Called to create the sprite object.  May be overridden to use a specific 
  * version, e.g. LzTextSprite();
  * @access private
  */
function __makeSprite(args) {
    this.sprite = new LzSprite(this, false, args);
}

/**
  * Called right before the view is shown. See <method
  * classname="LzNode">init</method> for more.
  * 
  * @access protected
  */
override function init( ) {
    if (this.sprite) {
        this.sprite.init(this.visible);
    }
}

/**
  * Called when a subview is added to the view.
  * @access protected
  * @param LzView s: The new subview
  */
function addSubview ( s ){
      if (this.sprite) {
          this.sprite.addChildSprite(s.sprite);
      }

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

    if (this.__LZcheckwidth)
        this.__LZcheckwidthFunction( s );
    if (this.__LZcheckheight)
        this.__LZcheckheightFunction( s );
    
    if (this.onaddsubview.ready) this.onaddsubview.sendEvent( s );
}

/**
  * Called when the view itself and all its children have finished
  * instantiating.
  * @access private
  */
override function __LZinstantiationDone (){
    if (this.immediateparent) {
        (LzView(this.immediateparent)).addSubview( this );
    } else {
        //        trace("LaszloView.__LZinstantiationDone immediateparent = null");
    }

    //this.callInherited( '__LZinstantiationDone' , arguments.callee );
    super.__LZinstantiationDone.apply(this, arguments);
}

/** Reference to closest masked view in the hierarchy at or above
  * this one
  * @type LzView
  * @keywords readonly
  */
 var mask;

/** If true, this view will receive focus events.
  * See focus manager (LzFocus) for more details.
  * @type Boolean
  * @lzxtype boolean
  * @keywords readonly
  */
    var focusable:Boolean = false;

/** If true, this view "traps" the focus, for example in a window or dialog.
  * See focus manager (LzFocus) for more details.
  * @lzxtype boolean
  */
 var focustrap;

/** Clip the view's contents to its size.
  * @lzxtype boolean
  * @lzxdefault "false"
  * @keywords final
  */
    var clip:Boolean = false;


LzView.setters.rotation= "setRotation";
LzView.setters.opacity = "setOpacity";
/** @access private */
LzView.setters.alpha = "setOpacity";
LzView.setters.visible = "setVisible"
/** @access private */
LzView.setters.visibility = "setVisibility"

/**
  * @lzxtype "left" | "center" | "right" | constraint
  * @lzxdefault "left"
  * @keywords final
  */
    var align:String = "left"
LzView.setters.align = "setAlign"

/**
  * Creates a constraint on the view's y position which is a function
  * of its height and its parent's height. The default for this is
  * "top".
  * @lzxtype "top" | "middle" | "bottom" | constraint
  * @lzxdefault "top"
  */
 var valign = "top"
LzView.setters.valign = "setValign"

/** The URL from which to load the resource for this
  * view.  If this attribute is set, the media for the view is loaded
  * at runtime.
  * @type String
  * @lzxtype expression
  * @access private
  */
 var source;
/** 
  * As a setter, this is private. It's not really a setter, because
  * it talks to a private attribute, "source". 
  * The method setSource, defined below, is public, but it's not
  * a setter. [bshine 2007.11.07]
  * @access private 
  */ 
LzView.setters.source = "setSource";
/** The background color of the canvas. 
  * @lzxtype token
  */
LzView.setters.bgcolor =  "setBGColor";

/** Sets the name of this views resource, or the URL from which it should
  * be loaded.
  * @type String
  */
/// TODO HQM 01 2008 remove this dupe declaration of 'resource' from the source when merging
//var resource;

LzView.setters.resource =  "setResource";

/** If true, this view intercepts click events; otherwise they are passed
  * to its container.  This defaults to true if the view defines a mouse
  * event handler or a cursor.
  * @lzxtype boolean
  */
LzView.setters.clickable =  "setClickable";
/** Setting clickRegion to a vector-based SWF turns the SWF shape into a clickable hotspot.
  * @access public
  * @lzxtype string
  */
 var clickregion;   
LzView.setters.clickregion =  "__LZsetClickRegion";
/** The cursor to display when the mouse is over this view. Any
  * resource can be used as a cursor. This attribute can be set for
  * any view with clickable=true, or any view whose class defaults
  * clickable to true.
  * @lzxtype token
  */
 var cursor;  
LzView.setters.cursor =  "setCursor";
/** A color to use to render object that appears inside this view,
  * which includes any vector or bitmap art in the view's resource
  * and any contained views.
  * @lzxtype color
  */
 var fgcolor;   
LzView.setters.fgcolor =  "setColor";
/** The font to use for any @c{&lt;text>} or @c{&lt;inputtext>} elements that
  * appear inside this view. Like all the font properties
  * (<code>fontstyle</code> and <code>fontsize</code> too) these
  * properties cascade down the view hierarchy until a new value is
  * specified. When the font attributes are modified at runtime,
  * using JavaScript, the font is changed for the view itself, not
  * for any of its subviews.
  * @lzxtype string
  */
 var font;  
LzView.setters.font = "setFontName" ;

/** The style to use to render text fields that appear inside of
  * this view. One of "plain", "bold" , "italic" or "bolditalic".
  * @lzxtype string
  */
 var fontstyle;

/** Pixel size to use to render text which appears inside this
  * view. The default is 8.
  * @lzxtype size
  */
 var fontsize;

/**
  * Setting <code>stretches</code> causes a view to change its
  * coordinate space so that everything it contains (resources and
  * other views) fit exactly into the view's width and/or height. The
  * default for this property is "none". This is used to resize a
  * view's contents by setting its width and/or height.
  * @lzxtype "width" | "height" | "both"
  * @lzxdefault "none"
  */
 var stretches = "none"; 
LzView.setters.stretches =   "stretchResource";
/** If true, the resource attached to this view begins playing when
  * the view is instantiated.
  * @lzxtype boolean
  */
LzView.setters.play =   "setPlay";
/** Show or hide the handcursor for this view, if clickable */
LzView.setters.showhandcursor =   "setShowHandCursor";

 var layout; 
LzView.setters.layout =   "setLayout";

/** Activate/inactivate children for accessibility
  * @type Boolean
  * @lzxtype boolean
  */
 var aaactive; 
LzView.setters.aaactive =   "setAAActive";
/** Set accessibility name
  * @type String
  * @lzxtype string
  */
 var aaname;
LzView.setters.aaname =   "setAAName";
/** Set accessibility description
  * @type String
  * @lzxtype string
  */
 var aadescription; 
LzView.setters.aadescription =   "setAADescription";
/** Set accessibility tab order
  * @type Number
  * @lzxtype number
  */
 var aatabindex;   
LzView.setters.aatabindex =   "setAATabIndex";
/** Set accessibility silencing/unsilencing
  * @type Boolean
  * @lzxtype boolean
  */
 var aasilent; 
LzView.setters.aasilent =   "setAASilent";

LzView.__LZdelayedSetters.layout = "setLayout";


LzView.earlySetters.clickregion = 7;
LzView.earlySetters.stretches = 8;

/** A value to be added to the
  * <attribute>x</attribute> position of this view before drawing
  * it. This affects the apparent rotation point of the view, as well as
  * its apparent <attribute>x</attribute> position. It does not affect the view's width or its
  * internal coordinate system.
  * @type Number
  */
LzView.setters.xoffset =  "setXOffset";
/** A value to be added to the <attribute>y</attribute> position of this view
  * before drawing it. This affects the apparent rotation point of the view, as
  * well as its apparent <attribute>y</attribute> position. It does not affect the view's width or its
  * internal coordinate system.
  * @type Number
  */
LzView.setters.yoffset = "setYOffset";

/** @access private */
 var sprite:LzSprite = null;

/** A value of true means that this view is shown. A
  * value of false means that this view is hidden.
  * Note that an otherwise clickable view that is not visible will have no click
  * region and will not be clickable. 
  * @type Boolean
  * @lzxtype boolean
  * @lzxdefault "true"
  */
    var visible:Boolean =   true;

/** A value of "visible" means that this view is shown. A
  * value of "hidden" means that this view is hidden. Setting this attribute to "collapse"
  * means that the runtime will hide this view when: its opacity is zero, it has a
  * datapath that does not match a node, or it is loading its media. In this
  * case, the the value of the 'visible' attribute of the view will reflect the view's
  * current visible state. 
  * @type String
  * @lzxtype string
  * @lzxdefault "collapse"
  * @access private
  */
 var visibility = "collapse";

/** @access private */
 var __LZvizO = true;
/** @access private */
// var __LZvizDat = true;  // Moved to Node
/** @access private */
 var __LZvizLoad= true;

/** 
  * The opacity of the view's contents. @c{1.0} is opaque; @c{0.0} is
  * totally transparent (invisible).
  * @lzxtype opacity
  * @lzxdefault "1.0"
  */
 var opacity =   1;
/** The color of background of this view. Null if there is
  * no bgcolor. A number from 0 - 0xFFFFFF.
  * @lzxtype color
  */
 var bgcolor =   null;
/** The horizontal offset of this view's upper left corner from the
  * upper left corner of its container.
  * @type Number
  * @lzxtype numberExpression
  * @lzxdefault "0"
  */
    var x:Number =   0;
/** The vertical offset of this view's upper left corner from the
  * upper left corner of its container
  * @type Number
  * @lzxtype numberExpression
  * @lzxdefault "0"
  */
    var y:Number =   0;
/** The rotation value for the view (in degrees).
  * Value may be less than zero or greater than 360.
  * @type Number
  * @lzxtype numberExpression
  * @lzxdefault "0"
  */
 var rotation:Number =   0;

/**
  * The width of the view
  * @access public
  * @type Number
  * @lzxtype sizeExpression
  */
 var width:Number =   0;
LzView.setters.width = "setWidth";

/**
  * The height of the view
  * @access public
  * @type Number
  * @lzxtype sizeExpression
  */
 var height:Number =   0;
LzView.setters.height = "setHeight";

/** If stretches is not set to none, the width
  * that this view would be if it weren't stretched. This attribute can be used
  * to scale a view by a percentage of its original size, or to determine the
  * aspect ratio for a view.
  * @type Number
  * @keywords readonly
  */
    var unstretchedwidth:Number =   0;
/** If stretches is not set to none, the height
  * that this view would be if it weren't stretched. This attribute can be used
  * to scale a view by a percentage of its original size, or to determine the
  * aspect ratio for a view.
  * @type Number
  * @keywords readonly
  */
    var unstretchedheight:Number =   0;
/** An array of the subviews that are children of this
  * view. This is initialized to an empty array for views that have no subviews.
  * @keywords readonly
  */
    var subviews:Array =   [];
/** @access private */
 var __LZclickregion =  "LzMouseEvents";

/**
  * Specifies a translation point for drawing of this view. If the xoffset
  * is set, then rotation and x position will be calculated by first adding
  * the xoffset.
  * @lzxtype numberExpression
  * @lzxdefault "0"
  */
    var xoffset:Number =   0;
/**
  * Specifies a translation point for drawing of this view. If the yoffset
  * is set, then rotation and y position will be calculated by first adding
  * the yoffset.
  * @lzxtype numberExpression
  * @lzxdefault "0"
  */
    var yoffset:Number =   0;
/** @access private */
    var __LZrsin:Number = 0;
/** @access private */
    var __LZrcos:Number = 1;
/** @access private */
    var __LZcaloffset:Boolean = false;

/** @access private */
    var _xscale:Number =   1;
/** @access private */
    var _yscale:Number =   1;

/** The total number of frames for this view's resource.
  * @type Number
  * @keywords readonly
  */
    var totalframes:Number =   0;
/** If this view has a multi-frame resource, this allows setting which
  * resource frame is displayed.  Defaults to the first frame (1).
  * @lzxtype numberExpression
  * @lzxdefault "0"
  * @devnote See also the <attribute>resource</attribute>
  * attribute.  Setting this attribute will change the frame that is
  * being displayed by the resource associated with this view. The
  * first frame of the resource is frame 0.  Setting a view's
  * 'donttrackplay' option to true will allow the view's resource to
  * play without updating the value of the view's frame property. This
  * can save CPU usage in cases where the application doesn't need to
  * know what frame the resource is showing while it is playing.
  */
    var frame:Number =   0;
LzView.setters.frame =   "setResourceNumber";

/** @keywords deprecated 
  * @access private 
  */
    var loadperc:Number =   0;
/** For views whose resource is loaded at runtime,
  * the ratio of the loaded frames to the total frames. This is a number between
  * zero and 1.
  * @type Number
  * @keywords readonly
  */
 var framesloadratio =   0;
/** For views whose resource is loaded at runtime,
  * ratio of the loaded bytes to the total bytes. This is a number between 
  * zero and 1.
  * @type Number
  * @keywords readonly
  */
 var loadratio =   0;

/** If true, then setWidth() has been called on this
  * view, and the view will not be sized to its contents. 
  * @type Boolean
  * @keywords readonly  
  */
 var hassetheight = false;
/** If true, then setHeight() has been called on this
  * view, and the view will not be sized to its contents. 
  * @type Boolean
  * @keywords readonly  
  */
 var hassetwidth = false;

/** need quick check for viewness
  * @access private 
  */
    var __LZisView:Boolean = true;

//
// field selected: Setting this attribute calls the abstract method
// <method>setSelected</method>.  See
// <classname>LzSelectionManager</classname>.
// @access private
//
//============================================================================
/** @access private */
 var addedToParent = null;
/** @access private */
 var checkPlayStatusDel = null;
/** @access private */
 var masked = false;

/**
  * The view system supports sub-pixel positioning to enable smooth
  * animation. This may be turned off to make the view snap to a
  * pixel boundary by setting pixellock to true.
  * @lzxtype booleanLiteral
  * @modifiers final
  */
 var pixellock = null;
/** @access private */
 var setButtonSize = null;

 var clickable = false;

/** Show or hide the hand cursor for this view, if clickable
  * @lzxtype boolean
  */
 var showhandcursor = null;
/** @access private */
 var updatePlayDel = null;
/**
  * A resource that is presented in the background of this view.  The
  * value can be either the name of a resource defined with the
  * <tag>resource</tag> tag, a URL, or a pathname.  If the value is a URL,
  * the resource is requested when the view is displayed.  If it's a
  * pathname, the file named by the pathname is compiled into the
  * application, and attached to this view.
  * @lzxtype string
  */
 var resource = null;

/**
  * @keywords readonly
  */
 var resourcewidth = null;
/**
  * @keywords readonly
  */
 var resourceheight = null;

 /** @access private */ var __LZcheckwidth = true;
 /** @access private */ var __LZcheckheight = true;
 /** @access private */ var __LZhasoffset = null;
 /** @access private */ var __LZoutlieheight = null;
 /** @access private */ var __LZoutliewidth = null;

/**
  * this creates a specific child layout for this view. When called a second time
  * the first layout will be replaced by the second.
  * @param Object layoutobj: A dictionary of attributes that describe the
  * layout, where the class key specifies the class of the layout and the
  * rest are passed as attributes for the layout.  By default the class will
  * be <api>simplelayout</api> if not given.
  * For example: <code>{'class': 'wrappinglayout', axis: 'x', spacing: 20}</code>
  * To remove the previously set layout, use <code>{'class': 'none'}</code>
  * (Note that you must use <code>'class'</code> as the key, because
  * <code>class</code> is a keyword reserved for future use.)
  */


    function setLayout ( layoutobj, ignore = null ) { }

/**
  * Sets the font name for this view. The font information (font, fontsize, and
  * fontstyle) will cascade down the runtime view hierarchy.
  * @access private
  * @param String val: The value for the new font name
  */
    function setFontName ( val ,prop = null ) { }

/** If true, the view does not set its
  * resource to the width given in a call to
  * <method>setAttribute</method>. By default, views do not scale their
  * resource
  * @type Boolean
  * @access private
  */
  var _setrescwidth = false;
/** If true, the view does not set its
  * resource to the height given in a call to
  * <method>setAttribute</method>. By default, views do not scale their
  * resource
  * @type Boolean
  * @access private
  */
  var _setrescheight = false;

/**
  * Search all subviews for a named property. For now, returns when it finds the
  * first one. This is a width first search.
  * 
  * @param String prop: named property
  * @param val: value for that property
  * @return LzView: the first subview whose property <param>prop</param> is set to val 'val' or null
  * if none is found
  */
    function searchSubviews ( prop , val)  { }

/** @access private */
    function searchimmediateparents ( prop ) { }

/** A CSS sequence of layout parameters in 'property: value' form.
  * These values are used to create a layout that is attached to this view.
  * If there
  * is a class property, it names the class of the layout; otherwise
  * <tagname>simplelayout</tagname> is used.  If the value of this attribute is a single
  * id, it is used as the axis attribute of a simplelayout.
  * Examples: <code>axis: x</code>, <code>class: constantlayout</code>; 
  * <code>axis: y</code>; <code>axis: x; spacing: 5</code>.
  * @type Object
  * @lzxtype css
  */
// Moved to LzNode
// var layouts = null;


/**
  * Releases all the layouts applied to this view.
  * @deprecated
  */
    function releaseLayouts( )  { }

/**
  * This method associates a view with a named library element. If the
  * view's <attribute>isVisible</attribute> property is true, the
  * resource will be displayed when it is attached
  * 
  * @param String resourceName: a string naming the id of the resource to attach
  */
    function setResource ( resourceName, ignore = null )  { 
    if (resourceName == null || resourceName == this._resource) return;
    /*if (LzLoader.__LZmonitorState) {
        Debug.monitor(this, 'isloaded');
        Debug.monitor(this, 'play');
        Debug.monitor(this, 'playing');
        Debug.monitor(this, '__LZtracking');
        //Debug.monitor(this, '__lzcheckframe');
    }
    if ( resourceName.indexOf('http:') == 0 || resourceName.indexOf('https:') == 0 ){
        this.setSource( resourceName );
        return;
    }
    //Debug.write(this.sprite);
    */

    if (resourceName != 'empty') this.sprite.setResource(resourceName);
    
    this.__LZhaser = resourceName == "empty";

    this.resource = resourceName;
    if (this.onresource.ready) this.onresource.sendEvent( resourceName );

    this._resource = this.resource;
}


/**
  * @access private
  * Called by sprites when the resource has been loaded to send the
  * appropriate events
  */
function resourceload(i) {
    if ('resource' in i) {
        this.resource = i.resource;
        if (this.onresource.ready) this.onresource.sendEvent(i.resource);
    }

    if (this.resourcewidth != i.width) {
        if ('width' in i) {
            this.resourcewidth = i.width;
            if (this.onresourcewidth.ready) this.onresourcewidth.sendEvent(i.width);
        }

        //if no setwidth, then the view is sized to the resource
        if ( (!this.hassetwidth && this.resourcewidth != this.width ) ||
            (this._setrescwidth && this.unstretchedwidth !=
                                                    this.resourcewidth)){
            this.updateWidth( this.resourcewidth  );
        }
    }

    if (this.resourceheight != i.height) {
        if ('height' in i) {
            this.resourceheight = i.height;
            if (this.onresourceheight.ready) this.onresourceheight.sendEvent(i.height);
        }

        if ( (!this.hassetheight && this.resourceheight != this.height ) ||
             (this._setrescheight && this.unstretchedheight != this.resourceheight)){
            this.updateHeight( this.resourceheight  );
        }
    }

    if (i.skiponload != true) {
        if (this.onload.ready) this.onload.sendEvent(this);
    }
}



/**
  * @access private
  * Called by the sprite when the resource load error occurs 
  */
function resourceloaderror() {
    this.resourcewidth = 0;
    this.resourceheight = 0;
    if (this.onresourcewidth.ready) this.onresourcewidth.sendEvent(0);
    if (this.onresourceheight.ready) this.onresourceheight.sendEvent(0);
    this.reevaluateSize();
    if (this.onerror.ready) this.onerror.sendEvent();
}

/**
  * @access private
  * Called by the sprite when the resource load timeout occurs 
  */
function resourceloadtimeout() {
    this.resourcewidth = 0;
    this.resourceheight = 0;
    if (this.onresourcewidth.ready) this.onresourcewidth.sendEvent(0);
    if (this.onresourceheight.ready) this.onresourceheight.sendEvent(0);
    this.reevaluateSize();
    if (this.ontimeout.ready) this.ontimeout.sendEvent();
}

/**
  * @access private
  * Called by the sprite when the resource playback events occur
  */
function resourceevent(name, value, eventonly) {
    if (eventonly != true) this[name] = value;
    var ev = this['on'+ name];
    if (ev.ready) ev.sendEvent(value);
}

/**
  * This method is called to set the number of total frames in the resource.
  * The ontotalframes event is generated
  * 
  * @param Number n: The total number of frames in the resource
  * @access private
  */
    function setTotalFrames (n, ignore = null) { }

/**
  * This method should remove a view, its media, and any of its subviews.
  * @access private
  * 
  */
override function destroy( recursiveCall = null){
    if ( this.__LZdeleted ) return;
    
    if (this.sprite) this.sprite.predestroy();

    if ( this.addedToParent ){
        var svs =  LzView(this.immediateparent).subviews;
        if (svs != null) {
            for( var i = svs.length - 1; i >= 0; i-- ){
                if ( svs[ i ] == this ){
                    svs.splice( i , 1 );
                    break;
                }
            }
        }
    }

    super.destroy.apply(this, arguments);

    if (this.sprite) { this.sprite.destroy() }

    if ( recursiveCall == true ) { return; }

    //this.__LZFinishDestroyOnIdle();

    this.setVisible ( false );

    if ( this.addedToParent ){
        if ( ('__LZoutliewidth' in LzView(this.immediateparent)) && (LzView(this.immediateparent).__LZoutliewidth == this) ) {
            LzView(this.immediateparent).__LZoutliewidth=null;
        }

        if ( ('__LZoutlieheight' in LzView(this.immediateparent)) && (LzView(this.immediateparent).__LZoutlieheight == this) ) {
         LzView(this.immediateparent).__LZoutlieheight=null;
        }

        if ('onremovesubview' in LzView(this.immediateparent))
            if (LzView(this.immediateparent).onremovesubview.ready) LzView(this.immediateparent).onremovesubview.sendEvent( this );
    }
}


/** @access private */
function deleteView( recursiveCall ){
    if ( $debug ){
      Debug.deprecated(this, arguments.callee, this.destroy);
    }
    this.destroy();
}



/** @access private */
var _visible;


/**
  * This method sets the <attribute>visible</attribute> attribute of the view
  * and also disables or re-enables any click region associated with the view.
  * 
  * @param Boolean|Null amVisible: Controls the visibility of a view.
  * `true` makes the view visible, `false` makes the view hidden,
  * `null` will make the view visible only if it has a data binding.
  */
function setVisible( amVisible, ignore = null ) {
    if (this._visible == amVisible) return;
    this._visible = amVisible;

    // make us compatible with the new 'visibility' attribute
    if (amVisible) {
        var v = "visible";
    } else if (amVisible == null) {
        if ($debug) {
            Debug.info("%w.%s(%w) is deprecated.  Perhaps you meant %w.%s(%s)?  If not, use %w.%s('collapse').",
                       this, arguments.callee, amVisible, this, arguments.callee, false, this, this.setVisibility);
        }
        var v = "collapse";
    } else {
        var v = "hidden";
    }
    this.visibility = v;

    if (this.onvisibility.ready) this.onvisibility.sendEvent( this.visibility );
    this.__LZupdateShown();
}
 

/**
  * This method sets the <attribute>visibility</attribute> attribute of the view
  * and also disables or re-enables any click region associated with the view.
  * 
  * The argument is a string which can be "visible", "hidden", or "collapse". This
  * corresponds somewhat with the 
  *
  * Setting the value to "collapse" will cause the view to become hidden when it has
  * a datapath and there are no matching data nodes in its dataset.
  *
  * @param String amVisible: visibility of view
  * @access private
  */
function setVisibility( amVisible ) {
    if (this.visibility == amVisible) return;
    this.visibility = amVisible;
    if ($debug) {
        if (! (amVisible == "visible" || amVisible == "hidden" || amVisible == "collapse")) {
          Debug.error("%w.%s called with unknown arg '%s' use 'visible', 'hidden', or 'collapse'.",
                      this, arguments.callee, amVisible);
        }
    }
    if (this.onvisibility.ready) this.onvisibility.sendEvent( amVisible );
    this.__LZupdateShown();
}

    /**
     * TODO: max : should be made private, api call from replication should be cleaner
     * @access private
     */
override function __LZupdateShown( ) {
     if ( this.visibility == "collapse" ){
         var shown = this.__LZvizO && this.__LZvizDat && this.__LZvizLoad;
     } else {
         var shown = (this.visibility == "visible");
     }

     if ( shown != this.visible ){
         this.visible = shown;

         // FIXME: [hqm 2006-09] How do we end up with a null sprite? Some destroy ordering thing?
         if (this.sprite ) {
             this.sprite.setVisible(shown);
         }

         var ip = this.immediateparent;
         if (ip && ip.__LZcheckwidth)
             ip.__LZcheckwidthFunction( this );
         if (ip && ip.__LZcheckheight)
             ip.__LZcheckheightFunction( this );

         if (this.onvisible.ready) this.onvisible.sendEvent( shown );
     }
 }
/**
  * Sets the opacity for the view.  The opacity is a number between 0.0
  * (transparent) and 1.0 (opaque).
  * @param Number v: The new value for the opacity
  */
    function setOpacity ( v , ignore = null){
    if (this.capabilities.opacity) {
        this.sprite.setOpacity(v);
    } else if ($debug) {
        this.__warnCapability('view.setOpacity()'); 
    }
    this.opacity = v;
    if (this.onopacity.ready) this.onopacity.sendEvent( v );
    var coviz = this.__LZvizO;
    var newoviz = v != 0;
    if ( coviz != newoviz ){
        this.__LZvizO = newoviz;
        this.__LZupdateShown();
    }
}


    function setAlign ( align ){}
    function setXOffset ( o ){ }
    function setYOffset ( o ){ }


static var __LZlastmtrix:Array = [ 0,0,0,0,0,0,0,0,0,0,0 ];
    function getBounds (  ){}

    function setPosConstraint ( v , f , widthorheight ){}
    function setColor ( c ){}
    function getColor (){
    return this.sprite.getColor();
}
    function setColorTransform ( o ){}
    function getColorTransform (){}

    function getWidth (){
    return this.width;
}

function getHeight (){
    return this.height;
}

/** @access private */
function __LZcheckSize ( sview, axis , xory ){

        if ( sview.addedToParent ) {
            if ( sview.__LZhasoffset || sview.rotation != 0 ){
                var bobj = sview.getBounds();
            } else {
                var bobj = sview;
            }
            var ss = bobj[ xory ] + bobj[ axis ];

            //calculating unstretchedsize (for stretches) or just size?
            var ts = this[ "_setresc" + axis ] ?
                     this[ "unstretched" + axis ] : this[axis];

            if ( ss > ts && sview.visible ){
                this[ "__LZoutlie" + axis ] = sview;
                if (axis == "width")
                    this.updateWidth(ss);
                else
                    this.updateHeight(ss);
            } else if ( this[ "__LZoutlie" + axis ] == sview
                        && ( ss < ts || ! sview.visible ) ){
                //uhoh -- we need to recheck everything
                this.reevaluateSize( axis );
            }
        }
}

function __LZcheckwidthFunction ( sview )
{
    this.__LZcheckSize (sview, "width", "x");
}
  
/** @access private */
function __LZcheckheightFunction ( sview )
{
    this.__LZcheckSize (sview, "height", "y");
}


/**
  * to do: add dependencies so this can be used as a constraint
  * @access private
  */
function measureSize ( axis ) { }


/**
  * reports the width of the contents of the view
  * (not supported in a constraint expression)
  */
function measureWidth () {
}

/**
  * reports the height of the contents of the view
  * (not supported in a constraint expression)
  */
function measureHeight ()
{
}

/** @access private */
function updateSize ( axis , newsize ) { }

/** @access private */
function updateWidth ( newsize ){
    if ( this._setrescwidth ){
        this.unstretchedwidth = newsize;

        if ( this.hassetwidth ){
            var scale = this.width / newsize;
            this._xscale = scale;
        }

        if (this.onunstretchedwidth.ready) this.onunstretchedwidth.sendEvent( newsize );
    }

    if ( !this.hassetwidth ){
        this.width = newsize;
        this.sprite.setWidth(newsize);
        if (this.onwidth.ready) this.onwidth.sendEvent( newsize );

        if (this.immediateparent && (LzView(this.immediateparent)).__LZcheckwidth)
            (LzView(this.immediateparent)).__LZcheckwidthFunction( this );
    }

}

/** @access private */
function updateHeight ( newsize ){
    if ( this._setrescheight ){
        this.unstretchedheight = newsize;

        if ( this.hassetheight ){
            var scale = this.height / newsize;
            this._yscale = scale;
        }

        if (this.onunstretchedheight) 
            if (this.onunstretchedheight.ready) this.onunstretchedheight.sendEvent( newsize );
    }

    if ( !this.hassetheight ){
        this.height = newsize;
        this.sprite.setHeight(newsize);
        if (this.onheight.ready) this.onheight.sendEvent( newsize );

        if (this.immediateparent && (LzView(this.immediateparent)).__LZcheckheight) 
            (LzView(this.immediateparent)).__LZcheckheightFunction( this );

    }
}

/** @access private */

function reevaluateSize ( ia  = null){ 
    //if called with no args, check both
    if ( ia == null ){
        var axis = "height";
        this.reevaluateSize( "width" );
    } else {
        var axis = ia;
    }

    if ( this[ "hasset" + axis ] && ! this[ '_setresc' + axis ] )  return; 

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
        if (axis == "width")
            this.updateWidth(w);
        else
            this.updateHeight(w);
    }
}

/**
  * Since a view does not re-measure the size of its resource once that resource
  * has loaded, this method is provided to force the view to update its size, 
  * taking into account the current size of its resource. 
  */
function updateResourceSize ( ){
}


/**
  * This method is used to set a view's property to match that of
  * another view -- potentially one in another coordinate system.
  * 
  * @param String prop: a string specifying the property to set.
  * known properties are: x, y, width, and height
  * @param LzView refView: the reference view for the transformation
  */
function setAttributeRelative(prop, refView) { }

function getAttributeRelative(prop, refView ) { }

var __LZviewLinks = null;

function getLinkage( refView ) {
    if ( this.__LZviewLinks == null ){
        this.__LZviewLinks = new Object;
    }

    var uid = refView.getUID();
    if (this.__LZviewLinks[ uid ] == null ){
        //cache links for quick access
        this.__LZviewLinks[ uid ] = new LzViewLinkage(this, refView );
    }

    return this.__LZviewLinks[ uid ];
}


/**
  * @access private
  * Receives mouse events from sprites/mode manager and sends the appropriate 
  * events
  */
function mouseevent(eventname) {
    //    trace('view mouseevent', eventname, this, this[eventname].ready);
    if (this[eventname] && this[eventname].ready) this[eventname].sendEvent(this);
}    

function getMouse( xory ) { }

function containsPt( x,y ) {
   return (((this.height >= y) && (y >= 0)) &&
                ((this.width >= x) && (x >= 0)));
}

/**
  * This method makes this view the frontmost subview of this view's parent.
  * */
function bringToFront ( ){
    //this is really a function of the parent view
    //this.immediateparent.changeOrder ( this , 1);

    // FIXME: [hqm 2006-09] in some cases I have seen this.sprite unbound, is that ever OK?
    if (!this.sprite) {
        if ($debug) {
            Debug.write("no sprite on ",this);
        }
        return;
    }
    this.sprite.bringToFront();
}

/*
  * Returns an array of subviews in depth order
  * @return [LzView]: An array of this view's subviews in depth order
  */
function getDepthList (){
    var o = [];

    var s = this.subviews;
    for (var i = 0; i < s.length; i++) {
        o[i] = s[i];
    }

    o.sort(this.__zCompare);

    return o;
}
/**
  * Sort comparator for sprite z order
  * @access private
  */
function __zCompare(a, b) {
   var az = a.sprite.getZ();
   var bz = b.sprite.getZ();
   if (az < bz)
      return -1
   if (az > bz)
      return 1
   return 0
}
function sendBehind ( v ){
}

/**
  * Puts this view in front of one of its siblings.
  * @param LzView v: The view this view should go in front of. If the passed 
  * view is null or not a sibling, the method has no effect.
  * @return Boolean: Method returns true if the operation is successful.
  */
function sendInFrontOf ( v ){
}

/**
  * This method makes this view the hindmost subview of this view's parent.
  */
function sendToBack ( ){
    //this is really a function of the parent view
    //this.immediateparent.changeOrder ( this , -1);
    this.sprite.sendToBack();
}

function setResourceNumber( n ) { }

function stretchResource ( xory ) { }

function setSource ( source , cache = null, headers = null){
    this.sprite.setSource(source, cache, headers);
}

function unload ( ){
    this._resource = null;
    //this function formerly lived on the LzMakeLoad transformer
    this.sprite.unload();
}


/**
  * This function applies the MakeMasked view transformer.
  * @access private
  */
function makeMasked ( ){
    if (this.sprite) this.sprite.setClip(true);
    this.masked = true;
    this.mask = this;
}

/** @access private */
function removeMask () {
    if (this.sprite) this.sprite.setClip(false);
    this.masked = false;
    this.mask = null;
}


function __LZsetClickRegion ( cr ){
}

/**
  * Makes a view clickable or not clickable.
  * @param amclickable: Boolean indicating the view's clickability
  */
function setClickable ( amclickable , ignore = null){
    this.sprite.setClickable(amclickable);
    this.clickable = amclickable;
    if (this.onclickable.ready) this.onclickable.sendEvent( amclickable );

}


/**
  * Sets the cursor to the given resource when the mouse is over this view
  * @param String cursor: The name of the resource to use as a cursor when it is over
  * this view.
  */
function setCursor ( cursor ){ }

    
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


function setBGColor ( bgc, ignoreme = null ) {
    this.sprite.setBGColor(bgc);
    if (bgc != null) this.bgcolor = Number(bgc);
    if (this.onbgcolor.ready) this.onbgcolor.sendEvent( bgc );
}


function setX ( v, force = null ){
    //trace('setX',this,v);
    if (force || this._x != v) {
        this._x = v;
        this.x = v;
        if ( this.__LZhasoffset ){
            if (this.capabilities.rotation) {
                v -= ( this.xoffset * this.__LZrcos  -
                    this.yoffset * this.__LZrsin );
            } else {
                v -= this.xoffset;
            }
        }
        
        if ( this.pixellock ) v = Math.floor( v );
        this.sprite.setX(v)
        
        if (this.immediateparent &&  (LzView(this.immediateparent)).__LZcheckwidth)
            (LzView(this.immediateparent)).__LZcheckwidthFunction( this );
        if (this.onx.ready) this.onx.sendEvent( this.x );
    }
}



/**
  * Sets the <attribute>y</attribute> position for the view to the given value.
  * @param Number v: The new value for <attribute>y</attribute>.
  */
function setY ( v, force = null ){
    if (force || this._y != v) {
        this._y = v;
        this.y = v;
        if ( this.__LZhasoffset ){
            if (this.capabilities.rotation) {
                v -= ( this.xoffset * this.__LZrsin  +
                       this.yoffset * this.__LZrcos );
            } else {
                v -= this.yoffset;
            }
        }
        
        if ( this.pixellock ) v = Math.floor( v );
        this.sprite.setY(v)
            if (this.immediateparent && (LzView(this.immediateparent)).__LZcheckheight)
                (LzView(this.immediateparent)).__LZcheckheightFunction( this );
        if (this.ony.ready) this.ony.sendEvent( this.y );
    }
}

function setRotation ( v, ignore = null ) {
    if (this.capabilities.rotation) {
        this.sprite.setRotation(v)
    } else if ($debug) {
        this.__warnCapability('view.setRotation()'); 
    }
    this.rotation = v;
    var rrad = Math.PI /180 * this.rotation;
    this.__LZrsin = Math.sin( rrad )
    this.__LZrcos = Math.cos( rrad )
    if (this.onrotation.ready) this.onrotation.sendEvent( v );

    if ( this.__LZhasoffset ){
        this.setX( this.x, true );
        this.setY( this.y, true );
    }

    if (this.immediateparent &&  (LzView(this.immediateparent)).__LZcheckwidth)
        (LzView(this.immediateparent)).__LZcheckwidthFunction( this );
    if (this.immediateparent &&  (LzView(this.immediateparent)).__LZcheckheight)
        (LzView(this.immediateparent)).__LZcheckheightFunction( this );
}

function setWidth ( v , ignore = null){
    if (this._width != v) {
        this._width = v;
        //Debug.write('LzView.setWidth', this, v, this.sprite);
        this.sprite.setWidth(v);

        if ( v == null ){
            this.hassetwidth = false;
            // expose proto method
            this.__LZcheckwidth = true;
            if ( this._setrescwidth ){
                // will be updated by reevaluateSize
                this.unstretchedwidth = null;
                // defaults
                this._xscale = 1;
                //this.__LZmovieClipRef._xscale =  100;
            }
            this.reevaluateSize( 'width' );
            return;
        }
        this.width = v;
        if ( this.pixellock ) v = Math.floor( v );
        if ( this._setrescwidth ){
        var xscale = this.unstretchedwidth == 0 ? 100 : v/this.unstretchedwidth;
        this._xscale = xscale;
        //this.__LZmovieClipRef._xscale = xscale * 100;
        } else {
            this.__LZcheckwidth = false;
        }
        
        this.hassetwidth = true;
        
        //this.__LZbgRef._xscale = v;

        if (this.immediateparent && (LzView(this.immediateparent)).__LZcheckwidth)
            (LzView(this.immediateparent)).__LZcheckwidthFunction( this );


        if (this.onwidth.ready) this.onwidth.sendEvent( v );
    }
}


    /**
    * Sets the height of the view the given value. If the view is set to stretch
    * its resource, the resource will be resized to the new value. If the value
    * 'null' is given for the new height, then the height is unset, and the height
    * of the view will be the size measured of its contents.
  * @param Number v: The new value for the height
  */
function setHeight ( v , ignore = null){
    if (this._height != v) {
        this._height = v;
        this.sprite.setHeight(v);

        if ( v == null ){
            this.hassetheight = false;
            // expose proto method
            this.__LZcheckheight = true;

            if ( this._setrescheight ){
                // will be updated by reevaluateSize
                this.unstretchedheight = null;
                // defaults
                this._yscale = 1;
                //this.__LZmovieClipRef._yscale =  100;
            }
            this.reevaluateSize( 'height' );
            return;
        }
        this.height = v;
        if ( this.pixellock ) v = Math.floor( v );
        if ( this._setrescheight ){
            var yscale = this.unstretchedheight == 0 ? 100 : v/this.unstretchedheight;
            this._yscale = yscale;
            //this.__LZmovieClipRef._yscale = yscale * 100;
        } else {
            this.__LZcheckheight = false;
        }
        this.hassetheight = true;
        
        if (this.immediateparent && (LzView(this.immediateparent)).__LZcheckheight)
            (LzView(this.immediateparent)).__LZcheckheightFunction( this );


        if (this.onheight.ready) this.onheight.sendEvent( v );
    }
}



}


ConstructorMap[LzView.tagname] = LzView;
