/**
  * LzKeyboardKernel.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

// Receives keyboard events from the runtime
var LzKeyboardKernel = { 
    __downKeysHash: {}
    ,__keyboardEvent: function ( k, t ){   
        var delta = {};
        var ascii = Key.getAscii();
        if (ascii != 0) {
            var s = String.fromCharCode(k).toLowerCase();
        } else {
            // send keycode instead of char - see http://livedocs.adobe.com/flash/8/main/00001686.html 
            s = k;
            if (LzKeyboardKernel.__codes[k]) {
                s = LzKeyboardKernel.__codes[k];
                //} else if (k > 0 && k < 27 && k != 32) {
                // control keys map here on the mac - apple == control in flash
            }
        }
        var dh = LzKeyboardKernel.__downKeysHash;
        var dirty = false;
        if (t == 'onkeyup') {
            if (dh[s] != false) {
                delta[s] = false;
                dirty = true;
            }    
            dh[s] = false;
        } else if (t == 'onkeydown') {
            if (dh[s] != true) {
                delta[s] = true;    
                dirty = true;
            }    
            dh[s] = true;
        }    

        //Debug.write('downKeysHash', t, k, dh, delta);
        if (dirty && LzKeyboardKernel.__callback) LzKeyboardKernel.__scope[LzKeyboardKernel.__callback](delta, k, t);
    }
    ,__codes: {16: 'shift', 17: 'control'}
    ,__callback: null
    ,__scope: null
    ,setCallback: function (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
    }    
    // Called by lz.Keys when the last focusable element was reached.
    ,gotLastFocus: function () {
    }
}
