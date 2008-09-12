/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/*
 * Platform-specific DebugService
 */

class LzAS2DebugService extends LzDebugService {
#pragma "warnUndefinedReferences=true"
  /**
   * @access private
   */
  function LzAS2DebugService (base:LzBootstrapDebugService) {
    super(base);
    // Preserve any state created in the base service
    var copy = {backtraceStack: true, uncaughtBacktraceStack: true, sourceWarningHistory: true};
    for (var k in copy) {
      this[k] = base[k];
    }

    // Make MovieClips have nice names
    //
    // shut up the dumb doc tool
    /** @access private */
    MovieClip.prototype._dbg_name = function () {
      // clip scales are in percent
      var xs = this._xscale/100;
      var ys = this._yscale/100;
      // Describe the clip's actual dimensions, and the 2d transform
      // representing the x/y offset and scaling.  This is available
      // directly in Flash 8 and above.
      var m = this.transform.matrix;
      if (m) {
        return Debug.formatToString("%s [%0.2d x %0.2d]*[%0.2d %0.2d %0.2d, %0.2d %0.2d %0.2d, 0 0 1]",
                                    String(this),
                                    this._width/xs, this._height/ys,
                                    m.a, m.b, m.tx,
                                    m.c, m.d, m.ty);
      } else {
        // TODO: [2008-01-30 ptw] Rotation in swf7
        return Debug.formatToString("%s [%0.2d x %0.2d]*[%0.2d 0 %0.2d, 0 %0.2d %0.2d, 0 0 1]",
                                    String(this),
                                    this._width/xs, this._height/ys,
                                    xs, this._x,
                                    ys, this._y)
      }
    };

    // Make SWF player native prototypes print nicely
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
      obj._dbg_name = String(name);
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
              if (! val.hasOwnProperty('_dbg_name')) {
                val._dbg_name = name + '.' + key;
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
  };

  /**
   ** Platform-specific implementation of debug I/O
   **/

  /**
   * Instantiates an instance of the user Debugger window
   * Called last thing by the compiler when the app is completely loaded.
   * @access private
   */
  function makeDebugWindow () {
    // Make the real console.  This is only called if the user code
    // did not actually instantiate a <debug /> tag
    if (typeof(global.lzconsoledebug) != 'undefined') {
      // Open the remote debugger socket
      this.attachDebugConsole(new LzFlashRemoteDebugConsole());
    } else {
      // This will attach itself, once it is fully initialized.
      new lz.LzDebugWindow();
    }
  }

  /**
   * @access private
   * @devnote The only reason this is here is because the SWF eval
   * compiler does not (yet) wrap `with (Debug.environment)` around the
   * compiled expression, so we have to put the "previous value's" in
   * _level0
   */
  override function displayResult (result) {
    if (typeof(result) != 'undefined') {
      // Advance saved results if you have a new one
      if (result !== _level0['_']) {
        if (typeof(_level0.__) != 'undefined') {
          _level0.___ = _level0.__;
        }
        if (typeof(_level0._) != 'undefined') {
          _level0.__ = _level0._;
        }
        _level0._ = result;
      }
    }
    this.freshLine();
    // Output any result from the evalloader
    if (typeof(result) != 'undefined') {
      this.format("%#w", result);
    }
    this.freshPrompt();
  }


  /**
   * @access private
   */
  override function functionName (fn, mustBeUnique) {
    if (fn is Function) {
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
  /**
   * Adds unenumerable object properties for DHMTL runtime
   *
   * @access private
   */
  override function objectOwnProperties (obj:*, names:Array=null, indices:Array=null, limit:Number=Infinity, nonEnumerable:Boolean=false) {
    var hasProto = obj && obj['hasOwnProperty'];
    if (names && nonEnumerable) {
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

      // add 'invisible' properties of MovieClip's
      if (obj instanceof MovieClip) {
        for (var p in {_x: 0, _y: 0, _width: 0, _xscale: 100, _height: 0, _yscale: 100,
              _visible: true, _opacity: 100, _rotation: 0, _currentframe: 1}) {
          names.push(p);
        }
      }
    }
    super.objectOwnProperties(obj, names, indices, limit, nonEnumerable);
    if (names && nonEnumerable) {
      // Reset the enumerability
      // Make everything unenumerable, and then expose your saved list
      ASSetPropFlags(obj, null, 1, 1);
      ASSetPropFlags(obj, enumerableSlots, 0, 1);
    }
  };
};

/**
 * The Debug singleton is created in compiler/LzBootstrapDebugService so
 * a primitive debugger is available during bootstrapping.  It is
 * replaced here with the more capable debugger
 *
 * @access private
 */
var Debug = new LzAS2DebugService(Debug);
/**
  * TODO: [2006-04-20 ptw] Remove when compiler no longer references
  * @access private
  */
var __LzDebug = Debug;



//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

