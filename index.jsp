<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<%@ page contentType="text/html" %>
<html>
    <head> <title>Internal LPS Index</title> 
    <link rel="STYLESHEET" type="text/css" href="docs/includes/styles.css">
    <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/images/laszlo.ico">
    </head>
    <body>
        <img class="logo" src="lps/includes/logo_web_sm.gif"/>
        <h1>Internal Index for
            <%= new java.io.File(org.openlaszlo.utils.LZHttpUtils.getRealPath(application, "/")).getName() %> 
        </h1>
        <p>Here's our stuff (we don't ship this internal index):</p>
        <ul>
            <li><a href="quick-index.html">LPS Quick Index</a> (this replaces this file in the distro)</li>
            <li><a href="test">Tests</a> (these won't ship with the product) </li>
            <li><a href="sandbox">Sandbox</a> (these don't ship)</li>
            <li><a href="demos">Demos</a></li>
            <li><a href="examples">Examples</a></li>
            <li>Laszlo Explorer
                <ul>
                <li><a href="laszlo-explorer">Laszlo Explorer</a></li>
                <li><a href="lps/utils/welcome_support/coverpages/welcome_cover.lzx">Clocks</a></li>
                </ul>
        </ul>
        <p>Docs</p>
        <ul>
            <li><a href="docs">Docs index</a></li>
            <li><a href="docs/guide">Software Developer's Guide</a></li>
            <li><a href="docs/design">UI Designer's Guide</a></li>
            <li><a href="docs/deploy">Deployer's Guide</a></li>
            <li><a href="docs/reference">Reference</a></li>
            <li><a href="docs/tutorials">Tutorials</a></li>
        </ul>
        <p>LPS Admin tools</p>
        <ul>
            <li><a href="lps/admin/console.lzx">Console</a></li>
            <li><a href="foo.lzx?lzt=clearcache&pwd=laszlo">Clear cache</a></li>
            <li><a href="foo.lzx?lzt=cacheinfo&pwd=laszlo">Cache statistics</a></li>
            <li><a href="foo.lzx?lzt=cacheinfo&details=1&pwd=laszlo">Cache details</a></li>
            <li><a href="foo.lzx?lzt=errorcount&pwd=laszlo">LPS Error count</a></li>
            <li><a href="foo.lzx?lzt=errorcount&clear=1&pwd=laszlo">Clear LPS error count</a></li>
            <li><a href="foo.lzx?lzt=serverinfo&pwd=laszlo">LPS server info</a></li>
            <li><a href="foo.lzx?lzt=log&pwd=laszlo">Current LPS log file (can be long)</a></li>
            <li><a href="lps/admin/solo-deploy.jsp">SOLO Application Deployment Wizard</a></li>
        </ul>
    </body>
</html>
