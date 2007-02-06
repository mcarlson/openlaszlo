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

  public ScriptClass(String name, String superclass, Map attributes) {
    this.name = name;
    this.superclass = superclass;
    this.attributes = attributes;
  }

  public String toString() {
    String str = "class " + name + (superclass != null?(" extends " + superclass):"") + "{\n";
    for (Iterator i = attributes.entrySet().iterator(); i.hasNext(); ) {
      Map.Entry entry = (Map.Entry)i.next();
      String name = (String)entry.getKey();
      Object value = entry.getValue();
      if (value instanceof Function) {
        Function fn = (Function)value;
        fn.setName(name);
        str += value.toString();
        str += "\n";
      } else {
        str += "var " + name + " = " + value.toString() + ";\n";
      }
    }
    str += "}\n";
    return str;
  }
}

/**
 * @copyright Copyright 2006-2007 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
