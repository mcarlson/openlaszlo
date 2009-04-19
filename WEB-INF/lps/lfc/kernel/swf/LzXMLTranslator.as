/**
  * LzXMLTranslator.as
  *
  * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * @shortdesc: Utility for converting native XML DOM object into LzDataNode tree
  */
var LzXMLTranslator = new Object;

LzXMLTranslator.copyXML = function (xmlobj, trimwhitespace, nsprefix) {
    var lfcnode = LzXMLLoader.prototype.copyFlashXML(xmlobj, trimwhitespace, nsprefix);
    if (lfcnode instanceof LzDataElement) {
        // create a new, empty ownerDocument (LPP-7537)
        new LzDataElement(null, {}, [lfcnode]);
        return lfcnode;
    } else {
        return null;
    }
}
