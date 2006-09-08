/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/


// some setup to fake what the html embed does 
LzApplicationRoot = '/coal';
window = this;
this._root = this;
var top = this; 
var Debug = {};
var __nexttimerid = 1;
var setTimeout = function() { return __nexttimerid++; }
var setInterval = function() { return __nexttimerid++; }
var clearTimeout = function() { }
var clearInterval = function() { }
var LzIdle = {};
function getVersion() {
    return "rhino-coal"; 
}
var navigator = {userAgent: "lztest",
                appVersion: "1.5R3",
                vendor: "openlaszlo",
                platform: "unknown"}; // This is expected to be in the top level namespace. 

// Cover up a few functions that trouble us
LzIdle.update = function() { }

// Make a log file for us to write results to
var lzjumReportWriter = new java.io.FileWriter("lzjum.log", true);
// Make all calls to the debug output go to a file
_dbg_log_all_writes = true; 

// Make the platform debugger's output function call rhino's print function, so we get
// console output in rhino. 
Debug.addText = function( s ) {
    print( s ); 
}

Debug.info = function( s ) {
    // Write the message out to a file
    lzjumReportWriter.write( "info: " + s ); 
} 

Debug.error = function( s ) {
    // Write the message out to a file
    print("error: " + s);
    lzjumReportWriter.write( "error: " + s ); 
} 

// Log to lzjum.log. This does not seem to work [ben 4.19.06]
Debug.log = function( s ) {
    // Write the message out to a file
    lzjumReportWriter.write( s ); 
}

