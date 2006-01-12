#File: jsdoc_web.py
#Author: Adam Wolff

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

"""
Description:
When run alone, this package generates the viewsystem docs. Used as a
library, it can retrieve bits of documentation from the code. Here's an
example:
~...docs> python
>>> import jsdoc
>>> packlist = jsdoc.makePackages()
## Returns array of packages

>>> root = packlist.values()[0].root
## Each package has a pointer to root

>>> tagdict = jsdoc.GetGlue()
## Returns a dictionary -- reads glue code

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


AK: This is based on Adam's jsdoc.py file, except that it creates website 
    ready files (with head/foot PHP includes).
"""


import sys
import re
import shutil
import os
import string
from time import localtime, strftime

from jsparse import *


def MakeDoc( fpath , args  ):
    global genoptions

    genoptions = args[1:]
    #genoptions are right now:
    #private : show private methods
    #undocumented : show undocumented methods
    #allfields : show all fields of an object or class
    #test : run against only a few packages
    
    genoptions = [a[1:] for a in genoptions]

    workdir = os.getenv("LPS_HOME") + "/viewsystem/flash/"
    # AK: This bit normalizes the path. On some oses, getenv("LPS_HOME")
    #     might return "c:\Laszlo\dev\lps", and this won't work with the 
    #     forward slashes.
    workdir = os.path.normpath( workdir ) + "/"
    print workdir
    workdir = re.sub( r'\\', '/', workdir )
    print workdir
    # workdir = "c:/Laszlo/dev/lps/viewsystem/flash/"     # AK: DEBUG 
    docpath ="docs/build/"
    HTMLFile.basepath = workdir + docpath

    if not os.path.exists( workdir + docpath  ):
        os.mkdir( workdir + docpath  )
    
    mainindex = HTMLFile(  "./" , "index.php" )
    mainindex.setHeader( "Laszlo Viewsystem Documentation" ,
                         "<br>",
                         "Laszlo Viewsystem")

    mainindex.startTable( "Packages" )

    packlist = makePackages()
    pnames = packlist.keys()

    if "test" in genoptions:
        pnames = pnames[:4]

    pnames.sort()
    lastp = 0
    for ps in pnames:
        pack = packlist[ ps ]
        if lastp:
            lastp.indexfile.navnext =  pack.indexfile
            pack.indexfile.navprev =  lastp.indexfile

        pack.indexfile.navup =  mainindex
        
        mainindex.addTableRow( pack.name , pack.getURL() ,
                               pack.description )
        lastp = pack

    mainindex.endTable()
    mainindex.writeFile()

    for ps in pnames:
         print "Writing docs for package: " + ps
         pack = packlist[ ps ]
         pack.writePackage( workdir+docpath )
         pack.sortItems()

def makePackages( workdir=os.getenv("LPS_HOME") + "/viewsystem/flash/",
                  root=JSRoot() ):
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



def GetGlue( workdir = os.getenv("LPS_HOME") + "/viewsystem/flash/" ):
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
        self.description = "<p>" + tp.read() + "</p>"
        tp.close()

        self.indexfile = HTMLFile( self.relpath +"/" , "index.php" )
        self.indexfile.setHeader( "Package " + self.name  + \
                             " in Laszlo View System" , self.description , \
                             "Package <b>" + self.name +"</b>" )
        
    def addItem ( self , itemname , item ):
        self.itemDict[ itemname ] = item

    def writePackage( self , docsdir ):
        indexfile = self.indexfile
        plist = self.relpath.split( "/" )
        addpath = ""
        while plist:
            addpath += plist.pop(0) + "/"
            if not os.path.exists( docsdir + addpath ):
                os.mkdir( docsdir + addpath  )

        myfiles = []

        for ts in [ ( "class" , self.classes ) ,("service" , self.services) ]:
            cname , carray = ts
         
            if len( carray ):
                if cname =="class":
                    tabname = "Classes in " + self.name
                else:
                    tabname = "Services"
                indexfile.startTable( tabname )
                lastfile = 0
                
                for c in carray:
                    desc = c.getDescription()
                    if not desc:
                        desc = "<i>Undocumented</i>"
                    indexfile.addTableRow( c.name ,
                                           c.package.getItemURL(c ,
                                                                self.getURL()),
                                           desc )
                    
                    cfile = HTMLFile( self.relpath + "/" ,
                                      c.descriptiveName + "_"+cname+".php")

                    myfiles.append( cfile )
                    if lastfile:
                        cfile.navprev = lastfile
                        lastfile.navnext = cfile

                    cfile.navup = indexfile
                    lastfile = cfile

                    ReportJSObject( c , cfile , self )
                        
                indexfile.endTable()

        for files in myfiles:
            files.writeFile()
            
        indexfile.writeFile()
        

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
        return self.relpath + "/index.php"

        
    def getItemURL( self , item , frompath = "."):
        if item in self.classes:
            fname = item.descriptiveName + "_class.php"
        else:
            fname = item.descriptiveName + "_service.php"

        ppath = ""
        frompath = frompath.split('/')[:-1]

        for d in frompath:
            if d != ".":
                ppath += "../"

        return ppath +  self.relpath + "/" +  fname

