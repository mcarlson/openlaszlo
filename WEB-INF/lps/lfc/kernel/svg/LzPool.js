/**
  * LzPool.js
  *
  * @copyright Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic SVG
  */

// Creates an object pool where each object is cached by ID.  A reference to a getter method must be provided as the first argument. Arguments for cacheHit and destroyer methods and an owner are optional
LzPool = function(getter, cacheHit, destroyer, owner) {
    this.cache = {};
    if (typeof getter == 'function') this.getter = getter;
    if (typeof cacheHit == 'function') this.cacheHit = cacheHit;
    if (typeof destroyer == 'function') this.destroyer = destroyer;
    if (owner) this.owner = owner;
}

// The cache itself
LzPool.prototype.cache = null;

// Retrieves an item from the cache
LzPool.prototype.get = function(id) {
    if (this.cache[id] == null) {
        this.cache[id] = this.getter(id, Array.prototype.slice.apply(arguments, [1]));
    } else {
        if (this.cacheHit) this.cacheHit(id, Array.prototype.slice.apply(arguments, [1]));
    }
    if (this.owner) this.cache[id].owner = this.owner;
    return this.cache[id];
}
// Flushes an item from the cache
LzPool.prototype.flush = function(id) {
    if (this.destroyer) this.destroyer(this.cache[id]);
    this.cache[id] = null;
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
