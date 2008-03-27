/**
  * LzNode.lzs
  *
  *   *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic LZX
  * @subtopic Basics
  * @affects lznode
  * @access public
  */

/** The LzNode class provides the basic interface for OpenLaszlo objects: 
  * parent/child hierarchy, setters, interaction with the instantiator, and 
  * reference resolution. New nodes (and subclasses thereof) can be created by 
  * new-ing the class, like this: 
  * <code> var mynode= new LzNode( parent , args );</code> 
  * where <code>parent</code> is the parent for the new node, and args is an 
  * Object whose name/value pairs are attributes to be set on the new node.
  *
  * @devnote LzNode implements the 'node' tag.  Its subclasses override this
  * value with the tag that they implement and the class initializer
  * installs the class as the handler for the named tag in
  * ConstructorMap.  (So we would like some way to say this must be
  * overridden, but abstract won't cut it!)
  *
  * @shortdesc The base class for all Laszlo classes.
  * @lzxname node
  * @initarg ignoreplacement: Overrides placement attribute (and 
  * defaultplacement in lexical parent). See the 
  * <method>LzNode.determinePlacement</method> method. Defaults to false.
  */
dynamic public class LzNode {

    static var tagname = 'node';

     var __LZdeferDelegates:Boolean = false;
     var _instanceAttrs:* = null;
     var _instanceChildren:Array = null;
     var __LZisnew:Boolean = false;
     var __LZstyleConstraints:* = null;
    //     var  syncNew:Boolean = null;
     var __LZdeferredcarr:Array = null;
     var _events:Array = null;
     var data:* = null;
     var classChildren:Array = null;
     var __LZvizDat:Boolean = true;
     var layouts:* = null; // Used by replication

    //////////////////


    ///////////////////////////////////////////////////////////////////
    // TODO [hqm 2008-01]  This won't work for adding methods that
    // call super(). Need to make those real compile time methods (and setters).
    function addProperty(key:*,val:*):void {
        this[key] = val;
    }

/**
  * @param LzNode parent: a node above this one in the hierarchy -- not
  * necessarily the immediate parent -- that will decide where this node goes
  * @param Object attrs: a dictionary of attributes used to initialize
  * this node.
  * @param Object children
  * @param Boolean instcall
  * @access private
  */
    function LzNode ( parent:* = null, attrs:* = null, children:* = null, instcall:*  = null){
        this.setters = this['constructor'].setters;
        this.getters = this['constructor'].getters;
        this.defaultattrs = this['constructor'].defaultattrs;
        this.options = this['constructor'].options;
        this.__LZdelayedSetters = this['constructor'].__LZdelayedSetters;
        this.earlySetters = this['constructor'].earlySetters;

        this.__LZUID = "__U" + ++LzNode.__UIDs;
        this.__LZdeferDelegates = true;
        var qpos = LzDelegate.__LZdelegatesQueue.length;
        // super.apply(this.arguments)

        // Node node start
        if ($profile) {
            var nm = null;
            // Have to extract name from attrs
            if (attrs) {
                if (attrs['id'] && (attrs.id != LzNode._ignoreAttribute)) {
                    nm = '#' + attrs.id;
                } else if (attrs['name'] && (attrs.name != LzNode._ignoreAttribute)) {
                    nm = ((parent === canvas)?'#':'.') + attrs.name;
                } else if (attrs['_profile_name']) {
                    nm = attrs._profile_name;
                }
            }
            if (nm) {
                this._profile_name = nm;
                Profiler.event('start: ' + nm);
                Profiler.event(nm, 'calls');
            }
        }
        var iargs;
        if (attrs && attrs['$hasdefaultattrs']) {
          // Cloning, just use the clone attributes, they are already
          // defaulted properly
          iargs = attrs;
        } else {
          // Otherwise we create a new hash that inherits the defaults
          iargs = new LzInheritedHash(this.defaultattrs);
          // And merge in our attrs (if any).  Taking care to merge
          // Array and Object attrs correctly, and noting constraints
          // that have been overridden so we can clean up $refs when
          // done.
          if (attrs) {
            var dattrs = this.defaultattrs;
            var dattr$refs = ('$refs' in dattrs) && dattrs.$refs;
            var cleanup = null;
            for ( var k in attrs ){
              var attrk = attrs[ k ];
              // Check for literal overriding a constraint
              if ( dattr$refs && dattr$refs[ k ] ){
                if (! cleanup) { cleanup = {} };
                cleanup[k] = true;
              }
              // Check for object and array merges
              if ( attrk is Object ) {
                var dattrk = dattrs[ k ];
                if ( dattrk is Object ) {
                  if ( attrk is Array ) {
//                     Debug.debug("%w: LzNode.initialize: merging Array %s", this, k);
                    iargs[ k ] = attrk.concat( dattrk );
                    continue;
                  } else if (typeof attrk == 'object') {
//                     Debug.debug("%w: LzNode.initialize: merging Object %s", this, k);
                    var tmp = new LzInheritedHash(dattrk);
                    for (var j in attrk) {
                      tmp[j] = attrk[j];
                    }
                    iargs[ k ] = tmp;
                    continue;
                  }
                }
              }
              // Just a normal value, install it
              iargs[ k ] = attrk;
            }
            // Finish literal over constraint processing
            if (cleanup) {
              // We are going to shadow some defaults, so create a
              // clean hash to do that in if we don't already have
              // one.
              if (! iargs.hasOwnProperty('$refs')) {
                //we know the defaultattrs has $refs, so attach it
                iargs.$refs = new LzInheritedHash(dattr$refs);
              }
              var ia = LzNode._ignoreAttribute;
              for (var k in cleanup) {
                iargs.$refs[ k ] = ia;
              }
            }
          }
        }

        this._instanceAttrs = iargs;
        this._instanceChildren = children;

        // TODO: [2006-05-22 ptw] What is the purpose of this copy?
        // construct or constructWithArgs destructively modify args?
        var maskedargs = new LzInheritedHash(iargs);

        //Flag if this was newed by the instantiator
        this.__LZisnew = !instcall;

        var c = null;
        c = this['constructor'].classChildren;
        if ( c && c.length ){
            // classroot will not be defined for members of a state
            // class, this is hard because the classroot is not a
            // parent of its lexical children
            if (!('doneClassRoot' in c && c.doneClassRoot) && !this.$isstate) {
                c.doneClassRoot=true;
                this.__LZassignClassRoot(c, 1);
            }
            if ( children && children.length ) {
                children = c.concat( children );
            } else {
                // TODO: [2006-05-25 hqm] If we are copying the array in the
                // case above, should we be copying the classChildren array here??
                children = c;
            }
        } else {
            //this is just for parity with the flasm loop
            //the children are pushed before the method call
            if ( children && children.length ) {
                children = children.concat();
            }
        }

        this.construct(  parent , maskedargs );

        //        this.setClassEvents( this.constructor );

        this.__LZapplyArgs( maskedargs , true );

        // If a replicator was made, we're deleted, if pooling is off.
        if (this.__LZdeleted) { return; }

        var styleMap = this.$styles();
        if ( styleMap ) {
            this.__LZstyleConstraints = this.__LZapplyStyleMap( styleMap, attrs );
        }

        /**
          * @todo 2006-05-24 ptw Adam says this is a hack that we should get
          * rid of.
          */
        this.constructWithArgs( maskedargs );

        this.__LZdeferDelegates = false;



        if (qpos != LzDelegate.__LZdelegatesQueue.length) {
            // Drain the events queue back to where we started
            LzDelegate.__LZdrainDelegatesQueue(qpos);
        }

        if (this.onconstruct.ready) this.onconstruct.sendEvent( this );

        if ( children && children.length ){
            this.createChildren( children );
        } else {
            this.__LZinstantiationDone( );
        }

        if ($profile) {
            var nm = this['_profile_name'];
            if (nm) {
                Profiler.event(nm, 'returns');
                this._profile_instantiator_name = nm;
            }
            // Set _profile_instantiator_name to constructor._dbg_name for
            // annotation in LzInstantiator.makeSomeViews
            else {
                this._profile_instantiator_name = this['constructor']._dbg_name;
            }
        }
    }


    function constructWithArgs(args:*) {

    }

/**
  * Link up the getter/setter/defaultattr inheritance
  * @access private
  * @param Object prototype: the class prototype
  */
// class initializer
    static function initialize (prototype:*) {

    // TODO [hqm 2007-12] someone needs to build the tag->classname mapping table,
    // I just commented this code out for now until we figure out how we want to do that
    // in swf9 and/or other runtimes.
    //
    // Install in constructor map 
  // this in a class initializer, is the class
    /*
      if (this.hasOwnProperty('tagname')) {
    var tagname = this.tagname;
    if (tagname) {
      if (ConstructorMap[tagname] !== this) {
        if ($debug) {
          if (tagname in ConstructorMap) {
            Debug.warn("Redefining tag %s from %w to %w",
                       tagname, ConstructorMap[tagname], this);
          }
//           Debug.debug("ConstructorMap[%s] = %s", tagname, this);
        }
        ConstructorMap[tagname] = this;
      }
      if ($debug) {
        // Use the package tag name as the typename
        this._dbg_name = prototype._dbg_typename = 'lz.' + tagname;
      }
    }
//   } else {
//     if ($debug) {
//       Debug.debug("No tag for node class %w", this);
//     }
  }

    */

    // Ensure you have your own private dictionaries, not one
  // inherited from your superclass
        /*  for (var hash in {setters: true, getters: true, defaultattrs: true, options: true, __LZdelayedSetters: true, earlySetters: true} ) {
    if (! prototype.hasOwnProperty(hash)) {
      prototype[hash] = new LzInheritedHash(prototype[hash]);
    }
  }
        */
}

/** This event is sent right before a node becomes active --
  * e.g. before a view displays, or before a layout affects its subviews.
  * @lzxtype event
  */
    var oninit:LzDeclaredEventClass = LzDeclaredEvent;

/** This is the first event a node sends, right
  * at the end of the instantiation process, but before any subnodes
  * have been created or references resolved
  * @lzxtype event
  */
    var onconstruct:LzDeclaredEventClass = LzDeclaredEvent;

/** The ondata script is executed when the data selected by a view's datapath
  * changes.
  * @lzxtype event  
  */
    var ondata:LzDeclaredEventClass = LzDeclaredEvent;
/**
  * If replicated, the index of this clone
  * @lzxtype event
  * @access private
  */
 var clonenumber = null;
/** 
  * @access private 
  * @lzxtype event
  */ 
    var onclonenumber:LzDeclaredEventClass = LzDeclaredEvent;
/** 
  * @lzxtype event
  * @access private
  */ 
    var ondestroy:LzDeclaredEventClass = LzDeclaredEvent;

/** @access private */
    var __LZlateinit:Boolean = false;
/** @access private */
    var __LZpreventSubInit:Array = null;
/** @access private */
 var __LZresolveDict = null;
/** @access private */
 var __LZsourceLocation = null;
/** @access private */
    var __LZUID:String = null;
/** @access private */
    var __LZdelegates:Array = null;

/** @access private */
static var defaultattrs:LzInheritedHash = new LzInheritedHash({ $hasdefaultattrs : true });
 var defaultattrs;

 var $hasdefaultattrs:*;

/**
 * Indicates that a <varname>node</varname>'s <method>init</method> method has been
 * called.  The execution of the <method>init</method> method is under
 * control of the <attribute>initstage</attribute> attribute.
 *
 * @type boolean
 * @keywords read-only
 * @see initstage
 * @see oninit
 * @access private
 */
    var isinited:Boolean = false;

/** An array of all of the LzNodes which consider
  * this LzNode their parent. This list is similar to the subviews list,
  * but it contains all the children of this node, not just the view
  * children.
  *
  * @type Array
  * @keywords readonly
  */
    var subnodes:Array = null;

/** Specifies the data source for this node and its children.
  * If the value begins with an identifier followed by a colon, the
  * identifier names a dataset, and the portion of the string after
  * the colon is an XPath description of a portion of the data.
  * Otherwise the entire attribute value is an XPath description of
  * the data, relative to the data source of this node's parent element.
  * Examples: "mydata:", "mydata:/a/b", "/a/b".
  *
  * @type String
  * @lzxtype string
  * @keywords readonly
  */
    var datapath:* = null;

/** The execution of a <class>node</class>'s <method>init</method> method and
  * sending of the <event>oninit</event> event is under the control
  * of its <attribute>initstage</attribute> attribute, as follows:
  * <dl>
  * <dt><constant>immediate</constant></dt><dd>The <method>init</method> method is called immediately as the
  * last stage of instantiation.
  * </dd>
  * <dt><constant>early</constant></dt><dd>The <method>init</method> method is called immediately after the
  * view and its children have been instantiated.
  * </dd>
  * <dt><constant>normal</constant></dt><dd>The <method>init</method> method is called when the parent
  * is initialized.
  * </dd>
  * <dt><constant>late</constant></dt><dd>The <method>init</method> method is called during idle time.
  * To check whether <method>init</method> has been called, check the <attribute>isinited</attribute>
  * property.  Force calling <method>init</method> using the <method>completeInstantiation</method> method.
  * </dd>
  * <dt><constant>defer</constant></dt><dd>The <method>init</method> method will not be called unless
  * explicitly requested by the <method>completeInstantiation</method> method.
  * </dd>
  * </dl>
  * @lzxtype "early" | "normal" | "late" | "immediate" | "defer"
  * @lzxdefault "normal"
  * @keywords final
  */
    var initstage:String = null;
/** @access private */
    var $isstate:Boolean = false;
/** @access private */
    var doneClassRoot:Boolean = false;

/** Reference to the node that was passed as this
  * node's ancestor in the constructor.  If this node was created
  * by declaring it in a tag, the parent will be its lexical parent.
  * Its lexical parent is the tag that encloses it. Allow a null parent
  * so that nodes can be garbage collected when they are no longer needed.
  * See also, immediateparent.
  * @keywords readonly
  */
    var parent:LzNode;

/** @access private */
    var children:Array = null;

/** If this node is replicated due to data
  * replication, the LzReplicationManager which controls this node.
  * @type LzNode
  * @keywords readonly
  */
    var cloneManager:LzDatapath = null;

/** The name for this subnode. If given, then this node's
  * parent and immediate parent will store a pointer to this node as the
  * given name value.
  * @type String
  * @keywords final
  * @lzxtype token
  */
    var name:String = null;

/** A unique identifier for this element.  Can be used as a global
  * variable name in JavaScript code.
  *
  * @type String
  * @lzxtype ID
  * @keywords final
  * @lzxtype token
  */
    var id:String = null;

/** An attribute used in container classes. If
  * set to a non-null value, this forces this node to run its determinePlacement
  * method for any node whose parent is this node. If the subnode has its own
  * placement attribute, determinePlacement will be called with that value,
  * otherwise it will be called with this value. Note that a class's
  * defaultplacement attribute only applies to children in subclasses or in
  * instances, not to the children of the class itself. This means that if a
  * class and its subclass both define a defaultplacement attribute, the
  * attribute will be set to one value before the subclass children are created
  * and to a different one after they are created. See the
  * determinePlacement method.
  * @type String
  * @lzxtype token
  * @keywords final
  */
    var defaultplacement:String = null;

/** Instructions to this element's container about where it should go
  * within its container's internal hierarchy. See
  * the <method>LzNode.determinePlacement</method> method.
  * Defaults to the container itself.
  * @lzxtype string
  * @keywords final
  */
    var placement:String = null;

// Initial values
/** @access private */
 var $cfn = 0;
/** @access private */
    var __LZdeleted:Boolean = false;

/** Reference to this nodes's parent
  * in the node hierarchy.  This will be different from "parent"
  * when a class uses placement or defaultplacement to assign a
  * subnode a specific place.  For example, always use immediateparent
  * to get a mouse position in your views coordinate system.
  *
  * @type LzNode
  * @keywords readonly
  */
 var immediateparent:LzNode = null;

/** @access private */ 
 var dependencies = null;

/** A reference to the node that is an instance
  * of the <code>&lt;class&gt;</code> where this node is defined.
  * Members of state subclasses do not define classroot.
  * This is convenient to use when you want to access an attribute of the
  * class in a method or event handler that is nested deep in the node
  * hierarchy.  For example, to set the bgcolor of the class object,
  * instead of
  * <code>parent.parent.parent.setAttribute(bgcolor, 0xFFFFFF)</code>
  * you can simply use <code>classroot.setAttribute(bgcolor, 0xFFFFFF)</code>.
  * @type LzNode
  * @keywords readonly
  */
    var classroot:LzNode;

/** The depth of this node in the overall node hierarchy
  * @type Number
  * @keywords readonly
  */
    var nodeLevel:int;

if ($debug) {
    /** The source locator table maps source locations to nodes
      * @access private
      */ 
     var sourceLocatorTable = {};

    /**
      * Translate a source locator to the corresponding node
      * @param String sourceLocator: the locator to translate
      * @return any: Either the corresponding LzNode or undefined if
      * the source locator is unknown
      */
    function lookupSourceLocator (sourceLocator) {
        return this.sourceLocatorTable[sourceLocator];
    }
}


/**
  * Default style map.  Will be overridden for classes that have $style
  * constraints.
  *
  * @access private
  */
function $styles() {
  return null;
}

/**
  * Process the style map.
  * For each style-constrained attribute, if it does not have an
  * explicit value defined by the instance, lookup the css value that
  * it should be constrained to.  If it is a simple value, set it
  * directly, otherwise save it to be applied after the instance is
  * fully inited (since the constraint may depend on other attributes).
  *
  * @param Object stylemap: a map of attribute names to the css style
  * they are to be constrained to.
  * @param Object initialArgs: the attributes specified explicitly for
  * this instance (which may override style constraints).
  * @access private
  */
function __LZapplyStyleMap( stylemap, initialArgs ){
    var styleConstraints = {};    
    for ( var k in stylemap ){
        //we are going to bypass the CSS API and call the underlying
        //implementation because we're concerned about speed
        if (initialArgs[k] != null) {
            // Don't get CSS value if it would be overridden by a instance/class attribute later
            continue;
        }
        var v = LzCSSStyle.getPropertyValueFor( this , stylemap[ k ] );

        // This is a hack because people want to give color styles as
        // Ox... which is not valid CSS, so they pass it as a string.
        // They really should be using #...
        if ((typeof v == 'string') && (v.length > 2) && (v.indexOf('0x') == 0) && (! isNaN(v))) {
            if ($debug) {
                Debug.warn("Invalid CSS value for %w.%s: `%#w`.  Use: `#%06x`.", this, k, v, Number(v));
            }
            v = Number(v);
        }

        // A style does not override an explicit attribute
        if (! (k in initialArgs)) {
            // A style that is a function is a constraint
            if (v is Function) {
                //Only set styleConstraints[k] if this[k] is null.  See LPP-2894 - CSS: subclasses and instances can't override style constraints set on superclass* 
                if (this[k] == null) {
//                    Debug.warn("setting %w[%w] to %w, was %w", this, k, v, this[k]);
                    styleConstraints[k] = v;
                }
            } else {
//                 Debug.format("%w[%s] (%#w) %#w -> %#w", this, k, stylemap[k], this.k, v);
                if (v != null) this.setAttribute(k, v);
            }
        }
    }
    return styleConstraints;
}


/**
  * Process style constraints
  *
  * Compute each of the style constraints that were saved above and
  * apply them
  *
  * @keywords private
  */
function __LZapplyStyleConstraints() {
    var styleConstraints = this.__LZstyleConstraints;
    for ( var k in styleConstraints ) {
        var fn = styleConstraints[ k ];
        var v = fn.call(this);
//             Debug.format("%w[%s] (%#w) %#w -> %#w", this, k, stylemap[k], this.k, v);
        this.setAttribute(k, v);
    }
}


/**
  * The construct() method of a node is called as early as possible --
  * before any arguments have been applied. This is the method to override in
  * lieu of writing a class constructor for your LZX class. If you override this
  * method, you must call the superclass method or your results will be
  * extremely unpredictable. Note that construct can only be overriden within
  * a subclass definition, not within a customized instance.
  * 
  * The construct method is also responsible for placing the newly-built view 
  * into the appropriate place within its lexical parent's view hierarchy. The 
  * process for this is as follows:
  * 
  * <ul><li>First, if the view has an <attribute>ignoreplacement</attribute> 
  * attribute with a <code>true</code> value, then the view will be placed 
  * directly under its lexical parent in all cases. The next steps are 
  * skipped. </li>
  * 
  * <li>Second, the placement view name is determined from the first of the 
  * following that matches:</li>
  * <ul><li>the view's <attribute>placement</attribute> attribute, if that 
  * exists; or</li>
  * <li>the lexical parent's <attribute>defaultplacement</attribute> attribute, 
  * if that exists; or</li>
  * <li>nil.</li></ul>
  * 
  * <li>Third, if there is no placement view name, the subview is placed within 
  * its lexical parent (that is, 
  * <code>view.immediateparent = view.parent</code>), 
  * and the next steps are skipped.</li>
  * 
  * <li>Fourth, the placement view name is looked up within the lexical parent by 
  * calling <code>determinePlacement</code>, and the result is taken as the 
  * view's placement view.</li>
  * 
  * <li>If this new placement view is a subview and it has a 
  * <attribute>defaultplacement</attribute> attribute, 
  * <code>determinePlacement</code> is called again. This process is repeated 
  * until no defaultplacement attribute is found to ensure that all placement 
  * directives are correctly followed.</li></ul>
  *
  * @param LzNode parent: The node that encloses this node in source,
  * or the node to which to attach this node.
  * @param Object args: A dictionary of initialization arguments that should
  * be applied
  * to the instance. This contains any arguments that are default arguments
  * written in the class definition.
  *
  */

    static var nodecount = 0;
function construct ( parent , args ){
    //trace("LzNode.construct", nodecount++, parent, lzcoreutils.objAsString(args));
    if (parent == null) {
        //trace("LzNode construct parent == null, args=", lzcoreutils.objAsString(args));
    }

  var lp = parent; // lp == lexical parent
  this.parent = lp;

  if (lp) {
    var ip = lp; // ip == immediate parent

    var a = args; // a == args
    if (! ('ignoreplacement' in a)) {
        var thisplacement = ('placement' in a) ? a.placement : null;
        if (thisplacement == null) {
            thisplacement = lp.defaultplacement;
        } else {
            this.placement = thisplacement;
        }    
        while (thisplacement != null) {
            if (ip.determinePlacement == LzNode.prototype.determinePlacement) {
                // this is the fast path -- basically inline the relevant part
                // of LzNode.prototype.determinePlacement, below
                var pp = ip.searchSubnodes("name", thisplacement);
                if (pp == null) pp = ip;
            } else {
                // slow path if a subclass has overriden determinePlacement
                var pp = ip.determinePlacement( this , thisplacement , args );
            }

            thisplacement = (pp != ip) ? pp.defaultplacement : null;
            ip = pp;
        }
    }
    
    var ip_subnodes = ip.subnodes;
    if (ip_subnodes == null) {
      ip_subnodes = new Array;
      ip.subnodes = ip_subnodes;
    }
  
    ip_subnodes[ip_subnodes.length] = this;
    
    var nl = ip.nodeLevel; // nl == nodeLevel
    this.nodeLevel = nl ? nl + 1 : 1;

    this.immediateparent = ip;
    if (ip == null) {
        //trace("   immediateparent == null", this, 'parent=', parent);
    }

  } else {
    this.nodeLevel = 1;
  }

}

/**
  * Called at the same time that the node sends its oninit event -- usually
  * when the node's siblings are instantiated, and always after the node's
  * children are instantiated.
  */
function init ( ){

    return;
}

/**
  * Called when the node's subnodes have finished instantiating.
  * If this node's parent is inited, this method clears the queue of nodes
  * awaiting init.
  *
  * @access private
  */
function __LZinstantiationDone (){
    if ( !this.immediateparent ||  this.immediateparent.isinited ||
         ( this.initstage == "early" ) ||
         ( this.__LZisnew && LzInstantiator.syncNew ) ){
        //we need to init this and its subnodes
        this.__LZcallInit( );
    }
}

/**
  * @access private
  */
function __LZsetPreventInit ( ){
    this.__LZpreventSubInit = [];
}

/**
  * @access private
  */
function __LZclearPreventInit ( ){
    var lzp = this.__LZpreventSubInit;
    this.__LZpreventSubInit = null;
    var l = lzp.length;
    for ( var i = 0; i < l; i++ ){
        lzp[ i ].__LZcallInit();
    }
}

/**
  * @access private
  * @devnote LzCanvas replaces this method, so must be kept in sync
  */
    function __LZcallInit (an:* = null ){
    if ( this.parent && this.parent.__LZpreventSubInit ){
        this.parent.__LZpreventSubInit.push( this );
        return;
    }

    //do this now, so that others know that they're too late
    this.isinited = true;

    this.__LZresolveReferences();
    if (this.__LZstyleConstraints) this.__LZapplyStyleConstraints();
    var sl = this.subnodes;
    if (sl) {
        var i = 0;
        var l = sl.length;
        while(i < l){
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
    }

    // Register in the source locator table, if debugging
    if ($debug) {
        if (this.__LZsourceLocation) {
            LzNode.sourceLocatorTable[this.__LZsourceLocation] = this;
        }
    }

    this.init();
    if (this.oninit.ready) this.oninit.sendEvent( this );
    if (this.datapath && this.datapath.__LZApplyDataOnInit) {
        this.datapath.__LZApplyDataOnInit();
    }

    // Node node end
    if ($profile) {
        var nm = this['_profile_name'];
        if (nm) {
            Profiler.event('done: ' + nm);
        }
    }
}

/**
  * Ensures that the children of this node have been created, and this
  * node has been inited.  The LFC does this automatically for nodes
  * with initstage other than <constant>late</constant> or <constant>defer</constant>.  Call this function to
  * force instantiation to complete synchronously for nodes with
  * initstage=<constant>late</constant>, and to force it to happen at all for nodes with
  * initstage=<constant>defer</constant>.
  */
function completeInstantiation (){
    if ( !this.isinited ){
        var myis = this.initstage;

        //this node should init right after this call, even if the parents
        //aren't done initing
        this.initstage = 'early';
        if ( myis == "defer" ){
            LzInstantiator.createImmediate( this ,this.__LZdeferredcarr );
        } else {
            LzInstantiator.completeTrickle( this );
        }
    }
}

/** Setting an argument attribute to this value in the
  * construct routine of a subclass of LzNode will prevent further processing
  * of the attribute
  * @type Boolean
  * @access private
  */
static var _ignoreAttribute = {toString: function () {
                                        return '_ignoreAttribute'}};
                                        
/** 
  * Overrides placement attribute (and defaultplacement in lexical parent). 
  * See the LzNode.determinePlacement method. Defaults to false.
  * @type Boolean
  * @keywords final
  * @lzxdefault "false"
  */
    var ignoreplacement:Boolean;  
                                        

/**
  * Applies a dictionary of args
  * @access private
  */
    function __LZapplyArgs ( args , constcall = null ){
      var oset = {};
      var hasset:Object = [];
      var hasearly = null;
      if ( '$setters' in args && args.$setters ){
          this.__LZsetSetters( args.$setters );
      }

      var setrs = this.setters;

      for ( var a in args ){
          //handle flash bug where objects slots are enumerated multiple times
          if ( oset[a] || args[a] === LzNode._ignoreAttribute ) continue;
          oset[ a ] = true;

          if (setrs &&  setrs[ a ] == null ){
              this.addProperty( a, args[ a ]);
              if ( !constcall ){
                  //then we need to notify the rest of the system that this
                  //value changed.
                  var evt = ("on" + a);
                  if (this[evt] is LzEvent) {
                      if (this[evt].ready) this[ evt ].sendEvent( args[ a ] );
                  } 
              }
          } else if (setrs &&  setrs[ a ] != -1 ){
              if ( this.earlySetters && this.earlySetters[ a ]){
                  if ( hasearly == null){
                      hasearly = [];
                  }
                  hasearly[ this.earlySetters[ a ] ] = a;
              } else{
                  hasset.push( a );
              }
          }
      }

      if (hasearly) {
          for (var i = 1; i < hasearly.length; i++) {
              var a = hasearly[i];
              if (this[setrs[a]]) this[ setrs[a] ]( args[ a ] , a );
          }
      }

      while(  hasset.length ){
          var a = hasset.pop();
          this[ setrs[a] ]( args[ a ] , a );
      }
}

/**
  * This function is used to instantiate subnodes.
  * LzNodes may override or extend this method to change the
  * meaning of attached subnodes.
  *
  * @access protected
  *
  * @param Array carr: an array of children where the structure of each child [c]
  * takes the form:
  * c.name = a string containing the name of the child -- usually its
  * constructor
  * c.args = a dictionary of attributes and values to be passed to the
  * constructor of that child
  * c.children = an array of children for the new child
  */
function createChildren ( carr  ){

    if ( this.__LZdeleted ) return;

    if ( "defer" == this.initstage ){
        this.__LZlateinit = true;
        this.__LZdeferredcarr = carr;
    } else if ( "late" == this.initstage ){
        this.__LZlateinit = true;
        LzInstantiator.trickleInstantiate( this , carr );
    } else if ( ( this.__LZisnew && LzInstantiator.syncNew ) ||
                "immediate" == this.initstage ){
        LzInstantiator.createImmediate( this , carr );
    } else {
        LzInstantiator.requestInstantiation( this , carr );
    }
}

/* returns the value for a property
 *
 * @param String prop: a string specifying the key of attribute to return.
 * @return any: value of named property
 */
function getAttribute(prop) {
   if ( null == this.getters[ prop ] ){
       return this[ prop ];
   } else {
       return this[ this.getters[ prop ] ] ();
   }
}


/**
  * @access private
  */
    //prototype.getProp = getAttribute;

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
        if (this[evt] is LzEvent) {
            if (this[evt].ready) this[ evt ].sendEvent( val );
        }
    }

}

