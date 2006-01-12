#!/usr/bin/python
#
# LPS Automated Regression Test Script
#
#
# Relies on the existance of java in your PATH
# as well as the UNIX/Cygwin cmp program
# Relies on swfdiff.py and swfdump compiled and in your path...
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************


from os.path import join
from time import sleep
import sys, os, re, string, shutil, signal, traceback
import urllib, urlparse
import xml.dom.minidom
import datetime

# Types of test run output
output  ='out'
golden  ='gf'

# Internal defaults
bufsize = 1000000
DEF_TYPE = 'lps'

# Overridable globals
HOST    ='localhost'
PORT    ='8080'
PATH    ='lps'
BROWSER = 'mozilla'
PLUGIN = 'flash7'
RETRIES = 5

LPS_HOME = join(os.path.dirname(os.path.abspath(sys.argv[0])), '..')

creating = 0
type = None
debug = False
config = 0

configFile = 'smoke-test.xml'
name = ''
dir =''
title = ''
swfversion = 6

pipe = os.popen('p4 client -o')
data = pipe.read()
pipe.close()

# This is the base directory for test results and output 
# By default, use client's depot root
TEST_HOME = re.search("^Root:\s+(\S+)", data, re.M).group(1)

# Mapping from command line options to their descriptions and respective globals
opts = {
'c'       : ['create golden files', creating],
'dir'     : ['<test case directory>', dir],
'path'    : ['<LPS web app path>', PATH],
'type'    : ['<test type (lps|html|js|krank)>', type],
'browser' : ['<path to web browser executable>', BROWSER],
'plugin'  : ['<flash player to use (for kranking only)>', PLUGIN],
'host'    : ['<hostname>', HOST],
'home'    : ['<LPS directory>', join (LPS_HOME, '..')],
'port'    : ['<port LPS is on>', PORT],
'retries' : ['<# of attempts to submit request>', RETRIES],
'config'  : ['[test suite file]', configFile],
'output'  : ['<path to test results>', TEST_HOME],
'test'    : ['<LZX file>', name],
'debug'   : ['include debug versions in swf compilation', debug],
'title'   : ['<name to give this test>', title],
'swfversion' : ['<SWF version to compile to>', swfversion] }

# Diff
def diff(differ, a, b, d):
    p_in, p_out, p_err = os.popen3(differ + " '" + a + "' '" + b + "'")
    of = p_out.readlines()
    ef = p_err.readlines()
    
    out = open(d, "w")
    stm = None
    if len(of):
        stm = of
    else:
        stm = ef
    out.writelines(stm)
    out.close()
    p_in.close()
    p_out.close()
    p_err.close()
    return len(stm)

# Send bytes from a to be
def send(a, b):
    buf = a.read(bufsize)
    while buf != "" :
        os.write(b, buf)
        buf = a.read(bufsize)

# Make dir if not there
def makedirs(d) :
    if not os.access(d, os.F_OK):
        os.makedirs(d)

# Return lz request type
def getlzt(query):
    for s in string.split(query, '&'):
        if s[0:4] == 'lzt=':
            name, value = string.split(s, '=')
            if value == '':
                value='html'
            return value
    return 'html'

# Run the compiler and generate javascript output and diff
def js(src, dir) :

    url = "http://" + HOST + ":" + PORT + "/" + PATH
    lzc = LPS_HOME + '/WEB-INF/lps/server/bin/lzc'

    outfile = string.replace(src, ".lzx", "." + output + ".log")
    goldenfile = string.replace(src, ".lzx", "." + golden + ".log")
    txt = string.replace(src, ".lzx", ".log.txt")
        
    testdir = join(TEST_HOME, 'results', dir)
    makedirs(join(testdir, title))

    goldenfile = join(testdir, goldenfile)
    outfile = join(testdir, title, outfile)
    diffsfile = join(testdir, title, txt)
    
    cmd = lzc + ' -Dtrace.xml --script -log ' + outfile + ' ' + join(LPS_HOME,dir,src) \
    + ' -dir /dev/null'
    os.system(cmd)
    if creating == 1:
        try:
            shutil.copyfile(outfile, goldenfile)
            return 0, outfile
        except Exception,e:
            print e,
            return 1, outfile + ': ' + string.join(map(str, e.args))
    else:
       ok = diff("diff", goldenfile, outfile, diffsfile)
       return ok, outfile



