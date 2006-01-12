/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/******************************************************************************
 * LzBacktrace.as
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// Support for backtraces in the debugger

// Backtrace stack
__LzDebug.backtraceStack = new Array();

//---
// What we'd like an `arguments` array to be.  Really just a hook to
// hang a debug printer on
//---
__LzStackFrame = function (args) {
  if (args instanceof Array) {
    this['this'] = args['this'];
    this['function'] = args['callee'];
  }
  this.arguments = args;
}

//---
// Debug printer
//---
__LzStackFrame.prototype._dbg_name = function () {
  return Debug.formatToString('%0.72w.apply(%w, %w)', this['function'], this['this'], this.arguments);
}

//---
// Snapshot of the current backtrace.  Relies on compiler support that
// inserts code at the top of each function in debug mode that records
// the function's arguments in __LzDebug.backtraceStack
//
// @param skip:Number number of frames to omit from the backtrace.
// Defaults to 0.
//---
LzBacktrace = function (skip) {
  if (arguments.length < 1) {
      skip = 0;
  }
  var bs = _root.__LzDebug.backtraceStack;
  var l = bs.length - skip;
  this.length = l;
  for (var i = 0; i < l; i++) {
    this[i] = new __LzStackFrame(bs[i]);
  }
}

// An LzBacktrace is an array
LzBacktrace.prototype = new Array();
// Work around Flash deficiency...
LzBacktrace.prototype.constructor = LzBacktrace;

//---
// Convert a backtrace to a string
//
// @param printer:Function the function to print the backtrace
// functions with.  Defaults to Debug.__String
// @param length:Number the length to abbreviate the string to
//
// @keywords private
//---
LzBacktrace.prototype.toStringInternal = function(printer, length) {
  switch (arguments.length) {
    case 0:
      printer = function (o) { return _root.__LzDebug.__String(o['function']); };
    case 1:
      length = _root.__LzDebug.printLength;
  }
  var backtrace = "";
  var sep = " <- ";
  for (var i = this.length - 1; (i >= 0) && (backtrace.length < length); i--) {
    backtrace += printer(this[i]) + sep;
  }
  // Trim trailing sep
  if (backtrace != '') {
    backtrace = backtrace.substring(0, backtrace.length - sep.length);
  }
  backtrace = _root.__LzDebug.abbreviate(backtrace, length);
  return backtrace;
}

// Backtrace printer
LzBacktrace.prototype.toString = function () {
  return this.toStringInternal();
}

//---
// TODO: [2005-03-30 ptw] Doc tool should not bitch about inherited
// override
// @keywords private
//---
LzBacktrace.prototype._dbg_name = function () {
  return this.toStringInternal(function(o) { return _root.__LzDebug.functionName(o['function'], false); }, 75);
}

//---
// Snapshot the current call stack into a LzBacktrace object which
// can be printed or inspected
//
// Only available if lfc is compiled with --option debugBacktrace=true
// @param skip:Number number of frames to omit from the
// backtrace.  Defaults to 1.
//---
Debug.backtrace = function (skip) {
  if (arguments.length < 1) {
      skip = 1;
  }
  if (_root.__LzDebug.backtraceStack.length > skip) {
    return new _root.LzBacktrace(skip);
  }
}