/**
  * @access private
  */
function setProp ( prop , val ){
    if ( $debug ){
      Debug.deprecated(this, arguments.callee, this.setAttribute);
    }
    this.setAttribute( prop , val );
}

/**
  * @access private
  */
    //prototype._setProp = setProp;

/**
  * returns the expected value for the specified property, which is the value of
  * the property after all executing animators are complete.
  *
  * FUTURE ENHANCEMENT: add a time parameter to specify expected value at a
  * specific time.
  * @access private
  *
  * @param prop: a string specifying the property to return.
  * public properties are: x, y, width, height, rotation, alpha
  *
  * @return value of named property
  */
function getExpectedAttribute(prop) {
    var e_prop = "e_" + prop;
    if ( !this[ e_prop ] ) this[ e_prop ] = {}
    if ( this[e_prop].v == null ) return this[prop];
    return this[ e_prop ].v;
}

/**
  * @access private
  * @param prop: A string naming the attribute to set
  * @param val: The value for that attribute
  */
function setExpectedAttribute(prop, val) {
    var e_prop = "e_" + prop;
    if ( !this[e_prop] ) this[e_prop] = {}
    this[ e_prop ].v = val;
}

/**
  * @access private
  * @param prop: A string naming the attribute to set
  * @param val: The value for that attribute
  */
