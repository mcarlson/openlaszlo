var counter = 0;
var limit = 30;
var str = '';

function simulateTyping() {
    var app = lz.embed.lzappa;
    str += String.fromCharCode((Math.random() * 26) + 32 )
    if (counter < limit) {
        app.setCanvasAttribute('mytext', str);
        setTimeout(simulateTyping, Math.random() * 30); 
    } else {
        app.setCanvasAttribute('mytext', str);
        var result = app.getCanvasAttribute('mytext', str);
        if (result != str) alert('warning: simulateTyping() failed');
    }
    counter++;
}

function getSet(app, name) {
    app.setCanvasAttribute(name, 'blahz');
    var result = app.getCanvasAttribute(name);
    if (result != 'blahz') alert('warning: failed to read from ' + app);
}

function testMethodCalls(app) {
    var val = app.callMethod('aview.testMethod(\'foo\', true, false, 1, 0, width, height)')
    if (! val) alert('warning: method argument test failed.') 
}

function getUserAgent() {
    return navigator.userAgent + ', flash comm: ' + lz.embed.dojo.info.commVersion;
}  

var testscope = {
    meth: function meth() {
        return 'foo!';
    }  
}
function getFoo() {
    return 'foo';
}  

function getBar() {
    return 'bar';
}  
//* X_LZ_COPYRIGHT_BEGIN ***************************************************
//* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.         *
//* Use is subject to license terms.                                       *
//* X_LZ_COPYRIGHT_END *****************************************************
