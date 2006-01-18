/* -*- mode: Java; c-basic-offset: 2; -*- */

/***
 * Compiler.java
 * Author: Oliver Steele, P T Withington
 * Description: JavaScript -> SWF bytecode compiler
 */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2005 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/


package org.openlaszlo.sc;
import java.io.*;
import java.util.*;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;

import org.openlaszlo.server.LPS;
import org.openlaszlo.sc.parser.*;
import org.openlaszlo.sc.parser.SimpleNode;
import org.openlaszlo.sc.Translator;

// Values
import org.openlaszlo.sc.Values;

// Instructions
import org.openlaszlo.sc.Instructions;
import org.openlaszlo.sc.Instructions.Instruction;
import org.openlaszlo.sc.InstructionPrinter;

public class Compiler {
  // The parse tree is stored with the key (fname) and the
  // value (ASTProgram, hasIncludes).
  // It doesn't save any time to persist this cache to disk.
  public static ScriptCompilerCache CachedParses;
  // The instructions are stored with the keys (fname, cpass) where
  // cpass is one of the compiler passes (1 or 2).  The checksum in
  // both cases is the file content string.
  // It costs 10s to persist this to disk, but speeds up subsequent
  // compiles.
  // Instantiate this lazily, so that we don't construct it in server
  // mode (since the call to os.getenv in the cache constructor won't
  // work there).
  public static ScriptCompilerCache CachedInstructions;

  public OptionMap options;

  //
  // Compiler Facade
  //
  public Compiler (Map initialOptions) {
    this.options = new OptionMap(initialOptions);
    if (! options.containsKey(ACTIVATION_OBJECT)) {
      options.putBoolean(ACTIVATION_OBJECT,
                         ! options.getBoolean(FLASH_COMPILER_COMPATABILITY));
    }
    if (! options.containsKey(COMPILE_TIME_CONSTANTS)) {
      options.put(COMPILE_TIME_CONSTANTS, new HashMap());
    }
    // TODO: [2002-1-05 ows] enable this instead of the line that
    // follows it, once the sources comply
    //- options.put(ALLOW_ROOT,
    //- options.get(FLASH_COMPILER_COMPATABILITY))
    if (! options.containsKey(ALLOW_ROOT)) {
      options.putBoolean(ALLOW_ROOT, true);
    }
    if (! options.containsKey(OBFUSCATE)) {
      options.putBoolean(OBFUSCATE, false);
    }
    if (! options.containsKey(RUNTIME)) {
      options.put(RUNTIME, LPS.getProperty("compiler.runtime.default", "swf6"));
    }
    this.defaultOptions();
    if (options.getBoolean(PRINT_COMPILER_OPTIONS)) {
      System.out.println("init compiler options" +  options.toString());
    }
  }

  public Compiler () {
    this(new HashMap());
  }

  // Map for options
  public static class OptionMap extends HashMap {
    OptionMap () {
      super();
    }

    OptionMap (Map m) {
      super(m);
    }

    OptionMap (List pairs) {
      for (Iterator i = pairs.iterator(); i.hasNext(); ) {
        List pair = (List)i.next();
        put(pair.get(0), pair.get(1));
      }
    }

    // Python
    public OptionMap copy() {
      return (OptionMap)clone();
    }

    public Object get(Object key) {
      if (containsKey(key)) {
        return (super.get(key));
      }
      return null;
    }

    // For Jython
    public Object get(Object key, Object deflt) {
      if (containsKey(key)) {
        return (this.get(key));
      }
      return deflt;
    }

    public boolean getBoolean(Object key) {
      boolean result = false;
      Object value = null;
      if (containsKey(key)) {
        value = get(key);
      }
      if (value != null) {
        if (value instanceof String) {
          result = "true".equalsIgnoreCase((String)value);
        } else if (value instanceof Integer) {
          result = (! Integer.valueOf("0").equals(value));
        } else {
          result = ((Boolean)value).booleanValue();
        }
      }
      return result;
    }

    public void putBoolean(Object key, boolean value) {
      put(key, Boolean.valueOf(value));
    }

    public void putBoolean(Object key, String value) {
      put(key, Boolean.valueOf(value));
    }
  }

  // Error support
  public static String getLocationString(SimpleNode node) {
    StringBuffer location = new StringBuffer();
    if (node != null) {
      if (node.filename != null) {
        location.append(node.filename);
        location.append(":");
        if (node.beginLine != 0) {
          location.append(Integer.toString(node.beginLine));
          location.append(":");
          location.append(Integer.toString(node.beginColumn));
          location.append(":");
        }
        location.append(" ");
      }
    }
    return location.toString();
  }

