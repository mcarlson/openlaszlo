/**
  * LzFontManager.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
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

/** @devnote currently doesn't support sending variables...
  */

/**
  * Creates an <class>LzFont</class> with the given parameters and adds it to
  * the <attribute>fonts</attribute> list.
  * 
  * @param fontname: The name of the font. This is the string that will be used
  * when requesting a font via <method>getFont</method>
  * @param Object n: The plain style of the font.
  * @param Object b: The bold style of the font.
  * @param Object i: The italic style of the font.
  * @param Object bi: The bold italic style of the font.
  * @access private
  */
LzFontManager.addFont = function (  fontname , n , b , i , bi ){

    var ff = new Object;
    ff.name = fontname;
    
    if ( n ){
        new LzFont( ff , n, "plain");
    }
    if ( b ) { 
        new LzFont( ff , b , "bold");
    }
    if ( i ){
        new LzFont( ff , i, "italic" );
    }
    if ( bi ){
        new LzFont( ff , bi , "bolditalic");
    }
    
    if ( this.fonts == null ){
        this.fonts = new Object;
    }
    this.fonts[ fontname ] = ff;
}

/**
  * Get the named <class>LzFont</class> of the given style.
  * @param String fontname: The name of the font.
  * @param String style: The style of the font. One of <constant>plain</constant>, <constant>bold</constant>, <constant>italic</constant>
  * or <constant>bolditalic</constant>.  If style is <constant>null</constant>, <constant>plain</constant> is assumed.
  * @return any: An <class>LzFont</class> object, or undefined if not found
  * 
  */
LzFontManager.getFont = function ( fontname , style ){
    if ( style == null ) { style = "plain" }
    var fns = fontname.split(',');
    if (fns.length > 0) {
        for (var i = 0; i < fns.length; i++) {
            fontname = fns[i];
            var tfn = this.fonts[ fontname ];
            if (tfn) {
                return  tfn[ style ];
            }    
        }
        return null;
    } else {   
        var tfn = this.fonts[ fontname ];
        if (tfn) {
            return  tfn[ style ];
        } else {
            return null;
        }
    }    
}

/**
  * Apply/add the requested style to the given <class>LzFont</class> and
  * return the new <class>LzFont</class>.
  * 
  * @param f: An <class>LzFont</class>.
  * @param s: the style string (One of "plain", "bold", "italic", or "bolditalic").
  * @return LzFont:  The new <class>LzFont</class>.
  * @access private
  */
LzFontManager.addStyle = function ( f , s ){
    //not pretty -- especially if the complexity of styles grows -- but works
    //for now

    if ( f.style == "bolditalic") {
        return f;
    } else if ( s == "bold" ){
        if ( f.style =="italic" ){
            return f.fontobject.bolditalic;
        } else {
            return f.fontobject.bold;
        }
    } else if ( s == "italic" ) {
        if ( f.style =="bold" ){
            return f.fontobject.bolditalic;
        } else {
            return f.fontobject.italic;
        }
    } else if ( s== "bolditalic" ){
        return f.fontobject.bolditalic;
    }

    // no change
    return f;

}

// Map {font-name -> true} of client font names.  convertFontList
// initializes this.
LzFontManager.__clientFontNames = null;

// A map from CSS generic font family names such as 'sans-serif' to
// Flash names such as '_sans'.
LzFontManager.__fontFamilyMap = {'monospace': '_typewriter', 'serif': '_serif', 'sans-serif': '_sans'};

// A hashset of device font family names.
LzFontManager.__genericClientFontFamilyNames = {'_typewriter': true, '_serif': true, '_sans': true};

if ($debug) {
    // The runtime warns about the use of Flash-specific names.
    // This is a list of names that have been warned about, to
    // eliminate duplicate warnings.
    LzFontManager.__debugWarnedFonts = {};
}

LzFontManager.__fontnameCacheMap = {};

/**
  * Convert an LZX font name to one that the Flash runtime can render.
  * This involves removing whitespace, and changing CSS generic font family
  * names such as 'sans-serif' to Flash names such as '_sans'.
  */
LzFontManager.__convertFontName = function (name) {
    // FIXME [2004-11-29 ows]: trim other types of whitespace too
    while (name.charAt(0) == ' ') name = name.slice(1);
    while (name.charAt(name.length - 1) == ' ') name = name.slice(0, name.length-1);
    var map = this.__fontFamilyMap;
    // Warn about uses of Flash-specific names.  These won't work on
    // other runtimes.
    if ($debug) {
        for (var i in map)
            if (name == map[i] && !this.__debugWarnedFonts[name]) {
                this.__debugWarnedFonts[name] = true;
                Debug.warn("Undefined font %w.  Use %w instead", name, i);
            }
    }
    if (typeof map[name] == 'string') name = map[name];
    return name;
}

/**
  * Return the first name that can be rendered, or the first name if
  * none of the names can be rendered. str is a comma-separated list
  * of font names.
  */
LzFontManager.__findMatchingFont = function (str) {
    if (this.__clientFontNames == null) {
        this.__clientFontNames = {};
        var fonts = TextField.getFontList()
        for (var i = 0; i < fonts.length; ++i) {
            this.__clientFontNames[fonts[i]] = true;
        }
    }
    
    var name = null;
    if (str.indexOf(',') >= 0) {
        var names = str.split(',');
        for (var i = 0; i < names.length; i++) {
            name = names[i] = this.__convertFontName(names[i]);
            if (this.__clientFontNames[name] || this.__genericClientFontFamilyNames[name]) {
                return name;
            }
        }
    } else {
        name = this.__convertFontName(str);
    }
    if ($debug) {
        if (!LzFontManager.__fontExists(name) && !this.__debugWarnedFonts[name]) {
            this.__debugWarnedFonts[name] = true;
            Debug.warn("Undefined font %w", name);
        }
    }

    return name;
}


/**
  * @access private
  */
LzFontManager.__fontExists = function (str) {
    return (this.fonts[ str ] != null ||
            this.__clientFontNames[str] != null ||
            this.__genericClientFontFamilyNames[str] != null ||
            this.__fontFamilyMap[str] != null);
}
