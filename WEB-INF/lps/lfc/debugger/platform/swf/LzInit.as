/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

// Loaded as the last thing in LaszloLibrary to give the debugger a
// chance to initialize after all other code has been loaded

// Scope the #pragma
{
#pragma 'warnUndefinedReferences=true'

  // Name all global singletons
  // N.B. function expression avoids polluting module with temp vars
  (function () {
    var module = $modules.lz;
    var hide = ['_dbg_name'];
    for (var name in module) {
      var obj = module[name];

      if (obj instanceof Object &&
          obj.__proto__ === Object.prototype &&
          (! obj.hasOwnProperty('_dbg_name'))) {
        obj._dbg_name = '#' + name;
        ASSetPropFlags(obj, hide, 1, 1);
      }
    }
  })();
}
// #pragma 

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

