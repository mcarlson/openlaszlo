/**
  * LzHTTPLoader.js
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @affects lzloader
  */

var LzHTTPLoader = function (owner, proxied) {
    this.owner = owner;
    this.options = {parsexml: true, serverproxyargs: null};
    this.requestheaders = {};
    this.requestmethod = LzHTTPLoader.GET_METHOD;
    
    this.__loaderid = LzHTTPLoader.loaderIDCounter++;
}

LzHTTPLoader.GET_METHOD    = "GET";
LzHTTPLoader.POST_METHOD   = "POST";
LzHTTPLoader.PUT_METHOD    = "PUT";
LzHTTPLoader.DELETE_METHOD = "DELETE";

// holds list of outstanding data requests, to handle timeouts
LzHTTPLoader.activeRequests = {};
LzHTTPLoader.loaderIDCounter = 0;

// Default callback handlers
LzHTTPLoader.prototype.loadSuccess = function (loader, data) {}
LzHTTPLoader.prototype.loadError   = function (loader, data) {}
LzHTTPLoader.prototype.loadTimeout = function (loader, data) {}

LzHTTPLoader.prototype.loadContent = function (self, content) {
    if (this.options['parsexml']) {
        this.translateXML();
    } else {
        this.loadSuccess(this, content);
    }
}

/* Parse response into XML data. */ 
LzHTTPLoader.prototype.translateXML = function () {
    var lzxdata = null;
    if (this.responseXML != null) {
        var elt;
        var nodes = this.responseXML.childNodes;
        // find first content (type == 1) child node
        for (var i = 0; i < nodes.length; i++) {
            var child = nodes.item(i);
            if (child.nodeType == 1) {
                elt = child;
                break;
            }
        }
        lzxdata = LzXMLTranslator.copyXML(elt,
                                          this.options.trimwhitespace,
                                          this.options.nsprefix);
    }

    this.loadSuccess(this, lzxdata);
}

/* Returns the response as a string  */
LzHTTPLoader.prototype.getResponse = function () {
    return this.responseText;
}

/* Returns numeric status code (200, 404, 500, etc...) */
LzHTTPLoader.prototype.getResponseStatus = function () {
    return this.responseStatus;
}

/* Returns an object of response headers  */
LzHTTPLoader.prototype.getResponseHeaders = function () {
    //return this.req.getAllResponseHeaders();
    return this.responseHeaders;
}

