/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * <interface> compiler
 *
 * @author ptw@openlaszlo.org
 *
 * Adds interface to schema
 */

package org.openlaszlo.compiler;

import org.jdom.Element;

/**
 * Compiler for <code>interface</code> elements.
 */
class InterfaceCompiler extends ClassCompiler {
    
  InterfaceCompiler(CompilationEnvironment env) {
    super(env);
  }
    
  /**
   * Returns true iff this class applies to this element.
   * @param element an element
   * @return see doc
   */
  static boolean isElement(Element element) {
    return element.getName().equals("interface");
  }
}

/**
 * @copyright Copyright 2007, 2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
