/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * SWF9 calls to external compiler
 *
 * @author dda@ddanderson.com
 * @author ptw@openlaszlo.org
 * @description: JavaScript -> ActionScript3 translator, calling AS3 compiler -> SW9 
 *
 */

package org.openlaszlo.sc;
import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.openlaszlo.sc.parser.*;
import org.openlaszlo.server.LPS;

/** Flex OEM compiler API 
 * See http://livedocs.adobe.com/flex/3/compilerAPI_flex3.pdf 
 *
 * source code in flex sources at modules/compiler/src/java/flex2/tools/oem/internal/*.java
 */
import flex2.tools.oem.Application;
import flex2.tools.oem.Configuration;
import flex2.tools.oem.Library;
import flex2.tools.oem.Builder; 
import flex2.tools.oem.Message; 
import flex2.tools.oem.Logger; 


/**
 * The SWF9External manages communication with the
 * external compiler - generation of source files,
 * calling the compiler, packaging up the result and
 * interpreting error messages.
 *
 * It is expected that a new SWF9External object
 * be created for each chunk of compilation.  Each
 * new SWF9External gets a new temporary 'work' directory
 * for compilation, and verifies classname uniqueness
 * within that space.
 */
public class SWF9External {

  /** Number of errors shown before truncating */
  static public final int MAX_ERRORS_SHOWN = 50;

  // TODO: [2007-12-12 dda] make USE_COMPILER_DEBUG_FLAG a compiler option.
  /**
   * When set, use the debug flag for the compiler
   */
  public static final boolean USE_COMPILER_DEBUG_FLAG = true;

  /**
   * A directory we create under the Java runtime's temp dir,
   * that contains our compilation work directories, one for each compilation.
   */
  public static final String WORK_DIR_PARENT = "lzswf9";

  /**
   * The prefix for naming the work directories, which appear
   * under the WORK_DIR_PARENT in the Java runtime's temp dir.
   * For example, /tmp/lzswf9/lzgen...., although /tmp
   * may be replaced by something else when running within
   * tomcat or another application server.
   */
  public static final String WORK_DIR_PREFIX = "lzgen";

  private File workdir = createCompilationWorkDir();
  private Compiler.OptionMap options;

  /**
   * The key is the 'tolower' name, the value is the actual name.
   */
  private HashMap uniqueFileNames = new HashMap();

  public SWF9External(Compiler.OptionMap options) {
    this.options = options;
  }

  /**
   * Return the bytes in a file
   */
  public static byte[] getBytes(String filename)
    throws IOException
  {
    File f = new File(filename);
    long len = f.length();

    // Passing around byte arrays has limitations.
    if (len > Integer.MAX_VALUE)
      throw new IOException(filename + ": output too large");

    byte[] result = new byte[(int)len];
    int pos = 0;

    FileInputStream fis = null;
    try {
      fis = new FileInputStream(filename);
      while (pos < len) {
        int nbytes = fis.read(result, pos, (int)len - pos);
        if (nbytes < 0) {
          // premature end of file.  File.length() lied or the
          // length of the file changed out from under us.
          // Either way, we cannot trust it.
          throw new IOException(filename + ": file size discrepency byte " +
                                pos + "/" + len);
        }
        pos += nbytes;
      }
      // Sanity check, make sure file hasn't been appended to
      if (fis.read() != -1)
        throw new IOException(filename + ": file growing during read at byte " +
                              pos);
    }
    finally {
      closeit(fis);
    }
    return result;
  }

