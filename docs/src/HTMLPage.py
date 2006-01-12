# File: HTMLPage.py

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

from globals import *
import config
import re, string

class Options:
    def update(self, options):
        self.__dict__.update(options)

globals = Options()

# ============================================================================
##
# Utils
#

def style(s, style):
    return '<span class="' + style + '">' + str(s) + '</span>'

def nocaseConceptSort(a, b):
    return cmp(a.getName().lower(), b.getName().lower())

def titleSort(a, b):
    return cmp(a.getTitle(), b.getTitle())

# Make a <a name="attr-onclick"></a>
def namedAnchor(name, type=None):
    s = '<a name="'
    if type:
        s += type + '-'
    s += name + '"></a>'
    return s 

# Replace .xml with .html or .php
def getPageName(origName):
    return re.sub('\.xml$', '.' + globals.outputExtension, origName)

# ============================================================================
##
# An HTML page.
#
class HTMLPage:
    # attribsTable: HTMLPage.AttribsTable
    # content: string
    # elementObj: XMLDocs.XMLElementSource
    # filename: string
    # inheritedAttribs: list
    # inheritedEvents: list
    # inheritedMethods: list
    # ownAttribs: list
    # ownEvents: list
    # ownMethods: list
    # sourceObj: __main__.Source
    # title: string
    
    def __init__(self, elementObj, sourceObj):
        self.elementObj = elementObj
        self.sourceObj = sourceObj
        self.title = self.elementObj.getName()
        self.content = self.makeHTML()
        self.writeFile()
        self.writeTargetFragment() # must be follow writeFile -- see its comment
        
    # PUBLIC
    def getTitle(self):
        return self.title

    def getFileName(self):
        return getPageName(self.elementObj.getFileName())

    # PUBLIC
    def getCategory(self):
        return self.elementObj.getCategory()

    # PUBLIC
    def getTier(self):
        return self.elementObj.getTier()

    # PRIVATE
    # Replace to a given extension
    def replaceExtension(self, searchStr, haystack, newExtension):
        reComp = re.compile(searchStr, re.DOTALL)
        extension = newExtension
        repl = "\\1\\2." + extension + "\\3\\4"
        s = reComp.sub(repl, haystack)
        obj = reComp.search(haystack)
        return s
    
    # PRIVATE
    def writeFile(self):
        content = self.content
        filename = self.elementObj.getFileName()
        self.filename = getPageName(filename)
        fname = globals.htmlOutputDirectory + '/' + self.filename
        setFileContent(fname, content)
    
    def writeTargetFragment(self):
        import os
        fname = globals.htmlOutputDirectory + '/' + \
                os.path.splitext(self.filename)[0] + '.db.fragment'
        s = ''
        tagname = self.elementObj.tag and self.elementObj.tag.getName()
        classname = self.elementObj.api and self.elementObj.api.getName()
        # For tags defined in LZX, their class is the same as their tag
        # KLUDGE: only LZX tags have an extends field
        if not classname and self.elementObj.getExtends():
            classname = tagname
        href = self.filename
        if tagname:
            s += '  <obj href="%s" targetptr="tag-%s"/>\n' % \
                 (href, tagname)
        if classname:
            s += '  <obj href="%s" targetptr="class-%s"/>\n' % \
                 (href, classname)
        # This code depends on the fact that writeTargetFile is
        # called after doBody, which ininitializes some of these
        # attributes.  Otherwise it will get an undefined
        # attribute error.  That would be a good time to refactor
        # doBody into something that does all the initialization,
        # which __init__ calls, and something else that just
        # writes the HTML body.
        for key in ('event', 'method', 'attr'):
            break # FIXME [2004-07-06 ows]: dguide build runs out of memory
            # For introspecting this.ownXXX and this.inheritedXXX
            suffix = {'attr': 'attrib'}.get(key, key).capitalize() + 's'
            # The HTML anchor: must match anchor generated elsewhere
            # in this file
            anchorPrefix = {'method': 'meth'}.get(key, key)
            # The key prefix: must match prefix in XSL lookup
            keyPrefix = key
            members = getattr(self, 'own' + suffix) + \
                      getattr(self, 'inherited' + suffix)
            for m in members:
                name = m.getName()
                mbase = href
                if m.owner != self.elementObj.api:
                    mbase = m.owner.getRelativeUrl()
                mhref = '%s#%s-%s' % (mbase, anchorPrefix, name)
                if classname:
                    s += '  <obj href="%s" targetptr="%s-class-%s.%s"/>\n' % \
                     (mhref, keyPrefix, classname, name)
                if tagname:
                    s += '  <obj href="%s" targetptr="%s-tag-%s.%s"/>\n' % \
                     (mhref, keyPrefix, tagname, name)
        setFileContent(fname, s)
        
    
    # PRIVATE
    def doHeader(self):
        logger('Building HTML header for file: ' \
                + self.elementObj.getName(), 1)
        s = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"' + \
            '  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' + \
            '<html xmlns="http://www.w3.org/1999/xhtml"\n' \
            + '    xmlns:lzxdoc="http://laszlosystems.com/lzx/docs">\n' \
            + '<head>' \
            ' <title>%s</title>' % self.getTitle() \
            + '<link rel="STYLESHEET" type="text/css" href="./styles.css"/>' \
            + '</head>\n' \
            + '<body>\n'
        # '\n<lzxdoc:library>%r</lzxdoc:library>\n' % (self.elementObj.tag and self.elementObj.tag.library) \
        return s
    
    # PRIVATE
    def doBody(self):
        logger('Building HTML content for file: ' \
                + self.elementObj.getName(), 1)

        tagname = self.elementObj.tag and self.elementObj.tag.getName()
        classname = self.elementObj.api and self.elementObj.api.getName()
        # For tags defined in LZX, their class is the same as their tag
        # KLUDGE: only LZX tags have an extends field
        if not classname and self.elementObj.getExtends():
            classname = tagname
        
        # == Page title ============================
        s = self.namedAnchor('element')
        s += '<lzxdoc:reference>'
        s += '<lzxdoc:summary>' + str(self.elementObj.getShortDesc()) + '</lzxdoc:summary>'
        if tagname:
            s += '<lzxdoc:tagname>' + tagname + '</lzxdoc:tagname>'
        if classname:
            s += '<lzxdoc:classname>' + classname + '</lzxdoc:classname>'
        
        # == Extends =====================
        for extends in self.elementObj.getExtends():
            extendsElmt = self.sourceObj.getObjByName(extends)
            extendsName = extendsElmt.getName()
            s += '<lzxdoc:extends href="' + getPageName(extends) + '">' \
                 + extendsName + '</lzxdoc:extends>'

        # Wrapper Text (Long Description)
        s += '<lzxdoc:description><div class="wrapper-description">' \
             + self.elementObj.getWrapperText() + '</div></lzxdoc:description>'
        
        # tag description from schema or lzx class file
        if self.elementObj.tag:
            if self.elementObj.tag.getDescription():
                s += '<lzxdoc:tag><lzxdoc:description><div class="tag-description">'
                s += self.elementObj.tag.getDescription()
                s += '</div></lzxdoc:description></lzxdoc:tag>'

        # class description from lfc
        if self.elementObj.api:
            if self.elementObj.api.getDescription():
                s += '<lzxdoc:api><lzxdoc:description><div class="api-description">'
                s += self.elementObj.api.getDescription()
                s += '</div></lzxdoc:description></lzxdoc:api>'

        s += '</lzxdoc:reference>'
        
        # TODO: Add see also here
        
        def getBriefDesc(field):
            s = field.findShortDesc() or ''
            s = ' '.join(s.split('\n'))
            import re
            m = re.match(r'(?:<p>)?(.*?)(?:</p>|\.)', s)
            if m:
                s = m.group()
            return s

        def computeMembers(direct, inherited, attributes=0):
            # Remove private members
            direct = [m for m in direct
                      if m.getName()[0] not in '_$']
            inherited = [m for m in inherited
                         if m.getName()[0] not in '_$']
            # Remove inherited attributes listed as direct, unless
            # there is a different description
            if attributes:
                def overrides(m, inherited):
                    inhs = [i for i in inherited if m.getName() == i.getName()]
                    assert len(inhs) <= 1
                    if len(inhs) < 1:
                        return True
                    inh = inhs[0]
                    overDesc = m.getDescription()
                    # If class has an API, the override must come from
                    # the API, not the schema
                    if (overDesc != None) and \
                           (overDesc != inh.getDescription()) and \
                           (getattr(m, 'descFromAPI', 0) == (m.parentObj.api != None)):
                        logger("%s overrides %s's description" % (self.getTitle(), m.getName()), 2)
                        return True
                    else:
                        return False
                direct = [m for m in direct
                             if overrides(m, inherited)]
            return direct, inherited

        def writeInheritedMembers(name, inherited, linkPrefix):
            s = ''
            superclasses = {}
            for m in inherited:
                superclasses[m.owner] = 1
            superclasses = superclasses.keys()
            superclasses.sort(nocaseConceptSort)
            for superclass in superclasses:
                superclassUrl = superclass.getRelativeUrl()
                items = [m for m in inherited
                         if m.owner == superclass]
                items.sort(nocaseConceptSort)
                # As a work-around for Bug 4375, we add an anchor for inherited
                # properties too
                items = ['<a name="%s-%s" href="%s#%s-%s">%s</a>' %
                         (linkPrefix, m.getName(), superclassUrl, linkPrefix, m.getName(),
                          m.getName())
                         for m in items]
                s += '<div class="lfcInherited"><div class="title">\n'
                s += '%s inherited from <a href="%s">%s</a>' % \
                     (name, superclassUrl, superclass.getName())
                s += '</div><p>'
                s += ', '.join(items)
                s += '</p></div>\n'
            return s
        
        # == Attributes ==================
        s += self.namedAnchor('attributes')
        
        self.ownAttribs, self.inheritedAttribs = \
                         computeMembers(self.elementObj.getAttributes(),
                                        self.elementObj.getInhAttributes(),
                                        1)
        if self.ownAttribs or self.inheritedAttribs:
            self.attribsTable = AttribsTable(self)
            s += self.attribsTable.getString()
            s += writeInheritedMembers('Attributes', self.inheritedAttribs, 'attr')
        
        # == API Info ====================
        # == Methods =====================
        self.ownMethods = []
        if self.elementObj.api:
            self.ownMethods = self.elementObj.api.getMethods() or []
        self.ownMethods, self.inheritedMethods = \
                         computeMembers(self.ownMethods,
                                        self.elementObj.getInhMethods())
        
        # Own methods
        if self.ownMethods or self.inheritedMethods:
            self.ownMethods.sort(nocaseConceptSort)
            s += '<hr />\n'
            s += namedAnchor('methods') 
            s += '<h3>Methods</h3>\n'
            for method in self.ownMethods:
                methodTableObj = MethodTable(self, method)
                # Jump anchor
                s += namedAnchor(method.getName(), 'meth') 
                s += methodTableObj.getString()
            s += writeInheritedMembers('Methods', self.inheritedMethods, 'meth')
   
        # == Events ======================
        self.ownEvents = []
        if self.elementObj.api:
            self.ownEvents = self.elementObj.api.getEvents()
        self.ownEvents, self.inheritedEvents = \
                         computeMembers(self.ownEvents,
                                        self.elementObj.getInhEvents())
        
        s += self.namedAnchor('events')
        if self.ownEvents or self.inheritedEvents:
            self.ownEvents.sort(nocaseConceptSort)
            s += '<hr />\n'
            eventsTable = EventsTable(self)
            for event in self.ownEvents:
                eventsTable.addEventRow(event)
            s += eventsTable.getString()
            s += writeInheritedMembers('Events', self.inheritedEvents, 'event')
        return s
                    
    # PRIVATE
    # Create the HTML string.
    def makeHTML(self):
        s = self.doHeader()
        s += self.doBody()
        s += self.doFooter()
        return s
        
    # PRIVATE
    def doFooter(self):
        logger('Building HTML footer for file: ' \
                + self.elementObj.getName(), 1)
        s = '</body></html>'
        return s

    # PRIVATE
    # Return a string that is a named anchor.
    def namedAnchor(self, anchorName):
        s = '<a name="' + anchorName + '"></a>\n'
        return s

    # PRIVATE
    # Create the HTML string.
    def makeHTMLString(self):
        s = self.doHeader()
        # s += self.doBody()
        s += self.doFooter()
        return s


