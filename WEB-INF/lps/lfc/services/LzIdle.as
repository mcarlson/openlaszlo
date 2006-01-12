/******************************************************************************
 * LzIdle.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzIdle
// This object sends an 'onidle' event when there is no synchronous script
// running after each frame update.
//=============================================================================
LzIdle = new Object();
LzIdle.coi = new Array();
LzIdle.removeCOI = new LzDelegate( LzIdle , "removeCallIdleDelegates" );


//-----------------------------------------------------------------------------
// Calls the given delegate at the next idle event. This can be used for a non-
// recursive callback.
// @param LzDelegate d: The delegate to be called on the next idle event.
//-----------------------------------------------------------------------------
LzIdle.callOnIdle = function ( d ){
    this.coi.push(d);
    if (! this.regNext ){
        this.regNext = true;
        this.removeCOI.register( this , "onidle" );
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzIdle.removeCallIdleDelegates = function ( t ){
    var arr = this.coi;
    this.coi = new Array;
    //call in order
    for (var i = 0; i < arr.length; i++ ){
        arr[i].execute( t );
    }

    //@event onidle: This is the idle event for the system, sent by this
    //service
    if (this.coi.length == 0) {
        // Note that the executed items may have added to the (new)
        // coi queue, only unregister if the queue is empty
        this.removeCOI.unregisterFrom(this.onidle);
        this.regNext = false;
    }
}

LzIdle.toString = function ( ){
    return "LzIdle";
}

