/**
  * LzFontManager.as
  *
  * @copyright Copyright 2009 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

/** Manages the font dictionary.
  *
  * @devnote In addition to any fields documented in the section below, these fields 
  * are also available:
  *
  * dictionary <attribute>fonts</attribute>: A hash holding named font objects.
  * Each font object contains slots for the styles that are available
  * (plain, bold, italic, and/or bolditalic).
  */
var LzFontManager = new Object;

LzFontManager.fonts = {};

/**
  * Creates an <class>LzFont</class> with the given parameters and adds it to
  * the <attribute>fonts</attribute> list.
  * 
  * @param fontname: The name of the font.
  * @param fontstyle: The style of the font, "normal" | "italic"
  * @param fontweight: The weight of the font, "normal" | "bold"
  * @param path: The path to the font.  See LzResourceLibrary for details
  * @param ptype: The path type for the font.  See LzResourceLibrary for details
  * @access private
  */
LzFontManager.addFont = function ( fontname, fontstyle, fontweight, path, ptype ){
    var fontobj = {name: fontname, style: fontstyle, weight: fontweight, url: path, ptype: ptype}
    LzFontManager.fonts[fontname +'_' + fontstyle + '_' + fontweight] = fontobj;
}

// Generates a CSS include for each font added
// See http://randsco.com/index.php/2009/07/04/p680 for details about the IE hack
LzFontManager.generateCSS = function() {
    var fonts = LzFontManager.fonts;
    var output = '';
    for (var i in fonts) {
        var font = fonts[i];
        var url = LzFontManager.getURL(font);
        var i = url.lastIndexOf('.ttf');
        var ieurl = url.substring(0, i) + '.eot';
        output += '@font-face{font-family:' + font.name + ';src:url(' + ieurl + ');src:local("' + font.name + '"), url(' + url + ') format("truetype");font-weight:' + font.weight + ';font-style:' + font.style + ';}';
    }
    return output;
}

LzFontManager.getURL = function(font) {
    var baseurl = LzSprite.prototype.getBaseUrl(font);
    return baseurl + font.url;
}

LzFontManager.getFont = function(fontname, fontstyle, fontweight) {
    return this.fonts[fontname + '_' + fontstyle + '_' + fontweight];
}
