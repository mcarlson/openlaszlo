/* ****************************************************************************
 * ObjectCounter.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2004 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.utils;

/**
 * Thread safe counter object.
 */
public class ThreadSafeCounter {
    int mCount = 0;
    synchronized public void increment() { 
        ++mCount; 
    }
    synchronized public void decrement() {
        --mCount; 
    }
    synchronized public void decrement(int n) {
        mCount-=n; 
    }
    synchronized public int  getCount()  { 
        return mCount; 
    }
}
