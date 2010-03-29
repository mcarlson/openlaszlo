/**
  * LzHTTPLoader.as
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * @shortdesc Send and receive text data over HTTP
  */

// We have an internal 'lzloader' property which points to an LzXMLLoader (Flash-7-8-specific)
var LzHTTPLoader = function (owner, proxied) {
    this.lzloader = new LzXMLLoader( this, {timeout : Infinity, proxied : proxied} );
    this.owner = owner;
    this.options = {
        // enable server (proxy) caching
        cacheable: false,
        // enable client caching
        ccache: false,
        // parse and translate incoming data to LzDatset DOM elements
        parsexml:  true,
        // Additional protocol-specific args to the LPS proxy protocol
        serverproxyargs: null
    };
    this.requestheaders = {};
    this.requestmethod = LzHTTPLoader.GET_METHOD;

    this.dsloadDel = new LzDelegate( this , "_loadSuccessHandler" ,
                                     this.lzloader , "ondata" );
    // Handler for raw string content, before parsing
    this.dscontentDel = new LzDelegate( this , "loadContent" ,
                                     this.lzloader , "oncontent" );
    this.dserrorDel = new LzDelegate( this , "_loadErrorHandler" ,
                                      this.lzloader , "onerror" );
    this.dstimeoutDel = new LzDelegate( this , "_loadTimeoutHandler" ,
                                        this.lzloader , "ontimeout" );
}

// Default callback handlers

LzHTTPLoader.prototype._loadSuccessHandler = function (data) { this.loadSuccess(this,data); }
LzHTTPLoader.prototype._loadErrorHandler   = function (data) { this.loadError  (this,data); }
LzHTTPLoader.prototype._loadTimeoutHandler = function (data) { this.loadTimeout(this,data); }

LzHTTPLoader.GET_METHOD    = "GET";
LzHTTPLoader.POST_METHOD   = "POST";
LzHTTPLoader.PUT_METHOD    = "PUT";
LzHTTPLoader.DELETE_METHOD = "DELETE";

LzHTTPLoader.prototype.lzloader = null;

/* Default handler for raw content */
LzHTTPLoader.prototype.loadContent = function (content) {
    if (this.options.parsexml) {
        // Parse and translate XML to LZX format
        // lzloader dispatches "ondata"-event when finished translation
        this.lzloader.translateXML();
    } else {
        // Otherwise, return the raw content string
        this._loadSuccessHandler(content);
    }
};

/* Returns the response as a string  */
LzHTTPLoader.prototype.getResponse = function () {
    return this.lzloader.rawtext;
}

/* Returns the parsed native XML DOM object, if any */
LzHTTPLoader.prototype.getNativeXMLObject = function () {
    // nyi
}

/* Returns numeric status code (200, 404, 500, etc...) */
LzHTTPLoader.prototype.getResponseStatus = function () {
    // nyi
}

/* Returns an array of response headers  */
LzHTTPLoader.prototype.getResponseHeaders = function () {
    // nyi
}

LzHTTPLoader.prototype.setRequestHeaders = function (obj) {
    this.requestheaders = obj;
}

LzHTTPLoader.prototype.setRequestHeader = function (key, val) {
    this.requestheaders[key] = val;
}

LzHTTPLoader.prototype.abort = function () {
    this.lzloader.abort();
}

LzHTTPLoader.prototype.setOption = function (key, val) {
    this.options[key] = val;
}

LzHTTPLoader.prototype.getOption = function (key) {
    return this.options[key];
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

/* @public
 If queueRequests is true, subsequent requests will made sequentially
 If queueRequests is false, subsequent requests will interrupt requests already in process
*/
LzHTTPLoader.prototype.setQueueing = function (queuing) {
    this.lzloader.queuing = queuing;
    this.setOption('queuing', queuing);
}

LzHTTPLoader.prototype.getResponseHeader = function (key) {
}


// headers can be a hashtable or null
LzHTTPLoader.prototype.open = function (method, url, username, password) {
    // set loadobj.reqtype to this
    this.requestmethod = method;

    //build request
    var req = url;

    // A relative URL that looks like "http:foo.xml" won't work with Flash's native XML Object.
    // We need to strip "http:" from those URLs, to leave just the pathname.
    if (req.indexOf("http:") == 0 && req.charAt(5) != "/") {
        req = req.substring(5);
    } else if (req.indexOf("https:") == 0 && req.charAt(6) != "/") {
        req = req.substring(6);
    }

    // Create a Flash XML object, and stuff it in the LzXMLLoader.
    var xmlrequestobj = new XML();
    
    xmlrequestobj.cache = this.options.cacheable;
    xmlrequestobj.hasquerydata = this.options.hasquerydata;

    if (typeof(lzloader.timeout) != 'undefined') {
        xmlrequestobj.timeout = lzloader.timeout;
    }

    // trim whitespace from start and end of text node content
    //Debug.write("this.options.trimwhitespace" , this.options.trimwhitespace);
    xmlrequestobj.trimwhitespace = (this.options.trimwhitespace);
    xmlrequestobj.nsprefix       = (this.options.nsprefix);

    // This is a Flash XML Parser flag - says to completely ignore
    // text nodes which are all whitespace. If you set this to false,
    // you will have a lot of spurious nodes in your XML.
    xmlrequestobj.ignoreWhite = true;

    xmlrequestobj.url = req;
    xmlrequestobj.reqtype = this.requestmethod;
    xmlrequestobj.proxied = this.lzloader.proxied;



    this.xmlrequestobj = xmlrequestobj;
}

LzHTTPLoader.prototype.send = function (content) {
    //Debug.info("LzHTTPLoader.send parsexml", this.options.parsexml, content);
    this.xmlrequestobj.rawpostbody = content;
    this.lzloader.setHeaders(this.requestheaders);
    this.lzloader.request( this.xmlrequestobj );
}


//   @access public
//   @param String url: url, including query args
//   @param  String reqtype: 'POST' or 'GET'
//   @param  String lzt: LPS server Responder type, default is "xmldata"
//   @param Object headers: hash table of HTTP request headers
//   @param String postbody: optional, post body content
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

LzHTTPLoader.prototype.timeout = Infinity;

LzHTTPLoader.prototype.setTimeout = function (timeout) {
    this.timeout = timeout;
    // [todo hqm 2006-07] Should we have  an API method for setting LzLoader timeout?
    this.lzloader.timeout = timeout;
}

/**
  * @access private
  * Called by lzloader:LzXMLLoader to clean up delegates
  */
LzHTTPLoader.prototype.destroy = function() {
    if (this.__LZdeleted == true) return;
    // To keep delegates from resurrecting us.  See LzDelegate#execute
    this.__LZdeleted = true;

    if (this.dsloadDel.hasevents) this.dsloadDel.destroy();
    if (this.dscontentDel.hasevents) this.dscontentDel.destroy();
    if (this.dserrorDel.hasevents) this.dserrorDel.destroy();
    if (this.dstimeoutDel.hasevents) this.dstimeoutDel.destroy();
    if (this.lzloader) {
        this.lzloader.destroy();
    }
    this.lzloader = null;
    this.owner = null;
}
