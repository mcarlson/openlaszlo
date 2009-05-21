<%@ page import="java.util.*" %><%@ page import="java.io.*" %><%@ page contentType="text/xml; charset=UTF-8" %><?xml version='1.0' encoding='UTF-8' standalone='yes' ?><%@ page isThreadSafe="false" %>
<response><%

/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004, 2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ******************************************************   */


    String fname = "/tmp/_httpsequence.log";
    FileReader inf;
    try {
        inf = new FileReader(fname);
    } catch (FileNotFoundException e) {
        FileWriter fw = new FileWriter(fname);
        fw.write("0\n");
        fw.close();
        inf = new FileReader(fname);
    }
    BufferedReader bin = new BufferedReader(inf);
    String data = bin.readLine();
    
    long count  = -1;
try {
    count = Long.parseLong(data);
} catch (NumberFormatException e) {
    out.println("error parsing number "+data);
}
out.write(""+count);
    PrintWriter outf = new PrintWriter(new FileWriter(fname));
    outf.println(count+1);
    outf.flush();
    outf.close();    



%></response>