# Check an lzx request against lps and diff
def lps(src, dir, extra='') :
    global swfdiff, RETRIES

    x = string.split(src, "?")
    of = x[0]
    if len(x) > 1:
        query = "?" + x[1]
    else:
        query = ""
    base_url = "http://" + HOST + ":" + PORT + "/" + PATH
    req = string.join([base_url, dir, of + query], '/')
    url = urlparse.urlsplit(req)
    rt = getlzt(url[3])
    testdir = join(TEST_HOME, 'results', dir, extra)
    
    makedirs(join(testdir, title))
    if rt == 'v1' :
        rt='html'
    outfile = re.sub("\.lz.", "." + output +  "." + rt, of)
    goldenfile = re.sub("\.lz.", "." + golden + "." + rt, of)
    txt = re.sub("\.lz.", "." + rt + ".txt", of)

    goldenfile = join(testdir, goldenfile)
    outfile = join(testdir, title, outfile)
    diffsfile = join(testdir, title, txt)
    
    attempts = RETRIES

    while attempts > 0:
        try:
            # urlretrieve appears to be broken for binary files
            s = urllib.urlopen(req)
            if debug:
                urllib.urlopen(req + '&debug=true')
            break
        except Exception, ex:
            print ex
            attempts -= 1
            sleep(2)

    # Stop processing if reached limit of request attempts
    if attempts == 0:
        raise ex
    try:
        out = int()
        if rt == 'swf' :
            if (os.getenv("OS") == 'Windows_NT'):
                out = os.open(outfile, os.O_WRONLY | os.O_CREAT | os.O_BINARY | os.O_TRUNC)
            else:
                out = os.open(outfile, os.O_WRONLY | os.O_CREAT | os.O_TRUNC)
            diffprog = swfdiff
        else:
            out = os.open(outfile, os.O_WRONLY | os.O_CREAT | os.O_TRUNC)
            
            # Ignore differences in HTML due to potentially different PATH values
            diffprog = "diff -b -I \".*" + of + "\?.*\""
        send(s, out)
    finally:
        s.close()
        os.close(out)

    if creating == 1:
        try:
            shutil.copyfile(outfile, goldenfile)
            return 0, outfile
        except Exception,e:
            print e,
            return 1, outfile + ': ' + string.join(map(str, e.args))
    else:
        ok = diff(diffprog, goldenfile, outfile, diffsfile)
        
        return ok, outfile

def html(src, dir, more):
    return lps(src, dir, more)
    
def krank(src, dir):
    str = string.split(src, '?')
    if len(str) > 1 and getlzt(str[1]) == 'swf':
        base_url = str[0]
        url = "http://" + HOST + ":" + join(PORT, PATH, dir, base_url)

        # First compile the app to be kranked, so that below we only have to wait on the krank process
        print '\n\t\tCompiling ' + base_url + '...'
        urllib.urlopen(url)

        print '\t\tKranking ' + base_url + '...',
        
        ps = 'ps -e'
        if (sys.platform == 'cygwin' ) :
            ps += 'W'

        # Just being lazy here and only searching for the base file name without the full path
        p_out = os.popen(ps + ' | grep "' + os.path.basename(BROWSER) + '"')
        s = p_out.read().rstrip()
        p_out.close()
        if s:
            msg = 'ERROR: Please exit the specified browser before running this script in krank mode'
            print '\n' + msg,
            raise Exception(msg)
        
        target = join(os.path.dirname(BROWSER), 'plugins')
        if os.access(target, os.F_OK):
            os.system('chmod -R u+w "' + target + '"')
            target += '/' + os.path.basename(PLUGIN)
            shutil.copy(cygwinize(PLUGIN), target)
        else:
            raise Exception('Unable to find browser ' + BROWSER)

        pid = os.spawnlpe(os.P_NOWAIT, BROWSER, '', url + '?krank=true', os.environ)
        sleep(5)
        
        stat_url = url + '?lzt=krankstatus'

        done = False

        while (not done):
            print '.',
            sys.stdout.flush()
            f = urllib.urlopen(stat_url)
            ks = f.read()
            f.close()
            done = re.search('Optimization.*finished', ks)
            sleep(10)
        print 'done.'
        os.kill(pid, signal.SIGTERM)
        os.waitpid(pid, 0)

    return lps(string.replace(src, '.lzx', '.lzo'), dir, 'kranked')


