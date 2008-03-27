/**
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LFC
  * @subtopic Data
  */

mixin LzDataElementMixin {

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

/** @access private */
var __LZchangeQ = null;
/** @access private */
var __LZlocker = null;

/** The name of this node.
  * @type String
  */
var nodeName:* = null;

/** The dictionary of attributes for this node.
  * @type Object
  */
var attributes:* = null;

/** Inserts the given LzDataNode before another node in this node's childNodes
  * @param LzDataNode newChild: the LzDataNode to insert
  * @param LzDataNode refChild: the LzDataNode to insert newChild before
  * @return LzDataElement: The new child, or null if the refChild wasn't found
  */
function insertBefore (newChild, refChild){
    this.__LZcoDirty = true;

    for ( var i = 0; i < this.childNodes.length; i++ ){
        if ( this.childNodes[ i ] == refChild ){
            this.childNodes.splice( i , 0 , newChild );
            newChild.setOwnerDocument( this.ownerDocument );

            newChild.parentNode = this;
            if (newChild.onparentNode.ready) newChild.onparentNode.sendEvent( this );
            if (this.onchildNodes.ready) this.onchildNodes.sendEvent( newChild );
            this.ownerDocument.handleDocumentChange( "insertBefore" , 
                                                     this, 0 );
            return newChild;
        }
    }

    //raise exception
    return null;
}


/**
  * Replaces a given LzDataNode in this node's childNodes with a new one.
  * @param LzDataNode newChild: the LzDataNode to add
  * @param LzDataNode oldChild: the LzDataNode to be replaced by the newChild
  * @return LzDataElement: The new child, or null if the oldChild wasn't found
  */
function replaceChild (newChild, oldChild){

    this.__LZcoDirty = true;
    for ( var i = 0; i < this.childNodes.length; i++ ){
        if ( this.childNodes[ i ] == oldChild ){
            this.childNodes[ i ] = newChild;

            newChild.setOwnerDocument( this.ownerDocument );

            newChild.parentNode = this;
            if (newChild.onparentNode.ready) newChild.onparentNode.sendEvent( this );
            if (this.onchildNodes.ready) this.onchildNodes.sendEvent( newChild );
            this.ownerDocument.handleDocumentChange( "childNodes" , this , 0, newChild );
            return newChild;
        }
    }
    //raise exception
    return null;
}

/**
  * Removes a given node from this node's childNodes
  * @param LzDataNode oldChild: The LzDataNode to remove
  * @return LzDataNode: The removed child, or null if the oldChild was not found
  */
function removeChild (oldChild){
    var reval = null;
    this.__LZcoDirty = true;
    for ( var i = 0; i < this.childNodes.length; i++ ){
        if ( this.childNodes[ i ] == oldChild ){
            this.childNodes.splice( i , 1 );
            if (this.onchildNodes.ready) this.onchildNodes.sendEvent( oldChild );
            reval = oldChild;
            this.ownerDocument.handleDocumentChange("removeChild", this, 0, oldChild);
        }
    }
    //raise exception if not found
    return reval;
}

/**
  * Adds a child to this node's list of childNodes
  * @param LzDataNode newChild: The LzDataNode to add.
  * @return LzDataNode: The newChild.
  */
function appendChild (newChild){
    if ( this.childNodes ){
        this.childNodes.push( newChild );
    } else {
        this.childNodes = [ newChild ];
    }

    newChild.setOwnerDocument( this.ownerDocument );

    newChild.parentNode = this;
    if (newChild.onparentNode.ready) newChild.onparentNode.sendEvent( this );

    //instead of marking dirty, this is easy
    newChild.__LZo = this.childNodes.length -1;

    if (this.onchildNodes.ready) this.onchildNodes.sendEvent( newChild );
    this.ownerDocument.handleDocumentChange( "appendChild" , this , 0, newChild );
    return newChild;
}

/**
  * Tests whether or not this node has child nodes.
  * @return Boolean: If true, this node has child nodes.
  */
function hasChildNodes (){
    return this.childNodes.length > 0;
}

/**
  * Returns a copy of this node.
  * @param Boolean deep: If true, the children of this node will be part of the
  * new node
  * @return LzDataNode: A copy of this node.
  */
function cloneNode ( deep ){
    var n = new LzDataElement(this.nodeName);
    n.setAttrs( this.attributes );
    if ( deep ){
        for ( var i = 0 ; i < this.childNodes.length; i++ ){
            n.appendChild ( this.childNodes[ i ].cloneNode( true ) );
        }
    }

    return n;
}

/**
  * Returns the value for the give attribute
  * @param String name: The name of the attribute whose value to return
  * @return String: The value for the given attribute
  */
function getAttr (name){
    if (this.attributes) return this.attributes[ name ];
}

/**
  * @access private
  */
/*
prototype.getAttr.dependencies = function (who , self){
    return [ self, 'attributes' ];
}
*/

/**
  * Sets the given attribute to the given value
  * @param String name: The name of the attribute to set.
  * @param String value: The value for the attribute.
  */
function setAttr (name, value){
    if ( ! this.attributes ) {
      this.attributes = {};
    }
    this.attributes[ name ] = value;
    if (this.onattributes.ready) this.onattributes.sendEvent( name );
    this.ownerDocument.handleDocumentChange( "attributes" , this , 1, {name: name, value: value, type: 'set'});
    return value;
}

/**
  * Removes the named attribute
  * @param String name: The name of the attribute to remove.
  */
function removeAttr (name){
    var v = this.attributes[ name ];
    delete this.attributes[ name ];
    if (this.onattributes.ready) this.onattributes.sendEvent( name );
    this.ownerDocument.handleDocumentChange( "attributes" , this , 1, {name: name, value: v, type: 'remove'});
    return v;
}

/**
  *This method returns a Attr object.
  *The name parameter is of type String.
  */
//function getAttributeNode (name){
//}

/**
  *This method returns a Attr object.
  *The newAttr parameter is a Attr object.
  */
//function setAttrNode (newAttr){
//}

/**
  * Tests whether or not this node has a given attribute.
  * @param String name: The name of the attribute to test
  * @return Boolean: If true, the named attribute is present.
  */
function hasAttr (name){
    return this.attributes[ name ] != null;
}

/**
  * Returns the first child of this node.
  * @return LzDataNode: The first child of this node
  */
function getFirstChild (){
    return this.childNodes[ 0 ];
}
/**
  * @access private
  */
/*
prototype.getFirstChild.dependencies = function( who, self ){
    return [ this , "childNodes" ];
}
*/

/**
  * Returns the last child of this node.
  * @return LzDataNode: The last child of this node
  */
function getLastChild (){
    return this.childNodes[ this.childNodes.length-1 ];
}
/**
  * @access private
  */
/*
prototype.getLastChild.dependencies = function( who, self ){
    return [ this , "childNodes" ];
}
*/



/**
  * @access private
  */
/*
prototype.hasAttr.dependencies = function (who , self){
    return [ self, 'attributes' ];
}
*/

/**
  * Sets the attributes of this node to the given Object.
  * @param Object attrs: The object to use as the attrs for this node.
  */
function setAttrs ( attrs, val=null ){
    var a = {};
    for ( var k in attrs ){ a[ k ] = attrs[ k ]; }

    this.attributes = a;
    if (this.onattributes.ready) this.onattributes.sendEvent( a);
    if (this.ownerDocument) {
        this.ownerDocument.handleDocumentChange( "attributes" , this , 1);
    }
}

/**
  * Sets the children of this node to the given array.
  * @param [LzDataNode] children: An array of LzDataNodes to be the new children
  * of this node
  */
function setChildNodes ( children, val=null ){
    this.childNodes = children;
    for ( var i = 0; i < children.length; i++ ){
        var c = children[ i ];
        if (c) {
            c.setOwnerDocument( this.ownerDocument );
            c.parentNode = this;
            if (c.onparentNode) {
                if (c.onparentNode.ready) c.onparentNode.sendEvent( this );
            }
            c.__LZo = i;
        }
    }
    this.__LZcoDirty = false;
    if (this.onchildNodes) {
        if (this.onchildNodes.ready) this.onchildNodes.sendEvent( children );
    }
    this.ownerDocument.handleDocumentChange( "childNodes" , this , 0);
}

/**
  * Sets the name of this node.
  * @param String name: The new name for this node
  */
function setNodeName ( name, val=null ){
    //Debug.write('setting node name from "',this.nodeName, '" to "', name, '"');
    this.nodeName = name;
    //since this can affect xpaths, send onchildNodes event
    if (this.onnodeName.ready) this.onnodeName.sendEvent( name );
    if (this.parentNode) {
        if (this.parentNode.onchildNodes.ready) this.parentNode.onchildNodes.sendEvent( this );
        if (this.parentNode.onchildNode.ready) this.parentNode.onchildNode.sendEvent( this );
    }
    this.ownerDocument.handleDocumentChange( "childNodeName" , 
                                             this.parentNode , 0 );
    this.ownerDocument.handleDocumentChange( "nodeName" , this, 1 );
}

/**
  * @access private
  */
function __LZgetText (ignore=null ){
    var s= "";
    for ( var i = 0; i < this.childNodes.length; i++ ){
        var c = this.childNodes[ i ]
        if ( c.nodeType == LzDataNode.TEXT_NODE ){
            s += c.data;
        }
    }
    return s;
}

/**
  * Returns a list of the childNodes of this node which have a given name
  * @param String name: The name of the node to look for.
  * @return [LzDataNode]: A list of childNodes which have the given name.
  */
function getElementsByTagName (name) {
    var r = [];
    for ( var i = 0; i < this.childNodes.length; i++ ){
        if ( this.childNodes[i].nodeName == name ){
            r.push( this.childNodes[ i ] );
        }
    }
    return r;
}

/*
//This method returns a Attr object.
//The oldAttr parameter is a Attr object.
//This method can raise a DOMException object. 
// function removeAttributeNode (oldAttr) {
}
//This method returns a String.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String. 
// function getAttributeNS (namespaceURI, localName) {
}
//This method has no return value.
//The namespaceURI parameter is of type String.
//The qualifiedName parameter is of type String.
//The value parameter is of type String.
//This method can raise a DOMException object. 
// function setAttrNS (namespaceURI, qualifiedName, 
                                                                    value) {
}
//This method has no return value.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String.
//This method can raise a DOMException object. 
// function removeAttributeNS (namespaceURI, localName) {
}
//This method returns a Attr object.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String. 
// function getAttributeNodeNS (namespaceURI, localName) {
}
//This method returns a Attr object.
//The newAttr parameter is a Attr object.
//This method can raise a DOMException object. 
// function setAttrNodeNS (newAttr) {
}
//This method returns a NodeList object.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String. 
// function getElementsByTagNameNS (namespaceURI, localName) {
}
//This method returns a Boolean.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String.
// function hasAttrNS (namespaceURI, localName) {
}
*/

var __LZlt = "<";
var __LZgt = ">";


/**
  * Returns this node as a string of xml.
  * @return String: The string serialization of this node.
  */
function serialize (){
    return this.serializeInternal();
}

/**
  * Implementation of serialize with option to limit string length
  * @access private
  */
function serializeInternal (len=Infinity) {
    var s = this.__LZlt + this.nodeName;

    //Debug.info('k', this.attributes);
    for ( var k in this.attributes ){
        s += " " + k + '="' + LzDataNode.__LZXMLescape( this.attributes[ k ] ) + '"';
        if (s.length > len) { break; }
    }

    if ( s.length <= len && this.childNodes && this.childNodes.length ){
        s += this.__LZgt;
        for ( var i = 0; i < this.childNodes.length; i++ ){
            s += this.childNodes[ i ].serializeInternal(len);
            if (s.length > len) { break; }
        }
        s += this.__LZlt + "/" + this.nodeName + this.__LZgt;
    } else {
        s += "/" + this.__LZgt;
    }
    if (s.length > len) { s = LzDataElement.abbreviate(s, len); }
    return s;
}

/**
  * For debugging.  Same as serialize, but will abbreviate at printLength.
  * @access private
  */
override function _dbg_name () {
    return this.serializeInternal(LzDataElement.printLength);
}

/**
  * Nodes call this method on their ownerDocument whenever they change in any 
  * way. This method sends the onDocumentChange event, which triggers
  * datapointer updates
  * @param String what: A description of what changed.
  * @param LzDataNode who: The node that changed.
  * @param Number type: private
  */
function handleDocumentChange ( what , who , type, cobj=null ){
    var o = { who:  who , what: what , type : type};
    if (cobj) o.cobj = cobj;
    if ( this.__LZchangeQ ){
        this.__LZchangeQ.push ( o );
    } else {
        if (this.onDocumentChange.ready) this.onDocumentChange.sendEvent( o );
    }
}

/**
  * @access private
  */
override function toString (){
    //this.__LZlt = "&lt;";
    //this.__LZgt = "&gt;";
    var r = this.serialize();
    //delete this.__LZlt;
    //delete this.__LZgt;
    return r;
}

/**
  * @access private
  */
function __LZdoLock ( locker ){
    if ( !this.__LZchangeQ ){
        this.__LZchangeQ = [];
        this.__LZlocker = locker;
    }
}


/**
  * @access private
  */
function __LZdoUnlock ( locker ){
    
    if ( this.__LZlocker != locker ){
        return;
    }

    var lzq = this.__LZchangeQ;
    this.__LZchangeQ = null;

    if (lzq != null) {
        for ( var i = 0; i < lzq.length; i++ ){
            var sendit = true;
            var tc = lzq[ i ];
            for ( var j = 0; j < i; j++ ){
                var oc = lzq[ j ];
                if ( tc.who == oc.who &&
                     tc.what == oc.what &&
                     tc.type == oc.type ){
                    sendit = false;
                    break;
                }
            }

            if ( sendit ){
                this.handleDocumentChange ( tc.what, tc.who, tc.type );
            }
        }
    }
}

} // End of LzDataElementMixin

