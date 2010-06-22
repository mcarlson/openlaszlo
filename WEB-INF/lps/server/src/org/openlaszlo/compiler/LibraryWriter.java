/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * Library output
 *
 * @author ptw@openlaszlo.org
 *
 * Outputs schema and script for a library
 */

package org.openlaszlo.compiler;

import java.io.*;
import java.net.*;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.jdom.Element;

import org.openlaszlo.server.LPS;
import org.openlaszlo.sc.ParseTreePrinter;
import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.sc.JavascriptCompressor;
import org.openlaszlo.sc.Compiler;
import org.openlaszlo.sc.SWF9ParseTreePrinter;
import org.openlaszlo.utils.*;


/** Accumulates code, XML, and assets to a Library object file.
 *
 * Properties documented in Compiler.getProperties.
 */
class LibraryWriter extends IntermediateWriter {

  ZipOutputStream zout;
  SWF9Writer mSWF10Writer = null;
  DHTMLWriter mDHTMLWriter = null;

  LibraryWriter(Properties props, OutputStream stream,
                CompilerMediaCache cache,
                boolean importLibrary,
                CompilationEnvironment env,
                Element root) {


    super(props, stream, cache, importLibrary, env, root);

    try {
      this.zout = new ZipOutputStream(mStream);
      // Create main file entry named 'lzo', which contains XML schema
      // declarations plus lzs script.
      zout.putNextEntry(new ZipEntry("lzo"));
      this.mStream = zout;
      this.mPrintStream = new PrintStream(zout);
    } catch (Exception e) {
      throw new ChainedException(e);
    }
    this.root = root;
    if (env.targetRuntimesContain("dhtml")) {
      Properties cprops = (Properties)mProperties.clone();
      props.setProperty(CompilationEnvironment.RUNTIME_PROPERTY, "dhtml");
      // Problem here, need to set this on clone of properties , so we don't bash the global compilation env
      CompilationEnvironment.setRuntimeConstants("dhtml", cprops, mEnv);
      mDHTMLWriter = new DHTMLWriter(props, mStream, cache, true, mEnv);
    }
    if (env.targetRuntimesContain("swf10") || env.targetRuntimesContain("swf9")) {
      Properties cprops = (Properties)mProperties.clone();
      cprops.setProperty(CompilationEnvironment.RUNTIME_PROPERTY, env.targetRuntimesContain("swf10") ? "swf10" : "swf9");
      // Problem here, need to set this on clone of properties , so we don't bash the global compilation env
      CompilationEnvironment.setRuntimeConstants("swf10", cprops, mEnv);
      // We are building a precompiled flash 10 .swc library for the LZO.
      cprops.put(org.openlaszlo.sc.Compiler.COMPILE_TYPE, SWF9ParseTreePrinter.Config.LZOLIB);
      mSWF10Writer = new SWF9Writer(cprops, mStream, cache, true, mEnv);
    } 
  }


    public final static String LZO_MAIN_CLASSNAME = "LZOApplication";

  /** Creates boilerplate lzo library 'main class' entry point.
      This is a class into which all top level statements will get placed by the swf9 backend compiler.

      When compiling an app with lzo's that have precompiled swc
      libraries in them, it should call the 'runTopLevelDefinitions'
      of each of it's lzo libraries 'main' classes.
   */
    public String makeLZOPreamble(String lzoSanitizedName) {
        // Turn off all annotation for the preamble
        String source = "{\n#pragma 'debug=false'\n#pragma 'debugSWF9=false'\n#pragma 'debugBacktrace=false'\n";
        source += "public class " + lzoSanitizedName +  " extends LZOApplication {\n " + SWF9Writer.imports + "\n" +
          "public function "+lzoSanitizedName +"(){ super(); } "+
          "}\n";
        source += "\n}\n";
        return source;
    }

  
  /** Add any external lzo files to link against to the
   * runtime-specific ObjectWriters, in case they require it (only
   * swf10 actuall uses this at linking right now)
   */
  public void addLZOFile(File lzo) {
    super.addLZOFile(lzo);
    if (mSWF10Writer != null) {
      mSWF10Writer.addLZOFile(lzo);
    }
    if (mDHTMLWriter != null) {
      mDHTMLWriter.addLZOFile(lzo);
    }
  }

  public static String fileToSymbol(File appfile) {
    try {
      String lzoAbsPath = appfile.getCanonicalPath();
      lzoAbsPath = lzoAbsPath.substring(0,lzoAbsPath.length()-4);
      String relPath = FileUtils.relativePath(lzoAbsPath, LPS.HOME());
      // remove "/" and "." from pathname, replace with "_"
      relPath += relPath.hashCode();
      String safename = "";
      for (int i = 0; i < relPath.length(); i++) {
        if (Character.isJavaIdentifierPart(relPath.charAt(i))) {
          safename += relPath.charAt(i);
        } else {
          safename += "_";
        }
      }
      return safename;
    } catch (IOException e) {
      throw new CompilationError("Could not generate classname from LZO file name "+appfile);
    }
  }

