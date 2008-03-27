/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzinstantiator
  * @access public
  * @topic LZX
  * @subtopic Runtime
  */

/**
  * <p>The instantiator is responsible for timing the creation and initialization of Laszlo applications. Because of Laszlo's declarative style, applications must be instantiated in two passes -- one where all of the objects are created and another where all of the references are resolved. This ensures that order rarely matters in an lzx file, and allows objects to refer to one another without making the programmer worry about initialization order or messy callbacks.</p>
  * 
  * <p>If an OpenLaszlo application is slow to instantiate, LzNodes supply the <xref linkend="LzNode.__ivars__.initstage"/> attribute. The instantiator also has a few exposed methods and attributes that can be used to control the instantiation behavior of a Laszlo app.</p>
  *
  * @shortdesc Handles application instantiation.
  */

dynamic public class LzInstantiatorClass {

var checkQDel = null;
function LzInstantiatorClass () {
  this.checkQDel = new LzDelegate( this , "checkQ" );
}

var halted = false;
var isimmediate = false;
var isdatareplicating = false;
var istrickling = false;
var isUpdating = false;
var safe = true;
/**
  * The length of time in miliseconds to spend 
  * synchronously creating nodes before allowing an idle event to pass. 
  * By default this is 500.
  * @type Number
  * @devnote empirical sweet spot at half second
  */
var timeout = 500;
var makeQ = [];
var trickleQ = [];
var tricklingQ = [];
public var syncNew = true;
/**
  * The length of time to spend creating initstage=
  * "late" nodes before allowing an idle event to pass. By default this
  * is 10 miliseconds.
  * @type Number
  */
var trickletime = 10;

var datareplq:Array;

/**
  * Instantiate the child array for a view. This will be instantiated
  * immediately, normally, or on the trickly depending on the state of the
  * service
  * @access private
  * @param LzView v: The view to instantiate children for.
  * @param [LzView] children: An array of children to create.
  */
function requestInstantiation( v , children  ){
    if ( this.isimmediate ){
        this.createImmediate( v , children.concat() );
    } else {
        var c = this.newReverseArray( children );
        if ( this.isdatareplicating){
            this.datareplq.push( v , c );
        } else if ( this.istrickling){
            this.tricklingQ.push( v , c );
        } else {
            this.makeQ.push( v , c );
            this.checkUpdate();
        }
    }
}

/**
  * @access private
  */
function enableDataReplicationQueuing (){
    this.isdatareplicating = true;
    this.datareplq = [];
}
/**
  * @access private
  */
function clearDataReplicationQueue (){
    this.isdatareplicating = false;
    var drq = this.datareplq;
    //now add them on backwards
    for ( var i = drq.length-1; i>0; i-=2 ){
        this.makeQ.push( drq[ i-1 ] , drq[ i ] );
    }
    this.checkUpdate();
}

/**
  * @access private
  */
function newReverseArray ( arr ){
    var n = arr.length;
    var a = Array(n);
    var i = 0;
    var j = n - 1;
    while (i < n) {
        a[i] = arr[j];
        i++;
        j--;
    }
    return a;
}
/**
  * @access private
  */
function checkUpdate (){
    if ( ! this.isUpdating && !this.halted ){
        this.checkQDel.register( LzIdle, "onidle" ); 
        this.isUpdating = true;
    }
}

/**
  * @access private
  *
  * This gets an event timer arg from the onidle event, which we ignore
  */
function checkQ ( ignoreme = null){
    if ( ! this.makeQ.length ) {
        if (! this.tricklingQ.length ){
            if ( !this.trickleQ.length ){
                this.checkQDel.unregisterAll();
                this.isUpdating = false;
                return;
            } else {
                var p =  this.trickleQ.shift();
                var c =  this.trickleQ.shift();
                this.tricklingQ.push( p , this.newReverseArray( c ) ) ;
            }
        }
        this.istrickling = true;
        this.makeSomeViews( this.tricklingQ , this.trickletime );
        this.istrickling = false;
    } else {
        canvas.creatednodes += this.makeSomeViews( this.makeQ , 
                                                   this.timeout );
        if (canvas.updatePercentCreated) {
            canvas.updatePercentCreated();
        }
    }
}

/**
  * @access private
  */
function makeSomeViews ( cq , otime ){
    var itime = ((new Date()).getTime());
    var num = 0;
    while( ((new Date()).getTime()) - itime < otime  && cq.length ) {
        //take rightmost element of last list in list
        var l = cq.length;
        var larr = cq[l-1];
        var par = cq[l-2];
        var parDone = false;
        // Don't bother with children of deleted parents
        if (par['__LZdeleted']) {
            cq.length -= 2;
            continue;
        }
        // Charge asynchronous time to parent views
        if ($profile) {
            for (var i = 0; i < l; i += 2) {
                var nm = cq[i]['_profile_instantiator_name'];
                if (nm) {
                    Profiler.event(nm, 'calls');
                }
            }
        }
        // Make leaves
        while( ( (new Date()).getTime() - itime < otime) ){
            // Check for new leaves
            if (l != cq.length) { break; }
            // Check for done
            if (! larr.length) { parDone = true; break; }
            var c = larr.pop();
            // FIXME: [2005-03-24 ptw] Somehow there are undefined
            // entries on the queue?
            if (c) {
                par.makeChild( c, true );
                num++;
            }
        }
        // Unwind parent view 'calls'
        if ($profile) {
            for (var i = l - 2; i >= 0; i -= 2) {
                var nm = cq[i]['_profile__instantiator_name'];
                if (nm) {
                    Profiler.event(nm, 'returns');
                }
            }
        }
        // Clear from queue
        if (parDone) {
            cq.length = l - 2;
            par.__LZinstantiationDone();
        }
    }

    return num;
}

/**
  * @access private
  */
function trickleInstantiate ( v ,children ){
    this.trickleQ.push ( v , children );
    this.checkUpdate();
}

/**
  * @access private
  */
function createImmediate ( v , children ){
    var c = this.newReverseArray( children );
    var wasimmediate = this.isimmediate;
    this.isimmediate = true;
    this.makeSomeViews( [ v , c ], Infinity );
    this.isimmediate = wasimmediate;
}

/**
  * @access private
  */
function completeTrickle ( v ){
    if ( this.tricklingQ[ 0 ] == v ){
        var wasimmediate = this.isimmediate;
        this.isimmediate = true;
        this.makeSomeViews( this.tricklingQ , Infinity );
        this.isimmediate = wasimmediate;
        this.tricklingQ = [];
    } else {
        var tql = this.trickleQ.length;
        for ( var i = 0; i < tql ; i+=2){
            if ( this.trickleQ[ i ] == v ){
                var dchil =this.trickleQ[ i + 1 ] ;
                this.trickleQ.splice( i , 2 ); 
                this.createImmediate(  v , dchil );
                return;
            }
        }
    }
}

/**
  * @access private
  */
function traceQ (){
    var mql = this.makeQ.length;
    trace( "****start trace" );
    for ( var i = 0; i < mql ; i+=2){
        var s = "";
        for (var k = 0 ; k < this.makeQ[ i + 1].length; k++ ){
            s+= this.makeQ[ i + 1 ][ k ].name + " |";
        }
        trace( this.makeQ[ i ] + " : |" + s  + " >>> " + this.makeQ[ i ] .getUID());
    }
    trace( "****trace done" );
}

/**
  * Stops the instantiatior until <code>resume</code> is called.
  */
function halt (){
    this.isUpdating = false;
    this.halted = true;
    this.checkQDel.unregisterAll();
}

/**
  * Restarts the instantiatior after it is stopped with <code>halt</code>
  */
function resume (){
    this.halted = false;
    this.checkUpdate( );
}

/**
  * Used by Krank to instantiate all views before kranking
  * @param limit:number limits time spent draining
  * @return boolean true when done
  * @access private
  */
function drainQ (limit) {
  var to = this.timeout;
  var tt = this.trickletime;
  var h = this.halted;

  this.timeout = limit;
  this.trickletime = limit;
  this.halted = false;
  this.isUpdating = true;
  this.checkQ();

  this.halted = h;
  this.timeout = to;
  this.trickletime = tt;
  return (! this.isUpdating);
}

} // End of LzInstantiatorClass


var LzInstantiator:LzInstantiatorClass = new LzInstantiatorClass ();

