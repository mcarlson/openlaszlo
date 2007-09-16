/**
  * LFC.js
  *
  * @copyright Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  */

// Resource library
var LzResourceLibrary = {};


// Implement actionscript API to get ms since startup time 

{
#pragma "profile=false"
    var getTimer = function() {
        return (new Date()).valueOf() - getTimer.startTime;
    }    
}
getTimer.startTime = (new Date()).valueOf();

// FIXME: [2006-03-24 ptw] This will be wrong when there are modules.
// In the module world $modules.runtime = window and global =
// $modules.user
global = window;
