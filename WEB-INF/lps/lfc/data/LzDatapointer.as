/******************************************************************************
 * LzDatapointer.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2005 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzDatapointer
// A datapointers is a pointer to a specific node in a dataset. 
// Datapointers provide methods for moving the pointer around, reading,
// changing, and serializing data.
//
// New datapointers that don't have an <field>xpath</field> point to the root 
// of their datacontext. Once a datapointer is moved to a node, it stays
// there.
//=============================================================================
var LzDatapointer = Class( "LzDatapointer" , LzNode );

LzDatapointer.prototype.setters.xpath = "setXPath";
LzDatapointer.prototype.setters.context = "setDataContext";

//---
//@keywords private
//---
LzDatapointer.prototype.setters.pointer = "setPointer";
LzDatapointer.prototype.setters.p = "setPointer";

//@field LzDataNode p: The LzDataNode that the datapointer is pointing
//to. Calling <method>setAttribute</method> on attribute calls
//<method>LzDatapointer.setPointer</method>.
LzDatapointer.prototype.p = null;
LzDatapointer.prototype.data = null;

// initial values
LzDatapointer.prototype.__LZtracking = null;
LzDatapointer.prototype.__LZtrackDel = null;

LzDatapointer.prototype.defaultattrs.ignoreplacement = true;

//@field Boolean rerunxpath: If true, re-evaluate the XPath expression
//when the dataset is edited.  Defaults to false.
LzDatapointer.prototype.rerunxpath = false;
LzDatapointer.prototype.setters.rerunxpath = "__LZsetRerunXPath";


//to set datapointer to datasource:dataset
//<datapointer xpath="foo:bar/">
//or just dataset
//<datapointer xpath="bar/">

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.childOrSelf = function ( p ){
    var cp = this.p;
    do {
        if ( cp == p ) return true;
        cp = cp.$p;
    } while( cp && cp.$n <= this.p.$n );
}

//-----------------------------------------------------------------------------
// Called when the datapointer receives an <event>onerror</event> event from
// the dataset it's pointing to.
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.gotError = function ( msg ){
    //@event onerror: Sent when the dataset that the datapointer 
    //is pointing to generates an error.
    this.onerror.sendEvent( msg );
}

//-----------------------------------------------------------------------------
// Called when the datapointer's dataset's request times out...
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.gotTimeout = function ( msg ){
    //@event ontimeout: Sent when a request by the dataset that 
    //the datapointer is pointing to times out.
    this.ontimeout.sendEvent( msg );
}

//-----------------------------------------------------------------------------
// Returns the result of an XPath query without changing the pointer. 
// The result can be:
// <ul>
// <li>a string -- the result of an operator such as name or attribute</li>
// <li>a single datapointer -- if the query resolves to a single node
// <li>an array of datapointers -- if the query resolves to multiple nodes</li>
// </ul>
// @param Object p: the XPath
// @deprecated Use <code>LzDatapointer.xpathQuery()</code> or a
// <code>$path{}</code> instead.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getXPath = function ( p ){ 
    if ( $debug ){
        if ( !this.didGetXPathWarn ){
            _root.Debug.write( "LzDatapointer.getXPath is deprecated." +
                "Use LzDatapointer.xpathQuery() or a $path{} instead." );
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
            nr[i] = new _root.LzDatapointer( null, { p : r[ i ] } );
        }
    } else if ( r.nodeType ){
        nr = new _root.LzDatapointer( null, { p : r } );
    } else {
        nr = r;
    }

    return nr;

}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getXPath.dependencies = function ( who , self , p ){
    var pp  = this.parsePath( p );
    return [ pp.hasDotDot ? self.context.getContext().ownerDocument : self , 
             "DocumentChange" ];
}

//-----------------------------------------------------------------------------
// Returns the result of an XPath query without changing the pointer. 
// @param Object p: the xpath
// @return any: <dl class="compact">
// <dt><code>null</code></dt><dd>if the
//  query is invalid or matches nothing</dd>
// <dt>a <code>String</code></dt><dd>the result of an operator such as <code>name</code> or <code>attribute</code></dd>
// <dt>an <classname>LzDataElement</classname></dt><dd>if the query resolves to a single node</dd>
// <dt>an array of <classname>LzDataElement</classname></dt><dd>if the query resolves to multiple nodes</dd>
// </dl>
//-----------------------------------------------------------------------------
LzDatapointer.prototype.xpathQuery = function ( p ){ 
    var pp = this.parsePath ( p );
    var nodes = this.__LZgetNodes( pp , pp.context ? pp.context : this.p);
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

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.xpathQuery.dependencies = function ( who , self , p ){
    var pp  = this.parsePath( p );
    return [ pp.hasDotDot ? self.context.getContext().ownerDocument : self , 
             "DocumentChange" ];
}

//-----------------------------------------------------------------------------
// Points this datapointer at p.
// @param LzDataNode p: The new target for this datapointer.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.setPointer = function ( p ) {

    if ( !_root.canvas.__LZoldOnData ){
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
}

//-----------------------------------------------------------------------------
// Returns a reference to the datapointer's dataset.
// @return LzDataset: The datapointer's dataset
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getDataset = function ( ){ 
    if ( this.p == null ) { 
        if ( this.context == this ) return null;
        return this.context.getDataset();
    }
    return this.p.ownerDocument;
}

//-----------------------------------------------------------------------------
// Sets the <attribute>xpath</attribute> attribute to
// <param>param</param>, and sets the current node to the node that it
// refers to.
//
// If the XPath contains a terminal selector such as
// <code>text()</code>, the datapointer's <attribute>data</attribute>
// property is set to that value. It is error to set a datapointer to
// an XPath that matches multiple nodes.
// @param String p: An XPath.
// @return Boolean|Undefined: <code>true</code> if the path matches a
// single node, <code>false</code> if no or multiple nodes are
// matched, <code>undefined</code> if the path is invalid.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.setXPath = function ( p ){ 
if ($swf6) {
    var hasxpath = (p != null) && (String(p).length > 0);
} else {
    var hasxpath = p;
}
    if (! hasxpath) {
        this.xpath = null;
        this.parsedPath = null;
        // track if there's an ownerDocument
        this.__LZsetTracking( this.p.ownerDocument );
        return;
    }

    this.xpath = p;
    this.parsedPath = this.parsePath( p );
    
    if ( this.rerunxpath && 
         this.parsedPath.hasDotDot && 
         !this.parsedPath.context  ){
        //ruh roh
        this.__LZspecialDotDot = true;
    } else {
        if ( this.__LZdotdotCheckDel ){
            this.__LZdotdotCheckDel.unregisterAll();
        }
    }

    if ( _root.canvas.__LZoldOnData ){
        if ( this.parsedPath.context && ! this.parsedPath.selectors.length &&
            !this.rerunxpath ){
            this.__LZspecialOndata = true;
        } else if ( this.__LZspecialOndata ){
            delete this.__LZspecialOndata;
        }
    }

    this.setDataContext( this.parsedPath.context );

    return  this.runXPath(  );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.runXPath = function ( ){ 
    if ( !this.parsedPath ) {
        return;
    }

    var newc = this.context.getContext();

    if ( newc ) {
        var n = this.__LZgetNodes( this.parsedPath , newc , 0 );
    } else {
        var n = null;
    }

    if ( !n ){
        //no node found
        this.__LZHandleNoNodes();
        return false;
    }else if ( n.length ) {
        this.__LZHandleMultiNodes( n );
        return false;
    } else {
        this.__LZHandleSingleNode( n );
        return true;
    }

}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZsetupDotDot = function ( p ){
    if ( this.__LZlastdotdot != p.ownerDocument ){
        //this requires special processing, since it doesn't only depend
        //on its context
        if ( !this.__LZdotdotCheckDel ){
            this.__LZdotdotCheckDel = new _root.LzDelegate( this , 
                                                        "__LZcheckDotDot" );
        } else {
            this.__LZdotdotCheckDel.unregisterAll();
        }

        this.__LZlastdotdot = p.ownerDocument; 
        this.__LZdotdotCheckDel.register( this.__LZlastdotdot , 
                                            "onDocumentChange" );
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZHandleSingleNode = function ( n ){ 
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
                _root.Debug.write( "Datapointer pointing to " + 
                    this.context + "," +
                    ' relies on the ondata event from' +
                    " a datapointer bound to the root node of a dataset."+
                    " \n    This behavior is deprecated." +
                    " Point the dataponter the first child " +
                    " of the dataset, or use the dataset's ondata event.");
                this.__LZoldOndataWarn = true;
            }

            this.p = this.context;
            this.ondata.sendEvent( this.p );
        }
        return;
    }

    this.__LZsendUpdate();
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZHandleNoNodes = function ( ){ 

    var pc = this.p != null;
    var dc = this.data != null;
    this.p = null;
    this.data = null
    this.__LZsendUpdate( dc , pc );
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZHandleMultiNodes = function ( n ){ 
    if ($debug) {
        Debug.error("%w matched %d nodes", this, n.length);
    }
    this.__LZHandleNoNodes();
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZsetData = function ( ){ 
    if ( this.parsedPath.aggOperator != null ){
        if ( this.parsedPath.aggOperator == 'last' ){
            this.data = this.__LZgetLast();
            this.__LZsendUpdate( true );
        } if ( this.parsedPath.aggOperator == 'position' ){
            this.data = this.__LZgetPosition();
            this.__LZsendUpdate( true );
        }
    } else if ( this.parsedPath.operator != null ){
        this.__LZsimpleOperatorUpdate ();
    } else {
        if ( this.data != this.p ){
            this.data = this.p;
            this.__LZsendUpdate( true );
        }
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZgetLast = function ( ){ 
    if ( this.context == this ) return 1;
    return this.context.__LZgetLast() || 1;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZgetPosition = function ( ){ 
    if ( this.context == this ) return 1;
    return this.context.__LZgetPosition() || 1;
}

LzDatapointer.prototype.__LZupdateLocked = false;
LzDatapointer.prototype.__LZpchanged = false;
LzDatapointer.prototype.__LZdchanged = false;
//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZsendUpdate = function ( upd , upp ){ 

    this.__LZdchanged = upd || this.__LZdchanged;
    this.__LZpchanged = upp || this.__LZpchanged;

    if ( this.__LZupdateLocked ){
        return false;
    }


    //@event ondata: Sent when the data selected by this datapointer's <attribute>xpath</attribute>
    //changes. For XPaths which select a datanode, this means that the
    //datapointer is pointing to a new node. For XPaths which select text data,
    //this means that the datapointer is pointing to a new node, or that the
    //text selected by the <attribute>xpath</attribute> has changed. Note that a datapointer mapped to
    //a data node will not receive <event>ondata</event> when the node, say, changes one of
    //its attributes.
    if ( this.__LZdchanged) {
        this.ondata.sendEvent( this.data );
        this.__LZdchanged = false;
    }

    if ( this.__LZpchanged) {
        this.onp.sendEvent( this.p );
        this.__LZpchanged = false;
        this.onDocumentChange.sendEvent( { who: this.p , 
                                           type: 2 , 
                                           what: 'context'});
    }
    return true;
}

//-----------------------------------------------------------------------------
// Tests whether or not this datapointer is pointing to a valid node.
// @return Boolean: True if the current node is valid.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.isValid = function ( ){ 
    return this.p != null;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZsimpleOperatorUpdate = function ( ){ 
    var ndat = this.__LZprocessOperator( this.p , this.parsedPath );
    //second clause is necessary to process updates for @*
    var dchanged = false;
    if ( this.data != ndat || this.parsedPath.operator == "attributes" ){
        this.data = ndat;
        dchanged = true;
    }
    this.__LZsendUpdate( dchanged );
}

LzDatapointer.prototype.ppcache = {};

//-----------------------------------------------------------------------------
// Parses a fully qualified XPath and yields an object with the components
// listed below. These are cached.
// Canonical xpath: ../nodea/nodeb[2]/@foo
// Canonical xpath: nodea/nodeb[2]/@*
// Canonical xpath: ./nodea/nodeb[2-]/text()
// Canonical xpath: /nodea/nodeb[8]/*
// Canonical xpath: dset:/nodea/nodeb[-8]
// Canonical xpath: dsrc:dset:/nodea/nodeb[2-8]
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.parsePath = function ( pa ){
    var q = this.ppcache[ pa ];
    if ( q ) {
        var l = q['islocaldata'] 
        if (l) {
            q.context = this.getLocalDataContext(l);
        } 
    } else {
        var q = new _root.LzParsedPath( pa, this);
        this.ppcache[ pa ] = q;
    }
    return q;
}

//-----------------------------------------------------------------------------
// Locates a local data context based on the parsed path
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getLocalDataContext = function(pp) {
    var n = this.parent;
    if (pp) {
        var a = pp;
        for (var i = 0; i < a.length; i++) {
            //_root.Debug.write(n + '.' + a[i] + '=' + n[a[i]]);
            n = n[a[i]];
        }
        if (n instanceof _root.LzDataset == false && n['localdata'] instanceof _root.LzDataset == true) {
            n = n['localdata']
        }
    }

    if (n != null && n instanceof _root.LzDataset) {
        //_root.Debug.write('found local dataset', n);
        return n;
    } else {
        _root.Debug.write('WARNING: local dataset "' + pp + '" not found in ', this.parent);
        /* Could register for node creation if datapath is created before dataset
        */
    }
}

