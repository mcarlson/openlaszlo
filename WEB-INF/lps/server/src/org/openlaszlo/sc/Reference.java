/* -*- mode: Java; c-basic-offset: 2; -*- */

/***
 * A Reference represents a variable, property, or array reference ---
 * a LeftHandSide in the grammar.  References can be retrieved or
 * assigned.
 */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;
import org.openlaszlo.sc.parser.SimpleNode;
import org.openlaszlo.sc.Translator;

public abstract class Reference {
  public Translator translator;
  public SimpleNode node;
  public int referenceCount;
  protected Compiler.OptionMap options;
  protected InstructionCollector collector;

  public Reference (Translator translator, SimpleNode node, int referenceCount) {
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

