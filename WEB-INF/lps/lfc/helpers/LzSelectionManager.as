/******************************************************************************
 * LzSelectionManager.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzSelectionManager
//
// @field Boolean toggle: If true, a re-selected element will lose
// the selection.
//=============================================================================
var LzSelectionManager = Class( "LzSelectionManager" , LzNode );

//------------------------------------------------------------------------------
// @param LzView view: A view above this one in the hierarchy that will determine
// the placement of the selection manager.
// @param Object args: A hash of initialization arguments
//
// String placement: A string specifying the placement of this selection manager.
//
// String selFuncName: The name of the method to call (with true or
// false to represent selectedness) when an element changes its selectedness
//
// @keywords private
//------------------------------------------------------------------------------
LzSelectionManager.prototype.construct= function ( view , args ) {
    super.construct( view , args );

    this.toggle = args.toggle == true;

    //@field sel: The name of the method to call on an object
    //when an object's selectedness changes.  The method is called with a single Boolean argument.  The default value for this 
    //field is <code>setSelected</code>.
    this.sel = args.selFuncName == null ? "setSelected" : args.selFuncName;
    
    this.selected = new Array;
    this.selectedHash = new Object;
    this.lastRange = null;
}


//-----------------------------------------------------------------------------
// Called with a new member to be selected.
// @param o: The new element that got selected.
//-----------------------------------------------------------------------------
LzSelectionManager.prototype.select = function ( o ){
    if (  this.isSelected( o ) && ( this.toggle ||
                                                this.isMultiSelect( o ) ) ) {
        this.unselect( o );
        return;
    }

    if (this.selected.length > 0 && this.isRangeSelect( o ) ){
        var s = this.lastRange != null ? this.lastRange : this.selected[ 0 ];
        if ( s != o ){
            this.selectRange( s , o );
        }
        return;
    }

    if ( ! this.isMultiSelect( o ) ){
        this.clearSelection();
    }
    this.makeSelected( o );
}

//-----------------------------------------------------------------------------
// Tests for selectedness of input.
// @param o: The object to test for selectedness.
// @return: The selectedness of the input object.
//-----------------------------------------------------------------------------
LzSelectionManager.prototype.isSelected = function ( o )  {
    return this.selectedHash[ o.getUID() ];
}

//-----------------------------------------------------------------------------
// Makes the given object selected.
// @keywords private
// @param s: The object to make selected
//-----------------------------------------------------------------------------
LzSelectionManager.prototype.makeSelected = function ( s )  {
    if ( this.selectedHash[ s.getUID() ] ) return;

    //@field selectedHash: A hash of currently selected objects (by UID)
    this.selectedHash[ s.getUID() ] = true;
    //@field selected: An array that represents the current selection
    this.selected.push( s );
    s[ this.sel ] ( true );
}


//-----------------------------------------------------------------------------
// Unselects the given object.
// @keywords protected
// @param o: The object to make unselected
//-----------------------------------------------------------------------------
LzSelectionManager.prototype.unselect = function ( o ){
    for ( var i= this.selected.length-1 ; i >= 0; i-- ){
        if ( this.selected[ i ] == o ) {
            this.selectedHash[ o.getUID() ] = false;
            o [ this.sel ] ( false );
            this.selected.splice( i , 1 );
            break;
        }
    }
}

//-----------------------------------------------------------------------------
// Unselects any selected objects.
//-----------------------------------------------------------------------------
LzSelectionManager.prototype.clearSelection = function (){
    var s;
    while ( s =  this.selected.pop()){
        s[ this.sel ] ( false );
    }
    this.selected = new Array;
    this.selectedHash = new Object;
    this.lastRange = null;
}

//-----------------------------------------------------------------------------
// Returns an array representing the current selection.
//
// @return Array: An array representing the current selection.
//-----------------------------------------------------------------------------
LzSelectionManager.prototype.getSelection = function (){
    return this.selected;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzSelectionManager.prototype.selectRange = function ( s , e ){
    var pview = s.immediateparent;

    var svs = pview.subviews;
    var st = null;
    var en = null;
    for ( var i = 0; i < svs.length; i++ ){
        if ( svs[ i ] == s ) st = i;
        if ( svs[ i ] == e ) en = i;
        if ( null != st && null != en ) break;
    }

    var dir = st > en ? -1 : 1;
    this.clearSelection();
    
    this.lastRange = s;
    for ( var i = st; i != en + dir; i += dir ) {
        this.makeSelected( pview.subviews[ i ] );
    }
    
}

//------------------------------------------------------------------------------
// Determines whether the an additional selection should be multi-selected or
// should replace the existing selection
// @keywords protected
// @return Boolean:  If true, multi select. If false, don't multi select
//------------------------------------------------------------------------------
LzSelectionManager.prototype.isMultiSelect = function ( ){
    return _root.LzKeys.isKeyDown( "control" );
}

//------------------------------------------------------------------------------
// Determines whether the an additional selection should be range-selected or
// should replace the existing selection
// @keywords protected
// @return Boolean: If true, range select. If false, don't range select
//------------------------------------------------------------------------------
LzSelectionManager.prototype.isRangeSelect = function(  ){
    return _root.LzKeys.isKeyDown( "shift" );
}

LzSelectionManager.prototype.toString =  function (){
    return "LzSelectionManager";
}

//=============================================================================
// Implements same functionality as a normal selection manager, but without
// storing view references, which become invalid as views created by a datapath
// that uses lazy replication do. Does this by storing subview numbers.
//=============================================================================
var LzDataSelectionManager = Class( "LzDataSelectionManager" , 
                                     LzSelectionManager );

//------------------------------------------------------------------------------
// Makes the given view selected
// @keywords protected
// @param LzView o: The view to be selected
//------------------------------------------------------------------------------
LzDataSelectionManager.prototype.makeSelected = function ( o ){
    var so = o.datapath.p;
    if ( this.manager == null ) this.manager = o.cloneManager;
    if ( so.sel ) return; 
    so.sel = true;
    this.selected.push( so );
    o.datapath[ this.sel ](true);
}

//------------------------------------------------------------------------------
// Unselect the given view
// @param LzView o: The view to be unselected
//------------------------------------------------------------------------------
LzDataSelectionManager.prototype.unselect = function ( o ){
    var so = o.datapath.p;
    so.sel = false;
    for ( var i= this.selected.length-1 ; i >= 0; i-- ){
        if ( this.selected[ i ] == so ) {
            this.selected.splice( i , 1 );
            break;
        }
    }
    o.datapath[ this.sel ](false);
}

//------------------------------------------------------------------------------
// Selects the range between the datapath that was lastselected and the newly
// selected view
// @keywords private
// @param LzDataPath s: The datapath that was at top of the selection stack
// @param LzView e: The newly selected view
//------------------------------------------------------------------------------
LzDataSelectionManager.prototype.selectRange = function ( s , e ){
    var nodes = this.manager.nodes;

    var st = -1;
    var en = -1;
    var i  = 0;
    var ennode = e.datapath.p;
    //find the start and end in the sort array of parents

    while ( ( st == -1 || en == -1 ) && i < nodes.length ){
        if ( nodes[ i ] == s ){
            st = i;
        } 
        if ( nodes[ i ] == ennode ){
            en = i;
        } 
        i++;
    }

        
    var dir = st > en ? -1 : 1;
    
    this.clearSelection();

    this.lastRange = s;

    //couldn't find -- wierd
    if ( st == -1 || en == -1 ) return;
    
    for ( var i = st; i != en + dir; i += dir ) {
        var p = nodes[ i ];
        p.sel = true;
        this.selected.push( p );
        this.__LZsetSelected( p, true );
    }
}

//------------------------------------------------------------------------------
// Returns a list of datapointers, which point to the selected records
// @return Array: A list of datapointers
//------------------------------------------------------------------------------
LzDataSelectionManager.prototype.getSelection = function (){
    var r = [];
    for ( var i = 0; i < this.selected.length ; i++ ){
        r.push( new _root.LzDatapointer( null , {pointer : this.selected[i] }));
    }
    return r;    
}

//------------------------------------------------------------------------------
// Unselects everything that is currently selected and clears the selection
// list
// 
//------------------------------------------------------------------------------
LzDataSelectionManager.prototype.clearSelection =  function ( ){
    while ( this.selected.length ){
        var p  = this.selected.pop();
        p.sel = false;
        this.__LZsetSelected( p , false );
    }
    this.lastRange = null;
}
        
//------------------------------------------------------------------------------
// Tests whether the given view is selected
// @param LzView o: The view to test for selectedness
//------------------------------------------------------------------------------
LzDataSelectionManager.prototype.isSelected =  function ( o){
    return o.datapath.p.sel;
}

//------------------------------------------------------------------------------
// sets the selected attribute of the data, if there is a clone, it will
// call setselected on the clone
// @param LzDataElement p: the node we want to set
// @param Boolean val: new value for selected
// @keywords private
//------------------------------------------------------------------------------
LzDataSelectionManager.prototype.__LZsetSelected = function ( p, val ){
    var cl = this.manager.getCloneForNode( p, true );
    if (cl) {
        cl.datapath[this.sel](val);
    } else { // no clone on screen
        p.sel = val;
    }
}
