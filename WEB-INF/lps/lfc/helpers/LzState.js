/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzstate
  * @access public
  * @topic LFC
  * @subtopic Helpers
  */

/**
  * <p>
  * A state is an object that holds its children and attributes for
  * creation or application at a later time &#x2014; when the state's
  * <method>apply</method> method is called. In addition to representing
  * visual state by adding and removing children from a view, states are
  * often used to control constraints which are applied and removed at
  * different times during the run of an application.
  * 
  * </p>
  * 
  * <p>For the most part, the declarative style used in OpenLaszlo applications represents an initial state for the application. All modification to application state can be made using the script API's, but it is often convenient to declaratively describe a bit of application state which may be selectively applied or removed at runtime. The <tagname>state</tagname> tag is provided for this purpose.</p>
  * 
  * <p>Everything within a <tagname>state</tagname> tag acts as if it were written inside the parent when the state is applied. States can contain attributes, methods, and other nodes.</p>
  * 
  * <p>
  * When a state is removed, any children or constraints created when the state was applied are then removed, but attributes that were set by the application of the state are not restored. 
  * </p>
  * 
  * <example title="Using states to represent the min/max state of a window.">
  * &lt;canvas&gt;
  *   &lt;window title="state demo" width="400" height="300"&gt;
  *     &lt;state name="max" apply="true"&gt;
  *       &lt;animatorgroup duration="1000" process="simultaneous"&gt;
  *         &lt;animator attribute="width" to="400"/&gt;
  *         &lt;animator attribute="height" to="300"/&gt;
  * 
  *         &lt;animator attribute="x" to="100"/&gt;
  *         &lt;animator attribute="y" to="100"/&gt;
  *       &lt;/animatorgroup&gt;
  *       &lt;text align="center" y="20%"&gt;M a x i m i z e d&lt;/text&gt;
  *     &lt;/state&gt;
  * 
  *     &lt;state name="min"&gt;
  *       &lt;animatorgroup duration="1000" process="simultaneous"&gt;
  *         &lt;animator attribute="width" to="170"/&gt;
  *         &lt;animator attribute="height" to="100"/&gt;
  *         &lt;animator attribute="x" to="0"/&gt;
  *         &lt;animator attribute="y" to="0"/&gt;
  * 
  *       &lt;/animatorgroup&gt;
  *       &lt;text align="center" valign="middle"&gt;Minimized&lt;/text&gt;
  *     &lt;/state&gt;
  *     &lt;button placement="title_area" align="right" height="16"&gt; Toggle
  *       &lt;attribute name="isMax" value="true"/&gt;
  * 
  *       &lt;handler name="onclick"&gt;
  *         if (this.isMax) { parent.max.remove(); parent.min.apply(); }
  *         else { parent.max.apply(); parent.min.remove(); }
  *         this.isMax = !this.isMax;
  *       &lt;/handler&gt;
  *     &lt;/button&gt;
  *   &lt;/window&gt;
  * &lt;/canvas&gt;
  * </example>
  *  
  * In addition to any fields documented in the section below, these fields are also available:
  *
  * Boolean <attribute>isapplied</attribute>: true if the <class>state</class> is currently applied
  *
  * @shortdesc A description of an instance hierarchy that can be applied and removed at runtime.
  * @lzxname state
  */
class LzState extends LzNode {

    static var getters = new LzInheritedHash(LzNode.getters);
    static var defaultattrs = new LzInheritedHash(LzNode.defaultattrs);
    static var options = new LzInheritedHash(LzNode.options);
    static var setters = new LzInheritedHash(LzNode.setters);
    static var __LZdelayedSetters:* = new LzInheritedHash(LzNode.__LZdelayedSetters);
    static var earlySetters:* = new LzInheritedHash(LzNode.earlySetters);

     var __LZpool = [];
     var __LZstatedelegates;
     var collectArgs:Boolean = true;

