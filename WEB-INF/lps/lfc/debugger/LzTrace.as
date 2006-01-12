/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/******************************************************************************
 * LzTrace.as
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// Support for tracing function calls in the debugger

//---
// A Trace is a warning with the tag 'TRACE'
//---
LzTrace = function(file, line, message) {
  // super.apply(arguments);
  LzWarning.apply(this, arguments);
}

LzTrace.prototype = new LzWarning();
LzTrace.prototype.constructor = LzTrace;
LzTrace.format = LzWarning.format;
LzTrace.prototype.type = 'TRACE';

//---
// Create a trace message from a format string
//
// @param String control: a format control string
// @param any... args: the arguments to the format control
//
// See also: Debug.format
//
// @keywords private
//---
// TODO: [2005-08-15 ptw] Make the timestamp an attribute of the
// instance that is automatically appended.  Perhaps all warnings
// should be timestamped?
Debug.traceMessage = function (control, args) {
  var trace = _root.LzTrace;
  var msg = trace.format.apply(trace, [null, null].concat(arguments));
  this.freshLine()
    this.__write(msg);
}

//---
// Trace a method of an object
//
// @param Object who: the object whose method to trace
// @param String what: the name of the method to trace
//
// Will trace the named method of the object and print a message to
// the Debug console each time it is called or returned from.  When
// called, the message will give a timestamp, the name of the function
// and the arguments it was called with.  When returned from, the
// message will give the name of the function and the value it
// returned (if any).
//
// If backtraces are enabled, inspecting the message will reveal the
// call chain that caused the modification.

//---
Debug.trace = function(who, what) {
  if (who[what] instanceof Function) {
    var f = who[what];
    var n = Debug.functionName(f);
    var m = function () {
      Debug.traceMessage("[%6.2f] %s.apply(%w, %w)",
                           (new Date).getTime() % 1000000,
                           n, this, arguments);
      var r = f.apply(this, arguments);
      Debug.traceMessage("[%6.2f] %s -> %w",
                           (new Date).getTime() % 1000000,
                           n, r);
      return r;
    };
    m._dbg_previous_definition = f;
    who[what] = m;
  } else {
    Debug.error('%w.%s is not a function', who, what);
  }
}

//---
// Stop tracing a method of an object
//
// @param Object who: the object whose method to not trace
// @param String what: the name of the method to not trace
//
// See also: Debug.trace
//---
Debug.untrace = function(who, what) {
  // Object.unwatch is Flash-specific
  if (who[what] instanceof Function) {
    var f = who[what];
    var p = f['_dbg_previous_definition'];
    if (p) { 
      who[what] = p;
    } else {
        Debug.error('%w.%s is not being traced', who, what);
    }
  } else {
    Debug.error('%w.%s is not a function', who, what);
  }
}
