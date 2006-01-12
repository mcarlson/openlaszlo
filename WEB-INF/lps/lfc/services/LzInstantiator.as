/******************************************************************************
 * LzInstantiator.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzInstantiator
// Controls instantiation of this children of <code>LzNode</code>s.
//=============================================================================
LzInstantiator = new Object();
LzInstantiator.checkQDel = new _root.LzDelegate( LzInstantiator , "checkQ" );
LzInstantiator.isUpdating = false;
LzInstantiator.safe = true;
//empirical sweet spot at half second
LzInstantiator.timeout = 500;
LzInstantiator.makeQ = [];
LzInstantiator.trickleQ = [];
LzInstantiator.tricklingQ = [];
LzInstantiator.syncNew = true;
LzInstantiator.trickletime = 10;

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.setSafeInstantiation = function( isSafe ){
    this.safe = isSafe;
    if ( this.instanceQ.length ){
       //@field timeout: The length of time in miliseconds to spend 
       //synchronously creating nodes before allowing an idle event to pass. 
       //By default this is 500.
       this.timeout = Infinity;
    }
}

//------------------------------------------------------------------------------
// Instantiate the child array for a view. This will be instantiated
// immediately, normally, or on the trickly depending on the state of the
// service
// @keywords private
// @param LzView v: The view to instantiate children for.
// @param [LzView] children: An array of children to create.
//------------------------------------------------------------------------------
LzInstantiator.requestInstantiation = function( v , children  ){
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

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
_root.LzInstantiator.enableDataReplicationQueuing = function (){
    this.isdatareplicating = true;
    this.datareplq = [];
}
//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
_root.LzInstantiator.clearDataReplicationQueue = function (){
    this.isdatareplicating = false;
    var drq = this.datareplq;
    //now add them on backwards
    for ( var i = drq.length-1; i>0; i-=2 ){
        this.makeQ.push( drq[ i-1 ] , drq[ i ] );
    }
    this.checkUpdate();
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.newReverseArray = function ( arr ){
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
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.checkUpdate = function (){
    if ( ! this.isUpdating && !this.halted ){
        this.checkQDel.register( _root.LzIdle, "onidle" ); 
        this.isUpdating = true;
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.checkQ = function ( ){
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
        //@field trickletime: The length of time to spend creating initstage=
        //"late" nodes before allowing an idle event to pass. By default this
        //is 10 miliseconds.
        this.makeSomeViews( this.tricklingQ , this.trickletime );
        this.istrickling = false;
    } else {
        _root.canvas.creatednodes += this.makeSomeViews( this.makeQ , 
                                                         this.timeout );
        _root.canvas.updatePercentCreated();
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.makeSomeViews = function ( cq , otime ){
    var itime = getTimer();
    var num = 0;
    while( getTimer() - itime < otime  && cq.length ) {
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
                var nm = cq[i]['_profile_name'];
                if (nm) {
                    _root.$lzprofiler.event(nm, 'calls');
                }
            }
        }
        // Make leaves
        while( (getTimer() - itime < otime) ){
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
                var nm = cq[i]['_profile_name'];
                if (nm) {
                    _root.$lzprofiler.event(nm, 'returns');
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

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.trickleInstantiate = function ( v ,children ){
    this.trickleQ.push ( v , children );
    this.checkUpdate();
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.createImmediate = function ( v , children ){
    var c = this.newReverseArray( children );
    var wasimmediate = this.isimmediate;
    this.isimmediate = true;
    this.makeSomeViews( [ v , c ], Infinity );
    this.isimmediate = wasimmediate;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.completeTrickle = function ( v ){
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

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.traceQ = function (){
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

//-----------------------------------------------------------------------------
// Stops the instantiatior until <code>resume</code> is called.
//-----------------------------------------------------------------------------
LzInstantiator.halt = function (){
    this.isUpdating = false;
    this.halted = true;
    this.checkQDel.unregisterAll();
}

//-----------------------------------------------------------------------------
// Restarts the instantiatior after it is stopped with <code>halt</code>
//-----------------------------------------------------------------------------
LzInstantiator.resume = function (){
    this.halted = false;
    this.checkUpdate( );
}

//------------------------------------------------------------------------------
// Used by Krank to instantiate all views before kranking
//
// @param limit:number limits time spent draining
// @return boolean true when done
// @keywords private
//------------------------------------------------------------------------------
LzInstantiator.drainQ = function (limit) {
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

