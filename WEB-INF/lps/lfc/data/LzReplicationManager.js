/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LFC
  * @subtopic Data
  */

/**
  * <p>
  * When a view's datapath matches more than one data node, one instance
  * of the view is created for each match. The replicated views are
  * referred to as <glossterm>clones</glossterm>' When this happens, a
  * <glossterm>replication manager</glossterm> (or a subclass of
  * <classname>LzReplicationManager</classname>) is created to manage the
  * clones. Replication managers are never directly instantiated &#x2014;
  * 
  * they are created when a datapath makes multiple matches.</p>
  * 
  * <p>If the replicated view was named, the clone manager takes over the
  * named spot in the parent. The example below demonstrates this, and
  * shows how to reference individual clones.</p>
  * 
  * <p>In the example that follows, a view, called
  * <varname>replView</varname> is bound to a dataset
  * <varname>somedata</varname>. For each matching node in the dataset, a
  * new view is created. These views contain the text of the dataset.  In
  * other words, the single line</p>
  * 
  * <pre>
  * &lt;view name="replView" datapath="somedata:/*"&gt;
  * 
  * </pre>
  * 
  * <p>causes the creation of five views (because there were five elements
  * in the dataset that matched the selection criteria). These "cloned"
  * views are numbered successively, starting with zero. The highlited
  * section of the code below shows how to use the
  * <method>getCloneNumber</method> method to access each replicated
  * view.</p>
  * 
  * <example>
  * &lt;canvas height="140"&gt;
  *   &lt;dataset name="somedata"&gt;
  *     &lt;one/&gt; &lt;two/&gt; &lt;three/&gt; &lt;four/&gt; &lt;five/&gt;
  * 
  *   &lt;/dataset&gt;
  *   &lt;simplelayout/&gt;
  *   &lt;button onclick="moveClone()"&gt;
  *     Move clone 
  *     <em>&lt;method name="moveClone"&gt;&lt;![CDATA[
  *       var nextClone = replView.getCloneNumber(this.cnum++);
  *       if (nextClone == null) {
  *         this.cnum = 0;
  *         var nextClone = replView.getCloneNumber(this.cnum++);
  *       }
  *       nextClone.setAttribute('x', nextClone.x + 10);
  *     ]]&gt;&lt;/method&gt;</em>
  *     &lt;attribute name="cnum" value="0"/&gt;
  * 
  *   &lt;/button&gt;
  *   &lt;view name="replView" datapath="somedata:/*"&gt;
  *     &lt;text datapath="name()"/&gt;
  *   &lt;/view&gt;
  * &lt;/canvas&gt;
  * </example>
  * 
  * @shortdesc The controller for views replicated by data.
  * @devnote A replication manager controls the replication of views as a result of 
  * multiple matches to a datapath's xpath. When a datapath matches more than
  * one node, it immediate halts its own processing and creates a replication 
  * manager to take over management of that datapath. If the view that contained
  * the datapath being replicated was named, the replication manager assumes that
  * name, so that it can be referred to the same way the non-replicated view
  * would have been. 
  */
class LzReplicationManager extends LzDatapath {

  static var setters = new LzInheritedHash(LzDatapath.setters);
  static var getters = new LzInheritedHash(LzDatapath.getters);
  static var defaultattrs = new LzInheritedHash(LzDatapath.defaultattrs);
  static var options = new LzInheritedHash(LzDatapath.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzDatapath.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzDatapath.earlySetters);

