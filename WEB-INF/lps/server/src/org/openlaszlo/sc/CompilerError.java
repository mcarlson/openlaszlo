/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2006 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;

import org.openlaszlo.sc.parser.SimpleNode;

public class CompilerError extends RuntimeException {
  public SimpleNode node;

  public CompilerError (String message) {
    super(message);
    this.node = null;
  }

  public CompilerError (String message, SimpleNode node) {
    super(message);
    this.node = node;
  }

  public void attachNode(SimpleNode node) {
    assert this.node == null;
    this.node = node;
  }

  public String toString() {
    return Compiler.getLocationString(node) + super.toString();
  }
}