# ============================================================================

##
# An HTML Table
#
class Table:
    def __init__(self, cols):
        self.cols = cols
        self.s = '<table width="100%" border="0" cellspacing="2" cellpadding="2">\n'

    # PUBLIC
    def getString(self):
        return self.s + '</table>\n<br />\n\n'
    
    def addTableTitle(self, titleStr, tableStyle="blue"):
        if tableStyle == 'blue':
            # Default blue style of table
            titleStr = style(titleStr, 'docTableTitle')
            bgcolor = '#5B607C'
        elif tableStyle == 'gray':
            titleStr = style(titleStr, 'docTableTitleGray')
            bgcolor = '#e5e5e5'
        s = '<tr bgcolor="' + bgcolor + '">\n'
        s += '    <td colspan="' + str(self.cols) + '">' + titleStr \
            + '</td>\n'
        s += '</tr>\n'
        self.s += s

    def addTableSubTitle(self, titleStr):
        titleStr = style(titleStr, 'docTableSubTitle')
        s = '<tr bgcolor="#e6e6e6">\n'
        s += '    <td colspan="' + str(self.cols) + '">' + titleStr \
          + '</td>\n'
        s += '</tr>\n'
        self.s += s

    def addTableColHeadings(self, headingsArr):
        s = '<tr bgcolor="#e6e6e6">\n'
        for head in headingsArr:
            s += '    <td>' + style(head, 'docTableColHeading') \
                + '</td>\n'
        s += '</tr>\n'
        self.s += s

    def addTableRow(self, rowArr):
        s = '<tr>\n'
        for cell in rowArr:
            s += '    <td>' + str(cell) + '</td>\n'
        s += '</tr>\n'
        self.s += s

    def addTableDescRow(self, desc):
        s = '<tr>\n    <td>&nbsp;</td>\n'
        s += '    <td colspan="' + str(self.cols-1) + '">' \
            + style(desc, 'smaller') \
            + '</td>\n</tr>\n'
        self.s += s

    def addTableFullWidthRow(self, desc):
        s = '<tr>\n'
        s += '    <td colspan="' + str(self.cols) + '">' + str(desc) \
            + '</td>\n</tr>\n'
        self.s += s

    def addShortLeftTableRowHeader(self, rowArr):
        self.addShortLeftTableRow(rowArr, 1)

    # A row with a thin column on the left, and a fat column on the right.
    def addShortLeftTableRow(self, rowArr, isHeader=0):
        colOne = rowArr[0]
        colTwo = rowArr[1]
        bgcol = ''
        if isHeader:
            bgcol = ' bgcolor="#e6e6e6"'
            colOne = style(colOne, 'docTableColHeading')
            colTwo = style(colTwo, 'docTableColHeading')
        else:
            colOne = style(colOne, 'docParam')
            colTwo = style(colTwo, 'smaller')
            
        s = '<tr' + bgcol + '>\n    <td>' + str(colOne) + '</td>\n'
        s += '    <td colspan="' + str(self.cols-1) + '">' \
            + str(colTwo)\
            + '</td>\n</tr>\n'
        self.s += s

    def addSpacerRow(self):
        s = '<tr>\n    <td colspan="' + str(self.cols) + '">'\
            + '<hr size="1" bgcolor="#e5e5e5" /></td>\n</tr>'
        self.s += s
        
        
        