  /**
   * Create a temporary work directory for compilation
   * and return a File for it.
   * @throw CompilerError when directory creation fails
   */
  private File createCompilationWorkDir()
  {
    // TODO: [2007-11-20 dda] Need some provisions for file
    // cleanup on error, and on success too.

    File f = null;
    try {
      String tmpdirstr = System.getProperty("java.io.tmpdir");
      String swf9tmpdirstr = tmpdirstr + File.separator + WORK_DIR_PARENT;
      (new File(swf9tmpdirstr)).mkdirs();
        
      f = File.createTempFile(WORK_DIR_PREFIX, "", new File(swf9tmpdirstr));
      if (!f.delete())
        throw new CompilerError("getCompilationWorkDir: temp file does not exist");
      if (!f.mkdir())
        throw new CompilerError("getCompilationWorkDir: cannot make workdir");
    }
    catch (IOException ioe) {
      throw new CompilerError("getCompilationWorkDir: cannot get temp directory: " + ioe);
    }
    return f;
  }

  /**
   * For a relative file name, return an absolute path name
   * as the file would appear in the work directory for the compiler.
   */
  public String workDirectoryName(String file)
  {
    if (new File(file).isAbsolute()) {
      throw new IllegalArgumentException("workDirectoryName: file name must be relative");
    }
    return workdir.getPath() + File.separator + file;
  }


  /**
   * Close an input stream unconditionally.
   */
  public static void closeit(InputStream is)
  {
    try {
      if (is != null)
        is.close();
    }
    catch (IOException ioe) {
      // don't rethrow, we can live with an error during cleanup
      // TODO: [2007-11-20 dda] log this
      System.err.println("Exception closing: " + ioe);
    }
  }

  /**
   * Close an output stream unconditionally.
   */
  public static void closeit(OutputStream os)
  {
    try {
      if (os != null)
        os.close();
    }
    catch (IOException ioe) {
      // don't rethrow, we can live with an error during cleanup
      // TODO: [2007-11-20 dda] log this
      System.err.println("Exception closing: " + ioe);
    }
  }

  /**
   * A collector for an output stream from an external process.
   */
  public static class OutputCollector extends Thread {

    private Exception exception = null;
    private InputStream is;

    // we don't expect this to be terribly big, can fit in memory
    StringBuffer sb = new StringBuffer();

    public OutputCollector(InputStream is) {
      this.is = is;
    }
    
    public void run() {
      try {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        String line;
        while ((line = reader.readLine()) != null) {
          sb.append(line + "\n");
          collect(line);
        }
        reader.close();
      }
      catch (Exception ex) {
        exception = ex;
      }
    }

    public String getOutput() {
      return sb.toString();
    }
    public Exception getException() {
      return exception;
    }
    public void collect(String str) {
      // this version does no more analysis with the output
    }
  }

  /**
   * A single error message from the external compiler.
   */
  public static class ExternalCompilerError {
    private int origlinenum = -1;
    private int linenum;
    private int colnum;

    // The error message
    private String error;

    private String path; // pathname of source file
    private String code = "";
    private String cleanedCode = "";

    private TranslationUnit tunit;

    ExternalCompilerError() {
      this(null, -1, -1, "", "", "");
    }

    ExternalCompilerError(TranslationUnit tunit, int linenum, int colnum, String path, String error, String code) {
      this.tunit = tunit;
      this.linenum = linenum;
      this.colnum = colnum;
      this.error = error;
      this.code = this.cleanedCode = code;
    }

    public String toString() {
      String tunitstr = (tunit == null) ? "unknown" : tunit.getName();
      return "External error: " + tunitstr + ": " + linenum + ": " +
        colnum + ": " + error + ": for line:\n" + code;
    }

    public int getLineNumber() {
      return linenum;
    }

    // returns just the compiler error: e.g.
    //  Error:  variable 'x' undefined
    public String getErrorString() {
      return error;
    }

    // returns the complete the compiler error,
    // but without the positional 'caret', and
    // an indication of where the code starts,
    // other than just a newline.  This is
    // meant to be read in the browser.
    //   Error: variable 'x' undefined, in line: result = x + 4;
    public String cleanedErrorString() {
      String result = error.trim();
      while (result.endsWith("\n") || result.endsWith(".")) {
        result = result.substring(0, result.length() - 1);
      }
      result += ", in line: " + cleanedCode;
      return result;
    }

