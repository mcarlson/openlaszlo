/**
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @affects lzcssstyle lzcssstylerule
  * @access public
  * @topic LFC
  * @subtopic CSS
  */

/**
  * <p>This service provides style information.</p>
  * <p>This implements Interface ViewCSS (introduced in DOM Level 2)
  * from here: http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-ViewCSS
  * </p>
  */
function LzCSSStyleRule(){
}
LzCSSStyleRule.prototype.properties = null;
LzCSSStyleRule.prototype.selector = null;
//No rule has a specificity of zero
LzCSSStyleRule.prototype.specificity = 0;

// this is inlined in __compareSpecificity() - keep in sync
LzCSSStyleRule.prototype.getSpecificity = function () {
    
    // Only calculate this once. Store it after we've calculated it once.     
    // No rule has a specificity of 0
    if ( !this.specificity ) {
        //need to treat compound selectors differently

        if ( this.parsed.type == LzCSSStyle._sel_compound ){
            for ( var i = 0; i < this.parsed.length; i++ ){
                this.specificity += LzCSSStyle.getSelectorSpecificity( this.parsed[ i ] );
            }
        } else {
            this.specificity = LzCSSStyle.getSelectorSpecificity( this.parsed );
        }

        //Debug.write( 'specificity for' , this , this.specificity );
    }

    return this.specificity; 
}

/** For a simple selector, figure out the specificity based on the type of the
  * element. We determine the type of the simple selector with some quick and
  * easy checks for sentinel characters. 
  * @access private
  */ 
