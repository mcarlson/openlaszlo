//=====================================================================
//                                                                     
// docs.js
//                                                                     
//=======================================================================
//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************

function lzSetCookie(name, value, expires) {
    var cookie = name + "=" + escape(value);
    if (expires)
        cookie += "; expires=" + expires.toGMTString();
    document.cookie = cookie;
}

function lzGetCookie(name) {
    var cookie = document.cookie;
    var prefix = name + '=';
    var i = cookie.indexOf(prefix);
    if (i == -1)
        return null;
    var j = cookie.indexOf(";", i + prefix.length);
    if (j == -1)
        j = cookie.length;
    return unescape(cookie.substring(i + prefix.length, j));
}

function lzSetShowInlineExamples(show) {
    // get the current date and time plus one year
    // FIXME: never expire
    var expires = new Date();
    expires.setTime(expires.getTime() + (365*24*60*60*1000));
    lzSetCookie('show-inline-examples', show, expires);
    
    // reload the current document
    document.location = document.location;
}

function lzShowInlineExamples() {
    var show = lzGetCookie('show-inline-examples');
    return show != 'false';
}

// The following is based on the Tigris SSTree library,
// http://sstree.tigris.org/.  It is distributed under the The Apache
// Software License, Version 1.1.
function toggleBullet(elm) {
    var newDisplay = "none";
    var e = elm.nextSibling; 
    while (e != null) {
        if (e.tagName == "OL" || e.tagName == "ol") {
            if (e.style.display == "none") newDisplay = "block";
            break;
        }
        e = e.nextSibling;
    }
    while (e != null) {
        if (e.tagName == "OL" || e.tagName == "ol") e.style.display = newDisplay;
        e = e.nextSibling;
    }
}

function collapseAll() {
    var lists = document.getElementsByTagName('OL');
    for (var j = 0; j < lists.length; j++) 
        lists[j].style.display = "none";
    lists = document.getElementsByTagName('ol');
    for (var j = 0; j < lists.length; j++) 
        lists[j].style.display = "none";
    var e = document.getElementById("root");
    e.style.display = "block";
}

function uncollapseAll() {
    var lists = document.getElementsByTagName('OL');
    for (var j = 0; j < lists.length; j++) 
        lists[j].style.display = "block";
    lists = document.getElementsByTagName('ol');
    for (var j = 0; j < lists.length; j++) 
        lists[j].style.display = "block";
}