    public String getCode() {
      return code;
    }

    public String getCleanedCode() {
      return cleanedCode;
    }

    public TranslationUnit getTranslationUnit() {
      return tunit;
    }

  }

  /**
   * Parse and return an integer (a line number).
   * @throw CompilerError when the input string is not a number
   */
  public static int safeInt(String s)
  {
    try {
      return Integer.parseInt(s);
    }
    catch (NumberFormatException nfe) {
      // should be 'impossible' as the pattern matcher should only
      // give us valid numbers.
      throw new CompilerError("Bad linenumber translation: " + s);
    }
  }

  /**
   * True if UNIX quoting rules are in effect.
   */
  public static boolean useUnixQuoting() {
    String osname = System.getProperty("os.name");
    return !osname.startsWith("Windows");
  }

  /**
   * Return a more nicely formatted command line.
   * On UNIX systems, we change '$' to \$' so the
   * output line can be cut and pasted into a shell.
   */
  public String prettyCommand(List cmd)
  {
    String cmdstr = "";
    for (Iterator iter = cmd.iterator(); iter.hasNext(); ) {
      if (cmdstr.length() > 0)
        cmdstr += " ";

      String arg = (String)iter.next();
      if (useUnixQuoting()) {
      
        // goodness, both $ and \ are special characters for regex.
        arg = arg.replaceAll("[$]", "\\\\\\$");
        if (arg.indexOf(' ') >= 0) {
          arg = "\"" + arg + "\"";
        }
      }
      cmdstr += arg;
    }
    return cmdstr;
  }


  static class FlexLogger implements Logger { 
    private List errors = new ArrayList();
    private ExternalCompilerError lastError = null;
    private TranslationUnit[] tunits;


    // Parse out FILENAME from "FILENAME.as", to get classname
    static String pat = "([^\\/]+)\\.as";
    private Pattern errPattern;

    FlexLogger(List tunits) {
      this.tunits = (TranslationUnit[])tunits.toArray(new TranslationUnit[0]);
      errPattern = Pattern.compile(pat);
    } 
    
    public TranslationUnit locateTranslationUnit(String nm)
    {
      for (int i=0; i<tunits.length; i++) {
        if (nm.equals(tunits[i].getName()))
          return tunits[i];
      }
      return null;
    }

    public void log(Message msg, int errorCode, String source) { 
      // errors.add(...)
      String level  =  msg.getLevel(); 
      String path   =  msg.getPath(); 
      int line   =  msg.getLine(); 
      int column =  msg.getColumn(); 

      if (path != null) {
        Matcher matcher = errPattern.matcher(path);
        if (matcher.find()) {
          String classnm = matcher.group(1);
          TranslationUnit tunit = locateTranslationUnit(classnm);
          lastError = new ExternalCompilerError(tunit, line, column, path, msg.toString(), source);
          errors.add(lastError);
        }
      }

    }

    public List getErrors() {
      return errors;
    }


  }

