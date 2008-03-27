/*
 * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  */


var global:* = {};

var canvas:LzCanvas;


/*
  public class LzInstantiator {
    public static var syncNew:Boolean = true;
    public static function createImmediate(a:*, b:*):void {
        trace("LzInstantiator.createImmediate called with ",a,b);
    }
    public static function completeTrickle(a:*):void {
        trace("LzInstantiator.completeTrickle called with ",a);
    }
    public static function trickleInstantiate(a:*,b:*):void {
        trace("LzInstantiator.trickleInstantiate called with ",a,b);
    }
    public static function requestInstantiation(a:*,b:*):void {
        trace("LzInstantiator.requestInstantiation called with ",a,b);
    }
}

*/


#include "core/dummydata.js"


public class LzCSSStyle {

    public static  function  getPropertyValueFor(a:*, b:*):* { return null;}
}



public class LzBrowser {
    public static var defaultPortNums = { http: 80, https: 443 };

    public static function getInitArg(key:*) {
        trace('dummy LzBrowser getInitArg declared in core/dummyclasses.js');
        return null;
    }

    public static function getBaseURL(secure=null, port=null) {
        return null;
    }

    public static function toAbsoluteURL(url, secure) {
        return null;
    }

    public static function getLoadURL() {
        return null;
    }

    public static function getVersion() {
        return null;
    }


}

public class LzFocus {
    static function getFocus() {
    }
    static function setFocus(...rest) {
    }



    static function clearFocus() {
    }
    static function __LZcheckFocusChange(...rest) {
    }

}

public class LzTrack {
    static function __LZmouseup() {
    }

}

var lzOptions = {};


class lzcoreutils {
    /// TODO [hqm 2008-01] just for debugging until we get debugger up
              #passthrough {
    public static function objAsString(obj:*):String {
    var s:* = "";
        for (var k:* in obj) {
            s+= k +": "+obj[k];
            s+=", ";
        }
        return s;
    }
              }#
}

class LzTimer {
    static function addTimer( ...rest ) { }
}
