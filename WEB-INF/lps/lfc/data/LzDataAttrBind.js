/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access private
  * @topic LFC
  * @subtopic Data
  */
  
/** @access private */
class LzDataAttrBind extends LzDatapointer {

  static var setters = new LzInheritedHash(LzDatapointer.setters);
  static var getters = new LzInheritedHash(LzDatapointer.getters);
  static var defaultattrs = new LzInheritedHash(LzDatapointer.defaultattrs);
  static var options = new LzInheritedHash(LzDatapointer.options);
  static var __LZdelayedSetters:* = new LzInheritedHash(LzDatapointer.__LZdelayedSetters);
  static var earlySetters:* = new LzInheritedHash(LzDatapointer.earlySetters);


function LzDataAttrBind ( ndpath , attr, path ){
    super(ndpath, attr);
                            this.setAttr = attr;
                            this.pathparent = ndpath;
                            this.node = ndpath.immediateparent;
                            this.setXPath( path );

                            this.rerunxpath = true; // From LzDatapointer
                            if ( ndpath.__LZdepChildren == null ){
                                ndpath.__LZdepChildren = [ this ];
                            } else {
                                ndpath.__LZdepChildren.push( this );
                            }
}


var $pathbinding = true;
var setAttr;
var pathparent;
var node;

override function __LZsendUpdate ( a=null , b=null ){ 
    var pchg = this.__LZpchanged;
    if ( ! super.__LZsendUpdate.apply(this, arguments) ) return;
    if ( pchg ||
         this.node[ this.setAttr ] != this.data ||
         this.parsedPath.operator == "attributes" ){
         this.node.setAttribute( this.setAttr , this.data == null ? 
                                               null : this.data );
                                               //this test is necessary or 
                                               //or properties get set to
                                               //undefined
    }
}


/**
  * This matches the LzDelegate method of the same name so that these objects
  * can be stored in a node's __LZdelegates array.
  */
function unregisterAll ( ){ 
    var dca = this.pathparent.__LZdepChildren;

    if (dca != null) {
        for ( var i = 0; i < dca.length ; i++ ){
            if ( dca [ i ] == this ){
                dca.splice( i , 1 );
                break;
            }
        }
    }

    this.destroy();
}


override function setDataContext ( dc, implicit=null ){
    super.setDataContext( dc || this.pathparent, implicit);
}



function updateData (){
    //this code is largely copied from LzDatapath, but it's slightly different
    var dat = this.node[ this.setAttr ];
    if ( this.data == dat ) return;
    var ppdo = this.parsedPath.operator;
    if ( ppdo != null){
        if ( ppdo =="nodeName" ){
            this.setNodeName( dat );
        } else  if ( ppdo =="__LZgetText" ){
            this.setNodeText( dat );
        } else  if ( ppdo =="attributes" ){
            this.p.setAttrs( dat );
        } else {
            //remove the "attributes." from the operator
            this.setNodeAttribute( ppdo.substring( 11 ) , dat );
        }
    }
}

override function toString ( ){ 
    return 'binder ' + this.xpath;
}

if ($debug) {
    function _dbg_name () {
        return Debug.formatToString("%w.%s=\"$path{%w}\"", this.node, this.setAttr, this.xpath);
    }
}

} // End of LzDataAttrBind
