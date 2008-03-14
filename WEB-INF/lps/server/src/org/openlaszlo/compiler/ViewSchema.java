/* ****************************************************************************
 * ViewSchema.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import java.io.*;
import java.util.*;
import org.apache.oro.text.regex.*;
import org.jdom.Document;
import org.jdom.Attribute;
import org.jdom.Element;
import org.jdom.Namespace;
import org.jdom.output.XMLOutputter;
import org.jdom.input.SAXBuilder;
import org.jdom.JDOMException;
import org.openlaszlo.xml.internal.Schema;
import org.openlaszlo.xml.internal.XMLUtils;
import org.openlaszlo.utils.ChainedException;
import org.openlaszlo.server.*;

/** A schema that describes a Laszlo XML file. */
public class ViewSchema extends Schema {
    private static final Set sInputTextElements = new HashSet();
    private static final Set sHTMLContentElements = new HashSet();

    /** The location of the Laszlo LFC bootstrap interface declarations file  */
    private final String SCHEMA_PATH = LPS.HOME() + File.separator +
        "WEB-INF" + File.separator + 
        "lps" + File.separator + 
        "schema"  + File.separator + "lfc.lzx";

    private Document schemaDOM = null;

    private static Document sCachedSchemaDOM;
    private static long sCachedSchemaLastModified;
    
    /** Default table of attribute name -> typecode */
    private static final Map sAttributeTypes = new HashMap();

    /** Mapping of RNG type names -> LPS Types */
    private static final Map sRNGtoLPSTypeMap = new HashMap();

    /** {String} */
    private static final Set sMouseEventAttributes;
    
    /** Maps a class (name) to its ClassModel. Holds info about
     * attribute/types for each class, as well as pointer to the
     * superclass if any.
     */
    private final Map mClassMap = new HashMap();

    /**
     * If true, requires class names to be valid javascript identifiers.
     * We disable this when defining LZX builtin tags such as "import"
     * which are reserved javascript tokens.
     */
    public boolean enforceValidIdentifier = false;

    /** Type of script expressions. */
    public static final Type EXPRESSION_TYPE = newType("expression");

    /** 'boolean' is compiled the same as an expression type */
    public static final Type BOOLEAN_TYPE = newType("boolean");

    public static final Type REFERENCE_TYPE = newType("reference");
    /** Type of event handler bodies. */
    public static final Type EVENT_HANDLER_TYPE = newType("script");

    /** Type of attribute setter function */
    public static final Type SETTER_TYPE = newType("setter");

    /** Type of tokens. */
    public static final Type TOKEN_TYPE = newType("token");
    public static final Type COLOR_TYPE = newType("color");
    public static final Type NUMBER_EXPRESSION_TYPE = newType("numberExpression");
    public static final Type SIZE_EXPRESSION_TYPE = newType("size");
    public static final Type CSS_TYPE = newType("css");
    public static final Type INHERITABLE_BOOLEAN_TYPE = newType("inheritableBoolean");
    public static final Type XML_LITERAL = newType("xmlLiteral");
    public static final Type METHOD_TYPE = newType("method");
    
    static {

        sHTMLContentElements.add("text");
        sInputTextElements.add("inputtext");

        // from http://www.w3.org/TR/REC-html40/interact/scripts.html
        String[] mouseEventAttributes = {
            "onclick", "ondblclick", "onmousedown", "onmouseup", "onmouseover",
            "onmousemove", "onmouseout"};
        String[] eventAttributes = {
            "onkeypress", "onstart" , "onstop",
            "onfocus", "onblur",
            "onkeydown", "onkeyup", "onsubmit", "onreset", "onselect",
            "onchange" , "oninit", "onerror", "ondata", "ontimeout", 
            "oncommand" , "onapply" , "onremove"};
        setAttributeTypes(mouseEventAttributes, EVENT_HANDLER_TYPE);
        setAttributeTypes(eventAttributes, EVENT_HANDLER_TYPE);
        sMouseEventAttributes = new HashSet(Arrays.asList(mouseEventAttributes));
    }

    private static final String AUTOINCLUDES_PROPERTY_FILE =
        LPS.getMiscDirectory() + File.separator +
        "lzx-autoincludes.properties";
    public static final Properties sAutoincludes = new Properties();
    
