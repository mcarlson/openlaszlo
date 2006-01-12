# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

from globals import *
import LZXConcepts
import string
import xml.dom
import Text
import os

##
# A generic XML document.
#
class XMLDoc:
    # PRIVATE
    # Search and return a node with a given name
    def findChild(self, parentNode, nodeName):
        for node in parentNode.childNodes:
            if node.nodeName == nodeName:
                return node
        return None

    # PUBLIC
    def getDescription(self):
        return self.desc

    # PUBLIC
    def doesExtend(self):
        if self.extends:
            return self.extends
        else:
            return 0

    # PUBLIC
    def getFileName(self):
        if self.url:
            return self.url
        else:
            return self.getName()
        
    # Returns the URL of the generated page
    def getRelativeUrl(self):
        import os
        if hasattr(self, 'fileName'):
            fn = os.path.split(self.fileName)[1]
        else:
            fn = self.getFileName()
        return os.path.splitext(fn)[0] + '.html'
    
    # PUBLIC
    def getAttributes(self):
        return self.fields
        
    # PUBLIC
    def getName(self):
        return self.name

    # PUBLIC
    # Open a file and read the text into the classes buffer.
    def getDataFromFile(self, url):
        self.url = url
        logger('Reading file: ' + self.url, 1)
        try:
            f = open(url)
        except:
            raise str('Could not open file: ' + self.url)
        s = f.read()
        f.close()
        self.xmlData = s
        from xml.sax._exceptions import SAXParseException
        try:
            self.toObject()
        except SAXParseException, e:
            #raise "oops"
            raise '%s: %s' % (str(url), e)

    # PUBLIC
    # An alternative to getDataFromFile. Assign the buffer to the string.
    def getDataFromString(self, s):
        # The URL should read 'either API or Tag source', because at this
        # stage it could be either that's missing.
        self.xmlData = s
        self.toObject()
        self.url = self.xml.firstChild.getAttribute('src') 

    # PRIVATE
    def findExtends(self):
        rootNode = self.xml.firstChild
        extends = rootNode.getAttribute('extends')
        if extends == '' or extends == 'None' or extends == 'Object':
            logger('No extends information found for: ' + self.logDesc + \
                    ' : ' + str(self.name), 1)
            return []
        elif self.name == "Dataset":
            # FIXME: [2004-08-04 ptw] Bug 3824 Compute LzDataset's
            # inheritance from the source
            return ["lzdataelement.xml", "node.xml"]
        else:
            return extends.split()

    # PRIVATE
    # Just a quick sanity check to make sure that the root node of this doc
    # is what it's supposed to be.
    def isRootNode(self, nodeName):
        if string.lower(self.xml.firstChild.nodeName) != nodeName:
            return 1
        else:
            return 0

    # PRIVATE
    # Make a minidom object of the data in buffer.
    def toObject(self):
        self.xml = xml.dom.minidom.parseString(self.xmlData)

    # PRIVATE
    def findLongDesc(self):
        logger('Searching for long description in ' + self.logDesc + ' : ' \
                + self.name, 1)
        rootNode = self.xml.firstChild
        descNode = self.findChild(rootNode, 'longdescription')
        if descNode:
            desc = Text.ShortDesc(descNode)
            s = desc.getText()
            return s
        else:
            return None

    # PRIVATE
    def findShortDesc(self):
        logger('Searching for short description in ' + self.logDesc + ' : ' \
                + str(self.name), 1)
        rootNode = self.xml.firstChild
        descNode = self.findChild(rootNode, 'desc')
        if descNode:
            desc = Text.ShortDesc(descNode)
            s = desc.getText()
            return s
        else:
            return None

    # PRIVATE
    def findAttributes(self, phase):
        a = []
        attrs = self.findChild(self.xml.firstChild, 'attributes')
        if not attrs:
            logger('No attributes found for tag: ' + self.name, 1)
            return a
        
        attrs = attrs.childNodes
        for att in attrs:
            if att.nodeType == 1 and att.nodeName == 'attribute':
                attObj = LZXConcepts.Attribute()
                attObj.owner = self
                attObj.tagType = ''
                attObj.APIType = ''
                attObj.doAttributeFromXML(att, self, phase)
                a.append(attObj)
        return a

    # PRIVATE
    def findEvents(self):
        logger('Searching for events in ' + self.logDesc + ' : ' \
                + str(self.name), 1)
        rootNode = self.xml.firstChild
        eventsNode = self.findChild(rootNode, 'events')
        a = []
        if eventsNode:
            events = eventsNode.childNodes
            for ev in events:
                if ev.nodeType == 1 and ev.nodeName == 'event':
                    eventObj = LZXConcepts.Event(ev)
                    eventObj.owner = self
                    a.append(eventObj)
                    if eventObj.getMethod():
                        self.setMethodEvent(eventObj.getName(), \
                                             eventObj.getMethod())
        else:
            logger('No events found in ' + self.logDesc + ' : ' \
                    + str(self.name), 1)
        return a

    # PRIVATE
    def findMethods(self):
        logger('Searching for methods in ' + self.logDesc + ' : ' \
                + str(self.name), 1)
        a = []
        rootNode = self.xml.firstChild
        methodsNode = self.findChild(rootNode, 'methods')
        if methodsNode:
            methods = methodsNode.childNodes
            for meth in methods:
                if meth.nodeType == 1 and meth.nodeName == 'method':
                    methodObj = LZXConcepts.Method(meth, getattr(self, 'fileName', self.url or 'unknown filename'))
                    methodObj.owner = self
                    a.append(methodObj)
        else:
            logger('No methods found in ' + self.logDesc + ' : ' \
                    + self.name, 1)
        return a

        

