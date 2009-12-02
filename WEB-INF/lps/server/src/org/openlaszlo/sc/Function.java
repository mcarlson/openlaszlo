/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * LZX Function representation
 * @author steele@osteele.com
 */

package org.openlaszlo.sc;

public class Function {
  public String name;
  final String args;
  final String returnType;
  final String preface;
  final String body;
  final String sourceLocation;

  // NOTE: [2009-09-02 ptw] These constants must be kept in sync with
  // constants in LzBootstrapDebugService
  
  // Javascript implementors haven't settled on the property to use
  // for giving a "pretty" name to a Function, for debugging and
  // profiling.  This seems to be the most popular right now, so we go
  // along with the crowd.
  public static String FUNCTION_NAME = "displayName";
  // These are our own invention, maybe some day they will be more
  // universal
  public static String FUNCTION_FILENAME = "_dbg_filename";
  public static String FUNCTION_LINENO = "_dbg_lineno";

  public Function(String body) {
    this("", body);
  }

  public Function(String args, String body) {
    this("", args, body);
  }

  public Function(String name, String args, String body) {
    this(name, args, "", "", body, null);
  }

  // When there is a source location, we ask that the body be broken
  // up into a preface (any pragmas, etc. that the compiler must add)
  // and the body - the original function body in the program.
  public Function(String name, String args, String returnType, String preface, String body, String loc) {
    this.name = name;
    this.args = args;
    this.returnType = returnType;
    this.preface = preface;
    this.body = body;
    this.sourceLocation = loc;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String toString() {

    String retstr;
    String loc = (sourceLocation != null?sourceLocation:"");
    if (returnType == null || returnType.trim().equals("")) {
      retstr = "";
    }
    else {
      retstr = ": " + returnType;
    }
    // we need the source location to be set multiple times so that
    // all nodes in the AST can produce accurate compilation errors
    // and debugging code.
    return loc + "function " + name + "(" + args + ") " + retstr + " {\n" +
      // mark the end of the user sourceLocation
      (sourceLocation != null?org.openlaszlo.compiler.CompilerUtils.endSourceLocationDirective:"") +
      preface +
      // we do not inject a newline after sourceLocation, it was
      // carefully positioned to be at the right column
      loc + body +
      // mark the end of the user sourceLocation
      (sourceLocation != null?org.openlaszlo.compiler.CompilerUtils.endSourceLocationDirective:"") +
      "\n}";
  }

  public Function asFunction() {
    return this;
  }

}

/**
 * @copyright Copyright 2001-2009 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
