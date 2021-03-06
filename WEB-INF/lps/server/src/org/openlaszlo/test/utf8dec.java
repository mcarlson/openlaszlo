/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.test;

import java.net.*;
import java.io.*;

public class utf8dec {
    public static void main(String[] args) throws IOException {

        ByteArrayOutputStream buf = new ByteArrayOutputStream();

        for (int i = 0; i < args.length; i++) {
            String b = args[i];
           buf.write(Integer.parseInt(b, 16));
        }

        String out = new String(buf.toByteArray(), "UTF8");
        for (int i = 0; i < out.length(); i++) {
            System.out.print("&#"+((int) out.charAt(i))+"; ");
        }

        System.out.println("");
        for (int i = 0; i < out.length(); i++) {
            System.out.print("0x"+Integer.toHexString(out.charAt(i))+" ");
        }
    }
        

}
