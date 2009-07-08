/**
  * LFCApplication.as
  *
  * @copyright Copyright 2007, 2008, 2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */

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
        runToplevelDefinitions()

        if (Capabilities.playerType == "ActiveX") {
            // Workaround for ActiveX control swallowing browser focus events
            stage.addEventListener(Event.ACTIVATE, allKeysUp);

            // workaround for flash player bug FP-1355
            LFCApplication.textfieldTabEnabled = true;
            stage.addEventListener(FocusEvent.KEY_FOCUS_CHANGE, preventFocusChange);
        }

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
        lz.Keys.__allKeysUp('flash activate');
    }

    private function preventFocusChange(event:FocusEvent):void {
        if (event.keyCode == 9) {
            event.preventDefault();
        }
    }

    public function runToplevelDefinitions() {
        // overridden by swf9 script compiler
    }

}

// Resource library
// contains {ptype, class, frames, width, height}
// ptype is one of "ar" (app relative) or "sr" (system relative)
var LzResourceLibrary :Object = {};
