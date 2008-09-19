The files in this directory are used or created by the 'appsize'
target in the top level build.xml:

  appsize-input.txt       drives this test by listing the urls to
                          get and measure, along with their (recent)
                          previous values.

  appsize-4.0.txt         An alternate driver for the test, which records
                          the sizes from 4.0.13 for comparison.

  appsize-output.txt      is created by this test -- it should look the same
                          as appsize-input.txt except that the values
                          contain the current values of the sizes.
                          This file is *not* in SVN, it is always generated.

Normally, in the $LPS_HOME directory, one does either:

   ant appsize
   ant -Dappsize.input=appsize-4.0.txt appsize

This uses appsize-input.txt (in the first case) or appsize-4.0.txt (in
the second) and puts the output in appsize-output.txt.  The benchmark
can be updated to reflect the current app size values by copying
appsize-output.txt to appsize-input.txt and committing this change.

================================================================

If you see *much* worse results (factor of 2 or greater) than expected,
it is likely that you do not have compression turned on for the version
of tomcat you are testing with.  In your conf/server.xml you'll want a
line that looks like this:

         <Connector port="8080" .......
			   compressableMimeType="application/xml,text/html,text/xml,text/javascript,application/x-javascript,application/javascript,application/x-shockwave-flash"/>

================================================================

The ant target has a number of options that allow some flexibility.
To run against a different branch (e.g. change the first url to
http://127.0.0.1:8080/my-great-branch/demos/lzpix/app.lzx?lzr=dhtml&lzt=html)
use:

  ant -Dappsize.branch=my-great-branch appsize

To turn on the 'verbose' flag or the 'ignore errors' flag, use appsize.flags,
e.g.

  ant -Dappsize.flags="-i -v" appsize

You can also redirect the output file:

  ant -Dappsize.output=myoutput.txt

All files are in this directory, unless changed via
  
  ant -Dappsize.dir=some/other/dir
