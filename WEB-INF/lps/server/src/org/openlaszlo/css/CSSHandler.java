/* *****************************************************************************
 * CSSHandler.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.css;

import java.io.*;
import java.nio.CharBuffer;
import java.util.*;
import java.util.regex.*;
import org.w3c.css.sac.*;
import org.apache.log4j.*;
import org.jdom.*;

import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.compiler.CompilationError;

/**
 * Handler used to parse CSS file and process style rules on a document element.
 *
 * @author <a href="mailto:pkang@laszlosystems.com">Pablo Kang</a>
 */
public class CSSHandler implements DocumentHandler, Serializable, ErrorHandler {

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
     * @param file the css file to read.
     * @param String value of an optional charset attribute on the stylesheet tag
     */
    public static CSSHandler parse(File file, String charsetAttrValue)
           throws CSSException {
       try {
           mLogger.info("creating CSSHandler");
           CSSHandler handler = new CSSHandler(file);
           Parser parser = mCSSParserFactory.makeParser();
           parser.setDocumentHandler(handler);
           parser.setErrorHandler(handler);
           mLogger.info("Trying to parse CSS with charset setting of " + charsetAttrValue);
           parser.parseStyleSheet(handler.getInputSource(charsetAttrValue,file.getPath()));
           return handler;
       } catch (CSSParseException e) {
           mLogger.error("got css parse exception");
           throw e;
       } catch (CSSException e) {
           mLogger.error("got css exception");
           throw e;
       } catch (Exception e) {
           mLogger.error("exception while parsing CSS");
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
            parser.setErrorHandler(handler);
            java.io.Reader cssReader = new java.io.StringReader(cssString);
            InputSource inputSource = new InputSource(cssReader);
            parser.parseStyleSheet(inputSource);
            return handler;
        } catch (CSSParseException e) {
            mLogger.error("got css parse exception on inline css, " + e.getMessage());
            throw e;
        } catch (CSSException e) {
            mLogger.error("got css exception on inline css" + e.getMessage());
            throw e;
        } catch (Exception e) {
            mLogger.error("exception while parsing inline css");
            throw new CSSException(e.getMessage());
        }
    }



    //==========================================================================
    // instance
    //==========================================================================

    /** The css file itself */
    File mFile;

    /** List of Rule instances. */
    public List mRuleList;

    /** Used as a map of style properties for selector group being parsed. */
    Map mStyleMap;

    /** A list of CSS files separated by two file separators characters. */
    String mFileDependencies;


    /** protected constructor */
    CSSHandler(File file) {
        mFile = file;
        mRuleList = new Vector();
        mFileDependencies = getFullPath();
    }

    /** protected constructor */
    CSSHandler(String cssString) {
        mFile = null; // No file associated with inline css
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
        try {
            return mFile.getCanonicalPath();
        } catch (IOException e) {
            mLogger.error("Exception getting canonical path of: " + mFile + ", " + e.getMessage());
            return "";
        }
    }

