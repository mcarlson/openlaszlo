/**
  * LFCApplication.as
  *
  * @copyright Copyright 2007-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */

{
        #pragma "debug=false"
        #pragma "debugSWF9=false"
        #pragma "debugBacktrace=false"

public class LFCApplication {

    // This serves as the superclass of DefaultApplication, currently that is where
    // the compiler puts top level code to run.

    #passthrough (toplevel:true) {
    import flash.display.DisplayObject;
    import flash.display.Sprite;
    import flash.display.Stage;
    import flash.display.StageAlign;
    import flash.display.StageScaleMode;
    import flash.events.Event;
    import flash.events.FocusEvent;
    import flash.system.Capabilities;
    import flash.text.TextField;
    }#

    // The application sprite
    static public var _sprite:Sprite;

    public static function addChild(child:DisplayObject):DisplayObject {
       return _sprite.addChild(child);
    }

    public static function removeChild(child:DisplayObject):DisplayObject {
       return _sprite.removeChild(child);
    }

    public static function setChildIndex(child:DisplayObject, index:int):void {
        _sprite.setChildIndex(child, index);
    }

    // Allow anyone access to the stage object (see ctor below)
    public static var stage:Stage = null;

    // global tabEnabled flag for TextField
    public static var textfieldTabEnabled:Boolean = false;

    public function LFCApplication (sprite:Sprite) {
        LFCApplication._sprite = sprite;
        // wait for the ADDED_TO_STAGE event before continuing to init
        LFCApplication._sprite.addEventListener(Event.ADDED_TO_STAGE, initLFC);
    }

    private function initLFC(event:Event = null) :void {
        LFCApplication._sprite.removeEventListener(Event.ADDED_TO_STAGE, initLFC);
        // Allow anyone to access the stage object
        LFCApplication.stage = LFCApplication._sprite.stage;


        // `logdebug` is set by the server to tell Debug.__write to log
        // back to the server
        Debug.log_all_writes = (!! LzBrowserKernel.getInitArg('logdebug'));


        runToplevelDefinitions()

        if (Capabilities.playerType == "ActiveX") {
            // Workaround for ActiveX control swallowing browser focus events
            stage.addEventListener(Event.ACTIVATE, allKeysUp);

            // workaround for flash player bug FP-1355
            LFCApplication.textfieldTabEnabled = true;
            stage.addEventListener(FocusEvent.KEY_FOCUS_CHANGE, preventFocusChange);
        }

        // for swf8-compatibility (LPP-9007):
        // non-selectable textfields should not gain focus by mouse
        stage.addEventListener(FocusEvent.MOUSE_FOCUS_CHANGE, handleMouseFocusChange);

        // necessary for consistent behavior - in netscape browsers HTML is ignored
        stage.align = StageAlign.TOP_LEFT;
        stage.scaleMode = StageScaleMode.NO_SCALE;
        //Stage.align = ('canvassalign' in global && global.canvassalign != null) ? global.canvassalign : "LT";
        //Stage.scaleMode = ('canvasscale' in global && global.canvasscale != null) ? global.canvasscale : "noScale";

        // Register for callbacks from the kernel
        LzMouseKernel.setCallback(lz.ModeManager, 'rawMouseEvent');
        LzMouseKernel.initCursor();

        LzKeyboardKernel.setCallback(lz.Keys, '__keyEvent');
    }

    private function allKeysUp(event:Event):void {
        lz.Keys.__allKeysUp();
    }

    private function preventFocusChange(event:FocusEvent):void {
        if (event.keyCode == 9) {
            event.preventDefault();
        }
    }

    private function handleMouseFocusChange (event:FocusEvent) :void {
        if (event.relatedObject is TextField) {
            if (! (event.relatedObject cast TextField).selectable) {
                event.preventDefault();
                // remove keyboard control
                LFCApplication.stage.focus = LFCApplication.stage;
            }
        }
    }

    public function runToplevelDefinitions() {
        // overridden by swf9 script compiler
    }
}

} // end #pragma block
