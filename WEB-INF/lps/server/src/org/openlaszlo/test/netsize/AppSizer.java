/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.test.netsize;

import java.net.*;
import java.io.*;
import java.util.*;

public class AppSizer extends Sizer {
    public AppSizer(TotalSizer parent, String name, long prevsize) {
        super(parent, name, prevsize);
    }

    public void generateProps(BufferedWriter bw)
        throws IOException
    {
        bw.write("\n");
        bw.write(name + ".size=" + totalBytes + "\n");
    }

    public int getChildIndex(UrlSizer url) {
        int count = 1;
        for (Iterator iter = children.iterator(); iter.hasNext(); ) {
            Sizer child = (Sizer)iter.next();
            if (child == url) {
                return count;
            }
            count++;
        }
        return -1;
    }
}

