/******************************************************************************
 * LzCSSStyle.js 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// <p>This service provides style information.</p>
// <p>This implements Interface ViewCSS (introduced in DOM Level 2)
//    from here: http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-ViewCSS
// </p>
//=============================================================================
function LzCSSStyleRule(){
}
LzCSSStyleRule.prototype.properties = null;
LzCSSStyleRule.prototype.selector = null;
LzCSSStyleRule.prototype.getSpecificity = function () {
    
    // Only calculate this once. Store it after we've 
    // calculated it once.     
    if (typeof(this.specificity) != "undefined")
        return this.specificity; 

    // Go through all the selectors in the selector, keeping a running
    // count of various kinds of selectors:
    /*
    count 1 if the selector is a ’style’ attribute rather than a selector, 
        0 otherwise (= a) 
    count the number of ID attributes in the selector (= b) 
    count the number of other attributes and pseudo-classes in the selector (= c) 
    count the number of element names and pseudo-elements in the selector (= d) 
    */ 
    var sel = this.selector; // put it in a register
    var result = 0;
    if (typeof sel == "string") {
        // We've just got a simple boring selector
        result = LzCSSStyleRule._getSimpleSelectorSpecificity( sel );
    } else {
        for (var k in sel ) {
            result += LzCSSStyleRule._getSimpleSelectorSpecificity( sel, k );
        }
    }
    // Debug.write("for selector ", sel, "got specificity ", result);
    this.specificity = result; 
    return result; 
}

/* 
For a simple selector, figure out the specificity based on the type of the
element. We determine the type of the simple selector with some quick and
easy checks for sentinel characters. 
*/ 
LzCSSStyleRule._getSimpleSelectorSpecificity = function ( selarr, k ) {
    var sel = selarr[k];

    // If this simple selector includes an element type, that counts for
    // specificity of +1. 
    if (k == "simpleselector") {
        return 1; 
    }
    
    if (sel.indexOf("#") >= 0) {
        // it's an id selector
        return 100; 
    }
    
    if (sel.indexOf("[") >= 0) {
        // it's an attr=value selector
        return 10; 
    }
    
    return 1 ;
}


var LzCSSStyle = {};

LzCSSStyle.getComputedStyle = function ( node ){
    var csssd = new LzCSSStyleDeclaration( );
    csssd.setNode( node );
    return csssd;
}

LzCSSStyle.__LZRuleCache = {};


//LzCSSStyle.time1 = 0;
LzCSSStyle.getPropertyValueFor = function ( node , pname ){
    //_root.Debug.format("node: %w, pname: %w, rules: %w\n", node, pname, this._rules);

    //var t = getTimer();
    var uid = node.getUID();
    var rules = this.__LZRuleCache[ uid ];
    if ( !rules ) {
        rules = new Array();
        var r;
        for ( var i = this._rules.length -1; i >=0; i-- ){
            r = this._rules[ i ];
            if ( this._ruleOrSelectorApplies( r, node ) ){
                rules.push(r); 
            }
        }

        //now look at any preprocessed rules
        var pprules = node.name ? this._nameRules[ node.name ] : null;
        if ( pprules ){
            //same code as above, but inline to avoid function call overhead
            for ( var i = pprules.length -1; i >=0; i-- ){
                r = pprules[ i ];
                if ( this._ruleOrSelectorApplies( r, node ) ){
                    rules.push(r); 
                }
            }
        }
        
        //sort match rules by their specificities
        rules.sort(this.__compareSpecificity); 
    
        this.__LZRuleCache[ uid ] = rules;
    }

    //Debug.write("About to print rule array.") 
    //LzCSSStyle._printRuleArray( rules );
    
    var l = rules.length;
    var pv = null;
    var i = 0; 
    while ( i < l ) {
        pv = rules[ i++ ].properties[ pname ]; 
        if ( pv ) return pv;
    }

    //this.time1 += getTimer() - t;
    if ( node == _root.canvas ) return null;
    else {
        return this.getPropertyValueFor(node.immediateparent, pname );
    }

}


LzCSSStyle.__compareSpecificity = function (rA, rB) {
    // if rA specificity  is less than rB specifity, return -1
    // if they're equal specificity, return 0
    // if rB specifitity is less than rA specificity, return 1
    var specificityA = rA.getSpecificity();
    var specificityB = rB.getSpecificity();
    return ( (specificityA < specificityB) ? 1 : ( (specificityA==specificityB) ? 0 : -1));
}

