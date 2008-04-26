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
dynamic class LzTimeKernelClass {
    #passthrough (toplevel:true) {  
    import flash.utils.*;
    }#
    function LzTimeKernelClass(){
        this.getTimer = getTimer;
        this.setTimeout = setTimeout;
        this.setInterval = setInterval;
        this.clearTimeout = clearTimeout;
        this.clearInterval = clearInterval;
    }
}
var LzTimeKernel = new LzTimeKernelClass();
