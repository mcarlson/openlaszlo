/* *****************************************************************************
 * StyleSheetCompiler.java
* ****************************************************************************/

/*
TODO: [2006-09-21 ben] (LPP-2733) Make apps recompile if external css file changes
*/ 

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import org.openlaszlo.css.*;
import org.openlaszlo.utils.FileUtils;
import org.w3c.css.sac.*;
import java.io.File;
import java.io.IOException;
import java.util.*;
import org.jdom.Element;
import org.apache.log4j.*;

/** Compiler for <code>stylesheet</code> elements.
 *
 * @author  Benjamin Shine
 */
class StyleSheetCompiler extends ElementCompiler {
    /** Logger */
    private static Logger mLogger = Logger.getLogger(CanvasCompiler.class);

    private static final String SRC_ATTR_NAME = "src";

    StyleSheetCompiler(CompilationEnvironment env) {
        super(env);
    }

    /** Returns true iff this class applies to this element.
     * @param element an element
     * @return see doc
     */
    static boolean isElement(Element element) {
        return element.getName().intern() == "stylesheet";
    }

    public void compile(Element element) {
        try {
            Logger log =  Logger.getLogger(StyleSheetCompiler.class);
            mLogger.info("StyleSheetCompiler.compile called!");
                    
            if (!element.getChildren().isEmpty()) {
                throw new CompilationError("<stylesheet> elements can't have children",
                                           element);
            }
            
            String pathname = null;
            String stylesheetText = element.getText(); 
            String src = element.getAttributeValue(SRC_ATTR_NAME); 
            
            
            if (src != null) {
                mLogger.info("reading in stylesheet from src=" + src); 
                // Resolve the file reference 
                // Read in the stylesheet from the file 
                
                String parentPath = mEnv.getApplicationFile().getParent();
                if ( parentPath == null || "".equals(parentPath) ) {
                    parentPath = ".";
                }

                // CSS file is relative to directory of LZX file. 
                String cssFullPath = parentPath + File.separatorChar + src;
                mLogger.info("CSS file's full path is " + cssFullPath);
                
                // Check whether css file exists
                File cssf = new File(cssFullPath);
                if (!cssf.exists()) {
                    throw new CompilationError("Could not find css file " + src);
                }
                
                CSSHandler fileHandler = CSSHandler.parse( parentPath, src );
                this.compile(fileHandler); 
            } else if (stylesheetText != null && (!"".equals(stylesheetText))) {
                mLogger.info("inline stylesheet");
                CSSHandler inlineHandler = CSSHandler.parse(stylesheetText); 
                this.compile(inlineHandler); 
                // 
            } else {
                // TODO: i18n errors
                throw new CompilationError("<stylesheet> element must have either src attribute or inline text. This has neither.",
                    element); 
            }
    
        // Compile stylesheets to run at construction time in the view
        } catch (CompilationError e) {
            Logger.getLogger(StyleSheetCompiler.class)
                .error("Error compiling StyleSheet element: " + element); 
            throw e;
        }
    }
    
    public void compile(CSSHandler handler) throws CompilationError {
        Logger.getLogger(StyleSheetCompiler.class).debug("compiling CSSHandler using new unique names"); 
        String script = "";
        for (int i=0; i < handler.mRuleList.size(); i++) {  
            Rule rule = (Rule)handler.mRuleList.get(i);
            // TODO: move this out out global scope [bshine 9.17.06]
            String curRuleName = "__cssRule" + mEnv.uniqueName();
            script += "var " + curRuleName + " = new LzCSSStyleRule(); \n";

            String curRuleSelector = buildSelector(rule.getSelector());
            script += curRuleName + ".selector = " + curRuleSelector + ";\n";
            String curRuleProperties = buildPropertiesJavascript(rule);         
            script += curRuleName + ".properties = " + curRuleProperties + ";\n";
            script += " LzCSSStyle._addRule( " + curRuleName + " ); \n"; 
            Logger.getLogger(StyleSheetCompiler.class).debug("created rule " + curRuleName); 
        }
        Logger.getLogger(StyleSheetCompiler.class).debug("whole stylesheet as css " + script +"\n\n"); 
        mEnv.compileScript( "(function() { " + script + "})()" ); 
    }


    String buildSelector(Selector sel) {
        String selectorString = "\"selector_not_handled\"";

        switch (sel.getSelectorType()) {
            case Selector.SAC_ELEMENT_NODE_SELECTOR: 
                //  This selector matches only tag type
                ElementSelector es = (ElementSelector)sel;
                selectorString = buildElementSelectorJS(es.getLocalName());
                break;
            case Selector.SAC_CONDITIONAL_SELECTOR:
                // This selector matches all the interesting things:
                // #myId
                // [someattr="someval"]
                // simple[role="private"]
                ConditionalSelector cs = (ConditionalSelector)sel;
                // Take care of the simple selector part of this                
                selectorString = buildConditionalSelectorJS(cs.getCondition(),cs.getSimpleSelector());                
                break;
            case Selector.SAC_DESCENDANT_SELECTOR:
                DescendantSelector ds = (DescendantSelector)sel;
                selectorString = buildDescendantSelector(ds);
                break;
            default:
                selectorString = "unknown_selector" + Integer.toString(sel.getSelectorType());
        } 

        return selectorString;
    }