function addToExpectedAttribute(prop, val) {
    var e_prop = "e_" + prop;
    if ( !this[e_prop] ) this[e_prop] = {}
    if ( this[e_prop].v == null ) this[e_prop].v = this[prop];
    this[ e_prop ].v += val;
}

/**
  * @access private
  * @param prop: A string naming the attribute to set
  */
function __LZincrementCounter(prop) {
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

/**
  * Makes a child to the specification given in the child hash argument,
  * calling the constructor with <i>this</i> as the value for the ancestorView.
  *
  * @access private
  *
  * @todo [2005-04-20 ptw] 'makeChild' really just ought to be called
  * 'make' and take the parent as a first argument, so we can
  * wrap/override construction for profiling, wysiwyg-ing, automating,
  * etc.
  *
  * @param e: A hash with the following elements:
  * <ul>
  * <li>name : [the name of the constructor to use for child]</li>
  * <li>attrs: [a hash of named attributes to pass to the constructor for the
  * new object</li>
  * <li>children: [an array of child objects (to the same specification) for the
  * new child</li>
  * </ul>
  * @param async: If true, children of new node will be created asynchronously
  */
function makeChild ( e , async ){
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
            if (p == null) break;
            if (p.__LZdeleted) {
                Debug.error("%w.makeChild(%w, %w) when %w.__LZdeleted", this, e, async, p);
            }
        }
    }
    var x = ConstructorMap[ e.name ];
    // TODO: [2005-03-24 ptw] Remove this if we ever enable
    // warnings in the LFC as this will be redundant
    // TODO [hqm 2008-01] enable this warning unconditionally for now for swf9 debugging
    //    if ($debug) {
    if ((! x) || (! (x is Class))) {
        Debug.error('Class for tag ', e.name, ' has not been defined yet', x);
    }
    //}

    // TODO: [2005-04-20 ptw] Don't know what this means, preserved
    // for posterity:
    // ... new eval(namespace) [e.name]...
    var w;
    if (x) {
        w = new x(this, e.attrs , ('children' in e) ? e.children : null , async );
    } 
    return w;
}


