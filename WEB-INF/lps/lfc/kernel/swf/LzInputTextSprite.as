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
    this._accProps = {};

    // Copied (eep!) from LzTextSprite

    //inherited attributes, documented in view
    this.fontname = args.font;
    this.fontsize = args.fontsize;
    this.fontstyle = args.fontstyle;
    this.sizeToHeight = false;

    this.yscroll = 0;
    this.xscroll = 0;

    //@field Boolean resize:  text width automatically resizes when text is set.
    // default: false
    // 
    this.resize = (args.resize == true);

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
    this.__LZtextclip._accProps = this._accProps;
    // set a pointer back to this view from the TextField object
    textclip.__owner = this;
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
    if (args['height'] == null) {
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
    }  else if (! (args.height is LzValueExpr)) {
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
    if (this.__lzview) {
        this.__owner.text = this.__owner.getText();
        this.__lzview.inputtextevent('onchange', this.__owner.text);
    }
}

/**
  * @access private
  */
TextField.prototype.__lostFocus = function ( ){
    if (this['__handlelostFocusdel'] == null) this.__handlelostFocusdel = new LzDelegate(this, "__handlelostFocus");
    lz.Idle.callOnIdle(this.__handlelostFocusdel);
}

/**
  * must be called after an idle event to prevent the selection from being 
  * cleared prematurely, e.g. before a button click.  If the selection is 
  * cleared, the button doesn't send mouse events.
  * @access private
  */
TextField.prototype.__handlelostFocus = function ( ignore ){
    //Debug.write('lostfocus', this.__lzview.hasFocus, lz.Focus.lastfocus, this, lz.Focus.getFocus(), this.__lzview, this.__lzview.inputtextevent);
    if (this.__lzview == lz.Focus.getFocus()) {
        lz.Focus.clearFocus();
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

LzInputTextSprite.prototype.getTextfieldHeight = function ( ){
    return this.__LZtextclip._height
}

// This is the text without any formatting
LzInputTextSprite.prototype.getText = function ( ){
  // We normalize swf's \r to \n
  return this.__LZtextclip.text.split('\r').join('\n');
}

/**
 * If a mouse event occurs in an input text field, find the focused view
 */
LzInputTextSprite.findSelection = function ( ){
    var ss = Selection.getFocus();
    if ( ss != null ){
        var focusview = eval(ss + '.__lzview');
        //Debug.warn("Selection.getFocus: %w, %w, %w", focusview, ss);
        if ( focusview != undefined ) return focusview;
    }
}
