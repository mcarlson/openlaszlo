/******************************************************************************
 * LzTimer.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzTimer
// The timer calls a given delegate in a specified number of miliseconds.
//
//=============================================================================
LzTimer = new Object;
//@field [LzTimer] timerList: The array of active timers
LzTimer.timerList = new Array;
LzTimer.updateDel = new LzDelegate( LzTimer , "checkTime" );


//-----------------------------------------------------------------------------
// Adds a timer. NB: The timer guarantees that the delegate will not be called
// before the number of miliseconds specified here, but cannot guarantee that
// it will be called at exactly that time.
// 
// @param LzDelegate d: The delegate to call when the timer expires
// @param Number milisecs: The number of milisecs to wait before calling the delegate.
//-----------------------------------------------------------------------------
LzTimer.addTimer = function ( d , milisecs ){
    var notinserted = true;
    var i = 0;
    var exptime = ( getTimer() + milisecs );

    while ( notinserted ){
        if ( i == this.timerList.length || 
             ( exptime > this.timerList[ i ].time )){
            this.timerList.splice ( i , 0 , { d : d , time : exptime } );
            notinserted = false;
        }
        i++;
    }

    this.nextTime = this.timerList[ this.timerList.length -1 ].time;

    if ( ! this.haveTimers ){
        this.haveTimers = true;
        this.updateDel.register ( _root.LzIdle , "onidle" );
    }
}

//-----------------------------------------------------------------------------
// Checks the timerlist for expired timers.
//
// @keywords private
//-----------------------------------------------------------------------------
LzTimer.checkTime = function ( ){
    if ( this.nextTime > getTimer() ) return;
    var ct = getTimer();


    while( this.nextTime <= ct && this.nextTime ){
        this.timerList.pop().d.execute( getTimer() );
        this.checkUpdate();
    }
}

//-----------------------------------------------------------------------------
// Called after timerlist changes to update nextTime a timer needs to be 
// called, and if no timers are pending, to stop the timer from checking for
// expired timers.
//
// @keywords private
//-----------------------------------------------------------------------------
LzTimer.checkUpdate = function ( ){
    if ( this.timerList.length ){
        this.nextTime = this.timerList[ this.timerList.length - 1 ].time;
    } else {
        this.nextTime = 0;
        this.haveTimers = false;
        this.updateDel.unregisterAll ( );
    }
}
//-----------------------------------------------------------------------------
// Removes the first timer that calls the given delegate from the timerlist.
//
// @param LzDelegate d: The delegate called by the timer to be removed. If there are 
// multiple timerList entries that call delegate d, removes the first in the
// order received.
//-----------------------------------------------------------------------------
LzTimer.removeTimer = function ( d ){
    for ( var i = this.timerList.length - 1; i >= 0 ; i-- ){
        if ( this.timerList[ i ].d == d ){
            this.timerList.splice( i , 1 );
            break;
        }
    }

    this.checkUpdate();
}

//-----------------------------------------------------------------------------
// Resets the timer for the given delegate to the new amount of time. If the
// delegate is not found, a new timer is created.
//
// @param LzDelegate d: The delegate called by the timer to be reset. If there are
// multiple timers for this delegate, the first one is reset. If this delegate
// is not found in the timer list, a new timer event is created for it.
//
// @param milisecs: The number of miliseconds to wait before calling the timer.
//-----------------------------------------------------------------------------
LzTimer.resetTimer = function ( d  , milisecs ){
    this.removeTimer( d );
    this.addTimer( d , milisecs );
}
