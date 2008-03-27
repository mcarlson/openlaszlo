/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzevent lzdelegate
  * @topic LFC
  * @subtopic Events
  * @access public
  */

/**
  * <p>
  * A delegate is an object that calls  a specific method in a specific context
  * when its execute method is called. It is essentially a function pointer.
  * </p>
  * <p>
  * Delegates, along with <xref linkend="LzEvent"/>, comprise Laszlo's point to point event system. A delegate represents a named method of an instance. Delegates are mostly registered with events, but they can be used anywhere a function callback would traditionally be called for: for instance, the <xref linkend="LzTimer"/> service takes a delegate as its argument when a timer is started. See the code example on the <xref linkend="LzEvent"/>.
  * </p>
  *
  * @shortdesc The receiver in Laszlo's point-to-point event system.
  * @see LzEvent
  */
dynamic class LzDelegate {

    var __delegateID:int = 0;

/**
  *
  * @param Object context: reference to object which will be called
  * @param String functionName: name of the method to call (a string)
  * @param Object eventSender: optional; the sender of the event to register the
  * new delegate for.
  * @param String eventName: Optional, but required if eventSender is used; The name
  * of the event to register the new delegate for.
  */  
    function LzDelegate (context, functionName, eventSender:* = null, eventName:* = null) {
    // too expensive to leave on all the time
    //     if ($debug) {
    //         this._dbg_created = Debug.backtrace();
    //     }
  this.c = context;
  if ( $debug ){
    if (typeof(functionName) != "string") 
      Debug.warn('LzDelegate functionName must be a string in %w', arguments.caller);
  }
  this.f = functionName;
  if ( eventSender != null ){
    if ( $debug ) {
      if (typeof(eventName) != "string") {
        Debug.warn('LzDelegate eventName must be a string in %w', arguments.caller);
      }
    }
    this.register( eventSender , eventName );
  }
  
  this.__delegateID = LzDelegate.__nextID++;
}

/** @access private */
    static var __nextID:int = 1;

/** The context in which to call the method
  * @type Object
  */
var c;

/** The name of the method to call
  * @type String
  */
var f;

var lastevent = 0;
var enabled = true;
var event_called = false;

/**
  * Executes the named method in the given context with the given data. Returns
  * the result of the call. In rare cases, this method may be overriden by a
  * subclass, and so it is marked 'protected' instead of 'private'.
  * 
  * @param sd: The data with which to call the method.
  * @return: The value returned by the method call.
  * @access protected
  */
function execute (sd){
    // Don't execute if context has been deleted, as that could
    // 'resurrect' the deleted view, causing a memory leak
    // Usually this is because a deleted view has idle or timer events
    // still registered.
    var context = this.c;
    if (this.enabled && context) {
        if (context['__LZdeleted']) { 
            return;
        }
        return context[this.f]( sd );
    }
}

/**
  * Registers the delegate for the named event in the given context. <b>NB:</b>
  * This is the primary way in which events are created. Published events do
  * not generally exist as objects (with some exceptions) until delegates are
  * created for them.
  * 
  * @param Object eventSender: The object which publishes the event.
  * @param String eventName: The name (string) of the event to register for.
  */
function register ( eventSender , eventName){
    if (! eventSender) {
        if ($debug) {
            Debug.error('No eventSender (%w) for %s', eventSender, eventName);
        }
        return;
    }

    var anEvent = eventSender[ eventName ];

    if ( anEvent == LzDeclaredEvent || !anEvent ){
        // The call used to be unrolled here for swf. I removed it since it
        // was done during the swf5 days
        anEvent = new LzEvent( eventSender, eventName , this );
    } else {
        anEvent.addDelegate( this );
    }

    this[ this.lastevent++ ] = anEvent;

    // If debugging, add an informative name
    if ($debug) {
        var anEvent = eventSender[ eventName ];
        if (! anEvent.hasOwnProperty('_dbg_eventSender')) {
            anEvent._dbg_eventSender = eventSender;
            anEvent._dbg_eventName = eventName;
            // too expensive to leave on all the time
//             anEvent._dbg_created = Debug.backtrace();
        }
    }
    if ($profile) {
        var anEvent = eventSender[ eventName ];
        if (! anEvent.hasOwnProperty('_dbg_profileName')) {
            anEvent._dbg_profileName = eventName;
        }
    }        
}

/**
  *  Unregisters the delegate for all of the events it is registered for.
  */
function unregisterAll ( ){
    for (var i = 0; i< this.lastevent ; i++){
        this[ i ].removeDelegate( this );
        this[ i ] = null;
    }
    this.lastevent = 0;
}

/**
  *  Unregisters the delegate for the given event
  *  @param LzEvent event: The event to unregister the delegate from.
  *                       (e.g.  myview.onmouseup)
  */
function unregisterFrom ( event ){
    var keep = [];
    for (var i = 0; i< this.lastevent ; i++){
        var ev = this[ i ]; 
        if ( ev == event ){
            ev.removeDelegate( this );
        } else {
            keep.push( ev );
        }
        this[ i ] = null;
    }
    //now fix it 
    this.lastevent = 0;
    var l = keep.length;
    for ( var i = 0; i < l; i++ ){
        this[ this.lastevent++ ] = keep[ i ];
    }
}

/**
  *  Disables the delegate until enable method is called.
  */
function disable (){
    this.enabled = false;
}

/**
  *  Enables a delegate that has been disabled
  */
function enable (){
    this.enabled = true;
}

  /**
   * Queue for delegates that are deferred during node initialization
   * @access private
   */
  static var __LZdelegatesQueue = [];

  /**
   * Drain the delegates queue back to position POS
   * @access private
   */
  static function  __LZdrainDelegatesQueue (pos) {
    var evq = __LZdelegatesQueue;
    var n = evq.length;
    var i = pos;
    while (i < n) {
      var d = evq[i];
      var sd = evq[i+1];
      /*
      if ($debug) {
        Debug.debug("Deferred %w.execute(%w)", d, sd);
      }
      */
      // d.execute( sd ); inlined
      if (d.c[d.f]) d.c[d.f]( sd );
      i+=2;
    }
    evq.length = pos;
  }

/** @access private */
function toString (){
    return ("Delegate for " + this.c + " calls " + this.f + " " + this.__delegateID );
}

if ($debug) {
/**
  *  If debugging, add an informative name
  *  @access private
  */
function _dbg_name (){
    var name = Debug.formatToString("%0.48w.%s()", this.c, this.f);
    if (this[0]) {
      name += Debug.formatToString("/* handles %w%s */", this[0], this[1]?" ...":"");
    }
    return name;
}
}

} // End of LzDelegate


