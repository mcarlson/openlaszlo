/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/******************************************************************************
 * LzMessage.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// Messages for the LaszloDebugger

//---
// A message is a string with annotations for the objects represented.
//
// @param String message: initial message
//---
LzMessage = function (message) {
// A Message would like to be a subclass of string, but mutable
//   // Work around compiler deficiency
//   if ($flasm) {
//       "push 'message'"
//       "getVariable"
//       "push 1"
//       "push 'super'"
//       "callFunction"
//       "pop"
//   } else {
//     super(message);
//   }
  // defaulted in prototype
  if (arguments.length > 0) {
    this.message = message;
  }
  // can't be in prototype as it would be shared
  // could be a getter to defer allocation
  this.objects = [];
}

// A Message would like to be a subclass of string, but mutable
// The easy way does not work
// LzMessage.prototype = new String();
// // Work around Flash deficiency...
// LzMessage.prototype.constructor = LzMessage;

// The hard way
LzMessage.prototype.__proto__ = String.prototype;
LzMessage.prototype.message = '';
//---
// Implements String interface
// @keywords private
//---
LzMessage.prototype.__get__length = function () { return this.message.length; }
//---
// Implements String interface
// @keywords private
//---
LzMessage.prototype.__set__length = function (length) { this.message.length = length; return this.__get__length(); }
// Install those (swf-runtime specific)
LzMessage.prototype.addProperty('length', LzMessage.prototype.__get__length, LzMessage.prototype.__set__length);
//---
// Implements String interface
// @keywords private
//---
LzMessage.prototype.charAt = function () { return this.message.charAt.apply(this, arguments); }
//---
// Implements String interface
// @keywords private
//---
LzMessage.prototype.charCodeAt = function () { return this.message.charCodeAt.apply(this, arguments); }
//---
// Implements String interface
// @keywords private
//---
LzMessage.prototype.indexOf = function () { return this.message.indexOf.apply(this, arguments); }
//---
// Implements String interface
// @keywords private
//---
LzMessage.prototype.lastIndexOf = function () { return this.message.lastIndexOf.apply(this, arguments); }
//---
// Implements String interface
// @keywords private
//---
LzMessage.prototype.toLowerCase = function () {
  var msg = new LzMessage(this.message.toLowerCase.apply(this, arguments));
  msg.objects = this.objects.concat();
  return msg;
}
//---
// Implements String interface
// @keywords private
//---
LzMessage.prototype.toUpperCase = function () {
  var msg = new LzMessage(this.message.toUpperCase.apply(this, arguments));
  msg.objects = this.objects.concat();
  return msg;
}
//---
// Implements String interface
// @keywords private
//---
// Barf: apply does not work for toString or valueOf !?!?!
LzMessage.prototype.toString = function (radix) { return this.message.toString(radix); }
//---
// Implements String interface
// @keywords private
//---
// Barf: apply does not work for toString or valueOf !?!?!
LzMessage.prototype.valueOf = function () { return this.message.valueOf(); }
//---
// Implements String interface
// @keywords private
//---
LzMessage.prototype.concat = function () { 
  var msg = new LzMessage(this.message.concat.apply(this, arguments));
  var offset = 0;
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (arg instanceof LzMessage) {
      var ao = arg.objects;
      for (var j = 0; j < ao.length; j++) {
        var od = ao[j];
        msg.objects.push({id: od.id, start: od.start+offset, end: od.end+offset});
      }
    }
    offset += String(arg).length;
  }
  return msg;
}
//---
// Implements String interface
// @keywords private
//---
// TODO: [2005-06-23 ptw] Make these methods maintain the objects array
LzMessage.prototype.slice = function () { return this.message.slice.apply(this, arguments); }
//---
// Implements String interface
// @keywords private
//---
// TODO: [2005-06-23 ptw] Make these methods maintain the objects array
LzMessage.prototype.split = function () { return this.message.split.apply(this, arguments); }
//---
// Implements String interface
// @keywords private
//---
// TODO: [2005-06-23 ptw] Make these methods maintain the objects array
LzMessage.prototype.substr = function () { return this.message.substr.apply(this, arguments); }
//---
// Implements String interface
// @keywords private
//---
// TODO: [2005-06-23 ptw] Make these methods maintain the objects array
LzMessage.prototype.substring = function () { return this.message.substring.apply(this, arguments); }

//---
// Appends str to the message.  If obj is passed, it is recorded as an
// annotation permitting the object corresponding to the string to be
//recovered.
//
// @keywords private
//
// @param String str: the representation of an object
// @param Object obj: the object represented, or null
//---
LzMessage.prototype.appendInternal = function (str, obj) {
 if (arguments.length < 2) {
    var id = null;
  } else {
    var id = _root.__LzDebug.IDForObject(obj);
  }
  if (id == null) {
    this.message += str;
  } else {
    var start = this.message.length;
    this.message += str;
    var end = this.message.length;
    this.objects.push({id: id, start: start, end: end});
  }
}

//---
// Approximates `\+` for Messages
//
// A string representation of each argument is appended to the
// message.  Objects are recorded in a fashion that will enable the
// representation to be linked back to the object.
//
// @param any... args: the arguments to append to the initial message
//
// @keywords private
//---
LzMessage.prototype.append = function (args) {
  var len = arguments.length;
  for (var i = 0; i < len; i++) {
    var arg = arguments[i];
    // pretty, no limit
    var str = _root.__LzDebug.__String(arg, true, Infinity);
    if ((arg instanceof Object) || (_root.__LzDebug.IDForObject(arg) != null)) {
      // annotate objects and things you have ID'd
      this.appendInternal(str, arg);
    } else {
      this.appendInternal(str);
    }
  }
}

//---
// Convert a String to HTML for display in the Debugger by escaping
// the HTML characters in the String.
// @keywords private
//---
String.prototype.toHTML = function () {
  return _root.__LzDebug.xmlEscape(this);
}

//---
// Convert a Message to HTML for display in the Debugger generating
// links for each object represented.
// @keywords private
//---
LzMessage.prototype.toHTML = function () {
  var msg = this.message;
  var base = 0;
  var limit = msg.length;
  var start = 0;
  var end = 0;
  var objs = this.objects
  var id;
  var html = '';
  var len = objs.length;
  for (var i = 0; i < len; i++) {
    var annot = objs[i];
    start = annot.start;
    end = annot.end;
    id = annot.id;
    html += msg.substring(base, start).toHTML();
    // Flash-specific: c.f., Debug.makeObjectLink
    html += '<a href="asfunction:_root.Debug.displayObj,' + id + '"><font color="#0000FF">';
    html += msg.substring(start,end).toHTML();
    html += '</font></a>';
    base = end;
  }
  html += msg.substring(base, limit).toHTML();
  return html;
}

// Mimic built-in class, which hides all prototype methods
ASSetPropFlags(LzMessage.prototype, null, 1);

//---
// A Warning wraps a message with a file and line number
//
// @param String file: filename or null
// @param Number line: line number or null
// @param LzMessage message: the warning message
//
// See also: LzWarning.format
//---
LzWarning = function (file, line, message) {
  switch (arguments.length) {
    case 0:
      file = null;
    case 1:
      line = null;
    case 2:
      message = '';
  }
  this.file = file;
  this.line = line;
  if (message instanceof _root.LzMessage) {
    this.message = message;
  } else {
    this.message = new _root.LzMessage(message);
  }
  // Append a backtrace if there is one -- skip 3 (warning, this, and
  // constructor frames)
  if (_root.__LzDebug['backtraceStack']) {
    if (_root.__LzDebug.backtraceStack.length > 3) {
      this.backtrace = _root.__LzDebug.backtrace(3);
    }
  }
}

//---
// Create a warning from a format string
//
// @param String file: filename or null
// @param Number line: line number or null
// @param String control: a format control string
// @param any... args: the arguments to the format control
//
// See also: Debug.format
//---
LzWarning.format = function (file, line, control, args) {
  switch (arguments.length) {
    case 0:
      file = null;
    case 1:
      line = null;
  }
  var message;
  if (arguments.length <= 2) {
    message = '';
  } else {
    var debug = _root.__LzDebug;
    message = debug.formatToString.apply(debug, arguments.slice(2));
  }
  return new this.prototype.constructor(file, line, message);
}

LzWarning.prototype.type = 'WARNING';

//---
// Internal implementation of toString and toHTML
// @keywords private
//---
LzWarning.prototype.toStringInternal = function (conversion) {
  var str = this.type + ':';
  if (this.file) {
    str += ' ';
    str += this.file;
    str += ':';
    if (this.line) {
      str += this.line;
      str += ':';
    }
  }
  str += ' ';
  str += this.message[conversion]();
  return str;
}

//---
// Convert a Warning to a String
//---
LzWarning.prototype.toString = function () {
  return this.toStringInternal('toString');
}

//---
// Convert a Warning to HTML
//---
LzWarning.prototype.toHTML = function () {
  // make the entire warning object inspectable
  var id = _root.__LzDebug.IDForObject(this);
  // Flash-specific: c.f., Debug.makeObjectLink
  var str = '<a href="asfunction:_root.Debug.displayObj,' + id + '"><font color="#FF0000">';
  str += this.toStringInternal('toHTML');
  // close tags, also emit a newline
  str += '</font></a>\n';
  return str;
}

//---
// An Error is a warning with the tag 'ERROR'
//---
LzError = function(file, line, message) {
  // super.apply(arguments);
  LzWarning.apply(this, arguments);
}

LzError.prototype = new LzWarning();
LzError.prototype.constructor = LzError;
LzError.format = LzWarning.format;
LzError.prototype.type = 'ERROR';
