/**
  * LzMakeLoadSprite.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/**
  * @access private
  */
function LzMakeLoadSprite(  ){
    
}

LzMakeLoadSprite.transformerID = 0;


/**
  * Makes the given view able to load a remote resource
  */
LzMakeLoadSprite.transform = function ( v , src , cache, headers, filetype ){
    //super.transform( v );

    for ( var k in this){
        if (typeof v[k] == 'function' && this[k]) {
            // replace old method with _methodname to support super
            //Debug.write('replacing _' + k + ' with ' + k + ' in ' + v);
            v[ '___' + k ] = v[k];
            v[k] = this[k];
        } else {
            //Debug.write('adding ' + k + ' to ' + v);
            v[k] = this[k];
        }
    }

//     Debug.trace(v, 'setHeight');
//     Debug.trace(v, 'setWidth');
//     Debug.monitor(v, 'resourcewidth')
//     Debug.monitor(v, 'resourceheight')
//     Debug.monitor(v, '_xscale')
//     Debug.monitor(v, '_yscale')
    
    v.firstsrc = src;
    v.firstcache = cache;
    v.firstheaders = headers;
    v.firstfiletype = filetype;

    if ( v.__LZmovieClipRef == null ){
        v.makeContainerResource();
    }

    if (v.__LZhaser ){
        v.createLoader();
    } else {
        //the view doesn't have the empty resource. We need to try and replace
        //it
        v.makeContainerResource();
        if (! this.loader) v.createLoader();
    }

//     var mc = v.__LZmovieClipRef;
//     Debug.debug(mc, '_width', mc._width);
//     Debug.debug(mc, '_height', mc._height);
//     Debug.debug(mc, '_xscale', mc._xscale);
//     Debug.debug(mc, '_yscale', mc._yscale);
}
    
/**
  * @access private
  */
LzMakeLoadSprite.doReplaceResource = function (){
    //this gets called when a view applies the load transformer but it
    //already had a resource

    // use shadowed doReplaceResource()
    this.___doReplaceResource( );
    if (this._newrescname.indexOf('http:') == 0 || this._newrescname.indexOf('https:') == 0){
        this.createLoader();
    }
}

/**
  * @access private
  */
LzMakeLoadSprite.createLoader = function (){
    this.loader = new LzMediaLoader( this , {} );
    this.updateDel = new LzDelegate( this , "updateAfterLoad" );
    this.updateDel.register( this.loader , "onloaddone" );

    this.errorDel = new LzDelegate( this , "__LZsendError" );
    this.errorDel.register( this.loader , "onerror" );
    
    this.timeoutDel = new LzDelegate( this , "__LZsendTimeout" );
    this.timeoutDel.register( this.loader , "ontimeout" );

    //Debug.write('LzMakeLoadSprite.createLoader', this.firstsrc)
    if ( this.firstsrc != null ){
        this.setSource( this.firstsrc , this.firstcache, this.firstheaders, this.firstfiletype );
    }
}



/**
  * @access private
  * @param String newSrc: The url from which to load the resource for this view.
  * @param String cache: If set, controls caching behavior. Choices are
  * "none" , "clientonly" , "serveronly" , "both" -- where both is the default.
  * @param String headers: Headers to send with the request (if any.)
  * @param String filetype: Filetype, e.g. 'mp3' or 'jpg'.  If not specified, it will be derived from the URL.
  */
LzMakeLoadSprite.setSource = function ( newSrc , cache , headers , filetype ){
    if (this.loader.mc.loading == true) {
        LzLoadQueue.unloadRequest(this.loader.mc);
    }
    //Debug.write('setSource', newSrc);
    if (newSrc == '' || newSrc == ' ' || newSrc == null) {
        Debug.error('setSource called with an empty url');
        return;
    }

    this.stopTrackPlay();
    this.isloaded = false;
    if ( this.queuedplayaction == null ){
        this.queuePlayAction( "checkPlayStatus" );
    }

    this.resource = newSrc;
    //this.owner.resource = newSrc;
    //if (this.owner.onresource) this.owner.onresource.sendEvent( newSrc );

    this.owner.__LZvizLoad = false; 
    this.owner.__LZupdateShown();
    this.loader.request( newSrc , cache , headers, filetype );
}

