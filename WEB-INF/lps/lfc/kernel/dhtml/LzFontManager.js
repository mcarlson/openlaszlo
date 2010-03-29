/**
  * LzFontManager.as
  *
  * @copyright Copyright 2009-2010 Laszlo Systems, Inc.  All Rights Reserved.
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
    return LzSprite.prototype.getBaseUrl(font) + font.url;
}

// tracks load state for each font url
LzFontManager.__fontloadstate = {counter: 0};
// callbacks for when fonts finish loading
LzFontManager.__fontloadcallbacks = {};
// Returns true if the font is available and loaded
LzFontManager.isFontLoaded = function(sprite, fontname, fontstyle, fontweight) {
    var font = this.fonts[fontname + '_' + fontstyle + '_' + fontweight];
    // No font to load, return true
    if (! font) return true;

    // Check loading state
    var url = this.getURL(font);
    var fontloadstate = this.__fontloadstate[url];
    if (fontloadstate) {
        var loadingstatus = fontloadstate.state;
        if (loadingstatus >= 2) {
            // done loading or timed out
            return true;
        }
    } else {
        // Load font...

        // Create measurement div and measure its initial size
        var style = 'font-family:' + fontname + ';font-style:' + fontstyle + ';font-weight:' + fontweight + ';width:auto;height:auto;';
        var mdiv = sprite.__createMeasureDiv('lzswftext', style, 'Yq_gy"9;ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789-=abcdefghijklmnopqrstuvwxyz');
        mdiv.style.display = 'inline';
        var width = mdiv.clientWidth;
        var height = mdiv.clientHeight;
        mdiv.style.display = 'none';

        // Init loading state
        var fontloadstate = {state: 1, timer: (new Date()).valueOf()};
        this.__fontloadstate[url] = fontloadstate;
        this.__fontloadstate.counter++;

        // Create callback for each font url
        var cstr = lz.BrowserUtils.getcallbackfunc(LzFontManager, '__measurefontdiv', [mdiv, width, height, url]);
        fontloadstate.TID = setInterval(cstr, (Math.random() * 20) + 30);
    }

    // Add sprite to callbacks table
    this.__fontloadcallbacks[sprite.uid] = sprite;
}

// Time before a font load is canceled
LzFontManager.fontloadtimeout = 15000;

LzFontManager.__measurefontdiv = function(mdiv, width, height, url){
    mdiv.style.display = 'inline';
    var newwidth = mdiv.clientWidth;
    var newheight = mdiv.clientHeight;
    mdiv.style.display = 'none';

    var fontloadstate = this.__fontloadstate[url];
    if (newwidth == width && newheight == height) {
        // Size didn't change...
        var timediff = (new Date()).valueOf() - fontloadstate.timer;
        if (timediff < LzFontManager.fontloadtimeout) {
            // keep loading until timout is reached
            return;
        }
        // Mark as timed out and warn
        fontloadstate.state = 3;
        if ($debug) {
            Debug.warn('Timeout or error loading font ', url);
        }
    } else {
        // Mark as loaded
        fontloadstate.state = 2;
    }

    // Finished loading this font
    clearInterval(fontloadstate.TID);
    this.__fontloadstate.counter--;

    // Don't call back until all fonts finish loading
    if (this.__fontloadstate.counter != 0) return;

    // Clear text measurement cache once
    LzTextSprite.prototype.__clearMeasureCache();

    // Call back each sprite
    var callbacks = this.__fontloadcallbacks;
    for (var i in callbacks) {
        var sprite = callbacks[i];
        if (sprite) {
            sprite.__fontLoaded();
        }
    }
    delete this.__fontloadcallbacks;
}
