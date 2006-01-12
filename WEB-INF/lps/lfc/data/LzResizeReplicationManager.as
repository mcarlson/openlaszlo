/******************************************************************************
 * LzResizeReplicationManager.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

var LzResizeReplicationManager = Class( "LzResizeReplicationManager" , LzLazyReplicationManager );
//need to destroy the original clone for resize in order to insert the 
//appropriate setHeight call
LzResizeReplicationManager.prototype.pooling = false;
//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzResizeReplicationManager.prototype.construct = function ( odp , args ){
    //_root.Debug.write( 'making resize repl' );

    super.construct( odp , args );

    this.datasizevar = '$' + this.getUID() + 'track';

}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzResizeReplicationManager.prototype.__LZsetCloneAttrs = function (){
    super.__LZsetCloneAttrs( );
    this.cloneAttrs.setHeight = _root.LzResizeReplicationManager.__LZResizeSetSize;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzResizeReplicationManager.prototype.getPositionByNode = function ( n ){
    var pos = -this.spacing;
    var cnode;
    if (this.nodes != null) {
        for ( var i = 0; i < this.nodes.length; i++ ){
            cnode = this.nodes[ i ];
            if ( n == this.nodes[ i ] ){
                return pos + this.spacing;
            }

            pos += this.spacing + ( cnode[this.datasizevar] || this.viewsize );

        }
    }
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzResizeReplicationManager.prototype.__LZreleaseClone = function ( v ){
    this.detachClone( v );
    this.clonePool.push ( v );
}

//-----------------------------------------------------------------------------
// @keywords private
// ln: lastnodes, old list of nodes
// nn: newnodes, boolean flag, true when __LZadjustVisibleClones is called
//     because of a change in the node list (e.g. setdatapointer, sort, etc)
//    (as opposed to, for example, when
//     the mask changes its height or item changes size
//-----------------------------------------------------------------------------
LzResizeReplicationManager.prototype.__LZadjustVisibleClones = function(ln,nn){
    //if the mask doesn't have a set size in the replication axis, don't affect
    //it

    if (! this.mask[ "hasset" + this.sizeAxis ] ) return;
    if ( this.__LZresizeupdating ) return;
    this.__LZresizeupdating = true;
    //_root.Debug.write( 'adj viz' , this.clones.length, this.nodes.length );

    var nl = (this.nodes != null) ? this.nodes.length : 0;
    var newstart =  - this.cloneimmediateparent[ this.axis ];
    var newstart =  0 > newstart ? 0 : Math.floor( newstart );
    var masksize = this.mask[ this.sizeAxis ];
     
    var newoffset = -1;
    var oldoffset = this.__LZdataoffset;
    if ( nn ){
        while( this.clones.length ) this.poolClone();
        var oldclones = null;
        var ocl = 0;
    } else {
        var oldclones = this.clones;
        var ocl = oldclones.length;
    }

    this.clones = [];


    //cpos is used at the end of this method to size the immediateparent
    //of the replication manager
    var cpos = -this.spacing;
    var inwindow = false;
    var newend = -1;

    //_root.Debug.write( 'oldclones', oldclones );
    var notfirst = true;
    for ( var i = 0; i < nl; i++ ){
        var cnode = this.nodes[ i ];
        var ds = cnode[ this.datasizevar ];
        var csiz = ( ds == null ) ? this.viewsize : ds;

        cpos += this.spacing;

        if ( !inwindow && newoffset == -1  && cpos - newstart +csiz >= 0 ) {
            //_root.Debug.write( 'inwindow at ' + i );
            var notfirst = i != 0;
            inwindow = true;
            var newstartpos = cpos;
            newoffset = i;
            //we can keep what we had
            var firstkept = i - oldoffset;
            //_root.Debug.write( 'fk' , firstkept  , i , oldoffset );
            firstkept = firstkept > ocl ? ocl : firstkept;
            //_root.Debug.write( 'firstkept' , firstkept );
            //don't setup loop unless we have to
            if ( firstkept > 0 ) {
                for ( var j =0; j < firstkept; j++ ){

                    var v = oldclones[ j ];
                    //can't call poolClone here...
                    this.__LZreleaseClone( v );
                }
            }
        } else if ( inwindow && cpos - newstart > masksize ) {
            inwindow = false;
            //pool any left over clones here
            newend = i - newoffset;
            var lastkept = i - oldoffset;
            lastkept = lastkept < 0 ? 0 : lastkept;
            //_root.Debug.write( 'lk' , lastkept , ocl );
            //don't setup loop unless we have to
            if ( lastkept < ocl ) {
                for ( var j =lastkept; j < ocl; j++ ){

                    var v = oldclones[ j ];
                    //if ( v == null ) _root.Debug.write( 'bad pool', j , lastkept );
                    //can't call poolClone here...
                    this.__LZreleaseClone( v );
                }
            }
        }

        if ( inwindow ){
            if ( i >= oldoffset && i < oldoffset + ocl ){
                //we can keep what we had
                var cl = oldclones[ i - oldoffset ];
                //if ( cl == null ) _root.Debug.write( 'bad keep' , i );
            } else {
                var cl = null;
                //if ( cl == null ) _root.Debug.write( 'bad get' , i );
            }

            //_root.Debug.write( i, newoffset );
            this.clones[ i - newoffset ] = cl;

        } 

        cpos += csiz;

    }

    var clpos = newstartpos;
    if ( notfirst ) clpos += this.spacing;
    for( var i = 0; i < this.clones.length; i++ ){
        var cnode = this.nodes[ i + newoffset ];
        var ds = cnode[ this.datasizevar ];
        var csiz = ( ds == null ) ? this.viewsize : ds;

        var cl = this.clones[ i ];
        if ( !cl ){
            cl = this.getNewClone( );
            cl.clonenumber = i + newoffset;
            cl.datapath.setClonePointer( cnode );
            cl.onclonenumber.sendEvent( i + newoffset );
            this.clones[ i ] = cl;
        }
        //_root.Debug.write( i, cl , clpos, csiz );

        this.clones[ i ] = cl;
        cl.setAttribute( this.axis , clpos );
        if ( cl[ this.sizeAxis ] != csiz ){
            cl.setAttribute( this.sizeAxis, csiz, true );
        }
        clpos += csiz + this.spacing;

    } 

    //_root.Debug.write( 'newoffset' , newoffset );
    //_root.Debug.write( 'this.clones' , this.clones );
    this.__LZdataoffset = newoffset;
    //_root.Debug.write( 'clones' , this.clones.length, 'pool', this.clonePool.length);
    //_root.Debug.write( 'oldclones' , oldclones );
    //_root.clo = this.clones;
    this.cloneimmediateparent.setAttribute( this.sizeAxis , cpos );
    this.__LZresizeupdating = false;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzResizeReplicationManager.prototype.__LZHandleCloneResize = function ( cl , s){
    var osize = cl.datapath.p[ this.datasizevar ] || this.viewsize;
    if ( s != osize ){
        cl.datapath.p[ this.datasizevar ] = s;
        this.__LZadjustVisibleClones();
    }
}

//-----------------------------------------------------------------------------
// @keywords private
// This is a funtion that is attached to each clone, which talks to the resize
// replication manager 
//-----------------------------------------------------------------------------
LzResizeReplicationManager.__LZResizeSetSize = function ( h , k ){
    #pragma 'methodName=setHeight'
    super.setHeight( h );
    if ( k != true ){
        this.cloneManager.__LZHandleCloneResize( this , h);
    }
}

/*

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzResizeReplicationManager.prototype.toString = function (){
    return "Resize clone manager in " + this.immediateparent;
}
*/
