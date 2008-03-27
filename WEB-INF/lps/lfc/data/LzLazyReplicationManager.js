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
  * <p>If a datapath's <attribute>replication</attribute> attribute is set
  * to <code>lazy</code>, then a match to multiple nodes will create an
  * <classname>LzLazyReplicationManager</classname> instead of an
  * 
  * <classname>LzReplicationManager</classname>. The lazy replication
  * manager creates only enough replicated views in order to display the
  * data, so there is not a view for each data node. This enables the
  * display of very large datasets.</p>
  * 
  * <p>See <a href="${dguide}databinding.html#databinding.lazy-replication">Lazy
  * Replication</a> in the Guide for examples of how to use lazy
  * replication, and restrictions on its use.</p>
  * 
  * <p>Also see the <a href="${examples}paging.lzx">paging.lzx example</a>
  * for an example of lazy replication.</p>
  *
  * <p>In addition to any fields documented in the section below, these fields are also available:
  *
  * <attribute>axis</attribute>: The axis for layout of replicated views.
  *
  * <attribute>spacing</attribute>: The spacing between replicated views</p>
  *
  * @shortdesc An optimization for displaying large sets of data.
  * 
  * @devnote A lazy replication manager is most like a regular replication manager
  * except that it is design to limit the amount of replication by recognizing
  * a mask above the replicated views. The lazy replication manager creates 
  * only as many views as are necessary to display underneath the mask. As the 
  * view containing the replicated views is moved, the data for each view is
  * updated to give the appearance that there is a much larger set of views.
  * 
  * @devnote Views replicated by a lazy replication manager ignore layouts -- the 
  * replication manager controls the layout completely.
  * 
  * @initarg Boolean pooling
  * @initarg String axis
  * @initarg Number spacing
  */
class LzLazyReplicationManager extends LzReplicationManager {

