# File: rng2xml.py
# Author: Oliver Steele
# Author: P. Tucker Withington
# Author: Antun Karlovac

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

import os, sys
LPS_HOME = os.getenv('LPS_HOME')
sys.path.append(os.path.join(LPS_HOME, 'WEB-INF/lps/server/sc'))
import xmldocutils
from xmldocutils import *

# FIXME: [2003-05-08 ptw] Need a way to get the right number
SINCE = 1.1

# FIXME: [2003-05-08 ptw] Migrate these to the sources.
#  ['debugwindow.lineheight',
#   'tabelement.close',
#   'tabelement.closed',
#   'tabelement.contentvisible']

#
# Content model
#

Status = 0

class Element(Serializable):
    Name = 'tag'
    AttrAttrs = ['name', 'extends', 'library', 'sourcefile', 'keywords']
    ContentAttrs = ['desc', 'attributes', 'methods', 'events']

class Method(Serializable):
    AttrAttrs = ['name', 'keywords']
    ContentAttrs = ['desc', 'parameters', 'return']

class Return(Serializable):
    AttrAttrs = ['name', 'type']
    ContentAttrs = ['desc']


#
# Document formatting
#

def xstr(attr):
    t = attr.type
    if attr.xtype:
        if attr.xtype[1] == 'anyURI':
            return 'URL'
        return attr.xtype[1]
    if type(t) == type(()) and t[0] == 'choice':
        s = ' | '.join(['%s' % s for s in t[1]])
        s = addFormatting(s, 'code')
        return s
    return str(attr.type)

def nextgroup(str, pos, open, close, mid=None):
    import re
    open = re.compile(open)
    close = re.compile(close)
    if mid: mid = re.compile(mid)
    firstopen = open.search(str, pos)
    if not firstopen:
        return None
    nesting = 1
    firstopen = open.search(str)
    pos = firstopen.end()
    while nesting:
        nextopen = open.search(str, pos)
        nextclose = close.search(str, pos)
        nextmid = mid and mid.search(str, pos)
        #print 'match:'
        #for name, m in [('open', nextopen), ('close', nextclose),
        #                ('mid', nextmid)]:
        #    if m:
        #        print name, m.span(), str[m.start():m.end()]
        if nextmid \
           and (not nextopen or nextmid.start() <= nextopen.start()) \
           and (not nextclose or nextmid.start() <= nextclose.start()):
            pos = nextmid.end()
            #print 'mid', pos
        elif nextopen and (not nextclose or nextopen.start() < nextclose.start()):
            nesting += 1
            pos = nextopen.end()
            #print 'open', pos
        elif nextclose:
            nesting -= 1
            pos = nextclose.end()
            #print 'close', pos
        else:
            return None
    p0, p1, p2, p3 = firstopen.span() + nextclose.span()
    return str[:p0], str[p0:p1], str[p1:p2], str[p2:p3], str[p3:]

# TODO: [2003-05-23 ptw] Remove deprecated kludge, implement correctly
def formatDoc(str, deprecated):
    import re
    traceme = str and str.find('When the initial value') >= 0
    traceme = False
    if traceme: print str, deprecated
    if str:
        accum = []
        while True:
            match = nextgroup(str, 0, r'&lt;.*?&gt;', r'&lt;/.*?&gt;',
                              r'&lt;\S+.*?/&gt;')
            if not match: break
            pre, start, middle, end, str = match
            middle = start+middle+end
            accum += [pre, '<span class="code">', middle, '</span>']
        str = ''.join(accum) + str
        accum = []
        while True:
            match = re.search(r'@(\w*){', str)
            if not match: break
            tag = match.group(1)
            starttag = {'e': '<tagname>',
                   'a': '<attribute>',
                   'c': '<code>'}.get(tag)
            if not starttag:
                raise 'uknown tag' % tag
                startag = tag
            endtag = '</' + starttag[1:-1] + '>'
            match = nextgroup(str, 0, r'@(\w*){', r'}')
            if not match: break
            pre, _, middle, _, str = match
            # Quote xml in these tags as it may be only a fragment (and hence malformed)
            accum += [pre, starttag,
                      middle.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'),
                      endtag]
        str = ''.join(accum) + str
        if not str.startswith('<p') and not str.endswith('</p>'):
            str = '<p>%s</p>' % str
        while True:
            pos = str.find('\n\n')
            if pos < 0: break
            str = str[:pos] + '\n</p>\n<p>' + str[pos+2:]
            # Prevent downstream XML processing from parsing
            # entities we intend to be literals
    elif deprecated:
        str = ""
    if deprecated:
        str = str + '\n<p class="deprecated">' + re.sub('@', 'Deprecated ', deprecated) + '</p>'
    if traceme: print str
    return str