/** @access private */
    static var setters:* =new LzInheritedHash({
    name : "setName" ,
    id : "setID" ,
    $events : "__LZsetEvents" ,
    $refs : "__LZstoreRefs" ,
    $delegates : "__LZstoreDelegates" ,
    options: "__LZsetOptions",
    placement : -1 ,
    datapath : "setDatapath",
    $setters : -1,
    $classrootdepth : "__LZsetClassRoot",
    $datapath : "__LZmakeDatapath"
        });

/** @access private */
    // Declare the instance var.
    var setters:*;

/* this is for the doc generator:
setters.name = "setName"
setters.id = "setID"
setters.placement = -1
setters.datapath = "setDatapath"
setters.data = "setData"
*/

/**
  * @access private
  */
function __LZsetClassRoot ( d ) {

    if (!d) return;

    var p = this.parent;
    while ( --d > 0){ p = p.parent }

    this.classroot = p;
}

/**
  * @access private
  */
function __LZsetSetters ( o ) {
    for ( var s in o ){
        var attrSet = "_anonSet" + s;
        this.__LZaddSetter( s , attrSet );
        this[ attrSet ] = o[ s ];
    }
}

/**
  * @access private
  */
function __LZaddSetter ( key , val ) {
  // Ensure you have your own private setters dictionary
    if (this.setters == this['constructor'].setters) {
        this.setters = new LzInheritedHash(this['constructor'].setters);
    }
    this.setters[key] = val;
}

