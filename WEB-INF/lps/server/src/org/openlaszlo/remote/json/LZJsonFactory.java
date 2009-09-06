/******************************************************************************
 * LzJsonFactory.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.json;

public class LZJsonFactory {
    
    private static LZBaseJsonMarshallAdapter jsonFactory = null;
    
    public static synchronized LZBaseJsonMarshallAdapter getJsonBuilderInstance() {
        
        //By default we use the Gson Marshaller
        if (jsonFactory == null) {
            jsonFactory = new LZGsonMarshaller();
        }
        
        return jsonFactory;
    }
    
    /**
     * Overwrite the default JsonBuilderInstance
     * 
     * this can be used to set it back to the default Json Marshalling (org.openlaszlo.remote.json.LZJsonMarshaller)
     * or you write your own one by using the Adapter and Interfaces
     * 
     * 
     * @param lzBaseJsonMarshallAdapter
     */
    public static synchronized void setJsonBuilderInstance(LZBaseJsonMarshallAdapter lzBaseJsonMarshallAdapter) {
        
        jsonFactory = lzBaseJsonMarshallAdapter;
        
    }

}
