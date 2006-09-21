/* *****************************************************************************
 * Specificity.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.css;

public class Specificity {
    final static int SPECIFICITY_ID        = 0;
    final static int SPECIFICITY_ATTRIBUTE = 1;
    final static int SPECIFICITY_ELEMENT   = 2;

    int[] mSpecificity = { 0, 0, 0 };

    public void incID() {
        ++mSpecificity[SPECIFICITY_ID];
    }
    public void incAttribute() { 
        ++mSpecificity[SPECIFICITY_ATTRIBUTE]; 
    }
    public void incElement() {
        ++mSpecificity[SPECIFICITY_ELEMENT];
    }
    public void reset() {
        mSpecificity[SPECIFICITY_ID] = 0;
        mSpecificity[SPECIFICITY_ATTRIBUTE] = 0;
        mSpecificity[SPECIFICITY_ELEMENT] = 0;
    }


    /**
     * @return 0 if this is equal, -1 if this is less, +1 if this is
     * greater.
     */
    int compare(Specificity specificity) {
        int diff;

        diff = this.mSpecificity[SPECIFICITY_ID] 
            - specificity.mSpecificity[SPECIFICITY_ID];
        if (diff != 0) return diff < 0 ? -1 : +1;

        diff = this.mSpecificity[SPECIFICITY_ATTRIBUTE] 
            - specificity.mSpecificity[SPECIFICITY_ATTRIBUTE];
        if (diff != 0) return diff < 0 ? -1 : +1;

        diff = this.mSpecificity[SPECIFICITY_ELEMENT] 
            - specificity.mSpecificity[SPECIFICITY_ELEMENT];
        if (diff != 0) return diff < 0 ? -1 : +1;

        return 0;
    }
}
