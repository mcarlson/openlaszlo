# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

all: dtd doc

validate:
	jing -ci lzx.rnc ../examples/*.lzx ../examples/contacts/src/*.lzx

doc: lzx-reference.html
html: lzx-reference.html

lzx.rng: lzx.rnc
	java -cp "$(ANT_HOME)/lib/trang.jar;CLASSPATH" com.thaiopensource.relaxng.output.Driver lzx.rnc lzx.rng

lzxdoc.rng: lzxdoc.rnc
	java -cp "$(ANT_HOME)/lib/trang.jar;CLASSPATH" com.thaiopensource.relaxng.output.Driver lzxdoc.rnc lzxdoc.rng

lzx-reference.html: rng2dtd.py rngdoc.py lzxdoc.rng
	python rngdoc.py lzxdoc.rng lzx-reference.html

dtd: rng2dtd.py lzxdoc.rng
	python rng2dtd.py lzxdoc.rng
