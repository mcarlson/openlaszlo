/**
  * LzHTTPLoader.as
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @affects lzloader
  */

public class LzHTTPLoader {

    #passthrough (toplevel:true) {  
        import flash.events.*;
        import flash.net.*;
        import flash.utils.*;
        import flash.xml.*;  
    }#

        var __abort;
    var __loaderid = 1;
    var __timeout;
    var gstart;
    var options;
    var owner;
    var requestheaders;
    var requestmethod;
    var requesturl;
    var responseText;
    var secure;
    var responseXML:XML;
    var dataRequest;

    // The URLLoader object
    var loader:URLLoader;

    static var GET_METHOD    = "GET";
    static var POST_METHOD   = "POST";
    static var PUT_METHOD    = "PUT";
    static var DELETE_METHOD = "DELETE";

    public function LzHTTPLoader (owner, proxied) {
        this.owner = owner;
        this.options = {parsexml: true};
        this.requestheaders = {};
        this.requestmethod = LzHTTPLoader.GET_METHOD;
        this.__loaderid = LzHTTPLoader.loaderIDCounter++;
    }

    // Default callback handlers
    public var loadSuccess:Function;
    public var loadError:Function;
    public var loadTimeout:Function;

    /* Returns the response as a string  */
    public function getResponse () {
        return this.responseText;
    }

    /* Returns numeric status code (200, 404, 500, etc...) */
    public function getResponseStatus () {
        // nyi
    }

    /* Returns an array of response headers  */
    public function getResponseHeaders () {
        // There seems to be no way to get response headers in the flash.net URLLoader API
        return null;
    }


    /* @param Object obj:  A hash table of headers for the HTTP request
       @access public
    */
    public function setRequestHeaders (obj) {
        this.requestheaders = obj;
    }

    /* @param String key:  HTTP request header name
       @param String val:  header value
       @access public
    */

    public function setRequestHeader (key, val) {
        this.requestheaders[key] = val;
    }

    public function abort () {
        if (this.loader) {
            this.__abort = true;
            this.loader.close();
            this.loader = null;
            this.removeTimeout(this);
        }
    }

    /* @public */
    public function setOption (key, val) {
        this.options[key] = val;
    }


    /* @public */
    public function setProxied (proxied) {
        this.setOption('proxied', proxied);
    }

    /* @public
     */
    public function setQueryParams (qparams) {
    }

    /* @public
     */
    public function setQueryString (qstring) {
    }

    /*
      If queueRequests is true, subsequent requests will made sequentially
      If queueRequests is false, subsequent requests will interrupt requests already in process
    */

    public function setQueueing (queuing) {
        this.setOption('queuing', queuing);
        // [todo hqm 2006-07] NYI
    }

    public function getResponseHeader (key) {
        // There seems to be no way to get response headers in the flash.net URLLoader API
        trace('getResponseHeader not implemented in swf9');
        return null;
    }


    // headers can be a hashtable or null
    public function open (method, url, username = null, password = null) {
        if (this.loader) {
            Debug.warn("pending request for id=%s", this.__loaderid);
        }
    
        loader = new URLLoader();
        loader.dataFormat = URLLoaderDataFormat.TEXT;

        this.__abort = false;
        this.__timeout = false;
        this.requesturl = url;
        this.requestmethod = method;

    }

    //   @access public
    //   @param String url: url, including query args
    //   @param  String reqtype: 'POST' or 'GET'
    //   @param Object headers: hash table of HTTP request headers
    public function makeProxiedURL ( url,  reqtype, lzt, headers, postbody) {
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

        //If a postbody string is supplied, pass it to the proxy server as 'lzpostbody' arg.
        if (postbody != null) {
            qargs.lzpostbody = postbody;
        }


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


    // holds list of outstanding data requests, to handle timeouts
    //LzHTTPLoader.activeRequests = [];
    static var activeRequests = {};
    static var loaderIDCounter = 0;

    // Default infinite timeout
    var timeout = Infinity;

    public function setTimeout (timeout) {
        this.timeout = timeout;
        // [todo hqm 2006-07] Should we have  an API method for setting LzLoader timeout?
    }

    // Set up a pending timeout for a loader.
    /*
      LzHTTPLoader.prototype.setupTimeout = function (obj, duration) {
      var endtime = (new Date()).getTime() + duration;
      LzHTTPLoader.activeRequests.push(obj, endtime);
      setTimeout("LzHTTPLoader.__LZcheckXMLHTTPTimeouts()", duration);
      }
    */
    public function setupTimeout (obj, duration) {
        var endtime = (new Date()).getTime() + duration;
        //obj.__loaderid = LzHTTPLoader.loaderIDCounter++;//uncomment to give LzHTTPLoader-instance a new loader-id
        var lid = obj.__loaderid;
    
        LzHTTPLoader.activeRequests[lid] = [obj, endtime];
        var callback = function () {
            LzHTTPLoader.__LZcheckXMLHTTPTimeouts(lid);
        }
        var timeoutid = flash.utils.setTimeout(callback, duration);
        LzHTTPLoader.activeRequests[lid][2] = timeoutid;
    }
    
    // Remove a loader from the timeouts list.
    public function removeTimeout (target) {
        var lid = target.__loaderid;
        //Debug.write("remove timeout for id=%s", lid);
        if (lid != null) {
            var reqarr = LzHTTPLoader.activeRequests[lid];
            if (reqarr && reqarr[0] === target) {
                clearTimeout(reqarr[2]);
                delete LzHTTPLoader.activeRequests[lid];
            }
        }
    }
    
    // Check if any outstanding requests have timed out. 
    static function __LZcheckXMLHTTPTimeouts (lid) {
        var req = LzHTTPLoader.activeRequests[lid];
        if (req) {
            var now = (new Date()).getTime();
            var httploader = req[0];
            var dstimeout = req[1];
            //Debug.write("diff %d", now - dstimeout);
            if (now >= dstimeout) {
                //Debug.write("timeout for %s", lid);
                delete LzHTTPLoader.activeRequests[lid];
                httploader.__timeout = true;
                httploader.abort();
                httploader.loadTimeout(httploader, null);
            } else {
                // if it hasn't timed out, add it back to the list for the future
                //Debug.write("recheck timeout");
                var callback = function () {
                    LzHTTPLoader.__LZcheckXMLHTTPTimeouts(lid);
                }
                var timeoutid = flash.utils.setTimeout(callback, now - dstimeout);
                req[2] = timeoutid;
            }
        }
    }

        public function getElapsedTime () {
            return  ((new Date()).getTime() - this.gstart);
        }


    public function __setRequestHeaders (xhr, headers) {
        if (headers != null) {
            for (var key in headers) {
                var val = headers[key];
                // This gives error in Firefox ??
                xhr.setRequestHeader(key, val);
            }
        }
    }

    public function send (content = null) {
        this.loadXMLDoc(/* method */ this.requestmethod,
                        /* url */ this.requesturl,
                        /* headers */ this.requestheaders,
                        /* postbody */ content,
                        /* ignorewhite */ true);
    }

    private function configureListeners(dispatcher:IEventDispatcher):void {
        dispatcher.addEventListener(Event.COMPLETE, completeHandler);
        dispatcher.addEventListener(Event.OPEN, openHandler);
        dispatcher.addEventListener(ProgressEvent.PROGRESS, progressHandler);
        dispatcher.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
        dispatcher.addEventListener(HTTPStatusEvent.HTTP_STATUS, httpStatusHandler);
        dispatcher.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
    }

    private function completeHandler(event:Event):void {
        // trace("completeHandler: " + event + ", target = " + event.target);
        if (event.target is URLLoader) {
            //            trace("completeHandler: " , this, loader);
            //trace("completeHandler: bytesLoaded" , loader.bytesLoaded, 'bytesTotal', loader.bytesTotal);
            //trace('typeof data:', typeof(loader.data), loader.data.length, 'parsexml=', options.parsexml);
            responseText = loader.data;

            var elt = null;
            var lzxdata = null;
            removeTimeout(this);

            // Parse data into flash native XML and then convert to LFC LzDataElement tree
            try {
                if (responseText != null && options.parsexml) {
                    // This is almost identical to LzXMLParser.parseXML()
                    // except ignoreWhitespace comes from options
                    XML.ignoreWhitespace = options.trimwhitespace;
                    this.responseXML = XML(responseText);
                    this.responseXML.normalize();
                    lzxdata = LzXMLTranslator.copyXML(this.responseXML,
                                                      options.trimwhitespace,
                                                      options.nsprefix);
                }
            } catch (err) {
                trace("caught error parsing xml", err);
                loadError(this, null);
                return;
            }

            loadSuccess(this, lzxdata);
        }
    }

    private function openHandler(event:Event):void {
        trace("openHandler: " + event);
    }

    private function progressHandler(event:ProgressEvent):void {
        trace("progressHandler loaded:" + event.bytesLoaded + " total: " + event.bytesTotal);
    }

    private function securityErrorHandler(event:SecurityErrorEvent):void {
        trace("securityErrorHandler: " + event);
        removeTimeout(this);
        loadError(this, null);
    }

    private function httpStatusHandler(event:HTTPStatusEvent):void {
        trace("httpStatusHandler: " + event);
    }

    private function ioErrorHandler(event:IOErrorEvent):void {
        trace("ioErrorHandler: " + event);
        removeTimeout(this);
        loadError(this, null);
    }


    // public
    // parseXML flag : if true, translate native XML tree into LzDataNode tree,
    //                 if false, don't attempt to translate the XML (if it exists)
    public function loadXMLDoc (method, url, headers, postbody:String, ignorewhite) {
        if (this.loader == null) {
            // TODO [hqm 2008-01] wonder if we should be throwing an
            // exception or returning some indication that the send
            // did not execute? XMLHttpRequest doesn't return
            // anything, but we could... or maybe at least a debugger
            // message?
            if ($debug) {
                Debug.write("LzHTTPLoader.send, no request to send to, has open()  been called?");
            }
            return;
        }

        configureListeners(this.loader);

        var request = new URLRequest(url);
        request.data = postbody;
        request.method = (method == LzHTTPLoader.GET_METHOD) ? URLRequestMethod.GET : URLRequestMethod.POST;

        var contentType = false;

        var rhArray:Array = new Array();
        for (var k in headers) {
            request.requestHeaders.push(new URLRequestHeader(k, headers[k]));
            if (k.toLowerCase() == "content-type") {
                contentType = true;
            }

        }

        // If no content-type for POST was explicitly specified,
        // use "application/x-www-form-urlencoded"
        if ((method == "POST") && !contentType) {
            request.requestHeaders.push(
                new URLRequestHeader('Content-Type', 'application/x-www-form-urlencoded'));
        }

        try {
            loader.load(request);
            // Set up the timeout
            if (isFinite(this.timeout)) {
                this.setupTimeout(this, this.timeout);
            }
        } catch (error) {
            // TODO [hqm 2008-01] make this send appropriate error event to listener,
            // and abort the load. 
            trace("Unable to load requested document.", error);
        }
    }
}


    ////////////////////////////////////////////////////////////////
    // swf-specific stuff


    /*
      Event    Summary    Defined By
      complete
      Dispatched after all the received data is decoded and placed in the data property of the URLLoader object.  

      httpStatus
      Dispatched if a call to URLLoader.load() attempts to access data over HTTP and the current Flash Player environment is able to detect and return the status code for the request.   URLLoader
        
      ioError
      Dispatched if a call to URLLoader.load() results in a fatal error that terminates the download. URLLoader
        
      open
      Dispatched when the download operation commences following a call to the URLLoader.load() method.   URLLoader
        
      progress
      Dispatched when data is received as the download operation progresses.  URLLoader
        
      securityError
      Dispatched if a call to URLLoader.load() attempts to load data from a server outside the security sandbox.  URLLoader
    */

    /*
      URLLoaderDataFormat.TEXT




    */


