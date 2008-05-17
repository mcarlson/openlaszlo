<!DOCTYPE html
  PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/favicon.ico"><title>OpenLaszlo Application</title><script type="text/javascript">
          // If loaded bare into a browser, set the browser size to the canvas size
          if (window === top) {
            (function (width, height) {
              // Cf. http://www.quirksmode.org/viewport/compatibility.html
              if (window.innerHeight) {
                // Sadly, innerHeight/Width is not r/w on some browsers, and resizeTo is for outerHeight/Width
                window.resizeTo(width ? (width + window.outerWidth - window.innerWidth) : window.outerWidth,
                                height ? (height + window.outerHeight - window.innerHeight) : window.outerHeight);
              } else if (document.documentElement && document.documentElement.clientHeight) {
                if (width) {
                  document.documentElement.clientWidth = width;
                }
                if (height) {
                  document.documentElement.clientHeight = height;
                }
              } else {
                if (width) {
                  document.body.clientWidth = width;
                }
                if (height) {
                  document.body.clientHeight = height;
                }
              }
            })(640, 140);
          }
        </script><script type="text/javascript">
            lzOptions = { ServerRoot: '<%= request.getContextPath() %>'};
        </script><script type="text/javascript" src="<%= request.getContextPath() %>/lps/includes/embed-compressed.js"></script><script type="text/javascript">
              Lz.dhtmlEmbedLFC('<%= request.getContextPath() %>/lps/includes/lfc/LFCdhtml.js');
            </script><style type="text/css">
        	html, body
        	{
        		/* http://www.quirksmode.org/css/100percheight.html */
        		height: 100%;
        		/* prevent scrollbars */
        		margin: 0;
        		padding: 0;
        		border: 0 none;
        		overflow: hidden;
        	}
        	img { border: 0 none; }
        </style></head><body>
        <div id="lzsplash" style="z-index: 10000000; top: 0; left: 0; width: 640px; height: 140px; position: fixed; display: table"><p style="display: table-cell; vertical-align: middle;"><img src="<%= request.getContextPath() %>/lps/includes/spinner.gif" style="display: block; margin: 20% auto"></p></div><div id="lzdhtmlappdiv" style="position: absolute;"></div><script type="text/javascript">
              Lz.swfEmbed({url: 'audiokernel.lzx?lzt=swf', bgcolor: '#eaeaea', width: '0', height: '0', id: 'audiokernel'});
              Lz.dhtmlEmbed({url: 'main.lzx?lzt=object&lzr=dhtml&_canvas_debug=false', bgcolor: '#ffffff', width: '100%', height: '150', id: 'lzdhtmlapp'});

              Lz.lzdhtmlapp.onload = function loaded() {
                var s = document.getElementById('lzsplash');
                if (s) LzSprite.prototype.__discardElement(s);
              }
              function setCanAttr(n, v) {
                Lz.lzdhtmlapp.canvas.setAttr(n, v);
              }
            </script><noscript>
         Please enable JavaScript in order to use this application.
      </noscript>
   </body>
</html>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
<!-- @LZX_VERSION@                                                         -->
