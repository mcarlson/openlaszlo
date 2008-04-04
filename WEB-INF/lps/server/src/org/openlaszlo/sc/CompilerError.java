/* -*- mode: Java; c-basic-offset: 2; -*- */

package org.openlaszlo.sc;

import org.openlaszlo.sc.parser.SimpleNode;
import org.openlaszlo.compiler.CompilationError;

public class CompilerError extends CompilationError {
  public SimpleNode node;

  public CompilerError (String message) {
    super(message);
    this.node = null;
  }

  public CompilerError (String message, SimpleNode node) {
    super(message);
    attachNode(node);
  }

  public void attachNode(SimpleNode node) {
    assert this.node == null;
    this.node = node;
    if (node != null) {
      initPathname(node.filename);
      initLineNumber(node.beginLine);
      initColumnNumber(node.beginColumn);
    }
  }

  public String toString() {
    String loc = (node == null) ? "" :
      (Compiler.getLocationString(node) + ": ");
    return loc + super.toString();
  }
}

/**
 * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
