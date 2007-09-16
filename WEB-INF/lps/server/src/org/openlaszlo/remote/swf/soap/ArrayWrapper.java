/* *****************************************************************************
 * ArrayWrapper.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.swf.soap;

import java.util.ArrayList;
import java.util.Collection;
import org.w3c.dom.Element;

// extend from a Collection to fool Axis into believing array schema types can
// deserialize into this object.
public class ArrayWrapper {
    Element mElement;
    ComplexType mType;

    public ArrayWrapper(Element element, ComplexType type) {
        mElement = element;
        mType = type;
    }

    public Element getElement() {
        return mElement;
    }

    public ComplexType getType() {
        return mType;
    }
}
