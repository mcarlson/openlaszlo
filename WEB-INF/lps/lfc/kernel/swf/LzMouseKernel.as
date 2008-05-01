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
// Sent from org/openlaszlo/compiler/SWFFile.java
var LzMouseKernel = {
    __mouseEvent: function(eventname) {
        if (LzMouseKernel.__callback) LzMouseKernel.__scope[LzMouseKernel.__callback](eventname);
        //Debug.write('LzMouseKernel event', eventname);
    }
    ,__callback: null
    ,__scope: null
    ,__listeneradded: false 
    ,setCallback: function (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
        if (this.__listeneradded == false) {
            Mouse.addListener(LzMouseKernel.__mouselistener);
            this.__listeneradded = true;
        }
    }    

    /**
    * Shows or hides the hand cursor for all clickable views.
    * @param Boolean show: true shows the hand cursor for buttons, false hides it
    */
    ,showHandCursor: function (show) {
        Button.prototype.useHandCursor = show;
    }

    /**
    * Sets the cursor to a resource
    * @param String what: The resource to use as the cursor. 
    */
    ,setCursorGlobal: function ( what ){
        if ( LzMouseKernel.__amLocked ) { return; }
        _root.attachMovie (what , "cCursor" , 5555 );
        _root.cCursor._x = _root._xmouse;
        _root.cCursor._y = _root._ymouse;
        _root.cCursor.startDrag( true );
        Mouse.hide();
    }

    /**
    * This function restores the default cursor if there is no locked cursor on
    * the screen.
    * 
    * @access private
    */
    ,restoreCursor: function ( ){
        if ( LzMouseKernel.__amLocked ) { return; }
        // SWF-specific
        _root.cCursor.stopDrag();
        _root.cCursor.removeMovieClip (  );
        Mouse.show();
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
    ,__mouselistener: {
        onMouseMove: function () { 
            LzGlobalMouse.__mouseEvent('onmousemove');
        }
        ,onMouseWheel: function(d) {
            LzKeys.__mousewheelEvent(d);
        }
    }
}
