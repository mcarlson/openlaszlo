/******************************************************************************
 * DeploySOLODHTML.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004, 2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.utils;

import java.net.*;
import java.util.*;
import java.util.regex.*;
import java.util.zip.*;
import java.io.*;
import java.text.SimpleDateFormat;
import org.openlaszlo.utils.FileUtils.*;
import org.openlaszlo.xml.internal.XMLUtils.*;
import org.openlaszlo.compiler.*;
import org.openlaszlo.server.LPS;

import org.w3c.dom.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;
import javax.xml.parsers.DocumentBuilderFactory;

/*
      We want an option to deploy an app and it's entire directory.

      So, for an app with is at /foo/bar/baz.lzx

      + /lps/includes/** ==> lps/includes/**

      + /foo/bar/**   -- will include the SOLO .lzx.js file(s)

      + /foo/bar/baz.lzx.html  -- the wrapper file

      + A copy of the LFC will be placed in lps/includes/LFC-dhtml.js

      + All resources which are external to /foo/bar will be copied into
      a subdir named /foo/bar/lps/resources/**

    */

public class DeploySOLODHTML {

    public static void main(String args[])
      throws IOException
    {
        deploy("/Users/hqm/openlaszlo/trunk/test/deploy/hello.lzx", "/tmp/solo.zip", "FOO", null, null);
    }


