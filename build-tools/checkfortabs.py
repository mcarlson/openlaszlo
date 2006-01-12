# file: checkfortabs.py

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

# This utility is named for the first function it performed - checking for
# hard tabs in .lzx files.  It has since been modified to also check for
# accidently leftover non-filtered files with tokens of the format @VAR@,
# specifically BUILDID and VERSIONID.

from os import *
from string import *
from sys import exit

# this function walks a directory tree, descending for directories and
# processing files
def walk(dir):
    global rc
    for item in listdir(dir):

        # d will be set to True if the file is in a directory that is exempt
        # from hard tab checking.
        d = split(dir,sep)
        d = 'test' in d or 'docs' in d or 'tutorials' in d

        f = dir + sep + item
        if path.isdir(f):
            walk(f)
        else:
            infile = file(f)
            # a means that we found a hard tab in this file already
            # (report only once), b means we found a leftover var
            a = b = 0

            for line in infile.readlines():
                # if haven't found a tab yet, and the file is .lzx, look at it
                if not (a or d):
                    if f[-4:] == '.lzx' and find(line,'\t') >= 0:
                        print 'There are hard tabs in ' + f
                        a = 1
                # if haven't found a left over var, look for it
                if not b:
                    if find(line,'VERSIONID') >= 0 or find(line,'BUILDID') >= 0:
                        print 'VERSIONID/BUILDID in   ' + f
                        b = 1
            infile.close()

            # if we found anything suspect, set rc to 1
            if a or b: rc = 1

rc = 0
walk('.') # walk the current directory (so whoever called us should chdir first
exit(rc)
