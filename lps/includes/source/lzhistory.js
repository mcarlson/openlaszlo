/**
  * @topic Browser
  * @subtopic Integration
  * @access public
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  * Use is subject to license terms.
  */

Lz.history = {
    _currentstate: null 
    ,init: function() {
        var _this = Lz.history;
        _this._title = top.document.title;
        Lz.__BrowserDetect.init();
        var currstate = _this.get();
        if (Lz.__BrowserDetect.isSafari) {
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
        } else if (Lz.__BrowserDetect.isIE) {
            var currstate = top.location.hash;
            if (currstate) currstate = currstate.substring(1);
            // use an iframe;
            var i = document.createElement('iframe');
            Lz.__setAttr(i, 'id', 'lzHistory');
            Lz.__setAttr(i, 'frameborder', 'no');
            Lz.__setAttr(i, 'scrolling', 'no');
            Lz.__setAttr(i, 'width', '0');
            Lz.__setAttr(i, 'height', '0');
            Lz.__setAttr(i, 'src', 'javascript:""');
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
        setInterval('Lz.history._checklocationhash()', 100)
    }

    ,/** @access private */
    _checklocationhash: function() {
        if (dojo.flash && dojo.flash.info && dojo.flash.info.installing) return;
        if (Lz.__BrowserDetect.isSafari) {
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
            var h = Lz.history.get();
            // Make sure initial history event is sent even if the hash is empty
            if (h == '') h = '0';

            if (Lz.__BrowserDetect.isIE) {
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
        if (dojo.flash.obj && Lz.loaded) {
            var p = dojo.flash.obj.get();
            if (p) {
                var cid = p.GetVariable("_callbackID");
                if (cid != 'null') return;
                var val = p.GetVariable("_currenthistory");
                if (val && val != 'null' && val != Lz.history._lasthash) {
                    //alert('val ' + val);
                    Lz.history._lasthash = val;
                }
            }
        }
    }
    ,/** */
    set: function(s) {
        if (s == null) s = '';
        if (Lz.history._currentstate == s) return;
        Lz.history._currentstate = s;

        var hash = '#' + s;

        if (Lz.__BrowserDetect.isIE) {
            top.location.hash = hash == '#0' ? '' : hash;
            var doc = Lz.history._iframe.contentDocument || Lz.history._iframe.contentWindow.document;
            doc.open();
            doc.close();
            doc.location.hash = hash;
            Lz.history._parse(s + '');
        } else if (Lz.__BrowserDetect.isSafari) {
            Lz.history._history[history.length] = hash;
            Lz.history._historylength = history.length + 1;
            if (Lz.__BrowserDetect.version < 412) {
                // can't preserve query strings :( do nothing if there is one.
                if (top.location.search == '') {
                    Lz.history._form.action = hash;
                    top.document.location.lzaddr.history = Lz.history._history.toString();
                    Lz.history._skip = true;
                    Lz.history._form.submit()
                    Lz.history._skip = false;
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
            Lz.history._parse(s + '');
        }
        return true;
    }
    ,/** */
    get: function() {
        var h = '';
        if (Lz.__BrowserDetect.isIE) {
            if (Lz.history._iframe) {
                var doc = Lz.history._iframe.contentDocument || Lz.history._iframe.contentWindow.document;
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
        var _this = Lz.history;
        // TODO: send events to all apps
        if (h.length == 0 || h == _this._lasthash) return;
        if (Lz.loaded && h.indexOf('_lz') != -1) {
            // TODO: use rison
            _this._lasthash = h;
            h = h.substring(3);
            var a = h.split(',');
            for (var j = 0; j < a.length; j++) {
                var v = a[j];
                var i = v.indexOf('=');
                var name = unescape(v.substring(0, i));
                var val = unescape(v.substring(i + 1));
                Lz.setCanvasAttribute(name, val);
                if (window['canvas']) canvas.setAttribute(name, val);
            }
        } else {
            //alert('_parse test' + h + ', ' + _this._lasthash);
            //history id
            if (Lz.loaded && Lz.callMethod && h != Lz.history._lasthash) {
                _this.__setFlash(h);
            }
            if (window['LzHistory'] && LzHistory['isReady'] && LzHistory['receiveHistory']) {
                //alert('dhtml ' + h);
                LzHistory.receiveHistory(h);
                _this._lasthash = h;
            }
        }
    }
    ,/** @access private */
    _store: function(name, value) {
        if (name instanceof Array) {
            var o = '';
            for (var i = 0; i < name.length; i = i + 2) {
                o += escape(name[i]) + '=' + escape(name[i + 1]) +'';
                if (i < name.length - 2) o += ',';
            }
        } else {
            var o = escape(name) + '=' + escape(value) +'';
        }
        this.set('_lz' + o);
        //window.frames['_lzhist'].location = newurl;
    }
    ,/** @access private called from flash */
    __receivedhistory: function(h) {
        Lz.history._lasthash = h + '';
        //alert('__receivedhistory '+ Lz.history._lasthash);
    }
    ,/** @access private called from flash */
    __setFlash: function(h) {
        var p = dojo.flash.obj.get();
        if (p) {
            var cid = p.GetVariable("_callbackID") + '';
            if (cid == 'null') {
                Lz.callMethod("LzHistory.receiveHistory(" + h + ")");
            } else {
                setTimeout('Lz.history.__setFlash(' + h + ')', 10);
                //alert('busy');
            }
        }
    }
};
if (Lz.__BrowserDetect.isFirefox) {
    // If this is present, then Firefox does not do its Javascript caching and onload will get fired when coming back to the page.  Thanks Jes! 
    window.onunload = function() {};
}
