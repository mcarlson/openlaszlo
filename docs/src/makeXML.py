# File: makeXML.py
# Author: Antun Karlovac
# Description:
# The starting point for phase 1 of the doc generation. In phase 1 the wrapper
# html pages, xml schema, and xml lfc docs are combined to produce a single LZX
# XML documentation representation.

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

from config import *
from globals import *
import sys
import os
import re
import HTMLWrapper, config, LZXConcepts

class Options:
    def update(self, options):
        self.__dict__.update(options)

globals = Options()

# ============================================================================

##
# The original XML/HTML files.
#
class Source:
    def __init__(self):
        self.completedSourceFiles = []
        self.htmlFiles = self.findHTMLWrapperFiles()
        self.verifySourceFiles()
        self.findInheritance()

    # PUBLIC
    def findHTMLFileByTagName(self, name):
        allFiles = self.getSourceFiles()
        for file in allFiles:
            if file.tag:
                if file.getName() != 'Splash View':
                    if file.tag.getName() == name:
                        return file
        # Only warn.  Could be extending a private class
        logger('No HTML file for tag %s' % name, 2)

    # PUBLIC
    def findHTMLFileByAPIName(self, name):
        allFiles = self.getSourceFiles()
        for file in allFiles:
            if file.api:
                if file.api.getName() == name:
                    return file
        # Only warn.  Could be extending a private class
        logger('No HTML file for api %s' % name, 2)

    # PUBLIC
    # Mark an XML source file as read, so that later we can be sure that all
    # files were accounted for.
    def sourceFileCompleted(self, url):
        url = os.path.basename(url)
        logger('Completed source file: ' + url, 1)
        self.completedSourceFiles.append(url)

    # PUBLIC
    def getSourceFiles(self):
        return self.htmlFiles

    # PUBLIC
    def findInheritance(self):
        for file in self.htmlFiles:
            file.findExtends()

    # PRIVATE
    # Confirm that all of the xml source files were accounted for.
    def verifySourceFiles(self):
        sourceFiles = []
        a = os.listdir(xmlApiDocsLocation)
        reTag = re.compile('tag-.+\.xml')
        for file in a:
            if reTag.search(file):
                # Filename is valid for a tag
                sourceFiles.append(file)
        a = os.listdir(xmlSchemaDocsLocation)
        reApi = re.compile('api-.+\.xml')
        for file in a:
            if reApi.search(file):
                # Filename is valid for a api
                sourceFiles.append(file)
        for file in sourceFiles:
            if file not in self.completedSourceFiles:
                pass
                # TBD
                # logger('File: ' + file \
                #         + ' not referenced by any HTML wrapper', 3)

    # PRIVATE
    # Go through all the wrapper files and make.
    def findHTMLWrapperFiles(self):
        htmlFiles = []
        a = os.listdir(htmlElementDocsLocation)
        reObj = re.compile('.*.html$')
        # Debug:
        # a = HTMLWrapper.HTMLWrapper('Attribute.html')
        for file in a:
            if reObj.search(file):
                # HTML Files in folder.
                html = HTMLWrapper.HTMLWrapper(file, self)
                htmlFiles.append(html)
        return htmlFiles

# ============================================================================

# Take the wrappers and turn them into XML files.
def doFiles(sourceFiles):
    allFiles = sourceFiles.getSourceFiles()
    allElements = []
    for wrapperObj in allFiles:
        e = LZXConcepts.Element(wrapperObj)
        e.makeXMLFile(config.xmlOutputLocation)
        allElements.append(e)
    # make the index
    index = LZXConcepts.Index(allElements)
    index.makeXMLFile(globals.xmlOutputDirectory)


# ============================================================================


# TODO: Find a way to make the logging work like it should. Right now there
#       is just a function being called and it's not very elegant. 
def doArgs(args):
    import getopt
    try:
        opts, args = getopt.getopt(
            args,
            'qv',
            ['output=', 'indexdir='])
    except getopt.error, msg:
        raise FatalError("unknown options")
    logLevel = defaultLogLevel
    output = None
    indexdir = None
    for opt, arg in opts:
        if opt == '-v':
            # verbose
            logLevel = 1
        if opt == '-q':
            # quiet
            logLevel = 3
        if opt == '--output':
            output = arg
        if opt == '--indexdir':
            indexdir = arg
    if not output:
        raise FatalError('--output required')
    if not indexdir:
        raise FatalError('--indexdir required')
    import config
    config.xmlOutputLocation = output
    options = {
        'xmlOutputLocation': output, # a.html etc.
        'xmlOutputDirectory': indexdir # index.xml
        }
    setUserLogLevel(logLevel)
    return options

# ============================================================================

def main(args):
    try:
        options = doArgs(args)
        globals.update(options)
        sourceFiles = Source()
        doFiles(sourceFiles)
        if getErrorCount() > 0:
            raise FatalError("Mistakes were made")
    except FatalError, e:
        print e
        import sys
        sys.exit(1)

def test():
    main(['-q'])

if __name__ == '__main__':
    main(sys.argv[1:])
