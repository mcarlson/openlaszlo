/******************************************************************************
 * LzGsonMarshaller.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.json;

import org.apache.log4j.Logger;
import org.openlaszlo.data.JavaDataSource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class LZGsonMarshaller extends LZBaseJsonMarshallAdapter implements ILZJsonMarshaller {
    
    private static Logger mLogger  = Logger.getLogger(JavaDataSource.class);
    
    private static GsonBuilder gsonBuilder = null;
    
    /*
     * 
     * If you would like to overwrite Gson's handling of values
     * you should set this to true to make sure the specific way
     * OpenLaszlo does marshal Json is not applied to the GsonBuilder
     * 
     * -swagner 02.09.2009
     * 
     */
    public static boolean applyLzDefaultGsonProperties = true;

    public static synchronized GsonBuilder getGsonBuilderInstance() {
        
        if (gsonBuilder == null) {
            gsonBuilder = new GsonBuilder();
        }
        
        return gsonBuilder;
    }
    
    /*
     * (non-Javadoc)
     * @see org.openlaszlo.remote.json.ILZReturnFactory#createObject(java.lang.Object, java.lang.String)
     */
    public byte[] createObject(Object object, String objectReturnType) {
        try {
        
            GsonBuilder _gsonBuilder = getGsonBuilderInstance();
            
            if (applyLzDefaultGsonProperties) {
                _gsonBuilder.setDateFormat("dd/MM/yyyy HH:mm:ss");
                _gsonBuilder.serializeNulls();
                _gsonBuilder.setPrettyPrinting();
            }
            
            Gson gson = _gsonBuilder.create();
            
    //        String buf2 = new LZReturnObject(objectReturnType)
    //            .createObjectProgram(object);
    //        
    //        mLogger.error("LZReturnObject1:"+buf);
    //        mLogger.error("LZReturnObject2:"+buf2);
            
            String jsonOutput = gson.toJson(object);
            
            return jsonOutput.getBytes("UTF-8");
        
        } catch (Exception err) {
            mLogger.error("[createObject]",err);
        }
        return null;
    }

}
