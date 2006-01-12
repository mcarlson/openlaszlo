#!/bin/bash
#
# Rewritten script to start NT Service 
# Options
# install                Install the service using LPS as service name.
#                        Service is installed using default settings.
# remove                 Remove the service from the System.
#
# All other command line args are assumed to be extra java args.
# ---------------------------------------------------------------------------

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

# Guess CATALINA_HOME if not defined
CATALINA_HOME=`cygpath -w "${TOMCAT_HOME}"`
CATALINA_BASE="${CATALINA_HOME}"
EXE="${CATALINA_HOME}\\bin\\tomcat5.exe"
CYGEXE=`cygpath -u "${EXE}"`

# Set default Service name
export SERVICE_NAME=LPS

if [ "$1" == "" ] ; then
    echo "Usage:  service.sh install/remove [java args]"
    exit
fi

if [ "$1" == "install" ] ; then
    echo Installing LPS Service
fi

if [ "$1" == "remove" ] ; then
    if [ $? == 0 ] ; then 
        "$CYGEXE" //DS//$SERVICE_NAME
        if [ $? == 0 ] ; then 
            echo The service \'$SERVICE_NAME\' has been removed.
        else
            echo Removal of service \'$SERVICE_NAME\' failed: $?
        fi
    else
        echo The service \'$SERVICE_NAME\' was not installed.
    fi
    exit
fi

# Install the service
# Use the environment variables as an exaple
# Each command line option is prefixed with PR_
export PR_DISPLAYNAME=LPS
export PR_DESCRIPTION="Laszlo Presentation Server"
export PR_INSTALL=$EXE
export PR_LOGPATH=$CATALINA_HOME\\logs
export PR_CLASSPATH=$CATALINA_HOME\\bin\\bootstrap.jar
echo "Installing service with JAVA_HOME=$JAVA_HOME"
"$CYGEXE" //IS//$SERVICE_NAME --Jvm "$JAVA_HOME\\jre\\bin\\server\\jvm.dll" \
         --StartClass org.apache.catalina.startup.Bootstrap \
         --StopClass org.apache.catalina.startup.Bootstrap \
         --StartParams start --StopParams stop
# Set extra parameters
params=`echo $2 | sed -e 's/ /;/g'`
"$CYGEXE" //US//$SERVICE_NAME --JvmOptions "-Dcatalina.base=$CATALINA_BASE;-Dcatalina.home=$CATALINA_HOME;-Djava.endorsed.dirs=$CATALINA_HOME\\common\\endorsed;$params" \
          --StartMode jvm \
          --StopMode jvm
# More extra parameters
export PR_STDOUTPUT=$CATALINA_HOME\\logs\\stdout.log
export PR_STDERROR=$CATALINA_HOME\\logs\\stderr.log
"$CYGEXE" //US//$SERVICE_NAME ++JvmOptions "-Djava.io.tmpdir=$CATALINA_BASE\\temp"
if [ $? == 0 ] ; then 
    echo The service \'$SERVICE_NAME\' has been installed.
    exit 0
else
    echo Installation of service \'$SERVICE_NAME\' failed: $?
    exit 1
fi
