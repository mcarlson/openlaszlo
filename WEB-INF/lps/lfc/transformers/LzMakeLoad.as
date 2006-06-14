/******************************************************************************
 * LzMakeLoad.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzMakeMasked
// Makes a view masked. This only works if the given view has no 
// resource when it is passed to the transformer.
//
// @keywords private
//=============================================================================
LzMakeLoad = new LzTransformer();

//-----------------------------------------------------------------------------
// Makes the given view able to load a remote resource
//-----------------------------------------------------------------------------
// TODO [2005-07-14 ptw] apply is a bad name to choose, since you are
// overriding Function.apply!
LzMakeLoad.apply = function ( v , src , cache, headers ){
    //_root.Debug.write('LzMakeLoad.apply', v, src, cache, headers);

    super.apply( v );

    v.firstsrc = src;
    v.firstcache = cache;
    v.firstheaders = headers;

    //_root.Debug.write('LzMakeLoad.apply', v.__LZhaser, v.__LZmovieClipRef);

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
}
    
//=============================================================================
// @keywords private
//=============================================================================
LzMakeLoad.doReplaceResource = function (){
    //this gets called when a view applies the load transformer but it
    //already had a resource
    super.doReplaceResource( );
    if (this._newrescname.indexOf('http:') == 0 || this._newrescname.indexOf('https:') == 0){
        this.createLoader();
    }
}

//=============================================================================
// @keywords private
//=============================================================================
LzMakeLoad.createLoader = function (){
    this.loader = new _root.LzMediaLoader( this , {} );
    this.updateDel = new _root.LzDelegate( this , "updateAfterLoad" );
    this.updateDel.register( this.loader , "onstreamstart" );

    this.errorDel = new _root.LzDelegate( this , "__LZsendError" );
    this.errorDel.register( this.loader , "onerror" );
    
    this.timeoutDel = new _root.LzDelegate( this , "__LZsendTimeout" );
    this.timeoutDel.register( this.loader , "ontimeout" );

    //__root.Debug.write('LzMakeLoad.createLoader', this.firstsrc)
    if ( this.firstsrc != null ){
        this.setSource( this.firstsrc , this.firstcache, this.firstheaders );
    }
}



//=============================================================================
// @keywords private
// @param String newSrc: The url from which to load the resource for this view.
// @param String cache: If set, controls caching behavior. Choices are
// "none" , "clientonly" , "serveronly" , "both" -- where both is the default.
// @param String headers: Headers to send with the request (if any.)
//=============================================================================
LzMakeLoad.setSource = function ( newSrc , cache , headers ){
    if (this.loader.mc.loading == true) {
        this.loader.unload(this.loader.mc);
    }
    this.stopTrackPlay();
    this.isloaded = false;
    if ( this.queuedplayaction == null ){
        this.queuePlayAction( "checkPlayStatus" );
    }

    this.resource = newSrc;
    this.onresource.sendEvent( newSrc );

    this.__LZvizLoad = false; 
    this.__LZupdateShown();
    this.loader.request( newSrc , cache , headers );
}

//=============================================================================
// This method keeps the behavior of setResource consistent between 
// load-transformed views and those that aren't
// @keywords private
//=============================================================================
LzMakeLoad.setResource = function ( nresc ){
    // unload anything currently loading...
    if (this.loader.mc.loading == true) {
        LzLoadQueue.unloadRequest(this.loader.mc);
    }
    if ( nresc == "empty" ){
        super.setResource( nresc );
    } else { 
        if ( nresc.indexOf('http:') == 0 || nresc.indexOf('https:') == 0){
            this.setSource( nresc );
            return;
        }
        this.loader.attachLoadMovie( nresc );
        if ( this.queuedplayaction == null ){
            this.queuePlayAction( "checkPlayStatus" );
        }
        this.updateAfterLoad();
    }
}

//handle error


//=============================================================================
// Updates movieclip properties after the resource has loaded
// @keywords private
//=============================================================================
LzMakeLoad.updateAfterLoad = function (){
    this.isloaded = true;
    var mc = this.getMCRef();
    this.resourcewidth = mc._width;
    this.resourceheight = mc._height;
    this.currentframe = mc._currentframe;

    var tfchg = this.totalframes != mc._totalframes;
    if ( tfchg ){
        this.totalframes = mc._totalframes;
        this.ontotalframes.sendEvent( this.totalframes );
    }

    if ( this.totalframes > 1 ){
        this.checkPlayStatus();
    }

    this.__LZvizLoad = true; 
    this.__LZupdateShown();
    this.reevaluateSize( );
    this.onload.sendEvent( this.loader.mc );

}

//-----------------------------------------------------------------------------
// Unloads the media
//
// @keywords private
//-----------------------------------------------------------------------------
LzMakeLoad.unload = function () {
    this.loader.unload();
}

//-----------------------------------------------------------------------------
// Get a reference to the control mc
//
// @keywords private
//-----------------------------------------------------------------------------
LzMakeLoad.getMCRef = function () {
    //return null if not loaded
    return this.isloaded ? this.loader.getLoadMC() : null;
}

//-----------------------------------------------------------------------------
// Get the number of bytes loaded so far
//
// @return: A number that is the maximum offset for this resource
//-----------------------------------------------------------------------------
LzMakeLoad.getLoadBytes = function (){
    var m = this.getMCRef().getBytesLoaded();
}

//-----------------------------------------------------------------------------
// Get the total number of bytes for the attached resource
//
// @return: A number that is the maximum offset for this resource
//-----------------------------------------------------------------------------
LzMakeLoad.getMaxBytes = function (){
    var m = this.getMCRef().getBytesTotal();
}

//=============================================================================
// @keywords private
//=============================================================================
LzMakeLoad.__LZsendError = function ( e ){
    this.resourcewidth = 0;
    this.resourceheight = 0;
    this.reevaluateSize( );
    this.onerror.sendEvent( e )
}

//=============================================================================
// @keywords private
//=============================================================================
LzMakeLoad.__LZsendTimeout = function ( e ){
    this.ontimeout.sendEvent( e )
}

//=============================================================================
// @keywords private
//=============================================================================
LzMakeLoad.destroy = function (recur) {
    
    this.loader.unload( );

    super.destroy( recur );
}
