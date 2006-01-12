/******************************************************************************
 * LzRemote.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// This file implements the remote debugger protocol.
// When the app starts up, if the query arg remotedebug (global.remotedebug)
// is defined, it is treated as a TCP port number and a remote debug
// socket is opened to that port.

__LzDebug.seqnum = 0;
__LzDebug.inEvalRequest = false;

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.sockOpen = function (port) {
  var url = LzBrowser.getLoadURLAsLzURL();
  // Security requires us to talk back to the server we were loaded from
  var host = url.host;
  this.xsock = new XMLSocket();
  this.xsock.onClose = this.brokensocket;
  this.xsock.onXML = this.socketXMLAvailable;
  if (! this.xsock.connect(host, port)) {
    Debug.log("remote debugger could not connect to listener " + host + ":" + port);
  }
  this.writeInitMessage();
}


//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.writeInitMessage = function () {
    var filename = LzBrowser.getLoadURLAsLzURL();
    var myXML = new XML();
    var init = myXML.createElement("init"); 
    myXML.appendChild(init);
    init.attributes.filename         = filename;
    init.attributes.language         = "LZX";
    init.attributes.protocol_version = "1.0";
    init.attributes.build      = _root.canvas.build;
    init.attributes.lpsversion = _root.canvas.lpsversion;
    init.attributes.lpsrelease = _root.canvas.lpsrelease;
    init.attributes.runtime    = _root.canvas.runtime;
    init.attributes.appid      = "0";
    this.xsock.send(myXML);
}


//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.sockWriteWarning = function (filename, lineNumber, msg){
    var myXML = new XML();
    var warn = myXML.createElement("warning"); 
    myXML.appendChild(warn);
    warn.attributes.filename = filename;
    warn.attributes.line = lineNumber;
    warn.attributes.msg = msg;
    this.xsock.send(myXML);
}

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.sockWriteLog = function (msg) {
    var myXML = new XML();
    var response = myXML.createElement("log"); 
    myXML.appendChild(response);
    response.attributes.msg = msg;
    this.xsock.send(myXML);
}

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.sockWrite = function (s) {
    this.xsock.send(s);
    this.xsock.send("\n");
    return s;
}

//=============================================================================
// @keywords private
// Writes out an object as XML
//=============================================================================
__LzDebug.sockWriteAsXML = function (obj, seqnum) {
    var myXML = new XML();
    var response = myXML.createElement("response"); 
    response.attributes.seq = seqnum;
    myXML.appendChild(response);

    var val = myXML.createElement("value"); 
    response.appendChild(val);

    var objtype = typeof(obj);
    val.attributes.type = __LzDebug.__typeof(obj);
    val.attributes.value = String(obj);
    if (objtype == "object") {
        var id = __LzDebug.IDForObject(obj);
        if (id != null) {
            val.attributes.id = id;
        }
    }

    for (var attr in obj) {
        var child = obj[attr];
        var prop = myXML.createElement("property"); 
        prop.attributes.name = attr;
        prop.attributes.type = __LzDebug.__typeof(child);
        prop.attributes.value = String(child);

        var objtype = typeof(child);
        if (objtype == "object") {
            var id = __LzDebug.IDForObject(child);
            if (id != null) {
                prop.attributes.id = id;
            }
        }

        val.appendChild(prop);
    }

    for (var i = 0; i < this.xmlwarnings.length; i++) {
        var w = this.xmlwarnings[i];
        var filename = w[0];
        var line = w[1];
        var msg = w[2];
        var warn = myXML.createElement("warning"); 
        warn.attributes.filename = filename;
        warn.attributes.line = line;
        warn.attributes.msg = msg;
        response.appendChild(warn);
    }

    this.xsock.send(myXML);
    __LzDebug.inEvalRequest = false;
    return obj;
}

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.sockClose = function () {
 _root.__LzDebug.xsock.close();
}

//=============================================================================
// @keywords private
// send message to server that socket is gone
//=============================================================================
__LzDebug.brokensocket = function () {
    Debug.write("socket connection is broken");
}

////////////////////////////////////////////////////////////////
// Redefine the handler for eval warnings, to grab them so we can send them
// back as XML.

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.resetWarningHistory = function () {
    _root.__LzDebug.xmlwarnings = [];
}

__LzDebug.resetWarningHistory();

////////////////////////////////////////////////////////////////

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.socketXMLAvailable = function (doc) {
    var e = doc.firstChild;
    var rloader = __LzDebug.rdbloader;
    if (e != null) {
        // clear warnings history
        __LzDebug.resetWarningHistory();
        __LzDebug.inEvalRequest = true;
        var seqnum = e.attributes['seq'];
        if (seqnum == null) {
            seqnum = __LzDebug.seqnum++;
        }

        if (e.nodeName == "exec") {
            var expr = e.firstChild.nodeValue;
            rloader.request( { lz_load : false,
                           lzt : "eval",
                           proxied: true,
                           lzrdbseq : seqnum,
                           lz_script : "#file evalString\n#line 0\n" + expr } );
        
        } else if (e.nodeName == "eval") {
            var expr = e.firstChild.nodeValue;
            rloader.request( {  lz_load : false,
                                lzt : "eval",
                                proxied: true,
                                lzrdbseq : seqnum,
                                lz_script : "#file evalString\n#line 0\n" + expr } );
        } else if (e.nodeName == "inspect") {
            __LzDebug.inEvalRequest = false;
            var id = e.attributes.id;
            __LzDebug.sockWriteAsXML(__LzDebug.ObjectForID(id), seqnum);
        } else {
            __LzDebug.inEvalRequest = false;
            __LzDebug.sockWrite("<response seq='"+seqnum+"'><error msg='unknown remote debug command'>"+e.nodeName+"</error></response>");
        }
    } else {
        __LzDebug.inEvalRequest = false;
        __LzDebug.sockWrite("<response seq='-1'><error msg='null remote debug command'/></response>");
    }
}

//=============================================================================
// @keywords private
//=============================================================================
__LzDebug.makeRDBLoader = function () {
    this.rdbloader = new LzLoader(_root.canvas, { attachname: 'rdebugloader' });
    this.rdbloader.queuing = true;
}

//=============================================================================
// @keywords private
// query arg  'remotedebug', if supplied, specifies a TCP port to connect to
//=============================================================================
__LzDebug.startupRemote = function () {
    if (typeof(_root.remotedebug) != 'undefined') {
        __LzDebug.remoteDebug = true;
        __LzDebug.makeRDBLoader();
        __LzDebug.sockOpen(_root.remotedebug);
    }
}




