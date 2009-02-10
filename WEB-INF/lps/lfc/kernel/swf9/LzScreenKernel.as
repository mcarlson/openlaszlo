/**
  * LzScreenKernel.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

// Receives mouse events from the runtime
// Sent from org/openlaszlo/compiler/SWFFile.java
public class LzScreenKernel {
    #passthrough (toplevel:true) {  
    import flash.display.*;
    import flash.events.*;
    import flash.utils.*;
    }#

    public static var width = null;
    public static var height = null;
    public static function handleResizeEvent(event:Event = null):void {
        width = LFCApplication.stage.stageWidth;
        height = LFCApplication.stage.stageHeight;
        if (__callback) {
            __scope[__callback]({width: width, height: height});
            //trace('LzScreenKernel event', {width: width, height: height});
        }
    }

    static var __callback = null;
    static var __scope = null;
    static var __listeneradded:Boolean = false;

    // N.B. The kernel API implementation used by LzCanvas currently
    // requires a call to handleResizeEvent when the callback is
    // set. This is the way that the canvas initial size gets set.
    public static function setCallback (scope, funcname) {
        //Debug.write('setCallback', scope, funcname);
        if (__listeneradded == false) {
            __scope = scope;
            __callback = funcname;
            LFCApplication.stage.addEventListener(Event.RESIZE, handleResizeEvent);
            handleResizeEvent();
            __listeneradded = true;
        }
    }
}