LzCSSStyleRule._getSimpleSelectorSpecificity = function ( selarr, k ) {
    var sel = selarr[k];
    //Debug.write( 'selarr' , selarr , "sel" , sel );

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

//LzCSSStyle.time1 = 0;
LzCSSStyle.getPropertyValueFor = function ( initialnode , pname ){
    //Debug.warn("node: %w, pname: %w, rules: %w\n", node, pname, this._rules);

    //var t = getTimer();
    if (!initialnode || !pname) return;

    var node = initialnode;
    while (node != canvas) {
        if (! node.__LZPropertyCache) {
            node.__LZPropertyCache = {};
        } else {
            var val = node.__LZPropertyCache[pname];
            if (val != null) return val;
        }

        var rules = node.__LZRuleCache;
        if ( !rules ) {
            rules = new Array();
            var r;
            for ( var i = this._rules.length -1; i >=0; i-- ){
                r = this._rules[ i ];
                var rp = r.parsed;
                //inlined: if (rp.type == this._sel_compound && this._compoundSelectorApplies( rp, node )) {
                if (rp.type == this._sel_compound) {
                    var curnode = node; 
                    var sindex = rp.length - 1;
                    var firstone = true;
                    var result = false;

                    while (curnode != canvas){
                        //recursively loop through selectors, ensuring each applies to the current node or a parent 
                        var nrp = rp[sindex]
                        t = nrp.type;

                        if ( t == this._sel_star ||
                            (t == this._sel_id && nrp.id == curnode.id) ||
                            (t == this._sel_tag && (((nrp.classname in lz) && (curnode instanceof lz[ nrp.classname ])) || ( (nrp.classname in global) && (curnode instanceof global[ nrp.classname ])))) ||
                            (t == this._sel_attribute && curnode[ nrp.attrname ] == nrp.attrvalue) ||
                            (t == this._sel_tagAndAttr && curnode[ nrp.attrname ] == nrp.attrvalue && (((nrp.classname in lz) && (curnode instanceof lz[ nrp.classname ])) || ( (nrp.classname in global) && (curnode instanceof global[ nrp.classname ])))) ||
                            (t == this._sel_compound && this._compoundSelectorApplies( nrp, curnode, true ))){
                            if ( sindex-- == 0 ){
                                result = true;
                                break;
                            }
                        } else if ( firstone ){
                            //if the last selector doesn't apply, then bail -- we'll
                            //come back for this when we recurse over the parents in
                            //getPropertyValueFor
                            result = false;
                            break;
                        }

                        curnode = curnode.parent;
                        firstone = false;
                    }
                    if (result) rules.push(r); 
                } else if ( rp.type == this._sel_star ||
                    (rp.type == this._sel_id && rp.id == node.id) ||
                    (rp.type == this._sel_tag && (((rp.classname in lz) && (node instanceof lz[ rp.classname ])) || ( (rp.classname in global) && (node instanceof global[ rp.classname ])))) ||
                    (rp.type == this._sel_attribute && node[ rp.attrname ] == rp.attrvalue) ||
                    (rp.type == this._sel_tagAndAttr && node[ rp.attrname ] == rp.attrvalue && (((rp.classname in lz) && (node instanceof lz[ rp.classname ])) || ( (rp.classname in global) && (node instanceof global[ rp.classname ]))))) {
                    rules.push(r); 
                }
            }

            //now look at any preprocessed rules
            // NOTE: 
            // it would be nice to just use (node.name) as the condition, but 
            // swf6 does not obey obey the ECMA string->boolean coercion specification.
            // As a workaround, we compare node.name to null, thereby ensuring we get a boolean
            // in swf6 or ECMA-compatible runtimes
            var pprules = (node.name != null) ? this._nameRules[ node.name ] : null;
            if ( pprules ){
                //same code as above, but inline to avoid function call overhead
                for ( var i = pprules.length -1; i >=0; i-- ){
                    r = pprules[ i ];
                    var rp = r.parsed;
                    //inlined: if (rp.type == this._sel_compound && this._compoundSelectorApplies( rp, node )) {
                    if (rp.type == this._sel_compound) {
                        var curnode = node; 
                        var sindex = rp.length - 1;
                        var firstone = true;
                        var result = false;

                        while (curnode != canvas){
                            //recursively loop through selectors, ensuring each applies to the current node or a parent 
                            var nrp = rp[sindex]
                            t = nrp.type;

                            if ( t == this._sel_star ||
                                (t == this._sel_id && nrp.id == curnode.id) ||
                                (t == this._sel_tag && (((nrp.classname in lz) && (curnode instanceof lz[ nrp.classname ])) || ( (nrp.classname in global) && (curnode instanceof global[ nrp.classname ])))) ||
                                (t == this._sel_attribute && curnode[ nrp.attrname ] == nrp.attrvalue) ||
                                (t == this._sel_tagAndAttr && curnode[ nrp.attrname ] == nrp.attrvalue && (((nrp.classname in lz) && (curnode instanceof lz[ nrp.classname ])) || ( (nrp.classname in global) && (curnode instanceof global[ nrp.classname ])))) ||
                                (t == this._sel_compound && this._compoundSelectorApplies( nrp, curnode, true ))){
                                if ( sindex-- == 0 ){
                                    result = true;
                                    break;
                                }
                            } else if ( firstone ){
                                //if the last selector doesn't apply, then bail -- we'll
                                //come back for this when we recurse over the parents in
                                //getPropertyValueFor
                                result = false;
                                break;
                            }

                            curnode = curnode.parent;
                            firstone = false;
                        }
                        if (result) rules.push(r); 
                    } else if ( rp.type == this._sel_star ||
                        (rp.type == this._sel_id && rp.id == node.id) ||
                        (rp.type == this._sel_tag && (((rp.classname in lz) && (node instanceof lz[ rp.classname ])) || ( (rp.classname in global) && (node instanceof global[ rp.classname ])))) ||
                        (rp.type == this._sel_attribute && node[ rp.attrname ] == rp.attrvalue) ||
                        (rp.type == this._sel_tagAndAttr && node[ rp.attrname ] == rp.attrvalue && (((rp.classname in lz) && (node instanceof lz[ rp.classname ])) || ( (rp.classname in global) && (node instanceof global[ rp.classname ]))))) {
                        rules.push(r); 
                    }
                }
            }
            
            //sort match rules by their specificities
            //first tell the sort function who this is being sorted for; the sort
            //depends not only on the rules, but also on the specificity of the
            //class selector, if one is present

            rules.sort(this.__compareSpecificity); 
        
            node.__LZRuleCache = rules;
        }

        //Debug.write("About to print rule array.") 
        //LzCSSStyle._printRuleArray( rules );
    
        var l = rules.length;
        var i = 0; 
        while ( i < l ) {
            var props = rules[i++].properties;
            if (pname in props) { 
                val = props[pname];
                node.__LZPropertyCache[pname] = val;
                break;
            }
        }
        if (val != null) return val;

        node = node.immediateparent;
        ////this.time1 += getTimer() - t;
    }

    if ($debug) {
        // Fix for LPP-3024: if we're in debug mode, warn when CSS lookup
        // results in a null or undefined value. [bshine 08.03.2007]
        Debug.warn(
            "No CSS value found for node %#w for property name %s",
            initialnode,
            pname);             
    }
}

// this is inlined in __compareSpecificity() - keep in sync
LzCSSStyle.getSelectorSpecificity = function ( parsedsel ){
    // Go through all the selectors in the selector, keeping a running
    // count of various kinds of selectors:
    /*
    count 1 if the selector is a `style` attribute rather than a selector, 
        0 otherwise (= a) 
    count the number of ID attributes in the selector (= b) 
    count the number of other attributes and pseudo-classes in the selector (= c) 
    count the number of element names and pseudo-elements in the selector (= d) 
    */ 
    switch ( parsedsel.type ){
        case (this._sel_tag ):
        case (this._sel_star ):
            return 1;

        case (this._sel_id ):
            return 100;

        case (this._sel_attribute ):
            return 10;

        case (this._sel_tagAndAttr ):
            return 11; 
    }
}

/** @access private */
LzCSSStyle.__compareSpecificity = function (rA, rB) {
    // if rA specificity  is less than rB specifity, return -1
    // if they're equal specificity, return 0
    // if rB specifitity is less than rA specificity, return 1
    if (! rA.specificity) {
        //inline: rA.getSpecificity();
        // Only calculate this once. Store it after we've calculated it once.     
        // No rule has a specificity of 0
        if ( !rA.specificity ) {
            //need to treat compound selectors differently

            if ( rA.parsed.type == LzCSSStyle._sel_compound ){
                for ( var i = 0; i < rA.parsed.length; i++ ){
                    //inline: rA.specificity += LzCSSStyle.getSelectorSpecificity( rA.parsed[ i ] );
                    switch ( rA.parsed[i].type ){
                        case (LzCSSStyle._sel_tag ):
                        case (LzCSSStyle._sel_star ):
                            rA.specificity += 1;
                            break;

                        case (LzCSSStyle._sel_id ):
                            rA.specificity += 100;
                            break;

                        case (LzCSSStyle._sel_attribute ):
                            rA.specificity += 10;
                            break;

                        case (LzCSSStyle._sel_tagAndAttr ):
                            rA.specificity += 11; 
                            break;
                    }
                }
                } else {
                    //inline: rA.specificity = LzCSSStyle.getSelectorSpecificity( rA.parsed );
                    switch ( rA.parsed.type ){
                        case (LzCSSStyle._sel_tag ):
                        case (LzCSSStyle._sel_star ):
                            rA.specificity = 1;
                            break;

                        case (LzCSSStyle._sel_id ):
                            rA.specificity = 100;
                            break;

                        case (LzCSSStyle._sel_attribute ):
                            rA.specificity = 10;
                            break;

                        case (LzCSSStyle._sel_tagAndAttr ):
                            rA.specificity = 11; 
                            break;
                    }
                }

                //Debug.write( 'specificity for' , this , this.specificity );
        }
    }
    if (! rB.specificity) {
        //inline: rB.getSpecificity();
        // Only calculate this once. Store it after we've calculated it once.     
        // No rule has a specificity of 0
        if ( !rB.specificity ) {
            //need to treat compound selectors differently

            if ( rB.parsed.type == LzCSSStyle._sel_compound ){
                for ( var i = 0; i < rB.parsed.length; i++ ){
                    //inline: rB.specificity += LzCSSStyle.getSelectorSpecificity( rB.parsed[ i ] );
                    switch ( rB.parsed[i].type ){
                        case (LzCSSStyle._sel_tag ):
                        case (LzCSSStyle._sel_star ):
                            rB.specificity += 1;
                            break;

                        case (LzCSSStyle._sel_id ):
                            rB.specificity += 100;
                            break;

                        case (LzCSSStyle._sel_attribute ):
                            rB.specificity += 10;
                            break;

                        case (LzCSSStyle._sel_tagAndAttr ):
                            rB.specificity += 11; 
                            break;
                    }
                }
            } else {
                //inline: rB.specificity = LzCSSStyle.getSelectorSpecificity( rB.parsed );
                switch ( rB.parsed.type ){
                    case (LzCSSStyle._sel_tag ):
                    case (LzCSSStyle._sel_star ):
                        rB.specificity = 1;
                        break;

                    case (LzCSSStyle._sel_id ):
                        rB.specificity = 100;
                        break;

                    case (LzCSSStyle._sel_attribute ):
                        rB.specificity = 10;
                        break;

                    case (LzCSSStyle._sel_tagAndAttr ):
                        rB.specificity = 11; 
                        break;
                }
            }

            //Debug.write( 'specificity for' , this , this.specificity );
        }
    }

    var specificityA = rA.specificity;
    var specificityB = rB.specificity;
    //Debug.write( rA, specificityA );
    //Debug.write( rB, specificityB );

    if ( specificityA == specificityB ){
        // Laszlo has a special rules around applicability of rules. In the
        // case where two selectors have the same specifity, AND both select
        // classes, the one that applies to the closer class in the inheritance
        // hierarchy wins

        // if *that* matches, then the descendant rule with closer selectors
        // wins

        if ( rA.parsed.type == LzCSSStyle._sel_compound && 
             rB.parsed.type == LzCSSStyle._sel_compound ){
            //iterate through the compound selector arrays 
            //assume that the selector arrays are the same length, due to
            //specificity. if they don't, or if all the comparisons match, then
            //we drop down to lexical order
            for ( var i = 0; i < rA.parsed.length; i++ ){
                //if we get here, it means that two rules have the same
                //specificity but different numbers of descendants
                if ( !rA.parsed[ i ] || !rB.parsed[ i ] ) break;

                //if one or neither selector has a classname, this test doesn't
                //apply OR the classnames are the same
                if ( !rA.parsed[ i ].classname || !rB.parsed[ i ].classname ||
                      rA.parsed[ i ].classname ==  rB.parsed[ i ].classname ){
                    continue;
                }

                var rac = lz[ rA.parsed[ i ].classname ];
                var rbc = lz[ rB.parsed[ i ].classname ];
                
                
                return (((rac && rbc) && ('prototype' in rac) && (rac.prototype instanceof rbc)) ? -1 : 1);
                

            }
        } 

        if ( ( rA.parsed.classname && rB.parsed.classname ) &&
             ( rA.parsed.classname != rB.parsed.classname ) ){
                var rac = lz[ rA.parsed.classname ];
                var rbc = lz[ rB.parsed.classname ];
                
                return (((rac && rbc)
                        && ('prototype' in rac) && 
                        (rac.prototype instanceof rbc)) 
                    ? -1 : 1);

        } else return (rA._lexorder < rB._lexorder ) ? 1 : -1;
    }

    return (specificityA < specificityB) ? 1 : -1;
}

/** @access private */
LzCSSStyle._printRuleArray = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        Debug.write(i, arr[i]);
    }
    
}

