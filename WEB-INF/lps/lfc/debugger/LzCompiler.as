/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/******************************************************************************
 * LzCompiler.as
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// Global functions that are called by the compiler when debug is true

// Loaded first so that source warnings can work as soon as possible
// in the LFC.

// Base warning function
$reportSourceWarning = function (filename, lineNumber, msg) {
#pragma "warnUndefinedReferences=false"
  // Trim compiler lossage
  if (filename.substring(0,1) == '"') {
    filename = filename.substring(1,filename.length-1);
  }
  var warning;
  // Very early on, you don't have anything
  if (_root.LzWarning) {
    warning = new _root.LzWarning(filename, lineNumber, msg);
  } else {
    warning = 'WARNING: ' + filename + ':' + lineNumber + ': ' + msg;
  }
  if (_root.__LzDebug.sourceWarningHistory[warning]) {
    return;
  }
  _root.__LzDebug.sourceWarningHistory [warning] = true;

  if (_root.__LzDebug.remoteDebug) {
    if (_root.__LzDebug.inEvalRequest) {
      _root.__LzDebug.xmlwarnings.push([filename, lineNumber, msg]);
    } else {
      _root.__LzDebug.sockWriteWarning(filename, lineNumber, msg);
    }
  } else if (_root.__LzDebug.consoleDebug) {
      _root.__LzDebug.cdSendMsg(warning);
  } else {
    _root.Debug.freshLine();
    // Logs and adds
    _root.Debug.__write(warning);
  }
}

// Each of the warnings that the compile may call maintains a flag to
// avoid recursing (e.g., when the debugger has a bug).

// TODO: [2003-01-08 ptw] Consider a fall-back mechanism for getting
// debugger bugs reported.

function $reportUndefinedObjectProperty (filename, lineNumber, propertyName) {
#pragma "warnUndefinedReferences=false"
  if (! arguments.callee._dbg_recursive_call) {
      arguments.callee._dbg_recursive_call = true;
      $reportSourceWarning(filename, lineNumber, "undefined object does not have a property '" + propertyName + "'");
      arguments.callee._dbg_recursive_call = false;
  }
}
$reportUndefinedObjectProperty._dbg_recursive_call = false;

function $reportUndefinedProperty (filename, lineNumber, propertyName) {
#pragma "warnUndefinedReferences=false"
  if (! arguments.callee._dbg_recursive_call) {
    arguments.callee._dbg_recursive_call = true;
    $reportSourceWarning(filename, lineNumber, "reference to undefined property '" + propertyName + "'");
    arguments.callee._dbg_recursive_call = false;
  }
}
$reportUndefinedProperty._dbg_recursive_call = false;

function $reportUndefinedVariable (filename, lineNumber, variableName) {
#pragma "warnUndefinedReferences=false"
  if (! arguments.callee._dbg_recursive_call) {
    arguments.callee._dbg_recursive_call = true;
    $reportSourceWarning(filename, lineNumber, "reference to undefined variable '" + variableName + "'");
    arguments.callee._dbg_recursive_call = false;
  }
}
$reportUndefinedVariable._dbg_recursive_call = false;

function $reportNotFunction(filename, lineNumber, name, value) {
#pragma "warnUndefinedReferences=false"
  if (! arguments.callee._dbg_recursive_call) {
    arguments.callee._dbg_recursive_call = true;
    var msg = "call to non-function";
    if (typeof name == "string")
        msg += " '" + name + "'";
    msg += " (type '" + typeof value + "')";
    if (typeof value == "undefined") {
        msg = "call to undefined function";
        if (typeof name == "string")
            msg += " '" + name + "'";
    }
    $reportSourceWarning(filename, lineNumber, msg)
    arguments.callee._dbg_recursive_call = false;
  }
}
$reportNotFunction._dbg_recursive_call = false;

function $reportUndefinedMethod(filename, lineNumber, name, value) {
#pragma "warnUndefinedReferences=false"
  if (! arguments.callee._dbg_recursive_call) {
    {
      arguments.callee._dbg_recursive_call = true;

      var msg = "call to non-method";
      if (typeof name == "string")
        msg += " '" + name + "'";
      msg += " (type '" + typeof value + "')";
      if (typeof value == "undefined") {
        msg = "call to undefined method";
        if (typeof name == "string")
          msg += " '" + name + "'";
      }
      $reportSourceWarning(filename, lineNumber, msg);
    }
    {
      arguments.callee._dbg_recursive_call = false;
    }
  }
}
$reportUndefinedMethod._dbg_recursive_call = false;

