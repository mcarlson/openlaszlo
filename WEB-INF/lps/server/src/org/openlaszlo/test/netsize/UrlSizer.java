/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.test.netsize;

import java.net.*;
import java.io.*;
import java.util.*;

public class UrlSizer extends Sizer {
    String urlbase;
    String pfx;
    String path;
    boolean verbose;
    AppSizer app;
    boolean ignoreErrors;

    public UrlSizer(AppSizer parent, String urlbase, String pfx, String path, boolean verbose, long oldsize, boolean ignoreErrors) {
        super(parent, urlbase + "/" + pfx + "/" + path, oldsize);
        this.app = parent;
        this.urlbase = urlbase;
        this.pfx = pfx;
        this.path = path;
        this.verbose = verbose;
        this.ignoreErrors = ignoreErrors;
    }

    public void connect()
        throws IOException
    {
        String urlstr = urlbase + "/" + pfx + "/" + path;
        URL url = new URL(urlstr);
        if (verbose) {
            System.out.println("opening: " + url);
        }
        URLConnection uc = url.openConnection();
        uc.setRequestProperty( "Accept-Encoding", "gzip");
        BufferedReader in = null;

        try {
            in = new BufferedReader(new InputStreamReader(uc.getInputStream()));
        }
        catch (IOException ioe) {
            if (ignoreErrors) {
                System.err.println("error connecting to: " + urlstr);
            }
            else {
                throw ioe;
            }
        }

        if (in != null) {
            long total = 0;
            char[] buf = new char[8192];
            int nbytes;
            while ((nbytes = in.read(buf, 0, buf.length)) >= 0) {
                if ((new String(buf, 0, nbytes)).indexOf("HTTP Status 404") >= 0) {
                    if (ignoreErrors) {
                        System.err.println("error response for: " + urlstr);
                        break;
                    }
                    // TODO: look for http errors more directly.
                    throw new IOException(urlstr + ": not found on server");
                }
                total += nbytes;
            }
            if (verbose) {
                System.out.println("got: " + total + " bytes");
            }
            addSize(total);
        }
    }

    public void generateProps(BufferedWriter bw)
        throws IOException
    {
        int idx = app.getChildIndex(this);
        String appnm = app.name;
        bw.write(appnm + "." + idx + ".path=" + path + "\n");
        bw.write(appnm + "." + idx + ".size=" + totalBytes + "\n");
    }
}
