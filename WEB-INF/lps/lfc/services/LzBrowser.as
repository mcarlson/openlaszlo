/******************************************************************************
 * LzBrowser.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzBrowser
//  
//
//==============================================================================
LzBrowser = new Object;

LzBrowser.postToLps = true;

//==============================================================================
// Loads a URL in the browser, optionally in a target
//
// @keywords flashspecific
//
// @param String url: URL to load
// @param String target: Optionally specifies a named frame to display the contents of the URL.
// The document specified by URL is loaded into the current browser frame by default.
//==============================================================================
LzBrowser.loadURL = function ( url, target ){
    _root.getURL(url, target);
}

//==============================================================================
// Runs Javascript in the browser using a javascript: url, optionally in a
// target
//
// @keywords flashspecific
//
// @param String js: Javascrit string to execute
// @param String target: Optionally specifies a named frame to display the contents of the URL.
// By default, the javascript specified in 'js' is executed in the current
// browser frame .
//==============================================================================
LzBrowser.loadJS= function ( js, target ){
    _root.getURL('javascript:' + js + ';void(0);', target);
}

//==============================================================================
// Returns the current version of the Flash player.
//
// @keywords flashspecific
//
//==============================================================================
LzBrowser.getVersion = function() {
    if (!LzBrowser._ver) {
        var o = getVersion().split(' ');
        this._os = o[0]; 
        o = o[1].split(',');
        this._ver = (o[0] + '.' + o[2]) * 1;
    }
    return this._ver;
}

//==============================================================================
// Don't serialize the version -- it should be refetched when
// reconstituted.
// @keywords private
//==============================================================================
LzBrowser.$SID_TRANSIENT = {
    _ver : _root.LzSerializer.transient
};



//==============================================================================
// Returns the URL from which the application was loaded.
//
// @keywords flashspecific
// @return String : the URL the swf was loaded from
//
//==============================================================================
LzBrowser.getLoadURL = function() {
    return _root._url;
}


//==============================================================================
// This function returns the value of a key in the request string that 
// requested the the lzx app. This can be used to communicate server to an lzx
// app without forcing the app to make a request
//
// @return String: The value for a key that appears in the request to the lps
// server
//==============================================================================
LzBrowser.getInitArg = function(name) {
    return _root[name];
}

LzBrowser.defaultPortNums = { http: 80, https: 443 };

//==============================================================================
// Returns the base URL the lzx was loaded from
//
// @keywords flashspecific private
//==============================================================================
LzBrowser.getBaseURL = function(secure, port) {
    var url = this.getLoadURLAsLzURL(); 

    if (secure) {
        url.protocol = "https";
    }

    if (port) {
        url.port = port;
    } 

    if (secure && port == null) {
        url.port = _root.LzBrowser.defaultPortNums[url.protocol]; 
    }
    //_root.Debug.write('port', port);
    //_root.Debug.write('secure', secure);
    //_root.Debug.write('url.port', url.port);

    delete url.query;

    //_root.Debug.write('base url' + url.toString());
    return url;
}

//==============================================================================
// Returns the loadUrl as a new LzURL
//
//==============================================================================
LzBrowser.getLoadURLAsLzURL = function(){
    if ( !this.parsedloadurl ){
        this.parsedloadurl = new _root.LzURL( this.getLoadURL() );
    }
    return this.parsedloadurl.dupe();
}

//==============================================================================
// Converts relative URLs to absolute by prepending the load URL
//
// @keywords flashspecific private
// @param String url: URL to convert
// @param Boolean secure: true if relative http is really https
// @return: an absolute URL
//==============================================================================
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
    //_root.Debug.write('load url', u.toString());
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
    //_root.Debug.write( "changed: " + url );
    //_root.Debug.write( " to: " + u.toString() );
    return u.toString();

    /*
    if ( url.indexOf("http") != 0 ) {
        var u = new _root.LzURL( this.getLoadURL() );
        if ( url.indexOf("/") == 0 ) delete u.path;
        delete u.file;
        delete u.query;
        url = u.toString() + url;
        _root.Debug.write("Converting toAbsoluteURL: " + url + " to " + u.toString() + url) 
    }
    return url;
    */
}

//==============================================================================
// Turns the flash context menu on or off
//
// @keywords flashspecific private
// @param Boolean truefalse: boolean value - true for on, false for off.
//==============================================================================
LzBrowser.showMenu = function(truefalse) {
    fscommand("showmenu", truefalse);
}

//==============================================================================
// Escape special characters in message: &amp; and &lt;.
//==============================================================================
LzBrowser.xmlEscape = function (str) {
    return _root.LzDataNode.prototype.__LZXMLescape( str );
}

