/******************************************************************************
 * LzFont.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// DEFINE OBJECT: LzFont

// @keywords private_constructor
// @field String style: The style of the font; one of "plain", "bold", "italic", or 
// @field String name: The name of this font
// @field Number height: Height of this font in pixels.
// @field Number ascent: Ascent of this font above the baseline in pixels.
// @field Number descent: Descent of this font above the baseline in pixels.
// @field [Number] advancetable: Array of character widths indexed
// by character codes (typically ASCII).
// @field [Number] lsbtable: Array of character left-side-bearings indexed
// by character codes (typically ASCII).
// @field [Number] rsbtable: Array of character right-side-bearings indexed
// by character codes (typically ASCII).
//=============================================================================
function LzFont ( fontobject , attrs , style ){
    //@field String name: The name of this <b><i>LzFont</i></b>.
    this.name = fontobject.name;
    //@field String style: The style of this <b><i>LzFont</i></b>.
    this.style = style;

    this.fontobject = fontobject;

    fontobject[ style ] = this;
    
    for (var k in attrs ){
        //ignore server's leading -- it's defined for the runtime
        if ( k == "leading" ) continue;
        this[ k ] = attrs[ k ];
    }
    //Leading is a constanct defined in the text field.

    this.height = this.ascent +  this.descent;
    this.advancetable[ 13 ] = this.advancetable[ 32 ];
    this.advancetable[ 160 ] = 0; /* Indx must match server TTF2FFT.LFC_TMARK */
}

//this is a constant set in the textfield the runtime uses. should match the
//value set in SWFWriter.java
LzFont.prototype.leading = 2;

LzFont.prototype.toString = function (){
    return "Font style " + this.style + " of name " + this.name;
}
