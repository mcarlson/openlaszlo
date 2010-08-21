/* *****************************************************************************
* StyleSheetCompiler.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import org.openlaszlo.css.*;
import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.utils.FileUtils;
import org.w3c.css.sac.*;
import java.io.*;
import java.util.*;
import java.util.regex.*;
import java.text.MessageFormat;

import org.jdom.Element;
import org.apache.log4j.*;

/** Compiler for <code>stylesheet</code> elements.
 *
 * @author  Benjamin Shine
 */
class StyleSheetCompiler extends LibraryCompiler {
    /** Logger */
    private static Logger mLogger = Logger.getLogger(StyleSheetCompiler.class);

    private static final String SRC_ATTR_NAME = "src";
    private static final String CHARSET_ATTR_NAME = "charset";

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
            if (mLogger.isInfoEnabled()) {
            mLogger.info("StyleSheetCompiler.compile called!");
            }

            if (!element.getChildren().isEmpty()) {
                throw new CompilationError("<stylesheet> elements can't have children",
                                           element);
            }

            String pathname = null;
            String stylesheetText = element.getText();
            String src = element.getAttributeValue(SRC_ATTR_NAME);
            String encoding = element.getAttributeValue(CHARSET_ATTR_NAME);
            if (encoding != null) {
                if (mLogger.isDebugEnabled()) {
                mLogger.info("@charset=" + encoding + " found on stylesheet tag");
                }
            } else {
                if (mLogger.isDebugEnabled()) {
                mLogger.info("no attribute @charset found on stylesheet tag, using default value " + encoding);
                }
           }

