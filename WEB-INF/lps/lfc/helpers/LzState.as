/******************************************************************************
 * LzState.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzState
// 
//=============================================================================

var LzState = Class( "LzState" , LzNode );

// @field Boolean apply: <code>setAttribute('apply', true)</code> will
// apply the state.  <code>setAttribute('apply', false)</code> will
// remove the state.
// <br /><br />
// By default, states are not applied.  It is often convenient to
// assign this attribute as a constraint in the tag.  For example:
// <code>&lt;state name="mystate" apply="parent.opened"</code> will
// apply the state if <code>parent.opened</code> is <code>true</code>.
// <br /><br />
// Note that for any script that is in the tag, the parent is the tag
// that encloses the script.  Any method that is declared within the
// state can only be called after the state is applied, and upon
// application <code>this</code> will refer to the view that encloses
// the state, rather than the state itself.
LzState.prototype.setters.apply = "setApply";
LzState.prototype.setters.$setters = null;
//---
//@keywords private
//---
LzState.prototype.setters.$delegates = "__LZstoreDelegates";
//---
//@keywords private
//---
LzState.prototype.setters.$refs = "checkRefs";
LzState.prototype.setters.$delegates = "checkDelegates";
LzState.prototype.staterefs = { apply : true };
LzState.prototype.stateevents = { onremove : true , onapply : true };
LzState.prototype.$isstate = true;
LzState.prototype.asyncnew = false;
LzState.prototype.setters.asyncnew = "__LZsetProperty";

//@field pooling: If true, the state will merely hide any views it has created 
//when it is removed, instead of destroying them. 
LzState.prototype.setters.pooling = "__LZsetProperty";

// When __LZsourceLocation is set, it should only apply to the state,
// not the parent
// @keywords private
LzState.prototype.setters.__LZsourceLocation = "__LZsetProperty";

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzState.prototype.construct = function ( parent , args ){
    super.construct( parent , args );
    this.heldArgs = {};
    this.appliedChildren = [];
    this.isapplied = false;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzState.prototype.createChildren = function ( carr ){
    this.subh = carr;
    this.__LZinstantiationDone();
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzState.prototype.setApply = function ( doapply ){
    if ( typeof(doapply) == 'function' ){
        // this happens because there is an attribute with the same name as
        //a function and both attributes and functions are sent in
        // the same "attrs" data structure
        this.apply = doapply;
        return;
    }

    if ( doapply ){
        if ( this.isinited ){
            this.apply();
        } else {
            new _root.LzDelegate( this , "apply" , this , "oninit" );
        }
    } else {
        if ( this.isinited ){
            this.remove();
        }
    }
}

//------------------------------------------------------------------------------
// Applies the state to the state's parent. If the state is already applied,
// has no effect
//------------------------------------------------------------------------------
LzState.prototype.apply = function ( ){
    //@field Boolean isapplied: true if the state is currently applied
    if ( this.isapplied ){
        return;
    }

    this.isapplied = true;

    //capture delegates created by process of applying state
    var od = this.parent.__delegates;
    this.parent.__delegates = null;

    this.parent.__LZapplyArgs( this.heldArgs );

    var shl = this.subh.length;
    this.parent.__LZsetPreventInit();

    for ( var i = 0 ; i < shl;  i++ ){
        if ( this.__LZpool[ i ] ){
            this.appliedChildren.push( this.__LZretach( this.__LZpool[ i ] ) );
        } else {
            this.appliedChildren.push( this.parent.makeChild( this.subh[ i ] ,
                                                            this.asyncnew));
        }
    }

    this.parent.__LZclearPreventInit();

    this.parent.__LZresolveReferences();
    this.__LZstatedelegates = this.parent.__delegates;

    this.parent.__delegates = od;

    //@event onapply: Sent when the state is applied.
    this.onapply.sendEvent( this );
}

//------------------------------------------------------------------------------
// Removes the constraints and views made when the state was applied. This
// method does not currently restore the previous values of any attributes that
// were changed by the state
//------------------------------------------------------------------------------
LzState.prototype.remove = function () {
    if ( !this.isapplied ){
        return;
    }

    //@event onremove: Sent when the state is removed
    this.onremove.sendEvent( this );
    this.isapplied = false;

    for ( var i = 0; i < this.__LZstatedelegates.length; i++ ){
        this.__LZstatedelegates[ i ].unregisterAll();
    }

    if ( this.pooling && this.appliedChildren.length ){
        this.__LZpool = [];
    }

    for ( var i = 0; i < this.appliedChildren.length; i++ ){
        var ac = this.appliedChildren[ i ];
        if ( this.pooling ){
            //if it's a view, we pool it -- otherwise we'll just reconstruct it
            if (ac instanceof _root.LzView){
                this.__LZpool.push ( this.__LZdetach( ac ) );
            } else {
                ac.destroy();
                this.__LZpool.push ( null );
            }
        } else {
            ac.destroy();
        }
    }
    
    this.appliedChildren = [];

}

//---
// Clean up after yourself
// @keywords private
//---
LzState.prototype.destroy = function ( ) {
    // stop pooling
    this.pooling = false;
    // clean up delegates and views
    this.remove();
    // continue
    super.destroy( );
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzState.prototype.__LZapplyArgs  = function ( args ){
    var oset = {};
    for ( var a in args ){
        //handle flash bug where objects slots are enumerated multiple times
        if ( oset[a] ) continue;
        oset[ a ] = true;
        if ( this.setters[ a ] != null ){
            //set this on the state if the state can set it
            this[ this.setters[ a ] ]( args[a] ,a , args );
        } else {
            this.heldArgs[a] = args[a];
        }
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzState.prototype.checkRefs = function ( refs ){
    var parrefs = {};
    var myrefs = {};

    for ( var p in refs ){
        //this belongs to the state
        if ( this.staterefs[ p ] ){
            myrefs[ p ] = refs[ p ]
            var havemyrefs = true;
        } else {
            parrefs[ p ] = refs[ p ];
            var haveparrefs = true;
        }
    }

    if ( havemyrefs ){
        this.__LZstoreRefs( myrefs , "$refs" );
    }

    if ( haveparrefs ){
        this.heldArgs.$refs = parrefs;
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzState.prototype.checkDelegates = function ( delarr ){
    var pardels = [];
    var mydels = [];

    for ( var i = 0; i < delarr.length;i +=3 ){
        //does this go with the state or the state's owner?
        //goes with the state ONLY IF the event is an event that the state 
        //sends, and a reference isn't given.
        if ( this.stateevents[ delarr[ i ] ] && ! delarr[ i + 2 ] ){
            var arrtopush = mydels;

            //now, capture the method that this calls
            var mname = delarr[ i +1 ];

            //check to see if we already processed this method 
            //in __LZapplyArgs
            if ( this.heldArgs[ mname ] ){
                this[ mname ] = this.heldArgs[ mname ];
                delete this.heldArgs[ mname ];
            }

            //create a setter for this method; by definition attributes that
            //the state has a setter for are handled by the state
            this.__LZaddSetter(  mname , '__LZsetProperty' );
        } else {
            var arrtopush = pardels;
        }

        arrtopush.push( delarr[ i ], delarr[ i + 1], delarr[ i +2 ] );
    }

    if ( mydels.length ){
        this.__LZstoreAttr( mydels , "$delegates" );
    }

    if ( pardels.length ){
        this.heldArgs.$delegates = pardels;
    }
}


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzState.prototype.__LZsetProperty = function ( prop, propname ){
    this[propname] = prop;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzState.prototype.__LZstoreDelegates = function ( delarr ){
    this.heldArgs.$delegates = delarr;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzState.prototype.__LZdetach = function ( aview ){
    aview.setVisible( false );
    return aview;
}

//=============================================================================
// @keywords private
//=============================================================================
LzState.prototype.__LZretach = function ( aview ){
    aview.setVisible( true );
    return aview;
}
