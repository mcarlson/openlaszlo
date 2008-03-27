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
  * The <classname>LzResizeReplicationManager</classname> extends the capabilities of the <classname>LzLazyReplicationManager</classname> so that the elements in the replication can be resized in their axis. All of the restrictions on the use of the <classname>LzLazyReplicationManager</classname> apply to the <classname>LzResizeReplicationManager</classname> except for this one:
  * 
  * </p>
  * <ul>
  *     <li>The replicated view <em>can</em> change its size in the replication axis, and the size <em>can</em> be a constraint. Resize replication should work in all cases -- even those in which the replicated view is sized by its contents.</li>
  * </ul>
  * <p>
  * Note that the performance of a resize replication manager is related to the number of items displayed and the length of the data, whereas the lazy replication manager performance is only determined by the number of items displayed.
  * </p>
  * <example class="program" id="lzresizereplicationmanager-1">
  * &lt;canvas height="200"&gt;
  * 
  *     &lt;dataset name="vegetables"&gt;
  *         &lt;celery/&gt; &lt;celeriac/&gt; &lt;carrot/&gt; &lt;florence_fennel/&gt; &lt;parsnip/&gt; 
  *         &lt;parsley/&gt; &lt;winter_endive/&gt; &lt;witloof_chicory/&gt; &lt;cardoon/&gt; 
  *         &lt;artichoke/&gt; &lt;head_lettuce/&gt; &lt;cos_lettuce/&gt; &lt;black_salsify/&gt; 
  *         &lt;swedish_turnip/&gt; &lt;cauliflower/&gt; &lt;cabbage/&gt; &lt;brussels_sprouts/&gt; 
  *         &lt;kohlrabi/&gt; &lt;broccoli/&gt; &lt;savoy_cabbage/&gt; &lt;turnip/&gt; &lt;radish/&gt; 
  *         &lt;water_cress/&gt; &lt;garden_cress/&gt; &lt;foliage_beet/&gt; &lt;spinach/&gt; 
  *         &lt;sweet_potato/&gt; &lt;watermelon/&gt; &lt;melon/&gt; &lt;cucumber/&gt; &lt;winter_squash/&gt; 
  *         &lt;marrow/&gt; &lt;chickpea/&gt; &lt;lentil/&gt; &lt;runner_bean/&gt; &lt;common_bean/&gt; 
  *         &lt;pea/&gt; &lt;faba_bean/&gt; &lt;leek/&gt; &lt;shallot/&gt; &lt;onion/&gt; &lt;salsify/&gt; 
  *         &lt;welsh_onion/&gt; &lt;garlic/&gt; &lt;chives/&gt; &lt;asparagus/&gt; &lt;ladyfinger/&gt; 
  *         &lt;sweet_corn/&gt; &lt;rhubarb/&gt; &lt;capsicum_pepper/&gt; &lt;tomato/&gt; &lt;eggplant/&gt;
  * 
  *     &lt;/dataset&gt;
  * 
  *     &lt;simplelayout spacing="10" /&gt;
  *     &lt;text width="200" oninit="checkSubviews()"&gt;
  *         &lt;method name="checkSubviews"
  *                 event="onaddsubview" reference="replicationParent"&gt;
  *             this.setText( 'number of subviews: ' + 
  *                           replicationParent.subviews.length );
  *         &lt;/method&gt;
  * 
  *     &lt;/text&gt;
  * 
  *     &lt;view <span class="redText">clip="true"</span> width="100" height="160" id="clipper"&gt;
  *         &lt;<span class="redText">view id="replicationParent"</span>&gt;
  *             &lt;view bgcolor="#CCCCFF" height="15"&gt;
  *                 &lt;datapath xpath="vegetables:/* /name()" <span class="redText">spacing="5" replication="resize"</span>/&gt;
  * 
  *                 &lt;text datapath="name()" valign="middle"/&gt;
  *                 &lt;method name="toggleSize" event="onclick"&gt;
  *                     if ( this.height != 40 ){
  *                         this.animate ( 'height', 40 , 500 );
  *                     } else {
  *                         this.animate ( 'height', 15 , 500 );
  *                     }
  *                 &lt;/method&gt;
  *                 &lt;/view&gt;
  *         &lt;/view&gt;
  *         &lt;scrollbar/&gt;
  * 
  *     &lt;/view&gt;
  * 
  * &lt;/canvas&gt;
  * </example>
  * <p class="smaller">Using a resize replication manager to display a large datasetwhen the elements resize.</p>
  *
  * @shortdesc An optimization for displaying large sets of data that allows the elements to resize.
  */
class LzResizeReplicationManager extends LzLazyReplicationManager {
//need to destroy the original clone for resize in order to insert the 
//appropriate setHeight call

