/**
  * LzXMLParser.as
  *
  * @copyright Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * @shortdesc Utility for parsing text into native XML DOM object
  */

var LzXMLParser = new Object;

/**
  * Converts string to platform-native XML data.
  * @param String str: A valid string of XML. If the string is simple text, or
  * that there isn't a single root element, this function returns null. In cases
  * where the string is an invalid but well formatted snippet of XML, this
  * function will close any tags to make for a valid XML document
  * @param boolean trimwhitespace: if true, text nodes have whitespace trimmed from start and end.
  * @return nativeXMLObject: An XML DOM object native to the runtime platform
  */
LzXMLParser.parseXML = function( str, trimwhitespace, nsprefix ){
        var xmlobj = new XML();
        xmlobj.ignoreWhite = true;
        xmlobj.parseXML( str );
        return xmlobj;
}

