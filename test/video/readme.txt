Copyright 2006 Laszlo Systems, Inc.  All Rights Reserved.
Use is subject to license terms.

Setting up video cameras and servers for OpenLaszlo.

Flash Media Server 2

  Install the Flash Media Server in:
  C:\Program Files\Macromedia\Flash Media Server 2\
  
  Create the test application directy and subdirectories:
  C:\Program Files\Macromedia\Flash Media Server 2\applications\test
  C:\Program Files\Macromedia\Flash Media Server 2\applications\test\streams
  C:\Program Files\Macromedia\Flash Media Server 2\applications\test\streams\instance1
  
  Copy the flash video test files into the test\streams\instance1 directory, from:
  $LZ_HOME/test/video/videos/*.flv

  If the media server fails to start on Windows, check to make sure
  that Emacs or another text editor did not change the ownership and
  permission of the configuration files. I had to chmod a+r some of
  the Flash Media Server xml configuration files I edited with Emacs,
  because the Flash server (which ran as another user) could not read
  them and would not start.

  If the media server fails to work on Linux, make sure that you have
  the shared libraries from Firefox installed in /usr/lib. If you're
  missing the libraries, the server will run and appear to be working,
  and the admin interface actually will work, but none of the
  streaming video stuff works. When you run the flash server startup
  command ("./server start"), it will complain about missing
  libraries. Just download firefox and copy all its shared libraries
  to /usr/lib.

  http://livedocs.macromedia.com/fms/2/docs/wwhelp/wwhimpl/common/html/wwhelp.htm?context=LiveDocs_Parts&file=00000009.html

Red5

  Red5 setup instructions: TBD

Installing Logitech QuickCam software
  
  There is a QuickCam "Logitech Process Monitor" server (LvPrcSrv.exe)
  that interferes with Cygwin, the one that substitutes computer
  generated characters for the video stream, who track your motion and
  facial expressions. It causes cygwin to fail forking new
  processes. This manifests itself by build processes mysteriously
  failing, and Emacs having problem forking sub-processes in dired and
  shell windows. You have to disable the server to make Cygwin work
  again.

  http://blog.gmane.org/gmane.os.cygwin.talk
  http://www.cygwin.com/ml/cygwin/2006-06/msg00641.html
