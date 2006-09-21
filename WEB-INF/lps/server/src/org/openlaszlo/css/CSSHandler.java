/* *****************************************************************************
 * CSSHandler.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.css;

import java.io.*;
import java.util.*;
import org.w3c.css.sac.*;
import org.apache.log4j.*;
import org.jdom.*;

/**
 * Handler used to parse CSS file and process style rules on a document element.
 *
 * @author <a href="mailto:pkang@laszlosystems.com">Pablo Kang</a>
 */
public class CSSHandler implements DocumentHandler, Serializable {

    //==========================================================================
    // class static
    //==========================================================================

    /** Logger. */
    private static Logger mLogger = Logger.getLogger(CSSHandler.class);

    /** CSS parser factory. */ 
    private static org.w3c.css.sac.helpers.ParserFactory mCSSParserFactory = null;

    static {
        // This system property is required for the SAC ParserFactory.
        if (System.getProperty("org.w3c.css.sac.parser") == null) {
            System.setProperty("org.w3c.css.sac.parser",
                               "org.apache.batik.css.parser.Parser");
        }
        mCSSParserFactory = new org.w3c.css.sac.helpers.ParserFactory();
    }

    /** 
     * Entry point to creating a CSSHandler to read from an external 
     *    stylesheet file
     * @param rootDir the directory where cssFile exists.
     * @param cssFile the css file to read. 
     */
    public static CSSHandler parse(String rootDir, String cssFile)
        throws CSSException {
        try {
            mLogger.info("creating CSSHandler");
            CSSHandler handler = new CSSHandler(rootDir,cssFile);
            Parser parser = mCSSParserFactory.makeParser();
            parser.setDocumentHandler(handler);
            parser.parseStyleSheet(handler.getInputSource());
            return handler;
        } catch (Exception e) {
            mLogger.error("Exception", e);
            throw new CSSException(e.getMessage());
        }
    }

    /** 
     * Entry point to creating a CSSHandler from just a string of inlined css
     * @param cssString a string containing the entire CSS to parse
     */
    public static CSSHandler parse(String cssString) 
        throws CSSException {
        try {
            mLogger.debug("entering CSSHandler.parse with inline string");
            CSSHandler handler = new CSSHandler(cssString);
            Parser parser = mCSSParserFactory.makeParser();            
            parser.setDocumentHandler(handler);
            java.io.Reader cssReader = new java.io.StringReader(cssString);
            InputSource inputSource = new InputSource(cssReader);
            parser.parseStyleSheet(inputSource);
            return handler;
        } catch (Exception e) {
            mLogger.error("Exception reading from inline stylesheet", e);
            throw new CSSException(e.getMessage());
        }
    }



    //==========================================================================
    // instance
    //==========================================================================

    /** The directory where the main CSS file exists */
    String mRootDir;

    /** The CSS file to parse. */
    String mCSSFile;

    /** List of Rule instances. */
    public List mRuleList;

    /** Used as a map of style properties for selector group being parsed. */
    Map mStyleMap;

    /** A list of CSS files separated by two file separators characters. */
    String mFileDependencies;
    
    /** protected constructor */
    CSSHandler(String rootDir, String cssFile) {
        mCSSFile = cssFile;
        mRootDir = rootDir;
        mRuleList = new Vector();
        mFileDependencies = getFullPath();
    }

    /** protected constructor */
    CSSHandler(CSSHandler handler, String cssFile) {
        mCSSFile = cssFile;
        mRootDir = handler.mRootDir;
        mRuleList = handler.mRuleList;
        mFileDependencies = null;

        handler.mFileDependencies += 
            File.separator + File.separator + getFullPath();
    }
    
    /** protected constructor */
    CSSHandler(String cssString) {
        mCSSFile = "";
        mRootDir = "";
        mRuleList = new Vector();
        mFileDependencies = ""; // inline css doesn't add any file dependencies
    }
    

    /** Helper function to log and throw an error. */
    void throwCSSException(String errMsg) throws CSSException {
        mLogger.error(errMsg);
        throw new CSSException(errMsg);
    }

