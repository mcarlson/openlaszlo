/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * LZX Function representation
 * @author steele@osteele.com
 */

package org.openlaszlo.sc;

public class Function {
  public String name;
  private final String args;
  private final String preface;
  private final String body;
  private final String sourceLocation;
  private final String adjectives;

  public Function(String body) {
    this("", body);
  }

  public Function(String args, String body) {
    this("", args, body);
  }

  public Function(String name, String args, String body) {
    this(name, args, "", body, null);
  }

  // When there is a source location, we ask that the body be broken
  // up into a preface (any pragmas, etc. that the compiler must add)
  // and the body - the original function body in the program.
  public Function(String name, String args, String preface, String body, String loc) {
    this(name, args, preface, body, loc, null);
  }

  public Function(String name, String args, String preface, String body, String loc, String adjectives) {
    this.name = name;
    this.args = args;
    this.preface = preface;
    this.body = body;
    this.sourceLocation = loc;
    this.adjectives = adjectives;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String toString() {

    return (adjectives != null?(adjectives + " "):"") +
      "function " + name + "(" + args + ") {\n" +
      preface +
      // we do not inject a newline after sourceLocation, it was
      // carefully positioned to be at the right column
      (sourceLocation != null?sourceLocation:"") +
      body +
      // mark the end of the user sourceLocation
      (sourceLocation != null?org.openlaszlo.compiler.CompilerUtils.endSourceLocationDirective:"") +
      "\n}";
  }
}

/**
 * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
