# File: rngparse.py
# Author: Oliver Steele

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

"""Usage: %(progname)s rngfile [-o dtdfile]
"""

"""
TBD:
- types for components
- parenthesize dataset cm
- refs -> DTD entities

References:
- http://www.w3schools.com/dtd/dtd_attributes.asp
"""

import os
False, True = 0, 1

Jython = False
try:
    import org.jdom
    Jython = True
except ImportError:
    pass

LZA = "http://www.laszlosystems.com/annotations/1.0"
ANN = "http://relaxng.org/ns/compatibility/annotations/1.0"

Debug = False

#
# Utilities
#

def intersection(as, bs):
    """ [a], [a] -> [a] """
    return [a for a in as if a in bs]

def reduce0(fn, lists):
    """ (a->b), [a] -> [b] """
    if lists:
        return reduce(fn, lists)
    return lists

def removeDuplicates(list):
    result = {}
    for item in list:
        result[item] = 1
    return result.keys()

#
# XML Utilities
#

def childElements(node, tagName=None):
    elements = []
    for child in node.childNodes:
        if child.nodeType == child.ELEMENT_NODE:
            if tagName and tagName != child.tagName: continue
            elements.append(child)
    return elements

def getChild(node, tagName):
    children = childElements(node, tagName)
    if children:
        return children[0]

def getChildNS(node, ns, tagName):
    children = [c for c in node.getElementsByTagNameNS(ns, tagName)
                if c.parentNode == node]
    if children:
        return children[0]

def recursiveChildElements(node, tagName=None):
    elements = []
    for child in node.childNodes:
        if child.nodeType == child.ELEMENT_NODE:
            if not tagName or tagName == child.tagName:
                elements.append(child)
            elements += recursiveChildElements(child, tagName)
    return elements

def contentString(node):
    # was: return ''.join([n.toxml() for n in node.childNodes])
    if node.nodeType == node.TEXT_NODE:
        return node.data
    elif node.nodeType == node.ELEMENT_NODE:
        return ''.join(map(contentString, node.childNodes))
    else:
        raise "contentString(%r)" % node


#
# Elements
#

class Element:
    def __init__(self, name):
        self.name = name
        self.library = None
        self.doc = None
        self.contentModel = None
        self.attrs = []

    def __repr__(self):
        return 'Element(%s)' % self.name

    def clone(self):
        c = self.__class__(self.name)
        c.__dict__.update(self.__dict__)
        c.attrs = c.attrs[:]
        return c

def mergeElements(a, b, doc=False):
    c = Element(a.name)
    c.contentModel = Choice, [a.contentModel, b.contentModel]
    c.attrs = mergeAttributeLists(a.attrs, b.attrs, doc=doc)
    return c

#
# Attributes
#

class Attribute:
    def __init__(self, name):
        self.name = name
        self.type = 'CDATA' # DTD type
        self.xtype = None # schema type
        self.required = True
        self.isevent = False
        self.default = None
        self.doc = None
    
    def __eq__(self, other):
        if self.__class__ is not other.__class__: return False
        for k, v in self.__dict__.items():
            if v != other.__dict__.get(k, None):
                return False
        return True

    def __repr__(self):
        return str(self)
        return 'Attribute(%s)' % self.name

    def __str__(self):
        if self.required:
            return self.name
        else:
            return self.name + '?'

    def clone(self):
        c = self.__class__(self.name)
        c.__dict__.update(self.__dict__)
        return c

def mergeAttributes(a, b, doc=True):
    """ Attribute, Attribute -> Attribute """
    assert a.name == b.name
    assert a.isevent == b.isevent
    #if a.type == b.type:
    #    return a
    c = a.clone()
    c.type = mergeTypes(a.type, b.type)
    if doc:
        assert not a.doc or not b.doc or a.doc == b.doc, "Can't merge doc: %r and %r" % (a.doc, b.doc)
    c.doc = a.doc or b.doc
    c.required = a.required and b.required
    return c

def mergeAttributeLists(as, bs, doc=True):
    """ [Attribute], [Attribute] -> [Attribute] """
    def find(a, bs):
        for b in bs:
            if a.name == b.name:
                return b
    def copyImplied(a):
        a = a.clone()
        a.required = False
        return a
    cs = []
    # Add attributes that are only in as
    for a in as:
        if not find(a, bs):
            cs.append(copyImplied(a))
    # Add attributes that are only in bs
    for b in bs:
        if not find(b, as):
            cs.append(copyImplied(b))
    # Add attributes in both, giving their type a union
    for a in as:
        b = find(a, bs)
        if b:
            cs.append(mergeAttributes(a, b, doc=doc))
    return cs

