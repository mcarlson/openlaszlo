#!/bin/bash
# Run several tests in the rhino runtime.
# usage 
# runlztest.sh [file-with-list-of-tests]
# Copyright 2006 Laszlo Systems

# Use a default value for the tests file if its not specified on the command line
tests=${1:-"test/lztest/smoketest.txt"}

echo "Entering runlztest.sh with LPS_HOME=${LPS_HOME}"

# Strip out comments from list file
paths=`sed -e /^#/d ${tests}`

# write several tests into that file
for i in $paths; do

    echo "testing $i .............." 
    
    if [ ! -f $i ]; then
        echo "Test file does not exist: $i"
        echo "Please edit the list of tests, which is $tests. "
        exit 1;
    fi

    outfile=${i//\//_}
    outfile=${outfile%lzx}js
    outfile=tmp/$outfile
        
    # Add some code which makes the rhino runtime provide the names
    # and services that the swf and dhtml runtimes provide. 
    cat lps/utils/rhino.js > $outfile
    
    # compile that file with lzc
    $LPS_HOME/WEB-INF/lps/server/bin/lzc --runtime=dhtml $i
    
    # If the compile failed, the tests should fail.
    if [ $? != 0 ] ; then
        echo "FAILED to compile test $i in runlztest.sh"
        exit 1;
    fi
    
    # make the file with all the tests load in that compiled file
    echo "load(\"${i%lzx}swf\");" >> $outfile
    
    echo "if (LzTestManager.failedsuites > 0) quit(3);" >> $outfile

    # load that file into rhino
    java -jar 3rd-party/jars/custom_rhino.jar $outfile
    
    # Stop testing if we failed a test
    if [ $? != 0 ] ; then
        echo "FAILED a test in runlztest.sh";
        exit 1;
    fi
    
done

echo "Done."
