/**
  * LzIdleKernel.as
  *
  * @copyright Copyright 2001-2006, 2008, 2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky 
  */

public class LzIdleKernel  {
  #passthrough (toplevel:true) {
    import flash.events.Event;
    import flash.utils.getTimer;
  }#

  #passthrough {
    // NOTE: [2009-04-23 ptw] Only public for debugging
    public static var __callbacks:Array = [];

    private static function __update(event:Event):void{
      var now = getTimer();
      // NOTE: [2009-04-23 ptw] We are careful to process from the
      // end, because a callback may remove itself.
      for (var i:int = __callbacks.length - 2; i >= 0; i -= 2) {
        var scope:* = __callbacks[i];
        var funcname:String = __callbacks[i + 1];
        scope[funcname](now);
      }
    }

    private static var __listening:Boolean = false;

    public static function addCallback (scope:*, funcname:String):void {
      for (var i:int = __callbacks.length - 2; i >= 0; i -= 2) {
        if (__callbacks[i] === scope && __callbacks[i + 1] == funcname) {
          return;
        }
      }
      __callbacks.push(scope, funcname);
      if ((__callbacks.length > 0) && (! __listening)) {
        __listening = true;
        LFCApplication.stage.addEventListener(Event.ENTER_FRAME, __update);
      }
    }

    // TODO: [2009-04-23 ptw] Does this really need to return the
    // spliced out callback?
    public static function removeCallback (scope:*, funcname:String):* {
      // Process from the end on the assumption the most likely
      // callback to be removed is the one that is running
      for (var i:int = __callbacks.length - 2; i >= 0; i -= 2) {
        if (__callbacks[i] === scope && __callbacks[i + 1] == funcname) {
          var removed:Array = __callbacks.splice(i, 2);
        }
      }
      if ((__callbacks.length == 0) && __listening) {
        LFCApplication.stage.removeEventListener(Event.ENTER_FRAME, __update);
        __listening = false;
      }
      return removed;
    }

    public static function setFrameRate(fps:int):void {
      LFCApplication.stage.frameRate = fps;
    }
  }#
}
