/* *****************************************************************************
 * WSDLParser.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
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
import org.apache.axis.utils.*;
import org.apache.log4j.Logger;


/**
 * WSDL parser to obtain a SOAP service object.
 */
public class WSDLParser
{
    private static Logger mLogger = Logger.getLogger(WSDLParser.class);

    public String mTargetNamespace;
    public String mNamespaceURI_WSDL;
    public String mNamespaceURI_WSDL_SOAP;
    public String mNamespaceURI_SOAP_ENC;
    public String mNamespaceURI_SCHEMA_XSD;

    public QName mQNameOperationInput;
    public QName mQNameOperationOutput;

    HashMap mComplexTypeMap = new HashMap();


    public static final String[] URIS_SOAP_HTTP = {
        Constants.URI_SOAP11_HTTP,
        Constants.URI_SOAP12_HTTP
    };

    /** Static document builder. */
    static DocumentBuilder mBuilder = null;

    /** WSDL root element. */
    Element mDefinitions = null;

    //------------------------------------------------------------
    // create namespace aware builder
    //------------------------------------------------------------
    {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        try {
            mBuilder = factory.newDocumentBuilder();
        } catch (ParserConfigurationException e) {
            mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Can't create DocumentBuilder"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-68")
);
        }
    }


    /**
     * Protected constructor. Entry point is static parse() method.
     */
    private WSDLParser() { }


    /**
     * Entry point method.
     *
     * @param wsdl WSDL URL
     * @param is
     * @param serviceName can be null.
     * @param servicePort can be null.
     * @return LZSOAPService object.
     * @exception WSDLException if there was a problem with the WSDL.
     * @exception ServiceException if there was a problem creating LZSOAPService.
     */
    static public LZSOAPService parse(String wsdl, InputSource is, String serviceName, 
                                      String servicePort) 
        throws WSDLException, ServiceException {
        WSDLParser parser = new WSDLParser();
        return parser.parseWSDL(wsdl, is, serviceName, servicePort);
    }

    /**
     * Entry point method. Same as calling parse(is, null, null). 
     *
     * @param wsdl WSDL URL
     * @param is
     * @return LZSOAPService object.
     * @exception WSDLException if there was a problem with the WSDL.
     * @exception ServiceException if there was a problem creating LZSOAPService.
     */
    static public LZSOAPService parse(String wsdl, InputSource is) 
        throws WSDLException, ServiceException {
        return parse(wsdl, is, null, null);
    }


    /**
     * Set namespaces:
     *
     * mNamespaceURI_WSDL, mNamespaceURI_WSDL_SOAP, mNamespaceURI_SCHEMA_XSD,
     * mQNameOperationInput, mQNameOperationOutput
     */
    void setNamespaces() {
        mTargetNamespace = mDefinitions.getAttribute("targetNamespace");

        NamedNodeMap attrs = mDefinitions.getAttributes();
        for (int i=0; i < attrs.getLength(); i++) {
            String attr = ((Attr)attrs.item(i)).getValue();
            if (Constants.isWSDL(attr)) {
                mNamespaceURI_WSDL = attr;
            } else if (Constants.isSchemaXSD(attr)) {
                mNamespaceURI_SCHEMA_XSD = attr;
            } else if (Constants.isWSDLSOAP(attr)) {
                mNamespaceURI_WSDL_SOAP = attr;
            } else if (Constants.isSOAP_ENC(attr)) {
                mNamespaceURI_SOAP_ENC = attr;
            }
        }

        mQNameOperationInput  = new QName(mNamespaceURI_WSDL, "input");
        mQNameOperationOutput = new QName(mNamespaceURI_WSDL, "output");

        if (mLogger.isDebugEnabled()) {
            mLogger.debug("WSDL: URI_WSDL " + mNamespaceURI_WSDL);
            mLogger.debug("WSDL: URI_SCHEMA_XSD " + mNamespaceURI_SCHEMA_XSD);
            mLogger.debug("WSDL: URI_WSDL_SOAP " + mNamespaceURI_WSDL_SOAP);
            mLogger.debug("WSDL: URI_SOAP_ENC " + mNamespaceURI_SOAP_ENC);
            mLogger.debug("WSDL: targetnamespace " + mTargetNamespace);
        }
    }


    /**
     * Parse WDSL file
     *
     * @param wsdl WSDL URL
     * @param is WSDL input source.
     * @param serviceName name of service. If null, use first service element encountered.
     * @param servicePort name of port. if null, use first SOAP port element
     * encountered..
     * @return LZSOAPService object.
     * @exception WSDLException if there was a problem with the WSDL.
     * @exception ServiceException if there was a problem creating LZSOAPService.
     */
    LZSOAPService parseWSDL(String wsdl, InputSource is, String serviceName, 
                            String servicePort)
        throws WSDLException, ServiceException {

        LZSOAPService soapService = null;

        try {
            mDefinitions = mBuilder.parse(is).getDocumentElement();
        } catch (IOException e) {
            throw new WSDLException("IOException: " + e.getMessage());
        } catch (SAXException e) {
            throw new WSDLException("SAXException: " + e.getMessage());
        }

        setNamespaces();

        SchemaParser sp = null;
        try {
            NodeList schemalist = getSchema();
            if (schemalist != null) {
                for (int i=0; i < schemalist.getLength(); i++) {
                    Element schema = (Element)schemalist.item(i);
                    sp = new SchemaParser(this, schema);
                    sp.parse(mComplexTypeMap);
                }
            }
        } catch (Exception e) {
            mLogger.warn("SchemaParser", e);
        }

        Element service;
        if (serviceName == null)
            service = 
                LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL, 
                                                       mDefinitions, "service");
        else
            service = findServiceElement(serviceName);

        if (service == null) {
            if (serviceName != null)
                throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="no service named " + p[0] + " was found."
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-207", new Object[] {serviceName})
                );
            else
                throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="no service was found"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-216")
);
        }


        serviceName = service.getAttribute("name");
        if (serviceName.equals("")) {
            throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="service has no name"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-229")
);
        }


        NodeList portList = service.getElementsByTagNameNS(mNamespaceURI_WSDL, "port");
        int len = portList.getLength();
        if (len == 0) 
            throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="No SOAP ports found for service " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-243", new Object[] {serviceName})
                                );

        for (int i=0; i < len; i++) {
            Element port = (Element)portList.item(i);

            String portName = port.getAttribute("name");
            if ( portName == null ) {
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="encountered port with no name"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-256")
);
                continue;
            }

            if (servicePort != null && ! servicePort.equals(portName)) {
                continue;
            }

            if (doesPortSupportSOAP(port)) {

                Element binding = getBindingElement(port);
                mLogger.debug("binding: " +  binding);

                Element soapBinding = 
                    LZSOAPUtils.getFirstElementByTagNameNS
                    (mNamespaceURI_WSDL_SOAP, binding, "binding");

                if (soapBinding == null) {
                    throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="no SOAP binding for port " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-281", new Object[] {portName})
                    );
                }

                // we only support SOAP over HTTP
                String transport = soapBinding.getAttribute("transport");
                if ( ! isSOAPHTTPTransport(transport) ) {
                    if ( servicePort != null && servicePort.equals(portName)) {
                        throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="port " + p[0] + " does not have a valid SOAP transport"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-294", new Object[] {servicePort})
                        );
                    } else {
                        continue;
                    }
                }

                soapService = new LZSOAPService(wsdl, service.getAttribute("name"),
                                                portName, getEndpointAddress(port),
                                                transport, mTargetNamespace,
                                                mNamespaceURI_SCHEMA_XSD, 
                                                mNamespaceURI_SOAP_ENC);

                String defaultStyle = soapBinding.getAttribute("style");
                if ( "".equals(defaultStyle) ) defaultStyle = "document";

                parseOperations(soapService, binding, defaultStyle);
                break;
            } else if (servicePort != null && servicePort.equals(portName)) {
                throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="port " + p[0] + " does not support SOAP"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-319", new Object[] {servicePort})
                );
            }
        }

        if (soapService == null) {
            throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="could not find requested SOAP service " + "(service: " + p[0] + ", port: " + p[1] + ")"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-331", new Object[] {serviceName, servicePort})
            );
        }

        soapService.setSchemaComplexTypes(mComplexTypeMap);

        return soapService;
    }


    /**
     * Get the namespace for the schema.
     *
     * @return target namespace for schema.
     */
    NodeList getSchema() {
        return mDefinitions.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD, 
                                                  "schema");
    }

    /**
     * Parse SOAP operations and add them to service object.
     *
     * @param service SOAP service object to add operations.
     * @param binding WSDL SOAP binding element.
     */
    void parseOperations(LZSOAPService service, Element binding, 
                         String defaultStyle) throws WSDLException {

        String bindingType = binding.getAttribute("type");
        if ("".equals(bindingType)) {
            throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="binding does not have a type attribute"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-368")
);
        }
        QName bindingTypeQName = XMLUtils.getQNameFromString(bindingType, binding);

        // binding maps to portType
        Element portType = findPortTypeElement(bindingTypeQName.getLocalPart());
        if (portType == null) {
            throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="could not find portType named " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-382", new Object[] {bindingTypeQName})
            );
        }

        // list of operations for portType
        NodeList portTypeOpList = 
            portType.getElementsByTagNameNS(mNamespaceURI_WSDL, "operation");
        if (portTypeOpList.getLength() == 0) {
            throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="portType named " + p[0] + " has no operations"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-396", new Object[] {bindingTypeQName.getLocalPart()})
            ); 
        }

        Map operationMap = new HashMap();
        service.setOperations(operationMap);

        NodeList list = binding.getElementsByTagNameNS(mNamespaceURI_WSDL, "operation");
        for (int i=0; i < list.getLength(); i++) {
            Element operation = (Element)list.item(i);
            String opName = operation.getAttribute("name");
            if ( "".equals(opName) ) {
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="name not found for an operation element"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-414")
);
                continue;
            }

            // From WSDL spec: For the HTTP protocol binding of SOAP,
            // [soapAction] is value required (it has no default value).
            //
            // <operation>
            //     <soap:operation soapAction="..." style="[rpc|document]"? />
            //     ...
            // </operation>
            Element soapOperation = 
                LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL_SOAP,
                                                       operation, "operation");

            String soapAction = null;
            if (isSOAPHTTPTransport(service.getTransport())) {
                Attr soapActionAttr = soapOperation.getAttributeNode("soapAction");
                if ( soapActionAttr == null ) {
                    mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="required soapAction attribute not found for <soap:operation>"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-440")
);
                    continue;
                }
                soapAction = soapActionAttr.getValue();
            }

            String style = soapOperation.getAttribute("style");
            if ( "".equals(style) )
                style = defaultStyle;

            // get operation names for input and output parameters
            Element input = LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL, 
                                                                   operation, "input");
            Element output = LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL, 
                                                                    operation, "output");
            if (input == null || output == null) {
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="(0) WARNING: operation named " + p[0] + " is not a supported operation." + " Only request-response operations are supported."
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-463", new Object[] {opName})
                );
                continue;
            }

            String inputName = input.getAttribute("name");
            String outputName = output.getAttribute("name");

            Element portTypeOp = 
                findPortTypeOperationElement(portTypeOpList, opName, 
                                             inputName, outputName);
            if (portTypeOp == null) {
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="could not find portType operation named " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-481", new Object[] {opName})
);
                continue;
            }

            // We only support request-response type operations
            if (! isRequestResponseOperation(portTypeOp)) {
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="(1) WARNING: portType operation named " + p[0] + " is not a supported operation." + " Only request-response operations are supported."
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-494", new Object[] {opName})
                );
                continue;
            }

            LZSOAPMessage inputBody;
            LZSOAPMessage outputBody;
            try { 
                inputBody  = getMessage(operation, portTypeOp, "input", "Request");
                outputBody = getMessage(operation, portTypeOp, "output", "Response");
            } catch (WSDLException e) {
                mLogger.warn(e.getMessage());
                continue;
            }

            LZSOAPOperation op = new LZSOAPOperation(opName);
            op.setSoapAction(soapAction);
            op.setStyle(style);
            op.setInputMessage(inputBody);
            op.setOutputMessage(outputBody);
            op.setMangledName(opName + "_" + inputBody.getName() + "_" + outputBody.getName()); 
            op.setIsDocumentLiteralWrapped(isDocumentLiteralWrapped(op));

            if (operationMap.containsKey(op.getMangledName())) {
                mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="(0) operation " + p[0] + " is not unique"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-524", new Object[] {op.getMangledName()})
);
                continue;
            }

            // if already exists, we have overloaded method
            if (operationMap.containsKey(op.getName())) {

                // make sure previous operation wouldn't mangle to the same
                // mangled name as the current one
                LZSOAPOperation prevOp = (LZSOAPOperation)operationMap.get(op.getName());
                if ( prevOp.getMangledName().equals(op.getMangledName()) ) {
                    mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="(1) operation " + p[0] + " is not unique"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-542", new Object[] {op.getMangledName()})
                    );
                    continue;
                }

                operationMap.put(op.getMangledName(), op);

            } else {
                operationMap.put(op.getName(), op);
            }

        }
    }


    /**
     * Check to see if operation is a document/literal wrapped operation.
     *
     * @param op check to see if operation is document/literal wrapped.
     * @return true if it's a document/literal wrapped operation, else false.
     */
    boolean isDocumentLiteralWrapped(LZSOAPOperation op) {

        // make sure it's document literal
        if (! op.getStyle().equals("document")) {
            return false;
        }

        LZSOAPMessage inputMesg = op.getInputMessage();
        if (! inputMesg.getUse().equals("literal")) {
            return false;
        }
            
        // only one part can exist 
        List parts = inputMesg.getParts();
        if (parts == null || parts.size() != 1) {
            return false;
        }

        // element has to exist
        LZSOAPPart part = (LZSOAPPart)parts.get(0);
        String eName = part.getElement();
        if ( eName == null ) {
            return false;
        }

        // maybe I should be getting qname from schema element?
        QName eQName = XMLUtils.getQNameFromString(eName, mDefinitions);
        Element element = findSchemaElement(eQName.getLocalPart());
        if (element == null) {
            return false;
        }

        // name of element has to match name of operation
        String name = element.getAttribute("name");
        if (! name.equals(op.getName())) {
            return false;
        }

        // there can't be attributes on this element
        NodeList attrList = 
            element.getElementsByTagNameNS(mNamespaceURI_SCHEMA_XSD,
                                           "attribute");
        if (attrList.getLength() != 0) {
            return false;
        }

        return true;
    }

    /**
     * Find service element.
     *
     * @param name name of service element to find.
     * @return found service element, else null.
     */
    Element findServiceElement(String name) {
        return findElementByName(mNamespaceURI_WSDL, mDefinitions,
                                 "service", name);
    }


    /**
     * Find schema element.
     *
     * @param name name of schema element to find.
     * @return found schema element, else null.
     */
    Element findSchemaElement(String name) {
        return findElementByName(mNamespaceURI_SCHEMA_XSD, mDefinitions,
                                 "element", name);
    }

    /**
     * Find message element.
     *
     * @param name name of message to find.
     * @return found message element, else null.
     */
    Element findMessageElement(String name) {
        return findElementByName(mNamespaceURI_WSDL, mDefinitions, "message", name);
    }

    /**
     * Find portType element.
     *
     * @param name name of portType element to find.
     * @return matched portType element or null, if none found. 
     */
    Element findPortTypeElement(String name) {
        return findElementByName(mNamespaceURI_WSDL, mDefinitions, "portType", name);
    }

    /**
     * Find a particular portType operation element based on name.
     *
     * @param portTypeOpList node list of portType operations.
     * @param opname operation name to find.
     * @param input name of input parameter
     * @param output name of output parameter
     * @return portType operation element if found, else null.
     */
    Element findPortTypeOperationElement(NodeList portTypeOpList, String opname, 
                                         String input, String output) {
        for (int i=0; i < portTypeOpList.getLength(); i++) {
            Element e = (Element)portTypeOpList.item(i);
            if ( opname.equals(e.getAttribute("name")) ) {
                // get operation names for input and output parameters
                Element _input = LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL, 
                                                                        e, "input");
                Element _output = LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL, 
                                                                         e, "output");
                if ( _input != null && _output != null &&
                     input.equals(_input.getAttribute("name")) && 
                     output.equals(_output.getAttribute("name")) ) {
                    if (mLogger.isDebugEnabled()) {
                        mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="found port type operation for " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-684", new Object[] {opname})
);
                    }
                    return e;
                }
            }
        }
        return null;
    }

    /**
     * Find element by name attribute.
     *
     * @param ns namespace.
     * @param owner owner element.
     * @param tag tag to search on.
     * @param name name to match.
     * @return found element.
     */
    Element findElementByName(String ns, Element owner, String tag, String name) {
        NodeList list = owner.getElementsByTagNameNS(ns, tag);
        return findElementByName(list, name);
    }

    /**
     * Find element by name attribute.
     *
     * @param list node list.
     * @param name name value to match.
     * @return found element.
     */
    Element findElementByName(NodeList list, String name) {
        for (int i=0; i < list.getLength(); i++) {
            Element e = (Element)list.item(i);
            if ( name.equals(e.getAttribute("name")) )
                return e;
        }
        return null;
    }

    /**
     * Parse message for input, output from portType operation.
     *
     * @param bindOp operation element in binding
     * @param portTypeOp operation element in portType.
     * @param tag one of input, output.
     * @param appendName string to append to create implicit operation type name
     * if element has not explicitly declared it.
     * @return a soap message object.
     */
    LZSOAPMessage getMessage(Element bindOp, Element portTypeOp, 
                             String tag, String appendName) 
        throws WSDLException {

        Element opType = 
            LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL,
                                                   portTypeOp, tag);
        String opName = portTypeOp.getAttribute("name");

        String name = opType.getAttribute("name");
        if (name.equals("")) {
            name = opName + appendName;
        }

        LZSOAPMessage message = new LZSOAPMessage(name, tag);

        Element bindTag = 
            LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL, 
                                                   bindOp, tag);
        if (bindTag == null) {
            throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="could not find " + p[0] + " element for bind operation " + p[1]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-760", new Object[] {tag, opName})
                                );
        }

        // only parse <soap:body> element for now
        Element soapBody = 
            LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL_SOAP,
                                                   bindTag, "body");

        String use = soapBody.getAttribute("use");
        if (use.equals("")) {
            throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="Attribute use is not defined for " + p[0] + " <soap:body> in operation " + p[1]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-776", new Object[] {tag, opName})
                                );
        }
        message.setUse(use);

        String parts = soapBody.getAttribute("parts");
        if (! parts.equals("")) {
            message.setPartNames(getPartSet(parts));
        }

        String mesgName = opType.getAttribute("message");
        QName mesgQName = XMLUtils.getQNameFromString(mesgName, opType);
        Element mesgElement = findMessageElement(mesgQName.getLocalPart());
        if (mesgElement == null) {
            throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="could not find message element named " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-795", new Object[] {mesgQName.getLocalPart()})
                                );
        }

        
        bindMessage(message, mesgElement, tag);

        return message;
    }

    
    /**
     * @param soapMessage 
     * @param mesgElement
     * @param tag one of input or output
     */
    void bindMessage(LZSOAPMessage soapMessage, Element mesgElement, String tag) 
        throws WSDLException {

        List parts = new Vector();
        Set partNames = soapMessage.getPartNames();

        // go through mesgElement and add part information to soapMessage
        NodeList list = mesgElement.getElementsByTagNameNS(mNamespaceURI_WSDL, "part");
        for (int i=0; i < list.getLength(); i++) {
            Element part = (Element)list.item(i);
            Attr nameAttr = part.getAttributeNode("name");
            if (nameAttr == null) {
                throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="part for message named " + p[0] + " does not have required name attribute"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-828", new Object[] {mesgElement.getAttribute("name")})
                );
            }
            String name = nameAttr.getValue();

            // only set part if message should contain it
            if (partNames != null && ! partNames.contains(name)) continue;

            LZSOAPPart p = new LZSOAPPart(name);

            ParameterMode mode;
            if (tag.equals("output")) {
                mode = ParameterMode.OUT;
            } else {
                mode = ParameterMode.IN;
            }
            p.setParameterMode(mode);

            Attr elementAttr = part.getAttributeNode("element");
            Attr typeAttr = part.getAttributeNode("type");

            if (elementAttr != null) {
                p.setElement(elementAttr.getValue());
            }

            if (typeAttr != null) {
                QName qname = XMLUtils.getQNameFromString(typeAttr.getValue(),
                                                          part);

                // If it's an array, refer to type definition of the array.
                ComplexType ct = (ComplexType)mComplexTypeMap.get(qname);
                if (ct == null) {
                    String ns = qname.getNamespaceURI();
                    if (Constants.isSchemaXSD(ns) || Constants.isSOAP_ENC(ns)) {
                        ct = new ComplexType(qname);
                        mComplexTypeMap.put(qname, ct);
                    } else {
                        throw new WSDLException(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="could not find type for " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                WSDLParser.class.getName(),"051018-871", new Object[] {qname})
);
                    }
                }
                p.setType(ct);
            }

            parts.add(p);
        }

        soapMessage.setParts(parts);
    }

    /**
     * Get list of message parts.
     *
     * @param nmtokens name tokens.
     * @return set part names.
     */
    Set getPartSet(String nmtokens) {
        Set set = null;
        StringTokenizer st = new StringTokenizer(nmtokens);
        while (st.hasMoreTokens()) {
            if (set == null) set = new HashSet();
            set.add(st.nextToken());
        }
        return set;
    }


    /**
     * Check to see if portType operation is request-response operation, since
     * we currently have no way of supporting one-way, solicit-response,
     * notification operations.
     * 
     * @param op port Type operation element.
     */
    boolean isRequestResponseOperation(Element op) {
        Node n = op.getFirstChild();
        while (n != null && 
               ( n.getNodeType() != Node.ELEMENT_NODE ||
                 n.getNodeName().equals("documentation")) ) {
            n = n.getNextSibling();
        }

        // make sure we're comparing w/o prefix but with the right namespace
        QName input = XMLUtils.getQNameFromString(n.getNodeName(), op);
        input = new QName(n.getNamespaceURI(), input.getLocalPart());
        if (n == null || ! input.equals(mQNameOperationInput))
            return false;

        n = n.getNextSibling();
        while (n != null && 
               n.getNodeType() != Node.ELEMENT_NODE) {
            n = n.getNextSibling();
        }
        QName output = XMLUtils.getQNameFromString(n.getNodeName(), op);
        output = new QName(n.getNamespaceURI(), output.getLocalPart());
        if (n == null || ! output.equals(mQNameOperationOutput))
            return false;

        return true;
    }


    /**
     * Check to see if SOAP transport for binding is supported. Support only
     * HTTP for now.
     *
     * @param transport transport string.
     * @return true if SOAP transport is supported, else false.
     */
    boolean isSOAPHTTPTransport(String transport) {
        if (transport == null) 
            return false;

        for (int i=0; i<URIS_SOAP_HTTP.length; i++) {
            if (URIS_SOAP_HTTP[i].equals(transport)) {
                return true;
            }
        }
        return false;
    } 

    /**
     * Get the &lt;soap:address .../&gt; location attribute.
     *
     * @param port port element to get endpoint address from.
     * @return endpoint address string.
     */
    String getEndpointAddress(Element port) {
        Element soapAddress = 
            LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL_SOAP, 
                                                   port, "address");
        String name = port.getAttribute("name");
        return soapAddress.getAttribute("location");
    }

    /**
     * Get binding element specified by the port's binding attribute.
     *
     * @param port port element to get binding.
     * @return binding element.
     */
    Element getBindingElement(Element port) {
        QName bindingQName = 
            XMLUtils.getQNameFromString(port.getAttribute("binding"), port);
        return getElementByAttributeNS(mNamespaceURI_WSDL, "binding", "name",
                                       bindingQName);
    }


    /**
     * Get an element based on its attribute name.
     *
     * @param ns namespace.
     * @param elementName name of element to search.
     * @param attrName name of attribute to match.
     * @param attrValue value of attribute to match.
     * @return element or null, if none found with elementName.
     */
    Element getElementByAttributeNS(String ns, String elementName, 
                                    String attrName, QName attrValue) {
        NodeList list = mDefinitions.getElementsByTagNameNS(ns, elementName);

        int length = list.getLength();
        if (length == 0) return null;

        for (int i=0; i < length; i++) {
            Element element = (Element)list.item(i);
            String searchAttr = element.getAttribute(attrName);
            if (searchAttr.equals(attrValue.getLocalPart())) {
                return element;
            }
        }

        return null;
    }


    /**
     * Check to see if port supports SOAP.
     *
     * @param port port to check SOAP support.
     * @return true if port supports SOAP, else false.
     */
    boolean doesPortSupportSOAP(Element port) {
        return LZSOAPUtils.getFirstElementByTagNameNS(mNamespaceURI_WSDL_SOAP, 
                                                      port, "address") != null;
    }

    static public void main(String[] args) {

        if (1 < args.length && args.length > 3) {
            System.err.println("Usage: WSDLParser <wsdl> [<service> <port>]");
            return;
        }

        String service = null; 
        String port = null;

        if (args.length == 2 || args.length == 3) service = args[1];
        if (args.length == 3) port = args[2];

        StringBuffer sb = new StringBuffer();
        try {
            InputSource is = new InputSource(new FileReader(args[0]));
            WSDLParser.parse(args[0], is, service, port).toXML(sb);
            System.out.println(sb);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ServiceException e) {
            System.err.println("ERROR: " + e.getMessage());
        } catch (WSDLException e) {
            System.err.println("ERROR: " + e.getMessage());
        }
    }
}
