<library>
<script when="immediate">
<![CDATA[


/* LZ_COPYRIGHT_BEGIN */
/****************************************************************************
 * Copyright (c) 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.       *
 * Use is subject to license terms                                          *
 ****************************************************************************/
/* LZ_COPYRIGHT_END */

//======================================================================
// DEFINE OBJECT: LzRPC
//
// Implements an object to make remote java direct and XMLRPC calls.
//======================================================================
class LzRPC {

// object used for void return types
static var t_void = { type: 'void' };

// @keywords private
static var __LZloaderpool = [];

//------------------------------------------------------------------------------
// @param Number num: number to pass down to explicitly cast to a double
//------------------------------------------------------------------------------
function DoubleWrapper (num) {
    this.num = num;
}

//------------------------------------------------------------
// Global RPC sequence number for server requests.
//------------------------------------------------------------
static var __LZseqnum = 0;

//------------------------------------------------------------------------------
// Override loader's returnData function. Call appropritate delegate.
// @keywords private
//------------------------------------------------------------------------------
function __LZloaderReturnData (loadmc, data, responseheaders) {

    // FIXME [2005-06-28 pkang]: would be nice to fix this in the platform.

    _root.LzLoadQueue.loadFinished( loadmc );

    var delegate = null;
    var opinfo   =  {};
    var seqnum   =  -1;

    if ('rpcinfo' in this) {
        delegate = this.rpcinfo.delegate;
        opinfo   = ('opinfo' in this.rpcinfo) ? this.rpcinfo.opinfo : opinfo;
        seqnum   = this.rpcinfo.seqnum;
        delete this.rpcinfo;
    } 

    // responseheaders is specific to SOAP -pk
    opinfo.responseheaders = (responseheaders!=null ? responseheaders : null);

    // check to see if the data is the stub 
    if ( data['__LZstubload'] ) {

        var stub = data.stub;
        var stubinfo = data.stubinfo;
        
        if (this.owner['__LZloadHook']) {
            this.owner.__LZloadHook(stubinfo);
        }

        delegate.execute( { status: 'ok', message: 'ok', 
                            stub: stub, stubinfo: stubinfo,
                            seqnum: seqnum } );

    } else if ((data instanceof LzDataNode) && data.childNodes[0].nodeName == 'error') {

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

        if (delegate['dataobject'] != null) {
            if ( delegate.dataobject instanceof LzDataset ) {
                var element = LzDataElement.prototype.valueToElement(data);
                // the child nodes of element will be placed in datasets childNodes
                delegate.dataobject.setData( element.childNodes );
            } else if ( delegate.dataobject instanceof LzDataElement ) {
                var element = LzDataElement.prototype.valueToElement(data);
                // xpath: element/value
                delegate.dataobject.appendChild( element );
            } else {
                Debug.write('WARNING: dataobject is not LzDataset or LzDataElement:', 
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
function request ( o, delegate, secure, secureport ) {
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
// Create a Flash-specific dataswf loader, and modify loader callback to work with RPC.
// @return an LzLoader.
// @keywords private
//------------------------------------------------------------------------------
function makeLzLoader (proxied, timeout){
    if ( typeof ($dataloaders) == 'undefined' ){
        // SWF-specific
        attachMovie("empty", "$dataloaders", 4242);
        var mc = $dataloaders;
        mc.dsnum = 1;
    }

    $dataloaders.attachMovie( "empty", 
                                   "dsloader" + $dataloaders.dsnum,
                                   $dataloaders.dsnum );
    var newloadermc = $dataloaders[ "dsloader" + 
                                          $dataloaders.dsnum ];
    $dataloaders.dsnum++;
    
    //Debug.write("dataset timeout", this.timeout);

    return new LzLoader( this, { attachRef : newloadermc ,
                                       timeout : timeout,
                                       proxied: proxied} );
}



//------------------------------------------------------------------------------
// Wraps LzDataSource.getNewLoader() and modifies loader to work with RPC.
// @return an LzLoader.
// @keywords private
//------------------------------------------------------------------------------
function getNewLoader () {
    var loader = this.makeLzLoader(false,  LzDataset.prototype.timeout);
    loader.owner = this;
    loader.returnData = this.__LZloaderReturnData;
    return loader;
}

//------------------------------------------------------------------------------
// Get basic load parameters.
// @param String reqtype: 'GET' or 'POST'
// @keywords private
//------------------------------------------------------------------------------
function __LZgetBasicLoadParams (reqtype) {
    return { reqtype: reqtype, lzt: "data", ccache: false, cache: false, 
             sendheaders: false };
}

}
]]>
</script>
</library>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- @LZX_VERSION@                                                         -->
