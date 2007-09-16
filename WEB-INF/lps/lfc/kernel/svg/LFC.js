/**
  * LFC.js
  *
  * @copyright Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic SVG
  */


LzUtils = {};
// Replace attributes
LzUtils.replaceAttrs = function(obj, replaceobj) {
    var o = {};
    for (var i in obj) {
        o[i] = obj[i];
    }
    for (var i in replaceobj) {
        o[i] = replaceobj[i];
    }
    return o;
}


// Resource library
LzResourceLibrary = {};