  // Returns true if s is a legal Java identifier.
  public static boolean isJavaIdentifier(String s) {
    if (s.length() == 0 || !Character.isJavaIdentifierStart(s.charAt(0))) {
      return false;
    }
    for (int i=1; i<s.length(); i++) {
      if (!Character.isJavaIdentifierPart(s.charAt(i))) {
        return false;
      }
    }
    return true;
  }



  /** For an lzo library, we look at the runtimes specified, and
   * create ObjectWriters if needed for DHTML and/or SWF10 if requested.
   */
  public void open(String compileType) {
    CompilerMediaCache mcache = mEnv.getMediaCache();
    if (mSWF10Writer != null) {
      String safename = fileToSymbol(mEnv.getApplicationFile());
      mSWF10Writer.mAppMainClassname = safename;
      mSWF10Writer.mAppPreamble = makeLZOPreamble(safename);

      mSWF10Writer.open(SWF9ParseTreePrinter.Config.LZOLIB);
    }
    if (mDHTMLWriter != null) {
      mDHTMLWriter.open(SWF9ParseTreePrinter.Config.LZOLIB);
    }

  }

  public int addScript(String script) {
    int val = super.addScript(script);
    if (mDHTMLWriter != null) {
      mDHTMLWriter.addScript(script);
    }
    if (mSWF10Writer != null) {
      mSWF10Writer.addScript(script);
    }
    return val;
  } 

  /**
   * Sets the canvas for the app
   *
   * @param canvas
   *
   */
  // TODO: [[2007-01-30 ptw] This should become an error
  void setCanvas(Canvas canvas, String canvasConstructor) {
  }

  private void exportInterface() {
    mPrintStream.println(mEnv.getSchema().toLZX());
  }

  private String libraries() {
    StringWriter writer = new StringWriter();
    PrintWriter sout = new PrintWriter(writer);
    String indent = "";
    for (Iterator i = includes.keySet().iterator(); i.hasNext(); ) {
      File library = (File)i.next();
      if (! autoIncludes.containsKey(library)) {
        String path = adjustResourcePath(library.getPath());
        sout.println(indent + path);
        indent = "  ";
      }
    }
    String result = writer.toString();
    if (result.length() > 0) {
      return " includes=\"" + result.substring(0, result.length()-1) + "\"";
    }
    return "";
  }

  void exportIncludes() {
    Set implicit = new HashSet();
    for (Iterator i = autoIncludes.keySet().iterator(); i.hasNext(); ) {
      File key = (File)i.next();
      if (! implicit.contains(key)) {
        Set subIncludes = (Set)autoIncludes.get(key);
        if (subIncludes != null) {
          // An auto-include will not have been parsed for sub-includes?
          implicit.addAll(subIncludes);
        }
        String path = adjustResourcePath(key.getPath());
        mPrintStream.println("<include href='" + path + "' />");
      }
    }
  }

  public void finish(boolean isMainApp) throws IOException {
    //Should we emit javascript or SWF?
    //boolean emitScript = mEnv.isLibrary();

    if (mCloseCalled) {
      throw new IllegalStateException("LibraryWriter.close() called twice");
    }

    try {
      endExportScript();
      exportInterface();

      mPrintStream.println("</library>");
      mPrintStream.flush();
      zout.closeEntry();

      if (mSWF10Writer != null) {
        String nameWithOptions = addLZOCompilerOptionFlags("swc", mEnv);
        zout.putNextEntry(new ZipEntry(nameWithOptions));
        mSWF10Writer.setOutputStream(zout);
        mSWF10Writer.finish(false);
        zout.closeEntry();
      }

      if (mDHTMLWriter != null) {
        String nameWithOptions = addLZOCompilerOptionFlags("js", mEnv);
        zout.putNextEntry(new ZipEntry(nameWithOptions));
        mDHTMLWriter.setOutputStream(zout);
        mDHTMLWriter.finish(false);
        zout.closeEntry();
      }
    } finally {
      zout.close();
    }
    mCloseCalled = true;
  }

  // schema and resources have been defined, output them now, and prepare to accept script blocks
  // from the compile phase of the compiler
  public void schemaDone() throws IOException {
    try {
      Properties props = (Properties)mProperties.clone();

      ToplevelCompiler.getLibraries(mEnv, root, null, autoIncludes, includes);

      mPrintStream.println("<!-- This is a binary library.  Not meant for human consumption. -->");
      mPrintStream.println("<!-- DO NOT EDIT THIS FILE.  Edit the source and recompile with `-c` -->");
      mPrintStream.println("<library" + libraries() + ">");

      exportIncludes();
      exportResources();
      beginExportScript();

      // trampoline calls to runtime-specific object writers
      if (mSWF10Writer != null) {
        mSWF10Writer.schemaDone();
      }

      if (mDHTMLWriter != null) {
        mDHTMLWriter.schemaDone();
      }

      
    } catch (Exception e) {
      throw new ChainedException(e);
    }
  }

}

/**
 * @copyright Copyright 2008, 2009, 2010 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
