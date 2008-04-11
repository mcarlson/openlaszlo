#!/bin/bash 

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2006, 2008 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

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
    echo "Usage: runlzunit.sh <lps_dir> <logfile> <file containing list of test paths> <runtime> <tags>"
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
    tags=ANY
fi

echo "lps_dir=$lps_dir"
echo "logfile=$logfile"
echo "tests=$tests"
echo "runtime=$runtime"
echo pwd=`pwd`
hostname=`hostname`
hosttype=`uname`

case "$hosttype" in
Darwin)
    build_os=osx
    [ -n "${kill}" ] && killall firefox-bin
    browser=firefox
    function cygpath () { echo $1; }
    ;;
Linux)
    build_os=unix
    browser=firefox
    function cygpath () { echo $1; }
    ;;
CYGWIN*)
    build_os=windows
    browser="/cygdrive/c/Program Files/Mozilla Firefox/firefox.exe"
    [ -n "${kill}" ] && kill -9 `ps -Ws | grep -i firefox | awk '{print $1}'`
    echo "browser = ${browser}"
    ;;
*)
    exit 1
    ;;
esac


# clean out the existing test log file
echo rm -f "${logfile}" 
rm -f "${logfile}" 
# create an empty test log file
touch "${logfile}"

shopt -s expand_aliases

# two minute timeout := n * (3 second polling period)
RETRIES=40

rc1=0

# run each test by launching a browser, and waiting for either a "finishtest"
# entry for that path to appear in the log, or get tired of waiting and timeout.

# Strip out comments from list file
testspath=`cygpath ${LPS_HOME}/${tests}`
paths=`sed -e /^#/d ${testspath}`

echo "Entering runlzunit.sh with LPS_HOME=${LPS_HOME} testspath=${testspath} tags=${tags}"

for path in $paths; do
    # filter for the tags

    echo "Checking test ${path}"
    # filter for the tags
    if [ $tags != "ANY" ]; then
	# replace commas by \| for regexp 
	tagpat=`echo $tags | sed 's/,/\\\|/g'`
	echo "checking ${path} for coverage of tags ${tags}..."
	# search for the tags regexp in the test file source
	echo grep \""[/ #;\t<!-]*covers-tags.*\(${tagpat}\)"\" ${path}
	grep "[/ #;\t<!-]*covers-tags.*\(${tagpat}\)" ${path}
	result=$?
	if [ $result != 0 ]; then
	    echo "skipping ${path}, does not match tags ${tags}"
	    echo
	    continue
	fi
    fi

    testurl=http://localhost:8080/${lps_dir}/${path}?lzr=${runtime}
    echo "loading ${testurl} at ${path}"
    if [ "${build_os}" = "osx" ]; then
	`open -g -a "${browser}" "${testurl}"`
    else
	`"${browser}" "${testurl}"` &
    fi
    
    # grep the log file until we see the "finishtest" for this path, or until timeout
    let timeout=${RETRIES}
    while [[ $timeout -gt 0 ]]; do
	sleep 3
	# did we fail? 
	echo grep \"finish_testsuite: ${path} failures: [^0]\" ${logfile} 
	grep "finish_testsuite: ${path} failures: [^0]" ${logfile} 
	if [ $? = 0 ]
	    then
            # the failure string does exist in the logfile
	    echo "found failure while testing ${path}"
	    exit 2
	fi
	
	grep "${path}" ${logfile}
	if [ $? = 0 ]
	    then
	    echo "finish_testsuite: ${path}"
	    break
	else
	    echo "waiting for test ${path} to finish..."
	    let timeout--
	fi
    done
    
    # timeout ?
    if [[ $timeout -le 0 ]]; 
	then
		# set non zero return code for error
	echo "TIMEOUT waiting for ${path}"
	echo "timeout: ${path} msg=\"waiting on log message for ${path}\"" >> ${logfile}
	exit 93
    fi
done

[ -n "${kill}" ] && case "$hosttype" in
Darwin)
    killall firefox-bin
    ;;
CYGWIN*)
    kill -9 `ps -Ws|grep -i firefox|awk '{print $1}'`
    ;;
esac

exit $rc1
