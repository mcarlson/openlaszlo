/**
  * LzScreenKernel.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
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
    // Listener for fullScreen event
    ,fullScreenListener: new Object()
    // Switch to Flash fullscreen mode
    ,showFullScreen: function (fullscreen) {
        if(Stage["displayState"]=="normal"){
            Stage["displayState"]="fullScreen";
            Stage.addListener(LzScreenKernel.fullScreenListener);
            LzScreenKernel.fullScreenListener.onFullScreen = LzScreenKernel.fullScreenEventHandler;
            // Callback to the send an onfullscreen event
            var isFullScreen = Stage["displayState"] != "normal";
            canvas.__fullscreenEventCallback(fullscreen == isFullScreen, isFullScreen); 
            if (Stage["displayState"] != "fullScreen") {
                canvas.__fullscreenErrorCallback(null)
            }
        } else {
            Stage["displayState"]="normal";
        }
    }
    ,fullScreenEventHandler: function(isFullScreen:Boolean){
        Stage.removeListener(LzScreenKernel.fullScreenListener);
        // Callback to the send an onfullscreen event
        canvas.__fullscreenEventCallback(true, isFullScreen);        
    }
}
