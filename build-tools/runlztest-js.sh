#!/bin/bash
# Run several tests in the rhino runtime.
# usage 
# runlztest-js.sh [file-with-list-of-tests]
# Copyright 2006 Laszlo Systems

# Use a default value for the tests file if its not specified on the command line
# Note: in this version we expect pure js for the test files. 
# tests=$1
cd $LPS_HOME
tests=test/lztest/jstests.txt
if [ ! $tests ]; then
    echo "List of tests does not exist."
    echo "Usage: build-tools/runlztest-js.sh list_of_tests "
    exit 1;
fi


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
    outfile=tmp/$outfile
        
    # Add some code which makes the rhino runtime provide the names
    # and services that the swf and dhtml runtimes provide. 
    cat lps/utils/rhino.js > $outfile
    echo "load(\"lps/utils/lztestmanager.js\");" >> $outfile
    
    # make the file with all the tests load in that compiled file
    echo "load(\"${i}\");" >> $outfile
    
    # We expect the test file to contain an object named theTestSuite
    # with attribute tests, an array with test function names
    echo "LzTestManager.addTestSuite(theTestSuite);" >> $outfile
    echo "LzTestManager.runTestSuites();" >> $outfile
    echo "LzTestManager.printSummary();" >> $outfile
    
    echo "if (LzTestManager.failedsuites > 0) quit(3);" >> $outfile 

    # load that file into rhino
    java -jar $ANT_HOME/lib/js.jar $outfile

    
    # Stop testing if we failed a test
    if [ $? != 0 ] ; then
        echo "FAILED a test in runlztest-js.sh in $outfile";
        exit 1;
    fi
    
done

echo "Done."
