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

public abstract class MemberReference extends Reference {
  protected SimpleNode object;

  public MemberReference(CodeGenerator codegenerator, SimpleNode node, int referenceCount, 
                        SimpleNode object) {
    super(codegenerator, node, referenceCount);
    this.object = object;
  }

  // Emits code to check that the object exists before making a
  // property reference.  Expects the object to be at the top of stack
  // when called.
  protected void checkUndefinedObjectProperty(String propertyName) {
    if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
      String label = translator.newLabel(node);
      collector.emit(Instructions.DUP);
      collector.emit(Instructions.TypeOf);
      collector.push("undefined");
      collector.emit(Instructions.EQUALS);
      collector.emit(Instructions.NOT);
      collector.emit(Instructions.BranchIfTrue.__call__(label));
      report("$reportUndefinedObjectProperty", propertyName);
      collector.emit(Instructions.LABEL.__call__(label));
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
      collector.emit(Instructions.BranchIfTrue.__call__(label));
      report("$reportUndefinedProperty", propertyName);
      collector.emit(Instructions.LABEL.__call__(label));
    }
  }

  // Emits code to check that an object property is defined.
  // Expects the object member to be at the top of stack when
  // called.
  protected void checkUndefinedProperty(String propertyName) {
    if (options.getBoolean(Compiler.WARN_UNDEFINED_REFERENCES) && node.filename != null) {
      String label = translator.newLabel(node);
      collector.emit(Instructions.DUP);
      collector.emit(Instructions.TypeOf);
      collector.push("undefined");
      collector.emit(Instructions.EQUALS);
      collector.emit(Instructions.NOT);
      collector.emit(Instructions.BranchIfTrue.__call__(label));
      report("$reportUndefinedProperty", propertyName);
      collector.emit(Instructions.LABEL.__call__(label));
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
