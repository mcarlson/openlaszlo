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
class IntermediateWriter extends DHTMLWriter {

  Element root;
  JavascriptCompressor mCompressor;
  org.openlaszlo.sc.Compiler.Parser mParser;

  IntermediateWriter(Properties props, OutputStream stream,
                CompilerMediaCache cache,
                boolean importLibrary,
                CompilationEnvironment env,
                Element root) {
    super(props, stream, cache, importLibrary, env);
    this.root = root;
    mCompressor = new JavascriptCompressor(props);
    mParser = new org.openlaszlo.sc.Compiler.Parser();
  }

  public void open(String compileType) {
    // We don't do anything except write input to output
  }

  void setCanvas(Canvas canvas, String canvasConstructor) {
    // Don't write out any canvas script, the script for a canvas will be created
    // from the <canvas> tag that we write when the .lzi file is compiled.
  }

  void beginExportScript() {
    // Lists the runtimes that we have precompiled object libraries for.
    String runtimes = "runtimes='"+mEnv.getProperty(CompilationEnvironment.RUNTIMES_PROPERTY)+"'";
    String compilerOptions = "options='" +
      "debug:"+mEnv.getBooleanProperty(mEnv.DEBUG_PROPERTY) + ";" +
      "backtrace:"+mEnv.getBooleanProperty(mEnv.BACKTRACE_PROPERTY) + ";" +
      "profile:"+mEnv.getBooleanProperty(mEnv.PROFILE_PROPERTY) +
      "'";
    mPrintStream.println("<script when='immediate' type='LZBinary' "+runtimes+ " "+compilerOptions+">\n<![CDATA[\n");
  }

  public int addScript(String script) {
    // Write 'compressed' output
    org.openlaszlo.sc.parser.SimpleNode program =
      mParser.parse(script);
    // Cf., ScriptCompiler _compileToByteArray
    mCompressor.compress(program, mPrintStream);
    mPrintStream.flush();
    return script.length();
  }

  public void endExportScript() {
    mPrintStream.println("\n]]>\n</script>");
  }
  
  // Must preserve visited order for output of includes
  Map autoIncludes = new LinkedHashMap();
  Map includes = new LinkedHashMap();

  List resourceList = new LinkedList();

    String adjustResourcePath(String src) {
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



  class ResourceDescriptor {
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

  void exportResources() {
    for (Iterator i = resourceList.iterator(); i.hasNext(); ) {
      ResourceDescriptor resource = (ResourceDescriptor)i.next();
      mPrintStream.println(resource.toLZX());
    }
  }



  /** This is just used for outputting the lzs script for debugging, before it's been parsed at all by the script compiler */
  public void finish(boolean isMainApp) throws IOException {
    if (mCloseCalled) {
      throw new IllegalStateException("IntermediateWriter.close() called twice");
    }

    try {
      exportResources();

    } catch (Exception e) {
      throw new ChainedException(e);
    } 

  }

  public void close() throws IOException {
    mPrintStream.close();
    mCloseCalled = true;
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

}

/**
 * @copyright Copyright 2008, 2009, 2010 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
