lz.embed.mousewheel = { 
    __mousewheelEvent: function ( e ){   
        if (!e) e = window.event;
        var delta = 0;
        if (e.wheelDelta) {
            delta = e.wheelDelta / 120;
            if (lz.embed.browser.isOpera) {
                delta = -delta;
            }
        } else if (e.detail) {
            delta = -e.detail/3;
        }
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
        var l = lz.embed.mousewheel.__callbacks.length;
        if (delta != null && l > 0) {
            for (var i = 0; i < l; i += 2) {
                var scope = lz.embed.mousewheel.__callbacks[i];
                var name = lz.embed.mousewheel.__callbacks[i + 1];
                //console.log('__mousewheelEvent', scope, name);
                if (scope && scope[name]) scope[name](delta);
            }
        }
    }
    ,__callbacks: []
    ,setCallback: function (scope, mousewheelcallback) {
        var ck = (lz && lz.embed && lz.embed.options && lz.embed.options.cancelkeyboardcontrol != true) || true;
        if (lz.embed.mousewheel.__callbacks.length == 0 && ck) {
            if (window.addEventListener) {
                lz.embed.attachEventHandler(window, 'DOMMouseScroll', lz.embed.mousewheel, '__mousewheelEvent');
            }
            lz.embed.attachEventHandler(document, 'mousewheel', lz.embed.mousewheel, '__mousewheelEvent');
        }
        lz.embed.mousewheel.__callbacks.push(scope, mousewheelcallback);
        //console.log('setCallback', lz.embed.mousewheel.__callbacks);
    }    
}
/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
