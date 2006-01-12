# File: jsdoc.py
# Author: Adam Wolff
# Description:
# This package is meant to be used as a library for parsing ActionScript
# blocks. See jsdoc.py for usage examples.

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

import re
import string

def Include( basedir ,  fname):
    w = ""
    i = open( basedir + fname  , 'r' )
    includer = re.compile("\#include.*\"(.*)\"")
    
    for lin in i:
        m = includer.search( lin )
        if m:
            incfile = string.replace(m.groups()[0], "\\", "/")
            w += Include( basedir , incfile  )

        else:
            w = w + lin
    
    return w


def ProcessFile( w , root=0 , package=0 ):
    # find all sub,super tuples

    if not root:
        root = JSRoot()
        
    extender = re.compile("Object.class.extends.*?\((.*?)\,(.*?)\)")
    classlinks = []

    ex = extender.search( w )
    while ex:
        classlinks.append ( (ex.groups()[0].strip() ,
                             ex.groups()[1].strip() ) )
        
        ex = extender.search( w , ex.end() )

    extender2 = re.compile("Class.*?\(\s*\"(.*?)\"\s*\,\s*(.*?)\W" )
    ex = extender2.search( w )
    while ex:
        #this is a bit of a hack , but assume that the constructor here is
        #the default constructor
        to = JSFunction( ex.groups()[0] , "(vsnode)" , "" )
        to.setPackage( package )
        to.addPreamble(  w[:ex.start()] )
        
        root.insert( to )

        #print ex.groups()[ 0 ] + " extends " + ex.groups()[1]
        if not re.match( "null" , ex.groups()[1] ):
            classlinks.append ( (ex.groups()[1].strip() ,
                                 ex.groups()[0].strip() ) )

        ex = extender2.search( w , ex.end() )
    
    functionForm = re.compile("\n\s*function\s+(\w.*?)\s*(\(.*?)\s*\{", \
                              re.DOTALL )
    equalsForm = re.compile("\s+?(\w\S*?)\s*\=\s*function\s*(\(.*?)\s*\{", \
                            re.DOTALL )
    
    newer = re.compile("(.*?)\=\s*new\s+(.*)")

    def findBraces ( w ):
        curre=string.find(w , '}');
        while w.count('{' , 0 , curre )  > w.count('}' ,0 ,curre+1 ):
            curre = string.find(w , '}' , curre +1)
            if curre == -1:
                raise "Couldn't find end " + w;
        

        return curre+1

    while w:
        form = None
        r = 0
        to = None
        for f in [equalsForm, functionForm, newer]:
            match = f.search(w)
            if not match: continue
            if not r or match.start() < r.start():
                r = match
                form = f

        if form == equalsForm:
            bracepos = r.start(2)
            nextmark = bracepos + findBraces(w[bracepos:])
            thefunc = w[bracepos:nextmark]
            to = JSFunction( r.groups()[0] , r.groups()[1] , thefunc )
            # print "found = function %s" % r.groups()[0]

        elif form == functionForm:
            bracepos = r.start(2)
            nextmark = bracepos + findBraces(w[bracepos:])
            thefunc = w[bracepos:nextmark]
            to = JSFunction( r.groups()[0] , r.groups()[1] , thefunc )
            # print "found function decl %s" % r.groups()[0]

        elif form == newer:
            rtype = r.groups()[1]
            rtype = re.match("(?:_root\.)*(\\w*)" , rtype)
            to = JSObject( r.groups()[0] , rtype.groups()[0] )
            nextmark = r.end();

        else:
            #last bit
            nextmark = len(w)

        if r and to and package:
            to.setPackage( package )

        if r:
            #find comments that preceed to
            # if r and r.groups()[0] == "LzAnimator.prototype.initialize":
            #    print "w = ",w[:r.end()]
            (pbg,pend) = to.addPreamble(  w[:r.start()] )
            #if r and r.groups()[0] == "LzAnimator.prototype.initialize":
            #    print "pbg = ",pbg
            #    print "withpreamle = ",w[:pbg]
            #find prototype variables.
            addStaticVariables( root, w[:pbg] + w[pend:r.start()] , to )
            # print "inserting",to.type,to.name
            root.insert( to )

        w = w[nextmark:]
    
    #Now determine inheritance
    while classlinks:
        sup , sub = classlinks.pop()
    
        if sub in root.members:
            root.getMember( sub ).extends( sup )

    return root


