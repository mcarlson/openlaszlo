/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/*
 * Value presentation and inspection
 */

Debug.objectClassPattern = new RegExp('^\\[object\\s+(\\w+)\\]$');
Debug.nativeClassPattern = new RegExp('^\\[(\\w+)\\]$');
/**
 * @access private
 */
Debug.__typeof = function (thing) {
  try {
    // default type
    var n = typeof(thing);
    // Refine Object subtypes
    if (thing && (n == 'object' || thing instanceof Object)) {
      // In Javascript the only link to the prototype is through the
      // constructor property
      var oc = thing['constructor'];

      // Check for user typename
      var user_name = null;
      if (thing['_dbg_typename'] && (thing._dbg_typename instanceof Function)) {
        // Guard against broken user routines
        try {
          user_name = thing._dbg_typename();
        } catch (e) {}
      } else if (typeof(thing._dbg_typename) == 'string') {
        user_name = thing._dbg_typename;
      }
      // No or invalid user typename, use constructor
      if ((typeof(user_name) == 'string') || (user_name instanceof String)) {
        n = user_name;
      } else if (oc) {
        var ocn = this.functionName(oc, false);
        if (! ocn) {
          // tip o' the pin to osteele.com
          var ts = thing.toString();
          var m = ts.match(this.objectClassPattern);
          if (! m) { m = ts.match(this.nativeClassPattern); }
          if (m) {
            ocn = m[1];
          }
        }
        if (ocn) {
          if (oc !== global[ocn]) {
            // Uniquify non-global constructors
            var id = this.IDForObject(oc);
            ocn += '#' + id;
          }
          n = ocn;
        }
      }
      // verify instanceof matches constructor
      if ((oc instanceof Function) && (! (thing instanceof oc))) {
        // prototype
        if (thing === oc.prototype) {
          // What is the right type for a prototype?
          // For now, let it be
        } else {
          // Enclose questionable types in question marks
          // In Javascript this means that the constructor prototype is
          // not our prototype -- we have no way to reconstruct that
          // prototype
          n = '\u00bf' + n + '?';
        }
      }
    }
    // Show dimensions, if applicable
    try {
      if (thing && typeof(thing.length) == 'number') {
        n += '(' + thing.length + ')';
      }
    } catch (e) {};
  }
  catch (e) {
    try {
      n = typeof thing;
    }
    catch (e) {
      n = "Error computing __typeof";
    }
  }

  return n;
};


Debug.functionNamePattern = new RegExp('function\\s+([^\\s(]+)[\\s(]');

/**
 * @access private
 */
