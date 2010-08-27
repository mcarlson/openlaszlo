/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
#include "pmrpc.js"
// register callback for lz.embed.iframemanager.callRPC()
pmrpc.register( {
  publicProcedureName: "callRPC",
  procedure: function(methodName, args) {
    var method = eval(methodName);
    //console.log('callRPC', methodName, method, args);
    if (method) {
        return method.apply(null, args);
    }
  }
} );

try {
    if (lz) {}
} catch (e) {
    lz = {};
}    

// send an event to the html component controlling this frame
lz.sendEvent = function(name, value) {
    //console.log('calling iframemanager.asyncCallback with args',window.name, name, value);
    var callobj = {
        destination: window.parent,
        publicProcedureName: 'asyncCallback',
        params: [window.name, name, value]
    }
    //callobj.onError = function(statusObj) { console.log('sendEvent error', callobj, statusObj); }
    pmrpc.call(callobj); 
}

