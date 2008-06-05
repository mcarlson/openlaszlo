/**
  * LzScreenKernel.js
  *
  * @copyright Copyright 2007-2008 Laszlo Systems, Inc.  All Rights Reserved.
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
        // Also see http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
        var q = LzSprite.prototype.quirks;
        if (q.document_size_use_offsetheight) {
            var scope = window.document.body;
            LzScreenKernel.width = scope.offsetWidth; 
            LzScreenKernel.height = scope.offsetHeight; 
        } else if (window.innerHeight) {
            // all except Explorer in strict mode
            var scope = window;
            LzScreenKernel.width = scope.innerWidth;
            LzScreenKernel.height = scope.innerHeight;
        } else if (document.documentElement && document.documentElement.clientWidth) {
            // IE 6+ Strict Mode
            var scope = document.documentElement;
            if (q.document_size_compute_correct_height && window.top != window) {
                var topscope = window.top.document.documentElement;
                // IE 6 doesn't report the correct clientHeight for embedded iframes with scrollbars.  Measure the difference between this window and the parents, allowing 24px of slop.
                if (Math.abs(topscope.clientWidth - scope.clientWidth) < 24 
                    || Math.abs(topscope.clientHeight - scope.clientHeight) < 24) {
                    scope = topscope;
                }
            }
            LzScreenKernel.width = scope.clientWidth;
            LzScreenKernel.height = scope.clientHeight;
        } else if (window.document.body) {
            var scope = window.document.body;
            // IE 4
            LzScreenKernel.width = scope.clientWidth;
            LzScreenKernel.height = scope.clientHeight;
        }

        if (LzScreenKernel.__callback) LzScreenKernel.__scope[LzScreenKernel.__callback]({width: LzScreenKernel.width, height: LzScreenKernel.height});
        //Debug.write('LzScreenKernel event', {width: LzScreenKernel.width, height: LzScreenKernel.height});
    }
    ,__init: function() {
        lz.embed.attachEventHandler(window.top, 'resize', LzScreenKernel, '__resizeEvent');
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
