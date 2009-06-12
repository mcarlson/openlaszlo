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
        if ((__keyState[k] != null) == keyisdown) return;
        __keyState[k] = keyisdown?k:null;

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

    // Called by lz.embed when the browser window regains focus
    static function __allKeysUp () {
        var delta = {};
        var stuck = false;
        var keys;
        for (var key in __keyState) {
          if (__keyState[key] != null) {
            stuck = true;
            delta[key] = false;
            if (! keys) { keys = []; }
            keys.push(__keyState[key]);
          }
        }
//         Debug.info("[%6.2f] All keys up: %w", (new Date).getTime() % 1000000, delta);
        if (stuck && __scope && __scope[__callback]) {
          if (!keys) {
            __scope[__callback](delta, 0, 'onkeyup');
          } else for (var i = 0, l = keys.length; i < l; i++) {
            __scope[__callback](delta, keys[i], 'onkeyup');
          }
        }
        __keyState = {};
    }

    // Called by lz.Keys when the last focusable element was reached.
    static function gotLastFocus() :void {
    }
    // Called to turn on/off restriction of focus to this application
    static function setGlobalFocusTrap(ignore) :void {
    }
} // End of LzKeyboardKernel
