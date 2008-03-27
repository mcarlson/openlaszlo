/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic LFC
  * @subtopic Data
  * @access public
  */

/**
  * <p>
  * A datapointer is an object that represents a pointer to a node in a
  * <classname>LzDataset</classname>. The datapointer can be repositioned
  * using either cursor movements calls such as 
  * <xref linkend="LzDatapointer.prototype.selectNext"/>, or by running an XPath 
  * request via <xref linkend="LzDatapointer.prototype.setXPath"/>.
  * </p>
  * 
  * <p>
  * Datapointers support a subset of the <a
  * href="http://www.w3.org/TR/xpath">XPath specification</a>, which uses
  * a notation similar to the UNIX file-system to refer to nodes within a
  * dataset. Once a datapointer is bound to a node in a dataset it will
  * keep pointing to that node until it is moved. If the dataset is edited,
  * the behavior of the datapointer will be controlled by its <xref linkend="LzDatapointer.__ivars__.rerunxpath"/> attribute. If this attribute is
  * true, it will continue pointing to its current
  * node as long as it is valid.</p>
  * 
  * <p>The example below demonstrates the use of some of the
  * features of datapaths to retrieve data from a dataset.</p>
  * 
  * <example title="Using a datapointer to retrieve data from a dataset">
  * <programlisting>&lt;canvas height="80"&gt;
  *   &lt;simplelayout spacing="5"/&gt;
  *   &lt;dataset name="mydata"&gt;
  *     &lt;record&gt; This is some text 
  *       &lt;deeper&gt;
  *         &lt;deeprecord&gt; This is a deeper level &lt;/deeprecord&gt;
  *         &lt;deeprecord&gt; It's dark down here! &lt;/deeprecord&gt;
  *         &lt;deeprecord&gt; Last deep record &lt;/deeprecord&gt;
  *       &lt;/deeper&gt;
  *     &lt;/record&gt;
  *     &lt;record&gt; This is more text &lt;/record&gt;
  *     &lt;record&gt; Exciting no? &lt;/record&gt;
  *     &lt;record&gt; The final line of text &lt;/record&gt;
  *   &lt;/dataset&gt;
  * 
  *   &lt;view&gt;
  *     &lt;simplelayout/&gt;
  *     <em>&lt;datapointer id="mydp" xpath="mydata:/record[1]"/&gt;</em>
  *     &lt;button&gt; Move forward with select
  *       &lt;handler name="onclick"&gt;
  *         if (mydp.selectNext()) var s = <em>mydp.getNodeText();</em>
  *         else var s = "hit last record; reset with xpath";
  *         output.setText(s);
  *       &lt;/handler&gt;
  *     &lt;/button&gt;
  *     &lt;button&gt; Set with XPath
  *       &lt;handler name="onclick"&gt;
  *           if (mydp.getNodeName() == "record")
  *             var xp = <em>"mydata:/record[1]/deeper/deeprecord[1]";</em>
  *           else var xp = <em>"mydata:/record[1]";</em>
  *           <em>mydp.setXPath( xp );</em> output.setText(<em>mydp.getNodeText()</em>);
  *       &lt;/handler&gt;
  *     &lt;/button&gt;
  *   &lt;/view&gt;
  * 
  *   &lt;text name="output" width="200"&gt;Data will appear here.&lt;/text&gt;
  * &lt;/canvas&gt;</programlisting></example>
  *
  * @shortdesc A cursor in a dataset.
  * @lzxname datapointer
  * @see LzDataset
  */
class LzDatapointer extends LzNode {

  static var setters = new LzInheritedHash(LzNode.setters);
  static var getters = new LzInheritedHash(LzNode.getters);
//  See below. defaultattrs doesn't get LzNode values
//  static var defaultattrs = new LzInheritedHash(LzNode.defaultattrs);
  static var options = new LzInheritedHash(LzNode.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzNode.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzNode.earlySetters);

  LzDatapointer.setters.xpath = "setXPath";
  LzDatapointer.setters.context = "setDataContext";
  LzDatapointer.setters.pointer = "setPointer";
  LzDatapointer.setters.p = "setPointer";
  LzDatapointer.setters.rerunxpath = "__LZsetRerunXPath";


/** @access private
  * @modifiers override 
  */
static var tagname = 'datapointer';

/** The LzDataNode that the datapointer is pointing
  * to. Calling <method>setAttribute</method> on attribute calls
  * <method>LzDatapointer.setPointer</method>.
  * @type LzDataNode
  */
var p = null;

/** The reference to a clonemanager from a clone.
    @modifiers readonly */ 
var context = null;

/** @access private */
var __LZtracking = null;
/** @access private */
var __LZtrackDel = null;

var xpath = null;
var parsedPath = null;
var __LZlastdotdot = null;
var __LZspecialDotDot = false;
var __LZspecialOndata = false;
var __LZdotdotCheckDel;
var __LZoldDataDel;
var __LZoldOndataWarn;
var errorDel;
var timeoutDel;

// [2006-07-25 pbr] This clears out what is defined in LzNode. Is this ok?
static var defaultattrs:* = new LzInheritedHash({ ignoreplacement : true });


/** This determines the behavior of the
  * datapointer in response to notification that the dataset the
  * datapointer is mapped to has changed. If
  * <attribute>rerunxpath</attribute> is true, the datapointer will
  * always rerun its remembered XPath (set with the
  * <attribute>xpath</attribute> property). If it is false, the
  * datapointer will only verify that the node it is pointing to is
  * still in the dataset. If it isn't, the datapointer will rerun
  * its remembered xpath (if it has one) or will print a debug
  * message if any further attempt is made to use its current node
  * as the basis for a relative XPath query.
  * 
  * @type Boolean
  */
var rerunxpath = false;

/** @lzxtype event */
var onp = LzDeclaredEvent;
/** @lzxtype event */
var onDocumentChange = LzDeclaredEvent;
/** Sent when the data selected by this datapointer's <attribute>xpath</attribute>
  * changes. For XPaths which select a datanode, this means that the
  * datapointer is pointing to a new node. For XPaths which select text data,
  * this means that the datapointer is pointing to a new node, or that the
  * text selected by the <attribute>xpath</attribute> has changed. Note that a datapointer mapped to
  * a data node will not receive <event>ondata</event> when the node, say, changes one of
  * its attributes.
  * @lzxtype event
  */
// var ondata = LzDeclaredEvent;
/** Sent when the dataset that the datapointer 
  * is pointing to generates an error.
  * @lzxtype event
  */
var onerror = LzDeclaredEvent;
/** Sent when a request by the dataset that 
  * the datapointer is pointing to times out.
  * @lzxtype event  
  */
var ontimeout = LzDeclaredEvent;
/** @lzxtype event */
var onrerunxpath = LzDeclaredEvent;


