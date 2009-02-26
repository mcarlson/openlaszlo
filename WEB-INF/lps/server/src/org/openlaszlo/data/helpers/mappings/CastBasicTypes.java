/* ****************************************************************************
 * JavaDataSource.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data.helpers.mappings;

import java.util.LinkedList;


public class CastBasicTypes {

    /**
     * Returns all allowed Types which can be mapped directly to fields
     * @return
     */
    public static synchronized LinkedList getCompareTypesSimple() {
        LinkedList typeList = new LinkedList();
        
        //Primitives
        typeList.add("String");
        typeList.add("byte");
        typeList.add("int");
        typeList.add("boolean");
        typeList.add("float");
        typeList.add("long");
        typeList.add("double");
        
        
        //Object
        typeList.add("java.lang.String");
        typeList.add("java.lang.Number");
        typeList.add("java.lang.Byte");
        typeList.add("java.lang.Integer");
        typeList.add("java.lang.Boolean");
        typeList.add("java.lang.Float");
        typeList.add("java.lang.Long");
        typeList.add("java.lang.Double");
        typeList.add("java.util.Date");
        
        return typeList;
    }
    
    /**
     * Returns the List-Types which can be mapped to Objects
     * @return
     */
    public static synchronized LinkedList getAllowedListTypes(){
        LinkedList typeList = new LinkedList();
        typeList.add("java.util.LinkedHashMap");
        typeList.add("java.util.HashMap");
        typeList.add("java.util.Hashtable");
        typeList.add("java.util.Map");
        typeList.add("org.red5.io.utils.ObjectMap");
        return typeList;
    }
    
    /**
     * Returns the List-Types which won't be mapped
     * LinkedHashSet is the type of Object if the Client send an Array with numeric index
     * this kind of List cannot be mapped to an Object as it is not clear which field 
     * is equivalent to which index-number
     * @return
     */
    public static synchronized LinkedList getForbiddenListTypes(){
        LinkedList typeList = new LinkedList();
        typeList.add("java.util.LinkedHashSet");
        return typeList;
    }    
    
}
