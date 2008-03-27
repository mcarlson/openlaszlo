/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LFC
  * @subtopic Data
  */


/**
  * <p>
  * <class>LzHTTPDataProvider</class> implements the DataProvider interface, to support HTTP data requests.
  * </p>  
  * @shortdesc DataProvider which implements HTTP request transport
  * @lzxname httpdataprovider
  */




class LzHTTPDataProvider extends LzDataProvider {

    function LzHTTPDataProvider ( parent:* = null, attrs:* = null, children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
    }  

    /** @access private
     * @param LzHTTPDataRequest dreq: The data request
     */

    function makeLoader ( dreq ) {
        var proxied = dreq.proxied;
        // If there is no loader, or if the loader changed it's proxied
        // flag, make a new loader.
        var tloader = new LzHTTPLoader(this, proxied);
        dreq.loader = tloader;
        tloader.loadSuccess = this.loadSuccess;
        tloader.loadError   = this.loadError;
        tloader.loadTimeout = this.loadTimeout;

        tloader.setProxied(proxied);

        /** TODO [hqm 2007-08] This code below to deal with secureport is likely broken, 
         * I need to undersatnd what is the behavior of "secureport"
         */
        /*************/
        var secure = ('secure' in dreq) ? dreq.secure : null;
        if (secure == null) {
            if (dreq.src.substring(0, 5) == "https") {
                secure = true;
            }
        }
        if (secure) {
            tloader.baserequest = LzBrowser.getBaseURL( secure, dreq.secureport );
            //Debug.write('basereq ' + tloader.baserequest);
        }
        tloader.secure = secure;
        if (secure) {
            tloader.secureport = dreq.secureport;
        }
        /*************/
    
        return tloader;
    }



    /**
     * Interrupts any load in progress for the given dataset.
     * @access protected
     * @param LzDataRequest dreq: The data request for which to interrupt the load.
     */
    function abortLoadForRequest( dreq ) {
        dreq.loader.abort();        
    }

    /**
     * @access private
     */
    override function doRequest ( dreq ) {
        // dreq.src can be null if the dataset is loaded from initialdata
        if (!dreq.src)
            return;

        //build request
        var proxied = dreq.proxied;
        // Check for previously created loader, we can reuse it

        // TODO [hqm 2007-08] If multirequests is true, we make a new loader
        // for each request. Is this correct? 
        var tloader = dreq.loader;
        if ( tloader == null || dreq.multirequest == true || dreq.queuerequests == true) {
            tloader = this.makeLoader( dreq );
        }

        tloader.dataRequest = dreq;

        tloader.setQueueing(dreq.queuerequests);
        tloader.setTimeout(dreq.timeout);

        tloader.setOption('cacheable',      dreq.cacheable == true);
        tloader.setOption('timeout',        dreq.timeout);
        tloader.setOption('trimwhitespace', dreq.trimwhitespace == true);
        tloader.setOption('nsprefix',       dreq.nsprefix == true);
        tloader.setOption('sendheaders',    dreq.getresponseheaders == true);

        if ( dreq.clientcacheable != null ){
            tloader.setOption('ccache',     dreq.clientcacheable);
        }


        var headers = {};
        var headerparams = dreq.requestheaders;
        if (headerparams != null) {
            var headernames = headerparams.getNames();
            for (var i = 0; i < headernames.length; i++) {
                var key = headernames[i];
                var val = headerparams.getValue(key);
                if (proxied) {
                    // Pass this to makeProxiedURL
                    headers[key] = val;
                } else {
                    // SOLO request, set these directly using the LzHTTPLoader API
                    tloader.setRequestHeader(key, val);
                }
            }
        }

        var qparams = dreq.queryparams;

        // Convert queryparams table into a URL-encoded query-style string
        var sep = '';
        var q = '';
        
        // If an explicit post body content arg wasn't supplied, make
        // a url-form-encoded string from the queryparams data.
        var postbody = dreq.postbody;
        if (postbody == null && qparams != null) {
            var names = qparams.getNames();
            for ( var i in names ){
                var name = names[i];
                q += sep + name + '=' + encodeURIComponent(qparams.getValue(name));
                sep = '&';
            }
            postbody = q;
        }

        var lzurl = new LzURL(dreq.src);
        
        // For GET requests, merge in params data with URL query 
        if (dreq.method == "GET") {
            if (lzurl.query != null) {
                lzurl.query = lzurl.query + "&" + postbody;
            } else {
                lzurl.query = postbody;
            }
            postbody = null;
        }

        var cachebreak = "__lzbc__="+(new Date()).getTime();
        // convert url back to string
        url = lzurl.toString();
        var url;
        if (proxied) {
            // TODO [hqm 2007-08-03] make the API for makeProxiedURL take an explicit host arg,
            // so we can set the proxy from user code
            url = tloader.makeProxiedURL(url, dreq.method, "xmldata" , headers, postbody);
            // We need to move the proxy string query data to the
            // postbody, can't leave it in the URL string, it could be
            // arbitrarily long.
            var marker = url.indexOf('?');
            var uquery = url.substring(marker+1, url.length);
            var url_noquery = url.substring(0,marker);
            url = url_noquery + '?' + cachebreak;
            postbody = uquery;
            //Debug.write("proxied req url: ", url, ', postbody: ',postbody)
        }  else {
            // break the browser cache by adding a unique string to the url
            if (!dreq.clientcacheable) {
                if (lzurl.query == null) {
                    lzurl.query = cachebreak;
                } else {
                    lzurl.query += ("&" + cachebreak);
                }
            }

            url = lzurl.toString();
        }
   
        dreq.status =  "loading";
        //Debug.write("calling tloader.open", proxied ? "POST" : dreq.method, url, "dreq.method=", dreq.method);
        tloader.open ( proxied ? "POST" : dreq.method, url, /* username */ null, /* password */ null);
        tloader.send (/* content */ postbody);
    }

