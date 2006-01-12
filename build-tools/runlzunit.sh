#!/bin/bash

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

lps_dir=$1
shift
logfile=$1
shift

# file containing list of test pathnames to run
tests="$@"

function usage() {
    echo "Usage: runlzunit.sh <lps_dir> <logfile> <file containing list of test paths> "
    echo "  LPS_HOME and JAVA_HOME env vars must be defined"
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

echo "lps_dir=$lps_dir"
echo "logfile=$logfile"
echo "tests=$tests"

hostname=`hostname`
hosttype=`uname`

case "$hosttype" in
Darwin|Linux)
    build_os=unix
    browser=firefox
    ;;
CYGWIN*)
    build_os=windows
    browser="/cygdrive/c/Program Files/Mozilla Firefox/firefox.exe"
    echo "browser = ${browser}"
    ;;
*)
    exit 1
    ;;
esac


# clean out the existing log file
echo rm -f "${logfile}" 
rm -f "${logfile}" 

shopt -s expand_aliases

# two minute timeout := n * (3 second polling period)
RETRIES=40

# run each test by launching a browser, and waiting for either a "finishtest"
# entry for that path to appear in the log, or get tired of waiting and timeout.
paths=`cat ${LPS_HOME}/${tests}`
for path in $paths; do
    testurl=http://localhost:8080/${lps_dir}/${path}?lzt=swf
    echo "loading ${testurl}"
    `"${browser}" "${testurl}"`
    # grep the log file until we see the "finishtest" for this path, or until timeout
    let timeout=${RETRIES}
    while [[ $timeout -gt 0 ]]; do
	sleep 3
	egrep "${path}" ${logfile} /dev/null 2>&1
	if [ $? == 0 ]; then
	    echo "test ${path} finished"
	    break;
	else
	    echo "waiting for test ${path} to finish..."
	    let timeout--

	fi
    done
    # timeout ?
    if [[ $timeout -le 0 ]]; 
	then
	 # set non zero return code for error
	let rc1++
	echo "TIMEOUT waiting for ${path}"
	echo "<timeout file=\"${path}\" msg=\"TIMEOUT waiting for ${path}\" />" >> ${logfile}
    fi
done


exit $rc1