    public function LzState ( parent:* , attrs:* , children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
    }



/** @access private
  * @modifiers override 
  */
static var tagname = 'state';

/** Sent when the state is applied. 
 * @lzxtype event
 */
 var onapply = LzDeclaredEvent;

/** Sent when the state is removed 
 * @lzxtype event
 */
 var onremove = LzDeclaredEvent;

/** <code>setAttribute('apply', true)</code> will
  * apply the state.  <code>setAttribute('apply', false)</code> will
  * remove the state.
  * <br /><br />
  * By default, states are not applied.  It is often convenient to
  * assign this attribute as a constraint in the tag.  For example:
  * <code>&lt;state name="mystate" apply="parent.opened"</code> will
  * apply the state if <code>parent.opened</code> is <code>true</code>.
  * <br /><br />
  * Note that for any script that is in the tag, the parent is the tag
  * that encloses the script.  Any method that is declared within the
  * state can only be called after the state is applied, and upon
  * application <code>this</code> will refer to the view that encloses
  * the state, rather than the state itself.
  * @type Boolean
  */
setters.apply = "setApply";
setters.$setters = null;
 static var staterefs = { apply : true };
 static var stateevents = { onremove : true , onapply : true };
prototype.$isstate = true; // Defined in LzNode
 var asyncnew = false;
 var subh = null;
 var pooling = false;
setters.asyncnew = "__LZsetProperty";

/** If true, the state will merely hide any views it has created 
  * when it is removed, instead of destroying them. 
  * @type Boolean
  */
setters.pooling = "__LZsetProperty";

/** When __LZsourceLocation is set, it should only apply to the state,
  * not the parent
  * @access private
  */
setters.__LZsourceLocation = "__LZsetProperty";

