/**
  * LzDatapath.lzs
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic LFC
  * @subtopic Data
  * @access public
  */
  
/**
  * 
  * <p>
  * Datapaths are used to merge data hierarchies with the hierarchy of an
  * OpenLaszlo application. This is done using the the XPath syntax supported
  * by <classname>LzDatapointer</classname>.  When a node is given a
  * <attribute link="true">datapath</attribute> attribute, a datapath with
  * the given value as its XPath is created. If the datapath retrieves a
  * node (<i>i.e.</i> it doesn't terminate in an attribute getter or a
  * <code>()</code> operator) then the node is mapped to that data context
  * and all child nodes will implicitly share the datacontext, but no
  * further action is taken. If the datapath retrieves data, rather than
  * just a node, a few extra things happen. First, the node's
  * <attribute>data</attribute> property is set and the node's
  * <event>ondata</event> event is sent. Second, the node's
  * <method>applyData</method> method is called with the data as the
  * argument. In cases where a datapath matches more than one data node,
  * the view with the matching datapath is replicated once for each data
  * node that matches, and a <xref linkend="LzReplicationManager"/> takes over 
  * the view's spot in its parent.
  * </p>
  * 
  * <p>
  * A node can only have one datapath, and datapaths always have the name
  * <code>datapath</code>.  Additional options available on datapath such
  * as <xref linkend="LzDatapath.__ivars__.pooling"/> and 
  * <xref linkend="LzDatapath.__ivars__.replication"/> are specified 
  * by writing the <tagname>datapath</tagname> tag as a separate node.
  * </p>
  * 
  * <example title="Mapping data to views using datapaths">
  * <programlisting>&lt;canvas height="120"&gt;
  *   &lt;dataset name="testdata"&gt;
  *     &lt;Monday temp="Hi 48"&gt; Partly Cloudly &lt;/Monday&gt;
  *     &lt;Tuesday temp="Hi 60"&gt; Showers Likely &lt;/Tuesday&gt;
  *     &lt;Wednesday temp="Hi 63"&gt; Chance Showers &lt;/Wednesday&gt;
  *     &lt;Thursday temp="Hi 58"&gt; Mostly Sunny &lt;/Thursday&gt;
  *     &lt;Friday temp="Hi 50"&gt; Clear and Cold &lt;/Friday&gt;
  *   &lt;/dataset&gt;
  *   &lt;simplelayout spacing="5"/&gt;
  *   &lt;view datapath="testdata:/*"&gt;
  *     &lt;view&gt;
  *       &lt;simplelayout axis="x"/&gt;
  *       &lt;text <em>datapath="name()"</em>/&gt;
  *       &lt;text <em>datapath="text()"</em>/&gt;
  *       &lt;text <em>datapath="@temp"</em>/&gt;
  *     &lt;/view&gt;
  *   &lt;/view&gt;
  * &lt;/canvas&gt;</programlisting></example>
  *
  * @usage <programlisting>&lt;view&gt;
  *   &lt;datapath xpath="<em>xpath</em>" sortorder="ascending"/&gt;
  * &lt;/view&gt;</programlisting>
  * <programlisting>&lt;view datapath="<em>xpath</em>" /&gt;</programlisting>
  *
  * @shortdesc The binder between data and nodes.
  * @lzxname datapath
  */
class LzDatapath extends LzDatapointer {

  static var setters = new LzInheritedHash(LzDatapointer.setters);
  static var getters = new LzInheritedHash(LzDatapointer.getters);
  static var options = new LzInheritedHash(LzDatapointer.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzDatapointer.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzDatapointer.earlySetters);
  static var defaultattrs = new LzInheritedHash(LzDatapointer.defaultattrs);


