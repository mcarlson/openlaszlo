/**
  * LzHTTPLoader.js
  *
  * @copyright Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic SVG
  */

LzHTTPLoader = function (owner, proxied, dataset) {
    this.dataset = dataset;
    this.owner = owner;
    this.options = {};
    this.requestheaders = {};
    this.requestmethod = LzHTTPLoader.GET_METHOD;
}

// Default callback handlers
LzHTTPLoader.prototype.loadSuccess = function (loader, data) {}
LzHTTPLoader.prototype.loadError   = function (loader, data) {}
LzHTTPLoader.prototype.loadTimeout = function (loader, data) {}

/* Returns the response as a string  */
LzHTTPLoader.prototype.getResponse = function () {
    return this.req.responseText;
}

/* Returns numeric status code (200, 404, 500, etc...) */
LzHTTPLoader.prototype.getResponseStatus = function () {
    return this.req.status;
}

/* Returns an array of response headers  */
LzHTTPLoader.prototype.getResponseHeaders = function () {
    // [todo hqm 2006-07] this returns a string at the moment, needs to be parsed into
    // a hash table
    return this.req.getAllResponseHeaders();
}

LzHTTPLoader.prototype.abort = function () {
    if (this.req) {
        this.req.cancel();
        // [todo hqm 2006-07 ] +++ abort timeout timer
    }
}

/* @public */
LzHTTPLoader.prototype.setOption = function (key, val) {
    this.options[key] = val;
}


/* @public */
LzHTTPLoader.prototype.setProxied = function (proxied) {
    this.setOption('proxied', proxied);
}

/* @public
 */
LzHTTPLoader.prototype.setQueryParams = function (qparams) {
    this.queryparams = qparams;
}

/* @public
 */
LzHTTPLoader.prototype.setQueryString = function (qstring) {
    this.querystring = qstring;
}

/*
 If queueRequests is true, subsequent requests will made sequentially
 If queueRequests is false, subsequent requests will interrupt requests already in process
*/
LzHTTPLoader.prototype.setQueueing = function (queue) {
    // [todo hqm 2006-07] NYI
}

LzHTTPLoader.prototype.getResponseHeader = function (key) {
    return this.req.getResponseHeader(key);
}

LzHTTPLoader.GET_METHOD    = "GET";
LzHTTPLoader.POST_METHOD   = "POST";
LzHTTPLoader.PUT_METHOD    = "PUT";
LzHTTPLoader.DELETE_METHOD = "DELETE";

// headers can be a hashtable or null

LzHTTPLoader.prototype.open = function (method, url, username, password) {
    {
        #pragma "passThrough=true" 
        this.req =  window.XMLHttpRequest? new XMLHttpRequest(): new ActiveXObject("Microsoft.XMLHTTP");
    }
    var headers = "";
    //build headers
    for (var header in this.requestheaders) {
        headers += (header + ": " + this.requestheaders[header]+"\n");
    }
    if ( headers.length ) {
        headers += "\n";
    }
    this.headerstring = headers;

    //Debug.debug('calling doRequest', this);
    var sep = '';
    var q = '?';
        
    // Get params if any from LzParam
    var qparams = this.queryparams;

    var names = qparams.getNames();
    for ( var i in names ){
        var name = names[i];
        q += sep + name + '=' + qparams.getValue(name);
        sep = '&';
    }

    var querystring = this.querystring;
    if (querystring.length > 0) {
        if (q.length > 0) {
            q += sep + querystring;
        } else {
            q = querystring;
        }
    }

    if (q == "?") {
        // don't add empty args list
    } else {
        // if there are already query args in the url, separate them with a '&'
        if (url.indexOf('?') >= 0) {
            url = url + "&" + q;
        } else {
            url = url + q;
        }
    }

    if (canvas.proxied) {
        this.requesturl = this.makeProxiedURL(url);
    } else {
        this.requesturl = url;
    }
}

LzHTTPLoader.prototype.makeProxiedURL = function ( url ) {
    proxyurl = LzBrowser.getBaseURL( );
    var qargs = {
        lzt: "xmldata",
        reqtype: "GET",
        sendheaders: false,
        trimwhitespace: false,
        nsprefix: true,
        __lzbc__: (new Date()).getTime(),
        url: LzBrowser.toAbsoluteURL(url),
        timeout: this.timeout,
        cache: false,
        ccache: false
    };
            
    // append query args onto url
    proxyurl += "?";
    sep = "";
    for (var key in qargs) {
        var val = qargs[key];
        if (typeof(val) == "string") {
            val = LzHTTPLoader.urlencode(val);
            val = val.replace(LzDataset.slashPat, "%2F");
        }
        proxyurl += sep + key + "=" + val;
        sep = "&";
    }
    return proxyurl;
}


