/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * Main entry point for the Javascript compiler
 *
 * @author osteele@osteele.com
 * @author ptw@openlaszlo.org
 * @author bshine@openlaszlo.org
 */

package org.openlaszlo.sc;


import java.io.*;
import java.util.*;
import java.text.DecimalFormat;
// swf writing support
import org.openlaszlo.iv.flash.api.FlashFile;
import org.openlaszlo.iv.flash.api.Script;
import org.openlaszlo.iv.flash.api.action.Program;
import org.openlaszlo.iv.flash.api.Frame;
import org.openlaszlo.iv.flash.api.action.DoAction;
import org.openlaszlo.iv.flash.util.FlashOutput;
import org.openlaszlo.iv.flash.util.FlashBuffer;
import org.openlaszlo.utils.FileUtils;
//
import org.openlaszlo.sc.Compiler;
import org.openlaszlo.server.LPS;

public class lzsc  {
  private static final String[] USAGE = {
    "Usage: lzsc [options] scriptfile",
    "",
    "Options:",
    "--help",
    "  Prints this message.",
    "--runtime=(swf7|swf8|swf9|dhtml|j2me|svg)",
    "   specify which runtime to compile code to. Only swf7, swf8, and dhtml are supported",
    "--debug",
    "   include debugging information in output file",
    "--profile",
    "   include profiling information in output file",
    "--Dname=value",
    "  set a compile-time constant",
    "--option compilerOption[=value]",
    "   set a compiler option",
    "--incremental",
    "   for LFC debugging, not supported",
    "--delete",
    "   for LFC debugging, not supported",
    "",
    "Output options:",
    "-o outputfile"
  };

  /**
   * Compiles a Javascript file to the output file for the specified runtime.  This method is for command-line invocation of the script compiler.
   */
  public static void main (String[] argv) {
    lzsc compiler = new lzsc();
    System.exit(compiler.compile(argv));
  }

  /**
   * Prints usage string
   */
  public void usage(String msg) {
    if (msg != null) {
      System.err.println("Error: " + msg);
      System.err.println("Use --help for more information");
    } else {
      for (int j = 0; j < USAGE.length; j++) {
        System.err.println(USAGE[j]);
      }
    }
  }

  /**
   * Include file resolver
   */
  static class Resolver {
    File base;

    Resolver (String base) {
      this.base = new File(base).getParentFile();
    }

    String resolve(String pathname) {
      return (new File(this.base, pathname)).getPath();
    }
  }

  /**
   * Interface to the compiler
   */
  public int compile(String outf, String scriptfile, Map options) throws Exception {
    // Default options for LFC compiling
    options.put("flashCompilerCompatability", Boolean.TRUE);
    options.put("processIncludes", Boolean.TRUE);
    options.put("resolver", new Resolver(scriptfile));

    try {
      Compiler c = new Compiler(options);
      InputStream f = null;
      byte[] bytes;
      try {
        f = new FileInputStream(scriptfile);
        bytes = new byte[f.available()];
        f.read(bytes);
        bytes = c.compile(("#file " + scriptfile + "\n#line 1\n" + new String(bytes)));
      }
      finally {
        if (f != null) {
          f.close();
        }
      }

      String runtime = (String)options.get(Compiler.RUNTIME);
      // Must be kept in sync with server/src/org/openlaszlo/compiler/Compiler.java creatObjectWriter
      if ("dhtml".equals(runtime) || "j2me".equals(runtime) || "svg".equals(runtime) || "swf9".equals(runtime) ) {
        OutputStream ostr = new FileOutputStream(outf);
        try {
          ostr.write(bytes);
        }
        finally {
          ostr.close();
        }
        return 0;
      } else if ("swf7".equals(runtime) || "swf8".equals(runtime)) {
        // new a Flash file, stuff bytes into it
        FlashFile newfile = FlashFile.newFlashFile();
        if ("swf7".equals(runtime)) {
          newfile.setVersion(7);
        } else if ("swf8".equals(runtime)) {
          newfile.setVersion(8);
        }

        Script mainScript = new Script(1);
        mainScript.setMain();
        newfile.setMainScript(mainScript) ;
        Frame frame = newfile.getMainScript().getFrameAt(0);
        Program program = new Program(bytes, 0, bytes.length);
        DoAction block = new DoAction(program);
        frame.addFlashObject(block);
        FlashOutput flashbuf = newfile.generate();
        InputStream instream = flashbuf.getInputStream();

        OutputStream outstream = new FileOutputStream(outf);
        FileUtils.send(instream, outstream);;
        outstream.close();
      } else {
        throw new RuntimeException("don't know runtime " + runtime);
      }
    } catch (IOException e) {
      System.err.println("IOException compiling scriptfile " + scriptfile);
      throw e;
    } catch (Exception e) {
      System.err.println("Exception compiling scriptfile: " + e.getMessage());
      throw e;
    }
    return 0;
  }

