/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * Javascript Generation
 *
 * @author steele@osteele.com
 * @author ptw@openlaszlo.org
 * @description: JavaScript -> JavaScript translator
 *
 * Transform the parse tree from ECMA ~4 to ECMA 3.  Includes
 * analyzing constraint functions and generating their dependencies.
 */

// TODO: [2006-01-25 ptw] Share this with the SWF Code generator, from
// which this was derived.

package org.openlaszlo.sc;
import java.io.*;
import java.util.*;

import org.openlaszlo.sc.parser.*;

public class JavascriptGenerator extends CommonGenerator implements Translator {

  protected void setRuntime(String runtime) {
    assert org.openlaszlo.compiler.Compiler.SCRIPT_RUNTIMES.contains(runtime) : "unknown runtime " + runtime;
  }

  public SimpleNode translate(SimpleNode program) {
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      context = new TranslationContext(ASTProgram.class, context);
      context.setProperty(TranslationContext.VARIABLES, globals);
      return translateInternal(program, "b", true);
    }
    finally {
      context = context.parent;
    }
  }

  public String newLabel(SimpleNode node) {
    throw new CompilerImplementationError("nyi: newLabel");
  }

  int tempNum = 0;

  String newTemp() {
    return newTemp("$lzsc$");
  }

  String newTemp(String prefix) {
    return prefix + tempNum++;
  }

  static LessHalfAssedHashMap XfixInstrs = new LessHalfAssedHashMap();
  static {
    XfixInstrs.put(ParserConstants.INCR, "+");
    XfixInstrs.put(ParserConstants.DECR, "-");
  };

  static LessHalfAssedHashMap AssignOpTable = new LessHalfAssedHashMap();
  static {
    AssignOpTable.put(ParserConstants.PLUSASSIGN, "+");
    AssignOpTable.put(ParserConstants.MINUSASSIGN, "-");
    AssignOpTable.put(ParserConstants.STARASSIGN, "*");
    AssignOpTable.put(ParserConstants.SLASHASSIGN, "/");
    AssignOpTable.put(ParserConstants.ANDASSIGN, "&");
    AssignOpTable.put(ParserConstants.ORASSIGN, "|");
    AssignOpTable.put(ParserConstants.XORASSIGN, "^");
    AssignOpTable.put(ParserConstants.REMASSIGN, "%");
    AssignOpTable.put(ParserConstants.LSHIFTASSIGN, "<<");
    AssignOpTable.put(ParserConstants.RSIGNEDSHIFTASSIGN, ">>");
    AssignOpTable.put(ParserConstants.RUNSIGNEDSHIFTASSIGN, ">>>");
  };

  // In-line version of Profiler#event (q.v.).
  //
  // If name is set, uses that, otherwise uses
  // function pretty name.  This code must be appended to the
  // function prefix or suffix, as appropriate.
  SimpleNode meterFunctionEvent(SimpleNode node, String event, String name) {
    String getname;
    if (name != null) {
      getname = "'" + name + "'";
    } else {
      getname = "arguments.callee['" + Function.FUNCTION_NAME + "']";
    }

    // Note _root.$lzprofiler can be undedefined to disable profiling
    // at run time.

    return parseFragment(
      "var $lzsc$lzp = global['$lzprofiler'];" +
      "if ($lzsc$lzp) {" +
      // Array keys are strings
      "  var $lzsc$now = '' + ((new Date).getTime() - $lzsc$lzp.base);" +
      "  var $lzsc$name = " + getname + ";" +
      // If the clock has not ticked (or the ms->String conversion
      // makes it appear so), we log explicitly to the event buffer,
      // otherwise we use the optimization of logging calls and
      // returns to separate buffers
      "  if ($lzsc$lzp.last == $lzsc$now) {" +
      "    $lzsc$lzp.events[$lzsc$now] += ('," + event + ":' + $lzsc$name);" +
      "  } else {" +
      "    $lzsc$lzp." + event + "[$lzsc$now] = $lzsc$name;" +
      "  }" +
      "  $lzsc$lzp.last = $lzsc$now;" +
      "}");
  }

  // Only used by warning generator, hence not metered.
  // FIXME: [2006-01-17 ptw] Regression compatibility Object -> String
  String report(String reportMethod, SimpleNode node, Object message) {
    return reportMethod + "(" + message + "," + node.filename + "," + node.beginLine + ")";
  }

  // Only used by warning generator, hence not metered.
  // FIXME: [2006-01-17 ptw] Regression compatibility Object -> String
  String report(String reportMethod, SimpleNode node, Object message, String extraArg) {
    return reportMethod + "(" + message + "," + node.filename + "," + node.beginLine + "," + extraArg + ")";
  }

  // Emits code to check that a function is defined.  If reference is
  // set, expects the function reference to be at the top of the stack
  // when called, otherwise expects the function object.
  // TODO: [2006-01-04 ptw] Rewrite as a source transform
  SimpleNode checkUndefinedFunction(SimpleNode node, JavascriptReference reference) {
    if (options.getBoolean(Compiler.DEBUG) && options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
      return parseFragment(
        "typeof " + reference.get() + " != 'function' ? " + 
        report("$reportNotFunction", node, reference.get()) + " : " +
        reference.get());
    } 
    return null;
  }

  // Emits code to check that an object method is defined.  Does a trial
  // fetch of methodName to verify that it is a function.
  SimpleNode checkUndefinedMethod(SimpleNode node, JavascriptReference reference, String methodName) {
    if (options.getBoolean(Compiler.DEBUG) && options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
      String o = newTemp();
      String om = newTemp();
      return parseFragment(
        "var " + o + " = " + reference.get() + ";" +
        "if (typeof(" + o + ") == 'undefined') {" +
        "  " + report("$reportUndefinedObjectProperty", node, methodName) +
        "}" +
        "var " + om + " = " + o + "[" + methodName + "];" + 
        "if (typeof(" + om + ") != 'function') {" +
        "  " + report("$reportUndefinedMethod", node, methodName, om) +
        "}");
    }
    return null;
  }

  SimpleNode translateInternal(SimpleNode program, String cpass, boolean top) {
    assert program instanceof ASTProgram;
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      context = new TranslationContext(ASTProgram.class, context);
      return visitProgram(program, program.getChildren(), cpass, top);
    }
    finally {
      context = context.parent;
    }
  }

  void showStats(SimpleNode node) {
    // No implementation to collect stats for Javascript
  }

  public String preProcess(String source) {
    return source;
  }

  public List makeTranslationUnits(SimpleNode translatedNode, boolean compress, boolean obfuscate)
  {
    ParseTreePrinter.Config config = new ParseTreePrinter.Config();
    config.compress = compress;
    config.obfuscate = obfuscate;
    config.trackLines = options.getBoolean(Compiler.TRACK_LINES);
    config.dumpLineAnnotationsFile = (String)options.get(Compiler.DUMP_LINE_ANNOTATIONS);
    return (new ParseTreePrinter(config)).makeTranslationUnits(translatedNode, sources);
  }

  public byte[] postProcess(List tunits) {
    assert (tunits.size() == 1);
    return ((TranslationUnit)tunits.get(0)).getContents().getBytes();
  }

  public SimpleNode visitProgram(SimpleNode node, SimpleNode[] directives, String cpass) {
    return visitProgram(node, directives, cpass, false);
  }

  public SimpleNode visitProgram(SimpleNode node, SimpleNode[] directives, String cpass, boolean top) {
    // cpass is "b"oth, 1, or 2
    assert "b".equals(cpass) || "1".equals(cpass) || "2".equals(cpass) : "bad pass: " + cpass;
    if ("b".equals(cpass)) {
      node = visitProgram(node, directives, "1", top);
      // Everything is done in one pass for now.
//       directives = node.getChildren();
//       node = visitProgram(node, directives, "2", top);
      return node;
    }
    if ("1".equals(cpass) && top) {
      // emit compile-time contants to runtime
      Map constants = (Map)options.get(Compiler.COMPILE_TIME_CONSTANTS);
      if (constants != null) {
        String code = "";
        for (Iterator i = constants.entrySet().iterator(); i.hasNext(); ) {
          Map.Entry entry = (Map.Entry)i.next();
          Object value = entry.getValue();
          // Python cruft
          if (value instanceof String) {
            value = "\"" + value + "\"";
          } else if ((new Integer(0)).equals(value)) {
            value = "false";
          } else if ((new Integer(1)).equals(value)) {
            value = "true";
          }
          String name = (String)entry.getKey();
          addGlobalVar(name, null, value.toString());
          code += "var " + name + " = " + value + ";";
        }
        List c = new ArrayList();
        c.add(parseFragment(code));
        c.addAll(Arrays.asList(directives));
        directives = (SimpleNode[])c.toArray(directives);
        node.setChildren(directives);
      }
    }
//     System.err.println("visitProgram: " + cpass);
    for (int index = 0, len = directives.length; index < len; index++) {
      SimpleNode directive = directives[index];
      SimpleNode newDirective = directive;
      SimpleNode[] children = directive.getChildren();
      if (directive instanceof ASTDirectiveBlock) {
        Compiler.OptionMap savedOptions = options;
        try {
          options = options.copy();
          newDirective = visitProgram(directive, children, cpass);
        }
        finally {
          options = savedOptions;
        }
      } else if (directive instanceof ASTIfDirective) {
        if (! options.getBoolean(Compiler.CONDITIONAL_COMPILATION)) {
          // TBD: different type; change to CONDITIONALS
          throw new CompilerError("`if` at top level");
        }
        // NOTE: [2009-10-03 ptw] (LPP-1933) People expect the
        // branches of a compile-time conditional to establish a
        // directive block
        Boolean value = evaluateCompileTimeConditional(children[0]);
        if (value == null) {
          newDirective = visitIfStatement(directive, children);
        } else if (value.booleanValue()) {
          SimpleNode clause = children[1];
          Compiler.OptionMap savedOptions = options;
          try {
            options = options.copy();
            newDirective = visitProgram(clause, clause.getChildren(), cpass);
          }
          finally {
            options = savedOptions;
          }
        } else if (children.length > 2) {
          SimpleNode clause = children[2];
          Compiler.OptionMap savedOptions = options;
          try {
            options = options.copy();
            newDirective = visitProgram(clause, clause.getChildren(), cpass);
          }
          finally {
            options = savedOptions;
          }
        } else {
          newDirective = new ASTEmptyExpression(0);
        }
      } else if (directive instanceof ASTIncludeDirective) {
        // Disabled by default, since it isn't supported in the
        // product.  (It doesn't go through the compilation
        // manager for dependency tracking.)
        if (! options.getBoolean(Compiler.INCLUDES)) {
          throw new UnimplementedError("unimplemented: #include", directive);
        }
        String userfname = (String)((ASTLiteral)children[0]).getValue();
        newDirective = translateInclude(userfname, cpass);
      } else if (directive instanceof ASTProgram) {
        // This is what an include looks like in pass 2
        newDirective = visitProgram(directive, children, cpass);
      } else if (directive instanceof ASTPragmaDirective) {
        newDirective = visitPragmaDirective(directive, children);
      } else if (directive instanceof ASTPassthroughDirective) {
        newDirective = visitPassthroughDirective(directive, children);
      } else {
        if ("1".equals(cpass)) {
          // Function, class, and top-level expressions are processed in pass 1
          if (directive instanceof ASTFunctionDeclaration) {
            newDirective = visitStatement(directive);
          } else if (directive instanceof ASTClassDefinition) {
            newDirective = visitStatement(directive);
          } else if (directive instanceof ASTModifiedDefinition) {
            newDirective = visitModifiedDefinition(directive, directive.getChildren());
          } else if (directive instanceof ASTStatement) {
            // Statements are processed in pass 1 for now
            newDirective = visitStatement(directive);
            ;
          } else {
            newDirective = visitExpression(directive, false);
          }
        }
        if ("2".equals(cpass)) {
          // There is no pass 2 any more
          assert false : "bad pass " + cpass;
        }
      }
      if (! newDirective.equals(directive)) {
//         System.err.println("directive: " + directive + " -> " + newDirective);
        directives[index] = newDirective;
      }
    }
    showStats(node);
    return node;
  }

  SimpleNode translateInclude(String userfname, String cpass) {

    if (Compiler.CachedInstructions == null) {
      Compiler.CachedInstructions = new ScriptCompilerCache();
    }

    File file = includeNameToFile(userfname);
    String source = includeFileToSourceString(file, userfname);

    try {
      String optionsKey = 
        getCodeGenerationOptionsKey(Collections.singletonList(
                                      // The constant pool isn't cached, so it doesn't affect code
                                      // generation so far as the cache is concerned.
                                      Compiler.DISABLE_CONSTANT_POOL));
      // If these could be omitted from the key for files that didn't
      // reference them, then the cache could be shared between krank
      // and krank debug.  (The other builds differ either on OBFUSCATE,
      // RUNTIME, NAMEFUNCTIONS, or PROFILE, so there isn't any other
      // possible sharing.)
      String instrsKey = file.getAbsolutePath();
      // Only cache on file and pass, to keep cache size resonable,
      // but check against optionsKey
      String instrsChecksum = "" + file.lastModified() + optionsKey; // source;
      // Use previously modified parse tree if it exists
      SimpleNode instrs = (SimpleNode)Compiler.CachedInstructions.get(instrsKey + cpass, instrsChecksum);
      if (instrs == null) {
        ParseResult result = parseFile(file, userfname, source);
        if ("1".equals(cpass)) {
          instrs = result.parse;
          instrs = translateInternal(instrs, cpass, false);
        } else if ("2".equals(cpass)) {
          instrs = (SimpleNode)Compiler.CachedInstructions.get(instrsKey + "1", instrsChecksum);
          assert instrs != null : "pass 2 before pass 1?";
          instrs = translateInternal(instrs, cpass, false);
        } else {
          assert false : "bad pass " + cpass;
        }
        if (! result.hasIncludes) {
          if (options.getBoolean(Compiler.CACHE_COMPILES)) {
            Compiler.CachedInstructions.put(instrsKey + cpass, instrsChecksum, instrs);
          }
        }
      }
      return instrs;
    }
    catch (ParseException e) {
      System.err.println("while compiling " + file.getAbsolutePath());
      throw e;
    }
  }

  public SimpleNode visitFunctionDeclaration(SimpleNode node, SimpleNode[] ast) {
    // Inner functions are handled by translateFunction
    if (context.findFunctionContext() != null) {
      return null;
    } else {
      assert (! options.getBoolean(Compiler.CONSTRAINT_FUNCTION));
      return translateFunction(node, true, ast);
    }
  }

  // A method declaration is simply a function in a class
  public SimpleNode visitMethodDeclaration(SimpleNode node, SimpleNode[] ast) {
    assert context.isClassBoundary() : ("Method not in class context? " + context);
    return translateMethod(node, true, ast);
  }

  //
  // Statements
  //

  public SimpleNode visitVariableStatement(SimpleNode node, SimpleNode[] children) {
    return visitChildren(node);
  }

  public SimpleNode visitVariableDeclaration(SimpleNode node, SimpleNode[] children) {
    ASTIdentifier id = (ASTIdentifier)children[0];
    JavascriptReference ref = translateReference(id);
    if (ASTProgram.class.equals(context.type)) {
      // Initial value not used in this runtime
      addGlobalVar(id.getName(), null, null);
    }
    if (children.length > 1) {
      SimpleNode initValue = children[1];
      children[1] = visitExpression(initValue);
      children[0] = ref.init();
      return node;
    } else {
      children[0] = ref.declare();
      return node;
    }
  }

  public SimpleNode visitIfStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode test = children[0];
    SimpleNode a = children[1];
    SimpleNode b = (children.length > 2) ? children[2] : null;
    // Compile-time conditional evaluations
