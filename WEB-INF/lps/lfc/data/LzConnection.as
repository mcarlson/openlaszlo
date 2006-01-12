/******************************************************************************
 * LzConnection.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//==============================================================================
// DEFINE OBJECT:
// LzConnection multiplexes all incoming data from a persistent connection into
// a connection datasource's dataset (see LzConnectionDatasource).
//==============================================================================
var LzConnection = Class("LzConnection", LzHTTPDatasource);

//==============================================================================
// LzAgent is a placeholder to silence warnings about undefined
// classes -- the tag is permitted in a connection but only used
// on the server side
// @keywords private
//==============================================================================
var LzAgent = function () {};

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzDataset.prototype.setters.authparam = "setAuthParam";


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.construct = function (parent, args)
{
    // public attributes
    this.name = "connection";
    this.type = "connection";
    args.name = this.name;
    args.type = this.type;

    super.construct( parent, args);

    if (args.group) {
        this.group = args.group;
    }

    // min is 1000ms (public)
    if (typeof(args.heartbeat) == 'undefined' || args.heartbeat < 1000) {
        this.heartbeat = 5000;
    } else {
        this.heartbeat = args.heartbeat;
    }

    // min is 1000ms (public)
    if (typeof(args.timeout) == 'undefined' || 
        args.timeout < 1000 || 
        args.timeout < args.heartbeat) {
        this.timeout = this.heartbeat * 4;
    } else {
        this.timeout = args.timeout;
    }

    // java authenticator class and its parameters (public)
    this.authenticator = args.authenticator;
    if (typeof(args.authparam) == 'undefined') {
        this.setAuthParam('');
    } else {
        this.setAuthParam(args.authparam);
    }

    // private attributes

    // We don't want to display the waitcursor for persistent connections
    // (private - from LzDataSource)
    this.waitcursor = false;

    // connected flag (private)
    this.__LZisConnected = false;

    // secure flag
    var url = new _root.LzURL(_root._url);
    if (url.protocol == "https") {
        this.__LZisSecure = true;
        this.__LZsecurePort = url.port;
    } else {
        this.__LZisSecure = args.secure;
        this.__LZsecurePort = args.secureport;
    }

    // loader (private)
    this.__LZloader = this.getNewLoader(true);
    this.__LZloader.doCacheRequest = false;
    this.__LZloader.doPersist = true;
    this.__LZloader.timeout = null;
    if (this.__LZisSecure) {
        this.__LZloader.secure = this.__LZisSecure;
        this.__LZloader.secureport = this.__LZsecurePort;
    }
    new _root.LzDelegate(this, "__LZgotData", this.__LZloader, "ondata");
    new _root.LzDelegate(this, "__LZgotError", this.__LZloader, "onerror");

    // timeout delegate (private)
    this.__LZtimeoutDel = new _root.LzDelegate(this , "__LZgotTimeout");

    // connection datasources attach their datasets here
    this.__LZdatasources = {};

    // username, session id and connection id 
    this.__LZusr = null;
    this.__LZsid = null;
    this.__LZcid = null;

    // disconnect and session datasets
    this.disconnectDset = new _root.LzDataset(this, {name: "disconnectDset", 
                                                     secure: this.__LZisSecure, 
                                                     secureport: this.__LZsecurePort } );

    this.loginDset = new _root.LzDataset(this, { name: "loginDset", 
                                                 secure: this.__LZisSecure, 
                                                 secureport: this.__LZsecurePort } );

    this.logoutDset = new _root.LzDataset(this, { name: "logoutDset", 
                                                 secure: this.__LZisSecure, 
                                                 secureport: this.__LZsecurePort } );

    this.loginDset.getresponseheaders = true;
    this.logoutDset.getresponseheaders = true;

    // Anonymous connection datasource name counter 
    this.__LZdsrcNameCounter = 0; 
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.init = function ()
{
    this.__LZisdebug = (typeof(_root.Debug) != "undefined");

}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZregisterDatasource = function (dsrc)
{
    var name = dsrc.name
    if (name == null) {
        name = '__LZconndsrc' + (this.__LZdsrcNameCounter++);
    }

    if ( this.__LZdatasources[name] == null ) {
        this.__LZdatasources[name] = dsrc;
    } else {
        _root.Debug.write("WARNING: connection datasource '" + name + "' already defined.");
    }
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZconnect = function (type)
{
    this.__LZloader.unload();     // make sure we unload previous connection.
    this.__LZloader.request( { lzt: "connect" , type: type, i: this.__LZcid, 
                               authparam: escape(this.authparam), 
                               debug: this.__LZisdebug, proxied: true } );
    _root.LzTimer.resetTimer(this.__LZtimeoutDel, this.timeout);
}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZunloadConnection = function ()
{
    if ( ! this.__LZunloadConnectionDel ) {
        this.__LZunloadConnectionDel = new _root.LzDelegate(this, "__LZunloadConnection1");
    }
    _root.LzIdle.callOnIdle( this.__LZunloadConnectionDel );

}

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZunloadConnection1 = function ()
{
    this.__LZloader.unload();
    this.__LZoninternaldisconnect.sendEvent(); 
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZreconnect = function ()
{
    this.__LZunloadConnection();
    if ( ! this.__LZreconnectDel ) {
        this.__LZreconnectDel = new _root.LzDelegate(this, "__LZreconnect1") 
    }
    this.__LZreconnectDel.register(this, "__LZoninternaldisconnect");
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZreconnect1 = function ()
{
    this.__LZreconnectDel.unregisterAll();
    this.__LZconnect("r");
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZgotTimeout = function ()
{
    this.clientDisconnect();
    this.__LZsendEvent('ontimeout');
}

//------------------------------------------------------------------------------
// Return error response.
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZgotError = function(error)
{
    _root.LzTimer.removeTimer(this.__LZtimeoutDel);
    this.__LZsendEvent('onerror', error);
    
    this.__LZisConnected = false;
    this.__LZusr = null;
    this.__LZsid = null;
    this.__LZcid = null;

    // just to be safe
    this.__LZunloadConnection();
}

//------------------------------------------------------------------------------
// This function makes sure the connection message gets delivered to the
// right dataset.
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZgotData = function(data)
{
    _root.LzTimer.resetTimer(this.__LZtimeoutDel, this.timeout);

    var name = data.childNodes[0].attributes.dset;

    if (data.childNodes[0].n == "error") {

        this.clientDisconnect();
        this.__LZsendEvent('onerror', data );

    } else if (name=="__LPSDORECONNECT") {

        this.__LZreconnect();

    } else if (name=="__LPSHB") {

        // don't report heartbeat
        // this.onheartbeat.sendEvent( this );

    } else if (name=="__LPSRECONNECTED") {

        this.__LZcid = data.childNodes[0].childNodes[0].childNodes[0].data;

    } else if (name=="__LPSCONNECTED") {

        this.__LZcid = data.childNodes[0].childNodes[0].childNodes[0].data;
        this.__LZsid = data.childNodes[0].childNodes[1].childNodes[0].data;
        this.__LZusr = data.childNodes[0].childNodes[2].childNodes[0].data;

        this.__LZisConnected = true;
        this.__LZsendEvent('onconnect');

        _root.LzTimer.resetTimer(this.__LZtimeoutDel, this.timeout);

    } else if (name=="__LPSUSERDISCONNECT") {

        this.__LZsendEvent('onuserdisconnect', 
                           data.childNodes[0].childNodes[0].data );

    } else {

        for (var d in this.__LZdatasources) {
            var dsrc = this.__LZdatasources[d];
            if (dsrc[name] != null) {
                // pass down just <root>
                dsrc[name].setData(data.childNodes[0]);
                dsrc.ondata.sendEvent( data.childNodes[0] );
            }
        }
        this.ondata.sendEvent( data.childNodes[0] );

    }
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZsendEvent = function (event, obj)
{
    this[event].sendEvent( obj );
    for (var d in this.__LZdatasources) {
        var dsrc = this.__LZdatasources[d];
        dsrc[event].sendEvent( obj );
    }
}


//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.toString = function()
{
    return "LzConnection '" + this.name + "'";
}


//------------------------------------------------------------------------------
// Close down the connection.
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.__LZdisconnect = function()
{
    _root.LzTimer.removeTimer(this.__LZtimeoutDel);
    
    this.__LZunloadConnection();
    this.__LZisConnected = false;

    this.__LZusr = null;
    this.__LZsid = null;
    this.__LZcid = null;

    this.__LZsendEvent('ondisconnect');
}


//------------------------------------------------------------------------------
// Called by datasets
// @param LzDataset dset: passed by dataset calling parent
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.doRequest = function (dset) 
{
    var params = dset.getParams();
    var reqLoader = this.getLoaderForDataset(dset, true);

    // We don't want to cache requests
    reqLoader.doCacheRequest = false;

    var obj = { proxied: true };
    var keys = params.getNames();
    if (keys != null) {
        for ( var i = 0; i < keys.length; i++ ){
            var name = keys[ i ]; 
            obj[ name ] = params.getValue( name );
        }
    }

    reqLoader.request(obj);
}

//------------------------------------------------------------------------------
// Called by datasets.
// @keywords private
//------------------------------------------------------------------------------
LzConnection.prototype.processRawData = function (dset, data)
{
    dset.setData(data);
}

//==============================================================================
// Authenticate and session the application. The results from this call are 
// returned in the connection's loginDset.
// @param String usr: login userame
// @param String pwd: login password
//==============================================================================
LzConnection.prototype.login = function (usr, pwd)
{
    var dset = this.loginDset;
    dset.setQueryParams( { lzt: "connectionlogin", usr: escape(usr), 
                           pwd: escape(pwd), debug: this.__LZisdebug, 
                           proxied: true } );
    dset.doRequest();
}


//==============================================================================
// De-authenticate and unsession the application. The results from this call are 
// returned in the connection's logoutDset.
//==============================================================================
LzConnection.prototype.logout = function ()
{
    var dset = this.logoutDset;
    dset.setQueryParams( { lzt: "connectionlogout", debug: this.__LZisdebug,
                           proxied: true } );
    dset.doRequest();
}

//==============================================================================
// Establish a connection. An application typically must be sessioned before
// calling this method.
//==============================================================================
LzConnection.prototype.connect = function ()
{
    this.__LZconnect("");
}


//==============================================================================
// Disconnect connection. This also notifies the server to disconnect the
// application. The results from asking the server to disconnect are returned in
// the connection's disconnectDset. See clientDisconnect().
//==============================================================================
LzConnection.prototype.disconnect = function ()
{
    _root.LzTimer.removeTimer(this.__LZtimeoutDel);

    var dset = this.disconnectDset;
    dset.setQueryParams({lzt: "disconnect", i: this.__LZcid, 
                         authparam: escape(this.authparam),
                         debug: this.__LZisdebug, proxied: true });
    dset.doRequest();

    this.clientDisconnect();
}

//==============================================================================
// Disconnect connection, but don't notify server. See disconnect().
//==============================================================================
LzConnection.prototype.clientDisconnect = function ()
{
    this.__LZdisconnect();
}

//==============================================================================
// Send a message. The format of the message sent looks like:
//
//   <from name="name" />
//   message
//
// The results are returned in the connection's sendMessageDset dataset.
//
// @param String to: name(s), e.g., "victor,sam", or "*" for all users
// @param String mesg: message to send. This string will be XML escaped.
// @param String dest: destination connection dataset
// @param LzDataset result: function resultset 
// @keywords private
//==============================================================================
// TODO: [2003-10-06 pkang] show possible dataset results
LzConnection.prototype.__LZsendMessage = function (to, mesg, dest, result)
{
    var msg = 
    '<root dset="' + dest + '">' +
    '<from name="' + this.__LZusr + '" sid="' + this.__LZsid + '"/>' +
    _root.LzBrowser.xmlEscape(mesg) +
    '</root>';

    // makes call w/autorequest
    result.setQueryParams( { lzt: "message", to: to, msg: msg, 
                             authparam: escape(this.authparam),
                             debug: this.__LZisdebug, proxied: true } );
    result.doRequest();
}


//==============================================================================
// Send arbitrary XML. Result returned in
// LzConnection.sendXMLDset.
//
// @param String to: name(s), e.g., "victor,sam", or "*" for all users
// @param String xml: arbitrary XML message
// @param String dest: destination connection dataset
// @param LzDataset result: function resultset 
// @keywords private
//==============================================================================
// TODO: [2003-10-06 pkang] show possible dataset results
LzConnection.prototype.__LZsendXML = function (to, xml, dest, result)
{
    var msg = '<root dset="' + dest + '">' + xml + '</root>'

    // makes call w/autorequest
    result.setQueryParams( { lzt: "message", to: to, msg: msg, 
                             authparam: escape(this.authparam),
                             debug: this.__LZisdebug, proxied: true } );
    result.doRequest();
}

//==============================================================================
// Send arbitrary XML to users only (no agents). Result returned in
// LzConnection.sendXMLDset.
//
// @param String to: user name(s), e.g., "victor,sam", or "*" for all users
// @param String xml: arbitrary XML message
// @param String dest: destination connection dataset
// @param LzDataset result: function resultset 
// @keywords private
//==============================================================================
// TODO: [2003-10-06 pkang] show possible dataset results
LzConnection.prototype.__LZsendUserXML = function (to, xml, dest, result)
{
    var msg = '<root dset="' + dest + '">' + xml + '</root>'

    // makes call w/autorequest
    result.setQueryParams( { lzt: "message", to: to, msg: msg, 
                             range: "user", authparam: escape(this.authparam),
                             debug: this.__LZisdebug, proxied: true });
    result.doRequest();
}

//==============================================================================
// Send arbitrary XML to agents only (no users). Result returned in
// LzConnection.sendXMLDset.
//
// @param String to: agent name(s), e.g., "victor,sam", or "*" for all users
// @param String xml: arbitrary XML message
// @param LzDataset result: function resultset 
// @keywords private
//==============================================================================
// TODO: [2003-10-06 pkang] show possible dataset results
LzConnection.prototype.__LZsendAgentXML = function (to, xml, result)
{
    var msg = '<root>' + xml + '</root>'

    // makes call w/autorequest
    result.setQueryParams( { lzt: "message", to: to, msg: msg, 
                             range: "agent", authparam: escape(this.authparam), 
                             debug: this.__LZisdebug, proxied: true });
    result.doRequest();
}


//==============================================================================
// Verify which users are connected. Result returned in LzConnection.getListDset
// dataset.
//
// @param String users: name(s), e.g., "victor,sam", or "*" for all users
// @param LzDataset result: function resultset 
// @keywords private
//==============================================================================
// TODO: [2003-10-06 pkang] show possible dataset results
LzConnection.prototype.__LZgetList = function (users, result)
{
    result.setQueryParams( { lzt: "list", users: users, 
                             authparam: escape(this.authparam),
                             debug: this.__LZisdebug, proxied: true } );
    result.doRequest();
}


//==============================================================================
// Get connection's username.
// @return String: session username
//==============================================================================
LzConnection.prototype.getUsername = function ()
{
    return this.__LZusr;
}

//==============================================================================
// Get connection's session id.
// @return String: session id
//==============================================================================
LzConnection.prototype.getSID = function ()
{
    return this.__LZsid;
}

//==============================================================================
// Get parameters for authenticator.
// @return String: authenticator parameters
//==============================================================================
LzConnection.prototype.getAuthParam = function ()
{
    return this.authparam;
}

//==============================================================================
// Set paramaters for server authenticator.
// @param String authparam: a query string to pass the authenticator
//==============================================================================
LzConnection.prototype.setAuthParam = function (authparam)
{
    this.authparam = authparam;
}