  Map compileTimeConstants = new HashMap();
  Map compilerOptions = new HashMap();

  // Must be kept in sync with server/src/org/openlaszlo/compiler/Compiler.java compile
  boolean setRuntime(String runtime) {
    if (! ("dhtml".equals(runtime) || "j2me".equals(runtime) || "svg".equals(runtime) || "swf9".equals(runtime) ||
           "swf7".equals(runtime) || "swf8".equals(runtime))) {
      usage("runtime must be one of swf7, swf8, swf9, dhtml, j2me, svg");
      return false;
    }
    compileTimeConstants.put("$runtime", runtime);

    // Kludges until compile-time constants can be expressions
    compileTimeConstants.put("$swf7", Boolean.valueOf("swf7".equals(runtime)));
    compileTimeConstants.put("$swf8", Boolean.valueOf("swf8".equals(runtime)));
    compileTimeConstants.put(
      "$as2",
      Boolean.valueOf("swf7".equals(runtime) || "swf8".equals(runtime) ));
    compileTimeConstants.put("$swf9", Boolean.valueOf("swf9".equals(runtime)));
    compileTimeConstants.put("$as3", Boolean.valueOf("swf9".equals(runtime)));
    compileTimeConstants.put("$dhtml", Boolean.valueOf("dhtml".equals(runtime)));
    compileTimeConstants.put("$j2me", Boolean.valueOf("j2me".equals(runtime)));
    compileTimeConstants.put("$svg", Boolean.valueOf("svg".equals(runtime)));
    compileTimeConstants.put(
      "$js1",
      Boolean.valueOf("dhtml".equals(runtime) || "j2me".equals(runtime) || "svg".equals(runtime)));

    compilerOptions.put(Compiler.RUNTIME, runtime);
    return true;
  }

  static DecimalFormat secondsFormatter = new DecimalFormat("0.00");

