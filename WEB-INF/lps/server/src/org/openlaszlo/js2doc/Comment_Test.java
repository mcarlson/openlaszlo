/* ****************************************************************************
 * Comment_Test.java
 *
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2006-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.js2doc;

import junit.framework.*;
import java.util.*;
import java.util.regex.*;
import javax.xml.parsers.DocumentBuilder; 
import javax.xml.parsers.DocumentBuilderFactory;  
import org.custommonkey.xmlunit.*;
import org.w3c.dom.*;

public class Comment_Test extends XMLTestCase {

    public void testCommentScanner () {
        String[] tests = {
        
            "// nope", "0",
            
            "// nope\n// no2", "0",
            
            "/* c1 */", "1", " c1 ",

            "/* c1 ", "0",

            "/* c1 *", "0",

            "/* c1 */ /* c2", "1", " c1 ",

            "  /* c1 */ ", "1", " c1 ",
            
            "/* c1 */\n/* c2 */", "2", " c1 ", " c2 ",

            "/* c1 \n */", "1", " c1 \n ",
            
            "/* c1\n   c2 */", "1", " c1\n   c2 ",
            
            "/** yep */", "1", "* yep ",
            
            "/* nope */\n/** yep */", "2", " nope ", "* yep ",

            "/** yep */\n/* nope */", "2", "* yep ", " nope ",
            
            "/* yep */\n// foo\n/*\n * foo\n */", "2", " yep ", "\n * foo\n ",
            
            // we shouldn't parse "//* as "/" followed by the beginning of a comment "/*".
            "//* foo\n/* bar */", "1", " bar ",
            
            "/* -*- mode: JavaScript; c-basic-offset: 2; -*- */\n/**\n * Definition of the basic LFC Library\n *\n * @copyright Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.\n *            Use is subject to license terms.\n *\n */\n/** @keywords private */", 
            "3", 
            " -*- mode: JavaScript; c-basic-offset: 2; -*- ", 
            "*\n * Definition of the basic LFC Library\n *\n * @copyright Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.\n *            Use is subject to license terms.\n *\n ",
            "* @keywords private ",
            
        };

        for (Iterator iter = Arrays.asList(tests).iterator(); iter.hasNext();) {
        
            String cr = System.getProperty("line.separator");

            String source = (String) iter.next();
            String normalizedSource = source.replaceAll("\n", cr);
            
            ArrayList matches = Comment.extractRawComments(normalizedSource);
            
            assertTrue(source, iter.hasNext());
            int expectedMatches = Integer.parseInt((String) iter.next());

            assertEquals(source, expectedMatches, matches.size());

            final int n = matches.size();
            for (int i=0; i<n; i++) {
                String actual = (String) matches.get(i);
                assertTrue(source, iter.hasNext());
                String expect = (String) iter.next();
                String normalizedExpect = expect.replaceAll("\n", cr);
                if (actual.equals(normalizedExpect) != true) {
                    System.out.println("expect: '" + expect.replaceAll("\n","\\\\n").replaceAll("\r","\\\\r") + "'");
                    System.out.println("normalizedExpect: '" + normalizedExpect.replaceAll("\n","\\\\n").replaceAll("\r","\\\\r") + "'");
                    System.out.println("actual: '" + actual.replaceAll("\n","\\\\n").replaceAll("\r","\\\\r") + "'");
                }
                assertEquals(source, normalizedExpect, actual);
            }
        }
    }
    
    public void testjs2docExtractTextContent () {
        String[] tests = {
        
            "/** yep */", "yep",
            
            "/** yep \n * @param foo */", "yep",
            
        };
        
        for (Iterator iter = Arrays.asList(tests).iterator(); iter.hasNext();) {
        
            String source = (String) iter.next();
            String cr = System.getProperty("line.separator");
            String normalizedSource = source.replaceAll("\n", cr);
        
            Comment resultComment = Comment.extractLastJS2DocFromCommentSequence(normalizedSource);

            String expect = (String) iter.next();
            String normalizedExpect = expect.replaceAll("\n", cr);

            assertEquals(normalizedExpect, resultComment.textContent);
        }
    }

    public void testjs2docExtractFieldNames () {
        String[] tests = {
        
            "/** yep */", "0",
            
            "/** yep \n * @param foo */", "1",
            
            "/** yep \n * @param foo \n * @param bar*/", "2",
        };
        
        for (Iterator iter = Arrays.asList(tests).iterator(); iter.hasNext();) {
        
            String source = (String) iter.next();
            String cr = System.getProperty("line.separator");
            String normalizedSource = source.replaceAll("\n", cr);
        
            Comment resultComment = Comment.extractLastJS2DocFromCommentSequence(normalizedSource);

            int expectedFields = Integer.parseInt((String) iter.next());

            assertEquals(source, expectedFields, resultComment.fields.size());
            
        }
    }
    
    public void testExtractAsXML() {
        String[] tests = {
        
            "/** */", "<js2doc><doc/></js2doc>",
            
            "/** jaz */", "<js2doc><doc><text>jaz</text></doc></js2doc>",
            
            "/** @foo jaz */", "<js2doc><doc><tag name=\"foo\"><text>jaz</text></tag></doc></js2doc>",
            
            "/** jaz\n @bar baz */", "<js2doc><doc><text>jaz</text><tag name=\"bar\"><text>baz</text></tag></doc></js2doc>",
            
            "/** jaz &lt; bar */", "<js2doc><doc><text>jaz &lt; bar</text></doc></js2doc>",
        };
        
        for (Iterator iter = Arrays.asList(tests).iterator(); iter.hasNext();) {

            String source = (String) iter.next();

            try {
                org.w3c.dom.Document doc = null;
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
        
                org.w3c.dom.Document actual = builder.newDocument();
                Element actualNode = actual.createElement("js2doc");
                actual.appendChild(actualNode);
                
                String cr = System.getProperty("line.separator");
                String normalizedSource = source.replaceAll("\n", cr);
                Comment.appendStructuredCommentsAsXML(normalizedSource, actualNode);

                assertTrue(source, iter.hasNext());
                String expect = (String) iter.next();
                
                org.w3c.dom.Document control = XMLUnit.buildControlDocument(expect);

                Diff diff = new Diff(control, actual);
                
                if (diff.identical() == false) {
                    System.out.println("identical: " + diff.identical());
                    System.out.println("input:  " + source);
                    String actualString = JS2DocUtils.xmlToString(actual);
                    System.out.println("output: " + actualString);
                    System.out.println("expect: " + expect);
                }

                assertXMLIdentical(diff, true, "JS2Doc.toXML(\"" + source + "\")");
    
            } catch (org.xml.sax.SAXException exc) {
                fail("JS2Doc.toXML(\"" + source + "\")");
                exc.printStackTrace();
            } catch (java.io.IOException exc) {
                fail("JS2Doc.toXML(\"" + source + "\")");
                exc.printStackTrace();
            } catch (javax.xml.parsers.ParserConfigurationException exc) {
                fail("JS2Doc.toXML(\"" + source + "\")");
                exc.printStackTrace();
            }
            
        }
    }
    
}
