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
public class LzFontManager {

    #passthrough (toplevel:true) {  
        import flash.text.Font;
    }#

        static  var fonts = { };

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
    public static function addFont(  fontname , n , b , i , bi ){

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
    
        LzFontManager.fonts[ fontname ] = ff;
    }

    /**
     * Get the named <class>LzFont</class> of the given style.
     * @param String fontname: The name of the font.
     * @param String style: The style of the font. One of <constant>plain</constant>, <constant>bold</constant>, <constant>italic</constant>
     * or <constant>bolditalic</constant>.  If style is <constant>null</constant>, <constant>plain</constant> is assumed.
     * @return any: An <class>LzFont</class> object, or undefined if not found
     * 
     */
    public static function getFont ( fontname , style ){
        if ( style == null ) { style = "plain" }
        var fns = fontname.split(',');
        if (fns.length > 0) {
            for (var i = 0; i < fns.length; i++) {
                fontname = fns[i];
                var tfn = LzFontManager.fonts[ fontname ];
                if (tfn) {
                    return  tfn[ style ];
                }    
            }
            return null;
        } else {   
            var tfn = LzFontManager.fonts[ fontname ];
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
    public static  function addStyle ( f , s ){
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
    static var __clientFontNames;

    // A map from CSS generic font family names such as 'sans-serif' to
    // Flash names such as '_sans'.
    static var __fontFamilyMap = {'monospace': '_typewriter', 'serif': '_serif', 'sans-serif': '_sans'};

    // A hashset of device font family names.
    static var __genericClientFontFamilyNames = {'_typewriter': true, '_serif': true, '_sans': true};

    static public var __fontnameCacheMap = {};

    static var __debugWarnedFonts = {};

    /**
     * Convert an LZX font name to one that the Flash runtime can render.
     * This involves removing whitespace, and changing CSS generic font family
     * names such as 'sans-serif' to Flash names such as '_sans'.
     */
    public static function __convertFontName (name) {
        // FIXME [2004-11-29 ows]: trim other types of whitespace too
        while (name.charAt(0) == ' ') name = name.slice(1);
        while (name.charAt(name.length - 1) == ' ') name = name.slice(0, name.length-1);
        var map = LzFontManager.__fontFamilyMap;
        // Warn about uses of Flash-specific names.  These won't work on
        // other runtimes.
        if ($debug) {
            for (var i in map)
                if (name == map[i] && !LzFontManager.__debugWarnedFonts[name]) {
                    LzFontManager.__debugWarnedFonts[name] = true;
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
    public static function __findMatchingFont (str) {
        if (LzFontManager.__clientFontNames == null) {
            LzFontManager.__clientFontNames = {};
            var fonts = Font.enumerateFonts(true);
                for (var i in fonts) {
                    LzFontManager.__clientFontNames[fonts[i].fontName] = true;
                }
        }
    
        var name = null;
        if (str.indexOf(',') >= 0) {
            var names = str.split(',');
            for (var i = 0; i < names.length; i++) {
                name = names[i] = LzFontManager.__convertFontName(names[i]);
                if (LzFontManager.__clientFontNames[name] || LzFontManager.__genericClientFontFamilyNames[name]) {
                    return name;
                }
            }
        } else {
            name = LzFontManager.__convertFontName(str);
        }
        if ($debug) {
            if (!LzFontManager.__fontExists(name)) {
                Debug.warn("Undefined font %w", name);
            }
        }

        return name;
    }

    /**
     * @access private
     */
    public static function __fontExists (str) {
        return (LzFontManager.fonts[ str ] != null ||
                LzFontManager.__clientFontNames[str] != null ||
                LzFontManager.__genericClientFontFamilyNames[str] != null ||
                LzFontManager.__fontFamilyMap[str] != null);
    }
}
lz.FontManager = LzFontManager;  // publish
