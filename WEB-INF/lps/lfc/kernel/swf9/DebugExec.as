/**
  * DebugExec.as
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @author Henry Minsky &lt;hminsky@laszlosystems.com&gt;
  */

public class DebugExec extends Sprite {

    #passthrough (toplevel:true) {  
    import flash.display.*;
    import flash.events.*;
    import flash.utils.*;
    import flash.text.*;
    import flash.system.*;
    import flash.net.*;
    import flash.ui.*;
    import flash.text.Font;
    import flash.display.*;
    }#

    public function DebugExec (...ignore) {
    }

    public function write(...args):void {
        trace("DebugExec.write called with ", args.join(" "));
        lzconsole.write(args.join(" "));
    }

    public function doit ():void {
        trace("DebugExec.doit() was invoked...");
        write("DebugExec.doit() was invoked...");
    }
}





