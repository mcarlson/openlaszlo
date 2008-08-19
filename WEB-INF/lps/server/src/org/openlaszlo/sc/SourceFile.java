/* -*- mode: Java; c-basic-offset: 2; -*- */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2008 Laszlo Systems, Inc.  All Rights Reserved.                   *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

/***
 * SourceFile
 * Author: Don Anderson
 */

package org.openlaszlo.sc;

import java.io.*;
import java.util.*;

public class SourceFile {
  String name;
  int id;                       // small unique (within this compilation) number
  public String toString() {
    return "SourceFile[" + name + " id=" + id + "]";
  }
}
