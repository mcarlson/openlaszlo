/**
  * LzMakeLoadSprite.as
  *
  * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * @access private
  */
var LzMakeLoadSprite = {};

/**
  * Makes the given view able to load a remote resource
  */
LzMakeLoadSprite.transform = function (v, src, cache, headers, filetype) {
    for (var k in this) {
        if (k != "transform") {
            if (typeof v[k] == 'function') {
                // replace old method with _methodname to support super
                v[ '___' + k ] = v[k];
            }
            v[k] = this[k];
        }
    }

    if (v.__LZmovieClipRef == null || ! v.__LZhaser) {
        //the view doesn't have the empty resource. We need to try and replace it
        v.makeContainerResource();
    }

    v.createLoader(src, cache, headers, filetype);
}

/**
  * @access private
  */
LzMakeLoadSprite.createLoader = function (src, cache, headers, filetype) {
    this.loader = new LzMediaLoader(this, {});

    this.updateDel = new LzDelegate(this, "updateAfterLoad", this.loader, "onloaddone");
    this.errorDel = new LzDelegate(this, "__LZsendError", this.loader, "onerror");
    this.timeoutDel = new LzDelegate(this, "__LZsendTimeout", this.loader, "ontimeout");

    if (src != null) {
        this.setSource(src, cache, headers, filetype);
    }
}

/**
  * @access private
  * @param String src: The url from which to load the resource for this view.
  * @param String cache: If set, controls caching behavior. Choices are
  * "none" , "clientonly" , "serveronly" , "both" -- where both is the default.
  * @param String headers: Headers to send with the request (if any.)
  * @param String filetype: Filetype, e.g. 'mp3' or 'jpg'.  If not specified, it will be derived from the URL.
  */
LzMakeLoadSprite.setSource = function (src, cache, headers, filetype) {
    // unload anything currently loading...
    if (this.loader.mc.loading == true) {
        LzLoadQueue.unloadRequest(this.loader.mc);
    }

    if (src == '' || src == ' ' || src == null) {
        if ($debug) Debug.error('setSource called with an empty url');
        return;
    }

    this.stopTrackPlay();
    this.isloaded = false;
    if (this.queuedplayaction == null) {
        this.queuePlayAction("checkPlayStatus");
    }

    this.resource = src;
    //this.owner.resource = src;
    //if (this.owner.onresource) this.owner.onresource.sendEvent( src );

    if (! this.__LZbuttonRef) {
        // only hide if we're not clickable - see LPP-4957
        this.owner.__LZvizLoad = false; 
        this.owner.__LZupdateShown();
    }
    this.loader.request(src, cache, headers, filetype);
}

/**
  * This method keeps the behavior of setResource consistent between 
  * load-transformed views and those that aren't
  * @access private
  */
LzMakeLoadSprite.setResource = function (nresc) {
    // unload anything currently loading...
    if (this.loader.mc.loading == true) {
        LzLoadQueue.unloadRequest(this.loader.mc);
    }
    if (nresc == "empty") {
        // call shadowed setResource()
        this.___setResource(nresc);
    } else if (nresc.indexOf('http:') == 0 || nresc.indexOf('https:') == 0) {
        this.setSource(nresc);
    } else {
        this.resource = nresc;
        this.loader.attachLoadMovie(nresc);
        if (this.queuedplayaction == null) {
            this.queuePlayAction("checkPlayStatus");
        }
        // make sure resource is updated, but no "onload"-event is sent
        this.updateAfterLoad(null);
        // need to call manually because no "onload"-event was sent
        this.doQueuedPlayAction();
    }
}

/**
  * Updates movieclip properties after the resource has loaded
  * @access private
  */
LzMakeLoadSprite.updateAfterLoad = function (mloader) {
    this.isloaded = true;

    var mc = this.getMCRef();
    mc.forceSmoothing = true;
    this.resourcewidth = mc._width;
    this.resourceheight = mc._height;
    this.currentframe = mc._currentframe;

    var tfchg = this.totalframes != mc._totalframes;
    if (tfchg) {
        this.totalframes = mc._totalframes;
        this.owner.resourceevent('totalframes', this.totalframes);
    }

    if (this.totalframes > 1) {
        this.checkPlayStatus();
    }

    this.setHeight(this.hassetheight ? this.height : null);
    this.setWidth(this.hassetwidth ? this.width : null);

    // Install right-click context menu if there is one
    if (this.__contextmenu) mc.menu = this.__contextmenu.kernel.__LZcontextMenu();

    this.owner.__LZvizLoad = true;
    this.owner.__LZupdateShown();
    // skip event when called by setResource()
    var skip = (mloader == null);
    this.owner.resourceload({width: this.resourcewidth, height: this.resourceheight, 
                                resource: this.resource, skiponload: skip});
    this.owner.reevaluateSize();
}

/**
  * Unloads the media
  * @access private
  */
LzMakeLoadSprite.unload = function () {
    this.loader.unload(this.loader.mc);
    this.stopTrackPlay();
    this.__updateBackgroundRepeat();
}

/**
  * Get a reference to the control mc
  * @access private
  */
LzMakeLoadSprite.getMCRef = function () {
    //return null if not loaded
    if (this.loader.isaudio) return this.loader.mc;
    return this.isloaded ? this.loader.getLoadMC() : null;
}

/**
  * Get the number of bytes loaded so far
  * @return: A number that is the maximum offset for this resource
  */
LzMakeLoadSprite.getLoadBytes = function () {
    return this.getMCRef().getBytesLoaded();
}

/**
  * Get the total number of bytes for the attached resource
  * @return: A number that is the maximum offset for this resource
  */
LzMakeLoadSprite.getMaxBytes = function () {
    return this.getMCRef().getBytesTotal();
}

/**
  * @access private
  */
LzMakeLoadSprite.__LZsendError = function (e) {
    this.resourcewidth = 0;
    this.resourceheight = 0;
    if (this.owner) this.owner.resourceloaderror(e)
}

/**
  * @access private
  */
LzMakeLoadSprite.__LZsendTimeout = function (e) {
    this.resourcewidth = 0;
    this.resourceheight = 0;
    if (this.owner) this.owner.resourceloadtimeout(e)
}

/**
  * @access private
  */
LzMakeLoadSprite.destroy = function () {
    if (this.__LZdeleted == true) return;

    if ('updateDel' in this && this.updateDel.hasevents) {
         this.updateDel.destroy();
    }
    if ('errorDel' in this && this.errorDel.hasevents) {
         this.errorDel.destroy();
    }
    if ('timeoutDel' in this && this.timeoutDel.hasevents) {
         this.timeoutDel.destroy();
    }

    this.loader.unload(this.loader.mc);
    this.loader.destroy();

    // call shadowed destroy()
    this.___destroy();
}
