#!/bin/bash

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

lps_dir=$1
tomcat=$2

if [ "${LPS_MAGIC}" != "" ]; then
    head=-5
else
    head=-99999
fi

if [ "${lps_dir}" = "" ]; then
	exit 1
fi
if [ "${tomcat}" = "" ]; then
	exit 1
fi

hostname=`hostname`
hosttype=`uname`

case "$hosttype" in
Darwin|Linux)
    build_os=unix
    prefetch_dir="${LPS_HOME}/${lps_dir}"
    chmod -R +x ${prefetch_dir}/${tomcat}/bin/*.sh # just in case they aren't!
    ${prefetch_dir}/${tomcat}/bin/shutdown.sh 2>/dev/null
    ln -s ${LPS_HOME}/test ${prefetch_dir}/Server/${lps_dir}/test
    ;;
CYGWIN*)
    build_os=windows
    prefetch_dir="${LPS_HOME}\\${lps_dir}"
    net stop LPS
    cp -r ${LPS_HOME}/test ${prefetch_dir}/Server/${lps_dir}/test # stupid cygwin!
    ;;
*)
    exit 1
    ;;
esac

export TOMCAT_HOME="${prefetch_dir}\\${tomcat}"

case "${build_os}" in
unix)
    env JAVA_OPTS="-Xms128m -Xmx512m" ${prefetch_dir}/${tomcat}/bin/startup.sh
    sleep 30
    ;;
windows)
    build-tools/service.sh install "-Xms128m -Xmx512m"
    net start LPS
    sleep 5
    ;;
esac

function retry() {
    retries=$1
    string=$2
    shift 2
    while [[ $retries -gt 0 ]]; do
        out=`"$@"`
        if `echo "$out" | grep -vq "$string"`; then break; fi
        retries=$(($retries - 1))
    done
    echo $out
}

shopt -s expand_aliases

rc=0
if [ -e ${LPS_HOME}/${TEST_DIR}/results ] ; then
(cd ${LPS_HOME}/${TEST_DIR}/results; find . -name '*.gf.html' | head ${head} |\
    sed 's/\.gf\.html$//' | sed 's/^\.\///' ) | \
while read path; do
    curl -L -w"Wrappers: %{url_effective} (%{time_total}s, %{http_code})\n" \
        -s -o/tmp/curl.$$ http://localhost:8080/${lps_dir}/$path.lzx'?lzt=v1'
    p4 print //depot/qa/test/results/$path.gf.html | tail +2 > /tmp/gf.$$
    if ! diff -b /tmp/curl.$$ /tmp/gf.$$; then
        echo "*** Wrapper diff for $path.lzx Failed! ***"
        rc=1
    fi
done
rm -f /tmp/curl.$$
rm -f /tmp/gf.$$
else
    echo WRAPPER TEST FAILURE: $LPS_HOME/$TEST_DIR/results missing!
fi

if [ $rc = 0 ]; then # remove the logs and cache files if we succeeded!
    rm -rf "${prefetch_dir}/${tomcat}/work/LPS/localhost/${lps_dir}/LPS/*cache"
fi

shopt -u expand_aliases
          
case "${build_os}" in
unix)
    ${prefetch_dir}/${tomcat}/bin/shutdown.sh
    rm -rf ${prefetch_dir}/Server/${lps_dir}/test
    ;;
windows)
    net stop LPS
    rm -rf ${prefetch_dir}/Server/${lps_dir}/test # stupid cygwin!
    ;;
esac

exit 0
exit $rc