    function LzDatapointer ( parent:* = null , attrs:* = null, children:* = null, instcall:*  = null) {
      super (parent, attrs, children, instcall);
    }


//to set datapointer to datasource:dataset
//<datapointer xpath="foo:bar/">
//or just dataset
//<datapointer xpath="bar/">

/** @access private */
function childOrSelf ( p ){
    var cp = this.p;
    do {
        if ( cp == p ) return true;
        cp = cp.$p;
    } while( cp && cp.$n <= this.p.$n );
}

/**
  * Called when the datapointer receives an <event>onerror</event> event from
  * the dataset it's pointing to.
  * @access private
  */
function gotError ( msg ){
    if (this.onerror.ready) this.onerror.sendEvent( msg );
}

/**
  * Called when the datapointer's dataset's request times out...
  * @access private
  */
function gotTimeout ( msg ){
    if (this.ontimeout.ready) this.ontimeout.sendEvent( msg );
}

/**
  * Returns the result of an XPath query without changing the pointer. 
  * The result can be:
  * <ul>
  * <li>a string -- the result of an operator such as name or attribute</li>
  * <li>a single datapointer -- if the query resolves to a single node</li>
  * <li>an array of datapointers -- if the query resolves to multiple nodes</li>
  * </ul>
  * @param Object p: the XPath
  * @deprecated Use <code>LzDatapointer.xpathQuery()</code> or a
  * <code>$path{}</code> instead.
  */
function getXPath ( p ){ 
    if ( $debug ){
        if ( !this.didGetXPathWarn ){
          Debug.info("%w.%s is deprecated.  Use %w.%s or a $path{} constraint instead.",
                     this, arguments.callee, this, this.xpathQuery);
        }
        this.didGetXPathWarn = true;
    }
    var r = this.xpathQuery( p );
    var nr
    //testing for nodeType is the best way I can think of to check if the
    //return value is a node

    if ( r[0].nodeType ){
        //it's an array of dataNodes
        nr = [];
        for ( var i = 0; i < r.length; i++ ){
            nr[i] = new LzDatapointer( null, { p : r[ i ] } );
        }
    } else if ( r.nodeType ){
        nr = new LzDatapointer( null, { p : r } );
    } else {
        nr = r;
    }

    return nr;

}

/**
  * Returns the result of an XPath query without changing the pointer. 
  * @param Object p: the xpath
  * @return any: <dl class="compact">
  * <dt><code>null</code></dt><dd>if the
  * query is invalid or matches nothing</dd>
  * <dt>a <code>String</code></dt><dd>the result of an operator such as <code>name</code> or <code>attribute</code></dd>
  * <dt>an <classname>LzDataElement</classname></dt><dd>if the query resolves to a single node</dd>
  * <dt>an array of <classname>LzDataElement</classname></dt><dd>if the query resolves to multiple nodes</dd>
  * </dl>
  */
function xpathQuery ( p ){ 
    var pp = this.parsePath ( p );
    var ppcontext = pp.getContext(this);
    var nodes = this.__LZgetNodes( pp , ppcontext ? ppcontext : this.p);
    if ( ! nodes ) return null;

    if ( pp.aggOperator != null ){
        if ( pp.aggOperator == 'last' ){
            return nodes.length || this.__LZgetLast();
        } if ( pp.aggOperator == 'position' ){
            if ( nodes.length ){
                var rarr = [];
                for ( var i =0; i < nodes.length; i++ ){
                    rarr.push( i + 1 );
                }
                return rarr;
            } else {
                return this.__LZgetPosition();
            }
        }
    } else if ( pp.operator != null  ){
        if ( nodes.length ){
            var oarr = [];
            for ( var i = 0; i < nodes.length; i++ ){
                oarr.push( this.__LZprocessOperator( nodes[ i ] , pp ) );
            }
            return oarr;
        } else {
            return this.__LZprocessOperator( nodes, pp );
        }
    } else {
        return nodes;
    }
}

/** @access private */
/*
prototype.xpathQuery.dependencies = function ( who , self , p ){
    if (this.parsePath) {
        var pp  = this.parsePath( p );
        return [ pp.hasDotDot ? self.context.getContext().ownerDocument : self , 
                 "DocumentChange" ];
    } else {
        return [  self , "DocumentChange" ];
    }
}
*/


/** @access private */

// TODO
if ($swf9) {
} else {
prototype.getXPath.dependencies = xpathQuery.dependencies;
}


/**
  * Points this datapointer at p.
  * @param LzDataNode p: The new target for this datapointer.
  */
function setPointer ( p ) {

    if ( !canvas.__LZoldOnData ){
        this.setXPath( null );
        if ( p != null ){
            this.setDataContext( p.ownerDocument );
        } else {
            this.__LZsetTracking( null );
        }
    }

    var dc = this.data != p;
    var pc = this.p != p;

    this.p = p;
    this.data = p;

    this.__LZsendUpdate ( dc , pc );
    return p!=null;
//PBR
Debug.write("LzDatapointer.setPointer", this.p, this);

}

/**
  * Returns a reference to the datapointer's dataset.
  * @return LzDataset: The datapointer's dataset
  */
function getDataset ( ){ 
    if ( this.p == null ) { 
        if ( this.context == this ) return null;
        return this.context.getDataset();
    }
    return this.p.ownerDocument;
}

/**
  * Sets the <attribute>xpath</attribute> attribute to
  * <param>param</param>, and sets the current node to the node that it
  * refers to.
  * 
  * If the XPath contains a terminal selector such as
  * <code>text()</code>, the datapointer's <attribute>data</attribute>
  * property is set to that value. It is error to set a datapointer to
  * an XPath that matches multiple nodes.
  * @param String p: An XPath.
  * @return Boolean|Undefined: <code>true</code> if the path matches a
  * single node, <code>false</code> if no or multiple nodes are
  * matched, <code>undefined</code> if the path is invalid.
  */
function setXPath ( p, val = null ){ 
    var hasxpath = p;
    if (! hasxpath) {
        this.xpath = null;
        this.parsedPath = null;
        // track if there's an ownerDocument
        if ( this.p ) this.__LZsetTracking( this.p.ownerDocument );
        return;
    }

    this.xpath = p;
    this.parsedPath = this.parsePath( p );
    var ppcontext = this.parsedPath.getContext(this);
    
    if ( this.rerunxpath && 
         this.parsedPath.hasDotDot && 
         !ppcontext  ){
        //ruh roh
        this.__LZspecialDotDot = true;
    } else {
        if ( this.__LZdotdotCheckDel ){
            this.__LZdotdotCheckDel.unregisterAll();
        }
    }

    if ( canvas.__LZoldOnData ){
        if ( ppcontext && ! this.parsedPath.selectors.length &&
            !this.rerunxpath ){
            this.__LZspecialOndata = true;
        } else if ( this.__LZspecialOndata ){

if ($swf9) {
    this.__LZspecialOndata = null;
} else {
    delete this.__LZspecialOndata;
}

        }
    }

    this.setDataContext( ppcontext );

    return  this.runXPath(  );
}

/** @access private */
function runXPath ( ){ 
    if ( !this.parsedPath ) {
        return;
    }

    var newc = null;

// [2008-03-12 pbr] Can't use 'in' in swf9
//    if ( this.context && 'getContext' in this.context ){
    if ( this.context) {
        newc = this.context.getContext();
    }

    if ( newc ) {
        var n = this.__LZgetNodes( this.parsedPath , newc , 0 );
    } else {
        var n = null;
    }

    if ( !n ){
        //no node found
        this.__LZHandleNoNodes();
        return false;
// [2008-03-12 pbr] Use 'is' to see if it's an array, not n.length
//    }else if ( n.length ) {
    }else if ( n is Array ) {
        this.__LZHandleMultiNodes( n );
        return false;
    } else {
        this.__LZHandleSingleNode( n );
        return true;
    }

}

/** @access private */
function __LZsetupDotDot ( p ){
    if ( this.__LZlastdotdot != p.ownerDocument ){
        //this requires special processing, since it doesn't only depend
        //on its context
        if ( !this.__LZdotdotCheckDel ){
            this.__LZdotdotCheckDel = new LzDelegate( this , 
                                                        "__LZcheckDotDot" );
        } else {
            this.__LZdotdotCheckDel.unregisterAll();
        }

        this.__LZlastdotdot = p.ownerDocument; 
        this.__LZdotdotCheckDel.register( this.__LZlastdotdot , 
                                            "onDocumentChange" );
    }
}

/** @access private */
function __LZHandleSingleNode ( n ){ 
    if ( this.__LZspecialDotDot ) this.__LZsetupDotDot( n );

    this.__LZupdateLocked = true;

    this.__LZpchanged = n != this.p;

    this.p = n;

    this.__LZsetData( );

    this.__LZupdateLocked = false;

    //this prevents the datapointer from sending the ondata event when it is
    //bound solely to the root node of a dataset. This enables backwards 
    //compatibility with the old semantics of ondata
    if ( this.__LZspecialOndata ){
        if ( n.childNodes.length ){
            if ( this.ondata && !this.__LZoldOndataWarn ){
                if ($debug) {
                Debug.info( "Datapointer pointing to %w," +
                    ' relies on the ondata event from' +
                    " a datapointer bound to the root node of a dataset."+
                    " \n    This behavior is deprecated." +
                    " Point the dataponter the first child " +
                    " of the dataset, or use the dataset's ondata event.", this.context);
                }
                this.__LZoldOndataWarn = true;
            }

            this.p = this.context;
            if (this.ondata.ready) this.ondata.sendEvent( this.p );
        }
        return;
    }

    this.__LZsendUpdate();
}

/** @access private */
function __LZHandleNoNodes ( ){ 

    var pc = this.p != null;
    var dc = this.data != null;
    this.p = null;
    this.data = null
    this.__LZsendUpdate( dc , pc );
}


/** @access private */
function __LZHandleMultiNodes ( n ){ 
    if ($debug) {
        Debug.error("%w matched %d nodes", this, n.length);
    }
    this.__LZHandleNoNodes();
}

/** @access private */
function __LZsetData ( ){ 
    if ( this.parsedPath && this.parsedPath.aggOperator != null ){
        if ( this.parsedPath.aggOperator == 'last' ){
            this.data = this.__LZgetLast();
            this.__LZsendUpdate( true );
        } if ( this.parsedPath.aggOperator == 'position' ){
            this.data = this.__LZgetPosition();
            this.__LZsendUpdate( true );
        }
    } else if ( this.parsedPath && this.parsedPath.operator != null ){
        this.__LZsimpleOperatorUpdate ();
    } else {
        if ( this.data != this.p ){
            this.data = this.p;
            this.__LZsendUpdate( true );
        }
    }
}

/** @access private */
function __LZgetLast ( ){ 
    if ( this.context == this ) return 1;
    return this.context.__LZgetLast() || 1;
}

/** @access private */
function __LZgetPosition ( ){ 
    if ( this.context == this ) return 1;
    return this.context.__LZgetPosition() || 1;
}

/** @access private */
var __LZupdateLocked = false;
/** @access private */
var __LZpchanged = false;
/** @access private */
var __LZdchanged = false;

/** @access private */
function __LZsendUpdate ( upd = null , upp = null ){ 

    this.__LZdchanged = upd || this.__LZdchanged;
    this.__LZpchanged = upp || this.__LZpchanged;

    if ( this.__LZupdateLocked ){
        return false;
    }

    if ( this.__LZdchanged) {
        if (this.ondata.ready) this.ondata.sendEvent( this.data );
        this.__LZdchanged = false;
    }

    if ( this.__LZpchanged) {
        if (this.onp.ready) this.onp.sendEvent( this.p );
        this.__LZpchanged = false;
        if (this.onDocumentChange.ready) this.onDocumentChange.sendEvent( { who: this.p , 
                                           type: 2 , 
                                           what: 'context'});
    }
    return true;
}

/**
  * Tests whether or not this datapointer is pointing to a valid node.
  * @return Boolean: True if the current node is valid.
  */
function isValid ( ){ 
    return this.p != null;
}

/** @access private */
function __LZsimpleOperatorUpdate ( ){ 
    var ndat = this.__LZprocessOperator( this.p , this.parsedPath );
    //second clause is necessary to process updates for @*
    var dchanged = false;
    if ( this.data != ndat || this.parsedPath.operator == "attributes" ){
        this.data = ndat;
        dchanged = true;
    }
    this.__LZsendUpdate( dchanged );
}

var ppcache = {};

/**
  * Parses a fully qualified XPath and yields an object with the components
  * listed below. These are cached.
  * Canonical xpath: ../nodea/nodeb[2]/@foo
  * Canonical xpath: nodea/nodeb[2]/@*
  * Canonical xpath: ./nodea/nodeb[2-]/text()
  * Canonical xpath: /nodea/nodeb[8]/*
  * Canonical xpath: dset:/nodea/nodeb[-8]
  * Canonical xpath: dsrc:dset:/nodea/nodeb[2-8]
  * @access private
  */
function parsePath ( pa ){
    if (pa instanceof LzDatapath) pa = pa.xpath;
    var q = this.ppcache[ pa ];
    if (q == null) {
        q = new LzParsedPath(pa, this);
        this.ppcache[ pa ] = q;
    }
    return q;
}

/**
  * Locates a local data context based on the parsed path
  * @access private
  */
function getLocalDataContext(pp) {
    var n = this.parent;
    if (pp) {
        var a = pp;
        for (var i = 0; i < a.length; i++) {
            //Debug.write(n + '.' + a[i] + '=' + n[a[i]]);
            if (n) n = n[a[i]];
        }
        if (n && n instanceof LzDataset == false && n['localdata'] instanceof LzDataset == true) {
            n = n['localdata']
        }
    }

    if (n != null && n instanceof LzDataset) {
        //Debug.write('found local dataset', n);
        return n;
    } else {
        if ($debug) {
            Debug.warn('local dataset "%w" not found in %w', pp, this.parent);
        }
        /* Could register for node creation if datapath is created before dataset
        */
    }
}

//Table of xpath node operator symbols and the functions they call
var pathSymbols= { '/': 1, '..': 2, '*': 3, '.': 4};


/** @access private */
function __LZgetNodes ( pathobj , p , startpoint = null ){

  var np;

  if ( p == null ){
      if ( $debug ) {
          Debug.info("%s: p is null in %s", arguments.callee, this);
      }
      return false;
  }

  if (pathobj.selectors != null) {

    var pathlen = pathobj.selectors.length;
    var ignorenext = 0;

    for ( var i = startpoint ? startpoint : 0 ; i < pathlen; i++ ){

      var cp = pathobj.selectors[ i ];
      var specialop = this.pathSymbols [ cp ];

      var posnext = pathobj.selectors[ i+1 ];
      if ( posnext && posnext.pred == "range" ){
        //next is range operator
        //we'll handle that in this pass, so increment counter again
        var range = pathobj.selectors[ ++i ];
      } else {
        var range = null;
      }


      np = null;

      if ( 'pred' in cp && null != cp.pred ){
        if ( cp.pred == "hasattr" ){
          p = p.hasAttr( cp.attr ) ? p : false;
        } else if ( cp.pred == "attrval" ){
          if (p.attributes != null) {
            p = p.attributes[  cp.attr ] == cp.val ? p : false;
          } else {
            p = false;
          }
        }
      } else if ( !specialop ){
        //named node
        np = this.nodeByName( cp , range , p );
      } else if ( specialop == 1 ){
        //root
        p = p.ownerDocument;
      } else if ( specialop == 2 ){
        //parent
        p = p.parentNode;
      } else if ( specialop == 3 ) {
        //all children
        np = [];
        var cnt = 0;

        if (p.childNodes) {
          for ( var j = 0; j < p.childNodes.length;j++ ){
            //remove nulls and text nodes
            if ( p.childNodes[ j ].nodeType==LzDataNode.ELEMENT_NODE){
              cnt++;
              if ( !range || cnt >= range[ 0 ] ){
                np.push( p.childNodes[ j ] );
              }
              if ( range && cnt == range[ 1 ] ){
                break;
              }
            }
          }
        }

      } /*else if ( specialop == 4 ) {
        // . (ignore)
        }*/

      if ( np != null ){
        if ( np.length > 1 ){
          var rval = [];

          if ( i == pathlen - 1 ){
            return np;
          } //else

          for ( var j = 0; j < np.length; j++ ){
            var r = this.__LZgetNodes( pathobj , np[ j ], i+1 );

            if ( r != null && r.length > 0 ){
              for ( var n= 0; n < r.length; n++ ){
                if ( r[ n ])  rval.push( r[ n ] );
              }
            } else if ( r ) rval.push ( r );

          }

          if ( !rval.length ) {
            return null;
          }else if (rval.length == 1){
            return rval[ 0 ];
          } else return rval;
        } else {
          p = np [ 0 ];//I've finally proven it!
        }
      }

      if ( ! p  ){
        return false;
      }
    }
  }

  return p;
}

/**
  * This is the shared interface between dataset and datapointer that allows
  * one datapointer to function as the datacontext for another
  * @access private
  */
function getContext ( chgpkg = null){
    return this.p;
}

/**
  * Select node by name at the current level.  Returns
  * <code>null</code>, an offset, or an array of offsets.
  * @access private
  * @param name: node name 
  * @param range: range string
  * @return: null or an offset
  */
function nodeByName ( name, range , p) {
    var o = []; 
    var cnt = 0;
    if ( !p ){ 
        var p = this.p;
        if ( ! this.p ) return null;     
    }
    
    if (p.childNodes) {
        for ( var i = 0; i < p.childNodes.length; i++ ){
            var cn = p.childNodes[i];
            if ( cn && cn.nodeName == name ){
                //match
                cnt++;
                if ( !range || cnt >= range[ 0 ] ){
                    o.push( cn );
                } 
                if ( range && cnt == range[ 1 ] ){
                    break;
                }
            }
        }
    }
    //Debug.write( "node by name returning: " + o + " for " + name );
    return o;
}

/** @access private */
function __LZsetRerunXPath ( rrx ){
    this.rerunxpath = rrx;

    if (this.onrerunxpath.ready) this.onrerunxpath.sendEvent( rrx );
}

/**
  * Return a new datapointer that points to the same node, has a
  * <code>null</code> <attribute>xpath</attribute> and a
  * <code>false</code> <attribute>rerunxpath</attribute> attribute.
  * @return LzDataPointer: A new datapointer that points to the same spot as this
  * one, but 
  */
function dupePointer (){
    var dp = new LzDatapointer( );
    dp.setFromPointer( this );
    return dp;
}

/** @access private */
function __LZdoSelect (selector, amnt) {
  amnt = amnt ? amnt : 1;
  var np = this.p;
  for (; np != null && amnt > 0; amnt--) {
      if (typeof (np[selector]) == 'function') {
          np = np[selector]();
      }
  }
  if (np != null) {
    this.setPointer( np );
    return true;
  }
  return false;
}


/**
  * Selects the next sibling node in the dataset if possible.
  * @param Number amnt: If given, the number of nodes to advance. If null,
  * <param>amnt</param> is <code>1</code>.
  * @return Boolean: True if the pointer was able to move forward <param>amnt</param> nodes.
  */
function selectNext ( amnt = null ) {
  return this.__LZdoSelect('getNextSibling', amnt);
}

/**
  * Selects the previous sibling node in the dataset if possible.
  * @param Number amnt: If given, the number of nodes to move back. If
  * <code>null</code>, <param>amnt</param> is 1.
  * @return Boolean: True if the pointer was able to move back
  * <param>amnt</param> nodes.
  */
function selectPrev ( amnt ){
  return this.__LZdoSelect('getPreviousSibling', amnt);
}
 
/**
  * Moves down the data hierarchy to  the next child node in the dataset if 
  * possible.
  * @param Number amnt: If given, the number of nodes to go down. If
  * <code>null</code>, <param>amnt</param> is <code>1</code>.
  * @return Boolean: True if the pointer was able to move down <param>amnt</param> nodes.
  */
function selectChild ( amnt ) {
  return this.__LZdoSelect('getFirstChild', amnt);
}

/**
  * Moves up the data hierarchy to the next parent node in the dataset if
  * possible.  
  * @param Number amnt: If given, the number of nodes to go up. If
  * <code>null</code>, <param>amnt</param> is <code>1</code>.  
  * @return Boolean: A Boolean indicating if the pointer was able to move up
  * <param>amnt</param> nodes.
  */
function selectParent ( amnt = null ){
  return this.__LZdoSelect('getParent', amnt);
}

/** @access private */
function selectNextParent ( ){
    var op = this.p;
    if ( this.selectParent() && this.selectNext() ){
        return true;
    } else {
        this.setPointer( op );
        return false;
    }
}

/**
  * Returns the number of the node that the datapointer is pointing to.
  * Note that XPath indices are 1-based.
  * @return Number: The offset of the node
  * @deprecated Use <code>position()</code> xpath instead
  */
// [2008-02-08 pbr] Renamed to avoid conflict with LzReplicationManager
function _getNodeOffset (){ 
    if ( $debug ) {
      Debug.info("%w.%s is deprecated.  Use XPath `position()` operator instead.",
                 this, arguments.callee);
    }
    this.p.parentNode.__LZupdateCO();
    return this.p.__LZo + 1;
}

/**
  * Gets the name of the node that the datapointer is pointing to.
  * @return String: The name of the datapointer's node
  */
function getNodeName (){ 
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }
    return this.p.nodeName;
}

