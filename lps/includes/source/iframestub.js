/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.          *
* Use is subject to license terms.                                        *
* X_LZ_COPYRIGHT_END ******************************************************/
try {
    if (lz) {}
} catch (e) {
    lz = {};
}    

// retrieve our frame id from the lz.embed namespace in the loaded page
lz.frameid = parent.lz.embed.iframemanager.getIDFromWindow(this);

// send an event to the html component controlling this frame
lz.sendEvent = function(name, value) {
    var args = [].slice.call(arguments);
    // prepend our iframe id
    args.unshift(lz.frameid);
    //console.log('calling iframemanager.asyncCallback with args',args);
    var iframemanager = parent.lz.embed.iframemanager;
    // Send an asynchronous callback/event
    iframemanager.asyncCallback.apply(iframemanager, args);
}

//console.log('found id', lz._iframeid);
