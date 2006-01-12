/******************************************************************************
 * LzModeManager.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzModeManager
// Manages the modal states of views and also notifies views ( that have
// registered with it ) when their focus has changed.
//=============================================================================
LzModeManager = new Object();

//@event onmode: Sent when the mode changes.
LzModeManager.onmode = null;

LzModeManager.modeArray = new Array();

LzModeManager.clickStream = new Array();
LzModeManager.clstDel = new LzDelegate( LzModeManager , "checkClickStream" );

LzModeManager.clstDict ={ onmouseup : 1 , onmousedown: 2 };

LzModeManager.toString = function (){
    return "mode manager";
}

//=============================================================================
// The global mouse service sends onmouse*** and onclick events when the mouse
// rollover or button state changes.  The argument sent with the events is the
// view that was clicked. If no view was clicked, the argument is null. 
//=============================================================================
LzGlobalMouse = new Object;


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
/*
LzGlobalMouse.fakemethod = function (){
    //@field onmouseup: Event sent by the LzGlobalMouse when a mouseup is
    //trapped that did not originate from a clickable view.

    //@field onmousedown: Event sent by the LzGlobalMouse when a mousedown is
    //trapped that did not originate from a clickable view.
}
*/

//-----------------------------------------------------------------------------
// Pushes the view onto the stack of modal views
// @param LzView view: The view intending to have modal iteraction
//-----------------------------------------------------------------------------
LzModeManager.makeModal = function ( view ) {
    this.modeArray.push( view );
    this.onmode.sendEvent( view );
    if ( ! _root.LzFocus.getFocus().childOf( view ) ){
        _root.LzFocus.clearFocus();
    }
}

//-----------------------------------------------------------------------------
// Removes the view (and all the views below it) from the stack of modal views
// @param LzView view: The view to be released of modal interaction
//-----------------------------------------------------------------------------
LzModeManager.release = function ( view ) {
    //releases all views past this one in the modelist as well
    for ( var i = this.modeArray.length-1 ; i >=0 ; i-- ){
        if ( this.modeArray[ i ] == view ){
            this.modeArray.splice( i , this.modeArray.length - i );
            var newmode = this.modeArray[ i - 1 ];
            this.onmode.sendEvent( newmode || null );
            if ( newmode && ! _root.LzFocus.getFocus().childOf( newmode ) ){
                _root.LzFocus.clearFocus();
            }
            return;
        }
    }
}

//-----------------------------------------------------------------------------
// Clears all modal views from the stack
//-----------------------------------------------------------------------------
LzModeManager.releaseAll = function ( ) {
    // reset array to remove all views
    this.modeArray = new Array();
    this.onmode.sendEvent( null );
}


//------------------------------------------------------------------------------
// Called by clickable movieclip
// @keywords private
//------------------------------------------------------------------------------
LzModeManager.handleMouseButton = function ( view , eventStr){
    this.clickStream.push( this.clstDict[ eventStr ] + 2);

    this.handleMouseEvent( view , eventStr );
    this.callNext();
}

//-----------------------------------------------------------------------------
// Check to see if the current event should be passed to its intended view
// @keywords private
//
// @param LzView view: the view that received the event
// @param String eventStr: the event string
//-----------------------------------------------------------------------------
LzModeManager.handleMouseEvent= function ( view, eventStr ) {
    //_root.Debug.warn(view + ', ' + eventStr);

     if (eventStr == "onmouseup") _root.LzTrack.__LZmouseup();
    _root.LzGlobalMouse[ eventStr ].sendEvent( view );

    if ( this.eventsLocked == true ){
        return;
    }

    var dosend = true;
    var isinputtext = false;

    if (view == null ) {  // check if the mouse event is in a inputtext
        var ss = Selection.getFocus();
        if ( ss != null ){
            var focusview = eval( ss.substring( 0 , ss.lastIndexOf( '.' ) ) 
                                  + ".view");
            if ( focusview ) view = focusview;
        } 
    }

    var i = this.modeArray.length-1;
    while( dosend && i >= 0 ){
        var mView = this.modeArray[ i-- ];
        // exclude the debugger from the mode
        if ($debug) {
             if (view.childOf(_root.Debug))
                break;
        }

        if (view.childOf( mView ) ){
            break;
        } else {
            dosend = mView.passModeEvent( eventStr , view );
        }
    }

    if ( dosend ){
        //check for double-click
        if ( eventStr == "onclick" ){
            if ( this.__LZlastclick == view  &&
               view.ondblclick && !view.ondblclick.hasNoDelegates &&
                (getTimer() - this.__LZlastClickTime)< view.DOUBLE_CLICK_TIME ){
                    //this is a double-click
                    eventStr = "ondblclick";
                    this.__LZlastclick = null;
            } else {
                this.__LZlastclick = view;
                this.__LZlastClickTime = getTimer();
            }
        }

        view[ eventStr ].sendEvent( view );
        if ( eventStr == "onmousedown" ){
            _root.LzFocus.__LZcheckFocusChange( view );
        }
    } 


    //this on matters for onmouseup and onmousedown, but it's easier to just
    //set it regardless
    this[ "haveGlobal" + eventStr ] = false;

}

