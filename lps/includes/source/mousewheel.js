lz.embed.mousewheel = { 
    __mousewheelEvent: function ( e ){
        var embed = lz.embed;
        if (!e) e = window.event;
        var delta = 0;
        if (e.wheelDelta) {
            delta = e.wheelDelta / 120;
            if (embed.browser.isOpera) {
                delta = -delta;
            }
        } else if (e.detail) {
            delta = -e.detail/3;
        }
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
        var l = embed.mousewheel.__callbacks.length;
        if (delta != null && l > 0) {
            for (var i = 0; i < l; i += 2) {
                var scope = embed.mousewheel.__callbacks[i];
                var name = embed.mousewheel.__callbacks[i + 1];
                //console.log('__mousewheelEvent', scope, name);
                if (scope && scope[name]) scope[name](delta);
            }
        }
    }
    ,__callbacks: []
    // wait until setCallback is called to listen for events
    ,setCallback: function (scope, mousewheelcallback) {
        var mousewheel = lz.embed.mousewheel;
        if (mousewheel.__callbacks.length == 0) mousewheel.setEnabled(true);
        mousewheel.__callbacks.push(scope, mousewheelcallback);
        //console.log('setCallback', mousewheel.__callbacks);
    }
    ,__enabled: false
    ,setEnabled: function (isenabled) {
        var embed = lz.embed;
        if (embed.mousewheel.__enabled == isenabled) return;
        embed.mousewheel.__enabled = isenabled;
        // skip registration when cancelkeyboardcontrol == true
        if (isenabled && embed.options && embed.options.cancelkeyboardcontrol == true) {
            return
        }

        var methodname = isenabled ? 'attachEventHandler' : 'removeEventHandler';
        if (window.addEventListener) {
            embed[methodname](window, 'DOMMouseScroll', embed.mousewheel, '__mousewheelEvent');
        }
        embed[methodname](document, 'mousewheel', embed.mousewheel, '__mousewheelEvent');
    }
}
/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
