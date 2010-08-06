/**
  * LzInputTextSprite.as
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
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

    // NOTE [2009-03-05 ptw] Input text is NOT html by default.  We
    // used to set this to true to fudge in the font styles as markup,
    // but now we use the clip textFormat to do that directly.  Note
    // that by setting this to false, the uses of htmlText below are
    // equivalent to using text; whereas if you enable html with
    // setHTML, then this should all magically work. :)
    textclip.html = false;

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


    // (! this.owner.hassetwidth)


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
  * Called from LzInputText#_gotFocusEvent() after focus was set by lz.Focus
  * @access private
  */
LzInputTextSprite.prototype.gotFocus = function () {
    if ( this.hasFocus ) { return; }
    this.select();
    this.hasFocus = true;
}

/**
  * Called from LzInputText#_gotBlurEvent() after focus was cleared by lz.Focus
  * @access private
  */
LzInputTextSprite.prototype.gotBlur = function () {
    this.hasFocus = false;
    this.deselect();
}

LzInputTextSprite.prototype.select = function () {
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

LzInputTextSprite.prototype.deselect = function () {
    var sf = targetPath(this.__LZtextclip);
    if( Selection.getFocus() == sf ) {
        Selection.setFocus( null );
    }
}

/**
  * Register for update on every frame when the text field gets the focus.
  * Set the behavior of the enter key depending on whether the field is
  * multiline or not.
  * 
  * @access private
  */
TextField.prototype.__gotFocus = function (oldfocus) {
    // scroll text fields horizontally back to start
    if (this.__lzview) this.__lzview.inputtextevent('onfocus');
    if (Selection.getFocus() !== targetPath(this.__LZtextclip)) {
        // stage-focus was changed within focus-in handler,
        // need to defer reassigning focus to next frame
        // https://bugs.adobe.com/jira/browse/FP-5021
        LzTimeKernel.setTimeout(this.updateStageFocus, 1);
    }
}

/**
 * This looks like a NOP, but it isn't, see __gotFocus()
 * @access private
 */
TextField.prototype.updateStageFocus = function () {
    Selection.setFocus(Selection.getFocus());
}

/**
  * @access private
  */
TextField.prototype.__lostFocus = function () {
    if (this['__handlelostFocusdel'] == null) {
        this.__handlelostFocusdel = new LzDelegate(this, "__handlelostFocus");
    }
    lz.Idle.callOnIdle(this.__handlelostFocusdel);
}

/**
  * must be called after an idle event to prevent the selection from being 
  * cleared prematurely, e.g. before a button click.  If the selection is 
  * cleared, the button doesn't send mouse events.
  * @access private
  */
TextField.prototype.__handlelostFocus = function (ignore) {
    if (this.__lzview) this.__lzview.inputtextevent('onblur');
}

/**
  * Register to be called when the text field is modified. Convert this
  * into a LFC ontext event. 
  * @access private
  */
TextField.prototype.__onChanged = function () {
    if (this.__lzview) {
        this.__owner.text = this.__owner.getText();
        this.__lzview.inputtextevent('onchange', this.__owner.text);
    }
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

// This is the text without any formatting
// NOTE [2009-03-05 ptw] Which is presumably what you want.  If you
// enable html with setHTML, you still will get the text without
// formatting.  But, how would you enter formatting in an input field
// anyways?  This is not a rich-edit-text doo-dad.
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

/**
  * @access private
  */
LzInputTextSprite.prototype.destroy = function( parentvalid = true ) {
    if (this.__LZdeleted == true) return;

    if (this.__handlelostFocusdel.hasevents) {
        this.__handlelostFocusdel.destroy();
    }
    LzTextSprite.prototype.destroy.call(this, parentvalid);
}

