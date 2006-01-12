/******************************************************************************
 * LzReplicationManager.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzReplicationManager
//
// A replication manager controls the replication of views as a result of 
// multiple matches to a datapath's xpath. When a datapath matches more than
// one node, it immediate halts its own processing and creates a replication 
// manager to take over management of that datapath. If the view that contained
// the datapath being replicated was named, the replication manager assumes that
// name, so that it can be referred to the same way the non-replicated view
// would have been. 
//=============================================================================
var LzReplicationManager = Class( "LzReplicationManager" , LzDatapath );

LzReplicationManager.prototype.pooling = false;
LzReplicationManager.prototype.setters.sortpath = "setOrder";
LzReplicationManager.prototype.setters.sortorder = "setComparator";
LzReplicationManager.prototype.setters.datapath = "setXPath";
LzReplicationManager.prototype.asyncnew = true;
LzReplicationManager.prototype.datacontrolsvisibility = false;
LzReplicationManager.prototype.__LZtakeDPSlot = false;
LzReplicationManager.prototype.visible = true;
LzReplicationManager.prototype.__LZpreventXPathUpdate = false;

LzReplicationManager.prototype.__LZdataoffset = 0;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.construct = function ( odp , args ){
    //odp: original datapath
    var view = odp.immediateparent;

    //this is so that when it looks like you're refering to the view in source
    //you can say view.datapath and you'll get what you want (which is this)
    this.datapath = this;

    //null, or name of view that was replicated
    var name =  view._instanceAttrs.name;
    args.name = name;
    // remove view we replace to avoid warning in LzNode.setName
    delete view.immediateparent[name];
    delete view.parent[name];

    //same deal for id
    var id =  view._instanceAttrs.id;
    args.id = id;
    // remove view we replace to avoid warning in LzNode.setName
    delete _root[id];

    //don't want to rerunxpath
    args.xpath = this._ignoreAttribute;

    //copy sortpath and sortorder from odp, if they were set
    if ( odp.sortpath != null ){
        args.sortpath = odp.sortpath;
    }

    if ( odp.sortorder != null || odp.sortorder ){
        args.sortorder = odp.sortorder;
    }

    //store nodes for constructWithArgs
    this.initialnodes = odp.storednodes;
    if ( odp.__LZspecialDotDot ){
        this.__LZspecialDotDot = true;
        if ( odp.__LZdotdotCheckDel ){
            odp.__LZdotdotCheckDel.unregisterAll();
        }
        delete odp.__LZspecialDotDot;
    }
        

    //the real parent for this is datapaths view's (immediateparent) parent
    super.construct( view.parent, args);

    if ( view.parent != view.immediateparent ){
        view.immediateparent[ args.name ] = this;
    }

    //already have nodes when inited
    this.xpath = odp.xpath;
    this.parsedPath = odp.parsedPath;

    this.cloneClass = view.class;

    this.cloneParent = view.parent;

    //add clone transformer to original instance attributes
    this.cloneAttrs = { datapath: this._ignoreAttribute,
                        $datapath: { name  : 'LzDatapath' ,  
                                     attrs : { datacontrolsvisibility: 
                                                    odp.datacontrolsvisibility,
                                                __LZmanager : this }  },
                        id : this._ignoreAttribute ,
                        name : this._ignoreAttribute };


    var hadxpathconstraint = false;
    if ( view._instanceAttrs.$refs.datapath ) {
        //<view datapath="${ ... }"/>
        //we need to mask this
        this.cloneAttrs.$refs = { datapath  : this._ignoreAttribute,
                                  __proto__ : view._instanceAttrs.$refs};
        //but, we want the constraint to apply to this object instead
        var cons = view._instanceAttrs.$refs.datapath;

        this._t = cons.dependencies;
        hadxpathconstraint = true;

        this.__LZpreventXPathUpdate = true;
        this.applyConstraint( 'xpath', cons, this._t() );
        this.__LZpreventXPathUpdate = false;
    } else if ( odp._instanceAttrs.$refs.xpath ){
        //<view><datapath xpath="${ ... }"/>

        //we want the constraint to apply to this object instead
        var cons = odp._instanceAttrs.$refs.xpath;

        this._t = cons.dependencies;
        hadxpathconstraint = true;

        this.__LZpreventXPathUpdate = true;
        this.applyConstraint( 'xpath', cons, this._t() );
        this.__LZpreventXPathUpdate = false;
    }


    this.__LZsetCloneAttrs();
    this.cloneAttrs.__proto__ = view._instanceAttrs;

    this.cloneChildren = view._instanceChildren.concat();

    this.visible = odp.datacontrolsvisibility || view.visible;

    if ( args.pooling != null ){
        this.pooling = args.pooling;
    }
    
    var mycontext = odp.context;

    //clone pool is used to store available views   
    this.clones = [];
    this.clonePool = [ ];

    if ( this.pooling ){
        odp.__LZsetCloneManager( this );
        //make sure that the original view and datapath don't get their xpath 
        //set by a constraint..
        if ( hadxpathconstraint ){
            odp.setXPath =  _root.LzReplicationManager.__LZemptyFuntion;
        }
        this.clones.push ( view );
        // Because we're about to start making siblings to this view, (i.e. out
        // of lexical order) make sure that the replicated view has been added
        // to the parent's subview list. Also, it's ok to call this if view was
        // already added
        view.immediateparent.addSubview ( view );
    } else {
        view.destroy();
    }

    this.setDataContext( mycontext , mycontext instanceof _root.LzDatapointer);
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.__LZemptyFuntion = function ( ){
    return;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.constructWithArgs = function ( args ){
    this.__LZHandleMultiNodes( this.initialnodes );
    delete this.initialnodes;
    if ( this.visible == false ){
        this.setVisible( false );
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.getNodeOffset = function ( p ){
    if (this.nodes != null) {
        for ( var i = 0; i < this.nodes.length; i++ ){
            if ( p == this.nodes[ i ] ){
                return i;
            }
        }
    }
}
    
//-----------------------------------------------------------------------------
// Retuns a pointer to the nth clone controlled by the replication manager
// @param Number n: The zero-based offset of the clone to retrieve
// @return LzView: A pointer to the nth clone
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.getCloneNumber = function ( n ){
    return this.clones[ n ];
}

//==============================================================================
// @keywords private
//==============================================================================
LzReplicationManager.prototype.__LZHandleNoNodes= function( n ) {
    this.nodes = [];
    while ( this.clones.length ){
        if ( this.pooling ){
            this.poolClone();
        } else {
            var v = this.clones.pop();
            this.destroyClone( v );
        }
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.__LZHandleSingleNode = function ( n ){ 
    this.__LZHandleMultiNodes( [n] );
}

//==============================================================================
// @keywords private
//==============================================================================
LzReplicationManager.prototype.mergesort = function ( arr , l , h ) {
    if ( l < h ) {
        var m = l + Math.floor ( (h - l) / 2 );
        var a = this.mergesort( arr , l , m );
        var b = this.mergesort( arr , m+1 , h );
    } else if( arr.length == 0 ) {
        return [];
    }
    else {
        return [ arr[ l ] ];
    }

    //now merge
    var r=[];
    var ia = 0;
    var ib = 0;
    var al = a.length
    var bl = b.length
    while ( ia < al && ib < bl ){
        if ( this.orderf( b[ ib ] , a[ ia ] ) == 1 ){
            r.push( b[ ib++ ] );
        } else {
            r.push( a[ ia++ ] );
        }
    }
    while ( ia < al ) r.push( a[ ia++ ] );
    while ( ib < bl ) r.push( b[ ib++ ] );

    return r;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.__LZHandleMultiNodes = function ( n ){
    this.hasdata = true;
    var lastnodes = this.nodes;
    //@field nodes: The nodes that this replication manager will map to views
    this.nodes = n;
    this.onnodes.sendEvent( this.nodes );

    if ( this.__LZspecialDotDot ) this.__LZsetupDotDot( n[ 0 ] );

    if ( this.orderpath != null ){
        this.nodes = this.mergesort( this.nodes , 0 , this.nodes.length - 1 );
    }

    this.__LZadjustVisibleClones( lastnodes , true );


    for ( var i = 0; i < this.clones.length ; i++ ){
        var cl = this.clones[ i ] ;
        var iplusoffset = i + this.__LZdataoffset; 
        cl.clonenumber = iplusoffset ;
        cl.datapath.setClonePointer( this.nodes[ iplusoffset ] );
        cl.onclonenumber.sendEvent( iplusoffset );
    }
    

    //@field [LzNode] clones: The LzNodes which this LzReplicationManager
    //has created.
    this.onclones.sendEvent( this.clones );


}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.__LZadjustVisibleClones = function( lastnodes , 
                                                                   newnodes){
    var stpt = this.__LZdiffArrays( lastnodes , this.nodes);

    if ( ! this.pooling ) {
        while ( this.clones.length > stpt ){
            var v = this.clones.pop();
            this.destroyClone( v );
        }
    }

    //this makes sure that children created as a result of data replication
    //init in order
    _root.LzInstantiator.enableDataReplicationQueuing( );
    while ( this.nodes.length > this.clones.length ){
        this.clones[ this.clones.length ] = this.getNewClone();
    }
    _root.LzInstantiator.clearDataReplicationQueue( );

    while ( this.nodes.length < this.clones.length ){
        //this condition can only be reached if pooling is turned on
        this.poolClone();
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.orderf = function ( a , b ){
    //a and b are dataset nodes


    var op = arguments.callee.op;

    this.p = a;
    var aa = this.xpathQuery( op );
    this.p = b;
    var bb = this.xpathQuery( op );
    delete this.p;

    //this is lame, but comparison with null and "" doens't work right
    //so use newline
    if ( aa == null || aa == "" ) aa ="\n";
    if ( bb == null || bb == "" ) bb ="\n";

    return arguments.callee.comp( aa , bb )
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.ascDict = function ( a , b ){
    if ( a.toLowerCase() < b.toLowerCase() ) return 1;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.descDict = function ( a , b ){
    if ( a.toLowerCase() > b.toLowerCase() ) return 1;
}


//==============================================================================
// Orders the replicated nodes based on the value of the path passed in.
// @keywords private
//
// @param String xpath: An xpath giving the value to use for comparison.
// @param Function|String comparator: See the <code>comparator</code> paramater
// of <code>setComparator</code> for details.
//==============================================================================
LzReplicationManager.prototype.setOrder = function( xpath , comparator ) {
    this.orderpath = null;

    //handle case where this was called by a setter, in which case second
    //arg is the name of the attribute that was set
    comparator = comparator == "sortpath" ? null : comparator;

    //comparator can be a function or a string, so need to test against
    //both null and as a boolean
    if ( comparator ||
         comparator != null || 
         typeof( this.orderf.comp ) != "function" ){
        this.setComparator( comparator );
    }

    this.orderpath = xpath;

    this.orderf.op = this.orderpath;

    if ( this.nodes.length ){
        //reset nodes in order now
        this.__LZHandleMultiNodes( this.nodes );
    }
}

//-----------------------------------------------------------------------------
// Sets the comparator for the sort used by the replication manager.
// @keywords private
// 
// @param Function|String comparator: "ascending" or "descending" for the
// appropriate dictionary sort, or a function to be used for comparison that
// takes two arguments and returns 1 if the second argument should follow the
// first, -1 if the first argument should follow the second, and 0 if the two
// arguments are equivalent
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.setComparator = function( comparator ){
    if ( typeof( comparator ) != "function" ){
        if ( comparator == "descending" ){
            comparator = this.descDict;
        } else {
            comparator = this.ascDict;
        }
    }

    this.orderf.comp = comparator;

    if ( this.orderpath != null && this.nodes.length ){
        //reset nodes in order now
        this.__LZHandleMultiNodes( this.nodes );
    }
}
            
//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.getNewClone = function ( forceNew ){
    if ( this.clonePool.length ){
        var v = this.reattachClone( this.clonePool.pop() );
    } else {
        var v = new this.cloneClass( this.cloneParent , this.cloneAttrs ,
                                     this.cloneChildren, 
                                     forceNew == null ?this.asyncnew: !forceNew); 
    }
    if ( this.visible == false ) v.setVisible( false );
    return v;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.poolClone = function ( ){
    var v = this.clones.pop();
    this.detachClone( v );
    this.clonePool.push ( v );
}


LzReplicationManager.prototype.checkDependentContexts = null;
//The clone manager doesn't have a view to update
LzReplicationManager.prototype.handleModify = null;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.destroyClone = function ( v ) {
    v.destroy();
}

//-----------------------------------------------------------------------------
// This is an alias for the replication manager's setXPath method, but it is
// provided for compatibility with the view API, since replication managers take
// over the slot that a named replicated view occupied in the parent. (See
// comment on the class as a whole, above.)
// @param String xp: An xpath.
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.setDatapath = function ( xp ){
    this.setXPath( xp );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.setXPath = function ( xp ){
    if ( this.__LZpreventXPathUpdate ) return;
    super.setXPath( xp ); 
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.handleDeletedNode = function ( c ){
    var tclone = this.clones[ c ];
    //@field pooling: If true, the replication manager will reuse views it
    //has alreay created if the data changes if possible. If false, the 
    //replication manager will always destroy views whose data has changed and
    //create new ones.
    if ( this.pooling ){
        this.detachClone( tclone );
        this.clonePool.push ( tclone );
    } else {
        this.destroyClone( tclone );
    }
    this.nodes.splice( c , 1 );
    this.clones.splice( c , 1 );
}

//-----------------------------------------------------------------------------
// Returns a clone which is mapped to the given data node.
// @param LzDataElement p: The data node for which to return the clone.
// @return LzView: A clone mapped to the given data.
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.getCloneForNode = function ( p ){
    for ( var i = 0; i < this.clones.length; i++ ){
        if ( this.clones[ i ].datapath.p == p ){
            return this.clones[ i ];
        }
    }
}
 
//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.toString = function (){
    return "ReplicationManager in " + this.immediateparent;
}

//-----------------------------------------------------------------------------
// Sets the visibility of all the clones controlled by the replication manager
// @param Boolean vis: The value to set the visibility to.
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.setVisible = function ( vis ){
    this.visible = vis;
    for ( var i = 0; i < this.clones.length; i++ ){
        this.clones[ i ].setVisible( vis );
    }
    this.onvisible.sendEvent( vis );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.__LZHandleDocChange = function ( who ){
    //this enables the old ondata test
    this.p = this.context.getContext();
    super.__LZHandleDocChange( who );
    delete this.p;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.__LZcheckChange = function ( chgpkg ){
    this.p = this.nodes[ 0 ];
    var didrun = this.__LZdpcheckChange( chgpkg );
    delete this.p;

    if ( !didrun ){
        var who = chgpkg.who;
        for ( var i = 0; i < this.clones.length; i++ ){
            var cl = this.clones[ i ];
            if ( cl.datapath.__LZneedsOpUpdate( chgpkg ) ){
                cl.datapath.__LZsetData();
            }
            if ( who.childOf( cl.datapath.p , true ) ){
                cl.datapath.onDocumentChange.sendEvent( chgpkg ) ;
            }
        }
    }
}

LzReplicationManager.prototype.__LZdpcheckChange = 
                LzDatapointer.prototype.__LZcheckChange;

LzReplicationManager.prototype.__LZneedsOpUpdate = null;

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzReplicationManager.prototype.getContext = function ( chgpkg ){
    return this.nodes[ 0 ];
}

//=============================================================================
// @keywords private
//=============================================================================
LzReplicationManager.prototype.detachClone = function ( cl ){
    if ( cl.isdetatchedclone ) return;

    cl.setVisible( false );
    cl.addedToParent = false;

    var svs =  cl.immediateparent.subviews;
    for( var i = svs.length - 1; i >= 0; i-- ){
        if ( svs[ i ] == cl ){
            svs.splice( i , 1 );
            break;
        }
    }

    cl.datapath.__LZtrackDel.unregisterAll();
    cl.datapath.__LZcontextDel.unregisterAll();
    cl.immediateparent.onremovesubview.sendEvent( cl );
    cl.isdetatchedclone = true;
    cl.p = null;
}

//=============================================================================
// @keywords private
//=============================================================================
LzReplicationManager.prototype.reattachClone = function ( cl ){
    if ( !cl.isdetatchedclone ) return cl;

    cl.immediateparent.addSubview( cl );
    cl.setVisible( this.visible );
    cl.isdetatchedclone = false;
    return cl;
}

//-----------------------------------------------------------------------------
// returns the index at which the arrays differ
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.__LZdiffArrays = function ( a , b ){
    var i = 0;

    var al = a.length;
    var bl = b.length;

    while( i < al && i < bl ){
        if ( a[ i ] != b[ i ] ){
            return i;
        }
        i++;
    }

    return i;

}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzReplicationManager.prototype.updateData = function ( a , b ){
    for ( var i = 0; i < this.clones.length; i++ ){
        this.clones[ i ].datapath.updateData( );
    }
}

