/******************************************************************************
 * LzDataNode.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzDataNode
//
// LzDataNode is the abstract baseclass for LzDataElement and LzDataText.
//==============================================================================
var LzDataNode = Class( "LzDataNode" , null, function (){ this.childNodes = []; } );

//@field Number nodeType: The type of this node -- ELEMENT_NODE or TEXT_NODE
LzDataNode.prototype.nodeType = null;

//@field LzDataNode ownerDocument: The ownerDocument of this node.
LzDataNode.prototype.ownerDocument   = null;

//@field LzDataNode parentNode: The name of this node.
LzDataNode.prototype.parentNode      = null;
LzDataNode.prototype.onparentNode   = null;

//@problem: how do I document these?
LzDataNode.ELEMENT_NODE = 1;
LzDataNode.TEXT_NODE = 3;
LzDataNode.DOCUMENT_NODE = 9;

//------------------------------------------------------------------------------
// Returns the sibling before this one this node's parentNodes List of children
// @return LzDataNode: The node preceeding this one in this node's childNodes
//------------------------------------------------------------------------------
LzDataNode.prototype.getPreviousSibling = function (){
    if ( this.parentNode.__LZcoDirty ) this.parentNode.__LZupdateCO();
    return this.parentNode.childNodes[ this.__LZo - 1 ];
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataNode.prototype.getPreviousSibling.dependencies = function( who, self ){
    return [ this.parentNode , "childNodes" , this , "parentNode" ];
}

//------------------------------------------------------------------------------
// Returns the sibling after this one this node's parentNodes List of children
// @return LzDataNode: The node succeeding this one in this node's childNodes
//------------------------------------------------------------------------------
LzDataNode.prototype.getNextSibling     = function (){
    if ( this.parentNode.__LZcoDirty ) this.parentNode.__LZupdateCO();
    return this.parentNode.childNodes[ this.__LZo + 1 ];
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataNode.prototype.getNextSibling.dependencies = function( who, self ){
    return [ this.parentNode , "childNodes" , this , "parentNode" ];
}

//------------------------------------------------------------------------------
// Tells whether the given node is above this one in the node hierarchy.
// @param LzDataElement el: The LzDataElement to test to see if it is above
// this one
// @param Boolean allowself: If true, this function returns true if the given
// node is the same as this node.
//------------------------------------------------------------------------------
LzDataNode.prototype.childOf = function ( el , allowself ) {
    var p = allowself ? this : this.parentNode
    while ( p ){
        if ( p == el ) return true;
        p = p.parentNode;
    }
    return false;
}

//------------------------------------------------------------------------------
// Sets the LzDataNode which is the ownerDocument for this node.
// @param LzDataNode ownerDoc: The LzDataNode to act as the ownerDocument for
// this node.
//------------------------------------------------------------------------------
LzDataNode.prototype.setOwnerDocument = function ( ownerDoc ){
    this.ownerDocument = ownerDoc;
    for ( var i = 0; i < this.childNodes.length; i++ ){
        this.childNodes[ i ] .setOwnerDocument( ownerDoc );
    }

    this.onownerDocument.sendEvent( ownerDoc );
}

//this is similar to the escape routine in LzText, but that one's shorter
//since flash it's just for escaping <>
LzDataNode.prototype.__LZescapechars = {};
LzDataNode.prototype.__LZescapechars[ "&" ] =  "&amp;" ;
LzDataNode.prototype.__LZescapechars[ "<" ] =  "&lt;" ;
LzDataNode.prototype.__LZescapechars[ ">" ] =  "&gt;" ;
LzDataNode.prototype.__LZescapechars[ '"' ] =  "&quot;" ;
LzDataNode.prototype.__LZescapechars[ "'" ] =  "&apos;" ;
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataNode.prototype.__LZXMLescape = function ( t ){
    if ( typeof( t ) != "string" ) return t;

    var olen = t.length;
    var r = "";
    for ( var i = 0; i < olen; i++ ){
        //handle newlines
        if ( t.charCodeAt( i ) == 13 ){
            r += "&#xD;";
        } else {
            var c = t.charAt( i );
            if ( this.__LZescapechars[ c ] != null ){
                r += this.__LZescapechars[ c ];
            } else {
                r += c;
            }
        }
    }

    return r;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataNode.prototype.__LZlockFromUpdate = function ( locker ){
    this.ownerDocument.__LZdoLock( locker );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataNode.prototype.__LZunlockFromUpdate = function ( locker ){
    this.ownerDocument.__LZdoUnlock( locker );
}

//-----------------------------------------------------------------------------
// Converts string to XML data.
// @param String str: A valid string of XML. If the string is simple text, or
// that there isn't a single root element, this function returns null. In cases
// where the string is an invalid but well formatted snippet of XML, this
// function will close any tags to make for a valid XML document
// @param boolean trimwhitespace: if true, text nodes have whitespace trimmed from start and end.
// @return LzDataElement: An LzDataElement which is the top of the hierarchy
// generated from the string
//-----------------------------------------------------------------------------
LzDataNode.stringToLzData = function( str, trimwhitespace, stripnsprefix ) {
    var xmlobj = new XML();
    xmlobj.ignoreWhite = true;
    xmlobj.parseXML( str );
    if ( xmlobj.childNodes.length != 1 ) return null;
    var lfcnode = LzLoader.prototype.copyFlashXML(xmlobj, trimwhitespace, stripnsprefix);
    var fc = lfcnode.removeChild( lfcnode.getFirstChild() );  
    if ( fc instanceof LzDataText ) return null;
    return fc;
}

LzDataNode.whitespaceChars = {' ': true, '\r': true, '\n': true, '\t': true};


//------------------------------------------------------------------------------
// @keywords private
// trim whitespace from start and end of string
//------------------------------------------------------------------------------
LzDataNode.trim = function( str ) {
    var whitech = LzDataNode.whitespaceChars;
    var len = str.length;
    var sindex = 0;
    var eindex = str.length -1;
    var ch;
    while (sindex < len) {
        ch = str.charAt(sindex);
        if (whitech[ch] != true) break;
        sindex++;
    }

    while (eindex > sindex) {
        ch = str.charAt(eindex);
        if (whitech[ch] != true) break;
        eindex--;
    }
        
    return str.slice(sindex,eindex+1);
}
