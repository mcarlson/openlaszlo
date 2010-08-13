/******************************************************************************
 * DeploySOLODSWF.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004, 2008-2010 Laszlo Systems, Inc.  All Rights Reserved.   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.PrintWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;
import java.util.HashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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

/*
      We want an option to deploy an app and it's entire directory.

      So, for an app with is at /foo/bar/baz.lzx

      That should make a zip file which is relative to the web root and has
      /lps/includes/**
      /foo/bar/**   -- will include the SOLO .lzx.swfNN.swf file(s)
      /foo/bar/baz.lzx.html  -- the wrapper file
    */

public class DeploySOLOSWF {


    /**
     * Create SOLO deploy archive or wrapper page for app
     *
     * @param wrapperonly if true, write only the wrapper html file to the output stream. If false, write entire zipfile archive.
     * @param canvas If canvas is null, compile the app, and write an entire SOLO zip archive to outstream. Otherwise, use the supplied canvas.
     * @param lpspath optional, if non-null, use as path to LPS root.
     * @param url optional, if non-null, use as URL to application in the wrapper html file.
     * @param sourcepath pathname to application source file
     * @param outstream stream to write output to
     * @param tmpdir temporary file to hold compiler output, can be null
     * @param  title optional, if non-null, use as app title in wrapper html file
     */

    public static int deploy(String runtime,
                             boolean wrapperonly,
                              Canvas canvas,
                              String lpspath,
                              String url,
                              String sourcepath,
                              FileOutputStream outstream,
                              File tmpdir,
                             String title,
                             String widgetType)
      throws IOException
    {
        return deploy(runtime, wrapperonly, canvas, lpspath, url, sourcepath, outstream, tmpdir, title, widgetType, null, null);
    }
        
    public static int deploy(String runtime,
                             boolean wrapperonly,
                              Canvas canvas,
                              String lpspath,
                              String url,
                              String sourcepath,
                              FileOutputStream outstream,
                              File tmpdir,
                             String title,
                             String widgetType,
                             Properties props,
                             HashMap skipfiles)
      throws IOException
    {

        lpspath = lpspath!=null?lpspath.replaceAll("\\\\", "\\/"):null;
        url = url!=null?url = url.replaceAll("\\\\", "\\/"):null;
        sourcepath = sourcepath!=null? sourcepath.replaceAll("\\\\", "\\/"):null;

        // Set this to make a limit on the size of zip file that is created
        int maxZipFileSize = 64000000; // 64MB max
        int warnZipFileSize = 10000000; // warn at 10MB of content (before compression)
        boolean warned = false;


        File sourcefile = new File(sourcepath);

        // If no canvas is supplied, compile the app to get the canvas and the 'binary'
        if (canvas == null)  {

            // Create tmp dir if needed
            if (tmpdir == null) {
                tmpdir = File.createTempFile("solo_output", "js").getParentFile();
            }

            File tempFile = File.createTempFile(sourcefile.getName(), null, tmpdir);
            Properties compilationProperties = (props == null) ? new Properties() : props;
            // Compile a SOLO app with swf runtime.
            compilationProperties.setProperty(CompilationEnvironment.RUNTIME_PROPERTY, runtime);
            compilationProperties.setProperty(CompilationEnvironment.PROXIED_PROPERTY, "false");
            org.openlaszlo.compiler.Compiler compiler = new org.openlaszlo.compiler.Compiler();

            String mediaCacheDir = LPS.getWorkDirectory() + File.separator + "cache" + File.separator + "cmcache";
            CompilerMediaCache cache = new CompilerMediaCache(new File(mediaCacheDir), new Properties());
            compiler.setMediaCache(cache);
            LPS.initialize();

            canvas = compiler.compile(sourcefile, tempFile, compilationProperties);
        }

        if (title == null) {  title = sourcefile.getName(); }

        // Get the HTML wrapper by applying the html-response XSLT template
        ByteArrayOutputStream wrapperbuf = new ByteArrayOutputStream();
        String styleSheetPathname =
            org.openlaszlo.server.LPS.getTemplateDirectory() +
            File.separator + "html-response.xslt";

        String appname = sourcefile.getName();
        String DUMMY_LPS_PATH = "__DUMMY_LPS_ROOT_PATH__";
        if (lpspath == null) {
            lpspath = DUMMY_LPS_PATH;
        }
        if (url == null) {
            url = appname;
        }


        String request = "<request " +
            "lps=\"" + lpspath + "\" " +
            "url=\"" + url + "\" " +
            "/>";
        
        String canvasXML = canvas.getXML(request);
        Properties properties = new Properties();
        TransformUtils.applyTransform(styleSheetPathname, properties, canvasXML, wrapperbuf);
        String wrapper = wrapperbuf.toString();

        wrapper = wrapper.replaceAll("[.]lzx[?]lzt=swf'", ".lzx."+runtime+".swf?lzproxied=false'");

        if (wrapperonly) {
            // write wrapper to outputstream
            try {
                byte wbytes[] = wrapper.getBytes();
                outstream.write(wbytes);
            } finally {
                if (outstream != null) {
                    outstream.close();
                }
            }            
            return 0;
        }

        /* Create a DOM for the Canvas XML descriptor  */
        Element canvasElt = parse(canvasXML);

        String appwidth = canvasElt.getAttribute("width");
        String appheight = canvasElt.getAttribute("height");

        if (appwidth.equals("")) { appwidth = "400"; }
        if (appheight.equals("")) { appheight = "400"; }



        // We need to adjust the  wrapper, to make the path to lps/includes/dhtml-embed.js
        // be relative rather than absolute.
        
        // remove the servlet prefix and leading slash
        //  src="/legals/lps/includes/embed-dhtml.js"
        wrapper = wrapper.replaceAll(lpspath + "/", "");
        
        // Replace object file URL with SOLO filename
        // Lz.dhtmlEmbedLFC({url: 'animation.lzx?lzt=object&lzproxied=false&lzr=dhtml'
        // Lz.dhtmlEmbed({url: 'animation.lzx?lzt=object&lzr=dhtml&_canvas_debug=false',
        //                 bgcolor: '#eaeaea', width: '800', height: '300', id: 'lzapp'});


        // Replace the ServerRoot with a relative path
        // lzOptions = { ServerRoot: '/legals', splashhtml: '<img src="lps/includes/spinner.gif">', appendDivID: 'lzdhtmlappdiv'};

        wrapper = wrapper.replaceFirst("ServerRoot:\\s*'_.*?'", "ServerRoot: 'lps/resources'");


        // replace title
        // wrapper = wrapper.replaceFirst("<title>.*</title>", "<title>"+title+"</title>\n");
        // extract width and height with regexp

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
        if (appdir ==null) { appdir = new File("."); }
        appdir = appdir.getCanonicalFile();

        // Create the ZIP file
        SimpleDateFormat format = 
            new SimpleDateFormat("EEE_MMM_dd_yyyy_HH_mm_ss");
        ZipOutputStream zout = new ZipOutputStream(outstream);

        DeployUtils.buildZipFile(runtime, zout, basedir, appdir, new PrintWriter(System.err), null, wrapper,
                                 widgetType, sourcepath,  title,  appheight,  appwidth);

        // OK
        return 0;
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
