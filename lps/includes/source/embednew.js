/**
  * @topic Browser
  * @subtopic Integration
  * @access public
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
  * Use is subject to license terms.
  */
  
// *** NOTE TO ANYONE WHO MODIFIES THE LZ.EMBED OBJECT HERE: please
// run "ant lztest" and make sure that it does not cause an error in
// the rhino test harness. If it does, edit lps/utils/rhino.js and
// make the mocked up lz.embed object match your changes as much as
// possible to make the 'rhino runtime' able to execute the "ant lztest"
// smoke-test without errors. ***

// this seems to be required at least as of trunk/r15165
#pragma "passThrough=true"

/**
 *
 * <para>In the <code>&lt;html&gt;&lt;head&gt;</code> of an HTML document that embeds a Flash Laszlo application,
 * add this line:</para>
 * <example executable="false">&lt;script src="<replaceable>{$lps}</replaceable>/embed-compressed.js" language="JavaScript" type="text/javascript"/&gt;</example>
 * <para>At the location within the &lt;html>&lt;body> where the application is to be
 * embeded, add this line:</para>
 * <example executable="false">
 *   &lt;script language="JavaScript" type="text/javascript">
 *     lz.embed.swf({url: '<replaceable>myapp.lzx</replaceable>?lzt=swf', bgcolor: '#000000', width: <replaceable>800</replaceable>, height: <replaceable>600</replaceable>, id: '<replaceable>swfapp</replaceable>}');
 *   &lt;/script></example>
 *
 * <para>where the url matches the URI that the application is served from, and
 * the other properties match the attributes of the application's canvas.</para>
 *
 * <para>DHTML applications must in addition make the following call in the page head:</para>
 * <example executable="false">
 *   &lt;script language="JavaScript" type="text/javascript"&gt;
 *     lz.embed.lfc<replaceable>{$lps}</replaceable>/lps/includes/lfc/LFCdhtml.js', '<replaceable>{$lps}</replaceable>');
 *   &lt;script&gt;</example>
 *
 * And of course DHTML embedding uses the <code>lz.embed.dhtml</code> call instead of <code>lz.embed.swf</code>.
 * 
 * @shortdesc JavaScript library for embedding Laszlo applications
 */