def addStaticVariables ( root , s , ob ):
    defs={}
    lins = s.split("\n")

    def getDef ( s , fname ):
        ms = re.search( "\/\/\s*\@field\s*" + re.escape( fname.strip() ) + 
                        "\s*:(.*\n(?:[\t ]*\/\/.*?\n)*)" , s ,
                        re.MULTILINE | re.IGNORECASE);
        if ms:
            comm = re.sub( "\n[\t ]*\/\/" , " " , ms.groups()[0] )
            return comm
        else:
            return 0

    for l in lins:
        #cv = re.match( "(?!\s*\/\/)\s*(.*)\s*=\s*(.*?)\;.*$" , l)
        cv = re.match( "(?!\s*\/\/)\s*(.*)\s*=\s*(.*?)[\;\s]*$" , l)

        if cv:
            if re.match("\s*var\s" , cv.groups()[0]):
                continue
            ispos = cv.groups()[0].split(".")
            if ispos[ 0 ] != '_root':
                ispos.insert(0 ,  "_root" )

            tname = ispos[ -1 ]
            #print "static",cv.groups()[0], cv.groups()[1],getDef( s , tname )
            jsm = JSStaticMember( cv.groups()[0] , cv.groups()[1] ,
                            getDef( s , tname ) )
            root.insert(jsm)

