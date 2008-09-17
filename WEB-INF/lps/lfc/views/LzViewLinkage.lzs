/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @affects lzview
  * @topic LFC
  * @subtopic Views
  */

/**
  * This is an object which is capable of transformations between two views. It
  * is somewhat slow to create, but once created should perform the
  * transformations quickly. Use of this object has been deprecated.
  * In general, it is bad practice to use scaling views as non-leaf nodes in
  * the view hierarchy. Constraints are generally sufficient for non-scaling
  * relation
  * 
  * An <class>LzViewLinkage</class> has two useful properties: a <attribute>scale</attribute> and an
  * <attribute>offset</attribute>.
  *
  * In addition to any fields documented in the section below, these fields are also available:
  *
  * <attribute>scale</attribute>: An <class>LzPoint</class> representing the scale
  * transformation of this linkage. 1 is no transformation.
  *
  * <attribute>offset</attribute>: An <class>LzPoint</class> representing the offset
  * to be added by this linkage.
  *
  * Each of these objects have two slots (x and y) which contain the relevant
  * scales and offsets between the two views in the linkage.
  * 
  * @access private
  */
class LzViewLinkage {

    var scale:* = 1;
    var offset:* = 0;
    var uplinkArray:Array = null;
    var downlinkArray:Array = null;

/**
  * @param fromView: the view from which to originate the transformation
  * @param toView: the reference view
  */
  function LzViewLinkage ( fromView, toView ) {
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
    } while( pview != toView && pview != canvas);

    this.downlinkArray = [ ];
    if (pview == toView) return;

    var pview = toView;
    do {
      pview = pview.immediateparent;
      this.downlinkArray.push ( pview );
    } while( pview != canvas);

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

/**
  * Updates the offset and scale of the view linkage.
  * @param xory: The axis ( "x" or "y" ) in which to update the view linkage.
  */
  function update (xory) {
    var tscale= 1;
    var toffset= 0;
    var scale = "_" + xory + "scale";

    if (this.uplinkArray) {
        var ual = this.uplinkArray.length;
        for (var i = 0 ; i < ual ; i++ ){
            var a = this.uplinkArray[i];
            tscale *= a[scale];
            toffset += a[xory] / tscale;
        }
    }

    if (this.downlinkArray) {
        for (var i = this.downlinkArray.length -1 ; i >= 0 ; i -- ){
            var a = this.downlinkArray[i];
            toffset -= a[xory] / tscale;
            tscale /= a[scale];
        }
    }

    this.scale[xory] = tscale;
    this.offset[xory] = toffset;
  }

  if ($debug) {
/**
  * Debug name gives the linkage as a 2d transform, just for yuks
  * @access private
  */
    LzViewLinkage.prototype._dbg_name = function () {
      return '[' +
        this.scale.x + ' 0 ' + this.offset.x +
        ' 0 ' + this.scale.y + ' ' + this.offset.y +
        ' 0 0 1]';
    };
  }
}
