#!/bin/bash
# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

# This test case will fail for Mozilla based browsers (not Netscape 4.7 though)
# with Flash Players versions below 6.47

webapp=lps
if [ $# == 1 ]; then
    webapp=$1
fi

echo "------------------------------------------------------------"
echo "Using webapp $webapp"
echo "------------------------------------------------------------"

encoded_webapp=`echo $webapp | sed 's/-/%2D/g'`

## create data file
echo -n "cache=false&sendheaders=false&reqtype=POST&ccache=false&lzt=data&url=http%3A%2F%2Flocalhost%3A8080%2F${encoded_webapp}%2Ftest%2Fdata%2Fecho%2Ejsp" > data

## append null character to data file
cat nullchar >> data

## get content length (minus the null character)
length=`wc -c data | awk '{print $1}'`
(( length-- ))

## second POST will fail (HTTP response of "501 Method ...")
curl -i --data-binary @data --header "Content-Length: $length" --header "Content-type: application/x-www-form-urlencoded" http://localhost:8080/lps-components/test/data/data.lzx http://localhost:8080/lps-components/test/data/data.lzx http://localhost:8080/lps-components/test/data/data.lzx