class JSObject:
    def __init__ (self , name , objtype):
        self.protection = 1 #undocumented
        self.undocumented = 1
        self.isdeprecated = 0
        #Dotify any strings that are in Oliver style -- Object[ "sub" ]
        name = re.sub("\s*\[\s*\"\s*(.*?)\s*\"\s*\]\s*" , '.\\1' , name )

        #remove var keyword
        name = re.sub('var\s+' , '' , name )
        
        self.name = name
        self.objectlist = name.split(".");
        
        if self.objectlist[0] != '_root':
            self.objectlist.insert(0 ,  "_root" )
            
        self.objectlist = [o.strip() for o in self.objectlist]

        self.descriptiveName = self.objectlist[-1]
        self.superclass = 0; #actually 'Object' but who cares


        self.depth = len( self.objectlist )

        self.type = objtype
        self.members = {}
        self.atspecials = {}
        self.description = 0

    def comp ( self , another ):
        if self.name > another.name:
            return 1
        else:
            return -1

    def setPackage( self , package ):
        self.package = package
        package.addItem ( self.name , self )

    def addMember (self, newmem ):
        #print "add ",self.name,newmem.objectlist[ self.depth ]  
        self.members[newmem.objectlist[ self.depth ] ] = newmem
        newmem.parent = self

    def insert (self, newmem ):
        if self.depth == newmem.depth - 1:
            if newmem.objectlist[-1] not in self.members.keys():
                self.addMember( newmem )
        else:
            if newmem.objectlist[ self.depth ] in self.members:
                self.members[ newmem.objectlist[ self.depth ] ].insert(newmem)
            else:
                print  "WARNING: nothing found for " + newmem.name + " in " \
                      + self.name

    def extends (self, s ):
        self.superclass = s

    def getSuperclass ( self ):
        sup = self.parent.getMember( self.superclass )
        return sup

    def getMember ( self , memname ):
        if memname in self.members:
            return self.members[ memname ]
        else:
            return 0

    def hasMembers ( self ):
        return len( self.members ) > 0

    def getMembers( self , matchFunc ):
        retlist = []
        for mems in self.members.values():
            if matchFunc( mems ):
                retlist.append( mems )
        return retlist
    
    def addPreamble (self , s):
        # AK: There was a problem with this old regex catching '//=='s that
        #     were in the flasm code, and breaking LzNode, so I changed it 
        #     so that more than 2 equals signs were required.
        # pat = re.compile( "\/\/[-=]+(.*?)\/\/[-=]+\s*" , re.DOTALL )
        pat = re.compile( "\/\/[-=]{3,}(.*?)\/\/[-=]+\s*" , re.DOTALL )
        #comm = re.search( "\/\/--*(.*?)\/\/--*\s*" , s, re.DOTALL )
        #if not comm:
        #    comm = re.search( "\/\/==*(.*?)\/\/==*\s*" , s, re.DOTALL )

        #comm = pat.search(s)
        # grab the last match only
        comm = 0
        for m in pat.finditer(s):
            comm = m

        beginpos = (0,0)
        
        if comm:
            beginpos = (comm.start(),comm.end())
            self.protection = 1 #assume this is public until told otherwise
            #remove comment
            comm = re.sub("\/\/" , "", comm.groups()[0] );
            comm = re.sub( "DEFINE OBJECT:(.*)", "" , comm )
            #print "comm is " + comm
            lines = comm.split("@")
            self.setDescription( lines.pop( 0 ) )
            while lines:
                ats = lines.pop()
                for kw in self.atkeys:
                    t = re.match("^\s*"+kw+"(.*)" , ats , re.IGNORECASE |
                                 re.DOTALL )
                    if t:
                        #need to explicitly pass self as argument here
                        self.atkeys[ kw ]( self , t.groups()[0] )

        #everything before the comment might be class or object stuff

        
        return beginpos
                	
    def setDescription (self , s):
        #print "set descript for " + self.name
        #print s
        self.description = s

    def getDescription (self):
        if self.description and self.description.strip() != "" :
            return self.description
        else:
            return 0    	
            	
    def setParam ( self , pdef):
        if "params" not in self.atspecials:
            self.atspecials["params"]= {}

        kv = re.search("\s*(.*?)\s*\:\s*(.*)" , pdef, re.DOTALL );

        self.atspecials["params"][ kv.groups()[0] ] = kv.groups()[1].strip()

    def getParams( self ):
        if "params" in self.atspecials:
            retdict = self.atspecials[ "params" ]
            return retdict
        else:
            return 0


    def setKeywords (self , pdef):
        protection = {"public" : 1 , "protected" : 2 , "private" : 3}
        self.atspecials["keywords"] = pdef.split( )
        for keys in pdef.split():
            if keys in protection:
              self.protection = protection[ keys ]
            if keys.strip() == "deprecated":
              self.isdeprecated = 1

        	
    def setReturnval (self , pdef):
        self.atspecials[ "returnval" ]  = re.sub( "^.*?:\s*", "" , pdef )
            #comm = re.sub( "\n[\t ]*\/\/" , " " , kv.groups()[1] )

    def getFields( self ):
        fdict = {}
        for mems in self.members.values():
            if mems.type == "function" or mems.type=="prototype":
                mems.getEmbeddedDocumentation( "field" , fdict )
                for m in mems.getAllFields( ):
                    if m not in fdict.keys():
                        fdict[ m ] = 0
        #print self.name,"fields=",fdict
        return fdict
    
    commentMarker = "\/\/=|-*(.*?)\/\/=|-*\s*"
    atkeys = { "param": setParam , "keywords" : setKeywords , \
               "return" : setReturnval }

        
