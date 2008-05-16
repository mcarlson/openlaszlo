/**
  * @topic Browser
  * @subtopic Integration
  * @access public
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
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
 *     Lz.swfEmbed({url: '<replaceable>myapp.lzx</replaceable>?lzt=swf', bgcolor: '#000000', width: '<replaceable>800</replaceable>', height: '<replaceable>600</replaceable>'});
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
 * And of course DHTML embedding uses the <code>Lz.dhtmlEmbed</code> call instead of <code>Lz.swfEmbed</code>.
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
            url += '&lzr=swf8';
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
        if (Lz[properties.id]) alert('Warning: an app with the id: ' + properties.id + ' already exists.'); 
        var app = Lz[properties.id] = Lz.applications[properties.id] = { 
            runtime: 'swf'
            ,_id: properties.id
            ,setCanvasAttribute: Lz._setCanvasAttributeSWF
            ,getCanvasAttribute: Lz._getCanvasAttributeSWF
            ,callMethod: Lz._callMethodSWF
            ,_ready: Lz._ready
            // List of functions to call when the app is loaded
            ,_onload: []
            ,_getSWFDiv: Lz._getSWFDiv
            ,loaded: false
            ,_sendMouseWheel: Lz._sendMouseWheel
            ,_setCanvasAttributeDequeue: Lz._setCanvasAttributeDequeue
        }
        // listen for history unless properties.history == false
        if (properties.history != false) {
            app._onload.push(Lz.history.init);
        }
        // for callbacks onload
        dojo.flash.addLoadedListener(Lz._loaded, app);
        dojo.flash.setSwf(swfargs, minimumVersion);
        Lz.__BrowserDetect.init();
        if (Lz.__BrowserDetect.OS == 'Mac' || 
            // fix for LPP-5393
            ((swfargs.wmode == 'transparent' || swfargs.wmode == 'opaque') && Lz.__BrowserDetect.OS == 'Windows' && (Lz.__BrowserDetect.isOpera || Lz.__BrowserDetect.isFirefox))) {
            LzMousewheelKernel.setCallback(app, '_sendMouseWheel');
        }
    }

    ,/**
     * Write &lt;script/> tags into the document at the location where this 
     * function is called to load the LFC.  Must be called before dhtmlEmbed().
     *
     * @param url:String url to LFC
     */
    dhtmlEmbedLFC: function (url) {
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
     * LFC.  If dhtmlEmbedLFC has not been called or the browser-check 
     * did not pass, this call will not load the application.
     */
    dhtmlEmbed: function (properties) {
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

        if (Lz[properties.id]) alert('Warning: an app with the id: ' + properties.id + ' already exists.'); 
        // Add entry for this application 
        var app = Lz[properties.id] = Lz.applications[properties.id] = { 
            runtime: 'dhtml'
            ,_id: properties.id
            ,_ready: Lz._ready
            ,_onload: []
            ,loaded: false
            ,setCanvasAttribute: Lz._setCanvasAttributeDHTML
            ,getCanvasAttribute: Lz._getCanvasAttributeDHTML
        }
        // listen for history unless properties.history == false
        if (properties.history != false) {
            app._onload.push(Lz.history.init);
        }

        this.__dhtmlLoadScript(url)
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
        if (this.loaded && dojo.flash.comm[this._id] && dojo.flash.comm[this._id]['callMethod']) {
            if (hist) {
                Lz.history._store(name, value);
            } else {
                dojo.flash.comm[this._id].setCanvasAttribute(name, value + '');
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
    _loaded: function (id) {
        //console.log('_loaded', id);
        if (Lz[id].loaded) return;
        if (dojo.flash.info.commVersion == 8) {
            // wait a bit longer for Flash to init
            setTimeout('Lz["'+ id +'"]._ready.call(Lz["'+ id +'"])', 100);
        } else {
            Lz[id]._ready.call(Lz[id]);
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
            return dojo.flash.comm[this._id].getCanvasAttribute(name);
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
            return dojo.flash.comm[this._id].callMethod(js);
        } else {
            var f = function() {
                dojo.flash.comm[this._id].callMethod(js);
            };
            dojo.flash.addLoadedListener(f, this);
            //console.log('addlistener', this, f);
        }
    }
    ,/** @access private */
    _broadcastMethod: function(methodname) {
        var args = [].slice.call(arguments, 1);
        for (var i in Lz.applications) {
            var app = Lz.applications[i];
            if (! app.loaded) continue;
            if (app[methodname]) {
                //console.log(methodname, app, arguments);
                app[methodname].apply(app, args);
            }
        }
    }
    ,setCanvasAttribute: function(name, value, history) {
        Lz._broadcastMethod('setCanvasAttribute', name, value, history);
    }
    ,callMethod: function(js) {
        Lz._broadcastMethod('callMethod', js);
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
    _getSWFDiv: function() {
        return dojo.flash.obj[this._id].get();
    }
    ,/** @access private */
    _sendMouseWheel: function(d) {
        if (d != null) this.callMethod("LzKeys.__mousewheelEvent(" + d + ")"); 
    }
    ,/**
     * Utility method for attaching DOM events
     *
     * @param eventscope:Object Scope to register the event, e.g. window 
     * @param eventname:String Event name to register in eventscope, e.g. 'load'
     * @param callbackscope:Object Scope to receive the callback
     * @param callbackname:String Method name to receive callback in callbackscope
     */
    attachEventHandler: function(eventscope, eventname, callbackscope, callbackname) {
        if (! callbackscope || !callbackname || !callbackscope[callbackname]) {
            return;
        }
        var s = eventscope + eventname + callbackscope + callbackname;
        var handler = function() {
            var a = window.event ? [window.event] : arguments;
            callbackscope[callbackname].apply(callbackscope, a);
        }
        this._handlers[s] = handler;
        //alert('add '+ s);
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
        var handler = this._handlers[s];
        //console.log('remove', this._handlers);
        this._handlers[s] = null;
        if (! handler) return;
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
        Lz._handlers = {};
        //alert('_cleanupHandlers');
    }
};
Lz.attachEventHandler(window, 'beforeunload', Lz, '_cleanupHandlers');
