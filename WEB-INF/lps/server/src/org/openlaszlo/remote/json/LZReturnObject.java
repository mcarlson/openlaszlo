/******************************************************************************
 * LZReturnObjectJSON.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

package org.openlaszlo.remote.json;

import java.io.*;
import java.sql.Timestamp;
import java.lang.reflect.*;
import java.util.*;
import java.lang.reflect.*;
import javax.servlet.http.*;
import org.openlaszlo.iv.flash.util.*;
import org.openlaszlo.iv.flash.api.action.*;
import org.openlaszlo.iv.flash.api.*;
import org.openlaszlo.utils.*;
import org.openlaszlo.xml.internal.*;
import org.openlaszlo.sc.ScriptCompiler;
import org.apache.log4j.*;
import org.apache.commons.beanutils.PropertyUtils;

/**
 * Utility class to create JSON based on a server object.
 */
public class LZReturnObject
{
    public static Logger mLogger = Logger.getLogger(LZReturnObject.class);
    public static final int RETTYPE_POJO = 0;
    public static final int RETTYPE_JAVA_BEAN = 1;

    StringBuffer body;
    int mObjRetType;

    public LZReturnObject(String objectReturnType) throws Exception {
        body = new StringBuffer();
        if (objectReturnType == null) {
            mObjRetType = RETTYPE_POJO;
        } else if ("javabean".equals(objectReturnType)){
            mObjRetType = RETTYPE_JAVA_BEAN;
        } else {
            mObjRetType = RETTYPE_POJO;
        }
    }

    void pushInteger(int i) throws Exception {
        body.append(i);
    }

    void pushFloat(float f) throws Exception {
        body.append(f);
    }

    void pushString(String s) throws Exception {
        body.append(ScriptCompiler.JSONquote(s));
    }

    void pushDouble(double d) throws Exception {
        body.append(d);
    }


    void pushBoolean(boolean b) throws Exception {
        body.append(b ? "true" : "false");
    }

    void pushArray(Object object) throws Exception {
        body.append("[");
        int length = Array.getLength(object);
        for (int i = 0; i < length; i++) {
            if (i > 0) {
                body.append(",");
            }                
            createReturnValue(Array.get(object, i));
        }
        body.append("]");
    }

    void pushList(Object object) throws Exception {
        body.append("[");
        List list = (List)object;
        int length = list.size();
        //mLogger.warn(length);
        for (int i = 0; i < length; i++) {
            if (i > 0) {
                body.append(",");
            }
            createReturnValue(list.get(i));
        }
        body.append("]");
    }

    void pushSet(Object object) throws Exception {
        Set set = (Set)object;
        int length = set.size();
        int i = 0;
        body.append("[");
        for (Iterator iter = set.iterator();iter.hasNext();) {
            if (i++ > 0) {
                body.append(", ");
            }
            createReturnValue(iter.next());
        }
        body.append("]");
    }

    void pushNull() throws Exception {
        body.append("null");
    }


    void pushObject(Object object) throws Exception {
        try {
            Class cl = object.getClass();
            String classname = cl.getName();
    
            //------------------------------------------------------------
            //  {class: classname, key1: val1, key2: val2, ...}
            //------------------------------------------------------------
            // varname.class = classname
            body.append("{");
            body.append("\"class\": "+ScriptCompiler.JSONquote(classname));
    
            if (mObjRetType == RETTYPE_JAVA_BEAN) {
                pushObjectJavaBean(object);
            } else {
                pushObjectPOJO(object);
            }
         
            body.append("}");
        } catch (Exception err) {
            
            if (object != null) {
                mLogger.error("[pushObject]"+object.getClass().getName());
                mLogger.error("[pushObject]"+object.toString());
            }
            mLogger.error("[pushObject]",err);
        }
    }

    /**
     * Create JSON for an instance
     */
    void pushObjectPOJO(Object object) throws Exception {
        Class cl = object.getClass();
        Field[] fields = cl.getFields();
        for (int i=0; i < fields.length; i++) {
            if (! Modifier.isPublic(fields[i].getModifiers()))
                continue;

            String fieldName = fields[i].getName();
            Object value;
            try {
                value = fields[i].get(object);
            } catch (IllegalAccessException e) {
                mLogger.error("IllegalAccessException", e);
                continue;
            }
            if (mLogger.isDebugEnabled()) {
                mLogger.debug("add field name " + fieldName + ", " + 
                              (value != null ? value.getClass() : null) );
            }
            body.append(",");
            body.append(ScriptCompiler.JSONquote(fieldName)+": ");
            createReturnValue(value);
        }
    }

