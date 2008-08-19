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

public class SourceFileMap {
  HashMap names = new HashMap();
  HashMap ids = new HashMap();

  public SourceFile byName(String name) {
    SourceFile s = (SourceFile)names.get(name);
    if (s == null) {
      s = new SourceFile();
      s.name = name;
      s.id = names.size();
      names.put(name, s);
      ids.put(new Integer(s.id), s);
    }
    return s;
  }

  public SourceFile byId(int id) {
    SourceFile s = (SourceFile)ids.get(new Integer(id));
    return s;
  }
}