class JSFunction( JSObject ):
    def __init__ (self , name , args , fdef):
        JSObject.__init__(self , name , "function" )
        self.addMember( JSPrototype( name+".prototype" , "prototype" ) )    
        self.superclass=0
        self.arglist = args
        argstring = re.search( ".*\((.*)\)", args , re.DOTALL)

        self.arglistArray = argstring.groups()[0].split(",")
        
        self.arglistArray = [a.strip() for a in self.arglistArray]

        if args=="(vsnode)": 
            to = JSObject( name+".prototype.setters", "setters" )
            self.getMember( "prototype" ).addMember(to)
            to = JSObject( name+".prototype.defaultattrs", "defaultattrs" )
            self.getMember( "prototype" ).addMember(to)

        self.hideconstructor = args =="(vsnode)" 
        self.functext = fdef    	
        
        if re.search( "toString$" , name ):
            self.protection = 3

    def getEmbeddedDocumentation ( self , t , defs=None ):
        if defs is None:
            defs = {}
            
        ms = re.split( "\/\/\s*\@"+ t , self.functext );
        ms.pop(0) #ignore first entry...
        for f in ms:
            fmod = re.search( "(.*\n(?:[\t ]*\/\/.*?\n)*)" , f , re.MULTILINE )
            kv = re.match("\s*(.*?)\s*\:(.*)" ,  fmod.groups()[0] , re.DOTALL )
            comm = re.sub( "\n[\t ]*\/\/" , " " , kv.groups()[1] )
            defs[ kv.groups()[0] ] = comm

        return defs

    def getAllFields ( self , allfields=None ):
        if allfields is None:
            allfields = []

        fn = re.findall( "this\.\s*(.*)\.*" , self.functext )
        for f in fn:
            if re.match( "^\s*\w*?\s*\(" , f ):
                continue
            sname = re.sub("\s|\W.*" , "" ,  f )
            if not allfields or sname not in allfields:
                allfields.append( sname )
        return allfields

    def getOrderedParams( self ):
        return self.arglistArray
        


class JSPrototype( JSObject ):
    def __init__ (self , name , args):
        JSObject.__init__ (self , name , args)

    def addMember (self, newmem ):
        JSObject.addMember( self , newmem )
        #This will be done multiple times, but it's just as fast as testing
        self.parent.type = "class"

    def getEmbeddedDocumentation ( self , t , defs=None ):
        if defs is None:
            defs={}
        for m in self.members.values():
            if m.type == "function" or m.type=="prototype":
                m.getEmbeddedDocumentation( t , defs )

        return defs

    def getAllFields ( self , allfields=None ):
        if allfields is None:
            allfields = []

        for m in self.members.values():
            if m.type == "function" or m.type=="prototype":
                m.getAllFields( allfields )

        return allfields        
        
   

class TunnelObject ( JSObject ):
    def insert (self, newmem ):
        tname = newmem.objectlist.pop(2)
        newmem.objectlist[ 1 ] = self.name + "." + tname
        newmem.objectlist[ 1 ] = newmem.objectlist[ 1 ].strip()
        newmem.depth -= 1
        self.parent.insert( newmem )

    def isService ( self ):
        return 0

    def isClass ( self ):
        return 0


class JSRoot( JSObject ):
    def __init__( self ):
        JSObject.__init__( self , "_root" , "root" )
        self.insert( TunnelObject( "Object" , "builtinObject" ) ) 
        #Eventually, it would be nice to treat view transformers as extensions
        #of the view class
        self.insert( TunnelObject( "LzViewTransformers" , "viewTransformer") )

    def getClasses (self):
        ret = []
        for mems in self.members.values():
            if mems.type == "class" :
                ret.append( mems )
        return ret

    def getServices (self):
        ret = []
        for mems in self.members.values():
            if mems.type == "service":
                ret.append( mems )
        return ret

    def addMember( self , newmem ):
        JSObject.addMember( self , newmem )
        gmem = self.getMember( newmem.type )
        if gmem:
            newmem.type = "service"
            
        
class JSStaticMember( JSObject ):
    def __init__ (self , name , value , defo):
        JSObject.__init__( self , name , "staticmember" )
        self.value = value
        self.setDescription( defo )
        