/**
  * Binds the named attribute to the given path, relative to this node's
  * datapath. This is the method that is called when the $path{} constraint
  * is used. Note that the binding is two-way -- changing the value of the
  * attribute will update the data.
  * @param String attr: The name of the attribute to bind to the given path.
  * @param String path: The xpath (relative to this node's datapath) to which to
  * bind the attribute.
  */
function dataBindAttribute ( attr , path  ) {
    if ( !this.datapath ){
        this.setDatapath( "." );
    }

    if ( ! this.__LZdelegates ){
        this.__LZdelegates = [];
    }

    this.__LZdelegates.push ( new LzDataAttrBind( this.datapath, attr , path ));
}

/** @access private */
static var __LZdelayedSetters = new LzInheritedHash({
    $refs : "__LZresolveRefs"
        });
var __LZdelayedSetters;


/** @access private */
static var earlySetters = new LzInheritedHash({
    name            : 1 ,
    id              : 2 ,
    $events         : 3 ,
    $delegates      : 4 ,
    $classrootdepth : 5 ,
    $datapath       : 6
        });
var earlySetters;

/** @access private */
static var getters:* =new LzInheritedHash({});
var getters:*;

/**
  * @access private
  */
    function __LZstoreDelegates ( delarr, ignore = null ){
    //delarr is a sequence of triplets of the form
    //... eventname, methodname, referenceFunction

    var resarray = [];
    var l = delarr.length;
    for ( var i = 0; i < l;i +=3 ){
        if ( delarr[i + 2] ) {
            //let's resolve this later
            resarray.push ( delarr[ i ] , delarr[ i +1 ] , delarr[ i + 2 ] );
        } else {
            var m = delarr[i + 1];
            if ( !this.__LZdelegates ){
                this.__LZdelegates = [];
            }
            this.__LZdelegates.push( new LzDelegate( this , m , this , delarr[i] ) );
        }
    }

    if ( resarray.length ){
        this.__LZstoreAttr( resarray , "$delegates" );
    }

}


