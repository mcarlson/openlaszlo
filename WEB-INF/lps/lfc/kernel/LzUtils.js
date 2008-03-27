/**
  * LzUtils.lzs
  *
  * @copyright Copyright 2007-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

class LzUtils {
    // ***** callback *****
    // Provides weak links for global callbacks
    static var __scopeid:* = 0;
    static var __scopes:* = [];

        /**
        * Returns a callback as a string, suitable for setTimeout
        */
        public static function getcallbackstr(scope:*, name:*) {
            var sc = LzUtils.__scopeid++;
            if (scope.__callbacks == null) {
                scope.__callbacks = {sc: sc}
            } else {
                scope.__callbacks[sc] = sc;
            }
            LzUtils.__scopes[sc] = scope;
            return 'if (LzUtils.__scopes[' + sc + ']) LzUtils.__scopes[' + sc + '].' + name + '.apply(LzUtils.__scopes[' + sc + '], [])';
        }

        /**
        * Returns a callback function
        */
        public static function getcallbackfunc(scope, name, args) {
            var sc = LzUtils.__scopeid++;
            if (scope.__callbacks == null) {
                scope.__callbacks = {sc: sc}
            } else {
                scope.__callbacks[sc] = sc;
            }
            LzUtils.__scopes[sc] = scope;
//TODO pbr
           return null;
/*
            return function () {
                var s = LzUtils.__scopes[sc];
                if (s) return s[name].apply(s, args);
            }
*/
        }
        public static function remove(scope) {
            if (scope.__callbacks != null) {
                for (var i in scope.__callbacks) {
                    var sc = scope.__callbacks[i]
                    //Debug.write('removing', sc);
                    delete LzUtils.__scopes[sc];
                }
                delete scope.__callbacks;
            }
        }


    public static function dectohex(c:*, p:*) {
        if (typeof c == 'number') {
            // convert from decimal to hex
            var hex = c.toString(16);
            var pad = (p ? p : 0) - hex.length;
            while (pad > 0) {
                hex = '0' + hex;
                pad--;
            }
            return hex;
        } else {
            return c;
        }
    }

    // ***** color *****
        public static function hextoint(value:*) {
            if (typeof value != 'string') return value;
            if (value.charAt(0) == '#') {
                var n = parseInt(value.slice(1), 16);
                switch (!isNaN(n) && value.length-1) {
                case 3:
                    return ((n & 0xf00) << 8 | (n & 0xf0) << 4 | (n & 0xf)) * 17;
                case 6:
                    return n;
                default:
                    if ($debug) {
                        Debug.warn('invalid color: ' + value);
                    }
                }
            }
            //TODO pbr Need a workaround for eval
//            if (typeof eval(value) == 'number') {
//                return eval(value);
//            }
            if ($debug) {
                Debug.warn('unknown color format: ' + value);
            }
            return 0;
        }
        public static function inttohex(c:*) {
            if (typeof c == 'string') {
                c = c * 1;
            }

            if (typeof c == 'number') {
                var hex = LzUtils.dectohex(c & 0xffffff, 6);
                c = '#' + hex;
            }
            return c;
        }
        public static function torgb(s:*) {
            if (typeof s == 'number') s = LzUtils.inttohex(s); 
            if (typeof s != 'string') return s; 
            if (s.length < 6) {
                // expand #036 or #0369
                s = '#' + s.charAt(1) + s.charAt(1) + 
                    s.charAt(2) + s.charAt(2) + 
                    s.charAt(3) + s.charAt(3) + 
                    (s.length > 4 ? s.charAt(4) + s.charAt(4) : '');
            } 
            // #003366 or #00336699
            return 'rgb(' + parseInt(s.substring(1, 3), 16) + ',' +
                parseInt(s.substring(3, 5), 16) + ',' +
                parseInt(s.substring(5, 7), 16) + 
                (s.length > 7 ? ',' + parseInt(s.substring(7, 9), 16) : '') +
            ')';
        }
}
