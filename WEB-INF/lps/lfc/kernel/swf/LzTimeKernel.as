/**
  * LzTimeKernel.as
  *
  * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.
  *            Use is subject to license terms.
  *
  * @topic Kernel
  * @subtopic AS2
  */

// Receives and sends timing events
var LzTimeKernel = {
    setTimeout: setTimeout
    ,setInterval: setInterval
    ,clearTimeout: clearTimeout
    ,clearInterval: clearInterval

    // Implement actionscript API to get ms since startup time 
    ,startTime: (new Date()).valueOf()   
    ,getTimer: function() {
        return (new Date()).valueOf() - LzTimeKernel.startTime;
    }    
}

if ($swf7) {
    LzTimeKernel.setTimeout = function setTimeout() {
        // workaround for missing method in Flash 7 player
        // See http://jira.openlaszlo.org/jira/browse/LPP-2270
        var arg = arguments;

        if( typeof arg[0] != "function" ) arg[0] = arg.shift()[arg[0]];

        var func = function() {
            clearInterval( Number( arg[1] ) );
            arg[0].apply( null, arg.slice( 2 ) );
        }
        return (arg[1] = setInterval( func, arg[1] ));
    }
    LzTimeKernel.clearTimeout = function( id ){
        return clearInterval(id);
    }
}
