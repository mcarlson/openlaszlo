/* ****************************************************************************
 * WrapperHeaders.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;
import java.io.*;
import java.util.*;
import org.jdom.Element;
import org.jdom.Namespace;
import org.openlaszlo.server.Configuration;

/** Represents a compiler for a toplevel <code>wrapperheaders</code> element. */
class WrapperHeaders extends ElementCompiler {
    WrapperHeaders(CompilationEnvironment env) {
        super(env);
    }

    static boolean isElement(Element element) {
        return element.getName().equals("wrapperheaders");
    }
    
    // Just annotate the canvas info XML with the <wrapperheaders> tag.
    public void compile(Element element) {
        Element e = (Element) element.clone();
        // Remove the LZX namespace from the elements, but leave any
        // user-specified ones in the content
        Namespace ns = element.getNamespace();
        NodeModel.removeNamespace(e, ns);
        mEnv.getCanvas().setWrapperHeaders(e);
    }
}
