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
    #passthrough (toplevel:true) {  
    import flash.net.*;
    import flash.events.*;
    import flash.display.*;
    import flash.utils.*;
    import flash.system.*;
    }#

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
      this.receivingLC.send(this.consolename, "debugWarning", msg.file, msg.line, msg['toHTML']());
    } else if (msg is LzMessage) {
      //Debug.write("sending message", msg.toString());
      this.receivingLC.send(this.consolename, "debugResult", msg['toHTML'](), null);
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
        str = msg['toHTML']();
      } else {
        str = String(msg)['toHTML']();
      }
    } catch (e) {
      str  = '' + msg;
    };
    this.addHTMLText(str);
  };

  /**
   * @access private
   */
  override function echo (str, newLine:Boolean=true) {
    this.addHTMLText('<font color="#00CC00">' + str + '</font>' + (newLine?'\n':''));
  }

  /**
   * @access private
   */
    override function makeObjectLink (rep:String, id:*, attrs=null) {
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
        // Send EVAL request to LPS server
        // It doesn't matter what path/filename we use, as long as it has ".lzx" suffix, so it is
        // handled by the LPS. The lzt=eval causes the request to be served by the EVAL Responder.
        var url = "hello.lzx?lzr=swf9&lz_load=false&lzt=eval&lz_script=" + encodeURIComponent(expr)+"&lzbc=" +(new Date()).getTime();
        debugloader.load(new URLRequest(url),
                         new LoaderContext(false,
                                           new ApplicationDomain(ApplicationDomain.currentDomain)));
  };

  /**
   ** Platform-specific bits
   **/

  /** @access private */
  var debugloader:Loader;

  /**
   * @access private
   */
  function makeConsoleRDBLoader () {
      debugloader = new Loader();
      debugloader.contentLoaderInfo.addEventListener(Event.INIT, debugEvalListener);
  };

  // Debugger loader completion handler 
  function debugEvalListener (e:Event):void {
      e.target.loader.unload();
      //DebugExec(e.target.content).doit();
  }


  /**
   * The console sends to indicate it is alive and listening.
   * must be public for LocalConnection to use it.
   */
  public function consoleAlive (val) {
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

  /** RPC handler function for eval(); must be public
   */
  public function evalExpr(...args) {
      Debug.doEval.apply(this, args);
  }

  /** RPC handler to display a value; must be public */
  public function displayObj(...args) {
      Debug.displayObj.apply(Debug, args);
  }



  /**
   * @access private
   */
  function openConsoleConnection () {
    //this.write("Application: "+lz.Browser.getLoadURLAsLzURL()+" connected to debug console.");
    this.receivingLC = new LocalConnection();
    receivingLC.client = this;

    receivingLC.connect(this.listenername);
    this.writeConsoleInitMessage();
  };

};
