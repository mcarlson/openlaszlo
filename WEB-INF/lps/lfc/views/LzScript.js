/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @access public
  * @affects lzscript
  * @topic LZX
  * @subtopic Basics
  */

/**
  * <p>The <code>script</code> element contains JavaScript code that is
  * executed when the application is loaded.  This element must be at the
  * <code>canvas</code> level; that is, it cannot be contained within any
  * subordinate tag. If the <attribute>src</attribute> attribute is
  * present, it names a JavaScript file whose contents are compiled into
  * the application.</p>
  * 
  * <p>
  * In the example below, we add a method to the built-in
  * <code>Array</code> class that will let us find the index of elements
  * in an array. Note that <code>Array.find</code> uses <code>===</code>
  * for finding, so that two objects that are similar will not be
  * confused. This is why looking for <code>{example: 'sneaky'}</code>
  * finds nothing, whereas looking for <code>sneaky</code> succeeds.
  * 
  * </p>
  * 
  * <example>
  * &lt;canvas debug="true" height="200" width="400"&gt;
  *   &lt;script&gt;
  *   &lt;![CDATA[
  *     // Add a find method to Array
  *     Array.prototype.find = function ( what ) {
  *       for (i in this ) {
  *         if (this[i] === what) {
  *           return i;
  *         }       
  *       }
  *     }
  *     
  *     sneaky = {example: 'sneaky'};
  *     tryit = ['foo', 42, sneaky, Math.PI, false];
  *     
  *     Debug.write("42 is at: " + tryit.find(42));
  *     Debug.write("false is at: " + tryit.find(false));
  *     Debug.write("'bar' is at: " + tryit.find('bar'));        
  *     Debug.write("{example: 'sneaky'} is at: " + tryit.find({example: 'sneaky'}));        
  *     Debug.write("sneaky is at: " + tryit.find(sneaky));        
  *   ]]&gt;
  *   &lt;/script&gt;
  * &lt;/canvas&gt;
  * </example> 
  * 
  * @shortdesc A block of JavaScript.
  * @devnote An LzScript is the implementation of the &lt;script&gt; tag.  It ensures that 
  * the script is run in lexical order with surrounding nodes
  * 
  * @access public
  * @lzxname script
  */

public class LzScript extends LzNode {

    static var getters = new LzInheritedHash(LzNode.getters);
    static var defaultattrs = new LzInheritedHash(LzNode.defaultattrs);
    static var options = new LzInheritedHash(LzNode.options);
    static var setters = new LzInheritedHash(LzNode.setters);
    static var __LZdelayedSetters:* = new LzInheritedHash(LzNode.__LZdelayedSetters);
    static var earlySetters:* = new LzInheritedHash(LzNode.earlySetters);

    /** @access private
     * @modifiers override 
     */
    static var tagname = 'script';

    var script:Function;

    public function LzScript ( parent:* , attrs:* , children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
        attrs.script();
    }

}; // End of LzScript


ConstructorMap[LzScript.tagname] = LzScript;
