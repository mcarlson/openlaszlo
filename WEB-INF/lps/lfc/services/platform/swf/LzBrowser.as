/**
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzbrowser
  * @access public
  * @topic LFC
  * @subtopic Services
  */

/**
  * <p>The <classname>LzBrowser</classname> service provides access to the
  * browser and player environment.  It includes methods to load URLs in
  * the browser, and check the version of the player. For example:</p>
  * 
  * <example title="Using LzBrowser to launch another browser">
  *  &lt;canvas height="140" debug="true"&gt;
  *    &lt;!-- Load the Laszlo site in a new window --&gt;
  *    &lt;button onclick="LzBrowser.loadURL('http://www.laszlosystems.com/', '_blank')"&gt;
  * 
  *      Click me
  *    &lt;/button&gt;
  *    &lt;script&gt;
  *      // List the player version
  *      Debug.write('Player version: ' + LzBrowser.getVersion());
  *    &lt;/script&gt;
  *  &lt;/canvas&gt;
  * </example>
  *
  * @shortdesc Provides access to the browser and player environment
  */
var LzBrowser = new Object;

LzBrowser.postToLps = true;
LzBrowser.parsedloadurl = false;

/**
  * Loads a URL in the browser, optionally in a target
  * 
  * @param String url: URL to load
  * @param String target: Optionally specifies a named frame to display the contents of the URL.
  * The document specified by URL is loaded into the current browser frame by default.
  */
LzBrowser.loadURL = function ( url, target ){
  // SWF-specific
  _root.getURL(url, target);
}

/**
  * Runs Javascript in the browser using a javascript: url, optionally in a
  * target
  * 
  * 
  * @param String js: Javascript string to execute
  * @param String target: Optionally specifies a named frame to display the contents of the URL.
  * By default, the javascript specified in 'js' is executed in the current
  * browser frame .
  */
LzBrowser.loadJS= function ( js, target ){
  // SWF-specific
  _root.getURL('javascript:' + js + ';void(0);', target);
}

/**
  * Runs a Javascript method in the browser, optionally returning the result  
  * 
  * @param String js: Browser javascript method name to execute
  * @param Function callback: Optionall callback function to get the return value of the javascript call
  * @param Optional arguments to call
  */
LzBrowser.callJS = function (js, callback) {
    if (LzBrowser.jsready != true) {
        this.__jslocked = true;
    }
    if (this.__jslocked == true) {
        if (callback != false) {
            var o = [];
            for (var i = 0; i< arguments.length; i++) {
                o[i] = arguments[i];
            }
            this.__jscallq.push(o);
            //Debug.write('queued', this.__jscallq.length, o); 
        }
        return;
    }

    if (typeof callback == 'function') {
        this.__jscallback = callback;
    } else {
        this.__jscallback = null;
    }
    var args = [].slice.call(arguments, 2);
    args.unshift(js, LzBrowser.callJSReturn);

    this.__jslocked = true;
    //Debug.write('calling with args real', arguments);
    DojoExternalInterface.call.apply(this, args);

    if (callback == false) {
        this._dequeueJS();
    }
}
/** @access private */ 
LzBrowser.__jscallback = null;
/** @access private */ 
LzBrowser.__jslocked = false;
/** @access private */ 
LzBrowser.__jscallq = [];

/** @access private */ 
LzBrowser.__jsready = function () {
    //Debug.write('jsready');
    LzBrowser.jsready=true;
    this._dequeueJS();
}
LzBrowser.callJSReturn = function (a) {
    //Debug.write('callJSReturn', a);
    if (LzBrowser.__jscallback) {
        LzBrowser.__jscallback(a);
    }
    LzBrowser._dequeueJS();
}

/** @access private */ 
LzBrowser._dequeueJS = function (a) {
    this.__jslocked = false;
    this.__jscallback = null;
    if (this.__jscallq.length > 0) {
        var a = this.__jscallq.pop();
        //Debug.write('calling with args q', a);
        LzBrowser.callJS.apply(this, a);
    }
}

/** @access private */ 
LzBrowser._jsreset = function () {
    this.__jslocked = false;
    this.__jscallback = null;
    this.__jscallq = [];
}
    
/**
  * Returns the current version of the Flash player.
  * @keywords flashspecific
  * 
  */
LzBrowser.getVersion = function() {
    if (!LzBrowser._ver) {
        var o = getVersion().split(' ');
        this._os = o[0]; 
        o = o[1].split(',');
        this._ver = (o[0] + '.' + o[2]) * 1;
    }
    return this._ver;
}


/**
  * Returns the URL from which the application was loaded.
  * @return String : the URL the swf was loaded from
  * 
  */
LzBrowser.getLoadURL = function() {
  // SWF-specific
  return _root._url;
}


/**
  * This function returns the value of a key in the request string that 
  * requested the the lzx app. This can be used to communicate server to an lzx
  * app without forcing the app to make a request
  * 
  * @return String: The value for a key that appears in the request to the lps
  * server
  */
LzBrowser.getInitArg = function(name) {
  // SWF-specific
  return _root[name];
}

LzBrowser.defaultPortNums = { http: 80, https: 443 };

/**
  * Returns the base URL the lzx was loaded from
  * @keywords private
  */
