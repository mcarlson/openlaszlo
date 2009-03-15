/**
  * LzInputTextSprite.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  */

/**
  * @shortdesc Used for input text.
  * 
  */
public class LzInputTextSprite extends LzTextSprite {

    #passthrough (toplevel:true) {  
        import flash.display.InteractiveObject;
        import flash.events.Event;
        import flash.events.FocusEvent;
        import flash.text.TextField;
        import flash.text.TextFieldType;
    }#

    #passthrough  {


    function LzInputTextSprite (newowner = null, args = null) {
        super(newowner);
    }

    var __handlelostFocusdel;
    var enabled = true;
    var focusable = true;
    var hasFocus = false;

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
     * Called from LzInputText#_gotFocusEvent() after focus was set by lz.Focus
     * @access private
     */
    public function gotFocus () :void {
        if ( this.hasFocus ) { return; }
        // assign keyboard control
        LFCApplication.stage.focus = this.textfield;
        this.select();
        this.hasFocus = true;
    }

    /**
     * Called from LzInputText#_gotBlurEvent() after focus was cleared by lz.Focus
     * @access private
     */
    function gotBlur () :void {
        this.hasFocus = false;
        this.deselect();
        if (LFCApplication.stage.focus === this.textfield) {
            // remove keyboard control
            LFCApplication.stage.focus = LFCApplication.stage;
        }
    }

    function select () :void {
        textfield.setSelection(0, textfield.text.length);
    }

    function deselect () :void {
        textfield.setSelection(0, 0);
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
    function __gotFocus (event:FocusEvent) :void {
        // scroll text fields horizontally back to start
        if (owner) owner.inputtextevent('onfocus');
    }

    /**
     * @access private
     * TODO [hqm 2008-01] Does we still need this workaround???
     */
    function __lostFocus (event:FocusEvent) :void {
        // defer execution, see swf8 kernel
        LzTimeKernel.setTimeout(this.__handlelostFocus, 1, event);
    }

    /**
     * TODO [hqm 2008-01] Does this comment still apply? Do we still need this workaround???
     *
     * must be called after an idle event to prevent the selection from being 
     * cleared prematurely, e.g. before a button click.  If the selection is 
     * cleared, the button doesn't send mouse events.
     * @access private
     */
    function __handlelostFocus (event:Event) :void {
        if (owner) owner.inputtextevent('onblur');
    }

    /**
     * Register to be called when the text field is modified. Convert this
     * into a LFC ontext event. 
     * @access private
     */
    function __onChanged (event:Event) :void {
        this.text = this.getText();
        if (owner) owner.inputtextevent('onchange', this.text);
    }

    /**
     * Get the current text for this inputtext-sprite.
     * @protected
     */
    override public function getText() :String {
        // We normalize swf's \r to \n
        return this.textfield.text.replace(/\r/g, '\n');
    }

    /**
     * Sets whether user can modify input text field
     * @param Boolean enabled: true if the text field can be edited
     */
    function setEnabled (enabled) :void {
        this.enabled = enabled;
        if (enabled) {
            textfield.type = 'input';
        } else {
            textfield.type = 'dynamic';
        }
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
