/**
  * LaszloLayout.lzs 
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic LFC
  * @subtopic Controllers
  * @affects lzlayout
  * @access public
  */
  
/**
  * <p>This layout class is the base class that all other layouts &#x2014;
  * such as, for example <tagname>simplelayout</tagname> and
  * <tagname>resizelayout</tagname> &#x2014; extend.</p>
  * 
  * <p>A layout arranges the views within the element that it is attached
  * to.  <classname>simplelayout</classname> is one example of a basic
  * extension of this layout object, and the code sample below illustrates
  * its use.</p> 
  * 
  * <p>For example, the layout in:</p>
  * 
  * <example><programlisting>
  * &lt;canvas height="30"&gt;
  *   &lt;view&gt;
  *     &lt;text&gt;A&lt;/text&gt;
  *     &lt;text&gt;B&lt;/text&gt;
  *     &lt;simplelayout axis="y"/&gt;
  *   &lt;/view&gt;
  * &lt;/canvas&gt;
  * </programlisting></example>
  * 
  * <p>is necessary to keep the A and B text views from being positioned
  * on top of each other.  As an alternative to the
  * <tagname>layout</tagname> element, a view may specify a
  * <attribute>layout</attribute> attribute.  For example, the previous
  * example is equivalent to:</p>
  * 
  * <example><programlisting class="program" id="layout-2">
  * &lt;canvas height="30"&gt;
  *   &lt;view layout="axis: y"&gt;
  *     &lt;text&gt;A&lt;/text&gt;
  *     &lt;text&gt;B&lt;/text&gt;
  *   &lt;/view&gt;
  * &lt;/canvas&gt;
  * </programlisting></example>
  * 
  * <p>You do not use <tagname>layout</tagname> to explicitly position
  * views.  Rather, you may extend this class to create new types of
  * layouts.</p>
  * 
  * <p>
  * Layouts, like constraints and animators, affect specific attributes of a view. Views can have more than one layout, as long as each set of attributes
  * associated with a layout does not overlap with any of the other sets.</p>
  * 
  * @shortdesc Abstract layout base class.
  * @lzxname layout
  */

