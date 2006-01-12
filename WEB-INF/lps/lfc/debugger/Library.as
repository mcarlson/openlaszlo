/******************************************************************************
 * Library.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// Scope the #pragma
{
    #pragma 'warnUndefinedReferences=true'
    // First, so source warnings work ASAP
    #include "debugger/LzCompiler.as"
    // Next to get Debug.__write defined
    #include "debugger/LzDebug.as"
    // Next to get LzWarning defined
    #include "debugger/LzMessage.as"
    // Make backtraces work
    #include "debugger/LzBacktrace.as"
    // Order beyond here has not been thought about (yet)
    #include "debugger/LzRemote.as"
    #include "debugger/LzMemory.as"
    #include "debugger/LzFormat.as"
    #include "debugger/LzMonitor.as"
    #include "debugger/LzTrace.as"
    #include "debugger/LzFlashRemote.as"
    // N.B.: LzInit.as is loaded as the last thing in LaszloLibrary
}
