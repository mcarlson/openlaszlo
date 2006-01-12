/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2005 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;

import org.openlaszlo.sc.parser.SimpleNode;

public class UnimplementedError extends CompilerError {
  public UnimplementedError (String message) {
    super(message);
  }

  public UnimplementedError (String message, SimpleNode node) {
    super(message, node);
  }
}
