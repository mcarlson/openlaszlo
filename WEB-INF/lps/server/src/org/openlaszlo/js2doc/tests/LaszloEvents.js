/**
  * LaszloEvents.lzs 
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzevent lzdelegate
  */
  
  
/** A delegate is essentially a closure.
  */
class LzDelegate {

/**
  * @param Object context: reference to object which will be called
  * @param String functionName: name of the method to call (a string)
  * @param Object eventSender: optional; the sender of the event to register the
  * new delegate for.
  * @param String eventName: Optional, but required if eventSender is used; The name
  * of the event to register the new delegate for.
*/
function initialize (context, functionName, eventSender, eventName) {
  super.initialize.apply(this, arguments);
  // too expensive to leave on all the time
//     if ($debug) {
//         this._dbg_created = Debug.backtrace();
//     }
//@field Object c: The context in which to call the method
  this.c = context;
  if ( $debug ){
    if (typeof(functionName) != "string") 
      Debug.warn('LzDelegate functionName must be a string in %w', arguments.caller);
  }
  //@field String f: The name of the method to call
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

static var __nextID = 1;

var lastevent = 0;
var enabled = true;
var event_called = false;

/**
  * Executes the named method in the given context with the given data. Returns
  * the result of the call.
  *
  * @param sd: The data with which to call the method.
  * @return Object: The value returned by the method call.
  */
function execute (sd){
    // Don't execute if context has been deleted, as that could
    // 'resurrect' the deleted view, causing a memory leak
    // Usually this is because a deleted view has idle or timer events
    // still registered.
    var context = this.c;
    if (context) {
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
        Debug.error('No eventSender (%w) for %s', eventSender, eventName);
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
  * Unregisters the delegate for all of the events it is registered for.
  */
function unregisterAll ( ){
    for (var i = 0; i< this.lastevent ; i++){
        this[ i ].removeDelegate( this );
        this[ i ] = null;
    }
    this.lastevent = 0;
}

/**
  * Unregisters the delegate for the given event
  * @param LzEvent event: The event to unregister the delegate from.
  *                      (e.g.  myview.onmouseup)
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
    for ( var i = 0; i < keep.length; i++ ){
        this[ this.lastevent++ ] = keep[ i ];
    }
}

/**
  * Disables the delegate until enable method is called.
  */
function disable (){
    this.enabled = false;
}

/**
  * Enables a delegate that has been disabled
  */
function enable (){
    this.enabled = true;
}

/**
  * @keywords private
  */
function toString (){
    return ("Delegate for " + this.c + " calls " + this.f + " " + this.__delegateID );
}

if ($debug) {
/**
  * If debugging, add an informative name
  * @keywords private
  */
function _dbg_name (){
    return (Debug.formatToString("%0.48w.%s()", this.c, this.f));
}
}

} // End of LzDelegate


class LzEvent {

/** An event is an object which stores delegates. When it is called, it
  * calls all of its delegates in turn. Due to the dynamic (and lazy) nature
  * of event instantiation, events store themselves in their containing object
  * in two ways: first, in slot equivalent to their name (<i>view[eventName]</i>
  * = event) and second, in an array in the containing object (which it will
  *  create if it doesn't exist) called <i>_events</i>
  *
  *
  * @param Object eventSender: The owner of this event
  * @param String eventName: The name of this event.
  */
function initialize ( eventSender , eventName , d ){
    super.initialize.apply(this, arguments);

    var _evs = eventSender._events;
    if (_evs == null ){
        eventSender._events = [ this ];
    } else {
        _evs.push ( this );
    }
    eventSender[ eventName ] = this;
    if ( d ){
        this.delegateList = [d];
    }else{
        this.delegateList = [];
    }

    // If debugging, add an informative name
    if ($debug) {
        var anEvent = eventSender[ eventName ];
        if (! anEvent.hasOwnProperty('_dbg_eventSender')) {
            anEvent._dbg_eventSender = eventSender;
            anEvent._dbg_eventName = eventName;
        }
    }
    if ($profile) {
        var anEvent = eventSender[ eventName ];
        if (! anEvent.hasOwnProperty('_dbg_profileName')) {
            anEvent._dbg_profileName = eventName;
        }
    }        

}

// Because this is not created with Class
//prototype.classname = "LzEvent";
var locked = false;

/**
  * Adds the given delegate to the event's delegate list. Although this listed
  * as a public function it should rarely be called explicitly -- it is used
  * exclusively by <b><i>LzDelegate</i>.register</b>
  *
  * @param LzDelegate d: The delegate to add to the list of delegates called by the event.
  */
function addDelegate (d){
    this.delegateList.push(d);
}

/**
  * Sends the event, passing its argument as the data to all the called
  * delegates
  *
  * @param sd: The data to send with the event.
  */
function sendEvent ( sd ){
    //@field locked: Bool which is true when event is being sent.
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
    for (var i = dll; i >= 0; i--){
        d = this.delegateList[ i ];
        //pointer may be bad due to deletions
        if ( d && ! d.event_called){
            d.event_called = true; //this delegate has been called
            calledDelegates.push( d );
            // d.execute( sd ); inlined
            // We don't worry about deleted contexts here, because
            // we assume that delegates registered on events are
            // properly managed
            if (d.enabled && d.c) {
                d.c[d.f]( sd );
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
  * Removes the delegate from the delegate list. In practice, this is rarely
  * called explicitly, since it does not update the delegate's list of stored
  * events. Right now, this is called only by <b><i>LzDelegate</i>.
  * unregisterAll</b> Delegates should support a simple unregister command, that
  * unregisters them for a single event, but to date, that has not proven
  * necessary
  *
  * @param LzDelegate d: The delegate to remove from the delegateList.
  */
function removeDelegate ( d ){
    var dll = this.delegateList.length;
    for (var i = 0; i < dll; i++){
        if (this.delegateList[i] == d){
            this.delegateList.splice(i, 1);
            break;
        }
    }
    if ( this.delegateList.length == 0 ){
        this.hasNoDelegates = true;
    }
}

/**
  * Removes all delegates from call list
  */
function clearDelegates (){
    while (this.delegateList.length ){
        this.delegateList[ 0 ].unregisterFrom( this );
    }
    //this.delegateList = [];
    this.hasNoDelegates = true;
}

/**
  * Returns the number of delegates registered for the event
  * @return Number: The number of delegates registered for the event.
  */
function getDelegateCount ( ){
    return this.delegateList.length;
}

function toString (){
    return ( "LzEvent");
}

if ($debug) {
/**
  * If debugging, add an informative name
  * @keywords private
  */
function _dbg_name (){
    return Debug.formatToString("%0.48w.%s", this._dbg_eventSender, this._dbg_eventName);
}
}

} // End of LzEvent
