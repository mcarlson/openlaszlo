/**
  * LzKeyboardKernel.js
  *
  * @copyright Copyright 2007,2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

// Receives keyboard events from the runtime
var LzKeyboardKernel = { 
    __downKeysHash: {}
    ,__keyboardEvent: function ( e ){   
        if (!e) e = window.event;
        var delta = {};
        var dirty = false;
        var k = e['keyCode'];
        var t = e.type; 
        var dh = LzKeyboardKernel.__downKeysHash;
        // TODO: really, all control characters should be skipped...
        // skip shift, ctrl, option keys to prevent duplicate sending - see LPP-4267
        if (k >= 0 && k != 16 && k != 17 && k != 18) {
            // TODO: add mapping to flash character codes?
            var s = String.fromCharCode(k).toLowerCase();
            if (t == 'keyup') {
                if (dh[s] != false) {
                    delta[s] = false;
                    dirty = true;
                }    
                dh[s] = false;
            } else if (t == 'keydown') {
                if (dh[s] != true) {
                    delta[s] = true;    
                    dirty = true;
                }    
                dh[s] = true;
            }    
        }    
        if (dh['alt'] != e['altKey']) {
            delta['alt'] = e['altKey'];
            dirty = true;
            if (LzSprite.prototype.quirks['alt_key_sends_control']) {
                delta['control'] = delta['alt'];
            }
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
        if (dirty && LzKeyboardKernel.__scope && LzKeyboardKernel.__scope[LzKeyboardKernel.__callback]) {
            LzKeyboardKernel.__scope[LzKeyboardKernel.__callback](delta, k, 'on' + t);
        } 
        
        // cancel bubbling
        if (k >= 0) {
            if (k == 9) {
                //Debug.write('canceling tab');
                e.cancelBubble = true;
                e.returnValue = false;
                return false;
            } else if (LzKeyboardKernel.__cancelKeys && (k == 13 || k == 0 || k == 37 || k == 38 || k == 39 || k == 40) ) {
                //Debug.write('canceling key', k, t);
                // cancel event bubbling for enter, space(scroll) and arrow keys
                e.cancelBubble = true;
                e.returnValue = false;
                return false;
            }    
        }    
        //Debug.write('downKeysHash', t, k, dh, delta);
    }

    ,__callback: null
    ,__scope: null
    ,__cancelKeys: true
    ,setCallback: function (scope, keyboardcallback) {
        this.__scope = scope;
        this.__callback = keyboardcallback;
        if (lzOptions.dhtmlKeyboardControl != false) {
            // can't use Lz.attachEventHandler because we need to cancel events selectively
            if (LzSprite.prototype.quirks.keyboardlistentotop) {
                var doc = window.top.document;
            } else {
                var doc = document;
            }
            doc.onkeydown = this.__keyboardEvent;
            doc.onkeyup = this.__keyboardEvent;
            doc.onkeypress = this.__keyboardEvent;
        }
    }    
}
