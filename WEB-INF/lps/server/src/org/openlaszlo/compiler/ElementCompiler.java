/* ****************************************************************************
 * ElementCompiler.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/


package org.openlaszlo.compiler;
import java.io.*;
import java.util.*;
import org.jdom.Element;
import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.xml.internal.MissingAttributeException;


/** Represents a compiler for a specific type of element.
 *
 * @author  Oliver Steele
 */
abstract class ElementCompiler {
    /** The name of the ActionScript function that is called to queue
     * instantiation of a view template.  The name of this function
     * must match the name of the function in the runtime support
     * library. 
     */
    protected static final String VIEW_INSTANTIATION_FNAME = "canvas.LzInstantiateView";
    protected final CompilationEnvironment mEnv;

    ElementCompiler(CompilationEnvironment env) {
        mEnv = env;
    }

    /** Compiles this element within the compilation environment.
     * @param element
     */
    abstract void compile(Element element) throws CompilationError;

    void updateSchema(Element element, ViewSchema schema, Set visited) {
    }

    /** Resolve the src attribute of elt to a file reference.
     * Relative pathnames are resolved relative to the source location
     * for elt. */
    File resolveSrcReference(Element elt) {
        return mEnv.resolveReference(elt);
    }

    /** Returns an element's attribute value, as a String.  Same as
     * Element.getAttributeValue, except guarantees not to return
     * null and guarantees not to return a non-identifier.
     *
     * @param e an Element
     * @param aname the attribute name
     * @return a String
     */
    public static String requireIdentifierAttributeValue(Element e, String aname) {
        String value = e.getAttributeValue(aname);
        if (value == null || !ScriptCompiler.isIdentifier(value)) {
            throw new MissingAttributeException(e, aname);
        }
        return value;
    }
    

    void preprocess(Element elt, CompilationEnvironment env) {
        // no-op, only ViewCompiler needs this method
    }

}
