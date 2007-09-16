#!/bin/bash
# Run tests in a browser. Derive the list of tests by collecting the set of
# "@affects" tags from modified svn files, and run tests which cover those tags.
# usage 
#  findtestsbrowser.sh ${build.branch LOGFILE TEST-FILES-LIST RUNTIME'" />
# Copyright 2007 Laszlo Systems

if [ $1 = "-k" ]; then shift; kill=yes; fi
lps_dir=$1
shift
logfile=$1
shift
tests=$1
shift
runtime=$1
shift
tags=$1

function usage() {
    echo "Usage: findtestbrowser.sh <lps_dir> <logfile> <file containing list of test paths> <runtime> <tags>"
    echo "  LPS_HOME and JAVA_HOME env vars must be defined"
    echo "  runtime should be swf6|swf7|swf8|dhtml"
    echo "  tags is a comma separated list of test coverage tags"
    exit 1
}

if [ "${lps_dir}" = "" ]; then
    echo "error: lps_dir not set"
    usage;
fi
if [ "$LPS_HOME" = "" ]; then
    echo "error: LPS_HOME not set"
    usage;
fi
if [ "${tests}" = "" ]; then
    echo "error: tests not set"
    usage;
fi
if [ "${runtime}" = "" ]; then
    echo "error: runtime not set"
    usage;
fi

if [ "${tags}" = "" ]; then
    tags="ANY"
fi

echo "lps_dir=$lps_dir"
echo "logfile=$logfile"
echo "tests=$tests"
echo "runtime=$runtime"


# If we can't find java, look in some other likely places for it
JAVA_EXEC=`which java`
if [ ! -x $JAVA_EXEC ]; then
    echo "java executable not found in path; trying $JAVA_HOME"
    JAVA_EXEC=${JAVA_HOME}/bin/java
    if [ ! -x $JAVA_EXEC ]; then
        echo "Can't java executable in path or in $JAVA_EXEC. FAILING lztest."
        return -1
    fi
fi

echo "Entering findtests.sh with LPS_HOME=${LPS_HOME} tags=${tags}"

################################################################
# Collect "affects" tags from list of modified (svn status -q) files
################################################################
svn status -q WEB-INF/lps/lfc | awk '{print $2}' > _modfiles
# collect the union of 'affects-tags' comments from them
# example:
#     @affects animation lzanimator

# collect 'affects' tags into this file
echo "" > _modtags

for i in `cat _modfiles`; do
    grep '.*@affects' $i
    grep '.*@affects' $i | sed 's/.*@affects\s//' >> _modtags
done

mytags=`$JAVA_EXEC -jar 3rd-party/jars/custom_rhino.jar build-tools/findtests.js _modtags | sed 's/\n//'`
echo build-tools/runlzunit.sh ${lps_dir} ${logfile} ${tests} ${runtime} "${mytags},${tags}"

