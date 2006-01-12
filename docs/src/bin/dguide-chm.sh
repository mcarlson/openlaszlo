# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************
cd chm
java -cp "../../../WEB-INF/lib/saxon-6.5.3-lz-p1.jar;../../../3rd-party/jars/dev/xercesImpl.jar" \
    -Djavax.xml.parsers.DocumentBuilderFactory=org.apache.xerces.jaxp.DocumentBuilderFactoryImpl \
    -Djavax.xml.parsers.SAXParserFactory=org.apache.xerces.jaxp.SAXParserFactoryImpl \
    -Dorg.apache.xerces.xni.parser.XMLParserConfiguration=org.apache.xerces.parsers.XIncludeParserConfiguration \
    com.icl.saxon.StyleSheet \
    -o dguide.chm  \
    ../build/dguide/index.dbk  \
    ../xsl/dguide-chm.xsl \
    base.dir=chm
"c:/program files/html help workshop/hhc" htmlhelp.hhp