def nuke(f) :
    if os.path.isfile(f) :
        os.remove(f)
    else:
        kids = os.listdir(f)
        for i in kids:
            nuke(join(f, i))

        os.rmdir(f)
#
# Class that handles the output
#
class Results:
    def __init__ (self) :
        self.results = []
        self.ext = '.html'
        self.res_path = 'results'

    def open (self, file):

        makedirs(join(TEST_HOME, self.res_path))
        if (file != ''):
            self.res_path = join (self.res_path, file)
        res_file = self.res_path + self.ext

        # Get the LPS Server info
        url = "http://" + HOST + ":" + join(PORT, PATH, "foo.lzx?lzt=serverinfo")
        si = urllib.urlopen(url)
        serverinfo = si.read()
        sidom = xml.dom.minidom.parseString(serverinfo)
        version = sidom.childNodes[0].getAttribute("version")
        build = sidom.childNodes[0].getAttribute("build")
        
        self.file = open(join (TEST_HOME, res_file), "w")
        self.file.write ('<html><head><h2>Automated Regression Test Results:</h2>')
        self.file.write ('<b>' + file + '</b> (Executed on <a href="http://' + HOST + ':' + PORT + '/' \
        + PATH + '"><strong>' + HOST + '</strong></a>, LPS Version:  <b>' + version + '</b>, ' + 'Build: <b>' + build + '</b>)</head>')
        self.file.write ('<body>\n')
        self.file.flush()
        self.startTime = datetime.datetime.today()
        print "LPS Version: " + sidom.childNodes[0].getAttribute("version")
        print "Build:       " + sidom.childNodes[0].getAttribute("build")
        sidom.unlink()
        print "Tests started:  " + self.startTime.strftime('%b %d %Y %H:%M:%S')

    def start (self, msg, name):
        print msg + ' ' + name
        sys.stdout.flush()
        self.name = name
        self.results.append ('<b>' + name + '</b><p/>\n' )
        self.results.append ('<table border="2" cellspacing="2" cellpadding="2" >\n' )
        self.results.append ('<tr><td><b>Test Case #</b></td>\n' )
        self.results.append ('    <td><b>Description</b></td>\n' )
        self.results.append ('    <td><b>Result</b></td>\n' )
        self.results.append ('    <td><b>output file</b></td></tr>\n' )

    def post (self, num, message, result, out=None):
        self.results.append ('<tr><td><b>'+num+'</b></td><td><b>')
        self.results.append (message)
        self.results.append ('</b></td>')
        if result:
            print '\033[0;32m\tSUCCESS',
            print '\033[0;m\t'
            sys.stdout.flush()
            self.results.append ('<td bgcolor="green">SUCCESS</td><td>&nbsp;</td></tr>\n' )
        else:
            print '\033[1;31m\tFAILURE',
            print '\033[0;m\t'
            sys.stdout.flush()

            base_url = "http://" + HOST + ":" + PORT
            self.results.append ('<td bgcolor="red">FAILURE ')
            
            # out will be undefined if an unexpected exception is thrown at runtime
            if (out):
                ext = re.search('\.([^.]+)$', out)
                
                # link to diffs            
                href = join('file://' + out)
                goo = href

                href = string.replace(href, output + '.' + ext.group(1), ext.group(1) + '.txt')
                self.results.append('<a href="'+href+'">(DIFFS)</a></td>\n')

                # this is a link to the busted file
                self.results.append('<td><a href="' + goo + '">'+ goo +'</a><br>')

            # And the live link...
            fname = self.name
            if not re.search('\.lz.', fname): 
                fname = join(fname, message)
            else:
                fname=join(os.path.dirname(fname), message)

            link = join(base_url, PATH, fname)
            self.results.append ('<a href="' + link + '">' + link + '</a></td></tr>')
    def stop (self):
        self.results.append('</table>\n<p><hr><p>\n')

    def close (self, total, fail, expected):
        stopTime = datetime.datetime.today()
        print "Tests ended:  " + stopTime.strftime('%b %d %Y %H:%M:%S')
        self.startTime = self.startTime.replace(microsecond=0)
        stopTime = stopTime.replace(microsecond=0)
        elapsedTime = stopTime - self.startTime
        print "Run time:  " + str(elapsedTime)
        print '\nRan ' + str(total) + ' tests.'
        fail_msg = str(fail)+' Failure'
        exp_fail = ' and '+str(expected)+' Expected Failure'
        if fail != 1:
            fail_msg += 's'
        if expected != 1:
            exp_fail += 's'
        
        print fail_msg
        print exp_fail
        print '\n'
        sys.stdout.flush()
        self.file.write ('<h2>'+str(total)+' Tests Run</h2>')
        self.file.write ('<h3>' + fail_msg + '</h3>')
        self.file.write('<b>' + 'Started: &nbsp;&nbsp;' + self.startTime.strftime('%b %d %Y %H:%M:%S') + '</b>')
        self.file.write('<b><br>' + 'Ended: &nbsp;&nbsp&nbsp;&nbsp;' + stopTime.strftime('%b %d %Y %H:%M:%S') + '</b>')
        self.file.write('<b><br>' + 'Run time: &nbsp;' + str(elapsedTime) + '</b><br><br>')
         # self.file.write (' Expected Failures: '+str(expected)+'</h2>\n')
        self.file.write (string.join(self.results))
        self.file.write ('</body></html>\n')
        self.file.flush()
        self.file.close

