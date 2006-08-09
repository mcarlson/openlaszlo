@ECHO OFF
REM
REM lzc.bat - Bash script to run laszlo compiler.
REM
REM * R_LZ_COPYRIGHT_BEGIN ***************************************************
REM * Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.         *
REM * Use is subject to license terms.                                       *
REM * R_LZ_COPYRIGHT_END *****************************************************

call "%LPS_HOME%\WEB-INF\lps\server\bin\lzenv.bat"
@echo on

"%JAVA_HOME%\bin\java" %JAVA_OPTS% "-Djava.ext.dirs=%JAVAEXTDIRS%" "-DLPS_HOME=%LPS_HOME%" org.openlaszlo.compiler.Main %1 %2 %3 %4 %5 %6 %7 %8 %9
