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
        public static var __callbacks:Array = [];

        public static  function addCallback (scope:*, funcname:String):void {
            __callbacks.push([scope, funcname]);
        }

        public static function removeCallback (scope:*, funcname:String):* {
            for (var i:int = __callbacks.length - 1; i >= 0; i--) {
                if (__callbacks[i][0] == scope && __callbacks[i][1] == funcname) {
                    return __callbacks.splice(i, 1);
                }
            }
        }

        public static function __update(event:Event):void{
            for (var i:int = __callbacks.length - 1; i >= 0; i--) {
                var s:* = (__callbacks[i])[0];
                s[__callbacks[i][1]]( getTimer() );
            }
        }

        public static function startTimer(msecs:uint):void {
            LFCApplication.stage.addEventListener(Event.ENTER_FRAME, LzIdleKernel.__update);
            //setInterval( LzIdleKernel.__update, msecs );
        }

    }#
}