  public static Instruction NONE = Instructions.NONE;
  public static Instruction NextFrame = Instructions.NextFrame;
  public static Instruction PreviousFrame = Instructions.PreviousFrame;
  public static Instruction PLAY = Instructions.PLAY;
  public static Instruction STOP = Instructions.STOP;
  public static Instruction ToggleQuality = Instructions.ToggleQuality;
  public static Instruction StopSounds = Instructions.StopSounds;
  public static Instruction NumericAdd = Instructions.NumericAdd;
  public static Instruction SUBTRACT = Instructions.SUBTRACT;
  public static Instruction MULTIPLY = Instructions.MULTIPLY;
  public static Instruction DIVIDE = Instructions.DIVIDE;
  public static Instruction OldEquals = Instructions.OldEquals;
  public static Instruction OldLessThan = Instructions.OldLessThan;
  public static Instruction LogicalAnd = Instructions.LogicalAnd;
  public static Instruction LogicalOr = Instructions.LogicalOr;
  public static Instruction NOT = Instructions.NOT;
  public static Instruction StringEqual = Instructions.StringEqual;
  public static Instruction StringLength = Instructions.StringLength;
  public static Instruction SUBSTRING = Instructions.SUBSTRING;
  public static Instruction POP = Instructions.POP;
  public static Instruction INT = Instructions.INT;
  public static Instruction GetVariable = Instructions.GetVariable;
  public static Instruction SetVariable = Instructions.SetVariable;
  public static Instruction SetTargetExpression = Instructions.SetTargetExpression;
  public static Instruction StringConcat = Instructions.StringConcat;
  public static Instruction GetProperty = Instructions.GetProperty;
  public static Instruction SetProperty = Instructions.SetProperty;
  public static Instruction DuplicateMovieClip = Instructions.DuplicateMovieClip;
  public static Instruction RemoveClip = Instructions.RemoveClip;
  public static Instruction TRACE = Instructions.TRACE;
  public static Instruction StartDragMovie = Instructions.StartDragMovie;
  public static Instruction StopDragMovie = Instructions.StopDragMovie;
  public static Instruction StringLessThan = Instructions.StringLessThan;
  public static Instruction RANDOM = Instructions.RANDOM;
  public static Instruction MBLENGTH = Instructions.MBLENGTH;
  public static Instruction ORD = Instructions.ORD;
  public static Instruction CHR = Instructions.CHR;
  public static Instruction GetTimer = Instructions.GetTimer;
  public static Instruction MBSUBSTRING = Instructions.MBSUBSTRING;
  public static Instruction MBORD = Instructions.MBORD;
  public static Instruction MBCHR = Instructions.MBCHR;
  public static Instruction GotoFrame = Instructions.GotoFrame;
  public static Instruction GetUrl = Instructions.GetUrl;
  public static Instruction WaitForFrame = Instructions.WaitForFrame;
  public static Instruction SetTarget = Instructions.SetTarget;
  public static Instruction GotoLabel = Instructions.GotoLabel;
  public static Instruction WaitForFrameExpression = Instructions.WaitForFrameExpression;
  public static Instruction PUSH = Instructions.PUSH;
  public static Instruction BRANCH = Instructions.BRANCH;
  public static Instruction GetURL2 = Instructions.GetURL2;
  public static Instruction BranchIfTrue = Instructions.BranchIfTrue;
  public static Instruction CallFrame = Instructions.CallFrame;
  public static Instruction GotoExpression = Instructions.GotoExpression;
  public static Instruction DELETE = Instructions.DELETE;
  public static Instruction DELETE2 = Instructions.DELETE2;
  public static Instruction VarEquals = Instructions.VarEquals;
  public static Instruction CallFunction = Instructions.CallFunction;
  public static Instruction RETURN = Instructions.RETURN;
  public static Instruction MODULO = Instructions.MODULO;
  public static Instruction NEW = Instructions.NEW;
  public static Instruction VAR = Instructions.VAR;
  public static Instruction InitArray = Instructions.InitArray;
  public static Instruction InitObject = Instructions.InitObject;
  public static Instruction TypeOf = Instructions.TypeOf;
  public static Instruction TargetPath = Instructions.TargetPath;
  public static Instruction ENUMERATE = Instructions.ENUMERATE;
  public static Instruction ADD = Instructions.ADD;
  public static Instruction LessThan = Instructions.LessThan;
  public static Instruction EQUALS = Instructions.EQUALS;
  public static Instruction ObjectToNumber = Instructions.ObjectToNumber;
  public static Instruction ObjectToString = Instructions.ObjectToString;
  public static Instruction DUP = Instructions.DUP;
  public static Instruction SWAP = Instructions.SWAP;
  public static Instruction GetMember = Instructions.GetMember;
  public static Instruction SetMember = Instructions.SetMember;
  public static Instruction Increment = Instructions.Increment;
  public static Instruction Decrement = Instructions.Decrement;
  public static Instruction CallMethod = Instructions.CallMethod;
  public static Instruction NewMethod = Instructions.NewMethod;
  public static Instruction BitwiseAnd = Instructions.BitwiseAnd;
  public static Instruction BitwiseOr = Instructions.BitwiseOr;
  public static Instruction BitwiseXor = Instructions.BitwiseXor;
  public static Instruction ShiftLeft = Instructions.ShiftLeft;
  public static Instruction ShiftRight = Instructions.ShiftRight;
  public static Instruction UShiftRight = Instructions.UShiftRight;
  public static Instruction SetRegister = Instructions.SetRegister;
  public static Instruction CONSTANTS = Instructions.CONSTANTS;
  public static Instruction WITH = Instructions.WITH;
  public static Instruction DefineFunction = Instructions.DefineFunction;
  public static Instruction DefineFunction2 = Instructions.DefineFunction2;
  public static Instruction InstanceOf = Instructions.InstanceOf;
  public static Instruction EnumerateValue = Instructions.EnumerateValue;
  public static Instruction StrictEquals = Instructions.StrictEquals;
  public static Instruction GreaterThan = Instructions.GreaterThan;
  public static Instruction StringGreaterThan = Instructions.StringGreaterThan;
  public static Instruction BranchIfFalse = Instructions.BranchIfFalse;
  public static Instruction LABEL = Instructions.LABEL;
  public static Instruction COMMENT = Instructions.COMMENT;
  public static Instruction CHECKPOINT = Instructions.CHECKPOINT;
  public static Instruction BLOB = Instructions.BLOB;

