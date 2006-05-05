/******************************************************************************
 * LzTrait.as 
 *****************************************************************************/
 
//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzTrait
//
// LzTrait represents a trait in the meta-object protocol.
//==============================================================================
LzTrait = Class( "LzTrait" , null , function ( traitdesc ){
    
    var ta = traitdesc.attrs;
    var tname = ta.name;
    
    this["traitname"] = tname;

    var nta = new Object();
    for (var a in ta) {
        if (a != "name") nta[a] = ta[a];
    }
    this["attrs"] = nta;

    var tc = traitdesc.children;
    this["children"] = tc;
    
    this["interstitials"] = new Array();
    
    _root.LzTrait.traits[ tname ] = this;

    global[ tname ] = this;
}
);

LzTrait.traits = {};

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzTrait.processTraitList = function ( traitsString ){
    var traitList = null;
    if ( typeof traitsString == 'string'){
        var traitNames = traitsString.split(',');
        var traitList = new Array;
        for (var i = 0, j = 0; i < traitNames.length; i++) {
            var traitName = traitNames[i];
            
            // strip leading whitespace
            while (traitName.charAt(0) == ' ') traitName = traitName.slice(1);
            while (traitName.charAt(traitName.length - 1) == ' ') traitName = traitName.slice(0, traitName.length-1);
            
            var t = _root.LzTrait.traits[traitName];

            if (typeof(t) == "undefined") {
                _root.Debug.warn("Unknown trait '%s'. Ignored.", traitName);
            } else if (! (t instanceof LzTrait)) {
                _root.Debug.warn("Symbol in trait list is not bound to trait. Ignored.", traitName);
            } else {
                traitList[j++] = t;
            }
        }
    }
    return traitList;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzTrait.makeInterstitial = function( trait, superclass )
{
    var supername = superclass.prototype.classname;
    
    var interstitial = trait.interstitials[supername];
    
    if (interstitial == null) {
        var interstitialname = trait.traitname + "$" + supername;

        var initattrs = new Object();
        initattrs.__proto__ = trait.attrs;
        initattrs["trait"] = trait;
        
        var attrs = { parent: supername, 
                      initobj: { attrs: initattrs,
                                 children: trait.children,
                                 name: interstitialname } };
    
        new _root.LzUserClass(canvas, attrs);
        
        interstitial = _root[interstitialname];
        
        trait.interstitials[supername] = interstitial;
    }

    return interstitial;
}

