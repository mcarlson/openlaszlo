/**
  * LzXMLTranslator.lzs
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * @shortdesc: Utility for converting native XML DOM object into LzDataNode tree
  */

public class LzXMLTranslator {

static function copyXML (xmlobj, trimwhitespace, nsprefix) {
    var lfcnode = copyFlashXML(xmlobj, trimwhitespace, nsprefix);
    if (lfcnode == null) {
        trace('LzXMLTranslator.copyXML: lfcnode.children is null', lfcnode);
    }
    var fc = lfcnode;
    if ( fc is LzDataText ) {
        return null;
    }
    return fc;
}

// Recursively copy a Flash XML(Node) tree into a LzDataElement
// tree. Used by LzDataNode.stringToLzData
/**
  * @param boolean trimwhitespace: trim whitespace from start and end of text nodes
  * @param boolean nsprefix: preserve namespace prefixes on node names and attribute names
  * @access private
  */
static function copyFlashXML (node, trimwhitespace, nsprefix) {
    var lfcnode = null;
    // text node?
    if (node.nodeKind() == 'text') {
        var nv = node.toString();
        if (trimwhitespace == true) {
            nv = LzDataNode.trim(nv);
        }
        lfcnode = new LzDataText(nv);
//PBR Changed to match swf kernel
//    } else if (node.nodeKind() == 'element') {
      } else {
        var nattrs = node.attributes();
        var cattrs = {};
        for (var i:int = 0; i < nattrs.length(); i++) {
            var key = nsprefix ? nattrs[i].name() : nattrs[i].localName();
            cattrs[key] = nattrs[i];
        }

        var nname = node.localName();
        if (nname && !nsprefix) {
            // strip namespace prefix
            var npos = nname.indexOf(':');
            if (npos >= 0) {
                nname = nname.substring(npos+1);
            }
        }

        lfcnode = new LzDataElement(nname, cattrs);
        var children = node.children();
        var newchildren = [];
        for (var i  = 0; i < children.length(); i++ ) {
            var child = children[i];
            var lfcchild = copyFlashXML(child, trimwhitespace, nsprefix);
            newchildren[i] = lfcchild;
        }
        lfcnode.setChildNodes(newchildren);
    }
    return lfcnode;
}


} // End of LzXMLTranslator
      
