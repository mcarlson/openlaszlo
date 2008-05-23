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

// On IE6/7 window.setTimeout, window.setInterval cannot be called using
// apply(). A workaround can be found here:
// http://webreflection.blogspot.com/2007/06/simple-settimeout-setinterval-extra.html

if (LzSprite.prototype.quirks.ie_timer_closure) {
  (function(f){
    window.setTimeout = f(window.setTimeout);
    window.setInterval = f(window.setInterval);
  })(function(f){
    return function(c,t){
      var a = Array.prototype.slice.call(arguments,2);
      if(typeof c != "function")
        c = new Function(c);
        return f(function(){
        c.apply(this, a)
      }, t)
    }
  });
}

var LzTimeKernel = {
    setTimeout: function() {
        return window.setTimeout.apply(window, arguments);
    }
    ,setInterval: function() {
        return window.setInterval.apply(window, arguments);
    }
    ,clearTimeout: function(id) {
        return window.clearTimeout(id);
    }
    ,clearInterval: function(id) {
        return window.clearInterval(id);
    }

    // Implement actionscript API to get ms since startup time 
    ,startTime: (new Date()).valueOf()   
    ,getTimer: function() {
        return (new Date()).valueOf() - LzTimeKernel.startTime;
    }    
}
