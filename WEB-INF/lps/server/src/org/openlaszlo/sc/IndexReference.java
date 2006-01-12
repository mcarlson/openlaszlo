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

public class IndexReference extends MemberReference {
  SimpleNode indexExpr;

  public IndexReference(CodeGenerator codegenerator, SimpleNode node, int referenceCount, 
                        SimpleNode object, SimpleNode indexExpr) {
    super(codegenerator, node, referenceCount, object);
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
    collector.emit(Instructions.GetMember);
    // TODO: [2003-05-14 ptw] checkUndefined
    if (false) {                // (checkUndefined) {
      checkUndefinedProperty("[]");
    }
    return this;
  }

}