            if (src != null) {
                if (mLogger.isInfoEnabled()) {
                mLogger.info("reading in stylesheet from src=\"" + src + "\"");
                }
                // Find the css file
                // Using the FileResolver accomplishes two nice things:
                // 1, it searches the standard directory include paths
                // including the application directory for the css file.
                // 2, it adds the css file to the dependencies for the
                // current application. This makes the application be
                // recompiled if the css file changes.
                // This fixes LPP-2733 [bshine 10.20.06]

                String base =  mEnv.getApplicationFile().getParent();

                // [bshine 12.29.06] For LPP-2974, we also have to
                // check for the css file relative to the file which is including it.
                // First try to find the css file as a sibling of this source file
                String sourceDir = new File(Parser.getSourcePathname(element)).getParent();
                File resolvedFile = mEnv.resolve(src, sourceDir);

                // If our first try at finding the css file doesn't find it as a sibling,
                // try to resolve relative to the application source file.
                if (! resolvedFile.exists() ) {
                    resolvedFile = mEnv.resolve(src, base);
                    if (resolvedFile.exists()) {
                        if (mLogger.isInfoEnabled()) {
                        mLogger.info("Resolved css file to a file that exists!");
                        }
                    } else {
                        mLogger.error("Could not resolve css file to a file that exists.");
                        throw new CompilationError("Could not find css file " + src);
                    }
                }

                // Actually parse and compile the stylesheet! W00t!
                CSSHandler fileHandler = CSSHandler.parse( resolvedFile, encoding );
                this.compile(fileHandler, element);


            } else if (stylesheetText != null && (!"".equals(stylesheetText))) {
                if (mLogger.isInfoEnabled()) {
                mLogger.info("inline stylesheet");
                }
                CSSHandler inlineHandler = CSSHandler.parse(stylesheetText);
                this.compile(inlineHandler, element);
                //
            } else {
                // TODO: i18n errors
                throw new CompilationError("<stylesheet> element must have either src attribute or inline text. This has neither.",
                    element);
            }

        } catch (CompilationError e) {
            // If there was an error compiling a stylesheet, we report
            // it as a compilation error, and fail the compile.
            // Fixes LPP-2734 [bshine 10.20.06]
            mLogger.error("Error compiling StyleSheet element: " + element);
            throw e;
        } catch (IOException e) {
            // This exception indicates there was a problem reading the
            // CSS from the file
            mLogger.error("IO error compiling StyleSheet: " + element);
            throw new CompilationError("IO error, can't find source file for <stylesheet> element.",
                 element);
        } catch (CSSParseException e) {
            // CSSParseExceptions provide a line number and URI,
            // as well as a helpful message
            // Fixes LPP-2734 [bshine 10.20.06]
            String message = "Error parsing css file at line " + e.getLineNumber()
                    + ", " + e.getMessage();

            mLogger.error(message);
            throw new CompilationError(message);
        } catch (CSSException e) {
            // CSSExceptions don't provide a line number, just a message
            // Fixes LPP-2734 [bshine 10.20.06]
            mLogger.error("Error compiling css: " + element);
            throw new CompilationError("Error compiling css, no line number available: "
                    + e.getMessage());
        } catch (Exception e) {
            // This catch clause will catch disastrous errors; normal expected
            // css-related errors are handled with the more specific catch clauses
            // above.

            /**
             * NOTE: [2008-10-14 ptw] If you are trying to debug CSS
             * style sheet errors, you propbably want to disable this
             * catch clause, because it will hide the real error from
             * you.
             */

            mLogger.error("Exception compiling css: " + element + ", " + e.getMessage());
            throw new CompilationError("Error compiling css. " + e.getMessage());
        }

    }

    void compile(CSSHandler handler, Element element) throws CompilationError {
        if (mLogger.isDebugEnabled()) {
        mLogger.debug("compiling CSSHandler using new unique names");
        }
        String script = "";
        for (int i=0; i < handler.mRuleList.size(); i++) {
            Rule rule = (Rule)handler.mRuleList.get(i);
            script += "$lzc$style._addRule(new $lzc$rule(" +
              buildSelector(rule.getSelector()) + ", " +
              buildPropertiesJavascript(rule, element, mEnv);
            if (mEnv.getBooleanProperty(mEnv.DEBUG_PROPERTY)) {
              script += ", " +
                ScriptCompiler.quote(Parser.getSourceMessagePathname(element)) + ", " +
                i;
            }
            script +=
              "));\n";
        }
        if (mLogger.isDebugEnabled()) {
        mLogger.debug("whole stylesheet as css " + script +"\n\n");
        }
        mEnv.compileScript(CompilerUtils.sourceLocationDirective(element, true) +
                           // NOTE [2007-06-02 bshine] This semicolon is needed
                           // to work around bug LPP-4083, javascript compiler
                           // doesn't emit a semicolon somewhere
                           ";" +
                           // NOTE: [2007-02-11 ptw] It is crucial
                           // that this be terminated with a `;` so
                           // that it is a statement, not an
                           // expression.
                           " (function() { var $lzc$style = LzCSSStyle, $lzc$rule = LzCSSStyleRule;\n" + script + "})();", element );
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
      if (localName != null) {
        return "\"" + localName + "\"";
      } else {
        return "\"*\"";
      }
    }

    String buildConditionalSelectorJS(Condition cond, SimpleSelector simpleSelector) {
        if (mLogger.isDebugEnabled()) {
        mLogger.debug("Conditional selector: " + cond.toString());
        }
        String condString = "no_match";
        switch (cond.getConditionType()) {
            case Condition.SAC_ID_CONDITION: /* #id */
                AttributeCondition idCond = (AttributeCondition) cond;
                condString = "\"#" + idCond.getValue() + "\""; // should be the id specified
                break;

             case Condition.SAC_ATTRIBUTE_CONDITION: // [attr] or [attr="val"] or elem[attr="val"]
                 if (mLogger.isDebugEnabled()) {
                mLogger.debug("Attribute condition");
                 }
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
                    if (mLogger.isDebugEnabled()) {
                    mLogger.debug("simple selector:" + simpleSelector.toString());
                    }
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
                if (mLogger.isDebugEnabled()) {
                mLogger.debug("Cond string: " + condString );
                }
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


  Pattern resourcePattern = Pattern.compile("^\\s*resource\\s*\\(\\s*['\"]\\s*(.*)\\s*['\"]\\s*\\)\\s*$");
    /**
      * Build a string holding the javascript to create the rule's properties attribute.
      * This should just be a standard javascript object composed of attributes and values,
      * wrapped in curly quotes. Escape the quotes for attributes' values.
      * for example "{ width: 500, occupation: \"pet groomer and holistic veterinarian\",
                       miscdata: \"spends most days indoors\"}""
      */
  String buildPropertiesJavascript(Rule rule, Element element, CompilationEnvironment env) {
        /*
        String props = "{ width: 500, occupation: \"pet groomer and holistic veterinarian\"," +
                        " miscdata: \"spends most days indoors\"} ";
                        */

      StringWriter result = new StringWriter();
      try {
        Map properties = rule.getStyleMap();
        // Special handling for `resource` function: The argument is
        // compiled as a resource `src` (pathname) and given a unique
        // name, which replaces the function
        for (Iterator i = properties.entrySet().iterator(); i.hasNext(); ) {
          Map.Entry entry = (Map.Entry)i.next();
          String key = (String)entry.getKey();
          StyleProperty property = ((StyleProperty)entry.getValue());
          Matcher m = resourcePattern.matcher(property.value);
          if (m.matches()) {
            String path = m.group(1);
            String base = new File(Parser.getSourcePathname(element)).getParent();
            File file = env.resolve(path, base);
            // N.B.: Resources are always imported into the main
            // program for the Flash target, hence the use of
            // getResourceGenerator below
            try {
              String value = env.getResourceGenerator().importResource(file);
              // Resources are passed by name
              property.value = ScriptCompiler.quote(value);
            } catch (ObjectWriter.ImportResourceError e) {
              env.warn(e, element);
            }
          }
        }
        ScriptCompiler.writeObject(properties, result);
      } catch (IOException e) {
        throw new CompilationError(element, e);
      }
      return result.toString();
    }
}






