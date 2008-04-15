/* -*- mode: Java; c-basic-offset: 2; -*- */

/**
 * LZX Function representation
 * @author steele@osteele.com
 */

package org.openlaszlo.sc;

public class Method extends Function {

  public Method(String body) {
    this("", body);
  }

  public Method(String args, String body) {
    this("", args, body);
  }

  public Method(String name, String args, String body) {
    this(name, args, "", body, null);
  }

  // When there is a source location, we ask that the body be broken
  // up into a preface (any pragmas, etc. that the compiler must add)
  // and the body - the original function body in the program.
  public Method(String name, String args, String preface, String body, String loc) {
    this(name, args, preface, body, loc, null);
  }

  public Method(String name, String args, String preface, String body, String loc, String adjectives) {
    super(name, args, preface, body, loc, adjectives);
  }

}

/**
 * @copyright Copyright 2001-2008 Laszlo Systems, Inc.  All Rights
 * Reserved.  Use is subject to license terms.
 */
