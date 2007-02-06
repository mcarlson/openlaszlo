/* *****************************************************************************
 * Parser.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;

import org.openlaszlo.xml.internal.Schema.Type;
import org.jdom.Element;

/** Contains information about an attribute of a laszlo viewsystem class.
 */
class AttributeSpec {
    /** The source Element from which this attribute was parsed */
    Element source = null;
    /** The attribute name */
    String name;
    /** The default value */
    String defaultValue;
    /** The setter function */
    String setter;
    /** The type of the attribute value*/ 
    Type type;
    /** Is this attribute required to instantiate an instance of this class? */
    boolean required = false;
    /** Is this attribute equivalent to element content of a given type? */
    int contentType = NO_CONTENT;

    /** Element content types: */
    static final int NO_CONTENT = 0;
    static final int TEXT_CONTENT = 1;
    static final int HTML_CONTENT = 2;

  private String typeToLZX() {
    switch (contentType) {
      case TEXT_CONTENT:
        return "text";
      case HTML_CONTENT:
        return "html";
      default:
        return type.toString();
    }
  }

  public String toLZX(String indent, ClassModel superclass) {
    AttributeSpec superSpec = superclass.getAttribute(name);
    if (superSpec == null) {
      if (ViewSchema.EVENT_TYPE.equals(type)) {
        return indent + "<event name='" + name + "' />";
      }
      return indent + "<attribute name='" + name + "'" +
        ((defaultValue != null)?(" value='" + defaultValue + "'"):"") +
        ((type != null)?(" type='" + typeToLZX() + "'"):"") +
        (required?(" required='true'"):"") +
        " />";
    } else if (! ViewSchema.EVENT_TYPE.equals(type)) {
      String attrs = "";
      if (defaultValue != null &&
          (! defaultValue.equals(superSpec.defaultValue))) {
        attrs += " value='" + defaultValue + "'";
      }
      if (type != null &&
          (! type.equals(superclass.getAttributeType(name)))) {
        attrs += " type='" + typeToLZX() + "'";
      }
      if (required != superSpec.required) {
        attrs += " required='" + required + "'";
      }
      if (attrs.length() > 0) {
        return  indent + "<attribute name='" + name + "'" + attrs + " />";
      }
    }
    return null;
  }
    
    AttributeSpec (String name, Type type, String defaultValue, String setter, Element source) {
        this.source = source;
        this.name = name;
        this.type = type;
        this.defaultValue = defaultValue;
        this.setter = setter;
    }

    AttributeSpec (String name, Type type, String defaultValue, String setter, boolean required, Element source) {
        this.source = source;
        this.name = name;
        this.type = type;
        this.defaultValue = defaultValue;
        this.setter = setter;
        this.required = required;
    }

    AttributeSpec (String name, Type type, String defaultValue, String setter) {
        this.name = name;
        this.type = type;
        this.defaultValue = defaultValue;
        this.setter = setter;
    }

    AttributeSpec (String name, Type type, String defaultValue, String setter, boolean required) {
        this.name = name;
        this.type = type;
        this.defaultValue = defaultValue;
        this.setter = setter;
        this.required = required;
    }
}
