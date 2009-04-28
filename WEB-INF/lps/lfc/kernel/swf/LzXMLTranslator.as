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

/**
  * LzXMLTranslator interface
  */
LzXMLTranslator.copyXML = function (xmlobj, trimwhitespace, nsprefix) {
    var lfcnode = LzXMLLoader.prototype.copyFlashXML(xmlobj, trimwhitespace, nsprefix);
    if (lfcnode instanceof LzDataElement) {
        return lfcnode;
    } else {
        return null;
    }
}