    /** @param charsetAttrValue charset value from the stylesheet tag in LZX
     *  @param the name of the CSS file we need to parse
     *  @return InputSource object pointing to the CSS file. */
    InputSource getInputSource(String charsetAttrValue, String fileName) throws FileNotFoundException  {
        // Detect if there's a BOM with encoding information on the file.
        // If there's a BOM that shouldn't conflict with a possible @charset
        // attribute of the stylesheet tag in LZX, e.g. <stylesheet charset="iso-8859-15" />
        BufferedInputStream bis = null;
        InputSource inputSource = null;
        InputStreamReader isr = null;
        // Encoding read from BOM in CSS file
        String bomEncoding = null;
        // Encoding used for opening CSS file
        String encoding = "utf-8";
        try {
            bis = new BufferedInputStream(new FileInputStream(mFile));
            bomEncoding =  FileUtils.detectBOMEncoding(bis);
        } catch (IOException e) {
            mLogger.error("IOException during BOM detection:\n" + e.getMessage());
            throw new CompilationError("IO Exception while trying to open file");
        }

        // If we got a BOM encoding value, check if there no conflicting declaration
        // on the stylesheet tag
        if (bomEncoding != null) {
            if (charsetAttrValue != null && !charsetAttrValue.toUpperCase().equals(bomEncoding.toUpperCase())) {
                throw new CompilationError("<stylesheet charset=\"" + charsetAttrValue + "\"> conflicts with BOM "
                        + bomEncoding + " for CSS file " + fileName + ".");
            }
            encoding = bomEncoding;
        } else if (charsetAttrValue != null) {
            encoding = charsetAttrValue;
            if (mLogger.isDebugEnabled()) {
            mLogger.debug("Using encoding from LZX <stylesheet charset=\"" + encoding + "\">");
            }
        }

        // Parse CSS file now
        /* New code for reading stream */

        try {
            if (mLogger.isDebugEnabled()) {
             mLogger.debug("Opening CSS file " + fileName + " using encoding " + encoding);
            }
            if (bomEncoding != null && bomEncoding.toUpperCase().equals("UTF-8")) {
                // TODO: Check what the 2nd parameter on the PushBackInputStream constructor means
                PushbackInputStream internalIn = new PushbackInputStream(new FileInputStream(mFile), 3);
                // skip the first 3 bytes
                internalIn.skip(3);
                isr = new InputStreamReader(internalIn, encoding);
                inputSource = new InputSource(isr);
                if (mLogger.isDebugEnabled()) {
                mLogger.debug("Skip first 3 bytes containing UTF-8 BOM");
                }
            } else if (bomEncoding != null &&
                       (bomEncoding.toUpperCase().equals("UTF-16LE") || bomEncoding.toUpperCase().equals("UTF-16BE"))) {
                // BOM for UTF-16
                PushbackInputStream internalIn = new PushbackInputStream(new FileInputStream(mFile), 3);
                // skip the first 2 bytes
                internalIn.skip(2);
                isr = new InputStreamReader(internalIn, encoding);
                inputSource = new InputSource(isr);
                if (mLogger.isDebugEnabled()) {
                mLogger.debug("Skip first 3 bytes containing UTF-16 BOM");
                }
            } else {
                if (mLogger.isDebugEnabled()) {
                mLogger.debug("No need to skip bytes");
                }
                // no BOM, just use the normal InputStreamStreader
                inputSource = new InputSource(new InputStreamReader(new FileInputStream(mFile), encoding));
            }

        } catch (UnsupportedEncodingException e) {
            mLogger.error("Unsupported encoding in file: " + mFile + ", " + e.getMessage());
        } catch (IOException e) {
            mLogger.error("Error skipping BOM for InputStreamReader: " + e.getMessage());
        }

        return inputSource;
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

    // Unicode characters
    Pattern hexEscapePattern = Pattern.compile("\\\\([0-9a-fA-F]{1,6})(\r\n|[ \t\r\n\f])?");
    // The only characters that need to be escaped in javascript
    Pattern charEscapePattern = Pattern.compile("\\\\([^\r\n\f0-9a-fA-F])");

    // Convert CSS escapes to Javascript
    protected String processEscapes (String input) {
        // Convert unicode escapes to Javascript equivalent (which
        // means parse the hex escape and insert the corresponding
        // unicode character in it's place).
        Matcher m =  hexEscapePattern.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            // Have I told you how much Java sucks lately?
            CharArrayWriter u = new CharArrayWriter();
            u.write(Integer.parseInt(m.group(1), 16));
            m.appendReplacement(sb, u.toString());
        }
        m.appendTail(sb);
        input = sb.toString();
        // Convert character escapes to Javascript (which means just
        // remove the escape, since none of those chars need escaping
        // in Javascript).
        input = charEscapePattern.matcher(input).replaceAll("$1");
        return input;
    }

    public void property(String name, LexicalUnit value, boolean important)
        throws CSSException {
        mStyleMap.put(processEscapes(name), new StyleProperty(luToString(value), important));
    }

