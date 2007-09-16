#!/bin/bash

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

lps_dir=$1
shift
tomcat=$1
shift
find=find

# where to find things to prefetch
findwhere="laszlo-explorer examples demos lps/utils lps/admin $@"

# The context of the webapp which we are prefetching from 
webapp=$lps_dir

if [ "${LPS_MAGIC}" != "" ]; then
    head=-5
else
    head=-99999
fi

function usage() {
    echo "Usage: prefetch.sh <lps_dir> <tomcat>"
    echo "  LPS_HOME and JAVA_HOME env vars must be defined"
    exit 1
}

if [ "${lps_dir}" = "" ]; then
    echo "error: lps_dir not set"
    usage;
fi
if [ "${tomcat}" = "" ]; then
    echo "error: tomcat not set"
    usage;
fi
if [ "$LPS_HOME" = "" ]; then
    echo "error: LPS_HOME not set"
    usage;
fi
if [ "$JAVA_HOME" = "" ]; then
    echo "error: JAVA_HOME not set"
    usage;
fi

hostname=`hostname`
hosttype=`uname`

# Shut down tomcat if it's running. Shutdown will fail if tomcat isn't
# running, but that's not a fatal error. 
case "$hosttype" in
Darwin|Linux)
    build_os=unix
    prefetch_dir="${LPS_HOME}/${lps_dir}"
    chmod -R +x ${lps_dir}/${tomcat}/bin/*.sh # just in case they aren't!
    ${prefetch_dir}/${tomcat}/bin/shutdown.sh 2>/dev/null
    export TOMCAT_HOME=${prefetch_dir}/${tomcat}
    ;;
CYGWIN*)
    build_os=windows
    prefetch_dir="${LPS_HOME}\\${lps_dir}"
    net stop LPS
    export TOMCAT_HOME=`cygpath -w "$prefetch_dir/$tomcat"`    
    ;;
*)
    exit 1
    ;;
esac

#rm -rf "${LPS_HOME}/WEB-INF/lps/work" # clean out the cache and logs

export JAVA_HOME

echo "---------- prefetch settings ----------"
echo "prefetch dir: $prefetch_dir"
echo "JAVA_HOME: $JAVA_HOME"
echo "TOMCAT_HOME: $TOMCAT_HOME"
echo "---------------------------------------"

# Start up tomcat
case "${build_os}" in
    unix)
        env JAVA_OPTS="-Xms128m -Xmx512m -DuseBogusErrorCode=true" ${prefetch_dir}/${tomcat}/bin/startup.sh
        sleep 1
        ;;
    windows)
        # Copy tools.jar to $TOMCAT_HOME/common/lib for JSPs (see bug 4560) -pk 
        jt=`cygpath "$JAVA_HOME\\lib\\tools.jar"`
	tt=`cygpath "$TOMCAT_HOME\\common\\lib\\tools.jar"`
        cp "$jt" "$tt"
        if [ $? != 0 ]; then exit 1; fi # fail prefetch if copy couldn't be done
        chmod 777 "$tt"

        # Install and start LPS
        build-tools/service.sh remove
        build-tools/service.sh install "-Xms128m -Xmx512m -DuseBogusErrorCode=true"
        net start LPS
        if [ $? != 0 ]; then exit 1; fi
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

paths=`${find} ${findwhere} ! -path 'docs/src/*' -name '*.lzx' | head ${head} | sort | sort -u`
for path in $paths; do
    if ! grep -q '<canvas' $path; then continue; fi
    output=`retry 5 '000)' curl -L -w"%{url_effective} (%{time_total}s, %{size_download}b, %{http_code})\n" \
        -s -o/dev/null "-HAccept-Encoding: gzip" \
        http://localhost:8080/$webapp/$path'?lzt=swf'`
    if echo $output | egrep -v "200\)$" > /dev/null 2>&1; then
        let rc1++
        echo "*** prefetch FAILED ***: $output"
    else
        echo "prefetch ok: $output"
    fi
done


# Only prefetch the jsps in the explorer and docs. We don't want
# to prefetch the admin console, because we don't want to
# do any admin to the server right here while we're prefetching.
paths=`${find} laszlo-explorer ! -path 'docs/src/*' -name '*.jsp'`
for p in $paths; do
    output2=`retry 5 '000)' curl -L -w"%{url_effective} (%{time_total}s, %{size_download}b, %{http_code})" \
        -s -o/dev/null http://localhost:8080/${webapp}/$p`
    if echo $output2 | egrep -v "200\)$" > /dev/null 2>&1; then
        let rc2++
        echo "*** prefetch FAILED ***: $p $output2"
    else
        echo "prefetch ok: $output2"
    fi
done


##--------------------------------------------------------------------------------
## So we don't ship large number of script cache keys in memory. We only care
## about components. See bug 4539.
##--------------------------------------------------------------------------------
# clear script cache 
echo "Clear script cache:"
curl -L -s "http://localhost:8080/${webapp}/foo.lzx?lzt=clearcache&cache=script"
curl -L -s "http://localhost:8080/${webapp}/foo.lzx?lzt=clearcache&cache=media"

# populate components script cache
lastlzx=laszlo-explorer/components/components.lzx
curl -L -w"prefetch scache: %{url_effective} (%{time_total}s, %{size_download}b, %{http_code})\n" \
        -s -o/dev/null "-HAccept-Encoding: gzip" \
        "http://localhost:8080/${webapp}/${lastlzx}?lzrecompile=true"

##--------------------------------------------------------------------------------
##--------------------------------------------------------------------------------


shopt -u expand_aliases
          
case "${build_os}" in
unix)
    ${prefetch_dir}/${tomcat}/bin/shutdown.sh
    ;;
windows)
    net stop LPS
    # why on earth would we remove a jar from tomcat now? [bshine 10.26.06] 
    # rm $TOMCAT_HOME/common/lib/tools.jar
    # if [ $? != 0 ]; then exit 1; fi # fail prefetch if rm couldn't be done
    ;;
esac

exit $(( rc1 + rc2 ))