//     System.err.println("visitIfStatement: " +  (new ParseTreePrinter()).text(node));
    Boolean value = evaluateCompileTimeConditional(test);
    if (value != null) {
//       System.err.println("" + test + " == " + value);
      if (value.booleanValue()) {
        return visitStatement(a);
      } else if (b != null) {
        return visitStatement(b);
      } else {
        return new ASTEmptyExpression(0);
      }
    } else if (b != null) {
      children[0] = visitExpression(test);
      children[1] = visitStatement(a);
      children[2] = visitStatement(b);
    } else {
      children[0] = visitExpression(test);
      children[1] = visitStatement(a);
    }
    return node;
  }

  public SimpleNode visitWhileStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode test = children[0];
    SimpleNode body = children[1];
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      context = new TranslationContext(ASTWhileStatement.class, context);
      children[0] = visitExpression(test);
      children[1] = visitStatement(body);
      return node;
    }
    finally {
      context = context.parent;
    }
  }

  public SimpleNode visitDoWhileStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode body = children[0];
    SimpleNode test = children[1];
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      context = new TranslationContext(ASTDoWhileStatement.class, context);
      children[0] = visitStatement(body);
      children[1] = visitExpression(test);
      return node;
    }
    finally {
      context = context.parent;
    }
  }

  public SimpleNode visitForStatement(SimpleNode node, SimpleNode[] children) {
    return translateForStatement(node, children);
  }

  public SimpleNode visitForVarStatement(SimpleNode node, SimpleNode[] children) {
    return translateForStatement(node, children);
  }

  SimpleNode translateForStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode init = children[0];
    SimpleNode test = children[1];
    SimpleNode step = children[2];
    SimpleNode body = children[3];
    // TODO: [2003-04-15 ptw] bind context slot macro
    Compiler.OptionMap savedOptions = options;
    try {
      options = options.copy();
      context = new TranslationContext(ASTForStatement.class, context);
      options.putBoolean(Compiler.WARN_GLOBAL_ASSIGNMENTS, true);
      children[0] = visitStatement(init);
      options.putBoolean(Compiler.WARN_GLOBAL_ASSIGNMENTS, false);
      children[1] = visitExpression(test);
      children[3] = visitStatement(body);
      children[2] = visitStatement(step);
      return node;
    }
    finally {
      context = context.parent;
      options = savedOptions;
    }
  }

  public SimpleNode visitForInStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode var = children[0];
    SimpleNode obj = children[1];
    SimpleNode body = children[2];
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      context = new TranslationContext(ASTForInStatement.class, context);
      children[1] = visitExpression(obj);
      JavascriptReference ref = translateReference(var);
      children[0] = ref.set(true);
      children[2] = visitStatement(body);
      return node;
    }
    finally {
      context = context.parent;
    }
  }

  // This works because keys are always strings, and enumerate pushes
  // a null before all the keys
  public void unwindEnumeration(SimpleNode node) {
  }

  SimpleNode translateForInStatement(SimpleNode node, SimpleNode var,
                               Instructions.Instruction varset, SimpleNode obj,
                               SimpleNode body) {
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      SimpleNode[] children = node.getChildren();
      context = new TranslationContext(ASTForInStatement.class, context);
      children[2] = visitExpression(obj);
      JavascriptReference ref = translateReference(var);
      if (varset == Instructions.VarEquals) {
        children[0] = ref.init();
      } else {
        children[0] = ref.set(true);
      }
      children[3] = visitStatement(body);
      return node;
    }
    finally {
      context = context.parent;
    }
  }

  SimpleNode translateAbruptCompletion(SimpleNode node, String type, ASTIdentifier label) {
    return node;
  }

  public SimpleNode visitReturnStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode value = children[0];
    children[0] = visitExpression(value);
    return node;
  }

  public SimpleNode visitWithStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode expr = children[0];
    SimpleNode stmt = children[1];
    children[0] = visitExpression(expr);
    children[1] = visitStatement(stmt);
    return node;
  }

  public SimpleNode visitTryStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode block = children[0];
    int len = children.length;
    assert len == 2 || len == 3;
    children[0] = visitStatement(block);
    if (len == 2) {
      // Could be catch or finally clause
      SimpleNode catfin = children[1];
      if (catfin instanceof ASTCatchClause) {
        // Treat the catch identifier as a binding.  This is not quite
        // right, need to integrate with variable analyzer, but this is
        // the one case in ECMAScript where a variable does have block
        // extent.
        catfin.set(0, translateReference(catfin.get(0)).declare());
        catfin.set(1, visitStatement(catfin.get(1)));
      } else {
        assert catfin instanceof ASTFinallyClause;
        catfin.set(0, visitStatement(catfin.get(0)));
      }
    } else if (len == 3) {
      SimpleNode cat = children[1];
      SimpleNode fin = children[2];
      assert cat instanceof ASTCatchClause;
      // Treat the catch identifier as a binding.  This is not quite
      // right, need to integrate with variable analyzer, but this is
      // the one case in ECMAScript where a variable does have block
      // extent.
      cat.set(0, translateReference(cat.get(0)).declare());
      cat.set(1, visitStatement(cat.get(1)));
      assert fin instanceof ASTFinallyClause;
      fin.set(0, visitStatement(fin.get(0)));
    }
    return node;
  }
  public SimpleNode visitThrowStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode expr = children[0];
    children[0] = visitExpression(expr);
    return node;
  }

  public SimpleNode visitSwitchStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode expr = children[0];
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      context = new TranslationContext(ASTSwitchStatement.class, context);
      children[0] = visitExpression(expr);
      for (int i = 1, len = children.length; i < len; i++) {
        SimpleNode clause = children[i];
        if (clause instanceof ASTDefaultClause) {
          if (clause.size() > 0) {
            clause.set(0, visitStatement(clause.get(0)));
          }
        } else {
          assert clause instanceof ASTCaseClause : "case clause expected";
          clause.set(0, visitExpression(clause.get(0)));
          if (clause.size() > 1) {
            clause.set(1, visitStatement(clause.get(1)));
          }
        }
      }
      return node;
    }
    finally {
      context = context.parent;
    }
  }

  //
  // Expressions
  //

  public SimpleNode visitExpression(SimpleNode node) {
    return visitExpression(node, true);
  }

  /* This function, unlike the other expression visitors, can be
     applied to any expression node, so it dispatches based on the
     node's class. */
  public SimpleNode visitExpression(SimpleNode node, boolean isReferenced) {
    if (this.debugVisit) {
      System.err.println("visitExpression: " + node.getClass());
    }

    SimpleNode newNode = dispatchExpression(node, isReferenced);

    if ((! isReferenced) && (newNode == null)) {
      newNode = new ASTEmptyExpression(0);
    }
    if (this.debugVisit) {
      if (! newNode.equals(node)) {
        System.err.println("expression: " + node + " -> " + newNode);
      }
    }
    return newNode;
  }

  public SimpleNode visitIdentifier(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // Side-effect free expressions can be suppressed if not referenced
    // Following is disabled by default for regression testing.
    // TODO: [2003-02-17 ows] enable this
    if ((! isReferenced) && options.getBoolean(Compiler.ELIMINATE_DEAD_EXPRESSIONS)) {
      return null;
    }
    if ("_root".equals(((ASTIdentifier)node).getName()) && (! options.getBoolean(Compiler.ALLOW_ROOT))) {
      throw new SemanticError("Illegal variable name: " + node, node);
    }
    return translateReference(node).get();
  }

  public SimpleNode visitLiteral(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // Side-effect free expressions can be suppressed if not referenced
    // Following is disabled by default for regression testing.
    // TODO: [2003-02-17 ows] enable this
    if ((! isReferenced) && options.getBoolean(Compiler.ELIMINATE_DEAD_EXPRESSIONS)) {
      return null;
    }
    return translateLiteralNode(node);
  }

  public SimpleNode visitExpressionList(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // all but last expression will not be referenced, so
    // visitExpression will pop it.  If the list is not referenced,
    // then the last will be popped too
    int i = 0, len = children.length - 1;
    for ( ; i < len; i++) {
      children[i] = visitExpression(children[i], false);
    }
    children[len] = visitExpression(children[len], isReferenced);
    return node;
  }

  public SimpleNode visitEmptyExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // Side-effect free expressions can be suppressed if not referenced
    if ((! isReferenced)) {
      return null;
    }
    return node;
  }

  public SimpleNode visitThisReference(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // Side-effect free expressions can be suppressed if not referenced
    if ((! isReferenced)) {
      return null;
    }
    return translateReference(node).get();
  }

  public SimpleNode visitArrayLiteral(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    boolean suppressed = (! isReferenced);
    for (int i = 0, len = children.length; i <len; i++) {
      children[i] = visitExpression(children[i], isReferenced);
    }
    return node;
  }

  public SimpleNode visitObjectLiteral(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    boolean isKey = true;
    for (int i = 0, len = children.length; i < len; i++) {
      SimpleNode item = children[i];
      if (isKey && item instanceof ASTIdentifier) {
        // Identifiers are a shorthand for a literal string, should
        // not be evaluated (or remapped).
        ;
      } else {
        children[i] = visitExpression(item);
      }
      isKey = (! isKey);
    }
    return node;
  }

  public SimpleNode visitFunctionExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    Compiler.OptionMap savedOptions = options;
    try {
      options = options.copy();
      options.putBoolean(Compiler.CONSTRAINT_FUNCTION, false);
      return translateFunction(node, false, children);
    }
    finally {
      options = savedOptions;
    }
  }

  // A method declaration may appear in an expression context (when it
  // is in the Class.make plist)
  public SimpleNode visitMethodExpression(SimpleNode node,  boolean isReferenced, SimpleNode[] ast) {
    assert context.isClassBoundary() : ("Method not in class context? " + context);
    assert (! (this instanceof SWF9Generator)) : "Method expressions should not happen in swf9";
    Compiler.OptionMap savedOptions = options;
    try {
      options = options.copy();
      options.putBoolean(Compiler.CONSTRAINT_FUNCTION, false);
      // When a method declaration is an expression, don't use the name
      return translateMethod(node, false, ast);
    }
    finally {
      options = savedOptions;
    }
  }

  public SimpleNode visitFunctionCallParameters(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    translateFunctionCallParameters(node, isReferenced, children);
    return node;
  }

  public SimpleNode[] translateFunctionCallParameters(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    for (int i = 0, len = children.length; i < len; i++) {
      children[i] = visitExpression(children[i]);
    }
    return children;
  }

  public SimpleNode visitPropertyIdentifierReference(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    return translateReference(node).get();
  }

  public SimpleNode visitPropertyValueReference(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    return translateReference(node).get();
  }

  public SimpleNode makeCheckedNode(SimpleNode node) {
    // Now that debugging automatically catches errors, we don't need
    // evalCarefully.  All a checked node needs to do is update the
    // lineno in the backtrace (if it is on).
    if (options.getBoolean(Compiler.DEBUG) && options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES)
        // Only check this where 'this' is available
        && (context.findFunctionContext() != null)) {
      return noteCallSite(node);
    }
    return node;
  }

  SimpleNode noteCallSite(SimpleNode node) {
    // Note current call-site in a function context and backtracing
    if (node instanceof Compiler.AnnotatedNode) { return node; }
    if ((options.getBoolean(Compiler.DEBUG_BACKTRACE) && (node.beginLine > 0)) &&
        (context.findFunctionContext() != null)) {
      SimpleNode newNode = new ASTExpressionList(0);
      newNode.set(0, visitExpression((new Compiler.Parser()).parse("$lzsc$a.lineno = " + node.beginLine).get(0).get(0)));
      newNode.set(1, node);
      return new Compiler.AnnotatedNode(newNode);
    }
    return node;
  }

  // Could do inline expansions here, like setAttribute
  public SimpleNode visitCallExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode fnexpr = children[0];
    SimpleNode[] args = children[1].getChildren();
    int arglen = args.length;

    // TODO: [2002-12-03 ptw] There should be a more general
    // mechanism for matching patterns against AST's and replacing
    // them.
    // FIXME: [2002-12-03 ptw] This substitution is not correct
    // because it does not verify that the method being inlined is
    // actually LzNode.setAttribute.
    if (
      // Here this means 'compiling the lfc'
      options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY) &&
      (! options.getBoolean("passThrough")) &&
      (fnexpr instanceof ASTPropertyIdentifierReference)) {
      SimpleNode[] fnchildren = fnexpr.getChildren();
      String name = ((ASTIdentifier)fnchildren[1]).getName();
      // We can't expand this if an expression value is expected,
      // since we don't have 'let'
      if (name.equals("setAttribute") && (arglen == 2) && (! isReferenced)) {
        SimpleNode scope = fnchildren[0];
        SimpleNode property = args[0];
        SimpleNode value = args[1];
        List newBody = new ArrayList();
        String thisvar = "$lzsc$" + UUID().toString();
        String propvar = "$lzsc$" + UUID().toString();
        String valvar = "$lzsc$" + UUID().toString();
        String svar = "$lzsc$" + UUID().toString();
        String evtvar = "$lzsc$" + UUID().toString();
        String decls = "";
        ParseTreePrinter ptp = new ParseTreePrinter();
        if (scope instanceof ASTIdentifier || scope instanceof ASTThisReference) {
          thisvar = ptp.text(scope);
        } else {
          decls += "var " + thisvar + " = " + ptp.text(scope) + ";";
        }
        if (property instanceof ASTLiteral || property instanceof ASTIdentifier) {
          propvar = ptp.text(property);
          if (property instanceof ASTLiteral) {
            assert propvar.startsWith("\"") || propvar.startsWith("'");
            svar = propvar.substring(0,1) + "$lzc$set_" + propvar.substring(1);
          }
        } else {
          decls += "var " + propvar + " = " + ptp.text(property) + ";";
        }
        if (value instanceof ASTLiteral || value instanceof ASTIdentifier) {
          valvar = ptp.text(value);
        } else {
          decls += "var " + valvar + " = " + ptp.text(value) + ";";
        }
        newBody.add(parseFragment(decls));
        String fragment =
          "if (! (" + thisvar + ".__LZdeleted " + ")) {" +
            ((property instanceof ASTLiteral) ? "" : ("var " + svar + " = \"$lzc$set_\" + " + propvar + ";")) +
            "if (" + thisvar + "[" + svar + "] is Function) {" +
            "  " + thisvar + "[" + svar + "](" + valvar + ");" +
            "} else {" +
            "  " + thisvar + "[ " + propvar + " ] = " + valvar + ";" +
            "    var " + evtvar + " = " + thisvar + "[" +
             ((property instanceof ASTLiteral) ?
              (propvar.substring(0,1) + "on" + propvar.substring(1)) :
              ("\"on\" + " + propvar)) +
             "];" +
            "  if (" + evtvar + " is LzEvent) {" +
            "    if (" + evtvar + ".ready) {" + evtvar + ".sendEvent( " + valvar + " ); }" +
            "  }" +
            "}" +
          "}";
        newBody.add(parseFragment(fragment));
        SimpleNode newStmts = new ASTStatementList(0);
        newStmts.setChildren((SimpleNode[])newBody.toArray(new SimpleNode[0]));
        return visitStatement(newStmts);
      }
    }

    children[1].setChildren(translateFunctionCallParameters(node, isReferenced, args));
    children[0] = translateReferenceForCall(fnexpr, true, node);