    function loadSuccess ( loader, data ) { 
        var dreq = loader.dataRequest;
        dreq.status = LzDataRequest.SUCCESS;
        loader.owner.loadResponse( dreq, data );
    }

    function loadError( loader, data ) { 
        var dreq = loader.dataRequest;
        dreq.status = "error";
        loader.owner.loadResponse( dreq, data );
    }

    function loadTimeout( loader, data ) { 
        var dreq = loader.dataRequest;
        dreq.status = LzDataRequest.TIMEOUT;
        dreq.onstatus.sendEvent( dreq );
    }

    function setRequestError (dreq, msg) {
        dreq.error = msg;
        dreq.status = LzDataRequest.ERROR;
    }

    /**
     * @param dataRequest dreq:
     * @param LzDataElement data:
     */
    function loadResponse( dreq, data ) {
        var headers = new LzParam( );
        // build a hashtable of header values. 
        // If the header is repeated, construct a list to hold
        // all its values.
        var content = null;


        if (data == null) {
            this.setRequestError(dreq, "client could not parse XML from server");
            dreq.onstatus.sendEvent( dreq );
            return;
        }

        var proxied = dreq.proxied;

        if (data.childNodes[0].nodeName == "error") {
            this.setRequestError(dreq, data.childNodes[0].attributes['msg']);
            dreq.onstatus.sendEvent( dreq );
            return;
        }

        if (proxied) {
            // For proxied requests, we get back an XML wrapper
            // <resulset><body>DATA</body><headers>HEADERS</headers></resultset>
            // extract the headers and body below:
            var hos = ('childNodes' in data.childNodes[1]) ? data.childNodes[1].childNodes : null;
            // get proxy metadata (header, etc) info if any
            if (hos != null) {
                for ( var i = 0; i < hos.length; i++ ){
                    var h = hos[i];
                    if (h.attributes) headers.addValue( h.attributes.name , h.attributes.value );
                }
            }
            if (data.childNodes[0].childNodes) content = data.childNodes[0].childNodes[0];
        } else {
            // SOLO requests are raw XML data
            content = data;
        }

        dreq.xmldata = content;
        dreq.responseheaders = headers;
        dreq.rawdata = dreq.loader.getResponse();
        dreq.onstatus.sendEvent( dreq );

    }
}


/**
  * <p>
  * <class>LzHTTPDataRequest</class> implements the DataProvider interface, to support HTTP data requests.
  * </p>
  * @shortdesc A class to represent HTTP data requests.
  * @lzxname httpdatarequest
  */


class LzHTTPDataRequest extends LzDataRequest {

    function LzHTTPDataRequest ( parent:* = null, attrs:* = null, children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
        this.requestor = parent;
    }  

    var method = "GET"; //  : String; // GET, POST, PUT, DELETE
    var postbody; // : String
    var proxied;  // : boolean

    var multirequest = false;
    var queuerequests = false;

    var queryparams = null; // : LzParam object

    var requestheaders = null; // : LzParam object

    var getresponseheaders = false;
    var responseheaders = null; // : LzParam object, returned by dataprovider


    var  cacheable         = false;
    var  clientcacheable   = null;
    var  trimwhitespace    = false;
    var  nsprefix          = false;


    /** The LZX DOM element containing the loaded data */
    var xmldata = null;
    // time it took to load 
    var loadtime = 0;

    var secure = false;
    var secureport;


    // private, pointer to our lzhttploader
    var loader = null;

}

var httpdataprovider = new LzHTTPDataProvider();
var defaultdataprovider = httpdataprovider;
