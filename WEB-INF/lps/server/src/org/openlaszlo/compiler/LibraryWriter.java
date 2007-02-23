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

import org.jdom.Element;

import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.sc.JavascriptCompressor;
import org.openlaszlo.utils.*;

import org.openlaszlo.iv.flash.util.FontsCollector;

/** Accumulates code, XML, and assets to a Library object file.
 *
 * Properties documented in Compiler.getProperties.
 */
class LibraryWriter extends SWFWriter {

  PrintStream out;
  protected PrintWriter scriptWriter = null;
  protected StringWriter scriptBuffer = null;
  Element root;

  LibraryWriter(Properties props, OutputStream stream,
                CompilerMediaCache cache,
                boolean importLibrary,
                CompilationEnvironment env) {
    super(props, stream, cache, importLibrary, env);
    this.scriptBuffer = new StringWriter();
    this.scriptWriter= new PrintWriter(scriptBuffer);
    try {
      this.out = new PrintStream(new java.util.zip.GZIPOutputStream(mStream));
    } catch (Exception e) {
      throw new ChainedException(e);
    }
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

  void setRoot(Element root) {
    this.root = root;
  }

  // TODO: [[2007-01-30 ptw] This should become an error
  void setCanvasDefaults(Canvas canvas, CompilerMediaCache mc) { };

  public int addScript(String script) {
    scriptWriter.println(script);
    return script.length();
  }

  private Map resourceMap = new LinkedHashMap();

    public void importResource(String fileName, String name)
        throws ImportResourceError
    {
        importResource(fileName, name, -1);
    }

    public void importResource(String fileName, String name, int frameNum)
        throws CompilationError
    {
        importResource(fileName, name, frameNum, null);
    }

    public String importResource(File file)
    {
      System.err.println("importResource: " + file.toString());
      String clipName = createName();
      importResource(file.getPath(), clipName);
      return clipName;
    }

    public String importClickResource(File file) throws ImportResourceError
    {
      System.err.println("importClickResource: " + file.toString());
      return importResource(file);
    }


  public void importResource(String fileName, String name, int frameNum, FontsCollector fontsCollector)
    throws ImportResourceError
    {
      resourceMap.put(name, fileName);
    }

    public void importResource(List sources, String name, File parent)
    {
        importResource(sources, name, parent, -1);
    }

    public void importResource(List sources, String name, File parent, int frameNum)
    {
        importResource(sources, name, parent, frameNum, null);
    }

  public void importResource(List sources, String name, File parent, int frameNum, FontsCollector fontsCollector)
    {
     resourceMap.put(name, sources);
    }

  private String adjustResourcePath(String src) {
    try {
      return new URL(src).toString();
    } catch (MalformedURLException e) {
      try {
        String outdir = mEnv.getObjectFile().getCanonicalFile().getParent();
        File file = new File(src).getCanonicalFile();
        return FileUtils.adjustRelativePath(file.getName(), outdir, file.getParent());
      } catch (IOException f) {
        return src;
      }
    }
  }

  private void exportResources() {
    for (Iterator i = resourceMap.entrySet().iterator(); i.hasNext(); ) {
      Map.Entry entry = (Map.Entry)i.next();
      Object value = entry.getValue();
      if (value instanceof List) {
        out.println("<resource name='" + entry.getKey() + "'>");
        for (Iterator j = ((List)value).iterator(); j.hasNext(); ) {
          // Make relative to lib
          String src = adjustResourcePath((String)j.next());
          out.println("  <frame src='" + src + "' />");
        }
        out.println("</resource>");
      } else {
        // Make relative to lib
        String src = adjustResourcePath((String)value);
        out.println("<resource name='" + entry.getKey() + "' src='" + src + "' />");
      }
    }
  }

  private void exportInterface() {
    out.println(mEnv.getSchema().toLZX());
  }

  private void exportScript() {
    out.println("<script when='immediate' type='LZBinary'>\n<![CDATA[\n");
    // Write 'compressed' output
    org.openlaszlo.sc.parser.SimpleNode program =
      (new org.openlaszlo.sc.Compiler.Parser()).parse(scriptBuffer.toString());
    JavascriptCompressor compressor = new JavascriptCompressor();
    program = compressor.compress(program);
    boolean compress = (! mEnv.getProperty(org.openlaszlo.sc.Compiler.NAME_FUNCTIONS, "false").equals("true"));
    boolean obfuscate = compress || mEnv.getProperty(org.openlaszlo.sc.Compiler.OBFUSCATE, "false").equals("true");
    (new org.openlaszlo.sc.Compiler.ParseTreePrinter(compress, obfuscate)).print(program, out);
    out.println("\n]]>\n</script>");
  } 
  
  private String libraries() {
    Set autoIncludes = new HashSet();
    Set includes = new TreeSet();
    ToplevelCompiler.getLibraries(mEnv, root, null, autoIncludes, includes);
    StringWriter writer = new StringWriter();
    PrintWriter out = new PrintWriter(writer);
    String indent = "";
    for (Iterator i = includes.iterator(); i.hasNext(); ) {
      File library = (File)i.next();
      if (! autoIncludes.contains(library)) {
        String path = adjustResourcePath(library.getPath());
        out.println(indent + path);
        indent = "  ";
      }
    }
    String result = writer.toString();
    if (result.length() > 0) {
      return " includes=\"" + result.substring(0, result.length()-1) + "\"";
    }
    return "";
  }

  public void close() throws IOException {
    //Should we emit javascript or SWF?
    //boolean emitScript = mEnv.isLibrary();

    if (mCloseCalled) {
      throw new IllegalStateException("LibraryWriter.close() called twice");
    }

    try {
      Properties props = (Properties)mProperties.clone();

      out.println("<!-- This is a binary library.  Not meant for human consumption. -->");
      out.println("<!-- DO NOT EDIT THIS FILE.  Edit the source and recompile with `-c` -->");
      out.println("<library" + libraries() + ">");
      exportInterface();
      exportResources();
      exportScript();
      out.println("</library>");
    } catch (Exception e) {
      throw new ChainedException(e);
    } finally {
      out.close();
    }

    mCloseCalled = true;
  }

}

/**
 * @copyright Copyright 2007 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