/**
  * <p>
  * An LzDataElement represents a node a in a hierarchical dataset. An LzDataElement can contain other LzDataElements, or <classname>LzDataText</classname>, which represents a text node. See the example on <classname>LzDataNode</classname>. 
  * </p>
  *
  * @shortdesc A node of hierarchical data.
  * @see LzDataNode LzDataText LzDataPointer
  * @access public
  */
class LzDataElement extends LzMiniNode with LzDataElementMixin, LzDataNodeMixin
{
  static var setters = new LzInheritedHash(LzMiniNode.setters);
  static var getters = new LzInheritedHash(LzMiniNode.getters);
  static var defaultattrs = new LzInheritedHash(LzMiniNode.defaultattrs);
  static var options = new LzInheritedHash(LzMiniNode.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzMiniNode.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzMiniNode.earlySetters);

  // These setters are defined in LzDataElementMizin
  LzDataElement.setters.attributes = "setAttrs";
  LzDataElement.setters.childNodes = "setChildNodes";
  LzDataElement.setters.nodeName   = "setNodeName";

  // These setters are defined in LzDataNodeMizin
  LzDataElement.setters.ownerDocument = "setOwnerDocument";

    // N.B.: LzDataElement is not an LzNode so has a different
    // initialize signature.
    function LzDataElement ( name , attributes = null, children = null ) {
            super(name, attributes, children);
            this.nodeName = name;
            this.nodeType = LzDataNode.ELEMENT_NODE;
            this.attributes = attributes;
            this.ownerDocument = this;
            if (children == null) {
                this.setChildNodes ( [] );
            } else {
                this.setChildNodes( children );
            }
        }

/**
  * Returns a list of empty nodes, each named 'name'.
  * @param Number count: how many nodes to create.
  * @param String name: the name for each node
  * @return Array: list of new nodes.
  */
static function makeNodeList(count, name) {
    var a = [];
    for (var i=0; i < count; i++) {
        a[i] = new LzDataElement(name, {}, null);
    }
    return a;
}

//TODO Used instead of Debug.abbreviate. You can remove this when Debug is
// moved to swf9
static var printLength = 1024;
static function abbreviate (s, l) {
  var ellipsis = '...'; // '\u2026' doesn't work, wah.
  if (s.length > (l - ellipsis.length)) {
    s = s.substring(0, l - ellipsis.length) + ellipsis;
  }
  return s;
}

/**
  * Get LzDataElement representation of primitive type, array, or object value.
  */
static function valueToElement ( o ) {
    var n = new LzDataElement("element", { }, LzDataElement.__LZv2E(o));
    return n; 
}

/**
  * @param Type o: primitive type, array, or object value.
  * @return array of LzDataElements
  * @access private
  */
static function __LZv2E ( o ) {

    var type = typeof( o );
    type.toLowerCase();

    var c = [];
    if (type == "object") {
        if ( o instanceof LzDataElement ||
             o instanceof LzDataText ) {
            c[0] = o;
        } else if (o instanceof Date) {

            type = "date";
            // FIXME: [2004-04-10 pkang] what should we do with dates?

        } else if (o instanceof Array) {
            type = "array";
            var tag = (o.__LZtag != null ? o.__LZtag : 'item');
            for (var i=0; i < o.length; i++) {
                var tmpC = LzDataElement.__LZv2E( o[i] );
                c[i] = new LzDataElement(tag, null, tmpC ); 
            }
        } else {
            type = "struct";
            var i = 0;
            for (var k in o) {
                // skip any properties that start with __LZ
                if (k.indexOf('__LZ') == 0) continue;
                c[i++] = new LzDataElement(k, null, LzDataElement.__LZv2E(o[k]));
            }
        }
    } else if (o != null) {
        c[0] = new LzDataText( o );
    }

    if (c.length == 0) c = null;

    return c;
}

} // End of LzDataElement