def addFormatting(s, style):
    return s

#
# Element creation
#

def computeCategory(mods):
    if mods:
        mods = mods.split()
        if 'final' in mods:
            return 'final'
        elif 'readonly' in mods:
            return 'readonly'

def makeAttribute(a, parseComments):
    ctext = a.doc
    # category from modifiers
    category=computeCategory(getattr(a, 'modifiers', None))
    if parseComments:
        c = parseComment(a.doc, ['keywords'])
        if 'private' in c.keywords: return
        # Keywords are allowed to override category
        if 'final' in c.keywords:
            category = 'final'
        elif 'readonly' in c.keywords:
            category = 'readonly'
        elif 'defaultsetter' in c.keywords:
            category = 'defaultsetter'
        ctext = c.comment
    return Attribute(name=a.name,
                    type=xstr(a),
                    default=a.default,
                    desc=formatDoc(ctext, getattr(a, 'deprecated', None)),
                    category=category)

def makeEvent(a, parseComments):
    ctext = a.doc
    if parseComments:
        c = parseComment(a.doc, ['keywords'])
        if 'private' in c.keywords: return
        ctext = c.comment
    return Event(name=a.name,
                 desc=formatDoc(ctext, getattr(a, 'deprecated', None)))

def makeMethod(m):
    if not m.name: return
    params = [Param(name=name) for name in m.params if name]
    c = parseComment(m.doc, ['keywords', 'param', 'return'])
    if 'private' in c.keywords: return
    for k, v in c.params.items():
        candidates = [p for p in params if p.name == k]
        if len(candidates) != 1 \
               and '.' not in k: # TBD: remove this line
            raise xmldocutils.InputError('comment for nonexistent parameter %r of %r' % (str(k), str(name)))
        candidates[0].desc = v
        candidates[0].type = c.paramTypes.get(k)
    method = Method(name=m.name, parameters=params, desc=c.comment)
    if hasattr(c, 'return'):
        rd = getattr(c, 'return')
        if rd.startswith(':'): rd = rd[1:]
        type = None
        if ':' in rd:
            type, rd = rd.split(':', 1)
            type = type.strip()
            rd = rd.strip()
        setattr(method, 'return', Return(desc=rd, type=type))
    return method

class AttributeMap:
    pass

# Inheritance in schema is expressed by inclusion.  We use this map to
# detect it.
attributemap = AttributeMap()

def makeElement(e):
    #if getattr(e, 'since', None):
    #    # TODO [2003-05-23 ptw] implement since
    #    pass
    extends = None
    inhAttrs = []
    # We determine inheritance by comparing attributes
    # FIXME: [2003-05-28 ptw] This is not completely correct -- it
    # doesn't detect other inheritance patterns.  Ideally we need to
    # express inheritance in the schema so we can do this directly
    def hasEvery(as, bs):
        for b in bs:
            if b not in as:
                return 0
        return 1
    if hasattr(e, 'extends'):
        # from LZX
        extends = e.extends.name
        inhAttrs = getattr(attributemap, extends)
    else:
        n = e.name
        eas = [a.name for a in e.attrs]
        # Note these are carefully kludged to make node and view
        # be found as parents from a smaller set of attributes
        for mn, mas in (('node', attributemap.objectAttributes),
                        ('datapointer', attributemap.datapointer),
                        ('view', attributemap.viewAttributes)):
            if mn != n and len(mas) > len(inhAttrs):
                if hasEvery(eas, mas):
                    inhAttrs = mas
                    extends = mn
                else:
