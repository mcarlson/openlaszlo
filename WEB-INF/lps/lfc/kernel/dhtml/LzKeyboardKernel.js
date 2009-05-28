/**
  * LzKeyboardKernel.js
  *
  * @copyright Copyright 2007-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

// Receives keyboard events from the runtime
var LzKeyboardKernel = { 
    __downKeysHash: {alt: false, control: false, shift: false, meta: false}
    ,__keyCodes: {}
    ,__keyboardEvent: function ( e ){   
        if (!e) e = window.event;
        var delta = {};
        var dirty = false;
        var k = e['keyCode'];
        var t = e.type; 
        var dh = LzKeyboardKernel.__downKeysHash;
        var kcodes = LzKeyboardKernel.__keyCodes;
        var quirks = LzSprite.prototype.quirks;
        // TODO: really, all control characters should be skipped...
        // skip shift, ctrl, option keys to prevent duplicate sending - see LPP-4267
        if (k >= 0 && k != 16 && k != 17 && k != 18 && k != 224) {
            // TODO: add mapping to flash character codes?
            var s = String.fromCharCode(k).toLowerCase();
            kcodes[s] = k;
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
        var alt = e['altKey'];
        if (dh['alt'] != alt) {
            delta['alt'] = alt;
            dirty = true;
            if (quirks['alt_key_sends_control']) {
                delta['control'] = delta['alt'];
            }
        }    
        var ctrl = e['ctrlKey']// || e['metaKey'];
        if (dh['control'] != ctrl) {
            delta['control'] = ctrl;
            dirty = true;
        }    
        var shift = e['shiftKey'];
        if (dh['shift'] != shift) {
            delta['shift'] = shift;
            dirty = true;
        }    
        var stuck;
        var meta = e['metaKey'];
        if (quirks['detectstuckkeys']) {
            // see LPP-8210
            if (dh['meta'] != meta) {
                // look for stuck keys
                delta['control'] = meta;
                dirty = true;
                if (! meta) {
                    for (var key in dh) {
                        if (key == 'control' || key == 'shift' || key == 'alt' || key == 'meta') continue;
                        stuck = key;
                        delete dh[key];
                    }
                }
            }
        }

        dh['alt'] = alt;
        dh['control'] = ctrl;
        dh['shift'] = shift;
        dh['meta'] = meta;
        if (dirty && LzKeyboardKernel.__scope && LzKeyboardKernel.__scope[LzKeyboardKernel.__callback]) {
            //console.log(t, s, k, delta, e.metaKey, e.ctrlKey, dh);
            if (stuck) {
                //console.log('stuck key', key, keycode);
                var keycode = kcodes[stuck];
                var fakedelta = {}
                fakedelta[key] = false;
                LzKeyboardKernel.__scope[LzKeyboardKernel.__callback](fakedelta, keycode, 'onkeyup');
            }
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
    ,__lockFocus: null
    ,setCallback: function (scope, keyboardcallback) {
        this.__scope = scope;
        this.__callback = keyboardcallback;
    }    
    ,setKeyboardControl: function (dhtmlKeyboardControl, force) {
        if (! force && LzKeyboardKernel.__lockFocus) {
            dhtmlKeyboardControl = true;
        }
        var handler = null;
        var setcontrol = (lz && lz.embed && lz.embed.options && lz.embed.options.cancelkeyboardcontrol != true) || true;
        if (setcontrol && dhtmlKeyboardControl) {
            //console.log('setKeyboardControl' + dhtmlKeyboardControl);
            handler = LzKeyboardKernel.__keyboardEvent;
        }
        if ( LzInputTextSprite.prototype.__focusedSprite ) {
            // hide any focused inputtexts
            LzInputTextSprite.prototype.__focusedSprite.__hideIfNotFocused();
        }
        // can't use lz.embed.attachEventHandler because we need to cancel events selectively
        if (LzSprite.prototype.quirks.keyboardlistentotop) {
            var doc = window.top.document;
        } else {
            var doc = document;
        }
        doc.onkeydown = handler;
        doc.onkeyup = handler;
        doc.onkeypress = handler;
    }
    // Called by lz.Keys when the last focusable element was reached.
    ,gotLastFocus: function () {
        //console.log('gotLastFocus', canvas.sprite.__LZdiv.mouseisover);
        if (! canvas.sprite.__LZdiv.mouseisover) LzKeyboardKernel.setKeyboardControl(false);
    }
    // Called to turn on/off restriction of focus to this application
    ,setGlobalFocusTrap: function (istrapped) {
        LzKeyboardKernel.__lockFocus = istrapped;
        if (LzSprite.prototype.quirks.activate_on_mouseover) {
            if (istrapped) {
                LzSprite.__rootSprite.__LZdiv.onmouseover();
            } else {
                LzSprite.__rootSprite.__LZdiv.onmouseout();
            }
        }
    }
}
