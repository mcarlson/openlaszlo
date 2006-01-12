# file: check_python_version.py

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

# this will check the version of python to be > 2.2 with PyXML > 0.8 installed
# exit 0 if this is the case, exit 1 if not
import sys, xml
#YS# xml.__version__ == "0.8" and \

_MINIMUM_PYTHON_VERSION = (2, 2)
_MINIMUM_XMLPLUS_VERSION = (0, 8)

print "    python version info", sys.version_info
print "    python xml version info", xml.version_info

if sys.version_info >= _MINIMUM_PYTHON_VERSION and \
        xml.__name__ == "_xmlplus" and \
        xml.version_info >= _MINIMUM_XMLPLUS_VERSION :
    sys.exit(0)
else :
    print "LPS Build requires that python be version", \
          '.'.join(['%d'%n for n in _MINIMUM_PYTHON_VERSION]), \
          "or better and PyXML version", \
          '.'.join(['%d'%n for n in _MINIMUM_XMLPLUS_VERSION]), \
          "or better be installed.";
    sys.exit(1)
