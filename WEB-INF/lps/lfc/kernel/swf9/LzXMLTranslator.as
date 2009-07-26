/**
  * LzXMLTranslator.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  */

/**
  * @shortdesc: Utility for converting native XML DOM object into LzDataNode tree
  */
public class LzXMLTranslator {

    /**
      * LzXMLTranslator interface
      */
    static function copyXML (xmlobj:XML, trimwhitespace:Boolean, nsprefix:Boolean) :LzDataElement {
        var lfcnode:LzDataNodeMixin = copyFlashXML(xmlobj, trimwhitespace, nsprefix);
        return (lfcnode cast LzDataElement);
    }

    private static function nextSibling (node:XML) :XML {
        var p:XML = node.parent();
        return p ? p.children()[node.childIndex() + 1] : null;
    }

    private static function firstChild (node:XML) :XML {
        return node.children()[0];
    }

    /**
      * Translate a single Flash XML(Node) into a LzDataNode.
      */
    static function copyFlashNode (node:XML, trimwhitespace:Boolean, nsprefix:Boolean) :LzDataNodeMixin {
        var kind:String = node.nodeKind();
        if (kind == 'text') {
            var nv:String = node.toString();
            if (trimwhitespace) {
                nv = LzDataElement.trim(nv);
            }
            return new LzDataText(nv);
        } else if (kind == 'element') {
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

            var nattrs:XMLList = node.attributes();
            var cattrs:Object = {};
            for (var i:int = 0, len:int = nattrs.length(); i < len; i++) {
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

            var nsDecl:Array = node.namespaceDeclarations();
            for (var i:int = 0, len:int = nsDecl.length; i < len; ++i) {
                var ns:Namespace = nsDecl[i];
                var prefix:String = ns.prefix;
                var key:String = (prefix == "" ? "xmlns" : nsprefix ? "xmlns:" + prefix : prefix);
                cattrs[key] = ns.uri;
            }

            var lfcnode:LzDataElement = new LzDataElement(nname);
            // avoid copy of cattrs (see LzDataElement ctor)
            lfcnode.attributes = cattrs;
            return lfcnode;
        } else {
            return null;
        }
    }

    /**
      * Copy a Flash XML(Node) tree into a LzDataElement tree. Used by LzDataElement.stringToLzData
      *
      * @param boolean trimwhitespace: trim whitespace from start and end of text nodes
      * @param boolean nsprefix: preserve namespace prefixes on node names and attribute names
      * @access private
      */
    static function copyFlashXML (xmlnode:XML, trimwhitespace:Boolean, nsprefix:Boolean) :LzDataNodeMixin {
        // create a new, empty ownerDocument (LPP-7537)
        var document:LzDataElement = new LzDataElement(null);
        // handle this separately so you don't need to worry about the
        // case when xmlnode has got siblings
        if (! firstChild(xmlnode)) {
            return document.appendChild(copyFlashNode(xmlnode, trimwhitespace, nsprefix));
        }
        // @devnote Flash's E4X implementation has got major performance issues
        // when using children() and childIndex(), so we cannot use the nextSibling()
        // function defined in this class. As a workaround we memorize the children()
        // XMLList and index-position for each node. (LPP-8350)
        var stack:Array = [];
        var last:int = -1;
        var lfcparent:LzDataElement = document;
        var next:XML, node:XML = xmlnode;
        var children:XMLList = node.children();
        var idx:int = 0;
        // traverse DOM tree
        for (;;) {
            var kind:String = node.nodeKind();
            if (kind == 'text') {
                var lfctext:LzDataText = LzDataText(copyFlashNode(node, trimwhitespace, nsprefix));
                // inlined lfcparent.appendChild(lfcnode)
                lfctext.parentNode = lfcparent;
                lfctext.ownerDocument = document;
                lfctext.__LZo = (lfcparent.childNodes.push(lfctext) - 1);
            } else if (kind == 'element') {
                var lfcnode:LzDataElement = LzDataElement(copyFlashNode(node, trimwhitespace, nsprefix));
                // inlined lfcparent.appendChild(lfcnode)
                lfcnode.parentNode = lfcparent;
                lfcnode.ownerDocument = document;
                lfcnode.__LZo = (lfcparent.childNodes.push(lfcnode) - 1);

                // traverse down first
                // if ((next = firstChild(node))) {
                if ((next = children[0])) {
                    // save current node, index-position and its children
                    // @devnote need explicit cast because of flash-bug ASC-2904
                    stack[int(++last)] = node;
                    stack[int(++last)] = idx;
                    stack[int(++last)] = children;
                    // this node is the new context
                    lfcparent = lfcnode;
                    node = next;
                    children = next.children();
                    idx = 0;
                    continue;
                }
            }
            // select next node
            // while (! (next = nextSibling(node))) {
            while (! (next = stack[last][++idx])) {
                // no nextSibling, go back in DOM
                // node = node.parent();
                children = stack[last--];
                idx = stack[last--];
                node = stack[last--];
                lfcparent = lfcparent.parentNode;
                if (node === xmlnode) {
                    // reached top element, copy finished
                    return document.childNodes[0];
                }
            }
            node = next;
            children = next.children();
        }
        // add return to make flash compiler happy
        return null;
    }

} // End of LzXMLTranslator
