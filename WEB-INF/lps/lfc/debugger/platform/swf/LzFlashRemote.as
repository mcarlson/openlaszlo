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
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  */


if ($debug) {

} else {
    /** Define placeholder Debug object to forward messages to console
      * @access private
      */
    Debug = new Object;
    
    /** @access private */
    __LzDebug = Debug;
}

Debug.consoleConnected = false;
Debug.consoleMsgQueue = [];

/**
  * @access private
  */
Debug.queueConsoleMsg = function (msg) {
    this.consoleMsgQueue[this.consoleMsgQueue.length] = msg;
}

/**
  * @access private
  */
Debug.sendQueuedConsoleMsgs = function () {
    for (var i = 0; i < this.consoleMsgQueue.length; i++) {
        var msg = this.consoleMsgQueue[i];
        this.cdSendMsg(msg);
    }
}

/**
  * @access private
  */
Debug.cdSendMsg = function (data) {
    if (this.consoleConnected) {
        if (data instanceof LzSourceMessage) {
            //Debug.write("sending warning", data);
            this.receivingLC.send(this.consolename, "debugWarning", data.file, data.line, data.toHTML());
        } else if (data instanceof LzMessage) {
            //Debug.write("sending message", data.toString());
            this.receivingLC.send(this.consolename, "debugResult", data.toHTML(), null);
        } else {
            //Debug.write("sending data", data);
            this.receivingLC.send(this.consolename, "debugResult", data, null);
        }
    } else {
        this.queueConsoleMsg(data);
    }
}

/**
  * @access private
  */
Debug.cdEvalExpression = function (expr) {
    Debug.inEvalRequest = true;
    var req = "foo.lzx?lzt=eval&lz_script="+escape("#file evalString\n#line 0\n" + expr);
    Debug.crdbloader.loadMovie( req );
}

/**
  * @access private
  */
Debug.makeConsoleRDBLoader = function () {
    // use a movieclip for loading executable code
    this.crdbloader =_root.attachMovie( "empty" , 'lzconsoledebugloader' , 9259 );
}


/**
  * @access private
  * query arg lzconsoledebug indicates that we want to run the console debugger
  * query arg lzappuid is an optional application connection id
  * 
  */
Debug.startupConsoleRemote = function () {
  if (typeof(lzconsoledebug) != 'undefined') {
    Debug.write('startupConsoleRemote executing');
    Debug.consoleDebug = true;
    Debug.makeConsoleRDBLoader();
    Debug.createLocalConnections();
    Debug.openConsoleConnection();
    // redefine Debug.addText to output to the remote connection
    // @keywords private -- appease doc tool doc tool
    Debug.addHTMLText = function (val) {
      Debug.cdSendMsg(val);
    };
    // @keywords private -- appease doc tool doc tool
    Debug.addText = function (msg) {
      var str;
      if (msg && 'toHTML' in msg) {
        str = msg.toHTML();
      } else if ('toHTML' in String) {
        str = String(msg).toHTML();
      } else {
        str = '' + msg;
      }
      this.addHTMLText(str);
    };
    // @keywords private -- appease doc tool doc tool
    Debug.makeObjectLink = function (rep, id, attrs) {
      var color = '#0000ff';
      switch (arguments.length) {
        case 1:
          id = this.IDForObject(rep);
        case 2:
          break;
        case 3:
          if (attrs.color) { color = attrs.color };
      }
      if (id != null) {
        return '<a href="asfunction:_root.canvas.displayObjectByID,' + id + '"><font color="' + color + '">' + rep +"</font></a>";
      }
      return rep;
    };
  }
}

/**
  * @access private
  */
// The console sends to indicate it is alive and listening.
Debug.consoleAlive = function(val) { 
    Debug.consoleConnected = true;
    Debug.sendQueuedConsoleMsgs();
}


/**
  * @access private
  */
Debug.localConnectionPropertyList = function(objid) { 
    //
}


/**
  * @access private
  */
Debug.createLocalConnections = function () {
    //var appname = LzBrowser.getBaseURL().file;
    // [TODO hqm 2006-05: use a constant app name of "XXX", while we debug
    // the remote debugger]
    var appname = "XXX";
    Debug.listenername = "lc_appdebug"+appname
    Debug.consolename = "lc_consoledebug"+appname
}

/**
  * @access private
  */
Debug.openConsoleConnection = function () {
    //this.write("Application: "+LzBrowser.getLoadURLAsLzURL()+" connected to debug console.");
    this.receivingLC = new LocalConnection();

    // Set up RPC functions:
    // hook for evaluating an expression
    this.receivingLC.evalExpr = this.cdEvalExpression;
    // hook for getting the list of property names of an object, by id
    this.receivingLC.propList = this.localConnectionPropertyList;
    // signal from console that the console is up and listening
    this.receivingLC.consoleAlive = this.consoleAlive;

    this.receivingLC.connect(this.listenername);
    this.writeConsoleInitMessage();

    for (var i = 0; i < this.saved_msgs.length; i++) {
        this.cdSendMsg(this.saved_msgs[i]);
    }

}



/**
  * @access private
  */
Debug.writeConsoleInitMessage = function () {
    if (typeof(canvas) != 'undefined') {
        this.cdSendMsg("connection from app: " +
                       LzBrowser.getLoadURLAsLzURL() + 
                       ", build:  "+ canvas.lpsbuild + 
                       ", lpsversion: "+ canvas.lpsversion + 
                       ", lpsrelease: "+ canvas.lpsrelease +
                       ", runtime: " + canvas.runtime);
    } else {
        this.cdSendMsg("connection from app: " +
                       //LzBrowser.getLoadURLAsLzURL() +
                       " ['canvas' has not been defined yet, eval won't work] ");
    }
}

