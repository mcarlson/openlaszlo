#!/bin/sh

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

XML_COPYRIGHT='<!-- LZ_COPYRIGHT_BEGIN -->
<!--=======================================================================-->
<!-- Copyright (c) 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.    -->
<!-- Use is subject to license terms                                       -->
<!--=======================================================================-->
<!-- LZ_COPYRIGHT_END -->
'

C_COPYRIGHT='/* LZ_COPYRIGHT_BEGIN */
/****************************************************************************
 * Copyright (c) 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.       *
 * Use is subject to license terms                                          *
 ****************************************************************************/
/* LZ_COPYRIGHT_END */
'

PY_COPYRIGHT='# LZ_COPYRIGHT_BEGIN
#############################################################################
## Copyright (c) 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.       #
## Use is subject to license terms                                          #
#############################################################################
# LZ_COPYRIGHT_END
'
tail=${0##*/}
head=${0%${tail}}

echo "head: $head"

export NEW_COPYRIGHT="${C_COPYRIGHT}" 
find  ${*:-.} \( -name '*.as' -o -name '*.js' -o -name '*.java' -o -name '*.jsp' \) -print0 | xargs -0 ${head}/replace.pl 

export NEW_COPYRIGHT="${XML_COPYRIGHT}" 
find  ${*:-.} \( -name '*.xml' -o -name '*.html' -o -name '*.lzx' \) -print0 | xargs -0 ${head}/replace.pl 

export NEW_COPYRIGHT="${PY_COPYRIGHT}" 
find  ${*:-.} \( -name '*.py' \) -print0 | xargs -0 ${head}/replace.pl 
