/* -*- mode: Java; c-basic-offset: 2; -*- */
/***
 * DHTMLCompiler.java
 * Author: Henry Minsky
 * Description: JavaScript -> DHTML compiler
 */

package org.openlaszlo.sc;

import java.io.*;
import java.util.*;
import org.openlaszlo.server.LPS;
import org.openlaszlo.sc.parser.*;
import org.openlaszlo.sc.Translator;
import org.openlaszlo.utils.LZUtils;

public class DHTMLCompiler extends Compiler {


  public DHTMLCompiler (Map initialOptions) {
    super(initialOptions);
  }

  ScriptCompilerInfo mInfo;

  /** temp file to accumulate script output */
  File mAppFile;
  PrintWriter mOut;

  static int objfileCounter = 1;

  public void startApp() {
    super.startApp();
    profiler = new Profiler();
    cg = new JavascriptGenerator();
    cg.setOptions(options);
    boolean compress = (! options.getBoolean(NAME_FUNCTIONS));
    boolean obfuscate = options.getBoolean(OBFUSCATE);

    mInfo = (ScriptCompilerInfo) options.get(Compiler.COMPILER_INFO);

    if (mInfo == null) {
      mInfo = new ScriptCompilerInfo();
    }

    // Create temp app output file
    File workdir = SWF9External.createCompilationWorkDir(false, mInfo);
    mAppFile = new File (workdir.getPath() + File.separator + "obj"+(objfileCounter++) + ".js");

    // JavascriptGenerator will append output from each compileBlock() call to this file.
    try {
      if (mAppFile.exists()) {
        mAppFile.delete();
      }
      mOut = new PrintWriter(new FileWriter(mAppFile));
      ((JavascriptGenerator)cg).setupParseTreePrinter(compress, obfuscate, mOut);
    } catch (IOException e) {
      throw(new CompilerException(e.toString()));
    }
  }

  // Returns byte stream of compiled app.swf file
  public InputStream finishApp() {
    try {
      ((JavascriptGenerator)cg).finish();
      mOut.close();
      return new FileInputStream(mAppFile);
    } catch (IOException e) {
      throw(new CompilerException(e.toString()));
    }
  }

}

/**
 * @copyright Copyright 2001-2010 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