  LzReplicationManager.setters.sortpath = "setOrder";
  LzReplicationManager.setters.sortorder = "setComparator";
  LzReplicationManager.setters.datapath = "setXPath";


/** If true, the replication manager will reuse views it
  * has alreay created if the data changes if possible. If false, the 
  * replication manager will always destroy views whose data has changed and
  * create new ones.
  */
//var pooling = false;
var asyncnew = true;
var initialnodes;
var clonePool;
var cloneClass;
var cloneParent;
var cloneAttrs;
var cloneChildren;
var hasdata;
var _t;
var orderpath;

var $lzc$comp_orderf;  // Was this.orderf.comp
var $lzc$op_orderf;    // Was this.orderf.op


// FIXME [2006-10-23 pbr] (LPP-2397) Uncomment 'override' when implemented
/** @modifiers override */ 
//var datacontrolsvisibility = false; // Defined in LzDatapath
/** 
  * @modifiers override
  * @access private
  */ 
// var __LZtakeDPSlot = false;

var visible = true;
/** @access private */
var __LZpreventXPathUpdate = false;

/** The nodes that this replication manager will map to views */
var nodes;

/** The LzNodes which this LzReplicationManager has created.
  * @type [LzNode]
  */
var clones;

/** @access private */
var __LZdataoffset = 0;
/** @lzxtype event */
var onnodes = LzDeclaredEvent;
/** @lzxtype event */
var onclones = LzDeclaredEvent;
/** @lzxtype event */
var onvisible = LzDeclaredEvent;

/**
  * @access private
  */
function LzReplicationManager ( odp , args, children:* = null, instcall:* = null ){
    //the real parent for this is datapaths view's (immediateparent) parent
    super(odp, args, children, instcall);
}

override function construct ( odp , args ){
    this.__LZtakeDPSlot = false; // Defined in LzDatapath
    this.datacontrolsvisibility = false; // Defined in LzDatapath

    if (this.pooling == null)
        this.pooling = false; // Defined in LzDatapath

    //odp: original datapath
    var view = odp.immediateparent;
    if (view == canvas) {
        // Initialize vars to reduce dhtml errors
        this.nodes = [];
        this.clones = [];
        this.clonePool = [];
        Debug.error("LzReplicationManager constructed at canvas. A datapath cannot be defined on the canvas");
        return;
    }

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
    // remove any LzNode with this id
//PBR DEBUG
//    if (global[id] instanceof LzNode) global[id] = null;
    if (global[id] is LzNode) global[id] = null;

    //don't want to rerunxpath
    args.xpath = LzNode._ignoreAttribute;

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
        odp.__LZspecialDotDot = null;
    }
        

    //the real parent for this is datapaths view's (immediateparent) parent
    super.construct( view.parent, args);

    if ( view.parent != view.immediateparent ){
        view.immediateparent[ args.name ] = this;
    }

    //already have nodes when inited
    this.xpath = odp.xpath;
    this.parsedPath = odp.parsedPath;

    this.cloneClass = view.constructor;

    this.cloneParent = view.parent;

    //add clone transformer to original instance attributes
    this.cloneAttrs = new LzInheritedHash(view._instanceAttrs);

    this.cloneAttrs.datapath = LzNode._ignoreAttribute;
    this.cloneAttrs.$datapath = { name  : 'datapath' };
    this.cloneAttrs.$datapath.attrs = { datacontrolsvisibility: odp.datacontrolsvisibility, 
                                        __LZmanager : this }

    this.cloneAttrs.id = LzNode._ignoreAttribute;
    this.cloneAttrs.name = LzNode._ignoreAttribute;
    if ($profile) {
      if (view._profile_name) {
        this.cloneAttrs._profile_name = 'clone of ' + view._profile_name;
      }
    }

    var hadxpathconstraint = false;
    if ( view._instanceAttrs.$refs && view._instanceAttrs.$refs.datapath ) {
        //<view datapath="${ ... }"/>
        //we need to mask this
        this.cloneAttrs.$refs = new LzInheritedHash( this.cloneAttrs.$refs );
        this.cloneAttrs.$refs.datapath = LzNode._ignoreAttribute;
        //but, we want the constraint to apply to this object instead
        var cons = view._instanceAttrs.$refs.datapath;

        this._t = cons.dependencies;
        hadxpathconstraint = true;

        this.__LZpreventXPathUpdate = true;
        this.applyConstraint( 'xpath', cons, this._t != null ? this._t() : [] );
        this.__LZpreventXPathUpdate = false;
    } else if ( odp._instanceAttrs.$refs && odp._instanceAttrs.$refs.xpath ){
        //<view><datapath xpath="${ ... }"/>

        //we want the constraint to apply to this object instead
        var cons = odp._instanceAttrs.$refs.xpath;

        this._t = cons.dependencies;
        hadxpathconstraint = true;

        this.__LZpreventXPathUpdate = true;
        this.applyConstraint( 'xpath', cons, this._t != null ? this._t() : [] );
        this.__LZpreventXPathUpdate = false;
    }