  /**
   * Command-line interface, but returns a status rather than exiting
   */
  public int compile(String[] argv) {
    String outf = null;
    boolean deleteFile = false;
    String scriptFile = null;
    boolean incremental = false;

    String defaultRuntime = LPS.getProperty("compiler.runtime.default", "swf7");
    // default constants
    compileTimeConstants.put("$debug", Boolean.FALSE);
    compileTimeConstants.put("$profile", Boolean.FALSE);

    // default options
    compilerOptions.put(Compiler.CONDITIONAL_COMPILATION, Boolean.TRUE);
    compilerOptions.put(Compiler.CACHE_COMPILES, Boolean.TRUE);

    // set default runtime
    if (! setRuntime(defaultRuntime)) { return 1; }

    List args = new ArrayList();

    for (Iterator i = Arrays.asList(argv).iterator(); i.hasNext(); ) {
      String opt = (String)i.next();
      String arg = null;
      // primitive getopt(args, "D:o:hgpk",
      //      {"help", "incremental", "default=", "delete","runtime=",
      //          "debug", "profile", "krank", "option="})
      if (opt.startsWith("-D") || opt.startsWith("-o")) {
        if (opt.length() > 2) {
          arg = opt.substring(2, opt.length());
          opt = opt.substring(0, 2);
        } else {
          if (! i.hasNext()) {
            usage(opt + " requires an argument");
            return 1;
          }
          arg = (String)i.next();
        }
      } else if (opt.startsWith("--default") || opt.startsWith("--runtime") || opt.startsWith("--option")) {
        int eq = opt.indexOf("=");
        if (eq > 0) {
          arg = opt.substring(eq+1, opt.length());
          opt = opt.substring(0, eq);
        } else {
          if (! i.hasNext()) {
            usage(opt + " requires an argument");
            return 1;
          }
          arg = (String)i.next();
        }
      }
      if ("-h".equals(opt) || "--help".equals(opt)) {
        usage(null);
        return 0;
      } else if ("-o".equals(opt)) {
        outf = arg;
      } else if ("-D".equals(opt)) {
        int eq = arg.indexOf("=");
        if (eq < 0) {
          usage("-D requires a identifier=value expression");
          return 1;
        }
        String key = arg.substring(0, eq);
        String value = arg.substring(eq+1, arg.length());
        // true and false get coerced to booleans...
        if ("true".equals(value) || "false".equals(value)) {
          compileTimeConstants.put(key, Boolean.valueOf(value));
        } else {
          compileTimeConstants.put(key, value);
        }
      } else if ("--default".equals(opt)) {
        scriptFile = arg;
      } else if ("--delete".equals(opt)) {
        deleteFile = true;
      } else if ("--incremental".equals(opt)) {
        incremental = true;
        compilerOptions.put("cacheCompiles", Boolean.TRUE);
        compilerOptions.put("progress", Boolean.TRUE);
      } else if ("--option".equals(opt)) {
        int eq = arg.indexOf("=");
        if (eq < 0) { 
          compilerOptions.put(arg, Boolean.TRUE);
        } else {
          String key = arg.substring(0, eq);
          String value = arg.substring(eq+1, arg.length());
          // true and false get coerced to booleans...
          if ("true".equals(value) || "false".equals(value)) {
            compilerOptions.put(key, Boolean.valueOf(value));
          } else {
            compilerOptions.put(key, value);
          }
        }
      } else if ("-g".equals(opt) || "--debug".equals(opt)) {
        compilerOptions.put("debug", Boolean.TRUE);
        compileTimeConstants.put("$debug", Boolean.TRUE);
      } else if ("-p".equals(opt) || "--profile".equals(opt)) {
        compilerOptions.put("profile", Boolean.TRUE);
        compileTimeConstants.put("$profile", Boolean.TRUE);
      } else if ("--runtime".equals(opt)) {
        if (! setRuntime(arg)) { return 1; }
      } else {
        args.add(opt);
      }
    }
    compilerOptions.put("compileTimeConstants", compileTimeConstants);
    if (outf == null) {
      usage(" -o is required");
      return 1;
    }
    if (args.size() == 0 && scriptFile != null) { 
      args.add(scriptFile);
    }
    if (args.size() != 1) {
      usage("exactly one file argument is required");
      return 1;
    }
    while (true) {
      if (deleteFile) {
        File f = new File(outf);
        if (f.exists()) { f.delete(); }
      }
      long time = System.currentTimeMillis();
      try {
        compile(outf, ((String[])args.toArray(new String[0]))[0], compilerOptions);
      }
      catch (Exception e) {
        e.printStackTrace(System.err);
        System.err.println("Compilation aborted.");
        if (! incremental) {
          return 1;
        }
      }
      time = System.currentTimeMillis() - time;
      if (! incremental) {
        break;
      }
      System.err.println("Compiled " + outf + " in " + secondsFormatter.format(time/1000.0) + " seconds");
      System.err.println("Compile again [Enter | q + Enter]: ");
      // TODO [2007-01-22 ptw]
      String response = ""; // = new String(System.in.read()).toLower();
      if ("q".equals(response)) {
        break;
      }
    }
    return 0;
  }

  /**
   * Stub for interactive testing
   */
  int test() {
    String lfcPath = "../../lfc";
    return compile(new String[] {
        "-o", lfcPath + "/LFC7-debug.lzl",
        //          "--option", "nameFunctions=true", "-D$debug=true",
        "--option", "generateFunction2=true",
        "--option", "cacheCompiles=true",
        "--option", "progress=true",
        "--option", "warnGlobalAssignments=true",
        "--runtime=dhtml",
        lfcPath + "/LaszloLibrary.as"
      });
  }

}

/**
 * @copyright Copyright 2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