//-----------------------------------------------------------------------------
// return true if the given view is allowed to receive the focus
// any view that is a child of the view that has the mode may be focused
// other views may not
// @keywords private
//-----------------------------------------------------------------------------
LzModeManager.__LZallowFocus= function ( view ) {
    var len = this.modeArray.length;
    return len == 0 || view.childOf ( this.modeArray[len-1] );
}

//-----------------------------------------------------------------------------
// Called when any mousedown or mouseup event is received by canvas to try and 
// match up mouse events with non-clickable view.  Not reliable - could happen 
// after any number of frames.
//
// A Timer is then activated to call
// the cleanup method in the next frame
//
// @keywords private
//-----------------------------------------------------------------------------
LzModeManager.rawMouseEvent = function ( eName ) {
    //_root.Debug.warn("rawmouseevent %w", eName);
    //assume this happens before handleMouseEvent though order is
    //not guaranteed

    this.clickStream.push( this.clstDict[ eName ] );
    //call the cleanup delegate

    this.callNext();
}

LzModeManager.WAIT_FOR_CLICK = 4;
//-----------------------------------------------------------------------------
// Cleanup method for raw mouseup
//
// @keywords private
//-----------------------------------------------------------------------------
LzModeManager.checkClickStream = function (){
    this.willCall = false;

    //clickstream that looks like this
    //1 , 3 , 2, 0 , ....
    //raw mup , view mup , raw down , frame -- ok to check next for pair
    //but then stop.
    var i = 0;
    var cl = this.clickStream;
    var cllen = this.clickStream.length;

    while( i < cllen -1 ){

        if (  !( cl[i] == 1 || cl[i]==2 )){
            //if we encounter a button mouse event here, it means we sent
            //a global mouse event too soon
            if ( cl[i] != 0 ) {
                _root.Debug.write( "WARNING: Sent extra global mouse event" );
            }

            //advance pointer
            i++;

            continue;
        }

        var nextp = i + 1;
        var maxnext = this.WAIT_FOR_CLICK + i;

        while ( cl[ nextp ] ==  0 && nextp  < maxnext ){
            nextp++;
        }

        if ( nextp >= cllen ){
            //it's not here, so wait till next frame
            break;
        }

        if ( cl[ i ] == cl[ nextp ] - 2 ){
            //this is a pair -- simple case. just advance pointer
            i = nextp+1;
        } else {
            //this is unpaired
            if ( cl[i] == 1 ){
                var me= "onmouseup";
            }else{
                var me="onmousedown";
            }
            this.handleMouseEvent( null , me );
            i++;
        }
    }

    while( cl[ i ] == 0 ){ i++; }

    cl.splice( 0 , i ); //remove up to i

    if ( cl.length > 0 ){
        this.clickStream.push( 0 );
        this.callNext();
    }

}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzModeManager.callNext = function (){
    if ( !this.willCall ){
        this.willCall = true;
        _root.LzIdle.callOnIdle( this.clstDel );
    }
}
//-----------------------------------------------------------------------------
// Prevents all mouse events from firing.
//
//-----------------------------------------------------------------------------
LzModeManager.globalLockMouseEvents = function (){
    this.eventsLocked = true;
}

//-----------------------------------------------------------------------------
// Restore normal mouse event firing.
//
//-----------------------------------------------------------------------------
LzModeManager.globalUnlockMouseEvents = function (){
    this.eventsLocked = false;
}

//-----------------------------------------------------------------------------
// Tests whether the given view is in the modelist.
// @param LzView view: The mode to be tested to see if it is in the modelist
// @return Boolean: true if the view is in the modelist
//
//-----------------------------------------------------------------------------
LzModeManager.hasMode = function ( view ){
    for ( var i = this.modeArray.length -1 ; i >= 0; i-- ){
        if ( view == this.modeArray[ i ] ){
            return true;
        }
    }
    return false;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzModeManager.getModalView = function ( ){
    return this.modeArray[ this.modeArray.length - 1] || null;
}