//Table of xpath node operator symbols and the functions they call
LzDatapointer.prototype.pathSymbols= { };
LzDatapointer.prototype.pathSymbols[ "/" ] = 1;
LzDatapointer.prototype.pathSymbols[ ".." ] = 2;
LzDatapointer.prototype.pathSymbols[ "*" ] = 3;
LzDatapointer.prototype.pathSymbols[ "." ] = 4;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZgetNodes = function ( pathobj , p , startpoint ){
                                                  
    var np;

    if ( p == null ){ 
        return false;
    }

    if (pathobj.selectors != null) {

        var pathlen = pathobj.selectors.length;
        var ignorenext = 0;

        for ( var i = startpoint ? startpoint : 0 ; i < pathlen; i++ ){

            var cp = pathobj.selectors[ i ];
            var specialop = this.pathSymbols [ cp ]; 
            if ( pathobj.selectors[ i+1 ].pred == "range" ){
                //next is range operator
                //we'll handle that in this pass, so increment counter again
                var range = pathobj.selectors[ ++i ];
            } else {
                var range = null;
            }


            np = null;

            if ( null != cp.pred ){
                if ( cp.pred == "hasattr" ){
                    p = p.hasAttr( cp.attr ) ? p : false;
                }else if ( cp.pred == "attrval" ){
                    p = p.attributes[  cp.attr ] == cp.val ? p : false;
                }
                continue
                    } else if ( !specialop ){
                        //named node
                        np = this.nodeByName( cp , range , p );
                    }else if ( specialop == 1 ){
                        //root
                        p = p.ownerDocument;
                    } else if ( specialop == 2 ){
                        //parent
                        p = p.parentNode;
                    } else if ( specialop == 3 ) {
                        //all children
                        np = [];
                        var cnt = 0;

                        for ( var j = 0; j < p.childNodes.length;j++ ){
                            //remove nulls and text nodes
                            if ( p.childNodes[ j ].nodeType==_root.LzDataNode.ELEMENT_NODE){
                                cnt++;
                                if ( !range || cnt >= range[ 0 ] ){
                                    np.push( p.childNodes[ j ] );
                                } 
                                if ( range && cnt == range[ 1 ] ){
                                    break;
                                }
                            }
                        }

                    } /*else if ( specialop == 4 ) {
                      // . (ignore)
                      }*/

            if ( np != null ){
                if ( np.length > 1 ){
                    var rval = []

                        if ( i == pathlen - 1 ){
                            return np;
                        } //else

                    for ( var j = 0; j < np.length; j++ ){
                        var r = this.__LZgetNodes( pathobj , np[ j ], i+1 );
                                               
                        if ( r.length > 0 ){
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


            if ( p == null ){
                return false;
            }

        }
    }

    return p;
    
}

//-----------------------------------------------------------------------------
// This is the shared interface between dataset and datapointer that allows
// one datapointer to function as the datacontext for another
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getContext = function ( ){
    return this.p;
}

//-----------------------------------------------------------------------------
// Select node by name at the current level.  Returns
// <code>null</code>, an offset, or an array of offsets.
// @keywords private
// @param name: node name 
// @param range: range string
// @return: null or an offset
//-----------------------------------------------------------------------------
LzDatapointer.prototype.nodeByName = function ( name, range , p) {
    var o = []; 
    var cnt = 0;
    if ( !p ){ 
        var p = this.p;
    }

    for ( var i = 0; i < p.childNodes.length; i++ ){
        if ( p.childNodes[ i ].nodeName == name ){
            //match
            cnt++;
            if ( !range || cnt >= range[ 0 ] ){
                o.push( p.childNodes[ i ] );
            } 
            if ( range && cnt == range[ 1 ] ){
                break;
            }
        }
    }
    //_root.Debug.write( "node by name returning: " + o + " for " + name );
    return o;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZsetRerunXPath = function ( rrx ){
    this.rerunxpath = rrx;

    this.onrerunxpath.sendEvent( rrx );
}

//-----------------------------------------------------------------------------
//Return a new datapointer that points to the same node, has a
//<code>null</code> <attribute>xpath</attribute> and a
//<code>false</code> <attribute>rerunxpath</attribute> attribute.
// @return LzDataPointer: A new datapointer that points to the same spot as this
// one, but 
//-----------------------------------------------------------------------------
LzDatapointer.prototype.dupePointer = function (){
    var dp = new _root.LzDatapointer( );
    dp.setFromPointer( this );
    return dp;
}

//-----------------------------------------------------------------------------
// Selects the next sibling node in the dataset if possible.
// @param Number amnt: If given, the number of nodes to advance. If null,
// <param>amnt</param> is <code>1</code>.
// @return Boolean: True if the pointer was able to move forward <param>amnt</param> nodes.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.selectNext = function ( amnt ) {
    amnt = amnt ? amnt : 1;
    var np = this.p;
    while ( amnt-- ){
        np = np.getNextSibling();
    }

    if ( np == null ){
        return false;
    } else {
        this.setPointer( np );
        return true;
    }
        
}

//-----------------------------------------------------------------------------
// Selects the previous sibling node in the dataset if possible.
// @param Number amnt: If given, the number of nodes to move back. If
// <code>null</code>, <param>amnt</param> is 1.
// @return Boolean: True if the pointer was able to move back
// <param>amnt</param> nodes.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.selectPrev = function ( amnt ){
    amnt = amnt ? amnt : 1;
    var np = this.p;
    while ( amnt-- ){
        np = np.getPreviousSibling();
    }
    if ( np == null ){
        return false;
    } else {
        this.setPointer( np );
        return true;
    }
}
 
//-----------------------------------------------------------------------------
// Moves down the data hierarchy to  the next child node in the dataset if 
// possible.
// @param Number amnt: If given, the number of nodes to go down. If
// <code>null</code>, <param>amnt</param> is <code>1</code>.
// @return Boolean: True if the pointer was able to move down <param>amnt</param> nodes.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.selectChild = function ( amnt ){
    amnt = amnt ? amnt : 1;
    var np = this.p;
    while ( amnt-- ){
        np = np.getFirstChild();
    }

    if ( np == null ){
        return false;
    } else {
        this.setPointer( np );
        return true;
    }
}

//-----------------------------------------------------------------------------
// Moves up the data hierarchy to the next parent node in the dataset if
// possible.  
// @param Number amnt: If given, the number of nodes to go up. If
// <code>null</code>, <param>amnt</param> is <code>1</code>.  
// @return Boolean: A Boolean indicating if the pointer was able to move up
// <param>amnt</param> nodes.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.selectParent = function ( amnt ){
    amnt = amnt ? amnt : 1;
    var np = this.p;
    while ( amnt-- ){
        np = np.parentNode;
    }

    if ( np == null ){
        return false;
    } else {
        this.setPointer( np );
        return true;
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.selectNextParent = function ( ){
    var op = this.p;
    if ( this.selectParent() && this.selectNext() ){
        return true;
    } else {
        this.setPointer( op );
        return false;
    }
}

//-----------------------------------------------------------------------------
// Returns the number of the node that the datapointer is pointing to.
// Note that XPath indices are 1-based.
// @return Number: The offset of the node
// @deprecated Use <code>position()</code> xpath instead
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getNodeOffset = function (){ 
    if ( $debug ) {
        _root.Debug.write( 'LzDatapointer.getNodeOffset is deprecated. ' +
                           ' Use position() xpath instead' );
    }
    this.p.parentNode.__LZupdateCO();
    return this.p.__LZo + 1;
}

//-----------------------------------------------------------------------------
// Gets the name of the node that the datapointer is pointing to.
// @return String: The name of the datapointer's node
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getNodeName = function (){ 
    return this.p.nodeName;
}

//-----------------------------------------------------------------------------
// Sets the name of the current element to the <param>name</param>.
// @param String name: The new name for the datapointer's node
//-----------------------------------------------------------------------------
LzDatapointer.prototype.setNodeName = function (name){
    if ( ! this.p ) return;
    this.p.setNodeName( name );
}

//-----------------------------------------------------------------------------
// Returns the attributes of the node pointed to by the datapointer in an
// Object whose keys are the attribute names and whose values are the attribute
// values
// @return Object: An Object which represents the keys and values of the node
// attributes
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getNodeAttributes = function (){ 
    return this.p.attributes;
}

//-----------------------------------------------------------------------------
// Returns the value of the current node's <param>name</param> attribute.
// @param String name: The attribute to retrieve.
// @return String: The value of the attribute.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getNodeAttribute = function (name){ 
    return this.p.attributes[ name ];
}

//-----------------------------------------------------------------------------
// Set the <param>name</param> attribute of the current node to the
// <param>val</param>.
// @param String name: The name of the attribute to set
// @param String val: The value for the attribute
//-----------------------------------------------------------------------------
LzDatapointer.prototype.setNodeAttribute = function (name, val) {
    this.p.setAttr( name, val );
}

//-----------------------------------------------------------------------------
// Removes the <param>name</param> attribute from the current node.
// @param String name: The name of the attribute to delete.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.deleteNodeAttribute = function (name) {
    if ( ! this.p ) return;
    this.p.removeAttr( name );
}

//-----------------------------------------------------------------------------
// Returns a string that represents a concatenation of the text nodes
// beneath the current element. <method>getNodeText</method> and
// <method>getOtherNodeText</method> are the only way to access
// non-element data nodes.
// @return String: The text in the node pointed to by the datapointer.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getNodeText = function (){ 
    return this.p.__LZgetText();
}

