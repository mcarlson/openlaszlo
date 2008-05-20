The original version of lzproject can be found here: 
     http://labs.openlaszlo.org/lzproject 

LZProject has been integrated into the source tree and most code still
resides under /demos/lzproject. The lzproject demo requires no special
build step before it can be used.

These files reside outside the /demos/lzproject directory:

  /WEB-INF/taglibs-i18n.tld        Internationalization
  /WEB-INF/web.xml                 Modified to map lzproject servlet
  /WEB-INF/lib/derby.jar           Apache Derby database
  /WEB-INF/lib/derbytools.jar      Apache Derby database
  /WEB-INF/lib/taglibs-i18n.jar    Internationalization
  /WEB-INF/lib/lzproject.jar       lzproject servlet 


/WEB-INF/lib/lzproject.jar can be rebuilt if changes are made to the java sources (see /demos/lzproject/java-source). To rebuild the jar file,

  cd demos/lzproject    (from top of tree)
  ant build

Don't forget to check in /WEB-INF/lib/lzproject.jar once the jar file is 
built and tested.


The javadocs can be rebuilt using,

  cd demos/lzproject    (from top of tree)
  ant javadoc

  This places the javadoc in /demos/lzproject/temp/lzproject/javadocs. Move
  these files to /demos/lzproject/lzx/lzproject/javadocs and check them in.




* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.         *
* Use is subject to license terms.                                       *
* X_LZ_COPYRIGHT_END *****************************************************