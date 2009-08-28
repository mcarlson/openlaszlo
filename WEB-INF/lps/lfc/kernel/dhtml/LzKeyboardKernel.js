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
    // Key is the character (or a name for shift keys), value is the keycode
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
        if (k >= 0 && k != 16 && k != 17 && k != 18 && k != 224) {
            // TODO: add mapping to flash character codes?
            var s = String.fromCharCode(k).toLowerCase();
            if (t == 'keyup') {
                if (dh[s] != null) {
                    delta[s] = false;
                    dirty = true;
                }
                dh[s] = null;
            } else if (t == 'keydown') {
                if (dh[s] == null) {
                    delta[s] = true;
                    dirty = true;
                }
                dh[s] = k;
            }
        }

        if (LzKeyboardKernel.__updateControlKeys(e, delta)) {
            dirty = true;
        }

        if (dirty) {
            var scope = LzKeyboardKernel.__scope;
            var callback = LzKeyboardKernel.__callback;
            if (scope && scope[callback]) {
                scope[callback](delta, k, 'on' + t);
            }
        }

        // cancel bubbling
        if (k >= 0) {
            if (k == 9) {
                //Debug.write('canceling tab');
                e.cancelBubble = true;
                return false;
            } else if (LzKeyboardKernel.__cancelKeys &&
                       (k == 13 || k == 0 || k == 37 || k == 38 || k == 39 || k == 40 || k == 8) ) {
                //Debug.write('canceling key', k, t);
                // cancel event bubbling for enter, space(scroll), arrow keys and backspace (history)
                e.cancelBubble = true;
                return false;
            }
        }
        //Debug.write('downKeysHash', t, k, dh, delta);
    }
    ,__updateControlKeys: function (e, delta) {
        var quirks = LzSprite.prototype.quirks;
        var dh = LzKeyboardKernel.__downKeysHash;
        var dirty = false;
        if (delta) {
            var send = false;
        } else {
            // Called with mouse-event, see LzSprite, LzMouseKernel
            delta = {};
            var send = true;
        }
        var alt = e['altKey'];
        if ((dh['alt'] != null) != alt) {
            dh['alt'] = alt?18:null;
            delta['alt'] = alt;
            dirty = true;
            if (quirks['alt_key_sends_control']) {
                delta['control'] = delta['alt'];
            }
        }

        var ctrl = e['ctrlKey'];
        if ((dh['control'] != null) != ctrl) {
            dh['control'] = ctrl?17:null;
            delta['control'] = ctrl;
            dirty = true;
        }

        var shift = e['shiftKey'];
        if ((dh['shift'] != null) != shift) {
            dh['shift'] = shift?16:null;
            delta['shift'] = shift;
            dirty = true;
        }
    
        // look for stuck keys (see LPP-8210)
        if (quirks['hasmetakey']) {
            var meta = e['metaKey'];
            if ((dh['meta'] != null) != meta) {
                dh['meta'] = meta?224:null;
                delta['meta'] = meta;
                dirty = true;
                // Is this a quirk?
                delta['control'] = meta;
                if (! meta) {
                    // If meta goes up, clear all the other keys
                    LzKeyboardKernel.__allKeysUp();
                    dirty = false;
                }
            }
        }

        if (dirty && send) {
            var scope = LzKeyboardKernel.__scope;
            var callback = LzKeyboardKernel.__callback;
            if (scope && scope[callback]) {
                scope[callback](delta, 0, 'on' + e.type);
            }
        }

        return dirty;
    }
    // Called by lz.embed when the browser window regains focus
    ,__allKeysUp: function () {
        var delta = null;
        var stuck = false;
        var keys = null;
        var dh = LzKeyboardKernel.__downKeysHash;
        for (var key in dh) {
          if (dh[key] != null) {
            stuck = true;
            if (! delta) { delta = {}; }
            delta[key] = false;
            if (key.length == 1) {
              if (! keys) { keys = []; }
              keys.push(dh[key]);
            }
            dh[key] = null;
          }
        }
//         Debug.info("[%6.2f] All keys up: %w, %w", (new Date).getTime() % 1000000, delta, keys);
        var scope = LzKeyboardKernel.__scope;
        var callback = LzKeyboardKernel.__callback;
        if (stuck && scope && scope[callback]) {
          if (!keys) {
            scope[callback](delta, 0, 'onkeyup');
          } else for (var i = 0, l = keys.length; i < l; i++) {
            scope[callback](delta, keys[i], 'onkeyup');
          }
        }
        LzKeyboardKernel.__downKeysHash = {};
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
        //console.log('gotLastFocus', LzSprite.__rootSpriteContainer.mouseisover);
        if (!  LzSprite.__rootSpriteContainer.mouseisover) LzKeyboardKernel.setKeyboardControl(false);
    }
    // Called to turn on/off restriction of focus to this application
    ,setGlobalFocusTrap: function (istrapped) {
        LzKeyboardKernel.__lockFocus = istrapped;
        if (LzSprite.prototype.quirks.activate_on_mouseover) {
            var rootcontainer = LzSprite.__rootSpriteContainer;
            if (istrapped) {
                rootcontainer.onmouseover();
            } else {
                rootcontainer.onmouseout();
            }
        }
    }
}
