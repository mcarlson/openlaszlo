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

    /**
     * Check that the 'allocation' attribute of a tag is either "instance" or "class".
     * The return value defaults to "instance".
     * @param element a method or attribute element
     * @return an AttributeSpec allocation type (either 'instance' or 'class')
     */
    String getAllocation(Element element) {
        // allocation type defaults to 'instance'
        String allocation = element.getAttributeValue("allocation");
        if (allocation == null) {
            allocation = NodeModel.ALLOCATION_INSTANCE;
        } else if (!(allocation.equals(NodeModel.ALLOCATION_INSTANCE) ||
                     allocation.equals(NodeModel.ALLOCATION_CLASS))) {
          throw new CompilationError(
              "the value of the 'allocation' attribute must be either 'instance', or 'class'" , element);
        }
        return allocation;

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
        super.updateSchema(element, schema, visited);
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
                        String allocation = getAllocation(child);
                        ViewSchema.Type attrType = ViewSchema.METHOD_TYPE;
                        AttributeSpec attrSpec = 
                            new AttributeSpec(attrName, attrType, null, null, child);
                        attrSpec.isfinal = child.getAttributeValue("final");
                        attrSpec.allocation = allocation;
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
                    String allocation = getAllocation(child);
                    
                    ViewSchema.Type attrType;
                    if (attrTypeName == null) {
                        // Check if this attribute exists in ancestor classes,
                        // and if so, default to that type.
                        attrType = superclassinfo.getAttributeType(attrName, allocation);
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
                    attrSpec.allocation = allocation;
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
      ClassModel classModel = mEnv.getSchema().getClassModel(tagName);
      // May have already been compiled by a forward reference
      if (! classModel.isCompiled()) {
        classModel.compile(mEnv);
      }
    }
}