  // Set internal flags that depend on external flags
  public void defaultOptions() {
    if (options.getBoolean(DEBUG)) {
      options.put(WARN_UNDEFINED_REFERENCES, Boolean.TRUE);
      if (! options.containsKey(WARN_GLOBAL_ASSIGNMENTS)) {
      options.put(WARN_GLOBAL_ASSIGNMENTS,
                  Boolean.valueOf(LPS.getProperty("compiler.warn.globalassignments", "false")));
      }
      if (! options.containsKey(WARN_UNUSED_LOCALS)) {
        options.put(WARN_UNUSED_LOCALS,
                    Boolean.valueOf(LPS.getProperty("compiler.warn.unusedlocals", "false")));
      }
      if (! options.containsKey(WARN_UNUSED_PARAMETERS)) {
        options.put(WARN_UNUSED_PARAMETERS,
                    Boolean.valueOf(LPS.getProperty("compiler.warn.unusedparameters", "false")));
      }
      options.putBoolean(NAME_FUNCTIONS, true);
    }
    // TODO: [2005-04-15 ptw] This pretty much sucks, but the debug
    // lfc only sets nameFunctions, not debug.  This can go away
    // when we can turn on debug for the lfc.
    if (options.getBoolean(DEBUG) ||
        options.getBoolean(NAME_FUNCTIONS)) {
      if (! options.containsKey(DEBUG_BACKTRACE)) {
        options.put(DEBUG_BACKTRACE,
                    Boolean.valueOf(LPS.getProperty("compiler.debug.backtrace", "false")));
      }
    }
    if (! options.containsKey(PROFILE)) {
      options.putBoolean(PROFILE, false);
    }
    if (options.getBoolean(PROFILE)) {
      options.putBoolean(NAME_FUNCTIONS, true);
    }
    options.putBoolean(GENERATE_FUNCTION_2, true);
    options.putBoolean(GENERATE_FUNCTION_2_FOR_LZX, true);
    if (options.getBoolean(KRANK)) {
      options.putBoolean(NAME_FUNCTIONS, true);
      options.putBoolean(DISABLE_CONSTANT_POOL, true);
      options.putBoolean(OBFUSCATE, false);
      options.put(COMPILE_TRACE, "flash");
    }
  }

  public void setProperties(Map properties) {
    // Canonicalize String-valued properties.  This is pretty bogus
    // (dispatching on the value to decide if the property is a
    // boolean-valued property, but it is the way the compiler always
    // worked.
    for (Iterator i = properties.keySet().iterator(); i.hasNext(); ) {
      Object key = i.next();
      Object value = properties.get(key);
      if (value instanceof String) { 
        String v = (String)value;
        if ("true".equalsIgnoreCase(v) || "false".equalsIgnoreCase(v)) {
          options.putBoolean(key, v);
          continue;
        }
      }
      options.put(key, value);
    }
    this.defaultOptions();
    if (options.getBoolean(PRINT_COMPILER_OPTIONS)) {
      System.out.println("set compiler options" +  options.toString());
    }
  }

  public byte[] compile(String source) {
    try {
      Profiler profiler = new Profiler();
      profiler.enter("parse");
      SimpleNode program = new Parser().parse(source);
      profiler.phase("generate");
      // --- Should be just Translator
      CodeGenerator cg = new CodeGenerator();
      cg.setOptions(options);
      cg.translate(program);
      if (options.getBoolean(PROGRESS)) {
        System.out.println("Assembling...");
      }
      profiler.phase("collect");
      List instrs = ((InstructionCollector)cg.getCollector()).getInstructions(true);
      if (options.getBoolean(PRINT_INSTRUCTIONS)) {
        new Optimizer(new InstructionPrinter()).assemble(instrs);
      }
      profiler.phase("assemble");
      Emitter asm = new Optimizer(new Assembler());
      // end marker
      instrs.add(NONE);
      byte[] bytes = asm.assemble(instrs);
      profiler.exit();
      if (options.getBoolean(PROFILE_COMPILER)) {
        profiler.pprint();
        System.out.println();
      }
      if (options.getBoolean(PROGRESS)) {
        System.out.println("done.");
      }
      return bytes;
    }
    catch (CompilerImplementationError e) {
      String ellipses = source.trim().length() > 80 ? "..." : "";
      System.out.println("while compiling " +  source.trim().substring(0, 80) + ellipses);
      throw(e);
    }
    catch (CompilerError e) {
      throw(new CompilerException(e.toString()));
    }
  }

