/* ****************************************************************************
 * JavaDataSource.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.data.helpers.mappings;

import java.util.Hashtable;
import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Iterator;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

import org.apache.log4j.Logger;

/**
 * Class to cast any LinkedHashMap to its JavaBean repraesentant
 * the idiom is that the attribute name in the LinkedHashMap is the same as in the JavaBean/Pojo
 * 
 * if the attribute's of the Bean are private (meaning it IS a Bean) then it will use the getters and setters
 * if the attribute's are public it will assign directly
 * if the attribute is final it will show an error in log
 * 
 * if the HashMap contains an null for a primitive attribute it will not assign that value
 * 
 * if the HashMap contains subelements nested as LinkedHashMap's it will add these Sub-Elements to the Main-Object
 * for an exmaple see:
 * http://openmeetings.googlecode.com/svn/branches/dev/xmlcrm/java/src/test/org/xmlcrm/utils/TestReflectionApi.java
 * 
 * TODO:
 * If the Sub Item is not an Object but a Set (meaning a List of Object) this List must be 
 * cast to Objects of the Bean too
 * 
 * @author swagner
 * 
 *
 */

public class CastTableToObject {
    
    private static Logger mLogger  = Logger.getLogger(CastTableToObject.class);
    
    private CastTableToObject() {}

    private static CastTableToObject instance = null;

    public static synchronized CastTableToObject getInstance() {
        if (instance == null) {
            instance = new CastTableToObject();
        }
        return instance;
    }    
    
