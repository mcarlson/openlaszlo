/* *****************************************************************************
 * ClassNode.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import java.io.*;
import java.util.*;
import org.apache.log4j.*;
import org.jdom.Element;
import org.jdom.output.Format.TextMode;
import org.openlaszlo.xml.internal.XMLUtils;
import org.openlaszlo.xml.internal.MissingAttributeException;
import org.openlaszlo.xml.internal.Schema;
import org.openlaszlo.xml.internal.Schema.Type;
import org.openlaszlo.sc.*;
import org.openlaszlo.utils.ChainedException;
import org.openlaszlo.css.CSSParser;

/** Compiler for <code>class</code> class elements.
 */
class ClassCompiler extends ViewCompiler  {
    /**
       For a declaration of a class named "foobar"
       
       <pre>&lt;class name="foobar" extends="baz" with="mixin1,mixin2"&gt;</pre>

       We are going to call

       <pre>
       LzInstantiateView(
      {
        name: 'class', 
        attrs: {
                parent: "baz", 
                initobj: {
                             name: "foobar",
                             attrs: { extends: "baz",
                                      with: "mixin1,mixin2"" }
                         }
                }
        }
       </pre>
     */
    static final String DEFAULT_SUPERCLASS_NAME = "view";
    
    ClassCompiler(CompilationEnvironment env) {
        super(env);
    }
    
    /** Returns true iff this class applies to this element.
     * @param element an element
     * @return see doc
     */
    static boolean isElement(Element element) {
        return element.getName().equals("class");
    }

