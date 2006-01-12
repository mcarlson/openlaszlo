/* *****************************************************************************
 * SWFMap.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.utils;
import java.util.*;

/**
 * A Map to retrieve and store an object based on some key. For example, could
 * be used to store different versions of the same SWF bytecode. Not
 * thread-safe.
 */
public class VersionMap {

    Map mMap = new HashMap();

    /**
     * Put a value based on version and key.
     */
    public void put(Object version, Object key, Object value) {
        Map m = (Map)mMap.get(key);
        if (m == null) {
            m = new HashMap();
            mMap.put(key, m);
        }
        m.put(version, value);
    }

    /**
     * Get value based on version and key.
     */
    public Object get(Object version, Object key) {
        Map m = (Map)mMap.get(key);
        if (m == null) return null;
        return m.get(version);
    }

    /**
     * @return set of keys.
     */
    public Set keySet() {
        return mMap.keySet();
    }

    /**
     * @return map of versions.
     */
    public Map getVersions(Object key) {
        return (Map)mMap.get(key);
    }

    /**
     * @return number of items in this map.
     */
    public int size() {
        return mMap.size();
    }
}