/** @access private 
 *  This is inlined above in getPropertyValueFor() - make sure they stan in sync
 */
LzCSSStyle._compoundSelectorApplies = function (rp , node){
    var curnode = node; 
    var sindex = rp.length - 1;
    var firstone = true;
    var result = false;

    while (curnode != canvas){
        //recursively loop through selectors, ensuring each applies to the current node or a parent 
        var nrp = rp[sindex]
        var t = nrp.type;

        if ( t == this._sel_star ||
            (t == this._sel_id && nrp.id == curnode.id) ||
            (t == this._sel_tag && (((nrp.classname in lz) && (curnode instanceof lz[ nrp.classname ])) || ( (nrp.classname in global) && (curnode instanceof global[ nrp.classname ])))) ||
            (t == this._sel_attribute && curnode[ nrp.attrname ] == nrp.attrvalue) ||
            (t == this._sel_tagAndAttr && curnode[ nrp.attrname ] == nrp.attrvalue && (((nrp.classname in lz) && (curnode instanceof lz[ nrp.classname ])) || ( (nrp.classname in global) && (curnode instanceof global[ nrp.classname ])))) ||
            (t == this._sel_compound && this._compoundSelectorApplies( nrp, curnode, true ))){
            if ( sindex-- == 0 ){
                result = true;
                break;
            }
        } else if ( firstone ){
            //if the last selector doesn't apply, then bail -- we'll
            //come back for this when we recurse over the parents in
            //getPropertyValueFor
            result = false;
            break;
        }

        curnode = curnode.parent;
        firstone = false;
    }
    return result;
}

