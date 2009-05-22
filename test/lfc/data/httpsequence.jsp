<%@ page import="java.util.*" %><%@ page import="java.io.*" %><%@ page contentType="text/xml; charset=UTF-8" %><?xml version='1.0' encoding='UTF-8' standalone='yes' ?><%@ page isThreadSafe="false" %>
<response><%

/* X_LZ_COPYRIGHT_BEGIN ***************************************************
* Copyright 2001-2004, 2009 Laszlo Systems, Inc.  All Rights Reserved.        *
* Use is subject to license terms.                                            *
* X_LZ_COPYRIGHT_END ******************************************************   */

    String tmpdir = System.getProperty("java.io.tmpdir");
    String fname = "_httpsequence.log";
    long count = -1;

    File f = new File(tmpdir, fname);
    if (! f.exists()) {
        count = 0;
        f.createNewFile();
        f.deleteOnExit();
    } else {
        BufferedReader reader = new BufferedReader(new FileReader(f));
        String data = reader.readLine();
        reader.close();
        try {
            count = Long.parseLong(data);
        } catch (NumberFormatException e) {
            out.println("error parsing number " + data);
        }
    }

    out.write(Long.toString(count));

    BufferedWriter writer = new BufferedWriter(new FileWriter(f));
    writer.write(Long.toString(count + 1));
    writer.newLine();
    writer.flush();
    writer.close();

%></response>
