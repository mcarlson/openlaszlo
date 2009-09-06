/* ****************************************************************************
 * JavaDataSource.java
 * ****************************************************************************/

/* J_LZ_COPYRIGHT_BEGIN *******************************************************
* Copyright 2001-2009 Laszlo Systems, Inc.  All Rights Reserved.              *
* Use is subject to license terms.                                            *
* J_LZ_COPYRIGHT_END *********************************************************/

/*
 * The Apache Software License, Version 1.1
 *
 *
 * Copyright(c) 2002 The Apache Software Foundation.  All rights
 * reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.
 *
 * 3. The end-user documentation included with the redistribution,
 *    if any, must include the following acknowledgment:
 *       "This product includes software developed by the
 *        Apache Software Foundation(http://www.apache.org/)."
 *    Alternately, this acknowledgment may appear in the software itself,
 *    if and wherever such third-party acknowledgments normally appear.
 *
 * 4. The names "XML-RPC" and "Apache Software Foundation" must
 *    not be used to endorse or promote products derived from this
 *    software without prior written permission. For written
 *    permission, please contact apache@apache.org.
 *
 * 5. Products derived from this software may not be called "Apache",
 *    nor may "Apache" appear in their name, without prior written
 *    permission of the Apache Software Foundation.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE APACHE SOFTWARE FOUNDATION OR
 * ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES(INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 * ====================================================================
 *
 * This software consists of voluntary contributions made by many
 * individuals on behalf of the Apache Software Foundation.  For more
 * information on the Apache Software Foundation, please see
 * <http://www.apache.org/>.
 */
package org.openlaszlo.data;



import java.io.*;
import java.lang.reflect.*;
import java.util.*;
import java.net.MalformedURLException;
import javax.servlet.http.*;
import org.apache.xmlrpc.*;
import org.openlaszlo.server.LPS;
import org.openlaszlo.server.Option;
import org.openlaszlo.xml.*;
import org.openlaszlo.xml.internal.*;
import org.openlaszlo.utils.*;
import org.openlaszlo.data.helpers.LaszloRPCAdapter;
import org.openlaszlo.data.helpers.LaszloTypeMapping;
import org.openlaszlo.remote.*;
// LoadCount belongs in utils
import org.openlaszlo.servlets.LoadCount;
import org.openlaszlo.media.MimeType;
import org.apache.log4j.*;

/**
 * Data source for java direct calls.
 */
public class JavaDataSource extends DataSource
{
    private static Logger mLogger  = Logger.getLogger(JavaDataSource.class);

    private static String OBJECTS = "__lzobj";

    //------------------------------------------------------------
    // Begin javarpc info variables
    //------------------------------------------------------------

    final public static int LOAD_INVOKE = 0x01;
    final public static int LOAD_STATIC_GET_PROTO = 0x02;
    final public static int LOAD_INSTANCE_CREATE_PROTO = 0x04;
    final public static int LOAD_INSTANCE_GET_PROTO = 0x08;
    final public static int LOAD_INSTANCE_DESTROY_PROTO = 0x10;
    final public static int LOAD_INSTANCE_GET_INVOKE_TARGET = 0x20;
    final public static int LOAD_RETURN_OBJECT_ENCODE = 0x40;

    static long mLastCleared = -1; 

    // Map of SWF prototypes for session objects.
    public static Map mSessionPrototypes = new HashMap();
    // Map of SWF prototypes for webapp objects.
    public static Map mWebAppPrototypes  = new HashMap();
    // Map of SWF prototypes for static objects.
    public static Map mStaticPrototypes  = new HashMap();

    // Count of sessions. Also used by SessionBindingMap.
    public static ThreadSafeCounter mSessionCounter
        = new ThreadSafeCounter();
    // Count of system-wide objects. Also used by SessionBindingMap.
    public static ThreadSafeCounter mSessionObjectsCounter
        = new ThreadSafeCounter();
    // Count of webapp objects.
    public static ThreadSafeCounter mWebAppObjectsCounter = 
        new ThreadSafeCounter();

    public static LoadCount mJavaRPCLoad = new LoadCount(10);
    public static LoadCount mInvokeLoad = new LoadCount(10);
    public static LoadCount mReturnObjectEncodeLoad = new LoadCount(10);
    public static LoadCount mStaticProtoGetLoad = new LoadCount(10);
    public static LoadCount mInstanceProtoCreateLoad = new LoadCount(10);
    public static LoadCount mInstanceProtoGetLoad = new LoadCount(10);
    public static LoadCount mInstanceProtoDestroyLoad = new LoadCount(10);
    public static LoadCount mInstanceGetInvokeTargetLoad = new LoadCount(10);

    //------------------------------------------------------------
    // End javarpc info variables
    //------------------------------------------------------------

    static final String UNKNOWN = "unknown";
    static final String SESSION = "session";
    static final String WEBAPP  = "webapp";
    static final String NONE    = "none";

    static final int SCOPE_UNKNOWN = -1;
    static final int SCOPE_SESSION = 0;
    static final int SCOPE_WEBAPP  = 1;
    static final int SCOPE_NONE  = 2;

    ObjectData DEFAULT_VOID;