    public static void deploy(String sourcepath, String outputpath, String title, String appwidth, String appheight)
      throws IOException
    {
        // Set this to make a limit on the size of zip file that is created
        int maxZipFileSize = 64000000; // 64MB max
        int warnZipFileSize = 10000000; // warn at 10MB of content (before compression)
        boolean warned = false;

        if (title == null) {  title = ""; }

        // Compile the app to get the canvas and the 'binary'
        File sourcefile = new File(sourcepath);
        File tempFile = File.createTempFile(sourcefile.getName(), null);
        Properties compilationProperties = new Properties();
        // Compile a SOLO app with DHTML runtime.
        compilationProperties.setProperty(CompilationEnvironment.RUNTIME_PROPERTY, "dhtml");
        compilationProperties.setProperty(CompilationEnvironment.PROXIED_PROPERTY, "false");
        org.openlaszlo.compiler.Compiler compiler = new org.openlaszlo.compiler.Compiler();
        Canvas canvas = compiler.compile(sourcefile, tempFile, compilationProperties);

        // Get the HTML wrapper by applying the html-response XSLT template
        ByteArrayOutputStream wrapperbuf = new ByteArrayOutputStream();
        String styleSheetPathname =
            org.openlaszlo.server.LPS.getTemplateDirectory() +
            File.separator + "html-response.xslt";

        String appname = sourcefile.getName();
        String DUMMY_LPS_PATH = "__DUMMY_LPS_ROOT_PATH__";
        String request = "<request " +
            "lps=\"" + DUMMY_LPS_PATH + "\" " +
            "url=\"" + appname + "\" " +
            "/>";
        
        String canvasXML = canvas.getXML(request);
        Properties properties = new Properties();
        TransformUtils.applyTransform(styleSheetPathname, properties, canvasXML, wrapperbuf);
        String wrapper = wrapperbuf.toString();

        /* Create a DOM for the Canvas XML descriptor  */
        Element canvasElt = parse(canvasXML);

        // We need to adjust the  wrapper, to make the path to lps/includes/dhtml-embed.js
        // be relative rather than absolute.
        
        // remove the servlet prefix and leading slash
        //  src="/legals/lps/includes/embed-dhtml.js"
        wrapper = wrapper.replaceAll(DUMMY_LPS_PATH + "/", "");
        
        // Replace object file URL with SOLO filename
        // Lz.dhtmlEmbedLFC({url: 'animation.lzx?lzt=object&lzproxied=false&lzr=dhtml'
        // Lz.dhtmlEmbed({url: 'animation.lzx?lzt=object&lzr=dhtml&_canvas_debug=false',
        //                 bgcolor: '#eaeaea', width: '800', height: '300', id: 'lzapp'});

        //wrapper = wrapper.replaceAll("[.]lzx[?]lzt=object.*'", ".lzx.js'");
        wrapper = wrapper.replaceAll("[.]lzx[?]lzt=object.*?'", ".lzx.js'");

        // Replace the ServerRoot with a relative path
        // lzOptions = { ServerRoot: '/legals', splashhtml: '<img src="lps/includes/spinner.gif">', appendDivID: 'lzdhtmlappdiv'};

        wrapper = wrapper.replaceFirst("ServerRoot:\\s*'_.*?'", "ServerRoot: 'lps/resources'");

        
        // replace title
        // wrapper = wrapper.replaceFirst("<title>.*</title>", "<title>"+title+"</title>\n");
        // extract width and height with regexp

        appwidth = canvasElt.getAttribute("width");
        appheight = canvasElt.getAttribute("height");

        int nwidth = 640;
        int nheight = 400;

        String htmlfile = "";

        /*
          System.out.println("wrapper");
          System.out.println(wrapper);
          System.out.println("canvasXML");
          System.out.println(canvasXML);
        */

        // add in all the files in the app directory

        // destination to output the zip file, will be the current jsp directory

        // The absolute path to the base directory of the server web root 
        //canvas.setFilePath(FileUtils.relativePath(file, LPS.HOME()));

        File basedir = new File(LPS.HOME());
        basedir = basedir.getCanonicalFile();

        // The absolute path to the application directory we are packaging
        // e.g., demos/amazon
        File appdir = sourcefile.getParentFile();
        appdir = appdir.getCanonicalFile();

        // Keep track of which files we have output to the zip archive, so we don't
        // write any duplicate entries.
        HashSet zippedfiles = new HashSet();

        // These are the files to include in the ZIP file
        ArrayList filenames = new ArrayList();
        // LPS includes, (originally copied from /lps/includes/*)
        filenames.add("lps/includes/embed-compressed.js");
        filenames.add("lps/includes/blank.gif");
        filenames.add("lps/includes/spinner.gif");


        ArrayList appfiles = new ArrayList();
        //System.out.println("calling listFiles " + appdir);
        listFiles(appfiles, appdir);

        // Create a buffer for reading the files
        byte[] buf = new byte[1024];
        char[] cbuf = new char[1024];
    
        try {
            // Create the ZIP file
            SimpleDateFormat format = 
                new SimpleDateFormat("EEE_MMM_dd_yyyy_HH_mm_ss");
            ZipOutputStream zout = new ZipOutputStream(new FileOutputStream(outputpath));

            // create a byte array from lzhistory wrapper text
            htmlfile = new File(appname).getName()+".html";

            byte lbytes[] = wrapper.getBytes();
            //Write out a copy of the lzhistory wrapper as appname.lzx.html
            //System.out.println("<br>copyFileToZipFile dstfixed="+htmlfile+" lookup "+zippedfiles.contains(htmlfile));
            copyByteArrayToZipFile(zout, lbytes, htmlfile, zippedfiles);

            // Compress the include files
            for (int i=0; i<filenames.size(); i++) {
                String srcfile = basedir + "/" + (String) filenames.get(i);
                // Add ZIP entry to output stream.
                String dstfile = (String) filenames.get(i);
                copyFileToZipFile(zout, srcfile, dstfile, zippedfiles);
            }

            // Copy the DHTML LFC to lps/includes/LFC-dhtml.js
            ArrayList lfcfiles = new ArrayList();
            listFiles(lfcfiles, new File(basedir + "/lps/includes/lfc"));
            for (int i=0; i<lfcfiles.size(); i++) {
                String fname = (String) lfcfiles.get(i);
                if (!fname.matches(".*LFCdhtml.*.js")) { continue; }
                String stripped = fname.substring(basedir.getCanonicalPath().length()+1);
                copyFileToZipFile(zout, fname, stripped, zippedfiles);
            }

            // track how big the file is, check that we don't write more than some limit
            int contentSize = 0;

            // Now make copies of all resources which live external to the app's home directory.
            // Look for <resolve> tags in stats:
            // <canvas>
            //  <stats>
            //   <resolve src="xxxx.png" pathname="c:\foo\bar\realpath.png"/>

            Element stats = getChild(canvasElt, "stats");
            NodeList elts = stats.getElementsByTagName("resolve");
            for (int i=0; i < elts.getLength(); i++) {
                Element res = (Element)elts.item(i);
                String src = res.getAttribute("src");
                String pathname = res.getAttribute("pathname");
                String relativePathname = pathname.substring(basedir.getAbsolutePath().length() + 1);
                String zip_pathname = "lps/resources/"+relativePathname;
                if (zippedfiles.contains(zip_pathname)) { continue; }
                // compare the pathname that the resource resolved to with the app directory path 
                if (pathname.startsWith(appdir.getAbsolutePath())) {
                    // It's under the app directory, ignore, we copied it already in the appfiles
                    // code above.
                } else {
                    // Copy the resource file into lps/resources/serverroot-relative-pathname
                    copyFileToZipFile(zout, pathname, zip_pathname, zippedfiles);
                }
            }

            // Compress the app files
            for (int i=0; i<appfiles.size(); i++) {
                String srcname = (String) appfiles.get(i);
                String dstname = srcname.substring(appdir.getPath().length()+1);
                // Add ZIP entry to output stream.
                copyFileToZipFile(zout, srcname, dstname, zippedfiles);

                if (contentSize > maxZipFileSize) {
                    throw new IOException("file length exceeds max of "+ (maxZipFileSize/1000000) +"MB");
                }
            }

            // Complete the ZIP file
            zout.close();
        } catch (IOException e) {
        }

    }

