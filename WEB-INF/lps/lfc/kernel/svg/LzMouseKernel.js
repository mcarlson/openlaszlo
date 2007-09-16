/**
  * LzMouseKernel.js
  *
  * @copyright Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic SVG
  */

// Receives mouse events from the runtime
var LzMouseKernel = {
    // the last view to receive the mouse down event
    __lastMouseDown: null
    ,__x: 0
    ,__y: 0
    ,owner: null
    ,__mouseEvent: function(e, eventname) {
        LzKeyboardKernel.__keyboardEvent(e);
        if (eventname == 'onmouseup' && LzMouseKernel.__lastMouseDown != null) {
            // call mouseup on the sprite that got the last mouse down  
            LzMouseKernel.__lastMouseDown.__globalmouseup(e);
        } else if (eventname == 'onmousemove') {
            if (e.pageX || e.pageY) {
                LzMouseKernel.__x = e.pageX;
                LzMouseKernel.__y = e.pageY;
            } else if (e.clientX || e.clientY) {
                LzMouseKernel.__x = e.clientX;
                LzMouseKernel.__y = e.clientY;
            }
        }    
        if (LzMouseKernel.__callback) LzMouseKernel.__scope[LzMouseKernel.__callback](eventname);
        //Debug.write('LzMouseKernel event', eventname);
    }
    ,__callback: null
    ,__scope: null
    ,setCallback: function (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
    }    
}