#                     print n + ' does not inherit from ' + mn + \
#                           ' because it is missing %s' % \
#                           [a for a in mas if a not in eas]
                    break
    # Filter out attributes from superclasses
    as = filter(None, [makeAttribute(a, e.library) for a in e.attrs
                       if (a.name not in inhAttrs) and (a.isevent == False)])
    if hasattr(attributemap, e.name):
        # don't clobber pre-filled entries
        pass
    else:
        setattr(attributemap, e.name, [a.name for a in as] + inhAttrs)
    methods = filter(None, map(makeMethod, getattr(e, 'methods', [])))
    events = filter(None, [makeEvent(a, e.library) for a in e.attrs
                           if (a.name not in inhAttrs) and (a.isevent == True)])
    keywords = None
    if hasattr(e, 'sourcefile'):
        c = parseComment(e.doc, ['keywords', 'param', 'event', 'since'])
        doc = c.comment
        events = events + c.getFields('event')
        if 'private' in c.keywords: return
    else:
        doc = formatDoc(e.doc, getattr(e, 'lza:deprecated', None))
    def filtersince(xs):
        # TODO: [2003-05-08 ptw] implement since filtering
        return xs # and [x for x in xs if e.name + '.' + x.name not in SINCE]
    return Element(name=e.name,
                   extends=extends,
                   sourcefile=getattr(e, 'sourcefile', None),
                   library=getattr(e, 'library', None),
                   desc=doc,
                   attributes=filtersince(as),
                   methods=filtersince(methods),
                   events=filtersince(events),
                   )

def printWarnings(e, v):
    global Status
    ignorenames = []
    if getattr(e, 'uniqueName', e.name) != u'view':
        ignorenames = [a.name for a in v.attrs]
    if hasattr(e, 'extends'):
        ignorenames += [a.name for a in e.extends.attrs]
    if not e.doc:
        print '%s: missing element documentation' % e.name
        Status = 1
    for a in e.attrs:
        if not a.doc and a.name not in ignorenames:
            print '%s.%s: missing attribute documentation' % (e.name, a.name)
            Status = 1

def process():
    import os
    try: os.makedirs('tagdocs')
    except: pass
    from rngparse import readSchema
    global Status
    schema = readSchema('lzxdoc.rng')
    # prefill attribute map
    # For LZX, which _does_ inherit from view
    # v = the first element whose uniqueName or name is 'view' and that has
    # an 'onclick' attribute
    v = [e_ for e_ in schema.elements
         if getattr(e_, 'uniqueName', e_.name) == u'view' and [a for a in e_.attrs if a.name == 'onclick']][0]
    setattr(attributemap, v.name, [a.name for a in v.attrs])
    # For schema, which only "inherits" viewAttributes
    va = schema.getDefinition('viewAttributes')
    setattr(attributemap, 'viewAttributes',
            [a.name for a in schema.getNodeAttrs(va)])
    # ditto for node/objectAttributes
    # LZX
    # n = the first element whose uniqueName or name is 'node'
    n = [e_ for e_ in schema.elements
         if getattr(e_, 'uniqueName', e_.name) == u'node'][0]
    setattr(attributemap, n.name, [a.name for a in n.attrs])
    # Schema
    na = schema.getDefinition('objectAttributes')
    setattr(attributemap, 'objectAttributes',
            [a.name for a in schema.getNodeAttrs(na)])
    dp = schema.getDefinition('datapointer')
    setattr(attributemap, 'datapointer',
            [a.name for a in schema.getNodeAttrs(dp)])
    for e in schema.elements:
        #printWarnings(e, v)
        try:
            k = makeElement(e)
        except xmldocutils.InputError, e2:
            print '%s: %s' % (e.sourcefile, str(e2))
            Status = 1
            continue
        if not k:
            continue
        fname = getattr(e, 'uniqueName', e.name).replace(' ', '-').lower()
        if hasattr(e, 'sourcefile'):
            #print '', e.sourcefile
            fname = os.path.join(os.path.split(e.sourcefile)[0], fname)
        else:
            fname = 'tag-' + fname
        fname = os.path.normpath(os.path.join('tagdocs', fname + '.xml'))
        dir = os.path.split(fname)[0]
        if not os.path.isdir(dir):
            os.makedirs(dir)
        f = open(fname, 'w')
        try:
            k.toxml(Writer(f))
        finally:
            f.close()
        from xml.dom.ext.reader import PyExpat
        f = open(fname)
        import xml.parsers.expat
        import xml
        try:
            try:
                xml.parsers.expat.ParserCreate().Parse(f.read())
            except xml.parsers.expat.ExpatError, e:
                print '%s: %s' % (fname, str(e))
                Status = 1
        finally:
            f.close()
    return Status

def main():
    status = process()
    import sys
    sys.exit(status)

def test():
    process()

if __name__ == '__main__':
    main()
