/**
  * LzTLFTextSprite.as
  *
  * @copyright Copyright 2007-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */


/**
   Text Sprite implemented using Flash 10 Text Layout Framework API
 */

public class LzTLFInputTextSprite extends LzTLFTextSprite {
    #passthrough (toplevel:true) {
    import flash.display.Sprite;
    import flash.display.Sprite;
    import flash.events.MouseEvent;
    import flash.events.Event;
    import flash.events.TextEvent;
    import flashx.textLayout.events.*;
    import flashx.textLayout.operations.*;
    import flash.geom.Rectangle;
    import flashx.textLayout.elements.Configuration;
    import flashx.textLayout.events.CompositionCompleteEvent;
    import flashx.textLayout.events.FlowOperationEvent;
   
    import flashx.textLayout.container.ContainerController;
    import flashx.textLayout.elements.Configuration;
    import flashx.textLayout.elements.IConfiguration;
    import flashx.textLayout.formats.TextLayoutFormat;
    import flashx.textLayout.formats.TextAlign;
    import flash.text.engine.FontPosture;
    import flash.text.engine.Kerning;

    import flashx.textLayout.edit.EditingMode;
    import flashx.textLayout.conversion.TextConverter;
    import flashx.textLayout.formats.Direction;
    
    import flashx.textLayout.container.TextContainerManager;
    import flashx.textLayout.edit.EditManager;
    import flashx.textLayout.elements.ParagraphElement;
    import flashx.textLayout.elements.TextFlow;
    import flashx.textLayout.edit.SelectionState;
    import flashx.textLayout.events.SelectionEvent;
    import flashx.textLayout.edit.ISelectionManager;
    import flashx.textLayout.formats.TextLayoutFormat;
    import flash.text.engine.FontPosture;
    import flashx.undo.UndoManager;
    }#

    #passthrough {

        var enabled :Boolean = true;
        var focusable :Boolean = true;
        var hasFocus :Boolean = false;

        public function LzTLFInputTextSprite (newowner:LzView = null, args:Object = null) {
            super(newowner,args);
            tcm.editingMode = EditingMode.READ_WRITE;
            container.mouseChildren = true;
            container.mouseEnabled = true;
        }

        /**
         * Sets whether user can modify input text field
         * @param Boolean enabled: true if the text field can be edited
         */
        function setEnabled (enabled:Boolean) :void {
            this.enabled = enabled;
            if (this.enabled) {
                tcm.editingMode = EditingMode.READ_WRITE;
            } else {
                tcm.editingMode = EditingMode.READ_SELECT;
            }
        }


        override public function __initTextProperties (args:Object) :void {
            super.__initTextProperties(args);
            // We do not support html in input fields.
            this.html = false;

            if (this.enabled) {
                tcm.editingMode = EditingMode.READ_WRITE;
            } else {
                tcm.editingMode = EditingMode.READ_SELECT;
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
            /* 
               textfield.addEventListener(Event.CHANGE        , __onChanged);
               //textfield.addEventListener(TextEvent.TEXT_INPUT, __onTextInput);
               textfield.addEventListener(FocusEvent.FOCUS_IN , __gotFocus);
               textfield.addEventListener(FocusEvent.FOCUS_OUT, __lostFocus);
            */
            this.hasFocus = false;
        }

        /**
         * Called from LzInputText#_gotFocusEvent() after focus was set by lz.Focus
         * @access private
         */
        function gotFocus ()  {
            // assign keyboard control
            if ( this.hasFocus ) { return; }
            this.hasFocus = true;
            this.select();
            LFCApplication.stage.focus = this.container;
        }



        /**
         * Called from LzInputText#_gotBlurEvent() after focus was cleared by lz.Focus
         * @access private
         */
        function gotBlur () {
            if (this.hasFocus == false) { return; }

            this.hasFocus = false;
            if (LFCApplication.stage.focus === this.container) {
                // remove keyboard control
                LFCApplication.stage.focus = LFCApplication.stage;
            }
            deselect();
        }


        /**
         *  Notify LFC that Flash set the focus
         * @access private
         */
        override function __gotFocus (event:Event) :void {
            // TODO [hqm 2010-06] need to: scroll text fields horizontally back to start
            if (this.hasFocus) { return; }
            this.hasFocus = true;
            if (owner) owner.inputtextevent('onfocus');
        }

        /**
         * @access private
         * TODO [hqm 2008-01] Does we still need this workaround???
         */
        override function __lostFocus (event:Event) :void {
            if (this.hasFocus == false ) { return; }
            this.hasFocus = false;
            if (owner) owner.inputtextevent('onblur');
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
        override function __onChanged (event:Event) :void {
            this.text = this.getText();
            if (owner) owner.inputtextevent('onchange', this.text);
        }

        /**
         * If a mouse event occurs in an input text field, find the focused view
         */
        static function findSelection() :LzInputText {
            return null;
        }



    }#

}
