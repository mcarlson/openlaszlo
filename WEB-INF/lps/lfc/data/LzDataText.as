/******************************************************************************
 * LzDataText.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzDataText
// This object represents a text node in a set of data.
// @param String text: The text that this node holds.
//==============================================================================
LzDataText = Class(
    "LzDataText", 
    LzDataNode, 
    function ( text ){
        this.data = text;
    }
);

//This property is of type String, can raise a DOMException object on setting
//and can raise a DOMException object on retrieval. 
LzDataText.prototype.nodeType = LzDataNode.TEXT_NODE;

LzDataText.prototype.setters.data = "setData";

//@field String data: The data held by this node.
LzDataText.prototype.data = "";

//This read-only property is of type Number. 
LzDataText.prototype.length = 0;

//------------------------------------------------------------------------------
// Sets the string that this node holds.
// @param String newdata: The new string for this node.
//------------------------------------------------------------------------------
LzDataText.prototype.setData = function ( newdata ) {
    this.data = newdata;
    this.ondata.sendEvent( newdata );
    this.ownerDocument.handleDocumentChange( "data" , this , 1 );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataText.prototype.cloneNode = function ( ){
    return new _root.LzDataText( this.data );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataText.prototype.serialize = function (){
    return this.__LZXMLescape( this.data );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataText.prototype.toString = function (){
    //return this.serialize();
    return this.data;
}
