/*****************************************************************************
 * ClassModel.java
 *****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import java.util.*;
import org.jdom.Element;

class ClassModel implements Comparable {
    protected final ViewSchema schema;
    protected final String className;
    // This is null for builtin classes
    protected final ClassModel superclass;
    // This is null for builtin classes
    protected final Element definition;
    protected NodeModel nodeModel;
    
    /* If superclass is a predefined system class, just store its name. */
    protected String superclassName = null;
    protected boolean hasInputText = false;
    protected boolean isInputText = false;
    
    /* Class or superclass has an <attribute type="text"/>  */
    protected boolean supportsTextAttribute = false;
    /** Map attribute name to type */
    protected final Map attributeSpecs = new LinkedHashMap();
    /** Map of method names to arglist */
    protected final Map methods = new LinkedHashMap();
    protected boolean inline = false;
    protected String sortkey = null;

    public String toString() {
        return "ClassModel: className="+className + ", " + 
            "superclass=" + superclass + ", " + 
            "superclassName=" + superclassName + ", " + 
            "hasInputText=" + hasInputText + ", " + 
            "isInputText=" + isInputText + ", " + 
            "definition=" + definition;
    }

    // Construct a user-defined class
    ClassModel(String className, ClassModel superclass,
               ViewSchema schema, Element definition) {
        this.className = className;
        this.superclass = superclass;
        this.definition = definition;
        this.schema = schema;
        this.sortkey = className;
        if (superclass != null) {
          this.sortkey = superclass.sortkey + "." + this.sortkey;
        }
    }

    // Construct a builtin class
    ClassModel(String className, ViewSchema schema) {
        this(className, null, schema, null);
    }

  public int compareTo(Object other) throws ClassCastException {
    ClassModel o = (ClassModel)other;
    int order = this.sortkey.startsWith(o.sortkey) ? +1 : this.sortkey.compareTo(o.sortkey);
    return order;
  }

  public String toLZX() {
    return toLZX("");
  }

  public String toLZX(String indent) {
    String lzx = indent + "<interface name='" + className + "'" +
      ((superclass != null)?(" extends='" + superclass.className +"'"):"") + ">";
    for (Iterator i = attributeSpecs.values().iterator(); i.hasNext(); ) {
      AttributeSpec spec = (AttributeSpec)i.next();
      String specLZX = spec.toLZX(indent + "  ", superclass);
      if (specLZX != null) {
        lzx += "\n";
        lzx += specLZX;
      }
    }
    for (Iterator i = methods.entrySet().iterator(); i.hasNext(); ) {
      Map.Entry entry = (Map.Entry)i.next();
      String name = (String)entry.getKey();
      String arglist = (String)entry.getValue();
      if (superclass.getMethod(name) == null) {
        lzx += "\n" + indent + "  <method name='" + name + "'" + (("".equals(arglist))?"":(" args='" + arglist +"'")) + " />";
      }
    }
    lzx += "\n" + indent + "</interface>";
    return lzx;
  }

    
    /** Returns true if this is equal to or a subclass of
     * superclass. */
    boolean isSubclassOf(ClassModel superclass) {
        if (this == superclass) return true;
        if (this.superclass == null) return false;
        return this.superclass.isSubclassOf(superclass);
    }
    
    boolean isBuiltin() {
        return superclass == null;
    }
    
    boolean hasNodeModel() {
        // Classes that have generated code will have a nodeModel
        return nodeModel != null;
    }

    ClassModel getSuperclassModel() {
        return superclass;
    }
    
    String getSuperclassName() {
        if (superclassName != null) {
            return superclassName; 
        } else if (superclass == null) {
            return null;
        }  else {
            return superclass.className;
        }
    }
    
    /** Return the AttributeSpec for the attribute named attrName.  If
     * the attribute is not defined on this class, look up the
     * superclass chain.
     */
    AttributeSpec getAttribute(String attrName) {
        AttributeSpec attr = (AttributeSpec) attributeSpecs.get(attrName);
        if (attr != null) {
            return attr;
        } else if (superclass != null) {
            return(superclass.getAttribute(attrName));
        } else {
            return null;
        }
    }

    /** Find an attribute name which is similar to attrName, or return
     * null.  Used in compiler warnings. */
    AttributeSpec findSimilarAttribute(String attrName) {
        for (Iterator iter = attributeSpecs.values().iterator(); iter.hasNext();) {
            AttributeSpec attr = (AttributeSpec) iter.next();
            if ((attrName.toLowerCase().equals(attr.name.toLowerCase())) ||
                (attrName.toLowerCase().startsWith(attr.name.toLowerCase())) ||
                (attrName.toLowerCase().endsWith(attr.name.toLowerCase())) ||
                (attr.name.toLowerCase().startsWith(attrName.toLowerCase())) ||
                (attr.name.toLowerCase().endsWith(attrName.toLowerCase()))) {
                return attr;
            }
        }
        // if that didn't work, try the supeclass
        if (superclass == null) {
            return null;
        } else {
            return superclass.findSimilarAttribute(attrName);
        }
    }

    ViewSchema.Type getAttributeTypeOrException(String attrName)
        throws UnknownAttributeException
    {
        AttributeSpec attr = getAttribute(attrName);
        if (attr != null) {
            return attr.type;
        }  
        // If there is no superclass attribute, use the default static
        // attribute map
        ViewSchema.Type type = ViewSchema.getAttributeType(attrName);
        // Last resort, use default of 'expression' type
        if (type == null) {
            throw new UnknownAttributeException();
        }
        return type;
    }
    
    ViewSchema.Type getAttributeType(String attrName) {
        AttributeSpec attr = getAttribute(attrName);
        if (attr != null) {
            return attr.type;
        }  
        // If there is no superclass attribute, use the default static
        // attribute map
        ViewSchema.Type type = ViewSchema.getAttributeType(attrName);
        // Last resort, use default of 'expression' type
        if (type == null) {
            type = ViewSchema.EXPRESSION_TYPE;
        }
        return type;
    }
    
    /** Return the 'MethodSpec' for the method named methName.  If
     * the method is not defined on this class, look up the
     * superclass chain.
     * TODO: [2007-01-27 ptw] For now the MethodSpec is just the
     * arglist String
     */
    String getMethod(String methName) {
        String meth = (String) methods.get(methName);
        if (meth != null) {
            return meth;
        } else if (superclass != null) {
            return(superclass.getMethod(methName));
        } else {
            return null;
        }
    }

    void setNodeModel(NodeModel model) {
        this.nodeModel = model;
    }

    boolean getInline() {
        return inline && nodeModel != null;
    }
    
    void setInline(boolean inline) {
        this.inline = inline;
    }
    
    public static class InlineClassError extends CompilationError {
        public InlineClassError(ClassModel cm, NodeModel im, String message) {
            super(
                "The class " + cm.className + " has been declared " +
                "inline-only but cannot be inlined.  " + message + ". " +
                "Remove " + cm.className + " from the <?lzc class=\"" +
                cm.className + "\"> or " + "<?lzc classes=\"" + cm.className
                + "\"> processing instruction to remove this error.",
                im.element);
        }
    }
    
    protected boolean descendantDefinesAttribute(NodeModel model, String name) {
        for (Iterator iter = model.getChildren().iterator(); iter.hasNext(); ) {
            NodeModel child = (NodeModel) iter.next();
            if (child.hasAttribute(name) || descendantDefinesAttribute(child, name))
                return true;
        }
        return false;
    }
    
    NodeModel applyClass(NodeModel instance) {
        final String DEFAULTPLACEMENT_ATTR_NAME = "defaultPlacement";
        final String PLACEMENT_ATTR_NAME = "placement";
        if (nodeModel == null) throw new RuntimeException("no nodeModel for " + className);
        if (nodeModel.hasAttribute(DEFAULTPLACEMENT_ATTR_NAME))
            throw new InlineClassError(this, instance, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="The class has a " + p[0] + " attribute"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ClassModel.class.getName(),"051018-196", new Object[] {DEFAULTPLACEMENT_ATTR_NAME})
);
        if (instance.hasAttribute(DEFAULTPLACEMENT_ATTR_NAME))
            throw new InlineClassError(this, instance, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="The instance has a " + p[0] + " attribute"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ClassModel.class.getName(),"051018-205", new Object[] {DEFAULTPLACEMENT_ATTR_NAME})
);
        if (descendantDefinesAttribute(instance, PLACEMENT_ATTR_NAME))
            throw new InlineClassError(this, instance, 
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="An element within the instance has a " + p[0] + " attribute"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                ClassModel.class.getName(),"051018-214", new Object[] {PLACEMENT_ATTR_NAME})
);
        
        try {
            // Replace this node by the class model.
            NodeModel model = (NodeModel) nodeModel.clone();
            // Set $classrootdepth on children of the class (but not the
            // instance that it's applied to)
            setChildrenClassRootDepth(model, 1);
            model.updateMembers(instance);
            model.setClassName(getSuperclassName());
            return model;
        } catch (CompilationError e) {
            throw new InlineClassError(this, instance, e.getMessage());
        }
    }
    
    protected void setChildrenClassRootDepth(NodeModel model, int depth) {
        final String CLASSROOTDEPTH_ATTRIBUTE_NAME = "$classrootdepth";
        for (Iterator iter = model.getChildren().iterator(); iter.hasNext(); ) {
            NodeModel child = (NodeModel) iter.next();
            // If it has already been set, this child is the result of
            // a previous inline class expansion with a different
            // classroot.
            if (child.hasAttribute(CLASSROOTDEPTH_ATTRIBUTE_NAME))
                continue;
            child.setAttribute(CLASSROOTDEPTH_ATTRIBUTE_NAME,
                               new Integer(depth));
            int childDepth = depth;
            ClassModel childModel = child.getClassModel();
            // If this is an undefined class, childModel will be null.
            // This is an error, and other code signals a compiler
            // warning. This test keeps it from resulting in a stack
            // trace too.
            if (childModel != null && childModel.isSubclassOf(schema.getClassModel("state")))
                childDepth++;
            setChildrenClassRootDepth(child, childDepth);
        }
    }
}
