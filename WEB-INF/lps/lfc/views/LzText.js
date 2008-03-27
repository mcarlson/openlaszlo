/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @affects lztext
  * @topic LFC
  * @subtopic Text
  */

/**
  * <p>This class is used for non-editable text fields (as opposed to
  * <tagname>inputtext</tagname>.  A text field can be initalized
  * with text content at compile time.</p>
  * 
  * <example>
  * 
  * &lt;canvas height="30"&gt;
  *   &lt;text&gt;Hello world!&lt;/text&gt;
  * &lt;/canvas&gt;
  * </example>
  * <p>
  * Note that certain attributes on text objects, such as opacity and rotation, only work on 
  * embedded fonts. They do not work on client fonts (also called platform fonts, native fonts, 
  * platform fonts, etc). See the Developer's Guide for details.
  * </p>
  * <seealso>
  * <dguide title="Text Views" id="text">for a discussion of how to include and manipulate text</dguide>
  * <attributes>canvas.maxtextheight canvas.maxtextwidth</attributes>
  * 
  * </seealso>
  *
  * @shortdesc The basic text display element.
  * @devnote This is for regular and input text. 
  * @lzxname text
  *
  * @initarg Boolean password
  * @initarg Boolean multiline
  * @initarg String font
  * @initarg Number fontsize
  * @initarg String fontstyle
  * @initarg Boolean resize
  * @initarg String text
  * @initarg Number maxlength:  maximum number of characters allowed in this field
  * default: null
  * @initarg String antiAliasType (swf8 only)
  * @initarg String gridFit (swf8 only)
  * @initarg Number sharpness  (swf8 only)
  * @initarg Number thickness (swf8 only)
  * @initarg String pattern:  regexp describing set of characters allowed in this field
  * Restrict the characters that can be entered to a pattern
  * specified by a regular expression.
  * 
  * Currently only the expression [ ]* enclosing a set of
  * characters or character ranges, preceded by an optional "^", is
  * supported.
  * 
  * examples: [0-9]*  ,  [a-zA-Z0-9]*,  [^0-9]*
  * default: null
  * 
  * <attribute>width</attribute> and <attribute>height</attribute> are
  * virtual properties -- they have setters and getters, but the actual
  * state is stored in the text sprite. They are documented in the superclass, LzView, as well.
  *
  * <attribute>height</attribute>: The height of the text field. A Number. If unspecified,
  * then the height of the text field will be set
  * by default to enclose the initial text value. 
  *
  * <attribute>width</attribute>: The width of the text field. A Number. If width is not explicitly
  * supplied, the text field will by default be sized to fit the width of
  * the initial text value. 
  */
// TODO [hqm 2008-01] removed "with LzFormatter" until we get mixins working
dynamic class LzText extends LzView  {

    static var tagname = 'text';

    var tsprite:LzTextSprite;

    static var getters = new LzInheritedHash(LzView.getters);
    static var defaultattrs = new LzInheritedHash(LzView.defaultattrs);
    static var options = new LzInheritedHash(LzView.options);
    static var setters = new LzInheritedHash(LzView.setters);
    static var __LZdelayedSetters:* = new LzInheritedHash(LzView.__LZdelayedSetters);
    static var earlySetters:* = new LzInheritedHash(LzView.earlySetters);


    function LzText ( parent:* = null, attrs:* = null , children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);

        // TODO [hqm 2008-01] How can we make this a static block
        // so it only needs to be once on the class, not on each instance??
        /*
        if (LzSprite.capabilities.advancedfonts) {

        LzText.setters.antiAliasType = "setAntiAliasType";
        LzText.defaultattrs.antiAliasType = "normal";
            LzText.setters.antiAliasType = "setAntiAliasType";
            LzText.defaultattrs.antiAliasType = "normal";

            LzText.setters.gridFit = "setGridFit";
            LzText.defaultattrs.gridfit = "subpixel";

        LzText.setters.sharpness = "setSharpness";
        LzText.defaultattrs.sharpness = 0;

            LzText.setters.thickness = "setThickness";
            LzText.defaultattrs.thickness = 0;

        }
        */

    }

    var maxlines = 1;
    var selectable = false;
    var antiAliasType = "normal";
    var gridFit = "subpixel";
    var sharpness = 0;
    var thickness = 0;
    
    

    var password;
    var sizeToHeight;

    var fontname;

    var yscroll;
    var xscroll;

    var scrollheight;