# ============================================================================

class AttribsTable(Table):
    def __init__(self, pageObj):
        numberOfColumns = 6
        Table.__init__(self, numberOfColumns)
        self.attribs = pageObj.ownAttribs 
        self.addTableTitle('<a href="info-attributes.' \
                            + globals.outputExtension + '">' \
                            + 'Attributes' + '</a>')
        self.doAttributes()
    
    # PRIVATE
    # Separate out the attributes in to their categories
    def doAttributes(self):
        # 3/25/03: AK Commenting out these because we don't have a system
        # for tieing them to attributes
        # self.colHeads = ['Name', 'Type', 'Default', 'Setter', 'Event']
        self.colHeads = [
            '<a href="info-attribinfo.html#name">Name</a>', 
            '<a href="info-attribinfo.html#usage">Usage</a>', 
            '<a href="info-attribinfo.html#typetag">Type (Tag)</a>', 
            '<a href="info-attribinfo.html#typejs">Type (JS)</a>',
            '<a href="info-attribinfo.html#typejs">Default</a>',
            '<a href="info-attribinfo.html#category">Category</a>']

        if self.attribs:
            title = "Attributes"
            self.doSpecificAttributes(title, self.attribs)

    # PRIVATE
    # Write out all of the attributes of a specific type
    def doSpecificAttributes(self, title, attribsArr):
        #self.addTableSubTitle(title)
        if self.attribs:
            self.addTableColHeadings(self.colHeads)
        attribsArr.sort(nocaseConceptSort)
        for attrib in attribsArr:
            attrName = attrib.getName()
            anchorLink = '#attr-' + attrib.getName()
            # Add named jump anchor
            anch = namedAnchor(attrib.getName(), 'attr') 
            attrName = anch + attrName
            #rowInfo = [style(attrName, 'docParam'), 
            #            style(attrib.getType(), 'smaller'),
            #            style(attrib.getDefault(), 'smaller'),
            #            style(attrib.getSetter(), 'smaller'),
            #            style(attrib.getEvent(), 'smaller')] 
            if attrib.isValidInTag:
                tagType = attrib.getTagType()
                for suffix in ('Literal', 'Expression'):
                    if tagType.endswith(suffix):
                        tagType = tagType[:-len(suffix)]
                tagTypeStr = style(tagType, 'smaller')
                usageStr = 'Tag'
            else:
                tagTypeStr = ''
                usageStr = 'JS'

            cat = attrib.getCategory()
            if cat != 'final' and cat != 'eventhandler' \
                and usageStr.find('JS') < 0:
                usageStr = usageStr + ' &amp; JS'
            only = (' only','')[len(usageStr.split(' ')) > 1] 
            usageStr = usageStr + only
            usageStr = style(usageStr, 'smaller')

            catStr  = '<a href="info-attributes.' + globals.outputExtension \
                  + '#' + cat + '">' + cat + '</a>'
            jsType = attrib.getAPIType()
            if jsType and jsType[0] == '[' and jsType[-1] == ']':
                jsType = 'Array of %s' % jsType[1:-1]
            if not jsType and tagTypeStr and usageStr.find('JS') >= 0:
                jsType = {'float': 'Number',
                          'boolean': 'Boolean',
                          'booleanLiteral': 'Boolean',
                          'css': 'Object',
                          'size': 'Number',
                          'sizeLiteral': 'Size',
                          'expression': 'any',
                          'color': 'Number',
                          'colorLiteral': 'Number',
                          'number': 'Number',
                          'integer': 'Number',
                          'numberExpression': 'Number',
                          'token': 'String',
                          'string': 'String',
                          'script': 'LzDelegate'}.get(attrib.getTagType(), 'any')
                if attrib.getTagType().find(' | ') >= 0:
                    jsType = 'any'
            default = (attrib.getRequired() and '<i>required</i>') or attrib.getDefault() or '&nbsp;'
            rowInfo = [style(attrName, 'docParam'), 
                        usageStr,
                        tagTypeStr,
                        style(jsType, 'smaller'),
                        style(default, 'smaller'),
                        style(catStr, 'smaller')]
            
            self.addTableRow(rowInfo)
            if attrib.getDescription():
                self.addTableDescRow(attrib.getDescription())
            self.addSpacerRow()


