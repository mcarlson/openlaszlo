/**
  * LzInputTextSprite.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * @shortdesc Used for input text.
  * 
  */
var LzInputTextSprite = function(newowner, args) {
    this.__LZdepth = newowner.immediateparent.sprite.__LZsvdepth++;
    this.__LZsvdepth = 0;

    this.owner = newowner;

    // Copied (eep!) from LzTextSprite

    //inherited attributes, documented in view
    this.fontname = args.font;
    this.fontsize = args.fontsize;
    this.fontstyle = args.fontstyle;
    this.sizeToHeight = false;

    this.yscroll = 0;
    this.xscroll = 0;

    this.resize = false;

    ////////////////////////////////////////////////////////////////

    this.masked = true;
    this.makeContainerResource();
    var mc = this.__LZmovieClipRef;

    // create the textfield on container movieclip - give it a unique name
    var txtname = '$LzText';
    mc.createTextField( txtname, 1, 0, 0, 100, 12 );
    var textclip = mc[txtname];

    //Debug.write('created', textclip, 'in', mc, txtname);

    this.__LZtextclip = textclip;
    // set a pointer back to this view from the TextField object
    textclip.__lzview = this.owner;
    textclip._visible = true;
    
    this.password = args.password  ? true : false;
    textclip.password = this.password;

}




LzInputTextSprite.prototype = new LzTextSprite(null);


/**
  * @access private
  */
LzInputTextSprite.prototype.construct = function ( parent , args ){
}

LzInputTextSprite.prototype.focusable = true;

