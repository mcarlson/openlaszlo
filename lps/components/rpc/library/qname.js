<library>
<include href="namespace.js" />
<script when="immediate">
<![CDATA[

/* LZ_COPYRIGHT_BEGIN */
/****************************************************************************
 * Copyright (c) 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.       *
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

//=============================================================================
// DEFINE OBJECT: QName
//
// Create a qualified name object.
//
// @param local: local part of the QName.
// @param namespaceURI: namespace URI for the QName.
//==============================================================================
class QName {

var __LZns;
var __LZlocal;

function QName(local, namespaceURI)
{
    this.__LZlocal = local;
    this.__LZns = namespaceURI;
    QName.SUPPORTED_TYPES[this.toString()] = true;
}

static var SUPPORTED_TYPES = {};

//-----------------------------------------------------------------------------
// String representation of this QName.
//-----------------------------------------------------------------------------
function toString () {
    return "QName {" + this.__LZns + "}" + this.__LZlocal;
}

//-----------------------------------------------------------------------------
// QName simple XSD type constants
//-----------------------------------------------------------------------------
static var XSD_STRING =
    new QName("string", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_BOOLEAN =
    new QName("boolean", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_DOUBLE =
    new QName("double", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_FLOAT =
    new QName("float", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_INT =
    new QName("int", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_INTEGER =
    new QName("integer", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_LONG =
    new QName("long", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_SHORT =
    new QName("short", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_BYTE =
    new QName("byte", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_DECIMAL =
    new QName("decimal", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_BASE64 =
    new QName("base64Binary", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_HEXBIN =
    new QName("hexBinary", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_ANYTYPE =
    new QName("anyType", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_ANY =
    new QName("any", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_QNAME =
    new QName("QName", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_DATETIME =
    new QName("dateTime", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_DATE =
    new QName("date", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_TIME =
    new QName("time", LzNamespace.URI_DEFAULT_SCHEMA_XSD);
static var XSD_TIMEINSTANT1999 =
    new QName("timeInstant", LzNamespace.URI_1999_SCHEMA_XSD);
static var XSD_TIMEINSTANT2000 =
    new QName("timeInstant", LzNamespace.URI_2000_SCHEMA_XSD);

static var XSD_NORMALIZEDSTRING = 
    new QName("normalizedString", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_TOKEN = 
    new QName("token", LzNamespace.URI_2001_SCHEMA_XSD);

static var XSD_UNSIGNEDLONG = 
    new QName("unsignedLong", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_UNSIGNEDINT = 
    new QName("unsignedInt", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_UNSIGNEDSHORT = 
    new QName("unsignedShort", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_UNSIGNEDBYTE = 
    new QName("unsignedByte", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_POSITIVEINTEGER = 
    new QName("positiveInteger", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_NEGATIVEINTEGER = 
    new QName("negativeInteger", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_NONNEGATIVEINTEGER = 
    new QName("nonNegativeInteger", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_NONPOSITIVEINTEGER = 
    new QName("nonPositiveInteger", LzNamespace.URI_2001_SCHEMA_XSD);

static var XSD_YEARMONTH = 
    new QName("gYearMonth", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_MONTHDAY = 
    new QName("gMonthDay", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_YEAR = 
    new QName("gYear", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_MONTH = 
    new QName("gMonth", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_DAY = 
    new QName("gDay", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_DURATION = 
    new QName("duration", LzNamespace.URI_2001_SCHEMA_XSD);

static var XSD_NAME = 
    new QName("Name", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_NCNAME = 
    new QName("NCName", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_NMTOKEN = 
    new QName("NMTOKEN", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_NMTOKENS = 
    new QName("NMTOKENS", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_NOTATION = 
    new QName("NOTATION", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_ENTITY = 
    new QName("ENTITY", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_ENTITIES = 
    new QName("ENTITIES", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_IDREF = 
    new QName("IDREF", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_IDREFS = 
    new QName("IDREFS", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_ANYURI = 
    new QName("anyURI", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_LANGUAGE = 
    new QName("language", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_ID = 
    new QName("ID", LzNamespace.URI_2001_SCHEMA_XSD);
static var XSD_SCHEMA = 
    new QName("schema", LzNamespace.URI_2001_SCHEMA_XSD);

//-----------------------------------------------------------------------------
// QName SOAP encoding constants
//-----------------------------------------------------------------------------
static var SOAP_BASE64 = 
    new QName("base64", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_BASE64BINARY = 
    new QName("base64Binary", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_STRING = 
    new QName("string", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_BOOLEAN = 
    new QName("boolean", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_DOUBLE = 
    new QName("double", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_FLOAT = 
    new QName("float", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_INT = 
    new QName("int", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_LONG = 
    new QName("long", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_SHORT = 
    new QName("short", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_BYTE = 
    new QName("byte", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_INTEGER = 
    new QName("integer", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_DECIMAL = 
    new QName("decimal", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_ARRAY = 
    new QName("Array", LzNamespace.URI_DEFAULT_SOAP_ENC);
static var SOAP_ARRAY12 = 
    new QName("Array", LzNamespace.URI_SOAP12_ENC);

//------------------------------------------------------------------------------
// Get the local part of this QName.
//------------------------------------------------------------------------------
function getLocalPart () {
    return this.__LZlocal;
}

//------------------------------------------------------------------------------
// Get the namespace for this QName.
//------------------------------------------------------------------------------
function getNamespaceURI () {
    return this.__LZns;
}

//------------------------------------------------------------------------------
// Compare this QName with another QName object.
// @param qname: QName to compare against.
// @return true if qame's local part and namespace URI are the same as this
// QName's.
//------------------------------------------------------------------------------
function equals (qname) {
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
static function equals2 (first, second) {
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
    if (namespaceURI == LzNamespace.URI_DEFAULT_SOAP_ENC) {
        search = LzNamespace.URIS_SOAP_ENC;
    } else if (namespaceURI == LzNamespace.URI_DEFAULT_SOAP_ENV) {
        search = LzNamespace.URIS_SOAP_ENV;
    } else if (namespaceURI == LzNamespace.URI_DEFAULT_SCHEMA_XSD) {
        search = LzNamespace.URIS_SCHEMA_XSD;
    } else if (namespaceURI == LzNamespace.URI_DEFAULT_SCHEMA_XSI) {
        search = LzNamespace.URIS_SCHEMA_XSI;
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
static function isSupported (qn) {
    return (!!QName.SUPPORTED_TYPES[qn.toString()]);
}

]]>
</script>
</library>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- @LZX_VERSION@                                                         -->
