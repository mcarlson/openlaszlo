/* X_LZ_COPYRIGHT_BEGIN ****************************************************
 * Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.               *
 * Use is subject to license terms.                                        *
 * X_LZ_COPYRIGHT_END ******************************************************/


README.txt explaining OpenLaszlo videolibrary demo:


This demo requires that you have either the Flash Media Server or the
Red5 server installed in a directory whose name does not contain
spaces, and the "videolibrary.jsp" file must be configured with the
path and url pointing to the content.

To run this videolibrary demo, you must configure the "videolibrary.jsp"
script to tell it where the Flash Media Server or Red5 application 
streams directory is on disk, and what its URL is. 

In the file "videolibrary.jsp", configure the path in
"libraryDirectory" and the url in "libraryUrl".  

If you are running the server on Windows, make sure the file name is
in the correct Windows format. Note that you must install the Flash
Media Server or Red5 application directory in a path that has no space
(so "Program Files" is right out).


    // This is the RTMP server's directory containing the 
    // FLV video files. 
    public String libraryDirectory =
        //"/usr/local/src/red5/webapps/test/instance1/streams/";
        "/home/fms/applications/test/streams/instance1/";

    // This is the URL to the RTMP server publishing the library.
    // You should also configure the src attribute of the rtmpconnection 
    // in videolibrary.lzx to be the same url.
    public String libraryUrl =
        "rtmp://localhost/test/instance1/";


You may enhance the viewing experience by creating files with metadata
in the library directory, that have the same base name as the ".flv"
videos, but with the suffix ".meta". The metadata filse should contain
a list of "key:value" pairs, one on each line. The keys supported are
"title" (the title of the video), "description" (the description of
the video), and "thumbnailtime" (the time in seconds into the video to
display as the thumbnail). For example, the file "good-dog.meta" could
contain:

title:Good Dog
description:You're a very good dog!
thumbnailtime:6
