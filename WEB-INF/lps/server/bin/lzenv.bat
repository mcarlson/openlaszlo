@ECHO OFF
REM
REM lzenv.bat - script to set up laszlo env vars
REM
REM * R_LZ_COPYRIGHT_BEGIN ***************************************************
REM * Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.         *
REM * Use is subject to license terms.                                       *
REM * R_LZ_COPYRIGHT_END *****************************************************

set JAVAEXTDIRS=%LPS_HOME%\WEB-INF\lps\server\build;%LPS_HOME%\3rd-party\jars\dev;%LPS_HOME%\WEB-INF\lib;%ANT_HOME%\lib;%LPS_HOME%\WEB-INF\classes
