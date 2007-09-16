LzMousewheelKernel = { 
    __mousewheelEvent: function ( e ){   
        if (!e) e = window.event;
        var delta = 0;
        if (e.wheelDelta) {
            delta = e.wheelDelta / 120;
            if (LzSprite.prototype.quirks['reverse_mouse_wheel']) {
                delta = -delta;
            }
        } else if (e.detail) {
            delta = -e.detail/3;
        }
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
        var l = LzMousewheelKernel.__callbacks.length;
        if (delta != null && l > 0) {
            for (var i = 0; i < l; i += 2) {
                var scope = LzMousewheelKernel.__callbacks[i];
                var name = LzMousewheelKernel.__callbacks[i + 1];
                //console.log('__mousewheelEvent', scope, name);
                if (scope && scope[name]) scope[name](delta);
            }
        }
    }
    ,__callbacks: []
    ,setCallback: function (scope, mousewheelcallback) {
        if (LzMousewheelKernel.__callbacks.length == 0 && lzOptions.dhtmlKeyboardControl != false) {
            if (window.addEventListener) {
                window.addEventListener('DOMMouseScroll', LzMousewheelKernel.__mousewheelEvent, false);
            }
            document.onmousewheel = LzMousewheelKernel.__mousewheelEvent;
        }
        LzMousewheelKernel.__callbacks.push(scope, mousewheelcallback);
        //console.log('setCallback', LzMousewheelKernel.__callbacks);
    }    
}
/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
