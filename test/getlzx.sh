# * P_LZ_COPYRIGHT_BEGIN ******************************************************
# * Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.            *
# * Use is subject to license terms.                                          *
# * P_LZ_COPYRIGHT_END ********************************************************
cd .. 
find -name *.lzx -exec grep -l \<canvas {} \; | sed 's/^./"/;s/$/",/' > s1.txt
find -name *.lzo | sed 's/^./"/;s/$/",/' >> s1.txt
sort s1.txt  >test/all_lzx.txt
echo '<tests>' >test/all_lzx.xml
cat test/all_lzx.txt | sed  's/^"/  <test src="/;s/,/\/>/' >> test/all_lzx.xml
echo '</tests>' >> test/all_lzx.xml
rm s1.txt

