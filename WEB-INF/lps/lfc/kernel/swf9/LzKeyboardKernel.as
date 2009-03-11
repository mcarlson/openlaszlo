/**
  * LzKeyboardKernel.lzs
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

// Receives keyboard events from the runtime
class LzKeyboardKernel
{
    #passthrough (toplevel:true) {  
    import flash.events.*;
    import flash.ui.*;
    }#

    static function __keyboardEvent ( e:KeyboardEvent ){   
        var t = 'on' + e.type.toLowerCase();
        var delta = {};
        var s, k = e.keyCode;
        var keyisdown = t == 'onkeydown';
        s = String.fromCharCode(k).toLowerCase();


        // prevent duplicate onkeydown events - see LPP-7432 
        if (__keyState[k] == keyisdown) return;
        __keyState[k] = keyisdown;
        
        delta[s] = keyisdown;
        var ctrl:Boolean = e.ctrlKey;

        //Debug.info('__keyboardEvent', e, 'alt=', e.altKey, 'control', e.ctrlKey);

        if (__callback) __scope[__callback](delta, k, t, ctrl);
    }

    static var __callback = null;
    static var __scope = null;
    static var __keyState:Object = {};
    static var __listeneradded:Boolean = false;

    static function setCallback (scope, funcname) {
        if (__listeneradded == false) {
            __scope = scope;
            __callback = funcname;
            LFCApplication.stage.addEventListener(KeyboardEvent.KEY_DOWN, __keyboardEvent);
            LFCApplication.stage.addEventListener(KeyboardEvent.KEY_UP, __keyboardEvent);
            __listeneradded = true;
        }
    }    

    // Called by lz.Keys when the last focusable element was reached.
    static function gotLastFocus() {
    }
} // End of LzKeyboardKernel


