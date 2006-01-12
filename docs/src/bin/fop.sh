# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************
java -cp "lib/fop.jar;../../WEB-INF/lib/xerces.jar;lib/batik.jar;lib/avalon-framework-cvs-20020806.jar" \
    -Xmx384M \
    org.apache.fop.apps.Fop  \
    -fo dguide.fo  \
    -pdf dguide.pdf 
