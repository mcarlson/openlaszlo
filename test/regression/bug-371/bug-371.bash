#! /bin/bash -f
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************
if [ "${OS}" == Windows_NT ];  then
    . ${LPS_HOME}\\server\\bin\\lzenv
else
    . ${LPS_HOME}/server/bin/lzenv
fi

# These work:
#C:/jdk1.3.1_04/bin/java -server -DLPS_HOME=${LPS_HOME} -cp "$LZCP" org.openlaszlo.compiler.Main ch.lzx
#C:/j2sdk1.4.1_01/bin/java -server -DLPS_HOME=${LPS_HOME} -cp "$LZCP" org.openlaszlo.compiler.Main ch.lzx
#C:/j2sdk1.4.0_02/bin/java -DLPS_HOME=${LPS_HOME} -cp "$LZCP" org.openlaszlo.compiler.Main ch.lzx

# These fail:
# src/org/openlaszlo.compiler/Main needs to be modified to call
# lzc three times to reproduce this.
C:/j2sdk1.4.0_02/bin/java -server -DLPS_HOME=${LPS_HOME} -cp "$LZCP" org.openlaszlo.compiler.Main bug-371.lzx
