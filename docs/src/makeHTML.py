# File: makeHTML.py

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

from config import *
from globals import *
import string
import sys
import os
import re
import shutil
import config, XMLDocs, HTMLPage

##
# The XML Source files that were generated in Phase 1. 
#
class Source:
    def __init__(self, **options):
        logger('Beginning PHASE 2', 1)
        self.__dict__.update(options)
        self.completedSourceFiles = []
        self.allFiles = self.findAllFiles()
        self.doneFiles = []
        self.filesRemaining = self.allFiles[:]
        self.doHTMLPages()
        self.makeIndexFiles()

    # PUBLIC
    # Return the object reference for the element based on its filename
    def getObjByName(self, superObj):
        for file in self.allFiles:
            if file.getFileName() == superObj:
                return file

    # PRIVATE
    # Create an HTML page.
    def doHTMLPage(self, xmlPageObj):
        p = HTMLPage.HTMLPage(xmlPageObj, self)
        self.indexByCategory(p)
        self.indexByTier(p)
        self.indexByAlpha(p)
        self.markFileDone(xmlPageObj)
        return 

    # PRIVATE
    # Add to the correct category index.
    def indexByCategory(self, page):
        cats = string.split(page.getCategory(), ',')
        for cat in cats:
            categories = self.categories
            cat = cat.lower()
            if not categories.has_key(cat):
                if categories.has_key(cat + 's'):
                    cat = cat + 's'
                cat = {'menu and command': 'menus and commands',
                       'view': 'view basics',
                       }.get(cat, cat)
            if categories.has_key(cat):
                categories[cat].append(page)
            else:
                msg = 'Missing or invalid category in ' + page.getFileName() + ': ' + cat
                logger(msg, 3)
            

    # PRIVATE
    # Add to the correct category index.
    def indexByTier(self, page):
        tier = page.getTier()
        tier = {'Language Feature': 'Language Tags',
                'LFC': 'Laszlo Foundation Classes',
                'Text Markup': 'Text Markup'}.get(tier, tier)
        if tier in self.tierNames:
            self.tiers[tier].append(page)
        elif tier + 's' in self.tierNames:
            self.tiers[tier + 's'].append(page)
        else:   
            logger('Missing or invalid tier in ' + page.getFileName() + ': ' + tier, 3)

    # PRIVATE
    # Add to 
    def indexByAlpha(self, page):
        self.alphaIndexFiles.append(page)

    # PRIVATE
    def makeIndexFiles(self): 
        logger('Creating index files', 1)
        indices = ['Tiered Index', 'Categorical Index', 'Alphabetical Index']
        indicesFilenames = ['tiered', 'categorical', 'alphabetical']
        target = 'target="content"'
        ext = downloadDocsExtension
        
        # Tiered
        i = HTMLPage.IndexFile(indices, indicesFilenames, 0)
        for name in self.tierNames:
            title = '<a href="info-tiers.' + ext + '#' \
                  + re.sub(' ', '_', name) \
                  + '" ' + target + '>' + name  + '</a>'
            
            i.writeSubsection(title, self.tiers[name])
        i.closeFile()
        
        # Categorical
        s = '<categories>\n'
        for name in self.categoryNames:
            title = ' '.join([word.capitalize() for word in name.split()]).replace(' And ', ' and ').replace('Html ', 'HTML ').replace('Rpc', 'RPC')
            s += '<category title="%s">\n' % title
            files = self.categories[name]
            from HTMLPage import titleSort
            files.sort(titleSort)
            for file in files:
                classname = file.elementObj.api and file.elementObj.api.name
                tagname = file.elementObj.tag and file.elementObj.tag.name
                s += '<item href="%s"' % file.getFileName()
                if tagname:
                    s += ' tagname="%s"' % tagname
                if classname:
                    s += ' classname="%s"' % classname
                s += '/>\n'
            s += '</category>\n'
        s += '</categories>\n'
        setFileContent(os.path.join(config.htmlOutputDirectory, 'categories.xml'), s)
        
        # Alpha
        i = HTMLPage.IndexFile(indices, indicesFilenames, 2)
        i.writeSubsection('Alphabetical', self.alphaIndexFiles)
        i.closeFile()
    
    # PRIVATE
    # Create HTML Objects from the XML file objects. Only create the HTML 
    # Object AFTER its superclass has been done. That way we can reference
    # inherited attributes, events, methods etc.
    def doHTMLPages(self):
        # Initialize the Tier arrays.
        self.tiers = {}
        self.tierNames = [s.strip() for s in open('tiers.txt').readlines()]
        for name in self.tierNames:
            self.tiers[name] = []
        # Initialize Category arrays
        self.categories = {}
        self.categoryNames = [s.strip() for s in open('categories.txt').readlines()]
        self.alphaIndexFiles = []
        for name in self.categoryNames:
            self.categories[name.lower()] = []
        
        # Make a copy of the filesRemaining array. This means that we can
        # remove items from it one by one later.
        while self.filesRemaining:
            for file in self.filesRemaining:
                if file.getExtends():
                    isDone = 1
                    for extendsFileName in file.getExtends():
                        if not self.isSuperDone(extendsFileName):
                            logger(file.getName() + ' extended ' + extendsFileName, 1)
                            isDone = 0
                    if isDone:
                        # Do the file
                        logger(file.getName() + ' is extended ' + ",".join(file.getExtends()), 1)
                        self.doHTMLPage(file)
                    else:
                        # Defer until it's super has been done
                        logger(file.getName() \
                                + ' extends, deferring until later', 1)
                else:
                    # Do the file
                    logger(file.getName() + ' is new, doing now', 1)
                    self.doHTMLPage(file)


    # PRIVATE
    # Return true if the element that the given file is extending has been
    # processed.
    def isSuperDone(self, superFileName):
        for file in self.doneFiles:
            if file.getFileName() == superFileName:
                return 1
        return 0

    # PRIVATE
    # Remove the file from the remaining buffer, so that when a class that
    # extended it comes up, that class can be processed.
    def markFileDone(self, fileObj):
        self.doneFiles.append(fileObj)
        self.filesRemaining.remove(fileObj)

    # PRIVATE
    # Create objects that represent all the XML files.
    def findAllFiles(self):
        allFiles = []
        for file in self.listXMLFiles():
            fObj = XMLDocs.XMLElementSource(file, self)
            allFiles.append(fObj)
        return allFiles

    # PRIVATE
    # Locate all of the XML files that were generated in Phase 1.
    def listXMLFiles(self):
        dir = config.xmlInputDirectory
        files = []
        for file in os.listdir(dir):
            if os.path.splitext(file)[1] == '.xml':
                files.append(os.path.join(dir, file))
        if not files:
            logger('No XML files found in %s' % dir, 3)
        return files

# ============================================================================

# Read off the arguments and set any globals that arise from them.
def doArgs(args):
    import getopt
    try:
        opts, args = getopt.getopt(
            args,
            'qv',
            ['output=', 'input='])
    except getopt.error, msg:
        raise FatalError("unknown options")
    logLevel = defaultLogLevel
    input = None
    output = None
    for opt, arg in opts:
        if opt == '-v':
            # verbose
            logLevel = 1
        if opt == '-q':
            # quiet
            logLevel = 3
        if opt == '--input':
            input = arg
        if opt == '--output':
            output = arg
    setUserLogLevel(logLevel)
    if not input:
        raise FatalError('--input required')
    if not output:
        raise FatalError('--output required')
    import config
    config.xmlInputDirectory = input
    config.outputLocation = output
    options = {
        'htmlOutputDirectory': output,
        'outputExtension': 'html'}
    return options

# ============================================================================

def main(args):
    try:
        options = doArgs(args)
        import HTMLPage
        HTMLPage.globals.update(options)
        sourceFiles = Source(**options)
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
