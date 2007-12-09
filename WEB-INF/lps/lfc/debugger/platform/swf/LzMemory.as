/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/**
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access private
  * @topic LZX
  * @subtopic Debugging
  */


// Memory analysis tools for the debugger

// Define some annotations
Debug.annotation = {
  marked: '_dbg_marked',
  why: '_dbg_why',
  size: '_dbg_smoots',
  total: '_dbg_weight',
  leaked: '_dbg_leaked'
}
// For making unenumerable
Debug.allAnnotations = [];
// N.B. function expression avoids polluting module with temp vars
(function () {
  for (var a in Debug.annotation) {
    Debug.allAnnotations.push(Debug.annotation[a]);
  }
})();
// Generation of this mark
Debug.markGeneration = 0;
// Whether to do why annotation
Debug.noteWhy = false;
// Whether to find leaks
Debug.findLeaks = false;
Debug.leaks = [];
// For debugging yourself
Debug.debugTrace = false;

/**
  * Mark an object
  * @access private
  */
Debug.mark = function (o) {
  var annotation = this.annotation;
  delete o[annotation.leaked];
  o[annotation.marked] = this.markGeneration;
}

/**
  * Is an object marked?
  * @access private
  */
Debug.isMarked = function (o) {
  // Deleted movieclips have no prototype??  Whatever, don't trace
  if ((! (o instanceof Object || o instanceof MovieClip)) ||
      (! (o.hasOwnProperty) instanceof Function)) {
    if (this.debugTrace) {
      Debug.write('Not tracing', o);
    }
    return true;
  }
  var marked = this.annotation.marked;
  if (! o.hasOwnProperty(marked)) {
    return false;
  }
  return o[marked] == this.markGeneration;
}

/**
  * Stack of objects to trace
  * [ [ name, val, name, val, ...],
  * [ name, val, ...],
  * ...]
  * 
  * Each element of obstack represents an object's slots, as the slot
  * name and slot value.  Each element also has two properties, `path`
  * and `ancestors` which are used to annotate why an object is alive
  * and the 'cost' or 'weight' of an object, if requested.  When an
  * object's slot is itself an object, that object will have its slots
  * enumerated and appended to the obstack.  The stack is processed in
  * FIFO order (i.e., trace is breadth-first)
  *
  * @access private
  */
Debug.obstack = [];

/**
  * Background task for the memory tracer
  * Very similar in spirit to the krank serializer, but I couldn't see
  * a way to easily share code.  Actually, this is a significant
  * improvement on the krank serializer, since it uses ASSetPropFlags
  * to get to unenumerable properties (rather than having explicit
  * lists) and hasOwnProperty to restrict to immediate properties
  * (rather than __proto__ smashing).
  * 
  * @access private
  */