/**
  * Sets the name of the current element to the <param>name</param>.
  * @param String name: The new name for the datapointer's node
  */
function setNodeName (name){
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }
    if (this.p.nodeType != LzDataNode.TEXT_NODE) {
    this.p.setNodeName( name );
}
}

/**
  * Returns the attributes of the node pointed to by the datapointer in an
  * Object whose keys are the attribute names and whose values are the attribute
  * values
  * @return Object: An Object which represents the keys and values of the node
  * attributes
  */
function getNodeAttributes (){ 
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }
    return this.p.attributes;
}

/**
  * Returns the value of the current node's <param>name</param> attribute.
  * @param String name: The attribute to retrieve.
  * @return String: The value of the attribute.
  */
function getNodeAttribute (name){ 
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }
    if (this.p.nodeType != LzDataNode.TEXT_NODE) {
    return this.p.attributes[ name ];
}
}

/**
  * Set the <param>name</param> attribute of the current node to the
  * <param>val</param>.
  * @param String name: The name of the attribute to set
  * @param String val: The value for the attribute
  */
function setNodeAttribute (name, val) {    
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }
    if (this.p.nodeType != LzDataNode.TEXT_NODE) {
    this.p.setAttr( name, val );
}
}

/**
  * Removes the <param>name</param> attribute from the current node.
  * @param String name: The name of the attribute to delete.
  */