    static void listFiles(ArrayList fnames, File dir) {
        if (dir.isDirectory()) {   
            if (!(dir.getName().startsWith(".svn"))) {
                String[] children = dir.list();
                for (int i=0; i<children.length; i++) {
                    listFiles(fnames, new File(dir, children[i]));
                }
            }
        } else {
            fnames.add(dir.getPath());
            //System.out.println("adding "+dir.getPath());
        }
    }

    static void copyByteArrayToZipFile (ZipOutputStream zout,
                                        byte lbytes[],
                                        String dstfile,
                                        Set zipped)
      throws IOException
    {
        zout.putNextEntry(new ZipEntry(fixSlashes(dstfile)));
        zout.write(lbytes, 0, lbytes.length);
        zout.closeEntry();
        zipped.add(fixSlashes(dstfile));
    }


    static void copyFileToZipFile (ZipOutputStream zout,
                                   String srcfile,
                                   String dstfile,
                                   Set zipped)
      throws IOException, FileNotFoundException {
        String dstfixed = fixSlashes(dstfile);
        if (zipped.contains(dstfixed)) {
            return;
        }
        FileInputStream in = new FileInputStream(srcfile);
        // Add ZIP entry to output stream.
        zout.putNextEntry(new ZipEntry(dstfixed));
        // Transfer bytes from the file to the ZIP file
        int len;
        byte[] buf = new byte[1024];
        while ((len = in.read(buf)) > 0) {
            zout.write(buf, 0, len);
        }
        // Complete the entry
        zout.closeEntry();
        in.close();
        zipped.add(dstfixed);
    }


    static String fixSlashes (String path) {
        return(path.replace('\\', '/'));
    }

    static Element getChild(Element elt, String name) {
        NodeList elts = elt.getChildNodes();
        for (int i=0; i < elts.getLength(); i++) {
            Node child = elts.item(i);
            if (child instanceof Element && ((Element)child).getTagName().equals(name)) {
                return (Element) child;
            }
        }
        return null;
    }

    static Element parse(String content) throws IOException {
        try {
            // Create a DOM builder and parse the fragment
            DocumentBuilderFactory factory =
                DocumentBuilderFactory.newInstance();
            factory.setValidating(false);
            Document d = factory.newDocumentBuilder().parse( new
                                                             org.xml.sax.InputSource(new StringReader(content)) );

            return d.getDocumentElement();

        } catch (java.io.IOException e) {
        } catch (javax.xml.parsers.ParserConfigurationException e) {
        } catch (org.xml.sax.SAXException e) {
        }
        return null;
    }
}