def mergeTypes(a, b):
    """ type, type -> type """
    if a == b:
        return a
    if a[0] == Choice and b[0] == Choice:
        return Choice, a[1] + b[1]
    raise "unimplemented: can't merge types %r and %r" % (a, b)

#
# Parsing
#

Choice = 'choice'
Group = 'group'
Interleave = 'interleave'
OneOrMore = 'oneOrMore'
Optional = 'optional'
ZeroOrMore = 'zeroOrMore'

def getElementNames(element):
    assert element.tagName == 'element'
    name = element.getAttribute('name')
    if name:
        return [name]
    choice = childElements(element, Choice)
    if choice:
        return [contentString(child)
                for child in childElements(choice[0], 'name')]
    assert childElements(element, "anyName")
    return []

def collectDefinitions(doc, root):
    defs = {}
    for node in childElements(root, 'define'):
        name = node.getAttribute('name')
        value = node
        if defs.get(name):
            combine = node.getAttribute('combine')
            if combine in (Interleave, Choice):
                g0 = doc.createElement(Group)
                g1 = doc.createElement(Group)
                for c in defs[name].childNodes:
                    g0.appendChild(c.cloneNode(1))
                for c in node.childNodes:
                    g1.appendChild(c.cloneNode(1))
                il = doc.createElement(combine)
                il.appendChild(g0)
                il.appendChild(g1)
                value = doc.createElement('define')
                value.appendChild(il)
            else:
                raise 'unknown combine rule: %r' % str(combine)
        defs[name] = value
    return defs

def parseAttribute(node):
    """xml Element -> Attribute|None"""
    name = node.getAttribute('name')
    # remove "* - (name|extends|id|src)"
    if not name: return
    attr = Attribute(name)
    doc = getChildNS(node, ANN, 'documentation')
    if node.getAttributeNS(LZA, 'visibility') == 'private':
       return
    if doc:
        attr.doc = contentString(doc)
    attr.default = node.getAttributeNS(ANN, 'defaultValue') or None
    attr.modifiers = node.getAttributeNS(LZA, 'modifiers')
    attr.deprecated = node.getAttributeNS(LZA, 'deprecated')
    data = getChild(node, 'data')
    if data:
        lib = data.getAttribute('datatypeLibrary')
        type = data.getAttribute('type')
        attr.xtype = (lib, type)
        if lib == '':
            if type == 'string':
                attr.type = 'CDATA'
            elif type == 'token':
                attr.type = 'NMTOKEN'
        if not lib:
            if type == 'ID':
                attr.type = 'ID'
            elif type == 'boolean':
                attr.type = Choice, ['true', 'false']
    elif getChild(node, 'ref'):
        attr.xtype = (None, getChild(node, 'ref').getAttribute('name'))
    data = getChild(node, 'value')
    if data:
        attr.type = Choice, [contentString(data)]
    choice = getChild(node, Choice)
    if choice:
        alts = [contentString(n) for n in childElements(choice, 'value')]
        attr.type = Choice, alts
    return attr

