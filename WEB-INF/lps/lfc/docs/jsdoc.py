# File: jsdoc.py
# Author: Adam Wolff

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

"""
Description:
When run alone, this package generates the lfc docs. Used as a
library, it can retrieve bits of documentation from the code. Here's an
example:
~...docs> python
>>> import jsdoc
>>> packlist = jsdoc.makePackages()
## Returns array of packages

>>> root = packlist.values()[0].root
## Each package has a pointer to root

>>> lz_textname = tagdict[ "text" ]
>>> print lz_textname
LzText
>>> LzTextObj = root.getMember( lz_textname )
## This is a JSFunction object

>>> print LzTextObj.descriptiveName
LzText
>>> print LzTextObj.getEmbeddedDocumentation( "param" )
{'initialAttributes.fgcolor': ' The hex color for the text.\n', 'initialAttribut
es.label': ' The text to display in this text field.\n', 'initialAttributes.fiel
d': ' The name of the in a result set field to map this text field to\n'}
### Dictionary of params that are specified in the text of a function (and not in the comment header. All of the hash args are (by convention) defined this way. I've tried to be consistent by naming them secondParamName.hashkey but I think that some of them are just hashkey. You may need to do a little processing there.

>>> print LzTextObj.getFields()
{'movieClipRef': 0, 'initialTextWidth': 0, 'sizesDirty': 0, 'text': 0, 'font': 0
, 'colorObj': 0}
## In case you care about this. If they have a definition, the value is set to that string

>>> print LzTextObj.package
<jsdoc.Package instance at 0x0089CF00>
## Every object gets a pointer to the package that contains it (assuming you use makePackages() )

>>> print LzTextObj.package.getItemURL( LzTextObj )
## Packages are in charge of URLS

./views/LzText_class.html
"""


import sys
import re
import shutil
import os
import os.path
import string
from time import localtime, strftime

from jsparse import *

lfcdir = os.getenv("LPS_HOME") + "/WEB-INF/lps/lfc/"
fileExtension = ".html"
tagApiRelationships = []
copyrightInfo = '<br><p class="smaller">&copy; Copyright 2002-2003 <a target="_top" href="http://www.laszlosystems.com/">Laszlo Systems, Inc.</a> All Rights Reserved. Unauthorized use, duplication or distribution is strictly prohibited. This is the proprietary information of Laszlo Systems, Inc. Use is subject to license terms.</p>'

children = {};
parents = {};
packbyname = {};
packs = {};
urls = {};
names = {};
used = {};
services = {};
methods = {};

# Normalize a path to include only forward slashes
#
def normalizePath( p ):
    p = re.sub( r'\\', '/', p )
    return p

def MakeDoc( fpath , args  ):
    global genoptions, fileExtension

    genoptions = args[1:]
    #genoptions are right now:
    #private : show private methods
    #undocumented : show undocumented methods
    #allfields : show all fields of an object or class
    #test : run against only a few packages
    #web : generate files for website
    
    genoptions = [a[1:] for a in genoptions]

    workdir = lfcdir
    docpath ="docs/build/"
    if "web" in genoptions:
        # WEBSITE GLOBAL VARIABLES ARE SET HERE
        docpath = "docs/build_website/"
        # DEBUG change to html for debugging
        fileExtension = ".php"

    HTMLFile.basepath = normalizePath( \
                        os.path.normpath( workdir + docpath ) + '/' )
    
   
    # print lfcdir

    if not os.path.exists( workdir + docpath  ):
        os.mkdir( workdir + docpath  )
    
    mainindex = HTMLFile(  "./" , "splash" + fileExtension )
    mainindex.setHeader( "Laszlo Foundation Classes Documentation" ,
                         "<br>",
                         "Laszlo Foundation Classes")

    mainindex.startTable( "Packages" )

    packlist = makePackages()
    pnames = packlist.keys()

    if "test" in genoptions:
        #pnames = pnames[:4]
        pnames = ["views"]

    pnames.sort()
    lastp = 0
    for ps in pnames:
        pack = packlist[ ps ]
        # if lastp:
            # lastp.indexfile.navnext = 'todo' #pack.indexfile
            # pack.indexfile.navprev =  'todo' #lastp.indexfile

        # pack.indexfile.navup =  'todo' #mainindex
        
        leftCol =  addFormatting( pack.name, 'code' )
        desc =  addFormatting( pack.description, 'regular' )
        mainindex.addTableRow( leftCol, pack.getURL() , desc )
        lastp = pack

    mainindex.endTable()
#    mainindex.writeFile()

    for ps in pnames:
         print "Writing docs for package: " + ps
         pack = packlist[ ps ]
         pack.writePackage( workdir+docpath )
         pack.sortItems()

    writeIndex()