LzCSSStyle._printRuleArray = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        Debug.write(i, arr[i]);
    }
    
}
//this ideally would be two separate functions, but merging them
//and inlining the cases of the switch statement is a 2x speedup [awolff]
LzCSSStyle._ruleOrSelectorApplies = function ( r , node ){

    //if it's a rule, grab the selector
    if ( r.parsed ) var rp = r.parsed;
    else var rp = r;
    
    switch ( rp.type ){
        case (this._selTypes.star ):
            return true;

        case (this._selTypes.id ):
            return node.id == rp.id;

        case (this._selTypes.class ):
            return (node instanceof _root.global[ rp.classname  ]);

        case (this._selTypes.compound ):
            var curnode = node; 
            var sindex = rp.length -1;

            var lc = rp[ sindex ];
            var firstone = true;
            while ( curnode ){

                if (this._ruleOrSelectorApplies( rp[ sindex ] , curnode)){
                    if ( sindex-- == 0 ){
                        return true;
                    }
                } else if ( firstone ){
                    //if the last selector doesn't apply, then bail -- we'll
                    //come back for this when we recurse over the parents in
                    //getPropertyValueFor
                    return false;
                }

                //assumes parent of canvas is null
                curnode = curnode.parent;
                firstone = false;
            }
            return false;

        case (this._selTypes.attribute ):
            return node[ rp.attrname ] == rp.attrvalue;

        case (this._selTypes.classAndAttr ):
            if (node[ rp.attrname ] == rp.attrvalue) {
                return elmatches = node instanceof _root.global[ rp.classname ];
            }
            return false; 
    }
}

LzCSSStyle._selTypes = {
    "unknown"      : 0,   
    "star"         : 1,  // * 
    "id"           : 2,  // #gMyId
    "class"        : 3,  // styledbox
    "compound"     : 4,  // E F 
    "attribute"    : 5,  // [attr="val"]
    "classAndAttr" : 6   // class[attr="val"]
}

LzCSSStyle._rules = new Array();

//optimization for selectors which use [name="value"]
LzCSSStyle._nameRules = {};

LzCSSStyle._addRule = function ( r ){
    //do some preprocessing to speed up lookups
    var sel = r.selector;
    r.parsed = null;
    var lastsel;
    if ( sel instanceof Array ){
        r.parsed = [];
        r.parsed.type = this._selTypes.compound;
        for ( var i = 0; i < sel.length; i++ ){
            r.parsed.push( this._parseSelector( sel[ i ] ) );
        }
        lastsel = r.parsed[ r.parsed.length -1 ];
    } else { 
        r.parsed = this._parseSelector( sel );
        lastsel = r.parsed;
    }

    //special treatment for rules that use name=
    //we could do this pretty easily for ID if ID rules were common,
    //or for other attibute names
    if ( lastsel.type == this._selTypes.attribute &&
         lastsel.attrname == "name" ){
        var aval = lastsel.attrvalue;
        if ( !this._nameRules[ aval ] ) this._nameRules[ aval ] = [];
        this._nameRules[ aval ].push( r );
        Debug.write( this._nameRules );
    } else {
        this._rules.push( r );
    }
}

LzCSSStyle._parseSelector = function( sel ){
    switch ( typeof ( sel ) ){
        case "object":
            if (sel.simpleselector) {
                sel.type = this._selTypes.classAndAttr;
                sel.classname = this._normalizeClassname( sel.simpleselector );
            } else     
                sel.type = this._selTypes.attribute;
            return sel;
            break;
        case "string":
            return this._parseStringSelector( sel );
            break;
    }
}

LzCSSStyle._parseStringSelector = function ( sel ){
    var parsed = { };
    if ( sel == "*" ) {
        parsed.type = this._selTypes.star;
    } else {
        var index = sel.indexOf("#"); 
        if (index >= 0) {
            // Assumption: there should only be one # in a selector
            parsed.id =  sel.substring(index + 1);        
            parsed.type =  this._selTypes.id;
        } else {
            parsed.type =  this._selTypes.class;
            parsed.classname = this._normalizeClassname( sel );
        }

    }

    return parsed;
}


/* The tag name of some nodes doesn't match the associated class name, ie, 
 nodes declared with tag <view> are instances of LzView, not instances of view.
 This function normalizes tag names into class names. The complete tag to classname
 mapping is listed in LaszloInitiator.as. For speed and size, I am only actually 
 mapping the class names which it seems sane to style. I am excluding data-related
 classes, because they will have undefined behavior when used together with CSS.
 */ 
LzCSSStyle._normalizeClassname = function ( cn ){
    switch (cn) {
        case "view":        return "LzView";
        case "animator":    return "LzAnimator";
        case "animatorgroup": return "LzAnimatorGroup";
        case "canvas":      return  "LzCanvas";
        case "drawview":    return "LzDrawView";
        case "inputtext":   return "LzInputText";
        case "layout":      return "LzLayout";
        case "node":        return "LzNode";
        case "state":       return "LzState";
        case "text":        return "LzText";
        default: return cn;
    }
}

// These objects implement
// Interface CSSStyleDeclaration (introduced in DOM Level 2) from
// http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
function LzCSSStyleDeclaration (){ };
LzCSSStyleDeclaration.prototype._node = null;

LzCSSStyleDeclaration.prototype.getPropertyValue = function ( pname ){
    return LzCSSStyle.getPropertyValueFor( this._node , pname );
}

LzCSSStyleDeclaration.prototype.setNode = function ( node ){
    this._node = node;
}