LzHTTPLoader.prototype.send = function (content) {
    this.loadXMLDoc(/* method */ this.requestmethod,
                    /* url */ this.requesturl,
                    /* headers */ this.headerstring,
                    /* postbody */ null,
                    /* ignorewhite */ true);
}




// holds list of outstanding data requests, to handle timeouts
LzHTTPLoader.activeRequests = [];

// Default 30 second timeout
LzHTTPLoader.prototype.timeout = (30 * 1000);

LzHTTPLoader.prototype.setTimeout = function (timeout) {
    this.timeout = timeout;
    // [todo hqm 2006-07] Should we have  an API method for setting LzLoader timeout?
}

// Set up a pending timeout for a dataset.
LzHTTPLoader.prototype.setupTimeout = function (obj, duration) {
    var endtime = (new Date()).getTime() + duration;
    LzHTTPLoader.activeRequests.push(obj, endtime);
    setTimeout("LzHTTPLoader.__LZcheckXMLHTTPTimeouts()", duration);
}
    
// Remove a dataset from the timeouts list.
LzHTTPLoader.prototype.removeTimeout = function (target) {
    var activeReqs = LzHTTPLoader.activeRequests;
    LzHTTPLoader.activeRequests = [];
    // copy every dataset in the list except for the target
    for (var i = 0; i < activeReqs.length; i+=2) {
        var dset = activeReqs[i];
        var dstimeout = activeReqs[i+1];
        if (dset != target) {
            LzHTTPLoader.activeRequests.push(dset, dstimeout);
        }
    }
}
    
    
// Check if any outstanding requests have timed out. 
LzHTTPLoader.__LZcheckXMLHTTPTimeouts = function () {
    var activeReqs = LzHTTPLoader.activeRequests;
    LzHTTPLoader.activeRequests = [];
    for (var i = 0; i < activeReqs.length; i+=2) {
        var loader = activeReqs[i];
        var dstimeout = activeReqs[i+1];
        var now = (new Date()).getTime();
        if (now > dstimeout) {
            if (loader.req) {
                loader.req.abort();
            }
            loader.loadTimeout(loader, null);
        } else {
            // if it hasn't timed out, add it back to the list for the future
            LzHTTPLoader.activeRequests.push(loader, dstimeout);
        }
    }
}
    
LzHTTPLoader.prototype.getElapsedTime = function () {
    return  ((new Date()).getTime() - this.gstart);
}


LzHTTPLoader.prototype.setRequestHeaders = function (xhr, headers) {
    return;
    if (headers != null) {
        for (var key in headers) {
            var val = headers[key];
            // This gives error in Firefox ??
            // xhr.setRequestHeader(key, val);
        }
    }
}

// public
LzHTTPLoader.prototype.loadXMLDoc = function (method, url, headers, postbody, ignorewhite) {
    #pragma "passThrough=true" 
    if(this.req) {
        // we can't close over "this", so use another variable name. 
        var __pthis__ = this;
        this.req.onreadystatechange = function () {
            //Debug.write("onreadystatechange ",__pthis__, __pthis__.req.readyState);
            if (__pthis__.req.readyState == 4) {
                // only if "OK"
                if (__pthis__.req.status == 200 || __pthis__.req.status == 304) {
                    var elt = null;
                    var nodes = __pthis__.req.responseXML.childNodes;
                    //Debug.info('LzDataset.childNodes', __pthis__.req.responseXML.nodeName, __pthis__.type);
                    // find first content (type == 1) child node
                    for (var i = 0; i < nodes.length; i++) {
                        var child = nodes.item(i);
                        if (child.nodeType == 1) {
                            elt = child;
                            break;
                        }
                    }
                    __pthis__.removeTimeout(__pthis__);
                    //var d = __pthis__.copyBrowserXML(elt, ignorewhite, 0);
                    // [todo 2006-07 hqm] where do we get trimwhitespace flag from?
                    var trimwhitespace = false;
                    var d = LzXMLTranslator.copyXML(elt, trimwhitespace, /* stripnsprefix */ false);
                    __pthis__.responseText = __pthis__.req.responseText;

                    /**** DEBUGGING 
                    var xmlSerializer = new XMLSerializer();
                    var markup = xmlSerializer.serializeToString(elt);
                    Debug.write("loadXMLDoc", elt, markup, d.serialize());
                     *** /DEBUGGING
                     */

                    __pthis__.loadSuccess(__pthis__, d);
                } else {
                    __pthis__.loadError(__pthis__, null);
                }
                // Null this pointer out to prevent IE memory leak
                __pthis__.req = null;
            }
        };
        this.setRequestHeaders(this.req, headers);
        this.req.open("GET", url, true);
        this.req.send(postbody);
    }
    // Set up the timeout
    this.setupTimeout(this, this.timeout);
}

