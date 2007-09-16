#!/bin/bash
# Run several tests in the rhino runtime.
# usage 
# runlztest.sh [file-with-list-of-tests]
# Copyright 2007 Laszlo Systems

# Use a default value for the tests file if its not specified on the command line
tests=${1:-"test/lztest/smoketest.txt"}
shift
tags=$1
if [ "${tags}" = "" ]; then
    tags=ANY
fi

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

echo build-tools/runlztest.sh ${tests} "${mytags},${tags}"
build-tools/runlztest.sh ${tests} "${mytags},${tags}"

