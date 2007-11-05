/**
  * @topic Browser
  * @subtopic Integration
  * @access public
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  * Use is subject to license terms.
  */
  
/**
 *
 * <para>In the <code>&lt;html&gt;&lt;head&gt;</code> of an HTML document that embeds a Flash Laszlo application,
 * add this line:</para>
 * <example executable="false">&lt;script src="<replaceable>{$lps}</replaceable>/embed-compressed.js" language="JavaScript" type="text/javascript"/&gt;</example>
 * <para>At the location within the &lt;html>&lt;body> where the application is to be
 * embeded, add this line:</para>
 * <example executable="false">
 *   &lt;script language="JavaScript" type="text/javascript">
 *     lz.swfEmbed({url: '<replaceable>myapp.lzx</replaceable>?lzt=swf', bgcolor: '#000000', width: '<replaceable>800</replaceable>', height: '<replaceable>600</replaceable>'});
 *   &lt;/script></example>
 *
 * <para>where the url matches the URI that the application is served from, and
 * the other properties match the attributes of the application's canvas.</para>
 *
 * <para>DHTML applications must in addition make the following call in the page head:</para>
 * <example executable="false">
 *   &lt;script language="JavaScript" type="text/javascript"&gt;
 *     Lz.dhtmlEmbedLFC('<replaceable>{$lps}</replaceable>/lps/includes/lfc/LFCdhtml.js');
 *   &lt;script&gt;</example>
 *
 * And of course DHTML embedding uses the <code>lz.dhtmlEmbed</code> call instead of <code>lz.swfEmbed</code>.
 * 
 * @shortdesc JavaScript library for embedding Laszlo applications
 */