/** Sent whenever the text in the field changes. 
  * @lzxtype event
  */
var ontext = LzDeclaredEvent;
/** @lzxtype event 
  * @access private */
var onmaxlength = LzDeclaredEvent;
/** @lzxtype event 
  * @access private */
var onpattern = LzDeclaredEvent;
/** @lzxtype event 
  * @access private */
var onscroll = LzDeclaredEvent;
/** @lzxtype event 
  * @access private */
var onmaxscroll = LzDeclaredEvent;
/** @lzxtype event 
  * @access private */
var onhscroll = LzDeclaredEvent;
/** @lzxtype event 
  * @access private */
var onmaxhscroll = LzDeclaredEvent;

/**
  * @access private
  */
var scroll = 0;
/**
  * @access private
  */
var maxscroll = 0;
/**
  * @access private
  */
var hscroll = 0;
/**
  * @access private
  */
var maxhscroll = 0;

/** 
  * Width to use for text field if none is specified
  * @access private
  */
function getDefaultWidth () {
    return 0;
}

LzText.defaultattrs.pixellock = true;

/**
  * If true, the lines of text are wrapped to fit within the text
  * width.  (The name <varname>multiline</varname> is a misnomer.  Unwrapped text
  * can be multiple lines if it contains a <code>&lt;br /&gt;</code> 
  * or <code>&lt;p&gt;</code>
  * element, or a line break within a <code>&lt;pre&gt;</code> element.
  *
  * This attribute defaults to true if width and height are
  * explicitly specified.
  *
  * If you set multiline=true, you probably want to explicitly a
  * width for the text also; if multiline=true and you do not specify
  * a width, the system will pick an arbitrary width (100 pixels at
  * the moment).
  *
  * When multiline=true, the text is automatially re-wrapped whenever
  * the content is modified by calls to <method>setText</method>, or whenever the
  * width of the text view is modified.
  *
  * @keywords final
  * @lzxtype boolean
  * @lzxdefault "false"
  */
var multiline;

/**
  * If true, the width of the text field will be recomputed each time
  * setText() is called, so that the text view is exactly as wide as
  * the width of the widest line.  Defaults to true. 
  *
  * @lzxtype booleanLiteral
  * @modifiers read-only
  */
var resize = true;

/**
  * The text to display in this text field.
  * @lzxtype string
  */
var text;

/** @access private */ 
var colorstring = "#000000"; // black

/** @access private */
override function init () {
    super.init.apply(this, arguments);

    // [max] had to do this because text fields don't have a height until they're attached into the DOM.
    // multiline resizable fields adjust their height
    if (this.sizeToHeight) {
        var h = this.tsprite.getTextfieldHeight();
        if (h > 0) {
            this.setHeight(h);
        }
    }
}

/**
  * @access private
  */
