Lz.mousewheel = { 
    __mousewheelEvent: function ( e ){   
        if (!e) e = window.event;
        var delta = 0;
        if (e.wheelDelta) {
            delta = e.wheelDelta / 120;
            if (Lz.__BrowserDetect.isOpera) {
                delta = -delta;
            }
        } else if (e.detail) {
            delta = -e.detail/3;
        }
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
        var l = Lz.mousewheel.__callbacks.length;
        if (delta != null && l > 0) {
            for (var i = 0; i < l; i += 2) {
                var scope = Lz.mousewheel.__callbacks[i];
                var name = Lz.mousewheel.__callbacks[i + 1];
                //console.log('__mousewheelEvent', scope, name);
                if (scope && scope[name]) scope[name](delta);
            }
        }
    }
    ,__callbacks: []
    ,setCallback: function (scope, mousewheelcallback) {
        var ck = (Lz && Lz.options && Lz.options.cancelkeyboardcontrol != true) || true;
        if (Lz.mousewheel.__callbacks.length == 0 && ck) {
            if (window.addEventListener) {
                Lz.attachEventHandler(window, 'DOMMouseScroll', Lz.mousewheel, '__mousewheelEvent');
            }
            Lz.attachEventHandler(document, 'mousewheel', Lz.mousewheel, '__mousewheelEvent');
        }
        Lz.mousewheel.__callbacks.push(scope, mousewheelcallback);
        //console.log('setCallback', Lz.mousewheel.__callbacks);
    }    
}
/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
