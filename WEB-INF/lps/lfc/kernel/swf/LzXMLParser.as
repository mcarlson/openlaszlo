/**
  * LzXMLParser.as
  *
  * @copyright Copyright 2001-2006, 2009 Laszlo Systems, Inc.  All Rights Reserved.
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
        // always ignore full whitespace nodes
        xmlobj.ignoreWhite = true;
        xmlobj.parseXML( str );
        if (xmlobj.status == 0) {
            var fc = xmlobj.firstChild;
            if (xmlobj.childNodes.length == 1 && fc.nodeType == 1) {
                return fc;
            } else {
                // no single root element or string is simple text
                return null;
            }
        } else {
            // error descriptions from flash docs
            var errors = ["A CDATA section was not properly terminated.", 
             "The XML declaration was not properly terminated.",
             "The DOCTYPE declaration was not properly terminated.",
             "A comment was not properly terminated.",
             "An XML element was malformed.",
             "Out of memory.",
             "An attribute value was not properly terminated.",
             "A start-tag was not matched with an end-tag.",
             "An end-tag was encountered without a matching start-tag."
            ];
            throw new Error(errors[xmlobj.status*(-1) - 2]);
        }
}