  //
  // Compiler Options
  //

  // TODO [2004-03-11 ptw] share with CompilationEnvironment.java
  public static String ACTIVATION_OBJECT = "createActivationObject";
  public static String COMPUTE_METAREFERENCES = "computeMetaReferences";
  public static String CONDITIONAL_COMPILATION = "conditionalCompilation";
  public static String ALLOW_ROOT = "allowRoot";
  public static String CACHE_COMPILES = "cacheCompiles";
  public static String COMPILE_TRACE = "compileTrace";
  public static String COMPILE_TIME_CONSTANTS = "compileTimeConstants";
  public static String CONSTRAINT_FUNCTION = "constraintFunction";
  public static String DEBUG = "debug";
  public static String DEBUG_BACKTRACE = "debugBacktrace";
  public static String DISABLE_CONSTANT_POOL = "disableConstantPool";
  public static String ELIMINATE_DEAD_EXPRESSIONS = "eliminateDeadExpressions";
  public static String FLASH_COMPILER_COMPATABILITY = "flashCompilerCompatability";
  public static String GENERATE_FUNCTION_2 = "generateFunction2";
  public static String GENERATE_FUNCTION_2_FOR_LZX = "generateFunction2ForLZX";
  public static String INCLUDES = "processIncludes";
  public static String INSTR_STATS = "instrStats";
  public static String KRANK = "krank";
  public static String RUNTIME = "runtime";
  public static String METHOD_NAME = "methodName";
  public static String NAME_FUNCTIONS = "nameFunctions";
  public static String OBFUSCATE = "obfuscate";
  public static String PROFILE = "profile";
  public static String PROFILE_COMPILER = "profileCompiler";
  public static String PROGRESS = "progress";
  public static String PRINT_COMPILER_OPTIONS = "printCompilerOptions";
  public static String PRINT_CONSTRAINTS = "printConstraints";
  public static String PRINT_INSTRUCTIONS = "printInstructions";
  public static String RESOLVER = "resolver";
  public static String SCRIPT_ELEMENT = "scriptElement";
  public static String VALIDATE_CACHES = "validateCaches";
  public static String WARN_UNDEFINED_REFERENCES = "warnUndefinedReferences";
  public static String WARN_GLOBAL_ASSIGNMENTS = "warnGlobalAssignments";
  public static String WARN_UNUSED_LOCALS = "warnUnusedLocals";
  public static String WARN_UNUSED_PARAMETERS = "warnUnusedParameters";
  public static String WITH_THIS = "withThis";

  //
  // Parser
  //

  // A scanner and parser generated by JavaCC and jjtree are used to
  // create a Java AST of the input, with literals annotated by Java
  // objects (instances of String and the numeric types).
  public static class Ops implements org.openlaszlo.sc.parser.ParserConstants {};

  // Wrapper for values that Parser.substitute should splice into
  // place, instead of substituting at the level of the template
  // variable.
  public static class Splice {
    SimpleNode value[];

    public Splice(SimpleNode[] value) {
      this.value = value;
    }

    public String toString() {
      return "Splice(" + this.value.toString() + ")";
    }
  }

  // Wrapper for the Java parser.  Returns a tuple-tree.
  public static class Parser {
    public SimpleNode parse0(String str, String type) {
      org.openlaszlo.sc.parser.Parser p = 
        new org.openlaszlo.sc.parser.Parser(new StringReader(str));
//       try {
//         assert false : "assertions work";
//         java.lang.reflect.Field attr = p.getClass().getField(type);
//         return (SimpleNode)attr.get(p);
      assert "Program".equals(type);
      return p.Program();
//       }
//       catch (SecurityException e) {
//         assert false : e.toString();
//       }
//       catch (NoSuchFieldException e) {
//         assert false : e.toString();
//       }
//       catch (IllegalArgumentException e) {
//         assert false : e.toString();
//       }
//       catch (IllegalAccessException e) {
//         assert false : e.toString();
//       }
//       return null;
    }

    public SimpleNode parse0(String str) {
      return this.parse0(str, "Program");
    }

    public SimpleNode parse(String str) {
      SimpleNode node = this.parse0(str, "Program");
      SimpleNode refactored = refactorAST(node);
      if (refactored != null) {
        return refactored;
      } else {
        return node;
      }
    }

    private ParseTreePrinter ptp = new ParseTreePrinter();
    // The transforms in this branch insure that each binary
    // expression sequence has exactly two children (not
    // counting the operator).
    private void fold(SimpleNode node, int arity) {
      // Transform K(a0,a1,a2) -> K(K(a0,a1),a2), such that no K node
      // has an arity greater than arity.
      int size = node.size();
      if (size > arity) {
        try {
          // TODO: [2005-11-21 ptw] clone would be simpler, if you
          // could make it work
          java.lang.reflect.Constructor constructor = node.getClass().getConstructor(new Class[] { int.class });
          SimpleNode child = (SimpleNode)constructor.newInstance(new Object[] { Integer.valueOf("0") });
          child.setBeginLocation(node.filename, node.beginLine, node.beginColumn);
          int split = size - (arity - 1);
          SimpleNode[] children = new SimpleNode[split];
          for (int i = 0; i < split; i++) {
            children[i] = node.get(i);
          }
          child.setChildren(children);
          if (child.size() > arity) {
            fold(child, arity);
          }
          children = new SimpleNode[arity];
          children[0] = child;
          for (int i = split, j = 1; i < size; i++, j++) {
            children[j] = node.get(i);
          }
          node.setChildren(children);
        }
        catch (InstantiationException e) {
          assert false : e.toString();
        }
        catch (IllegalAccessException e) {
          assert false : e.toString();
        }
        catch (NoSuchMethodException e) {
          assert false : e.toString();
        }
        catch (java.lang.reflect.InvocationTargetException e) {
          assert false : e.toString();
        }
      }
    }