  static var setters = new LzInheritedHash(LzReplicationManager.setters);
  static var getters = new LzInheritedHash(LzReplicationManager.getters);
  static var defaultattrs = new LzInheritedHash(LzReplicationManager.defaultattrs);
  static var options = new LzInheritedHash(LzReplicationManager.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzReplicationManager.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzReplicationManager.earlySetters);



/** The axis for layout of replicated views */
var axis = "y";
var sizeAxis;
var cloneimmediateparent;
var updateDel;
var __LZoldnodelen;
var cloneimmediateparnt;


/** The spacing between replicated views */
var spacing = 0;
var mask = null;

/**
  * @access private
  */
function LzLazyReplicationManager ( odp , args, children:* = null, instcall:* = null ){
    super(odp, args, children, instcall);
}

override function construct ( odp , args ){
    //replication argument needs to control pooling
    this.pooling = true; // Defined in LzReplicationManager

    if ( args.pooling != null ){
        args.pooling = true;
        if ( $debug ){
            Debug.warn( "Invalid pooling argument specified " +
                        "with lazy replication in %w", this );
        }
    }

    if ( args.axis != null ){
        this.axis = args.axis;
    }

    this.sizeAxis = this.axis == "x" ? "width" : "height" ;

    super.construct.apply(this, arguments);

    this.mask = odp.immediateparent.immediateparent.mask;


    var cloneopt = { ignorelayout : true };
    if ( this.cloneAttrs.options != null ){
        cloneopt = new LzInheritedHash(this.cloneAttrs.options);
    }

    var firstcl = this.clones[ 0 ];
    if (firstcl) {
        firstcl.setOption( 'ignorelayout', true );
        var layo = firstcl.immediateparent.layouts;
        if (layo != null) {
            for ( var i = 0; i < layo.length; i++ ){
                layo[ i ].removeSubview( firstcl );
            }
        }
    }

    this.cloneAttrs.options = cloneopt;

    var v = this.getNewClone( true );
    //datamap the new view, to make sure that any members which are datamapped
    //are shown
    this.cloneimmediateparent = v.immediateparent;
    if (this.initialnodes) {
        v.datapath.setClonePointer( this.initialnodes[ 1 ] );
    }

    this.viewsize = v [ this.sizeAxis ];
    v.datapath.setClonePointer( null );
    this.clones.push ( v );

    if (args.spacing == null) {
        args.spacing = 0;
    }

    this.totalsize = this.viewsize + args.spacing;

    v.setAttribute( this.axis , this.totalsize );


    this.__LZdataoffset = 0;

    this.updateDel = new LzDelegate( this , "__LZadjustVisibleClones" );
    this.updateDel.register( this.cloneimmediateparent , "on" + this.axis );
    this.updateDel.register( this.mask , "on" + this.sizeAxis );
}


var viewsize = 0;
var totalsize = 0;

/**
  * @access private
  */
override function __LZsetCloneAttrs (){
    var cloneopt = { ignorelayout : true };
    if ( this.cloneAttrs.options != null ){
        cloneopt = new LzInheritedHash(this.cloneAttrs.options);
    }
    this.cloneAttrs.options = cloneopt;
}

/**
  * @access private
  */
override function __LZHandleNoNodes( ) {
    this.__LZHandleMultiNodes( [ ] );
}


/**
  * @devnote If the mask doesn't have a set size in the replication axis, don't affect it.
  *
  * Here's the idea. Coming in, we have an old list of clones that represents
  * some window into the dataset. Let's say the nodes are labelled alpha-
  * betically
  * so to start, we have
  * this.clones=[ m , n , o , p ]
  * When the situation changes, we end up with a situation where we want
  * the window to be like
  * this.clones=[ l , m , n , o ]
  * 
  * This algorithm moves the old list of clones to a temporary identifier
  * and then constructs a new array for the clones going through one by one
  * It keeps an offset, which represents the difference in position of the
  * old new data windows. In the case above, the offset would be -2.
  *
  * Ideally, this would use a view linkage if necessary
  * for now, the paging action will only happen in response to movement of
  * the immediate parent of the replicated views  
  * @access private
  */
override function __LZadjustVisibleClones (ln,nn){
    var nodelen = null;
    if (this.nodes) {
        nodelen = this.nodes.length;
    }

    if (nodelen != null) {
        if ( this.__LZoldnodelen != this.nodes.length ){
            this.cloneimmediateparent.setAttribute( this.sizeAxis , this.nodes.length* 
                                               this.totalsize -
                                               this.spacing );
            this.__LZoldnodelen = this.nodes.length;
        }
    }


    if (! (this.mask && this.mask[ "hasset" + this.sizeAxis ]) ) return;
    
    var newstart = 0;

    if (this.totalsize != 0) {
        newstart = Math.floor( - this.cloneimmediateparent[ this.axis ] 
                               / this.totalsize );
    }

    if ( 0 > newstart  ) newstart = 0;

    var oldstart = 0;
    var oldlength = this.clones.length;
    var offset = newstart - this.__LZdataoffset;

    var remainder = ( newstart * this.totalsize ) + 
                    this.cloneimmediateparent[this.axis];
    var newlength = 0;

    if (typeof(remainder) == 'number') {
        newlength= 1 + Math.floor( ( this.mask[ this.sizeAxis ] - remainder ) / 
                                     this.totalsize );
    } 

    //newstart is the new absolute lowerbound of the data winodw
    //newlength is the new length of the data window
    if (this.nodes != null) {
        if ( newlength + newstart >  this.nodes.length ) {
            newlength = this.nodes.length - newstart;
        }
    }

    //no change
    if ( offset == 0 && newlength == oldlength ) return;

    LzInstantiator.enableDataReplicationQueuing( );
    var oldclones = this.clones;
    this.clones = [];

    for ( var i = 0 ; i < newlength; i++ ){
        //before the new beginning
        var cl = false;
        if ( i + offset < 0 ){
            //this comes before the old data window
            if ( newlength + offset < oldlength  && oldlength > 0){
                //pull the clone off the end
                cl = oldclones[ --oldlength ];
            } else {
                cl = this.getNewClone();
            }
        } else if ( i + offset >= oldlength ){
            //this comes after the old data window
            if ( oldstart < offset && oldstart < oldlength  ){
                //pull the clone off the end
                cl = oldclones[ oldstart++ ];
            } else {
                cl = this.getNewClone();
            }
        }

        if ( cl ){
            this.clones[ i ] = cl;
            cl.setAttribute( this.axis , ( i + newstart ) * this.totalsize );
            cl.clonenumber = newstart + i ;
            if (this.nodes) {
                cl.datapath.setClonePointer( this.nodes[ newstart + i ]);
            }
            if (cl.onclonenumber.ready) cl.onclonenumber.sendEvent( i );
        } else {
            //otherwise, the oldclone and the newclone match
            this.clones[ i ] = oldclones[ i + offset ];
        }
    }

    while ( oldstart < offset  && oldstart < oldlength ){
        var v = oldclones[ oldstart++ ];
        this.detachClone( v );
        this.clonePool.push ( v );
    }

    while ( oldlength > newlength + offset && oldlength > 0 ){
        var v = oldclones[ --oldlength ];
        this.detachClone( v );
        this.clonePool.push ( v );
    }

    this.__LZdataoffset = newstart;
    LzInstantiator.clearDataReplicationQueue( );
}
            
/**
  * @access private
  */
override function toString (){
    return "Lazy clone manager in " + this.cloneimmediateparent;
}

/**
  * @access private
  */
override function getCloneForNode ( p , dontmake=null ){
    var cl = super.getCloneForNode( p ) ||
             null;
    if ( !cl && !dontmake ){
        //even though we're going to return this to the pool immediately,
        //use the class API to get a clone
        cl = this.getNewClone();
        cl.datapath.setClonePointer( p );
        this.detachClone( cl );
        this.clonePool.push ( cl );
    }

    return cl;

}


/**
  * Retuns a pointer to the nth clone controlled by the replication manager
  * @param Number n: The zero-based offset of the clone to retrieve
  * @return LzView: A pointer to the nth clone
  */
override function getCloneNumber ( n ){
    return this.getCloneForNode(this.nodes[n]);
}

}; // End of LzLazyReplicationManager