Debug.functionName = function (fn, mustBeUnique) {
  if (fn && (fn instanceof Function)) {
    // _dbg_name takes precedence over the actual function name
    if (fn.hasOwnProperty('_dbg_name')) {
      var n = fn._dbg_name;
    } else {
      // tip o' the pin to osteele.com
      var fstring = fn.toString();
      var m = fstring.match(this.functionNamePattern);
      if (m) {
        var n = m[1];
      }
    }
    if (n) {
      if ((! mustBeUnique) || (fn === global[n])) {
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
  try {
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
    // Return primitive types early, so you don't stumble on them in
    // unforgiving runtimes.
    if (thing === (void 0)) {
      if (pretty) {
        return ('(void 0)');
      } else {
        // Empty type
        return '\u00ABundefined\u00BB';
      }
    }
    if (thing === null) {
      return "null";
    }
    var t = typeof(thing);
    var debug_name = null;
    var s = '';

    if ((thing instanceof Object)) {
      // Bind printLength short while calling user methods
      var opl = this.printLength;
      this.printLength = (limit < this.inspect.printLength)?limit:this.inspect.printLength;
      // NOTE: [2007-01-12 ptw] Class.make gives all prototype
      // objects a `_dbg_typename` property. which most objects will not
      // have.
      var ac = Class.allClasses;
      if (thing.hasOwnProperty('_dbg_typename')) {
        for (var cn in ac) {
          if (thing === ac[cn].prototype) {
            debug_name = '.prototype';
            break;
          }
        }
      }
      if (debug_name) {
        // all done
      } else if (thing['_dbg_name'] && (thing._dbg_name instanceof Function)) {
        // Guard against broken user routines
        try {
          debug_name = thing._dbg_name();
        }
        catch (e) {}
      } else if (thing['_dbg_name'] &&
                 (typeof(thing._dbg_name) == 'string'
                  || (debug_name instanceof String))) {
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
    } else if ((t == 'null') || (t == 'number') || (t == 'boolean')) {
      // Primitive types with print/read consistency print as pretty,
      // unless abbreviated below
      pretty = true;
      s = String(thing);
    } else if ((t == 'string') || (thing instanceof String)) {
      // No pretty for subclasses
      if (thing instanceof String && (thing.constructor !== String)) {
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
    } else if ((t == 'function') || (thing instanceof Function)) {
      var n = this.functionName(thing, unique);
      if (n != null) {
        s = n;
      } else {
        // not a global function, can't be pretty if you want unique
        pretty = (! unique);
        s = this.functionName(thing, false);
        if (s == null) { s = ''; }
      }
    } else if ((thing instanceof HTMLElement) &&
               (! isNaN(Number(thing['nodeType'])))) {
      // tip o' the pin to osteele.com for the notation format
      function nodeToString(node) {
        var tn = node.nodeName || '';
        var path = tn.toLowerCase();
        if (node.nodeType == Node.ELEMENT_NODE) {
          var id = node.id;
          var cn = node.className;
          if (id) {
            path += '#' + id;
          } else if (cn) {
            var more = cn.indexOf(' ');
            if (more == -1) { more = cn.length; }
            path += '.' + cn.substring(0, more);
          }
        }
        var parent = node.parentNode;
        if (parent) {
          var index, count = 0;
          for (var sibling = parent.firstChild; sibling; sibling = sibling.nextSibling) {
            if (tn == sibling.nodeName) {
              count++;
              if (index) break;
            }
            if (node === sibling) { index = count; }
          }
          if (count > 1) {
            path += '[' + index + ']';
          }
          try {
            return nodeToString(parent) + '/' + path;
          } catch (e) {
            return '.../' + path;
          }
        }
        return path;
      };
      s = nodeToString(thing);
    } else if ((t == 'object') || (thing instanceof Object)) {
      // No pretty if object.constructor.prototype is not
      // object's prototype, as this indicates some sort of
      // bizarre object
      if ((! thing.constructor.prototype.isPrototypeOf) ||
          (! (thing.constructor.prototype.isPrototypeOf instanceof Function)) ||
          (! thing.constructor.prototype.isPrototypeOf(thing))) {
        pretty = (! unique);
      }
      // Catch wrappers (but not subtypes of wrappers)
      if (thing.constructor === Date ||
          thing.constructor === Boolean ||
          thing.constructor === Number) {
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
      // TODO [2006-04-11 ptw] try/catch around user method calls
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
  }
  catch (e) {
    try {
      s = String(thing);
    }
    catch (e) {
      s = "Error computing __String";
    }
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
};

/**
 * @access private
 */
Debug.makeObjectLink = function (rep, id, attrs) {
  var type = 'INSPECT';
  switch (arguments.length) {
    case 1:
      id = this.IDForObject(rep);
    case 2:
      break;
    case 3:
      if (attrs.type) { type = attrs.type };
  }
  if (id != null) {
    var obj = this.ObjectForID(id);
    var tip = Debug.formatToString("Inspect %0.32#w", obj);
    // This ends up being inserted into the debugger output iframe.
    // We look up $modules in the parent it shares with the app.
    return '<a class="' + type + '" title="' + tip + '" href="javascript:window.parent.$modules.lz.Debug.displayObj(' + id + ')">' + rep +"</a>";
  }
  return rep;
};

/**
 * @access private
 */
Debug.inspectInternal = function (obj, showInternalProperties) {
  var si = (typeof(showInternalProperties) != 'undefined')?showInternalProperties: this.showInternalProperties;
  var hasProto = obj && obj.hasOwnProperty;
  var opl = this.printLength;
  try {
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
    if (! (obj instanceof Object)) {
      return name;
    }
    // Print properties with abbreviated length
    this.printLength = this.inspect.printLength;

    var names = [];
    // Treat any object with a non-negative integer length as an array
    var indices = (('length' in obj) &&
                   (Math.floor(obj.length) === obj.length) &&
                   (obj.length >= 0)) ? [] : null;

    if (si) {
      // print unenumerable properties of ECMA objects
      // TODO: [2006-04-11 ptw] enumerate Global/Number/Math/Regexp
      // object properties
      for (var p in {callee: true, length: true, constructor: true, prototype: true}) {
        try {
          if (hasProto && obj.hasOwnProperty(p)) {
            names.push(p);
          }
        } catch (e) {};
      }
    }

    this.objectOwnProperties(obj, names, indices);

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
               description += '  ' + this.computeSlotDescription(obj, key, val, wid) + '\n';
        }
      }
    }

    if (indices) {
      for (var i = 0; i < indices.length; i++) {
        var key = indices[i];
        val = obj[key];
        // Don't bother with ellipses, since we are displaying the key
        // here
        description += '  ' + this.computeSlotDescription(obj, key, val, wid) + '\n';
      }
    }
  } finally {
    this.printLength = opl;
  }
  // Annotate 'weight' if available
  if (this.markGeneration > 0) {
    var leaked = this.annotation.leaked;
    if (obj &&
        (obj instanceof Object) &&
        obj.hasOwnProperty &&
        (obj.hasOwnProperty instanceof Function) &&
        obj.hasOwnProperty(leaked) &&
        obj[leaked]) {
      name += ' (\u00A3' + obj[leaked] + ')'; // 'Pounds'
    }
  }
  if (description != "") { description = ' {\n' + description + '}'; }
  return name + description;
};

/**
 * Compute slot description
 * @access private
 */
Debug.computeSlotDescription = function (obj, key, val, wid) {
  var r = key + ':';
  wid++;
  try {
    // Annotate 'weight' if available
    if (this.markGeneration > 0) {
      var annotation = this.annotation;
      var leaked = annotation.leaked;
      var why = annotation.why;
      var wf = '        ';
      wid += wf.length;
      if (val &&
          (val instanceof Object) &&
          val.hasOwnProperty &&
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
    r += ' ' + this.makeObjectLink(ostr, id);
  }
  catch (e) {
    try {
      r += this.formatToString(" Error: %w computing description", e);
    }
    catch (e) {
      r += " Error computing description";
    }
  }
  return r;
};

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************
