/**
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects animation lzanimatorgroup
  * @topic LFC
  * @subtopic Controllers
  * @access public
  */

/**
  * <p>An <classname>LzAnimatorGroup</classname> wraps several
  * <classname>LzAnimator</classname>s, and runs them in sequence or
  * simultaneously . As an example, the code below animates a view first
  * along the x-axis and then the y.</p>
  *   
  * <example extract="false"><programlisting>
  * &lt;canvas&gt;
  *   &lt;view bgcolor="red" width="100" height="100"&gt;
  *     &lt;animatorgroup process="sequential"&gt;
  *       &lt;animator attribute="x" to="100" duration="1000"/&gt;
  *       &lt;animator attribute="y" to="100" duration="1000"/&gt;
  *     &lt;/animatorgroup&gt;
  *   &lt;/view&gt;
  * &lt;/canvas&gt;
  * </programlisting></example>
  * 
  * <p>Any attribute that is legal in <tagname>animator</tagname> is legal
  * in <tagname>animatorgroup</tagname>. These attributes are then
  * cascaded to the animators contained within.</p>
  * 
  * <p>Events (such as <event>onstart</event>, <event>onstop</event>,
  * etc.) and the <attribute>name</attribute> and
  * <attribute>id</attribute> attributes, however, are not cascaded.
  * Also, <attribute>start</attribute> defined at the group level is
  * effectively cascaded to the animators, meaning that the start
  * attribute is ignored in the animators themselves.</p>
  * 
  * @lzxname animatorgroup
  * @shortdesc Coordinates the behavior of several animators.
  * @see LzAnimator
  *
  */
class LzAnimatorGroup extends LzNode {

/** @access private
  * @modifiers override 
  */
  static var tagname = 'animatorgroup';

    static var getters = new LzInheritedHash(LzNode.getters);
    static var defaultattrs = new LzInheritedHash(LzNode.defaultattrs);
    static var options = new LzInheritedHash(LzNode.options);
    static var setters = new LzInheritedHash(LzNode.setters);
    static var __LZdelayedSetters:* = new LzInheritedHash(LzNode.__LZdelayedSetters);
    static var earlySetters:* = new LzInheritedHash(LzNode.earlySetters);

  /** The name of the attribute whose value is animated.  This
    * attribute is required on an animator, unless the animator is
    * inside an animatorgroup that specifies an attribute.
    *
    * @type String
    * @lzxtype token
    */
  var attribute;

    var updateDel;
    var crepeat;
    var animators;
    var startTime;
    var __LZpauseTime;
    var actAnim;


    function LzAnimatorGroup ( parent:* , attrs:* , children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
    }  


  /** Whether to start the animation instantly (the default),
    * or wait for a script command.
    *
    * @type Boolean
    * @lzxtype boolean
    * @lzxdefault "true"
    */
  var start = true;
    LzAnimatorGroup.setters.start = "setStart";
    LzAnimatorGroup.defaultattrs.start = true;
  
  /** The start value for the animation.  Defaults to the
    * targeted attribute's current value.
    * @type Number
    * @lzxtype number
    */
  var from;
  
  /** The final value for the targeted attribute.
    *
    * @type Number
    * @lzxtype number
    */
  var to;
  
  /** The duration of the animation, in milliseconds (1000 = 1 second).
    *
    * @type Number
    * @lzxtype xsd:float {minInclusive="0"} | constraint
    */
  var duration;

  LzAnimatorGroup.setters.duration = "setDuration";
  
  /** 
    * @type Boolean
    * @lzxtype boolean
    * @since 1.1
    */
  var indirect = false;
  
  /** Whether the to value is relative to the initial value of the
    * attribute (<constant>true</constant>), or is absolute (<constant>false</constant>).
    *
    * @type Boolean
    * @lzxtype boolean
    * @lzxdefault "false"
    */
  var relative = false;
  
  /** One of "linear" | "easein" | "easeout" | "easeboth"
    * @type String
    * @lzxtype token
    */
  var motion = "easeboth";
  
  /** The number of times to repeat the animation.  This should be a
    * positive integer, or 'Infinity'.  Changes to the repeat value
    * take effect, after the animation is finished and then restarted.
    *
    * @type Object
    * @lzxtype expression
    * @since 1.1
    */
  var repeat;
  // LzAnimatorGroup.setters.repeat = "defaultSet";
  
  /** The paused state of the animator. If true, the animator will stop. When
    * changed to false, the animator will resume from its current location.
    *
    * @type Boolean
    * @lzxtype boolean
    * @lzxdefault "false"
    */
  var paused = false;

  /** Value of the animator's start attribute.
    *
    * @type Boolean
    */
  var started;
  
  /** the object for which an attribute will be animated (by default, this
    * is the immediateParent)
    *
    * @type String
    * @lzxtype reference
    */
  var target;
  
