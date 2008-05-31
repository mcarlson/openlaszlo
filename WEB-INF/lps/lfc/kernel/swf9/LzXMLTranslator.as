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

static function copyXML (xmlobj:XML, trimwhitespace:Boolean, nsprefix:Boolean) :LzDataElementMixin {
    var lfcnode:LzDataNodeMixin = copyFlashXML(xmlobj, trimwhitespace, nsprefix);
    if (lfcnode == null) {
        trace('LzXMLTranslator.copyXML: lfcnode.children is null', lfcnode);
    }
    
    if ( lfcnode is LzDataText ) {
        return null;
    }
    
    return (lfcnode cast LzDataElementMixin);
}


static var whitespaceChars = {' ': true, '\r': true, '\n': true, '\t': true};


/**
  * trim whitespace from start and end of string
  * @access private
  */
static function trim( str:String ) :String {
    var whitech:Object = whitespaceChars;
    var len:int = str.length;
    var sindex:int = 0;
    var eindex:int = str.length -1;
    var ch:String;
    while (sindex < len) {
        ch = str.charAt(sindex);
        if (whitech[ch] != true) break;
        sindex++;
    }

    while (eindex > sindex) {
        ch = str.charAt(eindex);
        if (whitech[ch] != true) break;
        eindex--;
    }
        
    return str.slice(sindex,eindex+1);
}


// Recursively copy a Flash XML(Node) tree into a LzDataElement
// tree. Used by LzDataNode.stringToLzData
/**
  * @param boolean trimwhitespace: trim whitespace from start and end of text nodes
  * @param boolean nsprefix: preserve namespace prefixes on node names and attribute names
  * @access private
  */
static function copyFlashXML (node:XML, trimwhitespace:Boolean, nsprefix:Boolean) :LzDataNodeMixin {
    var lfcnode:LzDataNodeMixin = null;
    // text node?
    if (node.nodeKind() == 'text') {
        var nv:String = node.toString();
        if (trimwhitespace == true) {
            nv = trim(nv);
        }
        lfcnode = new LzDataText(nv);
//PBR Changed to match swf kernel
//    } else if (node.nodeKind() == 'element') {
      } else {
        
        var nattrs:XMLList = node.attributes();
        var cattrs:Object = {};
        for (var i:int = 0; i < nattrs.length(); i++) {
            var attr:XML = nattrs[i];
            var qattr:QName = attr.name();
            if (nsprefix) {
                var ns:Namespace = attr.namespace();
                var key:String;
                if (ns != null && ns.prefix != "") {
                    key = ns.prefix + ":" + qattr.localName;
                } else {
                    key = qattr.localName;
                }
                cattrs[key] = attr.toString();
            } else {
                cattrs[qattr.localName] = attr.toString();
            }
        }

        var nname:String;
        var qname:QName = node.name();
        if (nsprefix) {
            var ns:Namespace = node.namespace();
            if (ns != null && ns.prefix != "") {
                nname = ns.prefix + ":" + qname.localName;
            } else {
                nname = qname.localName;
            }
        } else {
            nname = qname.localName;
        }

        lfcnode = new LzDataElement(nname, cattrs);
        var children:XMLList = node.children();
        var newchildren:Array = [];
        for (var i:int  = 0; i < children.length(); i++ ) {
            var child:XML = children[i];
            var lfcchild:LzDataNodeMixin = copyFlashXML(child, trimwhitespace, nsprefix);
            newchildren[i] = lfcchild;
        }
        (lfcnode cast LzDataElement).setChildNodes(newchildren);
    }
    return lfcnode;
}


} // End of LzXMLTranslator
      