function deleteNodeAttribute (name) {
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }
    if (this.p.nodeType != LzDataNode.TEXT_NODE) {
    this.p.removeAttr( name );
}
}

/**
  * Returns a string that represents a concatenation of the text nodes
  * beneath the current element. <method>getNodeText</method> and
  * <method>getOtherNodeText</method> are the only way to access
  * non-element data nodes.
  * @return String: The text in the node pointed to by the datapointer.
  */
function getNodeText (){ 
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }
    if (this.p.nodeType != LzDataNode.TEXT_NODE) {
    return this.p.__LZgetText();
}
}

/**
  * Returns a string that represents a concatenation of the text nodes
  * beneath the node <param>n</param>.  This is currently the only way
  * to access non-element data nodes.
  * @deprecated Use <code>LzDatapointer.getNodeText()</code> instead.
  * @param LzDataNode n: the node to find the text of
  * @return String: The text of the node 
  */

function getOtherNodeText (n){ 
    if ( $debug ) {
      Debug.deprecated(this, arguments.callee, this.getNodeText);
    }
    var s = "";
    if (n.c != null) {
        var nc = n.c.length;
        // append content of children which are text nodes
        for (var i = 0; i < nc; i++) {
            var node = n.c[i];
            if (node.t != undefined) {
                s += node.t;
            }
        }
    }
    return s;
}

