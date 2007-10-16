/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/*
 * Value presentation and inspection
 */

// Silence complaints about _ in the debugger component history
// maintainer
// TODO: [2004-06-22 ptw] Make this a local to Debug
global._ = null;

// Make MovieClips have nice names
//
// shut up the dumb doc tool
/** @access private */
MovieClip.prototype._dbg_name = function () { return String(this); };

(function () {
  // Make SWF player native prototypes print nicely
  //
  // N.B. function expression avoids polluting module with temp vars
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


/**
  * Array and Object literals have a constructor slot instead of a
  * __constructor__.  Work around that.
  * 
  * @param obj:Object The object to find the constructor of
  * @return Function|Null the contstructor, or null if there isn't
  * one
  */
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

/**
  * @access private
  */
Debug.__typeof = function (thing) {
  // default type
  var n = typeof(thing);
  // Refine Object subtypes
  // N.B.: Some SWF runtime objects are not Objects!  Somehow typeof is not
  // computed from __proto__, so don't test `n == 'object'` here
  // N.B.: MovieClip's are not Objects, so handle them in parallel
  if ((thing instanceof Object) || (thing instanceof MovieClip)) {
    var op = thing['__proto__'];
    var oc = thing['constructor'];
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
    if ((typeof(user_name) == 'string') || (user_name instanceof String)) {
      n = user_name;
    } else if (oc instanceof Function) {
      if (oc.hasOwnProperty('name')) {
        n = this.functionName(oc, true);
        // Uniquify non-global prototypes
        if (! n) {
          n = this.functionName(oc, false);
          var id = this.IDForObject(oc);
          n += '#' + id;
        }
      }
    }
    // verify instanceof
    if (! (thing instanceof oc)) {
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
      if (op !== oc.prototype) {
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
    // This doesn't work in the new class system
//     if (op && (op !== Object.prototype) && (op !== opcp)) {
//       // Uniquify other prototypes
//       var id = this.IDForObject(op);
//        n += '#' + id;
//     }
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


/**
  * @access private
  */
Debug.functionName = function (fn, mustBeUnique) {
  if (fn instanceof Function) {
    if (fn.hasOwnProperty('_dbg_name') || fn.hasOwnProperty('name')) {
      var n = fn.hasOwnProperty('_dbg_name') ? fn._dbg_name : fn.name;
      if ((! mustBeUnique) || (fn === eval(n))) {
        return n;
      }
    }
  }
  return null;
};

/**
  * @access private
  */
Debug.__String = function (thing, pretty, limit, unique) {
  switch (arguments.length) {
    case 1:
      pretty = this.printPretty;
    case 2:
      limit = this.printLength;
    case 3:
      unique = !pretty;
  }
  // Evade infinite recursion
  if (limit <= 0) return '';
  var t = typeof(thing);
  var debug_name = null;
  var s = '';

  // Some SWF runtime objects are not Objects!
  if ((t == 'object') || (thing instanceof Object)) {
    // Bind printLength short while calling user methods
    var opl = this.printLength;
    this.printLength = (limit < this.inspect.printLength)?limit:this.inspect.printLength;
    // Look for prototype objects first, or you may be confused by
    // calling _dbg_name on the prototype
    // NOTE: [2007-01-12 ptw] Class.make gives all prototype
    // objects a `_dbg_typename` property. which most objects will not
    // have.
    var ac = Class.allClasses;
    if (thing instanceof Object && thing.hasOwnProperty('_dbg_typename')) {
      for (var cn in ac) {
        if (thing === ac[cn].prototype) {
          debug_name = '.prototype';
          break;
        }
      }
    }
    if (debug_name) {
      // all done
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
      pretty = (! unique);
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
      pretty = (! unique);
    }
    // abbreviate rep if necessary
    s = this.abbreviate(thing, limit);
    // print/read consistency
    var prc = (s === thing);
    // if you abbreviate, don't be pretty
    if (! prc) { pretty = (! unique); }
    // escape non-printing controls that otherwise are
    // indistinguishable
    s = this.stringEscape(s, true);
    // If you still have print/read consistency, stop here
    if ((t == 'string') && prc) {
        return s;
    }
    // Long strings and String objects get an ID so they can be
    // inspected
    this.IDForObject(thing, true);
  } else if (t == 'function') {
    var n = this.functionName(thing, unique);
    if (n != null) {
      s = n;
    } else {
      // not a global function, can't be pretty if you want unique
      pretty = (! unique);
      s = this.functionName(thing, false);
      if (s == null) { s = ''; }
    }
  } else if ((t == 'object') || (thing instanceof Object)) {
    var op = thing.__proto__;
    // No pretty if object.__constructor__ is not
    // object.__proto__.constructor, as this indicates some sort of
    // bizarre object
    if (this.constructorOf(thing) !== op.constructor) {
      pretty = (! unique);
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
    // If it has a user-defined toString method, use that, but defend
    // against broken methods
    else if (('toString' in thing) &&
             (thing.toString instanceof Function) &&
             (thing.toString !== Object.prototype.toString) &&
             (thing.toString !== Array.prototype.toString) &&
             (typeof(thing.toString()) != 'undefined') &&
             (thing.toString() != 'undefined')) {
      // No pretty for these, you don't know if the user toString is
      // uniquifying
      pretty = (! unique);
      s = String(thing);
    }
    // Print unidentified objects and arrays as abbreviated list of props
    else {
      var names = [];
      // Treat any object with a non-negative integer length as an array
      var indices = (('length' in thing) &&
                     (Math.floor(thing.length) === thing.length) &&
                     (thing.length >= 0)) ? [] : null;

      this.objectOwnProperties(thing, names, indices, limit);
      if (indices) { indices.sort(); }

      // No pretty for subclasses or non-objects or array-like objects
      // that are not Arrays.
      if (! (indices ?
               ((thing instanceof Array) && (thing.constructor === Array)) :
               ((thing instanceof Object) && (thing.constructor === Object)))) {
        pretty = (! unique);
      }
      if (indices) {
        // Present as an array, Don't accumulate beyond limit
        var next = 0;
        for (var i = 0; (i < indices.length) && (s.length < limit); i ++) {
          var key = indices[i];
          if (key != next) {
            s += '..., ';
          }
          // TODO: [2005-06-22 ptw] Use __String in case element is huge
          s += String(thing[key]) + ', ';
          next = key + 1;
        }
        if (s != '')
          s = s.substring(0, s.length - 2);
        s = '[' + s + ']';
      } else {
        var ellip = true;
        // Present as an object, Don't accumulate beyond limit
        for (var i = 0; (i < names.length) && (s.length < limit); i ++) {
          var e = names[i];
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
            ellip = true;
            // TODO: [2005-06-22 ptw] Use __String in case element is huge
            s += '' + e + ': ' + String(v) + ', ';
          } else {
            if (ellip) {
              s += '..., ';
              ellip = false;
            }
          }
        }
        if (s != '')
          s = s.substring(0, s.length - 2);
        s = '{' + s + '}';
      }
    }
  } else {
    // Shouldn't ever get here
    pretty = (! unique);
    s = String(thing);
  }

  if (pretty && (s != "") && (s.length < limit)) {
    return s;
  }
  // Compute id; force if you couldn't print pretty due to
  // abbreviating
  var id = this.IDForObject(thing, s.length >= limit);
  // Build representation
  var r = '\u00AB';             // <<
  r += this.__typeof(thing);
  if (unique && (id != null)) {r += ('#' + id);}
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

/**
  * @access private
  */
Debug.makeObjectLink = function (rep, id, attrs) {
  var color = '#0000ff';
  switch (arguments.length) {
    case 1:
      id = this.IDForObject(rep);
    case 2:
      break;
    case 3:
      if (attrs.color) { color = attrs.color };
  }
  if (id != null) {
    return '<a href="asfunction:_root.$modules.lz.Debug.displayObj,' + id + '"><font color="' + color + '">' + rep +"</font></a>";
  }
  return rep;
}

/**
  * @access private
  */
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
  // Turn off pretty for name
  var name = this.xmlEscape(this.__String(obj, false));
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

  var names = [];
  // Treat any object with a non-negative integer length as an array
  var indices = (('length' in obj) &&
                 (Math.floor(obj.length) === obj.length) &&
                 (obj.length >= 0)) ? [] : null;

  if (si) {
    // print 'invisible' properties of MovieClip's
    if (obj instanceof MovieClip) {
      for (var p in {_x: 0, _y: 0, _visible: true, _xscale: 100,
                     _yscale: 100, _opacity: 100, _rotation: 0,
                     _currentframe: 1}) {
        names.push(p);
      }
    }
  }

  this.objectOwnProperties(obj, names, indices);

  if (si) {
    // Reset the enumerability
    // Make everything unenumerable, and then expose your saved list
    ASSetPropFlags(obj, null, 1, 1);
    ASSetPropFlags(obj, enumerableSlots, 0, 1);
  }

  names.sort(function (a, b) {
    var al = a.toLowerCase();
    var bl = b.toLowerCase();
    return (al > bl) - (al < bl);
  });
  if (indices) { indices.sort(); }
  var description = "";
  var nnames = names.length;
  var val;
  var wid = 0;
  // Align all names if annotating 'weight'
  if (this.markGeneration > 0) {
    for (var i = 0; i < nnames; i++) {
      var keywidth = names[i].length;
      if (keywidth > wid) { wid = keywidth; }
    }
  }
  if (indices) {
    var keywidth = ('' + obj.length).length;
    if (keywidth > wid) { wid = keywidth; }
  }
  // indent
  wid = (wid + 2)
  var last;
  for (var i = 0; i < nnames; i++) {
    var key = names[i];
    // Some runtimes duplicate inherited slots
    if (key != last) {
      last = key;
      val = obj[key];
      if (si ||
          ((! this.internalProperty(key)) &&
           // Only show slots with internal type if showing
           // internals
           (! this.internalProperty(this.__typeof(val))))) {
             description += this.computeSlotDescription(obj, key, val, wid);
      }
    }
  }

  if (indices) {
    for (var i = 0; i < indices.length; i++) {
      var key = indices[i];
      val = obj[key];
      // Don't bother with ellipses, since we are displaying the key
      // here
      description += this.computeSlotDescription(obj, key, val, wid);
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

/**
  * Compute slot description
  * @access private
  */
Debug.computeSlotDescription = function (obj, key, val, wid) {
  var r = key + ':';
  wid++;
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
  r += ' ' + this.makeObjectLink(ostr, id) + '\n';
  return r;
}

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

