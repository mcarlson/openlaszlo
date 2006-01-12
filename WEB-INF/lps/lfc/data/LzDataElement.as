/******************************************************************************
 * LzDataElement.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzDataElement
// This object represents a hierarchical data node.
// @param String name: The name for this node.
// @param Object attributes: A optional dictionary of attributes for this node.
// @param [LzDataNode] children: An optional array of children for this node
//==============================================================================
LzDataElement = Class(
    "LzDataElement",
    LzDataNode,
    function ( name , attributes , children ) {
        this.nodeName = name;
        this.attributes = attributes;
        this.ownerDocument = this;
        if (children == null) {
            this.childNodes([]);
        } else {
            this.setChildNodes( children );
        }
    }
);

LzDataElement.prototype.nodeType = LzDataNode.ELEMENT_NODE;
//@field String nodeName: The name of this node.
LzDataElement.prototype.nodeName        = null;
//LzDataElement.prototype.nodeValue       = null;
//LzDataElement.prototype.nodeType        = null;

//@field [LzDataNode] childNodes: An array of children of this node
LzDataElement.prototype.childNodes      = null;

//@field Object attributes: The dictionary of attributes for this node.
LzDataElement.prototype.attributes      = null;

//events
LzDataElement.prototype.onattributes   = null;
LzDataElement.prototype.onnodeName   = null;
LzDataElement.prototype.onchildNodes      = null;
LzDataElement.prototype.onownerDocument     = null;

LzDataElement.prototype.setAttribute = _root.LzNode.prototype.setAttribute;

//since you can't assign directly to these slots...
LzDataElement.prototype.setters = {};
LzDataElement.prototype.setters.attributes = "setAttrs";
LzDataElement.prototype.setters.childNodes = "setChildNodes";
LzDataElement.prototype.setters.nodeName = "setNodeName";
//Shouldn't be directliy settable
LzDataElement.prototype.setters.ownerDocument = "setOwnerDocument";

//private
LzDataElement.prototype.__LZo = -1;
LzDataElement.prototype.__LZcoDirty = true;
LzDataElement.prototype.__LZchangeQ = null;
LzDataElement.prototype.__LZlocker = null;


//-----------------------------------------------------------------------------
// Inserts the given LzDataNode before another node in this node's childNodes
// @param LzDataNode newChild: the LzDataNode to insert
// @param LzDataNode refChild: the LzDataNode to insert newChild before
// @return LzDataElement: The new child, or null if the refChild wasn't found
//----------------------------------------------------------------------------- 
LzDataElement.prototype.insertBefore = function (newChild, refChild){
    this.__LZcoDirty = true;

    for ( var i = 0; i < this.childNodes.length; i++ ){
        if ( this.childNodes[ i ] == refChild ){
            this.childNodes.splice( i , 0 , newChild );
            newChild.setOwnerDocument( this.ownerDocument );

            newChild.parentNode = this;
            newChild.onparentNode.sendEvent( this );
            this.onchildNodes.sendEvent( newChild );
            this.ownerDocument.handleDocumentChange( "insertBefore" , 
                                                     this, 0 );
            return newChild;
        }
    }

    //raise exception
    return null;
}


//-----------------------------------------------------------------------------
// Replaces a given LzDataNode in this node's childNodes with a new one.
// @param LzDataNode newChild: the LzDataNode to add
// @param LzDataNode oldChild: the LzDataNode to be replaced by the newChild
// @return LzDataElement: The new child, or null if the oldChild wasn't found
//-----------------------------------------------------------------------------
LzDataElement.prototype.replaceChild = function (newChild, oldChild){

    this.__LZcoDirty = true;
    for ( var i = 0; i < this.childNodes.length; i++ ){
        if ( this.childNodes[ i ] == oldChild ){
            this.childNodes[ i ] = newChild;

            newChild.setOwnerDocument( this.ownerDocument );

            newChild.parentNode = this;
            newChild.onparentNode.sendEvent( this );
            this.onchildNodes.sendEvent( newChild );
            this.ownerDocument.handleDocumentChange( "childNodes" , this , 0 );
            return newChild;
        }
    }
    //raise exception
    return null;
}

//-----------------------------------------------------------------------------
// Removes a given node from this node's childNodes
// @param LzDataNode oldChild: The LzDataNode to remove
// @return LzDataNode: The removed child, or null if the oldChild was not found
//-----------------------------------------------------------------------------
LzDataElement.prototype.removeChild = function (oldChild){
    var reval = null;
    this.__LZcoDirty = true;
    for ( var i = 0; i < this.childNodes.length; i++ ){
        if ( this.childNodes[ i ] == oldChild ){
            this.childNodes.splice( i , 1 );
            this.onchildNodes.sendEvent( oldChild );
            reval = oldChild;
            this.ownerDocument.handleDocumentChange("removeChild", this, 0);
        }
    }
    //raise exception if not found
    return reval;
}

//-----------------------------------------------------------------------------
// Adds a child to this node's list of childNodes
// @param LzDataNode newChild: The LzDataNode to add.
// @return LzDataNode: The newChild.
//-----------------------------------------------------------------------------
LzDataElement.prototype.appendChild = function (newChild){
    if ( this.childNodes ){
        this.childNodes.push( newChild );
    } else {
        this.childNodes = [ newChild ];
    }

    newChild.setOwnerDocument( this.ownerDocument );

    newChild.parentNode = this;
    newChild.onparentNode.sendEvent( this );

    //instead of marking dirty, this is easy
    newChild.__LZo = this.childNodes.length -1;

    this.onchildNodes.sendEvent( newChild );
    this.ownerDocument.handleDocumentChange( "appendChild" , this , 0 );
    return newChild;
}

//-----------------------------------------------------------------------------
// Tests whether or not this node has child nodes.
// @return Boolean: If true, this node has child nodes.
//-----------------------------------------------------------------------------
LzDataElement.prototype.hasChildNodes = function (){
    return this.childNodes.length > 0;
}

//-----------------------------------------------------------------------------
// Returns a copy of this node.
// @param Boolean deep: If true, the children of this node will be part of the
// new node
// @return LzDataNode: A copy of this node.
//-----------------------------------------------------------------------------
LzDataElement.prototype.cloneNode = function ( deep ){
    var n = new _root.LzDataElement( this.nodeName );
    n.setAttrs( this.attributes );
    if ( deep ){
        for ( var i = 0 ; i < this.childNodes.length; i++ ){
            n.appendChild ( this.childNodes[ i ].cloneNode( true ) );
        }
    }

    return n;
}

//-----------------------------------------------------------------------------
// Returns the value for the give attribute
// @param String name: The name of the attribute whose value to return
// @return String: The value for the given attribute
//-----------------------------------------------------------------------------
LzDataElement.prototype.getAttr = function (name){
    return this.attributes[ name ];
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.prototype.getAttr.dependencies = function (who , self){
    return [ self, 'attributes' ];
}

//-----------------------------------------------------------------------------
// Sets the given attribute to the given value
// @param String name: The name of the attribute to set.
// @param String value: The value for the attribute.
//-----------------------------------------------------------------------------
LzDataElement.prototype.setAttr = function (name, value){
    if ( ! this.attributes ) {
      this.attributes = {};
    }
    this.attributes[ name ] = value;
    this.onattributes.sendEvent( name );
    this.ownerDocument.handleDocumentChange( "attributes" , this , 1);
    return value;
}

//-----------------------------------------------------------------------------
// Removes the named attribute
// @param String name: The name of the attribute to remove.
//-----------------------------------------------------------------------------
LzDataElement.prototype.removeAttr = function (name){
    var v = this.attributes[ name ];
    delete this.attributes[ name ];
    this.onattributes.sendEvent( name );
    this.ownerDocument.handleDocumentChange( "attributes" , this , 1);
    return v;
}

//-----------------------------------------------------------------------------
//This method returns a Attr object.
//The name parameter is of type String.
//-----------------------------------------------------------------------------
//LzDataElement.prototype.getAttributeNode = function (name){
//}

//-----------------------------------------------------------------------------
//This method returns a Attr object.
//The newAttr parameter is a Attr object.
//-----------------------------------------------------------------------------
//LzDataElement.prototype.setAttrNode = function (newAttr){
//}

//-----------------------------------------------------------------------------
// Tests whether or not this node has a given attribute.
// @param String name: The name of the attribute to test
// @return Boolean: If true, the named attribute is present.
//-----------------------------------------------------------------------------
LzDataElement.prototype.hasAttr = function (name){
    return this.attributes[ name ] != null;
}

//-----------------------------------------------------------------------------
// Returns the first child of this node.
// @return LzDataNode: The first child of this node
//-----------------------------------------------------------------------------
LzDataElement.prototype.getFirstChild      = function (){
    return this.childNodes[ 0 ];
}
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.prototype.getFirstChild.dependencies = function( who, self ){
    return [ this , "childNodes" ];
}

//-----------------------------------------------------------------------------
// Returns the last child of this node.
// @return LzDataNode: The last child of this node
//-----------------------------------------------------------------------------
LzDataElement.prototype.getLastChild       = function (){
    return this.childNodes[ this.childNodes.length-1 ];
}
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.prototype.getLastChild.dependencies = function( who, self ){
    return [ this , "childNodes" ];
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.prototype.__LZupdateCO = function (){
    for ( var i = 0; i < this.childNodes.length; i++ ){
        this.childNodes[ i ].__LZo = i;
    }
    this.__LZcoDirty = false;
}

//------------------------------------------------------------------------------
// gets offset of node in parent's childNodes array
// @return number
//------------------------------------------------------------------------------
LzDataElement.prototype.getOffset = function (){
    if (this.parentNode.__LZcoDirty) this.parentNode.__LZupdateCO();

    return this.__LZo;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.prototype.hasAttr.dependencies = function (who , self){
    return [ self, 'attributes' ];
}

//-----------------------------------------------------------------------------
// Sets the attributes of this node to the given Object.
// @param Object attrs: The object to use as the attrs for this node.
//-----------------------------------------------------------------------------
LzDataElement.prototype.setAttrs = function ( attrs ){
    var a = {};
    for ( var k in attrs ){ a[ k ] = attrs[ k ]; }

    this.attributes = a;
    this.onattributes.sendEvent( a);
    this.ownerDocument.handleDocumentChange( "attributes" , this , 1);
}

//-----------------------------------------------------------------------------
// Sets the children of this node to the given array.
// @param [LzDataNode] children: An array of LzDataNodes to be the new children
// of this node
//-----------------------------------------------------------------------------
LzDataElement.prototype.setChildNodes = function ( children ){
    this.childNodes = children;
    for ( var i = 0; i < children.length; i++ ){
        var c = children[ i ];
        c.setOwnerDocument( this.ownerDocument );
        c.parentNode = this;
        c.onparentNode.sendEvent( this );
        c.__LZo = i;
    }
    this.__LZcoDirty = false;
    this.onchildNodes.sendEvent( children );
    this.ownerDocument.handleDocumentChange( "childNodes" , this , 0);
}

//-----------------------------------------------------------------------------
// Sets the name of this node.
// @param String name: The new name for this node
//-----------------------------------------------------------------------------
LzDataElement.prototype.setNodeName   = function ( name ){
    this.nodeName = name;
    //since this can affect xpaths, send onchildNodes event
    this.onnodeName.sendEvent( name );
    this.parentNode.onchildNodes.sendEvent( this );
    this.ownerDocument.handleDocumentChange( "childNodeName" , 
                                             this.parentNode , 0 );
    this.ownerDocument.handleDocumentChange( "nodeName" , this, 1 );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.prototype.__LZgetText= function ( ){
    var s= "";
    for ( var i = 0; i < this.childNodes.length; i++ ){
        var c = this.childNodes[ i ]
        if ( c.nodeType == _root.LzDataNode.TEXT_NODE ){
            s += c.data;
        }
    }
    return s;
}

//------------------------------------------------------------------------------
// Returns a list of the childNodes of this node which have a given name
// @param String name: The name of the node to look for.
// @return [LzDataNode]: A list of childNodes which have the given name.
//------------------------------------------------------------------------------
LzDataElement.prototype.getElementsByTagName = function (name) {
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
//LzDataElement.prototype.removeAttributeNode = function (oldAttr) {
}
//This method returns a String.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String. 
//LzDataElement.prototype.getAttributeNS = function (namespaceURI, localName) {
}
//This method has no return value.
//The namespaceURI parameter is of type String.
//The qualifiedName parameter is of type String.
//The value parameter is of type String.
//This method can raise a DOMException object. 
//LzDataElement.prototype.setAttrNS = function (namespaceURI, qualifiedName, 
                                                                    value) {
}
//This method has no return value.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String.
//This method can raise a DOMException object. 
//LzDataElement.prototype.removeAttributeNS = function (namespaceURI, localName) {
}
//This method returns a Attr object.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String. 
//LzDataElement.prototype.getAttributeNodeNS = function (namespaceURI, localName) {
}
//This method returns a Attr object.
//The newAttr parameter is a Attr object.
//This method can raise a DOMException object. 
//LzDataElement.prototype.setAttrNodeNS = function (newAttr) {
}
//This method returns a NodeList object.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String. 
//LzDataElement.prototype.getElementsByTagNameNS = function (namespaceURI, localName) {
}
//This method returns a Boolean.
//The namespaceURI parameter is of type String.
//The localName parameter is of type String.
//LzDataElement.prototype.hasAttrNS = function (namespaceURI, localName) {
}
*/