# ============================================================================

class MethodTable(Table):
    def __init__(self, pageObj, method):
        numberOfColumns = 3
        Table.__init__(self, numberOfColumns)
        self.pageObj = pageObj
        self.method = method
        self.addTableTitle(self.method.getName() + '()', 'gray')
        self.doPrototype()
        self.doDesc()
        self.doParams()
        self.doReturns()

    def doReturns(self):
        returns = self.method.getReturns()
        if returns:
            type = returns.getType()
            desc = returns.getDescription()
            self.addTableSubTitle('Returns')
            self.addShortLeftTableRowHeader(['Type', 'Desc'])
            self.addShortLeftTableRow([type, desc])



    def doParams(self):
        if self.params:
            self.addTableSubTitle('Parameters')
            colHeads = ['Name', 'Type', 'Desc']
            self.addTableColHeadings(colHeads)
            for param in self.params:  
                name = param.getName()
                type = param.getType()
                desc = param.getDescription()
                if param.getRequired():
                    requiredStr = ' <a href="info-parameters.' \
                                + globals.outputExtension + '#required>'\
                                + '*</a>'
                    name = name + requiredStr
                name = style(name, 'docParam')
                type = style(type, 'smaller')
                desc = style(desc, 'smaller')
                paramval = [name, type, desc]
                self.addTableRow(paramval)


    def doPrototype(self):
        objName = self.pageObj.elementObj.api.getName()
        self.params = self.method.getParams()
        paramsStr = ''
        if self.params:
            p = []
            for param in self.params:
                p.append('<span class="param">' + param.getName() + '</span>')
            paramsStr = string.join(p, ', ')
        mn = self.method.getName()
        dot = ''
        if mn == 'constructor':
            mn = ''
        else:
            dot = '.'
        s = '<span class="classname">' + objName + '</span>' + dot + \
            '<span class="methodname">' + mn + '</span>' + \
            '(' + paramsStr + ')'
        s = style(s, 'docPrototype')
        self.addTableFullWidthRow(s)
        
    def doDesc(self):
        desc = '<p class="smaller">' + (self.method.getDescription() or '') \
             + '</p>' 
        self.addTableFullWidthRow(desc)

    # PUBLIC
    # Add a gray line
    def getString(self):
        self.addTableFullWidthRow('<hr size="1" bgcolor="#e5e5e5" />')
        return self.s + '</table>\n<br />\n\n'
