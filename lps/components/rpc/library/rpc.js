<library>
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
// DEFINE OBJECT: LzRPC
//
// Implements an object to make remote java direct and XMLRPC calls.
//======================================================================
var LzRPC = Class( "LzRPC", null, function () { } );

// object used for void return types
LzRPC.t_void = { type: 'void' };

// @keywords private
LzRPC.__LZloaderpool = [];


//------------------------------------------------------------------------------
// @param Number num: number to pass down to explicitly cast to a double
//------------------------------------------------------------------------------
LzRPC.DoubleWrapper = function(num) {
    this.num = num;
}

//------------------------------------------------------------
// Global RPC sequence number for server requests.
//------------------------------------------------------------
LzRPC.__LZseqnum = 0;

//------------------------------------------------------------------------------
// Override loader's returnData function. Call appropritate delegate.
// @keywords private
//------------------------------------------------------------------------------
LzRPC.prototype.__LZloaderReturnData = function (loadmc, data, responseheaders) {

    // FIXME [2005-06-28 pkang]: would be nice to fix this in the platform.

    _root.LzLoadQueue.loadFinished( loadmc );

    var delegate = this.rpcinfo.delegate;
    var opinfo   = this.rpcinfo.opinfo;
    var seqnum   = this.rpcinfo.seqnum;
    delete this.rpcinfo;

    // responseheaders is specific to SOAP -pk
    opinfo.responseheaders = (responseheaders!=null ? responseheaders : null);

    // check to see if the data is the stub 
    if ( data.__LZstubload ) {

        var stub = data.stub;
        var stubinfo = data.stubinfo;
        
        this.owner.__LZloadHook(stubinfo); 

        delegate.execute( { status: 'ok', message: 'ok', 
                            stub: stub, stubinfo: stubinfo,
                            seqnum: seqnum } );

    } else if (data.childNodes[0].nodeName == 'error') {

        var error = data.childNodes[0].attributes['msg'];

        // check if whitelist/blacklist is in effect
        {
            var check = 'Forbidden url: ';
            var index = error.indexOf(check);
            if (index != -1 && index == 0) {
                error = 'Forbidden: ' + error.substring(check.length);
            }
        }

        delegate.execute({ status: 'error', errortype: 'servererror',
                           message: error, opinfo: opinfo,
                           seqnum: seqnum });

    } else if (data['faultCode'] != null) {

        // JavaRPC or XMLRPC error style
        // TODO: come up with a single way of returning RPC errors from server
        if (data.faultCode == 0 && data.faultString == 'void') {

            delegate.execute({ status: 'ok', message: 'void', 
                               data: _root.LzRPC.t_void, opinfo: opinfo,
                               seqnum: seqnum });

        } else {

            delegate.execute({ status: 'error', 
                               errortype: 'fault',
                               message: data.faultString,
                               opinfo: opinfo,
                               error: data,
                               seqnum: seqnum });
        }

    } else if (data['errortype'] != null) {

        // SOAP error style
        // TODO: come up with a single way of returning RPC errors from server
        delegate.execute({ status: 'error', errortype: data.errortype,
                           message: data.faultstring, error: data,
                           opinfo: opinfo,
                           seqnum: seqnum });

    } else if (typeof(data) == "undefined") {

        delegate.execute({ status: 'error', errortype: 'timeout',
                           message: 'timed out', opinfo: opinfo,
                           seqnum: seqnum });

    } else {

        if (delegate.dataobject != null) {
            if ( delegate.dataobject instanceof _root.LzDataset ) {
                var element = _root.LzDataElement.valueToElement(data);
                // the child nodes of element will be placed in datasets childNodes
                delegate.dataobject.setData( element );
            } else if ( delegate.dataobject instanceof _root.LzDataElement ) {
                var element = _root.LzDataElement.valueToElement(data);
                // xpath: element/value
                delegate.dataobject.appendChild( element );
            } else {
                _root.Debug.write('WARNING: dataobject is not LzDataset or LzDataElement:', 
                                  delegate.dataobject);
            }
        }

        delegate.execute({ status: 'ok', message: 'ok', data: data, opinfo: opinfo,
                           seqnum: seqnum });
    }

    LzRPC.__LZloaderpool.push(this);
}


//------------------------------------------------------------------------------
// @return sequence number of request.
// @keywords private
//------------------------------------------------------------------------------
LzRPC.prototype.request = function( o, delegate, secure, secureport ) {
    var pool = LzRPC.__LZloaderpool;
    var loader = ( pool.length != 0 ? pool.pop() : this.getNewLoader() );

    var seqnum = LzRPC.__LZseqnum++;

    // info to use for later
    loader.rpcinfo = { 
        delegate: delegate, 
        opinfo:   o['opinfo'], 
        seqnum:   seqnum
    };
    delete o['opinfo'];

    // RPC requests are all proxied
    o.proxied = true;
    // pass the swf version as a query arg named "lzr" := swf6 | swf7
    o.lzr = _root.canvas.runtime;

    loader.request( o, delegate, secure, secureport );

    return seqnum;
}

//------------------------------------------------------------------------------
// Wraps LzDataSource.getNewLoader() and modifies loader to work with RPC.
// @return an LzLoader.
// @keywords private
//------------------------------------------------------------------------------
LzRPC.prototype.getNewLoader = function () {
    var loader = LzDatasource.prototype.getNewLoader();
    loader.owner = this;
    loader.returnData = this.__LZloaderReturnData;
    return loader;
}

//------------------------------------------------------------------------------
// Get basic load parameters.
// @param String reqtype: 'GET' or 'POST'
// @keywords private
//------------------------------------------------------------------------------
LzRPC.prototype.__LZgetBasicLoadParams = function(reqtype) {
    return { reqtype: reqtype, lzt: "data", ccache: false, cache: false, 
             sendheaders: false };
}


]]>
</script>
</library>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- @LZX_VERSION@                                                         -->
