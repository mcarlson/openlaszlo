/**
  * LzXMLParser.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  */

/**
  * @shortdesc Utility for parsing text into native XML DOM object
  */
public class LzXMLParser {

/**
  * Converts string to platform-native XML data.
  * @param String str: A valid string of XML. If the string is simple text, or
  * that there isn't a single root element, this function returns null. In cases
  * where the string is an invalid but well formatted snippet of XML, this
  * function will close any tags to make for a valid XML document
  * @param boolean trimwhitespace: if true, text nodes have whitespace trimmed from start and end.
  * @return nativeXMLObject: An XML DOM object native to the runtime platform
  */
public static function parseXML (str:String, trimwhitespace:Boolean, nsprefix:Boolean) :XML {
  #pragma "throwsError=true"
    // if true : trims whitespace and ignores full whitespace nodes
    // otherwise : leaves whitespace unaffected
    XML.ignoreWhitespace = trimwhitespace;
    var xmlobj:XML = XML(str);
    // always remove full whitespace nodes
    xmlobj.normalize();
    if (xmlobj.nodeKind() == "element") {
        return xmlobj;
    } else {
        return null;
    }
}

} // End of LzXMLParser
