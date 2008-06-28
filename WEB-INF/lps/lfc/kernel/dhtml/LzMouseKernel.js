/**
  * LzMouseKernel.js
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

// Receives mouse events from the runtime
var LzMouseKernel = {
    // the last view to receive the mouse down event
    __lastMouseDown: null
    ,__x: 0
    ,__y: 0
    ,owner: null
    ,__showncontextmenu: null
    ,__defaultcontextmenu: null
    // handles global mousedown, move events
    ,__mouseEvent: function(e) {
        if (!e) {
            e = window.event;
            var targ = e.target; 
        } else {
            var targ = e.srcElement; 
        }
        var eventname = 'on' + e.type;
        if (window['LzKeyboardKernel'] && LzKeyboardKernel['__keyboardEvent']) LzKeyboardKernel.__keyboardEvent(e);
        if (window['LzInputTextSprite'] && LzInputTextSprite.prototype.__lastshown != null) {
            if (LzSprite.prototype.quirks.fix_ie_clickable) {
                LzInputTextSprite.prototype.__lastshown.__hideIfNotFocused(eventname, targ);
            } else if (eventname != 'onmousemove') {
                LzInputTextSprite.prototype.__lastshown.__hideIfNotFocused();
            }
        }
        if (eventname == 'onmousemove') {
            if (e.pageX || e.pageY) {
                LzMouseKernel.__x = e.pageX;
                LzMouseKernel.__y = e.pageY;
            } else if (e.clientX || e.clientY) {
                LzMouseKernel.__x = e.clientX;
                LzMouseKernel.__y = e.clientY;
            }
        }    

        if (e.button == 2 && eventname != 'oncontextmenu') return;
        if (eventname == 'oncontextmenu') {
            if (targ && targ.owner && targ.owner.__contextmenu) {
                targ.owner.__contextmenu.kernel.__show();
                return targ.owner.__contextmenu.kernel.showbuiltins;
            } else if (LzMouseKernel.__defaultcontextmenu) {
                LzMouseKernel.__defaultcontextmenu.kernel.__show();
                return LzMouseKernel.__defaultcontextmenu.kernel.showbuiltins;
            }
        } else {
            LzMouseKernel.__sendEvent(eventname);
        }
        //Debug.write('LzMouseKernel event', eventname);
    }
    // sends mouse events to the callback
    ,__sendEvent: function(eventname, view) {
        if (LzMouseKernel.__callback) {
            LzMouseKernel.__scope[LzMouseKernel.__callback](eventname, view);
        }
        //Debug.write('LzMouseKernel event', eventname);
    }
    ,__callback: null
    ,__scope: null
    // handles global mouseup events
    ,__mouseupEvent: function (e) {
        if (LzMouseKernel.__lastMouseDown != null) {
            // call mouseup on the sprite that got the last mouse down  
            LzMouseKernel.__lastMouseDown.__globalmouseup(e);
        } else {
            LzMouseKernel.__mouseEvent(e);
        }
    }
    ,setCallback: function (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
    }
    ,__mousecontrol: false
    // Called to register/unregister global mouse events.
    ,setMouseControl: function (ison) {
        if (ison == LzMouseKernel.__mousecontrol) return;
        //Debug.write('mousecontrol', ison);
        LzMouseKernel.__mousecontrol = ison;
        if (ison) {
            lz.embed.attachEventHandler(document, 'mousemove', LzMouseKernel, '__mouseEvent');
            lz.embed.attachEventHandler(document, 'mousedown', LzMouseKernel, '__mouseEvent');
            lz.embed.attachEventHandler(document, 'mouseup', LzMouseKernel, '__mouseupEvent');
            if (window.top != window) lz.embed.attachEventHandler(window.top.document, 'mouseup', LzMouseKernel, '__mouseupEvent');
        } else {
            lz.embed.removeEventHandler(document, 'mousemove', LzMouseKernel, '__mouseEvent');
            lz.embed.removeEventHandler(document, 'mousedown', LzMouseKernel, '__mouseEvent');
            lz.embed.removeEventHandler(document, 'mouseup', LzMouseKernel, '__mouseupEvent');
            if (window.top != window) lz.embed.removeEventHandler(window.top.document, 'mouseup', LzMouseKernel, '__mouseupEvent');
        }
        // Prevent context menus in Firefox 1.5 - see LPP-2678
        document.oncontextmenu = ison ? LzMouseKernel.__mouseEvent : null;
    }    
    ,__showhand: 'pointer'

    /**
    * Shows or hides the hand cursor for all clickable views.
    * @param Boolean show: true shows the hand cursor for buttons, false hides it
    */
    ,showHandCursor: function (show) {
        var c = show == true ? 'pointer' : 'default';
        this.__showhand = c;
        LzMouseKernel.setCursorGlobal(c);
    }

    /**
    * Sets the cursor to a resource
    * @param String c: cursor ID to use, or '' for default.  See 
    * http://www.quirksmode.org/css/cursor.html for valid IDs
    */
    ,setCursorGlobal: function ( n ){
        if (LzSprite.prototype.quirks.no_cursor_colresize) {
            return;
        }
        var n = LzSprite.prototype.__defaultStyles.hyphenate(n);
        LzSprite.prototype.__setCSSClassProperty('.lzclickdiv', 'cursor', n);
        LzSprite.prototype.__setCSSClassProperty('.lzdiv', 'cursor', n);
        LzSprite.prototype.__setCSSClassProperty('.lzcanvasdiv', 'cursor', n);
        LzSprite.prototype.__setCSSClassProperty('.lzcanvasclickdiv', 'cursor', n); 
    }

    /**
    * This function restores the default cursor if there is no locked cursor on
    * the screen.
    * 
    * @access private
    */
    ,restoreCursor: function ( ){
        if (LzSprite.prototype.quirks.no_cursor_colresize) {
            return;
        }
        if ( LzMouseKernel.__amLocked ) return;
        LzSprite.prototype.__setCSSClassProperty('.lzclickdiv', 'cursor', LzMouseKernel.__showhand);
        LzSprite.prototype.__setCSSClassProperty('.lzdiv', 'cursor', 'default');
        LzSprite.prototype.__setCSSClassProperty('.lzcanvasdiv', 'cursor', 'default');
        LzSprite.prototype.__setCSSClassProperty('.lzcanvasclickdiv', 'cursor', 'default'); 
    }

    /**
    * Prevents the cursor from being changed until unlock is called.
    * 
    */
    ,lock: function (){
        LzMouseKernel.__amLocked = true;
    }

    /**
    * Restores the default cursor.
    * 
    */
    ,unlock: function (){
        LzMouseKernel.__amLocked = false;
        LzMouseKernel.restoreCursor(); 
    }

    ,disableMouseTemporarily: function (){
        this.setGlobalClickable(false);
        this.__resetonmouseover = true; 
    }
    ,__resetonmouseover: false
    ,__resetMouse: function (){
        if (this.__resetonmouseover) {
            this.__resetonmouseover = false;
            this.setGlobalClickable(true);
        }
    }
    ,setGlobalClickable: function (isclickable){
        var el = document.getElementById('lzcanvasclickdiv');
        el.style.display = isclickable ? 'block' : 'none';
    }
}