    var heldArgs;
    var isapplied;
    var appliedChildren;

    
/**
  * @access private
  */
override function construct ( parent , args ){
    super.construct(parent, args);
    this.heldArgs = {};
    this.appliedChildren = [];
    this.isapplied = false;
}

/**
  * @access private
  */
override function createChildren ( carr ){
    this.subh = carr;
    this.__LZinstantiationDone();
}


/**
  * @access private
  */
function setApply ( doapply ){
    if ( typeof(doapply) == 'function' ){
        // this happens because there is an attribute with the same name as
        // a function and both attributes and functions are sent in
        // the same "attrs" data structure
        // NOTE: [2007-05-16 ptw]
        // This would happen if an LZX subclass of state overrode the
        // apply method.  `addProperty` is the way to dynamically add
        // a method.  YOW!  It seems like a really bad idea to have an
        // attribute and method have the same name and disambiguate by
        // type.  What do we think we are, a LISP2?
        this.addProperty('apply', doapply);
        return;
    }

    if ( doapply ){
        if ( this.isinited ){
            this.apply();
        } else {
            new LzDelegate( this , "apply" , this , "oninit" );
        }
    } else {
        if ( this.isinited ){
            this.remove();
        }
    }
}

/**
  * Applies the state to the state's parent. If the state is already applied,
  * has no effect
  */
function apply ( ){
    //@field Boolean isapplied: true if the state is currently applied
    if ( this.isapplied ){
        return;
    }

    this.isapplied = true;

    //capture delegates created by process of applying state
    var od = this.parent.__LZdelegates;
    this.parent.__LZdelegates = null;

    this.parent.__LZapplyArgs( this.heldArgs );

    if (this.subh) var shl = this.subh.length;
    this.parent.__LZsetPreventInit();

    for ( var i = 0 ; i < shl;  i++ ){
        if ( this.__LZpool && this.__LZpool[ i ] ){
            this.appliedChildren.push( this.__LZretach( this.__LZpool[ i ] ) );
        } else {
            this.appliedChildren.push( this.parent.makeChild( this.subh[ i ] ,
                                                            this.asyncnew));
        }
    }

    this.parent.__LZclearPreventInit();

    this.parent.__LZresolveReferences();
    this.__LZstatedelegates = this.parent.__LZdelegates;

    this.parent.__LZdelegates = od;

    if (this.onapply.ready) this.onapply.sendEvent( this );
}

/**
  * Removes the constraints and views made when the state was applied. This
  * method does not currently restore the previous values of any attributes that
  * were changed by the state
  */
function remove () {
    if ( !this.isapplied ){
        return;
    }

    if (this.onremove.ready) this.onremove.sendEvent( this );
    this.isapplied = false;

    if (this.__LZstatedelegates) {
        for ( var i = 0; i < this.__LZstatedelegates.length; i++ ){
            this.__LZstatedelegates[ i ].unregisterAll();
        }
    }

    if ( this.pooling && this.appliedChildren.length ){
        this.__LZpool = [];
    }

    for ( var i = 0; i < this.appliedChildren.length; i++ ){
        var ac = this.appliedChildren[ i ];
        if ( this.pooling ){
            //if it's a view, we pool it -- otherwise we'll just reconstruct it
            if (ac instanceof LzView){
                this.__LZpool.push ( this.__LZdetach( ac ) );
            } else {
                ac.destroy();
                this.__LZpool.push ( null );
            }
        } else {
            ac.destroy();
        }
    }
    
    this.appliedChildren = [];

}

/**
  * Clean up after yourself
  * @access private
  */
override function destroy (  recursiveCall = null ) {
    // stop pooling
    this.pooling = false;
    // clean up delegates and views
    this.remove();
    // continue
    super.destroy(recursiveCall);
}

/**
 * @devnote We override some methods of LzNode to filter out
 * attributes, setters, and handlers that belong to the state,
 * capturing those that do not for later application/removal to the
 * parent node
 */

/**
  * @access private
  * Capture attributes that don't belong to the state for later
  * application to parent.
  * @devnote NOTE: [2006-12-09 ptw] Currently the only args that apply to the
  * state are args that have setters (which will be intercepted by
  * __LZstoreRefs, q.v.), hence we can just intercept
  * addProperty to capture the 'held args'.
  **/
override function __LZapplyArgs ( args, constcall = null ){
  this.collectArgs = true;
  super.__LZapplyArgs(args);
  this.collectArgs = false;
}

override function addProperty(prop, val) {
    if (this.collectArgs) {
        this.heldArgs[prop] = val;
    }
    super.addProperty(prop, val);
}
        

/**
  * @access private
  * Capture setters that don't belong to the state for later
  * application to the parent (and pass the ones that do apply to the
  * state on to your superclass).
  */
function __LZstoreRefs ( refs, prop ){
    var parrefs = {};
    var myrefs = {};

    for ( var p in refs ){
        // Does this belong to the state?
        if ( LzState.staterefs[ p ] ){
            myrefs[ p ] = refs[ p ]
            var havemyrefs = true;
        } else {
            parrefs[ p ] = refs[ p ];
            var haveparrefs = true;
        }
    }

    if ( havemyrefs ){
        // Install state setters
        super.__LZstoreRefs( myrefs , prop );
    }

    if ( haveparrefs ){
        this.heldArgs[prop] = parrefs;
    }
}

/**
  * @access private
  * Capture handlers that don't belong to the state for later
  * application to the parent (and pass the ones that do apply to the
  * state on to your superclass).
  */
function __LZstoreDelegates ( delarr, ignore = null ){
    var pardels = [];
    var mydels = [];

    for ( var i = 0; i < delarr.length;i +=3 ){
        //does this go with the state or the state's owner?
        //goes with the state ONLY IF the event is an event that the state 
        //sends, and a reference isn't given.
        if ( LzState.stateevents[ delarr[ i ] ] && ! delarr[ i + 2 ] ){
            var arrtopush = mydels;

            //now, capture the method that this calls
            var mname = delarr[ i +1 ];

            //check to see if we already processed this method 
            //in __LZapplyArgs
            if ( this.heldArgs[ mname ] ){
                this[ mname ] = this.heldArgs[ mname ];
                delete this.heldArgs[ mname ];
            }

            //create a setter for this method; by definition attributes that
            //the state has a setter for are handled by the state
            this.__LZaddSetter(  mname , '__LZsetProperty' );
        } else {
            var arrtopush = pardels;
        }

        arrtopush.push( delarr[ i ], delarr[ i + 1], delarr[ i +2 ] );
    }

    if ( mydels.length ){
        // Install state handlers
        super.__LZstoreDelegates( mydels );
    }

    if ( pardels.length ){
        this.heldArgs.$delegates = pardels;
    }
}


/**
  * @access private
  */
function __LZsetProperty ( prop, propname ){
    this[propname] = prop;
}

/**
  * @access private
  */
function __LZdetach ( aview ){
    aview.setVisible( false );
    return aview;
}

/**
  * @access private
  */
function __LZretach ( aview ){
    aview.setVisible( true );
    return aview;
}

} // End of LzState

ConstructorMap[LzState.tagname] = LzState;