Debug.traceStep = function (steps, milliseconds) {
  // Limit background processing so player doesn't abort us.  There
  //seems to be a limit both on total time in an idle function and
  //number of loop iterations (or backward branches?) in an idle function
  if (arguments.length < 1) { steps = 500; }
  if (arguments.length < 2) { milliseconds = 2000; }
  var loopStart = (new Date).getTime();
  var loopCount = 0;
  var os = this.obstack;
  var dopath = this.noteWhy || this.debugTrace;
  var annotation = this.annotation;
  var marked = annotation.marked;
  var why = annotation.why;
  var size = annotation.size;
  var total = annotation.total;
  var leaked = annotation.leaked;

  while ((loopCount++ < steps) &&
         (((new Date).getTime() - loopStart) < milliseconds)) {
    // Clear the obstack of any objects we are done with
    while (os.length > 0 && os[0].length == 0) {
      // Done with this object
      os.shift();

      // If it's the last object, we are done
      if (os.length == 0) {
        Debug.format(' ... done!\n');
        if (this.debugTrace) { 
          Debug.write('Stopping:', Debugmc);
        }
        // Stop the clip that runs us
        __LzDebugmc.stop();
        // done
        return true;
      }
    }

    // Get the next object to process
    // This is a breadth-first search
    var ose = os[0];
    var o = ose.pop();
    var name = ose.pop();
    var wasLeaked = false;

    // Make sure we didn't already get here via another path
    if (this.isMarked(o)) {
      continue;
    }

    var enumerableSlots = [];
    // Accumulate list of enumerable slots before annotating
    for (var p in o) {
      // attached movie clips don't show up as 'hasOwnProperty' (but
      // hasOwnProperty is more accurate -- consider if an instance
      // copies a prototype property)
      if ((! o['__proto__']) ||
          o.hasOwnProperty(p) ||
          (o[p] !== o.__proto__[p])) {
        enumerableSlots.push(p);
      }
    }

    // If asked to find leaks, collect new objects
    if (this.findLeaks) {
      if ((! (o instanceof Object || o instanceof MovieClip)) ||
          (! (o.hasOwnProperty) instanceof Function)) {
        if (this.debugTrace) {
          Debug.format('Not recording %w as leaked\n', o);
        }
      } else if (! o.hasOwnProperty(marked)) {
        wasLeaked = true;
        this.leaks.push(o);
      }
    }

    // Annotate why this object is alive
    // But only if asked to
    if (dopath) {
      var path = ose.path.concat(name);
      o[why] = path.join('.');
    }

    // Mark the object
    this.mark(o);

    // N.B.: Flash-specific hack to get at otherwise unenumerable
    // properties.  This makes all properties enumerable.
    //
    // The first arg is the object to twiddle.  The second argument is
    // a list of slots to twiddle on, or null for all slots.
    // The 3rd arg is a bitmask of flags to set:
    // 2^2 = unwritable
    // 2^1 = undeletable
    // 2^0 = unenumerable
    // The 4th argument is a bitmask of flags to clear (as above).
    // [Cf.,
    // http://pt.withy.org/ptalk/archives/2005/08/fourth_and_bitz.html]
    //
    // So, make all the properties of this object enumerable
    ASSetPropFlags(o, null, 0, 1);
    // But not the annotations
    ASSetPropFlags(o, this.allAnnotations, 1, 0);

    // Rough measure of size
    var obSize = 0;
    // Slots to queue for tracing
    var queuedSlots = [];
    if (dopath) {
      queuedSlots.path = path;
      // Careful: concat is append, except if one of its arguments is
      // an array!
      var ancestors = ose.ancestors;
      queuedSlots.ancestors = ancestors.concat();
      queuedSlots.ancestors.push(o);
    }
    for (var p in o) {
      // attached movie clips don't show up as 'hasOwnProperty' (but
      // hasOwnProperty is more accurate -- consider if an instance
      // copies a prototype property)
      if ((! o['__proto__']) ||
          o.hasOwnProperty(p) ||
          (o[p] !== o.__proto__[p])) {
        var v = o[p];
        // Very rough estimate of size
        obSize += 2;            // assume hashes are 50% full
        if (typeof(v) == 'string') {
          // Assume strings can be packed 4 chars/word
          obSize += Math.ceil(v.length/4);
        }
        // Object weight is calculated below.

        // Optimization, skip non-objects and objects already marked
        if ((v instanceof Object || v instanceof MovieClip) && (! this.isMarked(v))) {
          queuedSlots.push(p, v);
        }
      }
    }

    // Annotate size
    o[size] = obSize;
    // Annotate 'weight'
    if (dopath) {
      o[total] = obSize;
      // Annotate leaked weight
      if (wasLeaked) {
        o[leaked] = obSize;
      }
      // Annotate weight in ancestors
      var al = ancestors.length
      for (var i = al-1; i >=0; i--) {
        var ai = ancestors[i];
        // How can an ancestor become undefined?  Because a movieclip
        // gets GC-ed?
        if (ai) {
          ai[total] += obSize;
          if (wasLeaked) {
            // Annotate leaked weight in ancestors
            if (ai.hasOwnProperty(leaked)) {
              if (this.debugTrace) {
                if (o[why].indexOf(ai[why]) != 0) {
                  Debug.format("%w(%s) +> %w(%s)\n", o, o[why], ai, ai[why]);
                  Debug.format("%w[%d]\n", ancestors, i);
                }
              }
              ai[leaked] += obSize;
            }
          }
        }
      }
    }

    // Reset the enumerability
    // Make everything unenumerable, and then expose your saved list
    ASSetPropFlags(o, null, 1, 0);
    ASSetPropFlags(o, enumerableSlots, 0, 1);

    // Queue the slots
    if (queuedSlots.length) {
      os.push(queuedSlots);
    }
  }

  // not done
  return false;
}

/**
  * Initialize data structures for tracing
  * @param Boolean findLeaks: whether to accumulate new objects,
  * default false
  * @param Boolean noteWhy: whether to record reason alive, default
  * false
  * @access private
  */
Debug.initTrace = function (findLeaks, noteWhy) {
  switch (arguments.length) {
    case 0:
      findLeaks = false;
    case 1:
      noteWhy = false;
  }
  // Start a new generation
  this.markGeneration++;
  // Set flags
  this.findLeaks = findLeaks;
  if (findLeaks) {
    this.leaks = [];
  } else {
    delete this.leaks;
  }
  this.noteWhy = noteWhy;
  // Don't trace self
  for (var t = this; t !== Object.prototype; t = t['__proto__']) {
    this.mark(t);
  }
  // Or this debugger cruft
  if (global['_']) {
    this.mark(global._);
  }
  if (global['__']) {
    this.mark(global.__);
  }
  if (global['___']) {
    this.mark(global.___);
  }
  this.mark(this.evalloader);
  // Create the initial obstack element: global
  var osel = ["global", global];
  osel.path = [];
  osel.ancestors = [];
  this.obstack[0] = osel;
  // set the background task to trace
  this.background = this.traceStep;
}