#
# Class that represents a test suite
#
class Suite:
    def __init__ ( self ) :
        self.name = ""
        self.dir  = ""
        self.test = DEF_TYPE

    def runtests( self ):
        global creating
        if creating == 1:
            msg = 'Creating golden files for'
        else:
            msg = 'Testing'

        name = self.name
        if (name == ""):
            pathname = self.dir
        else :
            pathname = join(os.path.normcase(self.dir), self.name)
        res.start(msg, pathname)
        files = []

        d = join(LPS_HOME, os.path.normcase(pathname))
        ix = join(d, "tests-index.txt")
        if (os.path.isfile(ix)):
            index = open(ix, "r")
            sources = index.readlines()
        else :
            if (os.path.isdir(d)):
                files = os.listdir(d)
            else:
                files.append(os.path.basename(d))
            sources = []
            for f in files:
                srcfile = ()
                if (os.path.isfile(join(d, f))):
                    srcfile = file(join(d, f))
                elif (os.path.isfile(d)):
                    srcfile = file(d)
                if (re.match('.*\.lzx$', f) and re.search("<canvas", srcfile.read())):
                    if self.test == 'lps' or self.test == 'krank':
                        sources.append(f + '?lzt=swf&lzr=swf' + str(swfversion))
                        sources.append(f + '?lzt=v1')
                        # ponder this next one...
                        #sources.append(f + '?lzt=swf&debug=true')
                        #sources.append(f + '?lzt=xml')
                    elif self.test == 'html':
                        sources.append(f + '?lzt=v1')
                    else:
                        sources.append(f)

        i = int(0)
        failurecount = int(0)
        out = ''
        try:
            swf_dir = ''
            if swfversion > 5:
                swf_dir = 'swf' + str(swfversion)
            for s in sources:
                if s[0] != '#':
                    s = string.strip(s)
                    src = os.path.basename(s)
                    print '\t' + src,
                    f = eval(self.test)                    
                    ok, out = f(src, self.dir, swf_dir)
                    if ok == 0 :
                        status = 1
                    else:
                        status = 0
                        failurecount += 1
                    if self.test == 'krank':
                        src = string.replace(src, '.lzx', '.lzo')
                    sys.stdout.flush()
                    res.post(str(i), src, status, out)
                    i += 1
        except Exception, ex:
            i += 1
            failurecount += 1
            res.post(str(i), src + ' ' + str(ex), 0, out)
            print "".join(traceback.format_tb(sys.exc_info()[2]))
            res.stop()
        else:
            res.stop()
        return i, failurecount

# Return the list of test suites in the file
def parseSuites(file):
    global type
    dom = xml.dom.minidom.parse(file)
    i = int(0)
    suites = []
    for p in dom.childNodes:
        for e in p.childNodes:
            if (e.nodeType == xml.dom.Node.ELEMENT_NODE \
                and e.nodeName == "suite") :
                suite = Suite()
                
                # Allow test type to be overridden from command line
                if (type):
                    suite.test = type
                else:
                    suite.test = e.getAttribute("test")
                suite.dir  = e.getAttribute("directory")
                suites.append(suite)

    return suites
    
