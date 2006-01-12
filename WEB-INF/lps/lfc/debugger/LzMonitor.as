/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/******************************************************************************
 * LzMonitor.as
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// Support for monitoring properties in the debugger

//---
// A Monitor is a warning with the tag 'MONITOR'
//---
LzMonitor = function(file, line, message) {
  // super.apply(arguments);
  LzWarning.apply(this, arguments);
}

LzMonitor.prototype = new LzWarning();
LzMonitor.prototype.constructor = LzMonitor;
LzMonitor.format = LzWarning.format;
LzMonitor.prototype.type = 'MONITOR';

//---
// Create a monitor message from a format string
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
Debug.monitorMessage = function (control, args) {
  var monitor = _root.LzMonitor;
  var msg = monitor.format.apply(monitor, [null, null].concat(arguments));
  this.freshLine()
    this.__write(msg);
}

//---
// Monitor a property of an object
//
// @param Object who: the object whose property to monitor
// @param String what: the name of the property to monitor
//
// Will monitor the named property of the object and print a message
// to the Debug console each time it is modified.  The message
// includes a timestamp, the function that modified the property, the
// object and property, and the old and new values.
//
// If backtraces are enabled, inspecting the message will reveal the
// call chain that caused the modification.

//---
Debug.monitor = function(who, what) {
  // Object.watch is Flash-specific
  return who.watch(what,
                   function (p, o, n, u) {
                     Debug.monitorMessage("[%6.2f] %s: %w.%s: %w -> %w",
                                          (new Date).getTime() % 1000000,
                                          Debug.functionName(arguments.caller),
                                          this,
                                          p, o, n);
                     return n;
                   }
                   );
}

//---
// Stop monitoring a property of an object
//
// @param Object who: the object whose property to not monitor
// @param String what: the name of the property to not monitor
//
// See also: Debug.monitor
//---
Debug.unmonitor = function(who, what) {
  // Object.unwatch is Flash-specific
  return who.unwatch(what);
}
