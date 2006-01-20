/******************************************************************************
 * LzFocus.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// <p>This service manages the keyboard focus.</p>
//=============================================================================
LzFocus = new Object();

//@field LzView lastfocus: A reference to the last view that held the focus
LzFocus.lastfocus = null;
LzFocus.csel = null;

//@event onfocus: Sent when the focus changes, with the argument being the view
//that was just focused. If nothing is focussed, this event is sent with null.
LzFocus.onfocus = null;

LzFocus.upDel = new _root.LzDelegate( LzFocus , "gotKeyUp", LzKeys, "onkeyup");
LzFocus.downDel = new _root.LzDelegate( LzFocus , "gotKeyDown",
                                                   LzKeys, "onkeydown");

//@field Boolean focuswithkey: This attribute is set to true when the focus has moved
//because the user has hit the next or prev focus key (usually 'tab' and
//'shift-tab'.) If the focus moves due to mouse-click the value is set to
//false. If the focus moves through programmatic control, the value is
//unchanged from its last value.
LzFocus.focuswithkey = null;

LzFocus.__LZskipblur = false;
LzFocus.__LZsfnextfocus = -1;
LzFocus.__LZsfrunning = false;

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzFocus.gotKeyUp = function( kC ){
    //_root.Debug.write("gotKeyUp "+kC);
    this.csel.onkeyup.sendEvent( kC );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzFocus.gotKeyDown = function( kC ){
    //_root.Debug.write("gotKeyDown "+kC);
    this.csel.onkeydown.sendEvent( kC );
    if ( kC == _root.LzKeys.keyCodes.tab ){
        if ( _root.LzKeys.isKeyDown( 'shift' ) ){
            this.prev();
        } else {
            this.next();
        }
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzFocus.setNextKey = function( k ){
    if ( $debug ){
        _root.Debug.write( 'Next key can no longer be set.');
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzFocus.setPrevKey = function( k ){
    if ( $debug ){
        _root.Debug.write( 'Prev key can no longer be set.');
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzFocus.__LZcheckFocusChange = function ( v ){
    if ( v.focusable ){
        this.setFocus( v , false );
    }
}

//------------------------------------------------------------------------------
// Set the focus to the given view.  If this is not the currently
// focused view, an onblur event is sent to the currently focused view,
// and an onfocus event is sent to the new view. When setFocus is called as the
// result of an onblur or onfocus event, all the delegates registered for the
// event run before the next setFocus call is made. While it is not an error
// for multiple responders to call setFocus as the result of the same onfocus
// or onblur event, only one of the calls will be executed.
//
// @param LzView newsel: The view to focus
//------------------------------------------------------------------------------
LzFocus.setFocus = function  ( newsel ){
    //undocumented attribute focuswithkey. If the second argument to this
    //method is defined, it sets the value of this.focuswithkey to the given
    //value.

    if ( this.__LZsfrunning ){
        this.__LZsfnextfocus = newsel;
        return;
    }

    if ( this.cseldest == newsel ) {
        return;
    }

    if ( this.csel.shouldYieldFocus && !this.csel.shouldYieldFocus() ) {
      return;
    }

    this.__LZsfnextfocus = -1;
    this.__LZsfrunning = true;

    if ( newsel && !newsel.focusable) {
        newsel = this.getNext(newsel);
    }
    this.cseldest = newsel;

    if ( arguments[ 1 ] != null ){
        this.focuswithkey  = arguments[1];
    }

    if ( !this.__LZskipblur ){
        this.__LZskipblur = true;
        this.csel.onblur.sendEvent( newsel );
        if ( this.__LZsfnextfocus != -1 ) {
            //we've been called again
            this.__LZsfrunning = false;
            this.setFocus( this.__LZsfnextfocus );
            return;
        }
    }

    //now focus changes
    this.lastfocus = this.csel;
    this.csel = newsel;
    this.__LZskipblur = false;
    

    newsel.onfocus.sendEvent( newsel );
    if ( this.__LZsfnextfocus != -1 ) {
        //we've been called again
        this.__LZsfrunning = false;
        this.setFocus( this.__LZsfnextfocus );
        return;
    }

    this.onfocus.sendEvent( newsel );
    this.__LZsfrunning = false;
    if ( this.__LZsfnextfocus != -1 ) {
        //we've been called again
        this.setFocus( this.__LZsfnextfocus );
        return;
    }
}

//------------------------------------------------------------------------------
// Remove the focus from the currently focused view (if there is one).
// An 'onblur' event is first sent to the view.
//------------------------------------------------------------------------------
LzFocus.clearFocus = function ( ){
    this.setFocus( null );
}

//------------------------------------------------------------------------------
// Get the currently focused view.
// @return LzView: The view that has the focus, or null if none does.
//------------------------------------------------------------------------------
LzFocus.getFocus = function (){
    return this.csel;
}

//------------------------------------------------------------------------------
// Move the focus to the next focusable view.
//------------------------------------------------------------------------------
LzFocus.next = function (){
    this.genMoveSelection( 1 );
}

//------------------------------------------------------------------------------
// Returns the next focusable view.
// @param LzView focusview: optional starting view. By default focusview 
// is the current focus.
// @return LzView: The view that would be the next focus.
//------------------------------------------------------------------------------
LzFocus.getNext = function ( focusview ){
    if ( !focusview ) focusview = this.csel;
    return this.moveSelSubview( focusview , 1 ) ;
}

//------------------------------------------------------------------------------
// Returns the previous focusable view.
// @param LzView focusview: optional starting view. By default focusview 
// is the current focus.
// @return LzView: The view that would be the focus if you shift tabbed 
//------------------------------------------------------------------------------
LzFocus.getPrev = function ( focusview ){
    if ( !focusview ) focusview = this.csel;
    return this.moveSelSubview( focusview , -1 ) ;
}


//------------------------------------------------------------------------------
// Move the focus to the previous focusable view.
//------------------------------------------------------------------------------
LzFocus.prev = function (){
    this.genMoveSelection( -1 );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzFocus.genMoveSelection = function ( movedir  ){
    var sel = this.csel;
    var check = sel;

    while ( sel && check != _root.canvas ){
        if (!check.visible ) {
            sel = null;
        }
        check = check.immediateparent;
    }

    if ( sel == null ){
        sel = _root.LzModeManager.getModalView();
    }

    var v = sel[ "get"+(movedir == 1 ? "Next" : "Prev")+"Selection" ]();
    if ( v == null ){
        v = this.moveSelSubview( sel , movedir ) ;
    }

    if ( !_root.LzModeManager.__LZallowFocus( v ) ){
        return;
    }

    this.setFocus( v , true );
}


//------------------------------------------------------------------------------
// Append those of v and its descendants that are focusable, to accum.
// Always include 'include', and include focus traps but don't descend
// into them unless this is the outermost call (and top=true).
//
// @keywords private
//------------------------------------------------------------------------------
LzFocus.accumulateSubviews = function(accum, v, include, top) {
    // Always include the current view, even if it's not focusable,
    // since its index is used to find a focusable neighbor.
    if (v == include || (v.focusable && v.visible))
        accum.push(v);
    // Don't descend into focus traps, except always consider children
    // of the outermost call.
    if (top || (!v.focustrap && v.visible))
        for (var i = 0; i < v.subviews.length; i++)
            this.accumulateSubviews(accum, v.subviews[i], include);
}


//------------------------------------------------------------------------------
// Return an item in the same focus group as v, either preceding it (mvdir==-1)
// or following it (mvdir==1) in preorder.
//
// @keywords private
//------------------------------------------------------------------------------
LzFocus.moveSelSubview = function ( v , mvdir ){
    // Find the closest parent that doesn't cross a focus trap boundary.
    var root = v || _root.canvas;
    // If v is a focus trap, make sure that we at least step up to its
    // parent, in order to tab to its siblings.
    // I don't think this is right, but I'm not 100% sure, so leaving comment
    // when do you have focustrap="true" and focusable="true" ?  -sa
    //  if (root.focustrap && root.immediateparent)
    //     root = root.immediateparent;

    // canvas.immediateparent == canvas.  No other cycles should be
    // present (although this will catch others of length one).
    while (!root.focustrap && root.immediateparent
           && root != root.immediateparent)
      root = root.immediateparent;
    // collect selectable children into focusgroup
    var focusgroup = [];
    this.accumulateSubviews(focusgroup, root, v, true);

    // set index to the index of v within the current focus group.
    var index = -1;
    for (var i in focusgroup)
        if (focusgroup[i] == v) {
            // for..in returns strings
            index = Number(i);
            break;
        }
    // If the current focus group doesn't include v, mvdir==1 should select
    // the first item and mvdir==-1 should select the last item.  index==-1
    // and mvdir==1 will already work for the first case.  Fix the second:
    if (index == -1 && mvdir == -1)
        index = 0;
    index = (index + mvdir + focusgroup.length) % focusgroup.length;
    return focusgroup[index];
}
