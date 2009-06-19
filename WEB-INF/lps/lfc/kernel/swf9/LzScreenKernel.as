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
    import flash.events.FullScreenEvent;
    import flash.display.Stage;
    import flash.display.StageDisplayState;
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

    // Switch to Flash fullscreen mode
    // If the app is running in default display mode and the user switches
    // to fullscreen, we have to register an event to catch the pressing of
    // the ESC button.
    // If the user goes back from fullscreen into default mode, the change
    // of display state will trigger an flash.events.Fullscreen event, which
    // will be processed in fullScreenEventHandler().
    public static function showFullScreen(fullscreen:Boolean=true) :void {
        var stage:Stage = LFCApplication.stage;
        if (fullscreen && stage.displayState == StageDisplayState.NORMAL) {
            try {
                stage.displayState=StageDisplayState.FULL_SCREEN;
                // We need the event listener to capture if the user presses ESC to leave fullscreen
                stage.addEventListener(FullScreenEvent.FULL_SCREEN, fullScreenEventHandler);
                var result:Boolean = LFCApplication.stage.displayState != StageDisplayState.NORMAL;
                canvas.__fullscreenEventCallback(fullscreen==result, result);
            } catch (error:SecurityError) {
                canvas.__fullscreenErrorCallback(error.message);
            }
        } else if (!fullscreen) {
            stage.displayState=StageDisplayState.NORMAL;
        }
    }

    // Event handler for flash.events.FullScreenEvent
    // This method will only be called when the user goes from fullscreen mode
    // back into default display mode.
    private static function fullScreenEventHandler(ev:FullScreenEvent) :void {
        var stage:Stage = LFCApplication.stage;
        // Remove the event listener, since we are not in fullscreen mode any more
        stage.removeEventListener(FullScreenEvent.FULL_SCREEN, fullScreenEventHandler);
        canvas.__fullscreenEventCallback(true, ev.fullScreen);
    }
}
