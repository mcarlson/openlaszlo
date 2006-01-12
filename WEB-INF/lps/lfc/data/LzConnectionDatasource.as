/******************************************************************************
 * LzConnectionDatasource.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT:
// Datasource object for persistent connections.
//==============================================================================

var LzConnectionDatasource = Class("LzConnectionDatasource", LzDatasource);

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnectionDatasource.prototype.construct = function (parent, args )
{
    super.construct( parent, args);

    // result datasets
    this.sendMessageDset = new _root.LzDataset(this, { name: "sendMessageDset" } );
    this.sendXMLDset     = new _root.LzDataset(this, { name: "sendXMLDset" } );
    this.getListDset     = new _root.LzDataset(this, { name: "getListDset" } );
    this.sendMessageDset.queuerequests = true;
    this.sendXMLDset.queuerequests = true;
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnectionDatasource.prototype.init = function ()
{
    // TODO: [2003-09-29 pkang] check that connection is LzConnection.
    if ( _root.connection == null ) {
        _root.Debug.write("WARNING: connection has not been defined in the canvas.");
        return;
    }

    this.__LZisSecure   = _root.connection.__LZisSecure;
    this.__LZsecurePort = _root.connection.__LZsecurePort;

    this.sendMessageDset.secure = this.__LZisSecure; 
    this.sendMessageDset.secureport = this.__LZsecurePort;
    this.sendXMLDset.secure = this.__LZisSecure;
    this.sendXMLDset.secureport = this.__LZsecurePort;
    this.getListDset.secure = this.__LZisSecure;
    this.getListDset.secureport = this.__LZsecurePort;

    // Name of connection datasource defined after construct, so wait til init
    // to register with connection manager.
    if ( _root.connection != null ) {
        _root.connection.__LZregisterDatasource(this);
    }
}

//------------------------------------------------------------------------------
// Called by LzDataset.
// @keywords private
//------------------------------------------------------------------------------
LzConnectionDatasource.prototype.processRawData = function (dset, data)
{
    dset.setData(data);
}

//------------------------------------------------------------------------------
// @param LzDataset dset: passed by dataset calling parent
// @keywords private
//------------------------------------------------------------------------------
LzConnectionDatasource.prototype.doRequest = function (dset) 
{
    var params = dset.getParams();
    var reqLoader = this.getLoaderForDataset(dset, true);

    // We don't want to cache requests
    reqLoader.doCacheRequest = false;

    var obj = {};
    for ( var k in params.d ) {
        var v = params.d[k];
        var key = v[0];
        var val = v[1];
        obj[key] = val;
    }

    reqLoader.request(obj);
}


//==============================================================================
// Send a message. The results are returned in the datasource's sendMessageDset
// dataset. The format of the message sent looks like:
//
// <pre extract="false">
//   &lt;from name="name" /&gt;
//   message
// </pre>
//
// @param String to: name(s), e.g., "victor,sam", or "*" for all users
// @param String mesg: message to send. This string will be XML escaped.
// @param String dest: destination connection dataset
//==============================================================================
LzConnectionDatasource.prototype.sendMessage = function (to, mesg, dest)
{
    _root.connection.__LZsendMessage(to, mesg, dest, this.sendMessageDset);
}

//==============================================================================
// Send arbitrary XML. Result returned in the datasource's sendXMLDset.
//
// The results are returned in the datasource's sendXMLDset dataset.
//
// @param String to: name(s), e.g., "victor,sam", or "*" for all users
// @param String xml: arbitrary XML message
// @param String dest: destination connection dataset
//==============================================================================
LzConnectionDatasource.prototype.sendXML = function (to, xml, dest)
{
    _root.connection.__LZsendXML(to, xml, dest, this.sendXMLDset);
}

//==============================================================================
// Send arbitrary XML to users only (no agents). Result returned in
// the datasource's sendXMLDset dataset.
//
// @param String to: user name(s), e.g., "victor,sam", or "*" for all users
// @param String xml: arbitrary XML message
// @param String dest: destination connection dataset
//==============================================================================
LzConnectionDatasource.prototype.sendUserXML = function (to, xml, dest)
{
    _root.connection.__LZsendUserXML(to, xml, dest, this.sendXMLDset);
}

//==============================================================================
// Send arbitrary XML to agents only (no users). Result returned in
// the datasource's sendXMLDset dataset.
//
// @param String to: agent name(s), e.g., "victor,sam", or "*" for all users
// @param String xml: arbitrary XML message
//==============================================================================
LzConnectionDatasource.prototype.sendAgentXML = function (to, xml)
{
    _root.connection.__LZsendAgentXML(to, xml, this.sendXMLDset);
}

//==============================================================================
// Verify which users are connected. Result returned in the datasource's 
// getListDset dataset.
//
// @param String users: name(s), e.g., "victor,sam", or "*" for all users
//==============================================================================
LzConnectionDatasource.prototype.getList = function (users)
{
    _root.connection.__LZgetList(users, this.getListDset);
}

//------------------------------------------------------------------------------
// Get string representation of connection datasource.
// @return String: representation of this object
// @keywords private
//------------------------------------------------------------------------------
LzConnectionDatasource.prototype.toString = function() {
    return "LzConnectionDatasource '" + this.name + "'";
}
