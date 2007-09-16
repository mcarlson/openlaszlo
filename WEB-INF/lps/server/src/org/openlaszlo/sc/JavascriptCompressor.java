/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * Javascript 'Compressor'
 *
 * Based on Legal's JavascriptGenerator
 *
 * @author steele@osteele.com
 * @author ptw@openlaszlo.org
 * @description: JavaScript -> JavaScript translator
 *
 * Transform the parse tree, expanding #pragma, replacing local
 * variables.  Includes analyzing constraint functions and generating
 * their dependencies.  Leaves other transforms alone.
 */

package org.openlaszlo.sc;
import java.io.*;
import java.util.*;

import org.openlaszlo.sc.parser.*;

public class JavascriptCompressor extends JavascriptGenerator {

  public SimpleNode compress(SimpleNode program) {
    // Here is your opportunity to set any sort of flags you might
    // want to to neuter translations that are not needed.
    options.putBoolean(Compiler.ALLOW_ROOT, true);
    return super.translate(program);
  }

  // Don't evaluate for compression
  Boolean evaluateCompileTimeConditional(SimpleNode node) {
    Object value = null;
    return (Boolean)value;
  }

  // Don't transform super calls for compression
  public SimpleNode visitSuperCallExpression(SimpleNode node, boolean isReferenced, SimpleNode[] children) {
    assert children.length == 3;
    for (int i = 0, len = children.length; i < len; i++) {
      SimpleNode child = children[i];
      children[i] = visitExpression(child, isReferenced);
    }
    return node;
  }

}

/**
 * @copyright Copyright 2006-2007 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */

