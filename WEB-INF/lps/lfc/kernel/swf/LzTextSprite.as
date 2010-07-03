/**
  * LzTextSprite.as
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */
{
#pragma "warnUndefinedReferences=false"
var LzTextSprite = function(newowner, args) {
    if (newowner == null) return this;
    this.__LZdepth = newowner.immediateparent.sprite.__LZsvdepth++;
    this.__LZsvdepth = 0;

    this.owner = newowner;
    this._accProps = {};

    //inherited attributes, documented in view
    if (args['font']) this.fontname = args.font;
    if (args['fontsize']) this.fontsize = args.fontsize;
    if (args['fontstyle']) this.fontstyle = args.fontstyle;
    this.sizeToHeight = false;

    this.yscroll = 0;

    //@field Boolean resize:  text width automatically resizes when text is set.
    // default: false
    // 
    this.resize = (args['resize'] == true);

    ////////////////////////////////////////////////////////////////

    this.makeContainerResource();
    var mc = this.__LZmovieClipRef;

    // create the textfield on container movieclip - give it a unique name
    var txtname = '$LzText';
    mc.createTextField( txtname, 1, 0, 0, 100, 12 );
    var textclip = mc[txtname];

    //Debug.write('created', textclip, 'in', mc, txtname);

    this.__LZtextclip = textclip;
    this.__LZtextclip._accProps = this._accProps;
    // set a pointer back to this view from the TextField object
    textclip.__lzview = this.owner;
    this.__LZtextclip.__cacheSelection = TextField.prototype.__cacheSelection;
    textclip._visible = true;

    this.text = ((args['text'] != null) ? String(args.text) : '');

    //    textclip._quality = "BEST";
    ///   textclip._highquality = 2;

    // default to bitmap caching being on 
    if (args['cachebitmap'] == null) args.cachebitmap = true;
}

LzTextSprite.prototype = new LzSprite(null);

if ($debug) {
/** @access private */
LzTextSprite.prototype._dbg_typename = 'LzTextSprite';
}

LzTextSprite.prototype.textcolor = 0x0; // black

LzTextSprite.prototype.__initTextProperties = function (args) {
    var textclip = this.__LZtextclip;

    // conditionalize this; set to false for inputtext for back compatibility with lps 2.1
    textclip.html = true;

    textclip.autoSize = false;

    //inherited attributes, documented in view
    this.fontname = args.font;
    this.fontsize = args.fontsize;
    this.fontstyle = args.fontstyle;
    this.textcolor = args.fgcolor;
    this.__setFormat();
    textclip.htmlText = this.text;
    textclip.background = false;

    // To compute our width:
    // + if text is multiline:
    //    if no width is supplied, use parent width
    // + if text is single line:
    //    if no width was supplied and there's no constraint, measure the text width:
    //        if empty text content was supplied, use DEFAULT_WIDTH


    //(args.width == null && typeof(args.$refs.width) != "function")


    // To compute our height:
    // + If height is supplied, use it.
    // + if no height supplied:
    //    if  single line, use font line height
    //    else get height from flash textobject.textHeight 
    // 
    if (! args.hassetheight) {
        this.sizeToHeight = true;
        // set autoSize to get text measured
        textclip.autoSize = true;
        textclip.htmlText = "__ypgSAMPLE__";

        this.height = textclip._height;

        textclip.htmlText = this.text;
        if (!this.multiline) {
            // But turn off autosizing for single line text, now that
            // we got a correct line height from flash.
            textclip.autoSize = false;
        }
    } else if (args['height'] != null) {
        textclip._height = args.height;
        //this.setHeight(args.height);
    }
    // Default the scrollheight to the visible height.
    this.scrollheight = this.height;

    textclip.onScroller = this.__updatefieldsize;
    textclip.onScroller();
}



/**
  * Get a reference to the control mc
  * @access private
  */
LzTextSprite.prototype.getMCRef = function () {
    return this['__LZtextclip'];
}


/**
  * Save a copy of the current selection position/size. This is called
  * from lz.ModeManager.rawMouseEvent. This function is needed because 
  * the Selection object changes when the focus moves. By caching the
  * position, getSelectionPosition() and getSelectionSize() works during
  * this transition.
  * @access private
  */
TextField.prototype.__cacheSelection = function () {
    this.__cacheSelectionPos  = Selection.getBeginIndex();
    this.__cacheSelectionSize = Selection.getEndIndex() - Selection.getBeginIndex();
}


/**
  * @access private
  */
LzTextSprite.prototype.scroll = 0;
/**
  * @access private
  */
LzTextSprite.prototype.maxscroll = 0;
/**
  * @access private
  */
LzTextSprite.prototype.hscroll = 0;
/**
  * @access private
  */
LzTextSprite.prototype.maxhscroll = 0;
/**
 * @access private
 */
LzTextSprite.prototype.lineheight = 1;

// [todo: 2004-3-29 hqm] lines seem to get the ends clipped off if you use the TextField.textWidth
// from Flash, so I am adding a constant. Am I missing something here? 
LzTextSprite.prototype.PAD_TEXTWIDTH = 4;

LzTextSprite.prototype.classname = "LzTextSprite";

LzTextSprite.prototype.DEFAULT_SIZE = 8;

/**
  * @access private
  */
LzTextSprite.prototype._textAlign = "left";
/**
  * @access private
  */
LzTextSprite.prototype._textIndent = 0;
/**
  * @access private
  */
LzTextSprite.prototype._letterSpacing = 0;
/**
  * @access private
  */
LzTextSprite.prototype._textDecoration = "none";

/**
  * setResize set behavior of text field width when new text is added.
  * LzTextSprite only (cannot be used with LzInputText).
  * @param Boolean val: if true, the textfield will recompute it's width after setText() is called
  */
LzTextSprite.prototype.setResize = function ( val ){
    this.resize = val;
    if (this.initted) this.owner._updateSize();
}

/**
  * @access private
  */
LzTextSprite.prototype.setWidth = function ( val ){
    if (this['__LZtextclip']) {
      if (this.resize) {
        // NOTE: [2009-03-01 ptw] swf seems to have a bug that if you
        // set a text field exactly to the size measured, it may
        // trigger word-wrapping (and cause another resize!) So we add
        // a fudge-factor here, since we know a resizable text field
        // is supposed to size to its content
        this.__LZtextclip._width = val + 1;
      } else {
        this.__LZtextclip._width = val;
      }
      this.__LZforceScrollAttrs();
    }
    this._viewsetWidth( val );
    // recalculate height
    if (this.sizeToHeight) {
        this.setHeight(this.__LZtextclip._height);
    }
}

LzTextSprite.prototype._viewsetWidth = LzSprite.prototype.setWidth;


/**
  * @access private
  */
LzTextSprite.prototype.setHeight = function ( val ){
    if (this['__LZtextclip']) {
      this.__LZtextclip._height = val;
      this.__LZforceScrollAttrs();
    }
    this._viewsetHeight( val );
}
LzTextSprite.prototype._viewsetHeight = LzSprite.prototype.setHeight;


/**
  * @access private
  * Set the maximum number of chars a textfield can contain
  */
LzTextSprite.prototype.setMaxLength = function ( val ){
    // Runtime does not understand Infinity
    if (val == Infinity) { val = null; }
    this.__LZtextclip.maxChars = val;
    if (this.initted) this.owner._updateSize();
}

/**
 * @devnote [2010-06-21 ptw] (LPP-9134) The textfield pattern is just
 * the permitted character set description, without the enclosing
 * `[...]*`.  If you think using RegExp to check this condition would
 * be a better idea, see the referenced bug first.
 *
 * @access private
 */
LzTextSprite.prototype.setPattern = function ( val ){
    if (val == null || val == "") {
        this.__LZtextclip.restrict = null;
    } else if (val.substring(0,1) == "[" &&
               val.substring(val.length-2, val.length) == "]*") {
        this.__LZtextclip.restrict = val.substring(1,val.length-2);
    } else {
        Debug.error('LzTextSprite.setPattern argument %w must be of the form "[...]*"', val);
    }
}

/**
 * Calculates the current width of the text held by the text field.
 *
 * @devnote NOTE: [2009-03-01 ptw] this is _not_ the clip textWidth, which
 * "when autoSize is true is always 4 pixels less than _width" (which
 * is why we have to add 4 pixels for emulate_flash_font_metrics
 * in the DHTML version of this method, and why Henry used to add
 * PAD_TEXTWIDTH to the textWidth!)
 *
 * @devnote NOTE: [2009-03-28 ptw] But if the text is empty, we return
 * 0.  <sigh />
 */
LzTextSprite.prototype.getTextWidth = function (force){
    if (this.text == '') { return 0; }
    var textclip = this.__LZtextclip;
    var tca = textclip.autoSize;
    var tcw = textclip._width;
    var tch = textclip._height;
    var tcm = textclip.multiline;
    var tcp = textclip.wordWrap;
    // turn on autoSize/off wordWrap temporarily
    textclip.autoSize = true;
    textclip.multiline = false;
    textclip.wordWrap = false;

    var w = textclip._width;

    textclip.autoSize = tca;
    textclip._height = tch;
    textclip._width = tcw;
    textclip.multiline = tcm;
    textclip.wordWrap = tcp;

    return w;
}


/**
 * Calculates the current height of the text held by the text field.
 *
 * @devnote NOTE: [2008-06-24 ptw] this is _not_ the clip textHeight, which
 * "when autoSize is true is always 4 pixels less than _height" (which
 * is why we have to add 4 pixels for emulate_flash_font_metrics
 * in the DHTML version of this method).
 */
LzTextSprite.prototype.getTextfieldHeight = function (force){
    var textclip = this.__LZtextclip;

    var tca = textclip.autoSize;
    var tcw = textclip._width;
    var tch = textclip._height;
    var tcs = textclip.scroll;

    // turn on autoSize temporarily
    textclip.autoSize = true;
    // measure height and reset to the original values
    var h = textclip._height;

    // Measure test string if the field is empty
    if (h == 4) {
        var tct = textclip.htmlText;
        var tcp = textclip.wordWrap;
        // Make sure the test text does not wrap!
        textclip.wordWrap = false;
        textclip.htmlText = "__ypgSAMPLE__";
        var h = textclip._height;
        textclip.wordWrap = tcp;
        textclip.htmlText = tct;
    }

    textclip.autoSize = tca;
    textclip._height = tch;
    textclip._width = tcw;
    textclip.scroll = tcs;

    return h;
}

/**
 * This is the height of a single line of text in the current format
 *
 * @devnote NOTE: [2008-06-24 ptw] tip 'o the pin to
 * a.bargull@intensis.de for finding this illustration, which shows
 * the relationship of textHeight and textfieldHeight:
 * http://livedocs.adobe.com/flash/9.0/ActionScriptLangRefV3/images/text-metrics.jpg
 *
 */
LzTextSprite.prototype.getLineHeight = function ( ){
    if (! this.multiline) {
        return this.__LZtextclip.textHeight;
    } else {
        var textclip = this.__LZtextclip;

        // Cache current values
        var tcw = textclip._width;
        var tch = textclip._height;
        var tca = textclip.autoSize;
        var tct = textclip.htmlText;
        var tcp = textclip.wordWrap;

        var sf = targetPath(textclip);
        var start = -1, end;
        if (Selection.getFocus() === sf) {
            // we need to reset selection when the textclip is focused (LPP-7569)
            start = Selection.getBeginIndex();
            end = Selection.getEndIndex();
        }

        textclip.autoSize = true;
        // Make sure the test text does not wrap!
        textclip.wordWrap = false;
        textclip.htmlText = "__ypgSAMPLE__";
        var h = textclip.textHeight;

        textclip.wordWrap = tcp;
        textclip.autoSize = tca;
        textclip.htmlText = tct;
        textclip._width   = tcw;
        textclip._height  = tch;

        if (start != -1) {
            Selection.setSelection(start, end);
        }
    }
    return h;
}

/**
  * @access private
  */
LzTextSprite.prototype.setScroll = function ( h ){
    this.__LZtextclip.scroll = this.scroll = h;
}

/**
  * @access private
  */
LzTextSprite.prototype.getScroll = function ( ){
    return this.__LZtextclip.scroll;
}


/**
  * @access private
  */
LzTextSprite.prototype.getMaxScroll = function ( ){
    return this.__LZtextclip.maxscroll;
}


/**
  * @access private
  */
LzTextSprite.prototype.getBottomScroll = function ( ){
    return this.__LZtextclip.bottomScroll;
}

/**
  * Set the x scroll position of the textfield.
  * @param Number n: set the left edge of the textfield to offset
  * n pixels vertically
  * (n is always &lt; 0)
  */
LzTextSprite.prototype.setXScroll = function ( n ){
    this.__LZtextclip._x = Math.floor(Math.min(0, n));
}

LzTextSprite.prototype.lineNoToPixel = function (n:Number):Number {
  return (n - 1) * this.lineheight;
}

LzTextSprite.prototype.pixelToLineNo = function (n:Number):Number {
  return Math.round(n / this.lineheight) + 1;
}

/**
  * Set the y scroll position of the textfield.
  * @param Number n: set the top line of the textfield to offset n pixels
  * vertically (n is always &lt; 0)
  */
LzTextSprite.prototype.setYScroll = function ( n ){
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
        this.__LZtextclip.scroll = this.scroll = 1;
        this.__LZtextclip._y = Math.min(0, this.yscroll);
    } else {
        // The flash text field would have to be scrolled up beyond it's bottom, so
        // we align the bottom edge of Flash text field to the bottom of the visible text view,
        // and call the Flash line scroll function to scroll the rest of the way.
        // compute how many lines to scroll the flash text field
        var lh = this.lineheight;
        var dy = rh  - this.height;
        var excess = (- this.yscroll) - dy;
        var nlines = Math.floor(excess/lh);

        // pixels remainder of line height
        var frac = Math.round(excess - (nlines * lh));
        //Debug.write("fraction="+fraction);
        // lines are 1-based
        this.__LZtextclip.scroll = this.scroll = nlines + 1;
        // need to figure out where to put the fraction (add or subtract??)
        this.__LZtextclip._y = - Math.floor((dy + frac));
    }
}

