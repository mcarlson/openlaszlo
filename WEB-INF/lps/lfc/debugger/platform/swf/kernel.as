/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/**
  * Runtime support for Debug
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LZX
  * @subtopic Debugging
  */

/*
 * Platform-specific support for LzFormat
 */

/**
  * Instantiates an instance of the user Debugger window
  * Called last thing by the compiler when the app is completely loaded.
  * @access private
  */
Debug.makeDebugWindow = function () {
  LzInstantiateView({attrs: {}, name: "LzDebugWindow"});
}

// Messages that will be displayed once the debug window is insantiated
// Messages are either LzMessage's or LzWarning 's that can be output
// using .toString() or .toHTML(), depending on the destination (log
// file or debug window, respectively)
Debug.saved_msgs = [];

/**
  * @access private
  */
Debug.addText = function (msg) {
  this.saved_msgs.push(msg);
}

/**
  * @access private
  */
Debug.addHTMLText = Debug.addText;

/**
  * Send a message to printed to the log file
  * @param string msg: the message to be logged
  * @devnote Implementation of Debug.log does not depend on any of
  * the LFC working and hence can be used from startup on.
  */
Debug.log = function (msg) {
  // send URL to LzServlet: lzt=eval lz_log=true lz_msg=$MSG
  var url = this['url'];
  if (! url) {
    url = _root._url; // LzBrowser.getLoadURL();
    var q = url.indexOf("?");
    if (q >= 0) {
      url = url.substring(0, q);
    }
    this.url = url;
  }
  url += "?lz_log=true&lzt=eval&lz_load=false&lz_script="+escape(String(msg));
  this.__line_buffer = "";
  // Flash-specific call -- 5 is magic?!
  loadVariables(url, 5);
}

/**
  * @access private
  */
Debug.displayResult = function (result) {
  if (typeof(result) != 'undefined') {
    // Advance saved results if you have a new one
    if (result !== _level0._) {
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
    this.format("%w", result);
  }
  this.freshPrompt();
}

/** This alias is usd to refer to the LFC debugger while doing the
  * surgery
  * @access private
  */
var __LzDebug = Debug;

// True until the window debugger is fully loaded
Debug.isLoading = true;


/*
 * Platform-specific support for LzMessage
 */

/**
  * @access private
  */
Debug.warnInternal = function (xtor, control, args) {
  var sourceMessage = LzSourceMessage;
  var level = sourceMessage.level
  if (level > sourceMessage.levelMax) { return; }
  try {
    sourceMessage.level = level + 1;
    // Safari and Firefox do not implement arguments as an array
    var msg = xtor.format.apply(xtor, [null, null].concat(Array.prototype.slice.call(arguments, 1)));
    {
      var mls = this.messageLevels;
      var t = xtor.prototype.type;
      // Default to printing any 'unknown' types
      if ((t in mls) ? (mls[t] >= mls[this.messageLevel]) : true) {
        this.freshLine();
        this.__write(msg);
      }
    }
  }
  finally {
    sourceMessage.level = level;
  }
  return msg;
}
