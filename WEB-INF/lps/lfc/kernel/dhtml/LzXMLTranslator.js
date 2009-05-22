/**
  * LzXMLTranslator.js
  *
  * @copyright Copyright 2006-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  */

/**
  * @shortdesc Utility for converting native XML DOM object into LzDataNode tree
  */
var LzXMLTranslator = {

whitespacePat: new RegExp("^\\s*$"),
stringTrimPat: new RegExp("^\\s+|\\s+$", "g"),

/**
  * LzXMLTranslator interface
  */
copyXML: function (xmldoc, trimwhitespace, nsprefix) {
    var lfcnode = this.copyBrowserXML(xmldoc, true, trimwhitespace, nsprefix);
    if (lfcnode instanceof LzDataElement) {
        return lfcnode;
    } else {
        return null;
    }
},

/**
  * Translate a single native XML DOM object into a LzDataNode.
  * This function is inlined in copyBrowserXML
  */
copyBrowserNode: function (node, ignorewhite, trimwhite, nsprefix) {
    var type = node.nodeType;
    if (type == 3 || type == 4) {
        // text node (3: TEXT_NODE, 4: CDATA_SECTION_NODE)
        var nv = node.nodeValue;
        // If ignorewhite is true, discard a text node which is all whitespace
        if (! (ignorewhite && this.whitespacePat.test(nv))) {
            if (trimwhite) {
                nv = nv.replace(this.stringTrimPat, "");
            }
            return new LzDataText(nv);
        }
    } else if (type == 1 || type == 9) {
        // element or document node (1: ELEMENT_NODE, 9: DOCUMENT_NODE)
        // older IE's use "baseName" instead of DOM Level2 property "localName"
        var nname = (!nsprefix && (node.localName || node.baseName)) || node.nodeName;

        var cattrs = {};
        var nattrs = node.attributes;
        if (nattrs) {
            // slow but sure way to copy attributes
            for (var k = 0, len = nattrs.length; k < len; k++) {
                var attrnode = nattrs[k];
                if (attrnode) {
                    // older IE's use "baseName" instead of DOM Level2 property "localName"
                    var attrname = (!nsprefix && (attrnode.localName || attrnode.baseName)) || attrnode.name;
                    cattrs[attrname] = attrnode.value;
                }
            }
        }

        var lfcnode = new LzDataElement(nname);
        // avoid copy of cattrs (see LzDataElement ctor)
        lfcnode.attributes = cattrs;
        return lfcnode;
    } else {
        // ignore other node types
    }
},

/**
  * Translate a native XML DOM tree into a LzDataNode tree
  */
copyBrowserXML: function (xmlnode, ignorewhite, trimwhite, nsprefix) {
    // create a new, empty ownerDocument (LPP-7537)
    var document = new LzDataElement(null);
    // handle this separately so you don't need to worry about the
    // case when xmlnode has got siblings
    if (! xmlnode.firstChild) {
        return document.appendChild(this.copyBrowserNode(xmlnode, ignorewhite, trimwhite, nsprefix));
    }
    var wsPat = this.whitespacePat;
    var trimPat = this.stringTrimPat;
    var lfcparent = document;
    var next, node = xmlnode;
    // traverse DOM tree
    for (;;) {
        var type = node.nodeType;
        if (type == 3 || type == 4) {
            // text node (3: TEXT_NODE, 4: CDATA_SECTION_NODE)

            // this is inlined:
            // var lfcnode = this.copyBrowserNode(node);
            // if (lfcparent.getLastChild() instanceof LzDataText) {
            //   lfcparent.getLastChild().data += lfcnode.data;
            // } else {
            //   lfcparent.appendChild(lfcnode);
            // }

            var nv = node.nodeValue;
            // If ignorewhite is true, discard a text node which is all whitespace
            if (! (ignorewhite && wsPat.test(nv))) {
                if (trimwhite) {
                    nv = nv.replace(trimPat, "");
                }
                var cnodes = lfcparent.childNodes;
                var last = cnodes[cnodes.length - 1];
                if (last instanceof LzDataText) {
                    // merge adjacent text nodes (LPP-8214)
                    last.data += nv;
                } else {
                    var lfcnode = new LzDataText(nv);
                    // inlined lfcparent.appendChild(lfcnode)
                    lfcnode.parentNode = lfcparent;
                    lfcnode.ownerDocument = document;
                    lfcnode.__LZo = (cnodes.push(lfcnode) - 1);
                }
            }
        } else if (type == 1 || type == 9) {
            // element or document node (1: ELEMENT_NODE, 9: DOCUMENT_NODE)

            // this is inlined:
            // var lfcnode = this.copyBrowserNode(node);
            // lfcparent.appendChild(lfcnode);

            // older IE's use "baseName" instead of DOM Level2 property "localName"
            var nname = (!nsprefix && (node.localName || node.baseName)) || node.nodeName;

            var cattrs = {};
            var nattrs = node.attributes;
            if (nattrs) {
                // slow but sure way to copy attributes
                for (var k = 0, len = nattrs.length; k < len; k++) {
                    var attrnode = nattrs[k];
                    if (attrnode) {
                        // older IE's use "baseName" instead of DOM Level2 property "localName"
                        var attrname = (!nsprefix && (attrnode.localName || attrnode.baseName)) || attrnode.name;
                        cattrs[attrname] = attrnode.value;
                    }
                }
            }

            var lfcnode = new LzDataElement(nname);
            // avoid copy of cattrs (see LzDataElement ctor)
            lfcnode.attributes = cattrs;
            // inlined lfcparent.appendChild(lfcnode)
            lfcnode.parentNode = lfcparent;
            lfcnode.ownerDocument = document;
            lfcnode.__LZo = (lfcparent.childNodes.push(lfcnode) - 1);

            // traverse down first
            if ((next = node.firstChild)) {
                // this node is the new context
                lfcparent = lfcnode;
                node = next;
                continue;
            }
        } else {
            // ignore other node types
        }
        // select next node
        while (! (next = node.nextSibling)) {
            // no nextSibling, go back in DOM
            node = node.parentNode;
            lfcparent = lfcparent.parentNode;
            if (node === xmlnode) {
                // reached top element, copy finished
                return document.childNodes[0];
            }
        }
        node = next;
    }
}

} // end of LzXMLTranslator
