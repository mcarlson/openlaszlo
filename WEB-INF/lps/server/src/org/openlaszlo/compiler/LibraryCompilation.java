/* *****************************************************************************
 * ImportCompiler.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import java.io.*;
import java.util.*;
import org.jdom.Document;
import org.jdom.Element;
/** Holds state needed to queue up a compile of a loadable library
 *
 * @author  Henry Minsky
 */

class LibraryCompilation {
    ImportCompiler  importCompiler;
    File infile;
    String outfile;
    String liburl;
    Element element;

    LibraryCompilation (ImportCompiler ic, File infile, String outfile, String liburl, Element element) {
        this.importCompiler  = ic;
        this.infile = infile;
        this.outfile = outfile;
        this.liburl = liburl;
        this.element = element;
    }

    public String toString () {
        return "[LibraryCompilation: importCompiler="+importCompiler+", infile="+infile+", outfile="+outfile+"]";
    }
}