lz.embed = {
    /** A hash of options used by the embedding system.
     * @access private 
     */
    options: {
                cancelkeyboardcontrol: false, // if true, dhtml keyboard and mousewheel control is canceled.  For versions of Flash that don't support mousewheel events natively (flash on os x) browser-based mousewheel control is canceled.
                serverroot: null, // for DHTML, the root url to load server resources from.  Set by lz.embed.lfc();
                approot: '', // for DHTML, the root url to load app resources from 
                usemastersprite: false // if true, dhtml use a single 'master sprite' where possible
             }

    /**
     * Writes the necessary HTML to embed a swf file in the document where the 
     * function is called.  
     *
     * @param properties:Object properties used to write the swf, e.g. 
     * {url: 'myapp.lzx?lzt=swf', bgcolor: '#000000', width: '800', height: '600', id: 'lzapp', accessible: true, history: true/false}
     *
     * @param minimumVersion:Number the version the flash player should 
     * upgrade to if necessary.  Defaults to 10 for security reasons.
     */
    ,swf: function (properties, minimumVersion) {
        var embed = lz.embed;
        // Upgrade to flash player 10 for security reasons
        if (minimumVersion == null) minimumVersion = 10;


        var url = properties.url;

        var queryvals = this.__getqueryurl(url);

        // allow query string options to override properties hash values
        for (var i in queryvals.options) {
            var v = queryvals.options[i];
            if (v != null) {
                properties[i] = v;
            }
        }

        if (properties.accessible && properties.accessible != 'false') {
            queryvals.flashvars += '&accessible=true';
        }
        if (properties.history) {
            queryvals.flashvars += '&history=true';
        }
        if (properties.bgcolor != null) {
            queryvals.flashvars += '&bgcolor=' + escape(properties.bgcolor);
        }
        queryvals.flashvars += '&width=' + escape(properties.width);
        queryvals.flashvars += '&height=' + escape(properties.height);
        queryvals.flashvars += '&__lzurl=' + escape(url);
        queryvals.flashvars += '&__lzminimumversion=' + escape(minimumVersion);
        queryvals.flashvars += '&id=' + escape(properties.id);

        var url = queryvals.url + '?' + queryvals.query;

        var appenddiv = embed._getAppendDiv(properties.id, properties.appenddivid);
        // NOTE: [2009-08-24 ptw] We set the embed width/height to
        // 100% and the appenddiv to the desired size, so the platform
        // can adjust the appenddiv size to effect a dynamic canvas
        var swfargs = {
            width: '100%'
            ,height: '100%'
            ,id: properties.id
            ,bgcolor: properties.bgcolor
            ,wmode: properties.wmode
            ,flashvars: queryvals.flashvars
            ,allowfullscreen: properties.allowfullscreen
            //,flash6: url
            ,flash8: url
            ,appenddiv: appenddiv
        };

        // Add entry for this application 
        if (embed[properties.id]) alert('Warning: an app with the id: ' + properties.id + ' already exists.'); 
        var app = embed[properties.id] = embed.applications[properties.id] = { 
            runtime: 'swf'
            ,_id: properties.id
            ,appenddiv: appenddiv
            ,setCanvasAttribute: embed._setCanvasAttributeSWF
            ,getCanvasAttribute: embed._getCanvasAttributeSWF
            ,callMethod: embed._callMethodSWF
            ,_ready: embed._ready
            // List of functions to call when the app is loaded
            ,_onload: []
            ,_getSWFDiv: embed._getSWFDiv
            ,loaded: false
            ,_sendMouseWheel: embed._sendMouseWheel
            ,_sendAllKeysUp: embed._sendAllKeysUpSWF
            ,_setCanvasAttributeDequeue: embed._setCanvasAttributeDequeue
            ,_sendPercLoad: embed._sendPercLoad
            ,setGlobalFocusTrap: embed.__setGlobalFocusTrapSWF
        }
        // listen for history unless properties.history == false
        if (properties.history == false) {
            embed.history.active = false;
        }
        // for callbacks onload
        embed.dojo.addLoadedListener(embed._loaded, app);
        embed.dojo.setSwf(swfargs, minimumVersion);
        appenddiv.style.height = embed.CSSDimension(properties.height);
        appenddiv.style.width = embed.CSSDimension(properties.width);
        if (properties.cancelmousewheel != true && 
            (embed.browser.OS == 'Mac' || 
            // fix for LPP-7677
            embed.browser.OS == 'Windows')) {
            // fix for LPP-5393, commented out because we're always on for Windows
            // ((swfargs.wmode == 'transparent' || swfargs.wmode == 'opaque') && embed.browser.OS == 'Windows' && (embed.browser.isOpera || embed.browser.isFirefox)))) {
            if (embed['mousewheel']) {
                embed.mousewheel.setCallback(app, '_sendMouseWheel');
            }
        }
        if ((swfargs.wmode == 'transparent' || swfargs.wmode == 'opaque') && embed.browser.OS == 'Windows' && (embed.browser.isOpera || embed.browser.isFirefox)) {
            // fix for LPP-7724
            var div = swfargs.appenddiv;
            div.onmouseout = function(e) {
                div.mouseisoutside = true;
            }
            div.onmouseover = function(e) {
                div.mouseisoutside = false;
            }
            //embed.attachEventHandler(document, 'mouseup', div, '_gotmouseup');
            div._gotmouseup = document.onmouseup = function(e) {
                if (div.mouseisoutside) {
                    // tell flash that the button went up outside
                    app.callMethod('LzMouseKernel.__mouseUpOutsideHandler()');
                    //console.log('mouseup ', embed[app._id]);
                }
            }
        }
    }

    ,__swfSetAppAppendDivStyle: function (appid, property, value) {
      // Get the enclosing div
      var appenddiv = lz.embed.applications[appid].appenddiv;
      return appenddiv.style[property] = value;
    }

    ,/**
     * Write &lt;script/> tags into the document at the location where this 
     * function is called to load the LFC.  Must be called before lz.embed.dhtml().
     *
     * @param url:String url to LFC
     * @param serverroot:String Base URL to load resources from. 
     */
    lfc: function (url, serverroot) {
        // Default serverroot to "." if an empty string is supplied
        if (serverroot == '') {
            serverroot = '.';
        } else if (! serverroot || typeof serverroot != 'string') {
            alert('WARNING: lz.embed.lfc() requires a valid serverroot to be specified.'); 
            return;
        }
        lz.embed.options.serverroot = serverroot;
        if (lz.embed.browser.isIE) {
            var scripturl = serverroot + 'lps/includes/excanvas.js';
            this.__dhtmlLoadScript(scripturl)
            if (lz.embed.browser.version < 7) {
              // load chrome frame
              this.__dhtmlLoadScript('http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js');
            }
        }
        this.__dhtmlLoadScript(url)
    }

    ,/**
     * Write &lt;script/> tags into the document at the location
     * where this function is called to load the LZX Application.
     *
     * @param properties:Object properties used to write the dhtml, e.g. 
     * {url: 'myapp.lzx?lzt=swf', bgcolor: '#000000', width: '800', height: '600', id: 'dhtmlapp', history: true/false}
     *
     * An 'approot' can be supplied in properties, which points to the
     * application root directory. This is used in the case that the
     * HTML wrapper page comes from a different directory than the
     * application.
     *
     * Setting cancelkeyboardcontrol to true disables application activation to
     * prevent the application from grabbing mousewheel events and keyboard 
     * events for tab, arrow and enter keys.
     * 
     * Set skipchromeinstall property to skip prompts to install the chrome 
     * frame in IE 6.
     * 
     * Set usemastersprite property true to use a single sprite resource when 
     * possible
     * 
     * Note: lz.embed.lfc() must have already been called to load the
     * LFC.
     */
    dhtml: function (properties) {
        /*
        if (window.LzCanvas == null) {
            alert('Warning: lz.embed.lfc() must be called before lz.embed.dhtml() to load the LFC.');
            return;
        }*/
        var queryvals = this.__getqueryurl(properties.url, true);

        // allow query string options to override properties hash values
        for (var i in queryvals.options) {
            var v = queryvals.options[i];
            if (v != null) {
                //console.log('overriding property "' + i + '" to "' + v + '", was "' + properties[i] + '"');
                properties[i] = v;
            }
        }
        var url = queryvals.url + '?lzt=object&' + queryvals.query;

        var appenddiv = lz.embed._getAppendDiv(properties.id, properties.appenddivid);
        if (! properties.skipchromeinstall && lz.embed.browser.isIE && lz.embed.browser.version < 7) {
          // This will fail for the dev console in IE 6 - see LPP-8687
          if (window['CFInstall']) {
            // detect and install chrome frame
            CFInstall.check({onmissing:function(){appenddiv.style.display = 'none'},oninstall:function(){window.location=window.location}});
          }
        }
        // NOTE: [2009-08-24 ptw] We set the embed width/height to
        // 100% and the appenddiv to the desired size, so the platform
        // can adjust the appenddiv size to effect a dynamic canvas
        appenddiv.style.height = lz.embed.CSSDimension(properties.height);
        appenddiv.style.width = lz.embed.CSSDimension(properties.width);

        // use global default options hash for now
        var options = lz.embed.options;
        if (properties.cancelkeyboardcontrol) {
            options.cancelkeyboardcontrol = properties.cancelkeyboardcontrol;
        }
        if (properties.serverroot) {
            options.serverroot = properties.serverroot;
        }
        if (properties.approot != null && typeof(properties.approot) == "string") {
            options.approot = properties.approot;
        }
        if (properties.usemastersprite != null) {
            options.usemastersprite = properties.usemastersprite;
        }

        // properties read by root sprite
        lz.embed.__propcache = {
            bgcolor: properties.bgcolor
            ,width: properties.width
            ,height: properties.height
            ,id: properties.id
            ,appenddiv: lz.embed._getAppendDiv(properties.id, properties.appenddivid)
            ,url: url
            ,options: options
        };

        if (lz.embed[properties.id]) alert('Warning: an app with the id: ' + properties.id + ' already exists.'); 
        // Add entry for this application 
        var app = lz.embed[properties.id] = lz.embed.applications[properties.id] = { 
            runtime: 'dhtml'
            ,_id: properties.id
            ,_ready: lz.embed._ready
            ,_onload: []
            ,loaded: false
            ,setCanvasAttribute: lz.embed._setCanvasAttributeDHTML
            ,getCanvasAttribute: lz.embed._getCanvasAttributeDHTML
            ,callMethod: lz.embed._callMethodDHTML
            ,_sendAllKeysUp: lz.embed._sendAllKeysUpDHTML
        }
        // listen for history unless properties.history == false
        if (properties.history == false) {
            lz.embed.history.active = false;
        }

        if (properties.cancelmousewheel == true) {
            lz.embed.mousewheel.setEnabled(false);
        }
        this.__dhtmlLoadLibrary(url)
        // Make sure we have focus (see LPP-8242)
        if (lz.embed.browser.OS == 'Windows' && lz.embed.browser.isFirefox) { window.focus(); }
    }
    ,/** A hash of applications installed on the page keyed by id */
    applications: {}

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
        var options = {};
        var re = new RegExp('\\+', 'g');
        for (var i in queryvals) {
            if (i == '' || i == null) continue;

            var v = queryvals[i];

            // add lps vars to query string
            if (i == 'lzr' || i == 'lzt'
                || i == 'debug' || i == 'profile' || i == 'lzbacktrace' || i =='lzconsoledebug'
                || i == 'lzdebug' || i == 'lzkrank' || i == 'lzprofile' || i == 'lzcopyresources'
                || i == 'fb' || i == 'sourcelocators' || i == '_canvas_debug'
                || i == 'lzsourceannotations') {
                query += i + '=' + v + '&';
            }
            
            // process query args into options, coercing to booleans as needed
            if (i == 'lzusemastersprite' || i == 'lzskipchromeinstall' || i == 'lzcancelkeyboardcontrol' || i == 'lzcancelmousewheel' || i == 'lzhistory' || i == 'lzaccessible') {
                options[i.substring(2)] = v == 'true';
            }
            // deal with noon-boolean query args
            if (i == 'lzapproot' || i == 'lzserverroot' || i == 'lzwmode') {
                options[i.substring(2)] = v;
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

        return {url: url, flashvars: flashvars, query: query, options: options};
    }

    ,/** @access private */
    __parseQuery: function(s) {
        // parses a query string into name/value pairs
        if (s.indexOf('=') == -1) return;
        var p = s.split('&');
        var d = {};
        for (var i = 0; i < p.length; i++) {
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
     * Sets an attribute on the canvas of an embedded SWF application 
     *
     * @param name:String name of the property to set
     *
     * @param value:String value to set the property to
     *
     * @param hist:Boolean value - if true, add a history event.
     */
    _setCanvasAttributeSWF: function (name, value, hist) {
        //console.log('_setCanvasAttributeSWF', name, value, hist);
        if (this.loaded && lz.embed.dojo.comm[this._id] && lz.embed.dojo.comm[this._id]['callMethod']) {
            if (hist) {
                lz.embed.history._store(name, value);
            } else {
                lz.embed.dojo.comm[this._id].setCanvasAttribute(name, value + '');
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
            lz.embed.history._store(name, value);
        } else if (canvas) {
#pragma "passThrough=true"
            canvas.setAttribute(name, value);
        }
    }
    ,/** @access private */
    // called by flash/js 
    _loaded: function (id) {
        //console.log('_loaded', id);
        if (lz.embed[id].loaded) return;
        if (lz.embed.dojo.info.commVersion == 8) {
            // wait a bit longer for Flash to init
            setTimeout('lz.embed["'+ id +'"]._ready.call(lz.embed["'+ id +'"])', 100);
        } else {
            lz.embed[id]._ready.call(lz.embed[id]);
        }
    }
    ,/** @access private */
    _setCanvasAttributeDequeue: function () {
        while (this._setCanvasAttributeQ.length > 0) {
            var a = this._setCanvasAttributeQ.pop();
            this.setCanvasAttribute(a[0], a[1], a[2]);
        }
    }
    ,/** @access private called on canvas init */
    _ready: function (cref) {
        this.loaded = true;
        if (this._callmethod) {
            for (var i = 0; i < this._callmethod.length; i++) {
                this.callMethod(this._callmethod[i]);
            }
            this._callmethod = null;
        }
        if (this._setCanvasAttributeQ) {
            this._setCanvasAttributeDequeue();
        }
        if (cref) this.canvas = cref;
        // call list of functions in _onload array
        for (var i = 0; i < this._onload.length; i++) {
            var f = this._onload[i];
            if (typeof f == 'function') f(this);
        }
        //console.log('_ready', this, this.onload);
        // for backward compatibility and simplicity
        if (this.onload && typeof this.onload == 'function') {
            //alert('onload');
            this.onload(this);
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
            return lz.embed.dojo.comm[this._id].getCanvasAttribute(name);
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

    ,/** 
       * Browser detection object, with flags set for most browsers.  Includes the boolean properties isFirefox, isOpera, isSafari, isChrome isIphone and isIE.  The version property contains the version number of the browser.
       * @devnote adapted from http://www.quirksmode.org/js/detect.html 
       */
    browser: {
        init: function () {
            if (this.initted) return;
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent)
                || this.searchVersion(navigator.appVersion)
                || "an unknown version";
            this.osversion = this.searchOSVersion(navigator.userAgent) || "an unknown osversion";
            this.subversion = this.searchSubVersion(navigator.userAgent)
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
            this.initted = true;
            // set defaults
            this.isNetscape = this.isSafari = this.isOpera = this.isFirefox = this.isIE = this.isIphone = this.isChrome = false;
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
            } else if (this.browser == 'iPhone') {
                this.isSafari = true;
                this.isIphone = true;
            } else if (this.browser == 'Chrome') {
                this.isChrome = true;
            }
        },
        searchString: function (data) {
            for (var i=0;i<data.length;i++)    {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                this.osversionSearchString = data[i].osversionSearch || "";
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
        searchSubVersion: function (dataString) {
            var re = new RegExp(this.versionSearchString + '.\\d+\\.\\d+\\.([\\d.]+)');
            var match = re.exec(dataString);
            if (match && match.length > 1) return parseFloat(match[1]);
        },
        searchOSVersion: function (dataString) {
            var index = dataString.indexOf(this.osversionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index+this.osversionSearchString.length+1));
        },
        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: "iPhone",
                identity: "iPhone",
                versionSearch: "WebKit"
            },
            {
                string: navigator.userAgent,
                subString: "Chrome",
                identity: "Chrome",
                versionSearch: "WebKit"
            },
            {   string: navigator.userAgent,
                subString: "OmniWeb",
                versionSearch: "OmniWeb/",
                identity: "OmniWeb"
            },
            {
                string: navigator.vendor,
                subString: "Apple",
                identity: "Safari",
                // NOTE: [20090522 anba] quirksmode uses here "Version" to get
                // the Safari version number, but we want to have the WebKit
                // version number
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
            {
                string: navigator.vendor,
                subString: "Camino",
                identity: "Camino"
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
                versionSearch: "MSIE",
                osversionSearch: "Windows NT"
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
                   string: navigator.userAgent,
                   subString: "iPhone",
                   identity: "iPhone/iPod"
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
            return lz.embed.dojo.comm[this._id].callMethod(js);
        } else {
            // add to a private queue
            if (! this._callmethod) this._callmethod = [];
            this._callmethod.push(js);
        }
    }
    ,/**
     * Calls a method with optional arguments in an embedded DHTML application 
     * and returns the result.   
     *
     * @param js:String javascript to call in the form 'foo.bar.methodcall(arg1,arg2,...)'
     */
    _callMethodDHTML: function (js) {
        if (this.loaded) {
            return eval(js);
        } else {
            // add to a private queue
            if (! this._callmethod) this._callmethod = [];
            this._callmethod.push(js);
        }
    }
    ,/** @access private */
    _broadcastMethod: function(methodname) {
        var args = [].slice.call(arguments, 1);
        for (var i in lz.embed.applications) {
            var app = lz.embed.applications[i];
            if (app[methodname]) {
                //console.log(methodname, app, arguments);
                app[methodname].apply(app, args);
            }
        }
    }
    ,setCanvasAttribute: function(name, value, history) {
        lz.embed._broadcastMethod('setCanvasAttribute', name, value, history);
    }
    ,callMethod: function(js) {
        lz.embed._broadcastMethod('callMethod', js);
    }
    ,/** @access private */
    _getAppendDiv: function(id, appenddivid) {
        var divid = appenddivid ? appenddivid : id + 'Container';
        var root = document.getElementById(divid);
        if (! root) {
            root = document.createElement('div');
            this.__setAttr(root, 'id', divid);
            // insert after the first script tag found...
            var scripts = document.getElementsByTagName('script');
            var lastscript = scripts[scripts.length-1];
            if (! lastscript) {
                document.body.appendChild(root);
            } else {
                lastscript.parentNode.insertBefore(root, lastscript.nextSibling );
            }
        } else {
            // clear its contents
            root.innerHTML = '';
        }
        return root;
    }
    ,/** @access private */
    _getSWFDiv: function() {
        return lz.embed.dojo.obj[this._id].get();
    }
    ,/** @access private */
    _sendMouseWheel: function(d) {
        if (d != null) this.callMethod("lz.Keys.__mousewheelEvent(" + d + ")"); 
    }
    ,/** @access private */
    _gotFocus: function() {
        lz.embed._broadcastMethod('_sendAllKeysUp');
    }
    ,/** @access private */
    _sendAllKeysUpSWF: function () {
        this.callMethod("lz.Keys.__allKeysUp()");
    }
    ,/** @access private */
    _sendAllKeysUpDHTML: function () {
        // How to deal with multiple DHTML apps on a page?
        if (lz['Keys'] && lz.Keys['__allKeysUp']) {
            lz.Keys.__allKeysUp();
        }
    }
    ,/** @access private */
    _sendPercLoad: function(p) {
        //alert('onpercload' + p);
        if (this.onloadstatus && typeof this.onloadstatus == 'function') {
            this.onloadstatus(p);
        }
    }

    ,/**
     * Utility method for attaching DOM events
     *
     * @param eventscope:Object Scope to register the event, e.g. window 
     * @param eventname:String Event name to register in eventscope, e.g. 'load'
     * @param callbackscope:Object Scope to receive the callback
     * @param callbackname:String Method name to receive callback in callbackscope
     */
    attachEventHandler: function(eventscope, eventname, callbackscope, callbackname, closure) {
        if (! (callbackscope && callbackname
                && typeof callbackscope[callbackname] == 'function')) {
            return;
        }
        var s = eventscope + eventname + callbackscope + callbackname;
        var h = this._handlers[s];
        if (h != null) {
            if (h instanceof Array) {
                for (var i = h.length - 1; i >= 0; --i) {
                    if (h[i].$e === eventscope && h[i].$c === callbackscope) {
                        // handler is already attached
                        return;
                    }
                }
            } else {
                if (h.$e === eventscope && h.$c === callbackscope) {
                    // handler is already attached
                    return;
                }
            }
        }
        var handler = function() {
            var a = window.event ? [window.event] : [].slice.call(arguments, 0);;
            if (closure) a.push(closure);
            callbackscope[callbackname].apply(callbackscope, a);
        }
        handler.$e = eventscope;
        handler.$c = callbackscope;
        if (h != null) {
            if (h instanceof Array) {
                h.push(handler);
            } else {
                h = [h, handler];
            }
        } else {
            h = handler;
        }
        this._handlers[s] = h;
        if(eventscope['addEventListener']) {
            eventscope.addEventListener(eventname, handler, false);
            return true;
        } else if(eventscope['attachEvent']) {
            return eventscope.attachEvent("on" + eventname, handler);
        } 
    }
    ,/**
     * Utility method for removing DOM events
     *
     * @param eventscope:Object Scope to register the event, e.g. window 
     * @param eventname:String Event name to register in eventscope, e.g. 'load'
     * @param callbackscope:Object Scope to receive the callback
     * @param callbackname:String Method name to receive callback in callbackscope
     */
    removeEventHandler: function(eventscope, eventname, callbackscope, callbackname) {
        var s = eventscope + eventname + callbackscope + callbackname;
        var handler, h = this._handlers[s];
        if (h != null) {
            if (h instanceof Array) {
                for (var i = h.length - 1; i >= 0; --i) {
                    if (h[i].$e === eventscope && h[i].$c === callbackscope) {
                        handler = h[i];
                        h.splice(i, 1);
                        if (h.length == 0) {
                            delete this._handlers[s];
                        }
                    }
                }
            } else if (h.$e === eventscope && h.$c === callbackscope) {
                handler = h;
                delete this._handlers[s];
            }
        }
        if (! handler) {
            // handler not found
            return;
        }
        if(eventscope['removeEventListener']) {
            eventscope.removeEventListener(eventname, handler, false);
            return true;
        } else if(eventscope['detachEvent']) {
            return eventscope.detachEvent("on" + eventname, handler);
        } 
    }
    ,/** @access private */
    _handlers: {} 
    ,/** @access private */
    _cleanupHandlers: function() {
        lz.embed._handlers = {};
        //alert('_cleanupHandlers');
    }
    ,/**
     * Utility method for finding the absolute position of a div (formerly from dhtml/LzSprite.js).  Returns a hash of x/y values.
     *
     * @param el:div Div to find position of.
     */
    getAbsolutePosition: function(el) {
        var parent = null;
        var pos = {};
        var box;

        if (!(lz.embed.browser.isFirefox && el == document.body) && el.getBoundingClientRect ) { // IE and FF3
            box = el.getBoundingClientRect();
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            return {x: Math.floor(box.left + scrollLeft), y: Math.floor(box.top + scrollTop)};
        } else if (document.getBoxObjectFor) { // gecko
            box = document.getBoxObjectFor(el);
            pos = {x: box.x, y: box.y};
        } else { // safari/opera
            pos = {x: el.offsetLeft, y: el.offsetTop};
            parent = el.offsetParent;
            if (parent != el) {
                while (parent) {
                    pos.x += parent.offsetLeft;
                    pos.y += parent.offsetTop;
                    parent = parent.offsetParent;
                }
            }

            // look up computed style for Safari
            if (lz.embed.browser.isSafari && document.defaultView && document.defaultView.getComputedStyle) {
                var styles = document.defaultView.getComputedStyle(el, '');
            }
                
            // opera & (safari absolute) incorrectly account for body offsetTop
            // used quirks.absolute_position_accounts_for_offset before...
            if ( lz.embed.browser.isOpera || (lz.embed.browser.isSafari && styles && styles['position'] == 'absolute' ) ) {
                pos.y -= document.body.offsetTop;
            }
        }

        if (el.parentNode) {
            parent = el.parentNode;
        } else {
            return pos;
        }

        while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
            pos.x -= parent.scrollLeft;
            pos.y -= parent.scrollTop;

            if (parent.parentNode) {
                parent = parent.parentNode;
            } else {
                return pos;
            }
        } 
        return pos;
    }
    ,/**
      * Utility method for creating CSS dimensions with appropriate
      * units.  See lfc/kernel/LzKernelUtils#LZCSSDimension
      */
    CSSDimension: function (value, units) {
        var result = value;
        if (isNaN(value)) {
            // Don't perturb % values
            if (value.indexOf('%') == (value.length - 1) &&
                (! isNaN(value.substring(0, value.length - 1)))) {
                return value;
            } else {
                result = 0;
            }
        } else if (value === Infinity) {
            result = (~0>>>1);
        } else if (value === -Infinity) {
            result = ~(~0>>>1);
        }
        return result + (units ? units : 'px');
    }

    ,/** @access private 
         called by LzKeyboardKernel.setGlobalFocusTrap() to keep the swf 
         focused.  Generally only needed when accessibility is on.  */
    __setGlobalFocusTrapSWF: function(isfocused) {
        //LPP-7593
        var div = this._getSWFDiv();
        if (isfocused) {
            div.onblur = function() { div.focus() }
        } else {
            div.onblur = null;
        }
    }
};

// init browser detection
lz.embed.browser.init();

// Clean up global handlers
lz.embed.attachEventHandler(window, 'beforeunload', lz.embed, '_cleanupHandlers');

// Notice that you got focus
lz.embed.attachEventHandler(window, 'focus', lz.embed, '_gotFocus');
if (lz.embed.browser.isIE) {
  lz.embed.attachEventHandler(window, 'activate', lz.embed, '_gotFocus');
}
