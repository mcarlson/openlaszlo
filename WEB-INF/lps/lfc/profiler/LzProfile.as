/******************************************************************************
 * LzProfile.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// This file is conditionally loaded by the compiler as part of the core when
// 'profile' is true.

// Profiler globals and stubs that let us profile early on.

// Don't profile the profiler
#pragma 'profile=false'

//---
// Typically there will be only one instance of the LzProfiler class.
// It is used to accumulate profiling statistics and send them to a
// listener on the specified host.
//
// Code compiled with <code>pragma 'profile=true'</code> will record
// function call and return information into the profiler class named
// <code>$lzprofiler</code>.  Profiling can be dynamically
// disabled/enabled by assigning an <code>LZProfiler</code> instance
// to <code>$lzprofiler</code>.
//
// @keywords private
//
// param String host: The host to send the profile data to.  Defaults
// to the local host.
// param String port: The port to connect to the host on.  Defaults
// to 4444.
//
// return Object: A profiler object.
//---
LzProfiler = function (host, port) {
  this.url = LzBrowser.getLoadURLAsLzURL();

  if (host) {
    this.host = host;
  } else {
    // Get the host we were loaded from, as that is the only host we
    // are allowed to talk to (and the one we want to talk to).
    this.host = this.url.host;
  }
  if (port) {
    this.port = port;
  } else {
    // TODO: [2003-03-24 ptw] Is there a better default?
    this.port = 4444;
  }
  // event buffers: this structure is based on measurements of the Flash
  // engine which show that the fastest way to accumulate things is into
  // an object at unique keys (as opposed to appending to an array!)
  this.calls = {};
  this.events = {}
  this.returns = {};
  // double buffers: these buffers are what get emptied by the idle
  // loop
  this.callBuffer = {};
  this.eventBuffer = {}
  this.returnBuffer = {};
  // Last ticker.  Used ensure monotonicity of (new Date).getTime()
  this.tick = 0;

  // Ensure socket is open
  if (! this.socket) {
    this.open();
  }

  // Write the header
  this.log("Profiling: " + _root._url);
  this.log("Date: " + (new Date).toString());
  this.log("Flash Player version: " + _root.$version);
  this.lpsVersionDone = false;
}

//---
// Insert an event into the profiler log
//
// Logs a descriptive string with a timestamp to the profiler event
// buffers.  These events will be dumped to the log with the key 'V'.
//
// @param String description: a descriptive string that will be
// logged.
//
// @param 'calls'|'returns'|'events' buffer: The event buffer to log
// to.  default 'events'.
//---
LzProfiler.prototype.event = function (description, buffer) {
#pragma 'warnUndefinedReferences=false'
    var $lzsc$lzp = _root['$lzprofiler'];
    if ($lzsc$lzp) {
        if (arguments.length < 2) { buffer = 'events'; }
        var $lzsc$tick = $lzsc$lzp.tick;
        var $lzsc$now = (new Date).getTime();
        while ($lzsc$tick == $lzsc$now) {
            $lzsc$now += 0.01;
        }
        $lzsc$lzp.tick = $lzsc$now;
        $lzsc$lzp[buffer][$lzsc$now] = description;
    }
}

//---
// @keywords private
//---
LzProfiler.prototype.flashPlayerVesion = function () {
  var playerVersion = _root.$version;

// How to decompose the version string:
//   var myLength = playerVersion.length;
//   var i = 0;
//   while (i<=myLength) {
//     i = i+1;
//     temp = playerVersion.substring(i, 1);
//     if (temp == " ") {
//       var platform = playerVersion.substring(1, i-1);
//       var majorVersion = playerVersion.substring(i+1, 1);
//       var secondHalf = playerVersion.substring(i+1, myLength-i);
//       var minorVersion = secondHalf.substring(5, 2);
//     }
//   }

  return playerVersion;
}

//---
// Called to open a socket to the profile listener.
//
// @keywords private
//---
LzProfiler.prototype.open = function () {
  if (! this.socket) {
    // Ouput socket
    this.socket = new XMLSocket();
    if (! this.socket.connect(this.host, this.port)) {
      Debug.log("Could not connect to profile listenter " + this.host + ":" + this.port);
    }
  }
}

//---
// Called to write a string to the profile listener.
//
// @keywords private
//
// @param String str: The string to write.
//---
LzProfiler.prototype.log = function (str) {
  // +++ no failure indication?
  this.socket.send(str + "\n");
}

//---
// Called to dump the accumulated profile information.
//
// @keywords private
//---
LzProfiler.prototype.dump = function () {
  with (this) {
    // Limit background processing so player doesn't abort us.  There
    //seems to be a limit both on total time in an idle function and
    //number of loop iterations (or backward branches?) in an idle function
    var loopStart = (new Date).getTime();
    var loopCount;
    var buffersEmpty = true;
    var c = callBuffer;
    var r = returnBuffer;
    var v = eventBuffer;
    var start = loopStart + " S";

    if (! socket) {
      this.open();
    }

    // Output LPS version when we know it
    if ((! this.lpsVersionDone) && _root.canvas.isinited) {
      this.lpsVersionDone = true;
      this.log("LPS version: " + _root.canvas.version);
    }

    // Dump call buffer
    loopCount = 0;
    for (var t in c) {
      buffersEmpty = false;
      if ((loopCount++ > 1000) ||
          (((new Date).getTime() - loopStart) > 4000)) break;
      if (start != null) {
        // Record dump start time (so it can be elided)
        // But only if there are calls to dump
        this.log(start);
        start = null;
      }
      this.log(t + " C " + c[t] + "");
      // done with this entry
      delete c[t];
    }

    // Dump return buffer
    loopCount = 0;
    for (var t in r) {
      buffersEmpty = false;
      if ((loopCount++ > 1000) ||
          (((new Date).getTime() - loopStart) > 4000)) break;
      if (start != null) {
        // Record dump start time (so it can be elided)
        // But only if there are returns to dump
        this.log(start);
        start = null;
      }
      this.log(t + " R " + r[t] + "");
      // done with this entry
      delete r[t];
    }

    // Dump event buffer
    loopCount = 0;
    for (var t in v) {
      buffersEmpty = false;
      if ((loopCount++ > 1000) ||
          (((new Date).getTime() - loopStart) > 4000)) break;
      if (start != null) {
        // Record dump start time (so it can be elided)
        // But only if there are returns to dump
        this.log(start);
        start = null;
      }
      this.log(t + " V " + v[t] + "");
      // done with this entry
      delete v[t];
    }

    // Refill the buffers, if they are empty
    if (buffersEmpty &&
        (((new Date).getTime() - loopStart) < 4000)) {
      var reenable = false;
      var c = calls;
      var r = returns;
      var v = events;
      // Try to atomically grab the event buffers
      if (_root.$lzprofiler === this) {
        _root.$lzprofiler = null;
        reenable = true;
      }
      this.events = {};
      this.returns = {};
      this.calls = {};
      if (reenable) {
        _root.$lzprofiler = this;
      }
      this.callBuffer = c;
      this.returnBuffer = r;
      this.eventBuffer = v;
    }

    // Record dump end time, if you started, if nothing was processed,
    // buffers are empty, so refill them
    if (start == null) {
      this.log((new Date()).getTime() + " E");
    }
  }
}

//---
// Default profiler object.
//
// See <code>LzProfiler</code>.
//
// @keywords private
//---
_root.$lzprofiler = new LzProfiler();

// Turn profiling back on
#pragma 'profile=true'
