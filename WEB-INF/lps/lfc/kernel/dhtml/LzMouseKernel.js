/**
  * LzMouseKernel.js
  *
  * @copyright Copyright 2007, 2009 Laszlo Systems, Inc.  All Rights Reserved.
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
    // handles global mousedown, move events
    ,__mouseEvent: function(e) {
        if (!e) {
            e = window.event;
            var targ = e.srcElement; 
        } else {
            var targ = e.target; 
        }
        var eventname = 'on' + e.type;

        // send option/shift/ctrl key events
        if (window['LzKeyboardKernel'] && LzKeyboardKernel['__updateControlKeys']) {
            LzKeyboardKernel.__updateControlKeys(e);
        }

        var lzinputproto = window['LzInputTextSprite'] && LzInputTextSprite.prototype;
        if (lzinputproto && lzinputproto.__lastshown != null) {
            if (LzSprite.prototype.quirks.fix_ie_clickable) {
                lzinputproto.__hideIfNotFocused(eventname, targ);
            } else if (eventname != 'onmousemove') {
                lzinputproto.__hideIfNotFocused();
            }
        }

        if (eventname == 'onmousemove') {
            LzMouseKernel.__sendMouseMove(e);
        } else if (eventname == 'oncontextmenu' || (e.button == 2 && eventname == 'onmouseup') ) {
            if (targ) {
                // update mouse position, required for Safari
                LzMouseKernel.__sendMouseMove(e);
                return LzMouseKernel.__showContextMenu(e);
            }
        } else if (e.button != 2) {
            LzMouseKernel.__sendEvent(eventname);
        }
        //Debug.write('LzMouseKernel event', eventname);
    }
    // sends mouse events to the callback
    ,__sendEvent: function(eventname, view) {
        // hide context menus and skip events - see LPP-8189
        if (eventname == 'onclick') {
            if (LzMouseKernel.__showncontextmenu) {
                LzMouseKernel.__showncontextmenu.__hide();
            }
            if (! view) {
                // don't send global onclick events
                return;
            }
        }
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
            lz.embed.attachEventHandler(document, 'click', LzMouseKernel, '__mouseEvent');
            // Correct possible cross-domain issues - see LPP-8093
            try {
                if (window.top != window) lz.embed.attachEventHandler(window.top.document, 'mouseup', LzMouseKernel, '__mouseupEvent');
            } catch (e) {
            }
        } else {
            lz.embed.removeEventHandler(document, 'mousemove', LzMouseKernel, '__mouseEvent');
            lz.embed.removeEventHandler(document, 'mousedown', LzMouseKernel, '__mouseEvent');
            lz.embed.removeEventHandler(document, 'mouseup', LzMouseKernel, '__mouseupEvent');
            lz.embed.removeEventHandler(document, 'click', LzMouseKernel, '__mouseEvent');
            // Correct possible cross-domain issues - see LPP-8093
            try {
                if (window.top != window) lz.embed.removeEventHandler(window.top.document, 'mouseup', LzMouseKernel, '__mouseupEvent');
            } catch (e) {
            }
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
            var cs = this.__cachedSelection;
            if (cs) {
                var sprite = cs.s;
                sprite.setSelection(cs.st, cs.st + cs.sz);
                cs = null;
            }
        }
    }
    ,__cachedSelection: null
    ,setGlobalClickable: function (isclickable){
        //Debug.error('setGlobalClickable', isclickable, LzInputTextSprite.prototype.__lastfocus, LzInputTextSprite.prototype.__focusedSprite, LzInputTextSprite.prototype.__lastshown);
        if (! isclickable) {
            // reset any inputtexts that are showing so they don't disappear - see LPP-7190
            var lzinputproto = LzInputTextSprite.prototype;
            var lastshown = lzinputproto.__lastshown;
            if (lastshown) {
                LzMouseKernel.__cachedSelection = {s: lastshown, st: lastshown.getSelectionPosition(), sz: lastshown.getSelectionSize()};
                lastshown.__hide();
                lzinputproto.__lastshown = null;
            }
            var focused = lzinputproto.__focusedSprite;
            if (focused) {
                focused.deselect();
                lzinputproto.__focusedSprite = null;
            }
            var lastfocus = lzinputproto.__lastfocus;
            if (lastfocus) {
                lastfocus.deselect();
                lzinputproto.__lastfocus = null;
            }
        }
        var el = document.getElementById('lzcanvasclickdiv');
        el.style.display = isclickable ? 'block' : 'none';
    }
    ,__sendMouseMove: function(e, offsetx, offsety) {
        // see http://www.quirksmode.org/js/events_properties.html#position
        if (e.pageX || e.pageY) {
            LzMouseKernel.__x = e.pageX;
            LzMouseKernel.__y = e.pageY;
        } else if (e.clientX || e.clientY) {
            // IE doesn't implement pageX/pageY, instead scrollLeft/scrollTop
            // needs to be added to clientX/clientY
            var body = document.body, docElem = document.documentElement;
            LzMouseKernel.__x = e.clientX + body.scrollLeft + docElem.scrollLeft;
            LzMouseKernel.__y = e.clientY + body.scrollTop + docElem.scrollTop;
        }
        if (offsetx) {
            LzMouseKernel.__x += offsetx;
        }
        if (offsety) {
            LzMouseKernel.__y += offsety;
        }
        if (e.type == 'mousemove') {
            LzMouseKernel.__sendEvent('onmousemove');
        }
    }
    ,__showContextMenu: function(e) {
        // show the default menu if not found...
        var cmenu = LzSprite.__rootSprite.__contextmenu;
        if (document.elementFromPoint) {
            var swf8mode = LzSprite.prototype.quirks.swf8_contextmenu;
            var x = LzMouseKernel.__x;
            var y = LzMouseKernel.__y;
            var rootdiv = canvas.sprite.__LZdiv;
            var arr = [];
            do {
                var elem = document.elementFromPoint(x, y);
                if (! elem) {
                    // no element under position
                    break;
                } else {
                    var owner = elem.owner;
                    if (! owner) {
                        // no owner attached
                    } else if (owner.__contextmenu) {
                        // found a contextmenu
                        cmenu = owner.__contextmenu;
                        break;
                    } else if (LzSprite.prototype.quirks.ie_elementfrompoint && owner.scrolldiv === elem) {
                        // IE returns this first for text div. See LPP-8254
                    } else if (swf8mode && ((owner.__LZdiv === elem && owner.bgcolor != null)
                                    || owner instanceof LzTextSprite)) {
                        // swf8 compatibility: movieclips with bgcolor and textfields
                        // don't pass through context-menu
                        break;
                    }
                    // hide this element to get next layer
                    arr.push(elem, elem.style.display);
                    elem.style.display = 'none';
                }
            } while (elem !== rootdiv && elem.tagName != 'HTML');

            // restore display
            for (var i = arr.length - 1; i >= 0; i -= 2) {
                arr[i - 1].style.display = arr[i];
            }
        } else {
            // this is less reliable compared to elementFromPoint..
            var sprite = (e.srcElement || e.target).owner;
            if (sprite) {
                // walk up the parent chain looking for a __contextmenu
                while (sprite.__parent) {
                    if (sprite.__contextmenu) {
                        // check mouse bounds
                        var mpos = sprite.getMouse();
                        //Debug.write('pos', mpos, sprite.width, sprite.height);
                        if (mpos.x >= 0 && mpos.x < sprite.width &&
                            mpos.y >= 0 && mpos.y < sprite.height) {
                            cmenu = sprite.__contextmenu;
                            break;
                        }
                    }
                    sprite = sprite.__parent;
                }
            }
        }

        if (cmenu) {
            cmenu.kernel.__show();
            return cmenu.kernel.showbuiltins;
        }
    }
}
