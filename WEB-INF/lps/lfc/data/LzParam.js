/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LFC
  * @subtopic Data
  * @affects lzparam
  */

/**
  * <p>LzParam provide utilities for manipulating name-value pairs. 
  *   For example, LzParam objects can be used to manage a name/value pairs for an 
  *   HTTP request.</p>
  * 
  * <example class="fragment" extract="false">
  *     &lt;method name=&quot;sendData&quot; args=&quot;action&quot;&gt;
  *         var d=canvas.datasets.dsSendData;
  *         var p=new LzParam();
  *         p.addValue( &quot;action&quot;, action, true);
  *         p.addValue( &quot;firstName&quot;, &quot;Bob&quot;, true);
  *         p.addValue( &quot;lastName&quot;, &quot;Jones&quot;, true);
  *         p.addValue( &quot;phone&quot;, &quot;415-255-2392&quot;, true);
  *         p.addValue( &quot;email&quot;, &quot;bob@jones.com&quot;, true);
  *         d.setQueryString( p );
  *         d.doRequest();
  *     &lt;/method&gt;
  * 
  * </example>
  * 
  * @shortdesc A utility class for manipulating name-value pairs  
  * @devnote LzParam objects hold onto parameters (name/value pairs) and provide methods 
  * and utilities to reserialize them.  They are used whenever case matters for 
  * keys or parameter names (objects don't work here...)
  * 
  * @lzxname params
  */
class LzParam extends LzNode {

/** @access private
  * @modifiers override 
  */
static var tagname = 'params';

//undefine all setters but name and id
//TODO Check above comment
static var setters = new LzInheritedHash(LzNode.setters);
static var getters = new LzInheritedHash(LzNode.getters);
static var defaultattrs = new LzInheritedHash(LzNode.defaultattrs);
static var options = new LzInheritedHash(LzNode.options);
static var __LZdelayedSetters:* = new LzInheritedHash(LzNode.__LZdelayedSetters);
static var earlySetters:* = new LzInheritedHash(LzNode.earlySetters);

LzParam.setters.$hasdefaultattrs = -1;

var d:* = null;


/**
  * @access private
  */
    function LzParam ( parent:* = null, attrs:* = null, children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
    }  

override function construct ( parent , args ){
    super.construct.apply(this, arguments);
    this.d = {};
}


/**
  * Parse a URL query string, returns an object with key-value pairs
  * @return Object
  */
static function parseQueryString ( query ) {
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

/**
  * @access private
  */
override function createChildren ( children ){
    //Debug.write( "got children: " + children );
}

// default separator and delimiter
var dlm = "&";
var sep = "=";

/**
  * Adds a series of name/value pairs from an object
  * @param Object o: An object containing name/value pairs to add
  */
function addObject(o) {
    for ( var n in o ) {
        this.setValue( n, o[n] );
    }
}

/**
  * Returns a clone of this LzParam
  * @return LzParam
  */
function clone(o) {
    var o = new LzParam();
    for ( var n in this.d ) {
        o.d[ n ] = this.d[ n ].concat();
    }
    return o;
}


/**
  * Remove specified value by name or all values if null
  * @param String name: The name of the value to remove.  If null, removes 
  * all values
  */
function remove( name ) {
    if ( null == name ) {
        this.d = {};
    } else if ( null != this.d[ name ] ) {
        var i = this.findKey( name );
        if ( i != null ) {
            this.d[ name ].splice ( i , 2 );
        }
    }
}


/**
  * Sets a value.  Replaces existing entries with the same name.
  * @param String name: The name to set - must evaluate to a string
  * @param String val: The value to set
  * @param Boolean enc: If true, URI-encodes the value
  */
function setValue(name, val, enc = null) {
    if (enc) val = encodeURIComponent(val);
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


/**
  * Adds a value.  Does not replace existing entries with the same name.
  * @param String name: The name to set - must evaluate to a string
  * @param String val: The value to set
  * @param Boolean enc: If true, URI-encodes the value
  */
function addValue(name, val, enc) {
    if ( enc ) val = encodeURIComponent( val );
    var a = this.d[ name ];
    if ( a == null ) {
        // add first pair
        this.d[ name ] = [ name, val ];
    } else {
        // add new value
        a.push( name, val );
    }
}


/**
  * Get a value by name
  * @param String name: The name to look up - must evaluate to a string
  * @return String : The value for the specified name
  */
function getValue(name) {
    var i = this.findKey(name);
    if (null != i) {
        return this.d[name][i + 1];
    }
}


/**
  * Get a value by name irrespective of case.
  * @param String name: The name to look up - must evaluate to a string
  * @return [String]: An array of values that case-insensitively match name
  */
function getValueNoCase(name) {
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


/**
  * Get a list of all names, not necessarily in order
  * @return [String]: A list of keys
  */
function getNames() {
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
/** @access private */
// @param name: The name to set - must evaluate to a string
// @return i: The offset found
//-----------------------------------------------------------------------------
function findKey( name ) {
    var a = this.d[name];
    if (a != null) {
        for (var i = 0; i < a.length; i += 2) {
            if (name == a[ i ]) {
                return i;
            }   
        }
    }
}



/**
  * Set delimiter string used between records in serialize();
  * @param String d: String to use as delimiter
  * @return String: Old delimiter
  */
function setDelimiter(d) {
    var o = this.dlm;
    this.dlm = d;
    return o;
}


/**
  * Set separator string used between name/value pairs in each record in 
  * serialize();
  * 
  * @param String s: String to use as separator
  * @return String : Old separator
  */
function setSeparator(s) {
    var o = this.sep;
    this.sep = s;
    return o;
}


/**
  * Returns a string representation using the current separator and delimiter 
  * @return String : All names and values for this object
  */
override function toString() {
    return this.serialize();
}

/**
  * Returns a string representation using the current separator and delimiter 
  * @param String sep: String to use as separator
  * @param String delim: String to use as delimiter
  * @param Boolean uriencode: If true, uri-encode values
  * @return: String representation of parameters
  */
function serialize( sep = null, delim = null, uriencode = null){
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
                o += uriencode? encodeURIComponent( n[ i + 1 ] ) : n[ i + 1 ];
                c = true;
            }
        }
    }

    return o;
}

} // End of LzParam

// Fixes LPP-3030 toString() in IE 6+ - the function declaration doesn't work...
//TODO Check
//LzParam.prototype.toString = LzParam.prototype.serialize;

ConstructorMap[LzParam.tagname] = LzParam;
