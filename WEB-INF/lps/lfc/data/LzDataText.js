/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LFC
  * @subtopic Data
  */

/**
  * An LzDataText represents a text node a in a hierarchical dataset. An LzDataText can only contain text data. It can be a child a of an <classname>LzDataElement</classname>. See the example on <classname>LzDataNode</classname>. 
  *
  * @shortdesc Represents a text node in a set of data.
  * @see lzdatanode, lzdataelement, datapointer
  * @fixme [2006-07-26] (LPP-2412) The Instance reference is required for lzpix
  *                                to run.
  */
class LzDataText extends LzMiniNode with LzDataNodeMixin {

static var setters = new LzInheritedHash(LzMiniNode.setters);
static var getters = new LzInheritedHash(LzMiniNode.getters);
static var defaultattrs = new LzInheritedHash(LzMiniNode.defaultattrs);
static var options = new LzInheritedHash(LzMiniNode.options);
static var __LZdelayedSetters:* = new LzInheritedHash(LzMiniNode.__LZdelayedSetters);
static var earlySetters:* = new LzInheritedHash(LzMiniNode.earlySetters);

// These setters are defined in LzDataNodeMizin
LzDataText.setters.ownerDocument = "setOwnerDocument";

var ondata = LzDeclaredEvent;

/**
  * @param String text: The text that this node holds.
  */
function LzDataText ( text ){
    super();
    this.data = text;
    this.nodeType = LzDataNode.TEXT_NODE;
}

/** @lzxtype event */
var onDocumentChange = LzDeclaredEvent;
/** @lzxtype event */
var onparentNode = LzDeclaredEvent;
/** @lzxtype event */
var onchildNode = LzDeclaredEvent;
/** @lzxtype event */
var onchildNodes = LzDeclaredEvent;
/** @lzxtype event */
var onattributes = LzDeclaredEvent;
/** @lzxtype event */
var onnodeName = LzDeclaredEvent;

/** This property is of type String, can raise a DOMException object on setting
  * and can raise a DOMException object on retrieval. */
//var nodeType:Number = LzDataNode.TEXT_NODE;

/** The name of this node.
 * According to W3C-specs, nodeName for LzDataText should return
 * "#text", see
 * "http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#ID-1841493061"
  * @type String
  */
var nodeName        = '#text';

LzDataText.setters.data = "setData";

/** The data held by this node.
  * @type String */
var data = "";

/** read-only property
  * @type Number */
var length = 0;

/**
  * Sets the string that this node holds.
  * @param String newdata: The new string for this node.
  */
function setData ( newdata ) {
    this.data = newdata;
    if (this.ondata && this.ondata.ready) {
        this.ondata.sendEvent( newdata );
    }
    if (this.ownerDocument) {
        this.ownerDocument.handleDocumentChange( "data" , this , 1 );
    }
}

/**
  * @access private
  */
function cloneNode ( ){
    var n = new LzDataText(this.data);
    return n;
}

/**
  * @access private
  */
function serialize (){
    return this.serializeInternal();

}

function serializeInternal (len=null) {
  return LzDataNode.__LZXMLescape( this.data );
}


/**
  * @access private
  */
override function toString (){
    //return this.serialize();
    return this.data;
}

} // End of LzDataText
