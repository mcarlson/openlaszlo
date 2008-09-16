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
  override function displayResult (result) {
    if (typeof(result) != 'undefined') {
      // Advance saved results if you have a new one
      if (result !== _) {
        if (typeof(__) != 'undefined') {
          ___ = __;
        }
        if (typeof(_) != 'undefined') {
          __ = _;
        }
        _ = result;
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
  override function functionName (fn, mustBeUnique:Boolean=false) {
    if (fn && ((fn is Function) || (fn is Class))) {
      if (fn.hasOwnProperty('_dbg_name') || fn.hasOwnProperty('name')) {
        var n = fn.hasOwnProperty('_dbg_name') ? fn['_dbg_name'] : fn['name'];
      } else if ((fn is Class) && (fn['tagname']) && (fn === lz[fn.tagname])) {
        // Handle tag classes
        return '<' + fn.tagname + '>';
      } else {
        // tip o' the pin to osteele.com
        var fstring = fn['toString']();
        var s = '[class '.length;
        var e = fstring.indexOf(']');
        if ((fstring.indexOf('[class ') == 0) && (e == fstring.length -1)) {
          n = fstring.substring(s, e);
        }
      }
      if ((! mustBeUnique) || (fn === globalValue(n))) {
        return n;
      }
    }
    return null;
  }

  /**
   * @access private
   */
  /**
   * Adds unenumerable object properties for DHMTL runtime
   *
   * @access private
   */
  override function objectOwnProperties (obj:*, names:Array=null, indices:Array=null, limit:Number=Infinity, nonEnumerable:Boolean=false) {
    // TODO [2008-09-11 hqm] not sure what to do here, maybe we can use the introspection API
    // flash.utils.describeType() to at least enumerate public properties... 
    return super.objectOwnProperties(obj, names, indices, limit,nonEnumerable);

  }
}

var Debug = new LzAS3DebugService(null);
var __LzDebug = Debug;


