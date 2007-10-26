/**
  * LzHTTPLoader.as
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * @shortdesc Send and receive text data over HTTP
  */

// We have an internal 'lzloader' property which points to an LzLoader (Flash-7-8-specific)
var LzHTTPLoader = function (owner, proxied) {
    this.lzloader = this.makeLzLoader(proxied);
    this.owner = owner;
    this.options = {
        // enable server (proxy) caching
        cacheable: false,
        // enable client caching
        ccache: false};
    this.requestheaders = {};
    this.requestmethod = LzHTTPLoader.GET_METHOD;

    this.dsloadDel = new LzDelegate( this , "_loadSuccessHandler" ,
                                     this.lzloader , "ondata" );
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
    //Debug.write('LzHTTPLoader.prototype.send', this, this.lzloader);
    this.xmlrequestobj.rawpostbody = content;
    this.lzloader.setHeaders(this.requestheaders);
    this.lzloader.requestDirectXML( this.xmlrequestobj );
}


//   @access public
//   @param String url: url, including query args
//   @param  String reqtype: 'POST' or 'GET'
//   @param  String lzt: LPS server Responder type, default is "xmldata"
//   @param Object headers: hash table of HTTP request headers
LzHTTPLoader.prototype.makeProxiedURL = function ( url,  reqtype, lzt, headers) {
    var proxyurl = LzBrowser.getBaseURL( );
    var qargs = {
        lzt: (lzt != null) ? lzt : "xmldata",
        reqtype: reqtype,
        sendheaders: this.options.sendheaders,
        trimwhitespace: this.options.trimwhitespace,
        nsprefix: this.options.trimwhitespace,
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
            val = escape(val);
        }
        proxyurl += sep + key + "=" + val;
        sep = "&";
    }

    //Debug.write('makeProxiedURL url:',url, 'reqtype:', reqtype,' proxyurl:', proxyurl);
    return proxyurl;
}


LzHTTPLoader.prototype.timeout = Infinity;

LzHTTPLoader.prototype.setTimeout = function (timeout) {
    this.timeout = timeout;
    // [todo hqm 2006-07] Should we have  an API method for setting LzLoader timeout?
    this.lzloader.timeout = timeout;
}

////////////////////////////////////////////////////////////////
// swf-specific stuff

/**
  * This is a helper method to create a loader for the dataset.
  * @access private
  * @return LzLoader 
  */
LzHTTPLoader.prototype.makeLzLoader = function (proxied){
    if ( ! $dataloaders ){
        // SWF-specific
        _root.attachMovie("empty", "$dataloaders", 4242);
        var mc = $dataloaders;
        mc.dsnum = 1;
    }

    $dataloaders.attachMovie( "empty", 
                                   "dsloader" + $dataloaders.dsnum,
                                   $dataloaders.dsnum );
    var newloadermc = $dataloaders[ "dsloader" + 
                                          $dataloaders.dsnum ];
    $dataloaders.dsnum++;
    
    return new LzLoader( this, { attachRef : newloadermc ,
                                       timeout : Infinity,
                                       proxied: proxied} );
}

LzHTTPLoader.urlencode = function (str) {
    return escape(str);
}
