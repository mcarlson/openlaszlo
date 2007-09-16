/******************************************************************************
 * LzRemote.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

// This file implements the remote debugger protocol.
// When the app starts up, if the query arg remotedebug (global.remotedebug)
// is defined, it is treated as a TCP port number and a remote debug
// socket is opened to that port.

Debug.seqnum = 0;
Debug.inEvalRequest = false;

/**
  * @access private
  */
Debug.sockOpen = function (port) {
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


/**
  * @access private
  */
Debug.writeInitMessage = function () {
    var filename = LzBrowser.getLoadURLAsLzURL();
    var myXML = new XML();
    var init = myXML.createElement("init"); 
    myXML.appendChild(init);
    init.attributes.filename         = filename;
    init.attributes.language         = "LZX";
    init.attributes.protocol_version = "1.0";
    init.attributes.build      = canvas.lpsbuild;
    init.attributes.lpsversion = canvas.lpsversion;
    init.attributes.lpsrelease = canvas.lpsrelease;
    init.attributes.runtime    = canvas.runtime;
    init.attributes.appid      = "0";
    this.xsock.send(myXML);
}


/**
  * @access private
  */
Debug.sockWriteWarning = function (filename, lineNumber, msg){
    var myXML = new XML();
    var warn = myXML.createElement("warning"); 
    myXML.appendChild(warn);
    warn.attributes.filename = filename;
    warn.attributes.line = lineNumber;
    warn.attributes.msg = msg;
    this.xsock.send(myXML);
}

/**
  * @access private
  */
Debug.sockWriteLog = function (msg) {
    var myXML = new XML();
    var response = myXML.createElement("log"); 
    myXML.appendChild(response);
    response.attributes.msg = msg;
    this.xsock.send(myXML);
}

/**
  * @access private
  */
Debug.sockWrite = function (s) {
    this.xsock.send(s);
    this.xsock.send("\n");
    return s;
}

/**
  * @access private
  * Writes out an object as XML
  */
Debug.sockWriteAsXML = function (obj, seqnum) {
    var myXML = new XML();
    var response = myXML.createElement("response"); 
    response.attributes.seq = seqnum;
    myXML.appendChild(response);

    var val = myXML.createElement("value"); 
    response.appendChild(val);

    var objtype = typeof(obj);
    val.attributes.type = Debug.__typeof(obj);
    val.attributes.value = String(obj);
    if (objtype == "object") {
        var id = Debug.IDForObject(obj);
        if (id != null) {
            val.attributes.id = id;
        }
    }

    for (var attr in obj) {
        var child = obj[attr];
        var prop = myXML.createElement("property"); 
        prop.attributes.name = attr;
        prop.attributes.type = Debug.__typeof(child);
        prop.attributes.value = String(child);

        var objtype = typeof(child);
        if (objtype == "object") {
            var id = Debug.IDForObject(child);
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
    Debug.inEvalRequest = false;
    return obj;
}

/**
  * @access private
  */
Debug.sockClose = function () {
 Debug.xsock.close();
}

/**
  * @access private
  * send message to server that socket is gone
  */
Debug.brokensocket = function () {
    Debug.error("socket connection is broken");
}

////////////////////////////////////////////////////////////////
// Redefine the handler for eval warnings, to grab them so we can send them
// back as XML.

/**
  * @access private
  */
Debug.resetWarningHistory = function () {
    Debug.xmlwarnings = [];
}

Debug.resetWarningHistory();

////////////////////////////////////////////////////////////////

/**
  * @access private
  */
Debug.socketXMLAvailable = function (doc) {
    var e = doc.firstChild;
    var rloader = Debug.rdbloader;
    if (e != null) {
        // clear warnings history
        Debug.resetWarningHistory();
        Debug.inEvalRequest = true;
        var seqnum = e.attributes['seq'];
        if (seqnum == null) {
            seqnum = Debug.seqnum++;
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
            Debug.inEvalRequest = false;
            var id = e.attributes.id;
            Debug.sockWriteAsXML(Debug.ObjectForID(id), seqnum);
        } else {
            Debug.inEvalRequest = false;
            Debug.sockWrite("<response seq='"+seqnum+"'><error msg='unknown remote debug command'>"+e.nodeName+"</error></response>");
        }
    } else {
        Debug.inEvalRequest = false;
        Debug.sockWrite("<response seq='-1'><error msg='null remote debug command'/></response>");
    }
}

/**
  * @access private
  */
Debug.makeRDBLoader = function () {
    this.rdbloader = new LzLoader(canvas, { attachname: 'rdebugloader' });
    this.rdbloader.queuing = true;
}

/**
  * @access private
  * query arg  'remotedebug', if supplied, specifies a TCP port to connect to
  */
Debug.startupRemote = function () {
    if (typeof(remotedebug) != 'undefined') {
        Debug.remoteDebug = true;
        Debug.makeRDBLoader();
        Debug.sockOpen(remotedebug);
    }
}