Lz = {
    /** @access private */
    __dhtmlhistoryready: false,
    /**
     * Writes the necessary HTML to embed a swf file in the document where the 
     * function is called.  
     *
     * @param properties:Object properties used to write the swf, e.g. 
     * {url: 'myapp.lzx?lzt=swf', bgcolor: '#000000', width: '800', height: '600', id: 'lzapp', accessible: 'true'}
     *
     * @param minimumVersion:Number the version the flash player should 
     * upgrade to if necessary.  Defaults to 7.
     */
    swfEmbed: function (properties, minimumVersion) {
        // don't upgrade flash unless asked
        if (minimumVersion == null) minimumVersion = 7;


        var url = properties.url;

        // look for version in query string
        var i = url.indexOf('lzr=swf');
        if (i == -1) {
            // add default version if missing
            url += '&lzr=swf7';
            i = url.indexOf('lzr=swf');
            //alert('added version ' + url + ', ' + i);
        }    
        // account for 'lzr=swf' length
        i += 7; 

        // get LPS swf request version
        var requestVersion = url.substring(i, i + 1) * 1;

        // Check flash comm version
        if (dojo.flash.info.commVersion > requestVersion) {
            url = url.substring(0, i) + dojo.flash.info.commVersion + url.substring(i + 1, url.length);
            //alert('updated version ' + url);
            minimumVersion = dojo.flash.info.commVersion;
        } else if (dojo.flash.info.commVersion <= 7 && requestVersion > 7) {
            // if requested lzr=swf8, set dojo comm version to 8
            dojo.flash.info.commVersion = 8;
        }

        if (requestVersion > minimumVersion) {
            minimumVersion = requestVersion;
        }    

        //alert(requestVersion + ', ' + minimumVersion);

        var queryvals = this.__getqueryurl(url);

        if (properties.accessible == 'true') {
            queryvals.flashvars += '&accessible=true';
        }
        queryvals.flashvars += '&id=' + properties.id;

        var url = queryvals.url + '?' + queryvals.query;

        var swfargs = { 
            width: properties.width + ''
            ,height: properties.height + ''
            ,id: properties.id
            ,bgcolor: properties.bgcolor
            ,wmode: properties.wmode
            ,flashvars: queryvals.flashvars
            ,flash6: url
            ,flash8: url
            ,appenddiv: Lz._getAppendDiv(properties.id, properties.appenddivid)
        };

        // Add entry for this application 
        Lz[properties.id] = { 
            runtime: 'swf'
            ,_id: properties.id
            ,setCanvasAttribute: Lz._setCanvasAttributeSWF
            ,getCanvasAttribute: Lz._getCanvasAttributeSWF
            ,callMethod: Lz._callMethodSWF
            ,_ready: Lz._ready
            ,loaded: false
            ,_sendMouseWheel: Lz._sendMouseWheel
            ,_setCanvasAttributeDequeue: Lz._setCanvasAttributeDequeue
        }
        // for callbacks onload
        Lz._swfid = properties.id;
        dojo.flash.addLoadedListener(Lz._loaded);
        dojo.flash.addLoadedListener(Lz.history.init)
        if (! Lz['setCanvasAttribute']) {
            Lz.setCanvasAttribute = Lz[properties.id].setCanvasAttribute;
        }
        if (! Lz['getCanvasAttribute']) Lz.getCanvasAttribute = Lz[properties.id].getCanvasAttribute;
        if (! Lz['callMethod']) Lz.callMethod = Lz[properties.id].callMethod;

        dojo.flash.setSwf(swfargs, minimumVersion);
        Lz.__BrowserDetect.init();
        if (Lz.__BrowserDetect.OS == 'Mac') {
            LzMousewheelKernel.setCallback(Lz[properties.id], '_sendMouseWheel');
        }
    }

    ,/**
     * Write &lt;script/> tags into the document at the location where this 
     * function is called to load the LFC.  Must be called before dhtmlEmbed().
     *
     * @param url:String url to LFC
     *
     * @param allowUnsupported:(true|false|undefined) if true, there
     * will be no check for unsupported browsers -- the LFC and app
     * will be loaded and executed.  If false, unsupported browsers
     * will not be permitted and a notice that the browser is not
     * supported will be displayed.  If undefined or omitted, the user
     * will queried if they want to 'try anyway' if the browser is
     * unsupported -- clicking `OK` (or `Cancel) will have the same
     * effect as a `true` (or `false`) value for this parameter
     */
    dhtmlEmbedLFC: function (url, allowUnsupported) {
        if (allowUnsupported) {
            // turn off checking
            this.supportedBrowser = true;
            Lz.__BrowserDetect.init();
        } else if (! this.__isSupportedBrowser(allowUnsupported === false)) {
            document.write('<div style="margin: 5%; width: auto; background-color: #fff; padding: 1em; overflow: visible"><div><a href="http://www.openlaszlo.org/" target="_top"><img src="http://openlaszlo.org/themes/manji/images/ol_logo_small.gif" height="46" width="204" alt="OpenLaszlo" ></a></div><p>The OpenLaszlo DHTML runtime is not fully supported on this browser.  More information is available <a href="http://www.openlaszlo.org/" target="_top">here</a>.</p></div>');
            return;
        }

        if (Lz.__BrowserDetect.isIE) {
            var scripturl = lzOptions.ServerRoot+ '/lps/includes/excanvas.js';
            this.__dhtmlLoadScript(scripturl)
        }
        if ((Lz.__BrowserDetect.isIE && Lz.__BrowserDetect.version < 7) || (Lz.__BrowserDetect.isSafari && Lz.__BrowserDetect.version <= 419.3)) {
            // use the 'simple' version of the LFC: LFCdhtml-{debug,backtrace}-simple.js for Safari 2 and IE 6
            var i = url.indexOf('debug.js') || url.indexOf('backtrace.js')
            if (i != -1) {
                var type = url.substring(i, url.length - 3);
                url = url.substring(0, i) + type + '-simple.js';
            }
        }

        this.__dhtmlLoadScript(url)
    }

    ,/**
     * Write &lt;script/> tags into the document at the location
     * where this function is called to load the LZX Application.
     *
     * @param properties:Object properties used to write the dhtml, e.g. 
     * {url: 'myapp.lzx?lzt=swf', bgcolor: '#000000', width: '800', height: '600'}
     *
     * Note: dhtmlEmbedLFC must have already been called, to load the
     * LFC and to do any browser-checking.  If dhtmlEmbedLFC has not
     * been called or the browser-check did not pass, this call will
     * not load the application.
     */
    dhtmlEmbed: function (properties, allowUnsupported) {
        if (allowUnsupported) {
            // turn off checking
        } else if (! this.supportedBrowser) {
            return;
        }

        var queryvals = this.__getqueryurl(properties.url, true);
        var url = queryvals.url + '?lzt=object&' + queryvals.query;

        Lz.__propcache = {
            bgcolor: properties.bgcolor
            ,width: properties.width.indexOf('%') == -1 ? properties.width + 'px' : properties.width
            ,height: properties.height.indexOf('%') == -1 ? properties.height + 'px' : properties.height
            ,id: properties.id
            ,appenddiv: Lz._getAppendDiv(properties.id, properties.appenddivid)
            ,url: url
        };

        // Add entry for this application 
        Lz[properties.id] = { 
            runtime: 'dhtml'
            ,_id: properties.id
            ,_ready: Lz._ready
            ,loaded: false
            ,setCanvasAttribute: Lz._setCanvasAttributeDHTML
            ,getCanvasAttribute: Lz._getCanvasAttributeDHTML
        }
        if (! Lz['setCanvasAttribute']) Lz.setCanvasAttribute = Lz[properties.id].setCanvasAttribute;
        if (! Lz['getCanvasAttribute']) Lz.getCanvasAttribute = Lz[properties.id].getCanvasAttribute;

        this.__dhtmlLoadScript(url)
    }

    ,/** @access private */
    __dhtmlLoadScript: function (url) {
        var o = '<script type="text/javascript" language="JavaScript1.5" src="' + url +'"></script>';
        //alert(o);
        document.writeln(o);
        return o;
    }

    ,__dhtmlLoadLibrary: function (url) {
        var o = document.createElement('script');
        this.__setAttr(o, 'type', 'text/javascript');
        this.__setAttr(o, 'src', url);
        document.getElementsByTagName("head")[0].appendChild(o);
        //alert(o);
        return o;
    }

    ,/** @access private */
    __getqueryurl: function (url, setglobals) {
        // strip query string to only args required by the compiler
        // if setglobals == true, set browser globals
        // return 'flashvars' property args not required by LPS

        // TODO Henry: We need to ask the canvas info what the value of the debug flag really is. Don't just trust the query arg, since it can be overriden by the canvas attributes.

        var sp = url.split('?');
        url = sp[0];
        if (sp.length == 1) return {url: url, flashvars: '', query: ''};

        var queryvals = this.__parseQuery(sp[1]);
        var query = '';
        var flashvars = '';
        var re = new RegExp('\\+', 'g');
        for (var i in queryvals) {
            if (i == '' || i == null) continue;

            var v = queryvals[i];

            // add lps vars to query string
            if (i == 'lzr' || i == 'lzt'
                || i == 'krank' || i == 'debug' || i == 'profile' || i == 'lzbacktrace'
                || i == 'lzdebug' || i == 'lzkrank' || i == 'lzprofile'
                || i == 'fb' || i == 'sourcelocators' || i == '_canvas_debug') {
                query += i + '=' + v + '&';
            }

            // set globals for all query args per LPP-2781
            if (setglobals) {
                if (window[i] == null) {
                    // sometimes URLs contain '+' - change to spaces
                    window[i] = unescape(v.replace(re, ' '));
                    //alert(i + ' = ' + v);
                }
            }

            // store for passing in via flashvars
            flashvars += i + '=' + v + '&';
        }
        query = query.substr(0, query.length - 1);
        flashvars = flashvars.substr(0, flashvars.length - 1);

        return {url: url, flashvars: flashvars, query: query};
    }

    ,/** @access private */
    __parseQuery: function(s) {
        // parses a query string into name/value pairs
        if (s.indexOf('=') == -1) return;
        var p = s.split('&');
        var d = {};
        for (i in p) {
            var nv = p[i].split('=');
            if (nv.length == 1) continue;
            var n = nv[0];
            var v = nv[1];
            d[n] = v;
        }
        return d;
    }

    ,/** @access private */
    __setAttr: function(s, n, v) {
#pragma "passThrough=true"
        s.setAttribute(n, v);
    }

    ,/**
     * Check that the browser is a supported browser
     *
     * @param dontAsk:boolean If false and the browser is not
     * supported, the user will be asked if they want to 'try
     * anyway'. If true, unsupported browsers will not be permitted.
     * @access private
     */
    __isSupportedBrowser: function (dontAsk) {
      if (this.hasOwnProperty('supportedBrowser')) {
        return this.supportedBrowser;
      }
      var b = Lz.__BrowserDetect;
      b.init();
      b.isSupported = (b.isFirefox && b.version >= 1.5) ||
                        (b.isIE && b.version >= 6.0) ||
                        (b.isSafari && b.version >= 418.9);

      if (b.isSupported) {
        this.supportedBrowser = true;
      } else if (dontAsk) {
        this.supportedBrowser = false;
      } else {
        if (document.cookie == 'supportedBrowser=true') {
          this.supportedBrowser = true;
        } else {
          this.supportedBrowser = confirm("The OpenLaszlo DHTML runtime is not fully supported on this browser.  Click OK to try it anyway.  [ Detected browser " + b.browser + ' version ' + b.version + ']');
          if (this.supportedBrowser) document.cookie = 'supportedBrowser=true';
        }
      }

      return this.supportedBrowser;
    }

    ,/**
     * Sets an attribute on the canvas of an embedded SWF application 
     *
     * @param name:String name of the property to set
     *
     * @param value:String value to set the property to
     *
     * @param hist:Boolean value - if true, add a history event.
     */
    _setCanvasAttributeSWF: function (name, value, hist) {
        if (this.loaded && dojo.flash.comm['callMethod']) {
            if (hist) {
                Lz.history._store(name, value);
            } else {
                dojo.flash.comm.setCanvasAttribute(name, value + '');
            }
        } else {
            if (this._setCanvasAttributeQ == null) {
                this._setCanvasAttributeQ = [[name,value, hist]];
            } else {
                this._setCanvasAttributeQ.push([name, value, hist]);
            }
        }
    }
    ,/**
     * Sets an attribute on the canvas of an embedded DHTML application 
     *
     * @param name:String name of the property to set
     *
     * @param value:String value to set the property to
     *
     * @param hist:Boolean value - if true, add a history event.
     */
    _setCanvasAttributeDHTML: function (name, value, hist) {
        if (hist) {
            Lz.history._store(name, value);
        } else if (canvas) {
            canvas.setAttribute(name, value);
        }
    }
    ,/** @access private */
    // called by flash/js 
    _loaded: function () {
        if (dojo.flash.info.commVersion == 8) {
            // wait a bit longer for Flash to init
            setTimeout('Lz["'+Lz._swfid +'"]._ready.call(Lz["'+Lz._swfid+'"])', 100);
        } else {
            Lz[Lz._swfid]._ready.call(Lz[Lz._swfid]);
        }
    }
    ,/** @access private */
    _setCanvasAttributeDequeue: function () {
        while (this._setCanvasAttributeQ.length > 0) {
            var a = this._setCanvasAttributeQ.pop();
            this.setCanvasAttribute(a[0], a[1], a[2]);
        }
    }
    ,/** @access private */
    _ready: function (cref) {
        this.loaded = true;
        Lz.loaded = true;
        if (this._setCanvasAttributeQ) {
            this._setCanvasAttributeDequeue();
        }
        if (cref) this.canvas = cref;
        if (this.onload && typeof this.onload == 'function') {
            this.onload();
        }
    }

    ,/**
     * Reads an attribute from the canvas of an embedded SWF application and 
     * returns its value
     *
     * @param name:String name of the property to read
     */
    _getCanvasAttributeSWF: function (name) {
        if (this.loaded) {
            return dojo.flash.comm.getCanvasAttribute(name);
        } else {
            alert('Flash is not ready: getCanvasAttribute' + name);
        }
    }

    ,/**
     * Reads an attribute from the canvas of an embedded DHTML application and 
     * returns its value
     *
     * @param name:String name of the property to read
     */
    _getCanvasAttributeDHTML: function (name) {
        return canvas[name];
    }

    ,/** @devnote from http://www.quirksmode.org/js/detect.html 
         @access private
       */
    __BrowserDetect: {
        init: function () {
            if (this.initted) return;
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent)
                || this.searchVersion(navigator.appVersion)
                || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
            this.initted = true;
            if (this.browser == 'Netscape') {
                // currently only used for IE spoofing NS8
                this.isNetscape = true;
            } else if (this.browser == 'Safari') {
                this.isSafari = true;
            } else if (this.browser == 'Opera') {
                this.isOpera = true;
            } else if (this.browser == 'Firefox') {
                this.isFirefox = true;
            } else if (this.browser == 'Explorer') {
                // true if we're on ie and not being spoofed
                this.isIE = true;
            }
        },
        searchString: function (data) {
            for (var i=0;i<data.length;i++)    {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1)
                        return data[i].identity;
                }
                else if (dataProp)
                    return data[i].identity;
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
        },
        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: "Apple",
                identity: "Safari",
                versionSearch: "WebKit"
            },
            {
                prop: window.opera,
                identity: "Opera"
            },
            {
                string: navigator.vendor,
                subString: "iCab",
                identity: "iCab"
            },
            {
                string: navigator.vendor,
                subString: "KDE",
                identity: "Konqueror"
            },
            {
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "Firefox"
            },
            {
                string: navigator.userAgent,
                subString: "Iceweasel",
                versionSearch: "Iceweasel", 
                identity: "Firefox"
            },
            {    // for newer Netscapes (6+)
                string: navigator.userAgent,
                subString: "Netscape",
                identity: "Netscape"
            },
            {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "Explorer",
                versionSearch: "MSIE"
            },
            {
                string: navigator.userAgent,
                subString: "Gecko",
                identity: "Mozilla",
                versionSearch: "rv"
            },
            {     // for older Netscapes (4-)
                string: navigator.userAgent,
                subString: "Mozilla",
                identity: "Netscape",
                versionSearch: "Mozilla"
            }
        ],
        dataOS : [
            {
                string: navigator.platform,
                subString: "Win",
                identity: "Windows"
            },
            {
                string: navigator.platform,
                subString: "Mac",
                identity: "Mac"
            },
            {
                string: navigator.platform,
                subString: "Linux",
                identity: "Linux"
            }
        ]
    }

    ,/**
     * Calls a method with optional arguments in an embedded SWF application 
     * and returns the result.   
     *
     * @param js:String javascript to call in the form 'foo.bar.methodcall(arg1,arg2,...)'
     */
    _callMethodSWF: function (js) {
        if (this.loaded) {
            return dojo.flash.comm.callMethod(js);
        } else {
            var f = function() {
                dojo.flash.comm.callMethod(js);
            };
            dojo.flash.addLoadedListener(f);
        }
    }
    ,/** @access private */
    _getAppendDiv: function(id, appenddivid) {
        var divid = appenddivid ? appenddivid : id + 'Container';
        var root = document.getElementById(divid);
        if (! root) {
            document.writeln('<div id="' + divid + '"></div>');
            root = document.getElementById(divid);
        }
        return root;
    }
    ,/** @access private */
    _sendMouseWheel: function(d) {
        if (d != null) this.callMethod("LzKeys.__mousewheelEvent(" + d + ")"); 
    }
};
