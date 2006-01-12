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
import org.openlaszlo.sc.parser.ASTIdentifier;
import org.openlaszlo.sc.parser.ASTProgram;

public class PropertyReference extends MemberReference {
  String propertyName;

  public PropertyReference(CodeGenerator codegenerator, SimpleNode node, int referenceCount, 
                             SimpleNode object, ASTIdentifier propertyName) {
    super(codegenerator, node, referenceCount, object);
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
    collector.emit(Instructions.GetMember);
    if (checkUndefined) {
      checkUndefinedProperty(propertyName);
    }
    return this;
  }

}

