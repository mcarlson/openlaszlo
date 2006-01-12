/*******************************************************************************
 * LzHistory.as
 ******************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzHistory
//
// NOTE: You must load your lzx with the lzt=history wrapper HTML to use LzHistory.
//
// The LzHistory service manages interaction with the browser history and back button.  Save state as often as you like, and advance the history when a new 'page' of values is required.
// 
// LzHistory also receives canvas attribute requests from the browser JavaScript method lzSetCanvasAttribute('attrname', attrvalue).  
// 
// For example, to set the foo attribute on the canvas no 0 or 1, include this HTML in a copy of the lzt=history wrapper HTML:
// 
// <form>
//     <input type="button" value="0" onclick="lzSetCanvasAttribute('foo', 0)"/>
//     <input type="button" value="1" onclick="lzSetCanvasAttribute('foo', 1)"/>
// </form>
//==============================================================================

LzHistory = new Object;

LzHistory.__lzhisturl = _root.__lzhisturl != null ? _root.__lzhisturl : '/lps/lps/includes/h.html?h=';
LzHistory.__lzhistconn = _root.__lzhistconn;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzHistory.setHistory = function(s) {
    if (_root.LzHistory.__lzhistconn == null) {
        _root.Debug.write('WARNING: You must load with history enabled (lzt=history) in order to use LzHistory.');
        return;
    }
    _root.LzBrowser.loadURL(_root.LzHistory.__lzhisturl + escape(s), '_lzhist');
    this.__lzloading = true;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzHistory.getPersist = function(n, p) {
    return SharedObject.getLocal(n, p).d;
}

LzHistory.persist = false;

// The current offset (zero-based) in the history value stack. 
LzHistory.offset = 0;
LzHistory.__lzdirty = false;
LzHistory.__lzhistq = [];
LzHistory.__lzcurrstate = {};
LzHistory.__lzloading = false;
LzHistory.__lzloadcache = {};
LzHistory.__loadcacheused = false;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzHistory.receiveHistory = function(o){
    //_root.Debug.write('onhistory ', o, this.__lzhistq);
    o *= 1;
    if (! o) o = 0;
    if (o > this.__lzhistq.length - 1) o = this.__lzhistq.length;
    this.offset = o;
    this.onoffset.sendEvent(o);
    
    var h = this.__lzhistq[o];
    for (var u in h) {
        var o = h[u];
        //_root.Debug.write('restoring state ', o);
        o.c.setAttribute(o.n, o.v);
    }
    
    
    // copy values cached during load
    if (this.__loadcacheused) {
        var out = this.__lzhistq[this.offset];
        if (out == null) out = {};
        var u;
        for (u in this.__lzloadcache) {
            //_root.Debug.write('restoring', o, this.__lzloadcache[u]);
            out[u] = this.__lzloadcache[u];
        }
        this.__lzhistq[this.offset] = out;
        this.__lzloadcache = {};
        this.__loadcacheused = false;
    }
    
    this.__lzloading = false;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzHistory.receiveEvent = function(n, v){
    //_root.Debug.write('got event', n, v);
    _root.canvas[n] = v;
    _root.canvas['on' + n].sendEvent(v);
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzHistory.makeConnection = function () {
    var lc = new LocalConnection();
    //-----------------------------------------------------------------------------
    // @keywords private
    //-----------------------------------------------------------------------------
    lc.receiveHistory = function(p) {
        _root.LzHistory.receiveHistory(p);
    };
    //-----------------------------------------------------------------------------
    // @keywords private
    //-----------------------------------------------------------------------------
    lc.receiveEvent = function(n, v) {
        _root.LzHistory.receiveEvent(n, v);
    };
    lc.connect(_root.LzHistory.__lzhistconn);
    this.__lzconn = lc;
}

LzHistory.makeConnection();

if ($krank) {
    // Don't serialize the local connection
    LzHistory.$SID_TRANSIENT = {
        __lzconn: _root.LzSerializer.transient
    }
    // Reconstitute the local connection
    LzHistory.$SID_RESOLVE_OBJECT = LzHistory.makeConnection;
}

//-----------------------------------------------------------------------------
// Saves a value and attribute name callback in the current offset of the 
// history stack.  When the browser back button causes the history offset 
// to change, the attribute will get set to the value saved at that offset,
// e.g. scope.setAttribute('attribute_name_to_set', value). 
//-----------------------------------------------------------------------------
LzHistory.save = function(who, prop, val) {
    if (_root.LzHistory.__lzhistconn == null) {
        _root.Debug.write('WARNING: You must load with history enabled (lzt=history) in order to use LzHistory.');
        return;
    }
    // strip off __ so keys can be listed
    var u = who.getUID().substr(2);
    if (val == null) val = who[prop];
    if (this.__lzloading) {
        //_root.Debug.write('caching');
        // cache values until load finishes
        this.__lzloadcache[u] = {c: who, n: prop, v: val};
        this.__loadcacheused = true;
    } else {
        //_root.Debug.write('set state of ',u,' to ', this.__lzcurrstate);
        this.__lzcurrstate[u] = {c: who, n: prop, v: val};
        this.__lzdirty = true;
    }
}

//-----------------------------------------------------------------------------
// @keywords private
// Commits all registered values to the history stack at the current offset.
// Must be called to commit registered values.  Called automatically by 
// next and prev. 
//-----------------------------------------------------------------------------
LzHistory.commit = function() {
    if (! this.__lzdirty) return;
    this.__lzhistq[this.offset] = this.__lzcurrstate;
    
    //_root.Debug.write('Stored state ', this.__lzcurrstate, out);
    this.__lzhistq.length = this.offset + 1;
    
    if (this.persist) {
        if (! this._persistso) {
            var lu = LzBrowser.getLoadURLAsLzURL();
            lu.query = null;
            this._persistso = this.getPersist('historystate');
        }
        //_root.Debug.write('_persistso: ', this._persistso);
        //this._persistso.data = this.__lzhistq;
    }
    
    this.__lzcurrstate = {};
    this.__lzdirty = false;
    //_root.Debug.write('save', this.__lzhistq.length - 1, this.__lzhistq);
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzHistory.move = function(by) {
    this.commit();
    if (! by) by = 1;
    var o = this.offset + by;
    if (0 >= o) o = 0;
    //_root.Debug.write('Move to: ', o);
    if (this.__lzhistq.length >= o) {
        //_root.Debug.write('move', o, this.__lzhistq.length, this.__lzhistq);
        //this.offset = o;
        this.setHistory(o);
    }
}

//-----------------------------------------------------------------------------
// Step back one step in the history stack.  Adds an item to the browser history
// stack. 
//-----------------------------------------------------------------------------
LzHistory.next = function() {
    this.move(1);
}

//-----------------------------------------------------------------------------
// Step forward one step in the history stack.  Adds an item to the  browser history
// stack. 
//-----------------------------------------------------------------------------
LzHistory.prev = function() {
    this.move(-1);
}

