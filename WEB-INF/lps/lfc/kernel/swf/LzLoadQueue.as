/**
  * LzLoadQueue.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * The load queue controls the queuing of data and media requests at runtime.
  */
var LzLoadQueue = new Object;

LzLoadQueue.maxOpen = 8;


if ($debug) {
/**
  * Set to true to monitor loadQueue state changes when debugging
  * @access private
  */
LzLoadQueue.__LZmonitorState = false;
}
/**
  * @access private
  */
LzLoadQueue.openConx = 0;
if ($debug) {
    /**
      * Debug setup
      * @access private
      */
    LzLoadQueue.__LZinit = function () {
        if (LzLoadQueue.__LZmonitorState) {
            Debug.monitor(LzLoadQueue, 'openConx');
        }
    }
    LzLoadQueue.__LZinit();
}

/**
  * @access private
  */
LzLoadQueue.listofqs = [];
/**
  * @access private
  */
LzLoadQueue.loading = [];
/**
  * @access private
  */
LzLoadQueue.queueSorters = [];
/**
  * @access private
  */
LzLoadQueue.nextcheck = Infinity;

/**
  * @access private
  */
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

/**
  * @access private
  */
LzLoadQueue.checkTimeout = function(ignore){
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
        lz.Timer.addTimer( this.timeoutDel , nexttimeout );
    } else {
        this.nextcheck = Infinity;
    }
}

/**
  * @access private
  */
LzLoadQueue.timeoutDel = new LzDelegate( LzLoadQueue , "checkTimeout" );

/**
  * @access private
  */
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

    for (var next; this.openConx < this.maxOpen && (next = this.getNextFromQueue()); ) {
        this.makeRequest( next );
    }

    if ( ! this.loading.length)  {
        lz.Timer.removeTimer( this.timeoutDel );
        this.nextcheck = Infinity;
    }
}

/**
  * @access private
  */
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

/**
  * @access private
  */
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

/**
  * @access private
  */
LzLoadQueue.getNextFromQueue = function( ){
    var loq = this.listofqs;
    for ( var i = 0; i < loq.length; i++ ){
        if ( loq[ i ].length ) {
            return loq[ i ].shift();
        }
    }
}

/**
  * @access private
  */
LzLoadQueue.hasMoreInQueue= function( ){
    var loq = this.listofqs;
    for ( var i = 0; i < loq.length; i++ ){
        if ( loq[ i ].length ) {
            return true;
        }
    }
    return false;
}

/**
  * @access private
  */
LzLoadQueue.defaultPriorityAssignment = function( loadmc , prior ){
    if ( prior != null ) return prior;
    else if ( loadmc.lzt == "eval" ) return 2;
    else if ( loadmc.lzt == "data" ) return 4;
    else if ( loadmc.lzt == "media" ) return 6;
    else return 8;
}

/**
  * to manipulate the priority of data requests
  * @access private
  */
LzLoadQueue.addPriorityFunction = function ( f ){
    this.queueSorters.push( f );
}

LzLoadQueue.addPriorityFunction( LzLoadQueue.defaultPriorityAssignment );


////////////////////////////////////////////////////////////////
/**
  * Makes a serverless or proxied request. If loadobj is a movieclip, it
  * does a loadmovie to the appropriate proxied or direct URL.
  * 
  * It loadobj is an XML object, a request is made and the returned
  * string is passed to the Flash XML parser and placed into the XML
  * object (transmogrified to a LzDataElement).
  * 
  * @access private
  */

LzLoadQueue.makeRequest = function( loadobj ){
    if ( !loadobj.valid ) return;

    if (loadobj.loading || loadobj.loaded) {
        if ($debug) {
            Debug.error('duplicate request', loadobj);
        }
        return;
    }
    if (loadobj.lzt == 'xmldata' && ! loadobj.url && ! loadobj.reqobj.url) {
        if ($debug) {
            Debug.error('no url to load', loadobj);
        }
        return;
    }

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
            lz.Timer.resetTimer( this.timeoutDel , loadobj.timeout );
        } else {
            lz.Timer.addTimer( this.timeoutDel , loadobj.timeout );
        }
        this.nextcheck = loadobj.loadtime + loadobj.timeout;
    }

    this.loading.push( loadobj );

    if (loadobj.isaudio == true || typeof(loadobj) == "movieclip") {
        this.loadMovie(loadobj);
    } else {
        this.loadXML(loadobj);
    }
    //openConx: The number of currently open connections.
    this.openConx++;
}

