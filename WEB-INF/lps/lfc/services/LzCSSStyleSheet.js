/******************************************************************************
 * LzCSSStyleSheet.js 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT: LzCSSStyleSheet
// This service represents a CSS Style sheet
// Introduced in DOM Level 2:
// interface CSSStyleSheet : stylesheets::StyleSheet {
//  readonly attribute CSSRule          ownerRule;
//   readonly attribute CSSRuleList      cssRules;
//   unsigned long      insertRule(in DOMString rule, 
//                                in unsigned long index)
//                                        raises(DOMException);
//  void               deleteRule(in unsigned long index)
//                                        raises(DOMException);
// };
//
//==============================================================================

// How do I represent inheritance here? 
function LzCSSStyleSheet( title, href, media, sstype, ownerRule, cssRules ) {
    // this is DUPLICATED from LzStyleSheet
    this.type = sstype;
    this.disabled = false; 
    this.ownerNode = null;
    this.parentStyleSheet = null;
    this.href = href;
    this.title = title;
    this.media = media; 
    
    this.ownerRule = ownerRule;
    this.cssRules = cssRules;
}

/* 
insertRule Used to insert a new rule into the style sheet. The new rule now
becomes part of the cascade. 

Parameters

 rule of type DOMString 
 The parsable text representing the rule. For rule
sets this contains both the selector and the style declaration. For
at-rules, this specifies both the at-identifier and the rule content.

 index of type unsigned long 
 The index within the style sheet's rule list
of the rule before which to insert the specified rule. If the specified
index is equal to the length of the style sheet's rule collection, the rule
will be added to the end of the style sheet.

Return Value
 unsigned long
 The index within the style sheet's rule collection of the newly inserted
rule. 

Error conditions:
DOMException

HIERARCHY_REQUEST_ERR: Raised if the rule cannot be inserted at the specified
index e.g. if an @import rule is inserted after a standard rule set or other
at-rule.
INDEX_SIZE_ERR: Raised if the specified index is not a valid insertion point.
NO_MODIFICATION_ALLOWED_ERR: Raised if this style sheet is readonly.
SYNTAX_ERR: Raised if the specified rule has a syntax error and is unparsable
*/ 
LzCSSStyleSheet.prototype.insertRule = function(rule, index) {
    if (!this.cssRules) {
        this.cssRules = [];
    }
    
    if (index < 0) {
        // INDEX_SIZE_ERR
        return null;
    } 
    if (index < this.cssRules.length) {
        // INDEX_SIZE_ERR
        this.cssRules.splice(index,0,rule);
        return index; 
    } 
    if (index == this.cssRules.length) {
        // the array.push returns the new rule's index + 1
        // we correct with -1.
        return (this.cssRules.push(rule) - 1);
    }
    // INDEX_SIZE_ERR
    return null; 
}
    

    
    