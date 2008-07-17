/* ****************************************************************************
 * ASTOperator.java
* ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2008 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc.parser;

public class ASTOperator extends SimpleNode {
    
    private int operatorCode = -1;//todo: EOF;
  
  public SimpleNode deepCopy() {
      ASTOperator result = (ASTOperator)super.deepCopy();
      result.operatorCode = this.operatorCode;
      return result;
  }

  public ASTOperator(int id) {
    super(id);
  }

  public ASTOperator(Parser p, int id) {
    super(p, id);
  }

  public static Node jjtCreate(int id) {
      return new ASTOperator(id);
  }

  public static Node jjtCreate(Parser p, int id) {
      return new ASTOperator(p, id);
  }

  // Added
  public void setOperator(int operatorCode) {
      this.operatorCode = operatorCode;
  }

  public int getOperator() {
      return operatorCode;
  }
  
    //todo  public String toString() {
    //      return "<" + tokenImage[operatorCode] + ">";
    //  }

  /** Accept the visitor */
  public Object jjtAccept(ParserVisitor visitor, Object data) {
      return visitor.visit(this, data);
  }

}