        this.__LZsetCloneAttrs();

    if ( view._instanceChildren ){
        this.cloneChildren = view._instanceChildren.concat();
    } else {
        this.cloneChildren = [];
    }

    this.visible = odp.datacontrolsvisibility ||
        (!view.isinited &&
            ('visible' in view._instanceAttrs) ? view._instanceAttrs.visible : view.visible);

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
            odp.setXPath =  LzReplicationManager.__LZemptyFuntion;
        }
        this.clones.push ( view );
        // Because we're about to start making siblings to this view, (i.e. out
        // of lexical order) make sure that the replicated view has been added
        // to the parent's subview list. Also, it's ok to call this if view was
        // already added
        view.immediateparent.addSubview ( view );
    } else {
        this.destroyClone( view );
    }

    this.setDataContext( mycontext , mycontext instanceof LzDatapointer);
}

// See subclasses for definition
function __LZsetCloneAttrs() {}

/**
  * @access private
  */
static function __LZemptyFuntion ( ){
    return;
}

/**
  * @access private
  */
override function constructWithArgs ( args ){
    this.__LZHandleMultiNodes( this.initialnodes );

if ($swf9) {
    this.initialnodes = null;
} else {
    delete this.initialnodes;
}
    if ( this.visible == false ){
        this.setVisible( false );
    }
}

/**
  * @access private
  */
override function setDataContext ( p , implicit = null){
    var args = arguments; 
    if (p == null && this.immediateparent != null && 'datapath' in this.immediateparent && this.immediateparent.datapath != null){
        args[0] = this.immediateparent.datapath;
        args[1] = true;
    }
    super.setDataContext.apply(this, args);
}

/**
  * @access private
  */
function getNodeOffset ( p ){
    if (this.nodes != null) {
        var l = this.nodes.length; 
        for ( var i = 0; i < l; i++ ){
            if ( p == this.nodes[ i ] ){
                return i;
            }
        }
    }
}
    
/**
  * Retuns a pointer to the nth clone controlled by the replication manager
  * @param Number n: The zero-based offset of the clone to retrieve
  * @return LzView: A pointer to the nth clone
  */
function getCloneNumber ( n ){
    return this.clones[ n ];
}

/**
  * @access private
  */
