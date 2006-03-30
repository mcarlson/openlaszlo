# File: LZXConcepts.py
# Author: Antun Karlovac

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

# Classes that represent a 'concept' such as an attribute, a method, an event

# ============================================================================

from globals import *
import config
import xml.dom.minidom
import string
import re
import Text
import copy
import os.path
# import xml.dom.ext

# ============================================================================

##
# Concept
#
class Concept:
    def findChild(self, parentNode, nodeName):
        for node in parentNode.childNodes:
            if node.nodeName == nodeName:
                return node
        return None

    # PUBLIC
    def getName(self):
        return self.name
        
    # PUBLIC
    def getType(self):
        return self.type

    # PRIVATE
    def findName(self):
        # TODO: See if we can avoid referencing the self.xml variable since
        # it's specified in subclass definitions
        s = self.xml.getAttribute('name')
        if not s or s == '':
            logger('Name not specified for:  ' + self.logDesc + ': '\
                    + ' in ' + self.parentObj.getFileName() + '!', 3)
            return
        return s

    # PRIVATE
    def findShortDesc(self, shortDescNodeName='desc'):
        logger('Searching for short description in ' + self.logDesc + ' : ' \
                + self.name, 1)
        rootNode = self.xml
        descNode = self.findChild(rootNode, shortDescNodeName)
        if descNode:
            desc = Text.ShortDesc(descNode)
            s = desc.getText().strip()
            return s
        else:
            logger('No short description found in ' + self.logDesc + ' : ' \
                    + self.name, 1)
            return None

# ============================================================================