/**
  * @access private
  */
LzTextSprite.prototype.annotateAAimg = function (txt) {
    if (typeof(txt) == "undefined") { return ''; }
    if (txt.length == 0) { return ''};
    
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
LzTextSprite.prototype.parseImgAttributes = function(attrs, str) {
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
  * Returns the field's text.
  */
LzTextSprite.prototype.getText = function() {
    return this.text;
}

/**
  * setText sets the text of the field to display
  * @param String t: the string to which to set the text
  */
  LzTextSprite.prototype.setText = function ( t ){

    // If accessibility is enabled, hunt for <img alt="...."> tags and assign and
    // put the alt tag somewhere a screen reader can find it.
    if (canvas['accessible']) {
        t = this.annotateAAimg(t);
    }

    this.text =  t;
    var mc = this.__LZtextclip;
    mc.htmlText = t;

    // single line resizable fields adjust their width to match the text
    if (this.resize && (this.multiline == false)) {
        var w = this.getTextWidth();
        // only set width if it changed
        if (w != this.width) this.setWidth(w);
    }

    // multiline resizable fields adjust their height
    if (this.multiline && this.sizeToHeight) {
      var h = mc._height;
      if (h != this.height) this.setHeight(mc._height);
    }

    if (this.multiline) {
      this.__LZforceScrollAttrs();
    }

    // Fix for lpp-5449 (reset the selection if the new text is not
    // within it)
    if (this['_selectionstart']) {
      var l = t.length;
      if (this._selectionstart > l || this._selectionend > l) {
        this.setSelection(l);
      }
    }
    if (this.initted) this.owner._updateSize();
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

/**
  * This must be called after updating the measurement. This is done for speed.
  *
  * @access private
  */
LzTextSprite.prototype.updateMaxLines = function (){
    var newlin = Math.floor( this.height / (  this.font.height -1 ) );
    if ( newlin != this.maxlines ){
        this.maxlines = newlin;
    }
    if (this.initted) this.owner._updateSize();
}


/**
  * Sets the selectability (with Ibeam cursor) of the text field
  * @param Boolean isSel: true if the text may be selected by the user
  */
LzTextSprite.prototype.setSelectable = function ( isSel ){
    this.__LZtextclip.selectable = isSel;

}

/**
  * Sets the format string for the text field.
  * @access private
  */
LzTextSprite.prototype.__setFormat = function (){
    this.setFontInfo();
    var cfontname = LzFontManager.__fontnameCacheMap[this.fontname];
    if (cfontname == null) {
        cfontname = LzFontManager.__findMatchingFont(this.fontname);
        LzFontManager.__fontnameCacheMap[this.fontname] = cfontname;
        //Debug.write("caching fontname", this.fontname, cfontname);
    }

    var tf:TextFormat = this.__LZtextclip.getTextFormat();
    if (!tf) { tf = new TextFormat(); }
    tf.size = this.fontsize;
    tf.font = (this.font == null ? cfontname : this.font.name);
    tf.color = this.textcolor;

    // If there is no font found, assume a device font
    if (this.font == null) {
        this.setEmbedFonts(false);
    } else {
        this.setEmbedFonts(true);
    }

    // Adjust style
    tf.bold = (this.fontstyle == "bold" || this.fontstyle =="bolditalic");
    tf.italic = (this.fontstyle == "italic" || this.fontstyle =="bolditalic");
    tf.underline = !!this['underline'] || this._textDecoration == "underline";
    tf.align = this._textAlign;
    tf.indent = this._textIndent;
    if (this._textIndent < 0) {
        tf.leftMargin = this._textIndent * -1;
    } else {
        tf.leftMargin = 0;
    }
    tf.letterSpacing = this._letterSpacing;

    // We want to adjust the current contents, _and_ any new contents.
    this.__LZtextclip.setNewTextFormat(tf);
    this.__LZtextclip.setTextFormat(tf);
    var lh = tf.getTextExtent('__ypgSAMPLE__').height;
    if (lh !== this.lineheight) {
      this.lineheight = lh;
      // Tell the owner the linescale has changed
      this.owner.scrollevent('lineHeight', lh);
    }
    if (this.initted) this.owner._updateSize();
}

LzTextSprite.prototype.setFontInfo = function () {
    this.font = LzFontManager.getFont( this.fontname , this.fontstyle );
}

/**
  * @access private
  */
LzTextSprite.prototype.setFontName = function ( fname ){
    this.fontname = fname;
    this.__setFormat();
    // recompute dimensions: must use clip html here -- inputtext may
    // have modified the contents
    this.setText( this.getText() );
}

/**
  * @access private
  */
LzTextSprite.prototype.setFontSize = function ( fsize ){
    this.fontsize = fsize;
    this.__setFormat();
    // recompute dimensions: must use clip html here -- inputtext may
    // have modified the contents
    this.setText( this.getText() );
}

/**
  * @access private
  */
LzTextSprite.prototype.setFontStyle = function ( fstyle ){
    this.fontstyle = fstyle;
    this.__setFormat();
    // recompute dimensions: must use clip html here -- inputtext may
    // have modified the contents
    this.setText( this.getText() );
}

/**
  * Sets the color of all the text in the field to the given hex color.
  * @param Number c: The color for the text -- from 0x0 (black) to 0xFFFFFF (white)
  */
LzTextSprite.prototype.setTextColor = function ( c ){
    if (this.textcolor === c) return;
    this.textcolor = c;
    this.__setFormat();
    // recompute dimensions: must use clip html here -- inputtext may
    // have modified the contents
    this.setText( this.getText() );
}

/**
  * Sets whether or not the textfield wraps.  If false, only a single line
  * of text will appear and extra lines will be trucated if the text is set with
  * multiple lines.
  * @param Boolean ml: true if the text field should allow multiple lines
  */
LzTextSprite.prototype.setMultiline = function ( ml ){
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
    if (this.initted) this.owner._updateSize();
}

/// extensions for flash6 
/**
  * @access private
  */
LzTextSprite.prototype.setBorder = function ( onroff ){
    this.__LZtextclip.border = (onroff == true);
}

// [todo] should wrapping be made orthogonal to the multiline flag?
/**
  * @access private
  */
LzTextSprite.prototype.setWordWrap = function ( wrap ){
    var mc = this.__LZtextclip;
    mc.wordWrap = wrap;
}


/**
  * @access private
  */
LzTextSprite.prototype.setEmbedFonts = function ( onroff ){
    this.__LZtextclip.embedFonts = (onroff == true);
}


/***
 * Sets what type of antialiasing the text field should use. Only works in swf8
 * and higher. 
 * @param aliasType "normal" or "advanced"
 */
LzTextSprite.prototype.setAntiAliasType = function( aliasType ){
    this.__LZtextclip.antiAliasType = aliasType;
}

/**
 * Gets the kind of antialiasing set on this text object
 */ 
LzTextSprite.prototype.getAntiAliasType = function() {
    return this.__LZtextclip.antiAliasType;
}

/***
 * Sets what type of gridfitting the text field should use. Only works in swf8
 * and higher. 
 * @param gridFit "none" "subpixel" or "pixel"
 */
LzTextSprite.prototype.setGridFit = function( gridFit ){
    this.__LZtextclip.gridFit = gridFit;
}

/**
 * Gets the kind of antialiasing set on this text object
 */ 
LzTextSprite.prototype.getGridFit = function() {
    return this.__LZtextclip.gridFit; 
}



/***
 * Sets the sharpness for the text rendering 
 * Only works in swf8 and higher. 
 * @param sharpness -400 to 400
 */
LzTextSprite.prototype.setSharpness = function( sharpness ){
    this.__LZtextclip.sharpness = sharpness;
}

/**
* Gets the sharpness rendering property of this text object
 */ 
LzTextSprite.prototype.getSharpness = function() {
    return this.__LZtextclip.sharpness;
}

/***
 * Sets the thickness for the text rendering 
 * Only works in swf8 and higher. 
 * @param thickness -200 to 200
 */
LzTextSprite.prototype.setThickness = function( thickness ){
     this.__LZtextclip.thickness = thickness;
}

/**
* Gets the thickness rendering property of this text object
 */ 
LzTextSprite.prototype.getThickness = function() {
    return this.__LZtextclip.thickness;
}

/**
  * @access private
  */
LzTextSprite.prototype.__LZupdateScrollAttrs = function ( ignore ) {
  this.__LZtextclip.onScroller();
}

/**
  * @access private
  */
LzTextSprite.prototype.__LZforceScrollAttrs = function ( ignore ) {
  this.__LZupdateScrollAttrs();
  // The scroll attributes don't update right away, so we have to
  // wait...
  if (! this.scrolldel) {
    this.scrolldel = new LzDelegate(this, "__LZupdateScrollAttrs");
  }
  lz.Idle.callOnIdle(this.scrolldel);
}


LzTextSprite.prototype.scrollevents = false;
LzTextSprite.prototype.setScrollEvents = function (on) {
    this.scrollevents = on;
}

/**
  * @access private
  * Note: When this is called, "this" will be the Flash TextField
  * object, not the LzTextSprite class, because this is called as a method on
  * __LZtextclip from __LZforceScrollAttrs
  */
LzTextSprite.prototype.__updatefieldsize = function ( ){
  var lzv = this.__lzview;
  var tsprite = lzv.tsprite;
  if (! tsprite.scrollevents) return;
  var scroll = this.scroll;
  if ( tsprite.scroll !== scroll) {
    tsprite.scroll = scroll;
    lzv.scrollevent('scrollTop', tsprite.lineNoToPixel(scroll));
  }
  var maxscroll = this.maxscroll;
  if (tsprite.maxscroll !== maxscroll) {
    tsprite.maxscroll = maxscroll;
    lzv.scrollevent('scrollHeight', tsprite.lineNoToPixel(maxscroll) + lzv.height);
  }
  var hscroll = this.hscroll;
  if (tsprite.hscroll !== hscroll) {
    tsprite.hscroll = hscroll;
    lzv.scrollevent('scrollLeft', hscroll);
  }
  var maxhscroll = this.maxhscroll;
  if (tsprite.maxhscroll !== maxhscroll) {
    tsprite.maxhscroll = maxhscroll;
    lzv.scrollevent('scrollWidth', maxhscroll + lzv.width);
  }
}

/**
  * 
  */
LzTextSprite.prototype.setHScroll = function (s){
    this.__LZtextclip.hscroll = s;
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
LzTextSprite.prototype.setSelection = function ( start , end=null ){
    if (end == null) { end = start; }
    var sf = targetPath( this.__LZtextclip);
    if( Selection.getFocus() != sf ) {
        Selection.setFocus( sf );
    }

    // Fix for lpp-5449
    this._selectionstart = start;
    this._selectionend = end;

    Selection.setSelection( start , end );
}

/**
  * Returns the position of the text cursor within this object. If the text
  * cursor is not inside this object, then the method returns -1.
  * @return Number: The position of the text cursor within this textfield, 0
  * based. If the text cursor is not in the textfield, this method returns -1.
  */
LzTextSprite.prototype.getSelectionPosition = function ( ){
    var sf = targetPath( this.__LZtextclip) ;
    if( Selection.getFocus() != sf ) {
        var tc = this.__LZtextclip;
        var v = tc.__lzview;
        // Use cached values if available
        if (v.blurring && tc.__cacheSelectionPos) {
            return tc.__cacheSelectionPos;
        }

        return -1;
    }
    return Selection.getBeginIndex();

}

/**
  * Returns the length of the text selection in within this object. If the text
  * cursor is not inside this object, then the method returns -1.
  * @return Number: The length of the text selection within this textfield.
  * If the text cursor is not in the textfield, this method returns -1.
  */
LzTextSprite.prototype.getSelectionSize = function ( ){
    var sf = targetPath( this.__LZtextclip);
    if( Selection.getFocus() != sf ) {
        var tc = this.__LZtextclip;
        var v = tc.__lzview;
        // Use cached values if available
        if (v.blurring && tc.__cacheSelectionSize) {
            return tc.__cacheSelectionSize;
        }

        return -1;
    }
    var siz = Selection.getEndIndex() - Selection.getBeginIndex();
    return siz;
}


LzTextSprite.prototype.enableClickableLinks = function ( enabled) {
}

LzTextSprite.prototype.textLinkHandler = function (e:TextEvent) {
    if (this.owner.ontextlink.ready) this.owner.ontextlink.sendEvent(e.text);
}

LzTextSprite.prototype.makeTextLink = function (str, value) {
    LzTextSprite.addLinkID(this.owner);
    return '<a href="asfunction:_level0.$modules.lz.__callTextLink,'+this.owner.getUID()+":" +value+'">'+str+'</a>';
}

// value is encoded as VIEWID:value
$modules.lz.__callTextLink = function (encodedVal) {
    var colon = encodedVal.indexOf(':');
    var viewID = encodedVal.substr(0, colon);
    var val = encodedVal.substr(colon+1);
    var view = LzTextSprite.linkIDMap[viewID];
    if (view != null) {
        view.ontextlink.sendEvent(val);
    }
    
}

// map from UIDs to views with clickable links.
// allows us to send ontextlink events to the owner view when user clicks on a
// hyperlink in text, via an "actionscript:" routine
LzTextSprite.linkIDMap = [];

LzTextSprite.addLinkID = function (view) {
    LzTextSprite.linkIDMap[view.getUID()] = view;
}


LzTextSprite.deleteLinkID = function (UID) {
    delete LzTextSprite.linkIDMap[UID];
}

LzTextSprite.prototype.destroy = function(){
    if (this.__LZdeleted == true) return;

    // Clean up the link ID table if this view is destroyed
    LzTextSprite.deleteLinkID(this.owner.getUID());
    if (this.scrolldel.hasevents) {
        this.scrolldel.destroy();
    }
    LzSprite.prototype.destroy.call(this, parentvalid);
}

LzTextSprite.prototype.setTextAlign = function (align) {
    this._textAlign = align;
    this.__setFormat();
    // recompute dimensions: must use clip html here -- inputtext may
    // have modified the contents
    this.setText( this.getText() );
}

LzTextSprite.prototype.setTextIndent = function (indent) {
    this._textIndent = indent;
    this.__setFormat();
    // recompute dimensions: must use clip html here -- inputtext may
    // have modified the contents
    this.setText( this.getText() );
}

LzTextSprite.prototype.setLetterSpacing = function (spacing) {
    this._letterSpacing = spacing;
    this.__setFormat();
    // recompute dimensions: must use clip html here -- inputtext may
    // have modified the contents
    this.setText( this.getText() );
}

LzTextSprite.prototype.setTextDecoration = function (decoration) {
    this._textDecoration = decoration;
    this.__setFormat();
    // note: don't need to recompute dimensions here
}
}
