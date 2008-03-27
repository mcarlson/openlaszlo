/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic LFC
  * @subtopic Data
  * @access public
  */


/**
  * 
  * <p> A <tagname>dataset</tagname> tag defines a
  *  local dataset.  The name of the dataset is used in the <attribute>datapath</attribute>
  *  attribute of a view. </p>
  * 
  * <p>
  * The <attribute>src</attribute> attribute of the <tagname>dataset</tagname> element specifies whether the data is compiled into the 
  * application or fetched at runtime:
  * </p>
  * <ul>
  * <li>If the src attribute is a URL, the value of
  *  the dataset is the XML data that a request to the URL named by the
  *  src attribute returns when the application is run.</li>
  *  <li>If the src
  *  attribute is a pathname, the value of the dataset is the content of
  *  the XML file that the pathname refers to, and is compiled into the
  *  application.</li>
  * <li>  If the src attribute is not present, the value of the
  *  dataset is the content of the <tagname>dataset</tagname> element.</li>
  * </ul>
  * 
  * <p>All data in an OpenLazlo application is contained within one or more datasets. A given dataset usually represents a single conceptual set that may or may not be modified or reloaded during the execution of the application. 
  * The data within a dataset is accessed using a <tagname link="true">datapointer</tagname> or a instance of one of its subclasses. 
  * Datasets can represent</p>
  * 
  * <ul>
  * <li>local data (i.e. data which is static after compile time), or </li>
  * <li>http-data (data which is returned as XML over HTTP)</li>
  * </ul>
  * 
  * <p>
  * If a dataset is not explictly contained within in a <xref linkend="LzDatasource"/>, it will make an instance of datasource and be contained inside that. A dataset can be populated or re-poplulated at runtime by calling <code>doRequest</code> on the dataset. The result of the request is then returned to the application and the dataset's <xref linkend="LzDataset.prototype.ondata"/> event is run. Any <xref linkend="LzDatapointer"/> that is bound to the dataset will also run its <link linkend="LzDatapointer.prototype.ondata">ondata</link> event at this time as well.
  * </p>
  * <p>See the <a href="${dguide}data-structures.html">Developers's Guide</a> for more discussion of data and datasets. </p>
  * <p>
  * <b>Datasets in SOLO applications</b>.  Datasets are implemented differently in proxied and SOLO applications, with slight differences in functionality. For example, in SOLO applications in the SWF7 and SWF8 runtime is it not possible to retrieve http response headers. Also, white space may be handled differently.  See the <a href="${dguide}proxied.html">Developer's Guide</a>.
  * </p>
  * 
  * <p>
  * The example below makes a request of the cgi script on Laszlo's website that serves up weather information in xml form.</p>
  * 
  * <example title="Making a request using a dataset">
  * <programlisting>&lt;canvas height="250" width="800" debug="true"&gt;
  *  &lt;debug y="100"/&gt; 
  *  &lt;dataset type="http" name="weatherdata"
  *           src="http://www.laszlosystems.com/cgi-pub/weather.cgi"/&gt; 
  *  &lt;view&gt;
  *     &lt;inputtext width="90" name="t"&gt;zip&lt;/inputtext&gt;
  *     &lt;button&gt;  submit
  *       &lt;handler name="onclick"&gt; var d = canvas.datasets.weatherdata;
  *         Debug.write("sending request for weather data.");
  *         d.setQueryString({zip : parent.t.getText()});
  *         d.doRequest(); 
  *       &lt;/handler&gt;
  *     &lt;/button&gt;
  *     &lt;datapointer xpath="weatherdata:/weather"&gt;
  *       &lt;handler name="ondata"&gt;
  *         var duplicate_pointer = this.dupePointer();
  *         duplicate_pointer.selectChild();
  *         while (duplicate_pointer.selectNext()){
  *           Debug.write(duplicate_pointer.serialize());
  *         }
  *       &lt;/handler&gt;
  *     &lt;/datapointer&gt;
  *     &lt;simplelayout axis="x"/&gt;
  *   &lt;/view&gt;
  * &lt;/canvas&gt;</programlisting></example>
  *
  * <p>In addition to any fields documented in the section below, these fields are also available:
  *
  * String <attribute>querystring</attribute>: A string to be appended to the request that
  * the <class>dataset</class> makes. </p>
  *
  * @shortdesc An in-memory xml-style data hierarchy.
  * @lzxname dataset
  * @initarg deprecated port
  * @initarg secureport
  * @initarg querytype
  * @initarg src
  * @initarg timeout
  */