##
# An attribute
#
# TODO: Add description for attributes, and long description too.
# Add handling for various
class Attribute(Concept):
    ##
    # A selection for the type value of an attribute
    #
    class Selection:
        def __init__(self, selectXML):
            options = []
            for node in selectXML.childNodes:
                if node.nodeType == 1:
                    if string.lower(node.nodeName) == 'type':
                        options.append(node.getAttribute('value'))
                    else:
                        logger('Invalid node in typeselection', 3)
            self.options = options

        def getOptions(self):
            return self.options

    # PUBLIC
    # Initialize this Attribute object from an XML node. This is not in an 
    # __init__ method, to allow attributes to be copied.
    def doAttributeFromXML(self, xmlObj, parentObj, phase):
        self.logDesc = 'attribute'
        self.parentObj = parentObj
        self.xml = xmlObj
        self.name = self.findName()
        self.type = self.findType()
        if phase == 'xml':
            if parentObj.logDesc == 'schema xml':
                self.tagType = self.type
            elif parentObj.logDesc == 'api xml':
                self.APIType = self.type
        elif phase == 'html':
            self.tagType = self.findTagType()
            self.APIType = self.findAPIType()
        self.default = self.findDefault()
        self.setter = self.findSetter()
        self.category = self.findCategory()
        self.required = self.findRequired()
        self.desc = self.findShortDesc()
        self.isValidInTag = self.findIsValidInTag()
        self.descFromAPI = (self.xml.getAttribute('descfromapi') == 'true')

    # PUBLIC
    # Initialize this Attribute object by copying all of the values from a 
    # given attribute
    def doAttributeCopy(self, attObj, parentObj):
        self.logDesc = 'attribute'
        self.parentObj = parentObj
        self.name = attObj.getName()
        self.type = attObj.getType()
        self.tagType = attObj.getTagType()
        self.APIType = attObj.getAPIType()
        self.default = attObj.getDefault()
        self.setter = attObj.getSetter()
        self.required = attObj.getRequired()
        self.category = attObj.getCategory()
        self.desc = attObj.getDescription()
        # TODO: Verify that the selections for attributes do not need to be
        #       copied

    def findIsValidInTag(self):
        s = self.xml.getAttribute('isvalidintag')
        if not s or s == '' or s == 'true':
            return 1
        else:
            return 0

    # PUBLIC
    def getName(self):
        return self.name

    # PUBLIC
    def getType(self):
        return self.type

    # PUBLIC
    def getTagType(self):
        return self.tagType

    # PUBLIC
    def getAPIType(self):
        return self.APIType

    # PUBLIC
    def getDefault(self):
        return self.default

    # PUBLIC
    def getEvent(self):
        return 'TBD'

    # PUBLIC
    def getSetter(self):
        return self.setter

    # PUBLIC
    def getRequired(self):
        return self.required

    # PUBLIC
    def getCategory(self):
        return self.category

    # PUBLIC
    def getDescription(self):
        return self.desc

    # PUBLIC
    def setDescription(self, s):
        self.desc = s

    # PUBLIC
    def setType(self, type):
        self.type = type

    # PUBLIC
    def setTagType(self, type):
        self.tagType = type

    # PUBLIC
    def setAPIType(self, type):
        self.APIType = type

    # PUBLIC
    def setCategory(self, category):
        self.category = category

    # PUBLIC
    # Return a XML object that represents this attribute.
    def makeXML(self, xmlDoc):
        attribNode = xmlDoc.createElement('attribute')
        attribNode.setAttribute('name', self.getName())
        if self.getType():
            attribNode.setAttribute('type', str(self.getType()))
        if self.getDefault():
            attribNode.setAttribute('default', str(self.getDefault()))
        if self.getRequired():
            attribNode.setAttribute('required', 'true')
        if self.getCategory():
            attribNode.setAttribute('category', str(self.getCategory()))
        if self.isValidInTag:
            attribNode.setAttribute('isvalidintag', 'true')
        else:
            attribNode.setAttribute('isvalidintag', 'false')
        if self.tagType:
            attribNode.setAttribute('tagtype', str(self.getTagType()))
        if self.APIType:
            attribNode.setAttribute('apitype', str(self.getAPIType()))
        if self.getDescription():
            attribNode.setAttribute('descfromapi', getattr(self, 'descFromAPI', 0) and 'true' or 'false')
            descNode = xmlDoc.createElement('desc')
            attribDescription = self.getDescription()
            descText = xmlDoc.createTextNode(attribDescription)
            descNode.appendChild(descText)
            attribNode.appendChild(descNode)

        return attribNode

    # PRIVATE
    def findType(self):
        s = self.xml.getAttribute('type')
        if not s or s == '':
            logger('Attribute type not specified for ' \
                    + self.getName() + ' in ' \
                    + self.parentObj.getFileName() + '!', 2)
        if s == 'selection':
            # Selection attribute (i.e. left | right | center)
            typeSel = self.findChild(self.xml, 'typeselection')
            typeSel = self.Selection(typeSel)
            s = typeSel.getOptions()
        return s

    # PRIVATE
    def findTagType(self):
        s = self.xml.getAttribute('tagtype')
        if not s:
            s = ''
        return s

    # PRIVATE
    def findAPIType(self):
        s = self.xml.getAttribute('apitype')
        if not s:
            s = ''
        return s
        
    # PRIVATE
    def findRequired(self):
        s = self.xml.getAttribute('required')
        if not s or s == '' or s == 'false':
            # Attributes are optional by default.
            return 0
        elif s == 'true':
            return 1
        else:
            # TODO: Check this. Returning a value might cause problems.
            #       Perhaps we should have a default that it results to.
            logger('Attribute required value for ' + self.getName() \
                    + ' invalid in ' + self.parentObj.getFileName(), 3)
            return 0

    # PRIVATE
    def findCategory(self):
        s = self.xml.getAttribute('category')
        if not s or s == '':
            defaultCategory = 'setter'
            return defaultCategory
        else:
            return s

    # PRIVATE
    def findDefault(self):
        s = self.xml.getAttribute('default')
        if not s or s == '':
            return None
        else:
            return s

    # PRIVATE
    def findSetter(self):
        s = self.xml.getAttribute('setter')
        if not s or s == '':
            return None
        else:
            return s

