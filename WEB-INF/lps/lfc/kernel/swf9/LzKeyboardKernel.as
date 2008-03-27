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
    var __downKeysHash = {};

    function __keyboardEvent ( k, t ){   
        var delta = {};
        var s = String.fromCharCode(k).toLowerCase();
        var dh = this.__downKeysHash;
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
        if (dirty && this.__callback) this.__scope[this.__callback](delta, k, t);
    }

    var __callback = null;
    var __scope = null;

    function setCallback (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
    }    
} // End of LzKeyboardKernelClass

var LzKeyboardKernel = new LzKeyboardKernelClass ();
