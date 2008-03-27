/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzidle
  * @access public
  * @topic LFC
  * @subtopic Services
  */

/**
  * <p>The OpenLaszlo runtime generates idle events at some fixed, unspecified
  * frequency.  Here is a simple example that shows how to receive the
  * <event>onidle</event> event:</p>
  * 
  * <example>
  * &lt;canvas height="140" debug="true"&gt;
  * 
  *   &lt;attribute name="counter" value="0"/&gt;
  *   &lt;handler name="onidle" reference="LzIdle"&gt;
  *     while (counter &amp;lt; 4) {
  *       counter++;
  *       Debug.write("idling  " + counter);
  *     }
  *   &lt;/handler&gt;
  * &lt;/canvas&gt;
  * 
  * </example>
  *
  * @shortdesc Idle service.
  * @devnote This object sends an 'onidle' event when there is no synchronous script
  * running after each frame update.
  */
public class LzIdleClass {

  public var __LZdeleted:Boolean = false;
  public var __LZdeferDelegates:Boolean = false;

  var coi;
  var regNext;
  var _events = null;


var removeCOI = null;
function LzIdleClass () {
  // Create array on instance, not prototype
  this.coi = new Array;
  this.removeCOI = new LzDelegate( this , "removeCallIdleDelegates" );
}


/**
  * Calls the given delegate at the next idle event. This can be used for a non-
  * recursive callback.
  * @param LzDelegate d: The delegate to be called on the next idle event.
  */
function callOnIdle ( d ){
    this.coi.push(d);
    if (!('regNext' in this && this.regNext) ){
        this.regNext = true;
        this.removeCOI.register( this , "onidle" );
    }
}

/**
  * @access private
  */
function removeCallIdleDelegates ( t ){
    var arr = this.coi;
    this.coi = new Array;
    //call in order
    for (var i = 0; i < arr.length; i++ ){
        arr[i].execute( t );
    }

    if (this.coi.length == 0) {
        // Note that the executed items may have added to the (new)
        // coi queue, only unregister if the queue is empty
        this.removeCOI.unregisterFrom(this.onidle);
        this.regNext = false;
    }
}

/** This is the idle event for the system, sent by this service 
 * @lzxtype event
 */
var onidle = LzDeclaredEvent;

function toString () { return "LzIdle" }; // LzIdle in case somebody checks it

} // End of LzIdleClass


var LzIdle:LzIdleClass;