class Schema:
    def __init__(self, fname):
        self.parse(fname)

    def parse(self, fname):
        try:
            from org.jdom.input import SAXBuilder
            doc = SAXBuilder().build(fname)
            root = convert(doc.rootElement)
            #from org.dom4j.io import SAXContentHandler
            #handler = SAXContentHandler()
            #from org.jdom.output import SAXOutputter
            #SAXOutputter(handler).output(doc)
            #doc = handler.document
            #root = doc.rootElement
        except ImportError:
            from xml.dom.ext.reader import PyExpat
            doc = PyExpat.Reader().fromString(open(fname).read())
            root = doc.documentElement
        start = childElements(root, 'start')[0]
        self.defs = collectDefinitions(doc, root)
        self.elements = []
        for node in recursiveChildElements(root, 'element'):
            for name in getElementNames(node):
                element = Element(name)
                self.elements.append(element)
                element.contentModel = self.getContentModel(node)
                element.attrs = self.getNodeAttrs(node)
                doc = getChildNS(node, ANN, 'documentation')
                if doc:
                    element.doc = contentString(doc)
                if node.getAttributeNS(LZA, 'name'):
                    element.uniqueName = node.getAttributeNS(LZA, 'name')
                if node.getAttributeNS(LZA, 'since'):
                    element.since = node.getAttributeNS(LZA, 'since')

    def getDefinition(self, name):
        return self.defs[name]

    def getElement(self, name):
        elements = [e for e in self.elements if e.name == name]
        if len(elements) != 1:
            if elements:
                raise KeyError('duplicate elements: ' + name)
            else:
                raise KeyError(name)
        return elements[0]

    def getElements(self, name=None):
        if name:
            return [e for e in self.elements if e.name == name]
        return self.elements

    def addElement(self, element):
        self.elements.append(element)

    def _getContentModel(self, node):
        if node.prefix != PREFIX: return
        tagName = node.tagName # was node.localName
        if tagName == 'ref':
            return self.getContentModel(self.getDefinition(node.getAttribute('name')))
        if tagName in ('attribute', 'empty', 'name'):
            return
        if tagName == 'text':
            return TEXT_PSEUDOELEMENT
        if tagName == 'element':
            name = node.getAttribute('name')
            if name:
                return 'element', node.getAttribute('name')
            else:
                return Choice, [('element', name) for name in getElementNames(node)]
        if tagName in (Choice, Interleave, Optional, Group,
                              ZeroOrMore, OneOrMore):
            return tagName, \
                   filter(None, map(self._getContentModel, childElements(node)))
        if tagName == 'mixed':
            return Interleave, [TEXT_PSEUDOELEMENT] + \
                   filter(None, map(self._getContentModel, childElements(node)))
        raise 'unknown tag %s' % str(node.tagName)

    def getContentModel(self, node):
        return Group, filter(None, map(self._getContentModel, childElements(node)))

    def _getAttrs(self, node):
        if node.prefix != PREFIX: return
        tagName = node.tagName # was node.localName
        if tagName == 'ref':
            return self.getNodeAttrs(self.getDefinition(node.getAttribute('name')))
        if tagName in ('element', 'text', 'empty', 'name'):
            return
        if tagName == 'attribute':
            attr = parseAttribute(node)
            return attr and [attr]
        if tagName in (Choice, Interleave, 'mixed'):
            attrs = map(self._getAttrs, childElements(node))
            return reduce0(mergeAttributeLists, [x for x in attrs
                                                 if x is not None])
        if tagName in (Group, OneOrMore):
            return self.getNodeAttrs(node)
        if tagName in (Optional, ZeroOrMore):
            attrs = self.getNodeAttrs(node)
            for attr in attrs:
                attr.required = False
            return attrs
        raise 'unknown tag %s' % str(node.tagName)

    def getNodeAttrs(self, node):
        as = []
        for bs in map(self._getAttrs, childElements(node)):
            if bs:
                as += bs
        return as

#
# Content Model
#

PREFIX = None
TEXT_PSEUDONAME = '#text'
TEXT_PSEUDOELEMENT = ('element', TEXT_PSEUDONAME)

def removeInterleaves(m):
    """ ContentModel -> ContentModel """
    op, args = m
    if op == 'element':
        return m
    args = map(removeInterleaves, args)
    # interleave x -> oneOrMore [choice x] (approximation)
    if op == Interleave:
        return OneOrMore, [(Choice, args)]
    return op, args
    # interleave [a,b] -> ... [not used]
    if op == Interleave:
        for i in range(len(args)):
            for j in range(0, i):
                def ff(args):
                    if args[0] == 'element': return [args[1]]
                    r=[]
                    for a in args[1]: r += ff(a)
                    return r
                as, bs = map(ff, (args[i], args[j]))
                if intersection(as, bs):
                    print intersection(as, bs)

def simplifycm(m):
    """ ContentModel -> ContentModel """
    op, args = m
    # element name -> name
    if op == 'element':
        return m
    args = filter(None, map(simplifycm, args))
    # op [] -> None
    if not args:
        return
    # op [g] -> g, for some ops
    if len(args) == 1:
        if op in (Choice, Group, Interleave):
            return args[0]
    # Roll up:
    # op [..., op xs, ...] -> op [...] + xs + [...]
    if op in (Choice, Group, Interleave):
        accum = []
        for arg in args:
            if type(arg) == type(()) and arg[0] == op:
                accum += arg[1]
            else:
                accum.append(arg)
        args = accum
    # Remove duplicates
    if op == Choice:
        accum = []
        for arg in args:
            if arg not in accum:
                accum.append(arg)
        args = accum
    # optional @(zeroOrMore x) -> @
    elif op in (Optional, ZeroOrMore) and args[0][0] in (ZeroOrMore, OneOrMore):
        return ZeroOrMore, args[0][1]
    elif op == OneOrMore and args[0][0] in (ZeroOrMore, OneOrMore):
        return args[0]
    elif op == OneOrMore and args[0][0] == Optional:
        return ZeroOrMore, args[0][1]
    return op, args

