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
    private var __downKeysHash:Object = {'alt': false, 'control': false, 'shift': false};
    private const __codes:Object = {16: 'shift', 17: 'control'};

    function __keyboardEvent ( e, t ){   
        var delta = {};
        var s, k = e.charCode;
        if (k != 0) {
            s = String.fromCharCode(k).toLowerCase();
        } else {
            k = e.keyCode;
            if (this.__codes[k]) {
                s = this.__codes[k];
            } else {
                s = k;
            }
        }
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

        if (dh['alt'] != e.altKey) {
            delta['alt'] = e.altKey;
            dirty = true;
        }    
        if (dh['control'] != e.ctrlKey) {
            delta['control'] = e.ctrlKey;
            dirty = true;
        }    
        if (dh['shift'] != e.shiftKey) {
            delta['shift'] = e.shiftKey;
            dirty = true;
        }    

        dh['alt'] = e.altKey 
        dh['control'] = e.ctrlKey 
        dh['shift'] = e.shiftKey

        //Debug.write('downKeysHash', t, k, dh, delta);
        if (dirty && this.__callback) this.__scope[this.__callback](delta, k, t);
    }

    var __callback = null;
    var __scope = null;

    function setCallback (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
    }    
    // Called by lz.Keys when the last focusable element was reached.
    function gotLastFocus() {
    }
} // End of LzKeyboardKernelClass

var LzKeyboardKernel = new LzKeyboardKernelClass ();
