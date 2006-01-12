/******************************************************************************
 * LzCommand.as 
 *****************************************************************************/

//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

//=============================================================================
// A command is an object that sends an event in response to keyboard input.
//
// @field [String] keys: array of keys (strings) that, when pressed together,
// cause the onselect event of the command to be sent.
// @field Boolean active: true if the command is currently active.
// The default is <i>true</i>.
// @event onselect: If the command is active, this event is sent
// when the keys array are pressed simultaneously.
//=============================================================================
var LzCommand = Class( "LzCommand" , LzNode );

LzCommand.prototype.active = true;

// @field [String] key: Use setAttribute or setKeys to set the group
// of keys associated with this command from JavaScript.  For example:
// setAttribute('key', ['a', 'shift']) or setKeys(['j', 'control'])
LzCommand.prototype.setters.key = "setKeys";

//------------------------------------------------------------------------------
// @keywords private
//------------------------------------------------------------------------------
LzCommand.prototype.construct = function ( parent , args ){
    super.construct( parent , args );
}

//------------------------------------------------------------------------------
// This registers the given key array so that the command is executed when the
// key array is pressed.
// @param [String] k: An array of keys, given as strings. 
//------------------------------------------------------------------------------
LzCommand.prototype.setKeys = function ( k ){
    this.keys = k;
    _root.LzKeys.callOnKeyCombo( this , k );
}

//------------------------------------------------------------------------------
// Sends the command's onselect event.
// @param any d: this optional parameter is passed to the onselect event
//------------------------------------------------------------------------------
LzCommand.prototype.execute = function ( d ){
    if ( this.active ){
        this.onselect.sendEvent( d );
    }
}

//-----------------------------------------------------------------------------
// This is a utility method that returns a string that describes the key 
// combination that causes this command to be invoked.
//
// @return String: A string containing the key combination that causes this
// command to be invoked.
//-----------------------------------------------------------------------------
LzCommand.prototype.keysToString = function ( ){
    var DisplayKeys = {control:"Ctrl", shift:"Shift", alt:"Alt"}
    var s= ""
    var k = ""
    var l= this.keys.length;
    for( var i=0; i<l-1; i++ ){
        k = this.keys[i];
        if (k=="Control") k="Ctrl";
        s = s + k + "+"
    }
    k = this.keys[i];
    if (k=="Control") k="Ctrl";
    s = s + k;
    return s;
}
