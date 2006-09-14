/******************************************************************************
 * LzText.as
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: Lzswf6text 
// This is for regular and input text. 
//
//=============================================================================
var LzText = Class ( "LzText" , LzView  );
//var LzInputText = LzText; // text and input text are now the same class

LzText.prototype.defaultattrs.pixellock = true;

LzText.prototype.colorstring = "#000000"; // black

LzText.prototype._viewconstruct = LzView.prototype.construct;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.construct = function ( parent, args ) {
    //inherited attributes, documented in view
    this.fontname = args.font;
    this.fontsize = args.fontsize;
    this.fontstyle = args.fontstyle;
    this.sizeToHeight = false;

    args.font      = this._ignoreAttribute;
    args.fontsize  = this._ignoreAttribute;
    args.fontstyle = this._ignoreAttribute;

    this._viewconstruct( parent , args );

    //this.callInherited( "construct", arguments.callee ,  parent , args );
    this.yscroll = 0;
    this.xscroll = 0;

    //@field Boolean resize:  text width automatically resizes when text is set.
    // default: false
    // 
    this.resize = (args.resize == true);

    ////////////////////////////////////////////////////////////////

    this.masked = true;
    var mc = this.makeContainerResource();
    // create the textfield on container movieclip - give it a unique name
    var txtname = '$LzText';
    mc.createTextField( txtname, 1, 0, 0, 100, 12 );
    var textclip = mc[txtname];
    this.__LZtextclip = textclip;
    textclip._visible = true;
    textclip.__control = this;
    //    textclip._quality = "BEST";
    ///   textclip._highquality = 2;
    
    this.password = args.password  ? true : false;
    textclip.password = this.password;

    // conditionalize this; set to false for inputtext for back compatibility with lps 2.1
    textclip.html = true;
    //textclip.border = true; // for debugging

    this.setFont( );

    textclip.selectable = args.selectable;
    textclip.autoSize = false;

    //change to be able to use label= for texttext
    if ( args.label != null ){
        args.text = args.label;
    }

    this.text =  args.text == null ? "" : args.text;
    this.setMultiline( args.multiline );
    //this.setFormat();
    textclip.htmlText = this.format + this.text + this.closeformat;
    textclip.background = false;


    // To compute our width:
    // + if text is multiline:
    //    if no width is supplied, use parent width
    // + if text is single line:
    //    if no width was supplied and there's no constraint, measure the text width:
    //        if empty text content was supplied, use DEFAULT_WIDTH


    //(args.width == null && typeof(args.$refs.width) != "function")

    if (args.width == null) {
        // if there's text content, measure it's width
        if (this.text != null && this.text.length > 0) {
            args.width = this.getTextWidth();
        } else {
            // Empty string would result in a zero width view, which confuses
            // developers, so use something reasonable instead.
            args.width = this.DEFAULT_WIDTH;
        }
    }
    // To compute our height:
    // + If height is supplied, use it.
    // + if no height supplied:
    //    if  single line, use font line height
    //    else get height from flash textobject.textHeight 
    // 
    if (args.height == null && typeof(args.$refs.height) != "function") {
        this.sizeToHeight = true;
        // set autoSize to get text measured
        textclip.autoSize = true;
        textclip.htmlText = this.format + "__ypgSAMPLE__" + this.closeformat;

        this.setAttribute("height", textclip._height);

        textclip.htmlText = this.format + this.text + this.closeformat;
        if (!this.multiline) {
            // But turn off autosizing for single line text, now that
            // we got a correct line height from flash.
            textclip.autoSize = false;
        }
    }  else {
        textclip._height = args.height;
        //this.setHeight(args.height);
    }
    // Default the scrollheight to the visible height.
    this.scrollheight = this.height;

    //@field Number maxlength:  maximum number of characters allowed in this field
    // default: null
    // 
    if (args.maxlength != null) {
        this.setMaxLength(args.maxlength);
    }

    //@field String pattern:  regexp describing set of characters allowed in this field
    // Restrict the characters that can be entered to a pattern
    // specified by a regular expression.
    //
    // Currently only the expression [ ]* enclosing a set of
    // characters or character ranges, preceded by an optional "^", is
    // supported.
    //
    // examples: [0-9]*  ,  [a-zA-Z0-9]*,  [^0-9]*
    // default: null
    // 
    if (args.pattern != null) {
        this.setPattern(args.pattern);
    }

    textclip.onScroller = this.__updatefieldsize;


    /*    this.$SID_RESOLVE_OBJECT = function () {
        if (typeof(this.__LZmaskClip) != 'undefined') {
            this.__LZmovieClipRef.setMask(this.__LZmaskClip);
        }
        this.__LZtextclip.htmlText = this.format + this.text;
    }
    */
}

