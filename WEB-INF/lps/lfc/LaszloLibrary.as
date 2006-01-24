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

if ($debug) {
  // Must be loaded first
  #include "debugger/Library.as"
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
