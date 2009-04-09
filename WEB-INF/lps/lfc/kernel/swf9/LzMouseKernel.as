/**
  * LzMouseKernel.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  */

// Receives mouse events from the runtime
class LzMouseKernel  {
    #passthrough (toplevel:true) {
    import flash.display.Sprite;
    import flash.events.Event;
    import flash.events.MouseEvent;
    import flash.text.TextField;
    import flash.ui.*;
    import flash.utils.getDefinitionByName;
    }#


    //////////////////
    // MOUSE EVENTS //
    //////////////////

    // sends mouse events to the callback
    static function __sendEvent (view:*, eventname:String) :void {
        if (__callback) __scope[__callback](eventname, view);
        //Debug.write('LzMouseKernel event', eventname);
    }

    static var __callback:String = null;
    static var __scope:* = null;
    static var __lastMouseDown:LzSprite = null;
    static var __mouseLeft:Boolean = false;
    static var __listeneradded:Boolean = false;

    /**
     * Shows or hides the hand cursor for all clickable views.
     */
    static var showhandcursor:Boolean = true;

    static function setCallback (scope:*, funcname:String) :void {
        __scope = scope;
        __callback = funcname;
        if (__listeneradded == false) {
            /* TODO [hqm 2008-01] Do we want to do anything with other
            * events, like click?
            stage.addEventListener(MouseEvent.CLICK, reportClick);
            */

            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_MOVE, __mouseHandler);
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_UP,   __mouseHandler);
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_DOWN, __mouseHandler);
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_WHEEL, __mouseWheelHandler);
            LFCApplication.stage.addEventListener(Event.MOUSE_LEAVE, __mouseLeaveHandler);
            __listeneradded = true;
        }
    }

    // Handles global mouse events
    static function __mouseHandler (event:MouseEvent) :void {
        var eventname:String = 'on' + event.type.toLowerCase();
        if (eventname == 'onmouseup' && __lastMouseDown != null) {
            // call mouseup on the sprite that got the last mouse down
            __lastMouseDown.__globalmouseup(event);
            __lastMouseDown = null;
        } else {
            if (__mouseLeft) {
                __mouseLeft = false;
                // Mouse reentered the app.
                if (event.buttonDown) __mouseUpOutsideHandler();

                // TODO [hqm 2009-04] LPP-7957 -- this works
                // around Firefox bug; if you are making a text
                // selection, and then drag the mouse outside of
                // the app while the left button is down, and then
                // release it. When you bring the mouse back into
                // the app, the selection is stuck dragging
                // because Flash plugin never gets the mouse up.
                LFCApplication.stage.focus = null;

                // generate a 'onmouseenter' event
                __sendEvent(null, 'onmouseenter');
            }
            __sendEvent(null, eventname);
        }
    }


    // sends mouseup and calls __globalmouseup when the mouse goes up outside the app - see LPP-7724
    static function __mouseUpOutsideHandler () :void {
        if (__lastMouseDown != null) {
            var ev:MouseEvent = new MouseEvent('mouseup');
            __lastMouseDown.__globalmouseup(ev);
            __lastMouseDown = null;
        }
    }

    // handles MOUSE_LEAVE event
    static function __mouseLeaveHandler (event:Event = null) :void {
        __mouseLeft = true;
        __sendEvent(null, 'onmouseleave');
    }

    static function __mouseWheelHandler (event:MouseEvent) :void {
        lz.Keys.__mousewheelEvent(event.delta);
    }


    //////////////////
    // MOUSE CURSOR //
    //////////////////

    /**
    * Shows or hides the hand cursor for all clickable views.
    * @param Boolean show: true shows the hand cursor for buttons, false hides it
    */
    static function showHandCursor (show:Boolean) :void {
        showhandcursor = show;
    }

    static var __amLocked:Boolean = false;
    static var useBuiltinCursor:Boolean = false;
    static var cursorSprite:Sprite = null;
    static var globalCursorResource:String = null;
    static var lastCursorResource:String = null;

    #passthrough {
        private static var __MouseCursor:Object = null;
        private static function get MouseCursor () :Object {
            if (__MouseCursor == null) {
                __MouseCursor = getDefinitionByName('flash.ui.MouseCursor');
            }
            return __MouseCursor;
        }

        private static var __builtinCursors:Object = null;
        static function get builtinCursors () :Object {
            if (__builtinCursors == null) {
                var cursors:Object = {};
                if ($swf10) {
                    cursors[MouseCursor.ARROW] = true;
                    cursors[MouseCursor.AUTO] = true;
                    cursors[MouseCursor.BUTTON] = true;
                    cursors[MouseCursor.HAND] = true;
                    cursors[MouseCursor.IBEAM] = true;
                }
                __builtinCursors = cursors;
            }
            return __builtinCursors;
        }

        static function get hasGlobalCursor () :Boolean {
            var gcursor:String = globalCursorResource;
            if ($swf10) {
                return ! (gcursor == null || (gcursor == MouseCursor.AUTO && useBuiltinCursor));
            } else {
                return ! (gcursor == null);
            }
        }
    }#

    /**
    * Sets the cursor to a resource
    * @param String what: The resource to use as the cursor.
    */
    static function setCursorGlobal (what:String) :void {
        globalCursorResource = what;
        setCursorLocal(what);
    }

    static function setCursorLocal (what:String) :void {
        if ( __amLocked ) { return; }
        if (what == null) {
            // null is invalid, maybe call restoreCursor()?
            return;
        } else if (lastCursorResource != what) {
            var resourceSprite:Sprite = getCursorResource(what);
            if (resourceSprite != null) {
                if (cursorSprite.numChildren > 0) {
                    cursorSprite.removeChildAt(0);
                }
                cursorSprite.addChild( resourceSprite );
                useBuiltinCursor = false;
            } else if (builtinCursors[what] != null) {
                useBuiltinCursor = true;
            } else {
                // invalid cursor?
                return;
            }
            lastCursorResource = what;
        }
        if (useBuiltinCursor) {
            if ($swf10) { Mouse['cursor'] = what; }
            cursorSprite.stopDrag();
            cursorSprite.visible = false;
            LFCApplication.stage.removeEventListener(Event.MOUSE_LEAVE, mouseLeaveHandler);
            LFCApplication.stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);
            Mouse.show();
        } else {
            // you can only hide the Mouse when Mouse.cursor is AUTO
            if ($swf10) { Mouse['cursor'] = MouseCursor.AUTO; }
            Mouse.hide();
            cursorSprite.x = LFCApplication.stage.mouseX;
            cursorSprite.y = LFCApplication.stage.mouseY;
            LFCApplication.setChildIndex(cursorSprite, LFCApplication._sprite.numChildren-1);
            // respond to mouse move events
            cursorSprite.startDrag();
            LFCApplication.stage.addEventListener(Event.MOUSE_LEAVE, mouseLeaveHandler);
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);
            cursorSprite.visible = true;
        }
    }

    /**
     * Triggered when cursor leaves screen or context-menu is opened, in both
     * cases we must display the system cursor
     */
    private static function mouseLeaveHandler (event:Event) :void {
        cursorSprite.visible = false;
        Mouse.show();
        // use capture-phase because most sprites call stopPropagation() for mouse-events
        LFCApplication.stage.addEventListener(MouseEvent.MOUSE_OVER, mouseEnterHandler, true);
    }

    /**
     * Triggered when cursor enters screen or context-menu is closed
     */
    private static function mouseEnterHandler (event:Event) :void {
        cursorSprite.visible = true;
        Mouse.hide();
        LFCApplication.stage.removeEventListener(MouseEvent.MOUSE_OVER, mouseEnterHandler, true);
    }

    /**
     * Hide custom cursor over selectable TextFields otherwise both the ibeam-cursor
     * and the custom cursor are displayed
     */
    private static function mouseMoveHandler (event:MouseEvent) :void {
        var target:Object = event.target;
        if (target is TextField && target.selectable) {
            cursorSprite.visible = false;
            Mouse.show();
        } else {
            Mouse.hide();
            cursorSprite.visible = true;
        }
    }

    private static function getCursorResource (resource:String) :Sprite {
          if (! (LzAsset.isMovieClipAsset(resource) || LzAsset.isMovieClipLoaderAsset(resource))) {
              // only swf cursors are supported
              return null;
          }

          var resinfo:Object = LzResourceLibrary[resource];
          var assetclass:Class;
          // single frame resources get an entry in LzResourceLibrary which has
          // 'assetclass' pointing to the resource Class object.
          if (resinfo.assetclass is Class) {
              assetclass = resinfo.assetclass;
          } else {
              // Multiframe resources have an array of Class objects in frames[]
              var frames:Array = resinfo.frames;
              assetclass = frames[0];
          }

          var asset:Sprite = new assetclass();
          asset.scaleX = 1.0;
          asset.scaleY = 1.0;
          return asset;
    }

    /**
    * This function restores the default cursor if there is no locked cursor on
    * the screen.
    *
    * @access private
    */
    static function restoreCursor () :void {
        if ( __amLocked ) { return; }
        cursorSprite.stopDrag();
        cursorSprite.visible = false;
        LFCApplication.stage.removeEventListener(Event.MOUSE_LEAVE, mouseLeaveHandler);
        LFCApplication.stage.removeEventListener(MouseEvent.MOUSE_MOVE, mouseMoveHandler);
        globalCursorResource = null;
        if ($swf10) { Mouse['cursor'] = MouseCursor.AUTO; }
        Mouse.show();
    }

    /** Called by LzSprite to restore cursor to global value.
     */
    static function restoreCursorLocal () :void {
        if ( __amLocked ) { return; }
        if (globalCursorResource == null) {
            // Restore to system default pointer
            restoreCursor();
        } else {
            // Restore to the last value set by setCursorGlobal
            setCursorLocal(globalCursorResource);
        }
    }

    /**
    * Prevents the cursor from being changed until unlock is called.
    *
    */
    static function lock () :void {
        __amLocked = true;
    }

    /**
    * Restores the default cursor.
    *
    */
    static function unlock () :void {
        __amLocked = false;
        restoreCursor();
    }

    static function initCursor () :void {
        cursorSprite = new Sprite();
        cursorSprite.mouseChildren = false;
        cursorSprite.mouseEnabled = false;
        cursorSprite.visible = false;
        // Add the cursor DisplayObject to the root sprite
        LFCApplication.addChild(cursorSprite);
        cursorSprite.x = -10000;
        cursorSprite.y = -10000;
    }
}
