/******************************************************************************
 * LzHTTPDatasource.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzHTTPDatasource
// 
// Datasources represent queryable server-side Datasources, capable of creating 
// or changing Datasets.  Datasources are type-specific, i.e. http, jdbc or 
// soap.
// Datasources manage connections to the server,  handle timeouts and send 
// ondata and onerror events.  They have no public methods.
//==============================================================================

var LzHTTPDatasource = Class( "LzHTTPDatasource" , LzDatasource );

LzHTTPDatasource.prototype.reqtype = "GET";


//==============================================================================
// @keywords private
//==============================================================================
LzHTTPDatasource.prototype.getNewLoader = function (proxied) {
    return super.getNewLoader(proxied);
}

//==============================================================================
// Compute the boolean value for 'proxied', using inheritance if needed
// @keywords private
// @return boolean
//==============================================================================
LzHTTPDatasource.prototype.isProxied = function ( forset ) {
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

//==============================================================================
// @keywords private
//==============================================================================
LzHTTPDatasource.prototype.doRequest = function ( forset ) {
    //build request
    var tloader = this.getLoaderForDataset( forset, false );
    var req = this.src;

    // A relative URL that looks like "http:foo.xml" won't work with Flash's native XML Object.
    // We need to strip "http:" from those URLs, to leave just the pathname.
    if (req.indexOf("http:") == 0 && req.charAt(5) != "/") {
        req = req.substring(5);
    } else if (req.indexOf("https:") == 0 && req.charAt(6) != "/") {
        req = req.substring(6);
    }

    var querystring = forset.getQueryString();
    var qparams = forset.getParams( );

    forset.errorstring = null;

    // Create a Flash XML object, and stuff it in the LzXMLLoader.
    var myxml = new XML();

    myxml.cache = forset.cacheable;

    if (typeof(forset.timeout) != 'undefined') {
        myxml.timeout = forset.timeout;
    }

    // trim whitespace from start and end of text node content
    myxml.trimwhitespace = (forset.trimwhitespace == true);

    // This is a Flash XML Parser flag - says to completely ignore
    // text nodes which are all whitespace. If you set this to false,
    // you will have a lot of spurious nodes in your XML.
    myxml.ignoreWhite = true;

    myxml.url = req;
    myxml.querystring = querystring;
    myxml.qparams = qparams;
    // create a pointer back to the dataset, so we can update it when data arrives
    myxml.dataset = forset;
    myxml.reqtype = this.reqtype;
    myxml.proxied = this.isProxied(forset);

    var headers = "";
    //build headers
    if (typeof(this.headers) != "undefined") {
        headers = "" + this.headers.serialize( ": " , "\n" );
    }
    if ( headers.length ) {
        headers += "\n";
    }
    var dsetheaders = forset.getRequestHeaderParams().serialize(": " , "\n" );
    forset.clearRequestHeaderParams();
    if ( dsetheaders.length ){
        headers += dsetheaders +"\n";
    }
    if ( headers.length ){
        myxml.headers = headers;
    }

    myxml.sendheaders = forset.getresponseheaders ==true;
    myxml.nsprefix = forset.nsprefix == true;

    tloader.requestDirectXML( myxml );
}

//==============================================================================
// Sets the query type of the datasource to "GET" or "POST".  Note that this 
// controls how the LPS server makes a request of the backend, as well as how the
// client communicates with the LPS
// @param String d: A string -- either "GET" or "POST".  GET is the default.
// When the type is "POST", the query parameters will be sent in the 
// request body, encoded as application/x-www-form-urlencoded  If the type is "POST" and
// there is a exactly one request parameter and it is named "lzpostbody", it will be used
// as the raw request body (unencoded).  Use of "lzpostbody" with a request
// that has more than one request parameter is undefined.
//==============================================================================
LzHTTPDatasource.prototype.setQueryType = function ( d ) {
    this.reqtype = d;
}


//==============================================================================
// @keywords private
//==============================================================================
LzHTTPDatasource.prototype.processRawData = function ( forset , d ) {
    var o = new _root.LzParam( forset );
    // build a hashtable of header values. 
    // If the header is repeated, construct a list to hold
    // all its values.
    var hos = d.childNodes[1].childNodes;
    if (hos != null) {
        for ( var i = 0; i < hos.length; i++ ){
            o.addValue( hos[ i ].attributes.name , hos[ i ].attributes.value );
        }
    }

    forset.rawtext = d.rawtext;
    forset.setData( d.childNodes[ 0 ] , o );


}
