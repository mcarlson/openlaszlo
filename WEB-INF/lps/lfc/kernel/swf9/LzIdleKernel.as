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
      // NOTE: [2009-06-16 ptw] (LPP-8269) The handler can work
      // directly on the callback array because it knows that
      // add/remove work on copies
      for (var i:int = __callbacks.length - 2; i >= 0; i -= 2) {
        var scope:* = __callbacks[i];
        var funcname:String = __callbacks[i + 1];
        scope[funcname](now);
      }
    }

    private static var __listening:Boolean = false;

    public static function addCallback (scope:*, funcname:String):void {
      // NOTE: [2009-06-16 ptw] (LPP-8269) Manipulate a copy and
      // then atomically update
      var callbacks = __callbacks.slice(0);
      for (var i:int = callbacks.length - 2; i >= 0; i -= 2) {
        if (callbacks[i] === scope && callbacks[i + 1] == funcname) {
          return;
        }
      }
      callbacks.push(scope, funcname);
      __callbacks = callbacks;
      if ((callbacks.length > 0) && (! __listening)) {
        __listening = true;
        LFCApplication.stage.addEventListener(Event.ENTER_FRAME, __update);
      }
    }

    // TODO: [2009-04-23 ptw] Does this really need to return the
    // spliced out callback?
    public static function removeCallback (scope:*, funcname:String):* {
      // NOTE: [2009-06-16 ptw] (LPP-8269) Manipulate a copy and
      // then atomically update
      var callbacks = __callbacks.slice(0);
      for (var i:int = callbacks.length - 2; i >= 0; i -= 2) {
        if (callbacks[i] === scope && callbacks[i + 1] == funcname) {
          var removed:Array = callbacks.splice(i, 2);
        }
      }
      __callbacks = callbacks;
      if ((callbacks.length == 0) && __listening) {
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