def addRelationship( pack, parent, purl, child="", churl=""):
    if not children.has_key(parent):
        children[parent] = []
    children[parent].append(child)

    if not parents.has_key(child):
        parents[child] = []
    parents[child].append(parent)

    if not packs.has_key(pack):
        packs[pack] = []
    packs[pack].append(parent)

    packbyname[parent] = pack

    names[parent] = 1
    names[child] = 1
    
    urls[parent] = os.path.basename( purl )
    urls[child] = os.path.basename( churl )

def addService(name, url):
    services[name] = url

# AK: This function now creates two of one of these:
#     1) Index files, to be used in a navigation HTML frame
#     2) Objects that contain the index as a property
#
def writeIndex():
    # Class index
    title = 'Class Index'
    filename = HTMLFile.basepath + "classes" + fileExtension
    frame = 'content'
    if 'web' in genoptions:
        f = indexTable( title )
        frame = '_top'
    else:
        f = open( filename, 'w' )
    ks = ["LzNode", "Class", "Service"] # rename class to Helpers
    for i in ks:
        used[i] = 1
        formatting = 'regular'
        txt = i
        if ( urls[i] ):
            txt = makeLink( i, urls[i], frame)
        if 'web' in genoptions:
            formatting = 'lfcIndexTable'
            nm = txt
        else:
            nm = '<b>' + txt + '</b>' 
        f.write( addFormatting( nm + lineEnd(), formatting ) )
        f.write( addFormatting( writeChildren( parents, i ) \
                            + lineEnd(), formatting ) )
    if 'web' in genoptions:
        # f.addStandardLaszloTable()
        global classIndexTable
        classIndexTable = f

    used.clear();
    
    # Alphabetical index
    title = 'Alphabetical Index'
    if 'web' in genoptions:
        f = indexTable( title )
    else: 
        filename = HTMLFile.basepath + 'alpha' + fileExtension
        f=open( filename, 'w' )
    ks = names.keys()
    ks.sort()
    for i in ks:
        if urls[i] != "":
            url = urls[i]
            frame = 'content'
            formatting = 'regular'
            description = i
            if 'web' in genoptions:
                frame = '_top'
                formatting = 'lfcIndexTable'
                description = noIndex( i )
            apiurl = url + '#api'
            s = makeLink(description, apiurl, frame) + lineEnd() 
            if not 'web' in genoptions:
                s = "<b>" + s + "</b>"
            s = addFormatting( s, formatting )
            f.write( s )
            if 'web' in genoptions:
                f.writeShortIndex( s )
            if methods.has_key(i):
                for m in methods[i]:
                    description = m.descriptiveName
                    if 'web' in genoptions:
                        description = noIndex( description )
                    r = whiteSpace() + makeLink(description, url 
                            + "#" + m.descriptiveName, frame) + lineEnd() 
                    r = addFormatting( r, formatting )
                    f.write( r )
    if 'web' in genoptions:
        global alphabeticalIndexTable
        alphabeticalIndexTable = f



#
# Encase in <span> tags
#
def addFormatting( s, style ):
    beginTag = '<span class="' + style + '">'
    endTag = '</span>'
    s = re.sub( '<ul>', endTag + '<ul>', s )
    s = re.sub( '</ul>', '</ul>' + beginTag , s )
    return beginTag + s + endTag
        

#
# For the class nav down the side 
#
def writeChildren(hash, key, spacing=1):
    list = hash[key]
    list.sort()
    out = ""
    for i in list:
        if used.has_key(i):
            continue
        used[i] = 1
        out += whiteSpace(spacing) + makeItem(i)
        if hash.has_key(i):
            out += writeChildren(hash, i, spacing + 1)
    return out


#
# Prevent website search engine from indexing block by encasing in special
# comment tags.
#
def noIndex( s ):
    htDigNoindexStart = '<!-- ignoreThis -->'
    htDigNoindexEnd = '<!-- /ignoreThis -->'
    return htDigNoindexStart + s + htDigNoindexEnd

#
# Make a single entry in the API docs side nav
#
def makeItem(i, pack=0):
    url = urls[i]
    frame = 'content'
    description = i
    if 'web' in genoptions:
        frame = '_top'
        description = noIndex( i )
    url = url + '#api'
    out = makeLink(description, url, frame)

    if pack == 1:
        out += " in package " + packbyname[i]
    out += lineEnd()
    return out


#
# Encase in <a> tags
#
def makeLink( text, link, target="" ):
    out = '<a href="' + link + '"'
    if target != "":
        out += ' target="' + target + '"'
    out += '>' + text + '</a>'
    return out

def lineEnd():
    return "<br />\n"

def whiteSpace(s=1):
    return "&nbsp;" * s * 4