    // Modify the AST tree rooted at n so that its branching
    // structure matches evaluation order.  This is necessary because
    // the parser is right-recursive, and generates flat trees for
    // a+b+c and a.b.c.
    public SimpleNode refactorAST(SimpleNode node) {
      if (node == null || node.size() == 0) {
        return null;
      }
      for (int i = 0; i < node.size(); i++) {
        SimpleNode x = this.refactorAST(node.get(i));
        if (x != null) {node.set(i, x);}
      }
      if (node instanceof ASTBinaryExpressionSequence) {
        // Transform a flat sequence of subexpressions with
        // alternating operators into a right-branching binary
        // tree.  This corrects the fact that the parser, being
        // recursive-descent, is right-factored, but the operators
        // are left-associative.
        //
        // For example:
        // K(a, o1, b, o2, c) -> K(K(a, o1, b), o2, c)
        // K(a, o1, b, o2, c, o3, d) -> K(K(K(a, o1, b), o2, c), o3, d)
        fold(node, 3);
      }
      else if (node instanceof ASTAndExpressionSequence ||
               node instanceof ASTOrExpressionSequence) {
        // Transforms K(a, b, c) -> K(K(a, b), c),
        // where node is in (AndExpressionSequence, OrExpressionSequence)
        fold(node, 2);
      }
      if (node instanceof ASTCallExpression) {
        // cf., CallExpression in Parser.jjt
        // C(a, P(b)) -> P(a, b)
        // C(a, P(b), P(c)) -> P(P(a, b), c)
        // C(a, P(b), A) -> C(P(a, b), A)
        // C(a, P(b), P(c), A) -> C(P(P(a, b), c), A)
        // C(a, A) -> C(a, A)
        // C(a, A, P(b)) -> P(C(a, A), b)
        // where
        //   C = CallExpression
        //   P = PropertyIdentifierReference
        //   A = FunctionCallParameters
        while (node.size() > 1) {
          if (node.get(1) instanceof ASTFunctionCallParameters) {
            if (node.size() > 2) {
              try {
                int size = node.size();
                // TODO: [2005-11-21 ptw] clone would be simpler, if
                // you could make it work
                java.lang.reflect.Constructor constructor = node.getClass().getConstructor(new Class[] { int.class });
                SimpleNode child = (SimpleNode)constructor.newInstance(new Object[] { Integer.valueOf("0") });
                child.setBeginLocation(node.filename, node.beginLine, node.beginColumn);
                SimpleNode children[] = new SimpleNode[2];
                children[0] = node.get(0);
                children[1] = node.get(1);
                child.setChildren(children);
                children = new SimpleNode[size - 2 + 1];
                children[0] = child;
                for (int i = 2, j = 1; i < size; i++, j++) {
                  children[j] = node.get(i);
                }
                node.setChildren(children);
              }
              catch (InstantiationException e) {
                assert false : e.toString();
              }
              catch (IllegalAccessException e) {
                assert false : e.toString();
              }
              catch (NoSuchMethodException e) {
                assert false : e.toString();
              }
              catch (java.lang.reflect.InvocationTargetException e) {
                assert false : e.toString();
              }
              continue;
            }
            else {
              break;
            }
          }
          SimpleNode prop = node.get(1);
          assert ((prop instanceof ASTPropertyIdentifierReference ||
                   prop instanceof ASTPropertyValueReference) &&
                  prop.size() > 0 ): prop;
          int size = node.size();
          SimpleNode children[] = new SimpleNode[2];
          children[0] = node.get(0);
          children[1] = prop.get(0);
          prop.setChildren(children);
          children = new SimpleNode[size - 1];
          for (int i = 1, j = 0; i < size; i++, j++) {
            children[j] = node.get(i);
          }
          node.setChildren(children);
        }
        if (node.size() == 1) {
          return node.get(0);
        }
      }
      // After refactoring, assure each function has a name
      // TODO: [2005-11-16 ptw] This was for krank, and possibly
      // debugging.  Is it still needed?
      if (node instanceof ASTAssignmentExpression) {
        if (node.get(2) instanceof ASTFunctionExpression) {
          // fn children are [(name), arglist, body]
          if (node.get(2).size() == 2) {
            // TODO: [2003-06-19 ptw] (krank) Sanitization of
            // name to identifier moved to krank user, remove
            // //- when it works
            //- from string import replace
            //- name = replace(ptp.visit(node[0]), ".", "_")
            String name = ptp.visit(node.get(0));
            SimpleNode child = node.get(2);
            int size = child.size();
            SimpleNode children[] = new SimpleNode[size + 1];
            children[0] = new ASTIdentifier(name);
            for (int i = 0, j = 1; i < size; i++, j++) {
              children[j] = child.get(i);
            }
            child.setChildren(children);
          }
        }
      }
      return node;
    }

// UNUSED
//     // Build a node out of an AST tuple-tree
//     public void build(*tuple) {
//         node = tuple[0]
//         assert ! node.children
//         for (child in tuple[1)]:
//             if (isinstance(child, TupleType))
//                 child = this.build(*child)
//             node.jjtAddChild(child, len(node.children))
//         return node