override function construct ( parent, args ) {

    this.password = ('password' in args && args.password)  ? true : false;
    this.multiline = ('multiline' in args) ? args.multiline : null;

    super.construct(parent, args);


    //    this.sizeToHeight = false;
    this.fontname  = ('font' in args)       ? args.font      : this.searchParents( "fontname"  ).fontname ;
    this.fontsize  = ('fontsize' in args)   ? args.fontsize  : this.searchParents( "fontsize"  ).fontsize ;
    this.fontstyle = ('fontstyle' in args)  ? args.fontstyle : this.searchParents( "fontstyle" ).fontstyle ;

    args.font = this.fontname;
    args.fontsize = this.fontsize;
    args.fontstyle = this.fontstyle;
    this.tsprite.__initTextProperties(args);
    //trace("__initTextProperties", lzcoreutils.objAsString(args));

    args.font      = LzNode._ignoreAttribute;
    args.fontsize  = LzNode._ignoreAttribute;
    args.fontstyle = LzNode._ignoreAttribute;

    if ('maxlength' in args && args.maxlength != null) {
        this.setMaxLength(args.maxlength);
    }

    this.text =  (!('text' in args) || args.text == null) ? "" : args.text;
    if(this.maxlength != null && this.text.length > this.maxlength){
        this.text = this.text.substring(0, this.maxlength);
        args.text = this.text;
    }


    //this.callInherited( "construct", arguments.callee ,  parent , args );
    this.yscroll = 0;
    this.xscroll = 0;

    this.resize = ('resize' in args) ? (args.resize == true) : this.resize;
    this.setResize(this.resize);

    this.setMultiline( this.multiline );
    this.tsprite.setText( this.text );


    /*
      
    // To compute our width:
    // + if text is multiline:
    //    if no width is supplied, use parent width
    // + if text is single line:
    //    if no width was supplied and there's no constraint, measure the text width:
    //        if empty text content was supplied, use DEFAULT_WIDTH
    if (args.width == null) {
        if (this.multiline) {
            args.width = this.parent.width;
        } else {
            // if there's text content, measure its width
            if (this.text != null && this.text != '' && this.text.length > 0) {
                args.width = this.getTextWidth();
            } else {
                // Input text will have a nonzero default width, so it behaves
                // like HTML input field.
                args.width = this.getDefaultWidth();
            }
        }
    } else {
        this.setResize(false);
    }

    // To compute our height:
    // + If height is supplied, use it.
    // + if no height supplied:
    //    if  single line, use font line height
    //    else get height from flash textobject.textHeight 
    // 
    if (!this.hassetheight) {
        this.sizeToHeight = true;
    }  else {
        this.setHeight(args.height);
    }
    // Default the scrollheight to the visible height.
    this.scrollheight = this.height;

    if ('pattern' in args && args.pattern != null) {
        this.setPattern(args.pattern);
    }

    if (this.capabilities.advancedfonts) {
        if ('antiAliasType' in args && args.antiAliasType != null) {
            this.setAntiAliasType(args.antiAliasType);
        } else {
            this.setAntiAliasType("normal"); 
        }

        if ('gridFit' in args && args.gridFit != null) {
            this.setGridFit(args.gridFit);
        } else {
            this.setGridFit("subpixel");
        }

        if ('sharpness' in args && args.sharpness != null) {
            this.setSharpness(args.sharpness);
        } else {
            this.setSharpness(0);
        }

        if ('thickness' in args && args.thickness != null) {
            this.setThickness(args.thickness);
        } else {
            this.setThickness(0);
        }
    }
    */

}

/**
  * Called to create the sprite object.  May be overridden to use a specific 
  * version, e.g. LzTextSprite();
  * @access private
  */
override function __makeSprite(args) {
    this.tsprite = new LzTextSprite(this);
    this.sprite = this.tsprite;
}

/**
  * Get a reference to the control mc (overridden from LzView)
  * @access private
  */
override function getMCRef () {
    return this.tsprite.getMCRef();
//    return this.__LZtextclip;
}

/**
  * @access private
  */
LzText.setters.text = "setText";
/**
  * @access private
  */
LzText.setters.resize = "setResize";
/**
  * @access private
  */
LzText.setters.multiline = -1;
/**
  * @access private
  */
LzText.setters.yscroll = "setYScroll";
/**
  * @access private
  */
LzText.setters.xscroll = "setXScroll";

/**
  * If true, the text is selectable
  *
  * @lzxtype booleanLiteral
  * @modifiers virtual
  */
// no var decl since this is a virtual field
LzText.setters.selectable = "setSelectable";
LzText.defaultattrs.selectable = false;

/**
  * @lzxtype numberExpression
  * @modifiers read-only
  */
var maxlength; 
/** @access private */ 
LzText.setters.maxlength = "setMaxLength";

/**
  * @lzxtype string
  * @modifiers read-only
  */
var pattern; 
/** @access private */  
LzText.setters.pattern = "setPattern";


LzText.defaultattrs.clip = true;

/**
  * setResize set behavior of text field width when new text is added.
  * LzText only (cannot be used with LzInputText).
  * @param Boolean val: if true, the textfield will recompute it's width after setText() is called
  */
    function setResize ( val, ignore = null ){
    this.tsprite.setResize(val);
    this.resize = val;
}


/**
  * @access private
  */
override function setWidth ( val, ignore = null ){
    this.tsprite.setWidth(val);
    super.setWidth.apply(this, arguments);
    // recalculate height
    if (this.sizeToHeight) {
        var h = this.tsprite.getTextfieldHeight();
        if (h > 0) {
            this.setHeight(h);
        }
    }
}