/**
  * Sets the current node's text to <param>value</param>.
  * When this node is serialized, the text will be
  * represented as the first child node of this node. If the node
  * already has one or more text children, the value of the first text
  * node is set to the <param>val</param>.
  * 
  * @param String val: The new string for the node's text
  */
function setNodeText (val) {
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }

    if (this.p.nodeType != LzDataNode.TEXT_NODE) {
    // set the first text node you find; otherwise add one
    var foundit = false;
    for (var i = 0; i < this.p.childNodes.length; i++) {
        if ( this.p.childNodes[i].nodeType == LzDataNode.TEXT_NODE ) {
            this.p.childNodes[i].setData( val );
            foundit = true;
            break;
        }
    }
    if ( !foundit ){
        //there wasn't a text node previously
        this.p.appendChild( new LzDataText( val ) );
    }
}
}

/**
  * Counts the number of element nodes that are children of the node that the
  * datapointer is pointing to.
  * @return Integer: The number of child nodes for the current node
  */
function getNodeCount (){ 
    if (! this.p || this.p.nodeType == LzDataNode.TEXT_NODE) return 0;
    return this.p.childNodes.length || 0;
}


//****Adding and removing
/**
  * Adds a new child node below the current context
  * @param String name: The name of the new node.
  * @param String text: The text of the new node.
  * @param Dictionary attrs: An object containing the name : value pairs of
  * attributes for this node.
  * @return LzDataElement: the new node
  */
