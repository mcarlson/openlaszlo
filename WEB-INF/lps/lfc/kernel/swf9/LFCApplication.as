/**
  * LFCApplication.as
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
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
    import flash.display.*;
    import flash.events.*;
    import flash.utils.*;
    import flash.text.*;
    import flash.system.*;
    import flash.net.*;
    import flash.ui.*;
    import flash.text.Font;
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

    // Allow anyone access to write to the debugger
    public static var write:Function;
    
    public function LFCApplication (sprite:Sprite) {

        LFCApplication._sprite = sprite;
        // wait for the ADDED_TO_STAGE event before continuing to init
        LFCApplication._sprite.addEventListener(Event.ADDED_TO_STAGE, initLFC);
    }

    private function initLFC(event:Event = null) {
        LFCApplication._sprite.removeEventListener(Event.ADDED_TO_STAGE, initLFC);
        // Allow anyone to access the stage object
        LFCApplication.stage = LFCApplication._sprite.stage;
        runToplevelDefinitions()

        var idleTimerPeriod = 14; // msecs

        //trace('idle timer period = ', idleTimerPeriod , 'msecs');
        LzIdleKernel.startTimer( idleTimerPeriod );

        stage.addEventListener(KeyboardEvent.KEY_DOWN,reportKeyDown);
        stage.addEventListener(KeyboardEvent.KEY_UP,reportKeyUp);

        // necessary for consistent behavior - in netscape browsers HTML is ignored
        stage.align = StageAlign.TOP_LEFT;
        stage.scaleMode = StageScaleMode.NO_SCALE;
        //Stage.align = ('canvassalign' in global && global.canvassalign != null) ? global.canvassalign : "LT";
        //Stage.scaleMode = ('canvasscale' in global && global.canvasscale != null) ? global.canvasscale : "noScale";

        stage.addEventListener(Event.RESIZE, resizeHandler);


        // Register for callbacks from the kernel
        LzMouseKernel.setCallback(lz.ModeManager, 'rawMouseEvent');
        LzMouseKernel.initCursor();

        
        /* TODO [hqm 2008-01] Do we want to do anything with other
         * events, like click, or mousewheel ?

           stage.addEventListener(MouseEvent.CLICK, reportClick);
           stage.addEventListener(MouseEvent.MOUSE_WHEEL, reportWheel);
        */

        LzKeyboardKernel.setCallback(lz.Keys, '__keyEvent');
    }

    function reportWheel(event:MouseEvent):void {
        /*
        Debug.write(event.currentTarget.toString() + 
              " dispatches MouseWheelEvent. delta = " + event.delta); */
        lz.Keys.__mousewheelEvent(event.delta);
    }

    function resizeHandler(event:Event):void {
        //trace('LFCApplication.resizeHandler stage width/height = ', stage.stageWidth, stage.stageHeight);
        LzScreenKernel.handleResizeEvent();
    }

    function reportKeyUp(event:KeyboardEvent):void {
        /*
          trace("Key Released: " + String.fromCharCode(event.charCode) + 
              " (key code: " + event.keyCode + " character code: " + 
              event.charCode + ")");
        */
        LzKeyboardKernel.__keyboardEvent(event, 'onkeyup');
    }

    function reportKeyDown(event:KeyboardEvent):void {
        /*
          trace("Key Pressed: " + String.fromCharCode(event.charCode) + 
              " (key code: " + event.keyCode + " character code: " 
              + event.charCode + ")");
        */
        LzKeyboardKernel.__keyboardEvent(event, 'onkeydown');
    }

    public function runToplevelDefinitions() {
        // overridden by swf9 script compiler
    }


}

// Resource library
// contains {ptype, class, frames, width, height}
// ptype is one of "ar" (app relative) or "sr" (system relative)
var LzResourceLibrary = {};






