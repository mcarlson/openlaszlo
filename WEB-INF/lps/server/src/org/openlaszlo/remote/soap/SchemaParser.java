/* *****************************************************************************
 * SchemaParser.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.soap;

import java.util.*;
import java.io.*;
import javax.xml.rpc.*;
import javax.xml.parsers.*;
import javax.xml.namespace.*;
import org.w3c.dom.*;
import org.xml.sax.*;
import org.apache.axis.Constants;

import org.apache.log4j.Logger;

import org.apache.axis.utils.*;


public class SchemaParser
{
    public static Logger mLogger = Logger.getLogger(SchemaParser.class);

    static final int ARRAY = 0;
    static final int REGULAR_OBJECT = 1;
    static final int SEQUENCED_OBJECT = 2;

    /** don't support for now 
    static final int EXTENDED_OBJECT = 3; // object with <xsd:extention>
    **/

    // Contains a list of complex types that extend from types not yet defined
    // in the schema. Once base complex type is found, subclasses are assigned
    // the complex type objects.
    Map mBaseForwardTypeMap;
    Map mArrayForwardTypeMap;

    Map mComplexTypeMap;

    // Values which are set when WSDLParser is passed in.
    String mNamespaceURI_SOAP_ENC;
    String mNamespaceURI_SCHEMA_XSD;
    String mNamespaceURI_WSDL;
    String mTargetNamespaceURI;

    QName mSOAPEncodingArray;
    QName mSOAPEncodingArrayType;

    Element mSchema;

    /**
     * @param wp parsed WSDLParser
     * @param schema element representing schema element
     */
    public SchemaParser(WSDLParser wp, Element schema) {

        mNamespaceURI_SCHEMA_XSD = wp.mNamespaceURI_SCHEMA_XSD;
        mNamespaceURI_SOAP_ENC = wp.mNamespaceURI_SOAP_ENC;
        mNamespaceURI_WSDL = wp.mNamespaceURI_WSDL;

        mSOAPEncodingArray = new QName(mNamespaceURI_SOAP_ENC, "Array");
        mSOAPEncodingArrayType = new QName(mNamespaceURI_SOAP_ENC, "arrayType");

        // set the target element here.
        mTargetNamespaceURI = schema.getAttribute("targetNamespace");

        mBaseForwardTypeMap = new HashMap();
        mArrayForwardTypeMap = new HashMap();

        mSchema = schema;

        if (mLogger.isDebugEnabled()) {
            mLogger.debug("mNamespaceURI_SCHEMA_XSD: " + mNamespaceURI_SCHEMA_XSD);
            mLogger.debug("mNamespaceURI_SOAP_ENC: " + mNamespaceURI_SOAP_ENC);
            mLogger.debug("mNamespaceURI_WSDL_SOAP: " + mNamespaceURI_WSDL);
            mLogger.debug("mSOAPEncodingArray: " + mSOAPEncodingArray);
            mLogger.debug("mSOAPEncodingArrayType: " + mSOAPEncodingArrayType);
            mLogger.debug("mTargetNamespaceURI: " + mTargetNamespaceURI);
        }
    }

    /**
     * @param complexTypeMap map where ComplexType objects will be stored.
     */
    public void parse(Map complexTypeMap) { 

        // save it so we can use it for checkExtension
        mComplexTypeMap = complexTypeMap;

        // just get the complex types
        NodeList list = mSchema.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "complexType");

        for (int i=0; i < list.getLength(); i++) {
            try {
                ComplexType so = getComplexType((Element)list.item(i));
                if (so != null) {
                    fixBaseForwardRefs(so);
                    fixArrayForwardRefs(so);
                    complexTypeMap.put(so.getName(), so);
                } else {
                    mLogger.warn("skipping: " + list.item(i));
                }
            } catch (Exception e) {
                mLogger.error("skipping complexType: " + e.getMessage(), e);
            }
        }

        if (mBaseForwardTypeMap.size() != 0) {
            mLogger.warn("The following base classes were not defined:");
            Iterator iter = mBaseForwardTypeMap.keySet().iterator();
            while (iter.hasNext()) {
                QName baseQName = (QName)iter.next();
                mLogger.warn("    " + baseQName);
            }
        }
    }

    /**
     * Checks to see if object was referred by other types earlier in the
     * schema. If so, set their base class to baseType.
     */
    void fixBaseForwardRefs(ComplexType baseType) {
        QName baseQName = baseType.getName();
        Vector list = (Vector)mBaseForwardTypeMap.get(baseQName);
        if (list == null) return;
        for (int i=0; i < list.size(); i++) {
            ComplexType ct = (ComplexType)list.get(i);
            ct.setBase(baseType);
        }
        mBaseForwardTypeMap.remove(baseQName);
    }

    /**
     * Checks to see if object was referred by other types earlier in the
     * schema. If so, set their base class to baseType.
     */
    void fixArrayForwardRefs(ComplexType arrayItemType) {
        QName arrayQName = arrayItemType.getName();
        Vector list = (Vector)mArrayForwardTypeMap.get(arrayQName);
        if (list == null) return;
        for (int i=0; i < list.size(); i++) {
            ComplexType ct = (ComplexType)list.get(i);
            ct.setArrayItemType(arrayItemType);
        }
        mArrayForwardTypeMap.remove(arrayQName);
    }

    /** 
     * Set the base type object for complex type, if it exists. Otherwise, mark
     * base type forward ref.
     * @param baseQName the qname for the base type.
     * @param ct the complex type object that extends from baseQName.
     */
    void setBaseType(QName baseQName, ComplexType ct) {
        ComplexType baseType = (ComplexType)mComplexTypeMap.get(baseQName);
        if (baseType == null) {
            // place soap enc type in map. Set actual soap enc for arrays.
            if (Constants.isSOAP_ENC(baseQName.getNamespaceURI()) ) {
                baseType = new ComplexType(baseQName);
                mComplexTypeMap.put(baseQName, baseType);
                ct.setBase(baseType);
            } else {
                Vector list = (Vector)mBaseForwardTypeMap.get(baseQName);
                if (list == null) { 
                    list = new Vector();
                    mBaseForwardTypeMap.put(baseQName, list);
                }
                list.add(ct);
            }
        } else {
            ct.setBase(baseType);
        }
    }

    /** 
     * Set the aray type object for array type, if it exists. Otherwise, mark
     * array type forward ref.
     * @param arrayQName the qname for the array type.
     * @param ct the complex type object that is an array.
     */
    void setArrayItemType(QName arrayQName, ComplexType ct) {
        ComplexType arrayItemType = (ComplexType)mComplexTypeMap.get(arrayQName);
        if (arrayItemType == null) {
            // place simple type in map
            if (Constants.isSchemaXSD(arrayQName.getNamespaceURI()) ) {
                arrayItemType = new ComplexType(arrayQName);
                mComplexTypeMap.put(arrayQName, arrayItemType);
                ct.setArrayItemType(arrayItemType);
            } else {
                // set forward ref 
                Vector list = (Vector)mArrayForwardTypeMap.get(arrayQName);
                if (list == null) { 
                    list = new Vector();
                    mArrayForwardTypeMap.put(arrayQName, list);
                }
                list.add(ct);
            }

        } else {
            ct.setArrayItemType(arrayItemType);
        }
    }

    ComplexType getComplexType(Element ct) throws Exception {
        String name = ct.getAttribute("name");

        NodeList list;
        list = ct.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "complexContent");
        if (foundOne(list)) {
            // check for array in elements inside of <complexContent>
            return checkComplexContent(name, (Element)list.item(0));
        }

        list = ct.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "all");
        if (foundOne(list)) {
            // get values inside <all> element
            return checkAllOrSequence(name, (Element)list.item(0));
        }

        list = ct.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "sequence");
        if (foundOne(list)) {
            // get values inside <sequence> element
            return checkAllOrSequence(name, (Element)list.item(0));
        }

        mLogger.warn("no <complexContent>, <all>, or <sequence> nodes found under <complexType>");
        return null;
    }


    /**
     * Currently, just checks to see if complex content is an array. Anything
     * else will throw an exception.
     */
    ComplexType checkComplexContent(String name, Element cc) throws Exception {
        if (mLogger.isDebugEnabled()) {
            mLogger.debug("checkComplexContent: " + name + ", " + cc);
        }

        NodeList list;
        list = cc.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "restriction");
        if (foundOne(list)) {
            return checkRestriction(name, (Element)list.item(0));             
        }

        list = cc.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "extension");
        if (foundOne(list)) {
            return checkExtension(name, (Element)list.item(0));
        }

        // <restriction> and <extension> ony supported in <complexContent>
        mLogger.warn("No <restriction> or <extension> tags were found inside of <complexContent>");
        return null;
    }

    /**
     * 
     */
    ComplexType checkExtension(String name, Element extension) throws Exception {
        NodeList list;
        ComplexType ct = null;
        list = extension.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "all");
        if (foundOne(list)) {
            // get values inside <all> element
            ct = checkAllOrSequence(name, (Element)list.item(0));
        }

        list = extension.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "sequence");
        if (foundOne(list)) {
            // get values inside <sequence> element
            ct = checkAllOrSequence(name, (Element)list.item(0));
        }

        if (ct == null) {
            mLogger.warn("no <all> or <sequence> nodes found under <extension>");
            return null;
        }

        String base = extension.getAttribute("base");
        if (base == null || base.equals("")) {
            throw new Exception("no base attribute found in <extension>");
        }

        QName baseQName = XMLUtils.getQNameFromString(base, extension);
        setBaseType(baseQName, ct);
        return ct;
    }

    /**
     * Assume <restriction> in <complexContent> means array (for now).
     */
    ComplexType checkRestriction(String name, Element restriction) throws Exception {
        String base = restriction.getAttribute("base");
        if (base == null || base.equals("")) {
            throw new Exception("no base attribute found in <restriction>");
        }

        QName baseQName = XMLUtils.getQNameFromString(base, restriction);
        if (! mSOAPEncodingArray.equals(baseQName)) {
            throw new Exception("only arrays are supported in <restriction>, instead found "
                                + baseQName);
        }

        // now try to get type of array from <attribute> element in
        // <restriction>
        NodeList list = restriction.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "attribute");
        if (! foundOne(list)) {
            // FIXME
            // XXX this is not necessarily true...I think we can assume anyType
            // array if attribute is missing. Fix this later.
            throw new Exception("expecting only one attribute inside <restriction base=\"soapenc:Array\">");
        }

        Element attributeElement = (Element)list.item(0);
        String ref = attributeElement.getAttribute("ref");

        String arrayItemType = attributeElement.getAttributeNS(mNamespaceURI_WSDL, "arrayType");

        if (ref.equals("")) {
            throw new Exception("empty ref attribute in <attribute> inside of <restriction> for <complexType> named " + name);
        }

        if (arrayItemType.equals("")) {
            throw new Exception("empty ref attribute in <attribute> inside of <restriction> for <complexType> named " + name);
        }

        QName refQName = XMLUtils.getQNameFromString(ref, attributeElement);
        if (! mSOAPEncodingArrayType.equals(refQName)) {
            throw new Exception("ref attribute in <attribute> inside of <restriction> does not refer to SOAP-ENC array");
        }

        String type = removeBrackets(arrayItemType);
        QName typeQName = XMLUtils.getQNameFromString(type, attributeElement);
        
        // array complex type
        ComplexType ct = new ComplexType(new QName(mTargetNamespaceURI, name), true);
        setArrayItemType(typeQName, ct); 
        setBaseType(baseQName, ct);
        return ct;
    }


    /**
     * Get arrayItemType without brackets to just get type.
     */
    String removeBrackets(String arrayItemType) {
        int index = arrayItemType.indexOf('[');
        if (index == -1) {
            return arrayItemType;
        }
        return arrayItemType.substring(0, index);
    }


    /**
     * Check for elements inside <all> or sequence. All elements must have a type
     * attribute. We don't support anonymous types.
     */
    ComplexType checkAllOrSequence(String name, Element node) throws Exception {
        if (mLogger.isDebugEnabled()) {
            mLogger.debug("checkAllOrSequence: " + name + ", " + node);
        }

        String tag = node.getTagName();
        Map members = new HashMap();
        NodeList list = node.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, "element");
        for (int i=0; i < list.getLength(); i++) {
            Element element = (Element)list.item(i);
            String elRef = element.getAttribute("ref");
            String elName = element.getAttribute("name");
            String elType = element.getAttribute("type");
            if (! elRef.equals("")) {
                mLogger.warn("!!! skipping element #" + (i+1) + " !!! " +
                             "references ignored");
                continue;
            } else {
                if (elName.equals("")) {
                    mLogger.warn("!!! skipping element #" + (i+1) + " !!! " +
                                 "name attribute missing in inside <" + tag +
                                 ">: " + node);
                    continue;
                } 
                if (elType.equals("")) {
                    mLogger.warn("!!! skipping element #" + (i+1) + " !!! " +
                                 "type attribute missing inside <" + tag +
                                 ">: " + node + "(anonymous types not supported)");
                    continue;
                }
            }
            QName elTypeQName = XMLUtils.getQNameFromString(elType, element);
            members.put(elName, elTypeQName);
        }

        // struct complex type
        return new ComplexType(new QName(mTargetNamespaceURI, name), members);
    }


    /**
     * See if complexType element was found.
     */
    boolean foundOne(NodeList list) {
        return list.getLength() == 1;
    }
}