/**
  * @access private
  */
/*
function updateMaxLines (){

    var newlin = Math.floor( this.height / (  this.font.height -1 ) );
    if ( newlin != this.maxlines ){
        this.maxlines = newlin;
    }
}
*/

//Abstract method
//LzText.prototype.setText

/**
  * Appends the string to the current text in the textfield.
  * @param String t: The string to add
  */
function addText ( t ){
    // TODO [hqm 2008-02] this needs to invoke the part of setText that recomputes the dimensions if needed.
    // But we want to omit the call to sprite.setText(). I don't want to refactor setText to introduce a new level
    // of function call there though.
    this.tsprite.appendText( t );
    this.text = this.tsprite.getText();
}

/**
  * Clears the text field (by setting its text to the empty string)
  */
function clearText ( ){
    this.setText( "" );
}

/**
  * @access private
  * Set the maximum number of chars a textfield can contain
  */
function setMaxLength ( val, ignore = null ){
    if (val == null || val == '') return;
    this.tsprite.setMaxLength(val);
    this.maxlength = val;
    if (this.onmaxlength.ready) this.onmaxlength.sendEvent(val);

    if(this.text && this.text.length > this.maxlength){
        this.setText (this.text, true);
    }
}

/**
  * @access private
  * Set the pattern of chars a textfield can contain
  */
function setPattern ( val, ignore = null ){
    if (val == null || val == '') return;
    this.tsprite.setPattern(val);
    this.pattern = val;
    if (this.onpattern.ready) this.onpattern.sendEvent(val);
}

/**
  * Calculates the current width of the text held by the text field.
  */
function getTextWidth ( ){
    return this.tsprite.getTextWidth();
}


/**
  * Calculates the current height of the text held by the text field.
  */
function getTextHeight ( ){
    return this.tsprite.getTextHeight();
    //return this.__LZtextclip.textHeight;
}



/**
  * @access private
  */
function applyData ( d ){
    if ( null == d ){
        this.clearText();
    } else {
        this.setText( d );
    }
}

/**
  * @access private
  */
override function toString ( ){
    return "LzText: " + this.getText();
}


if ($debug) {
/**
  * @access private
  */
function _dbg_name ( ){
  var id = super._dbg_name();
  if (id != this.toString()) {
    return id;
  } else {
    return Debug.stringEscape(this.getText(), true);
  }
}
}

/**
  * @access private
  */
function setScroll ( h, ignore = null ){
    this.tsprite.setScroll(h);
}

/**
  * @access private
  */
function getScroll ( ){
    return this.tsprite.getScroll();
}


/**
  * @access private
  */
function getMaxScroll ( ){
    return this.tsprite.getMaxScroll();
}


/**
  * @access private
  */
function getBottomScroll ( ){
    return this.tsprite.getBottomScroll();
}

/**
  * Set the x scroll position of the textfield.
  * @param Number n: set the left edge of the textfield to offset
  * n pixels 
  * (n is always &lt; 0)
  */
function setXScroll ( n, ignore = null ){
    this.tsprite.setXScroll(n);
    //this.onxscroll.sendEvent(??);
}

/**
  * Set the y scroll position of the textfield.
  * @param Number n: set the top line of the textfield to offset n pixels
  * vertically (n is always &lt; 0)
  */
function setYScroll ( n, ignore = null ){
    this.tsprite.setYScroll(n);
    //this.onyscroll.sendEvent(this.yscroll);
}

/**
  * @access private
  */
LzText.setters.font = "setFontName";
/**
  * @access private
  */
LzText.setters.fontsize = "setFontSize";
/**
  * @access private
  */
LzText.setters.fontstyle = "setFontStyle";

/**
  * @access private
  */