/**
  * @access private
  */
function __LZstoreRefs ( val , prop ){
    //Debug.write('__LZstoreRefs', this, prop, val);
    // NOTE: [2007-05-16 ptw]
    // This loop ensures that each constrained attribute exists in the
    // new instance.  Necessary because of 'implicit this', which will
    // make a free reference (error in Javascript) otherwise.  We have
    // to not shadow inherited values because in some cases (e.g.,
    // lz.state), we actually have a method and an attribute of the
    // same name!  The attribute is implemented by a setter, so it
    // never clobbers the method... er, unless you set the attribute
    // to a function.  YOW!
    for ( var i in val){
        if (! (i in this)) {this[i] = null;}
    }

    this.__LZstoreAttr( val , prop );
}

/**
  * @access private
  */
function __LZstoreAttr ( val , prop ){
    if ( this.__LZresolveDict == null ){
        this.__LZresolveDict = {};
    }

    this.__LZresolveDict[ prop ] = val;
}

/**
  * @access private
  */
function __LZresolveReferences (){
    var rdict = this.__LZresolveDict;
    this.__LZresolveDict = null;
    for ( var r in rdict ){
        if ( r == "$delegates" ) continue;
        this[  this.__LZdelayedSetters[ r ] ] ( rdict[ r ] );
    }
    // $delegates : "__LZsetDelegates"
    if ( rdict && rdict.$delegates ) this.__LZsetDelegates( rdict.$delegates );
}

/**
  * Take care to evaluate a path expression in the proper environment
  * $lzsc$ is the compiler convention for internal variables we resort
  * to this in hopes that it is not shadowed in the with contexts
  * because the compiler is not smart enough to use a register
  * @access private
  */
function __LZevalPathExpr ($lzsc$rp) {
    with (global){
        with( this ){
            return eval( $lzsc$rp );
        }
    }
}

/**
  * @access private
  */
function __LZresolveRefs ( refs ){
    //need to resolve init= before constraints...
    for ( var p in refs ){
        var rp = refs[ p ];
        var pp;
        if ( "string" == typeof( rp ) ){
            rp = LzParsedPath.trim( rp );
            var qc = rp.charAt( 0 );
            if ( qc =="'" || qc == '"' ){
                //check, and remove quotes
                if ( $debug ){
                    if ( qc != rp.charAt( rp.length -1 ) ){
                        Debug.warn( "Bad quoting for $path %w in %w", rp, this );
                    }
                }
                pp = rp.substring( 1 , rp.length-1 );
            } else {
                pp = this.__LZevalPathExpr(rp);
                if ( $debug ){
                    if ( pp == null ){
                        Debug.warn( "No value for $path reference %w in %w",
                                    rp, this );
                    }
                }
            }
            this.dataBindAttribute( p , pp );
        } else if ( !('dependencies' in rp && rp.dependencies) ){
            if (rp is Function) {
                rp.call(this);
            }
        }
    }

    // Now resolve the $always values
    for ( var p in refs ){
        // The string check prevents a dhtml error
        var rp = refs[ p ];
        if (rp is Function && ('dependencies' in rp)) {
            this.applyConstraint( p , rp , rp.dependencies.call(this) );
        }
    }
}

/**
  * @access private
  */
function __LZsetDelegates ( delarr ){
    if ( delarr.length && !this.__LZdelegates ){
        this.__LZdelegates = [];
    }

    var l = delarr.length;
    for ( var i = 0; i < l;i +=3 ){
        var senderexp = delarr[i + 2];
        var sender = (senderexp != null) ? senderexp.call(this): null;
        if ( sender == null ) sender = this;
        var meth = delarr[i + 1];
        this.__LZdelegates.push( new LzDelegate( this , meth ,sender , delarr[i] ) );
    }

}

/**
  * Applies a constraint for the given attribute.
  * @param String prop: The attribute to be constrained to the value of the
  * expression
  * @param Function cfunc: The function that sets the attribute to the value.
  * E.g. function () { this.setAttribute( 'foo' , someOtherFunction() ) }
  * @param Array dep: An array of (reference, attribute) pairs that the
  * constraint depends on. For instance, if the constraint depends on my x
  * and my friend's width, the dependencies array would look like this:
  * [ this, "x" , myfriend, "width" ]
  */
function applyConstraint ( prop , cfunc, dep ){
    var l = dep.length;
    if (l){
        if ( !this.__LZdelegates ){
            this.__LZdelegates = [];
        }
        var refF = "$cf" + this.$cfn++;
        this[ refF ] = cfunc;

        // NOTE: [2006-05-30 ptw] You may think to yourself 'this is
        // not my large automobile', I can move that `new LzDelegate`
        // out of the loop and register it against each dependency.
        // But that will break, at least, the centering of text in a
        // component button.  My suspicion is that this is because of
        // the mechanism in sendEvent that prevents the same delegate
        // from being called more than once in an event chain.  This
        // little inefficiency permits the same constraint function to
        // be called more than once in an event chain, because it gets
        // a separate delegate for each dependency, and people have
        // written code that only works because of this loophole...
        var dp;
        for ( var i = 0 ; i < l ; i+=2 ){
            var d = new LzDelegate( this , refF );
            this.__LZdelegates.push( d );
            dp = dep[ i ];
            if (dp) {
                d.register( dp, "on" + dep[ i + 1 ] );
            }
        }
    }
    // Whether there are dependencies or not, we need to invoke the
    // constraint function (since the dependencies may have 'fired'
    // before the constraint was installed).
    cfunc.call(this);
}

/**
  * Release the constraint on the named property
  * This function doesn't seem to work.  Marking private to remove from docs. -sa
  * @access private
  * @param prop: The property with the constraint to release.
  */
function releaseConstraint ( prop ){

    var refF = "_SetCons" + prop;
    if (refF in this)
        this[ refF ].delegate.unregisterAll();
}

/**
  * Sets the name of the node.
  * @access protected
  * @param String name: A string to use for the name of this node.
  */
function setName ( name, ignore = null ){
    if ((typeof(name) == 'string') && name.length) {
        if ($debug) {
            if (this.parent && this.parent[name] && this.parent[name] !== this) {
                Debug.warn('Redefining %w.%s from %w to %w', 
                           this.parent, name, this.parent[name], this);
            }
        }
        if (this.parent) this.parent[ name ] = this;
        //unless placement is used, this is called twice, but it's faster
        //than checking to see if parent == immediateparent
        //this supports name tunneling.
        if ($debug) {
            if (this.immediateparent && this.immediateparent[name] && this.immediateparent[name] !== this) {
                Debug.warn('Redefining %w.%s from %w to %w', 
                           this.immediateparent, name, this.immediateparent[name], this);
            }
        }
        if (this.immediateparent) this.immediateparent[  name ] = this;
        this.name = name;
        if ( this.parent === canvas ){
            //it's an id
            if ($debug) {
                if (global[name] && global[name] !== this) {
                    Debug.warn('Redefining #%s from %w to %w', 
                               name, global[name], this);
                }
            }
            // admit it!  the name is also an id in this case
            if (! this.hasOwnProperty('id')) {
                this.id = name;
            }
            // TODO: [2006-03-22 ptw] Should id's really go in the user/canvas module?
            global[ name ] = this;
        }
    } else {
        if ($debug) {
            // Name is permitted to be null or undefined, meaning
            // "don't name me"
            if (name) {
                Debug.error('Invalid name %w for %w', name, this);
            }
        }
    }
}