/**
  * @access private
  */
LzLoadQueue.loadMovie = function (loadobj) {
    var reqstr;
    // TODO [2008-06 hqm] We will eventually deprecate the "proxied" flag, and just use
    // proxyurl != null to indicate that we are proxied via the PROXYURL.
    var proxied = (loadobj.proxied || loadobj.reqobj.proxyurl);
    if ( !proxied ) {
        reqstr = lz.Browser.toAbsoluteURL(loadobj.reqobj.url, false);
    } else {
        delete loadobj.proxied;
        reqstr = loadobj.reqobj.proxyurl;
        delete loadobj.reqobj.proxyurl;
        //fix up URL
        var url = loadobj.reqobj.url;
        if ( url != null) {
            // [2005 03 10] we don't try to munge URLs to HTTPS anymore,
            // the user specifies the URL protocol explicitly if they want https.
            loadobj.reqobj.url = lz.Browser.toAbsoluteURL(url, false);
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
                reqstr += sep + keys + "=" + encodeURIComponent( loadobj.reqobj[ keys ] );
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
            loadobj.reqobj.fpv = lz.Browser.getVersion();
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
        //Debug.write('LzLoadQueue new lmc for loadobj', loadobj, loadobj.lmc);
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

/**
  * @access private
  */
LzLoadQueue.loadXML = function (loadobj) {
    /*
      [1] If request is PROXIED, send the URL as given, with query string stripped off,
      parsed, and each arg is set as a property on the LoadVar object.

      [2] If request is SOLO:

          [3] If it is a GET request, send URL as given with query string stripped off,
          parsed, and each arg is set as a property on the LoadVar object.

          [4] If it is a POST request, send to URL as given including query string.
            take the rawpostbody property from loadobj, parse it, and set as properties
            on the LoadVars object. 

            We can't really post an arbitrary raw data string. The best we can do is 
            to use XML sendAndLoad with a single XML child text node, but that still
            XML-escapes the text.

    */
    
    // Set the onData handler to intercept returning data
    loadobj.onData = LzXMLLoader.XMLOnDataHandler;

    var dopost = (loadobj.reqtype.toUpperCase() == 'POST');
    var lvar = new LoadVars();
    var url = loadobj.url;
    var solo = !loadobj.proxied;

    // convert base url to absolute path, otherwise Flash is not happy
    var reqstr;
    if (solo && dopost) {
        // For a SOLO POST, request the complete URL including query args
        reqstr = lz.Browser.toAbsoluteURL( url, loadobj.secure );
    } else {
        // If it's proxied, or a SOLO GET, strip the query args from URL and set them as
        // properties on LoadVars obj
        var marker = url.indexOf('?');
        if (marker != -1) {
            var uquery = url.substring(marker + 1, url.length);
            url = url.substring(0, marker);

            var uitems = lz.Param.parseQueryString(uquery);
            for (var key in uitems) {
                lvar[key] = uitems[key];
            }
        }
        
        // get the url with the query string trimmed off
        reqstr = lz.Browser.toAbsoluteURL( url, loadobj.secure );
    }

    var method = loadobj.proxied || dopost ? "POST" : "GET";
    if (method == "POST") {
        var lzpostbody = loadobj.rawpostbody;
        if (lzpostbody != null) {
            if (solo && !loadobj.hasquerydata) {
                // This is supposed to be a "raw" data post. The best
                // we can do is to use XML.sendAndLoad, with a Flash
                // XML Text node as the data. This will still
                // XML-escape it, but it's as close as we can get to POSTing
                // raw data.
                var xmlraw = new XML();
                xmlraw.parseXML(lzpostbody);
                // replace LoadVars with XML
                lvar = xmlraw;
            } else {
                // if PROXY request: proxy parameters have been stored on
                // rawpostbody, get them out and append them to the LoadVars
                // obj, to POST to LPS proxy server.
                
                // Copy the postbody data onto the LoadVars, it will be POST'ed
                var pdata = lz.Param.parseQueryString(lzpostbody);
                for (var key in pdata) {
                    lvar[key] = pdata[key];
                }
            }
        }
    } else {
        // For a SOLO GET request, all query args have been placed on
        // the lvar object already.
    }
    
    if (solo) {
        // SOLO: Set any specified request headers
        var headers = loadobj.loader.requestheaders;
        for (var header in headers) {
            lvar.addRequestHeader(header, headers[header]);
        }
    }
    
    lvar.sendAndLoad(reqstr, loadobj, method );
}