def makePackages( workdir=lfcdir, root=JSRoot() ):
    """Returns the list of packages (according to LPS_HOME/vs/flash if
    no path is given)"""
    packlist = getPackages( workdir , "./"  )
    for pack in packlist.values():
        root = ProcessFile( pack.code , root , pack )
        pack.root = root
        pack.sortItems()
    return packlist


def getPackages ( basepath , currpath ):
    flist = os.listdir( basepath + currpath )
    retlist = {}
    for fs in flist:
        if os.path.isdir( basepath + currpath + fs ):
            if os.path.exists( basepath + currpath + fs +"/package.html" ):
                np = Package( basepath , currpath + fs )
                retlist[ np.name ] = np
                
            morepack = getPackages( basepath , currpath + fs +"/")

            for p in morepack:
                retlist[ p ] = morepack[ p ]
        
    return retlist



class Package:
    def __init__ ( self , basepath , mypath ):
        self.itemDict = {};
        self.basepath= basepath
        self.relpath = mypath
        
        self.name = re.sub( re.escape("/") , "." , mypath )
        self.name  = re.sub( "\/" , "." , self.name )
        self.name  = re.sub( "^\.+" , "" , self.name )
        self.name = self.name.lower()

        self.code = Include( basepath , mypath + "/Library.as" ) 

        tp = open( self.basepath + self.relpath + "/package.html", 'r' )
        self.description = addFormatting( tp.read(), 'regular' )
        tp.close()

        
    def addItem ( self , itemname , item ):
        if itemname not in self.itemDict:
            self.itemDict[ itemname ] = item

    def writePackage( self , docsdir ):
        # indexfile = self.indexfile
        plist = self.relpath.split( "/" )
        addpath = ""
        while plist:
            addpath += plist.pop(0) + "/"

        myfiles = []

        for ts in [ ( "class" , self.classes ) ,("service" , self.services) ]:
            cname , carray = ts
         
            if len( carray ):
                if cname =="class":
                    tabname = "Classes in " + self.name
                else:
                    tabname = "Services"
                # indexfile.startTable( tabname )
                lastfile = 0
                
                for c in carray:
                    if c.protection > 1:
                        print "    Class " + c.name + " not included - either protected or private"
                        continue
                    desc = c.getDescription()
                    if not desc:
                        desc = "<i>Undocumented</i>"
                    cName = addFormatting( c.name , 'code' )
                    desc = addFormatting( desc, 'regular' )
                    # indexfile.addTableRow( cName,
                    #                       c.package.getItemURL(c ,
                    #                                            self.getURL()),
                    #                       desc )
                    
                    cfile = HTMLFile( self.relpath + "/" ,
                              c.descriptiveName + fileExtension )
                    cfile.descriptiveName = c.descriptiveName

                    myfiles.append( cfile )
                    if lastfile:
                        cfile.navprev = lastfile
                        lastfile.navnext = cfile

                    cfile.navup = 'todo' # indexfile
                    lastfile = cfile

                    ReportJSObject( c , cfile , self )
                        
                # indexfile.endTable()

        for files in myfiles:
            # Debug print files.__dict__.keys()
            files.tag = getCorrespondingTagApi( files.descriptiveName )
            files.writeFile()
            
        # indexfile.writeFile()
        

    def sortItems( self ):
        self.classes = []
        self.services = []

        def sortByName( a , b ):
            if a.name > b.name:
                return 1
            else:
                return -1
                        

        for inames in self.itemDict:
            it = self.itemDict[ inames]
            if it.type == "class":
                self.classes.append( it )
            if it.type == "service": 
                self.services.append( it )

        self.classes.sort( sortByName )
        self.services.sort ( sortByName )


    def getURL( self ):
        return self.relpath + "/index" + fileExtension

        
    def getItemURL( self , item , frompath = "."):
        if item in self.classes:
            fname = item.descriptiveName + fileExtension
        else:
            fname = item.descriptiveName + fileExtension

        ppath = ""
        frompath = frompath.split('/')[:-1]

        for d in frompath:
            if d != ".":
                ppath += "../"

        return ppath +  self.relpath + "/" +  fname


