/******************************************************************************
 * LzTransformer.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzTransform
// Transfomers are objects that add themselves to the end of an instance's
// prototype chain.
// @keywords private
//=============================================================================
function LzTransformer(  ){
        
}


    
    
//=============================================================================
// Applies the transformer to the given view
// @keywords private
//=============================================================================
LzTransformer.prototype.apply = function ( view ){
    var t = new Object;
    var oldproto = view.__proto__;
    view.__proto__ = t;

    
    for ( var ps in this ){
        t[ ps ] = this[ps];
    }

    t.classname = "$t" + _root.LzTransformer.transformerID++;
    t.__proto__ = oldproto;
    delete t.apply;
}

LzTransformer.transformerID = 0;

// deprecated
LzTransformer.prototype.callInherited = Object.class.callInherited;
// scaffolding
LzTransformer.prototype.__LZcallInherited = Object.class.__LZcallInherited;
