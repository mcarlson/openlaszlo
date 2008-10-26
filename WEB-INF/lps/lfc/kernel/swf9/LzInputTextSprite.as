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
class LzInputTextSprite extends LzTextSprite {

    #passthrough (toplevel:true) {  
        import flash.display.*;
        import flash.events.*;
        import flash.text.*;
    }#

    #passthrough  {


    function LzInputTextSprite (newowner = null, args = null) {
        super(newowner);
    }


    var __handlelostFocusdel;
    var enabled = true;
    var focusable = true;
    var hasFocus = false;
    var scroll = 0;


    override public function __initTextProperties (args:Object) {
        super.__initTextProperties(args);
        // We do not support html in input fields. 
        if (this.enabled) {
            textfield.type = TextFieldType.INPUT;
        } else {
            textfield.type = TextFieldType.DYNAMIC;
        }
        textfield.mouseEnabled = false;

        /*
          TODO [hqm 2008-01]
          these handlers need to be implemented via Flash native event listenters:
          
          focusIn , focusOut

          change -- dispatched after text input is modified

          textInput  -- dispatched before the content is modified
                        Do we need to use this for intercepting when we have
                        a pattern restriction on input?

        */
 
        textfield.addEventListener(Event.CHANGE        , __onChanged);
        //textfield.addEventListener(TextEvent.TEXT_INPUT, __onTextInput);
        textfield.addEventListener(FocusEvent.FOCUS_IN , __gotFocus);
        textfield.addEventListener(FocusEvent.FOCUS_OUT, __lostFocus);

        this.hasFocus = false;

    }

    /**
     * @access private
     */
    public function gotFocus ( ){
        //Debug.write('LzInputTextSprite.__handleOnFocus');
        if ( this.hasFocus ) { return; }
        this.select();
        this.hasFocus = true;
    }

    function select (  ){
        textfield.setSelection(0, textfield.text.length);

    }

    // XXXX selectionBeginIndex    property
    
    function deselect (  ){
        textfield.setSelection(0,0);
    }

    /**
     * @access private
     */
    function gotBlur (  ){
        //Debug.write('LzInputTextSprite.__handleOnBlur');
        this.hasFocus = false;
        this.deselect();
    }

    /**
     * TODO [hqm 2008-01] I have no idea whether this comment
     * still applies:
     * Register for update on every frame when the text field gets the focus.
     * Set the behavior of the enter key depending on whether the field is
     * multiline or not.
     * 
     * @access private
     */
    function __gotFocus ( event:Event ){
        // scroll text fields horizontally back to start
        if (owner) owner.inputtextevent('onfocus');
    }



    /**
     * Register to be called when the text field is modified. Convert this
     * into a LFC ontext event. 
     * @access private
     */
    function __onChanged (event:Event ){
        this.text = this.getText();
        if (owner) owner.inputtextevent('onchange', this.text);
    }

    /**
     * @access private
     * TODO [hqm 2008-01] Does we still need this workaround???
     */
    function __lostFocus (event:Event){
        __handlelostFocus(event);
        //trace('lost focus', event.target);
        //if (this['__handlelostFocusdel'] == null) this.__handlelostFocusdel = new LzDelegate(this, "__handlelostFocus");
        //lz.Idle.callOnIdle(this.__handlelostFocusdel);
    }

    /**
     * TODO [hqm 2008-01] Does this comment still apply? Do we still need this workaround???
     *
     * must be called after an idle event to prevent the selection from being 
     * cleared prematurely, e.g. before a button click.  If the selection is 
     * cleared, the button doesn't send mouse events.
     * @access private
     */
    function __handlelostFocus (evt ){
        if (owner == lz.Focus.getFocus()) {
            lz.Focus.clearFocus();
            if (owner) owner.inputtextevent('onblur');
        }    
    }
    
    /**
     * Get the current text for this inputtext-sprite.
     * @protected
     */
    override public function getText():String {
        // We normalize swf's \r to \n
        return this.textfield.text.split('\r').join('\n');
    }

    /**
     * Retrieves the contents of the text field for use by a datapath. See
     * <code>LzDatapath.updateData</code> for more on this.
     * @access protected
     */
    function updateData (){
        return textfield.text;
    }


    /**
     * Sets whether user can modify input text field
     * @param Boolean enabled: true if the text field can be edited
     */
    function setEnabled (enabled){
        this.enabled = enabled;
        if (enabled) {
            textfield.type = 'input';
        } else {
            textfield.type = 'dynamic';
        }
    }

    /**
     * Set the html flag on this text view
     */
    function setHTML (htmlp) {
        // TODO [hqm 2008-10] what do we do here?
    }


    override public function getTextfieldHeight ( ){
        return this.textfield.height;
    }

    /**
     * If a mouse event occurs in an input text field, find the focused view
     */
    static function findSelection() :LzInputText {
        var f:InteractiveObject = LFCApplication.stage.focus;
        if (f is TextField && f.parent is LzInputTextSprite) {
            return (f.parent as LzInputTextSprite).owner;
        }
        return null;
    }

    }#  // #passthrough

} // End of LzInputTextSprite