LzBrowser.getBaseURL = function(secure, port) {
    var url = this.getLoadURLAsLzURL(); 

    if (secure) {
        url.protocol = "https";
    }

    if (port) {
        url.port = port;
    } 

    if (secure && port == null) {
        url.port = LzBrowser.defaultPortNums[url.protocol]; 
    }
    //Debug.write('port', port);
    //Debug.write('secure', secure);
    //Debug.write('url.port', url.port);

    delete url.query;

    //Debug.write('base url' + url.toString());
    return url;
}

/**
  * Returns the loadUrl as a new LzURL
  * */
LzBrowser.getLoadURLAsLzURL = function(){
    if ( !this.parsedloadurl ){
        this.parsedloadurl = new LzURL( this.getLoadURL() );
    }
    return this.parsedloadurl.dupe();
}

/**
  * Converts relative URLs to absolute by prepending the load URL
  * @keywords private
  * @param String url: URL to convert
  * @param Boolean secure: true if relative http is really https
  * @return: an absolute URL
  */
LzBrowser.toAbsoluteURL = function(url, secure) {
    // If it begins with "/@WEBAPP@/", server will handle URL.
    // or If it begins with "file:", server will handle URL.
    // or do we have an absolute url?
    if ( url.indexOf("://") > -1  ||
         url.indexOf("/@WEBAPP@/") == 0 ||
         url.indexOf("file:") == 0 ){

        return url;
    }


    //do we have a protocol?
    var returl = "";
    var u = this.getLoadURLAsLzURL();
    //Debug.write('load url', u.toString());
    //for LzURL: protocol,host, port, path, file, query

    /* Description: LzBrowser.toAbsoluteURL('http:/zot/foo.bar') =>
       http://127.0.0.1:8080/lps-dev-bug/examples//zot/foo.bar
       I would have hoped for:
       http://127.0.0.1:8080/zot/foo.bar
    */

    //no colons unless you specify protocol
    if ( url.indexOf(":") > -1 ){
        /* http:foo.lzx
           http:/foo.lzx
        */
        var colon = url.indexOf(":");
        var loadUrlIsSecure = (u.protocol == 'https');
        u.protocol = url.substring( 0 , colon );
        if (secure || loadUrlIsSecure) {
            if (u.protocol == 'http') {
                u.protocol = 'https'
            }
        } 
        var path = url.substring(colon+1, url.length);
        // is URL of the form http:/zot/foo.bar?
        if (path.charAt(0) == '/') {
            u.path = url.substring( colon + 1 );
            delete u.file;
        } else {
            u.file = url.substring( colon + 1 );
        }
        u.query = null
    } else {
        if ( url.charAt( 0 ) == '/' ){
            //this is the root of the host
            u.path = url;
            //although this is really both the path and the file,
            //it's expedient to handle it this way, since this
            //method just returns a string
            u.file = null;
        } else {
            //no protocol -- totally relative
            u.file = url;
        }
        u.query = null
    }
    //Debug.write( "changed: " + url );
    //Debug.write( " to: " + u.toString() );
    return u.toString();

    /*
    if ( url.indexOf("http") != 0 ) {
        var u = new LzURL( this.getLoadURL() );
        if ( url.indexOf("/") == 0 ) delete u.path;
        delete u.file;
        delete u.query;
        url = u.toString() + url;
        Debug.write("Converting toAbsoluteURL: " + url + " to " + u.toString() + url) 
    }
    return url;
    */
}

/**
  * Turns the flash context menu on or off
  * @keywords flashspecific private
  * @param Boolean truefalse: boolean value - true for on, false for off.
  */
LzBrowser.showMenu = function(truefalse) {
    fscommand("showmenu", truefalse);
}

/**
  * Escape special characters in message: &amp; and &lt;.
  */
LzBrowser.xmlEscape = function (str) {
    return LzDataNode.prototype.__LZXMLescape( str );
}

/**
  * Escape a string using URL encoding.
  * @param str: The string to escape
  * @return: An URL escaped string
  */
LzBrowser.urlEscape = function (str) {
    return escape( str );
}
/**
  * Escape a string using URL encoding.
  * @param str: The string to unescape
  * @return: An URL decoded string
  */
LzBrowser.urlUnescape = function (str) {
    return unescape( str );
}
/** @access private */
LzBrowser.usePost = function (){
    return this.postToLps && this.supportsPost();
}

/** @access private */
LzBrowser.supportsPost = function (){
    return true;
}

/**
  * Sets the system clipboard to the specified string
  * @keywords flashspecific
  * 
  * @param String str: String to set the system clipboard to
  */
LzBrowser.setClipboard = function (str){
    System.setClipboard(str);
}

/**
  * Determines if the a screen reader is active and the Flash player is focused
  * @keywords flashspecific
  * 
  * @return: True if a screen reader is active and the Flash player is focused
  */
LzBrowser.isAAActive = function (){
    var a = Accessibility.isActive();
    return a;
}

/**
  * Updates accessibility data
  * @keywords flashspecific
  * @access private
  */
LzBrowser.updateAccessibility = function () {
    Accessibility.updateProperties();
}

/*
LzBrowser.createCallback = function (name, callback) {
    return function() {
        var args = [].slice.call(arguments, 0);
        args.unshift(name, callback);
        //Debug.write('createCallback', args);
        LzBrowser.callJS.apply(arguments.callee, args)
    }
}*/


// proxy object for browser Lz
Lz = {
    setCanvasAttribute: function (name, value, hist) {
        LzBrowser.callJS('Lz.setCanvasAttribute', false, name, value, hist); 
    }
    //setCanvasAttribute: LzBrowser.createCallback('Lz.setCanvasAttribute', null)
}

