/**
  * LzIdleKernel.as
  *
  * @copyright Copyright 2001-2006, 2008-2010 Laszlo Systems, Inc.  All Rights Reserved.
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
      // NOTE: [2009-06-16 ptw] (LPP-8269) The handler can work
      // directly on the callback array because it knows that
      // add/remove work on copies
      var callbacks:Array = __callbacks;
      var now:int = getTimer();
      for (var i:int = callbacks.length - 2; i >= 0; i -= 2) {
        var scope:* = callbacks[i];
        var funcname:String = callbacks[i + 1];
        scope[funcname](now);
      }
    }

    private static var __listening:Boolean = false;

    public static function addCallback (scope:*, funcname:String):void {
      // NOTE: [2009-06-16 ptw] (LPP-8269) Manipulate a copy and
      // then atomically update
      var callbacks:Array = __callbacks;
      for (var i:int = callbacks.length - 2; i >= 0; i -= 2) {
        if (callbacks[i] === scope && callbacks[i + 1] == funcname) {
          // don't add a callback multiple times
          return;
        }
      }
      (__callbacks = callbacks.slice(0)).push(scope, funcname);
      if (! __listening) {
        __listening = true;
        LFCApplication.stage.addEventListener(Event.ENTER_FRAME, __update);
      }
    }

    // TODO: [2009-04-23 ptw] Does this really need to return the
    // spliced out callback?
    public static function removeCallback (scope:*, funcname:String):* {
      // NOTE: [2009-06-16 ptw] (LPP-8269) Manipulate a copy and
      // then atomically update
      var callbacks:Array = __callbacks;
      for (var i:int = callbacks.length - 2; i >= 0; i -= 2) {
        if (callbacks[i] === scope && callbacks[i + 1] == funcname) {
          __callbacks = callbacks = callbacks.slice(0);
          var removed:Array = callbacks.splice(i, 2);
          if (callbacks.length == 0) {
            LFCApplication.stage.removeEventListener(Event.ENTER_FRAME, __update);
            __listening = false;
          }
          // it's safe to return after the first hit, because addCallback()
          // ensures a single callback is never added more than once
          return removed;
        }
      }
    }

    public static function setFrameRate(fps:int):void {
      LFCApplication.stage.frameRate = fps;
    }
  }#
}