function addNode ( name, text , attrs ){
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }

    var nn = new LzDataElement( name , attrs );
    if ( text != null ){
        nn.appendChild( new LzDataText( text ) );
    }

    if (this.p.nodeType != LzDataNode.TEXT_NODE) {
    this.p.appendChild( nn );
    }
    
    return nn;
}

/**
  * Removes the node pointed to by the datapointer. If
  * <attribute>rerunxpath</attribute> is true and <attribute>xpath</attribute>
  * has been set, it will be re-evaluated. Otherwise, if the deleted node
  * has a following sibling, the pointer is repositioned at that sibling.
  * Otherwise the pointer is set to <code>null</code>.
  */
override function deleteNode ( recursiveCall = null){
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }

    var op = this.p
    if ( !this.rerunxpath ){
        //move the pointer to the next sibling
        if (!this.selectNext() ) {
            this.__LZHandleNoNodes();
        }
    }

    op.parentNode.removeChild( op );
    return op;
    //if we want to remember the deleted node, could push it onto this.p.$p.dc
    //move the pointer if you don't want to rerun xpath 

}

/** @access private */
function sendDataChange ( chgpkg ){
    //chgpkg.a(ction): d: delete, m:modify , a:add , null - refreshall
    //chgpkg.p(ointer))
    this.getDataset().sendDataChange( chgpkg );
}