function annotateAAimg (txt) {
    if (typeof(txt) == "undefined") { return; }
    if (txt.length == 0) { return };
    
    var ntxt = "";
    // search for <img ...> strings
    var start = 0;
    var end = 0;
    var i;
    // pattern to search for start of img tag
    var IMGSTART = "<img ";
    while (true) {
        i = txt.indexOf( IMGSTART, start );
        if (i < 0) {
            ntxt += txt.substring(start);
            break;
        }
        // advance over the "<img " prefix
        ntxt += txt.substring(start, i+IMGSTART.length);
        start = i + IMGSTART.length;

        var attrs = {};
        end = start + this.parseImgAttributes(attrs, txt.substring(start));
        ntxt += txt.substring(start,end+1);
        if (attrs['alt'] != null) {
            var altval = attrs['alt'];
            ntxt += "[image " + altval+ "]";
        }

        start = end+1;
    }
    return ntxt;
}

// Parses HTML attributes of the form attrname="val" to attrs, up
// until a closing right pointy bracket, and returns the offset of
// that closing char.
/**
  * @access private
  */
function parseImgAttributes(attrs, str) {
    var i;
    var end = 0;
    var ATTNAME = 'attrname';
    var ATTVAL = 'attrval';
    var WHITESPACE = 'whitespace';
    var WHITESPACE2 = 'whitespace2';
    var mode = WHITESPACE;
    var smax = str.length;
    var attrname;
    var attrval;
    var delimiter;
    for (i = 0; i < smax; i++) {
        end = i;
        var c = str.charAt(i);
        if (c == ">") {
            break;
        }
        if (mode == WHITESPACE) {
            if (c != " ") {
                mode = ATTNAME;
                attrname = c;
            }
        } else if (mode == ATTNAME) {
            if ((c == " ") || (c == "=")) {
                mode = WHITESPACE2;
            } else {
                attrname += c;
            }
        } else if (mode == WHITESPACE2) {
            if ((c == " ") || (c == "=")) {
                continue;
            } else {
                mode = ATTVAL;
                delimiter = c;
                attrval = "";
            }
        } else if (mode == ATTVAL) {
            if (c != delimiter) {
                attrval += c;
            } else {
                mode = WHITESPACE;
                attrs[attrname] = attrval;
            }
        }
    }
    return end;
}

/**
  * setText sets the text of the field to display
  * @param String t: the string to which to set the text
  
  */

function setText ( t, force = null ){
    t = '' + t;
    /// TODO [hqm 2008-01] This is a setter, so we should not be using
    /// a second arg for a flag, until applyArgs is fixed to stop
    /// supplying a second arg!
    if (force != true && t == this.text) return;
    if (this.visible) this.tsprite.setVisible(this.visible);
    if (this.maxlength != null && t.length > this.maxlength){
        t = t.substring(0, this.maxlength);
    }
    this.tsprite.setText(t);
    this.text =  t;

    if (this.width == 0 || (this.resize && this.multiline == false)) {
        // single line resizable fields adjust their width to match the text
        var w = this.getTextWidth();
        // only set width if it changed
        if (w != this.width) {
            this.setWidth(w);
        }
    }

    //resizable fields adjust their height
    if (this.sizeToHeight) {
        var h = this.tsprite.getTextfieldHeight();
        if (h > 0) {
            this.setHeight(h);
        }
    }

    if (this.ontext.ready) this.ontext.sendEvent(t);
}

/**
  * Formatted output.
  * Formats its arguments using <xref
  * linkend="LzFormatter.formatToString"/> and sets the text of the
  * view to the result.
  *
  * @param string control: A control string where % indicates a
  * subsequent argument is to be substituted
  *
  * @param *... args: arguments to be formatted according to the
  * control string
  */
function format (control, args) {
    // TODO [hqm 2008-01]
    //  this.setText(this.formatToString.apply(this, arguments));
      this.setText("!formatted text not yet implemented!");
}

/**
  * This must be called after updating the measurement. This is done for speed.
  *
  * @access private
  */
function updateMaxLines (){
    var newlin = Math.floor( this.height / (  this.font.height -1 ) );
    if ( newlin != this.maxlines ){
        this.maxlines = newlin;
    }
}

/**
  * @access private
  */
    /*
      prototype.getTextWidth.dependencies = function ( who , self){
      return [ self , "text" ];
}
    */
/**
  * @access private
  */

    /*
      prototype.getTextHeight.dependencies = function ( who , self){
      return [ self , "text" ];
}
    */
/**
  * @access private
  */
    /*
      prototype.getMaxScroll.dependencies = function ( who , self){
      return [ self , "maxscroll" ];
}
    */

