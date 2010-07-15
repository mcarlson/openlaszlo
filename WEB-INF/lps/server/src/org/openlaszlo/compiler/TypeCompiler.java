/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * LZX Types
 */

package org.openlaszlo.compiler;

import org.openlaszlo.xml.internal.XMLUtils;
import org.openlaszlo.xml.internal.Schema;
import org.jdom.Element;

import java.util.*;

/** 
 * Compiler for <code>type</code> elements.
 *
 * A <code>type</code> element defines a new 'presentation type' which
 * can be used as the type of any attribute.  The type must define how
 * to transform the Javascript representation of the type to/from a
 * String (which is how databinding is acheived).
 */
class TypeCompiler extends ClassCompiler {
    TypeCompiler(CompilationEnvironment env) {
        super(env);
    }

    /** Returns true iff this class applies to this element.
     * @param element an element
     * @return see doc
     */
    public static boolean isElement(Element element) {
        return element.getName().equals("type");
    }

    /**
     * Parse the class definition and add the type as a valid type
     */
    void updateSchema(Element element, ViewSchema schema, Set visited) {
        super.updateSchema(element, schema, visited);
        String name = XMLUtils.requireAttributeValue(element, "name");
        schema.defineType(name, element);
    }

    public void compile(Element element) 
        throws CompilationError
    {
        String name = XMLUtils.requireAttributeValue(element, "name");
        super.compile(element);
        // TBD: Enter in type table
        throw new CompilationError("<type> not yet implemented", element);
    }

}

/**
 * @copyright Copyright 2010 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
