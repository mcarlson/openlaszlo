<library>
<include href="rpc.js" />
<include href="qname.js" />
<script>
<![CDATA[
#pragma 'warnUndefinedReferences=false' 

/* LZ_COPYRIGHT_BEGIN */
/****************************************************************************
 * Copyright (c) 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.       *
 * Use is subject to license terms                                          *
 ****************************************************************************/
/* LZ_COPYRIGHT_END */

//======================================================================
// DEFINE OBJECT: LzSOAP
//
// Implements an object to make remote java direct and XMLRPC calls.
//======================================================================
var LzSOAP = Class( "LzSOAP", LzRPC, function() {} );

// global SOAP service
LzSOAPService = new LzSOAP();


//------------------------------------------------------------------------------
// Map to store object references. Used by server to place references to other
// objects. For example, an object may contain two arrays, where objects in one
// array are the same objects as the other (multiRef).
//
// @keywords private
//------------------------------------------------------------------------------
LzSOAPService._m = {}

//------------------------------------------------------------------------------
// Create a SOAP object and return an object through delegate.
//
// @param LzDelegate delegate: delegate to call when object is returned.
//
// @param Object opts:
//      String wsdl: href for WSDL describing SOAP service. 
//      String service: SOAP service to use. If null, use first service
// encountered in WSDL.
//      String port: SOAP port to use. If null, use first SOAP port
// encountered in SOAP service
//
// @param Boolean secure: if true, make secure connection between client and the
// LPS. Default: false.
// @param Integer secureport: port to use for secure connection between client
// and the LPS. This is ignored if secure is false.
// @return sequence number of request to load object.
// ------------------------------------------------------------------------------
LzSOAP.prototype.loadObject = function(delegate, opts, secure, secureport){

    var o = this.__LZgetBasicLoadParams('GET');

    o['request'] = 'load';
    o['wsdl'] = opts['wsdl'];
    o['url'] = 'soap://soap';

    var service = opts['service']
    var port = opts['port']
    if (service != null && service != "") o['service'] = service;
    if (port != null && port != "") o['port'] = port;

    return this.request( o, delegate, secure, secureport );
}


//------------------------------------------------------------------------------
// invoke RPC style function
// @param LzDelegate delegate: delegate to call for returned value.
// @param Array args: array of parameter values.
// @param String header: header to pass with request.
// @param Array opts: 
//      String wsdl: WSDL for SOAP service.
//      String service: name of SOAP service to use.
//      String port: name of SOAP port.
//      String operation: name of operation to invoke.
//      Array parts: array of QName representing type of each arg.
// @param Boolean secure: if true, call between client and LPS will be secure.
// @param Number secureport: secure port to use for invocation, if secure is
// true.
// @return sequence number of request.
//------------------------------------------------------------------------------
LzSOAP.prototype.invoke = function (delegate, args, header, opts, secure, secureport) {

    if ( delegate.__proto__ != _root.LzDelegate.prototype ) {
        _root.Debug.write("ERROR: LzDelegate is required, got:", delegate);
        return;
    }

    var parts = opts['parts'];
    if (args.length != parts.length) {
        _root.Debug.write("wrong number of parameters; need " + 
                          parts.length + ", passed in " + args.length);
        return;
    }

    var o = this.__LZgetBasicLoadParams('POST');
    o['url']       = 'soap://soap';
    o['request']   = 'invoke';
    o['wsdl']      = opts['wsdl'];
    o['service']   = opts['service'];
    o['port']      = opts['port'];
    o['operation'] = opts['operation'];
    o['opstyle']   = opts['opstyle'];

    var body;
    if (o['opstyle'] == "rpc") {
        body = this.__LZencSerializeParams(args, parts);
    } else {
        body = this.__LZdocumentArgsToXML(args);
    }

    var h = '';
    if (typeof(header) == 'string') { 
        h = header;
    } else if ( header.__proto__ == _root.LzDataset.prototype ) {
        h = this.__LZserialize(header.childNodes)
    }

    o['lzpostbody'] = '<e><h>' + h + '</h><b>' + body + '</b></e>';

    // this information will be passed back up ondata
    o['opinfo'] = { operation: o['operation'], opstyle: o['opstyle'] }

    return this.request( o, delegate, secure, secureport );
}

//------------------------------------------------------------------------------
// @param Array elArray: an array of elements
//------------------------------------------------------------------------------
LzSOAP.prototype.__LZserialize = function (elArr) {
    var ser;
    for (var i=0; i < elArr.length; i++) {
        ser += elArr[i].serialize();
    }
    return ser;
}


//------------------------------------------------------------------------------
// Serialize parameters using encoding.
// @keywords private
//------------------------------------------------------------------------------
LzSOAP.prototype.__LZencSerializeParams = function (args, parts) {

    // FIXME [2005-05-15 pkang]: server should return default namespaces for xsi
    // and soapenc. can't assume these defaults will hold true for all services.
    var xsiNS = _root.LzNamespace.URI_DEFAULT_SCHEMA_XSI;
    var soapencNS = _root.LzNamespace.URI_DEFAULT_SOAP_ENC;

    // counter reference to use for namespaces
    var cr = [ 0 ];
    var xml = "<params xmlns:xsi=\"" + xsiNS
        + "\" xmlns:soapenc=\"" + soapencNS + "\">\n";

    for (var i=0; i < args.length; i++) {
        xml += this.__LZencSerialize(args[i], parts[i][0], parts[i][1], cr);
    }
    xml += "</params>\n";
//  _root.Debug.write("---- xml ----\n" + xml);
    return xml;
}


//------------------------------------------------------------------------------
// Serialize value using encoding.
//
// @param value: simple type value.
// @param element: element name.
// @param typeQ: QName for type of value.
// @param cr: counter reference for namespaces.
// @keywords private
//------------------------------------------------------------------------------
LzSOAP.prototype.__LZencSerialize = function (value, element, typeQ, cr) {

    var ct = _root.LzNamespace.getType(typeQ);

// _root.Debug.write('xxx', ct, typeQ, _root.QName.isSupported(typeQ));

    // if not an array or object
    if ( ! ct['arraytype'] && ! ct['members'] ) {
        // see if simple type is supported
        if (_root.QName.isSupported(typeQ)) {
            return this.__LZencSerializeSimple(value, element, typeQ, cr);
        }
    }

    // function == null is true in javascript, so we check for type instead.
    // if we don't find a prototype, it means that this type doesn't exist.
    if (typeof(ct) != 'function') {
        _root.Debug.write("skipping unsupported type", typeQ);
        return "";
    } 

    if (ct['arraytype'] != null) {
        return this.__LZencSerializeArray(value, element, ct.arraytype, cr);
    } else { // it's an object
        return this.__LZencSerializeStruct(value, element, typeQ, cr);
    }

}

//------------------------------------------------------------------------------
// Serialize a simple type value using encoding.
//
// @param simplevalue: simple type value.
// @param element: element name.
// @param typeQ: QName for type of value.
// @param cr: counter reference for namespaces.
// @keywords private
//------------------------------------------------------------------------------
LzSOAP.prototype.__LZencSerializeSimple = function (simplevalue, element, typeQ, cr) {
   var ns = "ns" + (cr[0]++);
   var xml = "<" + element + " " + ns + ":type=\""
       + ns + ":" + typeQ.getLocalPart() + "\""
       + " xmlns:" + ns + "=\"" + typeQ.getNamespaceURI() + "\">"
       + _root.LzBrowser.xmlEscape(simplevalue) + "</" + element + ">\n";
   return xml;
}


//------------------------------------------------------------------------------
// Serialize a struct using encoding.
//
// @param obj: object value.
// @param element: element name.
// @param typeQ: QName for type of value.
// @param cr: counter reference for namespaces.
// @keywords private
//------------------------------------------------------------------------------
LzSOAP.prototype.__LZencSerializeStruct = function (obj, element, typeQ, cr) {
    var ns = "ns" + (cr[0]++);
    var ct = _root.LzNamespace.getType(typeQ);
    var members = ct.members;

    var typeLocal = typeQ.getLocalPart();
    var xml = "<" + element + " xsi:type=\"" + ns + ":" + typeLocal + "\"" 
        + " xmlns:" + ns + "=\"" + typeQ.getNamespaceURI() + "\">\n";
    for (var k in members) {
        if (typeof(obj[k]) != 'undefined') {
            xml += this.__LZencSerialize(obj[k], k, members[k], cr);
        }
    }
    xml += "</" + element + ">\n";

    return xml;
}


//------------------------------------------------------------------------------
// Serialize an array using encoding.
//
// @param arr: array value.
// @param element: element name.
// @param typeQ: QName for type of value.
// @param cr: counter reference for namespaces.
// @keywords private
//------------------------------------------------------------------------------
LzSOAP.prototype.__LZencSerializeArray = function (arr, element, typeQ, cr) {
// _root.Debug.write('xxx LZencSerializeArray');

    var ns = "ns" + (cr[0]++);
    var size = (arr == null ? 0 : arr.length);
    var xml = "<" + element + " xsi:type=\"soapenc:Array\" soapenc:arrayType=\"" 
        + ns + ":" + typeQ.getLocalPart() + "[" + size + "]\" xmlns:" 
        + ns + "=\"" + typeQ.getNamespaceURI() + "\">\n";

    for (var i=0; i < size; i++) {
// _root.Debug.write('    ', i, arr[i], typeQ, cr );
        xml += this.__LZencSerialize(arr[i], "item", typeQ, cr);
    }

    xml += "</" + element + ">\n";

    return xml;
}


//------------------------------------------------------------------------------
// Create XML for documents. Assume all args are XML strings.
// @keywords private
//------------------------------------------------------------------------------
LzSOAP.prototype.__LZdocumentArgsToXML = function (args) {
    var xml = "<params>";
    for (var i=0; i < args.length; i++) {
        var a = args[i];
        if ( a.__proto__ == _root.LzDataset.prototype ) {
            a = this.__LZserialize(a.childNodes);
        }
        xml += "<param>" + escape(a) + "</param>";
    }
    return xml += "</params>";
}



//------------------------------------------------------------------------------
// Create prototypes and add it to stubinfo
//
// @keywords private
//------------------------------------------------------------------------------
LzSOAP.prototype.__LZloadHook = function (stubinfo) {

    // service object has been received
    var proto = this.__LZcreatePrototypes(data);

    var typeinfo = stubinfo.__LZctypes;

    if (typeinfo == null) return null;

    var nsMap = {};

    // Namespace stuff can be done more efficient, but don't have time :( -pk
    for (var ct in typeinfo) {
        var ti = typeinfo[ct];

        // WSDLs can have multiple schemas with different namespaces
        var nsURI = ti.ns;
        if ( _root.LzNamespace.ns[nsURI] == null ) {
            _root.LzNamespace.ns[nsURI] = new _root.LzNamespace(nsURI);
        }
        var ns = _root.LzNamespace.ns[nsURI];

        ns[ct] = function () {};
        ns[ct].name = ct; // name to give the function
        ns[ct].ns = ns;

        nsMap[nsURI] = ns;

        if (ti.type == "struct") {
            ns[ct].members = ti['members'];
        } else if (ti.type == "array") {
            ns[ct].arraytype = ti['typeQ'];
        }
    }

    // add proto to stubinfo
    stubinfo.proto = ns;
    stubinfo.protoMap = nsMap;
}


//------------------------------------------------------------------------------
// Prototype an object based on namespace and classname. If prototype doesn't 
// exist, we leave the object alone. There's code in the server code under
// remote.soap.encoding.SWFObjectDeserializer that create SWF bytes that call
// this function.
//
// @param obj: object to correctly prototype.
// @keywords private
//------------------------------------------------------------------------------
LzSOAP.prototype.__LZnormObj = function (obj) {
    var ns = _root.LzNamespace.ns[obj.__LZclassnamespace];
    var type = ns ? ns[obj.__LZclassname] : null;
    if (typeof(type) == 'function') {
        obj.__proto__ = type.prototype;
    }
// _root.Debug.write('xxx', obj.__proto__, ',', obj);
    return obj;
}

]]>
</script>
</library>

<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- @LZX_VERSION@                                                         -->