    /** @return full path to CSS file */
    String getFullPath () {
        return mRootDir + File.separatorChar + mCSSFile;
    }

    /** @return InputSource object pointing to the CSS file. */
    InputSource getInputSource() throws FileNotFoundException {
        InputSource is =
            new InputSource(new FileReader(new File(getFullPath())));
//         is.setEncoding("ISO-8859-1");
        return is;                                         
    }

    /** 
     * Get a string containing a list CSS files required by the parse. Includes
     * imported CSS files.
     * @return a list of CSS files separated by two file separators characters.
     */
    public String getFileDependencies() {
        return mFileDependencies;
    }

    //--------------------------------------------------------------------------
    // Implement DocumentHandler interface.
    //--------------------------------------------------------------------------

    public void startSelector(SelectorList selectors) throws CSSException {
        mStyleMap = new HashMap();
    }

    public void endSelector(SelectorList selectors) throws CSSException {
        if (mStyleMap.size() != 0) {
            for (int i=0; i <  selectors.getLength(); i++) {
                mRuleList.add(new Rule(selectors.item(i), mStyleMap));
            }
        }
    }

    public void property(String name, LexicalUnit value, boolean important)
        throws CSSException {
        mStyleMap.put(name, new StyleProperty(luToString(value), important));
    }

    public void importStyle(String uri, SACMediaList media,
                            String defaultNamespaceURI) throws CSSException {
        try {
            CSSHandler handler = new CSSHandler(this, uri);
            Parser parser = mCSSParserFactory.makeParser();
            parser.setDocumentHandler(handler);
            parser.parseStyleSheet(handler.getInputSource());
        } catch (Exception e) {
            mLogger.error("Exception", e);
            throw new CSSException(e.getMessage());
        }
    }
    
    public void startDocument(InputSource source) throws CSSException {
        /* ignore */
    }

    public void endDocument(InputSource source) throws CSSException {
        /* ignore */
    }

    public void comment(String text) {
        /* ignore */
    }

    public void startFontFace() throws CSSException {
        throwCSSException("start font face unsupported");
    }
    public void endFontFace() throws CSSException {
        throwCSSException("end font face unsupported");
    }
    public void startMedia(SACMediaList media) throws CSSException {
        throwCSSException("start media unsupported");
    }
    public void endMedia(SACMediaList media) throws CSSException {
        throwCSSException("start media unsupported");
    }
    public void startPage(String name, String pseudoPage) throws CSSException {
        throwCSSException("start page unsupported: " + name + ", " + pseudoPage);
    }
    public void endPage(String name, String pseudoPage) throws CSSException {
        throwCSSException("end page unsupported: " + name + ", " + pseudoPage);
    }
    public void namespaceDeclaration(String prefix, String uri)
        throws CSSException {
        throwCSSException("namespace declaration unsupported: " + prefix + ":" + uri);
    }
    public void ignorableAtRule(String atRule) throws CSSException {
        throwCSSException("ignorable at rule: " + atRule);
    }


    //--------------------------------------------------------------------------
    // helper methods
    //--------------------------------------------------------------------------
    
    /** @return an RGB formatted hex string like #FFFFFF. */
    String getRGBString(LexicalUnit lu) {
        int rr = lu.getIntegerValue();
        lu = lu.getNextLexicalUnit().getNextLexicalUnit(); // skip comma
        int gg = lu.getIntegerValue();
        lu = lu.getNextLexicalUnit().getNextLexicalUnit(); // skip comma
        int bb = lu.getIntegerValue();

        return "#"
            + (rr < 16 ? "0" : "") + Integer.toHexString(rr).toUpperCase()
            + (gg < 16 ? "0" : "") + Integer.toHexString(gg).toUpperCase()
            + (bb < 16 ? "0" : "") + Integer.toHexString(bb).toUpperCase();
    }
    
