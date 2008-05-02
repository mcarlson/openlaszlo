/* ****************************************************************************
 * WholeFile_Test.java
 *
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2006-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.js2doc;
import org.openlaszlo.utils.*;
import java.io.*;
import java.util.*;
import junit.framework.*;
import org.w3c.dom.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;
import org.custommonkey.xmlunit.*;

public class WholeFile_Test extends XMLTestCase {

    public WholeFile_Test (String name) {
        super(name);
        XMLUnit.setIgnoreWhitespace(true);
    }

    public void setUp () {
    }

    private class FilenameSuffixFilter implements FilenameFilter {
        private String suffix;
        
        public FilenameSuffixFilter(String suffix) {
            this.suffix = suffix;
        }
        
        public boolean accept(File dir, String name) {
            return name.endsWith(suffix);
        }
    }
    
    static final String[] runtimeOptionStrings = { "swf7", "swf8", "swf9", "dhtml" };
    static final Set runtimeOptions = new HashSet(Arrays.asList(runtimeOptionStrings));
    static final String[][] runtimeAliasStrings = { { "as2", "swf7", "swf8", "swf9" },
                                                    { "as3", "swf9" },
                                                    { "js1", "dhtml" } };
    static final List runtimeAliases = Arrays.asList(runtimeAliasStrings);                                                 
    static final String[] buildOptionStrings = { "debug", "profile" };
    static final List buildOptions = Arrays.asList(buildOptionStrings);
    
    public void testSampleFiles () {
    
        File filesDir = new File(System.getProperty("JS2DOC_TESTCASES"));
        assertTrue(filesDir.exists());
        assertTrue(filesDir.isDirectory());
        
        FilenameFilter sourceFilter = new FilenameSuffixFilter(".js");
        File[] sourceFiles = filesDir.listFiles(sourceFilter);

        String sourceRoot = System.getProperty("JS2DOC_LIBROOT");

        System.out.println("processing " + sourceFiles.length + " test files");
        
        for (int i = 0; i < sourceFiles.length; i++) {
        
            File sourceFile = sourceFiles[i];

            String sourceFilename = sourceFile.getPath();
            
            String resultFileName = FileUtils.getBase(sourceFilename) + ".xml";
            File resultFile = new File(resultFileName);
            
            try {
                String source = "#file " + sourceFilename + "\n" +
                    "#line 1\n" + FileUtils.readFileString(sourceFile);
                
                String result = FileUtils.readFileString(resultFile);
    
                Document control = XMLUnit.buildControlDocument(result);
                
                Document test = JS2Doc.toXML(source, sourceFile, sourceRoot, "test", runtimeOptions, runtimeAliases, buildOptions);
                
                Diff diff = new Diff(control, test);
                
                String testString = JS2DocUtils.xmlToString(test);
                
                if (diff.similar() == false ) {
                    System.out.println("identical: " + diff.identical());
                    System.out.println("output: " + testString);
                    System.out.println("expect: " + result);
                }

                // use 'similar' rather than 'identical' here so we can put a copyright comment and line endings
                // in the expected result file.
                assertXMLEqual(diff, true, "JS2Doc.toXML(\"" + sourceFilename + "\")");
    
            } catch (org.xml.sax.SAXException exc) {
                fail("JS2Doc.toXML(\"" + sourceFilename + "\")");
                exc.printStackTrace();
            } catch (java.io.IOException exc) {
                fail("JS2Doc.toXML(\"" + sourceFilename + "\")");
                exc.printStackTrace();
            } catch (javax.xml.parsers.ParserConfigurationException exc) {
                fail("JS2Doc.toXML(\"" + sourceFilename + "\")");
                exc.printStackTrace();
            }
        }
    }

}
