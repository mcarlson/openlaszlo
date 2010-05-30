/* -*- mode: Java; c-basic-offset: 2; -*- */

/***
 * CodeGenerator.java
 * Author: Oliver Steele, P T Withington
 * Description: JavaScript -> SWF bytecode compiler
 */

//
// Code Generation
//

// The CodeGenerator recurses over the parse tree, sending instructions
// to an InstructionCollector.  The entry point is translate(), and it
// does its work by calling two mutually recursive functions,
// visitStatement and visitExpression, which dispatch to visitor
// functions for specific statement and expression types based on the
// name of the class of the parser node.  (A declaration or definition
// is considered to be a statement.)

package org.openlaszlo.sc;
import java.io.*;
import java.util.*;
import java.nio.ByteBuffer;

import org.openlaszlo.sc.parser.*;
import org.openlaszlo.sc.Instructions;
import org.openlaszlo.sc.Instructions.Instruction;

import org.openlaszlo.cache.PersistentMap;


// The code generator dispatches a node whose class is named ASTName to
// a method visitName, passing the node, a context, and the node's
// children as arguments.  The context for a statement visitor is a
// TranslationContext, defined above.  The context for an expression
// visitor is a boolean value, that is true iff the value of the
// expression is used.  The return value of a statement visitor is
// ignored.  The return value of an expression visitor is true iff it
// generated code that did NOT leave a value on the stack.  (This is so
// that an expression visitor that ignores its context need do nothing
// special to indicate that it ignored it: the default return value of
// null signals this.)
//
// Methods of the form visitName are AST node visitors, and follow the
// protocol described above.  Methods of the form translateName are
// helper functions for the visitors, and have arbitrary parameter
// lists and return values.

// TODO: [2006-01-17 ptw] Remove some day
// Replace instruction subsequences by a BLOB instruction that
// represents the same bytes.  By default, the BLOB instructions are
// separated by PUSH's (which depend on the constant pool), and
// branches and targets (since they can't be resolved until the size of
// the PUSH instructions is known).  When noConstantPool=true, PUSH's
// are compiled against a null constant pool, and branches and targets
// are compiled, so the instructions combine to a single BLOB.
// public void combineInstructions(instrsIn, noConstantPool=false) {
//     instrsOut = [];
//     buffer = ByteBuffer.allocate(64000);
//     public void flush(instrsOut=instrsOut,buffer=buffer) {
//         if (buffer.position()) {
//             import jarray;
//             bytes = jarray.zeros(buffer.position(), "b");
//             buffer.flip();
//             buffer.get(bytes);
//             buffer.clear();
//             instrsOut.append(BLOB("bytes", bytes));
//     for (instr in instrsIn) {
//         if (noConstantPool || instr.isPush || instr.isLabel || instr.hasTarget) {
//             flush();
//             instrsOut.append(instr);
//         } else {
//             instr.writeBytes(buffer, null);
//     flush();
//     return instrsOut;
// }

public class CodeGenerator extends CommonGenerator implements Translator {
  InstructionCollector collector = null;

  public InstructionCollector getCollector() {
    return collector;
  }

  protected void setRuntime(String runtime) {
    assert org.openlaszlo.compiler.Compiler.SWF_RUNTIMES.contains(runtime) : "unknown runtime " + runtime;
    Instructions.setRuntime(runtime);
  }

  // does nothing here - may be overridden to set options
  public void setGeneratorOptions() {
    globalprefix = this.options.getBoolean(Compiler.SWF8_LOADABLE_LIB) ? "_level0." : "";
  }


  public SimpleNode translate(SimpleNode program) {
    // Make a new collector each time, since the old one may be
    // referenced by the instruction cache
    this.collector = new InstructionCollector(this.options.getBoolean(Compiler.DISABLE_CONSTANT_POOL), true);
    translateInternal(program, true);
    return program;
  }

  public String preProcess(String source) {
    return source;
  }

  // TODO: [2007-11-20 dda] Consider supporting TranslationUnits
  // within this runtime code generator, so we can have a unified
  // way of calling all generators.

  public List makeTranslationUnits(SimpleNode translatedNode, boolean compress, boolean obfuscate)
  {
    throw new UnsupportedOperationException("this operation is not supported");
  }

  public byte[] postProcess(List tunits) {
    throw new UnsupportedOperationException("this operation is not supported");
  }

  public String newLabel(SimpleNode node) {
    return newLabel(node, null);
  }

  public String newLabel(SimpleNode node, String name) {
    return collector.newLabel((name != null ? name + ":" : "") + node.filename + ":" + node.beginLine);
  }

  static LessHalfAssedHashMap XfixInstrs = new LessHalfAssedHashMap();
  static {
    XfixInstrs.put(ParserConstants.INCR, Instructions.Increment);
    XfixInstrs.put(ParserConstants.DECR, Instructions.Decrement);
  };

  static LessHalfAssedHashMap UnopInstrs = new LessHalfAssedHashMap();
  static {
    UnopInstrs.put(ParserConstants.PLUS, new Instruction[] {});
    UnopInstrs.put(ParserConstants.MINUS, new Instruction[] {Instructions.PUSH.make(-1), Instructions.MULTIPLY});
    UnopInstrs.put(ParserConstants.BANG, new Instruction[] {Instructions.NOT});
    UnopInstrs.put(ParserConstants.TILDE, new Instruction[] {Instructions.PUSH.make(-1), Instructions.BitwiseXor});
    UnopInstrs.put(ParserConstants.TYPEOF, new Instruction[] {Instructions.TypeOf});
    UnopInstrs.put(ParserConstants.VOID, new Instruction[] {Instructions.POP, Instructions.PUSH.make(Values.Undefined)});
  };

  // Binop translation for swf6.  visitBinaryExpression handles swf5
  // exceptions.
  // TODO: [2006-06-17 ptw] Remove swf6 kludges now that we only
  // support swf7 and above
  static LessHalfAssedHashMap BinopInstrs = new LessHalfAssedHashMap();
  static {
    BinopInstrs.put(ParserConstants.PLUS, new Instruction[] {Instructions.ADD});
    BinopInstrs.put(ParserConstants.MINUS, new Instruction[] {Instructions.SUBTRACT});
    BinopInstrs.put(ParserConstants.STAR, new Instruction[] {Instructions.MULTIPLY});
    BinopInstrs.put(ParserConstants.SLASH, new Instruction[] {Instructions.DIVIDE});
    BinopInstrs.put(ParserConstants.REM, new Instruction[] {Instructions.MODULO});
    BinopInstrs.put(ParserConstants.BIT_AND, new Instruction[] {Instructions.BitwiseAnd});
    BinopInstrs.put(ParserConstants.BIT_OR, new Instruction[] {Instructions.BitwiseOr});
    BinopInstrs.put(ParserConstants.XOR, new Instruction[] {Instructions.BitwiseXor});
    BinopInstrs.put(ParserConstants.LSHIFT, new Instruction[] {Instructions.ShiftLeft});
    BinopInstrs.put(ParserConstants.RSIGNEDSHIFT, new Instruction[] {Instructions.ShiftRight});
    BinopInstrs.put(ParserConstants.RUNSIGNEDSHIFT, new Instruction[] {Instructions.UShiftRight});
    // swf6 returns undefined for comparisons with NaN, it
    // is supposed to return false (note that you cannot
    // eliminate one NOT by inverting the sense of the
    // comparison
    BinopInstrs.put(ParserConstants.LT, new Instruction[] {Instructions.LessThan, Instructions.NOT, Instructions.NOT});
    BinopInstrs.put(ParserConstants.GT, new Instruction[] {Instructions.GreaterThan, Instructions.NOT, Instructions.NOT});
    // swf6 does not have GE or LE, but inverting the
    // complement operator does not work for NaN ordering
    // Luckily, LogicalOr coerces undefined to false, so we
    // don't have to play the NOT NOT trick above
    BinopInstrs.put(ParserConstants.LE, new Instruction[]
    {Instructions.SetRegister.make(0), // a b
       Instructions.POP,            // a
       Instructions.DUP,            // a a
       Instructions.PUSH.make(Values.Register(0)), // a a b
       Instructions.EQUALS,         // a a==b
       Instructions.SWAP,           // a==b a
       Instructions.PUSH.make(Values.Register(0)), // a==b a b
       Instructions.LessThan,       // a==b a<b
       Instructions.LogicalOr       // a==b||a<b
       });
    BinopInstrs.put(ParserConstants.GE, new Instruction[]
    {Instructions.SetRegister.make(0), // a b
       Instructions.POP,            // a
       Instructions.DUP,            // a a
       Instructions.PUSH.make(Values.Register(0)), // a a b
       Instructions.EQUALS,         // a a==b
       Instructions.SWAP,           // a==b a
       Instructions.PUSH.make(Values.Register(0)), // a==b a b
       Instructions.GreaterThan,    // a==b a>b
       Instructions.LogicalOr       // a==b||a>b
       });
    BinopInstrs.put(ParserConstants.EQ, new Instruction[] {Instructions.EQUALS});
    BinopInstrs.put(ParserConstants.SEQ, new Instruction[] {Instructions.StrictEquals});
    // swf6 does not have NE or SNE either, but inverting
    // the complement is correct for NaN
    BinopInstrs.put(ParserConstants.NE, new Instruction[] {Instructions.EQUALS, Instructions.NOT});
    BinopInstrs.put(ParserConstants.SNE, new Instruction[] {Instructions.StrictEquals, Instructions.NOT});
    BinopInstrs.put(ParserConstants.INSTANCEOF, new Instruction[] {Instructions.InstanceOf});
    // Approximate a in b as b.a =! void 0
    BinopInstrs.put(ParserConstants.IN, new Instruction[]
      {Instructions.SWAP,
       Instructions.GetMember,
       Instructions.PUSH.make(Values.Undefined),
       Instructions.StrictEquals,
       Instructions.NOT});
  };

  static LessHalfAssedHashMap AssignOpTable = new LessHalfAssedHashMap();
  static {
    AssignOpTable.put(ParserConstants.PLUSASSIGN, ParserConstants.PLUS);
    AssignOpTable.put(ParserConstants.MINUSASSIGN, ParserConstants.MINUS);
    AssignOpTable.put(ParserConstants.STARASSIGN, ParserConstants.STAR);
    AssignOpTable.put(ParserConstants.SLASHASSIGN, ParserConstants.SLASH);
    AssignOpTable.put(ParserConstants.ANDASSIGN, ParserConstants.BIT_AND);
    AssignOpTable.put(ParserConstants.ORASSIGN, ParserConstants.BIT_OR);
    AssignOpTable.put(ParserConstants.XORASSIGN, ParserConstants.XOR);
    AssignOpTable.put(ParserConstants.REMASSIGN, ParserConstants.REM);
    AssignOpTable.put(ParserConstants.LSHIFTASSIGN, ParserConstants.LSHIFT);
    AssignOpTable.put(ParserConstants.RSIGNEDSHIFTASSIGN, ParserConstants.RSIGNEDSHIFT);
    AssignOpTable.put(ParserConstants.RUNSIGNEDSHIFTASSIGN, ParserConstants.RUNSIGNEDSHIFT);
  };

  // In-line version of Profiler#event (q.v.).
  //
  //  If name is set, uses that, otherwise uses arguments.callee.name.
  // This code must be appended to the function prefix or suffix, as
  // appropriate
  //
  SimpleNode[] meterFunctionEvent(SimpleNode node, String event, String name) {
    String getname;
    if (name != null) {
      getname = "'" + name + "'";
    } else {
      getname = "arguments.callee['" + Function.FUNCTION_NAME + "']";
    }

    // Note _root.$lzprofiler can be undedefined to disable profiling
    // at run time.
    //
    // TODO [2005-05016 ptw] (LPP-350) $flasm can clobber registers, so
    // we have to refresh then for each event
    String code = "" +
       "{" +
         "var $lzsc$lzp = _root['$lzprofiler'];" +
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
         "}" +
       "}" +
       "";
    return (new Compiler.Parser()).parse(code).getChildren();
  }

