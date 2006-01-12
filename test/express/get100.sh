#!/bin/bash
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************
for (( i=0 ; i!=101 ; i++ )) ; 
  do 
    wget --no-http-keep-alive --cookies=on http://delenn:8080/lps-1.0.1/examples/hello.lzx\?lzt=swf; 
  done
