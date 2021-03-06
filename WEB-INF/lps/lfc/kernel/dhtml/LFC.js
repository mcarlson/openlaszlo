/**
  * LFC.js
  *
  * @copyright Copyright 2006-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  */

// Resource library
var LzResourceLibrary = {};

{
#pragma "profile=false"
    var getTimer = function() {
        return LzTimeKernel.getTimer();
    }
}

// FIXME: [2006-03-24 ptw] This will be wrong when there are modules.
// In the module world $modules.runtime = window and global =
// $modules.user
global = window;
