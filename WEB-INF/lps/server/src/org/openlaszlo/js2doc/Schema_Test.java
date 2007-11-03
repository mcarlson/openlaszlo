/* ****************************************************************************
 * Schema_Test.java
 *
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2007 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.js2doc;
import java.io.*;
import java.util.*;
import junit.framework.*;
import org.custommonkey.xmlunit.*;

public class Schema_Test extends XMLTestCase {

    public Schema_Test (String name) {
        super(name);
    }

    public void setUp () {
    }

    public void testSchema () {
        String[] tests = {
            // Each case is input, expected output
            // "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" is automatically prepended to input
            // output is "true"/"false" depending on whether fragment should validate
            
            "<js2doc/>", "true",
            
            "<js2doc></js2doc>", "true",

            "<js2doc><property id=\"foo\" name=\"foo\"><doc><text>this is the subject</text><tag name=\"field1\"><text>foo</text></tag></doc></property></js2doc>", "true",

            "<js2doc><property id=\"foo\" name=\"foo\"><doc><tag name=\"field1\"><text>foo</text></tag><text>this is the subject</text></doc></property></js2doc>", "true",

            "<js2doc><property id=\"foo\" name=\"foo\"><doc><tag name=\"field1\"><text>foo</text></tag><text>this <i>is</i> the subject</text></doc></property></js2doc>", "true",

            "<js2doc><property id=\"foo\" name=\"foo\" value=\"10\"/></js2doc>", "true",
            
            "<js2doc><property id=\"foo\" name=\"foo\"><object/></property></js2doc>", "true",
            
            "<js2doc><property id=\"foo\" name=\"foo\"><object><property id=\"bar\" name=\"bar\"/></object></property></js2doc>", "true",

            "<js2doc><property id=\"foo\" name=\"foo\"><function/></property></js2doc>", "true",

            "<js2doc><property id=\"foo\" name=\"foo\"><class><property id=\"bar\" name=\"bar\"><function/></property></class></property></js2doc>", "true",
        
            "<js2doc><unit path=\"foo\" id=\"foo\"/></js2doc>", "true",

            "<js2doc><unit path=\"foo/bar.js\" id=\"foo.bar.js\"/><property id=\"foo\" name=\"foo\" unitid=\"foo.bar.js\"/></js2doc>", "true",
            
        };
        
        for (Iterator iter = Arrays.asList(tests).iterator(); iter.hasNext();) {
            String source = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + (String) iter.next();
            assertTrue(iter.hasNext());
            String result = (String) iter.next();
            assertTrue(result == "true" || result == "false");
            boolean shouldPass = (result == "true") ? true : false;
        }            
    }   

}