# ============================================================================

##
# A XML docs source document from the schema.
#
class XMLTagSource(XMLDoc):
    
    # PUBLIC
    # Return all of the attributes as an array
    def getAttributes(self):
        if self.attributes:
            return self.attributes
        else:
            return []

    def getMethods(self):
        return self.methods

    def getEvents(self):
        return self.events

    # PUBLIC
    def doTag(self):
        self.logDesc = 'schema xml'
        self.name = self.findTagName()
        self.extends = self.findExtends()
        self.attributes = self.findAttributes('xml')
        self.methods = self.findMethods()
        self.events = self.findEvents()
        self.desc = self.findShortDesc()
        return self
    
    # PRIVATE
    def findTagName(self):
        rootNode = self.xml.firstChild
        rootNodeName = 'tag'
        if self.isRootNode(rootNodeName):
            logger('Invalid root node name in ' + self.url + \
                    '! Must be <' + rootNodeName \
                    + '>.', 3)
        name = rootNode.getAttribute('name')
        if not name or name == '':
            logger('Tag name not specified!', 3)
            return
        return name

# ============================================================================

##
# A XML docs source document from the LFC.
#
class XMLAPISource(XMLDoc):
    # PUBLIC
    def doAPI(self, fileName):
        self.logDesc = 'api xml'
        self.fileName = fileName
        self.name = self.findAPIName()
        self.extends = self.findExtends()
        self.desc = self.findShortDesc()
        # AK: I had to search for both <field> and <attribute> tags because
        # for some reason the files contain both now (5/8/03).
        self.fields = self.findFields() + self.findAttributes('xml')
        self.methods = self.findMethods()
        self.events = self.findEvents()
        return self

    # PUBLIC
    def getMethods(self):
        return self.methods

    # PUBLIC
    def getEvents(self):
        return self.events

    # PRIVATE
    def findAPIName(self):
        rootNode = self.xml.firstChild
        rootNodeName = 'api'
        if self.isRootNode(rootNodeName):
            logger('Invalid root node name in ' + self.url + \
                    '! Must be <' + rootNodeName \
                    + '>.', 3)
        name = rootNode.getAttribute('name') 
        if not name or name == '':
            raise 'API name not specified!'
        return name

    # PRIVATE
    # Find a method by name, and set its event attribute to the given event.
    # Events are given together with the name of the method that triggers them,
    # but then the method needs to be told what event it sends.
    def setMethodEvent(self, eventName, methodName):
        methods = self.getMethods()
        for meth in methods:
            if meth.getName() == methodName:
                meth.setEvent(eventName)
                return
        logger('Could not find method ' + methodName + ' as described by '\
                + eventName + ' event + ', 3)
            

    # PRIVATE
    def findFields(self):
        a = []
        logger('Searching for fields in ' + self.logDesc + ' : ' \
                + str(self.name), 1)
        rootNode = self.xml.firstChild
        fieldsNode = self.findChild(rootNode, 'fields')
        if fieldsNode:
            fields = fieldsNode.childNodes
            for fld in fields:
                if fld.nodeType == 1 and fld.nodeName == 'field':
                    fieldObj = LZXConcepts.Field(fld, self)
                    fieldObj.owner = self
                    a.append(fieldObj)
            return a
        else:
            logger('No fields found in ' + self.logDesc + ' : ' \
                    + str(self.name), 1)
            return a

# ============================================================================

