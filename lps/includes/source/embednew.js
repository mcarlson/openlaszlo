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
    /** A hash of options used by the embedding system.  Must be set 
     * resourceroot: the root url to load resources from
     * cancelkeyboardcontrol: if true, dhtml keyboard control is canceled
     * @access private 
     */
    options: {}
    /**
     * Writes the necessary HTML to embed a swf file in the document where the 
     * function is called.  
     *
     * @param properties:Object properties used to write the swf, e.g. 
     * {url: 'myapp.lzx?lzt=swf', bgcolor: '#000000', width: '800', height: '600', id: 'lzapp', accessible: 'true'}
     *
     * @param minimumVersion:Number the version the flash player should 
     * upgrade to if necessary.  Defaults to 8.
     */
    ,swf: function (properties, minimumVersion) {
        // don't upgrade flash unless asked
        if (minimumVersion == null) minimumVersion = 8;


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
        if (lz.embed.dojo.info.commVersion > requestVersion) {
            // This should no longer be needed in a world without swf7
            url = url.substring(0, i) + lz.embed.dojo.info.commVersion + url.substring(i + 1, url.length);
            //alert('updated version ' + url);
            minimumVersion = lz.embed.dojo.info.commVersion;
        } else if (lz.embed.dojo.info.commVersion <= 7 && requestVersion > 7) {
            // if requested lzr=swf8, set dojo comm version to 8
            lz.embed.dojo.info.commVersion = 8;
        }

        if (requestVersion > minimumVersion) {
            minimumVersion = requestVersion;
        }    

        //alert(requestVersion + ', ' + minimumVersion);

        var queryvals = this.__getqueryurl(url);

        if (properties.accessible == 'true') {
            queryvals.flashvars += '&accessible=true';
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

        var swfargs = { 
            width: properties.width + ''
            ,height: properties.height + ''
            ,id: properties.id
            ,bgcolor: properties.bgcolor
            ,wmode: properties.wmode
            ,flashvars: queryvals.flashvars
            ,flash6: url
            ,flash8: url
            ,appenddiv: lz.embed._getAppendDiv(properties.id, properties.appenddivid)
        };

        // Add entry for this application 
        if (lz.embed[properties.id]) alert('Warning: an app with the id: ' + properties.id + ' already exists.'); 
        var app = lz.embed[properties.id] = lz.embed.applications[properties.id] = { 
            runtime: 'swf'
            ,_id: properties.id
            ,setCanvasAttribute: lz.embed._setCanvasAttributeSWF
            ,getCanvasAttribute: lz.embed._getCanvasAttributeSWF
            ,callMethod: lz.embed._callMethodSWF
            ,_ready: lz.embed._ready
            // List of functions to call when the app is loaded
            ,_onload: []
            ,_getSWFDiv: lz.embed._getSWFDiv
            ,loaded: false
            ,_sendMouseWheel: lz.embed._sendMouseWheel
            ,_setCanvasAttributeDequeue: lz.embed._setCanvasAttributeDequeue
        }
        // listen for history unless properties.history == false
        if (properties.history == false) {
            lz.embed.history.active = false;
        } else {
            app._onload.push(lz.embed.history.init);
        }
        // for callbacks onload
        lz.embed.dojo.addLoadedListener(lz.embed._loaded, app);
        lz.embed.dojo.setSwf(swfargs, minimumVersion);
        if (properties.cancelmousewheel != true && 
            (lz.embed.browser.OS == 'Mac' || 
            // fix for LPP-5393
            ((swfargs.wmode == 'transparent' || swfargs.wmode == 'opaque') && lz.embed.browser.OS == 'Windows' && (lz.embed.browser.isOpera || lz.embed.browser.isFirefox)))) {
            if (lz.embed['mousewheel']) {
                lz.embed.mousewheel.setCallback(app, '_sendMouseWheel');
            }
        }
    }

    ,/**
     * Write &lt;script/> tags into the document at the location where this 
     * function is called to load the LFC.  Must be called before lz.embed.dhtml().
     *
     * @param url:String url to LFC
     * @param resourceroot:String Base URL to load resources from. 
     */
    lfc: function (url, resourceroot) {
        if (! resourceroot || typeof resourceroot != 'string' || resourceroot == '') {
            alert('WARNING: lz.embed.lfc() requires a valid resourceroot to be specified.'); 
            return;
        }
        lz.embed.options.resourceroot = resourceroot;
        if (lz.embed.browser.isIE) {
            var scripturl = resourceroot + 'lps/includes/excanvas.js';
            this.__dhtmlLoadScript(scripturl)
        }
        if ((lz.embed.browser.isIE && lz.embed.browser.version < 7) || (lz.embed.browser.isSafari && lz.embed.browser.version <= 419.3)) {
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
     * {url: 'myapp.lzx?lzt=swf', bgcolor: '#000000', width: '800', height: '600', id: 'dhtmlapp'}
     *
     * DHTML adds support for the cancelkeyboardcontrol option.  Setting cancelkeyboardcontrol to true will prevent the application from grabbing keyboard events for tab, arrow and enter keys, and disables application activation.
     * 
     * Note: lz.embed.lfc() must have already been called to load the
     * LFC.
     */
    dhtml: function (properties) {
        var queryvals = this.__getqueryurl(properties.url, true);
        var url = queryvals.url + '?lzt=object&' + queryvals.query;

        lz.embed.__propcache = {
            bgcolor: properties.bgcolor
            ,width: properties.width.indexOf('%') == -1 ? properties.width + 'px' : properties.width
            ,height: properties.height.indexOf('%') == -1 ? properties.height + 'px' : properties.height
            ,id: properties.id
            ,appenddiv: lz.embed._getAppendDiv(properties.id, properties.appenddivid)
            ,url: url
            ,cancelkeyboardcontrol: properties.cancelkeyboardcontrol
            ,resourceroot: properties.resourceroot
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
        }
        // listen for history unless properties.history == false
        if (properties.history == false) {
            lz.embed.history.active = false;
        } else {
            app._onload.push(lz.embed.history.init);
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
       * Browser detection object, with flags set for most browsers.  Includes the boolean properties isFirefox, isOpera, isSafari and isIE.  The version property contains the version number of the browser.
       * @devnote adapted from http://www.quirksmode.org/js/detect.html 
       */
    browser: {
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
            return lz.embed.dojo.comm[this._id].callMethod(js);
        } else {
            var f = function() {
                lz.embed.dojo.comm[this._id].callMethod(js);
            };
            lz.embed.dojo.addLoadedListener(f, this);
            //console.log('addlistener', this, f);
        }
    }
    ,/** @access private */
    _broadcastMethod: function(methodname) {
        var args = [].slice.call(arguments, 1);
        for (var i in lz.embed.applications) {
            var app = lz.embed.applications[i];
            if (! app.loaded) continue;
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
            document.writeln('<div id="' + divid + '"></div>');
            root = document.getElementById(divid);
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
            return {x: box.left + scrollLeft, y: box.top + scrollTop};
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

            // opera & (safari absolute) incorrectly account for body offsetTop
            // used quirks.absolute_position_accounts_for_offset before...
            if ( (lz.embed.browser.isSafari || lz.embed.browser.isOpera) && this.hasOwnProperty('getStyle') && this.getStyle(el, 'position') == 'absolute' ) {
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
};

// init browser detection
lz.embed.browser.init();

// Clean up global handlers
lz.embed.attachEventHandler(window, 'beforeunload', lz.embed, '_cleanupHandlers');

// for backward compatibility
#pragma "passThrough=true"
try {
    if (lzOptions) {
        if (lzOptions.dhtmlKeyboardControl) alert('WARNING: this page uses lzOptions.dhtmlKeyboardControl.  Please use the cancelkeyboardcontrol embed argument for lz.embed.dhtml() instead.'); 
        if (lzOptions.ServerRoot) alert('WARNING: this page uses lzOptions.ServerRoot.  Please use the second argument of lz.embed.lfc() instead.'); 
    }
} catch (e) {
}