class HTMLFile:
    def __init__ ( self , relpath, filename ):
        relpath = './'
        self.filename = filename
        self.URL = relpath + filename
        self.relpath = relpath
        self.blocks = [];
        self.navnext = 0
        self.navprev = 0
        self.navup = 0
        self.tag = ''
        self.descriptiveName = ''

    def setHeader ( self , title , desc , header ):
        self.title = title
        self.desc = desc
        self.header = header

    def addLine ( self , l , blocknum=0 ):
        while len( self.blocks ) <= blocknum:
            self.blocks.insert( len( self.blocks ),  "" )

        self.blocks[ blocknum ] += l + "\n"

    def writeFile ( self ):
        fh = open( HTMLFile.basepath + self.relpath + self.filename , 'w' )
        fh.write( self.writeHeader() )
        if 'web' in genoptions:
            fh.write( self.writeColumnsOneAndTwoStart() )
        if self.tag:
            fh.write( '\nlz_correspondingTag:' + self.tag + '\n' )
        fh.write( self.writeTop() )

        for b in self.blocks:
            fh.write( b )

        if 'web' in genoptions:
            fh.write( self.writeColumnThreeStart() )
            fh.write( '\ncontentGoesHere\n' )
            # classIndexTable.content
            fh.write( self.writeColumnOneTwoAndThreeEnd() )
            
        fh.write( self.writeCloser() )
        fh.close

    def writeHeader( self ):
        if "web" in genoptions:
            r = "<?php ob_start(); ?>\n"
            r += "<?php $thisPage = '/var/www/html/new/developers/"
            r += "documentation/lzxref/index.php'; ?>\n"
            r += "<?php $urlPrefix = '../../../'; ?>\n"
            r += "<?php $mouseTrailLast = '" + self.title + " '; ?>\n"
            r += "<?php require $urlPrefix . 'includes/tree.php'; ?>\n"
            r += "<?php $noLeftMargin = 0; ?>\n"
            r += "<?php require $urlPrefix . 'includes/header.php'; ?>\n"
            r += "<?php \n"
            r += "    if ($devzoneProtected) {\n"
            r += "        // session management\n"
            r += "        require $urlPrefix . "\
                 +"'developers/includes/global.php';\n"
            r += "        require $urlPrefix . "\
                 +"'developers/includes/dev_session.php';\n"
            r += "    }\n"
            r += "    $header = ob_get_contents();\n"
            r += "    ob_end_clean();\n"
            r += "    // write out contents\n"
            r += "    echo($header);\n"
            r += "?>\n"
            # DEBUG: AK Remove this line; this will be included by php
            # r += '<link rel="STYLESHEET" type="text/css" href="../styles.css">'
        else :
            r = "<head>\n"
            r += '<link rel="STYLESHEET" type="text/css" href="./styles.css">'
            r += "</head>\n"
            r += "<body>\n"
        return r

    def writeTagInfo( self ):
        print self.desc
        # r = getCorrespondingTagApi( 
        
    def writeTop(self):
        r = '<a name="api"></a>'
        r += "<h1>" + self.header + "</h1>"
        r += addFormatting( self.desc, 'regular' ) + "<HR>"
        r += "<BR>" 
        return r

    def getRelPath( self , another ):
        ppath = ""
        frompath = self.relpath.split('/')[:-1]

        for d in frompath:
            if d != ".":
                ppath += "../"

        return ppath +  another.URL


    def writeCloser( self ):
        if "web" in genoptions:
            r = "\n<?php include $urlPrefix . 'includes/footer.php'; ?>"
        else:
            r = copyrightInfo 
            r += '</BODY>'
        return r

    def writeColumnsOneAndTwoStart( self ):
        str = '<!-- 3 col table -->'\
            + '<table width="635" border="0" cellspacing="0" cellpadding="0">\n' \
            + '    <tr>\n' \
            + '        <td><img src="<?php echo($urlPrefix); ?>img/spacer.gif" width="201" height="1" alt="" border="0"></td>\n' \
            + '        <td><img src="<?php echo($urlPrefix); ?>img/spacer.gif" width="16" height="1" alt="" border="0"></td>\n' \
            + '        <td><img src="<?php echo($urlPrefix); ?>img/spacer.gif" width="201" height="1" alt="" border="0"></td>\n' \
            + '        <td><img src="<?php echo($urlPrefix); ?>img/spacer.gif" width="16" height="1" alt="" border="0"></td>\n' \
            + '        <td><img src="<?php echo($urlPrefix); ?>img/spacer.gif" width="201" height="1" alt="" border="0"></td>\n' \
            + '    </tr>\n' \
            + '    <tr valign="top">\n' \
            + '        <td colspan="3"><!-- Columns 1 and 2 -->\n' 
        return str


        
    def writeColumnThreeStart( self ):
        str = '</td>\n' \
            + '<!-- <td></td> -->\n' \
            + '<!-- <td></td> -->\n' \
            + '<td>&nbsp;</td>\n' \
            + '<td><!-- column 3 -->\n\n'
        return str

    def writeColumnOneTwoAndThreeEnd( self ) :
        str = '</td>\n' \
            + '    </tr>\n' \
            + '</table>\n'
        return str


    def startTable( self , title , colspan=2 , blocknum=0 , bgc="#5B607C"):

        r = "\n<TABLE BORDER=\"1\" CELLPADDING=\"3\" CELLSPACING=\"0\""
        r += "WIDTH=\"100%\">\n"
        r += "<TR BGCOLOR=\"" + bgc +"\">\n"
        r += "    <TD COLSPAN=" + `colspan` + ">"
        titleStr = addFormatting( title, 'lfcTableTitle' )
        r += titleStr + "</TD>\n</TR>\n"        
        self.addLine( r , blocknum )

    def startAnchoredTable( self , title , colspan=2 , blocknum=0 ,
                            bgc="#5B607C"):
        self.addLine( "\n<A NAME=\"" + title + "\"/>" , blocknum )
        self.startTable(  title , colspan , blocknum , bgc )
        return "#" + title

    def addTableRow( self , c1 , c1href ,  c2 , blocknum=0):
        r = "<TR><TD WIDTH=\"30%\">\n"
        if c1href != "":
            r += "<A HREF=\"" + c1href + "\">" +  c1 + "</A>"
        else:
            r += c1
        r += "</TD>\n"
        r += "<TD><FONT SIZE=\"2\">" + c2 +"</FONT></TD></TR>\n" 
        self.addLine( r , blocknum )

    def endTable(self , blocknum=0):
        self.addLine( "</TABLE><BR>" , blocknum )



