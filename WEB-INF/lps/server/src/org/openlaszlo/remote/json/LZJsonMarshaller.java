/******************************************************************************
 * LZJsonMarshaller.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

/*
 * 
 * This is the default JsonMarshaller
 * 
 */
package org.openlaszlo.remote.json;

import org.apache.log4j.Logger;

public class LZJsonMarshaller extends LZBaseJsonMarshallAdapter implements ILZJsonMarshaller {
    
    private static Logger mLogger  = Logger.getLogger(LZJsonMarshaller.class);
    
    /*
     * (non-Javadoc)
     * @see org.openlaszlo.remote.json.ILZReturnFactory#createObject(java.lang.Object, java.lang.String)
     */
    public synchronized byte[] createObject(Object object, String objectReturnType) {
        try {
            String buf2 = new LZReturnObject(objectReturnType).
                                      createObjectProgram(object);
            
            return buf2.getBytes("UTF-8");
        } catch (Exception err) {
            mLogger.error("[createObject]",err);
        }
        return null;
    }
    

}
