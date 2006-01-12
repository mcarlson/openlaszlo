Current tests:
Automated:
    alldata.lzx
    replup.lzx
    hardupate.lzx
    dollarpath.lzx
    xpath.lzx
    dollarpathquote.lzx
Hand:
    repldone.lzx
        Hit button. Should say "REPLICATION DONE" in debugger when everything
        comes up.
    datarepl.lzx
        Hit Datpath button -- should show 10, 2, 1 , 0 and then 10 views again
            expect to flicker without pooling turned on
        Delete last record (by clicking it)
            List shouldn't flicker
        Hit Pooling button 
            Should show same cycle, but now with no flickers
        Hit Order button a coupla times
            Should be sorted in various orders
            Delete some records -- make sure sort is still right
            
* T_LZ_COPYRIGHT_BEGIN ******************************************************
* Copyright 2001-2005 Laszlo Systems, Inc.  All Rights Reserved.            *
* Use is subject to license terms.                                          *
* T_LZ_COPYRIGHT_END ********************************************************