    public JavaDataSource() {
        clearLoadInfo();
        try {
            DEFAULT_VOID = new ObjectData
                (XMLRPCJSONCompiler.compileResponse(0, "void"));
        } catch (IOException e) {
            mLogger.error(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="exception: " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-161", new Object[] {e.getMessage()}), e);
            throw new RuntimeException(e.getMessage()); 
        }
    }

    /**
     * @return unique name of this data source
     */
    public String name() 
    {
        return "java";
    }

    /**
     * Sends system information to client.
     * 
     * @throws DataSourceException if there was a problem retrieving or sending
     * the data.
     */
    public Data getData(String app, HttpServletRequest req, 
                        HttpServletResponse res, long lastModifiedTime)
        throws DataSourceException {
        mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="getData"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-190"));

        if (! req.getMethod().equals("POST"))
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="request must be POST"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-202"));

        String url;
        try {
            url = getURL(req);
        } catch (MalformedURLException e) {
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="malformed url"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-215"), e);
        }

        String cname = getClassName(url);
        if (cname == null)
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="invalid class or bad url: " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-227", new Object[] {url}));

        if (! isClassOk(cname, req.getServletPath())) 
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="forbidden class: " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-237", new Object[] {cname}));

        Class targetClass = getClass(cname);
        if (targetClass == null)
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="no such class " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-248", new Object[] {cname}));

        int scope = getScope(req);
        if (scope == SCOPE_UNKNOWN)
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="no scope request parameter"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-259"));

        String postbody = req.getParameter("lzpostbody");
        if (postbody == null || postbody.equals(""))
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="no post body"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-270"));

        // one of 'pojo' or 'javabean'
        String objectReturnType = req.getParameter("objectreturntype");
        if (objectReturnType == null || "".equals(objectReturnType)) {
            objectReturnType = "pojo";
        }

        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="class name: " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-286", new Object[] {cname}));
            mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="object return type: " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-294", new Object[] {objectReturnType}));
            mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="POST body:\n" + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-302", new Object[] {postbody}));
        }

        /*        XmlRpcRequest xr = new LZXmlRpcRequestProcessor()
            .processRequest(new ByteArrayInputStream(postbody.getBytes()));
        */

        XmlRpcRequest xr = new LZXmlRpcRequestProcessor()
            .processRequest(new ByteArrayInputStream(postbody.getBytes()));

        long t0, t1;
        t0 = System.currentTimeMillis();
        mJavaRPCLoad.increment();
        try {
            return execute(req, res, targetClass, scope, objectReturnType,
                           xr.getMethodName(), xr.getParameters());
        } catch (IOException e) {
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="exception executing " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-322", new Object[] {xr.getMethodName()}), e);
        } finally {
            t1 = System.currentTimeMillis();
            mJavaRPCLoad.decrement((int)(t1-t0));
        }
    }

    /**
     * Check to see if class is allowed.
     */
    public boolean isClassOk(String cname, String path) {
        return LPS.configuration.optionAllows(path, "security", cname, false);
    }

