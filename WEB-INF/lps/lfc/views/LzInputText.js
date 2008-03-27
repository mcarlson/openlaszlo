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
  * <p>This tag creates an area of the canvas that the user can use to
  * edit text.  It is equivalent to the HTML <code>&lt;input
  * type="text"&gt;</code>, <code>&lt;input type="password"&gt;</code>,
  * and <code>textarea</code> tags.</p>
  * <p>See the documentation for the <tagname link="true">text</tagname>
  * tag for a description of the <attribute>width</attribute> and <attribute>height</attribute> attributes,
  * and of scrolling.</p>
  * <h2>Single-line input text</h2>
  * 
  * <p>With the <attribute>multiline</attribute> and
  * <attribute>password</attribute> attributes set to <code>false</code>
  * (the default), this tag is similar to the HTML <code>&lt;input
  * type="text"&gt;</code> tag.  In this use, long lines of text are
  * clipped according to the <attribute>width</attribute> attribute.</p>
  * 
  * <example title="Simple inputtext"><programlisting>&lt;canvas height="50"&gt;
  *   &lt;inputtext width="150"&gt;This text is editable.&lt;/inputtext&gt;
  * &lt;/canvas&gt;</programlisting></example>
  * 
  * <h2>Multi-line input text</h2>
  * 
  * <p>With the <attribute>multiline</attribute> attribute set to
  * <code>true</code>, this tag is similar to the HTML
  * <code>&lt;textarea&gt;</code> tag.  In this use, text is wrapped to
  * the length of the <attribute>width</attribute> attribute, and the user
  * can press Enter to create multiple lines of input.</p>
  * 
  * <example title="Simple inputtext"><programlisting>&lt;canvas height="20"&gt;
  *   &lt;inputtext width="150" multiline="true"&gt;This text is editable.&lt;/inputtext&gt;
  * &lt;/canvas&gt;</programlisting></example>
  * 
  * <h2>Passwords</h2>
  * 
  * <p>With <attribute>password</attribute> set to <code>true</code>, this
  * tag is similar to the HTML <code>&lt;input type="password"&gt;</code>
  * tag.  Input characters are displayed as the asterisk
  * ('<code>*</code>') character.</p>
  * 
  * <example title="Password inputtext"><programlisting>&lt;canvas height="20"&gt;
  *   &lt;inputtext width="100" password="true"&gt;password.&lt;/inputtext&gt;
  * &lt;/canvas&gt;</programlisting></example>
  * 
  * @shortdesc The basic input-text element.
  * @lzxname inputtext
  */
