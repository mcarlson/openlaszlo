/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * <mixin> compiler
 *
 * @author ptw@openlaszlo.org
 *
 * Adds mixin to schema
 */

package org.openlaszlo.compiler;

import org.jdom.Element;

/**
 * Compiler for <code>mixin</code> elements.
 */
class MixinCompiler extends ClassCompiler {
    
  MixinCompiler(CompilationEnvironment env) {
    super(env);
  }
    
  /**
   * Returns true iff this class applies to this element.
   * @param element an element
   * @return see doc
   */
  static boolean isElement(Element element) {
    return element.getName().equals("mixin");
  }

  // TODO [2008-10-28 ptw] Mixins are not allowed 'extends' or
  // 'with' attributes
}

/**
 * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
