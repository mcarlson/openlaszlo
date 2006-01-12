# File: element.py

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

##
# A LZX Element, such as View, Attribute etc.
#
class Element:
    def __init__( self, name ):
        self.name = name
        self.attributes = []

