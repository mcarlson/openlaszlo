/**
  * LzPool.js
  *
  * @copyright Copyright 2007-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic DHTML
  * @author Max Carlson &lt;max@openlaszlo.org&gt;
  */

// Creates an object pool where each object is cached by ID.  A reference to a getter method must be provided as the first argument. Arguments for cacheHit and destroyer methods and an owner are optional
var LzPool = function(getter, cacheHit, destroyer, owner) {
    this.cache = {};
    if (typeof getter == 'function') this.getter = getter;
    if (typeof cacheHit == 'function') this.cacheHit = cacheHit;
    if (typeof destroyer == 'function') this.destroyer = destroyer;
    if (owner) this.owner = owner;
}

// The cache itself
LzPool.prototype.cache = null;

// Retrieves an item from the cache
LzPool.prototype.get = function(id, skipcache, ...args) {
    var itm = this.cache[id];
    if (skipcache || itm == null) {
        args.unshift(id);
        itm = this.getter.apply(this, args);
        if (!skipcache) this.cache[id] = itm;
    } else if (this.cacheHit) {
        args.unshift(id, itm);
        this.cacheHit.apply(this, args);
    }
    if (this.owner) itm.owner = this.owner;
    return itm;
}
// Flushes an item from the cache
LzPool.prototype.flush = function(id) {
    if (this.destroyer) this.destroyer(id, this.cache[id]);
    delete this.cache[id];
}

// Destroys the pool and all objects contained in it
LzPool.prototype.destroy = function () {
    for (var id in this.cache) {
        this.flush(id);
    }
    this.owner = null;
    this.cache = null;
}

// Must be overridden to provide a getter method called for cache misses.  The method signature is the object id followed by any other arguments the method needs, (id, *);
LzPool.prototype.getter = null;

// May be overridden to provide a destroyer method.  The method is passed the object to be destroyed
LzPool.prototype.destroyer = null;

// May be overridden to provide a method called before a cache hit.  The method signature is the object id followed by any other arguments the method needs, (id, *);
LzPool.prototype.cacheHit = null;
