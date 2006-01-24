/******************************************************************************
 * LzMediaLoader.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzMediaLoader
// @keywords private
//==============================================================================
LzMediaLoader = Class(
    "LzMediaLoader",
    LzLoader,
    function ( owner , args ) {
        #pragma 'methodName=constructor'
        super( owner ,args );

        this.owner.loadperc = 0;

        this.loadChecker = new _root.LzDelegate( this , "testLoad" );

        this.removeLoadCheckerDel = 
            new _root.LzDelegate( this, 
                                  "removeLoadChecker", this, "onloaddone" );

        this.timeout = canvas.medialoadtimeout;

        //setup loadmovie stuff that never changes
        this.mc.loader = this;
        this.mc.mc = this.mc;
        this.mc.timeout = this.timeout;
        this.lastrequest = this.mc;
        // [2005-08-28] We use the view's clip as the loadobj, so
        // monitor it (as we would in LzLoader if we created a new
        // loadobj).
        if ($debug) {
            LzLoader.debugLoadObj(this.mc, 'MediaLoadObj');
        }
    }
);

LzMediaLoader.prototype.LOADERDEPTH = 9;

//==============================================================================
// @keywords private
//==============================================================================
LzMediaLoader.prototype.removeLoadChecker = function() {
    // Remove loadChecker delegate
    this.loadChecker.unregisterAll();
}

//==============================================================================
// @keywords private
// [2005-08-29 ptw] It appears the intent here is that there is 1
// media loader per view with a resource, so we use the view's
// movieclip as the loadmovie, rather than creating another.
//==============================================================================
LzMediaLoader.prototype.getLoadMovie = function ( ){
    // Abort any load in progress
    this.unload( this.mc );
    if (this.isaudio != true && this._oldmc != null) {
        // restore regular loader if audio was used before.
        this.mc.unload();
        var m = this._oldmc;
        this._oldmc = null;
        this.mc = m;
    } else if (this.isaudio == true && this._oldmc == null) {
        this._oldmc = this.mc;
        this.mc = new SoundMC(this.mc);
        this.initializeRequestObj(mc);
        if ($debug) {
            LzLoader.debugLoadObj(this.mc, 'MediaLoadObj');
        }
        //_root.Debug.warn('getLoadMovie lmc %w %w', this.mc, this.mc.lmc)
    } else {
        //_root.Debug.warn('getLoadMovie not audio %2 %w', this.mc, this.mc.lmc)
    } 

    // return the view's clip
    return this.mc;
}

//==============================================================================
// @keywords private
//==============================================================================
LzMediaLoader.prototype.attachLoadMovie = function ( resc ){
    var mc = this.getLoadMovie();
    //Debug.warn('attachLoadMovie %w %w %w', resc, mc, this._oldmc)
    if (this.isaudio == true && this._oldmc != null) {
        // restore regular loader if audio was used before.
        this.mc.unload();
        var m = this._oldmc;
        this._oldmc = null;
        this.mc = m;
        mc = m;
    }
    if (resc) {
        mc.attachMovie( resc , "lmc", this.LOADERDEPTH );
        if (this.mc.loading == true) LzLoadQueue.loadFinished( mc );
    } else {
        Debug.error('%w.attachMovie(%w)', this, resc);
    }
}

//==============================================================================
// @keywords private
//==============================================================================
LzMediaLoader.prototype.startingLoad = function ( loadmc ){
    this.checkonce = false;
    this.loadChecker.register( _root.LzIdle, "onidle" );
}

//=============================================================================
// Media types which cannot be loaded directly (serverless) at runtime.
//
// We use a blacklist instead of a whitelist, because the user may
// want to access a URL which generates a supported format, but has an
// suffix from which it is not possible to deduce the file type, like
// .jsp or .php.
LzMediaLoader.unsupportedMediaTypes = {
    "bmp": true,
    "tiff": true,
    "tif": true,
    "wmf": true,
    "wmv": true


};

LzMediaLoader.unsupportedMediaTypesSWF7 = {
    "png": true,
    "gif": true
}



//==============================================================================
// @keywords private
//==============================================================================
LzMediaLoader.prototype.request = function( req , cache , headers ) {
    var o = { url: req , lzt: "media", timeout: this.timeout };

    if ( cache == "none" ){
        o.cache = false;
        o.ccache = false;
    } else if ( cache == "clientonly" ){
        o.cache = false;
        o.ccache = true;
    } else if ( cache == "serveronly" ){
        o.cache = true;
        o.ccache = false;
    } else {
        o.cache = true;
        o.ccache = true;
    }

    var policy = _root.LzView.__LZcheckProxyPolicy( req );
    this.proxied = policy;
    o.proxied = policy;

    if (!this.proxied) {
        // warn for unsupported media types
        var suffix = null;
        var si = req.lastIndexOf(".");
        if (si != -1) {
            suffix = req.substring(si+1, si.length).toLowerCase();
        }
        if ($debug) {
            if (suffix != null && ((LzMediaLoader.unsupportedMediaTypes[suffix] == true)
                                   ||
                                   ((canvas.runtime == "swf7" || canvas.runtime == "swf6")
                                    && (LzMediaLoader.unsupportedMediaTypesSWF7[suffix] == true)))) {
                _root.Debug.write("WARNING: serverless loading of resources with type '" 
                                + suffix + "' is not supported by the Flash player. " +
                                req);
            }
        }
        if (suffix == 'mp3') {
            this.isaudio = true;
        } else {
            this.isaudio = false;
        }
        //_root.Debug.write('suffix', suffix, this.isaudio);
    }

    if ( headers != null ) o.headers = headers;
    super.request( o );
    this.owner.setAttribute( "framesloadratio" , 0 );
    this.owner.setAttribute( "loadratio" , 0 ); 
}

//==============================================================================
// @keywords private
//==============================================================================
LzMediaLoader.prototype.testLoad = function (){
    //skip first check because this can get called before load starts, in 
    //which case load info is wrong
    //getBytesTotal is wrong before the header of the movie has loaded

    /*
    _root.Debug.write('%w %w %w %w %w %w %w %w %w', this.mc.lmc, typeof(this.mc.lmc.getBytesTotal),
                      this.mc.lmc.getBytesLoaded(), typeof(this.mc.lmc.getBytesLoaded()),
                      this.mc.lmc.getBytesTotal(), typeof(this.mc.lmc.getBytesTotal()),
                      this.mc.lmc._currentframe, this.mc.lmc._framesloaded, this.mc.lmc._totalframes);
*/

    if ( this.checkonce ){
        this.owner.setAttribute( "loadratio" ,  
                this.mc.lmc.getBytesLoaded() / this.mc.lmc.getBytesTotal() );

    }

    if ( this.checkonce && this.mc.lmc.getBytesTotal == void 0 
         && this.mc.lmc._totalframes > 0  ) {
             //a swf loaded from another domain will be sandboxed. no load
             //information is available;
             if ( !this.sentLoadStart ){
                 this.sentLoadStart = true;
                 if ( ! this.mc.loaded ) {
                     this.onstreamstart.sendEvent( this );
                 }
             }

             var nlp = this.mc.lmc._framesloaded / 
             this.mc.lmc._totalframes;

             if ( nlp > this.owner.loadperc ){
                 //reset timeout for media which is streaming
                 //_root.Debug.write( "here" , this.mc.lmc._framesloaded , 
                 //this.mc.lmc._totalframes );

                 if (this.mc.lmc._totalframes > 0) {
                     var nlp = this.mc.lmc._framesloaded / 
                         this.mc.lmc._totalframes;

                     if ( nlp > this.owner.loadperc ){
                         //reset timeout for media which is streaming
                         this.mc.loadtime = getTimer();
                     }

                     this.owner.loadperc = nlp;
                     this.owner.onloadperc.sendEvent( this.owner.loadperc );
                     this.owner.setAttribute( "framesloadratio" , nlp );
                     this.owner.setAttribute( "loadratio" , nlp );

                     if ( this.mc.lmc._totalframes == this.mc.lmc._framesloaded){
                         this.onloaddone.sendEvent( this );
                         this.returnData( this.mc );
                     }
                 }
             }
         }

    if ( this.checkonce && this.mc.lmc._currentframe > 0 
         && typeof(this.mc.lmc.getBytesTotal) != "undefined"
         && this.mc.lmc.getBytesTotal() > this.minHeader ) {
        
             if ( !this.sentLoadStart ){
                 this.sentLoadStart = true;
                 //this assumes that an error swf will have already called back
                 //into the LFC by the time the load is detected. If this is
                 //wrong, then the view will send both onload and onrror.
                 if ( ! this.mc.loaded ) {
                     this.onstreamstart.sendEvent( this );
                 }
             }

             if (this.mc.lmc._totalframes > 0) {
                 var nlp = this.mc.lmc._framesloaded / 
                 this.mc.lmc._totalframes;

                 if ( nlp > this.owner.loadperc ){
                     //reset timeout for media which is streaming
                     this.mc.loadtime = getTimer();
                 }

                 this.owner.loadperc = nlp;
                 this.owner.onloadperc.sendEvent( this.owner.loadperc );
                 this.owner.setAttribute( "framesloadratio" , nlp );
             }

             if ( this.mc.lmc.getBytesTotal() == this.mc.lmc.getBytesLoaded() ){
                 //load is done

                 this.onloaddone.sendEvent( this );
                 //if mc.loaded is set, means returnData has already been called
                 //(probably by error swf.)
                 if ( !this.mc.loaded ){
                     this.returnData( this.mc );
                 }
             }
         }
    
    if ( !this.checkonce ){
        this.sentLoadStart = false;
        this.checkonce = true;
    }
}
//==============================================================================
// @keywords private
//==============================================================================
LzMediaLoader.prototype.unload= function ( loadobj ){
    super.unload( loadobj );
    if ( this.owner.loadratio != 0 ){
        this.owner.loadperc = 0;
        this.owner.onloadperc.sendEvent( 0 );
        this.owner.setAttribute( "loadratio" , 0 );
        this.owner.setAttribute( "framesloadratio" , 0 );
    }

    this.removeLoadChecker();
}

//==============================================================================
// @keywords private
//==============================================================================
LzMediaLoader.prototype.getLoadMC= function (){
    return this.mc.lmc;
}

