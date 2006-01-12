/******************************************************************************
 * LzFlashRemote.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// This file implements a remote debug protocol using Flash's LocalConnection API.
// When the app starts up, if the query arg lzconsoledebug (global.lzconsoledebug)
// is defined, then a local connection is opened to a well known connection name.
// If a query arg named 'lzappuid' is supplied, that is appended to the connection name,
// to allow multiple apps to be debugged with different connection names.


if ($debug) {

} else {
    // Define placeholder Debug object to forward messages to console
    _root.Debug = new Object;
    _root.__LzDebug = Debug;
}

__LzDebug.consoleConnected = false;
__LzDebug.consoleMsgQueue = [];

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.queueConsoleMsg = function (msg) {
    this.consoleMsgQueue[this.consoleMsgQueue.length] = msg;
}

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.sendQueuedConsoleMsgs = function () {
    for (var i = 0; i < this.consoleMsgQueue.length; i++) {
        var msg = this.consoleMsgQueue[i];
        this.cdSendMsg(msg);
    }
}

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.cdSendMsg = function (data) {
    if (this.consoleConnected) {
        if (data instanceof LzWarning) {
            //Debug.write("sending warning", data);
            this.receivingLC.send(this.consolename, "debugWarning", data.file, data.line, data.message.toString());
        } else if (data instanceof LzMessage) {
            //Debug.write("sending message", data.toString());
            this.receivingLC.send(this.consolename, "debugResult", data.message.toString(), null);
        } else {
            //Debug.write("sending data", data);
            this.receivingLC.send(this.consolename, "debugResult", data, null);
        }
    } else {
        this.queueConsoleMsg(data);
    }
}

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.cdEvalExpression = function (expr) {
    //Debug.write('cdEvalExpression: '+expr);
        __LzDebug.inEvalRequest = true;
        __LzDebug.crdbloader.request( {  lz_load : false,
                                lzt : "eval",
                                proxied: true,
                                lz_script : "#file evalString\n#line 0\n" + expr } );
}

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.makeConsoleRDBLoader = function () {
    this.crdbloader = new LzLoader(_root.canvas, { attachname: 'crdebugloader' });
    this.crdbloader.queuing = true;
}

//=============================================================================
// @keywords private
// query arg lzconsoledebug indicates that we want to run the console debugger
// query arg lzappuid is an optional application connection id
// 
//=============================================================================
__LzDebug.startupConsoleRemote = function () {
    if (typeof(_root.lzconsoledebug) != 'undefined') {
        Debug.write('startupConsoleRemote executing');
        __LzDebug.consoleDebug = true;
        __LzDebug.makeConsoleRDBLoader();
        __LzDebug.createLocalConnections();
        __LzDebug.openConsoleConnection();
    }
}

//=============================================================================
// @keywords private
//=============================================================================
// The console sends to indicate it is alive and listening.
__LzDebug.consoleAlive = function(val) { 
    __LzDebug.consoleConnected = true;
    __LzDebug.sendQueuedConsoleMsgs();
}


//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.localConnectionPropertyList = function(objid) { 
    //
}


//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.createLocalConnections = function () {
    var appname = LzBrowser.getBaseURL().file;
    __LzDebug.listenername = "lc_appdebug_"+appname
    __LzDebug.consolename = "lc_consoledebug_"+appname
}

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.openConsoleConnection = function () {
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


//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.writeConsoleInitMessage = function () {
    this.cdSendMsg("connection from app: " +
                   LzBrowser.getLoadURLAsLzURL() + 
                   ", build:  "+_root.canvas.build + 
                   ", lpsversion: "+ _root.canvas.lpsversion + 
                   ", lpsrelease: "+ _root.canvas.lpsrelease +
                   ", runtime: " + _root.canvas.runtime);
}

// This will get overridden if the LzDebugWindow gets instantiated
_root.Debug.displayResult = __LzDebug.cdSendMsg;

