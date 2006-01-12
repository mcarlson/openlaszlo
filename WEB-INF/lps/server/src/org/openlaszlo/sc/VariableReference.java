/* -*- mode: Java; c-basic-offset: 2; -*- */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;
import java.util.*;
// TODO: [2005-12-18 ptw] Use `import static` when you have Java 1.5
import org.openlaszlo.sc.Instructions;
import org.openlaszlo.sc.parser.SimpleNode;
import org.openlaszlo.sc.parser.ASTProgram;

public class VariableReference extends Reference {
  TranslationContext context;
  public final String name;
  public final Instructions.Register register;
  boolean known;

  public VariableReference(CodeGenerator codegenerator, SimpleNode node, int referenceCount, String name) {
    super(codegenerator, node, referenceCount);
    this.name = name;
    this.context = (TranslationContext)translator.getContext();
    Map registers = (Map)context.get(TranslationContext.REGISTERS);
    // TODO: [2005-12-22 ptw] Conditionalize case check for swf7 and above
    if (registers != null) {
      Map lowerRegisters = (Map)context.get(TranslationContext.LOWERREGISTERS);
      this.register = (Instructions.Register)lowerRegisters.get(name.toLowerCase());
      if (register != null && (! registers.containsKey(name))) {
        System.out.println("Warning: Different case used for " + name +
                           " in " + node.filename +
                           " (" + node.beginLine + ")");
      }
    } else {
      this.register = null;
    }
    Set variables = (Set)context.get(TranslationContext.VARIABLES);
    // TODO: [2005-12-22 ptw] Conditionalize case check for swf7 and above
    if (variables != null) {
      Set lowerVariables = (Set)context.get(TranslationContext.LOWERVARIABLES);
      this.known = lowerVariables.contains(name.toLowerCase());
      if (known && (! variables.contains(name))) {
        System.out.println("Warning: Different case used for " + name +
                           " in " + node.filename +
                           " (" + node.beginLine + ")");
      }
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
      collector.emit(Instructions.TypeOf);
      collector.push("undefined");
      collector.emit(Instructions.EQUALS);
      collector.emit(Instructions.NOT);
      collector.emit(Instructions.BranchIfTrue.__call__(label));
      report("$reportUndefinedVariable", variableName);
      collector.emit(Instructions.LABEL.__call__(label));
    }
  }

  public Reference get(boolean checkUndefined) {
    _pop();
    if (register != null) {
      collector.emit(Instructions.PUSH.__call__(Values.Register(register.regno)));
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
      System.out.println("Warning: Assignment to free variable " + name +
                         " in " + node.filename + 
                         " (" + node.beginLine + ")");
    }
    if (register != null) {
      collector.emit(Instructions.SetRegister.__call__(new Integer(register.regno)));
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