# ============================================================================

##
# An event
#
class Event(Concept):
    def __init__(self, xmlObj):
        self.logDesc = 'event'
        self.xml = xmlObj
        self.name = self.findName()
        self.desc = self.findShortDesc()
        self.method = self.findMethod()

    # PUBLIC
    def getMethod(self):
        return self.method

    # PUBLIC
    def getType(self):
        return 'script'

    # PUBLIC
    def getRequired(self):
        return 'false'

    # PUBLIC
    def getDefault(self):
        return None

    # PUBLIC
    def getSetter(self):
        return None

    # PUBLIC
    def getCategory(self):
        return 'eventhandler'
    
    # PUBLIC
    def getDescription(self):
        return self.desc

    # PUBLIC
    # Return a XML object that represents this attribute.
    def makeXML(self, xmlDoc):
        attribNode = xmlDoc.createElement('event')
        attribNode.setAttribute('name', self.getName())

        return attribNode

    # PRIVATE
    # Return the name of the method that this event is triggered on.
    def findMethod(self):
        s = self.xml.getAttribute('method')
        if s == '':
            return 0
        return s

# ============================================================================

##
# Field
# TODO: It may be more appropriate to treat Fields differently from regular
# attributes.
#
class Field(Attribute):
    def __init__(self, xmlObj, parentObj):
        self.parentObj = parentObj
        self.tagType = ''
        self.APIType = ''
        Attribute.doAttributeFromXML(self, xmlObj, self.parentObj, 'xml')
        self.logDesc = 'field'
        self.category = 'readonly'

# ============================================================================

