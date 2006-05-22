/******************************************************************************
 * LzLoader.as
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzLoader
// @keywords private
//=============================================================================
LzLoader = function ( owner , args ){
    this.mc = args.attachRef == null ? owner.__LZmovieClipRef : args.attachRef;

    if ( args.attachRef == null && args.attachname != null ){
        this.mc.attachMovie( "empty" , args.attachname , this.newContextDepth );
        this.mc = this.mc[ args.attachname ];
    }

    this.loadmcnum = 1;
    this.loadmcdepth = 1;
    this.loadmclist = [];

    if (args.timeout != null) {
        this.timeout = args.timeout;
    }

    this.owner = owner;

    // For SOLO requests, we need to make an idle task to
    // split up the work of copying the Flash XML tree into an LzDataNode tree
    this.copyTaskDel = new _root.LzDelegate( this , "copyFlashData" );

}

// Because this is not created by Class
LzLoader.prototype.classname = "LzLoader";

//---
// @keywords private
// (not really, but the doc tools will complain
//---
LzLoader.prototype.destroy = function () {
    // [2005-08-25 ptw] Hosie doorknob black magic: removing a movie
    // clip from anywhere will magically delete any properties that
    // reference it (i.e., all movieclip references are weak,
    // apparently).
    this.mc.removeMovieClip();
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.startCopyTask = function ( ){
    //    _root.Debug.write("starting copy idle task ");
    this.copyTaskDel.register( _root.LzIdle, "onidle" );
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.removeCopyTask = function() {
    // Remove copyTask delegate
    //    _root.Debug.write("removing copy idle task ", this);
    this.copyTaskDel.unregisterAll();
    this.copyQueue = null;
}


LzLoader.prototype.timeout = 30000;
LzLoader.prototype.doPersist = false;
LzLoader.prototype.doCacheRequest = true;

LzLoader.prototype.attachDepth = 9;
LzLoader.prototype.minHeader = 10;

LzLoader.prototype.queuing = false;

LzLoader.prototype.secure = false;
LzLoader.prototype.secureport = null;

LzLoader.prototype.newContextDepth = 3238;
LzLoader.prototype.proxied = true;


if ($debug) {
//---
// Set to true to monitor loadMovie state changes when debugging
// @keywords private
//---
LzLoader.__LZmonitorState = false;

//---
// Annotate loadobj for debugging
//
// Can be used by subclasses that provide their own loadobj.  Cf.,
// LzMediaLoader
//
// @param MovieClip loadobj: the clip to annotate
// @param String typename: the typename to use, default 'LoadObj'
//---
LzLoader.debugLoadObj = function (loadobj, typename) {
    if (arguments.length < 2) {
        typename = 'LoadObj';
    }
    //---
    // @keywords private
    //---
    loadobj._dbg_name = function () {
        with (this) {
            var state = valid?"initialized":"invalid";
            // Decode boolean flags into state.  Order is important.
            if (loading) { state = valid?"loading":"aborting"; }
            if (loaded) { state = valid?"loaded":"aborted"; }
            if (timedout) { state = "timedout"; }
            // TODO: [2005-08-11 ptw] LzURL should be able to
            // parse a relative URL
            var url = (new LzURL(this.reqobj.url)).file;
            if (! url) { url = this.reqobj.url; }
            return Debug.formatToString("%s (%s)", url, state);
        }
    };
    loadobj._dbg_typename = typename;
    // Monitor state variables if requested
    if (LzLoader.__LZmonitorState) {
        loadobj.valid = null;
        Debug.monitor(loadobj, 'valid');
        loadobj.loaded = null;
        Debug.monitor(loadobj, 'loaded');
        loadobj.loading = null;
        Debug.monitor(loadobj, 'loading');
        loadobj.lmcnum = null;
        Debug.monitor(loadobj, 'lmcnum');
        loadobj.timedout = null;
        Debug.monitor(loadobj, 'timedout');
    }
};
}

//==============================================================================
// This creates an initial movie that we keep state on.  LzLoadQueue
// will attach a movie to that to load the actual resource into.  We
// can't use the same movie, because loading replaces all attributes.
// We have to use a movie here instead of an object, because movies
// can only be attached to movies.
//
// @keywords private
//==============================================================================
LzLoader.prototype.getLoadMovie = function ( ){
    // Attach normal empty movie
    if ( this.loadmclist[ 0 ].loaded ){
        var newmc = this.loadmclist.shift();
    } else {
        var lmname = "loadmc" + this.loadmcdepth;
        if (this.mc[lmname]) {
            Debug.error("%w.mc[%s]: %w", this, lmname, this.mc[lmname]);
        }
        this.mc.attachMovie( "empty" , lmname , this.loadmcdepth );
        var newmc = this.mc[ lmname ];
        newmc.loader = this;
        newmc.mc = newmc;
        this.loadmcdepth++
        if ($debug) {
            LzLoader.debugLoadObj(newmc);
        }
    }

    this.loadmclist.push ( newmc );
    return newmc;
}

//==============================================================================
//
// [1] A movieclip whose _parent is the loader request movieclip [see getLoadMovie()]
//
// [2] A Flash XML Object (holding the response from a serverless data
// request) which is also the object referred to in the various
// bookeeping for queues, timeouts, etc.
//
// @param loadobj: the request object that is being handled
// @param data: An LzDataElement tree to attach to specified dataset
// @keywords private
//==============================================================================
LzLoader.prototype.returnData = function ( loadobj , data ){
    // Check if returnData has already been called on this
    // object. This can happen if a serverless data load timed out in
    // the LFC, but eventually returned something via the
    // LoadVars.sendAndLoad() callback.
    if (loadobj.loaded) {
        if ($debug) {
            Debug.warn("%w.returnData: %w already loaded",
                       this, loadobj);
        }
        return;
    }

    if (loadobj instanceof MovieClip) {
        // Nothing to do
    } else if (loadobj instanceof XMLNode) {

        // Do a fixup to add one extra level of data node to the data,
        // to be compatible with what the DataCompiler produces.
        var ndata = new LzDataElement('resultset');

        // The raw XML response string was stashed here by LzLoadQueue.serverlessOnDataHandler
        // TODO [2005-08-11 ptw] Is there not an issue that there
        // could be multiple requests?
        if (this['rawtext']) {
            ndata.rawtext = this.rawtext;
        }

        if (typeof(data) != 'undefined') {
            if (loadobj.proxied) {
                // proxied req gets back <resultset><body>XML</body><headers/></resultset>
                ndata.setChildNodes([data.childNodes[0].childNodes[0]]);
            } else {
                // SOLO, we get back raw XML only
                ndata.setChildNodes([data]);
            }
        }

        data = ndata;
    } else {
        if ($debug) {
            Debug.error("%w.returnData: unhandled loadobj %w", this, loadobj);
        }
    }

    // Ok, we have loaded this.  loadFinished changes state of loadobj
    // from loading to loaded.

    // TODO [2005-08-11 ptw] If this were a multi-threaded system, we
    // would have to worry about getLoadMovie trying to reuse the
    // loadobj before we have finished with it.

    // [2005-08-25 ptw] So, we don't want to mark the clip as loaded
    // if this is a persistent connection?  Not sure what that means.
    if ( ! this.doPersist ) _root.LzLoadQueue.loadFinished( loadobj );

    // [2005-08-25 ptw] Is this correct?  Do we really want an aborted
    // request to signal that it timed out?
    if ( ! loadobj.valid ) {
        this.doTimeOut(loadobj);
        return;
    }

    this.lastloadtime = getTimer() - loadobj.loadtime;

    var err;
    if ( data.childNodes[0].nodeName == "error") {
        err = data.childNodes[0].attributes.msg;
    } else if (data.nodeName == "error") {
        err = data.attributes.msg;
    } else if (data == "medialoaderror") {
        err="Media load error";
    }

    if ( err != null ){
        Debug.error( err );
        this.onerror.sendEvent( data );
        return;
    }

    if ( this.queuing ){
        loadobj.data = data;

        while ( this.expectedList.length &&
                this.expectedList[ 0 ].loaded ){
            var tlmc = this.expectedList.shift();
            if ( tlmc.timedout ){
                this.doTimeOut(tlmc);
            } else if( tlmc.data ){
                this.ondata.sendEvent( tlmc.data );
                tlmc.data = null;
            }
        }
    } else {
        if ( loadobj.timedout ){
            this.doTimeOut(loadobj);
        } else if( data ){
            this.ondata.sendEvent( data );
        }
    }
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.getLastLoadtime = function ( ){
    return this.lastloadtime;
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.abort = function ( req ){
    if (arguments.length < 1) {
        if ( this.queuing ) {
            req = this.expectedList.pop( );
        } else {
            req = this.lastrequest;
        }
    }
    req.valid = false;
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.initializeRequestObj = function (loadobj) {
    loadobj.seqnum = this.loadmcnum++;

    // Set by LzLoadQueue.loadFinished
    
    // N.B.: Although these flags (loaded, loading) on loadobj are
    // defined in LzLoader, they are the province of LzLoadQueue.  The
    // modularity here is badly broken.

    // TODO [2005-08-11 ptw] If this were a multi-threaded system, we
    // would have to worry about getLoadMovie trying to reuse the
    // loadobj before we have initialized it.
    loadobj.loaded = false;
    loadobj.loading = false;
    loadobj.data = null;
    // N.B. Do _NOT_ re-initialize lmcnum.  See comment in
    // LzLoadQueue.loadMovieProxiedOrDirect

    // Set to false if aborted
    loadobj.valid = true;

    // TODO [2005-08-22 ptw] If this is a reused loadobj, won't this
    // preserve the previous timeout, when it shouldn't?
    if (typeof(loadobj.timeout) == 'undefined') {
        loadobj.timeout = this.timeout;
    }
    loadobj.timedout = false;

    if ( this.queuing ){
        if ( this.expectedList ) {
            this.expectedList.push( loadobj );
        } else {
            this.expectedList= [ loadobj ];
        }
    } else if( this.lastrequest != loadobj ){
        // Superceding an existing request
        // [2005-08-17 adam] when the request gets made, there's no
        // reliable way to hang up (all of them can cause crash to
        // Flash in various configs.) so the LFC just ignores the
        // response if you've made another request in the interim.
        if (this.lastrequest) {
            if (! this.lastrequest.loaded) {
                this.lastrequest.valid = false;
            }
        }
        this.lastrequest = loadobj;
    }

    loadobj.secure = this.secure;
    loadobj.secureport = this.secureport;

    loadobj.loader = this;
}

//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.request = function ( o ){
    var lmv = this.getLoadMovie( );

    if (typeof(o.cache) == "undefined" || o.cache == null) {
        o.cache = this.doCacheRequest;
    }

    this.initializeRequestObj(lmv);

    if (typeof(o.timeout) != 'undefined') {
        lmv.timeout = o.timeout;
    }

    lmv.lzt = o.lzt;

    if (typeof(o.proxied) != undefined && o.proxied != null) {
        lmv.proxied = o.proxied;
    } else {
        lmv.proxied = canvas.isProxied();
    }

    lmv.reqobj = o;
    // pass the swf version as a query arg named "lzr" := swf6 | swf7
    o.lzr = _root.canvas.runtime;

    _root.LzLoadQueue.enqueueRequest( lmv );
    this.onrequest.sendEvent(o);
}

//==============================================================================
// Request a direct (serverless) data load using Flash XML object
// @keywords private
//==============================================================================
LzLoader.prototype.requestDirectXML = function ( o ){
    this.initializeRequestObj(o);
    _root.LzLoadQueue.enqueueRequest( o );
    // We should probably be passing something other than the obj itself to
    // the onrequest event
    this.onrequest.sendEvent(o);
}

//==============================================================================
// @keywords private
// @param MovieClip loadobj: the LoadMovie to unload, defaults to the
// lastrequest
//==============================================================================
LzLoader.prototype.unload = function ( loadobj ){
    if (arguments.length < 1) {
        loadobj = this.lastrequest;
    }
    if (loadobj) {
        //if it hasn't loaded yet
        loadobj.valid = false;
        if (typeof(loadobj) == "movieclip") {
            if ( loadobj.lmc ) {
                //unloadMovie DOESN'T WORK in some browsers -- e.g. Mac IE 5.2
                //and Netscape 4.7
                //this.lastrequest.lmc.unloadMovie(  );
                loadobj.lmc.removeMovieClip(  );
                delete loadobj.lmc;
            }
        } else {
            // the request object is a SOLO XML node
            // Is there ANY way to abort the LoadVars.sendAndLoad() which may be still open?
        }
        if (this.lastrequest === loadobj) {
            this.lastrequest = null;
        }
        _root.LzLoadQueue.unloadRequest( loadobj );
    }
}


//==============================================================================
// @keywords private
// @param MovieClip loadobj: the LoadMovie that timed out, defaults to
// the lastrequest
//==============================================================================
LzLoader.prototype.doTimeOut = function ( loadobj ){
    if (arguments.length < 1) {
        loadobj = this.lastrequest;
    }
    if (loadobj) {
        this.unload(loadobj);
        this.ontimeout.sendEvent( loadobj.reqobj.dataset );
    }
}

if ($debug) {
//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype._dbg_name = function () {
    var lr = this.lastrequest;
    if (this.queueing) {
        var el = this.expectedList;
        if (el && el.length > 0) {
            lr = this.expectedList[0];
        }
    }
    if (lr) {
        return Debug.formatToString("%w", lr);
    } else {
        return "idle";
    }
}
}

// Recursively copy a Flash XML(Node) tree into a LzDataElement
// tree. Used by LzDataNode.stringToLzData
//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.copyFlashXML = function (node, trimwhitespace, stripnsprefix) {
    var nv = node.nodeValue;
    var lfcnode = null;
    // text node?
    if (node.nodeType == 3) {
        if (trimwhitespace == true) {
            nv = LzDataNode.trim(nv);
        }
        lfcnode = new LzDataText(nv);
    } else {
        // slow but sure way to copy attributes
        var nattrs = node.attributes;
        var cattrs = {};
        for (var key in nattrs) {
            var nkey = key;
            if (stripnsprefix) {
                var colpos = key.indexOf(':');
                if (colpos >= 0) {
                    nkey = key.substring(colpos+1);
                }
            }
            cattrs[nkey] = nattrs[key];
        }

        var nname = node.nodeName;
        if (nname && stripnsprefix) {
            var npos = nname.indexOf(':');
            if (npos >= 0) {
                nname = nname.substring(npos+1);
            }
        }

        lfcnode = new LzDataElement(nname, cattrs);
        var children = node.childNodes;
        var newchildren = [];
        for (var i  = 0; i < children.length; i++ ) {
            var child = children[i];
            var lfcchild = LzLoader.prototype.copyFlashXML(child, trimwhitespace, stripnsprefix);
            newchildren[i] = lfcchild;
        }
        lfcnode.setChildNodes(newchildren);
    }
    return lfcnode;
}

// Holds the state of the copy queue.
// {ptr: int   where we are in the queue
//  q: array of pending work, entries are XMLNodes to be copied.
//  xmlobj: the root Flash XML node we started with
// }
//
LzLoader.prototype.copyQueue = null;

// Task that is called periodically from Idle loop.
// This does the work of copying the Flash XML tree into a LzDataNode tree.
// Run the copy queue
//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.copyFlashData = function () {
    //    _root.Debug.write("copyFlashData [1]", this.copyQueue.ptr);
    if (this.copyQueue != null) {
        //_root.Debug.write("copyFlashData [2]");
        this.queuedCopyFlashXML_internal();
    } else {
        this.removeCopyTask();
    }
}


// Set up the work queue
//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.queuedCopyFlashXML = function(xmlnode) {
    var rootnode = new LzDataElement('body');
    this.lfcrootnode = rootnode;
    rootnode.ownerDocument = rootnode;
    xmlnode._lfcparent = rootnode;
    var queue = [xmlnode];
    // set up the work queue
    this.copyQueue = {ptr: 0, q: queue, xmlobj: xmlnode};
    this.trimwhitespace = xmlnode.trimwhitespace;
    var dset = xmlnode.dataset;
    //Debug.write("dset.nsprefix=", dset.nsprefix, "queuedCopyFlashXML, dataset = ", dset);
    this.nsprefix = dset.nsprefix; // preserve namespace prefix
    this.queuedCopyFlashXML_internal();
    this.startCopyTask();
}

LzLoader.prototype.copyLoopsPerFrame = 1000;
LzLoader.prototype.maxLoopTime = 2000; // 2 seconds

// Iterative implementation, using a queue, to translate a XMLNode tree into
// a tree of LzDataNode.
//
// Queue contains list of XMLNodes to be copied
//==============================================================================
// @keywords private
//==============================================================================
LzLoader.prototype.queuedCopyFlashXML_internal = function () {
    var ptr = this.copyQueue.ptr;
    //    _root.Debug.write("enter queuedCopyFlashXML_internal", ptr);
    var q = this.copyQueue.q;
    var iter = 0;
    var maxiter = this.copyLoopsPerFrame;
    var loopstart = (new Date).getTime();
    //    _root.Debug.write("entering queuedCopyFlashXML_internal (ptr, q.len)", ptr, q.length );
    while (ptr < q.length && iter++ < maxiter) {

        // check time once every 100 iterations
        if ((iter % 100) == 0) {
            var elapsed = (new Date).getTime() - loopstart;
            if (elapsed > this.maxLoopTime) {
                //_root.Debug.write("too much time in queuedCopyFlashXML_internal, break");
                break;
            }
        }

        var node = q[ptr++];
        var lfcparent = node._lfcparent;
        delete node._lfcparent;
        var nv = node.nodeValue;
        var lfcnode = null;

        // text node?
        if (node.nodeType == 3) {
            if (this.trimwhitespace == true) {
                nv = LzDataNode.trim(nv);
            }
            lfcnode = {__proto__: LzDataText.prototype, data: nv, parentNode: lfcparent};
        } else {
            // Do we need to copy attributes list as well?
            // After this works, try bashing the __proto__
            // and see if GC still works.

            var stripnsprefix = !this.nsprefix;
            var cattrs;

            if (stripnsprefix) { 
                // this is an expensive operation
                cattrs = {};
                for (var key in nattrs) {
                    var nkey = key;
                    if (stripnsprefix) {
                        var colpos = key.indexOf(':');
                        if (colpos >= 0) {
                            nkey = key.substring(colpos+1);
                        }
                    }
                    cattrs[nkey] = nattrs[key];
                }
            } else {
                // this is the fast path 
                cattrs = node.attributes;
                cattrs.__proto__ = oproto;
                cattrs.constructor = Object;
                ASSetPropFlags(cattrs, ['__proto__', 'constructor'], 1, 7);
            }

            //lfcnode = new LzDataElement(node.nodeName, cattrs);

            ////////

            var nodename = node.nodeName;
            if (nodename && !this.nsprefix) {
                var npos = nodename.indexOf(':');
                if (npos >= 0) {
                    nodename = nodename.substring(npos+1);
                }
            }

            lfcnode = { __proto__: LzDataElement.prototype,
                        nodeName: nodename,
                        attributes: cattrs,
                        ownerDocument: lfcparent.ownerDocument,
                        parentNode: lfcparent};

        }

        // Add to the parent's childnodes.
        if (lfcparent.childNodes == null) {
            lfcparent.childNodes = [lfcnode];
        } else {
            lfcparent.childNodes.push(lfcnode);
        }

        // queue the XMLNode children for processing
        var children = node.childNodes;
        if (children != null) {
            for ( var i = 0; i < children.length; i++ ){
                var c = children[i];
                c._lfcparent = lfcnode;
                q[q.length] = c;
            }
        }
    }
    this.copyQueue.ptr = ptr;
    //_root.Debug.write("leaving queuedCopyFlashXML_internal main loop", ptr, iter);
    if (ptr >= q.length) {
        //_root.Debug.write("entering queuedCopyFlashXML_internal post-copy cleanup", ptr, q.length);
        // If we get here, we're finished with the tree copy.
        // Unregister the idle loop handler
        var xmlobj = this.copyQueue.xmlobj;
        this.removeCopyTask();
        // Proceed with getting this dataset returned to the customer
        //_root.Debug.write("calling loader.returnData root node");
        xmlobj.loader.returnData(xmlobj, this.lfcrootnode.childNodes[0]);
    }
}
