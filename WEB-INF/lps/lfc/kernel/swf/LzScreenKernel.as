/**
  * LzScreenKernel.as
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

// necessary for consistent behavior - in netscape browsers HTML is ignored
Stage.align = ('canvassalign' in global && global.canvassalign != null) ? global.canvassalign : "LT";
Stage.scaleMode = ('canvasscale' in global && global.canvasscale != null) ? global.canvasscale : "noScale";

// Receives mouse events from the runtime
// Sent from org/openlaszlo/compiler/SWFFile.java
var LzScreenKernel = {
    width: null
    ,height: null
    ,__resizeEvent: function() {
        LzScreenKernel.width = Stage.width;
        LzScreenKernel.height = Stage.height;

        if (LzScreenKernel.__callback) LzScreenKernel.__scope[LzScreenKernel.__callback]({width: LzScreenKernel.width, height: LzScreenKernel.height});
        //Debug.write('LzScreenKernel event', {width: LzScreenKernel.width, height: LzScreenKernel.height});
    }
    ,__init: function() {
        var listener = {
            onResize: LzScreenKernel.__resizeEvent
        }
        Stage.addListener(listener);
    }
    ,__callback: null
    ,__scope: null
    ,setCallback: function (scope, funcname) {
        //Debug.write('setCallback', scope, funcname);
        this.__scope = scope;
        this.__callback = funcname;
        this.__init();
        LzScreenKernel.__resizeEvent();
    }    
}
