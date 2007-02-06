/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2007 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;

import org.openlaszlo.sc.parser.SimpleNode;

public class CompilerImplementationError extends RuntimeException {
  SimpleNode node;

  public CompilerImplementationError (String message) {
    super(message);
    this.node = null;
  }

  public CompilerImplementationError (String message, SimpleNode node) {
    super(message);
    this.node = node;
  }

  public String toString() {
    return Compiler.getLocationString(node) + ": " + super.toString();
  }
}