/**
  * This method keeps the behavior of setResource consistent between 
  * load-transformed views and those that aren't
  * @access private
  */
LzMakeLoadSprite.setResource = function ( nresc ){
    // unload anything currently loading...
    if (this.loader.mc.loading == true) {
        LzLoadQueue.unloadRequest(this.loader.mc);
    }
    if ( nresc == "empty" ){
        // call shadowed setResource()
        this.___setResource( nresc );
    } else { 
        if ( nresc.indexOf('http:') == 0 || nresc.indexOf('https:') == 0){
            this.setSource( nresc );
            return;
        }
        this.loader.attachLoadMovie( nresc );
        if ( this.queuedplayaction == null ){
            this.queuePlayAction( "checkPlayStatus" );
        }
        //this.updateAfterLoad();
    }

//     var mc = this.__LZmovieClipRef;
//     Debug.debug(mc, '_width', mc._width);
//     Debug.debug(mc, '_height', mc._height);
//     Debug.debug(mc, '_xscale', mc._xscale);
//     Debug.debug(mc, '_yscale', mc._yscale);
}

//handle error


/**
  * Updates movieclip properties after the resource has loaded
  * @access private
  */
LzMakeLoadSprite.updateAfterLoad = function (ignore){

    this.isloaded = true;
    var mc = this.getMCRef();
    this.resourcewidth = mc._width;
    this.resourceheight = mc._height;

    this.currentframe = mc._currentframe;

    var tfchg = this.totalframes != mc._totalframes;
    if ( tfchg ){
        this.totalframes = mc._totalframes;
        this.owner.resourceevent('totalframes', this.totalframes);
    }

    if ( this.totalframes > 1 ){
        this.checkPlayStatus();
    }

    this.setHeight(this.hassetheight?this.height:null);
    this.setWidth(this.hassetwidth?this.width:null);

    if (this.__contextmenu) {
        this.setContextMenu(this.__contextmenu);
    }


    this.owner.__LZvizLoad = true; 
    this.owner.__LZupdateShown();
    this.owner.resourceload({width: this.resourcewidth, height: this.resourceheight, resource: this.resource, skiponload: false});
    this.owner.reevaluateSize( );   
    //if (this.owner.onload) this.owner.onload.sendEvent( this.loader.mc );

    //Debug.write('Sprite.updateAfterLoad', mc, this.resourcewidth, this.resourceheight, this.resource, this.owner.resource, this.owner, this.x);
    //Debug.warn('Sprite.updateAfterLoad');
}

/**
  * Unloads the media
  * @access private
  */
LzMakeLoadSprite.unload = function () {
    this.loader.unload( this.loader.mc );
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
LzMakeLoadSprite.getLoadBytes = function (){
    return this.getMCRef().getBytesLoaded();
}

/**
  * Get the total number of bytes for the attached resource
  * @return: A number that is the maximum offset for this resource
  */
LzMakeLoadSprite.getMaxBytes = function (){
    return this.getMCRef().getBytesTotal();
}

/**
  * @access private
  */
LzMakeLoadSprite.__LZsendError = function ( e ){
    this.resourcewidth = 0;
    this.resourceheight = 0;
    if (this.owner) this.owner.resourceloaderror( e )
}

/**
  * @access private
  */
LzMakeLoadSprite.__LZsendTimeout = function ( e ){
    this.resourcewidth = 0;
    this.resourceheight = 0;
    if (this.owner) this.owner.resourceloadtimeout( e )
}

/**
  * @access private
  */
LzMakeLoadSprite.destroy = function () {
    if ('updateDel' in this)
         this.updateDel.unregisterAll();
    if ('errorDel' in this)
         this.errorDel.unregisterAll();
    if ('timeoutDel' in this)
         this.timeoutDel.unregisterAll();
 
    this.loader.unload( this.loader.mc );

    // call shadowed destroy()
    this.___destroy(); 
}
