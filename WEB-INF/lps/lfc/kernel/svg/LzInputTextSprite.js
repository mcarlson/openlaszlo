/**
  * LzInputTextSprite.js
  *
  * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic SVG
  */

LzInputTextSprite = function(owner) {
    var svg_ns = "http://www.w3.org/2000/svg";
    var group = document.createElementNS(svg_ns, "g");
    var textelt = document.createElementNS(svg_ns, "text");
    var content = document.createTextNode("");
    textelt.appendChild(content);
    group.setAttribute('transform', 'translate(0,0)');
    group.appendChild(textelt);
    this.__LZgroup = group;
    this.__LZrect = textelt;
    if (owner == null) return;
    this.owner = owner;


    this.playDel = new LzDelegate( this , "incrementFrame" );

    this.mouseupdel = new LzDelegate(this, 'globalmouseup');
}

LzInputTextSprite.prototype = new LzSprite(null);

LzInputTextSprite.prototype.setEnabled = function(val) {
    //
}

LzInputTextSprite.prototype.__initTextProperties = function (args) {
    this.setFontName(args.font);
    this.setFontStyle(args.fontstyle);
    this.setFontSize(args.fontsize);
}

LzInputTextSprite.prototype.setFontSize = function (fsize) {
    if (fsize == null || fsize < 0) return;
    // In standard-compliance mode, all dimensions must have units
    this.__LZgroup.setAttribute('font-size', this.CSSDimension(fsize));
    this.fontSize = fsize;
}

LzInputTextSprite.prototype.setFontStyle = function (fstyle) {
    var fweight;

    if (fstyle == "plain") {
        fweight = "normal";
        fstyle = "normal";
    } else if (fstyle == "bold") {
        fweight = "bold";
        fstyle = "normal";
    } else if (fstyle == "italic") {
        fweight = "normal";
        fstyle = "italic";        
    } else if (fstyle == "bold italic" || fstyle == "bolditalic") {
        fweight = "bold";
        fstyle = "italic";        
    }

    this.__LZgroup.setAttribute('font-style', fstyle);
    this.__LZgroup.setAttribute('font-weight', fweight);

    this.fontStyle = fstyle;
    this.fontWeight = fweight;
}

LzInputTextSprite.prototype.setFontName = function (fname) {
    this.__LZgroup.setAttribute('font-family' , fname);
    this.fontFamily = fname;
}

LzInputTextSprite.prototype.setTextColor = LzSprite.prototype.setColor;

LzInputTextSprite.prototype.setText = function(t) {
    if (this.text == t) return;
    //Debug.write('LzInputTextSprite.setText', t);
    this.text = t;
    this.__LZrect.firstChild.nodeValue = t;

    // reset the size cache
    if (this._textsizecache) this._textsizecache = {};
    this.fieldHeight = null;
}

LzInputTextSprite.prototype.setMultiline = function(m) {
    this.multiline = (m == true);
    if (m) {
        // NYI
    } else {
        // NYI
    }
}

LzInputTextSprite.prototype.getTextWidth = function () {
  //Debug.write('LzInputTextSprite.getTextWidth', this.text, this._textsizecache[this.text]);
  if (this.text == '') return 0;
  return this.getTextSize(this.text).width;
}

LzInputTextSprite.prototype.getTextHeight = function () {
    // [TODO: calculate true height of text]
  //Debug.write('LzInputTextSprite.getTextHeight', this.text, this.__LZgroup, this.getHeight());
    if (this.__LZrect) {
        return this.getHeight();
    } else {
        return 0
    }    
}

LzInputTextSprite.prototype.getTextfieldHeight = function () {
    if (this.fieldHeight != null) return this.fieldHeight
    if (this.text == '') {
        this.fieldHeight = 0;
        return 0;
    }
    
    // +++FIXME WHY IS LZgroup ever null???
    var h = 12;
    //var h = this._LZgroup.getAttribute('height');


    this.fieldHeight = h;
    return h;
}

  
LzInputTextSprite.prototype.getTextSize = function (string) {
    if (this.text == '') return {width: 0,height: 0};
    if (! this._textsizecache) this._textsizecache = {};
    if (! this._textsizecache[string]) {
        var dim = {};
        var textelt = document.createElementNS(svg_ns, "text");
        if (this.fontSize) textelt.setAttribute('font-size', this.__LZrect.getAttribute('font-size'));
        /*            if (this.fontStyle) html += '; font-style: ' +this.fontStyle;
            if (this.fontWeight) html += '; font-weight: ' + this.fontWeight;
            if (this.fontFamily) html += '; font-family: '  + this.fontFamily;
        */
        dim.width = textelt.getAttribute('width');
        dim.height = textelt.getAttribute('height');
        this._textsizecache[string] = dim;
    }
    return this._textsizecache[string];
}

LzInputTextSprite.prototype.setSelectable = function () {
// TODO: not implemented
}


/**
  * @access private
  */
LzInputTextSprite.prototype.setFont = function () {
    if ( null == this.fontFamily){
        this.setFontName(this.owner.searchParents( "fontname" ).fontname);
        //Debug.write('searching parent for fontname', this, this.fontname,this.owner.searchParents( "fontname" ));
    }

    if ( null == this.fontStyle ){
        this.setFontStyle(this.owner.searchParents( "fontstyle" ).fontstyle);
    }

    if ( null == this.fontSize ){
        this.setFontSize(this.owner.searchParents( "fontsize" ).fontsize);
    }

    /* TODO: not implemented
    this.lineheight = this.font.leading + ( this.font.height *
                                                this.fontsize/ this.DEFAULT_SIZE );
    */
}

/**
  * Returns the string represented in the text field
  * @return: The string in the text field
  */
LzInputTextSprite.prototype.getText = function ( ){
    return this.text;
}

LzInputTextSprite.prototype.setResize = function ( ){
// TODO: not implemented
}

/*
LzInputTextSprite.prototype.setWidth = function ( ){
// TODO: not implemented
}

LzInputTextSprite.prototype.setHeight = function ( ){
// TODO: not implemented
}
*/

/**
  * Sets the format string for the text field.
  * @access private
  */
LzInputTextSprite.prototype.setFormat = function (){
// TODO: not implemented
}

