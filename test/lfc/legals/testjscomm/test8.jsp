<!DOCTYPE html
  PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
   
      <link rel="SHORTCUT ICON" href="http://www.laszlosystems.com/favicon.ico">
      <title>OpenLaszlo Application</title><script type="text/javascript">
//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************
        </script><script type="text/javascript" src="<%= request.getContextPath() %>/lps/includes/embed-compressed.js"></script><script src="test.js"></script></head>
   <body><script type="text/javascript">
              lz.embed.swf({url: 'copy-of-hello.lzx?lzt=swf&lzr=swf8', bgcolor: '#ffffff', width: '100%', height: '200', id: 'lzappa', accessible: 'false'});
              lz.embed.swf({url: 'copy-of-hello.lzx?lzt=swf&lzr=swf8', bgcolor: '#ffffff', width: '100%', height: '200', id: 'lzappb', accessible: 'false'});

              lz.embed.lzappa.onload = function loaded(app) {
                simulateTyping();
                getSet(app, 'foo');
                testMethodCalls(app);
              }

              lz.embed.lzappb.onload = function loaded(app) {
                testMethodCalls(app);
                getSet(app, 'foo');

              }
            </script><noscript>
         Please enable JavaScript in order to use this application.
      </noscript>
      <form>
        <input type="text" name="txt" style="width: 100%" onkeydown="lz.embed.setCanvasAttribute('mytext', this.value)" onkeyup="lz.embed.setCanvasAttribute('mytext', this.value);" value="Change me to change the swf above"/>
        <input type="button" onclick="this.form.txt.value = lz.embed.lzappb.getCanvasAttribute('mytext');" value="Get Text from flash"/>
        <input type="button" onclick="alert(lz.embed.lzappb.getCanvasAttribute('width'))" value="Get Canvas Width"/>
        <input type="button" onclick="alert(lz.embed.lzappb.getCanvasAttribute('height'))" value="Get Canvas Height"/>
        <input type="button" onclick="lz.embed.lzappb.setCanvasAttribute('foo', 'bar'); lz.embed.lzappb.setCanvasAttribute('farb', 'baz')" value="set canvas attributes"/>
        <input type="button" onclick="lz.embed.setCanvasAttribute('foo', 'Broadcast'); lz.embed.setCanvasAttribute('farb', 'Broadcast')" value="Broadcast canvas attributes"/>
      </form>
   </body>
</html>
