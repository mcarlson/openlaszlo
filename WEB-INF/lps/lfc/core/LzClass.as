/******************************************************************************
 * LzClass.as 
 *****************************************************************************/
 
//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//---
//@keywords private
//---
$class = new Object; //namespace for classes
$class.classnum = 0;

// TODO: [2005-08-31 ptw] Rather than smashing a bunch of props onto
// the constructorF, Class should put them on its own prototype and
// then just set the __proto__ of the constructorF to
// Class.prototype.  Presumably this would conserve space, and it
// would make our classes instanceof Class, rather than just Function.

//=============================================================================
// DEFINE OBJECT: $class
// This serves as a namespace for class related functions given that there is
// no native 'class' keyword in our variant of JavaScript.
//
// @keywords private
//
// @param string classname: the name of the class being defined
// @param string superclass: the class it inherits from
// @param function constructorF: the constructor function
// @param array traitList: array of traits to apply, or null if none
//=============================================================================
Class = function ( classname , superclass , constructorF, traitList ){
    if ( typeof( constructorF ) != "function" ){
        var constructorF = superclass.makeDefaultConstructor();
    }

    _root[ classname ] = constructorF;
    // For profiling and debugging, give the constructor function the
    // class name as a name (rather than the anonymous closure name
    // that mvn gives it
    if ($debug) {
        constructorF.name = classname;
    } else if ($profile) {
        constructorF.name = classname;
    }


    // same as <instance>.__proto__.constructor
    // or <instance>.__constructor__ in swf7
    // included for backward compatibility
    constructorF.prototype.class = constructorF;
    // same as constructorF.name if debugging or profiling
    constructorF.classname = classname;
    // uses classname, see below
    constructorF.destroy = Class.destroy;
    // same as <instance>.class.classname
    constructorF.prototype.classname = classname;

    if ( superclass ){
        
        if (traitList) {
            constructorF.traits = traitList;
            constructorF.prototype.traits = traitList;
            for (var i = 0; i < traitList.length; i++) {
                superclass = LzTrait.makeInterstitial(traitList[i], superclass);
            }
        }
        
        Class.extends (  superclass , constructorF );
    }

    // backward compatibility
    if ( typeof( constructorF.prototype.instanceOf ) != "function" ){
        constructorF.prototype.instanceOf = Class.instanceOf;
        constructorF.prototype.callInherited = Class.callInherited;
        // scaffolding
        constructorF.prototype.__LZcallInherited = Class.__LZcallInherited;
    }

    return constructorF;
}

//---
// For symmetry with LzNode.destroy
//
// You can't destroy a class because it may have subclasses or
// instances.  All this does is delete the class from the global
// namespace.  It will be collected when it has no more referents
//
// @keywords private
//---
Class.destroy = function () {
    // Only delete user classes.
    if (this.hasOwnProperty('classname') &&
        this.prototype.hasOwnProperty('userclass') &&
        _root.hasOwnProperty(this.classname)) {
        return delete _root[this.classname];
    }
}

//-----------------------------------------------------------------------------
// This function is used to create inheritance chains. It also adds the functio
// callInherited() to a subclass's prototype so that the subclass can call
// over-ridden methods in the superclass.
//
// @param sup: reference to superclass constructor
// @param sub: reference to subclass constrcutor
//-----------------------------------------------------------------------------
Class.extends = function( sup, sub ) {
    // set up LzNode inheritance
    sup.isExtendedBy( sub);
    if ( typeof( sup.prototype.classname ) != "string" ){
        if ($debug) {
            Debug.warn('Anonymous superclass %w', sup);
        }
        sup.prototype.classname = "$c" + _root.$class.classnum++;
    }

    if ( typeof( sub.prototype.classname ) != "string" ){
        if ($debug) {
            Debug.warn('Anonymous subclass %w', sub);
        }
        sub.prototype.classname = "$c" + _root.$class.classnum++;
    }

    sub.prototype.__proto__ = sup.prototype;
    // Undocumented AS field, makes super in constructor work
    sub.prototype.__constructor__ = sup;
    ASSetPropFlags(sub.prototype, ['__constructor__'], 1, 1);

}

//-----------------------------------------------------------------------------
// This function calls the inherited method by name.
//
// @deprecated Use <code>super</code> instead.
//
// @param fname: A string representing the name of the method to call in
// the superclass.
// @param fn: The function object that is making the call (i.e. call this 
// method with arguments.callee as the second param.)
//-----------------------------------------------------------------------------
Class.callInherited = function ( fname , fn ){
    if ($debug) {
        Debug.warn('`this.callInherited(%#w, ...)` is deprecated, use `super.%w(...)` instead', fname, fname);
    }
    this.__LZcallInherited.apply(this, arguments);
}

//---
// Scaffolding until the compiler generates super calls
// @keywords private
//---
Class.__LZcallInherited = function ( fname , fn ){
    if ( null == fn.$proto[ this.classname ] ) {
        if ( fname == "constructor" ){
            var lsuper = this.__proto__.__proto__;
        }else{
            var lsuper = this;
            var skip = true;
        }
    } else {
        var lsuper = fn.$proto[ this.classname ].__proto__;
    }
        
    while ( lsuper.__proto__ ){
        var op = lsuper.__proto__;
        lsuper.__proto__ = null;

        if ( typeof ( lsuper [fname] ) =="function" ){

            if ( !skip ){
                lsuper.__proto__ = op;
                var f = lsuper[ fname ];
                    
                this._sCall = f;

                if ( !f.$proto ){
                    f.$proto = new Object;
                }

                var ownslock = f.$proto[ this.classname ] == null ;

                f.$proto[ this.classname ] = lsuper;
                var a = Array.prototype.slice.apply(arguments, [2]);
                var r = this._sCall.apply(this,a);
                    
                if (ownslock) delete f.$proto[ this.classname ];

                return r;
            }

            var skip =false;
        }
            
        lsuper.__proto__ = op;
        lsuper = lsuper.__proto__;
    }
    //error -- no def found
    if ($debug) {
        Debug.write('no method super.' + fname + ' in', fn);
    }
}

Object.class = {};
// deprecated
Object.class.callInherited = Class.callInherited;
// scaffolding
Object.class.__LZcallInherited = Class.__LZcallInherited;

//-----------------------------------------------------------------------------
// Tests if object is an instance of a class.
// @deprecated Use <code>object instanceof class</code> instead.
// @param cl: The class to test the instance against.
//-----------------------------------------------------------------------------
Class.instanceOf = function ( cl ){
    if ($debug) {
        Debug.warn('`.instanceOf` is deprecated, use the `instanceof` operator instead');
    }
    return this instanceof cl;
}


//remove this eventually
//=============================================================================
// see Class.extends
// @keywords private
//=============================================================================
Object.class.extends = function( sup, sub ) {

    if (  typeof( sup.prototype.classname ) != "string" ){
        sup.prototype.classname = "$c" + Object.class.classnum++;
    }

    
    if ( typeof( sub.prototype.classname ) != "string" ){
        sub.prototype.classname = "$c" + Object.class.classnum++;
    }
    
    sub.prototype.__proto__ = sup.prototype;

    // deprecated
    sub.prototype.callInherited= Object.class.callInherited;
    // scaffolding
    sub.prototype.__LZcallInherited= Object.class.__LZcallInherited;


}

