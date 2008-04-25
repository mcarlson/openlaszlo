/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/// Platform-specific monitor support

/**
 * Monitor a property of an object
 *
 * Will monitor the named property of the object and print a message
 * to the Debug console each time it is modified.  The message
 * includes a timestamp, the function that modified the property, the
 * object and property, and the old and new values.
 *
 * If backtraces are enabled, inspecting the message will reveal the
 * call chain that caused the modification.
 *
 * @param Object who: the object whose property to monitor
 * @param String what: the name of the property to monitor
 *
 * @see Debug.unmonitor
 */
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

/**
  * Stop monitoring a property of an object
  *
  * @param Object who: the object whose property to not monitor
  * @param String what: the name of the property to not monitor
  *
  * @see Debug.monitor
  */
Debug.unmonitor = function(who, what) {
  // Object.unwatch is Flash-specific
  return who.unwatch(what);
}

// Copyright 2001-2006, 2008 Laszlo Systems, Inc.  All Rights Reserved.  Use
// is subject to license terms.

