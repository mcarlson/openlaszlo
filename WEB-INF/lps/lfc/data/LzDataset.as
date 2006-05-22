/******************************************************************************
 * LzDataset.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzDataset
//
//
// @field LzEvent onerror: Sent when an error occurs for this dataset
//
// @field LzEvent ondata: Sent when new data arrives for this dataset
//
// @field LzEvent ontimeout: Sent when a request times out
//
//
//
//==============================================================================

var LzDataset = Class( "LzDataset" , LzNode );

//this is horrible, but make dataset extend LzDataElement by copying the 
//prototypes of LzDataNode and LzDataElement and sticking them in dataset's 
//inheritance chain. Cheesy multiple inheritance, but what can you do?

function cheesyMultipleInheritance (op, supers) {
  for ( var i = 0; i < supers.length; i++ ){ 
    var si = supers[ i ];
    //dup object and add it to protochain
    var n = {};
    for ( var k in si ){
      n[ k ] = si[ k ];
    }
    n.__proto__ = op;
    n.classname = "$datasettransform" +i;
    op = n;
  }
  return op;
}
LzDataset.prototype.__proto__ = cheesyMultipleInheritance(
  LzDataset.prototype.__proto__, 
  [ LzDataNode.prototype, LzDataElement.prototype ]);

// @field Boolean acceptencodings: When true, the server will accept
// encoded responses for this request.  
// Encoded responses require more work for the LPS (encoding the 
// response) and client (decoding the response) in trade for lower 
// network bandwidth usage.
LzDataset.prototype.acceptencodings = false;

// @field Boolean nsprefix: When true, the server will preserve namespace prefixes
// on data node names and attribute names
LzDataset.prototype.nsprefix = true;

// @field Boolean getresponseheaders: When true, the server will encode and 
// send the HTTP response headers along with the data (defaults to false). 
// This does not work for SOLO applications; in SOLO applications the call returns empty. 
LzDataset.prototype.getresponseheaders = false;

// @field Boolean trimwhitespace: When true, the server will trim 
// whitespace in the XML data (defaults to false).  
LzDataset.prototype.trimwhitespace = false;

LzDataset.prototype.nodeType = LzDataNode.DOCUMENT_NODE;

// @field Boolean cacheable: When true, the server will attempt to cache 
// response (defaults to false).  There are security concerns 
// when this field is true.  When this field is true, you will usually
// want the getresponseheaders field to be false.
LzDataset.prototype.cacheable = false;

//---
//@keywords private
//---
LzDataset.prototype.setters.data = "setData";

//@field String src: The source for requests made by this dataset.
LzDataset.prototype.setters.src = "setSrc";
//LzDataset.prototype.defaultattrs.data = null;

//---
//@keywords private
//---
LzDataset.prototype.setters.autorequest = "setAutorequest";

//@field Boolean request: If true, the datset will make a request when it
//inits. The default for this is false.
LzDataset.prototype.setters.request = "setRequest";

LzDataset.anonDatasourceNum = 0;


LzDataset.prototype.proxied = null;

//---
//@keywords private
//---
LzDataset.prototype.setters.initialdata = "setInitialData";

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDataset.prototype.construct = function ( parent , args ){
    this.queuerequests = false; // default to false, to emulate browser default
    this._createdParent = null;

    if (! (parent instanceof _root.LzDatasource)) {
        this.oncanvas = parent == _root.canvas || parent == null;

        // Default datasource type is http
        this._dsrc = new _root.LzHTTPDatasource( _root.canvas, 
            { name: "anonHTTPDS" +
              _root.LzDataset.anonDatasourceNum++});
        this._dsrc.repset = true;
        this._createdParent = this._dsrc;
        if (this._instanceAttrs['name'] == null) {
            this._instanceAttrs['name'] = 'localdata';
        }
    } else {
        // assume datasource is parent;
        this._dsrc = parent;
        this.oncanvas = true;
    }

    // bwcompat 1.0 support for port
    if (args.port && !args.secureport) {
        args.secureport = args.port;
    }

    if (args.querytype) {
        this.setQueryType(args.querytype);
    }

    if (args.src) {
        this.src = args.src;
    } else {
        this.src = this._dsrc.src;
    }

    this.ownerDocument = this;

    
    if (args.timeout) {
        this.timeout = args.timeout;
    } else {
        this.timeout = canvas.dataloadtimeout;
    }


    super.construct( parent , args );
}

//-----------------------------------------------------------------------------
// Sets the name of this datasource - used only by initializer
// @keywords private
//-----------------------------------------------------------------------------
LzDataset.prototype.setName = function(name) {
    super.setName( name );

    //for compatibility with dataNode API
    this.nodeName = name;

    if (null == _root.canvas.datasets ) {
        _root.canvas.datasets = {};
    }

    //support name is global identifier on canvas behavior, even though
    //datasets create a datasource for themselves if none is given
    if ( this.oncanvas ){
        _root[ name ] = this;
        _root.canvas[ name ] = this;
    } else {
        // it's local - add the parent's UID
        name = this.parent.getUID() + '.' + name;
    }

    if (null != _root.canvas.datasets[name]) {
        _root.Debug.warn("A dataset already exists with the name '%s': %w" +
                         " - use explicit datasources in your datapaths.", 
                         name, _root.canvas.datasets[name]);
    }

    _root.canvas.datasets[name] = this;

}

//---
// Extend LzNode.destroy: remove yourself from the 97 places you
// installed yourself (do we really need all these aliases?) and
// destroy your datasource node if you made one for yourself.
// @keywords private
//---
LzDataset.prototype.destroy = function ( recursiveCall ) {
    var name = this.name;
    if (this.oncanvas) {
        if (_root.canvas[ name ] === this) {
            delete _root.canvas [ name ];
        }
        if (_root[ name ] === this) {
            delete _root [ name ];
        }
    }    else {
        name = this.parent.getUID() + '.' + name;
    }
    if (_root.canvas.datasets[ name ] === this) {
        delete _root.canvas.datasets[ name ];
    }
    // [2005-08-25 ptw] I believe the various delegates will get
    // cleaned up automagically.
    var loader = this.getOption('dsloader');
    loader.destroy();

   super.destroy( recursiveCall );
    // Destroy created datasource after you (to avoid unnecessary recursion)
    if (this._createdParent) {
        this._createdParent.destroy(recursiveCall);
    }
}

//-----------------------------------------------------------------------------
// Return the src attribute of the dataset, if one was given.
// @return String: The src of attribute of the dataset
//-----------------------------------------------------------------------------
LzDataset.prototype.getSrc = function ( ){
    return this.src;
}

//-----------------------------------------------------------------------------
// Returns the querystring attribute of the dataset, if there is one
// @return String: The querystring attribute of the dataset
//-----------------------------------------------------------------------------
LzDataset.prototype.getQueryString = function (){
    if (typeof(this.querystring) == 'undefined') {
        return "";
    } else {
        return this.querystring;
    }
}

//-----------------------------------------------------------------------------
// Returns an LzParams object holding any set request parameters for the 
// dataset.
// @return LzParam: The request parameters for the dataset.
//-----------------------------------------------------------------------------
LzDataset.prototype.getParams = function (){
    if (typeof(this.params) == "undefined") {
        new _root.LzParam ( this , { name : "params" } );
    }

    return this.params;
}

//-----------------------------------------------------------------------------
// Returns the status of the dataset's request. Always returns 200 since the 
// server will respond with an error if the request fails.
// @deprecated Use <code>onerror</code> or <code>ontimeout</code>
// events instead
//-----------------------------------------------------------------------------
LzDataset.prototype.getStatusCode = function (){
    if ( $debug ){
        _root.Debug.write( 'LzDataset.getStatusCode is deprecated.' +
                           ' Use onerror/ontimeout events instead.' );
    }
    return 200;
}

//-----------------------------------------------------------------------------
// Allows the datasource to determine how the raw data should be interpreted
// @keywords private
//-----------------------------------------------------------------------------
LzDataset.prototype.gotRawData = function( data ) {
    this._dsrc.processRawData( this , data );
}

//-----------------------------------------------------------------------------
// Sets the data for the dataset
// @keywords private
//-----------------------------------------------------------------------------
LzDataset.prototype.setData = function( data , headers ) {
    if ( data == null ) return;

    this.responseheaders.destroy();
    this.responseheaders = headers;

    this.setChildNodes( data.childNodes );

    //undefined behavior for multiple root level nodes
    this.data = this.childNodes[ 0 ];

    this.ondata.sendEvent( this );
}

//==============================================================================
// Called when an error is received from the datasource.  
//
// @keywords private 
// @param e: the dataset whose request resulted in error
//==============================================================================
LzDataset.prototype.gotError = function ( e ){
    //@event onerror: Sent when the dataset's request results in an error.
    this.errorstring = e;
    this.onerror.sendEvent( this );
}

//==============================================================================
// Called when a timeout is recieved from the datasource.  
//
// @keywords private
//==============================================================================
LzDataset.prototype.gotTimeout = function (){
    //@event ontimeout: Sent when the request made by the dataset times out.
    this.ontimeout.sendEvent( this );
}

//-----------------------------------------------------------------------------
// This is the shared interface with datapointer
// @keywords private
//-----------------------------------------------------------------------------
LzDataset.prototype.getContext = function (){
    return this;
}

//-----------------------------------------------------------------------------
// This is the shared interface with datapointer
// @keywords private
//-----------------------------------------------------------------------------
LzDataset.prototype.getDataset = function (){
    return this;
}

//-----------------------------------------------------------------------------
// Returns a datapointer pointing to the root of the dataset.
// @return LzDatapointer: A datapointer that points to the root of the dataset.
//-----------------------------------------------------------------------------
LzDataset.prototype.getPointer = function (){
    var dp = new _root.LzDatapointer( null );
    dp.p = this.getContext();
    return dp;
}



if ( $debug ){
//==============================================================================
// @keywords private
//==============================================================================
    LzDataset.prototype.lockFromUpdate = function ( who ){
        _root.Debug.write( 'LzDataset.lockFromUpdate is deprecated.' +
                           'Its use is unnecessary.');
    }
}

if ( $debug ){
//==============================================================================
// @keywords private
//==============================================================================
    LzDataset.prototype.unlockFromUpdate = function ( who ){
        _root.Debug.write( 'LzDataset.unlockFromUpdate is deprecated.' +
                           'Its use is unnecessary.');
    }
}

//-----------------------------------------------------------------------------
// Sets the querystring parameter of the dataset of the dataset to the given
// string. The dataset's querystring will be pre-pended to any request made
// for the dataset.
// @param String s: A string to be appended to any query made on behalf of
// this datset 
//-----------------------------------------------------------------------------
LzDataset.prototype.setQueryString = function( s ) {
    //@field String querystring: A string to be appended to the request that
    //the dataset makes. 
    if ( typeof( s ) == "object" ){
        if (s instanceof  _root.LzParam){
            this.querystring = s.toString();
        } else {
            var p = new _root.LzParam ( this );
            p.addObject( s );
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

//-----------------------------------------------------------------------------
// Sets the src attribute of the dataset's datasource. 
// @param String src: A new src for the dataset's datasource.
//-----------------------------------------------------------------------------
LzDataset.prototype.setSrc = function( src ) {
    this.src = src;
    this._dsrc.setAttribute( 'src' , src );
    if ( this.autorequest ){
        this.doRequest() ;
    }
}

//-----------------------------------------------------------------------------
// @deprecated To change the target of a request of at runtime
// explicitly specify the dataset's <code>&lt;datasource&gt;</code>
//-----------------------------------------------------------------------------
LzDataset.prototype.setURL = function( src ) {
    if ($debug){
        _root.Debug.write( "LzDataset.setURL is deprecated. " +
                           "Use LzDataset.setSrc instead." );
    }
    this.setSrc( src );
}


//-----------------------------------------------------------------------------
// Sets whether or not the dataset makes its request directly to the target server
// or via the LPS server proxy.
// @param String val: If 'true', the dataset will make its request when it is 
// initialized, if 'false', request will be direct, if 'inherit', it will inherit
// from its datasource.
//-----------------------------------------------------------------------------

LzDataset.prototype.setProxyRequests = function( val ) {
    if (typeof(val) != 'string') {
        _root.Debug.write("WARNING: arg ",typeof(val), val,this, " to setProxyRequests must be a string with value 'inherit', 'true', or 'false'.");
    } else {
        this.proxied = val;
    }
}


//-----------------------------------------------------------------------------
// Sets whether or not the dataset makes its request upon initialization
// @param Boolean b: If true, the dataset will make its request when it is 
// initialized
//-----------------------------------------------------------------------------
LzDataset.prototype.setRequest = function( b ) {
    if ( ! b ) return;
    if ( !this.isinited ){
        this.reqOnInitDel = new _root.LzDelegate( this , "doRequest" , 
                                                  this, "oninit" );
    }
}

//-----------------------------------------------------------------------------
// Returns the number of miliseconds it took to load the dataset's request
// @return Int: Number of miliseconds it took to load the last request.
//-----------------------------------------------------------------------------
LzDataset.prototype.getLoadTime = function( ) {
    return this._dsrc.getLoadTimeForDataset( this );
}

//-----------------------------------------------------------------------------
// Sets a named query parameter to the given value. The query parameters are 
// sent with every request.  The key 'lzpostbody' has a specific interpretation,
// see setQueryType() for details.
// @param String key: The name of the parameter
// @param String val: The value for the parameter
//-----------------------------------------------------------------------------
LzDataset.prototype.setQueryParam = function( key , val ) {
    if ( ! this.params ){
        new _root.LzParam ( this , { name : "params" } );
    }
    this.params.setValue( key, val );

    if ( this.autorequest ) {
        this.doRequest();
    }
}

//-----------------------------------------------------------------------------
// Sets multiple query parameters from using the keys in the argument as keys
// and the values of those keys as values. This method can also be used to
// clear the query params, by passing null to it.
// @param Object o: An object whose keys are keys of parameters and whose 
// values are those parameters' values. Passing a value of null to this 
// method clears the query parameters.
// The key 'lzpostbody' has a specific interpretation, see setQueryType() for details.
//-----------------------------------------------------------------------------
LzDataset.prototype.setQueryParams = function( o ) {
    if ( o && ! this.params ){
        new _root.LzParam ( this , { name : "params" } );
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

//==============================================================================
// Does a request immediately using the current values.  If autorequest is true,
// this method is called automatically when values change.
//==============================================================================
LzDataset.prototype.doRequest = function() {
    this._dsrc.doRequest( this );
}

LzDataset.prototype.request = LzDataset.prototype.doRequest;

//==============================================================================
// Turns autorequest on or off, depending on the value passed in. 
// If true, changes to dataset request parameters cause new datasets to be 
// automatically requested.  If autorequest is false, doRequest() must be 
// called manually after dataset request parameters are changed.
//
// @keywords private
// @param b: A boolean value - true to turn on autorequest, false to turn off
//==============================================================================
LzDataset.prototype.setAutorequest = function(b) {
    this.autorequest = b;
    this.setRequest( b );
}

//-----------------------------------------------------------------------------
// Returns an error string if there was an error, or false if there was none.
// 
// @return String: An error string, or false if none.
//-----------------------------------------------------------------------------
LzDataset.prototype.getErrorString = function (){ 
    return this.errorstring;
}

/* Meta stuff */
//-----------------------------------------------------------------------------
// Retrieves the LzParam object which represents the headers returned by
// the dataset's last request
// @return LzParam: The headers from the dataset's last request
//-----------------------------------------------------------------------------
LzDataset.prototype.getRequestHeaderParams = function ( ){ 
    return this.headers;
}

