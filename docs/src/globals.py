# File: globals.py
# Author: Antun Karlovac

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

False, True = 0, 1

class FatalError:
    def __init__(self, msg):
        self.msg = msg

    def __repr__(self):
        return 'FATAL ERROR:' + self.msg

# Rewrite the file, but only if the contents have changed,
# to avoid triggering downstream dependencies.
def setFileContent(fname, contents):
    try:
        f = open(fname).read()
        if f == contents:
            return
        f.close()
    except: pass
    logger('writing ' + fname, 1)
    f = open(fname, 'w')
    f.write(contents)
    f.close()


# ============================================================================

# outputFormat is a global variable that is set in makeHTML.py that designates
# whether the output is for online viewing or downloadable.

# ============================================================================

def setUserLogLevel(logLevel):
    global userLogLevel
    userLogLevel = logLevel

errorCount = 0

def getErrorCount():
    global errorCount
    return errorCount

def logger(message, severity):
    # userLogLevel is a global variable that is set in both makeXML.py and
    # makeHTML.py. It is based on command line arguments.
    logLevel = userLogLevel
    logLevel = logLevel - 1

    severity = severity - 1
    sev = ['MESSAGE', 'WARNING', 'ERROR']
    if severity >= logLevel:
        print sev[severity] + ': ' + message
    if severity >= 2:
        global errorCount
        errorCount += 1
