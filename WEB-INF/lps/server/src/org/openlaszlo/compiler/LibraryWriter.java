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

import org.openlaszlo.sc.ParseTreePrinter;
import org.openlaszlo.sc.ScriptCompiler;
import org.openlaszlo.sc.JavascriptCompressor;
import org.openlaszlo.sc.Compiler;
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

  private List resourceList = new LinkedList();

  private class ResourceDescriptor {
    String name;
    String file = null;
    List sources = null;
    ResourceCompiler.Offset2D offset = null;

    ResourceDescriptor (String name, String file, ResourceCompiler.Offset2D offset) {
      this.name = name;
      this.file = file;
      this.offset = offset;
    }

    ResourceDescriptor (String name, List sources, ResourceCompiler.Offset2D offset) {
      this.name = name;
      this.sources = sources;
      this.offset = offset;
    }

    String toLZX () {
      String result = "<resource name='" + name + "'";
      if (this.file != null) {
        result += " src='" + adjustResourcePath(file) + "'";
      }
      if (offset != null) {
        result += " offsetx='" + offset.offsetx + "' offsety='" + offset.offsety + "'";
      }
      if (this.sources == null) {
        result += " />";
      } else {
        result += ">";
        for (Iterator j = sources.iterator(); j.hasNext(); ) {
          result += "\n  <frame src='" + adjustResourcePath((String)j.next()) + "' />";
        }
         result += "\n</resource>";
      }
      return result;
    }
  }


  /** Import a resource file into the current movie.
   * Using a name that already exists clobbers the
   * old resource (for now).
   *
   * @param fileName file name of the resource
   * @param name name of the MovieClip/Sprite
   * @throws CompilationError
   */
  public void importResource(File inputFile, String name)
    {
      importResource(inputFile.toString(), name, null);
    }

  public void importResource(String fileName, String name)
    {
      importResource(fileName, name, null);
    }

  public void importResource(File inputFile, String name, ResourceCompiler.Offset2D offset)
    {
      importResource(inputFile.toString(), name, offset);
    }

  public void importResource(String fileName, String name, ResourceCompiler.Offset2D offset)
    {
      resourceList.add(new ResourceDescriptor(name, fileName, offset));
    }

  public void importResource(List sources, String name, File parent)
    {
      importResource(sources, name, parent, null);
    }

  public void importResource(List sources, String name, File parent, ResourceCompiler.Offset2D offset)
    {
      resourceList.add(new ResourceDescriptor(name, sources, offset));
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

  private void exportAttributes() {}

  private void exportResources() {
    for (Iterator i = resourceList.iterator(); i.hasNext(); ) {
      ResourceDescriptor resource = (ResourceDescriptor)i.next();
      out.println(resource.toLZX());
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
    // Cf., ScriptCompiler _compileToByteArray
    JavascriptCompressor compressor = new JavascriptCompressor(mProperties);
    compressor.compress(program, out);
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
 * @copyright Copyright 2008, 2009 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
