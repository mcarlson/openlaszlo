/******************************************************************************
 * LzTrait.as 
 *****************************************************************************/
 
//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

LzTrait = Class( "LzTrait" , null , function ( traitdesc ){
    
    var ta = traitdesc.attrs;
    var tname = ta.name;

    var nta = new Object();
    for (a in ta) {
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

LzTrait.traitnum = 0;

LzTrait.makeInterstitial = function( trait, superclass )
{
    var supername = superclass.prototype.classname;
    
    var interstitial = trait.interstitials[supername];
    
    if (interstitial == null) {
        var interstitialname = "__LZtrait$" + _root.LzTrait.traitnum++;
        
        var initattrs = new Object();
        initattrs.__proto__ = trait.attrs;
        
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
