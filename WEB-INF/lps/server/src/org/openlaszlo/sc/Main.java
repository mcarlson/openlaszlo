/* *****************************************************************************
 * Main.java
 * ****************************************************************************/

package org.openlaszlo.sc;

public class Main {
    public static void main(String args[])
    {
        int status = new lzsc().compile(args);
        if (status != 0) {
          java.lang.System.exit(status);
        }
    }
}

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/