/**
  * Returns the string represented in the text field
  * @return: The string in the text field
  */
function getText ( ){
    return this.text;
}

/**
  * @access private
  */
    /*
      prototype.getText.dependencies = function ( who , self){
      return [ self , "text" ];
}

    */
static var escapeChars = { '>': '&gt;', '<': '&lt;'};

/**
  * Returns an escaped version of the string if called with no args. If called
  * with a string argument, returns an escaped version of that string (escaped
  * here means markup-escaped, hot http escaped.)
  * @param String ts: text string to escape
  */
function escapeText( ts ){

    var t = ts == null ? this.text : ts;

    var i;
    for ( var ec in LzText.escapeChars ){

        while( t.indexOf( ec ) > -1 ){
            i = t.indexOf( ec );
            t = t.substring( 0 , i ) + LzText.escapeChars[ ec ]  +
                t.substring( i+1 );
        }
    }

    return t;

}

/**
  * Sets the selectability (with Ibeam cursor) of the text field
  * @param Boolean isSel: true if the text may be selected by the user
  */
    public function setSelectable ( isSel, ignore = null ){
    this.selectable = isSel;
    this.tsprite.setSelectable(isSel);
}

/**
  * @access private
  */
    override function setFontName ( fname, ignore = null ){
    this.tsprite.setFontName(fname);
    this.fontname = fname;
    // force recompute of height if needed
    this.setText( this.getText(), true);
}

/**
  * @access private
  */
    function setFontSize ( fsize, ignore = null ){
    this.tsprite.setFontSize(fsize);
    this.fontsize = fsize;
    // force recompute of height if needed
    this.setText( this.getText(), true);
}

/**
  * @access private
  */
    function setFontStyle ( fstyle, ignore = null ){
    this.tsprite.setFontStyle(fstyle);
    this.fontstyle = fstyle;
 }


/**
  * Sets whether or not the textfield wraps.  If false, only a single line
  * of text will appear and extra lines will be trucated if the text is set with
  * multiple lines.
  * @param Boolean ml: true if the text field should allow multiple lines
  */
    function setMultiline ( ml, ignore = null ){
    this.tsprite.setMultiline(ml);
    this.multiline = (ml == true);
}

/// extensions for flash6 

/**
  * @access private
  */
    function setBorder ( onroff , ignore = null){
    this.tsprite.setBorder(onroff);
}

/**
  * @access private
  * @todo should wrapping be made orthogonal to the multiline flag?
  */
    function setWordWrap ( wrap , ignore = null){
    this.tsprite.setWordWrap(wrap);
}


/**
  * @access private
  */
    function setEmbedFonts ( onroff , ignore = null){
    this.tsprite.setEmbedFonts(onroff);
}

/***
 * Sets what type of antialiasing the text field should use. Only works in swf8
 * and higher. 
 * @param aliasType "normal" or "advanced"
 */
    function setAntiAliasType( aliasType , ignore = null){
    if (this.capabilities.advancedfonts) {    
        if ((aliasType == "normal") || (aliasType == "advanced")) {
            this.antiAliasType = aliasType; 
            this.tsprite.setAntiAliasType(aliasType);
        } else if ($debug) {
            Debug.warn("antiAliasType invalid, must be 'normal' or 'advanced', but you said '" + aliasType + "'");
        }        
    } else if ($debug) {
        this.__warnCapability('text.setAntiAliasType()'); 
    }
}

/**
 * Gets the kind of antialiasing set on this text object
 */ 
function getAntiAliasType() {
    if (this.capabilities.advancedfonts) {    
        return this.antiAliasType;
    } else if ($debug) {
        this.__warnCapability('text.getAntiAliasType()'); 
    }
}

/***
 * Sets what type of grid fitting the text field should use. 
 * Only works in swf8 and higher. 
 * @param gridFit "none", "pixel", or "subpixel"
 */
    function setGridFit( gridFit, ignore = null ){
    if (this.capabilities.advancedfonts) {    
        if ((gridFit == "none") || (gridFit == "pixel") || (gridFit == "subpixel")) {
            this.gridFit = gridFit; 
            this.tsprite.setGridFit(gridFit);
        } else if ($debug) {
            Debug.warn("gridFit invalid, must be 'none', 'pixel', or 'subpixel' but you said '" + gridFit + "'");
        }
    } else if ($debug) {
        this.__warnCapability('text.setGridFit()'); 
    }
}

