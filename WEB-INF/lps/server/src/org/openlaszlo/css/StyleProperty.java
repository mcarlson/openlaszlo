/* *****************************************************************************
 * StyleMap.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
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
}