    public Object castByGivenObject(Hashtable values, Class targetClass){
        try {
//            if (valuesObj.getClass().getClass().getName().equals(ObjectMap.class.getName())){
//                ObjectMap values = (ObjectMap) valuesObj;
//            } else if (valuesObj.getClass().getClass().getName().equals(LinkedHashMap.class.getName())){
//                LinkedHashMap values = (LinkedHashMap) valuesObj;
//            }
            Object returnObject = targetClass.newInstance();
//            log.error("returnObject");
//            log.error(returnObject);
//            log.error( "class " + targetClass.getName() ); 
//            log.error (" number of declared fields: " + targetClass.getDeclaredFields().length );
            LinkedHashMap structuredMethodMap = StructureMethodList.getInstance().parseClassToMethodList(targetClass);
            
            for (int i=0;i<targetClass.getDeclaredFields().length;i++)  {
                Field anyField = targetClass.getDeclaredFields()[i];
                String fieldName = anyField.getName(); 
                Class fieldType = anyField.getType();
                String fieldTypeName = anyField.getType().getName(); 

                if (this.compareTypeNameToBasicTypes(fieldTypeName)) {
                    //log.info("Found Type: " + fieldName);
                    //Get value from  set 
                    Object t = values.get(fieldName);
                    //log.info("fieldName Value: "+t);
                    //log.info("fieldName Value: "+anyField.getModifiers());
                    int mod = anyField.getModifiers();
                    
                    if (Modifier.isPrivate(mod) && !Modifier.isFinal(mod)){
                        
                        //log.info("is private so get setter method "+fieldName);
                        LinkedHashMap methodSummery = (LinkedHashMap) structuredMethodMap.get(fieldName);
                        
                        if (methodSummery!=null) {
                            if (methodSummery.get("setter")!=null) {
    
                                String methodSetterName = methodSummery.get("setter").toString();
                                Class[] paramTypes = (Class[]) methodSummery.get("setterParamTypes");
                                Method m = targetClass.getMethod(methodSetterName, paramTypes);
                                
                                Class paramType = paramTypes[0];
                                
                                //try to cast the Given Object to the necessary Object
                                if (t!=null && !paramType.getName().equals(t.getClass().getName())){
                                    for (int l=0;l<paramType.getConstructors().length;l++) {
                                        Constructor crt = paramType.getConstructors()[l];
                                        if (crt.getParameterTypes()[0].getName().equals("java.lang.String")){
                                            Object[] myargs = new Object[1];
                                            myargs[0] = t.toString();
                                            t = crt.newInstance(myargs);    
                                        }
                                    }
                                }
                                if (paramType.isPrimitive() && t==null){
                                    //cannot cast null to primitve
                                } else {
                                    Object[] arguments = new Object[]{ t }; 
                                    m.invoke(returnObject,arguments);
                                }
                            
                            } else {
                                mLogger.error("could not find a setter-method from Structured table. Is there a setter-method for " + fieldName + " in Class " + targetClass.getName());
                            }
                        } else {
                            mLogger.error("could not find a method from Structured table. Is there a method for " + fieldName + " in Class " + targetClass.getName());
                        }
                        
                    } else if (Modifier.isPublic(mod) && !Modifier.isFinal(mod)){
                        if (t!=null && !anyField.getType().getName().equals(t.getClass().getName())){
                            for (int k=0;k<anyField.getType().getConstructors().length;k++) {
                                Constructor crt = anyField.getType().getConstructors()[k];
                                if (crt.getParameterTypes()[0].getName().equals("java.lang.String")){
                                    Object[] myargs = new Object[1];
                                    myargs[0] = t.toString();
                                    t = crt.newInstance(myargs);
                                }
                            }

                            //Is public attribute so set it directly
                            anyField.set(returnObject, t);
                        }
                        
                    } else if (Modifier.isFinal(mod)) {
                        mLogger.error("Final attributes cannot be changed ");
                    } else {
                        mLogger.error("Unhandled Modifier Type: " + mod);
                    }
                    
                } else {
                    
                    //This will cast nested Object to the current Object
                    //it does not matter how deep it is nested
                    
//                    mLogger.error("fieldType "+fieldType.getName());
                    
                    //Check if the Attribute in the bean is a List
                    if (fieldType.getName().equals("java.util.Set")) {
                        
                        //Todo: Cast Set to Object
                        
//                        mLogger.error("compareBeanTypeToAllowedListTypes true " + fieldType.getName());
//                        mLogger.error("compareBeanTypeToAllowedListTypes true " + fieldName);
                        
                        Object valueOfHashMap = values.get(fieldName);
                        
                        if (valueOfHashMap!=null){
//                            mLogger.error("compareBeanTypeToAllowedListTypes true " + valueOfHashMap.getClass().getName());
                            String valueTypeOfHashMap = valueOfHashMap.getClass().getName();
                            HashSet s = new HashSet();
                            
                            if (this.compareTypeNameToAllowedListTypes(valueTypeOfHashMap)) {
                                Map m = (Map) valueOfHashMap;
                                for (Iterator it = m.keySet().iterator();it.hasNext();) {
                                    String key = it.next().toString();
//                                    mLogger.error("key: "+key);
                                    Object listObject = m.get(key);
//                                    mLogger.error("listObject: "+listObject);
//                                    mLogger.error("listObject: "+listObject.getClass().getName());
                                    
                                }
                                
                            }
                        }
                        
                    //otherwise do it as Object
                    } else {
                        
//                        mLogger.error("otherwise do it as Object "+fieldType.getName());
                    
                        Object valueOfHashMap = values.get(fieldName);
                        if (valueOfHashMap!=null){
                            String valueTypeOfHashMap = valueOfHashMap.getClass().getName();
                            
                            if (this.compareTypeNameToAllowedListTypes(valueTypeOfHashMap)) {
                                
                                mLogger.error(valueTypeOfHashMap);
                                mLogger.error(fieldType.getName());
                                
                                //Get value from  set 
                                Object t = this.castByGivenObject((Hashtable)valueOfHashMap, fieldType);
                                int mod = anyField.getModifiers();
                                
                                if (Modifier.isPrivate(mod) && !Modifier.isFinal(mod)){
                                    
                                    //mLogger.info("is private so get setter method "+fieldName);
                                    LinkedHashMap methodSummery = (LinkedHashMap) structuredMethodMap.get(fieldName);
                                    
                                    if (methodSummery!=null) {
                                        if (methodSummery.get("setter")!=null) {
                
                                            String methodSetterName = methodSummery.get("setter").toString();
                                            Class[] paramTypes = (Class[]) methodSummery.get("setterParamTypes");
                                            Method m = targetClass.getMethod(methodSetterName, paramTypes);
                                            
                                            Class paramType = paramTypes[0];
                                            //mLogger.error("paramType: "+paramType.getName());
                                            if (paramType.isPrimitive() && t==null){
                                                //cannot cast null to primitve
                                            } else {
                                                Object[] arguments = new Object[]{ t }; 
                                                m.invoke(returnObject,arguments);
                                            }
                                        
                                        } else {
                                            mLogger.error("could not find a setter-method from Structured table. Is there a setter-method for " + fieldName + " in Class " + targetClass.getName());
                                        }
                                    } else {
                                        mLogger.error("could not find a method from Structured table. Is there a method for " + fieldName + " in Class " + targetClass.getName());
                                    }
                                } else if (Modifier.isPublic(mod) && !Modifier.isFinal(mod)){
                                    
                                    //Is public attribute so set it directly
                                    anyField.set(returnObject, t);
                                    
                                } else if (Modifier.isFinal(mod)) {
                                    mLogger.error("Final attributes cannot be changed ");
                                } else {
                                    mLogger.error("Unhandled Modifier Type: " + mod);
                                }
                                
                            }
                        } else {
                            //There is no nested Object for that given
                            mLogger.error("There is no nested Object for that given: Attribute: " + fieldName + " Class " + targetClass.getName());
                        }
                    }
                    
                } 
                
                
            } 

            return returnObject;
        } catch (Exception ex) {
            mLogger.error("[castByGivenObject]: " ,ex);
        }
        return null;
    }
    
    private boolean compareTypeNameToBasicTypes(String fieldTypeName) {
        try {
            
            for (Iterator it = CastBasicTypes.getCompareTypesSimple().iterator();it.hasNext();) {
                if (fieldTypeName.equals(it.next())) return true;
            }
            
            return false;
        } catch (Exception ex) {
            mLogger.error("[compareTypeNameToBasicTypes]",ex);
            return false;
        }
    }
    
    private boolean compareTypeNameToAllowedListTypes(String fieldTypeName) {
        try {
            //mLogger.error("compareTypeNameToAllowedListTypes"+ fieldTypeName);
            for (Iterator it = CastBasicTypes.getAllowedListTypes().iterator();it.hasNext();) {
                if (fieldTypeName.equals(it.next())) return true;
            }
            
            return false;
        } catch (Exception ex) {
            mLogger.error("[compareTypeNameToBasicTypes]",ex);
            return false;
        }
    }

}