dynamic class LzLayout extends LzNode {

/** @access private
  * @modifiers override 
  */
  static var tagname = 'layout';

    static var getters = new LzInheritedHash(LzNode.getters);
    static var defaultattrs = new LzInheritedHash(LzNode.defaultattrs);
    static var options = new LzInheritedHash(LzNode.options);
    static var setters = new LzInheritedHash(LzNode.setters);
    static var __LZdelayedSetters:* = new LzInheritedHash(LzNode.__LZdelayedSetters);
    static var earlySetters:* = new LzInheritedHash(LzNode.earlySetters);

    function LzLayout ( parent:* , attrs:* , children:* = null, instcall:*  = null) {
        super(parent,attrs,children,instcall);
    }  

    var initDelegate;

  /**
    * Set to true if layout is locked from updates.
    * @type Boolean
    */
  //locked is set to 2 in the prototype of the layout. This is a special signal that the layout is locked temporarily until it resolves its references
  var locked = 2;

  LzLayout.setters.locked = "__LZsetLocked";

  /** Array holding the views under this layout's control.
    *
    * @type Array
    * @access protected
    */
  var subviews = null;

  /** A delegate used to update the layout.
    * @type LzDelegate
    */
  var updateDelegate;
  
  /** An array of all the delegates used by the layout
    * @type LzDelegate
    */
  var delegates;

/**
  * @param view: A view above this one that the Layout should apply to. Note:
  * this may not ultimately be the same as the view that it will eventually be
  * attached to, due to placement.
  * @param args: Constructor arguments.
  *
  * @access private
  */
override  function construct ( view , args) {
    super.construct.apply(this, arguments);
    this.subviews = new Array;

    // view.layouts: If it doesn't already exist, layouts create an array
    //in the view that it attaches to that hold the list of layouts attached
    //to the view.
    if ( (LzView(this.immediateparent)).layouts == null ){
        (LzView(this.immediateparent)).layouts = [ this ];
    } else {
        (LzView(this.immediateparent)).layouts.push( this );
    }

    this.updateDelegate = new LzDelegate( this , "update" );

    this.delegates = [ this.updateDelegate ];

    // register for unlock when parent inits, or unlock if already inited
    if (this.immediateparent.isinited) {
        this.__parentInit();
    } else {
        this.initDelegate = new LzDelegate( this , "__parentInit", this.immediateparent, "oninit" );
        this.delegates.push(this.initDelegate);
    }

}

/**
  * @access private
  */
override function constructWithArgs ( args ) {
    //all layouts need to know when their view adds/deletes a subview
    this.delegates.push( new LzDelegate (  this, "gotNewSubview",
                                        this.immediateparent,"onaddsubview" ));
    //this is never called b/c removeSubview is not implemented yet
    this.delegates.push( new LzDelegate (  this, "removeSubview",
                                    this.immediateparent, "onremovesubview" ));

    var vsl = (LzView(this.immediateparent)).subviews.length;

    for (var i = 0; i < vsl; i++){
        this.gotNewSubview( (LzView(this.immediateparent)).subviews[i] );
    }

}


/**
  * @access private
  */
override function destroy ( recursiveCall = null) {
    this.releaseLayout();
    super.destroy.apply(this, arguments);
}


/**
  * Reset any held parameters (such as kept sizes that may have changed) and
  * before updating.
  *
  * @access protected
  *
  * @param Any e: The event data that is passed by the delegate that called this
  * funciton. This is usually unused, since more than one type of delegate can
  * call reset.
  */
function reset( e = null ) {
    if ( this.locked ) { return; }
    //defalt behavior on reset is to update
    this.update( e );
}

/**
  * Called whenever a new subview is added to the layout. This is called both
  * in the layout constructor and when a new subview is called after layout
  * has been created. This is only called if the view's "ignorelayout" option is
  * not set.
  *
  * @access protected
  * @param LzView sd: The subview to add.
  */
function addSubview( sd ) {
    if ( sd.getOption( 'layoutAfter' ) ){
        //this wants to get inserted in a specific place in the layout
        this.__LZinsertAfter( sd , sd.getOption( "layoutAfter" ) );
    } else {
        this.subviews.push ( sd );
    }
}

/**
  * Called whenever the layout discovers a new subview. Checks to see if view
  * should be added by inspecting the view's "ignorelayout" option.
  *
  * @access private
  * @param sd: The subview to add.
  */
function gotNewSubview( sd ) {
    if ( ! sd.getOption( 'ignorelayout' ) ){
        this.addSubview( sd );
    }
}

/**
  * Called when a subview is removed. This is not well tested.
  *
  * @access protected
  * @param LzView sd: The subview to be removed.
  */
function removeSubview( sd ) {
    for ( var i = this.subviews.length-1; i >= 0; i-- ){
        if ( this.subviews[ i ] == sd ){
            this.subviews.splice( i , 1 );
            break;
        }
    }

    this.reset();
}

/**
  * Called when a subview is to be ignored by the layout. By default, most
  * layouts include all the subviews of a given view.
  *
  * @access protected
  * @param LzView s: The subview to ignore.
  */
function ignore( s ) {
    //default behavior on addSubview is to reset
    for (var i = this.subviews.length - 1; i >= 0; i-- ){
        if ( this.subviews[ i ] == s ){
            this.subviews.splice( i , 1 );
            break;
        }
    }
    this.reset();
}

/**
  * Lock the layout from processing updates. This allows the layout to register
  * for events that it generates itself. Unfortunately, right now all subclass
  * routines that can generate calls that may result in the layout calling
  * itself should check the lock before processing. Failure to do so is not
  * catastrophic, but it will slow down your program.
  */
function lock ( ) {
    this.locked = true;
}


/**
  * Unlock the layout once update is done.
  *
  */
function unlock ( ) {
    this.locked = false;
    this.reset()
}

/**
  * Unlock the layout once update is done.
  *
  * @access private
  */
    function __LZsetLocked ( locked, ignoreme=null ) {
    if ( this.locked == locked ) return;
    if ( locked ){
        this.lock();
    } else {
        this.unlock();
    }
}

/**
  * @access private
  */
function __parentInit (){
    if ( this.locked == 2){
        if (this.isinited) {
            this.unlock();
        } else {
            new LzDelegate( this , "unlock", this, "oninit" );
        }
    }
}

/**
  * Remove the layout from the view and unregister the delegates that the layout
  * uses.
  */
function releaseLayout ( ) {
    if (this.delegates) {
        for ( var i = this.delegates.length - 1;  i >= 0; i -- ){
            this.delegates[ i ] .unregisterAll();
        }
    }
    if (this.immediateparent && (LzView(this.immediateparent)).layouts) {
        for ( var i = (LzView(this.immediateparent)).layouts.length -1 ; i >= 0 ; i-- ){
            if ( (LzView(this.immediateparent)).layouts[ i ] == this ){
                (LzView(this.immediateparent)).layouts.splice( i , 1 );
            }
        }
    }
}


/**
  * Reorder the second subview given  to this function so that it immediately
  * follows the first. Doesn't touch the placement of the first subview given
  *
  * @access public
  *
  * @param LzView sub1: The reference subview which the second subview should
  * follow in the layout order. Alternatively, can be "first" or "last"
  * @param LzView sub2: The subview to be moved after the reference subview.
  */
function setLayoutOrder ( sub1 , sub2 ){
    //this will cause problems if sub1 or sub2 are not subviews
    for (var i = this.subviews.length -1; i >= 0 ; i-- ){
        if ( this.subviews[ i ] == sub2 ){
            this.subviews.splice( i, 1 );
            break;
        }
    }

    if ( sub1 == "first" ){
        this.subviews.unshift( sub2 );
    } else if ( sub1 == "last" ){
        this.subviews.push( sub2 );
    } else {
        for (var i = this.subviews.length -1; i >= 0 ; i-- ){
            if ( this.subviews[ i ] == sub1 ){
                this.subviews.splice( i+1 , 0 , sub2 );
                break;
            }
        }
    }
    this.reset();
    return;
}

/**
  * Swap the positions of the two subviews within the layout
  * @access public
  *
  * @param LzView sub1: The reference subview which the second subview should
  * follow in the layout order.
  * @param LzView sub2: The subview to be moved after the reference subview.
  */
function swapSubviewOrder ( sub1 , sub2 ){
    //this will cause problems if sub1 or sub2 are not subviews
    var s1p = -1;
    var s2p = -1;

    for (var i = this.subviews .length -1; i >= 0 && ( s1p < 0 || s2p < 0 );
                   i-- ){
        if ( this.subviews[ i ] == sub1 ){
            s1p = i;
        } else  if ( this.subviews[ i ] == sub2 ){
            s2p = i;
        }
    }

    this.subviews[ s2p ] = sub1;
    this.subviews[ s1p ] = sub2;

    this.reset();
    return;
}

/**
  * @access private
  */
function __LZinsertAfter ( newsub , oldsub ){
    for ( var i = this.subviews.length -1 ; i >= 0; i-- ){
        if ( this.subviews[ i ] == oldsub ){
            this.subviews.splice( i , 0 , newsub );
        }
    }
}

/**
  * Update is called whenever the layout needs to be updated. By defualt, it
  * is called by <b> reset</b>. This is an abstract function in the class,
  * but this is the main routine where the layout does its work.
  *
  * The beginning of this routine should always check for the locked property
  * and return immediately if it is true for best performace.
  *
  * @access protected
  */

function update(myarg) {
}



/**
  * @access private
  */
override function toString (){
    return "LzLayout for view " + this.immediateparent;
}

}


ConstructorMap[LzLayout.tagname] = LzLayout;