//==============================================================================
// Escape a string using URL encoding.
// @param str: The string to escape
// @return: An URL escaped string
//==============================================================================
LzBrowser.urlEscape = function (str) {
    return escape( str );
}
//==============================================================================
// Escape a string using URL encoding.
// @param str: The string to unescape
// @return: An URL decoded string
//==============================================================================
LzBrowser.urlUnescape = function (str) {
    return unescape( str );
}

/*
 For example:

     urlstring = LzBrowser.getLoadURL();
     url = new LzURL(url);
     Debug.write("protocol: " + url.protocol);
     Debug.write("host: " + url.host);
     Debug.write("port: " + url.port);
     Debug.write("path: " + url.path);
     Debug.write("file: " + url.file);
     Debug.write("query: " + url.query);
     Debug.write("tostring: " + url);
*/
//=============================================================================
// DEFINE OBJECT: LzURL
// Parses the protocol, host, port, path, file and query properties for 
// the specified URL.
// @param String url: URL to parse
//=============================================================================
function LzURL( url ){
    if ( url != null ) this.parseURL( url );
}


//==============================================================================
// Parses the protocol, host, port, path, file and query properties for 
// the specified URL.  
//
// @param String url: URL to parse
//==============================================================================
LzURL.prototype.parseURL = function(url)
{
    if (this._parsed == url) return;
    this._parsed = url;

    // Parse protocol
    var i0 = 0;
    var i1 = url.indexOf("://");
    if (i1 == -1) {
        return;
    }
    this.protocol = url.substring(i0, i1);

    // Parse host string (e.g., host:port)
    i0 = i1+3; // skip "://"
    i1 = url.indexOf("/", i0);
    if (i1 == -1) {
        return;
    }
    var hostPort = url.substring(i0, i1);
    var i = hostPort.indexOf(":");
    if (i == -1 ) {
        this.host = hostPort;
        this.port = LzBrowser.defaultPortNums[this.protocol];
    } else {
        this.host = hostPort.substring(0,i);
        this.port = hostPort.substring(i+1);
    }

    // Parse path, including last slash
    i0 = i1;    
    i1 = url.lastIndexOf("/") + 1;
    if (i1 == 0) {
        this.path = url.substring(i0);
    } else {
        this.path = url.substring(i0, i1);
    }

    // Parse file
    i0 = i1;    
    i1 = url.indexOf("?", i0);
    if (i1 == -1) {
        this.file = url.substring(i0);
        return;
    } else {
        this.file = url.substring(i0, i1);
    }

    // Parse query string
    i0 = i1+1; // skip '?'
    this.query = url.substring(i0);
}

// @keywords  private
LzURL.prototype.dupe = function (){
    //make this function fast, because it is called by LzBrowser.toAbsoluteURL
    //which is called frequently by the loader
    var o = { protocol : this.protocol,
             host : this.host,
             port : this.port,
             path : this.path,
             file : this.file,
             query : this.query };

    o.__proto__ =  _root.LzURL.prototype;
    return o;
}

//==============================================================================
// Returns this URL as a string
//==============================================================================
LzURL.prototype.toString = function()
{
    var out = this.protocol + "://" + this.host;
    if (null != this.port &&  _root.LzBrowser.defaultPortNums[this.protocol] != this.port ) {
        out += ":" + this.port;
    }
    out += this.path;
    if (null != this.file) {
        out += this.file;
    }
    if (null != this.query) {
        out += "?" + this.query;
    }
    
    //_root.Debug.write("orig: "+ this._parsed + ", Parsed: " + out );
    return out;
}

// @keywords private
LzBrowser.usePost = function (){
    return this.postToLps && this.supportsPost();
}

// @keywords private
LzBrowser.supportsPost = function (){
    return true;
}

//==============================================================================
// Sets the system clipboard to the specified string
//
// @keywords flashspecific
//
// @param String str: String to set the system clipboard to
//==============================================================================
LzBrowser.setClipboard = function (str){
    System.setClipboard(str);
}

//==============================================================================
// Determines if the a screen reader is active and the Flash player is focused
//
// @keywords flashspecific
//
// @return: True if a screen reader is active and the Flash player is focused
//==============================================================================
LzBrowser.isAAActive = function (){
    var a = Accessibility.isActive();
  	return a;
}

//==============================================================================
// Updates accessibility data
//
// @keywords flashspecific
// @keywords private
//==============================================================================
LzBrowser.updateAccessibility = function () {
  	Accessibility.updateProperties();
}
