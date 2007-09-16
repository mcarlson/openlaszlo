/**
  * LzKeyboardKernel.js
  *
  * @copyright Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic SVG
  */

// Receives keyboard events from the runtime
var LzKeyboardKernel = { 
    __downKeysHash: {}
    ,__keyboardEvent: function ( e, eventname ){   
        var delta = {};
        var dirty = false;
        var k = e['keyCode'];
        // TODO: add mapping to flash character codes?
        var s = String.fromCharCode(k).toLowerCase();
        var t = e.type; 
        var dh = LzKeyboardKernel.__downKeysHash;
        if (eventname == 'keyup') {
            if (dh[s] != false) {
                delta[s] = false;
                dirty = true;
            }    
            dh[s] = false;
        } else if (eventname == 'keydown') {
            if (dh[s] != true) {
                delta[s] = true;    
                dirty = true;
            }    
            dh[s] = true;
        }    
        if (dh['alt'] != e['altKey']) {
            delta['alt'] = e['altKey'];
            dirty = true;
        }    
        if (dh['control'] != e['ctrlKey']) {
            delta['control'] = e['ctrlKey'];
            dirty = true;
        }    
        if (dh['shift'] != e['shiftKey']) {
            delta['shift'] = e['shiftKey'];
            dirty = true;
        }    

        dh['alt'] = e['altKey'] 
        dh['control'] = e['ctrlKey'] 
        dh['shift'] = e['shiftKey']
        if (dirty && LzKeyboardKernel.__callback) LzKeyboardKernel.__scope[LzKeyboardKernel.__callback](delta, k, 'on' + t);
        if (LzKeyboardKernel.__cancelEnter && (k == 9 || k == 13 || k == 0 || k == 37 || k == 38 || k == 39 || k == 40) ) {
            // cancel event bubbling for enter, tab, space(scroll) and arrow keys
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        }    
        //Debug.write('downKeysHash', t, k, dh, delta);
    }
    ,__callback: null
    ,__scope: null
    ,__cancelEnter: true
    ,setCallback: function (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
    }    
}

document.onkeydown = LzKeyboardKernel.__keyboardEvent;
document.onkeyup = LzKeyboardKernel.__keyboardEvent;
document.onkeypress = LzKeyboardKernel.__keyboardEvent;
