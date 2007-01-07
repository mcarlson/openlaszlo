/******************************************************************************
 * LzNode.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// @param LzNode parent: a node above this one in the hierarchy -- not
// necessarily the immediate parent -- that will decide where this node goes
// @param dictionary args: a dictionary of attributes used to initialize
// this node
//=============================================================================
var mvn = function (){
    var f = function ( parent , attrs , children , instcall ){
        // Node node start
        if ($profile) {
            var nm = null;
            // Have to extract name from attrs
            if (attrs['id'] && (attrs.id != this._ignoreAttribute)) {
                nm = '#' + attrs.id;
            } else if (attrs['name'] && (attrs.name != this._ignoreAttribute)) {
                nm = ((parent == _root.canvas)?'#':'.') + attrs.name;
            }
            if (nm) {
                this._profile_name = nm;
                _level0.$lzprofiler.event('start: ' + nm);
                _level0.$lzprofiler.event(nm, 'calls');
            }
        }
        var iargs =  attrs || {};
        if ( ! iargs.$hasdefaultattrs ){
            for ( var k in iargs ){
                var iargk = iargs[ k ];
                if ( typeof( iargk ) == "object") {
                  var dargk = this.defaultattrs[ k ];
                  if (typeof( dargk) == "object" ) {
                    if ( iargk.__proto__ == Array.prototype ){
                        iargs[ k ] = iargk.concat( dargk );
                    } else {
                        iargk.__proto__ = dargk;
                    }
                  }
                }
                if ( this.defaultattrs.$refs[ k ] ){
                    //override a constraint with a literal
                    if ( ! iargs.$refs ){
                        iargs.$refs = {};
                        //we know the defaultattrs has $refs, so attach it
                        iargs.$refs.__proto__ = this.defaultattrs.$refs;
                    }
                    iargs.$refs[ k ] = this._ignoreAttribute;
                }

            }

            iargs.__proto__ = this.defaultattrs;
        }

        this._instanceAttrs = iargs;
        this._instanceChildren = children;

        var maskedargs = {};
        maskedargs.__proto__ = iargs;

        //Flag if this was newed by the instantiator
        this.__LZisnew = !instcall;

        var c = arguments.callee.prototype.classChildren;
        if ( c.length ){
            // classroot will not be defined for members of a state
            // class, this is hard because the classroot is not a
            // parent of its lexical children
            if (!c.doneClassRoot && !this.$isstate) {
                c.doneClassRoot=true;
                this.__LZassignClassRoot(c, 1);
            }
            children = c.concat( children );
        } else {
            //this is just for parity with the flasm loop
            //the children are pushed before the method call
            children = children.concat();
        }

        this.construct(  parent , maskedargs );

        this.setClassEvents( arguments.callee );

        this.__LZapplyArgs( maskedargs , true );

        var styleMap = this.$styles();
        if ( styleMap ) {
            this.__LZstyleConstraints = this.__LZapplyStyleMap( styleMap, attrs );
        }

        this.constructWithArgs( maskedargs );

        this.onconstruct.sendEvent( this );

        if ( children.length ){
            this.createChildren( children );
        } else {
            this.__LZinstantiationDone( );
        }
        if ($profile) {
            var nm = this['_profile_name'];
            if (nm) {
                _level0.$lzprofiler.event(nm, 'returns');
            } 
            // Set _profile_name to callee.name for annotation in
            // LzInstantiator.makeSomeViews
            else {
                this._profile_name = arguments.callee.name;
            }
        }
    };

    return f;
}

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
LzNode = Class( "LzNode" , null , mvn() );
LzNode.makeDefaultConstructor = mvn;
//LzNode is now class-ified -- didn't actually change reference, but
//re-assigning here for good form.

LzNode.prototype.defaultattrs = { $hasdefaultattrs : true };
LzNode.prototype.isinited = false;
LzNode.prototype.subnodes = null;
//@event ondata: Sent when the data selected by this node's datapath changes.
LzNode.prototype.datapath = null;

//@field LzNode cloneManager: If this node is replicated due to data
//replication, the LzReplicationManager which controls this node.

LzNode.prototype.cloneManager = null;
LzNode.prototype.name = null;
LzNode.prototype.id = null;
//@field String defaultplacement: An attribute used in container classes. If
//set to a non-null value, this forces this node to run its determinePlacement
//method for any node whose parent is this node. If the subnode has its own
//placement attribute, determinePlacement will be called with that value,
//otherwise it will be called with this value. Note that a class's
//defaultplacement attribute only applies to children in subclasses or in
//instances, not to the children of the class itself. This means that if a
//class and its subclass both define a defaultplacement attribute, the
//attribute will be set to one value before the subclass children are created
//and to a different one after they are created. See the
//determinePlacement method.
LzNode.prototype.defaultplacement = null;
LzNode.prototype.placement = null;

// Initial values
LzNode.prototype.$cfn = 0;
LzNode.prototype.__LZdeleted = false;
LzNode.prototype.immediateparent = null;

if ($debug) {
    // The source locator table maps source locations to nodes
    LzNode.sourceLocatorTable = {};

    //---
    // Translate a source locator to the corresponding node
    // @param String sourceLocator: the locator to translate
    // @return any: Either the corresponding LzNode or undefined if
    // the source locator is unknown
    //---
    LzNode.lookupSourceLocator = function (sourceLocator) {
        return this.sourceLocatorTable[sourceLocator];
    }
}


//---
// Default style map.  Will be overridden for classes that have $style
// constraints.
//
// @keywords private
//---
LzNode.prototype.$styles = function () {
  return null;
}

//------------------------------------------------------------------------------
// Process the style map
// @keywords private
// @param Object styleMap: a map of attribute names to the css style
// they are to be constrained to.
// @param Object initialArgs: the attributes specified explicitly for
// this instance (which may override style constraints).
//
// For each style-constrained attribute, if it does not have an
// explicit value defined by the instance, lookup the css value that
// it should be constrained to.  If it is a simple value, set it
// directly, otherwise save it to be applied after the instance is
// fully inited (since the constraint may depend on other attributes).
//------------------------------------------------------------------------------
LzNode.prototype.__LZapplyStyleMap = function ( stylemap, initialArgs) {
    var styleConstraints = {};
    for ( var k in stylemap ) {
        //we are going to bypass the CSS API and call the underlying
        //implementation because we're concerned about speed
        var v = LzCSSStyle.getPropertyValueFor( this , stylemap[ k ] );

        // This is a hack because people want to give color styles as
        // Ox... which is not valid CSS, so they pass it as a string.
        // They really should be using #...
        if ((typeof v == 'string') && (! isNaN(v))) {
            if ($debug) {
                Debug.warn("Invalid CSS value for %w.%s: `%#w`.  Use: `#%06x`.", this, k, v, Number(v));
            }
            v = Number(v);
        }

        // A style does not override an explicit attribute
        // TODO: [2007-01-04 ptw] Use `in` for Legal's
        if (initialArgs && (initialArgs[ k ] === void 0)) {
            // A style that is a function is a constraint
            if (v instanceof Function) {
                styleConstraints[k] = v;
            } else {
//                 Debug.format("%w[%s] (%#w) %#w -> %#w", this, k, stylemap[k], this.k, v);
                this.setAttribute(k, v);
            }
        }
    }
    return styleConstraints;
}

//---
// Process style constraints
// @keywords private
//
// Compute each of the style constraints that were saved above and
// apply them
LzNode.prototype.__LZapplyStyleConstraints = function () {
    if (this.hasOwnProperty('__LZstyleConstraints')) {
        var styleConstraints = this.__LZstyleConstraints;
        for ( var k in styleConstraints ) {
            var fn = styleConstraints[ k ];
            var v = fn.call(this);
//             Debug.format("%w[%s] (%#w) %#w -> %#w", this, k, stylemap[k], this.k, v);
            this.setAttribute(k, v);
        }
    }
}

//------------------------------------------------------------------------------
// The construct() method of a node is called as early as possible --
// before any arguments have been applied. This is the method to override in
// lieu of writing a class constructor for your LZX class. If you override this
// method, you must call the superclass method or your results will be
// extremely unpredictable. Note that construct can only be overriden within
// a subclass definition, not within a customized instance.
// 
// The construct method is also responsible for placing the newly-built view 
// into the appropriate place within its lexical parent's view hierarchy. The 
// process for this is as follows:
// 
// <ul><li>First, if the view has an <attribute>ignoreplacement</attribute> 
// attribute with a <code>true</code> value, then the view will be placed 
// directly under its lexical parent in all cases. The next steps are 
// skipped. </li>
// 
// <li>Second, the placement view name is determined from the first of the 
// following that matches:</li>
// <ul><li>the view's <attribute>placement</attribute> attribute, if that 
// exists; or</li>
// <li>the lexical parent's <attribute>defaultplacement</attribute> attribute, 
// if that exists; or</li>
// <li>nil.</li></ul>
// 
// <li>Third, if there is no placement view name, the subview is placed within 
// its lexical parent (that is, 
// <code>view.immediateparent = view.parent</code>), 
// and the next steps are skipped.</li>
// 
// <li>Fourth, the placement view name is looked up within the lexical parent by 
// calling <code>determinePlacement</code>, and the result is taken as the 
// view's placement view.</li>
// 
// <li>If this new placement view is a subview and it has a 
// <attribute>defaultplacement</attribute> attribute, 
// <code>determinePlacement</code> is called again. This process is repeated 
// until no defaultplacement attribute is found to ensure that all placement 
// directives are correctly followed.</li></ul>
//
// @param LzNode parent: The node that encloses this node in source,
// or the node to which to attach this node.
// @param Object args: A dictionary of initialization arguments that should
// be applied
// to the instance. This contains any arguments that are default arguments
// written in the class definition.
//------------------------------------------------------------------------------
LzNode.prototype.construct = function ( parent , args ){

  //@field LzNode parent: Reference to the node that was passed as this
  // node's ancestor in the constructor.  If this node was created
  // by declaring it in a tag, the parent will be its lexical parent.
  // Its lexical parent is the tag that encloses it. Allow a null parent
  // so that nodes can be garbage collected when they are no longer needed.
  // See also, immediateparent.
  var lp = parent; // lp == lexical parent
  this.parent = lp;

  if (lp) {
    var ip = lp; // ip == immediate parent

    var a = args; // a == args
    if (! a.ignoreplacement) {
      var thisplacement = a.placement;
      if (thisplacement == null) {
        thisplacement = lp.defaultplacement;
      } else {
        this.placement = thisplacement;
      }
      while (thisplacement != null) {
        if ($swf5) {
          // In swf5 the operator == always returns true when comparing 
          // functions
          // (e.g. see http://www.quantumwave.com/flash/inheritanceExample.html)
          // so we can't use the optimization below.
          var pp = ip.determinePlacement( this , thisplacement , args );
        } else {
          if (ip.determinePlacement == LzNode.prototype.determinePlacement) {
            // this is the fast path -- basically inline the relevant part
            // of LzNode.prototype.determinePlacement, below
            var pp = ip.searchSubnodes("name", thisplacement);
            if (pp == null) pp = ip;
          } else {
            // slow path if a subclass has overriden determinePlacement
            var pp = ip.determinePlacement( this , thisplacement , args );
          }
        }
        thisplacement = (pp != ip) ? pp.defaultplacement : null;
        ip = pp;
      }
    }
    
    //@field Array subnodes: An array of all of the LzNodes which consider
    //this LzNode their parent. This list is similar to the subviews list,
    //but it contains all the children of this node, not just the view
    //children.
    var ip_subnodes = ip.subnodes;
    if (ip_subnodes == null) {
      ip_subnodes = new Array;
      ip.subnodes = ip_subnodes;
    }
  
    ip_subnodes[ip_subnodes.length] = this;
    
    var nl = ip.nodeLevel; // nl == nodeLevel
    this.nodeLevel = nl ? nl + 1 : 1;

    //@field LzNode immediateparent: Reference to this nodes's parent
    // in the node hierarchy.  This will be different from "parent"
    // when a class uses placement or defaultplacement to assign a
    // subnode a specific place.  For example, always use immediateparent
    // to get a mouse position in your views coordinate system.
    this.immediateparent = ip;

  } else {
    this.nodeLevel = 1;
  }
}

//-----------------------------------------------------------------------------
// Called at the same time that the node sends its oninit event -- usually
// when the nodes siblings are instantiated, and always after the node's
// children are instantiated.
//-----------------------------------------------------------------------------
LzNode.prototype.init = function ( ){
    // TODO: [2003-05-09 ptw] Move @field to schema attribute

    //this had to go here for the doc generator to recognize it

    //@field Script onconstruct: This script will be run right at the
    //end of the instantiation process, but before any subnodes have
    //been created or references resolved

    //@event onconstruct: This is the first event a node sends, right
    //at the end of the instantiation process, but before any subnodes
    //have been created or references resolved
    return;
}

//------------------------------------------------------------------------------
// Called when the node's subnodes have finished instantiating.
// If this node's parent is inited, this method clears the queue of nodes
// awaiting init.
//
// @keywords protected
//------------------------------------------------------------------------------
LzNode.prototype.__LZinstantiationDone = function (){
    if ( this.immediateparent.isinited ||
         ( this.initstage == "early" ) ||
         ( this.__LZisnew && _root.LzInstantiator.syncNew ) ){
        //we need to init this and its subnodes
        this.__LZcallInit( );
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZsetPreventInit = function ( ){
    this.__LZpreventSubInit = [];
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZclearPreventInit = function ( ){
    var lzp = this.__LZpreventSubInit;
    delete this.__LZpreventSubInit;
    for ( var i = 0; i < lzp.length; i++ ){
        lzp[ i ].__LZcallInit();
    }
}

//------------------------------------------------------------------------------
// @keywords private
// N.B.: LzCanvas replaces this method, so must be kept in sync
//------------------------------------------------------------------------------
LzNode.prototype.__LZcallInit = function ( ){
    if ( this.parent.__LZpreventSubInit ){
        this.parent.__LZpreventSubInit.push( this );
        return;
    }

    //do this now, so that others know that they're too late
    this.isinited = true;

    this.__LZresolveReferences();
    this.__LZapplyStyleConstraints();
    var sl = this.subnodes;
    var i = 0;
    while( i < sl.length ){
        var s = sl[ i++ ];
        //remember next one too
        var t = sl[ i ]
        if ( s.isinited || s.__LZlateinit ) continue;
        s.__LZcallInit( );
        //if the next one is not where it was, back up till we find it or to
        //the beginning of the array
        if ( t != sl[ i ] ){
            // When does this ever happen?
//             Debug.warn('subnodes array changed after %w -> sl[%d]: %w', t, i, sl[i]);
            while ( i > 0 ){
                if ( t == sl[ --i ] ) break;
            }
        }
    }

    // Register in the source locator table, if debugging
    if ($debug) {
        if (this.__LZsourceLocation) {
            _root.LzNode.sourceLocatorTable[this.__LZsourceLocation] = this;
        }
    }

    this.init();
    //@event oninit: This event is sent right before a node becomes active --
    //e.g. before a view displays, or before a layout affects its subviews.
    this.oninit.sendEvent( this );
    this.datapath.__LZApplyDataOnInit();

    // Node node end
    if ($profile) {
        var nm = this['_profile_name'];
        if (nm) {
            _root.$lzprofiler.event('done: ' + nm);
        }
    }
}

//------------------------------------------------------------------------------
// Ensures that the children of this node have been created, and this
// node has been inited.  The LFC does this automatically for nodes
// with initstage other than "late" or "defer".  Call this function to
// force instantiation to complete synchronously for nodes with
// initstage="late", and to force it to happen at all for nodes with
// initstage="defer".
//------------------------------------------------------------------------------
LzNode.prototype.completeInstantiation = function (){
    if ( !this.isinited ){
        var myis = this.initstage;

        //this node should init right after this call, even if the parents
        //aren't done initing
        this.initstage = 'early';
        if ( myis == "defer" ){
            _root.LzInstantiator.createImmediate( this ,this.__LZdeferredcarr );
        } else {
            _root.LzInstantiator.completeTrickle( this );
        }
    }
}

//@field Boolean ignoreAttribute: Setting an argument attribute to this value in the
//construct routine of a subclass of LzNode will prevent further processing
//of the attribute
LzNode.prototype._ignoreAttribute = {toString: function () {
                                        return '_ignoreAttribute'}};
//------------------------------------------------------------------------------
// Applies a dictionary of args
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZapplyArgs = function ( args , constcall ){
      var oset = {};
      var hasset = [];
      if ( args.$setters ){
          this.__LZsetSetters( args.$setters );
      }

      var setrs = this.setters;

      for ( var a in args ){
          //handle flash bug where objects slots are enumerated multiple times
          if ( oset[a] || args[a] === this._ignoreAttribute ) continue;
          oset[ a ] = true;

          if ( setrs[ a ] == null ){
              this[ a ] = args[ a ];
              if ( !constcall ){
                  //then we need to notify the rest of the system that this
                  //value changed.
                  this[ "on" + a ].sendEvent( args[ a ] );
              }
          } else if ( setrs[ a ] != -1 ){
              if ( this.earlySetters[ a ]){
                  if ( hasearly.length ){
                      hasearly.push( a );
                  } else {
                      var hasearly = [ a ];
                  }
              } else{
                  hasset.push( a );
              }
          }
      }

      while(  hasearly.length ){
          var a = hasearly.pop();
          this[ setrs[a] ]( args[ a ] , a );
      }

      while(  hasset.length ){
          var a = hasset.pop();
          this[ setrs[a] ]( args[ a ] , a );
      }
}

//-----------------------------------------------------------------------------
// This function is used to instantiate subnodes.
// LzNodes may override or extend this method to change the
// meaning of attached subnodes.
//
// @keywords protected
//
// @param Array carr: an array of children where the structure of each child [c]
// takes the form:
// c.name = a string containing the name of the child -- usually its
// constructor
// c.args = a dictionary of attributes and values to be passed to the
// constructor of that child
// c.children = an array of children for the new child
//-----------------------------------------------------------------------------
LzNode.prototype.createChildren = function ( carr  ){

    if ( this.__LZdeleted ) return;

    if ( "defer" == this.initstage ){
        this.__LZlateinit = true;
        this.__LZdeferredcarr = carr;
    } else if ( "late" == this.initstage ){
        this.__LZlateinit = true;
        _root.LzInstantiator.trickleInstantiate( this , carr );
    } else if ( ( this.__LZisnew && _root.LzInstantiator.syncNew ) ||
                "immediate" == this.initstage ){
        _root.LzInstantiator.createImmediate( this , carr );
    } else {
        _root.LzInstantiator.requestInstantiation( this , carr );
    }
}
//-----------------------------------------------------------------------------
// returns the value for a property
//
// @param String prop: a string specifying the key of attribute to return.
// @return any: value of named property
//-----------------------------------------------------------------------------
LzNode.prototype.getAttribute = function(prop) {
    if ( null == this.getters[ prop ] ){
        return this[ prop ];
    } else {
        return this[ this.getters[ prop ] ] ();
    }

}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.getProp = LzNode.prototype.getAttribute;

//------------------------------------------------------------------------------
// Sets the named attribute to the given value. If there is no setter for the
// property, this[ prop ] is set to the value, and the event this [ "on"+prop ]
// is sent.
//
// @param String prop: A string naming the key of attribute to set
// @param any val: The value for that attribute
//------------------------------------------------------------------------------
LzNode.prototype.setAttribute = function(prop, val) {
    //@field String name: The name for this subnode. If given, then this node's
    //parent and immediate parent will use store a pointer to this node as the
    //given name value

    //@field String id: A global identifer for this node. If given, a pointer
    //to this node with the given value will be placed in the global namespace

    //@field String datapath: The string to use as this node's datapath. This
    //usually creates a datapath that attaches to the node.

    if ( null == this.setters[ prop ] ){
        this[ prop ] = val;
        this["on" + prop].sendEvent( val );
    } else {
        this[ this.setters[ prop ] ] ( val );
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.setProp = function ( prop , val ){
    if ( $debug ){
        _root.Debug.warn( "setProp is deprecated. Use setAttribute instead." );
    }
    this.setAttribute( prop , val );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype._setProp = LzNode.prototype.setProp;

//-----------------------------------------------------------------------------
// returns the expected value for the specified property, which is the value of
// the property after all executing animators are complete.
//
// FUTURE ENHANCEMENT: add a  time parameter to specify expected value at a
// specific time.
// @keywords private
//
// @param prop: a string specifying the property to return.
// public properties are: x, y, width, height, rotation, alpha
//
// @return: value of named property
//-----------------------------------------------------------------------------
LzNode.prototype.getExpectedAttribute = function(prop) {
    var e_prop = "e_" + prop;
    if ( !this[ e_prop ] ) this[ e_prop ] = {}
    if ( this[e_prop].v == null ) return this[prop];
    return this[ e_prop ].v;
}

//------------------------------------------------------------------------------
// @keywords private
// @param prop: A string naming the attribute to set
// @param val: The value for that attribute
//------------------------------------------------------------------------------
LzNode.prototype.setExpectedAttribute = function(prop, val) {
    var e_prop = "e_" + prop;
    if ( !this[e_prop] ) this[e_prop] = {}
    this[ e_prop ].v = val;
}

//------------------------------------------------------------------------------
// @keywords private
// @param prop: A string naming the attribute to set
// @param val: The value for that attribute
//------------------------------------------------------------------------------
LzNode.prototype.addToExpectedAttribute = function(prop, val) {
    var e_prop = "e_" + prop;
    if ( !this[e_prop] ) this[e_prop] = {}
    if ( this[e_prop].v == null ) this[e_prop].v = this[prop];
    this[ e_prop ].v += val;
}

//------------------------------------------------------------------------------
// @keywords private
// @param prop: A string naming the attribute to set
//------------------------------------------------------------------------------
LzNode.prototype.__LZincrementCounter = function(prop) {
    var e_prop = "e_" + prop;
    var tep = this[e_prop];
    if (!tep) {
        tep = this[e_prop] = {}
    }
    if (!tep.c) {
        tep.c = 0;
    }
    tep.c += 1;
}

// TODO: [2005-04-20 ptw] 'makeChild' really just ought to be called
// 'make' and take the parent as a first argument, so we can
// wrap/override construction for profiling, wysiwyg-ing, automating,
// etc.

//-----------------------------------------------------------------------------
// Makes a child to the specification given in the child hash argument,
// calling the constructor with <i>this</i> as the value for the ancestorView.
//
// @keywords private
// @param e: A hash with the following elements:
// <ul>
// <li>name : [the name of the constructor to use for child]</li>
// <li>attrs: [a hash of named attributes to pass to the constructor for the
// new object</li>
// <li>children: [an array of child objects (to the same specification) for the
// new child</li>
// </ul>
// @param async: If true, children of new node will be created asynchronously
//-----------------------------------------------------------------------------
LzNode.prototype.makeChild = function ( e , async ){
    //e.type = what this child is
    //e.name = subtype
    //e.attrs = init args

    // This can happen if constructing a sibling destroys the parent
    // (which can be triggered by a changed dataset)
    if (this.__LZdeleted) {
        return;
    }
    // This should not happen
    if ($debug) {
        for (var p = this; p != canvas; p = p.immediateparent) {
            if (p.__LZdeleted) {
                Debug.error("%w.makeChild(%w, %w) when %w.__LZdeleted", this, e, async, p);
            }
        }
    }
    var x = _root[ e.name ];
    // TODO: [2005-03-24 ptw] Remove this if we ever enable
    // warnings in the LFC as this will be redundant
    if ($debug) {
        if (! x) { Debug.error('Class %s used before defined', e.name); }
    }
    // TODO: [2005-04-20 ptw] Don't know what this means, preserved
    // for posterity:
    // ... new eval(namespace) [e.name]...
    var w = new x(this, e.attrs , e.children , async );

    return w;
}


LzNode.prototype.setters ={
    name : "setName" ,
    id : "setID" ,
    $events : "__LZsetEvents" ,
    $refs : "__LZstoreRefs" ,
    $delegates : "__LZstoreDelegates" ,
    placement : -1 ,
    datapath : "setDatapath",
    $setters : -1,
    $classrootdepth : "__LZsetClassRoot",
    $datapath : "__LZmakeDatapath"
}

/* this is for the doc generator:
LzNode.prototype.setters.name = "setName"
LzNode.prototype.setters.id = "setID"
LzNode.prototype.setters.placement = -1
LzNode.prototype.setters.datapath = "setDatapath"
*/

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzNode.prototype.__LZsetClassRoot = function ( d ) {

    if (!d) return;

    var p = this.parent;
    while ( --d > 0){ p = p.parent }

    // @field LzNode classroot : a reference to the node that is an instance
    // of the <code>&lt;class&gt;</code> where this node is defined.
    // Members of state subclasses do not define classroot.
    // This is convenient to use when you want to access an attribute of the
    // class in a method or event handler that is nested deep in the node
    // hierarchy.  For example, to set the bgcolor of the class object,
    // instead of
    // <code>parent.parent.parent.setAttribute(bgcolor, 0xFFFFFF)</code>
    // you can simply use <code>classroot.setAttribute(bgcolor, 0xFFFFFF)</code>.
    this.classroot = p;
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzNode.prototype.__LZsetSetters = function ( o ) {
    for ( var s in o ){
        var attrSet = "_anonSet" + s;
        this.__LZaddSetter( s , attrSet );
        this[ attrSet ] = o[ s ];
    }
}

//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzNode.prototype.__LZaddSetter = function ( key , val ) {
    var op = this.__proto__;
    this.__proto__ = Object.prototype;
    var hasnosetters = this.setters == null;
    this.__proto__ = op;
    if ( hasnosetters ){
        var newset = {};
        newset.__proto__ = this.setters;
        this.setters = newset;
    }

    this.setters[ key ] = val;
}