//-----------------------------------------------------------------------------
// Returns a string that represents a concatenation of the text nodes
// beneath the node <param>n</param>.  This is currently the only way
// to access non-element data nodes.
// @deprecated Use <code>LzDatapointer.getNodeText()</code> instead.
// @param LzDataNode n: the node to find the text of
// @return String: The text of the node 
//-----------------------------------------------------------------------------

LzDatapointer.prototype.getOtherNodeText = function (n){ 
    if ( $debug ) {
        _root.Debug.write( 'LzDatapointer.getOtherNodeText() is deprecated. ' +
                           ' Use LzDatapointer.getNodeText() instead.' );
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

//-----------------------------------------------------------------------------
// Sets the current node's text to <param>value</param>.
//
// When this node is serialized, the text will be
// represented as the first child node of this node. If the node
// already has one or more text children, the value of the first text
// node is set to the <param>val</param>.
//
// @param String val: The new string for the node's text
//-----------------------------------------------------------------------------
LzDatapointer.prototype.setNodeText = function (val) {
    if ( ! this.p ) return;
    // set the first text node you find; otherwise add one
    var foundit = false;
    for (var i = 0; i < this.p.childNodes.length; i++) {
        if ( this.p.childNodes[i].nodeType == _root.LzDataNode.TEXT_NODE ) {
            this.p.childNodes[i].setData( val );
            foundit = true;
            break;
        }
    }
    if ( !foundit ){
        //there wasn't a text node previously
        this.p.appendChild( new _root.LzDataText( val ) );
    }
}

//-----------------------------------------------------------------------------
// Counts the number of element nodes that are children of the node that the
// datapointer is pointing to.
// @return Integer: The number of child nodes for the current node
//-----------------------------------------------------------------------------
LzDatapointer.prototype.getNodeCount = function (){ 
    return this.p.childNodes.length || 0;
}


//****Adding and removing
//-----------------------------------------------------------------------------
// Adds a new child node below the current context
// @param String name: The name of the new node.
// @param String text: The text of the new node.
// @param Dictionary attrs: An object containing the name : value pairs of
// attributes for this node.
// @return LzDataElement: the new node
//-----------------------------------------------------------------------------
LzDatapointer.prototype.addNode = function ( name, text , attrs ){
    var nn = new _root.LzDataElement( name , attrs );
    if ( text != null ){
        nn.appendChild( new _root.LzDataText( text ) );
    }

    this.p.appendChild( nn );
    return nn;
}

//-----------------------------------------------------------------------------
// Removes the node pointed to by the datapointer. If
// <attribute>rerunxpath</attribute> is true and <attribute>xpath</attribute>
// has been set, it will be re-evaluated. Otherwise, if the deleted node
// has a following sibling, the pointer is repositioned at that sibling.
// Otherwise the pointer is set to <code>null</code>.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.deleteNode = function ( ){
    if ( !this.p ) return;
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

    //@field Boolean rerunxpath: This determines the behavior of the
    //datapointer in response to notification that the dataset the
    ///datapointer is mapped to has changed. If
    //<attribute>rerunxpath</attribute> is true, the datapointer will
    //always rerun its remembered XPath (set with the
    //<attribute>xpath</attribute> property). If it is false, the
    //datapointer will only verify that the node it is pointing to is
    //still in the dataset. If it isn't, the datapointer will rerun
    //its remembered xpath (if it has one) or will print a debug
    //message if any further attempt is made to use its current node
    //as the basis for a relative XPath query.
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.sendDataChange = function ( chgpkg ){
    //chgpkg.a(ction): d: delete, m:modify , a:add , null - refreshall
    //chgpkg.p(ointer))
    this.getDataset().sendDataChange( chgpkg );
}

// These are the strings used for nodes when serializing...
LzDatapointer.prototype._openNode = "<";
LzDatapointer.prototype._closeNode = ">";
LzDatapointer.prototype._closeChar = "/";

//-----------------------------------------------------------------------------
// Determines whether this pointer is pointing to the same node as <param>ptr</param>.
// @param LzDatapointer ptr: The datapointer to compare to this one.
// @return Boolean: True if the datapointers are pointing to the same node.
//----------------------------------------------------------------------------
LzDatapointer.prototype.comparePointer = function (  ptr ){
    return this.p == ptr.p;
}

//-----------------------------------------------------------------------------
// Duplicates the node that <param>dp</param> is pointing to, and adds
// it to the node pointed to by this datapointer.
// @param LzDatapointer dp: A pointer to the node to add
// @return LzDatapointer: A pointer to the new node
//-----------------------------------------------------------------------------
LzDatapointer.prototype.addNodeFromPointer = function ( dp ){
    var n = dp.p.cloneNode( true );
    this.p.appendChild( n );
    return new _root.LzDatapointer( null , { pointer : n } );
}

//-----------------------------------------------------------------------------
// Sets this datapointer to the location of the given datapointer
// @param LzDataPointer dp: The datapointer which has the desired location for
// this datapointer.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.setFromPointer = function ( dp ){
    this.setPointer( dp.p );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDatapointer.prototype.__LZprocessOperator = function ( p , pp , depends ){

    if ( pp.operatorArgs != null ){
        return p[ pp.operator ] ( pp.operatorArgs );
    }

    return eval ( "p." + pp.operator );
}

////////////////////////////////////////////////////////////////

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDatapointer.prototype.makeRootNode = function (){
    // create the root node

    return new _root.LzDataElement( "root" );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDatapointer.prototype.finishRootNode = function (n){
    // create the root node
    return n.childNodes[ 0 ];
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDatapointer.prototype.makeElementNode = function (attrs, name, par) {
    //_root.Debug.write( 'make ' + name );
    var tn = new _root.LzDataElement( name , attrs  );
    par.appendChild( tn );
    return tn;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDatapointer.prototype.makeTextNode = function (text, par){
    var tn = new _root.LzDataText( text );
    par.appendChild( tn );
    return tn;
}

_root._finishndi  = LzDatapointer.prototype.finishRootNode;
_root._rootndi    = LzDatapointer.prototype.makeRootNode;
_root._m = LzDatapointer.prototype.makeElementNode;
_root._t = LzDatapointer.prototype.makeTextNode;


////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// Serialize the current element and its children to an XML string. Note that
// even if this datapointer's XPath ends in a terminal selector (such
// as <code>@attribute</code> or <code>text()</code>) this method will
// return the serialized text of the element that the datapointer
// points to.
//
// @return String: A string of XML that represents all of the datapointer's
// contents.
//-----------------------------------------------------------------------------
LzDatapointer.prototype.serialize = function ( ){ 
    return this.p.serialize();
}

if ($debug) {
//---
// @keywords private
//---
LzDatapointer.prototype._dbg_name = function () {
    return this.p._dbg_name();
};
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.setDataContext = function ( dc ){
    if ( dc == null ){
        this.context = this;
        this.__LZsetTracking( this.p.ownerDocument );
    } else if ( this.context != dc ){
        this.context = dc;

        // Unregister from old context
        if ( this.errorDel != null ){
            this.errorDel.unregisterAll();
            this.timeoutDel.unregisterAll();
        }
        
        this.__LZsetTracking( dc );
        //bwcompat olddata
        if ( _root.canvas.__LZoldOnData && ! this.__LZspecialOndata ){
            if ( this.__LZoldDataDel ){
                this.__LZoldDataDel.unregisterAll();
            } else {
                this.__LZoldDataDel= new _root.LzDelegate( this , 
                                                    "__LZHandleDocChange" );
            }

            this.__LZoldDataDel.register( this.context , 'onDocumentChange');
        }

        // When you have an xpath, register on the new context
if ($swf6) {
        var hasxpath = (this.xpath != null) && (String(this.xpath).length > 0);
} else {
        var hasxpath = this.xpath
}
        if (hasxpath) {
            if ( this.errorDel == null ){
                this.errorDel = new _root.LzDelegate( this , "gotError" );
                this.timeoutDel = new _root.LzDelegate( this , "gotTimeout" );
            }
            this.errorDel.register( dc , "onerror" );
            this.timeoutDel.register( dc , "ontimeout" );
        }

    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZcheckChange = function ( chgpkg ){
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
               ( chgpkg.type == 1  && this.parsedPath.hasOpSelector ) ) 
             && 
             ( this.parsedPath.hasDotDot  ||
                this.p == null            || 
                this.p.childOf(chgpkg.who)   ) )
            ){
            this.runXPath();
            return true;
        } else if ( this.__LZneedsOpUpdate( chgpkg ) ){ 
            this.__LZsimpleOperatorUpdate();
        }
        return false;
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDatapointer.prototype.__LZneedsOpUpdate = function ( chgpkg ){

    //case 1 -- normal operator and node changed
    //case 2 -- this node is mapped to text()
    //  case 2.1 -- a text node changed
    //  case 2.2 -- a text node was added or removed

    return  this.parsedPath.operator != null && 
            ( this.parsedPath.operator == "__LZgetText" ?
                  (  ( chgpkg.type == 0 && 
                       chgpkg.who ==  this.p
                     ) || 
                    ( chgpkg.who.parentNode ==  this.p &&
                      chgpkg.who.nodeType == _root.LzDataNode.TEXT_NODE 
                    )                               
                  )
              :
                  ( chgpkg.type == 1    &&
                    chgpkg.who == this.p 
                  ) 
            )
                
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZHandleDocChange = function ( chgpkg ){
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

    if ( meorbelowme ) this.ondata.sendEvent( this.data );
    return meorbelowme;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZcheckDotDot = function ( chgpkg ){
    //the case where I need a special update is the one where the 
    //change is above me, but my parent quelled it

    //second clause checks that the change is above my context --
    //if it's below my context, then my context will pas it on

    var who = chgpkg.who;
    if (   ( chgpkg.type == 0          || 
           ( chgpkg.type == 1  && this.parsedPath.hasOpSelector ) ) 
          && 
           ( this.context.getContext().childOf( who ) )
        ){
        this.runXPath();

    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.destroy = function ( recur ){
    this.__LZsetTracking( null );
    this.errorDel.unregisterAll();
    this.timeoutDel.unregisterAll();
    if ( this.__LZoldDataDel ) {
        this.__LZoldDataDel.unregisterAll();
    }
    if ( this.__LZdotdotCheckDel ) {
        this.__LZdotdotCheckDel.unregisterAll();
    }
    delete this.p;
    delete this.data;
    delete this.__LZlastdotdot;
    delete this.context;
    delete this.__LZtracking;

    super.destroy( );
}

//-----------------------------------------------------------------------------
// This method registers the datapointer delegate to listen for
// onDocumentChange events that are sent by the top of the DOM of which the
// datapointer's node is a member.
//
// @param who: the node to track
// @param Boolean force: (default false) whether to track even if there
// is not an xpath
//
// @keywords private
//-----------------------------------------------------------------------------
LzDatapointer.prototype.__LZsetTracking = function ( who, force ){
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
if ($swf6) {
        var hasxpath = force || (this.xpath != null) && (String(this.xpath).length > 0);
} else {
        var hasxpath = force || this.xpath
}
        // Only track if there is an xpath
        if ( hasxpath ) {
            // Ensure you have a delegate 
            if (! trackDel) {
                this.__LZtrackDel = trackDel = new _root.LzDelegate(this , "__LZcheckChange");
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

