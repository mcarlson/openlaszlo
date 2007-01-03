/* *****************************************************************************
 * StyleMap.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.css;


public class StyleProperty {
    public StyleProperty(String value, boolean important) {
        this.value = value;
        this.important = important;
    }
    public String value;
    public boolean important;
    public Specificity specificity = null;

  // This supports ScriptCompiler.writeObject
  public String toString() {
    if (important) {
      // TODO: [2007-01-02 ptw] How do we want to represent important
      // in JS?  For now, we make a string...
      return "\"" + value + " !\"";
    } else {
      // Otherwise, we return the value unquoted.  See CSSHandler,
      // which quotes string and url literals.
      return value;
    }
  }
}
