/* ****************************************************************************
 * JavaDataSource.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data.helpers;

/**
 * @author sebastianwagner
 *
 */
public interface ILaszloRPCAdapter {

    public abstract void onCall(String methodName, Class[] argClasses,
            Object[] argValues);

    public abstract void onMappingNotFound(String neededType, Object value);

}