/**
  * <p>Events underly most of the functionality in OpenLaszlo  applications. 
  * Unlike events in similar systems, OpenLaszlo's events are point-to-point, meaning that there is no general broadcast mechanism for events, and events do not trickle up or down the instance hierarchy. Instead, objects called <xref linkend="LzDelegate"/> <xref linkend="LzDelegate.prototype.register"/> for events, and if they try to register for an event that doesn't exist yet, the system creates the event. </p>
  * 
  * <p>You can create a delegate explicitly using the <classname link="true">LzDelegate</classname> class, or implicitly by creating an handler.</p>
  * <p>
  * Because of the loose type requirements in LZX, calling an event that no delegate is listening for (and which therefore hasn't been created) has no effect. This allows objects to publish many more events than they actually need to create at runtime.
  * </p>
  * 
  * <p>There are two syntaxes with which you can specify an event handler: in the tag used to create that object, or by using the 
  * <tagname link="true">handler</tagname> tag.</p>
  * 
  * <p>To specify an event handler in an object-creation tag, simply include it like any other attribute.  For example,</p>
  * 
  * <example class="code" extract="false">
  * &lt;view onmouseover="doSomething()"&gt;
  *   &lt;method name="doSomething"&gt;
  *     // code to be executed when mouse is over the view
  *   &lt;/method&gt;
  * &lt;/view&gt;
  * </example>
  * 
  * <p>If you use the <tagname link="true">handler</tagname> tag, you do not need to include the handler in the tag that creates the object.</p>
  * 
  * <example class="code" extract="false">
  * &lt;view&gt;
  *  &lt;handler name="onmouseover"&gt;
  *    // code to be executed when the mouse is over the view
  *  &lt;/name&gt;
  * &lt;/view&gt;
  * </example>
  * 
  * <p> The above two examples are functionally equivalent.  Using the <tagname>handler</tagname> tag, however, can often lead to more readable code because it removes clutter from the object creation tag.</p> 
  * 
  * 
  * <p>Use the <tagname link="true">event</tagname> tag to create the events; then use the <method>sendEvent</method> method to dispatch it. The following example illustrates how to create custom events.</p>
  * 
  * <example class="program"
  *          title="A simple example of publishing and listening for a custom event">
  * &lt;canvas height="40"&gt;
  *   &lt;simplelayout/&gt;
  *   &lt;button name="eventSender" 
  *           <em>onmouseover="this.customevent.sendEvent()"
  *           onmouseout="this.customevent.sendEvent()"/&gt;</em>
  * 
  *   &lt;event name="customevent"/&gt;
  *   &lt;view bgcolor="red" width="20" height="20" oninit="this.setupDelegate()"&gt;
  *     &lt;method name="setupDelegate"&gt;
  *       this.del = new LzDelegate( this, "respondToEvent" );
  *       <em>this.del.register( eventSender , "customevent" );</em>
  *     &lt;/method&gt;
  *     &lt;method name="respondToEvent"&gt;
  * 
  *       this.setAttribute('x', this.x + 10);
  *     &lt;/method&gt;
  *   &lt;/view&gt;
  * &lt;/canvas&gt;
  * </example>
  * 
  * <p>
  * Events can be sent with a single argument, which usually conveys information about the property that changed. The default behavior of the <xref linkend="LzNode.prototype.setAttribute"/> method is to set the named property and send the event called "on" + property. This is general mechanism that updates constraints in a OpenLaszlo programs. For instance, when a view changes its <attribute>x</attribute> position, it sends the event <event>onx</event> with the new value for its <attribute>x</attribute> property.
  * 
  * </p>
  * 
  * <example class="program"
  *          title="Event sending in response to setting an attribute">
  * &lt;canvas height="40"&gt;
  *   &lt;simplelayout/&gt;
  *   &lt;button name="eventSender" 
  *           <em>onmouseover="this.setAttribute('avalue', this.avalue + 10)"
  *           onmouseout="this.setAttribute('avalue', this.avalue + 5)"</em>&gt;
  *     &lt;attribute name="avalue" value="0"/&gt;
  *   &lt;/button&gt;
  * 
  *   &lt;view bgcolor="red" width="20" height="20" oninit="this.setupDelegate()"&gt;
  *     &lt;method name="setupDelegate"&gt;
  *       this.del = new LzDelegate(this, "respondToEvent");
  *       this.del.register(eventSender, <em>"onavalue"</em>);
  *     &lt;/method&gt;
  *     &lt;method name="respondToEvent" args="v"&gt;
  *       this.setAttribute('x' , v);
  *     &lt;/method&gt;
  * 
  *   &lt;/view&gt;
  * &lt;/canvas&gt;
  * </example>
  * 
  * @shortdesc The sender in Laszlo's point-to-point event system.
  * @see LzDelegate
  */

