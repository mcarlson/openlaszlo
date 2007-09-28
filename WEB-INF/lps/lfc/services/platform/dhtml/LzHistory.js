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
LzHistory.setHistory = function(s) {
    //Debug.write('setHistory', s);
    Lz.history.set(s);
}

/**
  * @access private
  */
LzHistory.getPersist = function(n) {
}

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
    //Debug.write('onhistory ', o, this.__lzhistq);
    o *= 1;
    if (! o) o = 0;
    if (o > this.__lzhistq.length - 1) o = this.__lzhistq.length;
    this.offset = o;
    if (this.onoffset.ready) this.onoffset.sendEvent(o);
    
    var h = this.__lzhistq[o];
    for (var u in h) {
        var o = h[u];
        //Debug.write('restoring state ', global[o.c], o.c, o.n, o.v);
        global[o.c].setAttribute(o.n, o.v);
    }
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
    return eval(js);
}

/**
  * Saves a value and attribute name callback in the current offset of the 
  * history stack.  When the browser back button causes the history offset 
  * to change, the attribute will get set to the value saved at that offset,
  * e.g. scope.setAttribute('attribute_name_to_set', value). 
  */
LzHistory.save = function(who, prop, val) {
    // strip off __ so keys can be listed
    if (val == null) val = global[who][prop];
    //Debug.write('set state of ',u,' to ', this.__lzcurrstate);
    this.__lzcurrstate[who] = {c: who, n: prop, v: val};
    this.__lzdirty = true;
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
        this.setHistory(o);
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

LzHistory.clear = function() {
    this.__lzhistq = []
    this.offset = 0;
    if (this.onoffset.ready) this.onoffset.sendEvent(0);
}

LzHistory.setPersist = function() {
    if ($debug) Debug.warn('History persistence is not implemented in DHTML.');
}

Lz.__dhtmlhistoryready = true;
