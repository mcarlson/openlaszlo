/******************************************************************************
 * LaszloObjects.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//---
//@keywords private
//---
Object.error = function ( errorMessage ){
    trace ("******************** LASZLO ERROR ********************");
    trace ( errorMessage );
    trace ("********************  END   ERROR ********************");
}

//=============================================================================
// DEFINE OBJECT: LzViewLinkage
// @keywords private
// This is an object which is capable of transformations between two views. It
// is somewhat slow to create, but once created should perform the 
// transformations quickly. Use of this object has been deprecated. 
// In general, it is bad practice to use scaling views as non-leaf nodes in 
// the view hierarchy. Constraints are generally sufficient for non-scaling
// relation
// <br/>
// An LzViewLinkage has two useful properties: a <code>scale</code> and an
// <code>offset</code>.<br/>
// Each of these objects have two slots (x and y) which contain the relevant
// scales and offsets between the two views in the linkage.
//
// @param fromView: the view from which to originate the transformation
// @param toView: the reference view
//=============================================================================
LzViewLinkage = function ( fromView, toView ){
    //@field scale: An <b><i>LzPoint</b></i> representing the scale
    //transformation of this linkage. 1 is no transformation.
    this.scale = new Object ();
    //@field offset: An <b><i>LzPoint</b></i> representing the offset
    //to be added by this linkage.
    this.offset = new Object ();
    if (fromView == toView){ return; }

    this.uplinkArray = [ ];
    var pview = fromView;
    do {
        pview = pview.immediateparent;
        this.uplinkArray.push ( pview );
    } while( pview != toView && pview != _root.canvas);

    
    this.downlinkArray = [ ];

    if (pview == toView) return;
        
    var pview = toView;
    do {
        pview = pview.immediateparent;
        this.downlinkArray.push ( pview );
    } while( pview != _root.canvas);

     while (this.uplinkArray.length > 1 &&
            this.downlinkArray[this.downlinkArray.length -1 ] ==
           this.uplinkArray[this.uplinkArray.length - 1 ] &&
           this.downlinkArray[this.downlinkArray.length -2 ]  ==
           this.uplinkArray[this.uplinkArray.length - 2 ] ){
        //remove top level duplicates
        this.downlinkArray.pop();
        this.uplinkArray.pop();
    }

}

//-----------------------------------------------------------------------------
// Updates the offset and scale of the view linkage.
// @param xory: The axis ( "x" or "y" ) in which to update the view linkage.
//-----------------------------------------------------------------------------
LzViewLinkage.prototype.update = function ( xory ){
    var tscale= 1;
    var toffset= 0;
    var sx = xory == "x" ? "width" : "height";

    //this should go right on the stack
    for (var i = 0 ; i <this.uplinkArray.length ; i++ ){
        tscale *= this.uplinkArray[i].__LZmovieClipRef["_" + xory +"scale"] / 100;
        toffset += this.uplinkArray[i].getProp ( xory ) / tscale;
    }
    
    //this should go right on the stack
    for (var i = this.downlinkArray.length -1 ; i >= 0 ; i -- ){
        toffset -= this.downlinkArray[i].getProp ( xory ) / tscale;

        tscale /= this.downlinkArray[i].__LZmovieClipRef["_" + xory +"scale"]/ 100;

    }

    this.scale[xory] = tscale;
    this.offset[xory] = toffset;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzViewLinkage.prototype.toString = function ( ){
    return "Linkage: " + this.uplinkArray + this.downlinkArray;
}

if ($debug) {
//---
// Debug name gives the linkage as a 2d transform, just for yuks
// @keywords private
//---
LzViewLinkage.prototype._dbg_name = function () {
    return '[' + 
        this.scale.x + ' 0 ' + this.offset.x + 
        ' 0 ' + this.scale.y + ' ' + this.offset.y +
        ' 0 0 1]';
}
}