def cm2s(m, needParens=True):
    """ ContentModel -> String """
    if m == TEXT_PSEUDOELEMENT:
        return '#PCDATA'
    op, args = m
    if op == 'element':
        return args
    opchar = {Group: '', Optional: '?', ZeroOrMore: '*', OneOrMore: '+'}.get(op)
    def addParens(inf):
        s = inf.join(map(cm2s, args))
        if needParens:
            if len(args) > 1 or args == [TEXT_PSEUDOELEMENT] \
               or op == OneOrMore:
                s = '(' + s + ')'
        if op == OneOrMore: s = '('+s+')'
        return s
    if opchar is not None:
        return addParens(',') + opchar
    if op == Choice:
        return addParens(' | ')
    if op == Interleave:
        return addParens('&')
    raise 'unknown operator: %r' % op

def cmelements(cm):
    """ ContentModel -> [String] """
    if cm[0] == 'element':
        if cm[1] == TEXT_PSEUDONAME:
            return []
        return [cm[1]]
    r = []
    for x in cm[1]:
        r += cmelements(x)
    return r

def cmIsMixed(cm):
    """ ContentModel -> Bool """
    if not cm:
        return False
    if cm == TEXT_PSEUDOELEMENT:
        return True
    if cm[0] != 'element':
        for arg in cm[1]:
            if cmIsMixed(arg):
                return True
    return False

def cmreplace(cm, src, dst):
    if cm == src:
        return dst
    if cm[0] == 'element':
        return cm
    op, args = cm
    return op, tuple([cmreplace(arg, src, dst) for arg in args])


#
# LZX Parsing
#

class Method:
    pass

def getComment(element):
    """Return the XML comment immediately preceding element."""
    comment = None
    for child in element.parentNode.childNodes:
        if child is element:
            #if comment:
            #    print comment
            return comment
        elif child.nodeType == child.COMMENT_NODE:
            if child.data.startswith('-'):
                #import re
                #comment = re.match(r'-+\s*(.*)\s*-*', child.data).group(0).strip()
                comment = child.data
                while comment.startswith('-'):
                    comment = comment[1:]
                while comment.endswith('-'):
                    comment = comment[:-1]
                comment = comment.strip()
        elif child.nodeType in (child.CDATA_SECTION_NODE, child.TEXT_NODE):
            # Allow whitespace between the comment and the element
            # that it comments.  Non-whitespace text means the comment
            # doesn't apply.
            if child.data.strip():
                comment = None
        else:
            comment = None
    assert 0

def addUserElement(schema, el, parent):
    schema.addElement(el)
    parentName = parent.name
    for e in schema.getElements():
        if parentName in cmelements(e.contentModel):
            e.contentModel = cmreplace(e.contentModel,
                                       ('element', parentName),
                                       (Choice,
                                        [('element', parentName),
                                         ('element', el.name)]))

