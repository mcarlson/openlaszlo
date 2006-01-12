#!/usr/bin/python
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************
import sys, os, re, string
from os.path import isfile

brief = 0
file1 = ''
file2 = ''

#SWFDUMP = 'swfdump -a '
SWFDUMP = 'flasm -d '
DIFF = 'diff'
DIFFOPTS=" -I '[HEADER].*File size: [0-9]*' "

PRG = sys.argv[0][string.rfind(sys.argv[0], '/') + 1:]
PRG = string.split(PRG, '.')[0]
TMP_PATTERN = '.tmp-' + PRG + '-' + str(os.getpid()) + '-'
tmpfile1 = TMP_PATTERN + '1'
tmpfile2 = TMP_PATTERN + '2'

ignore_pat = {'String:"build"':'String', 'String:"expires"':'String', 'String:"lpsversion"':'String', 
'String:"lpsrelease"':'String'}
endOfLFC = '\$endOfLFCMarker'

def usage():
    print "Usage: swfdiff.py [options] <swffile1> <swffile2>"
    print "\tOptions: [-q] brief mode (output only whether files differ)"
    print "\t         [-h | --help] this message"
    sys.exit(1)

def createSWFDump(swffile, tmp):
    sd_out = os.popen(SWFDUMP + swffile)
    line = sd_out.readline()
#    if not re.search('^\[HEADER\].*File version:\s+\d+', line):
    # used to check for the header from swfdiff;
    # check for the header output by flasm now
    if not re.search('^movie.*flash \d+,.*', line):
        sd_out.close()
        raise Exception(PRG + ': ' + swffile + ' is not a SWF file')

    dump = open(tmp, 'w')
    igk = ignore_pat.keys()
    start = '^\s*\(\s+\d+\s(bytes\) action:.*\n$)'
    stripped = False
    while (line):
        # Skip all the lines before the end of LFC -- exclude LFC from dump
        if not stripped:
            stripped = re.search(endOfLFC, line)
        else:
            match = None
            for key in igk:
                # Cycle over the dictionary of ignore strings and look for each one in the line we're processing
                one = re.search (key + '\s+' + ignore_pat[key] + ':(".*?").*\n$', line)
                if one:
                    line = string.replace(line, one.group(1), 'XXX')
                    match = one
            if match:
                two = re.search(start, line)
                line = two.group(1)

            dump.write(line)
        line = sd_out.readline()
    dump.close()
    sd_out.close()

########################### MAIN #########################     

try:
    c = 1
    arg = sys.argv[c]

    # Process options
    while (arg[0] == '-'):
        if arg == '-h' or arg == '--help':
            usage()
        elif arg == '-q':
            brief = 1
        else:
            usage()
        c += 1
        arg = sys.argv[c]

    # Process arguments
    file1 = sys.argv[c]
    file2 = sys.argv[c + 1]
except IndexError, ie:
    usage()

badfile = ''
if not isfile(file1):
    badfile = file1
elif not isfile(file2):
    badfile = file2
if badfile != '':
    sys.exit('File not found: ' + badfile)

# check if there are any differences
d = os.popen(DIFF + ' -q ' + "'" + file1 + "'" + ' ' + "'" + file2 + "'")

if d.read() != '':
    # differences were found; dump them and compare
    try:
        createSWFDump(file1, tmpfile1)
        createSWFDump(file2, tmpfile2)
        if brief:
            DIFF += ' -q'
        os.system(DIFF + DIFFOPTS + tmpfile1 + ' ' + tmpfile2)
    except Exception, ex:
        print ex
    try:
        os.remove(tmpfile1)
        os.remove(tmpfile2)
    except OSError, oe:
        # Do nothing
        pass

d.close()
