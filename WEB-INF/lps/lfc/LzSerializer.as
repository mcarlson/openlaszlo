/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/******************************************************************************
 * LzSerializer.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//---
// The Krank Serializer
//
// Implements a mechanism for walking the initialized object tree and
// serializing the objects as an XML document that can be used to
// recreate the tree.
//
// @keywords private
//---
LzSerializer = new Object();

//---
// Debugging
//---
if ($debug) {
  LzSerializer._dbg_name = 'LzSerializer';
}

//---
// Serialization version
//
// Increment this version number if the XML format changes
//---
LzSerializer.versionNumber = "1.0";

//---
// Do Not Enumerate the Serializer
//
// @keywords private
//---
LzSerializer.$DNE = true;
//---
// Stack of objects to process
//
// [ [ name, val, name, val, ...],
//   [ name, val, ...],
//   ...]
//
// Each element of mstack represents an object's slots, each name is
// of the form ['b', 'c', 'a'], giving the full path (e.g., a.b.c)
// from the root to this slot.  (The path is for debugging only now
// and could be elided.) When an object's slot is itself an object,
// that object will have its slots enumerated and appended to the
// mstack.  The stack is processed in LIFO order.
//
// @keywords private
//---
LzSerializer.mstack = [];
//---
// @keywords private
//---
LzSerializer.clipsdone = false;
//---
// @keywords private
//---
LzSerializer.instantiationDone = false;

//---
// Unique object to test for identity
// @keyword private
//---
LzSerializer.movieclip = {name: 'LzSerializer.movieclip'};
//---
// @keywords private
//---
MovieClip.$SID_TYPE = LzSerializer.movieclip;

//---
// Unique object to test for identity
// @keyword private
//---
LzSerializer.button = {name: 'LzSerializer.button'};
//---
// In swf6, Buttons are created by attachMovie, so we don't want to
// dump them
//---

Button.$SID_TYPE = LzSerializer.button;

//---
// We don't need/want to dump movies that are in the
// laszlolibrary.swf, so we mark all the movies that we find
// immediately after loading
//
// @keywords private
//---
LzSerializer.markLibraryMovies = function () {
  var arr = [_root];
  while (arr.length) {
    var c = arr.pop();
    if (c['$LIBRARY_MOVIE'] || c['$SAW_MC']) continue;
    c.$LIBRARY_MOVIE = true;
    for (var k in c) {
      var obj = c[k];
      // weird but this traces out itself a lot -- adam
      if (obj == _root) continue;
      var op = obj['__proto__'];
      // Cf., native_object_prototype
      if (op && 
          op === op.constructor.prototype &&
          op.constructor['$SID_TYPE'] === this.movieclip) {
        arr.push(c[k]);
      }
    }
  }
}

//---
// Write all the movies that are not library movies.
//
// @keywords private
//---
LzSerializer.writeMovies = function () {
  var c = _root;
  for (var k in c) {
    var obj = c[k];
    if (obj.$LIBRARY_MOVIE) continue;
    // weird but this traces out itself a lot -- adam
    if (obj == _root) continue;
    if (obj._parent != c) continue;
    var op = obj.__proto__;
    // Cf., native_object_prototype
    if (false && $debug) {
      _root.Debug.write('op:', op);
      _root.Debug.write('op.constructor.prototype:', op.constructor.prototype);
      _root.Debug.write('op === op.constructor.prototype:', op === op.constructor.prototype);
      _root.Debug.write('op.constructor.$SID_TYPE:', op.constructor.$SID_TYPE);
      _root.Debug.write('this.movieclip:', this.movieclip);
      _root.Debug.write('op.constructor.$SID_TYPE === this.movieclip:',
                        op.constructor.$SID_TYPE === this.movieclip);
    }
    if (op === op.constructor.prototype &&
        op.constructor.$SID_TYPE === this.movieclip) {
      this.traceMovieClip(obj);
    }
  }
  this.clipsdone = true;
}


//---
// Serialized names of 'native' slots, with their default vaules
// (don't serialize if default).
//
// @keywords private
//---
LzSerializer.mcprops =
{
  x: 0,
  y: 0,
  visible: true,
  xscale: 100,
  yscale: 100,
  opacity: 100,
  rotation: 0,
  currentframe: 1,
  // No default for playing as we want to serialize it if set
  playing: void 0
};

//---
// Mapping of serialized names to native names
//
// @keywords private
//---
LzSerializer.mcproptrans =
{
  x: "_x",
  y: "_y",
  width: "_width",
  height: "_height",
  visible: "_visible" ,
  xscale: "_xscale",
  yscale: "_yscale",
  opacity: "_alpha",
  rotation: "_rotation",
  currentframe: "_currentframe",
  // Recorded by .play and .stop since we can't read from
  // the movie
  playing: "$SID_PLAYING"
};

//---
// Trace out movie clips, recording their attributes to the
// serialization stream
//
// @param mc:MovieClip the movie clip to trace
//
// @keywords private
//---
LzSerializer.traceMovieClip = function (mc) {
    if (mc.$SAW_MC) return;
    mc.$SAW_MC = true;
    var s = ("<m n=\"" + mc._name + "\" ");
    for (var p in this.mcprops) {
        var tprop = this.mcproptrans[p];
        if (mc[tprop] === this.mcprops[p]) continue;
        s += (p +"=\"" + mc[tprop] +"\" ");
    }
    if (mc.$SID_DESIRED_LINK != null) {
        s +="fxlink=\"" + mc.$SID_DESIRED_LINK +"\" ";
    }

    if (mc.$SID_DEPTH == null && mc.$SID_LINK == null) {
        s +="depth=\"contained\" ";
        s +="link=\"contained\" ";
    } else if (mc.$SID_DEPTH == null || mc.$SID_LINK == null) {
      this.serializationError('Error with depth or link info on ' + mc);
    } else {
        s +="depth=\"" + mc.$SID_DEPTH +"\" ";
        s +="link=\"" + mc.$SID_LINK +"\" ";
    }
    s += ">"
    this.sockWrite(s);


    for (var k in mc) {
        if (mc[k].$LIBRARY_MOVIE || "movieclip" != typeof(mc[k])) {
            continue;
        }
        this.traceMovieClip(mc[k]);
    }
    this.sockWrite("</m>");

}

//---
// Writes an object using its SID (because the object has already been dumped)
//
// @param n:string the name of the slot this object is in
// @param o:object the object
//
// @keywords private
//---
LzSerializer.writeSID = function (n, o) {
  // Only closures get entered in the SID table, other functions
  // must be looked up using their global name
  var r = 'r';
  // Sanity check
  if (o.$SID_NAME == o.__proto__.$SID_NAME) {
    if ($debug) { _root.Debug.write('Bad SID:', o.$SID_NAME, 'on', o); }
    this.serializationError('Bad SID on ' + this.currname.join('.') + '.' + n);
  }
  if (o.$SID_NAME == o.name) r = 'FID';
  this.sockWrite("<o n=\"" + escape(n) + "\" " + r + "=\"" + escape(o.$SID_NAME)+ "\" />");
}

//---
// Can't smash __proto__ on native objects, must serialize specially
//
// @keywords private
//---
LzSerializer.native_object_prototype = function (obj) {
  var op = obj.__proto__;
  if ((typeof(op) == 'object') &&
      (typeof(op.constructor) == 'function') &&
      (typeof(op.constructor.$SID_BUILTIN) == 'string') &&
      // ensure __proto__ is default prototype
      (op === op.constructor.prototype)) {
      return op;
  }
  return null;
}


LzSerializer.defaultTextFieldValues = {
    _x: 0,
    _y: 0,
    _width: 0,
    _height: 0,
    _alpha: 100,
    autoSize: "none",
    background: false,
    backgroundColor: 16777215,
    border: false,
    borderColor: 0,
    embedFonts: false,
    _highquality: 1,
    hscroll: 0,
    html: false,
    htmlText: "",
    maxChars: null,
    multiline: false,
    password: false,
    restrict: null,
    _rotation: 0,
    scroll: 1,
    selectable: true,
    _soundbuftime: 5,
    textColor: 0,
    type: "dynamic",
    _visible: true,
    wordWrap: false
}

//---
// Called by special serialization movie clip frame event to
// implmement serialization process without hanging the player
//
// @keywords private
//---
LzSerializer.procStack = function () {
  var startTime = (new Date).getTime();
  var loopCount = 0;

  // First, drain instantiation queue
  if (! this.instantiationDone) {
    this.instantiationDone = _root.LzInstantiator.drainQ(4000);
    // come back later
    return;
  }

  // Next, write out all the movie clips
  if (! this.clipsdone) {
    this.writeMovies();
    // come back later
    return;
  }

  // Pop out every so often so player does not whine
  // It appears that the idle loop has a limit both on time and loop
  // iterations
  while((loopCount++ < 1000) &&
        (((new Date).getTime() - startTime) < 4000)) {

    // Clear the obstack of any objects we are done with
    while (this.mstack.length > 0 && this.mstack[this.mstack.length - 1].length == 0) {
      // Done with this object
      this.mstack.pop();

      // If it's the last object, we are done
      if (this.mstack.length == 0) {
        // Stop the clip that runs us
        _root.krankmc.stop();
        this.sockWrite("</_top>");
        return;
      }

      // Close this object
      this.sockWrite("</o>");
    }

    // Get the next object to process
    var o = this.mstack[this.mstack.length - 1].pop();
    this.currname = this.mstack[this.mstack.length - 1].pop();
    var ot = typeof(o);         // object type
    var builtin = (typeof(o.$SID_BUILTIN) != 'undefined');
    // __proto__ flags
    var rp = o.__proto__;       // real, always set
    var np = this.native_object_prototype(o); // set if native object
    var op = null;              // set if non-native object
    // constructor
    var oc = null;              // set if non-native object
    if (false && $debug) {
      _root.Debug.write(this.currname.join('.') + ':', o);
      _root.Debug.write('native_object_prototype:', np.constructor.name);
    }

    // Get the constructor, if known, but not builtin constructors
    // (they will be set when the object is created)
    if  (ot == "object"  &&
         typeof(o.constructor) != "undefined" &&
         typeof(o.constructor.$SID_BUILTIN) == 'undefined' &&
         typeof(o.constructor.name) != "undefined") {
      oc = o.constructor;
    }

    // Get the __proto__ of non-native objects
    // NOTE: clobbering the __proto__ of native objects to dump them
    // causes serialization to fail.  Since we can't clobber their
    // __proto__, they have to be treated specially elsewhere.
    if ((! o.$SID_BUILTIN) && (! np)) {
      // Save the real proto of any object, set the proto to null so you
      // don't see _any_ inherited attributes.  In particular, you don't
      // want to see the SID_NAME of your prototype!!!!
      if (ot == "object") {
        op = o.__proto__;
        o.__proto__ = null;
      }
    }

    if (typeof(o.$SID_NAME) != "undefined") {
      // Object has already been serialized
      this.writeSID(this.currname[this.currname.length-1], o);
      // Restore the proto
      if (op != null) o.__proto__ = op;
      continue;
    }

    // Assign an ID for circular references
    o.$SID_NAME = this.sidnum++;
    var s = "";
    // Movieclips and swf6 Buttons
    if ((ot == "movieclip") || (np && (np.constructor.name == 'Button'))) {
      s = ("<o n=\"" + escape(this.currname[this.currname.length-1]) + "\" "
           + "m=\"" + escape(o) + "\" sid=\"" + o.$SID_NAME + "\" ");
    }
    // Builtin objects that may have had properties attached to them
    else if (builtin) {
      s = ('<o n="' + escape(this.currname[this.currname.length-1]) + '" '
           + 'isbuiltin="true" sid="' + o.$SID_NAME + '" ');
    }
    // Non-builtin Functions
    else if (ot == 'function') {
      var name = o.name;
      if (name.substr(name.length - 2, 2) == '()') {
        // This is a closure and must be entered into the SID table
        s  = ("<o n=\"" + escape(this.currname[this.currname.length-1]) + "\" "
              + "FID=\"" + escape(o.name) + "\"  sid=\"" + o.$SID_NAME +"\" ");
      } else {
        // This is not a closure, it is not entered into the SID
        // table, which is noted by using its name as its SID.
        o.$SID_NAME = o.name;
         s = ("<o n=\"" + escape(this.currname[this.currname.length-1]) + "\" "
              + "FID=\"" + escape(o.name) + "\" ");
      }
    }
    // Objects
    else  {
      s = ("<o n=\"" + escape(this.currname[this.currname.length-1]) +
           "\" sid=\"" + o.$SID_NAME +"\" ");
      // Note objects that need special constructors (native objects
      // that are not Objects).  We have to dispatch on $SID_BUILTIN,
      // because the global constructors may have been clobbered
      // (e.g., Button)
      if (np && (np.constructor.$SID_BUILTIN != 'Object')) {
        var nc = np.constructor.$SID_BUILTIN;
        s += 'constructor="' + nc + '" ';
        if (nc == 'Array') {
          // no special arguments
        }
        else if (nc == 'TextField') {
            // output attributes (that are not defaults of TextField) 
            s += "mc=\"" + o._parent + "\" ";
        }
        else if (nc == 'Color') {
          // Clip and rgb
          if (typeof(o.$SID_MC) != 'undefined') {
            s += "mc=\"" + o.$SID_MC + "\" ";
            if (typeof(o.$SID_RGB) != "undefined") {
              s += " rgb=\"" + o.$SID_RGB + "\" ";
            }
          }
        }
        else if (nc == 'Sound') {
          if (typeof(o.$SID_MC) != 'undefined') {
            s += "mc=\"" + o.$SID_MC + "\" ";
          }
          s += "vol=\"" + escape(o.getVolume()) + "\" ";
          s += "pan=\"" + escape(o.getPan()) + "\" ";
          // TODO: [2003-10-29 ptw] Transform, Sound resource
        }
        else if (typeof(o.valueOf) == 'function') {
          // Value for reconstructing
          s += 'args="' + escape(o.valueOf()) + '" ';
        }
      }
    }
    // Note if the object has a resolve method
    if ((typeof(o.$SID_RESOLVE_OBJECT) != 'undefined') ||
        (rp && (typeof(rp.$SID_RESOLVE_OBJECT) != 'undefined'))) {
      s+= 'x="true" ';
    }
    this.sockWrite(s + ">");

    this.queuedSlots = [];

    // Handle unenumerated slots: __proto__, prototype, constructor

    // Don't dump native __proto__s, you will recurse, and worse,
    // you will assign a sid to them, which will make all the objects
    // that inherit from them look like they have been dumped already.
    // op is only set for non-native objects
    if (op != null) {
      if (false && $debug) {
        _root.Debug.write('__proto__:', op);
      }
      this.handleObj("__proto__", op);
    }

    // Constructor if defined
    // N.B.! functions compare == null in Flash 5, but are boolean true !?#$#????
    if (oc) {
      if (false & $debug) {
        _root.Debug.write(this.currname.join('.') + '.constructor:', oc);
      }
      this.handleObj('constructor', oc);
    }

    // Don't dump prototypes of builtin objects for the same reason
    // you don't dump __proto__s.
    // NOTE: This means we cannot add properties to the prototype of a
    // builtin and expect them to be kranked.
    if ((ot == 'function') && (! builtin) && (typeof(o.prototype) != 'undefined')) {
      this.handleObj('prototype', o.prototype);
    }

    // Enumerated slots
    var objTransient = (typeof(o.$SID_TRANSIENT) != 'undefined') ? o.$SID_TRANSIENT : null;
    var protoTransient = (rp && (typeof(rp.$SID_TRANSIENT) != 'undefined')) ? rp.$SID_TRANSIENT : null;

    // Flash6 TextField objects have some MovieClip slots that don't
    // enumerate, so we need to do that manually.
    if (rp == TextField.prototype) {
      for (var p in this.defaultTextFieldValues) {
        if (this.defaultTextFieldValues[p] != o[p]) {
          this.handleSlot(objTransient, protoTransient, p, o[p]);
        }
      }
      for (var p in o) {
        if (typeof(this.defaultTextFieldValues[p]) == 'undefined') {
          this.handleSlot(objTransient, protoTransient, p, o[p]);
        }
      }
    } else {
      for (var p in o) {
        this.handleSlot(objTransient, protoTransient, p, o[p]);
      }
    }
    
    if ( this.currname[this.currname.length-1] == "_root" ) {
      this.sockWrite("<n n=\"" + escape('_focusrect') +"\" v=\"" + escape('0') +"\" />");
    }

    // Queue the slots
    this.mstack.push(this.queuedSlots);

    // Restore actual prototype
    if (op != null) o.__proto__ = op;
  }
}

//---
// Unique object to test for identity
// @keyword private
//---
LzSerializer.ignore = {name: 'LzSerializer.ignore'};
//---
// Unique object to test for identity
// @keyword private
//---
LzSerializer.transient = {name: 'LzSerializer.transient'};

//---
// Serialization properties.  These are always ignored when serializing
//
// @keywords private
//---
LzSerializer.ignored =
{
  // A movie in the input SWF file
  $LIBRARY_MOVIE: LzSerializer.ignore,
  // A movie that has been traced
  $SAW_MC: LzSerializer.ignore,
  // A Player built-in object that we may have added properties to
  $SID_BUILTIN: LzSerializer.ignore,
  // The movie clip attached to an object (must be shadowed for
  // certain objects because the player does not provide an accessor
  $SID_MC: LzSerializer.ignore,
  // The unique Serialization ID of an object
  $SID_NAME: LzSerializer.ignore,
  // The depth of a movie clip (shadowed because no accessor)
  $SID_DEPTH: LzSerializer.ignore,
  // The link of a movie clip (shadowed because no accessor)
  $SID_LINK: LzSerializer.ignore,
  // Description of the desired fixed-sized resource for text
  $SID_DESIRED_LINK: LzSerializer.ignore,
  // Whether a movie clip is playing (shadowed because no accessor)
  $SID_PLAYING: LzSerializer.ignore,
  // RGB of a color (shadowed because no accessor)
  $SID_RGB: LzSerializer.ignore,
  // Map of slots that should not be serialized
  $SID_TRANSIENT: LzSerializer.ignore,
  // Unique type marker for serialization
  $SID_TYPE: LzSerializer.ignore
}

//--
// Write out a slot if not suppressed
//
// @keywords private
//--
LzSerializer.handleSlot = function (objTransient, protoTransient, slot, value) {
  if (false && $debug) {
    _root.Debug.write(slot, 
                        'typeof:', typeof(value),
                        'ignored:', (this.ignored[slot] === this.ignore), 
                        'objTransient:', (objTransient[slot] === this.transient),
                        'protoTransient:', (protoTransient[slot] === this.transient));
  }
  // Always ignore serialization slots
  if (this.ignored[slot] === this.ignore) return;
  // hash of slots not to serialize for this class
  if (objTransient && (objTransient[slot] === this.transient)) return;
  if (protoTransient && (protoTransient[slot] === this.transient)) return;
  // Don't dump swf6 Buttons

  var vp = value.__proto__;
  // Cf., native_object_prototype
  if (vp === vp.constructor.prototype &&
      vp.constructor.$SID_TYPE === this.button) {
    return;
  }

  // handle slot according to type
  this[this.typelist[typeof(value)]](slot, value);
}

//---
// Map of type to serialization method
//
// Writers write immediately to the stream.  Handlers may queue more
// complex objects for background processing.
//
// @keywords private
//---
LzSerializer.typelist = {
  string: "writeString",
  number: "writeNumber",
  boolean: "writeBool",
  movieclip: "handleObj",
  object: "handleObj",
  'function': "handleFunction",
  'null': "writeNull",
  'undefined': "writeUndefined"
};

//---
// function serializer
//
// @param n:string the name of the slot
// @param v:function the function to be serialized
//
// @keywords private
//---
LzSerializer.handleFunction  = function (n, v) {
  if (false && $debug) {
    _root.Debug.write(n + ':', v,
                        n + '.$SID_NAME:', v.$SID_NAME);
  }
  var op = v.__proto__;
  v.__proto__ = null;
  if (typeof(v.$SID_NAME) != "undefined") {
    this.writeSID(n, v);
  } else if (typeof(v.name) == 'undefined') {
    // This is a Flash-compiled function that had better be preserved
    // in the preloader movie...
    if ($debug) _root.Debug.write(n, "not serialized");
  } else {
    var nl = this.currname.concat(n) ;
    this.queuedSlots.push(nl, v);
  }
  v.__proto__ = op;
}

//---
// boolean serializer
//
// @param n:string the name of the slot
// @param v:object the object to be serialized
//
// @keywords private
//---
LzSerializer.writeBool  = function (n, v) {
  this.sockWrite("<b n=\"" + escape(n) +"\" v=\"" + v +"\" />");
}

//---
// null serializer
//
// @param n:string the name of the slot
// @param v:object the object to be serialized
//
// @keywords private
//---
LzSerializer.writeNull  = function (n, v) {
  this.sockWrite("<l n=\"" + escape(n) +"\" />");
}

//---
// undefined serializer
//
// @param n:string the name of the slot
// @param v:object the object to be serialized
//
// @keywords private
//---
LzSerializer.writeUndefined  = function (n, v) {
  this.sockWrite("<u n=\"" + escape(n) +"\" />");
}

//---
// string serializer
//
// @param n:string the name of the slot
// @param v:object the object to be serialized
//
// @keywords private
//---
LzSerializer.writeString  = function (n, v) {
  this.sockWrite("<s n=\"" + escape(n) +"\" v=\"" + escape(v) +"\" />");
}

//---
// number serializer
//
// @param n:string the name of the slot
// @param v:object the object to be serialized
//
// @keywords private
//---
LzSerializer.writeNumber  = function (n, v) {
  this.sockWrite("<n n=\"" + escape(n) +"\" v=\"" + escape(v) +"\" />");
}

//---
// object serializer
//
// For already serialized objects, writes ID, otherwise queues object
// to be serialized in background
//
// @param n:string the name of the slot
// @param o:object the object to be serialized
//
// @keywords private
//---
LzSerializer.handleObj  = function (n, o) {
  var op = null;
  if (! this.native_object_prototype(o)) {
    op = o.__proto__;
    o.__proto__ =  null;
  }

  // Sanity check.  No object should have DNE (Do Not Enumerate) set
  // on it.
  // TODO [2003-10-29 ptw] Remove when you believe this
  if (o.$DNE) {
    if ($debug) {
      _root.Debug.write(n + ':', o,
                          n + '.$DNE:', o.$DNE,
                          n + '.$SID_NAME:', o.$SID_NAME);
    }
  } else if (typeof(o.$SID_NAME) != "undefined") {
    this.writeSID(n, o);
  } else {
    var nl = this.currname.concat(n) ;
    this.queuedSlots.push(nl, o);
  }
  if (op) o.__proto__ = op;
}

//---
// Mark native objects.  This has to be done early at the top level,
// in case subsequent programs clobber the global constructor
// (e.g,. Button)
//---
Array.$SID_BUILTIN = 'Array';
Boolean.$SID_BUILTIN = 'Boolean';
Color.$SID_BUILTIN = 'Color';
Date.$SID_BUILTIN = 'Date';
Math.$SID_BUILTIN = true;
MovieClip.$SID_BUILTIN = 'MovieClip';
Number.$SID_BUILTIN = 'Number';
Object.$SID_BUILTIN = 'Object';
Sound.$SID_BUILTIN = 'Sound';
String.$SID_BUILTIN = 'String';
XML.$SID_BUILTIN = 'XML';
XMLNode.$SID_BUILTIN = 'XMLNode';
XMLSocket.$SID_BUILTIN = 'XMLSocket';
Button.$SID_BUILTIN = 'Button';
Function.$SID_BUILTIN = 'Function';
LocalConnection.$SID_BUILTIN = 'LocalConnection';
LoadVars.$SID_BUILTIN = 'LoadVars';
TextField.$SID_BUILTIN = 'TextField';
TextFormat.$SID_BUILTIN = 'TextFormat';

//---
// Main entry point.  Start the serialization process.  Called from
// Canvas.okToInit.
//
// Stops the idle loop, opens the serialization stream, puts the
// initial objects on the processing stack and attaches the movie that
// runs the background loop.
//
// @keywords private
//---
LzSerializer.start = function () {
  // Stop the idle loop, in particular, the instantiator
  // Instantiator queue will be drained by procStack
  _root.frameupdate.stop();


  var version = _root.LzBrowser.getVersion();
  if (version < 6.0) {
      this.showVersionError(version);
      return;
  }

  this.sockOpen();
  this.sockWrite('<!-- Laszlo Systems Krank(tm) Intermediate File version ' + this.versionNumber + ' -->');
  this.sockWrite('<!-- Copyright (c) 2003 by Laszlo Systems, Inc.  All rights reserved. -->\n');

  this.sidnum = 0;

  var s = '<_top width="' + _root._width +
    '" height="' + _root._height +
    '" preloader="' + (typeof(_root.lzpreloader) != 'undefined') +
    '" version="' + this.versionNumber +
    '" >';
  this.sockWrite(s);

  // Write out any slots that have been added to primitive objects
  // first (stack is processed lifo)

  // So far, we only process Math specially.  (The others break
  // mysteriously).  But the $SID_BUILTIN flag is also used to
  // serialize objects that need special constructors.
  this.mstack[0] =  [
    ["_root"], _root
//     , ["String"], String
//     , ["Object"], Object
//     , ["Number"], Number
    , ["Math"], Math
//     , ["Boolean"], Boolean
//     , ["Array"], Array
  ];

  // Start the krank background task
  _root.attachMovie("__LZkranker", "krankmc", 4794);
  _root.krankmc.$LIBRARY_MOVIE = true;
}

//---
// Accumulated comments before the stream is open
// @keywords private
//---
LzSerializer.comments = "";

//---
// Emit a comment into the serialization stream
//
// @param tag:String (optional) a prefix tag identifying the source of
// the comment
// @param comment:String an XML-escaped string to emit as the body of
// a comment (to the XML stream)
// @keywords private
//---
LzSerializer.comment = function (tag, comment) {
  var tag = '';
  var comment = arguments[arguments.length - 1];
  if (arguments.length > 1) {
    tag = arguments[0] + ' ';
  }
  // strip any trailing \n for prettiness
  if (comment.charAt(comment.length - 1) == '\n') {
    comment = comment.substr(0, comment.length - 1);
  }
  var str = '<!-- ' + tag + comment + ' -->';
  if (typeof(this.xsock) == 'undefined') {
    this.comments += str;
  } else {
    this.sockWrite(str);
  }
}

//---
// Open the serialization stream
//
// @keywords private
//---
LzSerializer.sockOpen = function () {
  var url = LzBrowser.getLoadURLAsLzURL();
  // Security requires us to talk back to the server we were loaded from
  var host = url.host;
  // TODO: [2003-10-29 ptw] Is this the best choice?
  var port = this.krankport;

  this.xsock = new XMLSocket();
  // N.B. Flash built-in method names, not LZX.  Camel-case is correct.
  this.xsock.onClose = this.brokenSocket;
  this.xsock.onData = this.socketDataAvailable;
  if (! this.xsock.connect(host, port)) {
    Debug.log("Could not connect to listenter " + host + ":" + port);
    url.query = 'lzt=krankstatus&abort=true&msg=Could+not+open+connection+to+server';
    _root.LzBrowser.loadURL(String(url));
  }
}

//---
// Send a string to the serialization stream
//
// @param s:string the string to send
//
// @keywords private
//---
LzSerializer.sockWrite = function (s) {
  this.xsock.send(s + "\n");
}

//---
// Close the serialization stream
//
// @keywords private
//---
LzSerializer.sockClose = function () {
  this.xsock.close();
}

//---
// Error reporter
//
// @param msg:string the error message
//
// @keywords private
//---
LzSerializer.serializationError = function (msg) {
  // URL-encode message to send to server
  var emsg = escape(msg);
  var url = LzBrowser.getLoadURLAsLzURL();
  url.query = ('lzt=krankstatus&abort=true&msg=' + emsg);
  // Annotate data file
  this.comment('error', msg);
  // Signal user
  _root.LzBrowser.loadURL(String(url));
}

//---
// Handler for stream errors
//
// Can't use serializationError, socket is broken.  Hope the server
// will inform us as to what went wrong.
//
// @keywords private
//---
LzSerializer.brokenSocket = function () {
  var url = LzBrowser.getLoadURLAsLzURL();
  url.query = 'lzt=krankstatus';
  _root.LzBrowser.loadURL(String(url));
}


//---
// Handler for data input from server (used for handshake when data
// receive complete at server)
//
// @param XMLSocket src: ignored
//
// @keywords private
//---
LzSerializer.socketDataAvailable = function (src) {
  // I don't really care what we just got from the server, anything
  // at all indicates that the server has received the entire
  // obj.xml file.
  this.sockClose();
  var url = LzBrowser.getLoadURLAsLzURL();
  url.query = 'lzt=krankstatus';
  // Announce done
  _root.LzBrowser.loadURL(String(url));
}


//---
// Report error to user when they are using an invalid version of Flash
//
// @keywords private
//---

LzSerializer.showVersionError = function (version) {
  _root.LzBrowser.loadURL('javascript:alert("Error: You must use Flash version 6 or greater when running the optimizer. You are currently running '+version+'")');
}