#
# The table that is present on every page of the website files
#
class indexTable:
    def __init__( self, title ):
        self.content = ''
        self.contentShort = ''
        self.title = title

    def write( self, s ):
        self.content += s + '\n'

    def writeShortIndex( self, s ):
        self.contentShort += s + "\n"

def ReportJSObject( obj , f , pack ):
    #block mapping
    #0: method table
    #1: fields; [nothing]
    #2: classvars , service vars
    #3: constructor , [nothing]
    #4: methods

    def cleanUndoc( obj ):
        desc = obj.getDescription()
        if not desc:
            desc = "<i>Undocumented</i>"
        return desc

    type = ""
    methodHolder = 0
    extdesc = ""
    purl = obj.package.getItemURL(obj )
    if obj.type == "class":
        type = "Class"
        methodHolder = obj.getMember( "prototype" )
        if obj.getSuperclass():
            sc = obj.getSuperclass()
            addRelationship(pack.name, obj.name, purl, sc.name, sc.package.getItemURL(sc) )
            extdesc = "<b><i>extends </i><A HREF=\"" + \
                    './' + sc.descriptiveName + fileExtension \
                   + "\">"+ sc.name + "</A></b><br>"
        else:
            addRelationship(pack.name, obj.name, purl, "Class")
    else:
        methodHolder = obj
        type= "Service"
        addRelationship(pack.name, obj.name, purl, "Service")
        services[obj.name] = purl

    title = type + " " + obj.name + " in package " + pack.name 
    if 'web' in genoptions:
        title = obj.name
    f.setHeader( title, 
                 extdesc + cleanUndoc( obj ) , 
                 "<b><i>"+type + "</i> " + obj.name +"</b>" )

    #Methods
    def isFunction( amem ):
        #print "isfunc " + `genoptions`
        if amem.type == "function" and \
               ( "undocumented" in genoptions or amem.getDescription() ) and \
               ( "deprecated" in genoptions or not amem.isdeprecated ) and \
               ( "private" in genoptions or amem.protection != 3 ):
            return 1
        else:
            return 0

    def sortFunctions( a , b ):
        if not a.isdeprecated and b.isdeprecated:
            return -1
        elif a.isdeprecated and not b.isdeprecated:
            return 1
        else:
            if a.protection > b.protection:
                return 1
            elif a.protection < b.protection:
                return -1
            else:
                if a.objectlist[-1] > b.objectlist[-1]:
                    return 1
                else:
                    return -1
        
    # add documentation for setters that aren't documented
    #  so they show up in the method table
    setters = methodHolder.getMember("setters")
    if setters:
        setters = setters.members
    else:
        setters = {}
    for m in setters:
        if setters[m].type != 'staticmember': continue
        setterval = setters[m].value
        match = re.match("^\"(.*)\"$", setterval)
        if not match: continue
        if not methodHolder.members.has_key(match.group(1)):
            print "missing function for setter %s = %s" % (setters[m].name,match.group(1))
            continue
        setterfunc = methodHolder.members[match.group(1)]
        if not setterfunc.getDescription():
            attr = m.split('.')[-1]
            setterfunc.setDescription("setter for attribute <I>" + attr + "</I>")
        
    f.startTable( "Method summary" , 2 , 3)
    
    #print methodHolder.name,"members:"
    #for m in methodHolder.members:
    #if m.type != 'function' or m.getDescription(): continue
    #print "   ",methodHolder.members[m].type,methodHolder.members[m].name

    objmethods = methodHolder.getMembers( isFunction )
    objmethods.sort( sortFunctions )

    methods[obj.name] = objmethods;
    firstcol = 1
    
    for elems in objmethods:       
        proto =  "("
        params = elems.getParams()
        paramsOrd = elems.getOrderedParams()
        if params:
            for ps in paramsOrd:
                proto += " " + ps +","

            proto = proto[:-1]

        proto += " )"

        ttitle = elems.descriptiveName
        bgc = "#5B607C"
        if elems.isdeprecated:
            ttitle = "<b>deprecated</b> " + ttitle
            bgc = "#7C5B79"

        if elems.protection == 2:
            ttitle = "<b>protected</b> " + ttitle
            bgc = "#7C5B5B"
            
        if elems.protection == 3:
            ttitle = "<b>private</b> " + ttitle
        
        methodlink = f.startAnchoredTable( elems.descriptiveName, 2 , 4 , bgc )

        
        f.addLine("<TR><TD COLSPAN=\"2\">" , 4)
        s = "<i>" + obj.descriptiveName + "</i>.<b>" \
            + elems.descriptiveName + "</b> " + proto + "\n"
        s = addFormatting( s, 'lfcLargeCode' )
        f.addLine( s, 4 )
        s = addFormatting( '<br><br>' + cleanUndoc(elems), 'regular' ) \
            + "\n</TD></TR>" 
        f.addLine( s, 4)
        if params:
            f.addLine( "<TR><TD COLSPAN=\"2\"/ BGCOLOR=\"#E6E6E6\">" , 4 )
            f.addLine( addFormatting( 'Parameters:', 'lfcTableSubTitle' )
                       + "</TD></TR>", 4 )
            #for ps in paramsOrd:
            for ps in params.keys():
                doc = "<I>undocumented</I>"
                if params.has_key(ps):
                    doc = params[ ps ]
                else:
                    print elems.name + ": undocumented parameter " + ps
                doc = addFormatting( doc, 'regular' )
                ps = addFormatting( ps, 'code' )
                f.addTableRow( ps , "" , doc , 4 )

        if "returnval" in elems.atspecials:
            f.addLine( "<TR><TD COLSPAN=\"2\"/ BGCOLOR=\"#E6E6E6\">" , 4 )
            f.addLine( addFormatting( 'Returns:', 'lfcTableSubTitle' )
                       + "</TD></TR>", 4 )
            rdoc = addFormatting( elems.atspecials[ "returnval" ] , 'regular' )
            rps = addFormatting( "returns", 'code' )
            f.addLine("<TR><TD COLSPAN=\"2\">" + rdoc + "</TD></TR>", 4)
            #f.addTableRow( rps , "", rdoc , 4 )

        
            
        f.endTable( 4 )


        if elems.isdeprecated:
            continue
        
        repdir = cleanUndoc( elems )[:60]
        if len( cleanUndoc( elems ) ) > 60:
            repdir += "..."

        protectStrings = ["" , "" , "<i>protected</i> ", "<i>private</i> " ]
        descriptor = protectStrings[ elems.protection ]

        if firstcol:
            r = "<TR><TD WIDTH=\"50%\">\n"
            str = descriptor + "<A HREF=\"" + methodlink + "\">" \
                    + elems.descriptiveName + proto + "</A>" 
            r += addFormatting( str, 'code' )
            r += "</TD>\n"
        else:
            r = "<TD WIDTH=\"50%\">\n"
            str = descriptor + "<A HREF=\"" + methodlink + "\">" \
                                + elems.descriptiveName + proto + "</A>"
            r += addFormatting( str, 'code' )
            r += "</TD></TR>\n" 

        firstcol = not firstcol

        f.addLine( r , 3 ) 

    if not len (objmethods):
        f.addLine("<TR><TD>" + addFormatting( 'No public methods', 'regular' )
                                                      + "</TD></TR>" ,3 )
    if not firstcol:
        f.addLine("<TD WIDTH=\"50%\">&nbsp;</TD></TR>" ,3 )
    f.endTable( 3 );
    f.addLine( "<hr> <br> " , 3 )

    def lookup_setter(proto, field):
        stxt = 0
        setters = proto.getMember("setters")
        # print "looking for setters in ",proto.name,":"
        #for m in proto.members:
        #    print "  ",m,setters
        if not setters:
            return None

        #for m in setters.members:
        #    print "  ",m
        setter = setters.getMember(field)
        # print "looked up setter",field,setter
        if not setter:
            return None

        if setter.value == -1 or setter.value == "-1":
            return addFormatting( "<I>init only</I>", 'regular' )

        m = re.match("\"(.*)\"", setter.value)
        if m:
            str = "<A HREF=\"#%s\">%s()</A>" % (m.group(1), m.group(1))
            return addFormatting( str, 'code' )
        print "matching quotes in %s failed" % setter.value
        return "%s" % setter.value

    #Fields
    fields = obj.getFields()

    fsort = []
    normalfields = []
    setterfields = []
    events = []
    undocfields = []

    if fields:
        for field in fields.keys():
            if lookup_setter(methodHolder, field):
                #setterfields.append(field)
                continue
            # XXX
            elif field[:2] == 'on':
                events.append(field)
            elif not fields[ field ]:
                undocfields.append(field)
            else:
                normalfields.append(field)

    if methodHolder.getMember("setters"):
        setters = methodHolder.getMember("setters").members.keys()
        if len( setters ):
            fsort = setters
            fsort.sort()
            f.startTable( "Attributes", 2, 1 )
            for field in fsort:
                if field == "setters": continue
                stxt = lookup_setter(methodHolder, field)
                field = addFormatting( field, 'code' )
                r = "<TR><TD WIDTH=\"30%\">" + field + "</TD>\n"
                r += "<TD>"+stxt+"</TD></TR>\n"
                f.addLine( r , 1 )
            f.endTable( 1 )
            f.addLine( "<hr><br>" , 1 )

    if len( events ):
        fsort = events
        fsort.sort()
        f.startTable( "Events", 2, 1 )
        for field in fsort:
            fieldStr = addFormatting( field, 'code' )
            r = "<TR><TD WIDTH=\"30%\">" + fieldStr + "</TD>\n"
            desc = fields[field]
            if not desc:
                print "undocumented event %s.%s" % (methodHolder.name,field)
                desc = "undocumented"
            desc = addFormatting( desc, 'regular' )
            r +="<TD>" + desc + "</TD></TR>\n" 
            f.addLine( r , 1 )
        f.endTable( 1 )
        f.addLine( "<hr><br>" , 1 )

    if len( normalfields ):
        fsort = normalfields
        fsort.sort()
        f.startTable( "Fields" , 2 , 1 )
        for field in fsort:
            if field == "setters": continue
            fieldStr = addFormatting( field, 'code' )
            descStr = addFormatting( fields[field], 'regular' )
            r = "<TR><TD WIDTH=\"30%\">" + fieldStr + "</TD>\n"
            r +="<TD>" + descStr  +"</TD></TR>\n" 
            f.addLine( r , 1 )
        f.endTable( 1 )
        f.addLine( "<hr><br>" , 1 )

    if ("allfields" in genoptions) and len( undocfields ):
        fsort = undocfields
        fsort.sort()
        ncols = 6
        count = 0
        newrow = 1
        f.startTable( "Undocumented Fields" , ncols , 1 )
        for field in fsort:
            if field == "setters": continue
            if newrow:
                f.addLine("<TR>", 1)
                newrow = 0
            f.addLine("<TD>" + field + "</TD>", 1)
            count += 1
            if count == ncols:
                count = 0
                f.addLine("</TR>", 1)
                newrow = 1
            if 0:
                stxt = lookup_setter(methodHolder, field)
                if not stxt:
                    r = "<TR><TD WIDTH=\"30%\">" + field + "</TD>\n"
                else:
                    r = "<TR><TD WIDTH=\"30%\">" + field + "</TD>\n"
                    r += "<TD>"+stxt+"</TD>\n"
                r +="</TR>\n" 
                f.addLine( r , 1 )
        if not newrow:
            f.addLine("</TR>", 1)
        f.endTable( 1 )
        f.addLine( "<hr><br>" , 2 )

    #Static variables
    def isStaticVar( amem ):
        if amem.type == "staticmember" and \
               ( "allfields" in genoptions or amem.getDescription() ):
            return 1
        else:
            return 0
        
    staticvars = methodHolder.getMembers( isStaticVar )


    if staticvars:
        staticvars.sort( sortFunctions )
        if obj.type == "class":
            tablename = "Class properties"
        else:
            tablename = "Service variables"

        f.startTable( tablename , 3 , 6)
        
        for v in staticvars:
            f.addLine ("<TR><TD WIDTH=\"30%\">"
                       + addFormatting( v.descriptiveName, 'code' ) + \
                       "</TD>", 6);
            f.addLine ( "<TD WIDTH=\"20%\">" 
                       + addFormatting( v.value, 'regular' ) + "</TD>" , 6 )
            f.addLine ( "<TD WIDTH=\"50%\">" 
                       + addFormatting( cleanUndoc(v), 'regular' ) + \
                        "</TD></TR>" , 6 )
            
        f.endTable( 6 )
        #f.addLine( "<hr><br>" , 6 )

    #Constructor
    if obj.type == "class" and not obj.hideconstructor:
        f.startAnchoredTable( "Constructor" , 2  , 3 )
        proto =  "("
        params = obj.getParams()
        paramsOrd = obj.getOrderedParams();
        if params:
            for ps in paramsOrd:
                proto += " " + ps +","

            proto = proto[:-1]

        proto += " )"

        f.addLine( "<TR><TD COLSPAN=\"2\">" , 3)
        str = "<i>new </i> " + obj.name + " " + proto
        str = addFormatting( str, 'lfcLargeCode' )
        f.addLine( str, 3)
        
        f.addLine( "<br><br></TD></TR>" , 3)
        
        if params:
            pksort = params.keys()
            pksort.sort()
            f.addLine( "<TR><TD COLSPAN=\"2\"/ BGCOLOR=\"#E6E6E6\">" , 3 )
            f.addLine( addFormatting( 'Parameters:', 'lfcTableSubTitle' )
                       + "</TD></TR>", 3 )
            for ps in pksort:
                doc = "<I>undocumented</I>"
                if params.has_key(ps):
                    doc = params[ ps ]
                doc = addFormatting( doc, 'regular' )
                ps = addFormatting( ps, 'code' )
                f.addTableRow( ps, "", doc, 3 )

        moreparams = obj.getEmbeddedDocumentation( "param" , {} )
        if moreparams:
            pksort = moreparams.keys()
            pksort.sort()
            f.addLine( "<TR><TD COLSPAN=\"2\"/ BGCOLOR=\"#E6E6E6\">" , 3 )
            f.addLine( addFormatting( 'And:', 'lfcTableSubTitle' ) + "</TD>" \
                       + "</TR>", 3 )
            for ps in pksort:
                doc = moreparams[ ps ]
                doc = addFormatting( doc, 'regular' )
                ps = addFormatting( ps, 'code' )
                f.addTableRow( ps , "" , doc, 3 )

        f.endTable( 3)
        f.addLine( "<hr><br>" , 3 )
    return f