    private SimpleNode visit(SimpleNode node, Map keys) {
      List result = new ArrayList();
      int size = node.size();
      for (int i = 0; i < size; i++) {
        SimpleNode child = node.get(i);
        if (child instanceof ASTIdentifier) {
          String name = ((ASTIdentifier)child).getName();
          if (keys.containsKey(name)) {
            Object value = keys.get(name);
            if (value instanceof Splice) {
              result.addAll(Arrays.asList(((Splice)value).value));
            } else {
              result.add(value);
            }
            continue;
          }
        }
        result.add(visit(child, keys));
      }
      SimpleNode[] children = new SimpleNode[result.size()];
      node.setChildren((SimpleNode[])result.toArray(children));
      return node;
    }

    
    // Parse an expression and replace any identifier with the same
    // name as a keyword argument to this function, with the value of
    // that key.  If the value has type Splice, it's spliced into
    // place instead of substituting at the same level.
    //
    // >>> s = Parser().substitute
    // >>> s("[0,1,2]")
    // (ASTArrayLiteral, Literal(0.0), Literal(1), Literal(2))
    // >>> s("[_0,1,2]", _0=Literal("sub"))
    // (ASTArrayLiteral, Literal(sub), Literal(1), Literal(2))
    // >>> s("[_0,1,2]", _0=s("[a,b,c]"))
    // (ASTArrayLiteral, (ASTArrayLiteral, ASTIdentifier(a), ASTIdentifier(b), ASTIdentifier(c)), Literal(1), Literal(2))
    // >>> s("[_0,1,2]", _0=Splice(s("[a,b,c]")))
    // (ASTArrayLiteral, ASTArrayLiteral, ASTIdentifier(a), ASTIdentifier(b), ASTIdentifier(c), Literal(1), Literal(2))
    //
    // N.B., there is no attempt to enforce macro hygiene
    public SimpleNode substitute(String str, Map keys) {
      // Since the parser can't parse an Expression, turn the source
      // into a Program, and extract the Expression from the parse tree.
      SimpleNode node = this.parse("x = " + str).get(0).get(0).get(2);
      return visit(node, keys);
    }
  }

  // Visitor -- only works for ParseTreePrinter so far
  public abstract static class Visitor {
    public java.lang.reflect.Method getVisitor(SimpleNode node) {
      // trim the module name, and the initial "AST"
      String name;
      if (node instanceof ASTIdentifier) {
        name = "Identifier";
      } else {
        name = node.getClass().getName();
        name = name.substring(name.lastIndexOf(".")+4, name.length());
      }
      try {
        return getClass().getMethod(
          "visit" + name, 
          new Class[] { SimpleNode.class, String[].class }
          );
      } catch (NoSuchMethodException e) {
        System.out.println("Missing visitor: " + e.toString());
        try {
          return getClass().getMethod(
            "defaultVisitor",
            new Class[] { Object.class, Object[].class }
            );
        } catch (NoSuchMethodException ee) {
          assert false : ee.toString();
        }
      }
      assert false : "can't happen";
      return null;
    }

    public abstract Object defaultVisitor(Object o, Object[] children);
  }

  // ASTNode -> fname, lineno
  public static class SourceLocation {
    private String file;
    private int line;

    public SourceLocation (String file, int line) {
      this.file = file;
      this.line = line;
    }

    public static SourceLocation get(SimpleNode node) {
      return new SourceLocation( node.filename != null ? node.filename : "unknown file", node.beginLine);
    }
  }


  //
  // Parse Tree Printer
  //

  // This class is only used in testing.
  // TODO: [2002-12-17 ows] This only handles the parse node types that
  // I've needed in debugging.
  // FIXME: [2002-12-21 ows] the parenthesizing mechanism doesn't work for
  // non-binary operators (unary "-", typeof, void, ?:, etc.)
  public static class ParseTreePrinter extends Visitor {
    public void print(SimpleNode node) {
      System.out.println(this.visit(node));
    }

    public static String join(String token, Object[] strings) {
      StringBuffer sb = new StringBuffer();
      for (int x = 0; x < (strings.length - 1); x++) {
        sb.append(strings[x].toString());
        sb.append(token);
      }
      if (strings.length > 0) {
        sb.append(strings[strings.length - 1].toString());
      }
      return(sb.toString());
    }