##
# A XML document that is generated by Phase 1
# 
class XMLElementSource(XMLDoc):
    # api: NoneType
    # attributes: list
    # desc: string
    # extends: int
    # filename: string
    # logDesc: string
    # name: unicode
    # sourceObj: __main__.Source
    # tag: XMLDocs.XMLTagSource
    # url: string
    # wrapperText: unicode
    # xml: xml.dom.minidom.Document
    # xmlData: string
    
    def __init__(self, url, sourceObj):
        self.logDesc = 'element xml'
        self.sourceObj = sourceObj 
        self.url = url
        logger('Reading XML file: ' + self.url, 1)
        self.getDataFromFile(self.url)
        self.filename = os.path.basename(url)
        self.name = self.findElementName()
        #self.library = self.xml.firstChild.getAttribute('library') or 'xmlementsoure'
        self.desc = self.findShortDesc()
        self.extends = self.findExtends()
        self.wrapperText = self.findLongDesc()
        self.attributes = self.findAttributes('html')
        self.tag = self.findTag()
        self.api = self.findAPI()

    # PUBLIC
    def getCategory(self):
        return self.xml.documentElement.getAttribute('category')

    # PUBLIC
    def getTier(self):
        return self.xml.documentElement.getAttribute('tier')

    # PUBLIC
    # Return the descriptive element text that pertains to the ELEMENT.
    def getWrapperText(self):
        return self.wrapperText

    # PUBLIC
    def getShortDesc(self):
        return self.desc

    # PUBLIC
    def getAttributes(self):
        return self.attributes

    # PUBLIC
    # Start the recursive process to find inherited attributes.
    def getInhAttributes(self):
        a = []
        for e in self.getExtends():
            super = self.sourceObj.getObjByName(e)
            a = super.collectInhAttributes(a)
        return a


    # PUBLIC
    # Recursively go up through the inheritance tree and collect attributes.
    def collectInhAttributes(self, a):
        # Collect all of this guys attributes.
        myAttribs = self.getAttributes()
        # Don't add the attribute if it's already there.
        existingAttribs = []
        for attrib in a:
            existingAttribs.append(attrib.getName())
        for attrib in myAttribs:
            attribName = attrib.getName()
            if attribName not in existingAttribs:
                a.append(attrib)
        for e in self.getExtends():
            # Keep going up the tree.
            super = self.sourceObj.getObjByName(e)
            if super:
                # print self.getName() + ' extends ' + super.getName()
                a = super.collectInhAttributes(a)
        return a

    # PUBLIC
    def getInhMethods(self):
        a = []
        for e in self.getExtends():
            super = self.sourceObj.getObjByName(e)
            a = super.collectInhMethods(a)
        return a

    # PUBLIC
    def collectInhMethods(self, a):
        # Collect all of this guys methods.
        myMethods = self.getMethods()
        # Don't add the method if it's already there.
        existingMethods = []
        for method in a:
            existingMethods.append(method.getName())
        for method in myMethods:
            methodName = method.getName()
            if methodName not in existingMethods:
                a.append(method)
        for e in self.getExtends():
            # Keep going up the tree.
            super = self.sourceObj.getObjByName(e)
            if super:
                a = super.collectInhMethods(a)
        return a

    # PUBLIC
    def getInhEvents(self):
        a = []
        for e in self.getExtends():
            super = self.sourceObj.getObjByName(e)
            a = super.collectInhEvents(a)
        return a

    # PUBLIC
    def collectInhEvents(self, a):
        # Collect all of this guys event.
        myEvents = self.getEvents()
        # Don't add the event if it's already there.
        existingEvents = []
        for event in a:
            existingEvents.append(event.getName())
        for event in myEvents:
            eventName = event.getName()
            if eventName not in existingEvents:
                a.append(event)
        for e in self.getExtends():
            # Keep going up the tree.
            super = self.sourceObj.getObjByName(e)
            if super:
                a = super.collectInhEvents(a)
        return a

    # PUBLIC
    def getMethods(self):
        methods = []
        if self.api: methods += self.api.getMethods()
        if self.tag: methods += self.tag.getMethods()
        return methods

    # PUBLIC
    def getEvents(self):
        events = []
        if self.api: events += self.api.getEvents()
        if self.tag: events += self.tag.getEvents()
        return events

    # PUBLIC
    def getFileName(self):
        return self.filename

    # PUBLIC
    def getExtends(self):
        return self.extends

    # PRIVATE
    def findElementName(self):
        rootNode = self.xml.firstChild
        rootNodeName = 'element'
        if self.isRootNode(rootNodeName):
            logger('Invalid root node name in ' + self.url + \
                    '! Must be <' + rootNodeName \
                    + '>.', 3)
        name = rootNode.getAttribute('title')
        if not name or name == '':
            logger('Element name not specified!', 3)
            return
        return name
    
    # PRIVATE
    def findTag(self):
        tagNode = self.findChild(self.xml.firstChild, 'tag')
        if tagNode: 
            tagStr = tagNode.toxml()
            tagObj = XMLTagSource()
            tagObj.getDataFromString(tagStr)
            tagObj.doTag()
            return tagObj
        else:
            return None
    
    # PRIVATE
    def findAPI(self):
        apiNode = self.findChild(self.xml.firstChild, 'api')
        if apiNode: 
            apiStr = apiNode.toxml()
            apiObj = XMLAPISource()
            apiObj.getDataFromString(apiStr)
            apiObj.doAPI(self.url)
            return apiObj
        else:
            return None

    # PRIVATE
    def findShortDesc(self):
        descNode = self.findChild(self.xml.firstChild, 'desc')
        desc = Text.ShortDesc(descNode).getText()
        return desc
