/**
  * LzHTTPLoader.js
  *
  * @copyright Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @affects lzloader
  */

var LzHTTPLoader = function (owner, proxied) {
    this.owner = owner;
    this.options = {parsexml: true};
    this.requestheaders = {};
    this.requestmethod = LzHTTPLoader.GET_METHOD;
}

// Default callback handlers
LzHTTPLoader.prototype.loadSuccess = function (loader, data) {}
LzHTTPLoader.prototype.loadError   = function (loader, data) {}
LzHTTPLoader.prototype.loadTimeout = function (loader, data) {}

/* Returns the response as a string  */
LzHTTPLoader.prototype.getResponse = function () {
    return this.responseText;
}

/* Returns numeric status code (200, 404, 500, etc...) */
LzHTTPLoader.prototype.getResponseStatus = function () {
    // nyi
}

// TODO [hqm 2007-02] this is not very useful now because we are
// immediately null'ing out the req field as soon as the request
// returns, in order to assist IE in garbage collecting.

/* Returns an array of response headers  */
LzHTTPLoader.prototype.getResponseHeaders = function () {
    // [todo hqm 2006-07] this returns a string at the moment, needs to be parsed into
    // a hash table
    return this.req.getAllResponseHeaders();
}


/* @param Object obj:  A hash table of headers for the HTTP request
   @access public
*/
LzHTTPLoader.prototype.setRequestHeaders = function (obj) {
    this.requestheaders = obj;
}

/* @param String key:  HTTP request header name
   @param String val:  header value
   @access public
*/

LzHTTPLoader.prototype.setRequestHeader = function (key, val) {
    this.requestheaders[key] = val;
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
LzHTTPLoader.prototype.setQueueing = function (queuing) {
    this.setOption('queuing', queuing);
    // [todo hqm 2006-07] NYI
}

// TODO [hqm 2007-02] this is not useful right now because we are
// null'ing out the req field as soon as the request returns, in order
// to assist IE in garbage collecting.
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
    this.requesturl = url;
    this.requestmethod = method;

}

//   @access public
//   @param String url: url, including query args
//   @param  String reqtype: 'POST' or 'GET'
//   @param Object headers: hash table of HTTP request headers
    LzHTTPLoader.prototype.makeProxiedURL = function ( url,  reqtype, lzt, headers) {
    var proxyurl = LzBrowser.getBaseURL( );

    var qargs = {
        lzt: (lzt != null) ? lzt : "xmldata",
        reqtype: reqtype,
        sendheaders: this.options.sendheaders,
        trimwhitespace: this.options.trimwhitespace,
        nsprefix: this.options.nsprefix,
        url: LzBrowser.toAbsoluteURL(url, this.secure),
        timeout: this.timeout,
        cache: this.options.cacheable,
        ccache: this.options.ccache
    };

    // Set HTTP headers
    var hname;
    var headerString = "";
    if (headers != null) {
        for (hname in headers) {
            headerString += (hname + ": " + headers[hname]+"\n");
        }
    }

    if (headerString != "") {
        qargs['headers'] = headerString;
    }


    // break the browser cache by creating an arg with a unique value
    if (!this.options.ccache) {
        qargs.__lzbc__ = (new Date()).getTime();
    }

    // append query args onto url
    proxyurl += "?";
    var sep = "";
    for (var key in qargs) {
        var val = qargs[key];
        if (typeof(val) == "string") {
            val = encodeURIComponent(val);
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
                    /* headers */ this.requestheaders,
                    /* postbody */ content,
                    /* ignorewhite */ true,
                    /* parseXML */ true);
}




// holds list of outstanding data requests, to handle timeouts
LzHTTPLoader.activeRequests = [];

// Default infinite timeout
LzHTTPLoader.prototype.timeout = Infinity;

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
            this.req = null;
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


LzHTTPLoader.prototype.__setRequestHeaders = function (xhr, headers) {
    if (headers != null) {
        for (var key in headers) {
            var val = headers[key];
            // This gives error in Firefox ??
            xhr.setRequestHeader(key, val);
        }
    }
}

// public
// parsexml flag : if true, translate native XML tree into LzDataNode tree,
//                 if false, don't attempt to translate the XML (if it exists)

LzHTTPLoader.prototype.loadXMLDoc = function (method, url, headers, postbody, ignorewhite, parsexml) {
    if(this.req) {
        // we can't close over "this", so use another variable name. 
        var __pthis__ = this;
        this.req.onreadystatechange = function () {
            if (__pthis__.req == null) { return; }

            if (__pthis__.req.readyState == 4) {
                // only if "OK"
                if (__pthis__.req.status == 200 || __pthis__.req.status == 304) {
                    var elt = null;
                    var xml = __pthis__.req.responseXML;
                    __pthis__.responseXML = xml;
                    var lzxdata = null;
                    if (xml != null && parsexml) {
                        var nodes = __pthis__.req.responseXML.childNodes;
                        // find first content (type == 1) child node
                        for (var i = 0; i < nodes.length; i++) {
                            var child = nodes.item(i);
                            if (child.nodeType == 1) {
                                elt = child;
                                break;
                            }
                        }
                        lzxdata = LzXMLTranslator.copyXML(elt,
                                                    __pthis__.options.trimwhitespace,
                                                    __pthis__.options.nsprefix);
                    }

                    __pthis__.responseText = __pthis__.req.responseText;
                    __pthis__.removeTimeout(__pthis__);



                    /**** DEBUGGING 
                    var xmlSerializer = new XMLSerializer();
                    var markup = xmlSerializer.serializeToString(elt);
                    Debug.write("loadXMLDoc", elt, markup, d.serialize());
                     *** /DEBUGGING
                     */
                    __pthis__.req = null;
                    __pthis__.loadSuccess(__pthis__, lzxdata);
                } else {
                    __pthis__.req = null;
                    __pthis__.loadError(__pthis__, null);
                }
            }
        };
        this.req.open(method, url, true);
        // If no content-type for POST was explicitly specified,
        // use "application/x-www-form-urlencoded"
        if ((method == "POST") && headers['content-type'] == null) {
            headers['content-type'] = 'application/x-www-form-urlencoded';
        }
        this.__setRequestHeaders(this.req, headers);
        this.req.send(postbody);
    }
    // Set up the timeout
    this.setupTimeout(this, this.timeout);
}

