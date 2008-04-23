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


    static function __mouseEvent(eventname) {
        if (LzMouseKernel.__callback) LzMouseKernel.__scope[LzMouseKernel.__callback](eventname);
        //Debug.write('LzMouseKernel event', eventname);
    }
    static var __callback = null;
    static var __scope = null;
    static var __lastMouseDown = null;
    static var __listeneradded:Boolean = false ;

    static function setCallback (scope, funcname) {
        LzMouseKernel.__scope = scope;
        LzMouseKernel.__callback = funcname;
        if (LzMouseKernel.__listeneradded == false) {
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_MOVE, __mouseHandler);
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_UP, __mouseHandler);
            LFCApplication.stage.addEventListener(MouseEvent.MOUSE_DOWN, __mouseHandler);
            LzMouseKernel.__listeneradded = true;
        }
    }    

    static function __mouseHandler(event:MouseEvent):void {
        var eventname = 'on' + event.type.toLowerCase();
        //Debug.write('__mouseHandler', eventname);

        if (eventname == 'onmouseup' && __lastMouseDown != null) {
            // call mouseup on the sprite that got the last mouse down  
            LzMouseKernel.__lastMouseDown.__globalmouseup(event);
        }
        LzGlobalMouse.__mouseEvent(eventname, null);
    }

    /**
    * Shows or hides the hand cursor for all clickable views.
    * @param Boolean show: true shows the hand cursor for buttons, false hides it
    */
    static function showHandCursor (show) {
        Debug.info("LzMouseKernel.showHandCursor not yet implemented.")
    }

    static var __amLocked:Boolean = false;
    /**
    * Sets the cursor to a resource
    * @param String what: The resource to use as the cursor. 
    */
    static function setCursorGlobal ( what ){
        if ( LzMouseKernel.__amLocked ) { return; }
        Debug.info("LzMouseKernel.setCursorGlobal not yet implemented.")
    }

    /**
    * This function restores the default cursor if there is no locked cursor on
    * the screen.
    * 
    * @access private
    */
    static function restoreCursor ( ){
        if ( LzMouseKernel.__amLocked ) { return; }
        Debug.info("LzMouseKernel.restoreCursor not yet implemented.")
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
}
