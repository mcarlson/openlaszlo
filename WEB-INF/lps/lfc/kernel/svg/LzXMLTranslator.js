/**
  * LzXMLTranslator.js
  *
  * @copyright Copyright 2006-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic SVG
  */

/**
  * @shortdesc Utility for converting native XML DOM object into LzDataNode tree
  */

LzXMLTranslator = new Object;

LzXMLTranslator.copyXML = function (xmldoc, trimwhitespace, stripnsprefix) {
    var lfcnode = LzXMLTranslator.copyBrowserXML(xmldoc, true, trimwhitespace);
    return lfcnode;
}


LzXMLTranslator.whitespacePat = new RegExp("^[\t\n\r ]*$");
LzXMLTranslator.stringTrimPat = new RegExp("(^ *| *$)", "g");
LzXMLTranslator.slashPat      = new RegExp("/", "g");

LzXMLTranslator.copyBrowserXML = function (node, ignorewhite, trimwhite) {
    //Debug.info('copyBrowserXML', node.nodeName, this.nodeName);
    var nv = node.nodeValue;
    var lfcnode = null;
    // text node?
    if (node.nodeType == 3) {
        // text node

        // If ignorewhite is true, discard a text node which is all whitespace
        if (ignorewhite && LzXMLTranslator.whitespacePat.test(nv)) {
            //Debug.debug('found text whitespace', nv);
            return null;
        }
        if (trimwhite) {
            nv = nv.replace(LzXMLTranslator.stringTrimPat, "");
        }
        lfcnode = new LzDataText(nv);
        //Debug.debug('found text node', nv, 'lfcnode=', lfcnode);
        return lfcnode;
    } else if (node.nodeType == 1 || node.nodeType == 9) {
        // element or document node
    
        // slow but sure way to copy attributes

        var nattrs = node.attributes;
        var cattrs = {};

        if (nattrs) {
            for (var k = 0; k < nattrs.length; k++) {
                var attrnode = nattrs.item(k);
                if (attrnode) {
                    var attrname = attrnode.name;
                    var attrval = attrnode.value;
                    cattrs[attrname] = attrval;
                }
            }
        }


        lfcnode = new LzDataElement(node.nodeName, cattrs);
        var children = node.childNodes;
        var newchildren = [];
        for (var i  = 0; i < children.length; i++ ) {
            var child = children[i];
            var lfcchild = LzXMLTranslator.copyBrowserXML(child, ignorewhite, trimwhite);
            //Debug.debug('lfcchild = ', lfcchild);
            if (lfcchild != null) {
                newchildren.push(lfcchild);
            }
        }

        lfcnode.$lzc$set_childNodes(newchildren);
        return lfcnode;
    } else {
        // ignore all other node types
        return null;
    }
}
    