    /** 
     * This code borrows from Apache's XMLRPC
     * org.apache.xmlrpc.Invoker.execute() method.
     */
    public Data execute(HttpServletRequest req, HttpServletResponse res, 
                        Class targetClass, int scope, String objectReturnType, 
                        String methodName, 
                        Vector params) throws IOException {

        if (mLogger.isDebugEnabled()) {
            StringBuffer p = new StringBuffer(" ");
            for (int i=0; i < params.size(); i++) {
                p.append(params.get(i)).append(" ");
            }
            mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="execute(" + p[0] + ", [" + p[1] + "],context)"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-358", new Object[] {methodName, p.toString()}));
        }

        Class[] argClasses = null;
        Object[] argValues = null;
        
        String _doreq = req.getParameter("doreq");
        String _dores = req.getParameter("dores");
        boolean doreq = (_doreq != null && (_doreq.equals("1") || _doreq.equals("true")));
        boolean dores = (_dores != null && (_dores.equals("1") || _dores.equals("true")));

        int reqPos    = -1; // position of request in parameter list
        int resPos    = -1; // position of response in parameter list 

        int httpCount = 0;  // count of request and response passed in

        int paramCount = (params != null ? params.size() : 0);

        // if request exists, place request following the last parameter
        if (doreq) {
            mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="adding request to method"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-385"));
            reqPos = paramCount;
            httpCount++;
        }

        // if response exists, place response after it, else
        // place it following the last parameter
        if (dores) {
            mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="adding response to method"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-400"));
            resPos = (reqPos != -1 ? reqPos + 1 : paramCount);
            httpCount++;
        }

        // create arrays for argument classes and values.
        int count = paramCount + httpCount;
        argClasses = new Class[count];
        argValues = new Object[count];

        if (doreq) {
            argClasses[reqPos] = HttpServletRequest.class;
            argValues[reqPos] = req;
        }

        if (dores) {
            argClasses[resPos] = HttpServletResponse.class;
            argValues[resPos] = res;
        }

        if (params != null) {
            for (int i = 0; i < params.size(); i++) {
                argValues[i] = params.elementAt(i);
                if (argValues[i] instanceof Integer) {
                    argClasses[i] = Integer.TYPE;
                } else if (argValues[i] instanceof Double) {
                    argClasses[i] = Double.TYPE;
                } else if (argValues[i] instanceof Boolean) {
                    argClasses[i] = Boolean.TYPE;
                } else {
                    argClasses[i] = argValues[i].getClass();
                }
            }
        }

        Method method = null;
        Object invokeTarget = targetClass;
        long t0, t1;

        String op = req.getParameter("op");
        if (op != null) {

            String cname = targetClass.getName();
            String oname = req.getParameter("oname");
            if (scope == SCOPE_NONE) oname= NONE;
            if (oname == null || "".equals(oname))
                return compileFault("no oname parameter");

            if (scope == SCOPE_NONE) {
                if ("get".equals(op) || "create".equals(op)) {
                    t0 = System.currentTimeMillis();
                    mStaticProtoGetLoad.increment();
                    try {
                        return getStaticPrototype(cname);
                    } finally {
                        t1 = System.currentTimeMillis();
                        mStaticProtoGetLoad.decrement((int)(t1-t0));
                    }
                }
            }

            if ( scope == SCOPE_SESSION || scope == SCOPE_WEBAPP ) {

                if ("get".equals(op)) {
                    t0 = System.currentTimeMillis();
                    mInstanceProtoGetLoad.increment();
                    try {
                        return getInstancePrototype(cname, oname, scope, req);
                    } finally {
                        t1 = System.currentTimeMillis();
                        mInstanceProtoGetLoad.decrement((int)(t1-t0));
                    }
                }

                if ("create".equals(op)) {
                    t0 = System.currentTimeMillis();
                    mInstanceProtoCreateLoad.increment();
                    try {
                        return createInstancePrototype(cname, oname, scope, 
                                                       argClasses, argValues, req);
                    } finally {
                        t1 = System.currentTimeMillis();
                        mInstanceProtoCreateLoad.decrement((int)(t1-t0));
                    }
                }

                if ("destroy".equals(op)) {
                    t0 = System.currentTimeMillis();
                    mInstanceProtoDestroyLoad.increment();
                    try {
                        return destroyInstance(oname, scope, req);
                    } finally {
                        t1 = System.currentTimeMillis();
                        mInstanceProtoDestroyLoad.decrement((int)(t1-t0));
                    }
                }

                if ("invoke".equals(op)) {
                    t0 = System.currentTimeMillis();
                    mInstanceGetInvokeTargetLoad.increment();
                    try {
                        invokeTarget = getInvokeTarget(oname, scope, req);
                    } finally {
                        t1 = System.currentTimeMillis();
                        mInstanceGetInvokeTargetLoad.decrement((int)(t1-t0));
                    }
                    if (invokeTarget == null) {
                        String errmsg =
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="could not find " + p[0] + " instance " + p[1]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-516", new Object[] {getScopeName(scope), oname});
                        mLogger.error(errmsg);
                        return compileFault(errmsg);
                    }
                }
            }
        }

        t0 = System.currentTimeMillis();
        mInvokeLoad.increment();
        Object returnValue = null;
        try {
            // The last element of the XML-RPC method name is the Java
            // method name.
            int dot = methodName.lastIndexOf('.');
            if (dot > -1 && dot + 1 < methodName.length()) {
                methodName = methodName.substring(dot + 1);
            }

            if (mLogger.isDebugEnabled()) {
                mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="Searching for method: " + p[0] + " in class " + p[1]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-542", new Object[] {methodName, targetClass.getName()})
                                );
                if (argClasses.length != 0) {
                    for (int i = 0; i < argClasses.length; i++) {
                        mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="Parameter " + p[0] + ": " + p[1] + " (" + p[2] + ")"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-551", new Object[] {new Integer(i), argValues[i], argClasses[i]})
                                );
                    }
                }
            }

