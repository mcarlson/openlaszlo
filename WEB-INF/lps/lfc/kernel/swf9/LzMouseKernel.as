/**
  * LzMouseKernel.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

// Receives mouse events from the runtime
class LzMouseKernel  {
    #passthrough (toplevel:true) {  
    import flash.display.*;
    import flash.events.*;
    import flash.utils.*;
    import flash.ui.*;
    }#


    // sends mouse events to the callback
    static function __sendEvent(view, eventname) {
        if (LzMouseKernel.__callback) LzMouseKernel.__scope[LzMouseKernel.__callback](eventname, view);
        //Debug.write('LzMouseKernel event', eventname);
    }
    static var __callback = null;
    static var __scope = null;
    static var __lastMouseDown = null;
    static var __listeneradded:Boolean = false ;

    /**
     * Shows or hides the hand cursor for all clickable views.
     */
    static var showhandcursor:Boolean = true;

    static function setCallback (scope, funcname) {
        LzMouseKernel.__scope = scope;
        LzMouseKernel.__callback = funcname;
        if (LzMouseKernel.__listeneradded == false) {
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_MOVE, __mouseHandler);
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_UP,   __mouseHandler);
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_DOWN, __mouseHandler);
            LFCApplication.stage.addEventListener(Event.MOUSE_LEAVE,     __mouseLeavesHandler);
            LzMouseKernel.__listeneradded = true;
        }
    }    

    // Handles global mouse events
    static function __mouseHandler(event:MouseEvent):void {
        var eventname = 'on' + event.type.toLowerCase();
        //Debug.write('__mouseHandler', eventname);

        if (eventname == 'onmouseup' && __lastMouseDown != null) {
            // call mouseup on the sprite that got the last mouse down  
            LzMouseKernel.__lastMouseDown.__globalmouseup(event);
            __lastMouseDown = null;
        } else {
            LzMouseKernel.__sendEvent(null, eventname);
        }
    }

    // handles MOUSE_LEAVES event
    static function __mouseLeavesHandler(event:Event):void {
        var eventname = 'on' + event.type.toLowerCase();
        LzMouseKernel.__sendEvent(null, eventname);
    }


    /**
    * Shows or hides the hand cursor for all clickable views.
    * @param Boolean show: true shows the hand cursor for buttons, false hides it
    */
    static function showHandCursor (show) {
        LzMouseKernel.showhandcursor = show;
    }

    static var __amLocked:Boolean = false;
    static var cursorSprite:Sprite = null;
    static var globalCursorResource:String = null;
    static var lastCursorResource:String = null;

    /**
    * Sets the cursor to a resource
    * @param String what: The resource to use as the cursor. 
    */
    static function setCursorGlobal ( what:String ){
        globalCursorResource = what;
        setCursorLocal(what);
    }

    static function setCursorLocal ( what:String ) {
        if ( LzMouseKernel.__amLocked ) { return; }
        Mouse.hide();
        cursorSprite.x = LFCApplication.stage.mouseX + 1;
        cursorSprite.y = LFCApplication.stage.mouseY + 1;
        LFCApplication.setChildIndex(cursorSprite, LFCApplication._sprite.numChildren-1);
        if (lastCursorResource != what) {
            if (cursorSprite.numChildren > 0) {
                cursorSprite.removeChildAt(0);
            }
            var resourceSprite = getCursorResource(what);
            cursorSprite.addChild( resourceSprite );
            lastCursorResource = what;
        }
        // respond to mouse move events
        cursorSprite.startDrag();
        LFCApplication.stage.addEventListener(Event.MOUSE_LEAVE, mouseLeaveHandler);
        cursorSprite.visible = true;
    }

    static function mouseLeaveHandler(evt:Event):void {
        cursorSprite.visible = false;
    }


    static function getCursorResource (resource:String):Sprite {
          var resinfo = LzResourceLibrary[resource];
          var assetclass;
          var frames = resinfo.frames;
          var asset:DisplayObject;
          // single frame resources get an entry in LzResourceLibrary which has
          // 'assetclass' pointing to the resource Class object.
          if (resinfo.assetclass is Class) {
              assetclass = resinfo.assetclass;
          } else {
              // Multiframe resources have an array of Class objects in frames[]
              assetclass = frames[0];
          }

          if (! assetclass) return;
          asset = new assetclass();
          asset.scaleX = 1.0;
          asset.scaleY = 1.0;
          //Debug.write('cursor asset', asset);
          return asset;
    }

    /**
    * This function restores the default cursor if there is no locked cursor on
    * the screen.
    * 
    * @access private
    */
    static function restoreCursor ( ){
        if ( LzMouseKernel.__amLocked ) { return; }
        cursorSprite.stopDrag();
        cursorSprite.visible = false;
        globalCursorResource = null;
        Mouse.show();
    }

    /** Called by LzSprite to restore cursor to global value.
     */
    static function restoreCursorLocal ( ){
        if ( LzMouseKernel.__amLocked ) { return; }
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
    static function lock (){
        LzMouseKernel.__amLocked = true;
    }

    /**
    * Restores the default cursor.
    * 
    */
    static function unlock (){
        LzMouseKernel.__amLocked = false;
        LzMouseKernel.restoreCursor(); 
    }

    static function initCursor () {
        cursorSprite = new Sprite();
        cursorSprite.mouseEnabled = false;
        // Add the cursor DisplayObject to the root sprite
        LFCApplication.addChild(cursorSprite);
        cursorSprite.x = -10000;
        cursorSprite.y = -10000;
    }
}
