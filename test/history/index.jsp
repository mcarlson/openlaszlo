<!DOCTYPE html
  PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
   <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/favicon.ico"><title>History</title><script type="text/javascript">
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
            })(null, null);
          }
        </script><script type="text/javascript" src="<%= request.getContextPath() %>/lps/includes/embed-compressed.js"></script><script type="text/javascript">
lz.embed.lfc('<%= request.getContextPath() %>/lps/includes/lfc/LFCdhtml.js', '<%= request.getContextPath() %>/');
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
        	body {
                background-color: #ffffff;
            }
        	
        	img { border: 0 none; }
        </style></head><body><div>
<form>
    <input type="button" value="0" onclick="lz.embed.setCanvasAttribute('foo', 0)">
    <input type="button" value="1" onclick="lz.embed.setCanvasAttribute('foo', 1)">
    <input type="button" value="0 hist" onclick="lz.embed.setCanvasAttribute('foo', 0, true)">
    <input type="button" value="1 hist" onclick="lz.embed.setCanvasAttribute('foo', 1, true)">
    <input type="button" value="foo and bar" onclick="lz.embed.setCanvasAttribute({foo: 'foo', bar: 'bar'}, null, true)">
</form>
</div> 
        <script type="text/javascript">
              lz.embed.swf({url: 'history.lzx?lzt=swf&debug=true', bgcolor: '#ffffff', width: '100%', height: '200', id: 'lzswf8', accessible: 'false', history: true});
        </script>
        <script type="text/javascript">
              lz.embed.swf({url: 'history.lzx?lzt=swf&lzr=swf9&debug=true', bgcolor: '#ffffff', width: '100%', height: '200', id: 'lzswf9', accessible: 'false', history: true});
            </script>
        <script type="text/javascript">
              lz.embed.dhtml({url: 'history.lzx?lzt=object&lzr=dhtml', bgcolor: '#ffffff', width: '100%', height: '200', id: 'lzdhtml', history: true});
        </script>
        <noscript>
            Please enable JavaScript in order to use this application.
        </noscript>
<!-- * X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ****************************************************** -->
</body>
</html>
