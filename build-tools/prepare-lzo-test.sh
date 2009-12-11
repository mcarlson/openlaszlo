#!/bin/bash

runtime=${1:-"dhtml"}

################################################################
# prepare binary library test case
#
# usage:
# prepare-lzo-test.sh <RUNTIME>
#
# + binary compile lzo-lib.lzx
# + rename lzo-lib.lzx to make sure it is out of the way
# 

TESTDIR=test/lztest
rm -f $TESTDIR/lzo-lib.lzo
cp $TESTDIR/lzo-lib.lzx.proto $TESTDIR/lzo-lib.lzx
# compile that file with lzc
$LPS_HOME/WEB-INF/lps/server/bin/lzc --runtime=$runtime -c $TESTDIR/lzo-lib.lzx
rm -f $TESTDIR/lzo-lib.lzx
################################################################


# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2009 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************