##
# Method
#
class Method(Concept):
    ##
    # A method parameter
    #
    class Parameter(Concept):
        def __init__(self, paramXML, method):
            self.logDesc = 'parameter'
            self.xml = paramXML
            self.name = self.findName()
            self.methodName = method.getName()
            self.url = os.path.basename(method.url)
            self.type = self.findType()
            self.desc = self.findShortDesc()
            self.required = self.findRequired()

        # PUBLIC
        def getDescription(self):
            return self.desc

        # PUBLIC 
        def getRequired(self):
            return self.required
        # PRIVATE
        def findType(self):
            s = self.xml.getAttribute('type')
            if not s or s == '':
                logger('Type not specified for ' + self.logDesc + ': '\
                        + self.name + ' in ' + self.methodName + ' in ' \
                        + self.url, 2)
            return s

        # PRIVATE
        def findRequired(self):
            s = self.xml.getAttribute('required')
            if not s or s == '':
                required = 0
            elif string.lower(s) == 'false':
                required = 0
            elif string.lower(s) == 'true':
                required = 1
            else:
                logger('Invalid value for required in ' + self.logDesc + ': '\
                        + self.getName() + ' in ' \
                        + self.parentObj.getFileName(), 3)
            return required

    ##
    # A return for a method
    #
    class Returns(Concept):
        def __init__(self, returnXML):
            self.logDesc = 'return'
            # TODO: Fix the above methods so that we don't have to giv 
            self.name = 'N/A'
            self.xml = returnXML
            self.type = self.findType()
            self.desc = self.findShortDesc()

        # PUBLIC
        def getDescription(self):
            return self.desc

        # PUBLIC
        def getType(self):
            return self.type

        # PRIVATE
        def findType(self):
            s = self.xml.getAttribute('type')
            if not s or s == '':
                logger('Type not specified for ' + self.logDesc, 2)
            return s

    def __init__(self, xmlObj, url):
        self.logDesc = 'method'
        self.url = url
        self.xml = xmlObj
        self.name = self.findName()
        self.desc = self.findShortDesc()
        self.params = self.findParams()
        self.returns = self.findReturns()
        self.event = self.findEvent()


    # PUBLIC
    def getReturns(self):
        return self.returns

    # PUBLIC
    def getParams(self):
        return self.params

    # PUBLIC
    # Return a XML node that represents this method.
    def makeXML(self, xmldoc):
        methodNode = xmldoc.createElement('method')
        methodNode.setAttribute('name', self.getName())
        # Description
        if self.desc:
            descNode = xmldoc.createElement('desc')
            descText = xmldoc.createTextNode(self.getDescription())
            descNode.appendChild(descText)
            methodNode.appendChild(descNode)
        # Parameters
        if self.params:
            paramsNode = xmldoc.createElement('parameters')
            for param in self.params:
                paramNode = xmldoc.createElement('param')
                paramNode.setAttribute('name', param.getName())
                paramNode.setAttribute('type', param.getType())
                if param.getRequired():
                    required = 'true'
                else:
                    required = 'false'
                paramNode.setAttribute('required', required)
                paramDescNode = xmldoc.createElement('desc')
                paramDesc = str(param.getDescription())
                descText = xmldoc.createTextNode(paramDesc)
                paramDescNode.appendChild(descText)
                paramNode.appendChild(paramDescNode)
                paramsNode.appendChild(paramNode)
            methodNode.appendChild(paramsNode)
        # Returns
        if self.returns:
            returnsNode = xmldoc.createElement('return')
            returnsNode.setAttribute('type', self.returns.getType())
            returnsDesc = str(self.returns.getDescription())
            returnsText = xmldoc.createTextNode(returnsDesc)
            returnsDescNode = xmldoc.createElement('desc')
            returnsDescNode.appendChild(returnsText)
            returnsNode.appendChild(returnsDescNode)
            methodNode.appendChild(returnsNode)
        return methodNode

    # PUBLIC
    def getDescription(self):
        return self.desc

    # PUBLIC
    def setEvent(self, eventName):
        self.event = eventName

    # PRIVATE
    def findEvent(self):
        s = self.xml.getAttribute('event')
        if s == '':
            return 0
        return s

    # PRIVATE
    def findParams(self):
        params = []
        logger('Searching for params in ' + self.logDesc + ': ' \
                + self.name, 1)
        paramsNode = self.findChild(self.xml, 'parameters')
        if paramsNode:
            for node in paramsNode.childNodes:
                if node.nodeType == 1 and node.nodeName == 'param':
                    param = self.Parameter(node, self)
                    params.append(param)
            return params
        else:
            return None

    # PRIVATE
    def findReturns(self):
        logger('Searching for returns value in ' + self.logDesc + ': ' \
                + self.name, 1)
        returnsNode = self.findChild(self.xml, 'return')
        if returnsNode:
            returns = self.Returns(returnsNode)
            return returns
        else:
            return None

            
# ============================================================================