    public String visit(SimpleNode node) {
      int size = node.size();
      String[] children = new String[size];
      for (int i = 0; i < size; i++) {
        children[i] = visit(node.get(i)) ;
      }

      Class nt = node.getClass();
      if (Joins.containsKey(nt)) {
        return join((String)Joins.get(nt), children);
      }

      java.lang.reflect.Method fn = this.getVisitor(node);
      try {
        return (String)fn.invoke(this, new Object[] {node, children});
      }
      catch (IllegalAccessException e) {
        assert false : e.toString();
      }
      catch (IllegalArgumentException e) {
        assert false : e.toString();
      }
      catch (java.lang.reflect.InvocationTargetException e) {
        assert false : e.toString();
      }
      assert false : "can't happen";
      return null;
    }

    public Object defaultVisitor(Object node, Object[] children) {
      return "//\u00AB" + node.toString() + "(" + join(", ", children) + ")\u00BB";
    }

    public static Map Joins = new HashMap();
    static {
      Joins.put(ASTFormalParameterList.class, ", ");
      Joins.put(ASTFunctionCallParameters.class, ", ");
      Joins.put(ASTProgram.class, "\n");
      Joins.put(ASTAndExpressionSequence.class, " && ");
      Joins.put(ASTOrExpressionSequence.class, " || ");
      Joins.put(ASTStatement.class, "\n");
      Joins.put(ASTVariableStatement.class, "\n");
      Joins.put(ASTStatementList.class, "\n");
    }

    // Copied (and massaged) from Parser.jjt
    public static String[] OperatorNames = {};
    static {
      ArrayList on = new ArrayList();
      // TODO: [2005-11-17 ptw] Not quite right, but javacc doesn't
      // tell us the range of its Ops
      for (int i = 0; i < 256; i++) { on.add("<" + Integer.toString(i) + ">"); }
      on.set(Ops.ASSIGN, "=");
      on.set(Ops.GT, ">");
      on.set(Ops.LT, "<");
      on.set(Ops.BANG, "!");
      on.set(Ops.TILDE, "~");
      on.set(Ops.HOOK, "?");
      on.set(Ops.COLON, ":");
      on.set(Ops.EQ, "==");
      on.set(Ops.LE, "<=");
      on.set(Ops.GE, ">=");
      on.set(Ops.NE, "!=");
      on.set(Ops.SEQ, "===");
      on.set(Ops.SNE, "!==");
      on.set(Ops.SC_OR, "||");
      on.set(Ops.SC_AND, "&&");
      on.set(Ops.INCR, "++");
      on.set(Ops.DECR, "--");
      on.set(Ops.PLUS, "+");
      on.set(Ops.MINUS, "-");
      on.set(Ops.STAR, "*");
      on.set(Ops.SLASH, "/");
      on.set(Ops.BIT_AND, "&");
      on.set(Ops.BIT_OR, "|");
      on.set(Ops.XOR, "^");
      on.set(Ops.REM, "%");
      on.set(Ops.LSHIFT, "<<");
      on.set(Ops.RSIGNEDSHIFT, ">>");
      on.set(Ops.RUNSIGNEDSHIFT, ">>>");
      on.set(Ops.PLUSASSIGN, "+=");
      on.set(Ops.MINUSASSIGN, "-=");
      on.set(Ops.STARASSIGN, "*=");
      on.set(Ops.SLASHASSIGN, "/=");
      on.set(Ops.ANDASSIGN, "&=");
      on.set(Ops.ORASSIGN, "|=");
      on.set(Ops.XORASSIGN, "^=");
      on.set(Ops.REMASSIGN, "%=");
      on.set(Ops.LSHIFTASSIGN, "<<=");
      on.set(Ops.RSIGNEDSHIFTASSIGN, ">>=");
      on.set(Ops.RUNSIGNEDSHIFTASSIGN, ">>>=");

      on.set(Ops.TYPEOF, "typeof");
      on.set(Ops.DELETE, "delete");
      on.set(Ops.VOID, "void");

      OperatorNames = (String[])on.toArray(OperatorNames);
    }

    public String visitAssignmentExpression(SimpleNode node, String[] children) {
      return children[0] + " " + children[1] + " " + children [2];
    }
    public String visitCallExpression(SimpleNode node, String[] children) {
      return children[0] + "(" + children[1] + ")";
    }
    public String visitConditionalExpression(SimpleNode node, String[] children) {
      return children[0] + " ? " + children[1] + " : " + children[2];
    }
    public String visitEmptyExpression(SimpleNode node, String[] children) {
      return "undefined";
    }
    public String visitNewExpression(SimpleNode node, String[] children) {
      return "new " + children[0];
    }
    public String visitPragmaDirective(SimpleNode node, String[] children) {
      return "//pragma " + children[0];
    }
    public String visitPostfixExpression(SimpleNode node, String[] children) {
      return children[0] + children[1];
    }
    public String visitPropertyIdentifierReference(SimpleNode node, String[] children) {
      return children[0] + "." + children[1];
    }
    public String visitPropertyValueReference(SimpleNode node, String[] children) {
      return children[0] + "[" + children[1] + "]";
    }
    public String visitReturnStatement(SimpleNode node, String[] children) {
      return "return " + children[0];
    }
    public String visitThisReference(SimpleNode node, String[] children) {
      return "this";
    }
    public String visitUnaryExpression(SimpleNode node, String[] children) {
      return children[0] + " " + children[1];
    }
    public String visitWithStatement(SimpleNode node, String[] children) {
      return "with (" + children[0] + ") {" + children[1] + "}";
    }

