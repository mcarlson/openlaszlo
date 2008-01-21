/* -*- mode: Java; c-basic-offset: 4; -*- */
/* ***************************************************************************
 * NodeModel.java
 * ***************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;

import java.io.*;
import java.text.ChoiceFormat;
import java.util.*;
import java.util.regex.*;


import org.openlaszlo.compiler.ViewSchema.ColorFormatException;
import org.openlaszlo.css.CSSParser;
import org.openlaszlo.sc.Function;
import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.server.*;
import org.openlaszlo.utils.ChainedException;
import org.openlaszlo.utils.ListFormat;
import org.openlaszlo.utils.ComparisonMap;
import org.openlaszlo.xml.internal.MissingAttributeException;
import org.openlaszlo.xml.internal.Schema;
import org.openlaszlo.xml.internal.XMLUtils;
import org.apache.commons.collections.CollectionUtils;
import org.jdom.Attribute;
import org.jdom.Element;
import org.jdom.Text;
import org.jdom.Content;
import org.jdom.Namespace;

/** Models a runtime LzNode. */
public class NodeModel implements Cloneable {

    public static final String FONTSTYLE_ATTRIBUTE = "fontstyle";
    public static final String WHEN_IMMEDIATELY = "immediately";
    public static final String WHEN_ONCE = "once";
    public static final String WHEN_ALWAYS = "always";
    public static final String WHEN_PATH = "path";
    public static final String WHEN_STYLE = "style";
    private static final String SOURCE_LOCATION_ATTRIBUTE_NAME = "__LZsourceLocation";

    protected final ViewSchema schema;
    protected final Element element;
    protected String className;
    protected String id = null;
    protected ComparisonMap attrs = new ComparisonMap();
    protected List children = new Vector();
    /** A set {eventName: String -> True) of names of event handlers
     * declared with <method event="xxx"/>. */
    protected ComparisonMap delegates = new ComparisonMap();
    /* Unused */
    protected ComparisonMap events = new ComparisonMap();
    protected ComparisonMap references = new ComparisonMap();
    /* Unused */
    protected ComparisonMap paths = new ComparisonMap();
    protected ComparisonMap setters = new ComparisonMap();
    protected ComparisonMap styles = new ComparisonMap();

    protected NodeModel     datapath = null;

    /** [eventName: String, methodName: String, Function] */
    protected List delegateList = new Vector();
    protected ClassModel parentClassModel;
    protected String initstage = null;
    protected int totalSubnodes = 1;
    protected final CompilationEnvironment env;

    public Object clone() {
        NodeModel copy;
        try {
            copy = (NodeModel) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
        copy.attrs = new ComparisonMap(copy.attrs);
        copy.delegates = new ComparisonMap(copy.delegates);
        copy.events = new ComparisonMap(copy.events);
        copy.references = new ComparisonMap(copy.references);
        copy.paths = new ComparisonMap(copy.paths);
        copy.setters = new ComparisonMap(copy.setters);
        copy.styles = new ComparisonMap(copy.styles);
        copy.delegateList = new Vector(copy.delegateList);
        copy.children = new Vector();
        for (Iterator iter = children.iterator(); iter.hasNext(); ) {
            copy.children.add(((NodeModel) iter.next()).clone());
        }
        return copy;
    }

    private boolean caseSensitive = true;

    NodeModel(Element element, ViewSchema schema, CompilationEnvironment env) {
        this.element = element;
        this.schema = schema;
        this.env = env;

        if ("swf6".equals(env.getRuntime())) {
            this.caseSensitive = false;
        }
        this.className = element.getName();
        // Cache ClassModel for parent
        this.parentClassModel = this.getParentClassModel();
        this.initstage =
            this.element.getAttributeValue("initstage");
        if (this.initstage != null) {
            this.initstage = this.initstage.intern();
        }

        // Get initial node count from superclass
        // TODO: [2003-05-04] Extend this mechanism to cache/model
        // all relevant superclass info
        // TODO: [2003-05-04 ptw] How can we get this info for
        // instances of built-in classes?
        if (this.parentClassModel != null) {
            ElementWithLocationInfo parentElement =
                (ElementWithLocationInfo) this.parentClassModel.definition;
            // TODO: [2003-05-04 ptw] As above, but a class
            // that extends a built-in class
            if (parentElement != null) {
                // TODO: [2003-05-04 ptw] An instantiation of
                // a class that has not been modelled yet --
                // do enough modelling to get what is needed.
                if (parentElement.model != null) {
                    this.totalSubnodes =
                        parentElement.model.classSubnodes();
                    if (this.initstage == null) {
                        this.initstage =
                            parentElement.model.initstage;
                    }
                }
            }
        }
    }

    private static final String DEPRECATED_METHODS_PROPERTY_FILE = (
        LPS.getMiscDirectory() + File.separator + "lzx-deprecated-methods.properties"
        );
    private static final Properties sDeprecatedMethods = new Properties();

    static {
        try {
            InputStream is = new FileInputStream(DEPRECATED_METHODS_PROPERTY_FILE);
            try {
                sDeprecatedMethods.load(is);
            } finally {
                is.close();
            }
        } catch (java.io.IOException e) {
            throw new ChainedException(e);
        }
    }


    /* List of flash builtins to warn about if the user tries to redefine them */
    private static final String FLASH6_BUILTINS_PROPERTY_FILE = (
        LPS.getMiscDirectory() + File.separator + "flash6-builtins.properties"
        );


    private static final String FLASH7_BUILTINS_PROPERTY_FILE = (
        LPS.getMiscDirectory() + File.separator + "flash7-builtins.properties"
        );

    public static final Properties sFlash6Builtins = new Properties();
    public static final Properties sFlash7Builtins = new Properties();

    static {
        try {
            InputStream is6 = new FileInputStream(FLASH6_BUILTINS_PROPERTY_FILE);
            try {
                sFlash6Builtins.load(is6);
            } finally {
                is6.close();
            }

            InputStream is7 = new FileInputStream(FLASH7_BUILTINS_PROPERTY_FILE);
            try {
                sFlash7Builtins.load(is7);
            } finally {
                is7.close();
            }
        } catch (java.io.IOException e) {
            throw new ChainedException(e);
        }
    }

    static class CompiledAttribute {
        static final int ATTRIBUTE = 0;
        static final int EVENT = 1;
        static final int REFERENCE = 2;
        static final int PATH = 3;
        static final int STYLE = 4;

        final int type;
        final Object value;

        CompiledAttribute(int type, Object value) {
            this.type = type;
            this.value = value;
        }
        CompiledAttribute(Object value) {
            this(ATTRIBUTE, value);
        }
    }

    public String toString() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("{NodeModel class=" + className);
        if (!attrs.isEmpty())
            buffer.append(" attrs=" + attrs.keySet());
        if (!delegates.isEmpty())
            buffer.append(" delegates=" + delegates.keySet());
        if (!events.isEmpty())
            buffer.append(" events=" + events.keySet());
        if (!references.isEmpty())
            buffer.append(" references=" + references.keySet());
        if (!paths.isEmpty())
            buffer.append(" paths=" + paths.keySet());
        if (!setters.isEmpty())
            buffer.append(" setters=" + setters.keySet());
        if (!styles.isEmpty())
            buffer.append(" styles=" + styles.keySet());
        if (!delegateList.isEmpty())
            buffer.append(" delegateList=" + delegateList);
        if (!children.isEmpty())
            buffer.append(" children=" + children);
        buffer.append("}");
        return buffer.toString();
    }

    List getChildren() {
        return children;
    }

