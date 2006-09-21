/* *****************************************************************************
 * Rule.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.css;

import java.util.*;
import org.w3c.css.sac.*;


public class Rule {
    public Rule(Selector selector, Map styleMap) {
        this.mSelector = selector;
        this.mStyleMap = styleMap;
        // specificity for rule is set when match() is called.
        this.mSpecificity = new Specificity();
    }

    Selector    mSelector;
    Map         mStyleMap;
    Specificity mSpecificity;

    public Selector    getSelector()    { return mSelector; }
    public Map         getStyleMap()    { return mStyleMap; }
    public Specificity getSpecificity() { return mSpecificity; }

    /**
     * @return 0 if this is equal, -1 if this is less, +1 if this is
     * greater.
     */
    int compare(Rule rule) {
        return this.mSpecificity.compare(rule.mSpecificity);
    }
}
