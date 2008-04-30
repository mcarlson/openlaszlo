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
    setTimeout: function() {
        return window.setTimeout.apply(null, arguments);
    }
    ,setInterval: function() {
        return window.setInterval.apply(null, arguments);
    }
    ,clearTimeout: function() {
        return window.clearTimeout.apply(null, arguments);
    }
    ,clearInterval: function() {
        return window.clearInterval.apply(null, arguments);
    }

    // Implement actionscript API to get ms since startup time 
    ,startTime: (new Date()).valueOf()   
    ,getTimer: function() {
        return (new Date()).valueOf() - LzTimeKernel.startTime;
    }    
}