    public static boolean isPropertyElement(Element elt) {
        String name = elt.getName();
        return name.equals("attribute") || name.equals("method")
            || name.equals("handler")
            || name.equals("event");
    }

    /** Returns a name that is used to report this element in warning
     * messages. */
    String getMessageName() {
        return "element " + element.getName();
    }

    /**
     * Returns a script that creates a runtime representation of a
     * model.  The format of this representation is specified <a
     * href="../../../../doc/compiler/views.html">here</a>.
     *
     */
    public String asJavascript() {
        try {
            java.io.Writer writer = new java.io.StringWriter();
            ScriptCompiler.writeObject(this.asMap(), writer);
            return writer.toString();
        } catch (java.io.IOException e) {
            throw new ChainedException(e);
        }
    }

    /** Returns true iff clickable should default to true. */
    private static boolean computeDefaultClickable(ViewSchema schema,
                                                   Map attrs,
                                                   Map events,
                                                   Map delegates) {
        if ("true".equals(attrs.get("cursor"))) {
            return true;
        }
        for (Iterator iter = events.keySet().iterator(); iter.hasNext();) {
            String eventName = (String) iter.next();
            if (schema.isMouseEventAttribute(eventName)) {
                return true;
            }
        }
        for (Iterator iter = delegates.keySet().iterator(); iter.hasNext();) {
            String eventName = (String) iter.next();
            if (schema.isMouseEventAttribute(eventName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns a NodeModel that represents an Element, including the
     * element's children
     *
     * @param elt an element
     * @param schema a schema, used to encode attribute values
     * @param env the CompilationEnvironment
     */
    public static NodeModel elementAsModel(Element elt, ViewSchema schema,
                                           CompilationEnvironment env) {
        return elementAsModelInternal(elt, schema, true, env);
    }

    /**
     * Returns a NodeModel that represents an Element, excluding the
     * element's children
     *
     * @param elt an element
     * @param schema a schema, used to encode attribute values
     * @param env the CompilationEnvironment
     */
    public static NodeModel elementOnlyAsModel(Element elt, ViewSchema schema,
                                               CompilationEnvironment env) {
        return elementAsModelInternal(elt, schema, false, env);
    }

    /** Returns a NodeModel that represents an Element
     *
     * @param elt an element
     * @param schema a schema, used to encode attribute values
     * @param includeChildren whether or not to include children
     * @param env the CompilationEnvironment
     */
    private static NodeModel elementAsModelInternal(
        Element elt, ViewSchema schema, 
        boolean includeChildren, CompilationEnvironment env)
    {
        NodeModel model = new NodeModel(elt, schema, env);
        ComparisonMap attrs = model.attrs;
        Map events = model.events;
        Map delegates = model.delegates;
        model.addAttributes(env);

        // This emits a local dataset node, so only process
        // <dataset> tags that are not top level datasets.

        if (elt.getName().equals("dataset")) {
            boolean contentIsLiteralXMLData = true;
            String datafromchild = elt.getAttributeValue("datafromchild");
            String src = elt.getAttributeValue("src");
            String type = elt.getAttributeValue("type");

            if ((type != null && (type.equals("soap") || type.equals("http")))
                || (src != null && XMLUtils.isURL(src))
                || "true".equals(datafromchild)) {
                contentIsLiteralXMLData = false;
            }

            if (contentIsLiteralXMLData) {
                // Default to legacy behavior, treat all children as XML literal data.
                attrs.put("initialdata", getDatasetContent(elt, env));
                includeChildren = false;
            }
        }

        if (includeChildren) {
            model.addChildren(env);
            model.addText();
            if (!attrs.containsKey("clickable")
                && computeDefaultClickable(schema, attrs, events, delegates)) {
                attrs.put("clickable", "true");
            }
        }
        // Record the model in the element for classes
        ((ElementWithLocationInfo) elt).model = model;
        return model;
    }

    // Calculate how many nodes this object will put on the
    // instantiation queue.
    int totalSubnodes() {
        // A class does not instantiate its subnodes.
        // States override LzNode.thaw to delay subnodes.
        // FIXME [2004-06-3 ows]: This won't work for subclasses
        // of state.
        if (ClassCompiler.isElement(element) ||
            className.equals("state")) {
            return 1;
        }
        // initstage late, defer delay subnodes
        if (this.initstage != null &&
            (this.initstage == "late" ||
             this.initstage == "defer")) {
            return 0;
        }
        return this.totalSubnodes;
    }

    // How many nodes will be inherited from this class
    int classSubnodes() {
        if (ClassCompiler.isElement(element)) {
            return this.totalSubnodes;
        }
        return 0;
    }

    ClassModel getClassModel() {
        return schema.getClassModel(this.className);
    }

    /** Gets the ClassModel for this element's parent class.  If this
     * element is a <class> definition, the superclass; otherwise the
     * class of the tag of this element. */
    ClassModel getParentClassModel() {
        String parentName = this.className;
        return
            parentName.equals("class")?
            schema.getClassModel(element.getAttributeValue("extends")):
            schema.getClassModel(parentName);
    }

    void setClassName(String name) {
        this.className = name;
        this.parentClassModel = getParentClassModel();
    }

    ViewSchema.Type getAttributeTypeInfoFromParent(
        Element elt, String attrname)
        throws UnknownAttributeException
    {
        Element parent = elt.getParentElement();
        return schema.getAttributeType(parent, attrname);
    }

    // Should only be called on a <class> definition element.
    ViewSchema.Type getAttributeTypeInfoFromSuperclass(
        Element classDefElement, String attrname)
        throws UnknownAttributeException
    {
        String superclassname = classDefElement.getAttributeValue("extends", ClassCompiler.DEFAULT_SUPERCLASS_NAME);
        ClassModel superclassModel = schema.getClassModel(superclassname);

        if (superclassModel == null) {
            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Could not find superclass info for class " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-411", new Object[] {superclassname, classDefElement})
);
        }

        // Check if this attribute is defined on the parent class, if
        // so, return that type
        AttributeSpec attr = superclassModel.getAttribute(attrname);
        if (attr != null) {
            return attr.type;
        }
        // Otherwise, check if it's defined on the "class" element
        // (e.g., 'name' or 'extends')
        superclassModel = schema.getClassModel("class");
        return superclassModel.getAttributeTypeOrException(attrname);
    }

    // Get an attribute value, defaulting to the
    // inherited value, or ultimately the supplied default
    String getAttributeValueDefault(String attribute,
                                    String name,
                                    String defaultValue) {
        // Look for an inherited value
        if (this.parentClassModel != null) {
            AttributeSpec attrSpec =
                this.parentClassModel.getAttribute(attribute);
            if (attrSpec != null) {
                Element source = attrSpec.source;
                if (source != null) {
                    return XMLUtils.getAttributeValue(source, name, defaultValue);
                }
            }
        }

        return defaultValue;
    }

    /** Is this element a direct child of the canvas? */
    // FIXME [2004-06-03 ows]: Use CompilerUtils.isTopLevel instead.
    // This implementation misses children of <library> and <switch>.
    // Since it's only used for compiler warnings about duplicate
    // names this doesn't break program compilation.
    boolean topLevelDeclaration() {
        Element parent = element.getParentElement();
        if (parent == null) {
            return false;
        }
        return ("canvas".equals(parent.getName()));
    }

    void addAttributes(CompilationEnvironment env) {
        // Add source locators, if requested.  Added here because it
        // is not in the schema
        if (env.getBooleanProperty(env.SOURCELOCATOR_PROPERTY)) {
            String location = "document(" + 
                ScriptCompiler.quote(Parser.getSourceMessagePathname(element)) + 
                ")" +
                XMLUtils.getXPathTo(element);
            CompiledAttribute cattr = compileAttribute(
                element, SOURCE_LOCATION_ATTRIBUTE_NAME,
                location, ViewSchema.STRING_TYPE,
                WHEN_IMMEDIATELY);
            addAttribute(cattr, SOURCE_LOCATION_ATTRIBUTE_NAME, 
                         attrs, events, references, paths, styles);
        }

        // Add file/line information if debugging
        if (env.getBooleanProperty(env.DEBUG_PROPERTY)) {
          // File/line stored separately for string sharing
          String name = "_dbg_filename";
          String filename = Parser.getSourceMessagePathname(element);
          CompiledAttribute cattr =
            compileAttribute(element, name, filename, ViewSchema.STRING_TYPE, WHEN_IMMEDIATELY);
          addAttribute(cattr, name, attrs, events, references, paths, styles);
          name = "_dbg_lineno";
          Integer lineno = Parser.getSourceLocation(element, Parser.LINENO);
          cattr = compileAttribute(element, name, lineno.toString(), ViewSchema.NUMBER_TYPE, WHEN_IMMEDIATELY);
          addAttribute(cattr, name, attrs, events, references, paths, styles);
        }

        ClassModel classModel = getClassModel();
        if (classModel == null) {
          throw new CompilationError("Could not find class definition for tag `" + className + "`", element);
        }
        // Encode the attributes
        for (Iterator iter = element.getAttributes().iterator(); iter.hasNext(); ) {
            Attribute attr = (Attribute) iter.next();
            Namespace ns = attr.getNamespace();
            String name = attr.getName();
            String value = element.getAttributeValue(name, ns);

            if (name.equals(FONTSTYLE_ATTRIBUTE)) {
                // "bold italic", "italic bold" -> "bolditalic"
                value = FontInfo.normalizeStyleString(value, false);
            }

            if (name.toLowerCase().equals("defaultplacement")) {
                if (value != null && value.matches("\\s*['\"]\\S*['\"]\\s*")) {
                    String oldValue = value;
                    // strip off start and ending quotes;
                    value = value.trim();
                    value = value.substring(1, value.length()-1);
                    env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Replacing defaultPlacement=\"" + p[0] + "\" by \"" + p[1] + "\".  For future compatibility" + ", you should make this change to your source code."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-513", new Object[] {oldValue, value})
                        ,element);
                }
            }

            

            // Warn for redefine of a flash builtin
            // TODO: [2006-01-23 ptw] What about colliding with DHTML globals?
            if ((name.equals("id") || name.equals("name")) &&
                 (value != null &&
                  (env.getRuntime().indexOf("swf") == 0) &&
                  ("swf6".equals(env.getRuntime()) ?
                   sFlash6Builtins.containsKey(value.toLowerCase()) :
                   sFlash7Builtins.containsKey(value))))  {
                env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="You have given the " + p[0] + " an attribute " + p[1] + "=\"" + p[2] + "\", " + "which may overwrite the Flash builtin class named \"" + p[3] + "\"."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-532", new Object[] {getMessageName(), name, value, value})
                    ,element);                    

            }

            // Catch duplicated id/name attributes which may shadow
            // each other or overwrite each other.  An id/name will be
            // global there is "id='foo'" or if "name='foo'" at the
            // top level (immediate child of the canvas).
            //
            if ((name.equals("id")) ||
                (name.equals("name") &&
                 topLevelDeclaration() && !className.equals("class"))) {

                ClassModel superclassModel = schema.getClassModel(value);
                if (superclassModel != null && !superclassModel.isBuiltin()) {
                    env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="You have given the " + p[0] + " an attribute " + p[1] + "=\"" + p[2] + "\", " + "which may overwrite the class \"" + p[3] + "\"."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-559", new Object[] {getMessageName(), name, value, value})
                        ,element);
                } else {
                    ElementWithLocationInfo dup =
                        (ElementWithLocationInfo) env.getId(value);
                    // we don't want to give a warning in the case
                    // where the id and name are on the same element,
                    // i.e., <view id="foo" name="foo"/>
                    if (dup != null && dup != element) {
                        String locstring =
                            CompilerUtils.sourceLocationPrettyString(dup);
                        env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Duplicate id attribute \"" + p[0] + "\" at " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-576", new Object[] {value, locstring})
,
                            element);
                    } else {
                        // TODO: [07-18-03 hqm] We will canonicalize
                        // all id's to lowercase, because actionscript
                        // is not case sensitive.  but in the future,
                        // we should preserve case.
                        env.addId(value, element);
                    }
                }
            }