// These are the strings used for nodes when serializing...
// [2006-07-25 pbr] These don't appear to be used anywhere
/** @access private */
var _openNode = "<";
/** @access private */
var _closeNode = ">";
/** @access private */
var _closeChar = "/";

/**
  * Determines whether this pointer is pointing to the same node as <param>ptr</param>.
  * @param LzDatapointer ptr: The datapointer to compare to this one.
  * @return Boolean: True if the datapointers are pointing to the same node.
  */
function comparePointer (  ptr ){
    return this.p == ptr.p;
}

/**
  * Duplicates the node that <param>dp</param> is pointing to, and appends it
  * it to the node pointed to by this datapointer, making the added node the last on the list.
  * @param LzDatapointer dp: A pointer to the node to add
  * @return LzDatapointer: A pointer to the new node
  */
function addNodeFromPointer ( dp ){
    if ( ! dp.p ) return;
    if ( ! this.p ) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }

    var n = dp.p.cloneNode( true );
    
    if (this.p.nodeType != LzDataNode.TEXT_NODE) {
    this.p.appendChild( n );
    }
    
    return new LzDatapointer( null , { pointer : n } );
}

/**
  * Sets this datapointer to the location of the given datapointer
  * @param LzDataPointer dp: The datapointer which has the desired location for
  * this datapointer.
  */
function setFromPointer ( dp ){
    this.setPointer( dp.p );
}


/** @access private */
function __LZprocessOperator ( p , pp , depends = null ){
    if (p == null) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }

    if ( pp.operatorArgs != null ){
        return p[ pp.operator ] ( pp.operatorArgs );
    }

    // LzParsedPath.initialize() created pp.operator. If 'attributes',
    // don't use split(".") to separate the string because '.' is
    // a valid XML character.
    var parts;
    if (pp.operator.indexOf("attributes.") == 0) {
        parts = ['attributes', pp.operator.substr(11)]
    }
    else {
        parts = pp.operator.split(".");
    }

    var val = p;
    // TODO: [2008-3-12 pbr] Verify this works in swf9 for all cases
    //  I found that val can be an LzDataElement or a hash (from LzDataElement)
    for (var i = 0; i < parts.length; i++) {
        var pathElt = parts[i];
//        if (val == null || !(pathElt in val)) {
        if (val == null || (!(val is LzDataElement) && !(pathElt in val))) {
            // TODO: [2007-3-16 hqm] I'll do what Ben did, return undefined
            return;
        } else {
            val = val[pathElt];
        }
    }
    return val;
}

////////////////////////////////////////////////////////////////

/** @access private */
function makeRootNode (){
    // create the root node

    return new LzDataElement( "root" );
}

/** @access private */
function finishRootNode (n){
    // create the root node
    return n.childNodes[ 0 ];
}

/** @access private */
function makeElementNode (attrs, name, par) {
    //Debug.write( 'make ' + name );
    var tn = new LzDataElement( name , attrs  );
    par.appendChild( tn );
    return tn;
}

/** @access private */
function makeTextNode (text, par){
    var tn = new LzDataText( text );
    par.appendChild( tn );
    return tn;
}

if ($as2) {
// FIXME: [2006-03-22 ptw] (LPP-1867) 
// These are short aliases for routines used by the old data compiler.
// They may still be used by the persistent connection service.
// I will remove these after I get persistent connection and RPC services
// working again -- hqm.
_root._finishndi  = prototype.finishRootNode;
_root._rootndi    = prototype.makeRootNode;
_root._m = prototype.makeElementNode;
_root._t = prototype.makeTextNode;
}

////////////////////////////////////////////////////////////////

/**
  * Serialize the current element and its children to an XML string. Note that
  * even if this datapointer's XPath ends in a terminal selector (such
  * as <code>@attribute</code> or <code>text()</code>) this method will
  * return the serialized text of the element that the datapointer
  * points to.
  * 
  * @return String: A string of XML that represents all of the datapointer's
  * contents.
  */
function serialize ( ){ 
    if ( this.p == null) {
        if ( $debug ) {
            Debug.info("%s: p is null in %s", arguments.callee, this);
        }
        return;
    }
    return this.p.serialize();
}


if ($debug) {
/** @access private */
function _dbg_name () {
        return this.p._dbg_name();
    };
}


/** @access private */
function setDataContext ( dc, implicit = null ){
    if ( dc == null ){
        this.context = this;
        if (this.p) {
            this.__LZsetTracking( this.p.ownerDocument );
        }
    } else if ( this.context != dc ){
        this.context = dc;

        // Unregister from old context
        if ( this.errorDel != null ){
            this.errorDel.unregisterAll();
            this.timeoutDel.unregisterAll();
        }
        
        this.__LZsetTracking( dc );
        //bwcompat olddata
        if ( canvas.__LZoldOnData && ! this.__LZspecialOndata ){
            if ( this.__LZoldDataDel ){
                this.__LZoldDataDel.unregisterAll();
            } else {
                this.__LZoldDataDel= new LzDelegate( this , 
                                                    "__LZHandleDocChange" );
            }

            this.__LZoldDataDel.register( this.context , 'onDocumentChange');
        }

        // When you have an xpath, register on the new context
        var hasxpath = this.xpath
        if (hasxpath) {
            if ( this.errorDel == null ){
                this.errorDel = new LzDelegate( this , "gotError" );
                this.timeoutDel = new LzDelegate( this , "gotTimeout" );
            }
            this.errorDel.register( dc , "onerror" );
            this.timeoutDel.register( dc , "ontimeout" );
        }

    }
}

