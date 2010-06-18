/*****************************************************************************
 * NULLWriter.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
 * Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.              *
 * Use is subject to license terms.                                            *
 * J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.compiler;

import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.server.LPS;
import org.openlaszlo.utils.ChainedException;
import org.openlaszlo.utils.FileUtils;
import org.openlaszlo.utils.ListFormat;
import org.openlaszlo.compiler.CompilationEnvironment;
import org.openlaszlo.compiler.ObjectWriter.ImportResourceError;
import org.openlaszlo.compiler.ObjectWriter.Resource;

import org.openlaszlo.iv.flash.api.FlashDef;

import org.openlaszlo.media.*;

import java.io.*;
import java.util.*;
import java.lang.Math;
import java.lang.Character;

import org.jdom.Element;

// jgen 1.4
import java.awt.geom.Rectangle2D;

import org.apache.log4j.*;

/** 
 * This ObjectWriter is just for gathering compilation warnings from
 * the tag compiler.  It has stubbed out all calls to the script
 * compiler or media compilers.
 *
 * Properties documented in Compiler.getProperties.
 */
class NullWriter extends DHTMLWriter {

    // Accumulate script here, to pass to script compiler
    protected PrintWriter scriptWriter = null;
    protected StringWriter scriptBuffer = null;

    /** Logger */
    protected static Logger mLogger = org.apache.log4j.Logger.getLogger(NullWriter.class);

    NullWriter(Properties props, OutputStream stream,
                CompilerMediaCache cache,
                boolean importLibrary,
                CompilationEnvironment env) {

        super(props, stream, cache, importLibrary, env);

        scriptBuffer = new StringWriter();
        scriptWriter= new PrintWriter(scriptBuffer);

    }


    /**
     * Sets the canvas for the app
     *
     * @param canvas
     * 
     */
    void setCanvas(Canvas canvas, String canvasConstructor) {
        scriptWriter.println(canvasConstructor);
    }

    void setCanvasDefaults(Canvas canvas, CompilerMediaCache mc) { };



    public int addScript(String script) {
        scriptWriter.println(script);
        return script.length();
    }


    public void importPreloadResource(File fileName, String name) 
        throws ImportResourceError
    {
    }

    public void importPreloadResource(String fileName, String name) 
        throws ImportResourceError
    {
    }

    /** Import a multiframe resource into the current movie.  Using a
     * name that already exists clobbers the old resource (for now).
     */
    public void importPreloadResource(List sources, String name, File parent)
        throws ImportResourceError
    {
    }


    /** Import a resource file into the current movie.
     * Using a name that already exists clobbers the
     * old resource (for now).
     *
     * @param fileName file name of the resource
     * @param name name of the MovieClip/Sprite
     * @throws CompilationError
     */
    public void importResource(String fileName, String name) 
        throws ImportResourceError
    {
        importResource(new File(fileName), name);
    }

    public void importResource(File inputFile, String name)
        throws ImportResourceError
    {
    }

    public void importResource(List sources, String sResourceName, File parent)
    {
        writeResourceLibraryDescriptor(sources, sResourceName, parent);
    }
    
    /* Write resource descriptor library */
    public void writeResourceLibraryDescriptor(List sources, String sResourceName, File parent) { }

    public void close() throws IOException { 
    }

    public void openSnippet(String url) throws IOException {
        this.liburl = url;
    }

    public void closeSnippet() throws IOException {
    }

    /* [todo 2006-02-09 hqm] These methods are to be compatible with
       SWF font machinery -- this should get factored away someday so that the FontCompiler
       doesn't try to do anything with <font> tags in DHTML, (except maybe make aliases for them?)
    */
    FontManager getFontManager() {
        //        mEnv.warn("DHTML runtime doesn't support FontManager API");
        return null;
    }

    public boolean isDeviceFont(String face) {
        return true;
    }

    public void setDeviceFont(String face) {}
    public void setFontManager(FontManager fm) {}

    public void importFontStyle(String fileName, String face, String style,
                                CompilationEnvironment env)
        throws FileNotFoundException, CompilationError {
        env.warn("DHTMLWriter does not support importing fonts");
    }


    void addPreloaderScript(String script) { } ;
    void addPreloader(CompilationEnvironment env) { } ;

    public void importBaseLibrary(String library, CompilationEnvironment env) {
        env.warn("DHTMLWriter does not implement importBaseLibrary");
    }

    protected Resource getResource(String fileName, String name, boolean stop)
        throws ImportResourceError
    {
        return null;
    }

}