            /*
             * These are the important Bits
             * Cause here you decide which method to choose
             * swagner - 25.02.2008
             * 
             */
            
            
            try {
                
                //targetClass
                mLogger.debug("Is This Class a related to the Adapter: "+LaszloRPCAdapter.class.isInstance(invokeTarget));
                
                //Indicates if the Method will be using the Custom Types, its true if the the 
                //javaRPC class uses the OpenLaszloRPCAdapter
                if (LaszloRPCAdapter.class.isInstance(invokeTarget)) {
                    
                    
                    mLogger.debug("Is Method of RPC-Gateway");
                    
                    //OpenLaszloRPCAdapter openLaszloRPCAdapter = (OpenLaszloRPCAdapter) targetClass;
                    
                    //targetClass
                    
                    LaszloRPCAdapter openLaszloRPCAdapter = (LaszloRPCAdapter) invokeTarget;
                    
                    openLaszloRPCAdapter.servletRequest = req;
                    
                    List customMappings = openLaszloRPCAdapter.getCustomMappings();
                    
                    //This will only get the Method by the number of Arguments
                    //We will try to cast each param to the correct value
                    method = getMethodByMap(targetClass, methodName, argClasses);
                    
                    //No method Found Throw Error to Client
                    if (method == null) {
                        StringBuffer buf = new StringBuffer();
                        for (int i=0; i < argClasses.length; i++) {
                            if (i != 0) buf.append(", ");
                            buf.append(argClasses[i].toString());
                        } 
                        throw new NoSuchMethodException(/* (non-Javadoc)
                                 * @i18n.test
                                 * @org-mes=p[0] + "(" + p[1] + "): no such method"
                                 */
                                org.openlaszlo.i18n.LaszloMessages.getMessage(
                                        JavaDataSource.class.getName(),"051018-999", new Object[] {methodName, buf.toString()}));
                    }
                    
                    mLogger.debug("methodName: "+methodName);
                    mLogger.debug("argClasses: "+argClasses);
                    mLogger.debug("targetClass: "+targetClass);
                    mLogger.debug("method: "+method);
                    
                    Class[] paramTypes = method.getParameterTypes();
                    
                    mLogger.debug("paramTypes: "+paramTypes);
                    
                    //make new Params Object to hold all Params
                    Object[] argValuesCasted = new Object[argValues.length];
                    
                    //Cast Objects to needed values
                    for (int i = 0;i<argValues.length;i++) {
                        mLogger.debug("argValues: "+argValues[i]);
                        mLogger.debug("argValues Given Class: "+argValues[i].getClass().getName());
                        
                        Class neededClass = paramTypes[i];
                        mLogger.debug("Needed Class: "+neededClass.getName());
                        mLogger.debug("Is Instance? "+neededClass.isInstance(argValues[i]));
                        
                        if (neededClass.isInstance(argValues[i])) {
                            
                            argValuesCasted[i] = neededClass.cast(argValues[i]);
                            
                        } else if (this.compareForPrimitives(neededClass.getName(), argValues[i].getClass().getName())) {
                            
                            mLogger.debug("Is Primitve Needed Cast automatically ");
                            argValuesCasted[i] = argValues[i];
                            
                        } else {
                            mLogger.debug("Could not cast Argument to needed Value, check for custom translator");
                            
                            //Get Value from Custom Object, check if there is a Custom Method for that Type
                            Object obj = this.getCustomValueByMap(invokeTarget, customMappings, neededClass.getName(), argValues[i]);
                            
                            //Cast it now to the needed one
                            argValuesCasted[i] = neededClass.cast(obj);
                        }
                        
                    }
                    
                    //Call Handler in Adapter that a Function is Called
                    openLaszloRPCAdapter.onCall(methodName, argClasses, argValuesCasted);
                    
                    returnValue = method.invoke(invokeTarget, argValuesCasted);
                    
                    
                } else {
                    
                    
                    method = getMethod(targetClass, methodName, argClasses);
                    
                    // invoke
                    try {
                        returnValue = method.invoke(invokeTarget, argValues);
                    } catch (IllegalAccessException e) {
                        mLogger.error("IllegalAccessException", e);
                        return compileFault(e.getMessage(), e);
                    } catch (IllegalArgumentException e) {
                        mLogger.error("IllegalArgumentException", e);
                        return compileFault(e.getMessage(), e);
                    } catch (InvocationTargetException e) {
                        mLogger.error("InvocationTargetException", e);
                        Throwable cause = e.getCause();
                        if (cause != null) return compileFault(cause);
                        return compileFault(e.getMessage(), e);
                    } catch (Exception e) {
                        mLogger.error("Exception", e);
                        return compileFault(e.getMessage(), e);
                    } catch (Error e) {
                        mLogger.error("Error", e);
                        return compileFault(e.getMessage(), e);
                    }
                    
                }
                
            } catch(NoSuchMethodException e) {
                mLogger.error(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="NoSuchMethodException"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-565"), e);
                return compileFault(e.getMessage(), e);
            } catch(SecurityException e) {
                mLogger.error(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="SecurityException"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-575"), e);
                return compileFault(e.getMessage(), e);
            } catch (IllegalArgumentException e) {
                // TODO Check if this is the appropriate Return
                mLogger.error("IllegalArgumentException", e);
                return compileFault(e.getMessage(), e);
            } catch (IllegalAccessException e) {
                // TODO Check if this is the appropriate Return
                mLogger.error("IllegalAccessException", e);
                return compileFault(e.getMessage(), e);
            } catch (InvocationTargetException e) {
                // TODO Check if this is the appropriate Return
                mLogger.error("InvocationTargetException", e);
                return compileFault(e.getMessage(), e);
            } catch (Exception e) {
                // TODO Check if this is the appropriate Return
                mLogger.error("Exception", e);
                return compileFault(e.getMessage(), e);
            }

            // Make all public methods callable except those defined in
            // java.lang.Object.
            if (method.getDeclaringClass() == Object.class) {
                return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="Can't call methods in java.lang.Object"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-589"));
            }

            
        } finally {
            t1 = System.currentTimeMillis();
            mInvokeLoad.decrement((int)(t1-t0));
        }

        t0 = System.currentTimeMillis();
        mReturnObjectEncodeLoad.increment();
        try {
            Class returnType = method.getReturnType();
            if (returnType == Void.TYPE) {
                return getVoid();
            } else if (returnType == DataEncoder.class && returnValue != null) {
                return new EncoderData((DataEncoder)returnValue);
            }

//            return new ObjectData
//                (org.openlaszlo.remote.json.LZReturnObject.createObject(returnValue, objectReturnType));

            return new ObjectData(org.openlaszlo.remote.json.LZJsonFactory.getJsonBuilderInstance().createObject(returnValue, objectReturnType));
            
        } catch (IOException e) {
            mLogger.error("IOException", e);
            return compileFault(e.getMessage(), e);
        } finally {
            t1 = System.currentTimeMillis();
            mReturnObjectEncodeLoad.decrement((int)(t1-t0));
        }
    }