# ============================================================================

class EventsTable(Table):
    def __init__(self, pageObj):
        # TODO: Add the method column.
        numberOfColumns = 2
        self.numberOfEvents = 0
        Table.__init__(self, numberOfColumns)
        self.pageObj = pageObj
        self.addTableTitle('Events')
        self.headingsAdded = 0

    def addEventRow(self, event):
        if not self.headingsAdded:
            self.headingsAdded = 1
            colHeads = ['Name', 'Description']
            self.addTableColHeadings(colHeads)
        self.numberOfEvents = self.numberOfEvents + 1
        anch = namedAnchor(event.getName(), 'event') 
        # TODO: add jump link
        name = event.getName()
        desc = event.getDescription()
        desc = style(desc, 'smaller')
        name = anch + style(name, 'docParam')
        rowData = [name, desc]
        self.addTableRow(rowData)

# ============================================================================

class Callable:
    def __init__(self, anycallable):
        self.__call__ = anycallable

class IndexFile:
    def __init__(self, titlesArr, filenamesArr, thisIndex):
        self.s = ''
        self.titlesArr = titlesArr
        self.filenamesArr = filenamesArr
        self.thisIndex = thisIndex
        self.title = titlesArr[thisIndex]
        self.filename = filenamesArr[thisIndex]
        self.writeHead()

    # Links to things like differences between ECMA & LZX etc.
    def writeOtherLinks():
        target = 'target="content"'
        s = '<p>'
        s += '<a href="info-reservedwords.' + globals.outputExtension \
             + '" ' + target + '>' \
             + 'Reserved Words</a>\n<br />\n'
        s += '<a href="info-scripting.' + globals.outputExtension \
             + '" ' + target + '>' \
          + 'JavaScript (ECMAScript) in LZX</a>\n<br />\n'
        s += '</p>\n'
        return s
    # Hack to allow for static methods
    writeOtherLinks  = Callable(writeOtherLinks)


    def writeLinksToOtherIndices(self):
        s = ''
        i = -1
        for title in self.titlesArr:
            i = i + 1
            filename = 'index-' + self.filenamesArr[i] + '.' \
                     + globals.outputExtension
            if i == self.thisIndex:
                # this is the one
                s += '<b>' + title + '</b><br />' 
            else:
                s += '<a href="' + filename + '">' + title \
                     + '</a><br />'
        s += '</p>\n'
        return s

    # The links to other index files.
    def writeHead(self):
        s = '<h3>LZX Reference</h3>\n<p>'
        s += self.writeLinksToOtherIndices()
        s += '<hr size="1" />\n'
        s += self.writeOtherLinks()
        self.s += '<hr size="1" />\n'

    def writeSubsection(self, title, filesArr):
        s = '<h3>' + title + '</h3>\n'
        filesArr.sort(titleSort)
        s += '<p>\n'
        target = 'target="content"'
        for file in filesArr:   
            s += '&nbsp;&nbsp;&nbsp;' \
                 + '<a href="' + file.getFileName() + '" ' + target + '>' \
                 +  file.getTitle() \
                 + '</a><br />\n'
        s += '\n</p>\n'
        self.s += s

    # Used when just the index is required for website files.
    def getText(self):
        return '<td>' + self.s + '</td>'

    # Used when creating the download files.
    def closeFile(self):
        filename = 'index-' + self.filename + '.' + globals.outputExtension
        url = globals.htmlOutputDirectory + '/' + filename
        self.s = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"' + \
                 '  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' + \
                 '<html><head><title>Index</title>\n' \
               + '<link rel="STYLESHEET" type="text/css" href="./styles.css"/>\n' \
               + '</head>\n<body bgcolor="#e5e5e5">\n' + self.s \
               + '</body>\n</html>'
        setFileContent(url, self.s)
