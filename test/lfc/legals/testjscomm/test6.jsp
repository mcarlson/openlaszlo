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
        lzOptions = { ServerRoot: '<%= request.getContextPath() %>' };
        </script><script type="text/javascript" src="<%= request.getContextPath() %>/lps/includes/embed-compressed.js"></script><script src="test.js"></script></head>
   <body><script type="text/javascript">
              Lz.swfEmbed({url: 'copy-of-hello.lzx?lzt=swf&lzr=swf7', bgcolor: '#ffffff', width: '100%', height: '200', id: 'lzappa', accessible: 'false'});
              Lz.swfEmbed({url: 'copy-of-hello.lzx?lzt=swf&lzr=swf7', bgcolor: '#ffffff', width: '100%', height: '200', id: 'lzappb', accessible: 'false'});

              Lz.lzappa.onload = function loaded(app) {
                simulateTyping();
                getSet(app, 'foo');
                testMethodCalls(app);
              }

              Lz.lzappb.onload = function loaded(app) {
                testMethodCalls(app);
                getSet(app, 'foo');
              }
      </script><noscript>
         Please enable JavaScript in order to use this application.
      </noscript>
      <form>
        <input type="text" name="txt" style="width: 100%" onkeydown="Lz.setCanvasAttribute('mytext', this.value)" onkeyup="Lz.setCanvasAttribute('mytext', this.value);" value="Change me to change the swf above"/>
        <input type="button" onclick="this.form.txt.value = Lz.lzappb.getCanvasAttribute('mytext');" value="Get Text from flash"/>
        <input type="button" onclick="alert(Lz.lzappb.getCanvasAttribute('width'))" value="Get Canvas Width"/>
        <input type="button" onclick="alert(Lz.lzappb.getCanvasAttribute('height'))" value="Get Canvas Height"/>
        <input type="button" onclick="Lz.lzappb.setCanvasAttribute('foo', 'bar'); Lz.lzappb.setCanvasAttribute('farb', 'baz')" value="set canvas attributes"/>
        <input type="button" onclick="Lz.setCanvasAttribute('foo', 'Broadcast'); Lz.setCanvasAttribute('farb', 'Broadcast')" value="Broadcast canvas attributes"/>
      </form>
   </body>
</html>
