/* *****************************************************************************
 * LZArraySerializer.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/


/*
 * The Apache Software License, Version 1.1
 *
 *
 * Copyright (c) 2001-2003 The Apache Software Foundation.  All rights
 * reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.
 *
 * 3. The end-user documentation included with the redistribution,
 *    if any, must include the following acknowledgment:
 *       "This product includes software developed by the
 *        Apache Software Foundation (http://www.apache.org/)."
 *    Alternately, this acknowledgment may appear in the software itself,
 *    if and wherever such third-party acknowledgments normally appear.
 *
 * 4. The names "Axis" and "Apache Software Foundation" must
 *    not be used to endorse or promote products derived from this
 *    software without prior written permission. For written
 *    permission, please contact apache@apache.org.
 *
 * 5. Products derived from this software may not be called "Apache",
 *    nor may "Apache" appear in their name, without prior written
 *    permission of the Apache Software Foundation.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE APACHE SOFTWARE FOUNDATION OR
 * ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 * ====================================================================
 *
 * This software consists of voluntary contributions made by many
 * individuals on behalf of the Apache Software Foundation.  For more
 * information on the Apache Software Foundation, please see
 * <http://www.apache.org/>.
 */

package org.openlaszlo.remote.swf.soap.encoding;

import javax.xml.namespace.QName;
import java.io.IOException;
import org.apache.axis.encoding.SerializationContext;
import org.apache.axis.encoding.Serializer;
import org.apache.axis.wsdl.fromJava.Types;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.Attributes;
import org.apache.log4j.Logger;
import org.openlaszlo.remote.swf.soap.ArrayWrapper;
import org.xml.sax.helpers.AttributesImpl;
import java.util.ArrayList;
import org.openlaszlo.remote.swf.soap.*;
import org.apache.axis.MessageContext;
import org.apache.axis.schema.SchemaVersion;
import org.apache.axis.soap.SOAPConstants;
import org.apache.axis.Constants;

public class LZArraySerializer implements Serializer {

    private static Logger mLogger = Logger.getLogger(LZArraySerializer.class);

    public static String MECHANISM_TYPE = "LZArrayMechanism";

    public String getMechanismType() { return MECHANISM_TYPE; }

    public void serialize(QName name, Attributes attributes,
                          Object value, SerializationContext context)
        throws IOException
    {
        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="serialize(" + p[0] + "," + p[1] + "," + p[2] + "," + p[3] + ")"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZArraySerializer.class.getName(),"051018-104", new Object[] {name, attributes, value, context})
        );
        // Alot of this code copied from
        // org.apache.axis.encoding.ser.ArraySerializer

        MessageContext msgContext = context.getMessageContext();
        SchemaVersion schema = SchemaVersion.SCHEMA_2001;
        SOAPConstants soap = SOAPConstants.SOAP11_CONSTANTS;
        boolean encoded = true;
        if (msgContext != null) {
            encoded = msgContext.isEncoded();
            schema = msgContext.getSchemaVersion();
            soap = msgContext.getSOAPConstants();
        }

        ArrayWrapper aw = (ArrayWrapper)((ArrayList)value).get(0);
        Element el = aw.getElement();
        ComplexType ct = aw.getType();

        NodeList list = el.getChildNodes();
        int len = getArrayLen(list);

        String brackets = "";
        if (encoded) {
            if (soap == SOAPConstants.SOAP12_CONSTANTS)
                brackets += len;
            else
                brackets += "[" + len + "]";

            AttributesImpl attrs;
            if (attributes == null) {
                attrs = new AttributesImpl();
            } else {
                attrs = new AttributesImpl(attributes);
            }

            QName componentQName = ct.getArrayItemTypeQName();
            String compType = context.attributeQName2String(componentQName);

            if (attrs.getIndex(soap.getEncodingURI(), soap.getAttrItemType()) == -1) {
                String encprefix =
                    context.getPrefixForURI(soap.getEncodingURI());

                if (soap != SOAPConstants.SOAP12_CONSTANTS) {
                    compType = compType + brackets;
                    
                    attrs.addAttribute(soap.getEncodingURI(),
                                       soap.getAttrItemType(),
                                       encprefix + ":arrayType",
                                       "CDATA",
                                       compType);

                } else {
                    attrs.addAttribute(soap.getEncodingURI(),
                                       soap.getAttrItemType(),
                                       encprefix + ":itemType",
                                       "CDATA",
                                       compType);

                    attrs.addAttribute(soap.getEncodingURI(),
                                       "arraySize",
                                       encprefix + ":arraySize",
                                       "CDATA",
                                       brackets);
                }
            }

            // NOTE: comments here copied from axis code. -pk
            //
            // Force type to be SOAP_ARRAY for all array serialization.
            //
            // There are two choices here:
            // Force the type to type=SOAP_ARRAY
            //   Pros:  More interop test successes.
            //   Cons:  Since we have specific type information it
            //          is more correct to use it.  Plus the specific
            //          type information may be important on the
            //          server side to disambiguate overloaded operations.
            // Use the specific type information:
            //   Pros:  The specific type information is more correct
            //          and may be useful for operation overloading.
            //   Cons:  More interop test failures (as of 2/6/2002).
            //
            int typeI = attrs.getIndex(schema.getXsiURI(),
                                       "type");
            if (typeI != -1) {
                String qname =
                      context.getPrefixForURI(schema.getXsiURI(),
                                              "xsi") + ":type";
                QName soapArray;
                if (soap == SOAPConstants.SOAP12_CONSTANTS) {
                    soapArray = Constants.SOAP_ARRAY12;
                } else {
                    soapArray = Constants.SOAP_ARRAY;
                }

                attrs.setAttribute(typeI,
                                   schema.getXsiURI(),
                                   "type",
                                   qname,
                                   "CDATA",
                                   context.qName2String(soapArray));
            }
            attributes = attrs;
        }

        context.startElement(name, attributes);
        for (int i=0; i < list.getLength(); i++) {
            // Now copy each child element in the array. -pk
            Node node = (Node)list.item(i);
            if ( node.getNodeType() == Node.ELEMENT_NODE ) {
                context.writeDOMElement((Element)node);
            }
        }
        context.endElement();
    }

    /**
     * @return number of items in array.
     */
    public int getArrayLen(NodeList list){
        int count=0;
        for (int i=0; i < list.getLength(); i++) {
            Node node = (Node)list.item(i);
            if ( node.getNodeType() == Node.ELEMENT_NODE ) ++count;
        }
        return count;
    }


    /**
     * Unimplemented. I think it's used by AXIS for WSDL2Java.
     */
    public Element writeSchema(Class javaType, Types types) throws Exception {
        throw new Exception(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="unimplemented"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZArraySerializer.class.getName(),"051018-244")
);
    }
}