//-----------------------------------------------------------------------------
// Clears any request header parameters
// @keywords protected
//-----------------------------------------------------------------------------
LzDataset.prototype.clearRequestHeaderParams = function ( ){ 
    this.headers.remove();
}

//-----------------------------------------------------------------------------
// Returns the value for the specified response header, or false if there 
// was no header with that name.  If name is omitted, all response headers 
// are returned as an object of name/value pairs.
//
// @param String name: The name of the header to return
// @return String/Array: The value for the named header. If multiple headers 
// are found, returns a list of values.
// @return String
//-----------------------------------------------------------------------------
LzDataset.prototype.getResponseHeader = function(name) {
    return this.responseheaders.getValueNoCase( name );
}

//-----------------------------------------------------------------------------
// Sets the query type of for the datasource to one of "POST" or "GET"
// by calling the method of the same name on this dataset's datasource.
// Note that this controls how the LPS server makes a request of the backend, as well 
// as how the client communicates with the LPS
// @param Sring reqtype: A string -- either "GET" or "POST".  GET is the
// default.  When the type is "POST", the query parameters will be sent in the 
// request body, encoded as application/x-www-form-urlencoded  If the type is "POST" and
// there is a exactly one request parameter and it is named "lzpostbody", it will be used
// as the raw request body (unencoded).  Use of "lzpostbody" with a request
// that has more than one request parameter is undefined.
//-----------------------------------------------------------------------------
LzDataset.prototype.setQueryType = function( reqtype ) {
    this._dsrc.setQueryType( reqtype.toUpperCase() );
}