    // TODO: [2005-11-15 ptw] Make this a simple lookup table based on
    // the operator
    public int prec(int op) {
      String n = this.OperatorNames[op];
      String classes[][] = {
        {"()", "[]", "."},
        {"!", "~", "-", "++", "--", "typeof", "new", "void"},
        {"*", "/", "%"},
        {"+", "-"},
        {"<<", ">>", ">>>"},
        {"<", "<=", ">", ">="},
        {"==", "!="},
        {"&"}, {"^"}, {"|"}, {"&&"}, {"||"}, {"?:"},
        {"=", "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "^=", "|="}};
      for (int i = 0; i < classes.length; i++) {
        for (int j = 0; j <  classes[i].length; j++) {
          if (n == classes[i][j]) {
            return -i;
          }
        }
        assert false : "unknown operator";
      }
      return 1;
    }

    public String visitArrayLiteral(SimpleNode node, String[] children) {
      return "[" + join(", ", children) + "]";
    }

    public String visitBinaryExpressionSequence(SimpleNode node, String[] children) {
      int thisPrec = prec(((ASTOperator)node.get(1)).getOperator());
      for (int i = 0; i < children.length; i += (i==0?2:1)) {
        SimpleNode c = node.get(i);
        if (c instanceof ASTBinaryExpressionSequence) {
          if (prec(((ASTOperator)c.get(1)).getOperator()) < thisPrec) {
            children[i] = "(" + children[i] + ")";
          }
        }
      }

      String op = children[1];
      StringBuffer sb = new StringBuffer();
      sb.append(children[0]);
      sb.append(op);
      for (int x = 2; x < (children.length - 1); x++) {
        sb.append(children[x]);
        sb.append(op);
      }
      sb.append(children[children.length - 1]);
      return(sb.toString());
    }

    public String visitFunctionDeclaration(SimpleNode node, String[] children) {
      String name, args, body;
      if (children.length == 2) {
        name = "";
        args = children[0];
        body = children[1];
      } else {
        name = children[0];
        args = children[1];
        body = children[2];
      }
      return "function " + name + "(" + args + ") {" + body + "}";
    }

    public String visitFunctionExpression(SimpleNode node, String[] children) {
      return visitFunctionDeclaration(node, children);
    }

    public String visitIdentifier(SimpleNode node, String[] children) {
      return ((ASTIdentifier)node).getName();
    }

    public String visitLiteral(SimpleNode node, String [] children) {
      return ((ASTLiteral)node).getValue().toString();
    }

    public String visitObjectLiteral(SimpleNode node, String[] children) {
      StringBuffer s = new StringBuffer("{");
      for (int i = 0; i < children.length - 1; i++) {
        s.append(children[i]);
        if (i % 2 != 0) {
          s.append(", ");
        } else {
          s.append(": ");
        }
      }
      s.append(children[children.length - 1]);
      s.append("}");
      return s.toString();
    }

    public String visitOperator(SimpleNode op, String[] children) {
      int operator = ((ASTOperator)op).getOperator();
      return OperatorNames[operator];
    }

    public String visitVariableDeclaration(SimpleNode node, String[] children) {
      if (children.length > 1) {
        return "var " + children[0] + " = " + children[1];
      } else {
        return "var " + children[0];
      }
    }
  }


  //
  // Profiler for hand-instrumentation of Compiler
  //
  public static class Profiler {
    static SimpleDateFormat timeFormatter = new SimpleDateFormat("HH:mm:ss.SS");
    static {
      timeFormatter.setTimeZone(TimeZone.getTimeZone("GMT"));
    }
    static DecimalFormat percentFormatter = new DecimalFormat("###.00");

    public static class Block {
      Date startTime;
      long elapsed;
      String name;
      Block parent;
      List children;

      Block (String name) {
        this.startTime = new Date();
        this.name = name;
        this.children = new ArrayList();
      }

      Block make(String name) {
        Block block = new Block(name);
        block.parent = this;
        this.children.add(block);
        return block;
      }
    }

    List names;
    Block main;
    Block current;

    Profiler () {
      this.names = new ArrayList();
      Block block =  new Block("__main__");
      this.main = block;
      this.current = block;
    }

    public void enter(String name) {
      Block block = this.current.make(name);
      this.current = block;
    }

    public void exit() {
      current.elapsed = (new Date()).getTime() - current.startTime.getTime();
      current = current.parent;
    }

    public void phase(String name) {
      exit();
      enter(name);
    }

    public void pprint() {
      long total = 0;
      for (Iterator i = current.children.iterator(); i.hasNext(); ) {
        Block next = (Block)i.next();
        total += next.elapsed;
      }
      for (Iterator i = current.children.iterator(); i.hasNext(); ) {
        Block next = (Block)i.next();
        long time = next.elapsed;
        Object interval = new Date(next.elapsed);
        System.out.println(
          next.name + "\t" +
          timeFormatter.format(interval) + "\t" +
          percentFormatter.format(time*100/total));
      }
    }
  }

  private static ParseTreePrinter ptp = new ParseTreePrinter();
  public static String nodeString(SimpleNode node) {
    return ptp.visit(node);
  }

}
