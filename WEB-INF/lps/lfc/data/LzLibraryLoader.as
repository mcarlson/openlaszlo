//==============================================================================
// DEFINE OBJECT: LzLibraryLoader
// @keywords private
//==============================================================================

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

LzLibraryLoader = Class(
    "LzLibraryLoader",
    LzLoader,
    function ( owner , args ) {
        #pragma 'methodName=constructor'
        super( owner ,args );
        this.owner.loadperc = 0;
        //setup loadmovie stuff that never changes
        this.mc.loader = this;
        this.mc.mc = this.mc;
        this.mc.timeout = this.timeout;
        this.lastrequest = this.mc;
    }
);

LzLibraryLoader.prototype.LOADERDEPTH = 9;

//==============================================================================
// @keywords private
//==============================================================================
LzLibraryLoader.prototype.request = function( req ) {
    //_root.Debug.write("LzLibraryLoader.request() this.proxied=", this.proxied);
    var o = { libpath: req, url: req , lzt: "lib", proxied: this.proxied};
    super.request( o );
    this.owner.setAttribute( "framesloadratio" , 0 );
    this.owner.setAttribute( "loadratio" , 0 ); 
}

//==============================================================================
// @keywords private
//==============================================================================

//==============================================================================
// @keywords private
//==============================================================================
LzLibraryLoader.prototype.getLoadMC= function (){
    return this.mc.lmc;
}



//==============================================================================
// @keywords private
//==============================================================================
// This is the callback when a library module has finished loading
LzLibraryLoader.prototype.snippetLoaded = function ( loadmc, err ){
    _root.LzLoadQueue.loadFinished( loadmc );
    if ( ! loadmc.valid ) {
        this.owner.loaded = false;
        this.owner.loading = false;
        return;
    }

    this.lastloadtime = getTimer() - loadmc.loadtime;

    var err;
    // TODO [hqm 2004-10-01] figure out how to pass server error
    // message back through the loader. How about: a special library
    // loading error swf needs to be returned from the server and call
    // this snippetLoaded method with an error arg.

    if ( err != null ){
        _root.Debug.write( err );
        this.owner.loaded = true;
        this.owner.loading = false;
        this.owner.onerror.sendEvent( err );
        return;
    }

    if ( loadmc.timedout ){
        this.doTimeOut();
    } else {
        // this.owner.onload.sendEvent( err );
        this.owner.loaded = true;
    }

    _root.LzInstantiateView({attrs: {libname: this.owner.name}, name: "LzLibraryCleanup"}, 1);
    
    // Run the queue to instantiate all pending LzInstantiateView calls.
    _root.canvas.initDone();

}
