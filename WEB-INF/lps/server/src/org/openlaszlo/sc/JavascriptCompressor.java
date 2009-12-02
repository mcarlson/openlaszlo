/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * Javascript 'Compressor'
 *
 * @author steele@osteele.com
 * @author ptw@pobox.com
 * @description: JavaScript -> JavaScript translator
 *
 * Rewrites local variables and compresses Javascript
 */

package org.openlaszlo.sc;
import java.io.*;
import java.util.*;

import org.openlaszlo.sc.parser.*;
import org.openlaszlo.sc.Compiler;

public class JavascriptCompressor extends GenericVisitor implements Translator {
  // TODO: [2009-10-30 ptw]
  //
  // Compressions that other compressors make:
  //
  // . Use minimal strings for locals:  You have to not use a string
  // that could be a Javascript keyword, and you had better not shadow
  // any globals from the underlying runtime.  You can guess that
  // "free" references are probably globals in the underlying runtime.
  //
  // . Support a #pragma to turn off renaming
  //
  // . Remove unused locals
  //
  // . Compact literals:  ParseTreePrinter already minimizes quotes in
  // strings and encodes integers in hex.  You could do partial
  // evaluation of string operations on constant strings...
  //
  // . Convert x['y'] into x.y, but that has semantic significance in
  // some platforms ([] is used to avoid compile-time check for access
  // to dynamic properties).
  //
  // . Convert { 'x': ... } to { x: ... }
  //
  // . Collapse all var declarations to one (but leave init where it appears).
  //
  // . String literals do not need to be delimited from preceding
  // token?  I.e., case 'x': -> case'x': ?
  //
  // Potential gotchas we have not addressed:
  //
  // . A `with` creates a new scope, an `eval` introduces unknowable
  // references.  VariableAnalyzer needs to take that into account
  // when calculating local/free/closed.
  //

  public JavascriptCompressor (Map initialOptions) {
    super();
    this.setOptions(new Compiler.OptionMap(initialOptions));
  }

  // Cf., sc.Compiler.defaultOptions  We set some internal options for
  // compatibility with the script compiler
  public void setOptions(Compiler.OptionMap options) {
    this.options = options;

    if (options.getBoolean(Compiler.DEBUG)) {
      options.putBoolean(Compiler.NAME_FUNCTIONS, true);
    }
    if (!options.containsKey(Compiler.DISABLE_TRACK_LINES) &&
        options.getBoolean(Compiler.NAME_FUNCTIONS)) {
      options.putBoolean(Compiler.TRACK_LINES, true);
    }
  }

  public TranslationContext makeTranslationContext(Object type, TranslationContext parent, String label) {
    return new TranslationContext(type, parent, label);
  }
  public TranslationContext makeTranslationContext(Object type, TranslationContext parent){
    return new TranslationContext(type, parent);
  }

  // Holds registers.  Create a default one for the top-level, just
  // for uniformity
  TranslationContext context = makeTranslationContext(ASTProgram.class, null);

  public TranslationContext getContext() {
    return this.context;
  }

  public void compress(SimpleNode program, OutputStream out) {
    // Here is your opportunity to set any sort of flags you might
    // want to to neuter translations that are not needed.
    ParseTreePrinter.Config config = new ParseTreePrinter.Config();
    boolean compress = (! options.getBoolean(Compiler.NAME_FUNCTIONS));
    config.setCompress(compress);
    config.setObfuscate(compress || options.getBoolean(Compiler.OBFUSCATE));
    config.setTrackLines(options.getBoolean(Compiler.TRACK_LINES));
    // One small step towards a stream compiler...
    (new ParseTreePrinter(config)).print(translate(program), out);
  }

  public SimpleNode translate(SimpleNode program) {
    return visitProgram(program, program.getChildren());
  }

  public void setOriginalSource(String source) {
    // no action by default
  }

  public String preProcess(String source) {
    return source;
  }

  public List makeTranslationUnits(SimpleNode translatedNode, boolean compress, boolean obfuscate)
  {
    ParseTreePrinter.Config config = new ParseTreePrinter.Config();
    config.compress = compress;
    config.obfuscate = obfuscate;
    return (new ParseTreePrinter(config)).makeTranslationUnits(translatedNode, null);
  }

  public byte[] postProcess(List tunits) {
    assert (tunits.size() == 1);
    return ((TranslationUnit)tunits.get(0)).getContents().getBytes();
  }

  // Override generic to maintain options
  public SimpleNode visitPragmaDirective(SimpleNode node, SimpleNode[] children) {
    String key = (String)((ASTLiteral)children[0]).getValue();
    String value = "true";
    int equals = key.indexOf('=');
    if (equals > 0) {
      value = key.substring(equals + 1);
      key = key.substring(0, equals);
    }
    if ("false".equalsIgnoreCase(value) ||
        "true".equalsIgnoreCase(value)) {
      options.putBoolean(key, value);
    } else {
      options.put(key, value);
    }
    return node;
  }

