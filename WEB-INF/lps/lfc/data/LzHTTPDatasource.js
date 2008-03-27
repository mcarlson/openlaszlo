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
  * The datasource tag is an optional way of representing a server side datasource. The datasource's parameters can 
  * specify ways in which the client will make backend requests. Also, more than one dataset can share a datasource, and the datasource can be used to control session related information. Finally, since HTTP is the default transport for datasets, a dataset that doesn't appear inside a datasource will create an anonymous one by default.
  * </p>
  *
  * @shortdesc A way of representing a server-side HTTP datasource.
  * @lzxname datasource
  * @devnote Datasources represent queryable server-side Datasources, capable of creating 
  * or changing Datasets.  Datasources are type-specific, i.e. http, jdbc or 
  * soap.
  * Datasources manage connections to the server,  handle timeouts and send 
  * ondata and onerror events.  They have no public methods.
  */

class LzHTTPDatasource extends LzDatasource {

  static var setters = new LzInheritedHash(LzDatasource.setters);
  static var getters = new LzInheritedHash(LzDatasource.getters);
  static var defaultattrs = new LzInheritedHash(LzDatasource.defaultattrs);
  static var options = new LzInheritedHash(LzDatasource.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzDatasource.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzDatasource.earlySetters);


/** @access private
  * @modifiers override 
  */
static var tagname = 'datasource';

var reqtype = "GET";

    function LzHTTPDatasource ( parent:* = null , attrs:* = null, children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
    }

/**
  * Compute the boolean value for 'proxied', using inheritance if needed
  * @access private
  * @return boolean
  */
function isProxied ( forset ) {
    var proxied_p = canvas.proxied;
    // check if this datasource has a "proxied" attribute which overrides canvas switch
    if (this.proxied != null && this.proxied != "inherit") {
        proxied_p = (this.proxied == "true"); // coerce to boolean
    }

    // Check if the dataset has a "proxied" attribute which overrides dataset's value
    if (forset.proxied != null && forset.proxied != "inherit") {
        proxied_p = (forset.proxied == "true");
    }
    return proxied_p;
}

/**
  * @access private
  */
function doRequest ( forset ) {
    //build request
    var proxied = this.isProxied(forset);
    var tloader = this.getLoaderForDataset( forset, proxied );
    tloader.setOption('cacheable', forset.cacheable == true);
    if ( forset.clientcacheable != null ){
        tloader.setOption('ccache',  forset.clientcacheable);
    }
    tloader.setOption('timeout', forset.timeout);
    tloader.setOption('trimwhitespace', forset.trimwhitespace == true);
    tloader.setOption('nsprefix', forset.nsprefix == true);
    tloader.setOption('sendheaders', forset.getresponseheaders == true);

    var headers = {};
    var headerparams = forset.getRequestHeaderParams();
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

    forset.clearRequestHeaderParams();

    var qparams = forset.getParams( );
    var querystring = forset.getQueryString();

    // Append query params and query string into single query string
    //Debug.debug('calling doRequest', this);
    var sep = '';
    var q = '?';
        
    var lzpostbody = null;

    var names = qparams.getNames();
    for ( var i in names ){
        var name = names[i];
        // Strip out special case key "lzpostbody", it declares a raw
        // string content to post.
        if (!proxied && name == 'lzpostbody') {
            lzpostbody = qparams.getValue(name);
        } else {
            q += sep + name + '=' + encodeURIComponent(qparams.getValue(name));
            sep = '&';
        }
    }

    if (querystring != null && querystring.length > 0) {
        if (q.length > 0) {
            q += sep + querystring;
        } else {
            q = querystring;
        }
    }

    var url = this.src
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

    if (proxied) {
        url = tloader.makeProxiedURL(url, this.reqtype, "xmldata" , headers);
    }  else {
        // break the browser cache by creating an arg with a unique value
        if (!forset.clientcacheable) {
            var cachebreak = "__lzbc__="+(new Date()).getTime();
            if (url.indexOf('?') >= 0) {
                url = url + "&" + cachebreak;
            } else {
                url = url + "?" + cachebreak;
            }
        }
    }
   
    tloader.open (proxied ? "POST" : this.reqtype, url, /* username */ null, /* password */ null);
    tloader.send (/* content */ lzpostbody)
}

/**
  * Sets the query type of the datasource to "GET" or "POST".  Note that this 
  * controls how the LPS server makes a request of the backend, as well as how the
  * client communicates with the LPS
  * @param String d: A string -- either "GET" or "POST".  GET is the default.
  * When the type is "POST", the query parameters will be sent in the 
  * request body, encoded as application/x-www-form-urlencoded  If the type is "POST" and
  * there is a exactly one request parameter and it is named "lzpostbody", it will be used
  * as the raw request body (unencoded).  Use of "lzpostbody" with a request
  * that has more than one request parameter is undefined.
  */
function setQueryType ( d ) {
    this.reqtype = d;
}


/**
  * @access private
  */
function processRawData ( forset , d ) {
    var o = new LzParam( forset );
    // build a hashtable of header values. 
    // If the header is repeated, construct a list to hold
    // all its values.
    var content = null;

    if (d == null) {
        forset.gotError("client could not parse XML from server");
        return;
    }

    forset.rawtext = d.rawtext;
    var proxied = this.isProxied(forset);

    if (d.childNodes[0].nodeName == "error") {
        forset.gotError(d.childNodes[0].attributes['msg']);
        return;
    }

    if (proxied) {
        // For proxied requests, we get back an XML wrapper
        // <resulset><body>DATA</body><headers>HEADERS</headers></resultset>
        // extract the headers and body below:
        var hos = ('childNodes' in d.childNodes[1]) ? d.childNodes[1].childNodes : null;
        // get proxy metadata (header, etc) info if any
        if (hos != null) {
            for ( var i = 0; i < hos.length; i++ ){
                var h = hos[i];
                if (h.attributes) o.addValue( h.attributes.name , h.attributes.value );
            }
        }
        if (d.childNodes[0].childNodes) content = d.childNodes[0].childNodes[0];
    } else {
        // SOLO requests are raw XML data
        content = d;
    }

    forset.setData( content , o );

}

} // End of LzHTTPDatasource

// Install backwards-compatible alias in tag map
ConstructorMap[LzHTTPDatasource.tagname] = LzHTTPDatasource;
