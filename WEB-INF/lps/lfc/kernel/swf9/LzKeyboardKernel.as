/**
  * LzKeyboardKernel.lzs
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

// Receives keyboard events from the runtime
class LzKeyboardKernelClass
{
    function __keyboardEvent ( e, t ){   
        var delta = {};
        var s, k = e.keyCode;
        var keyisdown = t == 'onkeydown';
        s = String.fromCharCode(k).toLowerCase();

        // prevent duplicate onkeydown events - see LPP-7432 
        if (__keyState[k] == keyisdown) return;
        __keyState[k] = keyisdown;
        
        delta[s] = keyisdown;
        if (this.__callback) this.__scope[this.__callback](delta, k, t);
    }

    var __callback = null;
    var __scope = null;
    var __keyState:Object = {};

    function setCallback (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
    }    
    // Called by lz.Keys when the last focusable element was reached.
    function gotLastFocus() {
    }
} // End of LzKeyboardKernelClass

var LzKeyboardKernel = new LzKeyboardKernelClass ();
