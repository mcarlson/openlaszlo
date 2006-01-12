/******************************************************************************
 * LzTrack.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// <p>This service enables mouse tracking over a group of views.</p>
// @event onmousetrackover:  sent when the mouse is over a view that is registered to
// an active track group
// @event onmousetrackout:  sent when the mouse is leaves the visible area of a view
// that was previously sent an 'ontrackover' event
// @event onmousetrackup:  sent when the mouse button is released over a view that
// is registered to an active track group
//=============================================================================
LzTrack = new Object;
LzTrack.__LZreg = new Object; // list of registered views (that will be tracked)
LzTrack.__LZactivegroups = null;
LzTrack.__LZtrackDel = new LzDelegate( LzTrack , "__LZtrack" );// called on idle
LzTrack.__LZoptimizeforaxis = 'x';
//-----------------------------------------------------------------------------
// register a view to be tracked for a particular track group
// @param LzView v: a reference to the view to add to the track group
// @param String group: the name of the track group
//-----------------------------------------------------------------------------
// should we create a bounding rect for the views, or instead register a view
// as a groups bounding rect.
LzTrack.register = function ( v, group ){
    if (typeof(this.__LZreg[group]) == "undefined") {
         this.__LZreg[group] = [];
          // __LZlasthit means that onmousedownover has been sent to this view,
          // but not onmousedownout
         this.__LZreg[group].__LZlasthit = 0;
    }
    this.__LZreg[group].push( v );

    // register for when the view is destroyed, so we can clean up after
    if (!this.__LZdestroydel) {
       this.__LZdestroydel = new _root.LzDelegate( this, "__LZdestroyitem" );
    }
    this.__LZdestroydel.register(v, "ondestroy");
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzTrack.unregister = function ( v, group ){
    var reglist = this.__LZreg[group];
    for (var i = 0; i < reglist.length; i++) {
         if (reglist[i] == v) {
            reglist.splice(i, 1);
         }
    }
    // Remove empty groups
    if (reglist.length == 0) {
        delete this.__LZreg[group];
    }
    this.__LZdestroydel.unregisterFrom(v.ondestroy);
}

//-----------------------------------------------------------------------------
// called when a registered view is destroyed.  We need to remove it from
// all track groups, so we don't leak memory
// @keywords private
//-----------------------------------------------------------------------------
LzTrack.__LZdestroyitem = function (v){
    for (var i in this.__LZreg) {
        this.unregister(v, i);
    }
}
//-----------------------------------------------------------------------------
// activate tracking for a particular group. Any number of groups can be tracked
// simultaneously. This is useful for tracking mechanisms like menus.
// @param String group: the name of the track group to activate
//-----------------------------------------------------------------------------
LzTrack.activate = function ( group ){
    if (this.__LZactivegroups == null) {
        // don't want to re-register, in case we are just switching active groups
        this.__LZactivegroups = [];
        this.__LZtrackDel.register( _root.LzIdle, "onidle" );
    }
    // see if group is already active
    var found = false;
    for (var i in this.__LZactivegroups) {
        if (this.__LZactivegroups[i] == this.__LZreg[group]) found = true;
    }
    if (!found) { //group was not active so put it onto activegroups array
        this.__LZactivegroups.push(this.__LZreg[group]);
    }
}

//-----------------------------------------------------------------------------
// deactivate tracking for the currently active group
//-----------------------------------------------------------------------------
LzTrack.deactivate = function ( group ) {
    for (var i in this.__LZactivegroups) {
        if (this.__LZactivegroups[i] == this.__LZreg[group]) {
            this.__LZactivegroups.splice(i, 1);
         }
    }
    if ( this.__LZactivegroups == []) this.__LZtrackDel.unregisterAll();
    this.__LZreg[group].__LZlasthit = 0;   // should send ontrackmouseout ?
}

//-----------------------------------------------------------------------------
// @keywords private
// returns the topmost view (a or b)
//-----------------------------------------------------------------------------
LzTrack.__LZtopview = function(a, b) {
    var btemp = b; var atemp=a;
    while (atemp.nodeLevel < btemp.nodeLevel) {
        btemp = btemp.immediateparent;
        if (btemp == a)    // a is in b's parent chain
            return b;      // child is always on top
    }
    while (btemp.nodeLevel < atemp.nodeLevel) {
        atemp = atemp.immediateparent;
        if (atemp == b)    // b is in a's parent chain
            return a;      // child is always on top
    }
    // nodeLevel is equal
    while (atemp.immediateparent != btemp.immediateparent) {
        atemp = atemp.immediateparent;
        btemp = btemp.immediateparent;
    }
    // a and b are siblings, check depth
    if (atemp.depth > btemp.depth) return a;
    else return b;
}

//-----------------------------------------------------------------------------
// @keywords private
// return topmost view in an array of views
//-----------------------------------------------------------------------------
LzTrack.__LZfindTopmost = function(vlist) {
    var top = vlist[0];
    for (var i=1; i < vlist.length; i++) {
        top = this.__LZtopview(top, vlist[i]);
    }
    return top;
}


//-----------------------------------------------------------------------------
// @keywords private
// iterate through a trackgroup and add those views that are under the mouse to
// a hitlist.
//-----------------------------------------------------------------------------
LzTrack.__LZtrackgroup = function (group,hitlist) {
    //check mouse pos

    // this will be slow on vertical menus because
    // the mouse_x will intersect with all menuitems if 
    // if it intersects any menuitem. We should include
    // an optimise for axis attribute as part of a group.
    for (var i=0; i < group.length; i++) {
       var v = group[i];
       if ( v.visible ) { // dont check mouse if not visible
           var vx = v.__LZmovieClipRef._xmouse;
           if (vx > 0 && vx < v.width) {   // inside width
                var vy = v.__LZmovieClipRef._ymouse;
                if (vy > 0 && vy < v.height) {  // inside height
                    hitlist.push(v);
                }
          }
      }
    }
}


//-----------------------------------------------------------------------------
// @keywords private
// called on idle when the mouse is down, sends events to topmost view
// NOTE: it would be good to have bounding rectangles on these groups
//-----------------------------------------------------------------------------
LzTrack.__LZtrack = function ()
{
	var found = false;
	var foundviews = [];
    for ( var i in this.__LZactivegroups ) {
        var hitlist =[];
        //would love to check to see if the mouse is within a group's 
        //bounding rect. this would significantly speed up menu tracking.
        var thisgroup = this.__LZactivegroups[i];

        // build a combined hitlist from all groups
        this.__LZtrackgroup(thisgroup,hitlist);

        if ( !hitlist.length && thisgroup.__LZlasthit ) {  // over no tracked views
                thisgroup.__LZlasthit.onmousetrackout.sendEvent(thisgroup.__LZlasthit);
                thisgroup.__LZlasthit = 0;
        }  else {
            var fd = this.__LZfindTopmost(hitlist);
            if ( fd &&  fd != thisgroup.__LZlasthit ) { 
                thisgroup.__LZlasthit.onmousetrackout.sendEvent( thisgroup.__LZlasthit );
                 // save this found value so that we can send the onmousetrackover
                 // after ALL of the onmousetrackouts from all trackgroups are sent
                found = true;
                foundviews.push(fd);
                thisgroup.__LZlasthit = fd;
            }
        }
    } 
    if ( found ) {
        for (var i=0; i < foundviews.length; i++) {
            foundviews[i].onmousetrackover.sendEvent( foundviews[i] );
        }
    }
}

//-----------------------------------------------------------------------------
// @keywords private
// called before mouseup event is sent
//-----------------------------------------------------------------------------
LzTrack.__LZmouseup = function()
{
    for (var i in this.__LZactivegroups) {
        var thisgroup = this.__LZactivegroups[i];
        thisgroup.__LZlasthit.onmousetrackup.sendEvent(this.__LZlasthit);
    }
}
