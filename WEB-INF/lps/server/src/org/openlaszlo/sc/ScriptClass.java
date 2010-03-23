/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * Javascript Class representation
 *
 * @author ptw@openlaszlo.org
 */

package org.openlaszlo.sc;

import java.util.*;
import org.openlaszlo.utils.StringUtils;

public class ScriptClass {
  String name;
  String kind = null;
  String superclass;
  String[] interfaces;
  Map attributes;
  Map classAttributes;
  String classBody;

  public ScriptClass(String name, String superclass, String[] interfaces, Map attributes, Map classAttributes, String classBody, String kind) {
    this.name = name;
    this.superclass = superclass;
    this.interfaces = interfaces;
    this.attributes = attributes;
    this.classAttributes = classAttributes;
    this.classBody = classBody;
    this.kind = kind;
  }

  public String toString() {
    assert kind != null;
    String extends_str = (superclass != null) ? (" extends " + superclass + " ") : "";
    String implements_str = (interfaces != null) ? (" implements " + StringUtils.join(interfaces, ", ")) : "";

    String modifier ="dynamic ";
    if (kind.equals("mixin")) {
      extends_str = "";
    } else {
      kind = "class";
    }

    // For now we make all user classes dynamic
    String str = modifier + kind + " " + name + extends_str + implements_str + " {\n";
    int n = 1; Map attrs = classAttributes; String prefix = "static ";
    for (; n <= 2; n++, attrs = attributes, prefix = "") {
      for (Iterator i = attrs.entrySet().iterator(); i.hasNext(); ) {
        Map.Entry entry = (Map.Entry)i.next();
        String name = (String)entry.getKey();
        Object value = entry.getValue();
        if (value instanceof Method) {
          Method fn = (Method)value;
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
 * @copyright Copyright 2006-2010 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
