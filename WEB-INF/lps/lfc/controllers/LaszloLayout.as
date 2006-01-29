/******************************************************************************
 * LaszloLayout.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzLayout

//=============================================================================


var LzLayout = Class( "LzLayout" , LzNode );
LzLayout.prototype.subviews = null;
LzLayout.prototype.setters.locked = "__LZsetLocked";

//-----------------------------------------------------------------------------
// @param view: A view above this one that the Layout should apply to. Note:
// this may not ultimately be the same as the view that it will eventually be
// attached to, due to placement.
// @param args: Constructor arguments.
//
// @keywords private
//-----------------------------------------------------------------------------
LzLayout.prototype.construct = function ( view , args) {
    //this.callInherited( "construct" , arguments.callee ,  view , args );
    this._nodeconstruct( view , args );
    this.subviews = new Array;

    //@field view.layouts: If it doesn't already exist, layouts create an array
    //in the view that it attaches to that hold the list of layouts attached
    //to the view.
    if ( this.immediateparent.layouts == null ){
        this.immediateparent.layouts = [ this ];
    } else {
        this.immediateparent.layouts.push( this );
    }

    //@field LzDelegate updateDelegate: A delegate used to update the layout.
    this.updateDelegate = new _root.LzDelegate( this , "update" );

    //@field [LzDelegate] delegates: An array of all the delegates used by the
    //layout
    this.delegates = [ this.updateDelegate ];

    // register for unlock when parent inits, or unlock if already inited
    if (this.immediateparent.isinited) {
        this.__parentInit();
    } else {
        this.initDelegate = new _root.LzDelegate( this , "__parentInit", this.immediateparent, "oninit" );
        this.delegates.push(this.initDelegate);
    }

}

LzLayout.prototype._nodeconstruct = LzNode.prototype.construct;

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzLayout.prototype.constructWithArgs = function ( args ) {
    //all layouts need to know when their view adds/deletes a subview
    this.delegates.push( new _root.LzDelegate (  this, "gotNewSubview",
                                        this.immediateparent,"onaddsubview" ));
    //this is never called b/c removeSubview is not implemented yet
    this.delegates.push( new _root.LzDelegate (  this, "removeSubview",
                                    this.immediateparent, "onremovesubview" ));

    var vsl = this.immediateparent.subviews.length;

    for (var i = 0; i < vsl; i++){
        this.gotNewSubview( this.immediateparent.subviews[i] );
    }

}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzLayout.prototype.destroy = function ( ) {
    this.releaseLayout();
    super.destroy( );
}


//-----------------------------------------------------------------------------
// Reset any held parameters (such as kept sizes that may have changed) and
// before updating.
//
// @keywords protected
//
// @param Any e: The event data that is passed by the delegate that called this
// funciton. This is usually unused, since more than one type of delegate can
// call reset.
//-----------------------------------------------------------------------------
LzLayout.prototype.reset = function( e ) {
    //@field Boolean locked: Set to true if layout is locked from updates.
    if ( this.locked ) { return; }
    //defalt behavior on reset is to update
    this.update( e );
}

//-----------------------------------------------------------------------------
// Called whenever a new subview is added to the layout. This is called both
// in the layout constructor and when a new subview is called after layout
// has been created. This is only called if the view's "ignorelayout" option is
// not set.
//
// @keywords protected
// @param LzView sd: The subview to add.
//-----------------------------------------------------------------------------
LzLayout.prototype.addSubview = function( sd ) {
    //@field [LzView] subviews: Array holding the views under this layout's
    //control.
    if ( sd.getOption( 'layoutAfter' ) ){
        //this wants to get inserted in a specific place in the layout
        this.__LZinsertAfter( sd , sd.getOption( "layoutAfter" ) );
    } else {
        this.subviews.push ( sd );
    }
}
//-----------------------------------------------------------------------------
// Called whenever the layout discovers a new subview. Checks to see if view
// should be added by inspecting the view's "ignorelayout" option.
//
// @keywords private
// @param sd: The subview to add.
//-----------------------------------------------------------------------------
LzLayout.prototype.gotNewSubview = function( sd ) {
    if ( ! sd.getOption( 'ignorelayout' ) ){
        this.addSubview( sd );
    }
}

//-----------------------------------------------------------------------------
// Called when a subview is removed. This is not well tested.
//
// @keywords protected
// @param LzView sd: The subview to be removed.
//-----------------------------------------------------------------------------
LzLayout.prototype.removeSubview = function( sd ) {
    for ( var i = this.subviews.length-1; i >= 0; i-- ){
        if ( this.subviews[ i ] == sd ){
            this.subviews.splice( i , 1 );
            break;
        }
    }

    this.reset();
}

//-----------------------------------------------------------------------------
// Called when a subview is to be ignored by the layout. By default, most
// layouts include all the subviews of a given view.
//
// @keywords protected
// @param LzView s: The subview to ignore.
//-----------------------------------------------------------------------------
LzLayout.prototype.ignore = function( s ) {
    //default behavior on addSubview is to reset
    for (var i = this.subviews.length - 1; i >= 0; i-- ){
        if ( this.subviews[ i ] == s ){
            this.subviews.splice( i , 1 );
            break;
        }
    }
    this.reset();
}

//-----------------------------------------------------------------------------
// Lock the layout from processing updates. This allows the layout to register
// for events that it generates itself. Unfortunately, right now all subclass
// routines that can generate calls that may result in the layout calling
// itself should check the lock before processing. Failure to do so is not
// catastrophic, but it will slow down your program.
//-----------------------------------------------------------------------------
LzLayout.prototype.lock = function ( ) {
    this.locked = true;
}


//-----------------------------------------------------------------------------
// Unlock the layout once update is done.
//
//-----------------------------------------------------------------------------
LzLayout.prototype.unlock = function ( ) {
    this.locked = false;
    this.reset()
}

//-----------------------------------------------------------------------------
// Unlock the layout once update is done.
//
// @keywords private
//-----------------------------------------------------------------------------
LzLayout.prototype.__LZsetLocked = function ( locked ) {
    if ( this.locked == locked ) return;
    if ( locked ){
        this.lock();
    } else {
        this.unlock();
    }
}

//locked is set to 2 in the prototype of the layout. This is a special signal
//that the layout is locked temporarily until it resolves its references
LzLayout.prototype.locked = 2;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzLayout.prototype.__parentInit = function (){
    if ( this.locked == 2){
        if (this.isinited) {
            this.unlock();
        } else {
            new _root.LzDelegate( this , "unlock", this, "oninit" );
        }
    }
}

//-----------------------------------------------------------------------------
// Remove the layout from the view and unregister the delegates that the layout
// uses.
//-----------------------------------------------------------------------------
LzLayout.prototype.releaseLayout = function ( ) {
    for ( var i = this.delegates.length - 1;  i >= 0; i -- ){
        this.delegates[ i ] .unregisterAll();
    }
    for ( var i = this.immediateparent.layouts.length -1 ; i >= 0 ; i-- ){
        if ( this.immediateparent.layouts[ i ] == this ){
            this.immediateparent.layouts.splice( i , 1 );
        }
    }
}


//-----------------------------------------------------------------------------
// Reorder the second subview given  to this function so that it immediately
// follows the first. Doesn't touch the placement of the first subview given
//
// @keywords public
//
// @param LzView sub1: The reference subview which the second subview should
// follow in the layout order. Alternatively, can be "first" or "last"
// @param LzView sub2: The subview to be moved after the reference subview.
//-----------------------------------------------------------------------------
LzLayout.prototype.setLayoutOrder = function ( sub1 , sub2 ){
    //this will cause problems if sub1 or sub2 are not subviews
    for (var i = this.subviews.length -1; i >= 0 ; i-- ){
        if ( this.subviews[ i ] == sub2 ){
            this.subviews.splice( i, 1 );
            break;
        }
    }

    if ( sub1 == "first" ){
        this.subviews.unshift( sub2 );
    } else if ( sub1 == "last" ){
        this.subviews.push( sub2 );
    } else {
        for (var i = this.subviews.length -1; i >= 0 ; i-- ){
            if ( this.subviews[ i ] == sub1 ){
                this.subviews.splice( i+1 , 0 , sub2 );
                break;
            }
        }
    }
    this.reset();
    return;
}

//-----------------------------------------------------------------------------
// Swap the positions of the two subviews within the layout
// @keywords public
//
// @param LzView sub1: The reference subview which the second subview should
// follow in the layout order.
// @param LzView sub2: The subview to be moved after the reference subview.
//-----------------------------------------------------------------------------
LzLayout.prototype.swapSubviewOrder = function ( sub1 , sub2 ){
    //this will cause problems if sub1 or sub2 are not subviews
    var s1p = -1;
    var s2p = -1;

    for (var i = this.subviews .length -1; i >= 0 && ( s1p < 0 || s2p < 0 );
                   i-- ){
        if ( this.subviews[ i ] == sub1 ){
            s1p = i;
        } else  if ( this.subviews[ i ] == sub2 ){
            s2p = i;
        }
    }

    this.subviews[ s2p ] = sub1;
    this.subviews[ s1p ] = sub2;

    this.reset();
    return;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzLayout.prototype.__LZinsertAfter = function ( newsub , oldsub ){
    for ( var i = this.subviews.length -1 ; i >= 0; i-- ){
        if ( this.subviews[ i ] == oldsub ){
            this.subviews.splice( i , 0 , newsub );
        }
    }
}

//-----------------------------------------------------------------------------
// Update is called whenever the layout needs to be updated. By defualt, it
// is called by <b> reset</b>. This is an abstract function in the class,
// but this is the main routine where the layout does its work.
//
// The beginning of this routine should always check for the locked property
// and return immediately if it is true for best performace.
//
// @keywords protected
//-----------------------------------------------------------------------------
/*
LzLayout.prototype.update = function() {
}
*/

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzLayout.prototype.toString = function (){
    return "LzLayout for view " + this.immediateparent;
}
