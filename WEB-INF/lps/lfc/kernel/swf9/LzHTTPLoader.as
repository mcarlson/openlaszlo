/**
  * LzHTTPLoader.as
  *
  * @copyright Copyright 2007-2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic swf9
  * @affects lzloader
  */

public class LzHTTPLoader {

    #passthrough (toplevel:true) {
        import flash.events.IEventDispatcher;
        import flash.events.Event;
        import flash.events.IOErrorEvent;
        import flash.events.ProgressEvent;
        import flash.events.SecurityErrorEvent;
        import flash.net.URLLoader;
        import flash.net.URLLoaderDataFormat;
        import flash.net.URLRequest;
        import flash.net.URLRequestHeader;
        import flash.net.URLRequestMethod;
        import flash.utils.clearTimeout;
        import flash.utils.setTimeout;
    }#

    static const GET_METHOD:String    = "GET";
    static const POST_METHOD:String   = "POST";
    static const PUT_METHOD:String    = "PUT";
    static const DELETE_METHOD:String = "DELETE";

    // holds list of outstanding data requests, to handle timeouts
    static const activeRequests :Object = {};
    static var loaderIDCounter :uint = 0;

    const owner:*;
    const __loaderid:uint;
    var __abort:Boolean = false;
    var __timeout:Boolean = false;
    var gstart:Number;
    var secure:Boolean;
    var options:Object;
    // Default infinite timeout
    var timeout:Number = Infinity;
    
    var requestheaders:Object;
    var requestmethod:String;
    var requesturl:String;
    
    var responseText:String;
    var responseXML:XML = null;

    // The URLLoader object
    var loader:URLLoader = null;

    var dataRequest:LzHTTPDataRequest = null;
    var baserequest:LzURL;
    var secureport:uint;

    public function LzHTTPLoader (owner:*, proxied:Boolean) {
        super();
        this.owner = owner;
        this.options = {parsexml: true, serverproxyargs: null};
        this.requestheaders = {};
        this.requestmethod = LzHTTPLoader.GET_METHOD;
        this.__loaderid = LzHTTPLoader.loaderIDCounter++;
    }

    // Default callback handlers
    public var loadSuccess:Function = function (...data) :void { trace('loadSuccess callback not defined on', this); }
    public var loadError:Function   = function (...data) :void { trace('loadError callback not defined on', this); };
    public var loadTimeout:Function = function (...data) :void { trace('loadTimeout callback not defined on', this); };

    /* Returns the response as a string  */
    public function getResponse () :String {
        return this.responseText;
    }

    /* Returns numeric status code (200, 404, 500, etc...) */
    public function getResponseStatus () :int {
        // nyi - only available in IE, see doc: flash.events.HTTPStatusEvent#status
        return 0;
    }

    /* Returns an array of response headers  */
    public function getResponseHeaders () :Array {
        // There seems to be no way to get response headers in the flash.net URLLoader API
        // flash.events.HTTPStatusEvent docs say response headers are AIR-only
        return null;
    }
    
    public function getResponseHeader (key:String) :String {
        // There seems to be no way to get response headers in the flash.net URLLoader API
        trace('getResponseHeader not implemented in swf9');
        return null;
    }

    /* @param Object obj:  A hash table of headers for the HTTP request
       @access public
    */
    public function setRequestHeaders (obj:Object) :void {
        this.requestheaders = obj;
    }

    /* @param String key:  HTTP request header name
       @param String val:  header value
       @access public
    */
    public function setRequestHeader (key:String, val:String) :void {
        this.requestheaders[key] = val;
    }

    /* @public */
    public function setOption (key:String, val:*) :void {
        this.options[key] = val;
    }

    /* @public */
    public function getOption (key:String) :* {
        return this.options[key];
    }

    /* @public */
    public function setProxied (proxied:Boolean) :void {
        this.setOption('proxied', proxied);
    }

    /* @public */
    public function setQueryParams (qparams:Object) :void {
    }

    /* @public */
    public function setQueryString (qstring:String) :void {
    }

    /*
      If queueRequests is true, subsequent requests will made sequentially
      If queueRequests is false, subsequent requests will interrupt requests already in process
    */
    public function setQueueing (queuing:Boolean) :void {
        this.setOption('queuing', queuing);
        // [todo hqm 2006-07] NYI
    }

    public function abort () :void {
        if (this.loader) {
            this.__abort = true;
            this.loader.close();
            this.loader = null;
            this.removeTimeout(this);
        }
    }

    // headers can be a hashtable or null
    public function open (method:String, url:String, username:String = null, password:String = null) :void {
        if (this.loader) {
            if ($debug) {
                Debug.warn("pending request for id=%s", this.__loaderid);
            }
            this.abort();
        }
    
        this.loader = new URLLoader();
        this.loader.dataFormat = URLLoaderDataFormat.TEXT;

        this.responseText = null;
        this.responseXML = null;

        this.__abort = false;
        this.__timeout = false;
        this.requesturl = url;
        this.requestmethod = method;
    }
    
    public function send (content:String = null) :void {
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
    public function makeProxiedURL( proxyurl:String,
                                    url:String,
                                    httpmethod:String,
                                    lzt:String,
                                    headers:Object,
                                    postbody:String):String {
        var params:Object = {
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

    public function setTimeout (timeout:Number) :void {
        this.timeout = timeout;
        // [todo hqm 2006-07] Should we have  an API method for setting LzLoader timeout?
    }

    // Set up a pending timeout for a loader.
    public function setupTimeout (httploader:LzHTTPLoader, duration:Number) :void {
        var endtime:Number = (new Date()).getTime() + duration;
        var lid:uint = httploader.__loaderid;
    
        LzHTTPLoader.activeRequests[lid] = [httploader, endtime];
        var callback:Function = function () :void {
            LzHTTPLoader.__LZcheckXMLHTTPTimeouts(lid);
        }
        var timeoutid:uint = flash.utils.setTimeout(callback, duration);
        LzHTTPLoader.activeRequests[lid][2] = timeoutid;
    }
    
    // Remove a loader from the timeouts list.
    public function removeTimeout (httploader:LzHTTPLoader) :void {
        var lid:uint = httploader.__loaderid;
        //Debug.write("remove timeout for id=%s", lid);
        var reqarr:Array = LzHTTPLoader.activeRequests[lid];
        if (reqarr && reqarr[0] === httploader) {
            clearTimeout(reqarr[2]);
            delete LzHTTPLoader.activeRequests[lid];
        }
    }
    
    // Check if any outstanding requests have timed out. 
    static function __LZcheckXMLHTTPTimeouts (lid:uint) :void {
        var req:Array = LzHTTPLoader.activeRequests[lid];
        if (req) {
            var now:Number = (new Date()).getTime();
            var httploader:LzHTTPLoader = req[0];
            var dstimeout:Number = req[1];
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
                var callback:Function = function () :void {
                    LzHTTPLoader.__LZcheckXMLHTTPTimeouts(lid);
                }
                var timeoutid:uint = flash.utils.setTimeout(callback, now - dstimeout);
                req[2] = timeoutid;
            }
        }
    }

    public function getElapsedTime () :Number {
        return ((new Date()).getTime() - this.gstart);
    }

    private function configureListeners(dispatcher:IEventDispatcher):void {
        dispatcher.addEventListener(Event.COMPLETE, completeHandler);
        dispatcher.addEventListener(Event.OPEN, openHandler);
        dispatcher.addEventListener(ProgressEvent.PROGRESS, progressHandler);
        dispatcher.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
        dispatcher.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
    }

    private function completeHandler(event:Event):void {
        // trace("completeHandler: " + event + ", target = " + event.target);
        if (event && event.target is URLLoader) {
            //trace("completeHandler: " , this, loader);
            //trace("completeHandler: bytesLoaded" , loader.bytesLoaded, 'bytesTotal', loader.bytesTotal);
            //trace('typeof data:', typeof(loader.data), loader.data.length, 'parsexml=', options.parsexml);
            if (this.loader == null) {
                // URLLoader was cleared, ignore complete event
            } else if (this.__timeout) {
                // request has timed out, ignore complete event
            } else if (this.__abort) {
                // request was cancelled, ignore complete event
            } else {
                removeTimeout(this);
                
                this.responseText = loader.data;
                loader = null;
                
                if (this.options['parsexml']) {
                    var lzxdata:LzDataElement = null;
                
                    // Parse data into flash native XML and then convert to LFC LzDataElement tree
                    try {
                        if (this.responseText != null) {
                            // This is almost identical to LzXMLParser.parseXML()
                            // except ignoreWhitespace comes from options
                            XML.ignoreWhitespace = options.trimwhitespace;
                            this.responseXML = XML(responseText);
                            this.responseXML.normalize();
                            lzxdata = LzXMLTranslator.copyXML(this.responseXML,
                                                              options.trimwhitespace,
                                                              options.nsprefix);
                        }
                    } catch (err:Error) {
                        trace("caught error parsing xml", err);
                        loadError(this, null);
                        return;
                    }
                    loadSuccess(this, lzxdata);
                } else {
                    loadSuccess(this, this.responseText);
                }
            }
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
        loader = null;
        loadError(this, null);
    }

    private function ioErrorHandler(event:IOErrorEvent):void {
        trace("ioErrorHandler: " + event);
        removeTimeout(this);
        loader = null;
        loadError(this, null);
    }

    // public
    // parseXML flag : if true, translate native XML tree into LzDataNode tree,
    //                 if false, don't attempt to translate the XML (if it exists)
    public function loadXMLDoc (method:String, url:String, headers:Object, postbody:String, ignorewhite:Boolean) :void {
        if (this.loader == null) {
            // TODO [hqm 2008-01] wonder if we should be throwing an
            // exception or returning some indication that the send
            // did not execute? XMLHttpRequest doesn't return
            // anything, but we could... or maybe at least a debugger
            // message?
            if ($debug) {
                Debug.warn("LzHTTPLoader.send, no request to send to, has open()  been called?");
            }
            return;
        }
        
        var secure:Boolean = (url.indexOf("https:") == 0);
        url = lz.Browser.toAbsoluteURL( url, secure );

        configureListeners(this.loader);

        var request:URLRequest = new URLRequest(url);
        request.data = postbody;
        request.method = (method == LzHTTPLoader.GET_METHOD) ? URLRequestMethod.GET : URLRequestMethod.POST;
        //TODO: [20080916 anba] set content-type?
        //request.contentType = "application/x-www-form-urlencoded";

        var hasContentType:Boolean = false;
        for (var k:String in headers) {
            request.requestHeaders.push(new URLRequestHeader(k, headers[k]));
            if (k.toLowerCase() == "content-type") {
                hasContentType = true;
            }
        }

        // If no content-type for POST was explicitly specified,
        // use "application/x-www-form-urlencoded"
        if ((method == "POST") && !hasContentType) {
            request.requestHeaders.push(
                new URLRequestHeader('Content-Type', 'application/x-www-form-urlencoded'));
        }

        try {
            this.gstart = (new Date()).getTime();
            this.loader.load(request);
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
