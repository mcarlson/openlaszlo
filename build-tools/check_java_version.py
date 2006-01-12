# file: check_java_version.py

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

from sys import exit, argv
from re import split
from os import popen3, environ, sep
(i,o,e) = popen3('"' + environ['JAVA_HOME'] + sep + 'bin' + sep + 'java" -version')
for l in e.readlines():
    if l[0:12] == 'java version':
        v = split(r'[^\d]+',l)[1:-1] #(java version "[X.X.X]")
        a = split(r'[^\d]+',argv[1])
        for i in range(len(a)):
            if v[i] < a[i]: exit(1)
            if v[i] > a[i]: exit(0)
            