LzDataElement.prototype.__LZlt = "<";
LzDataElement.prototype.__LZgt = ">";


//-----------------------------------------------------------------------------
// Returns this node as a string of xml.
// @return String: The string serialization of this node.
//-----------------------------------------------------------------------------
LzDataElement.prototype.serialize = function (){
    return this.serializeInternal(Infinity);
}

//---
// Implementation of serialize with option to limit string length
// @keywords private
//--
LzDataElement.prototype.serializeInternal = function (len) {
    if (arguments.length < 1) {
        len = Infinity;
    }
    var s = this.__LZlt + this.nodeName;

    for ( var k in this.attributes ){
        s += " " + k + '="' + this.__LZXMLescape( this.attributes[ k ] ) + '"';
        if (s.length > len) { break; }
    }

    if ( s.length <= len && this.childNodes.length ){
        s += this.__LZgt;
        for ( var i = 0; i < this.childNodes.length; i++ ){
            s += this.childNodes[ i ].serialize(len);
            if (s.length > len) { break; }
        }
        s += this.__LZlt + "/" + this.nodeName + this.__LZgt;
    } else {
        s += "/" + this.__LZgt;
    }
    if (s.length > len) { s = Debug.abbreviate(s, len); }
    return s;
}

//---
// For debugging.  Same as serialize, but will abbreviate at printLength.
// @keywords private
//---
LzDataElement.prototype._dbg_name = function () {
    return this.serializeInternal(Debug.printLength);
}

