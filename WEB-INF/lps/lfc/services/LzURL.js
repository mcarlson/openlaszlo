/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzurl
  * @topic LFC
  * @subtopic Services
  * @access public
  */

/**
  * Parses the protocol, host, port, path, file and query properties for 
  * the specified URL.
  * @param String url: URL to parse
  *
  * http://www.ietf.org/rfc/rfc2396.txt specifies the syntax for a URI
  *
  * We also need to handle these cases that  OpenLaszlo allows
  * which aren't real URLs:
  * 
  * http:foo.html
  * http:/foo/bar.html
  * http:foo.ksp?q=12
  * http:/foo.ksp?q=12
  * http:/foo/bar.ksp?q=12
  * 
  */
public class  LzURL {

    var protocol = null;
    var host = null;
    var port = null;
    var path = null;
    var file = null;
    var query = null;
    var fragment = null;
    var _parsed = null;

    // TODO [hqm 2008-01] this should take an option arg (url=null), but our
    // parser doesn't accept that at the moment.
    public function LzURL ( ...rest ){
        this.protocol = null;
        this.host = null;
        this.port = null;
        this.path = null;
        this.file = null;
        this.query = null;
        this.fragment = null;
        if (rest.length > 0) {
            var url = rest[0];
            if ( url != null ) {
                this.parseURL( url );
            }
        }
    }



    /**
     * Parses the protocol, host, port, path, file ,query and fragment properties for 
     * the specified URL.  
     * 
     * @param String url: URL to parse
     */
    public function parseURL (url)
    {
        if (this._parsed == url) return;
        this._parsed = url;

        // Look for protocol marker "protocol:[//host]"
        var i0 = 0;
        var i1 = url.indexOf(":");

        // Look for query or fragment char, which delimits end of host/path

        // "blah/barf/searchme?btnI=1&q=laszlosystems.com#foobar;bax"

        var iquery = url.indexOf("?", i0);
        var ifrag = url.indexOf("#", i0);
        var iopt = url.length;

        if (ifrag != -1) {
            iopt = ifrag;
        } 

        if (iquery != -1) {
            iopt = iquery;
        }

        if (i1 != -1) {
            this.protocol = url.substring(i0, i1);
            // Check if the prefix is "http://<HOST>" or  "http:PATH"
            if (url.substring(i1+1, i1+3) == "//" ) {
                // it's a prefix of the form "HTTP://HOST"
                //  parse out host[:port]
                // Parse host string (e.g., host:port)
                i0 = i1+3; // skip "://"
                i1 = url.indexOf("/", i0);
                if (i1 == -1) {
                    // There is only a host field, no path e.g.:  http://www.foo.com[?query][#fragment]
                    i1 = iopt;
                }
                var hostPort = url.substring(i0, i1);
                var i = hostPort.indexOf(":");
                if (i == -1 ) {
                    this.host = hostPort;
                    this.port = null;
                } else {
                    this.host = hostPort.substring(0,i);
                    this.port = hostPort.substring(i+1);
                }
            } else {
                // skip the ':'
                i1++;
            }
            i0 = i1;
        } 

        //http://www.ics.uci.edu/pub/ietf/uri/#Related
        //                      ^ i0          ^ i1
        // Parse path, including leading and trailing slash

        i1 = iopt;
        this._splitPath(url.substring(i0, i1));

        if (ifrag != -1) {
            this.fragment = url.substring(ifrag+1, url.length);
        } else {
            ifrag = url.length;
        }

        if (iquery != -1) {
            this.query = url.substring(iquery+1, ifrag);
        }

    }

    /** split out the path and file portion of a url path
        split out the "path" from the "filename"
        examples:
        ""                       := null, null
        "/"                      := "/", null
        "/foo"                   := "/" , "foo"
        /foo/bar                 := "/foo/", "bar"
        /foo/bar/baz/foo.html    := "/foo/bar/baz/", "foo.html"
        /foo/bar/                := "/foo/bar/", null
        foo.html                := null, "foo.html"
        @access private
    */
    function _splitPath(pathfile)
    {
        if (pathfile == "") {
            return;
        }
    
        var ls = pathfile.lastIndexOf("/");
        if (ls != -1) {
            // case "/", "/foo", "/foo/bar", "/foo/bar/";
            this.path = pathfile.substring(0,ls+1);
            this.file = pathfile.substring(ls+1,pathfile.length);
            if (this.file == "") {
                this.file = null;
            }
            return;
        }

        this.path = null;
        this.file = pathfile;
    }


    /** @access private */ 
    function dupe (){
        //make this function fast, because it is called by LzBrowser.toAbsoluteURL
        //which is called frequently by the loader
        var o = new LzURL();
        o.protocol = this.protocol;
        o.host = this.host;
        o.port = this.port;
        o.path = this.path;
        o.file = this.file;
        o.query = this.query;
        o.fragment = this.fragment;
        return o;
    }

    /**
     * Returns this URL as a string
     */
    function toString()
    {
        var out = "";

        if (this.protocol != null) {
            out += this.protocol + ":";
            if (this.host != null) {
                out += "//" + this.host;
                if (null != this.port &&  LzBrowser.defaultPortNums[this.protocol] != this.port ) {
                    out += ":" + this.port;
                }
            }
        }
        if (this.path != null) {
            out += this.path;
        }

        if (null != this.file) {
            out += this.file;
        }
        if (null != this.query) {
            out += "?" + this.query;
        }

        if (null != this.fragment) {
            out += "#" + this.fragment;
        }

    
        //Debug.write("orig: "+ this._parsed + ", Parsed: " + out );
        return out;
    }

    

    /**
     * Returns URL merged with DEFAULTS as an LzURL
     */
    static function merge( url, defaults) 
    {

        var m = url.dupe();
    
        if (url.protocol == null) {
            m.protocol = defaults.protocol;
        }
        if (url.host == null) {
            m.host = defaults.host;
        }
        if (url.port == null) {
            m.port = defaults.port;
        }
        if (url.path == null) {
            m.path = defaults.path;
        }
        if (url.file == null) {
            m.file = defaults.file;
        }
        if (url.query == null) {
            m.query = defaults.query;
        }
        if (url.fragment == null) {
            m.fragment = defaults.fragment;
        }
        return m;
    }
}
