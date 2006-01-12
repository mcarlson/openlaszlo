/******************************************************************************
 * LzCursor.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzCursor
//
// This object can be used to replace the default onscreen cursor.
//
//==============================================================================
LzCursor = new Object;

//------------------------------------------------------------------------------
// Shows or hides the hand cursor for all clickable views.
//
// @param Boolean show: true shows the hand cursor for buttons, false hides it
//------------------------------------------------------------------------------
LzCursor.showHandCursor = function (show) {
    Button.prototype.useHandCursor = show;
}

//------------------------------------------------------------------------------
// Sets the cursor to a resource
//
// @param String what: The resource to use as the cursor. 
//------------------------------------------------------------------------------
LzCursor.setCursorGlobal = function ( what ){
    if ( this.amLocked ) { return; }
    _root.attachMovie (what , "cCursor" , 5555 );
    _root.cCursor._x = _root._xmouse;
    _root.cCursor._y = _root._ymouse;
    _root.cCursor.startDrag( true );
    Mouse.hide();
}

//------------------------------------------------------------------------------
// This function restores the default cursor if there is no locked cursor on
// the screen.
//
// @keywords private
//------------------------------------------------------------------------------
LzCursor.restoreCursor = function ( ){
    if ( this.amLocked ) { return; }
    _root.cCursor.stopDrag();
    _root.cCursor.removeMovieClip (  );
    Mouse.show();
}

//------------------------------------------------------------------------------
// Prevents the cursor from being changed until unlock is called.
//
//------------------------------------------------------------------------------
LzCursor.lock = function (){
    this.amLocked = true;
}

//------------------------------------------------------------------------------
// Restores the default cursor.
//
//------------------------------------------------------------------------------
LzCursor.unlock = function (){
    this.amLocked = false;
    this.restoreCursor(); 
}
