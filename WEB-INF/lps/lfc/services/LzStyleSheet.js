/******************************************************************************
 * LzStyleSheet.js
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************



//==============================================================================
// DEFINE OBJECT: LzStyleSheet
// This service represents a style sheet
/// Source: http://www.w3.org/TR/DOM-Level-2-Style/stylesheets.html#StyleSheets-StyleSheet
// Introduced in DOM Level 2:
/*
interface StyleSheet {
  readonly attribute DOMString        type;
           attribute boolean          disabled;
  readonly attribute Node             ownerNode;
  readonly attribute StyleSheet       parentStyleSheet;
  readonly attribute DOMString        href;
  readonly attribute DOMString        title;
  readonly attribute MediaList        media;
};
*/ 
//
//==============================================================================


function LzStyleSheet( title, href, media, sstype ) {
    this.type = sstype;
    this.disabled = false; 
    this.ownerNode = null;
    this.parentStyleSheet = null;
    this.href = href;
    this.title = title;
    this.media = media; 
}
