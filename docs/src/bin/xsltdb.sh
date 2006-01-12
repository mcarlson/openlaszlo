# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************
xsltproc  \
    --xinclude \
    --output ../dguide/index.html  \
    --stringparam use.id.as.filename 1  \
    --stringparam base.dir ../dguide/  \
    --stringparam chunk.fast 1  \
    --stringparam draft.mode yes  \
    docbook-xsl/html/chunk.xsl  \
    dbk/index.dbk
