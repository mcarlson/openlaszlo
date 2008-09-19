/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.test.netsize;

import java.net.*;
import java.io.*;
import java.util.*;

public class TotalSizer extends Sizer {
    public TotalSizer(String name, long prevsize) {
        super(null, name, prevsize);
    }

    public void generateProps(BufferedWriter bw)
        throws IOException
    {
        String namelist = "";
        for (Iterator iter = children.iterator(); iter.hasNext(); ) {
            Sizer child = (Sizer)iter.next();
            if (namelist.length() > 0) {
                namelist += ",";
            }
            namelist += child.name;
        }
        bw.write("apps=" + namelist + "\n");
        bw.write("totalsize=" + totalBytes + "\n");
    }
}
