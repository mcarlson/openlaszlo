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

/** Accumulates code, XML, and assets to a Library object file.
 *
 * Properties documented in Compiler.getProperties.
 */
class LibraryWriter extends DHTMLWriter {

  PrintStream out;
  Element root;

  LibraryWriter(Properties props, OutputStream stream,
                CompilerMediaCache cache,
                boolean importLibrary,
                CompilationEnvironment env,
                Element root) {
    super(props, stream, cache, importLibrary, env);

    try {
      this.out = new PrintStream(new java.util.zip.GZIPOutputStream(mStream));
    } catch (Exception e) {
      throw new ChainedException(e);
    }
    this.root = root;
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

  private Map resourceMap = new TreeMap();

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
      resourceMap.put(name, fileName);
    }

  public void importResource(File inputFile, String name)
    throws ImportResourceError
    {
      importResource(inputFile.toString(), name);
    }

  public void importResource(List sources, String name, File parent)
    {
     resourceMap.put(name, sources);
    }

  private String adjustResourcePath(String src) {
    try {
      return new URL(src).toString();
    } catch (MalformedURLException e) {
      try {
        String outdir = FileUtils.toURLPath(mEnv.getObjectFile().getCanonicalFile().getParentFile());
        File file = new File(src).getCanonicalFile();
        return FileUtils.adjustRelativePath(file.getName(),
                                            outdir,
                                            FileUtils.toURLPath(file.getParentFile()));
      } catch (IOException f) {
        return src;
      }
    }
  }

  private void exportAttributes() {
      // Write out the validate attribute of the source library, but only if
      // it was explicitly defined by the user
      String property   = CompilationEnvironment.VALIDATE_PROPERTY;
      String e_property = CompilationEnvironment.VALIDATE_EXPLICIT_PROPERTY;
      String validate   = mEnv.getProperty(property, null);
      String e_validate = mEnv.getProperty(e_property, null);
      if (e_validate != null && validate != null) {
        out.println("<attribute name='" + property + "' value='" + validate + "' />");
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
  
  // Must preserve visited order for output of includes
  private Map autoIncludes = new LinkedHashMap();
  private Map includes = new LinkedHashMap();

  private String libraries() {
    StringWriter writer = new StringWriter();
    PrintWriter out = new PrintWriter(writer);
    String indent = "";
    for (Iterator i = includes.keySet().iterator(); i.hasNext(); ) {
      File library = (File)i.next();
      if (! autoIncludes.containsKey(library)) {
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

  private void exportIncludes() {
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
        out.println("<include href='" + path + "' />");
      }
    }
  }

  public void close() throws IOException {
    //Should we emit javascript or SWF?
    //boolean emitScript = mEnv.isLibrary();

    if (mCloseCalled) {
      throw new IllegalStateException("LibraryWriter.close() called twice");
    }

    try {
      Properties props = (Properties)mProperties.clone();

      ToplevelCompiler.getLibraries(mEnv, root, null, autoIncludes, includes);

      out.println("<!-- This is a binary library.  Not meant for human consumption. -->");
      out.println("<!-- DO NOT EDIT THIS FILE.  Edit the source and recompile with `-c` -->");
      out.println("<library" + libraries() + ">");
      exportAttributes();
      exportIncludes();
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
