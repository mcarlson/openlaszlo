/******************************************************************************
 * LzDataAttrBind.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataAttrBind = function ( ndpath , attr, path ){
    this.setAttr = attr;
    this.pathparent = ndpath;
    this.node = ndpath.immediateparent;
    this.setXPath( path );

    if ( ndpath.__LZdepChildren == null ){
        ndpath.__LZdepChildren = [ this ];
    } else {
        ndpath.__LZdepChildren.push( this );
    }
}

LzDataAttrBind.prototype.__proto__ = LzDatapointer.prototype;
LzDataAttrBind.prototype.rerunxpath = true;
LzDataAttrBind.prototype.$pathbinding = true;

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataAttrBind.prototype.__LZsendUpdate  = function ( a , b ){ 
    var pchg = this.__LZpchanged;
    if ( ! this.__LZdpsendUpdate(  a, b ) ) return;
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

LzDataAttrBind.prototype.__LZdpsendUpdate = 
                                LzDatapointer.prototype.__LZsendUpdate;

//------------------------------------------------------------------------------
// This matches the LzDelegate method of the same name so that these objects
// can be stored in a node's __delegates array.
// @keywords private
//------------------------------------------------------------------------------
LzDataAttrBind.prototype.unregisterAll  = function ( ){ 
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


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataAttrBind.prototype.setDataContext = function ( dc ){
    this.__LZdpsetDataContext( dc || this.pathparent );
}

LzDataAttrBind.prototype.__LZdpsetDataContext = 
                                LzDatapointer.prototype.setDataContext;


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataAttrBind.prototype.updateData = function (){
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

LzDataAttrBind.prototype.toString  = function ( ){ 
    return 'binder ' + this.xpath;
}

if ($debug) {
//---
// @keywords private
//---
LzDataAttrBind.prototype._dbg_name = function () {
    return Debug.formatToString("%w.%s=\"$path{'%w'}\"", this.node, this.setAttr, this.xpath);
}
}