class HTMLFile:
    def __init__ ( self , relpath, filename ):
        self.filename = filename
        self.URL = relpath + filename
        self.relpath = relpath
        self.blocks = [];
        self.navnext = 0
        self.navprev = 0
        self.navup = 0

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
        fh.write( self.writeNavBar() )
        fh.write( self.writeTop() )

        for b in self.blocks:

            fh.write( b )

        fh.write( self.writeCloser() )
        fh.close

    def getUrlPrefix ( self ):
        directories = self.relpath.split('/')[:-1]
        noOfDirs = len(directories) - 1
        urlPrefix = "../../../"
        for directory in range(0,noOfDirs):
            urlPrefix += "../"
        
        return urlPrefix
    
    # Shorten the title so that it fits inside the mousetrail
    def shortenTitle ( self ):
        fullTitle = self.title
    	shortTitle = fullTitle.replace("Package ",  "")
    	shortTitle = shortTitle.replace("Class ",  "")
    	shortTitle = shortTitle.replace(" in Laszlo View System",  "")
	shortTitle = re.sub ( "Service +", "", shortTitle )
	shortTitle = re.sub ( " in package .*", "", shortTitle )

        return shortTitle

    # Remove the "index.php" from links for elegance
    def removeDefaultDocument ( self, oldFileName ):
        fileName = oldFileName.replace("index.php", "")        
        return fileName    	


    def writeHeader( self ):
        urlPrefix = self.getUrlPrefix()
        shortTitle = self.shortenTitle()
        
        r = "<?php ob_start(); ?>\n"
        r += "<?php $thisPage = '/var/www/html/new/developers/documentation/viewapi/index.php'; ?>\n"
        r += "<?php $urlPrefix = '" + urlPrefix + "'; ?>\n"
        # Add a title for everything except the homepage
        if self.relpath != './':
            r += "<?php $mouseTrailLast = '" + shortTitle + "'; ?>"
        r += "<?php require '" + urlPrefix + "includes/tree.php'; ?>\n"
        r += "<?php $noLeftMargin = 0; ?>\n"
        r += "<?php require '" + urlPrefix + "includes/header.php'; ?>\n"
        r += "<?php \n"
        r += "	if ($devzoneProtected) {\n"
        r += "		// session management\n"
        r += "		require $urlPrefix . 'developers/includes/global.php';\n"
        r += "		require $urlPrefix . 'developers/includes/dev_session.php';\n"
        r += "	}\n"
        r += "	$header = ob_get_contents();\n"
        r += "	ob_end_clean();\n"
        r += "	// write out contents\n"
        r += "	echo($header);\n"
        r += "?>\n"

        # AK: Debug
        # r += "The relative path is " + self.relpath + "<br>"
        # r += "The number of directories is: " + `urlPrefix` + "<hr>"
        # r += self.title + "\n"

        return r

    def writeTop(self):
        r = "<h1>" + self.header + "</h1>"
        r += "<p>" + self.desc +"</p>"
        return r

    def writeNavBar( self ):
        if not ( self.navprev or self.navup or self.navnext ):
            return ""
        r = "<TABLE  WIDTH=\"100%\">\n"
        r += "<TR COLSPAN=\"3\">\n"
        r +="<TD WIDTH=\"33%\" VALIGN=\"TOP\">"
        if self.navprev:
            r += "<span class=\"prevNextNav\">Prev:</span><br>"
            r += "<span class=\"regular\">"
            r += "<A HREF=\"" + self.removeDefaultDocument( self.getRelPath(self.navprev) ) + "\">"
            r += self.navprev.header
            r += "</A></span>"
        r += "</TD><TD  WIDTH=\"33%\" VALIGN=\"TOP\" ALIGN=\"CENTER\">"

        if self.navup:
            r += "<span class=\"prevNextNav\">Up:</span><br>"
            r += "<span class=\"regular\">"
            r += "<A HREF=\"" + self.removeDefaultDocument( self.getRelPath(self.navup) ) + "\">"
            r += self.navup.header
            r += "</A></span>"


        r += "</TD><TD  WIDTH=\"33%\" VALIGN=\"TOP\"  ALIGN=\"RIGHT\">"

        if self.navnext:
            r += "<span class=\"prevNextNav\">Next:</span><br>"
            r += "<span class=\"regular\">"
            r += "<A HREF=\"" + self.removeDefaultDocument( self.getRelPath(self.navnext) ) + "\">"
            r += self.navnext.header
            r += "</A></span>"

        r += "</TD></TR></TABLE>"
        
        return r

    def getRelPath( self , another ):
        ppath = ""
        frompath = self.relpath.split('/')[:-1]

        for d in frompath:
            if d != ".":
                ppath += "../"

        return ppath +  another.URL


    def writeCloser( self ):
        return "<?php include $urlPrefix . 'includes/footer.php'; ?>\n"

    def startTable( self , title , colspan=2 , blocknum=0 , bgc="#CCCCFF"):

        r = "\n<TABLE BORDER=\"1\" CELLPADDING=\"3\" CELLSPACING=\"0\""
        r += "WIDTH=\"100%\">\n"
        r += "<TR BGCOLOR=\"" + bgc +"\">\n"
        r += "<TD COLSPAN=" + `colspan` + "><span class=\"docTableTitle\">"
        r += title + "</span></TD></TR>\n"        
        self.addLine( r , blocknum )

    def startAnchoredTable( self , title , colspan=2 , blocknum=0 ,
                            bgc="#CCCCFF"):
        self.addLine( "\n<A NAME=\"" + title + "\"/>" , blocknum )
        self.startTable(  title , colspan , blocknum , bgc )
        return "#" + title

    def addTableRow( self , c1 , c1href ,  c2 , blocknum=0):
        r = "<TR><TD WIDTH=\"30%\">\n"
        r += "<span class=\"code\">\n"
        if c1href != "":
            r += "<A HREF=\"" + self.removeDefaultDocument( c1href ) + "\">" +  c1 + "</A>"
        else:
            r += c1
        r += "</span></TD>\n"
        r += "<TD><span class=\"regular\">" + c2 +"</span></TD></TR>\n" 
        self.addLine( r , blocknum )

    def endTable(self , blocknum=0):
        self.addLine( "</TABLE><BR>" , blocknum )



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
    if obj.type == "class":
        type = "Class"
        methodHolder = obj.getMember( "prototype" )
        if obj.getSuperclass():
            sc = obj.getSuperclass()
            extdesc = "<span class=\"regular\"><b><i>extends </i><A HREF=\"" + \
                    sc.package.getItemURL( sc , pack.getURL() ) \
                   + "\">"+ sc.name + "</A></b><br></span>"
    else:
        methodHolder = obj
        type= "Service"

    f.setHeader( type + " " + obj.name + " in package " + pack.name ,

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
        
    f.startTable( "Method summary" )
    
    objmethods = methodHolder.getMembers( isFunction )
    objmethods.sort( sortFunctions )
    
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
        if elems.isdeprecated:
            ttitle = "</b>deprecated<b> " + ttitle

        if elems.protection == 2:
            ttitle = "</b<protected<b> " + ttitle
            
        if elems.protection == 3:
            ttitle = "</b>private<b> " + ttitle
        
        if elems.isdeprecated:
            bgc = "#CCCCCC"
        else:
            bgc = "#CCCCFF"

        methodlink = f.startAnchoredTable( ttitle, 2 , 4 , bgc )

        
        f.addLine("<TR><TD COLSPAN=\"2\"><span class=\"regular\">" , 4)
        f.addLine( "<i>"+obj.descriptiveName+"</i>.<b>" +
                   elems.descriptiveName+"</b> " + proto , 4)
            
        f.addLine( "<br>" + cleanUndoc(elems) + "\n</span></TD></TR>" , 4)
        if params:
            f.addLine( "<TR><TD COLSPAN=\"2\"/ BGCOLOR=\"#DDFFFF\"><span class=\"regular\">" , 4 )
            f.addLine( "<b>Where:</b> </span></TD></TR>", 4 )
            for ps in params.keys():
                f.addTableRow( ps , "" , params[ ps ] , 4 )
            
        f.endTable( 4 )


        if elems.isdeprecated:
            continue
        
        repdir = cleanUndoc( elems )[:60]
        if len( cleanUndoc( elems ) ) > 60:
            repdir += "..."

        protectStrings = ["" , "" , "<i>protected</i> ", "<i>private</i> " ]
        descriptor = protectStrings[ elems.protection ]

        r = "<TR><TD WIDTH=\"50%\">\n"
        r += "<span class=\"regular\">"
        r += descriptor
        r += "<A HREF=\"" + methodlink + "\">"
        r +=  elems.descriptiveName + proto + "</A></span>"
        r += "</TD>\n"
        r += "<TD><span class=\"regular\">" + repdir
        r += "</span></TD></TR>\n" 

        f.addLine( r ) 

    if not len (objmethods):
        f.addLine("<TR><TD><span class=\"regular\">No public methods</span></TD></TR>" )
    f.endTable();
    f.addLine( "<hr> <br> " )

    #Fields
    fields = obj.getFields()

    fsort = []   
    if fields:
        fsort = fields.keys()
        for field in fsort[:]:
            if not fields[ field ]:
                if "allfields" not in genoptions:
                    fsort.remove( field )
                else:
                    fields[ field ] =  "<i>Undocumented</i>"
    
    if len( fsort ):
        fsort.sort()
        f.startTable( "Fields" , 2 , 1 )
        for field in fsort:
            f.addTableRow( field , "" , fields[ field ]  , 1)

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

        f.startTable( tablename , 3 , 2)
        
        for v in staticvars:
            f.addLine ("<TR><TD WIDTH=\"30%\"><span class=\"code\">"+ v.descriptiveName + \
                       "</span></TD>", 2);
            f.addLine ( "<TD WIDTH=\"20%\"><span class=\"regular\">" + v.value + "</span></TD>" , 2 )
            f.addLine ( "<TD WIDTH=\"50%\"><span class=\"regular\">" + cleanUndoc(v) + \
                        "</span></TD></TR>" , 2 )
            
        f.endTable( 2 )
        f.addLine( "<hr><br>" , 2 )

    #Constructor
    if obj.type == "class":
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
        f.addLine( "<i>new </i> " + obj.name + " " + proto , 3)
        
        f.addLine( "<br><br></TD></TR>" , 3)
        
        if params:
            pksort = params.keys()
            pksort.sort()
            f.addLine( "<TR><TD COLSPAN=\"2\"/ BGCOLOR=\"#CCFFFF\"><span class=\"regular\">" , 3 )
            f.addLine( "<b>Where:</b> <span></TD></TR>", 3 )
            for ps in pksort:
                f.addTableRow( ps , "" , params[ ps ] , 3 )

        moreparams = obj.getEmbeddedDocumentation( "param" , {} )
        if moreparams:
            pksort = moreparams.keys()
            pksort.sort()
            f.addLine( "<TR><TD COLSPAN=\"2\"/ BGCOLOR=\"#CCFFFF\"><span class=\"regular\">" , 3 )
            f.addLine( "<b>And:</b> </span></TD></TR>", 3 )
            for ps in pksort:
                f.addTableRow( ps , "" , moreparams[  ps ] , 3 )

        
        f.endTable( 3)
        f.addLine( "<hr><br>" , 3 )
        


    return f


if __name__ == '__main__' : MakeDoc( os.getenv("LPS_HOME") + \
                                     "/viewsystem/flash/" , sys.argv )

    		

	
