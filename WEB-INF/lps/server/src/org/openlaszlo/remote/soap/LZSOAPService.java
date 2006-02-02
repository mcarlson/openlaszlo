/* *****************************************************************************
 * LZSOAPService.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.soap;

import org.openlaszlo.iv.flash.api.action.Program;
import org.openlaszlo.remote.soap.encoding.SWFSimpleDeserializerFactory;
import org.openlaszlo.remote.soap.encoding.SWFObjectDeserializerFactory;
import org.openlaszlo.remote.soap.encoding.LZObjectSerializerFactory;
import org.openlaszlo.server.LPS;
import java.io.IOException;
import java.net.URLDecoder;
import java.rmi.RemoteException;
import java.util.Iterator;
import java.util.List;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Map;
import javax.xml.namespace.QName;
import javax.xml.rpc.JAXRPCException;
import javax.xml.soap.SOAPHeader;
import org.apache.axis.AxisFault;
import org.apache.axis.client.Service;
import org.apache.axis.client.Call;
import javax.xml.rpc.ServiceException;
import javax.xml.rpc.encoding.DeserializerFactory;
import javax.xml.rpc.encoding.SerializerFactory;
import javax.xml.rpc.encoding.TypeMappingRegistry;
import javax.xml.rpc.encoding.TypeMapping;
import javax.xml.rpc.handler.HandlerInfo;
import javax.xml.rpc.handler.HandlerRegistry;
import javax.xml.soap.SOAPException;
import org.apache.axis.Constants;
import org.apache.axis.message.SOAPBodyElement;
import org.apache.axis.message.SOAPHeaderElement;
import org.apache.log4j.Logger;
import org.w3c.dom.DOMException;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Text;
import org.xml.sax.SAXException;

public class LZSOAPService
{
    private static Logger mLogger = Logger.getLogger(LZSOAPService.class);

    String mServiceName;
    String mPort;
    String mEndpointAddress;
    String mTransport;
    String mTargetNS;
    String mXMLSchemaNS;
    String mSOAPEncodingNS;
    Service mService;
    TypeMappingRegistry mTypeMappingRegistry;
    HandlerRegistry mHandlerRegistry;
    TypeMapping mDefaultTypeMapping;
    TypeMapping mDefaultSOAPEncodingTypeMapping;

    /** URL for wsdl. This gets set in SOAPDataSource. */
    String mWSDL;

    /** Map of SWF of services (synchronized) (key is version string like swf6,
     * swf7, etc.) */
    Hashtable mClientSOAPServiceMap = new Hashtable();

    /** Map of LZSOAPOperations. */
    Map mOperations = null;

    /** Map of schema complex types. */
    Map mSchemaComplexTypes = null;



    /** Keep one DeserializerFactory around. */
    DeserializerFactory mSWFObjectDeserializerFactory = 
        new SWFObjectDeserializerFactory();
    SerializerFactory mObjectSerializerFactory = new LZObjectSerializerFactory();

    public LZSOAPService(String wsdl, String serviceName, String port, 
                         String endpointAddress, String transport,
                         String targetNS, String xmlSchemaNS,
                         String soapEncodingNS)
        throws ServiceException {

        mWSDL = wsdl;
        mServiceName = serviceName;
        mPort = port;
        mEndpointAddress = endpointAddress;
        mTransport = transport;
        mTargetNS = targetNS;
        mXMLSchemaNS = xmlSchemaNS;
        mSOAPEncodingNS = soapEncodingNS;

        mService = new Service(new QName(mTargetNS, mServiceName));

        mTypeMappingRegistry = mService.getTypeMappingRegistry();
        mHandlerRegistry = mService.getHandlerRegistry();

        getHandlerChain().add(new HandlerInfo(LZSOAPHandler.class, null, null));

        // Register default type mapping and default soap encoding type mapping.
        mDefaultTypeMapping = LZDefaultTypeMapping.getSingleton();
        mDefaultSOAPEncodingTypeMapping = new LZDefaultSOAPEncodingTypeMapping();
        mTypeMappingRegistry.registerDefault(mDefaultTypeMapping);
        mTypeMappingRegistry.register(Constants.URI_SOAP11_ENC, mDefaultSOAPEncodingTypeMapping);
    }


    public synchronized byte[] createClientSOAPService(String swfversion, int swfnum) 
        throws ServiceException {
        byte[] swfobj = (byte[])mClientSOAPServiceMap.get(swfversion);
        if (swfobj == null) {
            try {
                swfobj = ClientSOAPService.createObject(this, swfnum);
                mClientSOAPServiceMap.put(swfversion, swfobj);
            } catch (IOException e) {
throw new ServiceException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="could not create client SOAP service object"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-130")
); 
            }
        }
        return swfobj;
    }

    /**
     * Get client SWF representation of service.
     */
    public byte[] getClientSOAPService(int swfnum) 
        throws ServiceException {
        String swfversion = LPS.getSWFVersion(swfnum);
        byte[] swfobj = (byte[])mClientSOAPServiceMap.get(swfversion);
        if (swfobj == null) swfobj = createClientSOAPService(swfversion, swfnum);
        return swfobj;
    }

    /**
     * Invoke operation with parameters. Parameters are represented in XML like:
     *
     *     <params>
     *         <param>param1</param>
     *         <param>param2</param>
     *         <param>param3</param>
     *     <params>
     *
     * In document style, the string in the <param> element should be an
     * XML-escaped string. For example, suppose you were trying to send two
     * documents that looked like:
     *
     *     doc1: <a>1</a>
     *     doc2: <b>2</b>
     *
     * The XML parameter string should look as follows:
     *
     *    <params>
     *        <param>%3Ca%3E1%3C/a%3E</param>
     *        <param>%3Cb%3E2%3C/b%3E</param>
     *    </params>
     *
     * @param operation operation to invoke
     * @param xml XML from client that includes header and body. The format looks like:
     *
     *     <e><h>XML_HEADER</h><b>XML_BODY</b></e>
     *
     * where XML_BODY is
     *
     *     <params>
     *         <param>PARAM1</param>
     *         <param>PARAM2</param>
     *         <param>...</param>
     *     </params>
     *
     * @return object array where the first parameter is a string indicating the
     * style used to invoke the function (rpc|document) and the second is the
     * return value. For document styles, an array of SOAPBody message items are
     * returned.
     */
    public Object[] invoke(String operation, String xml) 
        throws AxisFault, ServiceException, RemoteException {

        mLogger.debug("invoke()");

        try {
            Element envelope = LZSOAPUtils.xmlStringToElement(xml);

            Element body = LZSOAPUtils.getFirstElementByTagName(envelope, "b");
            Element paramsEl = LZSOAPUtils.getFirstElementByTagName(body, "params");

            Object[] callArr = createCall(operation, paramsEl);
            Call call = (Call)callArr[0];
            Object[] params = (Object[])callArr[1];

            Element header = LZSOAPUtils.getFirstElementByTagName(envelope, "h");
            NodeList headerNodes = header.getChildNodes();
            for (int i=0; i < headerNodes.getLength(); i++) {
                Node headerNode = (Node)headerNodes.item(i);
                if (headerNode.getNodeType() != Node.ELEMENT_NODE) continue;
                call.addHeader(new SOAPHeaderElement((Element)headerNode));
            }

            // Pass back style and return value from call
            Object returnValue = call.invoke(params);

            // Return header, if any
            SOAPHeader responseHeader = 
                call.getResponseMessage().getSOAPEnvelope().getHeader();

            LZSOAPOperation op = (LZSOAPOperation)mOperations.get(operation);
            return new Object[]{ op.getStyle(), returnValue, responseHeader };

        } catch (AxisFault e) {
            mLogger.error("AxisFault");
            throw e;
        } catch (IOException e) {
            mLogger.error("IOException", e);
            throw new ServiceException(e.getMessage());
        } catch (org.xml.sax.SAXException e) {
            mLogger.error("SAXException:", e);
            throw new ServiceException(e.getMessage());
        } catch (SOAPException e) {
            mLogger.error("SOAPException", e);
            throw new ServiceException(e.getMessage());
        }

    }

    Node getParamValue(Element param) {
        NodeList list = param.getChildNodes();
        int len = list.getLength();
        if (len == 0) {
            return null;
        } 

        // if a subelement exists, the param must be an array or object.
        for (int i=0; i < list.getLength(); i++) {
            Node node = list.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                return param;
            }
        }

        return list.item(0);
    }


    /**
     * @return true if paramNode is text node, else false.
     */
    public boolean isTextNode(Node paramNode) {
        return (paramNode == null || paramNode.getNodeType() == Node.TEXT_NODE);
    }

    /**
     * @return true if paramNode is an element node, else false.
     */
    public boolean isElementNode(Node paramNode) {
        return (paramNode.getNodeType() == Node.ELEMENT_NODE);
    }

    /**
     * @return list of rpc parameters
     */
    public List setRPCParams(Call call, NodeList paramsList, List parts, 
                             LZSOAPOperation op)
        throws ServiceException, IOException, SAXException, DOMException {

        if (mLogger.isDebugEnabled()) {
            mLogger.debug("setRPCParams");
        }

        int pos = 0; // parameter position
        List params = new ArrayList();
        for (int i=0; i < paramsList.getLength(); i++) {

            Node node = (Node)paramsList.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) continue;

            Element p = (Element)node;
            Node paramNode = getParamValue(p);

            LZSOAPPart part = (LZSOAPPart)parts.get(pos);
            ComplexType type = part.getType();

            if (type.isArray()) {

                if (! isElementNode(paramNode)) {
                    throw new ServiceException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="parameter " + p[0] + " should an array"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-304", new Object[] {new Integer(pos + 1)})
                    );
                }

                call.addParameter(part.getName(), type.getBase().getName(), 
                                  ArrayList.class, part.getParameterMode());

                ArrayWrapper aw = new ArrayWrapper((Element)paramNode, type);
                ArrayList list = new ArrayList();
                list.add(aw);
                params.add(list);
                if (mLogger.isDebugEnabled()) {
                    mLogger.debug("array param: " + aw);
                }

            } else {

                call.addParameter(part.getName(), type.getName(),
                                  part.getParameterMode());

                if (isTextNode(paramNode)) { // primitive param
                    Text text = (Text)paramNode;
                    String strValue = (text != null ? text.getData() : "");
                    params.add(((LZSOAPPart)parts.get(pos)).valueOf(strValue));
                    if (mLogger.isDebugEnabled()) {
                        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="primitive param: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-335", new Object[] {strValue})
);
                    }

                } else if (isElementNode(paramNode)) { // object param
                    ObjectWrapper ow = new ObjectWrapper((Element)paramNode);
                    params.add(ow);
                    if (mLogger.isDebugEnabled()) {
                        mLogger.debug("object param: " + ow);
                    }

                } else {
                    throw new ServiceException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="bad parameter " + p[0] + ": " + p[1]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-353", new Object[] {new Integer(pos + 1), paramNode})
                        );
                }

            }

            ++pos;
        }

        if (params.size() != parts.size()) {
            throw new ServiceException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="wrong number of params"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-368")
);
        }

        // Set return type
        parts = op.getOutputMessage().getParts();
        int size = parts.size();
        if (size > 1) {
            throw new ServiceException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="multiple return values unsupported"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-382")
);
        }

        // If return type isn't void, set it.
        if (size != 0){
            LZSOAPPart part = (LZSOAPPart)parts.get(0);
            ComplexType type = part.getType();
            if (type != null) {
                call.setReturnType(type.getName());
            } else {
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="type of return unspecified"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-399")
); 
            }
        }

        return params;
    }

    /**
     * @return list of document style parameters
     */
    public List setDocumentParams(Call call, NodeList paramsList, List parts, 
                                  LZSOAPOperation op)
        throws ServiceException, IOException, SAXException, DOMException {

        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="setDocumentParams"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-421")
);
        }

        call.setProperty(Call.OPERATION_STYLE_PROPERTY, "document");
        call.setProperty(Call.SOAPACTION_USE_PROPERTY, new Boolean(true));
        call.setProperty(Call.SOAPACTION_URI_PROPERTY, op.getSoapAction());

        List params = new ArrayList();
        for (int i=0; i < paramsList.getLength(); i++) {

            Node node = (Node)paramsList.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) continue;

            Element p = (Element)node;

            // get the XML string and convert to an element
            Text text = (Text)p.getFirstChild();
            String data = URLDecoder.decode(text.getData());
            Element docElement = LZSOAPUtils.xmlStringToElement(data);
            params.add(new SOAPBodyElement(docElement));

        }

        return params;
    }

    /**
     * @param operation name of operation.
     * @param paramsEl parameter element nodes.
     * @return array with Call object as first value and a parameter array to invoke call with.
     */
    public Object[] createCall(String operation, Element paramsEl) throws ServiceException {
        LZSOAPOperation op = (LZSOAPOperation)mOperations.get(operation);
        if (op == null) {
            throw new ServiceException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="could not find operation named " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-462", new Object[] {operation})
                                );
        }

        try {
            Call call = (org.apache.axis.client.Call)
                mService.createCall(new QName(mTargetNS, mPort));
            call.setOperationName(new QName(mTargetNS, op.getName()));
            call.setTargetEndpointAddress(mEndpointAddress);

            NodeList paramsList = paramsEl.getChildNodes();
            List parts = op.getInputMessage().getParts();

            List params = null;
            if (op.getStyle().equals("document"))
                params = setDocumentParams(call, paramsList, parts, op);
            else /* rpc */
                params = setRPCParams(call, paramsList, parts, op);

            return new Object[]{ call, params.toArray() };
        } catch (IOException e) {
            mLogger.error("IOException", e);
            throw new ServiceException("IOException: " + e.getMessage());
        } catch (SAXException e) {
            mLogger.error("SAXException", e);
            throw new ServiceException("SAXException: " + e.getMessage());
        } catch (DOMException e) {
            mLogger.error("DOMException", e);
            throw new ServiceException("DOMException: " + e.getMessage());
        }
    }

    public TypeMappingRegistry getTypeMappingRegistry() {
        return mTypeMappingRegistry;
    }

    public HandlerRegistry getHandlerRegistry() {
        return mHandlerRegistry;
    }

    public List getHandlerChain() {
        return mHandlerRegistry.getHandlerChain(new QName(mTargetNS, mPort));
    }

    public Service getService() {
        return mService;
    }

    /** Set map of LZSOAPOperations. */
    public void setOperations(Map operations) {
        mOperations = operations;
    }

    /** @return map of LZSOAPOperations. */
    public Map getOperations() {
        return mOperations;
    }

    public String getTargetNS() {
        return mTargetNS;
    }

    public String getSOAPEncodingNS() {
        return mSOAPEncodingNS;
    }

    public String getServiceName() {
        return mServiceName;
    }

    public String getPort() {
        return mPort;
    }

    public String getEndpointAddress() {
        return mEndpointAddress;
    }

    public String getTransport() {
        return mTransport;
    }

    /** WSDL URL for this SOAP service. */
    public String getWSDL() {
        return mWSDL;
    }

    /** Set WSDL URL for this SOAP service. */
    public void setWSDL(String wsdl) {
        mWSDL = wsdl;
    }

    /**
     * This gets called by WSDLParser after WSDL schema is read. 
     */
    public void setSchemaComplexTypes(Map schemaComplexTypes) {
        mSchemaComplexTypes = schemaComplexTypes;

        // now register these complex types with type mapper.
        if (mSchemaComplexTypes != null) {
            Iterator iter = mSchemaComplexTypes.values().iterator();
            while (iter.hasNext()) {
                ComplexType value = (ComplexType)iter.next();
                if ( value.getType() == ComplexType.TYPE_STRUCT ) {
                    QName structQName = value.getName();
                    // Just to be safe, registering in both default type mapping
                    // and SOAP type mapping.
                    mDefaultTypeMapping.register(ObjectWrapper.class, structQName,
                                                 mObjectSerializerFactory, 
                                                 mSWFObjectDeserializerFactory);
                    mDefaultSOAPEncodingTypeMapping.register(ObjectWrapper.class, structQName,
                                                             mObjectSerializerFactory, 
                                                             mSWFObjectDeserializerFactory);
                    if (mLogger.isDebugEnabled()) {
                        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="registered type mapping for object: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                LZSOAPService.class.getName(),"051018-581", new Object[] {structQName})
);
                    }
                } 
                // NOTE: arrays/collections are handled by default type mapping
                // in LZDefaultTypeMapping. -pk
            }
        }
    }

    /**
     * @return map of ComplexType.
     */
    public Map getSchemaComplexTypes() {
        return mSchemaComplexTypes;
    }

    public void toComplexTypesXML(StringBuffer sb) {
        sb.append("<complex-types>");
        if (mSchemaComplexTypes != null) {
            Iterator iter = mSchemaComplexTypes.entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry)iter.next();
                ComplexType ct =(ComplexType)entry.getValue();
                ct.toXML(sb);
            }
        }
        sb.append("</complex-types>");
    }

    public void toOperationXML(StringBuffer sb) {
        sb.append("<operations>");
        Iterator iter = mOperations.keySet().iterator();
        while (iter.hasNext()) {
            String key = (String)iter.next();
            LZSOAPOperation op = (LZSOAPOperation)mOperations.get(key);
            op.toXML(sb);
        }
        sb.append("</operations>");
    }

    public void toXML(StringBuffer sb) {
        sb.append("<service")
            .append(" name=\"").append(mServiceName).append("\"")
            .append(" port=\"").append(mPort).append("\"")
            .append(" endpoint=\"").append(mEndpointAddress).append("\"")
            .append(" transport=\"").append(mTransport).append("\"")
            .append(" target-namespace=\"").append(mTargetNS).append("\">");
        toOperationXML(sb);
        toComplexTypesXML(sb);
        sb.append("</service>");
    }

//     public String toString() {
//         return "-- SOAPService ------------------------------\n"
//             + "service="  + mServiceName + "\n"
//             + "port="     + mPort + "\n"
//             + "endpoint=" + mEndpointAddress + "\n"
//             + "transport=" + mTransport + "\n"
//             + "target namespace=" + mTargetNS + "\n\n"
//             + "    ==== OPERATIONS ====\n\n"
//             + toOperationString()
//             + "    ==== SCHEMA COMPLEX TYPES ====\n\n"
//             + stringComplexTypes()
//             + "---------------------------------------------";
//     }

//     public String toOperationString() {
//         StringBuffer buf = new StringBuffer(); 
//         Iterator iter = mOperations.keySet().iterator();
//         while (iter.hasNext()) {
//             String key = (String)iter.next();
//             LZSOAPOperation op = (LZSOAPOperation)mOperations.get(key);
//             buf.append(op).append("\n");
//         }
//         return buf.toString();
//     }

}
