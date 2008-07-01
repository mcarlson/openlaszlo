# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

# This file reads a bunch of .html files (in a single folder) and converts
# them to website-ready php files.
import os, glob, re

# Globals
OUTPUTDIR = 'build'
PHPHEAD = '''<?php ob_start(); ?>
<?php $thisPage = "/var/www/html/developers/learn/documentation/installation/index.php" ?>
<?php $urlPrefix = '../../../../'; ?>
%s
<?php require $urlPrefix . 'includes/tree.php'; ?>
<?php $noLeftMargin = 0; ?>
<?php require $urlPrefix . 'includes/header.php'; ?>
<?php 
	if ($devzoneProtected) {
		// session management
		require $urlPrefix . 'developers/includes/global.php';
		require $urlPrefix . 'developers/includes/dev_session.php';
	}
	$header = ob_get_contents();
	ob_end_clean();	
	// write out contents
	echo($header);
?>
<!-- lz_content_start -->
'''
PHPFOOT = '''<!-- lz_content_end -->
<?php require $urlPrefix . 'includes/footer.php'; ?>'''


def checkOutputDir():
    if os.path.isdir( OUTPUTDIR ):
        if not os.access( OUTPUTDIR, os.W_OK ):
            print 'Can\'t write to output directory'
            sys.exit()
    else:
        try:
            os.mkdir( OUTPUTDIR )
        except:
            print 'Could not create output directory'


def makeFiles():
    for f in glob.glob( '*.html' ):
        s = open(f).read()
        mouse = ''
        title = ''
        if f != 'index.html':
            # extract title
            reobj = re.compile( '<title>(.+)</title>' )
            title = reobj.search( s ).group( 1 )
            mouse = """<?php $mouseTrailLast = "%s"; ?>""" % title
        if not title and f != 'index.html':
            print "Title missing in %s" % f
            sys.exit()

        # header/footer
        reobj = re.compile( '^.+<!-- lz_content_start -->', re.DOTALL )
        phphead = PHPHEAD % mouse
        s = reobj.sub( phphead, s )
        reobj = re.compile( '<!-- lz_content_end -->.+$', re.DOTALL )
        s = reobj.sub( PHPFOOT, s)

        # links
        reobj = re.compile( 'href="(?!https?://)([^"]+)\.html?"' )
        s = reobj.sub( 'href="\\1.php"', s )

        # version id
        reobj = re.compile( '@VERSIONID@' )
        s = reobj.sub( 'LPS 2.2', s )
        

        # make files
        fp = open( OUTPUTDIR + '/' + f.replace( '.html', '.php' ), 'w' )
        print >> fp, s


def doIt():
    checkOutputDir()
    makeFiles()


doIt()