    /**
      * Convert LexicalUnit to a string value.
      */
     String luToString(LexicalUnit lu) {
         String str = "";
         switch (lu.getLexicalUnitType()) {
         case LexicalUnit.SAC_ATTR:
         case LexicalUnit.SAC_IDENT:
         case LexicalUnit.SAC_STRING_VALUE:
         case LexicalUnit.SAC_URI:
             str = lu.getStringValue();
             break;

         case LexicalUnit.SAC_CENTIMETER:
         case LexicalUnit.SAC_DEGREE:
         case LexicalUnit.SAC_DIMENSION:
         case LexicalUnit.SAC_EM:
         case LexicalUnit.SAC_EX:
         case LexicalUnit.SAC_GRADIAN:
         case LexicalUnit.SAC_HERTZ:
         case LexicalUnit.SAC_INCH:
         case LexicalUnit.SAC_KILOHERTZ:
         case LexicalUnit.SAC_MILLIMETER:
         case LexicalUnit.SAC_MILLISECOND:
         case LexicalUnit.SAC_PERCENTAGE:
         case LexicalUnit.SAC_PICA:
         case LexicalUnit.SAC_PIXEL:
         case LexicalUnit.SAC_POINT:
         case LexicalUnit.SAC_RADIAN:
         case LexicalUnit.SAC_REAL:
         case LexicalUnit.SAC_SECOND:
             str = Float.toString(lu.getFloatValue()) +
                   lu.getDimensionUnitText();
             break;

         case LexicalUnit.SAC_INTEGER:
             str = Integer.toString(lu.getIntegerValue());
             break;

         case LexicalUnit.SAC_RGBCOLOR:
             str = getRGBString(lu.getParameters());
             break;

         //----------------------------------------------------------------------
         // TODO [2005-10-07 pkang]: don't think I'm handling these literal
         // lexical units correctly. Not worrying for now since we only
         // support basic values
         //----------------------------------------------------------------------

         case LexicalUnit.SAC_INHERIT:
             str = "inherit";
             break;
         case LexicalUnit.SAC_OPERATOR_COMMA:
             str = ",";
             break;
         case LexicalUnit.SAC_OPERATOR_EXP:
             str = "^";
             break;
         case LexicalUnit.SAC_OPERATOR_GE:
             str = ">=";
             break;
         case LexicalUnit.SAC_OPERATOR_GT:
             str = ">";
             break;
         case LexicalUnit.SAC_OPERATOR_LE:
             str = "<=";
             break;
         case LexicalUnit.SAC_OPERATOR_LT:
             str = "<";
             break;
         case LexicalUnit.SAC_OPERATOR_MINUS:
             str = "-";
             break;
         case LexicalUnit.SAC_OPERATOR_MOD:
             str = "%";
             break;
         case LexicalUnit.SAC_OPERATOR_MULTIPLY:
             str = "*";
             break;
         case LexicalUnit.SAC_OPERATOR_PLUS:
             str = "+";
             break;
         case LexicalUnit.SAC_OPERATOR_SLASH:
             str = "/";
             break;
         case LexicalUnit.SAC_OPERATOR_TILDE:
             str = "~";
             break;

         case LexicalUnit.SAC_COUNTER_FUNCTION:
             throwCSSException("SAC_COUNTER_FUNCTION unsupported");
         case LexicalUnit.SAC_COUNTERS_FUNCTION:
             throwCSSException("SAC_COUNTERS_FUNCTION unsupported");
         case LexicalUnit.SAC_FUNCTION:
             throwCSSException("SAC_FUNCTION unsupported");
         case LexicalUnit.SAC_RECT_FUNCTION:
             throwCSSException("SAC_RECT_FUNCTION unsupported");
         case LexicalUnit.SAC_SUB_EXPRESSION:
             throwCSSException("SAC_SUB_EXPRESSION unsupported");
         case LexicalUnit.SAC_UNICODERANGE:
             throwCSSException("SAC_UNICODERANGE unsupported");
         default:
             throwCSSException("unsupported lexical unit type: " +
                               lu.getLexicalUnitType());
         }
         return str;
     }

    
}
