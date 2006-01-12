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

// NOTE: [2002-10-24 ptw] Not completely right, this handles the case
// where a literal is the target of a method operation.  It is like a
// reference but it is not an lvalue.
public class LiteralReference extends Reference {
  CodeGenerator translator;
  SimpleNode node;

  public LiteralReference(CodeGenerator codegenerator, SimpleNode node, int referenceCount) {
    super(codegenerator, node, referenceCount);
    this.translator = codegenerator;
    this.node = node;
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

