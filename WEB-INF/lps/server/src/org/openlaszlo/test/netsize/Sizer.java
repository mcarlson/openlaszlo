/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.test.netsize;

import java.net.*;
import java.io.*;
import java.text.NumberFormat;
import java.util.*;

public abstract class Sizer {
    long totalBytes = 0;
    Sizer parent;
    List children = new ArrayList();
    String name;
    long prevsize;

    public Sizer(Sizer parent, String name, long prevsize) {
        this.parent = parent;
        this.name = name;
        this.prevsize = prevsize;
        if (parent != null) {
            this.parent.children.add(this);
        }
    }
    
    void addSize(long n) {
        totalBytes += n;
        if (parent != null) {
            parent.addSize(n);
        }
    }

    public void connect()
        throws IOException
    {
        for (Iterator iter = children.iterator(); iter.hasNext(); ) {
            Sizer child = (Sizer)iter.next();
            child.connect();
        }
    }

    void report(String prefix) {
        String pctstr = "";
        if (prevsize > 0) {
            NumberFormat format = NumberFormat.getPercentInstance();
            double pct = (double)totalBytes / prevsize;
            pctstr = " (" + format.format(pct) + ")";
        }
        System.out.println(prefix + name + ": " + totalBytes + pctstr);
        for (Iterator iter = children.iterator(); iter.hasNext(); ) {
            Sizer child = (Sizer)iter.next();
            child.report(prefix + "  ");
        }
    }

    void report() {
        report("");
    }

    void generatePropertiesFile(BufferedWriter bw)
        throws IOException
    {
        generateProps(bw);
        for (Iterator iter = children.iterator(); iter.hasNext(); ) {
            Sizer child = (Sizer)iter.next();
            child.generatePropertiesFile(bw);
        }
    }

    public abstract void generateProps(BufferedWriter bw)
        throws IOException;
}