//     if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES)) {
//       return makeCheckedNode(node);
//     }
    return noteCallSite(node);
  }

  public SimpleNode visitSuperCallExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode n = translateSuperCallExpression(node, isReferenced, children);
    children = n.getChildren();
    for (int i = 0, len = children.length ; i < len; i++) {
      children[i] = visitExpression(children[i], isReferenced);
    }
    return n;
  }

  public SimpleNode visitNewExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    for (int i = 0, len = children.length; i < len; i++) {
      SimpleNode child = children[i];
      children[i] = visitExpression(child, isReferenced);
    }
    return noteCallSite(node);
  }

  public SimpleNode visitPrefixExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    int op = ((ASTOperator)children[0]).getOperator();
    SimpleNode ref = children[1];
    if (translateReference(ref).isChecked()) {
      // The undefined reference checker needs to have this expanded
      // to work
      Map map = new HashMap();
      map.put("_1", ref);
      String pattern = "(function () { var $lzsc$tmp = _1; return _1 = $lzsc$tmp " + XfixInstrs.get(op) + " 1; })()";
      SimpleNode n = (new Compiler.Parser()).substitute(node, pattern, map);
      return visitExpression(n);
    }
    children[1] = translateReference(ref, 2).get();
    return node;
  }

  public SimpleNode visitPostfixExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode ref = children[0];
    int op = ((ASTOperator)children[1]).getOperator();
    if (translateReference(ref).isChecked()) {
      // The undefined reference checker needs to have this expanded
      // to work
      Map map = new HashMap();
      map.put("_1", ref);
      String pattern = "(function () { var $lzsc$tmp = _1; _1 = $lzsc$tmp " + XfixInstrs.get(op) + " 1; return $lzsc$tmp; })()";
      SimpleNode n = (new Compiler.Parser()).substitute(node, pattern, map);
      return visitExpression(n);
    }
    children[0] = translateReference(ref, 2).get();
    return node;
  }

  public SimpleNode visitUnaryExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    int op = ((ASTOperator)children[0]).getOperator();
    // I guess the parser doesn't know the difference
    if (ParserConstants.INCR == (op) || ParserConstants.DECR == (op)) {
      return visitPrefixExpression(node, isReferenced, children);
    }
    SimpleNode arg = children[1];
    // special-case typeof(variable) to not emit undefined-variable
    // checks so there is a warning-free way to check for undefined
    if (ParserConstants.TYPEOF == (op) &&
        (arg instanceof ASTIdentifier ||
         arg instanceof ASTPropertyValueReference ||
         arg instanceof ASTPropertyIdentifierReference)) {
      children[1] = translateReference(arg).get(false);
    } else {
      children[1] = visitExpression(arg);
    }
    return node;
  }

  public SimpleNode visitBinaryExpressionSequence(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode a = children[0];
    SimpleNode op = children[1];
    SimpleNode b = children[2];
    if (ParserConstants.CAST ==  ((ASTOperator)op).getOperator()) {
      // Approximate a cast b as a
      // TODO: [2008-01-08 ptw] We could typecheck and throw an error
      // in debug mode
      return visitExpression(a);
    }
    if (ParserConstants.IS ==  ((ASTOperator)op).getOperator()) {
      // Approximate a is b as b['$lzsc$isa'] ? b.$lzsc$isa(a) : (a
      // instanceof b)
      Map map = new HashMap();
      map.put("_1", a);
      map.put("_2", b);
      String pattern;
      if ((a instanceof ASTIdentifier ||
           a instanceof ASTPropertyValueReference ||
           a instanceof ASTPropertyIdentifierReference ||
           a instanceof ASTThisReference) &&
          (b instanceof ASTIdentifier ||
           b instanceof ASTPropertyValueReference ||
           b instanceof ASTPropertyIdentifierReference ||
           b instanceof ASTThisReference)) {
        pattern = "(_2['$lzsc$isa'] ? _2.$lzsc$isa(_1) : (_1 instanceof _2))";
      } else {
        pattern = "((function (a, b) {return b['$lzsc$isa'] ? b.$lzsc$isa(a) : (a instanceof b)})(_1, _2))";
      }
      SimpleNode n = (new Compiler.Parser()).substitute(node, pattern, map);
      return visitExpression(n);
    }
    children[0] = visitExpression(a);
    children[2] = visitExpression(b);
    return node;
  }

  SimpleNode translateAndOrExpression(SimpleNode node, boolean isand, SimpleNode a, SimpleNode b) {
    SimpleNode[] children = node.getChildren();
    children[0] = visitExpression(a);
    children[1] = visitExpression(b);
    return node;
  }

  public SimpleNode visitConditionalExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode test = children[0];
    SimpleNode a = children[1];
    SimpleNode b = children[2];
    children[0] = visitExpression(test);
    children[1] = visitExpression(a);
    children[2] = visitExpression(b);
    return node;
  }

  public SimpleNode visitAssignmentExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    JavascriptReference lhs = translateReference(children[0]);
    int op = ((ASTOperator)children[1]).getOperator();
    SimpleNode rhs = visitExpression(children[2]);
    if (op != ParserConstants.ASSIGN &&
        lhs.isChecked()) {
      // The undefined reference checker needs to have this expanded
      // to work
      Map map = new HashMap();
      map.put("_1", lhs.get());
      map.put("_2", rhs);
      map.put("_3", lhs.set());
      String pattern = "(function () { var $lzsc$tmp = _1; return _3 = $lzsc$tmp " + AssignOpTable.get(op) + " _2; })()";
      SimpleNode n = (new Compiler.Parser()).substitute(node, pattern, map);
      return visitExpression(n);
    }
    children[2] = rhs;
    children[0] = lhs.set();
    return node;
  }

  SimpleNode translateFunction(SimpleNode node, boolean useName, SimpleNode[] children) {
    return translateFunction(node, useName, children, false);
  }

  SimpleNode translateMethod(SimpleNode node, boolean useName, SimpleNode[] children) {
    return translateFunction(node, useName, children, true);
  }

  // useName => declaration not expression
  SimpleNode translateFunction(SimpleNode node, boolean useName, SimpleNode[] children, boolean isMethod) {
    // TODO: [2003-04-15 ptw] bind context slot macro
    SimpleNode[] result;
    // methodName and scriptElement
    Compiler.OptionMap savedOptions = options;
    try {
      options = options.copy();
      context = new TranslationContext(ASTFunctionExpression.class, context);
      node = formalArgumentsTransformations(node);
      children = node.getChildren();
      result = translateFunctionInternal(node, useName, children, isMethod);
    }
    finally {
      options = savedOptions;
      context = context.parent;
    }
    node = result[0];
    // Dependency function is not compiled in the function context
    if (result[1] != null) {
      SimpleNode dependencies = result[1];
      Map map = new HashMap();
      map.put("_1", node);
      map.put("_2", translateFunction(dependencies, false, dependencies.getChildren()));
      SimpleNode newNode = (new Compiler.Parser()).substitute(node,
        "(function () {var $lzsc$f = _1; $lzsc$f.dependencies = _2; return $lzsc$f })();", map);
      return newNode;
    }
    return node;
  }

  SimpleNode rewriteScriptVars(SimpleNode node) {
    // Convert the variable declarations to assignments.  This is
    // a little sneaky, by replacing the VariableStatement with a
    // Statement, we magically remove the `var` and all is well...
    if (node instanceof ASTVariableStatement) {
      SimpleNode newNode = new ASTStatement(0);
      newNode.set(0, node.get(0));
      return newNode;
    }
    // Don't descend into inner functions
    if (node instanceof ASTFunctionDeclaration ||
        node instanceof ASTFunctionExpression) {
      return node;
    }
    SimpleNode[] children = node.getChildren();
    for (int i = 0, ilim = children.length; i < ilim; i++) {
      SimpleNode oldNode = children[i];
      SimpleNode newNode = rewriteScriptVars(oldNode);
      if (! newNode.equals(oldNode)) {
        children[i] = newNode;
      }
    }
    return node;
  }


  static java.util.regex.Pattern identifierPattern = java.util.regex.Pattern.compile("[\\w$_]+");

  // Internal helper function for above
  // useName => declaration not expression
  SimpleNode[] translateFunctionInternal(SimpleNode node, boolean useName, SimpleNode[] children, boolean isMethod) {
    // ast can be any of:
    //   FunctionDefinition(name, args, body)
    //   FunctionDeclaration(name, args, body)
    //   FunctionDeclaration(args, body)
    // Handle the two arities:
    String functionName = null;
    SimpleNode params;
    SimpleNode stmts;
    SimpleNode depExpr = null;
    int stmtsIndex;
    ASTIdentifier functionNameIdentifier = null;
    if (children.length == 3) {
      if (children[0] instanceof ASTIdentifier) {
        functionNameIdentifier = (ASTIdentifier)children[0];
        functionName = functionNameIdentifier.getName();
      }
      params = children[1];
      stmts = children[stmtsIndex = 2];
    } else {
      params = children[0];
      stmts = children[stmtsIndex = 1];
    }
    // inner functions do not get scriptElement treatment, shadow any
    // outer declaration
    options.putBoolean(Compiler.SCRIPT_ELEMENT, false);
    // or the magic with(this) treatment
    options.putBoolean(Compiler.WITH_THIS, false);
    // function block
    String userFunctionName = null;
    String filename = node.filename != null? node.filename : "unknown file";
    String lineno = "" + node.beginLine;
    String methodName = (String)options.get(Compiler.METHOD_NAME);
    // Backwards compatibility with tag compiler
    if (methodName != null && functionNameIdentifier != null) {
        functionNameIdentifier.setName(functionName = methodName);
    }
    if (functionName != null) {
      userFunctionName = functionName;
      if (! useName) {
        // NOTE: [2009-09-01 ptw] (LPP-8431) IE ruins naming function
        // expressions for everyone because it has a retarded
        // implementation of Javascript that no one in their right
        // mind could conceive of.  See:
        // http://yura.thinkweb2.com/named-function-expressions/ for
        // full details.
        //
        // NOTE: [2009-09-01 ptw] The swf9 JIT seems to have a similar
        // lossage, so we don't ever use named function expressions
//         if (
//               // This is a function-expression that has been annotated
//               // with a non-legal function name
//               (! identifierPattern.matcher(functionName).matches()) ||
//               (! (this instanceof SWF9Generator))
//             )
//         {
          // Remove the function name, it will be emitted as the
          // function's pretty name below instead.
          functionName = null;
          children[0] = new ASTEmptyExpression(0);
//         }
      }
    } else {
      userFunctionName = "" + filename + "#" +  lineno + "/" + node.beginColumn;
    }
    // Tell metering to look up the name at runtime if it is not a
    // global name (this allows us to name closures more
    // mnemonically at runtime
    String meterFunctionName = useName ? functionName : null;
    SimpleNode[] paramIds = params.getChildren();
    // Pull all the pragmas from the list: process them, and remove
    // them
    assert stmts instanceof ASTStatementList;
    List stmtList = new ArrayList(Arrays.asList(stmts.getChildren()));
    // Parse out the pragmas of the function body
    for (int i = 0, len = stmtList.size(); i < len; i++) {
      SimpleNode stmt = (SimpleNode)stmtList.get(i);
      if (stmt instanceof ASTPragmaDirective) {
        SimpleNode newNode = visitStatement(stmt);
        if (! newNode.equals(stmt)) {
          stmtList.set(i, newNode);
        }
      }
    }
    // Allows the tag compiler to pass through a pretty name for debugging
    String explicitUserFunctionName = (String)options.get("userFunctionName");
    if (explicitUserFunctionName != null) {
      userFunctionName = explicitUserFunctionName;
    }
    if (options.getBoolean(Compiler.CONSTRAINT_FUNCTION)) {
//       assert (functionName != null);
      if (ReferenceCollector.DebugConstraints) {
        System.err.println("stmts: " + stmts);
      }
      // Find dependencies.
      //
      // Compute this before any transformations on the function body.
      //
      // The job of a constraint function is to compute a value.
      // The current implementation inlines the call to set the
      // attribute that the constraint is attached to, within the
      // constraint function it  Walking the statements of
      // the function will process the expression that computes
      // the value; it will also process the call to
      // setAttribute, but ReferenceCollector knows to ignore
      //
      ReferenceCollector dependencies = new ReferenceCollector(options.getBoolean(Compiler.COMPUTE_METAREFERENCES));
      // Only visit original body
      for (Iterator i = stmtList.iterator(); i.hasNext(); ) {
        SimpleNode stmt = (SimpleNode)i.next();
        dependencies.visit(stmt);
      }
      depExpr = dependencies.computeReferences(userFunctionName);
      if (options.getBoolean(Compiler.PRINT_CONSTRAINTS)) {
        (new ParseTreePrinter()).print(depExpr);
      }
    }
    boolean isStatic = isStatic(node);
    // Analyze local variables (and functions)
    VariableAnalyzer analyzer = 
      new VariableAnalyzer(params, 
                           options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY),
                           (this instanceof SWF9Generator),
                           this);
    for (Iterator i = stmtList.iterator(); i.hasNext(); ) {
      analyzer.visit((SimpleNode)i.next());
    }
    // We only want to compute these analysis components on the
    // original body of code, not on the annotations, since these are
    // used to enforce LZX semantics in Javascript
    analyzer.computeReferences();
    // Parameter _must_ be in order
    LinkedHashSet parameters = analyzer.parameters;
    // Linked for determinism for regression testing
    Set variables = analyzer.variables;
    // Linked for determinism for regression testing
    LinkedHashMap fundefs = analyzer.fundefs;
    Set closed = analyzer.closed;
    Set free = analyzer.free;
    Set possibleInstance = new HashSet(free);

    // Look for #pragma
    boolean scriptElement = options.getBoolean(Compiler.SCRIPT_ELEMENT);
    List newBody = new ArrayList();
    if (scriptElement) {
      // Create all variables (including inner functions) in global scope
      if (! variables.isEmpty()) {
        String code = "";
        for (Iterator i = variables.iterator(); i.hasNext(); ) {
          String name = (String)i.next();
          // TODO: [2008-04-16 ptw] Retain type information through
          // analyzer so it can be passed on here
          addGlobalVar(name, null, "void 0");
          code +=  name + "= void 0;";
        }
        newBody.add(parseFragment(code));

        for (int i = 0, ilim = stmtList.size(); i < ilim; i++) {
          SimpleNode stmt = (SimpleNode)stmtList.get(i);
          SimpleNode newNode = rewriteScriptVars(stmt);
          if (! newNode.equals(stmt)) {
            stmtList.set(i, newNode);
          }
        }
      }
    } else {
      // Leave var declarations as is
      // Emit function declarations here
      if (! fundefs.isEmpty()) {
        String code = "";
        for (Iterator i = fundefs.keySet().iterator(); i.hasNext(); ) {
          code += "var " + (String)i.next() + ";";
        }
        newBody.add(parseFragment(code));
      }
    }

    // If either of error or suffix are set, a try block is created.
    // postlude is only used if error is set, to insert a dummy return
    // value to keep the Flex compiler happy (See:
    // https://bugs.adobe.com/jira/browse/FCM-12)
    List prelude = new ArrayList();  // before try
    List prefix = new ArrayList();   // before body
    List error = new ArrayList();    // error body
    List suffix = new ArrayList();   // finally body
    List postlude = new ArrayList(); // after try
    // If backtrace is on, we maintain a call stack for debugging
    boolean debugBacktrace = options.getBoolean(Compiler.DEBUG_BACKTRACE);
    if (debugBacktrace) {
      // TODO: [2007-09-04 ptw] Come up with a better way to
      // distinguish LFC from user stack frames.  See
      // lfc/debugger/LzBacktrace
      String fn = (options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY) ? "lfc/" : "") + filename;
      String args = "[";
      for (Iterator i = parameters.iterator(); i.hasNext(); ) {
        String arg = (String)i.next();
        args += ScriptCompiler.quote(arg) + "," + arg;
        if (i.hasNext()) { args += ","; }
      }
      args += "]";
      prelude.add(parseFragment(
                    "var $lzsc$d = Debug; var $lzsc$s = $lzsc$d.backtraceStack;"));
      prefix.add(parseFragment(
                   "if ($lzsc$s) {" +
                   "  var $lzsc$a = " + args + ";" +
                   "  $lzsc$a.callee = " +
                   // For now, we don't try to reference the
                   // function/method object
                   ((this instanceof SWF9Generator) ?
                    ScriptCompiler.quote(userFunctionName) :
                    "arguments.callee") + ";" +
                   (isStatic ? "" : "  $lzsc$a['this'] = this;") +
                   "  $lzsc$a.filename = " + ScriptCompiler.quote(fn) + ";" +
                   "  $lzsc$a.lineno = " + lineno + ";" +
                   "  $lzsc$s.push($lzsc$a);" +
                   "  if ($lzsc$s.length > $lzsc$s.maxDepth) {$lzsc$d.stackOverflow()};" +
                   "}"));
      suffix.add(parseFragment(
                    "if ($lzsc$s) {" +
                    "  $lzsc$s.length--;" +
                    "}"));
    }
    // If profile is on, we meter function enter/exit
    if (options.getBoolean(Compiler.PROFILE)) {
      prefix.add((meterFunctionEvent(node, "calls", meterFunctionName)));
      // put the function end before other annotations
      suffix.add(0, (meterFunctionEvent(node, "returns", meterFunctionName)));
    }
    // If debug or compiler.catcherrors is on, we create an error
    // handler to catch the error and return a type-safe null value
    // (to emulate the behavior of as2).
    // Non-errors will simply be re-thrown by the catch logic.
    boolean catchExceptions = options.getBoolean(Compiler.CATCH_FUNCTION_EXCEPTIONS);
    // NOTE: [2009-09-14 ptw] `#pragma "throwsError=true"` can be used
    // to selectively disable the catching of errors when it is
    // intentional on the part of the user program, but better
    // practice would be for user programs to use non-Error object as
    // the value to be thrown.
    boolean throwExceptions = options.getBoolean(Compiler.THROWS_ERROR);
    // If debugging is on we create an error handler to catch the
    // error, report it, and unless the error is declared, neuter it
    // as we would for compiler.catcherrors
    boolean debugExceptions = (options.getBoolean(Compiler.DEBUG) ||
                               options.getBoolean(Compiler.DEBUG_SWF9));
    // For efficiency, we only insert the error handler if the
    // variable analysis shows that there is a dereference or free
    // reference in the original body of the function, or if we are
    // recording a declared exception.  We will always establish the
    // error handler if backtracing is on, since that establishes a
    // try block anyways.  Enabling backtracing is thus the way to get
    // the most accurate error reporting, at the cost of additional
    // overhead.
    if (((catchExceptions || debugExceptions) && (debugBacktrace || analyzer.dereferenced || (! free.isEmpty()))) ||
        throwExceptions) {
      String fragment = "";
      if (throwExceptions) {
        // Just record declared errors and always rethrow
        fragment +=
          "if ($lzsc$e is Error) {" +
          "  lz.$lzsc$thrownError = $lzsc$e" +
          "}" +
          "throw $lzsc$e;";
      } else {
        // Don't process errors declared to be thrown
        fragment +=
          "if (($lzsc$e is Error) && ($lzsc$e !== lz['$lzsc$thrownError'])) {";
        // Report all errors when debugging
        if (debugExceptions) {
          // TODO: [2009-03-20 dda] In DHTML, having trouble
          // successfully defining the $lzsc$runtime class, so we'll
          // report the warning more directly.
          if (this instanceof SWF9Generator) {
            fragment += "  $lzsc$runtime.$reportException(";
          } else {
            fragment += "  $reportException(";
          }
          fragment += ScriptCompiler.quote(filename) + ", " + (debugBacktrace ? "$lzsc$a.lineno" : lineno) + ", $lzsc$e);";
        }
        // Neuter errors:  either compiler.catcherrors is true, or we
        // are debugging and don't want undeclared errors to halt the
        // program.  But re-throw declared and non-errors
        fragment +=
          "} else {" +
          "  throw $lzsc$e;" +
          "}";
      }
      error.add(parseFragment(fragment));

      // Currently we only do this for the back-end that enforces types
      if (this instanceof SWF9Generator) {
        // In either case, we return a type-safe null value that is as
        // close to the default value as2 would have returned
        ASTIdentifier.Type returnType = ((ASTFormalParameterList)params).getReturnType();
        if (returnType != null) {
          String returnValue = "null";
          String typeName = returnType.typeName;
          // How handy that Java does not allow you to write switch on
          // String...
          // I think this covers all the types that won't accept null
          // (the types that are not sub-types of Object)
          if ("Boolean".equals(typeName)) {
            returnValue = "false";
          } else if ("Number".equals(typeName) ||
                     // NOTE: [2009-04-16 ptw] These are as3-only
                     // types, included for completeness but not
                     // really legal in LZX
                     "int".equals(typeName) ||
                     "uint".equals(typeName)) {
            returnValue = "0";
          } else if ("void".equals(typeName)) {
            returnValue = "";
          }
          // This _should_ be able to be in the error clause, but see
          // the note where postlude is declared
          postlude.add(parseFragment("return " + returnValue + ";"));
        }
      }
      // Not sure why we turn this off now...  Some suspicion we will recurse?
      options.putBoolean(Compiler.CATCH_FUNCTION_EXCEPTIONS, false);
    }
    // Now we visit all the wrapper code and add the variables
    // declared there (so they can be renamed properly)
    for (Iterator i = prelude.iterator(); i.hasNext(); ) {
      analyzer.visit((SimpleNode)i.next());
    }
    for (Iterator i = prefix.iterator(); i.hasNext(); ) {
      analyzer.visit((SimpleNode)i.next());
    }
    for (Iterator i = error.iterator(); i.hasNext(); ) {
      analyzer.visit((SimpleNode)i.next());
    }
    for (Iterator i = suffix.iterator(); i.hasNext(); ) {
      analyzer.visit((SimpleNode)i.next());
    }
    for (Iterator i = postlude.iterator(); i.hasNext(); ) {
      analyzer.visit((SimpleNode)i.next());
    }
    analyzer.computeReferences();
    variables.addAll(analyzer.variables);
    // Whether to insert with (this) ...
    boolean withThis = false;
    // Never in static methods
    if (! isStatic) {
      // Look for explicit #pragma, e.g., for 'dynamic' methods
      if (options.getBoolean(Compiler.WITH_THIS)) {
        withThis = true;
      } else if (! (this instanceof SWF9Generator)) {
        // In JS1 back-ends, need `with (this) ...` for implicit
        // instance references.
        // TODO: [2009-10-09 ptw] Someday store the instance variables
        // in the class translation context and fix up the free
        // references directly
        withThis = isMethod;
      }
    }
    // Note usage due to activation object and withThis
    if (withThis) {
      ClassDescriptor classdesc = (ClassDescriptor)context.getProperty(TranslationContext.CLASS_DESCRIPTION);
      if (classdesc != null) {
        Set instanceprops = classdesc.getInstanceProperties();
        if (instanceprops != null) {
          // If you know the class's instance properties, you can refine
          // this set
          possibleInstance.retainAll(instanceprops);
        }
      }
      if (! possibleInstance.isEmpty()) {
        analyzer.incrementUsed("this");
      }
    }
    Map used = analyzer.used;
    // If this is a closure, annotate the Username for metering
    if ((! closed.isEmpty()) && (userFunctionName != null) && options.getBoolean(Compiler.PROFILE)) {
      // Is there any other way to construct a closure in js
      // other than a function returning a function?
      if (context.findFunctionContext().parent.findFunctionContext() != null) {
        userFunctionName = userFunctionName + " closure";
      }
    }
    if (false) {
      System.err.println(userFunctionName +
                         ":: parameters: " + parameters +
                         ", variables: " + variables +
                         ", fundefs: " + fundefs +
                         ", used: " + used +
                         ", closed: " + closed +
                         ", free: " + free);
    }
    // Deal with warnings
    if (options.getBoolean(Compiler.WARN_UNUSED_PARAMETERS)) {
      Set unusedParams = new LinkedHashSet(parameters);
      unusedParams.removeAll(used.keySet());
      for (Iterator i = unusedParams.iterator(); i.hasNext(); ) {
        System.err.println("Warning: parameter " + i.next() + " of " + userFunctionName +
                           " unused in " + filename + "(" + lineno + ")");
      }
    }
    if (options.getBoolean(Compiler.WARN_UNUSED_LOCALS)) {
      Set unusedVariables = new LinkedHashSet(variables);
      unusedVariables.removeAll(used.keySet());
      for (Iterator i = unusedVariables.iterator(); i.hasNext(); ) {
        System.err.println("Warning: variable " + i.next() + " of " + userFunctionName +
                           " unused in " + filename + "(" + lineno + ")");
      }
    }
    // auto-declared locals
    Set auto = new LinkedHashSet();
    auto.add("this");
    auto.add("arguments");
    auto.retainAll(used.keySet());
    // parameters, locals, and auto-registers
    Set known = new LinkedHashSet(parameters);
    known.addAll(variables);
    known.addAll(auto);
    // for now, ensure that super has a value
    known.remove("super");

    Map registerMap = new HashMap();
    if (! scriptElement) {
      // All parameters and locals are remapped to 'registers' of the
      // form `$n`.  This prevents them from colliding with member
      // slots due to implicit `with (this)` added below, and also makes
      // the emitted code more compact.
      int regno = 1;
      boolean debug = options.getBoolean(Compiler.NAME_FUNCTIONS);
      for (Iterator i = (new LinkedHashSet(known)).iterator(); i.hasNext(); ) {
        String k = (String)i.next();
        String r;
        if (auto.contains(k) || closed.contains(k)) {
          ;
        } else {
          if (debug) {
            r =  k + "_$" + regno++ ;
          } else {
            r = "$" + regno++;
          }
          registerMap.put(k, r);
          // remove from known map
          known.remove(k);
        }
      }
    }
    // Always set register map.  Inner functions should not see
    // parent registers (which they would if the setting of the
    // registermap were conditional on function vs. function2)
    context.setProperty(TranslationContext.REGISTERS, registerMap);
    // Set the knownSet.  This includes the parent's known set, so
    // closed over variables are not treated as free.
    Set knownSet = new LinkedHashSet(known);
    // Add parent known
    Set parentKnown = (Set)context.parent.get(TranslationContext.VARIABLES);
    if (parentKnown != null) {
      knownSet.addAll(parentKnown);
    }
    context.setProperty(TranslationContext.VARIABLES, knownSet);

    // Replace params
    for (int i = 0, len = paramIds.length; i < len; i++) {
      if (paramIds[i] instanceof ASTIdentifier) {
        ASTIdentifier oldParam = (ASTIdentifier)paramIds[i];
        SimpleNode newParam = translateReference(oldParam).declare();
        params.set(i, newParam);
      }
    }
    translateFormalParameters(params);

    // Cf. LPP-4850: Prefix has to come after declarations (above).
    newBody.addAll(prefix);

    // Now emit functions in the activation context
    // Note: variable has already been declared so assignment does the
    // right thing (either assigns to global or local
    for (Iterator i = fundefs.keySet().iterator(); i.hasNext(); ) {
      String name = (String)i.next();
      if (scriptElement || used.containsKey(name)) {
        SimpleNode fundecl = (SimpleNode)fundefs.get(name);
        SimpleNode funexpr = new ASTFunctionExpression(0);
        funexpr.setBeginLocation(fundecl.filename, fundecl.beginLine, fundecl.beginColumn);
        funexpr.setChildren(fundecl.getChildren());
        Map map = new HashMap();
        map.put("_1", funexpr);
        // Do I need a new one of these each time?
        newBody.add((new Compiler.Parser()).substitute(fundecl, name + " = _1;", map));
      }
    }

    // The actual body of the function
    newBody.addAll(stmtList);

    // Wrap body in try and make suffix be a finally clause, so suffix
    // will not be skipped by inner returns (but postlude _will_ be skipped).
    if (! suffix.isEmpty() || ! error.isEmpty()) {
      int i = 0;
      SimpleNode newStmts = new ASTStatementList(0);
      newStmts.setChildren((SimpleNode[])newBody.toArray(new SimpleNode[0]));
      SimpleNode tryNode = new ASTTryStatement(0);
      tryNode.set(i++, newStmts);
      if (! error.isEmpty()) {
        SimpleNode catchNode = new ASTCatchClause(0);
        SimpleNode catchStmts = new ASTStatementList(0);
        catchStmts.setChildren((SimpleNode[])error.toArray(new SimpleNode[0]));
        catchNode.set(0, new ASTIdentifier("$lzsc$e"));
        catchNode.set(1, catchStmts);
        tryNode.set(i++, catchNode);
      }
      if (! suffix.isEmpty()) {
        SimpleNode finallyNode = new ASTFinallyClause(0);
        SimpleNode suffixStmts = new ASTStatementList(0);
        suffixStmts.setChildren((SimpleNode[])suffix.toArray(new SimpleNode[0]));
        finallyNode.set(0, suffixStmts);
        tryNode.set(i, finallyNode);
      }
      newBody = new ArrayList();
      newBody.addAll(prelude);
      newBody.add(tryNode);
      newBody.addAll(postlude);
    }

    // NOTE: [2009-09-30 ptw] This properly belongs inside any try
    // block, but the AS3 compiler chokes if we do that
    // https://bugs.adobe.com/jira/browse/ASC-3849

    // If we have free references and are not a script, we have to
    // obey withThis.  NOTE: [2009-09-30 ptw] See NodeModel where it
    // only inserts withThis if the method will by dynamically
    // attached, as in a <state>
    if (withThis && (! scriptElement) && (! possibleInstance.isEmpty())) {
      // NOTE: [2009-10-20 ptw] Now that we are doing this analysis in
      // the script compiler, we may insert a withThis into LFC code
      // where previously we would not have.  For now, we warn if we
      // are doing this, because it is a new policy for the LFC
      //
      // Here FLASH_COMPILER_COMPATABILITY means 'compiling the lfc'
      if (options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY)) {
        System.err.println("Warning: " + userFunctionName + " free reference(s) converted to instance reference(s): " + possibleInstance);
      }
      SimpleNode newStmts = new ASTStatementList(0);
      newStmts.setChildren((SimpleNode[])newBody.toArray(new SimpleNode[0]));
      SimpleNode withNode = new ASTWithStatement(0);
      SimpleNode id = new ASTThisReference(0);
      withNode.set(0, id);
      withNode.set(1, newStmts);
      newBody = new ArrayList();
      newBody.add(withNode);
    }

    // Process amended body
    SimpleNode newStmts = new ASTStatementList(0);
    newStmts.setChildren((SimpleNode[])newBody.toArray(new SimpleNode[0]));
    newStmts = visitStatement(newStmts);
    // Finally replace the function body with that whole enchilada
    children[stmtsIndex] = newStmts;
    if ( options.getBoolean(Compiler.NAME_FUNCTIONS) && (! options.getBoolean(Compiler.DEBUG_SWF9))) {
      // TODO: [2007-09-04 ptw] Come up with a better way to
      // distinguish LFC from user stack frames.  See
      // lfc/debugger/LzBacktrace
      String fn = (options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY) ? "lfc/" : "") + filename;
      if (functionName != null &&
          // Either it is a declaration or we are not doing backtraces
          // or profiling, so the name will be available for debugging
          // from the runtime
          (useName ||
           (! (options.getBoolean(Compiler.PROFILE) ||
               options.getBoolean(Compiler.DEBUG_BACKTRACE))))) {
        if (options.getBoolean(Compiler.PROFILE) ||
            options.getBoolean(Compiler.DEBUG_BACKTRACE)) {
          SimpleNode newNode = new ASTStatementList(0);
          int nn = 0;
          newNode.set(nn++, new Compiler.PassThroughNode(node));
          if (options.getBoolean(Compiler.PROFILE)) {
            newNode.set(nn++, parseFragment(functionName + "['" + Function.FUNCTION_NAME + "'] = " + ScriptCompiler.quote(functionName)));
          }
          if (options.getBoolean(Compiler.DEBUG_BACKTRACE)) {
            newNode.set(nn++, parseFragment(functionName + "['" + Function.FUNCTION_FILENAME + "'] = " + ScriptCompiler.quote(fn)));
            newNode.set(nn++, parseFragment(functionName + "['" + Function.FUNCTION_LINENO + "'] = " + lineno));
          }
          node = visitStatement(newNode);
        }
      } else {
        Map map = new HashMap();
        map.put("_1", node);
        SimpleNode newNode = new Compiler.PassThroughNode((new Compiler.Parser()).substitute(
          node,
          "(function () {" +
          "   var $lzsc$temp = _1;" +
          "   $lzsc$temp['" + Function.FUNCTION_NAME + "'] = " + ScriptCompiler.quote(userFunctionName) + ";" +
          ((options.getBoolean(Compiler.DEBUG_BACKTRACE)) ?
           ("   $lzsc$temp['" + Function.FUNCTION_FILENAME + "'] = " + ScriptCompiler.quote(fn) + ";" +
            "   $lzsc$temp['" + Function.FUNCTION_LINENO + "'] = " + lineno + ";") : 
           "") +
          "   return $lzsc$temp})()",
          map));
        node = newNode;
      }
    }
    if (options.getBoolean(Compiler.CONSTRAINT_FUNCTION)) {
      return new SimpleNode[] { node, depExpr };
    }
    if (catchExceptions) {
      options.putBoolean(Compiler.CATCH_FUNCTION_EXCEPTIONS, true);
    }
    return new SimpleNode[] { node, null };
  }

  // walk up the AST and find a match by type, optionally skipping the original node
  SimpleNode matchingAncestor(SimpleNode node, Class matchClass, boolean includeThis) {
    while (node != null) {
      if (includeThis && matchClass.equals(node.getClass())) {
        return node;
      }
      includeThis = true;
      node = node.getParent();
    }
    return null;
  }

  // walk down the AST and find a match by type, optionally skipping the original node
  SimpleNode matchingDescendant(SimpleNode node, Class matchClass, boolean includeThis) {
    if (node == null) {
      return null;
    }
    else if (matchClass.equals(node.getClass()) && includeThis) {
      return node;
    }
    else {
      SimpleNode[] children = node.getChildren();
      for (int i=0; i<children.length; i++) {
        SimpleNode result = matchingDescendant(children[i], matchClass, true);
        if (result != null) {
          return result;
        }
      }
    }
    return null;
  }

  // walk down the AST and find a match of an identifier with a name
  SimpleNode matchingIdentifier(SimpleNode node, String identName) {
    if (node == null) {
      return null;
    }
    else if (node instanceof ASTIdentifier && ((ASTIdentifier)node).getName().equals(identName)) {
      return node;
    }
    else {
      SimpleNode[] children = node.getChildren();
      for (int i=0; i<children.length; i++) {
        SimpleNode result = matchingIdentifier(children[i], identName);
        if (result != null) {
          return result;
        }
      }
    }
    return null;
  }

  SimpleNode translateLiteralNode(SimpleNode node) {
    return node;
  }

  SimpleNode translateReferenceForCall(SimpleNode ast) {
    return translateReferenceForCall(ast, false, null);
  }

  /* Contract is to leave a reference on the stack that will be
     dereferenced by CallFunction, etc.  Returns true if it
     succeeds.  Returns false if the ast is such that only the
     value of the reference can be pushed.  In this case, the
     callee, must use "CallMethod UNDEF" to call the value
     instead */
  SimpleNode translateReferenceForCall(SimpleNode ast, boolean checkDefined, SimpleNode node) {
    SimpleNode[] children = ast.getChildren();
    if (checkDefined) {
      assert node != null : "Must supply node for checkDefined";
    }
    if (ast instanceof ASTPropertyIdentifierReference) {
      JavascriptReference ref = translateReference(children[0]);
      String name = ((ASTIdentifier)children[1]).getName();
//       if (checkDefined) {
//         // TODO: needs to transform node
//         checkUndefinedMethod(node, ref, name);
//       }
      children[0] = ref.get();
    }
    if (ast instanceof ASTPropertyValueReference) {
      // TODO: [2002-10-26 ptw] (undefined reference coverage) Check
      JavascriptReference ref = translateReference(children[0]);
      children[1] = visitExpression(children[1]);
      children[0] = ref.get();
    }
    // The only other reason you visit a reference is to make a funcall
    boolean isref = true;
    if (ast instanceof ASTIdentifier) {
      JavascriptReference ref = translateReference(ast);
      ast = ref.preset();
    } else {
      ast = visitExpression(ast);
    }
    // TODO: wrap into node
//     if (checkDefined) {
//       checkUndefinedFunction(
//         node,
//         isref && ast instanceof ASTIdentifier ? ((ASTIdentifier)ast).getName() : null);
//     }
    return ast;
  }

  JavascriptReference translateReference(SimpleNode node) {
    return translateReference(node, 1);
  }

  static public class JavascriptReference {
    protected Compiler.OptionMap options;
    SimpleNode node;
    SimpleNode checkedNode = null;

    public JavascriptReference(Translator translator, SimpleNode node, int referenceCount) {
      this.options = translator.getOptions();
      this.node = node;
    }

    public boolean isChecked() {
      return checkedNode != null;
    }

    public SimpleNode get(boolean checkUndefined) {
      if (checkUndefined && checkedNode != null) {
        return checkedNode;
      }
      return this.node;
    }

    public SimpleNode get() {
      return get(true);
    }

    public SimpleNode preset() {
      return this.node;
    }

    public SimpleNode set (Boolean warnGlobal) {
      return this.node;
    }

    public SimpleNode set() {
      return set(null);
    }

    public SimpleNode set(boolean warnGlobal) {
      return set(Boolean.valueOf(warnGlobal));
    }

    public SimpleNode declare() {
      return this.node;
    }

    public SimpleNode init() {
      return this.node;
    }
  }

  static public abstract class MemberReference extends JavascriptReference {
    protected SimpleNode object;

    public MemberReference(Translator translator, SimpleNode node, int referenceCount, 
                          SimpleNode object) {
      super(translator, node, referenceCount);
      this.object = object;
    }
  }

  static public class VariableReference extends JavascriptReference {
    TranslationContext context;
    public final String name;

    public VariableReference(Translator translator, SimpleNode node, int referenceCount, String name) {
      super(translator, node, referenceCount);
      this.name = name;
      this.context = (TranslationContext)translator.getContext();
      Map registers = (Map)context.get(TranslationContext.REGISTERS);
      // Replace identifiers with their 'register' (i.e. rename them)
      if (registers != null && registers.containsKey(name)) {
        String register = (String)registers.get(name);
        ASTIdentifier newNode = new ASTIdentifier(0);
        newNode.setLocation(node);
        if (node instanceof ASTIdentifier) {
          ASTIdentifier oldid = (ASTIdentifier)node;
          newNode.setEllipsis(oldid.getEllipsis());
          newNode.setType(oldid.getType());
        }
        newNode.setName(register);
        this.node = new Compiler.PassThroughNode(newNode);
        return;
      }
      if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES)) {
        Set variables = (Set)context.get(TranslationContext.VARIABLES);
        if (variables != null) {
          boolean known = variables.contains(name);
          // Ensure undefined is "defined"
          known |= "undefined".equals(name);
          if (! known) {
            this.checkedNode = ((JavascriptGenerator)translator).makeCheckedNode(node);
          }
        }
      }
    }

    public SimpleNode declare() {
      Set variables = (Set)context.get(TranslationContext.VARIABLES);
      if (variables != null) {
        variables.add(this.name);
      }
      return this.node;
    }

    public SimpleNode init() {
      Set variables = (Set)context.get(TranslationContext.VARIABLES);
      if (variables != null) {
        variables.add(this.name);
      }
      return this.node;
    }

    public SimpleNode get(boolean checkUndefined) {
      if (checkUndefined && checkedNode != null) {
        return checkedNode;
      }
      return node;
    }

    public SimpleNode set(Boolean warnGlobal) {
      if (warnGlobal == null) {
        if (context.type instanceof ASTProgram) {
          warnGlobal = Boolean.FALSE;
        } else {
          warnGlobal = Boolean.valueOf(options.getBoolean(Compiler.WARN_GLOBAL_ASSIGNMENTS));
        }
      }
      if ((checkedNode != null) && warnGlobal.booleanValue()) {
        System.err.println("Warning: Assignment to free variable " + name +
                           " in " + node.filename + 
                           " (" + node.beginLine + ")");
      }
      return node;
    }
  }

  static public Set uncheckedProperties = new HashSet(Arrays.asList(new String[] {"call", "apply", "prototype"}));

  static public class PropertyReference extends MemberReference {
    String propertyName;

    public PropertyReference(Translator translator, SimpleNode node, int referenceCount, 
                               SimpleNode object, ASTIdentifier propertyName) {
      super(translator, node, referenceCount, object);
      this.propertyName = (String)propertyName.getName();
      // TODO: [2006-04-24 ptw] Don't make checkedNode when you know
      // that the member exists
      // This is not right, but Opera does not support [[Call]] on
      // call or apply, so we can't check for them
//       if (! uncheckedProperties.contains(this.propertyName)) {
//         this.checkedNode = ((JavascriptGenerator)translator).makeCheckedNode(node);
//       }
    }
  }

  static public class IndexReference extends MemberReference {
    SimpleNode indexExpr;

    public IndexReference(Translator translator, SimpleNode node, int referenceCount, 
                          SimpleNode object, SimpleNode indexExpr) {
      super(translator, node, referenceCount, object);
      this.indexExpr = indexExpr;
      // We don't check index references for compatibility with SWF compiler
    }
  }


  JavascriptReference translateReference(SimpleNode node, int referenceCount) {
    if (node instanceof ASTIdentifier) {
      return new VariableReference(this, node, referenceCount, ((ASTIdentifier)node).getName());
    }

    SimpleNode[] args = node.getChildren();
    if (node instanceof ASTPropertyIdentifierReference) {
      args[0] = visitExpression(args[0]);
      // If args[1] is an identifier, it is a literal, otherwise
      // translate it.
      if (! (args[1] instanceof ASTIdentifier)) {
        args[1] = visitExpression(args[1]);
      }
      return new PropertyReference(this, node, referenceCount, args[0], (ASTIdentifier)args[1]);
    } else if (node instanceof ASTPropertyValueReference) {
      args[0] = visitExpression(args[0]);
      args[1] = visitExpression(args[1]);
      return new IndexReference(this, node, referenceCount, args[0], args[1]);
    }

    return new JavascriptReference(this, node, referenceCount);
  }

}

/**
 * @copyright Copyright 2006-2009 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */

