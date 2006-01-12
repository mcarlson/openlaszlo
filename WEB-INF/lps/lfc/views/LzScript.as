/******************************************************************************
 * LzScript.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//============================================================================
// DEFINE OBJECT: LzScript
// An LzScript is the implementation of the <script> tag.  It ensures that 
// the script is run in lexical order with surrounding nodes
//
// @keywords private
//============================================================================

LzScript = Class( 
    "LzScript" , 
    LzNode , 
    function ( parent, args ){
        args.script();
    }
);

