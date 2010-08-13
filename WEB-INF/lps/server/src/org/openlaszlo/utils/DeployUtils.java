/******************************************************************************
 * DeploySOLODHTML.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004, 2008, 2009, 2010 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.utils;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.io.OutputStream;
import java.io.File;
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.BufferedOutputStream;
import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;
import java.util.regex.*;


import javax.xml.parsers.DocumentBuilderFactory;

import org.openlaszlo.compiler.Canvas;
import org.openlaszlo.compiler.CompilationEnvironment;
import org.openlaszlo.compiler.CompilerMediaCache;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.server.LPS;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class DeployUtils {

    public static void listFiles(ArrayList fnames, File dir) {
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

    public static void copyByteArrayToZipFile (ZipOutputStream zout,
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


    public static void copyFileToZipFile (ZipOutputStream zout,
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


    public static String fixSlashes (String path) {
        return(path.replace('\\', '/'));
    }

    

    public static void deleteDirectoryFiles(File dir) {
        if (dir.isDirectory()) {
            File[] children = dir.listFiles();
            for (int i=0; i<children.length; i++) {
                File f = children[i];
                if (f.isFile()) {
                    f.delete();
                }
            }
        }
    }


    public static Element getChild(Element elt, String name) {
        NodeList elts = elt.getChildNodes();
        for (int i=0; i < elts.getLength(); i++) {
            Node child = elts.item(i);
            if (child instanceof Element && ((Element)child).getTagName().equals(name)) {
                return (Element) child;
            }
        }
        return null;
    }

    public static Element parse(String content) throws IOException {
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

    // returns zipfile name
    public static void buildZipFile(String runtime, ZipOutputStream zout, File basedir, File appdir,
                                    PrintWriter out, HashMap skipfiles,
                                    String wrapper, String widgetType,
                                    String appUrl, String title, String appheight, String appwidth)
      throws IOException {
        
        int maxZipFileSize = 64000000; // 64MB max
        int warnZipFileSize = 10000000; // warn at 10MB of content (before compression)
        boolean warned = false;
        String htmlfile = "";

        // Keep track of which files we have output to the zip archive, so we don't
        // write any duplicate entries.
        HashSet zippedfiles = new HashSet();

        // These are the files to include in the ZIP file
        ArrayList filenames = new ArrayList();
        // LPS includes, (originally copied from /lps/includes/*)
        filenames.add("lps/includes/embed-compressed.js");
        filenames.add("lps/includes/blank.gif");
        filenames.add("lps/includes/spinner.gif");
        filenames.add("lps/includes/excanvas.js");
        filenames.add("lps/includes/iframemanager.js");
        filenames.add("lps/includes/rtemanager.js");
        filenames.add("lps/includes/flash.js"); // only needed for swf 
        filenames.add("lps/includes/laszlo-debugger.css");
        filenames.add("lps/includes/laszlo-debugger.html");

        ArrayList appfiles = new ArrayList();
        listFiles(appfiles, appdir);

        // Create a buffer for reading the files
        byte[] buf = new byte[1024];
        char[] cbuf = new char[1024];
    
        try {
        
            ////////////////
            // Create wrapper .html file, we make a byte array from
            // lzhistory wrapper text, and write it to the zip archive.
            //
            //htmlfile = new File(appUrl).getName()+".html";
            htmlfile = "index.html";

            byte lbytes[] = wrapper.getBytes();
            //Write out a copy of the lzhistory wrapper as appname.lzx.html
            copyByteArrayToZipFile(zout, lbytes, htmlfile, zippedfiles);
            ////////////////

            ////////////////
            // Write the widget config.xml file 

            // This is the default, if no template matches widgetType
            if (widgetType == null) {
                widgetType = "jil";
            }
            File template = new File(basedir + "/" + "lps/admin/widget-templates/" + "config."+widgetType+".xml");

            String configXML = FileUtils.readFileString(template);
         
            // We substitute for these vars

            configXML = configXML.replaceAll("%APPURL%", appUrl);
            configXML = configXML.replaceAll("%APPTITLE%", title);
            configXML = configXML.replaceAll("%APPHEIGHT%", appheight);
            configXML = configXML.replaceAll("%APPWIDTH%", appwidth);

            copyByteArrayToZipFile(zout, configXML.getBytes(), "config.xml", zippedfiles);
            ////////////////

            // Copy widget icon file
            copyFileToZipFile(zout, basedir + "/" + "lps/admin/widget-icon.png", "widget-icon.png", zippedfiles);

            // Compress the include files
            for (int i=0; i<filenames.size(); i++) {
                String srcfile = basedir + "/" + (String) filenames.get(i);
                // Add ZIP entry to output stream.
                String dstfile = (String) filenames.get(i);
                copyFileToZipFile(zout, srcfile, dstfile, zippedfiles);
            }

            if (runtime.equals("dhtml")) {
                // special case for IE7, need to copy lps/includes/blank.gif to lps/resources/lps/includes/blank.gif
                String srcfile = basedir + "/" + "lps/includes/blank.gif";
                String dstfile = "lps/resources/lps/includes/blank.gif";
                copyFileToZipFile(zout, srcfile, dstfile, zippedfiles);

                // Copy the DHTML LFC to lps/includes/LFC-dhtml.js
                ArrayList lfcfiles = new ArrayList();
                listFiles(lfcfiles, new File(basedir + "/lps/includes/lfc"));
                for (int i=0; i<lfcfiles.size(); i++) {
                    String fname = (String) lfcfiles.get(i);
                    if (!fname.matches(".*LFCdhtml.*.js")) { continue; }
                    String stripped = fname.substring(basedir.getCanonicalPath().length()+1);
                    copyFileToZipFile(zout, fname, stripped, zippedfiles);
                }
            }
            // track how big the file is, check that we don't write more than some limit
            int contentSize = 0;

            // Compress the app files
            for (int i=0; i<appfiles.size(); i++) {
                String srcname = (String) appfiles.get(i);
                String dstname = srcname.substring(appdir.getPath().length()+1);
                if (skipfiles == null || !(skipfiles.containsKey(srcname))) {
                    // Add ZIP entry to output stream.
                    copyFileToZipFile(zout, srcname, dstname, zippedfiles);
                    if (contentSize > maxZipFileSize) {
                        throw new IOException("file length exceeds max of "+ (maxZipFileSize/1000000) +"MB");
                    }
                }
            }

            // Complete the ZIP file
            zout.close();
        } catch (java.io.IOException e) {
            out.println("<font color=\"red\">Error generating zip file: "+e.toString() + " </h3>");
        }
    }




    public static void copyInputStream(InputStream in, OutputStream out)
      throws IOException
    {
        byte[] buffer = new byte[1024];
        int len;

        while((len = in.read(buffer)) >= 0)
            out.write(buffer, 0, len);

        in.close();
        out.close();
    }

    public static  void unpackZipfile(String zipfile, String outdir, PrintWriter out)
      throws java.io.IOException {
        Enumeration entries;
        ZipFile zipFile;
        try {
            zipFile = new ZipFile(zipfile);

            entries = zipFile.entries();

            while(entries.hasMoreElements()) {
                ZipEntry entry = (ZipEntry)entries.nextElement();

                if(entry.isDirectory()) {
                    // Assume directories are stored parents first then children.
                    String dir = outdir + File.separator + entry.getName();
                    (new File(dir)).mkdir();
                    continue;
                }

                String outfile = outdir + File.separator + entry.getName();
                File outf = new File(outfile);
                if (outf.getParent() != null) {
                    outf.getParentFile().mkdirs();
                }
                //        out.println("extracting to "+outfile+"<br>");
                copyInputStream(zipFile.getInputStream(entry), new BufferedOutputStream(new FileOutputStream(outfile)));
            }

            zipFile.close();
        } catch (IOException ioe) {
            out.println("Unhandled exception:" + ioe + ", "+ioe.getMessage());
            ioe.printStackTrace();
            return;
        }
    }

    public static String adjustDHTMLWrapper(String wrapper, String lpspath)
    {
        // We need to adjust the  wrapper, to make the path to lps/includes/dhtml-embed.js
        // be relative rather than absolute.
        
        // remove the servlet prefix and leading slash
        //  src="/legals/lps/includes/embed-dhtml.js"
        wrapper = wrapper.replaceAll(lpspath + "/", "");
        
        // Replace object file URL with SOLO filename
        // Lz.dhtmlEmbedLFC({url: 'animation.lzx?lzt=object&lzproxied=false&lzr=dhtml'
        // Lz.dhtmlEmbed({url: 'animation.lzx?lzt=object&lzr=dhtml&_canvas_debug=false',
        //                 bgcolor: '#eaeaea', width: '800', height: '300', id: 'lzapp'});

        //wrapper = wrapper.replaceAll("[.]lzx[?]lzt=object.*'", ".lzx.js'");
        wrapper = wrapper.replaceAll("[.]lzx[?]lzt=object.*?'", ".lzx.js'");

        // Replace serverroot and lfcurl:
        // lz.embed.dhtml({url: 'html.lzx?lzt=object&lzr=dhtml', lfcurl: '/trunk2/lps/includes/lfc/LFCdhtml.js', serverroot: '/trunk2/', bgcolor: '#ffffff', width: '100%', height: '100%', id: 'lzapp', accessible: 'false', cancelmousewheel: false, cancelkeyboardcontrol: false, skipchromeinstall: false, usemastersprite: false, approot: ''});
        wrapper = wrapper.replaceFirst("lfcurl:(.*?),",
                                       "lfcurl: 'lps/includes/lfc/LFCdhtml.js',");
        wrapper = wrapper.replaceFirst("serverroot:(.*?),",
                                       "serverroot: 'lps/resources/',");
        return wrapper;
    }

}