    /**
     * Create JSON for an object that conforms to JavaBean spec.
     */
    void pushObjectJavaBean(Object object) throws Exception {
        //------------------------------------------------------------
        // Just get the fields from the objects and add it to this object
        Map beanProps = null;
        try {
            //Use jakarta-commons beanutils to inspect the object
            beanProps = PropertyUtils.describe(object);
                    
            if (beanProps != null) {
                Set keys = beanProps.keySet();
                Iterator iter = keys.iterator();
                while(iter.hasNext()){
                    Object obj = iter.next();
                    
                    mLogger.warn("serialize "+obj);
                    String fieldName  = (String) obj;
                    //Don't add the class property as it is already set by the method
                    //mLogger.debug("fieldName equals Class ??");
                    if(!fieldName.equals("class")) {
                        //mLogger.debug("fieldName equals Class !!");
                        Object value = beanProps.get(fieldName);
                        //if (mLogger.isDebugEnabled()) {
                        mLogger.debug("add field name " + fieldName + ", " + 
                                          ((value!=null)?value.getClass():null));
                        //}
                        if (value != null) {
                            mLogger.debug("VC NAME: "+value.getClass().getName());
                        }
                        
                        if (Timestamp.class.isInstance(value)) {
                            mLogger.warn("Found Timestamp");
                            value = value.toString();
                            body.append(", ");
                            body.append(ScriptCompiler.JSONquote(fieldName)+": ");
                            createReturnValue(value);
                        } else {
                            body.append(", ");
                            body.append(ScriptCompiler.JSONquote(fieldName)+": ");
                            createReturnValue(value);
                        }
                    }
                }
            }
        
        } catch (IllegalAccessException e) {
            mLogger.error("IllegalAccessException",e);
        } catch (InvocationTargetException e) {
            mLogger.error("InvocationTargetException",e);
        } catch (NoSuchMethodException e) {
            mLogger.error("NoSuchMethodException",e);
        } catch (Exception err) {
            
            if (object != null) {
                mLogger.error("[pushObjectJavaBean]"+object.getClass().getName());
                mLogger.error("[pushObjectJavaBean]"+object.toString());
            }
            mLogger.error("[pushObjectJavaBean]",err);
        }
    }


    void pushMap(Map map) throws Exception {

        Iterator iter = map.keySet().iterator();
        int i = 0;

        body.append("{");
        while (iter.hasNext()) {
            Object key = iter.next();
            if (i++ > 0) {
                body.append(", ");
            }

            body.append(ScriptCompiler.JSONquote(""+key)+": ");
            createReturnValue(map.get(key));
        }
        body.append("}");
        
    }

    /**
     * Recurse through this function to create return value
     */
    void createReturnValue(Object object) throws Exception {
        if (object == null) {
            pushNull();
            return;
        }

        Class cl = object.getClass();
        if (cl.isArray()) {
            pushArray(object);
        } else if (List.class.isInstance(object)) {
            pushList(object);
        } else if (Set.class.isInstance(object)) {
            pushSet(object);
        } else if (Map.class.isInstance(object)) {
            pushMap((Map)object);
        } else if (cl == Integer.class) {
            pushInteger(((Integer)object).intValue());
        } else if (cl == Long.class) {
            //------------------------------------------------------------
            // From: http://developer.irt.org/script/1031.htm
            //
            // In JavaScript all numbers are floating-point numbers.
            //
            // JavaScript uses the standard 8 byte IEEE floating-point numeric
            // format, which means the range is from:
            //
            // +/- 1.7976931348623157x10^308 - very large, and +/- 5x10^-324 -
            // very small.
            //
            // As JavaScript uses floating-point numbers the accuracy is only
            // assured for integers between: -9,007,199,254,740,992 (-2^53) and
            // 9,007,199,254,740,992 (2^53)
            //
            // All the above from "JavaScript The Definitive Guide" - O'Reilly. 
            // 
            //------------------------------------------------------------
            // Java long:
            // 8 bytes signed (two's complement). Ranges from
            // -9,223,372,036,854,775,808 to +9,223,372,036,854,775,807.
            //------------------------------------------------------------
            
            // possible rounding inaccuracy
            pushInteger(((Long)object).intValue());

        } else if (cl == Short.class) {
            pushInteger(((Short)object).intValue());
        } else if (cl == Byte.class) {
            // push as number for now
            pushInteger(((Byte)object).intValue());
        } else if (cl == Character.class) {
            pushString(((Character)object).toString());
        } else if (cl == Float.class) {
            pushFloat(((Float)object).floatValue());
        } else if (cl == Double.class) {
            pushDouble(((Double)object).doubleValue());
        } else if (cl == Boolean.class) {
            pushBoolean(((Boolean)object).booleanValue());
        } else if (cl == String.class) {
            pushString((String)object);
        } else {
            pushObject(object);
        }
    }


    public String createObjectProgram(Object object) throws Exception{
        createReturnValue(object);
        return body.toString();
    }
    
}