/**
  * Mark all the currently live objects
  * @access private
  */
Debug.markObjects = function () {
  this.initTrace();
  // Start the debugger background task
  // SWF-player specific
  if (_root['__LzDebugmc']) {
    __LzDebugmc.play();
  } else {
    _root.attachMovie("__LZdebugger", "__LzDebugmc", 4794);
  }
  if (this.debugTrace) {
    Debug.write('Starting:', __LzDebugmc);
  }
  Debug.format('Marking objects... ');
}

/**
  * Find new objects since the last trace
  * @access private
  */
Debug.findNewObjects = function () {
  this.initTrace(true, true);
  // SWF-player specific
  if (_root['__LzDebugmc']) {
    __LzDebugmc.play();
    if (this.debugTrace) {
      Debug.write('Starting:', __LzDebugmc);
    }
    Debug.format('Finding new objects... ');
  } else {
    Debug.error('Call %w first', Debug.markObjects);
  }
};


/**
 * A leak descriptor
 */
class __LzLeak {
  var obj = null;
  var path = '';
  var parent = null
  var property = '';
  var leaked = 0;

  function initialize (o) {
    var annotations = Debug.annotation;
    var why = annotations.why;
    var leaked = annotations.leaked;
    this.obj = o;
    if (o && (why in o) && (leaked in o)) {
      var path = o[why];
      var lastdot = path.lastIndexOf('.');
      this.path = path.substring(0, lastdot);
      this.parent = eval(this.path);
      this.property = path.substring(lastdot + 1, path.length);
      this.leaked = o[leaked];
    }
  }

  /**
   * Describe an individual leak
   * @access private
   */
  function toString () {
    if (this.obj) {
      return Debug.formatToString("%=s.%s: (\xa3%d) %0.32#w", this.parent, this.path, this.property, this.leaked, this.obj);
    } else {
      return '' + this.obj;
    }
  }
};

/**
  * Snapshot of the current leaks
  * @access private
  */
class __LzLeaks /* extends Array */ {
  // Act like an Array
  var length = 0;

  var sort = Array.prototype.sort;

  function initialize () {
    var l = Debug.leaks;
    var ll = l.length;
    var annotations = Debug.annotation;
    var why = annotations.why;
    var size = annotations.size;
    var leaked = '_dbg_check';

    // Sort leaks according to path
    l.sort(function (a, b) { 
        var an = a[why];
        var bn = b[why];
        return (an > bn) - (an < bn);
      });

    // Merge leaks under the same path
    this.length = 0;
    for (var i = 0; i < ll; i = j) {
      var p = l[i];
      p[leaked] = p[size];
      var j = i + 1;
      var pn = p[why];
      if (typeof(pn) != 'undefined') {
        while (j < ll) {
          var c = l[j];
          var cn = c[why];
          if (typeof(cn) != 'undefined') {
            if (cn.indexOf(pn) == 0) {
              // Don't count loops
              if (c !== p) {
                p[leaked] += c[size];
              } else {
                if (Debug.debugTrace) {
                  Debug.format('%s is %s\n', pn, cn);
                }
              }
              j++;
              continue;
            }
          }
          break;
        }
      }
      this[this.length++] = new __LzLeak(p);
    }
  }


  function _dbg_name () {
    var leakage = 0;
    for (var i in this) {
      var s = this[i].leaked;
      if (! isNaN(s)) {
        leakage += s;
      }
    }
    return leakage + ' smoots';
  }
}

/**
  * List new objects and why they are alive
  *
  * @param top Number: How many leaks to detail, default is 10
  * @access private
  */
Debug.whyAlive = function (top) {
  switch (arguments.length) {
    case 0:
      top = 10;
  }
  if (this['leaks']) {
    var l = new __LzLeaks();

    // Sort the largest to the top
    l.sort(function (a, b) { 
        var al = a.leaked;
        var bl = b.leaked;
        return (al < bl) - (al > bl); });

    // Output the top leaks
    if (top > l.length) { top = l.length; }
    for (var i = 0; i < top; i++) {
      Debug.format("%w\n", l[i].toString());
    }
    if (top < l.length) {
      Debug.write('...');
    }

    // Return the data for inspection
    return l;
  } else {
    Debug.error('Call %w first', Debug.findNewObjects);
  }
}
