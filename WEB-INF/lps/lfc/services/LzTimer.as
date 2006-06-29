/******************************************************************************
 * LzTimer.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzTimer
// The timer calls a given delegate in a specified number of miliseconds.
//
// Unfortunately the original semantics of LzTimer allows one to add more
// than one timer to a single delegate, but only allows one to remove the
// oldest timer from a delegate -- there's no way of specifying which one.
// The logic below is faithful to the original while still attempting to be
// efficient. In the common case of one timer per delegate, we simply
// store the timer id in the delegate's timer list entry. If the program
// attempts to store more than one timer with a single delegate, we shift
// to storing an array of them in the timer list entry. This saves an
// array allocation in the common single-timer case, at the cost of increased
// code complexity.
//=============================================================================
LzTimer = new Object;
//@keywords private
LzTimer.timerList = new Object;

//-----------------------------------------------------------------------------
// Adds a timer. NB: The timer guarantees that the delegate will not be called
// before the number of miliseconds specified here, but cannot guarantee that
// it will be called at exactly that time.
// 
// @param LzDelegate d: The delegate to call when the timer expires
// @param Number milisecs: The number of milisecs to wait before calling the 
// delegate.
//-----------------------------------------------------------------------------
LzTimer.addTimer = function ( d , milisecs ){
    var p = { 'delegate' : d };
    var f = function () {
        // This closure captures 'p', and relies on the fact that p.id will 
        // have been set by the time the closure is invoked.
        
        // User LzTimer explicitly below; "this" is not the outer function's
        // this here.
        LzTimer.removeTimerWithID(p.delegate, p.id); 
        p.delegate.execute( (new Date()).getTime() );
    }
    var id = setInterval(f, milisecs);
    if ($debug) {
        // Debug.format("created timer %w for delegate %w\n", id, d);
        if (id instanceof Array)
            // we rely on the setInterval value being a non-array, otherwise
            // our storage scheme won't work. Error if this happens -- should only
            // occur when bootstrapping a new runtime.
            Debug.error("setInterval result type is unexpected; LzTimer will fail");
    }
    p.id = id;
    var tle = this.timerList[d];
    if (tle == null) {
        this.timerList[d] = id;
    } else if (! (tle instanceof Array)) {
        this.timerList[d] = [tle, id];
    } else {
        tle.push(id);
    }
    return id;
}

//-----------------------------------------------------------------------------
// Removes the first timer that calls the given delegate from the timerlist.
//
// @param LzDelegate d: The delegate called by the timer to be removed. If there
// are multiple timerList entries that call delegate d, removes the first in the
// order received.
//-----------------------------------------------------------------------------
LzTimer.removeTimer = function ( d ){
    var tle = this.timerList[d];
    var id = null;
    if (tle != null) {
        if (tle instanceof Array) {
            id = tle.shift();
            clearInterval(id);
            if (tle.length == 0)
                delete this.timerList[d];
        } else {
            id = tle;
            clearInterval(id);
            delete this.timerList[d];
        }
        // Debug.format("cleared timer %w for delegate %w (2)\n", id, d);
    }
    return id;
}

//-----------------------------------------------------------------------------
// Removes the timer with the given id that calls the given delegate from the 
// timerlist.
//
// @param LzDelegate d: The delegate called by the timer to be removed.
// @param id: the id of the timer to remove.
// @keywords private
//-----------------------------------------------------------------------------
LzTimer.removeTimerWithID = function ( d, id ){
    var tle = this.timerList[d];
    if (tle != null) {
        if (tle instanceof Array) {
            var i = 0;
            for (i=0; i<tle.length; i++) {
                var id2 = tle[i];
                if (id2 == id) {
                    clearInterval(id);
                    tle.splice(i,1);
                    break;
                }
            }
            if (tle.length == 0)
                delete this.timerList[d];
        } else if (tle == id) {
            clearInterval(id);
            delete this.timerList[d];
        }
    }
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
    return this.addTimer( d , milisecs );
}

if ($debug) {
  LzTimer.countTimers = function ( d ){
    var tle = this.timerList[d];
    if (tle == null)
        return 0;
    else if (tle instanceof Array)
        return tle.length;
    else
        return 1;
  }
}