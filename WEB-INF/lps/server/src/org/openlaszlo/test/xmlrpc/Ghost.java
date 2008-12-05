/******************************************************************************
 * SystemProp.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004, 2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.test.xmlrpc;

import org.apache.xmlrpc.*;
import java.util.*;

public class Ghost
{
    public String testClass(String string, String timeOut, boolean flag) { 
        System.out.println("flag: " + flag); 
        return string; 
    } 

        public static Hashtable getProperties()
        {
                return System.getProperties();
        }

    public static void main(String argv[])
    {
        WebServer ws = new WebServer(8181);
        Ghost se = new Ghost();
        ws.addHandler("localservice", se);
        ws.start();
    }
}