    synchronized ObjectData getVoid() {
        return DEFAULT_VOID;
    }

    /**
     * for scope == SCOPE_NONE (static objects).
     */
    Data getStaticPrototype(String cname) {
        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
                    /* (non-Javadoc)
                     * @i18n.test
                     * @org-mes="getStaticPrototype(" + p[0] + ")"
                     */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-681", new Object[] {cname}));
        }
        return getPrototype(cname, SCOPE_NONE);
    }


    /**
     * Return prototype for session and webapp if object was
     * previously created.
     */
    Data getInstancePrototype(String cname, String oname, int scope, 
                              HttpServletRequest req) {

        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="getInstancePrototype(" + p[0] + "," + p[1] + ")"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-702", new Object[] {cname, oname}));
        }

        if (getJavaObject(req.getSession(false), scope, oname) != null) {
            if (scope == SCOPE_WEBAPP) {
                return (Data)mWebAppPrototypes.get(cname);
            } else if (scope == SCOPE_SESSION) {
                return (Data)mSessionPrototypes.get(cname);
            }
        }

        String errmsg = 
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="couldn't find " + p[0] + " instance " + p[1]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-721", new Object[] {getScopeName(scope), oname});
        mLogger.error(errmsg);
        return compileFault(errmsg);
    }


    /**
     * creates a client swf object (remoteobject create)
     */
    Data createInstancePrototype(String cname, String oname, int scope, 
                                 Class[] argClasses, Object[] argValues,
                                 HttpServletRequest req) {


        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="createInstancePrototype(" + p[0] + "," + p[1] + ")"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-742", new Object[] {cname, oname}));
        }

        // create session here, if it doesn't exist
        HttpSession session = req.getSession(true);

        String _clobber = req.getParameter("clobber");
        boolean clobber = (_clobber != null && ("1".equals(_clobber) || "true".equals(_clobber)));

        Object o = null;
        if (! clobber ) {
            o = getJavaObject(session, scope, oname);
            if (o != null) {
                if (mLogger.isDebugEnabled()) {
                    mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="not clobbering existing " + p[0] + " object " + p[1]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-763", new Object[] {getScopeName(scope), oname })
                                );
                }
                return getPrototype(cname, scope);
            }
        }

        // send back client object.
        try {
            o = getServerInstance(cname, argClasses, argValues);
            setJavaObject(session, scope, oname, o);
        } catch (Exception e) {
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="could not create instance of " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-780", new Object[] {cname}), e);
        }

        return getPrototype(cname, scope);
    }

    /**
     * there should be a check in this Function, sothat NULL does not work
     * 
     * @param neededClass
     * @param providedClass
     */
    private boolean compareForPrimitives(String neededClass, String providedClass) {
        try {
            
            if (neededClass == "int" && providedClass == "java.lang.Integer") {
                return true;
            } else if (neededClass == "long" && providedClass == "java.lang.Integer") {
                return true;
            } else if (neededClass == "boolean" && providedClass == "java.lang.Boolean") {
                return true;
            } else if (neededClass == "double" && providedClass == "java.lang.Double") {
                return true;
            } else if (neededClass == "float" && providedClass == "java.lang.Float") {
                return true;
            }
            
        } catch (Exception err) {
            mLogger.error("[compareForPrimitives]",err);
        }
        return false;
    }
    
    Object getCustomValueByMap(Object rpcInstance, List customTypes, String neededType, Object value) throws Exception {
        
        String customMethodName = "";
        
        for (int i=0;i<customTypes.size();i++) {
            
            LaszloTypeMapping typeMapping = (LaszloTypeMapping) customTypes.get(i);
            
            if (typeMapping.getType().equals(neededType)) {
                
                mLogger.debug("Found Needed Type Assign Method to the Custom Mapping");
                customMethodName = typeMapping.getMethodName();
            }
            
        }
        
        if (customMethodName.length()!=0) {
            //Simulate one argument, as these Type Mapping-Methods always parse
            //1:1 => one argument only always
            Class[] params = new Class[1];
            Method method = getMethodByMap(rpcInstance.getClass(),customMethodName,params);
            
            if (method != null) {
                
                Object[] argValuesCasted = new Object[1];
                argValuesCasted[0] = value;
                
                mLogger.debug("Found Method to Map Object - Call it");
                
                return method.invoke(rpcInstance, argValuesCasted);
                
            } else {
                
                LaszloRPCAdapter openLaszloRPCAdapter = (LaszloRPCAdapter) rpcInstance;
                
                openLaszloRPCAdapter.onMappingNotFound(neededType,value);
                
                mLogger.error("Could not Find a Mapping Method "+customMethodName+" in Class: " 
                        +rpcInstance.getClass().getName()+" this Type: "+neededType);
                
            }
            
        } else {
            
            mLogger.error("Could not Find a Mapping for this Type: "+neededType);
            
        }
        
        return null;
        
    }

    /**
     * Get client prototype.
     */
    synchronized Data getPrototype(String cname, int scope) {
        try {
            Data data;
            if (scope == SCOPE_NONE) {
                data = (Data)mStaticPrototypes.get(cname);
            } else if (scope == SCOPE_WEBAPP) {
                data = (Data)mWebAppPrototypes.get(cname);
            } else {
                data = (Data)mSessionPrototypes.get(cname);
            }

            if (data == null) {
                mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="creating client prototype for " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-809", new Object[] {cname}));


                byte[] b;
                b = org.openlaszlo.remote.json.LZClientObject.createObject(cname, getScopeName(scope));
                data = new ObjectData(b);
                if (scope == SCOPE_NONE) {
                    mStaticPrototypes.put(cname, data);
                } else if (scope == SCOPE_WEBAPP) {
                    mWebAppPrototypes.put(cname, data);
                } else {
                    mSessionPrototypes.put(cname, data);
                }
            }

            return data;
        } catch (Exception e) {
            return compileFault(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="could not get " + p[0] + " in scope " + p[1]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-831", new Object[] {cname, getScopeName(scope)})
                        , e);
        }
    }



    /**
     */
    //--------------------------------------------------------------------
    // TODO [2005-02-16 pkang]: think about what happens if swf version
    // requested is different from the instance prototype we have cached.
    //--------------------------------------------------------------------
    Data destroyInstance(String oname, int scope, HttpServletRequest req) {

        if (mLogger.isDebugEnabled()) {
            mLogger.debug(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="destroyInstance(" + p[0] + ", " + p[1]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-858", new Object[] {oname, new Integer(scope)}));
        }
        removeJavaObject(req.getSession(false), scope, oname);
        return getVoid();
    }

    /*
     * Get the invocation target for the session or webapp scope.
     */
    Object getInvokeTarget(String oname, int scope, HttpServletRequest req) {
        return getJavaObject(req.getSession(false), scope, oname);
    }


    String getClassName(String url) {
        if (url.startsWith("java://")) return url.substring(7);
        return null;
    }

    Class getClass(String cname) {
        try {
            return Class.forName(cname);
        } catch (ClassNotFoundException e) {
            mLogger.error(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes="class not found: " + p[0]
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-888", new Object[] {cname}));
        }
        return null;
    }



    /**
     * pt1 and pt2 are assumed not to be null. If param types are 0, array length
     * is 0.
     */
    boolean paramTypesMatch(Class[] pt1, Class[] pt2) {
        if (pt1.length != pt2.length) 
            return false; 

        for (int i=0; i < pt1.length; i++) {
            if ( ! pt1[i].isAssignableFrom(pt2[i]) ) {
                return false;
            }
        }
        return true;
    }

    /**
     * Create instance by calling constructor.
     */
    Object getServerInstance(String classname, Class[] argClasses, Object[] argValues) 
        throws Exception {

        if (mLogger.isDebugEnabled()) {
            mLogger.debug("getServerInstance(" + classname + ")");
        }

        Class cl = Class.forName(classname);

        Constructor constructor = null;
        Constructor[] carr = cl.getConstructors();
        for (int i=0; i < carr.length; i++) {
            Class[] ptarr = carr[i].getParameterTypes();
            if ( paramTypesMatch(ptarr, argClasses) ) {
                constructor = carr[i];
                break;
            }
        }

        if (constructor == null) {
            StringBuffer buf = new StringBuffer();
            for (int i=0; i < argClasses.length; i++) {
                if (i != 0) buf.append(",");
                buf.append(argClasses[i].toString());
            }
            String msg = 
                    /* (non-Javadoc)
                     * @i18n.test
                     * @org-mes="no such constructor found: " + p[0] + "(" + p[1] + ")"
                     */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-946", new Object[] {classname, buf.toString()});
            mLogger.error(msg);
            throw new Exception(msg);
        }

        return constructor.newInstance(argValues);
    }


    /**
     * Returns the Method but only compares the Number of params 
     * 
     * swagner 28.02.2009
     * 
     * @param cl
     * @param methodName
     * @param params
     * @return
     * @throws Exception
     */
    Method getMethodByMap(Class cl, String methodName, Class[] params) throws Exception {

        // targetClass.getMethod(methodName, argClasses);

        Method[] classMethods = cl.getMethods();
        for (int m=0; m < classMethods.length; m++) {

            // find matching method
            mLogger.debug("getMethod looking for "+methodName+" ==? "+classMethods[m].getName());

            if ( ! methodName.equals(classMethods[m].getName()) ) continue;
            mLogger.debug("getMethod match found "+methodName+" class="+cl.getName());

            // make sure params match
            Class[] classParams = classMethods[m].getParameterTypes();
            mLogger.debug("[1] getMethod "+methodName+" classParams.length = "+classParams.length+" params.length="+ params.length);
            if (classParams.length == 0 && params == null)
                return classMethods[m];

            if (classParams.length == params.length) {
                return classMethods[m];
            }
            
        }
        return null;
    }

    
    /**
     * Like Class.getMethod() except we allow params that are derived.
     */
    Method getMethod(Class cl, String methodName, Class[] params) 
        throws NoSuchMethodException {

        // targetClass.getMethod(methodName, argClasses);

        Method[] classMethods = cl.getMethods();
        for (int m=0; m < classMethods.length; m++) {

            // find matching method
            mLogger.debug("getMethod looking for "+methodName+" ==? "+classMethods[m].getName());

            if ( ! methodName.equals(classMethods[m].getName()) ) continue;
            mLogger.debug("getMethod match found "+methodName+" class="+cl.getName());

            // make sure params match
            Class[] classParams = classMethods[m].getParameterTypes();
            mLogger.debug("[1] getMethod "+methodName+" classParams.length = "+classParams.length+" params.length="+ params.length);
            if (classParams.length == 0 && params == null)
                return classMethods[m];

            if (classParams.length == params.length) {
                boolean ok = true;
                for (int p=0; p < classParams.length; p++) {
                    mLogger.debug("[2] checking isAssignableFrom "+classParams[p].getName()+ " isAssignableFrom " + (params[p].getName()) + " ? = "+ classParams[p].isAssignableFrom(params[p]));
                    if ( ! classParams[p].isAssignableFrom(params[p]) ) {
                        ok = false;
                        break;
                    }
                }
                if (ok) return classMethods[m];
            }
        }

        StringBuffer buf = new StringBuffer();
        for (int i=0; i < params.length; i++) {
            if (i != 0) buf.append(", ");
            buf.append(params[i].toString());
        }
        throw new NoSuchMethodException(
                        /* (non-Javadoc)
                         * @i18n.test
                         * @org-mes=p[0] + "(" + p[1] + "): no such method"
                         */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-999", new Object[] {methodName, buf.toString()}));
    }


    String getScopeName(int scope) {
        if (SCOPE_SESSION == scope) return SESSION;
        if (SCOPE_WEBAPP  == scope) return WEBAPP;
        if (SCOPE_NONE    == scope) return NONE;
        return UNKNOWN;
    }

    int getScope(HttpServletRequest req) {
        String scope = req.getParameter("scope");
        if (scope == null) return SCOPE_UNKNOWN;
        if (SESSION.equals(scope)) return SCOPE_SESSION;
        if (WEBAPP.equals(scope))  return SCOPE_WEBAPP;
        if (NONE.equals(scope))    return SCOPE_NONE;
        return SCOPE_UNKNOWN;
    }


    Object getJavaObject(HttpSession session, int scope, String oname) {
        if (session == null) return null;
        Map map = null;
        if (scope == SCOPE_SESSION) {
            map = (Map)session.getAttribute(OBJECTS);
        } else if (scope == SCOPE_WEBAPP) {
            map = (Map)session.getServletContext().getAttribute(OBJECTS);
        }
        return ( map == null ? null : map.get(oname) );
    }


    /**
     * Add a java object to a session or webapp context.
     */
    void setJavaObject(HttpSession session, int scope, String oname, Object val){
        if (session == null) {
            if (mLogger.isDebugEnabled()) {
                mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="setting java object with no session in scope " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-1045", new Object[] {getScopeName(scope)})
                                );
            }
            return;
        }
        Map map = null;
        if (scope == SCOPE_SESSION) {
            map = (Map)session.getAttribute(OBJECTS);
            if ( map == null ) {
                map = new SessionBindingMap();
                session.setAttribute(OBJECTS, map);
                // session counter increments happen through SessionBindingMap.
            }
        } else if (scope == SCOPE_WEBAPP) {
            map = (Map)session.getServletContext().getAttribute(OBJECTS);
            if ( map == null ) {
                map = new HashMap();
                session.getServletContext().setAttribute(OBJECTS, map);
            }
        } else {
            mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="tried setting object with scope " + p[0] + "(" + p[1] + ")"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-1070", new Object[] {getScopeName(scope), new Integer(scope)})
            );
            return;
        }

        // if a previous object didn't exist, increment object counter.
        if (map != null) {
            Object oldVal = map.put(oname, val);
            if (oldVal == null) {
                if (scope == SCOPE_SESSION) {
                    mSessionObjectsCounter.increment();
                } else if (scope == SCOPE_WEBAPP) {
                    mWebAppObjectsCounter.increment();
                }
            }
        }
    }

    /**
     * Remove a java object from session or webapp context.
     */
    void removeJavaObject(HttpSession session, int scope, String oname){
        if (session == null) {
            if (mLogger.isDebugEnabled()) {
                mLogger.debug(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="tried removing java object with no session in scope " + p[0] + "(" + p[1] + ")"
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-1100", new Object[] {getScopeName(scope), new Integer(scope)})
                );
            }
            return;
        }
        Map map = null;
        if (scope == SCOPE_SESSION) {
            map = (Map)session.getAttribute(OBJECTS);
            // session counter decrements happen through SessionBindingMap.
        } else if (scope == SCOPE_WEBAPP) {
            map = (Map)session.getServletContext().getAttribute(OBJECTS);
        } else {
            mLogger.warn(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="tried removing object with scope " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-1118", new Object[] {getScopeName(scope)})
);
            return;
        }
        if (map != null) {
            Object oldVal = map.remove(oname);
            // if there was an existing one, decrement object counter.
            if (oldVal != null) {
                if (scope == SCOPE_SESSION) {
                    mSessionObjectsCounter.decrement();
                } else if (scope == SCOPE_WEBAPP) {
                    mWebAppObjectsCounter.decrement();
                }
            }
        }
    }


    /**
     * Compile fault exception message.
     */
    Data compileFault(Throwable e) {
        mLogger.error("compileFault", e);
        return compileFault(e.getMessage());
    }

    Data compileFault(String mesg) {
        return compileFault(mesg, null);
    }

    /**
     * Compile fault response.
     */
    Data compileFault(String mesg, Throwable e) {
        if (e == null) {
            mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="compileFault mesg: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-1159", new Object[] {mesg})
);
        } else {
            if (e.getCause() != null) {
                mesg += " "+e.getCause().toString();
                mLogger.error(e.getCause().toString());
            }
            mLogger.error(
/* (non-Javadoc)
 * @i18n.test
 * @org-mes="compileFault mesg: " + p[0]
 */
                        org.openlaszlo.i18n.LaszloMessages.getMessage(
                                JavaDataSource.class.getName(),"051018-1159", new Object[] {mesg})
, e);
        }
        try {

            byte[] d = XMLRPCJSONCompiler.compileFault(XMLUtils.escapeXml(mesg));
            return new ObjectData(d);

        } catch (Exception ex) {
            mLogger.error("Exception", ex);
            // this is an error since we can't build a fault response
            throw new Error(e.getMessage());
        }
    }


    /**
     * Helper function for toXML().
     */
    static void toXML(StringBuffer sb, String nodeName, 
                      Map m, ThreadSafeCounter objects, 
                      ThreadSafeCounter sessions){
        sb.append("<").append(nodeName);
        if (objects != null) {
            sb.append(" objects=\"").append(objects.getCount()).append("\"");
        }
        if (sessions != null) {
            sb.append(" sessions=\"").append(sessions.getCount()).append("\"");
        }
        sb.append(">");

        sb.append("</").append(nodeName).append(">");
    }


    public static void clearLoadInfo() {
        mJavaRPCLoad.reset();
        mInvokeLoad.reset();
        mReturnObjectEncodeLoad.reset();
        mStaticProtoGetLoad.reset();
        mInstanceProtoCreateLoad.reset();
        mInstanceProtoGetLoad.reset();
        mInstanceProtoDestroyLoad.reset();
        mInstanceGetInvokeTargetLoad.reset();
        mLastCleared = System.currentTimeMillis();
    }

    static boolean doXML( int options, int mask ) {
        return ( options & mask ) == mask;
    }

    /**
     * XML string with relevant statistics about JavaDataSource.
     */
    synchronized static public String toXML( int options ) {
        StringBuffer sb = new StringBuffer();
        Date lc = new Date(mLastCleared);
        sb.append("<javarpcinfo ")
            .append(" last-cleared=\"").append(lc).append("\"")
            .append(">");
        {
            toXML(sb, "session", mSessionPrototypes, mSessionObjectsCounter,
                  mSessionCounter);
            toXML(sb, "webapp", mWebAppPrototypes, mWebAppObjectsCounter, null);
            toXML(sb, "static", mStaticPrototypes, null, null);

            sb.append(mJavaRPCLoad.toXML("javarpc_load"));

            if ( doXML(options, LOAD_INVOKE) ) {
                sb.append(mInvokeLoad.toXML("invoke_load"));
            }
            if ( doXML(options, LOAD_STATIC_GET_PROTO) ) {
                sb.append(mStaticProtoGetLoad.toXML("static_get_proto_load"));
            }
            if ( doXML(options, LOAD_INSTANCE_CREATE_PROTO) ) {
                sb.append(mInstanceProtoCreateLoad.toXML("instance_create_proto_load"));
            }
            if ( doXML(options, LOAD_INSTANCE_GET_PROTO) ) {
                sb.append(mInstanceProtoGetLoad.toXML("instance_get_proto_load"));
            }
            if ( doXML(options, LOAD_INSTANCE_DESTROY_PROTO) ) {
                sb.append(mInstanceProtoDestroyLoad.toXML("instance_destroy_proto_load"));
            }
            if ( doXML(options, LOAD_INSTANCE_GET_INVOKE_TARGET) ) {
                sb.append(mInstanceGetInvokeTargetLoad.toXML("instance_get_invoke_target_load"));
            }
            if ( doXML(options, LOAD_RETURN_OBJECT_ENCODE) ) {
                sb.append(mReturnObjectEncodeLoad.toXML("return_object_encode_load"));
            }
        }
        sb.append("</javarpcinfo>");
        return sb.toString();
    }



    public class EncoderData extends Data
    {
        DataEncoder mDataEncoder;
        long mSize;
        public EncoderData(DataEncoder dataEncoder) 
            throws IOException {
            mDataEncoder = dataEncoder;
            mSize = dataEncoder.getSize();
        }

        public String getMimeType() {
            return MimeType.SWF;
        }

        /**
         * @return the encoded XML
         */
        public InputStream getInputStream() 
            throws IOException {
            return mDataEncoder.getInputStream();
        }

        public long size() {
            return mSize;
        }
    }


    /**
     * A data object to hold session object.
     */
    public class ObjectData extends Data
    {
        byte[] mObject;
        public ObjectData(byte[] object) {
            mObject = object;
        }

        public String getMimeType() {
            return MimeType.SWF;
        }

        public InputStream getInputStream() 
            throws IOException {
            return new ByteArrayInputStream(mObject);
        }

        public long size() {
            return mObject.length;
        }
    }
}