    public void importStyle(String uri, SACMediaList media,
                            String defaultNamespaceURI) throws CSSException {
        try {
            CSSHandler handler = new CSSHandler(new File(uri));
            Parser parser = mCSSParserFactory.makeParser();
            parser.setDocumentHandler(handler);
            parser.parseStyleSheet(handler.getInputSource(null,uri));
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
      int rr = lu.getLexicalUnitType() == LexicalUnit.SAC_PERCENTAGE ?
        (int)Math.round(Math.min(lu.getFloatValue() * 255.0 / 100.0, 255.0)) :
        lu.getIntegerValue();
      lu = lu.getNextLexicalUnit().getNextLexicalUnit(); // skip comma
      int gg = lu.getLexicalUnitType() == LexicalUnit.SAC_PERCENTAGE ?
        (int)Math.round(Math.min(lu.getFloatValue() * 255.0 / 100.0, 255.0)) :
        lu.getIntegerValue();
      lu = lu.getNextLexicalUnit().getNextLexicalUnit(); // skip comma
      int bb = lu.getLexicalUnitType() == LexicalUnit.SAC_PERCENTAGE ?
        (int)Math.round(Math.min(lu.getFloatValue() * 255.0 / 100.0, 255.0)) :
        lu.getIntegerValue();

      return "0x"
        + (rr < 16 ? "0" : "") + Integer.toHexString(rr).toUpperCase()
        + (gg < 16 ? "0" : "") + Integer.toHexString(gg).toUpperCase()
        + (bb < 16 ? "0" : "") + Integer.toHexString(bb).toUpperCase();
    }

    /**
      * Convert LexicalUnit to a Javascript value (represented
      * as a String).
      */
     String luToString(LexicalUnit lu) {
         String str = "";
         switch (lu.getLexicalUnitType()) {

         case LexicalUnit.SAC_ATTR:
             str = "new LzStyleAttr('" + processEscapes(lu.getStringValue()) + "')";
           break;

         // Look up value later based on the type of the attribute it's applied to
         case LexicalUnit.SAC_IDENT:
           str = "new LzStyleIdent('" + processEscapes(lu.getStringValue()) + "')";
           break;

         case LexicalUnit.SAC_STRING_VALUE:
             str = "\"" + processEscapes(lu.getStringValue()) + "\"";
           break;

         case LexicalUnit.SAC_URI:
           // url needs to be defined when this is evaluated
           str = "url(\"" + lu.getStringValue() + "\")";
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
         case LexicalUnit.SAC_PICA:
         case LexicalUnit.SAC_PIXEL:
         case LexicalUnit.SAC_POINT:
         case LexicalUnit.SAC_RADIAN:
         case LexicalUnit.SAC_SECOND:
             // Dimensioned values are stored as strings for now, but
             // perhaps they should be converted to
             // length/frequency/angle in the appropriate base unit?
           float val = lu.getFloatValue();
           str = "\"" + (val == 0 ? "0" : Float.toString(val)) +
             lu.getDimensionUnitText() + "\"";
           break;

         case LexicalUnit.SAC_PERCENTAGE:
             str = Float.toString(lu.getFloatValue() / 100);
             break;

         case LexicalUnit.SAC_REAL:
             str = Float.toString(lu.getFloatValue());
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

         // Can we support these as functions?
         case LexicalUnit.SAC_COUNTER_FUNCTION:
             throwCSSException("SAC_COUNTER_FUNCTION unsupported");
         case LexicalUnit.SAC_COUNTERS_FUNCTION:
             throwCSSException("SAC_COUNTERS_FUNCTION unsupported");
         case LexicalUnit.SAC_RECT_FUNCTION:
         case LexicalUnit.SAC_FUNCTION:
           // Function needs to be defined when this is evaluated
           str = lu.getFunctionName() + "(" + luToString(lu.getParameters()) + ")";
           break;
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


    public void warning(CSSParseException e) throws CSSException {
        mLogger.error("warning ", e);
        throw e;
    }

    public void error(CSSParseException e) throws CSSException {
        mLogger.error("error ", e);
        throw e;
    }

    public void fatalError(CSSParseException e) throws CSSException {
        mLogger.error("fatal error while parsing css", e);
        throw e;
    }
}
