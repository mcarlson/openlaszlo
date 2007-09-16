/**
  * LzKeyboardKernel.as
  *
  * @copyright Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.
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
        var s = String.fromCharCode(k).toLowerCase();
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
    ,__callback: null
    ,__scope: null
    ,setCallback: function (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
    }    
}
