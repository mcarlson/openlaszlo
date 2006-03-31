/******************************************************************************
 * LzTrait.as 
 *****************************************************************************/
 
//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

LzTrait = Class( "LzTrait" , null , function ( traitdesc ){
    _root.Debug.write( "got desc:" , traitdesc );
    var ta = traitdesc.attrs;
    _root.Debug.write( "name" , traitdesc.name );
    _root.Debug.write( "global" , global );
    _root.LzTrait.traits[ traitdesc.attrs.name ] = this;
    for ( var k in ta ){
        this[ k ] = ta[ k ];
    }
}
);

LzTrait.traits = {};