public class LzEvent extends LzDeclaredEventClass {

    var delegateList:Array = null;

/**
  *  @param Object eventSender: The owner of this event
  *  @param String eventName: The name of this event.
  */
    function LzEvent ( eventSender:* , eventName:* , d:*  = null){
        super();
    var _evs = eventSender._events;
    if (_evs == null ){
        eventSender._events = [ this ];
    } else {
        _evs.push ( this );
    }
    eventSender[ eventName ] = this;
    if ( d ){
        this.delegateList = [d];
        this.ready = true;
    }else{
        this.delegateList = [];
    }

    // If debugging, add an informative name
    if ($debug) {
      this._dbg_eventSender = eventSender;
      this._dbg_eventName = eventName;
    }
    if ($profile) {
      this._dbg_profileName = eventName;
    }
}

// Because this is not created with Class
//prototype.classname = "LzEvent";

/** True when event is being sent.
  * @type Boolean
  */
    var locked:Boolean = false;


/**
  *  Adds the given delegate to the event's delegate list. Although this listed
  *  as a public function it should rarely be called explicitly -- it is used
  *  exclusively by <b><i>LzDelegate</i>.register</b>
  * 
  *  @param LzDelegate d: The delegate to add to the list of delegates called by the event.
  */
function addDelegate (d){
    this.ready = true;
    this.delegateList.push(d);
}



/**
  *  Sends the event, passing its argument as the data to all the called
  *  delegates
  * 
  *  @param sd: The data to send with the event.
  */
public override function sendEvent ( sd = null ){
    if ( this.locked ) { return; } //don't allow for multiple calls

    var dll = this.delegateList.length;
    if (dll == 0) { return; }

    if ($profile) {
        var nm = this._dbg_profileName;
        
        if (nm) {
            Profiler.event(nm, 'calls');
        }
    }
    
    this.locked = true;

    var calledDelegates = new Array;

    var d;
    var evq = LzDelegate.__LZdelegatesQueue;
    for (var i = dll; i >= 0; i--){
        d = this.delegateList[ i ];
        //pointer may be bad due to deletions
        if ( d && ! d.event_called){
            d.event_called = true; //this delegate has been called
            calledDelegates.push( d );
            // We don't worry about deleted contexts here, because
            // we assume that delegates registered on events are
            // properly managed
            if (d.enabled && d.c) {
                if (d.c.__LZdeferDelegates) {
                    evq.push(d, sd);
                } else {
                  // d.execute( sd ); inlined
                    if (d.c[d.f]) {
                        d.c[d.f]( sd );
                    }
                }
            }
        }
    }

    while (d = calledDelegates.pop() ){
        d.event_called = false;
    }
    
    if ($profile) {
        var nm = this._dbg_profileName;
        if (nm) {
            Profiler.event(nm, 'returns');
        }
    }
    
    this.locked = false;
}

/**
  *  Removes the delegate from the delegate list. In practice, this is rarely
  *  called explicitly, since it does not update the delegate's list of stored
  *  events. Right now, this is called only by <b><i>LzDelegate</i>.
  *  unregisterAll</b> Delegates should support a simple unregister command, that
  *  unregisters them for a single event, but to date, that has not proven
  *  necessary
  * 
  *  @param LzDelegate d: The delegate to remove from the delegateList.
*/
override function removeDelegate ( d = null ){

    var dll = this.delegateList.length;
    for (var i = 0; i < dll; i++){
        if (this.delegateList[i] == d){
            this.delegateList.splice(i, 1);
            break;
        }
    }
    if ( this.delegateList.length == 0 ){
        this.ready = false;
    }
}

/**
  *  Removes all delegates from call list
  */
override function clearDelegates (){
    while (this.delegateList.length ){
        this.delegateList[ 0 ].unregisterFrom( this );
    }
    //this.delegateList = [];
    this.ready = false;
}

/**
  *  Returns the number of delegates registered for the event
  *  @return Number: The number of delegates registered for the event.
  */
override function getDelegateCount ( ){
    return this.delegateList.length;
}

override function toString (){
    return ( "LzEvent");
}

if ($debug) {
/**
  *  If debugging, add an informative name
  *  @access private
  */
override function _dbg_name (){
    return Debug.formatToString("%0.48w.%s", this._dbg_eventSender, this._dbg_eventName);
}
}

} // End of LzEvent