    static {
        try {
            InputStream is = new FileInputStream(AUTOINCLUDES_PROPERTY_FILE);
            try {
                sAutoincludes.load(is);
            } finally {
                is.close();
            }
        } catch (java.io.IOException e) {
            throw new ChainedException(e);
        }
    }
    
    /** Set the attributes to the type.
     * @param attributes a list of attributes
     * @param type a type
     */
    private static void setAttributeTypes(String[] attributes, Type type) {
        for (int i = 0; i < attributes.length; i++) {
            sAttributeTypes.put(attributes[i].intern(), type);
        }
    }

    public AttributeSpec findSimilarAttribute (String className, String attributeName) {
        ClassModel info = getClassModel(className);

        if (info != null) {
            return info.findSimilarAttribute(attributeName);
        } else {
            // Check other classes....
            return null;
        }
    }

    /** Set the attribute to the given type, for a specific element */
    public void setAttributeType (Element elt, String classname, String attrName, AttributeSpec attrspec) {
        ClassModel classModel = getClassModel(classname);
        if (classModel == null) {
            throw new RuntimeException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="undefined class: " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ViewSchema.class.getName(),"051018-168", new Object[] {classname})
            );
        }
        if (classModel.attributeSpecs.get(attrName) != null) {
            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="duplicate definition of attribute " + p[0] + "." + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ViewSchema.class.getName(),"051018-178", new Object[] {classname, attrName})
                , elt);
        }
        classModel.attributeSpecs.put(attrName, attrspec);

        if (attrName.equals("text")) {
            classModel.supportsTextAttribute = true;
        }
    }

    /** Checks to do when declaring a method on a class;
     * Does the class exist?
     * Is this a duplicate of another method declaration on this class?
     * Does the superclass allow overriding of this method?
     */
    public void checkMethodDeclaration (Element elt, String classname, String methodName,
                                        CompilationEnvironment env) {
        ClassModel classModel = getClassModel(classname);
        if (classModel == null) {
            throw new RuntimeException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="undefined class: " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ViewSchema.class.getName(),"051018-168", new Object[] {classname})
                                       );
        }
        AttributeSpec localAttr = classModel.getLocalAttribute(methodName);
        if ( localAttr != null) {
            if (localAttr.type == METHOD_TYPE) {
                env.warn(
                    /* (non-Javadoc)
                     * @i18n.test
                     * @org-mes="duplicate definition of method " + p[0] + "." + p[1]
                     */
                    org.openlaszlo.i18n.LaszloMessages.getMessage(
                        ViewSchema.class.getName(),"051018-207", new Object[] {classname, methodName}),
                    elt);
            } else {
                env.warn(
                    "Method named "+methodName+" on class "+classname+
                    " conflicts with attribute with named "+methodName+" and type "+localAttr.type,
                    elt);
            }
        }

        if (!methodOverrideAllowed(classname, methodName)) {
            env.warn("Method "+classname+"."+methodName+" is overriding a superclass method"
                     + " of the same name which has been declared non-overridable" , elt);
        }
    }

    /** Checks to do when declaring a method on an instance;
     * Does the class exist?
     * Does the superclass allow overriding of this method?
     */
    public void checkInstanceMethodDeclaration (Element elt, String classname, String methodName,
                                        CompilationEnvironment env) {
        ClassModel classModel = getClassModel(classname);
        if (classModel == null) {
            throw new RuntimeException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="undefined class: " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ViewSchema.class.getName(),"051018-168", new Object[] {classname})
                                       );
        }
        AttributeSpec attrspec = classModel.getAttribute(methodName);
        if ( attrspec != null) {
            if (attrspec.type != METHOD_TYPE) {
                env.warn(
                    "Method named "+methodName+" on class "+classname+
                    " conflicts with attribute with named "+methodName+" and type "+attrspec.type,
                    elt);
            }
        }

        if (!methodOverrideAllowed(classname, methodName)) {
            env.warn("Method "+classname+"."+methodName+" is overriding a superclass method"
                     + " of the same name which has been declared non-overridable" , elt);
        }
    }

    public String getSuperclassName(String className) {
        ClassModel model = getClassModel(className);
        if (model == null)
            return null;
        return model.getSuperclassName();
    }
    
    /**
     * @return the base class of a user defined class
     */
    public String getBaseClassname(String className) {
        String ancestor = getSuperclassName(className);
        String superclass = ancestor;

        while (ancestor != null) {
            if (ancestor.equals(className)) {
                throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="recursive class definition on " + p[0]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ViewSchema.class.getName(),"051018-235", new Object[] {className})
);
            }
            superclass = ancestor;
            ancestor = getSuperclassName(ancestor);
        }
        return superclass;
    }

    /** Does this class or its ancestors have this attribute declared for it? */
    AttributeSpec getClassAttribute (String classname, String attrName) {
        // OK, walk up the superclasses, checking for existence of this attribute
        ClassModel info = getClassModel(classname);
        if (info == null) {
            return null;
        } else {
            return info.getAttribute(attrName);
        }
    }

    /**
     * Add a new element to the attribute type map.
     *
     * @param elt the element to add to the map
     * @param superclassName an element to inherit attribute to type info from. May be null.
     * @param attributeDefs list of attribute name/type defs
     */
    public void addElement (Element elt, String className,
                            String superclassName, List attributeDefs,
                            CompilationEnvironment env)
    {
        ClassModel superclass = getClassModel(superclassName);

        if (superclass == null) {
            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="undefined superclass " + p[0] + " for class " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ViewSchema.class.getName(),"051018-417", new Object[] {superclassName, className})
);
        }

        if (mClassMap.get(className) != null) {
            String builtin = "builtin ";
            String also = "";
            Element other = getClassModel(className).definition;
            if (other != null) {
                builtin = "";
                also = "; also defined at " + Parser.getSourceMessagePathname(other) + ":" + Parser.getSourceLocation(other, Parser.LINENO);
            }
            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="duplicate class definitions for " + p[0] + p[1] + p[2]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ViewSchema.class.getName(),"051018-435", new Object[] {builtin, className, also})
