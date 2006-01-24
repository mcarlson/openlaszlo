/******************************************************************************
 * LzLoadQueue.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzLoadQueue
// The load queue controls the queuing of data, media, and persistent 
// connection requests at runtime.
//=============================================================================
LzLoadQueue = new Object;

LzLoadQueue.maxOpen = 2;

if ($debug) {
//---
// Set to true to monitor loadQueue state changes when debugging
// @keywords private
//---
LzLoadQueue.__LZmonitorState = false;
}
//---
//@keywords private
//---
LzLoadQueue.openConx = 0;
if ($debug) {
    //---
    // Debug setup
    // @keywords private
    //---
    LzLoadQueue.__LZinit = function () {
        if (LzLoadQueue.__LZmonitorState) {
            Debug.monitor(LzLoadQueue, 'openConx');
        }
    }
        LzLoadQueue.__LZinit();
}

//---
//@keywords private
//---
LzLoadQueue.listofqs = [];
//---
//@keywords private
//---
LzLoadQueue.loading = [];
//---
//@keywords private
//---
LzLoadQueue.queueSorters = [];
//---
//@keywords private
//---
LzLoadQueue.timeoutDel = new _root.LzDelegate( LzLoadQueue , "checkTimeout" );
//---
//@keywords private
//---
LzLoadQueue.nextcheck = Infinity;

//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.enqueueRequest = function( loadmc ){
    //@field Number maxOpen: The maximum number of open connections the client
    //can maintain. By default, this value is set to 2, since all compatible
    //browsers support at least two connections. Although this value may be set
    //through script, increasing the value may have undesirable results in
    //browsers that can only handle two open connections.
    if ( this.openConx < this.maxOpen ){
        //make request
        this.makeRequest( loadmc );
    } else {
        this.addToQueue( loadmc );
    }
}


//==============================================================================
// @keywords private
//
// This function is the callback ondata handler which gets attached to
// the XML object that is getting data loaded into it. It is
// responsible for parsing the raw string into the xmlobj XML object,
// and then converting that datastructure into an LzDataElement tree,
// via the xmltolzdata() method.
//
// N.B.: when this callback is invoked, 'this' is bound the the Flash
// XML object which is being used to handle the load request. It is *not* bound to 
// LzLoadQueue!
//==============================================================================
LzLoadQueue.serverlessOnDataHandler = function (src) {
    if (src == undefined) {
        _root.Debug.write("LzLoadQueue.serverlessOnDataHandler load failed from URL '",this.url, "', no data received.");
        _root.Debug.write("Failure to load data in serverless apps may be caused by Flash player security policies. Check your data server crossdomain.xml file");
        this.onload(false);
        this.dataset.onerror.sendEvent(this.dataset);
        // cancel the timeout handler
        LzLoadQueue.unloadRequest(this);
  } else {
      //_root.Debug.write("LzLoadQueue.serverlessOnDataHandler success", this, this.loader);
      // Create a queue containing one root node, myself, and convert it and all children to
      // LzDataNodes.

      // Stash the raw text on the xml object, in case someone wants it (XMLHTTPRequest, for example)
      this.loader.rawtext = src;
      this.parseXML(src);
      this.onload(true);
      // Copy the Flash XML tree into  tree of LFC LzData classes
      this.loader.queuedCopyFlashXML(this);
  }
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.checkTimeout = function( ){
    // A timed out load may cause new entries on loading, so it is
    // important to make a second pass to compute the next timeout
    var ct = getTimer();
    for ( var i = this.loading.length - 1; i >=0; i-- ){
        var lmc =  this.loading[ i ];

        if ( lmc.timeout == null ) continue;
        var tout = lmc.loadtime + lmc.timeout - ct;
        if ( tout <= 0 ) {
            //this timed out!
            lmc.timedout = true;
            lmc.loader.returnData( lmc );
        }
    }
    var nexttimeout = Infinity;
    for ( var i = this.loading.length - 1; i >=0; i-- ){
        var lmc =  this.loading[ i ];

        if ( lmc.timeout == null ) continue;
        var tout = lmc.loadtime + lmc.timeout - ct;
        if ( tout > 0 ) {
            if ( tout < nexttimeout ) {
                nexttimeout = tout;
            }
        }
    }

    if ( nexttimeout < Infinity ){
        this.nextcheck = nexttimeout + ct;
        _root.LzTimer.addTimer( this.timeoutDel , nexttimeout );
    } else {
        this.nextcheck = Infinity;
    }
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.loadFinished = function( loadmc ){
    this.openConx--;
    // Many subclasses of LzLoader seem to only call
    // LzLoadQueue.loadFinished, rather than LzLoader.returnData
    loadmc.loaded = true;
    loadmc.loading = false;
    for ( var i = 0; i < this.loading.length; i++){
        if ( this.loading[ i ] == loadmc ){
            this.loading.splice( i , 1 );
            break;
        }
    }

    while( this.openConx < this.maxOpen && this.hasMoreInQueue() ){
        this.makeRequest( this.getNextFromQueue() );
    }

    if ( ! this.loading.length)  {
        _root.LzTimer.removeTimer( this.timeoutDel );
        this.nextcheck = Infinity;
    }
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.unloadRequest = function( loadmc ){
    var isLoading = false;
    for ( var i = 0; i < this.loading.length; i++ ){
        if ( this.loading[ i ] == loadmc ) {
            isLoading = true;
            break;
        }
    }

    if ( isLoading ) this.loadFinished( loadmc );
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.addToQueue = function( loadmc ){
    var prior;
    for ( var i = this.queueSorters.length - 1; i>=0 ; i-- ){
        prior = this.queueSorters[i]( loadmc , prior );
    }

    if ( this.listofqs[ prior ] ) {
        this.listofqs[ prior ].push( loadmc );
    } else{
        this.listofqs[ prior ] = [ loadmc ];
    }
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.getNextFromQueue = function( ){
    for ( var i = 0; i < this.listofqs.length; i++ ){
        if ( this.listofqs[ i ].length ) {
            return this.listofqs[ i ].shift();
        }
    }
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.hasMoreInQueue= function( ){
    for ( var i = 0; i < this.listofqs.length; i++ ){
        if ( this.listofqs[ i ].length ) {
            return true;
        }
    }
    return false;
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.defaultPriorityAssignment = function( loadmc , prior ){
    if ( prior != null ) return prior;
    if ( loadmc.lzt == "eval" ) return 2;
    if ( loadmc.lzt == "data" ) return 4;
    if ( loadmc.lzt == "media" ) {
        return 6;
        //PC?
        //if ( loadmc.lzt == "media" ) return 6;
    } else {
        return 8;
    }
}

//==============================================================================
// to manipulate the priority of data requests
// @keywords private
//==============================================================================
LzLoadQueue.addPriorityFunction = function ( f ){
    this.queueSorters.push( f );
}

LzLoadQueue.addPriorityFunction( LzLoadQueue.defaultPriorityAssignment );


////////////////////////////////////////////////////////////////
//==============================================================================
// Makes a serverless or proxied request. If loadobj is a movieclip, it
// does a loadmovie to the appropriate proxied or direct URL.
//
// It loadobj is an XML object, a request is made and the returned
// string is passed to the Flash XML parser and placed into the XML
// object (transmogrified to a LzDataElement).
//
// @keywords private
//==============================================================================

LzLoadQueue.makeRequest = function( loadobj ){
    if ( !loadobj.valid ) return;

    loadobj.loading = true;
    loadobj.loadtime = getTimer();
    if (typeof(loadobj.lmcnum) != "number") {
        loadobj.lmcnum = 0;
    }

    // This method is only defined by LzMediaLoader. 
    loadobj.loader.startingLoad( loadobj );

    if ( loadobj.timeout != null &&
         ( this.nextcheck > loadobj.loadtime + loadobj.timeout ) ){
        if (this.nextcheck < Infinity) {
            _root.LzTimer.resetTimer( this.timeoutDel , loadobj.timeout );
        } else {
            _root.LzTimer.addTimer( this.timeoutDel , loadobj.timeout );
        }
        this.nextcheck = loadobj.loadtime + loadobj.timeout;
    }

    this.loading.push( loadobj );

    if (loadobj.isaudio == true) {
        //_root.Debug.write('LzLoadQueue makeRequest', loadobj)
        this.loadMovieProxiedOrDirect(loadobj);
    } else if (typeof(loadobj) == "movieclip") {
        this.loadMovieProxiedOrDirect(loadobj);
    } else {
        if (loadobj.proxied) {
            this.loadXMLProxied(loadobj);
        } else {
            this.loadXMLDirect(loadobj);
        }
    }
    //openConx: The number of currently open connections.
    this.openConx++;
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.loadMovieProxiedOrDirect = function (loadobj) {
    var reqstr;
    if ( !loadobj.proxied ) {
        reqstr = loadobj.reqobj.url;
    } else {

        delete loadobj.proxied;
        reqstr = _root.LzBrowser.getBaseURL( loadobj.secure,
                                                 loadobj.secureport ).toString();
        //fix up URL
        var url = loadobj.reqobj.url;
        if ( url != null) {
            // [2005 03 10] we don't try to munge URLs to HTTPS anymore,
            // the user specifies the URL protocol explicitly if they want https.
            loadobj.reqobj.url = _root.LzBrowser.toAbsoluteURL(url, false);
        }
        //set cache parameters
        if ( loadobj.reqobj.cache ){
            //if caching is on, client caching is on too unless you say
            //otherwise
            if ( loadobj.reqobj.ccache == null ) loadobj.reqobj.ccache = true;
        } else {
            //if caching is off or unmentioned, client caching is off unless 
            //you say otherwise
            loadobj.reqobj.cache = false;
            if ( loadobj.reqobj.ccache == null ) loadobj.reqobj.ccache = false;
        }

        var sep = "?";

        var dopost = (loadobj.reqobj.reqtype.toUpperCase() == 'POST');
        if (!dopost) {
            for ( var keys in loadobj.reqobj ){
                reqstr += sep + keys + "=" + escape( loadobj.reqobj[ keys ] );
                if ( sep == "?" ){
                    sep = "&";
                }
            }
        }

        // Defeat browser request cache
        if ( loadobj.reqobj.cache != true ) {
            var d = new Date();
            reqstr += sep + "__lzbc__=" + d.getTime();
        }

        if (dopost) {
            loadobj.reqobj.ccache = loadobj.reqobj.cache = false;
            loadobj.reqobj.fpv = _root.LzBrowser.getVersion();
        }
    }
    // [2005-08-19 ptw] the movie that will be loaded is attached to
    // the loadobj as both `lmc` and `lmc + loadobj.lmcnum++`.  What
    // is the purpose of this?  Since the `lmc + loadobj.lmcnum`s are
    // never cleaned up, this would seem to be a leak.  I don't see
    // how there could ever be more than one movie being loaded into a
    // loadobj.
    // [2005-08-22 adam] There is a bug in the flash player (at least
    // in older ones) where if you attach a movie that has the same
    // name as a movie that was previously attached (in the same
    // actionscript block) the attach doesn't work right and you end
    // up with the old movie.
    if (loadobj.isaudio == true) {
        loadobj.lmc = loadobj;
        //_root.Debug.write('LzLoadQueue new lmc for loadobj', loadobj, loadobj.lmc);
    } else {
    loadobj.lmcnum++;
    //loadobj.attachMovie( "empty" , "lmc" + loadobj.lmcnum , 9 );
    loadobj.createEmptyMovieClip( "lmc" + loadobj.lmcnum , 9 );
    loadobj.lmc = loadobj[ 'lmc' + loadobj.lmcnum ];
    }

    if ( dopost ){
        for ( var k in loadobj.reqobj ){
            loadobj.lmc[ k ] = loadobj.reqobj[ k ];
        }
        loadobj.lmc.loadMovie( reqstr , "POST" );
    } else {
        loadobj.lmc.loadMovie( reqstr );
    }
}




// client -> LPS proxy control args
LzLoadQueue.qargs = [ 'nsprefix',
                      'trimwhitespace',
                      'sendheaders',
                      'reqtype',
                      'timeout',
                      'fpv',
                      'ccache'];


//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.loadXMLProxied = function (loadobj) {
    var reqstr;
    // accumulate query args here from various sources (.url, .querystring, .qparams)
    var qvars = {};

    reqstr = _root.LzBrowser.getBaseURL( loadobj.secure,
                                         loadobj.secureport ).toString();

    // When using LoadVars and friends, the Flash implementation does
    // not do the right thing when you have both a query string in the
    // URL and you have properties on the LoadVars; For example if you
    // have a URL like "http://foo.com/bar.jsp?foo=10" and the
    // LoadVars has bar = 12 when you call sendAndLoad(), you will get
    // two '?' chars in the URL, like this "http://foo.com/bar.jsp?foo=10?bar=12"
    //
    // So we have to strip out the query args from the URL, add them to the
    // query params, and create a single set of properties. 

    // Look for optional CGI query args string
    var query = loadobj.querystring;
    // An instance of LzParam, or null.
    var qparams = loadobj.qparams;
    // We are going to send the data up using LoadVars.sendAndLoad().
    // We fill in this LoadVars object with any query args. 
    var lvar = new LoadVars();

    var url = loadobj.url;

    //Fix up URL:
    // [A] strip query args
    var marker = url.indexOf('?');
    var uquery = "";
    if (marker != -1) {
        uquery = url.substring(marker+1, url.length);
        url = url.substring(0,marker);

        var uitems = LzParam.prototype.parseQueryString(uquery);
        for ( var key in uitems) {
            qvars[key] = uitems[key];
        }
    }

    url = _root.LzBrowser.toAbsoluteURL( url, loadobj.secure );

    // Add in the parsed args from the query string
    if (query.length > 0) {
        var items = LzParam.prototype.parseQueryString(query);
        for ( var key in items) {
            qvars[key] = items[key];
        }
    }

    // Defeat browser request cache
    if ( loadobj.cache != true ) {
        var d = new Date();
        lvar["__lzbc__"] = d.getTime();
    }

    // Get params if any from LzParam
    var names = qparams.getNames();
    for ( var i in names ){
        var name = names[i];
        qvars[name] = qparams.getValue(name);
    }

    // append consolidated query args to url
    var allvars = "";
    var sep = "?";
    for (key in qvars) {
        url  += sep + key + "=" + escape( qvars[key] );
        if ( sep == "?" ){
            sep = "&";
        }
    }

    lvar['url'] = url;

    // TODO [hqm 2005-1-27] need to put in case to handle 'raw' post
    // case (query.lzpostbody != null).  That will probably be done by using
    // XML.sendAndLoad() instead of LoadVars.sendAndLoad();

    // Set the onData handler to intercept returning data
    loadobj.onData = LzLoadQueue.serverlessOnDataHandler;

    // Set the client->LPS proxy control args
    lvar.lzt = "xmldata"

    // Set the control args used for client-LPS proxy protocol
    var qargs = LzLoadQueue.qargs;
    for ( var keys in qargs ) {
        var key = qargs[keys];
        if (typeof (loadobj[key] != "undefined")) {
            lvar[key] = loadobj[key];
        }
    }

    var dopost = (loadobj.reqtype == 'POST');
    if (dopost) {
        //_root.Debug.write("POST", reqstr);
        lvar.sendAndLoad(reqstr , loadobj, "POST" );
    } else {
        //_root.Debug.write("GET", reqstr);
        lvar.sendAndLoad(reqstr , loadobj, "GET" );
    }
}


//==============================================================================
// @keywords private
//==============================================================================
LzLoadQueue.loadXMLDirect = function (loadobj) {
    var reqstr;
    // We're loading an XML data object.
    // Look for optional CGI query args string
    var querystring = loadobj.querystring;
    // An instance of LzParam, or null.
    var qparams = loadobj.qparams;
    // We are going to send the data up using LoadVars.sendAndLoad().
    // We fill in this LoadVars object with any query args. 
    var lvar = new LoadVars();
    var query = "";
    if (querystring != null) { query += querystring; }
    var url = loadobj.url;

    //Fix up URL:
    // [A] strip query args
    var marker = url.indexOf('?');
    var uquery = "";
    if (marker != -1) {
        uquery = url.substring(marker+1, url.length);
        url = url.substring(0,marker);

        var uitems = LzParam.prototype.parseQueryString(uquery);
        for ( var key in uitems) {
            lvar[key] = uitems[key];
        }
    }

    reqstr = _root.LzBrowser.toAbsoluteURL( url, loadobj.secure );
    // Add in the parsed args from the query string
    if (query.length > 0) {
        var items = LzParam.prototype.parseQueryString(query);
        for ( var key in items) {
            lvar[key] = items[key];
        }
    }

    // Defeat browser request cache
    if ( loadobj.cache != true ) {
        var d = new Date();
        lvar["__lzbc__"] = d.getTime();
    }
    // TODO [hqm 2005-1-27] need to put in case to handle 'raw' post
    // case (query.lzpostbody != null).  That will probably be done by using
    // XML.sendAndLoad() instead of LoadVars.sendAndLoad();

    // Set the onData handler to intercept returning data
    loadobj.onData = LzLoadQueue.serverlessOnDataHandler;
    // Get params if any from LzParam
    var names = qparams.getNames();
    for ( var i in names ){
        var name = names[i];
        lvar[name] = qparams.getValue(name);
    }

    var dopost = (loadobj.reqtype == 'POST');
    if (dopost) {
        //_root.Debug.write("POST", reqstr);
        lvar.sendAndLoad(reqstr , loadobj, "POST" );
    } else {
        //_root.Debug.write("GET", reqstr);
        lvar.sendAndLoad(reqstr , loadobj, "GET" );
    }
}