  /** <dl><dt>"simultaneous" or none</dt><dd>means process animators
    * simultaneously</dd>
    * <dt>"sequential"</dt><dd>means process animators
    * sequentially;</dd></dl>
    *
    * Animators other than animatorgroups ignore this attribute
    *
    * @type string
    */
  var process = "sequential";
  // LzAnimatorGroup.setters.process = "defaultSet";
  
  /** The object to animate 
    *
    * @type string
    */

  LzAnimatorGroup.setters.target = "setTarget";

  /** If true, the running animator will pause. If false
    * it will resume
    *
    * @type boolean 
    */


  LzAnimatorGroup.setters.paused = "pause";


//LzAnimatorGroup.setters.view = "defaultSet";

/** The active-state of the animator. If true, the animator is currently processing its animation.
   * This field is read-only.
   *
   * @type Boolean
   * @lzxtype boolean
   * @modifier read-only
   */
  var isactive = false;
/** @lzxtype event */
var ontarget = LzDeclaredEvent;
/** @lzxtype event */
var onduration = LzDeclaredEvent;
/** @lzxtype event */
var onstarted = LzDeclaredEvent;

/** Executed when the animator starts.  This code is executed
  * multiple times if the animator repeats.
  * @lzxtype event
  */
var onstart = LzDeclaredEvent;
/** @lzxtype event */
var onpaused = LzDeclaredEvent;

/** Use of 'onfinish' event
  * is deprecated. Use 'onstop' event instead.
  * @keywords deprecated
  * @lzxtype event
  */
var onfinish = LzDeclaredEvent;

/** Executed when the animator finishes.
  * @lzxtype event
  */
var onstop = LzDeclaredEvent;

/** Event sent at the beginning of each new repeat. 
  * @lzxtype event 
  */
var onrepeat = LzDeclaredEvent;

var animatorProps = { attribute : true, from : true ,
                      duration : true , to : true ,
                      relative : true , target : true}

/** animators ignore placement by default 
  *
  * @modifiers override
  */
LzAnimatorGroup.defaultattrs.ignoreplacement = true;


/**
  * @access private
  */
override function construct ( parent, args ) {

    super.construct.apply(this, arguments);

    if ( (this.immediateparent) is ( LzAnimatorGroup ) ){
        for ( var k in this.animatorProps ){
            if ( args[ k ] == null ){
                args[ k ] = this.immediateparent[ k ] ;
            }
        }
        if ( (LzView(this.immediateparent)).animators == null ){
            (LzView(this.immediateparent)).animators = [ this ];
        } else {
            (LzView(this.immediateparent)).animators.push( this );
        }
        args.start = LzNode._ignoreAttribute;
    } else {
        // initialize target to immediateparent, may be set later by attribute
        this.target = this.immediateparent;
    }

    if (! this.updateDel) this.updateDel = new LzDelegate( this , "update" );
}

/**
  * @access private
  */
override function init ( ) {
    if (! this.target) this.target = this.immediateparent;
    if ( this.started ) this.doStart();
    super.init.apply(this, arguments);
}

/**
  * setter for the target attribute
  */
    function setTarget ( new_target , ignoreme=null){
    this.target = new_target;
    var nodes = this.subnodes;
    if (nodes) {
        for (var i=0; i < nodes.length; i++) {
            if ((nodes[i]) is ( LzAnimatorGroup )) {
                nodes[i].setTarget(new_target);
            }
        }
    }
    if (this.ontarget.ready) this.ontarget.sendEvent( new_target );
}

/**
  * setter for the start attribute
  * @access private
  */
    function setStart ( start, ignoreme=null ){
    this.started = start;
    if (this.onstarted.ready) this.onstarted.sendEvent( start );
    if ( !this.isinited ){
        return;
    }

    if ( start ) {
        this.doStart();
    } else {
        this.stop();
    }

}

/**
  * called to set starting flags and values, send onstart event, and register
  * animator for processing on the main idle loop.
  */
function doStart (){
    if ( this.isactive ) return false;

    // update the views counter of animation currently executing
    //this.target.anmExecuteCount += 1;

    //Debug.info('doStart', start);
    if (this.onstart.ready) this.onstart.sendEvent( (new Date()).getTime() );
    //this is a bug -- embedded animators won't send onstart

    this.isactive = true;

    // store a copy of repeat for decrementing after each iteration
    this.crepeat = this.repeat;

    this.prepareStart();
    this.updateDel.register( LzIdle , "onidle" );
    return true;
}

/**
  * @access private
  */
function prepareStart ( ){
    for ( var i = this.animators.length-1; i >=0 ; i-- ){
        this.animators[ i ].notstarted = true;
        //this.animators[ i ].prepareStart();
    }
    this.actAnim = this.animators.concat();
}

/**
  * @access private
  */
function resetAnimator ( ){
     this.actAnim = this.animators.concat();
    // this.prepareStart();
    for ( var i = this.animators.length-1; i >=0 ; i-- ){
       this.animators[ i ].needsrestart = true;
       //this.animators[ i ].resetAnimator();
    }

}


/**
  * in order to repeat an animtorGroup its animators cannot be deleted from the
  * animator array.
  *
  * @access private
  *
  * @param time: the time assigned to this iteration of the animator. this time
  * value ( in milliseconds) is set by the animation queue and then passed
  * onto to every animator to ensure that all animators are synched to the same
  * value.
  * @return a boolean indicating if all of the animations within
  * this group are done.
  */
public function update( time ) {
    var animend = this.actAnim.length -1;
    if (animend > 0 && this.process == "sequential")
        animend = 0;

    if ( this.paused ) {
        return;
    }

    for (var i = animend; i >= 0 ; i-- ) {
        var a = this.actAnim[i];
        //if ( this.process == "simultaneous" ) Debug.write( "call " + a );
        if (a.notstarted) {
            a.isactive = true;
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
    //if ( this.process == "simultaneous" ) Debug.write( "done this round" );

    if ( ! this.actAnim.length ) {
        return this.checkRepeat();
    }
    return false;
}

/**
  * Temporarily pauses or restarts the animator
  * @param Boolean dop: If true, pauses the animator. If false, unpauses the
  * animator. If null, toggles the paused state of the animator.
  */
    function pause ( dop, ignoreme=null ){
    if ( dop == null ){
        dop = !this.paused;
    }

    if ( this.paused && ! dop ){
        this.__LZaddToStartTime( ((new Date()).getTime()) - this.__LZpauseTime );
    } else if (! this.paused && dop ){
        this.__LZpauseTime = ((new Date()).getTime());
    }

    this.paused = dop;
    if (this.onpaused.ready) this.onpaused.sendEvent( dop );
}

/**
  * @access private
  */
function __LZaddToStartTime( ptime ) {
    this.startTime += ptime;
    for ( var i = 0 ; i < this.actAnim.length ; i++ ){
        this.actAnim[ i ].__LZaddToStartTime( ptime );
    }
}

/**
  * Stop is called when the animation is complete, or when the animator is
  * destroyed. It can also be called to halt a running animation.
  */
function stop( ) {

    //need to stop any running animators
    if (this.actAnim) {
        var animend = this.actAnim.length -1;
        if (animend > 0 && this.process == "sequential")
            animend = 0;

        for (var i = animend; i >= 0 ; i-- ) {
            this.actAnim[i].stop();
        }
    }

    this.__LZhalt();
}

    function setDuration(duration, ignoreme=null){
    if(isNaN(duration) || duration == null){
        duration = 0;
    } else if(typeof(duration) == "string"){
        duration = Number(duration);
    }
    this.duration = duration;
    if(!(this is LzAnimator)){
        var sn = this.subnodes;
        if(sn){
            for(var i = 0; i < sn.length; ++i){
                if(sn[i] is LzAnimatorGroup){
                    sn[i].setDuration(duration);
                }
            }
        }
    }
    this.onduration.sendEvent(duration);
}

/**
  * @access private
  */
function __LZfinalizeAnim (){
    this.__LZhalt();
}

/**
  * @access private
  */
function __LZhalt (){
    this.isactive = false;
    //unreg for update event
    this.updateDel.unregisterAll();
    if (this.onfinish.ready) this.onfinish.sendEvent( this );
    if (this.onstop.ready) this.onstop.sendEvent( (new Date()).getTime() );
}

/**
  * @access private
  */
function checkRepeat (){
    if ( this.crepeat == null || this.crepeat == 1) {
        this.__LZfinalizeAnim();
        return true;
    }

    if ( this.crepeat > 0 ) {
        this.crepeat--;
        if (this.onrepeat.ready) this.onrepeat.sendEvent( (new Date()).getTime() );
    }
    //this.prepareStart();
    this.resetAnimator();
}

/**
  * @access private
  */
override function destroy(  recursiveCall = null) {
    this.stop();
    this.updateDel.unregisterAll();
    this.animators = null;
    this.actAnim = null;
    var anims:Array = LzView(this.parent).animators;


    if ( anims && anims.length ){
        for ( var i = 0 ; i < anims.length ; i++ ){
            if ( anims[ i ] == this ){
                anims.splice( i , 1 );
                break
            }
        }

        var pactAnim = LzAnimatorGroup(this.parent).actAnim;

        for ( var i = 0 ; i < pactAnim.length ; i++ ){
            if ( pactAnim[ i ] == this ){
                pactAnim.splice( i , 1 );
                break
            }
        }
    }

    super.destroy.apply(this, arguments);
}

/**
  * @access private
  */
override function toString(  ) {
    return "GroupAnimator length = " + this.animators.length;
}

} // End of LzAnimatorGroup

ConstructorMap[LzAnimatorGroup.tagname] = LzAnimatorGroup;
