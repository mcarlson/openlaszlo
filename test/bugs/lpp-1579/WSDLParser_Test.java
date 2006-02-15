/* ****************************************************************************
 * WSDLParser_Test.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.soap;

import java.io.*;
import junit.framework.*;
import org.xml.sax.*;


/*
 * junit.awtui.TestRunner
 * junit.swingui.TestRunner
 * junit.textui.TestRunner
 *
 * java junit.textui.TestRunner org.openlaszlo.remote.soap.WSDLParser_Test
 *
 */

public class WSDLParser_Test extends TestCase {
	
	private static final String TEST_SERVICE = "LPSService2";
	private static final String TEST_PORT = "FOOTest";
	private static final String TEST_LOCATION = "http://localhost:8080/LPCService2/FOOTest/location";
		
    public WSDLParser_Test(String name) {
        super(name);
    }

    public void testMultipleInterfaces() throws Exception {
    	StringReader wsdlReader = new StringReader(WSDL_STRING);
    	InputSource inputSource = new InputSource(wsdlReader);
    	LZSOAPService soapService = WSDLParser.parse(TEST_LOCATION, inputSource, TEST_SERVICE, TEST_PORT);
    	assertNotNull(soapService);
    	assertEquals(TEST_SERVICE, soapService.getServiceName());
    	assertEquals(TEST_PORT, soapService.getPort());
    	assertEquals(TEST_LOCATION, soapService.getEndpointAddress());
    }
        
    private static final String WSDL_STRING = 
	"<?xml version='1.0' encoding='UTF-8'?>" +
    "<wsdl:definitions targetNamespace='http://localhost:8080/lps-dev/test/rpc/soap/java/LPSTest.jws' " +
    "	xmlns:apachesoap='http://xml.apache.org/xml-soap' " +
    "   xmlns:impl='http://localhost:8080/lps-dev/test/rpc/soap/java/LPSTest.jws' " +
    "   xmlns:intf='http://localhost:8080/lps-dev/test/rpc/soap/java/LPSTest.jws' " +
    "   xmlns:soapenc='http://schemas.xmlsoap.org/soap/encoding/' " +
    "   xmlns:tns1='http://DefaultNamespace' " +
    "   xmlns:wsdl='http://schemas.xmlsoap.org/wsdl/' " +
    "   xmlns:wsdlsoap='http://schemas.xmlsoap.org/wsdl/soap/' " +
    "   xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
    " <wsdl:types>" +
    "  <schema targetNamespace='http://localhost:8080/lps-dev/test/rpc/soap/java/LPSTest.jws' " +
    "   xmlns='http://www.w3.org/2001/XMLSchema'>" +
    "   <import namespace='http://schemas.xmlsoap.org/soap/encoding/'/>" +
    
    "   <complexType name='ArrayOf_soapenc_string'>" +
    "    <complexContent>" +
    "     <restriction base='soapenc:Array'>" +
    "      <attribute ref='soapenc:arrayType' wsdl:arrayType='soapenc:string[]'/>" +
    "     </restriction>" +
    "    </complexContent>" +
    "   </complexType>" +
    
    "   <complexType name='ArrayOf_xsd_anyType'>" +
    "    <complexContent>" +
    "     <restriction base='soapenc:Array'>" +
    "      <attribute ref='soapenc:arrayType' wsdl:arrayType='xsd:anyType[]'/>" +
    "     </restriction>" +
    "    </complexContent>" +
    "   </complexType>" +

    "   <complexType name='ArrayOf_tns1_MyClass'>" +
    "    <complexContent>" +
    "     <restriction base='soapenc:Array'>" +
    "      <attribute ref='soapenc:arrayType' wsdl:arrayType='tns1:MyClass[]'/>" +
    "     </restriction>" +
    "    </complexContent>" +
    "   </complexType>" +
    
    "   <complexType name='MyClass'>" +
    "    <sequence/>" +
    "   </complexType>" +
    "  </schema>" +
    
    " </wsdl:types>" +
    "  <wsdl:message name='objectsResponse'>" +
    "   <wsdl:part name='objectsReturn' type='impl:ArrayOf_xsd_anyType'/>" +
    "  </wsdl:message>" +
    
    " <wsdl:message name='int_doubleResponse'>" +
    "  <wsdl:part name='int_doubleReturn' type='xsd:double'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='versionRequest'>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='float_floatRequest'>" +
    "  <wsdl:part name='n' type='xsd:float'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='reverseRequest'>" +
    "  <wsdl:part name='str' type='xsd:string'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='reverseResponse'>" +
    "  <wsdl:part name='reverseReturn' type='xsd:string'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='float_floatResponse'>" +
    "  <wsdl:part name='float_floatReturn' type='xsd:float'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='int_intRequest'>" +
    "  <wsdl:part name='n' type='xsd:int'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='myclassarrResponse'>" +
    "  <wsdl:part name='myclassarrReturn' type='impl:ArrayOf_tns1_MyClass'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='stringsResponse'>" +
    "  <wsdl:part name='stringsReturn' type='impl:ArrayOf_soapenc_string'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='double_doubleRequest'>" +
    "  <wsdl:part name='n' type='xsd:double'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='int_floatRequest'>" +
    "  <wsdl:part name='n' type='xsd:int'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='objectsRequest'>" +
    "  <wsdl:part name='str' type='xsd:string'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='versionResponse'>" +
    "  <wsdl:part name='versionReturn' type='xsd:string'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='boolean_booleanResponse'>" +
    "  <wsdl:part name='boolean_booleanReturn' type='xsd:boolean'/>" +
    " </wsdl:message>" +

    " <wsdl:message name='myclassRequest'>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='boolean_booleanRequest'>" +
    "  <wsdl:part name='n' type='xsd:boolean'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='myclassarrRequest'>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='myclassResponse'>" +
    "  <wsdl:part name='myclassReturn' type='tns1:MyClass'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='int_intResponse'>" +
    " <wsdl:part name='int_intReturn' type='xsd:int'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='int_floatResponse'>" +
    "  <wsdl:part name='int_floatReturn' type='xsd:float'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='double_doubleResponse'>" +
    "  <wsdl:part name='double_doubleReturn' type='xsd:double'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='int_doubleRequest'>" +
    "  <wsdl:part name='n' type='xsd:int'/>" +
    " </wsdl:message>" +
    
    " <wsdl:message name='stringsRequest'>" +
    "  <wsdl:part name='str' type='xsd:string'/>" +
    "  <wsdl:part name='n' type='xsd:int'/>" +
    " </wsdl:message>" +
    
    " <wsdl:portType name='LPSTest'>" +
    "  <wsdl:operation name='reverse' parameterOrder='str'>" +
    "   <wsdl:input message='impl:reverseRequest' name='reverseRequest'/>" +
    "   <wsdl:output message='impl:reverseResponse' name='reverseResponse'/>" +
    "  </wsdl:operation>" +
    " </wsdl:portType>" +
    
    " <wsdl:binding name='LPSTestSoapBinding' type='impl:LPSTest'>" +
    "  <wsdlsoap:binding style='rpc' transport='http://schemas.xmlsoap.org/soap/http'/>" +
    "  <wsdl:operation name='reverse'>" +
    "   <wsdlsoap:operation soapAction=''/>" +
    "   <wsdl:input name='reverseRequest'>" +
    "    <wsdlsoap:body encodingStyle='http://schemas.xmlsoap.org/soap/encoding/' namespace='http://DefaultNamespace' use='encoded'/>" +
    "   </wsdl:input>" +
    "   <wsdl:output name='reverseResponse'>" +
    "    <wsdlsoap:body encodingStyle='http://schemas.xmlsoap.org/soap/encoding/' namespace='http://localhost:8080/lps-dev/test/rpc/soap/java/LPSTest.jws' use='encoded'/>" +
    "   </wsdl:output>" +
    "  </wsdl:operation>" +
    " </wsdl:binding>" +
    
    " <wsdl:portType name='FOOTest'>" +
    "  <wsdl:operation name='fooverse' parameterOrder='str'>" +
    "   <wsdl:input message='impl:reverseRequest' name='reverseRequest'/>" +
    "   <wsdl:output message='impl:reverseResponse' name='reverseResponse'/>" +
    "  </wsdl:operation>" +
    " </wsdl:portType>" +
    
    " <wsdl:binding name='FOOTestSoapBinding' type='impl:FOOTest'>" +
    "  <wsdlsoap:binding style='rpc' transport='http://schemas.xmlsoap.org/soap/http'/>" +
    "  <wsdl:operation name='fooverse'>" +
    "   <wsdlsoap:operation soapAction=''/>" +
    "   <wsdl:input name='reverseRequest'>" +
    "    <wsdlsoap:body encodingStyle='http://schemas.xmlsoap.org/soap/encoding/' namespace='http://DefaultNamespace' use='encoded'/>" +
    "   </wsdl:input>" +
    "   <wsdl:output name='reverseResponse'>" +
    "    <wsdlsoap:body encodingStyle='http://schemas.xmlsoap.org/soap/encoding/' namespace='http://localhost:8080/lps-dev/test/rpc/soap/java/LPSTest.jws' use='encoded'/>" +
    "   </wsdl:output>" +
    "  </wsdl:operation>" +
    " </wsdl:binding>" +
    
    " <!-- NOTE:  the key here is that each specified port has its own unique location URL --> " +
    
    " <wsdl:service name='LPSService1'>" +
    "  <wsdl:port binding='impl:LPSTestSoapBinding' name='LPSTest'>" +
    "   <wsdlsoap:address location='http://localhost:8080/LPSService1/LPSTest/location'/>" +
    "  </wsdl:port>" +
    "  <wsdl:port binding='impl:FOOTestSoapBinding' name='FOOTest'>" +
    "   <wsdlsoap:address location='http://localhost:8080/LPSService1/FOOTest/location'/>" +
    "  </wsdl:port>" +
    " </wsdl:service>" +
    
    " <wsdl:service name='LPSService2'>" +
    "  <wsdl:port binding='impl:LPSTestSoapBinding' name='LPSTest'>" +
    "   <wsdlsoap:address location='http://localhost:8080/LPSService2/LPSTest/location'/>" +
    "  </wsdl:port>" +
    "  <wsdl:port binding='impl:FOOTestSoapBinding' name='FOOTest'>" +
    "   <wsdlsoap:address location='http://localhost:8080/LPCService2/FOOTest/location'/>" +
    "  </wsdl:port>" +
    " </wsdl:service>" +
    
    "</wsdl:definitions>";
}
