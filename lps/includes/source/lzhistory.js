/**
  * @topic Browser
  * @subtopic Integration
  * @access public
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
  * Use is subject to license terms.
  */

lz.embed.history = {
    active: null 
    ,_currentstate: null 
    ,_apps: []
    ,_intervalID: null
    ,_registeredapps: {}
    ,intervaltime: 200
    ,init: function() {
        var _this = lz.embed.history;
        if (_this.active || _this.active == false) return;
        _this.active = true;
        //console.log('init', _this._apps);
        _this._title = top.document.title;
        var currstate = _this.get();
        var browser = lz.embed.browser;
        // fine in Safari 3.0.4
        if (browser.isSafari && browser.version < 523.10) {
            // must track state ourselves...
            _this._historylength = history.length;
            _this._history = [];
            for (var i = 1; i < _this._historylength; i++) {
                _this._history.push('');
            }
            _this._history.push(currstate);
            var form = document.createElement('form');
            form.method = 'get';
            document.body.appendChild(form);
            form.style.display = 'none';
            _this._form = form;
            if (! top.document.location.lzaddr) {
                top.document.location.lzaddr = {};
            }
            if (top.document.location.lzaddr.history) {
                _this._history = top.document.location.lzaddr.history.split(',');
            }
            if (currstate != '') {
                _this.set(currstate)
            }
        } else if (browser.isIE) {
            var currstate = top.location.hash;
            if (currstate) currstate = currstate.substring(1);
            // use an iframe;
            var i = document.createElement('iframe');
            lz.embed.__setAttr(i, 'id', 'lzHistory');
            lz.embed.__setAttr(i, 'frameborder', 'no');
            lz.embed.__setAttr(i, 'scrolling', 'no');
            lz.embed.__setAttr(i, 'width', '0');
            lz.embed.__setAttr(i, 'height', '0');
            lz.embed.__setAttr(i, 'src', 'javascript:""');
            document.body.appendChild(i);
            i = document.getElementById('lzHistory');
            _this._iframe = i;
            i.style.display = 'none';
            i.style.position = 'absolute';
            i.style.left = '-999px';
            var doc = i.contentDocument || i.contentWindow.document;
            doc.open();
            doc.close();
            //alert('currstate ' + currstate);
            if (currstate != '') {
                doc.location.hash = '#' + currstate;
                _this._parse(currstate)
            }
        } else {
            if (currstate != '') {
                _this._parse(currstate)
                _this._currentstate = currstate;
            }
        }
        //alert('init ' + currstate);
        if (_this._intervalID != null) {
            clearInterval(_this._intervalID);
        }
        if (_this.intervaltime > 0) {
            _this._intervalID = setInterval('lz.embed.history._checklocationhash()', _this.intervaltime)
        }
    }
    ,listen: function(apporid) {
        if (typeof apporid == 'string') {
            //console.log('looking for', apporid, lz.embed.applications);
            apporid = lz.embed.applications[apporid];
            if (! apporid || ! apporid.runtime) {
                //console.log('no app found', apporid);
                return
            }
        }
        if (! apporid) return;
        var _this = lz.embed.history;
        if (_this._registeredapps[apporid._id]) {
            //console.log('already listening', apporid);
            return;
        }
        // Store a reference to the app
        _this._registeredapps[apporid.id] = true;
        _this._apps.push(apporid);
        //console.log('listening', apporid, lz.embed.history._apps);
        _this.init();
    }
    ,/** @access private */
    _checklocationhash: function() {
        var lzembed = lz.embed;
        if (lzembed.dojo && lzembed.dojo.info && lzembed.dojo.info.installing) return;
        if (lzembed.browser.isSafari && lzembed.browser.version < 523.10) {
            // fine in Safari 3.0.4
            var h = this._history[this._historylength - 1];
            if (h == '' || h == '#') h = '#0';
            if (!this._skip && this._historylength != history.length) {
                this._historylength = history.length;
                if (typeof h != 'undefined') {
                    h = h.substring(1)
                    this._currentstate = h;
                    this._parse(h);
                }
                //alert('back or forward' + h);
            } else {
                this._parse(h.substring(1));
            }
        } else {
            var h = lzembed.history.get();
            // Make sure initial history event is sent even if the hash is empty
            if (h == '') h = '0';

            if (lzembed.browser.isIE) {
                if (h != this._currentstate) {
                    top.location.hash = h == '0' ? '' : '#' + h;
                    this._currentstate = h;
                    this._parse(h);
                }
                if (top.document.title != this._title) {
                    top.document.title = this._title;
                }
            } else {
                this._currentstate = h;
                this._parse(h);
            }
        }
    }
    ,/** */
    set: function(s) {
        var lzembed = lz.embed;
        if (lzembed.history.active == false) return;
        if (s == null) s = '';
        if (lzembed.history._currentstate == s) return;
        lzembed.history._currentstate = s;

        var hash = '#' + s;

        if (lzembed.browser.isIE) {
            top.location.hash = hash == '#0' ? '' : hash;
            var doc = lzembed.history._iframe.contentDocument || lzembed.history._iframe.contentWindow.document;
            doc.open();
            doc.close();
            doc.location.hash = hash;
            lzembed.history._parse(s + '');
        } else if (lzembed.browser.isSafari && lzembed.browser.version < 523.10) {
            // fine in Safari 3.0.4
            lzembed.history._history[history.length] = hash;
            lzembed.history._historylength = history.length + 1;
            if (lzembed.browser.version < 412) {
                // can't preserve query strings :( do nothing if there is one.
                if (top.location.search == '') {
                    lzembed.history._form.action = hash;
                    top.document.location.lzaddr.history = lzembed.history._history.toString();
                    lzembed.history._skip = true;
                    lzembed.history._form.submit()
                    lzembed.history._skip = false;
                }
            } else {
                var evt = document.createEvent('MouseEvents');
                evt.initEvent('click', true, true);
                var anchor = document.createElement('a');
                anchor.href = hash;
                anchor.dispatchEvent(evt);
            }
        } else {
            top.location.hash = hash;
            lzembed.history._parse(s + '');
        }
        return true;
    }
    ,/** */
    get: function() {
        var h = '';
        if (lz.embed.browser.isIE) {
            if (lz.embed.history._iframe) {
                var doc = lz.embed.history._iframe.contentDocument || lz.embed.history._iframe.contentWindow.document;
                h = doc.location.hash;
            }
        } else {
            h = top.location.href;
        }
        //alert(h);
        var index = h.indexOf('#');
        if (index != -1) {
            return h.substring(index + 1);
        }
        return '';
    }
    ,/** @access private */
    _parse: function(h) {
        var _this = lz.embed.history;
        if (h.length == 0) return;
        for (var id=0, len=lz.embed.history._apps.length; id<len; id++) {
            var app = lz.embed.history._apps[id];
            if (! app.loaded || app._lasthash == h) continue;
            //console.log('sending for app', app._id, h);
            app._lasthash = h;
            if (h.indexOf('_lz') != -1) {
                // TODO: use rison
                h = h.substring(3);
                var a = h.split(',');
                for (var j = 0; j < a.length; j++) {
                    var v = a[j];
                    var i = v.indexOf('=');
                    var name = unescape(v.substring(0, i));
                    var val = unescape(v.substring(i + 1));
                    lz.embed.setCanvasAttribute(name, val);
                    if (window['canvas']) canvas.setAttribute(name, val);
                }
            } else {
            //console.log('_parse test' + h + ', ' + _this._lasthash, app);
            //history id
                if (app.runtime == 'swf') {
                    _this.__setFlash(h, app._id);
                } else if (window['lz'] && lz['History'] && lz.History['isReady'] && lz.History['receiveHistory']) {
                    //console.log('dhtml ' + h);
                    lz.History.receiveHistory(h);
                }
            }
        }
    }
    ,/** @access private */
    _store: function(name, value) {
        if (name instanceof Object) {
            var o = '';
            for (var i in name) {
                if (o != '') o += ',';
                o += escape(i) + '=' + escape(name[i]);
            }
        } else {
            var o = escape(name) + '=' + escape(value);
        }
        this.set('_lz' + o);
        //console.log(o);
        //window.frames['_lzhist'].location = newurl;
    }
    ,/** @access private called from history mechanism */
    __setFlash: function(h, id) {
        var app = lz.embed[id];
        if (app && app.loaded && app.runtime == 'swf') {
            var p = app._getSWFDiv();
            if (p) {
                /*
                // for swf6/7 communications, to prevent trampling callbacks.
                var cid = p.GetVariable("_callbackID") + '';
                if (cid == 'null') {
                */    

                var result = app.callMethod("lz.History.receiveHistory(" + h + ")");
                //console.log('__setFlash', h, result, app);
                //fails in swf9 - see LPP-7008 
                //app._lasthash = result;
                //Assume all went well in swf.
                app._lasthash = h;

                /*
                } else {
                    setTimeout('lz.embed.history.__setFlash(' + h + ',"' + id + '")', 10);
                //alert('busy');
                }
                */
            }
        }
    }
};
if (lz.embed.browser.isFirefox) {
    // If this is present, then Firefox does not do its Javascript caching and onload will get fired when coming back to the page.  Thanks Jes! 
    window.onunload = function() {};
}
