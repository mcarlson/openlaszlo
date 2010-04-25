/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/*
 * Platform-specific DebugService
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.

 */

class LzAS3DebugService extends LzDebugService {
  #passthrough (toplevel:true) {
    import flash.utils.describeType;
    import flash.utils.Dictionary;
    import flash.utils.getDefinitionByName
    import flash.utils.getQualifiedClassName
    import flash.system.Capabilities;
    import flash.net.URLRequest;
    import flash.net.navigateToURL;
  }#

   /** @acces private */ 
  var needDebugPlayerWarning:Boolean = false;

  /**
   * @access private
   */
  function LzAS3DebugService (base:LzBootstrapDebugService) {
    super(base);
    needDebugPlayerWarning = (! Capabilities.isDebugger);
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
    var remote = params[ "lzconsoledebug" ];
    if (remote == 'true') {
      // Open the remote debugger socket
      this.attachDebugConsole(new LzFlashRemoteDebugConsole());
    } else {
      // This will attach itself, once it is fully initialized.
      new lz.LzDebugWindow();
    }
  }

  /**
   * Note if not using debug player
   *
   * @access private
   */
  override function ensureVisible() {
    super.ensureVisible();
    if (needDebugPlayerWarning) {
      needDebugPlayerWarning = false;
      Debug.debug("Install the Flash debug player (%^s) for additional debugging features.",
                  function () {
                    navigateToURL(new URLRequest("http://www.adobe.com/support/flashplayer/downloads.html"), "_blank");
                  },
                  "available here");
    }
  } 

  // Map of object=>id
  var swf9_object_table:Dictionary = new Dictionary();
  // Map of id=>object
  var swf9_id_table:Array = [];

  override function IDForObject (obj:*, force:Boolean=false):* {
    var id:Number;
    // in swf9 we can use the flash.utils.Dictionary object to do hash table
    // lookups using === object equality, so we don't need to iterate over the
    // id_to_object_table to see if an object has been interned.
    var ot = this.swf9_object_table;
    if (ot[obj] != null) {
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
   */
  #passthrough {
  public override function isArrayLike (obj:*):Boolean {
    // Efficiency
    if (! obj) { return false; }
    if (obj is Array) { return true; }
    if (obj is String) { return true; }
    if (! (typeof obj == 'object')) { return false; }
    // NOTE [2008-09-20 ptw] In JS2 you can't ask obj['length'] if the
    // object's class doesn't have such a property, or is not dynamic
    var description:XML = describeType(obj);
    if ((description.@isDynamic == 'true') ||
        (description.variable.(@name == 'length').length() != 0)) {
      return super.isArrayLike(obj);
    }
    return false;
  };
  }#

  /**
   * Adds handling of swf9 Class
   *
   * @access private
   */
  override function __StringDescription (thing:*, escape:Boolean, limit:Number, readable:Boolean, depth:Number):Object {
    if (thing is Class) {
      var s = this.functionName(thing);
      if (s) {
        return {readable: false, description: s}
      }
    }
    return super.__StringDescription(thing, escape, limit, readable, depth);
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
      // Display name takes precedence over the actual class name
      if (fn[Debug.FUNCTION_NAME]) {
        var n = fn[Debug.FUNCTION_NAME];
      } else {
        var n = getQualifiedClassName(fn);
      }
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
   * Adds unenumerable object properties for DHMTL runtime
   *
   * @access private
   */
  #passthrough {
  // all methods are coerced to public when compiling for debug
  public override function objectOwnProperties (obj:*, names:Array=null, indices:Array=null, limit:Number=Infinity, nonEnumerable:Boolean=false) {
    // TODO [2008-09-11 hqm] not sure what to do here, we use the introspection API
    // flash.utils.describeType() to at least enumerate public properties...
    if (names != null) {
      var description:XML = describeType(obj);
      for each(var a:XML in description.variable) {
        names.push(a.@name);
      }
    }
    return super.objectOwnProperties(obj, names, indices, limit,nonEnumerable);
  }
  }#
}

// In AS3, we just build the whole debugger right now
Debug = new LzAS3DebugService(null);
var __LzDebug = Debug;
