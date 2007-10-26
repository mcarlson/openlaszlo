/**
  * LzLoadQueue.as
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * The load queue controls the queuing of data, media, and persistent 
  * connection requests at runtime.
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
LzLoadQueue.timeoutDel = new LzDelegate( LzLoadQueue , "checkTimeout" );
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
  * This function is the callback ondata handler which gets attached to
  * the XML object that is getting data loaded into it. It is
  * responsible for parsing the raw string into the xmlobj XML object,
  * and then converting that datastructure into an LzDataElement tree,
  * via the xmltolzdata() method.
  * 
  * N.B.: when this callback is invoked, 'this' is bound the the Flash
  * XML object which is being used to handle the load request. It is *not* bound to 
  * LzLoadQueue!
  */
LzLoadQueue.XMLOnDataHandler = function (src) {
    if (src == undefined) {
        Debug.warn("LzLoadQueue.XMLOnDataHandler load failed from URL %w, no data received.", this.url);
        Debug.warn("Failure to load data in serverless apps may be caused by Flash player security policies. Check your data server crossdomain.xml file");
        this.onload(false);
        //Debug.write("this.loader.onerror.ready =", this.loader.onerror.ready);
        if (this.loader.onerror.ready) {
            this.loader.onerror.sendEvent(null);
        }
        // cancel the timeout handler
        LzLoadQueue.unloadRequest(this);
  } else {
        // If we timed out, and this response came in late, ignore it.
        if (this.timedout) {
            return;
        }

      //Debug.write("LzLoadQueue.XMLOnDataHandler success", this, this.loader);
      // Create a queue containing one root node, myself, and convert it and all children to
      // LzDataNodes.

      // Stash the raw text on the xml object, in case someone wants it (XMLHTTPRequest, for example)
      this.loader.rawtext = src;
      this.parseXML(src);
      this.onload(true);
      // Free up the network connection, so it can be reused, while we do the copy task in background.
      // Copy the Flash XML tree into  tree of LFC LzData classes
      this.loader.queuedCopyFlashXML(this);
  }
}

/**
  * @access private
  */
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
        LzTimer.addTimer( this.timeoutDel , nexttimeout );
    } else {
        this.nextcheck = Infinity;
    }
}

/**
  * @access private
  */
LzLoadQueue.loadFinished = function( loadmc ){
    this.openConx--;
    //Debug.write('LzLoadQueue.loadFinished', this.openConx);

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
        LzTimer.removeTimer( this.timeoutDel );
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
    for ( var i = 0; i < this.listofqs.length; i++ ){
        if ( this.listofqs[ i ].length ) {
            return this.listofqs[ i ].shift();
        }
    }
}

/**
  * @access private
  */
LzLoadQueue.hasMoreInQueue= function( ){
    for ( var i = 0; i < this.listofqs.length; i++ ){
        if ( this.listofqs[ i ].length ) {
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
        Debug.error('duplicate request', loadobj);
        return;
    }
    if (loadobj.lzt == 'xmldata' && ! loadobj.url && ! loadobj.reqobj.url) {
        Debug.error('no url to load', loadobj);
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
            LzTimer.resetTimer( this.timeoutDel , loadobj.timeout );
        } else {
            LzTimer.addTimer( this.timeoutDel , loadobj.timeout );
        }
        this.nextcheck = loadobj.loadtime + loadobj.timeout;
    }

    this.loading.push( loadobj );

    if (loadobj.isaudio == true) {
        //Debug.write('LzLoadQueue makeRequest', loadobj)
        this.loadMovieProxiedOrDirect(loadobj);
    } else if (typeof(loadobj) == "movieclip") {
        this.loadMovieProxiedOrDirect(loadobj);
    } else {
        this.loadXML(loadobj);
    }
    //openConx: The number of currently open connections.
    this.openConx++;
}

/**
  * @access private
  */
LzLoadQueue.loadMovieProxiedOrDirect = function (loadobj) {
    var reqstr;
    if ( !loadobj.proxied ) {
        reqstr = LzBrowser.toAbsoluteURL(loadobj.reqobj.url, false);
    } else {

        delete loadobj.proxied;
        reqstr = LzBrowser.getBaseURL( loadobj.secure,
                                       loadobj.secureport ).toString();
        //fix up URL
        var url = loadobj.reqobj.url;
        if ( url != null) {
            // [2005 03 10] we don't try to munge URLs to HTTPS anymore,
            // the user specifies the URL protocol explicitly if they want https.
            loadobj.reqobj.url = LzBrowser.toAbsoluteURL(url, false);
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
            loadobj.reqobj.fpv = LzBrowser.getVersion();
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
    // Set the onData handler to intercept returning data
    loadobj.onData = LzLoadQueue.XMLOnDataHandler;
    var dopost = (loadobj.reqtype.toUpperCase() == 'POST');
    
    //
    /*
      We need to reparse the query string out of the url, in order to
      set up a LoadVars object with attributes corresponding to the query args.

      If request is proxied, just send everything via POST

      if SOLO,
         check if loadobj.rawpostbody exists: 
            if yes, send XML POST of raw data as TextNode
         else
             send LoadVars POST or GET request with base url 

    */

    // We're loading an XML data object.
    // Look for optional CGI query args string
    // We are going to send the data up using LoadVars.sendAndLoad().
    // We fill in this LoadVars object with any query args. 

    var url = loadobj.url;
    var lvar = new LoadVars();
    //Fix up URL: [A] strip and parse out query args, add them as
    //properties to LVAR (the LoadVars object)
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

    // convert base url to absolute path, otherwise Flash is not happy
    var reqstr = LzBrowser.toAbsoluteURL( url, loadobj.secure );

    // request methodcases:
    // PROXIED: always POST to LPS server
    // SOLO: GET, POST,  (and lzpostbody special case of POST with raw content)
    if (loadobj.proxied) {
        lvar.sendAndLoad(reqstr , loadobj, "POST" );
    } else {
        // get request headers from loader
        var header;
        var headers = loadobj.loader.requestheaders;

        // SOLO load
        if (dopost) {
            //Debug.write("POST", reqstr);
            var lzpostbody = loadobj.rawpostbody
            if (lzpostbody != null) {
                var xmlraw = new XML();
                var tnode = xmlraw.createTextNode(lzpostbody);
                xmlraw.appendChild(tnode);
                for ( header in headers) {
                    xmlraw.addRequestHeader(header, headers[header]);
                }
                xmlraw.sendAndLoad(reqstr, loadobj);
            } else {
                for ( header in headers) {
                    lvar.addRequestHeader(header, headers[header]);
                }
                lvar.sendAndLoad(reqstr , loadobj, "POST" );
            }
        } else {
            for ( header in headers) {
                lvar.addRequestHeader(header, headers[header]);
            }
            //Debug.write("GET", reqstr);
            lvar.sendAndLoad(reqstr , loadobj, "GET" );
        }
    }
}