LzHTTPLoader.prototype.getResponseHeader = function (key) {
    //return this.req.getResponseHeader(key);
    return this.responseHeaders[key];
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

/* @public */
LzHTTPLoader.prototype.setOption = function (key, val) {
    this.options[key] = val;
}

/* @public */
LzHTTPLoader.prototype.getOption = function (key:String) :* {
    return this.options[key];
}

/* @public */
LzHTTPLoader.prototype.setProxied = function (proxied) {
    this.setOption('proxied', proxied);
}

/* @public */
LzHTTPLoader.prototype.setQueryParams = function (qparams) {
    this.queryparams = qparams;
}

/* @public */
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

LzHTTPLoader.prototype.abort = function () {
    if (this.req) {
        this.__abort = true;
        this.req.abort();
        this.req = null;
        this.removeTimeout(this);
    }
}

LzHTTPLoader.prototype.open = function (method, url, username, password) {
    if ($debug) {
        if (this.req) {
            // TODO: what is the expected behaviour? 
            // ignore the new request or cancel the previous one?
            Debug.warn("pending request for id=%s", this.__loaderid);
        }
    }
    
    {
        #pragma "passThrough=true" 
        this.req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    }
    this.responseStatus = 0;
    this.responseHeaders = null;
    this.responseText = null;
    this.responseXML = null;
    
    this.__abort = false;
    this.__timeout = false;
    this.requesturl = url;
    this.requestmethod = method;
}

LzHTTPLoader.prototype.send = function (content) {
    this.loadXMLDoc(/* method */ this.requestmethod,
                    /* url */ this.requesturl,
                    /* headers */ this.requestheaders,
                    /* postbody */ content,
                    /* ignorewhite */ true);
}

//   @access public
//   @param String url: url, including query args
//   @param  String reqtype: 'POST' or 'GET'
//   @param Object headers: hash table of HTTP request headers
LzHTTPLoader.prototype.makeProxiedURL = function ( proxyurl, url,  httpmethod, lzt, headers, postbody) {
        var params = {
        serverproxyargs: this.options.serverproxyargs,
        sendheaders: this.options.sendheaders,
        trimwhitespace: this.options.trimwhitespace,
        nsprefix: this.options.nsprefix,
        timeout: this.timeout,
        cache: this.options.cacheable,
        ccache: this.options.ccache,
        proxyurl: proxyurl,
        url: url,
        secure: this.secure,
        postbody: postbody,
        headers: headers,
        httpmethod: httpmethod,
        service: lzt
        };
        return lz.Browser.makeProxiedURL(params);
}

// Default infinite timeout
LzHTTPLoader.prototype.timeout = Infinity;

LzHTTPLoader.prototype.setTimeout = function (timeout) {
    this.timeout = timeout;
    // [todo hqm 2006-07] Should we have an API method for setting LzLoader timeout?
}

// Set up a pending timeout for a loader.
LzHTTPLoader.prototype.setupTimeout = function (loader, duration) {
    var endtime = (new Date()).getTime() + duration;
    var lid = loader.__loaderid;
    
    LzHTTPLoader.activeRequests[lid] = [loader, endtime];
    var timeoutid = setTimeout("LzHTTPLoader.__LZcheckXMLHTTPTimeouts(" + lid + ")", duration);
    LzHTTPLoader.activeRequests[lid][2] = timeoutid;
}

// Remove a loader from the timeouts list.
LzHTTPLoader.prototype.removeTimeout = function (loader) {
    var lid = loader.__loaderid;
    //Debug.write("remove timeout for id=%s", lid);
    if (lid != null) {
        var reqarr = LzHTTPLoader.activeRequests[lid];
        if (reqarr && reqarr[0] === loader) {
            clearTimeout(reqarr[2]);
            delete LzHTTPLoader.activeRequests[lid];
        }
    }
}

// Check if any outstanding requests have timed out. 
LzHTTPLoader.__LZcheckXMLHTTPTimeouts = function (lid) {
    var reqarr = LzHTTPLoader.activeRequests[lid];
    if (reqarr) {
        var now = (new Date()).getTime();
        var loader = reqarr[0];
        var dstimeout = reqarr[1];
        //Debug.write("diff %d", now - dstimeout);
        if (now >= dstimeout) {
            //Debug.write("timeout for %s", lid);
            delete LzHTTPLoader.activeRequests[lid];
            loader.__timeout = true;
            if (loader.req) {
                loader.req.abort();
            }
            loader.req = null;
            loader.loadTimeout(loader, null);
        } else {
            // if it hasn't timed out, add it back to the list for the future
            //Debug.write("recheck timeout");
            var timeoutid = setTimeout("LzHTTPLoader.__LZcheckXMLHTTPTimeouts(" + lid + ")", now - dstimeout);
            reqarr[2] = timeoutid;
        }
    }
}

LzHTTPLoader.prototype.getElapsedTime = function () {
    return ((new Date()).getTime() - this.gstart);
}

// headers can be a hashtable or null
LzHTTPLoader.prototype.__setRequestHeaders = function (xhr, headers) {
    if (headers != null) {
        for (var key in headers) {
            var val = headers[key];
            // This gives error in Firefox ??
            xhr.setRequestHeader(key, val);
        }
    }
}

LzHTTPLoader.prototype.__getAllResponseHeaders = function (xhr) {
    var re = new RegExp("^([-\\w]+):\\s*(\\S(?:.*\\S)?)\\s*$", "mg");
    var respheader = xhr.getAllResponseHeaders();
    
    var allheaders = {};
    var header;
    while ((header = re.exec(respheader)) != null) {
        allheaders[header[1]] = header[2];
    }
    
    return allheaders;
}

// public
// parsexml flag : if true, translate native XML tree into LzDataNode tree,
//                 if false, don't attempt to translate the XML (if it exists)
LzHTTPLoader.prototype.loadXMLDoc = function (method, url, headers, postbody, ignorewhite) {
    if (this.req) {
        // we can't close over "this", so use another variable name. 
        var self = this;
        this.req.onreadystatechange = function () {
            var xhr = self.req;
            if (xhr == null) { return; }
            //Debug.write("readyState=%d", xhr.readyState);
            if (xhr.readyState == 4) {
                if (self.__timeout) {
                    // request has timed out, ignore ready-state
                } else if (self.__abort) {
                    // request was cancelled, ignore ready-state
                } else {
                    self.removeTimeout(self);
                    self.req = null;
                    
                    var status = -1;
                    try {
                        status = xhr.status;
                    } catch (e) {
                        //if you abort a request, readyState will be set to 4, 
                        //but reading status will result in an exception (at least in Firefox).
                    }
                    
                    // only if "OK"
                    self.responseStatus = status;
                    if (status == 200 || status == 304) {
                        self.responseXML = xhr.responseXML;
                        self.responseText = xhr.responseText;
                        self.responseHeaders = self.__getAllResponseHeaders(xhr);
                        
                        //DEBUGGING:
                        //var xmlSerializer = new XMLSerializer();
                        //var markup = xmlSerializer.serializeToString(self.responseXML);
                        //Debug.write("loadXMLDoc", markup);
                        
                        // Callback with raw text string
                        self.loadContent(self, self.responseText);
                    } else {
                        self.loadError(self, null);
                    }
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
        this.gstart = (new Date()).getTime();
        this.req.send(postbody);
        
        // Set up the timeout
        if (isFinite(this.timeout)) {
            this.setupTimeout(this, this.timeout);
        }
    }
}
