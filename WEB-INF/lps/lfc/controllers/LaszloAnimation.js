/**
  * LaszloAnimations.as 
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  * @affects animation lzanimator
  * @access public
  * @topic LFC
  * @subtopic Controllers
  */

/**
  * LzAnimator
  * <p>Animators change the value of an object's attribute over a
  * specified duration in milliseconds. For example, the following program
  * defines an animator for a window that moves it to a position of x=100
  * over 1 second (1000 milliseconds).</p>
  * 
  * <example><programlisting class="code" extract="false">
  * &lt;canvas>
  *   &lt;window>
  *     &lt;animator attribute="x" to="100" duration="1000"/>
  *   &lt;/window>
  * &lt;/canvas>
  * </programlisting></example>
  * 
  * <p>See the <a href="${dguide}animation.html">Guide</a> for a complete discussion of
  * animators and animation in Laszlo applications.</p>
  *
  * @lzxname animator
  * @shortdesc Changes the value of another object's attribute over time.
  * @see animatorgroup
  */
class LzAnimator extends LzAnimatorGroup {

/** @access private
  * @modifiers override 
  */
  static var tagname = 'animator';

    static var getters = new LzInheritedHash(LzAnimatorGroup.getters);
    static var defaultattrs = new LzInheritedHash(LzAnimatorGroup.defaultattrs);
    static var options = new LzInheritedHash(LzAnimatorGroup.options);
    static var setters = new LzInheritedHash(LzAnimatorGroup.setters);
    static var __LZdelayedSetters:* = new LzInheritedHash(LzAnimatorGroup.__LZdelayedSetters);
    static var earlySetters:* = new LzInheritedHash(LzAnimatorGroup.earlySetters);

    function LzAnimator ( parent:* , attrs:* , children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
        this.calcMethod = this.calcNextValue;
    }

    var calcMethod:Function;

    var lastIterationTime:Number;
    var currentValue:Number;
    var beginPole:Number;
    var endPole:Number;

    var doBegin:Boolean;

    var beginPoleDelta:Number = .25;
    var endPoleDelta:Number = .25;

