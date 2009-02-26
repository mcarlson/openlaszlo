/* ****************************************************************************
 * JavaDataSource.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data.helpers.mappings;

import java.util.LinkedHashMap;
import java.lang.reflect.Method;
import java.lang.reflect.Field;

import org.apache.log4j.Logger;
import org.apache.commons.lang.StringUtils;

public class StructureMethodList {
    
    private static Logger mLogger  = Logger.getLogger(StructureMethodList.class);
    
    private StructureMethodList() {}

    private static StructureMethodList instance = null;

    public static synchronized StructureMethodList getInstance() {
        if (instance == null) {
            instance = new StructureMethodList();
        }
        return instance;
    }    
    
    /*
     * 
     */

    public LinkedHashMap parseClassToMethodList(Class targetClass){
        try {
            LinkedHashMap returnMap = new LinkedHashMap();
            
            for (int i=0;i<targetClass.getDeclaredFields().length;i++) {
                Field field = targetClass.getDeclaredFields()[i];
                String fieldName = field.getName();
                Class fieldTypeClass = field.getType();
                Class[] parameterTypes = new Class[1];
                parameterTypes[0] = fieldTypeClass;
                //log.error("fieldTypeClass Name " + fieldTypeClass.getName() );
                String capitalizedFieldName = StringUtils.capitalize(fieldName);
                String setterPre = "set";
                
                Method method = targetClass.getMethod(setterPre + capitalizedFieldName, parameterTypes);
                
                String methodName = method.getName();
                
                Class[] paramTypes = method.getParameterTypes();
                //log.error("parseClassToMethodList methodName: "+methodName);
                if (methodName.startsWith("set")) {
                    //Found setter get Attribute name
                    if (returnMap.get(fieldName)!=null) {
                        LinkedHashMap methodListMap = (LinkedHashMap) returnMap.get(fieldName);
                        methodListMap.put("setter", methodName);
                        methodListMap.put("setterParamTypes", paramTypes);
                    } else {
                        LinkedHashMap methodListMap = (LinkedHashMap) new LinkedHashMap();
                        methodListMap.put("setter", methodName);
                        returnMap.put(fieldName, methodListMap);
                        methodListMap.put("setterParamTypes", paramTypes);
                    }
                } else if (methodName.startsWith("is")) {
                    //Found setter(boolean) get Attribute name
                    if (returnMap.get(fieldName)!=null) {
                        LinkedHashMap methodListMap = (LinkedHashMap) returnMap.get(fieldName);
                        methodListMap.put("getter", methodName);
                    } else {
                        LinkedHashMap methodListMap = new LinkedHashMap();
                        methodListMap.put("getter", methodName);
                        returnMap.put(fieldName, methodListMap);
                    }
                } else if (methodName.startsWith("get")) {
                    //Found setter(boolean) get Attribute name
                    if (returnMap.get(fieldName)!=null) {
                        LinkedHashMap methodListMap = (LinkedHashMap) returnMap.get(fieldName);
                        methodListMap.put("getter", methodName);
                    } else {
                        LinkedHashMap methodListMap = new LinkedHashMap();
                        methodListMap.put("getter", methodName);
                        returnMap.put(fieldName, methodListMap);
                    }
                }
                
            }            
            
            return returnMap;
        } catch (Exception ex) {
            mLogger.error("[parseClassToMethodList]",ex);
            return new LinkedHashMap();
        }
        
    }
    
}
