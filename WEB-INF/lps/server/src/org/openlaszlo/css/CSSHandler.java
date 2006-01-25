/* *****************************************************************************
 * CSSHandler.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
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
     * Entry point to creating a CSSHandler.
     * @param rootDir the directory where cssFile exists.
     * @param cssFile the css file to read. 
     */
    public static CSSHandler getHandler(String rootDir, String cssFile)
        throws CSSException {
        try {
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

    //==========================================================================
    // instance
    //==========================================================================

    /** The directory where the main CSS file exists */
    String mRootDir;

    /** The CSS file to parse. */
    String mCSSFile;

    /** List of Rule instances. */
    List mRuleList;

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

    /**
     * Preprocess elements with CSS values.
     * @param element element to apply style to.
     */
    public void preprocessCSS(Element element) {
        Map stylePropertyMap = null;
        for (int i=0; i < mRuleList.size(); i++) {
            Rule rule = (Rule)mRuleList.get(i);
            if ( match(rule, element) ) {
                if (stylePropertyMap == null) {
                    stylePropertyMap = new HashMap();
                }
                buildStyleProperties(stylePropertyMap, rule);
            }
        }

        // Apply style to element, if any styles matched.
        if (stylePropertyMap != null) {
            Iterator iter = stylePropertyMap.entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry)iter.next();
                String name = (String)entry.getKey();
                String value = ((StyleProperty)entry.getValue()).value;
                element.setAttribute(name, value);
            }
        }
    }

    /**
     * Build a single style based on precedence of rules that can immediately be
     * applied to an element.
     * @param stylePropertyMap style property map.
     * @param rule CSS rule containing styles to add to stylePropertyMap.
     */
    void buildStyleProperties(Map stylePropertyMap, Rule rule) {
        Map ruleStyleMap = rule.getStyleMap();
        Specificity ruleSpecificity = rule.getSpecificity();

        Iterator iter = ruleStyleMap.entrySet().iterator();
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry)iter.next();
            String name = (String)entry.getKey();
            StyleProperty newProp = (StyleProperty)entry.getValue();

            StyleProperty origProp = (StyleProperty)stylePropertyMap.get(name);
            if (origProp == null) {
                newProp.specificity = ruleSpecificity;
                stylePropertyMap.put(name, newProp);

            } else if (newProp.important) {
                origProp.specificity = ruleSpecificity;
                origProp.value = newProp.value;

            } else if ( ! origProp.important && 
                        origProp.specificity.compare(ruleSpecificity) <= 0 ) {
                origProp.specificity = ruleSpecificity;
                origProp.value = newProp.value;
            }
        }
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

    /** @return true if rule matches element */
    boolean match(Rule rule, Element element) {
        // reset specificity
        rule.getSpecificity().reset();
        return match(rule.getSelector(), rule.getSpecificity(), element);
    }

    /** 
     * @param selector the CSS selector to match element.
     * @param specificity the specificity of the selector. This value is only
     * accurate if match returns true.
     * @param element element to match with a CSS selector.
     * @return true if selector matches element
     */
    boolean match(Selector selector, Specificity specificity, Element element) 
        throws CSSException {

        switch (selector.getSelectorType()) {

        case Selector.SAC_ELEMENT_NODE_SELECTOR: {
            // TODO [2005-10-25 pkang]: match namespace
            ElementSelector es = (ElementSelector)selector;
            String name = es.getLocalName();
            boolean isok = (name == null || name.equals(element.getName()));
            // don't increment for nay node match.
            if (isok && name != null && ! name.equals("*")) specificity.incElement();
            return isok;
        }

        case Selector.SAC_CONDITIONAL_SELECTOR: {
            ConditionalSelector cs = (ConditionalSelector)selector;
            if ( ! match(cs.getSimpleSelector(), specificity, element) ) return false;
            return matchCondition(cs.getCondition(), specificity, element);
        }

        case Selector.SAC_ANY_NODE_SELECTOR: /* * */ {
            return true;
        }

        case Selector.SAC_CHILD_SELECTOR: /* E > F */ {
            // element must be a child and not just a descendant
            DescendantSelector ds = (DescendantSelector)selector;
            if ( ! match(ds.getSimpleSelector(), specificity, element) ) return false;
            return match(ds.getAncestorSelector(), specificity, element.getParentElement());
        }

        case Selector.SAC_DESCENDANT_SELECTOR: /* E F */ {
            // element must be a descendant.
            DescendantSelector ds = (DescendantSelector)selector;
            if ( ! match(ds.getSimpleSelector(), specificity, element) ) return false;
            Element ancestor = element;
            while (( ancestor = ancestor.getParentElement()) != null) {
                if ( match(ds.getAncestorSelector(), specificity, ancestor) ) return true;
            }
            return false;
        }

        case Selector.SAC_DIRECT_ADJACENT_SELECTOR: /* E + F */ {
            // if (E + F), E must directly precede F as a sibling.
            SiblingSelector ss = (SiblingSelector)selector;

            if ( ! match(ss.getSiblingSelector(), specificity, element) ) return false;

            Element parent = element.getParentElement();
            if (parent == null) return false;

            Element prevElement = null;
            List children = parent.getChildren();
            for (int i=1; i < children.size(); i++) {
                if (children.get(i) == element) {
                    prevElement = (Element)children.get(i-1);
                    break;
                }
            }
            return prevElement != null && 
                match(ss.getSelector(), specificity, prevElement);
        }

        case Selector.SAC_CDATA_SECTION_NODE_SELECTOR:
            throwCSSException("SAC_CDATA_SECTION_NODE_SELECTOR unsupported");
        case Selector.SAC_COMMENT_NODE_SELECTOR:
            throwCSSException("SAC_COMMENT_NODE_SELECTOR unsupported");
        case Selector.SAC_NEGATIVE_SELECTOR:
            throwCSSException("SAC_NEGATIVE_SELECTOR unsupported");
        case Selector.SAC_PROCESSING_INSTRUCTION_NODE_SELECTOR:
            throwCSSException("SAC_PROCESSING_INSTRUCTION_NODE_SELECTOR unsupported");
        case Selector.SAC_PSEUDO_ELEMENT_SELECTOR:
            throwCSSException("SAC_PSEUDO_ELEMENT_SELECTOR unsupported");
        case Selector.SAC_ROOT_NODE_SELECTOR:
            throwCSSException("SAC_ROOT_NODE_SELECTOR unsupported");
        case Selector.SAC_TEXT_NODE_SELECTOR:
            throwCSSException("SAC_TEXT_NODE_SELECTOR unsupported");
        }

        throwCSSException("unsupported selector: " + 
                          selector.getSelectorType());
        return false;
    }

    /** 
     * @return true if condition matches.
     */
    boolean matchCondition(Condition condition, Specificity specificity, Element element) 
        throws CSSException {

        switch (condition.getConditionType()) {

        case Condition.SAC_ID_CONDITION: /* #id */ {
            AttributeCondition idCond = (AttributeCondition)condition;
            String id = element.getAttributeValue("id");
            boolean isok = (id != null && id.equals(idCond.getValue()));
            if (isok) specificity.incID();
            return isok;
        }

        case Condition.SAC_CLASS_CONDITION: /* .class */ {
            AttributeCondition classCond = (AttributeCondition)condition;
            String _class = element.getAttributeValue("class");
            boolean isok = (_class != null && _class.equals(classCond.getValue()));
            if (isok) specificity.incAttribute();
            return isok;
        }

        case Condition.SAC_AND_CONDITION: /* .part1:lang(fr) */ {
            CombinatorCondition combCond = (CombinatorCondition)condition;
            return matchCondition(combCond.getFirstCondition(), specificity, element) &&
                matchCondition(combCond.getSecondCondition(), specificity, element);
        }

        case Condition.SAC_ATTRIBUTE_CONDITION: /* [attr] or [attr="val"] */ {
            AttributeCondition attrCond = (AttributeCondition)condition;
            String name  = attrCond.getLocalName();
            String value = attrCond.getValue();
            String elAttrVal = element.getAttributeValue(name);

            boolean isok;
            if (value == null) {
                // check the [attr] set case
                isok = (elAttrVal != null);
            } else {
                // check the [attr="val"] case
                isok = value.equals(elAttrVal);
            }
            if (isok) specificity.incAttribute();
            return isok;
        }


        case Condition.SAC_ONE_OF_ATTRIBUTE_CONDITION: /* [attr~="val"] */ {
            AttributeCondition attrCond = (AttributeCondition)condition;
            String name  = attrCond.getLocalName();
            String value = attrCond.getValue();
            String elAttrVal = element.getAttributeValue(name);

            boolean isok = false;
            if (elAttrVal != null) {
                String[] tok = elAttrVal.split("\\s");
                for (int i=0; i < tok.length; i++) {
                    if (value.equals(tok[i])) {
                        specificity.incAttribute();
                        isok = true;
                        break;
                    }
                }
            }
            return isok;
        }

        case Condition.SAC_BEGIN_HYPHEN_ATTRIBUTE_CONDITION: /*[attr|="val"]*/ {
            //--------------------------------------------------------------
            // Match when the element's "att" attribute value is a
            // hyphen-separated list of "words", beginning with "val". The
            // match always starts at the beginning of the attribute
            // value. This is primarily intended to allow language subcode
            // matches (e.g., the "lang" attribute in HTML) as described in
            // RFC 1766.
            //--------------------------------------------------------------
            AttributeCondition attrCond = (AttributeCondition)condition;
            String name  = attrCond.getLocalName();
            String value = attrCond.getValue();
            String elAttrVal = element.getAttributeValue(name);

            boolean isok = false;
            if (elAttrVal != null) {
                int index = elAttrVal.indexOf("-");
                if (index != -1) {
                    isok = value.equals(elAttrVal.substring(0, index));
                    if (isok) specificity.incAttribute();
                }
            }
            return isok;
        }

        case Condition.SAC_OR_CONDITION:
            throwCSSException("SAC_OR_CONDITION unsupported");
        case Condition.SAC_NEGATIVE_CONDITION:
            throwCSSException("SAC_NEGATIVE_CONDITION unsupported");
        case Condition.SAC_POSITIONAL_CONDITION:
            throwCSSException("SAC_POSITIONAL_CONDITION unsupported");
        case Condition.SAC_LANG_CONDITION: /* :lang(fr */
            throwCSSException("SAC_LANG_CONDITION unsupported");
        case Condition.SAC_PSEUDO_CLASS_CONDITION: /* like foo:first-child */
            throwCSSException("SAC_PSEUDO_CLASS_CONDITION unsupported");
        case Condition.SAC_ONLY_CHILD_CONDITION:
            throwCSSException("SAC_ONLY_CHILD_CONDITION unsupported");
        case Condition.SAC_ONLY_TYPE_CONDITION:
            throwCSSException("SAC_ONLY_TYPE_CONDITION unsupported");
        case Condition.SAC_CONTENT_CONDITION:
            throwCSSException("SAC_CONTENT_CONDITION unsupported");
        }

        throwCSSException("unsupported condition: " +
                          condition.getConditionType());
        return false;
    }

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

    /**
     * Specificity class.
     */
    class Specificity {
        final static int SPECIFICITY_ID        = 0;
        final static int SPECIFICITY_ATTRIBUTE = 1;
        final static int SPECIFICITY_ELEMENT   = 2;

        int[] mSpecificity = { 0, 0, 0 };

        public void incID() {
            ++mSpecificity[SPECIFICITY_ID];
        }
        public void incAttribute() { 
            ++mSpecificity[SPECIFICITY_ATTRIBUTE]; 
        }
        public void incElement() {
            ++mSpecificity[SPECIFICITY_ELEMENT];
        }
        public void reset() {
            mSpecificity[SPECIFICITY_ID] = 0;
            mSpecificity[SPECIFICITY_ATTRIBUTE] = 0;
            mSpecificity[SPECIFICITY_ELEMENT] = 0;
        }


        /**
         * @return 0 if this is equal, -1 if this is less, +1 if this is
         * greater.
         */
        int compare(Specificity specificity) {
            int diff;

            diff = this.mSpecificity[SPECIFICITY_ID] 
                - specificity.mSpecificity[SPECIFICITY_ID];
            if (diff != 0) return diff < 0 ? -1 : +1;

            diff = this.mSpecificity[SPECIFICITY_ATTRIBUTE] 
                - specificity.mSpecificity[SPECIFICITY_ATTRIBUTE];
            if (diff != 0) return diff < 0 ? -1 : +1;

            diff = this.mSpecificity[SPECIFICITY_ELEMENT] 
                - specificity.mSpecificity[SPECIFICITY_ELEMENT];
            if (diff != 0) return diff < 0 ? -1 : +1;

            return 0;
        }
    }

    /**
     * Rule class.
     */
    class Rule {
        public Rule(Selector selector, Map styleMap) {
            this.mSelector = selector;
            this.mStyleMap = styleMap;
            // specificity for rule is set when match() is called.
            this.mSpecificity = new Specificity();
        }

        Selector    mSelector;
        Map         mStyleMap;
        Specificity mSpecificity;

        public Selector    getSelector()    { return mSelector; }
        public Map         getStyleMap()    { return mStyleMap; }
        public Specificity getSpecificity() { return mSpecificity; }

        /**
         * @return 0 if this is equal, -1 if this is less, +1 if this is
         * greater.
         */
        int compare(Rule rule) {
            return this.mSpecificity.compare(rule.mSpecificity);
        }


    }

    /**
     * StyleProperty class.
     */
    class StyleProperty {
        public StyleProperty(String value, boolean important) {
            this.value = value;
            this.important = important;
        }
        public String value;
        public boolean important;
        public Specificity specificity = null;
    }
}
