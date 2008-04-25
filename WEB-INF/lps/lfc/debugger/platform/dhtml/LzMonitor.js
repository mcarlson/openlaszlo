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
  var o = who[what];
  var s = function (n) {
    // Function.caller is a (Mozilla?) Javascript 1.5 feature
    var c = arguments.callee.caller;
    if ((! c) && (Debug.backtraceStack instanceof Array)) {
      var bs = Debug.backtraceStack;
      c = bs[bs.length - 2].callee;
    }
    Debug.monitorMessage("[%6.2f] %s: %w.%s: %w -> %w",
                         (new Date).getTime() % 1000000,
                         c || '(unknown)',
                         who,
                         what, o, n);
    return o = n;
  };
  var g = function () {
    return o;
  };
  try {
    // Safari gets confused if you don't delete the slot before defining
    // setter/getter
    delete who[what];
    // Object.__defineSetter__ is a Javascript 1.5 feature
    who.__defineGetter__(what, g);
    who.__defineSetter__(what, s);
    // Can't install getter/setter on some built-ins and have `with`
    // work
    with (who) {
      if (eval(what) !== o) {
        throw new Error("Debug.monitor: failed to install functional getter/setter");
      }
    }
  }
  catch (e) {
    Debug.error("Debug.monitor: Can't monitor %s.%s", who, what);
    // Restore status quo
    delete who[what];
    who[what] = o;
  }
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
  var o = who[what];
  // Object.__defineSetter__ is a Javascript 1.5 feature
  // TODO: [2006-10-04 ptw] There does not seem to be a protocol for
  // removing a setter...
  delete who[what];
  who[what] = o;
}

// Copyright 2001-2006, 2008 Laszlo Systems, Inc.  All Rights Reserved.  Use
// is subject to license terms.