// [2008-03-18 pbr] dynamic is a temp fix to allow runtime property creation
dynamic class LzDataset extends LzNode with LzDataElementMixin, LzDataNodeMixin {

  static var setters = new LzInheritedHash(LzNode.setters);
  static var getters = new LzInheritedHash(LzNode.getters);
  static var defaultattrs = new LzInheritedHash(LzNode.defaultattrs);
  static var options = new LzInheritedHash(LzNode.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzNode.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzNode.earlySetters);

  LzDataset.setters.querytype = "setQueryType";
  LzDataset.setters.data = "setData";
  LzDataset.setters.src = "setSrc";
  LzDataset.setters.autorequest = "setAutorequest";
  LzDataset.setters.request = "setRequest";
  LzDataset.setters.initialdata = "setInitialData";

  // These setters are defined in LzDataElementMizin
  LzDataset.setters.attributes = "setAttrs";
  LzDataset.setters.childNodes = "setChildNodes";
  LzDataset.setters.nodeName   = "setNodeName";

  // These setters are defined in LzDataNodeMizin
  LzDataset.setters.ownerDocument = "setOwnerDocument";



/** @access private
  * @modifiers override 
  */
static var tagname = 'dataset';
 
static var slashPat = "/";

var dataprovider = defaultdataprovider;
var multirequest = false;
var dataRequest = null; 
var dataRequestClass = LzHTTPDataRequest;
var dsloadDel = null;
var errorstring;
var reqOnInitDel;
var clientcacheable;
var secureport;


/** @lzxtype event */
//var ondata = LzDeclaredEvent;
/** Sent when the dataset's request results in an error. 
 * @lzxtype event
 */
var onerror = LzDeclaredEvent;
/** Sent when the request made by the dataset times out. 
  * @lzxtype event
  */
var ontimeout = LzDeclaredEvent;

var timeout = 60000;

var postbody = null;

// var src = null;

/** When true, the server will accept
  * encoded responses for this request.  
  * Encoded responses require more work for the LPS (encoding the 
  * response) and client (decoding the response) in trade for lower 
  * network bandwidth usage.
  * @type Boolean
  */
var acceptencodings = false;

/** An LzParams object which holds query key-value pairs.
    @type LzParam
 */
var params = null;

/** When true, the server will preserve namespace prefixes
  * on data node names and attribute names
  * @type Boolean
  */
var nsprefix = false;

/** When true, the server will encode and 
  * send the HTTP response headers along with the data (defaults to false). 
  * Due to a lack of a native API to get this information, SOLO SWF applications
  * will always return an empty set. 
  * @type Boolean
  */
var getresponseheaders = false;


/**  HTTP method */

var querytype = "GET";

/** When true, the server will trim 
  * whitespace in the XML data (defaults to false).  
  * @type Boolean
  * @keywords final
  */
var trimwhitespace = false;

/** When true, the server will attempt to cache 
  * response (defaults to false).  There are security concerns 
  * when this field is true.  When this field is true, you will usually
  * want the getresponseheaders field to be false.
  * @type Boolean
  */
var cacheable = false;

/** A string to be appended to the request that
  * the dataset makes. 
  * @type String
  */
var querystring = null;

/**
  * @access private
  */
//setters.data = "setData";

/** The source for requests made by this dataset.
  * @type String
  */
var src = null;
//setters.src = "setSrc";


/** The type of request to make, typically null or 'http'
  * @type String
  */
// Necessary for sef9 to prevent addProperty from failing
var type = null;

/** @access private */
//setters.autorequest = "setAutorequest";

/** If true, the datset will make a request when it
  * inits. The default for this is false.
  * @type Boolean
  */
var request = false;
//setters.request = "setRequest";

var autorequest = false;
var headers = null;
var proxied = null;
var responseheaders = null;
var queuerequests = false;
var oncanvas;

/** @access private */
//setters.initialdata = "setInitialData";

/** @access private */

    function LzDataset ( parent:* = null, args:* = null, children:* = null, instcall:*  = null) {
        super(parent,args,children,instcall);
    }

override function construct ( v , args ) {

    this.nodeType = LzDataNode.DOCUMENT_NODE;
    this.queuerequests = false; // default to false, to emulate browser default
    this.oncanvas = parent == canvas || parent == null;

    if (this._instanceAttrs['name'] == null) {
        this._instanceAttrs['name'] = 'localdata';
    }

    // bwcompat 1.0 support for port
    if (('port' in args && args.port) && !('secureport' in args && args.secureport)) {
        args.secureport = args.port;
    }

    this.ownerDocument = this;

    
    if ('timeout' in args && args.timeout) {
        this.timeout = args.timeout;
    } else {
        this.timeout = canvas.dataloadtimeout;
    }


    super.construct.apply(this, arguments);
}

/**
  * Sets the name of this datasource - used only by initializer
  * @access private
  */
function setName(name, ignore = null) {
    super.setName.apply(this, arguments);

    //for compatibility with dataNode API
    this.nodeName = name;

    if (!('datasets' in canvas) || null == canvas.datasets ) {
        canvas.datasets = {};
    }

    //support "name is global identifier on canvas" behavior

    if ( this.oncanvas ){
        if ($debug) {
          if (global[name] && global[name] !== this) {
            Debug.warn('Redefining #%s from %w to %w', 
                       name, global[name], this);
          }
        }
        global[ name ] = this;
        canvas[ name ] = this;
    } else {
        // it's local - add the parent's UID
        name = this.parent.getUID() + '.' + name;
    }

    if (null != canvas.datasets[name]) {
        if ($debug) {
            Debug.warn("A dataset already exists with the name '%s': %w",
                       name, canvas.datasets[name]);
        }
    }

    canvas.datasets[name] = this;
}

/**
  * Extend LzNode.destroy: remove yourself from the 97 places you
  * installed yourself (do we really need all these aliases?) and
  * destroy your datasource node if you made one for yourself.
  * @access private
  */
override function destroy ( recursiveCall = null ) {
    this.setChildNodes([ ]);
    this.dataRequest = null;

    if (this.dsloadDel) {
        this.dsloadDel.unregisterAll();
    }
    
    var name = this.name;
    if (this.oncanvas) {
        if (canvas[ name ] === this) {
            delete canvas [ name ];
        }
        if (global[ name ] === this) {
            delete global [ name ];
        }
    }    else {
        name = this.parent.getUID() + '.' + name;
    }
    if (canvas.datasets[ name ] === this) {
        delete canvas.datasets[ name ];
    }

   super.destroy.apply(this, arguments);
}

/**
  * Return the src attribute of the dataset, if one was given.
  * @return String: The src of attribute of the dataset
  */
function getSrc ( ){
    return this.src;
}

/**
  * Returns the querystring attribute of the dataset, if there is one
  * @return String: The querystring attribute of the dataset
  */
function getQueryString (){
    if (typeof(this.querystring) == 'undefined') {
        return "";
    } else {
        return this.querystring;
    }
}

/**
  * Returns an LzParams object holding any set request parameters for the 
  * dataset.
  * @return LzParam: The request parameters for the dataset.
  */
function getParams (){
    if (this.params == null) {
        new LzParam ( this , { name : "params" } );
    }

    return this.params;
}

/**
  * Returns the status of the dataset's request. Always returns 200 since the 
  * server will respond with an error if the request fails.
  * @deprecated Use <code>onerror</code> or <code>ontimeout</code>
  * events instead
  */
function getStatusCode (){
    if ( $debug ){
      Debug.info("%s.%w is deprecated.  Use `onerror` and `ontimeout` events instead.",
                 this, arguments.callee);
    }
    return 200;
}

/**
  * Sets the data for the dataset
  * @param data a LzDataElement or list of Elements
  * @param headers optional HTTP response headers
  * @access private
  */
override function setData( data , headers = null ) {
    if ( data == null ) return;
    if (data instanceof Array) {
        this.setChildNodes( data );
    } else {
        this.setChildNodes( [data] );
    }
                
    this.data = data;

    if ('responseheaders' in this && this.responseheaders != null) {
        this.responseheaders.destroy();
    }
    this.responseheaders = headers;

    if (this.ondata.ready) this.ondata.sendEvent( this );
}


/**
  * Called when an error is received from the datasource.  
  * @access private 
  * @param e: the dataset whose request resulted in error
  */
function gotError ( e ){
    this.errorstring = e;
    if (this.onerror.ready) this.onerror.sendEvent( this );
}

/**
  * Called when a timeout is recieved from the datasource.  
  * @access private
  */
function gotTimeout (){
    if (this.ontimeout.ready) this.ontimeout.sendEvent( this );
}

/**
  * This is the shared interface with datapointer
  * @access private
  */
function getContext ( chgpkg = null){
    return this;
}

/**
  * This is the shared interface with datapointer
  * @access private
  */
function getDataset (){
    return this;
}

/**
  * Returns a datapointer pointing to the root of the dataset.
  * @return LzDatapointer: A datapointer that points to the root of the dataset.
  */
function getPointer (){
    var dp = new LzDatapointer( null );
    dp.p = this.getContext();
    return dp;
}

/**
  * Sets the querystring parameter of the dataset to the given
  * string. If an object is given instead of a string, the object will be 
  * automatically converted to a string and used instead. The dataset's 
  * querystring will be pre-pended to any request made for the dataset.
  * @param String s: A string to be appended to any query made on behalf of
  * this dataset.
  */
function setQueryString( s ) {
    this.params = null;
    if ( typeof( s ) == "object" ){
        if (s instanceof  LzParam){
            this.querystring = s.toString();
        } else {
            var p = new LzParam ( this );
            for ( var n in s ) {
                p.setValue( n, s[n], true );
            }
            this.querystring = p.toString();
            p.destroy();
        }
    } else {
        this.querystring = s;
    }

    if ( this.autorequest ) {
        this.doRequest();
    }
}

/**
  * Sets the src attribute of the data request.
  * @param String src: A new src URL for data request.

  Need to handle these cases
  http:foo.html
  http:/foo/bar.html
  http:foo.ksp?q=12
  http:/foo.ksp?q=12
  http:/foo/bar.ksp?q=12
  
  */

function setSrc( src, value=null ) {
    this.src = src;
    if ( this.autorequest ){
        this.doRequest() ;
    }
}


/**
  * Sets whether or not the dataset makes its request directly to the target server
  * or via the LPS server proxy.
  * @param String val: If 'true', the dataset will make its request when it is 
  * initialized, if 'false', request will be direct, if 'inherit', it will inherit
  * from its datasource.
  */

function setProxyRequests( val ) {
    if (typeof(val) != 'string') {
        if ($debug) {
            Debug.warn("arg '%w' to setProxyRequests must be a string with value 'inherit', 'true', or 'false'", val);
        }
    } else {
        this.proxied = val;
    }
}


/**
  * Sets whether or not the dataset makes its request upon initialization
  * @param Boolean b: If true, the dataset will make its request when it is 
  * initialized
  */
function setRequest( b, val=null ) {
    this.request = b;
    if ( ! b ) return;
    if ( !this.isinited ){
        this.reqOnInitDel = new LzDelegate( this , "doRequest" , 
                                                  this, "oninit" );
    }
}

/**
  * Returns the number of miliseconds it took to load the dataset's request
  * @return Int: Number of miliseconds it took to load the last request.
  */
function getLoadTime( ) {
    if ( $debug ){
      Debug.info("%w.%s is deprecated.  Look at `%w.loadtime` object instead.",
                 this, arguments.callee, this.dataRequest);
    }
}

/**
  * Sets a named query parameter to the given value. The query parameters are 
  * sent with every request.  The key 'lzpostbody' has a specific interpretation,
  * see setQueryType() for details.
  * @param String key: The name of the parameter
  * @param String val: The value for the parameter
  */
function setQueryParam( key , val ) {
    this.querystring = null;
    if ( ! this.params ){
        new LzParam ( this , { name : "params" } );
    }
    this.params.setValue( key, val );

    if ( this.autorequest ) {
        this.doRequest();
    }
}

/**
  * Sets multiple query parameters from using the keys in the argument as keys
  * and the values of those keys as values. This method can also be used to
  * clear the query params, by passing null to it.
  * @param Object o: An object whose keys are keys of parameters and whose 
  * values are those parameters' values. Passing a value of null to this 
  * method clears the query parameters.
  * The key 'lzpostbody' has a specific interpretation, see setQueryType() for details.
  */
function setQueryParams( o ) {
    this.querystring = null;
    if ( ! this.params ){
        //new LzParam ( this , { name : "params" } );
        // [todo 2006-06 hqm] this.params does not seem to be getting set
        // in IE -- temporary patch here to work around 
        this.params = new LzParam ( this , { name : "params" } );
    }

    if ( o ) {
        this.params.addObject( o );
    } else if ( o == null ){
        this.params.remove();
    }

    if ( o && this.autorequest ) {
        this.doRequest();
    }
}


/**
  * Compute the boolean value for 'proxied', using inheritance if needed
  * @access private
  * @return boolean
  */
function isProxied ( ) {
    var proxied_p = canvas.proxied;
    // check if this datasource has a "proxied" attribute which overrides canvas switch
    if (this.proxied != null && this.proxied != "inherit") {
        proxied_p = (this.proxied == true); // coerce to boolean
    }

    // Check if the dataset has a "proxied" attribute which overrides dataset's value
    if (this.proxied != null && this.proxied != "inherit") {
        proxied_p = (this.proxied == true);
    }
    return proxied_p;
}

/**
   Produce a hash table of key-value pairs.
   In the case of a duplicated key, creates an array of values.
*/
static function queryStringToTable ( query ) {
  var queries = {};
  var parameters = query.split('&');
  for (var i in parameters) {
    var key = parameters[i];
    var value = '';
    var n = key.indexOf('=');
    if (n > 0) {
      value = unescape(key.substring(n+1));
      key = key.substring(0, n);
    }
    if (key in queries) {
        var prev = queries[key];
        if (prev instanceof Array) {
            prev.push(value);
        } else {
            value = [prev, value];
            queries[key] = value;
        }
    } else {
        queries[key] = value;
    }
  }
  return queries;
}



/**
  * Does a request immediately using the current values.  If autorequest is true,
  * this method is called automatically when values change.
  */
function doRequest(ignore=null) {

    // We try to reuse the old datarequest object, unless
    // multirequest is true. If multirequest is true, we need
    // a separate datarequest obj for each request.
    if (this.multirequest || this.dataRequest == null || this.queuerequests) {
        this.dataRequest = new this.dataRequestClass(this);
    }

    var dreq = this.dataRequest

    dreq.src     = this.src;
    dreq.timeout = this.timeout;
    dreq.status  = LzDataRequest.READY;
    dreq.method = this.querytype;

    // If this.querystring is set, use it as the source of param
    // values. Note, this is independent of the query portion of the
    // this.src URL. 
    if (this.querystring) {
        dreq.queryparams = new LzParam(this);
        dreq.queryparams.addObject(LzParam.parseQueryString(this.querystring));
    } else {
        // otherwise, use the this.params value
        dreq.queryparams = this.params;
    }

    // Support for 'lzpostbody'
    var lzpostbody = null;
    if (dreq.queryparams) {
        lzpostbody = dreq.queryparams.getValue('lzpostbody');
    }
    if (lzpostbody != null) { 
        dreq.postbody = lzpostbody;
    }

    dreq.proxied            = this.isProxied();

    // TODO [hqm 2007-08] does this interact with 'multirequests' flag?
    dreq.queuerequests      = this.queuerequests;
    dreq.requestheaders     = this.headers;
    dreq.getresponseheaders = this.getresponseheaders;

    dreq.secureport = this.secureport;
    
    dreq.cacheable       =  this.cacheable;
    dreq.clientcacheable =  this.clientcacheable;
    dreq.trimwhitespace  =  this.trimwhitespace;
    dreq.nsprefix        =  this.nsprefix;

    // NB: You had better set the onstatus event handler *before* issuing request
    if (this.dsloadDel == null) {
        this.dsloadDel = new LzDelegate( this , "handleDataResponse" , dreq, "onstatus");
    } else {
        this.dsloadDel.register(dreq, "onstatus");
    }
    this.dataprovider.doRequest( dreq );

}

/**
  * @access private       
  * Called when  data request status changes.
  * If status is 'success', call setData
  */

function handleDataResponse (datareq) {
    if (this.dsloadDel != null) {
        this.dsloadDel.unregisterFrom(datareq.onstatus);
    }
    
    if (datareq.status == LzDataRequest.SUCCESS) {
        this.setData(datareq.xmldata, datareq.responseheaders);
    } else if (datareq.status == LzDataRequest.ERROR) {
        this.gotError(datareq.error);
    } else if (datareq.status == LzDataRequest.TIMEOUT) {
        this.gotTimeout();
    }

}

/**
  * Turns autorequest on or off, depending on the value passed in. 
  * If true, changes to dataset request parameters cause new datasets to be 
  * automatically requested.  If autorequest is false, doRequest() must be 
  * called manually after dataset request parameters are changed.
  * 
  * @access private
  * @param b: A boolean value - true to turn on autorequest, false to turn off
  */
function setAutorequest(b, val=null) {
    this.autorequest = b;
}

/**
  * Returns an error string if there was an error, or false if there was none.
  * @return String: An error string, or false if none.
  */
function getErrorString (){ 
    return this.errorstring;
}

/* Meta stuff */
/**
  * Retrieves the LzParam object which represents the headers sent with
  * the dataset's last request
  * @return LzParam: The headers from the dataset's last request
  */
function getRequestHeaderParams ( ){ 
    return this.headers;
}

/**
  * Clears any request header parameters
  * @access protected
  */
function clearRequestHeaderParams ( ){ 
    if (this.headers)
        this.headers.remove();
}

/**
  * Returns the value for the specified response header, or false if there 
  * was no header with that name.  If name is omitted, all response headers 
  * are returned as an object of name/value pairs.
  * 
  * @param String name: The name of the header to return
  * @return String/Array: The value for the named header. If multiple headers 
  * are found, returns a list of values.
  * @return String
  */
function getResponseHeader(name) {
    return this.dataRequest.responseheaders[ name ];
}

/**
  * Sets the query type of for the datasource to one of "POST" or "GET"
  * by calling the method of the same name on this dataset's datasource.
  * Note that this controls how the LPS server makes a request of the backend, as well 
  * as how the client communicates with the LPS
  * @param Sring reqtype: A string -- either "GET" or "POST".  GET is the
  * default.  When the type is "POST", the query parameters will be sent in the 
  * request body, encoded as application/x-www-form-urlencoded  If the type is "POST" and
  * there is a exactly one request parameter and it is named "lzpostbody", it will be used
  * as the raw request body (unencoded).  Use of "lzpostbody" with a request
  * that has more than one request parameter is undefined.
  */
function setQueryType( reqtype, value=null ) {
    this.querytype = ( reqtype.toUpperCase() );
}

/** Sets the raw content of a POST body.
 * This replaces the old "lzpostbody" convention for passing raw POST data.
 * @param String str: The string to use as the raw POST body content
 */
function  setPostBody (str) {
    this.postbody = str;
}

//-----------------------------------------------------------------------------
// Stops the load of the dataset's current request
//-----------------------------------------------------------------------------
function abort( ) {
    this.dataprovider.abortLoadForRequest( this.dataRequest );
}

/**
  * Returns all response headers as an object of name/value pairs, or false
  * if there were none.
  * 
  * @return Object A hash table object containing the response headers.
  */
function getAllResponseHeaders() {
    return this.responseheaders;
}

/**
  * Sets a header for the next request
  * @param String k: Key for the header
  * @param String val: Value for the header
  */
function setHeader ( k , val ){ 
    if ( !this.headers ) {
        this.headers = new LzParam( this );
    }

    this.headers.setValue( k , val );
}

/** @access private */
function setInitialData ( d, val = null ){
    if (d != null) {
        var e = LzDataNode.stringToLzData(d, this.trimwhitespace, this.nsprefix);
        if (e != null)
            this.setData(e.childNodes);
    }
}



/**
  * Get string representation
  * @access private
  * @return: String representation of this object
  */
override function toString () {
    return "LzDataset " + ":" + this.name;
}

} // End of LzDataset




