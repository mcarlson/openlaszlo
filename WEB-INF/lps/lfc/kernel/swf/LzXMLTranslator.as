/**
  * LzXMLTranslator.as
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

var LzXMLTranslator = new Object;

LzXMLTranslator.copyXML = function (xmlobj, trimwhitespace, nsprefix) {
    var lfcnode = LzXMLLoader.prototype.copyFlashXML(xmlobj, trimwhitespace, nsprefix);
    var fc = lfcnode.childNodes[0];
    if ( fc instanceof LzDataText ) return null;
    return fc;
}
