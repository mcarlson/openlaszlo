/* -*- mode: JavaScript; c-basic-offset: 2; -*- */

/**
  * Runtime support for Debug
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LZX
  * @subtopic Debugging
  */

/** The HTML debug window
  * @access private
  */
Debug.DebugWindow = null;

/**
  * @access private
  * Instantiates an instance of the user Debugger window
  * Called last thing by the compiler when the app is completely loaded.
  */
Debug.makeDebugWindow = function () {
  // The application and debugger are sibling iframes in the
  // dhtml embedding.
  try {
    this.DebugWindow = window.parent.frames['LaszloDebugger'];
  } catch (e) {
    // But not in Rhino
  };

  // Name all global singletons
  var module = $modules.lz;
  var idp = new RegExp('^[_$\\w\\d]+$');
  for (var name in module) {
    if (name.match(idp)) {
      try {
        var obj = module[name];
        if (obj instanceof Object &&
            obj.constructor &&
            (! obj.hasOwnProperty('_dbg_name'))) {
          obj._dbg_name = '#' + name;
        }
      }
      catch (e) {
        //        Debug.debug("Can't name %w", name);
      }
    }
    // Some browsers don't enumerate these
    var ptypes = {Array: Array, Boolean: Boolean, Date: Date,
                  Function: Function, Number: Number,
                  Object: Object, String: String};
    for (var n in ptypes) {
      var p = ptypes[n];
      try {
        if (! Debug.functionName(p)) {
          p._dbg_name = n;
        }
      }
      catch (e) {
//        Debug.debug("Can't name %w", name);
      }
    }
  }
}

/**
  * @access private
  */
Debug.clear = function () {
  var dw = this.DebugWindow;
  dw.document.body.innerHTML = '';
};


/**
  * @access private
  */
Debug.addHTMLText = function (str) {
  var dw = this.DebugWindow;
  var dwd = dw.document;
  var span = dwd.createElement('span');
  var dwdb = dwd.body;
  // IE does not display \n in white-space: pre, so we translate...
  span.innerHTML = '<span class="OUTPUT">' + str.split('\n').join('<br />') + '</span>';
  dwdb.appendChild(span);
  // Duplicated from __write, for direct calls to this
  this.atFreshLine = (str.charAt(str.length-1) == '\n');
  if (str.length) { this.atPrompt = false; }
  // Scroll to end
  dw.scrollTo(0, dwdb.scrollHeight);
}

/**
  * @access private
  */
Debug.addText = function (msg) {
  var str;
  try {
    if (msg && msg['toHTML']) {
      str = msg.toHTML();
    } else {
      str = String(msg).toHTML();
    }
  } catch (e) {
    str = msg;
  }
  try {
    this.addHTMLText(str);
  } catch (e) {
    try {
      // Rhino?
      if (print.length > 0) {
        print(str);
        return;
      }
    } catch (e) {};
  }
}

/**
  * Send a message to printed to the log file
  * @param string msg: the message to be logged
  * @devnote Implementation of Debug.log  does not depend on any of
  * the LFC working and hence can be used from startup on.
  * @access public
  */
Debug.log = function (msg) {
  // Log to firebug console, if it exists
  if (('console' in global) && (typeof console.log == 'function')) {
    var fn = 'log';
    if (msg instanceof LzError) {
      fn = 'error';
    } else if (msg instanceof LzWarning) {
      fn = 'warn';
    } else if (msg instanceof LzInfo) {
      fn = 'info';
    } else if (msg instanceof LzDebug) {
      fn = 'debug';
    }
    if (typeof console[fn] != 'function') {
      fn = 'log';
    }
    if ((msg instanceof LzMessage) || (msg instanceof LzSourceMessage)) {
      console[fn].apply(console, msg.toArray());
    } else {
      console[fn]('' + msg);
    }
  }
}

/**
  * @access private
  */
Debug.displayResult = function (result) {
  if (typeof(result) != 'undefined') {
    // Advance saved results if you have a new one
    if (result !== this.environment._) {
      if (typeof(this.environment.__) != 'undefined') {
        this.environment.___ = this.environment.__;
      }
      if (typeof(this.environment._) != 'undefined') {
        this.environment.__ = this.environment._;
      }
      this.environment._ = result;
    }
  }
  this.freshLine();
  // Output any result from the evalloader
  if (typeof(result) != 'undefined') {
    this.format("%w", result);
  }
  this.freshPrompt();
}

/**
  * @access private
  */
Debug.displayObj = function (id) {
  var obj = this.ObjectForID(id);
  // Make it look like you executed a command, even though
  // you don't need to compile to do this
  this.freshPrompt();
  this.addHTMLText('<span class="DEBUG">' +
                   this.formatToString("Debug.inspect(%0.48w)", obj).toHTML() +
                   '</span>\n');
  this.displayResult(this.inspect(obj));
}

/**
  * @access private
  */
Debug.doEval = function(expr) {
  #pragma "warnUndefinedReferences=false"
  //   this.commandhistory[this.commandhistory.length] = expr;
  //   this.commandhistory_ptr = this.commandhistory.length;
  // Echo input to output
  this.freshPrompt();
  this.addHTMLText('<span class="DEBUG">'+String(expr).toHTML()+"</span>\n");
  try {
    with (global) {
      with (this.environment) {
        var value = eval(expr);
      }
    }
    this.displayResult(value);
  }
  catch (e) {
    Debug.error(e);
  }
}

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

/**
  * @access private
  */
Debug.enableInspectMouseHandlers = function(div,enable) {
  if (enable) {
    div.prev_onclick =  div.onclick;
    div.style.prev_border = div.style.border;
    div.style.prev_margin = div.style.margin;
    div.style.border = "1px solid red";
    div.style.margin = "-1px";
    div.onclick = function (e) { Debug.write('view = ', this.owner.owner); }
  } else {
    div.onclick =  div.prev_onclick;
    div.style.border = div.style.prev_border;
    div.style.margin = div.style.prev_margin;
    delete div.prev_onclick;
    delete div.prev_margin;
    delete div.prev_border;
  }
}

/**
  * Display outlines of all view sprite bounding boxes, clicking
  * on a view will print the view and parent chain to the debugger.
  * 
  * @param Boolean enable : enable or disable outlines
  * @param public
  */
Debug.showDivs = function (enable) {
  if (enable == null) enable = true;
  Debug._showDivs(canvas,enable);
}

/**
  * @access private
  */
Debug._showDivs = function (view,enable) {
  var k = view.sprite;
  if (k != null) {
    var div = k.__LZdiv;
    if (div != null) {
      this.enableInspectMouseHandlers(div,enable);
    }
  }
  for (var i = 0; i < view.subviews.length; i++) {
    var cv = view.subviews[i];
    Debug._showDivs(cv,enable);
  }
}
