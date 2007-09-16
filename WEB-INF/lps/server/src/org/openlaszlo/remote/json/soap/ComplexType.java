/* *****************************************************************************
 * ComplexType.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.json.soap;

import java.util.List;
import java.util.Map;
import java.util.Iterator;
import javax.xml.namespace.QName;

/**
 * This class represents a WSDL Schema type.
 */
public class ComplexType
{
    /** Unknown type */
    final static public int TYPE_UNKNOWN = 0;

    /** Simple type */
    final static public int TYPE_SIMPLE = 1;

    /** Struct/Complex type */
    final static public int TYPE_STRUCT = 2;

    /** Array type */
    final static public int TYPE_ARRAY = 3;


    /**
     * The QName of this ComplexType.
     */
    QName mName;

    /**
     * The type of this ComplexType. One of TYPE_UNKNOWN, TYPE_SIMPLE,
     * TYPE_STRUCT, TYPE_ARRAY.
     */
    int mType = TYPE_UNKNOWN;

    /**
     * If mType ==  TYPE_ARRAY, mArrayItemType is set to the actual 
     */
    ComplexType mArrayItemType = null;

    /**
     * Members of struct. Null if this is a simple type or array.
     */
    Map mMembers = null;

    // TODO [2005-05-15 pkang]: find out if we really need this? -pk
    /** The order of the members. Used when order of members matters, as defined
        in WSDL schema. */
    List mMemberSequence = null;

    /**
     * Base of this ComplexType. Null if this is a simple type or a struct that
     * doesn't extend. This should always be set for arrays.
     */
    ComplexType mBase = null;


    /**
     * Constructor to create a simple type.
     * @param name QName of this simple type.
     */
    public ComplexType(QName name) {
        this(name, false);
    }

    /**
     * Constructor to create complex types (structs).
     * @param name QName of this ComplexType.
     * @param members Map of members that belong to this complex type.
     */
    public ComplexType(QName name, Map members) {
        mName = name;
        mType = TYPE_STRUCT;
        setMembers(members);
    }

    /** 
     * Constructor to create arrays or simple type.
     *
     * @param name QName of this ComplexType.
     * @param isArray if true, complex type is array type, else simple type.
     */
    public ComplexType(QName name, boolean isArray) {
        mName = name;
        mType = (isArray ? TYPE_ARRAY : TYPE_SIMPLE);
    }

    /**
     * @return true if this is an array.
     */
    public boolean isArray() {
        return mType == TYPE_ARRAY;
    }

    /**
     * @return true if this is a struct (complex type).
     */
    public boolean isComplex() {
        return mType == TYPE_STRUCT;
    }

    /**
     * @return QName for this complext type.
     */
    public QName getName() {
        return mName;
    }

    /**
     * @return an integer representing the complex type. See TYPE_UNKNOWN,
     * TYPE_SIMPLE, TYPE_STRUCT, TYPE_ARRAY.
     */
    public int getType() {
        return mType;
    }

    /**
     * @return a string representing the complex type. One of simple, struct,
     * array, or unknown.
     */
    public String getTypeString() {
        switch (mType) {
        case TYPE_SIMPLE: return "simple";
        case TYPE_STRUCT: return "struct";
        case TYPE_ARRAY: return "array";
        default: 
            return "unknown";
        }
    }

    /**
     * @return QName for array type.
     */
    public QName getArrayItemTypeQName() {
        return mArrayItemType != null ? mArrayItemType.getName() : null;
    }

    /**
     * @return map of complex type members; null for arrays or simple types.
     */
    public Map getMembers() {
        return mMembers;
    }

    /**
     * Set the base type for this complex type. Should always be called by
     * arrays or for complex types that extend a base type.
     */
    public void setBase(ComplexType base) {
        mBase = base;
    }

    /**
     * @return the base type. For arrays, it will be always be soapenc:Array
     * (soapenc namespace may vary). Simple types and complex types that don't
     * extend will return null
     */
    public ComplexType getBase() {
        return mBase;
    }

    /**
     * @return the item type for this array, or null if this isn't an array.
     */
    public ComplexType getArrayItemType() {
        return mArrayItemType;
    }

    /**
     * This should only be called by array types.
     * @param arrayItemType item type of array.
     */
    public void setArrayItemType(ComplexType arrayItemType) {
        mArrayItemType = arrayItemType;
    }


    /**
     * @param members values of members are QName.
     */
    public void setMembers(Map members) {
        mMembers = members;
    }

    /**
     * @param members values of members are QName.
     * @param sequence order of members.
     */
    public void setMembers(Map members, List sequence) {
        mMembers = members;
        mMemberSequence = sequence;
    }


    /**
     * Appends member information to buffer.
     */
    void toMembersXML(StringBuffer sb) {
        if (mMembers != null) {
            sb.append("<members");
            if (mBase != null) {
                sb.append(" extends=\"").append(mBase.mName).append("\"");
            }
            sb.append(">");

            Iterator iter = mMembers.entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry)iter.next();
                String key = (String)entry.getKey();
                QName qname =(QName)entry.getValue();
                sb.append("<member")
                    .append(" name=\"").append(key).append("\"")
                    .append(" type=\"").append(qname).append("\"")
                    .append("/>");
            }

            sb.append("</members>");
        }
    }


    /**
     * Append XML ComplexType information to buffer.
     */
    public void toXML(StringBuffer sb) {
        sb.append("<complex-type")
            .append(" name=\"").append(mName).append("\"")
            .append(" type=\"").append(getTypeString()).append("\"")
            .append(" base=\"").append(mBase == null ? "" : mBase.mName.toString()).append("\"");
        if (mType == TYPE_ARRAY) {
            sb.append(" array-type=\"").append(mArrayItemType.getName()).append("\"");
        }
        sb.append(">");
        toMembersXML(sb);
        sb.append("</complex-type>");
    }
}
