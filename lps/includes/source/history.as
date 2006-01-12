//* A_LZ_COPYRIGHT_BEGIN ******************************************************
//* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
//* Use is subject to license terms.                                          *
//* A_LZ_COPYRIGHT_END ********************************************************
outgoing_lc  = new LocalConnection();
if (_root.__lzevent != null) {
    outgoing_lc.send(_root.__lzhistconn, "receiveEvent", _root.n, _root.v);
} else {
    outgoing_lc.send(_root.__lzhistconn, "receiveHistory", _root.h);
}