  /**
   * Run the Flex compiler via the Builder API
   * Collect and report any errors, and check for the existence
   * of the output file.
   * @throw CompilerError if there are errors messages from the external
   *        compiler, or if any part of the compilation process has problems
   */
  public void buildAndProcessErrors(Builder builder, List tunits, String outfilename)
    throws IOException          // TODO: [2007-11-20 dda] clean up, why catch only some exceptions?
  {
    FlexLogger logger = new FlexLogger(tunits);

    // Receives compiler warnings and errors, via the Logger api
    builder.setLogger(logger);

    // TODO [2008-06-04 hqm] This is setting "incremental compile" to
    // true, which won't really help but seems like it can't do any
    // harm, right? Someday if we use the VirtualLocalFileSystem API
    // then we could do incremental compiles.
    long exitval = builder.build(true);

    String bigErrorString = "";
    int bigErrorCount = 0;

    List errs = logger.getErrors();
    if (errs.size() > 0) {
      System.err.println("ERRORS: ");
      for (Iterator iter = errs.iterator(); iter.hasNext(); ) {
        ExternalCompilerError err = (ExternalCompilerError)iter.next();
        TranslationUnit tunit = err.getTranslationUnit();
        String srcLineStr;
        int srcLine;

        // actualSrcLine is the name/linenumber of the actual files
        // used in compilation, not the original sources.
        String actualSrcFile = null;
        if (tunit == null) {
          actualSrcFile = "(unknown)";
        }
        else  {
          actualSrcFile = tunit.getSourceFileName();
          if (actualSrcFile == null)
            actualSrcFile = "(" + tunit.getName() + ")";
        }

        String actualSrcLine = "[" + actualSrcFile + ": " + err.getLineNumber() + "] ";

        if (tunit == null ||
            ((srcLine = tunit.originalLineNumber(err.getLineNumber())) <= 0)) {
          srcLineStr = "line unknown: ";
        }
        else {
          srcLineStr = "line " + String.valueOf(srcLine) + ": ";
        }
        System.err.println(actualSrcLine + srcLineStr + err.getErrorString());

        // bigErrorString will be passed as an exception.
        if (bigErrorString.length() > 0) {
          bigErrorString += "\n";
        }
        bigErrorCount++;
        if (bigErrorCount < MAX_ERRORS_SHOWN) {
          bigErrorString += srcLineStr + err.cleanedErrorString();
        }
        else if (bigErrorCount == 50) {
          bigErrorString += ".... more than " + MAX_ERRORS_SHOWN +
            " errors, additional errors not shown.";
        }
      }
    }

    if (!(exitval > 0)) {
      System.err.println("FAIL: compiler returned " + exitval);
    }
    System.err.println("Done executing compiler");
    if (!new File(outfilename).exists()) {
      System.err.println("Intermediate file " + outfilename + ": does not exist");
      if (bigErrorString.length() > 0) {
        throw new CompilerError(bigErrorString);
      }
      else {
        throw new CompilerError("Errors from compiler, output file not created");
      }
    }
  }

  /**
   * Return a pathname given by a property in the LPS properties.
   * If the path not absolute, it is relative to the LFC directory.
   */
  public static String getFlexPathname(String subpath) {
    // System.getenv is deprecated in java 1.4, but undeprecated again in 1.5.
    String flexhome = System.getenv("FLEX_HOME");
    if (flexhome == null) {
      throw new CompilerError("The FLEX_HOME environment variable must be set");
    }
    return flexhome + File.separator + subpath;
  }

  /**
   * Return a boolean value given by a property in the LPS properties.
   */
  public static boolean getLPSBoolean(String propname, boolean defaultValue) {
    String valueString = LPS.getProperty(propname);
    if (valueString == null)
      return defaultValue;

    return Boolean.getBoolean(valueString);
  }

  /**
   * Get the file name of the LFC shared library for SWF9.
   */
  public static String getLFCLibrary() {
    return LPS.getLFCDirectory() + File.separator + "LFC9.swc";
  }

  public static boolean isWindows() {
    String osname = System.getProperty("os.name");
    assert osname != null;
    return osname.startsWith("Windows");
  }

