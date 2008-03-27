/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @topic LFC
  * @subtopic Data
  */
  
/**
  * <p><classname>LzDataNode</classname> is the base class for the classes
  * that represent OpenLaszlo's hierarchical data format.</p>
  * 
  * <example>
  * &lt;canvas width="300" height="300"&gt;
  *   &lt;simplelayout axis="y"/&gt;
  * 
  *   &lt;text width="300" height="250" bgcolor="silver" 
  *         multiline="true" name="display"/&gt;
  *   &lt;button&gt;Make some data
  *     &lt;attribute name="currentstep" value="0"/&gt;
  * 
  *     &lt;handler name="onclick"&gt;
  *       &lt;![CDATA[ 
  *       switch(currentstep ++){
  *         case 0:
  *           this.n = <em>new LzDataElement('numbers');</em>
  *           setAttribute('text', 'Add some children');
  *           break;
  *         case 1:
  *           for (var i = 1; i &lt; 11 ; i++){
  *             <em>this.n.appendChild(new LzDataElement('number' , 
  *                                                      {value : i}));</em>
  * 
  *           }
  *           setAttribute('text', 'Add linebreaks');
  *           break;
  *         case 2:
  *           var dp = new LzDatapointer();
  *           dp.setPointer(this.n.getFirstChild());
  *           do {
  *             <em>dp.p.parentNode.insertBefore(new LzDataText('\n'), 
  *                                              dp.p);</em>
  *           } while (dp.selectNext())
  *           dp.p.parentNode.appendChild(new LzDataText('\n')); 
  *           setAttribute('visible', false);
  *           break;
  *       }
  *       display.setText(display.escapeText(n.serialize()));
  *       ]]&gt;
  *     &lt;/handler&gt;
  *   &lt;/button&gt;
  * &lt;/canvas&gt;
  * </example>
  * 
  * @shortdesc The base class for a node of hierarchical data.
  * @devnote LzDataNode is the abstract baseclass for LzDataElement and LzDataText.
  * N.B.: LzDataNode may or may not be an LzNode, so _if_ it were
  * to have an initialize method, it would have to match
  * LzNode.initialize's signature.
  *
  * @devnote Also N.B.: If this _does_ descend from LzNode and has initial
  * data, childNodes will have already been set by applyArgs, so
  * don't set it here!
  */

mixin LzDataNodeMixin {

/** @lzxtype event */
var onownerDocument = LzDeclaredEvent;


/** The type of this node -- ELEMENT_NODE or TEXT_NODE
  * @type Number
  * @keywords abstract
  */
//var nodeType:Number; // This is undefined. Set elsewhere
var nodeType:*;
var parentNode:* = null;
//
var ownerDocument:*;
var __LZo:*;

/** An array of children of this node
  * @type LzDataNode
  */
var childNodes:* = null;

/** @access private */
var __LZcoDirty = true;


/**
  * Returns the sibling before this one this node's parentNodes List of children
  * @return LzDataNode: The node preceeding this one in this node's childNodes
  */
function getPreviousSibling (){
    if (!this.parentNode) return null;
    if ( this.parentNode.__LZcoDirty ) this.parentNode.__LZupdateCO();
    return this.parentNode.childNodes[ this.__LZo - 1 ];
}

/**
 * Returns the parent of this node
 * @return LzDataNode: the parent of this node
 */
function getParent () {
  return this.parentNode;
}

/**
  * gets offset of node in parent's childNodes array
  * @return number
  */
function getOffset (){
    if (!this.parentNode) return 0;
    if (this.parentNode.__LZcoDirty) this.parentNode.__LZupdateCO();

    return this.__LZo;
}

/**
  * @access private
  */
//TODO
/*
prototype.getPreviousSibling.dependencies = function( who, self ){
    return [ this.parentNode , "childNodes" , this , "parentNode" ];
}
*/

/**
  * Returns the sibling after this one this node's parentNodes List of children
  * @return LzDataNode: The node succeeding this one in this node's childNodes
  */
function getNextSibling (){
    if (!this.parentNode) return null;
    if ( this.parentNode.__LZcoDirty ) this.parentNode.__LZupdateCO();
    return this.parentNode.childNodes[ this.__LZo + 1 ];
}

/**
  * @access private
  */
//TODO
/*
prototype.getNextSibling.dependencies = function( who, self ){
    return [ this.parentNode , "childNodes" , this , "parentNode" ];
}
*/

/**
  * Tells whether the given node is above this one in the node hierarchy.
  * @param LzDataElement el: The LzDataElement to test to see if it is above
  * this one
  * @param Boolean allowself: If true, this function returns true if the given
  * node is the same as this node.
  */
// Renamed from childOf to avoid conflict with LzNode.childOf
function childOfNode ( el , allowself ) {
    var p = allowself ? this : this.parentNode
    while ( p ){
        if ( p == el ) return true;
        p = p.parentNode;
    }
    return false;
}

/**
  * Sets the LzDataNode which is the ownerDocument for this node.
  * @param LzDataNode ownerDoc: The LzDataNode to act as the ownerDocument for
  * this node.
  */
function setOwnerDocument ( ownerDoc, val=null ){
    this.ownerDocument = ownerDoc;
    if (this.childNodes) {
        for ( var i = 0; i < this.childNodes.length; i++ ){
            this.childNodes[ i ] .setOwnerDocument( ownerDoc );
        }
    }

    if (this.onownerDocument && this.onownerDocument.ready) {
        this.onownerDocument.sendEvent( ownerDoc );
    }
}

/**
  * @access private
  */
function __LZlockFromUpdate ( locker ){
    this.ownerDocument.__LZdoLock( locker );
}

/**
  * @access private
  */
function __LZunlockFromUpdate ( locker ){
    this.ownerDocument.__LZdoUnlock( locker );
}


/**
  * @access private
  */
function __LZupdateCO (){
    for ( var i = 0; i < this.childNodes.length; i++ ){
        this.childNodes[ i ].__LZo = i;
    }
    this.__LZcoDirty = false;
}
} // End of LzDataNodeMixin


class LzDataNode {

//@problem: how do I document these?
static var ELEMENT_NODE = 1;
static var TEXT_NODE = 3;
static var DOCUMENT_NODE = 9;

/** this is similar to the escape routine in LzText, but that one's shorter
  * since flash it's just for escaping &gt;&lt;
  * @access private
  */
static var __LZescapechars = 
{ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'};


/**
  * @access private
  */
static function __LZXMLescape ( t ){
    if ( typeof( t ) != "string" ) return t;

    var olen = t.length;
    var r = "";
    for ( var i = 0; i < olen; i++ ){
        //handle newlines
        var code = t.charCodeAt( i );
        if ( code < 32 ){
            r += "&#x" + LzUtils.dectohex(code,0) + ";";
        } else {
            var c = t.charAt( i );
            if ( LzDataNode.__LZescapechars[ c ] != null ){
                r += LzDataNode.__LZescapechars[ c ];
            } else {
                r += c;
            }
        }
    }

    return r;
}


/**
  * Converts string to XML data.
  * @param String str: A valid string of XML. If the string is simple text, or
  * that there isn't a single root element, this function returns null. In cases
  * where the string is an invalid but well formatted snippet of XML, this
  * function will close any tags to make for a valid XML document
  * @param boolean trimwhitespace: if true, text nodes have whitespace trimmed from start and end.
  * @param boolean nsprefix: if true, preserve namespace prefixes on node names and attribute names.
  * @return LzDataElement: An LzDataElement which is the top of the hierarchy
  * generated from the string
  */
static function stringToLzData( str, trimwhitespace, nsprefix ) {
    // [todo hqm 2006-06] if we had try-catch, I'd try to catch errors in parseXML
    // and return null in that case. 
    if (str != null && str != "") {
        //Debug.info("stringToLzData: parsing: ", typeof(str), str);
        var nativexml = LzXMLParser.parseXML(str, trimwhitespace, nsprefix);
        var LzNode = LzXMLTranslator.copyXML(nativexml, trimwhitespace, nsprefix);
        return LzNode;
    } else {
        return null;
    }
}

static var whitespaceChars = {' ': true, '\r': true, '\n': true, '\t': true};


/**
  * trim whitespace from start and end of string
  * @access private
  */
static function trim( str ) {
    var whitech = LzDataNode.whitespaceChars;
    var len = str.length;
    var sindex = 0;
    var eindex = str.length -1;
    var ch;
    while (sindex < len) {
        ch = str.charAt(sindex);
        if (whitech[ch] != true) break;
        sindex++;
    }

    while (eindex > sindex) {
        ch = str.charAt(eindex);
        if (whitech[ch] != true) break;
        eindex--;
    }
        
    return str.slice(sindex,eindex+1);
}

} // End of LzDataNode
