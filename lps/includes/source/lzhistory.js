/**
  * @topic Browser
  * @subtopic Integration
  * @access public
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  * Use is subject to license terms.
  */

Lz.history = {
    _currentstate: null 
    ,init: function() {
        Lz.__BrowserDetect.init();
        Lz.history._currentstate = Lz.history.get();
        if (Lz.__BrowserDetect.isSafari) {
            // must track state ourselves...
            Lz.history._historylength = history.length;
            Lz.history._history = [];
            for (var i = 1; i < Lz.history._historylength; i++) {
                Lz.history._history.push('');
            }
            Lz.history._history.push(Lz.history._currentstate);
            var form = document.createElement('form');
            form.method = 'get';
            document.body.appendChild(form);
            Lz.history._form = form;
            if (! top.document.location.lzaddr) {
                top.document.location.lzaddr = {};
            }
            if (top.document.location.lzaddr.history) {
                Lz.history._history = top.document.location.lzaddr.history.split(',');
            }
        } else if (Lz.__BrowserDetect.isIE) {
            // use an iframe;
            var i = document.createElement('iframe');
            Lz.__setAttr(i, 'id', 'lzHistory');
            Lz.__setAttr(i, 'border', 0);
            document.body.appendChild(i);
            i.style.position = 'absolute';
            i.style.display = 'none';
            i.style.left = '-1000px';
            Lz.history._iframe = document.getElementById('lzHistory');
            var doc = Lz.history._iframe.contentWindow.document;
            doc.open();
            doc.close();
            if (Lz.history._currentstate != '') doc.location.hash = '#' + Lz.history._currentstate;
        }
        if (Lz.history._currentstate != '') Lz.history._parse(Lz.history._currentstate)
        //alert('init');
        setInterval('Lz.history._checklocationhash()', 100)
    }

    ,/** @access private */
    _historyEvent: function (value) {
        if (dojo.flash.ready) {
            //alert(value);
            dojo.flash.comm.receiveHistory(value + '');
            return true;
        } else {
            //alert('dojo.flash is not ready: _historyEvent' + value);
        }
    }

    ,/** @access private */
    _checklocationhash: function() {
        if (dojo.flash && dojo.flash.info && dojo.flash.info.installing) return;
        if (Lz.__BrowserDetect.isSafari) {
            var h = this._history[this._historylength - 1];
            if (h == '') h = '#0';
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
                    top.location.hash = '#' + h;
                    this._currentstate = h;
                    this._parse(h);
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
        if (Lz.history._currentstate == s) return;
        Lz.history._currentstate = s;

        var hash = '#' + s;

        if (Lz.__BrowserDetect.isIE) {
            top.location.hash = hash;
            var doc = Lz.history._iframe.contentWindow.document;
            doc.open();
            doc.close();
            doc.location.hash = hash;
            Lz.history._parse(s + '');
        } else if (Lz.__BrowserDetect.isSafari) {
            // can't preserve query strings :(
            Lz.history._form.action = hash;
            top.document.location.lzaddr.history = Lz.history._history.toString();
            Lz.history._skip = true;
            Lz.history._history[history.length] = hash;
            Lz.history._historylength = history.length + 1;
            Lz.history._form.submit()
            Lz.history._skip = false;
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
        // TODO: send events to all apps
        if (h.length == 0 || h == this._lasthash) return;
        //alert('_parse '+ h);
        if (h.indexOf('_lz') != -1) {
            // TODO: use rison
            this._lasthash = h;
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
            //history id
            if (Lz.history._historyEvent(h)) {
                // if successful, don't send again 
                this._lasthash = h;
            }
            if (Lz.__dhtmlhistoryready && LzHistory && LzHistory['receiveHistory']) {
                //alert(h);
                LzHistory.receiveHistory(h);
                this._lasthash = h;
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
};
window.onload = Lz.history.init;
