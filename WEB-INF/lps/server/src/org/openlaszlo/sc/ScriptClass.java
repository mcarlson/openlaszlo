/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * Javascript Class representation
 *
 * @author ptw@openlaszlo.org
 */

package org.openlaszlo.sc;

import java.util.*;

public class ScriptClass {
  String name;
  String superclass;
  Map attributes;
  Map classAttributes;
  String classBody;

  public ScriptClass(String name, String superclass, Map attributes, Map classAttributes, String classBody) {
    this.name = name;
    this.superclass = superclass;
    this.attributes = attributes;
    this.classAttributes = classAttributes;
    this.classBody = classBody;
  }

  public String toString() {
    String str = "class " + name + (superclass != null?(" extends " + superclass + " "):"") + "{\n";
    int n = 1; Map attrs = classAttributes; String prefix = "static ";
    for (; n <= 2; n++, attrs = attributes, prefix = "") {
      for (Iterator i = attrs.entrySet().iterator(); i.hasNext(); ) {
        Map.Entry entry = (Map.Entry)i.next();
        String name = (String)entry.getKey();
        Object value = entry.getValue();
        if (value instanceof Function) {
          Function fn = (Function)value;
          fn.setName(name);
          str += prefix + value.toString();
          str += "\n";
        } else if (value != null) {
          str += prefix + "var " + name + " = " + ScriptCompiler.objectAsJavascript(value) + ";\n";
        } else {
          str += prefix + "var " + name + ";\n";
        }
      }
    }
    str += classBody;
    str += "}\n";
    return str;
  }
}

/**
 * @copyright Copyright 2006-2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