LzInputTextSprite.prototype.__initTextProperties = function (args) {
    var textclip = this.__LZtextclip;

    // conditionalize this; set to false for inputtext for back compatibility with lps 2.1
    textclip.html = true;

    textclip.selectable = args.selectable;
    textclip.autoSize = false;

    this.setMultiline( args.multiline );

    //inherited attributes, documented in view
    this.fontname = args.font;
    this.fontsize = args.fontsize;
    this.fontstyle = args.fontstyle;
    this.__setFormat();

    this.text = args.text;

    textclip.htmlText = this.format + this.text + this.closeformat;
    textclip.background = false;

    // To compute our width:
    // + if text is multiline:
    //    if no width is supplied, use parent width
    // + if text is single line:
    //    if no width was supplied and there's no constraint, measure the text width:
    //        if empty text content was supplied, use DEFAULT_WIDTH


    //(args.width == null || args.width instanceof LzInitExpr)
    // NOTE: [2008-02-13 ptw] No one will fess up to understanding why
    // we treat the presence of a constraint on width differently than
    // height.
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
    if (args.height == null || args.height instanceof LzInitExpr) {
        this.sizeToHeight = true;
        // set autoSize to get text measured
        textclip.autoSize = true;
        textclip.htmlText = this.format + "__ypgSAMPLE__" + this.closeformat;

        this.height = textclip._height;

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


    // We do not support html in input fields. 
    if ('enabled' in this && this.enabled) {
        textclip.type = 'input';
    } else {
        textclip.type = 'dynamic';
    }

    this.__LZtextclip.__cacheSelection = TextField.prototype.__cacheSelection;
    textclip.onSetFocus = TextField.prototype.__gotFocus;
    textclip.onKillFocus = TextField.prototype.__lostFocus;
    textclip.onChanged = TextField.prototype.__onChanged;

    this.hasFocus = false;
    textclip.onScroller = this.__updatefieldsize;
}

/**
  * @access private
  */
LzInputTextSprite.prototype.gotFocus = function (  ){
    //Debug.write('LzInputTextSprite.__handleOnFocus');
    if ( this.hasFocus ) { return; }
    this.select();
    this.hasFocus = true;
}

LzInputTextSprite.prototype.select = function (  ){
    var sf = targetPath(this.__LZtextclip);

    // calling setFocus() bashes the scroll and hscroll values, so save them
    var myscroll = this.__LZtextclip.scroll;
    var myhscroll = this.__LZtextclip.hscroll;
    if( Selection.getFocus() != sf ) {
        Selection.setFocus( sf );
    }
    // restore the scroll and hscroll values
    this.__LZtextclip.scroll = myscroll;
    this.__LZtextclip.hscroll = myhscroll;
    this.__LZtextclip.background = false;
}


LzInputTextSprite.prototype.deselect = function (  ){
    var sf =  targetPath(this.__LZtextclip);
    if( Selection.getFocus() == sf ) {
        Selection.setFocus( null );
    }
}

/**
  * @access private
  */
LzInputTextSprite.prototype.gotBlur = function (  ){
    //Debug.write('LzInputTextSprite.__handleOnBlur');
    this.hasFocus = false;
    this.deselect();
}

/**
  * Register for update on every frame when the text field gets the focus.
  * Set the behavior of the enter key depending on whether the field is
  * multiline or not.
  * 
  * @access private
  */
TextField.prototype.__gotFocus = function ( oldfocus ){
    // scroll text fields horizontally back to start
    if (this.__lzview) this.__lzview.inputtextevent('onfocus');
}



/**
  * Register to be called when the text field is modified. Convert this
  * into a LFC ontext event. 
  * @access private
  */
TextField.prototype.__onChanged = function ( ){
    if (this.__lzview) this.__lzview.inputtextevent('onchange', this.text);
}

/**
  * @access private
  */
TextField.prototype.__lostFocus = function ( ){
    if (this['__handlelostFocusdel'] == null) this.__handlelostFocusdel = new LzDelegate(this, "__handlelostFocus");
    LzIdle.callOnIdle(this.__handlelostFocusdel);
}

/**
  * must be called after an idle event to prevent the selection from being 
  * cleared prematurely, e.g. before a button click.  If the selection is 
  * cleared, the button doesn't send mouse events.
  * @access private
  */
TextField.prototype.__handlelostFocus = function ( ignore ){
    //Debug.write('lostfocus', this.__lzview.hasFocus, LzFocus.lastfocus, this, LzFocus.getFocus(), this.__lzview, this.__lzview.inputtextevent);
    if (this.__lzview == LzFocus.getFocus()) {
        LzFocus.clearFocus();
        if (this.__lzview) this.__lzview.inputtextevent('onblur');
    }    
}

/**
  * Retrieves the contents of the text field for use by a datapath. See
  * <code>LzDatapath.updateData</code> for more on this.
  * @access protected
  */
LzInputTextSprite.prototype.updateData = function (){
    return this.__LZtextclip.text;
}


/**
  * Sets whether user can modify input text field
  * @param Boolean enabled: true if the text field can be edited
  */
LzInputTextSprite.prototype.setEnabled = function (enabled){
    var mc = this.__LZtextclip;
    this.enabled = enabled;
    if (enabled) {
        mc.type = 'input';
    } else {
        mc.type = 'dynamic';
    }
}

/**
  * Set the html flag on this text view
  */
LzInputTextSprite.prototype.setHTML = function (htmlp) {
    this.__LZtextclip.html = htmlp;
}

/**
  * setText sets the text of the field to display
  * @param String t: the string to which to set the text
  */
LzInputTextSprite.prototype.setText = function ( t ){
    // Keep in sync with LzTextSprite.setText()
    //Debug.write('LzInputTextSprite.setText', this, t);
    if (typeof(t) == 'undefined' || t == null) {
        t = "";
    } else if (typeof(t) != "string") {
        t = t.toString();
    }

    this.text =  t;// this.format + t if proper measurement were working
    var mc = this.__LZtextclip;

    // these must be done in this order, to get Flash to take the HTML styling
    // but not to ignore CR linebreak chars that might be in the string.
    if (mc.html) {
        mc.htmlText = this.format;
    }
    mc.text = t;
        
    /*
    if (this.resize && (this.multiline == false)) {
        // single line resizable fields adjust their width to match the text
        this.setWidth(this.getTextWidth());
    }*/

    //multiline resizable fields adjust their height
    if (this.multiline && this.sizeToHeight) {
        this.setHeight(mc._height);
    }

    if (this.multiline && this.scroll == 0 ) {
        var scrolldel = new LzDelegate(this, "__LZforceScrollAttrs");
        LzIdle.callOnIdle(scrolldel);
    }

    // Fix for lpp-5449
    var l = t.length;
    if (this._selectionstart > l || this._selectionend > l) {
        this.setSelection(l);
    }

    //@event ontext: Sent whenever the text in the field changes.
    //this.owner.ontext.sendEvent(t);
}
LzInputTextSprite.prototype.getTextfieldHeight = function ( ){
    return this.__LZtextclip._height
}

LzTextSprite.prototype.getText = function ( ){
    return this.__LZtextclip.text;
}