def cygwinize(path):
    out = os.popen('cygpath -w -m -a "' + path + '"')
    path = out.read().rstrip()
    out.close()
    return path

def strcmp(a, b):
    return cmp(len(a), len(b))

# Usage message
def usage():
    print "Usage: quickcheck.py <options>"
    print "\nOptions:"
    
    lst = opts.keys()
    lst.sort(strcmp)
    width = len(lst[len(lst) - 1])

    for key in opts.keys():
        print string.ljust('-' + key, width + 4) + opts[key][0],
        if opts[key][1]:
            print '(default: ' + str(opts[key][1]) + ')',
        print
    print "Some options are mutually exclusive, at least one must be provided"
    sys.exit()

##
## Main
##

# Number of tests and test failures
testcount = int(0)
failurecount = int(0)

# HTML summary of regress
res=Results()

if (len(sys.argv) == 1):
    usage()

count = int(1)
while count < len(sys.argv):
    arg = sys.argv[count]
    if arg == '-c' :
        creating = 1
    elif arg == '-dir':
        count += 1
        dir = sys.argv[count]
    elif arg == '-test':
        count += 1
        name = sys.argv[count]
    elif arg == '-path':
        count += 1
        PATH = sys.argv[count]
    elif arg == '-port':
        count += 1
        PORT = sys.argv[count]
    elif arg == '-host':
        count += 1
        HOST = sys.argv[count]
        print 'Running against ' + HOST
    elif arg == '-home':
        count += 1
        LPS_HOME = sys.argv[count]
    elif arg == '-browser':
        count += 1
        BROWSER = sys.argv[count]
    elif arg == '-plugin':
        count += 1
        PLUGIN = sys.argv[count]
    elif arg == '-swfversion':
        count += 1
        swfversion = sys.argv[count]
    elif arg == '-retries':
        count += 1
        RETRIES = int(sys.argv[count])
    elif arg == '-config':
        config = 1
        count += 1
        cf = sys.argv[count]
        if not opts.has_key(cf[1:]):
            configFile = cf
        else:
            count -= 1
    elif arg == '-output':
        count += 1
        TEST_HOME = sys.argv[count]
    elif arg == '-type':
        count += 1
        type = sys.argv[count]
    elif arg == '-debug':
        count += 1
        debug = 1
    elif arg == '-title':
        count += 1
        title = sys.argv[count]
        print "Test name is: " + title
    else:
        print "unknown argument: " + arg
        usage()
    count += 1

LPS_HOME = string.replace(LPS_HOME, '\\', '/')

p_dir = 'tools/plugins'
os_name = 'linux'
ext = '\.so'


if (sys.platform == 'cygwin' ) :
    LPS_HOME = cygwinize(LPS_HOME)
    TEST_HOME = cygwinize(TEST_HOME)
    os_name = 'win32'
    ext = '\.dll'

if type == 'krank':
    p_path = join(p_dir, os_name, PLUGIN)
    files = os.listdir(p_path)

    # Find and use the first file that looks like a valid browser plugin
    for f in files:
        if re.search(ext, f):
            PLUGIN = join(p_path, f)
            break

swfdiff = '"' + LPS_HOME + '"' + '/test/tools/swfdiff.py '
res.open(title)

print 'Using '+PATH+' as LPS-ROOT'
print 'Using '+PORT+' as PORT'
print 'Using ' + LPS_HOME + ' as LPS_HOME'

if config :
    # For config, we parse the configfile and
    # run the tests in each suite

    suites = parseSuites(configFile)
    for suite in parseSuites(configFile):
        t, f = suite.runtests()
        testcount += t
        failurecount += f

else:
    # For 'dir', we run the tests in the specified directory
    suite = Suite()
    
    dir = join(dir, os.path.dirname(name))
    suite.name = os.path.basename(name)
    suite.dir  = dir
    if (not type):
        type = DEF_TYPE
    suite.test = type
    testcount, failurecount = suite.runtests()

res.close(testcount, failurecount,0) #TODO expected not implemented

if failurecount > 0 :
    sys.exit(1)
else:
    sys.exit(0)