  // Only used by warning generator, hence not metered.
  // FIXME: [2006-01-17 ptw] Regression compatibility Object -> String
  void report(String reportMethod, SimpleNode node, Object message) {
    collector.push(message);
    collector.push(node.beginLine);
    collector.push(node.filename);
    collector.push(3);
    collector.push(reportMethod);
    collector.emit(Instructions.CallFunction);
  }

  // Only used by warning generator, hence not metered.
  // FIXME: [2006-01-17 ptw] Regression compatibility Object -> String
  void report(String reportMethod, SimpleNode node, Object message, Instruction inst) {
    // the dup is already emitted, this is a kludge
    assert Instructions.DUP.equals(inst);
    collector.push(message);
    collector.push(node.beginLine);
    collector.push(node.filename);
    collector.push(4);
    collector.push(reportMethod);
    collector.emit(Instructions.CallFunction);
  }

  // Emits code to check that a function is defined.  If reference is
  // set, expects the function reference to be at the top of the stack
  // when called, otherwise expects the function object.
  // TODO: [2006-01-04 ptw] Rewrite as a source transform
  void checkUndefinedFunction(SimpleNode node, String reference) {
    if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
      String label = newLabel(node);
      collector.emit(Instructions.DUP);                // ref ref
      // Get the value of a function reference
      if (reference != null) {
        collector.emit(Instructions.GetVariable);      // ref val
      }
      collector.emit(Instructions.DUP);                // ref val val
      collector.emit(Instructions.TypeOf);             // ref val type
      collector.push("function");         // ref val type "function"
      collector.emit(Instructions.StringEqual);        // ref val type=="function"
      collector.emit(Instructions.BranchIfTrue.make(label));
      // FIXME: [2006-01-17 ptw] Regression compatibility: 0 -> ""
      report("$reportNotFunction", node, reference != null ? (Object)reference : (Object)(new Integer(0)), Instructions.DUP);
      collector.emit(Instructions.LABEL.make(label));
      collector.emit(Instructions.POP);                // pop error return
    }
  }

  // Emits code to check that an object method is defined.  Expects the
  // object to be at the top of stack when called and does a trial
  // GetMember on methodName to verify that it is a function.  Object is
  // left on the stack.
  // TODO: [2006-01-04 ptw] Rewrite as a source transform
  void checkUndefinedMethod(SimpleNode node, String methodName) {
    if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
      // Check that object is not undefined
      String isUndefined = newLabel(node); // stack: object
      collector.emit(Instructions.DUP); // stack: object, object
      collector.emit(Instructions.TypeOf); // stack: object, TypeOf(object)
      collector.push("undefined"); // stack object, TypeOf(object), "undefined"
      collector.emit(Instructions.EQUALS); //  stack: object, TypeOf(object) == "undefined"
      collector.emit(Instructions.BranchIfTrue.make(isUndefined)); // stack: object
      // Check that property is a function (i.e., it is a method)
      String isMethod = newLabel(node);
      collector.emit(Instructions.DUP); // stack: object, object
      collector.push(methodName);       // stack: object, object, method
      collector.emit(Instructions.GetMember);         // stack: object, object.method
      collector.emit(Instructions.DUP); // stack object, object.method, object.method
      collector.emit(Instructions.TypeOf); // stack object, object.method, TypeOf(object.method)
      collector.push("function"); // stack object, object.method, TypeOf(object.method), "function"
      collector.emit(Instructions.EQUALS); // stack object, object.method, TypeOf(object.method) == "function"
      collector.emit(Instructions.BranchIfTrue.make(isMethod)); // stack object, object.method
      report("$reportUndefinedMethod", node, methodName, Instructions.DUP); // stack: object, null
      collector.emit(Instructions.BRANCH.make(isMethod));
      collector.emit(Instructions.LABEL.make(isUndefined)); // stack: object
      report("$reportUndefinedObjectProperty", node, methodName); // stack: object, null
      collector.emit(Instructions.LABEL.make(isMethod));
      collector.emit(Instructions.POP);                // stack: object
    }
  }

  class SWFTranslationContext extends TranslationContext {
    public boolean isEnumeration;
    public HashMap targets;

    public SWFTranslationContext(Object type, TranslationContext parent) {
      this(type, parent, null);
    }

    public SWFTranslationContext(Object type, TranslationContext parent, String label) {
      super(type, parent, label);
      // if isEnumeration is true, this context represents a
      // "for...in", and unused values need to be popped from the
      // stack during an abrupt completion
      isEnumeration = false;
      targets = new HashMap();
    }

    // Emit the code necessary to abruptly leave a context (not
    // including the jump statement itself).
    void emitBreakPreamble(SimpleNode node, CodeGenerator translator) {
      if (isEnumeration) {
        translator.unwindEnumeration(node);
      }
    }

    public void setTarget(Object type, Object instrs) {
      assert "break".equals(type) || "continue".equals(type);
      targets.put(type, instrs);
    }

    public Object getTarget(Object type) {
      assert "break".equals(type) || "continue".equals(type);
      return targets.get(type);
    }
  }

  public TranslationContext makeTranslationContext(Object type, TranslationContext parent, String label) {
    assert parent == null || parent instanceof SWFTranslationContext;
    return new SWFTranslationContext(type, parent, label);
  }
  public TranslationContext makeTranslationContext(Object type, TranslationContext parent){
    assert parent == null || parent instanceof SWFTranslationContext;
    return new SWFTranslationContext(type, parent);
  }


  void translateInternal(SimpleNode program, boolean top) {
    assert program instanceof ASTProgram;
    this.context = makeTranslationContext(ASTProgram.class, null);
    visitProgram(program, program.getChildren(), top);
  }

  String prevStatFile = null;
  int prevStatLine = -1;
  void showStats(SimpleNode node) {
    if (! options.getBoolean(Compiler.INSTR_STATS)) { return; }
    String statFile;
    int statLine;
    if (node != null) {
      statFile = node.filename;
      statLine = node.beginLine;
    } else if (prevStatFile != null) {
      statFile = prevStatFile;
      statLine = prevStatLine + 1;
    } else {
      return;
    }
    if (prevStatFile.equals(statFile) &&
        prevStatLine == statLine) {
      return;
    }
    collector.emit(Instructions.CHECKPOINT.make(statFile + ":" + statLine));
    prevStatFile = statFile;
    prevStatLine = statLine;
  }

  public SimpleNode visitProgram(SimpleNode node, SimpleNode[] directives) {
    return visitProgram(node, directives, false);
  }

  public SimpleNode visitProgram(SimpleNode node, SimpleNode[] directives, boolean top) {
    if (top &&
        // Here this means 'compiling the LFC' we only want to emit
        // the constants into the LFC
        // FIXME: There needs to be a way that the object writer
        // ensures that the constants the LZX is compiled with are the
        // same ones as are set in the LFC it is linked to
        options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY)) {
      // emit compile-time contants to runtime
      Map constants = (Map)options.get(Compiler.COMPILE_TIME_CONSTANTS);
      if (constants != null) {
        for (Iterator i = constants.entrySet().iterator(); i.hasNext(); ) {
          Map.Entry entry = (Map.Entry)i.next();
          String name = (String)entry.getKey();
          // Value is unused in this runtime
          addGlobalVar(name, null, null);
          collector.push(name);
          collector.push(entry.getValue());
          collector.emit(Instructions.VarEquals);
        }
      }
    }
    int index = 0;
    int len = directives.length;
    while (index < len) {
      SimpleNode directive = directives[index];
      SimpleNode[] children = directive.getChildren();
      directives[index] = visitDirective(directive, children);
      index += 1;
    }
    showStats(node);
    return node;
  }

  public SimpleNode visitDirective(SimpleNode directive, SimpleNode[] children) {
      if (directive instanceof ASTDirectiveBlock) {
        Compiler.OptionMap savedOptions = options;
        try {
          options = options.copy();
          return visitProgram(directive, children);
        }
        finally {
          options = savedOptions;
        }
      } else if (directive instanceof ASTIfDirective) {
        // NOTE: [2009-10-03 ptw] (LPP-1933) People expect the
        // branches of a compile-time conditional to establish a
        // directive block
        Boolean value = evaluateCompileTimeConditional(directive.get(0));
        if (value == null) {
          throw new CompilerError("undefined compile-time conditional " + Compiler.nodeString(directive.get(0)));
        }
        if (value.booleanValue()) {
          SimpleNode clause = children[1];
          Compiler.OptionMap savedOptions = options;
          try {
            options = options.copy();
            return visitDirective(clause, clause.getChildren());
          }
          finally {
            options = savedOptions;
          }
        } else if (directive.size() > 2) {
          SimpleNode clause = children[2];
          Compiler.OptionMap savedOptions = options;
          try {
            options = options.copy();
            return visitDirective(clause, clause.getChildren());
          }
          finally {
            options = savedOptions;
          }
        }
      } else if (directive instanceof ASTIncludeDirective) {
        // Disabled by default, since it isn't supported in the
        // product.  (It doesn't go through the compilation
        // manager for dependency tracking.)
        if (! options.getBoolean(Compiler.INCLUDES)) {
          throw new UnimplementedError("unimplemented: #include", directive);
        }
        String userfname = (String)((ASTLiteral)directive.get(0)).getValue();
        return translateInclude(userfname);
      } else if (directive instanceof ASTProgram) {
        // This is what an include looks like in pass 2
        return visitProgram(directive, children);
      } else if (directive instanceof ASTPragmaDirective) {
        return visitPragmaDirective(directive, children);
      } else if (directive instanceof ASTPassthroughDirective) {
        return visitPassthroughDirective(directive, children);
      } else if (directive instanceof ASTClassDefinition) {
        return visitClassDefinition(directive, children);
      } else if (directive instanceof ASTModifiedDefinition) {
        return visitModifiedDefinition(directive, children);
      }

      return visitStatement(directive, children);
  }

  public SimpleNode visitTryStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode block = children[0];
    int len = children.length;
    assert len == 2 || len == 3;
    SimpleNode catchNode = null;
    SimpleNode finallyNode = null;
    int flags = 0;

    if (len == 2) {
      // Could be catch or finally clause
      if (children[1] instanceof ASTCatchClause) {
        catchNode = children[1];
      }
      else {
        finallyNode = children[1];
      }
    }
    else {
      catchNode = children[1];
      finallyNode = children[2];
    }

    Object catchVar = "";

    // For catch and finally, reach down to get
    // the target node to visit.
    //
    if (catchNode != null) {
      SimpleNode[] catchchildren = catchNode.getChildren();
      SimpleNode id = catchchildren[0];
      assert id instanceof ASTIdentifier;
      String catchVarName = ((ASTIdentifier)id).getName();
      catchVar = catchVarName;

      Map registers = (Map) context.get(TranslationContext.REGISTERS);
      if (registers != null) {
          Instructions.Register register = (Instructions.Register) registers.get(catchVarName);
          if (register != null) {
              catchVar = register;
              flags |= Instructions.TryInstruction.FLAGS_USE_REGISTER;
          }
      }
      catchNode = catchchildren[1];
      flags |= Instructions.TryInstruction.FLAGS_HAS_CATCH;
    }
    if (finallyNode != null) {
      finallyNode = finallyNode.getChildren()[0];
      flags |= Instructions.TryInstruction.FLAGS_HAS_FINALLY;
    }

    // Try statement code looks like this in the general case:
    //
    //       try size0, size1, size2, 'varname'
    //     label0:
    //       ...try-block...
    //       branch label2:
    //     label1:
    //       ...catch-block...
    //     label2:
    //       ...finally-block...
    //     label3:
    //
    // where sizeN is the size of the code block between labelN and labelN+1.
    // either catch or finally blocks may be missing.  Whether or not
    // they are missing, we push out all the labels, it just makes it
    // easier to calculate the block sizes.

    ArrayList code = new ArrayList();

    // The first six args are 3 pairs of labels to represent the size of
    // each code block, e.g. label1 - label0 => size0
    Object[] tryargs = { new Integer(1), new Integer(0), // label1 - label0
                         new Integer(2), new Integer(1), // label2 - label1
                         new Integer(3), new Integer(2), // label3 - label2
                         catchVar, new Integer(flags)};
    code.add(Instructions.TRY.make(tryargs));
    code.add(new Integer(0));
    code.add(block);
    if (catchNode != null)  // if catch is missing, no need for branch.
      code.add(Instructions.BRANCH.make(2));
    code.add(new Integer(1));
    if (catchNode != null)
      code.add(catchNode);
    code.add(new Integer(2));
    if (finallyNode != null)
      code.add(finallyNode);
    code.add(new Integer(3));

    translateControlStructure(node, code.toArray());
                       
    return node;
  }

  public SimpleNode visitThrowStatement(SimpleNode node, SimpleNode[] children) {
    assert children.length == 1 : "throw statement missing expression";
    SimpleNode expr = children[0];

    visitExpression(expr);
    collector.emit(Instructions.THROW);
    return node;
  }

  SimpleNode translateInclude(String userfname) {

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
      List instrs = null;
      if (options.getBoolean(Compiler.CACHE_COMPILES)) {
        instrs = (List)Compiler.CachedInstructions.get(instrsKey, instrsChecksum);
      }
      if ((instrs != null) && (! options.getBoolean(Compiler.VALIDATE_CACHES))) {
        collector.appendInstructions(instrs);
      } else {
        ParseResult result = parseFile(file, userfname, source);
        int startpos = collector.size();
        if (false && options.getBoolean(Compiler.PROGRESS)) {
          System.err.println("Translating " + userfname + ")...");
        }
        translateInternal(result.parse, false);
        if ((! result.hasIncludes)) { // && collector.size() != startpos
          assert (! collector.constantsGenerated);
          // Copy for cache
          List realinstrs = new ArrayList(collector.subList(startpos, collector.size()));
          if ((instrs != null) && options.getBoolean(Compiler.VALIDATE_CACHES)) {
            if ((! realinstrs.equals(instrs))) {
              System.err.println("Bad instr cache for " + instrsKey + ": " + instrs + " != " + realinstrs);
            }
          }
          // The following line only speeds up buildlfc when
          // noConstantPool=true, which produces vastly
          // larger binaries.
          //instrs = combineInstructions(instrs, true)
          if (options.getBoolean(Compiler.CACHE_COMPILES)) {
            Compiler.CachedInstructions.put(instrsKey, instrsChecksum, realinstrs);
          }
        }
      }
    }
    catch (ParseException e) {
      System.err.println("while compiling " + file.getAbsolutePath());
      throw e;
    }
    return null;      // dummy return is ultimately ignored
  }

  public SimpleNode visitFunctionDeclaration(SimpleNode node, SimpleNode[] ast) {
    // Inner functions are handled by translateFunction
    if (ASTProgram.class.equals(context.type)) {
      assert (! options.getBoolean(Compiler.CONSTRAINT_FUNCTION));
      // Make sure all our top-level functions have root context
      String block;
      if (true) {
        block = newLabel(node);
        collector.push("_root");
        collector.emit(Instructions.GetVariable);
        collector.emit(Instructions.WITH.make(block));
      }
      translateFunction(node, true, ast);
      if (true) {
        collector.emit(Instructions.LABEL.make(block));
      }
    }
    return node;
  }

  // A method declaration is simply a function in a class
  public SimpleNode visitMethodDeclaration(SimpleNode node, SimpleNode[] ast) {
    assert context.isClassBoundary() : ("Method not in class context? " + context);
    translateMethod(node, true, ast);
    return node;
  }

  //
  // Statements
  //

  public SimpleNode visitVariableDeclaration(SimpleNode node, SimpleNode[] children) {
    ASTIdentifier id = (ASTIdentifier)children[0];
    boolean isGlobal = (ASTProgram.class.equals(context.type));
    if (isGlobal) {
      // Initial value not used in this runtime
      addGlobalVar(id.getName(), null, null);
    }
    if (children.length > 1) {
      SimpleNode initValue = children[1];
      Reference ref = translateReference(id).preset();
      visitExpression(initValue);
      ref.init();
    } else if (isGlobal) {
      // In a function, variable declarations will already be done
      Reference ref = translateReference(id).preset();
      ref.declare();
    }
    return node;
  }

  public SimpleNode visitIfStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode test = children[0];
    SimpleNode a = children[1];
    SimpleNode b = (children.length > 2) ? children[2] : null;
    // Compile-time conditional evaluations
    Boolean value = evaluateCompileTimeConditional(test);
    if (value != null) {
      if (value.booleanValue()) {
        visitStatement(a);
      } else if (b != null) {
        visitStatement(b);
      }
    } else if (b != null) {
      Object[] code = {new ForValue(test),
                       Instructions.BranchIfFalse.make(0),
                       a,
                       Instructions.BRANCH.make(1),
                       new Integer(0),
                       b,
                       new Integer(1)};
      translateControlStructure(node, code);
    } else {
      Object[] code = {new ForValue(test),
                       Instructions.BranchIfFalse.make(0),
                       a,
                       new Integer(0)};
      translateControlStructure(node, code);
    }
    return node;
  }

  public SimpleNode visitLabeledStatement(SimpleNode node, SimpleNode[] children) {
    ASTIdentifier name = (ASTIdentifier)children[0];
    SimpleNode stmt = children[1];
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      context = makeTranslationContext(ASTLabeledStatement.class, context, name.getName());
      // TODO: [2002 ows] throw semantic error for duplicate label
      String continueLabel = newLabel(node);
      String breakLabel = newLabel(node);
      ((SWFTranslationContext)context).setTarget("break", breakLabel);
      ((SWFTranslationContext)context).setTarget("continue", continueLabel);
      Object[] code = {Instructions.LABEL.make(continueLabel),
                       stmt,
                       Instructions.LABEL.make(breakLabel)};
      translateControlStructure(node, code);
      return node;
    }
    finally {
      context = context.parent;
    }
  }

  public SimpleNode visitWhileStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode test = children[0];
    SimpleNode body = children[1];
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      context = makeTranslationContext(ASTWhileStatement.class, context);
      String continueLabel = newLabel(node);
      String breakLabel = newLabel(node);
      ((SWFTranslationContext)context).setTarget("break", breakLabel);
      ((SWFTranslationContext)context).setTarget("continue", continueLabel);
      Object[] code = {Instructions.LABEL.make(continueLabel),
                       new ForValue(test),
                       Instructions.BranchIfFalse.make(breakLabel),
                       body,
                       Instructions.BRANCH.make(continueLabel),
                       Instructions.LABEL.make(breakLabel)};
      translateControlStructure(node, code);
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
      context = makeTranslationContext(ASTDoWhileStatement.class, context);
      String continueLabel = newLabel(node);
      String breakLabel = newLabel(node);
      ((SWFTranslationContext)context).setTarget("break", breakLabel);
      ((SWFTranslationContext)context).setTarget("continue", continueLabel);
      Object[] code = {Instructions.LABEL.make(continueLabel),
                       body,
                       new ForValue(test),
                       Instructions.BranchIfTrue.make(continueLabel),
                       Instructions.LABEL.make(breakLabel)};
      translateControlStructure(node, code);
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
      context = makeTranslationContext(ASTForStatement.class, context);
      String continueLabel = newLabel(node);
      String breakLabel = newLabel(node);
      ((SWFTranslationContext)context).setTarget("break", breakLabel);
      ((SWFTranslationContext)context).setTarget("continue", continueLabel);
      options.putBoolean(Compiler.WARN_GLOBAL_ASSIGNMENTS, true);
      visitStatement(init);
      options.putBoolean(Compiler.WARN_GLOBAL_ASSIGNMENTS, false);
      ArrayList code = new ArrayList();
      code.add(new Integer(0));
      // LPP-8068: Don't evaluate an empty expression
      if (! (test instanceof ASTEmptyExpression)) {
        code.add(new ForValue(test));
        code.add(Instructions.BranchIfFalse.make(breakLabel));
      }
      code.add(body);
      code.add(Instructions.LABEL.make(continueLabel));
      code.add(step);
      code.add(Instructions.BRANCH.make(0));
      code.add(Instructions.LABEL.make(breakLabel));
      translateControlStructure(node, code.toArray());
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
    translateForInStatement(node, var, Instructions.SetVariable, obj, body);
    return node;
  }

  public SimpleNode visitForVarInStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode var = children[0];
    // SimpleNode _ = children[1];
    SimpleNode obj = children[2];
    SimpleNode body = children[3];
    return translateForInStatement(node, var, Instructions.VarEquals, obj, body);
  }

  // This works because keys are always strings, and enumerate pushes
  // a null before all the keys
  public void unwindEnumeration(SimpleNode node) {
    String label = newLabel(node);
    collector.emit(Instructions.LABEL.make(label));
    collector.push(Values.Null);
    collector.emit(Instructions.EQUALS);
    collector.emit(Instructions.NOT);
    collector.emit(Instructions.BranchIfTrue.make(label));
  }

  SimpleNode translateForInStatement(SimpleNode node, SimpleNode var,
                               Instruction varset, SimpleNode obj,
                               SimpleNode body) {
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      String continueLabel = newLabel(node);
      String breakLabel = newLabel(node);
      context = makeTranslationContext(ASTForInStatement.class, context);
      ((SWFTranslationContext)context).setTarget("break", breakLabel);
      ((SWFTranslationContext)context).setTarget("continue", continueLabel);
      ((SWFTranslationContext)context).isEnumeration = true;
      Integer r0 = new Integer(0);
      visitExpression(obj);
      Object[] code = {Instructions.EnumerateValue,
                       Instructions.LABEL.make(continueLabel),
                       Instructions.SetRegister.make(r0),
                       Instructions.PUSH.make(Values.Null),
                       Instructions.EQUALS,
                       Instructions.BranchIfTrue.make(breakLabel)};
      translateControlStructure(node, code);
      Reference ref = translateReference(var).preset();
      collector.emit(Instructions.PUSH.make(Values.Register(0)));
      if (varset == Instructions.VarEquals) {
        ref.init();
      } else {
        ref.set(true);
      }
      Object[] moreCode = {body,
                           Instructions.BRANCH.make(continueLabel),
                           Instructions.LABEL.make(breakLabel)};
      translateControlStructure(node, moreCode);
      return node;
    }
    finally {
      context = context.parent;
    }
  }

  public SimpleNode visitContinueStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode label = children.length > 0 ? children[0] : null;
    return translateAbruptCompletion(node, "continue", (ASTIdentifier)label);
  }

  public SimpleNode visitBreakStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode label = children.length > 0 ? children[0] : null;
    return translateAbruptCompletion(node, "break", (ASTIdentifier)label);
  }

  SimpleNode translateAbruptCompletion(SimpleNode node, String type, ASTIdentifier label) {
    TranslationContext targetContext =
      context.findLabeledContext(label != null ? label.getName() : null);
    if (targetContext == null) {
      if (label != null) {
        throw new SemanticError("unknown " + type + " target: " + label.getName(), node);
      } else {
        throw new SemanticError("can't " + type + " from current statement", node);
      }
    }
    String targetLabel = (String)((SWFTranslationContext)targetContext).getTarget(type);
    if (targetLabel == null) {
      throw new SemanticError("can't " + type + " from current statement", node);
    }
    // For each intervening enumeration, pop the stack
    TranslationContext c = context;
    while (! targetContext.equals(c)) {
      ((SWFTranslationContext)c).emitBreakPreamble(node, this);
      c = c.getParentStatement();
    }
    if ("break".equals(type)) {
      ((SWFTranslationContext)targetContext).emitBreakPreamble(node, this);
    }
    collector.emit(Instructions.BRANCH.make(targetLabel));
    return node;
  }

  public SimpleNode visitAndExpressionSequence(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode a = children[0];
    SimpleNode b = children[1];
    return translateAndOrExpression(node, true, a, b);
  }

  public SimpleNode visitOrExpressionSequence(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode a = children[0];
    SimpleNode b = children[1];
    return translateAndOrExpression(node, false, a, b);
  }

  SimpleNode translateAndOrExpression(SimpleNode node, boolean isand, SimpleNode a, SimpleNode b) {
    visitExpression(a);
    collector.emit(Instructions.DUP);
    if (isand) {
      collector.emit(Instructions.NOT);
    }
    String label = newLabel(node);
    collector.emit(Instructions.BranchIfTrue.make(label));
    collector.emit(Instructions.POP);
    visitExpression(b);
    collector.emit(Instructions.LABEL.make(label));
    return node;
  }

  public SimpleNode visitReturnStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode value = children[0];
    TranslationContext c = context;
    while ((! c.isFunctionBoundary())) {
      ((SWFTranslationContext)c).emitBreakPreamble(node, this);
      c = c.getParentStatement();
      if (c == null) {
        throw new SemanticError("return not within a function body");
      }
    }
    visitExpression(value);
    if (options.getBoolean(Compiler.PROFILE) || options.getBoolean(Compiler.DEBUG_BACKTRACE)) {
      collector.emit(Instructions.BRANCH.make(c.label));
    } else {
      collector.emit(Instructions.RETURN);
    }
    return node;
  }

  public SimpleNode visitWithStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode expr = children[0];
    SimpleNode stmt = children[1];
    Object[] code = {new ForValue(expr),
                     Instructions.WITH.make(new Integer(0)),
                     stmt,
                     new Integer(0)};
    return translateControlStructure(node, code);
  }

  public SimpleNode visitSwitchStatement(SimpleNode node, SimpleNode[] children) {
    SimpleNode expr = children[0];
    LinkedHashMap tests = new LinkedHashMap();
    LinkedHashMap targets = new LinkedHashMap();
    String defaultLabel = null;
    String label = newLabel(node, "label" + 0);
    for (int i = 1, len = children.length; i < len; i++) {
      SimpleNode clause = children[i];
      if (clause instanceof ASTDefaultClause) {
        if (defaultLabel != null) {
          throw new SemanticError("duplicate default clause");
        }
        defaultLabel = label;
        // Empty cases share label with subsequent
        if (clause.size() > 0) {
          targets.put(label, clause);
          label = newLabel(node, "label" + i);
        }
      } else {
        assert clause instanceof ASTCaseClause : "case clause expected";
        tests.put(clause.get(0), label);
        // Empty cases share label with subsequent
        if (clause.size() > 1) {
          targets.put(label, clause);
          label = newLabel(node, "label" + i);
        }
      }
    }
    String finalLabel = newLabel(node, "finalLabel");
    // TODO: [2003-04-15 ptw] bind context slot macro
    try {
      context = makeTranslationContext(ASTSwitchStatement.class, context);
      ((SWFTranslationContext)context).setTarget("break", finalLabel);
      visitExpression(expr);
      // TODO: [2002 ows] warn on duplicate tests
      for (Iterator i = tests.keySet().iterator(); i.hasNext(); ) {
        SimpleNode value = (SimpleNode)i.next();
        String l = (String)tests.get(value);
        collector.emit(Instructions.DUP);
        visitExpression(value);
        collector.emit(Instructions.EQUALS);
        collector.emit(Instructions.BranchIfTrue.make(l));
      }
      if (defaultLabel != null) {
        collector.emit(Instructions.BRANCH.make(defaultLabel));
      }
      else {
        collector.emit(Instructions.POP);
        collector.emit(Instructions.BRANCH.make(finalLabel));
      }
      String nextLabel = null;
      for (Iterator i = targets.keySet().iterator(); i.hasNext(); ) {
        String l = (String)i.next();
        SimpleNode clause = (SimpleNode)targets.get(l);
        collector.emit(Instructions.LABEL.make(l));
        collector.emit(Instructions.POP);
        if (l.equals(defaultLabel)) {
          defaultLabel = null;
        }
        if (nextLabel != null) {
          collector.emit(Instructions.LABEL.make(nextLabel));
          nextLabel = null;
        }
        // Emit the statements of the clause;
        SimpleNode[] stmts = clause.getChildren();
        if (clause instanceof ASTCaseClause) {
          for (int j = 1, len = stmts.length; j < len; j++) {
            visitStatement(stmts[j]);
          }
        } else {
          for (int j = 0, len = stmts.length; j < len; j++) {
            visitStatement(stmts[j]);
          }
        }
        Instruction previous = (Instruction)collector.get(collector.size() - 1);
        if (! previous.isUnconditionalRedirect()) {
          nextLabel = newLabel(node, "nextLabel");
          collector.emit(Instructions.BRANCH.make(nextLabel));
        }
      }
      // Handle empty default as last clause
      if (defaultLabel != null) {
        collector.emit(Instructions.LABEL.make(defaultLabel));
        collector.emit(Instructions.POP);
      }
      // Handle fall-though in last clause
      if (nextLabel != null) {
        collector.emit(Instructions.LABEL.make(nextLabel));
      }
      collector.emit(Instructions.LABEL.make(finalLabel));
    }
    finally {
      context = context.parent;
    }
    return node;
  }

  static class LabelMap {
    Map labels = new HashMap();
    SimpleNode node;
    CodeGenerator translator;

    LabelMap(SimpleNode node, CodeGenerator translator) {
      this.node = node;
      this.translator = translator;
    }

    String lookupLabel(Object n) { // integer -> label
      if (labels.containsKey(n)) {
        return (String)labels.get(n);
      }
      String label = translator.newLabel(node);
      labels.put(n, label);
      return label;
    }

    String[] lookupLabels(Object[] vals) {
      String[] rets = new String[vals.length];
      for (int i=0; i<vals.length; i++) {
        rets[i] = lookupLabel(vals[i]);
      }
      return rets;
    }

    Instruction resolveLocalLabel(Object instr) {
      if (instr instanceof Integer) {
        return Instructions.LABEL.make(lookupLabel(instr));
      }
      if (instr instanceof Instructions.TargetInstruction) {
        Instructions.TargetInstruction target = (Instructions.TargetInstruction)instr;
        Object targetval = target.getTarget();
        if (targetval instanceof Object[]) {
          return target.replaceTarget(lookupLabels((Object[])targetval));
        }
        if (targetval instanceof Integer) {
          return target.replaceTarget(lookupLabel(targetval));
        }
      }
      return (Instruction)instr;
    }
  }

  // Used to mark items in the sequence to be evaluated for a value
  static class ForValue {
    SimpleNode node;

    ForValue(SimpleNode node) {
      this.node = node;
    }
  }
  
  // seq is a list whose items are interpreted thus:
  // - numbers are turned into labels
  // - target instructions have their targets, which are numbers,
  //   resolved to labels
  // - ForValue's are evaluated as expressions (for value)
  // - Other nodes are compiled as statements
  // - all other instructions are emitted as is
  // Ensure context targets are not ambiguous
  SimpleNode translateControlStructure(SimpleNode node, Object[] seq) {
    assert context instanceof SWFTranslationContext : "wrong context";
    assert ((SWFTranslationContext)context).targets != null : "no targets in " + context;
    for (Iterator i = ((SWFTranslationContext)context).targets.values().iterator(); i.hasNext(); ) {
      Object v = i.next();
      assert (! (v instanceof Integer)) : "Ambiguous context target " + v;
    }
    LabelMap lm = new LabelMap(node, this);
    for (int i = 0, len = seq.length; i < len; i++ ) {
      Object item = seq[i];
      if (item instanceof Integer ||
          item instanceof Instruction) {
        // TODO [2004-03-04 ptw] Handle this in the assembler
        if (item instanceof Instructions.BranchIfFalseInstruction) {
          collector.emit(Instructions.NOT);
          item = Instructions.BranchIfTrue.make(((Instructions.BranchIfFalseInstruction)item).getTarget());
        }
        collector.emit(lm.resolveLocalLabel(item));
      } else if (item instanceof ForValue) {
        visitExpression(((ForValue)item).node);
      } else {
        SimpleNode n = (SimpleNode)item;
        visitStatement(n, n.getChildren());
      }
    }
    return node;
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

    SimpleNode newNode = super.visitExpression(node, isReferenced);

    if ((! isReferenced) && (newNode != null)) {
      collector.emit(Instructions.POP);
      newNode = null;
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
    return translateReference(node).get().node;
  }

  public SimpleNode visitLiteral(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // Side-effect free expressions can be suppressed if not referenced
    // Following is disabled by default for regression testing.
    // TODO: [2003-02-17 ows] enable this
    if ((! isReferenced) && options.getBoolean(Compiler.ELIMINATE_DEAD_EXPRESSIONS)) {
      return null;
    }
    Object value = translateLiteralNode(node);
    if (value instanceof String) {
      String str = (String)value;
      // Can't push a constant that will cause the instruction to have
      // a byte length > 2^16-1.  String constant needs a type byte
      // and a (byte) 0 terminator, plus a 2-byte length field.
      // Strings are UTF-8, so may be more than one byte per
      // character.
      int maxBytes = (1<<16)-1-1-1-2;
      int byteLen = 0;
      // Assume worst case (that every character will take 4 bytes
      // when UTF-8 encoded), since the only way to be more exact is to
      // loop over the string trying different splits and measuring
      // the length of the encoded bytes.
      byteLen = str.length()*4;
      if (byteLen > maxBytes) {
        // Find a split that makes it fit
        // wtf doesn't Java have ceil, etc. methods on frickin' ints?
        int nChunks = (byteLen + (maxBytes - 1))/maxBytes; // (int)Math.ceil((double)l/(double)maxBytes);
        int strLen = str.length();
        int chunkLen = (strLen + (nChunks - 1))/nChunks; // (int)Math.ceil((double)l/(double)nChunks);
        int start = 0, end = chunkLen, next;
        while (start < strLen) {
          collector.push(str.substring(start, end));
          start = end;
          next = end + chunkLen;
          end = (next > strLen)?strLen:next;
        }
        while (--nChunks > 0) {
          collector.emit(Instructions.ADD);
        }
        return node;
      }
    }
    collector.push(value);
    return node;
  }

  public SimpleNode visitExpressionList(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // all but last expression will not be referenced, so
    // visitExpression will pop it.  If the list is not referenced,
    // then the last will be popped too
    int i = 0, len = children.length - 1;
    for ( ; i < len; i++) {
      visitExpression(children[i], false);
    }
    return visitExpression(children[len], isReferenced);
  }

  public SimpleNode visitEmptyExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // Side-effect free expressions can be suppressed if not referenced
    if ((! isReferenced)) {
      return null;
    }
    collector.push(Values.Undefined);
    return node;
  }

  public SimpleNode visitThisReference(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // Side-effect free expressions can be suppressed if not referenced
    if ((! isReferenced)) {
      return null;
    }
    return translateReference(node).get().node;
  }

  public SimpleNode visitArrayLiteral(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    boolean suppressed = (! isReferenced);
    // Wrong evaluation order
    int len = 0;
    for (int i = children.length - 1; i >= 0; i--) {
      if (visitExpression(children[i], isReferenced) != null) {
        len++;
        suppressed = false;
      }
    }
    if (! suppressed) {
      collector.push(len);
      collector.emit(Instructions.InitArray);
      return node;
    }
    else
      return null;
  }

  public SimpleNode visitObjectLiteral(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    boolean isKey = true;
    for (int i = 0, len = children.length; i < len; i++) {
      SimpleNode item = children[i];
      if (isKey && item instanceof ASTIdentifier) {
        collector.push(((ASTIdentifier)item).getName());
      } else {
        visitExpression(item);
      }
      isKey = (! isKey);
    }
    collector.push(children.length / 2);
    collector.emit(Instructions.InitObject);
    return node;
  }

  public SimpleNode visitFunctionExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    Compiler.OptionMap savedOptions = options;
    try {
      options = options.copy();
      options.putBoolean(Compiler.CONSTRAINT_FUNCTION, false);
      // Make sure all our top-level functions have root context
      String block = null;
      if (ASTProgram.class.equals(context.type)) {
        block = newLabel(node);
        collector.push("_root");
        collector.emit(Instructions.GetVariable);
        collector.emit(Instructions.WITH.make(block));
      }
      translateFunction(node, false, children);
      if (block != null) {
        collector.emit(Instructions.LABEL.make(block));
      }
    }
    finally {
      options = savedOptions;
    }
    return node;
  }

  // A method declaration may appear in an expression context (when it
  // is in the Class.make plist)
  public SimpleNode visitMethodDeclarationAsExpression(SimpleNode node,  boolean isReferenced, SimpleNode[] ast) {
    assert context.isClassBoundary() : ("Method not in class context? " + context);
    // When a method declaration is an expression, don't use the name
    translateMethod(node, false, ast);
    return node;
  }

  public SimpleNode visitModifiedDefinitionAsExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // Modifiers, like 'final', are ignored unless this is handled
    // by the runtime.

    assert children.length == 1;
    SimpleNode child = children[0];

    ((ASTModifiedDefinition)node).verifyTopLevel(child);

    return visitExpression(child, isReferenced);
  }

  public SimpleNode visitFunctionCallParameters(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // FIXME: [2002-01-07 ows] This evaluates function call
    // parameters in the wrong order.
    for (int i = children.length - 1; i >= 0; i--) {
      visitExpression(children[i]);
    }
    collector.push(children.length);
    return node;
  }

  public SimpleNode visitPropertyIdentifierReference(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    // TODO: [2002-12-12 ows] consolidate with the code in for..in
    // TODO: [2002-12-12 ows] find out how this generalizes to a.b.c
    // TODO: [2002-12-18 ows] enabling this saves 2K of the LFC, but
    // doesn't seem to improve speed, and changes the background color
    // of the menu items in contacts to white (don't know why).
    if (false && children[0] instanceof ASTIdentifier && children[1] instanceof ASTIdentifier) {
      collector.push(((ASTIdentifier)children[0]).getName() + ":" + ((ASTIdentifier)children[1]).getName());
      collector.emit(Instructions.GetVariable);
      return node;
    }
    return translateReference(node).get().node;
  }

  public SimpleNode visitPropertyValueReference(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    return translateReference(node).get().node;
  }

  public SimpleNode noteCallSite (SimpleNode node) {
      // Note current call-site in a function context and backtracing
    if ((options.getBoolean(Compiler.DEBUG_BACKTRACE) && (node.beginLine != 0)) &&
        (context.findFunctionContext() != null)) {
      Map registers = (Map)context.get(TranslationContext.REGISTERS);
      // We know arguments register will exist if we are doing
      // bactraces because it will be referenced in the function
      // prefix.
      if (registers != null && registers.containsKey("arguments")) {
        collector.push(Values.Register(((Instructions.Register)registers.get("arguments")).regno));
        collector.push("lineno");
        collector.push(node.beginLine);
        collector.emit(Instructions.SetMember);
      }
    }
    return node;
  }

  public SimpleNode visitCallExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode fnexpr = children[0];
    SimpleNode[] args = children[1].getChildren();
    int arglen = args.length;
    if (fnexpr instanceof ASTIdentifier) {
      ASTIdentifier fn = (ASTIdentifier)fnexpr;
      String name = fn.getName();
      // Expose getTimer at our API
      //
      // FIXME: [2002-12-23 ows] This substitution is not correct
      // because it assumes that the value for "getTimer" that"s
      // in scope is the global variable.
      if ("getTimer".equals(name) && arglen == 0) {
        collector.emit(Instructions.GetTimer);
        return node;
      }
      if (options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY)) {
        if ("trace".equals(name)) {
          if (options.get(Compiler.COMPILE_TRACE) == "flash") {
            // FIXME: [2003-01-08 ows] Nicer warning for trace()
            // FIXME: [2003-01-08 ows] Warn, at least, when
            // there's more than one arg.
            visitExpression(args[0]);
            // FIXME: [2003-03-13 ptw] Why doesn't the trace instruction work?
            collector.push(1);
            collector.push("trace");
            collector.emit(Instructions.CallFunction);
            return node;      // was true for trace instruction?
          } else if (options.get(Compiler.COMPILE_TRACE) == "debug") {
            visitExpression(args[0]);
            collector.push("_root");
            collector.emit(Instructions.GetVariable);
            collector.push("Debug");
            collector.emit(Instructions.GetMember);
            collector.push("write");
            collector.emit(Instructions.CallMethod);
            return node;
          }
          // else fall through
          return null;
        }
        if ("fscommand".equals(name) && arglen == 2) {
          assert args[0] instanceof ASTLiteral;
          Object v = translateLiteralNode(args[0]);
          assert v instanceof String;
          collector.push("FSCommand:" + v);
          visitExpression(args[1]);
          collector.emit(Instructions.GetURL2.make(0));
          return null;
        }
        if ("FSCommand2".equals(name)) {
          visitFunctionCallParameters(node, isReferenced, args);
          collector.emit(Instructions.FSCommand2);
          return null;
        }
        if ("removeMovieClip".equals(name) && arglen == 1) {
          visitExpression(args[0]);
          collector.emit(Instructions.RemoveClip);
          return null;         // no return value
        }
        if ("ord".equals(name) && arglen ==1) {
          visitExpression(args[0]);
          collector.emit(Instructions.ORD);
          return node;
        }
        if ("targetPath".equals(name) && arglen == 1) {
          visitExpression(args[0]);
          collector.emit(Instructions.TargetPath);
          return node;
        }
        // TODO: [2002-11-30 ows] The following clause needs to
        // swap the arguments.  To preserve evaluation order,
        // it could visit them in reverse order if they don't
        // have side effects, otherwise emit SWAP.
        //- if "getURL".equals(name) && arglen == 2:
        //-    collector.emit(Instructions.GetURL2.make(0)); return
        if ("getVersion".equals(name) && arglen == 0) {
          collector.push("/:$version");
          collector.emit(Instructions.GetVariable);
          return node;
        }
        if ("eval".equals(name) && arglen == 1) {
          visitExpression(args[0]);
          collector.emit(Instructions.GetVariable);
          return node;
        }
      }
    }
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
        String thisvar = "$lzsc$" + UUID();
        String propvar = "$lzsc$" + UUID();
        String valvar = "$lzsc$" + UUID();
        String svar = "$lzsc$" + UUID();
        String evtvar = "$lzsc$" + UUID();
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
        visitStatement(newStmts);
        return null;
      }
    }

    noteCallSite(node);
    // Okay, it is not going to be transformed.  Just do it!
    visitFunctionCallParameters(node, isReferenced, args);
    boolean isref = translateReferenceForCall(fnexpr, true, node);
    if (isref) {
      if (fnexpr instanceof ASTPropertyIdentifierReference ||
          fnexpr instanceof ASTPropertyValueReference) {
        collector.emit(Instructions.CallMethod);
      } else {
        collector.emit(Instructions.CallFunction);
      }
    } else {
      // This is how you invoke a function value
      collector.push(Values.Undefined);
      collector.emit(Instructions.CallMethod);
    }
    return node;
  }

  public SimpleNode visitSuperCallExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode n = translateSuperCallExpression(node, isReferenced, children);
    visitCallExpression(n, isReferenced, n.getChildren());
    return n;
  }

  public SimpleNode visitNewExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode ref = children[0];
    SimpleNode[] args = children[1].getChildren();
    noteCallSite(node);
    visitFunctionCallParameters(node, isReferenced, args);
    boolean isref = translateReferenceForCall(ref, true, node);
    if (isref) {
      if (ref instanceof ASTPropertyIdentifierReference ||
          ref instanceof ASTPropertyValueReference) {
        collector.emit(Instructions.NewMethod);
      } else {
        collector.emit(Instructions.NEW);
      }
    } else {
      // This is how you invoke a function value
      collector.push(Values.Undefined);
      collector.emit(Instructions.NewMethod);
    }
    return node;
  }

  public SimpleNode visitPrefixExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode op = children[0];
    SimpleNode ref = children[1];
    return translateXfixExpression(ref, op, true, isReferenced);
  }

  public SimpleNode visitPostfixExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode ref = children[0];
    SimpleNode op = children[1];
    return translateXfixExpression(ref, op, false, isReferenced);
  }

  SimpleNode translateXfixExpression(SimpleNode refnode, SimpleNode opnode, boolean isPrefix, boolean isReferenced) {
    Instruction op = (Instruction)XfixInstrs.get(((ASTOperator)opnode).getOperator());
    if (isReferenced) {
      if (! isPrefix) {
        // Old value is left on stack
        Reference ref = translateReference(refnode, 3).get().preset().get();
        collector.emit(op);
        ref.set();
      } else {
        // New value is left on stack
        Reference ref = translateReference(refnode, 2).preset().get();
        collector.emit(op);
        collector.emit(Instructions.SetRegister.make(0));
        ref.set();
        collector.push(Values.Register(0));
      }
      return refnode;
    } else {
      // Not referenced, no value left on stack
      Reference ref = translateReference(refnode, 2).preset().get();
      collector.emit(op);
      ref.set();
      return null;
    }
  }

  public SimpleNode visitUnaryExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    int op = ((ASTOperator)children[0]).getOperator();
    // I guess the parser doesn't know the difference
    if (ParserConstants.INCR == (op) || ParserConstants.DECR == (op)) {
      return visitPrefixExpression(node, isReferenced, children);
    }
    SimpleNode arg = children[1];
    // a little bit of constant-folding, so that "-1" looks like a constant
    if (ParserConstants.MINUS == (op) && arg instanceof ASTLiteral) {
      Object v = translateLiteralNode(arg);
      if (v instanceof Number) {
        // This works because swf represents all numbers as doubles
        collector.push(new Double((- ((Number)v).doubleValue())));
        return node;
      }
    }
    // special-cased, since this operates on a ref rather than a value
    if (ParserConstants.DELETE == (op)) {
      boolean isref = translateReferenceForCall(arg);
      if (isref) {
        collector.emit(Instructions.DELETE);
      } else {
        collector.emit(Instructions.DELETE2);
      }
      return node;
    }
    if (options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY) && ParserConstants.MINUS == (op)) {
      collector.push(0);
      visitExpression(arg);
      collector.emit(Instructions.SUBTRACT);
      return node;
    }
    // special-case typeof(variable) to not emit undefined-variable
    // checks so there is a warning-free way to check for undefined
    if (ParserConstants.TYPEOF == (op) &&
        (arg instanceof ASTIdentifier ||
         arg instanceof ASTPropertyValueReference ||
         arg instanceof ASTPropertyIdentifierReference)) {
      translateReference(arg).get(false);
    } else {
      visitExpression(arg);
    }
    Instruction[] instrs = (Instruction[])UnopInstrs.get(op);
    assert instrs != null : "No instrr for op " + op;
    if (options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY) &&
        ParserConstants.TILDE == (op)) {
      instrs = new Instruction[] {Instructions.PUSH.make(new Long(0xffffffffL)),
                                  Instructions.BitwiseXor};
    }
    for (int i = 0, len = instrs.length; i < len; i++) {
      collector.emit(instrs[i]);
    }
    return node;
  }

  public SimpleNode visitBinaryExpressionSequence(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode a = children[0];
    SimpleNode op = children[1];
    SimpleNode b = children[2];
    return translateBinaryExpression(node, isReferenced, (ASTOperator)op, a, b);
  }

  SimpleNode translateBinaryExpression(SimpleNode node, boolean isReferenced, ASTOperator operator, SimpleNode a, SimpleNode b) {
    int op =  operator.getOperator();
    if (ParserConstants.CAST == op) {
      // Approximate `a cast b` as `a`
      // TODO: [2008-01-08 ptw] We could typecheck and throw an error
      // in debug mode
      visitExpression(a);
      return node;
    }
    if (ParserConstants.SUBCLASSOF ==  op) {
      Map map = new HashMap();
      map.put("_1", a);
      map.put("_2", b);
      String pattern = "($lzsc$issubclassof(_1, _2))";
      SimpleNode n = (new Compiler.Parser()).substitute(node, pattern, map);
      return visitExpression(n);
    }
    visitExpression(a);
    visitExpression(b);
    if (ParserConstants.IS == op) {
      // Approximate `a is b` as `b['$lzsc$isa'] ? b.$lzsc$isa(a) : (a
      // instanceof b)`
      Object[] code = {
        Instructions.DUP,                    // a b b
        Instructions.PUSH.make("$lzsc$isa"), // a b b $lzsc$isa
        Instructions.GetMember,              // a b b.$lzsc$isa
        Instructions.BranchIfTrue.make(1),   // a b
        Instructions.InstanceOf,             // (a instanceof b)
        Instructions.BRANCH.make(2),
        new Integer(1),                      // a b
        Instructions.PUSH.make(1),           // a b 1
        Instructions.SWAP,                   // a 1 b
        Instructions.PUSH.make("$lzsc$isa"), // a 1 b '$lzsc$isa'
        Instructions.CallMethod,             // b.$lzsc$isa(a)
        new Integer(2)};
      translateControlStructure(node, code);
      // NOTE: [2009-04-20 ptw] Too costly to do this for every `in`,
      // just use this logic for checkUndefinedProperty
//     } else if (ParserConstants.IN == op) {
//       // Approximate `a in b` as `b[a] !== void 0 || b.hasOwnProperty(a)`
//       Object[] code = {
//         Instructions.SetRegister.make(0),           // a b
//         Instructions.POP,                           // a
//         Instructions.DUP,                           // a a
//         Instructions.PUSH.make(Values.Register(0)), // a a b
//         Instructions.SWAP,                          // a b a
//         Instructions.GetMember,                     // a b[a]
//         Instructions.PUSH.make(Values.Undefined),   // a b[a] undefined
//         Instructions.StrictEquals,                  // a b[a]===undefined
//         Instructions.BranchIfTrue.make(1),          // a
//         Instructions.POP,                           //
//         Instructions.PUSH.make(Values.True),        // true
//         Instructions.BRANCH.make(2),                // true
//         new Integer(1),                             // a
//         Instructions.PUSH.make(1),                  // a 1
//         Instructions.PUSH.make(Values.Register(0)), // a 1 b
//         Instructions.PUSH.make("hasOwnProperty"),   // a 1 b 'hasOwnProperty'
//         Instructions.CallMethod,                    // b.hasOwnProperty(a)
//         new Integer(2)};
//       translateControlStructure(node, code);
    } else {
      Instruction[] instrs = (Instruction[])BinopInstrs.get(op);
      for (int i = 0, len = instrs.length; i < len; i++) {
        collector.emit(instrs[i]);
      }
    }
    return node;
  }

  public SimpleNode visitConditionalExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode test = children[0];
    SimpleNode a = children[1];
    SimpleNode b = children[2];
    String l1 = newLabel(node);
    String l2 = newLabel(node);
    visitExpression(test);
    collector.emit(Instructions.BranchIfTrue.make(l1));
    visitExpression(b);
    collector.emit(Instructions.BRANCH.make(l2));
    collector.emit(Instructions.LABEL.make(l1));
    visitExpression(a);
    collector.emit(Instructions.LABEL.make(l2));
    return node;
  }

  public SimpleNode visitAssignmentExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    SimpleNode lhs = children[0];
    ASTOperator opnode = (ASTOperator)children[1];
    SimpleNode rhs = children[2];
    int op = opnode.getOperator();
    Reference ref = null;
    if (ParserConstants.ASSIGN == (op)) {
      ref = translateReference(lhs).preset();
      visitExpression(rhs);
    } else {
      ref = translateReference(lhs, 2).preset();
      ref.get();
      visitExpression(rhs);
      Instruction[] instrs = (Instruction[])BinopInstrs.get(AssignOpTable.get(op));
      for (int i = 0, len = instrs.length; i < len; i++) {
        collector.emit(instrs[i]);
      }
    }
    if (isReferenced) {
      collector.emit(Instructions.SetRegister.make(0));
    }
    ref.set();
    if (isReferenced) {
      collector.push(Values.Register(0));
      // Python version always returned true, but that is clearly wrong
      return node;
    }
    return null;
  }

  SimpleNode translateFunction(SimpleNode node, boolean useName, SimpleNode[] children) {
    return translateFunction(node, useName, children, false);
  }

  SimpleNode translateMethod(SimpleNode node, boolean useName, SimpleNode[] children) {
    return translateFunction(node, useName, children, true);
  }

  // useName => declaration not expression
  SimpleNode translateFunction(SimpleNode node, boolean useName, SimpleNode[] children, boolean isMethod) {
    // label for profiling return
    String label = newLabel(node);
    // TODO: [2003-04-15 ptw] bind context slot macro
    SimpleNode dependencies = null;
    // methodName and scriptElement
    Compiler.OptionMap savedOptions = options;
    try {
      options = options.copy();
      context = makeTranslationContext(ASTFunctionExpression.class, context, label);
      node = formalArgumentsTransformations(node);
      children = node.getChildren();
      dependencies = translateFunctionInternal(node, useName, children, isMethod);
    }
    finally {
      options = savedOptions;
      context = context.parent;
    }
    // Dependency function is not compiled in the function context
    if (dependencies != null) {
      collector.emit(Instructions.DUP);
      collector.push("dependencies");
      visitExpression(dependencies);
      collector.emit(Instructions.SetMember);
    }
    return node;
  }

  // Internal helper function for above
  // useName => declaration not expression
  SimpleNode translateFunctionInternal(SimpleNode node, boolean useName, SimpleNode[] children, boolean isMethod) {
    // ast can be any of:
    //   FunctionDefinition(name, args, body)
    //   FunctionDeclaration(name, args, body)
    //   FunctionDeclaration(args, body)
    // Handle the two arities:
    String functionName = null;
    SimpleNode params;
    SimpleNode stmts;
    if (children.length == 3) {
      ASTIdentifier functionNameIdentifier = (ASTIdentifier)children[0];
      params = children[1];
      stmts = children[2];
      functionName = functionNameIdentifier.getName();
    } else {
      params = children[0];
      stmts = children[1];
    }

    // function block
    String block = newLabel(node);
    String userFunctionName = null;
    String filename = node.filename != null? node.filename : "unknown file";
    String lineno = "" + node.beginLine;
    if (functionName != null) {
      userFunctionName = functionName;
    } else {
      // TODO: [2003-06-19 ptw] (krank) Sanitization of names to
      // identifiers moved to krank user, remove #- when it works
      //- from string import translate, maketrans
      //- trans = maketrans(" /.", "___")
      //- filename = translateInternal(node.filename or "unknown file", trans, """);
      // Why do .as filenames have quotes around the string?
      //- userFunctionName = "%s$%d_%d" % (filename, node.lineNumber, node.columnNumber)
      // FIXME: [2006-01-17 ptw] Regression compatibility \" ->
      userFunctionName = "" + filename + "#" +  lineno + "/" + node.beginColumn;
    }
    if ((! useName)) {
      functionName = null;
    }
    // Tell metering to look up the name at runtime if it is not a
    // global name (this allows us to name closures more
    // mnemonically at runtime
    String meterFunctionName = useName ? functionName : null;
    // Pull all the pragmas from the statement list: process them, and
    // remove them
    assert stmts instanceof ASTStatementList;
    List stmtList = new ArrayList(Arrays.asList(stmts.getChildren()));
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
    assert (! options.getBoolean(Compiler.CONSTRAINT_FUNCTION));
    boolean isStatic = isStatic(node);
    // Analyze local variables (and functions)
    VariableAnalyzer analyzer = new VariableAnalyzer(params, options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY), false, this);
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

    List prefix = new ArrayList();
    List postfix = new ArrayList();
    if (options.getBoolean(Compiler.DEBUG_BACKTRACE)) {
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
      prefix.addAll(Arrays.asList((new Compiler.Parser()).parse("" +
             "{" +
               "\n#pragma 'warnUndefinedReferences=false'\n" +
               "var $lzsc$d = Debug; var $lzsc$s = $lzsc$d['backtraceStack'];" +
               "if ($lzsc$s) {" +
               "  var $lzsc$a = " + args + ";" +
               "  $lzsc$a.callee = arguments.callee;" +
               (isStatic ? "" : "  $lzsc$a['this'] = this;") +
               "  $lzsc$a.filename = " + ScriptCompiler.quote(fn) + ";" +
               "  $lzsc$a.lineno = " + lineno + ";" +
               "  $lzsc$s.push($lzsc$a);" +
               "  if ($lzsc$s.length > $lzsc$s.maxDepth) {$lzsc$d.stackOverflow()};" +
               "}" +
             "}" +
             "").getChildren()));
      postfix.addAll(Arrays.asList((new Compiler.Parser()).parse("" +
             "{" +
               "\n#pragma 'warnUndefinedReferences=false'\n" +
               "if ($lzsc$s) {" +
                 "$lzsc$s.length--;" +
               "}" +
             "}" +
             "").getChildren()));
    }
    if (options.getBoolean(Compiler.PROFILE)) {
      prefix.addAll(Arrays.asList(meterFunctionEvent(node, "calls", meterFunctionName)));
      postfix.addAll(Arrays.asList(meterFunctionEvent(node, "returns", meterFunctionName)));
    }

    // Now we visit all the wrapper code and add the variables
    // declared there (so they can be renamed properly)
    for (Iterator i = prefix.iterator(); i.hasNext(); ) {
      analyzer.visit((SimpleNode)i.next());
    }
    for (Iterator i = postfix.iterator(); i.hasNext(); ) {
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
      } else {
        // In JS1 back-ends, need `with (this) ...` for implicit
        // instance references.
        // TODO: [2009-10-09 ptw] Someday store the instance variables
        // in the class translation context and fix up the free
        // references directly
        withThis = isMethod;
      }
    }
    // Note usage due to withThis
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
    boolean scriptElement = options.getBoolean(Compiler.SCRIPT_ELEMENT);
    // Scripts do not get withThis.  If there are no possible instance
    // refs, we don't need withThis.
    if (scriptElement || possibleInstance.isEmpty()) {
      withThis = false;
    }
    Map used = analyzer.used;
    // If this is a closure, annotate the Username for metering
    if ((! closed.isEmpty()) && (functionName != null) && options.getBoolean(Compiler.PROFILE)) {
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
                         ", free: " + free +
                         ", possible: " + possibleInstance);
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
    translateFormalParameters(params);
    // auto-declared locals
    Set auto = new LinkedHashSet(Instructions.Register.AUTO_REG);
    auto.retainAll(used.keySet());
    // parameters, locals, and auto-registers
    Set known = new LinkedHashSet(parameters);
    known.addAll(variables);
    known.addAll(auto);
    // for now, ensure that super has a value
    known.remove("super");
    Set knownSet = new LinkedHashSet(known);
    context.setProperty(TranslationContext.VARIABLES, knownSet);

    Map registerMap = new HashMap();
    // Always set register map.  Inner functions should not see
    // parent registers (which they would if the setting of the
    // registermap were conditional on function vs. function2)
    context.setProperty(TranslationContext.REGISTERS, registerMap);
    // TODO: [2004-03-24] Analyze register usage in $flasm and
    // account for it (or rename $flasm regs?)
    // NB: Only Flash Player 6r65 or better understands function2
    if (options.getBoolean(Compiler.GENERATE_FUNCTION_2) &&
        (options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY) ||
         options.getBoolean(Compiler.GENERATE_FUNCTION_2_FOR_LZX)) &&
        (! scriptElement) &&
        (! used.containsKey("eval")) &&
        (! used.containsKey("$flasm"))) {
      Set autoRegisters = new LinkedHashSet();
      for (Iterator i = auto.iterator(); i.hasNext(); ) {
        autoRegisters.add(Instructions.Register.make(((String)i.next())));
      }
      // fnArgs _must_ be in order
      Set fnArgs = new LinkedHashSet(autoRegisters);
      SortedMap paramRegisters = new TreeMap();
      SortedMap varRegisters = new TreeMap(new DoubleCollator());
      int j = parameters.size();
      for (Iterator i = parameters.iterator(); i.hasNext(); j--) {
        String v = (String)i.next();
        // Parameters that are closed over but will not be moved to an
        // activation block (because of withThis) must not be
        // registered
        if (used.containsKey(v) && (withThis || (! closed.contains(v)))) {
          Instructions.Register reg = Instructions.Register.make(v);
          fnArgs.add(reg);
          paramRegisters.put("" + j, reg);
        } else {
          // Always accept the arg, even if not used, since they are positional
          fnArgs.add(v);
        }
      }
      j = 0;
      // FIXME: [2006-01-17 ptw] TreeSet is for Regression compatibility
      variables = new TreeSet(variables);
      for (Iterator i = variables.iterator(); i.hasNext(); j++) {
        String v = (String)i.next();
        // Variables that are closed over must not be registered.  If
        // withThis, they will be created in the activation block,
        // otherwise just declared.
        if (used.containsKey(v) && (! closed.contains(v))) {
          Instructions.Register reg = Instructions.Register.make(v);
          // Most used first, original order disambiguates
          varRegisters.put(new Double(- (((Integer)used.get(v)).doubleValue() + (double)j / 1000)), reg);
        } else {
          ;
        }
      }
      if ((! autoRegisters.isEmpty()) || (! paramRegisters.isEmpty()) || (! varRegisters.isEmpty())) {
        // Don't know how Flash assigns registers (one would
        // have thought the parameters should be in stack order
        // and others by frequency of use), but we do know the
        // auto registers always come first in order and r:0 is
        // never assigned.  It appears the parameters are
        // assigned last.
        // TODO: [2004-03-29 ptw] Measure the cost of loading a
        // parameter register so we know whether to weight them
        // the same as var registers when there aren't enough
        // registers
        List registers = new ArrayList(autoRegisters);
        for (Iterator i = varRegisters.values().iterator(); i.hasNext(); ) {
          registers.add(i.next());
        }
        for (Iterator i = paramRegisters.values().iterator(); i.hasNext(); ) {
          registers.add(i.next());
        }
        // Assign register numbers [1, 255]
        if (registers.size() > 254) {
          registers = registers.subList(0, 254);
        }
        byte regno = 1;
        for (Iterator i =  registers.iterator(); i.hasNext(); regno++ ) {
          Instructions.Register r = (Instructions.Register)i.next();
          r.regno = regno;
          registerMap.put(r.name, r);
        }
        // It appears you have to always allocate r:0, hence
        // regno, not len(registers)
        List args = new ArrayList();
        args.add(block); args.add(functionName); args.add(new Integer(regno)); args.addAll(fnArgs);
        collector.emit(Instructions.DefineFunction2.make(args.toArray()));
      } else {
        List args = new ArrayList();
        args.add(block); args.add(functionName); args.addAll(parameters);
        collector.emit(Instructions.DefineFunction.make(args.toArray()));
      }
    } else {
      List args = new ArrayList();
      args.add(block); args.add(functionName); args.addAll(parameters);
      collector.emit(Instructions.DefineFunction.make(args.toArray()));
    }

    int activationObjectSize = 0;
    if (scriptElement) {
      // Create all variables (including inner functions) in global scope
      if (! variables.isEmpty()) {
        if (registerMap.containsKey("_root")) {
          collector.push(Values.Register(((Instructions.Register)registerMap.get("_root")).regno));
        } else {
          collector.push("_root");
          collector.emit(Instructions.GetVariable);
        }
        // Optimization dups fetch of root for all but last which consumes it
        int j = 0, len = variables.size() - 1;
        for (Iterator i = variables.iterator(); i.hasNext(); j++) {
          if (j < len) {
            collector.emit(Instructions.DUP);
          }
          String name = (String)i.next();
          // TODO: [2008-04-16 ptw] Retain type information through
          // analyzer so it can be passed on here
          addGlobalVar(name, null, "void 0");
          collector.push(name);
          collector.push(Values.Undefined);
          collector.emit(Instructions.SetMember);
        }
      }
      // scriptElements must be compiled inside with(_root) -- that is
      // their required environment because all their local bindings
      // are transformed to _root bindings (and will not be if they
      // are loaded as snippets)
      if (registerMap.containsKey("_root")) {
        collector.push(Values.Register(((Instructions.Register)registerMap.get("_root")).regno));
      } else {
        collector.push("_root");
        collector.emit(Instructions.GetVariable);
      }
      collector.emit(Instructions.WITH.make(block));
    }
    // If we have free references and are not a script, we have to
    // obey withThis.  NOTE: [2009-09-30 ptw] See NodeModel where it
    // only inserts withThis if the method will by dynamically
    // attached, as in a <state>
    if (withThis) {
      // NOTE: [2009-10-20 ptw] Now that we are doing this analysis in
      // the script compiler, we may insert a withThis into LFC code
      // where previously we would not have.  For now, we warn if we
      // are doing this, because it is a new policy for the LFC
      //
      // Here FLASH_COMPILER_COMPATABILITY means 'compiling the lfc'
      if (options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY)) {
        System.err.println("Warning: " + userFunctionName + " free reference(s) converted to instance reference(s): " + possibleInstance);
      }
      if (registerMap.containsKey("this")) {
        collector.push(Values.Register(((Instructions.Register)registerMap.get("this")).regno));
      } else {
        collector.push("this");
        collector.emit(Instructions.GetVariable);
      }
      collector.emit(Instructions.WITH.make(block));
      // create closed parameters in an activation context: inner
      // functions refer to the unregistered parameter name, we have
      // to create that name in a context to avoid the parameter name
      // incorrectly getting shadowed by an instance property.
      LinkedHashSet toCreate = new LinkedHashSet(parameters);
      toCreate.retainAll(closed);
      for (Iterator i = toCreate.iterator(); i.hasNext(); ) {
        Object var = i.next();
        collector.push(var);
        collector.push(Values.Register(((Instructions.Register)registerMap.get(var)).regno));
        activationObjectSize += 1;
        // Now 'unregister' the parameter, so the function body shares
        // the closed value.
        registerMap.remove(var);
      }
      // Now create unregistered, used variables in the activation
      // context (in general, these will be closed variables);
      toCreate = new LinkedHashSet(variables);
      toCreate.retainAll(used.keySet());
      toCreate.removeAll(registerMap.keySet());
      for (Iterator i = toCreate.iterator(); i.hasNext(); ) {
        Object var = i.next();
        collector.push(var);
        collector.push(Values.Undefined);
        activationObjectSize += 1;
      }
      if (activationObjectSize > 0) {
        collector.push(activationObjectSize);
        collector.emit(Instructions.InitObject);
        collector.emit(Instructions.WITH.make(block));
      }
    } else if (! scriptElement) {
      // create unregistered, used variable declarations (because
      // Reference#init does a set for known).  Parameters are already
      // declared.
      LinkedHashSet toCreate = new LinkedHashSet(variables);
      toCreate.retainAll(used.keySet());
      toCreate.removeAll(registerMap.keySet());
      for (Iterator i = toCreate.iterator(); i.hasNext(); ) {
        Object var = i.next();
        collector.push(var);
        collector.emit(Instructions.VAR);
      }
    }
    // inner functions do not get scriptElement treatment
    options.putBoolean(Compiler.SCRIPT_ELEMENT, false);
    // or the magic with(this) treatment
    options.putBoolean(Compiler.WITH_THIS, false);
    // Now emit functions in the activation context
    if (scriptElement) {
      // create functions in global scope
      // Note: variable has already been declared so SetVariable
      // does the right thing
      for (Iterator i = fundefs.keySet().iterator(); i.hasNext(); ) {
        String name = (String)i.next();
        SimpleNode fun = (SimpleNode)fundefs.get(name);
        // Make sure all our top-level functions have root context
        String withBlock = newLabel(node);
        collector.push("_root");
        collector.emit(Instructions.GetVariable);
        collector.emit(Instructions.WITH.make(withBlock));
        collector.push(name);
        translateFunction(fun, false, fun.getChildren());
        collector.emit(Instructions.SetVariable);
        collector.emit(Instructions.LABEL.make(withBlock));
      }
    } else {
      for (Iterator i = fundefs.keySet().iterator(); i.hasNext(); ) {
        String name = (String)i.next();
        SimpleNode fun = (SimpleNode)fundefs.get(name);
        if (used.containsKey(name)) {
          if ((! registerMap.containsKey(name))) {
            collector.push(name);
          }
          translateFunction(fun, false, fun.getChildren());
          if (registerMap.containsKey(name)) {
            collector.emit(Instructions.SetRegister.make(((Instructions.Register)registerMap.get(name)).regno));
            collector.emit(Instructions.POP);
          } else {
            collector.emit(Instructions.SetVariable);
          }
        }
      }
    } // end of else scriptElement
    if (! prefix.isEmpty()) {
      visitStatementList(node, (SimpleNode[])prefix.toArray(new SimpleNode[0]));
      // label flushes optimizer
      collector.emit(Instructions.LABEL.make(newLabel(node)));
    }
    visitStatementList(node, (SimpleNode[])stmtList.toArray(new SimpleNode[0]));
    // runtime handles implicit return except if postfix
    if (! postfix.isEmpty()) {
      collector.push(Values.Undefined);
      collector.emit(Instructions.LABEL.make(context.findFunctionContext().label));
      visitStatementList(node, (SimpleNode[])postfix.toArray(new SimpleNode[0]));
      collector.emit(Instructions.RETURN);
    }
    // close function
    collector.emit(Instructions.LABEL.make(block));
    if (options.getBoolean(Compiler.NAME_FUNCTIONS)) {
      if (functionName != null) {
        // Named functions do not leave a value on the stack
        collector.push(functionName);
        collector.emit(Instructions.GetVariable);
      } else {
        // Function expression leaves function on stack
        collector.emit(Instructions.DUP);
      }
      // Save that so we can set function length in debug mode..
      collector.emit(Instructions.DUP);
      if (options.getBoolean(Compiler.DEBUG_BACKTRACE)) {
        // Save for filename and line
        collector.emit(Instructions.DUP);
        collector.emit(Instructions.DUP);
      }
      collector.push(Function.FUNCTION_NAME);
      collector.push(userFunctionName);
      collector.emit(Instructions.SetMember);
      collector.push("length");
      collector.push(parameters.size());
      collector.emit(Instructions.SetMember);
      if (options.getBoolean(Compiler.DEBUG_BACKTRACE)) {
        // TODO: [2007-09-04 ptw] Come up with a better way to
        // distinguish LFC from user stack frames.  See
        // lfc/debugger/LzBactrace
        String fn = (options.getBoolean(Compiler.FLASH_COMPILER_COMPATABILITY) ? "lfc/" : "") + filename;
        collector.push(Function.FUNCTION_FILENAME);
        collector.push(fn);
        collector.emit(Instructions.SetMember);
        collector.push(Function.FUNCTION_LINENO);
        collector.push(lineno);
        collector.emit(Instructions.SetMember);
      }
    }
    return null;
  }

  Object translateLiteralNode(SimpleNode node) {
    Object value = ((ASTLiteral)node).getValue();
    if (value == null) {
      return Values.Null;
    } else if (value instanceof Boolean) {
      return (((Boolean)value).booleanValue()) ? Values.True : Values.False; 
    }
    return value;
  }

  boolean translateReferenceForCall(SimpleNode ast) {
    return translateReferenceForCall(ast, false, null);
  }

  /* Contract is to leave a reference on the stack that will be
     dereferenced by CallFunction, etc.  Returns true if it
     succeeds.  Returns false if the ast is such that only the
     value of the reference can be pushed.  In this case, the
     callee, must use "CallMethod UNDEF" to call the value
     instead */
  boolean translateReferenceForCall(SimpleNode ast, boolean checkDefined, SimpleNode node) {
    if (checkDefined) {
      assert node != null : "Must supply node for checkDefined";
    }
    if (ast instanceof ASTPropertyIdentifierReference) {
      translateReference(ast.get(0)).get();
      String name = ((ASTIdentifier)ast.get(1)).getName();
      if (checkDefined) {
        checkUndefinedMethod(node, name);
      }
      collector.push(name);
      return true;
    }
    if (ast instanceof ASTPropertyValueReference) {
      // TODO: [2002-10-26 ptw] (undefined reference coverage) Check
      translateReference(ast.get(0)).get();
      visitExpression(ast.get(1));
      return true;
    }
    // The only other reason you visit a reference is to make a funcall
    boolean isref = true;
    if (ast instanceof ASTIdentifier) {
      Reference ref = translateReference(ast);
      if (ref instanceof VariableReference && 
          ((VariableReference)ref).register != null) {
        ref.get();
        isref = false;
      } else {
        ref.preset();
      }
    } else {
      visitExpression(ast);
      isref = false;
    }
    if (checkDefined) {
      checkUndefinedFunction(
        node,
        isref && ast instanceof ASTIdentifier ? ((ASTIdentifier)ast).getName() : null);
    }
    return isref;
  }

  /***
   * A Reference represents a variable, property, or array reference ---
   * a LeftHandSide in the grammar.  References can be retrieved or
   * assigned.
   */
  static public abstract class Reference {
    public CodeGenerator translator;
    public SimpleNode node;
    public int referenceCount;
    protected Compiler.OptionMap options;
    protected InstructionCollector collector;

    public Reference (CodeGenerator translator, SimpleNode node, int referenceCount) {
      this.translator = translator;
      this.options = translator.getOptions();
      this.collector = translator.getCollector();
      this.node = node;
      this.referenceCount = referenceCount;
    }

    protected void report(String reportMethod, String message) {
        // TODO: [2005-12-21 ptw]
  //       collector.emitCall(reportMethod,
  //                          fname, lineno, propertyName);
        collector.push(message);
        collector.push(node.beginLine);
        collector.push(node.filename);
        collector.push(3);
        collector.push(reportMethod);
        collector.emit(Instructions.CallFunction);
        //
        collector.emit(Instructions.POP); // pop error return
    }

    // Check that the reference count supplied at initialization
    // time was large enough.
    protected void _pop() {
      assert referenceCount > 0;
      referenceCount -= 1;
    }

    // Emit instructions that push this reference's value onto the
    // stack.
    public abstract Reference get(boolean checkUndefined);

    public Reference get() {
      return get(true);
    }

    // Emit instructions that set the stack up to set this
    // reference's value.  Example use:
    //           reference.preset()
    //           generator.push(1)
    //           reference.set().
    public abstract Reference preset();

    // Emit instructions that set the value of this object.  See
    // preset() for an example.
    public abstract Reference set(Boolean warnGlobal);

    public Reference set() {
      return set(null);
    }

    public Reference set(boolean warnGlobal) {
      return set(Boolean.valueOf(warnGlobal));
    }

    public Reference declare() {
      throw new CompilerError("unsupported reference operation: declare");
    }

    public Reference init() {
      throw new CompilerError("unsupported reference operation: init");
    }
  }

  static public abstract class MemberReference extends Reference {
    protected SimpleNode object;

    public MemberReference(CodeGenerator translator, SimpleNode node, int referenceCount, 
                          SimpleNode object) {
      super(translator, node, referenceCount);
      this.object = object;
    }

    // Emits code to check that the object exists before making a
    // property reference.  Expects the object to be at the top of stack
    // when called.
    protected void checkUndefinedObjectProperty(String propertyName) {
      if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
        String label = translator.newLabel(node);
        collector.emit(Instructions.DUP);
        collector.push(Values.Undefined);
        collector.emit(Instructions.StrictEquals);
        collector.emit(Instructions.NOT);
        collector.emit(Instructions.BranchIfTrue.make(label));
        report("$reportUndefinedObjectProperty", propertyName);
        collector.emit(Instructions.LABEL.make(label));
      }
    }

    // Emits code to check that an object property selector is
    // defined.  Note this test is a little looser than other undefined
    // tests -- we want to warn if someone is using null as a selector
    // too, hence the '==undefined' test.  Expects the object member to
    // be at the top of stack when called.
    protected void checkUndefinedPropertySelector(String propertyName) {
      if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
        String label = translator.newLabel(node);
        collector.emit(Instructions.DUP); // s s
        collector.push(Values.Undefined); // s s UNDEF
        collector.emit(Instructions.EQUALS); // s s==UNDEF
        collector.emit(Instructions.NOT); // s s!=UNDEF
        collector.emit(Instructions.BranchIfTrue.make(label));
        report("$reportUndefinedProperty", propertyName);
        collector.emit(Instructions.LABEL.make(label));
      }
    }

    // Emits code to check that an object property exists
    // Expects the object and property to get to be at the top of stack when
    // called, leaves the member value on the stack if it exists, otherwise UNDEF
    protected void checkUndefinedProperty(String propertyName) {
      if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
        Object[] code = {
          Instructions.SetRegister.make(0),           // o p
          Instructions.SWAP,                          // p o
          Instructions.DUP,                           // p o o
          Instructions.PUSH.make(Values.Register(0)), // p o o p
          Instructions.GetMember,                     // p o o[p]
          Instructions.PUSH.make(Values.Undefined),   // p o o[p] undefined
          Instructions.StrictEquals,                  // p o o[p]===undefined
          Instructions.BranchIfTrue.make(1),          // p o
          Instructions.SWAP,                          // o p
          Instructions.GetMember,                     // o[p]
          Instructions.BRANCH.make(2),                // o[p]
          new Integer(1),                             // p o
          Instructions.PUSH.make(1),                  // p o 1
          Instructions.SWAP,                          // p 1 o
          Instructions.PUSH.make("hasOwnProperty"),   // p 1 o 'hasOwnProperty'
          Instructions.CallMethod,                    // p.hasOwnProperty(p)
          Instructions.BranchIfTrue.make(3),          //
          // Cf., report("$reportUndefinedProperty", propertyName)
          Instructions.PUSH.make(propertyName),       // n
          Instructions.PUSH.make(node.beginLine),     // n #
          Instructions.PUSH.make(node.filename),      // n # ""
          Instructions.PUSH.make(3),                  // n # "" 3
          Instructions.PUSH.make("$reportUndefinedProperty"),
          Instructions.CallFunction,                  // ?
          Instructions.POP,                           //
          new Integer(3),                             //
          Instructions.PUSH.make(Values.Undefined),   // undefined
          new Integer(2)};                            // o[p] || undefined
        translator.translateControlStructure(node, code);
      } else {
        collector.emit(Instructions.GetMember);
      }
    }

    protected abstract void pushObject(boolean checkUndefined);

    public Reference preset() {
      _pop();
      pushObject(true);
      return this;
    }

    public Reference set(Boolean warnGlobal) {
      collector.emit(Instructions.SetMember);
      return this;
    }
  }

  static public class VariableReference extends Reference {
    TranslationContext context;
    public final String name;
    public final Instructions.Register register;
    boolean known;

    public VariableReference(CodeGenerator translator, SimpleNode node, int referenceCount, String name) {
      super(translator, node, referenceCount);
      this.name = name;
      this.context = (TranslationContext)translator.getContext();
      Map registers = (Map)context.get(TranslationContext.REGISTERS);
      if (registers != null) {
        this.register = (Instructions.Register)registers.get(name);
      } else {
        this.register = null;
      }
      Set variables = (Set)context.get(TranslationContext.VARIABLES);
      if (variables != null) {
        this.known = variables.contains(name);
        // TODO: [2005-12-22 ptw] Not true ECMAscript
        // Ensure undefined is "defined"
        known |= "undefined".equals(name);
      }
    }

    // Emits code to check that an object variable is defined.
    // Expects the value of the variable to be at the top of stack when
    // called.
    private void checkUndefinedVariable(SimpleNode node, String variableName) {
      if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
        String label = translator.newLabel(node);
        collector.emit(Instructions.DUP);
        collector.push(Values.Undefined);
        collector.emit(Instructions.StrictEquals);
        collector.emit(Instructions.NOT);

        collector.emit(Instructions.BranchIfTrue.make(label));
        report("$reportUndefinedVariable", variableName);
        collector.emit(Instructions.LABEL.make(label));
      }
    }

    public Reference get(boolean checkUndefined) {
      _pop();
      if (register != null) {
        collector.emit(Instructions.PUSH.make(Values.Register(register.regno)));
      } else {
        collector.push(name);
        collector.emit(Instructions.GetVariable);
      }
      if (checkUndefined && (! known)) {
        checkUndefinedVariable(node, name);
      }
      return this;
    }

    public Reference preset() {
      _pop();
      if (register == null) {
        if ("undefined".equals(name)) {
          throw new SemanticError("Invalid l-value", node);
        }
        collector.push(name);
      }
      return this;
    }

    public Reference set(Boolean warnGlobal) {
      if (warnGlobal == null) {
        if (context.type instanceof ASTProgram) {
          warnGlobal = Boolean.FALSE;
        } else {
          warnGlobal = Boolean.valueOf(options.getBoolean(Compiler.WARN_GLOBAL_ASSIGNMENTS));
        }
      }
      if ((! known) && warnGlobal.booleanValue()) {
        System.err.println("Warning: Assignment to free variable " + name +
                           " in " + node.filename + 
                           " (" + node.beginLine + ")");
      }
      if (register != null) {
        collector.emit(Instructions.SetRegister.make(new Integer(register.regno)));
        // TODO: [2004-03-24 ptw] Optimize this away if the value is used
        collector.emit(Instructions.POP);
      } else {
        collector.emit(Instructions.SetVariable);
      }
      return this;
    }

    public Reference declare() {
      // If in a function, already declared
      if (! known) {
        collector.emit(Instructions.VAR);
      }
      return this;
    }

    public Reference init() {
      // If in a function, already declared
      if (known) {
        set();
      } else {
        collector.emit(Instructions.VarEquals);
      }
      return this;
    }
  }

  static public class PropertyReference extends MemberReference {
    String propertyName;

    public PropertyReference(CodeGenerator translator, SimpleNode node, int referenceCount, 
                               SimpleNode object, ASTIdentifier propertyName) {
      super(translator, node, referenceCount, object);
      this.propertyName = (String)propertyName.getName();
    }

    protected void pushObject(boolean checkUndefined) {
      translator.visitExpression(object);
      if (checkUndefined) {
        checkUndefinedObjectProperty(propertyName);
        if (propertyName == "undefined") {
          throw new SemanticError("Invalid l-value", node);
        }
      }
      collector.push(propertyName);
    }

    public Reference get(boolean checkUndefined) {
      _pop();
      pushObject(checkUndefined);
      if (checkUndefined) {
        checkUndefinedProperty(propertyName);
      } else {
        collector.emit(Instructions.GetMember);
      }
      return this;
    }

  }

  static public class IndexReference extends MemberReference {
    SimpleNode indexExpr;

    public IndexReference(CodeGenerator translator, SimpleNode node, int referenceCount, 
                          SimpleNode object, SimpleNode indexExpr) {
      super(translator, node, referenceCount, object);
      this.indexExpr = indexExpr;
    }

    protected void pushObject(boolean checkUndefined) {
      // incorrect semantics, but compatible with Flash
      translator.visitExpression(object);
      if (checkUndefined) {
        checkUndefinedObjectProperty("[]");
      }
      translator.visitExpression(indexExpr);
      if (checkUndefined) {
        // TODO: [2005-04-17 ptw] Perhaps use Compiler.nodeString(node)
        // instead of "[]"?
        checkUndefinedPropertySelector("[]");
      }
    }

    public Reference get(boolean checkUndefined) {
      _pop();
      pushObject(checkUndefined);
      // TODO: [2003-05-14 ptw] checkUndefined
      if (false) {                // (checkUndefined) {
        checkUndefinedProperty("[]");
      } else {
        collector.emit(Instructions.GetMember);
      }
      return this;
    }

  }

  // NOTE: [2002-10-24 ptw] Not completely right, this handles the case
  // where a literal is the target of a method operation.  It is like a
  // reference but it is not an lvalue.
  static public class LiteralReference extends Reference {

    public LiteralReference(CodeGenerator translator, SimpleNode node, int referenceCount) {
      super(translator, node, referenceCount);
    }

    public Reference get(boolean checkUndefined) {
      _pop();
      translator.visitExpression(node);
      return this;
    }

    public Reference preset() {
      throw new SemanticError("Invalid literal operation", node);
    }

    public Reference set(Boolean warnGlobal) {
      throw new SemanticError("Invalid literal operation", node);
    }
  }



  Reference translateReference(SimpleNode node) {
    return translateReference(node, 1);
  }

  Reference translateReference(SimpleNode node, int referenceCount) {
    if (node instanceof ASTIdentifier) {
      return new VariableReference(this, node, referenceCount, ((ASTIdentifier)node).getName());
    }
    if (node instanceof ASTThisReference) {
      return new VariableReference(this, node, referenceCount, "this");
    }
    SimpleNode[] args = node.getChildren();
    if (node instanceof ASTPropertyIdentifierReference) {
      return new PropertyReference(this, node, referenceCount, args[0], (ASTIdentifier)args[1]);
    } else if (node instanceof ASTPropertyValueReference) {
      return new IndexReference(this, node, referenceCount, args[0], args[1]);
    }

    return new LiteralReference(this, node, referenceCount);
  }

  public void compileBlock(SimpleNode translatedNode) { };
}

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2010 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/
