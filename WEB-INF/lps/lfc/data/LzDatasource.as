/******************************************************************************
 * LzDatasource.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzDatasource
// 
// @field String src: The http request to make for the datasource.
// @event ontimeout: Sent when a request from one of the datasource's 
// datasets times out.
// @event onerror: Sent when an error occurs for this datasource.
// @event ondata: Sent when new data arrives for this datasource.
// @field Number timeout: Interval (in milliseconds) to wait for
// response before timing out on request.  Default 30000.
//==============================================================================

var LzDatasource = Class( "LzDatasource" , LzNode );

LzDatasource.prototype.proxied = null;

//==============================================================================
// This is a helper method to create a loader for the dataset.
// @keywords private
// @return LzLoader 
//==============================================================================
LzDatasource.prototype.getNewLoader = function (proxied){
    if ( ! _root.$dataloaders ){
        _root.attachMovie("empty", "$dataloaders", 4242);
        var mc = _root.$dataloaders;
        // Krank annotation
        if (_root.$krank) {
          mc.$SID_LINK = "empty";
          mc.$SID_DEPTH = 4242;
        }
        mc.dsnum = 1;
    }

    _root.$dataloaders.attachMovie( "empty", 
                                   "dsloader" + _root.$dataloaders.dsnum,
                                   _root.$dataloaders.dsnum );
    var newloadermc = _root.$dataloaders[ "dsloader" + 
                                          _root.$dataloaders.dsnum ];
    // Krank annotation
    if (_root.$krank) {
      newloadermc.$SID_LINK = "empty";
      newloadermc.$SID_DEPTH = _root.$dataloaders.dsnum;
    }
    _root.$dataloaders.dsnum++;
    
    //_root.Debug.write("dataset timeout", this.timeout);

    return new _root.LzLoader( this, { attachRef : newloadermc ,
                                       timeout : this.timeout,
                                       proxied: proxied} );
}

//==============================================================================
// Returns a new loader for the given dataset. The returned object supports
// a "request" method which can be used to make backend requests.
// @keywords protected
// @param LzDataset forset: The dataset to get the loader for.
// @return LzLoader
//==============================================================================
LzDatasource.prototype.getLoaderForDataset = function ( forset, proxied ){
    var tloader = forset.getOption( "dsloader" );

    if (typeof(forset.timeout) != "undefined" && forset.timeout != null) {
        tloader.timeout = forset.timeout;
    }

    // If there is no loader, or if the loader changed it's proxied
    // flag, make a new loader.
    if ( !tloader){
        tloader = this.getNewLoader(proxied);
        tloader.queuing = forset.queuerequests;
        forset.setOption( 'dsloader' , tloader );
        forset.setOption( 'dsloadDel' , 
                           new _root.LzDelegate( forset , "gotRawData" ,
                                                  tloader , "ondata" ) );
        forset.setOption( 'dserrorDel' , 
                           new _root.LzDelegate( forset , "gotError" ,
                                                 tloader , "onerror" ) );
        forset.setOption( 'dstimeoutDel' , 
                           new _root.LzDelegate( forset , "gotTimeout" ,
                                                 tloader , "ontimeout" ) );
    }
    
    var secure = forset.secure;
    if (secure == null) {
        if (this.src.substring(0, 5) == "https") {
            secure = true;
        }
    }

    if (secure) {
        tloader.baserequest = _root.LzBrowser.getBaseURL( secure, forset.secureport );
        //_root.Debug.write('basereq ' + tloader.baserequest);
    }

    tloader.secure = secure;
    if (secure) {
        tloader.secureport = forset.secureport;
    }
    
    return tloader;
}

//==============================================================================
// Interrupts any load in progress for the given dataset.
// @keywords protected
// @param LzDataset forset: The dataset for which to interrupt the load.
//==============================================================================
LzDatasource.prototype.abortLoadForDataset = function ( forset ){
    forset.getOption( "dsloader" ).abort();
}

//==============================================================================
// Returns the amount of time it took the given datset to load
// @param LzDataset forset: The daataset for which to report the load time
// @return Number
//==============================================================================
LzDatasource.prototype.getLoadTimeForDataset = function ( forset ){
    return forset.getOption( "dsloader" ).getLastLoadtime();
}

//==============================================================================
// Returns a boilerplate object to use as the basis for a request passed to 
// a loader. 
// @param String req: The request string
// @param LzDataset forset: The dataset to make the request for
// @return Object
//==============================================================================
LzDatasource.prototype.getBasicLoadParams = function ( req , forset ){
    var o = { lzt: "xmldata" ,
              url : req }

    if ( forset.acceptencodings ){
        o.enc = true;
    }

    if (typeof(forset.timeout) != 'undefined') {
        o.timeout = forset.timeout;
    }

    o.cache = forset.cacheable;

    //@field Boolean clientcacheable: Determines whether the result of the
    //request can be cached on the client. If this is set, it operates 
    //independently of the cacheable attribute. The default for this is the
    //value of the cacheable attribute.
    if ( forset.clientcacheable != null ){
        o.ccache = forset.clientcacheable;
    }

    return o;

}

//==============================================================================
// Get string representation
// @keywords private
// @return: String representation of this object
//==============================================================================
LzDatasource.prototype.toString = function() {
    return "LzDatasource '" + this.name + "'";
}