  // Override Generic to analyze and rename locals
  SimpleNode translateFunctionInternal(SimpleNode node, boolean useName, SimpleNode[] children, boolean isMethod) {
    int len = children.length;
    assert len == 2 || len == 3;
    // AST can be any of:
    //   FunctionDefinition(name, args, body)
    //   FunctionDeclaration(name, args, body)
    //   FunctionDeclaration(args, body)
    // Handle the two arities:
    SimpleNode formals;
    SimpleNode body;
    if (len == 3) {
      formals = children[1];
      body = children[2];
    } else {
      formals = children[0];
      body = children[1];
    }
    assert formals instanceof ASTFormalParameterList : "Bad formals " + formals + " in \"" + (new ParseTreePrinter()).text(node) + "\"";
    assert body instanceof ASTStatementList : "Bad body " + body + " in \"" + (new ParseTreePrinter()).text(node) + "\"";
    SimpleNode[] paramIds = formals.getChildren();
    SimpleNode[] statements = body.getChildren();

    // We have to do this because we are processing the StatementList
    // directly here
    //
    // Scope #pragma directives to block
    Compiler.OptionMap savedOptions = options;
    try {
      options = savedOptions.copy();
      context = makeTranslationContext(ASTFunctionExpression.class, context);

      // We have to look for #pragma "scriptElement", so peek into the
      // statement list
      for (int i = 0, ilim = statements.length; i < ilim; i++) {
        SimpleNode stmt = statements[i];
        if (stmt instanceof ASTPragmaDirective) {
          visitStatement(stmt);
        }
      }

      // Analyze local variables (and functions).  Don't mess with
      // `super`, leave `$flasm` alone (is $flasm still used!?!?)
      VariableAnalyzer analyzer = new VariableAnalyzer(formals, true, true, this);
      for (int i = 0, ilim = statements.length; i < ilim; i++) {
        analyzer.visit(statements[i]);
      }
      analyzer.computeReferences();
      // Parameter _must_ be in order
      LinkedHashSet parameters = analyzer.parameters;
      // Linked for determinism for regression testing
      Set variables = analyzer.variables;
      Set closed = analyzer.closed;
      Map used = analyzer.used;

      boolean scriptElement = options.getBoolean(Compiler.SCRIPT_ELEMENT);
      List newBody = new ArrayList();

      // auto-declared locals
      Set auto = new LinkedHashSet();
      auto.add("this");
      auto.add("arguments");
      auto.retainAll(used.keySet());
      // parameters, locals, and auto-registers (locals includes inner
      // functions)
      Set known = new LinkedHashSet(parameters);
      known.addAll(variables);
      known.addAll(auto);

      Map registerMap = new HashMap();
      if (! scriptElement) {
        // All parameters and locals are remapped to 'registers' of the
        // form `$n` to make the code more compact
        int regno = 1;
        boolean debug = options.getBoolean(Compiler.NAME_FUNCTIONS);
        // Have to make a copy to iterate over because we destructively
        // modify `known`
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
      // parent registers
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

      // Replace formals with 'registers'
      for (int i = 0, ilim = paramIds.length; i < ilim; i++) {
        if (paramIds[i] instanceof ASTIdentifier) {
          ASTIdentifier oldParam = (ASTIdentifier)paramIds[i];
          SimpleNode newParam = translateIdentifier(oldParam, AccessMode.DECLARE);
          formals.set(i, newParam);
        } else {
          assert paramIds[i] instanceof ASTFormalInitializer;
        }
      }

      // inner functions do not get scriptElement treatment, shadow any
      // outer declaration
      options.putBoolean(Compiler.SCRIPT_ELEMENT, false);
      // Rewrite the body using the renamed locals
      for (int i = 0, ilim = statements.length; i < ilim; i++) {
        SimpleNode stmt = statements[i];
        if (! (stmt instanceof ASTPragmaDirective)) {
          statements[i] = visitStatement(stmt);
        }
      }
    }
    finally {
      options = savedOptions;
      context = context.parent;
    }

    return node;
  }

  // Override to rename variables
  public ASTIdentifier translateIdentifier(ASTIdentifier id, AccessMode mode) {
    Map registers = (Map)(context.get(TranslationContext.REGISTERS));
    // Replace identifiers with their 'register' (i.e. rename them)
    String name = id.getName();
    if ((registers != null) && registers.containsKey(name)) {
      String register = (String)(registers.get(name));
      id.setName(register);
    }
    return id;
  }

  //
  // Enforce options/pragma block scope
  //

  public SimpleNode visitProgram(SimpleNode node, SimpleNode[] children) {
    // Scope #pragma directives to block
    Compiler.OptionMap savedOptions = options;
    try {
      options = savedOptions.copy();
      return super.visitProgram(node, children);
    }
    finally {
      options = savedOptions;
    }
  }

  // TODO: [2009-10-28 ptw] We wouldn't need this if a class
  // definition body were a ASTStatementList, instead of just a bunch
  // of appended children...
  public SimpleNode visitClassDefinition(SimpleNode node, SimpleNode[] children) {
    // Scope #pragma directives to block
    Compiler.OptionMap savedOptions = options;
    try {
      options = savedOptions.copy();
      return super.visitClassDefinition(node, children);
    }
    finally {
      options = savedOptions;
    }
  }

  public SimpleNode visitStatementList(SimpleNode node, SimpleNode[] children) {
    // Scope #pragma directives to block
    Compiler.OptionMap savedOptions = options;
    try {
      options = savedOptions.copy();
      return super.visitStatementList(node, children);
    }
    finally {
      options = savedOptions;
    }
  }

}

/**
 * @copyright Copyright 2006-2007, 2009 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */

