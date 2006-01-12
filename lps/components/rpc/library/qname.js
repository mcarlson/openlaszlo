<library>
<include href="namespace.js" />
<script>
<![CDATA[
#pragma 'warnUndefinedReferences=false' 

/* LZ_COPYRIGHT_BEGIN */
/****************************************************************************
 * Copyright (c) 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.       *
 * Use is subject to license terms                                          *
 ****************************************************************************/
/* LZ_COPYRIGHT_END */


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

QName.SUPPORTED_TYPES = {};

//-----------------------------------------------------------------------------
// String representation of this QName.
//-----------------------------------------------------------------------------
QName.prototype.toString = function () {
    return "QName {" + this.__LZns + "}" + this.__LZlocal;
}

//=============================================================================
// DEFINE OBJECT: QName
//
// Create a qualified name object.
//
// @param local: local part of the QName.
// @param namespaceURI: namespace URI for the QName.
//==============================================================================
function QName(local, namespaceURI)
{
    this.__LZlocal = local;
    this.__LZns = namespaceURI;
    QName.SUPPORTED_TYPES[this.toString()] = true;
}

//-----------------------------------------------------------------------------
// QName simple XSD type constants
//-----------------------------------------------------------------------------
QName.XSD_STRING =
    new _root.QName("string", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_BOOLEAN =
    new _root.QName("boolean", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_DOUBLE =
    new _root.QName("double", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_FLOAT =
    new _root.QName("float", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_INT =
    new _root.QName("int", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_INTEGER =
    new _root.QName("integer", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_LONG =
    new _root.QName("long", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_SHORT =
    new _root.QName("short", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_BYTE =
    new _root.QName("byte", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_DECIMAL =
    new _root.QName("decimal", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_BASE64 =
    new _root.QName("base64Binary", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_HEXBIN =
    new _root.QName("hexBinary", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_ANYTYPE =
    new _root.QName("anyType", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_ANY =
    new _root.QName("any", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_QNAME =
    new _root.QName("QName", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_DATETIME =
    new _root.QName("dateTime", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_DATE =
    new _root.QName("date", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_TIME =
    new _root.QName("time", _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD);
QName.XSD_TIMEINSTANT1999 =
    new _root.QName("timeInstant", _root.LzNamespace.URI_1999_SCHEMA_XSD);
QName.XSD_TIMEINSTANT2000 =
    new _root.QName("timeInstant", _root.LzNamespace.URI_2000_SCHEMA_XSD);

QName.XSD_NORMALIZEDSTRING = 
    new _root.QName("normalizedString", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_TOKEN = 
    new _root.QName("token", _root.LzNamespace.URI_2001_SCHEMA_XSD);

QName.XSD_UNSIGNEDLONG = 
    new _root.QName("unsignedLong", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_UNSIGNEDINT = 
    new _root.QName("unsignedInt", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_UNSIGNEDSHORT = 
    new _root.QName("unsignedShort", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_UNSIGNEDBYTE = 
    new _root.QName("unsignedByte", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_POSITIVEINTEGER = 
    new _root.QName("positiveInteger", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_NEGATIVEINTEGER = 
    new _root.QName("negativeInteger", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_NONNEGATIVEINTEGER = 
    new _root.QName("nonNegativeInteger", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_NONPOSITIVEINTEGER = 
    new _root.QName("nonPositiveInteger", _root.LzNamespace.URI_2001_SCHEMA_XSD);

QName.XSD_YEARMONTH = 
    new _root.QName("gYearMonth", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_MONTHDAY = 
    new _root.QName("gMonthDay", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_YEAR = 
    new _root.QName("gYear", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_MONTH = 
    new _root.QName("gMonth", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_DAY = 
    new _root.QName("gDay", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_DURATION = 
    new _root.QName("duration", _root.LzNamespace.URI_2001_SCHEMA_XSD);

QName.XSD_NAME = 
    new _root.QName("Name", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_NCNAME = 
    new _root.QName("NCName", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_NMTOKEN = 
    new _root.QName("NMTOKEN", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_NMTOKENS = 
    new _root.QName("NMTOKENS", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_NOTATION = 
    new _root.QName("NOTATION", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_ENTITY = 
    new _root.QName("ENTITY", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_ENTITIES = 
    new _root.QName("ENTITIES", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_IDREF = 
    new _root.QName("IDREF", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_IDREFS = 
    new _root.QName("IDREFS", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_ANYURI = 
    new _root.QName("anyURI", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_LANGUAGE = 
    new _root.QName("language", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_ID = 
    new _root.QName("ID", _root.LzNamespace.URI_2001_SCHEMA_XSD);
QName.XSD_SCHEMA = 
    new _root.QName("schema", _root.LzNamespace.URI_2001_SCHEMA_XSD);

//-----------------------------------------------------------------------------
// QName SOAP encoding constants
//-----------------------------------------------------------------------------
QName.SOAP_BASE64 = 
    new _root.QName("base64", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_BASE64BINARY = 
    new _root.QName("base64Binary", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_STRING = 
    new _root.QName("string", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_BOOLEAN = 
    new _root.QName("boolean", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_DOUBLE = 
    new _root.QName("double", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_FLOAT = 
    new _root.QName("float", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_INT = 
    new _root.QName("int", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_LONG = 
    new _root.QName("long", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_SHORT = 
    new _root.QName("short", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_BYTE = 
    new _root.QName("byte", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_INTEGER = 
    new _root.QName("integer", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_DECIMAL = 
    new _root.QName("decimal", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_ARRAY = 
    new _root.QName("Array", _root.LzNamespace.URI_DEFAULT_SOAP_ENC);
QName.SOAP_ARRAY12 = 
    new _root.QName("Array", _root.LzNamespace.URI_SOAP12_ENC);

//------------------------------------------------------------------------------
// Get the local part of this QName.
//------------------------------------------------------------------------------
QName.prototype.getLocalPart = function () {
    return this.__LZlocal;
}

//------------------------------------------------------------------------------
// Get the namespace for this QName.
//------------------------------------------------------------------------------
QName.prototype.getNamespaceURI = function () {
    return this.__LZns;
}

//------------------------------------------------------------------------------
// Compare this QName with another QName object.
// @param qname: QName to compare against.
// @return true if qame's local part and namespace URI are the same as this
// QName's.
//------------------------------------------------------------------------------
QName.prototype.equals = function (qname) {
    return this.__LZlocal == qname.__LZlocal &&
    this.__LZns == qname.__LZns;
}

//------------------------------------------------------------------------------
// Lifted from Apache AXIS org.apache.axis.Constants.equals(QName, QName).
//
// The first QName is the current version of the name. The second QName is
// compared with the first considering all namespace uri versions.
//
// @param first: currently supported QName
// @param second: any QName
//------------------------------------------------------------------------------
QName.equals2 = function (first, second) {
    if (first == second) {
        return true;
    }
    if (first == null || second == null) {
        return false;
    }
    if (first.equals(second)) {
        return true;
    }
    if ( first.getLocalPart() != second.getLocalPart() ) {
        return false;
    }

    var namespaceURI = first.getNamespaceURI();
    var search = null;
    if (namespaceURI == _root.LzNamespace.URI_DEFAULT_SOAP_ENC) {
        search = _root.LzNamespace.URIS_SOAP_ENC;
    } else if (namespaceURI == _root.LzNamespace.URI_DEFAULT_SOAP_ENV) {
        search = _root.LzNamespace.URIS_SOAP_ENV;
    } else if (namespaceURI == _root.LzNamespace.URI_DEFAULT_SCHEMA_XSD) {
        search = _root.LzNamespace.URIS_SCHEMA_XSD;
    } else if (namespaceURI == _root.LzNamespace.URI_DEFAULT_SCHEMA_XSI) {
        search = _root.LzNamespace.URIS_SCHEMA_XSI;
    } else {
        search = [ namespaceURI ];
    }

    for (var i=0; i < search.length; i++) {
        if ( search[i] == second.getNamespaceURI() ) {
            return true;
        }
    }
    return false;
}


//------------------------------------------------------------------------------
// Check to see if qname is a supported primitive type. 
//
// @param QName qn: qname to check to see if it's a supported primitive type.
// @return true if supported, else false.
//------------------------------------------------------------------------------
QName.isSupported = function (qn) {
    return (!!this.SUPPORTED_TYPES[qn.toString()]);
}

]]>
</script>
</library>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- @LZX_VERSION@                                                         -->