    /** Parse out an XML class definition, add the superclass and
     * attribute types to the schema.
     *
     * <p>
     * For each CLASS element, find child ATTRIBUTE tags, and add them
     * to the schema.
     *
     * Also, any EVENT tags will be added to the schema as
     * attributes of type "script".
     */
    void updateSchema(Element element, ViewSchema schema, Set visited) {
        Element elt = element;
        // Get meta attributes
        String classname = elt.getAttributeValue("name");
        String superclass = elt.getAttributeValue("extends");
        // TODO: [2008-03-22 ptw] Need to add all elements of all
        // mixins to the schema for this class
        String mixins = elt.getAttributeValue("with");
        
        if (classname == null ||
            (schema.enforceValidIdentifier && !ScriptCompiler.isIdentifier(classname))) {
            CompilationError cerr = new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="The classname attribute, \"name\" must be a valid identifier for a class definition"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ClassCompiler.class.getName(),"051018-77")
, elt);
            throw(cerr);
        }
        
        if (superclass != null && !ScriptCompiler.isIdentifier(superclass)) {
            mEnv.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="The value for the 'extends' attribute on a class definition must be a valid identifier"
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ClassCompiler.class.getName(),"051018-89")
, elt);
            superclass = null;
        }
        if (superclass == null) {
            // Default to LzView
            superclass = ClassCompiler.DEFAULT_SUPERCLASS_NAME;
        }
        
        ClassModel superclassinfo = schema.getClassModel(superclass);

        if (superclassinfo == null) {

            throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="undefined superclass " + p[0] + " for class " + p[1]
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ClassCompiler.class.getName(),"051018-106", new Object[] {superclass, classname})
, elt);
        }
        
        // Collect up the attribute defs, if any, of this class
        List attributeDefs = new ArrayList();
        Iterator iterator = element.getContent().iterator();
        
        while (iterator.hasNext()) {
            Object o = iterator.next();
            if (o instanceof Element) {
                Element child = (Element) o;
                if (child.getName().equals("method")) {
                    String attrName = child.getAttributeValue("name");
                    String attrEvent = child.getAttributeValue("event");
                    if (attrEvent == null) {
                        if (schema.enforceValidIdentifier) {
                            try {
                                attrName = requireIdentifierAttributeValue(child, "name");
                            } catch (MissingAttributeException e) {
                                throw new CompilationError(
                                    "'name' is a required attribute of <" + child.getName() + "> and must be a valid identifier", child);
                            }
                        }
                        ViewSchema.Type attrType = ViewSchema.METHOD_TYPE;
                        AttributeSpec attrSpec = 
                            new AttributeSpec(attrName, attrType, null, null, child);
                        attrSpec.isfinal = child.getAttributeValue("final");
                        attributeDefs.add(attrSpec);
                    }
                    
                } else if (child.getName().equals("attribute")) {
                // Is this an element named ATTRIBUTE which is a
                // direct child of this CLASS or INTERFACE tag?

                    String attrName = child.getAttributeValue("name");
                    if (schema.enforceValidIdentifier) {
                        try {
                            attrName = requireIdentifierAttributeValue(child, "name");
                        } catch (MissingAttributeException e) {
                            throw new CompilationError(
                                /* (non-Javadoc)
                                 * @i18n.test
                                 * @org-mes="'name' is a required attribute of <" + p[0] + "> and must be a valid identifier"
                                 */
                                org.openlaszlo.i18n.LaszloMessages.getMessage(
                                    ClassCompiler.class.getName(),"051018-131", new Object[] {child.getName()})
                                , child);
                        }
                    }
                    
                    String attrTypeName = child.getAttributeValue("type");
                    String attrDefault = child.getAttributeValue("default");
                    String attrSetter = child.getAttributeValue("setter");
                    String attrRequired = child.getAttributeValue("required");
                    
                    ViewSchema.Type attrType;
                    if (attrTypeName == null) {
                        // Check if this attribute exists in ancestor classes,
                        // and if so, default to that type.
                        attrType = superclassinfo.getAttributeType(attrName);
                        if (attrType == null) {
                            // The default attribute type
                            attrType = ViewSchema.EXPRESSION_TYPE;
                        }
                    } else {
                        attrType = schema.getTypeForName(attrTypeName);
                    }
                    

                    if (attrType == null) {
                        throw new CompilationError(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="In class " + p[0] + " type '" + p[1] + "', declared for attribute '" + p[2] + "' is not a known data type."
 */
            org.openlaszlo.i18n.LaszloMessages.getMessage(
                ClassCompiler.class.getName(),"051018-160", new Object[] {classname, attrTypeName, attrName})
                                , element);
                    }
                    
                    AttributeSpec attrSpec = 
                        new AttributeSpec(attrName, attrType, attrDefault,
                                          attrSetter, child);
                    attrSpec.isfinal = child.getAttributeValue("final");
                    if (attrName.equals("text") && attrTypeName != null) {
                        if ("text".equals(attrTypeName))
                            attrSpec.contentType = attrSpec.TEXT_CONTENT;
                        else if ("html".equals(attrTypeName))
                            attrSpec.contentType = attrSpec.HTML_CONTENT;
                    }
                    attributeDefs.add(attrSpec);
                } else if (child.getName().equals("event")) {
                    String attrName = child.getAttributeValue("name");
                    if (schema.enforceValidIdentifier) {
                        try {
                            attrName = requireIdentifierAttributeValue(child, "name");
                        } catch (MissingAttributeException e) {
                            throw new CompilationError(
                                "'name' is a required attribute of <" + child.getName() + "> and must be a valid identifier", child);
                        }
                    }
                    
                    ViewSchema.Type attrType = ViewSchema.EVENT_HANDLER_TYPE;
                    AttributeSpec attrSpec = 
                        new AttributeSpec(attrName, attrType, null, null, child);
                    attributeDefs.add(attrSpec);
                } else if (child.getName().equals("doc")) {
                    // Ignore documentation nodes
                } 
            }
        }
        
        // Add this class to the schema
        schema.addElement(element, classname, superclass, attributeDefs, mEnv);
    }
    
    public void compile(Element elt) {
        String tagName = elt.getAttributeValue("name");
        ViewSchema schema = mEnv.getSchema();
        if (schema.enforceValidIdentifier) {
            try {
                tagName = requireIdentifierAttributeValue(elt, "name");
            } catch (MissingAttributeException e) {
                throw new CompilationError(
                    /* (non-Javadoc)
                     * @i18n.test
                     * @org-mes="'name' is a required attribute of <" + p[0] + "> and must be a valid identifier"
                     */
                    org.openlaszlo.i18n.LaszloMessages.getMessage(
                        ClassCompiler.class.getName(),"051018-193", new Object[] {elt.getName()})
                    , elt);
            }
        }
        // We compile a class declaration just like a view, and then
        // add attribute declarations and perhaps some other stuff that
        // the runtime wants.
        ClassModel classModel = schema.getClassModel(tagName);
        ViewCompiler.preprocess(elt, mEnv);
        NodeModel model = NodeModel.elementAsModel(elt, schema, mEnv);
        model = model.expandClassDefinitions();
        // Establish class root
        model.assignClassRoot(0);
        classModel.setNodeModel(model);
        classModel.emitClassDeclaration(mEnv);
    }

  protected void compileClass(Element elt, ClassModel classModel, String initobj) {
    // Generate a call to queue instantiation
    String extendsName = XMLUtils.getAttributeValue(
      elt, "extends", DEFAULT_SUPERCLASS_NAME);
    StringBuffer buffer = new StringBuffer();

    if (emitClassDecl) {
        buffer.append("class " + classModel.className +
                      " extends " + extendsName + " {\n" + initobj + "\n}\n");
    }
    else {
        buffer.append(VIEW_INSTANTIATION_FNAME + 
                      "({name: 'class', attrs: " +
                      "{parent: " +
                      ScriptCompiler.quote(extendsName) +
                      ", initobj: " + initobj +
                      "}}" +
                      ", " + ((ElementWithLocationInfo)elt).model.totalSubnodes() +
                      ");\n");
    }
    if (!classModel.getInline()) {
      mEnv.compileScript(buffer.toString(), elt);
    }
    // TODO: [12-27-2002 ows] use the log4j API instead of this property
    boolean tracexml =
      mEnv.getProperties().getProperty("trace.xml", "false") == "true";
    if (tracexml) {
      Logger mXMLLogger = Logger.getLogger("trace.xml");
      mXMLLogger.info("compiling class definition:");
      org.jdom.output.XMLOutputter outputter =
        new org.jdom.output.XMLOutputter();
      outputter.getFormat().setTextMode(TextMode.NORMALIZE);
      mXMLLogger.info(outputter.outputString(elt));
      mXMLLogger.info("compiled to:\n" + buffer.toString() + "\n");
    }
  }
}