    String buildElementSelectorJS(String localName) {
        return "\"" + localName + "\"";   
    }

    String buildConditionalSelectorJS(Condition cond, SimpleSelector simpleSelector) {
        mLogger.debug("Conditional selector: " + cond.toString());
        String condString = "no_match";        
        switch (cond.getConditionType()) {
            case Condition.SAC_ID_CONDITION: /* #id */
                AttributeCondition idCond = (AttributeCondition) cond;
                condString = "\"#" + idCond.getValue() + "\""; // should be the id specified
                break;

             case Condition.SAC_ATTRIBUTE_CONDITION: // [attr] or [attr="val"] or elem[attr="val"]
                mLogger.debug("Attribute condition");
                AttributeCondition attrCond = (AttributeCondition) cond;
                String name  = attrCond.getLocalName();
                String value = attrCond.getValue();
                condString = "{ attrname: \"" + name + "\", attrvalue: \"" + value + "\"";
                // The simple selector is the element part of the selector, ie, 
                // foo in foo[bar="baz"]. If there is no element part of the selector, ie
                // [bar="lum"] then batik gives us a non-null SimpleSelector with a 
                // localName of the null string. We don't write out the simple selector if 
                // it's not specified. 
                if (simpleSelector != null) {
                    mLogger.debug("simple selector:" + simpleSelector.toString());
                    if (simpleSelector.getSelectorType() == Selector.SAC_ELEMENT_NODE_SELECTOR) {

                        ElementSelector es = (ElementSelector)simpleSelector;                                        
                        String simpleSelectorString = es.getLocalName();
                        // Discard the simple selector if it isn't specified
                        if (simpleSelectorString != null) 
                            condString += ", simpleselector: \"" + simpleSelectorString + "\""; 
                    } else {
                        mLogger.error("Can't handle CSS selector " + simpleSelector.toString());
                    }
                } 
                
                condString += "}";
                mLogger.debug("Cond string: " + condString ); 
                break;
            default:
        }
        return condString;
    }

    /** 
     * Build a string holding the javascript to create the selector at runtime, where
       the selector is a descendant selector, ie 
       E F
       would be
       descendantrule.selector =  [
           "E", 
           "F" ];
       The selector is specified as an array of selectors, ancestor first. 
      */
    String buildDescendantSelector(DescendantSelector ds) {
        // We need the simple selector and the ancestor selector
        SimpleSelector ss = ds.getSimpleSelector();
        Selector ancestorsel = ds.getAncestorSelector();
        String str = "[";
        
        // If this is complicated, it will be [ "something", "complicated" ]
        // Strip excessive square brackets. This lets us pretend to unroll
        // recursive selectors into a list of selectors. 
        // This is a cheap way to get deep selectors.
        String ancestorselstr = buildSelector(ancestorsel);
        ancestorselstr = ancestorselstr.replace('[', ' ');
        ancestorselstr = ancestorselstr.replace(']', ' ');        
        str += ancestorselstr; 
        str += ", ";
        str += buildSelector(ss);
        
        str += "]";
        // mLogger.error("Here's the whole descendant selector:" + str);
        return str;
    }

    /**
      * Build a string holding the javascript to create the rule's properties attribute. 
      * This should just be a standard javascript object composed of attributes and values,
      * wrapped in curly quotes. Escape the quotes for attributes' values.
      * for example "{ width: 500, occupation: \"pet groomer and holistic veterinarian\",
                       miscdata: \"spends most days indoors\"}"" 
      */                       
      
    String buildPropertiesJavascript(Rule rule) {
        /*
        String props = "{ width: 500, occupation: \"pet groomer and holistic veterinarian\"," + 
                        " miscdata: \"spends most days indoors\"} ";
                        */ 
        
        String props = "{";
        Map ruleStyleMap = rule.getStyleMap();
        boolean insertComma = false;     
        Iterator iter = ruleStyleMap.entrySet().iterator();
          while (iter.hasNext()) {
              // don't put a comma before the first property. that would be illegal javascript.
              if (!insertComma) { 
                  insertComma = true; 
              } else {
                  props += ", ";
              }
              Map.Entry entry = (Map.Entry)iter.next();
              String name = (String)entry.getKey();
              StyleProperty newProp = (StyleProperty)entry.getValue();
              props += name + ": "+ "\"" + newProp.value + "\"";

          }        
        props += "}";  
        
        return props; 
    }    
}