/** @access private */
function __LZcheckChange ( chgpkg ){
    if ( !this.rerunxpath ){
        //if no pointer or who changed was the context I point to
        if ( !this.p || chgpkg.who == this.context ){
            this.runXPath();
        } else if ( this.__LZneedsOpUpdate( chgpkg ) ){ 
            //only update my data if my node changed and I have an operator
            this.__LZsimpleOperatorUpdate();
        }
    } else {
        //type 2 change means datapointer I depend on moved
        if (  chgpkg.type == 2  ||
            ( (chgpkg.type == 0          || 
               ( chgpkg.type == 1  && this.parsedPath && 
                 this.parsedPath.hasOpSelector ) ) 
             && 
             ( this.parsedPath && this.parsedPath.hasDotDot  ||
                this.p == null            || 
                this.p.childOfNode(chgpkg.who)   ) )
            ){
            this.runXPath();
            return true;
        } else if ( this.__LZneedsOpUpdate( chgpkg ) ){ 
            this.__LZsimpleOperatorUpdate();
        }
        return false;
    }
}

/** @access private */
function __LZneedsOpUpdate ( chgpkg = null ){

    //case 1 -- normal operator and node changed
    //case 2 -- this node is mapped to text()
    //  case 2.1 -- a text node changed
    //  case 2.2 -- a text node was added or removed

    return  ( this.parsedPath && this.parsedPath.operator != null )&& 
            ( this.parsedPath.operator == "__LZgetText" ?
                  (  ( chgpkg.type == 0 && 
                       chgpkg.who ==  this.p
                     ) || 
                    ( chgpkg.who.parentNode ==  this.p &&
                      chgpkg.who.nodeType == LzDataNode.TEXT_NODE 
                    )                               
                  )
              :
                  ( chgpkg.type == 1    &&
                    chgpkg.who == this.p 
                  ) 
            )
                
}

/** @access private */
function __LZHandleDocChange ( chgpkg ){
    var who = chgpkg.who;
    if ( !this.p ) return false;
    var meorbelowme = false;
    var track = who;
    var i = 0;
    var sn = this.p;
    do { 
        if ( track == sn ){
            meorbelowme = true;
            break;
        }
        track = track.parentNode;
    } while( track && track != who.ownerDocument );

    if ( meorbelowme && this.ondata.ready) this.ondata.sendEvent( this.data );
    return meorbelowme;
}

/** @access private */
function __LZcheckDotDot ( chgpkg ){
    //the case where I need a special update is the one where the 
    //change is above me, but my parent quelled it

    //second clause checks that the change is above my context --
    //if it's below my context, then my context will pas it on

    var who = chgpkg.who;
    if (   ( chgpkg.type == 0          || 
           ( chgpkg.type == 1  && this.parsedPath.hasOpSelector ) ) 
          && 
           ( this.context.getContext().childOfNode( who ) )
        ){
        this.runXPath();

    }
}

/** @access private */
override function destroy ( recur = null ){
    this.__LZsetTracking( null );
    if ( this.errorDel ) this.errorDel.unregisterAll();
    if ( this.timeoutDel ) this.timeoutDel.unregisterAll();
    if ( this.__LZoldDataDel ) {
        this.__LZoldDataDel.unregisterAll();
    }
    if ( this.__LZdotdotCheckDel ) {
        this.__LZdotdotCheckDel.unregisterAll();
    }
if ($swf9) {
    this.p = null;
    this.data = null;
    this.__LZlastdotdot = null;
    this.context = null;
    this.__LZtracking = null;
} else {
    delete this.p;
    delete this.data;
    delete this.__LZlastdotdot;
    delete this.context;
    delete this.__LZtracking;
}

    super.destroy.apply(this, arguments);
}

/**
  * This method registers the datapointer delegate to listen for
  * onDocumentChange events that are sent by the top of the DOM of which the
  * datapointer's node is a member.
  * 
  * @param who: the node to track
  * @param Boolean force: (default false) whether to track even if there
  * is not an xpath
  * 
  * @access private
  */
function __LZsetTracking ( who, force = null, needscheck = null ){
#pragma 'warnUndefinedReferences=true'
    var tracking = this.__LZtracking;
    var trackDel = this.__LZtrackDel;
    if ( who ) {
        // This appears to be an assumption of the previous
        // implementation.  Check that it is true.
        if ($debug) {
            if (tracking instanceof Array && tracking.length > 1) {
                Debug.error('%w.__LZtracking is %w, expecting an array of length 1', this, this.__LZtracking);
            }
        }
        // Are we already tracking this?
        if ( tracking instanceof Array && 
             tracking.length == 1 &&
             tracking[0] === who ) {
            return;
        }
        if ( trackDel ){
            // We are only tracking a single, so unregister any previous
            trackDel.unregisterAll();
        }
        var hasxpath = force || this.xpath;

        // Only track if there is an xpath
        if ( hasxpath ) {
            // Ensure you have a delegate 
            if (! trackDel) {
                this.__LZtrackDel = trackDel = new LzDelegate(this , "__LZcheckChange");
            }
            // Note that you are tracking;
            this.__LZtracking = tracking = [ who ];
            trackDel.register( who , "onDocumentChange" );
        }
    } else {
        this.__LZtracking = [];
        if ( trackDel ){
            this.__LZtrackDel.unregisterAll();
        }
    }
}

} // End of LzDatapointer

ConstructorMap[LzDatapointer.tagname] = LzDatapointer;
