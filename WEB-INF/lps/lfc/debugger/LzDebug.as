/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/******************************************************************************
 * LzDebug.as
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// This file is conditionally loaded by the compiler as part of the
// core when debug is true.

// Debugger globals and stubs that let us debug early on.  Debug will
// be overwritten when the debugger proper is loaded and instantiated.

// We need to have something to handle Debug.write() methods, bound to
// the global 'Debug', and we need it before the debugwindow above
// ever gets insantiated, so we can catch calls to Debug.write() early
// on.

//=============================================================================
// The Laszlo debugger.  Automatically created when an application is
// compiled in debug mode (requested by either using the
// <code>canvas</code> <code>debug='true'</code> attribute or by loading the
// application using the <code>?debug=true</code> option).
//
// @keywords private_constructor
//=============================================================================
// Initial value, will be surgically implanted in the component
// debugger whent thatn is created (this becomes the __proto__ for the
// component debugger so that it inherits any methods that it does not
// override.
Debug = new Object;

//***
// N.B.: Define __write and addText ASAP, so sourceWarnings can work
// as soon as possible
//
// Ordering of next few properties is crucial to making warnings work
// early on.
//***

// Hash to avoid printing duplicate warnings (e.g., when a warning is
// in a loop)
Debug.sourceWarningHistory = [];

// Messages that will be displayed once the debug window is insantiated
// Messages are either LzMessage's or LzWarning's that can be output
// using .toString() or .toHTML(), depending on the destination (log
// file or debug window, respectively)
Debug.saved_msgs = [];

//---
// @keywords private
//---
Debug.addText = function (msg) {
  this.saved_msgs.push(msg);
}

// The compiler may set a var called _dbg_log_all_writes, which tells
// us to send a copy of any Debug.write() to the server for logging.
var _dbg_log_all_writes = false;

//---
// While loading, stuff all Debug.write messages into a list, to be
// printed (and optionally sent to server log) when the full Debugger
// class is instantiated.
// @keywords private
//---
Debug.__write = function (msg) {
  if (_root._dbg_log_all_writes) {
    this.__log(msg);
  }
  this.addText(msg);
}

// This alias is usd to refer to the LFC debugger while doing the
// surgery
var __LzDebug = Debug;

// True until the window debugger is fully loaded
Debug.isLoading = true;

// See yourself
__LzDebug._dbg_name = '__LzDebug';

// Silence complaints about _ in the debugger component history
// maintainer
// TODO: [2004-06-22 ptw] Make this a local to __LzDebug
_root._ = null;

// Make MovieClips have nice names
//
// shut up the dumb doc tool
// @keywords private
MovieClip.prototype._dbg_name = function () { return String(this); };

(function () {
  // Make SWF player native prototypes print nicely
  //
  // N.B. function expression avoids vars polluting _root with vars
  //
  // TODO: [2005-06-01 ptw] Rename name to _dbg_name and make it
  // unenumerable
  var nativeObjects = {
    // ECMA objects
    Array: true,
    Boolean: true,
    Date: true,
    Function: true,
    Math: true,
    Number: true,
    Object: true,
    RegExp: true,
    String: true,
    Error: true,
    EvalError: true,
    RangeError: true,
    ReferenceError: true,
    SyntaxError: true,
    TypeError: true,
    URIError: true,
    // swf objects
    Camera: true,
    Color: true,
    Button: true,
    LocalConnection: true,
    LoadVars: true,
    Microphone: true,
    MovieClip: true,
    SharedObject: true,
    Sound: true,
    TextField: true,
    TextFormat: true,
    XML: true,
    XMLNode: true,
    XMLSocket: true
  };
  function fixupNativeObject (name, obj) {
    // name it
    obj.name = String(name);
    // fix constructors
    if (typeof(obj) == 'function') {
      if (obj.hasOwnProperty('prototype')) {
        if (! obj.prototype.hasOwnProperty('constructor')) {
          obj.prototype.constructor = obj;
        }
      }
    }
    // name class and prototype methods
    var what = [obj];
    if (obj['prototype']) { what.push(obj.prototype); }
    var enumerableSlots;
    for (var i = 0; i < what.length; i++) {
      var x = what[i];
      enumerableSlots = new Array();
      // Accumulate list of enumerable slots before annotating
      for (var s in x) {
        if (x.hasOwnProperty(s)) {
          enumerableSlots.push(s);
        }
      }
      // reveal all slots
      ASSetPropFlags(x, null, 0, 1);
      for (var key in x) {
        if (x.hasOwnProperty(key)) {
          var val = x[key];
          // Name native methods
          if (val instanceof Function) {
            // Don't rename yourself (the constructor)
            if (! val.hasOwnProperty('name')) {
              val.name = name + '.' + key;
            }
          }
        }
      }
      // Reset the enumerability
      // Make everything unenumerable, and then expose your saved list
      ASSetPropFlags(x, null, 1, 1);
      ASSetPropFlags(x, enumerableSlots, 0, 1);
    }
  };
  for (var name in nativeObjects) {
    var obj = eval(name);
    // Not all runtimes have all of the native objects defined.
    if (typeof obj == 'function') {
      fixupNativeObject(name, obj);
    }
  }
})();


//=============================================================================
// @keywords private
// XML escape
//=============================================================================
Debug.xmlEscape = function (ts) {
  if ((typeof(ts) == "string") || (ts instanceof String)) {
    var outstr = "";
    var tlen = ts.length;
    for (var i = 0; i < tlen; i++) {
      var c = ts.charAt(i);
      if (c == '<') {
        outstr += "&lt;";
      } else if (c == '>') {
        outstr += "&gt;";
      } else if (c == '&') {
        outstr += "&amp;";
      } else {
        outstr += c;
      }
    }
    return outstr;
  } else {
    return ts;
  }
}

//---
// Array and Object literals have a constructor slot instead of a
// __constructor__.  Work around that.
//
// @param obj:Object The object to find the constructor of
// @return Function|Null the contstructor, or null if there isn't
// one
//---
Debug.constructorOf = function (obj) {
  if (obj instanceof Object) {
    if (obj.hasOwnProperty('__constructor__')) {
      return obj.__constructor__;
    }
    else if (obj.hasOwnProperty('constructor')) {
      return obj.constructor;
    }
  }
  return null;
}

//---
// Compute an informative type string for debugging.
//
// Classes and instances can define their own _dbg_typename method
// (which must return a string) or property (which must be a string)
// to override the default behavior.
//
// This function returns the first of the following values:
// - thing._dbg_typename(), if thing._dbg_typename is a function and
//   returns a non-null value.
// - thing._dbg_typename, if it's a string.
// - the __proto__'s constructor name, which should reflect instanceof
// if it does not, the reputed type will be enclosed in ?'s,
// indicating a possibly corrupted object
// - as a last resort: typeof(thing)
//
// If the prototype is is a complex prototype (if it is not the
// constructor prototype) a unique ID (of the prototype) is appended.
//
// If the object has a length, that is appended in parentheses.
//
// @param thing:any The object to find the type of
// @return string representation of the type of thing
//---
Debug.__typeof = function (thing) {
  // default type
  var n = typeof(thing);
  // Refine Object subtypes
  // N.B.: Some SWF runtime objects are not Objects!  Somehow typeof is not
  // computed from __proto__, so don't test `n == 'object'` here
  // N.B.: MovieClip's are not Objects, so handle them in parallel
  if ((thing instanceof Object) || (thing instanceof MovieClip)) {
    var op = thing['__proto__'];
    var oc = this.constructorOf(thing);
    // this should be the same as thing['__constructor__']
    var opc = op['constructor'];
    var opcp = opc['prototype'];

    // Check for user typename
    var user_name = null;
    if (thing['_dbg_typename'] instanceof Function) {
      user_name = thing._dbg_typename();
    } else if (typeof(thing._dbg_typename) == 'string') {
      user_name = thing._dbg_typename;
    }
    // No or invalid user typename, use constructor
    if (typeof(user_name) == 'string') {
      n = user_name;
    } else if (opc instanceof Function) {
      if (opc.hasOwnProperty('name')) {
        n = this.functionName(opc, true);
        // Uniquify non-global prototypes
        if (! n) {
          n = this.functionName(opc, false);
          var id = this.IDForObject(opc);
          n += '#' + id;
        }
      }
    }
    // verify instanceof
    if (! (thing instanceof opc)) {
      // prototype
      if (thing === opcp) {
        // What is the right type for a prototype?
        // For now, let it be
      } else {
        // Enclose questionable types in question marks
        n = '\u00bf' + n + '?';
      }
    }
    // verify __constructor__
    if (oc) {
      if (oc !== opc) {
        // prototype
        if (thing === oc.prototype) {
          // What is the right type for a prototype?
          // For now, let it be
        } else {
          // Enclose questionable types in exclamation marks
          n = '\u00a1' + n + '!';
        }
      }
    }
    if (op && (op !== Object.prototype) && (op !== opcp)) {
      // Uniquify other prototypes
      var id = this.IDForObject(op);
      n += '#' + id;
    }
  } else if ((n == 'object') || (n == 'movieclip')) {
    // an object that is not an Object or a movieclip that is not a
    // MovieClip is questionable
    n = '\u00bf' + n + '?';
  }

  // Show dimensions, if applicable
  if (typeof(thing.length) == 'number') {
    n += '(' + thing.length + ')';
  }
  return n;
}


//---
// Compute a function name if you can
//
// @param Boolean global: if true, will only return the name if it is
// a global name.
//
// @keywords private
//---
Debug.functionName = function (fn, global) {
  if (fn instanceof Function) {
    if (fn.hasOwnProperty('name')) {
      var n = fn.name;
      if ((! global) || (fn === eval(n))) {
        // Trim for readability
        if (n.indexOf('_root.') == 0)
          n = n.substring('_root.'.length);
        var pi = n.indexOf('.prototype.');
        if (pi > 0) {
          n = n.substring(0, pi) + n.substring(pi + '.prototype'.length);
        }
        return n;
      }
    }
    // See if it might be a constructor (LZX classname slot)
    if (fn.hasOwnProperty('classname')) {
      var c = fn.classname;
      if ((! global) || (fn === _root[c])) {
        return c;
      }
    }
  }
  return null;
}

//---
// @keywords private
//---
Debug.displayResult = function (result) {
    if (typeof(result) != 'undefined') {
        // Advance saved results if you have a new one
        if (result !== _level0._) {
            if (typeof(_level0.__) != 'undefined') {
                _level0.___ = _level0.__;
            }
            if (typeof(_level0._) != 'undefined') {
                _level0.__ = _level0._;
            }
            _level0._ = result;
        }
    }
}

//---
// Array of prefixes that indicate internal properties to the
// inspector.  If Debug.showInternalProperties is false, any properties
// with a prefix in this set will not be displayed.
// @keywords private
//---
Debug.internalPropertyPrefixes = [ '$', '__' ];

//---
// Internal property predicate.  Tests to see if str has a prefix in
// Debug.internalPropertyPrefixes.
// @keywords private
//---
Debug.internalProperty = function (str) {
  // Use the component value of this attribute
  var ipp = this.internalPropertyPrefixes;
  for (var key in ipp) {
    if (str.indexOf(ipp[key]) == 0) {
      return true;
    }
  }
  return false;
}

//---
// Debug.inspect will show internal properties if this is true
// (default is false).
//---
Debug.showInternalProperties = false;

//---
// Hash of characters to escape in strings when printPretty is false.
// (These are the ECMAScript SingleEscapeCharacter's for String
// Literals (7.8.4).
// @keywords private
//---
Debug.singleEscapeCharacters = {
  '\\b': '\b',
  '\\t': '\t',
  '\\n': '\n',
  '\\v': '\u000B',              // '\v' gives 'unterminated string'?
  '\\f': '\f',
  '\\r': '\r',
  '\\"': '\"',
  '\\\'': '\'',
  '\\\\': '\\'
};



//---
// Debug.write will truncate the printed representation of any object
// whose length is greater than Debug.printLength (default value
// 1024).
//
// See also: Debug.inspect.printLength
//---
Debug.printLength = 1024;

//---
// Debug.write will print 'pretty' versions of objects if this is
//true (default is true).
//---
Debug.printPretty = true;

//---
// Abbreviate a string
// @param s:String the string to abbreviate
// @param l:Number the desired length, defaults to Debug.printLength
//
// @keywords private
//---
Debug.abbreviate = function(s, l) {
  if (arguments.length < 2) {
      l = this.printLength;
  }
  var ellipsis = '...'; // '\u2026' doesn't work, wah.
  if (s.length > (l - ellipsis.length)) {
    s = s.substring(0, l - ellipsis.length) + ellipsis;
  }
  return s;
}

//---
// Escape a string
// @param s:String the string to abbreviate
//
// @keywords private
//---
Debug.stringEscape = function (s) {
  // Have to handle '\\' first.
  s = s.split('\\').join('\\\\');
  var np = this.singleEscapeCharacters;
  for (var rep in np) {
    var ch = np[rep];
    if (ch != '\\') {
      s = s.split(ch).join(rep);
    }
  }
  return s;
}

//---
// Coerce to an informative string for debugging
//
// Singleton types and atomic types are represented by
// themselves.  Strings are quoted.  Other types are printed as a type
// followed by a description.  By default an object is described by
// its properties, a function by its name (if available).  Objects are
// given an id that can be used to distinguish and inspect them.
//
// Classes and instances may define their own _dbg_name method (which
// must return a string) or property (which must be a string) to
// override the default description.
//
// @param any thing: The object to coerce to a string
// @param Boolean pretty: return a 'prettier' (but possibly ambiguous)
// representation, default false.
// @param Number limit: don't return a string longer than, default
// Debug.pringLength
// @return String representation of the thing
//---
Debug.__String = function (thing, pretty, limit) {
  switch (arguments.length) {
    case 1:
      pretty = this.printPretty;
    case 2:
      limit = this.printLength;
  }
  // Evade infinite recursion
  if (limit <= 0) return '';
  var t = typeof(thing);
  var debug_name = null;
  var s = '';

  // Look for prototype objects first, or you may be confused by
  // calling _dbg_name on the prototype
  // Some SWF runtime objects are not Objects!
  if ((t == 'object') || (thing instanceof Object)) {
    // Bind printLength short while calling user methods
    var opl = this.printLength;
    this.printLength = (limit < this.inspect.printLength)?limit:this.inspect.printLength;
    var tc = thing['constructor'];
    if ((tc instanceof Function) &&
        (thing === tc.prototype) &&
        (this.functionName(tc, false) != null)) {
      debug_name = this.functionName(tc, false) + '.prototype';
    } else if (thing['_dbg_name'] instanceof Function) {
      debug_name = thing._dbg_name();
    } else if (typeof(thing._dbg_name) == 'string'
               || (debug_name instanceof String)) {
      debug_name = thing._dbg_name;
    }
    this.printLength = opl;
  }
  if ((typeof(debug_name) == 'string') || (debug_name instanceof String)) {
    // If the debug name does not start with '#' (indicating that it
    // is a global ID), turn pretty off
    if (debug_name.charAt(0) != '#') {
      pretty = false;
    }
    // User method returned a valid answer
    // Sanitize it
    s = this.stringEscape(debug_name);
  } else if (t == 'undefined') {
    // Empty type
    return '\u00ABundefined\u00BB';
  } else if ((t == 'null') || (t == 'number') || (t == 'boolean')) {
    // Primitive types with print/read consistency print as pretty,
    // unless abbreviated below
    pretty = true;
    s = String(thing);
  } else if ((t == 'string') || thing instanceof String) {
    // No pretty for subclasses
    if (thing instanceof String && thing.__proto__ !== String.prototype) {
      pretty = false;
    }
    // abbreviate rep if necessary
    s = this.abbreviate(thing, limit);
    // if you abbreviate, don't be pretty
    if (s !== thing) { pretty = false; }
    // escape non-printing controls that otherwise are
    // indistinguishable
    if (! pretty) {
      s = this.stringEscape(s);
    }
    // print/read consistency
    var prc = (s === thing);
    if (! pretty) {
      s = '"' + s + '"';
    }
    // If you still have print/read consistency, stop here
    if ((t == 'string') && prc) {
        return s;
    }
    // Long strings and String objects get an ID so they can be
    // inspected
    this.IDForObject(thing, true);
  } else if (t == 'function') {
    var n = this.functionName(thing, pretty);
    if (n != null) {
      s = n;
    } else {
      // not a global function, don't be pretty
      pretty = false;
      s = this.functionName(thing, pretty);
      if (s == null) { s = ''; }
    }
  } else if ((t == 'object') || (thing instanceof Object)) {
    var op = thing.__proto__;
    // No pretty if object.__constructor__ is not
    // object.__proto__.constructor, as this indicates some sort of
    // bizarre object
    if (this.constructorOf(thing) !== op.constructor) {
      pretty = false;
    }
    // Catch wrappers (but not subtypes of wrappers)
    if (op === Date.prototype ||
        op === Boolean.prototype ||
        op === Number.prototype) {
      // Show the unwrapped value
      // Don't use String(), because that yields "[type Object]" for
      // broken instances, whereas toString() will return undefined.
      s = thing.toString();
      if (s == null) { s = ''; }
    }
    else if (thing instanceof String) {
      // handled above, but don't fall into array
    }
    // Print arrays (actually, anything with a numeric length
    // property) in abbreviated format (what about arrays that have
    // non-numeric props?)
    else if (typeof(thing.length) == 'number') {
      // No pretty for subclasses or non-arrays
      if (op !== Array.prototype) {
        pretty = false;
      }
      var ellip = true;
      var tl = thing.length
      // Don't accumulate beyond limit
      for (var e = 0; (e < tl) && (s.length < limit); e++) {
        // skip non-existent elements
        if (typeof(thing[e]) == 'undefined') {
          if (ellip) {
            s += '..., ';
            ellip = false;
          }
        } else {
          ellip = true;
          // TODO: [2005-06-22 ptw] Use __String in case element is huge
          s += String(thing[e]) + ', ';
        }
      }
      if (s != '')
        s = s.substring(0, s.length - 2);
      s = '[' + s + ']';
    }
    // If it has a user-defined toString method, use that, but defend
    // against broken methods
    else if ((thing['toString'] instanceof Function) &&
             (thing.toString !== Object.prototype.toString) &&
             (typeof(thing.toString()) != 'undefined') &&
             (thing.toString() != 'undefined')) {
      // No pretty for these, you don't know if the user toString is
      // uniquifying
      pretty = false;
      s = String(thing);
    }
    // Print unidentified objects as abbreviated list of props
    else {
      // No pretty for subclasses or non-objects
      if (op !== Object.prototype) {
        pretty = false;
      }
      for (var e in thing) {
        // Don't enumerate inherited props, unless you can't tell
        // (i.e., __proto__ chain is broken
        if ((! (thing instanceof Object)) || thing.hasOwnProperty(e)) {
          var v = thing[e];
          var tv = typeof(v);
          var dtv = this.__typeof(v);
          // Ignore "empty" properties and methods, ignore internal
          // slots and slots that have an internal type
          if ((tv != 'undefined') &&
              (tv != 'function') &&
              (('' + v) != '') &&
              (! this.internalProperty(e)) &&
              (! this.internalProperty(dtv))) {
            // TODO: [2005-06-22 ptw] Use __String in case element is huge
            s += '' + e + ': ' + String(v) + ', ';
          }
        }
        // Don't accumulate beyond limit
        if (s.length > limit) break;
      }
      if (s != '')
        s = s.substring(0, s.length - 2);
      s = '{' + s + '}';
    }
  } else {
    // Shouldn't ever get here
    pretty = false;
    s = String(thing);
  }

  if (pretty && (s.length < limit)) {
    return s;
  }
  // Compute id; force if you couldn't print pretty due to
  // abbreviating
  var id = this.IDForObject(thing, s.length >= limit);
  // Build representation
  var r = '\u00AB';             // <<
  r += this.__typeof(thing);
  if (id != null) {r += ('#' + id);}
  // Only abbreviate the description, don't lose the type or ID
  if (s != '') {
    var room = limit - r.length - 6; // '| ' + '...' + '>>'
    if (room > 0) {
      r += '| ';
      r += this.abbreviate(s, room);
    }
  }
  r += '\u00BB'; // >>
  return r;
}


//---
// Implements Debug.write in the core debugger, which will be
// superceded by the component debugger, but the component debugger
// still calls this to do the work.
// @keywords private
//---
Debug.writeInternal = function (objects) {
  var n = arguments.length;
  // Process each value to individually so they can be
  // 'presented' as objects if applicable
  var msg = new _root.LzMessage();
  for (var i = 0; i < n; i++) {
    var arg = arguments[i];
    var sep = ((i == (n-1)) ? '\n' : ' ');
    // Backward compatibility requires a custom version of
    // LzMessage.append: strings are never escaped
    var pretty = (typeof(arg) == 'string') ? true : this.printPretty;
    var str = this.__String(arg, pretty);
    if ((arg instanceof Object) || (this.IDForObject(arg) != null)) {
      // annotate objects and things you have ID'd
      msg.appendInternal(str, arg);
    } else {
      msg.appendInternal(str);
    }
    // separator is always pretty
    msg.appendInternal(sep);
  }
  this.freshLine();
  this.__write(msg);
}

//=============================================================================
// Display one or more objects on the debug console.
//
// <code>Debug.write</code> displays objects on the debug console in
// an informative format.  Simple objects are represented as
// themselves.  Printed Complex objects are represented by their type
// and a concise description.  Long representations (and long Strings)
// are abbreviated if they are longer than Debug.printLength.  Complex
// objects and abbreviated objects presented as links.  Clicking on
// the link will invoke <code>Debug.inspect</code> on the object,
// giving more detail.
//
// @param Object... objects: One or more objects to display.  Multiple
// objects are separated by spaces, so <code>Debug.write("The answer
// is:", 39+3)</code> will display: <code>The answer is: 42</code>
//
// See also <code>Debug.format</code> which allows more control over
// displaying multiple objects.
//=============================================================================
// this will be superceded in the window debugger
Debug.write = Debug.writeInternal

//---
// Display a warning on the console
//
// Takes a format control and any number of arguments.  Cf.,
// Debug.format
//---
Debug.warn = function (control, args) {
  var warning = _root.LzWarning;
  var msg = warning.format.apply(warning, [null, null].concat(arguments));
  this.freshLine()
  this.__write(msg);
}

//---
// Display an error on the console
//
// Takes a format control and any number of arguments.  Cf.,
// Debug.format
//---
Debug.error = function (control, args) {
  var error = _root.LzError;
  var msg = error.format.apply(error, [null, null].concat(arguments));
  this.freshLine();
  this.__write(msg);
}

//=============================================================================
// @keywords private
//=============================================================================
Debug.addHTMLText = Debug.addText;

// The core debugger is always at a fresh line, because it just logs
// the messages.
Debug.atFreshLine = true;

//=============================================================================
// Puts the typeout on a fresh line
// @keywords private
//=============================================================================
Debug.freshLine = function () {
    if (! this.atFreshLine) {
      this.addHTMLText('\n');
    }
}

//=============================================================================
// Send a message to printed to the log file
//
// @param string msg: the message to be logged
//=============================================================================
// Implementation of Debug.log  does not depend on any of
// the LFC working and hence can be used from startup on.
Debug.log = function (msg) {
  // send URL to LzServlet: lzt=eval lz_log=true lz_msg=$MSG
  // Flash-specific variable
  var url = _root._url;
  var q = url.indexOf("?");
  if (q >= 0) {
    url = url.substring(0, q);
  }
  url += "?lz_log=true&lzt=eval&lz_load=false&lz_script="+escape(String(msg));
  this.__line_buffer = "";
  // Flash-specific call -- 5 is magic?!
  loadVariables(url, 5);
}

//---///////////// cheap-o object inspector ////////////////

// Debug ID counter
Debug.objseq = 0;

// Debug ID table
Debug.id_to_object_table = [];

//---
// Return the unique ID for an object either by finding the object in
// the table, or if it is not in the table by creating a new entry and
// ID for it.  Assigns unique names to function objects so they can be
// distinguished.  Normally only objects will be assigned an ID, pass
// force=true to force non-object to be interned.
//
// @param object obj: the object to intern
// @param boolean force: whether to force interning, even if the
// object is not 'interesting'
//
// @keywords private
//---
Debug.IDForObject = function (obj, force) {
  var id;
  var t = typeof(obj);
  for (id = 0; id < this.id_to_object_table.length; id++) {
    if ((this.id_to_object_table[id] === obj) &&
        ((t != 'function') ||
         (obj.name == this.id_to_object_table[id].name))) {
      // Coerce index back to a number, for my sanity
      return id;
    }
  }
  if (!force) {
    // ID anything that has identity
    if ((t != 'object') && (t != 'function') && (t != 'movieclip')) {
      return null;
    }
  }
  id = this.objseq++;
  if ((t == 'function') &&
      ((typeof(obj.name) == 'undefined') ||
       (obj.name.substr(obj.name.length - 2, 2) == '()'))) {
    // Uniquify unamed functions and closure names
    obj.name = obj['name'] + '#' + id;
  }
  this.id_to_object_table[id] = obj;
  return id;
}

//---
// Find the object associated with a particular debug ID
// @keywords private
//---
Debug.ObjectForID = function (id) {
  return this.id_to_object_table[id];
}

//---
// Make a hyperlink to display an object by id, if id is not supplied,
// try to find it first
// @keywords private
//---
Debug.MakeObjectLink = function (obj, id) {
  if (arguments.length < 2) {
    id = this.IDForObject(obj);
  }
  if (id != null) {
    return '<a href="asfunction:_root.Debug.displayObj,' + id + '"><font color="#0000FF">' + obj +"</font></a>";
  }
  return obj;
}

//---
// Body of inspect: print the object and its properties, making links
// for exploring properties that are objects
//
// @keywords private
// @param obj:Object the object to inspect
// @param showInternalProperties:Boolean (optional) whether to display internal
// properties or not.  Defaults to Debug.showInternalProperties
//---
Debug.inspectInternal = function (obj, showInternalProperties) {
  var si = (typeof(showInternalProperties) != 'undefined')?showInternalProperties: this.showInternalProperties;
  var hasProto = (obj['__proto__']);
  var opl = this.printLength;

  // TODO: [2003-09-12 ptw] either bind or pass as option
  // Disable printLength for printing the name of a non-object in case
  // it was abbreviated, otherwise set it short
  if (! ((typeof(obj) == 'object') || (obj instanceof Object))) {
    this.printLength = Infinity;
  } else {
    this.printLength = this.inspect.printLength;
  }
  var name = this.xmlEscape(this.__String(obj));
  // Print properties with abbreviated length
  this.printLength = this.inspect.printLength;
  // Go into detail if showing internals
  if (si) {
    var enumerableSlots = [];
    // Accumulate list of enumerable slots before annotating
    for (var s in obj) {
      if ((! hasProto) || obj.hasOwnProperty(s)) {
        enumerableSlots.push(s);
      }
    }
    // N.B.: Flash-specific hack to get at otherwise unenumerable
    // properties.  This makes all properties enumerable.
    //
    // The first arg is the object to twiddle.  The second argument is
    // a list of slots to twiddle on, or null for all slots.
    // The 3rd arg is a bitmask:
    // 2^2 = writable
    // 2^1 = deletable
    // 2^0 = unenumerable
    // The 4th argument apparently is a bit-mask of the flags you want
    // to change (despite the rumors on the web)
    //
    // So, make all the properties of this object enumerable
    ASSetPropFlags(obj, null, 0, 1);
  }

  var keys = [];
  var arraylen = typeof(obj.length) == 'number' ? obj.length : null;
  if (si) {
    // print 'invisible' properties of MovieClip's
    if (obj instanceof MovieClip) {
      for (var p in {_x: 0, _y: 0, _visible: true, _xscale: 100,
                     _yscale: 100, _opacity: 100, _rotation: 0,
                     _currentframe: 1}) {
        keys.push(p);
      }
    }
  }
  for (var key in obj) {
    // Print only local slots
    if ((! hasProto) ||
        obj.hasOwnProperty(key) ||
        // attached movie clips don't show up as 'hasOwnProperty' (but
        // hasOwnProperty is more accurate -- consider if an instance
        // copies a prototype property)
        (obj[key] !== obj.__proto__[key]) ||
        // or getter slots (this is a heuristic -- there is no way to
        // ask if a property is a getter)
        (obj.__proto__.hasOwnProperty(key) &&
         (typeof(obj.__proto__[key]) == 'undefined'))
        ) {
      // Print array slots later, in order
      if (arraylen && (key >= 0) && (key < arraylen)) {
      } else if (si ||
                 ((! this.internalProperty(key)) &&
                  // Only show slots with internal type if showing
                  // internals
                  (! this.internalProperty(this.__typeof(obj[key]))))) {
        keys.push(key);
      }
    }
  }
  if (si) {
    // Reset the enumerability
    // Make everything unenumerable, and then expose your saved list
    ASSetPropFlags(obj, null, 1, 1);
    ASSetPropFlags(obj, enumerableSlots, 0, 1);
  }

  keys.sort(function (a, b) {
    var al = a.toLowerCase();
    var bl = b.toLowerCase();
    return (al > bl) - (al < bl);
  });
  var description = "";
  var kl = keys.length;
  var val;
  var wid = 0;
  // Align all keys if annotating 'weight'
  if (this.markGeneration > 0) {
    for (var i = 0; i < kl; i++) {
      var kil = keys[i].length;
      if (kil > wid) { wid = kil; }
    }
  }
  if (arraylen) {
    var kil = ('' + arraylen).length;
    if (kil > wid) { wid = kil; }
  }
  // indent
  wid = (wid + 2)
  for (var i = 0; i < kl; i++) {
    var key = keys[i];
    val = obj[key];
    description += this.computeSlotDescription(obj, key, val, wid);
  }

  if (arraylen) {
    for (var key = 0; key < arraylen; key++) {
      val = obj[key];
      // Skip non-existent elements, but don't bother with ellipses,
      // since we are displaying the key here
      if (typeof(val) != 'undefined') {
        description += this.computeSlotDescription(obj, key, val, wid);
      }
    }
  }

  this.printLength = opl;
  // Annotate 'weight' if available
  if (this.markGeneration > 0) {
    var leaked = this.annotation.leaked;
    if ((obj instanceof Object || obj instanceof MovieClip) &&
        (obj.hasOwnProperty instanceof Function) &&
        obj.hasOwnProperty(leaked) &&
        obj[leaked]) {
      name += ' (\u00A3' + obj[leaked] + ')';
    }
  }
  if (description != "") { description = ' {\n' + description + '}'; }
  return name + description;
}

//---
// Compute slot description
// @keywords private
//---
Debug.computeSlotDescription = function (obj, key, val, wid) {
  var r = key + ':';
  // Annotate 'weight' if available
  if (this.markGeneration > 0) {
    var annotation = this.annotation;
    var leaked = annotation.leaked;
    var why = annotation.why;
    var wf = '        ';
    wid += wf.length;
    if ((val instanceof Object || val instanceof MovieClip) &&
        (val.hasOwnProperty instanceof Function) &&
        val.hasOwnProperty(leaked) &&
        val[leaked] &&
        // only print if charged to parent (or parent was not leaked
        ((! obj.hasOwnProperty(leaked)) || (val[why].indexOf(obj[why]) == 0))) {
      r += this.pad(' (\u00A3' + val[leaked] + ')', wf.length);
    } else {
      r += wf;
    }
  }
  var ostr = this.xmlEscape(this.__String(val));
  // Second, in case __String interns an abbreviated object
  var id = this.IDForObject(val);
  r = this.pad(r, wid);
  r += ' ' + this.MakeObjectLink(ostr, id) + '\n';
  return r;
}

//---
// Display the properties of an object on the debug console.
//
// <code>Debug.inspect</code> displays each of the properties of its
// argument object using <code>Debug.write</code>.  Properties that
// have complex values (or long representations that are abbreviated)
// are displayed as links.  Clicking on the link will invoke
// <code>Debug.inspect</code> on that object.
//
// @param Object obj: the object to inspect
// @param Null reserved: reserved for future use
//---
Debug.inspect = function (obj, reserved) {
  var msg = this.inspectInternal(obj, reserved);
  // after computing msg, which may produce warnings or errors
  this.freshLine();
  this.addHTMLText(msg);
  return obj;
}

//---
// Debug.inspect will truncate the printed representation of any properties
// whose length is greater than Debug.inspect.printLength (default value
// 256).
//
// See also Debug.printLength
//---
Debug.inspect.printLength = 256;

// TODO: [2003-12-09 ptw] remove when debug evaluator has with (Debug)
// Backward compatibility
_root.inspect = function (obj, reserved) {
  _root.Debug.warn( 'inspect() is deprecated. ' +
             'Use Debug.inspect() instead.' );
  _root.Debug.inspect(obj, reserved);
}

//---
// @keywords private
// Instantiates an instance of the user Debugger window
__LzDebug.makeDebugWindow = function () {
  _root.LzInstantiateView({attrs: {}, name: "LzDebugWindow"});
}