//-----------------------------------------------------------------------------
// Nodes call this method on their ownerDocument whenever they change in any 
// way. This method sends the onDocumentChange event, which triggers
// datapointer updates
// @param String what: A description of what changed.
// @param LzDataNode who: The node that changed.
// @param Number type: private
//-----------------------------------------------------------------------------
LzDataElement.prototype.handleDocumentChange = function ( what , who , type ){
    var o = { who:  who , what: what , type : type };
    if ( this.__LZchangeQ ){
        this.__LZchangeQ.push ( o );
    } else {
        this.onDocumentChange.sendEvent( o );
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.prototype.toString = function (){
    //this.__LZlt = "&lt;";
    //this.__LZgt = "&gt;";
    var r = this.serialize();
    //delete this.__LZlt;
    //delete this.__LZgt;
    return r;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.prototype.__LZdoLock = function ( locker ){
    if ( !this.__LZchangeQ ){
        this.__LZchangeQ = [];
        this.__LZlocker = locker;
    }
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.prototype.__LZdoUnlock = function ( locker ){
    
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

//------------------------------------------------------------------------------
// Get LzDataElement representation of primitive type, array, or object value.
//------------------------------------------------------------------------------
LzDataElement.valueToElement = function ( o ) {
     return new _root.LzDataElement("element", { }, this.__LZv2E(o));
}

//------------------------------------------------------------------------------
// @param Type o: primitive type, array, or object value.
// @return array of LzDataElements
// @keywords private
//------------------------------------------------------------------------------
LzDataElement.__LZv2E = function ( o ) {

    var type = typeof( o );
    type.toLowerCase();

    var c = [];
    if (type == "object") {
        var proto = o.__proto__;
        if ( proto == _root.LzDataElement.prototype ||
             proto == _root.LzDataNode.prototype ) {
            c[0] = o;
        } else if (proto == Date.prototype) {

            type = "date";
            // FIXME: [2004-04-10 pkang] what should we do with dates?

        } else if (proto == Array.prototype) {
            type = "array";
            var tag = (o.__LZtag != null ? o.__LZtag : 'item');
            for (var i=0; i < o.length; i++) {
                var tmpC = this.__LZv2E( o[i] );
                c[i] = new _root.LzDataElement(tag, null, tmpC ); 
            }
        } else {
            type = "struct";
            var i = 0;
            for (var k in o) {
                // skip any properties that start with __LZ
                if (k.indexOf('__LZ') == 0) continue;
                c[i++] = new _root.LzDataElement(k, null, this.__LZv2E(o[k]));
            }
        }
    } else if (o != null) {
        c[0] = new _root.LzDataText( o );
    }

    if (c.length == 0) c = null;

    return c;
}

//-----------------------------------------------------------------------------
// Returns a list of empty nodes, each named 'name'.
// @param Number count: how many nodes to create.
// @param String name: the name for each node
// @return Array: list of new nodes.
//-----------------------------------------------------------------------------
LzDataElement.makeNodeList = function(count, name) {
    var a = [];
    for (var i=0; i < count; i++) {
        a[i] = {nodeName:name, __proto__:LzDataElement.prototype};
    }
    return a;
}
