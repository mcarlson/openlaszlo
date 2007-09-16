<library>
<include href="xmlrpcmessage.js" />
<include href="rpc.js" />
<script when="immediate">
<![CDATA[


/* LZ_COPYRIGHT_BEGIN */
/****************************************************************************
 * Copyright (c) 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.       *
 * Use is subject to license terms                                          *
 ****************************************************************************/
/* LZ_COPYRIGHT_END */

//======================================================================
// DEFINE OBJECT: LzJavaRPC
//
// Implements an object to make remote java direct and XMLRPC calls.
//======================================================================
class LzJavaRPC extends LzRPC {

//------------------------------------------------------------------------------
// Get object from server.
//
// @param LzDelegate delegate: delegate to call when object is returned.
// @param String scope: object scope. one of 'session', 'webapp', or
// 'static'.
// @param String classname: class of object to get.
// @param String oname: remote object name. Static objects ignore this value.
// @param Boolean secure: if true, make secure request.
// @param Integer secureport: port to use for secure request. This is ignored if
// secure is false.
// @return sequence number of request.
//------------------------------------------------------------------------------
function loadObject (delegate, opts, secure, secureport) {

    var classname = opts['classname'];
    var mesg = new XMLRPCMessage(classname + ".__LZload");

    var params = opts['params'];
    if (params) {
        for (var i=0; i < params.length; i++) {
            mesg.addParameter(LzBrowser.xmlEscape(params[i]));
        }
    }

    var o = this.__LZgetBasicLoadParams('POST');

    // op=get: just load an object if it exists, else server returns error
    // op=create: create an object if it doesn't exist, else load it. If
    // op=create&clobber=1, then always create an object.
    var lo = opts['loadoption'];
    if ( lo == 'create' ) {
        o['op'] = 'create';
        o['clobber'] = 1;
    } else if ( lo == 'loadonly' ) {
        o['op'] = 'get';
    } else if ( lo == 'loadcreate' ) {
        o['op'] = 'create';
    } else {
        Debug.write('LzJavaRPC.loadObject ERROR: no such op ', lo);
        return;
    }

    o['url'] = 'java://' + classname;
    o['handler'] = classname;
    o['oname'] = opts['oname'];
    o['scope'] = opts['scope'];
    o['lzpostbody'] = mesg.xml();

    o.opinfo = {};

    return this.request( o, delegate, secure, secureport );
}


//------------------------------------------------------------------------------
// Remove remote object. If session object, remove and remove object from
// session. If web application object, remove and remove object from
// web application.
//
// @param LzDelegate delegate: delegate to call when result from remove call is
// received.
// @param Object opts: 
//     classname, oname, scope XXXX write API doc here
// @param Boolean secure: if true, make secure request.
// @param Integer secureport: port to use for secure request. This is ignored if
// secure is false.
// @return sequence number of request.
//------------------------------------------------------------------------------
function unloadObject (delegate, opts, secure, secureport) {

    var classname = opts['classname'];
    var oname = opts['oname'];
    var scope = opts['scope'];

    var mesg = new XMLRPCMessage(classname + ".__LZunload");
    var o = this.__LZgetBasicLoadParams('POST');
    o['op'] = "destroy";
    o['url'] = 'java://' + opts['classname'];
    o['handler'] = classname;
    o['oname'] = oname;
    o['scope'] = scope;
    o['lzpostbody'] = mesg.xml();

    return this.request( o, delegate, secure, secureport );
}


//------------------------------------------------------------------------------
// Make remote request. Data will be the return value of the remote method
// call, e.g., string, integer, array, struct, etc.  Errors are returned like:
//
//     { status: STATUS, message: MESSAGE }
//
// where STATUS is one of 'ok' or 'error'.
//
// @param LzDelegate delegate: delegate to call when object is returned.
// @param Array args: array of argument parameters for remote function.
// @param Object opts: options to add to request: 
//
//     opts['classname']: java classname, like 'org.openlaszlo.MyClass'.
//     opts['methodname']: name of method to invoke in server, like
//         "CLASSNAME.METHOD".
//     opts['oname'] unique name of server object for invoking a session or
//         webapp object.
//     opts['scope'] scope of object; one of 'session', 'webapp', or 'static'.
//     opts['doreq'] if value is 1, adds http request to remote method call. 
//     opts['dores'] if value is 1, adds http response to remote method call, 
//
// @param Boolean secure: if true, make secure request.
// @param Integer secureport: port to use for secure request. This is ignored if
// secure is false.
// @return sequence number of request.
//------------------------------------------------------------------------------
function invoke (delegate, args, opts, secure, secureport){

    if ( ! delegate instanceof LzDelegate ) {
        Debug.write("ERROR: LzDelegate is required, got:", delegate);
        return;
    }

    var methodname = opts['methodname'];
    var mesg = new XMLRPCMessage(methodname);
    for (var i=0; i < args.length; i++) {
        mesg.addParameter(LzBrowser.xmlEscape(args[i]));
    }

    var o = this.__LZgetBasicLoadParams('POST');
    o['url'] = "java://" + opts['classname'];
    o['lzpostbody'] = mesg.xml();
    o['objectreturntype'] = opts['objectreturntype'];
    o.opinfo = {};

    // Add options for remote java object
    for (var k in opts) {
        o[k] = opts[k];
        o.opinfo[k] = opts[k];
    }

    return this.request( o, delegate, secure, secureport );
}
}


// global JavaRPC service
var LzJavaRPCService = new LzJavaRPC();


]]>
</script>
</library>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- @LZX_VERSION@                                                         -->