dynamic public class LzInputText extends LzText {

    public static var tagname = 'inputtext';
    /**
     * Called to create the sprite object.  May be overridden to use a specific 
     * version, e.g. LzTextSprite();
     * @access private
     */
    override function __makeSprite(args) {
        this.tsprite = new LzInputTextSprite(this, args);
        this.sprite = tsprite;
    }

    static var getters              = new LzInheritedHash(LzText.getters);
    static var defaultattrs         = new LzInheritedHash(LzText.defaultattrs);
    static var options              = new LzInheritedHash(LzText.options);
    static var setters              = new LzInheritedHash(LzText.setters);
    static var __LZdelayedSetters:* = new LzInheritedHash(LzText.__LZdelayedSetters);
    static var earlySetters:*       = new LzInheritedHash(LzText.earlySetters);


   function LzInputText ( parent:* , attrs:* = null, children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
        trace("making LzInputText", attrs);
        focusable = true;  // Defined in LzView
    }

/** @lzxtype event */
var onmode = LzDeclaredEvent;

/** @lzxtype event */
var onenabled = LzDeclaredEvent;

/** @lzxtype event */
var onselect = LzDeclaredEvent;

/** 
  * Width to use for text field if none is specified
  * @access private
  */
override function getDefaultWidth () {
    return 100;
}

defaultattrs.selectable = true;
defaultattrs.enabled = true;

    var _onfocusDel;
    var _onblurDel;
    var _modemanagerDel;

/**
  * @access private
  */
override function construct ( parent , args ){
    super.construct(parent, args);

    this._onfocusDel = new LzDelegate( this , "_gotFocusEvent" , this,
                                            "onfocus" );
    this._onblurDel = new LzDelegate( this , "_gotBlurEvent" , this,
                                            "onblur" );

      this._modemanagerDel = new LzDelegate( this, "_modechanged", LzModeManager,
                                            "onmode" );
}

    var _focused = false;
    

/** @access private */
function _gotFocusEvent(){
    this._focused = true;
    (LzInputTextSprite(this.tsprite)).gotFocus();
}

/** @access private */
function _gotBlurEvent(){
    this._focused = false;
    (LzInputTextSprite(this.tsprite)).gotBlur();
}

// Receive input text events from sprite
function inputtextevent (eventname, value = null) {
    //Debug.warn('inputtextevent', eventname, value);
    if (eventname == 'onfocus' && this._focused) return;
    if (eventname == 'onblur' && ! this._focused) return;
    if (eventname == 'onfocus' || eventname == 'onmousedown') {
        this._focused = true;
        if (LzFocus.getFocus() != this) {
            var tabdown = LzKeys.isKeyDown('tab');
            LzFocus.setFocus(this, tabdown);
            return;
        }
    } else if (eventname == 'onchange') {
        //multiline resizable fields adjust their height
        if ( this.multiline && 
             this.sizeToHeight && 
             this.height != (LzInputTextSprite(this.tsprite)).getTextHeight() ) {
            this.setHeight((LzInputTextSprite(this.tsprite)).getTextfieldHeight());
        }
        if (this.ontext.ready) this.ontext.sendEvent(value);
        return;
    } else if (eventname == 'onblur') {
        this._focused = false;
    }
    if (this[eventname].ready) this[eventname].sendEvent(value);
}

    ///xxxx
/**
  * Retrieves the contents of the text field for use by a datapath. See
  * <code>LzDatapath.updateData</code> for more on this.
  * @access protected
  */
function updateData (){
    return (LzInputTextSprite(this.tsprite)).getText();
}

    public var enabled = true;


/**
  * Sets whether user can modify input text field
  * @param Boolean enabled: true if the text field can be edited
  */
    function setEnabled (enabled, ignore = null){
    this.setAttribute('focusable', enabled);
    this.enabled = enabled;
    (LzInputTextSprite(this.tsprite)).setEnabled(enabled);
    if (this.onenabled.ready) this.onenabled.sendEvent(enabled);
}

/**
  * @access private
  */
setters.enabled = "setEnabled";

/**
  * Set the html flag on this text view
  */
    function setHTML (htmlp, ignore = null) {
    if (this.capabilities['htmlinputtext']) {
        (LzInputTextSprite(this.tsprite)).setHTML(htmlp);
    } else if ($debug) {
        this.__warnCapability('inputtext.setHTML()'); 
    }
}

override function getText ( ){
    return (LzInputTextSprite(this.tsprite)).getText();    
}

    /*
      prototype.getText.dependencies = function(who, self) {
    return [ self, "text" ];
}
    */
/** 
  * this attribute control the LzText::selectable attribute trough its setter
  * @access private
  */
var _allowselectable=true;

/** 
  * cache true value of selectable
  * @access private
  */
var _selectable;

/** 
  * Catch all LzModeManager events
  * @access private
  */
function _modechanged(modalview) {
    // !modalview = "LzModeManager release a view" => so allowselectable
    if ( !modalview ) {
        this._setallowselectable(true);
    } else {
        // LzModeManager make modalview as modal
        // (modalview.nodeLevel > this.nodeLevel) = "This cannot be a child of the setted modal view"
        // so not allowselectable
        if ( modalview.nodeLevel > this.nodeLevel ) {
            this._setallowselectable( false );
        } else {
            // is this a child of the setted modal view
            var parentSeeking = this;

            do {
                parentSeeking = parentSeeking.parent;
            } while ( parentSeeking != canvas && parentSeeking != modalview );

            this._setallowselectable(parentSeeking != canvas);
        }
    }
}

/** 
  * update the selectable status based on cached value
  * @access private
  */
function _setallowselectable(value) {
    this._allowselectable = value;
    this.setSelectable( this._selectable );
}

/** 
  * @access private
  */
    public override function setSelectable(value, ignore = null) {
    this._selectable = value;
    // depending on allowselectable : the setted value or false !
    super.setSelectable( this._allowselectable ? value : false );
}




} // End of LzInputText

ConstructorMap[LzInputText.tagname] = LzInputText;