/**
  * @access private
  */
function defaultSet ( val ,prop ){
    if ( val != null ){
        this[ prop ] = val ;
    }
}


/**
  * Sets the id of the given to the string given. Nodes that have an id can be
  * referred to using just the id.  The id is in the global namespace, unlike
  * names which need to be references in a specific context (e.g. 'parent.myname'
  * or 'this.myname', vs. simply using 'myid')
  * @access protected
  * @param String id: The id to use for this node.
  */
    function setID ( id , ignore = null){
    //support for current system
    if ((typeof(id) == 'string') && id.length) {
        if ($debug) {
            if (global[id] && global[id] !== this) {
                Debug.warn('Redefining #%s from %w to %w',
                           id, global[id], this);
            }
        }
        this.id = id;
        // TODO: [2006-03-22 ptw] Should id's really go in the user/canvas module?
        global[ id ] = this;
    } else {
        if ($debug) {
            // id is permitted to be null or undefined, meaning
            // "don't id me"
            if (id) {
                Debug.error('Invalid id %w for %w', id, this);
            }
        }
     }
    //namespace system
    //app[ id ] = this;
    //local reference

}

/**
  * Sets the datacontext for the node to the xpath given as an argument
  * @access public
  * @param String dp: The string to use as the datapath.
  */
    function setDatapath ( dp , ignore = null) {
    if (null != this.datapath && dp != LzNode._ignoreAttribute) {
        this.datapath.setXPath(dp);
    } else {
        // LzDatapath will set datapath of its immediateparent
        new LzDatapath ( this, { xpath : dp } );
    }
}

  /**
   * Sets the datacontext for the node to the data element given as an
   * argument
   * @access public
   * @param LzDataElement data: The dataelement to use as the context
   */
  function setData(data, headers = null) {
    this.data = data;
    var dp = (this.datapath != null) ? this.datapath : new LzDatapath(this);
    dp.setPointer(data);
    if (this.ondata.ready) this.ondata.sendEvent(data);
  }


// hack to create an 'abstract' method to hang the doc off of
if ($debug) {
/**
  * Called on any node that is declared with a datapath that matches a
  * terminal selector, such as <code>text()</code> or
  * <code>@<var>attribute</var></code> when the data it matches is
  * changed.
  * @access public
  * @param String data: a string representing the matching data
  */
function applyData ( data ){
}
}

// See LzView for the real definition
function __LZupdateShown( ) {
}

/**
  * @access private
  */
function __LZsetEvents ( eventNames ){
    var n = eventNames.length;
    for (var i = 0; i < n; i++) {
        var ename = eventNames[i];
        this[ename] = LzDeclaredEvent;
    }
}

/**
  * A list of CSS property names and values that configure the
  * behavior of objects, such as data binding and view layouts, that
  * operate on this view.
  *
  * @devnote The initial value for this object is a type-correct sentinel
  * that allows getting options by node.options['name'], but options
  * _must_ be set using the setter, or the sentinel will be smashed.
  *
  * @lzxtype css
  * @keywords final
  * @access private
  */
static var options:* = new LzInheritedHash({});
var options:*;


  /**
    * Setter to install options on a class or instance
    *
    * @access private
    */
  function __LZsetOptions(hash) {
    // Ensure you have your own private options dictionary, not the one
    // inherited from your class, nor the default empty one inherited
    // from LzNode!
    if (this.options == this['constructor'].options) {
      this.options = new LzInheritedHash(this['constructor'].options);
    }
    for (var key in hash) {
      this.options[ key ] = hash[key];
    }
  }


/**
  * Returns the value for an option (set with the options= attribute) for nodes
  * created from LZX, or from the dictionary passed as the options attribute
  * to the node constructor from script
  * @param String key: The option to retrieve
  * @return any: The value for that option (or undefined, if the option
  * has not been set)
  */
function getOption ( key ){
    return this.options[ key ];
}

/**
  * Sets the value for an option (also set with the options= attribute for nodes
  * created from LZX, or from the dictionary passed as the options attribute
  * to the node constructor from script)
  * @param String key: The option to set
  * @param any val: The value for the option.
  */
function setOption ( key , val ){
    // Ensure you have your own private options dictionary, not the one
    // inherited from your class, nor the default empty one inherited
    // from LzNode!
    if (! this.hasOwnProperty('options')) {
      this.options = new LzInheritedHash(this.options);
    }
    this.options[ key ] = val;
}

/**
  * Determines the immediateparent for a subnode whose parent is this node.
  * This method will only be called for subnodes which have a placement
  * attribute, or for all subnodes if this node has a non-null defaultplacement.
  * The placement attribute of a subnode overrides a parent's defaultplacement.
  * This method looks for a subnode with the name given in the placement
  * parameter, and returns that node.  If no such named node exists, it returns
  * 'this'.
  *
  * A subclass might implement this method to cause the "placement" parameter
  * to have a different behavior or additional effects.
  *
  * Note that this function is not currently designed to be called by anyone but
  * LzNode.construct. Do not expect to be able to 'place' a view properly after
  * it has been constructed.
  *
  * @access protected
  * @param LzNode aSub: The new subnode
  * @param String placement: The placement attribute for the new subnode
  * @param dictionary args: The initialization args for the new subnode
  * @return LzNode : the node which will be the immediateparent of aSub
  */