//-----------------------------------------------------------------------------
// Get a reference to the control mc
//
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.getMCRef = function () {
    return this.__LZtextclip;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.scroll = 0;
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.maxscroll = 0;
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.hscroll = 0;
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.maxhscroll = 0;

LzText.prototype._viewconstruct = LzView.prototype.construct;

//DEFAULT_WIDTH: Width to use for text field if none is specified
LzText.prototype.DEFAULT_WIDTH = 100;
// [todo: 2004-3-29 hqm] lines seem to get the ends clipped off if you use the TextField.textWidth
// from Flash, so I am adding a constant. Am I missing something here? 
LzText.prototype.PAD_TEXTWIDTH = 4;

LzText.prototype.classname = "LzText";

LzText.prototype.DEFAULT_SIZE = 8;

//---
//@keywords private
//---
LzText.prototype.setters.label = "setText";
//---
//@keywords private
//---
LzText.prototype.setters.text = "setText";
//---
//@keywords private
//---
LzText.prototype.setters.resize = "setResize";
//---
//@keywords private
//---
LzText.prototype.setters.multiline = -1;
//---
//@keywords private
//---
LzText.prototype.setters.yscroll = "setYScroll";
//---
//@keywords private
//---
LzText.prototype.setters.xscroll = "setXScroll";

//---
//@keywords private
//---
LzText.prototype.setters.selectable = "setSelectable";

//---
//@keywords private
//---
LzText.prototype.setters.maxlength = "setMaxLength";

//---
//@keywords private
//---
LzText.prototype.setters.pattern = "setPattern";


LzText.prototype.defaultattrs.clip = true;


//-----------------------------------------------------------------------------
// setResize set behavior of text field width when new text is added.
// LzText only (cannot be used with LzInputText).
// @param Boolean val: if true, the textfield will recompute it's width after setText() is called
//-----------------------------------------------------------------------------
LzText.prototype.setResize = function ( val ){
    this.resize = val;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.setFont = function ( ){
    if ( null == this.fontname ){
        this.fontname = this.searchParents( "fontname" ).fontname;
        //_root.Debug.write('searching parent for fontname', this, this.fontname,this.searchParents( "fontname" ));

    }

    if ( null == this.fontstyle ){
        this.fontstyle = this.searchParents( "fontstyle" ).fontstyle;
    }

    if ( null == this.fontsize ){
        this.fontsize = this.searchParents( "fontsize" ).fontsize;
    }

    this.font = _root.LzFontManager.getFont( this.fontname , this.fontstyle );

    if (this.font != null) {
        this.lineheight = this.font.leading + ( this.font.height *
                                                this.fontsize/ this.DEFAULT_SIZE );
    }

    this.setFormat();
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.setWidth = function ( val ){
    this.__LZtextclip._width = val;
    this._viewsetWidth( val );
    // recalculate height
    if (this.sizeToHeight) {
        this.setHeight(this.__LZtextclip._height);
    }
}

LzText.prototype._viewsetWidth = LzView.prototype.setWidth;


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.setHeight = function ( val ){
    this.__LZtextclip._height = val;
    this._viewsetHeight( val );
}

LzText.prototype._viewsetHeight = LzView.prototype.setHeight;



//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
/*
LzText.prototype.updateMaxLines = function (){

    var newlin = Math.floor( this.height / (  this.font.height -1 ) );
    if ( newlin != this.maxlines ){
        this.maxlines = newlin;
    }
}
*/

//Abstract method
//LzText.prototype.setText

//------------------------------------------------------------------------------
// Appends the string to the current text in the textfield.
// @param String t: The string to add
//------------------------------------------------------------------------------
LzText.prototype.addText =function ( t ){
    this.setText( this.getText() + t );
}

//-----------------------------------------------------------------------------
// Clears the text field (by setting its text to the empty string)
//-----------------------------------------------------------------------------
LzText.prototype.clearText = function ( ){
    this.setText( "" );
}

//-----------------------------------------------------------------------------
// @keywords private
// Set the maximum number of chars a textfield can contain
//-----------------------------------------------------------------------------
LzText.prototype.setMaxLength = function ( val ){
    this.maxlength = val;
    this.__LZtextclip.maxChars = val;
    this.onmaxlength.sendEvent(val);
}

//
// @keywords private
//
LzText.prototype.setPattern = function ( val ){
    if (val == null || val == "") {
        this.__LZtextclip.restrict = null;
    } else if (val.substring(0,1) == "[" &&
        val.substring(val.length-2, val.length) == "]*") {
            this.__LZtextclip.restrict = val.substring(1,val.length-2);
        } else {
            _root.Debug.write('LzText.setPattern argument "'+val+'" must be of the form "[...]*"');
        }
    this.onpattern.sendEvent(val);
}

//-----------------------------------------------------------------------------
// Calculates the current width of the text held by the text field.
//-----------------------------------------------------------------------------
LzText.prototype.getTextWidth = function ( ){
    var mc = this.__LZtextclip;
    var ml = mc.multiline;
    var mw = mc.wordWrap;
    mc.multiline = false;
    mc.wordWrap = false;
    var twidth = mc.textWidth + this.PAD_TEXTWIDTH;
    mc.multiline = ml;
    mc.wordWrap = mw;
    return twidth;
}


//-----------------------------------------------------------------------------
// Calculates the current height of the text held by the text field.
//-----------------------------------------------------------------------------
LzText.prototype.getTextHeight = function ( ){
    return this.__LZtextclip.textHeight;
}



//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.applyData = function ( d ){
    if ( null == d ){
        this.clearText();
    } else {
        this.setText( d );
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.toString = function ( ){
    return "LzText: " + this.getText();
}



//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.setScroll = function ( h ){
    this.__LZtextclip.scroll = h;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.getScroll = function ( ){
    return this.__LZtextclip.scroll;
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.getMaxScroll = function ( ){
    return this.__LZtextclip.maxscroll;
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.getBottomScroll = function ( ){
    return this.__LZtextclip.bottomScroll;
}

//-----------------------------------------------------------------------------
// Set the x scroll position of the textfield.
// @param Number n: set the left edge of the textfield to offset
// n pixels vertically
// (n is always &lt; 0)
//-----------------------------------------------------------------------------
LzText.prototype.setXScroll = function ( n ){
    this.__LZtextclip._x = Math.floor(Math.min(0, n));
    this.xscroll = this.__LZtextclip._x;

    this.onxscroll.sendEvent(this.__LZtextclip._x);
}

//-----------------------------------------------------------------------------
// Set the y scroll position of the textfield.
// @param Number n: set the top line of the textfield to offset n pixels
//           vertically (n is always &lt; 0)
//-----------------------------------------------------------------------------
LzText.prototype.setYScroll = function ( n ){
    // Implementation note: This uses both the simple mechanism of
    // offsetting the _y of the text field and also attempts to use
    // the scroll/maxscroll feature of Flash text, in order to scroll
    // through large documents that will overflow the flash textfield
    // height. The Flash text scroll mechanism works with lines of
    // text, rather than pixels, so we do a conversion using the
    // fontheight to get the line height.

    // Actual underling flash text field height
    var rh = this.__LZtextclip._height;
    this.yscroll = Math.round(Math.min(0, n));

    // Now we know what our desired yscroll is, so lets figure out
    // which things to shift to get us that effect.

    // Entire flash text field covers the visible textview height
    if ((rh + this.yscroll) >= this.height) {
        this.__LZtextclip.scroll = 0;
        this.__LZtextclip._y = Math.min(0, this.yscroll);
    } else {
        // The flash text field would have to be scrolled up beyond it's bottom, so
        // we align the bottom edge of Flash text field to the bottom of the visible text view,
        // and call the Flash line scroll function to scroll the rest of the way.
        // compute how many lines to scroll the flash text field
        var lh = this.lineheight;
        var dy = (rh - lh) - this.height;
        var excess = (- this.yscroll) - dy;
        var nlines = Math.floor(excess/lh);

        // pixels remainder of line height
        var frac = Math.round(excess - (nlines * lh));
        // _root.Debug.write("fraction="+fraction);
        /// +++ CHECK THIS HOW YOU SCROLL TEXT6
        this.__LZtextclip.scroll = nlines;
        // need to figure out where to put the fraction (add or subtract??)
        this.__LZtextclip._y = - Math.floor((dy + frac));
    }
    this.onyscroll.sendEvent(this.yscroll);
}

//---
//@keywords private
//---
LzText.prototype.setters.font = "setFontName";
//---
//@keywords private
//---
LzText.prototype.setters.fontsize = "setFontSize";
//---
//@keywords private
//---
LzText.prototype.setters.fontstyle = "setFontStyle";

LzText.prototype.defaultattrs.selectable = false;

//---
//@keywords private
//---
LzText.prototype.annotateAAimg = function (txt) {
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
//---
//@keywords private
//---
LzText.prototype.parseImgAttributes = function(attrs, str) {
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

//-----------------------------------------------------------------------------
// setText sets the text of the field to display
//
// @param String t: the string to which to set the text
//-----------------------------------------------------------------------------
LzText.prototype.setText = function ( t ){
    if (typeof(t) == 'undefined' || t == null) {
        t = "";
    } else if (typeof(t) != "string") {
        t = t.toString();
    }

    // If accessibility is enabled, hunt for <img alt="...."> tags and assign and
    // put the alt tag somewhere a screen reader can find it.
    if (canvas.accessible) {
        t = this.annotateAAimg(t);
    }

    this.text =  t;// this.format + t if proper measurement were working
    var mc = this.__LZtextclip;

    mc.htmlText = this.format + t + this.closeformat;
        
    if (this.resize && (this.multiline == false)) {
        // single line resizable fields adjust their width to match the text
        var w = this.getTextWidth();
        // only set width if it changed
        if (w != this.width) this.setWidth(w);
    }

    //multiline resizable fields adjust their height
    if (this.sizeToHeight) {
        this.setHeight(mc._height);
    }

    if (this.multiline && this.scroll == 0 ) {
        var scrolldel = new LzDelegate(this, "__LZforceScrollAttrs");
        _root.LzIdle.callOnIdle(scrolldel);
    }

    //@event ontext: Sent whenever the text in the field changes.
    this.ontext.sendEvent( );
}

// @field Number height: The height of the text field. If unspecified,
// then the height of the text field will be set
// by default to enclose the initial text value.

//@field Number width: The width of the text field. If width is not explicitly
//supplied, the text field will by default be sized to fit the width of
//the initial text value.

//@field String text: The text to display in this text field.
//@field String label: deprecated use "text" instead

//@field Boolean multiline: If true, the text field will automatically wrap
//long lines of text at the right margin, and allow the user to
//press enter on their keyboard to add a line break to the text.
//default: false

//-----------------------------------------------------------------------------
// This must be called after updating the measurement. This is done for speed.
//
// @keywords private
//-----------------------------------------------------------------------------

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.updateMaxLines = function (){
    var newlin = Math.floor( this.height / (  this.font.height -1 ) );
    if ( newlin != this.maxlines ){
        this.maxlines = newlin;
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.getTextWidth.dependencies = function ( who , self){
      return [ self , "text" ];
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------

LzText.prototype.getTextHeight.dependencies = function ( who , self){
      return [ self , "text" ];
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.getMaxScroll.dependencies = function ( who , self){
      return [ self , "maxscroll" ];
}


//-----------------------------------------------------------------------------
// Returns the string represented in the text field
// @return: The string in the text field
//-----------------------------------------------------------------------------
LzText.prototype.getText = function ( ){
    return this.text;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzText.prototype.getText.dependencies = function ( who , self){
      return [ self , "text" ];
}


LzText.prototype.escapeChars = { };
LzText.prototype.escapeChars[ '>' ] = '&gt;';
LzText.prototype.escapeChars[ '<' ] = '&lt;';

//-----------------------------------------------------------------------------
// Returns an escaped version of the string if called with no args. If called
// with a string argument, returns an escaped version of that string (escaped
// here means markup-escaped, hot http escaped.)
// @param String ts: text string to escape
//-----------------------------------------------------------------------------
LzText.prototype.escapeText = function( ts ){

    var t = ts == null ? this.text : ts;

    var i;
    for ( var ec in this.escapeChars ){

        while( t.indexOf( ec ) > -1 ){
            i = t.indexOf( ec );
            t = t.substring( 0 , i ) + this.escapeChars[ ec ]  +
                t.substring( i+1 );
        }
    }

    return t;

}

//-----------------------------------------------------------------------------
// Sets the selectability (with Ibeam cursor) of the text field
// @param Boolean isSel: true if the text may be selected by the user
//-----------------------------------------------------------------------------
LzText.prototype.setSelectable = function ( isSel ){
    this.__LZtextclip.selectable = isSel;

}

//-----------------------------------------------------------------------------
// Sets the format string for the text field.
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.setFormat = function (){
    var mapped = LzFontManager.__fontnameCacheMap[this.fontname];
    var cfontname;
    if (mapped != null) {
        //_root.Debug.write("found cached font", this.fontname, mapped);
        cfontname = mapped;
    } else {
        cfontname = LzFontManager.__findMatchingFont(this.fontname);
        LzFontManager.__fontnameCacheMap[this.fontname] = cfontname;
        //_root.Debug.write("caching fontname", this.fontname, cfontname);
    }

    this.format ="<FONT FACE=\"" + (this.font == null ? cfontname : this.font.name) +
        "\" SIZE=\"" + this.fontsize + "\" " +
        "COLOR=\"" + this.colorstring + "\" >";
    this.closeformat = "</FONT>";

    // If there is no font found, assume a device font
    if (this.font == null) {
        this.setEmbedFonts(false);
    } else {
        this.setEmbedFonts(true);
    }

    if (this.fontstyle == "bold" || this.fontstyle =="bolditalic"){
        this.format += "<B>";
        this.closeformat = "</B>" + this.closeformat;
    }

    if (this.fontstyle == "italic" || this.fontstyle =="bolditalic"){
        this.format += "<I>";
        this.closeformat = "</I>" + this.closeformat;
    }
    if (this.underline){
        this.format += "<U>";
        this.closeformat = "</U>" + this.closeformat;
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.setFontName = function ( fname ){
    this.fontname = fname;
    this.setFont();
    // force recompute of height if needed
    this.setText( this.getText());
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.setFontSize = function ( fsize ){
    this.fontsize = fsize;
    this.setFont();
    // force recompute of height if needed
    this.setText( this.getText() );

}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.setFontStyle = function ( fstyle ){
    this.fontstyle = fstyle;
    this.setFont();
    // force recompute of height if needed
    this.setText( this.getText() );
}

//-----------------------------------------------------------------------------
// Sets the color of all the text in the field to the given hex color.
// @param Number c: The color for the text -- from 0x0 (black) to 0xFFFFFF (white)
//-----------------------------------------------------------------------------
LzText.prototype.setColor = function ( c ){
    this.colorstring = "#" + c.toString( 16 );
    this.setFormat();
    this.setText( this.getText() );
}

//-----------------------------------------------------------------------------
// Sets whether or not the textfield wraps.  If false, only a single line
// of text will appear and extra lines will be trucated if the text is set with
// multiple lines.
// @param Boolean ml: true if the text field should allow multiple lines
//-----------------------------------------------------------------------------
LzText.prototype.setMultiline = function ( ml ){
    this.multiline = (ml == true);
    var mc = this.__LZtextclip;
    if (this.multiline) {
        mc.multiline = true;
        mc.wordWrap = true;
        //mc.autoSize = true;
    } else {
        mc.multiline = false;
        mc.wordWrap = false;
        //mc.autoSize = false;
    }
}

/// extensions for flash6 
//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.setBorder = function ( onroff ){
    this.__LZtextclip.border = (onroff == true);
}

// [todo] should wrapping be made orthogonal to the multiline flag?
//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.setWordWrap = function ( wrap ){
    var mc = this.__LZtextclip;
    mc.wordWrap = wrap;
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.setEmbedFonts = function ( onroff ){
    this.__LZtextclip.embedFonts = (onroff == true);
}



//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzText.prototype.__LZforceScrollAttrs = function () {
    this.__LZtextclip.onScroller();
}

//------------------------------------------------------------------------------
// @keywords private
//
// Note: When this is called, "this" will be the Flash TextField
// object, not the LzText class, because this is called as a method on
// __LZtextclip from __LZforceScrollAttrs
//------------------------------------------------------------------------------
LzText.prototype.__updatefieldsize = function ( ){
    if ( this.__control.scroll != this.scroll) {
        this.__control.scroll = this.scroll;
        this.__control.onscroll.sendEvent(this.scroll)
    }
    if (this.__control.maxscroll != this.maxscroll) {
        this.__control.maxscroll = this.maxscroll;
        this.__control.onmaxscroll.sendEvent(this.maxscroll)
    }
    if (this.__control.hscroll != this.hscroll) {
        this.__control.hscroll = this.hscroll;
        this.__control.onmaxscroll.sendEvent(this.hscroll)
    }
    if (this.__control.maxhscroll != this.maxhscroll) {
        this.__control.maxhscroll = this.maxhscroll;
        this.__control.onmaxscroll.sendEvent(this.maxhscroll)
    }
}

//------------------------------------------------------------------------------
// 
//------------------------------------------------------------------------------
LzText.prototype.setScroll = function (s){
    this.__LZtextclip.scroll = s;
}

//------------------------------------------------------------------------------
// 
//------------------------------------------------------------------------------
LzText.prototype.setHScroll = function (s){
    this.__LZtextclip.hscroll = s;
}


//------------------------------------------------------------------------------
// Positions the text selection within the text field. If this object does
// not already have the focus, this has the ancillary effect of giving it the
// focus.
// @param Number start: The beginning of the text selection, or the position 
// for the text cursor if no end is given. The index is 0 based.
// @param Number end: The end of the text selection. Optional. If not given,
// then the text cursor is positioned at the start point, but no text is 
// selected.
//------------------------------------------------------------------------------
LzText.prototype.setSelection = function ( start , end ){
    var sf = targetPath( this.__LZtextclip);
    if( Selection.getFocus() != sf ) {
        Selection.setFocus( sf );
    }

    if ( typeof( end ) == 'undefined' ){
        end = start;
    }

    Selection.setSelection( start , end );
}

//------------------------------------------------------------------------------
// Returns the position of the text cursor within this object. If the text
// cursor is not inside this object, then the method returns -1.
// @return Number: The position of the text cursor within this textfield, 0
// based. If the text cursor is not in the textfield, this method returns -1.
//------------------------------------------------------------------------------
LzText.prototype.getSelectionPosition = function ( ){
    var sf = targetPath( this.__LZtextclip) ;
    if( Selection.getFocus() != sf ) {
        return -1;
    }
    return Selection.getBeginIndex();

}

//------------------------------------------------------------------------------
// Returns the length of the text selection in within this object. If the text
// cursor is not inside this object, then the method returns -1.
// @return Number: The length of the text selection within this textfield.
// If the text cursor is not in the textfield, this method returns -1.
//------------------------------------------------------------------------------
LzText.prototype.getSelectionSize = function ( ){
    var sf = targetPath( this.__LZtextclip);
    if( Selection.getFocus() != sf ) {
        return -1;
    }
    var siz = Selection.getEndIndex() - Selection.getBeginIndex();
    return siz;
}





////////////////////////////////////////////////////////////////
// For KRANK, don't serialize these fields
TextField.prototype.$SID_TRANSIENT = {
    styleSheet : _root.LzSerializer.transient,
    mouseWheelEnabled : _root.LzSerializer.transient,
    condenseWhite : _root.LzSerializer.transient,
    restrict : _root.LzSerializer.transient,
    textHeight : _root.LzSerializer.transient,
    textWidth : _root.LzSerializer.transient,
    bottomScroll : _root.LzSerializer.transient,
    length : _root.LzSerializer.transient,
    maxChars : _root.LzSerializer.transient,
    maxhscroll : _root.LzSerializer.transient,
    maxscroll : _root.LzSerializer.transient,
    text : _root.LzSerializer.transient


// These are ones which enumerate and should be serialized
//  selectable 
//  multiline 
//  password 
//  wordWrap 
//  background 
//  border 
//  html 
//  embedFonts 
//  hscroll 
//    variable 
//  htmlText 
//  type 

//  autoSize 
//    tabIndex 
//  textColor 
//  backgroundColor 
//  borderColor 
//  scroll 
}