##
# An element (e.g. "The Canvas")
#
class Element:
    def __init__(self, elementObj):
        self.logDesc = 'element'
        self.htmlWrapper = elementObj
        self.setName()
        self.setTagApi()
        self.combineAttributes()
        self.xml = self.makeXML()
        

    # PUBLIC 
    # Create the XML for this file.
    def makeXMLFile(self, destinationDir):
        logger('Creating XML file for: ' + self.getName(), 1)
        filename = self.getXMLFileName()
        s = self.serialize()
        fullpath = destinationDir + '/' + filename
        setFileContent(fullpath, s)
    
    # PUBLIC
    # Return the name of the XML file that describes the ELEMENT that this 
    # extends.
    def getExtends(self):
        if self.htmlWrapper.getExtends():
            return [htmlWrapper.getXMLFileName() \
                    for htmlWrapper in self.htmlWrapper.getExtends() \
                    if htmlWrapper]
        else:
            return 0

    # PUBLIC
    def getName(self):
        return self.title

    # PUBLIC
    def getXMLFileName(self):
        return re.sub('\.html$', '.xml', self.htmlWrapper.getFileName())

    # PUBLIC
    # The file name is really the HTML filename.
    def getFileName(self):
        return self.htmlWrapper.getFileName()

    # PUBLIC
    def containsAttribute(self, attribName):
        for attrib in self.attributes:
            if attrib.getName() == attribName:
                return 1
        return 0

    # PUBLIC
    def getAttributes(self):
        return self.attributes

    def getMethods(self):
        methods = []
        if self.tag: methods += self.tag.methods
        if self.api: methods += self.api.methods
        return methods

    def getEvents(self):
        events = []
        if self.tag: events += self.tag.events
        if self.api: events += self.api.events
        return events

    # PUBLIC 
    def getAttribute(self, attribName):
        attrs = self.getAttributes()
        for attr in attrs:
            if attr.getName() == attribName:
                return attr
        return None

    # PUBLIC
    def serialize(self):
        logger('Serializing ' + self.getName(), 1)
        # xml.dom.ext.PrettyPrint(self.xml)
        s = self.xml.toxml()
        return s

    # PRIVATE
    # Create an XML element that represents this Element.
    def makeXML(self):
        logger('Serializing ' + self.getName(), 1)
        impl = xml.dom.minidom.getDOMImplementation()
        doc = impl.createDocument(None, "element", None)

        root = doc.documentElement
        root.setAttribute('category', self.htmlWrapper.category)
        root.setAttribute('tier', self.htmlWrapper.tier)
        root.setAttribute('title', self.getName())
        root.setAttribute('filename', self.getFileName())
        if self.getExtends():
            root.setAttribute('extends', ",".join(self.getExtends()))

        shortDescNode = doc.createElement('desc')
        shortDescText = doc.createTextNode(self.htmlWrapper.getShortDesc())
        shortDescNode.appendChild(shortDescText)

        root.appendChild(shortDescNode)

        # Long Description (text from the wrapper page)
        longDescText = str(self.htmlWrapper.getLongDesc())
        longDescText = longDescText
        longDescNode = doc.createElement('longdescription')
        longDescTextNode = doc.createTextNode(longDescText)
        longDescNode.appendChild(longDescTextNode)
        root.appendChild(longDescNode)

        # Attributes
        if len(self.attributes) > 0:
            attribsNode = doc.createElement('attributes')
            for attrib in self.attributes:
                attribNode = attrib.makeXML(doc)
                attribsNode.appendChild(attribNode)
            root.appendChild(attribsNode)

        apiNode = None
        
        #print 'methods', self.getName(), [m.name for m in self.getMethods()]
        if self.getMethods():
            apiNode = doc.createElement('api')
            if self.tag:
                apiNode.setAttribute('name', self.tag.name)
            # Methods
            methods = self.getMethods()
            if methods:
                if len(methods) > 0:
                    methodsNode = doc.createElement('methods')
                    for meth in methods:
                        methodNode = meth.makeXML(doc)
                        methodsNode.appendChild(methodNode) 
                    apiNode.appendChild(methodsNode)

        #print 'events', self.getName(), [m.name for m in self.getEvents()]
        if self.getEvents():
            apiNode = apiNode or doc.createElement('api')
            if self.tag:
                apiNode.setAttribute('name', self.tag.name)
            events = self.getEvents()
            if events:
                if len(events) > 0:
                    eventsNode = doc.createElement('events')
                    for evt in events:
                        eventNode = evt.makeXML(doc)
                        eventsNode.appendChild(eventNode) 
                    apiNode.appendChild(eventsNode)

        # API
        if self.api:
            apiNode = apiNode or doc.createElement('api')
            apiNode.setAttribute('name', self.api.getName())
            sourceFileName = os.path.basename(self.api.getFileName())
            apiNode.setAttribute('src', sourceFileName)
            apiXML = self.api.xml.firstChild
            if self.api.extends:
                apiNode.setAttribute('extends', ",".join(self.api.extends))
            # All other nodes
            for node in apiXML.childNodes:
                if node.nodeType == 1:
                    if node.nodeName != 'methods':
                        apiNode.appendChild(node)
        
        if apiNode:
            root.appendChild(apiNode)
        
        # Tag
        if self.tag:
            tagNode = doc.createElement('tag')
            tagNode.setAttribute('name', self.tag.getName())
            sourceFileName = os.path.basename(self.tag.getFileName())
            tagNode.setAttribute('src', sourceFileName)
            if self.tag.getDescription():
                tagDesc = self.tag.getDescription()
                tagDescNode = doc.createElement('desc')
                tagDescTextNode = doc.createTextNode(tagDesc)
                tagDescNode.appendChild(tagDescTextNode)
                tagNode.appendChild(tagDescNode)
            root.appendChild(tagNode)
        return doc

    # PRIVATE
    def setName(self):
        self.title = self.htmlWrapper.getName()
    
    # PRIVATE
    def setTagApi(self):
        self.api = self.htmlWrapper.api
        self.tag = self.htmlWrapper.tag

    # PRIVATE
    def combineAttributes(self):
        self.attributes = []
        if self.htmlWrapper.tag:
            attribs = self.htmlWrapper.tag.getAttributes()
            if len(attribs) > 0:
                logger('Inserting attributes to ' + self.logDesc + ': ' \
                        + self.getName() + ' from ' \
                        + self.htmlWrapper.tag.getName(), 1)
                for attrib in attribs:
                    self.addOrMergeAttribute(attrib, 'tag')

        if self.htmlWrapper.api:
            attribs = self.htmlWrapper.api.getAttributes()
            if len(attribs) > 0:
                logger('Inserting attributes to ' + self.logDesc + ': ' \
                        + self.getName() + ' from ' \
                        + self.htmlWrapper.api.getName(), 1)
                for attrib in attribs:
                    self.addOrMergeAttribute(attrib, 'api')
            events = self.htmlWrapper.api.getEvents()
            # Merging all events into the attributes.
            # TODO: Verify that this is the right thing to do. Perhaps not all
            #       events are usable tag attributes?
            #       3/18/03 Emailed Oliver about this.
            #       3/22/03 Changed to just setting the category to 
            #               eventhandler.
            if len(events) > 0:
                for event in events:    
                    attribs = self.getAttributes()
                    eventName = event.getName()
                    for attrib in attribs:
                        if attrib.getName() == eventName:
                            attrib.setCategory('eventhandler')
        else:
            # Elements with NO API that do NOT extend, can NOT by definition
            # have any setter attributes. This is really just an issue of 
            # overriding defaults (the default attrib type is 'setter').
            # Redmond components are excluded for now because they should really
            # extend, but instead they're in the schema.
            tier = self.htmlWrapper.tier
            if not self.getExtends() and tier != 'Redmond Component':
                attribs = self.getAttributes()
                for attrib in attribs:
                    if attrib.getCategory() == 'setter':
                        attrib.setCategory('final')

    # PRIVATE
    # Add the attribute to this element, or combine it with an attribute if it 
    # already exists
    def addOrMergeAttribute(self, newAttr, fromWhere):
        if not self.containsAttribute(newAttr.getName()):
            # Create new attribute
            attObj = Attribute()
            # attObj.tagType = ''
            # attObj.APIType = ''
            attObj.doAttributeCopy(newAttr, self)
            attObj.element = self
            if fromWhere == 'tag':
                attObj.isValidInTag = 1
                attObj.descFromAPI = 0
            elif fromWhere == 'api':
                attObj.isValidInTag = 0
                attObj.descFromAPI = 1
            self.attributes.append(attObj)
        else:
            # Merge
            existingAttr = self.getAttribute(newAttr.getName())
            if not existingAttr.isValidInTag:
                logger('Ignoring duplicate attribute ' + newAttr.logDesc + ': '\
                        + newAttr.getName() + ' in ' + newAttr.parentObj.getFileName(), 3)
            else:
                self.mergeAttributes(existingAttr, newAttr)

    # PRIVATE
    def mergeAttributes(self, oldAttr, newAttr):
        logger('Merging info for attribute: ' + newAttr.getName() \
                + ' in ' + self.getName(), 1)
        oldAttr.element = self
        # Type
        if not oldAttr.getType():
            # Attribute property not set, so definately use the new value
            oldAttr.setType(newAttr.getType())
        else:
            # Attribute property already set, use new if set
            if newAttr.getType():
                oldAttr.setType(newAttr.getType())

        # API Type
        if not oldAttr.getAPIType():
            # Attribute property not set, so definately use the new value
            oldAttr.setAPIType(newAttr.getAPIType())
        else:
            # Attribute property already set, use new if set
            if newAttr.getAPIType():
                oldAttr.setAPIType(newAttr.getAPIType())

        # Tag Type
        if not oldAttr.getTagType():
            # Attribute property not set, so definately use the new value
            oldAttr.setTagType(newAttr.getTagType())
        else:
            # Attribute property already set, use new if set
            if newAttr.getTagType():
                oldAttr.setTagType(newAttr.getTagType())
                
        # Category
        if newAttr.getCategory() == 'readonly' \
           or newAttr.getCategory() == 'eventhandler':
            oldAttr.setCategory(newAttr.getCategory())
        # For now set any attribute with on.... as its name to be an event
        # handler.
        # TODO: Fix this so that we're not doing string recognition.
        reStr = '^on[a-z]'
        reObj = re.search(reStr, oldAttr.getName())
        if reObj:   
            oldAttr.setCategory('eventhandler')
        

        # Description
        oldDesc = oldAttr.getDescription()
        newDesc = newAttr.getDescription()
        if isStringBlank(oldDesc):
            if not isStringBlank(newDesc):
                oldAttr.descFromAPI = getattr(newAttr, 'descFromAPI', 0)
                oldAttr.setDescription(newDesc)
        else:
            if not isStringBlank(newDesc):
                s = '<b>Tag: </b>' + oldDesc + '<br /><b>API: </b>' + newDesc
                logger(newAttr.getName() + '\nUsing api doc:\n' + newDesc + '\nIgnoring tag doc:\n' + oldDesc, 2)
                oldAttr.descFromAPI = getattr(newAttr, 'descFromAPI', 0)
                oldAttr.setDescription(newDesc)

