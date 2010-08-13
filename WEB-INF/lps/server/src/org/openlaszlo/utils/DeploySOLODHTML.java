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
import java.io.FileInputStream;
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
import java.util.regex.*;


import javax.xml.parsers.DocumentBuilderFactory;

import org.openlaszlo.compiler.Canvas;
import org.openlaszlo.compiler.CompilationEnvironment;
import org.openlaszlo.compiler.CompilerMediaCache;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.utils.DeployUtils;
import org.openlaszlo.server.LPS;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

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

    public static int deploy(boolean wrapperonly,
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
        return deploy(wrapperonly, canvas, lpspath, url, sourcepath, outstream, tmpdir, title, widgetType, null, null);
    }
        
    public static int deploy(boolean wrapperonly,
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
            // Compile a SOLO app with DHTML runtime.
            compilationProperties.setProperty(CompilationEnvironment.RUNTIME_PROPERTY, "dhtml");
            compilationProperties.setProperty(CompilationEnvironment.PROXIED_PROPERTY, "false");
            // Forces compiler to copy any external resources into an app subdirectory named lps/resources
            compilationProperties.setProperty(CompilationEnvironment.COPY_RESOURCES_LOCAL, "true");
            org.openlaszlo.compiler.Compiler compiler = new org.openlaszlo.compiler.Compiler();

            //FIXME: this may create temp file anywhere
            File cacheDir = File.createTempFile("cmcache", "", null);
            cacheDir.delete();
            cacheDir.mkdir();
            cacheDir.deleteOnExit();
            CompilerMediaCache  cache = new CompilerMediaCache(cacheDir, new Properties());
            compiler.setMediaCache(cache);

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

        //wrapper = wrapper.replaceAll("[.]lzx[?]lzt=object.*'", ".lzx.js'");
        //TODO This regex is not converting correctly
        wrapper = wrapper.replaceAll("[.]lzx[?]lzt=object.*?'", ".lzx.js'");

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
        Element canvasElt = DeployUtils.parse(canvasXML);

        String appwidth = canvasElt.getAttribute("width");
        String appheight = canvasElt.getAttribute("height");

        if (appwidth.equals("")) { appwidth = "400"; }
        if (appheight.equals("")) { appheight = "400"; }


        wrapper = DeployUtils.adjustDHTMLWrapper(wrapper, lpspath);

        // replace title
        // wrapper = wrapper.replaceFirst("<title>.*</title>", "<title>"+title+"</title>\n");
        // extract width and height with regexp

        String htmlfile = "";

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

        DeployUtils.buildZipFile("dhtml", zout, basedir, appdir, new PrintWriter(System.err), skipfiles,
                     wrapper, widgetType, sourcepath, title, appheight, appwidth);

        // OK
        return 0;

    }

}