//-----------------------------------------------------------------------------
// Binds the named attribute to the given path, relative to this node's
// datapath. This is the method that is called when the $path{} constraint
// is used. Note that the binding is two-way -- changing the value of the
// attribute will update the data.
// @param String attr: The name of the attribute to bind to the given path.
// @param String path: The xpath (relative to this node's datapath) to which to
// bind the attribute.
//-----------------------------------------------------------------------------
LzNode.prototype.dataBindAttribute = function ( attr , path  ) {
    if ( !this.datapath ){
        this.setDatapath( "." );
    }

    if ( ! this.__delegates ){
        this.__delegates = [];
    }

    this.__delegates.push ( new _root.LzDataAttrBind( this.datapath,
                                                           attr , path ));
}

LzNode.prototype.__LZdelayedSetters ={
    $refs : "__LZresolveRefs" 
}

LzNode.prototype.earlySetters ={
    name            : true ,
    id              : true ,
    $events         : true ,
    $delegates      : true ,
    $classrootdepth : true ,
    $datapath       : true
}

LzNode.prototype.getters ={};


//-----------------------------------------------------------------------------
// @keywords private
//-----------------------------------------------------------------------------
LzNode.prototype.__LZstoreDelegates = function ( delarr ){
    //delarr is a sequence of triplets of the form
    //... eventname, methodname, referenceFunction

    var resarray = [];
    for ( var i = 0; i < delarr.length;i +=3 ){
        if ( delarr[i + 2] ) {
            //let's resolve this later
            resarray.push ( delarr[ i ] , delarr[ i +1 ] , delarr[ i + 2 ] );
        } else {
            var m = delarr[i + 1];
            if ( !this.__delegates ){
                this.__delegates = [];
            }
            this.__delegates.push( new _root.LzDelegate( this , m ,
                                                           this , delarr[i] ) );
        }
    }

    if ( resarray.length ){
        this.__LZstoreAttr( resarray , "$delegates" );
    }

}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZstoreRefs = function ( val , prop ){
    //_root.Debug.write('__LZstoreRefs', this, prop, val);
    for ( var i in val){
        var ref = this[i];
        // if ref is a function, ref == null will be true
        // but !ref will be false
        if (ref == null && !ref) this[i] = null;
    }

    this.__LZstoreAttr( val , prop );
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZstoreAttr = function ( val , prop ){
    if ( this.__LZresolveDict == null ){
        this.__LZresolveDict = {};
    }

    this.__LZresolveDict[ prop ] = val;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZresolveReferences = function (){
    var rdict = this.__LZresolveDict;
    this.__LZresolveDict = null;
    for ( var r in rdict ){
        if ( r == "$delegates" ) continue;
        this[  this.__LZdelayedSetters[ r ] ] ( rdict[ r ] );
    }
    // $delegates : "__LZsetDelegates"
    if ( rdict.$delegates ) this.__LZsetDelegates( rdict.$delegates );
}

//------------------------------------------------------------------------------
// @keywords private
// Take care to evaluate a path expression in the proper environment
// $lzsc$ is the compiler convention for internal variables
// we resort to this in hopes that it is not shadowed in _root or this
// because the compiler is not smart enough to use a register
//------------------------------------------------------------------------------
LzNode.prototype.__LZevalPathExpr = function ($lzsc$rp) {
    with ( _root){
        with( this ){
            return eval( $lzsc$rp );
        }
    }
};

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZresolveRefs = function ( refs ){
    //need to resolve init= before constraints...
    for ( var p in refs ){
        var rp = refs[ p ];
        var pp;
        if ( "string" == typeof( rp ) ){
            rp = _root.LzParsedPath.prototype.trim( rp );
            var qc = rp.charAt( 0 );
            if ( qc =="'" || qc == '"' ){
                //check, and remove quotes
                if ( $debug ){
                    if ( qc != rp.charAt( rp.length -1 ) ){
                        _root.Debug.write( "Bad quoting for $path ",
                                            rp, "in", this );
                    }
                }
                pp = rp.substring( 1 , rp.length-1 );
            } else {
                pp = this.__LZevalPathExpr(rp);
                if ( $debug ){
                    if ( pp == null ){
                        _root.Debug.write( "No value for $path reference",
                                            rp, "in", this );
                    }
                }
            }
            this.dataBindAttribute( p , pp );
        } else if ( !rp.dependencies ){
            this._a = rp ;
            this._a();
        }
    }
    delete this._a;
    // Now resolve the $always values
    for ( var p in refs ){
        if ( refs[ p ].dependencies ){
            this._t = refs[ p ].dependencies;
            this.applyConstraint( p , refs[ p ] , this._t() );
        }
    }
    delete this._t;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZsetDelegates = function ( delarr ){
    if ( delarr.length && !this.__delegates ){
        this.__delegates = [];
    }

    for ( var i = 0; i < delarr.length;i +=3 ){
        this._t = delarr[i + 2];
        var dep = this._t ();
        if ( dep == null ) dep = this;
        var m = delarr[i + 1];
        this.__delegates.push( new _root.LzDelegate(
                                                this , m ,dep , delarr[i] ) );
    }

}

//------------------------------------------------------------------------------
// Applies a constraint for the given attribute.
// @param String prop: The attribute to be constrained to the value of the
// expression
// @param Function cfunc: The function that sets the attribute to the value.
// E.g. function () { this.setAttribute( 'foo' , someOtherFunction() ) }
// @param Array dep: An array of (reference, attribute) pairs that the
// constraint depends on. For instance, if the constraint depends on my x
// and my friend's width, the dependencies array would look like this:
// [ this, "x" , myfriend, "width" ]
//------------------------------------------------------------------------------
LzNode.prototype.applyConstraint = function ( prop , cfunc, dep ){
    if ( dep.length ){
        if ( !this.__delegates ){
            //TODO [ 2004-01-07 AW] Change __delegates to __LZdelegates in the
            //next release
            this.__delegates = [];
        }
        var refF = "$cf" + this.$cfn++;
        this[ refF ] = cfunc;

        for ( var i = 0 ; i < dep.length ; i+=2 ){
            //usually adequate for determining eventname
            //var d = new _root.LzDelegate( this , refF );
            //unrolled...
            var d = { c: this , f : refF ,
                    __proto__ : _root.LzDelegate.prototype };
            d.register( dep[ i ] , "on" + dep[ i + 1 ] );
            this.__delegates.push( d );
        }

        this[ refF ] ();
    } else {
        // else: no dependencies, but we should still call constraint func
        this.$t = cfunc;
        this.$t();
    }
}

//------------------------------------------------------------------------------
// Release the constraint on the named property
// This function doesn't seem to work.  Marking private to remove from docs. -sa
// @keywords private
// @param prop: The property with the constraint to release.
//------------------------------------------------------------------------------
LzNode.prototype.releaseConstraint =  function ( prop ){

    var refF = "_SetCons" + prop;
    this[ refF ].delegate.unregisterAll();
}

//------------------------------------------------------------------------------
// Sets the name of the node.
// @keywords protected
// @param String name: A string to use for the name of this node.
//------------------------------------------------------------------------------
LzNode.prototype.setName = function ( name ){
    if ((typeof(name) == 'string') && name.length) {
        if ($debug) {
            if (this.parent[name] && this.parent[name] !== this) {
                _root.Debug.warn('Redefining %w.%s from %w to %w', 
                                 this.parent, name, this.parent[name], this);
            }
        }
        this.parent[ name ] = this;
        //unless placement is used, this is called twice, but it's faster
        //than checking to see if parent == immediateparent
        //this supports name tunneling.
        if ($debug) {
            if (this.immediateparent[name] && this.immediateparent[name] !== this) {
                _root.Debug.warn('Redefining %w.%s from %w to %w', 
                                 this.immediateparent, name, this.immediateparent[name], this);
            }
        }
        this.immediateparent[  name ] = this;
        this.name = name;
        if ( this.parent == _root.canvas ){
            //it's an id
            if ($debug) {
                if (_root[name] && _root[name] !== this) {
                    _root.Debug.warn('Redefining #%s from %w to %w', 
                                     name, _root[name], this);
                }
            }
            // admit it!  the name is also an id in this case
            if (! this.hasOwnProperty('id')) {
                this.id = name;
            }
            _root[ name ] = this;
        }
    } else {
        if ($debug) {
            // Name is permitted to be null or undefined, meaning
            // "don't name me"
            if (name) {
                _root.Debug.error('Invalid name %w for %w', name, this);
            }
        }
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.defaultSet = function ( val ,prop ){
    if ( val != null ){
        this[ prop ] = val ;
    }
}


//------------------------------------------------------------------------------
// Sets the id of the given to the string given. Nodes that have an id can be
// referred to using just the id.  The id is in the global namespace, unlike
// names which need to be references in a specific context (e.g. 'parent.myname'
// or 'this.myname', vs. simply using 'myid')
// @keywords protected
// @param String id: The id to use for this node.
//------------------------------------------------------------------------------
LzNode.prototype.setID = function ( id ){
    //support for current system
    if ((typeof(id) == 'string') && id.length) {
        if ($debug) {
            if (_root[id] && _root[id] !== this) {
                _root.Debug.warn('Redefining #%s from %w to %w',
                                 id, _root[id], this);
            }
        }
        this.id = id;
        _root[ id ] = this;
    } else {
        if ($debug) {
            // id is permitted to be null or undefined, meaning
            // "don't id me"
            if (id) {
                _root.Debug.error('Invalid id %w for %w',
                                  id, this);
            }
        }
     }
    //namespace system
    //app[ id ] = this;
    //local reference

}

//------------------------------------------------------------------------------
// Sets the datacontext for the node to the xpath given as an argument
// @keywords public
// @param String dp: The string to use as the datapath.
//------------------------------------------------------------------------------
LzNode.prototype.setDatapath = function ( dp ) {
    //@field LzDatapath datapath: A pointer to the LzDatapath attached to this node, if
    //there is one.
    if (null != this.datapath) {
        this.datapath.setXPath(dp);
    } else {
        new _root.LzDatapath ( this, { xpath : dp } );
    }
}


// hack to create an 'abstract' method to hang the doc off of
if ($debug) {
//------------------------------------------------------------------------------
// Called on any node that is declared with a datapath that matches a
// terminal selector, such as <code>text()</code> or
// <code>@<var>attribute</var></code> when the data it matches is
// changed.
// @keywords public
// @param String data: a string representing the matching data
//------------------------------------------------------------------------------
LzNode.prototype.applyData = function ( data ){
}
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZsetEvents = function ( eventHandlers ){
    for (var e in eventHandlers ){
        this.__LZsetDefaultHandler( e , eventHandlers[ e ] );
    }
}
//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZsetDefaultHandler = function ( eName , func ){
    var defHandleName = "_handle" + eName;
    this[ defHandleName ] = func;
    var d = new _root.LzDelegate(this, defHandleName , this, eName  );
    if ( !this.__LZhandlers ){
        this.__LZhandlers = [ d ];
    } else {
        this.__LZhandlers.push( d );
    }
}

//------------------------------------------------------------------------------
// Slot that holds options.  Use getOption and setOption to access.
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.options = null

//------------------------------------------------------------------------------
// Returns the value for an option (set with the options= attribute) for nodes
// created from LZX, or from the dictionary passed as the options attribute
// to the node constructor from script
// @param String key: The option to retrieve
// @return any: The value for that option (or undefined, if the option
// has not been set)
//------------------------------------------------------------------------------
LzNode.prototype.getOption = function ( key ){
    if ( ! this.options ) {
        // undefined
        return void 0;
    }
    return this.options[ key ];
}

//------------------------------------------------------------------------------
// Sets the value for an option (also set with the options= attribute for nodes
// created from LZX, or from the dictionary passed as the options attribute
// to the node constructor from script)
// @param String key: The option to retrieve
// @param any val: The value for the option.
//------------------------------------------------------------------------------
LzNode.prototype.setOption = function ( key , val ){
    if ( !this.options ) this.options = {};
    this.options[ key ] = val;
}

//------------------------------------------------------------------------------
// Determines the immediateparent for a subnode whose parent is this node.
// This method will only be called for subnodes which have a placement
// attribute, or for all subnodes if this node has a non-null defaultplacement.
// The placement attribute of a subnode overrides a parent's defaultplacement.
// This method looks for a subnode with the name given in the placement
// parameter, and returns that node.  If no such named node exists, it returns
// 'this'.
//
// A subclass might implement this method to cause the "placement" parameter
// to have a different behavior or additional effects.
//
// Note that this function is not currently designed to be called by anyone but
// LzNode.construct. Do not expect to be able to 'place' a view properly after
// it has been constructed.
//
// @keywords protected
// @param LzNode aSub: The new subnode
// @param String placement: The placement attribute for the new subnode
// @param dictionary args: The initialization args for the new subnode
// @return LzNode : the node which will be the immediateparent of aSub
//------------------------------------------------------------------------------
LzNode.prototype.determinePlacement = function ( aSub , placement,
                                                         args) {
    // Note that if you modify this function, please check that
    // LzNode.prototype.construct (in this file) is in sync -- it
    // basically inlines this code as an optimization.

    if ( placement == null ){
        var p = null;
    } else {
        var p = this.searchSubnodes( "name" , placement );
    }

    return p == null ? this : p;
}

//------------------------------------------------------------------------------
// Searches immediate subnodes for the given value of the given property. 
// @param String prop: The attribute name to search for
// @param any val: The value of the attribute.
// @return LzNode: The a pointer to subnode with the given property
//------------------------------------------------------------------------------
LzNode.prototype.searchImmediateSubnodes = function (prop, val) {
    var s = this.subnodes;
    for (var i = s.length-1; i >=0; i-- ){
        var si = s[ i ];
        if (si[ prop ] == val ){
            return si;
        }
    }
    return null;
}

//------------------------------------------------------------------------------
// Searches subnodes for the given value of the given property. Note that in
// this release, searchSubnodes actually searches only subviews (and thus is
// identical to LzView.searchSubiews). This bug will be fixed in a future 
// release.
// @param String prop: The attribute name to search for
// @param any val: The value of the attribute.
// @return LzNode: The a pointer to subnode with the given property
//------------------------------------------------------------------------------
LzNode.prototype.searchSubnodes = function ( prop , val) {
    var nextS = this.subnodes.concat();

    while ( nextS.length > 0  ){
        var s = nextS;
        nextS = new Array;
        for (var i = s.length-1; i >=0; i-- ){
            var si = s[ i ];
            if (si[ prop ] == val ){
                return si;
            }
            var sis = si.subnodes;
            for (var j = sis.length - 1; j>=0; j-- ){
                nextS.push( sis[j] );
            }
        }
    }
    return null;
}


_root.LzNode.UIDs = 0;

//-----------------------------------------------------------------------------
// Returns the unique ID of the node.
// @return String: A string representing a unique ID for the node.
//-----------------------------------------------------------------------------
LzNode.prototype.getUID = function (){
    if ( this.__LZUID == null ){
        this.__LZUID = "__U" + ++_root.LzNode.UIDs;
    }

    return this.__LZUID;
}


//-----------------------------------------------------------------------------
// Tests whether the given node is a parent (or grand-parent, etc.) of this
// node.
//
// @param LzNode node: The node to test to see if it is somewhere above
// this one in the node hierarchy
// @return Boolean: true if this node is a child of the given node.
//------------------------------------------------------------------------------
LzNode.prototype.childOf = function( node ){
    if (node == null) { return false; }
    var pv = this;
    //@field Number nodeLevel: The depth of this node in the overall node hierarchy
    while ( pv.nodeLevel >= node.nodeLevel ) {
        if( pv == node ){
            return true;
        }
        pv = pv.immediateparent;
    }
    return false;
}

//------------------------------------------------------------------------------
// Deletes the node and all the subnodes.
// @param Boolean recursiveCall: internal use only
//------------------------------------------------------------------------------
LzNode.prototype.destroy = function( recursiveCall ){
    if (this.__LZdeleted == true) {
        return;
    }

    this.__LZdeleted = true;

    this.ondestroy.sendEvent( this );

    //don't allow a call on this method if I'm deleted
    this.__LZinstantiationDone = null;

    //clear setters object -- this way if we're in applyArgs, we won't run
    //extra code
    this.setters = null;

    //remove this and all subnodes
    if (this.subnodes != null) {
        for (var i = this.subnodes.length -1; i >=0 ; i-- ){
            this.subnodes[i].destroy( true );
        }
    }

    //remove name
    if ( this.name != null ){
        if ( this.parent[ this.name ] == this ){
            delete this.parent[ this.name ];
        }
        if ( this.immediateparent[ this.name ] == this ){
            delete this.immediateparent[  this.name ];
        }
        if ( this.parent == _root.canvas &&  _root[ this.name ] == this ){
            delete _root[ this.name ];
        }
    }

    //remove id
    if ( this.id != null ){
        if ( _root[ this.id ] == this ){
            delete _root[ this.id ];
        }
    }

    //remove __delegates
    if (this.__delegates != null) {
        for ( var i = this.__delegates.length - 1; i >= 0; i-- ){
            this.__delegates[ i ].unregisterAll();
        }
    }
    delete this.__delegates;

    //remove events
    if (this._events != null) {
        for (var i = this._events.length-1; i >=0; i--){
            this._events[i].clearDelegates();
        }
    }
    delete this._events;

    //remove handlers
    if (this.__LZhandlers != null) {
        for ( var i = this.__LZhandlers.length - 1; i >= 0; i-- ){
            this.__LZhandlers[ i ].unregisterAll();
        }
    }
    delete this.__LZhandlers;

    if (this.immediateparent.subnodes) {
        for( var i = this.immediateparent.subnodes.length - 1; i >= 0; i-- ){
            if ( this.immediateparent.subnodes[ i ] == this ){
                this.immediateparent.subnodes.splice( i , 1 );
                break;
            }
        }
    }

    delete this.data;

}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.deleteNode = function( recursiveCall ){
    if ( $debug ){
        _root.Debug.warn( "deleteNode is deprecated. Use destroy instead." );
    }
    this.destroy( recursiveCall );
}
//+++++ Debug stuff

//-----------------------------------------------------------------------------
// animate is the simplest way to animate a property of a node. This method
// creates an animator which will change the value of the given property over
// the given duration. The result of this call is an LzAnimator object. Note
// that the animation is asynchronous -- that is, code that follows this call
// will be executed before the animation finishes. Calling this method with a
// duration of 0 does not create an animator, but instead just calls
// setAttribute.
//
// @keywords changing
//
// @param String prop: a string specifying the property to animate.
//              public properties are: x, y, width, height, rotation, alpha
// @param Number to: the end value of the animation
// @param Number duration: the duration of the animation
// @param Boolean isRelative: is the animator applied to the property
// relatively or not
// @param Object moreargs: A dictionary of attributes to pass to the LzAnimator
// constructor
// @return LzAnimator: a reference to the animator that was added
//-----------------------------------------------------------------------------

LzNode.prototype.animate = function( prop, to, duration, isRelative, moreargs ) {

    if ( duration == 0 ){
        var val = isRelative ? this[ prop ] + to : to;
        this.setAttribute( prop, val );
        return null;
    }

    var args = { attribute : prop , to: to,  duration : duration ,
                 start : true,  relative : isRelative,
                 target : this };

    for( var p in moreargs) args[p] = moreargs[p];

    var animator = new _root.LzAnimator( null, args );

    return animator;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.toString = function (){
    return this.classname + " "  + this.getDebugIdentification();
}

//------------------------------------------------------------------------------
// debugString hook
//
// If the node has an id (and is the value of that id), return that
// (prefixed by #, as a css id would be), if it has a name (and is the
// value of that name in its parent), return that (prefixed by ., as a
// property would be.
//
// If the node has no valid name or id, call the toString method (for
// backward compatibility).  TODO: [2005-07-30 ptw] rewrite all those
// toString methods that really should be _dbg_name methods.
//
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype._dbg_name = function (){
  if ((typeof(this.id) == 'string') && 
      (_root[this.id] === this)) {
    return "#" + this.id;
  } else if ((typeof(this.name) == 'string') &&
             (this.parent[this.name] === this)) {
    return '.' + this.name;
  } else {
      // Don't use LzNode.toString, which is lame
      if (this.toString !== LzNode.prototype.toString) {
          return String(this);
      } else {
          // Return empty string so __String does not call toString
          return "";
      }
  }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.getDebugIdentification = function (){
    var s = "";
    if ( this.name != null ){
        s += " name: " + this.name + " ";
    }
    if ( this.id != null ){
        s += " id: " + this.id + " ";
    }
    return s;
}

//+++++ Wacky class stuff


//------------------------------------------------------------------------------
// Link up the getter/setter/defaultattr inheritance
// @keywords private
// sub : new class that extends this class
//------------------------------------------------------------------------------
LzNode.isExtendedBy = function ( sub ){
    sub.isExtendedBy = this.isExtendedBy;
    sub.makeDefaultConstructor = this.makeDefaultConstructor;

    var s = {};
    s.__proto__ = this.prototype.setters;
    sub.prototype.setters = s;

    var g = {};
    g.__proto__ = this.prototype.getters;
    sub.prototype.getters = g;

    var a = {};
    a.__proto__ = this.prototype.defaultattrs;
    sub.prototype.defaultattrs = a;
}

//------------------------------------------------------------------------------
// called when the first instance of the class is instantiated
// must be called only once for each class
// @param arr: classChildren
// @param depth: call with depth=1 (recursive function)
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZassignClassRoot = function( arr , depth){
    if (arr != null) {
        for ( var i = 0; i < arr.length ; i++ ){
            arr[ i ].attrs.$classrootdepth = depth;
            var a = arr[i].children;
            if ( a.length ){
                var cl =_root[arr[i].name];
                // note: when states are applied, they add their children as
                // siblings therefore classChildren that appear within a state
                // do not gain a level of depth
                this.__LZassignClassRoot( a , cl.prototype.$isstate ? depth : depth+1);
            }
        }
    }
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzNode.prototype.__LZmakeDatapath = function( dpobj ){
    dpobj.__proto__ = Object.prototype;
    this.makeChild( dpobj , true);
}
