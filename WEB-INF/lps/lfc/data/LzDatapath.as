/******************************************************************************
 * LzDatapath.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzDatapath
//

//
//=============================================================================
var LzDatapath = Class( "LzDatapath" , LzDatapointer );

//@field Boolean rerunxpath: By default, this is false for instances
//of <classname>datapointer</classname>, and true for instances of
//<classname>datapath</classname>.
LzDatapath.prototype.rerunxpath = true;

//FIXME [2004-04-13 ows]: Consolidate this definition and the next one.
//field Boolean datacontrolsvisibility: If true, then this view will be
//visible when its datapath matches a data node, and invisible when it
//doesn't match. The default for this attribute is true.

//@field Boolean datacontrolsvisibility: If true, only views that have
//data are visible.  The datapath controls the visibility of its view,
//and the <attribute>visible</attribute> attribute of the view should
//not be used.  It defaults to true.
LzDatapath.prototype.datacontrolsvisibility = true;
LzDatapath.prototype.__LZtakeDPSlot = true;


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapath.prototype.construct = function ( v , args ){
    //@field Lzevent ondata: Sent when the datapath's data changes.
    //@field LzEvent onerror: Sent when the datapath's data results in an error.
    //@field LzEvent ontimeout: Sent when the datapath's data encounters a
    //timeout.

    //@field Boolean pooling: This attribute applies to datapaths
    //which match multiple nodes and force replication. See the
    //section on <a
    //href="${dguide}databinding.html#databinding.pooling">Pooling</a>
    //in the Guide for information about the use of this attribute.

    //@field String replication: Determines whether to use normal or
    //lazy replication, if the datapath matches more than one node.
    //See the section on <a
    //href="${dguide}databinding.html#databinding.replication">Replication</a>
    //in the Guide for information about the use of this attribute.
    
    super.construct( v, args);

    // construct this to prevent undefined property error
    if ( this.immediateparent.data == null ){
        this.immediateparent.data = null;
    }

    if ( args.datacontrolsvisibility != null ){
        this.datacontrolsvisibility = args.datacontrolsvisibility;
    }

    if ( this.__LZtakeDPSlot ){
        this.immediateparent.datapath = this;

        var pdp = this.immediateparent.searchParents( "datapath" ).datapath;
        var tarr = pdp.__LZdepChildren;

        //set it early, so that it's right when xpath first runs
        if ( tarr != null ){
            pdp.__LZdepChildren = [];

            for ( var i =  tarr.length - 1 ; i >= 0 ; i-- ){
                var c = tarr[ i ];
                if ( c != this &&
                    !c.$pathbinding &&
                    c.immediateparent != this.immediateparent &&
                    c.immediateparent.childOf( this.immediateparent )){
                    c.setDataContext( this ,true );
                } else {
                    pdp.__LZdepChildren.push( c );
                }


            }
        }
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapath.prototype.__LZHandleMultiNodes = function ( nodes ){
    //uhoh! this should be a clone

    //Because we're about to start making siblings to this view,
    //(i.e. out of lexical order)
    //make sure that the replicated view has been added to the parent's
    //subview list

    //ok to call if already added

    var clonetype;
    switch ( this.replication ){
        case "lazy":
            clonetype = _root.LzLazyReplicationManager;
            break;
        case "resize":
            clonetype = _root.LzResizeReplicationManager;
            break;
        default:
            clonetype = _root.LzReplicationManager;
            break;
    }

    this.storednodes = nodes;
    var rman = new clonetype( this, this._instanceAttrs);
    delete this.storednodes;

    return rman;

}

//-----------------------------------------------------------------------------
// Normally, replication is started when a datapath xpath binding returns
// multiple nodes. This function overides that behavior and forces replication,
// and replicates over the list of nodes supplied to this function. Note that
// once this function is called, the replication manager is no longer actively
// bound to the data it replicates over by its xpath (if it had one);
// henceforth the replication set can *only* be controlled by calling
// setNodes.
//
// @param [LzDataElement] nodes: A list of LzDataElements to replicate over.
//-----------------------------------------------------------------------------
LzDatapath.prototype.setNodes = function ( nodes ){
    //_root.Debug.write( "before context" ,this.context );
    //this.setDataContext( nodes , false );
    //_root.Debug.write( "context" ,this.context );

    var rman = this.__LZHandleMultiNodes( nodes );

    //__LZHandleMultiNodes will return the replication manager if "this" is a
    //datapath
    if ( !rman ) rman = this;

    rman.__LZsetTracking( null );

    for ( var i = 0; i < nodes.length; i++ ){
        var n = nodes[ i ];
        var own = n.ownerDocument;
        //third arg is an optimization -- if the node is unique, then we
        //know we're not tracking it
        rman.__LZsetTracking( own , true , n != own );
    }

}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDatapath.prototype.__LZsendUpdate = function( upd , upp ) {
    var pchg = this.__LZpchanged;
    if ( !this.__LZdpsendUpdate( upd , upp ) ){
        return false;
    }

    if (  this.immediateparent.isinited ){
        this.__LZApplyData( pchg );
    } else {
        this.__LZneedsUpdateAfterInit = true;
    }

    return true;
}

LzDatapath.prototype.__LZdpsendUpdate = LzDatapointer.prototype.__LZsendUpdate;


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapath.prototype.__LZApplyDataOnInit = function( ) {
    if ( this.__LZneedsUpdateAfterInit ){
        this.__LZApplyData();
        delete this.__LZneedsUpdateAfterInit;
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDatapath.prototype.__LZApplyData = function( force ) {

    var ip = this.immediateparent;

    if ( this.datacontrolsvisibility ){
        this.immediateparent.__LZvizDat = this.p != null; 
        this.immediateparent.__LZupdateShown();
    }

    var cdat = force ||
               ip.data != this.data ||
               this.parsedPath.operator == "attributes";

    this.data = this.data == null ? null : this.data;
    ip.data = this.data;


    if ( cdat ){
        ip.ondata.sendEvent( this.data );
    }

    if ( ( this.parsedPath.operator != null ||
           this.parsedPath.aggOperator != null ) && cdat ){
        ip.applyData( this.data );
    }

}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapath.prototype.setDataContext = function ( p , implicit ){
    if ( p == null && this.immediateparent != null){
        p = this.immediateparent.searchParents( "datapath" ).datapath;
        implicit = true;
    }

    if ( p == this.context ) return;

    if ( implicit ){
        if ( p.__LZdepChildren == null ){
            p.__LZdepChildren = [ this ];
        } else {
            p.__LZdepChildren.push( this );
        }
    } else {
        //not a depedent child
        var dclist = this.context.__LZdepChildren;
        if ( dclist ){
            //remove self from list
            for ( var i = 0; i < dclist.length; i++ ){
                if ( dclist[ i ] == this ){
                    dclist.splice( i , 1 );
                    break;
                }
            }
        }
    }
    // this.callInherited
    this.__LZdpsetDataContext( p );
}

LzDatapath.prototype.__LZdpsetDataContext =
                                        LzDatapointer.prototype.setDataContext;

//-----------------------------------------------------------------------------
// Removes the datapath from its parent
// @keywords private
//-----------------------------------------------------------------------------
LzDatapath.prototype.destroy = function( recur ){
    this.setName = null; //so this can't be assigned
    this.__LZupdateLocked = true; //so won't set data

    if ( !this.context.__LZdeleted && this.context.__LZdepChildren ){
        //remove self from __LZdepChildren
        var dca = this.context.__LZdepChildren;

        if (dca != null) {
            for ( var i = 0; i < dca.length ; i++ ){
                if ( dca [ i ] == this ){
                    dca.splice( i , 1 );
                    break;
                }
            }
        }

    }

    //if immediate parent was deleted, don't worry about the datpaths dependent
    //on this one -- they'll be deleted too
    if ( ! this.immediateparent.__LZdeleted ){
        if ( this.__LZdepChildren.length ){
            //need to assign __LZdepChildren to parent
            var dnpar = this.immediateparent.searchParents( "datapath" ).
                                                                    datapath;

            for ( var i = 0; i < this.__LZdepChildren.length ; i++ ){
                this.__LZdepChildren[ i ].setDataContext( dnpar , true );
            }

        }
    }

    if ( this.immediateparent.datapath == this ){
        delete this.immediateparent.datapath;
    }

    super.destroy( recur );
}

//-----------------------------------------------------------------------------
// This method is used to transfer any values that may have been edited
// in a datamapped UI control back to the dataset. If the current
// datapath's <attribute>xpath</attribute> ends in a terminal selector
// (an attribute, <code>text()</code>, or <code>name()</code>
// expression), then the datapath attempts to call its parent's
// <method>updateData</method> method. If this method is defined, the
// datapath sets the data element's attribute, text, or name,
// respectively, to <method>updateData</method>'s return value. The
// method then calls any other <method>updateData</method> on any
// datapaths which depend on this one for context.
//
// In short, to make datamapping work both ways for a given UI
// control, define a <method>updateData</method> method that returns
// the value for the data mapped to the node.  This is already done
// for the base <classname>LzInputText</classname> class, but not
// for any other LFC classes.
//
//-----------------------------------------------------------------------------
LzDatapath.prototype.updateData= function( ){

    if ( !arguments[ 0 ] ){
        this.p.__LZlockFromUpdate( this );
    }

    var ppdo = this.parsedPath.operator;
    if ( this.immediateparent.updateData && ppdo != null){
        var dat = this.immediateparent.updateData();
        if ( ppdo =="nodeName" ){
            this.setNodeName( dat );
        } else  if ( ppdo =="__LZgetText" ){
            this.setNodeText( dat );
        } else  if ( ppdo =="attributes" ){
            this.p.setAttrs( dat );
        } else {
            //remove the "attributes." from the operator
            this.setNodeAttribute( ppdo.substring( 11 ) , dat );
        }
    }

    if (this.__LZdepChildren != null) {
        for ( var i = 0; i < this.__LZdepChildren.length; i++ ){
            this.__LZdepChildren[ i ].updateData( true );
        }
    }

    if ( !arguments[ 0 ] ){
        this.p.__LZunlockFromUpdate( this );
    }


}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapath.prototype.retrieveData= function( ){
    if ( $debug ){
        _root.Debug.write( "LzDatapath.retrieveData is deprecated."+
                           "The new name for this method is 'updateData'");
    }
    return this.updateData( );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapath.prototype.__LZHandleDocChange = function ( who ){
    if ( this.__LZdpHandleDocChange( who ) ){
        this.immediateparent.ondata.sendEvent( this.data );
        this.onDocumentChange.sendEvent( who );
    }
}


LzDatapath.prototype.__LZdpHandleDocChange  =
                            LzDatapointer.prototype.__LZHandleDocChange;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapath.prototype.toString = function( ){
    return "Datapath for " + this.immediateparent;
}


// these are the events that datapaths publish. This is used by the replication
// manager to copy and delegates that are registered when it replaces the
// original datapath
LzDatapath.prototype._dpevents = [ 'ondata' , 'onerror' , 'ontimeout' ];

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDatapath.prototype.__LZcheckChange = function ( chgpkg ){
    if ( !this.__LZdpcheckChange( chgpkg ) ){
        if ( chgpkg.who.childOf( this.p , true ) ){
            this.onDocumentChange.sendEvent( chgpkg );
        }
    }
}
LzDatapath.prototype.__LZdpcheckChange =
                    LzDatapointer.prototype.__LZcheckChange;

//-----------------------------------------------------------------------------
// Overrides LzDatapointer.__LZsetTracking to handle the additive case
//
// @param who: the node to track
// @param Boolean additive: (default false) if true, add additional
// nodes to track, rather than changing the node
// @param Boolean needscheck: (default false) if additive is true, set
// this to true to check that you are not adding a duplicate
//
// @keywords private
//-----------------------------------------------------------------------------
LzDatapath.prototype.__LZsetTracking = function ( who, additive, needscheck ) {
#pragma 'warnUndefinedReferences=true'
    var tracking;
    var trackDel;
    // If setting tracking to null or not in additive mode, just
    // invoke the superclass method, forcing tracking
    if ((! who) || (! additive)) {
        return super.__LZsetTracking(who, true);
    }
    tracking = this.__LZtracking;
    trackDel = this.__LZtrackDel;
    // This appears to be an assumption of the previous
    // implementation.  Check that it is true.
    if ($debug) {
        if (! (tracking instanceof Array)) {
            Debug.error('%w.__LZtracking is %w, expecting an array', this, tracking);
        }
    }
    // Are we already tracking this?
    if ( needscheck ){
        var l = tracking.length;
        for ( var i = 0; i < l; i++ ) {
            if( tracking[ i ] === who ) {
                return;
            }
        }
    }
    // Additive mode, so don't unregister any previous
    // Always track, even if no xpath
    // Ensure you have a delegate
    if (! trackDel ){
        this.__LZtrackDel = trackDel = new _root.LzDelegate(this , "__LZcheckChange");
    }
    // Note that you are tracking
    tracking.push( who );
    trackDel.register( who , "onDocumentChange" );
}

LzDatapath.prototype.setters.__LZmanager = "__LZsetCloneManager";
LzDatapath.prototype.__LZisclone = false;

//==============================================================================
// @keywords private
//==============================================================================
LzDatapath.prototype.__LZsetCloneManager = function( m ) {
    this.__LZisclone = true;
    this.immediateparent.cloneManager = m;
    this.parsedPath = m.parsedPath;
    this.xpath = m.xpath;
    this.setDataContext( m );
}

//==============================================================================
// Called by the clone manager to point the datapath to the right node
// @keywords private
//==============================================================================
LzDatapath.prototype.setClonePointer = function( p ) {
    var pc = this.p !=p;
    this.p = p;

    if ( pc ) {

        if ( this.sel != p.sel ){
            this.sel = p.sel || false;
            this.immediateparent.setSelected( this.sel );
        }

        this.__LZpchanged = true;
        this.__LZsetData( );
    }
}

//==============================================================================
// Orders the replicated nodes based on the value of the path passed in.
//
// @param String xpath: An XPath giving the value to use for comparison.
// @param Function|String comparator: See the <param>comparator</param>
// parameter of <method>setComparator</method> for details.
//==============================================================================
LzDatapath.prototype.setOrder = function( xpath , comparator ) {
    if ( this.__LZisclone ){
        this.immediateparent.cloneManager.setOrder( xpath , comparator );
    } else {
        //@field String sortpath: An XPath to use to obtain the sort key for
        //sorting if replication occurs. To change this attribute, call
        //the setOrder method.
        this.sortpath = xpath;
        //might be a function...
        if ( comparator || comparator != null ){
            //@field String|Function sortorder: The order to use to
            //sort the dataset if replication occurs. One of
            //<code>ascending</code> or <code>descending</code> to use
            //built in dictionary sort, or a function which compares
            //two strings and returns <code>1</code> if the strings
            //are in order, <code>0</code> if they are the same, and
            //<code>-1</code> if they are out of order. To change this
            //attribute, call the setOrder or setComparator method.
            this.sortorder = comparator;
        }
    }
}

//-----------------------------------------------------------------------------
// Sets the comparator for the sort used by the replication manager.
//
// @param Function|String comparator: "ascending" or "descending" for the
// appropriate dictionary sort, or a function to be used for comparison that
// takes two arguments and returns 1 if the second argument should follow the
// first, -1 if the first argument should follow the second, and 0 if the two
// arguments are equivalent
//-----------------------------------------------------------------------------
LzDatapath.prototype.setComparator = function( comparator ) {
    if ( this.__LZisclone ){
        this.immediateparent.cloneManager.setComparator( comparator );
    } else {
        this.sortorder = comparator;
    }
}


//==============================================================================
// @keywords private
//==============================================================================
LzDatapath.prototype.setSelected = function( torf ){
    this.p.sel =  torf;
    this.sel = torf;
    this.immediateparent.setSelected( torf );
}

//==============================================================================
// @keywords private
//==============================================================================
LzDatapath.prototype.__LZgetLast = function( ){
    if ( this.__LZisclone ) return this.context.nodes.length;

    else if ( this.p == this.context.getContext() &&
              this.context.__LZgetLast ){
        return this.context.__LZgetLast();
    }

    return 1;
}

//==============================================================================
// @keywords private
//==============================================================================
LzDatapath.prototype.__LZgetPosition = function( ){
    if ( this.__LZisclone ) return this.immediateparent.clonenumber + 1;

    else if ( this.p == this.context.getContext() &&
              this.context.__LZgetPosition ){
        return this.context.__LZgetPosition();
    }

    return 1;
}
