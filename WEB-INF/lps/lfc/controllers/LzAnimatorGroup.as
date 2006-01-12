/******************************************************************************
 * LaszloLayout.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzAnimatorGroup
// This object groups a number of animators together and processes them
// according to a specified sequence.
//
// @keywords public
//
//=============================================================================
var LzAnimatorGroup = Class( "LzAnimatorGroup" , LzNode );

//animators ignore placement by default
LzAnimatorGroup.prototype.defaultattrs.ignoreplacement = true;
LzAnimatorGroup.prototype.defaultattrs.start = true;

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.construct = function ( parent, args ) {

    super.construct( parent , args );

    // @field String process: "simultaneous" or none  means process animators
    // simultaneously "sequential" means process animators
    // sequentially;

    if ( (this.immediateparent) instanceof ( _root.LzAnimatorGroup ) ){
        for ( var k in this.animatorProps ){
            if ( args[ k ] == null ){
                args[ k ] = this.immediateparent[ k ] ;
            }
        }
        if ( this.immediateparent.animators == null ){
            this.immediateparent.animators = [ this ];
        } else {
            this.immediateparent.animators.push( this );
        }
        args.start = this._ignoreAttribute;
    } else {
        // initialize target to immediateparent, may be set later by attribute
        this.target = this.immediateparent;
    }

    this.updateDel = new _root.LzDelegate( this , "update" );
}

//@field undocumented ease: The motion for the animator.
LzAnimatorGroup.prototype.setters.ease = "setEase";

//@field Boolean start: If true, the animator will call start.
LzAnimatorGroup.prototype.setters.start = "setStart";

//@field reference target: the object to animate
LzAnimatorGroup.prototype.setters.target = "setTarget";

//@field Boolean paused: If true, the running animator will pause. If false
//it will resume
LzAnimatorGroup.prototype.setters.paused = "pause";

//LzAnimatorGroup.prototype.setters.view = "defaultSet";
//LzAnimatorGroup.prototype.setters.process = "defaultSet";
//LzAnimatorGroup.prototype.setters.repeat = "defaultSet";

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.init = function (  ){
    if ( this.started ) this.doStart();
    super.init();
}

//------------------------------------------------------------------------------
// setter for the target attribute
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.setTarget = function ( new_target ){
    this.target = new_target;
    var nodes = this.subnodes;
    for (var i=0; i < nodes.length; i++) {
        if ((nodes[i]) instanceof ( _root.LzAnimatorGroup )) {
            nodes[i].setTarget(new_target);
        }
    }
    this.ontarget.sendEvent( new_target );
}

//------------------------------------------------------------------------------
// setter for the start attribute
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.setStart = function ( start ){
    //@field Boolean started: Value of the animator's start attribute.
    this.started = start;
    this.onstarted.sendEvent( start );
    if ( !this.isinited ){
        return;
    }

    if ( start ) {
        this.doStart();
    } else {
        this.stop();
    }

}

//------------------------------------------------------------------------------
// called to set starting flags and values, send onstart event, and register
// animator for processing on the main idle loop.
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.doStart = function (){

    if ( this.isactive ) return false;

    // update the views counter of animation currently executing
    //this.target.anmExecuteCount += 1;

    //@field LzEvent onstart: Sent when the animator starts. This event
    // is sent multiple times if the animator repeats.
    this.onstart.sendEvent( getTimer() );
    //this is a bug -- embedded animators won't send onstart

    this.isactive = true;

    // store a copy of repeat for decrementing after each iteration
    this.crepeat = this.repeat;

    this.prepareStart();
    this.updateDel.register( _root.LzIdle , "onidle" );
    return true;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.start = function ( ){
    if ( $debug ){
        _root.Debug.write( 'Animator start() is deprecated.' +
                           'Use animator doStart() instead.' );
    }

    this.doStart();
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.prepareStart = function ( ){
    for ( var i = this.animators.length-1; i >=0 ; i-- ){
        this.animators[ i ].notstarted = true;
        //this.animators[ i ].prepareStart();
    }
    this.actAnim = this.animators.concat();
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.resetAnimator = function ( ){
     this.actAnim = this.animators.concat();
    // this.prepareStart();
    for ( var i = this.animators.length-1; i >=0 ; i-- ){
       this.animators[ i ].needsrestart = true;
       //this.animators[ i ].resetAnimator();
    }

}


//-----------------------------------------------------------------------------
// in order to repeat an animtorGroup its animators cannot be deleted from the
// animator array.
//
// @keywords private
//
// @param time: the time assigned to this iteration of the animator. this time
// value ( in milliseconds) is set by the animation queue and then passed
// onto to every animator to ensure that all animators are synched to the same
// value.
// @return a boolean indicating if all of the animations within
// this group are done.
//-----------------------------------------------------------------------------
LzAnimatorGroup.prototype.update = function( time ) {
    var animend = this.process == "simultaneous" ? this.actAnim.length -1 : 0;
    if ( this.paused ) {
        return;
    }

    for (var i = animend; i >= 0 ; i-- ) {
        var a = this.actAnim[i];
        //if ( this.process == "simultaneous" ) _root.Debug.write( "call " + a );
        if (a.notstarted) {
            a.prepareStart();
            a.notstarted = false;
        } else if (a.needsrestart) {
            a.resetAnimator();
            a.needsrestart = false;
        }

        if ( a.update( time ) ) {
             //a.stop(); //OK?
            this.actAnim.splice( i, 1 );
        }

    }
    //if ( this.process == "simultaneous" ) _root.Debug.write( "done this round" );

    if ( ! this.actAnim.length ) {
        return this.checkRepeat();
    }
    return false;
}

//------------------------------------------------------------------------------
// Temporarily pauses or restarts the animator
// @param Boolean dop: If true, pauses the animator. If false, unpauses the
// animator. If null, toggles the paused state of the animator.
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.pause = function ( dop ){
    if ( dop == null ){
        dop = !this.paused;
    }

    if ( this.paused && ! dop ){
        this.__LZaddToStartTime( getTimer() - this.__LZpauseTime );
    } else if (! this.paused && dop ){
        this.__LZpauseTime = getTimer();
    }

    this.paused = dop;
    this.onpaused.sendEvent( dop );
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzAnimatorGroup.prototype.__LZaddToStartTime = function( ptime ) {
    this.startTime += ptime;
    for ( var i = 0 ; i < this.actAnim.length ; i++ ){
        this.actAnim[ i ].__LZaddToStartTime( ptime );
    }
}
//-----------------------------------------------------------------------------
// Stop is called when the animation is complete, or when the animator is
// destroyed. It can also be called to halt a running animation.
//-----------------------------------------------------------------------------
LzAnimatorGroup.prototype.stop = function( ) {

    //need to stop any running animators

    var animend = this.process == "simultaneous" ? this.actAnim.length -1 : 0;

    for (var i = animend; i >= 0 ; i-- ) {
        this.actAnim[i].stop();
    }

    this.__LZhalt();
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.__LZfinalizeAnim = function (){
    this.__LZhalt();
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.__LZhalt = function (){
    this.isactive = false;
    //unreg for update event
    this.updateDel.unregisterAll();
    //@field undocumented onfinish: Use of 'onfinish' event
    //is deprecated. Use 'onstop' event instead.
    this.onfinish.sendEvent( this );
    //@field LzEvent onstop: Event sent when the animator finishes.
    this.onstop.sendEvent( time );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.checkRepeat = function (){
    if ( this.crepeat == null || this.crepeat == 1) {
        this.__LZfinalizeAnim();
        return true;
    }

    if ( this.crepeat > 0 ) {
        this.crepeat--;
        //@field LzEvent onrepeat: Event sent at the beginning of each new
        //repeat.
        this.onrepeat.sendEvent( time );
    }
    //this.prepareStart();
    this.resetAnimator();
}

LzAnimatorGroup.prototype.animatorProps = { attribute : true, from : true ,
                                            duration : true , to : true ,
                                            relative : true , target : true}
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.destroy = function(  ) {
    this.stop();
    this.updateDel.unregisterAll();
    this.animators = null;
    this.actAnim = null;

    if ( this.parent.animators.length ){
        for ( var i = 0 ; i < this.parent.animators.length ; i++ ){
            if ( this.parent.animators[ i ] == this ){
                this.parent.animators.splice( i , 1 );
                break
            }
        }

        for ( var i = 0 ; i < this.parent.actAnim.length ; i++ ){
            if ( this.parent.actAnim[ i ] == this ){
                this.parent.actAnim.splice( i , 1 );
                break
            }
        }
    }

    super.destroy( );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzAnimatorGroup.prototype.toString = function(  ) {
    return "GroupAnimator length = " + this.animators.length;
}