/** @access private */
LzCSSStyle._sel_unknown = 0;
/** @access private */
LzCSSStyle._sel_star = 1;
/** @access private */
LzCSSStyle._sel_id = 2;
/** @access private */
LzCSSStyle._sel_tag = 3
/** @access private */
LzCSSStyle._sel_compound = 4
/** @access private */
LzCSSStyle._sel_attribute = 5
/** @access private */
LzCSSStyle._sel_tagAndAttr = 6

/** @access private */
LzCSSStyle._rules = new Array();

/** optimization for selectors which use [name="value"]
  * @access private */
LzCSSStyle._nameRules = {};

/** @access private */
LzCSSStyle._rulenum = 0

/** @access private */
LzCSSStyle._addRule = function ( r ){
    //do some preprocessing to speed up lookups
    r._lexorder = this._rulenum++;

    var sel = r.selector;
    r.parsed = null;
    var lastsel;
    if ( sel instanceof Array ){
        r.parsed = [];
        r.parsed.type = this._sel_compound;
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
    if ( ( lastsel.type == this._sel_attribute ||
           lastsel.type == this._sel_tagAndAttr )
           && lastsel.attrname == "name" ){
        var aval = lastsel.attrvalue;
        if ( !this._nameRules[ aval ] ) this._nameRules[ aval ] = [];
          this._nameRules[ aval ].push( r );
    } else {
        this._rules.push( r );
    }
}

/** @access private */
LzCSSStyle._parseSelector = function( sel ){
    switch ( typeof ( sel ) ){
        case "object":
            if (sel.simpleselector) {
                sel.type = this._sel_tagAndAttr;
                sel.classname = this._normalizeClassname( sel.simpleselector );
            } else     
                sel.type = this._sel_attribute;
            return sel;
            break;
        case "string":
            return this._parseStringSelector( sel );
            break;
    }
}

/** @access private */
LzCSSStyle._parseStringSelector = function ( sel ){
    var parsed = { };
    if ( sel == "*" ) {
        parsed.type = this._sel_star;
    } else {
        var index = sel.indexOf("#"); 
        if (index >= 0) {
            // Assumption: there should only be one # in a selector
            parsed.id =  sel.substring(index + 1);        
            parsed.type =  this._sel_id;
        } else {
            parsed.type =  this._sel_tag;
            parsed.classname = this._normalizeClassname( sel );
        }

    }

    return parsed;
}


/** The tag name of some nodes doesn't match the associated class name, ie, 
  * nodes declared with tag &lt;view&gt; are instances of LzView, not instances of view.
  * This function normalizes tag names into class names. The complete tag to classname
  * mapping is listed in LaszloInitiator.as. For speed and size, I am only actually 
  * mapping the class names which it seems sane to style. I am excluding data-related
  * classes, because they will have undefined behavior when used together with CSS.
  * @access private
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

/** These objects implement
  * Interface CSSStyleDeclaration (introduced in DOM Level 2) from
  * http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
  */
function LzCSSStyleDeclaration (){ };

/** @access private */
LzCSSStyleDeclaration.prototype._node = null;

LzCSSStyleDeclaration.prototype.getPropertyValue = function ( pname ){
    return LzCSSStyle.getPropertyValueFor( this._node , pname );
}

LzCSSStyleDeclaration.prototype.setNode = function ( node ){
    this._node = node;
}
