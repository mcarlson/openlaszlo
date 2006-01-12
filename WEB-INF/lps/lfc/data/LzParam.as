/******************************************************************************
 * LzParam.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzParam
//
// LzParam objects hold onto parameters (name/value pairs) and provide methods 
// and utilities to reserialize them.  They are used whenever case matters for 
// keys or parameter names (objects don't work here...)
//
//=============================================================================
var LzParam = Class( "LzParam" , LzNode );

//undefine all setters but name and id
LzParam.prototype.setters.$hasdefaultattrs = -1;

//==============================================================================
// @keywords private
//==============================================================================
LzParam.prototype.construct = function ( parent , args ){
    super.construct( parent, args );
    var mysetters ={};
    mysetters.__proto__ = this.setters;
    this.setters = mysetters;

    // construct
    this.d = {};

}

//==============================================================================
// @keywords private
//==============================================================================
LzParam.prototype.__LZapplyArgs = function ( args ){
    for ( var a in args ){

        var pset = this.setters[ a ];
        if ( pset == null ){
            pset = "$psetter" + a;
            this.setters[ a ] = pset;
            this[ pset ] = this.makeSetterForParam( a );
            //_root.Debug.write( "generated setter: " + pset );
        }

        if ( pset != -1 ){ 
            //_root.Debug.write( "setter for " + a + " : " + pset );
            this[ pset ] ( args[ a ] );
        }
    }
}

//-----------------------------------------------------------------------------
// Parse a URL query string, returns an object with key-value pairs
// @return Object
//-----------------------------------------------------------------------------
LzParam.prototype.parseQueryString = function ( query ) {
  var parameters = query.split('&');
  var queries = {};
  for (var i in parameters) {
    var key = parameters[i];
    var value = '';
    var n = key.indexOf('=');
    if (n > 0) {
      value = unescape(key.substring(n+1));
      key = key.substring(0, n);
    }
    queries[key] = value;
  }
  return queries;
}

//==============================================================================
// @keywords private
//==============================================================================
LzParam.prototype.__LZresolveRefs = function ( refs ){
    //_root.Debug.write( "resolve refs " + refs );
    for ( var a in refs ){
        var pset = this.setters[ a ];
        if ( pset == null ){
            pset = "$psetter" + a;
            this.setters[ a ] = pset;
            this[ pset ] = this.makeSetterForParam( a );
            //_root.Debug.write( "generated setter: " + pset );
        }
    }
    super.__LZresolveRefs( refs );
}

//==============================================================================
// @keywords private
//==============================================================================
LzParam.prototype.createChildren = function ( children ){
    //_root.Debug.write( "got children: " + children );
}

// default separator and delimiter
LzParam.prototype.dlm = "&";
LzParam.prototype.sep = "=";

//----------------------------------------------------------------------------- // Generates pseudo closure used to set parameters with setter.
//
// @keywords private
//----------------------------------------------------------------------------- // Get offset for specified name in the hash value.
LzParam.prototype.makeSetterForParam = function( param ) {
    var f = function ( val ){
        var ac = arguments.callee;
        //_root.Debug.write( "in setter for " + ac.storedparam + " set to " + val );
        ac.plist.setValue ( ac.storedparam , val );
    }
    f.plist = this;
    f.storedparam = param;
    return f;
}

//-----------------------------------------------------------------------------
// Adds a series of name/value pairs from an object
//
// @param Object o: An object containing name/value pairs to add
//-----------------------------------------------------------------------------
LzParam.prototype.addObject = function(o) {
    for ( var n in o ) {
        this.setValue( n, o[n] );
    }
}

//-----------------------------------------------------------------------------
// Returns a clone of this LzParam
// @return LzParam
//-----------------------------------------------------------------------------
LzParam.prototype.clone = function(o) {
    var o = new _root.LzParam();
    for ( var n in this.d ) {
        o.d[ n ] = this.d[ n ].concat();
    }
    return o;
}


//-----------------------------------------------------------------------------
// Remove specified value by name or all values if null
//
// @param String name: The name of the value to remove.  If null, removes 
// all values
//-----------------------------------------------------------------------------
LzParam.prototype.remove = function( name ) {
    if ( null == name ) {
        this.d = {};
    } else if ( null != this.d[ name ] ) {
        var i = this.findKey( name );
        if ( i != null ) {
            this.d[ name ].splice ( i , 2 );
        }
    }
}


//-----------------------------------------------------------------------------
// Sets a value.  Replaces existing entries with the same name.
//
// @param String name: The name to set - must evaluate to a string
// @param String val: The value to set
// @param Boolean enc: If true, URI-encodes the value
//-----------------------------------------------------------------------------
LzParam.prototype.setValue = function(name, val, enc) {
    if (enc) val = escape(val);
    var a = this.d[ name ];
    if ( a == null ) {
        // add first pair
        this.d[ name ] = [name, val];
    } else {
        var i = this.findKey( name );
        if (null != i) {
            // replace existing value
            a[i + 1] = val;
        } else {
            // add new value
            a.push(name, val);
        }
    }
}


//-----------------------------------------------------------------------------
// Adds a value.  Does not replace existing entries with the same name.
//
// @param String name: The name to set - must evaluate to a string
// @param String val: The value to set
// @param Boolean enc: If true, URI-encodes the value
//-----------------------------------------------------------------------------
LzParam.prototype.addValue = function(name, val, enc) {
    if ( enc ) val = escape( val );
    var a = this.d[ name ];
    if ( a == null ) {
        // add first pair
        this.d[ name ] = [ name, val ];
    } else {
        // add new value
        a.push( name, val );
    }
}


//-----------------------------------------------------------------------------
// Get a value by name
//
// @param String name: The name to look up - must evaluate to a string
// @return String : The value for the specified name
//-----------------------------------------------------------------------------
LzParam.prototype.getValue = function(name) {
    var i = this.findKey(name);
    if (null != i) {
        return this.d[name][i + 1];
    }
}


//-----------------------------------------------------------------------------
// Get a value by name irrespective of case.
//
// @param String name: The name to look up - must evaluate to a string
// @return [String]: An array of values that case-insensitively match name
//-----------------------------------------------------------------------------
LzParam.prototype.getValueNoCase = function(name) {
    var a = this.d[name];
    if ( a.length ){
        if ( a.length == 2 ) {
            return a[ 1 ];
        }else {
            var r =[];
            for ( var i = 1; i < a.length; i +=2 ){
                r.push( a[ i ] );
            }
            return r;
        }
    }
}


//-----------------------------------------------------------------------------
// Get a list of all names, not necessarily in order
//
// @return [String]: A list of keys
//-----------------------------------------------------------------------------
LzParam.prototype.getNames = function() {
    var o = [];
    for (var n in this.d) {
        var a = this.d[n];
        for (var i = 0; i < a.length; i += 2) {
            if (null != a[i]) {
                o.push(a[i]);
            }
        }
    }
    return o;
}


//----------------------------------------------------------------------------- // Get offset for specified name in the hash value.
//
// @keywords private
// @param name: The name to set - must evaluate to a string
// @return i: The offset found
//-----------------------------------------------------------------------------
LzParam.prototype.findKey = function( name ) {
    var a = this.d[name];
    if (a != null) {
        for (var i = 0; i < a.length; i += 2) {
            if (name == a[ i ]) {
                return i;
            }   
        }
    }
}



//-----------------------------------------------------------------------------
// Set delimiter string used between records in serialize();
//
// @param String d: String to use as delimiter
// @return String: Old delimiter
//-----------------------------------------------------------------------------
LzParam.prototype.setDelimiter = function(d) {
    var o = this.dlm;
    this.dlm = d;
    return o;
}


//-----------------------------------------------------------------------------
// Set separator string used between name/value pairs in each record in 
// serialize();
//
// @param String s: String to use as separator
// @return String : Old separator
//-----------------------------------------------------------------------------
LzParam.prototype.setSeparator = function(s) {
    var o = this.sep;
    this.sep = s;
    return o;
}


//-----------------------------------------------------------------------------
// Returns a string representation using the current separator and delimiter 
//
// @return String : All names and values for this object
//-----------------------------------------------------------------------------
LzParam.prototype.toString = function() {
    return this.serialize();
}

//-----------------------------------------------------------------------------
// Returns a string representation using the current separator and delimiter 
//
// @param String sep: String to use as separator
// @param String delim: String to use as delimiter
// @param Boolean uriencode: If true, uri-encode values
// @return: String representation of parameters
//-----------------------------------------------------------------------------
LzParam.prototype.serialize = function( sep , delim , uriencode ){
    var sep = sep == null ? this.sep : sep;
    var dlm = delim == null ? this.dlm : delim;

    var o = "";

    var c = false;
    for ( var mk in this.d ){
        var n = this.d[ mk ];
        if (n != null) {
            for ( var i = 0; i < n.length; i+=2 ) {
                if ( c ) o += dlm;
                o += n[ i ] + sep ;
                o += uriencode? escape( n[ i + 1 ] ) : n[ i + 1 ];
                c = true;
            }
        }
    }

    return o;
}