//-----------------------------------------------------------------------------
// Stops the load of the dataset's current request
//-----------------------------------------------------------------------------
LzDataset.prototype.abort = function( ) {
    this._dsrc.abortLoadForDataset( this );
}

//-----------------------------------------------------------------------------
// Returns all response headers as an object of name/value pairs, or false
// if there were none.
// 
// @return LzParam: An LzParam object containing the response headers.
// This does not work for SOLO applications; in SOLO applications it returns empty.
//-----------------------------------------------------------------------------
LzDataset.prototype.getAllResponseHeaders = function() {
    return this.responseheaders;
}

//-----------------------------------------------------------------------------
// Sets a header for the next request
// @param String k: Key for the header
// @param String val: Value for the header
//-----------------------------------------------------------------------------
LzDataset.prototype.setHeader = function ( k , val ){ 
    if ( !this.headers ) {
        this.headers = new _root.LzParam( this );
    }

    this.headers.setValue( k , val );
}

//==============================================================================
// @keywords private
//==============================================================================
LzDataset.prototype.setInitialData = function ( d ){
    this.initialdata = d;
    if (d != null) {
        var e = LzDataNode.stringToLzData(d);
        this.setData(e);
    }
}


//==============================================================================
// Get string representation
// @keywords private
// @return: String representation of this object
//==============================================================================
LzDataset.prototype.toString = function () {
    return "LzDataset " + ":" + this.name;
}

//==============================================================================
// DEFINE OBJECT: LzHttpDatasetPool
//
// Allows http datasets to be pooled, or recycled when no longer in use
//==============================================================================
LzHttpDatasetPool = new Object();

LzHttpDatasetPool._uid = 0;

LzHttpDatasetPool._p = [];

//-----------------------------------------------------------------------------
// Gets a new dataset from the pool
// @param dataDel: Delegate for the ondata event
// @param errorDel: Delegate for the onerror event
// @param timeoutDel: Delegate for the ontimeout event
// @param acceptenc: Whether to accept encodings or not - defaults to true
//-----------------------------------------------------------------------------
LzHttpDatasetPool.get = function(dataDel,errorDel,timeoutDel,acceptenc) {
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

//-----------------------------------------------------------------------------
// Recyles a dataset back into the pool for reuse
// @param d: The dataset to be recycled
//-----------------------------------------------------------------------------
LzHttpDatasetPool.recycle = function(d) {
    //Debug.write('recycling', d); 
    d.setQueryParams(null);
    if (d['ondata'])    d.ondata.clearDelegates();
    if (d['ontimeout']) d.ontimeout.clearDelegates();
    if (d['onerror'])   d.onerror.clearDelegates();
    this._p[this._p.length] = d;
}
