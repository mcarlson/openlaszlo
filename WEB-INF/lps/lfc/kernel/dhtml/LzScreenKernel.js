/**
  * LzScreenKernel.js
  *
  * @copyright Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

// Receives screen resize events from the runtime
var LzScreenKernel = {
    width: null
    ,height: null
    ,__resizeEvent: function() {
        // thanks quirksmode!  http://www.quirksmode.org/viewport/compatibility.html

        if (window.top.innerHeight) {
            // all except Explorer
            var sc = window.top.document.body;
            LzScreenKernel.width = sc.scrollWidth;
            LzScreenKernel.height = sc.scrollHeight;
        } else if (window.top.document.documentElement && window.top.document.documentElement.clientHeight) {
            // Explorer 6 Strict Mode
            var sc = window.top.document.documentElement;
            LzScreenKernel.width = sc.scrollWidth;
            LzScreenKernel.height = sc.scrollHeight;
        } else if (window.top.document.body) {
            // other Explorers
            var sc = window.top.document.body;
            LzScreenKernel.width = window.top.document.body.scrollWidth;
            LzScreenKernel.height = window.top.document.body.clientHeight;
        }

        /*
        var test1 = window.top.document.body.scrollHeight;
        var test2 = window.top.document.body.offsetHeight
        if (test1 > test2) { 
            // all but Explorer Mac
            LzScreenKernel.width = window.top.document.body.scrollWidth;
            LzScreenKernel.height = window.top.document.body.scrollHeight;
        } else { 
            // Explorer Mac;
            //would also work in Explorer 6 Strict, Mozilla and Safari
            LzScreenKernel.width = window.top.document.body.offsetWidth;
            LzScreenKernel.height = window.top.document.body.offsetHeight;
        }*/

        if (LzScreenKernel.__callback) LzScreenKernel.__scope[LzScreenKernel.__callback]({width: LzScreenKernel.width, height: LzScreenKernel.height});
        //Debug.write('LzScreenKernel event', {width: LzScreenKernel.width, height: LzScreenKernel.height});
    }
    ,__init: function() {
        window.onresize = LzScreenKernel.__resizeEvent;
    }
    ,__callback: null
    ,__scope: null
    ,setCallback: function (scope, funcname) {
        this.__scope = scope;
        this.__callback = funcname;
        this.__init();
        this.__resizeEvent();
    }    
}
