/* ****************************************************************************
 * Schema.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008, 2010 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.xml.internal;
import org.jdom.Element;
import java.util.*;


/**
 * Describes the content model of an XML document.
 *
 * @author Oliver Steele
 * @version 1.0
 */
public abstract class Schema {
    
    /** Hold mapping from Javascript type names to Types */
    protected static Map typeNames = new HashMap();

    /** Represents the type of an attribute whose type isn't known. */
    public static final Type UNKNOWN_TYPE = newType("unknown");

    /** The type of an attribute. */
    public static class Type {
        protected String name;

        public Type(String name) {
            this.name = name;
        }

        public String toString() {
            return name;
        }
    }
    
    /** Returns a unique type.
     * @return a unique type corresponding to typeName
     */
    public static Type newType(String typeName) {
        assert (! typeNames.containsKey(typeName));
        Type newtype = new Type(typeName);
        typeNames.put(typeName, newtype);
        return newtype;
    }

    public static void addTypeAlias(String typeName, Type type) {
        typeNames.put(typeName, type);
    }

    /** An empty Schema, all of whose attribute types are unknown. */
    public static final Schema DEFAULT_SCHEMA =
        new Schema() {
            /** @see Schema */
            public Type getAttributeType(Element element, String name, String allocation) {
                return UNKNOWN_TYPE;
            }
        };
    
    /**
     * Returns a value representing the type of an attribute within an
     * XML element.
     * 
     * @param element an Element
     * @param attributeName an attribute name
     * @return a value represting the type of the attribute's
     */
    public abstract Type getAttributeType(Element element,
                                          String attributeName,
                                          String allocation);
}