  LzDatapath.setters.__LZmanager = "__LZsetCloneManager";

/** @access private
  * @modifiers override 
  */
static var tagname = 'datapath';

/** By default, this is false for instances
  * of <classname>datapointer</classname>, and true for instances of
  * <classname>datapath</classname>.
  */

/** This attribute is deprecated, and should not be used. Developers should use
  * a view's <attribute>visible</attribute> property to control visibility.
  * @type Boolean
  * @modifiers deprecated
  */
var datacontrolsvisibility = true;

/** @access private */
var __LZtakeDPSlot = true;
var storednodes;
var __LZneedsUpdateAfterInit;
var __LZdepChildren;
var sel;


/** Sent when the datapath's data changes.
  */
/* var ondata = LzDeclaredEvent; */
/** Sent when the datapath's data results in an error.
  */
/* var onerror = LzDeclaredEvent; */
/** Sent when the datapath's data encounters a
  * timeout.
  */
/* var ontimeout = LzDeclaredEvent; */

/** This attribute applies to datapaths
  * which match multiple nodes and force replication. See the
  * section on <a
  * href="${dguide}databinding.html#databinding.pooling">Pooling</a>
  * in the Guide for information about the use of this attribute.
  * @type Boolean
  */
var pooling;

/** Determines whether to use normal or
  * lazy replication, if the datapath matches more than one node.
  * See the section on <a
  * href="${dguide}databinding.html#databinding.replication">Replication</a>
  * in the Guide for information about the use of this attribute.
  * @type String
  * @lzxtype token
  */
var replication;

/** An XPath to use to obtain the sort key for
  * sorting if replication occurs. To change this attribute, call
  * the setOrder method.
  * @type String
  */
var sortpath;

/** The order to use to
  * sort the dataset if replication occurs. One of
  * <code>ascending</code> or <code>descending</code> to use
  * built in dictionary sort, or a function which compares
  * two strings and returns <code>1</code> if the strings
  * are in order, <code>0</code> if they are the same, and
  * <code>-1</code> if they are out of order. To change this
  * attribute, call the setOrder or setComparator method.
  * @type Object
  * @lzxtype expression
  */
var sortorder;

/**
  * @access private
  */
function LzDatapath ( v , args:* = null, children:* = null, instcall:* = null ){
    super(v, args, children, instcall);
}

override function construct ( v , args ) {
    this.rerunxpath = true; // Defined in LzDatapointer

    super.construct.apply(this, arguments);

    // construct this to prevent undefined property error
    if ( ! ('data' in this.immediateparent) ){
        this.immediateparent.data = null;
    }

    if ( args.datacontrolsvisibility != null ){
        this.datacontrolsvisibility = args.datacontrolsvisibility;
    }

    if ( this.__LZtakeDPSlot ){
        this.immediateparent.datapath = this;
        var pdp = null;
        var tarr = null;
//PBR DEBUG. Removed 
//        if ('searchParents' in this.immediateparent) {
            pdp = this.immediateparent.searchParents( "datapath" ).datapath;

            tarr = pdp.__LZdepChildren;
//        }

        //set it early, so that it's right when xpath first runs
        if ( tarr != null ){
            pdp.__LZdepChildren = [];

            for ( var i =  tarr.length - 1 ; i >= 0 ; i-- ){
                var c = tarr[ i ];
                if ( c != this &&
                      !(c is LzDataAttrBind) &&
//PBR TODO Changed check because swf9 doesn't like it
//                    !c.$pathbinding &&
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

/**
  * @access private
  */
override function __LZHandleMultiNodes ( nodes ){
    //uhoh! this should be a clone

    //Because we're about to start making siblings to this view,
    //(i.e. out of lexical order)
    //make sure that the replicated view has been added to the parent's
    //subview list

    //ok to call if already added

    var clonetype;
    switch ( this.replication ){
        case "lazy":
            clonetype = LzLazyReplicationManager;
            break;
        case "resize":
            clonetype = LzResizeReplicationManager;
            break;
        default:
            clonetype = LzReplicationManager;
            break;
    }

    this.storednodes = nodes;
    var rman = new clonetype( this, this._instanceAttrs);
if ($swf9) {
    this.storednodes = null;
} else {
    delete this.storednodes;
}


    return rman;

}

/**
  * Normally, replication is started when a datapath xpath binding returns
  * multiple nodes. This function overides that behavior and forces replication,
  * and replicates over the list of nodes supplied to this function. Note that
  * once this function is called, the replication manager is no longer actively
  * bound to the data it replicates over by its xpath (if it had one);
  * henceforth the replication set can *only* be controlled by calling
  * setNodes.
  *
  * @param [LzDataElement] nodes: A list of LzDataElements to replicate over.
  */
function setNodes ( nodes ){
    //Debug.write( "before context" ,this.context );
    //this.setDataContext( nodes , false );
    //Debug.write( "context" ,this.context );

    var rman = this.__LZHandleMultiNodes( nodes );

    //__LZHandleMultiNodes will return the replication manager if "this" is a
    //datapath
    if ( !rman ) rman = this;

    rman.__LZsetTracking( null );

    if (nodes) {
        for ( var i = 0; i < nodes.length; i++ ){
            var n = nodes[ i ];
            var own = n.ownerDocument;
            //third arg is an optimization -- if the node is unique, then we
            //know we're not tracking it
            rman.__LZsetTracking( own , true , n != own );
        }
    }
}

/**
  * @access private
  */
override function __LZsendUpdate( upd = null, upp = null ) {
    var pchg = this.__LZpchanged;
    if ( !super.__LZsendUpdate.apply(this, arguments) ){
        return false;
    }

    if (  this.immediateparent.isinited ){
        this.__LZApplyData( pchg );
    } else {
        this.__LZneedsUpdateAfterInit = true;
    }

    return true;
}


/**
  * @access private
  */
function __LZApplyDataOnInit( ) {
    if ( this.__LZneedsUpdateAfterInit ){
        this.__LZApplyData();
if ($swf9) {
        this.__LZneedsUpdateAfterInit = null;
} else {
        delete this.__LZneedsUpdateAfterInit;
}
    }
}

/**
  * @access private
  */
function __LZApplyData( force = null) {
    var ip = this.immediateparent;

    if ( this.datacontrolsvisibility ){
        this.immediateparent.__LZvizDat = this.p != null; 

        
        this.immediateparent.__LZupdateShown();
    }

    var cdat = force ||
               ip.data != this.data ||
               (this.parsedPath && this.parsedPath.operator == "attributes");

    this.data = this.data == null ? null : this.data;
    ip.data = this.data;

    if ( cdat && ip.ondata.ready){
        ip.ondata.sendEvent( this.data );
    }

    if ( this.parsedPath && ( this.parsedPath.operator != null ||
           this.parsedPath.aggOperator != null ) && cdat ){
        if (ip.applyData) ip.applyData( this.data );
    }

}

/**
  * @access private
  */
override function setDataContext ( p , implicit = null ){
// [2008-03-12 pbr] Removed the 'in' test for swf9
//PBR DEBUG Modified to remove in test
//    if ( p == null && this.immediateparent != null && 'searchParents' in this.immediateparent){
    if (p == null && this.immediateparent != null) {
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

        var dclist = null;
        if ( this.context ) dclist = this.context.__LZdepChildren;
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
    super.setDataContext( p );
}


/**
  * Removes the datapath from its parent
  * @access private
  */
override function destroy( recur = null ){
//    this.setName = null; //so this can't be assigned
    this.__LZupdateLocked = true; //so won't set data

    if ( this.context && !this.context.__LZdeleted && 
//PBR         this.context.__LZdepChildren ){
         this.context is LzDatapath){ // __LZdepChildren is in LzDatapath

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
        if ( this.__LZdepChildren != null &&
             this.__LZdepChildren.length ){
            //need to assign __LZdepChildren to parent
            var dnpar = this.immediateparent.searchParents( "datapath" ).
                                                                    datapath;

            for ( var i = 0; i < this.__LZdepChildren.length ; i++ ){
                this.__LZdepChildren[ i ].setDataContext( dnpar , true );
            }

        }
    }

    if ( this.immediateparent.datapath == this ){
if ($swf9) {
        this.immediateparent.datapath = null;
} else {
        delete this.immediateparent.datapath;
}
    }

    super.destroy.apply(this, arguments);
}

/**
  * This method is used to transfer any values that may have been edited
  * in a datamapped UI control back to the dataset. If the current
  * datapath's <attribute>xpath</attribute> ends in a terminal selector
  * (an attribute, <code>text()</code>, or <code>name()</code>
  * expression), then the datapath attempts to call its parent's
  * <method>updateData</method> method. If this method is defined, the
  * datapath sets the data element's attribute, text, or name,
  * respectively, to <method>updateData</method>'s return value. The
  * method then calls any other <method>updateData</method> on any
  * datapaths which depend on this one for context.
  *
  * In short, to make datamapping work both ways for a given UI
  * control, define a <method>updateData</method> method that returns
  * the value for the data mapped to the node.  This is already done
  * for the base <classname>LzInputText</classname> class, but not
  * for any other LFC classes.
  *
  */
function updateData( ){
    if ( !arguments[ 0 ] && this.p){
        this.p.__LZlockFromUpdate( this );
    }

    var ppdo = this.parsedPath ? this.parsedPath.operator : null;
// Cast to LzDatapath rather than checking if upateData exists
//    if ( 'updateData' in this.immediateparent && ppdo != null){
    if ( this.immediateparent is LzDatapath && ppdo != null){
        var dat = LzDatapath(this.immediateparent).updateData();
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

    if ( !arguments[ 0 ] && this.p){
        this.p.__LZunlockFromUpdate( this );
    }


}

/**
  * @access private
  */
function retrieveData( ){
    if ( $debug ){
      Debug.deprecated(this, arguments.callee, this.updateData);
    }
    return this.updateData( );
}

/**
  * @access private
  */
override function __LZHandleDocChange ( who ){
    if ( super.__LZHandleDocChange.apply(this, arguments) ){
        if (this.immediateparent.ondata.ready) this.immediateparent.ondata.sendEvent( this.data );
        if (this.onDocumentChange.ready) this.onDocumentChange.sendEvent( who );
    }
}


/**
  * @access private
  */
override function toString( ){
    return "Datapath for " + this.immediateparent;
}


/**
  * these are the events that datapaths publish. This is used by the replication
  * manager to copy and delegates that are registered when it replaces the
  * original datapath
  * @access private
  */
var _dpevents = [ 'ondata' , 'onerror' , 'ontimeout' ];

/**
  * @access private
  */
override function __LZcheckChange ( chgpkg ){
    if ( !super.__LZcheckChange.apply(this, arguments) ){
        if ( chgpkg.who.childOfNode( this.p , true ) && this.onDocumentChange.ready){
            this.onDocumentChange.sendEvent( chgpkg );
        }
    }
}


/**
  * Overrides LzDatapointer.__LZsetTracking to handle the additive case
  *
  * @param who: the node to track
  * @param Boolean additive: (default false) if true, add additional
  * nodes to track, rather than changing the node
  * @param Boolean needscheck: (default false) if additive is true, set
  * this to true to check that you are not adding a duplicate
  *
  * @access private
  */
override function __LZsetTracking ( who, additive = null, needscheck = null ) {
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
        this.__LZtrackDel = trackDel = new LzDelegate(this , "__LZcheckChange");
    }
    // Note that you are tracking
    tracking.push( who );
    trackDel.register( who , "onDocumentChange" );
}

/** @access private */
var __LZisclone = false;

/**
  * @access private
  */
function __LZsetCloneManager( m, value=null ) {
    this.__LZisclone = true;
    this.immediateparent.cloneManager = m;
    this.parsedPath = m.parsedPath;
    this.xpath = m.xpath;
    this.setDataContext( m );
}

/**
  * Called by the clone manager to point the datapath to the right node
  * @access private
  */
function setClonePointer( p ) {
    var pc = this.p !=p;
    this.p = p;

    if ( pc ) {

        if ( p && this.sel != p.sel ){
            this.sel = p.sel || false;
            if ( this.immediateparent is LzDatapath){
                LzDatapath(this.immediateparent).setSelected( this.sel );
            }
        }

        this.__LZpchanged = true;
        this.__LZsetData( );
    }
}

/**
  * Orders the replicated nodes based on the value of the path passed in.
  *
  * @param String xpath: An XPath giving the value to use for comparison.
  * @param Function|String comparator: See the <param>comparator</param>
  * parameter of <method>setComparator</method> for details.
  */
function setOrder( xpath , comparator ) {
    if ( this.__LZisclone ){
        this.immediateparent.cloneManager.setOrder( xpath , comparator );
    } else {
        this.sortpath = xpath;
        //might be a function...
        if ( comparator || comparator != null ){
            this.sortorder = comparator;
        }
    }
}

/**
  * Sets the comparator for the sort used by the replication manager.
  *
  * @param Function|String comparator: "ascending" or "descending" for the
  * appropriate dictionary sort, or a function to be used for comparison that
  * takes two arguments and returns 1 if the second argument should follow the
  * first, -1 if the first argument should follow the second, and 0 if the two
  * arguments are equivalent
  */
function setComparator( comparator ) {
    if ( this.__LZisclone ){
        this.immediateparent.cloneManager.setComparator( comparator );
    } else {
        this.sortorder = comparator;
    }
}


/**
  * @access private
  */
function setSelected( torf ){
    this.p.sel =  torf;
    this.sel = torf;

    if ( this.immediateparent is LzDatapath){
        LzDatapath(this.immediateparent).setSelected( torf );
    }
}

/**
  * @access private
  */
override function __LZgetLast( ){
    if ( this.__LZisclone ) return this.context.nodes.length;

    else if ( this.p == this.context.getContext() &&
              this.context.__LZgetLast ){
        return this.context.__LZgetLast();
    }

    return 1;
}

/**
  * @access private
  */
override function __LZgetPosition( ){
    if ( this.__LZisclone ) return this.immediateparent.clonenumber + 1;

    else if ( this.p == this.context.getContext() &&
              this.context.__LZgetPosition ){
        return this.context.__LZgetPosition();
    }

    return 1;
}

} // End of LzDatapth

ConstructorMap[LzDatapath.tagname] = LzDatapath;