def parseUserClass(schema, element, libraryName, depth=0):
    global Debug
    name = element.getAttribute('name')
    if Debug: print " " * depth, name
    parentName = element.getAttribute('extends') or 'view'
    if parentName != 'view':
        parents = schema.getElements(parentName)
        if len(parents) > 1:
            localParents = [e for e in parents
                            if getattr(e, 'library', None) == libraryName]
            if localParents:
                parents = localParents
        if not parents:
            print '%s extends undefined class %s' % (name, parentName)
        if len(parents) > 1:
            print '%s extends ambiguous classname %r with classes in libraries ' % (name, str(parentName)) + \
                  ', '.join([getattr(e, 'library', 'schema')
                             for e in schema.getElements(parentName)])
        if len(parents) == 1:
            parent, = parents
        else:
            print 'using view instead'
            parentName = 'view'
    if parentName == 'view':
        # There's two elements named view.  Get the right one.
        # TBD use unique name instead
        parents = [e for e in schema.getElements(parentName)
                   if [a for a in e.attrs if a.name == 'onclick']]
        parent, = parents
    el = parent.clone()
    el.extends = parent
    el.doc = getComment(element) or ''
    #el.doc += 'This tag extends ' + parentName + '. '
    #if parent.doc:
    #    el.doc += parent.doc
    el.name = element.getAttribute('name')
    el.methods = []
    for child in childElements(element):
        if child.tagName == 'attribute':
            attr = Attribute(child.getAttribute('name'))
            attr.doc = getComment(child)
            attr.required = child.getAttribute('required') == 'true'
            if child.getAttribute('setter') == 'null':
                # Future
                if child.getAttribute('getter') == 'null':
                    attr.modifiers = 'final'
                else:
                    attr.modifiers = 'readonly'
            attr.type = 'CDATA'
            attr.xtype = (None, child.getAttribute("type") or "expression")
            default = child.getAttribute("value")
            if default:
                import re
                if re.match(r'^\$\s*\w*\s*{.*}\s*$', default):
                    default = None
                if child.getAttribute("when"):
                    default = None
            if default:
                attr.default = default
            el.attrs.append(attr)
        elif child.tagName == 'event':
            attr = Attribute(child.getAttribute('name'))
            attr.doc = getComment(child)
            attr.required = child.getAttribute('required') == 'true'
            attr.type = 'CDATA'
            attr.xtype = (None, "expression")
            attr.isevent = True
            el.attrs.append(attr)
        elif child.tagName == 'method':
            m = Method()
            m.name = child.getAttribute('name')
            el.methods.append(m)
            m.doc = getComment(child)
            m.params = [p.strip()
                        for p in (child.getAttribute('args') or '').split(',')]
    addUserElement(schema, el, parent)
    return el

class UpdateState:
    pass

def updateSchemaFromComponents(schema):
    state = UpdateState()
    componentsPath = os.path.join(os.getenv('LPS_HOME'),
                                  'lps/components')
    state.componentsPath = componentsPath
    state.files = {}
    name = "./"
    path = os.path.join(componentsPath, name)
    updateSchemaFromFile(state, schema, name, name, path)

def updateSchemaFromFile(state, schema, libraryName, relname, fname, depth = 0):
    global Debug
    # libraryName is the name of the subdirectory of components
    # relname is the filename relative to the components directory
    if os.path.isdir(fname):
        fname = os.path.join(fname, 'library.lzx')
        relname = os.path.join(relname, 'library.lzx')
    key = os.path.normpath(fname)
    if state.files.has_key(key):
        if Debug: print " " * depth, "Skip %s " % relname
        return

    if Debug: print " " * depth, "Enter %s... " % relname
    from xml.dom.ext.reader import PyExpat
    import xml.parsers.expat
    try:
        doc = PyExpat.Reader().fromString(open(fname).read())
    except xml.parsers.expat.ExpatError, e:
        print '%s: %s' % (fname, str(e))
        return
    state.files[key] = 1

    def process(element):
        if element.tagName == 'include' and element.getAttribute('href'):
            href = element.getAttribute('href')
            newrelname = os.path.split(relname)[0] + '/' + href
            newLibraryName = libraryName
            file = os.path.join(os.path.split(fname)[0], href)
            # the directory won't exist if it's relative to components instead of fname
            if not os.path.exists(file):
                newrelname = href
                newLibraryName = href.split('/')[0]
                file = os.path.join(os.getenv('LPS_HOME'),
                                    'lps/components',
                                    href)
            if os.path.exists(file):
                updateSchemaFromFile(state, schema, newLibraryName, newrelname, file, depth + 1)
            else:
                if Debug: print "Not processing %s", file
        if element.tagName in ['canvas', 'library']:
            map(process, childElements(element))
        if element.tagName == 'class':
            el = parseUserClass(schema, element, libraryName, depth + 1)
            el.sourcefile = relname
            el.library = libraryName
    process(doc.documentElement)
    if Debug: print " " * depth, "done\n"


#
# Main
#

def _readSchema(fname):
    schema = Schema(fname)
    updateSchemaFromComponents(schema)
    return schema

SCHEMA_CACHES = {}

def clearCache():
    SCHEMA_CACHES.clear()

def readSchema(fname):
    schema = SCHEMA_CACHES.get(fname)
    if not schema:
        schema = SCHEMA_CACHES[fname] = _readSchema(fname)
    return schema
