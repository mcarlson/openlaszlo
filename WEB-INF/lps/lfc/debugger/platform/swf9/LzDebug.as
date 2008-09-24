/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/*
 * Platform-specific DebugService
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.

 */

// The last three debugger eval values
var _;
var __;
var ___;

class LzAS3DebugService extends LzDebugService {
    #passthrough (toplevel:true) {  
    import flash.net.*;
    import flash.events.*;
    import flash.external.*;
    import flash.display.*;
    import flash.utils.*;
    import flash.system.*;
    import mx.core.Application;
    }#

  /**
   * @access private
   */
  function LzAS3DebugService (base:LzBootstrapDebugService) {
    super(null);
  }

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
    var params:Object = LFCApplication.stage.loaderInfo.parameters;
    var remote =( params[ "lzconsoledebug" ] ); 
    trace('makeDebugWindow lzconsoledebug=',  'remote=', remote);
    if (remote == 'true') {
      // Open the remote debugger socket
      this.attachDebugConsole(new LzFlashRemoteDebugConsole());
    } else {
      // This will attach itself, once it is fully initialized.
      new lz.LzDebugWindow();
    }
  }

  // Map of object=>id
  var swf9_object_table:Dictionary = new Dictionary();
  // Map of id=>object
  var swf9_id_table:Array = [];

  override function IDForObject (obj:*, force:Boolean=false):Number {
    var id:Number;
    // TODO [hqm 2008-09-11] in swf9 we can use the flash.utils.Dictionary object
    // to do hash table lookups using === object equality, so we don't need to
    // iterate over the id_to_object_table to see if an object has been interned.
    var ot = this.swf9_object_table;
    if (ot[obj]  != null) {
      return ot[obj];
    }
    if (!force) {
      // ID anything that has identity
      if (! this.isObjectLike(obj)) {
        return null;
      }
    }
    id = this.objseq++;
    this.swf9_object_table[obj] = id;
    this.swf9_id_table[id] = obj;
    return id;
  };

  override function ObjectForID (id) {
    return this.swf9_id_table[id];
  };


   /**
    * @access private
   * @devnote The only reason this is here is because the SWF eval
   * compiler does not (yet) wrap `with (Debug.environment)` around the
   * compiled expression, so we have to put the "previous value's" in
  * _level0
   */
  override function displayResult (result=(void 0)) {
    if (typeof(result) != 'undefined') {
      // Advance saved results if you have a new one
      if (result !== global._) {
        if (typeof(global.__) != 'undefined') {
          global.___ = global.__;
        }
        if (typeof(global._) != 'undefined') {
          global.__ = global._;
        }
        global._ = result;
      }
    }
    this.freshLine();
    // Output any result from the evalloader
    if (typeof(result) != 'undefined') {
      this.format("%#w", result);
    }
    this.freshPrompt();
  };


  /**
   * Predicate for deciding if an object is 'Object-like' (has
   * interesting properties)
   *
   * @access private
   */
  override function isObjectLike (obj:*):Boolean {
    // NOTE [2008-09-16 ptw] In JS2 all primitives (boolean, number,
    // string) are auto-wrapped, so you can't ask `obj is Object` to
    // distinguish primitives from objects
    return !!obj && (typeof(obj) == 'object');
  };

  /**
   * Predicate for deciding if an object is 'Array-like' (has a
   * non-negative integer length property)
   *
   * @access private
   *
   * @devnote TODO [2008-09-22 ptw] (LPP-XXXX) The swf9 back end is
   * currently discarding return declarations, so we have to comment
   * out the declaration here to avoid an invalid override error
   */
  #passthrough {
    public override function isArrayLike (obj:*)/*:Boolean*/ {
    // Efficiency
    if (! obj) { return false; }
    if (obj is Array) { return true; }
    if (! (typeof obj == 'object')) { return false; }
    // NOTE [2008-09-20 ptw] In JS2 you can't ask obj['length'] if the
    // object's class doesn't have such a property, or is not dynamic
    var description:XML = describeType(obj);
    if ((description.@isDynamic == 'true') ||
        (description.variable.(@name == 'length').length() != 0)) {
      return super.isArrayLike(obj);
    }
    return  false;
  };
  }#

  /**
   * Adds handling of swf9 Class
   *
   * @access private
   */
  override function __StringDescription (thing:*, pretty:Boolean, limit:Number, unique:Boolean):Object {
    if (thing is Class) {
      var s = this.functionName(thing);
      if (s) {
        return {pretty: pretty, description: s}
      }
    }
    return super.__StringDescription(thing, pretty, limit, unique);
  }

  /** 
   * @access private
   * @devnote This is carefully constructed so that if there is a
   * preferred name but mustBeUnique cannot be satisfied, we return
   * null (because the debugger may re-call us without the unique
   * requirement, to get the preferred name).
   *
   * @devnote TODO: [2008-09-23 ptw] (LPP-7034) Remove public
   * declaration after 7034 is resolved
   */
#passthrough{
  // all methods are coerced to public when compiling for debug
  public override function functionName (fn, mustBeUnique:Boolean=false) {
    if (fn is Class) {
      // JS2 constructors are Class
      if (fn['tagname']) {
        // Handle tag classes
        if ((! mustBeUnique) || (fn === lz[fn.tagname])) {
          return '<' + fn.tagname + '>';
        } else {
          return null;
        }
      }
      var n = getQualifiedClassName(fn);
      if (! mustBeUnique) {
          return n;
      } else {
        try {
          if (fn == getDefinitionByName(n)) {
            return n;
          }
        } catch (e) {};
        return null;
      }
    }
    return super.functionName(fn, mustBeUnique);
  };
}#

  /**
   * @access private
   */
  /**
   * Adds unenumerable object properties for DHMTL runtime
   *
   * @access private
   */
  #passthrough {
  // all methods are coerced to public when compiling for debug
  public override function objectOwnProperties (obj:*, names:Array=null, indices:Array=null, limit:Number=Infinity, nonEnumerable:Boolean=false) {
    // TODO [2008-09-11 hqm] not sure what to do here, maybe we can use the introspection API
    // flash.utils.describeType() to at least enumerate public properties... 
    var description:XML = describeType(obj);
    if (names != null) {
      for each(var a:XML in description.variable) {
          names.push(a.@name);
        }
    }
    return super.objectOwnProperties(obj, names, indices, limit,nonEnumerable);
  }
  }#
}

var Debug = new LzAS3DebugService(null);
var __LzDebug = Debug;


