<library>
<include href="xmlrpcmessage.js" />
<include href="rpc.js" />
<script>
<![CDATA[
#pragma 'warnUndefinedReferences=false' 

/* LZ_COPYRIGHT_BEGIN */
/****************************************************************************
 * Copyright (c) 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.       *
 * Use is subject to license terms                                          *
 ****************************************************************************/
/* LZ_COPYRIGHT_END */

//======================================================================
// DEFINE OBJECT: LzXMLRPC
//
// Implements an object to make remote java direct and XMLRPC calls.
//======================================================================
var LzXMLRPC = Class( "LzXMLRPC", LzRPC, function() {} );

// global XMLRPC service
LzXMLRPCService = new LzXMLRPC();

//------------------------------------------------------------------------------
// Make remote request. Data will be the return value of the remote method
// call, e.g., string, integer, array, struct, etc.  Errors are returned like:
//
//     { status: STATUS, message: MESSAGE }
//
// where STATUS is one of 'ok' or 'error'.
//
// @param LzDelegate delegate: delegate to call when object is returned.
// @param String handler: can be a java classname or URL. If classname, does
// java direct. If it's an URL, opts is ignored.
// @param String methodname: name of method to invoke in server, like
// "CLASSNAME.METHOD".
// @param Object opts: options to add to request: 
//
//     opts['oname'] unique name of server object for invoking a session or
//         webapp object.
//     opts['scope'] scope of object; one of 'session', 'webapp', or 'static'.
//     opts['doreq'] if value is 1, adds http request to remote method call. 
//     opts['dores'] if value is 1, adds http response to remote method call, 
//
// @param Array args: array of argument parameters for remote function.
// @param Boolean secure: if true, make secure request.
// @param Integer secureport: port to use for secure request. This is ignored if
// secure is false.
// @return sequence number of request.
//------------------------------------------------------------------------------
LzXMLRPC.prototype.invoke = function (delegate, args, opts, secure, secureport) {

    if ( delegate.__proto__ != _root.LzDelegate.prototype ) {
        _root.Debug.write("ERROR: LzDelegate is required, got:", delegate);
        return;
    }

    var service = opts['service'];
    if (service == null) {
        _root.Debug.write("ERROR: service not defined");
        return;
    }

    var index = service.indexOf("http:");
    if (index == -1 || index != 0) {
        Debug.write("xmlrpc.js ERROR: only HTTP XML-RPC services supported");
        return;
    }

    var handler = 'xmlrpc' + service.substring(4);

    var methodname = opts['methodname'];
    var mesg = new _root.XMLRPCMessage(methodname);
    for (var i=0; i < args.length; i++) {
        mesg.addParameter(_root.LzBrowser.xmlEscape(args[i]));
    }

    var o = this.__LZgetBasicLoadParams('POST');
    o['url'] = handler;
    o['headers'] = 'Content-Type: text/xml';
    o['lzpostbody'] = mesg.xml();

    o.opinfo = { service: service, methodname: methodname };

    return this.request( o, delegate, secure, secureport ); 
}

]]>
</script>
</library>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- @LZX_VERSION@                                                         -->