/**
 * Gets the kind of grid fitting set on this text object
 */ 
function getGridFit() {
    if (this.capabilities.advancedfonts) {
        return this.gridFit; 
    } else if ($debug) {
        this.__warnCapability('text.getGridFit()'); 
    }
}


/***
 * Sets the sharpness for the text rendering 
 * Only works in swf8 and higher. 
 * @param sharpness -400 to 400
 */
    function setSharpness( sharpness, ignore = null ){
    if (this.capabilities.advancedfonts) {
        if  ((sharpness >= -400) && (sharpness <= 400)) {
            this.sharpness = sharpness; 
            this.tsprite.setSharpness(sharpness);
        } else if ($debug) {
            Debug.warn("sharpness out of range, must be -400 to 400");
        }        
    } else if ($debug) {
        this.__warnCapability('text.setSharpness()'); 
    }
}

/**
 * Gets the sharpness rendering property of this text object
 */ 
function getSharpness() {
    if (this.capabilities.advancedfonts) {    
        return this.sharpness; 
    } else if ($debug) {
        this.__warnCapability('text.getSharpness()'); 
    }
}


/***
 * Sets the thickness for the text rendering 
 * Only works in swf8 and higher. 
 * @param thickness -200 to 200
 */
    function setThickness( thickness , ignore = null){
    if (this.capabilities.advancedfonts) {
        if  ((thickness >= -200) && (thickness <= 200)) {
            this.thickness = thickness;
            this.tsprite.setThickness(thickness); 
        } else if ($debug) {
            Debug.warn("thickness out of range, must be -200 to 200");
        }
    } else if ($debug) {
        this.__warnCapability('text.setThickness()'); 
    }
}

/**
 * Gets the thickness rendering property of this text object
 */ 
function getThickness() {
    if (this.capabilities.advancedfonts) {    
        return this.thickness;
    } else if ($debug) {
        this.__warnCapability('text.getThickness()'); 
    }
}



/**
  * @access private
  */
//TODO Remove this
/*
function __LZforceScrollAttrs () {
    this.__LZtextclip.onScroller();
}
*/

/**
  * 
  */
    function setHScroll (s, ignore = null){
    this.tsprite.setHScroll(s);
}


/**
  * Positions the text selection within the text field. If this object does
  * not already have the focus, this has the ancillary effect of giving it the
  * focus.
  * @param Number start: The beginning of the text selection, or the position 
  * for the text cursor if no end is given. The index is 0 based.
  * @param Number end: The end of the text selection. Optional. If not given,
  * then the text cursor is positioned at the start point, but no text is 
  * selected.
  */
function setSelection ( start , end ){
    this.tsprite.setSelection(start, end);
    /*
    var sf = targetPath( this.__LZtextclip);
    if( Selection.getFocus() != sf ) {
        Selection.setFocus( sf );
    }

    if ( typeof( end ) == 'undefined' ){
        end = start;
    }

    Selection.setSelection( start , end );
    */
}

/**
  * Returns the position of the text cursor within this object. If the text
  * cursor is not inside this object, then the method returns -1.
  * @return Number: The position of the text cursor within this textfield, 0
  * based. If the text cursor is not in the textfield, this method returns -1.
  */
function getSelectionPosition ( ){
    return this.tsprite.getSelectionPosition();
    /*
    var sf = targetPath( this.__LZtextclip) ;
    if( Selection.getFocus() != sf ) {
        return -1;
    }
    return Selection.getBeginIndex();
    */
}

/**
  * Returns the length of the text selection in within this object. If the text
  * cursor is not inside this object, then the method returns -1.
  * @return Number: The length of the text selection within this textfield.
  * If the text cursor is not in the textfield, this method returns -1.
  */
function getSelectionSize ( ){
    return this.tsprite.getSelectionSize();
    /*
    var sf = targetPath( this.__LZtextclip);
    if( Selection.getFocus() != sf ) {
        return -1;
    }
    var siz = Selection.getEndIndex() - Selection.getBeginIndex();
    return siz;
    */
}

} // End of LzText

ConstructorMap[LzText.tagname] = LzText;

