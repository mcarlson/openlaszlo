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
        var err = this.getParserError(doc);
        if (err) {
            throw new Error(err);
        } else {
            return doc.firstChild;
        }
    },
    getParserError: function (doc) {
        // returns a String with parser-error information or undefined
        var browser = lz.embed.browser;
        if (browser.isIE) {
            return this.__checkIE(doc);
        } else if (browser.isFirefox || browser.isOpera) {
            return this.__checkFirefox(doc);
        } else if (browser.isSafari) {
            return this.__checkSafari(doc);
        }
    },
    __checkIE: function (doc) {
        var perr = doc.parseError;
        if (perr.errorCode != 0) {
            return (perr.reason);
        }
    },
    __checkFirefox: function (doc) {
        var c = doc.firstChild;
        if (c && c.nodeName == "parsererror") {
            // get error information from textnode
            var msg = c.firstChild.nodeValue;
            // remove file and line information (does not provide useful info here)
            return (msg.match(".*")[0]);
        }
    },
    __checkSafari: function (doc) {
        var c = doc.firstChild;
        if (c instanceof HTMLElement) {
            // Safari returns a HTMLElement for a plain string
            // NOTE: but also returns a HTMLElement if the xml-string defines
            // a xhtml-document (LPP-8069)
            // <html><body><parsererror>[...]</parsererror></body></html>
            (c = c.firstChild) && (c = c.firstChild);
        } else {
            // <*><parsererror>[...]</parsererror></*>
            (c = c.firstChild);
        }
        // <parsererror><h3/><div>[info]</div></parsererror>
        if (c && c.nodeName == "parsererror") {
            // second childNode provides error information
            var msg = c.childNodes[1].textContent;
            // remove file and line information (does not provide useful info here)
            return (msg.match("[^:]*: (.*)")[1]);
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
