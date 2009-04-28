/**
  * LzKeyboardKernel.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  */

// Receives keyboard events from the runtime
class LzKeyboardKernel {
    #passthrough (toplevel:true) {
    import flash.events.KeyboardEvent;
    }#

    static function __keyboardEvent (e:KeyboardEvent) :void {   
        var t:String = 'on' + e.type.toLowerCase();
        var delta:Object = {};
        var k:uint = e.keyCode;
        var keyisdown:Boolean = t == 'onkeydown';
        var s:String = String.fromCharCode(k).toLowerCase();


        // prevent duplicate onkeydown events - see LPP-7432 
        if (__keyState[k] == keyisdown) return;
        __keyState[k] = keyisdown;

        delta[s] = keyisdown;
        var ctrl:Boolean = e.ctrlKey;

        //Debug.info('__keyboardEvent', e, 'alt=', e.altKey, 'control', e.ctrlKey);

        if (__callback) __scope[__callback](delta, k, t, ctrl);
    }

    static var __callback:String = null;
    static var __scope:* = null;
    static var __keyState:Object = {};
    static var __listeneradded:Boolean = false;

    static function setCallback (scope:*, funcname:String) :void {
        if (__listeneradded == false) {
            __scope = scope;
            __callback = funcname;
            LFCApplication.stage.addEventListener(KeyboardEvent.KEY_DOWN, __keyboardEvent);
            LFCApplication.stage.addEventListener(KeyboardEvent.KEY_UP, __keyboardEvent);
            __listeneradded = true;
        }
    }    

    // Called by lz.Keys when the last focusable element was reached.
    static function gotLastFocus() :void {
    }
    // Called to turn on/off restriction of focus to this application
    static function setGlobalFocusTrap(ignore) :void {
    }
} // End of LzKeyboardKernel