#
# Creates alpha and cat indexes that jscombine.py will later read
#
def createIndexFiles():
    filename = HTMLFile.basepath + 'alpha' + fileExtension
    f = open( filename, 'w' )
    f.write( '\n<!-- lz_beginIndex:alphaApi -->\n' )
    f.write( alphabeticalIndexTable.content )
    f.write( '\n<!-- lz_endIndex:alphaApi -->\n' )
    f.write( '\n<!-- lz_beginIndex:alphaApiShort -->\n' )
    f.write( alphabeticalIndexTable.contentShort )
    f.write( '\n<!-- lz_endIndex:alphaApiShort -->\n' )
    f.close()
    
    filename = HTMLFile.basepath + 'classes' + fileExtension
    f = open( filename, 'w' )
    f.write( '\n<!-- lz_beginIndex:classApi -->\n' )
    f.write( classIndexTable.content )
    f.write( '\n<!-- lz_endIndex:classApi -->\n' )
    f.close()



#
# Search for info on how tags relate to lfc classes in LaszloInitiator file
#
def getTagApiRelationships():
    print "Getting Tag relationships"
    f = lfcdir + 'glue/LaszloInitiator.as'
    # Get all the relationships
    flagAddRel = 0
    for line in open( f, 'r' ).readlines():
        if flagAddRel:
            if not re.match( '};', line ):
                addApiRelationship( line )
            else:
                flagAddRel = 0
                break
        if re.match( 'ConstructorMap = .+', line ):
            # Start relationships
            flagAddRel = 1
    # Get all the special relationships from the same file
    flagSpecAddRel = 0
    for line in open( f, 'r' ).readlines():
        if flagSpecAddRel:
            if not re.match( '};', line ):
                addApiRelationship( line )
            else:
                flagSpecAddRel = 0
                break
        if re.match( 'ConstructorMapDocs = .+', line ):
            flagSpecAddRel = 1


            

