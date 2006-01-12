@echo off
REM * R_LZ_COPYRIGHT_BEGIN ***************************************************
REM * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.         *
REM * Use is subject to license terms.                                       *
REM * R_LZ_COPYRIGHT_END *****************************************************
rem Sample command line to run swapjvm.pl

pushd %~dp0
perl swapjvm.pl -home .. -jvm-dir c:/JVM
popd
