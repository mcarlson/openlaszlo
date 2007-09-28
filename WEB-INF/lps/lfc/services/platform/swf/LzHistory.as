/**
  *
  * @copyright Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzhistory
  * @access public
  * @topic LFC
  * @subtopic Events
  */

/**
  * <p>NOTE: You must load your lzx with the lzt=history wrapper HTML to use LzHistory.</p>
  * <p>The LzHistory service manages interaction with the browser history and back button.  Save state as often as you like, and advance the
  *  history when a new 'page' of values is required.</p>
  * 
  * <example extract="false"><programlisting>
  * &lt;form&gt;
  *     &lt;input type="button" value="0" onclick="lzSetCanvasAttribute('foo', 0)"/&gt; 
  *     &lt;input type="button" value="1" onclick="lzSetCanvasAttribute('foo', 1)"/&gt; 
  * &lt;/form&gt;
  * </programlisting></example>
  *
  * @shortdesc Manages interaction with the browser history and back button.
  */

var LzHistory = new Object;

/**
  * true if history system is ready (for 3.x compatibility)
  */
LzHistory.isReady = true;

/**
  * @access private
  */
LzHistory.__setHistory = function(s) {
    //Debug.write('__setHistory', s);
    LzBrowser._jsreset();
    LzBrowser.callJS('Lz.history.set', null, s);
}

/**
  * @access private
  */
LzHistory.getPersist = function(n) {
    return SharedObject.getLocal(n);
}

LzHistory.persist = false;

// The current offset (zero-based) in the history value stack. 
LzHistory.offset = 0;
/** @access private */
LzHistory.__lzdirty = false;
/** @access private */
LzHistory.__lzhistq = [];
/** @access private */
LzHistory.__lzcurrstate = {};

DeclareEvent(LzHistory, 'onoffset' );

/**
  * @access private
  */
LzHistory.receiveHistory = function(o){
    if (this.persist && ! this._persistso) {
        this.__initPersist();
    }
    var l = this.__lzhistq.length;
    o *= 1;
    if (! o) {
        o = 0;
    } else if (o > l - 1) {
        o = l;
    }

    var h = this.__lzhistq[o];
    for (var u in h) {
        var obj = h[u];
        //Debug.write('restoring state ', global[obj], obj, obj.n, obj.v);
        global[u].setAttribute(obj.n, obj.v);
    }

    this.offset = o;
    //Debug.write('onhistory ', o, this.__lzhistq);
    if (this.onoffset.ready) this.onoffset.sendEvent(o);
    LzBrowser.callJS('Lz.history.__receivedhistory', false, o + '');
}

/**
  * @access private
  */
LzHistory.receiveEvent = function(n, v){
    //Debug.write('got event', n, v);
    canvas[n] = v;
    if (canvas['on' + n].ready) canvas['on' + n].sendEvent(v);
}

/**
  * @access private
  */
LzHistory.getCanvasAttribute = function(n){
    return canvas[n];
}    

/**
  * @access private
  */
LzHistory.setCanvasAttribute = LzHistory.receiveEvent;

/**
  * @access private
  */
LzHistory.callMethod = function(js) { 
    if (LzBrowser.__jslocked) LzBrowser._jsreset();
    var scope = canvas;
    //Debug.write('callMethod', js);
    var s = js.indexOf('(')
    if (s != -1) {
        var e = js.indexOf(')')
        var args = (js.substring(s + 1, e)).split(',');
        js = js.substring(0, s);
    }

    var path = js.split('.');
    for (var i = 0; i < path.length; i++) {
        var n = path[i];
        if (i == 0 && ! scope[n]) {
            // look in global scope if canvas lookup fails
            scope = global;
        }
        var lastscope = scope;
        scope = scope[n];
        //Debug.write('found', n, 'in scope', scope);  
    }

    // cast arguments to type
    for (var i = 0; i < args.length; i++) {
        var a = args[i];

        // strip whitespace
        while (a.charAt(0) == ' ') {
            a = a.substring(1, a.length);
        }

        var n = parseFloat(a);
        if (! isNaN(n)) {
            //number
            args[i] = n;
            //Debug.write('found number', args[i], a);
        } else if (a.indexOf("'") != -1) {
            // TODO - handle "
            var s = a.indexOf("'") + 1;
            var e = a.lastIndexOf("'");
            args[i] = a.substring(s, e);
            //Debug.write('found string', args[i], a);
        } else if (a == 'true' || a == 'false'){
            args[i] = a == 'true';
            //Debug.write('found boolean', args[i], a);
        } else if (lastscope[a]) {
            args[i] = lastscope[a];
            //Debug.write('found property', args[i], a);
        }
    }

    //Debug.write('found scope', scope, 'args', args, 'for path', path);  
    return scope.apply(lastscope, args);
}

