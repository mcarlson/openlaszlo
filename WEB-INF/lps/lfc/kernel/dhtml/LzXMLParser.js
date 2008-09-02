/**
  * LzXMLParser.js
  *
  * @copyright Copyright 2006, 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  */

/**
  * @shortdesc Utility for parsing text into native XML DOM object
  */

var LzXMLParser = {
parseXML: function (str, trimwhitespace, nsprefix) {
    #pragma "passThrough=true" 
    // TODO [hqm 05-2006] need to add third arg, NSPREFIX, to
    // this method, and to the node copy routine , see the SWF
    // version below. Eventually the copyXML routine should be common
    // to both swf and DHTML, with a conditionalized version for IE probably.
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/xml");
    return doc.childNodes[0];
}
} // end of LzXMLParser

// DOMparser for IE and safari
// http://erik.eae.net/archives/2005/07/03/20.19.18/
if (typeof DOMParser == "undefined") {
    #pragma "passThrough=true" 
   var DOMParser = function () {}
    
   DOMParser.prototype.parseFromString = function (str, contentType) {
      if (typeof window.ActiveXObject != "undefined") {
         var d = new ActiveXObject("MSXML.DomDocument");
         d.loadXML(str);
         return d;
      } else if (typeof XMLHttpRequest != "undefined") {
         var req = new XMLHttpRequest;
         req.open("GET", "data:" + (contentType || "application/xml") +
                         ";charset=utf-8," + encodeURIComponent(str), false);
         if (req.overrideMimeType) {
            req.overrideMimeType(contentType);
         }
         req.send(null);
         return req.responseXML;
      }
   }
}
