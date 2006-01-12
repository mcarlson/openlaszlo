# HTMLWrapper.py
# by Antun Karlovac
# The wrapper pages of each element.

# ============================================================================
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

from globals import *
import config
import XMLDocs
import os.path
import re
import Text

##
# An HTML page that binds the Tag and API to an abstract Element, as well as
# containing See Also information and general info on the usage of the Element.
# TODO: Add support for non-element pages.
#
class HTMLWrapper:
    def __init__( self, url, sourceObj ):
        self.sourceObj = sourceObj 
        self.url = url
        self.filename = os.path.basename( url )
        logger( 'Reading file: ' + self.url, 1 )
        self.attributes = []
        self.text = self.findPage()
        try:
            self.doElement()
        except:
            import sys
            raise FatalError('Error parsing %s: %s' % (url, sys.exc_info()[0]))

    # PUBLIC
    def getName( self ):
        return self.title

    # PUBLIC
    def getFileName( self ):
        return self.filename

    # PUBLIC
    def getExtends( self ):
        if self.extends: 
            return self.extends
        else:
            return 0

    # PUBLIC
    def getXMLFileName( self ):
        return re.sub( '\.html$', '.xml', self.getFileName() )

    # PUBLIC
    def getShortDesc( self ):
        return self.shortdesc

    # PUBLIC
    def getLongDesc( self ):
        return self.longdesc

    # PUBLIC
    # Bind the inheritance of an tags/apis to the HTML Wrapper rather than the
    # Tag or API itself. This must happen after all the Wrapper pages have been
    # done.
    def findExtends( self ):
        logger( 'Finding extension : ' + self.getFileName(), 1 )
        self.extends = 0
        if self.tag:
            if self.tag.doesExtend():
                self.extends = [self.sourceObj.findHTMLFileByTagName( tagName ) \
                                for tagName in self.tag.doesExtend()]
        if self.api:
            if self.api.doesExtend():
                extends = [self.sourceObj.findHTMLFileByAPIName( tagName ) for \
                           tagName in self.api.doesExtend()]
                # Only override tag if api specifies extension
                # (consider private abstract classes)
                if extends:
                    self.extends = extends

    # PRIVATE
    def findPage( self ):
        import os, config
        f = open( config.xmlApiDocsLocation + '/' + self.url )
        s = f.read()
        f.close()
        return s
    
    # PRIVATE
    def findPage( self ):
        import os, config
        f = open( config.xmlApiDocsLocation + '/' + self.url )
        s = f.read()
        f.close()
        return s

    # PRIVATE
    # Find and return the <lzelement> xml in the document
    def findXMLBlockWithinPage( self ):
        import re, xml.dom.minidom
        reStr = '<lzelement(.+)</lzelement>'
        reObj = re.search( reStr, self.text, re.DOTALL )
        if reObj:
            s = reObj.group()
            xml = xml.dom.minidom.parseString( s )
            return xml
        else:
            return None

    # PRIVATE
    # Actions that pertain to an Element page (for now this is the only one),
    # but we may end up supportin other (e.g. Concept) pages.
    def doElement( self ):
        self.elementXML = self.findXMLBlockWithinPage()
        if not self.elementXML:
            logger( 'Could not find XML in wrapper page!', 3 )
            return
        self.title = self.findTitle()
        # TODO: Add in verification for all of these. e.g. Title MUST be there.
        self.shortdesc = self.findShortDesc()
        self.longdesc = self.findLongDesc()
        self.tier = self.findTier()
        self.category = self.findCategory()
        self.tag = self.findTag()
        self.api = self.findApi()
        if not self.tag and not self.api:
            logger( 'No tag or API  specified!', 3 )
            return
        if self.tag:
            self.tagXML = XMLDocs.XMLTagSource()
            # TODO: Normalize paths somehow
            schemaUrl = config.xmlSchemaDocsLocation + '/' + self.tag
            self.tagXML.getDataFromFile( schemaUrl )
            self.tag = self.tagXML.doTag()
            self.sourceObj.sourceFileCompleted( self.tag.url )
        if self.api:
            self.apiXML = XMLDocs.XMLAPISource()
            apiUrl = config.xmlApiDocsLocation + '/' + self.api
            self.apiXML.getDataFromFile( apiUrl )
            self.api = self.apiXML.doAPI( self.apiXML.url )
            self.sourceObj.sourceFileCompleted( self.api.url )

    # PRIVATE
    # Set the name of this element
    def findTitle( self ):
        if self.elementXML:
            rootNode = self.elementXML.firstChild
            return rootNode.getAttribute( 'title' )

    # PRIVATE
    # Find the one-line description of the element
    def findShortDesc( self ):
        rootNode = self.elementXML.firstChild
        nodeToFind = 'lzshortdesc'
        shortDesc = self.findChild( rootNode, nodeToFind )
        if not shortDesc:
            logger( 'Could not find <' + nodeToFind + '> node!', 3 )
        shortDesc = Text.TextNode( shortDesc ) 
        return shortDesc.getText().strip()

    # PRIVATE
    # Get the long description (i.e the section between the end of the little
    # bit of XML and the end of the page.
    def findLongDesc( self ):
        endOfXML = '</lzelement>'
        endOfHTML = '</body>'
        reStr = endOfXML + '(.*)' + endOfHTML
        reObj = re.search( reStr, self.text, re.DOTALL )
        if reObj: 
            s = reObj.group( 1 )
            return s
        else:
            logger( 'Long Description not found in wrapper: ' \
                    + self.getName(), 3 )
            return None
        
    # PRIVATE
    # Get the Tier (e.g. Language Feature, etc.).
    def findTier( self ):
        rootNode = self.elementXML.firstChild
        nodeToFind = 'lztier'
        tier = self.findChild( rootNode, nodeToFind )
        if not tier:
            logger( 'Could not find <' + nodeToFind + '> node!', 3 )
        tier = Text.TextNode( tier ) 
        return tier.getText().strip()
        
    # PRIVATE
    # Get the Category (e.g. Text, Data, etc.).
    def findCategory( self ):
        rootNode = self.elementXML.firstChild
        category = {'base component': 'base classes',
                    'base components': 'base classes',
                    'view': 'basic views',
                    'views': 'basic views',
                    'lz component': 'components',
                    'lz components': 'components'}.get(self.findTier().lower())
        if category:
            return category
        nodeToFind = 'lzcategory'
        category = self.findChild( rootNode, nodeToFind )
        if not category:
            logger( 'Could not find <' + nodeToFind + '> node!', 3 )
        category = Text.TextNode( category )  
        return category.getText().strip()
   
    # PRIVATE
    # Get the tag that pertains to this object
    def findTag( self ):
        rootNode = self.elementXML.firstChild
        nodeToFind = 'lztag'
        tag = self.findChild( rootNode, nodeToFind )
        if not tag:
            return None
        tag = Text.TextNode( tag )
        s = tag.getText().strip()
        if s == 'None':
            return None
        return s

    # PRIVATE
    # Get the tag that pertains to this object
    def findApi( self ):
        rootNode = self.elementXML.firstChild
        nodeToFind = 'lzapi'
        api = self.findChild( rootNode, nodeToFind )
        if not api:
            return None
        api = Text.TextNode( api )
        s = api.getText().strip()
        if s == 'None':
            return None
        return s

    # PRIVATE
    # Search and return a node with a given name
    def findChild( self, parentNode, nodeName ):
        for node in parentNode.childNodes:
            if node.nodeName == nodeName:
                return node
        return None

# ============================================================================

