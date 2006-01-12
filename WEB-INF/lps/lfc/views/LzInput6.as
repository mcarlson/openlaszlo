/******************************************************************************
 * LzText.as
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzNewInputText
// This class is used for input text.
//
//=============================================================================
var LzInputText = Class ( "LzInputText" , LzText  );

// +++ Hey, are we still saying that input text is non- HTML ? 
// If so then we need to override a number of methods in LzText which


LzInputText.prototype.defaultattrs.selectable = true;
LzInputText.prototype.defaultattrs.enabled = true;


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzInputText.prototype.construct = function ( parent , args ){

    super.construct(  parent , args );

    var mc = this.__LZtextclip;

    // We do not support html in input fields. 
    if (this.enabled) {
        mc.type = 'input';
    } else {
        mc.type = 'dynamic';
    }

    // set a pointer back to this view from the TextField object
    this.__LZtextclip.__lzview = this;
    mc.onSetFocus = TextField.prototype.__gotFocus;
    mc.onKillFocus = TextField.prototype.__lostFocus;
    mc.onChanged = TextField.prototype.__onChanged;

    // handle onkeydown events

    this.onfocusDel = new _root.LzDelegate( this , "handleOnFocus" , this ,
                                            "onfocus" );
    this.onblurDel = new _root.LzDelegate( this , "handleOnBlur" , this ,
                                            "onblur" );

    this.hasFocus = false;

}

// [hqm]??? what did this do?
//Object.class.extends( LzText, LzInputText );

LzInputText.prototype.focusable = true;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzInputText.prototype.handleOnFocus = function (  ){
    if ( this.hasFocus ) { return; }
    var sf = targetPath(this.__LZtextclip);

    // calling setFocus() seems to bash the scroll value, so save it
    var myscroll = this.__LZtextclip.scroll;
    if( Selection.getFocus() != sf ) {
        Selection.setFocus( sf );
    }
    this.__LZtextclip.hscroll = 0;
    // restore the scroll value
    this.__LZtextclip.scroll = myscroll;
    this.hasFocus = true;
    this.__LZtextclip.background = false;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzInputText.prototype.handleOnBlur = function (  ){
    this.hasFocus = false;
    var sf =  targetPath(this.__LZtextclip);
    if( Selection.getFocus() == sf ) {
        Selection.setFocus( null );
    }
}

//-----------------------------------------------------------------------------
// Register for update on every frame when the text field gets the focus.
// Set the behavior of the enter key depending on whether the field is
// multiline or not.
//
// @keywords private 
//-----------------------------------------------------------------------------
TextField.prototype.__gotFocus = function ( oldfocus ){
    // scroll text fields horizontally back to start
    if (!(LzFocus.getFocus() == this.__lzview)) {
        var tabdown = LzKeys.isKeyDown('tab');
        _root.LzFocus.setFocus(this.__lzview, tabdown);
    }
}



//-----------------------------------------------------------------------------
// Register to be called when the text field is modified. Convert this
// into a LFC ontext event. 
// @keywords private 
//-----------------------------------------------------------------------------
TextField.prototype.__onChanged = function ( ){
    //this.__lzview.setText(this.text);
    this.__lzview.ontext.sendEvent( );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
TextField.prototype.__lostFocus = function ( ){
    if (this['__handlelostFocusdel'] == null) this.__handlelostFocusdel = new LzDelegate(this, "__handlelostFocus");
    _root.LzIdle.callOnIdle(this.__handlelostFocusdel);
}

//-----------------------------------------------------------------------------
// must be called after an idle event to prevent the selection from being 
// cleared prematurely, e.g. before a button click.  If the selection is 
// cleared, the button doesn't send mouse events.
// @keywords private
//-----------------------------------------------------------------------------
TextField.prototype.__handlelostFocus = function ( ){
    //_root.Debug.write('lostfocus', this.__lzview.hasFocus, dunno, LzFocus.lastfocus, this, LzFocus.getFocus(), this.__lzview);
    if (this.__lzview.hasFocus) LzFocus.clearFocus();
}

//------------------------------------------------------------------------------
// Retrieves the contents of the text field for use by a datapath. See
// <code>LzDatapath.updateData</code> for more on this.
// @keywords protected
//------------------------------------------------------------------------------
LzInputText.prototype.updateData = function (){
    return this.__LZtextclip.text;
}


//------------------------------------------------------------------------------
// Sets whether user can modify input text field
// @param Boolean enabled: true if the text field can be edited
//------------------------------------------------------------------------------
LzInputText.prototype.setEnabled = function (enabled){
    var mc = this.__LZtextclip;
    this.enabled = enabled;
    if (enabled) {
        mc.type = 'input';
    } else {
        mc.type = 'dynamic';
    }
}

//---
//@keywords private
//---
LzInputText.prototype.setters.enabled = "setEnabled";

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzInputText.prototype.getText = function ( ){
    return this.__LZtextclip.text;
}

LzInputText.prototype.getText.dependencies = function ( who , self){
      return [ self , "text" ];
}


//-----------------------------------------------------------------------------
// Set the html flag on this text view
//-----------------------------------------------------------------------------
LzInputText.prototype.setHTML = function (htmlp) {
    this.__LZtextclip.html = htmlp;
}

//-----------------------------------------------------------------------------
// setText sets the text of the field to display
//
// @param String t: the string to which to set the text
//-----------------------------------------------------------------------------
LzInputText.prototype.setText = function ( t ){
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
        
    if (this.resize && (this.multiline == false)) {
        // single line resizable fields adjust their width to match the text
        this.setWidth(this.getTextWidth());
    }

    //multiline resizable fields adjust their height
    if (this.multiline && this.sizeToHeight) {
        this.setHeight(mc._height);
    }

    if (this.multiline && this.scroll == 0 ) {
        var scrolldel = new LzDelegate(this, "__LZforceScrollAttrs");
        _root.LzIdle.callOnIdle(scrolldel);
    }

    //@event ontext: Sent whenever the text in the field changes.
    this.ontext.sendEvent( );
}