function determinePlacement ( aSub , placement,
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

/**
  * Searches immediate subnodes for the given value of the given property. 
  * @param String prop: The attribute name to search for
  * @param any val: The value of the attribute.
  * @return LzNode: A pointer to a subnode with the given property, or null.
  */
function searchImmediateSubnodes (prop, val) {
    var s = this.subnodes;
    if (s == null) return null;
    for (var i = s.length-1; i >=0; i-- ){
        var si = s[ i ];
        if (si[ prop ] == val ){
            return si;
        }
    }
    return null;
}

/**
  * Searches subnodes for the given value of the given property. Note that in
  * this release, searchSubnodes actually searches only subviews (and thus is
  * identical to LzView.searchSubiews). This bug will be fixed in a future 
  * release.
  * @param String prop: The attribute name to search for
  * @param any val: The value of the attribute.
  * @return LzNode: The a pointer to subnode with the given property
  */
function searchSubnodes ( prop , val) {
    var nextS = (this.subnodes) ? this.subnodes.concat() : [];

    while ( nextS.length > 0  ){
        var s = nextS;
        nextS = new Array;
        for (var i = s.length-1; i >=0; i-- ){
            var si = s[ i ];
            if (si[ prop ] == val ){
                return si;
            }
            var sis = si.subnodes;
            if (sis) {
                for (var j = sis.length - 1; j>=0; j-- ){
                    nextS.push( sis[j] );
                }
            }
        }
    }
    return null;
}

/**
  * Search up parent views for a named property. For now, returns when it finds
  * the first one.
  * 
  * @param String prop: named property
  * @return LzView: the first view which has a non-null value for <param>prop</param>
  * or <i>null</i> if none is found
  */
function searchParents ( prop ){
    var sview = this;
    do{
        sview = sview.immediateparent;

        // TODO [hqm 2008-02] put this check in a $debug, when that is working for swf9
        if (sview == null) {
            Debug.error('searchParents got null immediateparent', this);
            return;
        }

        if (sview[ prop ] != null ){
            return sview;
        }
    }while ( sview != canvas );
}

/**
  * @access private
  */
static var __UIDs = 0;

/**
  * Returns the unique ID of the node.
  * @return String: A string representing a unique ID for the node.
  */
function getUID (){
    return this.__LZUID;
}


/**
  * Tests whether the given node is a parent (or grand-parent, etc.) of this
  * node.
  *
  * @param LzNode node: The node to test to see if it is somewhere above
  * this one in the node hierarchy
  * @return Boolean: true if this node is a child of the given node.
  */
function childOf( node ){
    if (node == null) { return false; }
    var pv = this;
    while ( pv.nodeLevel >= node.nodeLevel ) {
        if( pv == node ){
            return true;
        }
        pv = pv.immediateparent;
    }
    return false;
}

/**
  * Deletes the node and all the subnodes.
  * @param Boolean recursiveCall: internal use only
  */
    function destroy( recursiveCall = null){
    if (this.__LZdeleted == true) {
        return;
    }

    this.__LZdeleted = true;

    if (this.ondestroy.ready) this.ondestroy.sendEvent( this );

    //don't allow a call on this method if I'm deleted
    if ($swf9) {
        // flex compiler gives error if you assign a function to null
    } else {
        this.__LZinstantiationDone = null;
    }

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
            this.parent[ this.name ] = null;
        }
        if ( this.immediateparent[ this.name ] == this ){
            this.immediateparent[  this.name ] = null;
        }
        if ( this.parent === canvas &&  global[ this.name ] === this ){
            // FIXME [2006-10-05 pbr] (LPP-1871) Revert to deleting from global when modules are implemented.
            // TODO [2006-10-05 pbr] remove $dhtml by moving to a kernel API or when SWF backend supports try/cath.
            if ($js1) {
                try {
                    delete global[this.name];
                } catch (e) {
                    // If you can't delete, set to undefined
                    global[this.name] = void 0;
                }
            } else {
                delete global[this.name];
            }
        }
    }

    //remove id
    if ( this.id != null ){
        if ( global[ this.id ] === this ){
            // FIXME [2006-10-05 pbr] (LPP-1871) Revert to deleting from global when modules are implemented.
            // TODO [2006-10-05 pbr] remove $dhtml by moving to a kernel API or when SWF backend supports try/cath.
            if ($js1) {
                try {
                    delete global[this.id];
                } catch (e) {
                    // If you can't delete, set to undefined
                    global[this.id] = void 0;
                }
            } else {
                delete global[this.id];
            }
        }
    }

    //remove __LZdelegates
    if (this.__LZdelegates != null) {
        for ( var i:int = this.__LZdelegates.length - 1; i >= 0; i-- ){
            this.__LZdelegates[ i ].unregisterAll();
        }
    }
    this.__LZdelegates = null;

    //remove events
    if (('_events' in this) &&  (this._events != null)) {
        for (var i:int = this._events.length-1; i >=0; i--){
            this._events[i].clearDelegates();
        }
    }
    this._events = null;

    if (this.immediateparent && this.immediateparent.subnodes) {
        for( var i:int = this.immediateparent.subnodes.length - 1; i >= 0; i-- ){
            if ( this.immediateparent.subnodes[ i ] == this ){
                this.immediateparent.subnodes.splice( i , 1 );
                break;
            }
        }
    }

    this.data = null;

    if ($profile) {
        var nm = this['_profile_name'];
        if (nm) {
            Profiler.event('destroy: ' + nm);
        }
    }

}

/**
  * @access private
  */
function deleteNode( recursiveCall = null ){
    if ( $debug ){
      Debug.deprecated(this, arguments.callee, this.destroy);
    }
    this.destroy( recursiveCall );
}
//+++++ Debug stuff

/**
  * animate is the simplest way to animate a property of a node. This method
  * creates an animator which will change the value of the given property over
  * the given duration. The result of this call is an LzAnimator object. Note
  * that the animation is asynchronous -- that is, code that follows this call
  * will be executed before the animation finishes. Calling this method with a
  * duration of 0 does not create an animator, but instead just calls
  * setAttribute.
  *
  * @keywords changing
  *
  * @param String prop: a string specifying the property to animate.
  *              public properties are: x, y, width, height, rotation, alpha
  * @param Number to: the end value of the animation
  * @param Number duration: the duration of the animation
  * @param Boolean isRelative: is the animator applied to the property
  * relatively or not
  * @param Object moreargs: A dictionary of attributes to pass to the LzAnimator
  * constructor
  * @return LzAnimator: a reference to the animator that was added
  */

function animate( prop, to, duration, isRelative = null, moreargs = null ) {

    if ( duration == 0 ){
        var val = isRelative ? this[ prop ] + to : to;
        this.setAttribute( prop, val );
        return null;
    }

    var args = { attribute : prop , to: to,  duration : duration ,
                 start : true,  relative : isRelative,
                 target : this };

    for( var p in moreargs) args[p] = moreargs[p];

    var animator = new LzAnimator( null, args );

    return animator;
}

/**
  * @access private
  */
function toString (){
    return this['constructor'].classname + " "  + this.getDebugIdentification();
}

/**
  * debugString hook
  *
  * If the node has an id (and is the value of that id), return that
  * (prefixed by #, as a css id would be), if it has a name (and is the
  * value of that name in its parent), return that (prefixed by ., as a
  * property would be.
  *
  * If the node has no valid name or id, call the toString method (for
  * backward compatibility).  TODO: [2005-07-30 ptw] rewrite all those
  * toString methods that really should be _dbg_name methods.
  *
  * @access private
  */
function _dbg_name (){
  if ((typeof(this.id) == 'string') && 
      (global[this.id] === this)) {
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

/**
  * @access private
  */
function getDebugIdentification (){
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


/**
  * called when the first instance of the class is instantiated
  * must be called only once for each class
  * @param arr: classChildren
  * @param depth: call with depth=1 (recursive function)
  * @access private
  */
function __LZassignClassRoot( arr , depth){
    if (arr != null) {
        var l = arr.length;
        for ( var i = 0; i < l ; i++ ){
            arr[ i ].attrs.$classrootdepth = depth;
            var a = ('children' in arr[i]) ? arr[i].children : null;
            if ( a && ('length' in a) ){
                var cl = ConstructorMap[arr[i].name];
                // note: when states are applied, they add their children as
                // siblings therefore classChildren that appear within a state
                // do not gain a level of depth
                this.__LZassignClassRoot( a , (('$isstate' in cl.prototype) && (cl.prototype.$isstate)) ? depth : depth+1);
            }
        }
    }
}

public static function objAsString(obj) {
    var s = "";
        for (var k in obj) {
            s+= k +": "+obj[k];
            s+=", ";
        }
        return s;
    }

/**
  * @access private
  */
function __LZmakeDatapath( dpobj, value=null ){
    if (! (dpobj is Object)) {
        if ($debug) {
            Debug.debug('__LZmakeDatapath on non-object %w?', dpobj)
                }
    }
    this.makeChild( dpobj , true);
}



////////////////////////////////////////////////////////////////
    //debugging temp func


} // End of LzNode

ConstructorMap[LzNode.tagname] = LzNode;


