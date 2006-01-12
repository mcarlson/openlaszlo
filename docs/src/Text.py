# File: Text.py
# Author: Antun Karlovac
# Description: Various XML-related classes for the LZX Reference generation

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************


# ============================================================================

from globals import *
import LZXConcepts
import string
import re
import xml.dom
import StringIO
import xml.dom.ext

##
# Any node that can contain text
#
class TextNode:
    def __init__( self, xmlNode ):
        self.xml = xmlNode
        self.origText = self.findTextContents()

    def findTextContents( self ):
        s = ''
        # Strip these nodes
        validHTMLNodeNames = [ 'p' ]
        for node in self.xml.childNodes:
            if node.nodeType == 3:
                s = s + node.nodeValue
            else:
                if node.nodeName in validHTMLNodeNames:
                    ptag = TextNode( node )
                    s = s + ptag.getText()
                    continue

                # Convert any html tags to string.
                xmlString = StringIO.StringIO()
                xml.dom.ext.Print( node, stream=xmlString )
                s = s + xmlString.getvalue()
        return s

    def getText( self ):
        return self.origText

# ============================================================================

##
# A short tag or api description. Permissable HTML formatting is limited.
# TODO: add in search-for-valid-HTML functionality
#
class ShortDesc( TextNode ):
    def smelly():
        print 'hi'

# ============================================================================

# TODO: Add in a long description class 
