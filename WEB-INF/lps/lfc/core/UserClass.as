/******************************************************************************
 * UserClass.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: $class
// This serves as a namespace for class related functions given that there is
// no native 'class' keyword in our variant of JavaScript.
//
// @keywords private
//=============================================================================
LzMakeClass = function ( classobj , extend ){
    if ( extend == null ){
        var sup = _root.LzView;
    } else {
        var mname =_root.ConstructorMap[ extend ]; 
        var sup = _root[ mname == null ? extend : mname ];
    }

    var newclass = _root.Class( classobj.name , sup ); 
    
    delete classobj.attrs.name;

    newclass.prototype.userclass = true;
    var cc;
    if ( sup.prototype.classChildren.length ){
        cc = sup.prototype.classChildren.concat();
    } else{
        cc = []
    }

    if ( classobj.children.length ){
        _root.LzFixTags( classobj );
        
        cc = cc.concat( classobj.children );

    }

    if ( classobj.attrs.defaultplacement != null ){
        cc.push( { name : "UserClassPlacementObject" , 
                   attrs : classobj.attrs.defaultplacement } );

        delete classobj.attrs.defaultplacement;
    }

    if ( cc.length ){
        newclass.prototype.classChildren = cc;
    }

    var haveone =false;
    for ( var e in classobj.attrs.$events ){
        var defHandleName = "_cl_handle" + newclass.prototype.classname + e; 
        newclass.prototype[ defHandleName ] = classobj.attrs.$events[ e ];

        if ( !haveone ){
            haveone = true;
            newclass.prototype.setClassEvents=_root.LzMakeClass.setClassEvents;
            newclass.classEvents = [ defHandleName , e ];
        } else {
            newclass.classEvents.push( defHandleName , e );
        }
    }

    delete classobj.attrs.$events;


    var customsetters = classobj.attrs.$setters;
    delete classobj.attrs.$setters;
    
    for ( var s in customsetters ){
        var attrSet = "_anonSet" + s;
        newclass.prototype[ attrSet ] = customsetters[ s ];
        newclass.prototype.setters[ s ] = attrSet;
    }

    for ( var k in classobj.attrs ){
        //check for literal overriding a constraint

        if ( newclass.prototype.defaultattrs.$refs[ k ] ){
            //override a constraint with a literal
            if ( ! classobj.attrs.$refs ){
                classobj.attrs.$refs = {};
                //we know the defaultattrs has $refs, so attach it
                classobj.attrs.$refs.__proto__ = 
                                        newclass.prototype.defaultattrs.$refs;
            }
            classobj.attrs.$refs[ k ] = _root.LzNode.prototype._ignoreAttribute;
        }

        //if there's no setter, than attach this to the prototype and remove it
        //from the initobj.attrs
        if ( newclass.prototype.setters[ k ] == null && 
                !newclass.prototype.$isstate){
            newclass.prototype[ k ] = classobj.attrs[ k ];
            delete classobj.attrs[ k ];
            continue;
        }

        //otherwise, leave it in the initobj.attrs, and link it to the other
        //default attrs if it's an object
        if ( typeof( classobj.attrs[ k ] ) == "object"  && 
                typeof( newclass.prototype.defaultattrs[ k ] ) == "object" ) {
            var o = classobj.attrs[ k ];
            if (  o.__proto__ == Array.prototype ) {
                classobj.attrs[ k ] = 
                                o.concat( newclass.prototype.defaultattrs[k] );
            } else {
                o.__proto__ =newclass.prototype.defaultattrs[k];
            }
        }
    }

    classobj.attrs.__proto__ = newclass.prototype.defaultattrs;
    newclass.prototype.defaultattrs = classobj.attrs;
     
}

//=============================================================================
// @keywords private
// @param Function p: a class constructor
//=============================================================================
LzMakeClass.setClassEvents = function ( p ){
    do {
        var clev = p.classEvents;

        for ( var i = 0; i < clev.length ; i += 2){
            new _root.LzDelegate( this , clev[ i ] , this, clev[ i + 1 ]  );
        }
        p = p.prototype.__proto__.class;
    } while( p.prototype.userclass == true );
}


UserClassPlacementObject = function ( parent , placement ){
    parent.defaultplacement = placement;
}


//============================================================================
// DEFINE OBJECT: LzUserClass
// An LzUserClass is the implementation of the <class> tag.  It ensures that 
// the class is instantiated in lexical order with surrounding nodes
//
// @keywords private
//============================================================================

LzUserClass = Class( 
    "LzUserClass" , 
    LzNode , 
    function ( parent, args ){
      LzMakeClass(args.initobj, args.parent);
    }
);

