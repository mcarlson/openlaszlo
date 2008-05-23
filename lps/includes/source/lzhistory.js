/**
  * @topic Browser
  * @subtopic Integration
  * @access public
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  * Use is subject to license terms.
  */

lz.embed.history = {
    _currentstate: null 
    ,_apps: []
    ,_intervalID: null
    ,init: function(app) {
        var _this = lz.embed.history;
        // Store a reference to the app
        _this._apps.push(app);
        //console.log('init', _this._apps);
        _this._title = top.document.title;
        var currstate = _this.get();
        if (lz.embed.browser.isSafari) {
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
        } else if (lz.embed.browser.isIE) {
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
        if (this._intervalID == null) this._intervalID = setInterval('lz.embed.history._checklocationhash()', 100)
    }

    ,/** @access private */
    _checklocationhash: function() {
        if (lz.embed.dojo && lz.embed.dojo.info && lz.embed.dojo.info.installing) return;
        if (lz.embed.browser.isSafari) {
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
            var h = lz.embed.history.get();
            // Make sure initial history event is sent even if the hash is empty
            if (h == '') h = '0';

            if (lz.embed.browser.isIE) {
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
        if (s == null) s = '';
        if (lz.embed.history._currentstate == s) return;
        lz.embed.history._currentstate = s;

        var hash = '#' + s;

        if (lz.embed.browser.isIE) {
            top.location.hash = hash == '#0' ? '' : hash;
            var doc = lz.embed.history._iframe.contentDocument || lz.embed.history._iframe.contentWindow.document;
            doc.open();
            doc.close();
            doc.location.hash = hash;
            lz.embed.history._parse(s + '');
        } else if (lz.embed.browser.isSafari) {
            lz.embed.history._history[history.length] = hash;
            lz.embed.history._historylength = history.length + 1;
            if (lz.embed.browser.version < 412) {
                // can't preserve query strings :( do nothing if there is one.
                if (top.location.search == '') {
                    lz.embed.history._form.action = hash;
                    top.document.location.lzaddr.history = lz.embed.history._history.toString();
                    lz.embed.history._skip = true;
                    lz.embed.history._form.submit()
                    lz.embed.history._skip = false;
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
            lz.embed.history._parse(s + '');
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
        for (var id in lz.embed.history._apps) {
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
            //alert('_parse test' + h + ', ' + _this._lasthash);
            //history id
                if (app.runtime == 'swf') {
                    _this.__setFlash(h, app._id);
                } else if (window['LzHistory'] && LzHistory['isReady'] && LzHistory['receiveHistory']) {
                    //console.log('dhtml ' + h);
                    LzHistory.receiveHistory(h);
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
                //console.log('__setFlash', h, app, id, p);
                var cid = p.GetVariable("_callbackID") + '';
                if (cid == 'null') {
                    lz.embed[id]._lasthash = app.callMethod("LzHistory.receiveHistory(" + h + ")");
                } else {
                    setTimeout('lz.embed.history.__setFlash(' + h + ',"' + id + '")', 10);
                //alert('busy');
                }
            }
        }
    }
};
if (lz.embed.browser.isFirefox) {
    // If this is present, then Firefox does not do its Javascript caching and onload will get fired when coming back to the page.  Thanks Jes! 
    window.onunload = function() {};
}
