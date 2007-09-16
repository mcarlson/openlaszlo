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
static function DoubleWrapper (num) {
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
function __LZloaderReturnData (loader, data) {

    // If there is no XML data, try eval'ing the raw text to get JSON data
    if (this.responseXML == null || data == null) {
        Debug.write("eval before data=", this.responseText);
        data = eval("data = "+this.responseText);
        //Debug.write("eval data=", data);
    }

    // TODO [2007-02-28 hqm]: we don't have request queueing yet, but when we do,
    // we'll need to remove this request from the queue
    // LzLoadQueue.loadFinished( );

    var delegate = null;
    var opinfo   =  {};
    var seqnum   =  -1;

    if ('rpcinfo' in this) {
        delegate = this.rpcinfo.delegate;
        opinfo   = (typeof this.rpcinfo["opinfo"] != "undefined" ) ? this.rpcinfo.opinfo : opinfo;
        seqnum   = this.rpcinfo.seqnum;
        delete this.rpcinfo;
    } 

    // responseheaders is specific to SOAP -pk
    // opinfo.responseheaders = (responseheaders!=null ? responseheaders : null);


    // TODO [hqm 2007-03-15] we need to pass these in if they in fact come from server
    opinfo.responseheaders = null;

    if (data && data['__LZstubload'] ) {
    // check to see if the data is the stub 
        var stub = data.stub;
        var stubinfo = data.stubinfo;
        
        if (this.owner['__LZloadHook']) {
            this.owner.__LZloadHook(stubinfo);
        }

        delegate.execute( { status: 'ok', message: 'ok', 
                            stub: stub, stubinfo: stubinfo,
                            seqnum: seqnum } );

    } else if (data && (data instanceof LzDataElement) && data.childNodes[0].nodeName == 'error') {

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

    } else if (data && data['faultCode'] != null) {

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

    } else if (data && data['errortype'] != null) {

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
                var element = LzDataElement.valueToElement(data);
                // the child nodes of element will be placed in datasets childNodes
                delegate.dataobject.setData( element.childNodes );
            } else if ( delegate.dataobject instanceof LzDataElement ) {
                var element = LzDataElement.valueToElement(data);
                // xpath: element/value
                delegate.dataobject.appendChild( element );
            } else {
                Debug.warn('dataobject is not LzDataset or LzDataElement:', 
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
    var loader = ( pool.length != 0 ? pool.pop() : this.getNewLoader(o.url, secure, secureport) );
    
    this.loader = loader;

    var seqnum = LzRPC.__LZseqnum++;

    // Info to use for later when the loader has gotten data from server
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

    // use LzHTTPLoader to make XMLHTTPRequest 
    this.loadXHR( o, secure, secureport );

    return seqnum;
}

// Makes a request via LzHTTPLoader to the LPS XMLRPC data proxy service
 function loadXHR (reqobj, secure, secureport) {
    var tloader = this.loader;
    //build request
    var proxied = true;
    tloader.setOption('cacheable', false);
    tloader.setOption('ccache',  false);
    tloader.setOption('timeout', LzDataset.prototype.timeout);
    tloader.setOption('trimwhitespace', false);
    tloader.setOption('nsprefix', false);
    tloader.setOption('sendheaders', false);

    // Append query params and query string into single query string
    //Debug.debug('calling doRequest', this);
    var sep = '';
    var query = '';
        
    for ( var name in reqobj ){
        // Strip out special case key "lzpostbody", it declares a raw
        // string content to post.
        query += sep + name + '=' + encodeURIComponent(reqobj[name]);
        sep = '&';
    }
    var postbody = query += sep + "__lzbc__="+(new Date()).getTime();
    var baseurl =  LzBrowser.getBaseURL( );

    tloader.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    tloader.open ("POST", baseurl, /* username */ null, /* password */ null);
    tloader.send(postbody);

}


    // onerror callback from LZHTTPLoader

    function loadError () {

    }

    // ontimeout callback from LZHTTPLoader
    function loadTimeout () {

    }

//------------------------------------------------------------------------------
// Wraps LzDataSource.getNewLoader() and modifies loader to work with RPC.
// @return an LzLoader.
// @keywords private
//------------------------------------------------------------------------------
function getNewLoader (url, secure, secureport) {
    var tloader = this.loader;
    var proxied = true;

    // If there is no loader, or if the loader changed it's proxied
    // flag, make a new loader.
    //    if ( !tloader){
        tloader = new LzHTTPLoader(this, proxied, null);

        tloader.loadSuccess = this.__LZloaderReturnData;
        tloader.loadError   = this.loadError;
        tloader.loadTimeout = this.loadTimeout;
    //}
    
    tloader.setTimeout(LzDataset.prototype.timeout);

    tloader.setProxied(proxied);

    if (secure == null) {
        if (url.substring(0, 5) == "https") {
            secure = true;
        }
    }

    if (secure) {
        tloader.baserequest = LzBrowser.getBaseURL( secure, secureport );
        //Debug.write('basereq ' + tloader.baserequest);
    }


    tloader.secure = secure;

    if (secure) {
        tloader.secureport = secureport;
    }
    
    return tloader;
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