  static var setters = new LzInheritedHash(LzLazyReplicationManager.setters);
  static var getters = new LzInheritedHash(LzLazyReplicationManager.getters);
  static var defaultattrs = new LzInheritedHash(LzLazyReplicationManager.defaultattrs);
  static var options = new LzInheritedHash(LzLazyReplicationManager.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzLazyReplicationManager.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzLazyReplicationManager.earlySetters);


var datasizevar;
var __LZresizeupdating;

/**
  * @access private
  */
function LzResizeReplicationManager ( odp , args, children:* = null, instcall:* = null ){
    super(odp, args, children, instcall);
}

override function construct ( odp , args ){
    this.pooling = false; // Defined in LzReplicationManager

    super.construct.apply(this, arguments);
    this.datasizevar = '$' + this.getUID() + 'track';
}

/**
  * @access private
  */
override function __LZsetCloneAttrs (){
// TODO [2008-02-11 pbr] How does this work in swf9
if ($swf9) {
    super.__LZsetCloneAttrs();
} else {
    super.__LZsetCloneAttrs.apply(this, arguments);
    this.cloneAttrs.setHeight = LzResizeReplicationManager.__LZResizeSetSize;
}
}

/**
  * @access private
  */
function getPositionByNode ( n ){
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


/**
  * @access private
  */
function __LZreleaseClone ( v ){
    this.detachClone( v );
    this.clonePool.push ( v );
}

/**
  * @access private
  * ln: lastnodes, old list of nodes
  * nn: newnodes, boolean flag, true when __LZadjustVisibleClones is called
  * because of a change in the node list (e.g. setdatapointer, sort, etc)
  * (as opposed to, for example, when
  * the mask changes its height or item changes size
  */
override function __LZadjustVisibleClones(ln,nn){
    //if the mask doesn't have a set size in the replication axis, don't affect
    //it

    if (! this.mask[ "hasset" + this.sizeAxis ] ) return;
    if ( this.__LZresizeupdating ) return;
    this.__LZresizeupdating = true;
    //Debug.write( 'adj viz' , this.clones.length, this.nodes.length );

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

    //Debug.write( 'oldclones', oldclones );
    var notfirst = true;
    for ( var i = 0; i < nl; i++ ){
        var cnode = this.nodes[ i ];
        var ds = cnode[ this.datasizevar ];
        var csiz = ( ds == null ) ? this.viewsize : ds;

        cpos += this.spacing;

        if ( !inwindow && newoffset == -1  && cpos - newstart +csiz >= 0 ) {
            //Debug.write( 'inwindow at ' + i );
            var notfirst = i != 0;
            inwindow = true;
            var newstartpos = cpos;
            newoffset = i;
            //we can keep what we had
            var firstkept = i - oldoffset;
            //Debug.write( 'fk' , firstkept  , i , oldoffset );
            firstkept = firstkept > ocl ? ocl : firstkept;
            //Debug.write( 'firstkept' , firstkept );
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
            //Debug.write( 'lk' , lastkept , ocl );
            //don't setup loop unless we have to
            if ( lastkept < ocl ) {
                for ( var j =lastkept; j < ocl; j++ ){

                    var v = oldclones[ j ];
                    //if ( v == null ) Debug.write( 'bad pool', j , lastkept );
                    //can't call poolClone here...
                    this.__LZreleaseClone( v );
                }
            }
        }

        if ( inwindow ){
            if ( i >= oldoffset && i < oldoffset + ocl ){
                //we can keep what we had
                var cl = oldclones[ i - oldoffset ];
                //if ( cl == null ) Debug.write( 'bad keep' , i );
            } else {
                var cl = null;
                //if ( cl == null ) Debug.write( 'bad get' , i );
            }

            //Debug.write( i, newoffset );
            this.clones[ i - newoffset ] = cl;

        } 

        cpos += csiz;

    }

    var clpos = newstartpos;
    if ( notfirst ) clpos += this.spacing;
    for( var i = 0; i < this.clones.length; i++ ){
        var cnode = this.nodes[ i + newoffset ];

        var cl = this.clones[ i ];
        if ( !cl ){
            cl = this.getNewClone( );
            cl.clonenumber = i + newoffset;
            cl.datapath.setClonePointer( cnode );
            if (cl.onclonenumber.ready) cl.onclonenumber.sendEvent( i + newoffset );
            this.clones[ i ] = cl;
        }
        //Debug.write( i, cl , clpos, csiz );

        this.clones[ i ] = cl;
        cl.setAttribute( this.axis , clpos );
        var ds = cnode[ this.datasizevar ];
        var csiz = ( ds == null ) ? this.viewsize : ds;
        if ( cl[ this.sizeAxis ] != csiz ){
            cl.setAttribute( this.sizeAxis, csiz, true );
        }
        clpos += csiz + this.spacing;

    } 

    //Debug.write( 'newoffset' , newoffset );
    //Debug.write( 'this.clones' , this.clones );
    this.__LZdataoffset = newoffset;
    //Debug.write( 'clones' , this.clones.length, 'pool', this.clonePool.length);
    //Debug.write( 'oldclones' , oldclones );
    //clo = this.clones;
    this.cloneimmediateparent.setAttribute( this.sizeAxis , cpos );
    this.__LZresizeupdating = false;
}

/**
  * @access private
  */
function __LZHandleCloneResize ( cl , s){
    if (! cl.datapath.p) return; 
    var osize = cl.datapath.p[ this.datasizevar ] || this.viewsize;
    if ( s != osize ){
        cl.datapath.p[ this.datasizevar ] = s;
        this.__LZadjustVisibleClones(null, null);
    }
}

/**
  * @access private
  * This is a funtion that is attached to each clone, which talks to the resize
  * replication manager 
  */
function __LZResizeSetSize ( h , k ){
// TODO [2008-02-11 pbr] setHeight is defined in a view, not a node
//    super.setHeight( h );
    if ( k != true ){
        LzResizeReplicationManager(this.cloneManager).__LZHandleCloneResize( this , h);
    }
}

/*
 * @access private
override function toString (){
    return "Resize clone manager in " + this.immediateparent;
}
*/

}; // End of LzResizeReplicationManager
