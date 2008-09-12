/**
  * This file implements a remote debug protocol using Flash's LocalConnection API.
  * When the app starts up, if the query arg lzconsoledebug (global.lzconsoledebug)
  * is defined, then a local connection is opened to a well known connection name.
  * If a query arg named 'lzappuid' is supplied, that is appended to the connection name,
  * to allow multiple apps to be debugged with different connection names.
  *
  * @access private
  * @topic Kernel
  * @subtopic AS2
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  */

class LzFlashRemoteDebugConsole extends LzBootstrapDebugConsole {
#pragma "warnUndefinedReferences=true"
  var consoleConnected = false;

  function LzFlashRemoteDebugConsole () {
    super();
    // query arg lzconsoledebug indicates that we want to run the console debugger
    // query arg lzappuid is an optional application connection id
    // Debug.log('startupConsoleRemote executing');
    this.makeConsoleRDBLoader();
    this.createLocalConnections();
    this.openConsoleConnection();
  };

  var receivingLC:LocalConnection;

  /**
   * @access private
   */
  override function addHTMLText (msg) {
    if (! this.consoleConnected) {
      this.saved_msgs.push(msg);
      return;
    }
    if (msg is LzSourceMessage) {
      //Debug.write("sending warning", msg);
      this.receivingLC.send(this.consolename, "debugWarning", msg.file, msg.line, msg.toHTML());
    } else if (msg is LzMessage) {
      //Debug.write("sending message", msg.toString());
      this.receivingLC.send(this.consolename, "debugResult", msg.toHTML(), null);
    } else {
      //Debug.write("sending msg", msg);
      this.receivingLC.send(this.consolename, "debugResult", msg, null);
    }
  };

  /**
   * @access private
   */
  override function addText (msg) {
    if (! this.consoleConnected) {
      this.saved_msgs.push(msg);
      return;
    }
    var str;
    try {
      if (msg && msg['toHTML'] is Function) {
        str = msg.toHTML();
      } else {
        str = String(msg).toHTML();
      }
    } catch (e) {
      str  = '' + msg;
    };
    this.addHTMLText(str);
  };

  /**
   * @access private
   */
  function echo (str, newLine:Boolean=true) {
    this.addHTMLText('<font color="#00CC00">' + str + '</font>' + (newLine?'\n':''));
  }

  /**
   * @access private
   */
  override function makeObjectLink (rep, id:Number, attrs=null) {
    var color = (attrs && attrs['color']) ? attrs.color : '#0000ff';
    if (id != null) {
      // Note this is invoking a trampoline in the console that will
      // call back to us to display the object
      return '<a href="asfunction:_root.canvas.displayObjectByID,' + id + '"><font color="' + color + '">' + rep +"</font></a>";
    }
    return rep;
  };

  /** @access private */
  var evalcount = 0;

  /**
   * @access private
   */
  override function doEval (expr:String) {
    // The eval responder will compile the expression inside a
    // callback to Debug.displayResult
    var req = "__remote-debugger.lzx?lzr=swf8&lzt=eval&lz_script="+escape("#file remote-eval-" + (this.evalcount++) + "\n#line 0\n" + expr);
    this.crdbloader.loadMovie( req );
  };

  /**
   ** Platform-specific bits
   **/

  /** @access private */
  var crdbloader;

  /**
   * @access private
   */
  function makeConsoleRDBLoader () {
    // use a movieclip for loading executable code
    this.crdbloader =_root.attachMovie( "empty" , 'lzconsoledebugloader' , 9259 );
  };

  /**
   * The console sends to indicate it is alive and listening.
   * @access private
   */
  function consoleAlive (val) {
    this.consoleConnected = true;
    // Replay saved messages
    var sm = this.saved_msgs;
    var sml = sm.length;
    for (var i = 0; i < sml; i++) {
      this.addText(sm[i]);
    }
  };

  /** @access private */
  var listenername;
  /** @access private */
  var consolename;

  /**
   * @access private
   */
  function createLocalConnections () {
    //var appname = lz.Browser.getBaseURL().file;
    // [TODO hqm 2006-05: use a constant app name of "XXX", while we debug
    // the remote debugger]
    var appname = "XXX";
    this.listenername = "lc_appdebug"+appname;
    this.consolename = "lc_consoledebug"+appname;
  };

  /**
   * @access private
   */
  function writeConsoleInitMessage () {
    if (typeof(LzCanvas) != 'undefined') {
      this.addText("connection from app: \n" + LzCanvas.versionInfoString());
    } else {
      this.addText("connection from app: " +
                   //lz.Browser.getLoadURLAsLzURL() +
                   " ['canvas' has not been defined yet, eval won't work] ");
    }
  };

  /**
   * @access private
   */
  function openConsoleConnection () {
    //this.write("Application: "+lz.Browser.getLoadURLAsLzURL()+" connected to debug console.");
    var lc = new LocalConnection();
    var that = this;

    // Set up RPC functions:
    // hook for evaluating an expression
    lc.evalExpr = function (...args) { Debug.doEval.apply(Debug, args) };
    lc.displayObj = function (...args) { Debug.displayObj.apply(Debug, args); }
    // Unused
//     // hook for getting the list of property names of an object, by id
//     lc.propList = that.localConnectionPropertyList;
    // signal from console that the console is up and listening
    lc.consoleAlive = function (...args) { that.consoleAlive.apply(that, args) };

    this.receivingLC = lc;

    lc.connect(this.listenername);
    this.writeConsoleInitMessage();
  };

};