# ============================================================================

# Check if a string is blank or empty or 'None' or all-whitespace.
def isStringBlank(s):
    if not s:
        return 1
    if s == 'None':
        return 1
    for char in s:
        if char not in string.whitespace:
            return 0
    return 1

##
# The index XML
#
class Index:
    def __init__(self, allElements):
        self.allElements = allElements

    def makeXMLFile(self, destinationDir):
        impl = xml.dom.minidom.getDOMImplementation()
        doc = impl.createDocument(None, "index", None)
        root = doc.documentElement

        entries = [(e.tag.name, e) for e in self.allElements if e.tag]
        entries.extend([(e.api.name, e) for e in self.allElements if e.api])
        entries.sort(lambda x, y: cmp(x[0].lower(), y[0].lower()))

        for et in entries:
            itemNode = doc.createElement('item')
            n, e = et
            itemNode.setAttribute('title', n)
            if e.tag and n == e.tag.name:
                itemNode.setAttribute('class', 'tag')
                if e.api:
                    itemNode.setAttribute('subtitle', e.api.name)
            if e.api and n == e.api.name:
                itemNode.setAttribute('class', 'api')
                if e.tag:
                    itemNode.setAttribute('subtitle', e.tag.name)
            itemNode.setAttribute('href', e.getFileName())
            root.appendChild(itemNode)

        setFileContent(destinationDir + '/' + 'index.xml', doc.toxml())