/**
  * Saves a value and attribute name callback in the current offset of the 
  * history stack.  When the browser back button causes the history offset 
  * to change, the attribute will get set to the value saved at that offset,
  * e.g. scope.setAttribute('attribute_name_to_set', value). 
  */
LzHistory.save = function(who, prop, val) {
    if (typeof who != 'string') {
        if (who['id']) who = who['id'];
        if ($debug) Debug.warn('Warning: LzHistory.save() requires a view ID to be passed in as a string for the first argument.');
    }
    // strip off __ so keys can be listed
    if (val == null) val = global[who][prop];
    this.__lzcurrstate[who] = {n: prop, v: val};
    this.__lzdirty = true;
    //Debug.write('set state of ',who,' to ', this.__lzcurrstate);
}

/**
  * @access private
  * Commits all registered values to the history stack at the current offset.
  * Must be called to commit registered values.  Called automatically by 
  * next and prev. 
  */
LzHistory.commit = function() {
    if (! this.__lzdirty) return;
    this.__lzhistq[this.offset] = this.__lzcurrstate;
    
    //Debug.write('Stored state ', this.__lzcurrstate, out);
    this.__lzhistq.length = this.offset + 1;
    
    if (this.persist) {
        if (! this._persistso) {
            this.__initPersist();
        }
        //Debug.write('_persistso: ', this._persistso);
        this._persistso.data[this.offset] = this.__lzcurrstate;
        //this._persistso.flush();
    }
    
    this.__lzcurrstate = {};
    this.__lzdirty = false;
    //Debug.write('save', this.__lzhistq.length - 1, this.__lzhistq);
}

/**
  * @access private
  */
LzHistory.move = function(by) {
    this.commit();
    if (! by) by = 1;
    var o = this.offset + by;
    if (0 >= o) o = 0;
    //Debug.write('Move to: ', o);
    if (this.__lzhistq.length >= o) {
        //Debug.write('move', o, this.__lzhistq.length, this.__lzhistq);
        //this.offset = o;
        this.__setHistory(o);
    }
}

/**
  * Step back one step in the history stack.  Adds an item to the browser history
  * stack. 
  */
LzHistory.next = function() {
    this.move(1);
}

/**
  * Step forward one step in the history stack.  Adds an item to the  browser history
  * stack. 
  */
LzHistory.prev = function() {
    this.move(-1);
}

/** @access private */
LzHistory.__initPersist = function() {
    if (this.persist) {
        if (! this._persistso) {
            this._persistso = this.getPersist('historystate');
        }
        var d = this._persistso.data;
        if (d) {
            this.__lzhistq = [];
            for (var i in d) {
                this.__lzhistq[i] = d[i];
                //Debug.write('restoring', i, d[i]);
            }
        }
    } else {
        if (this._persistso) this._persistso = null;
    }    
}

LzHistory.clear = function() {
    if (this.persist) {
        if (! this._persistso) {
            this._persistso = this.getPersist('historystate');
        }
        this._persistso.clear();
        //this._persistso.flush();
    }
    this.__lzhistq = []
    this.offset = 0;
    if (this.onoffset.ready) this.onoffset.sendEvent(0);
}

LzHistory.setPersist = function(p) {
    this.persist = p;
    this.__initPersist();
}

LzHistory.__initPersist();