            Schema.Type type;
            try {
                if (className.equals("class")) {
                    // Special case, if we are compiling a "class"
                    // tag, then get the type of attributes from the
                    // superclass.
                    type = getAttributeTypeInfoFromSuperclass(element, name);
                } else if (className.equals("state")) {
                    // Special case for "state", it can have any attribute
                    // which belongs to the parent. 
                    try {
                        type = schema.getAttributeType(element, name);
                    } catch (UnknownAttributeException e) {
                        type = getAttributeTypeInfoFromParent(element, name);
                    }
                } else {
                    // NOTE [2007-06-14 ptw]: Querying the classModel
                    // directly will NOT work, because the schema
                    // method has some special kludges in it for canvas
                    // width and height!
                    type = schema.getAttributeType(element, name);
                }

            } catch (UnknownAttributeException e) {
                String solution;
                AttributeSpec alt = schema.findSimilarAttribute(className, name);
                if (alt != null) {
                    String classmessage = "";
                    if (alt.source != null) {
                        classmessage = " on class "+alt.source.getName()+"\"";
                    } else {
                        classmessage = " on class "+getMessageName();
                    }
                    solution = 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="found an unknown attribute named \"" + p[0] + "\" on " + p[1] + ", however there is an attribute named \"" + p[2] + "\"" + p[3] + ", did you mean to use that?"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-616", new Object[] {name, getMessageName(), alt.name, classmessage});
                } else {
solution =
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="found an unknown attribute named \"" + p[0] + "\" on " + p[1] + ", check the spelling of this attribute name"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-624", new Object[] {name, getMessageName()});
                }
                env.warn(solution, element);
                type = ViewSchema.EXPRESSION_TYPE;
            }