#
# Adds a single tag/api relationship to the global array
#
def addApiRelationship( line ):
    global tagApiRelationships
    line = re.sub( '[ \t,"\r\n]', '', line )
    tagapi = line.split( ':' )
    if tagapi[1] != '-1':
        tagApiRelationships.append( tagapi )
    

#
# Accepts either 'tag' or 'api' as tagOrApi value to return
#
def getCorrespondingTagApi ( s, tagOrApi='tag' ):
    if tagOrApi == 'tag':
        i = 1
        j = 0
    else :
        i = 0
        j = 1
    for rel in tagApiRelationships:
        if rel[i] == s:
            return rel[j]
    return None

#
# Used by rng2dtd.py to obtain tag/lfc relationships
#
def GetGlue( workdir = lfcdir ):
    gluedir =  "glue/Library.as"
    gluecode = Include( workdir , gluedir )
    consmap = re.search ( "ConstructorMap\s*=\s*{(.*?)}" , gluecode, re.DOTALL)
    pairs =  consmap.groups()[0].split(",")

    dict = {}
    for p in pairs:
        dentry = re.match("\s*(.+)\s*\:\s*\"(.+)\"" , p, re.DOTALL)
        if not dentry:
            continue
        dict[ dentry.groups()[0] ] = dentry.groups()[1]

    return dict


if __name__ == '__main__' :
    getTagApiRelationships()
    genoptions = []
    MakeDoc( lfcdir, sys.argv )
    if 'web' in genoptions:
        createIndexFiles()
