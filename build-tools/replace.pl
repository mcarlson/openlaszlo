#!/usr/bin/perl -ni~

# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************

if (/LZ_[^_]*_COPYRIGHT_BEGIN/) {
    $action = 'skip';
}
elsif (/LZ_[^_]*_COPYRIGHT_END/) {
    print $ENV{"NEW_COPYRIGHT"};
    $action = 'print';
}
elsif ($action =~ 'skip') {
} else {
    print $_;
}
next;


