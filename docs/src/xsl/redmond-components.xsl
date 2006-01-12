<?xml version="1.0" encoding="utf-8"?>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->

<html xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
      xmlns="http://www.w3.org/1999/xhtml"
      xsl:version="1.0">
  <head>
    <title>Redmond Components</title>
    <body>
      <h1>Redmond Components</h1>
      <p>The Redmond component library is deprecated.  We recommend
      the Laszlo component set instead.  The Laszlo components are
      documented in the Components section of the LZX Reference
      Manual.</p>
      <ul>
        <xsl:for-each select="//xhtml:a[not(starts-with(@href, 'http:'))]">
          <li><xsl:copy-of select="."/></li>
        </xsl:for-each>
      </ul>

    </body>
  </head>
</html>
