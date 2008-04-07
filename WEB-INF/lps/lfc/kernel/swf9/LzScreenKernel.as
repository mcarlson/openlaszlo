/**
  * LzScreenKernel.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
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
    public static function handleResizeEvent(stage:Stage):void {
        LzScreenKernel.width = stage.stageWidth;
        LzScreenKernel.height = stage.stageHeight;
        if (LzScreenKernel.__callback) {
            LzScreenKernel.__scope[LzScreenKernel.__callback]({width: LzScreenKernel.width, height: LzScreenKernel.height});
            trace('LzScreenKernel event', {width: LzScreenKernel.width, height: LzScreenKernel.height});
        }
    }

    static var __callback = null;
    static var __scope = null;

    public static function setCallback (scope, funcname) {
        //Debug.write('setCallback', scope, funcname);
        __scope = scope;
        __callback = funcname;
        LzScreenKernel.handleResizeEvent();
    }
}