  /**
   * Compile the given translation units, producing a binary output.
   */
  public byte[] compileTranslationUnits(List tunits, boolean buildSharedLibrary)
    throws IOException
  {
    String outfilebase;
    Builder builder; 
    ArrayList files = new ArrayList();

    // Collect up the file (or files, for a library) we are compiling
    for (Iterator iter = tunits.iterator(); iter.hasNext(); ) {
      TranslationUnit tunit = (TranslationUnit)iter.next();
      // For the application, we just list the main .as file
      // For a library, we list all the classes.
      if (!buildSharedLibrary) {
        if (tunit.isMainTranslationUnit()) {
          files.add(new File(workdir.getPath() + File.separator + tunit.getName()+".as"));
        }
      } else {
        files.add(new File(tunit.getName()));
      }
    }
    
    // Set compiler config options
    Configuration config;
    String outfilename;

    if (buildSharedLibrary) {
      // For a library, add all the 'components'
      builder = new Library();
      config = builder.getDefaultConfiguration(); 
      for (int i = 0; i < files.size(); i++) {
        ((Library)builder).addComponent(((File)(files.get(i))).getName());
      }
      outfilebase = "app.swc";
      outfilename =  workdir.getPath() + File.separator + outfilebase;
      ((Library)builder).setOutput(new File(outfilename));
    }
    else {
      // For an application, compile just one 'main' class
      builder = new Application((File) files.get(0));
      config = builder.getDefaultConfiguration(); 
      outfilebase = "app.swf";
      outfilename =  workdir.getPath() + File.separator + outfilebase;
      ((Application)builder).setOutput(new File(outfilename));

    }

    boolean swf9Warnings = getLPSBoolean("compiler.swf9.warnings", true);

    // set reporting of warnings
    config.showActionScriptWarnings(swf9Warnings);
    config.showBindingWarnings(swf9Warnings); 
    config.showShadowedDeviceFontWarnings(swf9Warnings);
    config.showUnusedTypeSelectorWarnings(swf9Warnings);

    //  Append path using the 'source-path+=' option
    config.addSourcePath(new File[] {workdir});

    config.enableDebugging(USE_COMPILER_DEBUG_FLAG, "");
    
    if (!buildSharedLibrary) {
      config.setDefaultSize(safeInt((String)(options.get(Compiler.CANVAS_WIDTH, "800"))),
                            safeInt((String)(options.get(Compiler.CANVAS_HEIGHT, "600"))));

      config.addLibraryPath(new File[] {new File(getLFCLibrary())});
    } 

    builder.setConfiguration(config); 
    buildAndProcessErrors(builder, tunits, outfilename);
    return getBytes(outfilename);
  }

  /**
   * Checks for unique file names for files written.
   * We do not allow files to match, or even to be differing
   * only by case.  The latter will cause problems on
   * file systems that merge upper/lower case names.
   * @throw CompilerError for file name conflicts
   */
  void checkFileNameForClassName(String name) {
    String lower = name.toLowerCase();
    String existing;
    if ((existing = (String)uniqueFileNames.get(lower)) != null) {
      if (existing.equals(name)) {
        throw new CompilerError("cannot declare class name more than once: \"" + name + "\"");
      } else {
        throw new CompilerError("class names only differ by upper/lower case: \"" + existing + "\" versus \"" + name + "\"");
      }
    }
    uniqueFileNames.put(lower, name);
  }

  /**
   * Return the number of newlines in the string.
   */
  public static int countLines(String str) {
    int count = 0;
    int pos = -1;
    while ((pos = str.indexOf('\n', pos+1)) > 0) {
      count++;
    }
    return count;
  }

  /**
   * Write a file given by the translation unit, and using the
   * given pre and post text.
   * @throw CompilerError for any write errors, or class name conflicts
   */
  public void writeFile(TranslationUnit tunit, String pre, String post) {
    String name = tunit.getName();
    String body = tunit.getContents();
    checkFileNameForClassName(name);
    String infilename = workdir.getPath() + File.separator + name + ".as";
    tunit.setSourceFileName(infilename);
    tunit.setLineOffset(countLines(pre));

    if (options.getBoolean(Compiler.PROGRESS)) {
      System.err.println("Creating: " + infilename);
    }

    FileOutputStream fos = null;

    try {
      fos = new FileOutputStream(infilename);
      fos.write(pre.getBytes());
      fos.write(body.getBytes());
      fos.write(post.getBytes());
      fos.close();
    }
    catch (IOException ioe) {
      System.err.println("Exception in postprocessing, file=" + infilename + ": " + ioe);
      throw new CompilerError("Exception creating files for external compilation: " + ioe);
    }
    finally {
      closeit(fos);
    }
  }
}

/**
 * @copyright Copyright 2006-2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */

