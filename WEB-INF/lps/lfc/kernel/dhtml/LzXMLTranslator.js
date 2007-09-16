/**
  * LzXMLTranslator.js
  *
  * @copyright Copyright 2006-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  */

/**
  * @shortdesc Utility for converting native XML DOM object into LzDataNode tree
  */

var LzXMLTranslator = new Object;

LzXMLTranslator.copyXML = function (xmldoc, trimwhitespace, nsprefix) {
    var lfcnode = LzXMLTranslator.copyBrowserXML(xmldoc, true, trimwhitespace, nsprefix);
    return lfcnode;
}


LzXMLTranslator.whitespacePat = new RegExp("^[\t\n\r ]*$");
LzXMLTranslator.stringTrimPat = new RegExp("(^[\t\n\r ]*|[\t\n\r ]*$)", "g");
LzXMLTranslator.slashPat      = new RegExp("/", "g");

LzXMLTranslator.copyBrowserXML = function (node, ignorewhite, trimwhite, nsprefix) {
    if (! node) return node;
    var nv = node.nodeValue;
    var lfcnode = null;
    // text node?
    if (node.nodeType == 3 || node.nodeType == 4) {
        // text node

        // If ignorewhite is true, discard a text node which is all whitespace
        if (ignorewhite && LzXMLTranslator.whitespacePat.test(nv)) {
            //Debug.debug('found text whitespace', nv);
            return null;
        }
        if (trimwhite) {
            var nvo = nv;
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
                    var nattrname = attrname;

                    if (!nsprefix) {
                        // strip namespace prefixes
                        var colpos = attrname.indexOf(':');
                        if (colpos >= 0) {
                            nattrname = attrname.substring(colpos+1);
                        }
                    }
                    
                    cattrs[nattrname] = attrval;
                }
            }
        }

        var nname = node.nodeName;
        if (nname && !nsprefix) {
            // strip namespace prefix
            var npos = nname.indexOf(':');
            if (npos >= 0) {
                nname = nname.substring(npos+1);
            }
        }


        lfcnode = new LzDataElement(nname, cattrs);
        var children = node.childNodes;
        var newchildren = [];
        for (var i  = 0; i < children.length; i++ ) {
            var child = children[i];
            var lfcchild = LzXMLTranslator.copyBrowserXML(child, ignorewhite, trimwhite, nsprefix);
            //Debug.debug('lfcchild = ', lfcchild);
            if (lfcchild != null) {
                newchildren.push(lfcchild);
            }
        }

        lfcnode.setChildNodes(newchildren);
        return lfcnode;
    } else {
        // ignore all other node types
        return null;
    }
}
    

