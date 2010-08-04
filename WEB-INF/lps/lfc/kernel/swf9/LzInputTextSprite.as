/**
  * LzInputTextSprite.as
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
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
        import flash.text.TextFormat;
        import flash.text.TextFieldType;
        import flash.events.FocusEvent;
        import flash.events.MouseEvent;

    }#

    #passthrough  {


    function LzInputTextSprite (newowner:LzView = null, args:Object = null, useTLF:Boolean = false) {
        super(newowner, null, useTLF);

        this.password = args && args.password ? true : false;
        textfield.displayAsPassword = this.password;
    }

    var enabled :Boolean = true;
    var focusable :Boolean = true;
    var hasFocus :Boolean = false;

    override public function __initTextProperties (args:Object) :void {
        super.__initTextProperties(args);
        // We do not support html in input fields.  TODO [2010-07 hqm]
        // But an LzTLFTextField input type field has to be type HTML
        // right now because that's the only way a
        // TextContainerManager and EditManager will be created.
        //
        // I need to figure out how to make the escaping work
        // consistently between TextField and LzTLFTextField for this
        // input text case.
        if (textfield is LzTLFTextField)  {
            this.html = true;
        } else {
            this.html = false;
        }

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
        if ( this.hasFocus) { return; }
        // assign keyboard control
        this.select();

        // N.B. [hqm 2010-07] For bidi text (LzTLFTextField), I had to
        // put this call to set focus *after* the select() above,
        // otherwise the focus gets blurred when you set the
        // selection. This doesn't happen for native TextField. 
        // JIRA LPP-9257 tracks this.
        LFCApplication.stage.focus = this.textfield;

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
     */
    function __lostFocus (event:FocusEvent) :void {
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
    function setEnabled (enabled:Boolean) :void {
        this.enabled = enabled;
        if (enabled) {
            textfield.type = TextFieldType.INPUT;
        } else {
            textfield.type = TextFieldType.DYNAMIC;
        }

        // reset textformat to workaround flash player bug (FP-77)
        textfield.defaultTextFormat = this.textformat;
    }

    /**
     * If a mouse event occurs in an input text field, find the focused view
     */
    static function findSelection() :LzInputText {
        var f:InteractiveObject = LFCApplication.stage.focus;
        if ((f is TextField || f is LzTLFTextField) && f.parent is LzInputTextSprite) {
            return (f.parent as LzInputTextSprite).owner;
        }
        return null;
    }

    }#  // #passthrough

} // End of LzInputTextSprite
