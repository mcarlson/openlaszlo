/**
  * LzXMLTranslator.js
  *
  * @copyright Copyright 2006-2008 Laszlo Systems, Inc.  All Rights Reserved.
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

copyXML: function (xmldoc, trimwhitespace, nsprefix) {
    return this.copyBrowserXML(xmldoc, true, trimwhitespace, nsprefix);
},

copyBrowserXML: function (node, ignorewhite, trimwhite, nsprefix) {
    if (! node) {
        return node;
    } else if (node.nodeType == 3 || node.nodeType == 4) {
        // text node (3: TEXT_NODE, 4: CDATA_SECTION_NODE)
        var nv = node.nodeValue;
        
        // If ignorewhite is true, discard a text node which is all whitespace
        if (ignorewhite && this.whitespacePat.test(nv)) {
            return null;
        }
        if (trimwhite) {
            nv = nv.replace(this.stringTrimPat, "");
        }
        
        return new LzDataText(nv);
    } else if (node.nodeType == 1 || node.nodeType == 9) {
        // element or document node (1: ELEMENT_NODE, 9: DOCUMENT_NODE)

        var cattrs = {};
        var nattrs = node.attributes;
        if (nattrs) {
            // slow but sure way to copy attributes
            for (var k = 0; k < nattrs.length; k++) {
                var attrnode = nattrs.item(k);
                if (attrnode) {
                    //older IE's use "baseName" instead of DOM Level2 property "localName"
                    var attrname = (!nsprefix && (attrnode.localName || attrnode.baseName)) || attrnode.name;
                    cattrs[attrname] = attrnode.value;
                }
            }
        }

        //older IE's use "baseName" instead of DOM Level2 property "localName"
        var nname = (!nsprefix && (node.localName || node.baseName)) || node.nodeName;
        var lfcnode = new LzDataElement(nname, cattrs);
        
        if (node.hasChildNodes()) {
            var newchildren = [];
            var children = node.childNodes;
            for (var i = 0; i < children.length; i++) {
                var lfcchild = this.copyBrowserXML(children[i], ignorewhite, trimwhite, nsprefix);
                if (lfcchild != null) {
                    newchildren.push(lfcchild);
                }
            }
            
            lfcnode.$lzc$set_childNodes(newchildren);
        }
        return lfcnode;
    } else {
        // ignore all other node types
        return null;
    }
}

} // end of LzXMLTranslator
