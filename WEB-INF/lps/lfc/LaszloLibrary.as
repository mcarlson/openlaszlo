/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/******************************************************************************
 * Definition of the basic LFC Library 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//* V_LZ_COPYRIGHT_BEGIN ******************************************************
var _Copyright = "Portions of this file are copyright (c) 2001-2004 by Laszlo Sy stems, Inc.  All rights reserved."
//* V_LZ_COPYRIGHT_END ********************************************************

// Compiler runtime support first
#include "compiler/LzRuntime.as"

// Not _root.$krank because the compile-time constant optimizer will
// not trigger
if ($krank) {
  _root.makeResolverClosure = function (fn, arg) {
    var c = function () {
      // call fn on object with arg
      this[arguments.callee.fn](arguments.callee.arg);
    };
    // This is how krank knows to make a 'closure' 
    // TODO: [2005-04-21 ptw] See LPP-277 'Krank can't really
    // reconstruct closures' for why we have to close over arguments
    // manually
    c.fn = fn;
    c.arg = arg;
    c.name = arguments.callee.name + '()';
    return c;
  }
}

if ($debug) {
  // Must be loaded first
  #include "debugger/Library.as"
  if ($krank) {
  } else {
    // For debugging serialization without kranking
    #include "LzSerializer.as"
  }
}

// Not _root.$krank because the compile-time constant optimizer will
// not trigger
if ($krank) {
  // This has to load before libraries, so markLibraryMovies does not
  // enumerate any movies constructed by top-level forms
  #include "LzSerializer.as"

  // Define after LzSerializer
  _root.$SID_TRANSIENT = {
    // Reset on load
    _url : _root.LzSerializer.transient ,
    $version : _root.LzSerializer.transient ,
    // TODO: [2004-12-15 ptw] Really we want to serialize this as
    // false, not undefined
    $krank: _root.LzSerializer.transient ,
    // This is preserved by edit-movie, don't duplicate
    lzpreloader: _root.LzSerializer.transient
  };

  LzSerializer.markLibraryMovies();
}

if ($profile) {
  #include "profiler/LzProfile.as"
}

// CODf for pablo's micro SErver


#include "core/Library.as"
#include "events/Library.as"
#include "views/Library.as"
#include "controllers/Library.as"
#include "helpers/Library.as"
#include "transformers/Library.as"
#include "data/Library.as"
#include "services/Library.as"
#include "glue/Library.as"

//fscommand("setHost");
//var lzHost;
//var lzPort;
//var isOnline = false;


if ($profile) {
  // Create an idle handler that calls dump
  _root.attachMovie("__LZprofiler", "profilermc", 4794);
}

if ($debug) {
  // Must be loaded last -- tells the core debugger loading is done
  #include "debugger/LzInit.as"
}

// Not _root.$krank because the compile-time constant optimizer will
// not trigger
if ($krank) {
  _root.$SID_RESOLVE_OBJECT = function () {
    // The debugger tests this
    _root.$krank = false;
    // Finish preloader, if it exists  [See also LzSerializer.start]
    // (Normally this is handled by the compiler -- it is the last
    // top-level expression in the swf.)
    if (typeof(_root.lzpreloader) != 'undefined') {
      _root.lzpreloader.done();
    }
    // Finish LzCanvas.__LzcallInit
    _root.canvas.init();
    _root.canvas.oninit.sendEvent( this );
    _root.canvas.datapath.__LZApplyDataOnInit();
  }
}