override function __LZHandleNoNodes( ) {
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

/**
  * @access private
  */
override function __LZHandleSingleNode ( n ){ 
    this.__LZHandleMultiNodes( [n] );
}

/**
  * @access private
  */
function mergesort ( arr , l , h ) {
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

/**
  * @access private
  */
override function __LZHandleMultiNodes ( n ){
    var layouts = this.parent && this.parent.layouts ? this.parent.layouts : [];
    for (var i in layouts) {
        layouts[i].lock();
    }
    this.hasdata = true;
    var lastnodes = this.nodes;
    this.nodes = n;
    if (this.onnodes.ready) this.onnodes.sendEvent( this.nodes );

    if ( this.__LZspecialDotDot ) this.__LZsetupDotDot( n[ 0 ] );

    if ( this.orderpath != null ){
        this.nodes = this.mergesort( this.nodes , 0 , this.nodes.length - 1 );
    }

    this.__LZadjustVisibleClones( lastnodes , true );


    var l = this.clones.length;
    for (var i = 0; i < l; i++ ){
        var cl = this.clones[ i ] ;
        var iplusoffset = i + this.__LZdataoffset; 
        cl.clonenumber = iplusoffset ;
        if (this.nodes) {
            cl.datapath.setClonePointer( this.nodes[ iplusoffset ] );
        }
        if (cl.onclonenumber.ready) cl.onclonenumber.sendEvent( iplusoffset );
    }
    if (this.onclones.ready) this.onclones.sendEvent( this.clones );
    for (var i in layouts) {
        layouts[i].unlock();
    }
}

/**
  * @access private
  */
function __LZadjustVisibleClones( lastnodes , newnodes){
    var stpt = this.__LZdiffArrays( lastnodes , this.nodes);

    if ( ! this.pooling ) {
        while ( this.clones.length > stpt ){
            var v = this.clones.pop();
            this.destroyClone( v );
        }
    }

    //this makes sure that children created as a result of data replication
    //init in order
    LzInstantiator.enableDataReplicationQueuing( );

    while ( this.nodes && this.nodes.length > this.clones.length ){
        var cl = this.getNewClone();
        if (!cl)
            break;
        this.clones.push( cl );
    }

    LzInstantiator.clearDataReplicationQueue( );


    while ( this.nodes && this.nodes.length < this.clones.length ){
        //this condition can only be reached if pooling is turned on
        this.poolClone();
    }
}

/**
  * @access private
  */
function orderf ( a , b ){
    //a and b are dataset nodes


//    var op = arguments.callee.op;
    var op = this.$lzc$op_orderf;

    this.p = a;
    var aa = this.xpathQuery( op );
    this.p = b;
    var bb = this.xpathQuery( op );
if ($swf9) {
    this.p = null
} else {
    delete this.p;
}

    //this is lame, but comparison with null and "" doens't work right
    //so use newline
    if ( aa == null || aa == "" ) aa ="\n";
    if ( bb == null || bb == "" ) bb ="\n";

//    return arguments.callee.comp( aa , bb )
    return $lzc$comp_orderf(aa, bb);
}


/**
  * @access private
  */
function ascDict ( a , b ){
    if ( a.toLowerCase() < b.toLowerCase() ) return 1;
}

/**
  * @access private
  */
function descDict ( a , b ){
    if ( a.toLowerCase() > b.toLowerCase() ) return 1;
}


/**
  * Orders the replicated nodes based on the value of the path passed in.
  * @access private
  * 
  * @param String xpath: An xpath giving the value to use for comparison.
  * @param Function|String comparator: See the <code>comparator</code> paramater
  * of <code>setComparator</code> for details.
  */
override function setOrder( xpath , comparator ) {
    this.orderpath = null;

    //handle case where this was called by a setter, in which case second
    //arg is the name of the attribute that was set
    comparator = comparator == "sortpath" ? null : comparator;

    //comparator can be a function or a string, so need to test against
    //both null and as a boolean
    if ( comparator ||
         comparator != null || 
         typeof( this.$lzc$comp_orderf ) != "function" ){
        this.setComparator( comparator );
    }

    this.orderpath = xpath;

    this.$lzc$op_orderf = this.orderpath;

    if ( this.nodes.length ){
        //reset nodes in order now
        this.__LZHandleMultiNodes( this.nodes );
    }
}

/**
  * Sets the comparator for the sort used by the replication manager.
  * @access private
  * 
  * @param Function|String comparator: "ascending" or "descending" for the
  * appropriate dictionary sort, or a function to be used for comparison that
  * takes two arguments and returns 1 if the second argument should follow the
  * first, -1 if the first argument should follow the second, and 0 if the two
  * arguments are equivalent
  */
override function setComparator( comparator ){
    if ( typeof( comparator ) != "function" ){
        if ( comparator == "descending" ){
            comparator = this.descDict;
        } else {
            comparator = this.ascDict;
        }
    }

    this.$lzc$comp_orderf = comparator;

    if ( this.orderpath != null && this.nodes.length ){
        //reset nodes in order now
        this.__LZHandleMultiNodes( this.nodes );
    }
}
            
/**
  * @access private
  */
function getNewClone ( forceNew = null ){
    if (!this.cloneParent) {
        return null;
    }
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

/**
  * @access private
  */
function poolClone ( ){
    var v = this.clones.pop();
    this.detachClone( v );
    this.clonePool.push ( v );
}


// [ 07-25-2006 pbr] These two variables don't appear to be used
var checkDependentContexts = null;
//The clone manager doesn't have a view to update
var handleModify = null;

/**
  * @access private
  */
function destroyClone ( v ) {
    v.destroy();
}

/**
  * This is an alias for the replication manager's setXPath method, but it is
  * provided for compatibility with the view API, since replication managers take
  * over the slot that a named replicated view occupied in the parent. (See
  * comment on the class as a whole, above.)
  * @param String xp: An xpath.
  */
override function setDatapath ( xp, ignore = null ){
    this.setXPath( xp );
}

/**
  * @access private
  */
override function setXPath ( p, val = null ){ 
    if ( this.__LZpreventXPathUpdate ) return;
    super.setXPath.apply(this, arguments); 
}

/**
  * @access private
  */
function handleDeletedNode ( c ){
    var tclone = this.clones[ c ];
    if ( this.pooling ){
        this.detachClone( tclone );
        this.clonePool.push ( tclone );
    } else {
        this.destroyClone( tclone );
    }
    this.nodes.splice( c , 1 );
    this.clones.splice( c , 1 );
}

/**
  * Returns a clone which is mapped to the given data node.
  * @param LzDataElement p: The data node for which to return the clone.
  * @return LzView: A clone mapped to the given data.
  */
function getCloneForNode ( p, dontmake=null ){
    var l = this.clones.length; 
    for ( var i = 0; i < l; i++ ){
        if ( this.clones[ i ].datapath.p == p ){
            return this.clones[ i ];
        }
    }
}
 
/**
  * @access private
  */
override function toString (){
    return "ReplicationManager in " + this.immediateparent;
}

/**
  * Sets the visibility of all the clones controlled by the replication manager
  * @param Boolean vis: The value to set the visibility to.
  */
function setVisible ( vis ){
    this.visible = vis;
    var l = this.clones.length; 
    for ( var i = 0; i < l; i++ ){
        this.clones[ i ].setVisible( vis );
    }
    if (this.onvisible.ready) this.onvisible.sendEvent( vis );
}

/**
  * @access private
  */
override function __LZHandleDocChange ( who ){
    //this enables the old ondata test
    this.p = this.context.getContext();
    super.__LZHandleDocChange.apply(this, arguments);
if ($swf9) {
    this.p = null
} else {
    delete this.p;
}
}

/**
  * @access private
  */
override function __LZcheckChange ( chgpkg ){
    this.p = this.nodes[ 0 ];
    var didrun = super.__LZcheckChange.apply(this, arguments);
if ($swf9) {
    this.p = null
} else {
    delete this.p;
}

    if ( !didrun ){
        var who = chgpkg.who;
        var l = this.clones.length; 
        for ( var i = 0; i < l; i++ ){
            var cl = this.clones[ i ];
            if ( cl.datapath.__LZneedsOpUpdate( chgpkg ) ){
                cl.datapath.__LZsetData();
            }
            if ( who.childOfNode( cl.datapath.p , true ) ){
                if (cl.datapath.onDocumentChange.ready) cl.datapath.onDocumentChange.sendEvent( chgpkg ) ;
            }
        }
    }
}


/** @access private */
override function __LZneedsOpUpdate ( chgpkg = null ) { return false }

/**
  * @access private
  */
override function getContext ( chgpkg = null){
    return this.nodes[ 0 ];
}

/**
  * @access private
  */
function detachClone ( cl ){
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
    if (cl.immediateparent.onremovesubview.ready) cl.immediateparent.onremovesubview.sendEvent( cl );
    cl.isdetatchedclone = true;
    cl.p = null;
}

/**
  * @access private
  */
function reattachClone ( cl ){
    if ( !cl.isdetatchedclone ) return cl;

    cl.immediateparent.addSubview( cl );
    cl.setVisible( this.visible );
    cl.isdetatchedclone = false;
    return cl;
}

/**
  * returns the index at which the arrays differ
  * @access private
  */
function __LZdiffArrays ( a , b ){
    var i = 0;

    var al = a ? a.length : 0;
    var bl = b ? b.length : 0;

    while( i < al && i < bl ){
        if ( a[ i ] != b[ i ] ){
            return i;
        }
        i++;
    }

    return i;

}

/**
  * @access private
  */
override function updateData () {
    var l = this.clones.length; 
    for ( var i = 0; i < l; i++ ){
        this.clones[ i ].datapath.updateData( );
    }
}

} // End of LzReplicationManager

