#!/bin/bash
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004, 2008 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************
export CLASSPATH=$LPS_HOME/WEB-INF/classes
version=`sed -n -e '/version.id *=/s/.*= *\(.*\)$/\1/p' < $LPS_HOME/build.properties`
for jar in \
    $LPS_HOME/WEB-INF/lib/xmlrpc-1.2-b1.jar\
    $LPS_HOME/WEB-INF/lib/lps-${version}.jar;
  do
  if [[ $OS == "Windows_NT" ]]; then
      CLASSPATH=${CLASSPATH}\;$jar
  else
      CLASSPATH=${CLASSPATH}:$jar
  fi
done

# SystemProp uses port 8181
$JAVA_HOME/bin/java org.openlaszlo.test.xmlrpc.Ghost
