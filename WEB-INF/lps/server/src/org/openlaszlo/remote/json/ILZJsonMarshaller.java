/******************************************************************************
 * ILZJsonMarshaller.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.json;

public interface ILZJsonMarshaller {

    public byte[] createObject(Object object, String objectReturnType);
    
}