/**
  * @shortdesc Allows http datasets to be pooled, or recycled when no longer in use
  * @access private
  */
class __LzHttpDatasetPoolClass {

var _uid = 0;

var _p = [];

/**
  * Gets a new dataset from the pool
  * @param dataDel: Delegate for the ondata event
  * @param errorDel: Delegate for the onerror event
  * @param timeoutDel: Delegate for the ontimeout event
  * @param acceptenc: Whether to accept encodings or not - defaults to true
  */
function get(dataDel,errorDel,timeoutDel,acceptenc) {
    var d;
    if (this._p.length > 0) {
        d = this._p[this._p.length - 1];
        this._p.length = this._p.length - 1;
        //Debug.write('reusing', d.name); 
    } else {
        d = new LzDataset(null, {name: 'LzHttpDatasetPool' + this._uid, type:'http', acceptencodings: acceptenc ? acceptenc : false});
        //Debug.write('creating', d.name); 
        this._uid++;
    }
    if (dataDel    != null) { dataDel.register(d, 'ondata'); }
    if (errorDel   != null) { errorDel.register(d, 'onerror'); }
    if (timeoutDel != null) { timeoutDel.register(d, 'ontimeout'); }
    return d;
}

/**
  * Recyles a dataset back into the pool for reuse
  * @param d: The dataset to be recycled
  */
function recycle(d) {
    //Debug.write('recycling', d); 
    d.setQueryParams(null);
    if (d['ondata'])    d.ondata.clearDelegates();
    if (d['ontimeout']) d.ontimeout.clearDelegates();
    if (d['onerror'])   d.onerror.clearDelegates();
    this._p[this._p.length] = d;
}

} // End of __LzHttpDataSetPoolClass

/** The single instance of this class
  * @access private
  */
var LzHttpDatasetPool = new __LzHttpDatasetPoolClass;

ConstructorMap[LzDataset.tagname] = LzDataset;
