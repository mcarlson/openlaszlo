/**
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LFC
  * @subtopic Data
  */

/**
  * Just enough of LzNode to make setters work for DataElements
  * @access public
  * @topic LZX
  * @subtopic Runtime
  * @todo [2006-08-23 ptw] Fix this modularity.  Is it really too
  * expensive to have this above LzNode?
  * @devnote this is public because public classes inherit from it. Put it
  * in LZX.Runtime to semi-sorta obscure it.
  */

// Inlined contents of LzMiniNode class
class LzMiniNode {
  static var setters:* = new LzInheritedHash({ });
  static var getters = new LzInheritedHash({ });
  static var defaultattrs = new LzInheritedHash({ });
  static var options = new LzInheritedHash({ });
  static var __LZdelayedSetters:* = new LzInheritedHash({ });
  static var earlySetters:* = new LzInheritedHash({ });

//TODO See copied method below
//  var setAttribute = LzNode.prototype.setAttribute;

  var children:Array = [];
  var __LZdeleted:Boolean = false;
  var sel; // Also defined in LzDatapath

  var setters:*;
  var getters:*;
  var defaultattrs:*;
  var options:*;
  var __LZdelayedSetters:*;
  var earlySetters:*;


  // swf9 initialization adapted from LzNode.js
  function LzMiniNode ( parent:* = null, attrs:* = null, children:* = null, instcall:*  = null){
      this.setters = this['constructor'].setters;
      this.getters = this['constructor'].getters;
      this.defaultattrs = this['constructor'].defaultattrs;
      this.options = this['constructor'].options;
      this.__LZdelayedSetters = this['constructor'].__LZdelayedSetters;
      this.earlySetters = this['constructor'].earlySetters;
  }

  function _dbg_name () {}
  function toString () {}

  function __LZupdateShown( ) {}

/**
  * Sets the named attribute to the given value. If there is no setter for the
  * property, this[ prop ] is set to the value, and the event this [ "on"+prop ]
  * is sent.
  *
  * @param String prop: A string naming the key of attribute to set
  * @param any val: The value for that attribute
  * @param Boolean ifchanged: If true, only set the attribute if the value 
  * changed
  */
//TODO Copied from LzNode
function setAttribute(prop, val, ifchanged = null) {
    if (this.__LZdeleted || (ifchanged && (this[prop] == val))) return;

    var s = this.setters;
    if (s && (prop in s)) {
        this[s[prop]](val);
    } else {
        if (s == null) {
            if ($debug) {
                Debug.warn('null setters on', this, prop, val);
            }
        }
        this[ prop ] = val;
        var evt = ("on" + prop);
        if (evt in this) {
            if (this[evt].ready) this[ evt ].sendEvent( val );
        }
    }

}

}
