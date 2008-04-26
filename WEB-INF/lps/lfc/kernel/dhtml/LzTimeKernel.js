/**
  * LzTimeKernel.lzs
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic JS1
  */

// Receives and sends timing events
var LzTimeKernel = {
    setTimeout: setTimeout
    ,setInterval: setInterval
    ,clearTimeout: clearTimeout
    ,clearInterval: clearInterval

    // Implement actionscript API to get ms since startup time 
    ,startTime: (new Date()).valueOf()   
    ,getTimer: function() {
        return (new Date()).valueOf() - LzTimeKernel.startTime;
    }    
}
