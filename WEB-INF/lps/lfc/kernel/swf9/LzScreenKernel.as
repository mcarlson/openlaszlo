/**
  * LzScreenKernel.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  */
public class LzScreenKernel {
    #passthrough (toplevel:true) {
    import flash.events.Event;
    }#

    public static var width:* = null;
    public static var height:* = null;
    public static function handleResizeEvent(event:Event = null):void {
        width = LFCApplication.stage.stageWidth;
        height = LFCApplication.stage.stageHeight;
        if (__callback) {
            __scope[__callback]({width: width, height: height});
            //trace('LzScreenKernel event', {width: width, height: height});
        }
    }

    static var __callback:String = null;
    static var __scope:* = null;
    static var __listeneradded:Boolean = false;

    // N.B. The kernel API implementation used by LzCanvas currently
    // requires a call to handleResizeEvent when the callback is
    // set. This is the way that the canvas initial size gets set.
    public static function setCallback (scope:*, funcname:String) :void {
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
