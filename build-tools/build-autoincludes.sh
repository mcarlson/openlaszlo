#! /bin/bash -f
#
#  lzc -  Bash script to run laszlo compiler.
#
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2005, 2007, 2008, 2009 Laszlo Systems, Inc.  All Rights Reserved.      *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

if [ "${OS}" == Windows_NT ];  then
  export LPS_HOME=`cygpath -w $LPS_HOME`
    . ${LPS_HOME}\\WEB-INF\\lps\\server\\bin\\lzenv
else
  export LPS_HOME
  echo   "${LPS_HOME}/WEB-INF/lps/server/bin/lzenv"
  . "${LPS_HOME}/WEB-INF/lps/server/bin/lzenv"
fi

(cd ${LPS_HOME}/lps/components; find . -name '*.lzx' -not -path '*/incubator/*' \
                                      -not -path '*/queens-charts/*' \
                                      -not -path '*/utils/performance/*' \
                                      -not -path '*/utils/diagnostic/inspector/*' \
                                      -not -path '*/debugger/*' \
                                      -not -path '*/lzunit/*' \
                                      -print | \
"${JAVA_HOME}/bin/java" ${JAVA_OPTS} -DLPS_HOME="${LPS_HOME}" -cp "$LZCP" org.openlaszlo.utils.BuildAutoincludes "$@" 
)


