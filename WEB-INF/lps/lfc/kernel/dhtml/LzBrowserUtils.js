/* -*- mode: JavaScript; c-basic-offset: 4; -*- */

/**
  * LzBrowserUtils.js
  *
  * @copyright Copyright 2007-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

lz.BrowserUtils = {
    // ***** callback *****
    // Provides weak links for global callbacks
    __scopeid: 0
    ,__scopes: []

    /**
      * Returns a callback as a string, suitable for setTimeout
      */
    ,getcallbackstr: function getcallbackstr(scope:*, name:*) {
        var sc = lz.BrowserUtils.__scopeid++;
        if (scope.__callbacks == null) {
            scope.__callbacks = {sc: sc}
        } else {
            scope.__callbacks[sc] = sc;
        }
        lz.BrowserUtils.__scopes[sc] = scope;
        return 'if (lz.BrowserUtils.__scopes[' + sc + ']) lz.BrowserUtils.__scopes[' + sc + '].' + name + '.apply(lz.BrowserUtils.__scopes[' + sc + '], [])';
    }

    /**
      * Returns a callback function
      */
    ,getcallbackfunc: function getcallbackfunc(scope, name, args) {
        var sc = lz.BrowserUtils.__scopeid++;
        if (scope.__callbacks == null) {
            scope.__callbacks = {sc: sc}
        } else {
            scope.__callbacks[sc] = sc;
        }
        lz.BrowserUtils.__scopes[sc] = scope;
        return function  () {
            var s = lz.BrowserUtils.__scopes[sc];
            if (s) return s[name].apply(s, args);
        };
        
    }
    /**
      * Removes a callback by scope
      */
    ,removecallback: function removecallback(scope) {
        if (scope.__callbacks != null) {
            for (var i in scope.__callbacks) {
                var sc = scope.__callbacks[i]
                //Debug.write('removing', sc);
                delete lz.BrowserUtils.__scopes[sc];
            }
            delete scope.__callbacks;
        }
    }
}
