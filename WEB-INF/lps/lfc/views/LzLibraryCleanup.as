/******************************************************************************
 * LzLibraryCleanup.as
 * ***************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// This will always be the last view instantiated by a library. It's job is to send
// the "onload" event to the LzLibrary with the given name. 

LzLibraryCleanup = Class(
    "LzLibraryCleanup",
    LzNode,
    function ( owner , args ) {
        //this.callInherited( "constructor", arguments.callee ,owner ,args );
        var lib = LzLibrary.prototype.findLibrary(args.libname);
        lib.loading = false;
        lib.onload.sendEvent(true);
    }
);
