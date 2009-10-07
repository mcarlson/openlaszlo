/**
  * LzKeyboardKernel.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
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
        // On MacOS, Ctrl-v gives k == -1
        if (k <= 0) {
            return;
        }
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
        var ctrl = Key.isDown(Key.CONTROL);

        //Debug.info("__keyboardEvent k=%w s=%w %w ctrl=%w, delta=%w", k,s,t, ctrl,delta);

        if (t == 'onkeyup') {
            if (dh[s] != null) {
                delta[s] = false;
                dirty = true;
            }    
            dh[s] = null;
        } else if (t == 'onkeydown') {
            if (dh[s] == null) {
                delta[s] = true;    
                dirty = true;
            }    
            dh[s] = k;
        }

        //Debug.write('downKeysHash', t, k, dh, delta);
        if (dirty && LzKeyboardKernel.__callback) {
            LzKeyboardKernel.__scope[LzKeyboardKernel.__callback](delta, k, t, ctrl);
        }
    }
    ,__codes: {16: 'shift', 17: 'control', 18: 'alt'}
    ,__callback: null
    ,__scope: null
    ,setCallback: function (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
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
    }
    // Called by lz.Keys when the last focusable element was reached.
    ,gotLastFocus: function () {
    }
    ,onKeyDown: function () { LzKeyboardKernel.__keyboardEvent(Key.getCode(), 'onkeydown'); }
    ,onKeyUp: function () { LzKeyboardKernel.__keyboardEvent(Key.getCode(), 'onkeyup'); }
    // Called to turn on/off restriction of focus to this application
    ,setGlobalFocusTrap: function (istrapped) {
        LzBrowserKernel.callJS('lz.embed.applications.' + LzBrowserKernel.getAppID() + '.setGlobalFocusTrap', null, istrapped);
    }
}

Key.addListener(LzKeyboardKernel);



    
