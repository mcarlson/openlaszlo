/**
  * LzTimeKernel.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  */

// Receives and sends timing events
final class LzTimeKernelClass {
    #passthrough (toplevel:true) {
    import flash.utils.getTimer;
    import flash.utils.setTimeout;
    import flash.utils.setInterval;
    import flash.utils.clearTimeout;
    import flash.utils.clearInterval;
    }#

    const getTimer :Function = flash.utils.getTimer;
    const setTimeout :Function = flash.utils.setTimeout;
    const setInterval :Function = flash.utils.setInterval;
    const clearTimeout :Function = flash.utils.clearTimeout;
    const clearInterval :Function = flash.utils.clearInterval;

    function LzTimeKernelClass() {
    }
}
var LzTimeKernel = new LzTimeKernelClass();
