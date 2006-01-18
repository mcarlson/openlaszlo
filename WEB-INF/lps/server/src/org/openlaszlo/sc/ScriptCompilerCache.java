/* -*- mode: Java; c-basic-offset: 2; -*- */

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2005 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.sc;
import java.util.*;

// Each entry has three parts:
// - a key, used to store and retrieve it
// - a checksum, which tells whether the value is current
// - a value
public class ScriptCompilerCache extends HashMap {

  public ScriptCompilerCache() {
    super();
  }

  static class ScriptCompilerCacheEntry {
    Object checksum;
    Object value;

    ScriptCompilerCacheEntry(Object checksum, Object value) {
      this.checksum = checksum;
      this.value = value;
    }
  }

  public boolean containsKey(Object key, Object checksum) {
    if (containsKey(key)) {
      ScriptCompilerCacheEntry entry = (ScriptCompilerCacheEntry)get(key);
      if (entry.checksum.equals(checksum)) {
        return true;
      }
    }
    return false;
  }

  public Object get(Object key, Object checksum) {
    ScriptCompilerCacheEntry entry = (ScriptCompilerCacheEntry)get(key);
    if (entry != null && entry.checksum.equals(checksum)) {
      return entry.value;
    }
    return null;
  }

  public void put(Object key, Object checksum, Object value) {
    put(key, new ScriptCompilerCacheEntry(checksum, value));
  }
}