    var primary_K:Number;
    var origto:Number;
    
//setters.from = "defaultSet";
//setters.to = "defaultSet";
//setters.duration = "defaultSet";
//setters.attribute = "defaultSet";
//setters.relative = "defaultSet";

/**
  * The style of motion to use for the animator. This
  * is one of "linear", "easin" , "easeout" , and "easeboth". The default
  * is "easeboth"
  *
  * @type String
  */
LzAnimator.setters.motion = "setMotion";

/**
  * The destination value for the animator.
  *
  * @type Number
  */
LzAnimator.setters.to = "setTo";


/**
  * @access private
  */
override function construct ( parent , args ){
    super.construct.apply(this, arguments);
    this.primary_K          = 1.0;
}

/**
  * Sets the motion style for the animator.
  * @param String eparam: One of "easein", "easeout" , "linear" or "easeboth"
  * to describe how the animator accelerates and decelerates. The default is
  * "easeboth".
  */
    function setMotion ( eparam, ignoreme=null ){
    //easin, easeout , linear , easeboth (default)
    if ( eparam == "linear" ){
        this.calcMethod = this.calcNextValueLinear;
    } else {
        this.calcMethod = this.calcNextValue;
        if ( eparam == "easeout" ){
            this.beginPoleDelta = 100;
        } else if ( eparam == "easein" ){
            this.endPoleDelta = 15;
        }
    }
}

/**
  * Sets the destination value for the animator
  * @param Number eparam: The destination value for the animator.
  */
    function setTo ( eparam, ignoreme=null ){
    this.origto = Number(eparam);
}


/**
  * Calculate the control values  fro the animation. These will not change even
  * if the animation is repeated.
  *
  * @access private
  */
function calcControlValues ( cval  = null){
    // reset currentValue
    this.currentValue = cval || 0;

    // create direction multiplier
    var dir = this.indirect ? -1 : 1;

    // set beginPole and endPole values
    if ( this.currentValue < this.to ) {
        this.beginPole = this.currentValue - dir*this.beginPoleDelta;
        this.endPole = this.to + dir*this.endPoleDelta;
    }else{
        this.beginPole = this.currentValue + dir*this.beginPoleDelta;
        this.endPole = this.to - dir*this.endPoleDelta;
    }

    // calculate value for primary_K
    // a default value of 1.0 means the attribute will be static, i.e.
    // the animation will still be calculated but the result will
    // always be the same.
    this.primary_K = 1.0;

    var kN = 1.0*(this.beginPole - this.to )*
                 (this.currentValue - this.endPole);

    var kD = 1.0*(this.beginPole - this.currentValue)*
                 (this.to - this.endPole);

    // NOTE: in future this should probaly check for really small amounts not
    // just zero
    if (kD != 0) this.primary_K = Math.abs(kN/kD);

}


/**
  * this is called once to set any starting values that will only need to be
  * calculated once even if the animator repeats
  *
  * BRET'S NOTE:  this.target.setAttribute( this.attribute , this.from ); not true if relative
  * if doStart is called while animator is active, just return
  * else if a "from" value has been specified then this
  * Here is where the expected value for a view should be updated
  *
  * @access private
  */
override function doStart (){
    if ( this.isactive ) return;
    this.isactive = true;

    this.prepareStart();

    // give this animator processing time by registering it with LzIdle service
    this.updateDel.register( LzIdle , "onidle" );
}


/**
  * @access private
  */
override function prepareStart ( ){
    // create a "repeat" counter to be decremented each time after the
    // animator finishes a cycle.
    this.crepeat = this.repeat;


    // Set the attribute of the view to its "from" value but make sure
    // expectedAttribute is updated.
    if ( this.from != null ){
        this.target.setAttribute( this.attribute , Number( this.from ) );
    }

    if ( this.relative ) {
        this.to = this.origto;
    }else{
        this.to = this.origto - this.target.getExpectedAttribute(this.attribute);

        // "to" has changed so calc new poles and K value
        //this.calcControlValues();
    }

    // update the expected attribute for this view so that animators attached
    // after this one will can execute appropriately.
    this.target.addToExpectedAttribute( this.attribute,this.to );

    // everytime an animator is started, a counter associated with that property
    // is incremented. When this counter is decremented and reaches zero then
    // the final expected value will be assigned to that attribute
    this.target.__LZincrementCounter(this.attribute);


    // set current to zero since all animators are now relative
    this.currentValue = 0;

    //we already did this if !this.relative -- conditionalize?
    this.calcControlValues();

    this.doBegin = true;

}

/**
  * reset the time variables and currentValue
  * @access private
  */
override function resetAnimator() {
    // Set the attribute of the view to its "from" value but make sure
    // expectedAttribute is updated.
    if ( this.from != null ){
        this.target.setAttribute( this.attribute , this.from );
        var d = this.from - this.target.getExpectedAttribute( this.attribute );
        this.target.addToExpectedAttribute(this.attribute,d);
    }

    if (!this.relative) {
        this.to = this.origto - this.target.getExpectedAttribute( this.attribute );
        // "to" has changed so calc new poles and K value
        this.calcControlValues();
    }

    // update the expected attribute for this view so that animators attached
    // after this one will can execute appropriately.
    this.target.addToExpectedAttribute(this.attribute,this.to);
    this.target.__LZincrementCounter(this.attribute);

    // set current to zero since all animators are now relative
    this.currentValue = 0;

    this.doBegin = true;
}


/**
  * beginAnimator is called on the first iteration of the animator.
  *
  * @access private
  *
  * @param Number time: the time in milliseconds that this animator will
  * be assigned as its beginning time.
  */
function beginAnimator( time ) {

    // set initial time parameters
    this.startTime = time;
    this.lastIterationTime = time;

    if (this.onstart.ready) this.onstart.sendEvent( time );

    //Set to false so next update does not call this function
    this.doBegin = false;


}

/**
  * @access private
  */
override function stop( ) {
    if ( !this.isactive ) return;

    var e_prop = "e_" +  this.attribute;
    if (!this.target[e_prop].c) { this.target[e_prop].c = 0; }
    this.target[e_prop].c--; //decrement animation counter for prop
    if ( this.target[e_prop].c <= 0 ){
        this.target[e_prop].c = 0;
        this.target[e_prop].v = null;
    } else {
        this.target[e_prop].v -= this.to - this.currentValue;
    }

    this.__LZhalt();
}

/**
  * @access private
  */
override function __LZfinalizeAnim( ) {
    var e_prop = "e_" +  this.attribute;
    if (!this.target[e_prop].c) { this.target[e_prop].c = 0; }
    this.target[e_prop].c -= 1; //decrement animation counter for prop

    if ( this.target[e_prop].c <= 0 ){
        this.target[e_prop].c = 0;
        this.target.setAttribute( this.attribute,this.target[e_prop].v);
        this.target[e_prop].v = null;
    }

    this.__LZhalt();
}

/**
  * This method calculates the next value of the parameter being animated. This
  * method can be used by any Animator object that inherits from LzAnimator, as
  * long as the parameter is a scalar value (i.e. a number instead of a point).
  *
  * @access private
  *
  * @param timeDifference: the time difference in milliseconds from the start
  * of the animation.
  * @return nextValue: the next value in the animations iteration sequence
  */
function calcNextValue( timeDifference ) {
    // return the currentValue by default
    var nextValue  = this.currentValue;

    // create local references
    var aEndPole   = this.endPole;
    var aBeginPole = this.beginPole;

    // calculate new "K" value based on time difference
    var K = Math.exp((timeDifference*1.0/this.duration)*
                      Math.log(this.primary_K));

    // calculate nextValue using the pole and new K value
    if( K != 1.0 ) {
       var aNumerator   = aBeginPole*aEndPole*(1 - K);
       var aDenominator = aEndPole - K*aBeginPole;
       if( aDenominator != 0.0 ) nextValue = aNumerator/aDenominator;
    }
    return nextValue;
}



/**
  * This method replaces the nonlinear calcNextValue when motion is set to linear
  *
  * @access private
  */
function calcNextValueLinear( timeDifference ) {
    var elapsed = timeDifference/this.duration;
    return elapsed*this.to;
}

/**
  * This is one of the core methods of an LzAnimator object. This method gets
  * called to iterate the animation only once and then sets the property of the
  * associated view.
  *
  * @access private
  *
  * @param time: the time assigned to this iteration of the animator. this time
  * value ( in milliseconds) is set by the animation queue and then passed
  * onto to every animator to ensure that all animators are synched to the same
  * value.
  * @return animatorIsDone: a boolean indicating if the animation is complete
  */
public override function update( time ) {
    var animatorIsDone = false;

    // If this is its first iteration then calc the necessary paramters.
    // Calling this function here allows animators to be added to a queue at
    // different times and then "synced" at start of execution, i.e. next onIdle
    // event.
    if ( this.doBegin ) {
        this.beginAnimator( time );
    } else {
        if ( !this.paused ) {
            var aTotalTimeDifference = time - this.startTime;
            if ( aTotalTimeDifference < this.duration ) {
                this.setValue( this.calcMethod( aTotalTimeDifference ));
                this.lastIterationTime = time;
            } else {
                this.setValue( this.to );
                return this.checkRepeat();
            }
         }
    }
}

/**
  * sets the property specified in the binding to the <b>value</b>
  *
  * @access private
  *
  * @param value: to the value to be assigned
  */
    function setValue( value , ignoreme=null) {
    // All animators are now relative at the core so add the difference
    // of this value - the current value to the view's attribute.
    var aDiff = value - this.currentValue;
    if (this.target.setAttribute) {
        //Debug.info('setValue', value, this.target);
        this.target.setAttribute( this.attribute, this.target[this.attribute] + aDiff );
    }
    this.currentValue = value;
}


/**
  * @access private
  */
override function toString(){
    return "Animator for " + this.target + " attribute:" + this.attribute + " to:" + this.to;
}

} // End of LzAnimator


ConstructorMap[LzAnimator.tagname] = LzAnimator;
