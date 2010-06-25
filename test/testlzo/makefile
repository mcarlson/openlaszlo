#
#* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.              *
#* Use is subject to license terms.                                            *
#

LZC="${LPS_HOME}/WEB-INF/lps/server/bin/lzc"
all:
	## test compiling a swf10 lib which references external classes from a non-lzo library
	${LZC} -c --runtime=swf10,dhtml libdir/libwithbutton.lzx
	${LZC} --runtime=swf10 mainwithbutton.lzx
	## test filename with dash in it
	${LZC} -c --runtime=swf10,dhtml libglobal-dash.lzx 
	${LZC} -c --runtime=swf10,dhtml extclass.lzx 
	${LZC} -c --runtime=swf10,dhtml libdir/lib1.lzx
	## test compiling a swf10 lzo which subclasses something from an external lzo library
	${LZC} -c --runtime=swf10,dhtml --lzolibs extclass.lzo libdir/lib2.lzx
	${LZC} --runtime=swf10 main.lzx
	${LZC} --runtime=dhtml main.lzx



lzs:
	${LZC} -c --runtime=swf8 libglobal-dash.lzx 
	${LZC} -c --runtime=swf8 extclass.lzx 
	${LZC} -c --runtime=swf8 libdir/lib1.lzx
	## test compiling a swf10 lzo which subclasses something from an external lzo library
	${LZC} -c --runtime=swf8 --lzolibs extclass.lzo libdir/lib2.lzx


debug:
	${LZC} -c -g1 --runtime=swf10,dhtml libdir/libwithbutton.lzx
	${LZC} -g1 --runtime=swf10 mainwithbutton.lzx
	## test filename with dash in it	${LZC} -c -g1 --runtime=swf10,dhtml libglobal-dash.lzx 
	${LZC} -c -g1 --runtime=swf10,dhtml extclass.lzx 
	${LZC} -c -g1 --runtime=swf10,dhtml libdir/lib1.lzx
	## test compiling a swf10 lzo which subclasses something from an external lzo library
	${LZC} -c -g1 --runtime=swf10,dhtml --lzolibs extclass.lzo libdir/lib2.lzx
#	${LZC} --runtime=swf10 main.lzx
#	${LZC} --runtime=dhtml main.lzx


clean:
	find . -name "*.lzo" | xargs rm
