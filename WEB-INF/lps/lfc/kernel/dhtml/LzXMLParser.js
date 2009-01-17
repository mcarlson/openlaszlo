/**
  * LzXMLParser.js
  *
  * @copyright Copyright 2006, 2008-2009 Laszlo Systems, Inc.  All Rights Reserved.
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
        // TODO [hqm 05-2006] need to add third arg, NSPREFIX, to
        // this method, and to the node copy routine , see the SWF
        // version below. Eventually the copyXML routine should be common
        // to both swf and DHTML, with a conditionalized version for IE probably.
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, "text/xml");
        // check for parser-errors
        var browser = lz.embed.browser;
        if (browser.isIE) {
            this.__checkIE(doc);
        } else if (browser.isFirefox || browser.isOpera) {
            this.__checkFirefox(doc);
        } else if (browser.isSafari) {
            this.__checkSafari(doc);
        }
        return doc.firstChild;
    },
    __checkIE: function (doc) {
        var perr = doc.parseError;
        if (perr.errorCode != 0) {
            throw new Error(perr.reason);
        }
    },
    __checkFirefox: function (doc) {
        var c = doc.firstChild;
        if (c && c.nodeName == "parsererror") {
            // get error information from textnode
            var msg = c.firstChild.nodeValue;
            // remove file and line information (does not provide useful info here)
            throw new Error(msg.match(".*")[0]);
        }
    },
    __checkSafari: function (doc) {
        var c = doc.firstChild;
        if (c instanceof HTMLElement) {
            // Safari returns a HTMLElement for a plain string
            // html > body > parsererror > div (with error information)
            var msg = c.firstChild.firstChild.childNodes[1].textContent;
            // remove file and line information (does not provide useful info here)
            throw new Error(msg.match("[^:]*: (.*)")[1]);
        } else {
            c = c.firstChild;
            if (c && c.nodeName == "parsererror") {
                // second childNodes provides error information
                var msg = c.childNodes[1].textContent;
                // remove file and line information (does not provide useful info here)
                throw new Error(msg.match("[^:]*: (.*)")[1]);
            }
        }
    }
} // end of LzXMLParser

// DOMParser for IE and Safari2
// http://erik.eae.net/archives/2005/07/03/20.19.18/
if (typeof DOMParser == "undefined") {
    var DOMParser = function () {}

    DOMParser.prototype.parseFromString = function (str, contentType) {
        if (typeof window.ActiveXObject != "undefined") {
            var d = new ActiveXObject("MSXML.DomDocument");
            d.loadXML(str);
            return d;
        } else if (typeof XMLHttpRequest != "undefined") {
            contentType = (contentType || "application/xml");
            var req = new XMLHttpRequest;
            req.open("GET", "data:" + contentType + ";charset=utf-8,"
                             + encodeURIComponent(str), false);
            if (req.overrideMimeType) {
                req.overrideMimeType(contentType);
            }
            req.send(null);
            return req.responseXML;
        }
    }
}