, elt);
        }
        ClassModel info = new ClassModel(className, superclass, this, elt);
        mClassMap.put(className, info);

        if (sInputTextElements.contains(superclassName)) {
            info.isInputText = true;
            info.hasInputText = true;
        } else {
            info.isInputText = superclass.isInputText;
            info.hasInputText = superclass.hasInputText;
        }

        info.supportsTextAttribute = superclass.supportsTextAttribute;

        // Loop over containsElements tags, adding to containment table in classmodel
        Iterator iterator = elt.getChildren().iterator();
        while (iterator.hasNext()) {
            Element child = (Element) iterator.next();
            if (child.getName().equals("containsElements")) {
                    // look for <element>tagname</element> 
                Iterator iter1 = child.getChildren().iterator();
                while (iter1.hasNext()) {
                    Element etag = (Element) iter1.next();
                    if (etag.getName().equals("element")) {
                        String tagname = etag.getText();
                        info.addContainsElement(tagname);
                    } else {
                        throw new CompilationError(
                            "containsElement block must only contain <element> tags", etag);
                    }
                } 
            } else if (child.getName().equals("forbiddenElements")) {
                    // look for <element>tagname</element> 
                Iterator iter1 = child.getChildren().iterator();
                while (iter1.hasNext()) {
                    Element etag = (Element) iter1.next();
                    if (etag.getName().equals("element")) {
                        String tagname = etag.getText();
                        info.addForbiddenElement(tagname);
                    } else {
                        throw new CompilationError(
                            "containsElement block must only contain <element> tags", etag);
                    }
                } 
            }
        }

        // Add in the attribute declarations
        addAttributeDefs(elt, className, attributeDefs, env);
    }

    /**
     * Add this list of attribute name/type info to the in-core model of the class definitions.
     *
     * @param sourceElement the user's LZX source file element that holds class LZX definition 
     * @param classname the class we are defining
     * @param attributeDefs list of AttributeSpec attribute info to add to the Schema
     *
     */
    void addAttributeDefs (Element sourceElement, String classname, List attributeDefs,
                           CompilationEnvironment env)
    {
        if (!attributeDefs.isEmpty()) {
            for (Iterator iter = attributeDefs.iterator(); iter.hasNext();) {
                AttributeSpec attr = (AttributeSpec) iter.next();

                // If this attribute does not already occur someplace
                // in an ancestor, then let's add it to the schema.
                //
                // While we're here, we need to check that we aren't
                // redefining an attribute of a parent class with a
                // different type.

                Type parentType = null;
                if (getClassAttribute(classname, attr.name) != null) {
                    // Check that the overriding type is the same as the superclass' type
                    parentType = getAttributeType(classname, attr.name);

                    // Does the parent attribute definition assert override=true?
                    // If so, we're not going to warn if the types mismatch.
                    AttributeSpec parentAttrSpec = getAttributeSpec(classname, attr.name);
                    boolean forceOverride = parentAttrSpec != null && "true".equals(parentAttrSpec.override);

                    if (!forceOverride &&  (parentType != attr.type)) {
                        // get the parent attribute, so we can see if it says override is allowed

                        env.warn(/* (non-Javadoc)
                                  * @i18n.test
                                  * @org-mes="In class '" + p[0] + "' attribute '" + p[1] + "' with type '" + p[2] + "' is overriding superclass attribute with same name but different type: " + p[3]
                                  */
                            org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ViewSchema.class.getName(),"051018-364", new Object[] {classname, attr.name, attr.type.toString(), parentType.toString()}), 
                            sourceElement);
                    }
                }

                if (attr.type == ViewSchema.METHOD_TYPE && !("true".equals(attr.override))) {
                    checkMethodDeclaration(sourceElement, classname, attr.name, env);
                }

                // Update the in-memory attribute type table
                setAttributeType(sourceElement, classname, attr.name, attr);
            }
        }
    }

    public Type getTypeForName(String name) {
        if (name.equals("text") ||
            name.equals("html"))
            name = "string";
        return super.getTypeForName(name);
    }

    /** Adds a ClassModel entry into the class table for CLASSNAME. */
    private void makeNewStaticClass (String classname) {
        ClassModel info = new ClassModel(classname, this);
        if (sInputTextElements.contains(classname)) {
            info.isInputText = true;
            info.hasInputText = true;
        }
        if (mClassMap.get(classname) == null) {
            mClassMap.put(classname, info);
        } else {
            throw new CompilationError("makeNewStaticClass: `duplicate definition for static class " + classname);
        }
    }


    static Type getAttributeType(String attrName) {
        return (Type) sAttributeTypes.get(attrName);
    }


    /**
     * Returns a value representing the type of an attribute within an
     * XML element. Unknown attributes have Expression type.
     *
     * @param e an Element
     * @param attrName an attribute name
     * @return a value represting the type of the attribute's
     */
    public Type getAttributeType(Element e, String attrName) {
        return getAttributeType(e.getName(), attrName);
    }

    /**
     * Returns a value representing the type of an attribute within an
     * XML element. Unknown attributes have Expression type.
     *
     * @param elt an Element name
     * @param attrName an attribute name
     * @return a value represting the type of the attribute's
     */
    public Type getAttributeType(String elt, String attrName)
        throws UnknownAttributeException
    {
        String elementName = elt.intern();
        // +++ This special-case stuff will go away when the RELAX schema
        // is automatically translated to ViewSchema initialization
        // code.

        if (elementName.equals("canvas")) {
            // override NUMBER_EXPRESSION_TYPE, on view
            if (attrName.equals("width") || attrName.equals("height")) {
                return NUMBER_TYPE;
            }
        }

        Type type = null;

        // Look up attribute in type map for this element
        ClassModel classModel = getClassModel(elementName);
        
        if (classModel != null) {
            try {
                type = classModel.getAttributeTypeOrException(attrName);
            } catch (UnknownAttributeException e) {
                e.setName(attrName);
                e.setElementName(elt);
                throw e;
            }
        } else {
            type = getAttributeType(attrName);
            if (type == null) {
                throw new UnknownAttributeException(elt, attrName);
                //type = EXPRESSION_TYPE;
            }
        }
        return type;
    }



    /**
     * Finds the AttributeSpec definition of an attribute, on a class
     * or by searching up it's parent class chain.
     *
     * @param elt an Element name
     * @param attrName an attribute name
     * @return the AttributeSpec or null
     */
    public AttributeSpec getAttributeSpec(String elt, String attrName)
    {
        String elementName = elt.intern();

        // Look up attribute in type map for this element
        ClassModel classModel = getClassModel(elementName);
        
        if (classModel != null) {
            return classModel.getAttribute(attrName);
        } else {
            return null;
        }
    }

    /**
     * checks whether a method with a given method is allowed to be overridden
     * @param elt an Element name
     * @param methodName a method name
     * @return boolean if the method exists on the class or superclass
     */
    public boolean methodOverrideAllowed(String classname, String methodName)
    {
        AttributeSpec methodspec = getClassAttribute(classname, methodName);
        if (methodspec == null) {
            return true;
        } else {
            return ! ("false".equals(methodspec.override));
        }
    }

    boolean isMouseEventAttribute(String name) {
        return sMouseEventAttributes.contains(name);
    }

    ClassModel getClassModel (String elementName) {
        return (ClassModel) mClassMap.get(elementName);
    }

    public String toLZX() {
      return toLZX("");
    }

    public String toLZX(String indent) {
      String lzx = "";
      for (Iterator i = (new TreeSet(mClassMap.values())).iterator(); i.hasNext(); ) {
        ClassModel model = (ClassModel)i.next();
        if (model.hasNodeModel()) {
          lzx += model.toLZX(indent);
          lzx += "\n";
        }
      }
      return lzx;
    }

    public void loadSchema(CompilationEnvironment env) throws JDOMException, IOException {
        String schemaPath = SCHEMA_PATH;
        // Load the schema if it hasn't been.
        // Reload it if it's been touched, to make it easier for developers.
        while (sCachedSchemaDOM == null ||
               new File(schemaPath).lastModified() != sCachedSchemaLastModified) {
            // using 'while' and reading the timestamp *first* avoids a
            // race condition --- although since this doesn't happen in
            // production code, this isn't critical
            sCachedSchemaLastModified = new File(schemaPath).lastModified();
            sCachedSchemaDOM = new Parser().read(new File(schemaPath));
        }

        // This is the base class from which all classes derive unless otherwise
        // specified. It has no attributes.
        makeNewStaticClass("Object");

        schemaDOM = (Document) sCachedSchemaDOM.clone();
        Element docroot = schemaDOM.getRootElement();
        ToplevelCompiler ec = (ToplevelCompiler) Compiler.getElementCompiler(docroot, env);
        Set visited = new HashSet();
        ec.updateSchema(docroot, this, visited);
        /** From here on, user-defined classes must not use reserved javascript identifiers */
        this.enforceValidIdentifier = true;
    }
    


    /** Check if a child element can legally be contained in a parent element.
        This works with the class hierarchy as follows:

        + Look up the ClassModel corresponding to the parentTag

        + Check the containsElements table to see if child tag is in there

        + If not, look up the ClassModel of the child tag, and follow up the chain
          checking if that name is present in the table


           + If not, ascend up the parent classmodel, and call canContainElement recursively
          
     */
    public boolean canContainElement (String parentTag, String childTag) {
        // Get list of legally nestable tags
        ClassModel parent = getClassModel(parentTag);

        // TODO [hqm 2007-09]: CHECK FOR NULL HERE 

        Set tagset = parent.getContainsSet();
        Set forbidden = parent.getForbiddenSet();

        if (forbidden.contains(childTag)) {
            return false;
        }

        if (tagset.contains(childTag)) {
            return true;
        }
        // check all superclasses of the childTag
        ClassModel childclass = getClassModel(childTag);

        // TODO [hqm 2007-09]: CHECK FOR NULL HERE         

        while (childclass != null) {
            String superclassname = childclass.getSuperclassName();
            if (tagset.contains(superclassname)) {
                return true;
            }
            childclass = childclass.getSuperclassModel();
        }

        String parentSuperclassname = parent.getSuperclassName();
        if (parentSuperclassname != null) {
            return canContainElement(parentSuperclassname, childTag);
        }

        return false;
    }

    
    /** @return true if this element is an input text field */
    boolean isInputTextElement(Element e) {
        String classname = e.getName();
        ClassModel info = getClassModel(classname);
        if (info != null) {
            return info.isInputText;
        }
        return sInputTextElements.contains(classname);
    }

    boolean supportsTextAttribute(Element e) {
        String classname = e.getName();
        ClassModel info = getClassModel(classname);
        if (info != null) {
            return info.supportsTextAttribute;
        } else {
            return false;
        }
    }


    /** @return true if this element content is interpreted as text */
    boolean hasTextContent(Element e) {
        // input text elements can have text
        return isInputTextElement(e) || supportsTextAttribute(e);
    }

    /** @return true if this element's content is HTML. */
    boolean hasHTMLContent(Element e) {
        String name = e.getName().intern();
        // TBD: return sHTMLContentElements.contains(name). Currently
        // uses a blacklist instead of a whitelist because the parser
        // doesn't tell the schema about user-defined classes.
        // XXX Since any view can have a text body, this implementation
        // is actually correct.  That is, blacklist rather than whitelist
        // is the way to go here.
        return name != "class" && name != "method"
            && name != "property" && name != "script"
            && name != "attribute"
            && !isHTMLElement(e) && !isInputTextElement(e);
    }

    /** @return true if this element is an HTML element, that should
     * be included in the text content of an element that tests true
     * with hasHTMLContent. */
    static boolean isHTMLElement(Element e) {
        String name = e.getName();
        return name.equals("a")
            || name.equals("b")
            || name.equals("img")
            || name.equals("br")
            || name.equals("font")
            || name.equals("i")
            || name.equals("p")
            || name.equals("pre")
            || name.equals("u");
    }

    static boolean isDocElement(Element e) {
        String name = e.getName();
        return name.equals("doc");
    }
    
    /* Constants for parsing CSS colors. */
    static final PatternMatcher sMatcher = new Perl5Matcher();
    static final Pattern sRGBPattern;
    static final Pattern sHex3Pattern;
    static final Pattern sHex6Pattern;
    static final HashMap sColorValues = new HashMap();
    static {
        try {
            Perl5Compiler compiler = new Perl5Compiler();
            String s = "\\s*(-?\\d+(?:(?:.\\d*)%)?)\\s*"; // component
            String hexDigit = "[0-9a-fA-F]";
            String hexByte = hexDigit + hexDigit;
            sRGBPattern = compiler.compile(
                "\\s*rgb\\("+s+","+s+","+s+"\\)\\s*");
            sHex3Pattern = compiler.compile(
                "\\s*#\\s*(" + hexDigit + hexDigit + hexDigit + ")\\s*");
            sHex6Pattern = compiler.compile(
                "\\s*#\\s*(" + hexByte + hexByte + hexByte + ")\\s*");
        } catch (MalformedPatternException e) {
            throw new ChainedException(e);
        }

        String[] colorNameValues = {
            "black", "000000", "green", "008000",
            "silver", "C0C0C0", "lime", "00FF00",
            "gray", "808080", "olive", "808000",
            "white", "FFFFFF", "yellow", "FFFF00",
            "maroon", "800000", "navy", "000080",
            "red", "FF0000", "blue", "0000FF",
            "purple", "800080", "teal", "008080",
            "fuchsia", "FF00FF", "aqua", "00FFFF"};
        for (int i = 0; i < colorNameValues.length; ) {
            String name = colorNameValues[i++];
            String value = colorNameValues[i++];
            sColorValues.put(name, new Integer(Integer.parseInt(value, 16)));
        }
    }

    static class ColorFormatException extends RuntimeException {
        ColorFormatException(String message) {
            super(message);
        }
    }
     
    /** Parse according to http://www.w3.org/TR/2001/WD-css3-color-20010305,
     * but also allow 0xXXXXXX */
    public static int parseColor(String str) {
        {
            Object value = sColorValues.get(str);
            if (value != null) {
                return ((Integer) value).intValue();
            }
        }
        if (str.startsWith("0x")) {
            try {
                return Integer.parseInt(str.substring(2), 16);
            } catch (java.lang.NumberFormatException e) {
                // fall through
            }
        }
        if (sMatcher.matches(str, sHex3Pattern)) {
            int r1g1b1 = Integer.parseInt(sMatcher.getMatch().group(1), 16);
            int r = (r1g1b1 >> 8) * 17;
            int g = ((r1g1b1 >> 4) & 0xf) * 17;
            int b = (r1g1b1 & 0xf) * 17;
            return (r << 16) + (g << 8) + b;
        }
        if (sMatcher.matches(str, sHex6Pattern)) {
            return Integer.parseInt(sMatcher.getMatch().group(1), 16);
        }
        if (sMatcher.matches(str, sRGBPattern)) {
            int v = 0;
            for (int i = 0; i < 3; i++) {
                String s = sMatcher.getMatch().group(i+1);
                int c;
                if (s.charAt(s.length()-1) == '%') {
                    s = s.substring(0, s.length()-1);
                    float f = Float.parseFloat(s);
                    c = (int) f * 255 / 100;
                } else {
                    c = Integer.parseInt(s);
                }
                if (c < 0) c = 0;
                if (c > 255) c = 255;
                v = (v << 8) | c;
            }
            return v;
        }
        throw new ColorFormatException(str);
    }
}