            if (type == schema.ID_TYPE) {
                this.id = value;
            } else if (type == schema.EVENT_HANDLER_TYPE) {
                addHandlerFromAttribute(element, name, value);
            } else {
                String when = this.getAttributeValueDefault(
                    name, "when", WHEN_IMMEDIATELY);
                try {
                    CompiledAttribute cattr = compileAttribute(
                        element, name, value, type, when);
                    addAttribute(cattr, name, attrs, events,
                                 references, paths, styles);
                    // Check if we are aliasing another 'name'
                    // attribute of a sibling
                    if (name.equals("name")) {
                        Element parent = element.getParentElement();
                        if (parent != null) {
                            for (Iterator iter2 = parent.getChildren().iterator(); iter2.hasNext();
                                 ) {
                                Element e = (Element) iter2.next();
                                if (!e.getName().equals("resource") && !e.getName().equals("font")
                                    && e != element && value.equals(e.getAttributeValue("name"))) {
                                    String dup_location =
                                        CompilerUtils.sourceLocationPrettyString(e);
                                    env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + " has the same name=\"" + p[1] + "\" attribute as a sibling element at " + p[2]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-658", new Object[] {getMessageName(), value, dup_location})
                                        ,element);
                                }
                            }
                        }
                    }
                } catch (CompilationError e) {
                    env.warn(e);
                }
            }
        }
    }

    void addAttribute(CompiledAttribute cattr, String name,
                      ComparisonMap attrs, ComparisonMap events,
                      ComparisonMap references, ComparisonMap paths,
                      ComparisonMap styles) {
        if (cattr.type == cattr.ATTRIBUTE) {
            if (attrs.containsKey(name, caseSensitive)) {
                env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="an attribute or method named '" + p[0] + "' already is defined on " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-682", new Object[] {name, getMessageName()})
                    ,element);
            }
            attrs.put(name, cattr.value);
        } else if ((cattr.type == cattr.REFERENCE) || (cattr.type == cattr.PATH)) {
            if (references.containsKey(name, caseSensitive)) {
                env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="redefining reference '" + p[0] + "' which has already been defined on " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-706", new Object[] {name, getMessageName()})
                    ,element);
            }
            references.put(name, cattr.value);
        } else if (cattr.type == cattr.STYLE) {
            if (styles.containsKey(name, caseSensitive)) {
                env.warn(
                    // TODO [2006-08-22 ptw] i18n this
                    "duplicate $style binding for '" + name + "' in " + getMessageName(),
                    element);
            }
            styles.put(name, cattr.value);
        }
    }

    static String getDatasetContent(Element element, CompilationEnvironment env) {
        return getDatasetContent(element, env, false);
    }

    // For a dataset (well really for any Element), writes out the
    // child literal content as an escaped string, which could be used
    // to initialize the dataset at runtime.
    static String getDatasetContent(Element element, CompilationEnvironment env, boolean trimwhitespace) {
        String srcloc =
            CompilerUtils.sourceLocationDirective(element, true);

        // If type='http' or the path starts with http: or https:,
        // then don't attempt to include the data at compile
        // time. The runtime will have to recognize it as runtime
        // loaded URL data.
            
        if ("http".equals(element.getAttributeValue("type"))) {
            return "null";
        }

        boolean nsprefix = false;
        if ("true".equals(element.getAttributeValue("nsprefix"))) {
            nsprefix = true;
        }

        Element content = new Element("data");

        String src = element.getAttributeValue("src");
        // If 'src' attribute is a URL or null, don't try to expand it now,
        // just return. The LFC will have to interpret it as a runtime
        // loadable data URL.
        if ( (src != null) &&
             (src.startsWith("http:") ||
               src.startsWith("https:")) ) {
            return "null";
        } else if (src != null) {
            // Expands the src file content inline
            File file = env.resolveReference(element);
            try {
                Element literaldata = new org.jdom.input.SAXBuilder(false)
                    .build(file)
                    .getRootElement();
                if (literaldata == null) {
                    return "null";
                }
                literaldata.detach();
                // add the expanded file contents as child node
                content.addContent(literaldata);
            } catch (org.jdom.JDOMException e) {
                throw new CompilationError(e);
            } catch (IOException e) {
                throw new CompilationError(e);
            } catch (java.lang.OutOfMemoryError e) {
                // The runtime gc is necessary in order for subsequent
                // compiles to succeed.  The System gc is for good
                // luck.
                throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="out of memory"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-761")
                        , element);
            }
        } else {
            // no 'src' attribute, use element inline content
            content.addContent(element.cloneContent());
        }

        // Serialize the child elements, as the local data
        org.jdom.output.XMLOutputter xmloutputter =
            new org.jdom.output.XMLOutputter();
        // strip the <dataset> wrapper

        // If nsprefix is false, remove namespace from elements before
        // serializing, or XMLOutputter puts a "xmlns" attribute on
        // the top element in the serialized string.

        if (!nsprefix) {
            removeNamespaces(content);
        }

        if (trimwhitespace) {
            trimWhitespace(content);
        }

        String body = null;
        if (content != null) {
            body = xmloutputter.outputString(content);
            return ScriptCompiler.quote(body);
        } else {
            return "null";
        }

    }

    // Recursively null out the namespace on elt and children
    static void removeNamespaces(Element elt) {
        elt.setNamespace(null);
        for (Iterator iter = elt.getChildren().iterator(); iter.hasNext(); ) {
            Element child = (Element) iter.next();
            removeNamespaces(child);
        }
    }

    // Recursively trim out the whitespace on text nodes
    static void trimWhitespace(Content elt) {
        if (elt instanceof Text) {
            ((Text) elt).setText(((Text)elt).getTextTrim());
        } else if (elt instanceof Element) {
            for (Iterator iter = ((Element) elt).getContent().iterator(); iter.hasNext(); ) {
                Content child = (Content) iter.next();
                trimWhitespace(child);
            }
        }
    }

    boolean isDatapathElement(Element child) {
        return (child.getName().equals("datapath"));
    }

    /** Warn if named child tag conflicts with a declared attribute in the parent class.
     */
    void checkChildNameConflict(String parentName, Element child, CompilationEnvironment env) {
        String attrName = child.getAttributeValue("name");
        if (attrName != null) {
            AttributeSpec attrSpec = schema.getClassAttribute ( parentName, attrName) ;
            // Only warn if the attribute we are shadowing has a declared initial value.
            if (attrSpec != null && attrSpec.defaultValue != null) {
                // TODO [2007-09-26 hqm] i18n this
                env.warn(
                    "Child tag '" + child.getName() +
                    "' with attribute '"+attrName +
                    "' conflicts with attribute named '"+attrName+"' of type '" + attrSpec.type +
                    "' on parent tag '"+element.getName()+"'.",
                    element);
            }
        }
    }



    void addChildren(CompilationEnvironment env) {
        // Encode the children
        for (Iterator iter = element.getChildren().iterator(); iter.hasNext(); ) {
            ElementWithLocationInfo child = (ElementWithLocationInfo) iter.next();
            if (!schema.canContainElement(element.getName(), child.getName())) {
                // If this element is allowed to contain  HTML content, then
                // we don't want to warn about encountering an HTML child element.
                if (!( schema.hasTextContent(element) && schema.isHTMLElement(child))) {
                    env.warn(
                        // TODO [2007-09-26 hqm] i18n this
                        "The tag '" + child.getName() +
                        "' cannot be used as a child of " + element.getName(),
                        element);
                }
            }
            try {
                if (child.getName().equals("data")) {
                    checkChildNameConflict(element.getName(), child, env);
                    // literal data
                    addLiteralDataElement(child);
                } else if (isPropertyElement(child)) {
                    addPropertyElement(child);
                } else if (schema.isHTMLElement(child)) {
                    ; // ignore; the text compiler wiil handle this
                } else if (schema.isDocElement(child)) {
                    ; // ignore doc nodes.
                } else if (isDatapathElement(child)) {
                    checkChildNameConflict(element.getName(), child, env);
                    NodeModel dpnode = elementAsModel(child, schema, env);
                    this.datapath = dpnode;
                } else {
                    checkChildNameConflict(element.getName(), child, env);
                    NodeModel childModel = elementAsModel(child, schema, env);
                    children.add(childModel);
                    totalSubnodes += childModel.totalSubnodes();
                }
            } catch (CompilationError e) {
                env.warn(e);
            }
        }
    }

    void addPropertyElement(Element element) {
        String tagName = element.getName();
        if (tagName.equals("method")) {
            addMethodElement(element);
        } else if (tagName.equals("handler")) {
            addHandlerElement(element);
        } else if (tagName.equals("event")) {
          addEventElement(element);
        } else if (tagName.equals("attribute")) {
            addAttributeElement(element);
        }
    }

    /** Defines an event handler.
     *
     * <handler name="eventname" [method="methodname"]>
     *   [function body]
     * </handler>
     *
     * This can do a compile time check to see if eventname is declared or
     * if there is an attribute FOO such that name="onFOO".
     */

    void addHandlerElement(Element element) {
        String srcloc =
            CompilerUtils.sourceLocationDirective(element, true);
        String method = element.getAttributeValue("method");
        // event name
        String event = element.getAttributeValue("name");
        String args = CompilerUtils.attributeLocationDirective(element, "args") +
            XMLUtils.getAttributeValue(element, "args", "");
        if ((event == null || !ScriptCompiler.isIdentifier(event))) {
            env.warn("handler needs a non-null name attribute");
            return;
        }

        String parent_name =
            element.getParentElement().getAttributeValue("id");
        String name_loc =
            CompilerUtils.attributeLocationDirective(element, "event");
        if (parent_name == null) {
            parent_name =
                CompilerUtils.attributeUniqueName(element, "event");
        }
        // Names have to be unique across binary libraries, so append
        // parent name
        String name = env.methodNameGenerator.next() + "_" + parent_name + "_reference";
        String reference = element.getAttributeValue("reference");
        Object referencefn = "null";
        if (reference != null) {
            String ref_loc =
                CompilerUtils.attributeLocationDirective(element, "reference");
            referencefn = new Function(
                name,
                args,
                "\n#pragma 'withThis'\n" +
                "return (" +
                "#beginAttribute\n" + ref_loc +
                reference + "\n#endAttribute\n)",
                ref_loc);
        }
         
        // delegates is only used to determine whether to
        // default clickable to true.  Clickable should only
        // default to true if the event handler is attached to
        // this view.
        if (reference == null) {
            delegates.put(event, Boolean.TRUE);
        }
        delegateList.add(ScriptCompiler.quote(event));
        if (method != null) {
            delegateList.add(ScriptCompiler.quote(method));
        } else {
            delegateList.add(ScriptCompiler.quote(name));
        }
        delegateList.add(referencefn);

        String body = element.getText();

        String childcontentloc =
            CompilerUtils.sourceLocationDirective(element, true);

        if (attrs.containsKey(name, caseSensitive)) {
            env.warn(
                "an attribute or method named '"+name+
                "' already is defined on "+getMessageName(),
                element);
        }

        // If non-empty body AND method name are specified, flag an error
        // If non-empty body, pack it up as a function definition
        if (body != null && body.trim().length() > 0) {
            if (method != null) {
                env.warn("you cannot declare both a 'method' attribute " +
                         "*and* a function body on a handler element",
                         element);
            }
        }
        Function fndef = new
            Function(name,
                     //"#beginAttribute\n" +
                     CompilerUtils.attributeLocationDirective(element, "args") + args,
                     "\n#beginContent\n" +
                     "\n#pragma 'methodName=" + name + "'\n" +
                     "\n#pragma 'withThis'\n" +
                     childcontentloc +
                     body + "\n#endContent",
                     name_loc);

        attrs.put(name, fndef);
    }

    void addHandlerFromAttribute(Element element, String event, String body) {
        String srcloc =
            CompilerUtils.sourceLocationDirective(element, true);
        String parent_name =
            element.getAttributeValue("id");
        if (parent_name == null) {
            parent_name =
                CompilerUtils.attributeUniqueName(element, "event");
        }
        String name = env.methodNameGenerator.next();
        Object referencefn = "null";
         
        // delegates is only used to determine whether to
        // default clickable to true.  Clickable should only
        // default to true if the event handler is attached to
        // this view.
        delegates.put(event, Boolean.TRUE);
        delegateList.add(ScriptCompiler.quote(event));
        delegateList.add(ScriptCompiler.quote(name));
        delegateList.add(referencefn);

        String childcontentloc =
            CompilerUtils.sourceLocationDirective(element, true);

        Function fndef = new
            // Use "mangled" name, so it will be unique
            Function(srcloc +
                     parent_name + "_" + name,
                     //"#beginAttribute\n" +
                     "",
                     "\n#beginContent\n" +
                     "\n#pragma 'methodName=" + name + "'\n" +
                     "\n#pragma 'withThis'\n" +
                     childcontentloc +
                     body + "\n#endContent");

        attrs.put(name, fndef);
    }


    void addMethodElement(Element element) {
        String srcloc =
            CompilerUtils.sourceLocationDirective(element, true);
        String name = element.getAttributeValue("name");
        String event = element.getAttributeValue("event");
        String args = XMLUtils.getAttributeValue(element, "args", "");
        String override = element.getAttributeValue("override");

        if ((name == null || !ScriptCompiler.isIdentifier(name)) &&
            (event == null || !ScriptCompiler.isIdentifier(event))) {
            env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="method needs a non-null name or event attribute"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-832")
);
            return;
        }
        if (name != null && sDeprecatedMethods.containsKey(name)) {
            String oldName = name;
            String newName = (String) sDeprecatedMethods.get(name);
            name = newName;
            env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes=p[0] + " is deprecated.  " + "This method will be compiled as <method name='" + p[1] + "' instead.  " + "Please update your sources."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-846", new Object[] {oldName, newName})
                ,element);
        }

        String parent_name =
            element.getParentElement().getAttributeValue("id");
        String name_loc =
            (name == null ?
             CompilerUtils.attributeLocationDirective(element, "event") :
             CompilerUtils.attributeLocationDirective(element, "name"));
        if (parent_name == null) {
            parent_name =
                (name == null ?
                 CompilerUtils.attributeUniqueName(element, "event") :
                 CompilerUtils.attributeUniqueName(element, "name"));
        }
        if (event != null) {
            if (name == null) {
                // Names have to be unique across binary libraries, so
                // append parent name
                name = env.methodNameGenerator.next() + "_" + parent_name + "_reference";
            }
            String reference = element.getAttributeValue("reference");
            Object referencefn = "null";
            if (reference != null) {
                String ref_loc =
                    CompilerUtils.attributeLocationDirective(element, "reference");
                referencefn = new Function(
                    name,
                    CompilerUtils.attributeLocationDirective(element, "args") + args,
                    "\n#pragma 'withThis'\n" +
                    "return (" +
                    "#beginAttribute\n" + ref_loc +
                    reference + "\n#endAttribute\n)",
                    ref_loc);
            }
            // delegates is only used to determine whether to
            // default clickable to true.  Clickable should only
            // default to true if the event handler is attached to
            // this view.
            if (reference == null)
                delegates.put(event, Boolean.TRUE);
            delegateList.add(ScriptCompiler.quote(event));
            delegateList.add(ScriptCompiler.quote(name));
            delegateList.add(referencefn);
        }
        String body = element.getText();

        String childcontentloc =
            CompilerUtils.sourceLocationDirective(element, true);
        Function fndef = new
            Function(name,
                     //"#beginAttribute\n" +
                     CompilerUtils.attributeLocationDirective(element, "args") + args,
                     "\n#beginContent\n" +
                     "\n#pragma 'methodName=" + name + "'\n" +
                     "\n#pragma 'withThis'\n" +
                     childcontentloc +
                     body + "\n#endContent",
                     name_loc);

        if (attrs.containsKey(name, caseSensitive)) {
            env.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="an attribute or method named '" + p[0] + "' already is defined on " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-922", new Object[] {name, getMessageName()})
                ,element);
        }


     
        if (!("true".equals(override))) {
            String classname = element.getParentElement().getName();
            // Just check method declarations on regular node.
            // Method declarations inside of class definitions will be already checked elsewhere,
            // in the call from ClassCompiler.updateSchema to schema.addElement
            if (!"class".equals(classname)) {
                schema.checkInstanceMethodDeclaration(element, classname, name, env);
            }
        }

        attrs.put(name, fndef);
    }


    // Pattern matcher for '$once{...}' style constraints
    Pattern constraintPat = Pattern.compile("^\\s*\\$(\\w*)\\s*\\{(.*)\\}\\s*");


    CompiledAttribute compileAttribute(
        Element source, String name,
        String value, Schema.Type type,
        String when)
        {

            String srcloc = CompilerUtils.sourceLocationDirective(source, true);
            String parent_name = source.getAttributeValue("id");
            if (parent_name == null) {
                parent_name =  CompilerUtils.attributeUniqueName(source, name);
            }
            // Some values are not canonicalized to String
            Object canonicalValue = null;
            boolean warnOnDeprecatedConstraints = true;

            if (value == null) {
                throw new RuntimeException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="value is null in " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-956", new Object[] {source})
);
            }

            Matcher m = constraintPat.matcher(value);
            // value.matches("\\s*['\"]\\S*['\"]\\s*")
            if (value.matches("\\s*\\$\\s*\\(")) {
                env.warn(
                    "The syntax '$(...)' is not valid, "
                    + "you probably meant to use curly-braces instead '${...}'",
                    source);
            } else if (m.matches()) {
                // extract out $when{value}
                when = m.group(1);
                value = m.group(2);
                // Expressions override any when value, default is
                // constraint
                if (when.equals("")) {
                    when = WHEN_ALWAYS;
                }
            } else if (type == ViewSchema.XML_LITERAL) {
                value = "LzDataNode.stringToLzData("+value+")";
            } else if (type == ViewSchema.COLOR_TYPE) {
                if (when.equals(WHEN_IMMEDIATELY)) {
                    try {
                        value = "0x" +
                            Integer.toHexString(ViewSchema.parseColor(value));
                    } catch (ColorFormatException e) {
                        // Or just set when to WHEN_ONCE and fall
                        // through to TODO?
                        throw new CompilationError(source, name, e);
                    }
                }
                // TODO: [2003-05-02 ptw] Wrap non-constant colors in
                // runtime parser
            } else if (type == ViewSchema.CSS_TYPE) {
                if (when.equals(WHEN_IMMEDIATELY)) {
                    try {
                        Map cssProperties = new CSSParser
                            (new AttributeStream(source, name, value)).Parse();
                        for (Iterator i2 = cssProperties.entrySet().iterator(); i2.hasNext(); ) {
                            Map.Entry entry = (Map.Entry) i2.next();
                            Object mv = entry.getValue();
                            if (mv instanceof String) {
                                entry.setValue(ScriptCompiler.quote((String) mv));
                            }
                        }
                        canonicalValue = cssProperties;
                    } catch (org.openlaszlo.css.ParseException e) {
                        // Or just set when to WHEN_ONCE and fall
                        // through to TODO?
                        throw new CompilationError(e);
                    } catch (org.openlaszlo.css.TokenMgrError e) {
                        // Or just set when to WHEN_ONCE and fall
                        // through to TODO?
                        throw new CompilationError(e);
                    }
                }
                // TODO: [2003-05-02 ptw] Wrap non-constant styles in
                // runtime parser
            } else if (type == ViewSchema.STRING_TYPE
                       || type == ViewSchema.TOKEN_TYPE
                       || type == ViewSchema.ID_TYPE
                       ) {
                // Immediate string attributes are auto-quoted
                if (when.equals(WHEN_IMMEDIATELY)) {
                    value = ScriptCompiler.quote(value);
                }
            } else if ((type == ViewSchema.EXPRESSION_TYPE) || (type == ViewSchema.BOOLEAN_TYPE)) {
                // No change currently, possibly analyze expressions
                // and default non-constant to when="once" in the
                // future
            } else if (type == ViewSchema.INHERITABLE_BOOLEAN_TYPE) {
                // change "inherit" to null and pass true/false through as expression
                if ("inherit".equals(value)) {
                    value = "null";
                } else if ("true".equals(value)) {
                    value = "true";
                } else if ("false".equals(value)) {
                    value = "false";
                } else {
                    // TODO [hqm 2007-0] i8nalize this message
                    env.warn("attribute '"+name+"' must have the value 'true', 'false', or 'inherit'",
                             element);
                }
            } else if (type == ViewSchema.NUMBER_TYPE) {
                // No change currently, possibly analyze expressions
                // and default non-constant to when="once" in the
                // future
            } else if (type == ViewSchema.NUMBER_EXPRESSION_TYPE ||
                       type == ViewSchema.SIZE_EXPRESSION_TYPE) {
                // if it's a number that ends in percent:
                if (value.trim().endsWith("%")) {
                    String numstr = value.trim();
                    numstr = numstr.substring(0, numstr.length() - 1);
                    try {
                        double scale = new Float(numstr).floatValue() / 100.0;
                        warnOnDeprecatedConstraints = false;
                        String referenceAttribute = name;
                        if (name.equals("x")) {
                            referenceAttribute = "width";
                        } else if (name.equals("y")) {
                            referenceAttribute = "height";
                        }
                        value = "immediateparent." + referenceAttribute;
                        if (scale != 1.0) {
                            // This special case doesn't change the
                            // semantics, but it generates shorter (since
                            // the sc doesn't fold constants) and more
                            // debuggable code
                            value += "\n * " + scale;
                        }
                        // fall through to the reference case
                    } catch (NumberFormatException e) {
                        // fall through
                    }
                }
                // if it's a literal, treat it the same as a number
                try {
                    new Float(value); // for effect, to generate the exception
                    when = WHEN_IMMEDIATELY;
                } catch (NumberFormatException e) {
                    // It's not a constant, unless when has been
                    // specified, default to a constraint
                    if (when.equals(WHEN_IMMEDIATELY)) {
                        if (warnOnDeprecatedConstraints) {
                            env.warn(
                                "Use " + name + "=\"${" + value + "}\" instead.",
                                element);
                        }
                        when = WHEN_ALWAYS;
                    }
                }
            } else if (type == ViewSchema.EVENT_HANDLER_TYPE) {
              // Someone said <attribute name="..." ... /> instead of
              // <event name="..." />
              throw new CompilationError(element, name, 
                                         new Throwable ("'" + name + "' is an event and may not be redeclared as an attribute"));
            } else if (type == ViewSchema.REFERENCE_TYPE) {
                // type="reference" is defined to imply when="once"
                // since reference expressions are unlikely to
                // evaluate correctly at when="immediate" time
                if (when.equals(WHEN_IMMEDIATELY)) {
                    when = WHEN_ONCE;
                }
            } else if (type == ViewSchema.METHOD_TYPE) {
                // methods are emitted elsewhere
            } else {
                throw new RuntimeException("unknown schema datatype " + type);
            }

            if (canonicalValue == null)
                canonicalValue = value;

            // Handle when cases
            // N.B., $path and $style are not really when values, but
            // there you go...
            if (when.equals(WHEN_PATH)) {
                return new CompiledAttribute(
                    CompiledAttribute.PATH,
                    srcloc + ScriptCompiler.quote(value) + "\n");
            } else if (when.equals(WHEN_STYLE)) {
                return new CompiledAttribute(
                    CompiledAttribute.STYLE,
                    srcloc + value + "\n");
            } else if (when.equals(WHEN_ONCE)) {
                return new CompiledAttribute(
                    CompiledAttribute.REFERENCE,
                    "function " +
                    parent_name + "_" + name + "_once" +
                    " () {" +
                    "\n#pragma 'withThis'\n" +
                    // Use this.setAttribute so that the compiler
                    // will recognize it for inlining.
                    "this.setAttribute(" +
                    ScriptCompiler.quote(name) + " , " +
                    "\n#beginAttribute\n" + srcloc + canonicalValue + "\n#endAttribute\n)}");
            } else if (when.equals(WHEN_ALWAYS)) {
                return new CompiledAttribute(
                    CompiledAttribute.REFERENCE,
                    "function " +
                    parent_name + "_" + name + "_always" +
                    " () {" +
                    "\n#pragma 'constraintFunction'\n" +
                    "\n#pragma 'withThis'\n" +
                    // Use this.setAttribute so that the compiler
                    // will recognize it for inlining.
                    "this.setAttribute(" +
                    ScriptCompiler.quote(name) + ", " +
                    "\n#beginAttribute\n" + srcloc + canonicalValue +
                    "\n#endAttribute\n)}");
            } else if (when.equals(WHEN_IMMEDIATELY)) {
                if ((CanvasCompiler.isElement(source) &&
                     ("width".equals(name) || "height".equals(name))) ||
                    canonicalValue instanceof Map) {
                    // The Canvas compiler depends on seeing width/height
                    // unadulterated <sigh />.  Or, if it's already an
                    // object, e.g., compiled from a CSS list, we
                    // don't want to mess it up.
                    //
                    // TODO: [2007-05-05 ptw] (LPP-3949) The
                    // #beginAttribute directives for the parser should
                    // be added when the attribute is written, not
                    // here...
                    return new CompiledAttribute(canonicalValue);
                } else {
                    return new CompiledAttribute("\n#beginAttribute\n" + srcloc + canonicalValue + "\n#endAttribute\n");
                }
            } else {
                throw new CompilationError("invalid when value '" +
                                           when + "'", source);
            }
        }

    /* Handle the <event> tag
     * example: <event name="onfoobar"/>
    */
    void addEventElement(Element element) {
        String name;
        try {
            name = ElementCompiler.requireIdentifierAttributeValue(element, "name");
        } catch (MissingAttributeException e) {
            throw new CompilationError(
                /* (non-Javadoc)
                 * @i18n.test
                 * @org-mes="'name' is a required attribute of <" + p[0] + "> and must be a valid identifier"
                 */
                org.openlaszlo.i18n.LaszloMessages.getMessage(
                    NodeModel.class.getName(),"051018-1157", new Object[] {element.getName()})
                , element);
        }

        if (events.containsKey(name, caseSensitive)) {
            env.warn(
                /* (non-Javadoc)
                 * @i18n.test
                 * @org-mes="redefining event '" + p[0] + "' which has already been defined on " + p[1]
                 */
                org.openlaszlo.i18n.LaszloMessages.getMessage(
                    NodeModel.class.getName(),"051018-694", new Object[] {name, getMessageName()})
                ,element);
        }

        // An event is really just an attribute with an implicit
        // default (sentinal) value
        CompiledAttribute cattr = new CompiledAttribute(CompiledAttribute.EVENT, "LzDeclaredEvent");
        addAttribute(cattr, name, attrs, events, references, paths, styles);
    }

    void addAttributeElement(Element element) {
        String name;
        try {
            name = ElementCompiler.requireIdentifierAttributeValue(element, "name");
        } catch (MissingAttributeException e) {
            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="'name' is a required attribute of <" + p[0] + "> and must be a valid identifier"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-1157", new Object[] {element.getName()})
                    , element);
        }

        String value = element.getAttributeValue("value");
        String when = element.getAttributeValue("when");
        String typestr = element.getAttributeValue("type");
        Element parent = element.getParentElement();
        String parent_name = parent.getAttributeValue("id");

        if (parent_name == null) {
            parent_name = CompilerUtils.attributeUniqueName(element, name);
        }

        // Default when according to parent
        if (when == null) {
            when = this.getAttributeValueDefault(
                name, "when", WHEN_IMMEDIATELY);
        }

        Schema.Type type = null;
        Schema.Type parenttype = null;

        AttributeSpec parentAttrSpec = schema.getAttributeSpec(parent.getName(), name);
        boolean forceOverride = parentAttrSpec != null && "true".equals(parentAttrSpec.override);

        try {
            if (parent.getName().equals("class")) {
                parenttype = getAttributeTypeInfoFromSuperclass(parent, name);
            }  else {
                parenttype = schema.getAttributeType(parent, name);

            }
        } catch (UnknownAttributeException e) {
            // If attribute type is not defined on parent, leave
            // parenttype null.  The user can define it however they
            // like.
        }

        if (typestr == null) {
            // Did user supply an explicit attribute type?
            //  No.  Default to parent type if there is one, else
            // EXPRESSION type.
            if (parenttype == null) {
                type = ViewSchema.EXPRESSION_TYPE;
            } else {
                type = parenttype;
            }
        } else {
            // parse attribute type and compare to parent type
            type = schema.getTypeForName(typestr);
            if (type == null) {
                throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="unknown attribute type: " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-1211", new Object[] {typestr})
, element);
            }

            // If we are trying to declare the attribute with a
            // conflicting type to the parent, throw an error
            if (!forceOverride && parenttype != null && type != parenttype) {
                env.warn(
                    new CompilationError(
                        element,
                        name,
                        new Throwable(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="In element '" + p[0] + "' attribute '" + p[1] + "' with type '" + p[2] + "' is overriding parent class attribute with same name but different type: " + p[3]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-1227", new Object[] {parent.getName(), name, type.toString(), parenttype.toString()}))
                        )
                    );
            }
        }



        // Warn if we are overidding a method, handler, or other function
        if (!forceOverride &&
            (parenttype == schema.METHOD_TYPE ||
             parenttype == schema.EVENT_HANDLER_TYPE ||
             parenttype == schema.SETTER_TYPE ||
             parenttype == schema.REFERENCE_TYPE)) {
            env.warn( "In element '" + parent.getName() 
                      + "' attribute '" +  name 
                      + "' is overriding parent class attribute which has the same name but type: "
                      + parenttype.toString(),
                      element);
        }

        // Don't initialize an attribute that is only declared.
        if (value != null) {
            CompiledAttribute cattr = compileAttribute(element, name,
                                                       value, type,
                                                       when);
            addAttribute(cattr, name, attrs, events, references, paths, styles);
        }

        // Add entry for attribute setter function
        String setter = element.getAttributeValue("setter");
        // Backward compatibility
        if (setter == null) {
            setter = element.getAttributeValue("onset");
        }
        if (setter != null) {
            String srcloc =
                CompilerUtils.sourceLocationDirective(element, true);
            // Maybe we need a new type for "function"?
            String setterfn =
                srcloc + "function " +
                parent_name + "_" + name + "_onset" +
                " (" + name + ") {" +
                "\n#pragma 'withThis'\n" +
                srcloc + setter + "\n}";

            if (setters.get(name) != null) {
                env.warn(
                    "a setter for attribute named '"+name+
                    "' is already defined on "+getMessageName(),
                    element);
            }

            setters.put(name, setterfn);
        }
    }

    /* Handle a <data> tag.
     * If there is more than one immediate child data node at the top level, signal a warning.
     */

    void addLiteralDataElement(Element element) {
        String name = element.getAttributeValue("name");

        if (name == null) {
            name = "initialdata";
        }

        boolean trimWhitespace = "true".equals(element.getAttributeValue("trimwhitespace"));

        String xmlcontent = getDatasetContent(element, env, trimWhitespace);

        Element parent = element.getParentElement();

        CompiledAttribute cattr = compileAttribute(element,
                                                   name,
                                                   xmlcontent,
                                                   ViewSchema.XML_LITERAL,
                                                   WHEN_IMMEDIATELY);

        addAttribute(cattr, name, attrs, events, references, paths, styles);
    }

        

    boolean hasAttribute(String name) {
        return attrs.containsKey(name);
    }

    void removeAttribute(String name) {
        attrs.remove(name);
    }

    void setAttribute(String name, Object value) {
        attrs.put(name, value);
    }

    void addText() {
        if (schema.hasHTMLContent(element)) {
            String text = TextCompiler.getHTMLContent(element);
            if (text.length() != 0) {
                if (!attrs.containsKey("text")) {
                    attrs.put("text", ScriptCompiler.quote(text));
                }
            }
        } else if (schema.hasTextContent(element)) {
            String text;
            // The current inputtext component doesn't understand
            // HTML, but we'd like to have some way to enter
            // linebreaks in the source.
            text = TextCompiler.getInputText(element);
            if (text.length() != 0) {
                if (!attrs.containsKey("text")) {
                    attrs.put("text", ScriptCompiler.quote(text));
                }
            }
        }
    }

    void updateAttrs() {
        if (!setters.isEmpty()) {
            attrs.put("$setters", setters);
        }
        if (!delegateList.isEmpty()) {
            attrs.put("$delegates", delegateList);
        }
        if (!references.isEmpty()) {
            attrs.put("$refs", references);
        }
        if (!paths.isEmpty()) {
            attrs.put("$paths", paths);
        }
        if (datapath != null) {
            attrs.put("$datapath", datapath.asMap());
            // If we've got an explicit datapath value, we have to
            // null out the "datapath" attribute with the magic
            // LzNode._ignoreAttribute value, so it doesn't get
            // overridden by an inherited value from the class.
            attrs.put("datapath", "LzNode._ignoreAttribute");
        }

        if (!styles.isEmpty()) {
            String styleMap;
            try {
                java.io.Writer writer = new java.io.StringWriter();
                ScriptCompiler.writeObject(styles, writer);
                styleMap = writer.toString();
            } catch (java.io.IOException e) {
                throw new ChainedException(e);
            }
            // NOTE: [2006-09-04 ptw] The $styles method _must_ create
            // a new map each time, because the sub-class or instance
            // may modify it.
            attrs.put("$styles",
                      new
                      Function(
                          "",
                          "",
                          "\n#beginContent" +
                          "\n#pragma 'withThis'" +
                          "\n#pragma 'methodName=$styles'" +
                          "\nvar map = super.$styles() || (new Object);" +
                          "\nvar s = " + styleMap + ";" +
                          "\nfor (var k in s) { map[k] = s[k]; };" +
                          "\nreturn map;" +
                          "\n#endContent" +
                          "\n")
                      );
        }
    }

    Map asMap() {
        Map map = new LinkedHashMap();
        updateAttrs();
        map.put("name", ScriptCompiler.quote(className));
        map.put("attrs", attrs);
        if (id != null) {
            map.put("id", ScriptCompiler.quote(id));
            attrs.put("id", ScriptCompiler.quote(id));
        }
        if (!children.isEmpty()) {
            List childMaps = new Vector(children.size());
            for (Iterator iter = children.iterator(); iter.hasNext(); )
                childMaps.add(((NodeModel) iter.next()).asMap());
            map.put("children", childMaps);
        }
        return map;
    }

    /** Expand eligible instances by replacing the instance by the
     * merge of its class definition with the instance content
     * (attributes and children).  An eligible instance is an instance
     * of a compile-time class, that doesn't contain any merge
     * stoppers.  If the class and the instance contain a member with
     * the same name, this is a merge stopper.  In the future, this
     * restriction may be relaxed, but will probably always include
     * the case where a class and instance have a member with the same
     * name and the instance name calls a superclass method. */
    NodeModel expandClassDefinitions() {
        NodeModel model = this;
        while (true) {
            ClassModel classModel = schema.getClassModel(model.className);
            if (classModel == null)
                break;
            if (classModel.getSuperclassName() == null)
                break;
            if (!classModel.getInline())
                break;
            model = classModel.applyClass(model);
            // Iterate to allow for the original classes superclass to
            // be expanded as well.
        }
        // Recurse. Make a copy so we can replace the child list.
        // TODO [2004-0604]: As an optimization, only do this if one
        // of the children changed.
        model = (NodeModel) model.clone();
        for (ListIterator iter = model.children.listIterator();
             iter.hasNext(); ) {
            NodeModel child = (NodeModel) iter.next();
            iter.set(child.expandClassDefinitions());
        }
        return model;
    }

    /** Replace members of this with like-named members of source. */
    void updateMembers(NodeModel source) {
        final String OPTIONS_ATTR_NAME = "options";

        // FIXME [2004-06-04]: only compare events with the same reference
        if (CollectionUtils.containsAny(
                events.normalizedKeySet(), source.events.normalizedKeySet())) {
            Collection sharedEvents = CollectionUtils.intersection(
                events.normalizedKeySet(), source.events.normalizedKeySet());
            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Both the class and the instance or subclass define the " + p[0] + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-1388", new Object[] {new ChoiceFormat("1#event |1<events ").format(sharedEvents.size()), new ListFormat("and").format(sharedEvents)})
                );
                        
        }

        // Check for duplicate methods.  Collect all the keys that name
        // a Function in both the source and target.
        List sharedMethods = new Vector();
        for (Iterator iter = attrs.normalizedKeySet().iterator();
             iter.hasNext(); ) {
            String key = (String) iter.next();
            if (attrs.get(key) instanceof Function &&
                source.attrs.get(key) instanceof Function)
                sharedMethods.add(key);
        }
        if (!sharedMethods.isEmpty())
            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Both the class and the instance or subclass define the method" + p[0] + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-1409", new Object[] {new ChoiceFormat("1# |1<s ").format(sharedMethods.size()), new ListFormat("and").format(sharedMethods)})
                );

        // Check for attributes that have a value in this and
        // a setter in the source.  These can't be merged.
        Collection overriddenAttributes = CollectionUtils.intersection(
            attrs.normalizedKeySet(), source.setters.normalizedKeySet());
        if (!overriddenAttributes.isEmpty())
            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="A class that defines a value can't be inlined against a " + "subclass or instance that defines a setter.  The following " + p[0] + " this condition: " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                NodeModel.class.getName(),"051018-1422", new Object[] {new ChoiceFormat("1#attribute violates|1<attributes violate").format(overriddenAttributes.size()), new ListFormat("and").format(overriddenAttributes)})
                );

        // Do the actual merge.
        id = source.id;
        if (source.initstage != null)
            initstage = source.initstage;
        Object options = attrs.get(OPTIONS_ATTR_NAME);
        Object sourceOptions = source.attrs.get(OPTIONS_ATTR_NAME);
        attrs.putAll(source.attrs);
        if (options instanceof Map && sourceOptions instanceof Map) {
//             System.err.println(options);
//             System.err.println(sourceOptions);
            Map newOptions = new HashMap((Map) options);
            newOptions.putAll((Map) sourceOptions);
            attrs.put(OPTIONS_ATTR_NAME, newOptions);
        }
        delegates.putAll(source.delegates);
        events.putAll(source.events);
        references.putAll(source.references);
        paths.putAll(source.paths);
        setters.putAll(source.setters);
        styles.putAll(source.styles);
        delegateList.addAll(source.delegateList);
        // TBD: warn on children that share a name?
        // TBD: update the node count
        children.addAll(source.children);
    }
}
