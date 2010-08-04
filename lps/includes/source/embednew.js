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
     * upgrade to if necessary.  Defaults to 10.1 for security reasons.
     */
    ,swf: function (properties, minimumVersion) {
        var embed = lz.embed;
        // Upgrade to flash player 10.1 for security reasons
        if (minimumVersion == null) minimumVersion = 10.1;

        if (! properties.id) {
            // Generate a unique ID
            properties.id = 'lzapp' + Math.round(Math.random() * 1000000);
        }

        var url = properties.url;
        var queryvals = embed.__getqueryurl(url);

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

        var options = embed.options;
        if (properties.cancelkeyboardcontrol) {
            options.cancelkeyboardcontrol = properties.cancelkeyboardcontrol;
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

        // make app schema
        var app = { 
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
            ,_setCanvasAttributeQ: []
            ,_sendPercLoad: embed._sendPercLoad
            ,setGlobalFocusTrap: embed.__setGlobalFocusTrapSWF
            ,initargs: queryvals.initargs
        }

        // Add entry for this application 
        if (embed.applications[properties.id]) alert('Warning: an app with the id: ' + properties.id + ' already exists.'); 
        embed[properties.id] = embed.applications[properties.id] = app;

        // listen for history unless properties.history == false
        if (properties.history == false) {
            embed.history.active = false;
        }

        var flashjsurl = embed.getServerRoot() + 'flash.js'
        if (! embed.jsloaded[flashjsurl]) {
            // load flash.js
            var callback = function() {
                // flash.js is now loaded, proceed to embed the application
                lz.embed._setSWF(url, app, swfargs, properties, minimumVersion);
            }
            embed.loadJSLib(flashjsurl, callback);
        } else {
            embed._setSWF(url, app, swfargs, properties, minimumVersion);
        }
    }

    /**
     * Calls the dojo.flash utility functions to embed the application,
     * requires flash.js to work
     * @access private
     */
    ,_setSWF: function (url, app, swfargs, properties, minimumVersion) {
        var embed = lz.embed;
        var options = embed.options;
        var appenddiv = swfargs.appenddiv;
        // for onload callbacks
        embed.dojo.addLoadedListener(embed._loaded, app);
        embed.dojo.setSwf(swfargs, minimumVersion);
        appenddiv.style.height = embed.CSSDimension(properties.height);
        appenddiv.style.width = embed.CSSDimension(properties.width);
        if (properties.cancelmousewheel != true) {
            // On for all runtimes - see LPP-8912, LPP-7677 and LPP-5393
            // fix for LPP-5393, commented out because we're always on for Windows
            // ((swfargs.wmode == 'transparent' || swfargs.wmode == 'opaque') && embed.browser.OS == 'Windows' && (embed.browser.isOpera || embed.browser.isFirefox)))) {
            if (embed['mousewheel']) {
                embed.mousewheel.setCallback(app, '_sendMouseWheel');
            }
        }
        if ((swfargs.wmode == 'transparent' || swfargs.wmode == 'opaque') && embed.browser.OS == 'Windows' && (embed.browser.isOpera || embed.browser.isFirefox)) {
            // fix for LPP-7724
            appenddiv.onmouseout = function(e) {
                appenddiv.mouseisoutside = true;
            }
            appenddiv.onmouseover = function(e) {
                appenddiv.mouseisoutside = false;
            }
            //embed.attachEventHandler(document, 'mouseup', appenddiv, '_gotmouseup');
            // TODO: [20100730 anba] 'document.onmouseup'? Consider the case of multiple apps!
            appenddiv._gotmouseup = document.onmouseup = function(e) {
                if (appenddiv.mouseisoutside) {
                    // tell flash that the button went up outside
                    app.callMethod('lz.GlobalMouse.__mouseUpOutsideHandler()');
                    //console.log('mouseup ', embed[app._id]);
                }
            }
        }
        // workaround for tabbing outside app in IE in swf9/10 - LPP-8712
        if (embed.browser.isIE && url.indexOf('swf8') == -1 && ! options.cancelkeyboardcontrol) {
            // TODO: [20100730 anba] 'document.onkeydown'? Consider the case of multiple apps!
            document.onkeydown = function(e) {
                if (!e) e = window.event;
                if (e.keyCode == 9) {
                    // forward to keyboard handler
                    app.callMethod('lz.Keys.__browserTabEvent(' + e.shiftKey + ')');
                    // Don't allow the browser to process tab keys
                    return false;
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
        var embed = lz.embed;
        embed.options.serverroot = serverroot;
        if (embed.browser.isIE) {
            // warn if excanvas isn't included
            if (! window['G_vmlCanvasManager']) {
                alert('WARNING: excanvas.js was not loaded, and is required for IE DHTML.  Please ensure your HTML wrapper has a script include in the <head></head>, e.g. <!--[if IE]><script type="text/javascript" src="' + serverroot + 'lps/includes/excanvas.js"></script><![endif]-->"'); 
            }
            if (embed.browser.version < 7) {
              // load chrome frame
              embed.loadJSLib('http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js');
            }
        }
        // TODO: [20100730 anba] maybe change to 'embed.jsloaded[url] !== void', in order
        // to prevent the case lfc() is called multiple times while the lfc is loading?
        if (! embed.jsloaded[url]) {
            var callback = function() {
                //console.log('loaded', url);
                var embed = lz.embed;
                embed.lfcloaded = true;
                var queue = embed.__appqueue;
                embed.__appqueue = [];
                if (queue.length) {
                    for (var i = 0, l = queue.length; i < l; i++) {
                        embed.loadJSLib(queue[i]);
                    }
                }
            }
            embed.loadJSLib(url, callback);
        } else {
            alert('WARNING: lz.embed.lfc() should only be called once.');
        }
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
        var embed = lz.embed;
        if (embed.dhtmlapploaded) {
            // TODO: generate an iframe
            alert('Warning: skipping lz.embed.dhtml() call for ' + properties.url + '. Only one DHTML application can be loaded per window.  Use iframes to load more than one DHTML application.');
            return;
        }

        if (! properties.id) {
            // Generate a unique ID
            properties.id = 'lzapp' + Math.round(Math.random() * 1000000);
        }

        var queryvals = embed.__getqueryurl(properties.url);

        // allow query string options to override properties hash values
        for (var i in queryvals.options) {
            var v = queryvals.options[i];
            if (v != null) {
                //console.log('overriding property "' + i + '" to "' + v + '", was "' + properties[i] + '"');
                properties[i] = v;
            }
        }
        var url = queryvals.url + '?lzt=object&' + queryvals.query;

        var appenddiv = embed._getAppendDiv(properties.id, properties.appenddivid);
        if (! properties.skipchromeinstall && embed.browser.isIE && embed.browser.version < 7) {
          // This will fail for the dev console in IE 6 - see LPP-8687
          if (window['CFInstall']) {
            // detect and install chrome frame
            CFInstall.check({onmissing:function(){appenddiv.style.display = 'none'},oninstall:function(){window.location=window.location}});
          }
        }
        // NOTE: [2009-08-24 ptw] We set the embed width/height to
        // 100% and the appenddiv to the desired size, so the platform
        // can adjust the appenddiv size to effect a dynamic canvas
        appenddiv.style.height = embed.CSSDimension(properties.height);
        appenddiv.style.width = embed.CSSDimension(properties.width);

        // use global default options hash for now
        var options = embed.options;
        if (properties.cancelkeyboardcontrol) {
            options.cancelkeyboardcontrol = properties.cancelkeyboardcontrol;
        }
        if (properties.serverroot != null) {
            options.serverroot = properties.serverroot;
        }
        if (properties.approot != null && typeof(properties.approot) == "string") {
            options.approot = properties.approot;
        }
        if (properties.usemastersprite != null) {
            options.usemastersprite = properties.usemastersprite;
        }

        // properties read by root sprite
        embed.__propcache = {
            bgcolor: properties.bgcolor
            ,width: properties.width
            ,height: properties.height
            ,id: properties.id
            ,appenddiv: embed._getAppendDiv(properties.id, properties.appenddivid)
            ,url: url
            ,options: options
        };

        if (embed[properties.id]) alert('Warning: an app with the id: ' + properties.id + ' already exists.'); 
        // Add entry for this application 
        var app = embed[properties.id] = embed.applications[properties.id] = { 
            runtime: 'dhtml'
            ,_id: properties.id
            ,_ready: embed._ready
            ,_onload: []
            ,loaded: false
            ,setCanvasAttribute: embed._setCanvasAttributeDHTML
            ,getCanvasAttribute: embed._getCanvasAttributeDHTML
            ,_setCanvasAttributeDequeue: embed._setCanvasAttributeDequeue
            ,_setCanvasAttributeQ: []
            ,callMethod: embed._callMethodDHTML
            ,_sendAllKeysUp: embed._sendAllKeysUpDHTML
            ,initargs: queryvals.initargs
        }
        // listen for history unless properties.history == false
        if (properties.history == false) {
            embed.history.active = false;
        }

        // explicitly say whether we want the mousewheel enabled
        embed.mousewheel.setEnabled(! properties.cancelmousewheel);
        // Make sure we have focus (see LPP-8242)
        if (embed.browser.OS == 'Windows' && embed.browser.isFirefox) { window.focus(); }

        if (! embed.lfcloaded) {
            embed.__appqueue.push(url);
            if (properties.lfcurl) {
                embed.lfc(properties.lfcurl, options.serverroot);
            } else if (embed.lfcloaded != null) {
                // can't warn here because of the dev console :(
                //alert('WARNING: lz.embed.dhtml() requires an LFC to be loaded, either with a call to lz.embed.lfc(url, serverroot) or by specifying the lfcurl property in the call to lz.embed.dhtml().'); 
            }
        } else {
            embed.dhtmlapploaded = true;
            embed.loadJSLib(url)
        }
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

    // jsloaded[url] is false while loading, true after load
    ,jsloaded: {}
    // array of callbacks for each url
    ,jscallbacks: {}
    // handler executed when a library is loaded
    ,loadJSLibHandler: function (url) {
        var embed = lz.embed;
        // update loader state
        embed.jsloaded[url] = true;
        // execute callbacks
        var callbacks = embed.jscallbacks[url] || [];
        delete embed.jscallbacks[url];
        for (var i = 0, len = callbacks.length; i < len; ++i) {
            callbacks[i]();
        }
    }
    // Loads a JS library from the specified URL.
    ,loadJSLib: function (url, callback) {
        var embed = lz.embed;
        if (callback) {
            // add callback to queue if defined
            (embed.jscallbacks[url] || (embed.jscallbacks[url] = [])).push(callback);
        }
        // If we're already loading or library already loaded, return early
        if (embed.jsloaded[url] !== void 0) return;
        embed.jsloaded[url] = false;
        //console.log('loading', url);
        var script = document.createElement('script');
        embed.__setAttr(script, 'type', 'text/javascript');
        embed.__setAttr(script, 'defer', 'defer');
        // prefer adding scripts to the body - it's better for performance
        var addto = document.getElementsByTagName("body")[0] || document.getElementsByTagName("head")[0]
        if (script.readyState){ //IE 
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){ 
                    script.onreadystatechange = null;
                    embed.loadJSLibHandler(url);
                    // prevent memory leaks in IE
                    addto.removeChild( script );
                }
            }
        } else { //Others 
            script.onload = function(){
                script.onload = null;
                embed.loadJSLibHandler(url);
            }
        }

        embed.__setAttr(script, 'src', url);
        addto.appendChild(script);
    }

    ,getServerRoot: function () {
        if (lz.embed.__serverroot) return lz.embed.__serverroot;
        var el = document.getElementsByTagName("script");
        var baseurl;
        for (var i = 0, l = el.length; i < l; i++) {
            // find base path for embed-compressed.js
            var src = el[i].src;
            var j = src && src.indexOf('embed-compressed.js');
            if (j && j > -1) {
                baseurl = src.substring(0, j);
                break;
            }
        }
        lz.embed.__serverroot = baseurl;
        return baseurl;
    }
    ,/** @access private */
    __getqueryurl: function (url) {
        // strip query string to only args required by the compiler
        // return 'flashvars' property args not required by LPS

        // TODO Henry: We need to ask the canvas info what the value of the debug flag really is. Don't just trust the query arg, since it can be overriden by the canvas attributes.

        var sp = url.split('?');
        url = sp[0];
        if (sp.length == 1) return {url: url, flashvars: '', query: '', initargs: {}};

        var queryvals = lz.embed.__parseQuery(sp[1]);
        var query = '';
        var flashvars = '';
        var options = {};
        // track init args for LzBrowserKernel.getInitArgs()
        var initargs = {};
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
            // deal with non-boolean query args
            if (i == 'lzapproot' || i == 'lzserverroot' || i == 'lzwmode') {
                options[i.substring(2)] = v;
            }

            if (initargs[i] == null) {
                // only the first copy of an arg should be added
                initargs[i] = unescape(v.replace(re, ' '));
            }

            // store for passing in via flashvars
            flashvars += i + '=' + v + '&';
        }
        query = query.substr(0, query.length - 1);
        flashvars = flashvars.substr(0, flashvars.length - 1);

        return {url: url, flashvars: flashvars, query: query, options: options, initargs: initargs};
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
        var embed = lz.embed;
        //console.log('_setCanvasAttributeSWF', name, value, hist);
        if (this.loaded && embed.dojo.comm[this._id] && embed.dojo.comm[this._id]['callMethod']) {
            if (hist) {
                embed.history._store(name, value);
            } else {
                embed.dojo.comm[this._id].setCanvasAttribute(name, value + '');
            }
        } else {
            this._setCanvasAttributeQ.push([name, value, hist]);
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
        if (this.loaded && canvas) {
            if (hist) {
                lz.embed.history._store(name, value);
            } else if (canvas) {
#pragma "passThrough=true"
                canvas.setAttribute(name, value);
            }
        } else {
            this._setCanvasAttributeQ.push([name, value, hist]);
        }
    }
    ,/** @access private */
    // called by flash/js 
    _loaded: function (id) {
        var embed = lz.embed;
        //console.log('_loaded', id);
        if (embed[id].loaded) return;
        if (embed.dojo.info.commVersion == 8) {
            // wait a bit longer for Flash to init
            setTimeout('lz.embed["'+ id +'"]._ready.call(lz.embed["'+ id +'"])', 100);
        } else {
            embed[id]._ready.call(embed[id]);
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
        if (this._setCanvasAttributeQ.length > 0) {
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
            } else if (this.browser == 'iPhone' || this.browser == 'iPad') {
                this.isSafari = true;
                this.isIphone = true;
            } else if (this.OS == 'Android') {
                this.isSafari = true;
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
                subString: "iPad",
                identity: "iPad",
                versionSearch: "WebKit"
            },
            {
                string: navigator.userAgent,
                subString: "Android",
                identity: "Android",
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
                string: navigator.userAgent,
                identity: "Opera",
                versionSearch: "Version"
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
                   identity: "iPhone/iPod/iPad"
            },
            {
                   string: navigator.userAgent,
                   subString: "iPad",
                   identity: "iPhone/iPod/iPad"
            },
            {
                   string: navigator.userAgent,
                   subString: "Android",
                   identity: "Android"
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
        var embed = lz.embed;
        var args = [].slice.call(arguments, 1);
        for (var i in embed.applications) {
            var app = embed.applications[i];
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
            // insert after the last script tag found:
            // In general, scripts are executed sequentially and scripts
            // block the execution of the rest of the page. That means the
            // last script tag is also the currently running script tag.
            // Big exception for this heuristic:
            // Deferred scripts (1) and dynamically added scripts (2), see loadJSLib()
            // (1) we're out of luck to find the executing script :-(
            // (2) use the last non-deferred script, because all loadJSLib() scripts are deferred
            var scripts = document.body.getElementsByTagName('script');
            for (var i = scripts.length - 1; i >= 0; --i) {
                var lastscript = scripts[i];
                if (! lastscript.defer) {
                    lastscript.parentNode.insertBefore(root, lastscript.nextSibling);
                    break;
                }
            }
            if (! root.parentNode) {
                // no matching script tag found, add div to body
                document.body.appendChild(root);
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
        // Set a timeout to ensure the app has time to load, see LPP-9106
        setTimeout("lz.embed._broadcastMethod('_sendAllKeysUp')", 1000);
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
        //console.log('_sendPercLoad', p);
        if (p < 100 && this.loaded) {
            this.loaded = false;
            lz.embed.resetloaded(this._id);
            //alert('onpercload' + p + ', ' + this);
        }
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
        var browser = lz.embed.browser;

        if (!(browser.isFirefox && el == document.body) && el.getBoundingClientRect ) { // IE and FF3
            if (! el.parentNode) {
                // IE throws 'Unspecified error' if an element isn't attached to the DOM - see LPP-8759
                return {x: 0, y:0};
            }
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
            if (browser.isSafari && document.defaultView && document.defaultView.getComputedStyle) {
                var styles = document.defaultView.getComputedStyle(el, '');
            }
                
            // opera & (safari absolute) incorrectly account for body offsetTop
            // used quirks.absolute_position_accounts_for_offset before...
            if ( browser.isOpera || browser.isSafari) { //&& styles && styles['position'] == 'absolute' ) ) {
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
    ,/** @access private 
         DHTML apps waiting for startup */
    __appqueue: []

    ,/**
       * Sets the browser window size.
       * @param String width: Width in pixels
       * @param String height: Height in pixels
       */
    resizeWindow: function (width, height) {
        if (width.indexOf('%') > -1) {
            width = null;
        } else {
            width = parseInt(width);
        }

        if (height.indexOf('%') > -1) {
            height = null;
        } else {
            height = parseInt(height);
        }

        // Cf. http://www.quirksmode.org/viewport/compatibility.html
        if (window.innerHeight) {
            // Sadly, innerHeight/Width is not r/w on some browsers, and resizeTo is for outerHeight/Width
            window.resizeTo(width ? (width + window.outerWidth - window.innerWidth) : window.outerWidth, height ? (height + window.outerHeight - window.innerHeight) : window.outerHeight);
        } else {
            // TODO: determine window offsets in IE
        }
    }
    ,/**
       * Called when the page is rereshed with current JS but Flash is reloaded.
       * See LPP-
       * @access private 
       */
    resetloaded: function(appid) {
        //alert('resetloaded: ' + lz.embed.iframemanager);
        //console.log('resetloaded');
        if (lz.embed.iframemanager && lz.embed.iframemanager.__reset) {
            lz.embed.iframemanager.__reset(appid);
        }
    }
};

// init browser detection
lz.embed.browser.init();

// Visual basic helper required to detect Flash Player ActiveX control 
// version information on Internet Explorer
if(lz.embed.browser.isIE){
    document.writeln('<script language="VBScript" type="text/vbscript">');
    document.writeln('Function VBGetSwfVer(i)');
    document.writeln('  on error resume next');
    document.writeln('  Dim swControl, swVersion');
    document.writeln('  swVersion = 0');
    document.writeln('  set swControl = CreateObject("ShockwaveFlash.ShockwaveFlash." + CStr(i))');
    document.writeln('  if (IsObject(swControl)) then');
    document.writeln('    swVersion = swControl.GetVariable("$version")');
    document.writeln('  end if');
    document.writeln('  VBGetSwfVer = swVersion');
    document.writeln('End Function');
    document.writeln('</script>');

    // Clean up global handlers
    lz.embed.attachEventHandler(window, 'beforeunload', lz.embed, '_cleanupHandlers');
    // Notice that you got focus
    lz.embed.attachEventHandler(window, 'activate', lz.embed, '_gotFocus');
}


// Notice that you got focus
lz.embed.attachEventHandler(window, 'focus', lz.embed, '_gotFocus');
